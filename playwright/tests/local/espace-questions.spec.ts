import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";

/**
 * Espace client, lot D7 (s24, plan §3) : « Mes questions » (maquette `mes-questions.html`) et l'outil de
 * l'équipe. Fermé (CI) : pages, outil et routes = la 404. Ouvert (`E2E_ESPACE_OUVERT=1`, serveur construit
 * interrupteur ouvert) : états liste, vide (exemples par type), envoi en cours (texte conservé en cas
 * d'échec), répondu (le fil ouvert rend la réponse lue, gardé au rechargement), retard, retiré ; clavier ;
 * 200 % de texte sans débordement ; préremplissage chargé côté navigateur, jamais dans l'adresse, jamais
 * envoyé seul ; ancien abonné : lecture seule par l'API (écran monté par le lot D10 dans « Mon profil »).
 * Les réponses de l'équipe sont posées en base (l'outil exige `ADMIN_PASSWORD`, absent du job e2e).
 * `E2E_CAPTURES_D7` : dossier des captures (thème sombre, 320, 375, 768, 1280, 375 à 200 %).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const CAPTURES = process.env.E2E_CAPTURES_D7 ?? "";
const MOT_DE_PASSE = "E2e-espace-questions-D7";
const PAGE = "/mon-espace/questions";

async function compte(browser: Browser, plan: "PREMIUM" | "FREE" = "PREMIUM"): Promise<{ id: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d7-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { id, cookies };
}

/** Un fil posé en base : `jours` avant maintenant, avec ou sans réponse de l'équipe. */
async function fil(userId: string, type: string, message: string, p: { creeLe: string; reponse?: string; reponduLe?: string }) {
  const id = `e2ed7${Math.random().toString(36).slice(2, 14)}`;
  await requete(
    `INSERT INTO "EquipeFil" (id, "userId", type, cle, statut, "creeLe", "dernierMessageLe") VALUES ($1, $2, $3, $1, $4, $5::timestamptz, $5::timestamptz)`,
    [id, userId, type, p.reponse ? "REPONDU" : "EN_ATTENTE", p.creeLe],
  );
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'ABONNE', $3, $4::timestamptz)`, [`${id}a`, id, message, p.creeLe]);
  if (p.reponse) await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'EQUIPE', $3, $4::timestamptz)`, [`${id}e`, id, p.reponse, p.reponduLe]);
  return id;
}

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, s] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${s}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

const debordement = (page: Page) => page.evaluate(() => Math.max(...Array.from(document.querySelectorAll("main *")).map((e) => e.getBoundingClientRect().right)));

