import { test as base, expect, type Page, type TestInfo } from "@playwright/test";

/** Known-good catalog entries used across specs. */
export const PRODUCT_SIMPLE = "coffret-miss-dior-edition-limite-e100000099"; // $186, no variants
export const PRODUCT_VARIANTS = "iris-debonair-c388c55"; // Tamaño: 50 ml $367 / 100 ml $492

export const ROUTES = [
  "/",
  "/tienda",
  "/tienda/fragancias",
  "/tienda/maquillaje",
  "/tienda/tratamiento",
  "/marcas",
  "/marcas/chanel",
  `/producto/${PRODUCT_SIMPLE}`,
  `/producto/${PRODUCT_VARIANTS}`,
  "/carrito",
  "/checkout",
  "/favoritos",
  "/nosotros",
  "/servicios",
  "/tiendas",
  "/ayuda",
  "/trending",
  "/terminos-y-condiciones",
  "/politicas-de-privacidad",
  "/trabaja-con-nosotros",
];

export const isMobile = (info: TestInfo) => info.project.name.startsWith("mobile");
export const isDesktop = (info: TestInfo) => info.project.name === "desktop";

// Noise that is not caused by the app (third-party/remote image hiccups etc.).
const IGNORED = [/Failed to load resource/i, /net::ERR_/i, /favicon/i, /Download the React DevTools/i];

type Fixtures = { errors: string[] };

/**
 * Every test fails if the page throws an uncaught exception or logs a console error.
 */
export const test = base.extend<Fixtures>({
  errors: [
    async ({ page, baseURL }, use) => {
      const errors: string[] = [];
      const origin = new URL(baseURL!).origin;
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() !== "error" || IGNORED.some((r) => r.test(m.text()))) return;
        // only our own code: third-party embeds (e.g. Instagram iframes) log their own CSP noise
        const src = m.location().url;
        if (src && !src.startsWith(origin)) return;
        errors.push(`console: ${m.text()} (${src})`);
      });
      await use(errors);
      expect(errors, "page errors / console errors").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

/** Wait for hydration: client components mount and attach handlers. */
export async function ready(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(() => document.readyState === "complete");
  await page.waitForTimeout(300);
}

/** Scroll through the page so scroll-triggered reveals run, then return to top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/** The cart drawer dialog (rendered after mount). */
export const cartDrawer = (page: Page) => page.getByRole("dialog", { name: "Bolsa de compras" });

/** Seed the persisted cart (zustand/persist) before the app boots. */
export async function seedCart(page: Page, lines: { slug: string; name: string; brand: string; img: string; price: number; variant?: string; qty: number }[]) {
  await page.addInitScript((l) => {
    if (!sessionStorage.getItem("__seeded")) {
      localStorage.setItem(
        "cosmet-cart",
        JSON.stringify({ state: { lines: l.map((x) => ({ ...x, key: `${x.slug}::${x.variant ?? ""}` })) }, version: 0 })
      );
      sessionStorage.setItem("__seeded", "1");
    }
  }, lines);
}

export const SAMPLE_LINE = {
  slug: PRODUCT_SIMPLE,
  name: "Coffret Miss Dior Edition Limite",
  brand: "Dior",
  img: "/media/cosmet-logo.png",
  price: 20,
  qty: 1,
};
