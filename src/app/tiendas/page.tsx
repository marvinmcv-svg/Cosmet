import type { Metadata } from "next";
import { STORES, CONTACT } from "@/lib/info";
import { SplitReveal, Reveal } from "@/components/Motion";
import Tilt from "@/components/Tilt";

export const metadata: Metadata = { title: "Nuestras tiendas", description: "Siete tiendas Cosmet en Santa Cruz, La Paz y Cochabamba." };

export default function Stores() {
  const cities = [...new Set(STORES.map((s) => s.city))];
  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1300px] px-6">
        <SplitReveal as="h1" immediate className="display text-[13vw] md:text-[7vw]" lines={["Visítanos.", <span key="1" className="serif-italic font-normal">Te esperamos.</span>]} />
        <p className="mt-6 max-w-xl text-lg text-smoke">Asesoría experta, servicios de cabina y retiro de pedidos online en nuestras siete tiendas.</p>
        {cities.map((c) => (
          <section key={c} className="mt-20">
            <h2 className="eyebrow mb-6 text-smoke">{c}</h2>
            <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
              {STORES.filter((s) => s.city === c).map((s) => (
                <Tilt key={s.name} className="rounded-[28px] bg-mist p-8" max={6}>
                  <div className="tilt-layer" style={{ ["--z" as string]: "30px" }}>
                    <h3 className="text-2xl font-semibold tracking-tight">{s.name}</h3>
                    <p className="mt-3 text-smoke">{s.address}</p>
                    <p className="mt-1 text-smoke">{s.hours}</p>
                    <div className="mt-8 flex gap-3">
                      <a className="btn btn-dark py-2.5 text-[13px]" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.maps)}`}>
                        Cómo llegar
                      </a>
                      <a className="btn btn-ghost py-2.5 text-[13px]" target="_blank" rel="noreferrer" href={`https://wa.me/${CONTACT.whatsappRaw}`}>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </Tilt>
              ))}
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
