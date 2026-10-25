import { createServer, type Server } from "node:http";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte } from "../support/base-locale";
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";

/**
 * « Ta question à l'équipe » (s22) : encadré du profil, sur base jetable (projet `local`,
 * jamais en production). Même technique d'interrupteur que `lettre-hebdo-s21` : la spec lit
 * `QUESTION_EQUIPE_OUVERTE` ; fermé = encadré absent pour tous et API en 404 ; ouvert (état
 * commité depuis le 25/10, s22) = Premium voit l'encadré, non-Premium non (et l'API lui
 * répond 403).
 *
 * Envoi Premium : vers un faux Resend local (`E2E_FAUX_RESEND_PORT`, serveur démarré ici ;
 * le serveur testé tourne avec `RESEND_BASE_URL=http://127.0.0.1:<port>` et une clé
 * factice). Aucun e-mail réel. Sauté sans faux Resend.
 */
const MOT_DE_PASSE = "E2e-question-equipe-2026!";
const PREMIUM = "e2e-question-premium@exemple.fr";
const GRATUIT = "e2e-question-gratuit@exemple.fr";
const PORT_RESEND = Number(process.env.E2E_FAUX_RESEND_PORT ?? 0);

type Courriel = { to: string; subject: string; replyTo: string; cle: string };
const courriels: Courriel[] = [];
let fauxResend: Server | null = null;

test.describe.configure({ mode: "serial" });

/** Après hydratation de /login (serveur de dev : sinon le formulaire part en GET natif). */
async function seConnecter(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}

async function profil(page: Page, email: string, plan: "FREE" | "PREMIUM"): Promise<void> {
  await creerCompte(email, MOT_DE_PASSE, plan);
  await seConnecter(page, email);
  await page.goto("/profil");
  await expect(page.getByRole("heading", { level: 1, name: "Mon profil" })).toBeVisible();
  await page.waitForLoadState("networkidle");
}

const poser = (page: Page) =>
  page.request.post("/api/question-equipe", {
    data: { question: "Question de test E2E" },
    headers: { origin: new URL(page.url()).origin, "sec-fetch-site": "same-origin" },
  });

test.describe("Ta question à l'équipe : encadré du profil", () => {
  localSeulement();

  test("interrupteur fermé : encadré absent pour un Premium comme pour un non-Premium, API en 404", async ({ page }) => {
    test.skip(QUESTION_EQUIPE_OUVERTE, "interrupteur ouvert : voir les tests suivants");
    await profil(page, PREMIUM, "PREMIUM");
    await expect(page.getByTestId("question-equipe")).toHaveCount(0);
    expect((await poser(page)).status()).toBe(404);
    await page.context().clearCookies();
    await profil(page, GRATUIT, "FREE");
    await expect(page.getByTestId("question-equipe")).toHaveCount(0);
  });

  for (const largeur of [375, 1280]) {
    test(`${largeur} px, interrupteur ouvert : Premium voit l'encadré (champ, compteur, mention)`, async ({ page }) => {
      test.skip(!QUESTION_EQUIPE_OUVERTE, "interrupteur fermé (état déployé) : vérifié en local en basculant la constante");
      await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 800 });
      await profil(page, PREMIUM, "PREMIUM");
      const encadre = page.getByTestId("question-equipe");
      await expect(encadre).toBeVisible();
      await expect(encadre.getByRole("textbox")).toBeVisible();
      await expect(encadre).toContainText(/0 \/ 1\s000 caractères/);
      await expect(encadre.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite#question-equipe");
      // Aucun débordement horizontal de l'encadré.
      const largeurs = await encadre.evaluate((el) => ({ contenu: el.scrollWidth, boite: el.clientWidth }));
      expect(largeurs.contenu).toBeLessThanOrEqual(largeurs.boite + 1);
    });
  }

  test("interrupteur ouvert : non-Premium ne voit pas l'encadré, l'API lui répond 403", async ({ page }) => {
    test.skip(!QUESTION_EQUIPE_OUVERTE, "interrupteur fermé (état déployé) : vérifié en local en basculant la constante");
    await profil(page, GRATUIT, "FREE");
    await expect(page.getByTestId("question-equipe")).toHaveCount(0);
    expect((await poser(page)).status()).toBe(403);
  });
});

test.describe("Ta question à l'équipe : envoi Premium vers le faux Resend", () => {
  localSeulement();
  test.skip(!QUESTION_EQUIPE_OUVERTE, "interrupteur fermé (état déployé) : vérifié en local en basculant la constante");
  test.skip(!PORT_RESEND, "E2E_FAUX_RESEND_PORT absent : faux Resend requis");

  test.beforeAll(async () => {
    fauxResend = createServer((req, res) => {
      let corps = "";
      req.on("data", (m) => (corps += m));
      req.on("end", () => {
        try {
          const j = JSON.parse(corps || "{}") as { to?: string | string[]; subject?: string; reply_to?: string | string[]; replyTo?: string };
          courriels.push({
            to: ([] as string[]).concat(j.to ?? []).join(","),
            subject: j.subject ?? "",
            replyTo: ([] as string[]).concat(j.reply_to ?? j.replyTo ?? []).join(","),
            cle: String(req.headers["idempotency-key"] ?? ""),
          });
        } catch {
          // Corps illisible : ignoré, le test échouera faute d'e-mail.
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ id: `faux_${courriels.length}` }));
      });
    });
    await new Promise<void>((ok) => fauxResend?.listen(PORT_RESEND, "127.0.0.1", ok));
  });

  test.afterAll(async () => {
    await new Promise<void>((ok) => (fauxResend ? fauxResend.close(() => ok()) : ok()));
  });

  test("envoi : succès affiché, un e-mail vers alex@, objet horodaté, Reply-To du compte, Idempotency-Key", async ({ page }) => {
    await profil(page, PREMIUM, "PREMIUM");
    const encadre = page.getByTestId("question-equipe");
    await encadre.getByRole("textbox").fill("Mon collègue me chambre sur mes chaussettes, je réponds quoi ?");
    await encadre.getByRole("button", { name: /envoyer/i }).click();
    // Succès : le champ n'est vidé qu'après une réponse 200.
    await expect(encadre.getByRole("textbox")).toHaveValue("", { timeout: 15_000 });
    await expect(page.getByTestId("question-equipe-statut")).not.toBeEmpty();
    await expect.poll(() => courriels.length, { timeout: 15_000 }).toBe(1);
    const [c] = courriels;
    expect(c.to).toBe("alex@deviens-marrant.fr");
    expect(c.subject).toMatch(/^Ta question à l'équipe · \d{2}\/\d{2} \d{2}:\d{2} \(Paris\)$/);
    expect(c.replyTo).toBe(PREMIUM);
    expect(c.cle).toMatch(/^question-equipe\/[0-9a-f]{64}$/);
  });
});
