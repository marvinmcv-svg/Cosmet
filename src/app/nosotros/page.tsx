import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, CONTACT } from "@/lib/info";
import { SplitReveal, Reveal, Parallax } from "@/components/Motion";
import WordScrub from "@/components/home/WordScrub";
import Logo from "@/components/Logo";

export const metadata: Metadata = { title: "Sobre Cosmet", description: "Desde 1975, el retailer de belleza de lujo de Bolivia." };

export default function About() {
  return (
    <>
      <section className="flex min-h-[100svh] flex-col items-center justify-center bg-ink px-6 text-center text-white" data-nav="dark">
        <Logo stacked className="mb-12 text-white" />
        <SplitReveal as="h1" immediate className="display text-[15vw] md:text-[9vw]" lines={["Desde", <span key="1" className="serif-italic font-normal">1975.</span>]} />
        <p className="mt-6 max-w-lg text-lg text-white/60">El club que no requiere membresía.</p>
      </section>
      <section className="bg-white px-6 py-32" data-nav="light">
        <div className="mx-auto max-w-[1000px]">
          <p className="eyebrow text-smoke">Historia</p>
          <WordScrub className="mt-6 text-3xl font-semibold leading-tight tracking-tight md:text-5xl" text={ABOUT.history} />
          <Reveal>
            <p className="mt-12 text-xl leading-relaxed text-smoke">{ABOUT.family}</p>
          </Reveal>
        </div>
      </section>
      <section className="bg-mist px-6 py-28" data-nav="light">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:items-center">
          <Parallax className="aspect-[4/5] rounded-[32px]" speed={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/banners/guerlain-tall.jpg" alt="Guerlain en Cosmet" className="h-full w-full scale-110 object-cover" />
          </Parallax>
          <div className="space-y-8">
            {[
              ["Empresa", ABOUT.company],
              ["Portafolio", ABOUT.portfolio],
              ["Tiendas", ABOUT.stores],
            ].map(([t, b]) => (
              <Reveal key={t}>
                <p className="eyebrow text-smoke">{t}</p>
                <p className="mt-3 text-lg leading-relaxed">{b}</p>
              </Reveal>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/tiendas" className="btn btn-dark">Nuestras tiendas</Link>
              <a href={CONTACT.vogue} target="_blank" rel="noreferrer" className="btn btn-ghost">Cosmet en Vogue</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
