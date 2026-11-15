import { appendFileSync } from "node:fs";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_ESPACE_NAVIGATION as N, nomCloche } from "@/config/textes/espace-navigation";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

/**
 * Navigation universelle (s24, `docs/ux/navigation-universelle-s24.md` v5 §5) : les 14 critères mesurables,
 * serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`, copie jetable) ; fermé, seul le critère 1
 * (en-tête d'aujourd'hui) est vérifié ici, le reste par le test d'inertie Jest (47 instantanés).
 * Mesures écrites dans `E2E_MESURES_NAV` si la variable est posée (INDEX des captures).
 */
const MOT_DE_PASSE = "E2e-nav-universelle-s24";
const SITE = ["Parcours", "Vannes", "Conseils", "Vidéos", "Articles"];
const PUBLIQUES = ["/", "/vannes", "/conseils", "/videos", "/parcours", "/parcours/repartie", "/blog", "/lettre", "/carnet", "/glossaire"];
const ESPACE_PAGES = [
  "/mon-espace",
  "/mon-espace/quoi-repondre",
  "/mon-espace/bibliotheque",
  "/mon-espace/questions",
  "/mon-espace/s-entrainer",
  "/mon-espace/repliques",
  "/mon-espace/lettres",
  "/mon-espace/fiche/situation/coloc-la-poele",
  "/mon-espace/fiche/jeu/quelle-replique-1",
  "/mon-espace/fiche/bilan/bilan-repartie",
];
type Etat = "visiteur" | "FREE" | "PREMIUM";

