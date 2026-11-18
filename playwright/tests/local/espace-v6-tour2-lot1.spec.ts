import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import type { RubriqueApercu } from "@/config/textes/espace-apercu";

/**
 * Navigation v6, tour 2, lot 1 (espace), en vrai navigateur, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1`) :
 * plan `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-2.md`, points 1 à 7, 10 et 12.
 * - aperçu : une colonne centrée de 768 px au plus, titre centré, l'offre sous l'exemple, pleine largeur, jamais
 *   collante ; Mes questions : un seul filet ; Favoris : deux contenus l'un sous l'autre (tour 3) ;
 * - fiche situation : « Oui / À moitié / Rien » de 44 px, bord `#707070`, texte blanc ; « Ma réplique à moi » de
 *   96 px au moins, 200 caractères visibles en entier à 375 px ;
 * - séance : les 10 phrases de « Observation » en liste numérotée ;
 * - S'entraîner : texte des cartes pleine ligne en mesure de lecture ; Mes questions : deux titres au même niveau ;
 *   Mes répliques : titre au même bord que Mes questions ; Favoris abonné : onglets de 44 px ;
 * - /mon-espace/lettres : 308 vers /lettre pour le visiteur, le compte gratuit et l'abonné.
 * Captures de contrôle : `E2E_CAPTURES_V6T2=<dossier>`.
 */
