import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[10px] text-slate-400 font-mono tracking-wide">
      {time.toLocaleTimeString("fr-MA")} MAR
    </span>
  );
}
