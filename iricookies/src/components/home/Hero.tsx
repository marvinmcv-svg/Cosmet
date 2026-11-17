"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bow, Sparkle } from "../Ornaments";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const cookie = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-line]", { yPercent: 115, duration: 1.4, stagger: 0.09 })
        .from("[data-cookie]", { scale: 0.55, rotate: -50, opacity: 0, duration: 1.8 }, 0.1)
        .from("[data-glow]", { scale: 0.4, opacity: 0, duration: 2 }, 0)
        .from("[data-fade]", { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5)
        .from("[data-chip]", { y: 30, scale: 0.8, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.9);

      gsap.to("[data-cookie]", {
        rotate: 40,
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-headline]", {
        yPercent: -25,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    // Pointer parallax on the cookie
    const onMove = (e: PointerEvent) => {
      if (reduce || !cookie.current) return;
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      gsap.to(cookie.current, { x: x * 30, y: y * 30, rotateY: x * 14, rotateX: -y * 14, duration: 1.2, ease: "power3.out" });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="grain relative isolate overflow-hidden bg-ink text-cream">
      <div data-glow className="absolute right-[-20%] top-[10%] -z-10 h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(circle,rgba(236,156,179,0.45),rgba(200,67,111,0.18)_45%,transparent_70%)] blur-2xl md:right-[-5%]" aria-hidden />
      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-6 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div data-headline className="relative z-10">
          <p data-fade className="eyebrow flex items-center gap-3 text-rose">
            <Sparkle className="h-3 w-3" /> Homemade cookies · Santa Cruz, Bolivia
          </p>
          <h1 className="display mt-6 text-[clamp(3.6rem,10.5vw,9.5rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">Tu próximo</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">antojo</span>
            </span>
            <span className="block overflow-hidden pb-[0.2em] pl-[0.6em]">
              <span data-line className="script block text-[0.82em] text-petal">empieza acá.</span>
            </span>
          </h1>
          <p data-fade className="mt-6 max-w-md text-lg leading-relaxed text-cream/70">
            Cookies caseras, gorditas y bien rellenas. Horneadas en Santa Cruz para tus <em className="font-serif not-italic text-petal">happy moments</em>.
          </p>
          <div data-fade className="mt-9 flex flex-wrap gap-3">
            <Link href="/arma-tu-caja" className="btn btn-pink">
              Arma tu caja <span aria-hidden>→</span>
            </Link>
            <Link href="/menu" className="btn btn-ghost text-cream">
              <span>Ver el menú</span>
            </Link>
          </div>
          <dl data-fade className="mt-12 flex gap-8 text-sm text-cream/60">
            <div>
              <dt className="sr-only">Precio por cookie</dt>
              <dd>
                <span className="display block text-3xl text-cream">15 Bs</span>la clásica
              </dd>
            </div>
            <div>
              <dt className="sr-only">Caja de 6</dt>
              <dd>
                <span className="display block text-3xl text-cream">87 Bs</span>caja de 6
              </dd>
            </div>
            <div>
              <dt className="sr-only">Caja de 12</dt>
              <dd>
                <span className="display block text-3xl text-cream">168 Bs</span>caja de 12
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[640px] [perspective:1200px]">
          <div ref={cookie} className="absolute inset-0 [transform-style:preserve-3d]">
            <div data-cookie className="absolute inset-0">
              <Image
                src="/img/hero-trio.webp"
                alt="Tres cookies de IriCookies: Salted Caramel, Lotus Biscoff y Cookies & Cream"
                fill
                priority
                sizes="(min-width: 1024px) 640px, 92vw"
                className="cookie-shadow object-contain"
              />
            </div>
          </div>
          <Bow className="absolute -left-2 top-[8%] h-12 w-20 -rotate-12 text-rose/70" />
          <div data-chip className="absolute left-0 top-[62%] rounded-2xl bg-cream px-4 py-3 text-ink shadow-2xl md:-left-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-berry">Premium</p>
            <p className="font-serif text-lg leading-tight">Lotus Biscoff · 20 Bs</p>
          </div>
          <div data-chip className="absolute right-0 top-[14%] rounded-full bg-petal px-4 py-2.5 text-sm font-semibold text-ink shadow-2xl">
            🛵 Delivery o pickup
          </div>
          <div data-chip className="absolute bottom-[4%] right-[8%] flex items-center gap-2 rounded-full bg-ink-3/90 px-4 py-2.5 text-sm text-cream ring-1 ring-white/10 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#25D366]" /> Horneadas a pedido
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-cream/40 md:flex" aria-hidden>
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-cream/40 to-transparent" />
      </div>
    </section>
  );
}
