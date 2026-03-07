import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
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
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
