"use client";
import Link from "next/link";
import Tilt from "./Tilt";
import { money, discount } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "@/lib/cart";
import HeartButton from "./HeartButton";

export default function ProductCard({ p, priority = false, tone = "mist" }: { p: ProductSummary; priority?: boolean; tone?: "mist" | "white" }) {
  const add = useCart((s) => s.add);
  const off = discount(p.price, p.old);
  return (
    <div className="group relative">
      <Tilt className={`rounded-[22px] ${tone === "mist" ? "bg-mist" : "bg-white"} overflow-hidden`} max={7}>
        <Link href={`/producto/${p.slug}`} className="block aspect-[4/5] p-6" aria-label={`${p.brand} ${p.name}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt={`${p.brand} — ${p.name}`}
            loading={priority ? "eager" : "lazy"}
            className="tilt-layer img-product h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
            style={{ ["--z" as string]: "50px" }}
          />
        </Link>
        <div className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
          {off > 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">−{off}%</span>}
          {p.isNew && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-ink shadow-sm">Nuevo</span>}
        </div>
        <HeartButton p={p} className="absolute right-4 top-4 h-9 w-9 bg-white/80 text-ink backdrop-blur hover:bg-white" />
        <button
          onClick={() => add({ slug: p.slug, name: p.name, brand: p.brand, img: p.img, price: p.price })}
          className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-ink text-white opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 focus:opacity-100 max-md:opacity-100 max-md:translate-y-0"
          aria-label={`Añadir ${p.name} a la bolsa`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </Tilt>
      <Link href={`/producto/${p.slug}`} className="mt-4 block px-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-smoke">{p.brand}</p>
        <p className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-graphite">{p.name}</p>
        {p.short && <p className="mt-0.5 line-clamp-1 text-[13px] text-smoke">{p.short}</p>}
        <p className="mt-2 text-[14px]">
          <span className="font-semibold">{money(p.price)}</span>
          {off > 0 && <span className="ml-2 text-smoke line-through">{money(p.old!)}</span>}
        </p>
      </Link>
    </div>
  );
}
