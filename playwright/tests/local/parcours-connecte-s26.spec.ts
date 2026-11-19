import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";

/**
 * s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5 et §6, critères C1, C2, C6, C7 ;
 * `docs/design/parcours-connecte-s26.md` §5). Serveur construit interrupteur OUVERT (`E2E_ESPACE_OUVERT=1`) ; fermé, ces
 * pages gardent le HTML d'avant (inertie, `espace-parcours.spec.ts`).
 * - Trajet (375 et 1280) : « Reprendre » de /parcours (un seul visible) arrive sur l'étape en cours, haut de la carte à
 *   137 ± 2 px du haut de la fenêtre ; étape suivante en 1 clic (même mesure) ; « Retour : Parcours » ramène sur la
 *   carte `#parcours-{slug}` de /parcours, visible.
 * - Mesure (1280 et 1920) : aucune colonne ni carte avec un vide de plus de 32 px en bas (cartes de parcours, carte
 *   « En cours », « Explore aussi »).
 * - s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §1, §2, §6) : menu d'étapes collant dès 1024 (même haut que
 *   la carte d'en-tête, une seule étape visible, menu toujours à 144 px après un clic d'étape) ; à 375, l'en-tête d'étape
 *   cliqué ne saute pas (8 px au plus) ; visiteur et gratuit à 375, « Tester l'étape 1 » dans le premier écran, puis
 *   l'étape 1 ouverte à l'arrivée.
 */
const MOT_DE_PASSE = "E2e-parcours-connecte-s26";
const SLUG = "machine-a-cafe";
const ANCRE = 137;

async function abonne(page: Page) {
  const email = `e2e-pc-s26-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

async function valider(page: Page, slug: string, etapes: number[]) {
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" WHERE slug = $1`, [slug]);
  for (const stepOrder of etapes) {
    const r = await page.request.post(`/api/parcours/${id}/progress`, { data: { stepOrder } });
    expect(r.status()).toBe(200);
  }
}

/** Haut de l'élément dans la fenêtre, lu une fois la page stable (deux lectures égales à 300 ms d'écart). */
async function hautStable(cible: Locator): Promise<number> {
  const lire = () => cible.evaluate((e) => Math.round(e.getBoundingClientRect().top));
  let avant = await lire();
  for (let i = 0; i < 15; i++) {
    await cible.page().waitForTimeout(300);
    const y = await lire();
    if (y === avant) return y;
    avant = y;
  }
  return avant;
}

/** Nombre d'éléments visibles nommés exactement « Reprendre » (liens et boutons). */
const reprendreVisibles = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("main a, main button")).filter((e) => {
      const r = e.getBoundingClientRect();
      return e.textContent?.trim() === "Reprendre" && r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden";
    }).length,
  );

/**
 * Vides en bas, en px : pour chaque bloc, (bas de la boîte moins sa marge interne basse) moins le bas du dernier contenu
 * rendu. Renvoie les seuls dépassements de `seuil`.
 */
async function videsEnBas(page: Page, blocs: string[], seuil = 32) {
  return page.evaluate(
    ({ blocs, seuil }) => {
      const basContenu = (e: Element) =>
        Array.from(e.querySelectorAll("*")).reduce((b, d) => (d.getClientRects().length ? Math.max(b, d.getBoundingClientRect().bottom) : b), e.getBoundingClientRect().top);
      const trop: string[] = [];
      for (const sel of blocs) {
        document.querySelectorAll(sel).forEach((e, i) => {
          const r = e.getBoundingClientRect();
          if (!r.height) return;
          const vide = r.bottom - parseFloat(getComputedStyle(e).paddingBottom) - parseFloat(getComputedStyle(e).borderBottomWidth) - basContenu(e);
          if (vide > seuil) trop.push(`${sel}[${i}] : ${Math.round(vide)} px`);
        });
      }
      return trop;
    },
    { blocs, seuil },
  );
}

