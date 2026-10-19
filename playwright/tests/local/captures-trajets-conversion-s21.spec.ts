import { randomBytes } from "node:crypto";
import path from "node:path";
import type { Locator, Page, Route } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * Captures du TRAJET ENCHAÎNÉ (grille docs/ux/trajet-conversion-s21.md §11), 375 × 812 : clic d'entrée,
 * /abonnement (premier écran et page complète), /register, puis l'écran juste avant Stripe (page
 * d'attente « Te voilà connecté. »). Stripe n'est pas capturable : `/api/stripe/checkout` est
 * intercepté et retenu le temps de la capture. Chaque trajet vérifie aussi que la source du clic
 * arrive jusqu'à `checkout-ouvert`.
 *
 * Sur demande seulement : `CAPTURES_TRAJETS=1` (jamais en CI). Sortie :
 * docs/design/conversion-s21/trajets-v1/ (un dossier par trajet).
 */
const SORTIE = path.join(__dirname, "..", "..", "..", "docs", "design", "conversion-s21", "trajets-v1");
const MDP = "MotDePasse-e2e-42";
const comptes: string[] = [];

type Evenement = { nom: string; donnees: Record<string, unknown> };

async function preparer(page: Page): Promise<() => void> {
  await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` });
  await page.addInitScript(() => {
    const faux = {
      track: (nom: string, donnees?: Record<string, unknown>) => {
        const liste = JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]");
        liste.push({ nom, donnees: donnees ?? {} });
        sessionStorage.setItem("e2e-umami", JSON.stringify(liste));
      },
    };
    Object.defineProperty(window, "umami", { get: () => faux, set: () => undefined, configurable: true });
  });
  // Paiement retenu jusqu'à la capture de l'écran d'avant Stripe.
  let liberer: () => void = () => undefined;
  const retenu = new Promise<void>((r) => (liberer = r));
  await page.route("**/api/stripe/checkout", async (route: Route) => {
    await retenu;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/?stripe-simule=1" }) });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  return () => liberer();
}

async function capture(page: Page, trajet: string, nom: string, pleine = false) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SORTIE, trajet, `${nom}.png`), fullPage: pleine, animations: "disabled" });
}

/** Met l'élément cliqué au centre de l'écran, cadre visible, puis capture. */
async function captureClic(page: Page, trajet: string, nom: string, cible: Locator) {
  await cible.scrollIntoViewIfNeeded();
  await cible.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await cible.evaluate((el) => ((el as HTMLElement).style.outline = "3px solid #F59E0B"));
  await capture(page, trajet, nom);
  await cible.evaluate((el) => ((el as HTMLElement).style.outline = ""));
}

async function abonnement(page: Page, trajet: string) {
  await expect(page).toHaveURL(/\/abonnement/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await capture(page, trajet, "02-abonnement-premier-ecran");
  await capture(page, trajet, "03-abonnement-complete", true);
}

/** /register, puis inscription ; l'écran d'avant Stripe est capturé, puis le paiement simulé part. */
async function inscription(page: Page, trajet: string, liberer: () => void, srcAttendue: string) {
  await expect(page).toHaveURL(/\/register\?/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await capture(page, trajet, "04-register");
  const email = `e2e-trajet-${randomBytes(4).toString("hex")}@example.com`;
  comptes.push(email);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(MDP);
  await page.getByRole("button", { name: /Créer mon compte/ }).click();
  await expect(page.getByTestId("abonnement-attente")).toBeVisible({ timeout: 30_000 });
  await capture(page, trajet, "05-avant-stripe");
  liberer();
  await page.waitForURL(/stripe-simule=1/, { timeout: 30_000 });
  const liste = (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as Evenement[];
  const ouvert = liste.filter((e) => e.nom === "checkout-ouvert");
  expect(ouvert, JSON.stringify(liste)).toHaveLength(1);
  expect(ouvert[0].donnees).toMatchObject({ src: srcAttendue, formule: "mensuel" });
}

test.describe("Captures des trajets de conversion s21 (375 px)", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_TRAJETS !== "1", "captures sur demande : CAPTURES_TRAJETS=1");
  test.setTimeout(120_000);

  test.afterAll(async () => {
    if (comptes.length) await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [comptes]);
  });

  test("T1 en-tête (visiteur)", async ({ page }) => {
    const liberer = await preparer(page);
    await page.goto("/conseils");
    const lien = page.getByRole("banner").locator("a[href='/abonnement?src=header']").filter({ visible: true }).first();
    await captureClic(page, "T1-en-tete", "01-entree-clic", lien);
    await lien.click();
    await abonnement(page, "T1-en-tete");
    await page.getByTestId("abonnement-bouton-achat").click();
    await inscription(page, "T1-en-tete", liberer, "header");
  });

  test("T2 mur de liste /vannes (visiteur)", async ({ page }) => {
    const liberer = await preparer(page);
    await page.goto("/vannes");
    const bouton = page.getByRole("link", { name: /^Voir la suite des vannes/ }).first();
    await captureClic(page, "T2-mur-vannes", "01-entree-clic", bouton);
    await bouton.click();
    await abonnement(page, "T2-mur-vannes");
    await page.getByTestId("abonnement-bouton-achat").click();
    await inscription(page, "T2-mur-vannes", liberer, "mur-vannes");
  });

  test("T3 fin d'étape 1 (visiteur)", async ({ page }) => {
    const liberer = await preparer(page);
    await page.goto("/parcours/repartie#etape-1");
    const etape1 = page.locator("#etape-1 [aria-expanded]").first();
    if ((await etape1.getAttribute("aria-expanded")) !== "true") await etape1.click();
    const bouton = page.getByRole("link", { name: /^Passer à l’étape 2/ }).first();
    await captureClic(page, "T3-fin-etape-1", "01-entree-clic", bouton);
    await bouton.click();
    await expect(page.getByTestId("register-rappel-offre")).toContainText("Après le paiement, l’étape 2 de Répartie s’ouvre.");
    await inscription(page, "T3-fin-etape-1", liberer, "parcours-etape");
  });

  test("T4 fenêtre Premium (visiteur, cœur d'une vanne de la liste)", async ({ page }) => {
    const liberer = await preparer(page);
    await page.goto("/vannes");
    const coeur = page.getByRole("button", { name: /Ajouter aux favoris/ }).first();
    await captureClic(page, "T4-fenetre-premium", "01-entree-clic", coeur);
    await coeur.click();
    const fenetre = page.getByRole("dialog");
    await expect(fenetre).toBeVisible();
    await capture(page, "T4-fenetre-premium", "02-fenetre");
    await fenetre.getByRole("link", { name: /^Je m’abonne/ }).click();
    await inscription(page, "T4-fenetre-premium", liberer, "modale-favoris");
  });

  test("T5 fin d'article (visiteur)", async ({ page }) => {
    const liberer = await preparer(page);
    await page.goto("/blog/meilleures-blagues-droles-2026");
    const lien = page.locator("a[data-blog-cta='abonnement']").first();
    const src = new URL(`http://x${(await lien.getAttribute("href")) ?? ""}`).searchParams.get("src") ?? "";
    await captureClic(page, "T5-fin-article", "01-entree-clic", lien);
    await lien.click();
    await abonnement(page, "T5-fin-article");
    await page.getByTestId("abonnement-bouton-achat").click();
    await inscription(page, "T5-fin-article", liberer, src);
  });

  for (const [trajet, depart, cible, src] of [
    ["C1-connecte-en-tete", "/conseils", "header", "header"],
    ["C2-connecte-mur-vannes", "/vannes", "mur", "mur-vannes"],
  ] as const) {
    test(`${trajet} (compte sans abonnement)`, async ({ page }) => {
      const email = `e2e-trajet-c-${randomBytes(4).toString("hex")}@example.com`;
      comptes.push(email);
      await creerCompte(email, MDP, "FREE");
      const liberer = await preparer(page);
      await connecter(page, email, MDP);
      await page.goto(depart);
      const lien =
        cible === "header"
          ? page.getByRole("banner").locator("a[href='/abonnement?src=header']").filter({ visible: true }).first()
          : page.getByRole("link", { name: /^Voir la suite des vannes/ }).first();
      await captureClic(page, trajet, "01-entree-clic", lien);
      await lien.click();
      await abonnement(page, trajet);
      await page.getByTestId("abonnement-bouton-haut").click();
      await expect(page.getByTestId("abonnement-bouton-haut")).toHaveText("On t’emmène au paiement…");
      await capture(page, trajet, "04-avant-stripe");
      liberer();
      await page.waitForURL(/stripe-simule=1/, { timeout: 30_000 });
      const liste = (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as Evenement[];
      expect(liste.filter((e) => e.nom === "checkout-ouvert")[0]?.donnees).toMatchObject({ src });
    });
  }

  test("/abonnement à 1 280 px (visiteur)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/abonnement?src=header");
    await capture(page, "desktop-1280", "abonnement-premier-ecran");
    await capture(page, "desktop-1280", "abonnement-complete", true);
  });
});
