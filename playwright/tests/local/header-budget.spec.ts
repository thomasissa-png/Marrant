import { appendFileSync } from "node:fs";
import type { Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, type PlanCompte } from "../support/base-locale";
import { TEXTES_CONNEXION } from "@/config/textes/compte";

/**
 * Garde-fou de l'en-tête (revue design s21, bloquant) : 6 largeurs x 3 états
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
    return { fenetre: window.innerWidth, scroll: document.documentElement.scrollWidth, barre: { scroll: barre.scrollWidth, client: barre.clientWidth }, enfants, controles, recherche };
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
          if (etat === "visiteur") {
            await expect(barre.getByRole("link", { name: "Connexion" })).toBeVisible();
            await expect(barre.getByRole("link", { name: "Commencer" })).toBeVisible();
            await expect(compte).toHaveCount(0);
          } else {
            await expect(compte).toBeVisible();
            await expect(barre.getByText("Déconnexion")).toHaveCount(0);
            await expect(barre.getByRole("link", { name: "Activer mon accès" })).toHaveCount(etat === "FREE" ? 1 : 0);
          }
        }
        await testInfo.attach(`mesures-${etat}`, { body: lignes.join("\n"), contentType: "text/plain" });
        if (process.env.E2E_MESURES_EN_TETE) appendFileSync(process.env.E2E_MESURES_EN_TETE, `${lignes.join("\n")}\n`);
      });

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
