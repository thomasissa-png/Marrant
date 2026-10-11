/**
 * Plan de l'utilisateur connecté, lu en base (même contrôle que les favoris,
 * la progression et /api/parcours/by-slug), jamais dans le jwt. En cas
 * d'erreur ou de visiteur anonyme : null, donc contenu en aperçu.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function readSessionPlan(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return null;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    return user?.plan ?? null;
  } catch (error) {
    console.error("[session-plan] lecture du plan impossible :", error);
    return null;
  }
}
