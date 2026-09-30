import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";

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

    // Vanne du jour de repli :
    //  1. On préfère les vannes décortiquées ET validées par la relecture s11
    //     (copyVerdict GARDER ou REECRIRE — le décryptage est plein, la charte
    //     s11 a été appliquée).
    //  2. Si aucune n'est encore relue (transition), on garde le filtre
    //     historique "au moins un décryptage".
    //  3. En dernier recours, toutes les vannes actives (pré-décryptage).
    const reviewedCount = await prisma.joke.count({
      where: {
        isActive: true,
        comedyTechnique: { not: null },
        copyVerdict: { in: ["GARDER", "REECRIRE"] },
      },
    });
    const decryptedCount = reviewedCount > 0 ? reviewedCount : await prisma.joke.count({
      where: { isActive: true, comedyTechnique: { not: null } },
    });
    const jokeWhere =
      reviewedCount > 0
        ? {
            isActive: true,
            comedyTechnique: { not: null },
            copyVerdict: { in: ["GARDER", "REECRIRE"] },
          }
        : decryptedCount > 0
          ? { isActive: true, comedyTechnique: { not: null } }
          : { isActive: true };

    const [jokeCount, tipCount, videoCount] = await Promise.all([
      prisma.joke.count({ where: jokeWhere }),
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
      prisma.joke.findFirst({
        where: jokeWhere,
        orderBy: { id: "asc" },
        skip: dayOfYear % jokeCount,
      }),
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
