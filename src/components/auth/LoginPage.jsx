import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../services/authService";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      login(data);
    } catch {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#060d1a] min-h-screen flex items-center justify-center font-mono">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center font-black text-[#060d1a] text-2xl mb-4">
            O
          </div>
          <h1 className="text-[13px] font-black text-emerald-400 tracking-[.15em] uppercase">
            JFC3 — Acide Phosphorique
          </h1>
          <p className="text-[10px] text-slate-600 mt-1 tracking-widest uppercase">
            Système de Monitoring
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-slate-900 border border-white/5 p-6">
          <p className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500 mb-5">
            ◈ Connexion
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="nom.utilisateur"
                required
                autoFocus
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold tracking-[.1em] uppercase text-slate-500">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60 transition-colors placeholder:text-slate-600"
              />
            </div>

            {error && (
              <div className="text-[10px] font-bold p-3 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-[.1em] uppercase hover:bg-emerald-500/30 disabled:opacity-50 transition-all mt-2"
            >
              {loading
                ? <span className="animate-spin inline-block w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full" />
                : "→"}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        {/* Role hint */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-900/50 border border-white/5 p-3">
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1">LABO</p>
            <p className="text-[9px] text-slate-600">Lecture + Saisie pertes</p>
          </div>
          <div className="rounded-lg bg-slate-900/50 border border-white/5 p-3">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">VIEWER</p>
            <p className="text-[9px] text-slate-600">Lecture seule</p>
          </div>
        </div>
      </div>
    </div>
  );
}