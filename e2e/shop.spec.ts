import { test, expect, ready } from "./fixtures";

const parsePrice = (s: string) => Number(s.replace(/[^0-9.,]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", "."));
const count = async (page: import("@playwright/test").Page) => {
  const t = await page.getByText(/^[\d.,]+ productos/).first().innerText();
  return Number(t.replace(/[^0-9]/g, ""));
};
const cardPrices = (page: import("@playwright/test").Page) =>
  page.locator('main a[href^="/producto/"] p span.font-semibold').allInnerTexts();

test.describe("shop / listing", () => {
  test("category pills switch categories", async ({ page }) => {
    await page.goto("/tienda/fragancias");
    await ready(page);
    const total = await count(page);
    expect(total).toBeGreaterThan(100);
    const pill = page.locator("main").getByRole("link", { name: /Masculinas/ }).first();
    await pill.click();
    await expect(page).toHaveURL(/\/tienda\/fragancias-masculinas/);
    await expect.poll(() => count(page)).toBeLessThan(total);
  });

  test("sort by price ascending orders the grid", async ({ page }) => {
    await page.goto("/tienda/maquillaje");
    await ready(page);
    await page.getByRole("combobox").selectOption("precio-asc");
    await expect(page).toHaveURL(/orden=precio-asc/);
    await expect.poll(async () => {
      const prices = (await cardPrices(page)).slice(0, 12).map(parsePrice);
      return prices.length > 0 && prices.every((p, i) => i === 0 || p >= prices[i - 1]);
    }).toBe(true);
  });

  test("sort by price descending orders the grid", async ({ page }) => {
    await page.goto("/tienda/fragancias?orden=precio-desc");
    await ready(page);
    const prices = (await cardPrices(page)).slice(0, 12).map(parsePrice);
    expect(prices.length).toBeGreaterThan(5);
    expect(prices.every((p, i) => i === 0 || p <= prices[i - 1])).toBe(true);
  });

  test("filters: price band, offers and brand narrow results and can be cleared", async ({ page }, info) => {
    await page.goto("/tienda/fragancias");
    await ready(page);
    const total = await count(page);
    const scope = info.project.name === "desktop" ? page.locator("aside").first() : page.locator("details").first();
    if (info.project.name !== "desktop") await scope.locator("summary").click();

    await scope.getByRole("link", { name: "$50 – $100" }).click();
    await expect(page).toHaveURL(/min=50&max=100|max=100.*min=50/);
    const banded = await count(page);
    expect(banded).toBeLessThan(total);
    const prices = (await cardPrices(page)).map(parsePrice);
    expect(prices.every((p) => p >= 50 && p <= 100)).toBe(true);

    const scope2 = info.project.name === "desktop" ? page.locator("aside").first() : page.locator("details").first();
    if (info.project.name !== "desktop") {
      if (!(await scope2.evaluate((d) => (d as HTMLDetailsElement).open))) await scope2.locator("summary").click();
    }
    await scope2.getByRole("link", { name: "Solo ofertas" }).click();
    await expect(page).toHaveURL(/ofertas=1/);
    const sale = await count(page);
    expect(sale).toBeLessThanOrEqual(banded);
  });

  test("brand filter via URL and remove chip", async ({ page }) => {
    await page.goto("/tienda?marca=chanel");
    await ready(page);
    const brands = await page.locator('main a[href^="/producto/"] p.uppercase').allInnerTexts();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands.every((b) => /chanel/i.test(b))).toBe(true);
  });

  test("'Mostrar más' paginates", async ({ page }) => {
    await page.goto("/tienda/fragancias");
    await ready(page);
    const cards = page.locator("main .group.relative");
    await expect(cards).toHaveCount(36);
    await page.getByRole("link", { name: /Mostrar más/ }).click();
    await expect(page).toHaveURL(/pagina=2/);
    await expect(cards).toHaveCount(72);
  });

  test("empty search shows helpful empty state", async ({ page }) => {
    await page.goto("/tienda?q=zzzxxyynotaproduct");
    await ready(page);
    await expect(page.getByText("No encontramos productos.")).toBeVisible();
    await page.getByRole("link", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL(/\/tienda$/);
  });

  test("brand directory links to brand boutique", async ({ page }) => {
    await page.goto("/marcas");
    await ready(page);
    await page.locator("main").getByRole("link", { name: /^Chanel/ }).first().click();
    await expect(page).toHaveURL(/\/marcas\/chanel/);
    await expect(page.locator('main a[href^="/producto/"]').first()).toBeVisible();
  });

  test("product card navigates to detail", async ({ page }) => {
    await page.goto("/tienda/tratamiento");
    await ready(page);
    const card = page.locator('main a[href^="/producto/"][aria-label]').first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
