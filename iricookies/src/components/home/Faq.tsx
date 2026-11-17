import { faqs } from "@/data/catalog";
import { Plus } from "../AddButton";

export default function Faq() {
  return (
    <section id="faq" className="bg-cream py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <header data-reveal>
          <p className="eyebrow text-berry">Preguntas frecuentes</p>
          <h2 className="display mt-5 text-[clamp(3rem,7vw,6rem)]">
            Todo lo que <span className="script text-[0.85em] text-berry">querías saber.</span>
          </h2>
        </header>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} data-reveal className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left">
                <span className="font-serif text-2xl leading-snug md:text-[1.7rem]">{f.q}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-petal transition-transform duration-500 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-14 text-lg leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
