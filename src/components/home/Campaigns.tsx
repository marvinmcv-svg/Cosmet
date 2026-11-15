"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { money } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export type Campaign = { img: string; brand: string; title: string; sub: string; href: string; products: ProductSummary[] };

export default function Campaigns({ items }: { items: Campaign[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".camp-card");
      cards.forEach((card, i) => {
        gsap.fromTo(card.querySelector(".camp-img"), { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true } });
        gsap.fromTo(
          card.querySelectorAll(".camp-text > *"),
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 50%" } }
        );
        if (i < cards.length - 1) {
          gsap.to(card.querySelector(".camp-inner"), {
            scale: 0.88,
            opacity: 0.25,
            filter: "blur(6px)",
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative bg-ink" data-nav="dark">
      <div className="px-6 pt-28 text-center text-white md:pt-36">
        <p className="eyebrow text-white/50">Marcas favoritas</p>
        <h2 className="display mt-4 text-5xl md:text-[5.5vw]">
          Historias que <span className="serif-italic font-normal">se sienten.</span>
        </h2>
      </div>
      {items.map((c, i) => (
        <section key={c.title} className="camp-card sticky top-0 flex h-[100svh] items-center overflow-hidden bg-ink">
          <div className="camp-inner mx-auto grid w-full max-w-[1300px] origin-top items-center gap-8 px-6 will-change-transform md:grid-cols-2 md:gap-16">
            <Link
              href={c.href}
              className={`relative mx-auto block aspect-[3/4] h-[52svh] overflow-hidden rounded-[32px] bg-black shadow-[0_40px_120px_rgba(0,0,0,.6)] md:h-[78svh] ${i % 2 ? "md:order-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={`${c.brand} — ${c.title}`} className="camp-img h-full w-full object-cover" loading="lazy" />
            </Link>
            <div className="camp-text text-white">
              <p className="eyebrow text-white/50">{c.brand}</p>
              <h3 className="display mt-4 text-5xl md:text-[4.8vw]">{c.title}</h3>
              <p className="mt-5 max-w-md text-white/60 md:text-lg">{c.sub}</p>
              {c.products.length > 0 && (
                <div className="mt-8 flex gap-3 max-md:hidden">
                  {c.products.slice(0, 3).map((p) => (
                    <Link key={p.slug} href={`/producto/${p.slug}`} className="group w-32 rounded-2xl bg-white/[0.06] p-3 transition hover:bg-white/[0.12]">
                      <span className="block aspect-square overflow-hidden rounded-xl bg-white p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt={p.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      </span>
                      <span className="mt-2 block truncate text-[11px] text-white/70">{p.name}</span>
                      <span className="block text-[12px] font-semibold">{money(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-8">
                <Link href={c.href} className="btn btn-light">
                  Descubrir
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
