import SectionHead from "./shared/SectionHead";
import { fmt, SEUILS } from "../../config/seuils";

function ConsumptionCard({ label, value, unit, seuil }) {
  const isAmber = value != null && value > seuil;
  return (
    <div className={`rounded-lg bg-slate-900 border border-white/5 p-4 ${
      isAmber ? "border-t-2 border-t-amber-400" : "border-t-2 border-t-emerald-400"
    }`}>
      <div className={`text-lg mb-2 ${isAmber ? "text-amber-400" : "text-emerald-400"}`}>◎</div>
      <p className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500 mb-1.5">{label}</p>
      <p className={`text-2xl font-bold font-mono ${isAmber ? "text-amber-400" : "text-slate-100"}`}>
        {fmt(value, 2)}
      </p>
      <p className="text-[9px] text-slate-500 font-bold mt-0.5">{unit}</p>
    </div>
  );
}

export default function ConsumptionSection({ data }) {
  return (
    <>
      <SectionHead icon="▣" label="Consommations Spécifiques" />
      <div className="grid grid-cols-4 gap-3">
        <ConsumptionCard label="H₂SO₄"     value={data.consoH2so4}      unit="T/T P₂O₅"   seuil={SEUILS.consoH2so4.max} />
        <ConsumptionCard label="Eau Brute"  value={data.consoEauBrute}   unit="m³/T P₂O₅"  seuil={SEUILS.consoEauBrute.max} />
        <ConsumptionCard label="Phosphates" value={data.consoPhosphates} unit="T/T P₂O₅"   seuil={SEUILS.consoPhosphates.max} />
        <ConsumptionCard label="Vapeur"     value={data.consoVapeur}     unit="T/T P₂O₅"   seuil={SEUILS.consoVapeur.max} />
      </div>
    </>
  );
}
