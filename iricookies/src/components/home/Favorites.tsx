import CookieCard from "../CookieCard";
import SectionHeading from "../SectionHeading";
import { classics, PRICES } from "@/data/catalog";
import { bs } from "@/lib/format";

export default function Favorites() {
  return (
    <section id="favoritas" className="relative bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Nuestras cookies"
            title="The"
            script="favorites."
            lead="Siete clásicas que nunca fallan. Gorditas por fuera, suaves por dentro y con los toppings que las hacen únicas."
          />
          <ul data-reveal className="flex shrink-0 flex-wrap gap-2 text-sm font-semibold">
            <li className="rounded-full bg-ink px-4 py-2.5 text-cream">1 cookie · {bs(PRICES.single)}</li>
            <li className="rounded-full bg-petal px-4 py-2.5">6 pack · {bs(PRICES.box6)}</li>
            <li className="rounded-full bg-petal px-4 py-2.5">12 pack · {bs(PRICES.box12)}</li>
          </ul>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {classics.map((p) => (
            <CookieCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
