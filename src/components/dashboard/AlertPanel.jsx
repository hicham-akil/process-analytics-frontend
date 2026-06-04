import { useState, useEffect } from "react";
import { Bell, X, AlertTriangle, Check, Info } from "lucide-react";

function AlertPanel({ alertes, onAcquitter, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background-base/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[360px] bg-background-surface border-l border-border-medium z-[70] shadow-2xl flex flex-col animate-fade-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background-cards/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-accent-red" />
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Alertes Actives ({alertes.length})
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alertes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center">
                <Check size={24} className="text-accent-green" />
              </div>
              <p className="text-sm text-text-muted">Système stable. Aucune alerte.</p>
            </div>
          ) : (
            alertes.map((a) => (
              <div key={a.id}
                className={`relative overflow-hidden p-4 rounded-xl border border-border-subtle transition-all hover:border-border-medium ${
                  a.severite === "CRITICAL" ? "bg-accent-red/5 border-l-4 border-l-accent-red" : "bg-accent-amber/5 border-l-4 border-l-accent-amber"
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        a.severite === "CRITICAL"
                          ? "bg-accent-red/20 text-accent-red"
                          : "bg-accent-amber/20 text-accent-amber"
                      }`}>
                        {a.severite === "CRITICAL" ? "Critique" : a.severite}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {a.typeIndicateur}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] text-text-muted">Valeur:</span>
                         <span className="text-[11px] font-mono font-bold text-text-primary">{a.valeur}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] text-text-muted">Seuil:</span>
                         <span className="text-[11px] font-mono text-text-secondary">{a.seuil}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-text-muted flex items-center gap-1">
                      <Info size={10} />
                      Détecté à {new Date(a.date).toLocaleTimeString("fr-MA")}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onAcquitter(a.id)}
                    className="p-2 rounded-lg bg-background-cards border border-border-subtle hover:border-accent-green/50 hover:text-accent-green transition-all group shrink-0"
                    title="Acquitter"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {alertes.length > 0 && (
          <div className="p-4 border-t border-border-subtle bg-background-cards/30">
            <button 
              className="w-full py-2.5 rounded-lg bg-background-cards border border-border-subtle text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              onClick={onClose}
            >
              Fermer le panneau
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function AlertBadge({ count, onClick }) {
  if (count === 0) return null;
  
  return (
    <button 
      onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent-red/30 bg-accent-red/10 text-accent-red transition-all hover:bg-accent-red/20 group"
    >
      <div className="relative">
        <AlertTriangle size={14} className="animate-pulse" />
        <span className="absolute -top-2 -right-2 w-full h-full bg-accent-red/20 rounded-full animate-pulse-ring pointer-events-none" />
      </div>
      <span className="text-[11px] font-bold tracking-tight">
        {count} ALERTE{count > 1 ? "S" : ""}
      </span>
    </button>
  );
}

export { AlertPanel, AlertBadge };
