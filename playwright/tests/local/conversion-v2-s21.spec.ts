import { randomBytes } from "node:crypto";
import type { Page, Route } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter, urlRetourStripeSimule, quitterRetourPaiement } from "../support/base-locale";

/**
 * Trajet de conversion s21, tour 2 (docs/copy/conversion-s21/textes-trajet-v2.md, arbitrages) :
 * 1. Favori après paiement, de bout en bout : étoile d'une vanne (visiteur, puis compte gratuit),
 *    fenêtre, /register, compte, paiement, retour : la vanne est dans les favoris (base ET étoile pleine).
 *    Paiement simulé comme dans les autres tests locaux (aucune clé Stripe) : `/api/stripe/checkout`
 *    est intercepté ; il fait ce que fait le webhook `checkout.session.completed` (plan PREMIUM en base)
 *    et renvoie la `success_url` exacte de `lib/stripe.ts` (`urlRetourStripeSimule`, même fonction que le serveur).
 *    La page de retour vérifie le plan par `/api/stripe/status` (vrai serveur, vraie base).
 * 2. Premier écran à 320 × 640 : « S'abonner · 1,99 €/mois » visible sans défiler (visiteur, connecté).
 * 3. « Annuel » choisi jusqu'à l'attente : ligne de renouvellement, /register, attente dans le bouton,
 *    corps du paiement, mesure ; page d'attente brève (connexion) avec la formule annuelle.
 */
const MDP = "MotDePasse-e2e-42";
const comptes: string[] = [];

async function visiteurSimule(page: Page) {
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
}

/** Paiement simulé : plan Premium en base (effet du webhook), puis la success_url de Stripe. */
async function paiementReussi(page: Page, email: () => string): Promise<{ corps: () => Record<string, string> }> {
  let corps: Record<string, string> = {};
  await page.route("**/api/stripe/checkout", async (route: Route) => {
    corps = JSON.parse(route.request().postData() ?? "{}");
    await requete(`UPDATE "User" SET plan = 'PREMIUM'::"Plan", "updatedAt" = now() WHERE email = $1`, [email()]);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: urlRetourStripeSimule(corps) }),
    });
  });
  return { corps: () => corps };
}

async function favorisEnBase(email: string): Promise<string[]> {
  const lignes = await requete<{ jokeId: string | null }>(
    `SELECT f."jokeId" FROM "UserFavorite" f JOIN "User" u ON u.id = f."userId" WHERE u.email = $1`,
    [email],
  );
  return lignes.map((l) => l.jokeId ?? "");
}

