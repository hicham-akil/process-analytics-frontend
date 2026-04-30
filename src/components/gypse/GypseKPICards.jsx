import { SEUILS, fmt } from "../../config/seuils";

const GYPSE_CONFIG = [
  { keyA: "seA",  keyB: "seB",  label: "SE",  fullLabel: "Perte Séchage & Évaporation", seuil: SEUILS.se.max,     unit: "%" },
  { keyA: "synA", keyB: "synB", label: "SYN", fullLabel: "Perte Synthèse",              seuil: SEUILS.syn.max,    unit: "%" },
  { keyA: "intA", keyB: "intB", label: "INT", fullLabel: "Perte Intermédiaire",         seuil: SEUILS.intVal.max, unit: "%" },
];

function GypseKPICard({ config, valueA, valueB }) {
  const isAmberA = valueA != null && valueA > config.seuil;
  const isAmberB = valueB != null && valueB > config.seuil;
  const isAmber = isAmberA || isAmberB;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm transition-all duration-500 hover:border-white/10 ${
      isAmber ? "border-t-2 border-t-amber-400" : "border-t-2 border-t-cyan-400"
    }`}>
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 ${
        isAmber ? "bg-amber-400" : "bg-cyan-400"
      }`} />

      <div className="relative">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 block mb-0.5">
              {config.fullLabel}
            </span>
            <span className={`text-xs font-black tracking-wider ${isAmber ? "text-amber-400" : "text-cyan-400"}`}>
              {config.label}
            </span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold ${
            isAmber
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
          }`}>
            {isAmber ? "↑ HORS SEUIL" : "✓ NORMAL"}
          </div>
        </div>

        <div className="flex gap-4 mb-3">
          <div className="flex-1 bg-slate-950/50 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">Ligne A</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black tracking-tight font-mono ${isAmberA ? "text-amber-400" : "text-slate-100"}`}>
                {fmt(valueA, 2)}
              </span>
              <span className="text-slate-500 font-bold text-xs">{config.unit}</span>
            </div>
          </div>
          <div className="flex-1 bg-slate-950/50 p-3 rounded-lg border border-white/5">
            <span className="text-[10px] text-slate-500 block mb-1">Ligne B</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black tracking-tight font-mono ${isAmberB ? "text-amber-400" : "text-slate-100"}`}>
                {fmt(valueB, 2)}
              </span>
              <span className="text-slate-500 font-bold text-xs">{config.unit}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-[9px] bg-slate-950/30 py-1.5 rounded-md border border-white/5">
          <span className="text-slate-500">
            Seuil limite: <span className="text-slate-300 font-mono font-bold">{config.seuil}</span> {config.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GypseKPICards({ data }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-3 gap-4">
      {GYPSE_CONFIG.map(config => (
        <GypseKPICard
          key={config.label}
          config={config}
          valueA={data[config.keyA]}
          valueB={data[config.keyB]}
        />
      ))}
    </div>
  );
}
