/**
 * Vannes de l'étape (D4, audit s17). Contrat : chaque étape porte
 * `jokeContents` (5 textes `content` EXACTS de vannes actives). Repli tant que
 * le nouveau seed n'est pas chargé : `jokeIds` → `blagues-seed.json` → texte
 * actuel ou ancien. Vannes ACTIVES seulement, jamais d'emplacement vide.
 * Réservé aux abonnés Premium : l'appelant vérifie le plan en base avant.
 */
import { prisma } from "@/lib/prisma";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import blaguesSeed from "../../../../docs/content/blagues-seed.json";

interface JokeSeed {
  id: number;
  content: string;
  previousContent?: string | string[];
}

export interface StepJoke {
  id: string;
  content: string;
  punchline: string;
  technique: string | null;
  href: string;
}

const SEED_BY_ID = new Map((blaguesSeed as JokeSeed[]).map((j) => [j.id, j]));

type JokeStep = { order: number; jokeIds?: number[]; jokeContents?: string[] };

/** Textes candidats d'une étape, groupés par emplacement (un emplacement = une vanne). */
function stepSlots(step: JokeStep): string[][] {
  const contents = (step.jokeContents ?? []).filter((t) => typeof t === "string" && t.length > 0);
  if (contents.length > 0) return contents.map((t) => [t]);
  return (step.jokeIds ?? []).map(jokeSeedTexts);
}

/** Textes possibles d'une vanne du seed : le texte actuel puis les anciens. */
export function jokeSeedTexts(seedId: number): string[] {
  const seed = SEED_BY_ID.get(seedId);
  if (!seed) return [];
  const previous = Array.isArray(seed.previousContent)
    ? seed.previousContent
    : seed.previousContent
      ? [seed.previousContent]
      : [];
  return [seed.content, ...previous].filter((t) => typeof t === "string" && t.length > 0);
}

/**
 * Résout les vannes de plusieurs étapes en une requête. Renvoie, par numéro
 * d'étape, les vannes trouvées et actives, dans l'ordre du seed, sans doublon.
 * Un identifiant introuvable (82, 85, 180 avant correction du lot A) est ignoré.
 */
export async function resolveStepJokes(steps: ReadonlyArray<JokeStep>): Promise<Map<number, StepJoke[]>> {
  const result = new Map<number, StepJoke[]>();
  const allTexts = [...new Set(steps.flatMap((s) => stepSlots(s).flat()))];
  if (allTexts.length === 0) return result;

  const rows = await prisma.joke.findMany({
    where: { isActive: true, content: { in: allTexts } },
    select: { id: true, content: true, punchline: true, comedyTechnique: true },
  });
  const byContent = new Map(rows.map((r) => [r.content, r]));

  for (const step of steps) {
    const seen = new Set<string>();
    const jokes: StepJoke[] = [];
    for (const slot of stepSlots(step)) {
      const row = slot
        .map((t) => byContent.get(t))
        .find((r) => r !== undefined);
      if (!row || seen.has(row.id)) continue;
      seen.add(row.id);
      jokes.push({
        id: row.id,
        content: row.content,
        punchline: row.punchline,
        technique: row.comedyTechnique ?? null,
        href: `/vannes/${buildJokeSlug(row)}`,
      });
    }
    result.set(step.order, jokes);
  }
  return result;
}
