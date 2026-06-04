export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-surface/90 backdrop-blur-md border border-border-medium rounded-xl p-3 shadow-2xl animate-fade-slide-up">
      <div className="border-b border-border-subtle pb-1 mb-2">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[11px] font-bold text-text-secondary uppercase">
                {p.name === "cap" ? "CAP Réel" : p.name === "target" ? "Cible" : p.name}
              </span>
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
