import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_HEBDO_ARRET } from "@/config/textes/lettre-hebdo-s21";

/**
 * Captures v7 (s22, inscription d'office, relecture finale v3 : m1 ligne du profil, m2 adresse
 * insécable, m3 succès de la page d'arrêt), sur BUILD DE PRODUCTION et base jetable. Sur demande :
 * `CAPTURES_INSCRIPTION_OFFICE=1`. Seuls les écrans touchés, à 390 et 1440 : réglage activé et arrêté,
 * page d'arrêt après l'arrêt. Sortie : v7-*.png ; aucune capture plus ancienne n'est réécrite.
 * Comptes à mot de passe jamais vérifiés.
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const MOT_DE_PASSE = "E2e-captures-office7-2026!";
const PASSAGE = Date.now().toString(36);
const VUES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
type Vue = (typeof VUES)[number];

test.describe.configure({ mode: "serial" });

/** Compte Premium neuf, adresse jamais vérifiée ; `etat` pose l'état de la lettre en base jetable. */
async function compte(cle: string, vue: Vue, etat: "office" | "arretee" | "opposition" | "fin-prevue" = "office"): Promise<{ email: string; id: string }> {
  const email = `e2e-office7-${cle}-${vue.width}-${PASSAGE}@exemple.fr`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  await requete(`UPDATE "User" SET "emailVerified" = NULL, "emailOptOut" = $2 WHERE id = $1`, [id, etat === "opposition"]);
  await requete(`DELETE FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
  if (etat === "arretee") {
    await requete(
      `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "stoppedAt", "stopOrigin", "unsubscribeToken", "updatedAt")
       VALUES ($1, $2, false, now() - interval '40 days', 'profil', $3, now())`,
      [`e2e${randomBytes(8).toString("hex")}`, id, `e2eV7_${randomBytes(18).toString("hex")}`],
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
    path: path.join(DOSSIER, `v7-${nom}.png`),
    fullPage: true,
    animations: "disabled",
    clip: { x: Math.max(0, r.x - marge), y: Math.max(0, r.y - marge), width: Math.min(r.width + 2 * marge, p.vue), height: r.height + 2 * marge },
  });
}

const reglage = (page: Page) => page.getByTestId("lettre-hebdo-profil");
const interrupteur = (page: Page) => reglage(page).getByRole("switch", { name: "Je reçois la lettre de la semaine" });

test.describe("Captures v7 : lettre de la semaine en inscription d'office, après relecture finale", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_INSCRIPTION_OFFICE !== "1", "captures sur demande : CAPTURES_INSCRIPTION_OFFICE=1");
  test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of VUES) {
    test(`${vue.width} : profil, réglage activé puis arrêté (ligne corrigée, adresse insécable)`, async ({ page }) => {
      const { email } = await compte("profil", vue);
      await connecter(page, vue, email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      await expect(interrupteur(page)).toBeChecked();
      await expect(reglage(page)).toContainText("puis reprend quand tu arrêtes la lettre de la semaine ou quand ton abonnement prend fin.");
      const adresse = reglage(page).getByTestId("lettre-hebdo-adresse");
      await expect(adresse).toHaveText(email);
      // Insécable : l'adresse tient sur une seule ligne, et rien ne déborde de la carte (vérifié dans `capturer`).
      const lignes = await adresse.evaluate((n) => n.getClientRects().length);
      expect(lignes, "adresse sur une seule ligne").toBe(1);
      await capturer(page, reglage(page), `reglage-active-${vue.width}`);
      await interrupteur(page).click();
      await expect(interrupteur(page)).not.toBeChecked();
      await page.reload();
      await page.waitForLoadState("networkidle");
      await expect(interrupteur(page)).not.toBeChecked();
      await expect(reglage(page).getByTestId("lettre-hebdo-adresse")).toHaveText(email);
      await capturer(page, reglage(page), `reglage-arrete-${vue.width}`);
    });

    test(`${vue.width} : page d'arrêt, message de succès`, async ({ page }) => {
      await page.setViewportSize(vue);
      const { id } = await compte("arret", vue);
      const token = `e2eV7arret_${randomBytes(18).toString("hex")}`;
      await requete(
        `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "activatedAt", "activationOrigin", "unsubscribeToken", "updatedAt") VALUES ($1, $2, true, now(), 'office', $3, now())`,
        [`e2e${randomBytes(8).toString("hex")}`, id, token],
      );
      const bloc = page.getByTestId("arret-lettre-hebdo");
      await page.goto(`/lettre/premium/arreter?token=${token}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(bloc).toContainText("Cet arrêt ne change rien à ton abonnement.");
      await expect(bloc).not.toContainText("C’est arrêté.");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lettre de la semaine arrêtée");
      await capturer(page, page.locator("main"), `arret-succes-${vue.width}`);
    });
  }
});
