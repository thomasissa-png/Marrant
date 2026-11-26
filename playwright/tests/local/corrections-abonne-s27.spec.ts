import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s27, corrections du parcours abonné (`docs/qa/parcours-abonne-s27.md`, go de Thomas du 26/11 « corrigeons! »), mobile 390.
 * - D2 : un abonné ne voit jamais l'offre du visiteur, même avant la lecture de la session (JS bloqué ici : seuls le HTML,
 *   le script de <head> et la feuille de style jouent) ; le visiteur la voit toujours.
 * - D1 : après rechargement de /vannes, la vanne en favori a l'étoile pleine ; un clic la retire (aucun 409).
 * - D3 : fin du quiz d'étape, « Valider cette étape » actif sous le résultat, pas de « Continuer », pas de lien vers l'étape
 *   suivante avant la validation.
 * - D4 : une réplique écrite sur la situation du premier pas compte comme pratique : « Aujourd'hui » passe à la suite,
 *   série à 1 jour, XP inchangés.
 * Espace ouvert seulement (D1 et D2 valent aussi fermé, mais les pages de D3 et D4 n'existent qu'ouvert).
 * `E2E_CAPTURES_S27` : dossier des captures (`docs/captures/s27-corrections-abonne`).
 */
const CAPTURES = process.env.E2E_CAPTURES_S27 ?? "";
const MDP = "E2e-corrections-s27";
const CONSEIL = "/conseils";

async function capture(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  await page.screenshot({ path: `${CAPTURES}/${nom}-apres-mobile.png` });
}

async function abonne(page: Page, prefixe: string): Promise<string> {
  const email = `e2e-s27-${prefixe}-${randomBytes(4).toString("hex")}@example.com`;
  await creerCompte(email, MDP, "PREMIUM");
  await connecter(page, email, MDP);
  return email;
}

async function supprimer(email: string) {
  await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
}

/** Première fiche de conseil de la liste publique (même HTML pour tous). */
async function premiereFicheConseil(page: Page): Promise<string> {
  await page.goto(CONSEIL);
  const href = await page.locator('main a[href^="/conseils/"]').first().getAttribute("href");
  expect(href).toBeTruthy();
  return href!;
}

