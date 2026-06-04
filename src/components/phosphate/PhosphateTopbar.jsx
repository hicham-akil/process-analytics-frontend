import { useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, Bell } from "lucide-react";
import LivePill from "../dashboard/shared/LivePill";
import Clock from "../dashboard/shared/Clock";
import { AlertBadge } from "../dashboard/AlertPanel";

export default function PhosphateTopbar({ connected, pulse, lastUpdate, alertesCount, onToggleAlerts }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 h-[56px] bg-background-surface/80 border-b border-border-subtle sticky top-0 z-40 backdrop-blur-xl ml-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 rounded-lg bg-background-cards border border-border-subtle text-text-muted hover:text-accent-amber hover:border-accent-amber/30 transition-all group"
          title="Retour au dashboard JFC1"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <FlaskConical size={14} className="text-accent-amber" />
            <span className="text-[14px] font-bold text-text-primary tracking-tight">
              Analyse Phosphate
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
            Suivi Qualité Matière Première
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 border-r border-border-subtle pr-6 mr-2">
          <LivePill connected={connected} pulse={pulse} />
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">Dernière mise à jour</span>
              <span className="text-[11px] font-mono text-text-secondary">
                {lastUpdate.toLocaleTimeString("fr-MA")}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-3 bg-background-base/50 p-1.5 rounded-xl border border-border-subtle">
             <AlertBadge
                count={alertesCount}
                onClick={onToggleAlerts}
              />
              <div className="w-px h-4 bg-border-subtle mx-1" />
              <Clock />
          </div>
        </div>
      </div>
    </header>
  );
}
