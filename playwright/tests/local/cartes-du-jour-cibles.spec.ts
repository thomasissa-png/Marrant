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
 * Spec v4 (V4.1 à V4.4) : bandeau Vanne, puis rangée Conseil + Vidéo de même hauteur dès 1024 px. Aucun vide
 * intérieur de plus de 24 px (entre deux blocs, dans une pile interne, ou sous le pied) ; à l'état fermé, les
 * deux cartes de la rangée ont la même hauteur et le même filet de pied ; ouvrir quelque chose ne déplace
 * aucune voisine et n'en étire aucune de plus de 24 px.
 */
test.describe("Accueil, cartes du jour : bandeau et rangée", () => {
  localSeulement();

  const cotes = (page: import("@playwright/test").Page) =>
    page.evaluate(() => {
      const grille = document.querySelector("section[aria-labelledby='contenu-du-jour-titre'] > div") as HTMLElement;
      const cartes = [grille.children[0], ...Array.from(grille.children[1].children)];
      return cartes.map((carte) => {
        const r = carte.getBoundingClientRect();
        const corps = carte.lastElementChild as HTMLElement;
        const blocs = Array.from(corps.children).filter((b) => (b as HTMLElement).offsetHeight > 0).map((b) => b.getBoundingClientRect());
        const vides = blocs.slice(1).map((b, i) => b.top - blocs[i].bottom);
        vides.push(r.bottom - blocs[blocs.length - 1].bottom);
        for (const pile of Array.from(corps.querySelectorAll(".flex-col"))) {
          const enfants = Array.from(pile.children).filter((b) => (b as HTMLElement).offsetHeight > 0).map((b) => b.getBoundingClientRect());
          vides.push(...enfants.slice(1).map((b, i) => b.top - enfants[i].bottom));
        }
        const pied = corps.querySelector(":scope > .border-t") as HTMLElement | null;
        // Conseil court (V4.3) : reste de plus d'une ligne réparti en parts égales entre les blocs, vide accepté.
        const reparti = !!corps.querySelector("[data-extrait='court']");
        const ecarts = blocs.slice(1).map((b, i) => b.top - blocs[i].bottom);
        const lien = Array.from(corps.querySelectorAll("button")).find((b) => b.textContent === "Lire la suite");
        // « Lire la suite » : encombrement visuel de 20 px (zone de 44 px en marges négatives, V3.4).
        if (lien) {
          const r2 = lien.getBoundingClientRect();
          const suivant = (lien.parentElement as HTMLElement).nextElementSibling?.getBoundingClientRect();
          if (suivant) vides.push(suivant.top - (r2.bottom - 12));
        }
        return {
          reparti,
          ecartsEgaux: Math.max(...ecarts) - Math.min(...ecarts) <= 1,
          gauche: r.left,
          droite: r.right,
          haut: r.top + window.scrollY,
          bas: r.bottom + window.scrollY,
          filet: pied ? pied.getBoundingClientRect().top + window.scrollY : null,
          videMax: Math.max(...vides),
        };
      });
    });

  for (const largeur of [375, 768, 1024, 1280, 1440]) {
    test(`vides, rangée et voisines à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/");
      const section = page.locator("section[aria-labelledby='contenu-du-jour-titre']");
      await expect(section.getByRole("button", { name: "Révéler la chute" })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);

      let avant = await cotes(page);
      for (const [i, c] of avant.entries()) {
        if (c.reparti) expect(c.ecartsEgaux, `carte ${i + 1} : espace réparti en parts égales`).toBe(true);
        else expect(c.videMax, `vide intérieur, carte ${i + 1}, fermé`).toBeLessThanOrEqual(25);
      }
      if (largeur >= 1024) {
        const [bandeau, conseil, video] = avant;
        expect(Math.abs(conseil.gauche - bandeau.gauche), "bord gauche commun").toBeLessThanOrEqual(0.5);
        expect(Math.abs(video.droite - bandeau.droite), "bord droit commun").toBeLessThanOrEqual(0.5);
        expect(Math.round(conseil.haut - bandeau.bas), "gouttière bandeau / rangée").toBe(24);
        expect(Math.round(video.gauche - conseil.droite), "gouttière entre les cartes").toBe(24);
        expect(Math.abs(conseil.bas - video.bas), "rangée de même hauteur").toBeLessThanOrEqual(0.5);
        expect(Math.abs((conseil.filet ?? 0) - (video.filet ?? 0)), "filets de pied alignés").toBeLessThanOrEqual(0.5);
      }

      const ouvertures: { nom: string; carte: number; agir: () => Promise<void> }[] = [
        { nom: "chute", carte: 0, agir: () => section.getByRole("button", { name: "Révéler la chute" }).click() },
        { nom: "Pourquoi ça marche", carte: 0, agir: () => section.locator("summary", { hasText: "Pourquoi ça marche" }).click() },
        { nom: "Exemple concret", carte: 1, agir: () => section.locator("summary", { hasText: "Exemple concret" }).click() },
        { nom: "Ce que tu vas apprendre", carte: 2, agir: () => section.locator("summary", { hasText: "Ce que tu vas apprendre" }).click() },
      ];
      if (await section.getByRole("button", { name: "Lire la suite" }).count()) {
        ouvertures.splice(2, 0, { nom: "Lire la suite", carte: 1, agir: () => section.getByRole("button", { name: "Lire la suite" }).click() });
      }
      for (const o of ouvertures) {
        await o.agir();
        await page.waitForTimeout(400);
        const apres = await cotes(page);
        for (const [i, c] of apres.entries()) {
          if (!c.reparti) expect(c.videMax, `vide intérieur, carte ${i + 1}, après « ${o.nom} »`).toBeLessThanOrEqual(25);
          if (i === o.carte || apres[i].haut > avant[o.carte].bas) continue; // la carte ouverte, ou une carte placée dessous
          expect(Math.abs(c.haut - avant[i].haut), `carte ${i + 1} déplacée par « ${o.nom} »`).toBeLessThanOrEqual(0.5);
          expect(Math.abs(c.bas - avant[i].bas), `carte ${i + 1} étirée par « ${o.nom} »`).toBeLessThanOrEqual(24.5);
        }
        avant = apres;
      }
    });
  }
});

/** Focus clavier sur « Lire la suite » dès 1024 px : l'extrait ne défile pas (1re ligne jamais coupée). */
test.describe("Accueil, cartes du jour : focus sur « Lire la suite »", () => {
  localSeulement();

  for (const largeur of [1280, 1440]) {
    test(`extrait immobile au focus à ${largeur} px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/");
      await expect(page.getByRole("button", { name: "Révéler la chute" })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const lien = page.getByRole("button", { name: "Lire la suite" });
      test.skip((await lien.count()) === 0, "conseil du jour entier à cette largeur");
      await page.keyboard.press("Tab");
      await lien.focus();
      const decalages = await page.evaluate(() => {
        const texte = document.getElementById("conseil-du-jour-texte") as HTMLElement;
        return [texte.scrollTop, (texte.parentElement as HTMLElement).scrollTop];
      });
      expect(decalages, "défilement interne de l'extrait").toEqual([0, 0]);
    });
  }
});
