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
 * - abonné neuf, « Aujourd'hui » : le premier pas en pleine coque, sans filet (tour 7), rayon 12 px, titre 30 px dès 768 px ;
 *   contenu du jour : bas alignés (v7 tour 2 : vidéo à droite sur deux rangées), vignette sur toute la carte, lecture sans rouge ;
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

  // s26 : remplacé par le verrouillage réel de l'aperçu S'entraîner (spec `docs/ux/rubriques-premium-s26.md` §3.1) :
  // « Ce qu'on aurait pu dire » n'est plus un <details> ouvert, c'est un bloc FERMÉ (libellé, verrou, barres), son
  // texte ne quitte pas le serveur. La garantie Favoris (deux contenus réels en lecture seule) reste inchangée.
  test("aperçu S'entraîner : « Ce qu'on aurait pu dire » fermé (s26) ; Favoris : deux contenus réels en lecture seule", async ({ page }) => {
    await page.goto("/mon-espace/s-entrainer");
    await expect(page.locator("[data-apercu-fiche] [data-blocs-fermes] [data-bloc-ferme]")).toHaveCount(1);
    await expect(page.locator("[data-apercu-fiche] details")).toHaveCount(0);
    const [{ n: vannes }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "Joke" WHERE "isActive"`);
    const [{ n: conseils }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "Tip" WHERE "isActive"`);
    await page.goto("/favoris");
    if (vannes > 0 && conseils > 0) {
      const exemples = page.locator('[data-apercu-fiche="favoris-exemples"]');
      await expect(exemples.locator("[data-favori-lecture]")).toHaveCount(2);
      await expect(exemples.getByRole("button")).toHaveCount(0);
      await expect(exemples.getByRole("link")).toHaveCount(0);
    } else {
      // s26 (`docs/ux/favoris-carnet-s26.md` §1.2) : catalogue vide, deux tuiles fermées (vanne, conseil) au lieu de l'état vide.
      await expect(page.locator('[data-apercu-rangee="1"] [data-apercu-type-ferme]')).toHaveCount(2);
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
      // Refonte s25 (spec design §5.1) : pleine coque sous 1024 px ; dès 1024, 8 colonnes sur 12, « Ton cap » à droite
      // sur la même rangée et à la même hauteur (toujours la carte dominante, la plus large). v7 tour 8 (point 2) : 7 colonnes
      // sur 12, « Ton cap » en 5 (test adapté au tour 9).
      if (largeur < 1024) {
        expect(Math.abs((await boite(carte)).largeur - grille.largeur), `pleine coque, ${ou}`).toBeLessThanOrEqual(1);
      } else {
        const [action, cap] = [await boite(page.locator("[data-carte-du-jour]")), await boite(page.locator('[data-zone="cap"]'))];
        expect(Math.abs(action.largeur - ((grille.largeur - 11 * 24) * 7) / 12 - 6 * 24), `7 colonnes sur 12, ${ou}`).toBeLessThanOrEqual(2);
        expect(Math.abs(cap.haut - action.haut) + Math.abs(cap.hauteur - action.hauteur), `« Ton cap » sur la même rangée, ${ou}`).toBeLessThanOrEqual(1);
      }
      const style = await carte.evaluate((s) => ({
        filet: getComputedStyle(s, "::before").height,
        rayon: getComputedStyle(s).borderTopLeftRadius,
        titre: getComputedStyle(s.querySelector("h2") as Element).fontSize,
      }));
      // s25 v7 tour 7 (décision de Thomas du 16/11) : plus de filet violet sur « Aujourd'hui » (un seul accent, le
      // bouton plein) ; les autres rubriques le gardent.
      expect(style.filet, `sans filet, ${ou}`).not.toBe("4px");
      expect(style.rayon, `rayon, ${ou}`).toBe("12px");
      // Échelle s25 (retour de Thomas du 16/11) : la dominance vient de la place, du fond et du seul bouton plein, plus de
      // la taille : titre en `TITRE_CARTE` (20 px) à toutes les largeurs, comme les tuiles.
      expect(style.titre, `titre de l'échelle, ${ou}`).toBe("20px");
      await expect(carte.locator("a.bg-accent-secondary-hover"), `seul bouton plein dans la carte, ${ou}`).toHaveCount(1);
      const jour = page.locator("[data-contenu-du-jour]");
      await expect(jour).not.toHaveAttribute("data-etat", "chargement", { timeout: 10_000 });
      const cartes = jour.locator("article");
      if (largeur >= 1280 && (await cartes.count()) === 3) {
        // v7 tour 2 (faute 3) : vanne et conseil empilés à gauche, la vidéo à droite sur les deux rangées ; même
        // intention (pas de bas en escalier) : hauts et bas alignés sur ceux de la vidéo.
        const [vanne, conseil, video] = await cartes.evaluateAll((as) => as.map((a) => a.getBoundingClientRect()).map((r) => ({ haut: Math.round(r.top), bas: Math.round(r.bottom) })));
        expect(Math.abs(vanne.haut - video.haut), `hauts alignés, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.abs(conseil.bas - video.bas), `bas alignés, ${ou}`).toBeLessThanOrEqual(1);
      }
      const lecture = jour.locator("article button > div").first();
      if (await lecture.count()) {
        expect(await lecture.evaluate((d) => getComputedStyle(d).backgroundColor), `lecteur sans rouge, ${ou}`).not.toBe("rgb(220, 38, 38)");
        const video = await boite(jour.locator("#jour-video").locator("xpath=.."));
        const vignette = await boite(jour.locator("article .aspect-video").first());
        if (largeur === 768) {
          // v7 tour 4 (faute 2) : la carte vidéo garde la ligne entière en ligne de média : vignette de 17rem à gauche,
          // le titre de la carte et celui de la vidéo en face, dans la hauteur de la vignette (même intention : aucun
          // vide à droite de la vignette).
          const [h3, titre] = [await boite(jour.locator("#jour-video")), await boite(jour.locator("#jour-video").locator("xpath=..").locator("a").last())];
          expect(Math.abs(vignette.largeur - 272), `vignette de 17rem, ${ou}`).toBeLessThanOrEqual(2);
          expect(Math.abs(vignette.gauche - (video.gauche + 24)), `vignette à gauche, ${ou}`).toBeLessThanOrEqual(2);
          for (const t of [h3, titre]) expect(t.gauche, `texte en face de la vignette, ${ou}`).toBeGreaterThanOrEqual(vignette.droite);
          expect(h3.haut, `titre de la carte dans la hauteur de la vignette, ${ou}`).toBeGreaterThan(vignette.haut);
          expect(titre.bas, `titre de la vidéo dans la hauteur de la vignette, ${ou}`).toBeLessThan(vignette.bas);
        } else {
          expect(video.largeur - vignette.largeur, `vignette sur toute la carte, ${ou}`).toBeLessThanOrEqual(2 * 24 + 4);
        }
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

    // s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §5, remplace le tour 3 centré) : titre à gauche, l'état
    // vide en tuile d'action de 8 colonnes sous lui, même bord gauche.
    await page.goto("/mon-espace/repliques");
    const vide = page.getByTestId("repliques-vide");
    const titre = await boite(page.getByRole("heading", { level: 1 }));
    const carte = await boite(vide);
    expect(Math.abs(titre.gauche - carte.gauche)).toBeLessThanOrEqual(1);
    const bouton = vide.getByRole("link", { name: TEXTES_REPLIQUES.ecrirePremiere });
    expect(await bouton.evaluate((a) => getComputedStyle(a).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    await capturer(page, "nouvel-repliques", 1280);
  });
});
