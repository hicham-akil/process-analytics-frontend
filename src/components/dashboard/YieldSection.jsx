import SectionHead from "./shared/SectionHead";
import { SEUILS } from "../../config/seuils";

function RingMeter({ value, minSeuil, size = 96 }) {
  const r = 15.9;

  // value is in 0-1 range (e.g. 0.8458)
  // Fill the ring relative to the seuil: 100% = seuil, scale beyond it
  const pct = value != null ? Math.min((value / 1.0) * 100, 100) : 0;

  const isAmber = value != null && value < minSeuil;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke={isAmber ? "#fbbf24" : "#00e87a"}
          strokeWidth="3.5"
          strokeDasharray={`${pct} 100`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center font-bold text-xl font-mono"
        style={{ color: isAmber ? "#fbbf24" : "#00e87a" }}>
        {value != null ? value.toFixed(4) : "—"}
      </div>
    </div>
  );
}

function YieldCard({ label, keyName, value, minSeuil }) {
  const isAmber = value != null && value < minSeuil;
  return (
    <div className={`rounded-lg bg-slate-900 border border-white/5 border-t-2 p-4 flex items-center justify-between ${
      isAmber ? "border-t-amber-400" : "border-t-emerald-400"
    }`}>
      <div>
        <h4 className="text-2xl font-bold text-slate-100 mb-0.5">{keyName}</h4>
        <p className="text-[10px] text-slate-500 tracking-wide">{label}</p>
        <div className="flex gap-2 mt-3 items-center">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide border ${
            isAmber
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}>
            {isAmber ? "Sous seuil" : "Optimal"}
          </span>
          <span className="text-[9px] text-slate-500">
            Seuil min: {(minSeuil * 100).toFixed(0)}%
          </span>
        </div>

        {/* Raw value display for clarity */}
        <div className="mt-2 flex items-baseline gap-1">
          <span className={`text-3xl font-bold font-mono tracking-tight ${isAmber ? "text-amber-400" : "text-slate-100"}`}>
            {value != null ? (value * 100).toFixed(2) : "—"}
          </span>
          <span className="text-slate-500 text-sm font-bold">%</span>
        </div>
      </div>
      <RingMeter value={value} minSeuil={minSeuil} />
    </div>
  );
}

export default function YieldSection({ data }) {
  return (
    <>
      <SectionHead icon="◈" label="Rendements" />
      <div className="grid grid-cols-2 gap-3 mb-5">
        <YieldCard
          keyName="RC"
          label="Rendement Chimique"
          value={data.rc}
          minSeuil={SEUILS.rc.min}
        />
        <YieldCard
          keyName="RI"
          label="Rendement Industrielle"
          value={data.ri}
          minSeuil={SEUILS.ri.min}
        />
      </div>
    </>
  );
}