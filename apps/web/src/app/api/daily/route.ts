import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "@/lib/ai/date-utils";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

/**
 * Verrou en mémoire pour éviter de lancer plusieurs générations simultanées.
 * Persiste tant que le process Node.js tourne (parfait pour Replit).
 */
let isGenerating = false;

export async function GET() {
  try {
    // Vérifier l'authentification et l'abonnement
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentification requise", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (user?.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Abonnement requis pour accéder au contenu du jour", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

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

    // Pas de contenu pour aujourd'hui — lancer la génération en arrière-plan (non bloquant)
    if (!isGenerating) {
      isGenerating = true;
      const month = today.getUTCMonth() + 1;
      const year = today.getUTCFullYear();

      // Fire-and-forget : le visiteur reçoit le fallback immédiatement,
      // le prochain visiteur (ou refresh) aura le vrai contenu.
      (async () => {
        try {
          console.log("[daily-auto] Génération automatique du contenu du jour…");
          await generateMonthlyPlans(month, year);
          await publishDailyContent(today);
          console.log("[daily-auto] Contenu du jour généré avec succès.");
        } catch (err) {
          console.error("[daily-auto] Échec de la génération :", err);
        } finally {
          isGenerating = false;
        }
      })();
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
