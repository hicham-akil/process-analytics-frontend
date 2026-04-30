import { fmt } from "../../config/seuils";

export default function GypseRawTable({ data }) {
  if (!data) return null;

  const rows = [
    { label: "Séchage & Évaporation (SE)", keyA: "seA", keyB: "seB", unit: "%" },
    { label: "Synthèse (SYN)", keyA: "synA", keyB: "synB", unit: "%" },
    { label: "Intermédiaire (INT)", keyA: "intA", keyB: "intB", unit: "%" },
    { label: "P₂O₅ Gypse", keyA: "p2o5GypseA", keyB: "p2o5GypseB", unit: "%" },
    { label: "CaO Gypse", keyA: "caOGypseA", keyB: "caOGypseB", unit: "%" },
  ];

  return (
    <div className="rounded-xl bg-slate-900/80 border border-white/5 p-5 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
          ◎ Données Brutes Analyse Gypse
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          {data.date ? new Date(data.date).toLocaleString("fr-MA") : "—"}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5">Paramètre</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-white/5 text-center">Ligne A</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 text-center">Ligne B</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 text-right">Unité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-[11px] font-medium text-slate-300">{row.label}</td>
                <td className="px-4 py-3 text-[13px] font-bold font-mono text-cyan-400 text-center">
                  {fmt(data[row.keyA], 2)}
                </td>
                <td className="px-4 py-3 text-[13px] font-bold font-mono text-emerald-400 text-center">
                  {fmt(data[row.keyB], 2)}
                </td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-500 text-right">{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
