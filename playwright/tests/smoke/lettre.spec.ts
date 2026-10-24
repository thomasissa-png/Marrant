import { test, expect, auditAxe } from "../support/fixtures";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * Lettre s21 en lecture seule (QA s21 M1) : présence aux emplacements prévus et
 * pages joignables, jouable en production (aucun formulaire soumis : la garde de
 * `support/fixtures.ts` bloque tout POST). Le parcours complet inscription,
 * confirmation et désinscription est dans `tests/local/lettre-parcours.spec.ts`.
 * Tag @s21 : dépend de la mise en ligne de la lettre.
 */
test.describe("Lettre (lecture seule) @smoke @s21", () => {
  test("/lettre : 200, titre, formulaire complet (champ, case, bouton, lien Confidentialité), 0 violation axe", async ({ page }) => {
    const reponse = await page.goto("/lettre");
    expect(reponse?.status()).toBe(200);
    expect(reponse?.headers()["referrer-policy"]).toBe("same-origin");
    await expect(page.getByRole("heading", { level: 1, name: TEXTES_LETTRE.titre })).toBeVisible();
    await expect(page.getByLabel(TEXTES_LETTRE.formulaire.label)).toBeVisible();
    await expect(page.getByRole("checkbox")).not.toBeChecked();
    await expect(page.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: TEXTES_LETTRE.formulaire.lienConfidentialite })).toHaveAttribute(
      "href",
      "/confidentialite#lettre",
    );
    expect(await auditAxe(page)).toEqual([]);
  });

  test("accueil : bloc de la lettre avec son lien vers /lettre, sans bouton", async ({ page }) => {
    await page.goto("/");
    const bloc = page.locator("section[aria-labelledby='lettre-accueil']");
    await expect(bloc.getByRole("heading", { name: TEXTES_LETTRE.accueil.titre })).toBeVisible();
    await expect(bloc.getByRole("link", { name: TEXTES_LETTRE.accueil.lien })).toHaveAttribute("href", "/lettre");
    await expect(bloc.locator("button, form")).toHaveCount(0);
  });

  test("pied de page : « La lettre du mois » vers /lettre", async ({ page }) => {
    await page.goto("/vannes");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: TEXTES_LETTRE.piedDePage })).toHaveAttribute("href", "/lettre");
  });

  test("fin d'article : formulaire de la lettre présent", async ({ page }) => {
    await page.goto("/blog/comment-devenir-drole");
    const bloc = page.locator("[data-lettre='article']");
    await bloc.scrollIntoViewIfNeeded();
    await expect(bloc.getByLabel(TEXTES_LETTRE.formulaire.label)).toBeVisible();
    await expect(bloc.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton })).toBeVisible();
  });

  test("/confidentialite#lettre : section de la lettre présente", async ({ page }) => {
    await page.goto("/confidentialite#lettre");
    await expect(page.locator("#lettre")).toBeVisible();
  });
});
