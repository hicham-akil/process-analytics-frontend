import { SEUILS, fmt } from "../../config/seuils";
import { Wind, Zap, RefreshCw } from "lucide-react";

const GYPSE_CONFIG = [
  { key: "se",     label: "SE",  fullLabel: "Perte Séchage & Évaporation", seuil: SEUILS.se.max,     unit: "%", icon: Wind },
  { key: "syn",    label: "SYN", fullLabel: "Perte Synthèse",              seuil: SEUILS.syn.max,    unit: "%", icon: Zap },
  { key: "intVal", label: "INT", fullLabel: "Perte Intermédiaire",         seuil: SEUILS.intVal.max, unit: "%", icon: RefreshCw },
];

function GypseKPICard({ config, value }) {
  const isAlert = value != null && value > config.seuil;
  const Icon = config.icon;
  const progress = value != null ? Math.min((value / (config.seuil * 1.5)) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg transition-all hover:border-border-medium group animate-fade-slide-up">
      {/* Top border status indicator */}
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAlert ? "bg-accent-red shadow-[0_2px_10px_rgba(239,68,68,0.3)]" : "bg-accent-cyan shadow-[0_2px_10px_rgba(6,182,212,0.3)]"
      }`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isAlert ? "bg-accent-red/10 text-accent-red" : "bg-accent-cyan/10 text-accent-cyan"}`}>
          <Icon size={18} />
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isAlert ? "bg-accent-red/20 text-accent-red" : "bg-accent-cyan/20 text-accent-cyan"
        }`}>
          {isAlert ? "Hors Seuil" : "Normal"}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{config.fullLabel}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold font-mono tracking-tighter ${isAlert ? "text-accent-red" : "text-text-primary"}`}>
            {value != null ? fmt(value) : "—"}
          </span>
          <span className="text-text-muted text-lg font-medium">{config.unit}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span>Surcharge</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isAlert ? "bg-accent-red" : "bg-accent-cyan"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <span>Limite: {config.seuil}{config.unit}</span>
          <span className="font-bold text-text-secondary uppercase">{config.label}</span>
        </div>
      </div>
    </div>
  );
}

export default function GypseKPICards({ data }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {GYPSE_CONFIG.map(config => (
        <GypseKPICard
          key={config.label}
          config={config}
          value={data[config.key]}
        />
      ))}
    </div>
  );
}