test.describe("@s21 trajet de conversion, tour 2", () => {
  localSeulement();
  test.setTimeout(120_000);

  test.afterAll(async () => {
    if (!comptes.length) return;
    await requete(`DELETE FROM "UserFavorite" WHERE "userId" IN (SELECT id FROM "User" WHERE email = ANY($1))`, [comptes]);
    await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [comptes]);
  });

  test("favori après paiement : visiteur, étoile d'une vanne → compte → paiement → vanne dans les favoris", async ({ page }) => {
    const email = `e2e-fav-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await visiteurSimule(page);
    const paiement = await paiementReussi(page, () => email);
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/vannes");
    // La liste se recharge après l'hydratation (API) : attendre qu'elle soit stable avant de viser l'étoile.
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Ajouter aux favoris (réservé Premium)" }).first().click();
    const fenetre = page.getByRole("dialog");
    await expect(fenetre.getByRole("heading", { name: /^Garde-.?la avec Premium$/ })).toBeVisible();
    await expect(fenetre.getByTestId("fenetre-rappel")).toBeVisible();
    await expect(fenetre).toContainText("D’abord ton compte, puis le paiement.");
    await fenetre.getByRole("link", { name: "S’abonner et la garder" }).click();

    await expect(page).toHaveURL(/\/register\?/);
    await expect(page.getByTestId("register-rappel-offre")).toContainText("Après le paiement, ta vanne est dans tes favoris.");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(MDP);
    await page.getByRole("button", { name: /Créer mon compte/ }).click();

    await quitterRetourPaiement(page);
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    const favori = new URLSearchParams(paiement.corps().returnTo.split("?")[1]).get("favori") ?? "";
    expect(favori).toMatch(/^JOKE\./);
    const jokeId = favori.slice("JOKE.".length);
    // L'identifiant ne reste jamais dans l'URL (seul le type, drapeau v3 de la bienvenue).
    expect(page.url()).not.toContain(`favori=${favori}`);
    expect(page.url()).not.toContain(jokeId);
    expect(new URL(page.url()).pathname).toBe("/vannes");
    expect(await favorisEnBase(email)).toEqual([jokeId]);
    await expect(page.getByText("Bienvenue dans Premium")).toBeVisible();
    // v3 BV3 : drapeau `favori=JOKE` posé seulement après un ajout réussi.
    expect(new URL(page.url()).searchParams.get("favori")).toBe("JOKE");
    await expect(page.getByTestId("bienvenue-texte")).toHaveText(/^Ta vanne est dans tes favoris\. Le reste est ouvert aussi\s:\sles listes, les parcours, les carnets\.$/);
    await expect(page.getByRole("button", { name: "Retirer des favoris" }).first()).toBeVisible({ timeout: 20_000 });
  });

  test("favori après paiement : compte gratuit connecté, même résultat (paiement direct)", async ({ page }) => {
    const email = `e2e-fav-c-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await creerCompte(email, MDP, "FREE");
    await visiteurSimule(page);
    await paiementReussi(page, () => email);
    await connecter(page, email, MDP);
    await page.goto("/vannes");
    // La liste se recharge après l'hydratation (API) : attendre qu'elle soit stable avant de viser l'étoile.
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Ajouter aux favoris (réservé Premium)" }).first().click();
    const fenetre = page.getByRole("dialog");
    await expect(fenetre).not.toContainText("D’abord ton compte");
    await fenetre.getByRole("button", { name: "S’abonner et la garder" }).click();
    await quitterRetourPaiement(page);
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    expect(await favorisEnBase(email)).toHaveLength(1);
    await expect(page.getByRole("button", { name: "Retirer des favoris" }).first()).toBeVisible({ timeout: 20_000 });
  });

  for (const [nom, chemin] of [
    ["en-tête", "/abonnement?src=header"],
    ["mur des vannes (accroche)", "/abonnement?src=mur-vannes"],
  ] as const) {
    test(`320 × 640, ${nom} : bouton d'achat dans le premier écran (visiteur et compte connecté)`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(chemin);
      const lien = page.getByTestId("abonnement-bouton-achat");
      await expect(lien).toBeVisible();
      const box = (await lien.boundingBox())!;
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(box.y + box.height, `bas du bouton (visiteur, ${nom})`).toBeLessThanOrEqual(640);
      console.log(`[320x640] visiteur ${nom} : bas du bouton à ${Math.round(box.y + box.height)} px`);

      const email = `e2e-320-${randomBytes(4).toString("hex")}@example.com`;
      comptes.push(email);
      await creerCompte(email, MDP, "FREE");
      await visiteurSimule(page);
      await connecter(page, email, MDP);
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(chemin);
      const bouton = page.getByTestId("abonnement-bouton-haut");
      await expect(bouton).toBeVisible();
      const b = (await bouton.boundingBox())!;
      expect(b.y + b.height, `bas du bouton (connecté, ${nom})`).toBeLessThanOrEqual(640);
    });
  }

  test("« Annuel » jusqu'au retour : renouvellement, /register, attente dans le bouton, plan=annual, abonnement-reussi annuel", async ({ page }) => {
    const email = `e2e-annuel-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await visiteurSimule(page);
    let liberer: () => void = () => undefined;
    const retenu = new Promise<void>((r) => (liberer = r));
    let corps: Record<string, string> = {};
    await page.route("**/api/stripe/checkout", async (route) => {
      corps = JSON.parse(route.request().postData() ?? "{}");
      await retenu;
      // Effet du webhook, puis la success_url exacte de lib/stripe.ts (`formule=annuel` compris, QA m4).
      await requete(`UPDATE "User" SET plan = 'PREMIUM'::"Plan" WHERE email = $1`, [email]);
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: urlRetourStripeSimule(corps) }) });
    });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/abonnement?src=header");
    // v3 M2 : le renouvellement est dans la carte Annuel, en permanence.
    await expect(page.getByTestId("formule-annual").getByTestId("renouvellement-annuel")).toBeVisible();
    await page.getByTestId("formule-annual").click();
    await expect(page.getByTestId("renouvellement-annuel")).toHaveText("Renouvelé chaque année, sauf résiliation.");
    await expect(page.getByTestId("abonnement-bouton-achat")).toHaveText(/^S’abonner\s·\s16,99\s€\/an$/);
    await page.getByTestId("abonnement-bouton-achat").click();
    await expect(page.getByTestId("register-rappel-offre")).toHaveText(
      /^Premium, 16,99\s€\/an, renouvelé chaque année, sauf résiliation\. Après le paiement, tout s’ouvre\.$/,
    );
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(MDP);
    await page.getByRole("button", { name: /Créer mon compte/ }).click();
    await expect(page.getByTestId("register-bouton")).toHaveText("On t’emmène au paiement…", { timeout: 30_000 });
    await expect(page.getByTestId("abonnement-attente")).toHaveCount(0);
    expect(corps).toMatchObject({ plan: "annual" });
    expect(urlRetourStripeSimule(corps)).toMatch(/&formule=annuel$/);
    liberer();
    await quitterRetourPaiement(page);
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    await expect(page.getByText("Bienvenue dans Premium")).toBeVisible();
    const liste = (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as { nom: string; donnees: Record<string, unknown> }[];
    expect(liste.filter((e) => e.nom === "checkout-ouvert").map((e) => e.donnees)).toEqual([{ src: "header", formule: "annuel" }]);
    await expect
      .poll(async () => ((await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as { nom: string; donnees: Record<string, unknown> }[]).filter((e) => e.nom === "abonnement-reussi").map((e) => e.donnees))
      .toEqual([{ formule: "annuel" }]);
  });

  test("page d'attente brève (connexion, annuel) : formule annuelle, sans pied de page visible", async ({ page }) => {
    const email = `e2e-attente-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await creerCompte(email, MDP, "FREE");
    await visiteurSimule(page);
    await page.route("**/api/stripe/checkout", () => new Promise(() => undefined));
    await connecter(page, email, MDP);
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/abonnement?plan=annual&src=header&auto=1");
    const attente = page.getByTestId("abonnement-attente");
    await expect(attente).toBeVisible();
    await expect(page.getByTestId("abonnement-attente-formule")).toHaveText(/^Premium, 16,99\s€\/an, renouvelé chaque année, sauf résiliation\.$/);
    await expect(attente).toContainText("Dernière étape.");
    await expect(attente).toContainText("On t’emmène au paiement sécurisé par Stripe…");
    // Le panneau couvre tout sous l'en-tête : le pied de page n'est pas visible.
    const box = (await attente.boundingBox())!;
    expect(box.y + box.height).toBeGreaterThanOrEqual(639);
  });
});
