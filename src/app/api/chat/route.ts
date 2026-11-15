import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { search, summary, getProduct } from "@/lib/catalog";
import { knowledgeBase, FAQ } from "@/lib/knowledge";
import { norm } from "@/lib/catalog";
import { STORES, CONTACT } from "@/lib/info";
import { FACETS } from "@/lib/facets";
import type { ProductSummary } from "@/lib/types";

export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM = `Eres "Concierge Cosmet", el asesor de belleza digital de COSMET, el retailer de belleza de lujo de Bolivia desde 1975.

Cómo respondes:
- Responde en el idioma del cliente (por defecto español), con un tono cálido, elegante y conciso: 2 a 5 frases o una lista corta.
- Para cualquier pregunta sobre productos, precios, disponibilidad, recomendaciones o regalos, usa la herramienta search_products antes de responder; no inventes productos, precios ni notas olfativas. Los precios están en dólares (USD).
- Para detalles de un producto concreto (descripción, tamaños, tonos), usa get_product.
- Menciona los productos por marca y nombre con su precio. La interfaz mostrará tarjetas de los productos que encuentres, así que no pegues enlaces largos.
- Para envíos, pagos, cuotas, devoluciones, tiendas, horarios y servicios, responde solo con la información oficial de abajo. Si algo no está ahí, dilo con honestidad y ofrece el WhatsApp ${CONTACT.whatsapp}.
- No des consejos médicos; ante dudas dermatológicas sugiere el diagnóstico de piel en tienda.

${knowledgeBase()}`;

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_products",
    description:
      "Busca en el catálogo real de Cosmet (≈2.900 productos de fragancias, maquillaje, tratamiento, regalos y lifestyle). Devuelve hasta 8 productos con slug, marca, nombre, tipo, precio y categorías.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "Palabras clave: nombre, marca, tipo de producto o familia olfativa. Puede ir vacío si se filtra por categoría." },
        category: {
          type: ["string", "null"],
          description:
            "Slug opcional: fragancias, fragancias-femeninas, fragancias-masculinas, fragancias-niche, maquillaje, labios, ojos, rostro, paletas, tratamiento, facial, corporal, capilar, solares, cuidado-ojos, regalos, sets-de-regalo, lifestyle",
        },
        max_price: { type: ["number", "null"], description: "Precio máximo en USD" },
        on_sale: { type: ["boolean", "null"], description: "Solo productos con descuento" },
        para: { type: ["string", "null"], enum: ["ella", "el", "unisex", "ninos", null], description: "Público" },
        familia: {
          type: ["string", "null"],
          enum: ["florales", "amaderados", "citricos-frutales", "calidos-especiados", "frescos", "ambar", null],
          description: "Familia olfativa (fragancias)",
        },
        piel: { type: ["string", "null"], enum: ["normal", "mixta", "seca", "grasa", "madura", "sensible", null], description: "Tipo de piel (tratamiento)" },
        necesidad: {
          type: ["string", "null"],
          enum: ["hidratacion", "antiarrugas", "reafirmante", "luminosidad", "prevencion-edad", "nutricion", "uniformidad", "antimanchas", "poros", "control-brillo", "reparacion", "suavidad", null],
          description: "Necesidad de la piel (tratamiento)",
        },
      },
      required: ["query", "category", "max_price", "on_sale", "para", "familia", "piel", "necesidad"],
    },
  },
  {
    name: "get_product",
    description: "Devuelve el detalle completo de un producto por su slug: descripción oficial, tamaños o tonos con precios, y atributos.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
];

function runTool(name: string, input: Record<string, unknown>, found: Map<string, ProductSummary>) {
  if (name === "search_products") {
    const res = search({
      q: String(input.query ?? ""),
      cat: (input.category as string) || undefined,
      max: typeof input.max_price === "number" ? input.max_price : undefined,
      sale: input.on_sale === true || undefined,
      facets: Object.fromEntries(["para", "familia", "piel", "necesidad"].filter((k) => typeof input[k] === "string").map((k) => [k, input[k] as string])),
    }).slice(0, 8);
    res.forEach((p) => found.set(p.slug, summary(p)));
    if (!res.length) return "Sin resultados. Prueba con otras palabras clave o sin filtros.";
    return JSON.stringify(
      res.map((p) => ({ slug: p.slug, marca: p.brand, nombre: p.name, tipo: p.short, precio: p.price, precio_anterior: p.old ?? null, categorias: p.cats }))
    );
  }
  if (name === "get_product") {
    const p = getProduct(String(input.slug));
    if (!p) return "Producto no encontrado.";
    found.set(p.slug, summary(p));
    return JSON.stringify({
      marca: p.brand,
      nombre: p.name,
      tipo: p.short,
      precio: p.price,
      precio_anterior: p.old ?? null,
      descripcion: p.desc?.slice(0, 2500) ?? null,
      opciones: p.option ? { [p.option.label]: p.option.values.map((v) => `${v.label}: $${v.price}${v.available ? "" : " (agotado)"}`) } : null,
      atributos: p.attrs,
    });
  }
  return "Herramienta desconocida.";
}

