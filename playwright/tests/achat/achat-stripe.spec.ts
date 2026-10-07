import { test, expect } from "@playwright/test";
import {
  CARTES,
  abonnementsStripe,
  adresseUnique,
  attendrePlan,
  inscriptionJusquAuCheckout,
  nettoyerStripe,
  payerSurCheckout,
  raisonDeSkipAchat,
  validerTroisDS,
} from "../support/stripe-test";

/**
 * Parcours complet @achat (J2, J5, J6) sur un ENVIRONNEMENT DE TEST, jamais la prod.
 * Prérequis côté environnement : clés Stripe de mode test, webhook Stripe branché
 * (Stripe CLI `stripe listen --forward-to <url>/api/stripe/webhook` ou endpoint de
 * test), portail client configuré (résiliation activée), Resend en clé de test.
 * Skippé tout seul si les conditions de support/stripe-test.ts ne sont pas réunies.
 */
const raison = raisonDeSkipAchat();
const adressesCreees: string[] = [];

test.describe("Achat Premium de bout en bout @achat", () => {
  test.skip(!!raison, raison ?? "");
  test.describe.configure({ mode: "serial" });
  test.afterAll(async () => {
    if (!raison) await nettoyerStripe(adressesCreees);
  });

  test.describe("carte 4242 : achat, Premium, profil, portail, résiliation, suppression", () => {
    const email = adresseUnique("mensuel");
    adressesCreees.push(email);
    let page: import("@playwright/test").Page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage({ locale: "fr-FR" });
    });
    test.afterAll(async () => page?.close());

    test("création de compte puis Checkout Stripe test, carte 4242", async () => {
      await inscriptionJusquAuCheckout(page, email, "monthly");
      await expect(page.locator("#email")).toHaveValue(email);
      await expect(page.getByText(/2,99/).first()).toBeVisible();
      await payerSurCheckout(page, CARTES.ok);
      await page.waitForURL(/\/abonnement\/success\?session_id=cs_test_/, { timeout: 60_000 });
      await expect(page.getByRole("heading", { name: "Paiement reçu !" })).toBeVisible({ timeout: 45_000 });
    });

    test("Premium effectif : statut, étape 2 servie en entier et ouverte", async () => {
      await attendrePlan(page, "PREMIUM");
      const statut = await (await page.request.get("/api/stripe/status")).json();
      expect(statut).toMatchObject({ subscriptionStatus: "ACTIVE", billingInterval: "month", priceAmountCents: 299 });

      const api = await (await page.request.get("/api/parcours/by-slug/machine-a-cafe")).json();
      const etape2 = api.path.steps.find((s: { order: number }) => s.order === 2);
      expect(etape2.locked ?? false).toBe(false);
      const fait = await page.request.post(`/api/parcours/${api.path.id}/progress`, { data: { stepOrder: 1 } });
      expect(fait.ok()).toBeTruthy();

      await page.goto("/parcours/machine-a-cafe");
      const entete2 = page.getByRole("button", { name: /^Étape 2 :/ });
      if ((await entete2.getAttribute("aria-expanded")) !== "true") await entete2.click();
      await expect(page.getByText(/Cette étape fait partie de Premium/)).toHaveCount(0);
      await expect(page.getByText("Pourquoi cette étape ?").first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Tout débloquer" })).toHaveCount(0);
    });

    test("profil : formule, prix et date du prochain prélèvement", async () => {
      await page.goto("/profil");
      await expect(page.getByText("Formule mensuelle")).toBeVisible();
      await expect(page.getByText(/2,99/).first()).toBeVisible();
      await expect(page.getByText(/Prochain prélèvement le \d{1,2} \S+ \d{4}/)).toBeVisible();
    });

    test("portail Stripe : ouverture puis retour", async () => {
      await page.goto("/profil");
      await page.getByRole("button", { name: "Gérer mon abonnement" }).click();
      await page.waitForURL(/billing\.stripe\.com/, { timeout: 30_000 });
      await expect(page.getByText(/2,99/).first()).toBeVisible();
      await page.goto("/profil");
    });

    test("résiliation par le portail : Premium gardé jusqu'à l'échéance", async () => {
      await page.goto("/profil");
      await page.getByRole("button", { name: /Résilier (ton contrat|mon abonnement)/ }).click();
      await page.waitForURL(/billing\.stripe\.com/, { timeout: 30_000 });
      await page.getByRole("button", { name: /Annuler l'abonnement|Confirmer l'annulation|Cancel subscription/i }).click();
      const passer = page.getByRole("button", { name: /Ignorer|Passer|Skip|No thanks/i });
      if (await passer.isVisible({ timeout: 5_000 }).catch(() => false)) await passer.click();

      await expect
        .poll(async () => (await abonnementsStripe(email))[0]?.cancel_at_period_end, { timeout: 30_000 })
        .toBe(true);
      await expect
        .poll(async () => (await (await page.request.get("/api/stripe/status")).json()).cancelAtPeriodEnd, { timeout: 60_000, intervals: [2_000] })
        .toBe(true);
      await page.goto("/profil");
      await expect(page.getByText(/Premium jusqu'au \d{1,2} \S+ \d{4}/)).toBeVisible();
      await attendrePlan(page, "PREMIUM", 5_000);
    });

    test("suppression du compte : mot SUPPRIMER, abonnement résilié tout de suite", async () => {
      await page.goto("/profil");
      await page.getByRole("button", { name: "Supprimer mon compte" }).click();
      await page.locator("#confirmation-suppression").fill("supprimé");
      await page.getByRole("button", { name: "Supprimer définitivement" }).click();
      await expect(page.getByRole("alert")).toContainText("SUPPRIMER");

      await page.locator("#confirmation-suppression").fill("SUPPRIMER");
      await page.getByRole("button", { name: "Supprimer définitivement" }).click();
      await page.waitForURL((u) => u.pathname === "/", { timeout: 30_000 });
      expect((await page.request.get("/api/stripe/status")).status()).toBe(401);
      await expect.poll(async () => (await abonnementsStripe(email)).map((s) => s.status)).toEqual(["canceled"]);
    });
  });

  test("carte refusée 4000 0000 0000 0002 : message Stripe, aucun Premium", async ({ page }) => {
    const email = adresseUnique("refus");
    adressesCreees.push(email);
    await inscriptionJusquAuCheckout(page, email, "monthly");
    await payerSurCheckout(page, CARTES.refusee);
    await expect(page.getByText(/refusée|declined/i).first()).toBeVisible({ timeout: 30_000 });
    expect(page.url()).toMatch(/checkout\.stripe\.com/);

    await page.goto("/abonnement");
    await attendrePlan(page, "FREE", 10_000);
    expect((await abonnementsStripe(email)).filter((s) => s.status === "active")).toHaveLength(0);
    await supprimerCompte(page);
  });

  test("annuel avec 3D Secure 4000 0025 0000 3155 : défi validé, Premium annuel", async ({ page }) => {
    const email = adresseUnique("annuel-3ds");
    adressesCreees.push(email);
    await inscriptionJusquAuCheckout(page, email, "annual");
    await expect(page.getByText(/24,99/).first()).toBeVisible();
    await payerSurCheckout(page, CARTES.troisDS);
    await validerTroisDS(page);
    await page.waitForURL(/\/abonnement\/success\?session_id=cs_test_/, { timeout: 60_000 });
    await expect(page.getByRole("heading", { name: "Paiement reçu !" })).toBeVisible({ timeout: 45_000 });
    await attendrePlan(page, "PREMIUM");
    const statut = await (await page.request.get("/api/stripe/status")).json();
    expect(statut).toMatchObject({ billingInterval: "year", priceAmountCents: 2499 });

    // Déjà abonné : un second checkout est refusé (409), jamais de double abonnement.
    const doublon = await page.request.post("/api/stripe/checkout", { data: { plan: "annual" } });
    expect(doublon.status()).toBe(409);
    await supprimerCompte(page);
    await expect.poll(async () => (await abonnementsStripe(email)).map((s) => s.status)).toEqual(["canceled"]);
  });
});

async function supprimerCompte(page: import("@playwright/test").Page) {
  await page.goto("/profil");
  await page.getByRole("button", { name: "Supprimer mon compte" }).click();
  await page.locator("#confirmation-suppression").fill("SUPPRIMER");
  await page.getByRole("button", { name: "Supprimer définitivement" }).click();
  await page.waitForURL((u) => u.pathname === "/", { timeout: 30_000 });
}
