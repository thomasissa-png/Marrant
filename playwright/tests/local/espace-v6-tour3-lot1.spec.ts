import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * Navigation v6, tour 3, lot 1 (espace), en vrai navigateur, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1`) :
 * plan `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-3.md`, points 1 (espace et favoris), 2, 3, 4, 6, 7.
 * - en-têtes des rubriques et de /favoris centrés pour l'abonné, comme l'aperçu de la même adresse ;
 * - S'entraîner : aucun vide à côté d'une carte (tour 4, arbitrage 1 : une colonne centrée `max-w-3xl`, cartes empilées) ;
 * - Mes répliques : état vide centré ; aperçu Favoris : les deux contenus l'un sous l'autre ;
 * - aperçus Quoi répondre et Aujourd'hui : fiche en entier, sans porte ni bouton ; catalogue sous l'exemple ;
 * - liens autonomes de 44 px (Bibliothèque, Connexion, retour des fiches, « Définition complète »).
 * Captures de contrôle : `E2E_CAPTURES_V6T3=<dossier>`.
 */
const MOT_DE_PASSE = "E2e-v6-tour3-lot1!";
const CAPTURES = process.env.E2E_CAPTURES_V6T3;
// Refonte s25 (spec design §2) : « Aujourd'hui » devient un tableau de bord, H1 aligné à gauche sur la barre ; il sort
// de la règle des titres centrés (vérifié par `espace-aujourdhui-refonte-s25.spec.ts`).
// s26 : Quoi répondre, Bibliothèque et S'entraîner passent à leur tour au H1 à gauche, comme « Aujourd'hui » (spec
// `docs/ux/rubriques-premium-s26.md` §1.2, §2.2, §3.2) : la règle du titre centré est remplacée, pour elles, par
// `RUBRIQUES_S26` (H1 à gauche, au bord gauche de la grille). Les autres rubriques la gardent.
const RUBRIQUES = ["/mon-espace/questions", "/mon-espace/repliques", "/favoris"];
const RUBRIQUES_S26 = ["/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer"];

const boite = async (l: Locator) => {
  const b = await l.boundingBox();
  if (!b) throw new Error("élément invisible");
  return { gauche: b.x, droite: b.x + b.width, haut: b.y, bas: b.y + b.height, largeur: b.width, hauteur: b.height };
};

async function capturer(page: Page, nom: string, largeur: number) {
  if (CAPTURES) await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png`, fullPage: true });
}

