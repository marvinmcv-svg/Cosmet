import type { Metadata } from "next";
import { FAQ } from "@/lib/knowledge";
import { CONTACT } from "@/lib/info";
import { SplitReveal } from "@/components/Motion";

export const metadata: Metadata = { title: "Ayuda", description: "Preguntas frecuentes: pedidos, entregas, pagos, cuotas, cambios y devoluciones." };

const SECTIONS: [string, string][] = [
  ["pedidos", "Pedidos en línea"],
  ["entrega", "Métodos de entrega"],
  ["pago", "Métodos de pago"],
  ["cuotas", "Pago en cuotas"],
  ["cambios", "Cambios y devoluciones"],
  ["cuenta", "Cuenta cliente"],
  ["productos", "Productos y muestras"],
  ["atencion", "Atención al cliente"],
];

export default function Help() {
  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[900px] px-6">
        <SplitReveal as="h1" immediate className="display text-[13vw] md:text-[6.5vw]" lines={["¿Cómo podemos", <span key="1" className="serif-italic font-normal">ayudarte?</span>]} />
        <div className="mt-10 flex flex-wrap gap-2">
          {SECTIONS.filter(([k]) => FAQ.some((f) => f.section === k)).map(([k, t]) => (
            <a key={k} href={`#${k}`} className="rounded-full bg-mist px-4 py-2 text-[14px] hover:bg-fog">
              {t}
            </a>
          ))}
        </div>
        {SECTIONS.map(([k, t]) => {
          const items = FAQ.filter((f) => f.section === k);
          if (!items.length) return null;
          return (
            <section key={k} id={k} className="mt-20 scroll-mt-28">
              <h2 className="text-3xl font-semibold tracking-tight">{t}</h2>
              <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
                {items.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                      {f.q}
                      <span className="text-2xl text-smoke transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-4 whitespace-pre-line leading-relaxed text-smoke">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
        <div className="mt-24 rounded-[28px] bg-ink p-10 text-white">
          <h2 className="text-3xl font-semibold tracking-tight">¿Aún tienes dudas?</h2>
          <p className="mt-3 text-white/60">{CONTACT.serviceHours}.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://wa.me/${CONTACT.whatsappRaw}`} className="btn btn-light">WhatsApp {CONTACT.whatsapp}</a>
            <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost text-white">{CONTACT.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
