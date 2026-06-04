import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SEUILS } from "../../config/seuils";

function GypseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-surface/90 backdrop-blur-md border border-border-medium rounded-xl p-3.5 shadow-2xl animate-fade-slide-up">
      <div className="border-b border-border-subtle pb-1 mb-3">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-2">
        {payload.map((p) => (
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

export default function GypseChart({ history }) {
  return (
    <div className="rounded-2xl bg-background-cards border border-border-subtle p-6 shadow-xl animate-fade-slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-text-muted">
            Tendance des Pertes
          </span>
          <p className="text-[11px] text-text-secondary mt-1">Derniers relevés (Saisie Manuelle)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
            <span className="text-[10px] font-bold text-text-muted uppercase">SE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
            <span className="text-[10px] font-bold text-text-muted uppercase">SYN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
            <span className="text-[10px] font-bold text-text-muted uppercase">INT</span>
          </div>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip content={<GypseTooltip />} />

            <ReferenceLine y={SEUILS.se.max}     stroke="rgba(6,182,212,0.1)"  strokeDasharray="4 4" />
            <ReferenceLine y={SEUILS.syn.max}    stroke="rgba(59,130,246,0.1)" strokeDasharray="4 4" />
            <ReferenceLine y={SEUILS.intVal.max} stroke="rgba(245,158,11,0.1)"  strokeDasharray="4 4" />

            <Line 
              type="monotone" 
              dataKey="se" 
              name="SE" 
              stroke="var(--accent-cyan)" 
              strokeWidth={3}
              dot={false} 
              activeDot={{ r: 6, stroke: "var(--accent-cyan)", strokeWidth: 2, fill: "#fff" }} 
            />
            <Line 
              type="monotone" 
              dataKey="syn" 
              name="SYN" 
              stroke="var(--accent-blue)" 
              strokeWidth={3}
              dot={false} 
              activeDot={{ r: 6, stroke: "var(--accent-blue)", strokeWidth: 2, fill: "#fff" }} 
            />
            <Line 
              type="monotone" 
              dataKey="intVal" 
              name="INT" 
              stroke="var(--accent-amber)" 
              strokeWidth={3}
              dot={false} 
              activeDot={{ r: 6, stroke: "var(--accent-amber)", strokeWidth: 2, fill: "#fff" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
