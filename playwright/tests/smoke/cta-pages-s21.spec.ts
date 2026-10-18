import { test, expect, lireUrl, texteValide } from "../support/fixtures";
import {
  ABONNEMENT_CTA,
  ABONNEMENT_HAUT_PAR_PARCOURS,
  LISTE_PARCOURS_CTA,
  REGISTER_CTA,
} from "@/config/textes/cta-pages";

/**
 * Blocs d'appel s21, partie B (lecture seule). Tag @s21 : dépend de ce chantier,
 * sauté par le smoke de production tant qu'il n'est pas déployé.
 * Textes : constantes de `apps/web/src/config/textes/cta-pages.ts`, jamais recopiés.
 */
test.describe("Blocs d'appel s21, partie B @smoke @s21", () => {
  test("/abonnement 375 x 700 : bouton d'achat entier au premier écran, [S32] dessous, titre par parcours", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    for (const [chemin, slug] of [
      ["/abonnement", "defaut"],
      ["/abonnement?returnTo=%2Fparcours%2Fmachine-a-cafe", "machine-a-cafe"],
      ["/abonnement?returnTo=%2Fparcours%2Fconfiance", "confiance"],
    ] as const) {
      await page.goto(chemin);
      await expect(page.locator("h1")).toHaveText(texteValide(ABONNEMENT_HAUT_PAR_PARCOURS[slug].titre));
      const bouton = page.getByTestId("abonnement-bouton-achat");
      // Textes validés : le bouton nomme le parcours d'origine (« Ouvrir {P} et les 4 autres · prix »).
      await expect(bouton).toHaveText(texteValide(ABONNEMENT_CTA.bouton("monthly", slug === "defaut" ? null : slug)));
      const box = await bouton.boundingBox();
      expect(box, `bouton d'achat de ${chemin}`).not.toBeNull();
      // Bas du bouton dans le premier écran (y mesuré : 431,8 en mensuel seul, 602,1 avec l'annuel).
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(700);
      await expect(page.getByTestId("abonnement-suite")).toHaveText(texteValide(ABONNEMENT_CTA.suite));
    }
  });

  test("/register : sans prénom (s21 concision), bouton du tour 4, lien d'étape gratuite", async ({ page }) => {
    await page.goto("/register?callbackUrl=%2Fabonnement%3FreturnTo%3D%252Fparcours%252Fconfiance");
    const ids = await page.locator("form input").evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(["email", "password"]);
    await expect(page.getByRole("button", { name: REGISTER_CTA.bouton })).toBeVisible();
    const lien = page.getByRole("link", { name: REGISTER_CTA.lienEtape1("confiance") });
    expect(lireUrl(await lien.getAttribute("href")).pathname).toBe("/parcours/confiance");
  });

  test("/parcours : un plein par carte vers l'étape 1 gratuite, ligne frontière dessous", async ({ page }) => {
    await page.goto("/parcours");
    await expect(page.getByRole("button", { name: LISTE_PARCOURS_CTA.bouton("repartie") })).toBeVisible();
    await expect(page.getByText(LISTE_PARCOURS_CTA.frontiere("repartie"))).toBeVisible();
  });
});
