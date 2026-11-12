import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redactParcoursForPlan, type ParcoursStepPayload } from "@/lib/parcours-preview";
import { isPremiumPlan } from "@/lib/parcours-access";
import {
  attachCatalogueLinks,
  buildPathFromSeed,
  withoutJokeTexts,
  enrichPathWithSeed,
  findActivePath,
} from "@/lib/parcours-data";
import { resolveStepJokes } from "@/lib/parcours-vannes";

type ServedPath = { steps: ParcoursStepPayload[] };

/** Contenu propre à chaque visiteur (plan, progression) : jamais en cache partagé. */
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

/** Plan lu en base (même contrôle que les favoris et la progression), pas dans le jwt. */
async function readPlan(userId: string | undefined): Promise<string | null> {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? null;
}

interface StepValidation {
  stepOrder: number;
  completedAt: Date;
}

/**
 * Dates de validation par étape (table `UserPathStepCompletion`, lot A s17) :
 * rythme doux (D2). Table absente (migration pas encore passée) = liste vide.
 */
async function readStepValidations(userId: string, learningPathId: string): Promise<StepValidation[]> {
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
async function servePath<P extends ServedPath>(path: P, plan: string | null): Promise<P> {
  const redacted = redactParcoursForPlan(path, plan);
  return withoutJokeTexts(await withStepJokes(await attachCatalogueLinks(redacted), plan));
}

async function seedFallbackResponse(slug: string, plan: string | null = null) {
  const fallback = buildPathFromSeed(slug);
  if (!fallback) return null;
  return NextResponse.json(
    { path: await servePath(fallback, plan), userProgress: null, stepValidations: [] },
    { headers: PRIVATE_HEADERS },
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const path = await findActivePath(params.slug);
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const plan = await readPlan(userId);

    if (!path) {
      const fallback = await seedFallbackResponse(params.slug, plan);
      if (fallback) return fallback;
      return NextResponse.json({ error: "Parcours introuvable" }, { status: 404 });
    }

    const enrichedPath = enrichPathWithSeed(path, params.slug);

    let userProgress = null;
    let stepValidations: StepValidation[] = [];
    if (userId) {
      userProgress = await prisma.userPathProgress.findUnique({
        where: { userId_learningPathId: { userId, learningPathId: path.id } },
      });
      if (userProgress) stepValidations = await readStepValidations(userId, path.id);
    }

    // Étapes 2+ : contenu complet pour un Premium, aperçu sinon (décision 03/10, D1 s17).
    const servedPath = await servePath(enrichedPath as unknown as ServedPath, plan);

    return NextResponse.json(
      { path: servedPath, userProgress, stepValidations },
      { headers: PRIVATE_HEADERS },
    );
  } catch (error) {
    console.error("[API /parcours/by-slug]", error);
    // Repli seed sur erreur base aussi (aperçu : plan inconnu)
    const fallback = await seedFallbackResponse(params.slug);
    if (fallback) return fallback;
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
