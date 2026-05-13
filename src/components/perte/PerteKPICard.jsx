import { fmt, SEUILS } from "../../config/seuils";

const PERTE_CONFIG = [
  {
    key:       "se",
    label:     "SE",
    fullLabel: "Perte Séchage & Évaporation",
    seuil:     SEUILS.se.max,
    unit:      "%",
    color:     "rose",
  },
  {
    key:       "syn",
    label:     "SYN",
    fullLabel: "Perte Synthèse",
    seuil:     SEUILS.syn.max,
    unit:      "%",
    color:     "violet",
  },
  {
    key:       "intVal",
    label:     "INT",
    fullLabel: "Perte Intermédiaire",
    seuil:     SEUILS.intVal.max,
    unit:      "%",
    color:     "amber",
  },
];

const COLOR_MAP = {
  rose:   { text: "text-rose-400",   border: "border-t-rose-400",   badge: "bg-rose-500/10 border-rose-500/30 text-rose-400",     ok: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", glow: "bg-rose-400" },
  violet: { text: "text-violet-400", border: "border-t-violet-400", badge: "bg-violet-500/10 border-violet-500/30 text-violet-400", ok: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", glow: "bg-violet-400" },
  amber:  { text: "text-amber-400",  border: "border-t-amber-400",  badge: "bg-amber-500/10 border-amber-500/30 text-amber-400",   ok: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", glow: "bg-amber-400" },
};

function PerteKPICard({ config, value }) {
  const isAlert = value != null && value > config.seuil;
  const c = COLOR_MAP[config.color];
  const pct = value != null ? Math.min((value / (config.seuil * 1.5)) * 100, 100) : 0;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm transition-all duration-500 hover:border-white/10 border-t-2 ${c.border}`}>
      {/* Glow blob */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 ${c.glow}`} />

      <div className="relative">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 block mb-0.5">
              {config.fullLabel}
            </span>
            <span className={`text-xs font-black tracking-wider ${c.text}`}>
              {config.label}
            </span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold border ${
            isAlert ? c.badge : c.ok
          }`}>
            {isAlert ? "↑ HORS SEUIL" : "✓ NORMAL"}
          </div>
        </div>

        {/* Value */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-white/5 mb-3">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black tracking-tight font-mono ${isAlert ? c.text : "text-slate-100"}`}>
              {fmt(value)}
            </span>
            <span className="text-slate-500 font-bold text-sm">{config.unit}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isAlert ? c.glow : "bg-emerald-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[9px] text-slate-600">0</span>
          <span className="text-[9px] text-slate-500 font-mono">
            Seuil: <span className="text-slate-300 font-bold">{config.seuil}</span> {config.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PerteKPICards({ data }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {PERTE_CONFIG.map(config => (
        <PerteKPICard key={config.key} config={config} value={data[config.key]} />
      ))}
    </div>
  );
}