import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const FREE_LIMIT = 10;

// Schéma de validation pour les filtres
const querySchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.parse({
      category: searchParams.get("category") ?? undefined,
      type: searchParams.get("type") ?? undefined,
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

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.type && { type: query.type as never }),
    };

    // FREE / anonyme : limiter à FREE_LIMIT
    if (!isPremium) {
      const jokes = await prisma.joke.findMany({
        where,
        take: FREE_LIMIT,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        jokes,
        pagination: { page: 1, limit: FREE_LIMIT, total: FREE_LIMIT, totalPages: 1 },
        limited: true,
        upgradeMessage: "Tu as accès à 10 blagues + la blague du jour. Débloque les 500+ blagues — 0,99 €/mois",
      });
    }

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
