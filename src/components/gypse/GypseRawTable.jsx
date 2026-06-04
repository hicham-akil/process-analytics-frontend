import { fmt } from "../../config/seuils";
import { Database, Clock } from "lucide-react";

export default function GypseRawTable({ data }) {
  if (!data) return null;

  const rows = [
    { label: "P₂O₅ Gypse", keyA: "p2o5GypseA", keyB: "p2o5GypseB", unit: "%" },
    { label: "CaO Gypse", keyA: "caOGypseA", keyB: "caOGypseB", unit: "%" },
  ];

  return (
    <div className="rounded-2xl bg-background-cards border border-border-subtle p-6 shadow-xl animate-fade-slide-up overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
            <Database size={18} />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-text-primary uppercase">
            Données Brutes Analyse
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background-base/50 rounded-lg border border-border-subtle">
          <Clock size={12} className="text-text-muted" />
          <span className="text-[11px] text-text-secondary font-mono font-bold">
            {data.date ? new Date(data.date).toLocaleString("fr-MA") : "—"}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-subtle">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-surface/50">
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle">Paramètre</th>
              <th className="px-6 py-4 text-[10px] font-bold text-accent-cyan uppercase tracking-widest border-b border-border-subtle text-center">Ligne A</th>
              <th className="px-6 py-4 text-[10px] font-bold text-accent-green uppercase tracking-widest border-b border-border-subtle text-center">Ligne B</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-right">Unité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {rows.map((row) => (
              <tr key={row.label} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-[12px] font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{row.label}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-lg bg-accent-cyan/10 text-accent-cyan text-sm font-bold font-mono">
                    {fmt(data[row.keyA], 2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className="inline-block px-3 py-1 rounded-lg bg-accent-green/10 text-accent-green text-sm font-bold font-mono">
                    {fmt(data[row.keyB], 2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[10px] font-bold text-text-muted uppercase">{row.unit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
    </div>
  );
}
