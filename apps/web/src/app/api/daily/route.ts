import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyContent = await prisma.dailyContent.findUnique({
      where: { date: today },
      include: {
        joke: true,
        tip: true,
      },
    });

    if (!dailyContent) {
      return NextResponse.json(
        { error: "Pas de contenu du jour configuré" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      date: dailyContent.date,
      joke: dailyContent.joke,
      tip: dailyContent.tip,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
