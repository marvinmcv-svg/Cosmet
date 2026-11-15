import { test, expect, ready, cartDrawer } from "./fixtures";

test.describe("Concierge chat", () => {
  test("opens, answers a FAQ and closes", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Abrir Concierge Cosmet" }).click();
    const chat = page.getByRole("region", { name: "Concierge Cosmet" });
    await expect(chat).toHaveCSS("opacity", "1");
    await chat.getByRole("button", { name: "¿Cuánto cuesta el envío?" }).click();
    await expect(chat.locator(".rounded-tr-md")).toHaveText("¿Cuánto cuesta el envío?");
    const replies = chat.locator(".rounded-tl-md.bg-white");
    await expect(replies).toHaveCount(2, { timeout: 30_000 });
    await expect(replies.last()).not.toBeEmpty();
    await chat.getByRole("button", { name: "Cerrar chat" }).click();
    await expect(chat).toHaveCSS("opacity", "0");
  });

  test("product recommendations can be added to the bag", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await page.getByRole("button", { name: "Abrir Concierge Cosmet" }).click();
    const chat = page.getByRole("region", { name: "Concierge Cosmet" });
    await chat.getByPlaceholder("Escribe tu pregunta…").fill("perfume Dior para hombre");
    await chat.getByRole("button", { name: "Enviar" }).click();
    const addBtn = chat.getByRole("button", { name: "Añadir" }).first();
    await expect(addBtn).toBeVisible({ timeout: 30_000 });
    await addBtn.click();
    await expect(cartDrawer(page).getByRole("heading", { name: "Tu bolsa" })).toBeVisible();
  });

  test("chat API validates input", async ({ request }) => {
    const bad = await request.post("/api/chat", { data: { messages: [] } });
    expect(bad.status()).toBe(400);
    const ok = await request.post("/api/chat", { data: { messages: [{ role: "user", content: "¿Dónde están sus tiendas?" }] } });
    expect(ok.ok()).toBeTruthy();
    const body = await ok.json();
    expect(typeof body.reply).toBe("string");
    expect(body.reply.length).toBeGreaterThan(10);
  });
});

test("newsletter subscription", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  const input = page.getByPlaceholder("Tu correo electrónico");
  await input.scrollIntoViewIfNeeded();
  await input.fill("hola@example.com");
  await page.getByRole("button", { name: "Suscribirse" }).click();
  await expect(page.getByText("¡Gracias! Pronto recibirás nuestras novedades.")).toBeVisible();
});
