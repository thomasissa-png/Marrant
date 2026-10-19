import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * s21 (QA v2 MJ-1) : le bouton E1 du carnet transmet sa source jusqu'au paiement.
 * - Visiteur : /carnet → E1 → /abonnement → /register → retour automatique, paiement lancé seul.
 *   Attendu : `checkout-ouvert {src: "carnet"}` (avant le correctif : « abonnement »).
 * - Compte sans abonnement : article → encart B1 → /carnet?src=blog-demo-milieu-1 → E1 →
 *   /abonnement → paiement. Attendu : la source d'origine de l'article, `blog-demo-milieu-1`
 *   (convention de la QA M1 : la source d'entrée suit le visiteur).
 *
 * Aucun paiement : `/api/stripe/checkout` est intercepté. Faux traceur Umami gardé en
 * sessionStorage. Comptes de test supprimés à la fin (base jetable). Chaque test simule son
 * propre visiteur (`cf-connecting-ip`), comme Cloudflare, pour ne pas partager la limite d'inscription.
 */
type Evenement = { nom: string; donnees: Record<string, unknown> };
const ARTICLE = "/blog/meilleures-blagues-droles-2026";

async function preparer(page: Page) {
  const ip = `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}`;
  await page.setExtraHTTPHeaders({ "cf-connecting-ip": ip });
  await page.addInitScript(() => {
    const CLE = "e2e-umami";
    const faux = {
      track: (nom: string, donnees?: Record<string, unknown>) => {
        const liste = JSON.parse(sessionStorage.getItem(CLE) ?? "[]");
        liste.push({ nom, donnees: donnees ?? {} });
        sessionStorage.setItem(CLE, JSON.stringify(liste));
      },
    };
    Object.defineProperty(window, "umami", { get: () => faux, set: () => undefined, configurable: true });
  });
  await page.route("**/api/stripe/checkout", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/?stripe-simule=1" }) }),
  );
  await page.setViewportSize({ width: 375, height: 812 });
}

async function evenements(page: Page): Promise<Evenement[]> {
  return (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as Evenement[];
}

test.describe("Mesure : source du bouton E1 du carnet jusqu'au paiement @s21", () => {
  localSeulement();

  const emailVisiteur = `e2e-mj1-v-${randomBytes(4).toString("hex")}@example.com`;
  const emailCompte = `e2e-mj1-c-${randomBytes(4).toString("hex")}@example.com`;
  const motDePasse = "MotDePasse-e2e-42";

  test.beforeAll(async () => {
    await creerCompte(emailCompte, motDePasse, "FREE");
  });
  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [[emailVisiteur, emailCompte]]);
  });

  test("visiteur : /carnet → E1 → inscription → checkout-ouvert {src: carnet}", async ({ page }) => {
    await preparer(page);
    await page.goto("/carnet");
    const e1 = page.getByTestId("carnet-paywall-bouton");
    await expect(e1).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
    await e1.click();
    await expect(page).toHaveURL(/\/abonnement\?.*src=carnet/);

    const inscription = page.locator("main a[href^='/register']").first();
    const callback = new URL(`http://x${(await inscription.getAttribute("href")) ?? ""}`).searchParams.get("callbackUrl") ?? "";
    expect(callback, "callbackUrl de /abonnement").toContain("src=carnet");
    await inscription.click();

    await expect(page).toHaveURL(/\/register\?/);
    await page.locator("#email").fill(emailVisiteur);
    await page.locator("#password").fill(motDePasse);
    const cgu = page.locator("input[type='checkbox']");
    if (await cgu.count()) await cgu.first().check();
    await page.getByRole("button", { name: /Créer mon compte/ }).click();

    await page.waitForURL(/stripe-simule=1/, { timeout: 45_000 });
    const liste = await evenements(page);
    const ouvert = liste.filter((e) => e.nom === "checkout-ouvert");
    expect(ouvert, JSON.stringify(liste)).toHaveLength(1);
    expect(ouvert[0].donnees).toMatchObject({ src: "carnet", formule: "mensuel" });
  });

  test("compte sans abonnement : article → carnet → E1 → checkout-ouvert avec la source de l'article", async ({ page }) => {
    await preparer(page);
    await connecter(page, emailCompte, motDePasse);

    await page.goto(ARTICLE);
    const demo = page.locator("a[href^='/carnet?src=blog-demo-milieu-1']").first();
    await demo.scrollIntoViewIfNeeded();
    await demo.click();
    await expect(page).toHaveURL(/\/carnet/);

    const e1 = page.getByTestId("carnet-paywall-bouton");
    await expect(e1).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=blog-demo-milieu-1");
    await e1.click();
    await expect(page).toHaveURL(/\/abonnement\?.*src=blog-demo-milieu-1/);

    // Trajet de conversion s21 : « S'abonner » (bouton du premier écran).
    await page.getByTestId("abonnement-bouton-haut").click();
    await page.waitForURL(/stripe-simule=1/, { timeout: 30_000 });
    const liste = await evenements(page);
    const ouvert = liste.filter((e) => e.nom === "checkout-ouvert");
    expect(ouvert, JSON.stringify(liste)).toHaveLength(1);
    expect(ouvert[0].donnees).toMatchObject({ src: "blog-demo-milieu-1", formule: "mensuel" });
  });
});
