import SectionHead from "./shared/SectionHead";
import { fmt, SEUILS } from "../../config/seuils";

function GypseCard({ label, value, seuil }) {
  const isAmber = value != null && value > seuil;
  const pct = value != null ? Math.min((value / (seuil * 1.5)) * 100, 100) : 0;
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-900 border border-white/5 p-4 ${
      isAmber ? "border-t-2 border-t-amber-400" : "border-t-2 border-t-emerald-400"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Loss {label}</span>
        <span className={`text-lg font-bold ${isAmber ? "text-amber-400" : "text-emerald-400"}`}>
          {isAmber ? "↑" : "↓"}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold tracking-tight font-mono ${isAmber ? "text-amber-400" : "text-slate-100"}`}>
          {fmt(value, 2)}
        </span>
        <span className="text-slate-500 font-bold text-sm">%</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
        <div className={`h-full rounded-r ${isAmber ? "bg-amber-400" : "bg-emerald-400"}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function GypseSection({ data }) {
  return (
    <>
      <SectionHead icon="⬡" label="Pertes Gypse" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <GypseCard label="SE"  value={data.se}     seuil={SEUILS.se.max} />
        <GypseCard label="SYN" value={data.syn}    seuil={SEUILS.syn.max} />
        <GypseCard label="INT" value={data.intVal} seuil={SEUILS.intVal.max} />
      </div>
    </>
  );
}
