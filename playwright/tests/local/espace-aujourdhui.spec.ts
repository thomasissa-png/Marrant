import type { Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";

/**
 * Espace client, lot D3 (s24, plan §3) : « Aujourd'hui », arrivées après paiement et connexion,
 * toucher de la vanne. Interrupteur fermé (CI) : `/mon-espace` reste la 404 (spec D0) et la page de
 * succès reste celle d'aujourd'hui. `E2E_ESPACE_OUVERT=1` : serveur construit interrupteur OUVERT
 * (jamais le code livré, voir REPLIT_ACTIONS.md, s24 D2 et D3).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const MOT_DE_PASSE = "E2e-espace-aujourdhui-D3";

async function compte(browser: import("@playwright/test").Browser, plan: "FREE" | "PREMIUM"): Promise<{ email: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d3-${plan.toLowerCase()}-${Date.now().toString(36)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { email, cookies };
}

/** Haut (y) des éléments interactifs du contenu du jour, dans la page. */
const hautsContenuDuJour = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('section[aria-labelledby="jour-titre"] a, section[aria-labelledby="jour-titre"] button')).map(
      (e) => e.getBoundingClientRect().top + window.scrollY,
    ),
  );

test.describe("espace client, « Aujourd'hui » (s24, lot D3)", () => {
  localSeulement();

  test("interrupteur fermé : page de succès d'aujourd'hui, aucun appel à l'espace", async ({ page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    const appels: string[] = [];
    page.on("request", (r) => {
      if (/\/(api\/espace|mon-espace)/.test(r.url())) appels.push(r.url());
    });
    await page.route("**/api/stripe/status", (r) => r.fulfill({ json: { plan: "FREE" } }));
    await page.goto("/abonnement/success?session_id=cs_test&returnTo=%2Fparcours");
    await expect(page.getByRole("status")).toBeVisible();
    expect(appels).toEqual([]);
  });

  test.describe("abonné, interrupteur ouvert (copie de travail jetable)", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
    let cookies: Cookie[] = [];
    test.beforeAll(async ({ browser }) => {
      cookies = (await compte(browser, "PREMIUM")).cookies;
    });
    test.beforeEach(async ({ context }) => {
      await context.addCookies(cookies);
    });

    test("N4 à 375 x 812 : salutation et UN seul « Commencer » au premier écran, contenu du jour dessous", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace");
      await expect(page.getByRole("heading", { level: 1, name: T.titre })).toBeInViewport();
      const commencer = page.getByRole("link", { name: T.premierPas.bouton, exact: true });
      await expect(commencer).toHaveCount(1);
      await expect(commencer).toBeInViewport({ ratio: 1 });
      expect((await commencer.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      await expect(page.locator('section[data-etat="ok"], section[data-etat="erreur"]')).toHaveCount(1);
      for (const haut of await hautsContenuDuJour(page)) expect(haut).toBeGreaterThanOrEqual(812);
      await expect(page.locator('[data-source="defaut"] h2')).toHaveText(T.premierPas.sceneParDefaut);
    });

    test("N4 à 200 % de texte (188 x 406) : « Commencer » dans le premier écran, rien ne déborde", async ({ page }) => {
      await page.setViewportSize({ width: 188, height: 406 });
      await page.goto("/mon-espace");
      await expect(page.getByRole("link", { name: T.premierPas.bouton, exact: true })).toBeInViewport({ ratio: 1 });
      const largeur = await page.evaluate(() =>
        Math.max(...Array.from(document.querySelectorAll("main *")).map((e) => e.getBoundingClientRect().right)),
      );
      expect(largeur).toBeLessThanOrEqual(188 + 0.5);
    });

    test("premier pas : lien de retour d'une étape, gardé pour la visite suivante ; favori confirmé", async ({ page }) => {
      await page.goto(`/mon-espace?depuis=${encodeURIComponent("/parcours/repartie#etape-2")}&favori=JOKE`);
      const pas = page.locator('section[data-source="etape"]');
      await expect(pas).toBeVisible();
      await expect(pas.getByRole("link", { name: T.premierPas.bouton })).toHaveAttribute("href", "/parcours/repartie#etape-2");
      await expect(page.getByRole("status").filter({ hasText: BIENVENUE_PREMIUM.favori.JOKE.split(".")[0] })).toBeVisible();
      await page.goto("/mon-espace");
      await expect(page.locator('section[data-source="etape"]')).toBeVisible();
    });

    test("contenu du jour : chargement, erreur (portes du catalogue), succès", async ({ page }) => {
      let liberer: () => void = () => undefined;
      await page.route("**/api/daily", async (r) => {
        await new Promise<void>((ok) => (liberer = ok));
        await r.continue();
      });
      await page.goto("/mon-espace");
      await expect(page.locator('section[data-etat="chargement"]')).toBeVisible();
      liberer();
      await expect(page.locator('section[data-etat="ok"]')).toBeVisible();
      await page.unroute("**/api/daily");
      await page.route("**/api/daily", (r) => r.abort());
      await page.reload();
      const erreur = page.locator('section[data-etat="erreur"]');
      await expect(erreur).toBeVisible();
      await expect(erreur.getByRole("link", { name: T.jour.repli.vannes })).toHaveAttribute("href", "/vannes");
    });

    test("vanne : « Une autre » change la vanne, l'annonce, compte sans identité ; seuil non fixé = aucune puce", async ({ page }) => {
      const compteurs: unknown[] = [];
      page.on("request", (r) => {
        if (r.url().includes("/api/espace/compteur")) compteurs.push(r.postDataJSON());
      });
      await page.goto("/mon-espace");
      const carte = page.locator('article[aria-labelledby="jour-vanne"]');
      await expect(carte.locator("[data-vanne]")).toBeVisible();
      await expect(carte.getByRole("group")).toHaveCount(0);
      const avant = await carte.locator("[data-vanne]").getAttribute("data-vanne");
      await carte.getByRole("button", { name: T.jour.uneAutre }).click();
      await expect(carte.locator("[data-vanne]")).not.toHaveAttribute("data-vanne", avant ?? "");
      await expect(carte.locator('[aria-live="polite"]')).toHaveText(T.jour.annonceAutre);
      await expect.poll(() => compteurs).toContainEqual({ cle: "une-autre", valeur: "peu-importe" });
      expect(JSON.stringify(compteurs)).not.toMatch(/user|email|id/i);
    });

    test("ancres : la barre réserve sa hauteur en haut de page (revue D2, point e)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours/repartie");
      await expect(page.locator("[data-espace-barre]")).toBeVisible();
      await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toMatch(/^4[56]px$/);
    });

    test("page de succès : pas de « Continuer » sans preuve ; puis « Continuer » vers « Aujourd'hui », renonciation à 44 px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      let preuve = false;
      await page.route("**/api/stripe/status", (r) => r.fulfill({ json: { plan: preuve ? "PREMIUM" : "FREE" } }));
      await page.route("**/api/stripe/verify-session", (r) => r.fulfill({ status: 400, json: {} }));
      await page.goto(`/abonnement/success?session_id=cs_test&returnTo=${encodeURIComponent("/parcours/confiance#etape-2")}`);
      await expect(page.getByRole("status")).toBeVisible();
      await expect(page.getByRole("link", { name: "Continuer" })).toHaveCount(0);
      preuve = true;
      const continuer = page.getByRole("link", { name: "Continuer" });
      await expect(continuer).toBeVisible({ timeout: 15_000 });
      await expect(continuer).toHaveAttribute("href", "/mon-espace?depuis=%2Fparcours%2Fconfiance%23etape-2");
      const renoncer = page.locator("main").getByRole("link", { name: LIBELLE_RENONCER_CONTRAT });
      const b = await continuer.boundingBox();
      const r = await renoncer.boundingBox();
      expect(b?.height ?? 0).toBeGreaterThanOrEqual(48);
      expect(r?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect((r?.y ?? 0) - ((b?.y ?? 0) + (b?.height ?? 0))).toBeGreaterThanOrEqual(44);
      await page.waitForTimeout(2500);
      expect(new URL(page.url()).pathname).toBe("/abonnement/success");
    });
  });

  test("connexion sans page d'origine : abonné vers « Aujourd'hui », compte gratuit vers les vannes", async ({ browser }) => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis");
    for (const [plan, attendu] of [["PREMIUM", /\/mon-espace$/], ["FREE", /\/vannes$/]] as const) {
      const email = `e2e-espace-d3-cnx-${plan.toLowerCase()}-${Date.now().toString(36)}@example.com`;
      await creerCompte(email, MOT_DE_PASSE, plan);
      const contexte = await browser.newContext();
      const page = await contexte.newPage();
      await connecter(page, email, MOT_DE_PASSE);
      await expect(page).toHaveURL(attendu);
      await contexte.close();
    }
  });
});
