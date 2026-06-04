export default function LivePill({ connected, pulse }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
      connected 
        ? "border-accent-green/30 bg-accent-green/5 text-accent-green" 
        : "border-accent-red/30 bg-accent-red/5 text-accent-red"
    }`}>
      <div className="relative flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full ${connected ? "bg-accent-green" : "bg-accent-red"} ${pulse ? "scale-125" : "scale-100"} transition-transform duration-300`} />
        {connected && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-accent-green animate-ping opacity-40" />
        )}
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase">
        {connected ? "Système en direct" : "Hors ligne"}
      </span>
    </div>
  );
}
