import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_BASE, WS_URL } from "../config/seuils";

export default function usePerteData() {
  const [latest, setLatest]       = useState(null);
  const [history, setHistory]     = useState([]);
  const [connected, setConnected] = useState(false);
  const [pulse, setPulse]         = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const clientRef = useRef(null);

  // pulse animation
  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const formatPoint = (data) => ({
    time: data.date
      ? new Date(data.date).toLocaleTimeString("fr-MA")
      : new Date().toLocaleTimeString("fr-MA"),
    date:   data.date,
    se:     data.se,
    syn:    data.syn,
    intVal: data.intVal,
  });

  const applyData = useCallback((data) => {
    if (!data) return;
    const point = formatPoint(data);
    setLatest(point);
    setLastUpdate(new Date());
    setPulse(true);
    setTimeout(() => setPulse(false), 500);
    setHistory(prev => [...prev.slice(-49), point]);
  }, []);

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const histRes = await axios
          .get(`${API_BASE}/ingest/perte/historique`)
          .catch(() => null);

        if (histRes && histRes.data && histRes.data.length > 0) {
          const formatted = histRes.data.map(formatPoint);
          setHistory(formatted);
          setLatest(formatted[formatted.length - 1]);
          setLastUpdate(new Date());
        } else {
          const lastRes = await axios
            .get(`${API_BASE}/ingest/perte/dernier`)
            .catch(() => null);
          if (lastRes && lastRes.data) applyData(lastRes.data);
        }
      } catch (err) {
        console.error("Error loading initial perte data:", err);
      }
    };

    fetchInitialData();
  }, [applyData]);

  // WebSocket
  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/topic/perte", (message) => {
          try {
            const data = JSON.parse(message.body);
            applyData(data);
          } catch (e) {
            console.error("WS Perte parse error:", e);
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

  return { latest, history, connected, pulse, lastUpdate, stats };
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