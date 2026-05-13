import { useNavigate, useLocation } from "react-router-dom";

const DASHBOARDS = [
  { icon: "◉", label: "Moniteur JFC1",      path: "/" },
  { icon: "✍", label: "Saisie Pertes",      path: "/perte" },
  { icon: "⬡", label: "Analyse Gypse",      path: "/gypse" },
  { icon: "⊕", label: "Analyse Phosphate",  path: "/phosphate" },
  { icon: "⊞", label: "Analyse Production", path: "/production" },
  { icon: "◷", label: "Historique JFC1",    path: "/historique" },
];

export default function Sidebar({ alertesCount, connected, onToggleAlerts }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav className="w-52 flex-shrink-0 bg-[#060d1a] border-r border-white/5 flex flex-col py-4 overflow-y-auto">

      {/* Dashboard switcher */}
      <p className="text-[9px] font-bold tracking-[.12em] uppercase text-slate-600 px-4 mb-3">Tableaux de bord</p>
      {DASHBOARDS.map((d) => {
        const isActive = location.pathname === d.path;
        return (
          <button key={d.path}
            onClick={() => navigate(d.path)}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold tracking-[.06em] uppercase border-l-2 transition-all text-left ${
              isActive
                ? "text-emerald-400 border-l-emerald-400 bg-emerald-500/10"
                : "text-slate-500 border-l-transparent hover:text-slate-300"
            }`}>
            <span className="text-sm w-4 text-center">{d.icon}</span>
            {d.label}
          </button>
        );
      })}

      <div className="h-px bg-white/5 mx-4 my-3" />

      {/* Alertes sidebar */}
      <div className="mt-6 px-4">
        <p className="text-[9px] font-bold tracking-[.12em] uppercase text-slate-600 mb-3">Alertes</p>
        <button
          onClick={onToggleAlerts}
          className={`w-full flex items-center justify-between py-2 px-3 rounded-lg border transition-all ${
            alertesCount > 0
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-white/5 bg-slate-800 text-slate-500"
          }`}>
          <span className="text-[9px] font-bold uppercase">Actives</span>
          <span className="text-[9px] font-bold font-mono">{alertesCount}</span>
        </button>
      </div>

      {/* Système */}
      <div className="mt-4 px-4">
        <p className="text-[9px] font-bold tracking-[.12em] uppercase text-slate-600 mb-3">Système</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Backend</span>
            <span className={`text-[9px] font-bold ${connected ? "text-emerald-400" : "text-red-400"}`}>
              {connected ? "EN LIGNE" : "HORS LIGNE"}
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
  );
}
