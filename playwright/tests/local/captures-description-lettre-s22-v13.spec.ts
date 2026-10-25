import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Captures v13 (s22, nouveau format de la lettre du mois : « une situation, trois répliques »), sur
 * BUILD DE PRODUCTION et base jetable. Sur demande : `CAPTURES_DESCRIPTION_LETTRE=1`. Écrans : /lettre
 * (titre, formulaire, case v3), page « C'est confirmé », formulaire en bas d'article. 390 et 1440.
 * Sortie : v13-*.png ; aucune capture plus ancienne n'est réécrite.
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const VUES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
const TITRE = "Une situation, trois répliques, chaque mois";
const CASE_V3 = "Elle contient une situation, trois répliques, un exercice et une mention de Premium.";

test.describe.configure({ mode: "serial" });

/** Élément capturé en entier (capture pleine page découpée), sans débordement horizontal. */
async function capturer(page: Page, el: Locator, nom: string): Promise<void> {
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => ok(null))));
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  const r = await el.evaluate((n) => {
    const b = n.getBoundingClientRect();
    return { x: b.left + window.scrollX, y: b.top + window.scrollY, width: b.width, height: b.height };
  });
  const marge = 12;
  await page.screenshot({
    path: path.join(DOSSIER, `v13-${nom}.png`),
    fullPage: true,
    animations: "disabled",
    clip: { x: Math.max(0, r.x - marge), y: Math.max(0, r.y - marge), width: Math.min(r.width + 2 * marge, p.vue), height: r.height + 2 * marge },
  });
}

const sansEspacesSpeciales = (t: string | null) => (t ?? "").replace(/\s/g, " ").replace(/⁠/g, "");

test.describe("Captures v13 : description de la lettre du mois (nouveau format)", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_DESCRIPTION_LETTRE !== "1", "captures sur demande : CAPTURES_DESCRIPTION_LETTRE=1");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of VUES) {
    test(`${vue.width} : /lettre, titre et case de consentement v3`, async ({ page }) => {
      await page.setViewportSize(vue);
      await page.goto("/lettre");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveTitle(/^La lettre : trois répliques, chaque mois/);
      expect(sansEspacesSpeciales(await page.getByRole("heading", { level: 1 }).textContent())).toBe(TITRE);
      expect(sansEspacesSpeciales(await page.locator("main").textContent())).toContain(CASE_V3);
      await capturer(page, page.locator("main"), `lettre-${vue.width}`);
    });

    test(`${vue.width} : page « C'est confirmé »`, async ({ page }) => {
      await page.setViewportSize(vue);
      await page.goto("/lettre?statut=confirmee");
      await page.waitForLoadState("networkidle");
      const main = page.locator("main");
      expect(sansEspacesSpeciales(await main.textContent())).toContain("Une lettre par mois, avec une situation et trois répliques.");
      await expect(main.getByRole("link", { name: "En attendant le prochain numéro, la vanne du jour" })).toHaveAttribute("href", "/blague-du-jour");
      await capturer(page, main, `lettre-confirmee-${vue.width}`);
    });

    test(`${vue.width} : formulaire en bas d'article`, async ({ page }) => {
      await page.setViewportSize(vue);
      await page.goto("/blog/comment-devenir-drole");
      await page.waitForLoadState("networkidle");
      const bloc = page.locator('section[data-lettre="article"]');
      await bloc.scrollIntoViewIfNeeded();
      expect(sansEspacesSpeciales(await bloc.textContent())).toContain(TITRE);
      expect(sansEspacesSpeciales(await bloc.textContent())).toContain(CASE_V3);
      await capturer(page, bloc, `bas-article-${vue.width}`);
    });
  }
});
