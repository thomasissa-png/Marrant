import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { isPremiumPlan } from "@/lib/parcours-access";
import { recordPractice, type PracticeDb } from "@/lib/progression";
import { TEXTES_PROGRESSION_API as T } from "@/config/textes/parcours-emails";

/**
 * POST /api/parcours/[id]/quiz (s17, D3) : le quiz d'une étape est terminé.
 * Compte une PRATIQUE pour la série de jours (abonné Premium), sans XP ni
 * écriture de réponse (aucune réponse de quiz stockée, avis @legal C13).
 * Corps : `{ stepOrder: number }`. Réponse : `{ streak }`.
 * Visiteur : 401 ; non-Premium : 403 (le lot B n'appelle la route que pour un Premium).
 */
const bodySchema = z.object({ stepOrder: z.number().int().min(1).max(100) });

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: T.authRequise, code: "auth" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    const rl = await sharedRateLimit("parcours-quiz", userId, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: T.limite, code: "limite" },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl)) } },
      );
    }

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: T.corpsInvalide, code: "corps" }, { status: 400 });

    const owner = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (!isPremiumPlan(owner?.plan)) {
      return NextResponse.json({ error: T.reserveePremium, code: "refus" }, { status: 403 });
    }

    const step = await prisma.learningPathStep.findFirst({
      where: { learningPathId: params.id, order: parsed.data.stepOrder, learningPath: { isActive: true } },
      select: { id: true },
    });
    if (!step) return NextResponse.json({ error: T.etapeInvalide, code: "etape" }, { status: 400 });

    const streak = await recordPractice(prisma as unknown as PracticeDb, userId);
    return NextResponse.json({ streak });
  } catch (error) {
    console.error("[API /parcours/quiz POST]", error);
    return NextResponse.json({ error: T.serveur, code: "serveur" }, { status: 500 });
  }
}
