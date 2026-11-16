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
      const z1 = main.querySelector("[data-action-du-jour]");
      const accentZ1 = { cadre: 0, alphaMax: 0 };
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
      for (const el of Array.from(main.querySelectorAll("*"))) {
        const r = el.getBoundingClientRect();
        const dansEcran = r.top <= hauteur && r.bottom >= 0 && r.width > 0;
        if (!dansEcran) continue;
        const cs = getComputedStyle(el);
        const fond = violet(cs.backgroundColor);
        if (fond.teinte && fond.alpha >= 0.5) pleinsViolets.push((el.textContent ?? "").trim().slice(0, 40) || el.tagName);
        // Accent violet, quel qu'il soit : fond (couleur ou dégradé), bord dessiné, ou pseudo-élément rendu (filet).
        const bordViolet = ["Top", "Right", "Bottom", "Left"].some(
          (c) => parseFloat(cs.getPropertyValue(`border-${c.toLowerCase()}-width`)) > 0 && contientViolet(cs.getPropertyValue(`border-${c.toLowerCase()}-color`)),
        );
        const fondViolet = contientViolet(cs.backgroundColor) || contientViolet(cs.backgroundImage);
        const pseudoViolet = ["::before", "::after"].some((ps) => {
          const s = getComputedStyle(el, ps);
          return s.content !== "none" && (contientViolet(s.backgroundColor) || contientViolet(s.backgroundImage));
        });
        // v7 tour 8 : la carte Z1 elle-même peut porter un bord ou une teinte violette légère (relevée à part).
        if (z1 && el === z1 && (bordViolet || fondViolet) && !pseudoViolet && !(fond.teinte && fond.alpha >= 0.5)) {
          accentZ1.cadre += 1;
          const alphas = [cs.backgroundImage, cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor, cs.backgroundColor]
            .flatMap(couleurs)
            .filter((c) => c.teinte)
            .map((c) => c.alpha);
          accentZ1.alphaMax = Math.max(accentZ1.alphaMax, ...alphas);
        } else if ((bordViolet || fondViolet || pseudoViolet) && !(fond.teinte && fond.alpha >= 0.5)) {
          accentsViolets.push(`${el.tagName.toLowerCase()} « ${(el.textContent ?? "").trim().slice(0, 30)} »${pseudoViolet ? " (pseudo-élément)" : ""}`);
        }
        const texte = Array.from(el.childNodes)
          .filter((n) => n.nodeType === 3 && n.textContent?.trim())
          .map((n) => n.textContent?.trim() ?? "")
          .join(" ");
        if (!texte) continue;
        const taille = parseFloat(cs.fontSize);
        const cle = `${taille}/${cs.fontWeight}/${cs.textTransform}`;
        const g = groupes.get(cle) ?? { cle, taille, graisse: cs.fontWeight, casse: cs.textTransform, textes: [] };
        g.textes.push(texte.slice(0, 30));
        groupes.set(cle, g);
        if (violet(cs.color).teinte) textesViolets.push(texte.slice(0, 30));
        // Repère « Premium » visible : élément dessiné (pas `sr-only`, 1 px), hors phrases de la carte d'offre.
        const visible = r.width > 1 && r.height > 1 && cs.visibility !== "hidden";
        if (visible && /Premium/.test(texte) && !el.closest("[data-apercu-offre] p")) premium.push(texte.slice(0, 30));
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
    test(`${compte.nom} : 4 tailles, 6 combinaisons, 400 et 600, aucune capitale, un seul aplat violet, accent seulement sur Z1, contrastes AA dans Z1`, async ({ page }) => {
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
      }
    });
  }
});
