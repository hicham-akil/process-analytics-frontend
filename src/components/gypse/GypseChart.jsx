import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SEUILS } from "../../config/seuils";

function GypseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950/95 border border-white/10 rounded-xl p-3.5 text-xs font-mono backdrop-blur-sm shadow-xl">
      <p className="text-slate-400 mb-2 text-[10px] font-bold tracking-wider">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400 uppercase text-[9px] w-16">{p.name}</span>
          <span className="font-bold text-slate-100">{Number(p.value).toFixed(4)}</span>
        </div>
      ))}
    </div>
  );
}

export default function GypseChart({ history }) {
  return (
    <div className="rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 mb-1">
            Tendance des Pertes Gypse (Ligne A & B)
          </h3>
          <p className="text-[10px] text-slate-600">Derniers relevés en temps réel</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[3px] bg-cyan-400 rounded" />
            <span className="text-[9px] text-slate-500">SE (A/B)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[3px] bg-violet-400 rounded" />
            <span className="text-[9px] text-slate-500">SYN (A/B)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[3px] bg-amber-400 rounded" />
            <span className="text-[9px] text-slate-500">INT (A/B)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip content={<GypseTooltip />} />

          <ReferenceLine y={SEUILS.se.max}     stroke="rgba(34,211,238,.2)"  strokeDasharray="4 3" label="" />
          <ReferenceLine y={SEUILS.syn.max}    stroke="rgba(167,139,250,.2)" strokeDasharray="4 3" label="" />
          <ReferenceLine y={SEUILS.intVal.max} stroke="rgba(251,191,36,.2)"  strokeDasharray="4 3" label="" />

          {/* Ligne A - Solid */}
          <Line type="monotone" dataKey="seA" name="SE Ligne A" stroke="#22d3ee" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, stroke: "#22d3ee", strokeWidth: 2, fill: "#060d1a" }} />
          <Line type="monotone" dataKey="synA" name="SYN Ligne A" stroke="#a78bfa" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, stroke: "#a78bfa", strokeWidth: 2, fill: "#060d1a" }} />
          <Line type="monotone" dataKey="intA" name="INT Ligne A" stroke="#fbbf24" strokeWidth={2.5}
            dot={false} activeDot={{ r: 5, stroke: "#fbbf24", strokeWidth: 2, fill: "#060d1a" }} />

          {/* Ligne B - Dashed */}
          <Line type="monotone" dataKey="seB" name="SE Ligne B" stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 5"
            dot={false} activeDot={{ r: 5, stroke: "#22d3ee", strokeWidth: 2, fill: "#060d1a" }} />
          <Line type="monotone" dataKey="synB" name="SYN Ligne B" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5"
            dot={false} activeDot={{ r: 5, stroke: "#a78bfa", strokeWidth: 2, fill: "#060d1a" }} />
          <Line type="monotone" dataKey="intB" name="INT Ligne B" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5"
            dot={false} activeDot={{ r: 5, stroke: "#fbbf24", strokeWidth: 2, fill: "#060d1a" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
