import { randomBytes } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";

/**
 * Refonte d'« Aujourd'hui » (s25, `docs/ux/aujourdhui-refonte-s25.md`, `docs/design/aujourdhui-refonte-s25.md`), en
 * vrai navigateur, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1`) :
 * - aperçu (visiteur, gratuit) : bouton d'offre au premier écran à 375 et 1280, H1 aligné à gauche, extrait inerte
 *   (aucun focus, aucun clic), un verrou seul sur chaque bloc fermé (échelle s25, arbitrage du 16/11 : plus de
 *   pastille « Premium » par bloc, une seule dans le hero) ; v7 tour 2 (faute 4) : « Ton cap » entier
 *   AVANT le fondu à toutes les largeurs, le fondu ne coupe aucune ligne de texte, aucune pastille du hero seule sur
 *   sa ligne ;
 * - abonné neuf : Z1 8/12 et « Ton cap » 4/12 sur la même rangée dès 1024 px, une colonne dessous ; aucune rangée
 *   à moitié vide ; aucun débordement horizontal (halo compris) de 375 à 1920 ; v7 tour 2 (fautes 1, 2, 3, 5) : pas
 *   plus de 24 px de vide sous le contenu de Z1 et Z2 (au-delà de leur marge), aucun creux de plus de 32 px dans
 *   « Étape conseillée », « Tes 4 premières semaines » et les cartes du contenu du jour, « Semaine n » en tête de ligne ;
 * - v7 tour 3 (fautes 1 à 3) : rangée 2 de l'extrait lisible avant le fondu (étiquette, titre, barre et « Étape n sur
 *   N » ensemble, « Vanne du jour » en clair), aucune ligne visible à cheval sur le point transparent ; à 900 px de
 *   haut (1280, 1456, 1920), le bouton d'offre de la fin d'extrait sous le premier écran ; éléments figés à 3,9:1 au
 *   moins ; à 768, la vidéo du jour n'est plus une dalle ;
 * - v7 tour 4 (fautes 1 et 2, pistes) : dès 1024, bas du texte du hero et bas de la carte d'offre à 24 px près
 *   (échelle s25 : pastilles calées en bas de colonne ; la fin d'extrait, phrase comprise, sous 900 px) ; à 768, offre à droite du texte (60/40) ; à 768, tuile « Vidéo du jour » en
 *   ligne de média, au plus 32 px de vide au-dessus et au-dessous du texte en face de la vignette (titre sur deux
 *   lignes) ; dès 1024, titre « Contenu du jour » de l'extrait à la hauteur de ceux de ses voisines.
 */
const MOT_DE_PASSE = "E2e-aujourdhui-s25!";
const CAPTURES = process.env.E2E_CAPTURES_AUJ_S25;
const LARGEURS = [375, 768, 1280, 1920];

/**
 * Vides d'un bloc (v7 tour 2) : lignes de contenu = nœuds texte visibles, svg, barres, boutons, vignettes, filets
 * hauts (`border-t`) ; `bas` = vide sous la dernière ligne AU-DELÀ de la marge intérieure ; `creux` = plus grand
 * écart vertical entre deux lignes de contenu.
 */
function vides(el: Element) {
  const rects: { t: number; b: number }[] = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.textContent?.trim() || n.parentElement?.closest(".sr-only,[data-badge-premium]")) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    for (const x of Array.from(r.getClientRects())) if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
  }
  for (const e of Array.from(el.querySelectorAll("svg,[data-barre-etapes],[data-segments-cap],button,.aspect-video,li.rounded-md,span[aria-disabled]"))) {
    if (e.closest("[data-badge-premium]")) continue;
    const x = e.getBoundingClientRect();
    if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
  }
  for (const e of Array.from(el.querySelectorAll('[class*="border-t"]'))) {
    const x = e.getBoundingClientRect();
    if (parseFloat(getComputedStyle(e).borderTopWidth) > 0 && x.height > 0) rects.push({ t: x.top, b: x.top + 1 });
  }
  rects.sort((a, b) => a.t - b.t);
  const u: { t: number; b: number }[] = [];
  for (const r of rects) {
    const d = u[u.length - 1];
    if (d && r.t <= d.b + 0.5) d.b = Math.max(d.b, r.b);
    else u.push({ ...r });
  }
  const b = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  let creux = 0;
  for (let i = 1; i < u.length; i++) creux = Math.max(creux, u[i].t - u[i - 1].b);
  const bas = b.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom) - (u[u.length - 1]?.b ?? b.bottom);
  return { bas: Math.round(bas), creux: Math.round(creux) };
}

