import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopView, { type ShopParams } from "@/components/ShopView";
import { ALL_CATEGORIES, GROUPS } from "@/lib/taxonomy";

type Props = { params: Promise<{ cat: string }>; searchParams: Promise<ShopParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const c = ALL_CATEGORIES[cat];
  return { title: c ? c.name : "Tienda" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { cat } = await params;
  const sp = await searchParams;
  const c = ALL_CATEGORIES[cat];
  if (!c) notFound();
  const group = GROUPS.find((g) => g.slug === c.group)!;
  const title = c.group === cat ? c.name : `${c.name}`;
  return (
    <Suspense>
      <ShopView cat={cat} params={sp} basePath={`/tienda/${cat}`} title={title} subtitle={c.group === cat ? group.tagline : `${group.name} · ${c.name}`} />
    </Suspense>
  );
}
