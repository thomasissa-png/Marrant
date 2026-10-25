import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Captures v10 (s22, décision de Thomas du 25/10 : la lettre du mois part d'office aux comptes sans
 * abonnement, version sans invitation), sur BUILD DE PRODUCTION et base jetable (migration 16 jouée).
 * Sur demande : `CAPTURES_LETTRE_COMPTES=1` (+ `CAPTURES_ADMIN_PASSWORD`, mot de passe factice du
 * serveur local). Écrans : /register (chemin Google et chemin e-mail, une seule ligne sous les CGU),
 * confidentialité section 8, admin Abonnés › Lettre (lettre du mois, 3 versions). 390 et 1440.
 * Sortie : v10-*.png ; aucune capture plus ancienne n'est réécrite.
 * v10b (relecture à l'aveugle des comptes gratuits) : `CAPTURES_PREFIXE=v10b`, `--grep` sur
 * l'inscription et la confidentialité (parties 7 et 8).
 */
const PREFIXE = process.env.CAPTURES_PREFIXE ?? "v10";
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const VUES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
const LIGNE = "Tu recevras aussi la lettre du mois, une fois par mois. Désinscription en un clic.";

test.describe.configure({ mode: "serial" });

/** Zone capturée de `haut` à `bas` (inclus), pleine largeur de la carte, sans débordement horizontal. */
async function capturerZone(page: Page, haut: Locator, bas: Locator, nom: string): Promise<void> {
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => ok(null))));
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  const boite = async (l: Locator) =>
    l.evaluate((n) => {
      const b = n.getBoundingClientRect();
      return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height };
    });
  const a = await boite(haut);
  const b = await boite(bas);
  const marge = 12;
  const x = Math.max(0, Math.min(a.x, b.x) - marge);
  const droite = Math.min(p.vue, Math.max(a.x + a.w, b.x + b.w) + marge);
  await page.screenshot({
    path: path.join(DOSSIER, `${PREFIXE}-${nom}.png`),
    fullPage: true,
    animations: "disabled",
    clip: { x, y: Math.max(0, a.y - marge), width: droite - x, height: b.y + b.h - a.y + 2 * marge },
  });
}

test.describe("Captures v10 : lettre du mois d'office aux comptes", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_LETTRE_COMPTES !== "1", "captures sur demande : CAPTURES_LETTRE_COMPTES=1");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of VUES) {
    test(`${vue.width} : inscription, chemin Google et chemin e-mail`, async ({ page }) => {
      await page.setViewportSize(vue);
      await page.goto("/register");
      await page.waitForLoadState("networkidle");
      const ligne = page.getByTestId("register-lettre-mois");
      await expect(ligne).toHaveCount(1);
      expect((await ligne.textContent())?.replace(/\s/g, " ")).toBe(LIGNE);
      const google = page.getByRole("button", { name: /Google/ });
      await capturerZone(page, google, ligne, `inscription-google-${vue.width}`);
      const soumettre = page.locator("form button[type=submit]");
      await capturerZone(page, ligne, soumettre, `inscription-email-${vue.width}`);
    });

    test(`${vue.width} : confidentialité sections 7 et 8`, async ({ page }) => {
      await page.setViewportSize({ width: vue.width, height: 1600 });
      await page.goto("/confidentialite");
      const lettre = page.locator("section#lettre");
      await expect(lettre.getByTestId("confidentialite-lettre-compte")).toContainText("si tu as un compte sans abonnement, sans l’invitation à t’abonner");
      await capturerZone(page, lettre, lettre, `confidentialite-section-8-lettre-${vue.width}`);
      const droits = page.locator("section").filter({ has: page.getByRole("heading", { name: "7. Tes droits (RGPD)" }) });
      await expect(droits).toContainText("Tu peux te désinscrire de la lettre du mois à tout moment");
      await capturerZone(page, droits, droits, `confidentialite-section-7-droits-${vue.width}`);
    });

    test(`${vue.width} : admin Abonnés › Lettre, lettre du mois et ses trois versions`, async ({ page }) => {
      const pass = process.env.CAPTURES_ADMIN_PASSWORD ?? "";
      test.skip(!pass, "CAPTURES_ADMIN_PASSWORD absent");
      await page.setViewportSize({ width: vue.width, height: 1600 });
      await page.goto("/admin");
      await page.getByPlaceholder("Mot de passe admin").fill(pass);
      await page.getByRole("button", { name: "Accéder au backoffice" }).click();
      await page.getByRole("button", { name: "Abonnés" }).click();
      await page.getByRole("button", { name: "Lettre", exact: true }).click();
      const mois = page.locator("li").filter({ hasText: "Lettre du mois 2026-11" });
      await expect(mois.getByTestId("mensuelle-comptes-gratuits")).toContainText("sans abonnement, d’office");
      await mois.getByRole("button", { name: "Relire le numéro" }).click();
      await expect(mois).toContainText("Version des comptes sans abonnement (même approbation)");
      // Textes entiers sur la capture (à l'écran, chaque version défile dans son cadre).
      await page.addStyleTag({ content: "pre { max-height: none !important; }" });
      await capturerZone(page, mois, mois, `admin-lettre-du-mois-${vue.width}`);
    });
  }
});
