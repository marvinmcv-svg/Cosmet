import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { SplitReveal, Reveal, Parallax } from "@/components/Motion";
import { pick } from "@/lib/catalog";
import trending from "@/data/trending.json";

export const metadata: Metadata = { title: "Trending", description: "Fashion, Beauty & LifeStyle en un solo lugar." };

export default function Trending() {
  return (
    <>
      <section className="bg-white px-6 pb-16 pt-36" data-nav="light">
        <div className="mx-auto max-w-[1300px]">
          <p className="eyebrow text-smoke">Trending · Fashion, Beauty & LifeStyle en un solo lugar</p>
          <SplitReveal as="h1" immediate className="display mt-4 text-[13vw] md:text-[7vw]" lines={["Lo último en belleza,", <span key="2" className="serif-italic font-normal">moda y celebridades.</span>]} />
        </div>
      </section>
      {trending.map((a) => {
        const products = pick(a.products);
        return (
          <article key={a.slug} id={a.slug} className="bg-white pb-28" data-nav="light">
            <Parallax className="mx-auto aspect-[16/8] max-w-[1400px] rounded-[32px] max-md:mx-6 max-md:aspect-[4/5]" speed={0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.cover} alt={a.title} className="h-full w-full scale-110 object-cover" />
            </Parallax>
            <div className="mx-auto mt-16 grid max-w-[1100px] gap-12 px-6 md:grid-cols-[1fr_320px]">
              <div>
                <h2 className="display text-4xl md:text-6xl">{a.title}</h2>
                <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-graphite/85" stagger={0.06}>
                  {a.paragraphs.map((p, i) => (
                    <p key={i} className={i === 0 ? "text-xl font-medium text-ink" : ""}>
                      {p}
                    </p>
                  ))}
                </Reveal>
              </div>
              <aside className="space-y-5">
                {a.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" loading="lazy" className="w-full rounded-[24px] object-cover" />
                ))}
                <div className="rounded-[24px] bg-ink p-6 text-white">
                  <p className="eyebrow text-white/50">{a.viral.title}</p>
                  <p className="mt-3 leading-relaxed text-white/80">{a.viral.text}</p>
                </div>
              </aside>
            </div>
            {products.length > 0 && (
              <div className="mx-auto mt-20 max-w-[1300px] px-6">
                <h3 className="display text-3xl md:text-4xl">
                  Compra el <span className="serif-italic font-normal">artículo.</span>
                </h3>
                <Reveal className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-5" stagger={0.05}>
                  {products.map((p) => (
                    <ProductCard key={p.slug} p={p} />
                  ))}
                </Reveal>
              </div>
            )}
          </article>
        );
      })}
    </>
  );
}
