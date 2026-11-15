"use client";
import { useState } from "react";

export default function Newsletter() {
  const [done, setDone] = useState(false);
  return done ? (
    <p className="mt-6 text-[13px] text-graphite">¡Gracias! Pronto recibirás nuestras novedades.</p>
  ) : (
    <form
      className="mt-6 flex max-w-xs overflow-hidden rounded-full border border-black/10 bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input type="email" required placeholder="Tu correo electrónico" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[13px] text-graphite outline-none" />
      <button className="px-4 text-[13px] font-medium text-graphite hover:opacity-60">Suscribirse</button>
    </form>
  );
}
