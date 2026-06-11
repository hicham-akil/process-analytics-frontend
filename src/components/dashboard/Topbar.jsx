import { useState } from "react";
import { AlertBadge } from "./AlertPanel";
import LivePill from "./shared/LivePill";
import Clock from "./shared/Clock";
import { API_BASE } from "../../config/seuils";
import { FileDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function BoutonRapport() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const telecharger = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rapport/journalier`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
     a.download = `rapport_jfc1_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors du téléchargement du rapport:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={telecharger}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-accent-blue/30 bg-accent-blue/10 hover:bg-accent-blue/20 transition-all disabled:opacity-50 group"
    >
      <FileDown size={14} className="text-accent-blue group-hover:scale-110 transition-transform" />
      <span className="text-[11px] font-bold tracking-wide text-accent-blue">
        {loading ? "GÉNÉRATION..." : "RAPPORT EXCEL"}
      </span>
    </button>
  );
}

export default function Topbar({ connected, pulse, lastUpdate, alertesCount, onToggleAlerts }) {
  return (
    <header className="flex items-center justify-between px-6 h-[56px] bg-background-surface/80 border-b border-border-subtle sticky top-0 z-40 backdrop-blur-xl ml-16">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-text-primary tracking-tight">
            Dashboard Industriel
          </span>
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
            Atelier Acide Phosphorique — JFC3
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 border-r border-border-subtle pr-6 mr-2">
          <BoutonRapport />
          <LivePill connected={connected} pulse={pulse} />
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[9px] text-text-muted font-bold uppercase tracking-tighter">Dernière mise à jour</span>
              <span className="text-[11px] font-mono text-text-secondary">
                {lastUpdate.toLocaleTimeString("fr-MA")}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-3 bg-background-base/50 p-1.5 rounded-xl border border-border-subtle">
             <AlertBadge
                count={alertesCount}
                onClick={onToggleAlerts}
              />
              <div className="w-px h-4 bg-border-subtle mx-1" />
              <Clock />
          </div>
        </div>
      </div>
    </header>
  );
}
