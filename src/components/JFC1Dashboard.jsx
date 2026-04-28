import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

// ─── Config ──────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080/api";
const WS_URL   = "http://localhost:8080/api/ws-jfc1";
const WS_TOPIC = "/topic/indicateurs";

// ─── Seuils d'alerte ─────────────────────────────────────────────────────────
const SEUILS = {
  se:              { max: 1.5 },
  syn:             { max: 1.8 },
  intVal:          { max: 1.2 },
  rc:              { min: 0.90 },
  ri:              { min: 0.85 },
  consoH2so4:      { max: 3.2 },
  consoEauBrute:   { max: 15 },
  consoPhosphates: { max: 3.5 },
  consoVapeur:     { max: 1.2 },
};

const status = (key, val) => {
  if (val == null) return "gray";
  const s = SEUILS[key];
  if (!s) return "green";
  if (s.max != null) return val > s.max ? "amber" : "green";
  if (s.min != null) return val < s.min ? "amber" : "green";
  return "green";
};

const fmt = (v, d = 4) => v != null ? Number(v).toFixed(d) : "—";

// ─── Sub-components ──────────────────────────────────────────────────────────

function LivePill({ connected, pulse }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
      <span className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${
        connected ? "bg-emerald-400" : "bg-red-400"
      } ${pulse ? "opacity-100" : "opacity-20"}`} />
      <span className="text-[9px] font-bold tracking-widest text-emerald-400">
        {connected ? "LIVE" : "OFF"}
      </span>
    </span>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[10px] text-slate-400 font-mono tracking-wide">
      {time.toLocaleTimeString("fr-MA")} MAR
    </span>
  );
}

function SectionHead({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
        {icon} {label}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function GypseCard({ label, value, seuil }) {
  const s = value != null && value > seuil ? "amber" : "green";
  const isAmber = s === "amber";
  const pct = value != null ? Math.min((value / (seuil * 1.5)) * 100, 100) : 0;
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-900 border border-white/5 p-4 ${
      isAmber ? "border-t-2 border-t-amber-400" : "border-t-2 border-t-emerald-400"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">
          Loss {label}
        </span>
        <span className={`text-lg font-bold ${isAmber ? "text-amber-400" : "text-emerald-400"}`}>
          {isAmber ? "↑" : "↓"}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold tracking-tight font-mono ${
          isAmber ? "text-amber-400" : "text-slate-100"
        }`}>
          {fmt(value, 2)}
        </span>
        <span className="text-slate-500 font-bold text-sm">%</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
        <div className={`h-full rounded-r ${isAmber ? "bg-amber-400" : "bg-emerald-400"}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RingMeter({ value, size = 96 }) {
  const r = 15.9;
  const pct = value != null ? Math.min(value * 100, 100) : 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="#00e87a" strokeWidth="3.5"
          strokeDasharray={`${pct} 100`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-400 text-xl font-mono">
        {value != null ? `${(value * 100).toFixed(1)}%` : "—"}
      </div>
    </div>
  );
}

function YieldCard({ label, keyName, value, minSeuil }) {
  const isAmber = value != null && value < minSeuil;
  return (
    <div className={`rounded-lg bg-slate-900 border border-white/5 border-t-2 p-4 flex items-center justify-between ${
      isAmber ? "border-t-amber-400" : "border-t-emerald-400"
    }`}>
      <div>
        <h4 className="text-2xl font-bold text-slate-100 mb-0.5">{keyName}</h4>
        <p className="text-[10px] text-slate-500 tracking-wide">{label}</p>
        <div className="flex gap-2 mt-3 items-center">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide border ${
            isAmber
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}>
            {isAmber ? "Sous seuil" : "Optimal"}
          </span>
          <span className="text-[9px] text-slate-500">
            Seuil min: {(minSeuil * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <RingMeter value={value} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 border border-white/10 rounded-lg p-3 text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "cap" ? "CAP" : "Cible"}: {Number(p.value).toFixed(4)}
        </p>
      ))}
    </div>
  );
};

function ConsumptionCard({ label, value, unit, seuil }) {
  const isAmber = value != null && value > seuil;
  return (
    <div className={`rounded-lg bg-slate-900 border border-white/5 p-4 ${
      isAmber ? "border-t-2 border-t-amber-400" : "border-t-2 border-t-emerald-400"
    }`}>
      <div className={`text-lg mb-2 ${isAmber ? "text-amber-400" : "text-emerald-400"}`}>◎</div>
      <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500 mb-1.5">{label}</p>
      <p className={`text-2xl font-bold font-mono ${isAmber ? "text-amber-400" : "text-slate-100"}`}>
        {fmt(value, 2)}
      </p>
      <p className="text-[9px] text-slate-500 font-bold mt-0.5">{unit}</p>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const navItems = [
  { icon: "◉", label: "Real-time Monitor", active: true },
  { icon: "⬡", label: "Gypse Analysis" },
  { icon: "◈", label: "Yield Metrics" },
  { icon: "▣", label: "Chem Inventory" },
  { icon: "≡", label: "Historique" },
];

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function JFC1Dashboard() {
  const [indicateur, setIndicateur]   = useState(null);
  const [capHistory, setCapHistory]   = useState([]);
  const [connected, setConnected]     = useState(false);
  const [pulse, setPulse]             = useState(true);
  const [lastUpdate, setLastUpdate]   = useState(null);
  const stompRef = useRef(null);

  // Pulse ticker pour le badge LIVE quand déconnecté
  useEffect(() => {
    const id = setInterval(() => setPulse(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  // Mise à jour données + historique CAP
  const applyIndicateur = useCallback((data) => {
    setIndicateur(data);
    setLastUpdate(new Date());
    // Flash pulse
    setPulse(true);
    setTimeout(() => setPulse(false), 1000);

    if (data.cap != null) {
      const label = new Date(data.date).toLocaleTimeString("fr-MA", {
        hour: "2-digit", minute: "2-digit"
      });
      setCapHistory(prev => {
        const next = [...prev, { time: label, cap: data.cap, target: 1.0 }];
        return next.slice(-20); // garder 20 derniers points
      });
    }
  }, []);

  // Chargement initial — dernier relevé
  useEffect(() => {
    axios.get(`${API_BASE}/indicateurs/derniers`)
      .then(res => { if (res.data) applyIndicateur(res.data); })
      .catch(() => console.warn("Pas de données initiales"));
  }, [applyIndicateur]);

  // Connexion WebSocket STOMP
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(WS_TOPIC, (msg) => {
          const data = JSON.parse(msg.body);
          applyIndicateur(data);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError:  () => setConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [applyIndicateur]);

  const d = indicateur;

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">

      {/* Topbar */}
      <header className="flex items-center justify-between px-5 h-14 bg-slate-950/95 border-b border-white/5 sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-emerald-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm">
            O
          </div>
          <span className="text-[13px] font-black text-emerald-400 tracking-[.15em] uppercase">
            JFC1 — Acide Phosphorique
          </span>
        </div>
        <div className="flex items-center gap-5">
          <LivePill connected={connected} pulse={pulse} />
          <span className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
            WebSocket: {connected ? "Connecté" : "Déconnecté"}
          </span>
          {lastUpdate && (
            <span className="text-[10px] text-slate-500 hidden sm:block">
              Màj: {lastUpdate.toLocaleTimeString("fr-MA")}
            </span>
          )}
          <Clock />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <nav className="w-52 flex-shrink-0 bg-[#060d1a] border-r border-white/5 flex flex-col py-4 overflow-y-auto">
          <p className="text-[9px] font-bold tracking-[.12em] uppercase text-slate-600 px-4 mb-3">
            Navigation
          </p>
          {navItems.map((item) => (
            <button key={item.label}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold tracking-[.06em] uppercase border-l-2 transition-all text-left ${
                item.active
                  ? "text-emerald-400 border-l-emerald-400 bg-emerald-500/10"
                  : "text-slate-500 border-l-transparent hover:text-slate-300"
              }`}>
              <span className="text-sm w-4 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Statut connexion sidebar */}
          <div className="mt-6 px-4">
            <p className="text-[9px] font-bold tracking-[.12em] uppercase text-slate-600 mb-3">
              Système
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Backend</span>
                <span className={`text-[9px] font-bold ${connected ? "text-emerald-400" : "text-red-400"}`}>
                  {connected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Python</span>
                <span className="text-[9px] font-bold text-emerald-400">PUSH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">DB</span>
                <span className="text-[9px] font-bold text-emerald-400">MySQL</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-5 bg-[#060d1a]">

          {/* Pas de données */}
          {!d && (
            <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
              En attente des données Python...
            </div>
          )}

          {d && <>
            {/* Pertes Gypse */}
            <SectionHead icon="⬡" label="Pertes Gypse" />
            <div className="grid grid-cols-3 gap-3 mb-5">
              <GypseCard label="SE"  value={d.se}     seuil={SEUILS.se.max} />
              <GypseCard label="SYN" value={d.syn}    seuil={SEUILS.syn.max} />
              <GypseCard label="INT" value={d.intVal} seuil={SEUILS.intVal.max} />
            </div>

            {/* Rendements */}
            <SectionHead icon="◈" label="Rendements" />
            <div className="grid grid-cols-2 gap-3 mb-5">
              <YieldCard keyName="RC" label="Rendement Concentration"
                value={d.rc} minSeuil={SEUILS.rc.min} />
              <YieldCard keyName="RI" label="Rendement Incorporation"
                value={d.ri} minSeuil={SEUILS.ri.min} />
            </div>

            {/* CAP */}
            <SectionHead icon="◉" label="Capacité de Production (CAP)" />
            <div className="grid grid-cols-[1fr_220px] gap-3 mb-5">
              <div className="rounded-lg bg-slate-900 border border-white/5 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">
                    Tendance CAP — 20 derniers relevés
                  </span>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-0.5 bg-emerald-400 rounded" />
                      <span className="text-[9px] text-slate-500">CAP réel</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-0.5 border-t border-dashed border-slate-600" />
                      <span className="text-[9px] text-slate-500">Cible</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={capHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false} />
                    <XAxis dataKey="time"
                      tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                      axisLine={false} tickLine={false} />
                    <YAxis domain={["auto", "auto"]}
                      tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => v.toFixed(2)} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={1.0} stroke="rgba(255,255,255,.12)" strokeDasharray="4 3" />
                    <Line type="monotone" dataKey="cap" stroke="#00e87a" strokeWidth={2.5}
                      dot={{ r: 3, fill: "#00e87a", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="target" stroke="rgba(122,154,184,.3)"
                      strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* CAP KPI */}
              <div className="rounded-lg bg-slate-900 border border-white/5 border-t-2 border-t-emerald-400 p-4 flex flex-col justify-center">
                <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500 mb-2">
                  CAP Actuel
                </p>
                <p className="text-5xl font-bold text-slate-100 tracking-tight font-mono leading-none">
                  {fmt(d.cap, 4)}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-2">q54 / q29</p>
                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                  Dernière mise à jour :<br />
                  {d.date ? new Date(d.date).toLocaleString("fr-MA") : "—"}
                </p>
              </div>
            </div>

            {/* Consommations */}
            <SectionHead icon="▣" label="Consommations Spécifiques" />
            <div className="grid grid-cols-4 gap-3">
              <ConsumptionCard label="H₂SO₄"     value={d.consoH2so4}
                unit="T/T P₂O₅"    seuil={SEUILS.consoH2so4.max} />
              <ConsumptionCard label="Eau Brute"  value={d.consoEauBrute}
                unit="m³/T P₂O₅"   seuil={SEUILS.consoEauBrute.max} />
              <ConsumptionCard label="Phosphates" value={d.consoPhosphates}
                unit="T/T P₂O₅"    seuil={SEUILS.consoPhosphates.max} />
              <ConsumptionCard label="Vapeur"     value={d.consoVapeur}
                unit="T/T P₂O₅"    seuil={SEUILS.consoVapeur.max} />
            </div>
          </>}
        </main>
      </div>
    </div>
  );
}