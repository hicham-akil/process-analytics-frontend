export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 border border-white/10 rounded-lg p-3 text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "cap" ? "CAP" : "Cible"}: {Number(p.value).toFixed(4)}
        </p>
      ))}
    </div>
  );
}
