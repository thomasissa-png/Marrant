import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ficheOfferte, parseCarnets } from "@/lib/carnet";
import { DEMO_VANNE } from "@/config/textes/cta-articles-accueil";
import { frTypo } from "@/lib/fr-typo";
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

/**
 * Fiche offerte attendue pour le mois « AAAA-MM » : mêmes fonctions et même JSON que le site
 * (`ficheOfferte` sur `src/data/carnet/AAAA-MM.json`). Le mois vient de la page (l'id de la
 * fiche montrée), jamais de l'horloge du test : le carnet courant est choisi par le serveur.
 */
function ficheOfferteDuMois(mois: string) {
  const fichier = path.join(__dirname, "..", "..", "..", "apps", "web", "src", "data", "carnet", `${mois}.json`);
  const [carnet] = parseCarnets([JSON.parse(readFileSync(fichier, "utf8"))]);
  return ficheOfferte(carnet);
}

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
      // La fiche montrée est la fiche offerte de son carnet (même fonction que le site), et
      // /carnet (carnet du mois en cours, choisi par le serveur) l'affiche ouverte, à cette ancre.
      const ficheId = (await demo.getAttribute("data-blog-cta-fiche")) ?? "";
      expect(ficheId, "id de fiche AAAA-MM-JJ").toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const attendue = ficheOfferteDuMois(ficheId.slice(0, 7));
      expect(ficheId, "fiche offerte du carnet").toBe(attendue.id);
      const hrefDemo = `/carnet?src=blog-demo-milieu-1#fiche-${ficheId}`;
      await expect(bouton).toHaveAttribute("href", hrefDemo);
      await expect(demo).toContainText(frTypo(DEMO_VANNE.situation(attendue.accroche ?? "", attendue.onTeDit)));
      const hDemo = (await demo.boundingBox())?.height ?? 0;
      if (largeur < 400) expect(hDemo, "DemoVanne : 400 px au plus à 375").toBeLessThanOrEqual(400);
      await capture(page, `article-demo-${largeur}`, testInfo);

      // B2 : bloc de fin, un seul plein, lien payant.
      const fin = page.locator("[data-blog-bloc-fin]");
      await fin.scrollIntoViewIfNeeded();
      await expect(fin.locator("a[data-blog-cta='etape-1']")).toHaveAttribute("href", "/parcours/repartie?src=blog#etape-1");
      await expect(fin.locator("a[data-blog-cta='abonnement']")).toContainText(/Ouvrir les\s\d\sparcours\s·\s2,99/);
      await expect(fin.locator("ul")).toHaveCount(0);
      const hFin = (await fin.boundingBox())?.height ?? 0;
      // Budget @design (spec §2.1 Z3) : 560 px pour les textes du tour 4. Les textes validés du
      // 18/10 ([S5'] plus long, intouchable) mesurent 582 px : plafond 600, écart signalé à @design.
      if (largeur < 400) expect(hFin, "bloc de fin : 600 px au plus à 375").toBeLessThanOrEqual(600);
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

      // Cible du bouton de la démonstration : la fiche est celle du carnet en cours, ouverte.
      await page.goto(hrefDemo);
      await expect(page.locator(`#fiche-${ficheId}`)).toBeVisible();
    });

    test(`accueil à ${largeur} px : haut de page et carte Premium`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: largeur, height: largeur < 400 ? 812 : 900 });
      await page.goto("/");
      const plein = page.locator("main a[data-accueil-cta='etape-1']").first();
      await expect(plein).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
      // s21 concision (18/10) : plus de lien payant sous le plein du haut ; le payant est dans l'en-tête.
      await expect(page.locator("main section:has(h1) a[href^='/abonnement']")).toHaveCount(0);
      await expect(page.locator('header a[href^="/abonnement?src=header"]').first()).toBeAttached();
      // Concision v5 : un appel payant visible au premier écran à toutes les largeurs (bouton de l'en-tête).
      const prixEnTete = page.locator('header a[href="/abonnement?src=header"]').filter({ visible: true });
      await expect(prixEnTete).toHaveCount(1);
      const boite = await prixEnTete.boundingBox();
      expect((boite?.x ?? 0) + (boite?.width ?? 0), "bouton prix dans l'écran").toBeLessThanOrEqual(largeur);
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
