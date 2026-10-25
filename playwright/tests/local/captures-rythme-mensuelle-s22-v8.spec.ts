import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_HEBDO_ARRET } from "@/config/textes/lettre-hebdo-s21";

/**
 * Captures v8 (s22, décision de Thomas du 25/10 : la lettre du mois fait partie des lettres Premium,
 * plus de pause), sur BUILD DE PRODUCTION et base jetable. Sur demande : `CAPTURES_RYTHME_MENSUELLE=1`
 * (+ `CAPTURES_ADMIN_PASSWORD`, mot de passe factice du serveur local, pour l'admin). Écrans dont le
 * texte change, à 390 et 1440 : réglage du profil, retour de paiement, page d'arrêt (avant et après le
 * clic), CGU article 10, confidentialité section 8, admin Abonnés › Lettre. Sortie : v8-*.png ; aucune
 * capture plus ancienne n'est réécrite. Comptes à mot de passe jamais vérifiés.
 * v8b (relecture à l'aveugle du rythme, B2 et mineurs) : `CAPTURES_PREFIXE=v8b` et `--grep` sur les
 * écrans retouchés (retour de paiement, profil après désactivation, confidentialité partie 8).
 */
const PREFIXE = process.env.CAPTURES_PREFIXE ?? "v8";
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const MOT_DE_PASSE = "E2e-captures-rythme8-2026!";
const PASSAGE = Date.now().toString(36);
const VUES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;
type Vue = (typeof VUES)[number];

test.describe.configure({ mode: "serial" });

