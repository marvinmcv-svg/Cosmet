"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { useMounted } from "@/lib/useMounted";
import { bs } from "@/lib/format";
import { orderMessage, waLink, type OrderInfo } from "@/lib/whatsapp";
import { getLenis } from "./SmoothScroll";
import { Minus, Plus } from "./AddButton";
import { WhatsAppIcon } from "./WhatsAppFab";
import { CookieMark } from "./Logo";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, clear } = useCart();
  const mounted = useMounted();
  const [step, setStep] = useState<"bag" | "details">("bag");
  const [info, setInfo] = useState<OrderInfo>({ name: "", mode: "delivery", address: "", date: "", notes: "" });
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const items = mounted ? lines : [];
  const total = cartTotal(items);
  const count = cartCount(items);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => setStep("bag"), 500);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waLink(orderMessage(items, info)), "_blank", "noopener");
  };

  const field =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-cream placeholder:text-cream/35 outline-none transition focus:border-rose focus:bg-white/10";

  return (
    <div className={clsx("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")} inert={!open}>
      <div
        onClick={close}
        className={clsx("absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Tu bolsa"
        data-lenis-prevent
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-ink text-cream shadow-2xl transition-transform duration-700 ease-[var(--ease-out-expo)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="eyebrow text-rose">{step === "bag" ? "Tu bolsa" : "Casi listo"}</p>
            <h2 className="display mt-1 text-3xl">{step === "bag" ? `${count} ${count === 1 ? "antojo" : "antojos"}` : "Tus datos"}</h2>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            tabIndex={open ? 0 : -1}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/5 hover:bg-white/15"
            aria-label="Cerrar bolsa"
          >
            <Plus className="h-5 w-5 rotate-45" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <CookieMark className="h-20 w-20 text-petal" />
            <p className="display mt-6 text-4xl">
              Tu bolsa está <span className="script text-rose">vacía</span>
            </p>
            <p className="mt-3 text-cream/60">Tu próximo antojo empieza acá.</p>
            <Link href="/menu" onClick={close} tabIndex={open ? 0 : -1} className="btn btn-pink mt-8">
              Ver el menú
            </Link>
          </div>
        ) : step === "bag" ? (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {items.map((l) => (
                <li key={l.key} className="flex gap-4 rounded-3xl bg-white/[0.04] p-3">
                  <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-petal/10">
                    {l.img && <Image src={l.img} alt="" fill sizes="80px" className="object-contain p-1.5" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-lg leading-tight">{l.name}</p>
                      <button
                        type="button"
                        onClick={() => remove(l.key)}
                        tabIndex={open ? 0 : -1}
                        className="text-xs text-cream/45 underline-offset-2 hover:text-rose hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                    {l.detail && <p className="mt-1 text-xs leading-relaxed text-cream/55">{l.detail}</p>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
                        <button
                          type="button"
                          onClick={() => setQty(l.key, l.qty - 1)}
                          tabIndex={open ? 0 : -1}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                          aria-label={`Quitar una unidad de ${l.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(l.key, l.qty + 1)}
                          tabIndex={open ? 0 : -1}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
                          aria-label={`Agregar una unidad de ${l.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-medium tabular-nums">{bs(l.qty * l.price)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-cream/60">Total estimado</span>
                <span className="display text-4xl tabular-nums">{bs(total)}</span>
              </div>
              <p className="mt-2 text-xs text-cream/45">El delivery y la forma de pago se coordinan por WhatsApp.</p>
              <button type="button" onClick={() => setStep("details")} tabIndex={open ? 0 : -1} className="btn btn-pink mt-5 w-full">
                Continuar pedido
              </button>
              <button type="button" onClick={clear} tabIndex={open ? 0 : -1} className="mt-3 w-full text-center text-xs text-cream/40 hover:text-rose">
                Vaciar bolsa
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={send} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              <label className="block">
                <span className="mb-2 block text-sm text-cream/70">Tu nombre</span>
                <input
                  required
                  autoComplete="name"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className={field}
                  placeholder="¿A nombre de quién?"
                />
              </label>
              <fieldset>
                <legend className="mb-2 block text-sm text-cream/70">Entrega</legend>
                <div className="grid grid-cols-2 gap-2 rounded-full bg-white/5 p-1">
                  {(["delivery", "pickup"] as const).map((m) => (
                    <label
                      key={m}
                      className={clsx(
                        "cursor-pointer rounded-full py-3 text-center text-sm font-semibold transition",
                        info.mode === m ? "bg-petal text-ink" : "text-cream/70 hover:text-cream"
                      )}
                    >
                      <input type="radio" name="mode" value={m} checked={info.mode === m} onChange={() => setInfo({ ...info, mode: m })} className="sr-only" />
                      {m === "delivery" ? "🛵 Delivery" : "🎀 Pickup"}
                    </label>
                  ))}
                </div>
              </fieldset>
              {info.mode === "delivery" && (
                <label className="block">
                  <span className="mb-2 block text-sm text-cream/70">Dirección (Santa Cruz)</span>
                  <input
                    required
                    autoComplete="street-address"
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    className={field}
                    placeholder="Barrio, calle, referencia"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-sm text-cream/70">¿Para cuándo?</span>
                <input type="date" value={info.date} onChange={(e) => setInfo({ ...info, date: e.target.value })} className={clsx(field, "[color-scheme:dark]")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-cream/70">Notas (opcional)</span>
                <textarea
                  rows={3}
                  value={info.notes}
                  onChange={(e) => setInfo({ ...info, notes: e.target.value })}
                  className={field}
                  placeholder="Es un regalo, dedicatoria, horario…"
                />
              </label>
            </div>
            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-cream/60">Total estimado</span>
                <span className="display text-4xl tabular-nums">{bs(total)}</span>
              </div>
              <button type="submit" className="btn mt-5 w-full bg-[#25D366] text-ink hover:bg-white">
                <WhatsAppIcon className="h-5 w-5" /> Enviar pedido por WhatsApp
              </button>
              <button type="button" onClick={() => setStep("bag")} className="mt-3 w-full text-center text-xs text-cream/50 hover:text-rose">
                ← Volver a la bolsa
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
