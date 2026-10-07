import { test, expect, lireUrl } from "../support/fixtures";

/**
 * J1 : pages des parcours et murs Premium (lecture seule).
 * Tag @s16 = dépend du code des lots A/B/C (échoue tant qu'il n'est pas déployé).
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
  test("/vannes : 10 vannes libres puis « Tout débloquer » vers /abonnement", async ({ page }) => {
    await page.goto("/vannes");
    // Le rendu serveur liste plus de fiches ; le mur s'applique à l'hydratation.
    await expect(page.getByLabel(/^Contenu premium/i).first()).toBeVisible();
    const fiches = page.locator('main a[href^="/vannes/"]:not([href^="/vannes/theme/"])');
    const slugs = new Set(await fiches.evaluateAll((liens) => liens.map((a) => a.getAttribute("href"))));
    expect(slugs.size).toBe(10);

    const cta = page.getByRole("link", { name: "Tout débloquer" });
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/abonnement");
    expect(url.searchParams.get("returnTo")).toBe("/vannes");
    expect(url.searchParams.get("src")).toBe("vannes");

    await cta.click();
    await expect(page).toHaveURL(/\/abonnement\?/);
    await expect(page.locator("h1")).toBeVisible();
  });

  for (const rubrique of ["conseils", "videos"] as const) {
    test(`/${rubrique} : 3 fiches libres, carte verrouillée → modale → inscription puis /abonnement`, async ({ page }) => {
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

      const cta = modale.getByRole("link", { name: /m'abonner|commencer|accès/i }).first();
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
      await expect(page.getByRole("dialog")).toContainText(/2,99\s€ TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux\./);
    });
  }

  test("/parcours/machine-a-cafe : étape 2 verrouillée, l'étape 1 mène à /abonnement", async ({ page }) => {
    await page.goto("/parcours/machine-a-cafe");
    await expect(page.getByText("Termine l'étape 1 pour débloquer")).toBeVisible();

    const etape1 = page.getByRole("button", { name: /^Étape 1 :/ });
    if ((await etape1.getAttribute("aria-expanded")) !== "true") await etape1.click();
    const cta = page.getByRole("link", { name: /Voir l'accès complet|Voir l'offre Premium/ });
    await expect(cta).toBeVisible();
    const url = lireUrl(await cta.getAttribute("href"));
    expect(url.pathname).toBe("/abonnement");
    expect(url.searchParams.get("returnTo")).toBe("/parcours/machine-a-cafe");
    expect(url.searchParams.get("src")).toBe("parcours-etape");
  });

  test("/parcours/machine-a-cafe : textes s16 (« Lecture libre », étape 2 nommée verrouillée) @s16", async ({ page }) => {
    await page.goto("/parcours/machine-a-cafe");
    await expect(page.getByText("Lecture libre").first()).toBeVisible();
    await expect(page.getByText("Essai gratuit")).toHaveCount(0);
    await expect(page.getByRole("listitem").nth(1).getByLabel(/^Étape 2 : .*, verrouillée$/)).toHaveCount(1);
    const etape1 = page.getByRole("button", { name: /^Étape 1 :/ });
    if ((await etape1.getAttribute("aria-expanded")) !== "true") await etape1.click();
    await expect(page.getByText("Valider l'étape fait partie de Premium.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir l'offre Premium" })).toBeVisible();
  });
});
