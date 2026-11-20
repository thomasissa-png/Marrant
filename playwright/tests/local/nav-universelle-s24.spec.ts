import { appendFileSync } from "node:fs";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

/**
 * Navigation universelle, v6 (s25, `docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le 15/11) : bande des
 * rubriques sous la rangée de l'en-tête, dans le même bloc collant, pour les 3 états ; critères v6 §6 et consignes du
 * 15/11 (indice de suite, alignement des actions de droite). Critères de la v5 (s24) que la v6 remplace RETIRÉS (liens
 * du site et « Mon espace » en barre, index de l'espace dans le menu mobile et dans Aujourd'hui, « Retour : Mon
 * espace », menu de 768 à 1023 px) ; critères v5 toujours vrais gardés (en-tête fermé, marges, cloche, compte, anneau
 * unique, recherche à 176 px et 44 px, focus enfermé du menu). Serveur construit interrupteur OUVERT
 * (`E2E_ESPACE_OUVERT=1`, copie jetable) ; fermé, seul l'en-tête d'aujourd'hui est vérifié ici, le reste par le test
 * d'inertie Jest (47 instantanés). Mesures écrites dans `E2E_MESURES_NAV` si la variable est posée.
 */
const MOT_DE_PASSE = "E2e-nav-universelle-s24";
const ORDRE = ["Aujourd’hui", "Parcours", "Quoi répondre", "Bibliothèque", "S’entraîner", "Vannes", "Conseils", "Vidéos", "Articles", "La lettre", "Favoris", "Carnet"];
const HREFS = ["/mon-espace", "/parcours", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/vannes", "/conseils", "/videos", "/blog", "/lettre", "/favoris", "/carnet"];
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
const LIEN = "rgb(167, 139, 250)";
type Etat = "visiteur" | "FREE" | "PREMIUM";
const ETATS = ["visiteur", "FREE", "PREMIUM"] as const;

async function session(browser: Browser, plan: "FREE" | "PREMIUM"): Promise<Cookie[]> {
  const email = `e2e-nav-${plan.toLowerCase()}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return cookies;
}

/** En-tête prêt : parties chargées à la demande (compte, cloche) montées, bande placée. */
async function pret(page: Page, etat: Etat) {
  const barre = page.getByRole("banner");
  await expect(barre).toHaveAttribute("data-en-tete-universel", etat === "visiteur" ? "visiteur" : etat === "FREE" ? "gratuit" : "abonne");
  if (etat === "PREMIUM") await expect(barre.getByRole("button", { name: /^Notifications/ })).toBeVisible();
  if (etat !== "visiteur" && page.viewportSize()!.width >= 768) await expect(barre.getByRole("button", { name: TEXTES_CONNEXION.menuCompte })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

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

/**
 * État de la bande : boîtes des rubriques relatives à la vue défilante, défilement, fondus (gauche, droit) lus sur la
 * bande, accroche. `t` : libellé (boîte moins `px-1.5`, v6 tour 1).
 */
const bande = (page: Page) =>
  page.evaluate(() => {
    const d = document.querySelector<HTMLElement>("[data-defilement]")!;
    const v = d.getBoundingClientRect();
    const [fg, fd] = (d.dataset.fondus ?? "0 0").split(" ").map(Number);
    return {
      scroll: d.scrollLeft,
      max: d.scrollWidth - d.clientWidth,
      vue: d.clientWidth,
      fg,
      fd,
      masque: getComputedStyle(d).maskImage,
      accroche: getComputedStyle(d).scrollSnapType,
      chips: Array.from(d.querySelectorAll<HTMLElement>("[data-rubrique]")).map((a) => {
        const r = a.getBoundingClientRect();
        return { nom: a.textContent!.trim(), l: r.left - v.left, r: r.right - v.left, tl: r.left - v.left + 6, tr: r.right - v.left - 6, actif: a.getAttribute("aria-current") === "page" };
      }),
    };
  });

function noter(ligne: string) {
  if (process.env.E2E_MESURES_NAV) appendFileSync(process.env.E2E_MESURES_NAV, `${ligne}\n`);
}

/** Anneaux de focus de l'élément : couleur, épaisseur (étalement) et position (box-shadow de Tailwind). */
const anneaux = (el: Element) =>
  getComputedStyle(el)
    .boxShadow.split(/,(?![^(]*\))/)
    .map((p) => p.trim())
    .map((p) => ({ couleur: p.match(/rgba?\([^)]*\)/)?.[0] ?? "", longueurs: (p.replace(/rgba?\([^)]*\)/, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat), inset: p.includes("inset") }))
    .filter((a) => (a.longueurs[3] ?? 0) > 0)
    .map((a) => ({ couleur: a.couleur, epaisseur: a.longueurs[3], inset: a.inset, focusVisible: el.matches(":focus-visible"), rayon: getComputedStyle(el).borderTopLeftRadius }));

async function tabJusqua(page: Page, cible: ReturnType<Page["locator"]>, max = 40) {
  for (let i = 0; i < max && !(await cible.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(cible).toBeFocused();
}

test.describe("navigation universelle v6 (s25)", () => {
  localSeulement();

  test("fermé : en-tête d'aujourd'hui (onglet Accueil), ni bande des rubriques ni en-tête unique", async ({ page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    for (const chemin of ["/", "/vannes", "/parcours", "/lettre", "/conseils"]) {
      await page.goto(chemin);
      const nav = page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" });
      await expect(nav.getByRole("link").first()).toHaveText("Accueil");
      await expect(page.locator("[data-en-tete-universel], [data-bande-rubriques]")).toHaveCount(0);
    }
    // Fil d'Ariane du site gardé, interrupteur fermé.
    await page.goto("/conseils");
    await expect(page.getByRole("navigation", { name: "Fil d’Ariane" })).toBeVisible();
    expect((await page.goto("/mon-espace"))?.status()).toBe(404);
  });

  test.describe("interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
    const cookies: Record<"FREE" | "PREMIUM", Cookie[]> = { FREE: [], PREMIUM: [] };
    test.beforeAll(async ({ browser }) => {
      cookies.FREE = await session(browser, "FREE");
      cookies.PREMIUM = await session(browser, "PREMIUM");
    });
    async function contexte(browser: Browser, etat: Etat) {
      const c = await browser.newContext({ colorScheme: "dark" });
      if (etat !== "visiteur") await c.addCookies(cookies[etat]);
      return c;
    }
    const pagesDe = (etat: Etat) =>
      etat === "PREMIUM" ? [...PUBLIQUES, "/profil", "/favoris", ...ESPACE_PAGES] : etat === "FREE" ? [...PUBLIQUES, "/profil"] : PUBLIQUES; // /abonnement : sans bande (arbitrage du 15/11, test dédié)

    for (const etat of ETATS) {
      test(`critère 1 : même bande, même ordre, mêmes adresses sur toutes les pages ; liens du site hors de la rangée (${etat})`, async ({ browser }) => {
        test.setTimeout(240_000);
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        for (const chemin of pagesDe(etat)) {
          await page.goto(chemin);
          await pret(page, etat);
          const nav = page.getByRole("banner").getByRole("navigation", { name: N.bande.nom });
          const rubriques = nav.locator("[data-rubrique]");
          await expect(rubriques, `${chemin} (${etat})`).toHaveText(ORDRE);
          expect(await rubriques.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(HREFS);
          await expect(nav.locator("[data-separateur]")).toHaveCount(2);
          await expect(nav.getByRole("button", { name: N.bande.plus, exact: true })).toBeVisible();
          // v5 retirée : ni liens du site ni « Mon espace » dans la rangée.
          await expect(page.getByRole("banner").getByRole("navigation", { name: "Navigation principale" })).toHaveCount(0);
          await expect(page.getByRole("banner").getByRole("link", { name: N.monEspace, exact: true })).toHaveCount(0);
        }
        await c.close();
      });
    }

    test("critère 5 : chaque rubrique est un lien dans le HTML serveur du visiteur, « … » compris", async ({ request }) => {
      for (const chemin of ["/", "/vannes", "/parcours"]) {
        const html = await (await request.get(chemin)).text();
        const nav = html.slice(html.indexOf('aria-label="Rubriques"'), html.indexOf("</nav>", html.indexOf('aria-label="Rubriques"')));
        const liens = Array.from(nav.matchAll(/<a [^>]*href="([^"]+)"/g)).map((m) => m[1]);
        expect(liens, chemin).toEqual([...HREFS, "/mon-espace/questions", "/mon-espace/repliques"]);
        expect(nav, `cadenas du visiteur (${chemin})`).toContain("Aujourd’hui, rubrique Premium");
      }
    });

    // Arbitrage du 15/11 (intégration s25) : pas de bande sur /abonnement et ses sous-adresses, comme le bouton d'offre :
    // la page de conversion validée en s21 garde son pli (`conversion-v3-s21`). La rangée du haut reste ; ailleurs, la bande.
    test("arbitrage du 15/11 : bande absente de /abonnement et /abonnement/success (3 états, HTML serveur compris), présente ailleurs", async ({ browser, request }) => {
      for (const chemin of ["/abonnement", "/abonnement?plan=annual", "/abonnement/success?session_id=cs_test&returnTo=%2Fparcours"]) {
        const html = await (await request.get(chemin)).text();
        expect(html, `HTML serveur sans bande (${chemin})`).not.toContain('aria-label="Rubriques"');
        expect(html, `HTML serveur avec la rangée (${chemin})`).toContain("data-en-tete-universel");
      }
      expect(await (await request.get("/vannes")).text(), "HTML serveur de /vannes avec la bande").toContain('aria-label="Rubriques"');
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.route("**/api/stripe/status", (r) => r.fulfill({ json: { plan: "FREE" } }));
        await page.route("**/api/stripe/verify-session", (r) => r.fulfill({ status: 400, json: {} }));
        for (const largeur of [375, 1280]) {
          await page.setViewportSize({ width: largeur, height: 800 });
          // L'abonné qui ouvre /abonnement est renvoyé vers son contenu (middleware) : pour lui, /abonnement/success.
          const chemins = etat === "PREMIUM" ? ["/abonnement/success?session_id=cs_test&returnTo=%2Fparcours", "/vannes"] : ["/abonnement", "/abonnement/success?session_id=cs_test&returnTo=%2Fparcours", "/vannes"];
          for (const chemin of chemins) {
            await page.goto(chemin);
            await pret(page, etat);
            const ici = `${chemin} (${etat}, ${largeur} px)`;
            const barre = page.getByRole("banner");
            await expect(barre.getByRole("link", { name: "deviens-marrant.fr" }), `rangée du haut gardée ${ici}`).toBeVisible();
            const attendu = chemin === "/vannes" ? 1 : 0;
            await expect(barre.getByRole("navigation", { name: N.bande.nom }), `bande ${ici}`).toHaveCount(attendu);
            await expect(page.locator("[data-bande-rubriques]"), `bande ${ici}`).toHaveCount(attendu);
            if (!attendu) {
              expect(await barre.evaluate((e) => Math.round(e.getBoundingClientRect().height)), `rangée seule, 65 px ${ici}`).toBe(65);
              // Comme le site fermé : aucune réserve d'ancre posée sur la page de conversion.
              expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop), `réserve ${ici}`).toBe("auto");
            }
          }
        }
        await c.close();
      }
    });

    // Arbitrage du 15/11 : fenêtre de moins de 500 px de haut (200 % de texte sur téléphone), rangée et bande défilent avec
    // la page (plus collantes) et la réserve des ancres tombe à 0 ; au-dessus, bloc collant et réserve de 128 px. Les
    // ancres arrivent juste sous ce qui couvre le haut (réserve + `scroll-margin` de la cible) dans les deux cas.
    test("arbitrage du 15/11 : bloc d'en-tête non collant sous 500 px de haut (375 x 480, 188 x 406), collant au-dessus (375 x 812) ; ancres justes", async ({ browser }) => {
      // Visiteur : mêmes positions pour tous les comptes ; ancre mesurée sur un article (voir plus bas).
      const c = await contexte(browser, "visiteur");
      const page = await c.newPage();
      for (const [largeur, hauteur, collant] of [[375, 480, false], [188, 406, false], [375, 812, true], [1280, 500, true]] as const) {
        const ici = `(${largeur} x ${hauteur})`;
        await page.setViewportSize({ width: largeur, height: hauteur });
        await page.goto("/parcours/repartie");
        await pret(page, "visiteur");
        const bloc = page.locator("header[data-en-tete-universel]");
        // Fenêtre basse : bande masquée (ses rubriques sont dans le menu, test suivant) ; au-dessus, dans le bloc.
        if (collant) await expect(bloc.locator("[data-bande-rubriques]"), `bande dans le bloc ${ici}`).toBeVisible();
        else await expect(bloc.locator("[data-bande-rubriques]"), `bande masquée ${ici}`).toBeHidden();
        expect(await bloc.evaluate((e) => getComputedStyle(e).position), `position ${ici}`).toBe(collant ? "sticky" : "relative");
        const reserve = await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
        // s26 parcours, tour 7 ter : espace ouvert, sous 1024 px et en-tête collant, la page d'un parcours ajoute sa barre
        // compacte collée sous l'en-tête : la réserve vaut en-tête + barre (au moins 128 px). Fenêtre basse : 0, inchangé.
        const barreParcours = page.locator("[data-barre-parcours]").first();
        const avecBarre = collant && largeur < 1024 && (await barreParcours.count()) > 0 && (await barreParcours.isVisible());
        if (avecBarre) expect(parseFloat(reserve), `réserve des ancres ${ici}`).toBeGreaterThanOrEqual(128);
        else expect(reserve, `réserve des ancres ${ici}`).toBe(collant ? "128px" : "0px");
        // Défilement immédiat (sans `scroll-behavior: smooth`), puis état stable : même défilement et même bloc sur deux
        // images de suite (CI : mesure prise pendant un défilement doux ou un recalage de mise en page, 188 x 406).
        await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
        await expect
          .poll(
            () =>
              bloc.evaluate(
                (e) =>
                  new Promise<boolean>((ok) => {
                    const lire = () => `${window.scrollY} ${e.getBoundingClientRect().top} ${e.getBoundingClientRect().bottom}`;
                    const avant = lire();
                    requestAnimationFrame(() => requestAnimationFrame(() => ok(window.scrollY > 0 && lire() === avant)));
                  }),
              ),
            { message: `défilé, état stable ${ici}` },
          )
          .toBe(true);
        const haut = await bloc.evaluate((e) => e.getBoundingClientRect());
        if (collant) expect(haut.top, `bloc resté en haut ${ici}`).toBe(0);
        else expect(haut.bottom, `bloc parti avec la page ${ici}`).toBeLessThanOrEqual(0);
        // Ancre : un intertitre d'article (page sans recalage d'arrivée, contrairement au parcours) arrive à
        // (réserve + scroll-margin) du haut, jamais sous le bloc collant.
        const ARTICLE = "/blog/comment-devenir-drole";
        await page.goto(ARTICLE);
        const id = await page.locator("main h2[id]").nth(2).getAttribute("id");
        await page.goto(`${ARTICLE}#${id}`);
        const mesure = () => page.locator(`[id="${id}"]`).evaluate((e) => ({ top: e.getBoundingClientRect().top, marge: parseFloat(getComputedStyle(e).scrollMarginTop) || 0, bloc: document.querySelector("header")!.getBoundingClientRect().bottom }));
        // Défilement doux (`scroll-behavior: smooth`) : attendre la position finale.
        await expect
          // s26 parcours, tour 7 ter : la réserve est relue SUR L'ARTICLE (celle de la page d'un parcours inclut sa barre).
          .poll(async () => { const x = await mesure(); const r = parseFloat(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)); return Math.abs(x.top - (r + x.marge)); }, { message: `intertitre à réserve + marge du haut ${ici}`, timeout: 10_000 })
          .toBeLessThanOrEqual(2);
        const m = await mesure();
        noter(`arbitrage 15/11 ; ancre ; ${ici} ; ${JSON.stringify(m)}`);
        if (collant) expect(m.top, `intertitre sous le bloc collant ${ici}`).toBeGreaterThanOrEqual(m.bloc);
        else expect(m.top, `intertitre dans la fenêtre ${ici}`).toBeGreaterThanOrEqual(0);
      }
      await c.close();
    });

    // Arbitrage du 15/11 (200 % de texte) : sous 500 px de haut, bande MASQUÉE et ses rubriques dans le menu (même ordre,
    // cadenas du non-abonné, page allumée), bouton Menu visible à toutes les largeurs et pour les 3 états (visiteur
    // compris au-delà de 520 px) ; chaque rubrique en 2 touchers ; Échap ferme et rend le focus au bouton. Au-dessus de
    // 500 px (375 x 812, 1280 x 500), la bande est là et le menu n'a pas de rubriques.
    test("arbitrage du 15/11 : bande masquée et rubriques dans le Menu à 375 x 480 et 1280 x 480 ; bande là à 375 x 812 et 1280 x 500", async ({ browser }) => {
      const ATTENDUES = [...ORDRE, "Mes questions", "Mes répliques"];
      const ADRESSES = [...HREFS, "/mon-espace/questions", "/mon-espace/repliques"];
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const [largeur, hauteur] of [[375, 480], [1280, 480], [375, 812], [1280, 500]] as const) {
          const basse = hauteur < 500;
          const ici = `(${etat}, ${largeur} x ${hauteur})`;
          await page.setViewportSize({ width: largeur, height: hauteur });
          await page.goto("/vannes");
          await pret(page, etat);
          const barre = page.getByRole("banner");
          const bouton = barre.getByRole("button", { name: "Menu", exact: true });
          if (!basse) {
            await expect(barre.getByRole("navigation", { name: N.bande.nom }), `bande visible ${ici}`).toBeVisible();
            if (largeur >= 768) await expect(bouton, `pas de Menu ${ici}`).toBeHidden();
            else {
              await bouton.click();
              await expect(page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("list", { name: N.bande.nom }), `pas de rubriques dans le menu ${ici}`).toBeHidden();
              await page.keyboard.press("Escape");
            }
            continue;
          }
          await expect(page.locator("[data-bande-rubriques]"), `bande masquée ${ici}`).toBeHidden();
          await expect(barre.getByRole("navigation", { name: N.bande.nom }), `bande hors de l'arbre ${ici}`).toHaveCount(0);
          await expect(bouton, `Menu visible ${ici}`).toBeVisible();
          // 1er toucher : Menu.
          await bouton.click();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          const liste = menu.getByRole("list", { name: N.bande.nom });
          await expect(liste, `rubriques dans le menu ${ici}`).toBeVisible();
          const liens = liste.getByRole("link");
          await expect(liens, `même ordre ${ici}`).toHaveText(ATTENDUES);
          expect(await liens.evaluateAll((as) => as.map((a) => a.getAttribute("href"))), `mêmes adresses ${ici}`).toEqual(ADRESSES);
          const noms = await liens.evaluateAll((as) => as.map((a) => [a.getAttribute("aria-label"), a.querySelector("svg") !== null]));
          noms.forEach(([nom, cadenas], i) => {
            const premium = etat !== "PREMIUM" && (i < 5 || i === 10 || i > 11);
            expect([ATTENDUES[i], nom, cadenas], `cadenas ${ici}`).toEqual([ATTENDUES[i], premium ? N.bande.premium(ATTENDUES[i]) : null, premium]);
          });
          await expect(liste.locator("[aria-current='page']"), `page allumée ${ici}`).toHaveText("Vannes");
          // Dès 768 px, recherche, offre et compte restent dans la rangée : le menu n'a que les rubriques.
          if (largeur >= 768) {
            await expect(menu.getByRole("link"), `menu réduit aux rubriques ${ici}`).toHaveCount(ATTENDUES.length);
            await expect(menu.getByRole("button"), `aucune action en double ${ici}`).toHaveCount(0);
          }
          // Échap ferme et rend le focus au bouton.
          await page.keyboard.press("Escape");
          await expect(menu).toHaveCount(0);
          await expect(bouton).toBeFocused();
          // 2e toucher : la dernière rubrique (« Mes répliques »), atteinte et ouverte.
          await bouton.click();
          const derniere = page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("list", { name: N.bande.nom }).getByRole("link").last();
          await derniere.scrollIntoViewIfNeeded();
          await Promise.all([page.waitForURL(/\/mon-espace\/repliques$/), derniere.click()]);
        }
        await c.close();
      }
    });

    test("§2 : cadenas de 14 px et « rubrique Premium » pour le non-abonné, aucun pour l'abonné ; mêmes couleurs que le texte (AA)", async ({ browser }) => {
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/vannes");
        await pret(page, etat);
        const m = await page.locator("[data-rubrique]").evaluateAll((as) =>
          as.map((a) => {
            const svg = a.querySelector("svg");
            return { nom: a.getAttribute("aria-label") ?? a.textContent!.trim(), svg: svg ? [svg.getBoundingClientRect().width, getComputedStyle(svg).color] : null, h: a.getBoundingClientRect().height };
          }),
        );
        noter(`cadenas ; ${etat} ; ${JSON.stringify(m)}`);
        m.forEach((r, i) => {
          const verrou = etat !== "PREMIUM" && (i < 5 || i === 10);
          expect(r.nom, `${ORDRE[i]} (${etat})`).toBe(verrou ? `${ORDRE[i]}, rubrique Premium` : ORDRE[i]);
          // Spec v6 §2 : cadenas en `text-text-secondary` (#B3B3B3), la couleur du libellé (v6 tour 1, lot 3 ; avant
          // `text-text-muted`, plus bas que le texte).
          expect(r.svg, `${ORDRE[i]} (${etat})`).toEqual(verrou ? [14, "rgb(179, 179, 179)"] : null);
          expect(r.h, "cible de 44 px").toBe(44);
        });
        const plus = page.getByRole("button", { name: N.bande.plus, exact: true });
        await plus.click();
        const liste = page.getByRole("list", { name: N.bande.listePlus });
        await expect(liste.getByRole("link")).toHaveText(["Mes questions", "Mes répliques"]);
        expect(await liste.locator("svg").count(), `cadenas de « … » (${etat})`).toBe(etat === "PREMIUM" ? 0 : 2);
        await c.close();
      }
    });

    test("§4 : rubrique allumée selon l'adresse (blanc, pastille, soulignement violet de 3 px), « … » sur Mes répliques, aucune sur l'accueil", async ({ browser }) => {
      const cas: Record<Etat, [string, string | null][]> = {
        visiteur: [["/", null], ["/glossaire", null], ["/parcours", "Parcours"], ["/parcours/repartie", "Parcours"], ["/vannes", "Vannes"], ["/conseils", "Conseils"], ["/videos", "Vidéos"], ["/blog", "Articles"], ["/lettre", "La lettre"], ["/carnet", "Carnet"]],
        FREE: [["/", null], ["/profil", null], ["/vannes", "Vannes"], ["/carnet", "Carnet"]],
        PREMIUM: [
          ["/mon-espace", "Aujourd’hui"], ["/mon-espace/quoi-repondre", "Quoi répondre"], ["/mon-espace/fiche/situation/coloc-la-poele", "Quoi répondre"],
          ["/mon-espace/bibliotheque", "Bibliothèque"], ["/mon-espace/s-entrainer", "S’entraîner"], ["/mon-espace/fiche/jeu/quelle-replique-1", "S’entraîner"],
          ["/mon-espace/fiche/bilan/bilan-repartie", "Parcours"], ["/mon-espace/lettres", "La lettre"], ["/favoris", "Favoris"], ["/carnet", "Carnet"],
          ["/mon-espace/questions", "…"], ["/mon-espace/repliques", "…"], ["/profil", null], ["/", null],
        ],
      };
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        await page.setViewportSize({ width: 1280, height: 900 });
        for (const [chemin, attendu] of cas[etat]) {
          await page.goto(chemin);
          await pret(page, etat);
          const allumes = await page.locator("[data-rubrique][aria-current='page']").allTextContents();
          const plus = page.getByRole("button", { name: N.bande.plus, exact: true });
          expect(allumes, `${chemin} (${etat})`).toEqual(attendu && attendu !== "…" ? [attendu] : []);
          if (attendu === "…") await expect(plus).toHaveAttribute("aria-current", "true");
          else await expect(plus).not.toHaveAttribute("aria-current");
          const actif = page.locator("[data-rubrique][aria-current='page'], [aria-label='Plus'][aria-current]");
          if (attendu) {
            const s = await actif.evaluate((a) => ({ texte: getComputedStyle(a).color, pastille: getComputedStyle(a, "::before").backgroundColor, trait: getComputedStyle(a, "::after").backgroundColor, h: getComputedStyle(a, "::after").height }));
            expect(s, `${chemin} (${etat})`).toEqual({ texte: "rgb(255, 255, 255)", pastille: "rgb(42, 42, 42)", trait: "rgb(139, 92, 246)", h: "3px" });
          }
        }
        await c.close();
      }
    });

    // Consigne du 15/11 et relecture design D tour 4 : 3 états, 375 et 768 px, rubrique active au début, au milieu et à la
    // fin de la bande. Active entière hors fondu ; un libellé coupé par un bord a sa partie visible sous le fondu ; tant
    // qu'il reste du contenu à droite, un libellé entamé sous le fondu (jamais un vide avant « … ») ; fondu gauche
    // seulement si défilée ; aucune accroche. Seule exception admise : la rubrique active en tête de bande (aucune autre
    // position ne la garde entière), cas de la maquette D validée (« Quoi répondr »).
    test("§3 : défilement à 375 et 768 px, active entière, indice de suite, aucun libellé coupé hors fondu (3 états, début, milieu, fin)", async ({ browser }) => {
      test.setTimeout(240_000);
      const cas: Record<Etat, string[]> = { visiteur: ["/parcours", "/conseils", "/carnet", "/"], FREE: ["/parcours", "/vannes", "/carnet"], PREMIUM: ["/mon-espace", "/mon-espace/quoi-repondre", "/conseils", "/carnet"] };
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 768]) {
          await page.setViewportSize({ width: largeur, height: 812 });
          for (const chemin of cas[etat]) {
            await page.goto(chemin);
            await pret(page, etat);
            const b = await bande(page);
            const ici = `(${etat}, ${chemin}, ${largeur} px)`;
            noter(`défilement ${ici} ; scroll=${b.scroll}/${b.max} ; fondus=${b.fg},${b.fd} ; ${b.chips.filter((x) => x.r > 0 && x.l < b.vue).map((x) => `${x.nom}[${Math.round(x.l)},${Math.round(x.r)}]`).join(" ")}`);
            expect(b.max, `la bande déborde ${ici}`).toBeGreaterThan(0);
            expect(b.accroche, `aucune accroche ${ici}`).toBe("none");
            expect(b.masque, `fondu présent ${ici}`).not.toBe("none");
            expect(b.fg > 0, `fondu gauche seulement si défilée ${ici}`).toBe(b.scroll > 0.5);
            expect(b.fd > 0, `fondu droit tant qu'il reste du contenu ${ici}`).toBe(b.scroll < b.max - 0.5);
            const actif = b.chips.find((x) => x.actif);
            if (actif) {
              expect(actif.l, `active entière à gauche ${ici}`).toBeGreaterThanOrEqual(-0.5);
              expect(actif.tl, `active hors du fondu gauche ${ici}`).toBeGreaterThanOrEqual(b.fg - 0.5);
              expect(actif.tr, `active hors du fondu droit ${ici}`).toBeLessThanOrEqual(b.vue - b.fd + 0.5);
            } else expect(b.scroll, `aucune rubrique : début de bande ${ici}`).toBe(0);
            // Bornes : rubrique active en tête (défilement 0) ou en fin de bande (défilement maximal), seule position qui la
            // garde entière ; le libellé coupé de l'autre bord peut dépasser le fondu le plus long (cas de la maquette D).
            const borne = !actif || actif.nom === b.chips[0].nom || actif.nom === b.chips[b.chips.length - 1].nom;
            const droite = b.chips.find((x) => x.l < b.vue && x.r > b.vue);
            if (b.fd > 0) {
              expect(droite, `un libellé entamé à droite, jamais un vide ${ici}`).toBeTruthy();
              expect(droite!.tl, `lettres visibles sous le fondu droit ${ici}`).toBeLessThanOrEqual(b.vue - 6);
              if (!borne) expect(droite!.tl, `partie visible sous le fondu droit ${ici}`).toBeGreaterThanOrEqual(b.vue - b.fd - 4);
            }
            const gauche = b.chips.find((x) => x.l < 0 && x.r > 0);
            if (gauche && b.fg > 0 && !borne) expect(gauche.tr, `partie visible sous le fondu gauche ${ici}`).toBeLessThanOrEqual(b.fg + 4);
          }
        }
        await c.close();
      }
    });

    test("§3 : défilement au doigt et à la molette, fondus mis à jour, séparateurs jamais masqués", async ({ browser }) => {
      const c = await contexte(browser, "visiteur");
      const page = await c.newPage();
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      await pret(page, "visiteur");
      const defile = page.locator("[data-defilement]");
      expect((await bande(page)).fg).toBe(0);
      await defile.hover();
      await page.mouse.wheel(300, 0);
      await expect.poll(async () => (await bande(page)).fg).toBeGreaterThanOrEqual(16);
      await defile.evaluate((d) => d.scrollTo({ left: d.scrollWidth, behavior: "instant" }));
      await expect.poll(async () => (await bande(page)).fd).toBe(0);
      expect(await page.locator("[data-separateur]").evaluateAll((s) => s.map((x) => getComputedStyle(x).visibility))).toEqual(["visible", "visible"]);
      await c.close();
    });

    test("« … » : liste sous le filet (8 px), bord droit sur celui de la bande, Échap, clic dehors, flèches", async ({ browser }) => {
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 768, 1280, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          const plus = page.getByRole("button", { name: N.bande.plus, exact: true });
          const liste = page.getByRole("list", { name: N.bande.listePlus });
          await plus.click();
          await expect(liste).toBeVisible();
          const m = await liste.evaluate((l) => ({
            haut: l.getBoundingClientRect().top - document.querySelector("header")!.getBoundingClientRect().bottom,
            droite: l.getBoundingClientRect().right - l.parentElement!.getBoundingClientRect().right,
            lignes: Array.from(l.querySelectorAll("a")).map((a) => a.getBoundingClientRect().height),
          }));
          const ici = `(${etat}, ${largeur} px)`;
          noter(`« … » ${ici} ; ${JSON.stringify(m)}`);
          expect(Math.abs(m.haut - 8), `8 px sous le filet ${ici}`).toBeLessThanOrEqual(1);
          expect(Math.abs(m.droite), `bord droit sur la bande ${ici}`).toBeLessThanOrEqual(0.5);
          expect(m.lignes).toEqual([44, 44]);
          await page.keyboard.press("Escape");
          await expect(liste).toBeHidden();
          await expect(plus).toBeFocused();
          await plus.click();
          await page.mouse.click(5, 600);
          await expect(liste, `clic dehors ${ici}`).toBeHidden();
          await plus.focus();
          await page.keyboard.press("ArrowDown");
          await expect(liste.getByRole("link").first()).toBeFocused();
          await page.keyboard.press("ArrowDown");
          await expect(liste.getByRole("link").last()).toBeFocused();
          await page.keyboard.press("Escape");
        }
        await c.close();
      }
    });

    // Consigne du 15/11 (relecture design D tour 4, faute légère) : compte, cloche, Menu et « … » sur la même grille.
    test("actions de droite : zones de 44 px, centre de la dernière icône sur celui de « … » (±1 px), 375 à 1920 px", async ({ browser }) => {
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 440, 640, 768, 1024, 1280, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/conseils");
          await pret(page, etat);
          const m = await page.evaluate(() => {
            const vis = (e: Element) => e.getBoundingClientRect().width > 0;
            const rangee = document.querySelector("header > div")!;
            const icones = Array.from(rangee.querySelectorAll("button")).filter(vis).map((b) => { const r = b.getBoundingClientRect(); return { nom: b.getAttribute("aria-label"), l: r.width, h: r.height, c: (r.left + r.right) / 2, d: r.right }; });
            const derniers = Array.from(rangee.querySelectorAll("a, button")).filter(vis);
            const dernier = derniers[derniers.length - 1].getBoundingClientRect();
            const plus = document.querySelector("[aria-label='Plus']")!.getBoundingClientRect();
            return { icones, dernierD: dernier.right, plusC: (plus.left + plus.right) / 2, plusD: plus.right, plusL: plus.width, plusH: plus.height };
          });
          const ici = `(${etat}, ${largeur} px)`;
          noter(`alignement ${ici} ; ${JSON.stringify(m)}`);
          expect([m.plusL, m.plusH], `« … » 44 x 44 ${ici}`).toEqual([44, 44]);
          for (const i of m.icones) expect([i.nom, i.l, i.h], ici).toEqual([i.nom, 44, 44]);
          const derniere = m.icones[m.icones.length - 1];
          if (derniere && Math.abs(derniere.d - m.dernierD) < 0.5) expect(Math.abs(derniere.c - m.plusC), `centres alignés ${ici}`).toBeLessThanOrEqual(1);
          expect(Math.abs(m.dernierD - m.plusD), `même bord droit ${ici}`).toBeLessThanOrEqual(1);
        }
        await c.close();
      }
    });

    test("critère 3 : bloc collant (rangée et bande), ancres non masquées (scroll-padding)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const largeur of [375, 1280]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        await page.goto("/conseils");
        await pret(page, "PREMIUM");
        await page.mouse.wheel(0, 2500);
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
        const m = await page.evaluate(() => ({ haut: document.querySelector("header")!.getBoundingClientRect().top, h: document.querySelector("header")!.getBoundingClientRect().height, bande: document.querySelector("[data-bande-rubriques]")!.getBoundingClientRect().bottom, pad: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) }));
        noter(`collant ; ${largeur} px ; ${JSON.stringify(m)}`);
        expect(m.haut).toBe(0);
        expect(m.h, `bloc de 117 px (375) ou 121 px`).toBe(largeur < 768 ? 117 : 121);
        expect(m.bande).toBeLessThanOrEqual(m.h);
        expect(m.pad, "scroll-padding au-dessus du bloc").toBeGreaterThanOrEqual(m.h);
      }
      await c.close();
    });

    test("§3 : menu mobile réduit aux actions et à la recherche ; pas de bouton Menu dès 768 px (visiteur : dès 520 px)", async ({ browser }) => {
      // s26 bouton Tout ouvrir : nom accessible du bouton d'offre en régime ouvert.
      const attendu: Record<Etat, string[]> = { visiteur: ["Tout ouvrir, 1,99", "Connexion"], FREE: ["Tout ouvrir, 1,99", "Mon profil"], PREMIUM: ["Mon profil"] };
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [320, 375, 520, 640, 768, 1024]) {
          await page.setViewportSize({ width: largeur, height: 812 });
          await page.goto("/conseils");
          await pret(page, etat);
          const bouton = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
          const ici = `(${etat}, ${largeur} px)`;
          if (largeur >= 768 || (etat === "visiteur" && largeur >= 520)) {
            await expect(bouton, ici).toBeHidden();
            continue;
          }
          await bouton.click();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          const liens = (await menu.getByRole("link").filter({ visible: true }).evaluateAll((as) => as.map((a) => (a.getAttribute("aria-label") ?? a.textContent ?? "").trim()))).map((t) => t.replace(/ €.*$/, "").replace(/\u00a0/g, " "));
          noter(`menu mobile ${ici} ; ${liens.join(" | ")}`);
          expect(liens.map((t) => t.slice(0, 13)), ici).toEqual(attendu[etat].map((t) => t.slice(0, 13)));
          await expect(menu.getByRole("combobox"), `recherche dans le menu sous 440 px ${ici}`).toHaveCount(largeur < 440 ? 1 : 0);
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const petites = await menu.locator("a, button").filter({ visible: true }).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)).filter((h) => h < 44));
          expect(petites, `cibles de 44 px ${ici}`).toEqual([]);
          await page.keyboard.press("Escape");
          await expect(menu).toHaveCount(0);
          await expect(bouton).toBeFocused();
        }
        await c.close();
      }
    });

    // s25 v6 tour 1 (relectures en-tête D2 et F2) : suggestions de la recherche du menu dans le flux du menu (375, 320 px),
    // jamais tranchées par son bas : 6 puces entières dans la vue du menu (après défilement s'il le faut), au-dessus des
    // actions, panneau englobant (bord bas sous la dernière puce).
    test("v6 tour 1 : suggestions de la recherche du menu entières, dans le flux, avant les actions (375 et 320 px, 3 états)", async ({ browser }) => {
      for (const etat of ETATS) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 320]) {
          const ici = `(${etat}, ${largeur} px)`;
          await page.setViewportSize({ width: largeur, height: 812 });
          await page.goto("/conseils");
          await pret(page, etat);
          await page.getByRole("banner").getByRole("button", { name: "Menu", exact: true }).click();
          const menu = page.getByRole("navigation", { name: "Navigation mobile" });
          await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const champ = menu.getByRole("combobox");
          await champ.focus();
          await page.keyboard.press("ArrowDown");
          const liste = menu.getByRole("listbox", { name: "Suggestions de recherche" });
          await expect(liste, ici).toBeVisible();
          await liste.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          expect(await liste.evaluate((el) => getComputedStyle(el).position), `liste dans le flux ${ici}`).not.toBe("absolute");
          const options = liste.getByRole("option");
          await expect(options, ici).toHaveCount(6);
          for (const o of await options.all()) {
            await o.evaluate((el) => el.scrollIntoView({ block: "nearest" }));
            const m = await o.evaluate((el) => {
              const nav = el.closest("nav")!.getBoundingClientRect();
              const r = el.getBoundingClientRect();
              const panneau = el.closest("[role=listbox]")!.getBoundingClientRect();
              return { haut: r.top - nav.top, bas: nav.bottom - r.bottom, gauche: r.left - panneau.left, droite: panneau.right - r.right, sousPanneau: panneau.bottom - r.bottom, h: r.height };
            });
            noter(`v6 t1 ; suggestions du menu ; ${ici} ; ${JSON.stringify(m)}`);
            expect(m.haut, `puce sous le haut du menu ${ici}`).toBeGreaterThanOrEqual(-0.5);
            expect(m.bas, `puce au-dessus du bas du menu ${ici}`).toBeGreaterThanOrEqual(-0.5);
            expect(Math.min(m.gauche, m.droite), `puce dans le panneau ${ici}`).toBeGreaterThanOrEqual(0);
            expect(m.sousPanneau, `bord bas du panneau sous la puce ${ici}`).toBeGreaterThan(0);
            expect(m.h, `puce de 44 px ${ici}`).toBeGreaterThanOrEqual(44);
          }
          // Actions (offre, Connexion, compte) sous la liste, sans chevauchement.
          const basListe = await liste.evaluate((el) => el.getBoundingClientRect().bottom);
          const hautsActions = await menu.locator("a, button").filter({ visible: true }).evaluateAll((els, b) =>
            els.filter((e) => !e.closest("[role=listbox]") && !e.closest("[data-rubriques-menu]") && e.compareDocumentPosition(document.querySelector("[role=listbox]")!) & Node.DOCUMENT_POSITION_PRECEDING).map((e) => e.getBoundingClientRect().top - b),
          basListe);
          for (const h of hautsActions) expect(h, `action sous la liste ${ici}`).toBeGreaterThanOrEqual(-0.5);
          await page.keyboard.press("Escape");
        }
        await c.close();
      }
    });

    test("fil d'Ariane visible retiré au premier niveau, gardé sur les pages de détail ; BreadcrumbList partout", async ({ browser, request }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 1280, height: 900 });
      for (const chemin of ["/conseils", "/videos", "/blog", "/parcours", "/carnet", "/glossaire", "/favoris"]) {
        await page.goto(chemin);
        await pret(page, "PREMIUM");
        await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }), chemin).toHaveCount(0);
        if (chemin !== "/favoris" && chemin !== "/carnet") {
          expect(await (await request.get(chemin)).text(), `BreadcrumbList gardé (${chemin})`).toContain('"BreadcrumbList"');
        }
      }
      await page.goto("/conseils");
      const fiche = await page.locator("main a[href^='/conseils/']").first().getAttribute("href");
      await page.goto(fiche!);
      await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }), `détail ${fiche}`).toBeVisible();
      const mois = await page.goto("/carnet").then(() => page.locator("main a[href^='/carnet/']").first().getAttribute("href"));
      if (mois) {
        await page.goto(mois);
        await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }), `détail ${mois}`).toBeVisible();
      }
      await c.close();
    });

    test("§4 : espace sans index « Dans ton espace » ni « Retour : Mon espace » ; retours des pages de détail gardés", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/mon-espace");
      await pret(page, "PREMIUM");
      await expect(page.locator("[data-index-espace]")).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Dans ton espace" })).toHaveCount(0);
      for (const chemin of ["/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/mon-espace/questions", "/mon-espace/repliques"]) {
        await page.goto(chemin);
        await expect(page.locator("main [data-lien-retour]"), chemin).toHaveCount(0);
      }
      for (const [chemin, retour] of [["/mon-espace/fiche/situation/coloc-la-poele", "Quoi répondre"]] as const) {
        await page.goto(chemin);
        await expect(page.locator("main [data-lien-retour]"), chemin).toHaveText(new RegExp(`Retour\\s:\\s${retour}`));
      }
      await c.close();
    });

    // Intégration s25 (lots A et B) : la v5 réservait au-dessus du titre la place du « Retour : Mon espace » (ou du fil
    // d'Ariane) pour que tous les H1 soient à la même hauteur ; la v6 retire retour, fil d'Ariane et place réservée sur
    // les rubriques de premier niveau. Équivalent v6 : leurs H1 restent alignés entre eux, pour l'abonné (rubriques) et
    // pour le visiteur (aperçus), à 375 et 1280 px. Visiteur, hors comparaison : /lettre (page d'inscription, `py-10`)
    // a son propre en-tête de page, inchangé par la v6 (mesuré : +40 px) ; abonné, toutes les rubriques sont comparées.
    // v6 tour 3 (arbitrage 1) : sur /carnet, le sur-titre du mois est AU-DESSUS du H1 pour tous les comptes (le tour 2
    // le passait sous le titre chez l'abonné) ; c'est lui, première ligne de l'en-tête de page, qui s'aligne sur le H1
    // des autres rubriques (le H1 est 28 px plus bas, hauteur du sur-titre et de son espace). s26, Thomas 19/11 : sur-titre
    // retiré, le H1 de /carnet est la première ligne de l'en-tête.
    test("§4 : H1 des rubriques de premier niveau à la même hauteur entre elles (abonné, visiteur ; 375 et 1280 px)", async ({ browser }) => {
      // s26 (Favoris, `docs/ux/favoris-carnet-s26.md` §1.2) : l'aperçu de /favoris reprend le même hero (`HeroApercu`,
      // pastille « Premium » au-dessus du H1 dès 768 px) : même règle (mesuré sur ce0c2ad7 : H1 44 px plus bas).
      // s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1 et §4) : les aperçus de Mes questions et Mes répliques
      // passent à `ApercuVerrouille` (pastille « Premium » au-dessus du H1) : même règle (mesuré sur 7d860d96 : H1 44 px plus bas).
      const APERCUS_EN_LARGEUR = ["/mon-espace", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/favoris", "/mon-espace/questions", "/mon-espace/repliques"];
      const PREMIER_NIVEAU = ["/mon-espace", "/parcours", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/vannes", "/conseils", "/videos", "/blog", "/lettre", "/favoris", "/carnet", "/mon-espace/questions", "/mon-espace/repliques"];
      for (const etat of ["PREMIUM", "visiteur"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [375, 1280]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          const hauts: Record<string, number> = {};
          for (const chemin of PREMIER_NIVEAU) {
            await page.goto(chemin);
            await pret(page, etat);
            // s26 liste et détail, tour 1 : Quoi répondre de l'abonné rend deux H1, un seul affiché par largeur (page liste
            // sous 1024, titre de la fiche du panneau dès 1024) : le H1 mesuré est le H1 VISIBLE.
            const h1 = page.locator("main h1:visible").first();
            await expect(h1, `${chemin} (${etat}, ${largeur} px)`).toBeVisible();
            // Refonte s25 (spec UX §2.1) : l'aperçu d'« Aujourd'hui » porte la pastille « Premium » AU-DESSUS du H1 ; comme
            // le sur-titre de /carnet, c'est elle, première ligne de l'en-tête, qui s'aligne sur les autres rubriques.
            // v7 tour 8 (point 4) : sous 768 px, la pastille passe sur la ligne du H1, à droite : le H1 redevient la
            // première ligne de l'en-tête (test adapté au tour 9).
            // s26 : les aperçus de Quoi répondre, Bibliothèque et S'entraîner reprennent ce squelette (`ApercuVerrouille`,
            // même pastille au-dessus du H1 dès 768 px) : même règle (mesuré au tour 1 : H1 44 px plus bas, pastille alignée).
            // s26, Thomas 19/11 : le sur-titre de /carnet est retiré (il répétait le H1) ; son H1 ouvre l'en-tête.
            // s26 liste et détail, tour 1 : dès 1024, l'abonné de Quoi répondre n'a plus de H1 de page au-dessus de la
            // grille (spec design §1) : son H1 est celui de la fiche, DANS la carte A (24 px de marge et le pas de ligne de
            // base avec le titre de la liste), il ne peut pas être à la hauteur des autres H1. Ce qui est mesuré à la place :
            // le bord haut de la carte de liste (et celui de la fiche, à 0 px, `espace-liste-detail-s26.spec.ts`), première
            // ligne de la page, aligné sur le H1 des autres rubriques.
            const tete =
              APERCUS_EN_LARGEUR.includes(chemin) && etat === "visiteur" && largeur >= 768
                ? page.locator("[data-apercu-hero] [data-badge-premium]")
                : chemin === "/mon-espace/quoi-repondre" && etat === "PREMIUM" && largeur >= 1024
                  ? page.locator("[data-colonne-liste]")
                  : h1;
            await expect(tete, `en-tête de ${chemin} (${etat}, ${largeur} px)`).toBeVisible();
            hauts[chemin] = await tete.evaluate((e) => Math.round((e.getBoundingClientRect().top + window.scrollY) * 10) / 10);
          }
          noter(`§4 ; H1 ; ${etat} ; ${largeur} px ; ${JSON.stringify(hauts)}`);
          const reference = hauts["/mon-espace"];
          for (const [chemin, haut] of Object.entries(hauts)) {
            if (etat === "visiteur" && chemin === "/lettre") continue;
            expect(Math.abs(haut - reference), `H1 de ${chemin} à la hauteur du H1 d'Aujourd'hui (${etat}, ${largeur} px)`).toBeLessThanOrEqual(1);
          }
        }
        await c.close();
      }
    });

    test("critère 6 : clavier dans la bande, anneau `accent-link` intérieur de 2 px, rubrique amenée dans la vue (375 px)", async ({ browser }) => {
      const c = await contexte(browser, "visiteur");
      const page = await c.newPage();
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      await pret(page, "visiteur");
      const carnet = page.locator("[data-rubrique='carnet']");
      await page.getByRole("banner").getByRole("link").first().focus();
      await tabJusqua(page, carnet);
      const a = await carnet.evaluate(anneaux);
      expect(a.map((x) => [x.couleur, x.epaisseur, x.inset])).toEqual([[LIEN, 2, true]]);
      await expect(carnet).toBeInViewport({ ratio: 1 });
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: N.bande.plus, exact: true })).toBeFocused();
      await c.close();
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
      // §3 : rythme de l'espace (H1 30/36 px, 24 px d'écart dans « Aujourd'hui »). v6 tour 1 (point 4) : la grille de
      // 2 colonnes devient une pile (action du jour en pleine coque, `flex-col gap-6`) puis les secondaires côte à côte
      // (`md:grid-cols-2 gap-6`) : même écart de 24 px, mesuré entre éléments et entre colonnes.
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/mon-espace");
      const grille = page.locator("[data-aujourdhui-grille]");
      // Refonte s25 (spec design §5.1) : une seule grille de 12 colonnes ; même règle de 24 px, mesurée entre rangées
      // (éléments l'un sous l'autre) et entre colonnes (éléments côte à côte sur une rangée).
      const ecarts = await grille.evaluate((g) => {
        const enfants = Array.from(g.children).map((e) => e.getBoundingClientRect());
        const entre: number[] = [];
        const entreColonnes: number[] = [];
        enfants.slice(1).forEach((r, i) => {
          const p = enfants[i];
          if (Math.round(r.top) === Math.round(p.top)) entreColonnes.push(Math.round(r.left - p.right));
          else entre.push(Math.round(r.top - p.bottom));
        });
        return { rangee: getComputedStyle(g).rowGap, colonnes: getComputedStyle(g).columnGap, entre, entreColonnes };
      });
      noter(`critère 4 ; écarts d'Aujourd'hui ; ${JSON.stringify(ecarts)}`);
      expect(ecarts.rangee, "écart entre les éléments d'Aujourd'hui").toBe("24px");
      expect(ecarts.colonnes, "écart entre les colonnes d'Aujourd'hui").toBe("24px");
      for (const e of ecarts.entre) expect(e, "24 px entre les rangées d'Aujourd'hui").toBe(24);
      for (const e of ecarts.entreColonnes) expect(e, "24 px entre les éléments côte à côte").toBe(24);
      // Échelle s25 (`docs/design/typo-harmonie-espace-s25.md`, retour de Thomas du 16/11) : H1 en `TITRE_PAGE`, 30 px dès 1024.
      expect(await page.locator("main h1").first().evaluate((h) => getComputedStyle(h).fontSize)).toBe("30px");
      await c.close();
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

    // s25 tour 6 et 7 (relecture ux, critère 7), v6 : la bande fait partie de l'en-tête, le tour du focus la traverse.
    test("tour 6 et 7 : focus enfermé dans l'en-tête (bande comprise), menu ouvert (375 et 640 px ; visiteur 375)", async ({ browser }) => {
      for (const etat of ["PREMIUM", "FREE", "visiteur"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of etat === "visiteur" ? [375] : [375, 640]) {
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

    // s25 tour 7 (relecture design F1 et F2) : un seul anneau dans l'en-tête, 2 px `accent-link` (#A78BFA), arrondi ;
    // lignes du menu du compte au clavier (ouverture, flèches, Tab), aucun anneau au survol à la souris.
    test("tour 7 : un seul anneau (bande, menu mobile, cloche, compte), menu du compte au clavier", async ({ browser }) => {
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
      // Bande : une rubrique (départ du logo) ; v6, anneau intérieur (la bande défile, l'extérieur serait coupé).
      await barre.getByRole("link").first().focus();
      await tabJusqua(page, barre.locator("[data-rubrique='vannes']"));
      const lienBarre = await verifier("bande, rubrique");
      expect(lienBarre.inset).toBe(true);
      // Cloche : bouton, puis « Fermer » et une ligne du panneau.
      const cloche = barre.getByRole("button", { name: /^Notifications/ });
      // v6 : la bande suit la rangée dans le DOM ; retour au logo pour atteindre la cloche au clavier.
      await barre.getByRole("link").first().focus();
      await tabJusqua(page, cloche);
      await verifier("cloche, bouton");
      await page.keyboard.press("Enter");
      const panneau = page.getByRole("dialog");
      await expect(panneau).toBeVisible();
      await verifier("cloche, Fermer");
      await page.keyboard.press("Tab");
      if (await panneau.getByRole("link").count()) {
        // Tour 7 bis : lignes de la cloche en `rounded-lg` comme le reste ; anneau extérieur non coupé par le panneau.
        const ligne = await verifier("cloche, ligne");
        expect(ligne.rayon, "ligne de la cloche arrondie comme les liens de la barre").toBe(lienBarre.rayon);
        const air = await page.locator(":focus").evaluate((el) => {
          const p = el.closest("[role='dialog']") as HTMLElement;
          const r = el.getBoundingClientRect();
          const b = p.getBoundingClientRect();
          const haut = b.top + p.clientTop;
          const gauche = b.left + p.clientLeft;
          return { gauche: r.left - gauche, droite: gauche + p.clientWidth - r.right, haut: r.top - haut, bas: haut + p.clientHeight - r.bottom };
        });
        noter(`cloche ; ligne en focus ; air jusqu'au bord intérieur du panneau ; ${JSON.stringify(air)}`);
        for (const [cote, v] of Object.entries(air)) expect(v, `anneau de 2 px non coupé (${cote})`).toBeGreaterThanOrEqual(2);
      }
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
      await tabJusqua(page, menu.getByRole("link", { name: "Mon profil", exact: true }));
      const ligne = await verifier("menu, Mon profil");
      expect(ligne.inset, "anneau intérieur dans le menu").toBe(true);
      expect(ligne.rayon, "ligne du menu arrondie au focus, comme les rubriques de la bande").toBe(lienBarre.rayon);
      await c.close();
    });

    // s25 tour 8 (design 5 et 7) : lignes du menu du compte au rayon des lignes de la cloche et du menu mobile, la même
    // classe `rounded-lg` (12 px dans `tailwind.config.ts`), ligne en cours sous l'anneau du clavier comprise.
    test("tour 8 : lignes du compte au rayon des lignes de la cloche et du menu mobile (375, 1280 px)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      const barre = page.getByRole("banner");
      const coins = (e: Element) => {
        const cs = getComputedStyle(e);
        return { nom: (e as HTMLElement).innerText.trim(), courant: e.getAttribute("aria-current"), hg: cs.borderTopLeftRadius, hd: cs.borderTopRightRadius, bd: cs.borderBottomRightRadius, bg: cs.borderBottomLeftRadius };
      };
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto("/vannes");
      await pret(page, "PREMIUM");
      await barre.getByRole("button", { name: "Menu" }).click();
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
      const ligneMenu = await menu.getByRole("link", { name: "Mon profil", exact: true }).evaluate(coins);
      const rayon = ligneMenu.hg;
      expect(rayon, "rounded-lg du thème : 0,75rem").toBe("12px");
      await page.keyboard.press("Escape");
      await expect(menu).toHaveCount(0);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/profil");
      await pret(page, "PREMIUM");
      await barre.getByRole("button", { name: /^Notifications/ }).click();
      const panneau = page.getByRole("dialog");
      await expect(panneau).toBeVisible();
      const ligneCloche = (await panneau.getByRole("link").count()) ? await panneau.getByRole("link").first().evaluate(coins) : null;
      noter(`tour 8 ; rayons ; menu mobile=${JSON.stringify(ligneMenu)} ; cloche=${JSON.stringify(ligneCloche)}`);
      if (ligneCloche) expect([ligneCloche.hg, ligneCloche.hd, ligneCloche.bd, ligneCloche.bg], "ligne de la cloche").toEqual([rayon, rayon, rayon, rayon]);
      await page.keyboard.press("Escape");
      await expect(panneau).toHaveCount(0);
      const compte = barre.getByRole("button", { name: TEXTES_CONNEXION.menuCompte });
      await compte.focus();
      await page.keyboard.press("Enter");
      const items = page.getByRole("menuitem");
      await expect(items.first()).toBeFocused();
      const lignes = await items.evaluateAll((els) =>
        els.map((e) => {
          const cs = getComputedStyle(e);
          return { nom: (e as HTMLElement).innerText.trim(), focus: e === document.activeElement, courant: e.getAttribute("aria-current"), hg: cs.borderTopLeftRadius, hd: cs.borderTopRightRadius, bd: cs.borderBottomRightRadius, bg: cs.borderBottomLeftRadius };
        }),
      );
      noter(`tour 8 ; rayons ; compte au clavier ; ${JSON.stringify(lignes)}`);
      expect(lignes.some((l) => l.courant === "page"), "« Mon profil » en cours sur /profil").toBe(true);
      for (const l of lignes) {
        // Ligne en cours non focalisée : coins gauches droits sous le filet violet ; sinon, les 4 coins au rayon.
        const gauche = l.courant === "page" && !l.focus ? "0px" : rayon;
        expect([l.hg, l.hd, l.bd, l.bg], `${l.nom}${l.focus ? " (focus)" : ""}`).toEqual([gauche, rayon, rayon, gauche]);
      }
      const enCours = page.locator("[role='menuitem'][aria-current='page']");
      for (let i = 0; i < 5 && !(await enCours.evaluate((e) => e === document.activeElement)); i++) await page.keyboard.press("ArrowDown");
      await expect(enCours).toBeFocused();
      await expect.poll(() => enCours.evaluate((e) => getComputedStyle(e).borderTopLeftRadius), { message: "ligne en cours sous l'anneau, coins au rayon" }).toBe(rayon);
      const sousAnneau = await enCours.evaluate(coins);
      noter(`tour 8 ; rayons ; ligne en cours au clavier ; ${JSON.stringify(sousAnneau)}`);
      expect([sousAnneau.hg, sousAnneau.hd, sousAnneau.bd, sousAnneau.bg]).toEqual([rayon, rayon, rayon, rayon]);
      await c.close();
    });

    // s25 tour 8 (ux critère 7) : champ de recherche de 44 px dans la barre (dès 768 px en v6, 176 px de large) et sous la
    // loupe (`#mobile-search`, 440 à 767 px) ; dans la barre, centré sur les liens (zone de contenu, comme le tour 5) ;
    // loupe et texte (placeholder) au centre du champ.
    test("tour 8 : recherche à 44 px dans la barre et sous la loupe, centrée (440 à 1920 px)", async ({ browser }) => {
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [440, 640, 767, 768, 1024, 1280, 1456, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          const enBarre = largeur >= 768;
          if (!enBarre) {
            await page.getByRole("banner").getByRole("button", { name: "Rechercher", exact: true }).click();
            const zone = page.locator("#mobile-search");
            await expect(zone).toBeVisible();
            await zone.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          }
          const m = await page.evaluate((barre) => {
            const coque = document.querySelector("header > div")!;
            const input = barre ? Array.from(coque.querySelectorAll("input")).find((i) => i.getBoundingClientRect().width > 0)! : document.querySelector<HTMLInputElement>("#mobile-search input")!;
            const contenu = (el: Element) => {
              const r = el.getBoundingClientRect();
              const s = getComputedStyle(el);
              return (r.top + parseFloat(s.borderTopWidth) + parseFloat(s.paddingTop) + r.bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom)) / 2;
            };
            const r = input.getBoundingClientRect();
            const loupe = input.parentElement!.querySelector("svg")!.getBoundingClientRect();
            const liens = Array.from(coque.querySelectorAll("nav a")).filter((a) => a.getBoundingClientRect().width > 0).map(contenu);
            return { h: r.height, l: r.width, haut: r.top, bas: r.bottom, centre: (r.top + r.bottom) / 2, texte: contenu(input), loupe: (loupe.top + loupe.bottom) / 2, liens };
          }, enBarre);
          const ici = `(${etat}, ${largeur} px, ${enBarre ? "barre" : "#mobile-search"})`;
          noter(`tour 8 ; recherche ; ${ici} ; h=${m.h} ; l=${m.l} ; y=${m.haut}-${m.bas} ; centre=${m.centre} ; texte=${m.texte} ; loupe=${m.loupe} ; liens=${m.liens.join(",")}`);
          expect(m.h, `44 px ${ici}`).toBe(44);
          expect(Math.abs(m.loupe - m.centre), `loupe centrée ${ici}`).toBeLessThanOrEqual(0.5);
          expect(Math.abs(m.texte - m.centre), `texte centré ${ici}`).toBeLessThanOrEqual(0.5);
          if (enBarre) {
            expect(m.l, `176 px ${ici}`).toBe(176);
            expect([m.haut, m.bas], `de 10 à 54 dans la barre de 64 px ${ici}`).toEqual([10, 54]);
            for (const l of m.liens) expect(Math.abs(l - m.texte), `centré sur les liens ${ici}`).toBeLessThanOrEqual(0.5);
          }
        }
        await c.close();
      }
    });

    // s25 tour 9 (relecture ux, critère 7, WCAG 1.4.11) : contour du champ de recherche de l'en-tête et du menu au repos
    // en `border-input` #707070, 3:1 au moins sur le fond voisin ; au focus, inchangé (`accent-link`).
    test("tour 9 : contour du champ de recherche à 3:1 au moins (barre 1280, #mobile-search 640, menu 375)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const lieu of ["barre", "loupe", "menu"] as const) {
        await page.setViewportSize({ width: lieu === "barre" ? 1280 : lieu === "loupe" ? 640 : 375, height: 900 });
        await page.goto("/vannes");
        await pret(page, "PREMIUM");
        const banniere = page.getByRole("banner");
        if (lieu === "loupe") await banniere.getByRole("button", { name: "Rechercher", exact: true }).click();
        if (lieu === "menu") await banniere.getByRole("button", { name: "Menu" }).click();
        const champ = lieu === "barre" ? banniere.getByRole("combobox").first() : lieu === "loupe" ? page.locator("#mobile-search input") : page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("combobox");
        await expect(champ).toBeVisible();
        // Au repos : la loupe donne le focus au champ, on le retire (Tab plus loin, par exemple).
        await champ.evaluate((e) => e.blur());
        await expect(champ, `au repos (${lieu})`).toHaveCSS("border-top-color", "rgb(112, 112, 112)");
        const m = await champ.evaluate((input) => {
          const rgb = (v: string) => (v.match(/[\d.]+/g) ?? []).map(Number);
          const lum = ([r, g, b]: number[]) => [r, g, b].map((x) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((t, v, i) => t + v * [0.2126, 0.7152, 0.0722][i], 0);
          // Fond voisin : premier ancêtre au fond non transparent, mélangé au fond de la page s'il est translucide.
          const page = rgb(getComputedStyle(document.body).backgroundColor);
          let fond = page;
          for (let e = input.parentElement; e; e = e.parentElement) {
            const f = rgb(getComputedStyle(e).backgroundColor);
            const a = f.length > 3 ? f[3] : 1;
            if (a > 0) { fond = [0, 1, 2].map((i) => f[i] * a + page[i] * (1 - a)); break; }
          }
          const bord = rgb(getComputedStyle(input).borderTopColor);
          const [l1, l2] = [lum(bord), lum(fond)].sort((x, y) => y - x);
          return { bord: getComputedStyle(input).borderTopColor, fond: fond.map(Math.round).join(","), ratio: (l1 + 0.05) / (l2 + 0.05) };
        });
        noter(`tour 9 ; contour du champ ; ${lieu} ; bord=${m.bord} ; fond=${m.fond} ; ratio=${m.ratio.toFixed(2)}`);
        expect(m.bord, `border-input (${lieu})`).toBe("rgb(112, 112, 112)");
        expect(m.ratio, `contour à 3:1 au moins (${lieu})`).toBeGreaterThanOrEqual(3);
        await champ.focus();
        await expect(champ, `focus inchangé (${lieu})`).toHaveCSS("border-top-color", "rgb(167, 139, 250)");
      }
      await c.close();
    });

    // s25 tour 9 (relecture ux, critère 7) : liste de la recherche de la barre (`enTete`) : puces et « Voir {type} » à 44 px
    // de cible au moins, texte inchangé, anneau violet au clavier.
    test("tour 9 : recherche de la barre, cibles de 44 px dans la liste ouverte (1280 px)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/vannes");
      await pret(page, "PREMIUM");
      const champ = page.getByRole("banner").getByRole("combobox").first();
      const hauteurs = (l: ReturnType<Page["getByRole"]>) => l.locator("button").evaluateAll((bs) => bs.map((b) => b.getBoundingClientRect().height));
      await champ.focus();
      // Tour 10 (ux 4-A) : liste ouverte à la flèche bas, plus au focus.
      await page.keyboard.press("ArrowDown");
      const suggestions = page.getByRole("banner").getByRole("listbox", { name: "Suggestions de recherche" });
      await expect(suggestions).toBeVisible();
      const hs = await hauteurs(suggestions);
      noter(`tour 9 ; puces de la barre ; ${hs.join(",")}`);
      expect(hs.length).toBe(6);
      for (const h of hs) expect(h, "puce de suggestion").toBeGreaterThanOrEqual(44);
      // Résultats : « Voir {type} » à 44 px, texte en text-xs.
      let reponse = page.waitForResponse((r) => r.url().includes("/api/search"));
      await champ.fill("re");
      await reponse;
      const resultats = page.getByRole("banner").getByRole("listbox", { name: "Résultats de recherche" });
      await expect(resultats).toBeVisible();
      const voir = resultats.getByRole("button", { name: /^Voir / });
      expect(await voir.count()).toBeGreaterThan(0);
      for (const b of await voir.all()) {
        const m = await b.evaluate((e) => ({ h: e.getBoundingClientRect().height, taille: getComputedStyle(e).fontSize }));
        noter(`tour 9 ; ${await b.textContent()} ; h=${m.h} ; police=${m.taille}`);
        expect(m.h, "« Voir » à 44 px").toBeGreaterThanOrEqual(44);
        expect(m.taille, "texte inchangé (text-xs)").toBe("12px");
      }
      await page.keyboard.press("Tab");
      await expect(voir.first()).toBeFocused();
      expect(await voir.first().evaluate((e) => getComputedStyle(e).boxShadow), "anneau violet").toContain("rgb(167, 139, 250)");
      // Aucun résultat : puces de relance à 44 px.
      reponse = page.waitForResponse((r) => r.url().includes("/api/search"));
      await champ.fill("zzqxwv");
      await reponse;
      const aucun = page.getByRole("banner").getByRole("listbox", { name: "Aucun résultat" });
      await expect(aucun).toBeVisible();
      const ha = await hauteurs(aucun);
      expect(ha.length).toBe(4);
      for (const h of ha) expect(h, "puce de relance").toBeGreaterThanOrEqual(44);
      await c.close();
    });

    // s25 tour 10 (relectures ux 4-A, 4-B et pistes 7 ; design F1 à F4) : liste de suggestions de la barre et de la loupe.
    // Rien au focus, Tab depuis le champ va au contrôle suivant de la barre et referme la liste ; liste alignée à droite du
    // champ (176 px inchangés), 320 px, puces sur 2 lignes au plus, dans la coque ; fini des panneaux cloche et compte
    // (fond élevé, rayon 12 px, filet de 4 px) ; anneau intérieur collé.
    // v6 (intégration s25) : placement mesuré à toutes les largeurs où le champ est dans la rangée (768 à 1920 px) :
    // 8 px sous la rangée du haut, par-dessus la bande des rubriques ; le reste (clavier, anneau, résultats) à 1280 px.
    test("tour 10 : liste de suggestions de la barre, Tab, largeur, finition, anneau (768 à 1920 px, 3 comptes)", async ({ browser }) => {
      const LIEN = "rgb(167, 139, 250)";
      for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [768, 1024, 1279, 1280, 1456, 1920]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          const barre = page.getByRole("banner");
          const champ = barre.getByRole("combobox").first();
          const liste = barre.getByRole("listbox", { name: "Suggestions de recherche" });
          const ici = `(${etat}, ${largeur} px)`;
          await champ.focus();
          await expect(liste, `rien au focus ${ici}`).toHaveCount(0);
          await page.keyboard.press("ArrowDown");
          await expect(liste).toBeVisible();
          await liste.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const m = await liste.evaluate((l, champId) => {
            const r = l.getBoundingClientRect();
            const ch = document.querySelector(`[aria-controls="${champId}"]`)!.getBoundingClientRect();
            const coque = document.querySelector("header > div")!;
            const sc = getComputedStyle(coque);
            const cq = coque.getBoundingClientRect();
            const en = document.querySelector("header")!.getBoundingClientRect();
            const s = getComputedStyle(l);
            const filet = l.firstElementChild as HTMLElement;
            const tops = new Set(Array.from(l.querySelectorAll("[role='option']")).map((o) => Math.round(o.getBoundingClientRect().top)));
            // Par-dessus la bande : au milieu de la bande, sous la liste, l'élément visible est dans la liste.
            const bande = document.querySelector("[data-bande-rubriques]")!.getBoundingClientRect();
            const yBande = (bande.top + bande.bottom) / 2;
            const dessus = yBande < r.bottom ? l.contains(document.elementFromPoint(r.left + r.width / 2, yBande)) : null;
            return {
              gauche: r.left, droite: r.right, largeur: r.width, haut: r.top, champG: ch.left, champD: ch.right, champL: ch.width,
              coqueG: cq.left + parseFloat(sc.paddingLeft), coqueD: cq.right - parseFloat(sc.paddingRight), filetEnTete: en.bottom, rangee: cq.bottom,
              bandeHaut: bande.top, dessus,
              fond: s.backgroundColor, rayon: s.borderTopLeftRadius, filetH: filet.getBoundingClientRect().height, filetImage: getComputedStyle(filet).backgroundImage,
              lignes: tops.size, fenetre: window.innerWidth,
            };
          }, await champ.getAttribute("aria-controls"));
          noter(`tour 10 ; liste de la barre ; ${ici} ; ${JSON.stringify(m)}`);
          expect(m.champL, `champ à 176 px ${ici}`).toBe(176);
          expect(Math.abs(m.droite - m.champD), `bord droit sur celui du champ ${ici}`).toBeLessThanOrEqual(0.5);
          expect(m.largeur, `liste de 320 px ${ici}`).toBe(320);
          expect(m.gauche, `dans la coque ${ici}`).toBeGreaterThanOrEqual(m.coqueG);
          expect(m.droite, `dans la coque ${ici}`).toBeLessThanOrEqual(m.coqueD);
          expect(m.lignes, `puces sur 2 lignes au plus ${ici}`).toBeLessThanOrEqual(2);
          // v6 : le filet de l’en-tête est sous la bande ; la liste tombe du champ, 8 px sous la rangée du haut, donc
          // au-dessus du bas de la bande, posée par-dessus elle (surimpression).
          expect(Math.abs(m.haut - m.rangee - 8), `8 px sous la rangée ${ici}`).toBeLessThanOrEqual(0.5);
          expect(m.haut, `liste posée sur la bande, pas sous l'en-tête ${ici}`).toBeLessThan(m.filetEnTete);
          expect(m.dessus, `liste par-dessus la bande ${ici}`).toBe(true);
          expect(m.fond, `fond élevé ${ici}`).toBe("rgb(42, 42, 42)");
          expect(m.rayon, `rounded-xl ${ici}`).toBe("12px");
          expect(m.filetH, `filet de 4 px ${ici}`).toBe(4);
          expect(m.filetImage, `filet dégradé ${ici}`).toContain("linear-gradient");
          // Option active (flèche bas) : anneau intérieur collé de 2 px, lisible sans la teinte ; options hors Tab.
          const active = liste.getByRole("option").first();
          await expect(active).toHaveAttribute("aria-selected", "true");
          await expect(champ).toHaveAttribute("aria-activedescendant", (await active.getAttribute("id"))!);
          const a = await active.evaluate(anneaux);
          noter(`tour 10 ; puce active ; ${ici} ; ${JSON.stringify(a)}`);
          expect(a.map((x) => [x.couleur, x.epaisseur, x.inset]), `un anneau collé ${ici}`).toEqual([[LIEN, 2, true]]);
          expect(await liste.getByRole("option").evaluateAll((os) => os.map((o) => o.getAttribute("tabindex"))), `options hors Tab ${ici}`).toEqual(Array(6).fill("-1"));
          if (largeur !== 1280) continue;
          // Tab depuis le champ : contrôle suivant de la barre, liste refermée.
          const suivant = etat === "visiteur" ? barre.getByRole("link", { name: TEXTES_CONNEXION.lienConnexionMobile, exact: true }) : etat === "FREE" ? barre.locator("[data-en-tete-prix]") : barre.getByRole("button", { name: /^Notifications/ });
          await page.keyboard.press("Tab");
          await expect(suivant, `Tab depuis le champ ${ici}`).toBeFocused();
          await expect(liste, `liste refermée ${ici}`).toHaveCount(0);
          // « Voir {type} » au clavier : même anneau, collé.
          const reponse = page.waitForResponse((r) => r.url().includes("/api/search"));
          await champ.fill("re");
          await reponse;
          const resultats = barre.getByRole("listbox", { name: "Résultats de recherche" });
          await expect(resultats).toBeVisible();
          await page.keyboard.press("Tab");
          const voir = resultats.getByRole("button", { name: /^Voir / }).first();
          await expect(voir).toBeFocused();
          expect((await voir.evaluate(anneaux)).map((x) => [x.couleur, x.epaisseur, x.inset]), `« Voir », anneau collé ${ici}`).toEqual([[LIEN, 2, true]]);
        }
        await c.close();
      }
    });

    // s25 tour 10 (design F1) : sous la loupe (`#mobile-search`), la liste est posée 8 px sous le filet de l'en-tête.
    test("tour 10 : liste sous la loupe, 8 px sous le filet de l'en-tête (440, 640 px)", async ({ browser }) => {
      for (const etat of ["visiteur", "PREMIUM"] as const) {
        const c = await contexte(browser, etat);
        const page = await c.newPage();
        for (const largeur of [440, 640]) {
          await page.setViewportSize({ width: largeur, height: 900 });
          await page.goto("/vannes");
          await pret(page, etat);
          await page.getByRole("banner").getByRole("button", { name: "Rechercher", exact: true }).click();
          const zone = page.locator("#mobile-search");
          await zone.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const champ = zone.getByRole("combobox");
          await expect(champ).toBeFocused();
          const liste = zone.getByRole("listbox", { name: "Suggestions de recherche" });
          await expect(liste, `rien au focus (${etat}, ${largeur} px)`).toHaveCount(0);
          await page.keyboard.press("ArrowDown");
          await expect(liste).toBeVisible();
          await liste.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
          const m = await liste.evaluate((l) => ({ haut: l.getBoundingClientRect().top, filet: document.querySelector("header")!.getBoundingClientRect().bottom, lignes: new Set(Array.from(l.querySelectorAll("[role='option']")).map((o) => Math.round(o.getBoundingClientRect().top))).size }));
          noter(`tour 10 ; liste sous la loupe ; ${etat} ; ${largeur} px ; ${JSON.stringify(m)}`);
          expect(m.haut - m.filet, `8 px sous le filet (${etat}, ${largeur} px)`).toBeGreaterThanOrEqual(8);
          expect(m.lignes, `puces sur 2 lignes au plus (${etat}, ${largeur} px)`).toBeLessThanOrEqual(2);
        }
        await c.close();
      }
    });

    // s25 tour 10 (ux piste 7) : `id` de la liste et des options propres à chaque instance de la recherche (barre, loupe,
    // menu), `aria-controls` et `aria-activedescendant` sur la liste et l'option de la même instance.
    test("tour 10 : id uniques des listes de recherche, aria-controls cohérent (375, 640 px)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      for (const [largeur, ouvrir] of [[640, "Rechercher"], [375, "Menu"]] as const) {
        await page.setViewportSize({ width: largeur, height: 812 });
        await page.goto("/vannes");
        await pret(page, "PREMIUM");
        await page.getByRole("banner").getByRole("button", { name: ouvrir, exact: true }).click();
        const champ = page.getByRole("combobox").filter({ visible: true });
        await expect(champ).toHaveCount(1);
        await champ.focus();
        await page.keyboard.press("ArrowDown");
        const m = await page.evaluate(() => {
          const ids = Array.from(document.querySelectorAll("[id]")).map((e) => e.id);
          const champs = Array.from(document.querySelectorAll("[role='combobox']")).map((e) => e.getAttribute("aria-controls"));
          const visible = Array.from(document.querySelectorAll<HTMLElement>("[role='combobox']")).find((e) => e.getBoundingClientRect().width > 0)!;
          const liste = document.getElementById(visible.getAttribute("aria-controls")!);
          const active = document.getElementById(visible.getAttribute("aria-activedescendant") ?? "");
          return { doublons: ids.filter((id, i) => ids.indexOf(id) !== i), champs, liste: liste?.getAttribute("role"), activeDansListe: !!active && !!liste?.contains(active), controle: visible.getAttribute("aria-controls") };
        });
        noter(`tour 10 ; id ; ${largeur} px ; ${JSON.stringify(m)}`);
        expect(m.doublons, `aucun id en double (${largeur} px)`).toEqual([]);
        expect(m.champs.length, `plusieurs instances montées (${largeur} px)`).toBeGreaterThanOrEqual(2);
        expect(new Set(m.champs).size, `aria-controls distincts (${largeur} px)`).toBe(m.champs.length);
        expect(m.liste, `aria-controls vise la liste ouverte (${largeur} px)`).toBe("listbox");
        expect(m.activeDansListe, `option active dans cette liste (${largeur} px)`).toBe(true);
      }
      await c.close();
    });

    // s25 tour 10 (design F5) : dans le menu mobile, l'anneau des lignes commence au même x que celui de la recherche
    // (filet transparent de 2 px retiré au focus et rendu en padding) ; le texte des lignes ne bouge pas au focus.
    test("tour 10 : menu mobile, anneau des lignes au x de la recherche, texte immobile (375 px)", async ({ browser }) => {
      const c = await contexte(browser, "PREMIUM");
      const page = await c.newPage();
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/vannes");
      await pret(page, "PREMIUM");
      await page.getByRole("banner").getByRole("button", { name: "Menu" }).focus();
      await page.keyboard.press("Enter");
      const menu = page.getByRole("navigation", { name: "Navigation mobile" });
      await menu.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
      const champ = menu.getByRole("combobox");
      await page.keyboard.press("Tab");
      await expect(champ).toBeFocused();
      const xChamp = await champ.evaluate((e) => e.getBoundingClientRect().left);
      // Texte d'une ligne : premier nœud de texte non vide, mesuré par un Range.
      const texte = (el: Element) => {
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
        const r = document.createRange();
        r.selectNodeContents(w.nextNode()!);
        return r.getBoundingClientRect().left;
      };
      const lignes = [{ nom: "Mon profil", el: menu.getByRole("link", { name: "Mon profil", exact: true }), x: xChamp }];
      for (const l of lignes) {
        const avant = await l.el.evaluate(texte);
        await tabJusqua(page, l.el);
        await expect.poll(() => l.el.evaluate((e) => e.matches(":focus-visible"))).toBe(true);
        const m = await l.el.evaluate((e) => ({ gauche: e.getBoundingClientRect().left, bord: getComputedStyle(e).borderLeftWidth }));
        const apres = await l.el.evaluate(texte);
        const a = await l.el.evaluate(anneaux);
        noter(`tour 10 ; menu, anneau ; ${l.nom} ; champ=${xChamp} ; ${JSON.stringify(m)} ; texte ${avant} -> ${apres}`);
        expect(m.bord, `filet retiré au focus (${l.nom})`).toBe("0px");
        expect(m.gauche, `anneau au x de la recherche (${l.nom})`).toBe(l.x);
        expect(apres, `texte immobile (${l.nom})`).toBe(avant);
        expect(a.map((x) => [x.epaisseur, x.inset]), `anneau intérieur de 2 px (${l.nom})`).toEqual([[2, true]]);
      }
      await c.close();
    });
  });
});
