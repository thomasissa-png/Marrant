import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5 et §6, critères C1, C2, C6, C7 ;
 * `docs/design/parcours-connecte-s26.md` §5). Serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ; fermé, ces
 * pages gardent le HTML d'avant (inertie, `espace-parcours.spec.ts`).
 * - Trajet (375 et 1280) : « Reprendre » de /parcours (un seul visible) arrive sur l'étape en cours, haut de la carte à
 *   137 ± 2 px du haut de la fenêtre ; étape suivante en 1 clic (même mesure) ; « Retour : Parcours » ramène sur la
 *   carte `#parcours-{slug}` de /parcours, visible.
 * - Mesure (1280 et 1920) : aucune colonne ni carte avec un vide de plus de 32 px en bas (cartes de parcours, carte
 *   « En cours », « Explore aussi »).
 * - s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §1, §2, §6) : menu d'étapes collant dès 1024 (même haut que
 *   la carte d'en-tête, une seule étape visible, menu toujours à 137 px après un clic d'étape, tour 5) ; à 375, l'en-tête d'étape
 *   cliqué ne saute pas (8 px au plus) ; visiteur et gratuit à 375, « Tester l'étape 1 » dans le premier écran, puis
 *   l'étape 1 ouverte à l'arrivée.
 * - s26 parcours, tour 6 (relectures v3) : /parcours en grille fixe 10/7 (témoignage sur la ligne du bouton, vide ≤ 32 px) ;
 *   un seul « Tester l'étape 1 » visible par parcours à 375 ; sous-étapes numérotées sans trou, titre entier sous l'en-tête,
 *   repère neutre 1,5 s, menu immobile au changement d'actif ; quiz sans option violette avant la réponse.
 * - s26 parcours, tour 8 (relectures v5) : « Reprendre » en contour dans la carte du parcours repris ; pastille de la barre
 *   compacte = étape lue ; « Retour : Parcours » en tête de la colonne du menu dès 1024 ; titre d'étape à la même place à
 *   toutes les étapes ; cartes vidéo d'une rangée égales, titres de vignette entiers sur 2 lignes au plus.
 */
const MOT_DE_PASSE = "E2e-parcours-connecte-s26";
const SLUG = "machine-a-cafe";
const ANCRE = 137;
/**
 * s26 parcours, tour 7 : haut attendu d'un bloc amené sous l'en-tête = réserve de défilement du document + 9 (marge des
 * blocs). Dès 1024 px : 128 + 9 = 137 ; sous 1024, la réserve passe à en-tête + barre compacte (`menu-etapes.tsx`).
 */
const reserve = (page: Page) => page.evaluate(() => Math.round(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0));
/** Sous-étapes de l'étape N dans le menu (tour 7 : une liste sous chaque étape). */
const sousEtapesMenu = (page: Page, n: number) => page.locator(`[data-menu-etapes] li:has(> [data-ligne-etape='${n}']) [data-testid='lignes-fiches-menu']`);

async function abonne(page: Page) {
  const email = `e2e-pc-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

async function valider(page: Page, slug: string, etapes: number[]) {
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" WHERE slug = $1`, [slug]);
  for (const stepOrder of etapes) {
    const r = await page.request.post(`/api/parcours/${id}/progress`, { data: { stepOrder } });
    expect(r.status()).toBe(200);
  }
}

/** Haut de l'élément dans la fenêtre, lu une fois la page stable (deux lectures égales à 300 ms d'écart). */
async function hautStable(cible: Locator): Promise<number> {
  const lire = () => cible.evaluate((e) => Math.round(e.getBoundingClientRect().top));
  let avant = await lire();
  for (let i = 0; i < 15; i++) {
    await cible.page().waitForTimeout(300);
    const y = await lire();
    if (y === avant) return y;
    avant = y;
  }
  return avant;
}

/** Nombre d'éléments visibles nommés exactement « Reprendre » (liens et boutons). */
const reprendreVisibles = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("main a, main button")).filter((e) => {
      const r = e.getBoundingClientRect();
      return e.textContent?.trim() === "Reprendre" && r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
    }).length,
  );

/**
 * Vides en bas, en px : pour chaque bloc, (bas de la boîte moins sa marge interne basse) moins le bas du dernier contenu
 * rendu. Renvoie les seuls dépassements de `seuil`.
 */
async function videsEnBas(page: Page, blocs: string[], seuil = 32) {
  return page.evaluate(
    ({ blocs, seuil }) => {
      const basContenu = (e: Element) =>
        Array.from(e.querySelectorAll("*")).reduce((b, d) => (d.getClientRects().length ? Math.max(b, d.getBoundingClientRect().bottom) : b), e.getBoundingClientRect().top);
      const trop: string[] = [];
      for (const sel of blocs) {
        document.querySelectorAll(sel).forEach((e, i) => {
          const r = e.getBoundingClientRect();
          if (!r.height) return;
          const vide = r.bottom - parseFloat(getComputedStyle(e).paddingBottom) - parseFloat(getComputedStyle(e).borderBottomWidth) - basContenu(e);
          if (vide > seuil) trop.push(`${sel}[${i}] : ${Math.round(vide)} px`);
        });
      }
      return trop;
    },
    { blocs, seuil },
  );
}

