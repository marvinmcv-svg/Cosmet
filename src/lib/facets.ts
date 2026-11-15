// Facets derived from the store's own product tags on cosmet.com.bo.
export type FacetDef = { key: string; label: string; values: { slug: string; label: string; tags: string[] }[] };

export const FACETS: FacetDef[] = [
  {
    key: "para",
    label: "Para",
    values: [
      { slug: "ella", label: "Ella", tags: ["Para ella", "Mujer"] },
      { slug: "el", label: "Él", tags: ["Para el", "Hombre"] },
      { slug: "unisex", label: "Unisex", tags: ["Fragancias unisex"] },
      { slug: "ninos", label: "Niños", tags: ["Para niños"] },
    ],
  },
  {
    key: "familia",
    label: "Familia olfativa",
    values: [
      { slug: "florales", label: "Florales", tags: ["Florales"] },
      { slug: "amaderados", label: "Amaderados", tags: ["Amaderados"] },
      { slug: "citricos-frutales", label: "Cítricos y frutales", tags: ["Citricos & frutales"] },
      { slug: "calidos-especiados", label: "Cálidos y especiados", tags: ["Calidos & especiados"] },
      { slug: "frescos", label: "Frescos", tags: ["Frescos"] },
      { slug: "ambar", label: "Ámbar", tags: ["Ambar"] },
    ],
  },
  {
    key: "concentracion",
    label: "Concentración",
    values: [
      { slug: "parfum", label: "Parfum / Extrait", tags: [] },
      { slug: "edp", label: "Eau de Parfum", tags: [] },
      { slug: "edt", label: "Eau de Toilette", tags: [] },
      { slug: "edc", label: "Eau de Cologne", tags: [] },
    ],
  },
  {
    key: "piel",
    label: "Tipo de piel",
    values: ["Normal", "Mixta", "Seca", "Grasa", "Madura", "Sensible"].map((v) => ({
      slug: v.toLowerCase(),
      label: v,
      tags: [`Piel ${v.toLowerCase()}`],
    })),
  },
  {
    key: "necesidad",
    label: "Necesidad",
    values: [
      ["hidratacion", "Hidratación", "Hidratacion"],
      ["antiarrugas", "Antiarrugas", "Antiarrugas"],
      ["reafirmante", "Reafirmante", "Reafirmante"],
      ["luminosidad", "Luminosidad", "Luminosidad"],
      ["prevencion-edad", "Prevención de la edad", "Prevencion de edad"],
      ["nutricion", "Nutrición", "Nutricion"],
      ["uniformidad", "Uniformidad", "Uniformidad"],
      ["antimanchas", "Antimanchas", "Antimanchas"],
      ["poros", "Minimizar poros", "Minimizador de poros"],
      ["control-brillo", "Control de brillo", "Control de brillo"],
      ["reparacion", "Reparación", "Reparacion"],
      ["suavidad", "Suavidad", "Suavidad"],
    ].map(([slug, label, tag]) => ({ slug, label, tags: [tag] })),
  },
  {
    key: "cabello",
    label: "Tipo de cabello",
    values: ["Normal", "Seco", "Graso", "Dañado", "Frágil", "Teñido", "Rizado", "Ondulado", "Lacio"].map((v) => ({
      slug: v
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase(),
      label: v,
      tags: [`Cabello ${v.toLowerCase().replace("frágil", "fragil")}`],
    })),
  },
];

type Taggable = { tags: string[]; cats: string[]; short: string; name: string };

function concentration(p: Taggable): string | undefined {
  if (!p.cats.includes("fragancias")) return;
  const s = `${p.short} ${p.name}`.toLowerCase();
  if (/set|coffret|vela|desodorante|loci[oó]n|gel|crema/.test(s)) return;
  if (/eau de parfum|edp|le parfum intense|parfum intens/.test(s) && !/^parfum/.test(p.short.toLowerCase())) return "edp";
  if (/eau de toilette|edt/.test(s)) return "edt";
  if (/cologne|colonia/.test(s)) return "edc";
  if (/parfum|extrait|elixir|extract/.test(s)) return "parfum";
}

/** facet key -> value slugs for a product */
export function facetValues(p: Taggable): Record<string, string[]> {
  const tags = new Set(p.tags);
  const out: Record<string, string[]> = {};
  for (const f of FACETS) {
    if (f.key === "concentracion") {
      const c = concentration(p);
      if (c) out[f.key] = [c];
      continue;
    }
    const vals = f.values.filter((v) => v.tags.some((t) => tags.has(t))).map((v) => v.slug);
    if (f.key === "para") {
      if (p.cats.includes("fragancias-femeninas") && !vals.includes("ella")) vals.push("ella");
      if (p.cats.includes("fragancias-masculinas") && !vals.includes("el")) vals.push("el");
      if (p.cats.includes("fragancias-infantiles") && !vals.includes("ninos")) vals.push("ninos");
    }
    if (vals.length) out[f.key] = vals;
  }
  return out;
}

export const facetLabel = (key: string, slug: string) => FACETS.find((f) => f.key === key)?.values.find((v) => v.slug === slug)?.label ?? slug;
