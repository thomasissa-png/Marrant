/**
 * Étape à reprendre de l'abonné, lue en base (s24, lot D5) pour l'état 3 d'« Aujourd'hui » (4.4 : la
 * rafale est faite, « Reprendre » l'étape en cours ou « Commencer l'étape 1 »). Même règle et mêmes
 * lectures que `api/espace/caps` (lot D4) : `etapeAReprendre` de `lib/espace/quatre-semaines.ts`.
 */
import { prisma } from "@/lib/prisma";
import { etapeAReprendre, type EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { derniereValidation } from "@/lib/parcours-xp";

export async function lireEtapeAReprendre(userId: string): Promise<EtapeAReprendre | null> {
  const progressions = await prisma.userPathProgress.findMany({
    where: { userId },
    select: {
      completedSteps: true,
      completedAt: true,
      startedAt: true,
      learningPath: { select: { slug: true, stepCompletions: { where: { userId }, select: { completedAt: true } } } },
    },
  });
  return etapeAReprendre(
    progressions.map((p) => {
      const d = derniereValidation(p.learningPath.stepCompletions);
      return { slug: p.learningPath.slug, completedSteps: p.completedSteps, termine: p.completedAt !== null, derniere: d ? new Date(d) : null, startedAt: p.startedAt };
    }),
    PARCOURS_SEED_JSON,
  );
}
