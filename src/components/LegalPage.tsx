import { SplitReveal } from "./Motion";
import legal from "@/data/legal.json";

type Block = { h?: string; p?: string };
const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Renders the official legal text from cosmet.com.bo with an index. */
export default function LegalPage({ doc, intro }: { doc: keyof typeof legal; intro?: React.ReactNode }) {
  const { title, blocks } = legal[doc] as { title: string; blocks: Block[] };
  const heads = blocks.filter((b) => b.h && /^([A-K]\.|\d+\.)\s/.test(b.h));
  return (
    <div className="bg-white pb-32 pt-36" data-nav="light">
      <div className="mx-auto max-w-[1200px] px-6">
        <SplitReveal as="h1" immediate className="display text-[11vw] md:text-[5.5vw]" lines={[title]} />
        {intro}
        <div className="mt-16 grid gap-14 lg:grid-cols-[260px_1fr]">
          {heads.length > 2 && (
            <nav className="text-[13px] lg:sticky lg:top-28 lg:self-start" aria-label="Índice">
              <p className="mb-3 font-semibold">Índice</p>
              <ul className="space-y-2 text-smoke">
                {heads.map((b) => (
                  <li key={b.h}>
                    <a href={`#${slug(b.h!)}`} className="hover:text-ink">
                      {b.h}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <article className="max-w-3xl space-y-4 text-[16px] leading-relaxed text-graphite/85">
            {blocks.map((b, i) =>
              b.h ? (
                <h2 key={i} id={slug(b.h)} className={`scroll-mt-28 font-semibold tracking-tight text-ink ${/^[A-K]\.|^\d+\.\s/.test(b.h) ? "pt-8 text-2xl" : "pt-4 text-lg"}`}>
                  {b.h}
                </h2>
              ) : (
                <p key={i}>{b.p}</p>
              )
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
