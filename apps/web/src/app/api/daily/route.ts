import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";
import { pickValidatedJoke } from "@/lib/ai/daily-joke-pool";

export const dynamic = "force-dynamic";

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
      include: {
        joke: true,
        tip: true,
        video: true,
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
          })
        : Promise.resolve(validatedJoke),
      prisma.tip.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % tipCount,
      }),
      videoCount > 0
        ? prisma.video.findFirst({
            where: { isActive: true },
            orderBy: { id: "asc" },
            skip: dayOfYear % videoCount,
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
  const reviewedWhere: Prisma.JokeWhereInput = {
    isActive: true,
    comedyTechnique: { not: null },
    copyVerdict: { in: ["GARDER", "REECRIRE"] },
  };
  if ((await prisma.joke.count({ where: reviewedWhere })) > 0) return reviewedWhere;
  const decryptedWhere: Prisma.JokeWhereInput = { isActive: true, comedyTechnique: { not: null } };
  if ((await prisma.joke.count({ where: decryptedWhere })) > 0) return decryptedWhere;
  return { isActive: true };
}
