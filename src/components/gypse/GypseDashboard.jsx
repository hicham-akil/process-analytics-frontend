import useGypseData from "../../hooks/useGypseData";
import GypseTopbar from "./GypseTopbar";
import GypseKPICards from "./GypseKPICards";
import GypseChart from "./GypseChart";
import GypseStatsPanel from "./GypseStatsPanel";
import GypseGauges from "./GypseGauges";
import GypseRawTable from "./GypseRawTable";

export default function GypseDashboard() {
  const { latest, history, connected, pulse, lastUpdate, stats } = useGypseData();

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">
      <GypseTopbar connected={connected} pulse={pulse} lastUpdate={lastUpdate} />

      <main className="flex-1 overflow-y-auto p-6 bg-[#060d1a]">
        {!latest && (
          <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
            <div className="text-center">
              <div className="text-4xl mb-4 opacity-30">⬡</div>
              <p>En attente des données Gypse...</p>
              <p className="text-[10px] text-slate-700 mt-2">
                WebSocket: {connected ? "connecté, en attente du flux" : "connexion en cours..."}
              </p>
            </div>
          </div>
        )}

        {latest && (
          <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Raw Data Table - NEW SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                  ◈ Analyse Gypse Détaillée (A & B)
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <GypseRawTable data={latest} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                  ⬡ Indicateurs de Pertes
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <GypseKPICards data={latest} />
            </div>

            <div className="grid grid-cols-[1fr_340px] gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                    ◉ Historique Temps Réel
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <GypseChart history={history} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                    ◎ Jauges
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <GypseGauges data={latest} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                  ◈ Statistiques de Session
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <GypseStatsPanel stats={stats} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}