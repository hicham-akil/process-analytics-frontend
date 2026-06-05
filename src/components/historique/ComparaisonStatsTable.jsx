import React from 'react';
import { TrendingUp, TrendingDown, Minus, Database } from 'lucide-react';
import SectionHead from '../dashboard/shared/SectionHead';

const INDICATORS = [
  { id: 'rc',        label: 'Ratio Chimique (RC)', unit: '',    better: 'higher' },
  { id: 'ri',        label: 'Ratio Insoluble (RI)', unit: '',    better: 'higher' },
  { id: 'cap',       label: 'Capacité (CAP)',      unit: 'T/H',  better: 'lower'  },
  { id: 'h2so4',     label: 'Acide Sulfurique',     unit: 'T/T',  better: 'lower'  },
  { id: 'eau',       label: 'Eau Brute',           unit: 'm³/T', better: 'lower'  },
  { id: 'phosphate', label: 'Phosphates',          unit: 'T/T',  better: 'lower'  },
  { id: 'vapeur',    label: 'Vapeur',              unit: 'T/T',  better: 'lower'  },
];

export default function ComparaisonStatsTable({ statsP1, statsP2 }) {
  if (!statsP1 || !statsP2) return null;

  return (
    <section className="rounded-xl bg-background-cards border border-border-subtle shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle">
        <SectionHead icon={<Database size={16} />} label="Synthèse des performances" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-background-base/50">
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle">Indicateur</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-center">Moyenne P1</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-center text-accent-green">Moyenne P2</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-center">Écart (Δ)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-center">Tendance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-subtle text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {INDICATORS.map(ind => {
              const val1 = statsP1[ind.id] || 0;
              const val2 = statsP2[ind.id] || 0;
              const delta = val2 - val1;
              const percent = val1 !== 0 ? (delta / val1) * 100 : 0;
              
              const isStable = Math.abs(percent) < 1;
              const isImprovement = ind.better === 'higher' ? delta > 0 : delta < 0;
              
              const deltaColor = isStable ? 'text-text-muted' : (isImprovement ? 'text-accent-green' : 'text-accent-red');
              
              return (
                <tr key={ind.id} className="hover:bg-background-base/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary">{ind.label}</span>
                      <span className="text-[10px] text-text-muted font-mono">{ind.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-text-secondary">{val1.toFixed(3)}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm font-bold text-text-primary">{val2.toFixed(3)}</td>
                  <td className={`px-6 py-4 text-center font-mono text-sm font-bold ${deltaColor}`}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(3)}
                    <span className="text-[10px] ml-1 opacity-70">({percent > 0 ? '+' : ''}{percent.toFixed(1)}%)</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {isStable ? (
                        <Minus size={18} className="text-text-muted" />
                      ) : delta > 0 ? (
                        <TrendingUp size={18} className="text-accent-green" />
                      ) : (
                        <TrendingDown size={18} className="text-accent-red" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                      isStable ? 'bg-background-surface text-text-muted border border-border-subtle' :
                      isImprovement ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' :
                      'bg-accent-red/10 text-accent-red border border-accent-red/20'
                    }`}>
                      {isStable ? 'Stable' : (isImprovement ? 'Amélioré' : 'Dégradé')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
