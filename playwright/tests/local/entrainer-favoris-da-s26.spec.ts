import type { Page } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 DA, s'entraîner et favoris (décisions de Thomas des 19/11 et 20/11 : « dès qu'on clique ça change la page ;
 * pourquoi on ne garde pas le menu à gauche ? », « la DA, c'est celle des pages déjà validées, avec du violet »).
 * Serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ; fermé, /favoris garde son rendu d'avant (inertie).
 * - Favoris (abonné) : dès 1024, la liste groupée par type reste à gauche (même nœud, collante) et le favori ouvert
 *   change à droite (`?favori=<id>`, une entrée d'historique) ; sous 1024, la liste OU le favori, « Retour » et retour
 *   navigateur rendent la position de la liste (8 px près) ;
 * - à 1280, aucun vide de plus de 32 px : sous la liste (bas du détail ou de l'écran) et en fin de carte du détail ;
 *   S'entraîner : bas des deux colonnes à 32 px près, aucune carte qui finit à plus de 32 px sous son dernier bloc.
 * Mesures écrites dans la sortie (`console.log`) pour le rapport.
 */
const MOT_DE_PASSE = "E2e-entrainer-favoris-s26";
const CAPTURES = process.env.E2E_CAPTURES_ENTRAINER_FAVORIS;

async function abonne(page: Page, favoris: boolean) {
  const email = `e2e-fav-s26-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  if (favoris) {
    const [u] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
    const jokes = await requete<{ id: string }>(`SELECT id FROM "Joke" ORDER BY id LIMIT 3`);
    const tips = await requete<{ id: string }>(`SELECT id FROM "Tip" ORDER BY id LIMIT 2`);
    const videos = await requete<{ id: string }>(`SELECT id FROM "Video" ORDER BY id LIMIT 2`);
    const lignes = [
      ...jokes.map((j) => ["JOKE", j.id, null, null]),
      ...tips.map((t) => ["TIP", null, t.id, null]),
      ...videos.map((v) => ["VIDEO", null, null, v.id]),
    ];
    for (const [i, [type, joke, tip, video]] of lignes.entries()) {
      await requete(
        `INSERT INTO "UserFavorite" (id, "userId", "contentType", "jokeId", "tipId", "videoId", "createdAt")
         VALUES ($1, $2, $3::"ContentType", $4, $5, $6, now() - ($7 || ' minutes')::interval)`,
        [`e2efav${randomBytes(8).toString("hex")}`, u.id, type, joke, tip, video, String(i)],
      );
    }
  }
  await connecter(page, email, MOT_DE_PASSE);
}

async function capturer(page: Page, nom: string, largeur: number) {
  if (CAPTURES) await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png`, fullPage: false });
}

/** Vide de fin d'une carte : bas intérieur (bord et marge retirés) moins le bas de son dernier enfant affiché. */
const videFinDeCarte = (page: Page, selecteur: string) =>
  page.locator(selecteur).evaluateAll((cartes) =>
    cartes
      .filter((c) => (c as HTMLElement).offsetParent !== null)
      .map((c) => {
        const s = getComputedStyle(c);
        const bas = c.getBoundingClientRect().bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom);
        const enfants = Array.from(c.querySelectorAll<HTMLElement>("*")).filter((e) => e.offsetParent !== null && e.getBoundingClientRect().height > 0);
        const dernier = Math.max(...enfants.map((e) => e.getBoundingClientRect().bottom));
        return Math.round(bas - dernier);
      }),
  );

const liste = (page: Page) => page.locator("[data-liste-favoris]");
const detail = (page: Page) => page.locator("[data-favori-detail]");

