import Link from "next/link";
import ProductCard from "./ProductCard";
import SortSelect from "./SortSelect";
import { SplitReveal } from "./Motion";
import { search, summary, type Query } from "@/lib/catalog";
import { GROUPS, ALL_CATEGORIES } from "@/lib/taxonomy";

const PER_PAGE = 36;
const PRICE_BANDS = [
  { label: "Hasta $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "Más de $200", min: 200, max: 100000 },
];

export type ShopParams = { q?: string; marca?: string; ofertas?: string; orden?: string; min?: string; max?: string; pagina?: string };

export default function ShopView({ cat, params, title, subtitle, basePath }: { cat?: string; params: ShopParams; title: React.ReactNode; subtitle?: string; basePath: string }) {
  const query: Query = {
    q: params.q,
    cat,
    brand: params.marca,
    sale: params.ofertas === "1",
    min: params.min ? Number(params.min) : undefined,
    max: params.max ? Number(params.max) : undefined,
    sort: (params.orden as Query["sort"]) || undefined,
  };
  const all = search(query);
  const page = Math.max(1, Number(params.pagina ?? 1));
  const items = all.slice(0, page * PER_PAGE).map(summary);

  // facets computed without the brand filter so you can switch brands
  const brandFacet = new Map<string, { name: string; n: number }>();
  for (const p of search({ ...query, brand: undefined })) {
    const b = brandFacet.get(p.brandSlug) ?? { name: p.brand, n: 0 };
    b.n++;
    brandFacet.set(p.brandSlug, b);
  }
  const brands = [...brandFacet.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 24);

  const href = (patch: Partial<ShopParams>) => {
    const sp = new URLSearchParams();
    const merged = { ...params, pagina: undefined, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && sp.set(k, String(v)));
    const s = sp.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };

  const group = cat ? GROUPS.find((g) => g.slug === (ALL_CATEGORIES[cat]?.group ?? cat)) : undefined;

  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1400px] px-6">
        <SplitReveal as="h1" immediate className="display text-[13vw] md:text-[7vw]" lines={[title]} />
        {subtitle && <p className="mt-4 max-w-xl text-lg text-smoke">{subtitle}</p>}

        {/* Sub-category pills */}
        <div className="no-scrollbar -mx-6 mt-10 flex gap-2 overflow-x-auto px-6">
          {(group ? [{ slug: group.slug, name: `Todo ${group.name}` }, ...group.children] : GROUPS.map((g) => ({ slug: g.slug, name: g.name }))).map((c) => (
            <Link
              key={c.slug}
              href={`/tienda/${c.slug}`}
              className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] transition ${cat === c.slug ? "bg-ink text-white" : "bg-mist hover:bg-fog"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[230px_1fr]">
          {/* Filters */}
          <aside className="space-y-9 text-[14px] max-lg:hidden">
            <div>
              <p className="mb-3 font-semibold">Precio</p>
              <ul className="space-y-2">
                {PRICE_BANDS.map((b) => {
                  const on = params.min === String(b.min) && params.max === String(b.max);
                  return (
                    <li key={b.label}>
                      <Link href={on ? href({ min: undefined, max: undefined }) : href({ min: String(b.min), max: String(b.max) })} className={on ? "font-semibold" : "text-smoke hover:text-ink"}>
                        {on ? "✓ " : ""}
                        {b.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <Link href={href({ ofertas: params.ofertas === "1" ? undefined : "1" })} className="flex items-center gap-3">
                <span className={`relative h-6 w-10 rounded-full transition ${params.ofertas === "1" ? "bg-ink" : "bg-fog"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${params.ofertas === "1" ? "left-[18px]" : "left-0.5"}`} />
                </span>
                Solo ofertas
              </Link>
            </div>
            <div>
              <p className="mb-3 font-semibold">Marcas</p>
              <ul className="space-y-2">
                {params.marca && (
                  <li>
                    <Link href={href({ marca: undefined })} className="font-semibold">
                      × Quitar marca
                    </Link>
                  </li>
                )}
                {brands.map(([slug, b]) => (
                  <li key={slug}>
                    <Link href={href({ marca: params.marca === slug ? undefined : slug })} className={`flex justify-between ${params.marca === slug ? "font-semibold" : "text-smoke hover:text-ink"}`}>
                      <span>{b.name}</span>
                      <span className="text-[12px] opacity-60">{b.n}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-5">
              <p className="text-[14px] text-smoke">
                {all.length.toLocaleString("es-BO")} productos{params.q ? ` para “${params.q}”` : ""}
              </p>
              <SortSelect value={params.orden ?? ""} />
            </div>
            {items.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-2xl font-semibold">No encontramos productos.</p>
                <p className="mt-2 text-smoke">Prueba con otra búsqueda o quita algunos filtros.</p>
                <Link href={basePath} className="btn btn-dark mt-6">
                  Limpiar filtros
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
                {items.map((p, i) => (
                  <ProductCard key={p.slug} p={p} priority={i < 8} />
                ))}
              </div>
            )}
            {items.length < all.length && (
              <div className="mt-16 text-center">
                <Link href={href({ pagina: String(page + 1) })} scroll={false} className="btn btn-ghost">
                  Mostrar más ({all.length - items.length})
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
