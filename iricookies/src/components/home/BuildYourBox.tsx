import BoxBuilder from "../BoxBuilder";
import SectionHeading from "../SectionHeading";
import { Bow } from "../Ornaments";

export default function BuildYourBox() {
  return (
    <section id="arma-tu-caja" className="relative overflow-hidden bg-blush py-24 md:py-36">
      <Bow className="absolute right-[6%] top-20 hidden h-20 w-32 rotate-6 text-rose md:block" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Build your box"
          title="Arma tu"
          script="caja."
          lead="Elige 6 o 12 y combina los sabores que quieras. Un pequeño detalle para regalar o para disfrutar (sin compartir, no te juzgamos)."
        />
        <div className="mt-14" data-reveal>
          <BoxBuilder />
        </div>
      </div>
    </section>
  );
}
