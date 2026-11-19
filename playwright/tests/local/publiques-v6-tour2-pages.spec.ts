import type { Browser, BrowserContext, Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, adresseVisiteur, ESPACE_OUVERT } from "../support/base-locale";
import { CARTE_VERROUILLEE_LABEL } from "@/config/textes/offre";
import { RETOUR_EXERCICE } from "@/config/textes/parcours";

/**
 * v6 tour 2, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-2.md` :
 *  8. /lettre : aucun débordement à 375 px, adresses du dernier numéro en liens courts (sans paramètres) ;
 *  9. /lettre de l'abonné : colonne centrée `max-w-3xl`, H1 centré, cartes deux par ligne ;
 * 11. /vannes : plus de carte floutée sous l'offre, offre au contenu centré, en-tête et titres de section centrés,
 *     réponse FAQ validée affichée et balisée (JSON-LD) ;
 * 13. /profil : « Ta question à l'équipe » dans le cadre à filet ; nouvel abonné : « Prochaine étape » en tête ;
 * 14. /parcours : pastilles du défi de 44 px ; inscrit gratuit : ni « Sans compte. » ni « D'abord ton compte ».
 * Interrupteur fermé : rien de tout cela (contrôlé en fin de fichier).
 */
type Etat = "visiteur" | "FREE" | "PREMIUM";
const PREVERSION = process.env.E2E_COMPTES_PREVERSION === "1";
const MOT_DE_PASSE = PREVERSION ? "preversion-s24" : "E2e-publiques-v6t2-s25";
const REPONSE_VALIDEE =
  "Choisis une catégorie dans les filtres de la liste. Chaque vanne est rangée par contexte, pour que tu trouves en 3 secondes celle qui colle à ta situation plutôt que celle qui jette un froid. Avec Premium, mets tes préférées en favoris : tu les auras sous la main le jour J.";

const comptes = new Map<string, string>();
async function email(cle: "FREE" | "PREMIUM"): Promise<string> {
  if (PREVERSION) return { FREE: "inscrit-gratuit@preversion.test", PREMIUM: "abonne-en-cours@preversion.test" }[cle];
  if (!comptes.has(cle)) {
    const adresse = `e2e-v6t2-${cle.toLowerCase()}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}@example.com`;
    await creerCompte(adresse, MOT_DE_PASSE, cle);
    comptes.set(cle, adresse);
  }
  return comptes.get(cle)!;
}

async function contexte(browser: Browser, etat: Etat, largeur = 1280): Promise<{ c: BrowserContext; page: Page }> {
  const c = await browser.newContext({ viewport: { width: largeur, height: 900 }, locale: "fr-FR", extraHTTPHeaders: { "cf-connecting-ip": adresseVisiteur() } });
  const page = await c.newPage();
  if (etat !== "visiteur") await connecter(page, await email(etat), MOT_DE_PASSE);
  return { c, page };
}

const boite = async (l: Locator) => (await l.boundingBox())!;
const alignement = (l: Locator) => l.evaluate((el) => getComputedStyle(el).textAlign);
const largeurPage = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth);
const plat = (t: string) => t.replace(/[  ]/g, " ").replace(/’/g, "'");