async function nouveauCompte(page: Page, plan: "FREE" | "PREMIUM") {
  const email = `e2e-v6t3-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  await connecter(page, email, MOT_DE_PASSE);
}

/** Titre de page centré : texte centré ET au milieu de la coque (±2 px). */
async function titreCentre(page: Page, ou: string) {
  const h1 = page.getByRole("heading", { level: 1 });
  expect(await h1.evaluate((e) => getComputedStyle(e).textAlign), `H1 centré, ${ou}`).toBe("center");
  const texte = await h1.evaluate((e) => {
    const r = document.createRange();
    r.selectNodeContents(e);
    const t = r.getBoundingClientRect();
    const b = e.getBoundingClientRect();
    return { ecart: Math.abs(t.left - b.left - (b.right - t.right)) };
  });
  expect(texte.ecart, `H1 au milieu, ${ou}`).toBeLessThanOrEqual(2);
}

test.describe("@espace v6 tour 3, lot 1 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(240_000);

  test("aperçus (visiteur) : situation en entier sans porte, catalogue de Quoi répondre, Favoris empilés, Connexion 44 px", async ({ page }) => {
    for (const largeur of [375, 1280]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      // Refonte s25 : l'aperçu d'« Aujourd'hui » n'est plus une situation entière (tableau de bord fermé, extrait
      // coupé) : vérifié par `espace-aujourdhui-refonte-s25.spec.ts`.
      // s26 : remplacé par l'aperçu VERROUILLÉ de Quoi répondre (spec s26 §1.1, verrouillage réel) : la situation ne
      // montre que sa partie en clair (titre, scène, réplique lancée), sa suite et ses répliques ne quittent plus le
      // serveur (plus de `fiche-suite`) ; le catalogue sous l'exemple devient les filtres « Où et avec qui ? » (sous la
      // situation sous 1024 px, à sa droite au-delà). Garanties gardées : aucune porte ni bouton, Connexion de 44 px.
      for (const [rubrique, adresse] of [["quoiRepondre", "/mon-espace/quoi-repondre"]] as const) {
        await page.goto(adresse);
        const racine = page.locator(`[data-apercu="${rubrique}"]`);
        await expect(racine.locator("[data-apercu-situation] h2"), `situation en clair, ${rubrique} ${largeur}`).toBeVisible();
        await expect(racine.getByTestId("fiche-suite"), `suite jamais servie, ${rubrique} ${largeur}`).toHaveCount(0);
        await expect(racine.getByRole("group", { name: "Tu avais une réponse ?" })).toHaveCount(0);
        await expect(racine.locator("button")).toHaveCount(0);
        const connexion = racine.locator("[data-apercu-offre] a").nth(1);
        expect((await boite(connexion)).hauteur, `Connexion de 44 px, ${largeur}`).toBeGreaterThanOrEqual(44);
        await capturer(page, `visiteur-${rubrique}`, largeur);
      }
      const filtres = page.locator("[data-apercu-filtres]");
      await page.goto("/mon-espace/quoi-repondre");
      await expect(filtres.locator("li").first()).toContainText("Coloc");
      const [f, situation] = [await boite(filtres), await boite(page.locator("[data-apercu-situation]"))];
      if (largeur < 1024) expect(f.haut, `filtres sous la situation, ${largeur}`).toBeGreaterThan(situation.bas);
      else expect(f.gauche, `filtres à droite de la situation, ${largeur}`).toBeGreaterThan(situation.droite);

      await page.goto("/favoris");
      const exemples = page.locator('[data-apercu-fiche="favoris-exemples"] > li');
      if ((await exemples.count()) === 2) {
        const [a, b] = [await boite(exemples.nth(0)), await boite(exemples.nth(1))];
        expect(b.haut, `Favoris : l'un sous l'autre, ${largeur}`).toBeGreaterThanOrEqual(a.bas);
        expect(Math.abs(a.largeur - b.largeur)).toBeLessThanOrEqual(1);
      }
      await capturer(page, "visiteur-favoris", largeur);
    }
  });

  test("abonné neuf : titres centrés (H1 à gauche en s26), S'entraîner sans vide, Mes répliques centrée, liens de 44 px", async ({ page }) => {
    await nouveauCompte(page, "PREMIUM");
    for (const largeur of [375, 1280, 1920]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      for (const adresse of RUBRIQUES) {
        await page.goto(adresse);
        await titreCentre(page, `${adresse} à ${largeur} px`);
      }
      for (const adresse of RUBRIQUES_S26) {
        await page.goto(adresse);
        await titreAGauche(page, `${adresse} à ${largeur} px`);
      }
    }

    for (const largeur of [1280, 1920]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace/s-entrainer");
      await controlerSEntrainerS26(page, `nouvel ${largeur}`);
      await capturer(page, "nouvel-s-entrainer", largeur);

      await page.goto("/mon-espace/repliques");
      const vide = await boite(page.getByTestId("repliques-vide"));
      expect(Math.abs(vide.gauche - (largeur - vide.droite)), `état vide centré, ${largeur}`).toBeLessThanOrEqual(24);
      expect(vide.largeur).toBeLessThanOrEqual(768);
      // Une réplique seule (même colonne centrée que l'état vide) : jamais une carte calée à gauche de la coque.
      for (const carte of await page.locator("main [data-replique]").all()) {
        const c = await boite(carte);
        if ((await page.locator("main [data-replique]").count()) === 1) expect(Math.abs(c.gauche - (largeur - c.droite))).toBeLessThanOrEqual(24);
      }
      await capturer(page, "nouvel-repliques", largeur);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/mon-espace/bibliotheque");
    for (const lien of await page.getByTestId("bibliotheque-catalogue").getByRole("link").all()) {
      expect((await boite(lien)).hauteur, "Vannes / Conseils / Vidéos de 44 px").toBeGreaterThanOrEqual(44);
    }
    const fiche = page.locator("#groupe-vocabulaire").locator("xpath=..").getByRole("link").first();
    if (await fiche.count()) {
      await fiche.click();
      await expect(page.locator("[data-lien-retour]")).toBeVisible();
      expect((await boite(page.locator("[data-lien-retour]"))).hauteur, "retour de 44 px").toBeGreaterThanOrEqual(44);
      for (const d of await page.getByRole("link", { name: "Définition complète" }).all()) {
        expect((await boite(d)).hauteur, "« Définition complète » de 44 px").toBeGreaterThanOrEqual(44);
      }
    }
  });
});

/** s26 : titre de page à gauche, au bord gauche du contenu de la page (±2 px), comme « Aujourd'hui ». */
async function titreAGauche(page: Page, ou: string) {
  const h1 = page.getByRole("heading", { level: 1 });
  expect(await h1.evaluate((e) => getComputedStyle(e).textAlign), `H1 à gauche, ${ou}`).not.toBe("center");
  const ecart = await h1.evaluate((e) => {
    const r = document.createRange();
    r.selectNodeContents(e);
    return Math.abs(r.getBoundingClientRect().left - e.getBoundingClientRect().left);
  });
  expect(ecart, `texte du H1 calé à gauche, ${ou}`).toBeLessThanOrEqual(2);
}

/**
 * S'entraîner s26 (spec `docs/ux/rubriques-premium-s26.md` §3.2), remplace la colonne centrée `max-w-3xl` du tour 4 : dès
 * 1024 px, grille 7/5, cartes à gauche, échelle et mission à droite, les deux colonnes partant à la même ligne (s26 tour
 * 2 : segments de rafale hors des colonnes). Intention gardée : aucune carte calée seule avec un vide à côté d'elle,
 * la colonne de droite occupe la place.
 */
async function controlerSEntrainerS26(page: Page, ou: string) {
  const [cartes, mission] = [await boite(page.locator("[data-zone='cartes']")), await boite(page.locator("[data-zone='mission']"))];
  expect(Math.abs(cartes.haut - mission.haut), `deux colonnes à la même ligne, ${ou}`).toBeLessThanOrEqual(1);
  expect(mission.gauche, `mission à droite des cartes, ${ou}`).toBeGreaterThan(cartes.droite);
  expect(await page.locator("main article[data-carte], main [data-rafale-finie]").count(), `une carte (ou la rafale finie), ${ou}`).toBeGreaterThan(0);
}
