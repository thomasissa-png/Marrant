import { test, expect, auditAxe } from "../support/fixtures";

/**
 * axe-core WCAG 2.2 A/AA sur les pages du parcours (lecture seule).
 * Les pages corrigées par le lot C (liens soulignés, cartes verrouillées, barres
 * de progression nommées) portent @s16 : en prod avant déploiement, elles
 * remontent `link-in-text-block`, `color-contrast` et `aria-progressbar-name`.
 */
const PAGES_PROPRES = [
  "/",
  "/abonnement",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/reset-password?token=faux",
];

const PAGES_CORRIGEES_S16 = ["/register", "/vannes", "/conseils", "/videos", "/parcours/machine-a-cafe"];

async function attendreStable(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await expect(page.getByRole("main")).toBeVisible();
}

test.describe("Accessibilité axe-core @smoke", () => {
  for (const chemin of PAGES_PROPRES) {
    test(`${chemin} : 0 violation WCAG A/AA`, async ({ page }) => {
      await page.goto(chemin);
      await attendreStable(page);
      expect(await auditAxe(page)).toEqual([]);
    });
  }

  for (const chemin of PAGES_CORRIGEES_S16) {
    test(`${chemin} : 0 violation WCAG A/AA @s16`, async ({ page }) => {
      await page.goto(chemin);
      await attendreStable(page);
      expect(await auditAxe(page)).toEqual([]);
    });
  }

  test("/abonnement/success visiteur : 0 violation WCAG A/AA @s16", async ({ page }) => {
    await page.goto("/abonnement/success?session_id=cs_test_e2e_inexistant");
    await expect(page.getByRole("heading", { name: "Connecte-toi pour retrouver ton abonnement" })).toBeVisible();
    expect(await auditAxe(page)).toEqual([]);
  });

  test("/login au clavier : e-mail, mot de passe puis bouton, focus toujours visible", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "ordre de tabulation calibré sur Chromium");
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).focus();
    const ordre: string[] = [];
    for (let i = 0; i < 4; i++) {
      ordre.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          const style = el ? getComputedStyle(el) : null;
          const visible = !!style && (style.outlineStyle !== "none" || style.boxShadow !== "none");
          return `${el?.id || el?.getAttribute("aria-label") || el?.textContent?.trim() || el?.tagName}|${visible}`;
        }),
      );
      await page.keyboard.press("Tab");
    }
    expect(ordre[0]).toMatch(/^email\|true$/);
    expect(ordre[1]).toMatch(/^password\|true$/);
    expect(ordre.slice(2).join(" ")).toMatch(/Se connecter\|true/);
  });
});
