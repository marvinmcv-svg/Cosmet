import Image from "next/image";
import { pinkEdition } from "@/data/catalog";
import { waLink } from "@/lib/whatsapp";

export default function PinkEdition() {
  return (
    <section className="relative overflow-hidden bg-petal py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <header data-reveal>
            <p className="eyebrow text-berry-deep">Edición limitada · Octubre rosa</p>
            <h2 className="display mt-5 text-[clamp(3.4rem,9vw,8rem)]">
              Octubre <span className="script text-[0.85em] text-berry-deep">es rosa.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">
              Cada pequeño gesto cuenta. Nuestras Pink IriCookies se vistieron de rosa para apoyar la concientización sobre el cáncer de mama.
            </p>
          </header>
          <ol className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {pinkEdition.items.map((it, i) => (
              <li key={it.name} data-reveal className="flex items-baseline gap-6 py-6">
                <span className="font-serif text-sm text-berry-deep">0{i + 1}</span>
                <div>
                  <h3 className="display text-4xl md:text-5xl">{it.name}</h3>
                  <p className="mt-2 text-ink/65">{it.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-reveal className="mt-10 flex flex-col gap-6 rounded-[2rem] bg-ink p-7 text-cream sm:flex-row sm:items-center">
            <span className="script shrink-0 text-7xl text-petal">10%</span>
            <p className="text-lg leading-snug">{pinkEdition.note}</p>
          </div>
          <a
            data-reveal
            href={waLink("¡Hola IriCookies! 🩷 Quiero consultar por el pack de 3 Pink IriCookies.")}
            target="_blank"
            rel="noopener"
            className="btn btn-ink mt-8"
          >
            Consultar disponibilidad
          </a>
        </div>
        <div data-reveal className="relative mx-auto w-full max-w-sm rotate-3">
          <div className="relative aspect-[29/50] overflow-hidden rounded-[2rem] shadow-[0_60px_100px_-40px_rgba(158,42,82,0.8)]">
            <Image src={pinkEdition.img} alt="Pack de 3 Pink IriCookies" fill sizes="384px" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
