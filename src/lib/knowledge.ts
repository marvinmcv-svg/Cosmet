import faqJson from "@/data/faq.json";
import legalJson from "@/data/legal.json";
import { ABOUT, STORES, SERVICES, CONTACT, SHIPPING } from "./info";
import { GROUPS } from "./taxonomy";
import { getBrands } from "./catalog";

export type Faq = { q: string; a: string; section: string };
export const FAQ = faqJson as Faq[];

/** Store knowledge used as the concierge's grounding — all sourced from cosmet.com.bo. */
export function knowledgeBase() {
  const brands = getBrands()
    .map((b) => `${b.name} (${b.count})`)
    .join(", ");
  return `# COSMET — información oficial

## Sobre Cosmet
${ABOUT.history}
${ABOUT.family}
${ABOUT.company}
${ABOUT.portfolio}
${ABOUT.stores}

## Tiendas
${STORES.map((s) => `- ${s.name} (${s.city}): ${s.address}. Horario: ${s.hours}.`).join("\n")}

## Servicios de belleza
${SERVICES.map((s) => `- ${s.title}${s.duration ? ` (${s.duration})` : ""}: ${s.body}`).join("\n")}

## Contacto
WhatsApp ${CONTACT.whatsapp} · Correo ${CONTACT.email} · Instagram ${CONTACT.instagramHandle}
Atención al cliente: ${CONTACT.serviceHours}. Retiro en tienda: ${CONTACT.pickupHours}.

## Envíos
Envío gratis en compras desde $${SHIPPING.freeFrom} a ciudades capitales. Si no: ${SHIPPING.santaCruz}; ${SHIPPING.capitals}; ${SHIPPING.others}.

## Departamentos
${GROUPS.map((g) => `- ${g.name}: ${g.children.map((c) => c.name).join(", ") || g.tagline}`).join("\n")}

## Marcas en catálogo (número de productos)
${brands}

## Preguntas frecuentes
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Términos y condiciones (texto oficial)
${legalJson.terminos.blocks.map((b: { h?: string; p?: string }) => (b.h ? `### ${b.h}` : b.p)).join("\n")}
`;
}
