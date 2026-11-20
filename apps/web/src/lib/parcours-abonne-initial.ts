import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { isPremiumPlan } from "@/lib/parcours-access";
import { buildPathFromSeed, enrichPathWithSeed, findActivePath } from "@/lib/parcours-data";
import { readPlan, readStepValidations, servePath, type ServedPath } from "@/lib/parcours-servi";
import { FILTRE_DESTINATAIRE_RAPPEL } from "@/lib/rappels/rappel-parcours";
import type { AbonneInitial, PathData } from "@/components/parcours/parcours-types";

/**
 * s26 parcours, tour 7 bis : abonné de `/parcours/[slug]` lu côté serveur (interrupteur OUVERT seulement : l'appel lit la
 * session, ce qui rend la page dynamique ; fermé, la page ne l'appelle pas et reste prérendue). Mêmes données que les
 * trois lectures du navigateur (`api/parcours/by-slug`, `api/user/rappel-parcours`, `api/parcours/[id]/retour`) :
 * contenu complet, progression, dates de validation, invitation au rappel, retours d'exercice.
 * `null` : visiteur, compte sans abonnement, ou base indisponible (le navigateur lit alors comme avant).
 */
export async function lireAbonneParcours(slug: string): Promise<AbonneInitial | null> {
  // Hors try : la lecture de la session (en-têtes) doit pouvoir signaler le rendu dynamique à Next. Options d'auth importées
  // à l'appel : fermé, la page (et ses tests) ne charge pas `lib/auth` (adaptateur Prisma en module ES).
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  try {
    const plan = await readPlan(userId);
    if (!isPremiumPlan(plan)) return null;
    const dbPath = await findActivePath(slug);
    if (!dbPath) {
      const seed = buildPathFromSeed(slug);
      if (!seed) return null;
      const path = await servePath(seed as unknown as ServedPath, plan);
      return { userId, path: path as unknown as PathData, progress: null, stepValidations: [], rappelInvite: false, retours: {} };
    }
    const path = await servePath(enrichPathWithSeed(dbPath, slug) as unknown as ServedPath, plan);
    const [progression, eligible, preference, retours] = await Promise.all([
      prisma.userPathProgress.findUnique({ where: { userId_learningPathId: { userId, learningPathId: dbPath.id } } }),
      prisma.user.count({ where: { id: userId, ...FILTRE_DESTINATAIRE_RAPPEL } }),
      prisma.parcoursReminderPreference.findUnique({ where: { userId }, select: { enabled: true } }),
      prisma.userPathStepFeedback.findMany({
        where: { userId, learningPathId: dbPath.id },
        select: { stepOrder: true, retour: true },
        orderBy: { stepOrder: "asc" },
      }),
    ]);
    const validations = progression ? await readStepValidations(userId, dbPath.id) : [];
    return {
      userId,
      path: path as unknown as PathData,
      progress: progression
        ? {
            completedSteps: progression.completedSteps,
            currentStep: progression.currentStep,
            completedAt: progression.completedAt?.toISOString() ?? null,
            startedAt: progression.startedAt.toISOString(),
          }
        : null,
      stepValidations: validations.map((v) => ({ stepOrder: v.stepOrder, completedAt: v.completedAt.toISOString() })),
      rappelInvite: eligible > 0 && preference?.enabled !== true,
      retours: Object.fromEntries(retours.map((r) => [r.stepOrder, r.retour])),
    };
  } catch {
    return null;
  }
}
