import { createServer, type Server } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte } from "../support/base-locale";
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";

/**
 * Captures v3 (s22, après la relecture finale et la revue design v2), sur BUILD DE PRODUCTION,
 * base jetable et faux Resend local (aucun e-mail réel). Sur demande : `CAPTURES_QUESTION_EQUIPE=1`.
 * Sortie : docs/qa/captures-question-equipe-s22/v3-*.png. Vérifie à chaque capture : pas de
 * débordement, champ en 16 px (pas de zoom iOS, paysage compris), bordure `border-input` #707070.
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const VUES = [
  { nom: "360", width: 360, height: 800 },
  { nom: "390", width: 390, height: 844 },
  { nom: "paysage-844x390", width: 844, height: 390 },
] as const;
const MOT_DE_PASSE = "E2e-captures-question-2026!";
const PORT_RESEND = Number(process.env.E2E_FAUX_RESEND_PORT ?? 0);
const QUESTION = "Mon chef me chambre sur mes pulls à chaque réunion, devant toute l'équipe, et je reste muet.";

const PASSAGE = Date.now().toString(36);
let mode: "ok" | "lent" | "panne" = "ok";
let fauxResend: Server | null = null;

test.describe.configure({ mode: "serial" });

async function connecter(page: Page, vue: { width: number; height: number }, cle: string): Promise<void> {
  // Compte neuf à chaque passage : la limite de 3 envois en 10 minutes est par compte.
  const email = `e2e-qe3-${cle}-${vue.width}x${vue.height}-${PASSAGE}@exemple.fr`;
  await page.setViewportSize(vue);
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}

async function profil(page: Page, vue: { width: number; height: number }, cle: string): Promise<void> {
  await connecter(page, vue, cle);
  await page.goto("/profil");
  await expect(page.getByRole("heading", { level: 1, name: "Mon profil" })).toBeVisible();
  await page.waitForLoadState("networkidle");
}

async function capturer(page: Page, el: Locator, nom: string): Promise<void> {
  // En-tête collant remis dans le flux AVANT la mesure (sinon le bas de l'élément est coupé, vu en v2).
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => ok(null))));
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  const b = await el.evaluate((n) => ({ contenu: n.scrollWidth, boite: n.clientWidth }));
  expect(b.contenu, "scrollWidth de l'élément").toBeLessThanOrEqual(b.boite + 1);
  await el.screenshot({ path: path.join(DOSSIER, `v3-${nom}.png`), animations: "disabled" });
}

const encadre = (page: Page) => page.getByTestId("question-equipe");
const champ = (page: Page) => encadre(page).getByRole("textbox");
const bouton = (page: Page) => encadre(page).getByRole("button");
const alerte = (page: Page) => page.getByTestId("question-equipe-erreur");

test.describe("Captures v3 « Ta question à l'équipe » et case de la lettre de la semaine", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_QUESTION_EQUIPE !== "1", "captures sur demande : CAPTURES_QUESTION_EQUIPE=1");
  test.skip(!QUESTION_EQUIPE_OUVERTE, "interrupteur fermé");
  test.skip(!PORT_RESEND, "E2E_FAUX_RESEND_PORT absent : faux Resend requis");

  test.beforeAll(async () => {
    mkdirSync(DOSSIER, { recursive: true });
    fauxResend = createServer((req, res) => {
      req.resume();
      req.on("end", () => {
        const repondre = () => {
          res.writeHead(mode === "panne" ? 500 : 200, { "content-type": "application/json" });
          res.end(JSON.stringify(mode === "panne" ? { statusCode: 500, name: "application_error", message: "panne factice" } : { id: "faux_v3" }));
        };
        if (mode === "lent") setTimeout(repondre, 3_000);
        else repondre();
      });
    });
    await new Promise<void>((ok) => fauxResend?.listen(PORT_RESEND, "127.0.0.1", ok));
  });

  test.afterAll(async () => {
    await new Promise<void>((ok) => (fauxResend ? fauxResend.close(() => ok()) : ok()));
  });

  test.afterEach(() => {
    mode = "ok";
  });

  for (const vue of VUES) {
    test(`${vue.nom} : champ, focus, envoi impossible, succès`, async ({ page }) => {
      await profil(page, vue, "etats");
      const style = await champ(page).evaluate((n) => ({ taille: getComputedStyle(n).fontSize, bordure: getComputedStyle(n).borderTopColor }));
      expect(style).toEqual({ taille: "16px", bordure: "rgb(112, 112, 112)" });
      await capturer(page, encadre(page), `champ-${vue.nom}`);
      await champ(page).focus();
      await capturer(page, encadre(page), `focus-champ-${vue.nom}`);
      mode = "panne";
      await champ(page).fill(QUESTION);
      await bouton(page).click();
      await expect(alerte(page)).toHaveAttribute("data-erreur", "envoi", { timeout: 15_000 });
      await expect(alerte(page)).toContainText(/On n.a pas pu confirmer l.envoi/);
      await expect(champ(page)).toHaveValue(QUESTION);
      await capturer(page, encadre(page), `envoi-impossible-${vue.nom}`);
      mode = "lent";
      await bouton(page).click();
      await expect(bouton(page)).toHaveText("Envoi en cours");
      await capturer(page, encadre(page), `envoi-en-cours-${vue.nom}`);
      await expect(page.getByTestId("question-equipe-statut")).toContainText("Bien reçu", { timeout: 15_000 });
      await capturer(page, encadre(page), `succes-${vue.nom}`);
    });
  }

  test("390 et 1440 : profil Premium complet avec la case de la lettre de la semaine", async ({ page }) => {
    test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");
    for (const vue of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await page.context().clearCookies();
      await profil(page, vue, "page");
      const caseHebdo = page.getByTestId("lettre-hebdo-profil");
      // s22 (inscription d'office) : la case est devenue un réglage (captures v4 : `captures-inscription-office-s22-v4`).
      await expect(caseHebdo.getByRole("switch")).toBeVisible();
      await capturer(page, caseHebdo, `case-hebdo-profil-${vue.width}`);
      await page.screenshot({ path: path.join(DOSSIER, `v3-profil-premium-${vue.width}.png`), fullPage: true, animations: "disabled" });
    }
  });

  test("390 : retour de paiement avec la case de la lettre de la semaine", async ({ page }) => {
    test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "inscriptions hebdo fermées");
    await connecter(page, { width: 390, height: 844 }, "paiement");
    await page.goto("/abonnement/success?session_id=cs_test_factice_v3&formule=mensuel");
    const caseHebdo = page.getByTestId("lettre-hebdo-paiement");
    await expect(caseHebdo).toBeVisible({ timeout: 30_000 });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(DOSSIER, "v3-retour-paiement-390.png"), fullPage: true, animations: "disabled" });
  });

  test("390 : confidentialité (parties 6 et 9) et CGU (articles 7 et 10)", async ({ page }) => {
    // Vue haute : un extrait plus haut que la vue était coupé en bas (captures v2).
    await page.setViewportSize({ width: 390, height: 1600 });
    await page.goto("/confidentialite");
    await capturer(page, page.locator("section#question-equipe"), "confidentialite-section-9-390");
    await capturer(page, page.locator("section").filter({ has: page.getByTestId("confidentialite-conservation-question-equipe") }), "confidentialite-partie-6-390");
    await page.goto("/cgu");
    await capturer(page, page.locator("section#lettre"), "cgu-article-10-390");
    await capturer(page, page.locator("section").filter({ has: page.getByTestId("cgu-conservation-question-equipe") }), "cgu-article-7-390");
  });
});
