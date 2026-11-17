import type { Metadata } from "next";
import Image from "next/image";
import EventForm from "@/components/EventForm";
import { Bow } from "@/components/Ornaments";

export const metadata: Metadata = {
  title: "Alquila el carrito",
  description: "Alquila el carrito de IriCookies para tu cumpleaños, celebración o evento en Santa Cruz. Cuéntanos la fecha, el lugar y el tipo de evento.",
};

const STEPS = [
  { n: "01", t: "Cuéntanos", d: "La fecha, el lugar y el tipo de evento." },
  { n: "02", t: "Cotizamos", d: "Te escribimos para confirmar disponibilidad y cotizar el alquiler." },
  { n: "03", t: "A disfrutar", d: "Llegamos con el carrito rosa y su vitrina llena de cookies." },
];

export default function EventosPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-blush pb-20 pt-32 md:pt-40">
        <Bow className="absolute left-[6%] top-36 hidden h-16 w-28 -rotate-12 text-rose md:block" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-berry">Alquila tu carrito · Nuevo</p>
            <h1 className="display mt-6 text-[clamp(3.6rem,10vw,8.5rem)]">
              Tu evento, <span className="script block pl-[0.35em] text-[0.8em] text-berry">junto a IriCookies.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
              El carrito de IriCookies, con su toldo rosa y una vitrina llena de nuestras cookies, para tu cumpleaños, celebración o evento.
            </p>
            <p className="mt-4 text-sm font-semibold text-berry">Cumpleaños · Celebraciones · Eventos</p>
          </div>
          <div className="relative mx-auto aspect-[55/64] w-full max-w-lg">
            <Image src="/img/cart.webp" alt="Carrito rosa de IriCookies con vitrina de cookies" fill priority sizes="(min-width: 1024px) 512px, 95vw" className="object-contain mix-blend-multiply" />
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <ol className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 md:px-8">
          {STEPS.map((s) => (
            <li key={s.n} data-reveal className="rounded-[2rem] bg-white p-8">
              <span className="font-serif text-lg text-berry">{s.n}</span>
              <h2 className="display mt-6 text-4xl">{s.t}</h2>
              <p className="mt-3 text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grain relative bg-ink py-20 text-cream md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <header data-reveal>
            <p className="eyebrow text-rose">Cotiza tu evento</p>
            <h2 className="display mt-5 text-[clamp(3rem,7vw,5.5rem)]">
              Hablemos de <span className="script text-[0.85em] text-petal">tu fecha.</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-cream/65">
              Completa los datos y se abrirá WhatsApp con tu mensaje listo para enviar.
            </p>
          </header>
          <div data-reveal>
            <EventForm />
          </div>
        </div>
      </section>
    </>
  );
}
