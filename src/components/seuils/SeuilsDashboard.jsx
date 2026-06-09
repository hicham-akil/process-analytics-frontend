import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Save, SlidersHorizontal } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import { AlertPanel } from "../dashboard/AlertPanel";
import useJFC1Data from "../../hooks/useJFC1Data";
import { useSeuils } from "../../context/SeuilsContext";
import { useAuth } from "../../context/AuthContext";

const GROUPS = [
  { title: "Pertes gypse", codes: ["se", "syn", "intVal"] },
  { title: "Rendements", codes: ["rc", "ri"] },
  { title: "Consommations", codes: ["consoH2so4", "consoEauBrute", "consoPhosphates", "consoVapeur"] },
  { title: "Analyses labo", codes: ["cap", "p2o5Gypse", "caOGypse", "p2o5Phosphate", "caOPhosphate"] },
];

const emptyToNumber = (value) => value === "" ? null : Number(value);

function SeuilRow({ seuil, draft, onChange, onSave, saving }) {
  if (!seuil) return null;

  const typeLabel = seuil.type === "min" ? "Minimum" : "Maximum";
  const warningHelp = seuil.type === "min"
    ? "warning >= critique"
    : "warning <= critique";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.7fr_1fr_1fr_auto] gap-4 items-center p-4 rounded-xl bg-background-cards border border-border-subtle hover:border-border-medium transition-all">
      <div>
        <p className="text-sm font-bold text-text-primary">{seuil.label || seuil.code}</p>
        <p className="text-[10px] uppercase tracking-widest text-text-muted font-mono">{seuil.code}</p>
      </div>

      <span className={`w-fit px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
        seuil.type === "min" ? "bg-accent-green/10 text-accent-green" : "bg-accent-blue/10 text-accent-blue"
      }`}>
        {typeLabel}
      </span>

      <label className="space-y-1">
        <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Warning</span>
        <input
          type="number"
          step="0.0001"
          value={draft.warning}
          onChange={(e) => onChange(seuil.code, "warning", e.target.value)}
          placeholder="Optionnel"
          className="w-full bg-background-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/70"
        />
        <span className="block text-[9px] text-text-muted">{warningHelp}</span>
      </label>

      <label className="space-y-1">
        <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Critique</span>
        <input
          type="number"
          step="0.0001"
          value={draft.critique}
          onChange={(e) => onChange(seuil.code, "critique", e.target.value)}
          className="w-full bg-background-base border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent-blue/70"
        />
      </label>

      <button
        onClick={() => onSave(seuil)}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue/90 disabled:opacity-50 transition-all"
      >
        {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
        Sauver
      </button>
    </div>
  );
}

export default function SeuilsDashboard() {
  const { items, seuilsNiveaux, loading, error, refresh, updateSeuil } = useSeuils();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState({});
  const [savingCode, setSavingCode] = useState("");
  const [message, setMessage] = useState("");
  const {
    connected,
    pulse,
    lastUpdate,
    alertesNonAcquittees,
    showAlertPanel,
    setShowAlertPanel,
    acquitter,
  } = useJFC1Data();

  useEffect(() => {
    setDrafts(Object.fromEntries(
      Object.entries(seuilsNiveaux).map(([code, seuil]) => [
        code,
        {
          warning: seuil.warning ?? "",
          critique: seuil.critique ?? "",
        },
      ])
    ));
  }, [seuilsNiveaux]);

  const byCode = Object.fromEntries(items.map(item => [
    item.code,
    {
      ...item,
      type: String(item.type || "MAX").toLowerCase(),
    },
  ]));

  const handleChange = (code, field, value) => {
    setDrafts(prev => ({
      ...prev,
      [code]: { ...prev[code], [field]: value },
    }));
  };

  const handleSave = async (seuil) => {
    const draft = drafts[seuil.code];
    const warning = emptyToNumber(draft.warning);
    const critique = emptyToNumber(draft.critique);

    setMessage("");
    if (critique == null || Number.isNaN(critique)) {
      setMessage("Le seuil critique est obligatoire.");
      return;
    }

    setSavingCode(seuil.code);
    try {
      await updateSeuil(seuil.code, { warning, critique });
      setMessage(`Seuil ${seuil.code} mis a jour.`);
    } catch (err) {
      console.error("Erreur sauvegarde seuil:", err);
      setMessage(err?.response?.data?.erreur || "Impossible de sauvegarder ce seuil.");
    } finally {
      setSavingCode("");
    }
  };

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
        onToggleAlerts={() => setShowAlertPanel(v => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          alertesCount={alertesNonAcquittees.length}
          connected={connected}
          onToggleAlerts={() => setShowAlertPanel(v => !v)}
        />

        <main className="flex-1 overflow-y-auto p-8 ml-16 bg-background-base">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-slide-up">
            <section className="relative overflow-hidden rounded-2xl bg-background-surface border border-border-medium p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                    <SlidersHorizontal size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Configuration seuils</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Pilotage des seuils</h1>
                  <p className="text-sm text-text-secondary max-w-2xl">
                    Les seuils modifies ici alimentent les cartes, les jauges, les alertes backend et les comparaisons historiques.
                  </p>
                </div>

                <button
                  onClick={refresh}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-background-cards border border-border-subtle text-sm font-bold text-text-primary hover:border-border-medium disabled:opacity-50 transition-all"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Recharger
                </button>
              </div>
            </section>

            {(message || error) && (
              <div className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${
                message?.startsWith("Seuil")
                  ? "bg-accent-green/10 border-accent-green/20 text-accent-green"
                  : "bg-accent-amber/10 border-accent-amber/20 text-accent-amber"
              }`}>
                {message?.startsWith("Seuil") ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                {message || error}
              </div>
            )}

            {GROUPS.map(group => (
              <section key={group.title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">{group.title}</h2>
                  <span className="text-[10px] font-bold text-text-muted uppercase">Role: {user?.role}</span>
                </div>

                <div className="space-y-3">
                  {group.codes.map(code => (
                    <SeuilRow
                      key={code}
                      seuil={byCode[code] || { code, ...seuilsNiveaux[code] }}
                      draft={drafts[code] || { warning: "", critique: "" }}
                      onChange={handleChange}
                      onSave={handleSave}
                      saving={savingCode === code}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
