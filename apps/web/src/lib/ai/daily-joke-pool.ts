/**
 * Pool de la vanne du jour (lot Q1, s14).
 *
 * Règle fondateur (« rien de moyen », barre Alexa) : la vanne du jour n'est
 * JAMAIS une vanne sous la barre. Le repli déterministe (route /api/daily,
 * daily-publisher quand la génération échoue, quality-watch) pioche donc
 * uniquement dans les vannes validées au niveau des étalons :
 * `isActive: true, copyVerdict: 'GARDER', comedyTechnique non null`.
 *
 * Les autres vannes restent visibles au catalogue, jamais vanne du jour.
 * Pool vide (transition, audit en cours) → `null` : l'appelant garde son
 * repli historique.
 */
import type { Joke, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const VALIDATED_JOKE_WHERE = {
  isActive: true,
  copyVerdict: "GARDER",
  comedyTechnique: { not: null },
} satisfies Prisma.JokeWhereInput;

export interface ValidatedJokePickOptions {
  /** Catégories à éviter (déjà prises par le conseil du jour, etc.). Ignoré si le filtre vide le pool. */
  excludeCategories?: string[];
  /** Vannes à exclure (ex. la vanne remplacée par quality-watch). */
  excludeIds?: string[];
}

/** Nombre de vannes validées (pool de la vanne du jour). */
export async function countValidatedJokes(): Promise<number> {
  return prisma.joke.count({ where: VALIDATED_JOKE_WHERE });
}

/**
 * Choisit une vanne validée de façon déterministe (jour de l'année modulo la
 * taille du pool, tri par id). Retourne `null` si le pool est vide.
 */
export async function pickValidatedJoke(
  dayOfYear: number,
  options: ValidatedJokePickOptions = {},
): Promise<Joke | null> {
  const idFilter: Prisma.JokeWhereInput =
    options.excludeIds && options.excludeIds.length > 0 ? { id: { notIn: options.excludeIds } } : {};
  const base: Prisma.JokeWhereInput = { ...VALIDATED_JOKE_WHERE, ...idFilter };

  const candidates: Prisma.JokeWhereInput[] = [];
  if (options.excludeCategories && options.excludeCategories.length > 0) {
    candidates.push({ ...base, category: { notIn: options.excludeCategories as never } });
  }
  candidates.push(base);

  for (const where of candidates) {
    const count = await prisma.joke.count({ where });
    if (count === 0) continue;
    const joke = await prisma.joke.findFirst({
      where,
      orderBy: { id: "asc" },
      skip: Math.abs(dayOfYear) % count,
    });
    if (joke) return joke;
  }
  return null;
}
