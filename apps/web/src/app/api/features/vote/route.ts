import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_FEATURES = [
  "whatsapp",
  "nouveaux-parcours",
  "communaute",
  "surprises",
];

/**
 * Compteurs de base déterministes pour le social proof.
 */
const BASE_VOTES: Record<string, number> = {
  whatsapp: 47,
  "nouveaux-parcours": 34,
  communaute: 62,
  surprises: 21,
};

/**
 * POST — toggle un vote sur une fonctionnalité
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { featureSlug } = await request.json();

    if (!VALID_FEATURES.includes(featureSlug)) {
      return NextResponse.json({ error: "Fonctionnalité inconnue" }, { status: 400 });
    }

    const existing = await prisma.featureVote.findUnique({
      where: { userId_featureSlug: { userId, featureSlug } },
    });

    if (existing) {
      await prisma.featureVote.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    await prisma.featureVote.create({ data: { userId, featureSlug } });
    return NextResponse.json({ action: "created" });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * GET — récupère les compteurs de votes et l'état du user connecté
 */
export async function GET() {
  try {
    // Compter les votes par feature
    const counts = await prisma.featureVote.groupBy({
      by: ["featureSlug"],
      _count: { featureSlug: true },
    });

    const countMap: Record<string, number> = {};
    for (const f of VALID_FEATURES) {
      const real = counts.find((c) => c.featureSlug === f)?._count.featureSlug ?? 0;
      countMap[f] = real + (BASE_VOTES[f] ?? 0);
    }

    // Vérifier les votes du user connecté
    let userVotes: string[] = [];
    const session = await getServerSession(authOptions);
    if (session?.user && "id" in session.user) {
      const userId = (session.user as { id: string }).id;
      const votes = await prisma.featureVote.findMany({
        where: { userId },
        select: { featureSlug: true },
      });
      userVotes = votes.map((v) => v.featureSlug);
    }

    return NextResponse.json({ counts: countMap, userVotes });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
