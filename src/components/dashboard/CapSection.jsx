import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import SectionHead from "./shared/SectionHead";
import CustomTooltip from "./shared/CustomTooltip";
import { fmt } from "../../config/seuils";
import { Activity } from "lucide-react";

export default function CapSection({ data, capHistory }) {
  return (
    <div className="mb-8">
      <SectionHead icon={<Activity size={16} />} label="Capacité de Production (CAP)" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart area */}
        <div className="lg:col-span-2 rounded-xl bg-background-cards border border-border-subtle p-5 shadow-lg animate-fade-slide-up">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest uppercase text-text-muted">
                Tendance CAP
              </span>
              <span className="text-[11px] text-text-secondary">20 derniers relevés</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-blue" />
                <span className="text-[10px] font-bold text-text-muted uppercase">CAP réel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 border-t-2 border-dashed border-text-muted" />
                <span className="text-[10px] font-bold text-text-muted uppercase">Cible</span>
              </div>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={capHistory} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
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
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={1.0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <Line 
                  type="monotone" 
                  dataKey="cap" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#141b2d" }} 
                  activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#475569"
                  strokeWidth={2} 
                  strokeDasharray="6 6" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Card */}
        <div className="relative overflow-hidden rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg animate-fade-slide-up">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-blue shadow-[0_2px_10px_rgba(59,130,246,0.3)]" />
           
           <div className="flex items-start justify-between mb-8">
              <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
                <Activity size={20} />
              </div>
              <span className="px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue text-[10px] font-bold uppercase tracking-wider">
                En direct
              </span>
           </div>

           <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">CAP Actuel</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-text-primary tracking-tighter font-mono">
                  {fmt(data.cap, 4)}
                </span>
              </div>
              <p className="text-sm font-bold text-text-muted mt-4">Calcul: q54 / q29</p>
           </div>

           <div className="mt-auto pt-8 border-t border-border-subtle/50 w-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-text-muted uppercase">Dernier relevé</span>
                <span className="text-[11px] font-mono text-text-secondary">
                  {data.date ? new Date(data.date).toLocaleTimeString("fr-MA") : "—"}
                </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
