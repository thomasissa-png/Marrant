import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint public qui renvoie le nombre total de contenus actifs.
 * Utilisé par les composants marketing pour afficher des compteurs dynamiques
 * au lieu de nombres hardcodés.
 *
 * Réponse cachée 5 minutes côté client.
 */
export async function GET() {
  try {
    const [jokes, tips, videos] = await Promise.all([
      prisma.joke.count({ where: { isActive: true } }),
      prisma.tip.count({ where: { isActive: true } }),
      prisma.video.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json(
      { jokes, tips, videos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
