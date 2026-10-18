import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * Revue design s21 v2, « à corriger avant mise en ligne » 1 : /abonnement, compte connecté
 * sans abonnement. Le prix et le bouton ne sont plus séparés par la hauteur réservée aux
 * lignes de la formule annuelle (vide d'environ 60 px à 320/360/375).
 * - 375 × 812 : haut du bouton à 680 px au plus.
 * - Aucun saut de mise en page au chargement (layout-shift cumulé nul sur la carte).
 * - Bascule mensuel/annuel : un changement de hauteur est accepté (choix du 18/10).
 * Mesures écrites dans la sortie du test (avant/après du correctif).
 */
const LARGEURS: [number, number][] = [
  [320, 568],
  [360, 740],
  [375, 812],
];

async function mesurer(page: Page) {
  const bouton = page.getByRole("button", { name: /^Ouvrir les/ });
  await expect(bouton).toBeVisible();
  const prix = page.locator("[aria-live='polite']").first();
  // Positions dans le document (indépendantes du défilement).
  const haut = (l: typeof bouton) => l.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const bas = (l: typeof bouton) => l.evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
  const [hautBouton, basPrix] = [await haut(bouton), await bas(prix)];
  return { hautBouton: Math.round(hautBouton), ecartPrixBouton: Math.round(hautBouton - basPrix) };
}

test.describe("/abonnement : bouton du compte connecté remonté @s21", () => {
  localSeulement();

  const email = `e2e-pli-${randomBytes(4).toString("hex")}@example.com`;
  const motDePasse = "MotDePasse-e2e-42";

  test.beforeAll(async () => {
    await creerCompte(email, motDePasse, "FREE");
  });
  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
  });

  test("bouton à 680 px au plus à 375 × 812, sans saut au chargement", async ({ page }) => {
    await connecter(page, email, motDePasse);
    // Un seul observateur par document (le script s'exécute à chaque navigation).
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __clsCarte: number; __sauts: string[] };
      w.__cls = 0;
      w.__clsCarte = 0;
      w.__sauts = [];
      type Rect = { y: number };
      type Saut = {
        value: number;
        hadRecentInput: boolean;
        sources?: { node?: Node | null; previousRect: Rect; currentRect: Rect }[];
      };
      new PerformanceObserver((liste) => {
        for (const e of liste.getEntries() as unknown as Saut[]) {
          if (e.hadRecentInput) continue;
          w.__cls += e.value;
          // Saut DANS le choix de formule : un de ses éléments bouge autrement que la carte
          // (la carte entière peut descendre avec le titre de page, c'est l'en-tête qui bouge).
          const sources = (e.sources ?? []).map((s) => ({
            el: s.node instanceof Element ? s.node : (s.node?.parentElement ?? null),
            dy: s.currentRect.y - s.previousRect.y,
          }));
          const carte = sources.find((s) => s.el?.getAttribute("data-testid") === "abonnement-offre");
          const dyCarte = carte ? carte.dy : 0;
          if (sources.some((s) => s.el?.closest("[data-testid='plan-selector']") && Math.abs(s.dy - dyCarte) > 1)) {
            w.__clsCarte += e.value;
          }
          const noms = (e.sources ?? []).map((s) => {
            const el = s.node instanceof Element ? s.node : s.node?.parentElement;
            return el ? `${el.tagName.toLowerCase()}${el.getAttribute("data-testid") ? `[${el.getAttribute("data-testid")}]` : ""}.${(el.className || "").toString().slice(0, 40)}` : "?";
          });
          w.__sauts.push(`${e.value.toFixed(4)} ${noms.join(" | ")}`);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    for (const [largeur, hauteur] of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/abonnement");
      await page.waitForLoadState("networkidle");
      const mensuel = await mesurer(page);
      await page.screenshot({ path: test.info().outputPath(`abonnement-${largeur}-mensuel.png`) });
      const { cls, clsCarte, sauts } = await page.evaluate(() => {
        const w = window as unknown as { __cls: number; __clsCarte: number; __sauts: string[] };
        return { cls: w.__cls, clsCarte: w.__clsCarte, sauts: w.__sauts };
      });
      if (sauts.length) console.log(`[pli /abonnement] ${largeur} px, sauts : ${sauts.join(" ; ")}`);
      await page.getByRole("radio", { name: "Annuel" }).check({ force: true });
      const annuel = await mesurer(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: test.info().outputPath(`abonnement-${largeur}-annuel.png`) });
      console.log(
        `[pli /abonnement] ${largeur}×${hauteur} mensuel : haut du bouton ${mensuel.hautBouton} px, écart prix-bouton ${mensuel.ecartPrixBouton} px ; annuel : ${annuel.hautBouton} px, écart ${annuel.ecartPrixBouton} px ; CLS ${cls.toFixed(4)} (dans le choix de formule : ${clsCarte.toFixed(4)})`,
      );
      // Seul le choix de formule est jugé : le saut de l'en-tête de page (titre visiteur
      // puis connecté, à la lecture de la session) existait avant ce correctif (même CLS).
      expect(clsCarte).toBe(0);
      if (largeur === 375) expect(mensuel.hautBouton).toBeLessThanOrEqual(680);
    }
  });
});
