"use client";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart, cartTotal } from "@/lib/cart";
import { money } from "@/lib/format";
import { FREE_SHIPPING_FROM, WHATSAPP } from "@/lib/taxonomy";
import { STORES } from "@/lib/info";

const CITIES = ["Santa Cruz", "La Paz", "Cochabamba", "Sucre", "Tarija", "Potosí", "Oruro", "Trinidad", "Cobija", "Otra ciudad / provincia"];

function shippingNote(total: number, method: string, city: string) {
  if (method === "retiro") return "Gratis (retiro en tienda)";
  if (total >= FREE_SHIPPING_FROM && city !== "Otra ciudad / provincia") return "Gratis";
  if (city === "Santa Cruz") return "Bs. 15 dentro del 4to anillo · Bs. 30 fuera";
  if (city === "Otra ciudad / provincia") return "Bs. 50";
  return "Bs. 25";
}

export default function Checkout() {
  const { lines, clear } = useCart();
  const mounted = useMounted();
  const [done, setDone] = useState<string | null>(null);
  const [method, setMethod] = useState("domicilio");
  const [city, setCity] = useState("Santa Cruz");
  const total = cartTotal(lines);

  if (!mounted) return <div className="min-h-screen" />;

  if (done)
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-white px-6 pt-28 text-center" data-nav="light">
        <div className="max-w-lg">
          <p className="eyebrow text-smoke">Pedido {done}</p>
          <h1 className="display mt-4 text-5xl md:text-6xl">
            ¡Gracias por <span className="serif-italic font-normal">elegirnos!</span>
          </h1>
          <p className="mt-5 text-lg text-smoke">
            Enviamos tu pedido a nuestro equipo por WhatsApp. Te confirmaremos disponibilidad, costo de envío y el enlace de pago en minutos durante horario de atención.
          </p>
          <Link href="/" className="btn btn-dark mt-8">Volver al inicio</Link>
        </div>
      </div>
    );

  if (!lines.length)
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white pt-28" data-nav="light">
        <div className="text-center">
          <h1 className="display text-5xl">Tu bolsa está vacía.</h1>
          <Link href="/tienda" className="btn btn-dark mt-8">Ir a la tienda</Link>
        </div>
      </div>
    );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = `W${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const msg = [
      `*Nuevo pedido web ${id}*`,
      "",
      ...lines.map((l) => `• ${l.qty} × ${l.brand} ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${money(l.price * l.qty)}`),
      "",
      `*Subtotal:* ${money(total)}`,
      `*Envío:* ${shippingNote(total, method, city)}`,
      "",
      `*Cliente:* ${f.get("name")}`,
      `*Teléfono:* ${f.get("phone")}`,
      `*Correo:* ${f.get("email")}`,
      method === "retiro" ? `*Retiro en:* ${f.get("store")}` : `*Entrega:* ${f.get("address")}, ${city}`,
      `*Pago:* ${f.get("payment")}`,
      `*Factura:* ${f.get("razon") || "—"} · NIT ${f.get("nit") || "—"}`,
      f.get("notes") ? `*Notas:* ${f.get("notes")}` : "",
    ]
      .filter((x) => x !== null)
      .join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    clear();
    setDone(id);
  };

  const field = "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-ink";

  return (
    <div className="bg-mist pb-32 pt-32" data-nav="light">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={submit} className="space-y-10 rounded-[32px] bg-white p-7 md:p-12">
          <h1 className="display text-4xl md:text-5xl">Finalizar compra</h1>
          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">1. Tus datos</legend>
            <input name="name" required placeholder="Nombre completo" className={field} autoComplete="name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="phone" required placeholder="Celular" className={field} autoComplete="tel" inputMode="tel" />
              <input name="email" type="email" required placeholder="Correo electrónico" className={field} autoComplete="email" />
            </div>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">2. Entrega</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["domicilio", "Envío a domicilio", "Santa Cruz en ~5 h · capitales 1–3 días hábiles"],
                ["retiro", "Retiro en tienda", "Gratis · L–V 9:00–19:00, S 9:00–13:00"],
              ].map(([v, t, d]) => (
                <label key={v} className={`cursor-pointer rounded-2xl border p-4 transition ${method === v ? "border-ink ring-1 ring-ink" : "border-black/10"}`}>
                  <input type="radio" name="method" value={v} checked={method === v} onChange={() => setMethod(v)} className="sr-only" />
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1 text-[13px] text-smoke">{d}</p>
                </label>
              ))}
            </div>
            {method === "domicilio" ? (
              <>
                <select value={city} onChange={(e) => setCity(e.target.value)} className={field}>
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input name="address" required placeholder="Dirección exacta (calle, número, barrio, referencia)" className={field} autoComplete="street-address" />
              </>
            ) : (
              <select name="store" className={field}>
                {STORES.map((s) => (
                  <option key={s.name}>{`${s.name} — ${s.city}`}</option>
                ))}
              </select>
            )}
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">3. Pago y facturación</legend>
            <select name="payment" className={field}>
              <option>Tarjeta de crédito o débito (enlace de pago)</option>
              <option>Transferencia o depósito bancario</option>
              <option>Pago contra entrega (Santa Cruz, La Paz y Cochabamba)</option>
              <option>Pago en cuotas (hasta 6, tarjetas participantes)</option>
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="razon" placeholder="Razón social (factura)" className={field} />
              <input name="nit" placeholder="NIT / CI" className={field} />
            </div>
            <textarea name="notes" rows={3} placeholder="Notas para tu pedido (opcional)" className={field} />
          </fieldset>
          <label className="flex items-start gap-3 text-[14px] text-smoke">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-black" />
            <span>
              He leído y acepto los{" "}
              <Link href="/terminos-y-condiciones" target="_blank" className="text-ink underline">
                Términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/politicas-de-privacidad" target="_blank" className="text-ink underline">
                Política de privacidad
              </Link>
              .
            </span>
          </label>
          <button className="btn btn-dark w-full py-4 text-[15px]">Confirmar pedido por WhatsApp</button>
          <p className="text-center text-[13px] text-smoke">
            Al confirmar, se abrirá WhatsApp con el detalle de tu pedido para que nuestro equipo lo procese. La factura se entrega junto con tu pedido.
          </p>
        </form>

        <aside className="h-fit rounded-[32px] bg-white p-7 md:p-10 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Resumen</h2>
          <ul className="mt-6 space-y-5">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4">
                <div className="relative h-20 w-16 shrink-0 rounded-xl bg-mist p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.img} alt="" className="img-product h-full w-full object-contain" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-white">{l.qty}</span>
                </div>
                <div className="min-w-0 flex-1 text-[14px]">
                  <p className="text-[11px] uppercase tracking-wider text-smoke">{l.brand}</p>
                  <p className="truncate font-medium">{l.name}</p>
                  {l.variant && <p className="text-smoke">{l.variant}</p>}
                </div>
                <p className="text-[14px] font-medium">{money(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-2 border-t border-black/10 pt-6 text-[15px]">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="flex justify-between gap-4"><span>Envío</span><span className="text-right">{shippingNote(total, method, city)}</span></div>
            <div className="flex justify-between pt-3 text-2xl font-semibold"><span>Total</span><span>{money(total)}</span></div>
            <p className="pt-2 text-[12px] text-smoke">Precios en dólares (USD). Recibe muestras de regalo en cada compra, sujetas a disponibilidad.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
