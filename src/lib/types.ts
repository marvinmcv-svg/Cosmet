export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  img: string;
  price: number;
  old?: number;
  short: string;
  cats: string[];
  isNew?: boolean;
};

export type VariantValue = {
  id: string;
  label: string;
  price: number;
  old?: number;
  img?: string;
  swatch?: string;
  available: boolean;
};

export type Product = ProductSummary & {
  sku: string;
  desc?: string;
  gallery: string[];
  tags: string[];
  attrs: Record<string, string>;
  option?: { label: string; values: VariantValue[] };
  source: string;
};

export type Brand = { slug: string; name: string; count: number; logo?: string };
