import { SEUILS, fmt } from "../../config/seuils";

const METRIC_CONFIG = [
  { key: "se",     label: "SE",  color: "cyan",   seuil: SEUILS.se.max },
  { key: "syn",    label: "SYN", color: "violet", seuil: SEUILS.syn.max },
  { key: "intVal", label: "INT", color: "amber",  seuil: SEUILS.intVal.max },
];

const COLOR_MAP = {
  cyan:   { text: "text-cyan-400",   bg: "bg-cyan-400",   border: "border-cyan-500/20", bgLight: "bg-cyan-500/10" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-500/20", bgLight: "bg-violet-500/10" },
  amber:  { text: "text-amber-400",  bg: "bg-amber-400",  border: "border-amber-500/20", bgLight: "bg-amber-500/10" },
};

function StatRow({ label, value, color }) {
  const c = COLOR_MAP[color];
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className={`text-[10px] font-bold font-mono ${value != null ? c.text : "text-slate-600"}`}>
        {fmt(value)}
      </span>
    </div>
  );
}

export default function GypseStatsPanel({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {METRIC_CONFIG.map(({ key, label, color, seuil }) => {
        const s = stats[key] || {};
        const c = COLOR_MAP[color];
        return (
          <div key={label} className="rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
              <span className={`text-xs font-black tracking-wider ${c.text}`}>{label}</span>
              <span className="text-[9px] text-slate-600 ml-auto font-mono">{s.count || 0} pts</span>
            </div>

            <div className="space-y-0.5 border-t border-white/5 pt-3">
              <StatRow label="Minimum" value={s.min} color={color} />
              <StatRow label="Maximum" value={s.max} color={color} />
              <StatRow label="Moyenne" value={s.avg} color={color} />
              <div className="border-t border-white/5 mt-2 pt-2 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Seuil Max</span>
                <span className={`text-[10px] font-bold font-mono text-slate-300`}>{seuil}</span>
              </div>
            </div>

            <div className="mt-4">
              {s.avg != null ? (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] font-bold ${
                  s.avg > seuil
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  <span>{s.avg > seuil ? "⚠" : "✓"}</span>
                  <span>{s.avg > seuil ? "Moyenne hors seuil" : "Moyenne dans la norme"}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-slate-800/50 text-[9px] font-bold text-slate-600">
                  <span>◌</span>
                  <span>En attente de données</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
