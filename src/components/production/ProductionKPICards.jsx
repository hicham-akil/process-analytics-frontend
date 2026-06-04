import { fmt } from "../../config/seuils";
import { Factory, Activity } from "lucide-react";

function ProductionKPICard({ label, value, unit, accentColor, icon: Icon, suffix }) {
  const progress = value != null ? Math.min((value / 15) * 100, 100) : 0; // Assuming 15 T/h as a max for progress bar

  return (
    <div className="relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg transition-all hover:border-border-medium group animate-fade-slide-up">
      {/* Top border status indicator */}
      <div className={`absolute top-0 left-0 w-full h-[2px] shadow-[0_2px_10px_rgba(59,130,246,0.3)]`} 
           style={{ backgroundColor: accentColor }} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
          <Icon size={20} />
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}>
          En Ligne
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 text-center">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold font-mono tracking-tighter text-text-primary" style={{ color: accentColor }}>
            {value != null ? fmt(value, 2) : "—"}
          </span>
          <span className="text-text-muted text-lg font-medium">{unit}</span>
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
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <span className="font-bold">{suffix}</span>
          <span className="font-bold text-text-secondary uppercase">Flux</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductionKPICards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProductionKPICard
        label="Production P₂O₅ 29%"
        value={data.qP2o529}
        unit="T/h"
        accentColor="var(--accent-green)"
        icon={Factory}
        suffix="Débit de production 29%"
      />
      <ProductionKPICard
        label="Production P₂O₅ 54%"
        value={data.qP2o554}
        unit="T/h"
        accentColor="var(--accent-blue)"
        icon={Activity}
        suffix="Débit de production 54%"
      />
    </div>
  );
}
