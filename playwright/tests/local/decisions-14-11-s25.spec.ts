import type { Browser, BrowserContext, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, adresseVisiteur, ESPACE_OUVERT } from "../support/base-locale";
import { CATEGORIES_VANNES } from "@/config/vannes-categories";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * Décisions de Thomas du 14/11 et du 15/11 (s25), espace ouvert seulement (fermé : rien ne change, contrôlé ici aussi) :
 *  1. /vannes : une seule rangée de catégories pour les 3 états, « Toutes » active par défaut, état actif visible ;
 *     les 10 vannes gratuites sur au moins 5 catégories.
 *  2. /lettre : une seule section (inscription pour le visiteur et le compte gratuit, archive pour l'abonné) ;
 *     /mon-espace/lettres y mène ; le retour d'une lettre mène à /lettre.
 *  3. FAQ de /parcours : question du prix masquée pour l'abonné.
 *  4. Mes répliques vide : bouton « Écrire ma première réplique ».
 *  5. Pas de fil d'Ariane visible sur /vannes et /lettre ; BreadcrumbList conservé sur /vannes.
 * Comptes : créés pour la spec (CI), ou ceux de la préversion locale avec `E2E_COMPTES_PREVERSION=1`
 * (`abonne-en-cours@`, `nouvel-abonne@`, `inscrit-gratuit@preversion.test`).
 */
type Etat = "visiteur" | "FREE" | "PREMIUM";
const PREVERSION = process.env.E2E_COMPTES_PREVERSION === "1";
const MOT_DE_PASSE = PREVERSION ? "preversion-s24" : "E2e-decisions-14-11-s25";
const PRIX = /c’est vraiment tout/;

const comptes = new Map<string, string>();
async function email(cle: "FREE" | "PREMIUM" | "PREMIUM_VIDE"): Promise<string> {
  if (PREVERSION) return { FREE: "inscrit-gratuit@preversion.test", PREMIUM: "abonne-en-cours@preversion.test", PREMIUM_VIDE: "nouvel-abonne@preversion.test" }[cle];
  if (!comptes.has(cle)) {
    const adresse = `e2e-d1411-${cle.toLowerCase()}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}@example.com`;
    await creerCompte(adresse, MOT_DE_PASSE, cle === "FREE" ? "FREE" : "PREMIUM");
    comptes.set(cle, adresse);
  }
  return comptes.get(cle)!;
}

async function contexte(browser: Browser, etat: Etat | "PREMIUM_VIDE", largeur = 1280): Promise<{ c: BrowserContext; page: Page }> {
  const c = await browser.newContext({ viewport: { width: largeur, height: 900 }, locale: "fr-FR", extraHTTPHeaders: { "cf-connecting-ip": adresseVisiteur() } });
  const page = await c.newPage();
  if (etat !== "visiteur") await connecter(page, await email(etat), MOT_DE_PASSE);
  return { c, page };
}

/** /vannes chargée et liste rechargée par l'API (même réponse que celle qui remplit la liste). */
async function ouvrirVannes(page: Page): Promise<{ jokes: { category: string }[]; limited: boolean }> {
  const reponse = page.waitForResponse((r) => r.url().includes("/api/jokes?") && r.request().method() === "GET");
  await page.goto("/vannes");
  const corps = await (await reponse).json();
  await expect(page.locator("main [role='tabpanel'] > div")).toHaveCount(corps.jokes.length);
  return corps;
}

const groupe = (categorie: string) => CATEGORIES_VANNES.find((c) => c.value && c.value.split(",").includes(categorie))?.label;

test.describe("décisions du 14/11 (s25)", () => {
  test.beforeEach(() => localSeulement());

  test.describe("interrupteur ouvert", () => {
    test.skip(!ESPACE_OUVERT, "serveur construit interrupteur ouvert seulement");

    for (const etat of ["visiteur", "FREE", "PREMIUM"] as const) {
      test(`/vannes, ${etat} : une seule rangée, « Toutes » active, pas de fil d'Ariane`, async ({ browser }) => {
        const { c, page } = await contexte(browser, etat);
        const corps = await ouvrirVannes(page);
        const main = page.locator("main");
        await expect(main.getByRole("tablist")).toHaveCount(1);
        const rangee = main.getByRole("tablist", { name: "Catégories de vannes" });
        await expect(rangee).toBeVisible();
        await expect(rangee.getByRole("tab")).toHaveText(CATEGORIES_VANNES.map((cat) => cat.label));
        const toutes = rangee.getByRole("tab", { name: "Toutes" });
        await expect(toutes).toHaveAttribute("aria-selected", "true");
        await expect(main.getByRole("navigation", { name: "Vannes par thème" })).toHaveCount(0);
        await expect(page.getByRole("navigation", { name: /Fil d.Ariane/ })).toHaveCount(0);
        expect(await page.locator("script[type='application/ld+json']").allTextContents()).toEqual(
          expect.arrayContaining([expect.stringContaining('"BreadcrumbList"')]),
        );
        // État actif visible : fond de la pastille active différent de celui d'une pastille au repos.
        const fond = (nom: string) => rangee.getByRole("tab", { name: nom }).evaluate((el) => getComputedStyle(el).backgroundColor);
        const second = CATEGORIES_VANNES[1].label;
        expect(await fond("Toutes")).not.toBe(await fond(second));
        if (etat === "PREMIUM") {
          expect(corps.limited).toBe(false);
        } else {
          expect(corps.limited).toBe(true);
          expect(corps.jokes).toHaveLength(10);
          const groupes = new Set(corps.jokes.map((j) => groupe(j.category)));
          expect(groupes.size, `catégories : ${[...groupes].join(", ")}`).toBeGreaterThanOrEqual(5);
        }
        // Choisir une catégorie : elle devient active, « Toutes » ne l'est plus, la liste répond.
        const filtre = page.waitForResponse((r) => r.url().includes("/api/jokes?") && r.url().includes("category="));
        await rangee.getByRole("tab", { name: second }).click();
        const filtree = await (await filtre).json();
        await expect(rangee.getByRole("tab", { name: second })).toHaveAttribute("aria-selected", "true");
        await expect(toutes).toHaveAttribute("aria-selected", "false");
        expect(filtree.jokes.every((j: { category: string }) => groupe(j.category) === second)).toBe(true);
        if (etat !== "PREMIUM") expect(filtree.jokes.length).toBeLessThanOrEqual(10);
        await c.close();
      });
    }

    for (const etat of ["visiteur", "FREE"] as const) {
      test(`/lettre, ${etat} : l'inscription, pas l'archive, pas de fil d'Ariane`, async ({ browser }) => {
        const { c, page } = await contexte(browser, etat);
        await page.goto("/lettre");
        await expect(page.locator("main [data-lettres-abonne]")).toHaveCount(0);
        await expect(page.locator("main #lettre-titre-page")).toBeVisible();
        await expect(page.getByRole("navigation", { name: /Fil d.Ariane/ })).toHaveCount(0);
        await c.close();
      });
    }

    test("/lettre, abonné : l'archive des lettres ; /mon-espace/lettres y mène ; retour d'une lettre vers /lettre", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM");
      await page.goto("/lettre");
      const archive = page.locator("main [data-lettres-abonne]");
      await expect(archive).toBeVisible();
      // v6 tour 1 (point 10) : H1 de l'abonné « La lettre », libellé validé de la bande (`TEXTES_LETTRE.menu`).
      await expect(page.getByRole("heading", { level: 1, name: TEXTES_LETTRE.menu, exact: true })).toBeVisible();
      await expect(page.locator("main #lettre-titre-page")).toHaveCount(0);
      await expect(page.getByRole("navigation", { name: /Fil d.Ariane/ })).toHaveCount(0);
      await expect(archive.getByRole("link", { name: /Retour/ })).toHaveCount(0);

      const reponse = await page.request.get("/mon-espace/lettres", { maxRedirects: 0 });
      expect(reponse.status()).toBe(308);
      expect(new URL(reponse.headers()["location"], "http://x").pathname).toBe("/lettre");
      await page.goto("/mon-espace/lettres");
      await expect(page).toHaveURL(/\/lettre$/);

      const lettres = archive.locator("a[data-lettre]");
      if ((await lettres.count()) > 0) {
        await lettres.first().click();
        await expect(page).toHaveURL(/\/mon-espace\/lettres\/[^/]+$/);
        await expect(page.locator("main a[href='/lettre']").first()).toBeVisible();
      }
      await c.close();
    });

    test("FAQ de /parcours : question du prix visible pour le visiteur, masquée pour l'abonné", async ({ browser }) => {
      const v = await contexte(browser, "visiteur");
      await v.page.goto("/parcours");
      await expect(v.page.locator("main summary").filter({ hasText: PRIX })).toBeVisible();
      await v.c.close();
      const a = await contexte(browser, "PREMIUM");
      await a.page.goto("/parcours");
      await expect(a.page.locator("main summary").first()).toBeVisible();
      await expect(a.page.locator("main summary").filter({ hasText: PRIX })).toHaveCount(0);
      await a.c.close();
    });

    // s26 DA, aujourd'hui questions répliques (T8) : le libellé validé reste ; il ouvre le champ d'écriture sur la page
    // (une situation de Quoi répondre proposée, titre en lien vers sa fiche) au lieu de la liste de Quoi répondre.
    test("Mes répliques vide : « Écrire ma première réplique » ouvre le champ sur une situation de Quoi répondre", async ({ browser }) => {
      const { c, page } = await contexte(browser, "PREMIUM_VIDE");
      await page.goto("/mon-espace/repliques");
      const bouton = page.getByTestId("repliques-vide").getByRole("button", { name: TEXTES_REPLIQUES.ecrirePremiere });
      await expect(bouton).toBeVisible();
      await bouton.click();
      await expect(page.getByLabel(TEXTES_REPLIQUES.label)).toBeFocused();
      await expect(page.locator("[data-ecrire-replique] a").first()).toHaveAttribute("href", /^\/mon-espace\/quoi-repondre\//);
      await c.close();
    });
  });

  test.describe("interrupteur fermé : rien ne change", () => {
    test.skip(ESPACE_OUVERT, "serveur construit interrupteur fermé seulement");

    test("/vannes visiteur : pages thème et fil d'Ariane gardés, rangée réservée à l'abonné, 10 plus récentes", async ({ page }) => {
      const corps = await ouvrirVannes(page);
      await expect(page.getByRole("navigation", { name: "Vannes par thème" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: /Fil d.Ariane/ })).toBeVisible();
      await expect(page.locator("main").getByRole("tablist")).toHaveCount(0);
      expect(corps.limited).toBe(true);
      expect(corps.jokes).toHaveLength(10);
    });

    test("/parcours visiteur : question du prix présente", async ({ page }) => {
      await page.goto("/parcours");
      await expect(page.locator("main summary").filter({ hasText: PRIX })).toBeVisible();
    });
  });
});
