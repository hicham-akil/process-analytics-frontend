import { fmt, getNiveau, couleurNiveau } from "../../config/seuils";
import { ClockIcon, DatabaseIcon } from "lucide-react";

const COLUMNS = [
  { key: "se",     label: "SE",  unit: "%" },
  { key: "syn",    label: "SYN", unit: "%" },
  { key: "intVal", label: "INT", unit: "%" },
];

function NiveauBadge({ metricKey, value }) {
  const niveau  = getNiveau(metricKey, value);
  const couleur = couleurNiveau(niveau);

  // Map the colour class to a pill style (bg + text combos that work on dark)
  const pillMap = {
    "text-emerald-400": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    "text-yellow-400":  "bg-yellow-500/10  text-yellow-400  ring-yellow-500/20",
    "text-orange-400":  "bg-orange-500/10  text-orange-400  ring-orange-500/20",
    "text-red-400":     "bg-red-500/10     text-red-400     ring-red-500/20",
  };

  const pill = pillMap[couleur] ?? "bg-slate-500/10 text-slate-400 ring-slate-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold font-mono ring-1 ring-inset ${pill}`}
    >
      {fmt(value, 2)}
      <span className="ml-0.5 text-[10px] font-normal opacity-60">%</span>
    </span>
  );
}

export default function PerteHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <DatabaseIcon size={22} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Aucun historique de perte disponible.
        </p>
      </div>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
            <ClockIcon size={15} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-500">
              Historique
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Analyses de pertes
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {history.length} entrée{history.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Date & Heure
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedHistory.map((row, i) => (
              <tr
                key={i}
                className="group border-t border-slate-100 transition-colors hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:bg-emerald-500/5"
              >
                {/* Date */}
                <td className="px-5 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                      {new Date(row.date).toLocaleDateString("fr-MA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(row.date).toLocaleTimeString("fr-MA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>

                {/* Metrics */}
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-center">
                    <NiveauBadge metricKey={col.key} value={row[col.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}