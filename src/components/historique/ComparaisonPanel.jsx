import React from 'react';
import { Calendar, Search, Loader2 } from 'lucide-react';
import SectionHead from '../dashboard/shared/SectionHead';

const PRESETS = [
  { label: '7 j',  days: 7 },
  { label: '14 j', days: 14 },
  { label: '30 j', days: 30 },
];

export default function ComparaisonPanel({ 
  debut1, setDebut1, fin1, setFin1,
  debut2, setDebut2, fin2, setFin2,
  onCompare, loading, setPreset
}) {

  return (
    <section className="rounded-xl bg-background-cards border border-border-subtle p-6 shadow-lg animate-fade-slide-up">
      <div className="flex items-center justify-between mb-6">
        <SectionHead icon={<Calendar size={16} />} label="Configuration de la comparaison" />
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Presets rapides</span>
          <div className="flex gap-2">
            {PRESETS.map(p => (
              <button
                key={p.days}
                onClick={() => setPreset(p.days)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-border-subtle bg-background-base hover:border-accent-blue/50 hover:text-accent-blue transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Période 1 - Bleu */}
        <div className="space-y-4 p-4 rounded-xl bg-background-base/30 border border-accent-blue/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent-blue" />
            <h4 className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Période 1 (Référence)</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Début</label>
              <input
                type="datetime-local"
                value={debut1}
                onChange={e => setDebut1(e.target.value)}
                className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fin</label>
              <input
                type="datetime-local"
                value={fin1}
                onChange={e => setFin1(e.target.value)}
                className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Période 2 - Vert */}
        <div className="space-y-4 p-4 rounded-xl bg-background-base/30 border border-accent-green/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent-green" />
            <h4 className="text-[10px] font-bold text-accent-green uppercase tracking-widest">Période 2 (Comparaison)</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Début</label>
              <input
                type="datetime-local"
                value={debut2}
                onChange={e => setDebut2(e.target.value)}
                className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-green/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Fin</label>
              <input
                type="datetime-local"
                value={fin2}
                onChange={e => setFin2(e.target.value)}
                className="bg-background-base border border-border-subtle rounded-lg px-4 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-green/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onCompare}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-10 py-3 rounded-xl bg-accent-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-accent-blue/90 disabled:opacity-50 transition-all shadow-lg shadow-accent-blue/20"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : <Search size={16} />}
          {loading ? "Calcul en cours..." : "Lancer la comparaison"}
        </button>
      </div>

      {loading && (
        <div className="mt-8 space-y-4">
          <div className="h-40 bg-background-base/50 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-background-base/50 rounded-xl animate-pulse" />
            <div className="h-32 bg-background-base/50 rounded-xl animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}
