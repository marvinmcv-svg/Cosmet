import Image from "next/image";
import clsx from "clsx";
import AddButton from "./AddButton";
import { Bow } from "./Ornaments";
import type { Product } from "@/data/catalog";
import { bs } from "@/lib/format";

export default function CookieCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  if (product.soon) {
    return (
      <article
        data-reveal
        className="relative col-span-2 flex min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-ink p-8 text-center text-cream sm:col-span-1 sm:min-h-[26rem]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(236,156,179,0.35),transparent_60%)]" aria-hidden />
        <Bow className="relative mb-6 h-10 w-16 text-rose" />
        <p className="eyebrow relative text-rose">Coming soon</p>
        <h3 className="display relative mt-4 text-5xl">{product.name}</h3>
        <p className="relative mt-4 max-w-[18rem] text-cream/70">{product.description}</p>
      </article>
    );
  }

  return (
    <article
      data-reveal
      className={clsx(
        "cookie-card group relative flex flex-col overflow-hidden rounded-[1.5rem] p-3.5 transition-shadow sm:rounded-[2rem] sm:p-6 duration-700 hover:shadow-[0_40px_80px_-40px_rgba(158,42,82,0.45)]",
        dark ? "bg-ink-2 text-cream ring-1 ring-white/5" : "bg-white text-ink"
      )}
    >
      {product.category === "especial" ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem]">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 440px, 50vw"
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
        </div>
      ) : (
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[17rem]">
        <div
          className="absolute inset-[9%] rounded-full transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-110"
          style={{ background: dark ? "rgba(236,156,179,0.12)" : product.tone }}
          aria-hidden
        />
        <Image
          src={product.img}
          alt={`Cookie ${product.name} de IriCookies`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 40vw, 80vw"
          className={clsx("cookie-img object-contain", dark ? "cookie-shadow" : "cookie-shadow-soft")}
        />
      </div>
      )}
      {product.badge && (
        <span
          className={clsx(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] sm:left-5 sm:top-5 sm:px-3 sm:text-[0.7rem]",
            dark ? "bg-petal text-ink" : "bg-ink text-petal"
          )}
        >
          {product.badge}
        </span>
      )}
      <div className="mt-3 flex flex-1 flex-col sm:mt-6">
        <h3 className="display text-[1.35rem] sm:text-[2rem]">{product.name}</h3>
        <p className={clsx("mt-1.5 flex-1 text-[0.8rem] leading-snug sm:mt-2 sm:text-[0.95rem] sm:leading-relaxed", dark ? "text-cream/65" : "text-muted")}>
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between sm:mt-6">
          <p className="font-serif text-lg sm:text-2xl">{product.price != null ? bs(product.price) : "Consultar"}</p>
          <AddButton product={product} tone={dark ? "pink" : "ink"} />
        </div>
      </div>
    </article>
  );
}
