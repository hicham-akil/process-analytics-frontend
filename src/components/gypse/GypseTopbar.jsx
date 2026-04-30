import { useNavigate } from "react-router-dom";
import LivePill from "../dashboard/shared/LivePill";
import Clock from "../dashboard/shared/Clock";

export default function GypseTopbar({ connected, pulse, lastUpdate }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-5 h-14 bg-slate-950/95 border-b border-white/5 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-7 h-7 bg-cyan-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm hover:bg-cyan-300 transition-colors"
          title="Retour au dashboard JFC1"
        >
          ←
        </button>
        <div className="w-7 h-7 bg-cyan-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm">⬡</div>
        <span className="text-[13px] font-black text-cyan-400 tracking-[.15em] uppercase">
          Gypse — Analyse des Pertes
        </span>
      </div>
      <div className="flex items-center gap-4">
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
  );
}
