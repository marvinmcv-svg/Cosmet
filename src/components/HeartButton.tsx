"use client";
import { useWishlist } from "@/lib/wishlist";
import { useMounted } from "@/lib/useMounted";
import type { ProductSummary } from "@/lib/types";

export default function HeartButton({ p, className = "" }: { p: ProductSummary; className?: string }) {
  const mounted = useMounted();
  const on = useWishlist((s) => s.items.some((x) => x.slug === p.slug));
  const toggle = useWishlist((s) => s.toggle);
  const active = mounted && on;
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(p);
      }}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Añadir a favoritos"}
      className={`flex items-center justify-center rounded-full transition active:scale-90 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
    </button>
  );
}
