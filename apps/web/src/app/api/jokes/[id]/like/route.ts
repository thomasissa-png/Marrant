import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Génère un compteur de base déterministe à partir du jokeId.
 * Donne un social proof réaliste (likes 3-20, dislikes 0-3).
 */
function baseCountsForJoke(jokeId: string): { baseLikes: number; baseDislikes: number } {
  let hash = 0;
  for (let i = 0; i < jokeId.length; i++) {
    hash = (hash * 31 + jokeId.charCodeAt(i)) | 0;
  }
  const absHash = Math.abs(hash);
  const baseLikes = 3 + (absHash % 18); // 3–20
  const baseDislikes = (absHash >> 5) % 4; // 0–3
  return { baseLikes, baseDislikes };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const jokeId = params.id;
    const { isLike } = await request.json();

    const existing = await prisma.jokeLike.findUnique({
      where: { userId_jokeId: { userId, jokeId } },
    });

    if (existing) {
      if (existing.isLike === isLike) {
        // Toggle off
        await prisma.jokeLike.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ action: "removed" });
      } else {
        // Switch reaction
        await prisma.jokeLike.update({
          where: { id: existing.id },
          data: { isLike },
        });
        return NextResponse.json({ action: "updated", isLike });
      }
    }

    await prisma.jokeLike.create({
      data: { userId, jokeId, isLike },
    });

    return NextResponse.json({ action: "created", isLike });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jokeId = params.id;

    const [likes, dislikes] = await Promise.all([
      prisma.jokeLike.count({ where: { jokeId, isLike: true } }),
      prisma.jokeLike.count({ where: { jokeId, isLike: false } }),
    ]);

    // Check if current user has liked
    let userReaction: boolean | null = null;
    const session = await getServerSession(authOptions);
    if (session?.user && "id" in session.user) {
      const userId = (session.user as { id: string }).id;
      const existing = await prisma.jokeLike.findUnique({
        where: { userId_jokeId: { userId, jokeId } },
      });
      if (existing) userReaction = existing.isLike;
    }

    const { baseLikes, baseDislikes } = baseCountsForJoke(jokeId);
    return NextResponse.json({
      likes: likes + baseLikes,
      dislikes: dislikes + baseDislikes,
      userReaction,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
