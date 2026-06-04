import { fmt, SEUILS } from "../../config/seuils";
import { FlaskConical, Beaker, Weight } from "lucide-react";

function PhosphateKPICard({ label, value, unit, seuil, icon: Icon }) {
  const isAlert = seuil && (seuil.min ? value < seuil.min : value > seuil.max);
  const progress = seuil 
    ? (seuil.max 
        ? Math.min((value / (seuil.max * 1.2)) * 100, 100) 
        : Math.min((value / (seuil.min * 1.5)) * 100, 100))
    : 100;

  return (
    <div className="relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg transition-all hover:border-border-medium group animate-fade-slide-up">
      {/* Top border status indicator */}
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAlert ? "bg-accent-amber shadow-[0_2px_10px_rgba(245,158,11,0.3)]" : "bg-accent-blue shadow-[0_2px_10px_rgba(59,130,246,0.3)]"
      }`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isAlert ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-blue/10 text-accent-blue"}`}>
          <Icon size={18} />
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isAlert ? "bg-accent-amber/20 text-accent-amber" : "bg-accent-blue/20 text-accent-blue"
        }`}>
          {isAlert ? "Attention" : "Optimal"}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 truncate w-full text-center">
          {label.split(' ').slice(0, 2).join(' ')}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold font-mono tracking-tighter ${isAlert ? "text-accent-amber" : "text-text-primary"}`}>
            {value != null ? fmt(value) : "—"}
          </span>
          <span className="text-text-muted text-lg font-medium">{unit}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span>Stabilité</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isAlert ? "bg-accent-amber" : "bg-accent-blue"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <span>{seuil ? (seuil.min ? `Min: ${seuil.min}%` : `Max: ${seuil.max}%`) : "Sans limite"}</span>
          <span className="font-bold text-text-secondary uppercase">Labo</span>
        </div>
      </div>
    </div>
  );
}

export default function PhosphateKPICards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PhosphateKPICard
        label="P₂O₅ Phosphate"
        value={data.p2o5Phosphate}
        unit="%"
        seuil={SEUILS.p2o5Phosphate}
        icon={FlaskConical}
      />
      <PhosphateKPICard
        label="CaO Phosphate"
        value={data.caoPhosphate}
        unit="%"
        seuil={null}
        icon={Beaker}
      />
      <PhosphateKPICard
        label="Quantité Phosphate"
        value={data.qPhosphate}
        unit="T"
        seuil={null}
        icon={Weight}
      />
    </div>
  );
}
