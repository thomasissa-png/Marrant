import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * s21 (QA M2) : un abonné Premium connecté est reconnu partout, sans passer par /profil.
 * - Accueil : pas de carte Premium (`#offres`, « Active mon accès »).
 * - /vannes : le cœur ajoute le favori (aucune fenêtre « Je m'abonne… »), favori écrit en base.
 * Compte de test créé puis supprimé sur la base jetable.
 */
test.describe("Abonné reconnu sur l'accueil et les listes @s21", () => {
  localSeulement();

  const email = `e2e-m2-${randomBytes(4).toString("hex")}@example.com`;
  const motDePasse = "MotDePasse-e2e-42";

  test.beforeAll(async () => {
    await creerCompte(email, motDePasse, "PREMIUM");
  });
  test.afterAll(async () => {
    await requete(`DELETE FROM "UserFavorite" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)`, [email]);
    await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
  });

  test("accueil sans carte Premium, cœur de /vannes = favori ajouté", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await connecter(page, email, motDePasse);

    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("#offres")).toHaveCount(0);

    await page.goto("/vannes");
    const coeur = page.getByRole("button", { name: "Ajouter aux favoris" }).first();
    await expect(coeur).toBeVisible();
    const ajout = page.waitForResponse((r) => r.url().includes("/api/favorites") && r.request().method() === "POST");
    await coeur.click();
    expect((await ajout).ok()).toBe(true);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Retirer des favoris" }).first()).toBeVisible();

    const favoris = await requete<{ n: string }>(
      `SELECT count(*)::text AS n FROM "UserFavorite" f JOIN "User" u ON u.id = f."userId" WHERE u.email = $1`,
      [email],
    );
    expect(Number(favoris[0].n)).toBe(1);
  });
});
