import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete } from "../support/base-locale";

/**
 * s21 (QA M1) : la source d'entrée suit le visiteur jusqu'au paiement.
 * Chemin : /vannes, cœur d'une vanne (fenêtre Premium « favoris »), « S'abonner et la garder »,
 * /register, compte créé, paiement lancé depuis /register (tour 2 : attente dans le bouton, plus de
 * page d'attente). Attendu : `checkout-ouvert {src: "modale-favoris"}` (avant le correctif :
 * « abonnement »), une seule fois, et aucun `abonnement-vu` (on ne repasse plus par /abonnement).
 *
 * Aucun paiement : l'appel `/api/stripe/checkout` est intercepté et renvoie une page locale.
 * Événements Umami relevés par un faux traceur (`window.umami.track`), gardé en sessionStorage
 * d'une page à l'autre. Compte de test supprimé à la fin (base jetable).
 */
type Evenement = { nom: string; donnees: Record<string, unknown> };

test.describe("Mesure : source d'entrée jusqu'au paiement @s21", () => {
  localSeulement();

  const email = `e2e-m1-${randomBytes(4).toString("hex")}@example.com`;

  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
  });

  test("fenêtre Premium → inscription → checkout-ouvert avec la source de la fenêtre", async ({ page }) => {
    await page.addInitScript(() => {
      const CLE = "e2e-umami";
      const faux = {
        track: (nom: string, donnees?: Record<string, unknown>) => {
          const liste = JSON.parse(sessionStorage.getItem(CLE) ?? "[]");
          liste.push({ nom, donnees: donnees ?? {} });
          sessionStorage.setItem(CLE, JSON.stringify(liste));
        },
      };
      // Le vrai traceur (s'il se charge) ne remplace pas le faux.
      Object.defineProperty(window, "umami", { get: () => faux, set: () => undefined, configurable: true });
    });
    await page.route("**/api/stripe/checkout", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/?stripe-simule=1" }) }),
    );

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/vannes");
    await page.getByRole("button", { name: "Ajouter aux favoris (réservé Premium)" }).first().click();
    const fenetre = page.getByRole("dialog");
    await expect(fenetre).toBeVisible();
    const inscription = fenetre.locator("a[href^='/register']");
    const href = (await inscription.getAttribute("href")) ?? "";
    const callback = new URL(`http://x${href}`).searchParams.get("callbackUrl") ?? "";
    expect(callback, "callbackUrl de la fenêtre").toContain("src=modale-favoris");
    await inscription.click();

    await expect(page).toHaveURL(/\/register\?/);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("MotDePasse-e2e-42");
    const cgu = page.locator("input[type='checkbox']");
    if (await cgu.count()) await cgu.first().check();
    await page.getByRole("button", { name: /Créer mon compte/ }).click();

    // Retour sur /abonnement puis paiement « ouvert » (faux Stripe) : page d'accueil simulée.
    await page.waitForURL(/stripe-simule=1/, { timeout: 45_000 });
    const evenements = (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as Evenement[];

    const ouvert = evenements.filter((e) => e.nom === "checkout-ouvert");
    expect(ouvert, JSON.stringify(evenements)).toHaveLength(1);
    expect(ouvert[0].donnees).toMatchObject({ src: "modale-favoris", formule: "mensuel" });

    const vues = evenements.filter((e) => e.nom === "abonnement-vu");
    expect(vues.map((v) => v.donnees.src)).toEqual([]);
    // L'attente s'est faite dans le bouton de /register.
    expect(evenements.filter((e) => e.nom === "abonnement-clic").map((e) => e.donnees.declencheur)).toContain("auto");
  });
});
