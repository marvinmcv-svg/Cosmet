import clsx from "clsx";

export default function PageHero({ eyebrow, title, script, lead, className }: { eyebrow: string; title: string; script: string; lead?: string; className?: string }) {
  return (
    <section className={clsx("grain relative overflow-hidden bg-ink pb-20 pt-36 text-cream md:pb-28 md:pt-44", className)}>
      <div className="absolute left-1/2 top-0 -z-0 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(236,156,179,0.35),transparent_65%)] blur-2xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 text-center md:px-8">
        <p className="eyebrow text-rose">{eyebrow}</p>
        <h1 className="display mt-6 text-[clamp(3.6rem,11vw,10rem)]">
          {title} <span className="script text-[0.82em] text-petal">{script}</span>
        </h1>
        {lead && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/65">{lead}</p>}
      </div>
    </section>
  );
}
