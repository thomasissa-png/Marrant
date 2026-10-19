import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter, BASE_URL } from "../support/base-locale";

/**
 * Revue design s21 v2, « à corriger avant mise en ligne » 1 : /abonnement, compte connecté
 * sans abonnement. Le prix et le bouton ne sont plus séparés par la hauteur réservée aux
 * lignes de la formule annuelle (vide d'environ 60 px à 320/360/375).
 * - 375 × 812 : haut du bouton à 680 px au plus.
 * - Aucun saut de mise en page au chargement (layout-shift cumulé nul sur la carte).
 * - s21 (CLS de page) : la session est lue par le serveur, la version connectée est dans le
 *   HTML ; CLS total de la page < 0,05 à 320, 360 et 375 (0,164 / 0,114 / 0,095 avant).
 * - Bascule mensuel/annuel : un changement de hauteur est accepté (choix du 18/10).
 * - s21 (QA v3 m-3) : mesure aussi en émulation mobile tactile (isMobile, hasTouch, DPR 3),
 *   comme la QA : bas du bouton à 700 px au plus à 360 × 740, à 690 px au plus à 375 × 700
 *   (avant : 732 et 700 ; la QA mesurait 752 à 360). L'émulation bureau ne voyait pas l'écart.
 * Mesures écrites dans la sortie du test (avant/après du correctif).
 */
const LARGEURS: [number, number][] = [
  [320, 568],
  [360, 740],
  [375, 812],
];

async function mesurer(page: Page) {
  // Trajet de conversion s21 : bouton du premier écran (« S'abonner », compte connecté) et
  // cartes de formule juste au-dessus.
  const bouton = page.getByTestId("abonnement-bouton-haut");
  await expect(bouton).toBeVisible();
  const prix = page.getByTestId("plan-selector");
  // Positions dans le document (indépendantes du défilement).
  const haut = (l: typeof bouton) => l.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const bas = (l: typeof bouton) => l.evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
  const [hautBouton, basPrix] = [await haut(bouton), await bas(prix)];
  return { hautBouton: Math.round(hautBouton), ecartPrixBouton: Math.round(hautBouton - basPrix) };
}

/** s21 (QA v3 m-3) : émulation mobile tactile, bas du bouton (mensuel) au premier écran. */
const MOBILE: { largeur: number; hauteur: number; basMax: number }[] = [
  { largeur: 360, hauteur: 740, basMax: 700 },
  { largeur: 375, hauteur: 700, basMax: 690 },
  { largeur: 375, hauteur: 812, basMax: 728 },
];

/** Layout-shift cumulé de la page (`__cls`) et dans le choix de formule (`__clsCarte`). */
async function poserObservateur(page: Page) {
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
}

async function lireSauts(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __cls: number; __clsCarte: number; __sauts: string[] };
    return { cls: w.__cls, clsCarte: w.__clsCarte, sauts: w.__sauts };
  });
}

test.describe("/abonnement : bouton du compte connecté remonté, sans saut @s21", () => {
  localSeulement();

  const email = `e2e-pli-${randomBytes(4).toString("hex")}@example.com`;
  const motDePasse = "MotDePasse-e2e-42";

  test.beforeAll(async () => {
    await creerCompte(email, motDePasse, "FREE");
  });
  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
  });

  test("bouton à 680 px au plus à 375 × 812, CLS < 0,05 au chargement", async ({ page }) => {
    await connecter(page, email, motDePasse);
    await poserObservateur(page);
    for (const [largeur, hauteur] of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/abonnement");
      await page.waitForLoadState("networkidle");
      const mensuel = await mesurer(page);
      await page.screenshot({ path: test.info().outputPath(`abonnement-${largeur}-mensuel.png`) });
      const { cls, clsCarte, sauts } = await lireSauts(page);
      if (sauts.length) console.log(`[pli /abonnement] ${largeur} px, sauts : ${sauts.join(" ; ")}`);
      await page.getByRole("radio", { name: "Annuel" }).check({ force: true });
      const annuel = await mesurer(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: test.info().outputPath(`abonnement-${largeur}-annuel.png`) });
      console.log(
        `[pli /abonnement] ${largeur}×${hauteur} mensuel : haut du bouton ${mensuel.hautBouton} px, écart prix-bouton ${mensuel.ecartPrixBouton} px ; annuel : ${annuel.hautBouton} px, écart ${annuel.ecartPrixBouton} px ; CLS ${cls.toFixed(4)} (dans le choix de formule : ${clsCarte.toFixed(4)})`,
      );
      expect(clsCarte).toBe(0);
      // s21 (CLS) : plus de bascule visiteur puis connecté de l'en-tête et de la carte.
      expect(cls).toBeLessThan(0.05);
      if (largeur === 375) expect(mensuel.hautBouton).toBeLessThanOrEqual(680);
    }
  });

  test("émulation mobile tactile : bouton entier au premier écran (360 × 740, 375 × 700), CLS nul", async ({
    page,
    browser,
  }) => {
    await connecter(page, email, motDePasse);
    const session = await page.context().storageState();
    for (const { largeur, hauteur, basMax } of MOBILE) {
      const ctx = await browser.newContext({
        baseURL: BASE_URL,
        viewport: { width: largeur, height: hauteur },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
        locale: "fr-FR",
        timezoneId: "Europe/Paris",
        storageState: session,
      });
      const mobile = await ctx.newPage();
      await poserObservateur(mobile);
      await mobile.goto("/abonnement");
      await mobile.waitForLoadState("networkidle");
      const bouton = mobile.getByTestId("abonnement-bouton-haut");
      await expect(bouton).toBeVisible();
      // Position dans l'écran au chargement (sans défilement).
      const { haut, bas } = await bouton.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { haut: Math.round(r.top + window.scrollY), bas: Math.round(r.bottom + window.scrollY) };
      });
      const { cls, clsCarte } = await lireSauts(mobile);
      await mobile.screenshot({ path: test.info().outputPath(`abonnement-mobile-${largeur}x${hauteur}.png`) });
      console.log(
        `[pli /abonnement] mobile ${largeur}×${hauteur} DPR 3 : bouton ${haut}-${bas} px (bas max ${basMax}) ; CLS ${cls.toFixed(4)}`,
      );
      await ctx.close();
      expect(bas).toBeLessThanOrEqual(basMax);
      expect(clsCarte).toBe(0);
      expect(cls).toBeLessThan(0.05);
    }
  });

  test("visiteur : CLS < 0,05 au chargement (version visiteur dans le HTML, inchangée)", async ({ page }) => {
    await poserObservateur(page);
    for (const [largeur, hauteur] of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/abonnement");
      await page.waitForLoadState("networkidle");
      await expect(page.getByTestId("abonnement-bouton-achat")).toBeVisible();
      const { cls, sauts } = await lireSauts(page);
      if (sauts.length) console.log(`[pli /abonnement] visiteur ${largeur} px, sauts : ${sauts.join(" ; ")}`);
      console.log(`[pli /abonnement] visiteur ${largeur}×${hauteur} : CLS ${cls.toFixed(4)}`);
      expect(cls).toBeLessThan(0.05);
    }
  });
});
