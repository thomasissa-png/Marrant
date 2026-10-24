import { test, expect, localSeulement } from "../support/base-locale";

/**
 * s21 : murs de liste /vannes, /conseils et /videos, plus de « Page dédiée ». Un seul lien <a href>
 * de fiche par carte dans le HTML rendu par le serveur (explorable), atteignable au clavier.
 * - /conseils et /videos : le titre de la carte est ce lien.
 * - /vannes : toucher l'amorce (ou la carte) révèle la chute, geste de la page ; le lien de fiche
 *   est une flèche discrète au coin inférieur droit (sans texte visible, nom accessible), qui ne
 *   révèle rien.
 */
const FLECHE_VANNE = "Voir la fiche de cette vanne";

test.describe("Murs de liste : lien de fiche de chaque carte @s21", () => {
  localSeulement();

  for (const rubrique of ["vannes", "conseils", "videos"] as const) {
    test(`/${rubrique} : un lien de fiche par carte, dans le HTML du serveur`, async ({ request }) => {
      const html = await (await request.get(`/${rubrique}`)).text();
      expect(html).not.toContain("Page dédiée");
      const fiches = [...html.matchAll(new RegExp(`<a [^>]*href="/${rubrique}/([^"?#]+)"`, "g"))]
        .map((m) => m[1])
        .filter((slug) => !slug.startsWith("theme/"));
      expect(fiches.length).toBeGreaterThan(0);
      expect(new Set(fiches).size).toBe(fiches.length);
      if (rubrique === "vannes") {
        // Chaque lien de fiche est une flèche : autant de flèches que de fiches.
        expect(html.split(`aria-label="${FLECHE_VANNE}"`).length - 1).toBe(fiches.length);
      }
    });
  }

  for (const rubrique of ["conseils", "videos"] as const) {
    test(`/${rubrique} : le titre de la carte ouvre la fiche au clavier`, async ({ page }) => {
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

  test.describe("/vannes au toucher", () => {
    test.use({ hasTouch: true, viewport: { width: 375, height: 812 } });

    test("toucher l'amorce révèle la chute ; la flèche de coin ouvre la fiche", async ({ page }) => {
      // La liste du serveur est rechargée par le client (ordre pouvant différer) : attendre ce
      // rechargement avant de lire la carte, sinon la carte lue n'est plus celle touchée.
      const rechargement = page.waitForResponse((r) => r.url().includes("/api/jokes"));
      await page.goto("/vannes");
      await rechargement;
      await page.waitForLoadState("networkidle");
      const fleche = page.getByRole("link", { name: FLECHE_VANNE }).first();
      await expect(fleche).toBeVisible();
      const href = await fleche.getAttribute("href");
      expect(href).toMatch(/^\/vannes\/[^/?#]+$/);
      expect((await fleche.innerText()).trim()).toBe("");
      const boite = await fleche.boundingBox();
      expect(boite?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);

      const carte = fleche.locator("xpath=ancestor::div[contains(@class,'cursor-pointer')][1]");
      const amorce = carte.locator("p.text-text-primary").first();
      // L'amorce n'est pas un lien : la toucher révèle la chute, on reste sur /vannes.
      await expect(amorce.locator("a")).toHaveCount(0);
      await expect(carte.locator('[id^="punchline-"]')).toHaveCount(0);
      await amorce.tap();
      await expect(carte.locator('[id^="punchline-"]')).toBeVisible();
      await expect(page).toHaveURL(/\/vannes\/?$/);

      // Au clavier : la flèche prend le focus ; la toucher ouvre la fiche (sans révéler ailleurs).
      await fleche.focus();
      await expect(fleche).toBeFocused();
      await fleche.tap();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator("h1")).toBeVisible();
    });
  });
});
