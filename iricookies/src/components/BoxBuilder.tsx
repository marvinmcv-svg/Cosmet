"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { boxable, PRICES } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { bs } from "@/lib/format";
import { Plus } from "./AddButton";

type Size = 6 | 12;

export default function BoxBuilder({ dark = false }: { dark?: boolean }) {
  const [size, setSize] = useState<Size>(6);
  const [slots, setSlots] = useState<string[]>([]);
  const add = useCart((s) => s.add);

  const base = size === 6 ? PRICES.box6 : PRICES.box12;
  const premiumCount = slots.filter((s) => boxable.find((p) => p.slug === s)?.category === "premium").length;
  const total = base + premiumCount * PRICES.premiumSurcharge;
  const remaining = size - slots.length;
  const full = remaining === 0;

  const summary = useMemo(() => {
    const counts = new Map<string, number>();
    slots.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));
    return [...counts.entries()].map(([slug, n]) => `${n}× ${boxable.find((p) => p.slug === slug)!.name}`).join(", ");
  }, [slots]);

  const pick = (slug: string) => setSlots((s) => (s.length < size ? [...s, slug] : s));
  const removeAt = (i: number) => setSlots((s) => s.filter((_, j) => j !== i));
  const changeSize = (n: Size) => {
    setSize(n);
    setSlots((s) => s.slice(0, n));
  };
  const surprise = () =>
    setSlots((s) => {
      const out = [...s];
      while (out.length < size) out.push(boxable[Math.floor(Math.random() * boxable.length)].slug);
      return out;
    });

  const addToBag = () => {
    if (!full) return;
    add({
      key: `box-${size}::${[...slots].sort().join(",")}`,
      slug: `box-${size}`,
      name: `Caja de ${size}`,
      img: slots[0] ? boxable.find((p) => p.slug === slots[0])!.img : "",
      price: total,
      detail: summary,
    });
    setSlots([]);
  };

  const muted = dark ? "text-cream/60" : "text-muted";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      {/* The box */}
      <div className="order-2 lg:order-1">
        <div className="relative rounded-[2.25rem] bg-petal p-4 shadow-[0_50px_100px_-40px_rgba(158,42,82,0.55)] md:p-6">
          <div className="mb-4 flex items-center justify-between px-2">
            <span className="font-serif text-2xl font-semibold tracking-tight text-cocoa md:text-3xl">IriCookies</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-cocoa">
              {slots.length}/{size}
            </span>
          </div>
          <div
            className={clsx("grid gap-2 rounded-[1.6rem] bg-blush p-3 md:gap-3 md:p-4", size === 6 ? "grid-cols-3" : "grid-cols-4")}
            aria-label={`Tu caja: ${slots.length} de ${size} cookies`}
          >
            {Array.from({ length: size }).map((_, i) => {
              const slug = slots[i];
              const p = slug ? boxable.find((x) => x.slug === slug) : undefined;
              return (
                <button
                  key={`${i}-${slug ?? "empty"}`}
                  type="button"
                  disabled={!p}
                  onClick={() => removeAt(i)}
                  aria-label={p ? `Quitar ${p.name} de la caja` : `Espacio ${i + 1} vacío`}
                  className={clsx(
                    "group relative aspect-square rounded-2xl transition-colors",
                    p ? "bg-white/50 hover:bg-white" : "border-2 border-dashed border-rose/50"
                  )}
                >
                  {p ? (
                    <>
                      <Image src={p.img} alt="" fill sizes="160px" className="pop-in cookie-shadow object-contain p-1.5" />
                      <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-cream opacity-0 transition group-hover:opacity-100">
                        <Plus className="h-3.5 w-3.5 rotate-45" />
                      </span>
                    </>
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-serif text-xl text-rose/70">{i + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={clsx("mt-6 rounded-[2rem] p-6", dark ? "bg-white/5" : "bg-white")}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className={muted}>Caja de {size}</dt>
              <dd className="tabular-nums">{bs(base)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className={muted}>Cookies premium ({premiumCount} × {PRICES.premiumSurcharge} Bs)</dt>
              <dd className="tabular-nums">{bs(premiumCount * PRICES.premiumSurcharge)}</dd>
            </div>
          </dl>
          <div className={clsx("mt-4 flex items-end justify-between border-t pt-4", dark ? "border-white/10" : "border-ink/10")}>
            <span className={muted}>Total</span>
            <span className="display text-5xl tabular-nums" aria-live="polite">
              {bs(total)}
            </span>
          </div>
          <button
            type="button"
            onClick={addToBag}
            disabled={!full}
            className={clsx("btn mt-6 w-full", full ? (dark ? "btn-pink" : "btn-ink") : "cursor-not-allowed bg-ink/10 text-ink/40", dark && !full && "bg-white/10 text-cream/40")}
          >
            {full ? `Agregar caja · ${bs(total)}` : `Elige ${remaining} ${remaining === 1 ? "cookie más" : "cookies más"}`}
          </button>
        </div>
      </div>

      {/* Picker */}
      <div className="order-1 lg:order-2">
        <div className={clsx("inline-grid grid-cols-2 gap-1 rounded-full p-1", dark ? "bg-white/10" : "bg-ink/5")} role="radiogroup" aria-label="Tamaño de la caja">
          {([6, 12] as const).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={size === n}
              onClick={() => changeSize(n)}
              className={clsx(
                "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-500",
                size === n ? (dark ? "bg-petal text-ink" : "bg-ink text-cream") : dark ? "text-cream/70" : "text-ink/60"
              )}
            >
              Caja de {n} · {bs(n === 6 ? PRICES.box6 : PRICES.box12)}
            </button>
          ))}
        </div>

        <p className={clsx("mt-6 text-sm", muted)}>Toca un sabor para sumarlo. Toca una cookie en la caja para quitarla.</p>

        <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
          {boxable.map((p) => {
            const premium = p.category === "premium";
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => pick(p.slug)}
                  disabled={full}
                  className={clsx(
                    "group relative flex w-full flex-col items-center rounded-3xl p-3 text-center transition-all duration-500 ease-[var(--ease-out-expo)] disabled:opacity-40",
                    dark ? "bg-white/5 hover:bg-white/10" : "bg-white hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(158,42,82,0.4)]"
                  )}
                  aria-label={`Agregar ${p.name}${premium ? " (premium, +5 Bs)" : ""}`}
                >
                  <span className="relative block aspect-square w-full">
                    <Image src={p.img} alt="" fill sizes="140px" className="object-contain transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105" />
                  </span>
                  <span className="mt-2 text-[0.8rem] font-semibold leading-tight sm:text-sm">{p.name}</span>
                  {premium && <span className="mt-1 rounded-full bg-berry px-2 py-0.5 text-[0.65rem] font-bold text-white">+5 Bs</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={surprise} disabled={full} className={clsx("btn h-11 text-sm disabled:opacity-40", dark ? "bg-white/10 text-cream hover:bg-white/20" : "bg-ink/5 hover:bg-ink/10")}>
            ✨ Sorpréndeme
          </button>
          {slots.length > 0 && (
            <button type="button" onClick={() => setSlots([])} className={clsx("btn h-11 text-sm", dark ? "text-cream/60 hover:text-rose" : "text-muted hover:text-berry")}>
              Vaciar caja
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
