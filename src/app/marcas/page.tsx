import type { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/lib/catalog";
import { SplitReveal } from "@/components/Motion";

export const metadata: Metadata = { title: "Marcas A–Z", description: "Todas las casas de belleza de lujo disponibles en Cosmet." };

export default function Brands() {
  const brands = getBrands().filter((b) => b.name !== "Cosmet");
  const groups = new Map<string, typeof brands>();
  for (const b of brands) {
    const k = /[a-z]/i.test(b.name[0]) ? b.name[0].toUpperCase() : "#";
    groups.set(k, [...(groups.get(k) ?? []), b]);
  }
  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1300px] px-6">
        <SplitReveal as="h1" immediate className="display text-[13vw] md:text-[7vw]" lines={["Marcas", <span key="1" className="serif-italic font-normal">de la A a la Z.</span>]} />
        <div className="sticky top-14 z-10 -mx-6 mt-12 flex flex-wrap gap-1 bg-white/90 px-6 py-3 backdrop-blur">
          {[...groups.keys()].map((k) => (
            <a key={k} href={`#l-${k}`} className="flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-medium hover:bg-mist">
              {k}
            </a>
          ))}
        </div>
        <div className="mt-8 divide-y divide-black/5">
          {[...groups.entries()].map(([k, list]) => (
            <section key={k} id={`l-${k}`} className="grid scroll-mt-32 gap-6 py-10 md:grid-cols-[120px_1fr]">
              <p className="display text-6xl text-black/15">{k}</p>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/marcas/${b.slug}`} className="group flex items-baseline justify-between gap-3 text-xl font-medium tracking-tight">
                      <span className="group-hover:underline">{b.name}</span>
                      <span className="text-[13px] font-normal text-smoke">{b.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
