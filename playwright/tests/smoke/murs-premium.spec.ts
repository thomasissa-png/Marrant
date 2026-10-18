import { test, expect, lireUrl, texteValide } from "../support/fixtures";
import { REASSURANCE_UNIQUE, VALIDATION_ETAPE } from "@/config/textes/offre";
import { progressionVisiteurTexte } from "@/config/textes/parcours";
import { FENETRE_PREMIUM, MUR_LISTE, MUR_PARCOURS } from "@/config/textes/cta-pages";

/**
 * J1 : pages des parcours et murs Premium (lecture seule).
 * Tag @s16 = dépend du code des lots A/B/C (échoue tant qu'il n'est pas déployé).
 * Tag @s21 = dépend du lot 2 s21 (libellés des murs), même règle.
 * Textes : constantes du dépôt (`apps/web/src/config/textes`), jamais recopiés.
 */

const PAGES_PARCOURS = [
  "/",
  "/vannes",
  "/conseils",
  "/videos",
  "/parcours",
  "/parcours/machine-a-cafe",
  "/abonnement",
  "/register",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/cgu",
  "/confidentialite",
  "/mentions-legales",
  "/retractation",
];

test.describe("Pages des parcours @smoke", () => {
  for (const chemin of PAGES_PARCOURS) {
    // H1 de /reset-password sans jeton ajouté en s16 (lot F) : tagué @s16.
    const tag = chemin === "/reset-password" ? " @s16" : "";
    test(`${chemin} répond 200 avec un H1 unique et sans texte cassé${tag}`, async ({ page }) => {
      const reponse = await page.goto(chemin);
      expect(reponse?.status(), `statut HTTP de ${chemin}`).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const texte = await page.locator("body").innerText();
      expect(texte).not.toMatch(/\bundefined\b|\[object Object\]|\bNaN\b|Lorem ipsum/);
    });
  }
});

