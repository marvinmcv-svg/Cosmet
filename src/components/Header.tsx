"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { GROUPS } from "@/lib/taxonomy";
import { useCart, cartCount } from "@/lib/cart";
import { money } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { getLenis } from "./SmoothScroll";
import { useMounted } from "@/lib/useMounted";

type Menu = { label: string; href: string; group?: string; cols?: { title: string; links: { label: string; href: string }[] }[] };

const FEATURED_BRANDS = ["Chanel", "Dior", "Guerlain", "Lancôme", "Sisley", "Creed", "Xerjoff", "MAC", "Estée Lauder", "Clive Christian"];

const MENUS: Menu[] = [
  ...GROUPS.map<Menu>((g) => ({
    label: g.name,
    href: `/tienda/${g.slug}`,
    group: g.slug,
    cols: [
      {
        title: `Explorar ${g.name}`,
        links: [{ label: `Todo ${g.name}`, href: `/tienda/${g.slug}` }, ...g.children.map((c) => ({ label: c.name, href: `/tienda/${c.slug}` }))],
      },
      {
        title: "Para",
        links: [
          { label: "Ella", href: `/tienda/${g.slug}?para=ella` },
          { label: "Él", href: `/tienda/${g.slug}?para=el` },
          ...(g.slug === "fragancias" ? [{ label: "Unisex", href: "/tienda/fragancias?para=unisex" }, { label: "Niños", href: "/tienda/fragancias?para=ninos" }] : []),
        ],
      },
      {
        title: "Descubrir",
        links: [
          { label: "Novedades", href: `/tienda/${g.slug}?orden=nuevo` },
          { label: "Ofertas", href: `/tienda/${g.slug}?ofertas=1` },
          { label: "Menor precio", href: `/tienda/${g.slug}?orden=precio-asc` },
        ],
      },
    ],
  })),
  {
    label: "Marcas",
    href: "/marcas",
    cols: [
      {
        title: "Casas destacadas",
        links: FEATURED_BRANDS.map((b) => ({
          label: b,
          href: `/marcas/${b.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        })),
      },
      { title: "Directorio", links: [{ label: "Todas las marcas A–Z", href: "/marcas" }, { label: "Trending", href: "/trending" }] },
    ],
  },
  { label: "Ofertas", href: "/tienda?ofertas=1" },
  { label: "Tiendas", href: "/tiendas" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [hidden, setHidden] = useState(false);
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const mounted = useMounted();
  const inputRef = useRef<HTMLInputElement>(null);
  const count = mounted ? cartCount(lines) : 0;
  const [navDark, setNavDark] = useState(false);
  const dark = navDark;

  // close overlays on navigation (render-phase reset, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setActive(null);
    setSearchOpen(false);
    setMobileOpen(false);
  }

  // hide-on-scroll-down, show-on-scroll-up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > last);
      last = y;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 72)
        .find((el) => (el as HTMLElement).closest?.("[data-nav]"));
      const sec = (under as HTMLElement | undefined)?.closest("[data-nav]") as HTMLElement | null;
      setNavDark(sec?.dataset.nav === "dark");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (searchOpen || mobileOpen) lenis?.stop();
    else lenis?.start();
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActive(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) return;
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setResults(d.items ?? []))
        .catch(() => {});
    }, 140);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  const visibleResults = q.trim().length >= 2 ? results : [];
  const menu = active !== null ? MENUS[active] : null;

  return (
    <>
      <header
        onMouseLeave={() => setActive(null)}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          hidden && !menu ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-ink text-white/90 text-[11px] tracking-[0.18em] uppercase text-center py-1.5">
          Envío gratis en compras mayores a $50 · Retiro en tienda · Pago en cuotas
        </div>
        <nav
          className={`${menu ? "glass text-graphite" : dark ? "glass-dark text-white" : "glass text-graphite"} transition-colors duration-500 border-b ${
            dark && !menu ? "border-white/10" : "border-black/5"
          }`}
        >
          <div className="mx-auto flex h-12 max-w-[1100px] items-center justify-between px-5 text-[12.5px]">
            <Link href="/" className="shrink-0 opacity-95 hover:opacity-100" aria-label="Cosmet inicio">
              <Logo />
            </Link>
            <ul className="hidden lg:flex items-center gap-6">
              {MENUS.map((m, i) => (
                <li key={m.label} onMouseEnter={() => setActive(m.cols ? i : null)}>
                  <Link
                    href={m.href}
                    className={`py-4 opacity-80 transition-opacity hover:opacity-100 ${!m.href.includes("?") && pathname.startsWith(m.href) ? "opacity-100 font-medium" : ""}`}
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(true)} aria-label="Buscar" className="opacity-80 hover:opacity-100 p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
              <Link href="/favoritos" aria-label="Favoritos" className="relative p-1 opacity-80 hover:opacity-100 max-sm:hidden">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                </svg>
              </Link>
              <button onClick={() => setOpen(true)} aria-label="Bolsa de compras" className="relative opacity-80 hover:opacity-100 p-1">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 8h14l-1 13H6L5 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-current px-1 text-[9px] font-semibold">
                    <span className={dark && !menu ? "text-ink" : "text-white"}>{count}</span>
                  </span>
                )}
              </button>
              <button className="lg:hidden p-1" aria-label="Menú" aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((v) => !v)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9h16M4 15h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mega menu */}
          <div
            className={`hidden lg:block overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
              menu ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {menu?.cols && (
              <div key={menu.label} className="mx-auto grid max-w-[1100px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 px-5 pb-12 pt-8">
                {menu.cols.map((c, ci) => (
                  <div key={c.title}>
                    <p className="mb-4 text-xs text-smoke">{c.title}</p>
                    <ul className={ci === 0 ? "space-y-2" : "space-y-2.5"}>
                      {c.links.map((l, li) => (
                        <li key={l.href} style={{ animation: `menuIn .5s ${li * 0.03}s both cubic-bezier(.16,1,.3,1)` }}>
                          <Link href={l.href} className={`${ci === 0 ? "text-2xl font-semibold tracking-tight" : "text-[13px] font-medium"} hover:opacity-60 transition-opacity`}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* page dim behind mega menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${menu ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden
      />

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        aria-label="Menú principal"
        inert={!mobileOpen}
        className={`fixed inset-0 z-40 bg-white pt-24 px-8 transition-[opacity,transform] duration-500 lg:hidden ${
          mobileOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-4"
        }`}
      >
        <ul className="space-y-3">
          {[...MENUS, { label: "Trending", href: "/trending" }, { label: "Favoritos", href: "/favoritos" }, { label: "Nosotros", href: "/nosotros" }, { label: "Ayuda", href: "/ayuda" }].map((m, i) => (
            <li key={m.label} style={{ transitionDelay: `${i * 40}ms` }}>
              <Link href={m.href} className="text-3xl font-semibold tracking-tight">
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${searchOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar productos"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
        <div
          className={`relative glass mx-auto max-h-[85vh] overflow-y-auto pb-10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
            searchOpen ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          <form
            className="mx-auto max-w-[760px] px-6 pt-16"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/tienda?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <div className="flex items-center gap-4 border-b border-black/10 pb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-smoke">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar en Cosmet"
                className="w-full bg-transparent text-2xl md:text-3xl font-semibold tracking-tight outline-none placeholder:text-black/25"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-sm text-smoke hover:text-ink">
                Cerrar
              </button>
            </div>
            {visibleResults.length === 0 ? (
              <div className="pt-8">
                <p className="mb-3 text-xs text-smoke">Búsquedas populares</p>
                <div className="flex flex-wrap gap-2">
                  {["Sauvage", "Chanel N°5", "Euphoria", "La Bomba", "Rouge Dior", "Advanced Night Repair", "Aventus", "Labial MAC"].map((t) => (
                    <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full bg-black/5 px-4 py-2 text-sm hover:bg-black/10">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="pt-6 divide-y divide-black/5">
                {visibleResults.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/producto/${p.slug}`} className="flex items-center gap-4 py-3 group">
                      <span className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt="" className="h-full w-full object-contain" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-smoke">{p.brand}</span>
                        <span className="block truncate font-medium group-hover:underline">{p.name}</span>
                      </span>
                      <span className="text-sm font-medium">{money(p.price)}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <button className="link-arrow text-sm text-ink">Ver todos los resultados para “{q}”</button>
                </li>
              </ul>
            )}
          </form>
        </div>
      </div>
      <style>{`@keyframes menuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
