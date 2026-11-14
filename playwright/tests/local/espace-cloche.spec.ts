import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { nomCloche, TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { TEXTES_CLOCHE as C } from "@/config/textes/espace-cloche";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";

/**
 * Espace client, lot D8 (s24, plan §3) : contenu du panneau de la cloche (maquette `aujourdhui.html#cloche=…`,
 * architecture 2.9) et confirmation avant « Retirer de mon historique » (décision de Thomas du 13/11).
 * Fermé (CI) : aucune cloche, route 404. Ouvert (`E2E_ESPACE_OUVERT=1`) : pastille et nom au singulier pour
 * une réponse posée en base ; feuille basse à 375 px, panneau ancré sous la cloche à 1280 px (D11c) ; Échap, clic dehors et
 * « Fermer » ferment, focus rendu au bouton, focus piégé ; ouvrir le panneau ne lit rien (rechargement) ;
 * ouvrir le fil éteint la pastille et retire la ligne ; état vide et nouveautés (contenu servi par une route
 * simulée : le carnet du mois rend l'état vide impossible en novembre) ; confirmation du retrait au clavier.
 * `E2E_CAPTURES_D8` : dossier des captures (thème sombre, 320, 375, 768, 1280, 375 à 200 %).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const CAPTURES = process.env.E2E_CAPTURES_D8 ?? "";
const MOT_DE_PASSE = "E2e-espace-cloche-D8";

async function compte(browser: Browser): Promise<{ id: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d8-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { id, cookies };
}

/** Un fil posé en base, avec ou sans réponse de l'équipe (non lue : `ouvertParAbonneLe` nul). */
async function fil(userId: string, repondu: boolean): Promise<string> {
  const id = `e2ed8${Math.random().toString(36).slice(2, 14)}`;
  const hier = new Date(Date.now() - 86_400_000).toISOString();
  await requete(
    `INSERT INTO "EquipeFil" (id, "userId", type, cle, statut, "creeLe", "dernierMessageLe") VALUES ($1, $2, 'SITUATION', $1, $3, $4::timestamptz, $4::timestamptz)`,
    [id, userId, repondu ? "REPONDU" : "EN_ATTENTE", hier],
  );
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'ABONNE', 'Un collègue me chambre en réunion.', $3::timestamptz)`, [`${id}a`, id, hier]);
  if (repondu) await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'EQUIPE', 'On rit avec, pas contre.', now())`, [`${id}e`, id]);
  return id;
}

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, s] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${s}.png`) });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

const servir = (page: Page, corps: unknown) =>
  page.route("**/api/espace/cloche", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(corps) }));

test.describe("espace client, cloche (s24, lot D8)", () => {
  localSeulement();

  test("interrupteur fermé : aucune cloche pour l'abonné, route 404", async ({ browser, page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    await page.context().addCookies((await compte(browser)).cookies);
    await page.goto("/conseils");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Notifications/ })).toHaveCount(0);
    for (const methode of ["GET", "POST"] as const) expect((await page.request.fetch("/api/espace/cloche", { method: methode })).status()).toBe(404);
  });

  test.describe("abonné, interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis (serveur construit interrupteur ouvert)");

    test("réponse non lue : pastille, feuille basse puis fenêtre, fermetures et focus ; le panneau ne lit rien, le fil éteint", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const filId = await fil(id, true);
      await fil(id, false);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace");
      const cloche = page.getByRole("banner").getByRole("button", { name: nomCloche(1) });
      await expect(cloche).toBeVisible();
      await expect(cloche.locator("[data-pastille]")).toBeVisible();
      await cloche.click();
      const panneau = page.getByRole("dialog", { name: T.cloche.titre });
      await expect(panneau).toBeVisible();
      await expect(panneau.getByRole("button", { name: T.cloche.fermer })).toBeFocused();
      const ligne = panneau.getByRole("link", { name: new RegExp(Q.types.SITUATION.nom) });
      await expect(panneau.getByRole("heading", { name: C.groupes.reponses })).toBeVisible();
      await expect(ligne).toHaveAttribute("href", `/mon-espace/questions/${filId}`);
      expect((await ligne.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      const feuille = (await panneau.boundingBox())!;
      expect(Math.abs(feuille.y + feuille.height - 812)).toBeLessThanOrEqual(1); // feuille basse
      expect(feuille.width).toBeGreaterThanOrEqual(374);
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");
        expect(await panneau.evaluate((p) => p.contains(document.activeElement))).toBe(true);
      }
      // 200 % de texte (188 x 406) : rien ne sort du panneau, « Fermer » entier.
      await page.setViewportSize({ width: 188, height: 406 });
      const fermer = (await panneau.getByRole("button", { name: T.cloche.fermer }).boundingBox())!;
      expect(fermer.x + fermer.width).toBeLessThanOrEqual(188);
      expect(await panneau.evaluate((p) => p.scrollWidth <= p.clientWidth)).toBe(true);
      await page.setViewportSize({ width: 375, height: 812 });
      await capturer(page, "reponse-non-lue");
      await page.keyboard.press("Escape");
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      await cloche.click();
      await page.mouse.click(10, 10); // dehors
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      await cloche.click();
      await panneau.getByRole("button", { name: T.cloche.fermer }).click();
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      // Ouvrir le panneau ne lit rien : même nom après rechargement, rien d'écrit en base.
      await page.reload();
      await expect(page.getByRole("banner").getByRole("button", { name: nomCloche(1) })).toBeVisible();
      expect((await requete<{ lu: Date | null }>(`SELECT "ouvertParAbonneLe" AS lu FROM "EquipeFil" WHERE id = $1`, [filId]))[0].lu).toBeNull();
      // Lot D11c (revue d'harmonie, défaut 9) : sur ordinateur, panneau ancré sous la cloche (bord droit aligné,
      // 8 px dessous), sans voile, comme « Plus » et le menu du compte.
      await page.setViewportSize({ width: 1280, height: 900 });
      const clocheBureau = page.getByRole("banner").getByRole("button", { name: nomCloche(1) });
      // Mesurée avant l'ouverture : panneau ouvert, le reste de la page est masqué aux lecteurs d'écran (modal).
      const bouton = (await clocheBureau.boundingBox())!;
      await clocheBureau.click();
      const fenetre = (await panneau.boundingBox())!;
      expect(Math.abs(fenetre.x + fenetre.width - (bouton.x + bouton.width))).toBeLessThanOrEqual(1);
      expect(Math.abs(fenetre.y - (bouton.y + bouton.height + 8))).toBeLessThanOrEqual(1);
      expect(fenetre.width).toBe(320);
      expect(await page.locator(".bg-black\\/60").filter({ visible: true }).count()).toBe(0);
      // Ouvrir le fil : la ligne disparaît, la pastille s'éteint.
      const ouvert = page.waitForResponse((r) => r.url().endsWith(`/api/espace/questions/${filId}/ouvert`) && r.status() === 200);
      await panneau.getByRole("link", { name: new RegExp(Q.types.SITUATION.nom) }).click();
      await expect(page).toHaveURL(new RegExp(`/mon-espace/questions/${filId}$`));
      await ouvert;
      await page.goto("/mon-espace");
      const eteinte = page.getByRole("banner").getByRole("button", { name: nomCloche(0) });
      await expect(eteinte).toBeVisible();
      await expect(eteinte.locator("[data-pastille]")).toHaveCount(0);
      await eteinte.click();
      await expect(panneau.getByRole("heading", { name: C.groupes.reponses })).toHaveCount(0);
    });

    test("état vide et nouveautés : texte validé, aucune pastille, nom « aucune » quelles que soient les lignes", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.context().addCookies((await compte(browser)).cookies);
      await servir(page, { nonLues: 0, reponses: [], nouveautes: [], lettre: null });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace");
      const cloche = page.getByRole("banner").getByRole("button", { name: nomCloche(0) });
      await cloche.click();
      const panneau = page.getByRole("dialog", { name: T.cloche.titre });
      await expect(panneau.getByText(T.cloche.vide)).toBeVisible();
      await capturer(page, "vide");
      await page.unroute("**/api/espace/cloche");
      await servir(page, {
        nonLues: 0,
        reponses: [],
        nouveautes: [
          { genre: "situations", le: "2026-11-10", href: "/mon-espace/quoi-repondre" },
          { genre: "bibliotheque", le: "2026-11-09", href: "/mon-espace/bibliotheque" },
          { genre: "carnet", le: "2026-11-01", href: "/carnet/2026-11" },
        ],
        lettre: { numero: "2026-W46", titre: "La lettre du jeudi 12 novembre", href: "/mon-espace/lettres/2026-W46" },
      });
      await page.reload();
      await page.getByRole("banner").getByRole("button", { name: nomCloche(0) }).click();
      await expect(panneau.getByRole("link")).toHaveText([C.lignes.situations, C.lignes.bibliotheque, C.lignes.carnet, "La lettre du jeudi 12 novembre"]);
      await expect(page.locator("[data-pastille]")).toHaveCount(0);
      await capturer(page, "nouveautes");
    });

    test("« Retirer de mon historique » : confirmation au clavier, Échap = Annuler, effacement définitif en base", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const filId = await fil(id, true);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/questions");
      const origine = page.locator(`[data-fil="${filId}"]`).getByRole("button", { name: Q.envois.retirer });
      await origine.focus();
      await page.keyboard.press("Enter");
      const dialogue = page.getByRole("alertdialog", { name: Q.confirmationRetrait.question });
      await expect(dialogue.getByRole("button", { name: Q.confirmationRetrait.annuler })).toBeFocused();
      await capturer(page, "confirmation-retrait");
      await page.keyboard.press("Escape");
      await expect(dialogue).toBeHidden();
      await expect(origine).toBeFocused();
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [filId]))[0].n).toBe(2);
      await page.keyboard.press("Enter");
      await page.keyboard.press("Shift+Tab"); // focus piégé : « Retirer », juste avant « Annuler »
      await expect(dialogue.getByRole("button", { name: Q.confirmationRetrait.retirer })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByText(Q.envois.retire)).toBeFocused();
      await capturer(page, "retire");
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeFil" WHERE id = $1`, [filId]))[0].n).toBe(0);
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [filId]))[0].n).toBe(0);
      const api = await (await page.request.get("/api/espace/questions")).text();
      expect(api).not.toContain(filId);
    });
  });
});
