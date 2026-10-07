// Stratégie de rendu : ISR + SSR fallback.
// - Les 3 parcours canoniques (machine-a-cafe, repartie, confiance) ont un
//   generateStaticParams → rendu statique au build, revalidé chaque heure.
// - Les parcours DB ajoutés dynamiquement passent en SSR (dynamicParams: true).
// - Objectif SEO : Googlebot / Bingbot doivent recevoir le contenu du parcours
//   (titre, description, étapes) dans le HTML initial, pas seulement header/footer.
//   L'interactivité (progression, quiz, complétion) reste côté client.
// - Premium (décision 03/10/2026) : le HTML ISR est partagé par tous, il ne
//   contient donc que l'étape 1 complète et l'APERÇU des étapes 2+ (titre, ce
//   qu'on apprend, format, une phrase « pourquoi », XP). Un abonné reçoit le contenu complet
//   via /api/parcours/by-slug après hydratation (plan vérifié en base).
import type { Metadata } from "next";
import { fitDescription, fitTitle, DEFAULT_OG_IMAGE } from "@/lib/seo-meta";
import { notFound } from "next/navigation";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";
import { prisma } from "@/lib/prisma";
import { redactParcoursForPlan, type ParcoursStepPayload } from "@/lib/parcours-preview";
import {
  attachCatalogueLinks,
  buildPathFromSeed,
  enrichPathWithSeed,
  findActivePath,
  getSeedForSlug,
  withoutJokeTexts,
} from "@/lib/parcours-data";
import { buildParcoursCourseJsonLd } from "@/lib/parcours-jsonld";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { parcoursWeeks } from "@/config/premium";

// Revalide 1x/h — les steps changent rarement, l'important c'est le SSR sur les bots.
export const revalidate = 3600;
export const dynamicParams = true;

const BASE_URL = "https://deviens-marrant.fr";

/** Phrase honnête sur l'accès (D8) : « première étape gratuite », jamais « cours gratuit ». */
const PREMIERE_ETAPE = "Première étape gratuite.";

const PARCOURS_META: Record<
  string,
  { name: string; title: string; description: string; duration: string; stepsCount: number }
> = {
  "machine-a-cafe": {
    // name = nom visible (H1, fil d'Ariane, Course) ; title = balise <title> SEO (D8, seo.md §6).
    name: "Parcours Machine à Café",
    title: `Parcours Machine à Café : être drôle au bureau en ${parcoursWeeks("machine-a-cafe")} semaines`,
    description:
      `Des vannes et des anecdotes à ressortir à la machine à café, en réunion ou en afterwork : ${parcoursWeeks("machine-a-cafe")} semaines à 15 min/semaine. ${PREMIERE_ETAPE}`,
    duration: `${parcoursWeeks("machine-a-cafe")} semaines`,
    stepsCount: parcoursWeeks("machine-a-cafe"),
  },
  repartie: {
    name: "Parcours Répartie",
    title: `Parcours Répartie : ${parcoursWeeks("repartie")} semaines pour répondre du tac au tac`,
    description:
      `Développe ta répartie en ${parcoursWeeks("repartie")} semaines avec des exercices concrets et progressifs, pour arrêter de rester muet quand on te chambre. ${PREMIERE_ETAPE}`,
    duration: `${parcoursWeeks("repartie")} semaines`,
    stepsCount: parcoursWeeks("repartie"),
  },
  confiance: {
    name: "Parcours Confiance",
    title: `Parcours Confiance : retrouver ta légèreté en ${parcoursWeeks("confiance")} semaines`,
    description:
      `${parcoursWeeks("confiance")} semaines pour retrouver confiance en soi grâce à l'humour, à ton rythme et sans pression, une étape à la fois. ${PREMIERE_ETAPE}`,
    duration: `${parcoursWeeks("confiance")} semaines`,
    stepsCount: parcoursWeeks("confiance"),
  },
};

export function generateStaticParams() {
  return Object.keys(PARCOURS_META).map((slug) => ({ slug }));
}

function shareMetadata(slug: string, title: string, description: string): Metadata {
  const url = `${BASE_URL}/parcours/${slug}`;
  return {
    title: fitTitle(title),
    description: fitDescription(description),
    alternates: { canonical: url },
    // SEO-02 : aperçu de partage propre à la page (og ET twitter, sinon ceux de l'accueil).
    openGraph: { title, description: fitDescription(description), url, images: [DEFAULT_OG_IMAGE] },
    twitter: {
      card: "summary_large_image",
      title,
      description: fitDescription(description),
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const staticMeta = PARCOURS_META[params.slug];
  if (staticMeta) return shareMetadata(params.slug, staticMeta.title, staticMeta.description);

  const path = await prisma.learningPath
    .findUnique({
      where: { slug: params.slug, isActive: true },
      select: { title: true, description: true },
    })
    .catch(() => null);

  // SEO-11 / QA-11 : parcours inconnu = 404 avec une seule consigne robots (noindex).
  if (!path) return { title: "Parcours introuvable", robots: { index: false, follow: true } };

  // Le template du layout ajoute déjà « | deviens-marrant.fr » : ne pas doubler la marque.
  return shareMetadata(params.slug, path.title, path.description);
}

type RedactablePath = { steps: ParcoursStepPayload[] };

/** HTML partagé (ISR) : jamais de contenu Premium dedans, quel que soit le visiteur. */
async function toPublicPath<P>(path: P): Promise<P> {
  const redacted = redactParcoursForPlan(path as unknown as RedactablePath, null);
  return withoutJokeTexts(await attachCatalogueLinks(redacted)) as unknown as P;
}

async function fetchInitialData(slug: string) {
  // 1. Base (identifiant réel pour le suivi de progression). Page en ISR : pas
  // de session serveur, la progression est chargée côté navigateur.
  try {
    const dbPath = await findActivePath(slug);
    if (dbPath) {
      return { path: await toPublicPath(enrichPathWithSeed(dbPath, slug)), progress: null };
    }
  } catch {
    // Base indisponible → repli seed uniquement
  }
  // 2. Repli seed (pas encore migré, ou parcours purement statique)
  const seedPath = buildPathFromSeed(slug);
  if (!seedPath) return null;
  return { path: await toPublicPath(seedPath), progress: null };
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
    <div className="mx-auto max-w-3xl">
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
          data={buildParcoursCourseJsonLd({
            slug: params.slug,
            name: meta.name,
            description: meta.description,
            weeks: meta.stepsCount,
            // FS-11 : niveau lu dans le seed (même source que le badge de la page).
            difficulty: getSeedForSlug(params.slug)?.difficulty ?? "DEBUTANT",
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
