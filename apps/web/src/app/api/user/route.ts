import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { deleteAccount, StripeCancelError } from "@/lib/account";
import { MOT_CONFIRMATION_SUPPRESSION, TEXTES_API, TEXTES_SUPPRESSION } from "@/config/textes/compte";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const [user, pathProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          level: true,
          xp: true,
          streak: true,
          lastActiveAt: true,
          _count: {
            select: {
              favorites: true,
              jokeLikes: { where: { isLike: true } },
              pathProgress: { where: { completedAt: { not: null } } },
            },
          },
        },
      }),
      prisma.userPathProgress.findMany({
        where: { userId },
        select: { completedSteps: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const tipsCompleted = pathProgress.reduce(
      (sum, p) => sum + p.completedSteps.length,
      0
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        lastActiveAt: user.lastActiveAt,
        stats: {
          jokesRead: user._count.jokeLikes,
          tipsCompleted,
          videosWatched: 0,
          totalFavorites: user._count.favorites,
          pathsCompleted: user._count.pathProgress,
        },
      },
    });
  } catch (error) {
    console.error("[API /user]", error);
    return NextResponse.json({ error: TEXTES_API.erreurServeur }, { status: 500 });
  }
}

const deleteSchema = z.object({
  confirmation: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .refine((v) => v === MOT_CONFIRMATION_SUPPRESSION),
});

/** Cookies de session NextAuth (http et https) effacés avec la réponse. */
const SESSION_COOKIES = ["next-auth.session-token", "__Secure-next-auth.session-token"];

/**
 * DELETE /api/user : suppression du compte (s16, reco 5).
 * Session requise + mot de confirmation retapé (revérifié ici). L'abonnement
 * Stripe est résilié d'abord ; si Stripe échoue, RIEN n'est supprimé.
 */
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: TEXTES_API.nonConnecte }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!deleteSchema.safeParse(body).success) {
    return NextResponse.json({ error: TEXTES_SUPPRESSION.motIncorrect }, { status: 400 });
  }

  try {
    const result = await deleteAccount(userId);
    console.log(`[API /user DELETE] Compte ${userId} supprimé=${result.deleted}, abonnements Stripe résiliés=${result.stripeCanceled}`);
    const res = NextResponse.json({ success: true });
    for (const name of SESSION_COOKIES) {
      res.cookies.set(name, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax", secure: name.startsWith("__Secure-") });
    }
    return res;
  } catch (error) {
    console.error(`[API /user DELETE] Échec pour ${userId}:`, error);
    if (error instanceof StripeCancelError) {
      return NextResponse.json({ error: TEXTES_SUPPRESSION.echecStripe }, { status: 502 });
    }
    return NextResponse.json({ error: TEXTES_SUPPRESSION.echec }, { status: 500 });
  }
}
