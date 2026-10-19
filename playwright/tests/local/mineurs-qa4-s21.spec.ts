import { randomBytes } from "node:crypto";
import type { Cookie } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter, type PlanCompte } from "../support/base-locale";

/**
 * QA v4 s21, mineurs m-2, m-4, m-5 et m-6 (m-3 : header-budget ; m-7 : Jest + concision-s21),
 * joués dans un vrai navigateur sur le build de production local, base jetable :
 *  - m-4 : résultat du quiz d'orientation (compte sans abonnement, 375 x 812) : parcours nommé
 *    une seule fois, plein payant au-dessus du lien gratuit et dans le premier écran ;
 *  - m-5 : sous les murs, plus de pagination pour une liste limitée ; l'abonné la garde ;
 *  - m-6 : /parcours, encart « Abonnement 2,99 €/mois » absent pour l'abonné ;
 *  - m-2 : fin d'article Répartie = « Tester l'étape 1 de Répartie, gratuite », article n°1 inchangé.
 * Mesures jointes au rapport (`mesures-qa4`).
 */
const MOT_DE_PASSE = "E2e-mineurs-qa4-42";
const comptes: Record<PlanCompte, string> = {
  FREE: `e2e-qa4-free-${randomBytes(4).toString("hex")}@example.com`,
  PREMIUM: `e2e-qa4-premium-${randomBytes(4).toString("hex")}@example.com`,
};
const cookies: Partial<Record<PlanCompte, Cookie[]>> = {};
// Trajet de conversion s21 : compte connecté sans abonnement, paiement direct, « S'abonner ».
const OUVRIR = /^S’abonner\s·\s2,99\s€\/mois$/;

test.describe("QA v4 s21 : mineurs m-2, m-4, m-5, m-6 @s21", () => {
  localSeulement();

  test.beforeAll(async ({ browser }) => {
    for (const plan of ["FREE", "PREMIUM"] as const) {
      await creerCompte(comptes[plan], MOT_DE_PASSE, plan);
      const contexte = await browser.newContext();
      await connecter(await contexte.newPage(), comptes[plan], MOT_DE_PASSE);
      cookies[plan] = await contexte.cookies();
      await contexte.close();
    }
  });
  test.afterAll(async () => {
    await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [Object.values(comptes)]);
  });

  test("m-4 : quiz d'orientation, parcours nommé une fois, plein payant au premier écran (375 x 812)", async ({ context, page }, testInfo) => {
    await context.addCookies(cookies.FREE ?? []);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/onboarding");
    for (const reponse of ["Avoir de la répartie", "Entre potes / en soirée étudiante", "Mes vannes tombent à plat"]) {
      await page.getByRole("button", { name: reponse }).click();
    }
    const plein = page.getByRole("button", { name: OUVRIR });
    await expect(plein).toBeVisible();
    await expect(page.getByText("Ton point de départ")).toHaveCount(0);
    expect((await page.locator("main").innerText()).match(/Ton parcours/g)).toHaveLength(1);
    const gratuit = page.getByRole("button", { name: /^Tester l['’]étape\s1\sde Répartie, gratuite$/ });
    await page.evaluate(() => window.scrollTo(0, 0));
    const p = await plein.boundingBox();
    const g = await gratuit.boundingBox();
    const mesure = `quiz d'orientation 375x812 : plein ${Math.round(p?.y ?? 0)}-${Math.round((p?.y ?? 0) + (p?.height ?? 0))} px ; lien gratuit ${Math.round(g?.y ?? 0)} px`;
    await testInfo.attach("mesures-qa4", { body: mesure, contentType: "text/plain" });
    console.log(mesure);
    expect((p?.y ?? 0) + (p?.height ?? 0), "plein dans le premier écran").toBeLessThanOrEqual(812);
    expect(g?.y ?? 0, "lien gratuit sous le plein").toBeGreaterThan(p?.y ?? 0);
  });

  for (const chemin of ["/vannes", "/conseils", "/videos"]) {
    test(`m-5 : ${chemin}, plus de pagination sous le mur (visiteur), pagination gardée pour l'abonné`, async ({ browser }) => {
      for (const etat of ["visiteur", "PREMIUM"] as const) {
        const contexte = await browser.newContext({ viewport: { width: 375, height: 812 } });
        if (etat === "PREMIUM") await contexte.addCookies(cookies.PREMIUM ?? []);
        const page = await contexte.newPage();
        const api = page.waitForResponse((r) => /\/api\/(jokes|tips|videos)\?/.test(r.url()));
        await page.goto(chemin);
        const json = (await (await api).json()) as { limited?: boolean; pagination?: { totalPages: number } };
        const pagination = page.locator(`a[href^="${chemin}?page="]`);
        if (etat === "visiteur") {
          expect(json.limited, `${chemin} visiteur : liste limitée`).toBe(true);
          await expect(page.locator(`[data-mur-liste-limite="${chemin.slice(1)}"]`)).toBeVisible();
          await expect(pagination).toHaveCount(0);
        } else {
          expect(json.limited ?? false).toBe(false);
          if ((json.pagination?.totalPages ?? 1) > 1) {
            await expect(page.getByRole("link", { name: "Page suivante (page 2)" })).toBeVisible();
          }
        }
        await contexte.close();
      }
    });
  }

  test("m-6 : /parcours, encart « Abonnement 2,99 €/mois » pour le visiteur seulement", async ({ browser }) => {
    for (const etat of ["visiteur", "PREMIUM"] as const) {
      const contexte = await browser.newContext();
      if (etat === "PREMIUM") await contexte.addCookies(cookies.PREMIUM ?? []);
      const page = await contexte.newPage();
      await page.goto("/parcours");
      const encart = page.locator('a[href="/abonnement?src=parcours-liste"]');
      await expect(page.getByRole("heading", { name: "Explore aussi" })).toBeVisible();
      if (etat === "visiteur") await expect(encart).toContainText(/Abonnement 2,99\s€\/mois/);
      else await expect(encart).toHaveCount(0);
      await contexte.close();
    }
  });

  test("m-2, v3 S01 : fin d'article = GRATUIT_P du parcours, article n°1 compris (Répartie)", async ({ page }) => {
    const plein = page.locator('[data-blog-bloc-fin] a[data-blog-cta="etape-1"]');
    await page.goto("/blog/jamais-quoi-repondre-techniques");
    await expect(plein).toHaveText(/^Tester l['’]étape\s1\sde Répartie, gratuite$/);
    await page.goto("/blog/meilleures-blagues-droles-2026");
    await expect(plein).toHaveText(/^Tester l['’]étape\s1\sde Répartie, gratuite$/);
  });
});