test.describe("Parcours connecté (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur} : « Reprendre » sur l'étape en cours à 137 px, étape suivante, retour sur la carte du parcours`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const reprendre = page.getByTestId("carte-en-cours-reprendre");
      await expect(reprendre).toHaveText("Reprendre");
      await expect(reprendre).toHaveAttribute("href", `/parcours/${SLUG}#etape-2`);
      // C6 : un seul « Reprendre » PLEIN sur /parcours, 375 compris.
      // s26 parcours, tour 8 : test changé (raison : la carte du parcours repris reçoit le même « Reprendre », en contour,
      // relecture design v5 liste 1 et UX v5 D2 : case vide à droite de « Programme ») : deux visibles, un seul plein.
      const contour = page.getByTestId("carte-parcours-reprendre");
      await expect(contour).toHaveAttribute("href", `/parcours/${SLUG}#etape-2`);
      expect(await reprendreVisibles(page)).toBe(2);
      expect(await contour.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(await reprendre.evaluate((e) => getComputedStyle(e).backgroundColor));

      // C7, clic 1 : l'étape en cours, ouverte, sous l'en-tête collant.
      await reprendre.click();
      await expect(page).toHaveURL(new RegExp(`/parcours/${SLUG}#etape-2$`));
      const etape2 = page.locator("#etape-2");
      await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
      // s26 parcours, tour 7 : test changé (raison : sous 1024 px, l'étape arrive sous la barre compacte collée sous
      // l'en-tête, réserve = en-tête + barre ; dès 1024, 137 inchangé).
      const ancre = (await reserve(page)) + 9;
      if (largeur >= 1024) expect(ancre).toBe(ANCRE);
      expect(Math.abs((await hautStable(etape2)) - ancre), `haut de l'étape 2 à ${ancre} ± 2 px`).toBeLessThanOrEqual(2);
      // Sous 1024, le « Reprendre » du sommaire est replié (aucun second « Reprendre » visible).
      if (largeur < 1024) expect(await reprendreVisibles(page)).toBe(0);

      // s27 corrections (D3) : test changé (raison : le lien « étape suivante » du pied est caché tant que l'abonné n'a
      // pas validé l'étape ; l'étape 2, en cours, n'en a donc pas). Le clic 2 part de l'étape 1, validée.
      await expect(etape2.locator("[data-etape-suivante='3']")).toHaveCount(0);

      // Clic 2 : étape suivante depuis le pied d'une étape validée (étape 1 → étape 2).
      // Dès 1024 px, une seule étape est affichée : on choisit l'étape 1 dans le menu d'étapes, comme un abonné.
      if (largeur >= 1024) await page.locator("[data-menu-etapes]").locator("a[href='#etape-1']").click();
      else await page.locator("#etape-1-entete").click();
      await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
      await page.locator("#etape-1").locator("[data-etape-suivante='2']").click();
      await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
      expect(Math.abs((await hautStable(page.locator("#etape-2"))) - ancre), `haut de l'étape 2 à ${ancre} ± 2 px`).toBeLessThanOrEqual(2);

      // Clic 3 : retour sur la carte du parcours dans /parcours.
      await page.locator("#etape-2 [data-lien-retour]").click();
      await expect(page).toHaveURL(new RegExp(`/parcours#parcours-${SLUG}$`));
      const carte = page.locator(`#parcours-${SLUG}`);
      expect(Math.abs((await hautStable(carte)) - ANCRE), "haut de la carte du parcours à 137 ± 2 px").toBeLessThanOrEqual(2);
      await expect(carte).toBeInViewport();
    });
  }

  for (const [largeur, hauteur] of [[1280, 900], [1920, 1080]] as const) {
    test(`${largeur} : aucune colonne avec un vide de plus de 32 px en bas (abonné et visiteur)`, async ({ page, browser }) => {
      const blocsListe = ["[data-parcours-cartes] > [id^='parcours-']", "[data-testid='carte-en-cours']", "main nav a[class*='p-6']"];
      // Visiteur.
      const visiteur = await browser.newPage({ viewport: { width: largeur, height: hauteur } });
      await visiteur.goto("/parcours");
      await expect(visiteur.locator("[data-parcours-cartes] > [id^='parcours-']").first()).toBeVisible();
      await visiteur.evaluate(() => document.fonts.ready);
      expect(await videsEnBas(visiteur, blocsListe), "/parcours visiteur").toEqual([]);
      // s26 parcours v2 : test changé (raison : plus d'en-tête 7/5 ni de carte de progression à droite ; menu d'étapes à
      // gauche, 360 px et 32 px de gouttière dès 1280, haut du menu = haut de la carte d'en-tête, §8 lignes 1 et 2).
      await visiteur.goto(`/parcours/${SLUG}`);
      const menuV = visiteur.locator("[data-menu-etapes]");
      await expect(menuV).toBeVisible();
      const mesureV = await menuV.evaluate((m) => {
        const r = m.getBoundingClientRect();
        const e = document.querySelector("[data-entete-parcours]")?.getBoundingClientRect();
        return { largeur: Math.round(r.width), haut: Math.round(r.top), hautEntete: Math.round(e?.top ?? -1), gouttiere: Math.round((e?.left ?? 0) - r.right) };
      });
      expect(mesureV.largeur, JSON.stringify(mesureV)).toBe(360);
      expect(mesureV.gouttiere, JSON.stringify(mesureV)).toBe(32);
      expect(Math.abs(mesureV.haut - mesureV.hautEntete), JSON.stringify(mesureV)).toBeLessThanOrEqual(2);
      await visiteur.close();

      // Abonné avancé.
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      await expect(page.getByTestId("carte-en-cours")).toBeVisible();
      await expect(page.locator("[data-parcours-cartes] [role='progressbar']").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await videsEnBas(page, blocsListe), "/parcours abonné").toEqual([]);
      // Cartes d'une même rangée : même haut, même bas (sous-grille).
      const rangees = await page.locator("[data-parcours-cartes] > [id^='parcours-']").evaluateAll((cs) =>
        cs.map((c) => ({ haut: Math.round(c.getBoundingClientRect().top), bas: Math.round(c.getBoundingClientRect().bottom) })),
      );
      for (let i = 0; i + 1 < rangees.length; i += 2) {
        if (rangees[i].haut !== rangees[i + 1].haut) continue;
        expect(Math.abs(rangees[i].bas - rangees[i + 1].bas), `bas des cartes ${i} et ${i + 1}`).toBeLessThanOrEqual(1);
      }
    });
  }

  // s26 parcours v2 (§1, §2) : menu d'étapes persistant dès 1024.
  for (const [largeur, hauteur] of [[1024, 768], [1280, 900]] as const) {
    test(`${largeur} : menu d'étapes visible et collant après clic sur une étape, une seule étape visible`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      await expect(menu).toBeVisible();
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-2");
      await menu.locator("a[href='#etape-3']").click();
      await expect(page.locator("#etape-3-entete")).toHaveAttribute("aria-expanded", "true");
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-3");
      const etapesVisibles = await page.locator("[role='list'][aria-label='Étapes du parcours'] > [id^='etape-']").evaluateAll((cs) => cs.filter((c) => c.getBoundingClientRect().height > 0).map((c) => c.id));
      expect(etapesVisibles).toEqual(["etape-3"]);
      await page.evaluate(() => window.scrollBy({ top: 700, behavior: "instant" }));
      await page.waitForTimeout(500);
      const haut = await hautStable(menu);
      // s26 parcours, tour 5 : test changé (raison : menu collé à 137 px, le haut d'une étape ou d'une fiche amenée sous
      // l'en-tête, au lieu de 144 ; D6 de la relecture design v2, 7 px de décalage entre menu et carte d'étape).
      expect(Math.abs(haut - ANCRE), `haut collé du menu : ${haut}`).toBeLessThanOrEqual(2);
      await expect(menu).toBeInViewport();
      await expect(menu.locator("#sommaire-reprendre")).toBeVisible();
    });
  }

  test("375 : ouvrir une étape sous une étape ouverte ne fait pas sauter son en-tête (8 px au plus)", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/parcours/${SLUG}`);
    await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("lignes-fiches")).toBeVisible();
    const entete = page.locator("#etape-2-entete");
    await entete.evaluate((e) => {
      e.scrollIntoView({ block: "start", behavior: "instant" });
      window.scrollBy({ top: -400, behavior: "instant" });
    });
    const avant = await hautStable(entete);
    await entete.click();
    await expect(entete).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "false");
    const apres = await hautStable(entete);
    expect(Math.abs(apres - avant), `en-tête de l'étape 2 : ${avant} puis ${apres}`).toBeLessThanOrEqual(8);
  });

  for (const compte of ["visiteur", "gratuit"] as const) {
    test(`375, ${compte} : « Tester l'étape 1 » dans le premier écran, étape 1 ouverte à l'arrivée`, async ({ page }) => {
      if (compte === "gratuit") {
        const email = `e2e-pc-s26-g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, "FREE");
        await connecter(page, email, MOT_DE_PASSE);
      }
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      const bouton = page.getByTestId("tester-etape-1-mobile");
      await expect(bouton).toBeVisible();
      await expect(bouton).toHaveText(/^Tester l’étape 1 de .+, gratuite$/);
      const bas = await bouton.evaluate((e) => Math.round(e.getBoundingClientRect().bottom));
      expect(bas, `bas du bouton : ${bas}`).toBeLessThanOrEqual(700);
      // Contour : aucun aplat violet sur le bouton.
      expect(await bouton.evaluate((e) => e.className)).not.toMatch(/(^|\s)bg-accent/);
      await bouton.click();
      await expect(page).toHaveURL(/\/parcours\/[a-z-]+\?src=hub#etape-1$/);
      await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#etape-1")).toBeInViewport();
    });
  }

  // s26 parcours, tour 5 (relectures à l'aveugle v2 : UX F1, F2, F3, F6, F8 ; design D1, D6, D9).
  for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
    test(`${largeur} : clic sur chaque sous-étape, son bloc à 137 ± 2 px, un seul état actif`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      // Progression lue : l'étape 2 (à reprendre) est l'étape active du menu.
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-2");
      // 1280 : les sous-étapes du menu ; 375 : la liste en tête de l'étape ouverte (menu replié).
      // s26 parcours, tour 7 : test changé (raison : sous-étapes sous chaque étape du menu, celles de l'étape 2 ciblées ;
      // sous 1024 px, haut attendu = réserve en-tête + barre compacte + marge du bloc).
      const liste = largeur >= 1024 ? sousEtapesMenu(page, 2) : page.locator("#etape-2").getByTestId("lignes-fiches");
      await expect(liste.locator("a[data-fiche]").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const ancres = await liste.locator("a[data-fiche]").evaluateAll((as) => as.map((a) => a.getAttribute("data-fiche") as string));
      expect(ancres.length, "sous-étapes de l'étape 2").toBeGreaterThanOrEqual(4);
      for (const ancre of ancres) {
        const lien = liste.locator(`a[data-fiche='${ancre}']`);
        await lien.scrollIntoViewIfNeeded();
        const titre = (await lien.locator("span").nth(1).textContent())?.replace(/\s+/g, " ").trim() ?? "";
        await lien.click();
        await expect(page).toHaveURL(new RegExp(`#${ancre}$`));
        const bloc = page.locator(`#${ancre}`);
        // s26 parcours, tour 6 (D7 UX v3 : 2.3 et 2.4 côte à côte à 1280 donnaient le même écran sans repère) : la
        // sous-étape cliquée, et elle seule, porte le repère neutre (contour gris, aucun violet) ; il part au bout de 1,5 s.
        await expect(page.locator("[data-fiche-reperee]")).toHaveCount(1);
        await expect(bloc).toHaveAttribute("data-fiche-reperee", "");
        const contour = await bloc.evaluate((e) => ({ style: getComputedStyle(e).outlineStyle, couleur: getComputedStyle(e).outlineColor }));
        expect(contour.style, ancre).toBe("solid");
        expect(contour.couleur, ancre).toBe("rgb(154, 154, 154)");
        const haut = await hautStable(bloc);
        // s26 parcours, tour 6 : test changé (raison : une vidéo de la première rangée amène le titre de sa section à 137 px,
        // la carte 32 px dessous ; D7 UX v3, « Pour aller plus loin, facultatif » coupé sous l'en-tête). Attendu : haut du
        // bloc = `scroll-padding-top` (128) + sa `scroll-margin-top` (9, ou 41 pour la première rangée de vidéos).
        const marge = await bloc.evaluate((e) => parseFloat(getComputedStyle(e).scrollMarginTop));
        const attendu = (await reserve(page)) + marge;
        expect(Math.abs(haut - attendu), `${ancre} (« ${titre} ») : haut du bloc ${haut}, attendu ${attendu}`).toBeLessThanOrEqual(2);
        // Tour 6 : le titre de la sous-étape est visible ENTIER sous l'en-tête, et aucun titre de section n'est coupé par lui.
        const vue = await bloc.evaluate((b, morceaux) => {
          const plat = (t: string | null) => (t ?? "").replace(/\s+/g, " ").trim();
          const basEntete = Math.max(...Array.from(document.querySelectorAll("header")).map((h) => h.getBoundingClientRect().bottom), 0);
          const titres = morceaux.map((m) => {
            const els = [b, ...Array.from(b.querySelectorAll("*"))].filter((e) => plat(e.textContent).includes(m));
            const r = els[els.length - 1]?.getBoundingClientRect();
            return r ? { m, haut: Math.round(r.top), bas: Math.round(r.bottom) } : { m, haut: -1, bas: -1 };
          });
          const coupes = Array.from(document.querySelectorAll("main h4"))
            .map((h) => h.getBoundingClientRect())
            .filter((r) => r.height > 0 && r.top < basEntete - 1 && r.bottom > basEntete + 1).length;
          return { basEntete: Math.round(basEntete), hauteur: window.innerHeight, titres, coupes };
        }, titre.split(" · "));
        for (const t of vue.titres) {
          expect(t.haut, `${ancre} : « ${t.m} » sous l'en-tête (${JSON.stringify(vue)})`).toBeGreaterThanOrEqual(vue.basEntete);
          expect(t.bas, `${ancre} : « ${t.m} » dans la fenêtre (${JSON.stringify(vue)})`).toBeLessThanOrEqual(vue.hauteur);
        }
        expect(vue.coupes, `${ancre} : titres coupés par l'en-tête`).toBe(0);
        // Le bloc porte le titre de la ligne (vidéo : titre et artiste de la carte).
        const texteBloc = ((await bloc.textContent()) ?? "").replace(/\s+/g, " ");
        for (const morceau of titre.split(" · ")) expect(texteBloc, ancre).toContain(morceau);
        // Un seul état actif : une étape (aria-current="step") et une sous-étape, celle cliquée, partout dans la page.
        expect(await menu.locator("a[aria-current='step']").count()).toBe(1);
        const actives = await page.locator("a[data-fiche-active]").evaluateAll((as) =>
          Array.from(new Set(as.map((a) => a.getAttribute("data-fiche")))),
        );
        expect(actives, `fiches actives après ${ancre}`).toEqual([ancre]);
        await expect(page.locator(`a[data-fiche='${ancre}'][aria-current='location']`).first()).toBeAttached();
        if (largeur >= 1024) {
          // Menu collé au même haut que le bloc (D6 : au pixel ; tour 6, première rangée de vidéos : que son titre de section).
          const hautMenu = await hautStable(menu);
          expect(Math.abs(hautMenu - (haut - marge + 9)), `menu ${hautMenu}, bloc ${haut}`).toBeLessThanOrEqual(1);
        } else {
          await page.locator("#etape-2").getByTestId("lignes-fiches").scrollIntoViewIfNeeded();
        }
      }
      // Tour 6 : le repère est parti (1,5 s après le dernier clic).
      await expect(page.locator("[data-fiche-reperee]")).toHaveCount(0, { timeout: 3_000 });
      // Sous-étapes sans soulignement au repos (D2) : pointeur hors de la liste, focus rendu au corps de page.
      await page.mouse.move(0, 0);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const auRepos = await liste.locator("a[data-fiche] span").evaluateAll((ss) =>
        ss.filter((s) => getComputedStyle(s).textDecorationLine.includes("underline")).length,
      );
      expect(auRepos, "sous-étapes soulignées au repos").toBe(0);
    });
  }

  for (const compte of ["visiteur", "gratuit"] as const) {
    for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
      test(`${largeur}, ${compte} : « Passer à l'étape 2 » visible en fin d'étape 1, cadenas sur les étapes suivantes`, async ({ page }) => {
        if (compte === "gratuit") {
          const email = `e2e-pc-s26-g5-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
          await creerCompte(email, MOT_DE_PASSE, "FREE");
          await connecter(page, email, MOT_DE_PASSE);
        }
        await page.setViewportSize({ width: largeur, height: hauteur });
        await page.goto(`/parcours/${SLUG}#etape-1`);
        await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
        const passer = page.locator("#etape-1").getByRole("link", { name: /^Passer à l’étape 2 · 1,99/ });
        await passer.scrollIntoViewIfNeeded();
        await expect(passer).toBeVisible();
        await expect(passer).toBeInViewport();
        expect(await passer.evaluate((e) => e.className)).not.toMatch(/(^|\s)bg-accent/);
        // Menu : étape 1 en lecture libre, étapes 2 et suivantes avec le cadenas de la bande de rubriques.
        if (largeur < 1024) await page.locator("[data-menu-bascule]").click();
        const menu = page.locator("[data-menu-etapes]");
        await expect(menu).toBeVisible();
        const lignes = await menu.locator("[data-ligne-etape]").evaluateAll((ls) =>
          ls.map((l) => ({ n: Number(l.getAttribute("data-ligne-etape")), cadenas: !!l.querySelector("[data-statut='verrouillee'] svg rect") })),
        );
        expect(lignes.length).toBeGreaterThanOrEqual(3);
        for (const l of lignes) expect(l.cadenas, `étape ${l.n}`).toBe(l.n >= 2);
        const icone = await page.locator("header svg rect[width='16'][height='10']").first().evaluate((r) => r.parentElement?.innerHTML).catch(() => null);
        const iconeMenu = await menu.locator("[data-statut='verrouillee'] svg").first().evaluate((s) => s.innerHTML);
        if (icone) expect(iconeMenu).toBe(icone);
      });
    }
  }

  for (const [largeur, hauteur] of [[768, 1024], [1024, 768], [1280, 900], [1920, 1080]] as const) {
    test(`${largeur} : /parcours, aucune carte avec du texte en colonnes CSS, une cellule par bloc, écart ≤ 32 px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
      await expect(cartes.first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const mesures = await cartes.evaluateAll((cs) =>
        cs.map((c) => {
          const colonnes = Array.from(c.querySelectorAll<HTMLElement>("*")).filter((e) => {
            const s = getComputedStyle(e);
            return (s.columnCount !== "auto" && s.columnCount !== "1") || s.columnWidth !== "auto";
          }).length;
          const texte = c.querySelector<HTMLElement>("[data-parcours-texte]");
          const blocs = texte ? (Array.from(texte.children) as HTMLElement[]) : [];
          const h = blocs.map((b) => b.getBoundingClientRect().height);
          const hauts = blocs.map((b) => Math.round(b.getBoundingClientRect().top));
          return { id: c.id, colonnes, blocs: blocs.length, cotes: hauts.length === 2 && hauts[0] === hauts[1], ecart: h.length === 2 ? Math.round(Math.abs(h[0] - h[1])) : -1 };
        }),
      );
      expect(mesures.length).toBeGreaterThanOrEqual(3);
      for (const m of mesures) {
        expect(m.colonnes, `${m.id} : éléments en colonnes CSS`).toBe(0);
        expect(m.blocs, `${m.id} : une cellule par bloc`).toBe(2);
        expect(m.cotes, `${m.id} : description et témoignage côte à côte`).toBe(true);
        expect(m.ecart, `${m.id} : écart de hauteur ${m.ecart} px`).toBeLessThanOrEqual(32);
      }
    });
  }

  test("1280 : retour du navigateur depuis un parcours, la carte du parcours sous l'en-tête (137 ± 2 px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/parcours");
    const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
    await expect(cartes.first()).toBeVisible();
    const derniere = cartes.last();
    const id = (await derniere.getAttribute("id")) as string;
    const slug = id.replace(/^parcours-/, "");
    // Bouton de la carte (« Tester l'étape 1 de … » : `router.push`, pas un lien).
    const bouton = derniere.getByRole("button", { name: /^Tester l’étape 1 de / });
    await bouton.scrollIntoViewIfNeeded();
    await bouton.click();
    await expect(page).toHaveURL(new RegExp(`/parcours/${slug}`));
    await expect(page.locator("[data-menu-etapes]")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/parcours$/);
    const haut = await hautStable(page.locator(`#${id}`));
    expect(Math.abs(haut - ANCRE), `haut de ${id} au retour : ${haut}`).toBeLessThanOrEqual(2);
  });

  test("1280 : progression cohérente (« Étape 3 sur 3 » sur /parcours et dans le menu) et segments vides visibles (3:1)", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    // Nouvel abonné : segments « à venir » cernés à 3:1 au moins contre le fond de la carte.
    await page.goto("/parcours");
    await expect(page.locator("[data-parcours-cartes] [role='progressbar']").first()).toBeVisible();
    const contrastes = await page.locator("[data-segment='a-venir']").evaluateAll((ss) => {
      const lum = (c: string) => {
        const [r, g, b] = (c.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).slice(0, 3).map((v) => {
          const x = Number(v) / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return ss.map((s) => {
        let e: HTMLElement | null = s.parentElement;
        while (e && getComputedStyle(e).backgroundColor.match(/rgba\(0, 0, 0, 0\)|transparent/)) e = e.parentElement;
        const fond = lum(e ? getComputedStyle(e).backgroundColor : "rgb(13, 13, 13)");
        const bord = lum(getComputedStyle(s).borderTopColor);
        const largeurBord = parseFloat(getComputedStyle(s).borderTopWidth);
        return largeurBord >= 1 ? (Math.max(fond, bord) + 0.05) / (Math.min(fond, bord) + 0.05) : 0;
      });
    });
    expect(contrastes.length).toBeGreaterThan(0);
    for (const c of contrastes) expect(c, "contraste du contour d'un segment vide").toBeGreaterThanOrEqual(3);

    await valider(page, SLUG, [1, 2]);
    await page.goto("/parcours");
    await expect(page.getByTestId("carte-en-cours")).toContainText("Étape 3 sur 3");
    await page.goto(`/parcours/${SLUG}`);
    const enTeteMenu = page.locator("[data-menu-etapes] #menu-etapes-titre + p");
    await expect(enTeteMenu).toHaveText("Étape 3 sur 3");
    await expect(page.locator("main")).not.toContainText("2 sur 3 étapes");
  });

  // s26 parcours, tour 6 (relectures à l'aveugle v3 : design Parcours liste D1, D3 ; détail D2, D3, D5 ; UX D8, D11a).
  for (const [largeur, hauteur] of [[768, 1024], [1024, 768], [1280, 900], [1920, 1080]] as const) {
    test(`${largeur} : /parcours, grille fixe identique dans les 5 cartes, témoignage sur la ligne du bouton, vide ≤ 32 px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
      await expect(cartes.first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const mesures = await cartes.evaluateAll((cs) =>
        cs.map((c) => {
          const texte = c.querySelector<HTMLElement>("[data-parcours-texte]")!;
          const [d, t] = Array.from(texte.children).map((e) => e.getBoundingClientRect());
          const pied = c.querySelector<HTMLElement>("[data-parcours-pied]")!;
          const bouton = (pied.lastElementChild as HTMLElement).getBoundingClientRect();
          return {
            id: c.id,
            colonnes: getComputedStyle(texte).gridTemplateColumns,
            xTemoignage: Math.round(t.left - c.getBoundingClientRect().left),
            xBouton: Math.round(bouton.left - c.getBoundingClientRect().left),
            vide: Math.round(Math.abs(d.bottom - t.bottom)),
          };
        }),
      );
      expect(mesures.length).toBe(5);
      // Même grille (mêmes pistes) et même colonne de départ du témoignage dans les 5 cartes.
      expect(new Set(mesures.map((m) => m.colonnes)).size, JSON.stringify(mesures)).toBe(1);
      expect(new Set(mesures.map((m) => m.xTemoignage)).size, JSON.stringify(mesures)).toBe(1);
      for (const m of mesures) {
        // Dès 1024, pied en ligne sur la même grille : le témoignage commence au bord gauche du bouton.
        if (largeur >= 1024) expect(Math.abs(m.xTemoignage - m.xBouton), `${m.id} : témoignage ${m.xTemoignage}, bouton ${m.xBouton}`).toBeLessThanOrEqual(1);
        expect(m.vide, `${m.id} : vide sous la colonne courte`).toBeLessThanOrEqual(32);
      }
    });
  }

  for (const compte of ["visiteur", "gratuit"] as const) {
    test(`375, ${compte} : un seul « Tester l'étape 1 » visible par parcours, celui du premier parcours dans le premier écran`, async ({ page }) => {
      if (compte === "gratuit") {
        const email = `e2e-pc-s26-g6-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, "FREE");
        await connecter(page, email, MOT_DE_PASSE);
      }
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      await expect(page.getByTestId("tester-etape-1-mobile")).toBeInViewport();
      const visibles = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("main a, main button"))
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return /^Tester l’étape 1 de /.test(e.textContent?.trim() ?? "") && r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
          })
          .map((e) => (e.textContent ?? "").trim()),
      );
      expect(visibles.length, JSON.stringify(visibles)).toBeGreaterThanOrEqual(4);
      expect(new Set(visibles).size, `boutons en double : ${JSON.stringify(visibles)}`).toBe(visibles.length);
    });
  }

  for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
    test(`${largeur} : sous-étapes numérotées sans trou (menu et carte), menu immobile quand la sous-étape active change`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-2");
      await page.evaluate(() => document.fonts.ready);
      const numeros = (sel: string) =>
        page.locator(sel).evaluateAll((as) => as.map((a) => (a.querySelector("span")?.textContent ?? "").trim()));
      // s26 parcours, tour 7 : test changé (raison : une liste de sous-étapes sous chaque étape du menu, celle de l'étape 2).
      await expect(sousEtapesMenu(page, 2).locator("a[data-fiche]").first()).toBeAttached();
      await expect(page.locator("#etape-2 [data-testid='lignes-fiches'] a[data-fiche]").first()).toBeAttached();
      const duMenu = await numeros("[data-menu-etapes] li:has(> [data-ligne-etape='2']) [data-testid='lignes-fiches-menu'] a[data-fiche]");
      const deLaCarte = await numeros("#etape-2 [data-testid='lignes-fiches'] a[data-fiche]");
      expect(duMenu.length, "sous-étapes de l'étape 2").toBeGreaterThanOrEqual(3);
      expect(duMenu).toEqual(duMenu.map((_, i) => `2.${i + 1}`));
      expect(deLaCarte).toEqual(duMenu);
      if (largeur < 1024) return;
      // 1280 : la ligne qui devient active garde sa hauteur, le menu ne bouge pas (0 px).
      const lignes = sousEtapesMenu(page, 2).locator("a[data-fiche]");
      const hauteurs = () => lignes.evaluateAll((as) => as.map((a) => Math.round(a.getBoundingClientRect().height)));
      const hauteurMenu = () => sousEtapesMenu(page, 2).evaluate((l) => Math.round(l.getBoundingClientRect().height));
      const avant = { lignes: await hauteurs(), menu: await hauteurMenu() };
      for (let i = 0; i < avant.lignes.length; i++) {
        await lignes.nth(i).click();
        await expect(lignes.nth(i)).toHaveAttribute("aria-current", "location");
        expect(await hauteurs(), `après le clic sur la ligne ${i + 1}`).toEqual(avant.lignes);
        expect(await hauteurMenu(), `menu après le clic sur la ligne ${i + 1}`).toBe(avant.menu);
        const graisses = await lignes.evaluateAll((as) => Array.from(new Set(as.flatMap((a) => Array.from(a.querySelectorAll("span")).slice(0, 2).map((s) => getComputedStyle(s).fontWeight)))));
        expect(graisses, "une seule graisse dans les sous-étapes").toEqual(["400"]);
      }
    });
  }

  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur}, visiteur : quiz d'étape, aucune option cernée de violet à l'arrivée ni au survol`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}#etape-1`);
      await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
      const options = page.locator("#etape-1 [role='group'][aria-labelledby^='quiz-q-'] > button");
      await options.first().scrollIntoViewIfNeeded();
      await expect(options.first()).toBeVisible();
      const violets = () =>
        options.evaluateAll((bs) =>
          bs
            .map((b, i) => ({ i, c: getComputedStyle(b).borderTopColor }))
            .filter(({ c }) => ["rgb(139, 92, 246)", "rgb(167, 139, 250)", "rgb(109, 40, 217)"].includes(c))
            .map(({ i }) => i),
        );
      expect(await violets(), "options violettes à l'arrivée").toEqual([]);
      const n = await options.count();
      expect(n).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < n; i++) {
        await options.nth(i).hover();
        expect(await violets(), `options violettes au survol de l'option ${i + 1}`).toEqual([]);
      }
    });
  }

  // s26 parcours, tour 7 (relectures à l'aveugle v4 : UX D5, D6 ; design 11 à 19 ; MESURES v4 §2 et §6).
  for (const compte of ["avance", "nouvel"] as const) {
    test(`375, ${compte} : barre compacte collée sous l'en-tête (retour et menu) après l'arrivée et un choix d'étape, menu replié après le choix`, async ({ page }) => {
      await abonne(page);
      if (compte === "avance") await valider(page, SLUG, [1, 2]);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      const bouton = page.getByTestId("carte-en-cours-reprendre");
      await expect(bouton).toBeVisible();
      const n = compte === "avance" ? 3 : 1;
      // Parcours repris (avancé) ou conseillé (nouvel abonné) : lu sur le lien de la carte « En cours ».
      const slug = ((await bouton.getAttribute("href")) ?? "").replace(/^\/parcours\/([a-z-]+)#.*$/, "$1");
      await bouton.click();
      await expect(page.locator(`#etape-${n}-entete`)).toHaveAttribute("aria-expanded", "true");
      const barre = page.locator("[data-barre-parcours]");
      const bascule = barre.locator("[data-menu-bascule]");
      const verifier = async (moment: string, etape: number) => {
        const m = await page.evaluate((etape) => {
          const cellule = document.querySelector("[data-testid='sommaire-parcours']")!.getBoundingClientRect();
          const entete = document.querySelector("header[data-en-tete-universel]")!.getBoundingClientRect();
          const carte = document.getElementById(`etape-${etape}`)!.getBoundingClientRect();
          return { haut: Math.round(cellule.top), bas: Math.round(cellule.bottom), basEntete: Math.round(entete.bottom), carte: Math.round(carte.top) };
        }, etape);
        const txt = `${moment} : ${JSON.stringify(m)}`;
        expect(Math.abs(m.haut - m.basEntete), `barre collée sous l'en-tête, ${txt}`).toBeLessThanOrEqual(1);
        expect(m.bas - m.haut, `barre compacte, ${txt}`).toBeLessThanOrEqual(64);
        expect(m.carte, `étape sous la barre, ${txt}`).toBeGreaterThanOrEqual(m.bas);
        expect(m.carte - m.bas, `étape juste sous la barre, ${txt}`).toBeLessThanOrEqual(16);
        await expect(barre.locator("[data-lien-retour]")).toBeInViewport();
        await expect(barre.locator("[data-lien-retour]")).toHaveAttribute("href", `/parcours#parcours-${slug}`);
        await expect(bascule).toBeInViewport();
      };
      await hautStable(page.locator(`#etape-${n}`));
      await verifier("arrivée", n);
      await expect(bascule).toHaveText(new RegExp(`^Étape\\s${n}\\ssur\\s\\d$`));
      // Menu déplié : par-dessus la page, sans titre du parcours ni avancée répétés ; replié après le choix d'une étape.
      await bascule.click();
      const menu = page.locator("[data-menu-etapes]");
      await expect(menu).toBeVisible();
      await expect(menu.locator("#menu-etapes-titre")).toBeHidden();
      await menu.locator("a[data-ligne-etape='2']").click();
      await expect(bascule).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toBeHidden();
      await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
      await hautStable(page.locator("#etape-2"));
      await verifier("après le choix de l'étape 2", 2);
    });
  }

  test("375 : sous-étapes 2.2, 2.3, 2.4 à des ancres et des positions distinctes, ancre = numéro affiché, vignettes titrées", async ({ page }) => {
    await abonne(page);
    await valider(page, SLUG, [1]);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/parcours/${SLUG}`);
    await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
    const liste = page.locator("#etape-2").getByTestId("lignes-fiches");
    await expect(liste.locator("a[data-fiche]").first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const lignes = await liste.locator("a[data-fiche]").evaluateAll((as) => as.map((a) => ({ ancre: a.getAttribute("data-fiche") as string, numero: (a.querySelector("span")?.textContent ?? "").trim() })));
    expect(lignes.length, "sous-étapes de l'étape 2").toBeGreaterThanOrEqual(4);
    for (const l of lignes) expect(l.ancre, "ancre = numéro affiché").toBe(`fiche-${l.numero.replace(".", "-")}`);
    const positions: Array<{ numero: string; y: number }> = [];
    let videos = 0;
    for (const { ancre, numero } of lignes.slice(1, 4)) {
      await liste.scrollIntoViewIfNeeded();
      await liste.locator(`a[data-fiche='${ancre}']`).click();
      await expect(page).toHaveURL(new RegExp(`#${ancre}$`));
      const bloc = page.locator(`#${ancre}`);
      await hautStable(bloc);
      positions.push({ numero, y: await page.evaluate(() => Math.round(window.scrollY)) });
      await expect(bloc).toBeInViewport();
      const vignette = bloc.locator("button[aria-label^='Lire la vidéo']");
      if (await vignette.count()) {
        videos++;
        const titre = ((await vignette.getAttribute("aria-label")) ?? "").replace(/^Lire la vidéo : /, "");
        const titree = await vignette.evaluate((b, t) => {
          const plat = (x: string | null) => (x ?? "").replace(/\s+/g, " ").replace(/[’']/g, "'").trim();
          return Array.from(b.querySelectorAll("span")).some((s) => plat(s.textContent) === plat(t) && s.getBoundingClientRect().height > 0 && getComputedStyle(s).display !== "none");
        }, titre);
        expect(titree, `${numero} : titre « ${titre} » dans la vignette à 375`).toBe(true);
      }
    }
    expect(videos, "au moins une sous-étape vidéo parmi 2.2 à 2.4").toBeGreaterThanOrEqual(1);
    for (let i = 0; i < positions.length; i++)
      for (let j = i + 1; j < positions.length; j++)
        expect(Math.abs(positions[i].y - positions[j].y), `${positions[i].numero} et ${positions[j].numero} au même endroit (${JSON.stringify(positions)})`).toBeGreaterThan(40);
  });

  for (const compte of ["avance", "nouvel"] as const) {
    test(`1280, ${compte} : zéro saut de plus de 8 px après le premier rendu (arrivée par la carte « En cours », changement d'étape dans le menu)`, async ({ page }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __sauts: Array<{ t: number; dx: number; dy: number; dh: number; noeud: string }> };
        w.__sauts = [];
        const nom = (n: Node | null) => {
          const e = n instanceof Element ? n : n?.parentElement;
          if (!e) return "?";
          return `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${Array.from(e.attributes).filter((a) => a.name.startsWith("data-")).map((a) => `[${a.name}]`).join("")} « ${(e.textContent ?? "").trim().slice(0, 40)} »`;
        };
        new PerformanceObserver((liste) => {
          for (const e of liste.getEntries() as unknown as Array<{ startTime: number; sources?: Array<{ node: Node | null; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }> }>) {
            for (const s of e.sources ?? []) {
              w.__sauts.push({
                t: Math.round(e.startTime),
                dx: Math.round(s.currentRect.x - s.previousRect.x),
                dy: Math.round(s.currentRect.y - s.previousRect.y),
                dh: Math.round(s.currentRect.height - s.previousRect.height),
                noeud: nom(s.node),
              });
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await abonne(page);
      if (compte === "avance") await valider(page, SLUG, [1, 2]);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/parcours");
      const bouton = page.getByTestId("carte-en-cours-reprendre");
      await expect(bouton).toBeVisible();
      await page.waitForTimeout(1_000);
      const sautsDepuis = (t: number) =>
        page.evaluate((t) => (window as unknown as { __sauts: Array<{ t: number; dx: number; dy: number; noeud: string }> }).__sauts.filter((s) => s.t >= t && (Math.abs(s.dy) > 8 || Math.abs(s.dx) > 8)), t);
      const n = compte === "avance" ? 3 : 1;
      const t0 = await page.evaluate(() => performance.now());
      await bouton.click();
      await expect(page.locator(`#etape-${n}-entete`)).toHaveAttribute("aria-expanded", "true");
      await page.waitForTimeout(2_500);
      expect(await sautsDepuis(t0), "sauts après « Reprendre » ou « Commencer l'étape 1 »").toEqual([]);
      // Changement d'étape dans le menu : menu figé (sous-étapes sous chaque étape), contenu remplacé à la même place.
      const menu = page.locator("[data-menu-etapes]");
      const cible = 2;
      const t1 = await page.evaluate(() => performance.now());
      await menu.locator(`a[data-ligne-etape='${cible}']`).click();
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", `#etape-${cible}`);
      await page.waitForTimeout(1_500);
      expect(await sautsDepuis(t1), "sauts au changement d'étape dans le menu").toEqual([]);
      // Une seule barre blanche dans la colonne du menu (étape ou sous-étape active, jamais les deux).
      const barres = await menu.locator("a").evaluateAll((as) => as.filter((a) => getComputedStyle(a, "::before").backgroundColor === "rgb(255, 255, 255)").length);
      expect(barres, "filets blancs actifs dans le menu").toBe(1);
    });
  }

  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur} : /parcours abonné, carte « En cours » alignée, une phrase en gras dans « Ton cap », pas de « Continuer ce parcours » sur la carte reprise`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const carte = page.getByTestId("carte-en-cours");
      await expect(carte).toBeVisible();
      await expect(page.getByTestId("carte-en-cours-reprendre")).toHaveAttribute("href", new RegExp(`/parcours/${SLUG}#`));
      const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
      await expect(cartes.first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      // Carte du parcours repris : plus de « Continuer ce parcours » (« Reprendre » en tête suffit), « Programme » gardé.
      const reprise = page.locator(`#parcours-${SLUG}`);
      await expect(reprise.getByRole("button", { name: "Continuer ce parcours" })).toHaveCount(0);
      await expect(reprise.locator("details summary")).toBeVisible();
      await expect(page.locator("main").getByRole("button", { name: "Continuer ce parcours" })).toHaveCount(0);
      // Barre de la carte « En cours » : bord droit = bord du bouton (à 1 px).
      const bords = await carte.evaluate((c) => ({
        barre: Math.round(c.querySelector("[data-barre-segmentee]")!.getBoundingClientRect().right),
        bouton: Math.round(c.querySelector("[data-testid='carte-en-cours-reprendre']")!.getBoundingClientRect().right),
        carte: Math.round(c.getBoundingClientRect().right - parseFloat(getComputedStyle(c).paddingRight) - parseFloat(getComputedStyle(c).borderRightWidth)),
      }));
      expect(Math.abs(bords.barre - bords.carte), `bords ${JSON.stringify(bords)}`).toBeLessThanOrEqual(1);
      if (largeur >= 1024) expect(Math.abs(bords.barre - bords.bouton), `bords ${JSON.stringify(bords)}`).toBeLessThanOrEqual(1);
      // « Ton cap » : une seule phrase en gras.
      const grasses = await page.locator("#cap > p").evaluateAll((ps) => ps.filter((p) => getComputedStyle(p).fontWeight === "600").length);
      expect(grasses, "phrases en gras dans « Ton cap »").toBe(1);
      // Bandeau « Nouveau cap » (s'il est dû) : une ligne, méta, au plus 48 px.
      const annonce = page.locator("[data-annonce-legere]");
      if (await annonce.locator("p").count()) {
        const m = await annonce.evaluate((a) => ({ h: Math.round(a.getBoundingClientRect().height), poids: getComputedStyle(a.querySelector("p")!).fontWeight }));
        expect(m.h, JSON.stringify(m)).toBeLessThanOrEqual(48);
        expect(m.poids, JSON.stringify(m)).toBe("400");
      }
    });
  }

  // s26 parcours, tour 7 bis : plus de page invisible pendant la mise en place (refusée : page blanche jusqu'à 2 s) ;
  // l'abonné est lu côté serveur et la page naît à sa forme finale. Du premier rendu de la page du parcours à 2 s après :
  // aucun élément de `main` (hors blocs collants ou fixes, qui suivent le défilement) ni le pied de page ne bouge de plus
  // de 8 px dans le document, aucun n'est remplacé, et `main` n'est jamais invisible.
  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    for (const compte of ["avance", "nouvel"] as const) {
      for (const arrivee of ["reprendre", "direct"] as const) {
        test(`${largeur}, ${compte}, ${arrivee} : page du parcours immobile (8 px) et jamais invisible du premier rendu à 2 s`, async ({ page }) => {
          await page.addInitScript(() => {
            type Mesure = { debut: number; fin: number; fini: boolean; images: number; ecartMax: number; invisibles: number; bouges: string[]; sauts: string[] };
            const w = window as unknown as { __mesure: Mesure | null };
            w.__mesure = null;
            const nom = (e: Element) =>
              `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${Array.from(e.attributes).filter((a) => a.name.startsWith("data-")).map((a) => `[${a.name}]`).join("")} « ${(e.textContent ?? "").trim().slice(0, 40)} »`;
            new PerformanceObserver((liste) => {
              const m = w.__mesure;
              if (!m) return;
              for (const e of liste.getEntries() as unknown as Array<{ startTime: number; sources?: Array<{ node: Node | null; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }> }>) {
                if (e.startTime < m.debut || e.startTime > m.fin) continue;
                for (const s of e.sources ?? []) {
                  const dy = s.currentRect.y - s.previousRect.y;
                  const dx = s.currentRect.x - s.previousRect.x;
                  const el = s.node instanceof Element ? s.node : s.node?.parentElement;
                  if ((Math.abs(dy) > 8 || Math.abs(dx) > 8) && el?.closest("main, footer")) m.sauts.push(`${nom(el)} dx ${Math.round(dx)} dy ${Math.round(dy)}`);
                }
              }
            }).observe({ type: "layout-shift", buffered: true });
            const colle = (e: Element) => {
              for (let x: Element | null = e; x; x = x.parentElement) if (/sticky|fixed/.test(getComputedStyle(x).position)) return true;
              return false;
            };
            const doc = (e: Element) => {
              const r = e.getBoundingClientRect();
              return { x: r.left + window.scrollX, y: r.top + window.scrollY };
            };
            const attendre = () => {
              const main = document.querySelector("main");
              const footer = document.querySelector("footer");
              if (!main || !footer || !main.querySelector("[data-parcours-detail]")) return requestAnimationFrame(attendre);
              const debut = performance.now();
              const m: Mesure = { debut, fin: debut + 2_000, fini: false, images: 0, ecartMax: 0, invisibles: 0, bouges: [], sauts: [] };
              w.__mesure = m;
              const suivis = [main, footer, ...Array.from(main.querySelectorAll("*"))]
                .filter((e) => e.getClientRects().length > 0 && !colle(e))
                .slice(0, 800)
                .map((e) => ({ e, ...doc(e) }));
              const cache = (e: Element) => {
                const s = getComputedStyle(e);
                return s.visibility !== "visible" || s.opacity === "0";
              };
              const image = () => {
                const detail = main.querySelector("[data-parcours-detail]");
                m.images++;
                if (!main.isConnected || !detail || cache(main) || cache(detail) || cache(footer)) m.invisibles++;
                const derniere = performance.now() >= m.fin;
                const remplacants = derniere ? Array.from(document.querySelectorAll("main *, footer")).filter((e) => e.getClientRects().length > 0) : [];
                for (const s of suivis) {
                  // Élément remplacé (rendu à nouveau) : comparé, à la dernière image, à ses homonymes (même balise, mêmes
                  // attributs `data-`, même texte) ; sans homonyme (vignette vidéo sans réseau remplacée par son fond), ignoré.
                  if (!s.e.isConnected) {
                    if (!derniere) continue;
                    const ecarts = remplacants.filter((e) => nom(e) === nom(s.e)).map((e) => Math.max(Math.abs(doc(e).y - s.y), Math.abs(doc(e).x - s.x)));
                    if (ecarts.length && Math.min(...ecarts) > 8) m.bouges.push(`${nom(s.e)} remplacé, ${Math.round(Math.min(...ecarts))} px plus loin`);
                    continue;
                  }
                  if (!s.e.getClientRects().length) continue;
                  const p = doc(s.e);
                  m.ecartMax = Math.max(m.ecartMax, Math.abs(p.y - s.y), Math.abs(p.x - s.x));
                  if (Math.abs(p.y - s.y) > 8 || Math.abs(p.x - s.x) > 8) m.bouges.push(`${nom(s.e)} dx ${Math.round(p.x - s.x)} dy ${Math.round(p.y - s.y)}`);
                }
                if (derniere) m.fini = true;
                else requestAnimationFrame(image);
              };
              image();
            };
            requestAnimationFrame(attendre);
          });
          // Vignettes vidéo : sans accès à YouTube (serveur e2e hors ligne), l'optimiseur d'images répond 500 et la vignette
          // passe à son fond de repli à un moment quelconque ; une image locale tient lieu de la vignette, comme en ligne.
          await page.route(/\/_next\/image\?url=https%3A%2F%2Fi\.ytimg\.com/, (route) =>
            route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64") }),
          );
          await abonne(page);
          if (compte === "avance") await valider(page, SLUG, [1, 2]);
          await page.setViewportSize({ width: largeur, height: hauteur });
          await page.goto("/parcours");
          const bouton = page.getByTestId("carte-en-cours-reprendre");
          await expect(bouton).toBeVisible();
          const href = (await bouton.getAttribute("href")) ?? "";
          expect(href).toMatch(/^\/parcours\/[a-z-]+/);
          if (arrivee === "reprendre") await bouton.click();
          else await page.goto(href);
          await expect(page.locator("main [data-parcours-detail]")).toBeVisible();
          const n = href.match(/#etape-(\d+)$/)?.[1];
          if (n) await expect(page.locator(`#etape-${n}-entete`)).toHaveAttribute("aria-expanded", "true");
          await page.waitForFunction(() => (window as unknown as { __mesure: { fini: boolean } | null }).__mesure?.fini === true, undefined, { timeout: 15_000 });
          const m = await page.evaluate(() => (window as unknown as { __mesure: { images: number; ecartMax: number; invisibles: number; bouges: string[]; sauts: string[] } }).__mesure);
          console.log(`tour 7 bis ${largeur} ${compte} ${arrivee} : ${m.images} images, écart max ${Math.round(m.ecartMax)} px, ${m.invisibles} invisible(s)`);
          expect(m.invisibles, "images où `main`, la page du parcours ou le pied de page est invisible").toBe(0);
          expect([...new Set(m.bouges)].slice(0, 10), "éléments déplacés de plus de 8 px dans le document").toEqual([]);
          expect(m.sauts.slice(0, 10), "sauts (Layout Shift) de plus de 8 px").toEqual([]);
        });
      }
    }
  }

  // s26 parcours, tour 8 (relectures à l'aveugle v5 : design liste 1, détail 1, 3, 4 ; UX D1, D2, D3).
  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur} : /parcours abonné, « Reprendre » en contour dans la carte du parcours repris, à droite de « Programme » dès 1024`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const plein = page.getByTestId("carte-en-cours-reprendre");
      await expect(plein).toBeVisible();
      const carte = page.locator(`#parcours-${SLUG}`);
      const contour = carte.getByTestId("carte-parcours-reprendre");
      await expect(contour).toBeVisible();
      await expect(contour).toHaveText("Reprendre");
      await expect(contour).toHaveAttribute("href", (await plein.getAttribute("href")) ?? "");
      // Contour : fond transparent, un bord ; le plein reste celui de la carte « En cours ».
      const fond = await contour.evaluate((e) => ({ fond: getComputedStyle(e).backgroundColor, bord: getComputedStyle(e).borderTopWidth }));
      expect(fond, JSON.stringify(fond)).toEqual({ fond: "rgba(0, 0, 0, 0)", bord: "1px" });
      await expect(carte.getByRole("button", { name: "Continuer ce parcours" })).toHaveCount(0);
      const m = await carte.evaluate((c) => {
        const r = (s: string) => c.querySelector(s)!.getBoundingClientRect();
        const resume = r("details summary");
        const bouton = r("[data-testid='carte-parcours-reprendre']");
        return { resumeHaut: Math.round(resume.top), resumeDroite: Math.round(resume.right), boutonHaut: Math.round(bouton.top), boutonGauche: Math.round(bouton.left), boutonH: Math.round(bouton.height) };
      });
      expect(m.boutonH, JSON.stringify(m)).toBeGreaterThanOrEqual(44);
      if (largeur >= 1024) {
        expect(Math.abs(m.boutonHaut - m.resumeHaut), `même rangée que « Programme », ${JSON.stringify(m)}`).toBeLessThanOrEqual(1);
        expect(m.boutonGauche, `à droite de « Programme », ${JSON.stringify(m)}`).toBeGreaterThan(m.resumeDroite);
      }
      await contour.click();
      await expect(page).toHaveURL(new RegExp(`/parcours/${SLUG}#etape-2$`));
      await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
    });
  }

  test("375 : pastille de la barre compacte = étape LUE (arrivée, choix d'une étape, sous-étape)", async ({ page }) => {
    await abonne(page);
    await valider(page, SLUG, [1, 2]);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/parcours/${SLUG}#etape-3`);
    const bascule = page.locator("[data-barre-parcours] [data-menu-bascule]");
    await expect(page.locator("#etape-3-entete")).toHaveAttribute("aria-expanded", "true");
    await expect(bascule).toHaveText(/^Étape\s3\ssur\s3$/);
    await bascule.click();
    await page.locator("[data-menu-etapes] a[data-ligne-etape='2']").click();
    await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
    await expect(bascule).toHaveText(/^Étape\s2\ssur\s3$/);
    // Sous-étape 2.2 depuis la liste de la carte : on lit toujours l'étape 2.
    const liste = page.locator("#etape-2").getByTestId("lignes-fiches");
    await liste.scrollIntoViewIfNeeded();
    await liste.locator("a[data-fiche='fiche-2-2']").click();
    await expect(page).toHaveURL(/#fiche-2-2$/);
    await expect(bascule).toHaveText(/^Étape\s2\ssur\s3$/);
    // Le menu déplié garde l'étape à reprendre (pied « Reprendre » vers l'étape 3).
    await bascule.click();
    await expect(page.locator("#sommaire-reprendre")).toBeVisible();
  });

  for (const compte of ["visiteur", "abonne"] as const) {
    test(`1280, ${compte} : « Retour : Parcours » en tête de la colonne du menu, visible après défilement, ramène sur la carte`, async ({ page }) => {
      if (compte === "abonne") await abonne(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      const retour = menu.locator("[data-retour-menu] [data-lien-retour]");
      await expect(retour).toBeVisible();
      await expect(retour).toHaveAttribute("href", `/parcours#parcours-${SLUG}`);
      // En tête : au-dessus du titre du parcours, dans la carte du menu.
      const m = await menu.evaluate((n) => ({
        retour: Math.round(n.querySelector("[data-retour-menu]")!.getBoundingClientRect().bottom),
        titre: Math.round(n.querySelector("#menu-etapes-titre")!.getBoundingClientRect().top),
        carte: Math.round(n.getBoundingClientRect().top),
        lienHaut: Math.round(n.querySelector("[data-retour-menu] [data-lien-retour]")!.getBoundingClientRect().top),
      }));
      expect(m.retour, JSON.stringify(m)).toBeLessThanOrEqual(m.titre);
      expect(m.lienHaut, JSON.stringify(m)).toBeGreaterThanOrEqual(m.carte);
      // La barre compacte (et son retour) n'existe pas dès 1024.
      await expect(page.locator("[data-barre-parcours] [data-lien-retour]")).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, 1_500));
      await expect(retour).toBeInViewport();
      await retour.click();
      await expect(page).toHaveURL(new RegExp(`/parcours#parcours-${SLUG}$`));
      await expect(page.locator(`#parcours-${SLUG}`)).toBeInViewport();
    });
  }

  test("375 : le retour de la colonne du menu est masqué (celui de la barre compacte suffit)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/parcours/${SLUG}`);
    await expect(page.locator("[data-barre-parcours] [data-lien-retour]")).toBeVisible();
    await expect(page.locator("[data-retour-menu]")).toBeHidden();
  });

  for (const compte of ["visiteur", "abonne"] as const) {
    test(`1280, ${compte} : titre d'étape à la même place à toutes les étapes, aucune étiquette « Parcours … · durée »`, async ({ page }) => {
      if (compte === "abonne") {
        await abonne(page);
        await valider(page, SLUG, [1]);
      }
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      await expect(menu).toBeVisible();
      const ecarts: number[] = [];
      for (const n of [1, 2, 3]) {
        await menu.locator(`a[data-ligne-etape='${n}']`).click();
        await expect(page.locator(`#etape-${n}-entete`)).toHaveAttribute("aria-expanded", "true");
        const m = await page.locator(`#etape-${n}`).evaluate((c, n) => {
          const titre = Array.from(c.querySelectorAll("span.sr-only")).find((s) => s.textContent === `Étape ${n} : `)!.parentElement!;
          const entete = c.querySelector(`#etape-${n}-entete`)!;
          return {
            ecart: Math.round(titre.getBoundingClientRect().top - c.getBoundingClientRect().top),
            etiquette: /Parcours .+·/.test(entete.textContent ?? ""),
          };
        }, n);
        expect(m.etiquette, `étape ${n} : étiquette « Parcours … · durée »`).toBe(false);
        ecarts.push(m.ecart);
      }
      expect(new Set(ecarts).size, `haut du titre dans la carte, étapes 1 à 3 : ${ecarts.join(", ")} px`).toBe(1);
    });
  }

  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur} : cartes vidéo d'une rangée à la même hauteur, titres de vignette entiers (2 lignes au plus), lecture au-dessus du titre`, async ({ page }) => {
      await abonne(page);
      await page.setViewportSize({ width: largeur, height: hauteur });
      let titres = 0;
      for (const [slug, n] of [["repartie", 2], ["repartie", 1], [SLUG, 1], [SLUG, 3]] as const) {
        await page.goto(`/parcours/${slug}`);
        // Étape choisie dans le menu (déplié par la barre compacte sous 1024 px).
        if (largeur < 1024) await page.locator("[data-barre-parcours] [data-menu-bascule]").click();
        await page.locator(`[data-menu-etapes] a[data-ligne-etape='${n}']`).click();
        await expect(page.locator(`#etape-${n}-entete`)).toHaveAttribute("aria-expanded", "true");
        const blocs = page.locator(`#etape-${n} [id^='fiche-']:has(button[aria-label^='Lire la vidéo'])`);
        await expect(blocs.first()).toBeAttached();
        await page.evaluate(() => document.fonts.ready);
        const m = await blocs.evaluateAll((bs) =>
          bs.map((b) => {
            const carte = b.firstElementChild!.getBoundingClientRect();
            const vignette = b.querySelector("button[aria-label^='Lire la vidéo']")!;
            const titre = Array.from(vignette.querySelectorAll<HTMLElement>("span")).filter((s) => s.children.length === 0 && s.getBoundingClientRect().height > 0).pop()!;
            const lecture = vignette.querySelector(":scope > div")!.getBoundingClientRect();
            const t = titre.getBoundingClientRect();
            return {
              haut: Math.round(b.getBoundingClientRect().top),
              cellule: Math.round(b.getBoundingClientRect().height),
              carte: Math.round(carte.height),
              coupe: titre.scrollHeight > titre.clientHeight + 1,
              lignes: Math.round(t.height / parseFloat(getComputedStyle(titre).lineHeight)),
              air: Math.round(t.top - lecture.bottom),
              texte: titre.textContent,
            };
          }),
        );
        for (const b of m) {
          titres++;
          expect(b.carte, `${slug} ${n} : carte à la hauteur de sa cellule, ${JSON.stringify(b)}`).toBe(b.cellule);
          expect(b.coupe, `${slug} ${n} : titre « ${b.texte} » tronqué à ${largeur}`).toBe(false);
          expect(b.lignes, `${slug} ${n} : « ${b.texte} » sur ${b.lignes} lignes`).toBeLessThanOrEqual(2);
          expect(b.air, `${slug} ${n} : bouton de lecture au-dessus du titre, ${JSON.stringify(b)}`).toBeGreaterThanOrEqual(0);
        }
        // Même rangée (même haut) : même hauteur de carte.
        for (const a of m) for (const b of m) if (a.haut === b.haut) expect(a.carte, `${slug} ${n} : ${JSON.stringify(m)}`).toBe(b.carte);
      }
      expect(titres, "vignettes titrées mesurées").toBeGreaterThanOrEqual(4);
    });
  }
});
