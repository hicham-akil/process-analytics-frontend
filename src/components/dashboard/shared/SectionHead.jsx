export default function SectionHead({ icon, label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-2">
        <span className="text-accent-blue opacity-80">{icon}</span>
        <h3 className="text-xs font-bold tracking-[0.1em] uppercase text-text-secondary whitespace-nowrap">
          {label}
        </h3>
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-border-subtle to-transparent" />
    </div>
  );
}
