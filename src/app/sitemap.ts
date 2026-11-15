import type { MetadataRoute } from "next";
import { allProducts, getBrands } from "@/lib/catalog";
import { ALL_CATEGORIES } from "@/lib/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosmet.vercel.app";
  const fixed = ["", "/tienda", "/marcas", "/tiendas", "/nosotros", "/servicios", "/ayuda"].map((p) => ({ url: base + p }));
  return [
    ...fixed,
    ...Object.keys(ALL_CATEGORIES).map((c) => ({ url: `${base}/tienda/${c}` })),
    ...getBrands().map((b) => ({ url: `${base}/marcas/${b.slug}` })),
    ...allProducts().map((p) => ({ url: `${base}/producto/${p.slug}` })),
  ];
}
