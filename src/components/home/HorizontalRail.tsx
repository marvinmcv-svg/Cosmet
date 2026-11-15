"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../ProductCard";
import type { ProductSummary } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

/** Pinned section whose product track scrolls horizontally with vertical scroll (desktop). */
export default function HorizontalRail({ eyebrow, title, items, href }: { eyebrow: string; title: React.ReactNode; items: ProductSummary[]; href: string }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const dist = () => tr.scrollWidth - window.innerWidth + 80;
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (s) => bar.current && (bar.current.style.transform = `scaleX(${s.progress})`),
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    // Stable wrapper: GSAP `pin` moves the section into a pin-spacer, so React must own a parent it can remove.
    <div>
      <section ref={root} className="relative overflow-hidden bg-white py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0" data-nav="light">
      <div className="mx-auto mb-10 flex w-full max-w-[1400px] items-end justify-between px-6 lg:px-12">
        <div>
          <p className="eyebrow text-smoke">{eyebrow}</p>
          <h2 className="display mt-3 text-4xl md:text-6xl">{title}</h2>
        </div>
        <Link href={href} className="link-arrow hidden text-[15px] text-ink md:inline-flex">
          Ver todo
        </Link>
      </div>
      <div ref={track} className="no-scrollbar flex gap-6 overflow-x-auto px-6 will-change-transform lg:overflow-visible lg:px-12">
        {items.map((p, i) => (
          <div key={p.slug} className="w-[68vw] shrink-0 sm:w-[300px] lg:w-[320px]">
            <ProductCard p={p} priority={i < 3} />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 hidden h-[2px] w-[min(400px,60vw)] overflow-hidden rounded bg-fog lg:block">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ink" />
      </div>
    </section>
    </div>
  );
}
