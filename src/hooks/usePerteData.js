import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE } from "../config/seuils";
import { fetchDernierPerte, fetchHistoriquePerte } from "../services/perteService";

export default function usePerteData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const clientRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const formatPoint = (data) => ({
    id: data.id,
    time: data.date
      ? new Date(data.date).toLocaleTimeString()
      : new Date().toLocaleTimeString(),
    date: data.date,
    se: data.se,
    syn: data.syn,
    intVal: data.intVal,
  });

  const applyData = useCallback((data) => {
    if (!data) return;
    const point = formatPoint(data);
    setLatest(point);
    setLastUpdate(new Date());
    setPulse(true);
    setTimeout(() => setPulse(false), 500);
    setHistory(prev => {
      // Avoid duplicates by date
      const exists = prev.some(p => p.date === point.date);
      if (exists) return prev;
      return [...prev.slice(-49), point];
    });
  }, []);

  // ✅ NEW: refetch from REST — called after manual form submission
  const refetch = useCallback(async () => {
    try {
      const hist = await fetchHistoriquePerte();
      if (hist && hist.length > 0) {
        const formatted = hist.map(formatPoint);
        const sorted = [...formatted].sort((a, b) => new Date(a.date) - new Date(b.date));
        setHistory(sorted.slice(-50));
        setLatest(sorted[sorted.length - 1]);
        setLastUpdate(new Date());
      } else {
        const last = await fetchDernierPerte();
        if (last) applyData(last);
      }
    } catch (err) {
      console.error("Error refetching perte data:", err);
    }
  }, [applyData]);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const hist = await fetchHistoriquePerte();
        if (hist && hist.length > 0) {
          const formatted = hist.map(formatPoint);
          const sorted = [...formatted].sort((a, b) => new Date(a.date) - new Date(b.date));
          setHistory(sorted.slice(-50));
          setLatest(sorted[sorted.length - 1]);
          setLastUpdate(new Date());
        } else {
          const last = await fetchDernierPerte();
          if (last) applyData(last);
        }
      } catch (err) {
        console.error("Error loading perte data:", err);
      }
    };
    loadInitial();
  }, [applyData]);

  // WebSocket
  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws-jfc1`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        client.subscribe("/topic/input/perte", (message) => {
          try {
            applyData(JSON.parse(message.body));
          } catch (e) {
            console.error("WS Perte parse error:", e);
          }
        });

        client.subscribe("/topic/perte", (message) => {
          try {
            applyData(JSON.parse(message.body));
          } catch (e) {
            console.error("WS Perte (fallback) parse error:", e);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [applyData]);

  const stats = {
    se:     computeStats(history, "se"),
    syn:    computeStats(history, "syn"),
    intVal: computeStats(history, "intVal"),
  };

  // ✅ refetch is now exported
  return { latest, history, connected, pulse, lastUpdate, stats, refetch };
}

function computeStats(history, key) {
  const values = history.map(h => h[key]).filter(v => v != null && !isNaN(v));
  if (!values.length) return { min: null, max: null, avg: null, count: 0 };
  return {
    min:   Math.min(...values),
    max:   Math.max(...values),
    avg:   values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
  };
}