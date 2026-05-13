import { SEUILS } from "../../config/seuils";

const GAUGE_CONFIG = [
  { key: "se",     label: "SE",  seuil: SEUILS.se.max,     color: "#22d3ee", track: "rgba(34,211,238,.1)" },
  { key: "syn",    label: "SYN", seuil: SEUILS.syn.max,    color: "#a78bfa", track: "rgba(167,139,250,.1)" },
  { key: "intVal", label: "INT", seuil: SEUILS.intVal.max, color: "#fbbf24", track: "rgba(251,191,36,.1)" },
];

function SingleGauge({ value, seuil, color, track, subLabel }) {
  const r = 30, cx = 50, cy = 40;
  const half = Math.PI * r;
  const pct = value != null ? Math.min(value / (seuil * 2), 1) : 0;
  const off = half * (1 - pct);
  const isOver = value != null && value > seuil;
  const c = isOver ? "#ef4444" : color;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 100, height: 60 }}>
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
            fill="none" stroke={track} strokeWidth="6" strokeLinecap="round" />
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
            fill="none" stroke={c} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={half} strokeDashoffset={off}
            style={{ transition: "stroke-dashoffset .8s ease-out, stroke .5s ease" }} />
        </svg>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className="text-sm font-black font-mono" style={{ color: c }}>
            {value != null ? value.toFixed(1) : "—"}
          </span>
        </div>
      </div>
      <span className="text-[9px] text-slate-500 font-bold uppercase">{subLabel}</span>
    </div>
  );
}

export default function GypseGauges({ data }) {
  if (!data) return null;
  return (
    <div className="rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm">
      <h3 className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 mb-5">
        ◎ Jauges Temps Réel
      </h3>
      <div className="flex flex-col gap-6">
        {GAUGE_CONFIG.map(g => (
          <div key={g.label} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div className="w-16">
              <span className="text-[10px] font-bold tracking-[.15em] uppercase" style={{ color: g.color }}>
                {g.label}
              </span>
              <div className="text-[8px] text-slate-600 font-mono mt-1 whitespace-nowrap">seuil: {g.seuil}</div>
            </div>
            <div className="flex-1 flex justify-center">
              <SingleGauge value={data[g.key]} seuil={g.seuil} color={g.color} track={g.track} subLabel="Moyenne JFC1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
