import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../services/authService";
import { ShieldCheck, User, Lock, ArrowRight, Loader2 } from "lucide-react";

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
    <div className="bg-background-base min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] relative z-10 px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center shadow-2xl shadow-accent-blue/40 mb-6">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight text-center">
            JFC3 <span className="text-accent-blue">PRO</span>
          </h1>
          <p className="text-sm text-text-muted mt-2 tracking-wide font-medium">
            Atelier Acide Phosphorique — Monitoring
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-background-surface border border-border-medium p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-4 bg-accent-blue rounded-full" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-text-secondary">Authentification</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-text-muted flex items-center gap-2">
                <User size={12} /> Identifiant
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="nom.utilisateur"
                  required
                  autoFocus
                  className="w-full bg-background-base border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/60 focus:ring-4 focus:ring-accent-blue/10 transition-all placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-text-muted flex items-center gap-2">
                <Lock size={12} /> Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-background-base border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/60 focus:ring-4 focus:ring-accent-blue/10 transition-all placeholder:text-text-muted"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs font-bold p-4 rounded-xl border bg-accent-red/10 border-accent-red/20 text-accent-red animate-shake">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent-blue text-white text-sm font-bold shadow-lg shadow-accent-blue/25 hover:bg-accent-blue/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 transition-all duration-200"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Se connecter <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* Info badges */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-surface/50 border border-border-subtle">
            <div className="w-1.5 h-1.5 bg-accent-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-text-secondary uppercase">Système JFC3</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-surface/50 border border-border-subtle">
            <div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-bold text-text-secondary uppercase">v2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}