/**
 * Fiche (vanne, conseil, vidéo) → étape de parcours qui l'utilise (SEO-06, s17 lot C).
 *
 * SERVEUR UNIQUEMENT : lit les seeds (`docs/content/*.json`). Ne jamais
 * importer depuis un composant client (le contenu partirait dans le bundle).
 *
 * Sources (les mêmes que la page parcours) :
 * - vidéos et vannes : `parcours-seed.json` (`videos[].youtubeId`, `jokeIds`),
 *   les `jokeIds` étant des identifiants de `blagues-seed.json`, retrouvés en
 *   base par le texte de la vanne (`content`, ou `previousContent` avant réécriture) ;
 * - conseils : la table des étapes en base (`LearningPathStep.tipId`), source de vérité.
 * Aucun parcours ne l'utilise → liste vide → pas de bloc sur la fiche.
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";
import blaguesSeed from "../../../../docs/content/blagues-seed.json";
import { jokeContentKey } from "@/lib/jokes-dedupe";
import { isParcoursSlug, type ParcoursSlug } from "@/lib/entrees-parcours";

export interface FicheParcoursRef {
  slug: ParcoursSlug;
  etape: number;
}

interface SeedStep {
  jokeIds?: number[];
  videos?: { youtubeId: string }[];
}
interface SeedParcours {
  slug: string;
  order?: number;
  steps: SeedStep[];
}
interface SeedJoke {
  id: number;
  content: string;
  /** Ancienne(s) version(s) du texte : chaîne ou liste selon les réécritures. */
  previousContent?: string | string[] | null;
}

/** Étape 1 d'abord (lecture libre), puis l'ordre des parcours. */
export function sortRefs(refs: FicheParcoursRef[]): FicheParcoursRef[] {
  const rank = (s: ParcoursSlug) => PARCOURS_ORDER.indexOf(s);
  return [...refs].sort((a, b) => a.etape - b.etape || rank(a.slug) - rank(b.slug));
}

const PARCOURS = (parcoursSeed as SeedParcours[])
  .filter((p) => isParcoursSlug(p.slug))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const PARCOURS_ORDER = PARCOURS.map((p) => p.slug as ParcoursSlug);

function collect(match: (step: SeedStep) => boolean): FicheParcoursRef[] {
  const refs: FicheParcoursRef[] = [];
  for (const p of PARCOURS) {
    p.steps.forEach((step, i) => {
      if (match(step)) refs.push({ slug: p.slug as ParcoursSlug, etape: i + 1 });
    });
  }
  return sortRefs(refs);
}

export function findParcoursForVideo(youtubeId: string): FicheParcoursRef[] {
  return collect((step) => (step.videos ?? []).some((v) => v.youtubeId === youtubeId));
}

/** Index texte de vanne (seed, versions actuelle et précédente) → id du seed. */
let jokeIndex: Map<string, number> | null = null;
function seedJokeIdByContent(content: string): number | undefined {
  if (!jokeIndex) {
    jokeIndex = new Map();
    for (const j of blaguesSeed as unknown as SeedJoke[]) {
      jokeIndex.set(jokeContentKey(j.content), j.id);
      const previous = Array.isArray(j.previousContent) ? j.previousContent : [j.previousContent];
      for (const text of previous) {
        if (typeof text !== "string" || !text) continue;
        const prev = jokeContentKey(text);
        if (!jokeIndex.has(prev)) jokeIndex.set(prev, j.id);
      }
    }
  }
  return jokeIndex.get(jokeContentKey(content));
}

export function findParcoursForJoke(content: string): FicheParcoursRef[] {
  const seedId = seedJokeIdByContent(content);
  if (seedId === undefined) return [];
  return collect((step) => (step.jokeIds ?? []).includes(seedId));
}

/** Lignes `LearningPathStep` (avec le parcours) → références, parcours inactifs exclus. */
export function refsFromDbSteps(
  steps: readonly { order: number; learningPath: { slug: string; isActive: boolean } }[],
): FicheParcoursRef[] {
  const refs: FicheParcoursRef[] = [];
  for (const s of steps) {
    if (s.learningPath.isActive && isParcoursSlug(s.learningPath.slug)) {
      refs.push({ slug: s.learningPath.slug, etape: s.order });
    }
  }
  return sortRefs(refs);
}
