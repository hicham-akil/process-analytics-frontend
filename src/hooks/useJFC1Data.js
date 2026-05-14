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

  const [alertes, setAlertes]               = useState([]);
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  const stompRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const applyIndicateur = useCallback((data) => {
    if (!data) return;

    // Normalize — backend may send camelCase or snake_case depending on path
    const normalized = {
      id:               data.id,
      date:             data.date,
      rc:               data.rc               ?? data.RC               ?? null,
      ri:               data.ri               ?? data.RI               ?? null,
      cap:              data.cap              ?? data.CAP              ?? null,
      consoH2so4:       data.consoH2so4       ?? data.conso_h2so4      ?? null,
      consoEauBrute:    data.consoEauBrute    ?? data.conso_eau_brute  ?? null,
      consoPhosphates:  data.consoPhosphates  ?? data.conso_phosphates ?? null,
      consoVapeur:      data.consoVapeur      ?? data.conso_vapeur     ?? null,
    };

    console.debug("[JFC1] applyIndicateur →", normalized);

    setIndicateur(normalized);
    setLastUpdate(new Date());
    setPulse(true);
    setTimeout(() => setPulse(false), 1000);

    if (normalized.cap != null) {
      const label = new Date(normalized.date).toLocaleTimeString("fr-MA", {
        hour: "2-digit", minute: "2-digit",
      });
      setCapHistory(prev => [
        ...prev,
        { time: label, cap: normalized.cap, target: 1.0 },
      ].slice(-20));
    }
  }, []);

  // Initial load
  useEffect(() => {
    axios.get(`${API_BASE}/indicateurs/derniers`)
      .then(res => {
        console.debug("[JFC1] REST /indicateurs/derniers →", res.data);
        if (res.data) applyIndicateur(res.data);
      })
      .catch(err => console.error("[JFC1] Failed to load last indicateur:", err));

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

        client.subscribe("/topic/indicateurs", (msg) => {
          const data = JSON.parse(msg.body);
          console.debug("[JFC1] WS /topic/indicateurs →", data);
          applyIndicateur(data);
        });

        client.subscribe("/topic/alertes", (msg) => {
          const nouvellesAlertes = JSON.parse(msg.body);
          setAlertes(prev => {
            const ids = new Set(prev.map(a => a.id));
            const nouvelles = nouvellesAlertes.filter(a => !ids.has(a.id));
            return [...nouvelles, ...prev].slice(0, 50);
          });
          setShowAlertPanel(true);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError:  () => setConnected(false),
    });

    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [applyIndicateur]);

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