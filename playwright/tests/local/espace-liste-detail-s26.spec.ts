import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 liste et détail, pilote Quoi répondre (`docs/ux/liste-detail-quoi-repondre-s26.md` §4, critères 1 à 4 et 6 ;
 * `docs/design/liste-detail-quoi-repondre-s26.md`). Serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ;
 * fermé, ces adresses sont la 404 (`espace-inertie-s24.spec.ts`, `espace-bibliotheque.spec.ts`).
 * - dès 1024 : 3 fiches lues en 5 clics au plus (fiche, filtre replié puis pastille, fiche, « Situation suivante »),
 *   la liste reste le MÊME nœud, son `scrollTop` est gardé, une seule ligne `aria-current`, « Fait » rafraîchi dans la
 *   liste ; retour navigateur fiche par fiche (une entrée d'historique par fiche, aucune par filtre) ;
 * - sous 1024 : page liste, fiche plein écran, « Retour » (`router.back()`) et retour navigateur, `scrollY` à 8 px près ;
 * - 308 de l'ancienne adresse (espace ouvert), 307 du non-abonné vers l'aperçu de la liste.
 */
const MOT_DE_PASSE = "E2e-liste-detail-s26";
const LISTE = "/mon-espace/quoi-repondre";

async function abonne(page: Page) {
  const email = `e2e-qr-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

const colonne = (page: Page) => page.locator("[data-colonne-liste]");
const actives = (page: Page) => colonne(page).locator("a[aria-current='page']");

test.describe("Quoi répondre, liste et détail (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const largeur of [1024, 1280]) {
    test(`dès 1024 (${largeur}) : 3 fiches en 5 clics au plus, liste montée, scrollTop gardé, retour navigateur`, async ({ page }) => {
      await abonne(page);
      await page.setViewportSize({ width: largeur, height: largeur === 1024 ? 768 : 900 });
      await page.goto(LISTE);
      // Panneau d'office : une fiche ouverte (H1) dès le chargement, sa ligne active, l'adresse ne change pas.
      await expect(page.locator("[data-mode='panneau'] h1#fiche-titre")).toBeVisible();
      await expect(actives(page)).toHaveCount(1);
      expect(new URL(page.url()).pathname).toBe(LISTE);
      await colonne(page).evaluate((n) => ((n as HTMLElement & { __marque?: number }).__marque = 26));
      let clics = 0;

      // Clic 1 : une ligne visible, après avoir fait défiler la liste (son scrollTop doit rester).
      const corps = page.locator("[data-liste-corps]");
      await corps.evaluate((c) => (c.scrollTop = 96));
      const avant = await corps.evaluate((c) => c.scrollTop);
      const id1 = await corps.evaluate((c) => {
        const r = c.getBoundingClientRect();
        const l = Array.from(c.querySelectorAll<HTMLElement>("a[data-ligne-qr]:not([aria-current])")).find((a) => {
          const b = a.getBoundingClientRect();
          return b.top >= r.top && b.bottom <= r.bottom;
        });
        return l?.dataset.ligneQr ?? "";
      });
      expect(id1).not.toBe("");
      await colonne(page).locator(`a[data-ligne-qr='${id1}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      await expect(page.locator(`[data-fiche-panneau='${id1}'] h1`)).toBeVisible();
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
      expect(Math.abs((await corps.evaluate((c) => c.scrollTop)) - avant), "scrollTop de la liste gardé").toBeLessThanOrEqual(0);
      await expect(actives(page)).toHaveCount(1);
      await expect(page.locator("#fiche-titre")).toBeFocused();

      // Clics 2 et 3 : filtres repliés, puis un lieu d'au moins 3 situations (la query porte le filtre).
      const lieu = await corps.evaluate((c) => Array.from(c.querySelectorAll<HTMLElement>("section[data-lieu]")).find((s) => s.dataset.lieu !== "sans-lieu" && s.querySelectorAll("a[data-ligne-qr]").length >= 3)?.dataset.lieu ?? "");
      expect(lieu).not.toBe("");
      await colonne(page).locator("details[data-filtres-liste] > summary").click();
      clics++;
      await colonne(page).locator(`a[data-filtre='${lieu}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`ou=${lieu}`));
      const apresFiltre = page.url();
      // s26 liste et détail, tour 1 (mesures §8.1) : le repli se referme après un choix, la liste garde sa hauteur utile
      // (au moins 3 lignes de 44 px entre le titre et le pied), aucune ligne recouverte par le pied « carnet ».
      await expect(colonne(page).locator("details[data-filtres-liste]")).not.toHaveAttribute("open", "");
      expect(await corps.evaluate((c) => c.getBoundingClientRect().height), "corps de liste utile").toBeGreaterThanOrEqual(3 * 44);

      // Clic 4 : une fiche du filtre (pas la première : « Situation suivante » doit exister) ; lien filtré.
      const ligne2 = colonne(page).locator("a[data-ligne-qr]").nth(1);
      const id2 = (await ligne2.getAttribute("data-ligne-qr"))!;
      expect(await ligne2.getAttribute("href")).toBe(`${LISTE}/${id2}?ou=${lieu}`);
      await ligne2.click();
      clics++;
      await expect(page.locator(`[data-fiche-panneau='${id2}'] h1`)).toBeVisible();

      // Clic 5 : « Situation suivante » (contour avant « Fait »), 1 clic, aucun retour à la liste.
      const suivante = page.locator("[data-situation-suivante]");
      await expect(suivante).not.toHaveAttribute("data-plein", "");
      const href3 = (await suivante.getAttribute("href"))!;
      await suivante.click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${href3.replace(/[?]/g, "\\?")}$`));
      await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
      expect(clics, "3 fiches lues").toBeLessThanOrEqual(5);
      await expect(actives(page)).toHaveCount(1);
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "liste jamais remontée").toBe(26);

      // « Fait » : la ligne passe à « Fait » sans quitter la fiche, « Situation suivante » prend l'aplat.
      const id3 = href3.split("?")[0].split("/").pop()!;
      await page.getByRole("button", { name: "Essayé, bof" }).first().click();
      await expect(colonne(page).locator(`a[data-ligne-qr='${id3}'] [data-fait]`)).toBeVisible({ timeout: 15_000 });
      await expect(page.locator(`[data-fiche-panneau='${id3}']`)).toBeVisible();
      // s26 liste et détail, tour 1 : « Situation suivante » prend l'aplat ET est ramenée dans l'écran.
      await expect(suivante).toHaveAttribute("data-plein", "");
      await expect(suivante).toBeInViewport({ ratio: 1, timeout: 2_000 });

      // Retour navigateur : fiche 2, puis le filtre. s26 liste et détail, tour 1 (mesures §2, historique) : le filtre ne
      // remplace plus l'entrée de la fiche 1 quand il la quitte (il en ajoute une) ; s'il la garde, son adresse porte le
      // filtre. Dans les deux cas, la fiche 1 reste dans l'historique.
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id2}\\?ou=${lieu}$`));
      await page.goBack();
      await expect(page).toHaveURL(apresFiltre);
      if (!new URL(apresFiltre).pathname.endsWith(`/${id1}`)) {
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      }
    });
  }

  test("sous 1024 (375) : fiche plein écran, « Retour » et retour navigateur, scrollY de la liste à 8 px près", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(LISTE);
    await expect(page.locator("[data-colonne-liste]")).toBeHidden();
    const liens = page.locator("[data-mode='page'] [data-etat='liste'] a[data-fiche]");
    const cible = liens.nth(6);
    await cible.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 40));
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(200);

    // « Retour » de la fiche : router.back(), position restaurée.
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    await expect(page.locator("main [data-lien-retour]")).toBeVisible();
    await page.locator("main [data-lien-retour]").click();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y - 9);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(8);

    // Retour du navigateur : même règle.
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y - 9);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(8);
  });

  test("308 de l'ancienne adresse (espace ouvert) ; non-abonné sur une fiche : 307 vers l'aperçu de la liste", async ({ page }) => {
    const ancienne = await page.request.get("/mon-espace/fiche/situation/coloc-la-poele?ou=coloc", { maxRedirects: 0 });
    expect(ancienne.status()).toBe(308);
    expect(new URL(ancienne.headers()["location"], "http://x").pathname + new URL(ancienne.headers()["location"], "http://x").search).toBe(`${LISTE}/coloc-la-poele?ou=coloc`);
    const visiteur = await page.request.get(`${LISTE}/coloc-la-poele`, { maxRedirects: 0 });
    expect(visiteur.status()).toBe(307);
    expect(new URL(visiteur.headers()["location"], "http://x").pathname).toBe(LISTE);
    // Abonné, adresse partagée ouverte à froid : liste et fiche, sans erreur ni 404.
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    const r = await page.goto(`${LISTE}/coloc-la-poele`);
    expect(r?.status()).toBe(200);
    await expect(page.locator("[data-fiche-panneau='coloc-la-poele'] h1")).toBeVisible();
    await expect(actives(page)).toHaveAttribute("data-ligne-qr", "coloc-la-poele");
    // s26 liste et détail, tour 1 (mesures §6) : id inconnu pour l'abonné, vrai 404 de statut (plus un 200 « introuvable »).
    expect((await page.goto(`${LISTE}/inexistant-xyz`))?.status(), "id inconnu : 404").toBe(404);
  });

  // s26 liste et détail, tour 1 (spec UX §1, mesures §7) : visiteur, clic sur une tuile fermée de l'aperçu : contour de la
  // carte d'offre (ramenée dans l'écran si besoin), aucune navigation, extrait toujours sans élément focusable.
  for (const [largeur, hauteur] of [[375, 812], [768, 1024], [1280, 900], [1920, 1080]] as const) {
    test(`aperçu (${largeur}) : tuile fermée -> contour sur la carte d'offre, sans navigation`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(LISTE);
      const tuile = page.locator("[data-apercu-extrait] [data-tuile-fermee='']:visible").first();
      await tuile.scrollIntoViewIfNeeded();
      const b = (await tuile.boundingBox())!;
      const adresse = page.url();
      await page.mouse.click(b.x + b.width / 2, b.y + Math.min(b.height / 2, 40));
      const carte = page.locator("[data-apercu-hero] [data-apercu-offre]");
      await expect(carte).toHaveAttribute("data-signal", "", { timeout: 1_500 });
      await expect(carte).toBeInViewport({ ratio: 1 });
      expect(page.url()).toBe(adresse);
      await expect(page.locator("[data-apercu-extrait] > [aria-hidden='true']")).toHaveCount(1);
      expect(await page.locator("[data-apercu-extrait] > [aria-hidden='true']").evaluate((e) => e.querySelectorAll("a, button, input, textarea, select, [tabindex]").length)).toBe(0);
    });
  }
});
