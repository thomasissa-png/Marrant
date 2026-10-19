import type { Page } from "@playwright/test";
import { test, expect, estMobile, lireUrl, texteValide } from "../support/fixtures";
import { prixTtcLabel, REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { PREMIUM_ANNUAL_EQUIVALENT_LABEL } from "@/config/premium";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

/**
 * J2 : page /abonnement, CTA mensuel et annuel, réassurance, retour annulé, en-tête.
 * Textes : constantes du dépôt (`apps/web/src/config/textes`), jamais recopiés.
 */

/** Radio natif masqué (sr-only) : on clique son libellé, comme un humain. */
async function choisirAnnuel(page: Page) {
  await page.locator("label").filter({ has: page.getByRole("radio", { name: "Annuel" }) }).click();
  await expect(page.getByRole("radio", { name: "Annuel" })).toBeChecked();
}

// REASS unique (concision v5) : même texte en mensuel et en annuel, le prix TTC est affiché juste au-dessus.
const REASSURANCE = texteValide(REASSURANCE_UNIQUE);

test.describe("Offre /abonnement @smoke", () => {
  // Trajet de conversion s21 : « S'abonner », qui suit la formule choisie (bouton du premier écran).
  test("CTA mensuel « S'abonner · 2,99 €/mois » → /register?callbackUrl=/abonnement&src=abonnement @s21", async ({ page }) => {
    await page.goto("/abonnement");
    const cta = page.getByTestId("abonnement-bouton-achat");
    await expect(cta).toHaveAccessibleName(/^S’abonner\s·\s2,99\s€\/mois$/);
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("callbackUrl")).toBe("/abonnement");
    expect(url.searchParams.get("src")).toBe("abonnement");

    await cta.click();
    await expect(page).toHaveURL(/\/register\?/);
    await expect(page.getByRole("textbox", { name: /^e-?mail$/i })).toBeVisible();
  });

  test("CTA annuel « S'abonner · 24,99 €/an » → callbackUrl /abonnement?plan=annual, /register affiche l'annuel @s21", async ({ page }) => {
    await page.goto("/abonnement");
    await choisirAnnuel(page);
    const cta = page.getByTestId("abonnement-bouton-achat");
    await expect(cta).toHaveAccessibleName(/^S’abonner\s·\s24,99\s€\/an$/);
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/register");
    const retour = lireUrl(url.searchParams.get("callbackUrl"));
    expect(retour.pathname).toBe("/abonnement");
    expect(retour.searchParams.get("plan")).toBe("annual");
    expect(url.searchParams.get("src")).toBe("abonnement");

    await cta.click();
    await expect(page).toHaveURL(/\/register\?/);
    // /register rappelle la formule choisie : « Premium, 24,99 € TTC par an. »
    await expect(page.getByText(texteValide(prixTtcLabel("annual"))).first()).toBeVisible();
  });

  test("?plan=annual préselectionne l'annuel", async ({ page }) => {
    await page.goto("/abonnement?plan=annual");
    await expect(page.getByRole("radio", { name: "Annuel" })).toBeChecked();
  });

  test("réassurance « premier paiement » sous le CTA, en mensuel comme en annuel @s16", async ({ page }) => {
    await page.goto("/abonnement");
    await expect(page.getByTestId("reassurance-paiement")).toHaveText(REASSURANCE);
    await choisirAnnuel(page);
    await expect(page.getByTestId("reassurance-paiement")).toHaveText(REASSURANCE);
    // Carte annuelle (arbitrage du 19/10) : « soit 2,08 € par mois ».
    await expect(page.getByText(texteValide(PREMIUM_ANNUAL_EQUIVALENT_LABEL))).toBeVisible();
  });

  test("/register : réassurance et acceptation des CGU avec lien @s16", async ({ page }) => {
    await page.goto("/register?callbackUrl=%2Fabonnement&src=abonnement");
    // Le prix TTC est rappelé en haut de /register, la REASS unique est collée sous le plein.
    await expect(page.getByText(texteValide(prixTtcLabel("monthly"))).first()).toBeVisible();
    await expect(page.getByText(texteValide(REASSURANCE_UNIQUE)).first()).toBeVisible();
    await expect(page.getByText(/En créant ton compte, tu acceptes les/)).toBeVisible();
    const cgu = page.getByRole("link", { name: "CGU", exact: true });
    await expect(cgu).toHaveAttribute("href", "/cgu");
  });

  test("retour Stripe annulé ?paiement=annule → « Paiement annulé, rien n'a été prélevé. » (étalon 5b.2) @s16", async ({ page }) => {
    await page.goto("/abonnement?paiement=annule&upgrade=cancel");
    const bandeau = page.getByRole("status").filter({ hasText: /Paiement annulé, rien n['’]a été prélevé\./ });
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

  // s20 (audit conversion, lot 1) : sous 520 px, la barre mobile donne la place au bouton d'appel
  // et « Connexion » passe dans le menu ; dès 520 px, « Connexion » revient dans la barre.
  // s21 (B6) : le bouton devient « 2,99 €/mois » vers /abonnement?src=header, masqué sur
  // /abonnement et /register : contrôle sur /conseils.
  test("mobile : bouton prix dans la barre ; « Connexion » dans la barre dès 520 px, sinon dans le menu @s16 @s21", async ({ page }) => {
    test.skip(!estMobile(page), "contrôle réservé au gabarit mobile");
    await page.goto("/conseils");
    const barre = page.getByRole("banner");
    const commencer = barre.getByRole("link", { name: /^Premium, 2,99\s€ par mois : voir l['’]offre$/ }).filter({ visible: true }).first();
    await expect(commencer).toHaveAttribute("href", "/abonnement?src=header");
    await expect(commencer).toBeVisible();
    expect((await commencer.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

    const largeur = page.viewportSize()?.width ?? 390;
    const connexionBarre = barre.getByRole("link", { name: TEXTES_CONNEXION.lienConnexionMobile }).filter({ visible: true });
    if (largeur < 520) {
      await expect(connexionBarre).toHaveCount(0);
      await barre.getByRole("button", { name: "Menu" }).click();
      const dansMenu = page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: "Connexion" });
      await expect(dansMenu).toBeVisible();
      expect((await dansMenu.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      await barre.getByRole("button", { name: "Menu" }).click();
      await page.setViewportSize({ width: 520, height: page.viewportSize()?.height ?? 844 });
    }
    const lien = connexionBarre.first();
    await expect(lien).toBeVisible();
    expect((await lien.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
    await lien.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
