import productsJson from "@/data/products.json";
import homeJson from "@/data/home.json";
import type { Product, ProductSummary, Brand } from "./types";
import { ALL_CATEGORIES } from "./taxonomy";
import { facetValues, FACETS } from "./facets";

const PRODUCTS = productsJson as unknown as Product[];
const BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
export const FACET_INDEX = new Map(PRODUCTS.map((p) => [p.slug, facetValues(p)]));

export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Pre-computed haystacks for search
const HAY = new Map(
  PRODUCTS.map((p) => [
    p.slug,
    {
      name: norm(p.name),
      brand: norm(p.brand),
      rest: norm([p.short, ...p.cats.map((c) => ALL_CATEGORIES[c]?.name ?? c), ...p.tags, ...Object.values(p.attrs)].join(" ")),
    },
  ])
);

export function summary(p: Product): ProductSummary {
  const { id, slug, name, brand, brandSlug, img, price, old, short, cats, isNew } = p;
  return { id, slug, name, brand, brandSlug, img, price, old, short, cats, isNew };
}

export function getProduct(slug: string) {
  return BY_SLUG.get(slug);
}

export function allProducts() {
  return PRODUCTS;
}

export function getBrands(): Brand[] {
  const m = new Map<string, Brand>();
  for (const p of PRODUCTS) {
    const b = m.get(p.brandSlug) ?? { slug: p.brandSlug, name: p.brand, count: 0 };
    b.count++;
    m.set(p.brandSlug, b);
  }
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export type Query = {
  q?: string;
  cat?: string;
  brand?: string;
  sale?: boolean;
  min?: number;
  max?: number;
  sort?: "relevancia" | "precio-asc" | "precio-desc" | "nuevo" | "nombre";
  /** facet key -> required value slug */
  facets?: Record<string, string>;
};

function score(p: Product, terms: string[]) {
  const h = HAY.get(p.slug)!;
  let s = 0;
  for (const t of terms) {
    let hit = 0;
    if (h.name.includes(t)) hit = h.name.startsWith(t) || h.name.includes(" " + t) ? 6 : 4;
    if (h.brand.includes(t)) hit = Math.max(hit, 5);
    if (!hit && h.rest.includes(t)) hit = 1.5;
    if (!hit) return 0;
    s += hit;
  }
  return s;
}

export function search(query: Query) {
  const terms = query.q ? norm(query.q).split(/[^a-z0-9°]+/).filter((t) => t.length > 1 || /\d/.test(t)) : [];
  const list: { p: Product; s: number }[] = [];
  for (const p of PRODUCTS) {
    if (query.cat && !p.cats.includes(query.cat)) continue;
    if (query.brand && p.brandSlug !== query.brand) continue;
    if (query.sale && !p.old) continue;
    if (query.min != null && p.price < query.min) continue;
    if (query.max != null && p.price > query.max) continue;
    if (query.facets) {
      const fv = FACET_INDEX.get(p.slug)!;
      if (Object.entries(query.facets).some(([k, v]) => !fv[k]?.includes(v))) continue;
    }
    const s = terms.length ? score(p, terms) : 1;
    if (s > 0) list.push({ p, s });
  }
  const sort = query.sort ?? (terms.length ? "relevancia" : "nuevo");
  if (sort === "precio-asc") list.sort((a, b) => a.p.price - b.p.price);
  else if (sort === "precio-desc") list.sort((a, b) => b.p.price - a.p.price);
  else if (sort === "nombre") list.sort((a, b) => a.p.name.localeCompare(b.p.name, "es"));
  else if (sort === "relevancia") list.sort((a, b) => b.s - a.s);
  // "nuevo" keeps the store's own ordering (newest first)
  return list.map((x) => x.p);
}

export function related(p: Product, n = 8) {
  const primary = p.cats[0];
  const sameBrand = PRODUCTS.filter((x) => x.slug !== p.slug && x.brandSlug === p.brandSlug && x.cats.includes(primary));
  const sameCat = PRODUCTS.filter((x) => x.slug !== p.slug && x.brandSlug !== p.brandSlug && x.cats.includes(primary));
  return [...sameBrand.slice(0, n / 2), ...sameCat.slice(0, n)].slice(0, n).map(summary);
}

export function homeSection(key: keyof typeof homeJson) {
  return (homeJson[key] as string[]).map((s) => BY_SLUG.get(s)).filter(Boolean).map((p) => summary(p!));
}

export function pick(slugs: string[]) {
  return slugs.map((s) => BY_SLUG.get(s)).filter(Boolean).map((p) => summary(p!));
}

/** Count facet values across a product list (for filter sidebars). */
export function facetCounts(list: Product[]) {
  return FACETS.map((f) => {
    const counts = new Map<string, number>();
    for (const p of list) for (const v of FACET_INDEX.get(p.slug)?.[f.key] ?? []) counts.set(v, (counts.get(v) ?? 0) + 1);
    return { ...f, values: f.values.map((v) => ({ ...v, n: counts.get(v.slug) ?? 0 })).filter((v) => v.n > 0) };
  }).filter((f) => f.values.length > 0);
}
