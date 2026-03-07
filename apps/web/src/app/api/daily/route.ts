import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Chercher le contenu du jour configuré
    const dailyContent = await prisma.dailyContent.findUnique({
      where: { date: today },
      include: {
        joke: true,
        tip: true,
      },
    });

    if (dailyContent) {
      return NextResponse.json({
        date: dailyContent.date,
        joke: dailyContent.joke,
        tip: dailyContent.tip,
      });
    }

    // Fallback : contenu déterministe basé sur le jour de l'année
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const [jokeCount, tipCount] = await Promise.all([
      prisma.joke.count({ where: { isActive: true } }),
      prisma.tip.count({ where: { isActive: true } }),
    ]);

    if (jokeCount === 0 || tipCount === 0) {
      return NextResponse.json(
        { error: "Pas de contenu disponible" },
        { status: 404 }
      );
    }

    const [joke, tip] = await Promise.all([
      prisma.joke.findFirst({
        where: { isActive: true },
        skip: dayOfYear % jokeCount,
      }),
      prisma.tip.findFirst({
        where: { isActive: true },
        skip: dayOfYear % tipCount,
      }),
    ]);

    return NextResponse.json({
      date: today,
      joke,
      tip,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
