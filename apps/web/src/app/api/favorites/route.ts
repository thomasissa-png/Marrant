import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addFavoriteSchema = z.object({
  contentType: z.enum(["JOKE", "TIP", "VIDEO"]),
  contentId: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    // TODO: Récupérer l'userId depuis la session
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: {
        joke: true,
        tip: true,
        video: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
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

    const favorite = await prisma.userFavorite.create({ data });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
