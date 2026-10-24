import { test, expect, BASE_URL } from "../support/fixtures";
import type { Frame, Page } from "@playwright/test";

/**
 * QA s22 (docs/qa/qa-widget-s22-v1.md) : widget « La vanne du jour » chez un hôte.
 * Lecture seule. La page hôte est simulée (route.fulfill) sur l'origine testée ;
 * /widget.js et /embed/vanne-du-jour sont les vrais (repli neutre tant que
 * l'interrupteur est fermé ou la liste vide : la mécanique est la même).
 * Vérifie : iframe créée à la place du script, attributs (title, sandbox,
 * hauteur réservée), en-têtes réellement servis (encadrable, noindex, sans
 * cookie), script en ligne autorisé par la CSP, lien de marque, plusieurs
 * widgets, message de hauteur usurpé ignoré, hôte à CSP stricte.
 */
const HOTE = "/__qa-hote-widget-s22";

async function hote(page: Page, corps: string, csp?: string) {
  await page.route(`${BASE_URL}${HOTE}*`, (route) =>
    route.fulfill({
      contentType: "text/html; charset=utf-8",
      headers: csp ? { "Content-Security-Policy": csp } : {},
      body: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Hôte</title></head><body><h1>Blog hôte</h1>${corps}<p id="apres">Après</p></body></html>`,
    }),
  );
}

async function cadre(page: Page, i = 0): Promise<Frame> {
  const el = page.locator("iframe").nth(i);
  await expect(el).toBeAttached();
  const f = await (await el.elementHandle())!.contentFrame();
  expect(f, "iframe sans document").toBeTruthy();
  await f!.waitForLoadState("domcontentloaded");
  return f!;
}

test("le script crée l'iframe à sa place, encadrable, noindex, sans cookie", async ({ page, context }) => {
  await hote(page, '<script async src="/widget.js"></script>');
  const embed = page.waitForResponse((r) => r.url().includes("/embed/vanne-du-jour"));
  await page.goto(HOTE);
  const res = await embed;
  const h = res.headers();
  expect(h["x-frame-options"]).toBeUndefined();
  expect(h["content-security-policy"]).toMatch(/frame-ancestors \*/);
  expect(h["content-security-policy"]).toMatch(/default-src 'none'/);
  expect(h["x-robots-tag"]).toBe("noindex");
  expect(h["set-cookie"]).toBeUndefined();

  const iframe = page.locator("iframe");
  await expect(iframe).toHaveAttribute("title", "La vanne du jour, Deviens Marrant");
  await expect(iframe).toHaveAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  await expect(iframe).toHaveAttribute("height", "504");
  expect(await iframe.evaluate((n) => n.previousElementSibling?.tagName)).toBe("H1");

  const f = await cadre(page);
  // Le script en ligne a tourné sous la CSP réelle (empreinte juste).
  await expect.poll(() => f.evaluate(() => document.documentElement.classList.contains("js"))).toBe(true);
  const marque = f.getByRole("link", { name: /^Deviens Marrant/ });
  await expect(marque).toBeVisible();
  await expect(marque).toHaveAttribute("rel", "noopener");
  await expect(marque).toHaveAttribute("target", "_blank");
  const url = new URL((await marque.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://deviens-marrant.fr/");
  expect(Object.fromEntries(url.searchParams)).toMatchObject({ utm_source: "widget", utm_medium: "embed", utm_campaign: "vanne-du-jour" });
  expect(url.searchParams.get("utm_content")).toBe(new URL(BASE_URL).hostname.replace(/^www\./, ""));
  expect(await context.cookies()).toEqual([]);
});

test("trois widgets indépendants ; un message de hauteur usurpé est ignoré", async ({ page }) => {
  await hote(page, ["a", "b", "c"].map((id) => `<div id="${id}"><script async src="/widget.js"></script></div>`).join(""));
  await page.goto(HOTE);
  await expect(page.locator("iframe")).toHaveCount(3);
  expect(await page.locator("iframe").evaluateAll((l) => l.map((n) => n.parentElement?.id))).toEqual(["a", "b", "c"]);
  await cadre(page, 2);
  await page.evaluate(() => window.postMessage({ type: "dm-vanne-hauteur", h: 800 }, "*"));
  await page.waitForTimeout(300);
  for (const h of await page.locator("iframe").evaluateAll((l) => l.map((n) => (n as HTMLElement).offsetHeight))) expect(h).toBe(504);
});

test("hôte à CSP stricte (style-src 'self') : widget rendu sans violation", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => /Content Security Policy/i.test(m.text()) && violations.push(m.text()));
  const o = new URL(BASE_URL).origin;
  await hote(page, '<script async src="/widget.js"></script>', `default-src 'none'; script-src ${o}; frame-src ${o}; style-src 'self'`);
  await page.goto(HOTE);
  const f = await cadre(page);
  await expect(f.getByRole("link", { name: /^Deviens Marrant/ })).toBeVisible();
  expect(await page.locator("iframe").evaluate((n) => [(n as HTMLElement).offsetHeight, getComputedStyle(n).borderTopWidth])).toEqual([504, "0px"]);
  expect(violations).toEqual([]);
});
