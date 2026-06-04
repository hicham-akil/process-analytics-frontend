import { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-background-cards/50 rounded-lg border border-border-subtle">
      <ClockIcon size={12} className="text-text-muted" />
      <span className="text-[11px] text-text-primary font-mono font-bold tracking-tight">
        {time.toLocaleTimeString("fr-MA")}
      </span>
      <span className="text-[9px] text-text-muted font-bold uppercase">UTC</span>
    </div>
  );
}
