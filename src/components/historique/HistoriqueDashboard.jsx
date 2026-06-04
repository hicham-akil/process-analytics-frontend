import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import useHistoriqueData from "../../hooks/useHistoriqueData";
import useJFC1Data from "../../hooks/useJFC1Data";
import { SEUILS } from "../../config/seuils";

import HistoriqueTopbar from "./HistoriqueTopbar";
import Sidebar from "../dashboard/Sidebar";
import { AlertPanel } from "../dashboard/AlertPanel";
import StatCard from "./StatCard";
import HistoTooltip from "./HistoTooltip";
import TableRow from "./TableRow";
import SectionHead from "../dashboard/shared/SectionHead";
import { Calendar, Search, History, BarChart3, Database, AlertCircle, Loader2 } from "lucide-react";

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

  const { 
    alertesNonAcquittees, 
    showAlertPanel, 
    setShowAlertPanel, 
    acquitter,
    connected
  } = useJFC1Data();

  const toggleAlerts = () => setShowAlertPanel(v => !v);

  // Prepare chart data (last 60 points max, chronological order)
  const chartData = [...data]
    .slice(0, 60)
    .reverse()
    .map(d => ({
      time: d.date ? new Date(d.date).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) : "",
      rc:   d.rc   != null ? +d.rc.toFixed(4)   : null,
      ri:   d.ri   != null ? +d.ri.toFixed(4)   : null,
      cap:  d.cap  != null ? +d.cap.toFixed(4)  : null,
      h2so4: d.consoH2so4 != null ? +d.consoH2so4.toFixed(4) : null,
    }));

  return (
    <div className="bg-background-base min-h-screen text-text-primary flex flex-col font-inter">
      {showAlertPanel && (
        <AlertPanel
          alertes={alertesNonAcquittees}
          onAcquitter={acquitter}
          onClose={() => setShowAlertPanel(false)}
        />
      )}

      <HistoriqueTopbar 
        alertesCount={alertesNonAcquittees.length}
        onToggleAlerts={toggleAlerts}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          alertesCount={alertesNonAcquittees.length}
          connected={connected}
          onToggleAlerts={toggleAlerts}
        />

        <main className="flex-1 overflow-y-auto p-8 ml-16 bg-background-base">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-slide-up">

            {/* ── Barre de filtres ── */}
            <section className="rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg">
              <SectionHead icon={<Calendar size={16} />} label="Filtres de période" />

              <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Presets */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Raccourcis</span>
                  <div className="flex gap-2 flex-wrap">
                    {PRESETS.map(p => (
                      <button
                        key={p.h}
                        onClick={() => setPreset(p.h)}
                        className="text-[11px] font-bold px-4 py-2 rounded-lg border border-border-subtle bg-background-base hover:border-accent-blue/50 hover:text-accent-blue transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Début</label>
                    <input
                      type="datetime-local"
                      value={debut}
                      onChange={e => setDebut(e.target.value)}
                      className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fin</label>
                    <input
                      type="datetime-local"
                      value={fin}
                      onChange={e => setFin(e.target.value)}
                      className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={fetch}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-widest hover:bg-accent-blue/20 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : <Search size={16} />}
                    {loading ? "Chargement..." : "Rechercher"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-center gap-2 text-accent-red text-xs font-bold">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </section>

            {/* ── Résultats ── */}
            {searched && !loading && (
              <>
                {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-text-muted bg-background-cards border border-border-subtle rounded-xl border-dashed">
                    <History size={48} className="opacity-10 mb-4" />
                    <p className="text-sm font-medium">Aucune donnée sur cette période</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <SectionHead icon={<History size={16} />} label={`${data.length} relevés trouvés`} />
                        {stats?.alertRate > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber uppercase tracking-wider">
                            {stats.alertRate} hors seuil
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── Cartes stats ── */}
                    {stats && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="RC moy."     s={stats.rc}         unit=""    isMin        seuil={SEUILS.rc.min} />
                        <StatCard label="RI moy."     s={stats.ri}         unit=""    isMin        seuil={SEUILS.ri.min} />
                        <StatCard label="CAP moy."    s={stats.cap}        unit=""    isMin={false} seuil={999} />
                        <StatCard label="H₂SO₄ moy."  s={stats.consoH2so4} unit="T/T" isMin={false} seuil={SEUILS.consoH2so4?.max ?? 3.8} />
                      </div>
                    )}

                    {/* ── Graphique ── */}
                    <section className="rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-8">
                        <SectionHead icon={<BarChart3 size={16} />} label="Tendance sur la période" />
                        <div className="flex gap-4">
                          {[
                            { color: "bg-accent-green", label: "RC" },
                            { color: "bg-accent-blue",  label: "RI" },
                            { color: "bg-accent-cyan",  label: "CAP" },
                            { color: "bg-accent-amber", label: "H₂SO₄" },
                          ].map(d => (
                            <div key={d.label} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${d.color}`} />
                              <span className="text-[10px] font-bold text-text-muted uppercase">{d.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis
                              dataKey="time"
                              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
                              axisLine={false}
                              tickLine={false}
                              interval="preserveStartEnd"
                            />
                            <YAxis
                              domain={["auto", "auto"]}
                              tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<HistoTooltip />} />
                            <ReferenceLine y={SEUILS.rc.min} stroke="rgba(16,185,129,0.1)" strokeDasharray="4 4" />
                            <ReferenceLine y={SEUILS.ri.min} stroke="rgba(59,130,246,0.1)" strokeDasharray="4 4" />
                            <Line type="monotone" dataKey="rc"    stroke="#10b981" strokeWidth={2.5} dot={false} connectNulls />
                            <Line type="monotone" dataKey="ri"    stroke="#3b82f6" strokeWidth={2.5} dot={false} connectNulls />
                            <Line type="monotone" dataKey="cap"   stroke="#06b6d4" strokeWidth={1.5} dot={false} connectNulls strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="h2so4" stroke="#f59e0b" strokeWidth={1.5} dot={false} connectNulls strokeDasharray="3 3" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </section>

                    {/* ── Tableau détaillé ── */}
                    <section className="rounded-xl bg-background-cards border border-border-subtle shadow-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                        <SectionHead icon={<Database size={16} />} label="Données détaillées" />
                        <span className="text-[10px] font-bold text-text-muted uppercase">
                          {data.length > 100 ? `Affichage 100 / ${data.length}` : `${data.length} relevés`}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead>
                            <tr className="bg-background-base/50">
                              {["Horodatage", "RC", "RI", "CAP", "H₂SO₄", "Eau Brute", "Phosphates", "Statut"].map(h => (
                                <th key={h} className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-center first:text-left">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {data.slice(0, 100).map((row, i) => (
                              <TableRow key={row.id ?? i} row={row} index={i} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}

            {/* ── État initial ── */}
            {!searched && !loading && (
              <div className="flex flex-col items-center justify-center py-32 text-center gap-4 bg-background-cards border border-border-subtle rounded-xl border-dashed">
                <div className="p-4 rounded-full bg-accent-blue/5 text-accent-blue opacity-20">
                  <History size={64} />
                </div>
                <div>
                  <p className="text-lg font-bold text-text-primary">Consultation de l'historique</p>
                  <p className="text-sm text-text-muted mt-1">Sélectionnez une période pour commencer l'analyse</p>
                </div>
              </div>
            )}

            <footer className="pt-12 pb-6 border-t border-border-subtle flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
              <span>© 2026 JFC3 Data Archiving</span>
              <div className="flex gap-6">
                <span>Intégrité des données</span>
                <span>Audit continu</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}