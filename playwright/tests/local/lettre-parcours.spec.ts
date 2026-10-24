import { createServer, type Server } from "node:http";
import { test, expect, localSeulement, requete } from "../support/base-locale";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * Lettre s21, parcours complet dans un vrai navigateur (QA s21 B1 et M1) :
 * inscription par le formulaire, e-mail reçu, confirmation PAR LE BOUTON de
 * `/lettre/confirmer` (lien lu dans l'e-mail), puis désinscription PAR LE BOUTON de
 * `/lettre/desinscrire` (lien du pied des numéros, jeton lu en base).
 * Statuts relus en base jetable à chaque étape.
 *
 * Les e-mails partent vers un faux Resend local (`E2E_FAUX_RESEND_PORT`, serveur
 * démarré ici) : le serveur testé doit tourner avec `RESEND_BASE_URL` pointé dessus
 * et une clé `RESEND_API_KEY` factice. Aucun e-mail réel.
 */
const PORT_RESEND = Number(process.env.E2E_FAUX_RESEND_PORT ?? 0);

type Courriel = { to: string; subject: string; text: string };
const courriels: Courriel[] = [];
let fauxResend: Server | null = null;

test.describe.configure({ mode: "serial" });

test.describe("Lettre : inscription, confirmation et désinscription par bouton", () => {
  localSeulement();
  test.skip(!PORT_RESEND, "E2E_FAUX_RESEND_PORT absent : faux Resend requis");

  test.beforeAll(async () => {
    fauxResend = createServer((req, res) => {
      let corps = "";
      req.on("data", (morceau) => (corps += morceau));
      req.on("end", () => {
        try {
          const json = JSON.parse(corps || "{}") as { to?: string | string[]; subject?: string; text?: string };
          courriels.push({ to: ([] as string[]).concat(json.to ?? []).join(","), subject: json.subject ?? "", text: json.text ?? "" });
        } catch {
          // Corps illisible : ignoré, le test échouera faute d'e-mail.
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ id: `e2e-${courriels.length}` }));
      });
    });
    await new Promise<void>((ok) => fauxResend?.listen(PORT_RESEND, "127.0.0.1", ok));
  });

  test.afterAll(async () => {
    await new Promise<void>((ok) => (fauxResend ? fauxResend.close(() => ok()) : ok()));
  });

  async function lienRecu(email: string, chemin: RegExp): Promise<string> {
    await expect.poll(() => courriels.find((c) => c.to === email && chemin.test(c.text)), { timeout: 15_000 }).toBeTruthy();
    const courriel = courriels.filter((c) => c.to === email && chemin.test(c.text)).pop() as Courriel;
    const lien = courriel.text.match(new RegExp(`https?://[^\\s]*${chemin.source}[^\\s]*`))?.[0];
    expect(lien, `lien ${chemin} dans l'e-mail`).toBeTruthy();
    return new URL(lien as string).pathname + new URL(lien as string).search;
  }

  async function statut(email: string): Promise<string | undefined> {
    return (await requete<{ status: string }>(`SELECT status FROM "NewsletterSubscriber" WHERE email = $1`, [email]))[0]?.status;
  }

  async function sInscrire(page: import("@playwright/test").Page, email: string) {
    await page.goto("/lettre");
    await page.getByLabel(TEXTES_LETTRE.formulaire.label).fill(email);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }).click();
    await expect(page.getByText(TEXTES_LETTRE.succes.titre)).toBeVisible();
  }

  for (const largeur of [375, 1280]) {
    test(`parcours complet à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 800 });
      const email = `e2e-lettre-${largeur}-${Date.now().toString(36)}@example.com`;

      // 1. Inscription : ligne en attente, e-mail de confirmation reçu.
      await sInscrire(page, email);
      expect(await statut(email)).toBe("PENDING");
      const confirmer = await lienRecu(email, /\/lettre\/confirmer\?token=/);

      // 2. Un autre site ne confirme rien et n'obtient jamais de JSON brut.
      const action = `/api/newsletter/confirm/${new URLSearchParams(confirmer.split("?")[1]).get("token")}`;
      const pirate = await page.request.post(action, {
        headers: { origin: "https://pirate.example", "sec-fetch-site": "cross-site" },
        maxRedirects: 0,
      });
      expect(pirate.status()).toBe(303);
      expect(pirate.headers()["location"]).toMatch(/\/lettre\?statut=erreur$/);
      expect(await statut(email)).toBe("PENDING");

      // 3. Confirmation par le bouton de la page (politique same-origin : vraie origine envoyée).
      const pageConfirmer = await page.goto(confirmer);
      expect(pageConfirmer?.headers()["referrer-policy"]).toBe("same-origin");
      const envoi = page.waitForRequest((r) => r.method() === "POST" && r.url().includes("/api/newsletter/confirm/"));
      await page.getByRole("button", { name: TEXTES_LETTRE.page.confirmer.bouton }).click();
      expect((await envoi).headers()["origin"]).toBe(new URL(page.url()).origin);
      await expect(page).toHaveURL(/\/lettre\?statut=confirmee/);
      await expect(page.getByText(TEXTES_LETTRE.statuts.confirmee.titre)).toBeVisible();
      // QA s21 m2 : plus de formulaire d'inscription sous la confirmation.
      await expect(page.getByLabel(TEXTES_LETTRE.formulaire.label)).toHaveCount(0);
      expect(await statut(email)).toBe("CONFIRMED");

      // 4. Désinscription par le lien du pied des numéros (`buildUnsubscribeUrl`), jeton relu
      //    en base (une nouvelle demande d'inscription juste après est freinée, anti-abus).
      const [{ unsubscribeToken }] = await requete<{ unsubscribeToken: string }>(
        `SELECT "unsubscribeToken" FROM "NewsletterSubscriber" WHERE email = $1`,
        [email],
      );
      await page.goto(`/lettre/desinscrire?token=${encodeURIComponent(unsubscribeToken)}`);
      expect(await statut(email)).toBe("CONFIRMED");
      await page.getByRole("button", { name: TEXTES_LETTRE.page.desinscrire.bouton }).click();
      await expect(page).toHaveURL(/\/lettre\?statut=desinscrit/);
      await expect(page.getByText(TEXTES_LETTRE.statuts.desinscrit.titre)).toBeVisible();
      expect(await statut(email)).toBe("UNSUBSCRIBED");
    });
  }
});