test.describe("espace client, Mes questions (s24, lot D7)", () => {
  localSeulement();

  test("interrupteur fermé : pages, outil de l'équipe et routes = 404, rien d'écrit", async ({ browser, page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    const { id, cookies } = await compte(browser);
    await page.context().addCookies(cookies);
    for (const chemin of [PAGE, `${PAGE}/e2ed7inexistant`, "/admin/questions"]) expect([chemin, (await page.goto(chemin))?.status()]).toEqual([chemin, 404]);
    for (const [methode, chemin] of [
      ["GET", "/api/espace/questions"],
      ["POST", "/api/espace/questions"],
      ["DELETE", "/api/espace/questions/e2ed7inexistant"],
      ["POST", "/api/espace/questions/e2ed7inexistant/messages"],
      ["POST", "/api/espace/questions/e2ed7inexistant/ouvert"],
      ["GET", "/api/admin/questions-equipe"],
      ["POST", "/api/admin/questions-equipe"],
    ] as const) {
      const r = await page.request.fetch(chemin, { method: methode, data: { type: "QUESTION", message: "x", cle: "e2e-cle-ferme" } });
      expect([methode, chemin, r.status()]).toEqual([methode, chemin, 404]);
    }
    expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeFil" WHERE "userId" = $1`, [id]))[0].n).toBe(0);
  });

  test.describe("abonné, interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis (serveur construit interrupteur ouvert)");

    test("vide : un exemple par type et le délai ; envoi en cours, échec (texte conservé), envoyé", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.context().addCookies((await compte(browser)).cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await expect(page.getByRole("heading", { level: 1, name: Q.titre })).toBeVisible();
      for (const t of ["QUESTION", "PROBLEME", "SITUATION"] as const) await expect(page.getByText(Q.types[t].exemple)).toBeVisible();
      await capturer(page, "vide");
      const champ = page.getByLabel(Q.ecrire.champ);
      await champ.fill("Mon coloc me chambre sur ma cuisine, je bloque.");
      let bloquer = true;
      await page.route("**/api/espace/questions", async (route) => {
        if (route.request().method() !== "POST" || !bloquer) return route.fallback();
        await new Promise((r) => setTimeout(r, 600));
        await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "indisponible" }) });
      });
      await page.getByRole("button", { name: Q.ecrire.bouton }).click();
      await expect(page.getByRole("button", { name: Q.ecrire.envoiEnCours })).toBeDisabled();
      await expect(page.getByText("On n'a pas pu confirmer l'envoi.", { exact: false })).toBeVisible();
      await expect(champ).toHaveValue("Mon coloc me chambre sur ma cuisine, je bloque.");
      await capturer(page, "echec-texte-conserve");
      bloquer = false;
      await page.getByRole("button", { name: Q.ecrire.bouton }).click();
      await expect(page.locator("[data-formulaire-question] [role='status']")).toHaveText(Q.ecrire.envoye);
      await expect(champ).toHaveValue("");
      await expect(page.locator("[data-fil]")).toHaveCount(1);
      await expect(page.locator("[data-fil]").getByText(Q.envois.enAttente)).toBeVisible();
    });

    test("liste : en attente, en retard, répondu non lu ; ouvrir le fil le rend lu (rechargement) ; retiré", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const ilYA = (jours: number) => new Date(Date.now() - jours * 86_400_000).toISOString();
      await fil(id, "QUESTION", "Est-ce que ma blague sur les lundis est lourde ?", { creeLe: ilYA(0) });
      const retard = await fil(id, "PROBLEME", "Je n'ai pas accès aux parcours.", { creeLe: ilYA(9) });
      const repondu = await fil(id, "SITUATION", "Un collègue me chambre en réunion.", { creeLe: ilYA(2), reponse: "D'abord la méthode : on rit avec, pas contre.", reponduLe: ilYA(1) });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await expect(page.locator(`[data-fil="${retard}"]`).getByText(Q.envois.enRetard)).toBeVisible();
      await capturer(page, "liste");
      const carte = page.locator(`[data-fil="${repondu}"]`);
      const ouvert = page.waitForResponse((r) => r.url().endsWith(`/api/espace/questions/${repondu}/ouvert`) && r.status() === 200);
      await carte.locator("summary").click();
      await ouvert;
      await expect(carte.getByText(Q.envois.signature)).toBeVisible();
      await expect(carte.getByRole("button", { name: Q.envois.continuer })).toBeVisible();
      await capturer(page, "fil-ouvert");
      expect((await requete<{ lu: Date | null }>(`SELECT "ouvertParAbonneLe" AS lu FROM "EquipeFil" WHERE id = $1`, [repondu]))[0].lu).not.toBeNull();
      await page.reload();
      const appels: string[] = [];
      page.on("request", (r) => r.url().includes("/ouvert") && appels.push(r.url()));
      await page.locator(`[data-fil="${repondu}"] summary`).click();
      await page.waitForTimeout(300);
      expect(appels).toEqual([]); // déjà lu en base
      // Lot D8 (décision du 13/11) : confirmation avant l'effacement, puis effacement DÉFINITIF en base.
      await page.locator(`[data-fil="${retard}"]`).getByRole("button", { name: Q.envois.retirer }).click();
      await page.getByRole("alertdialog", { name: Q.confirmationRetrait.question }).getByRole("button", { name: Q.confirmationRetrait.retirer }).click();
      await expect(page.getByText(Q.envois.retire)).toBeFocused();
      await capturer(page, "retire");
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeFil" WHERE id = $1`, [retard]))[0].n).toBe(0);
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [retard]))[0].n).toBe(0);
    });

    test("clavier : type, message, envoi ; « Continuer » au clavier ; 200 % de texte sans débordement", async ({ browser, page }) => {
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const repondu = await fil(id, "QUESTION", "Une question", { creeLe: new Date(Date.now() - 86_400_000).toISOString(), reponse: "Une réponse", reponduLe: new Date().toISOString() });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(PAGE);
      await page.getByRole("radio", { name: /Une question/ }).focus();
      await page.keyboard.press("ArrowUp");
      await expect(page.getByRole("radio", { name: /Une situation à gérer/ })).toBeChecked();
      await page.keyboard.press("Tab");
      await expect(page.getByLabel(Q.ecrire.champ)).toBeFocused();
      await page.keyboard.type("Au clavier seulement.");
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: Q.ecrire.bouton })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("[data-formulaire-question] [role='status']")).toHaveText(Q.ecrire.envoye);
      const carte = page.locator(`[data-fil="${repondu}"]`);
      await carte.locator("summary").focus();
      await page.keyboard.press("Enter");
      await carte.getByRole("button", { name: Q.envois.continuer }).focus();
      await page.keyboard.press("Enter");
      await expect(carte.getByLabel(Q.ecrire.champ)).toBeFocused();
      for (const largeur of [320, 188]) {
        await page.setViewportSize({ width: largeur, height: 700 });
        await page.waitForTimeout(200);
        expect([largeur, await debordement(page)]).toEqual([largeur, expect.any(Number)]);
        expect(await debordement(page)).toBeLessThanOrEqual(largeur + 1);
        for (const b of await page.locator("main button, main summary").all()) if (await b.isVisible()) expect((await b.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
        // Aucun mot coupé en plein milieu (noms des types, boutons) : chaque mot tient sur une seule ligne.
        const coupes = await page.evaluate(() => {
          const fautifs: string[] = [];
          for (const el of Array.from(document.querySelectorAll("main fieldset label span span, main button"))) {
            for (const texte of Array.from(el.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE)) {
            const contenu = texte.textContent ?? "";
            for (const m of Array.from(contenu.matchAll(/\S+/g))) {
              const r = document.createRange();
              r.setStart(texte, m.index ?? 0);
              r.setEnd(texte, (m.index ?? 0) + m[0].length);
              if (new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size > 1) fautifs.push(m[0]);
            }
            }
          }
          return fautifs;
        });
        expect([largeur, coupes]).toEqual([largeur, []]);
      }
    });

    test("préremplissage : chargé côté navigateur, jamais dans l'adresse, jamais envoyé seul", async ({ browser, page }) => {
      await page.context().addCookies((await compte(browser)).cookies);
      const envois: string[] = [];
      page.on("request", (r) => r.url().includes("/api/espace/questions") && r.method() === "POST" && envois.push(r.url()));
      await page.goto("/mon-espace");
      await page.evaluate(() => sessionStorage.setItem("espace-questions-prefill", JSON.stringify({ type: "SITUATION", texte: "Ma réplique à moi : je la rends." })));
      await page.goto(PAGE);
      await expect(page.getByLabel(Q.ecrire.champ)).toHaveValue("Ma réplique à moi : je la rends.");
      await expect(page.getByRole("radio", { name: /Une situation à gérer/ })).toBeChecked();
      expect(page.url()).not.toMatch(/r%C3%A9plique|texte|prefill/);
      await page.waitForTimeout(500);
      expect(envois).toEqual([]);
      await page.reload();
      await expect(page.getByLabel(Q.ecrire.champ)).toHaveValue("");
    });

    test("ancien abonné : historique en lecture seule par l'API, retrait possible, page = /abonnement", async ({ browser, page }) => {
      const { id, cookies } = await compte(browser, "FREE");
      await requete(`INSERT INTO "Subscription" (id, "userId", "stripeSubscriptionId", "updatedAt") VALUES ($1, $2, $3, now())`, [`${id}s`, id, `sub_e2e_${id}`]);
      const f = await fil(id, "QUESTION", "Avant ma résiliation", { creeLe: new Date().toISOString(), reponse: "Réponse", reponduLe: new Date().toISOString() });
      await page.context().addCookies(cookies);
      const lu = await (await page.request.get("/api/espace/questions")).json();
      expect(lu).toMatchObject({ lectureSeule: true, fils: [expect.objectContaining({ id: f })] });
      expect((await page.request.post("/api/espace/questions", { data: { type: "QUESTION", message: "x", cle: "e2e-cle-ancien" } })).status()).toBe(403);
      expect((await page.request.post(`/api/espace/questions/${f}/messages`, { data: { message: "x", cle: "e2e-cle-ancien2" } })).status()).toBe(403);
      expect((await page.request.delete(`/api/espace/questions/${f}`)).status()).toBe(200);
      await page.goto(PAGE);
      await expect(page).toHaveURL(/\/abonnement/);
    });

    test("outil de l'équipe : page servie (mot de passe admin), API sans mot de passe refusée", async ({ page }) => {
      expect((await page.goto("/admin/questions"))?.status()).toBe(200);
      await expect(page.getByLabel("Mot de passe admin")).toBeVisible();
      expect([401, 500]).toContain((await page.request.get("/api/admin/questions-equipe")).status());
    });
  });
});
