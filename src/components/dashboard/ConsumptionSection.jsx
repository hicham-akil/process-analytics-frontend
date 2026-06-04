import SectionHead from "./shared/SectionHead";
import { fmt, SEUILS } from "../../config/seuils";
import { Droplets, Flame, Waves, Beaker } from "lucide-react";

function ConsumptionCard({ label, value, unit, seuil, icon: Icon }) {
  const isAmber = value != null && value > seuil;
  const progress = value != null ? Math.min((value / seuil) * 100, 100) : 0;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-4 shadow-lg transition-all hover:border-border-medium animate-fade-slide-up group`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAmber ? "bg-accent-amber shadow-[0_2px_10px_rgba(245,158,11,0.3)]" : "bg-accent-green shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
      }`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-1.5 rounded-lg ${isAmber ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-green/10 text-accent-green"}`}>
          <Icon size={16} />
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
          isAmber ? "bg-accent-amber/20 text-accent-amber" : "bg-accent-green/20 text-accent-green"
        }`}>
          {isAmber ? "Limite" : "Normal"}
        </span>
      </div>

      <div className="flex flex-col items-center mb-4">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-semibold font-mono tracking-tight ${isAmber ? "text-accent-amber" : "text-text-primary"}`}>
            {fmt(value, 2)}
          </span>
          <span className="text-[10px] font-bold text-text-muted">{unit}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-1 w-full bg-background-base rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isAmber ? "bg-accent-amber" : "bg-accent-green"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-bold text-text-muted uppercase">
          <span>Seuil</span>
          <span>{fmt(seuil, 2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ConsumptionSection({ data }) {
  return (
    <div className="mb-8">
      <SectionHead icon={<Waves size={16} />} label="Consommations Spécifiques" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ConsumptionCard label="H₂SO₄"     value={data.consoH2so4}      unit="T/T P₂O₅"   seuil={SEUILS.consoH2so4.max} icon={Beaker} />
        <ConsumptionCard label="Eau Brute"  value={data.consoEauBrute}   unit="m³/T P₂O₅"  seuil={SEUILS.consoEauBrute.max} icon={Droplets} />
        <ConsumptionCard label="Phosphates" value={data.consoPhosphates} unit="T/T P₂O₅"   seuil={SEUILS.consoPhosphates.max} icon={Waves} />
        <ConsumptionCard label="Vapeur"     value={data.consoVapeur}     unit="T/T P₂O₅"   seuil={SEUILS.consoVapeur.max} icon={Flame} />
      </div>
    </div>
  );
}
