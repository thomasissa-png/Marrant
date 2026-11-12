import { NextResponse } from "next/server";
import type { Joke, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";
import { pickValidatedJoke } from "@/lib/ai/daily-joke-pool";

export const dynamic = "force-dynamic";

/**
 * Réponse publique : liste FERMÉE de champs (s23, décision de Thomas du 04/11).
 * Exactement ce que l'accueil affiche (components/home/daily-content.tsx),
 * exercice « À toi de jouer » compris (offert à tous). Aucun champ interne :
 * original*, copyVerdict, copyReview*, generatedByAI, isActive, dates…
 */
const DAILY_JOKE_SELECT = {
  id: true,
  content: true,
  punchline: true,
  category: true,
  comedyTechnique: true,
  techniqueExplanation: true,
  howToApply: true,
} satisfies Prisma.JokeSelect;

const DAILY_TIP_SELECT = {
  id: true,
  title: true,
  content: true,
  category: true,
  difficulty: true,
  example: true,
  exercise: true,
} satisfies Prisma.TipSelect;

const DAILY_VIDEO_SELECT = {
  id: true,
  youtubeId: true,
  title: true,
  channelName: true,
  category: true,
  technique: true,
  learnings: true,
  exercise: true,
} satisfies Prisma.VideoSelect;

/** Vanne du pool validé (fonction partagée, renvoie la ligne entière) ramenée à la liste fermée. */
function publicJoke(joke: Joke | null) {
  if (!joke) return null;
  const { id, content, punchline, category, comedyTechnique, techniqueExplanation, howToApply } = joke;
  return { id, content, punchline, category, comedyTechnique, techniqueExplanation, howToApply };
}

/**
 * Pas de génération à la volée ici (s14) : sous Cloudflare Workers, une tâche
 * lancée après la réponse est abandonnée (et le verrou en mémoire est propre à
 * chaque isolate). Le contenu du jour est produit par le cron daily-content
 * (src/lib/scheduler/jobs.ts) ; en attendant, repli déterministe ci-dessous.
 */

export async function GET() {
  try {
    const today = todayUTC();

    // Chercher le contenu du jour configuré
    const dailyContent = await prisma.dailyContent.findUnique({
      where: { date: today },
      select: {
        date: true,
        joke: { select: DAILY_JOKE_SELECT },
        tip: { select: DAILY_TIP_SELECT },
        video: { select: DAILY_VIDEO_SELECT },
      },
    });

    if (dailyContent) {
      return NextResponse.json({
        date: dailyContent.date,
        joke: dailyContent.joke,
        tip: dailyContent.tip,
        video: dailyContent.video,
      });
    }

    // Fallback : contenu déterministe basé sur le jour de l'année
    const dayOfYear = getDayOfYear(today);

    // Vanne du jour de repli (lot Q1, s14, barre Alexa) : uniquement une vanne
    // validée au niveau des étalons (isActive, copyVerdict GARDER, décryptage
    // présent). Pool vide (transition) → repli historique.
    const validatedJoke = await pickValidatedJoke(dayOfYear);
    const legacyJokeWhere = validatedJoke ? null : await legacyFallbackJokeWhere();

    const [jokeCount, tipCount, videoCount] = await Promise.all([
      legacyJokeWhere ? prisma.joke.count({ where: legacyJokeWhere }) : Promise.resolve(1),
      prisma.tip.count({ where: { isActive: true } }),
      prisma.video.count({ where: { isActive: true } }),
    ]);

    if (jokeCount === 0 || tipCount === 0) {
      return NextResponse.json(
        { error: "Pas de contenu disponible" },
        { status: 404 }
      );
    }

    const [joke, tip, video] = await Promise.all([
      legacyJokeWhere
        ? prisma.joke.findFirst({
            where: legacyJokeWhere,
            orderBy: { id: "asc" },
            skip: dayOfYear % jokeCount,
            select: DAILY_JOKE_SELECT,
          })
        : Promise.resolve(publicJoke(validatedJoke)),
      prisma.tip.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % tipCount,
        select: DAILY_TIP_SELECT,
      }),
      videoCount > 0
        ? prisma.video.findFirst({
            where: { isActive: true },
            orderBy: { id: "asc" },
            skip: dayOfYear % videoCount,
            select: DAILY_VIDEO_SELECT,
          })
        : null,
    ]);

    return NextResponse.json({
      date: today,
      joke,
      tip,
      video,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * Repli historique (avant la barre s14), utilisé seulement tant qu'aucune
 * vanne n'est marquée GARDER :
 *  1. vannes décortiquées et relues (copyVerdict GARDER ou REECRIRE) ;
 *  2. sinon, vannes avec au moins un décryptage ;
 *  3. en dernier recours, toutes les vannes actives.
 */
async function legacyFallbackJokeWhere(): Promise<Prisma.JokeWhereInput> {
  // s24 (espace, lot D3, architecture 3.12) : jamais une vanne repérée « humour noir ».
  const reviewedWhere: Prisma.JokeWhereInput = {
    isActive: true,
    humourNoir: false,
    comedyTechnique: { not: null },
    copyVerdict: { in: ["GARDER", "REECRIRE"] },
  };
  if ((await prisma.joke.count({ where: reviewedWhere })) > 0) return reviewedWhere;
  const decryptedWhere: Prisma.JokeWhereInput = { isActive: true, humourNoir: false, comedyTechnique: { not: null } };
  if ((await prisma.joke.count({ where: decryptedWhere })) > 0) return decryptedWhere;
  return { isActive: true, humourNoir: false };
}