async function compte(cle: string, vue: Vue): Promise<{ email: string; id: string }> {
  const email = `e2e-rythme8-${cle}-${vue.width}-${PASSAGE}@exemple.fr`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  await requete(`UPDATE "User" SET "emailVerified" = NULL, "emailOptOut" = false WHERE id = $1`, [id]);
  await requete(`DELETE FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
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
  const r = await el.evaluate((n) => {
    const box = n.getBoundingClientRect();
    return { x: box.left + window.scrollX, y: box.top + window.scrollY, width: box.width, height: box.height };
  });
  const marge = 8;
  await page.screenshot({
    path: path.join(DOSSIER, `${PREFIXE}-${nom}.png`),
    fullPage: true,
    animations: "disabled",
    clip: { x: Math.max(0, r.x - marge), y: Math.max(0, r.y - marge), width: Math.min(r.width + 2 * marge, p.vue), height: r.height + 2 * marge },
  });
}

test.describe("Captures v8 : la lettre du mois fait partie des lettres Premium", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_RYTHME_MENSUELLE !== "1", "captures sur demande : CAPTURES_RYTHME_MENSUELLE=1");
  test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");

  test.beforeAll(() => {
    mkdirSync(DOSSIER, { recursive: true });
  });

  for (const vue of VUES) {
    test(`${vue.width} : profil, réglage activé`, async ({ page }) => {
      const { email } = await compte("profil", vue);
      await connecter(page, vue, email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      const reglage = page.getByTestId("lettre-hebdo-profil");
      await expect(reglage).toContainText("Une semaine par mois, c’est la lettre du mois, envoyée à tout le monde");
      await expect(reglage).not.toContainText("pause");
      await capturer(page, reglage, `reglage-active-${vue.width}`);
    });

    test(`${vue.width} : profil, réglage désactivé (message après l'arrêt)`, async ({ page }) => {
      const { email } = await compte("desactive", vue);
      await connecter(page, vue, email);
      await page.goto("/profil");
      await page.waitForLoadState("networkidle");
      const reglage = page.getByTestId("lettre-hebdo-profil");
      const interrupteur = reglage.getByRole("switch", { name: "Je reçois la lettre de la semaine" });
      await expect(interrupteur).toBeChecked();
      await interrupteur.click();
      await expect(interrupteur).not.toBeChecked();
      await expect(reglage).toContainText("C’est arrêté. Ton abonnement continue. La lettre du mois s’arrête aussi, sauf si tu t’y es inscrit séparément.");
      await capturer(page, reglage, `reglage-desactive-${vue.width}`);
    });

    test(`${vue.width} : retour de paiement, compte qui reçoit la lettre`, async ({ page }) => {
      const { email } = await compte("paiement", vue);
      await connecter(page, vue, email);
      await page.goto("/abonnement/success?session_id=cs_test_factice_v8&formule=mensuel");
      const ligne = page.getByTestId("lettre-hebdo-paiement");
      await expect(ligne).toHaveAttribute("data-etat", "recoit", { timeout: 30_000 });
      await expect(ligne).toContainText("Tu peux arrêter la lettre de la semaine en un clic");
      await page.waitForLoadState("networkidle");
      await capturer(page, page.locator("[aria-live=polite]").first(), `retour-paiement-office-${vue.width}`);
    });

    test(`${vue.width} : page d'arrêt, avant et après le clic`, async ({ page }) => {
      await page.setViewportSize(vue);
      const { id } = await compte("arret", vue);
      const token = `e2eV8arret_${randomBytes(18).toString("hex")}`;
      await requete(
        `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "activatedAt", "activationOrigin", "unsubscribeToken", "updatedAt") VALUES ($1, $2, true, now(), 'office', $3, now())`,
        [`e2e${randomBytes(8).toString("hex")}`, id, token],
      );
      const bloc = page.getByTestId("arret-lettre-hebdo");
      await page.goto(`/lettre/premium/arreter?token=${token}`);
      await expect(bloc).toContainText("La lettre du mois s’arrête aussi, sauf si tu t’y es inscrit séparément.");
      await capturer(page, page.locator("main"), `arret-defaut-${vue.width}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lettre de la semaine arrêtée");
      await expect(bloc).toContainText("La lettre du mois s’arrête aussi");
      await capturer(page, page.locator("main"), `arret-succes-${vue.width}`);
    });

    test(`${vue.width} : CGU article 10`, async ({ page }) => {
      await page.setViewportSize({ width: vue.width, height: 1600 });
      await page.goto("/cgu");
      const cgu = page.locator("section").filter({ has: page.getByTestId("cgu-lettre-hebdo") });
      await expect(cgu).toContainText("La semaine où part la lettre du mois");
      await capturer(page, cgu, `cgu-article-10-${vue.width}`);
    });

    test(`${vue.width} : confidentialité section 8`, async ({ page }) => {
      await page.setViewportSize({ width: vue.width, height: 1600 });
      await page.goto("/confidentialite");
      const lettre = page.locator("section#lettre");
      await expect(lettre).toContainText("sauf la lettre du mois si tu t’y es inscrit séparément");
      await capturer(page, lettre, `confidentialite-section-8-lettre-${vue.width}`);
    });

    test(`${vue.width} : admin Abonnés › Lettre, lettre du mois et ses abonnés Premium`, async ({ page }) => {
      const pass = process.env.CAPTURES_ADMIN_PASSWORD ?? "";
      test.skip(!pass, "CAPTURES_ADMIN_PASSWORD absent");
      await page.setViewportSize({ width: vue.width, height: 1600 });
      await page.goto("/admin");
      await page.getByPlaceholder("Mot de passe admin").fill(pass);
      await page.getByRole("button", { name: "Accéder au backoffice" }).click();
      await page.getByRole("button", { name: "Abonnés" }).click();
      await page.getByRole("button", { name: "Lettre", exact: true }).click();
      const mois = page.locator("li").filter({ hasText: "Lettre du mois 2026-11" });
      await expect(mois.getByTestId("mensuelle-abonnes-premium")).toContainText("Part aussi aux");
      await mois.getByRole("button", { name: "Relire le numéro" }).click();
      await expect(mois).toContainText("Version des abonnés Premium (même approbation)");
      // Textes entiers sur la capture (à l'écran, chaque version défile dans son cadre).
      await page.addStyleTag({ content: "pre { max-height: none !important; }" });
      await capturer(page, mois, `admin-lettre-du-mois-${vue.width}`);
      const w45 = page.locator("li").filter({ hasText: "Lettre de la semaine 2026-W45" });
      await expect(w45).toContainText("Ne part pas : semaine de la lettre du mois");
      await capturer(page, w45, `admin-lettre-w45-${vue.width}`);
    });
  }
});
