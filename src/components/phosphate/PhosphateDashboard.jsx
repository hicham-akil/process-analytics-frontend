import usePhosphateData from "../../hooks/usePhosphateData";
import useJFC1Data from "../../hooks/useJFC1Data";
import PhosphateTopbar from "./PhosphateTopbar";
import PhosphateKPICards from "./PhosphateKPICards";
import PhosphateChart from "./PhosphateChart";
import Sidebar from "../dashboard/Sidebar";
import { AlertPanel } from "../dashboard/AlertPanel";
import { Loader2, FlaskConical, BarChart3, Activity } from "lucide-react";
import SectionHead from "../dashboard/shared/SectionHead";
import { fmt } from "../../config/seuils";

export default function PhosphateDashboard() {
  const { latest, history, connected, pulse, lastUpdate, stats } = usePhosphateData();
  
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

      <PhosphateTopbar 
        connected={connected} 
        pulse={pulse} 
        lastUpdate={lastUpdate}
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
          {!latest && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-4">
              <Loader2 size={48} className="animate-spin text-accent-amber opacity-50" />
              <p className="text-sm font-medium tracking-widest uppercase">Analyse de la qualité phosphate...</p>
            </div>
          )}

          {latest && (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-slide-up">
              
              <section>
                <SectionHead icon={<FlaskConical size={16} />} label="Indicateurs Qualité Phosphate" />
                <PhosphateKPICards data={latest} />
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <SectionHead icon={<BarChart3 size={16} />} label="Évolution Temps Réel" />
                  <PhosphateChart history={history} />
                </div>
                <div>
                  <SectionHead icon={<Activity size={16} />} label="Statistiques de Session" />
                  <div className="bg-background-cards border border-border-subtle rounded-xl p-6 space-y-8 shadow-lg">
                    <StatGroup label="P₂O₅ (%)" stats={stats.p2o5Phosphate} accent="text-accent-amber" />
                    <div className="h-px bg-border-subtle" />
                    <StatGroup label="CaO (%)" stats={stats.caoPhosphate} accent="text-accent-blue" />
                  </div>
                </div>
              </div>
              
              <footer className="pt-12 pb-6 border-t border-border-subtle flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <span>© 2026 JFC3 Phosphate Quality</span>
                <div className="flex gap-6">
                  <span>Analyse Spectrale</span>
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

function StatGroup({ label, stats, accent }) {
  if (!stats || stats.count === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">{label}</p>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div>
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Moyenne</p>
          <p className={`text-2xl font-bold font-mono tracking-tighter ${accent}`}>{fmt(stats.avg)}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Échantillons</p>
          <p className="text-2xl font-bold text-text-primary font-mono tracking-tighter">{stats.count}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Minimum</p>
          <p className="text-sm font-bold text-text-secondary font-mono">{fmt(stats.min)}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Maximum</p>
          <p className="text-sm font-bold text-text-secondary font-mono">{fmt(stats.max)}</p>
        </div>
      </div>
    </div>
  );
}
