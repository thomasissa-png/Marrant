import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";

/**
 * Gate typographique MESURÉE d'« Aujourd'hui » (s25, `docs/design/typo-harmonie-espace-s25.md` §4, brief de relecture
 * v7 ; retour de Thomas du 16/11 : « combien de polices de tailles différentes ? »). Reprend la logique du script de
 * mesure `tailles.mjs` : dans `main`, au PREMIER ÉCRAN (375 x 812 et 1280 x 900), tout élément qui porte un nœud texte
 * non vide (lecteur d'écran et extrait inerte compris : on contrôle le visuel), regroupé par taille, graisse et casse.
 * Pour les 4 comptes (visiteur, inscrit gratuit, abonné avancé, nouvel abonné), interrupteur OUVERT seulement :
 * - au plus 4 tailles, toutes dans l'échelle (14, 16, 20, et 24 à 375 ou 30 à 1280) ; au plus 6 combinaisons ;
 * - aucune capitale (`text-transform: uppercase`) ; graisses 400 et 600 seulement ;
 * - un seul élément à fond violet plein (le bouton de l'écran) ; aucun texte violet ;
 * - v7 tour 7 (décision de Thomas du 16/11) : aucun fond ni bord violet au premier écran hors du bouton plein, tout
 *   compris (dégradé, filet en pseudo-élément `::before`/`::after`, bordure, quelle que soit l'opacité) ;
 * - v7 tour 8 (décision de l'orchestrateur : un point focal) : un seul APLAT violet au premier écran (le bouton plein) ;
 *   la carte Z1 (`[data-action-du-jour]`, qui contient ce bouton chez l'abonné) peut seule porter un bord ou une teinte
 *   violette, légère (opacité au plus 0,4) ; aucun autre élément ; et dans Z1, tout texte posé sur la teinte (figé
 *   dans l'extrait compris, opacités cumulées) tient 4,5:1 au pire point du dégradé ;
 * - v7 tour 9 (faute dure design du tour 8) : aperçu (visiteur et gratuit), la carte Z1 de l'extrait est NEUTRE (ni
 *   bord ni teinte violette, `TUILE`) : AUCUN bord, fond ni filet violet dans tout l'extrait (premier écran ou non), et
 *   le seul aplat violet du premier écran est le bouton d'offre du hero (`[data-position="haut"]`) ;
 * - v7 tour 13 (décision de Thomas du 16/11) : le H1 de l'aperçu portait le TEXTE en dégradé de l'accueil ; s26, Thomas
 *   18/11 : il est en BLANC (#FFFFFF) comme chez l'abonné, aucun texte dégradé nulle part ; un seul aplat violet, le
 *   bouton d'offre ;
 * - s26, encarts Premium, Thomas 18/11 (`docs/design/encarts-premium-s26.md`) : l'objet Premium est autorisé, et lui
 *   seul : la carte d'offre (`[data-apercu-offre]`) et la carte de fin (`[data-apercu-fin]`) par leur bord violet de
 *   2 px sur les quatre côtés (sans fond violet), et leur halo (`> [data-halo-premium]`, `aria-hidden`, flouté, fond
 *   violet à 10 % au plus, sans bord) ; tout autre bord, fond ou filet violet reste refusé ;
 * - s26, Thomas 19/11 : sur une fenêtre d'au moins 1000 px de haut, le bouton de la carte de fin est en CONTOUR (bord
 *   violet de 1 px, fond transparent) et compte dans l'objet Premium ; contrôle dédié à 1920 x 1200 sur les 6 aperçus
 *   (un seul fond violet plein au premier écran, le bouton d'offre du hero) ;
 * - aperçu : le mot « Premium » au plus deux fois en repère visible (pastille du hero et bouton d'offre ; les phrases
 *   de la carte d'offre, réassurance et phrase d'objet, sont des textes validés, hors repère).
 */
const MOT_DE_PASSE = "E2e-typo-s25!";
const VUES = [
  { largeur: 375, hauteur: 812, titre: 24 },
  { largeur: 1280, hauteur: 900, titre: 30 },
] as const;
/** Violets du thème (accent primaire, lien, plein et plein survolé), en `rgb()` calculé. */
const VIOLETS = ["139, 92, 246", "167, 139, 250", "124, 58, 237", "109, 40, 217"];

