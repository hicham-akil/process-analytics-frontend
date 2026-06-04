export default function StatCard({ label, s, unit, isMin, seuil }) {
  if (!s || s.avg == null) return (
    <div className="rounded-xl bg-background-cards border border-border-subtle p-5 flex flex-col gap-2 shadow-lg animate-fade-slide-up">
      <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted">{label}</p>
      <p className="text-3xl font-bold font-mono text-text-muted/30">—</p>
    </div>
  );
  
  const isAlert = isMin ? s.avg < seuil : s.avg > seuil;
  
  return (
    <div className={`relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg transition-all animate-fade-slide-up`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${
        isAlert ? "bg-accent-amber shadow-[0_2px_10px_rgba(245,158,11,0.3)]" : "bg-accent-green shadow-[0_2px_10px_rgba(16,185,129,0.3)]"
      }`} />
      
      <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted mb-2">{label}</p>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold font-mono tracking-tighter ${isAlert ? "text-accent-amber" : "text-text-primary"}`}>
          {typeof s.avg === "number" ? s.avg.toFixed(4) : "—"}
        </span>
        <span className="text-text-muted text-xs font-bold uppercase">{unit}</span>
      </div>
      
      <div className="flex gap-4 mt-4 pt-4 border-t border-border-subtle/50">
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold text-text-muted uppercase">Min</span>
          <span className="text-[11px] font-mono font-bold text-text-secondary">{s.min?.toFixed(3) ?? "—"}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] font-bold text-text-muted uppercase">Max</span>
          <span className="text-[11px] font-mono font-bold text-text-secondary">{s.max?.toFixed(3) ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
