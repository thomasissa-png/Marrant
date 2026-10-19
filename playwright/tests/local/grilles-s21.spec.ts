import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * Revue visuelle s21, tour 2 (verdict @design, bloquants R01 et R02), figés ici :
 * - R01 /conseils : 2 colonnes dès 1 024 px, cartes d'une rangée de même largeur et de même
 *   hauteur ; une colonne à 375 px. Tour 4 (T3-04) : 3 cartes = une rangée de 3 à 1 280 px.
 * - R02 /favoris (abonné) : vignette vidéo bornée (420 px de large au plus dès 1 024 px, 300 px à 768 px, T3-06 ; plus de
 *   vignette de 1 244 px), vannes et conseils sur 2 colonnes.
 */
test.describe("Grilles des listes et des favoris @s21", () => {
  localSeulement();

  test("R01 /conseils : 2 colonnes à 1 280 px, rangée régulière ; 1 colonne à 375 px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/conseils");
    const cartes = page.locator('main [role="tabpanel"] > *');
    await expect(cartes.first()).toBeVisible();
    expect(await cartes.count()).toBeGreaterThanOrEqual(2);
    const [a, b] = [await cartes.nth(0).boundingBox(), await cartes.nth(1).boundingBox()];
    expect(a && b).toBeTruthy();
    if (!a || !b) return;
    expect(Math.abs(a.y - b.y), "deux cartes sur la même rangée").toBeLessThanOrEqual(1);
    expect(b.x, "seconde carte à droite de la première").toBeGreaterThan(a.x + a.width);
    expect(Math.abs(a.width - b.width), "même largeur").toBeLessThanOrEqual(1);
    expect(Math.abs(a.height - b.height), "même hauteur").toBeLessThanOrEqual(1);
    const grille = await page.locator('main [role="tabpanel"]').boundingBox();
    expect(a.width, "une demi-colonne, plus de carte de toute la largeur à moitié vide").toBeLessThan((grille?.width ?? 0) * 0.55);
    // Tour 4 (T3-04) : le mur visiteur de 3 conseils tient sur une rangée de 3 cartes de même anatomie.
    if ((await cartes.count()) === 3) {
      const c = await cartes.nth(2).boundingBox();
      expect(Math.abs((c?.y ?? 0) - a.y), "3e carte sur la même rangée").toBeLessThanOrEqual(1);
      expect(Math.abs((c?.width ?? 0) - a.width), "3e carte de même largeur").toBeLessThanOrEqual(1);
    }

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/conseils");
    const premiere = await cartes.first().boundingBox();
    const liste = await page.locator('main [role="tabpanel"]').boundingBox();
    expect(Math.abs((premiere?.width ?? 0) - (liste?.width ?? 0)), "une colonne à 375 px").toBeLessThanOrEqual(1);
  });

  test.describe("R02 /favoris", () => {
    const email = `e2e-favoris-${randomBytes(4).toString("hex")}@example.com`;
    const motDePasse = "MotDePasse-e2e-42";

    test.beforeAll(async () => {
      await creerCompte(email, motDePasse, "PREMIUM");
      const [u] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
      const ajouter = async (type: "JOKE" | "TIP" | "VIDEO", table: string, colonne: string, n: number) => {
        const ids = await requete<{ id: string }>(`SELECT id FROM "${table}" ORDER BY "createdAt" LIMIT ${n}`);
        for (const { id } of ids) {
          await requete(
            `INSERT INTO "UserFavorite" (id, "userId", "contentType", "${colonne}") VALUES ($1, $2, $3::"ContentType", $4) ON CONFLICT DO NOTHING`,
            [`e2e${randomBytes(8).toString("hex")}`, u.id, type, id],
          );
        }
      };
      await ajouter("JOKE", "Joke", "jokeId", 2);
      await ajouter("TIP", "Tip", "tipId", 2);
      await ajouter("VIDEO", "Video", "videoId", 1);
    });
    test.afterAll(async () => {
      await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
    });

    test("vignette vidéo bornée et cartes courtes sur 2 colonnes à 1 280 px", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await connecter(page, email, motDePasse);
      await page.goto("/favoris");
      const vignette = page.locator("main .aspect-video").first();
      await expect(vignette).toBeVisible();
      const v = await vignette.boundingBox();
      expect(v?.width ?? 9999, "vignette de 420 px de large au plus").toBeLessThanOrEqual(421);
      expect(v?.height ?? 9999, "vignette de 240 px de haut au plus").toBeLessThanOrEqual(240);

      const vannes = page.locator("main").getByText("Vanne", { exact: true });
      await expect(vannes.first()).toBeVisible();
      const largeurs = await page.locator("main .grid > *").evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().width)));
      const colonne = Math.max(...largeurs);
      expect(largeurs.some((w) => w < colonne * 0.55), "des cartes en demi-colonne").toBe(true);
    });

    // Tour 4 (T3-06) : à 768 px, vignette bornée à 300 px à gauche, vannes et conseils sur 2 colonnes.
    test("vignette vidéo bornée et cartes courtes sur 2 colonnes à 768 px", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await connecter(page, email, motDePasse);
      await page.goto("/favoris");
      const vignette = page.locator("main .aspect-video").first();
      await expect(vignette).toBeVisible();
      const v = await vignette.boundingBox();
      expect(v?.width ?? 9999, "vignette de 300 px de large au plus").toBeLessThanOrEqual(301);
      await expect(page.locator("main").getByText("Vanne", { exact: true }).first()).toBeVisible();
      const largeurs = await page.locator("main .grid > *").evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().width)));
      const colonne = Math.max(...largeurs);
      expect(largeurs.some((w) => w < colonne * 0.55), "des cartes en demi-colonne").toBe(true);
    });

    // Tour 4 (T3-07) : à 1 280 px, les pastilles de catégories de /vannes (abonné) tiennent sur une rangée.
    test("pastilles de /vannes sur une seule rangée à 1 280 px", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await connecter(page, email, motDePasse);
      await page.goto("/vannes");
      const pastilles = page.getByRole("tablist", { name: "Catégories de vannes" }).getByRole("tab");
      await expect(pastilles.first()).toBeVisible();
      const hauts = await pastilles.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
      expect(hauts.length, "toutes les catégories").toBeGreaterThanOrEqual(10);
      expect(new Set(hauts).size, "une seule rangée").toBe(1);
    });
  });
});