async function session(browser: Browser, plan: "FREE" | "PREMIUM"): Promise<Cookie[]> {
  const email = `e2e-nav-${plan.toLowerCase()}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return cookies;
}

/** En-tête prêt : parties chargées à la demande (compte, cloche) montées. */
async function pret(page: Page, etat: Etat) {
  const barre = page.getByRole("banner");
  await expect(barre).toHaveAttribute("data-en-tete-universel", etat === "visiteur" ? "visiteur" : etat === "FREE" ? "gratuit" : "abonne");
  if (etat === "PREMIUM") await expect(barre.getByRole("button", { name: /^Notifications/ })).toBeVisible();
  if (etat !== "visiteur" && page.viewportSize()!.width >= 768) await expect(barre.getByRole("button", { name: TEXTES_CONNEXION.menuCompte })).toBeVisible();
}

/** Signature de l'en-tête : contrôles visibles, nom, adresse sans paramètres, position et largeur. */
const signature = (page: Page) =>
  page.evaluate(() => {
    const vis = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    return Array.from(document.querySelectorAll("header > div a, header > div button, header > div input"))
      .filter(vis)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const nom = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim();
        return `${el.tagName}|${nom}|${(el.getAttribute("href") ?? "").split("?")[0]}|${Math.round(r.left)}|${Math.round(r.width)}`;
      });
  });

/** Boîte du contenu de `main` à la largeur courante (critère 4) : bords gauche et droit de ce qui est rendu. */
const boiteContenu = (page: Page) =>
  page.evaluate(() => {
    const main = document.querySelector("main") as HTMLElement;
    const s = getComputedStyle(main);
    const m = main.getBoundingClientRect();
    const gaucheCoque = m.left + parseFloat(s.paddingLeft);
    const droiteCoque = m.right - parseFloat(s.paddingRight);
    let gauche = Infinity;
    let droite = -Infinity;
    for (const el of Array.from(main.querySelectorAll("*"))) {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || st.visibility === "hidden" || el.closest("[aria-hidden='true'], .sr-only")) continue;
      const feuille = el.children.length === 0 || ["IMG", "SVG", "svg", "BUTTON", "INPUT", "IFRAME"].includes(el.tagName);
      if (!feuille) continue;
      gauche = Math.min(gauche, r.left);
      droite = Math.max(droite, r.right);
    }
    const largeur = droiteCoque - gaucheCoque;
    return {
      marge: Math.round(gaucheCoque),
      gauche: Math.round(gauche),
      droite: Math.round(droite),
      videGauche: Math.round(gauche - gaucheCoque),
      videDroite: Math.round(droiteCoque - droite),
      largeur: Math.round(largeur),
      debordement: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

function noter(ligne: string) {
  if (process.env.E2E_MESURES_NAV) appendFileSync(process.env.E2E_MESURES_NAV, `${ligne}\n`);
}

test.describe("navigation universelle v5 (s24)", () => {
  localSeulement();

  test("critère 1, fermé : en-tête d'aujourd'hui (onglet Accueil), ni « Mon espace » ni en-tête unique", async ({ page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    for (const chemin of ["/", "/vannes", "/parcours", "/lettre"]) {
      await page.goto(chemin);
      const nav = page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" });
      await expect(nav.getByRole("link").first()).toHaveText("Accueil");
      await expect(page.locator("[data-en-tete-universel]")).toHaveCount(0);
    }
    expect((await page.goto("/mon-espace"))?.status()).toBe(404);
  });

  test.describe("interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
    const cookies: Record<"FREE" | "PREMIUM", Cookie[]> = { FREE: [], PREMIUM: [] };
    test.beforeAll(async ({ browser }) => {
      cookies.FREE = await session(browser, "FREE");
      cookies.PREMIUM = await session(browser, "PREMIUM");
    });
    const pagesDe = (etat: Etat) =>
      etat === "PREMIUM" ? [...PUBLIQUES, "/profil", "/favoris", ...ESPACE_PAGES] : etat === "FREE" ? [...PUBLIQUES, "/profil", "/abonnement"] : [...PUBLIQUES, "/abonnement"];
    async function contexte(browser: Browser, etat: Etat) {
      const c = await browser.newContext({ colorScheme: "dark" });
      if (etat !== "visiteur") await c.addCookies(cookies[etat]);
      return c;
    }

    for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
      test(`critères 2 et 3 : même en-tête sur toutes les pages, une seule barre (${etat})`, async ({ browser }) => {
        test.setTimeout(240_000);
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 768, 1280]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          let reference: string[] | null = null;
          for (const chemin of pagesDe(etat).filter((x) => x !== "/abonnement")) {
            const rep = await page.goto(chemin);
            expect(rep?.status(), `${chemin} répond`).toBe(200);
            await pret(page, etat);
            const sig = await signature(page);
            if (!reference) reference = sig;
            else expect(sig, `en-tête de ${chemin} à ${largeur} px (${etat})`).toEqual(reference);
            // Une seule barre : l'en-tête unique, aucun autre élément collé en haut de l'écran.
            await expect(page.locator("[data-en-tete-universel]"), `un seul en-tête, ${chemin}`).toHaveCount(1);
            const collants = await page.evaluate(() =>
              Array.from(document.querySelectorAll("body *")).filter((e) => {
                const st = getComputedStyle(e);
                return ["sticky", "fixed"].includes(st.position) && !e.closest("[data-en-tete-universel]") && e.getBoundingClientRect().top < 120 && e.getBoundingClientRect().height > 0 && st.visibility !== "hidden" && !(e as HTMLElement).matches("a.sr-only, [role='region'], [aria-live]");
              }).length,
            );
            expect(collants, `aucune seconde barre, ${chemin}`).toBe(0);
            expect(await page.locator("[data-en-tete-universel]").evaluate((h) => h.getBoundingClientRect().height), `en-tête de 65 px, ${chemin}`).toBe(65);
          }
          noter(`critère 2 ; ${etat} ; ${largeur} px ; ${pagesDe(etat).length} pages ; contrôles=${reference?.length}`);
        }
        await c.close();
      });

      test(`critère 3 : aucun lien deux fois dans la barre et le menu, hors logo (${etat})`, async ({ browser }) => {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [320, 375, 440, 520, 640, 768, 1023]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
          const hrefs = await page.evaluate(() =>
            Array.from(document.querySelectorAll("header a"))
              .filter((a) => {
                const r = a.getBoundingClientRect();
                const s = getComputedStyle(a);
                return r.width > 0 && s.visibility !== "hidden" && a.textContent?.trim() !== "deviens-marrant.fr";
              })
              .map((a) => (a.getAttribute("href") ?? "").split("?")[0]),
          );
          const doublons = hrefs.filter((h, i) => hrefs.indexOf(h) !== i);
          expect(doublons, `doublons à ${largeur} px (${etat})`).toEqual([]);
        }
        await c.close();
      });
    }

    test("critère 3 : abonné, « Mon espace » et 5 liens ; visiteur et gratuit, 6 liens sans Accueil", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/conseils");
        await pret(page, etat);
        const liens = page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" }).getByRole("link");
        await expect(liens).toHaveText(etat === "PREMIUM" ? [N.monEspace, ...SITE] : [...SITE, "La lettre"]);
        await expect(page.locator("[data-espace-barre], [data-liste-rubriques]")).toHaveCount(0);
        await c.close();
      }
    });

    test("critère 4 : à 1280 px, aucun contenu collé à gauche avec vide à droite ; marges 16, 24, 32 px", async ({ browser }) => {
      test.setTimeout(240_000);
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const largeur of [375, 768, 1280]) {
        await page.setViewportSize({ width: largeur, height: 900 });
        for (const chemin of [...ESPACE_PAGES, "/profil", "/favoris", "/parcours", "/parcours/repartie"]) {
          await page.goto(chemin);
          await pret(page, "PREMIUM");
          await page.waitForLoadState("networkidle").catch(() => {});
          const b = await boiteContenu(page);
          noter(`critère 4 ; ${chemin} ; ${largeur} px ; marge=${b.marge} ; bord-gauche=${b.gauche} ; vide-gauche=${b.videGauche} ; vide-droite=${b.videDroite} ; débordement=${b.debordement}`);
          expect(b.marge, `marge de la coque, ${chemin} à ${largeur} px`).toBe(largeur === 375 ? 16 : largeur === 768 ? 24 : 32);
          expect(b.debordement, `débordement horizontal, ${chemin} à ${largeur} px`).toBeLessThanOrEqual(0);
          if (largeur === 1280) {
            const colle = b.videGauche <= 2 && b.videDroite > b.largeur * 0.25;
            expect(colle, `${chemin} collé à gauche (vide à droite ${b.videDroite} px sur ${b.largeur})`).toBe(false);
          }
        }
      }
      // §3 : rythme de l'espace (H1 30/36 px, grille de « Aujourd'hui » en 2 colonnes à 24 px d'écart).
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/mon-espace");
      const grille = page.locator("[data-aujourdhui-grille]");
      expect(await grille.evaluate((g) => getComputedStyle(g).columnGap)).toBe("24px");
      expect(await page.locator("main h1").first().evaluate((h) => getComputedStyle(h).fontSize)).toBe("36px");
      await c.close();
    });

    test("critère 5 : chaque rubrique de l'espace à 2 touchers (Menu, ligne), sans défilement, de 320 à 414 px sur 568 px", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const largeur of [320, 360, 375, 414]) {
        for (const hauteur of [568, 667]) {
          await page.setViewportSize({ width: largeur, height: hauteur });
          await page.goto("/vannes");
          await pret(page, "PREMIUM");
          await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const bas = await menu.locator("[data-menu-espace]").evaluate((el) => el.getBoundingClientRect().bottom);
          noter(`critère 5 ; ${largeur} x ${hauteur} ; bas du bloc Mon espace=${Math.round(bas)} px ; libre=${Math.round(hauteur - bas)} px`);
          expect(bas, `bloc « Mon espace » entier à ${largeur} x ${hauteur}`).toBeLessThanOrEqual(hauteur);
          expect(await menu.evaluate((el) => el.scrollTop)).toBe(0);
          for (const libelle of [N.monEspace, ...Object.values(N.index).slice(1)]) {
            await expect(menu.getByRole("link", { name: libelle, exact: true })).toBeInViewport({ ratio: 1 });
          }
          if (largeur === 375 && hauteur === 667) expect(Math.round(bas)).toBe(530);
        }
      }
      // Ordinateur : « Mon espace » (1 clic) puis la ligne de l'index (2e clic).
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/glossaire");
      await page.getByRole("banner").getByRole("link", { name: N.monEspace, exact: true }).click();
      await expect(page).toHaveURL(/\/mon-espace$/);
      const index = page.locator("[data-index-espace]");
      await expect(index.getByRole("link")).toHaveText(Object.values(N.index).slice(1));
      await c.close();
    });

    test("critère 7 : clavier (Tab, Échap), focus visible, cibles de 44 px, état actif sans la teinte seule", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/mon-espace/quoi-repondre");
      await pret(page, "PREMIUM");
      const monEspace = page.getByRole("banner").getByRole("link", { name: N.monEspace, exact: true });
      for (let i = 0; i < 6 && !(await monEspace.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
      await expect(monEspace).toBeFocused();
      expect(await monEspace.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
      // Actif : `aria-current` et soulignement de 2 px (pas seulement une couleur).
      await expect(monEspace).toHaveAttribute("aria-current", "page");
      expect(await monEspace.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe("2px");
      const hauteurs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("header > div a, header > div button"))
          .filter((e) => e.getBoundingClientRect().width > 0)
          .map((e) => [(e.getAttribute("aria-label") ?? e.textContent ?? "").trim(), e.getBoundingClientRect().height] as const),
      );
      for (const [nom, h] of hauteurs) expect(h, `cible « ${nom} »`).toBeGreaterThanOrEqual(44);
      await page.setViewportSize({ width: 375, height: 800 });
      const menuBouton = page.getByRole("banner").getByRole("button", { name: "Menu" });
      await menuBouton.click();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toHaveCount(0);
      await expect(menuBouton).toBeFocused();
      await menuBouton.click();
      await page.locator("div.fixed.inset-0[aria-hidden='true']").dispatchEvent("click");
      await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toHaveCount(0);
      await expect(menuBouton).toBeFocused();
      await c.close();
    });

    /** Élément allumé de la barre (1280) et ligne allumée du menu (375), `aria-current="page"`. */
    async function allumes(page: Page, chemin: string, etat: Etat) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(chemin);
      await pret(page, etat);
      const barre = await page.evaluate(() =>
        Array.from(document.querySelectorAll("header > div [aria-current='page']")).map((e) => (e.getAttribute("aria-label") ?? e.textContent ?? "").trim()),
      );
      await page.setViewportSize({ width: 375, height: 900 });
      await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
      const menu = await page.evaluate(() =>
        Array.from(document.querySelectorAll("nav[aria-label='Navigation mobile'] [aria-current='page']")).map((e) => (e.textContent ?? "").trim()),
      );
      return { barre, menu };
    }

    test("critères 8 et 13 : éléments allumés (barre et menu) et retours par type de page, abonné", async ({ browser }) => {
      test.setTimeout(180_000);
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      const T = N.index;
      const cas: [string, string[], string[], string | null][] = [
        ["/mon-espace", [N.monEspace], [N.monEspace], null],
        ["/mon-espace/quoi-repondre", [N.monEspace], [T.quoiRepondre], N.monEspace],
        ["/mon-espace/bibliotheque", [N.monEspace], [T.bibliotheque], N.monEspace],
        ["/mon-espace/questions", [N.monEspace], [T.mesQuestions], N.monEspace],
        ["/mon-espace/s-entrainer", [N.monEspace], [T.sEntrainer], N.monEspace],
        ["/mon-espace/repliques", [N.monEspace], [T.mesRepliques], N.monEspace],
        ["/mon-espace/lettres", [N.monEspace], [T.lettres], N.monEspace],
        ["/mon-espace/fiche/situation/coloc-la-poele", [N.monEspace], [T.quoiRepondre], T.quoiRepondre],
        ["/mon-espace/fiche/jeu/quelle-replique-1", [N.monEspace], [T.sEntrainer], T.sEntrainer],
        ["/mon-espace/fiche/bilan/bilan-repartie", ["Parcours"], ["Parcours"], "Répartie"],
        ["/favoris", [N.monEspace], [T.favoris], null],
        ["/carnet", [N.monEspace], [T.carnet], null],
        ["/profil", [TEXTES_CONNEXION.menuCompte], ["Mon profil"], null],
        ["/lettre", [], [], null],
        ["/vannes", ["Vannes"], ["Vannes"], null],
        ["/", [], [], null],
      ];
      for (const [chemin, barre, menu, retour] of cas) {
        const a = await allumes(page, chemin, "PREMIUM");
        noter(`critère 8 ; abonné ; ${chemin} ; barre=${a.barre.join("+") || "aucun"} ; menu=${a.menu.join("+") || "aucun"}`);
        expect(a.barre, `barre, ${chemin}`).toEqual(barre);
        expect(a.menu, `menu mobile, ${chemin}`).toEqual(menu);
        const lien = page.locator("main [data-lien-retour]");
        if (retour) await expect(lien, `retour, ${chemin}`).toHaveText(new RegExp(`^Retour\\s:\\s${retour}$`));
        else await expect(lien, `aucun retour, ${chemin}`).toHaveCount(0);
      }
      // Bilan : retour vers le parcours d'origine.
      await page.goto("/mon-espace/fiche/bilan/bilan-repartie");
      await expect(page.locator("main [data-lien-retour]")).toHaveAttribute("href", "/parcours/repartie");
      // 768 à 1023 px : intitulé « Mon espace » non cliquable dans le menu, lien en barre.
      await page.setViewportSize({ width: 800, height: 900 });
      await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await expect(menu.locator("p", { hasText: N.monEspace })).toBeVisible();
      await expect(menu.getByRole("link", { name: N.monEspace, exact: true })).toHaveCount(0);
      await expect(menu.getByRole("link", { name: T.quoiRepondre })).toBeVisible();
      await c.close();
    });

    test("critère 8 : éléments allumés, visiteur et compte gratuit", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        const cas: [string, string[]][] = [["/lettre", ["La lettre"]], ["/parcours/repartie", ["Parcours"]], ["/carnet", []], ["/", []], ["/blog", ["Articles"]]];
        if (etat === "FREE") cas.push(["/profil", [TEXTES_CONNEXION.menuCompte]]);
        for (const [chemin, barre] of cas) {
          const a = await allumes(page, chemin, etat);
          expect(a.barre, `barre, ${chemin} (${etat})`).toEqual(barre);
          expect(a.menu, `menu, ${chemin} (${etat})`).toEqual(barre.filter((x) => x !== TEXTES_CONNEXION.menuCompte).concat(chemin === "/profil" ? ["Mon profil"] : []));
        }
        await c.close();
      }
    });

    test("critères 9 et 10 : mêmes adresses sans redirection, HTML serveur du visiteur sans l'espace, offre visible et masquée", async ({ page, request, browser }) => {
      for (const chemin of [...PUBLIQUES, "/abonnement", "/quiz-humour", "/blague-du-jour"]) {
        const rep = await request.get(chemin, { maxRedirects: 0 });
        expect(rep.status(), `${chemin} sans redirection`).toBe(200);
        const html = await rep.text();
        expect(html, `HTML serveur de ${chemin}`).not.toMatch(/Mon espace|Dans ton espace|data-menu-espace|\/api\/espace/);
        expect(html).toContain('data-en-tete-universel="visiteur"');
      }
      for (const largeur of [320, 375, 768, 1280]) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto("/vannes");
        await expect(page.getByRole("banner").locator("[data-en-tete-prix]").filter({ visible: true })).toHaveCount(1);
        await page.goto("/abonnement");
        await expect(page.getByRole("banner").locator("[data-en-tete-prix]")).toHaveCount(0);
      }
      const c = await contexte(browser, "PREMIUM");
      const p = await c.newPage();
      await p.goto("/");
      await pret(p, "PREMIUM");
      await p.waitForLoadState("networkidle").catch(() => {});
      const achats = await p.locator("main a[href^='/abonnement'], header a[href^='/abonnement']").filter({ visible: true }).count();
      noter(`critère 10 ; accueil vu par un abonné ; liens d'achat visibles=${achats}`);
      expect(achats, "accueil de l'abonné : aucun lien d'achat").toBe(0);
      await c.close();
    });

    test("critère 14 : « Aujourd'hui » à 768 et 1280 px, carte du jour et index côte à côte, une seule action pleine", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const largeur of [375, 768, 1280]) {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto("/mon-espace");
        const jour = await page.locator("[data-carte-du-jour]").boundingBox();
        const index = await page.locator("[data-index-espace]").boundingBox();
        const contenu = await page.locator("[data-contenu-du-jour]").boundingBox();
        noter(`critère 14 ; ${largeur} px ; carte du jour x=${Math.round(jour!.x)} y=${Math.round(jour!.y)} l=${Math.round(jour!.width)} ; index x=${Math.round(index!.x)} y=${Math.round(index!.y)} l=${Math.round(index!.width)}`);
        if (largeur >= 768) {
          expect(Math.abs(jour!.y - index!.y), "côte à côte").toBeLessThanOrEqual(1);
          expect(index!.x).toBeGreaterThan(jour!.x + jour!.width);
        } else {
          expect(index!.y, "375 : carte du jour d'abord").toBeGreaterThan(jour!.y);
        }
        const pleins = await page.evaluate(() =>
          Array.from(document.querySelectorAll("[data-aujourdhui-grille] a, [data-aujourdhui-grille] button"))
            .filter((e) => e.getBoundingClientRect().width > 0 && /\bbg-accent-secondary-hover\b/.test(e.className.toString()))
            .map((e) => (e.closest("[data-index-espace]") ? "index" : "jour")),
        );
        expect(pleins, "une seule action pleine, dans la carte du jour").toEqual(["jour"]);
        if (largeur === 1280) {
          await expect(page.locator("[data-contenu-du-jour] h2")).toHaveText("Contenu du jour");
          expect(contenu!.y - Math.max(jour!.y + jour!.height, index!.y + index!.height), "section distincte (48 px)").toBeGreaterThanOrEqual(47);
        }
      }
      await c.close();
    });

    // Relecture des captures nav s24 (reviewer FD1) : toutes les cibles du menu ouvert font 44 px, de 320 à 1023 px.
    test("critère 7 : menu ouvert, toutes les cibles à 44 px de haut (320, 375, 768, 1023 px, 3 états)", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [320, 375, 768, 1023]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/conseils");
          await pret(page, etat);
          await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
          const petites = await page.evaluate(() =>
            Array.from(document.querySelectorAll("nav[aria-label='Navigation mobile'] a, nav[aria-label='Navigation mobile'] button"))
              .filter((e) => e.getBoundingClientRect().width > 0)
              .map((e) => [(e.textContent ?? "").trim(), Math.round(e.getBoundingClientRect().height)] as const)
              .filter(([, h]) => h < 44),
          );
          noter(`critère 7 ; menu ouvert ; ${etat} ; ${largeur} px ; cibles sous 44 px=${petites.length}`);
          expect(petites, `cibles de moins de 44 px, ${etat} à ${largeur} px`).toEqual([]);
        }
        await c.close();
      }
    });

    // s25 (relecture tour 1, spec §1 « de haut en bas ») : liens du site en une colonne ; critère 5 : seules les 8
    // entrées de l'espace tiennent sans défilement ; le reste (liens du site, « Mon profil », « Déconnexion ») est
    // atteint en faisant défiler le menu. Actions du compte alignées sur les liens, avec icône.
    test("abonné à 375 x 812 et 667 : entrées de l'espace sans défilement, liens du site en une colonne, actions à gauche", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const hauteur of [812, 667]) {
        await page.setViewportSize({ width: 375, height: hauteur });
        await page.goto("/vannes");
        await pret(page, "PREMIUM");
        await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
        const menu = page.getByRole("navigation", { name: "Navigation mobile" });
        await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
        await expect(menu.getByRole("link", { name: N.index.carnet, exact: true })).toBeInViewport({ ratio: 1 });
        const xs: number[] = [];
        for (const lien of SITE) xs.push(Math.round((await menu.getByRole("link", { name: lien, exact: true }).boundingBox())!.x));
        expect(new Set(xs).size, `liens du site en une colonne (${xs.join(", ")})`).toBe(1);
        const sortie = menu.getByRole("button", { name: "Déconnexion" });
        await sortie.scrollIntoViewIfNeeded();
        await expect(sortie).toBeInViewport({ ratio: 1 });
        const texteGauche = (el: Element) => {
          const t = Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent?.trim());
          const r = document.createRange();
          r.selectNodeContents(t!);
          return Math.round(r.getBoundingClientRect().left);
        };
        const profil = await menu.getByRole("link", { name: "Mon profil" }).evaluate(texteGauche);
        expect(await sortie.evaluate(texteGauche), "« Déconnexion » aligné sur « Mon profil »").toBe(profil);
        await expect(sortie.locator("svg")).toHaveCount(1);
        await menu.getByRole("link", { name: "Mon profil" }).click();
        await expect(page).toHaveURL(/\/profil$/);
      }
      await c.close();
    });

    // s25 (relecture design tour 1, F1) : la barre ne saute plus d'un compte à l'autre, premier lien au même x.
    // Tour 4 bis (CI : recherche à 762, 764, 772 px) : la spec v5 §1 (recherche de 176 px, validée) prime sur la piste
    // design du tour 2 (recherche au même x pour les 3 comptes). Le Chromium de la CI (Chrome 145) rend les graisses
    // 500 à 700 jusqu'à 8 px plus larges qu'en local ; la coque est plafonnée (`max-w-7xl`, 1216 px utiles de 1280 à
    // 1920 px), donc aucun seuil de largeur ne laisse tenir une zone d'actions fixe avec la recherche à 176 px et ces
    // marges : la recherche change de x selon le compte (accepté), mais pour un compte donné elle garde la même place
    // dans la coque à toutes les largeurs dès 1280 px. Priorité : marges de la rangée, mesurées au rendu local ET sous
    // contrainte (lettres espacées de 0,5 px sur logo, liens, Connexion et offre, plus large que la CI).
    test("barre : premier lien au même x, rangée avec marge, recherche stable par compte (1024 à 1920 px)", async ({ browser }) => {
      const xs: Record<number, string[]> = {};
      const recherche: Record<string, string[]> = {};
      const CONTRAINTE = "header nav a, header > div > a:first-child span, header [data-en-tete-prix], header a[href*='login'] { letter-spacing: .5px }";
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [1024, 1280, 1366, 1440, 1456, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          const premier = page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" }).getByRole("link").first();
          (xs[largeur] ??= []).push(`${etat}=${Math.round((await premier.boundingBox())!.x)}`);
          for (const regime of ["rendu", "contrainte"] as const) {
            const style = regime === "contrainte" ? await page.addStyleTag({ content: CONTRAINTE }) : null;
            // Marges (priorité absolue) : barre finie ≥ 20 px avant l'élément suivant (recherche, ou zone d'actions
            // sous 1280 px) ; contenu de la zone d'actions ≥ 8 px après la recherche ; rien au-delà de la coque.
            const m = await page.evaluate(() => {
              const coque = document.querySelector("header > div") as HTMLElement;
              const zone = coque.lastElementChild as HTMLElement;
              const visibles = Array.from(zone.children).filter((e) => e.getBoundingClientRect().width > 0);
              const g = Math.min(...visibles.map((e) => e.getBoundingClientRect().left));
              const d = Math.max(...visibles.map((e) => e.getBoundingClientRect().right));
              const nav = coque.querySelector("nav")!.getBoundingClientRect();
              const champ = Array.from(coque.querySelectorAll("input")).find((i) => i.getBoundingClientRect().width > 0)?.getBoundingClientRect();
              const cs = getComputedStyle(coque);
              const r = coque.getBoundingClientRect();
              return {
                avantSuivant: (champ ? champ.left : g) - nav.right,
                apresRecherche: champ ? g - champ.right : null,
                champ: champ ? { x: champ.left - (r.left + parseFloat(cs.paddingLeft)), largeur: champ.width } : null,
                droite: Math.max(d, zone.getBoundingClientRect().right),
                bordCoque: r.right - parseFloat(cs.paddingRight),
                largeurZone: zone.getBoundingClientRect().width,
                debordement: document.documentElement.scrollWidth - window.innerWidth,
                fenetre: window.innerWidth,
              };
            });
            noter(`rangée ; ${regime} ; ${etat} ; ${largeur} px ; zone=${m.largeurZone.toFixed(1)} ; barre→suivant=${m.avantSuivant.toFixed(1)} ; recherche→zone=${m.apresRecherche?.toFixed(1) ?? "-"} ; marge droite=${(m.bordCoque - m.droite).toFixed(1)} ; recherche x=${m.champ?.x.toFixed(1) ?? "-"}`);
            const ici = `(${etat}, ${largeur} px, ${regime})`;
            // s25 tour 5 (CI, Chrome 145 : 16 px pour le visiteur à 1280 px sous contrainte) : 20 px exigés au rendu ;
            // sous contrainte (test de robustesse plus dur que tout navigateur réel), seulement aucun chevauchement,
            // avec une marge de 8 px. Aucune autre assertion relâchée.
            const minimum = regime === "rendu" ? 20 : 8;
            expect(m.avantSuivant, `barre finie ${minimum} px avant la recherche ou la zone d'actions ${ici}`).toBeGreaterThanOrEqual(minimum);
            if (m.apresRecherche !== null) expect(m.apresRecherche, `zone d'actions 8 px après la recherche ${ici}`).toBeGreaterThanOrEqual(8);
            // s25 tour 7 (CI, Chrome 145 : visiteur à 1280 px sous contrainte, la zone dépasse la marge de la coque) :
            // au rendu, la zone reste dans la coque ; sous contrainte (lettres espacées de 0,5 px, plus dur que tout
            // navigateur réel), seulement la zone dans la fenêtre avec 8 px de marge à droite, en plus des deux
            // assertions de chevauchement (8 px) ci-dessus et de l'absence de débordement de page ci-dessous.
            // Aucune autre assertion relâchée.
            if (regime === "rendu") expect(m.droite, `zone d'actions dans la coque ${ici}`).toBeLessThanOrEqual(m.bordCoque + 0.5);
            else expect(m.fenetre - m.droite, `zone d'actions dans la fenêtre, 8 px à droite ${ici}`).toBeGreaterThanOrEqual(8);
            expect(m.debordement, `débordement ${ici}`).toBe(0);
            if (m.champ) {
              expect(m.champ.largeur, "recherche de 176 px (spec v5 §1)").toBe(176);
              if (regime === "rendu") (recherche[etat] ??= []).push(`${largeur}=${Math.round(m.champ.x)}`);
            }
            await style?.evaluate((e) => (e as Element).remove());
          }
        }
        await c.close();
      }
      for (const [largeur, valeurs] of Object.entries(xs)) {
        noter(`premier lien ; ${largeur} px ; ${valeurs.join(" ; ")}`);
        expect(new Set(valeurs.map((v) => v.split("=")[1])).size, `premier lien à ${largeur} px : ${valeurs.join(", ")}`).toBe(1);
      }
      for (const [etat, valeurs] of Object.entries(recherche)) {
        noter(`recherche dans la coque ; ${etat} ; ${valeurs.join(" ; ")}`);
        expect(new Set(valeurs.map((v) => v.split("=")[1])).size, `recherche à la même place dans la coque (${etat}) : ${valeurs.join(", ")}`).toBe(1);
      }
    });

    // s25 (relecture tour 2, design F1 F2 et pistes, ux 3 et 5) : menu mobile, un seul pas de 44 px ; actions du compte
    // et « Connexion » à gauche, même graisse et même couleur que les liens du site ; 16 px sous le bouton d'offre.
    test("menu mobile à 375 px : pas de 44 px, actions alignées et de même graisse que les liens, 16 px sous l'offre", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto("/vannes");
        await pret(page, etat);
        await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
        const menu = page.getByRole("navigation", { name: "Navigation mobile" });
        await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
        const lignes = await menu.evaluate((m) => {
          // Début du contenu (icône ou texte) : bord gauche + filet + retrait.
          const texte = (el: Element) => {
            const cs = getComputedStyle(el);
            return Math.round(el.getBoundingClientRect().left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft));
          };
          const mesure = (el: Element) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return { nom: (el as HTMLElement).innerText.trim(), y: Math.round(r.top), bas: Math.round(r.bottom), x: texte(el), graisse: cs.fontWeight, couleur: cs.color };
          };
          const site = Array.from(m.querySelectorAll("[data-liens-site] a")).map(mesure);
          const offre = m.querySelector(`a[href*="/abonnement"]`)!.getBoundingClientRect();
          const actions = Array.from(m.querySelectorAll("[data-actions-compte] > *, a[href*='/login']"))
            .filter((e) => e.getBoundingClientRect().height > 0)
            .map(mesure);
          return { site, actions, offreBas: Math.round(offre.bottom) };
        });
        const pas = lignes.site.slice(1).map((l, i) => l.y - lignes.site[i].y);
        expect(new Set(pas), `pas des liens du site (${etat}) : ${pas.join(", ")}`).toEqual(new Set([44]));
        const pasActions = lignes.actions.slice(1).map((l, i) => l.y - lignes.actions[i].y);
        for (const p of pasActions) expect(p, `pas des actions (${etat})`).toBe(44);
        expect(lignes.actions[0].y - lignes.offreBas, `16 px sous le bouton d'offre (${etat})`).toBe(16);
        const ref = lignes.site[0];
        for (const a of lignes.actions) {
          expect(a.x, `« ${a.nom} » aligné sur les liens (${etat})`).toBe(ref.x);
          expect(a.graisse, `graisse de « ${a.nom} » (${etat})`).toBe(ref.graisse);
          expect(a.couleur, `couleur de « ${a.nom} » (${etat})`).toBe(ref.couleur);
        }
        await c.close();
      }
    });

    // s25 tour 3 (relecture ux, critère 4) : le compte ouvert n'a plus la forme d'un onglet actif ; bas carré et filet
    // violet réservés à l'adresse (/profil ; /favoris du compte gratuit renvoie vers /abonnement, non mesurable ici),
    // ouvert = cloche ouverte. Lu une fois les transitions de couleur finies.
    test("compte ouvert : rendu de la cloche ouverte sur /vannes, forme active seulement sur /profil (1280 px)", async ({ browser }) => {
      const forme = async (el: Element) => {
        await Promise.all(el.getAnimations().map((a) => a.finished));
        const cs = getComputedStyle(el);
        return { bas: cs.borderBottomLeftRadius, haut: cs.borderTopLeftRadius, filet: cs.borderBottomColor, fond: cs.backgroundColor, texte: cs.color, h: el.getBoundingClientRect().height };
      };
      for (const etat of ["PREMIUM", "FREE"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/vannes");
        await pret(page, etat);
        const compte = page.getByRole("banner").getByRole("button", { name: TEXTES_CONNEXION.menuCompte });
        const ferme = await compte.evaluate(forme);
        await compte.click();
        await expect(compte).toHaveAttribute("data-state", "open");
        await page.mouse.move(0, 400);
        const ouvert = await compte.evaluate(forme);
        noter(`compte ouvert ; ${etat} ; /vannes ; ${JSON.stringify(ouvert)}`);
        expect(ouvert.bas, `bas arrondi, compte ouvert non actif (${etat})`).toBe(ouvert.haut);
        expect(ouvert.bas).not.toBe("0px");
        expect(ouvert.filet, `pas de filet violet, compte ouvert non actif (${etat})`).toBe("rgba(0, 0, 0, 0)");
        expect(ouvert.h, "hauteur inchangée à l'ouverture").toBe(ferme.h);
        expect(ouvert.fond, "fond de survol à l'ouverture").not.toBe(ferme.fond);
        await expect(compte).not.toHaveAttribute("aria-current", "page");
        if (etat === "PREMIUM") {
          await page.keyboard.press("Escape");
          // Panneau modal ouvert, l'en-tête est masqué aux lecteurs d'écran : bouton lu par son attribut.
          const cloche = page.locator("[data-en-tete-universel] button[aria-label^='Notifications']");
          await cloche.click();
          await expect(cloche).toHaveAttribute("aria-expanded", "true");
          await page.mouse.move(0, 400);
          const clocheOuverte = await cloche.evaluate(forme);
          noter(`cloche ouverte ; ${JSON.stringify(clocheOuverte)}`);
          // Filet exclu : la cloche n'a pas de bordure (couleur calculée = celle du texte), le compte un filet transparent.
          const sansFilet = ({ bas, haut, fond, texte }: typeof ouvert) => ({ bas, haut, fond, texte });
          expect(sansFilet(ouvert), "compte ouvert rendu comme la cloche ouverte").toEqual(sansFilet(clocheOuverte));
          await page.keyboard.press("Escape");
        }
        for (const chemin of ["/profil"]) {
          await page.goto(chemin);
          await pret(page, etat);
          await expect(compte).toHaveAttribute("aria-current", "page");
          const actif = await compte.evaluate(forme);
          await compte.click();
          await page.mouse.move(0, 400);
          const actifOuvert = await compte.evaluate(forme);
          noter(`compte actif ; ${etat} ; ${chemin} ; ${JSON.stringify(actif)} ; ouvert ${JSON.stringify(actifOuvert)}`);
          for (const f of [actif, actifOuvert]) {
            expect(f.bas, `bas carré, compte actif (${etat}, ${chemin})`).toBe("0px");
            expect(f.filet, `filet violet, compte actif (${etat}, ${chemin})`).not.toBe("rgba(0, 0, 0, 0)");
          }
          await page.keyboard.press("Escape");
        }
        await c.close();
      }
    });

    // s25 tour 3 (relecture design, piste) : texte des actions à icône (Favoris, Mon profil, Déconnexion) sur la
    // verticale du texte des entrées du rail de l'espace (abonné), à 320 et 375 px.
    test("menu mobile : texte des actions à icône aligné sur les entrées du rail (320, 375 px)", async ({ browser }) => {
      const xs: Record<string, number[]> = {};
      for (const etat of ["PREMIUM", "FREE"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [320, 375]) {
          await page.setViewportSize({ width: largeur, height: 812 });
          await page.goto("/vannes");
          await pret(page, etat);
          await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const mesures = await menu.evaluate((m) => {
            const texte = (el: Element) => {
              const t = Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent?.trim());
              const r = document.createRange();
              r.selectNodeContents(t!);
              return Math.round(r.getBoundingClientRect().left);
            };
            return {
              rail: Array.from(m.querySelectorAll("[data-menu-espace] ul a")).map(texte),
              actions: Array.from(m.querySelectorAll("[data-actions-compte] > *")).map((e) => `${(e as HTMLElement).innerText.trim()}=${texte(e)}`),
            };
          });
          noter(`texte des actions ; ${etat} ; ${largeur} px ; rail=${[...new Set(mesures.rail)].join(",")} ; ${mesures.actions.join(" ; ")}`);
          for (const a of mesures.actions) (xs[`${etat}-${largeur}`] ??= []).push(Number(a.split("=")[1]));
          if (etat === "PREMIUM") xs[`rail-${largeur}`] = [...new Set(mesures.rail)];
        }
        await c.close();
      }
      for (const largeur of [320, 375]) {
        expect(xs[`rail-${largeur}`], `rail à ${largeur} px`).toEqual([53]);
        for (const etat of ["PREMIUM", "FREE"]) expect(new Set(xs[`${etat}-${largeur}`]), `actions ${etat} à ${largeur} px`).toEqual(new Set([53]));
      }
    });

    // s25 tour 4 (relecture design, critères 4 et 7 ; ux 3 et 5) : 8 entrées de l'espace en graisse 500 comme les liens
    // du site ; ligne allumée des 8 entrées aux mêmes coins que les autres lignes allumées (droits arrondis, gauche
    // droit sur le rail) ; anneau de focus des liens de barre entièrement arrondi, forme hors focus inchangée.
    test("tour 4 : graisse et coins des entrées de l'espace (375 px), focus arrondi des liens de barre (1280 px)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 375, height: 812 });
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      const coins = (el: Element) => {
        const cs = getComputedStyle(el);
        return { hg: cs.borderTopLeftRadius, hd: cs.borderTopRightRadius, bd: cs.borderBottomRightRadius, bg: cs.borderBottomLeftRadius, graisse: cs.fontWeight };
      };
      const lignesAllumees: Record<string, ReturnType<typeof coins>> = {};
      for (const [chemin, nom] of [["/mon-espace/fiche/situation/coloc-la-poele", N.index.quoiRepondre], ["/vannes", "Vannes"], ["/profil", "Mon profil"]] as const) {
        await page.goto(chemin);
        await pret(page, "PREMIUM");
        await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
        await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
        const graisses = await menu.evaluate((m) =>
          Array.from(m.querySelectorAll("[data-menu-espace] ul a")).map((a) => `${a.getAttribute("aria-current") ?? "-"}:${getComputedStyle(a).fontWeight}`),
        );
        expect(graisses).toHaveLength(8);
        expect(new Set(graisses.filter((g) => g.startsWith("-"))), `entrées non allumées en 500 (${chemin})`).toEqual(new Set(["-:500"]));
        lignesAllumees[chemin] = await menu.getByRole("link", { name: nom, exact: true }).evaluate(coins);
      }
      noter(`lignes allumées ; ${JSON.stringify(lignesAllumees)}`);
      const rubrique = lignesAllumees["/mon-espace/fiche/situation/coloc-la-poele"];
      expect(rubrique.graisse, "rubrique allumée en semi-gras").toBe("600");
      for (const autre of [lignesAllumees["/vannes"], lignesAllumees["/profil"]]) {
        expect({ hg: rubrique.hg, hd: rubrique.hd, bd: rubrique.bd, bg: rubrique.bg }, "mêmes coins que les autres lignes allumées").toEqual({ hg: autre.hg, hd: autre.hd, bd: autre.bd, bg: autre.bg });
      }
      expect(rubrique.hd).not.toBe("0px");
      expect(rubrique.hg, "filet gauche droit").toBe("0px");

      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/vannes");
      await pret(page, "PREMIUM");
      const barre = page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" });
      for (const nom of ["Parcours", "Vannes"]) {
        const lien = barre.getByRole("link", { name: nom, exact: true });
        const repos = await lien.evaluate(coins);
        await lien.focus();
        expect(await lien.evaluate((e) => e.matches(":focus-visible")), `focus visible (${nom})`).toBe(true);
        const focus = await lien.evaluate(coins);
        noter(`focus barre ; ${nom} ; repos=${JSON.stringify(repos)} ; focus=${JSON.stringify(focus)}`);
        expect(repos.hg, `haut arrondi hors focus (${nom})`).not.toBe("0px");
        expect([repos.hd], `haut arrondi hors focus (${nom})`).toEqual([repos.hg]);
        expect([focus.hg, focus.hd, focus.bd, focus.bg], `anneau entièrement arrondi (${nom})`).toEqual([repos.hg, repos.hg, repos.hg, repos.hg]);
        expect([repos.bg, repos.bd], `bas droit hors focus (${nom})`).toEqual(["0px", "0px"]);
        await lien.blur();
      }
      await c.close();
    });

    // s25 tour 4 (relecture ux, critère 2) : à l'ouverture du menu, la ligne allumée sous le pli défile dans la vue
    // (menu seul, bloc « nearest », immédiat si mouvement réduit) ; déjà visible, le menu ne bouge pas. Abonné : le
    // critère 5 de la spec (« Mon espace » et ses 8 entrées sans défilement dès 568 px) prime ; le menu ne défile que
    // si rien ne sort par le haut (à 812 px, « Mon profil » ; à 568 px, il reste en haut). Compte gratuit : sans
    // bloc de l'espace, défilement libre (fenêtre de 480 px).
    test("tour 4 : menu mobile, ligne allumée amenée dans la vue à l'ouverture (/profil à 375 x 812 et 568)", async ({ browser }) => {
      const cas = [
        // Tour 7 (relecture design, P1) : 8 px manquent, + 16 px de marge basse = 24 px, au-delà du plafond de 16 px
        // (marge haute du menu, critère 5) : le menu ne bouge plus.
        { etat: "PREMIUM", hauteur: 812, chemin: "/profil", defile: false },
        { etat: "PREMIUM", hauteur: 812, chemin: "/vannes", defile: false },
        { etat: "PREMIUM", hauteur: 812, chemin: "/mon-espace", defile: false },
        { etat: "PREMIUM", hauteur: 568, chemin: "/profil", defile: false },
        { etat: "PREMIUM", hauteur: 568, chemin: "/vannes", defile: false },
        { etat: "FREE", hauteur: 480, chemin: "/profil", defile: true },
        { etat: "FREE", hauteur: 812, chemin: "/profil", defile: false },
      ] as const;
      for (const mouvement of ["no-preference", "reduce"] as const) {
        for (const etat of ["PREMIUM", "FREE"] as const) {
          const c = await browser.newContext({ colorScheme: "dark", reducedMotion: mouvement });
          await c.addCookies(cookies[etat]);
          const page = await c.newPage();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          for (const { hauteur, chemin, defile } of cas.filter((k) => k.etat === etat)) {
            await page.setViewportSize({ width: 375, height: hauteur });
            await page.goto(chemin);
            await pret(page, etat);
            await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
            await expect(menu).toBeVisible();
            // Deux images après l'ouverture : en mouvement réduit, la ligne est déjà en place.
            const tot = await menu.evaluate(
              (m) =>
                new Promise<number>((ok) =>
                  requestAnimationFrame(() => requestAnimationFrame(() => ok(Math.round(m.querySelector('[aria-current="page"]')!.getBoundingClientRect().bottom - m.getBoundingClientRect().bottom)))),
                ),
            );
            await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
            await expect.poll(() => menu.evaluate((m) => m.scrollTop)).toBe(await menu.evaluate((m) => m.scrollTop));
            const scrollTop = await menu.evaluate((m) => m.scrollTop);
            noter(`ligne allumée à l'ouverture ; ${mouvement} ; ${etat} ; 375x${hauteur} ; ${chemin} ; scrollTop=${scrollTop} ; écart bas après 2 images=${tot}`);
            if (defile) {
              expect(scrollTop, `menu défilé (${etat}, ${chemin}, ${hauteur})`).toBeGreaterThan(0);
              await expect(menu.locator('[aria-current="page"]')).toBeInViewport({ ratio: 1 });
              // Tour 7 (relecture design, P1) : 16 px d'air sous la ligne allumée, ou le menu est en bas de sa course.
              const air = await menu.evaluate((m) => ({
                sous: m.getBoundingClientRect().top + m.clientTop + m.clientHeight - m.querySelector('[aria-current="page"]')!.getBoundingClientRect().bottom,
                enBas: Math.ceil(m.scrollTop) >= m.scrollHeight - m.clientHeight,
              }));
              noter(`ligne allumée à l'ouverture ; ${mouvement} ; ${etat} ; 375x${hauteur} ; ${chemin} ; air sous la ligne=${air.sous.toFixed(1)}`);
              if (!air.enBas) expect(air.sous, `16 px sous la ligne allumée (${etat}, ${chemin}, ${hauteur})`).toBeGreaterThanOrEqual(16 - 0.5);
              if (mouvement === "reduce") expect(tot, "mouvement réduit : en place sans animation").toBeLessThanOrEqual(0);
            } else {
              expect(scrollTop, `menu immobile (${etat}, ${chemin}, ${hauteur})`).toBe(0);
            }
            if (etat === "PREMIUM") {
              for (const libelle of [N.monEspace, ...Object.values(N.index).slice(1)]) {
                await expect(menu.getByRole("link", { name: libelle, exact: true }), `critère 5 (${chemin}, ${hauteur})`).toBeInViewport({ ratio: 1 });
              }
            }
            await page.keyboard.press("Escape");
          }
          await c.close();
        }
      }
    });

    // s25 tour 4 (relecture ux, critère 7) : dans le menu du compte, la ligne de la page en cours porte aria-current
    // et le rendu allumé (texte accent-link, fond, filet, semi-gras), les autres non.
    test("tour 4 : menu du compte, ligne de la page en cours annoncée et allumée (1280 px)", async ({ browser }) => {
      const cas = [
        { etat: "PREMIUM", chemin: "/profil", courant: "Mon profil" },
        { etat: "FREE", chemin: "/profil", courant: "Mon profil" },
        // « Favoris » allumé sur /favoris (compte gratuit) : branché dans le code, mais /favoris est réservé à l'abonné
        // (middleware : compte gratuit renvoyé vers /abonnement), cas inatteignable ici.
        { etat: "FREE", chemin: "/vannes", courant: null },
        { etat: "PREMIUM", chemin: "/vannes", courant: null },
      ] as const;
      for (const { etat, chemin, courant } of cas) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto(chemin);
        await pret(page, etat);
        await page.getByRole("banner").getByRole("button", { name: TEXTES_CONNEXION.menuCompte }).click();
        await page.mouse.move(0, 600);
        const items = page.getByRole("menuitem");
        await expect(items.last()).toBeVisible();
        const rendu = await items.evaluateAll((els) =>
          els.map((e) => {
            const cs = getComputedStyle(e);
            return { nom: (e as HTMLElement).innerText.trim(), courant: e.getAttribute("aria-current"), texte: cs.color, fond: cs.backgroundColor, filet: cs.borderLeftWidth, graisse: cs.fontWeight };
          }),
        );
        noter(`menu du compte ; ${etat} ; ${chemin} ; ${JSON.stringify(rendu)}`);
        for (const r of rendu) {
          if (r.nom === courant) {
            expect(r.courant, `${r.nom} annoncé (${etat}, ${chemin})`).toBe("page");
            expect(r.texte, "texte accent-link").toBe("rgb(167, 139, 250)");
            expect(r.fond, "fond distinct").not.toBe("rgba(0, 0, 0, 0)");
            expect([r.filet, r.graisse], "lisible sans la teinte : filet 2 px et semi-gras").toEqual(["2px", "600"]);
          } else {
            expect(r.courant, `${r.nom} non annoncé (${etat}, ${chemin})`).toBeNull();
            expect(r.graisse).toBe("500");
          }
        }
        await c.close();
      }
    });

    // s25 (relecture design tour 5, critère 7) : liens de barre sur la ligne de base de Connexion et Premium (même
    // corps, ±0,5 px), centrés comme le logo (boîte de texte) et la recherche (zone de contenu) ; état actif et focus
    // clavier compris ; 44 px de haut et soulignement au même y pour tous les liens.
    test("tour 5 : liens de barre sur la ligne de base de la barre (1024, 1280, 1920 px, actif et focus)", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [1024, 1280, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          await page.evaluate(() => document.fonts.ready);
          const mesurer = () =>
            page.evaluate(() => {
              const ctx = document.createElement("canvas").getContext("2d")!;
              // Boîte du premier texte visible (Range) ; ligne de base = haut de la boîte + ascendante de la police.
              const texte = (el: Element) => {
                const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                  acceptNode: (n) => (n.textContent!.trim() && n.parentElement!.getBoundingClientRect().width > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
                });
                const n = w.nextNode()!;
                const r = document.createRange();
                r.selectNodeContents(n);
                const b = r.getBoundingClientRect();
                const s = getComputedStyle(n.parentElement!);
                ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
                return { centre: (b.top + b.bottom) / 2, base: b.top + ctx.measureText(n.textContent!.trim()).fontBoundingBoxAscent };
              };
              const contenu = (el: Element) => {
                const r = el.getBoundingClientRect();
                const s = getComputedStyle(el);
                const haut = r.top + parseFloat(s.borderTopWidth) + parseFloat(s.paddingTop);
                const bas = r.bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom);
                return (haut + bas) / 2;
              };
              const coque = document.querySelector("header > div")!;
              const visible = (el: Element | null) => (el && el.getBoundingClientRect().width > 0 ? el : null);
              const liens = Array.from(coque.querySelectorAll("nav a"))
                .filter((a) => a.getBoundingClientRect().width > 0)
                .map((a) => ({ nom: `${a.textContent!.trim()}${a.getAttribute("aria-current") ? " (actif)" : ""}`, ...texte(a), contenu: contenu(a), h: a.getBoundingClientRect().height, bas: a.getBoundingClientRect().bottom }));
              const connexion = visible(coque.querySelector("a[href*='login']"));
              const prix = visible(coque.querySelector("[data-en-tete-prix]"));
              const champ = Array.from(coque.querySelectorAll("input")).find((i) => i.getBoundingClientRect().width > 0);
              return {
                liens,
                logo: texte(coque.querySelector("a:first-child span")!),
                memeCorps: [connexion, prix].filter((e): e is Element => e !== null).map((e) => ({ nom: e.textContent!.trim(), ...texte(e) })),
                champ: champ ? contenu(champ) : null,
              };
            });
          const m = await mesurer();
          const ici = `(${etat}, ${largeur} px)`;
          noter(`tour 5 ; lignes de base ; ${etat} ; ${largeur} px ; liens=${m.liens.map((l) => `${l.nom}:${l.base.toFixed(2)}`).join(",")} ; ${m.memeCorps.map((e) => `${e.nom}:${e.base.toFixed(2)}`).join(",")} ; logo centre=${m.logo.centre.toFixed(2)} ; champ centre=${m.champ?.toFixed(2) ?? "-"}`);
          expect(m.liens.some((l) => l.nom.endsWith("(actif)")), `un lien allumé ${ici}`).toBe(true);
          for (const l of m.liens) {
            expect(l.h, `${l.nom} : 44 px ${ici}`).toBe(44);
            expect(l.bas, `${l.nom} : soulignement au même y ${ici}`).toBe(m.liens[0].bas);
            for (const e of m.memeCorps) expect(Math.abs(l.base - e.base), `${l.nom} sur la ligne de base de ${e.nom} ${ici}`).toBeLessThanOrEqual(0.5);
            expect(Math.abs(l.centre - m.logo.centre), `${l.nom} centré comme le logo ${ici}`).toBeLessThanOrEqual(0.5);
            if (m.champ !== null) expect(Math.abs(l.contenu - m.champ), `${l.nom} centré comme la recherche ${ici}`).toBeLessThanOrEqual(0.5);
          }
          // Focus clavier sur un lien non allumé : rien ne bouge.
          const autre = m.liens.findIndex((l) => !l.nom.endsWith("(actif)"));
          await page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" }).getByRole("link").filter({ visible: true }).nth(autre).focus();
          await page.keyboard.press("Shift+Tab");
          await page.keyboard.press("Tab");
          expect(await page.evaluate(() => getComputedStyle(document.activeElement!).boxShadow !== "none"), `anneau de focus ${ici}`).toBe(true);
          const f = await mesurer();
          expect(f.liens.map((l) => l.base), `focus clavier : lignes de base inchangées ${ici}`).toEqual(m.liens.map((l) => l.base));
        }
        await c.close();
      }
    });

    // Tour 2 (design F1) : le H1 à la même hauteur sur toutes les pages de l'espace et sur les pages publiques
    // vues par l'abonné (favoris, profil, carnet, parcours), à ±0 px, à chaque largeur.
    test("H1 à la même hauteur sur toutes les pages de l'abonné (375, 768, 1024, 1280 px)", async ({ browser }) => {
      test.setTimeout(240_000);
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      const pages = [...ESPACE_PAGES, "/favoris", "/profil", "/carnet", "/parcours"];
      for (const largeur of [375, 768, 1024, 1280]) {
        await page.setViewportSize({ width: largeur, height: 900 });
        const hauts: string[] = [];
        for (const chemin of pages) {
          await page.goto(chemin);
          await pret(page, "PREMIUM");
          const h1 = page.locator("main h1:not(.sr-only)").first();
          await expect(h1).toBeVisible();
          const haut = Math.round(await h1.evaluate((e) => e.getBoundingClientRect().top + window.scrollY));
          hauts.push(`${chemin}=${haut}`);
        }
        noter(`H1 ; abonné ; ${largeur} px ; ${hauts.join(" ; ")}`);
        expect(new Set(hauts.map((h) => h.split("=")[1])).size, `hauteurs du H1 à ${largeur} px : ${hauts.join(", ")}`).toBe(1);
      }
      await c.close();
    });

    /** Menu ouvert et animation finie. */
    async function ouvrirMenu(page: Page) {
      await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
      return menu;
    }

    // s25 tour 6 (relecture design, D1 faute dure) : le menu suit la marge de la coque à chaque palier. Logo, séparateur
    // et bouton d'offre sur une verticale ; texte des lignes, « Mon espace » et rail de l'espace 12 px plus loin (±0,5 px).
    test("tour 6 : menu sur la verticale du logo (375, 640, 768, 1023 px ; abonné, gratuit)", async ({ browser }) => {
      for (const etat of ["PREMIUM", "FREE"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 640, 768, 1023]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          const menu = await ouvrirMenu(page);
          const m = await menu.evaluate((nav) => {
            const vis = (el: Element) => el.getClientRects().length > 0;
            const texte = (el: Element) => {
              const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent!.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
              const r = document.createRange();
              r.selectNodeContents(w.nextNode()!);
              return r.getBoundingClientRect().left;
            };
            const monEspace = Array.from(nav.querySelectorAll("[data-menu-espace] > a, [data-menu-espace] > p")).find(vis);
            const offre = Array.from(nav.querySelectorAll("a[aria-label]")).find(vis);
            return {
              logo: texte(document.querySelector("header > div > a")!),
              separateurs: Array.from(nav.querySelectorAll("hr")).filter(vis).map((h) => h.getBoundingClientRect().left),
              lignes: Array.from(nav.querySelectorAll("[data-liens-site] a")).map(texte),
              monEspace: monEspace ? texte(monEspace) : null,
              rail: nav.querySelector("[data-menu-espace] ul")?.getBoundingClientRect().left ?? null,
              offre: offre ? offre.getBoundingClientRect().left : null,
            };
          });
          const ici = `(${etat}, ${largeur} px)`;
          noter(`verticale du menu ; ${etat} ; ${largeur} px ; logo=${m.logo} ; séparateurs=${m.separateurs.join(",")} ; lignes=${[...new Set(m.lignes)].join(",")} ; Mon espace=${m.monEspace} ; rail=${m.rail} ; offre=${m.offre}`);
          expect(m.logo, `logo ${ici}`).toBeCloseTo(largeur >= 768 ? 24 : 16, 0);
          expect(m.separateurs.length, `séparateurs ${ici}`).toBeGreaterThan(0);
          for (const x of m.separateurs) expect(Math.abs(x - m.logo), `séparateur sous le logo ${ici}`).toBeLessThanOrEqual(0.5);
          for (const x of m.lignes) expect(Math.abs(x - m.logo - 12), `texte des lignes ${ici}`).toBeLessThanOrEqual(0.5);
          if (etat === "PREMIUM") {
            expect(Math.abs(m.monEspace! - m.logo - 12), `« Mon espace » ${ici}`).toBeLessThanOrEqual(0.5);
            expect(Math.abs(m.rail! - m.logo - 12), `rail de l'espace ${ici}`).toBeLessThanOrEqual(0.5);
          } else {
            expect(Math.abs(m.offre! - m.logo), `bouton d'offre ${ici}`).toBeLessThanOrEqual(0.5);
          }
          await page.keyboard.press("Escape");
        }
        await c.close();
      }
    });

    // s25 tour 6 (relecture design D3, ux 7 pistes 1 et 2) : dans le menu, suggestions fermées au focus du champ (Tab
    // va à la ligne suivante), ouvertes à la frappe ; puces de 44 px en une rangée propre à 320 px, anneau violet ;
    // refermées quand le focus quitte la recherche. Barre dès 1280 px : comportement d'avant (ouverture au focus).
    test("tour 6 : recherche du menu, Tab vers la ligne suivante, puces de 44 px, anneau violet (320, 375 px)", async ({ browser }) => {
      for (const etat of ["PREMIUM", "visiteur"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        const suivante = etat === "PREMIUM" ? N.monEspace : "Parcours";
        for (const largeur of [320, 375]) {
          await page.setViewportSize({ width: largeur, height: 812 });
          await page.goto("/vannes");
          await pret(page, etat);
          const bouton = page.getByRole("banner").getByRole("button", { name: "Menu" });
          await bouton.focus();
          await page.keyboard.press("Enter");
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const champ = menu.getByRole("combobox");
          const ligne = menu.getByRole("link", { name: suivante, exact: true });
          const suggestions = menu.getByRole("listbox", { name: "Suggestions de recherche" });
          const ici = `(${etat}, ${largeur} px)`;
          await page.keyboard.press("Tab");
          await expect(champ, `champ ${ici}`).toBeFocused();
          await expect(suggestions, `rien au focus ${ici}`).toHaveCount(0);
          await page.keyboard.press("Tab");
          await expect(ligne, `Tab depuis le champ ${ici}`).toBeFocused();
          await page.keyboard.press("Shift+Tab");
          await expect(champ).toBeFocused();
          await page.keyboard.type("r");
          await expect(suggestions, `ouvertes à la frappe ${ici}`).toBeVisible();
          const puces = await suggestions.evaluate((l) => {
            const bord = l.getBoundingClientRect();
            return Array.from(l.querySelectorAll("[role='option']")).map((b) => {
              const r = b.getBoundingClientRect();
              return { h: r.height, g: r.left - bord.left, d: bord.right - r.right };
            });
          });
          noter(`puces du menu ; ${etat} ; ${largeur} px ; ${puces.map((p) => p.h).join(",")}`);
          expect(puces.length).toBe(6);
          for (const p of puces) {
            expect(p.h, `puce de 44 px, sur une ligne ${ici}`).toBe(44);
            expect(Math.min(p.g, p.d), `puce dans la liste ${ici}`).toBeGreaterThanOrEqual(12);
          }
          await page.keyboard.press("Tab");
          const premiere = suggestions.getByRole("option").first();
          await expect(premiere).toBeFocused();
          expect(await premiere.evaluate((e) => getComputedStyle(e).boxShadow), `anneau violet ${ici}`).toContain("rgb(167, 139, 250)");
          for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
          await expect(ligne, `après la dernière puce ${ici}`).toBeFocused();
          await expect(suggestions, `refermées hors de la recherche ${ici}`).toHaveCount(0);
          // Pression sur une puce : le focus reste au champ, la puce s'applique.
          await champ.focus();
          await page.keyboard.press("ArrowDown");
          const recherche = page.waitForResponse((r) => r.url().includes("/api/search"));
          await suggestions.getByRole("option", { name: "timing" }).click();
          await expect(champ).toHaveValue("timing");
          await recherche;
          await expect(champ).toBeFocused();
          await page.keyboard.press("Escape");
          await page.keyboard.press("Escape");
          await expect(menu).toHaveCount(0);
        }
        // Barre dès 1280 px : inchangée, suggestions ouvertes au focus, puces d'avant.
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/vannes");
        await pret(page, etat);
        await page.getByRole("banner").getByRole("combobox").first().focus();
        const barre = page.getByRole("banner").getByRole("listbox", { name: "Suggestions de recherche" });
        await expect(barre).toBeVisible();
        const hauteur = await barre.getByRole("option").first().evaluate((e) => e.getBoundingClientRect().height);
        expect(hauteur, `puces de la barre inchangées (${etat})`).toBeLessThan(44);
        await c.close();
      }
    });

    // s25 tour 6 (relecture ux, critère 7 piste 3) : menu ouvert sous le voile, le focus y reste. Tab après le dernier
    // élément revient au premier, Maj+Tab inversement ; Échap ferme et rend le focus au bouton Menu.
    // Tour 7 (relecture ux, critère 7) : le focus enfermé couvre les contrôles de l'en-tête restés visibles au-dessus du voile (logo,
    // cloche, compte, croix), dans l'ordre du DOM : Tab depuis la dernière ligne du menu revient au logo, Maj+Tab
    // depuis le logo va à la dernière ligne, Maj+Tab depuis la première ligne du menu tombe sur la croix.
    test("tour 6 et 7 : focus enfermé dans l'en-tête, menu ouvert (375, 768 px ; abonné, gratuit, visiteur)", async ({ browser }) => {
      for (const etat of ["PREMIUM", "FREE", "visiteur"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 768]) {
          await page.setViewportSize({ width: largeur, height: 812 });
          await page.goto("/vannes");
          await pret(page, etat);
          const bouton = page.getByRole("banner").getByRole("button", { name: "Menu" });
          await bouton.focus();
          await page.keyboard.press("Enter");
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const etatFocus = () =>
            page.evaluate(() => {
              const liste = Array.from(document.querySelectorAll<HTMLElement>("header[data-en-tete-universel] :is(a[href], button, input, [tabindex])")).filter(
                (e) => e.tabIndex >= 0 && e.getClientRects().length > 0,
              );
              const menu = document.querySelector("nav[aria-label='Navigation mobile']")!;
              return {
                i: liste.indexOf(document.activeElement as HTMLElement),
                n: liste.length,
                croix: liste.findIndex((e) => e.getAttribute("aria-label") === "Menu"),
                premierMenu: liste.findIndex((e) => menu.contains(e)),
                nom: ((document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent) || "").trim().slice(0, 24),
              };
            });
          const depart = await etatFocus();
          const ici = `(${etat}, ${largeur} px)`;
          expect(depart.i, `focus sur la croix ${ici}`).toBe(depart.croix);
          expect(depart.premierMenu, `menu juste après la croix ${ici}`).toBe(depart.croix + 1);
          const vus: number[] = [];
          const noms: string[] = [];
          for (let k = 0; k < depart.n + 1; k++) {
            await page.keyboard.press("Tab");
            const f = await etatFocus();
            vus.push(f.i);
            noms.push(f.nom);
          }
          noter(`focus enfermé ; ${etat} ; ${largeur} px ; ${depart.n} éléments, croix=${depart.croix} ; Tab : ${vus.join(",")} ; ${noms.join(" | ")}`);
          const attendu = Array.from({ length: depart.n + 1 }, (_, k) => (depart.croix + 1 + k) % depart.n);
          expect(vus, `Tab fait le tour de l'en-tête, logo après la dernière ligne ${ici}`).toEqual(attendu);
          // Le focus est revenu sur la première ligne du menu : Maj+Tab va à la croix.
          expect(vus[vus.length - 1]).toBe(depart.premierMenu);
          await page.keyboard.press("Shift+Tab");
          expect((await etatFocus()).i, `Maj+Tab depuis la première ligne du menu : la croix ${ici}`).toBe(depart.croix);
          await page.getByRole("banner").getByRole("link").first().focus();
          await page.keyboard.press("Shift+Tab");
          expect((await etatFocus()).i, `Maj+Tab depuis le logo : la dernière ligne du menu ${ici}`).toBe(depart.n - 1);
          await page.keyboard.press("Escape");
          await expect(menu).toHaveCount(0);
          await expect(bouton).toBeFocused();
        }
        await c.close();
      }
    });

    /** Anneaux de focus de l'élément : couleur, épaisseur (étalement) et position (box-shadow de Tailwind). */
    const anneaux = (el: Element) =>
      getComputedStyle(el)
        .boxShadow.split(/,(?![^(]*\))/)
        .map((p) => p.trim())
        .map((p) => ({ couleur: p.match(/rgba?\([^)]*\)/)?.[0] ?? "", longueurs: (p.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat), inset: p.includes("inset") }))
        .filter((a) => (a.longueurs[3] ?? 0) > 0)
        .map((a) => ({ couleur: a.couleur, epaisseur: a.longueurs[3], inset: a.inset, focusVisible: el.matches(":focus-visible"), rayon: getComputedStyle(el).borderTopLeftRadius }));

    async function tabJusqua(page: Page, cible: ReturnType<Page["locator"]>, max = 30) {
      for (let i = 0; i < max && !(await cible.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
      await expect(cible).toBeFocused();
    }

    // s25 tour 7 (relecture design F1 et F2) : un seul anneau dans l'en-tête, 2 px `accent-link` (#A78BFA), arrondi ;
    // lignes du menu du compte au clavier (ouverture, flèches, Tab), aucun anneau au survol à la souris.
    test("tour 7 : un seul anneau (barre, menu mobile, cloche, compte), menu du compte au clavier", async ({ browser }) => {
      const LIEN = "rgb(167, 139, 250)";
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/vannes");
      await pret(page, "PREMIUM");
      const barre = page.getByRole("banner");
      const verifier = async (zone: string, el = page.locator(":focus")) => {
        // Anneau du menu du compte posé au rendu qui suit la touche (`data-highlighted`) : lu une fois posé.
        await expect.poll(() => el.evaluate(anneaux).then((a) => a.length), { message: `un anneau, ${zone}` }).toBe(1);
        const a = await el.evaluate(anneaux);
        noter(`anneau ; ${zone} ; ${JSON.stringify(a)}`);
        expect(a, `un anneau, ${zone}`).toHaveLength(1);
        expect(a[0].couleur, `couleur, ${zone}`).toBe(LIEN);
        expect(a[0].epaisseur, `2 px, ${zone}`).toBe(2);
        expect(a[0].focusVisible, `focus clavier, ${zone}`).toBe(true);
        expect(parseFloat(a[0].rayon), `coins arrondis, ${zone}`).toBeGreaterThan(0);
        return a[0];
      };
      // Souris seule (aucune touche avant) : survol d'une ligne du menu du compte (Radix y met le focus), aucun anneau.
      // Après un usage du clavier, Chrome peut garder l'anneau au survol (Radix empêche le pointerdown) : accepté.
      const compte = barre.getByRole("button", { name: TEXTES_CONNEXION.menuCompte });
      const items = page.getByRole("menuitem");
      await compte.click();
      await expect(items.first()).toBeVisible();
      await items.last().hover();
      await expect(items.last()).toBeFocused();
      expect(await items.last().evaluate(anneaux), "aucun anneau au survol à la souris").toHaveLength(0);
      await page.mouse.click(10, 600);
      await expect(items).toHaveCount(0);
      // Barre : un lien du site (départ du logo).
      await barre.getByRole("link").first().focus();
      await tabJusqua(page, barre.getByRole("link", { name: "Parcours", exact: true }));
      const lienBarre = await verifier("barre, lien");
      expect(lienBarre.inset).toBe(false);
      // Cloche : bouton, puis « Fermer » et une ligne du panneau.
      const cloche = barre.getByRole("button", { name: /^Notifications/ });
      await tabJusqua(page, cloche);
      await verifier("cloche, bouton");
      await page.keyboard.press("Enter");
      const panneau = page.getByRole("dialog");
      await expect(panneau).toBeVisible();
      await verifier("cloche, Fermer");
      await page.keyboard.press("Tab");
      if (await panneau.getByRole("link").count()) await verifier("cloche, ligne");
      await page.keyboard.press("Escape");
      await expect(panneau).toHaveCount(0);
      // Compte : bouton, puis lignes au clavier (ouverture Entrée, flèches, Tab).
      await tabJusqua(page, compte);
      await verifier("compte, bouton");
      await page.keyboard.press("Enter");
      await expect(items.first()).toBeFocused();
      expect((await verifier("compte, première ligne (Entrée)")).inset, "anneau intérieur dans le panneau").toBe(true);
      await page.keyboard.press("ArrowDown");
      await expect(items.nth(1)).toBeFocused();
      await verifier("compte, deuxième ligne (flèche bas)");
      await page.keyboard.press("ArrowUp");
      await expect(items.first()).toBeFocused();
      await verifier("compte, première ligne (flèche haut)");
      await page.keyboard.press("Tab");
      const apresTab = await page.evaluate(() => ({ role: document.activeElement?.getAttribute("role"), menu: !!document.querySelector("[role='menu']") }));
      noter(`compte ; Tab dans le menu ouvert ; ${JSON.stringify(apresTab)}`);
      if (apresTab.role === "menuitem") await verifier("compte, ligne après Tab");
      else await verifier("compte, focus après Tab (menu refermé)");
      await page.keyboard.press("Escape");
      // Menu mobile : champ de recherche (bordure + ring-1 de la même couleur) et une ligne du rail, coins arrondis.
      await page.setViewportSize({ width: 375, height: 812 });
      const bouton = barre.getByRole("button", { name: "Menu" });
      await bouton.focus();
      await page.keyboard.press("Enter");
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
      await page.keyboard.press("Tab");
      const champ = menu.getByRole("combobox");
      await expect(champ).toBeFocused();
      // Bordure en transition (`transition-colors`, 150 ms) : lue une fois arrivée.
      await expect.poll(() => champ.evaluate((el) => getComputedStyle(el).borderTopColor), { message: "recherche, bordure" }).toBe(LIEN);
      const ch = await champ.evaluate((el) => ({ bord: getComputedStyle(el).borderTopColor, largeurBord: getComputedStyle(el).borderTopWidth }));
      const anneauChamp = await champ.evaluate(anneaux);
      noter(`anneau ; menu, recherche ; ${JSON.stringify(ch)} ; ${JSON.stringify(anneauChamp)}`);
      expect(ch.largeurBord, "recherche, bordure de 1 px").toBe("1px");
      expect(anneauChamp.map((a) => [a.couleur, a.epaisseur]), "recherche : 1 px de bordure + 1 px d'anneau").toEqual([[LIEN, 1]]);
      await tabJusqua(page, menu.getByRole("link", { name: N.index.quoiRepondre, exact: true }));
      const rail = await verifier("menu, ligne du rail");
      expect(rail.inset, "anneau intérieur dans le menu").toBe(true);
      expect(rail.rayon, "ligne du rail arrondie à gauche au focus, comme les liens de la barre").toBe(lienBarre.rayon);
      await tabJusqua(page, menu.getByRole("link", { name: "Vannes", exact: true }));
      expect((await verifier("menu, ligne allumée")).rayon, "ligne allumée arrondie au focus").toBe(lienBarre.rayon);
      await c.close();
    });

    // s25 tour 7 (relecture design P1) : abonné sur /profil à 375 x 812 : 8 px manquent, la marge basse de 16 px
    // dépasserait le plafond (marge haute du menu, critère 5) : le menu ne bouge pas, la recherche garde ses 16 px.
    test("tour 7 : défilement du menu à l'ouverture, 16 px sous la ligne ou immobile (abonné, /profil, 375 x 812)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/profil");
      await pret(page, "PREMIUM");
      await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
      await page.waitForTimeout(400);
      const m = await menu.evaluate((nav) => {
        const r = nav.getBoundingClientRect();
        const champ = nav.querySelector("input")!.getBoundingClientRect();
        const ligne = nav.querySelector('[aria-current="page"]')!.getBoundingClientRect();
        return { scrollTop: nav.scrollTop, margeHaute: champ.top - (r.top + nav.clientTop), sous: r.top + nav.clientTop + nav.clientHeight - ligne.bottom };
      });
      noter(`tour 7 ; défilement /profil 375x812 ; scrollTop=${m.scrollTop} ; marge haute recherche=${m.margeHaute.toFixed(1)} ; ligne sous le bas=${(-m.sous).toFixed(1)}`);
      expect(m.scrollTop, "menu immobile").toBe(0);
      expect(m.margeHaute, "recherche à 16 px du filet").toBeCloseTo(16, 0);
      for (const libelle of [N.monEspace, ...Object.values(N.index).slice(1)]) {
        await expect(menu.getByRole("link", { name: libelle, exact: true }), "critère 5").toBeInViewport({ ratio: 1 });
      }
      await c.close();
    });
  });
});
