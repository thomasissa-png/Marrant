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
              };
            });
            noter(`rangée ; ${regime} ; ${etat} ; ${largeur} px ; zone=${m.largeurZone.toFixed(1)} ; barre→suivant=${m.avantSuivant.toFixed(1)} ; recherche→zone=${m.apresRecherche?.toFixed(1) ?? "-"} ; marge droite=${(m.bordCoque - m.droite).toFixed(1)} ; recherche x=${m.champ?.x.toFixed(1) ?? "-"}`);
            const ici = `(${etat}, ${largeur} px, ${regime})`;
            expect(m.avantSuivant, `barre finie 20 px avant la recherche ou la zone d'actions ${ici}`).toBeGreaterThanOrEqual(20);
            if (m.apresRecherche !== null) expect(m.apresRecherche, `zone d'actions 8 px après la recherche ${ici}`).toBeGreaterThanOrEqual(8);
            expect(m.droite, `zone d'actions dans la coque ${ici}`).toBeLessThanOrEqual(m.bordCoque + 0.5);
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
        { etat: "PREMIUM", hauteur: 812, chemin: "/profil", defile: true },
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
  });
});
