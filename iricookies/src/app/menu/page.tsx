import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CookieCard from "@/components/CookieCard";
import { classics, fits, premiums, specials, PRICES } from "@/data/catalog";
import { bs } from "@/lib/format";

export const metadata: Metadata = {
  title: "El menú",
  description: "Todas las cookies de IriCookies con precios: clásicas 15 Bs, premium 20 Bs, Fit, Bake your own y Cookie Pie. Cajas de 6 (87 Bs) y 12 (168 Bs).",
};

const groups = [
  { id: "clasicas", title: "The favorites", note: `1 cookie · ${bs(PRICES.single)}  |  6 pack · ${bs(PRICES.box6)}  |  12 pack · ${bs(PRICES.box12)}`, items: classics, dark: false },
  { id: "premium", title: "Premium flavours", note: `Añade ${PRICES.premiumSurcharge} Bs por cada cookie premium en tus packs.`, items: premiums, dark: true },
  { id: "fit", title: "Fit, a tu manera", note: "Consulta los ingredientes al realizar tu pedido.", items: fits, dark: false },
  { id: "especiales", title: "Para compartir y hornear", note: "Sigue las indicaciones del empaque para servirlo.", items: specials, dark: true },
];

export default function MenuPage() {
  return (
    <>
      <PageHero eyebrow="El menú" title="El" script="menú." lead="Tu próximo antojo empieza acá. Todas nuestras cookies, sus precios y lo nuevo del horno." />
      <nav aria-label="Secciones del menú" className="sticky top-[5.25rem] z-30 -mt-7 flex justify-center px-4 md:top-24">
        <ul className="flex gap-1 overflow-x-auto rounded-full bg-cream p-1.5 text-sm font-semibold shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] ring-1 ring-ink/5">
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="block whitespace-nowrap rounded-full px-4 py-2.5 transition hover:bg-petal">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className={`scroll-mt-28 py-20 md:py-28 ${g.dark ? "bg-ink text-cream" : "bg-cream"}`}>
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div data-reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="display text-[clamp(2.8rem,6vw,5rem)]">{g.title}.</h2>
              <p className={`max-w-md text-sm font-semibold ${g.dark ? "text-rose" : "text-berry"}`}>{g.note}</p>
            </div>
            <div className={`mt-12 grid grid-cols-2 gap-3 sm:gap-5 ${g.items.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-2 lg:max-w-4xl"}`}>
              {g.items.map((p) => (
                <CookieCard key={p.slug} product={p} dark={g.dark} />
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="bg-blush py-20 text-center">
        <p className="display text-5xl md:text-6xl">
          ¿Lista tu <span className="script text-berry">combinación?</span>
        </p>
        <Link href="/arma-tu-caja" className="btn btn-ink mt-8">
          Arma tu caja de 6 o 12 →
        </Link>
      </section>
    </>
  );
}