test.describe("Murs Premium @smoke", () => {
  // s21 B7 : plus de bandeau en haut ; bloc de bas de liste (MurListe) après la 10e vanne.
  test("/vannes : 10 vannes libres puis le bloc de bas de liste vers /abonnement @s21", async ({ page }) => {
    await page.goto("/vannes");
    // Le rendu serveur liste plus de fiches ; le mur s'applique à l'hydratation.
    await expect(page.getByLabel(/^Contenu premium/i).first()).toBeVisible();
    const fiches = page.locator('main a[href^="/vannes/"]:not([href^="/vannes/theme/"])');
    const slugs = new Set(await fiches.evaluateAll((liens) => liens.map((a) => a.getAttribute("href"))));
    expect(slugs.size).toBe(10);

    await expect(page.getByText(texteValide(MUR_LISTE.vannes.limite))).toBeVisible();
    const cta = page.getByRole("link", { name: MUR_LISTE.vannes.bouton });
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/abonnement");
    expect(url.searchParams.get("returnTo")).toBe("/vannes");
    expect(url.searchParams.get("src")).toBe("mur-vannes");
    // Lien vers l'étape 1 gratuite (GRATUIT_P), sous le plein et la REASS.
    await expect(page.getByRole("link", { name: texteValide(MUR_LISTE.vannes.contour(MUR_PARCOURS)) })).toBeVisible();

    await cta.click();
    await expect(page).toHaveURL(/\/abonnement\?/);
    await expect(page.locator("h1")).toBeVisible();
  });

  for (const rubrique of ["conseils", "videos"] as const) {
    test(`/${rubrique} : 3 fiches libres, carte verrouillée → modale → inscription puis /abonnement @s21`, async ({ page }) => {
      await page.goto(`/${rubrique}`);
      // Le rendu serveur liste plus de fiches ; le mur s'applique à l'hydratation.
      await expect(page.getByLabel(/^Contenu premium/i).first()).toBeVisible();
      const fiches = page.locator(`main a[href^="/${rubrique}/"]`);
      const slugs = new Set(await fiches.evaluateAll((liens) => liens.map((a) => a.getAttribute("href"))));
      expect(slugs.size).toBe(3);

      // Libellé avant s16 « Contenu premium : cliquer pour débloquer », après « Contenu Premium : voir l'offre ».
      const carte = page.getByLabel(/^Contenu premium/i).first();
      await carte.scrollIntoViewIfNeeded();
      await carte.click();
      const modale = page.getByRole("dialog");
      await expect(modale).toBeVisible();

      // s21 B11 : bouton par geste (« Je m'abonne et j'ouvre toute la liste »).
      const cta = modale.getByRole("link", { name: FENETRE_PREMIUM.carte[rubrique === "conseils" ? "conseil" : "video"].bouton });
      const url = lireUrl(await cta.getAttribute("href"));
      expect(url.pathname).toBe("/register");
      const retour = lireUrl(url.searchParams.get("callbackUrl"));
      expect(retour.pathname).toBe("/abonnement");
      expect(retour.searchParams.get("returnTo")).toBe(`/${rubrique}`);
      expect(url.searchParams.get("src")).toMatch(/^modale-/);
    });

    test(`/${rubrique} : cartes verrouillées en role=button nommées « Contenu Premium : voir l'offre » @s16`, async ({ page }) => {
      await page.goto(`/${rubrique}`);
      const carte = page.getByRole("button", { name: "Contenu Premium : voir l'offre" }).first();
      await expect(carte).toBeVisible();
      await carte.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
      // REASS unique (concision v5), sous le bouton de la modale.
      await expect(page.getByRole("dialog")).toContainText(texteValide(REASSURANCE_UNIQUE));
    });
  }

  test("/parcours/machine-a-cafe : étape 2 verrouillée, l'étape 1 mène à /register puis au paiement @s21", async ({ page }) => {
    await page.goto("/parcours/machine-a-cafe");
    // Visiteur (s17) : plus de « Termine l'étape 1 pour débloquer » (réservé à l'abonné,
    // ordre conseillé) ; la progression annonce l'étape 1 offerte et les suivantes avec Premium.
    const etapes = await page.getByRole("button", { name: /^Étape \d+ :/ }).count();
    expect(etapes).toBeGreaterThan(1);
    // Concision v5 : « Étape 1 gratuite, la suite avec Premium », plus d'intro ni de badge « Fait partie de Premium ».
    await expect(page.getByText(progressionVisiteurTexte())).toBeVisible();
    await expect(page.getByText("Fait partie de Premium")).toHaveCount(0);

    const etape1 = page.getByRole("button", { name: /^Étape 1 :/ });
    if ((await etape1.getAttribute("aria-expanded")) !== "true") await etape1.click();
    // Concision v5 : « Passer à l'étape 2 · 2,99 €/mois ». Revue v3 m6 (9a03c41) : quiz fini ou en
    // cours, le visiteur passe par /register (src=parcours-etape), le paiement s'ouvre ensuite
    // (callbackUrl vers /abonnement, retour au parcours). Même attendu que concision-s21.spec.ts.
    const cta = page.getByRole("link", { name: VALIDATION_ETAPE.bouton });
    await expect(cta).toBeVisible();
    const href = (await cta.getAttribute("href")) ?? "";
    expect(href.match(/parcours-etape/g), href).toHaveLength(1);
    const url = lireUrl(href);
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("src")).toBe("parcours-etape");
    expect(url.searchParams.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fparcours%2Fmachine-a-cafe");
  });

  test("/parcours/machine-a-cafe : textes s16 (« Lecture libre », étape 2 en aperçu) @s16 @s21", async ({ page }) => {
    await page.goto("/parcours/machine-a-cafe");
    await expect(page.getByText("Lecture libre").first()).toBeVisible();
    await expect(page.getByText("Essai gratuit")).toHaveCount(0);
    // Concision v5 : badge « Fait partie de Premium » retiré ; le nom vocal = le texte visible.
    await expect(page.getByRole("listitem").nth(1).getByRole("button", { name: /^Étape 2 : / })).toHaveCount(1);
    const etape1 = page.getByRole("button", { name: /^Étape 1 :/ });
    if ((await etape1.getAttribute("aria-expanded")) !== "true") await etape1.click();
    await expect(page.getByText(texteValide(VALIDATION_ETAPE.texte))).toBeVisible();
    // Concision v5 : « Passer à l'étape 2 · 2,99 €/mois ».
    await expect(page.getByRole("link", { name: VALIDATION_ETAPE.bouton })).toBeVisible();
    // Nom exact : le bouton d'en-tête s'appelle « 2,99 € par mois : voir l'offre Premium » (B6, textes validés).
    await expect(page.getByRole("link", { name: "Voir l'offre Premium", exact: true })).toHaveCount(0);
  });
});
