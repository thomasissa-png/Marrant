import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { dedupeJokesByContent } from "@/lib/jokes-dedupe";
import { FREE_JOKE_LIMIT } from "@/config/premium";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { selectionGratuite } from "@/config/vannes-categories";
import { OFFRE_NOM } from "@/config/textes/offre";
import { sansExerciceVanne } from "@/lib/champs-premium";

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

    // Support comma-separated categories for grouped filters (e.g. "COUPLE,DATING")
    const categoryFilter = query.category
      ? query.category.includes(",")
        ? { category: { in: query.category.split(",") } as never }
        : { category: query.category as never }
      : {};

    const where = {
      isActive: true,
      ...categoryFilter,
      ...(query.type && { type: query.type as never }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { content: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    };

    // Doublons en base (même contenu) : dédoublonnés ici, pas en base (T12 s12).
    // On liste les identifiants dans l'ordre d'affichage, on garde la 1re occurrence
    // de chaque contenu, puis on pagine sur la liste dédoublonnée.
    const orderBy = [{ createdAt: "desc" as const }, { id: "asc" as const }];
    const candidates = await prisma.joke.findMany({
      where,
      select: { id: true, content: true },
      orderBy,
    });
    let uniqueIds = dedupeJokesByContent(candidates).map((c) => c.id);
    const total = uniqueIds.length;

    // Décision de Thomas du 14/11, interrupteur de l'espace ouvert seulement : sans abonnement, les vannes
    // ouvertes sont les FREE_JOKE_LIMIT de `selectionGratuite` (réparties sur les groupes de la rangée de
    // catégories, choisies sur tout le catalogue actif) ; un filtre ou une recherche montre celles de cette
    // sélection qui y répondent. Fermé : les FREE_JOKE_LIMIT plus récentes du filtre, comme aujourd'hui.
    if (ESPACE_CLIENT_PUBLIE && !isPremium) {
      const catalogue = await prisma.joke.findMany({
        where: { isActive: true },
        select: { id: true, content: true, category: true },
        orderBy,
      });
      const ouvertes = new Set(selectionGratuite(dedupeJokesByContent(catalogue), FREE_JOKE_LIMIT).map((c) => c.id));
      uniqueIds = uniqueIds.filter((id) => ouvertes.has(id));
    }

    // FREE : limiter le total accessible
    const accessibleTotal = isPremium ? total : Math.min(uniqueIds.length, FREE_JOKE_LIMIT);
    const effectiveLimit = Math.min(query.limit, accessibleTotal - (query.page - 1) * query.limit);

    if (effectiveLimit <= 0 && !isPremium) {
      return NextResponse.json({
        jokes: [],
        pagination: {
          page: query.page,
          limit: query.limit,
          total: accessibleTotal,
          totalPages: Math.ceil(accessibleTotal / query.limit),
        },
        limited: true,
        totalReal: total,
        upgradeMessage: "Abonne-toi pour accéder à toutes les vannes",
      });
    }

    const start = (query.page - 1) * query.limit;
    const pageIds = uniqueIds.slice(start, start + (isPremium ? query.limit : Math.max(0, effectiveLimit)));
    const jokes = pageIds.length
      ? await prisma.joke.findMany({ where: { id: { in: pageIds } }, orderBy })
      : [];

    return NextResponse.json({
      // « À toi de jouer » réservé à Premium : vidé pour tout autre compte (même règle que le HTML).
      jokes: isPremium ? jokes : jokes.map(sansExerciceVanne),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: accessibleTotal,
        totalPages: Math.ceil(accessibleTotal / query.limit),
      },
      limited: !isPremium,
      totalReal: total,
      ...((!isPremium && total > FREE_JOKE_LIMIT) ? { upgradeMessage: `${total - FREE_JOKE_LIMIT} vannes supplémentaires avec ${OFFRE_NOM}` } : {}),
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