type Mesure = {
  combinaisons: { cle: string; taille: number; graisse: string; casse: string; textes: string[] }[];
  pleinsViolets: string[];
  accentsViolets: string[];
  accentZ1: { cadre: number; alphaMax: number };
  contrasteZ1: { min: number; texte: string } | null;
  textesViolets: string[];
  premium: string[];
  /** Aplats violets du premier écran qui sont le bouton d'offre du hero (`[data-position="haut"]`). */
  pleinsOffre: number;
  /** Tout l'extrait de l'aperçu, sans limite d'écran : éléments à bord, fond ou filet violet (bouton de fin et objet Premium exclus). */
  violetsExtrait: string[];
  /** Titres en TEXTE dégradé (fond découpé au texte) : aucun depuis s26 (Thomas 18/11, H1 de l'aperçu en blanc). */
  titresDegrades: string[];
  /** s26, Thomas 18/11 : couleur calculée du H1 de l'aperçu (`#apercu-titre`), null hors aperçu. */
  couleurTitreApercu: string | null;
};

async function mesurer(page: Page, hauteur: number): Promise<Mesure> {
  return page.evaluate(
    ({ hauteur, violets }) => {
      const main = document.querySelector("main") ?? document.body;
      const groupes = new Map<string, { cle: string; taille: number; graisse: string; casse: string; textes: string[] }>();
      const textesViolets: string[] = [];
      const pleinsViolets: string[] = [];
      const accentsViolets: string[] = [];
      const premium: string[] = [];
      const titresDegrades: string[] = [];
      const z1 = main.querySelector("[data-action-du-jour]");
      const accentZ1 = { cadre: 0, alphaMax: 0 };
      let pleinsOffre = 0;
      const couleurs = (s: string) =>
        Array.from(s.matchAll(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/g)).map((m) => ({
          rgb: [Number(m[1]), Number(m[2]), Number(m[3])],
          alpha: m[4] === undefined ? 1 : parseFloat(m[4]),
          teinte: violets.includes(`${m[1]}, ${m[2]}, ${m[3]}`),
        }));
      const contientViolet = (s: string) => violets.some((v) => s.includes(v));
      const violet = (c: string) => {
        const m = /rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/.exec(c);
        return m ? { teinte: violets.includes(`${m[1]}, ${m[2]}, ${m[3]}`), alpha: m[4] === undefined ? 1 : parseFloat(m[4]) } : { teinte: false, alpha: 0 };
      };
      // s26, encarts Premium, Thomas 18/11 : EXACTEMENT l'objet Premium (bord 2 px des deux cartes, halo flouté
      // qui est leur enfant direct), rien d'autre.
      const objetPremium = (el: Element) => {
        const cs = getComputedStyle(el);
        const cotes = ["top", "right", "bottom", "left"];
        if (el.matches("[data-apercu-offre], [data-apercu-fin]")) {
          return (
            cotes.every((c) => cs.getPropertyValue(`border-${c}-width`) === "2px" && contientViolet(cs.getPropertyValue(`border-${c}-color`))) &&
            !contientViolet(cs.backgroundColor) &&
            !contientViolet(cs.backgroundImage)
          );
        }
        // s26, Thomas 19/11 : sur une fenêtre d'au moins 1000 px de haut, le bouton de la carte de fin passe en CONTOUR
        // (bord violet de 1 px sur les quatre côtés, fond transparent) ; sous 1000 px, il reste plein (compté en aplat).
        if (el.matches("[data-apercu-fin] a[data-position='fin'], [data-carnet-fin] a[data-testid='carnet-paywall-bouton']")) {
          return (
            window.innerHeight >= 960 &&
            cotes.every((c) => cs.getPropertyValue(`border-${c}-width`) === "1px" && contientViolet(cs.getPropertyValue(`border-${c}-color`))) &&
            cs.backgroundColor === "rgba(0, 0, 0, 0)" &&
            cs.backgroundImage === "none"
          );
        }
        if (el.matches("[data-apercu-offre] > [data-halo-premium], [data-apercu-fin] > [data-halo-premium]")) {
          const fond = violet(cs.backgroundColor);
          return (
            el.getAttribute("aria-hidden") === "true" &&
            fond.teinte &&
            fond.alpha <= 0.1 &&
            cs.filter.startsWith("blur(") &&
            cs.backgroundImage === "none" &&
            cotes.every((c) => parseFloat(cs.getPropertyValue(`border-${c}-width`)) === 0)
          );
        }
        return false;
      };
      for (const el of Array.from(main.querySelectorAll("*"))) {
        const r = el.getBoundingClientRect();
        const dansEcran = r.top <= hauteur && r.bottom >= 0 && r.width > 0;
        if (!dansEcran) continue;
        const cs = getComputedStyle(el);
        const fond = violet(cs.backgroundColor);
        if (fond.teinte && fond.alpha >= 0.5) {
          pleinsViolets.push((el.textContent ?? "").trim().slice(0, 40) || el.tagName);
          if (el.matches("[data-apercu-offre] a[data-position='haut']")) pleinsOffre += 1;
        }
        // Accent violet, quel qu'il soit : fond (couleur ou dégradé), bord dessiné, ou pseudo-élément rendu (filet).
        const bordViolet = ["Top", "Right", "Bottom", "Left"].some(
          (c) => parseFloat(cs.getPropertyValue(`border-${c.toLowerCase()}-width`)) > 0 && contientViolet(cs.getPropertyValue(`border-${c.toLowerCase()}-color`)),
        );
        const fondViolet = contientViolet(cs.backgroundColor) || contientViolet(cs.backgroundImage);
        const pseudoViolet = ["::before", "::after"].some((ps) => {
          const s = getComputedStyle(el, ps);
          return s.content !== "none" && (contientViolet(s.backgroundColor) || contientViolet(s.backgroundImage));
        });
        // v7 tour 13 : un H1 en texte dégradé (fond découpé au texte) est relevé à part. s26, Thomas 18/11 : il n'y en a
        // plus (H1 de l'aperçu en blanc) ; le relevé reste pour le prouver.
        const clip = cs.backgroundClip || cs.getPropertyValue("-webkit-background-clip");
        if (el.matches("h1") && clip === "text" && !bordViolet && !pseudoViolet && !contientViolet(cs.backgroundColor)) {
          titresDegrades.push(`${(el.textContent ?? "").trim().slice(0, 30)} | ${cs.color}`);
        } else if (z1 && el === z1 && (bordViolet || fondViolet) && !pseudoViolet && !(fond.teinte && fond.alpha >= 0.5)) {
          accentZ1.cadre += 1;
          const alphas = [cs.backgroundImage, cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor, cs.backgroundColor]
            .flatMap(couleurs)
            .filter((c) => c.teinte)
            .map((c) => c.alpha);
          accentZ1.alphaMax = Math.max(accentZ1.alphaMax, ...alphas);
        } else if (
          (bordViolet || fondViolet || pseudoViolet) &&
          !(fond.teinte && fond.alpha >= 0.5) &&
          (pseudoViolet || !objetPremium(el)) &&
          // s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11, qui prime sur « un seul violet ») : le
          // bandeau des cartes et les pastilles violettes de l'accueil sont la DA, pas un accent en trop.
          !el.matches("[data-bandeau-da]") &&
          !el.closest("[data-pastilles-da]")
        ) {
          accentsViolets.push(`${el.tagName.toLowerCase()} « ${(el.textContent ?? "").trim().slice(0, 30)} »${pseudoViolet ? " (pseudo-élément)" : ""}`);
        }
        const texte = Array.from(el.childNodes)
          .filter((n) => n.nodeType === 3 && n.textContent?.trim())
          .map((n) => n.textContent?.trim() ?? "")
          .join(" ");
        if (!texte) continue;
        // s26 DA, aujourd'hui questions répliques : l'émoji de l'accueil (décoratif, `aria-hidden`) est une icône, pas
        // une taille de texte de l'échelle.
        if (el.matches("[data-pastilles-da] > [aria-hidden='true']")) continue;
        const taille = parseFloat(cs.fontSize);
        const cle = `${taille}/${cs.fontWeight}/${cs.textTransform}`;
        const g = groupes.get(cle) ?? { cle, taille, graisse: cs.fontWeight, casse: cs.textTransform, textes: [] };
        g.textes.push(texte.slice(0, 30));
        groupes.set(cle, g);
        // s26 DA, aujourd'hui questions répliques : texte violet des pastilles de l'accueil, permis (DA du 20/11).
        if (violet(cs.color).teinte && !el.closest("[data-pastilles-da]")) textesViolets.push(texte.slice(0, 30));
        // Repère « Premium » visible : élément dessiné (pas `sr-only`, 1 px), hors phrases de la carte d'offre. v7 tour 10
        // (relecture design du tour 9) : la légende validée monte en tête de l'extrait, au premier écran ; c'est une
        // phrase d'appoint (`META`), pas un repère : hors compte, comme les phrases de la carte d'offre.
        const visible = r.width > 1 && r.height > 1 && cs.visibility !== "hidden";
        if (visible && /Premium/.test(texte) && !el.closest("[data-apercu-offre] p, [data-apercu-legende]")) premium.push(texte.slice(0, 30));
      }
      // v7 tour 9 : tout l'extrait de l'aperçu (hors écran compris), seul le bouton d'offre de fin peut être violet.
      const violetsExtrait: string[] = [];
      for (const el of Array.from(main.querySelectorAll("[data-apercu-extrait] *"))) {
        if (el.matches("a[data-position='fin']")) continue;
        // s26 contrôle d'ensemble, aperçus (DA de l'accueil, Thomas 20/11) : bandeau et pastilles violettes des tuiles.
        if (el.matches("[data-bandeau-da], .bg-accent-primary\\/20") || el.closest("[data-pastilles-da]")) continue;
        const cs = getComputedStyle(el);
        const bord = ["top", "right", "bottom", "left"].some(
          (c) => parseFloat(cs.getPropertyValue(`border-${c}-width`)) > 0 && contientViolet(cs.getPropertyValue(`border-${c}-color`)),
        );
        const fondV = contientViolet(cs.backgroundColor) || contientViolet(cs.backgroundImage);
        const pseudo = ["::before", "::after"].some((ps) => {
          const s = getComputedStyle(el, ps);
          return s.content !== "none" && (contientViolet(s.backgroundColor) || contientViolet(s.backgroundImage));
        });
        if ((bord || fondV || pseudo) && (pseudo || !objetPremium(el))) violetsExtrait.push(`${el.tagName.toLowerCase()} « ${(el.textContent ?? "").trim().slice(0, 30)} »`);
      }
      // Contraste dans Z1 au pire point de la teinte : fond de la carte + premier arrêt violet du dégradé (le plus
      // opaque, coin haut gauche), texte composé avec son alpha et les opacités cumulées jusqu'à la carte (0,75 de
      // l'extrait figé). Les textes posés sur un fond propre (bouton plein, lignes de la rafale) sont hors de ce calcul.
      let contrasteZ1: { min: number; texte: string } | null = null;
      if (z1) {
        const csZ1 = getComputedStyle(z1);
        const base = couleurs(csZ1.backgroundColor)[0] ?? { rgb: [0, 0, 0], alpha: 1 };
        const arret = couleurs(csZ1.backgroundImage).filter((c) => c.teinte).sort((a, b) => b.alpha - a.alpha)[0];
        const melange = (dessus: number[], a: number, dessous: number[]) => dessus.map((v, i) => v * a + dessous[i] * (1 - a));
        const fondPire = arret ? melange(arret.rgb, arret.alpha, base.rgb) : base.rgb;
        const lum = (rgb: number[]) => {
          const [r, g, b] = rgb.map((v) => {
            const c = v / 255;
            return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        for (const el of Array.from(z1.querySelectorAll("*"))) {
          const r = el.getBoundingClientRect();
          if (!(r.top <= hauteur && r.bottom >= 0 && r.width > 1 && r.height > 1)) continue;
          const texte = Array.from(el.childNodes)
            .filter((n) => n.nodeType === 3 && n.textContent?.trim())
            .map((n) => n.textContent?.trim() ?? "")
            .join(" ");
          if (!texte) continue;
          let opacite = 1;
          let fondPropre = false;
          for (let a: Element | null = el; a && a !== z1; a = a.parentElement) {
            const ca = getComputedStyle(a);
            opacite *= parseFloat(ca.opacity);
            if ((couleurs(ca.backgroundColor)[0]?.alpha ?? 0) > 0 || ca.backgroundImage !== "none") fondPropre = true;
          }
          if (fondPropre) continue;
          const c = couleurs(getComputedStyle(el).color)[0];
          if (!c) continue;
          const vu = melange(c.rgb, c.alpha * opacite, fondPire);
          const [l1, l2] = [lum(vu), lum(fondPire)].sort((a, b) => b - a);
          const ratio = (l1 + 0.05) / (l2 + 0.05);
          if (!contrasteZ1 || ratio < contrasteZ1.min) contrasteZ1 = { min: Math.round(ratio * 100) / 100, texte: texte.slice(0, 30) };
        }
      }
      return {
        combinaisons: [...groupes.values()].sort((a, b) => b.taille - a.taille),
        pleinsViolets,
        accentsViolets,
        accentZ1,
        contrasteZ1,
        textesViolets,
        premium,
        pleinsOffre,
        violetsExtrait,
        titresDegrades,
        couleurTitreApercu: (() => {
          const h1 = main.querySelector("#apercu-titre");
          return h1 ? getComputedStyle(h1).color : null;
        })(),
      };
    },
    { hauteur, violets: VIOLETS },
  );
}

function controler(m: Mesure, ou: string, titre: number, apercu: boolean) {
  const resume = m.combinaisons.map((c) => `${c.cle} (${c.textes.slice(0, 2).join(" / ")})`).join(" ; ");
  const tailles = [...new Set(m.combinaisons.map((c) => c.taille))];
  expect(tailles.length, `tailles distinctes, ${ou} : ${resume}`).toBeLessThanOrEqual(4);
  for (const t of tailles) expect([14, 16, 20, titre], `taille hors échelle ${t} px, ${ou} : ${resume}`).toContain(t);
  expect(m.combinaisons.length, `combinaisons taille/graisse/casse, ${ou} : ${resume}`).toBeLessThanOrEqual(6);
  for (const c of m.combinaisons) {
    expect(c.casse, `capitales, ${ou} : ${c.textes.join(" / ")}`).not.toBe("uppercase");
    expect(["400", "600"], `graisse ${c.graisse}, ${ou} : ${c.textes.join(" / ")}`).toContain(c.graisse);
  }
  expect(m.pleinsViolets.length, `fonds violets pleins, ${ou} : ${m.pleinsViolets.join(" / ")}`).toBe(1);
  expect(m.accentsViolets, `fond ou bord violet hors du bouton plein et de la carte Z1, ${ou}`).toEqual([]);
  expect(m.accentZ1.cadre, `carte Z1 à bord ou teinte violette, ${ou}`).toBeLessThanOrEqual(1);
  expect(m.accentZ1.alphaMax, `teinte de Z1 légère (opacité du violet), ${ou}`).toBeLessThanOrEqual(0.4);
  expect(m.contrasteZ1, `Z1 au premier écran, ${ou}`).not.toBeNull();
  expect(m.contrasteZ1?.min ?? 0, `contraste du texte de Z1 au pire point de la teinte, ${ou} : « ${m.contrasteZ1?.texte} »`).toBeGreaterThanOrEqual(4.5);
  expect(m.textesViolets, `texte violet, ${ou}`).toEqual([]);
  if (apercu) {
    expect(m.accentZ1.cadre, `carte Z1 de l'extrait sans bord ni teinte violette, ${ou}`).toBe(0);
    expect(m.violetsExtrait, `bord, fond ou filet violet dans l'extrait, ${ou}`).toEqual([]);
    expect(m.pleinsOffre, `le seul aplat violet du premier écran est le bouton d'offre, ${ou}`).toBe(1);
    // s26, Thomas 18/11 : le H1 de l'aperçu en BLANC (#FFFFFF) comme chez l'abonné, plus de texte dégradé.
    expect(m.couleurTitreApercu, `H1 de l'aperçu en blanc #FFFFFF, ${ou}`).toBe("rgb(255, 255, 255)");
    expect(m.titresDegrades, `aucun texte dégradé dans l'aperçu, ${ou}`).toEqual([]);
  } else {
    expect(m.titresDegrades, `aucun texte dégradé chez l'abonné, ${ou}`).toEqual([]);
  }
  if (apercu) expect(m.premium.length, `repère « Premium » écrit, ${ou} : ${m.premium.join(" / ")}`).toBeLessThanOrEqual(2);
}

/** Abonné avancé : premier pas fait, étape 2 de « Répartie » en cours, XP et série ; la rafale du jour est à faire. */
async function avancer(email: string) {
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  await requete(`UPDATE "User" SET xp = 50, streak = 1, "lastPracticeAt" = now() - interval '1 day' WHERE id = $1`, [id]);
  await requete(
    `INSERT INTO "EspaceCompte" ("userId", "premierPasLe", "createdAt", "updatedAt") VALUES ($1, now() - interval '10 days', now(), now())
     ON CONFLICT ("userId") DO UPDATE SET "premierPasLe" = EXCLUDED."premierPasLe"`,
    [id],
  );
  await requete(
    `INSERT INTO "UserPathProgress" (id, "userId", "learningPathId", "currentStep", "completedSteps", "startedAt")
     SELECT $1 || '-prog', $1, id, 2, ARRAY[1], now() - interval '9 days' FROM "LearningPath" WHERE slug = 'repartie'
     ON CONFLICT DO NOTHING`,
    [id],
  );
  await requete(
    `INSERT INTO "UserPathStepCompletion" (id, "userId", "learningPathId", "stepOrder", "completedAt")
     SELECT $1 || '-etape', $1, id, 1, now() - interval '9 days' FROM "LearningPath" WHERE slug = 'repartie'
     ON CONFLICT DO NOTHING`,
    [id],
  );
}

test.describe("@espace gate typographique d'« Aujourd'hui » s25 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(180_000);

  const comptes = [
    { nom: "visiteur", plan: null, avance: false },
    { nom: "gratuit", plan: "FREE", avance: false },
    { nom: "abonné avancé", plan: "PREMIUM", avance: true },
    { nom: "nouvel abonné", plan: "PREMIUM", avance: false },
  ] as const;

  for (const compte of comptes) {
    test(`${compte.nom} : 4 tailles, 6 combinaisons, 400 et 600, aucune capitale, un seul aplat violet, accent seulement sur Z1, contrastes AA dans Z1, extrait sans violet`, async ({ page }) => {
      if (compte.plan) {
        const email = `e2e-typo-s25-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, compte.plan);
        if (compte.avance) await avancer(email);
        await connecter(page, email, MOT_DE_PASSE);
      }
      for (const vue of VUES) {
        await page.setViewportSize({ width: vue.largeur, height: vue.hauteur });
        await page.goto("/mon-espace");
        await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
        const apercu = (await page.locator("[data-apercu-verrouille]").count()) > 0;
        expect(apercu, `aperçu pour ${compte.nom}`).toBe(compte.plan !== "PREMIUM");
        if (compte.avance) await expect(page.locator("[data-rafale='a-faire'][data-action-du-jour]")).toHaveCount(1);
        controler(await mesurer(page, vue.hauteur), `${compte.nom}, ${vue.largeur} x ${vue.hauteur}`, vue.titre, apercu);
        // v7 tour 11 (relecture UX du tour 10), revu au v7 tour 13 (vitrine des répliques) : à 375 x 812, dans Z1 de
        // l'extrait, la situation ENTIÈRE et le haut de la première réplique fermée (bord et libellé) au premier écran,
        // à pleine netteté, avec le bouton d'offre.
        if (apercu && vue.largeur === 375) {
          const z1 = page.locator("[data-apercu-extrait] [data-tuile-fermee='nette']");
          await expect(z1.locator("h2"), `situation entière au premier écran, ${compte.nom}`).toBeInViewport({ ratio: 1 });
          const premiere = await z1.locator("[data-replique-fermee]").first().evaluate((r) => ({ haut: r.getBoundingClientRect().top, libelle: r.querySelector("p")!.getBoundingClientRect().bottom }));
          expect(premiere.libelle, `libellé de la première réplique fermée au premier écran, ${compte.nom}`).toBeLessThanOrEqual(vue.hauteur);
          await expect(page.locator("[data-apercu-verrouille] a[data-position='haut']"), `offre au premier écran, ${compte.nom}`).toBeInViewport({ ratio: 1 });
          expect(await z1.locator("h2").evaluate((h) => { let o = 1; for (let e: Element | null = h; e && !e.hasAttribute("data-tuile-fermee"); e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; })).toBe(1);
        }
      }
      // v7 tour 11 : à 768, étape (Z3) et mission (Z4) côte à côte (5 + 7), même haut, aucun débordement.
      if (compte.avance) {
        await page.setViewportSize({ width: 768, height: 900 });
        await page.goto("/mon-espace");
        const zones = await page.locator("[data-zone='parcours'], [data-zone='mission']").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ x: Math.round(r.left), y: Math.round(r.top), l: Math.round(r.width) })));
        if (zones.length === 2) {
          expect(zones[0].y, "Z3 et Z4 sur la même rangée à 768").toBe(zones[1].y);
          expect(zones[0].l, "Z3 plus étroite que Z4 à 768 (5 + 7)").toBeLessThan(zones[1].l);
        }
      }
    });
  }
});

/**
 * s26, Thomas 19/11 : sur une fenêtre haute (1920 x 1200), la carte de fin entre dans le premier écran avec la carte
 * d'offre : sur les 6 aperçus (visiteur et inscrit gratuit), UN SEUL fond violet plein au premier écran, le bouton
 * d'offre du hero ; le bouton de la carte de fin y est en CONTOUR (bord violet 1 px, fond transparent, 44 px au moins,
 * même lien que le hero), la carte garde son bord violet de 2 px. Sous 1000 px de haut (1280 x 900), il reste plein, sauf
 * sur Aujourd'hui et Favoris (s26 contrôle d'ensemble, aperçus : contour dès 1024 de large).
 */
test.describe("@espace carte de fin en contour sur fenêtre haute, s26 Thomas 19/11 (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(180_000);
  const APERCUS = ["/mon-espace", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/favoris", "/carnet"];
  const BOUTON_FIN = "[data-apercu-fin] a[data-position='fin'], [data-carnet-fin] a[data-testid='carnet-paywall-bouton']";

  for (const plan of [null, "FREE"] as const) {
    test(`${plan ?? "visiteur"} : un seul fond violet plein au premier écran à 1920 x 1200 sur les 6 aperçus`, async ({ page }) => {
      if (plan) {
        const email = `e2e-fin-s26-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
        await creerCompte(email, MOT_DE_PASSE, plan);
        await connecter(page, email, MOT_DE_PASSE);
      }
      for (const adresse of APERCUS) {
        const ou = `${adresse}, ${plan ?? "visiteur"}`;
        await page.setViewportSize({ width: 1920, height: 1200 });
        await page.goto(adresse);
        await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
        const m = await mesurer(page, 1200);
        expect(m.pleinsViolets, `fonds violets pleins au premier écran, ${ou}`).toHaveLength(1);
        expect(m.pleinsOffre, `le seul aplat violet est le bouton d'offre du hero, ${ou}`).toBe(1);
        const fin = page.locator(BOUTON_FIN);
        await expect(fin, `bouton de la carte de fin, ${ou}`).toHaveCount(1);
        const haut = await page.locator("[data-apercu-offre] a[data-position='haut']").getAttribute("href");
        expect(await fin.getAttribute("href"), `même lien que le hero, ${ou}`).toBe(haut);
        const style = await fin.evaluate((a) => {
          const cs = getComputedStyle(a);
          const carte = getComputedStyle(a.closest("[data-apercu-fin], [data-carnet-fin]")!);
          return { bord: cs.borderTopWidth, couleurBord: cs.borderTopColor, fond: cs.backgroundColor, hauteur: a.getBoundingClientRect().height, bordCarte: carte.borderTopWidth };
        });
        expect(style.bord, `bouton de fin en contour, ${ou}`).toBe("1px");
        expect(VIOLETS.some((v) => style.couleurBord.includes(v)), `bord violet du bouton de fin, ${ou}`).toBe(true);
        expect(style.fond, `bouton de fin sans fond, ${ou}`).toBe("rgba(0, 0, 0, 0)");
        expect(style.hauteur, `cible de 44 px au moins, ${ou}`).toBeGreaterThanOrEqual(44);
        expect(style.bordCarte, `la carte de fin garde son bord de 2 px, ${ou}`).toBe("2px");
        // Sous 1000 px de haut, le bouton de fin reste plein (attente : `transition-colors`, 150 ms, après le changement
        // de taille de la fenêtre).
        // s26 contrôle d'ensemble, aperçus (C3) : sur les extraits courts (Aujourd'hui, Favoris), la carte de fin entre dans
        // la même fenêtre que la carte d'offre dès 1024 de large : bouton de fin en contour à 1280 x 900 aussi.
        const court = adresse === "/mon-espace" || adresse === "/favoris";
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect
          .poll(() => fin.evaluate((a) => getComputedStyle(a).backgroundColor), { message: `bouton de fin ${court ? "en contour" : "plein"} sous 1000 px de haut, ${ou}` })
          .toBe(court ? "rgba(0, 0, 0, 0)" : "rgb(124, 58, 237)");
      }
    });
  }
});
