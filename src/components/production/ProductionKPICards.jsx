import { fmt } from "../../config/seuils";

function ProductionKPICard({ label, value, unit, colorClass, borderClass, suffix }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-900 border border-white/5 p-4 border-t-2 ${borderClass}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold tracking-tight font-mono ${colorClass}`}>
          {fmt(value)}
        </span>
        <span className="text-slate-500 font-bold text-sm">{unit}</span>
      </div>
      <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-wider">{suffix}</p>
    </div>
  );
}

export default function ProductionKPICards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProductionKPICard
        label="Production P₂O₅ 29%"
        value={data.qP2o529}
        unit="T/h"
        colorClass="text-emerald-400"
        borderClass="border-t-emerald-400"
        suffix="Débit de production 29%"
      />
      <ProductionKPICard
        label="Production P₂O₅ 54%"
        value={data.qP2o554}
        unit="T/h"
        colorClass="text-sky-400"
        borderClass="border-t-sky-400"
        suffix="Débit de production 54%"
      />
    </div>
  );
}
