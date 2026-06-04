import { fmt, SEUILS } from "../../config/seuils";
import { Wind, Zap, RefreshCw, AlertTriangle, Check } from "lucide-react";

const PERTE_CONFIG = [
  {
    key:       "se",
    label:     "SE",
    fullLabel: "Perte Séchage & Évaporation",
    seuil:     SEUILS.se.max,
    unit:      "%",
    icon:      Wind,
    color:     "var(--accent-cyan)",
  },
  {
    key:       "syn",
    label:     "SYN",
    fullLabel: "Perte Synthèse",
    seuil:     SEUILS.syn.max,
    unit:      "%",
    icon:      Zap,
    color:     "var(--accent-blue)",
  },
  {
    key:       "intVal",
    label:     "INT",
    fullLabel: "Perte Intermédiaire",
    seuil:     SEUILS.intVal.max,
    unit:      "%",
    icon:      RefreshCw,
    color:     "var(--accent-amber)",
  },
];

function PerteKPICard({ config, value }) {
  const isAlert = value != null && value > config.seuil;
  const Icon = config.icon;
  const progress = value != null ? Math.min((value / (config.seuil * 1.5)) * 100, 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg transition-all hover:border-border-medium group animate-fade-slide-up">
      {/* Top border status indicator */}
      <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-500 shadow-[0_2px_10px_rgba(0,0,0,0.3)]`} 
           style={{ backgroundColor: isAlert ? "var(--accent-red)" : config.color, boxShadow: `0 2px 10px ${isAlert ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}` }} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${isAlert ? "var(--accent-red)" : config.color}15`, color: isAlert ? "var(--accent-red)" : config.color }}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isAlert ? "bg-accent-red/20 text-accent-red" : "bg-accent-green/20 text-accent-green"
        }`}>
          {isAlert ? <AlertTriangle size={10} /> : <Check size={10} />}
          {isAlert ? "Hors Seuil" : "Normal"}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 text-center">
          {config.fullLabel}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold font-mono tracking-tighter ${isAlert ? "text-accent-red" : "text-text-primary"}`}>
            {value != null ? fmt(value, 4) : "—"}
          </span>
          <span className="text-text-muted text-lg font-medium">{config.unit}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span>Charge</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%`, backgroundColor: isAlert ? "var(--accent-red)" : config.color }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-muted font-bold">
          <span>Seuil: {config.seuil}%</span>
          <span className="text-text-secondary uppercase">{config.label}</span>
        </div>
      </div>
    </div>
  );
}

export default function PerteKPICards({ data }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PERTE_CONFIG.map(config => (
        <PerteKPICard key={config.key} config={config} value={data[config.key]} />
      ))}
    </div>
  );
}