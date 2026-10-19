import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete, connecter } from "../support/base-locale";

/**
 * s21 concision du tunnel (choix de Thomas du 18/10), changements de STRUCTURE seulement :
 * 1. /register sans prénom, Google en premier ; prénom renseigné ensuite dans /profil ;
 * 2. haut d'accueil sans lien payant (garde-fous-s21 et blocs-appel-s21-a) ;
 * 4. un seul plein par bloc : le gratuit du mur de liste est un lien texte ;
 * 5. avantages : 3 lignes sur /abonnement (trajet de conversion s21), plus de liste sur le mur du carnet ;
 * 6. faits faux : « Tu résilies depuis ton profil », « une étape par semaine conseillée ».
 * Base jetable, compte de test supprimé à la fin, aucun e-mail ni paiement.
 */
test.describe("Concision du tunnel (structure) @s21", () => {
  localSeulement();

  const email = `e2e-concision-${randomBytes(4).toString("hex")}@example.com`;
  const motDePasse = "MotDePasse-e2e-42";

  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
  });

  test("/register : e-mail et mot de passe seuls, Google d'abord ; le prénom se renseigne dans /profil", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.9.${randomBytes(1)[0]}.${randomBytes(1)[0]}` });
    await page.route("**/api/stripe/checkout", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/?stripe-simule=1" }) }),
    );
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/register");
    const ids = await page.locator("form input").evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(["email", "password"]);
    const ordre = await page.evaluate(() => {
      const google = Array.from(document.querySelectorAll("button")).find((b) => /avec Google/.test(b.textContent ?? ""));
      const champ = document.getElementById("email");
      return google && champ ? google.compareDocumentPosition(champ) & Node.DOCUMENT_POSITION_FOLLOWING : 0;
    });
    expect(ordre, "Google avant le champ e-mail").toBeTruthy();

    await page.locator("#email").fill(email);
    await page.locator("#password").fill(motDePasse);
    await page.getByRole("button", { name: /^Créer mon compte/ }).click();
    await page.waitForURL(/stripe-simule=1/, { timeout: 45_000 });
    const [cree] = await requete<{ name: string | null }>(`SELECT name FROM "User" WHERE email = $1`, [email]);
    expect(cree.name).toBeNull();

    await connecter(page, email, motDePasse);
    await page.goto("/profil");
    const carte = page.getByTestId("profil-prenom");
    await expect(carte).toBeVisible();
    await carte.getByRole("textbox").fill("Camille");
    await carte.getByRole("button").click();
    await expect.poll(async () => (await requete<{ name: string | null }>(`SELECT name FROM "User" WHERE email = $1`, [email]))[0].name).toBe("Camille");
  });

  test("mur de /vannes : un seul plein, le gratuit en lien texte", async ({ page }) => {
    await page.goto("/vannes");
    const mur = page.locator("[data-mur-liste='vannes']");
    await mur.scrollIntoViewIfNeeded();
    await expect(mur.locator("a.bg-accent-secondary-hover")).toHaveCount(1);
    const gratuit = mur.locator("a[data-mur-cta='etape-1']");
    await expect(gratuit).toBeVisible();
    expect(await gratuit.getAttribute("class")).toContain("underline");
    expect(await gratuit.getAttribute("class")).not.toMatch(/\bborder\b/);
  });

  test("avantages : 3 lignes sur /abonnement (lettre absente), aucune sur le mur du carnet ; faits corrigés", async ({ page }) => {
    await page.goto("/abonnement");
    // Trajet de conversion s21 (étalon A) : 3 avantages tant que la promesse de la lettre est fermée.
    await expect(page.getByTestId("avantages-premium").locator("li")).toHaveCount(3);
    await expect(page.getByText(/^Les listes ne s.arrêtent plus à la dixième vanne, les parcours vont au bout\.$/)).toBeVisible();
    await expect(page.getByTestId("reassurance-paiement")).toHaveText(/^Premium\s:\spremier\spaiement\sremboursable\ssous\s14\sjours\.\sRésiliable\sdepuis\ston\sprofil\.$/);
    expect(await page.locator("main").textContent()).not.toMatch(/1 clic/);

    await page.goto("/carnet");
    await expect(page.getByTestId("carnet-paywall-bouton")).toBeVisible();
    await expect(page.getByTestId("avantages-premium")).toHaveCount(0);
  });

  test("fin de l'étape 1 (visiteur) : une seule source dans l'URL, lettre en ligne repliée qui déplie son champ au clic", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Préchargements de routes coupés : le pied de page (« La lettre du mois ») précharge /lettre, qui embarque
    // le formulaire ; selon le défilement du quiz, il arrivait avant le clic et le test devenait aléatoire.
    // On mesure ici le JS de la page elle-même : le formulaire doit arriver au dépliage.
    await page.route("**/*", (route) => (route.request().headers()["next-router-prefetch"] ? route.abort() : route.continue()));
    await page.goto("/parcours/repartie");
    // Quiz de l'étape 1 : première réponse à chaque question, jusqu'au résultat.
    for (let i = 0; i < 10; i++) {
      const suite = page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ });
      const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
      if ((await options.count()) === 0) break;
      await options.first().click();
      await suite.click();
    }
    const fin = page.locator("[data-fin-etape-1]");
    await expect(fin).toBeVisible();
    await expect(fin.getByText("Bien joué !")).toBeVisible();
    const plein = fin.locator('a[data-fin-etape-1-cta="premium"]');
    await expect(plein).toHaveText(/^Passer à l['’]étape 2\s·\s2,99\s€\/mois$/);
    const href = (await plein.getAttribute("href")) ?? "";
    expect(href.match(/parcours-etape/g), href).toHaveLength(1);
    const url = new URL(href, "http://localhost");
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("src")).toBe("parcours-etape");
    expect(url.searchParams.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fparcours%2Frepartie");
    // Lettre : ligne discrète, fermée au chargement (aucun champ), dépliée au clic. Finition du tour 3 :
    // sous la liste des étapes, plus collée au plein payant.
    const ligne = page.getByRole("button", { name: /^Lettre gratuite\s:\sune vanne décryptée par mois\.$/ });
    await expect(ligne).toHaveAttribute("aria-expanded", "false");
    await expect(fin.getByRole("button", { name: /Lettre gratuite/ })).toHaveCount(0);
    const liste = page.getByRole("list", { name: "Étapes du parcours" });
    expect(await liste.evaluate((l, b) => !!(l.compareDocumentPosition(b!) & Node.DOCUMENT_POSITION_FOLLOWING), await ligne.elementHandle())).toBe(true);
    await expect(page.locator('main input[type="email"]')).toHaveCount(0);
    // Positions dans la page (et non dans l'écran) : le champ prend le focus au dépliage, le
    // navigateur peut faire défiler pour le montrer (ligne en bas d'écran à 375 x 812).
    const yPage = async (l: typeof plein) => ((await l.boundingBox())?.y ?? NaN) + (await page.evaluate(() => window.scrollY));
    const avant = await yPage(plein);
    const ligneAvant = await yPage(ligne);
    // QA v4 m-7 : le formulaire n'est pas dans le JS de la page, il arrive au dépliage.
    const morceau = page.waitForResponse((r) => r.url().includes("/_next/static/chunks/") && r.request().resourceType() === "script");
    await ligne.click();
    await morceau;
    await expect(page.locator('main input[type="email"]')).toBeFocused();
    await expect(page.locator("main").getByRole("checkbox")).toBeVisible();
    // Le plein ne bouge pas quand la lettre se déplie (elle est dessous), la ligne non plus.
    expect(Math.abs((await yPage(plein)) - avant)).toBeLessThanOrEqual(0.5);
    expect(Math.abs((await yPage(ligne)) - ligneAvant)).toBeLessThanOrEqual(0.5);
    await expect(ligne).toHaveAttribute("aria-expanded", "true");
  });
});
