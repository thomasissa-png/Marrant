import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 bibliothèque liste et détail (modèle : le pilote de Quoi répondre, `espace-liste-detail-s26.spec.ts`). Serveur
 * construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ; fermé, ces adresses sont la 404 (inertie).
 * - dès 1024 : 3 techniques lues en 5 clics au plus (ligne, ligne, « Voir : … »), la liste reste le MÊME nœud, son
 *   `scrollTop` est gardé, une seule ligne `aria-current` ; retour navigateur fiche par fiche ;
 * - sous 1024 : page liste, fiche plein écran, « Retour » (`router.back()`) avec position restaurée et ligne repérée ;
 * - 308 de l'ancienne adresse (espace ouvert), 307 du non-abonné vers l'aperçu ; aucun texte en capitales dans `main`.
 * `E2E_CAPTURES_BIB` : dossier des 4 captures (1280 et 375, abonné et visiteur).
 */
const MOT_DE_PASSE = "E2e-bibliotheque-s26";
const LISTE = "/mon-espace/bibliotheque";
const CAPTURES = process.env.E2E_CAPTURES_BIB ?? "";

async function abonne(page: Page) {
  const email = `e2e-bib-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

const colonne = (page: Page) => page.locator("[data-colonne-liste]");
const actives = (page: Page) => colonne(page).locator("a[aria-current='page']");

/** Éléments visibles de `main` en capitales (CSS `text-transform: uppercase` sur un texte non vide). */
const capitales = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("main *"))
      .filter((e) => e.offsetParent !== null && getComputedStyle(e).textTransform === "uppercase" && (e.textContent ?? "").trim() !== "")
      .map((e) => (e.textContent ?? "").trim().slice(0, 40)),
  );

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(CAPTURES, `${nom}.png`), fullPage: true });
}

test.describe("Bibliothèque, liste et détail (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const largeur of [1024, 1280]) {
    test(`dès 1024 (${largeur}) : 3 techniques en 5 clics au plus, liste montée, scrollTop gardé, retour navigateur`, async ({ page }) => {
      await abonne(page);
      await page.setViewportSize({ width: largeur, height: largeur === 1024 ? 768 : 900 });
      await page.goto(LISTE);
      // Panneau d'office : une technique ouverte (H1) dès le chargement, sa ligne active, l'adresse ne change pas.
      await expect(page.locator("[data-mode='panneau'] h1#fiche-titre")).toBeVisible();
      await expect(actives(page)).toHaveCount(1);
      expect(new URL(page.url()).pathname).toBe(LISTE);
      // Modèle de Quoi répondre : bandeau violet, émoji 💡, pastille violette « Bibliothèque ».
      await expect(page.locator("[data-mode='panneau'] [data-carte-da]")).toContainText("Bibliothèque");
      expect(await capitales(page), "aucun texte en capitales dans main").toEqual([]);
      if (largeur === 1280) await capturer(page, "bibliotheque-abonne-1280");
      await colonne(page).evaluate((n) => ((n as HTMLElement & { __marque?: number }).__marque = 26));
      let clics = 0;

      const corps = page.locator("[data-liste-corps]");
      const visibleNonActive = (exclure: string[]) =>
        corps.evaluate((c, ex) => {
          const r = c.getBoundingClientRect();
          // Après la dernière ligne exclue (ordre de la liste) : « suivante » mène alors à une troisième technique.
          const toutes = Array.from(c.querySelectorAll<HTMLElement>("a[data-ligne-bib]"));
          const depart = Math.max(-1, ...ex.map((x) => toutes.findIndex((a) => a.dataset.ligneBib === x)));
          const l = toutes.slice(depart + 1).find((a) => {
            const b = a.getBoundingClientRect();
            return !a.hasAttribute("aria-current") && b.top >= r.top && b.bottom <= r.bottom && a.getAttribute("href")?.startsWith("/mon-espace/bibliotheque/");
          });
          return l?.dataset.ligneBib ?? "";
        }, exclure);

      // Clic 1 : une ligne visible, après avoir fait défiler la liste (son scrollTop doit rester).
      await corps.evaluate((c) => (c.scrollTop = 120));
      const avant = await corps.evaluate((c) => c.scrollTop);
      const id1 = await visibleNonActive([]);
      expect(id1).not.toBe("");
      await colonne(page).locator(`a[data-ligne-bib='${id1}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      await expect(page.locator(`[data-fiche-panneau='${id1}'] h1`)).toBeVisible();
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
      expect(await corps.evaluate((c) => c.scrollTop), "scrollTop de la liste gardé").toBe(avant);
      await expect(actives(page)).toHaveCount(1);
      await expect(actives(page)).toHaveAttribute("data-ligne-bib", id1);
      await expect(page.locator("#fiche-titre")).toBeFocused();

      // Clic 2 : une autre technique de la liste.
      const avant2 = await corps.evaluate((c) => c.scrollTop);
      const id2 = await visibleNonActive([id1]);
      expect(["", id1]).not.toContain(id2);
      await colonne(page).locator(`a[data-ligne-bib='${id2}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id2}$`));
      await expect(page.locator(`[data-fiche-panneau='${id2}'] h1`)).toBeVisible();
      expect(await corps.evaluate((c) => c.scrollTop), "scrollTop de la liste gardé").toBe(avant2);
      await expect(actives(page)).toHaveCount(1);

      // Clic 3 : « Voir : {suivante} » (contour avant « Fait »), la prochaine non faite après la fiche.
      const suivante = page.locator("[data-fiche-suivante]");
      await expect(suivante).not.toHaveAttribute("data-plein", "");
      const href3 = (await suivante.getAttribute("href"))!;
      const id3 = href3.split("/").pop()!;
      expect([id1, id2]).not.toContain(id3);
      await suivante.click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id3}$`));
      await expect(page.locator(`[data-fiche-panneau='${id3}'] h1`)).toBeVisible();
      await expect(actives(page)).toHaveAttribute("data-ligne-bib", id3);
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
      expect(clics, "3 techniques en 5 clics au plus").toBeLessThanOrEqual(5);
      // Un seul bouton violet plein par écran (aucun dans la liste) ; aucun texte en capitales.
      expect(await colonne(page).locator(".bg-accent-primary, .bg-accent-secondary-hover").count(), "aucun aplat dans la liste").toBe(0);
      const pleins = await page.locator("main a.bg-accent-secondary-hover:visible, main button.bg-accent-secondary-hover:visible, main a.bg-accent-primary:visible, main button.bg-accent-primary:visible").count();
      expect(pleins, "un seul bouton violet plein au plus").toBeLessThanOrEqual(1);
      expect(await capitales(page)).toEqual([]);

      // Retour navigateur : fiche 2, fiche 1, liste ; la liste reste montée.
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id2}$`));
      await expect(page.locator(`[data-fiche-panneau='${id2}'] h1`)).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
    });
  }

  test("sous 1024 (375) : fiche plein écran, « Retour » et retour navigateur, position restaurée et ligne repérée", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(LISTE);
    await expect(page.locator("[data-colonne-liste]")).toBeHidden();
    expect(await capitales(page)).toEqual([]);
    await capturer(page, "bibliotheque-abonne-375");
    const liens = page.locator("[data-mode='page'] [data-etat='liste'] a[data-fiche][href^='/mon-espace/bibliotheque/']");
    const cible = liens.nth(16);
    await cible.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 40));
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(200);
    const ecartMax = 8 + 32;
    const scrollStable = () => page.evaluate(() => new Promise<number>((r) => { const a = window.scrollY; setTimeout(() => r(window.scrollY === a ? a : -1), 150); }));

    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    expect(await capitales(page)).toEqual([]);
    await page.locator("main [data-lien-retour]").click();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(scrollStable).toBeGreaterThan(y - ecartMax - 1);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(ecartMax);
    expect(await cible.getAttribute("data-ligne-reperee"), "ligne quittée repérée").toBe("");
    await expect(cible, "repère retiré après 1,5 s").not.toHaveAttribute("data-ligne-reperee", "", { timeout: 2_500 });

    // Retour du navigateur : même règle.
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(scrollStable).toBeGreaterThan(y - ecartMax - 1);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(ecartMax);
  });

  test("308 de l'ancienne adresse (espace ouvert) ; non-abonné sur une technique : 307 vers l'aperçu", async ({ page }) => {
    const ancienne = await page.request.get("/mon-espace/fiche/construction/le-faux-secret", { maxRedirects: 0 });
    expect(ancienne.status()).toBe(308);
    expect(new URL(ancienne.headers()["location"], "http://x").pathname).toBe(`${LISTE}/le-faux-secret`);
    const visiteur = await page.request.get(`${LISTE}/le-faux-secret`, { maxRedirects: 0 });
    expect(visiteur.status()).toBe(307);
    expect(new URL(visiteur.headers()["location"], "http://x").pathname).toBe(LISTE);
    // Aperçu du visiteur : sans « 1 500+ », sans capitales, un seul aplat (la carte d'offre du hero).
    for (const [l, h] of [[1280, 900], [375, 812]] as const) {
      await page.setViewportSize({ width: l, height: h });
      await page.goto(LISTE);
      await expect(page.locator("[data-apercu='bibliotheque']")).toBeVisible();
      expect(await page.locator("main").innerText()).not.toContain("1 500");
      expect(await capitales(page)).toEqual([]);
      await capturer(page, `bibliotheque-visiteur-${l}`);
    }
    // Abonné, adresse partagée ouverte à froid : liste et fiche, sans erreur ; technique inconnue : 404.
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    const r = await page.goto(`${LISTE}/le-faux-secret`);
    expect(r?.status()).toBe(200);
    await expect(page.locator("[data-fiche-panneau='le-faux-secret'] h1")).toBeVisible();
    await expect(actives(page)).toHaveAttribute("data-ligne-bib", "le-faux-secret");
    expect((await page.goto(`${LISTE}/n-existe-pas`))?.status()).toBe(404);
  });
});
