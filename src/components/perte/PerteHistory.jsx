import { fmt, getNiveau, couleurNiveau } from "../../config/seuils";
import { ClockIcon, DatabaseIcon, Calendar } from "lucide-react";

const COLUMNS = [
  { key: "se",     label: "SE",  unit: "%" },
  { key: "syn",    label: "SYN", unit: "%" },
  { key: "intVal", label: "INT", unit: "%" },
];

function NiveauBadge({ metricKey, value }) {
  const niveau  = getNiveau(metricKey, value);
  const colorClass = couleurNiveau(niveau);

  // Map the color class to a pill style
  const pillMap = {
    "text-accent-red font-semibold": "bg-accent-red/10 text-accent-red border-accent-red/20",
    "text-accent-amber":            "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
    "text-text-secondary":          "bg-accent-green/10 text-accent-green border-accent-green/20",
  };

  const pill = pillMap[colorClass] ?? "bg-background-base text-text-muted border-border-subtle";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold font-mono border ${pill}`}
    >
      {fmt(value, 2)}
      <span className="text-[10px] font-normal opacity-60">%</span>
    </span>
  );
}

export default function PerteHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-subtle bg-background-cards px-6 py-20 text-center animate-fade-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background-base text-text-muted">
          <DatabaseIcon size={32} />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary uppercase tracking-widest">Aucun historique</p>
          <p className="text-xs text-text-muted mt-1">Les analyses enregistrées apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-background-cards shadow-xl animate-fade-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5 bg-background-surface/30">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
            <ClockIcon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-blue">
              Archives Analyses
            </p>
            <p className="text-sm font-bold text-text-primary">
              Historique des prélèvements
            </p>
          </div>
        </div>
        <span className="rounded-full bg-background-base border border-border-subtle px-3 py-1 text-[11px] font-bold text-text-secondary">
          {history.length} ENTRÉE{history.length > 1 ? "S" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="bg-background-surface/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-subtle">
                Date & Heure
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-subtle"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle/30">
            {sortedHistory.map((row, i) => (
              <tr
                key={i}
                className="group transition-colors hover:bg-white/5"
              >
                {/* Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-text-muted" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-primary">
                        {new Date(row.date).toLocaleDateString("fr-MA", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        {new Date(row.date).toLocaleTimeString("fr-MA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Metrics */}
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-center">
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