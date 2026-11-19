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
 *   la carte d'en-tête, une seule étape visible, menu toujours à 137 px après un clic d'étape, tour 5) ; à 375, l'en-tête d'étape
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
      // s26 parcours, tour 5 : test changé (raison : menu collé à 137 px, le haut d'une étape ou d'une fiche amenée sous
      // l'en-tête, au lieu de 144 ; D6 de la relecture design v2, 7 px de décalage entre menu et carte d'étape).
      expect(Math.abs(haut - ANCRE), `haut collé du menu : ${haut}`).toBeLessThanOrEqual(2);
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

  // s26 parcours, tour 5 (relectures à l'aveugle v2 : UX F1, F2, F3, F6, F8 ; design D1, D6, D9).
  for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
    test(`${largeur} : clic sur chaque sous-étape, son bloc à 137 ± 2 px, un seul état actif`, async ({ page }) => {
      await abonne(page);
      await valider(page, SLUG, [1]);
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto(`/parcours/${SLUG}`);
      const menu = page.locator("[data-menu-etapes]");
      // Progression lue : l'étape 2 (à reprendre) est l'étape active du menu.
      await expect(menu.locator("a[aria-current='step']")).toHaveAttribute("href", "#etape-2");
      // 1280 : les sous-étapes du menu ; 375 : la liste en tête de l'étape ouverte (menu replié).
      const liste = largeur >= 1024 ? menu.getByTestId("lignes-fiches-menu") : page.locator("#etape-2").getByTestId("lignes-fiches");
      await expect(liste.locator("a[data-fiche]").first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const ancres = await liste.locator("a[data-fiche]").evaluateAll((as) => as.map((a) => a.getAttribute("data-fiche") as string));
      expect(ancres.length, "sous-étapes de l'étape 2").toBeGreaterThanOrEqual(4);
      for (const ancre of ancres) {
        const lien = liste.locator(`a[data-fiche='${ancre}']`);
        await lien.scrollIntoViewIfNeeded();
        const titre = (await lien.locator("span").nth(1).textContent())?.replace(/\s+/g, " ").trim() ?? "";
        await lien.click();
        await expect(page).toHaveURL(new RegExp(`#${ancre}$`));
        const bloc = page.locator(`#${ancre}`);
        const haut = await hautStable(bloc);
        expect(Math.abs(haut - ANCRE), `${ancre} (« ${titre} ») : haut du bloc ${haut}`).toBeLessThanOrEqual(2);
        // Le bloc porte le titre de la ligne (vidéo : titre et artiste de la carte).
        const texteBloc = ((await bloc.textContent()) ?? "").replace(/\s+/g, " ");
        for (const morceau of titre.split(" · ")) expect(texteBloc, ancre).toContain(morceau);
        // Un seul état actif : une étape (aria-current="step") et une sous-étape, celle cliquée, partout dans la page.
        expect(await menu.locator("a[aria-current='step']").count()).toBe(1);
        const actives = await page.locator("a[data-fiche-active]").evaluateAll((as) =>
          Array.from(new Set(as.map((a) => a.getAttribute("data-fiche")))),
        );
        expect(actives, `fiches actives après ${ancre}`).toEqual([ancre]);
        await expect(page.locator(`a[data-fiche='${ancre}'][aria-current='location']`).first()).toBeAttached();
        if (largeur >= 1024) {
          // Menu collé au même haut que le bloc (D6 : au pixel).
          const hautMenu = await hautStable(menu);
          expect(Math.abs(hautMenu - haut), `menu ${hautMenu}, bloc ${haut}`).toBeLessThanOrEqual(1);
        } else {
          await page.locator("#etape-2").getByTestId("lignes-fiches").scrollIntoViewIfNeeded();
        }
      }
      // Sous-étapes sans soulignement au repos (D2) : pointeur hors de la liste, focus rendu au corps de page.
      await page.mouse.move(0, 0);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const auRepos = await liste.locator("a[data-fiche] span").evaluateAll((ss) =>
        ss.filter((s) => getComputedStyle(s).textDecorationLine.includes("underline")).length,
      );
      expect(auRepos, "sous-étapes soulignées au repos").toBe(0);
    });
  }

  for (const compte of ["visiteur", "gratuit"] as const) {
    for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
      test(`${largeur}, ${compte} : « Passer à l'étape 2 » visible en fin d'étape 1, cadenas sur les étapes suivantes`, async ({ page }) => {
        if (compte === "gratuit") {
          const email = `e2e-pc-s26-g5-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
          await creerCompte(email, MOT_DE_PASSE, "FREE");
          await connecter(page, email, MOT_DE_PASSE);
        }
        await page.setViewportSize({ width: largeur, height: hauteur });
        await page.goto(`/parcours/${SLUG}#etape-1`);
        await expect(page.locator("#etape-1-entete")).toHaveAttribute("aria-expanded", "true");
        const passer = page.locator("#etape-1").getByRole("link", { name: /^Passer à l’étape 2 · 1,99/ });
        await passer.scrollIntoViewIfNeeded();
        await expect(passer).toBeVisible();
        await expect(passer).toBeInViewport();
        expect(await passer.evaluate((e) => e.className)).not.toMatch(/(^|\s)bg-accent/);
        // Menu : étape 1 en lecture libre, étapes 2 et suivantes avec le cadenas de la bande de rubriques.
        if (largeur < 1024) await page.locator("[data-menu-bascule]").click();
        const menu = page.locator("[data-menu-etapes]");
        await expect(menu).toBeVisible();
        const lignes = await menu.locator("[data-ligne-etape]").evaluateAll((ls) =>
          ls.map((l) => ({ n: Number(l.getAttribute("data-ligne-etape")), cadenas: !!l.querySelector("[data-statut='verrouillee'] svg rect") })),
        );
        expect(lignes.length).toBeGreaterThanOrEqual(3);
        for (const l of lignes) expect(l.cadenas, `étape ${l.n}`).toBe(l.n >= 2);
        const icone = await page.locator("header svg rect[width='16'][height='10']").first().evaluate((r) => r.parentElement?.innerHTML).catch(() => null);
        const iconeMenu = await menu.locator("[data-statut='verrouillee'] svg").first().evaluate((s) => s.innerHTML);
        if (icone) expect(iconeMenu).toBe(icone);
      });
    }
  }

  for (const [largeur, hauteur] of [[768, 1024], [1024, 768], [1280, 900], [1920, 1080]] as const) {
    test(`${largeur} : /parcours, aucune carte avec du texte en colonnes CSS, une cellule par bloc, écart ≤ 32 px`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/parcours");
      const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
      await expect(cartes.first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const mesures = await cartes.evaluateAll((cs) =>
        cs.map((c) => {
          const colonnes = Array.from(c.querySelectorAll<HTMLElement>("*")).filter((e) => {
            const s = getComputedStyle(e);
            return (s.columnCount !== "auto" && s.columnCount !== "1") || s.columnWidth !== "auto";
          }).length;
          const texte = c.querySelector<HTMLElement>("[data-parcours-texte]");
          const blocs = texte ? (Array.from(texte.children) as HTMLElement[]) : [];
          const h = blocs.map((b) => b.getBoundingClientRect().height);
          const hauts = blocs.map((b) => Math.round(b.getBoundingClientRect().top));
          return { id: c.id, colonnes, blocs: blocs.length, cotes: hauts.length === 2 && hauts[0] === hauts[1], ecart: h.length === 2 ? Math.round(Math.abs(h[0] - h[1])) : -1 };
        }),
      );
      expect(mesures.length).toBeGreaterThanOrEqual(3);
      for (const m of mesures) {
        expect(m.colonnes, `${m.id} : éléments en colonnes CSS`).toBe(0);
        expect(m.blocs, `${m.id} : une cellule par bloc`).toBe(2);
        expect(m.cotes, `${m.id} : description et témoignage côte à côte`).toBe(true);
        expect(m.ecart, `${m.id} : écart de hauteur ${m.ecart} px`).toBeLessThanOrEqual(32);
      }
    });
  }

  test("1280 : retour du navigateur depuis un parcours, la carte du parcours sous l'en-tête (137 ± 2 px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/parcours");
    const cartes = page.locator("[data-parcours-cartes] > [id^='parcours-']");
    await expect(cartes.first()).toBeVisible();
    const derniere = cartes.last();
    const id = (await derniere.getAttribute("id")) as string;
    const slug = id.replace(/^parcours-/, "");
    // Bouton de la carte (« Tester l'étape 1 de … » : `router.push`, pas un lien).
    const bouton = derniere.getByRole("button", { name: /^Tester l’étape 1 de / });
    await bouton.scrollIntoViewIfNeeded();
    await bouton.click();
    await expect(page).toHaveURL(new RegExp(`/parcours/${slug}`));
    await expect(page.locator("[data-menu-etapes]")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/parcours$/);
    const haut = await hautStable(page.locator(`#${id}`));
    expect(Math.abs(haut - ANCRE), `haut de ${id} au retour : ${haut}`).toBeLessThanOrEqual(2);
  });

  test("1280 : progression cohérente (« Étape 3 sur 3 » sur /parcours et dans le menu) et segments vides visibles (3:1)", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    // Nouvel abonné : segments « à venir » cernés à 3:1 au moins contre le fond de la carte.
    await page.goto("/parcours");
    await expect(page.locator("[data-parcours-cartes] [role='progressbar']").first()).toBeVisible();
    const contrastes = await page.locator("[data-segment='a-venir']").evaluateAll((ss) => {
      const lum = (c: string) => {
        const [r, g, b] = (c.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).slice(0, 3).map((v) => {
          const x = Number(v) / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      return ss.map((s) => {
        let e: HTMLElement | null = s.parentElement;
        while (e && getComputedStyle(e).backgroundColor.match(/rgba\(0, 0, 0, 0\)|transparent/)) e = e.parentElement;
        const fond = lum(e ? getComputedStyle(e).backgroundColor : "rgb(13, 13, 13)");
        const bord = lum(getComputedStyle(s).borderTopColor);
        const largeurBord = parseFloat(getComputedStyle(s).borderTopWidth);
        return largeurBord >= 1 ? (Math.max(fond, bord) + 0.05) / (Math.min(fond, bord) + 0.05) : 0;
      });
    });
    expect(contrastes.length).toBeGreaterThan(0);
    for (const c of contrastes) expect(c, "contraste du contour d'un segment vide").toBeGreaterThanOrEqual(3);

    await valider(page, SLUG, [1, 2]);
    await page.goto("/parcours");
    await expect(page.getByTestId("carte-en-cours")).toContainText("Étape 3 sur 3");
    await page.goto(`/parcours/${SLUG}`);
    const enTeteMenu = page.locator("[data-menu-etapes] #menu-etapes-titre + p");
    await expect(enTeteMenu).toHaveText("Étape 3 sur 3");
    await expect(page.locator("main")).not.toContainText("2 sur 3 étapes");
  });
});
