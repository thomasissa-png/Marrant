import { appendFileSync } from "node:fs";
import type { Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, type PlanCompte } from "../support/base-locale";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

/** Bouton prix de l'en-tête : /abonnement?src=header, avec le retour sur la page courante (textes-trajet-v3 §5 point 3). */
const HREF_PRIX = /^\/abonnement\?(returnTo=%2F[^&]*&)?src=header$/;

/**
 * Garde-fou de l'en-tête (revue design s21, bloquant) : 6 largeurs x 3 états, plus
 * 320 à 768 px pour le bouton prix du visiteur et du compte sans abonnement (s21 B6,
 * concision v5, QA v4 m-3)
 * (visiteur, connecté gratuit, connecté Premium). Échoue si un élément de la barre
 * déborde de l'écran, en chevauche un autre, ou si un libellé est coupé ; vérifie
 * la recherche (champ >= 160 px et texte d'aide entier dès 1280 px, loupe avant) et
 * le menu de compte. Budget documenté dans `apps/web/src/components/layout/header.tsx`.
 * Mesures chiffrées (revue design s21 tour 2, point 5) : jointes au rapport
 * (`mesures-<état>`) et ajoutées à `E2E_MESURES_EN_TETE` si la variable est posée.
 */
const LARGEURS = [1024, 1100, 1280, 1440, 1536, 1920];
type Etat = "visiteur" | PlanCompte;
const ETATS: Etat[] = ["visiteur", "FREE", "PREMIUM"];
const MOT_DE_PASSE = "E2e-en-tete-budget-42";
/** Bouton prix de l'en-tête, nom accessible « Premium, 2,99 € par mois : voir l'offre » (trajet de conversion s21 §2). */
const PRIX = /^Premium, 2,99\s€ par mois : voir l['’]offre$/;

/**
 * Libellé visible du bouton prix sur téléphone (trajet de conversion s21, textes-trajet-v1 §2) :
 * repli « Premium » sous 640 px (« Premium · 2,99 € » débordait : page de 330 px à 320, 377 px à 360
 * et à 375), « Premium · 2,99 €/mois » au-delà.
 */
const libelleMobile = (largeur: number): RegExp =>
  largeur < 640 ? /^Premium$/ : /^Premium\s·\s2,99\s€\/mois$/;
/**
 * Largeurs de téléphone (concision v5) : bouton prix visible à toutes les largeurs, libellé court
 * « 2,99 €/mois » sous 640 px, « Premium · 2,99 €/mois » au-delà (mesuré : il lui faut 590 px avec
 * « Connexion » et la loupe).
 */
const LARGEURS_MOBILES = [320, 360, 375, 414, 640, 768];
/** Libellé comparé (annexe tour 4 §6) : « Voir les prix », perdant du duel B6. */
const LIBELLE_COMPARE = "Voir les prix";

/** Mesures de la barre ordinateur, dans la page. */
async function mesurer(page: Page) {
  return page.evaluate(() => {
    const barre = document.querySelector("header > div") as HTMLElement;
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const enfants = Array.from(barre.children).filter(visible).map((el) => {
      const r = el.getBoundingClientRect();
      return { nom: (el.getAttribute("aria-label") ?? el.textContent ?? el.tagName).trim().slice(0, 40), gauche: r.left, droite: r.right };
    });
    const controles = Array.from(barre.querySelectorAll("a, button")).filter(visible).map((el) => {
      const h = el as HTMLElement;
      const r = h.getBoundingClientRect();
      return {
        nom: (h.getAttribute("aria-label") ?? h.textContent ?? "").trim(),
        droite: r.right,
        gauche: r.left,
        hauteur: r.height,
        coupe: h.scrollWidth > h.clientWidth + 1,
      };
    });
    const champ = Array.from(barre.querySelectorAll("input")).find(visible) as HTMLInputElement | undefined;
    let recherche: { largeur: number; aideEntiere: boolean } | null = null;
    if (champ) {
      const s = getComputedStyle(champ);
      const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
      ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const place = champ.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
      recherche = { largeur: champ.getBoundingClientRect().width, aideEntiere: ctx.measureText(champ.placeholder).width <= place };
    }
    // Bord droit du contenu de la barre (hors marge interne) = bord droit de la grille des pages.
    const bordContenu = barre.getBoundingClientRect().right - parseFloat(getComputedStyle(barre).paddingRight);
    return { fenetre: window.innerWidth, scroll: document.documentElement.scrollWidth, barre: { scroll: barre.scrollWidth, client: barre.clientWidth }, bordContenu, enfants, controles, recherche };
  });
}

test.describe("En-tête : budget de largeur", () => {
  localSeulement();

  for (const etat of ETATS) {
    test.describe(`état ${etat}`, () => {
      // Une seule connexion par état et par lancement (adresse unique : la limite de
      // connexion par adresse et par IP ne gêne jamais), cookies repris à chaque test.
      let cookies: Cookie[] = [];
      test.beforeAll(async ({ browser }) => {
        if (etat === "visiteur") return;
        const email = `e2e-en-tete-${etat.toLowerCase()}-${Date.now().toString(36)}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, etat);
        const contexte = await browser.newContext();
        await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
        cookies = await contexte.cookies();
        await contexte.close();
      });
      test.beforeEach(async ({ context }) => {
        if (cookies.length > 0) await context.addCookies(cookies);
      });

      test(`6 largeurs sans débordement ni libellé coupé (${etat})`, async ({ page }, testInfo) => {
        const lignes: string[] = [];
        for (const largeur of LARGEURS) {
          await page.setViewportSize({ width: largeur, height: 800 });
          await page.goto("/conseils");
          const barre = page.getByRole("banner");
          await expect(barre.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
          const m = await mesurer(page);
          const ici = `${etat} à ${largeur} px`;
          const plusADroite = Math.max(...m.controles.map((c) => c.droite));
          const ecartMin = Math.min(...m.enfants.slice(1).map((e, i) => e.gauche - m.enfants[i].droite));
          lignes.push(
            [
              `état=${etat}`,
              `largeur=${largeur}`,
              `défilement=${m.scroll}/${m.fenetre}`,
              `barre=${m.barre.scroll}/${m.barre.client}`,
              `recherche=${m.recherche ? `${Math.round(m.recherche.largeur)}px, aide ${m.recherche.aideEntiere ? "entière" : "COUPÉE"}` : "loupe"}`,
              `marge-droite=${(m.fenetre - plusADroite).toFixed(1)}px`,
              `écart-min-entre-blocs=${ecartMin.toFixed(1)}px`,
              `libellés-coupés=${m.controles.filter((c) => c.coupe).length}`,
              `hauteur-max=${Math.max(...m.controles.map((c) => c.hauteur)).toFixed(0)}px`,
            ].join(" ; "),
          );

          expect(m.scroll, `défilement horizontal de la page, ${ici}`).toBeLessThanOrEqual(m.fenetre);
          expect(m.barre.scroll, `barre plus large que sa boîte, ${ici}`).toBeLessThanOrEqual(m.barre.client);
          // Cartes du jour v2 : rien ne déborde dans la marge interne de la barre (le bouton prix
          // finissait 21 px à droite du bord de la grille à 1280 et 1440 px, sans défilement).
          expect(plusADroite, `la barre déborde dans sa marge de droite, ${ici}`).toBeLessThanOrEqual(m.bordContenu + 0.5);
          for (const c of m.controles) {
            expect(c.droite, `« ${c.nom} » sort à droite, ${ici}`).toBeLessThanOrEqual(m.fenetre + 0.5);
            expect(c.gauche, `« ${c.nom} » sort à gauche, ${ici}`).toBeGreaterThanOrEqual(-0.5);
            expect(c.coupe, `« ${c.nom} » coupé, ${ici}`).toBe(false);
            expect(c.hauteur, `« ${c.nom} » sur deux lignes, ${ici}`).toBeLessThanOrEqual(48);
          }
          for (let i = 1; i < m.enfants.length; i++) {
            expect(m.enfants[i].gauche, `« ${m.enfants[i].nom} » chevauche « ${m.enfants[i - 1].nom} », ${ici}`).toBeGreaterThanOrEqual(
              m.enfants[i - 1].droite - 0.5,
            );
          }

          // Onglets : 7, tous visibles (« La lettre » ou « Carnet » compris).
          const onglets = barre.getByRole("navigation", { name: "Navigation principale" }).getByRole("link");
          await expect(onglets).toHaveCount(7);
          for (const onglet of await onglets.all()) await expect(onglet).toBeVisible();

          // Recherche : champ dès 1280 px (>= 160 px, texte d'aide entier), loupe avant.
          const loupe = barre.getByRole("button", { name: "Rechercher" }).filter({ visible: true });
          if (largeur >= 1280) {
            expect(m.recherche, `champ de recherche absent, ${ici}`).not.toBeNull();
            expect(m.recherche?.largeur ?? 0, `recherche trop étroite, ${ici}`).toBeGreaterThanOrEqual(160);
            expect(m.recherche?.aideEntiere, `« Rechercher... » coupé, ${ici}`).toBe(true);
            await expect(loupe).toHaveCount(0);
          } else {
            expect(m.recherche, `champ de recherche affiché trop tôt, ${ici}`).toBeNull();
            await expect(loupe).toHaveCount(1);
          }

          // Actions selon l'état.
          const compte = barre.getByRole("button", { name: TEXTES_CONNEXION.menuCompte });
          if (etat === "visiteur") await expect(barre.getByRole("link", { name: "Connexion" })).toBeVisible();
          if (etat !== "PREMIUM") {
            // s21 (B6) : « 2,99 €/mois » vers /abonnement?src=header (nom accessible : libellé d'abord).
            // QA v4 m-3 : même bouton pour le compte sans abonnement (plus de « Activer mon accès »).
            const prix = barre.getByRole("link", { name: PRIX }).filter({ visible: true });
            await expect(prix).toBeVisible();
            await expect(prix).toHaveAttribute("href", HREF_PRIX);
            // Revue v3 m4 : libellé complet dès 1280 px, court de 1024 à 1279.
            // Trajet de conversion s21 : de 1 024 à 1 279 px, repli « Premium » (« Premium · 2,99 € » débordait).
            expect(await prix.innerText()).toMatch(largeur >= 1280 ? /^Premium\s·\s2,99\s€\/mois$/ : /^Premium$/);
          } else {
            await expect(barre.getByRole("link", { name: PRIX })).toHaveCount(0);
          }
          await expect(barre.getByText("Activer mon accès")).toHaveCount(0);
          if (etat === "visiteur") {
            await expect(compte).toHaveCount(0);
          } else {
            await expect(compte).toBeVisible();
            await expect(barre.getByText("Déconnexion")).toHaveCount(0);
          }
        }
        await testInfo.attach(`mesures-${etat}`, { body: lignes.join("\n"), contentType: "text/plain" });
        if (process.env.E2E_MESURES_EN_TETE) appendFileSync(process.env.E2E_MESURES_EN_TETE, `${lignes.join("\n")}\n`);
      });

      if (etat === "FREE") {
        // QA v4 m-3 : le compte sans abonnement a le bouton prix à toutes les largeurs de téléphone.
        test("compte sans abonnement : bouton prix de 320 à 768 px, sur une ligne, sans débordement", async ({ page }) => {
          for (const largeur of LARGEURS_MOBILES) {
            await page.setViewportSize({ width: largeur, height: 800 });
            await page.goto("/conseils");
            const barre = page.getByRole("banner");
            await expect(barre.getByRole("button", { name: "Menu" })).toBeVisible();
            const ici = `compte FREE à ${largeur} px`;
            const prix = barre.getByRole("link", { name: PRIX }).filter({ visible: true });
            await expect(prix).toHaveCount(1);
            await expect(prix).toHaveAttribute("href", HREF_PRIX);
            expect(await prix.innerText()).toMatch(libelleMobile(largeur));
            const m = await mesurer(page);
            expect(m.scroll, `défilement horizontal, ${ici}`).toBeLessThanOrEqual(m.fenetre);
            for (const c of m.controles) {
              expect(c.droite, `« ${c.nom} » sort à droite, ${ici}`).toBeLessThanOrEqual(m.fenetre + 0.5);
              expect(c.coupe, `« ${c.nom} » coupé, ${ici}`).toBe(false);
              expect(c.hauteur, `« ${c.nom} » sur deux lignes, ${ici}`).toBeLessThanOrEqual(48);
            }
            expect((await prix.boundingBox())?.height ?? 0, `cible de 44 px, ${ici}`).toBeGreaterThanOrEqual(44);
          }
        });
      }

      if (etat !== "visiteur") {
        test(`menu de compte au clavier, dans l'écran à 1024 px (${etat})`, async ({ page }) => {
          await page.setViewportSize({ width: 1024, height: 800 });
          await page.goto("/conseils");
          const bouton = page.getByRole("banner").getByRole("button", { name: TEXTES_CONNEXION.menuCompte });
          await bouton.focus();
          await page.keyboard.press("Enter");
          const menu = page.getByRole("menu");
          await expect(menu).toBeVisible();
          await expect(menu.getByRole("menuitem")).toHaveText(["Favoris", "Mon profil", "Déconnexion"]);
          const boite = await menu.boundingBox();
          expect((boite?.x ?? 0) + (boite?.width ?? 0)).toBeLessThanOrEqual(1024);
          for (const item of await menu.getByRole("menuitem").all()) {
            expect((await item.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
          }
          await page.keyboard.press("Escape");
          await expect(menu).toHaveCount(0);
          await expect(bouton).toBeFocused();
        });
      }
    });
  }

  // Concision v5 : le bouton prix tient à 320, 360, 375 et 414 px, sur une ligne, sans chevaucher
  // le logo ni le menu ; l'accueil garde ainsi un appel payant au premier écran à toutes les
  // largeurs. Largeur mesurée et comparée à « Voir les prix » (annexe tour 4 §6). Mesures jointes.
  test("mobile 320 à 768 px : bouton prix entier, sur une ligne, sans chevauchement (visiteur)", async ({ page }, testInfo) => {
    const lignes: string[] = [];
    for (const largeur of LARGEURS_MOBILES) {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto("/conseils");
      const barre = page.getByRole("banner");
      await expect(barre.getByRole("button", { name: "Menu" })).toBeVisible();
      const ici = `visiteur à ${largeur} px`;
      const prix = barre.getByRole("link", { name: PRIX }).filter({ visible: true });
      const m = await mesurer(page);
      expect(m.scroll, `défilement horizontal de la page, ${ici}`).toBeLessThanOrEqual(m.fenetre);
      expect(m.barre.scroll, `barre plus large que sa boîte, ${ici}`).toBeLessThanOrEqual(m.barre.client);
      const tries = [...m.controles].sort((x, y) => x.gauche - y.gauche);
      for (let i = 0; i < tries.length; i++) {
        const c = tries[i];
        expect(c.droite, `« ${c.nom} » sort à droite, ${ici}`).toBeLessThanOrEqual(m.fenetre + 0.5);
        expect(c.coupe, `« ${c.nom} » coupé, ${ici}`).toBe(false);
        expect(c.hauteur, `« ${c.nom} » sur deux lignes, ${ici}`).toBeLessThanOrEqual(48);
        if (i > 0) expect(c.gauche, `« ${c.nom} » chevauche « ${tries[i - 1].nom} », ${ici}`).toBeGreaterThanOrEqual(tries[i - 1].droite - 0.5);
      }
      await expect(prix).toHaveCount(1);
      await expect(prix).toHaveAttribute("href", HREF_PRIX);
      // Texte affiché (innerText : l'autre libellé est masqué en CSS, il reste dans le DOM).
      expect(await prix.innerText()).toMatch(libelleMobile(largeur));
      const mesure = await prix.evaluate((el, compare) => {
        const s = getComputedStyle(el);
        const ctx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
        ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
        const r = el.getBoundingClientRect();
        return {
          texte: ctx.measureText((el as HTMLElement).innerText ?? "").width,
          compare: ctx.measureText(compare).width,
          bouton: r.width,
          hauteur: r.height,
          sansCoupure: s.whiteSpace === "nowrap",
        };
      }, LIBELLE_COMPARE);
      expect(mesure.sansCoupure, `bouton prix sans nowrap, ${ici}`).toBe(true);
      expect(mesure.hauteur, `bouton prix : cible de 44 px, ${ici}`).toBeGreaterThanOrEqual(44);
      lignes.push(
        `largeur=${largeur} ; « ${(await prix.innerText()).replace(/\s+/g, " ")} »=${mesure.texte.toFixed(1)}px ; « ${LIBELLE_COMPARE} »=${mesure.compare.toFixed(1)}px ; écart=${(mesure.texte - mesure.compare).toFixed(1)}px ; bouton=${mesure.bouton.toFixed(1)}x${mesure.hauteur.toFixed(0)}px`,
      );
    }
    // Page chaude : aucun bouton prix (spec B6, masqué sur /abonnement et /register).
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/abonnement");
    await expect(page.getByRole("banner").getByRole("link", { name: PRIX })).toHaveCount(0);
    await testInfo.attach("mesures-mobile-bouton-prix", { body: lignes.join("\n"), contentType: "text/plain" });
    if (process.env.E2E_MESURES_EN_TETE) appendFileSync(process.env.E2E_MESURES_EN_TETE, `${lignes.join("\n")}\n`);
  });

  test("loupe de 1024 à 1279 px : ouvre et ferme le panneau de recherche", async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.goto("/conseils");
    const loupe = page.getByRole("banner").getByRole("button", { name: "Rechercher" }).filter({ visible: true });
    await loupe.click();
    await expect(loupe).toHaveAttribute("aria-expanded", "true");
    const panneau = page.locator("#mobile-search");
    await expect(panneau.locator("input")).toBeFocused();
    expect((await panneau.locator("input").boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(160);
    await loupe.click();
    await expect(panneau).toHaveCount(0);
  });

  // Fusion s21 (parties A et B) : B a réécrit /abonnement et /register, le masquage de A tient.
  // /register n'a pas l'en-tête du site (mise en page d'authentification) : contrôle sur toute la page.
  for (const chemin of ["/abonnement", "/register"]) {
    test(`page chaude ${chemin} : aucun bouton prix, ni dans l'en-tête ni dans le menu mobile (375 et 1280 px)`, async ({ page }) => {
      for (const largeur of [375, 1280]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        await page.goto(chemin);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("link", { name: PRIX })).toHaveCount(0);
        await expect(page.locator('a[href^="/abonnement"][href*="src=header"]')).toHaveCount(0);
        const menu = page.getByRole("banner").getByRole("button", { name: "Menu" });
        if (largeur < 768 && (await menu.count()) > 0) {
          await menu.click();
          const nav = page.getByRole("navigation", { name: "Navigation mobile" });
          await expect(nav).toBeVisible();
          await expect(nav.locator('a[href^="/abonnement"][href*="src=header"]')).toHaveCount(0);
        }
      }
    });
  }

  test("menu mobile à 375 x 550 : hauteur bornée, défilement jusqu'à « Connexion »", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 550 });
    await page.goto("/conseils");
    await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
    const nav = page.getByRole("navigation", { name: "Navigation mobile" });
    // Fin de l'animation d'ouverture (glissement) avant de mesurer.
    await nav.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
    const boite = await nav.boundingBox();
    expect((boite?.y ?? 0) + (boite?.height ?? 0)).toBeLessThanOrEqual(550 + 0.5);
    const connexion = nav.getByRole("link", { name: "Connexion" });
    await connexion.scrollIntoViewIfNeeded();
    await expect(connexion).toBeInViewport();
  });
});
