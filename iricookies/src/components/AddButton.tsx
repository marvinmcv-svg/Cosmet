"use client";
import { useState } from "react";
import clsx from "clsx";
import { useCart } from "@/lib/cart";
import type { Product } from "@/data/catalog";

type Props = {
  product: Pick<Product, "slug" | "name" | "img" | "price">;
  variant?: "round" | "pill";
  tone?: "ink" | "pink";
  className?: string;
};

export default function AddButton({ product, variant = "round", tone = "ink", className }: Props) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);
  if (product.price == null) return null;

  const onClick = () => {
    add({ slug: product.slug, name: product.name, img: product.img, price: product.price! });
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
  };

  const label = `Agregar ${product.name} a la bolsa`;
  const colors = tone === "ink" ? "bg-ink text-cream hover:bg-berry" : "bg-petal text-ink hover:bg-white";

  if (variant === "pill") {
    return (
      <button type="button" onClick={onClick} aria-label={label} className={clsx("btn shrink-0 whitespace-nowrap", colors, className)}>
        {done ? "¡Agregada! 🩷" : "Agregar a la bolsa"}
        {!done && <Plus className="h-4 w-4" />}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        "relative grid h-10 w-10 shrink-0 sm:h-12 sm:w-12 place-items-center rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] hover:scale-110 active:scale-95",
        colors,
        className
      )}
    >
      <Plus className={clsx("h-5 w-5 transition-all duration-500", done && "rotate-90 scale-0 opacity-0")} />
      <Check className={clsx("absolute h-5 w-5 transition-all duration-500", done ? "scale-100 opacity-100" : "scale-0 opacity-0")} />
    </button>
  );
}

export function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function Minus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}
export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
