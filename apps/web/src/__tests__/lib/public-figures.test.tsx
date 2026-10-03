/**
 * Chiffres publics = une seule source (demande Thomas, 03/10/2026).
 *
 * - Limites du compte gratuit : constantes de src/config/premium.ts, les mêmes
 *   que celles appliquées par /api/jokes, /api/tips et /api/videos.
 * - Parcours : nombre et durées vérifiés contre docs/content/parcours-seed.json.
 * - Garde-fous : aucune limite gratuite ni durée de parcours réécrite en dur.
 */
import fs from "fs";
import path from "path";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import {
  FREE_CATALOGUE_LIMITS_LABEL,
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PARCOURS_MAX_WEEKS,
  PARCOURS_MIN_WEEKS,
  PREMIUM_PARCOURS,
  parcoursWeeks,
} from "@/config/premium";
import { LAST_FREE_PARCOURS_STEP } from "@/lib/parcours-access";
import { CARNET_FREE_FICHES } from "@/lib/carnet";


const SRC = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf8");
/** Code sans commentaires (les commentaires peuvent citer des chiffres). */
const code = (rel: string) =>
  read(rel)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("limites gratuites : une seule constante (texte : voir free-limits-text.test.tsx)", () => {
  it("le libellé est construit à partir des trois constantes", () => {
    expect(FREE_CATALOGUE_LIMITS_LABEL).toBe(
      `${FREE_JOKE_LIMIT} vannes, ${FREE_TIP_LIMIT} conseils, ${FREE_VIDEO_LIMIT} vidéos`,
    );
  });

  it("les routes API appliquent la constante de config (aucune limite locale)", () => {
    for (const [route, name] of [
      ["app/api/jokes/route.ts", "FREE_JOKE_LIMIT"],
      ["app/api/tips/route.ts", "FREE_TIP_LIMIT"],
      ["app/api/videos/route.ts", "FREE_VIDEO_LIMIT"],
    ]) {
      const code = read(route);
      expect(code).toContain(`import { ${name} } from "@/config/premium";`);
      expect(code).not.toMatch(new RegExp(`const ${name}\\s*=`));
    }
  });

  it("aucun texte public ne réécrit les limites gratuites en dur", () => {
    for (const file of [
      "components/blog/article-cta.tsx",
      "components/premium/premium-benefits.tsx",
      "components/vannes/vannes-list.tsx",
      "app/(dashboard)/abonnement/page.tsx",
      "lib/llms-content.ts",
    ]) {
      expect(read(file)).not.toMatch(/\d+ vannes, \d+ conseils/);
    }
  });

  it("le texte « la première étape / situation offerte » correspond aux règles d'accès", () => {
    // Formulation ordinale conservée : si l'une de ces règles change, le texte doit suivre.
    expect(LAST_FREE_PARCOURS_STEP).toBe(1);
    expect(CARNET_FREE_FICHES).toBe(1);
  });
});

describe("parcours : nombre et durées dérivés du seed", () => {
  it("un parcours par entrée du seed, durée = nombre d'étapes = semaines annoncées", () => {
    expect(PARCOURS_COUNT).toBe(parcoursSeed.length);
    for (const p of parcoursSeed) {
      const weeks = parcoursWeeks(p.slug as Parameters<typeof parcoursWeeks>[0]);
      expect(weeks).toBe(p.steps.length);
      expect(`${weeks} semaines`).toBe(p.duration);
    }
    expect(PARCOURS_MIN_WEEKS).toBe(Math.min(...parcoursSeed.map((p) => p.steps.length)));
    expect(PARCOURS_MAX_WEEKS).toBe(Math.max(...parcoursSeed.map((p) => p.steps.length)));
    expect(PREMIUM_PARCOURS.map((p) => p.slug)).toEqual(parcoursSeed.map((p) => p.slug));
  });

  it("aucune durée de parcours ni nombre de parcours en dur dans les textes publics", () => {
    for (const file of [
      "app/(dashboard)/parcours/page.tsx",
      "app/(dashboard)/parcours/[slug]/page.tsx",
      "app/(dashboard)/page.tsx",
      "app/llms.txt/route.ts",
      "app/llms-full.txt/route.ts",
      "lib/llms-content.ts",
      "components/blog/blog-article-parcours-maillage.tsx",
      "components/profil/profil-dashboard.tsx",
    ]) {
      // Durées des parcours (3, 4, 6) ; « 2 à 4 semaines » de pratique et l'étude à 8 semaines restent.
      expect(code(file)).not.toMatch(/(?<!à )\b[346] semaines/);
      expect(code(file)).not.toMatch(/\b\d+ parcours\b/);
    }
  });
});
