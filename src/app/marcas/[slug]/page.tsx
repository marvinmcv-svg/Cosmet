import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopView, { type ShopParams } from "@/components/ShopView";
import { getBrands } from "@/lib/catalog";
import BrandHero from "@/components/BrandHero";
import brandsJson from "@/data/brands.json";

const BRAND_CONTENT = brandsJson as Record<string, { story: string[]; images: { src: string; w: number; h: number }[] }>;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<ShopParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrands().find((x) => x.slug === slug);
  return { title: b ? b.name : "Marca" };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const b = getBrands().find((x) => x.slug === slug);
  if (!b) notFound();
  const content = BRAND_CONTENT[slug];
  return (
    <>
      {content && <BrandHero name={b.name} count={b.count} story={content.story} images={content.images} />}
      <Suspense>
        <ShopView
          params={{ ...sp, marca: slug }}
          basePath={`/marcas/${slug}`}
          title={content ? `Todo ${b.name}` : b.name}
          subtitle={`${b.count} productos de ${b.name} disponibles en Cosmet.`}
          compact={Boolean(content)}
        />
      </Suspense>
    </>
  );
}
