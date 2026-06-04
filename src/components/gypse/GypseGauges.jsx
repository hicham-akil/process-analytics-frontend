import { SEUILS } from "../../config/seuils";
import { Gauge } from "lucide-react";

const GAUGE_CONFIG = [
  { key: "se",     label: "Soluble Eau",     short: "SE",  seuil: SEUILS.se.max,     color: "var(--accent-cyan)" },
  { key: "syn",    label: "Syngénite",       short: "SYN", seuil: SEUILS.syn.max,    color: "var(--accent-blue)" },
  { key: "intVal", label: "Insoluble",       short: "INT", seuil: SEUILS.intVal.max, color: "var(--accent-amber)" },
];

function SingleGauge({ value, seuil, color }) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size - 10;
  
  // Angle: -180deg (left) to 0deg (right)
  const maxValue = seuil * 1.5;
  const pct = value != null ? Math.min(value / maxValue, 1) : 0;
  const angle = 180 * pct - 180;
  
  const isOver = value != null && value > seuil;
  const currentColor = isOver ? "var(--accent-red)" : color;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative" style={{ width: size, height: size * 0.7 }}>
        <svg viewBox={`0 0 ${size} ${size * 0.7}`} className="w-full h-full overflow-visible">
          {/* Background track */}
          <path 
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none" 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />
          
          {/* Color zones background */}
          <path 
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`}
            fill="none" 
            stroke={currentColor} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round"
            className="opacity-10"
          />
          
          {/* Progress arc */}
          <path 
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none" 
            stroke={currentColor} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round"
            strokeDasharray={Math.PI * radius}
            strokeDashoffset={Math.PI * radius * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease" }}
          />

          {/* Needle */}
          <g transform={`rotate(${angle}, ${cx}, ${cy})`} style={{ transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            <line 
              x1={cx} y1={cy} x2={cx - radius + 5} y2={cy} 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <circle cx={cx} cy={cy} r="4" fill="white" stroke={currentColor} strokeWidth="2" />
          </g>
          
          {/* Labels */}
          <text x={cx - radius} y={cy + 15} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontWeight="bold">0</text>
          <text x={cx + radius} y={cy + 15} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontWeight="bold">{maxValue.toFixed(1)}</text>
          <text x={cx} y={cy - radius - 10} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontWeight="bold" className="uppercase">Seuil: {seuil}</text>
        </svg>

        <div className="absolute inset-x-0 bottom-2 text-center flex flex-col items-center">
          <span className="text-2xl font-bold font-mono tracking-tighter" style={{ color: currentColor }}>
            {value != null ? value.toFixed(2) : "—"}
          </span>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">%</span>
        </div>
      </div>
    </div>
  );
}

export default function GypseGauges({ data }) {
  if (!data) return null;
  return (
    <div className="rounded-2xl bg-background-cards border border-border-subtle p-6 shadow-xl animate-fade-slide-up">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
          <Gauge size={18} />
        </div>
        <h3 className="text-sm font-bold tracking-tight text-text-primary">
          Surveillance des Pertes
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-12">
        {GAUGE_CONFIG.map(g => (
          <div key={g.key} className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4 w-full px-4">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: g.color }} />
              <div className="flex-1">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{g.label}</span>
                <p className="text-[10px] text-text-muted font-bold font-mono uppercase mt-0.5">{g.short} — Temps Réel</p>
              </div>
            </div>
            <SingleGauge value={data[g.key]} seuil={g.seuil} color={g.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
