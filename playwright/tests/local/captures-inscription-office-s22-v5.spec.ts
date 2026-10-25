import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_HEBDO_ARRET } from "@/config/textes/lettre-hebdo-s21";

/**
 * Captures v5 (s22, inscription d'office, après la relecture à l'aveugle B1 à B5), sur BUILD DE
 * PRODUCTION et base jetable. Sur demande : `CAPTURES_INSCRIPTION_OFFICE=1`. Sortie :
 * docs/qa/captures-question-equipe-s22/v5-*.png, à 390 et 1440 : réglage activé, arrêté, compte en
 * opposition, messages de succès, fin prévue, page d'arrêt (4 états), retour de paiement dans chaque
 * état, CGU art. 10 et confidentialité (partie lettre) EN ENTIER. Comptes à mot de passe jamais
 * vérifiés, comme en production.
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const MOT_DE_PASSE = "E2e-captures-office5-2026!";
const PASSAGE = Date.now().toString(36);
const VUES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
type Vue = (typeof VUES)[number];

test.describe.configure({ mode: "serial" });

/** Compte Premium neuf, adresse jamais vérifiée ; `etat` pose l'état de la lettre en base jetable. */
async function compte(cle: string, vue: Vue, etat: "office" | "arretee" | "opposition" | "fin-prevue" = "office"): Promise<{ email: string; id: string }> {
  const email = `e2e-office5-${cle}-${vue.width}-${PASSAGE}@exemple.fr`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  await requete(`UPDATE "User" SET "emailVerified" = NULL, "emailOptOut" = $2 WHERE id = $1`, [id, etat === "opposition"]);
  await requete(`DELETE FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
  if (etat === "arretee") {
    await requete(
      `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "stoppedAt", "stopOrigin", "unsubscribeToken", "updatedAt")
       VALUES ($1, $2, false, now() - interval '40 days', 'profil', $3, now())`,
      [`e2e${randomBytes(8).toString("hex")}`, id, `e2eV5_${randomBytes(18).toString("hex")}`],
    );
  }
  if (etat === "fin-prevue") {
    await requete(`DELETE FROM "Subscription" WHERE "userId" = $1`, [id]);
    await requete(
      `INSERT INTO "Subscription" (id, "userId", plan, status, "currentPeriodEnd", "cancelAtPeriodEnd", "updatedAt")
       VALUES ($1, $2, 'PREMIUM', 'ACTIVE', '2026-11-24T10:00:00Z', true, now())`,
      [`e2e${randomBytes(8).toString("hex")}`, id],
    );
  }
  return { email, id };
}

async function connecter(page: Page, vue: Vue, email: string): Promise<void> {
  await page.context().clearCookies();
  await page.setViewportSize(vue);
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}

/** Élément capturé EN ENTIER (capture pleine page découpée), sans débordement horizontal. */
async function capturer(page: Page, el: Locator, nom: string): Promise<void> {
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => ok(null))));
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  const b = await el.evaluate((n) => ({ contenu: n.scrollWidth, boite: n.clientWidth }));
  expect(b.contenu, "scrollWidth de l'élément").toBeLessThanOrEqual(b.boite + 1);
  const r = await el.evaluate((n) => {
    const box = n.getBoundingClientRect();
    return { x: box.left + window.scrollX, y: box.top + window.scrollY, width: box.width, height: box.height };
  });
  const marge = 8;
  await page.screenshot({
    path: path.join(DOSSIER, `v5-${nom}.png`),
    fullPage: true,
    animations: "disabled",
    clip: { x: Math.max(0, r.x - marge), y: Math.max(0, r.y - marge), width: Math.min(r.width + 2 * marge, p.vue), height: r.height + 2 * marge },
  });
}

const reglage = (page: Page) => page.getByTestId("lettre-hebdo-profil");
const interrupteur = (page: Page) => reglage(page).getByRole("switch", { name: "Je reçois la lettre de la semaine" });

test.describe("Captures v5 : lettre de la semaine en inscription d'office, après relecture", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_INSCRIPTION_OFFICE !== "1", "captures sur demande : CAPTURES_INSCRIPTION_OFFICE=1");
  test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of VUES) {
    test(`${vue.width} : profil, réglage activé d'office, arrêt, reprise, arrêté au chargement`, async ({ page }) => {
      const { email, id } = await compte("profil", vue);
      await connecter(page, vue, email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      await expect(interrupteur(page)).toBeChecked();
      await capturer(page, reglage(page), `reglage-active-${vue.width}`);
      await interrupteur(page).click();
      await expect(reglage(page)).toContainText("C’est arrêté. Ton abonnement continue.");
      await expect(interrupteur(page)).not.toBeChecked();
      await capturer(page, reglage(page), `reglage-succes-arret-${vue.width}`);
      await interrupteur(page).click();
      await expect(reglage(page)).toContainText("Tu peux l’arrêter ici ou depuis chaque lettre, en un clic.");
      await capturer(page, reglage(page), `reglage-succes-reprise-${vue.width}`);
      await interrupteur(page).click();
      await expect(interrupteur(page)).not.toBeChecked();
      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(interrupteur(page)).not.toBeChecked();
      await capturer(page, reglage(page), `reglage-arrete-${vue.width}`);
      const [pref] = await requete<{ stopOrigin: string }>(`SELECT "stopOrigin" FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
      expect(pref.stopOrigin).toBe("profil");
      await page.screenshot({ path: path.join(DOSSIER, `v5-profil-premium-arrete-${vue.width}.png`), fullPage: true, animations: "disabled" });
    });

    test(`${vue.width} : profil, compte en opposition et fin prévue`, async ({ page }) => {
      const opposant = await compte("opposition", vue, "opposition");
      await connecter(page, vue, opposant.email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      await expect(reglage(page)).toContainText("Tu nous as demandé de ne plus recevoir nos e-");
      await expect(reglage(page).getByRole("switch")).toHaveCount(0);
      await capturer(page, reglage(page), `reglage-opposition-${vue.width}`);
      const fin = await compte("fin", vue, "fin-prevue");
      await connecter(page, vue, fin.email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      await expect(reglage(page)).toContainText("Elle s’arrêtera avec ton accès Premium le 24 novembre 2026.");
      await capturer(page, reglage(page), `reglage-fin-prevue-${vue.width}`);
    });

    for (const etat of ["office", "arretee", "opposition"] as const) {
      test(`${vue.width} : retour de paiement, état ${etat}`, async ({ page }) => {
        const { email } = await compte(`paiement-${etat}`, vue, etat);
        await connecter(page, vue, email);
        await page.goto("/abonnement/success?session_id=cs_test_factice_v5&formule=mensuel");
        const ligne = page.getByTestId("lettre-hebdo-paiement");
        await expect(ligne).toHaveAttribute("data-etat", etat === "office" ? "recoit" : etat, { timeout: 30_000 });
        await expect(page.getByRole("checkbox")).toHaveCount(0);
        await expect(page.locator('[data-testid="retour-paiement-continuer"][data-pret="oui"]')).toBeVisible({ timeout: 30_000 });
        await page.waitForLoadState("networkidle");
        await page.screenshot({ path: path.join(DOSSIER, `v5-retour-paiement-${etat}-${vue.width}.png`), fullPage: vue.width < 768, animations: "disabled" });
      });
    }

    test(`${vue.width} : page d'arrêt, quatre états`, async ({ page }) => {
      await page.setViewportSize(vue);
      const { id } = await compte("arret", vue);
      const token = `e2eV5arret_${randomBytes(18).toString("hex")}`;
      await requete(
        `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "activatedAt", "activationOrigin", "unsubscribeToken", "updatedAt") VALUES ($1, $2, true, now(), 'office', $3, now())`,
        [`e2e${randomBytes(8).toString("hex")}`, id, token],
      );
      const bloc = page.getByTestId("arret-lettre-hebdo");
      await page.goto(`/lettre/premium/arreter?token=${token}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Arrêter la lettre de la semaine");
      await capturer(page, page.locator("main"), `arret-defaut-${vue.width}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(bloc).toContainText("C’est arrêté.");
      await capturer(page, page.locator("main"), `arret-succes-${vue.width}`);
      await page.goto(`/lettre/premium/arreter?token=${token}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(bloc).toContainText("déjà arrêtée");
      await capturer(page, page.locator("main"), `arret-deja-arretee-${vue.width}`);
      await page.goto(`/lettre/premium/arreter?token=e2eV5inconnu_${randomBytes(18).toString("hex")}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(bloc).toContainText("Ce lien ne fonctionne plus");
      await capturer(page, page.locator("main"), `arret-lien-inconnu-${vue.width}`);
    });

    test(`${vue.width} : CGU article 10 et confidentialité (partie lettre) en entier`, async ({ page }) => {
      await page.setViewportSize(vue);
      await page.goto("/cgu");
      const article10 = page.locator("section#lettre");
      await expect(article10).toContainText("sauf si tu nous as demandé de ne plus recevoir nos e-");
      await expect(article10).not.toContainText(/si tu coches|la case|une case/);
      await capturer(page, article10, `cgu-article-10-${vue.width}`);
      await page.goto("/confidentialite");
      const section8 = page.locator("section#lettre");
      await expect(section8).toContainText("Lettre du mois par e-");
      await expect(section8).toContainText("si tu te réabonnes, la lettre reprend.");
      await expect(section8).not.toContainText("ancienne case");
      await capturer(page, section8, `confidentialite-section-8-lettre-${vue.width}`);
      const droits = page.locator("section").filter({ has: page.getByTestId("confidentialite-lettre-hebdo").filter({ hasText: "Les numéros déjà reçus restent dans ta boîte." }) });
      await expect(droits).toHaveCount(1);
      await expect(droits).toContainText("retirer ton consentement à la lettre du mois");
      await capturer(page, droits, `confidentialite-section-7-droits-${vue.width}`);
    });
  }
});
