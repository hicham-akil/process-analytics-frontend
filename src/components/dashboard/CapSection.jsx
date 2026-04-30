import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import SectionHead from "./shared/SectionHead";
import CustomTooltip from "./shared/CustomTooltip";
import { fmt } from "../../config/seuils";

export default function CapSection({ data, capHistory }) {
  return (
    <>
      <SectionHead icon="◉" label="Capacité de Production (CAP)" />
      <div className="grid grid-cols-[1fr_220px] gap-3 mb-5">
        <div className="rounded-lg bg-slate-900 border border-white/5 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">
              Tendance CAP — 20 derniers relevés
            </span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-emerald-400 rounded" />
                <span className="text-[9px] text-slate-500">CAP réel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 border-t border-dashed border-slate-600" />
                <span className="text-[9px] text-slate-500">Cible</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={capHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                axisLine={false} tickLine={false} />
              <YAxis domain={["auto", "auto"]} tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                axisLine={false} tickLine={false} tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={1.0} stroke="rgba(255,255,255,.12)" strokeDasharray="4 3" />
              <Line type="monotone" dataKey="cap" stroke="#00e87a" strokeWidth={2.5}
                dot={{ r: 3, fill: "#00e87a", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" stroke="rgba(122,154,184,.3)"
                strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-slate-900 border border-white/5 border-t-2 border-t-emerald-400 p-4 flex flex-col justify-center">
          <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500 mb-2">CAP Actuel</p>
          <p className="text-5xl font-bold text-slate-100 tracking-tight font-mono leading-none">{fmt(data.cap, 4)}</p>
          <p className="text-xs font-bold text-slate-400 mt-2">q54 / q29</p>
          <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
            Dernière mise à jour :<br />
            {data.date ? new Date(data.date).toLocaleString("fr-MA") : "—"}
          </p>
        </div>
      </div>
    </>
  );
}
