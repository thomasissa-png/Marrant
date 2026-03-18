import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import parcoursSeed from "../../../../../../../../docs/content/parcours-seed.json";

interface SeedStep {
  week: number;
  tipTitle: string;
  dayNumber: number;
  why: string;
  moduleTitle: string;
  moduleDetail: string;
  moduleFormat: string;
  moduleXp: number;
  free: boolean;
  jokeIds?: number[];
  videos?: { youtubeId: string; artist: string; title: string; why: string }[];
  quiz?: { question: string; options: string[]; correctIndex: number }[];
}

interface SeedParcours {
  slug: string;
  title: string;
  description: string;
  duration: string;
  timePerWeek?: string;
  difficulty: string;
  difficultyLabel?: string;
  icon: string;
  order: number;
  persona?: string;
  personaTagline?: string;
  testimonial?: string;
  nextParcours?: string;
  nextParcoursReason?: string;
  steps: SeedStep[];
}

function getSeedForSlug(slug: string): SeedParcours | undefined {
  return (parcoursSeed as SeedParcours[]).find((p) => p.slug === slug);
}

function buildFallbackFromSeed(slug: string) {
  const seed = getSeedForSlug(slug);
  if (!seed) return null;

  return {
    id: `seed-${seed.slug}`,
    title: seed.title,
    description: seed.description,
    slug: seed.slug,
    duration: seed.duration,
    difficulty: seed.difficulty,
    icon: seed.icon,
    steps: seed.steps.map((s, i) => ({
      id: `seed-step-${i + 1}`,
      order: i + 1,
      dayNumber: s.dayNumber,
      tip: {
        id: `seed-tip-${i + 1}`,
        title: s.moduleTitle,
        content: s.moduleDetail,
        category: "GENERAL",
        difficulty: seed.difficulty,
        example: "",
        exercise: "",
      },
      // Rich content from seed
      moduleTitle: s.moduleTitle,
      moduleDetail: s.moduleDetail,
      moduleFormat: s.moduleFormat,
      moduleXp: s.moduleXp,
      why: s.why,
      free: s.free,
      jokeIds: s.jokeIds ?? [],
      videos: s.videos ?? [],
      quiz: s.quiz ?? [],
    })),
    // Parcours-level enrichments
    nextParcours: seed.nextParcours ?? null,
    nextParcoursReason: seed.nextParcoursReason ?? null,
    personaTagline: seed.personaTagline ?? null,
    testimonial: seed.testimonial ?? null,
  };
}

function enrichPathWithSeed(path: Record<string, unknown>, slug: string) {
  const seed = getSeedForSlug(slug);
  if (!seed) return path;

  const steps = path.steps as Array<Record<string, unknown>>;
  // Build a map of seed steps by week for reliable matching (not by index)
  const seedStepByWeek = new Map(seed.steps.map((s) => [s.week, s]));
  const enrichedSteps = steps.map((step) => {
    const stepOrder = step.order as number;
    const seedStep = seedStepByWeek.get(stepOrder);
    if (!seedStep) return step;
    return {
      ...step,
      moduleTitle: seedStep.moduleTitle,
      moduleDetail: seedStep.moduleDetail,
      moduleFormat: seedStep.moduleFormat,
      moduleXp: seedStep.moduleXp,
      why: seedStep.why,
      free: seedStep.free,
      jokeIds: seedStep.jokeIds ?? [],
      videos: seedStep.videos ?? [],
      quiz: seedStep.quiz ?? [],
    };
  });

  return {
    ...path,
    steps: enrichedSteps,
    nextParcours: seed.nextParcours ?? null,
    nextParcoursReason: seed.nextParcoursReason ?? null,
    personaTagline: seed.personaTagline ?? null,
    testimonial: seed.testimonial ?? null,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const path = await prisma.learningPath.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            tip: {
              select: {
                id: true,
                title: true,
                content: true,
                category: true,
                difficulty: true,
                example: true,
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!path) {
      // Fallback to seed data if parcours not in DB
      const fallback = buildFallbackFromSeed(params.slug);
      if (fallback) {
        return NextResponse.json({ path: fallback, userProgress: null });
      }
      return NextResponse.json(
        { error: "Parcours introuvable" },
        { status: 404 }
      );
    }

    // Enrich DB path with seed data (vannes, videos, quiz, etc.)
    const enrichedPath = enrichPathWithSeed(
      path as unknown as Record<string, unknown>,
      params.slug
    );

    // Fetch user progress if authenticated
    let userProgress = null;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (userId) {
      userProgress = await prisma.userPathProgress.findUnique({
        where: {
          userId_learningPathId: { userId, learningPathId: path.id },
        },
      });
    }

    return NextResponse.json({ path: enrichedPath, userProgress });
  } catch (error) {
    console.error("[API /parcours/by-slug]", error);
    // Fallback to seed data on DB error too
    const fallback = buildFallbackFromSeed(params.slug);
    if (fallback) {
      return NextResponse.json({ path: fallback, userProgress: null });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
