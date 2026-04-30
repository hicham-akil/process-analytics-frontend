import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { API_BASE, WS_URL } from "../config/seuils";

export default function useJFC1Data() {
  const [indicateur, setIndicateur] = useState(null);
  const [capHistory, setCapHistory] = useState([]);
  const [connected, setConnected]   = useState(false);
  const [pulse, setPulse]           = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ── Alertes state ─────────────────────────────────────────────
  const [alertes, setAlertes]           = useState([]);
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  const stompRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const applyIndicateur = useCallback((data) => {
    setIndicateur(data);
    setLastUpdate(new Date());
    setPulse(true);
    setTimeout(() => setPulse(false), 1000);
    if (data.cap != null) {
      const label = new Date(data.date).toLocaleTimeString("fr-MA", {
        hour: "2-digit", minute: "2-digit"
      });
      setCapHistory(prev => [...prev, { time: label, cap: data.cap, target: 1.0 }].slice(-20));
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    axios.get(`${API_BASE}/indicateurs/derniers`)
      .then(res => { if (res.data) applyIndicateur(res.data); })
      .catch(() => {});

    // Charger alertes actives initiales
    axios.get(`${API_BASE}/alertes/actives`)
      .then(res => setAlertes(res.data))
      .catch(() => {});
  }, [applyIndicateur]);

  // WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // Indicateurs temps réel
        client.subscribe("/topic/indicateurs", (msg) => {
          applyIndicateur(JSON.parse(msg.body));
        });

        // Alertes temps réel
        client.subscribe("/topic/alertes", (msg) => {
          const nouvellesAlertes = JSON.parse(msg.body);
          setAlertes(prev => {
            const ids = new Set(prev.map(a => a.id));
            const nouvelles = nouvellesAlertes.filter(a => !ids.has(a.id));
            return [...nouvelles, ...prev].slice(0, 50);
          });
          setShowAlertPanel(true); // ouvrir automatiquement
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [applyIndicateur]);

  // Acquitter une alerte
  const acquitter = async (id) => {
    try {
      await axios.patch(`${API_BASE}/alertes/${id}/acquitter`);
      setAlertes(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error("Erreur acquittement", e);
    }
  };

  const alertesNonAcquittees = alertes.filter(a => !a.acquittee);

  return {
    indicateur,
    capHistory,
    connected,
    pulse,
    lastUpdate,
    alertes,
    alertesNonAcquittees,
    showAlertPanel,
    setShowAlertPanel,
    acquitter,
  };
}
