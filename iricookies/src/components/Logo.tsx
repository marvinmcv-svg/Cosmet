import clsx from "clsx";

/** Cookie-with-a-bite mark, drawn after the IriCookies menu logo. */
export function CookieMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <path
        d="M47.5 12.2A26 26 0 1 0 57.6 37"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M47.5 12.2c-2.6 2.8-2.2 6.8.8 8.6 1.6 4 6 5.4 9.2 3.4 2.6 3.4 2.4 8.4.1 12.8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="4.6" fill="currentColor" />
      <circle cx="35" cy="22" r="3" fill="currentColor" />
      <circle cx="31" cy="40" r="3.2" fill="currentColor" />
      <circle cx="55" cy="6" r="3.4" fill="currentColor" />
      <circle cx="46" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      {mark && <CookieMark className="h-[1.35em] w-[1.35em] -translate-y-[0.06em]" />}
      <span className="font-serif font-semibold tracking-[-0.04em]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}>
        IriCookies
      </span>
    </span>
  );
}