const MOT_DE_PASSE = "E2e-v6-tour2-lot1!";
const CAPTURES = process.env.E2E_CAPTURES_V6T2;
const LARGEURS = [375, 768, 1280, 1456, 1920];
// Refonte s25 : « Aujourd'hui » quitte la colonne centrée (aperçu verrouillé en largeur, H1 à gauche) ; sa mise en
// page est vérifiée par `espace-aujourdhui-refonte-s25.spec.ts`. Les autres rubriques gardent cette règle.
// s26 : Quoi répondre, Bibliothèque et S'entraîner passent à leur tour sur l'aperçu en largeur d'« Aujourd'hui »
// (`ApercuVerrouille`) : la colonne centrée est remplacée, pour elles, par les garanties de `APERCUS_S26` (jamais
// collante, H1 à gauche, tuiles de fin entières, 32 px au moins avant « La suite est dans Premium »).
const APERCUS_S26: [RubriqueApercu, string][] = [
  ["quoiRepondre", "/mon-espace/quoi-repondre"],
  ["bibliotheque", "/mon-espace/bibliotheque"],
  ["sEntrainer", "/mon-espace/s-entrainer"],
];
const APERCUS: [RubriqueApercu, string][] = [
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

async function nouveauCompte(page: Page, plan: "FREE" | "PREMIUM") {
  const email = `e2e-v6t2-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  await connecter(page, email, MOT_DE_PASSE);
}

test.describe("@espace v6 tour 2, lot 1 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(240_000);

  test("aperçu (visiteur) : une colonne centrée, titre centré, offre sous l'exemple, rien de collant", async ({ page }) => {
    for (const [rubrique, adresse] of APERCUS) {
      for (const largeur of LARGEURS) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto(adresse);
        const ou = `${rubrique} à ${largeur} px`;
        const racine = page.locator(`[data-apercu="${rubrique}"]`);
        const coque = await boite(racine);
        const exemple = await boite(racine.locator("article"));
        const offre = await boite(page.locator("[data-apercu-offre]"));
        const ecran = await page.evaluate(() => document.documentElement.clientWidth);
        expect(coque.largeur, `colonne de 768 px au plus, ${ou}`).toBeLessThanOrEqual(768);
        expect(Math.abs(coque.gauche - (ecran - coque.droite)), `colonne centrée, ${ou}`).toBeLessThanOrEqual(2);
        expect(offre.haut, `offre sous l'exemple, ${ou}`).toBeGreaterThanOrEqual(exemple.bas);
        expect(Math.abs(offre.largeur - coque.largeur), `offre pleine largeur, ${ou}`).toBeLessThanOrEqual(1);
        // Cadre à filet (`CADRE_CARTE`) en `relative` pour son filet : ni `sticky` ni `fixed`, sur elle comme sur ses parents.
        const positions = await page.locator("[data-apercu-offre]").evaluate((e) => {
          const p: string[] = [];
          for (let x: Element | null = e; x && x !== document.body; x = x.parentElement) p.push(getComputedStyle(x).position);
          return p;
        });
        expect(positions.filter((p) => p === "sticky" || p === "fixed"), `jamais collante, ${ou}`).toEqual([]);
        expect(await racine.locator("h1").evaluate((e) => getComputedStyle(e).textAlign), `titre centré, ${ou}`).toBe("center");
        if (rubrique === "mesQuestions") {
          const imbriques = await racine.evaluate((r) => {
            const filets = Array.from(r.querySelectorAll("*")).filter((e) => getComputedStyle(e, "::before").height === "4px");
            return filets.filter((f) => filets.some((g) => g !== f && g.contains(f))).length;
          });
          expect(imbriques, `un seul filet, ${ou}`).toBe(0);
        }
        const favoris = racine.locator("[data-favori-lecture]");
        // v6 tour 3 (arbitrage 4, remplace le côte à côte du tour 2) : l'un sous l'autre à toutes les largeurs.
        if (rubrique === "favoris" && (await favoris.count()) === 2) {
          const [a, b] = [await boite(favoris.nth(0)), await boite(favoris.nth(1))];
          expect(b.haut, `favoris l'un sous l'autre, ${ou}`).toBeGreaterThanOrEqual(a.bas);
        }
        await capturer(page, `visiteur-apercu-${rubrique}`, largeur);
      }
    }
  });

  test("aperçus s26 (visiteur) : jamais collant, H1 à gauche, tuiles de fin entières, air avant la fin d'extrait", async ({ page }) => {
    for (const [rubrique, adresse] of APERCUS_S26) {
      for (const largeur of LARGEURS) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto(adresse);
        const ou = `${rubrique} à ${largeur} px`;
        const racine = page.locator(`[data-apercu="${rubrique}"]`);
        const positions = await page.locator("[data-apercu-offre]").evaluate((e) => {
          const p: string[] = [];
          for (let x: Element | null = e; x && x !== document.body; x = x.parentElement) p.push(getComputedStyle(x).position);
          return p;
        });
        expect(positions.filter((p) => p === "sticky" || p === "fixed"), `jamais collante, ${ou}`).toEqual([]);
        expect(await racine.locator("h1").evaluate((e) => getComputedStyle(e).textAlign), `titre à gauche, ${ou}`).not.toBe("center");
        // s26 tour 2 (fautes dures du tour 1) : sous la dernière rangée, aucune tuile en liseré (chaque tuile visible est
        // entière au-dessus du point transparent du fondu) ; 32 px au moins entre la dernière tuile et la phrase de fin.
        const fin = await page.locator("[data-apercu-suite]").evaluate((suite) => {
          const transparent = suite.getBoundingClientRect().bottom - 48;
          const tuiles = Array.from(suite.querySelectorAll("[data-apercu-rangee='2'] > *"))
            .filter((t) => getComputedStyle(t).display !== "none")
            .map((t) => t.getBoundingClientRect());
          const phrase = document.querySelector("[data-apercu-fin] p")!.getBoundingClientRect().top;
          return { coupees: tuiles.filter((t) => t.bottom > transparent + 0.5).length, ecart: phrase - Math.max(...tuiles.map((t) => t.bottom)) };
        });
        expect(fin.coupees, `aucune tuile coupée, ${ou}`).toBe(0);
        expect(fin.ecart, `air avant « La suite est dans Premium », ${ou}`).toBeGreaterThanOrEqual(32);
        // s26, Thomas 18/11 : une seule grille 8/4 pour le hero ET l'extrait : dès 1024, la colonne de droite de la rangée 1
        // a les bords de la carte d'offre, la colonne de gauche ceux du texte du hero ; « Quoi répondre » : la dernière
        // tuile de la rangée 2 (4/4/4) aussi sous la carte d'offre.
        if (largeur >= 1024) {
          const a = await racine.evaluate((r) => {
            const bords = (e: Element) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; };
            const [texte] = Array.from(r.querySelectorAll("[data-apercu-hero] > *"));
            const [gauche, droite] = Array.from(r.querySelectorAll("[data-apercu-rangee='1'] > *"));
            const r2 = Array.from(r.querySelectorAll("[data-apercu-rangee='2'] > *")).filter((t) => getComputedStyle(t).display !== "none");
            return { texte: bords(texte), offre: bords(r.querySelector("[data-apercu-offre]")!), gauche: bords(gauche), droite: bords(droite), fin2: bords(r2[r2.length - 1]) };
          });
          expect(a.droite, `colonne de droite de l'extrait sous la carte d'offre, ${ou}`).toEqual(a.offre);
          expect(a.gauche, `colonne de gauche de l'extrait sous le texte du hero, ${ou}`).toEqual(a.texte);
          if (rubrique === "quoiRepondre") expect(a.fin2, `dernière tuile de la rangée 2 sous la carte d'offre, ${ou}`).toEqual(a.offre);
        }
        // s26 tour 3 (B1, S1) : une seule grille pour tout l'extrait de « Bibliothèque » et « S'entraîner » (8/4 depuis le 18/11) : dès 1024,
        // la tuile seule de la rangée 2 a les bords de la première tuile de la rangée 1 (gouttière alignée, plus de 6/6),
        // et la colonne de droite empile deux tuiles à leur hauteur, jamais plus basses que la rangée.
        if (rubrique !== "quoiRepondre" && largeur >= 1024) {
          const g = await racine.evaluate((r) => {
            const bords = (e: Element) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; };
            const [gauche, pile] = Array.from(r.querySelectorAll("[data-apercu-rangee='1'] > *"));
            const seule = Array.from(r.querySelectorAll("[data-apercu-rangee='2'] > *"));
            const tuiles = Array.from(pile.children).map((t) => t.getBoundingClientRect());
            return { r1: bords(gauche), r2: seule.map(bords), pile: tuiles.length, depasse: tuiles[tuiles.length - 1].bottom - pile.getBoundingClientRect().bottom };
          });
          expect(g.r2, `rangée 2 sur la gouttière de la rangée 1, ${ou}`).toEqual([g.r1]);
          expect(g.pile, `deux tuiles empilées à droite, ${ou}`).toBe(2);
          expect(g.depasse, `pile dans la rangée, ${ou}`).toBeLessThanOrEqual(0.5);
        }
        await capturer(page, `visiteur-apercu-${rubrique}`, largeur);
      }
    }
  });

  test("/mon-espace/lettres : 308 vers /lettre pour le visiteur, le compte gratuit et l'abonné", async ({ browser }) => {
    for (const plan of [null, "FREE", "PREMIUM"] as const) {
      const contexte = await browser.newContext();
      const page = await contexte.newPage();
      if (plan) await nouveauCompte(page, plan);
      const reponse = await page.request.get("/mon-espace/lettres", { maxRedirects: 0 });
      expect(reponse.status(), `compte ${plan ?? "visiteur"}`).toBe(308);
      expect(new URL(reponse.headers()["location"], "http://x").pathname).toBe("/lettre");
      await contexte.close();
    }
  });

  test("abonné neuf : fiche, séance, S'entraîner, Mes questions, Mes répliques, Favoris", async ({ page }) => {
    await nouveauCompte(page, "PREMIUM");
    for (const largeur of [375, 1280]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      const ou = `${largeur} px`;
      await page.goto("/mon-espace/fiche/situation/coloc-la-poele");
      // Les trois réponses de « Tu avais une réponse ? » (la fiche a aussi les puces « Ton retour », même rôle).
      const boutons = page.getByRole("group", { name: "Tu avais une réponse ?" }).locator("button[aria-pressed]");
      await expect(boutons).toHaveCount(3);
      for (const b of await boutons.all()) {
        expect((await boite(b)).hauteur, `réponse de 44 px, ${ou}`).toBeGreaterThanOrEqual(44);
        const style = await b.evaluate((e) => ({ bord: getComputedStyle(e).borderTopColor, texte: getComputedStyle(e).color }));
        expect(style, `réponse lisible, ${ou}`).toEqual({ bord: "rgb(112, 112, 112)", texte: "rgb(255, 255, 255)" });
      }
      await page.waitForTimeout(3_100);
      await boutons.first().click();
      const champ = page.locator("main textarea").first();
      await expect(champ).toBeVisible();
      expect((await boite(champ)).hauteur, `champ de 96 px, ${ou}`).toBeGreaterThanOrEqual(96);
      await champ.fill("Une réplique assez longue pour remplir plusieurs lignes à 375 px, avec un témoin, une chute et encore un peu de texte pour arriver à deux cents caractères en tout, sans rien couper du tout ici.".slice(0, 200));
      const coupe = await champ.evaluate((t) => t.scrollHeight - t.clientHeight);
      expect(coupe, `rien de coupé, ${ou}`).toBeLessThanOrEqual(1);
      await capturer(page, "nouvel-fiche-situation", largeur);

      await page.goto("/mon-espace/fiche/seance/seance-dix-chambrages-dix-secondes");
      await expect(page.getByTestId("seance-liste").locator("li")).toHaveCount(10);
      await capturer(page, "nouvel-fiche-seance", largeur);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/mon-espace/s-entrainer");
    for (const p of await page.locator("main .md\\:col-span-2 p").all()) {
      if (await p.isVisible()) expect((await boite(p)).largeur, "mesure de lecture").toBeLessThanOrEqual(720);
    }
    await capturer(page, "nouvel-s-entrainer", 1280);

    for (const largeur of [1280, 1920]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace/questions");
      const ecrire = await boite(page.locator("#h-ecrire"));
      const envois = await boite(page.locator("#h-envois"));
      expect(Math.abs(ecrire.haut - envois.haut), `titres au même niveau, ${largeur} px`).toBeLessThanOrEqual(1);
      const titreQuestions = await boite(page.getByRole("heading", { level: 1 }));
      await page.goto("/mon-espace/repliques");
      const titreRepliques = await boite(page.getByRole("heading", { level: 1 }));
      expect(Math.abs(titreRepliques.gauche - titreQuestions.gauche), `même bord que Mes questions, ${largeur} px`).toBeLessThanOrEqual(1);
      await capturer(page, "nouvel-repliques", largeur);
    }

    for (const largeur of [375, 768, 1280]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/favoris");
      for (const onglet of await page.getByRole("tab").all()) {
        expect((await boite(onglet)).hauteur, `onglet de 44 px, ${largeur} px`).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
