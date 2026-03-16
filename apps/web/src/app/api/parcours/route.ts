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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (user?.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Abonnement requis pour accéder aux parcours", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

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
