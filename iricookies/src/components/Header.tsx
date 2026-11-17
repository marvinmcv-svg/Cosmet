"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Logo from "./Logo";
import { cartCount, useCart } from "@/lib/cart";
import { useMounted } from "@/lib/useMounted";

const NAV = [
  { href: "/menu", label: "Menú" },
  { href: "/arma-tu-caja", label: "Arma tu caja" },
  { href: "/#especiales", label: "Especiales" },
  { href: "/eventos", label: "Eventos" },
];

export function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className={className}>
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" strokeLinejoin="round" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const mounted = useMounted();
  const count = mounted ? cartCount(lines) : 0;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={clsx(
          "mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full pl-5 pr-2 text-cream transition-all duration-700 ease-[var(--ease-out-expo)] md:h-16 md:pl-7",
          scrolled || menu ? "bg-ink/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <Link href="/" aria-label="IriCookies — inicio" className="text-[1.45rem] text-petal md:text-[1.6rem]">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={clsx(
                "rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors hover:bg-white/10",
                pathname === n.href ? "text-petal" : "text-cream/85"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-full bg-petal px-4 text-sm font-semibold text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.04] md:h-12 md:px-5"
            aria-label={`Abrir bolsa (${count} ${count === 1 ? "producto" : "productos"})`}
          >
            <BagIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Bolsa</span>
            <span
              className={clsx(
                "grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs text-petal transition-transform duration-500",
                count ? "scale-100" : "scale-0"
              )}
              aria-hidden
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            className="grid h-11 w-11 place-items-center rounded-full text-cream hover:bg-white/10 md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="relative block h-3 w-5">
              <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500", menu ? "top-1.5 rotate-45" : "top-0")} />
              <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500", menu ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Móvil"
        className={clsx(
          "mx-auto mt-2 max-w-7xl overflow-hidden rounded-[2rem] bg-ink/95 text-cream ring-1 ring-white/10 backdrop-blur-xl transition-all duration-700 ease-[var(--ease-out-expo)] md:hidden",
          menu ? "max-h-[420px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col p-3">
          {[{ href: "/", label: "Inicio" }, ...NAV].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-2xl px-5 py-4 font-serif text-3xl tracking-tight hover:bg-white/5" tabIndex={menu ? 0 : -1}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
