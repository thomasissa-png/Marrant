/**
 * Données d'un parcours : fusion base + seed en un seul endroit (FS-13 c),
 * utilisée par la page `/parcours/[slug]` (ISR) et l'API `/api/parcours/by-slug`.
 * Le seed apporte le contenu pédagogique (module, quiz, vidéos, vannes), la base
 * l'identifiant réel (suivi de progression) et le conseil relu.
 */
import { prisma } from "@/lib/prisma";
import { buildTipSlug, buildVideoSlug } from "@/lib/catalogue-slug";
import { PREMIUM_PARCOURS } from "@/config/premium";
import type { ParcoursStepPayload } from "@/lib/parcours-preview";
import parcoursSeed from "../../../../docs/content/parcours-seed.json";

export interface SeedVideo {
  youtubeId: string;
  artist: string;
  title: string;
  why: string;
}

export interface SeedQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  /** Explication de la bonne réponse (à écrire par @copywriter, D5). */
  explanation?: string;
}

export interface SeedStep {
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
  /** D4 (contrat s17) : 5 textes `content` EXACTS de vannes actives ; prioritaire sur `jokeIds`. */
  jokeContents?: string[];
  videos?: SeedVideo[];
  quiz?: SeedQuizQuestion[];
}

export interface SeedParcours {
  slug: string;
  title: string;
  description: string;
  duration: string;
  timePerWeek?: string;
  difficulty: string;
  difficultyLabel?: string;
  icon: string;
  order: number;
  nextParcours?: string;
  nextParcoursReason?: string;
  personaTagline?: string;
  testimonial?: string;
  steps: SeedStep[];
}

export const PARCOURS_SEED = parcoursSeed as SeedParcours[];

export function getSeedForSlug(slug: string): SeedParcours | undefined {
  return PARCOURS_SEED.find((p) => p.slug === slug);
}

/** Rythme affiché (« 15 min/semaine ») : config de l'offre, sinon seed. */
export function timePerWeekFor(slug: string): string | null {
  return (
    PREMIUM_PARCOURS.find((p) => p.slug === slug)?.timePerWeek ??
    getSeedForSlug(slug)?.timePerWeek ??
    null
  );
}

function seedStepContent(s: SeedStep) {
  return {
    moduleTitle: s.moduleTitle,
    moduleDetail: s.moduleDetail,
    moduleFormat: s.moduleFormat,
    moduleXp: s.moduleXp,
    why: s.why,
    free: s.free,
    jokeIds: s.jokeIds ?? [],
    jokeContents: s.jokeContents ?? [],
    videos: s.videos ?? [],
    quiz: s.quiz ?? [],
  };
}

/**
 * Textes des vannes de l'étape : jamais envoyés au navigateur. L'abonné reçoit
 * les vannes résolues (`jokes`), tout le monde seulement leur nombre (`jokeCount`).
 */
export function withoutJokeTexts<P extends { steps: ParcoursStepPayload[] }>(path: P): P {
  return {
    ...path,
    steps: path.steps.map((step) => {
      const { jokeContents, ...rest } = step as ParcoursStepPayload & { jokeContents?: string[] };
      const jokeCount = step.locked ? 0 : jokeContents?.length || step.jokeIds?.length || 0;
      return { ...rest, jokeCount };
    }),
  };
}

function seedPathExtras(seed: SeedParcours) {
  return {
    difficultyLabel: seed.difficultyLabel ?? null,
    nextParcours: seed.nextParcours ?? null,
    nextParcoursReason: seed.nextParcoursReason ?? null,
    personaTagline: seed.personaTagline ?? null,
    testimonial: seed.testimonial ?? null,
    timePerWeek: timePerWeekFor(seed.slug),
  };
}

/** Parcours reconstruit depuis le seed seul (base absente ou en panne). */
export function buildPathFromSeed(slug: string) {
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
      ...seedStepContent(s),
    })),
    ...seedPathExtras(seed),
  };
}

/** Enrichit un parcours lu en base avec le seed (correspondance par numéro d'étape). */
export function enrichPathWithSeed<P extends { steps: Array<{ order: number }> }>(
  path: P,
  slug: string,
): P {
  const seed = getSeedForSlug(slug);
  if (!seed) return path;
  const seedStepByWeek = new Map(seed.steps.map((s) => [s.week, s]));
  return {
    ...path,
    steps: path.steps.map((step) => {
      const seedStep = seedStepByWeek.get(step.order);
      return seedStep ? { ...step, ...seedStepContent(seedStep) } : step;
    }),
    ...seedPathExtras(seed),
  };
}

/** Parcours actif lu en base, étapes triées, conseil compris. */
export function findActivePath(slug: string) {
  return prisma.learningPath.findUnique({
    where: { slug, isActive: true },
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
}

type LinkableStep = ParcoursStepPayload & { tipHref?: string };

/**
 * Liens vers les fiches conseil et vidéo citées (SEO-05), sur les étapes
 * servies en entier seulement : un aperçu verrouillé n'a ni vidéo ni lien.
 * Vidéos actives uniquement ; erreur base = pas de lien, jamais de panne.
 */
export async function attachCatalogueLinks<P extends { steps: ParcoursStepPayload[] }>(
  path: P,
): Promise<P> {
  const open = path.steps.filter((s) => !s.locked);
  const youtubeIds = open.flatMap((s) =>
    ((s.videos ?? []) as SeedVideo[]).map((v) => v.youtubeId),
  );
  let videoHref = new Map<string, string>();
  if (youtubeIds.length > 0) {
    try {
      const rows = await prisma.video.findMany({
        where: { youtubeId: { in: youtubeIds }, isActive: true },
        select: { id: true, title: true, youtubeId: true },
      });
      videoHref = new Map(rows.map((r) => [r.youtubeId, `/videos/${buildVideoSlug(r)}`]));
    } catch {
      // Base indisponible : les vidéos restent lisibles, sans lien vers la fiche.
    }
  }
  return {
    ...path,
    steps: path.steps.map((step): LinkableStep => {
      if (step.locked) return step;
      const isDbTip = !!step.tip?.id && !step.tip.id.startsWith("seed-");
      return {
        ...step,
        ...(isDbTip && { tipHref: `/conseils/${buildTipSlug(step.tip)}` }),
        videos: ((step.videos ?? []) as SeedVideo[]).map((v) => {
          const href = videoHref.get(v.youtubeId);
          return href ? { ...v, href } : v;
        }),
      };
    }),
  };
}
