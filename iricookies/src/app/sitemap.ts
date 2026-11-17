import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iricookies.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/menu", "/arma-tu-caja", "/eventos"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p ? 0.8 : 1 }));
}
