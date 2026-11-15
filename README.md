# Cosmet — tienda online

Rediseño de [cosmet.com.bo](https://www.cosmet.com.bo) como sitio + e‑commerce, con la UX/estética de Apple (negro y blanco), animaciones GSAP ScrollTrigger + Lenis, tarjetas 3D y un concierge de belleza con IA.

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- GSAP + ScrollTrigger, Lenis (smooth scroll)
- Zustand (bolsa de compras persistente)
- Anthropic SDK — Concierge Cosmet (Claude Opus 5.5 con herramientas de búsqueda en el catálogo)

## Contenido (100 % real, nada generado)
- `src/data/products.json` — 2.907 productos extraídos de cosmet.com.bo: nombre, marca, precio, descuentos, descripción oficial, tamaños/tonos con precios, galería de imágenes y categorías.
- `src/data/faq.json` — preguntas frecuentes de /ayuda (envíos, pagos, cuotas, devoluciones…).
- `src/lib/info.ts` — historia (/sobre-nosotros), tiendas y horarios (/store-locator), servicios de belleza y publicaciones recientes de @cosmet_oficial.
- `public/media` — banners de campaña y logos de marcas publicados en cosmet.com.bo.

Actualizar el catálogo:
```bash
python3 scripts/catalog/listings.py /tmp/raw/listings2.json
python3 scripts/catalog/details.py /tmp/raw/listings2.json /tmp/raw/details.json
python3 scripts/catalog/build_data.py /tmp/raw src/data   # requiere también home.html y pages/ayuda.txt en /tmp/raw
```

## Variables de entorno
| Variable | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Activa el Concierge con Claude. Sin ella, el chat responde con el FAQ oficial y búsqueda en el catálogo. |
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, metadatos). |

## Checkout
Los pedidos se envían al WhatsApp oficial de Cosmet (+591 650 67663) con el detalle completo (productos, entrega, pago, NIT). Para cobrar en línea, conectar aquí la pasarela PayMe/Khipu que usa la tienda actual.

## Desarrollo
```bash
npm install
npm run dev
```
