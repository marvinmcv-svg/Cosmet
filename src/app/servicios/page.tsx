import type { Metadata } from "next";
import { SERVICES, CONTACT } from "@/lib/info";
import { SplitReveal, Reveal } from "@/components/Motion";
import Tilt from "@/components/Tilt";

export const metadata: Metadata = { title: "Servicios de belleza", description: "Diagnóstico de piel, tratamientos de cabina y maquillaje profesional MAC." };

export default function Services() {
  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1300px] px-6">
        <SplitReveal as="h1" immediate className="display text-[13vw] md:text-[7vw]" lines={["Servicios", <span key="1" className="serif-italic font-normal">de belleza.</span>]} />
        <p className="mt-6 max-w-xl text-lg text-smoke">Nuestras expertas están para ofrecerte la mejor atención de forma especial y exclusiva.</p>
        <Reveal className="mt-16 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {SERVICES.map((s, i) => (
            <Tilt key={s.title} className={`flex min-h-[420px] flex-col rounded-[28px] p-9 ${i === 0 ? "bg-ink text-white" : "bg-mist"}`} max={7}>
              <div className="tilt-layer flex h-full flex-col" style={{ ["--z" as string]: "40px" }}>
                {s.duration && <p className={`eyebrow ${i === 0 ? "text-white/50" : "text-smoke"}`}>{s.duration}</p>}
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{s.title}</h2>
                <p className={`mt-5 leading-relaxed ${i === 0 ? "text-white/70" : "text-smoke"}`}>{s.body}</p>
                <a
                  href={`https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(`Hola! Quisiera reservar: ${s.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn mt-auto self-start ${i === 0 ? "btn-light" : "btn-dark"}`}
                >
                  Reservar cita
                </a>
              </div>
            </Tilt>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
