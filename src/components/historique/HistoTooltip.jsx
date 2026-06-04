export default function HistoTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-surface/90 backdrop-blur-md border border-border-medium rounded-xl p-4 shadow-2xl animate-fade-slide-up min-w-[200px]">
      <div className="border-b border-border-subtle pb-2 mb-3">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-2">
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[11px] font-bold text-text-secondary uppercase">{p.name}</span>
            </div>
            <span className="text-[12px] font-mono font-bold text-text-primary">
              {Number(p.value).toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
