/** Vector redraw of the Cosmet arch emblem + wordmark. */
export function Emblem({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
      <path d="M15 11a9 9 0 0 1 18 0" />
      <path d="M10 13.5h28" />
      <path d="M8 42V25a5 5 0 0 1 10 0v17M19 42V25a5 5 0 0 1 10 0v17M30 42V25a5 5 0 0 1 10 0v17" />
    </svg>
  );
}

export default function Logo({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  if (stacked)
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <Emblem className="h-10 w-auto" />
        <span className="text-[0.95rem] font-medium tracking-[0.55em] pl-[0.55em]">COSMET</span>
      </span>
    );
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Cosmet">
      <Emblem className="h-[22px] w-auto" />
      <span className="text-[0.82rem] font-medium tracking-[0.5em]">COSMET</span>
    </span>
  );
}
