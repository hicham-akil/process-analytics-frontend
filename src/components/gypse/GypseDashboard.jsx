import useGypseData from "../../hooks/useGypseData";
import usePerteData from "../../hooks/usePerteData";
import useJFC1Data from "../../hooks/useJFC1Data"; // For alerts and sidebar state
import GypseTopbar from "./GypseTopbar";
import GypseKPICards from "./GypseKPICards";
import GypseChart from "./GypseChart";
import GypseStatsPanel from "./GypseStatsPanel";
import GypseGauges from "./GypseGauges";
import GypseRawTable from "./GypseRawTable";
import Sidebar from "../dashboard/Sidebar";
import { AlertPanel } from "../dashboard/AlertPanel";
import { Loader2, Database, Activity, Gauge as GaugeIcon, BarChart3 } from "lucide-react";
import SectionHead from "../dashboard/shared/SectionHead";

export default function GypseDashboard() {
  const { latest, history, connected, pulse, lastUpdate } = useGypseData();
  const { latest: perteLatest, history: perteHistory, stats: perteStats } = usePerteData();
  
  // We need JFC1 data for the global alerts/sidebar state
  const { 
    alertesNonAcquittees, 
    showAlertPanel, 
    setShowAlertPanel, 
    acquitter 
  } = useJFC1Data();

  const toggleAlerts = () => setShowAlertPanel(v => !v);

  return (
    <div className="bg-background-base min-h-screen text-text-primary flex flex-col font-inter">
      {showAlertPanel && (
        <AlertPanel
          alertes={alertesNonAcquittees}
          onAcquitter={acquitter}
          onClose={() => setShowAlertPanel(false)}
        />
      )}

      <GypseTopbar connected={connected} pulse={pulse} lastUpdate={lastUpdate} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          alertesCount={alertesNonAcquittees.length}
          connected={connected}
          onToggleAlerts={toggleAlerts}
        />

        <main className="flex-1 overflow-y-auto p-8 ml-16 bg-background-base">
          {!latest && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-4">
              <Loader2 size={48} className="animate-spin text-accent-cyan opacity-50" />
              <p className="text-sm font-medium tracking-widest uppercase">Acquisition des données gypse...</p>
            </div>
          )}

          {latest && (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-slide-up">
              
              <section>
                <SectionHead icon={<Database size={16} />} label="Analyse Gypse Détaillée (A & B)" />
                <GypseRawTable data={latest} />
              </section>

              <section>
                <SectionHead icon={<Activity size={16} />} label="Indicateurs de Pertes" />
                <GypseKPICards data={perteLatest} />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <SectionHead icon={<BarChart3 size={16} />} label="Historique Temps Réel (Pertes)" />
                  <GypseChart history={perteHistory} />
                </div>
                <div>
                  <SectionHead icon={<GaugeIcon size={16} />} label="Jauges de Contrôle" />
                  <GypseGauges data={perteLatest} />
                </div>
              </div>

              <section>
                <SectionHead icon={<Activity size={16} />} label="Statistiques de Session (Pertes)" />
                <GypseStatsPanel stats={perteStats} />
              </section>
              
              <footer className="pt-12 pb-6 border-t border-border-subtle flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <span>© 2026 JFC3 Gypse Analytics</span>
                <div className="flex gap-6">
                  <span>Précision Labo: Haute</span>
                  <span>Flux temps réel actif</span>
                </div>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}