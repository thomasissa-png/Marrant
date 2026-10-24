import { test, expect, localSeulement } from "../support/base-locale";
import type { Page } from "@playwright/test";

/**
 * Revue visuelle s21, tour 4 (verdict @design, majeur T3-01) : à 375 px, tout bouton d'appel qui porte
 * un prix (« Voir la suite des conseils · 2,99 €/mois », « Décrypter cette vidéo · 2,99 €/mois »…)
 * tient sur UNE ligne, sur toutes les pages qui en ont un : même rôle, même hauteur partout.
 * Bouton de 48 px de haut (min-h-12) : une ligne = 52 px au plus ; deux lignes = 60 px et plus.
 * Le bouton prix de l'en-tête est hors `main` (figé par `header-budget`).
 */
const UNE_LIGNE = 52;
const PRIX = /€\/(mois|an)/;

async function boutonsPrix(page: Page): Promise<Array<{ texte: string; hauteur: number; deborde: boolean; texteDeborde: boolean }>> {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate((source) => {
    const prix = new RegExp(source);
    return Array.from(document.querySelectorAll<HTMLElement>("main a, main button, [role='dialog'] a, [role='dialog'] button"))
      .filter((e) => e.offsetParent !== null && prix.test(e.innerText) && e.innerText.trim().length <= 60)
      .map((e) => {
        const r = e.getBoundingClientRect();
        return {
          texte: e.innerText.replace(/\s+/g, " ").trim(),
          hauteur: Math.round(r.height),
          deborde: r.right > window.innerWidth + 0.5,
          texteDeborde: e.scrollWidth > e.clientWidth + 1,
        };
      });
  }, PRIX.source);
}

async function verifier(page: Page, ou: string) {
  const boutons = await boutonsPrix(page);
  expect(boutons.length, `${ou} : au moins un bouton prix`).toBeGreaterThan(0);
  for (const b of boutons) {
    expect(b.hauteur, `${ou} : « ${b.texte} » sur une ligne à 375 px`).toBeLessThanOrEqual(UNE_LIGNE);
    expect(b.deborde, `${ou} : « ${b.texte} » dans l'écran`).toBe(false);
    expect(b.texteDeborde, `${ou} : « ${b.texte} » dans son bouton`).toBe(false);
  }
}

async function premiereFiche(page: Page, liste: string): Promise<string> {
  await page.goto(liste);
  const href = await page.locator(`main a[href^="${liste}/"]:not([href^="/vannes/theme"])`).first().getAttribute("href");
  expect(href, `une fiche dans ${liste}`).toBeTruthy();
  return href ?? liste;
}

test.describe("Boutons prix sur une ligne à 375 px @s21", () => {
  localSeulement();
  // Téléphone de 375 px (barres de défilement superposées, comme sur un iPhone ou un Android).
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  for (const chemin of ["/", "/abonnement", "/vannes", "/conseils", "/videos", "/carnet", "/glossaire", "/a-propos", "/blog/repondre-moqueries-avec-humour"]) {
    test(`visiteur ${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      await verifier(page, chemin);
    });
  }

  for (const liste of ["/vannes", "/conseils", "/videos"]) {
    test(`fiche de ${liste}`, async ({ page }) => {
      const fiche = await premiereFiche(page, liste);
      await page.goto(fiche);
      await verifier(page, fiche);
    });
  }

  test("fin de l'étape 1 de /parcours/repartie", async ({ page }) => {
    await page.goto("/parcours/repartie");
    for (let i = 0; i < 10; i++) {
      const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
      if ((await options.count()) === 0) break;
      await options.first().click();
      await page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ }).click();
    }
    await expect(page.locator("[data-fin-etape-1]")).toBeVisible();
    await verifier(page, "fin de l'étape 1");
  });

  test("fenêtre Premium ouverte depuis la carte floutée de /vannes", async ({ page }) => {
    await page.goto("/vannes");
    await page.getByRole("button", { name: /Contenu Premium\s:\svoir l['’]offre/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await verifier(page, "fenêtre Premium");
  });
});

/**
 * À 320 px, certains libellés validés ne tiennent pas sur une ligne même en 15 px (« Voir la suite des
 * conseils · 2,99 €/mois ») : ils reviennent à la ligne, mais leur texte ne sort jamais du bouton.
 */
test.describe("Boutons prix à 320 px : texte dans le bouton @s21", () => {
  localSeulement();
  test.use({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });

  for (const chemin of ["/", "/abonnement", "/conseils", "/glossaire"]) {
    test(`visiteur ${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      const boutons = await boutonsPrix(page);
      expect(boutons.length, `${chemin} : au moins un bouton prix`).toBeGreaterThan(0);
      for (const b of boutons) {
        expect(b.deborde, `${chemin} : « ${b.texte} » dans l'écran`).toBe(false);
        expect(b.texteDeborde, `${chemin} : « ${b.texte} » dans son bouton`).toBe(false);
      }
    });
  }
});
