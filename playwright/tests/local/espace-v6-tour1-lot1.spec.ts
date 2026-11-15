import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";

/**
 * Navigation v6, tour 1, lot 1 (espace), en vrai navigateur, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1`) :
 * plan `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-1.md`, points 1 (espace), 2, 3, 4, 5, 15.
 * - aperçu : dès 1024 px, l'exemple à gauche et l'offre à droite, en haut, jusqu'au bord de la coque (aucun vide
 *   à droite) ; dessous, l'offre sous l'exemple ; « Connexion » de 44 px ; S'entraîner : la réponse ouverte ;
 *   Favoris : deux contenus réels en lecture seule (catalogue non vide) ;
 * - abonné neuf, « Aujourd'hui » : le premier pas en pleine coque, filet de 4 px, rayon 12 px, titre 30 px dès 768 px ;
 *   contenu du jour : cartes d'une rangée à la même hauteur, vignette sur toute la carte, lecture sans rouge ;
 * - fiche : « À toi » sans filet en tête, `<summary>` de 44 px à bordure et chevron ;
 * - Mes répliques vide : titre et carte dans la même colonne, « Écrire ma première réplique » en bouton plein.
 * Captures de contrôle : `E2E_CAPTURES_V6T1=<dossier>`.
 */
const MOT_DE_PASSE = "E2e-v6-tour1-lot1!";
const CAPTURES = process.env.E2E_CAPTURES_V6T1;
const LARGES = [1280, 1456, 1920];
const ETROITES = [375, 768];
const APERCUS: [RubriqueApercu, string][] = [
  ["aujourdhui", "/mon-espace"],
  ["quoiRepondre", "/mon-espace/quoi-repondre"],
  ["bibliotheque", "/mon-espace/bibliotheque"],
  ["sEntrainer", "/mon-espace/s-entrainer"],
  ["mesQuestions", "/mon-espace/questions"],
  ["mesRepliques", "/mon-espace/repliques"],
  ["favoris", "/favoris"],
];

const boite = async (l: Locator) => {
  const b = await l.boundingBox();
  if (!b) throw new Error("élément invisible");
  return { gauche: b.x, droite: b.x + b.width, haut: b.y, bas: b.y + b.height, largeur: b.width, hauteur: b.height };
};

