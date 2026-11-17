import Link from "next/link";
import { CookieMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[90svh] flex-col items-center justify-center bg-ink px-6 text-center text-cream">
      <CookieMark className="h-24 w-24 text-petal" />
      <h1 className="display mt-8 text-7xl md:text-8xl">
        Ups, <span className="script text-petal">alguien se la comió.</span>
      </h1>
      <p className="mt-6 text-cream/60">La página que buscas no existe (o ya fue devorada).</p>
      <Link href="/" className="btn btn-pink mt-10">Volver al inicio</Link>
    </section>
  );
}
