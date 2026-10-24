import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";

/**
 * Trajet de conversion s21 : page de vente /abonnement (docs/ux/trajet-conversion-s21.md §5,
 * docs/copy/conversion-s21/textes-trajet-v1.md).
 * - Premier écran à 375 × 812 (bureau et émulation mobile tactile) : le bouton d'achat
 *   « S'abonner · 1,99 €/mois » est visible sans défiler, sur UNE ligne.
 * - Promesse de la lettre à `false` : 3 avantages, aucune ligne « Lettre par e-mail ».
 * - Retour d'inscription (`auto=1`, session) : le HTML du serveur est la page d'attente, pas la
 *   page de vente (plus de flash entre /register et Stripe).
 * - Barre collante : absente au premier écran, présente plus bas, absente devant le bouton final.
 */
const BOUTON = /^S’abonner · 1,99 €\/mois$/;

async function lignesDeTexte(bouton: Locator): Promise<number> {
  return bouton.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tops = new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top)));
    return tops.size;
  });
}

async function verifierPremierEcran(page: Page, role: "link" | "button") {
  const bouton = page.getByRole(role, { name: BOUTON }).first();
  await expect(bouton).toBeVisible();
  const box = await bouton.boundingBox();
  expect(box, "bouton mesuré").not.toBeNull();
  // Premier écran : le bas du bouton est dans la fenêtre, sans défiler.
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(812);
  expect(await lignesDeTexte(bouton), "libellé sur une ligne").toBe(1);
  console.log(`[abonnement-vente] ${role} : bas du bouton à ${Math.round(box!.y + box!.height)} px`);
}

test.describe("@s21 /abonnement, page de vente (trajet de conversion)", () => {
  localSeulement();

  test("visiteur, 375 × 812 : bouton au premier écran, une ligne ; lettre absente", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/abonnement?src=mur-vannes");
    await expect(page.getByTestId("abonnement-accroche")).toHaveText("Pour la suite des vannes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Premium ouvre tout Deviens Marrant");
    await verifierPremierEcran(page, "link");
    await expect(page.getByTestId("avantages-premium").locator("li")).toHaveCount(3);
    await expect(page.getByText(/lettre par e-mail/i)).toHaveCount(0);
    await expect(page.getByText(/chaque semaine/i)).toHaveCount(0);
    const tableau = page.getByTestId("abonnement-tableau");
    await expect(tableau.locator("tbody tr")).toHaveCount(7);
    await expect(tableau.locator("tr[data-ligne='lettre']")).toHaveCount(0);
    await expect(tableau.locator("tr[data-en-avant='oui']")).toHaveAttribute("data-ligne", "listes");
  });

  test("barre collante : cachée au premier écran, visible plus bas, cachée devant le bouton final", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/abonnement");
    const barre = page.getByTestId("abonnement-barre-collante");
    await expect(barre).toHaveAttribute("data-visible", "non");
    // Défilement juste sous le bouton principal (écran 2) : la barre prend le relais.
    await page.evaluate(() => {
      const principal = document.getElementById("abonnement-achat-principal")!;
      window.scrollTo(0, principal.getBoundingClientRect().bottom + window.scrollY + 40);
    });
    await expect(barre).toHaveAttribute("data-visible", "oui");
    await expect(barre.getByRole("link", { name: BOUTON })).toBeVisible();
    await page.getByTestId("abonnement-final").scrollIntoViewIfNeeded();
    await expect(barre).toHaveAttribute("data-visible", "non");
  });

  test("compte connecté, 375 × 812 : bouton au premier écran ; `auto=1` rend la page d'attente côté serveur", async ({ page }) => {
    const email = `e2e-vente-${randomBytes(4).toString("hex")}@example.com`;
    await creerCompte(email, "motdepasse-e2e", "FREE");
    // Visiteur simulé distinct (comme Cloudflare) : ne partage pas la limite de connexion des autres specs.
    await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` });
    await connecter(page, email, "motdepasse-e2e");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/abonnement");
    await verifierPremierEcran(page, "button");
    await expect(page.getByTestId("abonnement-deja-compte")).toHaveCount(0);

    const html = await (await page.request.get("/abonnement?src=header&auto=1")).text();
    // textes-trajet-v2 A16 à A18 : titre, formule, texte.
    expect(html).toContain(">Dernière étape.<");
    expect(html).toContain("On t’emmène au paiement sécurisé par Stripe…");
    // Le titre de la page de vente n'est pas rendu (il reste dans le JSON-LD Product, hors écran).
    expect(html).not.toMatch(/>Premium ouvre tout Deviens Marrant</);
    expect(html).not.toContain('data-testid="abonnement-offre"');
  });
});

test.describe("@s21 /abonnement, émulation mobile tactile 375 × 812", () => {
  localSeulement();
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

  test("bouton d'achat visible sans défiler, une ligne", async ({ page }) => {
    await page.goto("/abonnement?src=header");
    await expect(page.getByTestId("abonnement-accroche")).toHaveCount(0);
    await verifierPremierEcran(page, "link");
  });
});