async function capturer(page: Page, nom: string, largeur: number) {
  if (CAPTURES) await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png`, fullPage: true });
}

async function abonneNeuf(page: Page) {
  const email = `e2e-v6t1-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

test.describe("@espace v6 tour 1, lot 1 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(180_000);

  // v6 tour 2 (arbitrage 1) : les deux colonnes sont abandonnées ; la mise en page de l'aperçu est vérifiée par
  // `espace-v6-tour2-lot1.spec.ts`. Reste ici : « Connexion » de 44 px et les captures.
  test("aperçu (visiteur) : « Connexion » de 44 px à toutes les largeurs", async ({ page }) => {
    for (const [rubrique, adresse] of APERCUS) {
      for (const largeur of [...ETROITES, ...LARGES]) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto(adresse);
        const ou = `${rubrique} à ${largeur} px`;
        const connexion = page.locator("[data-apercu-offre]").getByRole("link", { name: TEXTES_APERCU.connexion });
        expect((await boite(connexion)).hauteur, `« Connexion » 44 px, ${ou}`).toBeGreaterThanOrEqual(44);
        await capturer(page, `visiteur-apercu-${rubrique}`, largeur);
      }
    }
  });

  test("aperçu S'entraîner : « Ce qu'on aurait pu dire » ouvert ; Favoris : deux contenus réels en lecture seule", async ({ page }) => {
    await page.goto("/mon-espace/s-entrainer");
    await expect(page.locator("[data-apercu-fiche] details")).toHaveAttribute("open", "");
    const [{ n: vannes }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "Joke" WHERE "isActive"`);
    const [{ n: conseils }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "Tip" WHERE "isActive"`);
    await page.goto("/favoris");
    if (vannes > 0 && conseils > 0) {
      const exemples = page.locator('[data-apercu-fiche="favoris-exemples"]');
      await expect(exemples.locator("[data-favori-lecture]")).toHaveCount(2);
      await expect(exemples.getByRole("button")).toHaveCount(0);
      await expect(exemples.getByRole("link")).toHaveCount(0);
    } else {
      await expect(page.getByText(TEXTES_APERCU.favorisVide.titre)).toBeVisible();
    }
  });

  test("abonné neuf : action du jour pleine coque et dominante, contenu du jour aligné", async ({ page }) => {
    await abonneNeuf(page);
    for (const largeur of [375, 768, ...LARGES]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace");
      const ou = `${largeur} px`;
      const carte = page.locator("[data-carte-du-jour] > section");
      const grille = await boite(page.locator("[data-aujourdhui-grille]"));
      expect(Math.abs((await boite(carte)).largeur - grille.largeur), `pleine coque, ${ou}`).toBeLessThanOrEqual(1);
      const style = await carte.evaluate((s) => ({
        filet: getComputedStyle(s, "::before").height,
        rayon: getComputedStyle(s).borderTopLeftRadius,
        titre: getComputedStyle(s.querySelector("h2") as Element).fontSize,
      }));
      expect(style.filet, `filet, ${ou}`).toBe("4px");
      expect(style.rayon, `rayon, ${ou}`).toBe("12px");
      if (largeur >= 768) expect(style.titre, `titre dominant, ${ou}`).toBe("30px");
      const jour = page.locator("[data-contenu-du-jour]");
      await expect(jour).not.toHaveAttribute("data-etat", "chargement", { timeout: 10_000 });
      const cartes = jour.locator("article");
      if (largeur >= 1280 && (await cartes.count()) === 3) {
        const hauteurs = await cartes.evaluateAll((as) => as.map((a) => Math.round(a.getBoundingClientRect().height)));
        expect(new Set(hauteurs).size, `même hauteur, ${ou} (${hauteurs.join(", ")})`).toBe(1);
      }
      const lecture = jour.locator("article button > div").first();
      if (await lecture.count()) {
        expect(await lecture.evaluate((d) => getComputedStyle(d).backgroundColor), `lecteur sans rouge, ${ou}`).not.toBe("rgb(220, 38, 38)");
        const video = await boite(jour.locator("#jour-video").locator("xpath=.."));
        const vignette = await boite(jour.locator("article .aspect-video").first());
        expect(video.largeur - vignette.largeur, `vignette sur toute la carte, ${ou}`).toBeLessThanOrEqual(2 * 24 + 4);
      }
      await capturer(page, "nouvel-aujourdhui", largeur);
    }
  });

  test("fiche : « À toi » sans filet en tête, summary en bouton à chevron ; Mes répliques vide dans une colonne", async ({ page }) => {
    await abonneNeuf(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/mon-espace/fiche/jeu/quelle-replique-1");
    expect(await page.getByTestId("geste-fiche").evaluate((s) => getComputedStyle(s).borderTopWidth)).toBe("0px");
    const sommaire = page.locator("main article details > summary").first();
    expect((await boite(sommaire)).hauteur).toBeGreaterThanOrEqual(44);
    expect(await sommaire.evaluate((s) => getComputedStyle(s).borderTopWidth)).toBe("1px");
    await expect(sommaire.locator("svg")).toHaveCount(1);
    await capturer(page, "nouvel-fiche-jeu", 1280);

    // v6 tour 3 (arbitrages 1 et 3, remplace le tour 2) : titre centré, l'état vide en colonne centrée sous lui.
    await page.goto("/mon-espace/repliques");
    const vide = page.getByTestId("repliques-vide");
    const titre = await boite(page.getByRole("heading", { level: 1 }));
    const carte = await boite(vide);
    expect(Math.abs((titre.gauche + titre.droite) / 2 - (carte.gauche + carte.droite) / 2)).toBeLessThanOrEqual(1);
    const bouton = vide.getByRole("link", { name: TEXTES_REPLIQUES.ecrirePremiere });
    expect(await bouton.evaluate((a) => getComputedStyle(a).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    await capturer(page, "nouvel-repliques", 1280);
  });
});
