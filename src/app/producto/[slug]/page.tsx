import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { Reveal } from "@/components/Motion";
import { getProduct, related } from "@/lib/catalog";
import { ALL_CATEGORIES } from "@/lib/taxonomy";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.brand}`,
    description: (p.desc ?? `${p.brand} ${p.name}. ${p.short}`).slice(0, 160),
    openGraph: { images: [p.gallery[0] ?? p.img] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const rel = related(p);
  const crumbs = p.cats.filter((c) => ALL_CATEGORIES[c]).reverse().slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.sku,
    image: p.gallery,
    description: p.desc?.slice(0, 500),
    offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, availability: "https://schema.org/InStock" },
  };

  return (
    <div className="bg-white pb-24 pt-28" data-nav="light">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mx-auto mb-6 max-w-[1400px] px-6 text-[13px] text-smoke">
        <Link href="/" className="hover:text-ink">Inicio</Link>
        {crumbs.map((c) => (
          <span key={c}>
            {" "}/{" "}
            <Link href={`/tienda/${c}`} className="hover:text-ink">
              {ALL_CATEGORIES[c].name}
            </Link>
          </span>
        ))}
      </nav>
      <ProductDetail p={p} />
      {rel.length > 0 && (
        <section className="mx-auto mt-28 max-w-[1400px] px-6">
          <h2 className="display text-4xl md:text-5xl">
            También te <span className="serif-italic font-normal">encantará.</span>
          </h2>
          <Reveal className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4" stagger={0.06}>
            {rel.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </Reveal>
        </section>
      )}
    </div>
  );
}
