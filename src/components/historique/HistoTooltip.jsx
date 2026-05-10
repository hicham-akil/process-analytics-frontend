export default function HistoTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950/95 border border-white/10 rounded-xl p-3 text-xs font-mono backdrop-blur-sm shadow-xl min-w-[160px]">
      <p className="text-slate-400 mb-2 text-[10px] font-bold tracking-wider">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-400 text-[9px] uppercase">{p.name}</span>
          </div>
          <span className="font-bold text-slate-100">{Number(p.value).toFixed(4)}</span>
        </div>
      ))}
    </div>
  );
}
