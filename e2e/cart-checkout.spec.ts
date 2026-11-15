import { test, expect, ready, cartDrawer, seedCart, SAMPLE_LINE, PRODUCT_SIMPLE } from "./fixtures";

test.describe("cart", () => {
  test("add from listing card, adjust quantity, remove", async ({ page }) => {
    await page.goto("/tienda/maquillaje");
    await ready(page);
    const addBtn = page.locator("main").getByRole("button", { name: /^Añadir .* a la bolsa$/ }).first();
    await addBtn.scrollIntoViewIfNeeded();
    await page.locator("main .group.relative").first().hover().catch(() => {});
    await addBtn.click();

    const drawer = cartDrawer(page);
    await expect(drawer.getByRole("heading", { name: "Tu bolsa" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bolsa de compras" })).toContainText("1");

    const qty = drawer.locator("li span.w-5");
    await drawer.getByRole("button", { name: "Sumar" }).click();
    await expect(qty).toHaveText("2");
    await expect(page.getByRole("button", { name: "Bolsa de compras" })).toContainText("2");
    await drawer.getByRole("button", { name: "Restar" }).click();
    await expect(qty).toHaveText("1");
    await drawer.getByRole("button", { name: "Eliminar" }).click();
    await expect(drawer.getByText("Tu bolsa está vacía.")).toBeVisible();

    await drawer.getByRole("button", { name: "Cerrar" }).click();
    await expect(drawer.locator("aside")).toBeHidden();
  });

  test("drawer closes on backdrop click and opens from header", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Bolsa de compras" }).click();
    const drawer = cartDrawer(page);
    await expect(drawer.getByText("Tu bolsa está vacía.")).toBeVisible();
    await page.mouse.click(10, 300);
    await expect(drawer.locator("aside")).toBeHidden();
  });

  test("cart persists across reloads and the cart page edits it", async ({ page }) => {
    await seedCart(page, [SAMPLE_LINE]);
    await page.goto("/carrito");
    await ready(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tu bolsa:");
    await expect(page.getByText(/Agrega .* más para obtener envío gratis/)).toBeVisible();

    await page.locator("main select").selectOption("3");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("60");
    await expect(page.getByText("Envío gratis a ciudades capitales.")).toBeVisible();

    await page.reload();
    await ready(page);
    await expect(page.locator("main select")).toHaveValue("3");

    await page.locator("main").getByRole("button", { name: "Eliminar" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tu bolsa está vacía.");
  });
});

test.describe("checkout", () => {
  test("empty bag shows empty state", async ({ page }) => {
    await page.goto("/checkout");
    await ready(page);
    await expect(page.getByRole("heading", { name: "Tu bolsa está vacía." })).toBeVisible();
  });

  test("validation blocks incomplete orders", async ({ page }) => {
    await seedCart(page, [SAMPLE_LINE]);
    await page.goto("/checkout");
    await ready(page);
    let opened = false;
    await page.exposeFunction("__opened", () => (opened = true));
    await page.evaluate(() => (window.open = () => ((window as unknown as { __opened: () => void }).__opened(), null)));
    await page.getByRole("button", { name: "Confirmar pedido por WhatsApp" }).click();
    const invalid = await page.locator("form :invalid").count();
    expect(invalid).toBeGreaterThan(0);
    expect(opened).toBe(false);
    await expect(page.getByRole("heading", { name: "Finalizar compra" })).toBeVisible();
  });

  test("home delivery order goes to WhatsApp with full detail", async ({ page }) => {
    await seedCart(page, [{ ...SAMPLE_LINE, qty: 2 }, { ...SAMPLE_LINE, slug: "otro", name: "Otro producto", brand: "Chanel", price: 15.5, variant: "Tono: Rouge", qty: 1 }]);
    await page.goto("/checkout");
    await ready(page);
    await page.evaluate(() => {
      (window as unknown as { __wa: string[] }).__wa = [];
      window.open = (u?: string | URL) => ((window as unknown as { __wa: string[] }).__wa.push(String(u)), null);
    });

    const aside = page.locator("aside").filter({ hasText: "Resumen" });
    await expect(aside.getByText("$55.50").or(aside.getByText("$55,50")).first()).toBeVisible();
    await expect(aside.getByText("Gratis", { exact: true })).toBeVisible();

    await page.getByPlaceholder("Nombre completo").fill("Ana Pérez");
    await page.getByPlaceholder("Celular").fill("70000000");
    await page.getByPlaceholder("Correo electrónico", { exact: true }).fill("ana@example.com");
    await page.locator("form select").first().selectOption("La Paz");
    await page.getByPlaceholder(/Dirección exacta/).fill("Av. Arce 123, Sopocachi");
    await page.locator("form select").nth(1).selectOption({ index: 3 });
    await page.getByPlaceholder("Razón social (factura)").fill("Ana Pérez");
    await page.getByPlaceholder("NIT / CI").fill("1234567");
    await page.getByPlaceholder(/Notas/).fill("Tocar timbre");
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: "Confirmar pedido por WhatsApp" }).click();

    await expect(page.getByRole("heading", { name: /Gracias por/ })).toBeVisible();
    const urls = await page.evaluate(() => (window as unknown as { __wa: string[] }).__wa);
    expect(urls).toHaveLength(1);
    const msg = decodeURIComponent(new URL(urls[0]).searchParams.get("text")!);
    expect(urls[0]).toMatch(/^https:\/\/wa\.me\/\d+/);
    expect(msg).toContain("Nuevo pedido web");
    expect(msg).toContain("2 × Dior Coffret Miss Dior Edition Limite");
    expect(msg).toContain("(Tono: Rouge)");
    expect(msg).toContain("Ana Pérez");
    expect(msg).toContain("Av. Arce 123, Sopocachi, La Paz");
    expect(msg).toContain("NIT 1234567");
    expect(msg).toContain("Pago en cuotas");
    expect(msg).toContain("Tocar timbre");

    // bag is cleared after ordering
    await expect(page.getByRole("button", { name: "Bolsa de compras" })).not.toContainText(/\d/);
    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("store pickup switches fields and shipping note", async ({ page }) => {
    await seedCart(page, [SAMPLE_LINE]);
    await page.goto("/checkout");
    await ready(page);
    await page.evaluate(() => {
      (window as unknown as { __wa: string[] }).__wa = [];
      window.open = (u?: string | URL) => ((window as unknown as { __wa: string[] }).__wa.push(String(u)), null);
    });
    const aside = page.locator("aside").filter({ hasText: "Resumen" });
    await expect(aside.getByText(/Bs\. 15/)).toBeVisible(); // Santa Cruz, under free-shipping threshold

    await page.getByText("Retiro en tienda", { exact: true }).click();
    await expect(page.getByPlaceholder(/Dirección exacta/)).toHaveCount(0);
    await expect(aside.getByText("Gratis (retiro en tienda)")).toBeVisible();

    await page.getByPlaceholder("Nombre completo").fill("Luis");
    await page.getByPlaceholder("Celular").fill("71111111");
    await page.getByPlaceholder("Correo electrónico", { exact: true }).fill("luis@example.com");
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole("button", { name: "Confirmar pedido por WhatsApp" }).click();
    await expect(page.getByRole("heading", { name: /Gracias por/ })).toBeVisible();
    const msg = decodeURIComponent(new URL((await page.evaluate(() => (window as unknown as { __wa: string[] }).__wa))[0]).searchParams.get("text")!);
    expect(msg).toContain("*Retiro en:*");
  });

  test("full journey: search → product → bag → checkout", async ({ page }) => {
    await page.goto(`/producto/${PRODUCT_SIMPLE}`);
    await ready(page);
    await page.locator("main").getByRole("button", { name: "Añadir a la bolsa" }).first().click();
    const drawer = cartDrawer(page);
    await drawer.getByRole("link", { name: "Finalizar compra" }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole("heading", { name: "Finalizar compra" })).toBeVisible();
    await expect(page.locator("aside").filter({ hasText: "Resumen" }).getByText(/Miss Dior/i)).toBeVisible();
  });
});
