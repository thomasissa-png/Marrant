import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Garde-fous de forme des blocs d'appel s21 (revue @design `docs/design/revue-cta-s21.md`,
 * P3 point 11), sur le rendu réel, en écran visible (jamais en pleine page) :
 * - B2, bloc de fin d'article : 600 px de haut au plus (360 et 375) ;
 * - B1, DemoVanne : 400 px au plus (360 et 375) ;
 * - B3, accueil : bas du bouton plein à 600 px au plus à 375 x 667 ;
 * - B3, lien payant à 320 px : dans l'écran, rien de coupé, centré, 2 lignes au plus, 44 px.
 * Captures d'écran visible si `E2E_CAPTURES_DIR` est posée (375 x 812 et 360 x 740), avec
 * la hauteur mesurée de chaque bloc dans `mesures.json`.
 */
const ARTICLE = "/blog/meilleures-blagues-droles-2026";
const ECRANS = [
  { largeur: 375, hauteur: 812 },
  { largeur: 360, hauteur: 740 },
] as const;
const DOSSIER = process.env.E2E_CAPTURES_DIR;
const mesures: Record<string, unknown>[] = [];

/** Hauteur du bloc, puis bloc amené à 80 px du haut (sous la barre fixe de 64 px) et capture de l'écran visible. */
async function mesurerEtCapturer(page: Page, selecteur: string, nom: string, ecran: string) {
  const bloc = page.locator(selecteur).first();
  await bloc.scrollIntoViewIfNeeded();
  const hauteur = Math.round((await bloc.boundingBox())?.height ?? 0);
  if (DOSSIER) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
    }, selecteur);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DOSSIER, `${nom}-${ecran}.png`) });
  }
  mesures.push({ bloc: nom, ecran, selecteur, hauteur });
  return hauteur;
}

/** Première fiche vanne publiée, lue dans le sitemap (jamais une adresse inventée). */
async function ficheVanneReelle(page: Page): Promise<string> {
  const res = await page.request.get("/sitemap.xml");
  const adresse = (await res.text()).match(/https:\/\/deviens-marrant\.fr(\/vannes\/(?!theme\/)[a-z0-9-]+)</);
  expect(adresse, "une fiche vanne dans le sitemap").not.toBeNull();
  return (adresse as RegExpMatchArray)[1];
}

test.describe("Garde-fous de forme s21 @s21", () => {
  localSeulement();
  test.describe.configure({ mode: "serial" });

  test.beforeAll(() => {
    if (DOSSIER) mkdirSync(DOSSIER, { recursive: true });
  });
  test.afterAll(() => {
    if (DOSSIER) writeFileSync(path.join(DOSSIER, "mesures.json"), `${JSON.stringify(mesures, null, 2)}\n`);
  });

  for (const { largeur, hauteur } of ECRANS) {
    const ecran = `${largeur}x${hauteur}`;

    test(`article à ${ecran} : DemoVanne ≤ 400 px, bloc de fin ≤ 600 px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(ARTICLE);
      const hDemo = await mesurerEtCapturer(page, "[data-demo-vanne='milieu']", "article-encart-milieu", ecran);
      expect(hDemo, "DemoVanne : 400 px au plus").toBeLessThanOrEqual(400);
      const hFin = await mesurerEtCapturer(page, "[data-blog-bloc-fin]", "article-bloc-fin", ecran);
      expect(hFin, "bloc de fin (B2) : 600 px au plus").toBeLessThanOrEqual(600);
    });

    test(`accueil à ${ecran} : haut de page et carte Premium`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/");
      const plein = page.locator("main a[data-accueil-cta='etape-1']").first();
      await expect(plein).toBeVisible();
      const basPlein = Math.round(((await plein.boundingBox())?.y ?? 0) + ((await plein.boundingBox())?.height ?? 0));
      mesures.push({ bloc: "accueil-haut", ecran, mesure: "bas du bouton plein (px depuis le haut)", valeur: basPlein });
      if (DOSSIER) await page.screenshot({ path: path.join(DOSSIER, `accueil-haut-${ecran}.png`) });
      await mesurerEtCapturer(page, "#offres .rounded-2xl", "accueil-carte-premium", ecran);
    });

    test(`fiche vanne réelle à ${ecran} : bloc d'exercice`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      const fiche = await ficheVanneReelle(page);
      const res = await page.goto(fiche);
      expect(res?.status(), fiche).toBe(200);
      mesures.push({ bloc: "fiche-vanne", ecran, adresse: fiche });
      if (DOSSIER) await page.screenshot({ path: path.join(DOSSIER, `fiche-vanne-haut-${ecran}.png`) });
      if (await page.locator("[data-bloc-exercice='vanne']").count()) {
        await mesurerEtCapturer(page, "[data-bloc-exercice='vanne']", "fiche-vanne-bloc-exercice", ecran);
      }
    });
  }

  test("accueil à 375 x 667 : bas du bouton plein à 600 px au plus", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const boite = await page.locator("main a[data-accueil-cta='etape-1']").first().boundingBox();
    expect(boite).not.toBeNull();
    const bas = (boite?.y ?? 0) + (boite?.height ?? 0);
    mesures.push({ bloc: "accueil-haut", ecran: "375x667", mesure: "bas du bouton plein", valeur: Math.round(bas) });
    expect(bas, "bas du plein d'accueil à 375 x 667").toBeLessThanOrEqual(600);
  });

  test("accueil à 320 px : un seul appel dans le haut (plus de lien payant B3), payant porté par l'en-tête", async ({ page }) => {
    // s21 concision (18/10) : le lien payant souligné sous le plein est retiré.
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    const haut = page.locator("main section:has(h1)");
    await expect(haut.locator("a[data-accueil-cta='etape-1']")).toBeVisible();
    await expect(haut.locator("a[href^='/abonnement']")).toHaveCount(0);
    await expect(haut.locator("a[data-accueil-cta='abonnement']")).toHaveCount(0);
    // Le payant reste dans l'en-tête ; sous 360 px il passe dans le menu (header-budget.spec.ts).
    await expect(page.locator('header a[href^="/abonnement?src=header"]').first()).toBeAttached();
  });
});
