import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_BASE } from "../config/seuils";

export default function useGypseData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const clientRef = useRef(null);

  // ✅ pulse animation
  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  // ✅ normalize data
  const formatPoint = (data) => ({
    time: data.date
      ? new Date(data.date).toLocaleTimeString()
      : new Date().toLocaleTimeString(),
    date: data.date,
    seA: data.seA,
    seB: data.seB,
    synA: data.synA,
    synB: data.synB,
    intA: data.intA,
    intB: data.intB,
    p2o5GypseA: data.p2o5GypseA,
    p2o5GypseB: data.p2o5GypseB,
    caOGypseA: data.caOGypseA,
    caOGypseB: data.caOGypseB,
  });

  const applyData = useCallback((data) => {
    if (!data) return;

    const point = formatPoint(data);

    setLatest(point);
    setLastUpdate(new Date());

    setPulse(true);
    setTimeout(() => setPulse(false), 500);

    setHistory(prev => [...prev.slice(-49), point]); // keep last 50
  }, []);

  // ✅ LOAD historique + fallback dernier
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1️⃣ historique
        const histRes = await axios.get(`${API_BASE}/ingest/gypse/historique`);

        if (histRes.data && histRes.data.length > 0) {
          const formatted = histRes.data.map(formatPoint);

          setHistory(formatted);

          const last = formatted[formatted.length - 1];
          setLatest(last);
          setLastUpdate(new Date());
        } else {
          // 2️⃣ fallback dernier
          const lastRes = await axios.get(`${API_BASE}/ingest/gypse/dernier`);
          if (lastRes.data) {
            applyData(lastRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    fetchInitialData();
  }, [applyData]);

  // ✅ WEBSOCKET
  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws-jfc1`),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe("/topic/input/gypse", (message) => {
          try {
            const data = JSON.parse(message.body);
            applyData(data);
          } catch (e) {
            console.error("WS parse error:", e);
          }
        });
      },

      onDisconnect: () => setConnected(false),

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
      },
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

  // ✅ stats
  const stats = {
    seA: computeStats(history, "seA"),
    seB: computeStats(history, "seB"),
    synA: computeStats(history, "synA"),
    synB: computeStats(history, "synB"),
    intA: computeStats(history, "intA"),
    intB: computeStats(history, "intB"),
  };

  return { latest, history, connected, pulse, lastUpdate, stats };
}

// ✅ stats helper
function computeStats(history, key) {
  const values = history
    .map(h => h[key])
    .filter(v => v != null && !isNaN(v));

  if (!values.length) {
    return { min: null, max: null, avg: null, count: 0 };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
  };
}