export type CategoryGroup = {
  slug: string;
  name: string;
  tagline: string;
  children: { slug: string; name: string }[];
};

/** Mirrors the department structure of cosmet.com.bo */
export const GROUPS: CategoryGroup[] = [
  {
    slug: "fragancias",
    name: "Fragancias",
    tagline: "Perfumes de autor, clásicos y nicho.",
    children: [
      { slug: "fragancias-femeninas", name: "Femeninas" },
      { slug: "fragancias-masculinas", name: "Masculinas" },
      { slug: "fragancias-niche", name: "Nicho" },
      { slug: "fragancias-infantiles", name: "Infantiles" },
      { slug: "velas", name: "Velas y hogar" },
    ],
  },
  {
    slug: "maquillaje",
    name: "Maquillaje",
    tagline: "Color, textura y luz de las casas más icónicas.",
    children: [
      { slug: "labios", name: "Labios" },
      { slug: "ojos", name: "Ojos" },
      { slug: "rostro", name: "Rostro" },
      { slug: "paletas", name: "Paletas" },
      { slug: "maquillaje-otros", name: "Brochas y accesorios" },
    ],
  },
  {
    slug: "tratamiento",
    name: "Tratamiento",
    tagline: "Rituales de cuidado para rostro, cuerpo y cabello.",
    children: [
      { slug: "facial", name: "Facial" },
      { slug: "cuidado-ojos", name: "Contorno de ojos" },
      { slug: "cuidado-labios", name: "Cuidado de labios" },
      { slug: "corporal", name: "Corporal" },
      { slug: "capilar", name: "Capilar" },
      { slug: "solares", name: "Solares" },
    ],
  },
  {
    slug: "regalos",
    name: "Regalos",
    tagline: "Sets y coffrets listos para sorprender.",
    children: [{ slug: "sets-de-regalo", name: "Sets de regalo" }],
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    tagline: "Bolsos, viaje y accesorios.",
    children: [],
  },
];

export const ALL_CATEGORIES: Record<string, { name: string; group: string }> = Object.fromEntries(
  GROUPS.flatMap((g) => [
    [g.slug, { name: g.name, group: g.slug }],
    ...g.children.map((c) => [c.slug, { name: c.name, group: g.slug }]),
  ])
);

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const WHATSAPP = "59165067663";
export const FREE_SHIPPING_FROM = 50;
