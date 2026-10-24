import { test, expect, BASE_URL } from "../support/fixtures";
import type { Frame, Page } from "@playwright/test";
import { widgetIframeSnippet, widgetScriptSnippet } from "@/config/widget-vanne-du-jour";

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
// Itération 3 : hauteur selon la largeur, clamp(340px, 340px + (672px - 100vw) * .6, 560px).
// Projet « local » à 1 280 px de large : 340 px ; attribut `height` de repli : 420.
const HAUTEUR_1280 = 340;

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
  await expect(iframe).toHaveAttribute("height", "420");
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
  for (const h of await page.locator("iframe").evaluateAll((l) => l.map((n) => (n as HTMLElement).offsetHeight))) expect(h).toBe(HAUTEUR_1280);
});

// s22 (24/10, décision Thomas) : ligne de backlink en HTML normal APRÈS le cadre,
// collée telle que la page du programme la donne (gabarits du dépôt, origine testée).
for (const [nom, gabarit, cadreTag] of [
  ["iframe seule", widgetIframeSnippet, "IFRAME"],
  ["script", widgetScriptSnippet, "DIV"],
] as const) {
  test(`ligne de backlink sous le cadre (${nom}) : dans le DOM de l'hôte, lien suivi, CLS 0`, async ({ page }) => {
    const o = new URL(BASE_URL).origin;
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await hote(page, gabarit(o));
    await page.goto(HOTE);
    const ligne = page.locator("body > p", { hasText: "La vanne du jour par" });
    await expect(ligne).toHaveCount(1);
    // Juste après le cadre (pour le script : après le conteneur, pas dedans), avant la suite de l'hôte.
    expect(await ligne.evaluate((n) => [n.previousElementSibling?.tagName, n.nextElementSibling?.id])).toEqual([cadreTag, "apres"]);
    const lien = ligne.getByRole("link", { name: "Deviens Marrant", exact: true });
    await expect(lien).toBeVisible();
    expect(await lien.evaluate((a) => [a.getAttribute("rel"), a.getAttribute("target"), a.getAttribute("href")])).toEqual([null, null, `${o}/`]);
    const avant = await ligne.evaluate((n) => n.getBoundingClientRect().top);
    await cadre(page);
    await page.waitForTimeout(800);
    // Sous le cadre, 6 px plus bas, sans bouger quand l'iframe arrive.
    const [haut, basCadre] = await ligne.evaluate((n) => [n.getBoundingClientRect().top, n.previousElementSibling!.getBoundingClientRect().bottom]);
    expect(haut).toBe(avant);
    expect(Math.round(haut - basCadre)).toBe(6);
    expect(await page.locator("iframe").evaluate((n) => (n as HTMLElement).offsetHeight)).toBe(HAUTEUR_1280);
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBe(0);
  });
}

test("hôte à CSP stricte (style-src 'self') : widget rendu sans violation", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => /Content Security Policy/i.test(m.text()) && violations.push(m.text()));
  const o = new URL(BASE_URL).origin;
  await hote(page, '<script async src="/widget.js"></script>', `default-src 'none'; script-src ${o}; frame-src ${o}; style-src 'self'`);
  await page.goto(HOTE);
  const f = await cadre(page);
  await expect(f.getByRole("link", { name: /^Deviens Marrant/ })).toBeVisible();
  expect(await page.locator("iframe").evaluate((n) => [(n as HTMLElement).offsetHeight, getComputedStyle(n).borderTopWidth])).toEqual([HAUTEUR_1280, "0px"]);
  expect(violations).toEqual([]);
});
