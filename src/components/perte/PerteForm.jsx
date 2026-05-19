import { useState } from "react";
import {
  CalendarDays,
  FlaskConical,
  Layers3,
  Activity,
  Save,
  CheckCircle2,
  AlertTriangle,
  Droplets,
} from "lucide-react";
import { createPerte } from "../../services/perteService";

// ✅ fields array defined outside the component
const fields = [
  {
    name: "se",
    label: "SE",
    placeholder: "0.00",
    icon: Droplets,
  },
  {
    name: "syn",
    label: "SYN",
    placeholder: "0.00",
    icon: Layers3,
  },
  {
    name: "intVal",
    label: "INT",
    placeholder: "0.00",
    icon: Activity,
  },
];

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
      const se     = parseFloat(formData.se);
      const syn    = parseFloat(formData.syn);
      const intVal = parseFloat(formData.intVal);

      if (isNaN(se) || isNaN(syn) || isNaN(intVal)) {
        throw new Error("Tous les champs numériques sont obligatoires.");
      }

      // ✅ append seconds so Spring Boot LocalDateTime parses correctly
      // "2026-05-18T14:30" → "2026-05-18T14:30:00"
      const dateWithSeconds = formData.date.length === 16
        ? formData.date + ":00"
        : formData.date;

      const dataToSubmit = { date: dateWithSeconds, se, syn, intVal };

      await createPerte(dataToSubmit);

      setMessage({ type: "success", text: "Données de perte enregistrées avec succès !" });

      // trigger refetch in parent so history updates immediately
      if (onSuccess) onSuccess();

      // Reset numeric fields, keep date
      setFormData(prev => ({ ...prev, se: "", syn: "", intVal: "" }));

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.erreur || err.message || "Une erreur est survenue lors de l'enregistrement.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Analyse Perte
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
              Nouvelle saisie
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Remplissez les informations nécessaires pour enregistrer une nouvelle analyse.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FlaskConical size={22} />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays size={16} />
            Date &amp; Heure
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <label className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Icon size={16} className="shrink-0 text-emerald-500" />
                  <span>{field.label}</span>
                </label>

                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-600 dark:bg-slate-900">
                  <input
                    type="number"
                    step="0.01"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                  />
                  <span className="shrink-0 select-none text-sm font-semibold text-slate-400">
                    %
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert */}
        {message.text && (
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0" />
            ) : (
              <AlertTriangle size={18} className="shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={18} />
              Enregistrer l'analyse
            </>
          )}
        </button>
      </form>
    </div>
  );
}