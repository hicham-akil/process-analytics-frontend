import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, Bell } from "lucide-react";
import Clock from "../dashboard/shared/Clock";
import { AlertBadge } from "../dashboard/AlertPanel";

export default function HistoriqueTopbar({ alertesCount, onToggleAlerts }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-6 h-[56px] bg-background-surface/80 border-b border-border-subtle sticky top-0 z-40 backdrop-blur-xl ml-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-1.5 rounded-lg bg-background-cards border border-border-subtle text-text-muted hover:text-text-secondary hover:border-border-medium transition-all group"
          title="Retour au dashboard JFC1"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <History size={14} className="text-text-secondary" />
            <span className="text-[14px] font-bold text-text-primary tracking-tight">
              Historique JFC1
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
            Consultation des Archives
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-background-base/50 p-1.5 rounded-xl border border-border-subtle">
           <AlertBadge
              count={alertesCount}
              onClick={onToggleAlerts}
            />
            <div className="w-px h-4 bg-border-subtle mx-1" />
            <Clock />
        </div>
      </div>
    </header>
  );
}
