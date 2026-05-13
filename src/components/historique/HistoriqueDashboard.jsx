import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import useHistoriqueData from "../../hooks/useHistoriqueData";
import { SEUILS } from "../../config/seuils";

import HistoriqueTopbar from "./HistoriqueTopbar";
import StatCard from "./StatCard";
import HistoTooltip from "./HistoTooltip";
import TableRow from "./TableRow";

const PRESETS = [
  { label: "1 h",  h: 1 },
  { label: "6 h",  h: 6 },
  { label: "24 h", h: 24 },
  { label: "48 h", h: 48 },
  { label: "7 j",  h: 24 * 7 },
];

export default function HistoriqueDashboard() {
  const {
    debut, setDebut, fin, setFin,
    data, loading, error, searched,
    fetch, setPreset, stats,
  } = useHistoriqueData();

  // Prepare chart data (last 60 points max, chronological order)
  const chartData = [...data]
    .slice(0, 60)
    .reverse()
    .map(d => ({
      time: d.date ? new Date(d.date).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) : "",
      rc:   d.rc   != null ? +d.rc.toFixed(4)   : null,
      ri:   d.ri   != null ? +d.ri.toFixed(4)   : null,
      se:   d.se   != null ? +d.se.toFixed(4)   : null,
      cap:  d.cap  != null ? +d.cap.toFixed(4)  : null,
    }));

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">
      <HistoriqueTopbar />

      <main className="flex-1 overflow-y-auto p-5 space-y-5 max-w-[1400px] w-full mx-auto">

        {/* ── Barre de filtres ── */}
        <div className="rounded-xl bg-slate-900/80 border border-white/5 p-5">
          <p className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 mb-4">
            ◷ Filtres de période
          </p>

          {/* Presets */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {PRESETS.map(p => (
              <button
                key={p.h}
                onClick={() => setPreset(p.h)}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800 hover:bg-slate-700 hover:border-violet-500/40 text-slate-400 hover:text-violet-300 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Date pickers + bouton */}
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Début</label>
              <input
                type="datetime-local"
                value={debut}
                onChange={e => setDebut(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-violet-500/60 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Fin</label>
              <input
                type="datetime-local"
                value={fin}
                onChange={e => setFin(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-violet-500/60 transition-colors"
              />
            </div>
            <button
              onClick={fetch}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold tracking-[.08em] uppercase hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="animate-spin inline-block w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full" />
              ) : "◎"}
              {loading ? "Chargement..." : "Rechercher"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-[10px] text-red-400 font-bold">⚠ {error}</p>
          )}
        </div>

        {/* ── Résultats ── */}
        {searched && !loading && (
          <>
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
                Aucune donnée sur cette période
              </div>
            ) : (
              <>
                {/* ── Compteur résultats ── */}
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                    ◈ {data.length} relevé{data.length > 1 ? "s" : ""} trouvé{data.length > 1 ? "s" : ""}
                  </span>
                  {stats?.alertRate > 0 && (
                    <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      ⚠ {stats.alertRate} hors seuil
                    </span>
                  )}
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* ── Cartes stats ── */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard label="RC moy."  s={stats.rc}  unit=""     isMin seuil={SEUILS.rc.min}  />
                    <StatCard label="RI moy."  s={stats.ri}  unit=""     isMin seuil={SEUILS.ri.min}  />
                    <StatCard label="SE moy."  s={stats.se}  unit="%"    isMin={false} seuil={SEUILS.se.max}  />
                    <StatCard label="SYN moy." s={stats.syn} unit="%"    isMin={false} seuil={SEUILS.syn.max} />
                    <StatCard label="CAP moy." s={stats.cap} unit=""     isMin={false} seuil={999}    />
                    <StatCard label="H₂SO₄ moy." s={stats.consoH2so4} unit="T/T" isMin={false} seuil={SEUILS.consoH2so4.max} />
                  </div>
                )}

                {/* ── Graphique RC / RI / SE ── */}
                <div className="rounded-xl bg-slate-900/80 border border-white/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                      ◉ Évolution sur la période
                    </p>
                    <div className="flex gap-4 text-[9px] text-slate-500">
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-emerald-400 rounded" />RC</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-sky-400 rounded" />RI</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-amber-400 rounded" />SE</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-violet-400 rounded" />CAP</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false} />
                      <XAxis dataKey="time" tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                        axisLine={false} tickLine={false} interval="preserveStartEnd" />
                      <YAxis domain={["auto", "auto"]} tick={{ fill: "#3d5a78", fontSize: 9, fontFamily: "monospace" }}
                        axisLine={false} tickLine={false} />
                      <Tooltip content={<HistoTooltip />} />
                      <ReferenceLine y={SEUILS.rc.min} stroke="rgba(52,211,153,.15)" strokeDasharray="4 3" />
                      <ReferenceLine y={SEUILS.ri.min} stroke="rgba(56,189,248,.15)"  strokeDasharray="4 3" />
                      <ReferenceLine y={SEUILS.se.max} stroke="rgba(251,191,36,.15)"  strokeDasharray="4 3" />
                      <Line type="monotone" dataKey="rc"  name="RC"  stroke="#34d399" strokeWidth={2} dot={false} connectNulls />
                      <Line type="monotone" dataKey="ri"  name="RI"  stroke="#38bdf8" strokeWidth={2} dot={false} connectNulls />
                      <Line type="monotone" dataKey="se"  name="SE"  stroke="#fbbf24" strokeWidth={2} dot={false} connectNulls />
                      <Line type="monotone" dataKey="cap" name="CAP" stroke="#a78bfa" strokeWidth={1.5} dot={false} connectNulls strokeDasharray="4 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* ── Tableau détaillé ── */}
                <div className="rounded-xl bg-slate-900/80 border border-white/5 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                      ▣ Données détaillées
                    </p>
                    <span className="text-[9px] text-slate-600">
                      {data.length > 100 ? `100 / ${data.length} affichés` : `${data.length} relevés`}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="bg-slate-950/50">
                          {["Horodatage", "RC", "RI", "SE %", "SYN %", "CAP", "H₂SO₄", "Statut"].map(h => (
                            <th key={h} className="px-3 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 text-center first:text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 100).map((row, i) => (
                          <TableRow key={row.id ?? i} row={row} index={i} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── État initial ── */}
        {!searched && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <div className="text-5xl opacity-10 text-violet-400">◷</div>
            <p className="text-slate-600 text-sm">Sélectionnez une période puis cliquez sur Rechercher</p>
            <p className="text-slate-700 text-[10px]">Données disponibles depuis la mise en service du système</p>
          </div>
        )}

      </main>
    </div>
  );
}
