// ─── Config ──────────────────────────────────────────────────────────────────
export const API_BASE = "http://localhost:8080/api";
export const WS_URL   = "http://localhost:8080/api/ws-jfc1";

export const SEUILS = {
  se:              { max: 1.5 },
  syn:             { max: 1.8 },
  intVal:          { max: 1.2 },
  rc:              { min: 0.90 },
  ri:              { min: 0.85 },
  consoH2so4:      { max: 3.2 },
  consoEauBrute:   { max: 15 },
  consoPhosphates: { max: 3.5 },
  consoVapeur:     { max: 1.2 },
  p2o5Gypse:       { max: 2.5 },
  caOGypse:        { min: 20, max: 30 },
  p2o5Phosphate:   { min: 28 },
};

export const fmt = (v, d = 4) => v != null ? Number(v).toFixed(d) : "—";

export const navItems = [
  { icon: "◉", label: "Real-time Monitor", active: true },
  { icon: "⬡", label: "Gypse Analysis" },
  { icon: "◈", label: "Yield Metrics" },
  { icon: "▣", label: "Chem Inventory" },
  { icon: "⊕", label: "Phosphate Analysis" },
  { icon: "≡", label: "Historique" },
];
