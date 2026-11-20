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
 * - abonné neuf : Z1 7/12 et « Ton cap » 5/12 (v7 tour 8) sur la même rangée dès 1024 px, une colonne dessous ; aucune rangée
 *   à moitié vide ; aucun débordement horizontal (halo compris) de 375 à 1920 ; v7 tour 2 (fautes 1, 2, 3, 5) : aucun
 *   creux de plus de 32 px dans « Étape conseillée », « Tes 4 premières semaines » et les cartes du contenu du jour,
 *   « Semaine n » en tête de ligne ; v7 tour 6 (placement) : Z1 et « Ton cap » calés en haut, aucun creux de plus de
 *   32 px entre deux éléments de la carte (le vide de fin de carte est permis) ;
 * - v7 tour 3 (fautes 1 à 3) : rangée 2 de l'extrait lisible avant le fondu (étiquette, titre, barre et « Étape n sur
 *   N » ensemble, « Vanne du jour » en clair), aucune ligne visible à cheval sur le point transparent ; à 900 px de
 *   haut (1280, 1456, 1920), le bouton d'offre de la fin d'extrait sous le premier écran ; éléments figés à 3,9:1 au
 *   moins ; à 768, la vidéo du jour n'est plus une dalle ;
 * - v7 tour 4 (fautes 1 et 2, pistes) : la fin d'extrait, phrase comprise, sous 900 px ; à 768, offre à droite du
 *   texte (60/40 ; s26 tour 2 des encarts : sous le texte, en ligne) ; v7 tour 6 (placement) : pastilles du hero à 24 px au plus sous la promesse à toutes les largeurs
 *   (plus calées sur le bas de l'offre : le vide passe sous elles) ; à 768, tuile « Vidéo du jour » en
 *   ligne de média, au plus 32 px de vide au-dessus et au-dessous du texte en face de la vignette (titre sur deux
 *   lignes) ; dès 1024, titre « Contenu du jour » de l'extrait à la hauteur de ceux de ses voisines ;
 * - v7 tour 10 (relecture design du tour 9) : légende en tête de l'extrait (une seule), au plus 64 px sous le hero à
 *   900 px de haut ; verrou de Z1 centré sur « 5 min » ; « Tes 4 premières semaines » en étiquette, aligné sur « Étape conseillée ».
 * - v7 tour 12 (relectures du tour 11) : la vraie vanne gratuite dans l'extrait dès 1024 (3 lignes au moins en clair) ;
 *   « Ton cap » sans chiffres à 768 : barre sur toute la largeur de la tuile, phrase de série dessous, verrou à 8 px au
 *   moins de tout texte ; Z1 du premier pas (aperçu et abonné neuf) dès 768 : scène réelle à gauche du bouton, 32 px
 *   entre eux, bouton au bord droit de la carte (plus de vide à sa droite) ; sous 768, scène masquée ; bouton éteint
 *   en gris secondaire.
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
  // v7 tour 13 : une réplique fermée de la vitrine est un objet dessiné (cadre, libellé, barres), comme une vignette.
  for (const e of Array.from(el.querySelectorAll("svg,[data-barre-etapes],[data-segments-cap],button,.aspect-video,li.rounded-md,span[aria-disabled],[data-replique-fermee]"))) {
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

/**
 * v7 tour 13 (relecture design du tour 12, critère 4 ; décision de Thomas du 16/11) : Z1 du premier pas du nouvel
 * abonné, une seule disposition : titre, scène réelle 8 px dessous (dès 768 ; masquée dessous), puis le bouton à
 * GAUCHE 16 px sous le texte, au bord gauche du contenu (plus de bouton à droite de la scène).
 */
async function verifierZ1(z1: Locator, largeur: number) {
  const ou = `${largeur} px`;
  const m = await z1.evaluate((z) => {
    const cs = getComputedStyle(z);
    const gauche = z.getBoundingClientRect().left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft);
    const h2 = z.querySelector("h2")!.getBoundingClientRect();
    const scene = z.querySelector("[data-premier-pas-scene]");
    const s = scene && getComputedStyle(scene).display !== "none" ? scene.getBoundingClientRect() : null;
    const b = (z.querySelector("a") as HTMLElement).getBoundingClientRect();
    return { gauche, h2: { bas: h2.bottom }, scene: s ? { haut: s.top, bas: s.bottom, gauche: s.left } : null, bouton: { gauche: b.left, haut: b.top } };
  });
  if (largeur >= 768) {
    expect(m.scene, `scène réelle sous le titre, ${ou}`).not.toBeNull();
    expect(Math.round((m.scene?.haut ?? 0) - m.h2.bas), `8 px entre titre et scène, ${ou}`).toBe(8);
    expect(Math.round(m.bouton.haut - (m.scene?.bas ?? 0)), `16 px entre scène et bouton, ${ou}`).toBe(16);
    expect(Math.abs((m.scene?.gauche ?? 0) - m.gauche), `scène au bord gauche, ${ou}`).toBeLessThanOrEqual(1);
  } else {
    expect(m.scene, `scène masquée sous 768, ${ou}`).toBeNull();
    expect(Math.round(m.bouton.haut - m.h2.bas), `16 px entre titre et bouton, ${ou}`).toBe(16);
  }
  expect(Math.abs(m.bouton.gauche - m.gauche), `bouton à gauche, au bord du contenu, ${ou}`).toBeLessThanOrEqual(1);
}

/**
 * v7 tour 13 (décision de Thomas du 16/11) : Z1 de l'extrait = vitrine des répliques. La situation une seule fois (le
 * titre, plus de scène), puis trois répliques fermées (libellé réel, verrou, deux barres), côte à côte dès 768 (même
 * haut, même largeur, 16 px entre elles), empilées dessous ; plus de bouton éteint ; aucun texte de réplique.
 */
async function verifierVitrine(z1: Locator, largeur: number) {
  const ou = `${largeur} px`;
  await expect(z1.locator("[data-premier-pas-scene]"), `plus de scène, ${ou}`).toHaveCount(0);
  await expect(z1.locator("a, span[aria-disabled]"), `plus de bouton éteint, ${ou}`).toHaveCount(0);
  const cartes = z1.locator("[data-replique-fermee]");
  await expect(cartes).toHaveCount(3);
  await expect(cartes.locator("p")).toHaveText(["La sûre", "La joueuse", "La risquée"]);
  const r = await cartes.evaluateAll((els) => els.map((e) => {
    const b = e.getBoundingClientRect();
    return { haut: Math.round(b.top), bas: Math.round(b.bottom), gauche: Math.round(b.left), droite: Math.round(b.right), largeur: Math.round(b.width), verrous: e.querySelectorAll("svg").length, barres: e.querySelectorAll("[data-barres-replique] > span").length, texte: (e.textContent ?? "").trim() };
  }));
  for (const c of r) {
    expect(c.verrous, `un verrou par réplique, ${ou}`).toBe(1);
    expect(c.barres, `deux barres par réplique, ${ou}`).toBe(2);
    expect(["La sûre", "La joueuse", "La risquée"], `seul le libellé s'écrit, ${ou}`).toContain(c.texte);
  }
  if (largeur >= 768) {
    expect(new Set(r.map((c) => c.haut)).size, `côte à côte dès 768, ${ou}`).toBe(1);
    expect(Math.max(...r.map((c) => c.largeur)) - Math.min(...r.map((c) => c.largeur)), `mêmes largeurs, ${ou}`).toBeLessThanOrEqual(1);
    expect(r[1].gauche - r[0].droite, `16 px entre deux répliques, ${ou}`).toBe(16);
  } else {
    expect(r[1].haut - r[0].bas, `empilées sous 768, 16 px entre elles, ${ou}`).toBe(16);
    expect(r[0].gauche, `empilées, même x, ${ou}`).toBe(r[1].gauche);
  }
}

/**
 * v7 tour 12 (relecture UX du tour 11, faute 1) : « Ton cap » sans chiffres à 768 : barre sur toute la largeur de la
 * tuile, phrase de série dessous, aucun creux vertical de plus de 32 px ; figé, le verrou à 8 px au moins de tout texte.
 */
async function verifierCap768(cap: Locator, fige: boolean) {
  const m = await cap.evaluate((c) => {
    const cs = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    const interieur = r.width - 2 * parseFloat(cs.borderLeftWidth) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const seg = c.querySelector("[data-segments-cap]")!.getBoundingClientRect();
    const serie = Array.from(c.querySelectorAll("p")).find((p) => p.querySelector("svg"))!.getBoundingClientRect();
    const verrou = c.parentElement?.querySelector(":scope > [data-verrou-ferme] svg")?.getBoundingClientRect() ?? null;
    let proche = Infinity;
    if (verrou) {
      const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.textContent?.trim() || n.parentElement?.closest(".sr-only")) continue;
        const g = document.createRange();
        g.selectNodeContents(n);
        for (const t of Array.from(g.getClientRects())) {
          proche = Math.min(proche, Math.max(t.top - verrou.bottom, verrou.top - t.bottom, verrou.left - t.right, t.left - verrou.right));
        }
      }
    }
    return { barre: seg.width, interieur, serieSousBarre: serie.top > seg.bottom, proche };
  });
  expect(Math.abs(m.barre - m.interieur), "barre sur toute la largeur de « Ton cap », 768").toBeLessThanOrEqual(1);
  expect(m.serieSousBarre, "phrase de série sous la barre, 768").toBe(true);
  expect((await cap.evaluate(vides)).creux, "« Ton cap » sans creux, 768").toBeLessThanOrEqual(32);
  if (fige) expect(m.proche, "verrou détaché du texte, 768").toBeGreaterThanOrEqual(8);
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
        // v7 tour 12 : la vraie vanne (bloc de 4 lignes au plus) ; ses 3 premières lignes en clair. Sans vanne, la 1re ligne.
        const jour = s.querySelector("[data-apercu-vanne]") ?? Array.from(s.querySelectorAll("[data-tuile-fermee] li"))[0] ?? null;
        return {
          opaque: m ? parseFloat(m[1]) : 0,
          tuiles: tuiles.length,
          // v7 tour 8 : « Contenu du jour » n'a plus de titre, son étiquette en tient lieu (premier texte de la tuile).
          titres: tuiles.every((t) => bas(t.querySelector("h2, .font-display") ?? t.querySelector(":scope > :not([data-verrou-ferme]) > :first-child")) <= opaque),
          barreEtLigne: bas(etape?.querySelector("[data-barre-etapes]") ?? null) <= opaque && bas(ligneEtape) <= opaque,
          vanneDuJour:
            jour === null || jour.getBoundingClientRect().top > s.getBoundingClientRect().bottom - 48 || Math.min(bas(jour), jour.getBoundingClientRect().top + 72) <= opaque,
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
      // v7 tour 13 : plus de bouton éteint dans Z1 (vitrine des répliques) ; le pied figé de l'étape reste.
      expect(contrastes.length, `éléments figés, ${ou}`).toBeGreaterThanOrEqual(1);
      for (const c of contrastes) {
        expect(c.o, `une seule atténuation (0,75), ${ou}`).toBeGreaterThanOrEqual(0.74);
        expect(c.ratio, `contraste figé, ${ou}`).toBeGreaterThanOrEqual(3.9);
      }
      // v7 tour 6 (placement) : contenu calé en haut, aucun vide de plus de 32 px entre deux éléments de la carte ; le
      // vide de fin de carte est permis (Z1 et « Ton cap » de même hauteur dès 1024).
      for (const z of ["[data-action-du-jour]", "[data-cap-du-jour]"]) {
        expect((await extrait.locator(z).evaluate(vides)).creux, `${z} sans creux, ${ou}`).toBeLessThanOrEqual(32);
      }
      // v7 tour 11 : sous 768, pastilles hors du rendu visuel (`sr-only`, toujours lues), preuve sous la promesse.
      if (largeur < 768) {
        expect(await page.locator("[data-apercu-pastilles]").evaluate((ul) => getComputedStyle(ul).position === "absolute" && ul.getBoundingClientRect().width <= 1), `pastilles en sr-only, ${ou}`).toBe(true);
        await expect(page.locator("[data-apercu-pastilles] li")).toHaveCount(6);
      } else {
      // v7 tour 6 (placement) : pastilles du hero juste sous la promesse (24 px au plus), jamais calées en bas.
      // s26 liste et détail, tour 1 : règle inchangée (le pilote les avait passées à 32 px dès 1024, `lg:mt-8` retiré).
      const sousPromesse = await page.locator("[data-apercu-pastilles]").evaluate((ul) => {
        const p = ul.previousElementSibling as Element;
        return ul.getBoundingClientRect().top - p.getBoundingClientRect().bottom;
      });
      expect(Math.round(sousPromesse), `pastilles sous la promesse, ${ou}`).toBeLessThanOrEqual(24);
      expect(Math.round(sousPromesse), `pastilles sous la promesse, ${ou}`).toBeGreaterThanOrEqual(8);
      // Piste : aucune pastille du hero seule sur sa ligne.
      const rangees = await page.locator("[data-apercu-pastilles] li").evaluateAll((lis) => {
        const hauts = lis.map((l) => Math.round(l.getBoundingClientRect().top));
        return [...new Set(hauts)].map((h) => hauts.filter((x) => x === h).length);
      });
      expect(Math.min(...rangees), `pastille orpheline, ${ou} (${rangees.join("+")})`).toBeGreaterThanOrEqual(2);
      }
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
      // v7 tour 10 (relecture design du tour 9 : verrou 3 px au-dessus de « 5 min ») : verrou de Z1 centré sur la ligne
      // de l'étiquette et de la durée, à 1 px près.
      const ligneZ1 = await tuiles.first().evaluate((t) => {
        const centre = (r: DOMRect) => (r.top + r.bottom) / 2;
        const ligne = t.querySelector("[data-action-du-jour] > div") as HTMLElement;
        return { verrou: centre(t.querySelector(":scope > [data-verrou-ferme] svg")!.getBoundingClientRect()), ligne: centre(ligne.getBoundingClientRect()) };
      });
      expect(Math.abs(ligneZ1.verrou - ligneZ1.ligne), `verrou centré sur « 5 min », ${ou}`).toBeLessThanOrEqual(1);
      // v7 tour 10 (faute 1 du tour 9) : la légende validée en tête de l'extrait, une seule fois : hero, légende,
      // tuiles, fin d'extrait, dans cet ordre à toutes les largeurs.
      const legende = page.locator("[data-apercu-legende]");
      await expect(page.getByText(TEXTES_APERCU.sousTitre.slice(0, 20))).toHaveCount(1);
      const [heroB, legB, tuilesB, finB] = [
        await boite(page.locator("[data-apercu-hero]")),
        await boite(legende),
        await boite(extrait),
        await boite(page.locator("[data-apercu-fin]")),
      ];
      expect(legB.haut, `légende sous le hero, ${ou}`).toBeGreaterThanOrEqual(heroB.bas);
      expect(tuilesB.haut, `tuiles sous la légende, ${ou}`).toBeGreaterThanOrEqual(legB.bas);
      expect(tuilesB.haut - legB.bas, `légende plus près des tuiles que du hero, ${ou}`).toBeLessThan(legB.haut - heroB.bas);
      expect(finB.haut, `fin sous les tuiles, ${ou}`).toBeGreaterThan(tuilesB.haut);
      // v7 tour 4 (piste 768) : l'offre à droite du texte (60/40), plus une barre pleine largeur. s26 tour 2 des encarts
      // (E2, relecture design du tour 1 : carte de 268 px et 122 px vides à 768) : de 768 à 1023, la carte passe en
      // pleine largeur SOUS le texte, contenu en ligne (bouton à gauche, réassurance à droite) ; 8/4 dès 1024.
      const [texteHero, offreHero] = [await boite(page.locator("[data-apercu-hero] > div").first()), await boite(page.locator("[data-apercu-offre]"))];
      if (largeur >= 1024) {
        expect(offreHero.gauche, `offre à droite du texte, ${ou}`).toBeGreaterThan(texteHero.droite);
        expect(offreHero.haut, `offre sur la ligne du texte, ${ou}`).toBeLessThan(texteHero.bas);
      } else if (largeur >= 768) {
        expect(offreHero.haut, `offre sous le texte, ${ou}`).toBeGreaterThanOrEqual(texteHero.bas);
        expect(Math.round(offreHero.largeur), `offre en pleine largeur, ${ou}`).toBe(Math.round(texteHero.largeur));
        const reassurance = await boite(page.locator("[data-apercu-offre] [data-reassurance]"));
        expect(reassurance.gauche, `réassurance à droite du bouton, ${ou}`).toBeGreaterThan((await boite(offres.first())).droite);
      }
      if (largeur >= 768) expect((await boite(offres.first())).largeur, `bouton d'offre de largeur raisonnable, ${ou}`).toBeLessThanOrEqual(400);
      // v7 tour 4 (piste), revu au tour 8 (35 px vides au-dessus du titre) : dès 1024, l'étiquette « Contenu du jour »
      // à la hauteur de « Étape conseillée », et sa première ligne à la hauteur du titre voisin, sans ligne vide.
      if (largeur >= 1024) {
        const tuiles = extrait.locator("[data-apercu-suite] [data-tuile-fermee]");
        const etape = tuiles.first().locator('[data-testid="parcours-tuile"]');
        const jour = tuiles.last().locator(":scope > :not([data-verrou-ferme])");
        const [etapeEtiquette, etapeTitre] = [await boite(etape.locator("> p").first()), await boite(etape.locator("h2"))];
        // v7 tour 12 : la vanne réelle (seed : catalogue non vide) remplace la liste des trois libellés.
        await expect(jour.locator("[data-apercu-vanne]"), `vraie vanne dans l'extrait, ${ou}`).toHaveCount(1);
        await expect(jour.locator("[data-apercu-vanne] p").first()).not.toBeEmpty();
        const [jourEtiquette, jourLigne] = [await boite(jour.locator("> p").first()), await boite(jour.locator("[data-apercu-vanne]"))];
        expect(Math.abs(jourEtiquette.haut - etapeEtiquette.haut), `étiquettes de la rangée 2 alignées, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.abs(jourLigne.haut - etapeTitre.haut), `première ligne de « Contenu du jour » sur la ligne des titres, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.round(jourEtiquette.haut - (await boite(jour)).haut), `aucun vide au-dessus de l'étiquette (bord et marge seulement), ${ou}`).toBeLessThanOrEqual(25);
      }
      // v7 tour 12 : Z1 (scène et bouton éteint) et « Ton cap » sans bandeau (s26 contrôle d'ensemble, aperçus : bandeau de l'accueil).
      await verifierVitrine(extrait.locator("[data-action-du-jour]"), largeur);
      if (largeur === 768) await verifierCap768(extrait.locator("[data-cap-du-jour]"), true);
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

  // v7 tour 13 (décision de Thomas du 16/11 : « un seul bouton de paiement en haut ») : sur l'aperçu à offre en haut, le
  // bouton d'offre de l'en-tête est masqué (visiteur et gratuit, 375 et 1280) ; ailleurs (accueil, vannes, autre
  // rubrique en aperçu), il reste.
  for (const compte of ["visiteur", "gratuit"] as const) {
    test(`${compte} : un seul bouton de paiement en haut de l'aperçu, celui de la page ; l'en-tête garde le sien ailleurs`, async ({ page }) => {
      if (compte === "gratuit") {
        const email = `e2e-auj-t13-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, "FREE");
        await connecter(page, email, MOT_DE_PASSE);
      }
      for (const [largeur, hauteur] of [[375, 812], [1280, 900]] as const) {
        await page.setViewportSize({ width: largeur, height: hauteur });
        await page.goto("/mon-espace");
        await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
        await expect(page.locator("[data-apercu-verrouille]")).toHaveCount(1);
        await expect(page.locator("header [data-en-tete-prix]"), `en-tête sans bouton d'offre, /mon-espace, ${largeur}`).toHaveCount(0);
        const offres = page.getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
        await expect(offres.first(), `bouton d'offre de la page au premier écran, ${largeur}`).toBeInViewport({ ratio: 1 });
        expect(await offres.evaluateAll((els) => els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && r.bottom > 0; }).length), `un seul bouton d'offre au premier écran, ${largeur}`).toBe(1);
        // s26 : « /mon-espace/quoi-repondre » remplacé par « /mon-espace/questions » : Quoi répondre est passé à l'aperçu à
        // offre en haut (`ADRESSES_OFFRE_EN_HAUT`), Mes questions restait sur l'ancien aperçu (même bascule que le Jest
        // `aujourdhui-v7-tour13`) jusqu'à son passage s26 (voir plus bas). Les trois rubriques s26 sont contrôlées comme « /mon-espace » juste au-dessus.
        // s26 (`docs/ux/favoris-carnet-s26.md` §1.2 et §2.2) : l'aperçu de Favoris et le carnet du non-abonné aussi.
        // s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.1 et §2.1) : Mes questions et Mes répliques aussi.
        for (const s26 of ["/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/favoris", "/carnet", "/mon-espace/questions", "/mon-espace/repliques"]) {
          await page.goto(s26);
          await expect(page.locator("header [data-en-tete-prix]"), `en-tête sans bouton d'offre, ${s26}, ${largeur}`).toHaveCount(0);
          await expect(page.getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible }).first(), `bouton d'offre de la page, ${s26}, ${largeur}`).toBeInViewport({ ratio: 1 });
        }
        // s26 : « /mon-espace/questions » passé offre en haut (`ADRESSES_OFFRE_EN_HAUT`, plus aucune rubrique sur l'ancien
        // aperçu) ; adresse témoin remplacée par « /parcours », hors de la liste (l'en-tête garde son bouton d'offre).
        // « /lettre » rejoint aussi la liste (inscription, un seul aplat) : en-tête sans bouton d'offre, contrôlé ici.
        await page.goto("/lettre");
        await expect(page.locator("header [data-en-tete-prix]"), `en-tête sans bouton d'offre, /lettre, ${largeur}`).toHaveCount(0);
        for (const ailleurs of ["/", "/vannes", "/parcours"]) {
          await page.goto(ailleurs);
          await expect(page.locator("header [data-en-tete-prix]"), `en-tête avec bouton d'offre, ${ailleurs}, ${largeur}`).toHaveCount(1);
        }
      }
    });
  }

  test("aperçu (visiteur) à 900 px de haut : un seul bouton d'offre plein au premier écran (1280, 1456, 1920)", async ({ page }) => {
    for (const largeur of [1280, 1456, 1920]) {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/mon-espace");
      const offres = page.locator("[data-apercu-verrouille]").getByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
      await expect(offres.first(), `bouton du hero au premier écran, ${largeur}`).toBeInViewport({ ratio: 1 });
      await expect(offres.nth(1), `bouton de fin sous le premier écran, ${largeur}`).not.toBeInViewport();
      expect((await boite(offres.nth(1))).haut, `bouton de fin sous 900 px, ${largeur}`).toBeGreaterThanOrEqual(900);
      // Échelle s25 : la phrase de fin aussi (un seul « Premium » écrit hors offre au premier écran).
      // s26, encarts Premium, Thomas 18/11 : la carte de fin porte aussi la réassurance (2e paragraphe) ; la phrase est
      // le premier.
      expect((await boite(page.locator("[data-apercu-fin] p:not([data-reassurance])"))).haut, `phrase de fin sous 900 px, ${largeur}`).toBeGreaterThan(900);
      // s26, Thomas 18/11 : une seule grille 8/4 pour le hero et l'extrait. « Ton cap » a les bords de la carte d'offre,
      // Z1 ceux du texte du hero ; en rangée 2 (4/4/4), la dernière tuile a aussi ceux de la carte d'offre.
      const grille = await page.evaluate(() => {
        const bords = (e: Element) => { const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; };
        const [texte] = Array.from(document.querySelectorAll("[data-apercu-hero] > *"));
        const [gauche, droite] = Array.from(document.querySelectorAll("[data-apercu-rangee='1'] > *"));
        const r2 = Array.from(document.querySelectorAll("[data-apercu-rangee='2'] > *"));
        return { texte: bords(texte), offre: bords(document.querySelector("[data-apercu-offre]")!), gauche: bords(gauche), droite: bords(droite), fin2: bords(r2[r2.length - 1]) };
      });
      expect(grille.droite, `« Ton cap » sous la carte d'offre, ${largeur}`).toEqual(grille.offre);
      expect(grille.gauche, `Z1 sous le texte du hero, ${largeur}`).toEqual(grille.texte);
      expect(grille.fin2, `dernière tuile de la rangée 2 sous la carte d'offre, ${largeur}`).toEqual(grille.offre);
      // v7 tour 10 (faute 1 du tour 9, bande vide de 128 px) : au plus 64 px entre le bas du hero et la légende.
      const [heroBas, legHaut] = [(await boite(page.locator("[data-apercu-hero]"))).bas, (await boite(page.locator("[data-apercu-legende]"))).haut];
      expect(Math.round(legHaut - heroBas), `air entre le hero et la légende, ${largeur}`).toBeLessThanOrEqual(64);
      // v7 tour 13 (décision de Thomas du 16/11 : 83 px au tour 12) : 48 px au plus entre la carte d'offre et la légende.
      expect(Math.round(legHaut - (await boite(page.locator("[data-apercu-offre]"))).bas), `air entre l'offre et la légende, ${largeur}`).toBeLessThanOrEqual(48);
      // v7 tour 6 (placement, remplace « bas du hero équilibrés » du tour 4) : pastilles à 24 px au plus sous la
      // promesse ; le vide restant passe sous elles, en bas de colonne (jamais au-dessus de la carte d'offre).
      const [promesse, pastilles, offre] = [
        // v7 tour 8 : pastille et H1 dans une tête commune (`data-apercu-tete`), la promesse la suit.
        await boite(page.locator("[data-apercu-hero] [data-apercu-tete] ~ p:not(.sr-only):not([data-preuve])")),
        await boite(page.locator("[data-apercu-pastilles]")),
        await boite(page.locator("[data-apercu-offre]")),
      ];
      expect(Math.round(pastilles.haut - promesse.bas), `pastilles à 24 px au plus sous la promesse, ${largeur}`).toBeLessThanOrEqual(24);
      expect(pastilles.bas, `pastilles au-dessus du bas de l'offre, ${largeur}`).toBeLessThanOrEqual(offre.bas);
      // s26 liste et détail, tour 1 : « 1 500+ » est retiré des aperçus de l'espace (spec design §5, interrupteur ouvert ;
      // l'accueil et /abonnement gardent le leur). Les mesures de la preuve des tours 9 à 11 (24 px sous les pastilles,
      // bas à 24 px près) n'ont plus d'objet : aucune preuve dans l'aperçu, et le bas du texte (les pastilles) et celui de
      // la carte d'offre à 32 px près (spec design §8 #11).
      await expect(page.locator("[data-apercu-verrouille] [data-preuve]"), `aucune preuve dans l'aperçu, ${largeur}`).toHaveCount(0);
      expect(Math.abs(Math.round(pastilles.bas - offre.bas)), `bas du texte et de l'offre à 32 px près, ${largeur}`).toBeLessThanOrEqual(32);
    }
    // s26 liste et détail, tour 1 : à 768 et 375 non plus, aucune preuve dans l'aperçu (ni dans la carte, ni sous le texte).
    for (const [largeur, hauteur] of [[768, 900], [375, 812]] as const) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      await page.goto("/mon-espace");
      await expect(page.locator("[data-apercu-verrouille] [data-preuve]"), `aucune preuve dans l'aperçu, ${largeur}`).toHaveCount(0);
    }
  });

  test("abonné neuf : Z1 7/12 et « Ton cap » 5/12 sur une rangée dès 1024 px, rangées pleines, rien ne déborde", async ({ page }) => {
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
        // v7 tour 8 (point 2) : 7/12 contre 5/12 (rapport 1,4 en tenant compte des gouttières), Z1 toujours la plus large.
        expect(action.largeur, `Z1 dominante, ${ou}`).toBeGreaterThan(cap.largeur * 1.3);
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
      // v7 tour 6 (placement, remplace « Z1 et Z2 sans vide en bas » du tour 2) : Z1 et « Ton cap » calés en haut,
      // aucun creux de plus de 32 px entre deux éléments, vide de fin de carte permis. v7 tour 2 (fautes 2, 5) : « Étape
      // conseillée » pleine (barre et « Étape 1 sur N ») ; aucun creux dans la rangée 2 ; « Semaine n » en tête de ligne.
      for (const z of ["[data-carte-du-jour] > section", '[data-zone="cap"] > section']) {
        expect((await page.locator(z).evaluate(vides)).creux, `${z} sans creux, ${ou}`).toBeLessThanOrEqual(32);
      }
      const tuileEtape = page.locator('[data-testid="parcours-tuile"]');
      await expect(tuileEtape.locator("[data-barre-etapes]")).toHaveCount(1);
      await expect(tuileEtape).toContainText(/Étape 1 sur \d+/);
      for (const z of ['[data-zone="parcours"] > *', '[data-zone="semaines"] > *']) {
        expect((await page.locator(z).evaluate(vides)).creux, `${z} sans creux, ${ou}`).toBeLessThanOrEqual(32);
      }
      // v7 tour 10 (relecture design du tour 9 : titre 27 px plus haut) : dès 1024, côte à côte, « Tes 4 premières
      // semaines » en étiquette sur la ligne d'« Étape conseillée », la première semaine sur celle de « Répartie » (1 px).
      if (largeur >= 1024) {
        const [etiq, titre, etiqS, semaine1] = [
          await boite(tuileEtape.locator(":scope > p").first()),
          await boite(tuileEtape.locator("h2")),
          await boite(page.locator("[data-semaines] h2")),
          await boite(page.locator("[data-semaines] li").first()),
        ];
        expect(Math.abs(etiqS.haut - etiq.haut) + Math.abs(etiqS.hauteur - etiq.hauteur), `étiquettes alignées, ${ou}`).toBeLessThanOrEqual(1);
        expect(Math.abs(semaine1.haut - titre.haut), `première semaine sur la ligne du titre voisin, ${ou}`).toBeLessThanOrEqual(1);
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
      // v7 tour 12 : Z1 (scène réelle, bouton plein au bord droit) et « Ton cap » sans bandeau à 768.
      await verifierZ1(page.locator("[data-carte-du-jour] [data-action-du-jour]"), largeur);
      if (largeur === 768) await verifierCap768(page.locator("[data-cap-du-jour]"), false);
      expect(await debord(page), `débordement horizontal, ${ou}`).toBeLessThanOrEqual(0);
      await capturer(page, "nouvel-aujourdhui-refonte", largeur);
    }
  });
});
