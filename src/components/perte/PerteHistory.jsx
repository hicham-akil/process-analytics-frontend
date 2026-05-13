import { fmt, getNiveau, couleurNiveau } from "../../config/seuils";

export default function PerteHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900/80 border border-white/5 p-8 text-center text-slate-500 text-[11px]">
        Aucun historique de perte disponible.
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="rounded-xl bg-slate-900/80 border border-white/5 overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
        <p className="text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 flex items-center gap-2">
          <span>▣</span> Historique des analyses de pertes
        </p>
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          {history.length} ENTRÉES
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-950/50">
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Date & Heure</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-center">SE (%)</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-center">SYN (%)</th>
              <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-center">INT (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedHistory.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-[11px] font-mono text-slate-300">
                  {new Date(row.date).toLocaleString("fr-MA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </td>
                <td className={`px-4 py-3 text-[12px] font-bold font-mono text-center ${couleurNiveau(getNiveau("se", row.se))}`}>
                  {fmt(row.se, 2)}
                </td>
                <td className={`px-4 py-3 text-[12px] font-bold font-mono text-center ${couleurNiveau(getNiveau("syn", row.syn))}`}>
                  {fmt(row.syn, 2)}
                </td>
                <td className={`px-4 py-3 text-[12px] font-bold font-mono text-center ${couleurNiveau(getNiveau("intVal", row.intVal))}`}>
                  {fmt(row.intVal, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
