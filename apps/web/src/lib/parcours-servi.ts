import { prisma } from "@/lib/prisma";
import { redactParcoursForPlan, type ParcoursStepPayload } from "@/lib/parcours-preview";
import { isPremiumPlan } from "@/lib/parcours-access";
import { attachCatalogueLinks, withoutJokeTexts } from "@/lib/parcours-data";
import { resolveStepJokes } from "@/lib/parcours-vannes";

/**
 * Parcours servi à un compte (plan relu en base) : partagé par `api/parcours/by-slug/[slug]` et, s26 parcours tour 7 bis,
 * par la page `/parcours/[slug]` interrupteur ouvert (lecture serveur de l'abonné, même contenu que l'API).
 */
export type ServedPath = { steps: ParcoursStepPayload[] };

/** Plan lu en base (même contrôle que les favoris et la progression), pas dans le jwt. */
export async function readPlan(userId: string | undefined): Promise<string | null> {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? null;
}

export interface StepValidation {
  stepOrder: number;
  completedAt: Date;
}

/**
 * Dates de validation par étape (table `UserPathStepCompletion`, lot A s17) :
 * rythme doux (D2). Table absente (migration pas encore passée) = liste vide.
 */
export async function readStepValidations(userId: string, learningPathId: string): Promise<StepValidation[]> {
  try {
    return await prisma.userPathStepCompletion.findMany({
      where: { userId, learningPathId },
      select: { stepOrder: true, completedAt: true },
      orderBy: { completedAt: "asc" },
    });
  } catch {
    return [];
  }
}

/**
 * Vannes de l'étape (D4) : abonné Premium vérifié en base uniquement. Un
 * non-abonné ne reçoit jamais ni vannes, ni vidéos, ni quiz des étapes 2+.
 */
async function withStepJokes<P extends ServedPath>(path: P, plan: string | null): Promise<P> {
  if (!isPremiumPlan(plan)) return path;
  try {
    const jokesByStep = await resolveStepJokes(path.steps);
    return {
      ...path,
      steps: path.steps.map((s) => ({ ...s, jokes: jokesByStep.get(s.order) ?? [] })),
    };
  } catch {
    return path;
  }
}

/** Ce qui part au navigateur : aperçu pour un non-Premium, puis liens et vannes. */
export async function servePath<P extends ServedPath>(path: P, plan: string | null): Promise<P> {
  const redacted = redactParcoursForPlan(path, plan);
  return withoutJokeTexts(await withStepJokes(await attachCatalogueLinks(redacted), plan));
}
