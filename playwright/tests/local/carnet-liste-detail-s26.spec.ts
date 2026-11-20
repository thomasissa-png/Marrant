import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3 et §4 ; DA de l'accueil, Thomas 20/11). Serveur construit
 * interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ; fermé, /carnet garde `CarnetPage` (specs `carnet-g5-s24`,
 * `mesure-source-carnet-s21`) et `/carnet/<mois>/<n>` est la 404.
 * - en-tête : « Carnet de novembre », ligne d'usage, mois ET année (« novembre 2026 ») ;
 * - abonné dès 1024 : liste collante à gauche et fiche à droite, filtre par contexte (effectifs), une fiche ouverte
 *   depuis la liste : MÊME nœud de liste, `scrollTop` gardé, une seule ligne `aria-current`, « Situation n sur 30 »,
 *   « Situation suivante » dans le filtre, focus au titre de la fiche ;
 * - abonné à 375 : page liste OU fiche plein écran, « Retour » (historique) et retour du navigateur, position à 8 px ;
 * - visiteur : fiche offerte « sur 30 », titres fermés, offre (un seul bouton plein), 307 d'une adresse de fiche.
 */
const MOT_DE_PASSE = "E2e-carnet-liste-detail-s26";

async function abonne(page: Page) {
  const email = `e2e-carnet-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

const liste = (page: Page) => page.locator("[data-carnet-liste]");
const corps = (page: Page) => liste(page).locator("[data-liste-corps]");
const marquer = (page: Page) => liste(page).evaluate((n) => ((n as HTMLElement & { __marque?: number }).__marque = 26));
const marque = (page: Page) => liste(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque);
/** Aplats violets pleins visibles (boutons et liens) : fond opaque d'une teinte violette. */
const pleinsVisibles = (page: Page) =>
  page.locator("main a:visible, main button:visible").evaluateAll((els) =>
    els.filter((e) => {
      const r = e.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return false;
      const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(getComputedStyle(e).backgroundColor);
      return !!m && Number(m[4] ?? 1) === 1 && Number(m[3]) > 150 && Number(m[1]) > 80 && Number(m[2]) < 120;
    }).length,
  );

test.describe("Carnet, liste et détail (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  test("abonné à 1280 : en-tête daté, filtre par contexte, fiche à droite, liste gardée, « Situation n sur 30 »", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/carnet");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Carnet de novembre");
    await expect(page.locator("time[data-carnet-mois-annee]")).toHaveText("novembre 2026");
    await expect(page.locator("[data-carnet-usage]")).toBeVisible();
    // Liste à gauche, fiche n° 1 à droite, côte à côte.
    const [bl, bp] = [await liste(page).boundingBox(), await page.locator("[data-carnet-panneau]").boundingBox()];
    expect(bl!.x + bl!.width).toBeLessThan(bp!.x);
    expect(Math.abs(bl!.y - bp!.y), "liste et fiche au même haut").toBeLessThanOrEqual(1);
    await expect(page.locator("[data-carnet-panneau]")).toHaveAttribute("data-carnet-panneau", "1");
    await expect(page.locator("[data-carnet-numero]")).toHaveText("Situation 1 sur 30");
    expect(await pleinsVisibles(page), "aucun bouton plein chez l'abonné").toBe(0);

    // Filtre « boulot » : effectif lu sur la pastille = lignes affichées ; adresse remplacée, fiche du filtre à droite.
    const pastille = liste(page).locator("[data-filtre-contexte='boulot']");
    const effectif = Number((await pastille.innerText()).replace(/\D/g, ""));
    await pastille.click();
    await expect(page).toHaveURL(/\/carnet\?contexte=boulot$/);
    await expect(liste(page).locator("a[data-ligne]")).toHaveCount(effectif);
    await expect(page.locator("[data-carnet-pastilles]")).toContainText("boulot");
    await marquer(page);

    // Fiche ouverte depuis la liste : même nœud, scrollTop gardé, une seule ligne active, focus au titre.
    await corps(page).evaluate((c) => (c.scrollTop = 40));
    const avant = await corps(page).evaluate((c) => c.scrollTop);
    const ligne = liste(page).locator("a[data-ligne]").nth(1);
    const n = await ligne.getAttribute("data-ligne");
    await ligne.click();
    await expect(page).toHaveURL(new RegExp(`/carnet/2026-11/${n}\\?contexte=boulot$`));
    await expect(page.locator("[data-carnet-panneau]")).toHaveAttribute("data-carnet-panneau", n!);
    await expect(page.locator("[data-carnet-numero]")).toHaveText(`Situation ${n} sur 30`);
    expect(await marque(page), "même nœud de liste").toBe(26);
    expect(Math.abs((await corps(page).evaluate((c) => c.scrollTop)) - avant)).toBeLessThanOrEqual(1);
    await expect(liste(page).locator("a[aria-current='page']")).toHaveCount(1);
    await expect(liste(page).locator("a[aria-current='page']")).toHaveAttribute("data-ligne", n!);
    await expect(page.locator("#carnet-fiche-titre")).toBeFocused();

    // « Situation suivante » : la suivante du filtre, liste toujours montée.
    const suivante = page.locator("[data-situation-suivante]");
    const m = await suivante.getAttribute("data-situation-suivante");
    await suivante.click();
    await expect(page.locator("[data-carnet-panneau]")).toHaveAttribute("data-carnet-panneau", m!);
    await expect(liste(page).locator("a[aria-current='page']")).toHaveAttribute("data-ligne", m!);
    expect(await marque(page)).toBe(26);
  });

  test("abonné à 375 : liste OU fiche, « Retour » et retour du navigateur à la position quittée", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/carnet");
    await expect(page.locator("time[data-carnet-mois-annee]")).toHaveText("novembre 2026");
    await expect(page.locator("[data-carnet-panneau]")).toBeHidden();
    const ligne = liste(page).locator("a[data-ligne='20']");
    await ligne.scrollIntoViewIfNeeded();
    // s26 CI : défilement instantané (`html` est en `scroll-behavior: smooth` ; le Chromium de la CI l'anime, `scrollY`
    // lu juste après valait encore la position d'avant, 60 px sous celle du clic).
    await page.evaluate(() => window.scrollBy({ top: 60, behavior: "instant" }));
    const y = await page.evaluate(() => window.scrollY);
    await ligne.click();
    await expect(page).toHaveURL(/\/carnet\/2026-11\/20$/);
    await expect(page.locator("[data-carnet-panneau]")).toBeVisible();
    await expect(liste(page)).toBeHidden();
    await expect(page.locator("[data-carnet-numero]")).toHaveText("Situation 20 sur 30");
    // « Retour » : historique (la liste revient à sa position).
    await page.locator("[data-lien-retour]").click();
    await expect(page).toHaveURL(/\/carnet$/);
    await expect(liste(page)).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y - 9);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y), "position rendue à 8 px").toBeLessThanOrEqual(8);
    // Retour du navigateur : même position.
    await liste(page).locator("a[data-ligne='20']").click();
    await expect(page).toHaveURL(/\/carnet\/2026-11\/20$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/carnet$/);
    await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(8);
  });

  test("visiteur : en-tête daté, fiche offerte « sur 30 », titres fermés, offre ; adresse de fiche en 307", async ({ page }) => {
    for (const [l, h] of [[1280, 900], [375, 812]] as const) {
      await page.setViewportSize({ width: l, height: h });
      await page.goto("/carnet");
      await expect(page.locator("time[data-carnet-mois-annee]")).toHaveText("novembre 2026");
      await expect(page.locator("[data-carnet-fiche]")).toHaveCount(1);
      await expect(page.locator("[data-carnet-numero]")).toHaveText("Situation 10 sur 30, offerte");
      await expect(page.locator("[data-carnet-programme] li")).toHaveCount(3);
      await expect(page.getByTestId("carnet-paywall-bouton")).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
      await expect(page.locator("[data-carnet-liste]")).toHaveCount(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      expect(await pleinsVisibles(page), `un seul bouton plein dans le premier écran (${l})`).toBeLessThanOrEqual(1);
    }
    const reponse = await page.request.get("/carnet/2026-11/7", { maxRedirects: 0 });
    expect(reponse.status()).toBe(307);
    expect(reponse.headers()["location"]).toMatch(/\/carnet$/);
    expect((await page.request.get("/carnet/2026-11/31", { maxRedirects: 0 })).status()).toBe(404);
  });
});
