import { test, expect, ready, isDesktop, isMobile } from "./fixtures";

test.describe("header navigation", () => {
  test("desktop mega menu opens on hover and navigates", async ({ page }, info) => {
    test.skip(!isDesktop(info), "mega menu is desktop-only");
    await page.goto("/");
    await ready(page);
    const nav = page.locator("header nav");
    await nav.getByRole("link", { name: "Fragancias", exact: true }).hover();
    const mega = nav.getByRole("link", { name: "Todo Fragancias" });
    await expect(mega).toBeVisible();
    await mega.click();
    await expect(page).toHaveURL(/\/tienda\/fragancias$/);
    await expect(page.getByText(/productos/).first()).toBeVisible();
  });

  test("desktop: Escape closes mega menu", async ({ page }, info) => {
    test.skip(!isDesktop(info), "desktop-only");
    await page.goto("/");
    await ready(page);
    await page.locator("header nav").getByRole("link", { name: "Marcas", exact: true }).hover();
    await expect(page.getByRole("link", { name: "Todas las marcas A–Z" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("link", { name: "Todas las marcas A–Z" })).toBeHidden();
  });

  test("hamburger menu opens, lists sections and navigates", async ({ page }, info) => {
    test.skip(isDesktop(info), "hamburger is for < lg");
    await page.goto("/");
    await ready(page);
    const toggle = page.getByRole("button", { name: "Menú" });
    const menu = page.getByRole("navigation", { name: "Menú principal" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("inert", "");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).not.toHaveAttribute("inert");
    for (const label of ["Fragancias", "Maquillaje", "Marcas", "Ofertas", "Tiendas", "Favoritos", "Ayuda"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await menu.getByRole("link", { name: "Nosotros", exact: true }).click();
    await expect(page).toHaveURL(/\/nosotros$/);
    // menu closes after navigation
    await expect(menu).toHaveAttribute("inert", "");
    await expect(menu).toHaveCSS("opacity", "0");
  });

  test("logo returns home", async ({ page }) => {
    await page.goto("/tiendas");
    await ready(page);
    await page.getByRole("link", { name: "Cosmet inicio" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("footer links work", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const footer = page.locator("footer");
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test("header hides on scroll down and returns on scroll up", async ({ page }) => {
    await page.goto("/tienda");
    await ready(page);
    const header = page.locator("header").first();
    await page.mouse.move(10, 600);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect.poll(() => header.evaluate((h) => h.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect.poll(() => header.evaluate((h) => h.getBoundingClientRect().top)).toBeGreaterThanOrEqual(-1);
  });
});

test.describe("search", () => {
  test("instant results and navigation to product", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Buscar productos" });
    const input = dialog.getByPlaceholder("Buscar en Cosmet");
    await expect(input).toBeFocused();
    await input.fill("sauvage");
    const first = dialog.locator('a[href^="/producto/"]').first();
    await expect(first).toBeVisible();
    await expect(first).toContainText(/sauvage/i);
    await first.click();
    await expect(page).toHaveURL(/\/producto\//);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/sauvage/i);
  });

  test("popular search chip fills the query", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Buscar productos" });
    await dialog.getByRole("button", { name: "Aventus" }).click();
    await expect(dialog.getByPlaceholder("Buscar en Cosmet")).toHaveValue("Aventus");
    await expect(dialog.locator('a[href^="/producto/"]').first()).toBeVisible();
  });

  test("submitting search opens results page", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    const input = page.getByPlaceholder("Buscar en Cosmet");
    await input.fill("chanel");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/tienda\?q=chanel/);
    await expect(page.getByText(/productos para “chanel”/)).toBeVisible();
    await expect(page.locator('main a[href^="/producto/"]').first()).toBeVisible();
  });

  test("keyboard shortcut and close", async ({ page }, info) => {
    test.skip(isMobile(info), "no keyboard shortcuts on phones");
    await page.goto("/");
    await ready(page);
    await page.keyboard.press("Control+k");
    const input = page.getByPlaceholder("Buscar en Cosmet");
    await expect(input).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Buscar productos" })).toHaveCSS("opacity", "0");
  });

  test("search API returns real products", async ({ request }) => {
    const res = await request.get("/api/search?q=dior&limit=5");
    expect(res.ok()).toBeTruthy();
    const { items } = await res.json();
    expect(items.length).toBe(5);
    for (const p of items) {
      expect(p.slug).toBeTruthy();
      expect(p.price).toBeGreaterThan(0);
    }
  });
});
