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

  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const formatPoint = (data) => {
    // Supporte les deux formats : { p2o5Phosphate, ... } ou { analysePhosphate: {...} }
    const phos = data?.analysePhosphate || data;
    return {
      time: phos.date
        ? new Date(phos.date).toLocaleTimeString("fr-MA")
        : new Date().toLocaleTimeString("fr-MA"),
      date: phos.date,
      p2o5Phosphate: phos.p2o5Phosphate,
      caoPhosphate:  phos.caoPhosphate ?? phos.caOPhosphate,
      qPhosphate:    phos.qPhosphate,
    };
  };

  const applyData = useCallback((data) => {
    if (!data) return;
    const point = formatPoint(data);
    setLatest(point);
    setLastUpdate(new Date());
    setPulse(true);
    setTimeout(() => setPulse(false), 500);
    setHistory(prev => [...prev.slice(-49), point]);
  }, []);

  // Chargement initial
  useEffect(() => {
    const load = async () => {
      try {
        const histRes = await axios.get(`${API_BASE}/ingest/phosphate/historique`).catch(() => null);
        if (histRes?.data?.length > 0) {
          const formatted = histRes.data.map(formatPoint);
          setHistory(formatted);
          setLatest(formatted[formatted.length - 1]);
          setLastUpdate(new Date());
        } else {
          const lastRes = await axios.get(`${API_BASE}/ingest/phosphate/dernier`).catch(() => null);
          if (lastRes?.data) applyData(lastRes.data);
        }
      } catch (err) {
        console.error("Erreur chargement phosphate:", err);
      }
    };
    load();
  }, [applyData]);

  // WebSocket
  useEffect(() => {
    if (clientRef.current) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // ✅ FIX: écouter /topic/input/phosphate (nouveau backend)
        client.subscribe("/topic/input/phosphate", (msg) => {
          try { applyData(JSON.parse(msg.body)); }
          catch (e) { console.error("WS phosphate parse error:", e); }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError:  () => setConnected(false),
    });
    client.activate();
    clientRef.current = client;
    return () => { clientRef.current?.deactivate(); clientRef.current = null; };
  }, [applyData]);

  const stats = {
    p2o5Phosphate: computeStats(history, "p2o5Phosphate"),
    caoPhosphate:  computeStats(history, "caoPhosphate"),
    qPhosphate:    computeStats(history, "qPhosphate"),
  };

  return { latest, history, connected, pulse, lastUpdate, stats };
}

function computeStats(history, key) {
  const values = history.map(h => h[key]).filter(v => v != null && !isNaN(v));
  if (!values.length) return { min: null, max: null, avg: null, count: 0 };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
  };
}