import { Reveal, SplitReveal } from "./Motion";

type Img = { src: string; w: number; h: number };

export default function BrandHero({ name, count, story, images }: { name: string; count: number; story: string[]; images: Img[] }) {
  const hero = images.filter((i) => i.w >= 1600 && i.w / i.h > 1.8).sort((a, b) => b.w - a.w)[0];
  const rest = images.filter((i) => i !== hero && i.w >= 800).slice(0, 4);
  return (
    <>
      <section className="bg-white pt-[78px]" data-nav="light">
        {hero && (
          <div className="overflow-hidden bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.src} alt={`${name} en Cosmet`} className="brand-hero-img w-full object-cover" style={{ aspectRatio: `${hero.w}/${hero.h}` }} />
          </div>
        )}
        <div className="mx-auto max-w-[1400px] px-6 pt-14">
          <p className="eyebrow text-smoke">Boutique · {count} productos</p>
          <SplitReveal as="h1" immediate className="display mt-3 text-[14vw] md:text-[7vw]" lines={[name]} />
        </div>
      </section>
      {(story.length > 0 || rest.length > 0) && (
        <section className="bg-white px-6 pb-10 pt-12" data-nav="light">
          <div className="mx-auto max-w-[1400px]">
            {story.length > 0 && (
              <Reveal className="grid gap-x-16 gap-y-5 md:grid-cols-[180px_1fr]">
                <p className="eyebrow pt-2 text-smoke">La casa</p>
                <div className="max-w-3xl space-y-5">
                  {story.map((s, i) => (
                    <p key={i} className={i === 0 ? "text-xl font-medium leading-snug tracking-tight md:text-2xl" : "text-[17px] leading-relaxed text-smoke"}>
                      {s.replace(/\.(?=[A-ZÁÉÍÓÚ])/g, ". ")}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}
            {rest.length > 0 && (
              <Reveal className={`grid gap-4 ${story.length ? "mt-16" : ""} ${rest.length > 2 ? "md:grid-cols-4" : "md:grid-cols-2"}`} stagger={0.08}>
                {rest.map((im) => (
                  <div key={im.src} className="overflow-hidden rounded-[24px] bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.src} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105" style={{ aspectRatio: `${im.w}/${im.h}` }} />
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      )}
    </>
  );
}
