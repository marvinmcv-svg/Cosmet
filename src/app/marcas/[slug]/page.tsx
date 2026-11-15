import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopView, { type ShopParams } from "@/components/ShopView";
import { getBrands } from "@/lib/catalog";

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
  return (
    <Suspense>
      <ShopView params={{ ...sp, marca: slug }} basePath={`/marcas/${slug}`} title={b.name} subtitle={`${b.count} productos de ${b.name} disponibles en Cosmet.`} />
    </Suspense>
  );
}
