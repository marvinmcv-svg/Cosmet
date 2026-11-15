"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/lib/wishlist";
import { useMounted } from "@/lib/useMounted";

export default function Favorites() {
  const mounted = useMounted();
  const items = useWishlist((s) => s.items);
  return (
    <div className="min-h-[70vh] bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1300px] px-6">
        <h1 className="display text-5xl md:text-7xl">
          Tus <span className="serif-italic font-normal">favoritos.</span>
        </h1>
        {mounted && items.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <p className="text-lg text-smoke">Guarda los productos que te encantan tocando el corazón.</p>
            <Link href="/tienda" className="btn btn-dark mt-8">
              Explorar la tienda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
