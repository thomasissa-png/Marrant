import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { selectSlidingFreeItems, insertDailyFirst } from "@/lib/free-content";
import { todayUTC } from "@/lib/ai/date-utils";

const FREE_LIMIT = 50;

// Schéma de validation pour les filtres
const querySchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.parse({
      category: searchParams.get("category") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
    });

    // Vérifier le plan de l'utilisateur
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    let isPremium = false;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      isPremium = user?.plan === "PREMIUM";
    }

    // FREE / anonyme : fenêtre glissante + daily en premier
    if (!isPremium) {
      const total = await prisma.joke.count({ where: { isActive: true } });

      const allJokes = await prisma.joke.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });

      // Fenêtre glissante : avance de 1 par jour
      const sliding = selectSlidingFreeItems(allJokes, FREE_LIMIT);

      // Insérer la blague du jour en première position
      const daily = await prisma.dailyContent.findUnique({
        where: { date: todayUTC() },
        select: { jokeId: true },
      });

      const rotated = insertDailyFirst(
        sliding,
        daily?.jokeId,
        (joke) => joke.id,
        FREE_LIMIT
      );

      return NextResponse.json({
        jokes: rotated,
        pagination: { page: 1, limit: FREE_LIMIT, total: rotated.length, totalPages: 1 },
        limited: true,
        totalAvailable: total,
      });
    }

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.type && { type: query.type as never }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { content: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    };

    const [jokes, total] = await Promise.all([
      prisma.joke.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.joke.count({ where }),
    ]);

    return NextResponse.json({
      jokes,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      limited: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