test.describe("s26 DA, s'entraîner et favoris", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const largeur of [1024, 1280]) {
    test(`Favoris dès 1024 (${largeur}) : liste gardée à gauche, le favori change à droite, retour navigateur`, async ({ page }) => {
      await abonne(page, true);
      await page.setViewportSize({ width: largeur, height: largeur === 1024 ? 768 : 900 });
      await page.goto("/favoris");
      await expect(liste(page)).toBeVisible();
      await expect(detail(page)).toBeVisible();
      // Groupés par type (ordre des onglets d'avant), une seule ligne active, le plus récent ouvert d'office.
      expect(await liste(page).locator("[data-groupe-favoris]").evaluateAll((g) => g.map((e) => e.getAttribute("data-groupe-favoris")))).toEqual(["JOKE", "TIP", "VIDEO"]);
      await expect(liste(page).locator("a[aria-current='page']")).toHaveCount(1);
      const premier = await liste(page).locator("a[aria-current='page']").getAttribute("data-ligne-favori");
      await expect(page.locator(`[data-favori-detail='${premier}']`)).toBeVisible();
      const [l0, d0] = [await liste(page).boundingBox(), await detail(page).boundingBox()];
      expect(Math.abs(l0!.y - d0!.y), "liste et détail partent à la même ligne").toBeLessThanOrEqual(1);
      expect(d0!.x, "détail à droite de la liste").toBeGreaterThan(l0!.x + l0!.width);
      await liste(page).evaluate((n) => ((n as HTMLElement & { __marque?: number }).__marque = 26));

      // Un conseil puis une vidéo : l'adresse porte le favori, le détail change, la liste reste le même nœud.
      for (const type of ["TIP", "VIDEO"]) {
        const ligne = liste(page).locator(`[data-groupe-favoris='${type}'] a[data-ligne-favori]`).first();
        const id = await ligne.getAttribute("data-ligne-favori");
        await ligne.click();
        await expect(page).toHaveURL(new RegExp(`/favoris\\?favori=${id}$`));
        await expect(page.locator(`[data-favori-detail='${id}']`)).toBeVisible();
        await expect(liste(page).locator("a[aria-current='page']")).toHaveAttribute("data-ligne-favori", id!);
        expect(await liste(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
        if (largeur === 1280 && type === "TIP") await capturer(page, "favoris-abonne", largeur);
      }
      // Liste collante : au défilement, son haut reste à 153 px (sous l'en-tête collant).
      await page.evaluate(() => window.scrollTo(0, 400));
      await expect.poll(async () => Math.round((await liste(page).boundingBox())!.y)).toBe(153);
      await page.evaluate(() => window.scrollTo(0, 0));
      // Retour navigateur : le conseil revient.
      await page.goBack();
      await expect(page).toHaveURL(/\/favoris\?favori=/);
      await expect(liste(page).locator("[data-groupe-favoris='TIP'] a[aria-current='page']")).toHaveCount(1);
    });
  }

  test("Favoris sous 1024 (375) : liste OU favori, « Retour » et retour navigateur rendent la position", async ({ page }) => {
    await abonne(page, true);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/favoris");
    await expect(liste(page)).toBeVisible();
    await expect(detail(page)).toBeHidden();
    const ligne = liste(page).locator("[data-groupe-favoris='VIDEO'] a[data-ligne-favori]").last();
    await ligne.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 40));
    const y = await page.evaluate(() => window.scrollY);
    expect(y, "la liste a défilé avant le clic").toBeGreaterThan(0);
    const id = await ligne.getAttribute("data-ligne-favori");
    for (const sortie of ["retour", "navigateur"] as const) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await ligne.click();
      await expect(page).toHaveURL(new RegExp(`/favoris\\?favori=${id}$`));
      await expect(page.locator(`[data-favori-detail='${id}']`)).toBeVisible();
      await expect(liste(page)).toBeHidden();
      if (sortie === "retour") await capturer(page, "favoris-detail-abonne", 375);
      if (sortie === "retour") await page.locator("[data-lien-retour]").click();
      else await page.goBack();
      await expect(page).toHaveURL(/\/favoris$/);
      await expect(liste(page)).toBeVisible();
      await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - y), { message: `position rendue (${sortie})` }).toBeLessThanOrEqual(8);
    }
  });

  test("Favoris à 1280 : aucun vide de plus de 32 px (sous la liste, en fin de carte du détail)", async ({ page }) => {
    await abonne(page, true);
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const type of ["JOKE", "TIP", "VIDEO"]) {
      await page.goto("/favoris");
      const ligne = liste(page).locator(`[data-groupe-favoris='${type}'] a[data-ligne-favori]`).first();
      await ligne.click();
      await expect(page.locator(`[data-favori-detail='${await ligne.getAttribute("data-ligne-favori")}']`)).toBeVisible();
      const m = await page.evaluate(() => {
        const l = document.querySelector("[data-liste-favoris]")!.getBoundingClientRect();
        const d = document.querySelector("[data-favori-detail]")!.getBoundingClientRect();
        return { sousListe: Math.round(Math.min(d.bottom, window.innerHeight - 24) - l.bottom) };
      });
      const fin = await videFinDeCarte(page, "[data-favori-detail]");
      console.log(`favoris 1280 ${type} : vide sous la liste ${m.sousListe} px, fin de carte ${fin.join(",")} px`);
      expect(m.sousListe, `vide sous la liste (${type})`).toBeLessThanOrEqual(32);
      expect(m.sousListe, `liste dans l'écran, pied visible (${type})`).toBeGreaterThanOrEqual(0);
      for (const v of fin) expect(v, `vide de fin de carte (${type})`).toBeLessThanOrEqual(32);
    }
  });

  test("S'entraîner à 1280 : bas des deux colonnes à 32 px près, aucune carte à vide de fin de plus de 32 px", async ({ page }) => {
    await abonne(page, false);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/mon-espace/s-entrainer");
    await expect(page.locator("[data-zone='mission']")).toBeVisible();
    await capturer(page, "s-entrainer-abonne", 1280);
    // Bas de la DERNIÈRE carte de chaque colonne (pas la boîte de la colonne, étirée par la grille).
    const bas = (zone: string) =>
      page.locator(`[data-zone='${zone}'] > *`).evaluateAll((e) => Math.round(Math.max(...e.filter((x) => (x as HTMLElement).offsetParent !== null).map((x) => x.getBoundingClientRect().bottom))));
    const [cartes, mission] = [await bas("cartes"), await bas("mission")];
    const ecart = Math.abs(cartes - mission);
    const fin = await videFinDeCarte(page, "[data-zone] > article, [data-zone] > section, [data-zone] > div, [data-zone] > details[open]");
    // Lignes de l'échelle (44 px au moins) : le surplus partagé ne doit pas en faire des vides.
    const lignes = await page.locator("[data-echelle='liste'] a").evaluateAll((a) => a.map((x) => Math.round(x.getBoundingClientRect().height)));
    console.log(`s-entrainer 1280 : bas des cartes ${cartes}, bas de la mission ${mission}, écart ${ecart} px, fins de carte ${fin.join(",")} px, lignes de l'échelle ${lignes.join(",")} px`);
    expect(ecart, "bas des deux colonnes").toBeLessThanOrEqual(32);
    for (const v of fin) expect(v, "vide de fin de carte").toBeLessThanOrEqual(32);
    for (const h of lignes) expect(h - 44, "air ajouté à une ligne de l'échelle").toBeLessThanOrEqual(32);
  });

  test("S'entraîner à 375 : capture de l'abonné", async ({ page }) => {
    test.skip(!CAPTURES, "captures seulement");
    await abonne(page, false);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/mon-espace/s-entrainer");
    await expect(page.locator("[data-zone='mission']")).toBeVisible();
    await capturer(page, "s-entrainer-abonne", 375);
  });
});