test.describe("Parcours connecté (s26)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "régime ouvert seulement");

  for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
    test(`${largeur} : « Reprendre » sur l'étape en cours à 137 px, étape suivante, retour sur la carte du parcours`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const reprendre = page.getByTestId("carte-en-cours-reprendre");
      await expect(reprendre).toHaveText("Reprendre");
      await expect(reprendre).toHaveAttribute("href", `/parcours/${SLUG}#etape-2`);
      // C6 : un seul « Reprendre » visible sur /parcours, 375 compris.
      expect(await reprendreVisibles(page)).toBe(1);

      // C7, clic 1 : l'étape en cours, ouverte, sous l'en-tête collant.
      await reprendre.click();
      await expect(page).toHaveURL(new RegExp(`/parcours/${SLUG}#etape-2$`));
      const etape2 = page.locator("#etape-2");
      await expect(page.locator("#etape-2-entete")).toHaveAttribute("aria-expanded", "true");
      expect(Math.abs((await hautStable(etape2)) - ANCRE), "haut de l'étape 2 à 137 ± 2 px").toBeLessThanOrEqual(2);
      // Sous 1024, le « Reprendre » du sommaire est replié (aucun second « Reprendre » visible).
      if (largeur < 1024) expect(await reprendreVisibles(page)).toBe(0);

      // Clic 2 : étape suivante depuis le pied de l'étape ouverte.
      await etape2.locator("[data-etape-suivante='3']").click();
      await expect(page.locator("#etape-3-entete")).toHaveAttribute("aria-expanded", "true");
      expect(Math.abs((await hautStable(page.locator("#etape-3"))) - ANCRE), "haut de l'étape 3 à 137 ± 2 px").toBeLessThanOrEqual(2);

      // Clic 3 : retour sur la carte du parcours dans /parcours.
      await page.locator("#etape-3 [data-lien-retour]").click();
      await expect(page).toHaveURL(new RegExp(`/parcours#parcours-${SLUG}$`));
      const carte = page.locator(`#parcours-${SLUG}`);
      expect(Math.abs((await hautStable(carte)) - ANCRE), "haut de la carte du parcours à 137 ± 2 px").toBeLessThanOrEqual(2);
      await expect(carte).toBeInViewport();
    });
  }

  for (const [largeur, hauteur] of [[1280, 900], [1920, 1080]] as const) {
    test(`${largeur} : aucune colonne avec un vide de plus de 32 px en bas (abonné et visiteur)`, async ({ page, browser }) => {
      const blocsListe = ["[data-parcours-cartes] > [id^='parcours-']", "[data-testid='carte-en-cours']", "main nav a[class*='p-6']"];
      // Visiteur.
      const visiteur = await browser.newPage({ viewport: { width: largeur, height: hauteur } });
      await visiteur.goto("/parcours");
      await expect(visiteur.locator("[data-parcours-cartes] > [id^='parcours-']").first()).toBeVisible();
      await visiteur.evaluate(() => document.fonts.ready);
      expect(await videsEnBas(visiteur, blocsListe), "/parcours visiteur").toEqual([]);
      // s26 parcours v2 : test changé (raison : plus d'en-tête 7/5 ni de carte de progression à droite ; menu d'étapes à
      // gauche, 360 px et 32 px de gouttière dès 1280, haut du menu = haut de la carte d'en-tête, §8 lignes 1 et 2).
      await visiteur.goto(`/parcours/${SLUG}`);
      const menuV = visiteur.locator("[data-menu-etapes]");
      await expect(menuV).toBeVisible();
      const mesureV = await menuV.evaluate((m) => {
        const r = m.getBoundingClientRect();
        const e = document.querySelector("[data-entete-parcours]")?.getBoundingClientRect();
        return { largeur: Math.round(r.width), haut: Math.round(r.top), hautEntete: Math.round(e?.top ?? -1), gouttiere: Math.round((e?.left ?? 0) - r.right) };
      });
      expect(mesureV.largeur, JSON.stringify(mesureV)).toBe(360);
      expect(mesureV.gouttiere, JSON.stringify(mesureV)).toBe(32);
      expect(Math.abs(mesureV.haut - mesureV.hautEntete), JSON.stringify(mesureV)).toBeLessThanOrEqual(2);
      await visiteur.close();

      // Abonné avancé.
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      await expect(page.getByTestId("carte-en-cours")).toBeVisible();
      await expect(page.locator("[data-parcours-cartes] [role='progressbar']").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await videsEnBas(page, blocsListe), "/parcours abonné").toEqual([]);
      // Cartes d'une même rangée : même haut, même bas (sous-grille).
      const rangees = await page.locator("[data-parcours-cartes] > [id^='parcours-']").evaluateAll((cs) =>
        cs.map((c) => ({ haut: Math.round(c.getBoundingClientRect().top), bas: Math.round(c.getBoundingClientRect().bottom) })),
      );
      for (let i = 0; i + 1 < rangees.length; i += 2) {
        if (rangees[i].haut !== rangees[i + 1].haut) continue;
        expect(Math.abs(rangees[i].bas - rangees[i + 1].bas), `bas des cartes ${i} et ${i + 1}`).toBeLessThanOrEqual(1);
      }
    });
  }

  // s26 parcours v2 (§1, §2) : menu d'étapes persistant dès 1024.
  for (const [largeur, hauteur] of [[1024, 768], [1280, 900]] as const) {
    test(`${largeur} : menu d'étapes visible et collant après clic sur une étape, une seule étape visible`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      await expect(menu).toBeVisible();
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-2");
      await menu.locator("a[href='#etape-3']").click();
      await expect(page.locator("#etape-3-entete")).toHaveAttribute("aria-expanded", "true");
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-3");
      const etapesVisibles = await page.locator("[role='list'][aria-label='Étapes du parcours'] > [id^='etape-']").evaluateAll((cs) => cs.filter((c) => c.getBoundingClientRect().height > 0).map((c) => c.id));
      expect(etapesVisibles).toEqual(["etape-3"]);
      await page.evaluate(() => window.scrollBy({ top: 700, behavior: "instant" }));
      await page.waitForTimeout(500);
      const haut = await hautStable(menu);
      expect(Math.abs(haut - 144), `haut collé du menu : ${haut}`).toBeLessThanOrEqual(2);
      await expect(menu).toBeInViewport();
      await expect(menu.locator("#sommaire-reprendre")).toBeVisible();
    });
  }

  test("375 : ouvrir une étape sous une étape ouverte ne fait pas sauter son en-tête (8 px au plus)", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/parcours/${SLUG}`);
    await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("lignes-fiches")).toBeVisible();
    const entete = page.locator("#etape-2-entete");
    await entete.evaluate((e) => {
      e.scrollIntoView({ block: "start", behavior: "instant" });
      window.scrollBy({ top: -400, behavior: "instant" });
    });
    const avant = await hautStable(entete);
    await entete.click();
    await expect(entete).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "false");
    const apres = await hautStable(entete);
    expect(Math.abs(apres - avant), `en-tête de l'étape 2 : ${avant} puis ${apres}`).toBeLessThanOrEqual(8);
  });

  for (const compte of ["visiteur", "gratuit"] as const) {
    test(`375, ${compte} : « Tester l'étape 1 » dans le premier écran, étape 1 ouverte à l'arrivée`, async ({ page }) => {
      if (compte === "gratuit") {
        const email = `e2e-pc-s26-g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, "FREE");
        await connecter(page, email, MOT_DE_PASSE);
      }
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      const bouton = page.getByTestId("tester-etape-1-mobile");
      await expect(bouton).toBeVisible();
      await expect(bouton).toHaveText(/^Tester l’étape 1 de .+, gratuite$/);
      const bas = await bouton.evaluate((e) => Math.round(e.getBoundingClientRect().bottom));
      expect(bas, `bas du bouton : ${bas}`).toBeLessThanOrEqual(700);
      // Contour : aucun aplat violet sur le bouton.
      expect(await bouton.evaluate((e) => e.className)).not.toMatch(/(^|\s)bg-accent/);
      await bouton.click();
      await expect(page).toHaveURL(/\/parcours\/[a-z-]+\?src=hub#etape-1$/);
      await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#etape-1")).toBeInViewport();
    });
  }
});
