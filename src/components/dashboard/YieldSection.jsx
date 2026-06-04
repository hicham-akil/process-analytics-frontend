import SectionHead from "./shared/SectionHead";
import { SEUILS } from "../../config/seuils";
import { TrendingUp, Target } from "lucide-react";

function YieldCard({ label, keyName, value, minSeuil, icon: Icon }) {
  const isAmber = value != null && value < minSeuil;
  const progress = value != null ? Math.min((value / 1.0) * 100, 100) : 0;
  
  return (
    <div className={`relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg transition-all hover:border-border-medium group animate-fade-slide-up`}>
      {/* Top border status indicator */}
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAmber ? "bg-accent-amber shadow-[0_2px_10px_rgba(245,158,11,0.3)]" : "bg-accent-green shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
      }`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isAmber ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-green/10 text-accent-green"}`}>
          <Icon size={18} />
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isAmber ? "bg-accent-amber/20 text-accent-amber" : "bg-accent-green/20 text-accent-green"
        }`}>
          {isAmber ? "Attention" : "Optimal"}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-semibold font-mono tracking-tighter ${isAmber ? "text-accent-amber" : "text-text-primary"}`}>
            {value != null ? (value * 100).toFixed(2) : "—"}
          </span>
          <span className="text-text-muted text-lg font-medium">%</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <span>Progression</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isAmber ? "bg-accent-amber" : "bg-accent-green"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <span>Seuil min: {(minSeuil * 100).toFixed(0)}%</span>
          <span className="font-mono">{keyName}</span>
        </div>
      </div>
    </div>
  );
}

export default function YieldSection({ data }) {
  return (
    <div className="mb-8">
      <SectionHead icon={<TrendingUp size={16} />} label="Rendements Industriels" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <YieldCard
          keyName="RC"
          label="Rendement Chimique"
          value={data.rc}
          minSeuil={SEUILS.rc.min}
          icon={Target}
        />
        <YieldCard
          keyName="RI"
          label="Rendement Industrielle"
          value={data.ri}
          minSeuil={SEUILS.ri.min}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}