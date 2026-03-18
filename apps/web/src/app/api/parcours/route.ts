import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Vérifier le plan de l'utilisateur
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Les parcours sont accessibles à tous les utilisateurs authentifiés (FREE + PREMIUM)
    // Le contenu détaillé est public (SEO), la progression nécessite juste d'être connecté

    const paths = await prisma.learningPath.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            tip: {
              select: { id: true, title: true, category: true, difficulty: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ paths });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
