"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useCart } from "@/lib/cart";
import { money, discount } from "@/lib/format";
import { WHATSAPP, FREE_SHIPPING_FROM } from "@/lib/taxonomy";
import type { Product } from "@/lib/types";
import HeartButton from "./HeartButton";

export default function ProductDetail({ p, chips = [] }: { p: Product; chips?: { group: string; label: string; href: string }[] }) {
  const add = useCart((s) => s.add);
  const firstAvail = p.option?.values.find((v) => v.available) ?? p.option?.values[0];
  const [variantId, setVariantId] = useState(firstAvail?.id);
  const variant = p.option?.values.find((v) => v.id === variantId);
  const price = variant?.price ?? p.price;
  const old = variant?.old ?? (variant ? undefined : p.old);
  const available = variant ? variant.available : true;
  const images = useMemo(() => {
    const g = [...p.gallery];
    if (variant?.img && !g.includes(variant.img)) g.unshift(variant.img);
    return g.length ? g : [p.img];
  }, [p, variant]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const off = discount(price, old);

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    // Position check rather than IntersectionObserver: IO only fires on intersection *changes*, so a jump
    // from below the fold to past the button (fling, End key, scroll restoration) would never show the bar.
    let raf = 0;
    const check = () => {
      raf = 0;
      setShowBar(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".pd-in", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: "expo.out", delay: 0.1 });
      gsap.fromTo(".pd-stage", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  // subtle 3D float on the product shot following the pointer
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(imgRef.current, { rotateY: x * 14, rotateX: -y * 14, x: x * 18, y: y * 18, duration: 0.8, ease: "power3.out" });
  };
  const onLeave = () => gsap.to(imgRef.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1, ease: "expo.out" });

  const addToBag = () =>
    add({ slug: p.slug, name: p.name, brand: p.brand, img: variant?.img ?? p.img, price, variant: variant ? `${p.option!.label}: ${variant.label}` : undefined }, qty);

  const isSwatch = p.option && /color|tono|shade/i.test(p.option.label);
  const paragraphs = (p.desc ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <div ref={root}>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="pd-stage relative aspect-square overflow-hidden rounded-[32px] bg-mist [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} key={images[active]} src={images[active]} alt={`${p.brand} ${p.name}`} className="img-product h-full w-full object-contain p-[8%] will-change-transform" />
            {off > 0 && <span className="absolute left-6 top-6 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-white">−{off}%</span>}
          </div>
          {images.length > 1 && (
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-mist p-2 ring-2 transition ${i === active ? "ring-ink" : "ring-transparent hover:ring-black/10"}`}
                  aria-label={`Imagen ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="img-product h-full w-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 pb-10">
          <Link href={`/marcas/${p.brandSlug}`} className="pd-in eyebrow inline-block text-smoke hover:text-ink">
            {p.brand}
          </Link>
          <h1 className="pd-in mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">{p.name}</h1>
          {p.short && <p className="pd-in mt-3 text-lg text-smoke">{p.short}</p>}
          <p className="pd-in mt-6 text-2xl">
            <span className="font-semibold">{money(price)}</span>
            {off > 0 && <span className="ml-3 text-lg text-smoke line-through">{money(old!)}</span>}
          </p>
          <p className="pd-in mt-1 text-[13px] text-smoke">o hasta 6 cuotas con tarjetas de crédito participantes</p>

          {chips.length > 0 && (
            <div className="pd-in mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <Link key={c.href} href={c.href} title={c.group} className="rounded-full border border-black/10 px-3 py-1 text-[12.5px] text-smoke transition hover:border-ink hover:text-ink">
                  {c.label}
                </Link>
              ))}
            </div>
          )}

          {p.option && (
            <div className="pd-in mt-8">
              <p className="mb-3 text-[14px]">
                <span className="font-semibold">{p.option.label}</span>
                {variant && <span className="text-smoke"> · {variant.label}</span>}
              </p>
              <div className={isSwatch ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-3 sm:grid-cols-3"}>
                {p.option.values.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVariantId(v.id);
                      setActive(0);
                    }}
                    disabled={!v.available}
                    className={`rounded-2xl border px-4 py-3 text-left text-[14px] transition ${
                      v.id === variantId ? "border-ink ring-1 ring-ink" : "border-black/10 hover:border-black/30"
                    } ${!v.available ? "cursor-not-allowed opacity-35 line-through" : ""} ${isSwatch ? "py-2" : ""}`}
                  >
                    <span className="block font-medium">{v.label}</span>
                    {!isSwatch && <span className="text-[13px] text-smoke">{money(v.price)}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={buyRef} className="pd-in mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-black/10">
              <button className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar">−</button>
              <span className="w-6 text-center">{qty}</span>
              <button className="px-4 py-3" onClick={() => setQty((q) => q + 1)} aria-label="Sumar">+</button>
            </div>
            <button onClick={addToBag} disabled={!available} className="btn btn-dark flex-1 py-4 text-[15px] disabled:opacity-40">
              {available ? "Añadir a la bolsa" : "Agotado"}
            </button>
            <HeartButton p={p} className="h-[54px] w-[54px] shrink-0 border border-black/10 hover:border-ink" />
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola! Estoy interesado en ${p.brand} ${p.name}${variant ? ` (${variant.label})` : ""}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="pd-in btn btn-ghost mt-3 w-full py-4 text-[15px]"
          >
            Consultar por WhatsApp
          </a>

          <ul className="pd-in mt-8 grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-3">
            {[
              ["Envío gratis", `desde $${FREE_SHIPPING_FROM} a capitales`],
              ["Retiro en tienda", "en 7 sucursales"],
              ["Muestras de regalo", "en cada compra"],
            ].map(([a, b]) => (
              <li key={a} className="rounded-2xl bg-mist p-4">
                <p className="font-semibold">{a}</p>
                <p className="text-smoke">{b}</p>
              </li>
            ))}
          </ul>

          {paragraphs.length > 0 && (
            <details open className="pd-in group mt-10 border-t border-black/10 pt-6">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
                Descripción <span className="text-2xl transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-graphite/80">
                {paragraphs.map((t, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {t}
                  </p>
                ))}
              </div>
            </details>
          )}
          {Object.keys(p.attrs).length > 0 && (
            <details className="pd-in group mt-6 border-t border-black/10 pt-6">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold">
                Detalles <span className="text-2xl transition group-open:rotate-45">+</span>
              </summary>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 text-[14px]">
                {Object.entries(p.attrs).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-smoke">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
                {p.sku && (
                  <>
                    <dt className="text-smoke">SKU</dt>
                    <dd>{p.sku}</dd>
                  </>
                )}
              </dl>
            </details>
          )}
        </div>
      </div>

      {/* Sticky buy bar */}
      <div className={`glass fixed inset-x-0 top-0 z-40 border-b border-black/5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${showBar ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5">
          <p className="truncate text-[15px] font-semibold">
            {p.name} {variant && <span className="font-normal text-smoke">· {variant.label}</span>}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <span className="text-[15px] font-medium max-sm:hidden">{money(price)}</span>
            <button onClick={addToBag} disabled={!available} className="btn btn-dark py-2 text-[13px] disabled:opacity-40">
              Añadir a la bolsa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
