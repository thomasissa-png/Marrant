import { test, expect, localSeulement } from "../support/base-locale";

/**
 * s21 : sur /vannes, /conseils et /videos, le titre de la carte est le lien vers la fiche (plus de
 * « Page dédiée »). Lien <a href> dans le HTML rendu par le serveur (explorable), un seul lien de
 * fiche par carte, atteignable au clavier, Entrée ouvre la fiche.
 */
test.describe("Murs de liste : titre de carte cliquable @s21", () => {
  localSeulement();

  for (const rubrique of ["vannes", "conseils", "videos"] as const) {
    test(`/${rubrique} : un lien de fiche par carte, sur le titre, dans le HTML du serveur`, async ({ page, request }) => {
      const html = await (await request.get(`/${rubrique}`)).text();
      expect(html).not.toContain("Page dédiée");
      const fiches = [...html.matchAll(new RegExp(`<a [^>]*href="/${rubrique}/([^"?#]+)"`, "g"))]
        .map((m) => m[1])
        .filter((slug) => !slug.startsWith("theme/"));
      expect(fiches.length).toBeGreaterThan(0);
      expect(new Set(fiches).size).toBe(fiches.length);

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`/${rubrique}`);
      const premier = page.locator(`main a[href^="/${rubrique}/"]:not([href^="/${rubrique}/theme/"])`).first();
      await expect(premier).toBeVisible();
      const href = await premier.getAttribute("href");
      const titre = (await premier.innerText()).trim();
      expect(titre.length).toBeGreaterThan(3);
      // Au clavier : le titre prend le focus (anneau visible), Entrée ouvre la fiche.
      await premier.focus();
      await expect(premier).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});
