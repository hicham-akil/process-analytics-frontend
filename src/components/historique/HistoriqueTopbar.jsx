import { useNavigate } from "react-router-dom";
import Clock from "../dashboard/shared/Clock";

export default function HistoriqueTopbar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-5 h-14 bg-slate-950/95 border-b border-white/5 sticky top-0 z-40 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-7 h-7 bg-violet-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm hover:bg-violet-300 transition-colors"
          title="Retour JFC1"
        >←</button>
        <div className="w-7 h-7 bg-violet-400 rounded flex items-center justify-center font-black text-[#060d1a] text-sm">◷</div>
        <span className="text-[13px] font-black text-violet-400 tracking-[.15em] uppercase">
          Historique — Indicateurs JFC1
        </span>
      </div>
      <Clock />
    </header>
  );
}
