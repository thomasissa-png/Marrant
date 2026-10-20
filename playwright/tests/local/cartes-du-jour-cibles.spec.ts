import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Cartes du jour v2 (docs/design/cartes-du-jour/diagnostic-et-spec.md, V2.6) : cibles tactiles de
 * l'accueil sur le rendu réel. Partage et étoile : boîte cliquable de 44 px au moins (disque visible de
 * 32 px). Réactions 🔥 💀 : la zone étendue (`after:-inset-y-2.5`) capte un toucher à ± 10 px de la
 * pastille (sondée à 9 px : le bord exact de la zone de 10 px n'est pas inclus). « Révéler la chute »,
 * accordéons et « Lire la suite » : 44 px de haut au moins.
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

      // Réactions : un toucher à 9 px au-dessus et au-dessous de la pastille atteint encore le bouton.
      for (const reaction of await section.getByRole("button", { name: /hilarant|pas terrible/ }).all()) {
        await reaction.scrollIntoViewIfNeeded();
        const b = await reaction.boundingBox();
        expect(b).not.toBeNull();
        if (!b) continue;
        const x = b.x + b.width / 2;
        for (const y of [b.y - 9, b.y + b.height + 9]) {
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

/**
 * Tour 2.1 (arbitrage orchestrateur) : « Révéler la chute » compact (44 à 72 px de haut) à 12 px sous
 * l'énoncé ; au clic, la chute prend sa place et le haut de l'énoncé ne bouge pas.
 */
test.describe("Accueil, cartes du jour : emplacement de la chute", () => {
  localSeulement();

  for (const largeur of [320, 768, 1280, 1440]) {
    test(`bouton compact, énoncé immobile au clic à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/");
      const section = page.locator("section[aria-labelledby='contenu-du-jour-titre']");
      const bouton = section.getByRole("button", { name: "Révéler la chute" });
      await expect(bouton).toBeVisible();
      await bouton.scrollIntoViewIfNeeded();
      const mesure = () =>
        page.evaluate(() => {
          const place = document.getElementById("chute-du-jour") as HTMLElement;
          const enonce = (place.parentElement?.firstElementChild as HTMLElement).getBoundingClientRect();
          const p = place.getBoundingClientRect();
          return { haut: enonce.top + window.scrollY, ecart: p.top - enonce.bottom, hauteur: p.height };
        });
      const avant = await mesure();
      expect(avant.hauteur, "hauteur du bouton").toBeGreaterThanOrEqual(44);
      expect(avant.hauteur, "hauteur du bouton").toBeLessThanOrEqual(72);
      expect(Math.round(avant.ecart), "écart énoncé / bouton").toBe(12);

      await bouton.click();
      await expect(section.locator("#chute-du-jour [tabindex='-1']")).toBeFocused();
      const apres = await mesure();
      expect(Math.abs(apres.haut - avant.haut), "l'énoncé a bougé au clic").toBeLessThanOrEqual(0.5);
      expect(Math.round(apres.ecart), "écart énoncé / chute").toBe(12);
    });
  }
});

/**
 * Spec v3 (V3.1) : cartes à hauteur naturelle, alignées en haut. Aucun vide intérieur de plus de 24 px
 * (entre deux blocs d'une carte, ou sous le pied) ; ouvrir la chute, « Pourquoi ça marche », « Lire la
 * suite » ou un accordéon n'agrandit que sa carte, les voisines ne bougent pas d'un pixel.
 */
test.describe("Accueil, cartes du jour : hauteurs naturelles", () => {
  localSeulement();

  const cotes = (page: import("@playwright/test").Page) =>
    page.evaluate(() => {
      const grille = document.querySelector("section[aria-labelledby='contenu-du-jour-titre'] > div") as HTMLElement;
      return Array.from(grille.children).map((carte) => {
        const r = carte.getBoundingClientRect();
        const corps = carte.lastElementChild as HTMLElement;
        const blocs = Array.from(corps.children).filter((b) => (b as HTMLElement).offsetHeight > 0).map((b) => b.getBoundingClientRect());
        const vides = blocs.slice(1).map((b, i) => b.top - blocs[i].bottom);
        vides.push(r.bottom - blocs[blocs.length - 1].bottom);
        return { haut: r.top + window.scrollY, bas: r.bottom + window.scrollY, videMax: Math.max(...vides) };
      });
    });

  for (const largeur of [375, 1024, 1280, 1440]) {
    test(`aucun vide intérieur > 24 px, voisines immobiles à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/");
      const section = page.locator("section[aria-labelledby='contenu-du-jour-titre']");
      await expect(section.getByRole("button", { name: "Révéler la chute" })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      const ouvertures: { nom: string; carte: number; agir: () => Promise<void> }[] = [
        { nom: "chute", carte: 0, agir: () => section.getByRole("button", { name: "Révéler la chute" }).click() },
        { nom: "Pourquoi ça marche", carte: 0, agir: () => section.locator("summary", { hasText: "Pourquoi ça marche" }).click() },
        { nom: "Exemple concret", carte: 1, agir: () => section.locator("summary", { hasText: "Exemple concret" }).click() },
        { nom: "Ce que tu vas apprendre", carte: 2, agir: () => section.locator("summary", { hasText: "Ce que tu vas apprendre" }).click() },
      ];
      if (await section.getByRole("button", { name: "Lire la suite" }).count()) {
        ouvertures.splice(2, 0, { nom: "Lire la suite", carte: 1, agir: () => section.getByRole("button", { name: "Lire la suite" }).click() });
      }

      let avant = await cotes(page);
      for (const [i, c] of avant.entries()) expect(c.videMax, `vide intérieur, carte ${i + 1}, fermé`).toBeLessThanOrEqual(25);
      for (const o of ouvertures) {
        await o.agir();
        await page.waitForTimeout(400);
        const apres = await cotes(page);
        for (const [i, c] of apres.entries()) {
          expect(c.videMax, `vide intérieur, carte ${i + 1}, après « ${o.nom} »`).toBeLessThanOrEqual(25);
          if (i === o.carte || apres[i].haut > avant[o.carte].bas) continue; // la carte ouverte, ou une carte placée dessous
          expect(Math.abs(c.haut - avant[i].haut), `carte ${i + 1} déplacée par « ${o.nom} »`).toBeLessThanOrEqual(0.5);
          expect(Math.abs(c.bas - avant[i].bas), `carte ${i + 1} étirée par « ${o.nom} »`).toBeLessThanOrEqual(0.5);
        }
        avant = apres;
      }
    });
  }
});
