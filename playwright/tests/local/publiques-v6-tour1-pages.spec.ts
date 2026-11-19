import type { Browser, BrowserContext, Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, adresseVisiteur, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * v6 tour 1, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-1.md` :
 *  1. cartes à filet de l'accueil (vannes, carnet, lettre, parcours, profil) ;
 *  8. /vannes : chevrons de 44 px sur la rangée de catégories dès 1 024 px (« Pourquoi » : centré depuis le tour 2) ;
 *  9. réassurance alignée sur le bord gauche de son bloc (/profil ; /vannes : centrée depuis le tour 2) ;
 * 10. /lettre : formulaire en carte à filet, titre centré, bouton plein ; H1 « La lettre » pour l'abonné ;
 * 11. /carnet de l'abonné : sommaire en tête, carnets précédents dessous ;
 * 12. /parcours de l'abonné : un seul plein dans la liste, « Explore aussi » sur deux colonnes ;
 * 13. /profil : aucun débordement à 290 et 320 px, H1 à la hauteur de celui de /favoris.
 * Interrupteur fermé : rien de tout cela (contrôlé en fin de fichier).
 */
type Etat = "visiteur" | "FREE" | "PREMIUM";
const PREVERSION = process.env.E2E_COMPTES_PREVERSION === "1";
const MOT_DE_PASSE = PREVERSION ? "preversion-s24" : "E2e-publiques-v6t1-s25";

const comptes = new Map<string, string>();
async function email(cle: "FREE" | "PREMIUM"): Promise<string> {
  if (PREVERSION) return { FREE: "inscrit-gratuit@preversion.test", PREMIUM: "abonne-en-cours@preversion.test" }[cle];
  if (!comptes.has(cle)) {
    const adresse = `e2e-v6t1-${cle.toLowerCase()}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}@example.com`;
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
/** Filet de l'accueil : premier enfant `[data-filet]`, 4 px de haut, collé au bord haut de sa carte. */
async function attendreFilet(carte: Locator) {
  const filet = carte.locator(":scope > [data-filet]");
  await expect(filet).toHaveCount(1);
  // Carte et filet lus dans la même image, après les animations d'entrée finies (deux lectures séparées pendant la
  // montée de la carte donnaient un écart de quelques pixels en CI).
  const m = await carte.evaluate(async (el) => {
    const finies = document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
    await Promise.all(finies.map((a) => a.finished.catch(() => undefined)));
    await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
    const [b, f] = [el.getBoundingClientRect(), el.querySelector(":scope > [data-filet]")!.getBoundingClientRect()];
    return { hauteur: f.height, ecart: Math.abs(f.top - b.top) };
  });
  expect(Math.round(m.hauteur)).toBe(4);
  expect(m.ecart).toBeLessThanOrEqual(1);
}

test.describe("v6 tour 1, lot 2 : pages publiques", () => {
  test.beforeEach(() => localSeulement());

  test.describe("interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "serveur construit interrupteur ouvert seulement");

    // v6 tour 2 (point 11, voulu) : « Pourquoi » et la réassurance passent du rendu en deux colonnes et aligné à gauche du
    // tour 1 au rendu centré de l'accueil ; le filet et les chevrons du tour 1 restent.
    // s26 (`docs/design/parcours-vannes-s26.md` §3, décision de Thomas du 18/11 étendue à /vannes) : filet violet masqué
    // (le `<span data-filet>` reste dans le HTML, classes seules), cartes en 3 colonnes, « Pourquoi » en 3 colonnes sous un
    // titre à gauche, offre de fin de liste sans centrage forcé. Les chevrons du tour 1 restent.
    test("/vannes visiteur 1280 : sans filet, 3 colonnes, chevrons, « Pourquoi » en 3 colonnes à gauche", async ({ browser }) => {
      const { c, page } = await contexte(browser, "visiteur");
      await page.goto("/vannes");
      const main = page.locator("main");
      const premiere = main.locator("[role='tabpanel'] > div").first();
      await expect(premiere).toBeVisible();
      await expect(premiere.locator(":scope > [data-filet]")).toBeHidden();
      // Rangée lue une fois l'entrée des cartes finie (`animate-stagger-in` : montée de 12 px, 50 ms de décalage par carte),
      // les trois boîtes dans la même image, comme `attendreFilet` : lue pendant l'entrée, la 3e carte était encore à
      // +12 px (translateY de départ) alors que la mise en page est alignée (397 / 397 / 397 à 1280, mesure du 19/11).
      const [v1, v3] = await main.locator("[role='tabpanel']").evaluate(async (el) => {
        const finies = document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
        await Promise.all(finies.map((a) => a.finished.catch(() => undefined)));
        await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        return [el.children[0].getBoundingClientRect(), el.children[2].getBoundingClientRect()].map((r) => ({ y: r.top }));
      });
      expect(Math.abs(v1.y - v3.y), "trois vannes sur la première rangée").toBeLessThanOrEqual(1);
      const rangee = main.getByRole("tablist", { name: "Catégories de vannes" });
      const droite = main.locator('[data-chevron="droite"]');
      await expect(droite).toBeVisible();
      expect(Math.round((await boite(droite)).height)).toBe(44);
      const derniere = rangee.getByRole("tab").last();
      // Défilement doux : attendre la fin de chaque pas avant de relire le chevron (il disparaît au bout de la rangée ;
      // un clic lancé pendant sa disparition attendait un bouton démonté).
      const finDuPas = () =>
        rangee.evaluate((el) => new Promise<void>((ok) => {
          let x = -1;
          const lire = () => (el.scrollLeft === x ? ok() : ((x = el.scrollLeft), setTimeout(lire, 150)));
          lire();
        }));
      for (let i = 0; i < 6 && (await droite.isVisible()); i++) {
        await droite.click();
        await finDuPas();
      }
      await expect(droite).toBeHidden();
      await expect(main.locator('[data-chevron="gauche"]')).toBeVisible();
      const [r, d] = [await boite(rangee), await boite(derniere)];
      expect(d.x + d.width).toBeLessThanOrEqual(r.x + r.width + 1);
      // « Pourquoi ces vannes sont différentes » (s26) : titre à gauche, un paragraphe par colonne (3 colonnes) dessous.
      const titre = main.getByRole("heading", { name: "Pourquoi ces vannes sont différentes" });
      const texte = titre.locator("xpath=following-sibling::div[1]");
      expect(await titre.evaluate((el) => getComputedStyle(el).textAlign)).not.toBe("center");
      const [bt, bx] = [await boite(titre), await boite(texte)];
      expect(bx.y).toBeGreaterThanOrEqual(bt.y + bt.height - 1);
      expect(Math.abs(bx.x - bt.x)).toBeLessThanOrEqual(1);
      const paragraphes = texte.locator(":scope > p");
      const [p1, p3] = [await boite(paragraphes.nth(0)), await boite(paragraphes.nth(2))];
      expect(Math.abs(p1.y - p3.y), "trois paragraphes côte à côte").toBeLessThanOrEqual(1);
      // Mur (s26) : l'objet Premium n'est pas restylé ; plus de centrage forcé de sa réassurance.
      const mur = main.locator("[data-mur-liste]");
      await expect(mur).toBeVisible();
      expect(await mur.locator("[data-reassurance]").evaluate((el) => getComputedStyle(el).textAlign)).not.toBe("center");
      await c.close();
    });

    // s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §6.1) : titre à gauche, carte neutre (plus de filet),
    // bouton plein seul aplat.
    test("/lettre visiteur (s26) : titre à gauche, carte neutre, bouton plein", async ({ browser }) => {
      const { c, page } = await contexte(browser, "visiteur");
      await page.goto("/lettre");
      const h1 = page.getByRole("heading", { level: 1 });
      expect(await h1.evaluate((el) => getComputedStyle(el).textAlign)).not.toBe("center");
      const carte = page.locator("[data-lettre-carte]");
      await expect(carte.locator("[data-filet]")).toHaveCount(0);
      const bouton = carte.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton });
      expect(await bouton.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
      await c.close();
    });

    test("/lettre abonné : H1 « La lettre »", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/lettre");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(TEXTES_LETTRE.menu);
      await c.close();
    });

    // v6 tour 3 (point 9, remplace le tour 1) : « Les carnets précédents » descend après les fiches, en fin de page.
    test("/carnet abonné : sommaire en tête, carnets précédents après les fiches, ancres atteintes", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/carnet");
      const sommaire = page.locator("[data-carnet-sommaire]");
      const liens = sommaire.getByRole("link");
      const fiches = page.locator("main [id^='fiche-']");
      await expect(liens).toHaveCount(await fiches.count());
      const premiere = fiches.first();
      expect((await boite(sommaire)).y).toBeLessThan((await boite(premiere)).y);
      const archives = page.locator("[aria-labelledby='carnet-archives']");
      if ((await archives.count()) > 0) {
        const derniere = await boite(fiches.last());
        expect((await boite(archives)).y).toBeGreaterThanOrEqual(derniere.y + derniere.height);
      }
      // s26 (`docs/design/favoris-carnet-s26.md` §4) : fiches au cadre neutre (plus de filet) ; sommaire en tuiles 4/4/4
      // à 1280 (trois tuiles sur la même rangée), la première marquée d'un filet blanc à gauche, chaque tuile de 44 px.
      await expect(premiere.locator(":scope > [data-filet]")).toHaveCount(0);
      const [t0, t1, t2] = [await boite(liens.nth(0)), await boite(liens.nth(1)), await boite(liens.nth(2))];
      expect(Math.abs(t0.y - t2.y), "trois tuiles par rangée à 1280").toBeLessThanOrEqual(1);
      expect(t1.height).toBeGreaterThanOrEqual(44);
      // s26 tour 3 : filet blanc de la première tuile = bord de 1 px blanc + filet intérieur de 1 px (`::before`), au
      // lieu d'un bord de 2 px qui décalait son texte de 1 px : texte aligné sur la tuile de dessous (même colonne).
      const filet = await liens.nth(0).evaluate((e) => ({ bord: getComputedStyle(e).borderLeftWidth, dedans: getComputedStyle(e, "::before").width }));
      expect(filet).toEqual({ bord: "1px", dedans: "1px" });
      const texteX = async (i: number) => (await boite(liens.nth(i).locator("span").first())).x;
      expect(Math.abs((await texteX(0)) - (await texteX(3))), "texte de la tuile active aligné").toBeLessThanOrEqual(0.5);
      await expect(page.locator("[data-carnet-retour-sommaire]")).toHaveCount(await fiches.count());
      const cible = fiches.nth(4);
      await liens.nth(4).click();
      await expect(page).toHaveURL(new RegExp(`#${await cible.getAttribute("id")}$`));
      await expect(cible).toBeInViewport();
      await c.close();
    });

    // s26 tour 3 (fautes dures des relectures du tour 2) : à 1280 x 900, le rail défile jusqu'à la ligne courante, sans
    // faire bouger la page ; numéros à largeur fixe (titres alignés de 1 à 30).
    test("/carnet abonné : le rail suit la fiche courante jusqu'à la 30e, la page ne saute pas", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/carnet");
      const rail = page.locator("[data-carnet-rail]");
      const titres = await rail.locator("a > span:nth-child(2)").evaluateAll((s) => s.map((e) => Math.round(e.getBoundingClientRect().left)));
      expect(new Set(titres).size, "titres du rail alignés").toBe(1);
      const fiches = page.locator("main [id^='fiche-']");
      const n = await fiches.count();
      for (const i of [Math.floor(n * 0.6), n - 1]) {
        const y = await fiches.nth(i).evaluate((e) => {
          document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 130);
          return window.scrollY;
        });
        const courante = rail.locator(`a[href="#${await fiches.nth(i).getAttribute("id")}"]`);
        await expect(courante).toHaveAttribute("aria-current", "location");
        await expect.poll(async () => {
          const [r, l] = [await boite(rail), await boite(courante)];
          return l.y >= r.y - 1 && l.y + l.height <= r.y + r.height + 1;
        }, `ligne ${i + 1} visible dans le rail`).toBe(true);
        expect(await page.evaluate(() => window.scrollY), "la page ne bouge pas").toBe(y);
      }
      await c.close();
    });

    // s26 tour 3 : sous 768 px, sommaire en liste compacte (une ligne par fiche, 44 px au moins), plus 30 tuiles.
    test("/carnet abonné à 375 : sommaire en liste compacte", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM", 375);
      await page.goto("/carnet");
      const sommaire = page.locator("[data-carnet-sommaire]");
      const liens = sommaire.getByRole("link");
      const hauteurs = await liens.evaluateAll((l) => l.map((e) => e.getBoundingClientRect().height));
      expect(Math.min(...hauteurs)).toBeGreaterThanOrEqual(44);
      expect(Math.max(...hauteurs), "deux lignes de titre au plus").toBeLessThanOrEqual(72);
      expect((await boite(sommaire)).height, "liste, pas 30 tuiles (4 116 px au tour 2)").toBeLessThan(1800);
      const texteX = async (i: number) => (await boite(liens.nth(i).locator("span").first())).x;
      expect(Math.abs((await texteX(0)) - (await texteX(1))), "ligne active alignée").toBeLessThanOrEqual(0.5);
      await c.close();
    });

    // s26 (`docs/ux/parcours-vannes-s26.md` §1.3) : le seul plein de l'abonné est « l'étape à reprendre » au-dessus de la
    // liste ; toutes les cartes en contour, filet violet masqué (décision du 18/11, `<span data-filet>` gardé dans le HTML).
    test("/parcours abonné : aucun plein dans la liste, « Explore aussi » sur deux colonnes", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/parcours");
      const cartes = page.locator("main [id^='parcours-']").filter({ has: page.locator(":scope > [data-filet]") });
      await expect(cartes.first()).toBeVisible();
      await expect(cartes.first().locator(":scope > [data-filet]")).toBeHidden();
      const boutons = page.locator("main [id^='parcours-'] button").filter({ hasText: /Commencer ce parcours|Continuer ce parcours|Revoir/ });
      await expect(boutons.first()).toBeVisible();
      // Statut de l'abonné connu après l'hydratation (session, progression) : lire l'état stable.
      await expect
        .poll(() => boutons.evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor).filter((f) => f !== "rgba(0, 0, 0, 0)").length), { message: "aucun bouton plein dans la liste", timeout: 10_000 })
        .toBe(0);
      const explore = page.getByRole("heading", { name: "Explore aussi" }).locator("xpath=following-sibling::div[1]/a");
      await expect(explore).toHaveCount(2);
      const [a, b] = [await boite(explore.nth(0)), await boite(explore.nth(1))];
      expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
      await c.close();
    });

    for (const largeur of [290, 320]) {
      test(`/profil gratuit ${largeur} px : aucun débordement horizontal`, async ({ browser }) => {
        const { c, page } = await contexte(browser, "FREE", largeur);
        await page.goto("/profil");
        await expect(page.locator("[data-reassurance]")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(largeur);
        await c.close();
      });
    }

    test("/profil gratuit 1280 : H1 à la hauteur de celui de /favoris, réassurance à gauche du bouton", async ({ browser }) => {
      const { c, page } = await contexte(browser, "FREE");
      await page.goto("/favoris");
      // s26 : l'aperçu de Favoris passe au hero `ApercuVerrouille` ; la pastille « Premium » y tient la hauteur du H1 des
      // autres pages (le H1 de l'aperçu est dessous), c'est elle qui sert de repère.
      const yFavoris = (await boite(page.locator("[data-apercu-tete]"))).y;
      await page.goto("/profil");
      expect(Math.abs((await boite(page.getByRole("heading", { level: 1 }))).y - yFavoris)).toBeLessThanOrEqual(2);
      const reass = page.locator("[data-reassurance]");
      expect(await reass.evaluate((el) => getComputedStyle(el).textAlign)).toBe("left");
      await c.close();
    });
  });

  test.describe("interrupteur fermé", () => {
    test.skip(ESPACE_OUVERT, "serveur construit interrupteur fermé seulement");

    test("/vannes et /lettre : ni filet, ni chevron, ni carte de lettre", async ({ browser }) => {
      const { c, page } = await contexte(browser, "visiteur");
      await page.goto("/vannes");
      await expect(page.locator("[role='tabpanel'] > div").first()).toBeVisible();
      await expect(page.locator("[data-filet], [data-chevron], [data-rangee-defilante]")).toHaveCount(0);
      await page.goto("/lettre");
      await expect(page.locator("[data-filet], [data-lettre-carte]")).toHaveCount(0);
      await c.close();
    });
  });
});
