import Link from "next/link";
import Hero from "@/components/home/Hero";
import Campaigns, { type Campaign } from "@/components/home/Campaigns";
import HorizontalRail from "@/components/home/HorizontalRail";
import WordScrub from "@/components/home/WordScrub";
import Counter from "@/components/home/Counter";
import ProductCard from "@/components/ProductCard";
import Tilt from "@/components/Tilt";
import { SplitReveal, Reveal, Parallax } from "@/components/Motion";
import { homeSection, getProduct, getBrands, search, summary, pick } from "@/lib/catalog";
import { GROUPS } from "@/lib/taxonomy";
import { INSTAGRAM_POSTS, CONTACT, STORES } from "@/lib/info";

const LOGOS = [
  ["chanel", "Chanel-1.jpg"],
  ["dior", "DIOR300X150_2.png"],
  ["guerlain", "GUERLAIN_300x150_1.png"],
  ["lancome", "lancome-300x50.jpg"],
  ["sisley", "sisley-300x150.jpg"],
  ["creed", "Creed-300x150.jpg"],
  ["xerjoff", "logo_300x150_xerjoff.jpg"],
  ["estee-lauder", "LogoEst_eLauder350x150.png"],
  ["mac", "MAC-2-300x150.png"],
  ["yves-saint-laurent", "YvesSaint_300x150.png"],
  ["montblanc", "mont-blanc-logo-300-x-150.png"],
  ["marc-jacobs", "marc_jacobs_300_x_150.png"],
  ["burberry", "burberry_300_x_150.png"],
  ["hugo-boss", "boss-300x150.jpg"],
  ["l-occitane", "loccitane-300x15.jpg"],
  ["bond-no-9", "Bond-300x150.jpg"],
  ["tous", "tous-300x150.jpg"],
  ["marina-de-bourbon", "logo-marina-de-bourbon-300-x-150.png"],
] as const;

const CAT_TILES = [
  { g: "fragancias", slug: "miss-dior-d33d382", tone: "bg-[#f4efe9]" },
  { g: "maquillaje", slug: "dior-backstage-glassy-glow-stick-d33d368", tone: "bg-[#f3eef0]" },
  { g: "tratamiento", slug: "abeille-royale-night-cream-429g173", tone: "bg-[#f6f1e6]" },
  { g: "regalos", slug: "coffret-jadore-edition-limite-e100000101", tone: "bg-[#eef0f3]" },
];

function campaigns(): Campaign[] {
  return [
    { img: "/media/banners/guerlain-tall.jpg", brand: "Guerlain", title: "L’Heure Bleue", sub: "Descubre el aroma del cielo. La nueva fragancia.", href: "/producto/l-heure-bleue-429g171", products: pick(["l-heure-bleue-429g171"]) },
    { img: "/media/banners/euphoria-tall.jpg", brand: "Calvin Klein", title: "Euphoria Elixir", sub: "The new elixir collection.", href: "/tienda?q=euphoria+elixir", products: search({ q: "euphoria elixir" }).slice(0, 3).map(summary) },
    { img: "/media/banners/dior-backstage-tall.jpg", brand: "Dior Backstage", title: "Glassy Glow Stick", sub: "Prepárate para brillar con el nuevo iluminador.", href: "/producto/dior-backstage-glassy-glow-stick-d33d368", products: pick(["dior-backstage-glassy-glow-stick-d33d368", "backstage-rosy-glow-stick-d33d320"]) },
    { img: "/media/banners/carolina-herrera-la-bomba.jpg", brand: "Carolina Herrera", title: "La Bomba", sub: "Fragancias seductoras de Carolina Herrera.", href: "/tienda?q=la+bomba", products: pick(["la-bomba-62c60", "la-bomba-intense-62c68", "la-bomba-set-65245708"]) },
    { img: "/media/banners/chloe.jpg", brand: "Chloé", title: "Atelier des Fleurs", sub: "Los más virales.", href: "/tienda?q=atelier+des+fleurs", products: search({ q: "atelier des fleurs" }).slice(0, 3).map(summary) },
  ];
}

