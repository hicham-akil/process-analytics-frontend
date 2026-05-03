import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_BASE, WS_URL } from "../config/seuils";

export default function useProductionData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const clientRef = useRef(null);

  // ─────────────────────────────
  // pulse animation
  // ─────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  // ─────────────────────────────
  // FORMAT with DEBUG
  // ─────────────────────────────
  const formatPoint = (data) => {
    const prod = data?.production || data;

    console.log("⚙️ FORMAT INPUT:", data);
    console.log("⚙️ FORMAT PROD:", prod);

    const result = {
      time: prod?.date
        ? new Date(prod.date).toLocaleTimeString()
        : new Date().toLocaleTimeString(),
      date: prod?.date,
      qP2o529: prod?.qP2o529,
      qP2o554: prod?.qP2o554,
    };

    console.log("⚙️ FORMAT OUTPUT:", result);

    return result;
  };

  // ─────────────────────────────
  // APPLY DATA with DEBUG
  // ─────────────────────────────
  const applyData = useCallback((data) => {
    if (!data) return;

    console.log("🚀 APPLY DATA INPUT:", data);

    const point = formatPoint(data);

    console.log("🚀 APPLY DATA FINAL POINT:", point);

    setLatest(point);
    setLastUpdate(new Date());

    setPulse(true);
    setTimeout(() => setPulse(false), 500);

    setHistory(prev => {
      const updated = [...prev.slice(-49), point];
      console.log("📈 HISTORY UPDATED:", updated);
      return updated;
    });
  }, []);

  // ─────────────────────────────
  // LOAD INITIAL DATA with DEBUG
  // ─────────────────────────────
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const histRes = await axios
          .get(`${API_BASE}/ingest/production/historique`)
          .catch(() => null);

        console.log("📦 HISTORIQUE RAW RESPONSE:", histRes?.data);

        if (histRes && histRes.data && histRes.data.length > 0) {
          console.log("📊 HISTORIQUE COUNT:", histRes.data.length);

          const formatted = histRes.data.map(formatPoint);

          console.log("📊 HISTORIQUE FORMATTED:", formatted);

          setHistory(formatted);

          const last = formatted[formatted.length - 1];
          setLatest(last);
          setLastUpdate(new Date());
        } else {
          const lastRes = await axios
            .get(`${API_BASE}/ingest/production/dernier`)
            .catch(() => null);

          console.log("📦 DERNIER RAW RESPONSE:", lastRes?.data);

          if (lastRes && lastRes.data) {
            applyData(lastRes.data);
          }
        }
      } catch (err) {
        console.error("❌ Error loading initial production data:", err);
      }
    };

    fetchInitialData();
  }, [applyData]);

  // ─────────────────────────────
  // WEBSOCKET with DEBUG
  // ─────────────────────────────
  useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);
        console.log("🟢 WS CONNECTED");

        client.subscribe("/topic/production", (message) => {
          try {
            const data = JSON.parse(message.body);

            console.log("📡 WS RAW MESSAGE:", message.body);
            console.log("📡 WS PARSED DATA:", data);

            applyData(data);
          } catch (e) {
            console.error("❌ WS Production parse error:", e);
          }
        });
      },

      onDisconnect: () => {
        console.log("🔴 WS DISCONNECTED");
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("❌ STOMP Production error:", frame);
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

  // ─────────────────────────────
  // STATS
  // ─────────────────────────────
  const stats = {
    qP2o529: computeStats(history, "qP2o529"),
    qP2o554: computeStats(history, "qP2o554"),
  };

  return { latest, history, connected, pulse, lastUpdate, stats };
}

// ─────────────────────────────
// STATS HELPER
// ─────────────────────────────
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