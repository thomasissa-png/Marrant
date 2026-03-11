import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";

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

    const [jokeCount, tipCount, videoCount] = await Promise.all([
      prisma.joke.count({ where: { isActive: true } }),
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
        where: { isActive: true },
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
