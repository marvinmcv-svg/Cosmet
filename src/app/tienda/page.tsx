import type { Metadata } from "next";
import { Suspense } from "react";
import ShopView, { type ShopParams } from "@/components/ShopView";

export const metadata: Metadata = { title: "Tienda", description: "Compra fragancias, maquillaje y tratamiento de lujo en Cosmet." };

export default async function Shop({ searchParams }: { searchParams: Promise<ShopParams> }) {
  const params = await searchParams;
  const title = params.q ? `“${params.q}”` : params.ofertas === "1" ? "Ofertas" : "Tienda";
  return (
    <Suspense>
      <ShopView params={params} basePath="/tienda" title={title} subtitle={params.ofertas === "1" ? "Ahorra en tus compras online, en productos seleccionados de nuestras casas más exclusivas." : undefined} />
    </Suspense>
  );
}
