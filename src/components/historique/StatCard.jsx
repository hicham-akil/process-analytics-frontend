export default function StatCard({ label, s, unit, isMin, seuil }) {
  if (!s || s.avg == null) return (
    <div className="rounded-lg bg-slate-900 border border-white/5 p-4 flex flex-col gap-1">
      <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-600">{label}</p>
      <p className="text-2xl font-bold font-mono text-slate-700">—</p>
    </div>
  );
  const bad = isMin ? s.avg < seuil : s.avg > seuil;
  return (
    <div className={`rounded-lg bg-slate-900 border border-white/5 border-t-2 p-4 flex flex-col gap-1 ${bad ? "border-t-amber-400" : "border-t-emerald-400"}`}>
      <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">{label}</p>
      <p className={`text-2xl font-bold font-mono ${bad ? "text-amber-400" : "text-slate-100"}`}>
        {typeof s.avg === "number" ? s.avg.toFixed(4) : "—"}
        <span className="text-slate-500 text-xs font-normal ml-1">{unit}</span>
      </p>
      <div className="flex gap-3 mt-1">
        <span className="text-[9px] text-slate-500">Min <span className="text-slate-300 font-mono">{s.min?.toFixed(3) ?? "—"}</span></span>
        <span className="text-[9px] text-slate-500">Max <span className="text-slate-300 font-mono">{s.max?.toFixed(3) ?? "—"}</span></span>
      </div>
    </div>
  );
}