export default function Home() {
  const launches = homeSection("launches");
  const bestsellers = homeSection("bestsellers");
  const viral = homeSection("viral");
  const onSale = search({ sale: true, cat: "fragancias" }).slice(0, 4).map(summary);
  const brandCount = getBrands().length;

  return (
    <>
      <Hero />

      {/* —— Intro statement —— */}
      <section className="bg-white px-6 pb-10 pt-28 md:pt-40" data-nav="light">
        <div className="mx-auto max-w-[1100px] text-center">
          <SplitReveal
            as="h2"
            className="display text-[11vw] md:text-[5.6vw]"
            lines={[
              "Lo nuevo de",
              <span key="l2">
                las casas <span className="serif-italic font-normal">más deseadas.</span>
              </span>,
            ]}
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-smoke md:text-xl">
              Lanzamientos de Dior, Clive Christian, Calvin Klein y más, recién llegados a Cosmet.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-6 pb-28" data-nav="light">
        <Reveal className="mx-auto grid max-w-[1300px] grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4" stagger={0.08}>
          {launches.slice(0, 8).map((p, i) => (
            <ProductCard key={p.slug} p={p} priority={i < 4} />
          ))}
        </Reveal>
        <div className="mt-14 text-center">
          <Link href="/tienda?orden=nuevo" className="btn btn-dark">
            Ver todas las novedades
          </Link>
        </div>
      </section>

      <Campaigns items={campaigns()} />

      {/* —— Categories with 3D tilt —— */}
      <section className="bg-white px-6 py-28 md:py-40" data-nav="light">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SplitReveal as="h2" className="display text-5xl md:text-7xl" lines={["Explora", <span key="x" className="serif-italic font-normal">por mundo.</span>]} />
            <Reveal>
              <p className="max-w-sm text-smoke md:text-lg">Fragancias, maquillaje y tratamiento de más de {brandCount} casas, con asesoría experta en cada paso.</p>
            </Reveal>
          </div>
          <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {CAT_TILES.map((t) => {
              const g = GROUPS.find((x) => x.slug === t.g)!;
              const p = getProduct(t.slug);
              return (
                <Link key={t.g} href={`/tienda/${t.g}`} className="block">
                  <Tilt className={`group aspect-[3/4] overflow-hidden rounded-[28px] ${t.tone}`} max={9}>
                    <div className="tilt-layer absolute left-7 top-7 right-7" style={{ ["--z" as string]: "60px" }}>
                      <p className="eyebrow text-smoke">{g.children.length || ""} {g.children.length ? "categorías" : ""}</p>
                      <h3 className="mt-2 text-4xl font-semibold tracking-tight">{g.name}</h3>
                      <p className="mt-2 text-[14px] leading-snug text-smoke">{g.tagline}</p>
                    </div>
                    {p && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.gallery[0] ?? p.img}
                        alt={`${p.brand} ${p.name}`}
                        loading="lazy"
                        className="tilt-layer img-product absolute bottom-0 left-1/2 h-[62%] w-[80%] -translate-x-1/2 object-contain transition-transform duration-700 group-hover:scale-105"
                        style={{ ["--z" as string]: "90px" }}
                      />
                    )}
                    <span className="tilt-layer absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white" style={{ ["--z" as string]: "70px" }}>
                      →
                    </span>
                  </Tilt>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>

      <HorizontalRail
        eyebrow="Los más vendidos"
        title={
          <>
            Favoritos de <span className="serif-italic font-normal">Bolivia.</span>
          </>
        }
        items={[...new Map([...bestsellers, ...viral].map((p) => [p.slug, p])).values()].slice(0, 16)}
        href="/tienda/fragancias"
      />

      {/* —— Brand marquee —— */}
      <section className="overflow-hidden border-y border-black/5 bg-white py-14" data-nav="light">
        <p className="eyebrow mb-10 text-center text-smoke">Casas de lujo en Cosmet</p>
        {[0, 1].map((row) => (
          <div key={row} className="marquee mb-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="marquee-track gap-6" style={{ ["--marquee-speed" as string]: row ? "55s" : "45s", animationDirection: row ? "reverse" : "normal" }}>
              {[...LOGOS, ...LOGOS].map(([slug, file], i) => (
                <Link key={i} href={`/marcas/${slug}`} className="flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl bg-white grayscale transition hover:grayscale-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/logos/${file}`} alt={slug} className="max-h-16 w-auto mix-blend-multiply" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-6 text-center">
          <Link href="/marcas" className="link-arrow text-ink">
            Ver las {brandCount} marcas
          </Link>
        </div>
      </section>

      {/* —— Story —— */}
      <section className="grain relative bg-ink px-6 py-32 text-white md:py-48" data-nav="dark">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow text-white/50">Nuestra historia</p>
          <WordScrub
            className="mt-8 text-3xl font-semibold leading-[1.15] tracking-tight md:text-[3.4vw]"
            text="En 1975, María Teresa Martinez creó la primera tienda moderna de lujo en Bolivia — y con ella, toda una industria. Hoy, junto a sus hijas Jeanine y Jasmina, Cosmet es un referente por su servicio impecable y sus productos de belleza, moda y colección premium del hogar."
          />
          <div className="mt-24 grid grid-cols-2 gap-y-14 border-t border-white/10 pt-14 md:grid-cols-4">
            {[
              { n: 50, s: "+", l: "años de historia" },
              { n: 7, s: "", l: "tiendas en Bolivia" },
              { n: brandCount, s: "+", l: "marcas de lujo" },
              { n: 70, s: "K", l: "seguidores en Instagram" },
            ].map((x) => (
              <div key={x.l}>
                <Counter to={x.n} suffix={x.s} className="display block text-6xl md:text-7xl" />
                <p className="mt-2 text-white/50">{x.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-3">
            <Link href="/nosotros" className="btn btn-light">
              Conoce Cosmet
            </Link>
            <a href={CONTACT.vogue} target="_blank" rel="noreferrer" className="btn btn-ghost text-white">
              Léenos en Vogue
            </a>
          </div>
        </div>
      </section>

      {/* —— Offers + Trending editorial —— */}
      <section className="bg-mist px-6 py-28" data-nav="light">
        <div className="mx-auto grid max-w-[1300px] gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Link href="/tienda?ofertas=1" className="group relative block h-full min-h-[520px] overflow-hidden rounded-[28px] bg-white">
              <Parallax className="absolute inset-0" speed={0.08}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/banners/descuento.jpg" alt="Hasta 50% off en productos seleccionados" className="h-full w-full scale-110 object-cover" loading="lazy" />
              </Parallax>
            </Link>
          </Reveal>
          <div className="flex flex-col rounded-[28px] bg-white p-8 md:p-12">
            <p className="eyebrow text-smoke">Ofertas</p>
            <h2 className="display mt-3 text-4xl md:text-6xl">
              Ahorra en tus <span className="serif-italic font-normal">favoritos.</span>
            </h2>
            <div className="mt-10 grid flex-1 grid-cols-2 gap-5">
              {onSale.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
            <Link href="/tienda?ofertas=1" className="link-arrow mt-8 text-ink">
              Ver todas las ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* —— Services & stores —— */}
      <section className="bg-white px-6 py-28 md:py-36" data-nav="light">
        <div className="mx-auto grid max-w-[1300px] gap-5 md:grid-cols-2">
          <Reveal>
            <Link href="/servicios" className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-ink text-white md:aspect-auto md:h-[640px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/banners/dior-backstage-tall.jpg" alt="Servicios de maquillaje" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1.4s] group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-10 left-8 right-8">
                <p className="eyebrow text-white/60">Servicios de belleza</p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Maquíllate en MAC.</h3>
                <p className="mt-3 max-w-sm text-white/70">Flash Make Up y Full Make Up con artistas profesionales, y diagnóstico de piel en cabina.</p>
                <span className="link-arrow mt-6 text-white">Reservar</span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/tiendas" className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[28px] bg-mist p-8 md:aspect-auto md:h-[640px] md:p-12">
              <div>
                <p className="eyebrow text-smoke">Nuestras tiendas</p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  Siete tiendas.
                  <br />
                  <span className="serif-italic font-normal">Tres ciudades.</span>
                </h3>
              </div>
              <ul className="space-y-3 text-[15px]">
                {STORES.map((s) => (
                  <li key={s.name} className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                    <span className="font-medium">{s.name.replace("Cosmet ", "")}</span>
                    <span className="text-right text-smoke">{s.city}</span>
                  </li>
                ))}
              </ul>
              <span className="link-arrow text-ink">Cómo llegar · Horarios</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* —— Instagram —— */}
      <section className="overflow-hidden bg-ink py-24 text-white" data-nav="dark">
        <div className="mx-auto mb-12 flex max-w-[1300px] flex-col justify-between gap-6 px-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-white/50">Instagram</p>
            <h2 className="display mt-3 text-4xl md:text-6xl">{CONTACT.instagramHandle}</h2>
          </div>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="btn btn-light self-start">
            Seguir · {CONTACT.followers}
          </a>
        </div>
        <div className="marquee overflow-hidden">
          <div className="marquee-track gap-5 px-3" style={{ ["--marquee-speed" as string]: "70s" }}>
            {[...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS].map((p, i) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="flex h-[260px] w-[300px] shrink-0 flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.09]"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-white/60">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                <p className="line-clamp-5 text-[15px] leading-relaxed text-white/85">{p.text}</p>
                <p className="text-[12px] text-white/40">
                  {new Date(p.date).toLocaleDateString("es-BO", { day: "numeric", month: "long" })}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
