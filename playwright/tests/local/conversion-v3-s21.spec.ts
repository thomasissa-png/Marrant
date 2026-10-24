import { randomBytes } from "node:crypto";
import type { Page, Route } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter, urlRetourStripeSimule } from "../support/base-locale";

/**
 * Trajet de conversion s21, tour 3 (docs/copy/conversion-s21/textes-trajet-v3.md §5) :
 * - retour sur la page d'origine après le paiement (bouton « Premium » de l'en-tête), bienvenue BV1 ;
 * - mises en page M1 à M4 et M7, chacune avec son contrôle (320 × 640, 1 280 px).
 * Paiement simulé comme dans `conversion-v2-s21.spec.ts` (plan Premium en base, success_url de Stripe).
 */
const MDP = "MotDePasse-e2e-42";
const comptes: string[] = [];

async function visiteurSimule(page: Page) {
  await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` });
}

async function basDe(page: Page, testId: string): Promise<number> {
  const box = await page.getByTestId(testId).boundingBox();
  expect(box, testId).not.toBeNull();
  return Math.round(box!.y + box!.height);
}

test.describe("@s21 trajet de conversion, tour 3", () => {
  localSeulement();
  test.setTimeout(120_000);

  test.afterAll(async () => {
    if (!comptes.length) return;
    await requete(`DELETE FROM "UserFavorite" WHERE "userId" IN (SELECT id FROM "User" WHERE email = ANY($1))`, [comptes]);
    await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [comptes]);
  });

  test("retour sur la page d'origine : /conseils → « Premium » → compte → paiement → /conseils, bienvenue BV1", async ({ page }) => {
    const email = `e2e-retour-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await visiteurSimule(page);
    await page.route("**/api/stripe/checkout", async (route: Route) => {
      const corps = JSON.parse(route.request().postData() ?? "{}") as Record<string, string>;
      expect(corps.returnTo).toBe("/conseils");
      await requete(`UPDATE "User" SET plan = 'PREMIUM'::"Plan" WHERE email = $1`, [email]);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: urlRetourStripeSimule(corps) }),
      });
    });
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/conseils");
    const premium = page.getByRole("banner").locator("a[href^='/abonnement'][href*='src=header']").filter({ visible: true }).first();
    expect(await premium.getAttribute("href")).toBe("/abonnement?returnTo=%2Fconseils&src=header");
    await premium.click();
    await page.getByTestId("abonnement-bouton-achat").click();
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(MDP);
    await page.getByRole("button", { name: /Créer mon compte/ }).click();
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    expect(new URL(page.url()).pathname).toBe("/conseils");
    // frTypo : gluon (U+2060) après le trait d'union de « Sers-toi ».
    await expect(page.getByTestId("bienvenue-texte")).toHaveText(/^Tout est ouvert\s:\sles listes, les parcours, les carnets\. Sers-\u2060?toi\.$/);
  });

  test("QA m2 : session perdue au retour de Stripe, puis connexion → page d'origine, favori ajouté, bienvenue", async ({ page }) => {
    const email = `e2e-m2-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    // Le webhook est passé (compte Premium), mais le navigateur revient de Stripe sans session.
    await creerCompte(email, MDP, "PREMIUM");
    const [vanne] = await requete<{ id: string }>(`SELECT id FROM "Joke" WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT 1`);
    await visiteurSimule(page);
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto(urlRetourStripeSimule({ returnTo: `/vannes?favori=JOKE.${vanne.id}` }));
    const connexion = page.getByRole("main").locator("a[href^='/login?callbackUrl=']").filter({ visible: true }).first();
    await expect(connexion).toBeVisible({ timeout: 30_000 });
    await connexion.click();
    await page.getByLabel(/e-?mail/i).fill(email);
    await page.locator("#password").fill(MDP);
    await page.getByRole("button", { name: "Se connecter" }).click();
    // Avant le correctif : le middleware renvoyait le compte Premium de /abonnement/success vers /vannes.
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    const arrivee = new URL(page.url());
    expect(arrivee.pathname).toBe("/vannes");
    expect(arrivee.searchParams.get("favori")).toBe("JOKE");
    const favoris = await requete<{ jokeId: string }>(
      `SELECT f."jokeId" FROM "UserFavorite" f JOIN "User" u ON u.id = f."userId" WHERE u.email = $1`,
      [email],
    );
    expect(favoris.map((f) => f.jokeId)).toEqual([vanne.id]);
    await expect(page.getByTestId("bienvenue-texte")).toHaveText(/^Ta vanne est dans tes favoris\./);
    // Le reste de /abonnement* renvoie toujours un compte Premium vers /vannes.
    await page.goto("/abonnement?src=header");
    await expect(page).toHaveURL(/\/vannes$/);
  });

  // QA conversion s21 (m4) : T2, T3 et T5 jusqu'au retour de paiement, avec la success_url exacte.
  for (const [trajet, depart, entree, retourAttendu] of [
    ["T2 mur /vannes", "/vannes", "mur", "/vannes"],
    ["T3 fin d'étape 1", "/parcours/repartie", "etape", "/parcours/repartie"],
    ["T5 fin d'article", "/blog/meilleures-blagues-droles-2026", "article", "/parcours/repartie"],
  ] as const) {
    test(`${trajet} : compte, paiement, retour sur ${retourAttendu} avec la bienvenue`, async ({ page }) => {
      const email = `e2e-retour-${randomBytes(4).toString("hex")}@example.com`;
      comptes.push(email);
      await visiteurSimule(page);
      await page.route("**/api/stripe/checkout", async (route: Route) => {
        const corps = JSON.parse(route.request().postData() ?? "{}") as Record<string, string>;
        await requete(`UPDATE "User" SET plan = 'PREMIUM'::"Plan" WHERE email = $1`, [email]);
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: urlRetourStripeSimule(corps) }) });
      });
      await page.setViewportSize({ width: 375, height: 700 });
      await page.goto(depart);
      if (entree === "mur") {
        await page.getByRole("link", { name: /^Ouvrir la suite des vannes/ }).first().click();
        await page.getByTestId("abonnement-bouton-achat").click();
      } else if (entree === "etape") {
        for (let i = 0; i < 10; i++) {
          const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
          if ((await options.count()) === 0) break;
          await options.first().click();
          await page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ }).click();
        }
        await page.getByRole("link", { name: /^Passer à l’étape 2/ }).first().click();
      } else {
        await page.locator("a[data-blog-cta='abonnement']").first().click();
        await page.getByTestId("abonnement-bouton-achat").click();
      }
      await expect(page).toHaveURL(/\/register\?/);
      await page.locator("#email").fill(email);
      await page.locator("#password").fill(MDP);
      await page.getByRole("button", { name: /Créer mon compte/ }).click();
      await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
      expect(new URL(page.url()).pathname).toBe(retourAttendu);
      await expect(page.getByTestId("bienvenue-texte")).toBeVisible();
    });
  }

  for (const [nom, chemin] of [
    ["en-tête", "/abonnement?src=header"],
    ["mur des vannes (accroche)", "/abonnement?src=mur-vannes"],
  ] as const) {
    test(`M1, M2 à 320 × 640, ${nom} : garantie sous le bouton, au-dessus de la flottaison, mensuel et annuel`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(chemin);
      // M2 : renouvellement dans la carte Annuel, en permanence.
      const annuel = page.getByTestId("formule-annual");
      await expect(annuel.getByTestId("renouvellement-annuel")).toHaveText("Renouvelé chaque année, sauf résiliation.");
      const avant = await basDe(page, "abonnement-bouton-achat");
      const garantieMensuel = await basDe(page, "reassurance-paiement");
      await annuel.click();
      await expect(page.getByTestId("abonnement-bouton-achat")).toHaveText(/16,99/);
      // Plus de saut à la bascule.
      expect(await basDe(page, "abonnement-bouton-achat")).toBe(avant);
      const garantieAnnuel = await basDe(page, "reassurance-paiement");
      console.log(`[M1 320x640] ${nom} : garantie finit à ${garantieMensuel} px (mensuel), ${garantieAnnuel} px (annuel)`);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(garantieMensuel, "garantie, mensuel").toBeLessThanOrEqual(640);
      expect(garantieAnnuel, "garantie, annuel").toBeLessThanOrEqual(640);
      // Ordre : bouton, garantie, suite.
      const yGarantie = (await page.getByTestId("reassurance-paiement").boundingBox())!.y;
      const ySuite = (await page.getByTestId("abonnement-suite").boundingBox())!.y;
      expect(yGarantie).toBeLessThan(ySuite);
      // Finition du tour 3 : la ligne compte tient sur UNE ligne et dans le premier écran (T2 compris).
      const suite = page.getByTestId("abonnement-suite");
      const lignes = await suite.evaluate((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size;
      });
      expect(lignes, "ligne compte sur une ligne").toBe(1);
      expect(await basDe(page, "abonnement-suite"), "ligne compte au premier écran").toBeLessThanOrEqual(640);
      // Carte Annuel : équivalent et mois offerts sur une ligne, séparés par « · ».
      await expect(annuel).toContainText(/soit 1,42\s€ par mois\s·\splus de 3 mois offerts/);
    });
  }

  test("375 × 700 : bouton et garantie au premier écran, mensuel et annuel, depuis le mur (accroche)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto("/abonnement?src=mur-vannes");
    for (const formule of ["monthly", "annual"]) {
      await page.getByTestId(`formule-${formule}`).click();
      const bas = await basDe(page, "reassurance-paiement");
      console.log(`[375x700] mur, ${formule} : garantie finit à ${bas} px`);
      expect(bas).toBeLessThanOrEqual(700);
    }
  });

  test("M1 à 320 × 640, compte connecté : garantie au-dessus de la flottaison", async ({ page }) => {
    const email = `e2e-m1-${randomBytes(4).toString("hex")}@example.com`;
    comptes.push(email);
    await creerCompte(email, MDP, "FREE");
    await visiteurSimule(page);
    await connecter(page, email, MDP);
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/abonnement?src=header");
    expect(await basDe(page, "reassurance-paiement")).toBeLessThanOrEqual(640);
  });

  test("M3, M4 à 320 × 640 : marge basse = barre mesurée ; la barre suit la formule annuelle", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/abonnement?src=header");
    await page.getByTestId("formule-annual").click();
    const barre = page.getByTestId("abonnement-barre-collante");
    await page.evaluate(() => {
      const principal = document.getElementById("abonnement-achat-principal")!;
      window.scrollTo(0, principal.getBoundingClientRect().bottom + window.scrollY + 40);
    });
    await expect(barre).toHaveAttribute("data-visible", "oui");
    await expect(barre.getByRole("link")).toHaveText(/^S’abonner\s·\s16,99\s€\/an$/);
    const hBarre = (await barre.boundingBox())!.height;
    const marge = await page.evaluate(() => {
      const offre = document.querySelector("[data-testid='abonnement-offre']")!;
      return parseFloat(getComputedStyle(offre.parentElement!).paddingBottom);
    });
    expect(marge, "marge basse ≥ hauteur de la barre").toBeGreaterThanOrEqual(hBarre);
    // FAQ prix ouverte : sa réponse se lit en entier au-dessus de la barre.
    const question = page.locator("details summary").filter({ hasText: /c’est vraiment tout/ });
    await question.click();
    const reponse = page.locator("details[open]").filter({ hasText: "nouveau délai" });
    await reponse.evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, r.bottom + window.scrollY - window.innerHeight + 140);
    });
    await expect(barre).toHaveAttribute("data-visible", "oui");
    const finReponse = (await reponse.boundingBox())!;
    const hautBarre = (await barre.boundingBox())!.y;
    expect(finReponse.y + finReponse.height, "fin de la réponse au-dessus de la barre").toBeLessThanOrEqual(hautBarre);
  });

  test("M7 à 1 280 px : carnet, tableau, bouton du bas à la largeur de la carte ; prix alignés en haut", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/abonnement?src=header");
    const largeur = async (id: string) => Math.round((await page.getByTestId(id).boundingBox())!.width);
    const carte = await largeur("abonnement-offre");
    expect(carte).toBeLessThanOrEqual(560);
    for (const id of ["abonnement-carnet-extrait", "abonnement-tableau", "abonnement-final"]) expect(await largeur(id), id).toBe(carte);
    const yPrix = async (plan: string) => (await page.getByTestId(`formule-${plan}`).locator("span.font-display").boundingBox())!.y;
    expect(Math.round(await yPrix("monthly"))).toBe(Math.round(await yPrix("annual")));
    // Finition du tour 3 : FAQ à la même largeur ; plus de vide sous le prix de la case Mensuel.
    expect(await largeur("abonnement-faq")).toBe(carte);
    const mensuel = (await page.getByTestId("formule-monthly").boundingBox())!;
    const prixMensuel = (await page.getByTestId("formule-monthly").locator("span.font-display").boundingBox())!;
    expect(mensuel.y + mensuel.height - (prixMensuel.y + prixMensuel.height), "vide sous le prix Mensuel").toBeLessThanOrEqual(16);
  });

  test("M6 : « Parcours humour : … », espace insécable avant « : »", async ({ page }) => {
    await page.goto("/parcours");
    const titre = await page.getByRole("heading", { level: 1 }).textContent();
    expect(titre).toContain("humour :");
  });
});
