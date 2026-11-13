import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";

/**
 * Espace client, lot D0 (s24, `docs/espace-client/plan-developpement-s24.md` §2 règle 2) :
 * interrupteur `ESPACE_CLIENT_PUBLIE` fermé, sur le serveur réel.
 * - `/mon-espace` et ses sous-pages répondent la page 404 réelle du site (même titre, même
 *   texte qu'une adresse inexistante), visiteur comme abonné, jamais mise en cache ;
 * - `api/espace/*` répond 404 ;
 * - les pages publiques n'appellent jamais `api/espace/*` ni `/mon-espace` ;
 * - robots.txt interdit `/mon-espace`, le sitemap ne le contient pas.
 * Relancé à chaque lot de l'espace tant que l'interrupteur est fermé.
 */
const ABONNE = { email: "e2e-espace-d0@example.test", motDePasse: "MotDePasse-e2e-D0" };
const ADRESSE_INEXISTANTE = "/adresse-inexistante-e2e-s24";
const PAGES_ESPACE = ["/mon-espace", "/mon-espace/questions", "/mon-espace/parcours"];
const PAGES_PUBLIQUES = [
  "/",
  "/profil",
  "/parcours",
  "/parcours/repartie",
  "/favoris",
  "/vannes",
  "/conseils",
  "/videos",
  "/carnet",
  "/abonnement",
];

test.describe("espace client fermé (s24, lot D0)", () => {
  localSeulement();
  // Lot D5 : spec du régime FERMÉ ; sautée quand le serveur est construit interrupteur ouvert (bascule temporaire).
  test.skip(process.env.E2E_ESPACE_OUVERT === "1", "régime fermé seulement");

  test("/mon-espace : la vraie 404, visiteur puis abonné, sans cache", async ({ page }) => {
    const reference = await page.goto(ADRESSE_INEXISTANTE);
    expect(reference?.status()).toBe(404);
    const titre404 = await page.title();
    const texte404 = await page.locator("h1").innerText();

    const verifier = async () => {
      for (const chemin of PAGES_ESPACE) {
        const reponse = await page.goto(chemin);
        expect([chemin, reponse?.status()]).toEqual([chemin, 404]);
        expect(await page.title()).toBe(titre404);
        await expect(page.locator("h1")).toHaveText(texte404);
        expect(reponse?.headers()["cache-control"] ?? "").toContain("no-store");
      }
    };
    await verifier();
    await creerCompte(ABONNE.email, ABONNE.motDePasse, "PREMIUM");
    await connecter(page, ABONNE.email, ABONNE.motDePasse);
    await verifier();
  });

  test("api/espace/* : 404 à chaque méthode", async ({ request }) => {
    for (const chemin of ["/api/espace/aise", "/api/espace/vanne", "/api/espace/compteur"]) {
      expect([chemin, (await request.get(chemin)).status()]).toEqual([chemin, 404]);
      expect([chemin, (await request.post(chemin, { data: { cle: "x" } })).status()]).toEqual([chemin, 404]);
    }
  });

  test("pages publiques (abonné connecté) : aucun appel à l'espace", async ({ page }) => {
    await creerCompte(ABONNE.email, ABONNE.motDePasse, "PREMIUM");
    await connecter(page, ABONNE.email, ABONNE.motDePasse);
    const appels: string[] = [];
    page.on("request", (requete) => {
      const { pathname } = new URL(requete.url());
      if (pathname.startsWith("/api/espace") || pathname.startsWith("/mon-espace")) appels.push(pathname);
    });
    for (const chemin of PAGES_PUBLIQUES) {
      const reponse = await page.goto(chemin);
      expect([chemin, reponse?.status()]).toEqual([chemin, 200]);
      await page.waitForLoadState("networkidle");
      expect(await page.locator('a[href^="/mon-espace"]').count()).toBe(0);
    }
    expect(appels).toEqual([]);
  });

  test("robots.txt interdit /mon-espace ; sitemap sans /mon-espace", async ({ request }) => {
    expect(await (await request.get("/robots.txt")).text()).toMatch(/^Disallow: \/mon-espace$/m);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/mon-espace");
  });
});