test.describe("Corrections du parcours abonné @s27", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "espace ouvert seulement");
  test.use({ viewport: { width: 390, height: 844 } });

  test("D2 : HTML servi, abonné sans offre avant toute lecture de session, visiteur avec", async ({ page, browser }) => {
    const email = await abonne(page, "d2");
    try {
      const fiche = await premiereFicheConseil(page);
      // Plus aucun script de l'application : l'abonné ne voit que ce que le HTML, l'indice et la feuille de style donnent.
      await page.route(/\/_next\/static\/chunks\/.*\.js/, (r) => r.abort());
      await page.goto(fiche);
      await expect(page.locator("html")).toHaveAttribute("data-indice-lecteur", "abonne");
      await expect(page.locator("[data-en-tete-prix]")).toBeHidden();
      await expect(page.locator('[data-bloc-exercice] a[href^="/abonnement"]')).toBeHidden();
      await expect(page.locator("[data-rubrique] svg").first()).toBeHidden();
      await capture(page, "d2-conseil-sans-js");

      const visiteur = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const v = await visiteur.newPage();
      await v.route(/\/_next\/static\/chunks\/.*\.js/, (r) => r.abort());
      const reponse = await v.goto(fiche);
      expect(reponse?.headers()["set-cookie"] ?? "").not.toMatch(/dm_lecteur/);
      await expect(v.locator("html")).not.toHaveAttribute("data-indice-lecteur", /.+/);
      await expect(v.locator("[data-en-tete-prix]")).toBeVisible();
      await expect(v.locator('[data-bloc-exercice] a[href^="/abonnement"]')).toBeAttached();
      await visiteur.close();
    } finally {
      await supprimer(email);
    }
  });

  test("D1 : étoile pleine après rechargement, retrait sans 409", async ({ page }) => {
    const email = await abonne(page, "d1");
    const erreurs: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/api/favorites") && r.status() >= 400) erreurs.push(`${r.request().method()} ${r.status()}`);
    });
    try {
      await page.goto("/vannes");
      const etoile = page.getByRole("button", { name: "Ajouter aux favoris" }).first();
      const carte = etoile.locator("xpath=ancestor::*[contains(@class,'cursor-pointer')][1]");
      const texte = ((await carte.innerText()).split("\n").find((l) => l.trim().length > 25) ?? "").trim().slice(0, 30);
      expect(texte.length).toBeGreaterThan(10);
      const ajout = page.waitForResponse((r) => r.url().endsWith("/api/favorites") && r.request().method() === "POST");
      await etoile.click();
      expect((await ajout).ok()).toBe(true);

      const lecture = page.waitForResponse((r) => r.url().endsWith("/api/favorites") && r.request().method() === "GET");
      await page.reload();
      expect((await lecture).ok()).toBe(true);
      const memeCarte = page.locator(".cursor-pointer", { hasText: texte }).first();
      const pleine = memeCarte.getByRole("button", { name: "Retirer des favoris" });
      await expect(pleine).toBeVisible();
      await capture(page, "d1-vannes-favori");

      const retrait = page.waitForResponse((r) => r.url().includes("/api/favorites/") && r.request().method() === "DELETE");
      await pleine.click();
      expect((await retrait).ok()).toBe(true);
      await expect(memeCarte.getByRole("button", { name: "Ajouter aux favoris" })).toBeVisible();
      const n = await requete<{ n: string }>(`SELECT count(*)::text AS n FROM "UserFavorite" f JOIN "User" u ON u.id = f."userId" WHERE u.email = $1`, [email]);
      expect(Number(n[0].n)).toBe(0);
      expect(erreurs).toEqual([]);
    } finally {
      await supprimer(email);
    }
  });

  test("D3 : fin du quiz, un seul bouton actif « Valider cette étape », pas de lien vers l'étape 2 avant", async ({ page }) => {
    const email = await abonne(page, "d3");
    try {
      await page.goto("/parcours/repartie#etape-1");
      const etape = page.locator("#etape-1");
      const voir = etape.getByRole("button", { name: "Voir le résultat" });
      // Une réponse par question (la première), « Question suivante » jusqu'à « Voir le résultat ».
      for (let i = 0; i < 12; i++) {
        await etape.getByTestId("quiz-lettre").first().click();
        if (await voir.isVisible().catch(() => false)) break;
        await etape.getByRole("button", { name: "Question suivante" }).click();
      }
      await voir.click();

      const valider = page.getByRole("button", { name: "Valider cette étape", exact: true });
      await expect(valider).toBeVisible();
      await expect(valider).toBeEnabled();
      await expect(valider).not.toHaveAttribute("aria-disabled", /.+/);
      await expect(page.getByRole("button", { name: /Termine le quiz pour valider/ })).toHaveCount(0);
      await expect(etape.getByRole("button", { name: "Continuer", exact: true })).toHaveCount(0);
      await expect(etape.getByText(/Tu peux valider l.étape/)).toBeVisible();
      await expect(page.locator('[data-etape-suivante="2"]')).toHaveCount(0);
      // Résultat et bouton dans la même vue (le résultat juste au-dessus du bouton).
      const resultat = await etape.locator("[role=status]").filter({ hasText: /Tu peux valider/ }).first().boundingBox();
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, (resultat?.y ?? 0) + (await page.evaluate(() => window.scrollY)) - 190));
      await expect(valider).toBeFocused();
      await capture(page, "d3-fin-quiz");

      const validation = page.waitForResponse((r) => /\/api\/parcours\/[^/]+\/progress/.test(r.url()) && r.request().method() !== "GET");
      await valider.click();
      expect((await validation).ok()).toBe(true);
      const [faites] = await requete<{ n: string }>(
        `SELECT count(*)::text AS n FROM "UserPathStepCompletion" c JOIN "User" u ON u.id = c."userId" WHERE u.email = $1`,
        [email],
      );
      expect(Number(faites.n)).toBe(1);
    } finally {
      await supprimer(email);
    }
  });

  test("D4 : réplique sur la situation du premier pas = pratique du jour, sans XP", async ({ page }) => {
    const email = await abonne(page, "d4");
    try {
      await page.goto("/mon-espace");
      await expect(page.getByText("Ton premier pas").first()).toBeVisible();
      await page.goto("/mon-espace/quoi-repondre/amis-tu-as-change-quelque-chose");
      await page.locator("main textarea").first().fill("Oui, j'ai changé de coiffeur, pas de personnalité.");
      const enregistre = page.waitForResponse((r) => r.url().endsWith("/api/espace/replique") && r.request().method() === "PUT");
      await page.getByRole("button", { name: "Enregistrer" }).first().click();
      expect((await enregistre).ok()).toBe(true);

      const [compte] = await requete<{ xp: number; streak: number; pratique: boolean }>(
        `SELECT xp, streak, "lastPracticeAt" IS NOT NULL AS pratique FROM "User" WHERE email = $1`,
        [email],
      );
      expect(compte).toEqual({ xp: 0, streak: 1, pratique: true });

      await page.goto("/mon-espace");
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByText("Ton premier pas")).toHaveCount(0);
      await expect(page.getByText("Ta série démarre à ta prochaine pratique.")).toHaveCount(0);
      await expect(page.getByText(/1\s+jour de pratique/).first()).toBeVisible();
      await capture(page, "d4-aujourdhui");
    } finally {
      await supprimer(email);
    }
  });
});
