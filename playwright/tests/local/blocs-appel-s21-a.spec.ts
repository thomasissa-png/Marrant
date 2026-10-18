import { mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Blocs d'appel s21, partie A (spec `docs/design/cta-forme-place-s21.md`) sur le rendu réel,
 * à 375 et 1280 px :
 * - B1 : encart DemoVanne de l'article n°1 (un plein vers la fiche offerte du carnet,
 *   400 px au plus à 375), un seul encart ;
 * - B2 / B18 : bas d'article dans l'ordre corps, bloc de fin, lettre, articles liés, FAQ ;
 *   bloc de fin à un seul plein, 560 px au plus à 375 ;
 * - B3, B4 + B5 : accueil (plein vers l'étape 1 de Répartie ; carte Premium : plein puis
 *   contour, dans le même écran à 375).
 * Captures : `E2E_CAPTURES_DIR` (si posée), sinon jointes au rapport.
 */
const ARTICLE = "/blog/meilleures-blagues-droles-2026";
const LARGEURS = [375, 1280];

async function capture(page: import("@playwright/test").Page, nom: string, testInfo: import("@playwright/test").TestInfo) {
  const dossier = process.env.E2E_CAPTURES_DIR;
  if (dossier) {
    mkdirSync(dossier, { recursive: true });
    await page.screenshot({ path: path.join(dossier, `${nom}.png`) });
  } else {
    await testInfo.attach(nom, { body: await page.screenshot(), contentType: "image/png" });
  }
}

test.describe("Blocs d'appel s21, partie A @s21", () => {
  localSeulement();

  for (const largeur of LARGEURS) {
    test(`article n°1 à ${largeur} px : démonstration, bloc de fin, ordre du bas`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: largeur, height: largeur < 400 ? 812 : 900 });
      await page.goto(ARTICLE);

      // B1 : un seul encart, la démonstration.
      const encarts = page.locator("[data-blog-body] [data-blog-cta-position]");
      await expect(encarts).toHaveCount(1);
      const demo = page.locator("[data-demo-vanne='milieu']");
      await demo.scrollIntoViewIfNeeded();
      await expect(demo).toBeVisible();
      const bouton = demo.getByRole("link");
      await expect(bouton).toHaveCount(1);
      await expect(bouton).toHaveAttribute("href", /^\/carnet\?src=blog-demo-milieu-1#fiche-2026-10-15$/);
      await expect(demo).toContainText("Tu parles toujours aussi peu");
      const hDemo = (await demo.boundingBox())?.height ?? 0;
      if (largeur < 400) expect(hDemo, "DemoVanne : 400 px au plus à 375").toBeLessThanOrEqual(400);
      await capture(page, `article-demo-${largeur}`, testInfo);

      // B2 : bloc de fin, un seul plein, lien payant.
      const fin = page.locator("[data-blog-bloc-fin]");
      await fin.scrollIntoViewIfNeeded();
      await expect(fin.locator("a[data-blog-cta='etape-1']")).toHaveAttribute("href", "/parcours/repartie?src=blog#etape-1");
      await expect(fin.locator("a[data-blog-cta='abonnement']")).toContainText(/Débloquer les\s\d\sparcours/);
      await expect(fin.locator("ul")).toHaveCount(0);
      const hFin = (await fin.boundingBox())?.height ?? 0;
      if (largeur < 400) expect(hFin, "bloc de fin : 560 px au plus à 375").toBeLessThanOrEqual(560);
      await capture(page, `article-fin-${largeur}`, testInfo);

      // Ordre §3.1 : bloc de fin, lettre, articles liés, FAQ.
      const y = async (sel: string) => (await page.locator(sel).first().boundingBox())?.y ?? -1;
      const [yFin, yLettre, yLies, yFaq] = [
        await y("[data-blog-bloc-fin]"),
        await y("[data-lettre='article']"),
        await y("[data-blog-zone='related']"),
        await y("section:has(> h2:text('Questions fréquentes'))"),
      ];
      expect(yFin).toBeLessThan(yLettre);
      expect(yLettre).toBeLessThan(yLies);
      expect(yLies).toBeLessThan(yFaq);
    });

    test(`accueil à ${largeur} px : haut de page et carte Premium`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: largeur, height: largeur < 400 ? 812 : 900 });
      await page.goto("/");
      const plein = page.locator("main a[data-accueil-cta='etape-1']").first();
      await expect(plein).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
      await expect(page.locator("main a[data-accueil-cta='abonnement']").first()).toHaveAttribute("href", "/abonnement?src=accueil-hero");
      await capture(page, `accueil-haut-${largeur}`, testInfo);

      const carte = page.locator("#offres");
      await carte.scrollIntoViewIfNeeded();
      await expect(page.getByText("Tu crois avoir tout essayé")).toHaveCount(0);
      const payant = carte.locator("a[data-accueil-cta='abonnement']");
      const contour = carte.locator("a[data-accueil-cta='etape-1']");
      await expect(payant).toHaveAttribute("href", "/abonnement?src=accueil-premium");
      await expect(contour).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
      await payant.scrollIntoViewIfNeeded();
      const bp = await payant.boundingBox();
      const bc = await contour.boundingBox();
      const hauteur = page.viewportSize()?.height ?? 812;
      expect((bc?.y ?? 0) + (bc?.height ?? 0) - (bp?.y ?? 0), "plein et contour dans le même écran").toBeLessThanOrEqual(hauteur);
      await capture(page, `accueil-premium-${largeur}`, testInfo);
    });
  }
});
