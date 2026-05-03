import { useState, useEffect } from "react";

function AlertPanel({ alertes, onAcquitter, onClose }) {
  return (
    <div className="fixed top-16 right-4 z-50 w-80 bg-slate-900 border border-red-500/30 rounded-xl shadow-2xl shadow-red-500/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-red-500/10">
        <span className="text-[10px] font-bold tracking-widest uppercase text-red-400">
          ⚠ Alertes Actives ({alertes.length})
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm">✕</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {alertes.length === 0 ? (
          <div className="p-4 text-center text-slate-600 text-xs">Aucune alerte active</div>
        ) : (
          alertes.map((a) => (
            <div key={a.id}
              className={`p-3 border-b border-white/5 ${
                a.severite === "CRITICAL" ? "bg-red-500/5" : "bg-amber-500/5"
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      a.severite === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {a.severite}
                    </span>
                    <span className="text-[10px] font-bold text-slate-200">
                      {a.typeIndicateur}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400">
                    Valeur: <span className="text-slate-200 font-mono">{a.valeur}</span>
                    {" "}/ Seuil: <span className="text-slate-200 font-mono">{a.seuil}</span>
                  </p>
                  <p className="text-[9px] text-slate-600 mt-0.5">
                    {new Date(a.date).toLocaleTimeString("fr-MA")}
                  </p>
                </div>
                <button
                  onClick={() => onAcquitter(a.id)}
                  className="text-[9px] font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors shrink-0">
                  ACK
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AlertBadge({ count, onClick }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    if (count === 0) return;
    const id = setInterval(() => setBlink(v => !v), 800);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
        blink
          ? "border-red-500/60 bg-red-500/20 text-red-400"
          : "border-red-500/20 bg-red-500/5 text-red-500"
      }`}>
      <span className="text-[9px] font-bold tracking-widest">⚠ {count} ALERTE{count > 1 ? "S" : ""}</span>
    </button>
  );
}

export { AlertPanel, AlertBadge };
