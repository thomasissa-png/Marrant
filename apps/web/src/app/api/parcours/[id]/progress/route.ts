import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { canValidateParcoursStep } from "@/lib/parcours-access";
import { CLES_PARCOURS, recordAdminAlert } from "@/lib/admin-alerts";
import {
  calculateLevel,
  getPathXpTotal,
  getStepXpFromSeed,
  nextRecommendedAt,
  nextStreak,
  PATH_COMPLETION_BONUS_XP,
} from "@/lib/progression";
import { TEXTES_PROGRESSION_API as T } from "@/config/textes/parcours-emails";

/**
 * Progression d'un parcours (s17, lot A).
 *
 * POST valide une étape (abonné Premium). Garanties :
 *  - double validation impossible (FS-08) : la ligne `UserPathStepCompletion`
 *    (unique userId + parcours + étape) est insérée en `ON CONFLICT DO NOTHING`
 *    AVANT tout XP ; un 2e appel simultané attend le 1er puis ne compte rien ;
 *  - ordre conseillé pour l'abonné (QA-08) : étape refusée (409, `code: "ordre"`)
 *    tant qu'une étape précédente n'est pas validée ;
 *  - la fiche renvoyée est celle d'APRÈS la date de fin (UX-02) ; XP de fin
 *    compris dans `xpGained` et dans `pathXpTotal` (UX-05) ;
 *  - niveau recalculé et série de jours comptée sur la pratique (FS-07, D3) ;
 *  - limite de 10 validations par minute partagée entre isolats Workers (FS-13 e) ;
 *  - erreur serveur → alerte `parcours-progress-erreur` (data-analyst §7).
 * Erreurs : `{ error, code }` avec code ∈ auth | corps | etape | introuvable |
 * refus | limite | ordre | serveur (le lot B mappe `code` vers `parcours-erreur`).
 */

type ProgressRow = {
  id: string;
  userId: string;
  learningPathId: string;
  currentStep: number;
  completedSteps: number[];
  startedAt: Date;
  completedAt: Date | null;
};

const bodySchema = z.object({ stepOrder: z.number().int().min(1).max(100) });

