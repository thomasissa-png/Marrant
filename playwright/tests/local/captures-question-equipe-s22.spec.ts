import { createServer, type Server } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";

/**
 * Captures et preuves de « Ta question à l'équipe » (tour 2, s22), sur BUILD DE PRODUCTION,
 * base jetable et faux Resend local (aucun e-mail réel). Sur demande seulement :
 * `CAPTURES_QUESTION_EQUIPE=1` (jamais en CI : le faux Resend occupe le port partagé).
 * Sortie : docs/qa/captures-question-equipe-s22/. Chaque capture vérifie l'absence de
 * débordement horizontal (scrollWidth de la page ET de l'encadré).
 *
 * États obtenus par le vrai serveur : vide, envoi en cours (faux Resend lent, 3 s), succès,
 * trop long, champ vide, envoi impossible (faux Resend en panne : 503),
 * trop d'envois court (vraie limite de 3 envois en 10 min), plus Premium (plan passé à FREE
 * en base après l'affichage : 403), session expirée (cookies effacés : 401), focus clavier.
 * Seule exception : « trop d'envois » au-delà de 15 min (limite du jour, 10 envois en 24 h),
 * réponse 429 + Retry-After 7200 simulée par interception réseau (même code client).
 */
const DOSSIER = path.join(__dirname, "..", "..", "..", "docs", "qa", "captures-question-equipe-s22");
const LARGEURS = [1440, 390, 360] as const;
const MOT_DE_PASSE = "E2e-captures-question-2026!";
const PORT_RESEND = Number(process.env.E2E_FAUX_RESEND_PORT ?? 0);
const QUESTION = "Mon chef me chambre sur mes pulls à chaque réunion, devant toute l'équipe, et je reste muet.";

type Mode = "ok" | "lent" | "panne";
let mode: Mode = "ok";
const courriels: Array<{ to: string; subject: string; text: string; replyTo: string }> = [];
let fauxResend: Server | null = null;

test.describe.configure({ mode: "serial" });

async function seConnecter(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}