test.describe("v6 tour 2, lot 2 : pages publiques", () => {
  test.beforeEach(() => localSeulement());

  test.describe("interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "serveur construit interrupteur ouvert seulement");

    test("/lettre visiteur et inscrit gratuit : aucun débordement aux 5 largeurs, liens courts sans paramètres", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE"] as const) {
        for (const largeur of [375, 768, 1280, 1456, 1920]) {
          const { c, page } = await contexte(browser, etat, largeur);
          await page.goto("/lettre");
          expect(await largeurPage(page), `${etat} ${largeur}`).toBeLessThanOrEqual(largeur);
          const corps = page.locator("[data-lettre-corps]");
          if ((await corps.count()) > 0) {
            expect(await corps.innerText()).not.toContain("utm_");
            for (const texte of await corps.locator("[data-lettre-lien]").allInnerTexts()) expect(texte).not.toMatch(/[?&#]/);
          }
          await c.close();
        }
      }
    });

    test("/lettre abonné : colonne centrée, H1 centré, cartes deux par ligne dès 640 px", async ({ browser }) => {
      for (const largeur of [768, 1280, 1456, 1920]) {
        const { c, page } = await contexte(browser, "PREMIUM", largeur);
        await page.goto("/lettre");
        const archive = page.locator("[data-lettres-abonne]");
        await expect(archive).toBeVisible();
        expect(await alignement(page.getByRole("heading", { level: 1 }))).toBe("center");
        const b = await boite(archive);
        expect(b.width).toBeLessThanOrEqual(768 + 1);
        expect(Math.abs(b.x + b.width / 2 - largeur / 2)).toBeLessThanOrEqual(24);
        const cartes = archive.locator("[data-lettre]");
        if ((await cartes.count()) >= 2) {
          const [a, d] = [await boite(cartes.nth(0)), await boite(cartes.nth(1))];
          expect(Math.abs(a.y - d.y)).toBeLessThanOrEqual(1);
          // Deux cartes remplissent la colonne (écart de 16 px entre elles), plus de tiers droit vide.
          expect(a.width + d.width).toBeGreaterThan(b.width - 40);
        }
        await c.close();
      }
    });

    // s26 (`docs/design/parcours-vannes-s26.md` §3.1, §3.3, §3.4) : en-tête, titres de section et offre de fin de liste
    // alignés à gauche (plus de centrage forcé autour de l'objet Premium, non restylé) ; FAQ validée inchangée.
    test("/vannes visiteur et inscrit gratuit : offre seule, en-tête et titres à gauche, FAQ validée", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE"] as const) {
        const { c, page } = await contexte(browser, etat);
        await page.goto("/vannes");
        const main = page.locator("main");
        const mur = main.locator("[data-mur-liste]");
        await expect(mur).toBeVisible();
        await expect(main.getByRole("button", { name: CARTE_VERROUILLEE_LABEL })).toHaveCount(0);
        expect(await alignement(mur.locator("[data-reassurance]"))).not.toBe("center");
        expect(await alignement(main.getByRole("heading", { level: 1 }))).not.toBe("center");
        for (const titre of ["Questions fréquentes", "Pourquoi ces vannes sont différentes", "La suite, si tu as pris goût"]) {
          expect(await alignement(main.getByRole("heading", { level: 2, name: titre })), titre).not.toBe("center");
        }
        const question = main.locator("details").filter({ hasText: "Comment trouver la bonne vanne" });
        await question.locator("summary").click();
        expect(plat(await question.innerText())).toContain(plat(REPONSE_VALIDEE));
        const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
        expect(ld.some((t) => t.includes(REPONSE_VALIDEE))).toBe(true);
        await c.close();
      }
    });

    test("/profil abonné : « Ta question à l'équipe » dans le cadre à filet", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/profil");
      const cadre = page.locator("[data-profil-questions-cadre]");
      await expect(cadre).toBeVisible();
      const filet = cadre.locator(":scope > [data-filet]");
      const [b, f] = [await boite(cadre), await boite(filet)];
      expect(Math.round(f.height)).toBe(4);
      expect(Math.abs(f.y - b.y)).toBeLessThanOrEqual(1);
      expect(await cadre.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe("12px");
      await c.close();
    });

    test("/profil nouvel abonné : « Prochaine étape » en tête", async ({ browser }) => {
      test.skip(PREVERSION, "compte neuf requis (aucun parcours)");
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/profil");
      const prochaine = page.getByRole("heading", { name: "Prochaine étape" });
      const stats = page.getByRole("heading", { name: "Statistiques" });
      await expect(prochaine).toBeVisible();
      await expect(stats).toBeVisible();
      expect((await boite(prochaine)).y).toBeLessThan((await boite(stats)).y);
      await c.close();
    });

    test("/parcours inscrit gratuit : ni « Sans compte. » ni « D'abord ton compte » ; même destination du plein", async ({ browser }) => {
      const { c, page } = await contexte(browser, "FREE");
      await page.goto("/parcours");
      await expect(page.locator("main [id^='parcours-']").first()).toBeVisible();
      await expect.poll(async () => (await page.locator("main").innerText()).includes("Sans compte.")).toBe(false);
      await page.goto("/parcours/repartie");
      // Fin de l'étape 1 : affichée quiz fini (compte neuf de la suite e2e ; le compte de la préversion l'a déjà fini).
      for (let i = 0; i < 10 && !(await page.locator("[data-fin-etape-1]").isVisible()); i++) {
        const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
        if ((await options.count()) === 0) break;
        await options.first().click();
        await page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ }).click();
      }
      const plein = page.locator("[data-fin-etape-1-cta='premium']");
      await expect(plein).toBeVisible();
      expect(await plein.getAttribute("href")).toMatch(/^\/abonnement/);
      expect(plat(await page.locator("main").innerText())).not.toContain("D'abord ton compte");
      await c.close();
    });

    test("/parcours/repartie visiteur : « D'abord ton compte » gardé, pastilles du défi de 44 px aux 5 largeurs", async ({ browser }) => {
      for (const largeur of [375, 768, 1280, 1456, 1920]) {
        const { c, page } = await contexte(browser, "visiteur", largeur);
        await page.goto("/parcours/repartie");
        if (largeur === 1280) expect(plat(await page.locator("main").innerText())).toContain("D'abord ton compte");
        for (const o of RETOUR_EXERCICE.options) {
          const pastille = page.getByRole("button", { name: o.label });
          await expect(pastille).toBeVisible();
          expect(Math.round((await boite(pastille)).height), `${o.label} ${largeur}`).toBeGreaterThanOrEqual(44);
        }
        await c.close();
      }
    });
  });

  test.describe("interrupteur fermé", () => {
    test.skip(ESPACE_OUVERT, "serveur construit interrupteur fermé seulement");

    test("/vannes et /lettre : comme avant (carte floutée, corps de la lettre brut)", async ({ browser }) => {
      const { c, page } = await contexte(browser, "visiteur");
      await page.goto("/vannes");
      await expect(page.locator("[data-mur-liste]")).toBeVisible();
      await expect(page.getByRole("button", { name: CARTE_VERROUILLEE_LABEL })).toHaveCount(1);
      await expect(page.locator("[data-mur-centre], [data-vannes-entete]")).toHaveCount(0);
      await page.goto("/lettre");
      await expect(page.locator("[data-lettre-corps]")).toHaveCount(0);
      await c.close();
    });
  });
});
