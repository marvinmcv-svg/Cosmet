import Image from "next/image";

export default function Process() {
  return (
    <section className="bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header data-reveal className="text-center">
          <p className="eyebrow text-berry">De nuestro horno</p>
          <h2 className="mt-5 text-[clamp(3.4rem,9vw,8rem)]">
            <span className="script text-cocoa">Así nace tu antojo.</span>
          </h2>
        </header>
        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-5">
          <figure data-reveal className="relative aspect-[16/9] overflow-hidden rounded-[2rem] md:col-span-12 md:aspect-[21/9]">
            <Image src="/img/oven.webp" alt="Bandeja de cookies IriCookies horneándose" fill sizes="(min-width: 1280px) 1200px, 95vw" className="object-cover" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-ink/75 px-4 py-2 text-sm text-cream backdrop-blur">Horneadas a pedido 🔥</figcaption>
          </figure>
          <figure data-reveal className="relative aspect-square overflow-hidden rounded-[2rem] md:col-span-5">
            <Image src="/img/rack.webp" alt="Cookies enfriándose en la rejilla" fill sizes="(min-width: 768px) 480px, 95vw" className="object-cover" />
          </figure>
          <div className="flex flex-col gap-4 md:col-span-7 md:gap-5">
            <figure data-reveal className="relative aspect-[2/1] overflow-hidden rounded-[2rem]">
              <Image src="/img/dough.webp" alt="Bolitas de masa listas para hornear" fill sizes="(min-width: 768px) 680px, 95vw" className="object-cover" />
            </figure>
            <div data-reveal className="flex flex-1 flex-col justify-center rounded-[2rem] bg-ink p-8 text-cream md:p-12">
              <h3 className="display text-5xl md:text-6xl">
                Cada una, <span className="script text-[0.85em] text-petal">con su encanto.</span>
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/65">
                Tus sabores favoritos, sus toppings y toda esa textura que los hace únicos. Hechas a mano, en casa, una por una.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
