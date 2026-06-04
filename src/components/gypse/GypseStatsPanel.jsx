import { SEUILS, fmt } from "../../config/seuils";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

const METRIC_CONFIG = [
  { key: "se",     label: "SE",  color: "var(--accent-cyan)",   seuil: SEUILS.se.max },
  { key: "syn",    label: "SYN", color: "var(--accent-blue)",   seuil: SEUILS.syn.max },
  { key: "intVal", label: "INT", color: "var(--accent-amber)",  seuil: SEUILS.intVal.max },
];

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
      <span className={`text-[12px] font-bold font-mono`} style={{ color: value != null ? "var(--text-primary)" : "var(--text-muted)" }}>
        {value != null ? fmt(value, 4) : "—"}
      </span>
    </div>
  );
}

export default function GypseStatsPanel({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-slide-up">
      {METRIC_CONFIG.map(({ key, label, color, seuil }) => {
        const s = stats[key] || {};
        const isAlert = s.avg != null && s.avg > seuil;
        
        return (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-background-cards border border-border-subtle p-6 shadow-xl group hover:border-border-medium transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-4 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-bold text-text-primary tracking-tight">{label}</span>
              <span className="text-[10px] font-bold text-text-muted ml-auto bg-background-base px-2 py-0.5 rounded border border-border-subtle">
                {s.count || 0} RELEVÉS
              </span>
            </div>

            <div className="space-y-1 divide-y divide-border-subtle/50">
              <StatRow label="Minimum" value={s.min} />
              <StatRow label="Maximum" value={s.max} />
              <StatRow label="Moyenne de session" value={s.avg} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Limite Critique</span>
              <span className="text-[11px] font-mono font-bold text-text-secondary">{seuil}%</span>
            </div>

            <div className="mt-6">
              {s.avg != null ? (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[11px] font-bold transition-all ${
                  isAlert
                    ? "bg-accent-red/10 border-accent-red/20 text-accent-red"
                    : "bg-accent-green/10 border-accent-green/20 text-accent-green"
                }`}>
                  {isAlert ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  <span className="uppercase tracking-wide">
                    {isAlert ? "Attention: Moyenne Élevée" : "Performance Optimale"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border-subtle bg-background-base/50 text-[11px] font-bold text-text-muted">
                  <Activity size={14} className="animate-pulse" />
                  <span className="uppercase tracking-wide">Acquisition en cours...</span>
                </div>
              )}
            </div>
            
            {/* Background decorative element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none" style={{ backgroundColor: color }} />
          </div>
        );
      })}
    </div>
  );
}
