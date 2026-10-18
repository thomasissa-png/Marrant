import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete, connecter } from "../support/base-locale";

/**
 * s21 concision du tunnel (choix de Thomas du 18/10), changements de STRUCTURE seulement :
 * 1. /register sans prénom, Google en premier ; prénom renseigné ensuite dans /profil ;
 * 2. haut d'accueil sans lien payant (garde-fous-s21 et blocs-appel-s21-a) ;
 * 4. un seul plein par bloc : le gratuit du mur de liste est un lien texte ;
 * 5. avantages : 4 lignes sur /abonnement, plus de liste sur le mur du carnet ;
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

  test("avantages : 4 lignes sur /abonnement, aucune sur le mur du carnet ; faits corrigés", async ({ page }) => {
    await page.goto("/abonnement");
    await expect(page.getByTestId("avantages-premium").locator("li")).toHaveCount(4);
    await expect(page.getByText(/une étape par semaine conseillée,/)).toBeVisible();
    await expect(page.getByText(/[Tt]u résilies depuis ton profil/).first()).toBeAttached();
    expect(await page.locator("main").textContent()).not.toMatch(/1 clic/);

    await page.goto("/carnet");
    await expect(page.getByTestId("carnet-paywall-bouton")).toBeVisible();
    await expect(page.getByTestId("avantages-premium")).toHaveCount(0);
  });
});
