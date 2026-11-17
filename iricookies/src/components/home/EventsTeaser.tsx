import Image from "next/image";
import Link from "next/link";

export default function EventsTeaser() {
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-cream md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div data-reveal className="relative order-2 aspect-[55/64] overflow-hidden rounded-[2.25rem] bg-blush lg:order-1">
          <Image src="/img/cart.webp" alt="El carrito rosa de IriCookies con vitrina de cookies" fill sizes="(min-width: 1024px) 600px, 95vw" className="object-contain" />
          <span className="absolute left-5 top-5 rounded-full bg-berry px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">Nuevo</span>
        </div>
        <div data-reveal className="order-1 lg:order-2">
          <p className="eyebrow text-rose">Alquila tu carrito</p>
          <h2 className="display mt-5 text-[clamp(3.2rem,8vw,7rem)]">
            Tu evento, <span className="script block pl-[0.35em] text-[0.8em] text-petal">junto a IriCookies.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/65">
            Llevamos el carrito de IriCookies, con su vitrina llena de cookies, a tu cumpleaños, celebración o evento.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm">
            {["Cumpleaños", "Celebraciones", "Eventos"].map((t) => (
              <li key={t} className="rounded-full px-4 py-2 ring-1 ring-white/15">
                {t}
              </li>
            ))}
          </ul>
          <Link href="/eventos" className="btn btn-pink mt-10">
            Cotizar mi evento <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
