import { test, expect, lireUrl, BASE_URL, emailInexistant } from "../support/fixtures";

/**
 * J3, J4 et retour de paiement, en lecture seule.
 * Seuls POST envoyés : login d'un compte inexistant, forgot-password sur une adresse
 * `.invalid`, reset avec jeton faux (voir la garde dans support/fixtures.ts).
 */

test.describe("Connexion et erreurs @smoke", () => {
  // Hors @s16 : le texte change au déploiement s16 (étalon 4 c), la regex accepte l'ancien et le nouveau.
  test("identifiants inexistants → « E-mail ou mot de passe incorrect. », callbackUrl conservé", async ({ page }) => {
    await page.goto("/login?callbackUrl=%2Fparcours");
    await page.getByLabel(/e-?mail/i).fill(emailInexistant());
    await page.locator("#password").fill("PasUnVraiMotDePasse-42");
    await page.getByRole("button", { name: "Se connecter" }).click();
    const erreur = page.getByRole("alert").filter({ hasText: /E-?mail ou mot de passe incorrect\./ });
    await expect(erreur).toBeVisible();
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fparcours/);
  });

  test("après une erreur : e-mail gardé, focus sur le mot de passe @s16", async ({ page }) => {
    const email = emailInexistant();
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(email);
    await page.locator("#password").fill("PasUnVraiMotDePasse-42");
    await page.getByRole("button", { name: "Se connecter" }).click();
    // Étalon 4 c validé (lot E), mot pour mot, suivi de l'aide « compte Google » (étalon 4 b).
    const alerte = page.getByRole("alert").filter({ hasText: "incorrect" });
    await expect(alerte).toContainText("E-mail ou mot de passe incorrect. Réessaie, ou réinitialise ton mot de passe.");
    await expect(alerte).toContainText("Si tu as créé ton compte avec Google, clique sur « Continuer avec Google ».");
    await expect(page.getByLabel(/e-?mail/i)).toHaveValue(email);
    await expect(page.locator("#password")).toBeFocused();
  });

  test("mot de passe oublié sur une adresse inexistante → message neutre (anti-énumération)", async ({ page }, info) => {
    // Limite s16 : 3 demandes / h par IP. Un seul gabarit, et un 429 rend le test non concluant.
    test.skip(info.project.name !== "desktop", "un seul envoi par lancement (limite 3/h par IP)");
    await page.goto("/forgot-password");
    await page.getByLabel(/e-?mail/i).fill(emailInexistant());
    const reponse = page.waitForResponse((r) => r.url().endsWith("/api/auth/forgot-password"));
    await page.getByRole("button", { name: "Envoyer le lien" }).click();
    test.skip((await reponse).status() === 429, "limite 3/h par IP atteinte : relancer plus tard");
    await expect(page.getByText(/Si un compte existe avec cet email/)).toBeVisible();
  });

  test("/reset-password?token=faux → lien cassé, renvoi vers une nouvelle demande", async ({ page }) => {
    await page.goto("/reset-password?token=faux");
    await expect(page.getByText(/Ce lien est cassé ou incomplet/)).toBeVisible();
    await expect(page.getByRole("link", { name: /nouveau lien/i })).toHaveAttribute("href", /\/forgot-password/);
  });

  test("/reset-password avec un jeton faux soumis → « Lien invalide ou expiré »", async ({ page }) => {
    await page.goto(`/reset-password?token=faux-e2e&email=${encodeURIComponent(emailInexistant())}`);
    const champs = page.locator('input[type="password"]');
    await champs.nth(0).fill("NouveauMotDePasse-42");
    await champs.nth(1).fill("NouveauMotDePasse-42");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/Lien invalide ou expiré/)).toBeVisible();
  });
});

test.describe("callbackUrl hostiles rejetés @smoke", () => {
  const HOSTILES = ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)"];

  for (const hostile of HOSTILES) {
    test(`login ?callbackUrl=${hostile} : ni Google ni l'inscription ne l'emportent`, async ({ page }) => {
      let corpsGoogle = "";
      // Intercepté et coupé avant le serveur : aucun départ réel vers Google.
      await page.route("**/api/auth/signin/google**", async (route) => {
        corpsGoogle = decodeURIComponent(route.request().postData() ?? "");
        await route.abort();
      });
      await page.goto(`/login?callbackUrl=${encodeURIComponent(hostile)}`);

      const inscription = page.getByRole("main").locator('a[href^="/register"]').first();
      const url = lireUrl(await inscription.getAttribute("href"));
      expect(url.searchParams.get("callbackUrl") ?? "").not.toContain("evil.example");
      expect(url.searchParams.get("callbackUrl") ?? "").not.toMatch(/^javascript:/i);

      await page.getByRole("button", { name: "Continuer avec Google" }).click();
      await expect.poll(() => corpsGoogle).toContain("callbackUrl=");
      const cible = /callbackUrl=([^&]*)/.exec(corpsGoogle)?.[1] ?? "";
      const absolue = new URL(cible, BASE_URL);
      expect(absolue.origin, `callbackUrl envoyé à Google : ${cible}`).toBe(new URL(BASE_URL).origin);
      expect(cible).not.toMatch(/evil\.example|javascript:/i);
    });
  }

  test("GET NextAuth /api/auth/signin?callbackUrl=https://evil.example ne redirige pas hors du site", async ({ request }) => {
    const r = await request.get("/api/auth/signin?callbackUrl=https%3A%2F%2Fevil.example", { maxRedirects: 0 });
    expect([200, 302, 303, 307]).toContain(r.status());
    const location = r.headers()["location"] ?? "";
    expect(decodeURIComponent(location)).not.toMatch(/^https?:\/\/evil\.example/);
  });

  for (const protegee of ["/profil", "/favoris"]) {
    test(`${protegee} sans session → /login?callbackUrl=${protegee}`, async ({ page }) => {
      await page.goto(protegee);
      await expect(page).toHaveURL(new RegExp(`/login\\?callbackUrl=${encodeURIComponent(protegee)}`));
    });
  }
});

test.describe("Retour de paiement en visiteur @smoke", () => {
  test("/abonnement/success sans session → « Me connecter » rapide (étalon 5a.2), jamais « Paiement reçu » @s16", async ({ page }) => {
    const debut = Date.now();
    await page.goto("/abonnement/success?session_id=cs_test_e2e_inexistant");
    await expect(page.getByRole("heading", { name: "Connecte-toi pour retrouver ton abonnement" })).toBeVisible({ timeout: 8_000 });
    expect(Date.now() - debut, "délai avant le bouton de connexion").toBeLessThan(8_000);
    const bouton = page.getByRole("main").getByRole("link", { name: "Me connecter" });
    const url = lireUrl(await bouton.getAttribute("href"));
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("callbackUrl")).toBe("/abonnement/success?session_id=cs_test_e2e_inexistant");
    await expect(bouton).toBeVisible();
    await expect(page.getByText("Paiement reçu")).toHaveCount(0);
    await expect(page.getByText(/ton accès arrive dans quelques instants/)).toHaveCount(0);
  });
});
