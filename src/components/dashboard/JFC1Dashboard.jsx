import useJFC1Data from "../../hooks/useJFC1Data";
import { AlertPanel } from "./AlertPanel";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import GypseSection from "./GypseSection";
import YieldSection from "./YieldSection";
import CapSection from "./CapSection";
import ConsumptionSection from "./ConsumptionSection";

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

  const toggleAlerts = () => setShowAlertPanel(v => !v);

  return (
    <div className="bg-[#060d1a] min-h-screen text-slate-100 font-mono flex flex-col">

      {/* Alert Panel overlay */}
      {showAlertPanel && (
        <AlertPanel
          alertes={alertesNonAcquittees}
          onAcquitter={acquitter}
          onClose={() => setShowAlertPanel(false)}
        />
      )}

      {/* Topbar */}
      <Topbar
        connected={connected}
        pulse={pulse}
        lastUpdate={lastUpdate}
        alertesCount={alertesNonAcquittees.length}
        onToggleAlerts={toggleAlerts}
      />

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          alertesCount={alertesNonAcquittees.length}
          connected={connected}
          onToggleAlerts={toggleAlerts}
        />

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-5 bg-[#060d1a]">
          {!indicateur && (
            <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
              En attente des données Python...
            </div>
          )}

          {indicateur && <>
            <GypseSection data={indicateur} />
            <YieldSection data={indicateur} />
            <CapSection data={indicateur} capHistory={capHistory} />
            <ConsumptionSection data={indicateur} />
          </>}
        </main>
      </div>
    </div>
  );
}
