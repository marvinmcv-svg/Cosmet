"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { Emblem } from "./Logo";

type Msg = { role: "user" | "assistant"; content: string; products?: ProductSummary[] };

const SUGGESTIONS = [
  "Perfume para hombre amaderado",
  "Regalo para ella hasta $100",
  "¿Cuánto cuesta el envío?",
  "¿Dónde están sus tiendas?",
  "Un sérum antiedad",
  "¿Puedo pagar en cuotas?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply ?? "Lo siento, ocurrió un error.", products: data.products }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "No pude conectarme. Intenta de nuevo o escríbenos por WhatsApp al +591 650 67663." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-[65] flex items-center gap-2.5 rounded-full bg-ink py-3 pl-3.5 pr-5 text-white shadow-[0_12px_40px_rgba(0,0,0,.25)] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04] ${
          open ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
        }`}
        aria-label="Abrir Concierge Cosmet"
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink">
          <Emblem className="h-3.5 w-auto" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
        </span>
        <span className="text-[13px] font-medium">Concierge</span>
      </button>

      <section
        className={`fixed bottom-5 right-5 z-[66] flex h-[min(680px,calc(100dvh-40px))] w-[min(410px,calc(100vw-40px))] origin-bottom-right flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_rgba(0,0,0,.28)] ring-1 ring-black/5 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
        aria-label="Concierge Cosmet"
        data-lenis-prevent
      >
        <header className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink">
            <Emblem className="h-4 w-auto" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold leading-tight">Concierge Cosmet</p>
            <p className="text-[11px] text-white/60">Asesoría de belleza · responde al instante</p>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Cerrar chat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-mist/60 px-4 py-5">
          <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14px] leading-relaxed shadow-sm">
            ¡Hola! Soy tu concierge de belleza. Pregúntame por perfumes, maquillaje, tratamientos o regalos — o sobre envíos, pagos y tiendas.
          </div>
          {msgs.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12.5px] hover:border-black/30">
                  {s}
                </button>
              ))}
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              <div
                className={`max-w-[88%] whitespace-pre-line px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === "user" ? "rounded-2xl rounded-tr-md bg-ink text-white" : "rounded-2xl rounded-tl-md bg-white shadow-sm"
                }`}
              >
                {m.content}
              </div>
              {m.products && m.products.length > 0 && (
                <div className="no-scrollbar -mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
                  {m.products.map((p) => (
                    <div key={p.slug} className="w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm">
                      <Link href={`/producto/${p.slug}`} className="block aspect-square bg-white p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                      </Link>
                      <div className="px-3 pb-3">
                        <p className="truncate text-[10px] uppercase tracking-wider text-smoke">{p.brand}</p>
                        <p className="line-clamp-2 h-8 text-[12px] font-medium leading-4">{p.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[12.5px] font-semibold">{money(p.price)}</span>
                          <button
                            onClick={() => add({ slug: p.slug, name: p.name, brand: p.brand, img: p.img, price: p.price })}
                            className="rounded-full bg-ink px-2.5 py-1 text-[11px] text-white"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="inline-flex gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-4 shadow-sm">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-smoke" style={{ animationDelay: `${d * 120}ms` }} />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-black/5 bg-white p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            className="min-w-0 flex-1 rounded-full bg-mist px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-black/10"
          />
          <button disabled={!input.trim() || loading} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white disabled:opacity-30" aria-label="Enviar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </section>
    </>
  );
}
