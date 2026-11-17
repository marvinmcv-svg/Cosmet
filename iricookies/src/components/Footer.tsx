import Link from "next/link";
import Logo from "./Logo";
import { BRAND } from "@/data/catalog";
import { waLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-cream">
      <div className="stripes h-4 opacity-90" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="script text-5xl text-petal md:text-6xl">Baked for your happy moments.</p>
            <p className="mt-6 max-w-sm text-cream/55">
              Homemade cookies by @{BRAND.founder}. {BRAND.service} en {BRAND.city}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink("¡Hola IriCookies! 🍪")} target="_blank" rel="noopener" className="btn btn-pink">
                WhatsApp {BRAND.whatsappDisplay}
              </a>
              <a href={`https://www.instagram.com/${BRAND.instagram}/`} target="_blank" rel="noopener" className="btn btn-ghost text-cream">
                <span>@{BRAND.instagram}</span>
              </a>
            </div>
          </div>
          <nav aria-label="Tienda">
            <p className="eyebrow text-rose">Tienda</p>
            <ul className="mt-5 space-y-3 text-cream/75">
              <li><Link className="hover:text-petal" href="/menu">El menú</Link></li>
              <li><Link className="hover:text-petal" href="/arma-tu-caja">Arma tu caja</Link></li>
              <li><Link className="hover:text-petal" href="/menu#premium">Premium</Link></li>
              <li><Link className="hover:text-petal" href="/menu#fit">Fit</Link></li>
              <li><Link className="hover:text-petal" href="/#especiales">Bake your own · Cookie pie</Link></li>
            </ul>
          </nav>
          <nav aria-label="IriCookies">
            <p className="eyebrow text-rose">IriCookies</p>
            <ul className="mt-5 space-y-3 text-cream/75">
              <li><Link className="hover:text-petal" href="/eventos">Alquila el carrito</Link></li>
              <li><Link className="hover:text-petal" href="/#faq">Preguntas frecuentes</Link></li>
              <li>📍 {BRAND.city}</li>
              <li>🛵 {BRAND.service}</li>
            </ul>
          </nav>
        </div>
        <div className="mt-20 overflow-hidden">
          <Logo className="w-full justify-center text-[clamp(3.5rem,15vw,14rem)] leading-none text-petal" />
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/40 md:flex-row">
          <p>© {new Date().getFullYear()} IriCookies · good fillings</p>
          <p>Hecho con 🩷 en Santa Cruz de la Sierra</p>
        </div>
      </div>
    </footer>
  );
}
