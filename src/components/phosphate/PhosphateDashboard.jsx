import usePhosphateData from "../../hooks/usePhosphateData";
import PhosphateTopbar from "./PhosphateTopbar";
import PhosphateKPICards from "./PhosphateKPICards";
import PhosphateChart from "./PhosphateChart";
import { fmt } from "../../config/seuils";

export default function PhosphateDashboard() {
  const { latest, history, connected, pulse, lastUpdate, stats } = usePhosphateData();

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">
      <PhosphateTopbar connected={connected} pulse={pulse} lastUpdate={lastUpdate} />

      <main className="flex-1 overflow-y-auto p-6 bg-[#060d1a]">
        {!latest && (
          <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
            <div className="text-center">
              <div className="text-4xl mb-4 opacity-30 text-sky-400">⊕</div>
              <p>En attente des données Phosphate...</p>
              <p className="text-[10px] text-slate-700 mt-2">
                WebSocket: {connected ? "connecté, en attente du flux" : "connexion en cours..."}
              </p>
            </div>
          </div>
        )}

        {latest && (
          <div className="space-y-8 max-w-[1400px] mx-auto">
            {/* KPI Cards Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                  ⊕ Indicateurs Qualité Phosphate
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <PhosphateKPICards data={latest} />
            </div>

            {/* Chart and Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                    ◉ Évolution Temps Réel
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <PhosphateChart history={history} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                    ◈ Statistiques de Session
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-xl p-5 space-y-6">
                  <StatGroup label="P₂O₅ (%)" stats={stats.p2o5Phosphate} />
                  <div className="h-px bg-white/5" />
                  <StatGroup label="CaO (%)" stats={stats.caoPhosphate} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatGroup({ label, stats }) {
  if (!stats || stats.count === 0) return null;
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[8px] text-slate-600 uppercase font-bold mb-0.5">Moyenne</p>
          <p className="text-xl font-bold text-slate-200 font-mono">{fmt(stats.avg)}</p>
        </div>
        <div>
          <p className="text-[8px] text-slate-600 uppercase font-bold mb-0.5">Échantillons</p>
          <p className="text-xl font-bold text-slate-200 font-mono">{stats.count}</p>
        </div>
        <div>
          <p className="text-[8px] text-slate-600 uppercase font-bold mb-0.5">Minimum</p>
          <p className="text-sm font-bold text-slate-400 font-mono">{fmt(stats.min)}</p>
        </div>
        <div>
          <p className="text-[8px] text-slate-600 uppercase font-bold mb-0.5">Maximum</p>
          <p className="text-sm font-bold text-slate-400 font-mono">{fmt(stats.max)}</p>
        </div>
      </div>
    </div>
  );
}
