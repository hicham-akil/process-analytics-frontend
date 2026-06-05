import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import SectionHead from "../dashboard/shared/SectionHead";
import { BarChart3 } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const p1 = payload.find(p => p.dataKey === 'v1');
    const p2 = payload.find(p => p.dataKey === 'v2');
    const delta = (p2 && p1) ? (p2.value - p1.value) : null;
    const deltaColor = delta > 0 ? 'text-accent-green' : delta < 0 ? 'text-accent-red' : 'text-text-muted';

    return (
      <div className="bg-background-surface border border-border-medium p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-mono text-text-muted mb-2 uppercase tracking-widest">T + {label} min</p>
        <div className="space-y-1.5">
          {p1 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                <span className="text-[11px] text-text-secondary">Période 1</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-text-primary">{p1.value.toFixed(3)}</span>
            </div>
          )}
          {p2 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <span className="text-[11px] text-text-secondary">Période 2</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-text-primary">{p2.value.toFixed(3)}</span>
            </div>
          )}
          {delta !== null && (
            <div className="pt-1.5 mt-1.5 border-t border-border-subtle flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-tighter">Écart (Δ)</span>
              <span className={`text-[11px] font-mono font-bold ${deltaColor}`}>
                {delta > 0 ? '+' : ''}{delta.toFixed(3)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const MetricChart = ({ title, data, unit, threshold, domain }) => (
  <div className="bg-background-base/20 border border-border-subtle rounded-xl p-4">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{title}</span>
      {unit && <span className="text-[10px] font-mono text-text-muted">{unit}</span>}
    </div>
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="offset" 
            tick={{ fill: "#475569", fontSize: 9, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={domain || ["auto", "auto"]}
            tick={{ fill: "#475569", fontSize: 9, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {threshold && (
            <ReferenceLine y={threshold} stroke="rgba(239,68,68,0.2)" strokeDasharray="3 3" />
          )}
          <Line 
            type="monotone" 
            dataKey="v1" 
            name="Période 1" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={false} 
            connectNulls 
          />
          <Line 
            type="monotone" 
            dataKey="v2" 
            name="Période 2" 
            stroke="#10b981" 
            strokeWidth={2} 
            strokeDasharray="4 4" 
            dot={false} 
            connectNulls 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default function ComparaisonChart({ data, p1Label, p2Label }) {
  if (!data) return null;

  return (
    <section className="rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <SectionHead icon={<BarChart3 size={16} />} label="Analyse comparative temporelle" />
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent-blue" />
            <span className="text-[10px] font-bold text-text-secondary uppercase">{p1Label || "Période 1"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent-green border-b border-dashed border-accent-green" style={{ borderBottomWidth: '2px' }} />
            <span className="text-[10px] font-bold text-text-secondary uppercase">{p2Label || "Période 2"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChart 
          title="Ratio Chimique (RC)" 
          data={data.rc} 
          threshold={0.95}
          domain={[0.8, 1.2]}
        />
        <MetricChart 
          title="Ratio Insoluble (RI)" 
          data={data.ri} 
          threshold={0.94}
          domain={[0.8, 1.2]}
        />
        <MetricChart 
          title="Capacité (CAP)" 
          data={data.cap} 
          unit="T/H"
        />
        <MetricChart 
          title="Acide Sulfurique (H₂SO₄)" 
          data={data.h2so4} 
          unit="T/T"
        />
      </div>
    </section>
  );
}
