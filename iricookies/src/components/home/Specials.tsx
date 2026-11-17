import Image from "next/image";
import AddButton from "../AddButton";
import { specials } from "@/data/catalog";
import { bs } from "@/lib/format";

const COPY: Record<string, { kicker: string; title: [string, string]; foot: string }> = {
  "bake-your-own": { kicker: "Para hornear en casa", title: ["Bake", "your own."], foot: "Para la preparación, sigue las instrucciones del empaque." },
  "cookie-pie": { kicker: "Para compartir", title: ["Cookie", "pie."], foot: "Calienta 25 seg en el microondas antes de comer." },
};

export default function Specials() {
  return (
    <section id="especiales" className="grain relative bg-ink py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header data-reveal className="max-w-3xl">
          <p className="eyebrow text-rose">Nuevos en el horno</p>
          <h2 className="display mt-5 text-[clamp(3rem,7.5vw,6.5rem)]">
            Más que <span className="script text-[0.85em] text-petal">cookies.</span>
          </h2>
        </header>
        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {specials.map((p, i) => {
            const c = COPY[p.slug];
            return (
              <article
                key={p.slug}
                data-reveal
                className={`group relative flex flex-col overflow-hidden rounded-[2.25rem] text-ink ${i === 0 ? "bg-petal" : "bg-cream"}`}
              >
                <div className="flex items-start justify-between p-7 md:p-9">
                  <div>
                    <p className="eyebrow text-berry">{c.kicker}</p>
                    <h3 className="display mt-4 text-6xl md:text-7xl">
                      {c.title[0]} <span className="script text-[0.85em] text-berry">{c.title[1]}</span>
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-ink px-5 py-2.5 font-serif text-2xl text-petal">{bs(p.price!)}</span>
                </div>
                <div className="relative mx-6 aspect-[4/3] overflow-hidden rounded-[1.6rem] md:mx-9">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between md:p-9">
                  <div className="max-w-sm">
                    <p className="font-serif text-2xl">{p.name.split(" · ")[1]}</p>
                    <p className="mt-2 leading-relaxed text-ink/65">{p.description}</p>
                    <p className="mt-3 text-xs text-ink/50">{c.foot}</p>
                  </div>
                  <AddButton product={p} variant="pill" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
