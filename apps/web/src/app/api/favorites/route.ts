import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { sansExerciceConseil, sansExerciceVanne, sansExerciceVideo } from "@/lib/champs-premium";

const addFavoriteSchema = z.object({
  contentType: z.enum(["JOKE", "TIP", "VIDEO"]),
  contentId: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Plan relu en base (jamais la session) : les favoris restent lisibles après une résiliation,
    // mais l'exercice des fiches (`lib/champs-premium.ts`) n'est envoyé qu'à un compte Premium.
    const [user, favorites] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
      prisma.userFavorite.findMany({
        where: { userId },
        include: {
          joke: true,
          tip: true,
          video: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    const isPremium = user?.plan === "PREMIUM";

    return NextResponse.json(
      {
        favorites: isPremium
          ? favorites
          : favorites.map((f) => ({
              ...f,
              joke: f.joke && sansExerciceVanne(f.joke),
              tip: f.tip && sansExerciceConseil(f.tip),
              video: f.video && sansExerciceVideo(f.video),
            })),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[API /favorites GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Favoris réservés aux Premium
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    if (user?.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Les favoris sont réservés aux membres Premium" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { contentType, contentId } = addFavoriteSchema.parse(body);

    const data = {
      userId,
      contentType,
      ...(contentType === "JOKE" && { jokeId: contentId }),
      ...(contentType === "TIP" && { tipId: contentId }),
      ...(contentType === "VIDEO" && { videoId: contentId }),
    };

    const favorite = await prisma.userFavorite.create({
      data,
      include: {
        joke: true,
        tip: true,
        video: true,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    // Doublon favori — Prisma unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ce contenu est déjà dans tes favoris" },
        { status: 409 }
      );
    }
    console.error("[API /favorites POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
