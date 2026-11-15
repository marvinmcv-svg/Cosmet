"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-[14px]">
      <span className="text-smoke">Ordenar</span>
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(sp.toString());
          if (e.target.value) next.set("orden", e.target.value);
          else next.delete("orden");
          next.delete("pagina");
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="rounded-full bg-mist px-4 py-2 outline-none"
      >
        <option value="">Recomendados</option>
        <option value="nuevo">Novedades</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
        <option value="nombre">Nombre A–Z</option>
      </select>
    </label>
  );
}
