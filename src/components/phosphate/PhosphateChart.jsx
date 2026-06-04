import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
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
              {Number(p.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PhosphateChart({ history }) {
  return (
    <div className="bg-background-cards border border-border-subtle rounded-2xl p-6 shadow-xl animate-fade-slide-up">
      <div className="h-[300px] w-full">
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
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '30px', color: '#94a3b8' }}
            />
            <Line
              name="P2O5"
              type="monotone"
              dataKey="p2o5Phosphate"
              stroke="var(--accent-cyan)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: "var(--accent-cyan)", strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              name="CaO"
              type="monotone"
              dataKey="caoPhosphate"
              stroke="var(--text-muted)"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
              activeDot={{ r: 6, stroke: "var(--text-muted)", strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
