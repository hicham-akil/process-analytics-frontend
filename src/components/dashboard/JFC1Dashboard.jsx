import useJFC1Data from "../../hooks/useJFC1Data";
import usePerteData from "../../hooks/usePerteData";
import { AlertPanel } from "./AlertPanel";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import GypseSection from "./GypseSection";
import YieldSection from "./YieldSection";
import CapSection from "./CapSection";
import ConsumptionSection from "./ConsumptionSection";
import { Loader2 } from "lucide-react";

export default function JFC1Dashboard() {
  const {
    indicateur,
    capHistory,
    connected,
    pulse,
    lastUpdate,
    alertesNonAcquittees,
    showAlertPanel,
    setShowAlertPanel,
    acquitter,
  } = useJFC1Data();

  const { latest: perteLatest } = usePerteData();

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

      <Topbar
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
          {(!indicateur && !perteLatest) && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted space-y-4">
              <Loader2 size={48} className="animate-spin text-accent-blue opacity-50" />
              <p className="text-sm font-medium tracking-widest uppercase">Initialisation du flux de données...</p>
            </div>
          )}

          {(indicateur || perteLatest) && (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-slide-up">
              {perteLatest && <GypseSection data={perteLatest} />}
              {indicateur && (
                <>
                  <YieldSection data={indicateur} />
                  <CapSection data={indicateur} capHistory={capHistory} />
                  <ConsumptionSection data={indicateur} />
                </>
              )}
              
              {/* Footer placeholder */}
              <div className="pt-12 pb-6 border-t border-border-subtle flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <span>© 2026 JFC3 Industrial Solutions</span>
                <div className="flex gap-6">
                  <span>Système critique</span>
                  <span>Sécurité active</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}