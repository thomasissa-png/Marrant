import type { Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";
import { TEXTES_ESPACE_NAVIGATION as T, nomCloche } from "@/config/textes/espace-navigation";

/**
 * Espace client, lot D2 (s24, `docs/espace-client/plan-developpement-s24.md` §3) : barre de
 * rubriques, en-tête abonné (loupe, cloche, compte), menu « Plus ».
 *
 * Deux régimes :
 * - toujours (CI, interrupteur fermé dans le code livré) : ni barre ni cloche, pour personne ;
 * - `E2E_ESPACE_OUVERT=1` : serveur construit depuis une COPIE JETABLE où
 *   `ESPACE_CLIENT_PUBLIE = true` (jamais le code livré ; voir REPLIT_ACTIONS.md, s24 D2).
 *   Largeurs 320 à 1536 (+ 188 px, soit 375 px à 200 % de texte), abonné.
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const LARGEURS = [320, 375, 768, 1024, 1280, 1536];
const DEUX_CENTS_POUR_CENT = 188;
const MOT_DE_PASSE = "E2e-espace-barre-D2";
const PAGES = ["/parcours", "/carnet", "/vannes", "/favoris", "/profil"];

async function compte(browser: import("@playwright/test").Browser, plan: "FREE" | "PREMIUM"): Promise<Cookie[]> {
  const email = `e2e-espace-d2-${plan.toLowerCase()}-${Date.now().toString(36)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return cookies;
}

/** Mesures de la barre (les entrées, la zone visible à droite de l'épinglée, l'indice). */
async function mesurer(page: Page) {
  return page.evaluate(() => {
    const liste = document.querySelector("[data-liste-rubriques]") as HTMLElement;
    const r = liste.getBoundingClientRect();
    const onglets = Array.from(liste.querySelectorAll<HTMLElement>("[data-onglet]"));
    const epinglee = onglets[0].getBoundingClientRect();
    const entrees = onglets.map((o, i) => {
      const b = o.getBoundingClientRect();
      const gaucheVue = i === 0 ? r.left : epinglee.right;
      const visible = Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, gaucheVue));
      return {
        texte: (o.textContent ?? "").trim(),
        courante: o.getAttribute("aria-current") === "page",
        largeur: b.width,
        hauteur: b.height,
        visible,
        coupeeAGauche: i > 0 && b.left < gaucheVue - 1 && b.right > gaucheVue + 1,
        coupeeADroite: b.left < r.right - 1 && b.right > r.right + 1,
        texteTronque: o.scrollWidth > o.clientWidth + 1,
      };
    });
    const indice = document.querySelector("[data-indice-suite]") as HTMLElement;
    const espace = Array.from(liste.children).at(-1) as HTMLElement;
    // En-tête et barre seulement (la liste défile dans sa boîte : ses entrées n'en sortent pas).
    const cadre = Array.from(document.querySelectorAll("[data-en-tete-espace] *, [data-espace-barre] *"))
      .filter((e) => !e.closest("[data-liste-rubriques]"))
      .reduce((m, e) => Math.max(m, e.getBoundingClientRect().right), 0);
    return {
      fenetre: window.innerWidth,
      scroll: document.documentElement.scrollWidth,
      cadre,
      basBarre: (document.querySelector("[data-espace-barre]") as HTMLElement).getBoundingClientRect().bottom,
      deborde: liste.scrollWidth - espace.offsetWidth > liste.clientWidth + 1,
      suiteADroite: onglets.some((o) => o.getBoundingClientRect().right > r.right + 1),
      // État visé (classe), pas l'opacité calculée : le fondu a une transition de 150 ms.
      indiceVisible: getComputedStyle(indice).display !== "none" && !indice.classList.contains("opacity-0"),
      scrollLeft: liste.scrollLeft,
      comportement: getComputedStyle(liste).scrollBehavior,
      entrees,
    };
  });
}

