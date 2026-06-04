import { SEUILS } from "../../config/seuils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TableRow({ row, index }) {
  const rcBad  = row.rc  != null && row.rc  < SEUILS.rc.min;
  const riBad  = row.ri  != null && row.ri  < SEUILS.ri.min;
  const capBad = row.cap != null && row.cap < 1.0;
  const h2so4Bad = row.consoH2so4 != null && row.consoH2so4 > (SEUILS.consoH2so4?.max ?? 3.8);
  const hasBad = rcBad || riBad || capBad || h2so4Bad;

  const cell = (v, bad) => (
    <span className={`font-mono font-bold text-sm ${bad ? "text-accent-amber" : "text-text-primary"}`}>
      {v != null ? Number(v).toFixed(4) : "—"}
    </span>
  );

  return (
    <tr className={`group border-b border-border-subtle/50 hover:bg-white/[.02] transition-colors ${hasBad ? "bg-accent-amber/[.02]" : ""}`}>
      <td className="px-4 py-3 text-[11px] text-text-muted font-mono whitespace-nowrap group-hover:text-text-secondary transition-colors">
        {row.date ? new Date(row.date).toLocaleString("fr-MA") : "—"}
      </td>
      <td className="px-4 py-3 text-center">{cell(row.rc,  rcBad)}</td>
      <td className="px-4 py-3 text-center">{cell(row.ri,  riBad)}</td>
      <td className="px-4 py-3 text-center">{cell(row.cap, capBad)}</td>
      <td className="px-4 py-3 text-center">{cell(row.consoH2so4,      h2so4Bad)}</td>
      <td className="px-4 py-3 text-center">{cell(row.consoEauBrute,   false)}</td>
      <td className="px-4 py-3 text-center">{cell(row.consoPhosphates, false)}</td>
      <td className="px-4 py-3 text-center">
        {hasBad
          ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-amber/10 border border-accent-amber/20 text-accent-amber">
              <AlertTriangle size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hors Seuil</span>
            </div>
          )
          : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green">
              <CheckCircle2 size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Normal</span>
            </div>
          )
        }
      </td>
    </tr>
  );
}