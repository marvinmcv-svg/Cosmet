# IriCookies — good fillings

Online store for **IriCookies** (@iri_cookies), homemade cookies in Santa Cruz, Bolivia.
Premium pink + black design. Orders are sent to WhatsApp (+591 690 78820).

## Pages
- `/` — hero, The favorites, Premium flavours, Build your box, Fit, Bake your own + Cookie Pie, "Así nace tu antojo", event cart rental, Octubre Rosa edition, FAQ
- `/menu` — the full menu with prices
- `/arma-tu-caja` — interactive box builder (6 = 87 Bs, 12 = 168 Bs, +5 Bs per premium cookie)
- `/eventos` — cart rental request form (opens WhatsApp with the message ready to send)

## Content
All flavours, prices and copy come from the October menu (Google Drive) and the Instagram bio.
- **Change prices or flavours:** `src/data/catalog.ts` (the whole site reads from it).
- **Photos:** `public/img/`, cut from the menu pages. Swap in higher-resolution product photos with the same file names when you have them.

## Stack
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Zustand (bag saved in the browser).

## Development
```bash
cd iricookies
npm install
npm run dev
```

## Deploy (Vercel)
Create a project from this repo and set **Root Directory = `iricookies`**. Optional: `NEXT_PUBLIC_SITE_URL` for the sitemap and metadata.
