import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * Revue visuelle s21, tour 3 (verdict @design, R27 / T2-04) : typographie française du texte
 * VISIBLE des pages principales, figée ici.
 * - aucune apostrophe droite entre deux lettres (`/\p{L}'\p{L}/u`) : « l’étape », jamais « l'étape » ;
 * - aucun guillemet « ou » séparé de son mot par une espace ordinaire ou un retour à la ligne
 *   (il serait orphelin en bout de ligne) : une insécable les lie.
 * Le texte des lecteurs YouTube (iframes) n'est pas dans `innerText` : il vient de YouTube.
 */
const PAGES = [
  "/", "/abonnement", "/register", "/login", "/vannes", "/conseils", "/videos", "/parcours", "/parcours/repartie",
  "/carnet", "/glossaire", "/a-propos", "/lettre", "/blog", "/blog/repondre-moqueries-avec-humour", "/quiz-humour",
  "/anatomie-vanne", "/blague-du-jour", "/cgu", "/confidentialite", "/mentions-legales", "/retractation",
];
const APOSTROPHE_DROITE = /\p{L}'\p{L}/u;
const GUILLEMET_ISOLE = /«[ \n\t]|[ \n\t]»/;

async function defauts(page: import("@playwright/test").Page): Promise<string[]> {
  // Laisse les listes se charger (contenu de la base rendu côté client).
  await page.waitForLoadState("networkidle").catch(() => {});
  const texte = await page.evaluate(() => document.body.innerText);
  const fautes: string[] = [];
  for (const ligne of texte.split("\n")) {
    if (APOSTROPHE_DROITE.test(ligne)) fautes.push(`apostrophe droite : ${ligne.trim().slice(0, 90)}`);
    if (GUILLEMET_ISOLE.test(ligne)) fautes.push(`guillemet isolé : ${ligne.trim().slice(0, 90)}`);
  }
  return fautes;
}

test.describe("Typographie du texte visible @s21", () => {
  localSeulement();

  for (const chemin of PAGES) {
    test(`visiteur ${chemin}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(chemin);
      expect(await defauts(page), `texte visible de ${chemin}`).toEqual([]);
    });
  }

  test.describe("abonné", () => {
    const email = `e2e-typo-${randomBytes(4).toString("hex")}@example.com`;
    const motDePasse = "MotDePasse-e2e-42";
    test.beforeAll(async () => {
      await creerCompte(email, motDePasse, "PREMIUM");
      const [u] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
      const [j] = await requete<{ id: string }>(`SELECT id FROM "Joke" ORDER BY "createdAt" LIMIT 1`);
      const [t] = await requete<{ id: string }>(`SELECT id FROM "Tip" ORDER BY "createdAt" LIMIT 1`);
      await requete(`INSERT INTO "UserFavorite" (id, "userId", "contentType", "jokeId") VALUES ($1, $2, 'JOKE', $3) ON CONFLICT DO NOTHING`, [`e2e${randomBytes(8).toString("hex")}`, u.id, j.id]);
      await requete(`INSERT INTO "UserFavorite" (id, "userId", "contentType", "tipId") VALUES ($1, $2, 'TIP', $3) ON CONFLICT DO NOTHING`, [`e2e${randomBytes(8).toString("hex")}`, u.id, t.id]);
    });
    test.afterAll(async () => {
      await requete(`DELETE FROM "User" WHERE email = $1`, [email]);
    });

    test("accueil, profil, favoris, carnet, vannes et conseils de l'abonné", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await connecter(page, email, motDePasse);
      for (const chemin of ["/", "/profil", "/favoris", "/carnet", "/vannes", "/conseils"]) {
        await page.goto(chemin);
        expect(await defauts(page), `texte visible de ${chemin} (abonné)`).toEqual([]);
      }
    });
  });
});
