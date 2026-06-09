import SectionHead from "./shared/SectionHead";
import { fmt } from "../../config/seuils";
import { useSeuils } from "../../context/SeuilsContext";
import { Hexagon, ArrowDown, ArrowUp } from "lucide-react";

function GypseCard({ label, value, seuil }) {
  const isAmber = value != null && value > seuil;
  const progress = value != null ? Math.min((value / (seuil * 1.2)) * 100, 100) : 0;
  
  return (
    <div className={`relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg transition-all hover:border-border-medium animate-fade-slide-up group`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAmber ? "bg-accent-amber shadow-[0_2px_10px_rgba(245,158,11,0.3)]" : "bg-accent-green shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
      }`} />
      
      <div className="flex items-start justify-between mb-6">
        <div className={`p-2 rounded-lg ${isAmber ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-green/10 text-accent-green"}`}>
          {isAmber ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          isAmber ? "bg-accent-amber/20 text-accent-amber" : "bg-accent-green/20 text-accent-green"
        }`}>
          {isAmber ? "Élevé" : "Normal"}
        </span>
      </div>

      <div className="flex flex-col items-center mb-6">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Pertes {label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-semibold font-mono tracking-tighter ${isAmber ? "text-accent-amber" : "text-text-primary"}`}>
            {fmt(value, 4)}
          </span>
          <span className="text-text-muted text-sm font-medium">%</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isAmber ? "bg-accent-amber" : "bg-accent-green"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase tracking-wider">
          <span>Seuil critique</span>
          <span>{fmt(seuil, 2)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function GypseSection({ data }) {
  const { seuils } = useSeuils();

  return (
    <div className="mb-8">
      <SectionHead icon={<Hexagon size={16} />} label="Analyse Pertes Gypse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GypseCard label="SE"  value={data.se}     seuil={seuils.se.max} />
        <GypseCard label="SYN" value={data.syn}    seuil={seuils.syn.max} />
        <GypseCard label="INT" value={data.intVal} seuil={seuils.intVal.max} />
      </div>
    </div>
  );
}
