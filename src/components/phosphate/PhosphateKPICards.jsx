import { fmt, SEUILS } from "../../config/seuils";

function PhosphateKPICard({ label, value, unit, seuil, suffix = "" }) {
  const isAlert = seuil && (seuil.min ? value < seuil.min : value > seuil.max);
  const colorClass = isAlert ? "text-amber-400" : "text-sky-400";
  const borderClass = isAlert ? "border-t-amber-400" : "border-t-sky-400";

  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-900 border border-white/5 p-4 border-t-2 ${borderClass}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">{label}</span>
        {isAlert && <span className="text-amber-400 text-xs font-bold">⚠️</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold tracking-tight font-mono ${colorClass}`}>
          {fmt(value, 2)}
        </span>
        <span className="text-slate-500 font-bold text-sm">{unit}</span>
      </div>
      <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-wider">{suffix}</p>
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
        suffix="Indicateur de concentration"
      />
      <PhosphateKPICard
        label="CaO Phosphate"
        value={data.caoPhosphate}
        unit="%"
        seuil={null}
        suffix="Teneur en chaux"
      />
      <PhosphateKPICard
        label="Quantité Phosphate"
        value={data.qPhosphate}
        unit="T"
        seuil={null}
        suffix="Masse totale injectée"
      />
    </div>
  );
}
