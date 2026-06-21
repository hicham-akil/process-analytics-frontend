import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Lock, LogOut, UserPlus, Users } from "lucide-react";
import { createUserApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = { username: "", password: "", role: "VIEWER" };

export default function UserManagement() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const updateField = (event) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCreatedUser(null);
    setLoading(true);

    try {
      const user = await createUserApi({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });
      setCreatedUser(user);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err?.response?.data?.erreur || "Impossible de creer cet utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-base min-h-screen text-text-primary font-inter">
      <header className="h-16 border-b border-border-subtle bg-background-surface px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-blue flex items-center justify-center font-bold text-white">J</div>
          <div>
            <p className="text-sm font-bold">Administration JFC3</p>
            <p className="text-[10px] uppercase tracking-widest text-text-muted">Gestion des utilisateurs</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-secondary">{user?.username}</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-subtle text-xs font-bold text-text-secondary hover:text-accent-red hover:border-accent-red/30 transition-all"
          >
            <LogOut size={15} /> Deconnexion
          </button>
        </div>
      </header>

      <main className="p-8 bg-background-base">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-slide-up">
            <section className="relative overflow-hidden rounded-2xl bg-background-surface border border-border-medium p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-green/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Administration</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Creer un utilisateur</h1>
                <p className="text-sm text-text-secondary max-w-2xl">
                  Ajoutez un compte laboratoire avec droits de saisie ou un compte en lecture seule.
                </p>
              </div>
            </section>

            <section className="rounded-2xl bg-background-surface border border-border-medium p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-text-muted">Nom d'utilisateur</span>
                  <input
                    name="username"
                    value={form.username}
                    onChange={updateField}
                    minLength={3}
                    maxLength={50}
                    pattern="[A-Za-z0-9._-]+"
                    required
                    autoFocus
                    className="w-full bg-background-base border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/60 focus:ring-4 focus:ring-accent-blue/10 transition-all"
                    placeholder="nom.utilisateur"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-text-muted">Mot de passe</span>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={updateField}
                      minLength={8}
                      maxLength={100}
                      required
                      className="w-full bg-background-base border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/60 focus:ring-4 focus:ring-accent-blue/10 transition-all"
                      placeholder="8 caracteres minimum"
                    />
                  </div>
                </label>

                <fieldset className="space-y-3">
                  <legend className="text-xs font-bold tracking-wider uppercase text-text-muted mb-2">Role</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: "LABO", label: "Laboratoire", help: "Consultation et saisie des pertes" },
                      { value: "VIEWER", label: "Viewer", help: "Consultation en lecture seule" },
                    ].map(option => (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          form.role === option.value
                            ? "bg-accent-blue/10 border-accent-blue/50"
                            : "bg-background-base border-border-subtle hover:border-border-medium"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={form.role === option.value}
                          onChange={updateField}
                          className="sr-only"
                        />
                        <span className="block text-sm font-bold text-text-primary">{option.label}</span>
                        <span className="block mt-1 text-xs text-text-muted">{option.help}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border bg-accent-red/10 border-accent-red/20 p-4 text-sm font-semibold text-accent-red">
                    <AlertTriangle size={18} /> {error}
                  </div>
                )}

                {createdUser && (
                  <div className="flex items-center gap-2 rounded-xl border bg-accent-green/10 border-accent-green/20 p-4 text-sm font-semibold text-accent-green">
                    <CheckCircle2 size={18} />
                    Le compte {createdUser.username} ({createdUser.role}) a ete cree.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent-blue text-white text-sm font-bold shadow-lg shadow-accent-blue/25 hover:bg-accent-blue/90 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  {loading ? "Creation..." : "Creer l'utilisateur"}
                </button>
              </form>
            </section>
          </div>
      </main>
    </div>
  );
}
