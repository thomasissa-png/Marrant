import type { Page } from "@playwright/test";
import { test, expect, estMobile, lireUrl } from "../support/fixtures";

/** J2 : page /abonnement, CTA mensuel et annuel, réassurance, retour annulé, en-tête. */

/** Radio natif masqué (sr-only) : on clique son libellé, comme un humain. */
async function choisirAnnuel(page: Page) {
  await page.locator("label").filter({ has: page.getByRole("radio", { name: "Annuel" }) }).click();
  await expect(page.getByRole("radio", { name: "Annuel" })).toBeChecked();
}

// Étalon 1.1 validé (lot E). Espace insécable avant « € » depuis s16 : `\s` accepte les deux.
const REASSURANCE = /2,99\s€ TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux\./;
const REASSURANCE_ANNUEL = /24,99\s€ TTC par an, remboursé sous 14 jours, résiliable en ligne quand tu veux\./;

test.describe("Offre /abonnement @smoke", () => {
  test("CTA mensuel « Commencer à 2,99 €/mois » → /register?callbackUrl=/abonnement&src=abonnement", async ({ page }) => {
    await page.goto("/abonnement");
    const cta = page.getByRole("link", { name: /^Commencer à 2,99/ });
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("callbackUrl")).toBe("/abonnement");
    expect(url.searchParams.get("src")).toBe("abonnement");

    await cta.click();
    await expect(page).toHaveURL(/\/register\?/);
    await expect(page.getByLabel(/e-?mail/i)).toBeVisible();
  });

  test("CTA annuel « Commencer à 24,99 €/an » → callbackUrl /abonnement?plan=annual, /register affiche l'annuel", async ({ page }) => {
    await page.goto("/abonnement");
    await choisirAnnuel(page);
    const cta = page.getByRole("link", { name: /^Commencer à 24,99/ });
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/register");
    const retour = lireUrl(url.searchParams.get("callbackUrl"));
    expect(retour.pathname).toBe("/abonnement");
    expect(retour.searchParams.get("plan")).toBe("annual");
    expect(url.searchParams.get("src")).toBe("abonnement");

    await cta.click();
    await expect(page).toHaveURL(/\/register\?/);
    await expect(page.getByText(/24,99\s€\/an/).first()).toBeVisible();
  });

  test("?plan=annual préselectionne l'annuel", async ({ page }) => {
    await page.goto("/abonnement?plan=annual");
    await expect(page.getByRole("radio", { name: "Annuel" })).toBeChecked();
  });

  test("ligne « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » sous le CTA @s16", async ({ page }) => {
    await page.goto("/abonnement");
    await expect(page.getByTestId("reassurance-paiement")).toHaveText(REASSURANCE);
    await choisirAnnuel(page);
    await expect(page.getByTestId("reassurance-paiement")).toHaveText(REASSURANCE_ANNUEL);
    await expect(page.getByText(/plus de 3 mois offerts, 10,89\s€ économisés par an/)).toBeVisible();
  });

  test("/register : réassurance et acceptation des CGU avec lien @s16", async ({ page }) => {
    await page.goto("/register?callbackUrl=%2Fabonnement&src=abonnement");
    await expect(page.getByText(REASSURANCE).first()).toBeVisible();
    await expect(page.getByText(/En créant ton compte, tu acceptes les/)).toBeVisible();
    const cgu = page.getByRole("link", { name: "CGU", exact: true });
    await expect(cgu).toHaveAttribute("href", "/cgu");
  });

  test("retour Stripe annulé ?paiement=annule → « Paiement annulé, rien n'a été prélevé. » (étalon 5b.2) @s16", async ({ page }) => {
    await page.goto("/abonnement?paiement=annule&upgrade=cancel");
    const bandeau = page.getByRole("status").filter({ hasText: "Paiement annulé, rien n'a été prélevé." });
    await expect(bandeau).toBeVisible();
    await expect(bandeau).toContainText("Tu peux réessayer quand tu veux.");
    // Le retour annulé ne relance jamais le paiement : on reste sur la page.
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/abonnement\?paiement=annule/);
  });

  test("le H1 et le CTA principal restent sur le domaine (aucune redirection externe)", async ({ page }) => {
    await page.goto("/abonnement");
    const hrefs = await page.locator("main a[href]").evaluateAll((l) => l.map((a) => a.getAttribute("href") ?? ""));
    for (const h of hrefs) expect(h, `lien externe inattendu : ${h}`).not.toMatch(/^(https?:)?\/\/(?!deviens-marrant\.fr)/);
  });
});

test.describe("En-tête : accès à la connexion @smoke", () => {
  test("lien « Connexion » atteignable (header ordinateur, menu sur mobile)", async ({ page }) => {
    await page.goto("/abonnement");
    if (!estMobile(page)) {
      await expect(page.getByRole("banner").getByRole("link", { name: "Connexion" })).toBeVisible();
      return;
    }
    await page.getByRole("button", { name: /menu/i }).first().click();
    await expect(page.getByRole("link", { name: "Connexion" }).filter({ visible: true }).first()).toBeVisible();
  });

  test("mobile : « Connexion » visible sans ouvrir le menu @s16", async ({ page }) => {
    test.skip(!estMobile(page), "contrôle réservé au gabarit mobile");
    await page.goto("/abonnement");
    const lien = page.getByRole("banner").getByRole("link", { name: "Connexion" }).filter({ visible: true }).first();
    await expect(lien).toBeVisible();
    const boite = await lien.boundingBox();
    expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);
    await lien.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