async function claudeReply(history: ChatMessage[]) {
  const client = new Anthropic();
  const found = new Map<string, ProductSummary>();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));

  for (let i = 0; i < 5; i++) {
    const res = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      tools: TOOLS,
      messages,
    });
    if (res.stop_reason === "refusal") {
      return { reply: `Lo siento, no puedo ayudarte con eso. Para cualquier consulta escríbenos al WhatsApp ${CONTACT.whatsapp}.`, products: [] };
    }
    messages.push({ role: "assistant", content: res.content });
    const uses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (res.stop_reason !== "tool_use" || uses.length === 0) {
      const text = res.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      const mentioned = [...found.values()].filter((p) => norm(text).includes(norm(p.name).slice(0, 18)));
      return { reply: text, products: (mentioned.length ? mentioned : [...found.values()]).slice(0, 6) };
    }
    messages.push({
      role: "user",
      content: uses.map((u) => ({ type: "tool_result" as const, tool_use_id: u.id, content: runTool(u.name, u.input as Record<string, unknown>, found) })),
    });
  }
  return { reply: "¿Podrías darme un poco más de detalle sobre lo que buscas?", products: [...found.values()].slice(0, 6) };
}

/** Grounded fallback when no API key is configured: answers from FAQ + catalog search. */
function localReply(history: ChatMessage[]) {
  const last = history[history.length - 1]?.content ?? "";
  const t = norm(last);
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  const faq = (needle: string) => FAQ.find((f) => norm(f.q).includes(needle))?.a ?? "";

  if (has("tienda", "sucursal", "direccion", "donde estan", "ubicac", "horario de tienda", "abren", "cierran"))
    return { reply: "Nuestras tiendas:\n" + STORES.map((s) => `• ${s.name} — ${s.address} (${s.hours})`).join("\n"), products: [] };
  if (has("cuota")) return { reply: faq("cuotas"), products: [] };
  if (has("envio", "delivery", "entrega", "llega", "demora")) return { reply: faq("metodos de entrega").split("\n").slice(0, 4).join("\n"), products: [] };
  if (has("pago", "pagar", "tarjeta", "transferencia", "qr")) return { reply: faq("metodos de pago"), products: [] };
  if (has("devoluc", "cambio", "reclamo")) return { reply: faq("plazo y el procedimiento"), products: [] };
  if (has("factura")) return { reply: faq("factura"), products: [] };
  if (has("muestra")) return { reply: faq("muestras"), products: [] };
  if (has("maquillaje profesional", "maquillarme", "servicio", "cabina", "diagnostico"))
    return {
      reply:
        "Ofrecemos servicios de cabina y diagnóstico de piel en nuestras sucursales, y en MAC: Flash Make Up (30 min) y Full Make Up (60 min). El monto que inviertes es reembolsable en productos.",
      products: [],
    };
  if (has("contacto", "whatsapp", "telefono", "humano", "asesor"))
    return { reply: `Escríbenos al WhatsApp ${CONTACT.whatsapp} o a ${CONTACT.email}. Atendemos ${CONTACT.serviceHours}.`, products: [] };
  if (has("hola", "buenas", "buen dia") && t.length < 25)
    return { reply: "¡Hola! Soy el Concierge Cosmet. Puedo recomendarte fragancias, maquillaje o tratamiento, y resolver dudas sobre envíos, pagos y tiendas. ¿Qué buscas hoy?", products: [] };

  const stop = new Set(["quiero", "busco", "un", "una", "para", "de", "el", "la", "los", "las", "me", "recomiendas", "recomienda", "algo", "tienen", "hay", "que", "mi", "regalo", "por", "favor", "con", "y", "o", "en"]);
  const terms = t.split(/[^a-z0-9]+/).filter((w) => w && !stop.has(w));
  const max = Number(t.match(/(?:menos de|hasta|maximo|max)\s*\$?\s*(\d+)/)?.[1]) || undefined;
  const cat = has("hombre", "masculin", "para el") && has("perfum", "fragan", "colonia")
    ? "fragancias-masculinas"
    : has("mujer", "femenin", "ella") && has("perfum", "fragan")
      ? "fragancias-femeninas"
      : has("perfum", "fragan")
        ? "fragancias"
        : has("regalo")
          ? "regalos"
          : undefined;
  const facets: Record<string, string> = {};
  for (const f of FACETS) for (const v of f.values) if (v.slug.length > 3 && t.includes(v.slug.split("-")[0].slice(0, -1))) facets[f.key] ??= v.slug;
  if (has("para el", "hombre", "masculin")) facets.para = "el";
  if (has("para ella", "mujer", "femenin")) facets.para = "ella";
  const q = terms.filter((w) => !/^(perfume|perfumes|fragancia|fragancias|hombre|mujer|menos|hasta|maximo|dolares|usd|\d+)$/.test(w)).join(" ");
  const fq = Object.keys(facets).length ? facets : undefined;
  let res = fq ? search({ cat, max, facets: fq }) : search({ q, cat, max });
  if (!res.length && q) res = search({ q: terms[0], cat, max });
  if (!res.length) res = search({ cat, max });
  const products = res.slice(0, 6).map(summary);
  return {
    reply: products.length
      ? `Te comparto algunas opciones de nuestro catálogo${max ? ` hasta $${max}` : ""}. Si quieres, cuéntame para quién es o qué notas prefieres y afino la selección.`
      : `No encontré coincidencias. ¿Me cuentas un poco más? También puedes escribirnos al WhatsApp ${CONTACT.whatsapp}.`,
    products,
  };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { messages?: ChatMessage[] } | null;
  const history = (body?.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!history.length || history[0].role !== "user") return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });

  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  if (hasKey) {
    try {
      return NextResponse.json({ ...(await claudeReply(history)), mode: "ai" });
    } catch (err) {
      if (err instanceof Anthropic.APIError) console.error("Claude API error", err.status, err.message);
      else console.error(err);
    }
  }
  return NextResponse.json({ ...localReply(history), mode: "local" });
}
