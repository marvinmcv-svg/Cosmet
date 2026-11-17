"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AddButton from "../AddButton";
import SectionHeading from "../SectionHeading";
import { premiums, PRICES } from "@/data/catalog";
import { bs } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger);

export default function Premium() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-spin]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotate: i % 2 ? 50 : -50, scale: 0.8 },
          { rotate: i % 2 ? -20 : 20, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="premium" className="grain relative overflow-hidden bg-ink py-24 text-cream md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading dark eyebrow="Cookies premium" title="Premium" script="flavours." lead={`Nuestras rellenas más pedidas. Súmalas a cualquier caja por +${PRICES.premiumSurcharge} Bs cada una.`} />

        <div className="mt-20 space-y-24 md:space-y-10">
          {premiums.map((p, i) => (
            <article key={p.slug} className={clsx("grid items-center gap-10 md:grid-cols-2 md:gap-16", i % 2 && "md:[&>*:first-child]:order-2")}>
              <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(236,156,179,0.35),transparent_68%)]" aria-hidden />
                <div data-spin className="absolute inset-0">
                  <Image src={p.img} alt={`Cookie ${p.name} de IriCookies`} fill sizes="(min-width: 768px) 520px, 90vw" className="cookie-shadow object-contain" />
                </div>
              </div>
              <div data-reveal>
                <span className="eyebrow text-rose">0{i + 1} — Premium</span>
                <h3 className="display mt-4 text-[clamp(3.2rem,7vw,6rem)]">{p.name}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/65">{p.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="rounded-full bg-petal/15 px-6 py-3 font-serif text-3xl text-petal ring-1 ring-petal/30">{bs(p.price!)}</span>
                  <AddButton product={p} variant="pill" tone="pink" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