/** Compte neuf par état et par largeur (la limite d'envois est par compte). */
async function profil(page: Page, largeur: number, cle: string, plan: "FREE" | "PREMIUM" = "PREMIUM"): Promise<string> {
  const email = `e2e-qe-${cle}-${largeur}@exemple.fr`;
  await page.setViewportSize({ width: largeur, height: largeur < 768 ? 800 : 900 });
  await creerCompte(email, MOT_DE_PASSE, plan);
  await seConnecter(page, email);
  await page.goto("/profil");
  await expect(page.getByRole("heading", { level: 1, name: "Mon profil" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  return email;
}

async function sansDebordement(page: Page, el?: Locator): Promise<void> {
  const p = await page.evaluate(() => ({ contenu: document.documentElement.scrollWidth, vue: window.innerWidth }));
  expect(p.contenu, "scrollWidth de la page").toBeLessThanOrEqual(p.vue);
  if (el) {
    const b = await el.evaluate((n) => ({ contenu: n.scrollWidth, boite: n.clientWidth }));
    expect(b.contenu, "scrollWidth de l'élément").toBeLessThanOrEqual(b.boite + 1);
  }
}

/** Capture d'un élément : l'en-tête collant de la page est remis dans le flux pour ne pas masquer le haut de l'élément. */
async function capturer(page: Page, el: Locator, nom: string): Promise<void> {
  await sansDebordement(page, el);
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await el.screenshot({ path: path.join(DOSSIER, `${nom}.png`), animations: "disabled" });
}

const encadre = (page: Page) => page.getByTestId("question-equipe");
const champ = (page: Page) => encadre(page).getByRole("textbox");
const bouton = (page: Page) => encadre(page).getByRole("button");
const alerte = (page: Page) => page.getByTestId("question-equipe-erreur");

async function envoyer(page: Page, texte = QUESTION): Promise<void> {
  await champ(page).fill(texte);
  await bouton(page).click();
}

test.describe("Captures « Ta question à l'équipe » (tour 2)", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_QUESTION_EQUIPE !== "1", "captures sur demande : CAPTURES_QUESTION_EQUIPE=1");
  test.skip(!QUESTION_EQUIPE_OUVERTE, "interrupteur fermé");
  test.skip(!PORT_RESEND, "E2E_FAUX_RESEND_PORT absent : faux Resend requis");

  test.beforeAll(async () => {
    mkdirSync(DOSSIER, { recursive: true });
    fauxResend = createServer((req, res) => {
      let corps = "";
      req.on("data", (m) => (corps += m));
      req.on("end", () => {
        const repondre = () => {
          if (mode === "panne") {
            res.writeHead(500, { "content-type": "application/json" });
            res.end(JSON.stringify({ statusCode: 500, name: "application_error", message: "panne factice" }));
            return;
          }
          try {
            const j = JSON.parse(corps || "{}") as { to?: string | string[]; subject?: string; text?: string; reply_to?: string | string[] };
            courriels.push({
              to: ([] as string[]).concat(j.to ?? []).join(","),
              subject: j.subject ?? "",
              text: j.text ?? "",
              replyTo: ([] as string[]).concat(j.reply_to ?? []).join(","),
            });
          } catch {
            // Corps illisible : ignoré.
          }
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ id: `faux_${courriels.length}` }));
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

  for (const l of LARGEURS) {
    test(`${l} px : vide, champ vide, trop long, focus du champ et du bouton`, async ({ page }) => {
      await profil(page, l, "saisie");
      await capturer(page, encadre(page), `vide-${l}`);
      await bouton(page).click();
      await expect(alerte(page)).toHaveAttribute("data-erreur", "vide");
      await capturer(page, encadre(page), `champ-vide-${l}`);
      await envoyer(page, `${QUESTION} `.repeat(12).slice(0, 1012));
      await expect(alerte(page)).toHaveAttribute("data-erreur", "trop-long");
      await capturer(page, encadre(page), `trop-long-${l}`);
      // Focus clavier : champ (vidé), puis Tab vers le bouton.
      await champ(page).fill("");
      await page.reload();
      await page.waitForLoadState("networkidle");
      await champ(page).focus();
      await capturer(page, encadre(page), `focus-champ-${l}`);
      await page.keyboard.press("Tab");
      await expect(bouton(page)).toBeFocused();
      await capturer(page, encadre(page), `focus-bouton-${l}`);
    });

    test(`${l} px : envoi en cours puis succès (e-mail vers alex@, corps sans rappel interne)`, async ({ page }) => {
      const email = await profil(page, l, "succes");
      const avant = courriels.length;
      mode = "lent";
      await envoyer(page);
      await expect(bouton(page)).toHaveText("Envoi en cours");
      await capturer(page, encadre(page), `envoi-en-cours-${l}`);
      await expect(page.getByTestId("question-equipe-statut")).toContainText("Bien reçu", { timeout: 15_000 });
      await expect(champ(page)).toHaveValue("");
      await capturer(page, encadre(page), `succes-${l}`);
      await expect.poll(() => courriels.length).toBe(avant + 1);
      const c = courriels[courriels.length - 1];
      expect(c.to).toBe("alex@deviens-marrant.fr");
      expect(c.replyTo).toBe(email);
      expect(c.subject).toMatch(/^Ta question à l'équipe · \d{2}\/\d{2} \d{2}:\d{2} \(Paris\)$/);
      expect(c.text).toMatch(new RegExp(`^${QUESTION.replace(/[.*+?^()|[\]\\]/g, "\\$&")}\\n\\nQuestion envoyée depuis ton profil Premium le \\d{2}/\\d{2}/\\d{4} à \\d{2}:\\d{2}\\.$`));
    });

    test(`${l} px : envoi impossible (rien n'est parti)`, async ({ page }) => {
      await profil(page, l, "panne");
      mode = "panne";
      await envoyer(page);
      await expect(alerte(page)).toHaveAttribute("data-erreur", "envoi", { timeout: 15_000 });
      await expect(alerte(page)).toContainText(/pas pu confirmer l.envoi/);
      await expect(champ(page)).toHaveValue(QUESTION);
      await capturer(page, encadre(page), `envoi-impossible-${l}`);
    });

    test(`${l} px : trop d'envois (vraie limite de 10 min, puis limite du jour simulée)`, async ({ page }) => {
      await profil(page, l, "trop");
      const origine = new URL(page.url()).origin;
      for (let i = 0; i < 3; i++) {
        const r = await page.request.post("/api/question-equipe", {
          data: { question: `${QUESTION} (${i})` },
          headers: { origin: origine, "sec-fetch-site": "same-origin" },
        });
        expect(r.status()).toBe(200);
      }
      await envoyer(page);
      await expect(alerte(page)).toHaveAttribute("data-erreur", "trop-court");
      await capturer(page, encadre(page), `trop-envois-court-${l}`);
      await page.route("**/api/question-equipe", (route) =>
        route.fulfill({ status: 429, headers: { "Retry-After": "7200", "content-type": "application/json" }, body: JSON.stringify({ error: "trop" }) }),
      );
      await bouton(page).click();
      await expect(alerte(page)).toHaveAttribute("data-erreur", "trop");
      await capturer(page, encadre(page), `trop-envois-${l}`);
    });

    test(`${l} px : plus Premium (403) et session expirée (401)`, async ({ page }) => {
      const email = await profil(page, l, "fin");
      await requete(`UPDATE "User" SET plan = 'FREE'::"Plan" WHERE email = $1`, [email]);
      await envoyer(page);
      await expect(alerte(page)).toHaveAttribute("data-erreur", "non-premium");
      await expect(bouton(page)).toBeDisabled();
      await expect(alerte(page).getByRole("link", { name: "Voir mon abonnement" })).toHaveAttribute("href", "/abonnement");
      await capturer(page, encadre(page), `plus-premium-${l}`);
      await profil(page, l, "session");
      await page.context().clearCookies();
      await envoyer(page);
      await expect(alerte(page)).toHaveAttribute("data-erreur", "session");
      await capturer(page, encadre(page), `session-expiree-${l}`);
    });

    test(`${l} px : page profil complète, Premium puis gratuit`, async ({ page }) => {
      await profil(page, l, "page-premium");
      await sansDebordement(page);
      await page.screenshot({ path: path.join(DOSSIER, `profil-premium-${l}.png`), fullPage: true, animations: "disabled" });
      await page.context().clearCookies();
      await profil(page, l, "page-gratuit", "FREE");
      await expect(encadre(page)).toHaveCount(0);
      await sansDebordement(page);
      await page.screenshot({ path: path.join(DOSSIER, `profil-gratuit-${l}.png`), fullPage: true, animations: "disabled" });
    });
  }

  test("390 px : confidentialité (parties 4, 6 et 9) et CGU (articles 7 et 10)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/confidentialite");
    const sections = page.locator("section");
    await capturer(page, page.locator("section#question-equipe"), "confidentialite-section-9-390");
    await capturer(page, sections.filter({ has: page.getByTestId("confidentialite-conservation-question-equipe") }), "confidentialite-partie-6-390");
    await capturer(page, sections.filter({ hasText: "4. Prestataires" }), "confidentialite-partie-4-390");
    await page.goto("/cgu");
    await capturer(page, page.locator("section#lettre"), "cgu-article-10-390");
    await capturer(page, page.locator("section").filter({ has: page.getByTestId("cgu-conservation-question-equipe") }), "cgu-article-7-390");
  });
});