test.describe("espace client, barre de rubriques (s24, lot D2)", () => {
  localSeulement();

  test("visiteur, compte gratuit et abonné hors espace ouvert : ni barre ni cloche", async ({ browser }) => {
    const etats: Array<Cookie[] | null> = [null, await compte(browser, "FREE")];
    if (!ESPACE_OUVERT) etats.push(await compte(browser, "PREMIUM"));
    for (const cookies of etats) {
      const contexte = await browser.newContext();
      if (cookies) await contexte.addCookies(cookies);
      const page = await contexte.newPage();
      for (const chemin of ["/parcours", "/vannes"]) {
        await page.goto(chemin);
        await page.waitForLoadState("networkidle");
        await expect(page.getByRole("navigation", { name: T.monEspace })).toHaveCount(0);
        await expect(page.getByRole("button", { name: /^Notifications/ })).toHaveCount(0);
        expect(await page.content()).not.toMatch(/data-espace-barre|data-en-tete-espace/);
      }
      await contexte.close();
    }
  });

  test.describe("abonné, interrupteur ouvert (copie jetable)", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
    let cookies: Cookie[] = [];
    test.beforeAll(async ({ browser }) => {
      cookies = await compte(browser, "PREMIUM");
    });
    test.beforeEach(async ({ context }) => {
      await context.addCookies(cookies);
    });

    const ouvrir = async (page: Page, chemin: string) => {
      await page.goto(chemin);
      await expect(page.getByRole("navigation", { name: T.monEspace })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
    };

    test("320 à 1536 px (+ 200 %) : aucun débordement, aucune entrée coupée en plein mot, cibles de 44 px, empilement", async ({ page }, testInfo) => {
      const lignes: string[] = [];
      for (const largeur of [DEUX_CENTS_POUR_CENT, ...LARGEURS]) {
        await page.setViewportSize({ width: largeur, height: 800 });
        for (const chemin of PAGES) {
          await ouvrir(page, chemin);
          const m = await mesurer(page);
          const ici = `${chemin} à ${largeur} px`;
          const droite = m.entrees.find((e) => e.coupeeADroite);
          lignes.push(`${ici} ; défilement=${m.scroll}/${m.fenetre} ; cadre=${m.cadre.toFixed(0)} ; bas-barre=${m.basBarre.toFixed(0)} ; déborde=${m.deborde} ; indice=${m.indiceVisible} ; suite-visible=${droite ? droite.visible.toFixed(1) : "-"}px`);
          expect(m.cadre, `en-tête ou barre plus large que l'écran, ${ici}`).toBeLessThanOrEqual(m.fenetre + 0.5);
          // Le contenu des pages (hors de ce lot) est seulement relevé dans les mesures jointes : à 188 px
          // plusieurs pages existantes débordent déjà, et /profil peut déborder pendant son chargement.
          expect(m.entrees.length, `6 entrées au plus, ${ici}`).toBeLessThanOrEqual(6);
          expect(m.entrees[0].visible, `« Aujourd'hui » entière, ${ici}`).toBeGreaterThanOrEqual(m.entrees[0].largeur - 0.5);
          for (const e of m.entrees) {
            expect(e.coupeeAGauche, `« ${e.texte} » coupée sous l'épinglée, ${ici}`).toBe(false);
            expect(e.texteTronque, `« ${e.texte} » tronquée, ${ici}`).toBe(false);
            expect(e.hauteur, `« ${e.texte} » : cible de 44 px, ${ici}`).toBeGreaterThanOrEqual(44);
            if (e.courante) expect(e.visible, `« ${e.texte} » courante entière, ${ici}`).toBeGreaterThanOrEqual(e.largeur - 1);
          }
          // Indice de suite : chevron et fondu ; sous 300 px (200 %), la coupure de l'entrée suivante seule (maquette).
          if (largeur >= 320) expect(m.indiceVisible, `indice de suite ${m.suiteADroite ? "absent" : "allumé en fin de course"}, ${ici}`).toBe(m.suiteADroite);
          if (m.deborde && m.scrollLeft === 0) expect(droite, `aucune entrée coupée au bord droit, ${ici}`).toBeDefined();
          if (largeur >= 768) expect(m.deborde, `la barre défile à ${ici}`).toBe(false);
          if (largeur === 375) expect(m.basBarre, `en-tête + barre > 112 px, ${ici}`).toBeLessThanOrEqual(112);
          const banniere = page.getByRole("banner");
          for (const nom of [T.recherche.ouvrir, nomCloche(0), T.compte.nom]) {
            const boite = await banniere.getByRole("button", { name: nom }).boundingBox();
            expect(boite?.width ?? 0, `« ${nom} » : 44 px, ${ici}`).toBeGreaterThanOrEqual(44);
            expect(boite?.height ?? 0, `« ${nom} » : 44 px, ${ici}`).toBeGreaterThanOrEqual(44);
            expect((boite?.x ?? 0) + (boite?.width ?? 0), `« ${nom} » sort de l'écran, ${ici}`).toBeLessThanOrEqual(largeur + 0.5);
          }
        }
      }
      await testInfo.attach("mesures-barre-espace", { body: lignes.join("\n"), contentType: "text/plain" });
    });

    test("320 et 375 px : indice de suite, entrée suivante coupée de 16 à 24 px au bord", async ({ page }, testInfo) => {
      for (const largeur of [320, 375]) {
        await page.setViewportSize({ width: largeur, height: 812 });
        await ouvrir(page, "/parcours");
        const m = await mesurer(page);
        const suite = m.entrees.find((e) => e.coupeeADroite);
        await testInfo.attach(`indice-${largeur}`, { body: JSON.stringify({ suite, indice: m.indiceVisible }, null, 2), contentType: "application/json" });
        expect(m.deborde).toBe(true);
        expect(m.indiceVisible).toBe(true);
        expect(suite, `aucune entrée coupée au bord droit à ${largeur} px`).toBeDefined();
        expect(suite?.visible ?? 0).toBeGreaterThanOrEqual(16 - 1);
        expect(suite?.visible ?? 0).toBeLessThanOrEqual(24 + 1);
      }
    });

    test("entrée active ramenée dans la vue sans animation (prefers-reduced-motion)", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 812 });
      await ouvrir(page, "/favoris");
      const avant = await mesurer(page);
      const plus = avant.entrees.find((e) => e.courante);
      expect(plus?.texte).toBe(T.rubriques.plus);
      expect(plus?.visible ?? 0).toBeGreaterThanOrEqual((plus?.largeur ?? 1) - 1);
      expect(avant.comportement).toBe("auto");
      await page.waitForTimeout(300);
      expect((await mesurer(page)).scrollLeft).toBe(avant.scrollLeft);
    });

    test("« Aujourd'hui » atteignable au clavier, chaque entrée ramenée dans la vue au focus", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await ouvrir(page, "/profil");
      const aujourdhui = page.getByRole("link", { name: T.rubriques.aujourdhui });
      let essais = 0;
      while (!(await aujourdhui.evaluate((el) => el === document.activeElement)) && essais++ < 12) await page.keyboard.press("Tab");
      await expect(aujourdhui).toBeFocused();
      await expect(aujourdhui).toBeInViewport({ ratio: 0.98 });
      for (const libelle of [T.rubriques.parcours, T.rubriques.quoiRepondre, T.rubriques.bibliotheque, T.rubriques.mesQuestions, T.rubriques.plus]) {
        await page.keyboard.press("Tab");
        const entree = page.getByRole("navigation", { name: T.monEspace }).getByText(libelle, { exact: true });
        await expect(entree).toBeInViewport({ ratio: 0.98 });
      }
      await page.keyboard.press("Enter");
      const menu = page.getByRole("menu", { name: T.menuPlus.nom });
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("menuitem")).toHaveText([
        T.menuPlus.sEntrainer,
        T.menuPlus.favoris,
        T.menuPlus.mesRepliques,
        T.menuPlus.lettres,
        T.menuPlus.articles,
        T.menuPlus.quiz,
      ]);
      for (const item of await menu.getByRole("menuitem").all()) expect((await item.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
      await page.keyboard.press("Escape");
      await expect(menu).toHaveCount(0);
    });

    test("ancre #etape-N jamais masquée par l'en-tête et la barre", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await ouvrir(page, "/parcours/repartie#etape-2");
      const etape = page.locator("#etape-2");
      await expect(etape).toBeAttached();
      await page.evaluate(() => document.getElementById("etape-2")?.scrollIntoView({ block: "start" }));
      const haut = (await etape.boundingBox())?.y ?? 0;
      const bas = (await mesurer(page)).basBarre;
      expect(haut).toBeGreaterThanOrEqual(bas - 0.5);
    });

    for (const largeur of [375, DEUX_CENTS_POUR_CENT]) {
      test(`deux tâches de test à ${largeur} px : construire une vanne, trouver une vanne`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: 812 });
        const barre = () => page.getByRole("navigation", { name: T.monEspace });
        // « Où apprendre à construire une vanne ? » : Parcours (ou Bibliothèque, Vocabulaire et techniques).
        await ouvrir(page, "/favoris");
        await barre().getByRole("link", { name: T.rubriques.parcours, exact: true }).click();
        await expect(page).toHaveURL(/\/parcours$/);
        await expect(barre().getByRole("link", { name: T.rubriques.parcours, exact: true })).toHaveAttribute("aria-current", "page");
        // « Où trouver une vanne ? » : Bibliothèque (bloc « Vannes, conseils, vidéos », lot D6).
        const bibliotheque = barre().getByRole("link", { name: T.rubriques.bibliotheque, exact: true });
        await bibliotheque.scrollIntoViewIfNeeded();
        await expect(bibliotheque).toBeInViewport({ ratio: 0.98 });
        await expect(bibliotheque).toHaveAttribute("href", "/mon-espace/bibliotheque");
      });
    }

    test("cloche (coque) : panneau vide, Échap et « Fermer », focus rendu ; feuille basse à 375, fenêtre à 1280", async ({ page }) => {
      for (const largeur of [375, 1280]) {
        await page.setViewportSize({ width: largeur, height: 812 });
        await ouvrir(page, "/parcours");
        const cloche = page.getByRole("banner").getByRole("button", { name: nomCloche(0) });
        await cloche.click();
        const panneau = page.getByRole("dialog", { name: T.cloche.titre });
        await expect(panneau).toContainText(T.cloche.vide);
        const boite = await panneau.boundingBox();
        if (largeur === 375) expect(Math.round((boite?.y ?? 0) + (boite?.height ?? 0))).toBe(812);
        else expect(boite?.width ?? 0).toBeLessThan(largeur / 2);
        await page.keyboard.press("Escape");
        await expect(panneau).toHaveCount(0);
        await expect(cloche).toBeFocused();
      }
    });
  });
});
