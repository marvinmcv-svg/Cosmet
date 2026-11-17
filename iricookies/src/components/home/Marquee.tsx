import { Sparkle } from "../Ornaments";

const WORDS = ["Chocolate Chip", "Red Velvet", "Cookies & Cream", "S’mores", "Double Chocolate", "Nido", "Salted Caramel", "Lotus Biscoff", "Nutella", "Cookie Pie"];

export default function Marquee({ tone = "pink" }: { tone?: "pink" | "ink" }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <li key={w} className="flex items-center">
          <span className="display px-6 text-4xl md:px-8 md:text-6xl">{w}</span>
          <Sparkle className={tone === "pink" ? "h-5 w-5 text-berry" : "h-5 w-5 text-rose"} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee relative overflow-hidden py-6 md:py-8 ${tone === "pink" ? "bg-petal text-ink" : "bg-ink text-cream"}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
