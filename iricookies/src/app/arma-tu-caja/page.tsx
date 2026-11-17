import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BoxBuilder from "@/components/BoxBuilder";
import { PRICES } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Arma tu caja",
  description: `Build your box: elige una caja de 6 (${PRICES.box6} Bs) o 12 (${PRICES.box12} Bs) y combina tus sabores favoritos de IriCookies.`,
};

export default function BoxPage() {
  return (
    <>
      <PageHero
        eyebrow="Build your box"
        title="Build"
        script="your box."
        lead={`Caja de 6 · ${PRICES.box6} Bs  —  Caja de 12 · ${PRICES.box12} Bs. Biscoff y Nutella: +${PRICES.premiumSurcharge} Bs por cookie premium.`}
      />
      <section className="bg-blush py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <BoxBuilder />
        </div>
      </section>
    </>
  );
}
