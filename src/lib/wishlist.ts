"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSummary } from "./types";

type W = { items: ProductSummary[]; toggle: (p: ProductSummary) => void; has: (slug: string) => boolean };

export const useWishlist = create<W>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) =>
        set((s) => ({ items: s.items.some((x) => x.slug === p.slug) ? s.items.filter((x) => x.slug !== p.slug) : [p, ...s.items] })),
      has: (slug) => get().items.some((x) => x.slug === slug),
    }),
    { name: "cosmet-wishlist" }
  )
);
