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
 * - v7 tour 7 (décision de Thomas du 16/11) : un seul élément à fond OU bord violet au premier écran, tout compris
 *   (dégradé, filet en pseudo-élément `::before`/`::after`, bordure, quelle que soit l'opacité) : le bouton plein ;
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
        if (bordViolet || fondViolet || pseudoViolet) {
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
      return { combinaisons: [...groupes.values()].sort((a, b) => b.taille - a.taille), pleinsViolets, accentsViolets, textesViolets, premium };
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
  expect(m.accentsViolets.length, `éléments à fond ou bord violet, ${ou} : ${m.accentsViolets.join(" / ")}`).toBe(1);
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
    test(`${compte.nom} : 4 tailles, 6 combinaisons, 400 et 600, aucune capitale, un seul plein violet et un seul accent violet au premier écran`, async ({ page }) => {
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