const boite = async (l: Locator) => {
  const b = await l.boundingBox();
  if (!b) throw new Error("élément invisible");
  return { gauche: b.x, droite: b.x + b.width, haut: b.y, bas: b.y + b.height, largeur: b.width, hauteur: b.height };
};
const debord = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function capturer(page: Page, nom: string, largeur: number) {
  if (CAPTURES) await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png`, fullPage: true });
}

test.describe("@espace refonte d'« Aujourd'hui » s25 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(180_000);

  test("aperçu (visiteur) : offre au premier écran, extrait inerte et coupé, verrou sur chaque bloc fermé", async ({ page }) => {
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: largeur === 375 ? 667 : 800 });
      await page.goto("/mon-espace");
      const ou = `${largeur} px`;
      // Dans la page (le bouton global de l'en-tête porte le même nom, comme à l'accueil).
      const offres = page.locator("[data-apercu-verrouille]").getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
      await expect(offres).toHaveCount(2);
      if (largeur === 375 || largeur === 1280) await expect(offres.first(), `bouton au premier écran, ${ou}`).toBeInViewport({ ratio: 1 });
      expect((await boite(offres.first())).hauteur, `bouton 44 px, ${ou}`).toBeGreaterThanOrEqual(44);
      expect(await page.locator("h1").evaluate((h) => getComputedStyle(h).textAlign), `H1 à gauche, ${ou}`).not.toBe("center");
      await expect(page.getByText(TEXTES_APERCU_VERROUILLE.suite)).toBeVisible();
      const extrait = page.locator("[data-apercu-extrait] > [aria-hidden='true']");
      // v7 tour 2 (faute 4) : « Ton cap » (progression, série) entier au-dessus de la suite fondue, à toutes les
      // largeurs ; le fondu finit entre deux lignes (aucun texte à cheval sur le point transparent).
      const [cap, suite] = [await boite(extrait.locator("[data-cap-du-jour]")), await boite(extrait.locator("[data-apercu-suite]"))];
      expect(cap.bas, `« Ton cap » avant le fondu, ${ou}`).toBeLessThanOrEqual(suite.haut);
      // v7 tour 3 : une ligne masquée par un parent qui coupe (`overflow-hidden`, accroche de la mission coupée après
      // 3 lignes) n'est pas dessinée : seule sa partie visible compte.
      const coupees = await extrait.locator("[data-apercu-suite]").evaluate((s) => {
        const transparent = s.getBoundingClientRect().bottom - 48;
        const w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
        const out: string[] = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (!n.textContent?.trim() || n.parentElement?.closest("[data-badge-premium]")) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const x of Array.from(r.getClientRects())) {
            let [haut, bas] = [x.top, x.bottom];
            for (let e = n.parentElement; e && e !== s; e = e.parentElement) {
              if (getComputedStyle(e).overflowY === "visible") continue;
              const b = e.getBoundingClientRect();
              [haut, bas] = [Math.max(haut, b.top), Math.min(bas, b.bottom)];
            }
            if (bas - haut > 1 && haut < transparent && bas > transparent) out.push(n.textContent.trim());
          }
        }
        return out;
      });
      expect(coupees, `ligne coupée par le fondu, ${ou}`).toEqual([]);
      // v7 tour 3 (faute 1) : sous la limite opaque du masque, chaque tuile visible de la rangée 2 se lit (étiquette et
      // titre) ; « Étape conseillée » montre sa barre ET « Étape n sur N » ensemble (plus de fragment seul) ; « Contenu du
      // jour » montre « Vanne du jour » en clair.
      const lisible = await extrait.locator("[data-apercu-suite]").evaluate((s) => {
        const m = /([\d.]+)px/.exec(getComputedStyle(s).maskImage || (getComputedStyle(s) as unknown as Record<string, string>).webkitMaskImage || "");
        const opaque = s.getBoundingClientRect().top + (m ? parseFloat(m[1]) : 0);
        const bas = (e: Element | null) => (e ? e.getBoundingClientRect().bottom : Infinity);
        const tuiles = Array.from(s.querySelectorAll("[data-tuile-fermee]")).filter((t) => t.getBoundingClientRect().top < s.getBoundingClientRect().bottom - 48);
        const etape = s.querySelector('[data-testid="parcours-tuile"]');
        const ligneEtape = etape ? Array.from(etape.querySelectorAll("span")).find((x) => /Étape \d+ sur \d+/.test(x.textContent ?? "")) ?? null : null;
        const jour = Array.from(s.querySelectorAll("[data-tuile-fermee] li"))[0] ?? null;
        return {
          opaque: m ? parseFloat(m[1]) : 0,
          tuiles: tuiles.length,
          titres: tuiles.every((t) => bas(t.querySelector("h2, .font-display")) <= opaque),
          barreEtLigne: bas(etape?.querySelector("[data-barre-etapes]") ?? null) <= opaque && bas(ligneEtape) <= opaque,
          vanneDuJour: jour === null || jour.getBoundingClientRect().top > s.getBoundingClientRect().bottom - 48 || bas(jour) <= opaque,
        };
      });
      expect(lisible.opaque, `fondu opaque en haut, ${ou}`).toBeGreaterThanOrEqual(96);
      expect(lisible.tuiles, `au moins une tuile de la rangée 2 visible, ${ou}`).toBeGreaterThanOrEqual(1);
      expect(lisible.titres, `titres de la rangée 2 en clair, ${ou}`).toBe(true);
      expect(lisible.barreEtLigne, `barre et « Étape n sur N » ensemble en clair, ${ou}`).toBe(true);
      expect(lisible.vanneDuJour, `« Vanne du jour » en clair, ${ou}`).toBe(true);
      // Faute 3 : bouton et pied figés, une seule atténuation, contraste composé sur le fond de la tuile.
      const contrastes = await extrait.locator("span[aria-disabled='true']").evaluateAll((els) => {
        const rgb = (t: string) => (t.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
        const lum = (c: number[]) => {
          const v = c.map((x) => (x / 255 <= 0.03928 ? x / 255 / 12.92 : ((x / 255 + 0.055) / 1.055) ** 2.4));
          return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
        };
        return els.map((el) => {
          let o = 1;
          for (let e: Element | null = el; e && !e.hasAttribute("data-tuile-fermee"); e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
          const fondCarte = getComputedStyle(el.closest("section") as Element).backgroundColor;
          const fond = /^rgba\(0, 0, 0, 0\)$/.test(fondCarte) ? [31, 31, 31] : rgb(fondCarte);
          const propre = getComputedStyle(el).backgroundColor;
          const bg = /^rgba\(0, 0, 0, 0\)$/.test(propre) ? fond : rgb(propre);
          const mix = (c: number[]) => c.map((x, i) => o * x + (1 - o) * fond[i]);
          const [a, b] = [lum(mix(rgb(getComputedStyle(el).color))), lum(mix(bg))].sort((x, y) => y - x);
          return { o, ratio: (a + 0.05) / (b + 0.05) };
        });
      });
      expect(contrastes.length, `éléments figés, ${ou}`).toBeGreaterThanOrEqual(2);
      for (const c of contrastes) {
        expect(c.o, `une seule atténuation (0,75), ${ou}`).toBeGreaterThanOrEqual(0.74);
        expect(c.ratio, `contraste figé, ${ou}`).toBeGreaterThanOrEqual(3.9);
      }
      for (const z of ["[data-action-du-jour]", "[data-cap-du-jour]"]) {
        expect((await extrait.locator(z).evaluate(vides)).bas, `${z} sans vide en bas, ${ou}`).toBeLessThanOrEqual(24);
      }
      // Piste : aucune pastille du hero seule sur sa ligne.
      const rangees = await page.locator("[data-apercu-pastilles] li").evaluateAll((lis) => {
        const hauts = lis.map((l) => Math.round(l.getBoundingClientRect().top));
        return [...new Set(hauts)].map((h) => hauts.filter((x) => x === h).length);
      });
      expect(Math.min(...rangees), `pastille orpheline, ${ou} (${rangees.join("+")})`).toBeGreaterThanOrEqual(2);
      expect(await extrait.evaluate((e) => e.hasAttribute("inert") && getComputedStyle(e).pointerEvents === "none"), `inerte, ${ou}`).toBe(true);
      const tuiles = extrait.locator("[data-tuile-fermee]");
      const n = await tuiles.count();
      expect(n).toBe(5);
      // Échelle s25 (arbitrage du 16/11) : un verrou seul (icône de 16 px, sans mot, gris secondaire) par bloc, aucune
      // pastille « Premium » dans l'extrait.
      for (let i = 0; i < n; i++) {
        const verrou = tuiles.nth(i).locator(":scope > [data-verrou-ferme]");
        await expect(verrou).toHaveCount(1);
        await expect(verrou).toHaveText("");
        expect(Math.round((await boite(verrou.locator("svg"))).largeur), `verrou de 16 px, ${ou}`).toBe(16);
        expect(await verrou.locator("svg").evaluate((e) => getComputedStyle(e).color), `verrou gris, ${ou}`).toBe("rgb(179, 179, 179)");
      }
      await expect(extrait.locator("[data-badge-premium]")).toHaveCount(0);
      // v7 tour 4 (piste 768) : l'offre à droite du texte (60/40), plus une barre pleine largeur.
      const [texteHero, offreHero] = [await boite(page.locator("[data-apercu-hero] > div").first()), await boite(page.locator("[data-apercu-offre]"))];
      if (largeur >= 768) {
        expect(offreHero.gauche, `offre à droite du texte, ${ou}`).toBeGreaterThan(texteHero.droite);
        expect(offreHero.haut, `offre sur la ligne du texte, ${ou}`).toBeLessThan(texteHero.bas);
        expect((await boite(offres.first())).largeur, `bouton d'offre de largeur raisonnable, ${ou}`).toBeLessThanOrEqual(400);
      }
      // v7 tour 4 (piste) : dès 1024, titre « Contenu du jour » de l'extrait à la hauteur de celui de « Étape conseillée ».
      if (largeur >= 1024) {
        const titres = extrait.locator("[data-apercu-suite] [data-tuile-fermee]");
        const [etapeTitre, jourTitre] = [await boite(titres.first().locator("h2")), await boite(titres.last().locator("p.font-display"))];
        expect(Math.abs(jourTitre.haut - etapeTitre.haut), `titres de la rangée 2 alignés, ${ou}`).toBeLessThanOrEqual(1);
      }
      expect(await debord(page), `débordement horizontal, ${ou}`).toBeLessThanOrEqual(0);
      await capturer(page, "visiteur-aujourdhui", largeur);
    }
    // Tabulation : bouton du hero, « Connexion », bouton de fin ; jamais un élément de l'extrait.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/mon-espace");
    await page.locator("[data-apercu-hero] h1").click();
    const vus: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      vus.push(await page.evaluate(() => (document.activeElement?.closest("[data-apercu-extrait] > [aria-hidden]") ? "EXTRAIT" : document.activeElement?.textContent ?? "")));
    }
    expect(vus).not.toContain("EXTRAIT");
    expect(vus).toContain(TEXTES_APERCU.connexion);
  });

  test("aperçu (visiteur) à 900 px de haut : un seul bouton d'offre plein au premier écran (1280, 1456, 1920)", async ({ page }) => {
    for (const largeur of [1280, 1456, 1920]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace");
      const offres = page.locator("[data-apercu-verrouille]").getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
      await expect(offres.first(), `bouton du hero au premier écran, ${largeur}`).toBeInViewport({ ratio: 1 });
      await expect(offres.nth(1), `bouton de fin sous le premier écran, ${largeur}`).not.toBeInViewport();
      expect((await boite(offres.nth(1))).haut, `bouton de fin sous 900 px, ${largeur}`).toBeGreaterThanOrEqual(900);
      // Échelle s25 : la phrase de fin aussi (un seul « Premium » écrit hors offre au premier écran).
      expect((await boite(page.locator("[data-apercu-fin] p"))).haut, `phrase de fin sous 900 px, ${largeur}`).toBeGreaterThan(900);
      // v7 tour 4 (faute 1) : plus de vide sous les pastilles ; bas du texte et bas de la carte d'offre à 24 px près.
      const [pastilles, offre] = [await boite(page.locator("[data-apercu-pastilles]")), await boite(page.locator("[data-apercu-offre]"))];
      expect(Math.abs(offre.bas - pastilles.bas), `bas du hero équilibrés, ${largeur}`).toBeLessThanOrEqual(24);
    }
  });

  test("abonné neuf : Z1 8/12 et « Ton cap » 4/12 sur une rangée dès 1024 px, rangées pleines, rien ne déborde", async ({ page }) => {
    const email = `e2e-auj-s25-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
    await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
    await connecter(page, email, MOT_DE_PASSE);
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace");
      const ou = `${largeur} px`;
      await expect(page.getByRole("link", { name: T.premierPas.bouton, exact: true })).toHaveCount(1);
      await expect(page.locator("[data-date-du-jour]")).toBeVisible();
      const grille = page.locator("[data-aujourdhui-grille]");
      const [g, action, cap] = [await boite(grille), await boite(page.locator("[data-carte-du-jour]")), await boite(page.locator('[data-zone="cap"]'))];
      if (largeur >= 1024) {
        expect(Math.abs(cap.haut - action.haut), `même rangée, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.abs(cap.hauteur - action.hauteur), `même hauteur, ${ou}`).toBeLessThanOrEqual(1);
        expect(action.largeur, `Z1 dominante, ${ou}`).toBeGreaterThan(cap.largeur * 1.8);
      } else {
        expect(cap.haut, `« Ton cap » sous l'action du jour, ${ou}`).toBeGreaterThan(action.bas);
        expect(Math.abs(action.largeur - g.largeur), `pleine largeur, ${ou}`).toBeLessThanOrEqual(1);
      }
      // Aucune rangée à moitié vide : chaque rangée occupe toute la largeur de la grille.
      const rangees = await grille.evaluate((el) => {
        const parHaut = new Map<number, { g: number; d: number }>();
        for (const c of Array.from(el.children)) {
          const r = c.getBoundingClientRect();
          const k = Math.round(r.top);
          const v = parHaut.get(k) ?? { g: r.left, d: r.right };
          parHaut.set(k, { g: Math.min(v.g, r.left), d: Math.max(v.d, r.right) });
        }
        const b = el.getBoundingClientRect();
        return Array.from(parHaut.values()).map((v) => Math.round(b.right - v.d + (v.g - b.left)));
      });
      for (const vide of rangees) expect(vide, `rangée pleine, ${ou}`).toBeLessThanOrEqual(1);
      // v7 tour 2 (fautes 1, 2, 5) : Z1 et Z2 sans vide en bas ; « Étape conseillée » pleine (barre et « Étape 1
      // sur N ») ; aucun creux dans la rangée 2 ; « Semaine n » en tête de chaque ligne de la feuille de route.
      for (const z of ["[data-carte-du-jour] > section", '[data-zone="cap"] > section']) {
        expect((await page.locator(z).evaluate(vides)).bas, `${z} sans vide en bas, ${ou}`).toBeLessThanOrEqual(24);
      }
      const tuileEtape = page.locator('[data-testid="parcours-tuile"]');
      await expect(tuileEtape.locator("[data-barre-etapes]")).toHaveCount(1);
      await expect(tuileEtape).toContainText(/Étape 1 sur \d+/);
      for (const z of ['[data-zone="parcours"] > *', '[data-zone="semaines"] > *']) {
        expect((await page.locator(z).evaluate(vides)).creux, `${z} sans creux, ${ou}`).toBeLessThanOrEqual(32);
      }
      const debuts = await page.locator("[data-semaines] li").evaluateAll((lis) => lis.map((l) => (l as HTMLElement).innerText.trim()));
      debuts.forEach((d, i) => expect(d, `ligne ${i + 1}, ${ou}`).toMatch(new RegExp(`^Semaine ${i + 1}\\s?:`)));
      // Faute 3 : cartes du contenu du jour sans creux dès 1280 (vidéo à droite sur deux rangées).
      const jour = page.locator("[data-contenu-du-jour]");
      await expect(jour).not.toHaveAttribute("data-etat", "chargement", { timeout: 10_000 });
      if (largeur >= 1280 && (await jour.locator(".aspect-video").count())) {
        for (const a of await jour.locator("article").all()) expect((await a.evaluate(vides)).creux, `carte du jour sans creux, ${ou}`).toBeLessThanOrEqual(32);
      }
      // v7 tour 3 (piste 768) : la vidéo du jour n'est plus une dalle pleine largeur. v7 tour 4 (faute 2) : ligne de
      // média, sans quart vide : en face de la vignette, le titre de la carte et celui de la vidéo, centrés en hauteur ;
      // au plus 32 px de vide au-dessus et au-dessous du texte quand le titre de la vidéo tient sur deux lignes ou plus
      // (sur une ligne, le texte reste centré, à 48 px au plus).
      if (largeur === 768 && (await jour.locator(".aspect-video").count())) {
        const article = page.locator("#jour-video").locator("xpath=ancestor::article");
        const [carte, vignette] = [await boite(article), await boite(jour.locator(".aspect-video"))];
        expect(carte.hauteur, `carte vidéo sans dalle, ${ou}`).toBeLessThanOrEqual(240);
        const texte = await article.evaluate((a) => {
          const rects: DOMRect[] = [];
          for (const n of [a.querySelector("h3"), a.querySelector('a[href^="/videos/"]')]) {
            if (!n) continue;
            const r = document.createRange();
            r.selectNodeContents(n);
            rects.push(...Array.from(r.getClientRects()));
          }
          const lien = a.querySelector('a[href^="/videos/"]');
          const r = document.createRange();
          if (lien) r.selectNodeContents(lien);
          return {
            gauche: Math.min(...rects.map((x) => x.left)),
            haut: Math.min(...rects.map((x) => x.top)),
            bas: Math.max(...rects.map((x) => x.bottom)),
            lignesLien: new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size,
          };
        });
        expect(texte.gauche, `texte en face de la vignette, ${ou}`).toBeGreaterThanOrEqual(vignette.droite + 16);
        const [dessus, dessous] = [texte.haut - vignette.haut, vignette.bas - texte.bas];
        expect(Math.min(dessus, dessous), `texte dans la hauteur de la vignette, ${ou}`).toBeGreaterThanOrEqual(0);
        expect(Math.abs(dessus - dessous), `texte centré sur la vignette, ${ou}`).toBeLessThanOrEqual(10);
        expect(Math.max(dessus, dessous), `vide au-dessus et au-dessous du texte, ${ou} (${texte.lignesLien} ligne(s))`).toBeLessThanOrEqual(texte.lignesLien >= 2 ? 32 : 48);
      }
      expect(await debord(page), `débordement horizontal, ${ou}`).toBeLessThanOrEqual(0);
      await capturer(page, "nouvel-aujourdhui-refonte", largeur);
    }
  });
});
