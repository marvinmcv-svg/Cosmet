"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { FREE_SHIPPING_FROM } from "@/lib/taxonomy";
import { getLenis } from "./SmoothScroll";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const mounted = useMounted();
  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);
  if (!mounted) return null;
  const total = cartTotal(lines);
  const remaining = Math.max(0, FREE_SHIPPING_FROM - total);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} role="dialog" aria-modal="true" aria-label="Bolsa de compras">
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
          open ? "translate-x-0" : "invisible translate-x-full shadow-none"
        }`}
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Tu bolsa</h2>
          <button onClick={() => setOpen(false)} className="rounded-full bg-mist p-2 hover:bg-fog" aria-label="Cerrar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        {lines.length > 0 && (
          <div className="mx-7 mb-2 rounded-2xl bg-mist p-4 text-[13px]">
            {remaining > 0 ? (
              <>Te faltan <b>{money(remaining)}</b> para el envío gratis.</>
            ) : (
              <>Tu pedido tiene <b>envío gratis</b>.</>
            )}
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-fog">
              <div className="h-full rounded-full bg-ink transition-[width] duration-700" style={{ width: `${Math.min(100, (total / FREE_SHIPPING_FROM) * 100)}%` }} />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-7" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Tu bolsa está vacía.</p>
              <p className="mt-1 text-sm text-smoke">Descubre fragancias, maquillaje y tratamiento.</p>
              <Link href="/tienda" onClick={() => setOpen(false)} className="btn btn-dark mt-6">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-mist p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.img} alt="" className="img-product h-full w-full object-contain" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-smoke">{l.brand}</p>
                    <Link href={`/producto/${l.slug}`} onClick={() => setOpen(false)} className="truncate font-medium hover:underline">
                      {l.name}
                    </Link>
                    {l.variant && <p className="text-[13px] text-smoke">{l.variant}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-black/10">
                        <button className="px-3 py-1" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Restar">−</button>
                        <span className="w-5 text-center text-sm">{l.qty}</span>
                        <button className="px-3 py-1" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Sumar">+</button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{money(l.price * l.qty)}</p>
                        <button onClick={() => remove(l.key)} className="text-[12px] text-smoke hover:text-ink">Eliminar</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-black/5 px-7 py-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <p className="mt-1 text-[12px] text-smoke">Muestras de regalo en cada compra, sujetas a disponibilidad.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-dark mt-5 w-full py-4">
              Finalizar compra
            </Link>
            <Link href="/carrito" onClick={() => setOpen(false)} className="mt-3 block text-center text-sm text-smoke hover:text-ink">
              Ver bolsa completa
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
