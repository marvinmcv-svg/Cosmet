/** Hand-drawn ribbon bow, echoing the IriCookies menu. */
export function Bow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M60 30C48 14 22 2 12 12c-9 9 2 26 20 26 12 0 22-4 28-8Z" />
      <path d="M60 30c12-16 38-28 48-18 9 9-2 26-20 26-12 0-22-4-28-8Z" />
      <path d="M60 30c-4 10-12 26-22 38M60 30c4 10 12 26 22 38" />
      <circle cx="60" cy="30" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}
