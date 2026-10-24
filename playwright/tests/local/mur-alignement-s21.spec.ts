import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Revue visuelle s21 (demande de Thomas, 18/10 : « des écarts comme ici […] sur PC et mobile ») :
 * le bloc de bas de liste (`MurListe`) prend la colonne de la liste. Avant le correctif, il était
 * centré sur 576 px (`mx-auto max-w-xl`) sous une liste alignée à gauche : plus étroit et décalé.
 *
 * Figé ici, en visiteur (liste limitée), à 375 et 1 280 px, pour /vannes, /conseils et /videos :
 * - bord gauche et largeur du mur = ceux de la liste (`[role="tabpanel"]`), à 1 px près ;
 * - la phrase de limite est DANS le mur, en tête (elle ne flotte plus seule sous la liste) ;
 * - la carte floutée (une seule, concision v5) a les mêmes bords que la liste.
 */
const LISTES = ["vannes", "conseils", "videos"] as const;

test.describe("Murs des listes : alignés sur la colonne de la liste @s21", () => {
  localSeulement();

  for (const largeur of [375, 1280]) {
    for (const liste of LISTES) {
      test(`/${liste} à ${largeur} px`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 900 });
        await page.goto(`/${liste}`);
        const grille = page.locator('main [role="tabpanel"]').first();
        const mur = page.locator(`[data-mur-liste="${liste}"]`);
        await expect(grille).toBeVisible();
        await mur.scrollIntoViewIfNeeded();
        await expect(mur).toBeVisible();

        const g = await grille.boundingBox();
        const m = await mur.boundingBox();
        expect(g && m, "boîtes de la liste et du mur").toBeTruthy();
        if (!g || !m) return;
        expect(Math.abs(m.x - g.x), `bord gauche du mur = liste (${m.x} vs ${g.x})`).toBeLessThanOrEqual(1);
        expect(Math.abs(m.width - g.width), `largeur du mur = liste (${m.width} vs ${g.width})`).toBeLessThanOrEqual(1);

        // La limite est dans le mur, avant son titre.
        const limite = mur.locator(`[data-mur-liste-limite="${liste}"]`);
        await expect(limite).toBeVisible();
        const titre = mur.getByRole("heading", { level: 2 });
        const yLimite = (await limite.boundingBox())?.y ?? 0;
        const yTitre = (await titre.boundingBox())?.y ?? 0;
        expect(yLimite, "limite au-dessus du titre du mur").toBeLessThan(yTitre);

        // Carte floutée : mêmes bords que la liste (avant : une carte seule dans une demi-rangée vide).
        const floutees = page.getByRole("button", { name: /^Contenu premium/i }).filter({ visible: true });
        await expect(floutees).toHaveCount(1);
        const f = await floutees.first().boundingBox();
        expect(Math.abs((f?.x ?? 0) - g.x), "carte floutée alignée à gauche").toBeLessThanOrEqual(1);
        expect(Math.abs((f?.width ?? 0) - g.width), "carte floutée de la largeur de la liste").toBeLessThanOrEqual(1);
      });
    }
  }
});
