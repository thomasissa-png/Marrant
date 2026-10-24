import { test, expect, localSeulement } from "../support/base-locale";

/**
 * QA s21 tour 2 :
 * - n2 : aucun défilement horizontal à 320 px (iPhone SE 1re génération) sur les
 *   pages de liste et les pages d'entrée ;
 * - n1 : Échap ferme le menu mobile et rend le focus au bouton « Menu ».
 */
const PAGES_320 = ["/", "/conseils", "/vannes", "/videos", "/blog", "/lettre", "/abonnement"];

test.describe("Petits écrans", () => {
  localSeulement();

  test("320 px : aucun défilement horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    for (const chemin of PAGES_320) {
      await page.goto(chemin, { waitUntil: "load" });
      // Mise en page après hydratation (listes rendues côté serveur, puis client).
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => {
        const fenetre = document.documentElement.clientWidth;
        const fautifs = Array.from(document.querySelectorAll("main *"))
          .filter((el) => el.getBoundingClientRect().right > fenetre + 0.5 && getComputedStyle(el).position !== "fixed")
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").slice(0, 60)}`);
        return { fenetre, scroll: document.documentElement.scrollWidth, fautifs };
      });
      expect(m.scroll, `${chemin} : ${m.scroll} px pour ${m.fenetre} (${m.fautifs.join(" | ")})`).toBeLessThanOrEqual(m.fenetre);
    }
  });

  test("menu mobile : Échap ferme et rend le focus au bouton « Menu »", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/conseils");
    const bouton = page.getByRole("banner").getByRole("button", { name: "Menu" });
    await bouton.click();
    const nav = page.getByRole("navigation", { name: "Navigation mobile" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link").first().focus();
    await page.keyboard.press("Escape");
    await expect(nav).toHaveCount(0);
    await expect(bouton).toHaveAttribute("aria-expanded", "false");
    await expect(bouton).toBeFocused();
  });
});
