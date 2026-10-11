import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";

/**
 * Vanne du jour en lecture seule pour la page /blague-du-jour (lot S3a s14).
 *
 * Même source que `GET /api/daily` (route non modifiée ici) : le DailyContent du
 * jour s'il existe, sinon le même repli déterministe (jour de l'année modulo le
 * nombre de vannes éligibles, mêmes filtres, même tri). Aucune écriture, aucune
 * génération. Seul écart : une vanne du jour retirée depuis (isActive=false)
 * n'est pas affichée, la page prend alors le repli (sa fiche redirigerait vers
 * la liste).
 */

export interface DailyJoke {
  id: string;
  content: string;
  punchline: string;
  category: string;
  comedyTechnique: string | null;
  techniqueExplanation: string | null;
}

const JOKE_SELECT = {
  id: true,
  isActive: true,
  content: true,
  punchline: true,
  category: true,
  comedyTechnique: true,
  techniqueExplanation: true,
} as const;

const REVIEWED_WHERE = {
  isActive: true,
  comedyTechnique: { not: null },
  copyVerdict: { in: ["GARDER", "REECRIRE"] },
};
const DECRYPTED_WHERE = { isActive: true, comedyTechnique: { not: null } };
const ACTIVE_WHERE = { isActive: true };

function toDailyJoke(joke: {
  id: string;
  content: string;
  punchline: string;
  category: unknown;
  comedyTechnique: string | null;
  techniqueExplanation: string | null;
}): DailyJoke {
  return {
    id: joke.id,
    content: joke.content,
    punchline: joke.punchline,
    category: String(joke.category),
    comedyTechnique: joke.comedyTechnique,
    techniqueExplanation: joke.techniqueExplanation,
  };
}

/** Filtre du repli, dans le même ordre de préférence que /api/daily. */
async function fallbackWhere() {
  if ((await prisma.joke.count({ where: REVIEWED_WHERE })) > 0) return REVIEWED_WHERE;
  if ((await prisma.joke.count({ where: DECRYPTED_WHERE })) > 0) return DECRYPTED_WHERE;
  return ACTIVE_WHERE;
}

/** Lève en cas d'erreur base : l'appelant décide du repli d'affichage. */
export async function loadDailyJoke(today: Date = todayUTC()): Promise<DailyJoke | null> {
  const daily = await prisma.dailyContent.findUnique({
    where: { date: today },
    select: { joke: { select: JOKE_SELECT } },
  });
  if (daily?.joke?.isActive) return toDailyJoke(daily.joke);

  const where = await fallbackWhere();
  const count = await prisma.joke.count({ where });
  if (count === 0) return null;
  const joke = await prisma.joke.findFirst({
    where,
    orderBy: { id: "asc" },
    skip: getDayOfYear(today) % count,
    select: JOKE_SELECT,
  });
  return joke ? toDailyJoke(joke) : null;
}

/** Base indisponible (build sans base, panne) : `null`, la page affiche son repli. */
export async function getDailyJoke(): Promise<DailyJoke | null> {
  try {
    return await loadDailyJoke();
  } catch (error) {
    console.error("[daily-joke] vanne du jour indisponible", error);
    return null;
  }
}
