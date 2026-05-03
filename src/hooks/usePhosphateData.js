import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_BASE, WS_URL } from "../config/seuils";

export default function usePhosphateData() {
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
  const formatPoint = (data) => {
    const phos = data.analysePhosphate || data;
    return {
      time: phos.date
        ? new Date(phos.date).toLocaleTimeString()
        : new Date().toLocaleTimeString(),
      date: phos.date,
      p2o5Phosphate: phos.p2o5Phosphate,
      caoPhosphate: phos.caoPhosphate,
      qPhosphate: phos.qPhosphate,
    };
  };

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
        const histRes = await axios.get(`${API_BASE}/ingest/phosphate/historique`).catch(() => null);

        if (histRes && histRes.data && histRes.data.length > 0) {
          const formatted = histRes.data.map(formatPoint);
          setHistory(formatted);
          const last = formatted[formatted.length - 1];
          setLatest(last);
          setLastUpdate(new Date());
        } else {
          // 2️⃣ fallback dernier
          const lastRes = await axios.get(`${API_BASE}/ingest/phosphate/dernier`).catch(() => null);
          if (lastRes && lastRes.data) {
            applyData(lastRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading initial phosphate data:", err);
      }
    };

    fetchInitialData();
  }, [applyData]);

  // ✅ WEBSOCKET
  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe("/topic/phosphate", (message) => {
          try {
            const data = JSON.parse(message.body);
            applyData(data);
          } catch (e) {
            console.error("WS Phosphate parse error:", e);
          }
        });
      },

      onDisconnect: () => setConnected(false),

      onStompError: (frame) => {
        console.error("STOMP Phosphate error:", frame);
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
    p2o5Phosphate: computeStats(history, "p2o5Phosphate"),
    caoPhosphate: computeStats(history, "caoPhosphate"),
    qPhosphate: computeStats(history, "qPhosphate"),
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
