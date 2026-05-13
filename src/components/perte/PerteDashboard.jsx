import usePerteData from "../../hooks/usePerteData";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import PerteForm from "./PerteForm";
import PerteHistory from "./PerteHistory";

export default function PerteDashboard() {
  const { latest, history, connected, pulse, lastUpdate } = usePerteData();

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">
      <Topbar 
        connected={connected} 
        pulse={pulse} 
        lastUpdate={lastUpdate} 
        alertesCount={0} // To be updated if needed
        onToggleAlerts={() => {}} 
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          alertesCount={0} 
          connected={connected} 
          onToggleAlerts={() => {}} 
        />

        <main className="flex-1 overflow-y-auto p-6 bg-[#060d1a]">
          <div className="max-w-[1200px] mx-auto space-y-8">
            <header>
              <h1 className="text-2xl font-black tracking-tighter text-slate-100 uppercase italic">
                Saisie & Historique <span className="text-emerald-400 text-3xl">Pertes Gypse</span>
              </h1>
              <p className="text-slate-500 text-[10px] font-bold tracking-[.2em] uppercase mt-1">
                Module de gestion manuelle des indicateurs de perte
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                      ◈ Formulaire de saisie
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <PerteForm />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
                      ◉ Historique des 50 derniers relevés
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <PerteHistory history={history} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
