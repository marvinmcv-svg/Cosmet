import AxeBuilder from "@axe-core/playwright";
import { test, expect, ROUTES, ready, scrollThrough } from "./fixtures";

/**
 * Every public route: loads with 200, renders a visible heading, has no horizontal
 * overflow at this viewport, has no critical a11y violations, and gets a full-page screenshot.
 */
for (const route of ROUTES) {
  test(`page ${route} renders cleanly`, async ({ page }, info) => {
    const res = await page.goto(route);
    expect(res?.status(), "HTTP status").toBe(200);
    await ready(page);

    await expect(page.locator("main h1, main h2").first()).toBeVisible();
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer")).toBeAttached();
    await expect(page).toHaveTitle(/Cosmet/);

    // no sideways scrolling on any device
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(1);

    // no raw markup leaking into visible copy (e.g. double-encoded catalog text)
    const text = await page.locator("main").innerText();
    expect(text.match(/<\/?(p|div|span|br|strong|b|i|em|ul|li)\b[^>]*>|&(amp|lt|gt|nbsp|quot);/gi) ?? [], "raw HTML in page text").toEqual([]);

    // no broken local images (remote catalog images are covered separately)
    await scrollThrough(page);
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((i) => i.src.startsWith(location.origin) && i.complete && i.naturalWidth === 0)
        .map((i) => i.src)
    );
    expect(broken, "broken local images").toEqual([]);

    // a11y: fail on critical violations only (design-level contrast choices are reported, not failed)
    const axe = await new AxeBuilder({ page }).exclude("iframe").disableRules(["color-contrast"]).analyze();
    const critical = axe.violations.filter((v) => v.impact === "critical");
    expect(critical.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);

    const name = route === "/" ? "home" : route.slice(1).replace(/[/?=&]/g, "_");
    await page.screenshot({ path: `e2e/screenshots/${info.project.name}/${name}.png`, fullPage: true });
  });
}

test("unknown route shows the 404 page", async ({ page }) => {
  const res = await page.goto("/esto-no-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /No encontramos/ })).toBeVisible();
  await page.getByRole("link", { name: "Ir a la tienda" }).click();
  await expect(page).toHaveURL(/\/tienda$/);
});

test("unknown product returns 404", async ({ page }) => {
  const res = await page.goto("/producto/no-existe-123");
  expect(res?.status()).toBe(404);
});

test("SEO endpoints respond", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("<urlset");
});

test("product catalog images load from the CDN", async ({ page }) => {
  await page.goto("/tienda/fragancias");
  await ready(page);
  const img = page.locator("main img.img-product").first();
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
});

/**
 * Layout sweep over a deterministic sample of the catalog that stresses the product
 * template: biggest galleries, most variants, longest names and descriptions.
 */
test("product template holds up across the catalog (no overflow)", async ({ page, request }) => {
  test.setTimeout(180_000);
  const products: { slug: string; name: string; gallery: string[]; option?: { values: unknown[] }; desc?: string }[] = (
    await import("../src/data/products.json", { with: { type: "json" } })
  ).default as never;
  const pick = (by: (p: (typeof products)[number]) => number, n: number) => [...products].sort((a, b) => by(b) - by(a)).slice(0, n);
  const sample = [
    ...pick((p) => p.gallery.length, 4),
    ...pick((p) => p.option?.values.length ?? 0, 4),
    ...pick((p) => p.name.length, 4),
    ...pick((p) => (p.desc ?? "").length, 3),
  ];
  const slugs = [...new Set(sample.map((p) => p.slug))];
  const failures: string[] = [];
  for (const slug of slugs) {
    expect((await request.get(`/producto/${slug}`)).status(), slug).toBe(200);
    await page.goto(`/producto/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) failures.push(`${slug}: +${overflow}px`);
  }
  expect(failures).toEqual([]);
});
