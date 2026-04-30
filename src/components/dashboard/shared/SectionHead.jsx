export default function SectionHead({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span className="text-[9px] font-bold tracking-[.15em] uppercase text-slate-500">
        {icon} {label}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
