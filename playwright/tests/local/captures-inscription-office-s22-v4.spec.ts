import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";

/**
 * Captures v4 (s22, inscription d'office des Premium à la lettre de la semaine, décision de Thomas
 * du 25/10), sur BUILD DE PRODUCTION et base jetable. Sur demande : `CAPTURES_INSCRIPTION_OFFICE=1`.
 * Sortie : docs/qa/captures-question-equipe-s22/v4-*.png. Vérifie : pas de débordement, réglage
 * activé d'office (aucune ligne écrite à l'affichage), plus aucune case au retour de paiement.
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const MOT_DE_PASSE = "E2e-captures-office-2026!";
const PASSAGE = Date.now().toString(36);

test.describe.configure({ mode: "serial" });

async function connecter(page: Page, vue: { width: number; height: number }, cle: string): Promise<string> {
  const email = `e2e-office4-${cle}-${vue.width}-${PASSAGE}@exemple.fr`;
  await page.setViewportSize(vue);
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
  return email;
}

async function capturer(page: Page, el: Locator, nom: string): Promise<void> {
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => ok(null))));
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  const b = await el.evaluate((n) => ({ contenu: n.scrollWidth, boite: n.clientWidth }));
  expect(b.contenu, "scrollWidth de l'élément").toBeLessThanOrEqual(b.boite + 1);
  await el.screenshot({ path: path.join(DOSSIER, `v4-${nom}.png`), animations: "disabled" });
}

test.describe("Captures v4 : lettre de la semaine en inscription d'office", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_INSCRIPTION_OFFICE !== "1", "captures sur demande : CAPTURES_INSCRIPTION_OFFICE=1");
  test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    test(`${vue.width} : profil Premium, réglage « Je reçois la lettre de la semaine » activé d'office`, async ({ page }) => {
      const email = await connecter(page, vue, "profil");
      await page.goto("/profil");
      await expect(page.getByRole("heading", { level: 1, name: "Mon profil" })).toBeVisible();
      await page.waitForLoadState("networkidle");
      const reglage = page.getByTestId("lettre-hebdo-profil");
      await expect(reglage.getByRole("switch", { name: "Je reçois la lettre de la semaine" })).toBeChecked();
      await expect(reglage.getByRole("checkbox")).toHaveCount(0);
      const lignes = await requete(`SELECT 1 FROM "PremiumLetterPreference" p JOIN "User" u ON u.id = p."userId" WHERE u.email = $1`, [email]);
      expect(lignes, "aucune écriture à l'affichage").toHaveLength(0);
      await capturer(page, reglage, `reglage-hebdo-profil-${vue.width}`);
      await page.screenshot({ path: path.join(DOSSIER, `v4-profil-premium-${vue.width}.png`), fullPage: true, animations: "disabled" });
    });
  }

  test("390 : retour de paiement, ligne d'information sans case", async ({ page }) => {
    await connecter(page, { width: 390, height: 844 }, "paiement");
    await page.goto("/abonnement/success?session_id=cs_test_factice_v4&formule=mensuel");
    const ligne = page.getByTestId("lettre-hebdo-paiement");
    await expect(ligne).toHaveText(/^Chaque jeudi, la lettre de la semaine arrive dans ta boîte\. Tu peux l.arrêter en un clic\.$/, { timeout: 30_000 });
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await expect(page.locator('[data-testid="retour-paiement-continuer"][data-pret="oui"]')).toBeVisible({ timeout: 30_000 });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(DOSSIER, "v4-retour-paiement-390.png"), fullPage: true, animations: "disabled" });
  });

  test("390 : CGU article 10 et confidentialité (parties de la lettre)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1600 });
    await page.goto("/cgu");
    const article10 = page.locator("section#lettre");
    await expect(article10).toContainText("La lettre de la semaine est incluse dans l’abonnement Premium");
    await expect(article10).not.toContainText(/si tu coches|la case|une case/);
    await capturer(page, article10, "cgu-article-10-390");
    await page.goto("/confidentialite");
    // Section « 8. La lettre » : données, finalité, destinataires et durée de la lettre de la semaine.
    const section8 = page.locator("section#lettre");
    await expect(section8).toContainText("incluse dans l’abonnement) : la date du premier envoi");
    await expect(section8).toContainText("exécution du contrat, car elle est incluse dans ton abonnement Premium");
    for (const t of await section8.getByTestId("confidentialite-lettre-hebdo").allTextContents()) expect(t).not.toMatch(/si tu coches|une case|tu l.actives toi-même/);
    await capturer(page, section8, "confidentialite-section-lettre-390");
    // Partie des droits : arrêt en un clic.
    const droits = page.locator("section").filter({ has: page.getByTestId("confidentialite-lettre-hebdo").filter({ hasText: "Tu peux arrêter la lettre de la semaine à tout moment" }) });
    await expect(droits).toHaveCount(1);
    await capturer(page, droits, "confidentialite-droits-lettre-390");
  });
});
