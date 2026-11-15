"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME = "inset(46% 31% 0% 31% round 32px)";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mobile = window.innerWidth < 768;
      const frame = mobile ? "inset(50% 9% 0% 9% round 28px)" : FRAME;
      if (mobile) gsap.set(".hero-tall", { yPercent: 50, transformOrigin: "50% 0%" });

      // Intro
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .fromTo(".hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 }, 0.2)
        .fromTo(".hero-word", { yPercent: 115 }, { yPercent: 0, duration: 1.6, stagger: 0.08 }, 0.3)
        .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 }, 0.9)
        .fromTo(".hero-frame", { clipPath: "inset(100% 33% 0% 33% round 32px)" }, { clipPath: frame, duration: 1.8 }, 0.55)
        .fromTo(".hero-tall", { scale: 1.35 }, { scale: 1.05, duration: 2.4 }, 0.55);

      // Scroll: frame expands to full-bleed, headline recedes, wide campaign crossfades in (desktop)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=140%", scrub: 0.8, pin: true, anticipatePin: 1 },
      });
      tl.to(".hero-title", { yPercent: -40, opacity: 0, scale: 0.92, ease: "none" }, 0)
        .to(".hero-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }, 0)
        .to(".hero-tall", { scale: 1, yPercent: 0, ease: "none" }, 0)
        .fromTo(".hero-caption", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none" }, 0.55)
        .to(".hero-scroll", { opacity: 0, ease: "none" }, 0);
      if (!mobile) {
        tl.fromTo(".hero-wide", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, ease: "none", duration: 0.4 }, 0.2).to(
          ".hero-tall",
          { opacity: 0, ease: "none", duration: 0.4 },
          0.2
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-nav="dark" className="relative h-[100svh] overflow-hidden bg-ink text-white">
      <div className="hero-title absolute inset-x-0 top-[13vh] z-10 px-5 text-center md:top-[11vh]">
        <p className="hero-eyebrow eyebrow text-white/60">Cosmet · Desde 1975</p>
        <h1 className="display mt-4 text-[12vw] md:text-[6.2vw]">
          <span className="split-line">
            <span className="hero-word split-inner">El club que</span>
          </span>
          <span className="split-line">
            <span className="hero-word split-inner">
              no requiere <span className="serif-italic font-normal">membresía.</span>
            </span>
          </span>
        </h1>
        <p className="hero-sub mx-auto mt-4 max-w-md text-[15px] text-white/60 md:text-[17px]">
          Productos de lujo en Santa Cruz, La Paz y Cochabamba.
        </p>
      </div>

      <div className="hero-frame absolute inset-0" style={{ clipPath: FRAME }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/banners/chanel-tall.jpg" alt="Chanel Coco Mademoiselle Crush Absolu" className="hero-tall absolute inset-0 h-full w-full object-cover object-top" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/banners/chanel-wide.jpg" alt="" aria-hidden className="hero-wide absolute inset-0 h-full w-full object-cover object-left opacity-0 max-md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 md:bg-gradient-to-l md:from-black/75 md:via-black/10 md:to-transparent" />
        <div className="hero-caption absolute bottom-[8vh] left-0 right-0 px-6 opacity-0 max-md:bottom-[3vh] md:left-auto md:right-[6vw] md:px-0 md:text-right">
          <p className="eyebrow text-white/70 max-md:hidden">Chanel · Nuevo perfume</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight max-md:hidden md:text-6xl">
            Coco Mademoiselle
            <br />
            <span className="serif-italic font-normal">Crush Absolu</span>
          </p>
          <div className="mt-6 flex justify-center gap-3 md:justify-end">
            <Link href="/tienda?q=crush+absolu" className="btn btn-light">
              Descubrir
            </Link>
            <Link href="/marcas/chanel" className="btn btn-ghost text-white">
              Universo Chanel
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] tracking-[0.3em] text-white/50">
        <span className="block h-10 w-px mx-auto mb-2 bg-gradient-to-b from-transparent to-white/60 animate-pulse" />
        SCROLL
      </div>
    </section>
  );
}
