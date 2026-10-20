import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Cartes du jour v2 (docs/design/cartes-du-jour/diagnostic-et-spec.md, V2.6) : cibles tactiles de
 * l'accueil sur le rendu réel. Partage et étoile : boîte cliquable de 44 px au moins (disque visible de
 * 32 px). Réactions 🔥 💀 : la zone étendue (`after:-inset-y-2.5`) capte un toucher à ± 10 px de la
 * pastille. « Révéler la chute », accordéons et « Lire la suite » : 44 px de haut au moins.
 */
const LARGEURS = [320, 375, 1280];

test.describe("Accueil, cartes du jour : cibles tactiles", () => {
  localSeulement();

  for (const largeur of LARGEURS) {
    test(`cibles de 44 px à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/");
      const section = page.locator("section[aria-labelledby='contenu-du-jour-titre']");
      const reveler = section.getByRole("button", { name: "Révéler la chute" });
      await expect(reveler).toBeVisible();

      const boites = [
        ...(await section.getByRole("button", { name: "Partager" }).all()),
        ...(await section.getByRole("button", { name: /^Ajouter aux favoris/ }).all()),
      ];
      expect(boites, "partage et étoile sur les 3 cartes").toHaveLength(6);
      for (const bouton of [...boites, reveler]) {
        await bouton.scrollIntoViewIfNeeded();
        const b = await bouton.boundingBox();
        const nom = await bouton.getAttribute("aria-label") ?? (await bouton.textContent());
        expect(b?.width ?? 0, `largeur de « ${nom} »`).toBeGreaterThanOrEqual(44);
        expect(b?.height ?? 0, `hauteur de « ${nom} »`).toBeGreaterThanOrEqual(44);
      }

      for (const titre of await section.locator("summary").filter({ visible: true }).all()) {
        expect((await titre.boundingBox())?.height ?? 0, `accordéon « ${await titre.textContent()} »`).toBeGreaterThanOrEqual(44);
      }
      const lireSuite = section.getByRole("button", { name: "Lire la suite" });
      if (await lireSuite.count()) expect((await lireSuite.boundingBox())?.height ?? 0, "« Lire la suite »").toBeGreaterThanOrEqual(44);

      // Réactions : un toucher à 10 px au-dessus et au-dessous de la pastille atteint encore le bouton.
      for (const reaction of await section.getByRole("button", { name: /hilarant|pas terrible/ }).all()) {
        await reaction.scrollIntoViewIfNeeded();
        const b = await reaction.boundingBox();
        expect(b).not.toBeNull();
        if (!b) continue;
        const x = b.x + b.width / 2;
        for (const y of [b.y - 10, b.y + b.height + 10]) {
          const atteint = await reaction.evaluate((el, [px, py]) => {
            const cible = document.elementFromPoint(px, py);
            return !!cible && (cible === el || el.contains(cible));
          }, [x, y]);
          expect(atteint, `réaction « ${await reaction.getAttribute("aria-label")} » à y = ${Math.round(y)}`).toBe(true);
        }
      }
    });
  }
});
