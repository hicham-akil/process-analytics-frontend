import { useAuth } from "../../context/AuthContext";
import LoginPage from "./LoginPage";

export default function ProtectedRoute({ children, requireLabo = false }) {
  const { user, isLabo } = useAuth();

  if (!user) return <LoginPage />;
  if (requireLabo && !isLabo) return <AccessDenied />;

  return children;
}

function AccessDenied() {
  const { logout } = useAuth();
  return (
    <div className="bg-[#060d1a] min-h-screen flex items-center justify-center font-mono">
      <div className="text-center">
        <p className="text-5xl mb-4 opacity-20 text-red-400">⊘</p>
        <p className="text-slate-400 text-sm font-bold mb-1">Accès refusé</p>
        <p className="text-slate-600 text-[10px]">Cette page est réservée au rôle LABO</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-800 border border-white/5 text-slate-400 text-[10px] font-bold hover:bg-slate-700 transition-colors"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}