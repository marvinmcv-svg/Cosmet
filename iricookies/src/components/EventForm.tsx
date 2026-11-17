"use client";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppFab";

const TYPES = ["Cumpleaños", "Celebración", "Evento", "Otro"];

export default function EventForm() {
  const [f, setF] = useState({ name: "", date: "", place: "", type: "Cumpleaños", guests: "", notes: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      "¡Hola IriCookies! 🩷 Quiero cotizar el alquiler del carrito:",
      "",
      `Nombre: ${f.name}`,
      `Fecha: ${f.date}`,
      `Lugar: ${f.place}`,
      `Tipo de evento: ${f.type}`,
      f.guests ? `Invitados aprox.: ${f.guests}` : null,
      f.notes ? `Detalles: ${f.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  };

  const field =
    "w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-ink placeholder:text-ink/35 outline-none transition focus:border-berry focus:ring-4 focus:ring-petal";

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2.25rem] bg-cream p-6 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.6)] md:grid-cols-2 md:p-9">
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm font-semibold">Tu nombre</span>
        <input required autoComplete="name" value={f.name} onChange={set("name")} className={field} placeholder="¿Con quién hablamos?" />
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold">Fecha del evento</span>
        <input required type="date" value={f.date} onChange={set("date")} className={field} />
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold">Invitados (aprox.)</span>
        <input inputMode="numeric" value={f.guests} onChange={set("guests")} className={field} placeholder="50" />
      </label>
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm font-semibold">Lugar</span>
        <input required value={f.place} onChange={set("place")} className={field} placeholder="Salón, casa, barrio…" />
      </label>
      <fieldset className="md:col-span-2">
        <legend className="mb-2 block text-sm font-semibold">Tipo de evento</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label key={t} className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition ${f.type === t ? "bg-ink text-cream" : "bg-white ring-1 ring-ink/10 hover:ring-berry"}`}>
              <input type="radio" name="type" value={t} checked={f.type === t} onChange={() => setF({ ...f, type: t })} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm font-semibold">Cuéntanos más (opcional)</span>
        <textarea rows={3} value={f.notes} onChange={set("notes")} className={field} placeholder="Horario, temática, sabores favoritos…" />
      </label>
      <button type="submit" className="btn mt-2 bg-[#25D366] text-ink hover:bg-ink hover:text-cream md:col-span-2">
        <WhatsAppIcon className="h-5 w-5" /> Consultar disponibilidad por WhatsApp
      </button>
    </form>
  );
}
