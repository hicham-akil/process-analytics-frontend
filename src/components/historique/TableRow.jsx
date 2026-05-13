import { SEUILS } from "../../config/seuils";

export default function TableRow({ row, index }) {
  const rcBad  = row.rc  != null && row.rc  < SEUILS.rc.min;
  const riBad  = row.ri  != null && row.ri  < SEUILS.ri.min;
  const seBad  = row.se  != null && row.se  > SEUILS.se.max;
  const synBad = row.syn != null && row.syn > SEUILS.syn.max;
  const hasBad = rcBad || riBad || seBad || synBad;

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
      <td className="px-3 py-2.5 text-center">{cell(row.se,  seBad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.syn, synBad)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.cap, false)}</td>
      <td className="px-3 py-2.5 text-center">{cell(row.consoH2so4, false)}</td>
      <td className="px-3 py-2.5 text-center">
        {hasBad
          ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">⚠ HORS SEUIL</span>
          : <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">✓ OK</span>
        }
      </td>
    </tr>
  );
}
