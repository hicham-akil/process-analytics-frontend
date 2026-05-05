export default function LivePill({ connected, pulse }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
      <span className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${
        connected ? "bg-emerald-400" : "bg-red-400"
      } ${pulse ? "opacity-100" : "opacity-20"}`} />
      <span className="text-[9px] font-bold tracking-widest text-emerald-400">
        {connected ? "DIRECT" : "HORS LIGNE"}
      </span>
    </span>
  );
}
