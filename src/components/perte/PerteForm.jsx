import { useState } from "react";
import { createPerte } from "../../services/perteService";

export default function PerteForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    se: "",
    syn: "",
    intVal: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const dataToSubmit = {
        ...formData,
        se: parseFloat(formData.se),
        syn: parseFloat(formData.syn),
        intVal: parseFloat(formData.intVal),
      };

      // Validation
      if (isNaN(dataToSubmit.se) || isNaN(dataToSubmit.syn) || isNaN(dataToSubmit.intVal)) {
        throw new Error("Tous les champs numériques sont obligatoires.");
      }

      await createPerte(dataToSubmit);
      setMessage({ type: "success", text: "Données de perte enregistrées avec succès !" });
      if (onSuccess) onSuccess();
      
      // Reset form but keep date
      setFormData(prev => ({ ...prev, se: "", syn: "", intVal: "" }));
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Une erreur est survenue lors de l'enregistrement." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-white/5 p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">✍</span>
        <h3 className="text-[11px] font-bold tracking-[.15em] uppercase text-slate-400">
          Saisie Nouvelle Analyse Perte
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Date et Heure</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Séchage & Évaporation (SE %)</label>
            <input
              type="number"
              step="0.01"
              name="se"
              value={formData.se}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Synthèse (SYN %)</label>
            <input
              type="number"
              step="0.01"
              name="syn"
              value={formData.syn}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">Intermédiaire (INT %)</label>
            <input
              type="number"
              step="0.01"
              name="intVal"
              value={formData.intVal}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>
        </div>

        {message.text && (
          <div className={`text-[10px] font-bold p-3 rounded-lg border ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message.type === "success" ? "✓" : "⚠"} {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-[.1em] uppercase hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="animate-spin inline-block w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full" />
          ) : "💾"}
          {loading ? "Enregistrement..." : "Enregistrer l'analyse"}
        </button>
      </form>
    </div>
  );
}
