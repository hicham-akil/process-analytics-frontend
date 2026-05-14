import { SEUILS } from "../../config/seuils";

export default function TableRow({ row, index }) {
  const rcBad  = row.rc  != null && row.rc  < SEUILS.rc.min;
  const riBad  = row.ri  != null && row.ri  < SEUILS.ri.min;
  const capBad = row.cap != null && row.cap < 1.0;
  const h2so4Bad = row.consoH2so4 != null && row.consoH2so4 > (SEUILS.consoH2so4?.max ?? 3.8);
  const hasBad = rcBad || riBad || capBad || h2so4Bad;

  const cell = (v, bad) => (
    <span className={`font-mono font-bold ${bad ? "text-amber-400" : "text-slate-200"}`}>
      {v != null ? Number(v).toFixed(4) : "—"}
    </span>
  );

  return (
    <tr className={`border-b border-white/5 hover:bg-white/[.03] transition-colors ${hasBad ? "bg-amber-500/[.03]" : ""}`}>
      <td className="px-3 py-2.5 text-[9px] text-slate-500 font-mono whitespace-nowrap">
        {row.date ? new Date(row.date).toLocaleString("fr-MA") : "—"}
      </td>
      <td className="px-3 py-2.5 text-center">{cell(row.rc,  rcBad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.ri,  riBad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.cap, capBad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.consoH2so4,      h2so4Bad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.consoEauBrute,   false)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.consoPhosphates, false)}</td>
      <td className="px-3 py-2.5 text-center">
        {hasBad
          ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">⚠ HORS SEUIL</span>
          : <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">✓ OK</span>
        }
      </td>
    </tr>
  );
}