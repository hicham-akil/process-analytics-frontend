import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
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
            <div className="flex items-baseline gap-1">
              <span className="text-[12px] font-mono font-bold text-text-primary">
                {Number(p.value).toFixed(2)}
              </span>
              <span className="text-[9px] text-text-muted">T/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProductionChart({ history }) {
  return (
    <div className="bg-background-cards border border-border-subtle rounded-2xl p-6 shadow-xl animate-fade-slide-up">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="prod29Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="prod54Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', fontBold: 'true', textTransform: 'uppercase', paddingBottom: '30px' }}
            />
            <Area
              name="P2O5 29%"
              type="monotone"
              dataKey="qP2o529"
              stroke="var(--accent-green)"
              fillOpacity={1}
              fill="url(#prod29Gradient)"
              strokeWidth={3}
            />
            <Area
              name="P2O5 54%"
              type="monotone"
              dataKey="qP2o554"
              stroke="var(--accent-blue)"
              fillOpacity={1}
              fill="url(#prod54Gradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
