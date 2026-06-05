import usePerteData from "../../hooks/usePerteData";
import useJFC1Data from "../../hooks/useJFC1Data";
import PerteTopbar from "./PerteTopbar";
import Sidebar from "../dashboard/Sidebar";
import PerteForm from "./PerteForm";
import PerteHistory from "./PerteHistory";
import PerteKPICards from "./PerteKPICard";
import { AlertPanel } from "../dashboard/AlertPanel";
import { ClipboardEdit, History, Activity } from "lucide-react";
import SectionHead from "../dashboard/shared/SectionHead";

export default function PerteDashboard() {
  const { latest, history, connected, pulse, lastUpdate, refetch } = usePerteData();
  
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

      <PerteTopbar
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
          <div className="max-w-7xl mx-auto space-y-12 animate-fade-slide-up">
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase">
                Saisie & <span className="text-accent-green">Indicateurs Gypse</span>
              </h1>
              <p className="text-text-muted text-xs font-bold tracking-[0.2em] uppercase">
                Module de gestion manuelle des performances
              </p>
            </header>

            <section className="space-y-6">
              <SectionHead icon={<Activity size={16} />} label="Derniers indicateurs enregistrés" />
              <PerteKPICards data={latest} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
              <section className="space-y-6">
                <SectionHead icon={<ClipboardEdit size={16} />} label="Formulaire de saisie" />
                <PerteForm onSuccess={refetch} />
              </section>

              <section className="space-y-6">
                <SectionHead icon={<History size={16} />} label="Historique des relevés" />
                <PerteHistory history={history} onDelete={refetch} />
              </section>
            </div>
            
            <footer className="pt-12 pb-6 border-t border-border-subtle flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
              <span>© 2026 JFC3 Manual Control</span>
              <div className="flex gap-6">
                <span>Validation Labo requise</span>
                <span>Enregistrement sécurisé</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}