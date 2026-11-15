"use client";
import Link from "next/link";
import { useMounted } from "@/lib/useMounted";
import { useCart, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { FREE_SHIPPING_FROM } from "@/lib/taxonomy";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const mounted = useMounted();
  const total = cartTotal(lines);
  return (
    <div className="min-h-[70vh] bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1000px] px-6">
        <h1 className="display text-5xl md:text-7xl">
          {mounted && lines.length ? (
            <>
              Tu bolsa: <span className="serif-italic font-normal">{money(total)}</span>
            </>
          ) : (
            "Tu bolsa está vacía."
          )}
        </h1>
        {mounted && lines.length > 0 ? (
          <>
            <p className="mt-4 text-smoke">{total >= FREE_SHIPPING_FROM ? "Envío gratis a ciudades capitales." : `Agrega ${money(FREE_SHIPPING_FROM - total)} más para obtener envío gratis.`}</p>
            <ul className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-6 py-8">
                  <Link href={`/producto/${l.slug}`} className="h-36 w-32 shrink-0 rounded-2xl bg-mist p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.img} alt="" className="img-product h-full w-full object-contain" />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.14em] text-smoke">{l.brand}</p>
                      <Link href={`/producto/${l.slug}`} className="text-xl font-semibold tracking-tight hover:underline">
                        {l.name}
                      </Link>
                      {l.variant && <p className="text-smoke">{l.variant}</p>}
                    </div>
                    <div className="flex items-center gap-6 sm:items-start">
                      <select value={l.qty} onChange={(e) => setQty(l.key, Number(e.target.value))} className="rounded-full bg-mist px-3 py-2">
                        {Array.from({ length: Math.max(10, l.qty) }, (_, i) => i + 1).map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                      <div className="text-right">
                        <p className="text-xl font-semibold">{money(l.price * l.qty)}</p>
                        <button onClick={() => remove(l.key)} className="text-[14px] text-smoke hover:text-ink">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="ml-auto mt-10 max-w-sm space-y-3 text-[15px]">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(total)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>{total >= FREE_SHIPPING_FROM ? "Gratis" : "Según destino"}</span></div>
              <div className="flex justify-between border-t border-black/10 pt-3 text-2xl font-semibold"><span>Total</span><span>{money(total)}</span></div>
              <Link href="/checkout" className="btn btn-dark mt-4 w-full py-4">Finalizar compra</Link>
            </div>
          </>
        ) : (
          <Link href="/tienda" className="btn btn-dark mt-10">Seguir comprando</Link>
        )}
      </div>
    </div>
  );
}
