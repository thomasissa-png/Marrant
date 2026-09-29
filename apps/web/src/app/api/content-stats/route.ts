import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { countDistinctContent } from "@/lib/content-stats-server";

/**
 * Endpoint public qui renvoie le nombre total de contenus actifs.
 * Utilisé par les composants marketing pour afficher des compteurs dynamiques
 * au lieu de nombres hardcodés.
 *
 * Réponse cachée 5 minutes côté client.
 */
export async function GET() {
  try {
    // Vannes et conseils : contenus distincts (sans doublons), comme les listes affichées.
    const [{ jokes, tips, videos }, members] = await Promise.all([
      countDistinctContent(),
      prisma.user.count(),
    ]);

    return NextResponse.json(
      { jokes, tips, videos, members },
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
