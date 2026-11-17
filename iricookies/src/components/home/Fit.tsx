import Image from "next/image";
import AddButton from "../AddButton";
import { fits } from "@/data/catalog";
import { bs } from "@/lib/format";

export default function Fit() {
  return (
    <section id="fit" className="bg-cream py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <header data-reveal>
          <p className="eyebrow text-berry">Fit IriCookies</p>
          <h2 className="display mt-5 text-[clamp(3rem,7.5vw,6.5rem)]">
            <span className="script block text-[0.9em] text-berry">Fit,</span>a tu manera.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            El mismo antojo, en versión fit. Dos favoritas con trozos de chocolate. Consulta los ingredientes al realizar tu pedido.
          </p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2">
          {fits.map((p, i) => (
            <article key={p.slug} data-reveal className="cookie-card group relative overflow-hidden rounded-[2rem] bg-ink p-6 text-cream">
              <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
                <div className="absolute inset-[12%] rounded-full bg-petal/15 transition-transform duration-1000 group-hover:scale-110" aria-hidden />
                <Image src={p.img} alt={`Cookie ${p.name}`} fill sizes="(min-width: 640px) 260px, 80vw" className="cookie-img cookie-shadow object-contain" />
              </div>
              <span className="absolute left-5 top-5 rounded-full bg-petal px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">Fit 0{i + 1}</span>
              <h3 className="display mt-6 text-3xl">{p.name}</h3>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-serif text-2xl text-petal">{bs(p.price!)}</span>
                <AddButton product={p} tone="pink" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
