import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";

/**
 * Refonte d'« Aujourd'hui » (s25, `docs/ux/aujourdhui-refonte-s25.md`, `docs/design/aujourdhui-refonte-s25.md`), en
 * vrai navigateur, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1`) :
 * - aperçu (visiteur, gratuit) : bouton d'offre au premier écran à 375 et 1280, H1 aligné à gauche, extrait inerte
 *   (aucun focus, aucun clic), coupé à 320 / 400 / 440 px, pastille « Premium » sur chaque bloc fermé ;
 * - abonné neuf : Z1 8/12 et « Ton cap » 4/12 sur la même rangée dès 1024 px, une colonne dessous ; aucune rangée
 *   à moitié vide ; aucun débordement horizontal (halo compris) de 375 à 1920.
 */
const MOT_DE_PASSE = "E2e-aujourdhui-s25!";
const CAPTURES = process.env.E2E_CAPTURES_AUJ_S25;
const LARGEURS = [375, 768, 1280, 1920];
const HAUTEUR_EXTRAIT: Record<number, number> = { 375: 320, 768: 400, 1280: 440, 1920: 440 };

const boite = async (l: Locator) => {
  const b = await l.boundingBox();
  if (!b) throw new Error("élément invisible");
  return { gauche: b.x, droite: b.x + b.width, haut: b.y, bas: b.y + b.height, largeur: b.width, hauteur: b.height };
};
const debord = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function capturer(page: Page, nom: string, largeur: number) {
  if (CAPTURES) await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png`, fullPage: true });
}

test.describe("@espace refonte d'« Aujourd'hui » s25 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(180_000);

  test("aperçu (visiteur) : offre au premier écran, extrait inerte et coupé, pastille sur chaque bloc fermé", async ({ page }) => {
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: largeur === 375 ? 667 : 800 });
      await page.goto("/mon-espace");
      const ou = `${largeur} px`;
      // Dans la page (le bouton global de l'en-tête porte le même nom, comme à l'accueil).
      const offres = page.locator("[data-apercu-verrouille]").getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
      await expect(offres).toHaveCount(2);
      if (largeur === 375 || largeur === 1280) await expect(offres.first(), `bouton au premier écran, ${ou}`).toBeInViewport({ ratio: 1 });
      expect((await boite(offres.first())).hauteur, `bouton 44 px, ${ou}`).toBeGreaterThanOrEqual(44);
      expect(await page.locator("h1").evaluate((h) => getComputedStyle(h).textAlign), `H1 à gauche, ${ou}`).not.toBe("center");
      await expect(page.getByText(TEXTES_APERCU_VERROUILLE.suite)).toBeVisible();
      const extrait = page.locator("[data-apercu-extrait] > [aria-hidden='true']");
      expect(Math.round((await boite(extrait)).hauteur), `extrait coupé, ${ou}`).toBe(HAUTEUR_EXTRAIT[largeur]);
      expect(await extrait.evaluate((e) => e.hasAttribute("inert") && getComputedStyle(e).pointerEvents === "none"), `inerte, ${ou}`).toBe(true);
      const tuiles = extrait.locator("[data-tuile-fermee]");
      const n = await tuiles.count();
      expect(n).toBe(5);
      for (let i = 0; i < n; i++) await expect(tuiles.nth(i).locator(":scope > [data-badge-premium]")).toHaveCount(1);
      expect(await debord(page), `débordement horizontal, ${ou}`).toBeLessThanOrEqual(0);
      await capturer(page, "visiteur-aujourdhui", largeur);
    }
    // Tabulation : bouton du hero, « Connexion », bouton de fin ; jamais un élément de l'extrait.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/mon-espace");
    await page.locator("[data-apercu-hero] h1").click();
    const vus: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      vus.push(await page.evaluate(() => (document.activeElement?.closest("[data-apercu-extrait] > [aria-hidden]") ? "EXTRAIT" : document.activeElement?.textContent ?? "")));
    }
    expect(vus).not.toContain("EXTRAIT");
    expect(vus).toContain(TEXTES_APERCU.connexion);
  });

  test("abonné neuf : Z1 8/12 et « Ton cap » 4/12 sur une rangée dès 1024 px, rangées pleines, rien ne déborde", async ({ page }) => {
    const email = `e2e-auj-s25-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
    await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
    await connecter(page, email, MOT_DE_PASSE);
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace");
      const ou = `${largeur} px`;
      await expect(page.getByRole("link", { name: T.premierPas.bouton, exact: true })).toHaveCount(1);
      await expect(page.locator("[data-date-du-jour]")).toBeVisible();
      const grille = page.locator("[data-aujourdhui-grille]");
      const [g, action, cap] = [await boite(grille), await boite(page.locator("[data-carte-du-jour]")), await boite(page.locator('[data-zone="cap"]'))];
      if (largeur >= 1024) {
        expect(Math.abs(cap.haut - action.haut), `même rangée, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.abs(cap.hauteur - action.hauteur), `même hauteur, ${ou}`).toBeLessThanOrEqual(1);
        expect(action.largeur, `Z1 dominante, ${ou}`).toBeGreaterThan(cap.largeur * 1.8);
      } else {
        expect(cap.haut, `« Ton cap » sous l'action du jour, ${ou}`).toBeGreaterThan(action.bas);
        expect(Math.abs(action.largeur - g.largeur), `pleine largeur, ${ou}`).toBeLessThanOrEqual(1);
      }
      // Aucune rangée à moitié vide : chaque rangée occupe toute la largeur de la grille.
      const rangees = await grille.evaluate((el) => {
        const parHaut = new Map<number, { g: number; d: number }>();
        for (const c of Array.from(el.children)) {
          const r = c.getBoundingClientRect();
          const k = Math.round(r.top);
          const v = parHaut.get(k) ?? { g: r.left, d: r.right };
          parHaut.set(k, { g: Math.min(v.g, r.left), d: Math.max(v.d, r.right) });
        }
        const b = el.getBoundingClientRect();
        return Array.from(parHaut.values()).map((v) => Math.round(b.right - v.d + (v.g - b.left)));
      });
      for (const vide of rangees) expect(vide, `rangée pleine, ${ou}`).toBeLessThanOrEqual(1);
      expect(await debord(page), `débordement horizontal, ${ou}`).toBeLessThanOrEqual(0);
      await capturer(page, "nouvel-aujourdhui-refonte", largeur);
    }
  });
});
