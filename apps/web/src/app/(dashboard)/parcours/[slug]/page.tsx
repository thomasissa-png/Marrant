// Stratégie de rendu : ISR + SSR fallback.
// - Les 3 parcours canoniques (machine-a-cafe, repartie, confiance) ont un
//   generateStaticParams → rendu statique au build, revalidé chaque heure.
// - Les parcours DB ajoutés dynamiquement passent en SSR (dynamicParams: true).
// - Objectif SEO : Googlebot / Bingbot doivent recevoir le contenu du parcours
//   (titre, description, étapes) dans le HTML initial, pas seulement header/footer.
//   L'interactivité (progression, quiz, complétion) reste côté client.
import type { Metadata } from "next";
import { fitDescription, fitTitle, DEFAULT_OG_IMAGE } from "@/lib/seo-meta";
import { notFound } from "next/navigation";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";
import { prisma } from "@/lib/prisma";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/components/seo/json-ld";
import parcoursSeed from "../../../../../../../docs/content/parcours-seed.json";

// Revalide 1x/h — les steps changent rarement, l'important c'est le SSR sur les bots.
export const revalidate = 3600;
export const dynamicParams = true;

const PARCOURS_META: Record<
  string,
  { name: string; title: string; description: string; duration: string; difficulty: string; stepsCount: number }
> = {
  "machine-a-cafe": {
    // name = nom visible (H1, fil d'Ariane, Course) ; title = balise <title> SEO.
    name: "Parcours Machine à Café",
    title: "Drôle au bureau : parcours Machine à Café",
    description:
      "Des vannes et des anecdotes à ressortir à la machine à café, en réunion ou en afterwork : 3 semaines à 15 min/semaine pour devenir le collègue qu'on écoute.",
    duration: "3 semaines",
    difficulty: "DEBUTANT",
    stepsCount: 3,
  },
  repartie: {
    // name = nom visible (H1, fil d'Ariane, Course) ; title = balise <title> SEO.
    name: "Parcours Répartie",
    title: "Avoir de la répartie : le parcours guidé",
    description:
      "Développe ta répartie en 4 semaines avec des exercices concrets et progressifs, pour arrêter de rester muet quand on te chambre en soirée ou entre potes.",
    duration: "4 semaines",
    difficulty: "INTERMEDIAIRE",
    stepsCount: 4,
  },
  confiance: {
    // name = nom visible (H1, fil d'Ariane, Course) ; title = balise <title> SEO.
    name: "Parcours Confiance",
    title: "Retrouver confiance grâce à l'humour",
    description:
      "6 semaines pour retrouver confiance en soi grâce à l'humour, à ton rythme et sans pression : on remet de la légèreté dans tes échanges, une étape à la fois.",
    duration: "6 semaines",
    difficulty: "INTERMEDIAIRE",
    stepsCount: 6,
  },
};

// ---- Types locaux (miroir de ParcoursDetail) --------------------------------

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
  difficulty: string;
  icon: string;
  nextParcours?: string;
  nextParcoursReason?: string;
  personaTagline?: string;
  testimonial?: string;
  steps: SeedStep[];
}

function getSeedForSlug(slug: string): SeedParcours | undefined {
  return (parcoursSeed as SeedParcours[]).find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return Object.keys(PARCOURS_META).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const staticMeta = PARCOURS_META[params.slug];

  if (staticMeta) {
    return {
      title: fitTitle(staticMeta.title),
      description: staticMeta.description,
      alternates: {
        canonical: `https://deviens-marrant.fr/parcours/${params.slug}`,
      },
      openGraph: {
        title: staticMeta.title,
        description: staticMeta.description,
        url: `https://deviens-marrant.fr/parcours/${params.slug}`,
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }

  const path = await prisma.learningPath
    .findUnique({
      where: { slug: params.slug },
      select: { title: true, description: true },
    })
    .catch(() => null);

  // Le template du layout ajoute déjà « | deviens-marrant.fr » : ne pas doubler la marque.
  const title = path ? path.title : "Parcours humour";
  const description = path?.description
    ? fitDescription(path.description)
    : "Progresse étape par étape dans ton parcours humour personnalisé.";

  return {
    title: fitTitle(title),
    description,
    alternates: {
      canonical: `https://deviens-marrant.fr/parcours/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://deviens-marrant.fr/parcours/${params.slug}`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

// Reconstruit le PathData attendu par ParcoursDetail à partir du seed.
function buildInitialPathFromSeed(slug: string) {
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
    nextParcours: seed.nextParcours ?? null,
    nextParcoursReason: seed.nextParcoursReason ?? null,
    personaTagline: seed.personaTagline ?? null,
    testimonial: seed.testimonial ?? null,
  };
}

// Enrichit le PathData DB avec le seed (vannes, vidéos, quiz…).
function enrichDbPathWithSeed(dbPath: Record<string, unknown>, slug: string) {
  const seed = getSeedForSlug(slug);
  if (!seed) return dbPath;

  const steps = dbPath.steps as Array<Record<string, unknown>>;
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
    ...dbPath,
    steps: enrichedSteps,
    nextParcours: seed.nextParcours ?? null,
    nextParcoursReason: seed.nextParcoursReason ?? null,
    personaTagline: seed.personaTagline ?? null,
    testimonial: seed.testimonial ?? null,
  };
}

async function fetchInitialData(slug: string) {
  // 1. On tente la DB (pour récupérer l'id réel + suivi de progression)
  try {
    const dbPath = await prisma.learningPath.findUnique({
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

    if (dbPath) {
      const enriched = enrichDbPathWithSeed(
        dbPath as unknown as Record<string, unknown>,
        slug,
      );

      // Page en ISR : pas de lecture de session serveur (cookies interdits en
      // rendu statique). La progression utilisateur est chargée côté client
      // après hydratation (parcours-detail refetch quand initialProgress est null).
      const initialProgress = null;

      return { path: enriched, progress: initialProgress };
    }
  } catch {
    // DB indispo → fallback seed uniquement
  }

  // 2. Fallback seed (pas encore migré, ou parcours purement statique)
  const seedPath = buildInitialPathFromSeed(slug);
  if (!seedPath) return null;
  return { path: seedPath, progress: null };
}

export default async function ParcoursDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = PARCOURS_META[params.slug];
  const initialData = await fetchInitialData(params.slug);

  if (!initialData && !meta) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Parcours", url: "https://deviens-marrant.fr/parcours" },
          {
            name: meta?.name ?? initialData?.path.title ?? "Parcours",
            url: `https://deviens-marrant.fr/parcours/${params.slug}`,
          },
        ])}
      />
      {meta && (
        <JsonLd
          data={buildCourseJsonLd({
            name: meta.name,
            description: meta.description,
            duration: meta.duration,
            slug: params.slug,
            difficulty: meta.difficulty,
            stepsCount: meta.stepsCount,
          })}
        />
      )}
      <ParcoursDetail
        slug={params.slug}
        initialPath={
          initialData?.path
            ? (initialData.path as unknown as React.ComponentProps<typeof ParcoursDetail>["initialPath"])
            : null
        }
        initialProgress={
          initialData?.progress
            ? (initialData.progress as unknown as React.ComponentProps<typeof ParcoursDetail>["initialProgress"])
            : null
        }
      />
    </div>
  );
}
