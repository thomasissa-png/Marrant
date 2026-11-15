import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { nomCloche, TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { TEXTES_CLOCHE as C } from "@/config/textes/espace-cloche";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { frEspace } from "@/lib/fr-typo";

/**
 * Espace client, lot D8 (s24, plan §3) : contenu du panneau de la cloche (maquette `aujourdhui.html#cloche=…`,
 * architecture 2.9) et confirmation avant « Retirer de mon historique » (décision de Thomas du 13/11).
 * Fermé (CI) : aucune cloche, route 404. Ouvert (`E2E_ESPACE_OUVERT=1`) : pastille et nom au singulier pour
 * une réponse posée en base ; panneau sous l'en-tête à 375 et 1280 px (D11c, s25) ; Échap, clic dehors et
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

    test("réponse non lue : pastille, panneau sous l'en-tête (375 puis 1280 px), fermetures et focus ; le panneau ne lit rien, le fil éteint", async ({ browser, page }) => {
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
      const panneau = page.getByRole("dialog", { name: frEspace(T.cloche.titre) });
      await expect(panneau).toBeVisible();
      await expect(panneau.getByRole("button", { name: frEspace(T.cloche.fermer) })).toBeFocused();
      const ligne = panneau.getByRole("link", { name: new RegExp(Q.types.SITUATION.nom) });
      await expect(panneau.getByRole("heading", { name: frEspace(C.groupes.reponses) })).toBeVisible();
      await expect(ligne).toHaveAttribute("href", `/mon-espace/questions/${filId}`);
      expect((await ligne.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      // s25 (relecture tour 2, design F3 et F4, ux 7) : titre de groupe sur la verticale du texte des lignes ;
      // panneau un cran au-dessus des cartes (fond élevé, ombre, anneau) ; « Répondu le » en texte secondaire
      // (le gris atténué passe sous 4,5:1 sur la ligne survolée).
      const gauche = (el: Element) => {
        const t = el.querySelector("span") ?? el;
        const r = document.createRange();
        r.selectNodeContents(t.firstChild ?? t);
        return Math.round(r.getBoundingClientRect().left);
      };
      expect(await panneau.getByRole("heading", { name: frEspace(C.groupes.reponses) }).evaluate(gauche)).toBe(await ligne.evaluate(gauche));
      expect(await panneau.evaluate((p) => getComputedStyle(p).backgroundColor)).toBe("rgb(42, 42, 42)");
      expect(await panneau.evaluate((p) => getComputedStyle(p).boxShadow)).toMatch(/rgba\(0, 0, 0, 0\.6\)/);
      expect(await ligne.locator("small").evaluate((e) => getComputedStyle(e).color)).toBe("rgb(179, 179, 179)");
      // s25 (relecture tour 1, design F5 et F6, ux) : sous l'en-tête (8 px sous son filet), largeur de la coque.
      // Panneau ouvert, l'en-tête est masqué aux lecteurs d'écran (modal) : lu par son attribut, pas par son rôle.
      const basEnTete = await page.locator("[data-en-tete-universel]").evaluate((h) => h.getBoundingClientRect().bottom);
      const feuille = (await panneau.boundingBox())!;
      expect(Math.abs(feuille.y - (basEnTete + 8))).toBeLessThanOrEqual(1);
      expect(Math.abs(feuille.x - 16)).toBeLessThanOrEqual(1);
      expect(Math.abs(feuille.x + feuille.width - (375 - 16))).toBeLessThanOrEqual(1);
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");
        expect(await panneau.evaluate((p) => p.contains(document.activeElement))).toBe(true);
      }
      // 200 % de texte (188 x 406) : rien ne sort du panneau, « Fermer » entier.
      await page.setViewportSize({ width: 188, height: 406 });
      const fermer = (await panneau.getByRole("button", { name: frEspace(T.cloche.fermer) }).boundingBox())!;
      expect(fermer.x + fermer.width).toBeLessThanOrEqual(188);
      expect(await panneau.evaluate((p) => p.scrollWidth <= p.clientWidth)).toBe(true);
      await page.setViewportSize({ width: 375, height: 812 });
      await capturer(page, "reponse-non-lue");
      await page.keyboard.press("Escape");
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      await cloche.click();
      // s25 : plus de voile sous 768 px ; le clic dehors est lu par Radix une fois le panneau monté. Radix
      // (DismissableLayer) n'écoute le clic dehors qu'après un `setTimeout(0)` posé au montage : un clic plus rapide
      // tombait avant l'écouteur, ignoré (une fois sur deux en CI, QA s25). On laisse passer deux images et ce délai,
      // moins qu'un geste humain ; le premier clic dehors doit toujours fermer.
      await expect(panneau).toBeVisible();
      for (let i = 0; i < 2; i++) await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))));
      await page.mouse.click(10, 10); // dehors
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      await cloche.click();
      await panneau.getByRole("button", { name: frEspace(T.cloche.fermer) }).click();
      await expect(panneau).toBeHidden();
      await expect(cloche).toBeFocused();
      // Ouvrir le panneau ne lit rien : même nom après rechargement, rien d'écrit en base.
      await page.reload();
      await expect(page.getByRole("banner").getByRole("button", { name: nomCloche(1) })).toBeVisible();
      expect((await requete<{ lu: Date | null }>(`SELECT "ouvertParAbonneLe" AS lu FROM "EquipeFil" WHERE id = $1`, [filId]))[0].lu).toBeNull();
      // Lot D11c (revue d'harmonie, défaut 9), s25 (relecture tour 1, F5 et F6) : sur ordinateur, panneau 8 px sous
      // le filet de l'en-tête, bord droit sur la marge de la coque comme le menu du compte, sans voile.
      await page.setViewportSize({ width: 1280, height: 900 });
      const clocheBureau = page.getByRole("banner").getByRole("button", { name: nomCloche(1) });
      // Mesurée avant l'ouverture : panneau ouvert, le reste de la page est masqué aux lecteurs d'écran (modal).
      const enTete = (await page.getByRole("banner").boundingBox())!;
      await clocheBureau.click();
      const fenetre = (await panneau.boundingBox())!;
      expect(Math.abs(fenetre.x + fenetre.width - (1280 - 32))).toBeLessThanOrEqual(1);
      expect(Math.abs(fenetre.y - (enTete.y + enTete.height + 8))).toBeLessThanOrEqual(1);
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
      await expect(panneau.getByRole("heading", { name: frEspace(C.groupes.reponses) })).toHaveCount(0);
    });

    test("état vide et nouveautés : texte validé, aucune pastille, nom « aucune » quelles que soient les lignes", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.context().addCookies((await compte(browser)).cookies);
      await servir(page, { nonLues: 0, reponses: [], nouveautes: [], lettre: null });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace");
      const cloche = page.getByRole("banner").getByRole("button", { name: nomCloche(0) });
      await cloche.click();
      const panneau = page.getByRole("dialog", { name: frEspace(T.cloche.titre) });
      await expect(panneau.getByText(frEspace(T.cloche.vide))).toBeVisible();
      // s25 (relecture design tour 2, piste) : même air au-dessus (sous le texte du titre) et en dessous (bord bas).
      const air = await panneau.evaluate((p) => {
        const boite = (el: Element) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return r.getBoundingClientRect();
        };
        const titre = boite(p.querySelector("h2")!);
        const phrase = boite(Array.from(p.querySelectorAll("p")).pop()!);
        return { haut: Math.round(phrase.top - titre.bottom), bas: Math.round(p.getBoundingClientRect().bottom - phrase.bottom) };
      });
      expect(Math.abs(air.haut - air.bas), `air de l'état vide : ${air.haut} au-dessus, ${air.bas} en dessous`).toBeLessThanOrEqual(1);
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

    // s25 (relecture design tour 5, critère 5) : titre « Notifications », titres de groupe, texte des lignes et phrase
    // vide sur une seule verticale (±0,5 px), comme la carte « Dans ton espace » ; fond de survol et anneau de focus
    // des lignes dans le panneau, avec au moins 2 px d'air jusqu'à son bord (rien de rogné).
    test("tour 5 : titre, groupes, lignes et phrase vide sur une même verticale (320, 375, 768, 1280 px, survol et focus)", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.context().addCookies((await compte(browser)).cookies);
      const plein = {
        nonLues: 1,
        reponses: [{ id: "e2etour5", type: "SITUATION", reponduLe: new Date().toISOString(), href: "/mon-espace/questions/e2etour5" }],
        nouveautes: [{ genre: "carnet", le: "2026-11-01", href: "/carnet/2026-11" }],
        lettre: { numero: "2026-W46", titre: "La lettre du jeudi 12 novembre", href: "/mon-espace/lettres/2026-W46" },
      };
      const panneau = page.getByRole("dialog", { name: frEspace(T.cloche.titre) });
      const verticales = () =>
        panneau.evaluate((p) => {
          const gauche = (el: Element) => {
            const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent!.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
            const r = document.createRange();
            r.selectNodeContents(w.nextNode()!);
            return r.getBoundingClientRect().left;
          };
          const bord = p.getBoundingClientRect();
          const s = getComputedStyle(p);
          const dedans = { g: bord.left + parseFloat(s.borderLeftWidth), d: bord.right - parseFloat(s.borderRightWidth) };
          const lignes = Array.from(p.querySelectorAll("[data-ligne-cloche]"));
          return {
            titre: gauche(p.querySelector("h2")!),
            autres: [...Array.from(p.querySelectorAll("h3")), ...lignes, ...Array.from(p.querySelectorAll("p"))].map((e) => ({ nom: e.textContent!.trim().slice(0, 24), x: gauche(e) })),
            air: lignes.map((a) => Math.min(a.getBoundingClientRect().left - dedans.g, dedans.d - a.getBoundingClientRect().right)),
            defile: p.scrollWidth - p.clientWidth,
          };
        });
      for (const [regime, corps] of [["plein", plein], ["vide", { nonLues: 0, reponses: [], nouveautes: [], lettre: null }]] as const) {
        await page.unroute("**/api/espace/cloche");
        await servir(page, corps);
        for (const [largeur, hauteur] of [[320, 700], [375, 812], [768, 1024], [1280, 900]] as const) {
          await page.setViewportSize({ width: largeur, height: hauteur });
          await page.goto("/vannes");
          await page.getByRole("banner").getByRole("button", { name: /^Notifications/ }).click();
          await expect(regime === "plein" ? panneau.locator("[data-ligne-cloche]") : panneau.getByText(frEspace(T.cloche.vide))).not.toHaveCount(0);
          const m = await verticales();
          const ici = `(${regime}, ${largeur} px)`;
          expect(m.autres.length, `éléments mesurés ${ici}`).toBe(regime === "plein" ? 6 : 1);
          for (const e of m.autres) expect(Math.abs(e.x - m.titre), `« ${e.nom} » sur la verticale du titre ${ici}`).toBeLessThanOrEqual(0.5);
          expect(m.defile, `aucun défilement horizontal ${ici}`).toBe(0);
          if (regime === "plein") {
            for (const a of m.air) expect(a, `fond et anneau des lignes dans le panneau ${ici}`).toBeGreaterThanOrEqual(2);
            const premiere = panneau.locator("[data-ligne-cloche]").first();
            await premiere.hover();
            await expect(premiere).toHaveCSS("background-color", "rgb(58, 58, 58)");
            await page.mouse.move(0, 0);
            await panneau.getByRole("button", { name: frEspace(T.cloche.fermer) }).focus();
            await page.keyboard.press("Tab");
            await expect(premiere).toBeFocused();
            expect(await premiere.evaluate((e) => getComputedStyle(e).boxShadow), `anneau de focus ${ici}`).not.toBe("none");
          }
          await page.keyboard.press("Escape");
        }
      }
    });

    test("« Retirer de mon historique » : confirmation au clavier, Échap = Annuler, effacement définitif en base", async ({ browser, page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const filId = await fil(id, true);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/questions");
      const origine = page.locator(`[data-fil="${filId}"]`).getByRole("button", { name: frEspace(Q.envois.retirer) });
      await origine.focus();
      await page.keyboard.press("Enter");
      const dialogue = page.getByRole("alertdialog", { name: frEspace(Q.confirmationRetrait.question) });
      await expect(dialogue.getByRole("button", { name: frEspace(Q.confirmationRetrait.annuler) })).toBeFocused();
      await capturer(page, "confirmation-retrait");
      await page.keyboard.press("Escape");
      await expect(dialogue).toBeHidden();
      await expect(origine).toBeFocused();
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [filId]))[0].n).toBe(2);
      await page.keyboard.press("Enter");
      await page.keyboard.press("Shift+Tab"); // focus piégé : « Retirer », juste avant « Annuler »
      await expect(dialogue.getByRole("button", { name: frEspace(Q.confirmationRetrait.retirer) })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByText(frEspace(Q.envois.retire))).toBeFocused();
      await capturer(page, "retire");
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeFil" WHERE id = $1`, [filId]))[0].n).toBe(0);
      expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [filId]))[0].n).toBe(0);
      const api = await (await page.request.get("/api/espace/questions")).text();
      expect(api).not.toContain(filId);
    });
  });
});
