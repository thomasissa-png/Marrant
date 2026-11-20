import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 liste et détail, pilote Quoi répondre (`docs/ux/liste-detail-quoi-repondre-s26.md` §4, critères 1 à 4 et 6 ;
 * `docs/design/liste-detail-quoi-repondre-s26.md`). Serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ;
 * fermé, ces adresses sont la 404 (`espace-inertie-s24.spec.ts`, `espace-bibliotheque.spec.ts`).
 * - dès 1024 : 3 fiches lues en 5 clics au plus (fiche, filtre replié puis pastille, fiche, « Situation suivante »),
 *   la liste reste le MÊME nœud, son `scrollTop` est gardé, une seule ligne `aria-current`, « Fait » rafraîchi dans la
 *   liste ; retour navigateur fiche par fiche (une entrée d'historique par fiche, aucune par filtre) ;
 * - sous 1024 : page liste, fiche plein écran, « Retour » (`router.back()`) et retour navigateur, `scrollY` à 8 px près ;
 * - 308 de l'ancienne adresse (espace ouvert), 307 du non-abonné vers l'aperçu de la liste.
 * s26 liste et détail, tour 4 : retours en contour à égalité avant clic, « Situation suivante » = prochaine non faite,
 * retour mobile sur la ligne de la fiche quittée (après « Situation suivante »), focus sur l'offre après clic sur une
 * tuile fermée de l'aperçu (contour tenu 1,2 s au moins), « Pour quoi faire ? » sans vide à droite à 1280.
 * s26 liste et détail, tour 5 : « Situation suivante » = prochaine non faite APRÈS la fiche (reprise au début seulement
 * après la dernière), même gabarit avant et après « Fait » ; carte d'offre de même hauteur visiteur et gratuit à 1280 ;
 * « Pour quoi faire ? » à la largeur de ses pastilles (écarts de 8 px).
 * s26 liste et détail, tour 6 : aperçu à 1280 et 1920, chaque bord de carte sur la grille 8/4 (et 4/4/4) de la page,
 * aucun vide de plus de 32 px (sous une carte, en fin de carte, à droite des pastilles), titres des tuiles fermées pas
 * plus gros que celui de la carte d'exemple ; liste de l'abonné dès 1024 : dégradé en bas quand il reste des lignes
 * dessous, en haut dès qu'on a défilé, sans capter le pointeur.
 * s26 liste et détail, tour 7 : aperçu à 1280 et 1920, 48 px entre les pastilles du hero et la légende, tuiles du bas
 * entières (aucun fondu) ; abonné à 1280, liste immobile au défilement, « Fait » sans décalage, « Enregistrer » désactivé
 * lisible ; à 375, la ligne de la situation quittée repérée 1,5 s au retour.
 */
const MOT_DE_PASSE = "E2e-liste-detail-s26";
const LISTE = "/mon-espace/quoi-repondre";

async function abonne(page: Page) {
  const email = `e2e-qr-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

const colonne = (page: Page) => page.locator("[data-colonne-liste]");
const actives = (page: Page) => colonne(page).locator("a[aria-current='page']");

test.describe("Quoi répondre, liste et détail (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const largeur of [1024, 1280]) {
    test(`dès 1024 (${largeur}) : 3 fiches en 5 clics au plus, liste montée, scrollTop gardé, retour navigateur`, async ({ page }) => {
      await abonne(page);
      await page.setViewportSize({ width: largeur, height: largeur === 1024 ? 768 : 900 });
      await page.goto(LISTE);
      // Panneau d'office : une fiche ouverte (H1) dès le chargement, sa ligne active, l'adresse ne change pas.
      await expect(page.locator("[data-mode='panneau'] h1#fiche-titre")).toBeVisible();
      await expect(actives(page)).toHaveCount(1);
      expect(new URL(page.url()).pathname).toBe(LISTE);
      await colonne(page).evaluate((n) => ((n as HTMLElement & { __marque?: number }).__marque = 26));
      let clics = 0;

      // Clic 1 : une ligne visible, après avoir fait défiler la liste (son scrollTop doit rester).
      const corps = page.locator("[data-liste-corps]");
      await corps.evaluate((c) => (c.scrollTop = 96));
      const avant = await corps.evaluate((c) => c.scrollTop);
      const id1 = await corps.evaluate((c) => {
        const r = c.getBoundingClientRect();
        const l = Array.from(c.querySelectorAll<HTMLElement>("a[data-ligne-qr]:not([aria-current])")).find((a) => {
          const b = a.getBoundingClientRect();
          return b.top >= r.top && b.bottom <= r.bottom;
        });
        return l?.dataset.ligneQr ?? "";
      });
      expect(id1).not.toBe("");
      await colonne(page).locator(`a[data-ligne-qr='${id1}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      await expect(page.locator(`[data-fiche-panneau='${id1}'] h1`)).toBeVisible();
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "même nœud de liste").toBe(26);
      expect(Math.abs((await corps.evaluate((c) => c.scrollTop)) - avant), "scrollTop de la liste gardé").toBeLessThanOrEqual(0);
      await expect(actives(page)).toHaveCount(1);
      await expect(page.locator("#fiche-titre")).toBeFocused();

      // Clics 2 et 3 : filtres repliés, puis un lieu d'au moins 3 situations (la query porte le filtre).
      const lieu = await corps.evaluate((c) => Array.from(c.querySelectorAll<HTMLElement>("section[data-lieu]")).find((s) => s.dataset.lieu !== "sans-lieu" && s.querySelectorAll("a[data-ligne-qr]").length >= 3)?.dataset.lieu ?? "");
      expect(lieu).not.toBe("");
      await colonne(page).locator("details[data-filtres-liste] > summary").click();
      clics++;
      await colonne(page).locator(`a[data-filtre='${lieu}']`).click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`ou=${lieu}`));
      const apresFiltre = page.url();
      // s26 liste et détail, tour 1 (mesures §8.1) : le repli se referme après un choix, la liste garde sa hauteur utile
      // (au moins 3 lignes de 44 px entre le titre et le pied), aucune ligne recouverte par le pied « carnet ».
      await expect(colonne(page).locator("details[data-filtres-liste]")).not.toHaveAttribute("open", "");
      expect(await corps.evaluate((c) => c.getBoundingClientRect().height), "corps de liste utile").toBeGreaterThanOrEqual(3 * 44);

      // Clic 4 : une AUTRE fiche du filtre (pas la dernière : « Situation suivante » doit exister) ; lien filtré.
      // s26 liste et détail, tour 2 (échec à 1024 et 1280, `ou=coloc`) : `nth(1)` tombait sur la fiche 1, gardée ouverte
      // par le filtre (2e ligne de Coloc). Un clic sur la ligne active vise l'adresse courante : Next remplace l'entrée
      // au lieu d'en ajouter une (aucun doublon d'historique, comportement voulu), et le 2e retour sortait du filtre.
      const id2 = await colonne(page).evaluate((n) => {
        const liens = Array.from(n.querySelectorAll<HTMLElement>("a[data-ligne-qr]"));
        return liens.slice(0, -1).find((a) => !a.hasAttribute("aria-current"))?.dataset.ligneQr ?? "";
      });
      expect(["", id1], "une autre fiche que la fiche ouverte").not.toContain(id2);
      const ligne2 = colonne(page).locator(`a[data-ligne-qr='${id2}']`);
      expect(await ligne2.getAttribute("href")).toBe(`${LISTE}/${id2}?ou=${lieu}`);
      // s26 liste et détail, tour 2 (mesures A2 étape 5 : page défilée de 63 px à 1280, haut du H1 sous l'en-tête
      // collant) : fiche ouverte depuis une page défilée, le haut du panneau revient sous l'en-tête, à 144 px (celui de
      // la liste), la liste gardant son `scrollTop`.
      await page.evaluate(() => window.scrollTo({ top: 63, behavior: "instant" }));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(63);
      const avant2 = await corps.evaluate((c) => c.scrollTop);
      await ligne2.click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id2}\\?ou=${lieu}$`));
      await expect(page.locator(`[data-fiche-panneau='${id2}'] h1`)).toBeVisible();
      await expect.poll(() => page.locator(`[data-fiche-panneau='${id2}']`).evaluate((a) => Math.round(a.getBoundingClientRect().top)), "haut du panneau sous l'en-tête").toBeGreaterThanOrEqual(143);
      expect(Math.round(await page.locator(`[data-fiche-panneau='${id2}'] h1`).evaluate((h) => h.getBoundingClientRect().top)), "haut du H1 sous l'en-tête").toBeGreaterThanOrEqual(144);
      expect(await corps.evaluate((c) => c.scrollTop), "scrollTop de la liste gardé").toBe(avant2);

      // s26 liste et détail, tour 4 (relectures à l'aveugle : « Essayé, ça a marché » plein avant tout clic, lu comme
      // déjà choisi) : avant tout clic, les trois retours en contour, à égalité (aucun pressé, même fond transparent).
      const retours = page.locator(`[data-fiche-panneau='${id2}'] [data-testid='geste-fiche'] [role='group'] button[aria-pressed]`);
      if ((await retours.count()) > 0) {
        await expect(retours).toHaveCount(3);
        const etats = await retours.evaluateAll((bs) => bs.map((b) => `${b.getAttribute("aria-pressed")}|${getComputedStyle(b).backgroundColor}|${getComputedStyle(b).borderTopStyle}`));
        expect(new Set(etats).size, `retours à égalité : ${etats.join(" ; ")}`).toBe(1);
        expect(etats[0]).toMatch(/^false\|rgba\(0, 0, 0, 0\)\|solid$/);
      }

      // Clic 5 : « Situation suivante » (contour avant « Fait »), 1 clic, aucun retour à la liste.
      // s26 liste et détail, tour 4 : compte neuf, rien n'est fait : la suivante est la prochaine non faite après la fiche.
      const suivante = page.locator("[data-situation-suivante]");
      await expect(suivante).not.toHaveAttribute("data-plein", "");
      const href3 = (await suivante.getAttribute("href"))!;
      const apresId2 = await colonne(page).evaluate((n, courante) => {
        const ids = Array.from(n.querySelectorAll<HTMLElement>("a[data-ligne-qr]")).map((a) => a.dataset.ligneQr ?? "");
        return ids[ids.indexOf(courante) + 1] ?? "";
      }, id2);
      expect(href3).toBe(`${LISTE}/${apresId2}?ou=${lieu}`);
      await suivante.click();
      clics++;
      await expect(page).toHaveURL(new RegExp(`${href3.replace(/[?]/g, "\\?")}$`));
      await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
      expect(clics, "3 fiches lues").toBeLessThanOrEqual(5);
      await expect(actives(page)).toHaveCount(1);
      expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "liste jamais remontée").toBe(26);

      // « Fait » : la ligne passe à « Fait » sans quitter la fiche, « Situation suivante » prend l'aplat.
      const id3 = href3.split("?")[0].split("/").pop()!;
      // s26 liste et détail, tour 5 (relecture UX v2 F5 : « un seul style ») : seuls le fond et la couleur du bord changent
      // au « Fait » ; taille du texte, graisse, hauteur, largeur, marges internes et épaisseur du bord restent les mêmes.
      const gabarit = () =>
        suivante.evaluate((a) => {
          const s = getComputedStyle(a);
          const r = a.getBoundingClientRect();
          return [s.fontSize, s.fontWeight, s.lineHeight, s.paddingLeft, s.paddingTop, s.borderTopWidth, s.borderRadius, Math.round(r.width), Math.round(r.height)].join("|");
        });
      const fondAvant = await suivante.evaluate((a) => getComputedStyle(a).backgroundColor);
      const gabaritAvant = await gabarit();
      await page.getByRole("button", { name: "Essayé, bof" }).first().click();
      await expect(colonne(page).locator(`a[data-ligne-qr='${id3}'] [data-fait]`)).toBeVisible({ timeout: 15_000 });
      await expect(page.locator(`[data-fiche-panneau='${id3}']`)).toBeVisible();
      // s26 liste et détail, tour 1 : « Situation suivante » prend l'aplat ET est ramenée dans l'écran.
      await expect(suivante).toHaveAttribute("data-plein", "");
      await expect(suivante).toBeInViewport({ ratio: 1, timeout: 2_000 });
      expect(await suivante.evaluate((a) => getComputedStyle(a).backgroundColor), "plein après « Fait »").not.toBe(fondAvant);
      expect(await gabarit(), "même gabarit avant et après « Fait »").toBe(gabaritAvant);
      // s26 liste et détail, tour 5 (relecture UX v2 F5 : après la 3e, faite, retour à la 1re non faite) : « Situation
      // suivante » = la prochaine NON FAITE APRÈS la fiche dans l'ordre de la liste, en reprenant au début seulement après
      // la dernière ; le lien ne change pas au « Fait ».
      const prochaineApres = () =>
        colonne(page).evaluate((n, courante) => {
          const lignes = Array.from(n.querySelectorAll<HTMLElement>("a[data-ligne-qr]"));
          const i = lignes.findIndex((a) => a.dataset.ligneQr === courante);
          return [...lignes.slice(i + 1), ...lignes.slice(0, i)].find((a) => !a.querySelector("[data-fait]"))?.dataset.ligneQr ?? "";
        }, id3);
      const attendue = await prochaineApres();
      expect(attendue, "une non faite après la fiche").not.toBe("");
      await expect.poll(async () => `${await suivante.getAttribute("href")}`).toBe(`${LISTE}/${attendue}?ou=${lieu}`);
      // La fiche 2 (passée sans « Fait ») est avant la fiche 3 : jamais proposée tant qu'il reste une non faite après.
      const rangs = await colonne(page).evaluate((n) => Array.from(n.querySelectorAll<HTMLElement>("a[data-ligne-qr]")).map((a) => a.dataset.ligneQr ?? ""));
      if (rangs.indexOf(id3) < rangs.length - 1) expect(rangs.indexOf(attendue), "suivante après la fiche courante").toBeGreaterThan(rangs.indexOf(id3));

      // Retour navigateur : fiche 2, puis le filtre. s26 liste et détail, tour 1 (mesures §2, historique) : le filtre ne
      // remplace plus l'entrée de la fiche 1 quand il la quitte (il en ajoute une) ; s'il la garde, son adresse porte le
      // filtre. Dans les deux cas, la fiche 1 reste dans l'historique.
      // s26 liste et détail, tour 3 (mesures N1 : au retour navigateur, panneau rendu à la position quittée, haut du H1 à
      // 37 px à 1024 et 115 à 1280, sous l'en-tête de 121 px) : à chaque retour, la fiche revient comme à l'ouverture,
      // son H1 à 144 px au moins ; la liste garde son `scrollTop`.
      const hautH1ApresRetour = async () => {
        await expect.poll(() => page.locator("[data-fiche-panneau] h1").evaluate((h) => Math.round(h.getBoundingClientRect().top)), "haut du H1 sous l'en-tête après retour").toBeGreaterThanOrEqual(144);
        expect(await colonne(page).evaluate((n) => (n as HTMLElement & { __marque?: number }).__marque), "liste jamais remontée").toBe(26);
      };
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}/${id2}\\?ou=${lieu}$`));
      await hautH1ApresRetour();
      await page.goBack();
      await expect(page).toHaveURL(apresFiltre);
      await hautH1ApresRetour();
      if (!new URL(apresFiltre).pathname.endsWith(`/${id1}`)) {
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`${LISTE}/${id1}$`));
      }
    });
  }

  test("sous 1024 (375) : fiche plein écran, « Retour » et retour navigateur, scrollY de la liste à 8 px près", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(LISTE);
    await expect(page.locator("[data-colonne-liste]")).toBeHidden();
    const liens = page.locator("[data-mode='page'] [data-etat='liste'] a[data-fiche]");
    const cible = liens.nth(6);
    await cible.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 40));
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(200);

    // s26 liste et détail, tour 3 (mesures N3 : à 768, « Voir » à moitié sous l'en-tête au retour) : la position rendue
    // ne coupe aucun lien ni bouton de la page par le bas de l'en-tête ; pour cela, elle peut s'écarter du `scrollY`
    // quitté d'une demi-ligne au plus (32 px : ligne de 56 px et 8 px d'air), en plus des 8 px de tolérance.
    const ecartMax = 8 + 32;
    // s26 liste et détail, tour 3 bis (orchestrateur) : le critère N3 porte sur la ligne RESTAURÉE (celle qu'on avait
    // ouverte), qui doit être entière sous l'en-tête. Une autre ligne peut passer sous l'en-tête collant au bord haut,
    // comme à n'importe quelle position de défilement (capture du 19/11 : bas d'une tuile précédente, rien de gênant).
    const cibleEntiere = () =>
      cible.evaluate((e) => {
        const bord = Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>("header")).filter((h) => getComputedStyle(h).position === "sticky" && h.offsetParent !== null).map((h) => h.getBoundingClientRect().bottom));
        const r = e.getBoundingClientRect();
        return r.top >= bord - 0.5 && r.bottom <= window.innerHeight + 0.5;
      });

    // `scrollY` une fois le défilement doux terminé (-1 tant qu'il bouge).
    const scrollStable = () => page.evaluate(() => new Promise<number>((r) => { const a = window.scrollY; setTimeout(() => r(window.scrollY === a ? a : -1), 150); }));

    // « Retour » de la fiche : router.back(), position restaurée.
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    await expect(page.locator("main [data-lien-retour]")).toBeVisible();
    await page.locator("main [data-lien-retour]").click();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(scrollStable).toBeGreaterThan(y - ecartMax - 1);
    expect(await cibleEntiere(), "ligne restaurée entière sous l'en-tête").toBe(true);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(ecartMax);
    // s26 liste et détail, tour 7 (relecture UX v4, D4 : situation quittée non marquée au retour) : sa ligne porte un
    // contour neutre de 2 px (comme la sous-étape de Parcours), retiré après 1,5 s ; aucune autre ligne repérée.
    expect(await cible.getAttribute("data-ligne-reperee"), "ligne quittée repérée").toBe("");
    expect(await cible.evaluate((e) => { const s = getComputedStyle(e); return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`; })).toBe("solid 2px rgb(154, 154, 154)");
    await expect(page.locator("[data-ligne-reperee]")).toHaveCount(1);
    await expect(cible, "repère retiré après 1,5 s").not.toHaveAttribute("data-ligne-reperee", "", { timeout: 2_500 });
    expect(await cible.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe("none");

    // Retour du navigateur : même règle.
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
    await expect.poll(scrollStable).toBeGreaterThan(y - ecartMax - 1);
    expect(await cibleEntiere(), "ligne restaurée entière sous l'en-tête").toBe(true);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(ecartMax);

    // s26 liste et détail, tour 4 (relecture UX : « la liste revient en haut au lieu de la ligne courante », séquence
    // ligne, « Situation suivante », « Retour ») : fiche ouverte depuis la page liste, puis la suivante ; « Retour »
    // ramène la page sur la ligne de la fiche QUITTÉE (la courante), entière sous l'en-tête, jamais en haut de page.
    const ligneEntiere = (id: string) =>
      page.locator(`[data-mode='page'] [data-etat='liste'] a[data-fiche][href='${LISTE}/${id}']`).first().evaluate((e) => {
        const bord = Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>("header")).filter((h) => getComputedStyle(h).position === "sticky" && h.offsetParent !== null).map((h) => h.getBoundingClientRect().bottom));
        const r = e.getBoundingClientRect();
        return r.top >= bord - 0.5 && r.bottom <= window.innerHeight + 0.5;
      });
    // La ligne ouverte posée tout en bas de l'écran : la suivante est sous le pli à la position gardée (le cas mesuré).
    const enBas = () => cible.evaluate((e) => window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().bottom - window.innerHeight + 2, behavior: "instant" }));
    await enBas();
    await cible.click();
    await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
    const suivante = page.locator("[data-situation-suivante]");
    if ((await suivante.count()) > 0) {
      const idSuivante = (await suivante.getAttribute("href"))!.split("?")[0].split("/").pop()!;
      await suivante.click();
      await expect(page.locator(`[data-fiche-panneau='${idSuivante}'] h1`)).toBeVisible();
      await page.locator("main [data-lien-retour]").click();
      await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
      await expect.poll(scrollStable).toBeGreaterThan(0);
      expect(await ligneEntiere(idSuivante), "ligne de la fiche quittée entière sous l'en-tête").toBe(true);

      // Même chemin, retour du navigateur : la fiche ouverte depuis la liste, puis la liste sur sa ligne.
      await enBas();
      await cible.click();
      await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
      await suivante.click();
      await expect(page.locator(`[data-fiche-panneau='${idSuivante}'] h1`)).toBeVisible();
      await page.goBack();
      await expect(page.locator("[data-fiche-panneau] h1")).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${LISTE}$`));
      await expect.poll(scrollStable).toBeGreaterThan(0);
      expect(await cibleEntiere(), "ligne de la fiche quittée entière sous l'en-tête").toBe(true);
    }
  });

  test("308 de l'ancienne adresse (espace ouvert) ; non-abonné sur une fiche : 307 vers l'aperçu de la liste", async ({ page }) => {
    const ancienne = await page.request.get("/mon-espace/fiche/situation/coloc-la-poele?ou=coloc", { maxRedirects: 0 });
    expect(ancienne.status()).toBe(308);
    expect(new URL(ancienne.headers()["location"], "http://x").pathname + new URL(ancienne.headers()["location"], "http://x").search).toBe(`${LISTE}/coloc-la-poele?ou=coloc`);
    const visiteur = await page.request.get(`${LISTE}/coloc-la-poele`, { maxRedirects: 0 });
    expect(visiteur.status()).toBe(307);
    expect(new URL(visiteur.headers()["location"], "http://x").pathname).toBe(LISTE);
    // Abonné, adresse partagée ouverte à froid : liste et fiche, sans erreur ni 404.
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    const r = await page.goto(`${LISTE}/coloc-la-poele`);
    expect(r?.status()).toBe(200);
    await expect(page.locator("[data-fiche-panneau='coloc-la-poele'] h1")).toBeVisible();
    await expect(actives(page)).toHaveAttribute("data-ligne-qr", "coloc-la-poele");
    // s26 liste et détail, tour 1 (mesures §6) : id inconnu pour l'abonné, vrai 404 de statut (plus un 200 « introuvable »).
    expect((await page.goto(`${LISTE}/inexistant-xyz`))?.status(), "id inconnu : 404").toBe(404);
  });

  // s26 liste et détail, tour 3 (mesures N2 : vide de fin de la carte d'exemple 159 px à 1280) et tour 6 (relectures
  // v3 : vides à droite de « Pour quoi faire ? » et sous « Où et avec qui ? », bord droit à x 920 aligné sur rien,
  // titres fermés lus plus gros que celui de l'exemple). Visiteur, 1280 et 1920 : chaque carte de l'extrait commence et
  // finit sur une colonne de la grille de la page (12 colonnes, gouttière 48, entre le bord gauche du texte du hero et
  // le bord droit de la carte d'offre ; bords utilisés 8/4 et 4/4/4) ; chaque rangée couvre toute la largeur sans autre
  // vide que les gouttières ; aucune carte ne finit à plus de 32 px du bas de sa rangée ; en fin de carte (exemple,
  // filtres), 32 px au plus sous le dernier bloc en plus de la marge de 24 ; « Pour quoi faire ? » sur une ligne,
  // 8 px entre pastilles, rien à droite de la dernière ; titres des tuiles fermées <= titre de l'exemple.
  for (const largeur of [1280, 1920]) {
    test(`aperçu (${largeur}) : bords sur la grille 8/4, vides <= 32 px, titres fermés sous l'exemple`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto(LISTE);
      const m = await page.evaluate(() => {
        const R = (e: Element) => e.getBoundingClientRect();
        const texte = R(document.querySelector("[data-apercu-hero] > *")!);
        const offre = R(document.querySelector("[data-apercu-hero] [data-apercu-offre]")!);
        const col = (offre.right - texte.left - 11 * 48) / 12;
        const gauches = [0, 4, 8].map((c) => texte.left + c * (col + 48));
        const droites = [3, 7, 11].map((c) => texte.left + c * (col + 48) + col);
        const cartes = Array.from(document.querySelectorAll<HTMLElement>("[data-apercu-extrait] [data-tuile-fermee]"))
          .filter((t) => t.offsetParent !== null)
          .map((t) => R(t));
        const rangees = new Map<number, DOMRect[]>();
        for (const c of cartes) rangees.set(Math.round(c.top), [...(rangees.get(Math.round(c.top)) ?? []), c]);
        const finDeCarte = (sel: string) => {
          const c = document.querySelector<HTMLElement>(`[data-apercu-extrait] ${sel}`)!;
          const s = getComputedStyle(c);
          const dernier = Array.from(c.children).filter((e) => (e as HTMLElement).offsetParent !== null && getComputedStyle(e).position !== "absolute").pop()!;
          return Math.round(R(c).bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom) - R(dernier).bottom);
        };
        const pour = document.querySelector<HTMLElement>("[data-apercu-extrait] [data-apercu-filtres-pour]")!;
        const lis = Array.from(pour.querySelectorAll<HTMLElement>("li")).map(R);
        const sp = getComputedStyle(pour);
        const taille = (h: Element) => parseFloat(getComputedStyle(h).fontSize);
        const titres = Array.from(document.querySelectorAll("[data-apercu-extrait] h2"));
        return {
          horsGrille: cartes
            .filter((c) => !gauches.some((x) => Math.abs(c.left - x) <= 1) || !droites.some((x) => Math.abs(c.right - x) <= 1))
            .map((c) => `${Math.round(c.left)}-${Math.round(c.right)}`),
          rangees: Array.from(rangees.values()).map((r) => {
            const tri = [...r].sort((a, b) => a.left - b.left);
            const bas = Math.max(...r.map((c) => c.bottom));
            return {
              debut: Math.round(tri[0].left - texte.left),
              fin: Math.round(offre.right - tri[tri.length - 1].right),
              gouttieres: tri.slice(1).map((c, i) => Math.round(c.left - tri[i].right)),
              videSous: Math.round(Math.max(...r.map((c) => bas - c.bottom))),
            };
          }),
          finExemple: finDeCarte("[data-apercu-situation]"),
          finFiltres: finDeCarte("[data-apercu-filtres]"),
          pour: {
            lignes: new Set(lis.map((l) => Math.round(l.top))).size,
            ecarts: lis.slice(1).map((l, i) => Math.round(l.left - lis[i].right)),
            vide: Math.round(R(pour).right - parseFloat(sp.borderRightWidth) - parseFloat(sp.paddingRight) - lis[lis.length - 1].right),
          },
          titreExemple: taille(titres[0]),
          titresFermes: titres.slice(1).filter((h) => (h as HTMLElement).offsetParent !== null).map(taille),
        };
      });
      // s26 liste et détail, tour 7 (relecture design v4, points 1 et 2) : 48 px d'air de section (Thomas) entre les
      // pastilles du hero et la légende, la carte d'offre au plus à 48 px aussi ; tuiles du bas entières (aucun fondu sur
      // la suite ni sur l'extrait), 48 px entre la dernière et la carte de fin.
      const t7 = await page.evaluate(() => {
        const R = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        const masque = (s: string) => { const c = getComputedStyle(document.querySelector(s)!); return c.maskImage || c.webkitMaskImage; };
        const tuiles = Array.from(document.querySelectorAll("[data-apercu-rangee='2'] > *")).filter((t) => getComputedStyle(t).display !== "none");
        return {
          pastilles: Math.round(R("[data-apercu-legende]").top - R("[data-apercu-pastilles]").bottom),
          offre: Math.round(R("[data-apercu-legende]").top - R("[data-apercu-offre]").bottom),
          masques: [masque("[data-apercu-suite]"), masque("[data-apercu-fiche]")],
          fin: Math.round(R("[data-apercu-fin]").top - Math.max(...tuiles.map((t) => t.getBoundingClientRect().bottom))),
        };
      });
      expect(t7.pastilles, "48 px entre les pastilles et la légende").toBe(48);
      expect(t7.offre, "carte d'offre à 48 px au plus de la légende").toBeLessThanOrEqual(48);
      expect(t7.masques, "aucun fondu sur les tuiles").toEqual(["none", "none"]);
      expect(t7.fin, "48 px entre la dernière tuile et la carte de fin").toBe(48);
      expect(m.horsGrille, "cartes hors de la grille 8/4").toEqual([]);
      for (const r of m.rangees) {
        expect([r.debut, r.fin], "rangée de bord à bord").toEqual([0, 0]);
        expect(r.gouttieres, "seulement les gouttières de 48 px").toEqual(r.gouttieres.map(() => 48));
        expect(r.videSous, "vide sous une carte de la rangée").toBeLessThanOrEqual(32);
      }
      expect(m.rangees.length, "trois rangées : exemple et lieux, buts, tuiles fermées").toBe(3);
      expect(m.finExemple, "vide de fin de la carte d'exemple").toBeLessThanOrEqual(32);
      expect(m.finFiltres, "vide de fin des filtres").toBeLessThanOrEqual(32);
      expect(m.pour.lignes, "pastilles sur une ligne").toBe(1);
      expect(m.pour.ecarts, "8 px entre pastilles").toEqual(m.pour.ecarts.map(() => 8));
      expect(m.pour.vide, "vide à droite des pastilles").toBeLessThanOrEqual(8);
      expect(m.titresFermes.length).toBe(3);
      for (const t of m.titresFermes) expect(t, "titre fermé <= titre de l'exemple").toBeLessThanOrEqual(m.titreExemple);
    });
  }

  // s26 liste et détail, tour 6 (relecture design v3 : dernière ligne visible de la liste coupée sans indice) : abonné,
  // 1024 x 768 (la liste défile) : en haut de liste, dégradé du bas visible, celui du haut éteint ; après défilement, les
  // deux ; tout en bas, celui du bas éteint. Aucun ne capte le pointeur.
  test("dès 1024 : dégradé de la liste quand elle défile, sans capter le pointeur", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(LISTE);
    const corps = page.locator("[data-liste-corps]");
    await expect(corps).toBeVisible();
    expect(await corps.evaluate((c) => c.scrollHeight > c.clientHeight + 100), "la liste défile").toBe(true);
    const haut = page.locator("[data-degrade-liste='haut']");
    const bas = page.locator("[data-degrade-liste='bas']");
    const opacite = (l: typeof haut) => l.evaluate((e) => getComputedStyle(e).opacity);
    const defiler = (y: number | "fin") => corps.evaluate((c, v) => c.scrollTo({ top: v === "fin" ? c.scrollHeight : v }), y);
    await defiler(0);
    await expect.poll(() => opacite(bas)).toBe("1");
    await expect.poll(() => opacite(haut)).toBe("0");
    await defiler(120);
    await expect.poll(() => opacite(haut)).toBe("1");
    await expect.poll(() => opacite(bas)).toBe("1");
    await defiler("fin");
    await expect.poll(() => opacite(bas)).toBe("0");
    for (const d of [haut, bas]) {
      expect(await d.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe("none");
      expect(await d.evaluate((e) => Math.round(e.getBoundingClientRect().height)), "dégradé discret").toBeLessThanOrEqual(16);
    }
    // La ligne sous le dégradé du bas reste cliquable : au point du dégradé, l'élément touché est un lien de la liste.
    await defiler(120);
    const touche = await bas.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest("a[data-ligne-qr], summary, [data-liste-lignes]") !== null;
    });
    expect(touche, "dégradé transparent au pointeur").toBe(true);
  });

  // s26 liste et détail, tour 7 (relecture design v4, points 7 à 9) : abonné, 1280 : la liste ne bouge pas au défilement
  // (haut de départ = haut collé, 153 px) ; « Fait » ne change pas la hauteur de la carte ; « Enregistrer » désactivé
  // lisible (libellé en gris secondaire, contour de l'actif, aucune opacité).
  test("abonné (1280) : liste immobile au défilement, « Fait » sans décalage, « Enregistrer » désactivé lisible", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(LISTE);
    const href = await colonne(page).locator("a[data-ligne-qr]").first().getAttribute("href");
    await page.goto(href!);
    const fiche = page.locator("[data-fiche-panneau]");
    await expect(fiche.locator("h1")).toBeVisible();
    const hautListe = () => colonne(page).evaluate((n) => Math.round(n.getBoundingClientRect().top));
    const hauts: number[] = [];
    for (const y of [0, 5, 9, 40, 200]) {
      await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y);
      hauts.push(await hautListe());
    }
    expect(hauts, "liste immobile au défilement").toEqual(hauts.map(() => 153));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const enregistrer = fiche.getByRole("button", { name: "Enregistrer" });
    await expect(enregistrer).toBeDisabled();
    expect(await enregistrer.evaluate((b) => { const s = getComputedStyle(b); return [s.color, s.borderTopColor, s.opacity]; })).toEqual(["rgb(179, 179, 179)", "rgb(112, 112, 112)", "1"]);
    const hauteur = () => fiche.evaluate((f) => Math.round(f.getBoundingClientRect().height * 10) / 10);
    const avant = await hauteur();
    await fiche.locator("[data-testid='geste-fiche'] [role='group'] button[aria-pressed]").last().click();
    await expect(fiche.locator("[data-testid='geste-fiche'] h3 + span")).toBeVisible();
    expect(await hauteur(), "« Fait » sans décalage de la carte").toBe(avant);
  });

  // s26 liste et détail, tour 5 (relecture design v2 D3 : carte d'offre de 202 px chez le visiteur, 211 chez le gratuit,
  // le reste de la page descendait de 9 px) : à 1280, même hauteur de carte et même haut de l'extrait pour les deux.
  test("aperçu (1280) : carte d'offre de même hauteur, visiteur et gratuit", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const mesure = async () => {
      await page.goto(LISTE);
      const carte = page.locator("[data-apercu-hero] [data-apercu-offre]");
      await expect(carte).toBeVisible();
      return {
        carte: await carte.evaluate((c) => Math.round(c.getBoundingClientRect().height)),
        extrait: await page.locator("[data-apercu-extrait]").evaluate((e) => Math.round(e.getBoundingClientRect().top + window.scrollY)),
      };
    };
    const visiteur = await mesure();
    const email = `e2e-qr-s26-gratuit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
    await creerCompte(email, MOT_DE_PASSE, "FREE");
    await connecter(page, email, MOT_DE_PASSE);
    const gratuit = await mesure();
    expect(gratuit.carte, `carte d'offre : visiteur ${visiteur.carte}, gratuit ${gratuit.carte}`).toBe(visiteur.carte);
    expect(gratuit.extrait, "haut de l'extrait").toBe(visiteur.extrait);
  });

  // s26 liste et détail, tour 1 (spec UX §1, mesures §7) : visiteur, clic sur une tuile fermée de l'aperçu : contour de la
  // carte d'offre (ramenée dans l'écran si besoin), aucune navigation, extrait toujours sans élément focusable.
  for (const [largeur, hauteur] of [[375, 812], [768, 1024], [1280, 900], [1920, 1080]] as const) {
    test(`aperçu (${largeur}) : tuile fermée -> contour sur la carte d'offre et focus sur son bouton, sans navigation`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(LISTE);
      const tuile = page.locator("[data-apercu-extrait] [data-tuile-fermee='']:visible").first();
      await tuile.scrollIntoViewIfNeeded();
      const b = (await tuile.boundingBox())!;
      const adresse = page.url();
      // s26 liste et détail, tour 4 : au survol, curseur main et bord éclairci (pas l'air d'un bouton mort).
      await page.mouse.move(b.x + b.width / 2, b.y + Math.min(b.height / 2, 40));
      expect(await page.locator("[data-apercu-extrait]").evaluate((e) => getComputedStyle(e).cursor)).toBe("pointer");
      await expect(page.locator("[data-apercu-extrait] [data-survol]")).toHaveCount(1);
      await page.mouse.click(b.x + b.width / 2, b.y + Math.min(b.height / 2, 40));
      const carte = page.locator("[data-apercu-hero] [data-apercu-offre]");
      await expect(carte).toHaveAttribute("data-signal", "", { timeout: 1_500 });
      await expect(carte).toBeInViewport({ ratio: 1 });
      // s26 liste et détail, tour 4 (relectures à l'aveugle : captures avant et après le clic identiques) : focus sur le
      // bouton d'offre, anneau visible ; contour tenu au moins 1,2 s.
      const bouton = carte.locator("a[data-position='haut']");
      await expect(bouton).toBeFocused();
      expect(await bouton.evaluate((a) => getComputedStyle(a).boxShadow), "anneau de focus").not.toBe("none");
      await page.waitForTimeout(1_100);
      await expect(carte).toHaveAttribute("data-signal", "");
      expect(page.url()).toBe(adresse);
      await expect(page.locator("[data-apercu-extrait] > [aria-hidden='true']")).toHaveCount(1);
      expect(await page.locator("[data-apercu-extrait] > [aria-hidden='true']").evaluate((e) => e.querySelectorAll("a, button, input, textarea, select, [tabindex]").length)).toBe(0);
    });
  }
});
