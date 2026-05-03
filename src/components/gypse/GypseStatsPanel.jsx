import { SEUILS, fmt } from "../../config/seuils";

const METRIC_CONFIG = [
  { keyA: "seA",  keyB: "seB",  label: "SE",  color: "cyan",   seuil: SEUILS.se.max },
  { keyA: "synA", keyB: "synB", label: "SYN", color: "violet", seuil: SEUILS.syn.max },
  { keyA: "intA", keyB: "intB", label: "INT", color: "amber",  seuil: SEUILS.intVal.max },
];

const COLOR_MAP = {
  cyan:   { text: "text-cyan-400",   bg: "bg-cyan-400",   border: "border-cyan-500/20", bgLight: "bg-cyan-500/10" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-500/20", bgLight: "bg-violet-500/10" },
  amber:  { text: "text-amber-400",  bg: "bg-amber-400",  border: "border-amber-500/20", bgLight: "bg-amber-500/10" },
};

function StatRow({ label, valueA, valueB, color }) {
  const c = COLOR_MAP[color];
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="flex gap-4">
        <span className={`text-[10px] font-bold font-mono ${valueA != null ? c.text : "text-slate-600"}`}>
          A: {fmt(valueA)}
        </span>
        <span className={`text-[10px] font-bold font-mono ${valueB != null ? c.text : "text-slate-600"}`}>
          B: {fmt(valueB)}
        </span>
      </div>
    </div>
  );
}

export default function GypseStatsPanel({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {METRIC_CONFIG.map(({ keyA, keyB, label, color, seuil }) => {
        const sA = stats[keyA] || {};
        const sB = stats[keyB] || {};
        const c = COLOR_MAP[color];
        return (
          <div key={label} className="rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
              <span className={`text-xs font-black tracking-wider ${c.text}`}>{label}</span>
              <span className="text-[9px] text-slate-600 ml-auto font-mono">{sA.count || 0} pts</span>
            </div>

            <div className="space-y-0.5 border-t border-white/5 pt-3">
              <StatRow label="Minimum" valueA={sA.min} valueB={sB.min} color={color} />
              <StatRow label="Maximum" valueA={sA.max} valueB={sB.max} color={color} />
              <StatRow label="Moyenne" valueA={sA.avg} valueB={sB.avg} color={color} />
              <div className="border-t border-white/5 mt-2 pt-2 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Seuil Max</span>
                <span className={`text-[10px] font-bold font-mono text-slate-300`}>{seuil}</span>
              </div>
            </div>

            <div className="mt-4">
              {sA.avg != null || sB.avg != null ? (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] font-bold ${
                  (sA.avg > seuil || sB.avg > seuil)
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  <span>{(sA.avg > seuil || sB.avg > seuil) ? "⚠" : "✓"}</span>
                  <span>{(sA.avg > seuil || sB.avg > seuil) ? "Moyenne hors seuil" : "Moyenne dans la norme"}</span>
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
