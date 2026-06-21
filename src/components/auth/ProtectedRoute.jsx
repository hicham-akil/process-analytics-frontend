import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import LoginPage from "./LoginPage";

export default function ProtectedRoute({ children, requireLabo = false, requireAdmin = false }) {
  const { user, isLabo, isAdmin } = useAuth();

  if (!user) return <LoginPage />;
  if (requireLabo && !isLabo) return <AccessDenied />;
  if (requireAdmin && !isAdmin) return <AccessDenied />;

  return children;
}

function AccessDenied() {
  return (
    <div className="bg-background-base min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-slide-up">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-accent-red/10 flex items-center justify-center text-accent-red shadow-2xl shadow-accent-red/20">
            <ShieldAlert size={40} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Accès Restreint</h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Désolé, vous n'avez pas les permissions nécessaires pour accéder à ce module. 
            Cette section est réservée au personnel du laboratoire JFC3.
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background-surface border border-border-subtle text-sm font-bold text-text-primary hover:bg-white/5 hover:border-border-medium transition-all"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}
