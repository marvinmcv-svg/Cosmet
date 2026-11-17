import { BRAND } from "@/data/catalog";
import type { CartLine } from "./cart";
import { bs } from "./format";

export const waLink = (text: string) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

export type OrderInfo = {
  name: string;
  mode: "delivery" | "pickup";
  address?: string;
  date?: string;
  notes?: string;
};

export function orderMessage(lines: CartLine[], info: OrderInfo) {
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const rows = lines.map((l) => {
    const head = `• ${l.qty} × ${l.name} — ${bs(l.qty * l.price)}`;
    return l.detail ? `${head}\n   ${l.detail}` : head;
  });
  return [
    `¡Hola IriCookies! 🍪🩷 Quiero hacer un pedido:`,
    ``,
    ...rows,
    ``,
    `Total estimado: ${bs(total)}`,
    ``,
    `Nombre: ${info.name}`,
    `Entrega: ${info.mode === "delivery" ? "Delivery" : "Pickup"}`,
    info.mode === "delivery" && info.address ? `Dirección: ${info.address}` : null,
    info.date ? `Fecha deseada: ${info.date}` : null,
    info.notes ? `Notas: ${info.notes}` : null,
  ]
    .filter((x) => x !== null)
    .join("\n");
}
