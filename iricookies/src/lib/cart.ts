"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  img: string;
  price: number;
  qty: number;
  detail?: string; // e.g. box contents
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  add: (line: Omit<CartLine, "key" | "qty"> & { key?: string }, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: ({ key: k, ...line }, qty = 1) =>
        set((s) => {
          const key = k ?? `${line.slug}::${line.detail ?? ""}`;
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { ...line, key, qty }];
          return { lines, open: true };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "iricookies-bag", partialize: (s) => ({ lines: s.lines }) }
  )
);

export const cartCount = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty, 0);
export const cartTotal = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty * l.price, 0);
