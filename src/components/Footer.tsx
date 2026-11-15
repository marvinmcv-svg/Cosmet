import Link from "next/link";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { WHATSAPP } from "@/lib/taxonomy";

const COLS = [
  {
    title: "Comprar",
    links: [
      ["Fragancias", "/tienda/fragancias"],
      ["Maquillaje", "/tienda/maquillaje"],
      ["Tratamiento", "/tienda/tratamiento"],
      ["Regalos", "/tienda/regalos"],
      ["Ofertas", "/tienda?ofertas=1"],
      ["Marcas A–Z", "/marcas"],
    ],
  },
  {
    title: "Ayuda",
    links: [
      ["Pedidos en línea", "/ayuda#pedidos"],
      ["Métodos de entrega", "/ayuda#entrega"],
      ["Métodos de pago", "/ayuda#pago"],
      ["Cambios y devoluciones", "/ayuda#cambios"],
      ["Pago en cuotas", "/ayuda#cuotas"],
      ["Términos y condiciones", "/terminos-y-condiciones"],
      ["Política de privacidad", "/politicas-de-privacidad"],
    ],
  },
  {
    title: "Cosmet",
    links: [
      ["Sobre nosotros", "/nosotros"],
      ["Servicios de belleza", "/servicios"],
      ["Trending", "/trending"],
      ["Trabaja con nosotros", "/trabaja-con-nosotros"],
      ["Nuestras tiendas", "/tiendas"],
      ["Instagram", "https://www.instagram.com/cosmet_oficial/"],
      ["WhatsApp", `https://wa.me/${WHATSAPP}`],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-mist text-[12px] text-smoke" data-nav="light">
      <div className="mx-auto max-w-[1100px] px-5 pt-16">
        <div className="grid gap-12 border-b border-black/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-graphite" />
            <p className="mt-5 max-w-xs leading-relaxed">
              El retailer de belleza de lujo de Bolivia desde 1975. Santa Cruz · La Paz · Cochabamba.
            </p>
            <Newsletter />
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="mb-3 font-semibold text-graphite">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="hover:text-graphite hover:underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} Cosmet. Todos los derechos reservados.</p>
          <p>
            Atención al cliente:{" "}
            <a className="text-graphite hover:underline" href={`https://wa.me/${WHATSAPP}`}>
              +591 650 67663
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