function erreur(status: number, code: string, error: string, extra: Record<string, unknown> = {}, headers?: HeadersInit) {
  return NextResponse.json({ error, code, ...extra }, { status, headers });
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ progress: null, stepCompletions: [] });
    }
    const userId = (session.user as { id: string }).id;

    const path = await prisma.learningPath.findUnique({
      where: { id: params.id, isActive: true },
      select: { id: true, slug: true, steps: { select: { order: true } } },
    });
    if (!path) return erreur(404, "introuvable", T.parcoursIntrouvable);

    const [progress, completions] = await Promise.all([
      prisma.userPathProgress.findUnique({
        where: { userId_learningPathId: { userId, learningPathId: params.id } },
      }),
      prisma.userPathStepCompletion.findMany({
        where: { userId, learningPathId: params.id },
        select: { stepOrder: true, completedAt: true },
        orderBy: { completedAt: "asc" },
      }),
    ]);
    const last = completions[completions.length - 1];

    return NextResponse.json({
      progress,
      stepCompletions: completions.map((c) => ({ stepOrder: c.stepOrder, completedAt: c.completedAt.toISOString() })),
      nextRecommendedAt: last && !progress?.completedAt ? nextRecommendedAt(last.completedAt) : null,
      pathXpTotal: getPathXpTotal(path.slug, path.steps.map((s) => s.order)),
    });
  } catch (error) {
    console.error("[API /parcours/progress GET]", error);
    return erreur(500, "serveur", T.serveur);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return erreur(401, "auth", T.authRequise);
    }
    const userId = (session.user as { id: string }).id;

    const rl = await sharedRateLimit("parcours-progress", userId, { maxRequests: 10, windowMs: 60_000 });
    if (!rl.allowed) {
      return erreur(429, "limite", T.limite, {}, { "Retry-After": String(retryAfterSeconds(rl)) });
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return erreur(400, "corps", T.corpsInvalide);
    }
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) return erreur(400, "corps", T.corpsInvalide);
    const { stepOrder } = parsed.data;

    // Valider une étape = abonnés Premium (s15 §1.1). Plan lu en base, pas dans le jwt.
    const owner = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (!canValidateParcoursStep(owner?.plan)) {
      return erreur(403, "refus", T.reserveePremium);
    }

    const now = new Date();
    const result = await prisma.$transaction(async (tx) => {
      const path = await tx.learningPath.findUnique({
        where: { id: params.id, isActive: true },
        select: { id: true, slug: true, steps: { select: { order: true } } },
      });
      if (!path) return { echec: { status: 404, code: "introuvable", error: T.parcoursIntrouvable, extra: {} } } as const;

      const orders = path.steps.map((s) => s.order).sort((a, b) => a - b);
      if (!orders.includes(stepOrder)) return { echec: { status: 400, code: "etape", error: T.etapeInvalide, extra: {} } } as const;
      const pathXpTotal = getPathXpTotal(path.slug, orders);
      const where = { userId_learningPathId: { userId, learningPathId: params.id } };

      const dejaFait = async (row: ProgressRow | null) => {
        const u = await tx.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streak: true } });
        return {
          progress: row,
          xpGained: 0,
          stepXp: 0,
          bonusXp: 0,
          pathCompleted: !!row?.completedAt,
          alreadyCompleted: true,
          user: { xp: u?.xp ?? 0, level: u?.level ?? "NOVICE", levelChanged: false, streak: u?.streak ?? 0 },
          pathXpTotal,
          nextRecommendedAt: null,
        };
      };

      const existing = await tx.userPathProgress.findUnique({ where });
      const done = new Set(existing?.completedSteps ?? []);
      if (done.has(stepOrder)) return dejaFait(existing);

      const manquante = orders.find((o) => o < stepOrder && !done.has(o));
      if (manquante !== undefined) {
        return { echec: { status: 409, code: "ordre", error: T.ordre(manquante), extra: { etapeAttendue: manquante } } } as const;
      }

      // Verrou d'unicité : un appel simultané sur la même étape attend ici puis insère 0 ligne.
      const ins = await tx.userPathStepCompletion.createMany({
        data: [{ userId, learningPathId: params.id, stepOrder, completedAt: now }],
        skipDuplicates: true,
      });
      if (ins.count === 0) return dejaFait(await tx.userPathProgress.findUnique({ where }));

      let progress: ProgressRow = await tx.userPathProgress.upsert({
        where,
        create: { userId, learningPathId: params.id, currentStep: stepOrder, completedSteps: [stepOrder] },
        update: { currentStep: stepOrder, completedSteps: { push: stepOrder } },
      });

      const distinctes = new Set(progress.completedSteps.filter((o) => orders.includes(o)));
      let bonusXp = 0;
      if (distinctes.size >= orders.length && !progress.completedAt) {
        progress = await tx.userPathProgress.update({ where: { id: progress.id }, data: { completedAt: now } });
        bonusXp = PATH_COMPLETION_BONUS_XP;
      }

      const stepXp = getStepXpFromSeed(path.slug, stepOrder);
      const xpGained = stepXp + bonusXp;
      const before = await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: xpGained } },
        select: { xp: true, level: true, streak: true, lastPracticeAt: true },
      });
      const level = calculateLevel(before.xp);
      const streak = nextStreak(before.streak, before.lastPracticeAt, now);
      await tx.user.update({
        where: { id: userId },
        data: { level, streak, lastPracticeAt: now, lastActiveAt: now },
      });

      return {
        progress,
        xpGained,
        stepXp,
        bonusXp,
        pathCompleted: !!progress.completedAt,
        alreadyCompleted: false,
        user: { xp: before.xp, level, levelChanged: level !== before.level, streak },
        pathXpTotal,
        nextRecommendedAt: progress.completedAt ? null : nextRecommendedAt(now),
      };
    });

    if ("echec" in result && result.echec) {
      const { status, code, error, extra } = result.echec;
      return erreur(status, code, error, extra);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /parcours/progress POST]", error);
    const message = error instanceof Error ? error.message : String(error);
    // Awaité avant la réponse (zéro fire-and-forget sous Workers). Jamais d'identifiant.
    await recordAdminAlert({
      cle: CLES_PARCOURS.progressErreur,
      sujet: "La validation d'une étape a échoué côté serveur",
      html: `<p>Parcours : ${params.id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40)}</p><p>Erreur : ${message.replace(/</g, "&lt;").slice(0, 400)}</p><p>À faire : lire le journal du Worker et corriger avant le prochain abonné.</p>`,
    });
    return erreur(500, "serveur", T.serveur);
  }
}
