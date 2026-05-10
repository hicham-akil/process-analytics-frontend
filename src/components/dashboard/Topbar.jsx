import { AlertBadge } from "./AlertPanel";
import LivePill from "./shared/LivePill";
import Clock from "./shared/Clock";

export default function Topbar({ connected, pulse, lastUpdate, alertesCount, onToggleAlerts }) {
  return (
    <header className="flex items-center justify-between px-5 h-14 bg-slate-950/95 border-b border-white/5 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-emerald-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm">O</div>
        <span className="text-[13px] font-black text-emerald-400 tracking-[.15em] uppercase">
          JFC3 — Acide Phosphorique
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Badge alertes */}
        <AlertBadge
          count={alertesCount}
          onClick={onToggleAlerts}
        />
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
