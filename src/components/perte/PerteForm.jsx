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
  Loader2
} from "lucide-react";
import { createPerte } from "../../services/perteService";

// ✅ fields array defined outside the component
const fields = [
  {
    name: "se",
    label: "SE",
    placeholder: "0.00",
    icon: Droplets,
    color: "text-accent-cyan"
  },
  {
    name: "syn",
    label: "SYN",
    placeholder: "0.00",
    icon: Layers3,
    color: "text-accent-blue"
  },
  {
    name: "intVal",
    label: "INT",
    placeholder: "0.00",
    icon: Activity,
    color: "text-accent-amber"
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
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-background-cards shadow-xl animate-fade-slide-up">
      {/* Header */}
      <div className="border-b border-border-subtle px-8 py-6 bg-background-surface/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-green">
              Laboratoire JFC3
            </p>
            <h2 className="mt-1 text-xl font-bold text-text-primary tracking-tight">
              Nouvelle Saisie d'Analyse
            </h2>
            <p className="mt-1 text-xs text-text-muted">
              Enregistrez les résultats des analyses de pertes gypse.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green shadow-lg shadow-accent-green/5">
            <FlaskConical size={24} />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 p-8">
        {/* Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
            <CalendarDays size={14} className="text-accent-blue" />
            Date & Heure du Prélèvement
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border-subtle bg-background-base px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.name}
                className="space-y-3 p-4 rounded-xl border border-border-subtle bg-background-surface/30 group hover:border-border-medium transition-colors"
              >
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  <Icon size={14} className={`shrink-0 ${field.color}`} />
                  <span>{field.label}</span>
                </label>

                <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-base px-3 py-2.5 transition-all focus-within:border-accent-green/50">
                  <input
                    type="number"
                    step="0.01"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="min-w-0 flex-1 bg-transparent text-sm font-mono font-bold text-text-primary outline-none"
                  />
                  <span className="shrink-0 select-none text-[10px] font-bold text-text-muted">
                    %
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-5 py-4 text-sm font-medium animate-fade-slide-up ${
              message.type === "success"
                ? "border-accent-green/20 bg-accent-green/10 text-accent-green"
                : "border-accent-red/20 bg-accent-red/10 text-accent-red"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-green px-6 py-4 text-sm font-bold text-white shadow-lg shadow-accent-green/20 transition-all hover:bg-accent-green/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {loading ? "Traitement en cours..." : "Valider l'enregistrement"}
        </button>
      </form>
    </div>
  );
}