import { test, expect, ready, cartDrawer, PRODUCT_SIMPLE, PRODUCT_VARIANTS } from "./fixtures";

test.describe("product detail", () => {
  test("variant selection updates price and adds the right line", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_VARIANTS}`);
    await ready(page);
    const main = page.locator("main");
    await expect(main.getByText("$367").first()).toBeVisible();
    await main.getByRole("button", { name: /100 ml/ }).click();
    await expect(main.locator("p.text-2xl span.font-semibold")).toHaveText(/492/);

    await main.getByRole("button", { name: "Sumar" }).click();
    await main.getByRole("button", { name: "Añadir a la bolsa" }).first().click();

    const drawer = cartDrawer(page);
    await expect(drawer.getByRole("heading", { name: "Tu bolsa" })).toBeVisible();
    await expect(drawer.getByText("Tamaño: 100 ml")).toBeVisible();
    await expect(drawer.locator("li span.w-5")).toHaveText("2");
    await expect(drawer.getByText(/984/).first()).toBeVisible();
    await expect(drawer.getByText(/envío gratis/i)).toBeVisible();
  });

  test("gallery thumbnails switch the main image", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_SIMPLE}`);
    await ready(page);
    const thumbs = page.getByRole("button", { name: /^Imagen \d+$/ });
    test.skip((await thumbs.count()) < 2, "single image product");
    const stage = page.locator(".pd-stage img");
    const before = await stage.getAttribute("src");
    await thumbs.nth(1).click();
    await expect(stage).not.toHaveAttribute("src", before!);
  });

  test("WhatsApp enquiry link is prefilled", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_SIMPLE}`);
    await ready(page);
    const wa = page.getByRole("link", { name: "Consultar por WhatsApp" });
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
    await expect(wa).toHaveAttribute("target", "_blank");
  });

  test("description and details accordions toggle", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_VARIANTS}`);
    await ready(page);
    const details = page.locator("details", { hasText: "Detalles" });
    test.skip((await details.count()) === 0, "no attributes");
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    await expect(details.locator("dl")).toBeVisible();
  });

  test("sticky buy bar appears after scrolling past the buy button", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_VARIANTS}`);
    await ready(page);
    const bar = page.locator("div.glass.fixed").filter({ has: page.getByRole("button", { name: "Añadir a la bolsa" }) });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => bar.evaluate((b) => b.getBoundingClientRect().top)).toBeGreaterThanOrEqual(-1);
    await bar.getByRole("button", { name: "Añadir a la bolsa" }).click();
    await expect(cartDrawer(page).getByRole("heading", { name: "Tu bolsa" })).toBeVisible();
  });

  test("favourite toggles and appears in /favoritos", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_SIMPLE}`);
    await ready(page);
    const heart = page.locator("main").getByRole("button", { name: "Añadir a favoritos" }).first();
    await heart.click();
    await expect(page.locator("main").getByRole("button", { name: "Quitar de favoritos" }).first()).toHaveAttribute("aria-pressed", "true");
    await page.goto("/favoritos");
    await ready(page);
    await expect(page.locator(`main a[href="/producto/${PRODUCT_SIMPLE}"]`).first()).toBeVisible();
    // remove from favourites page
    await page.locator("main").getByRole("button", { name: "Quitar de favoritos" }).first().click();
    await expect(page.getByText("Guarda los productos que te encantan")).toBeVisible();
  });
});
