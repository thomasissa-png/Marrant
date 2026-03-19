import type { Metadata } from "next";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";
import { prisma } from "@/lib/prisma";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/components/seo/json-ld";

const PARCOURS_META: Record<
  string,
  { title: string; description: string; duration: string; difficulty: string; stepsCount: number }
> = {
  "machine-a-cafe": {
    title: "Parcours Machine à Café — drôle au bureau",
    description:
      "Apprends à avoir des vannes et anecdotes à ressortir au bureau et en afterwork. 3 semaines, 15 min/semaine. Progresse à ton rythme.",
    duration: "3 semaines",
    difficulty: "DEBUTANT",
    stepsCount: 3,
  },
  repartie: {
    title: "Parcours Répartie — réponse prête",
    description:
      "Développe ta répartie en 4 semaines avec des exercices concrets pour ne plus rester muet en soirée ou entre potes.",
    duration: "4 semaines",
    difficulty: "INTERMEDIAIRE",
    stepsCount: 4,
  },
  confiance: {
    title: "Parcours Confiance — retrouve ta légèreté",
    description:
      "Parcours de 6 semaines pour retrouver confiance en soi grâce à l'humour. Bienveillant, progressif, adapté à ton rythme.",
    duration: "6 semaines",
    difficulty: "INTERMEDIAIRE",
    stepsCount: 6,
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Utiliser les meta statiques si disponibles (évite un appel DB)
  const staticMeta = PARCOURS_META[params.slug];

  if (staticMeta) {
    return {
      title: staticMeta.title,
      description: staticMeta.description,
      alternates: {
        canonical: `https://deviens-marrant.fr/parcours/${params.slug}`,
      },
      openGraph: {
        title: staticMeta.title,
        description: staticMeta.description,
        url: `https://deviens-marrant.fr/parcours/${params.slug}`,
      },
    };
  }

  // Fallback : fetch depuis la DB pour les parcours ajoutés dynamiquement
  const path = await prisma.learningPath
    .findUnique({
      where: { slug: params.slug },
      select: { title: true, description: true },
    })
    .catch(() => null);

  const title = path
    ? `${path.title} — deviens-marrant.fr`
    : "Parcours — deviens-marrant.fr";
  const description = path?.description?.slice(0, 155) ??
    "Progresse étape par étape dans ton parcours humour personnalisé.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://deviens-marrant.fr/parcours/${params.slug}`,
    },
    openGraph: { title, description, url: `https://deviens-marrant.fr/parcours/${params.slug}` },
  };
}

export default function ParcoursDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = PARCOURS_META[params.slug];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Parcours", url: "https://deviens-marrant.fr/parcours" },
          { name: meta?.title ?? "Parcours", url: `https://deviens-marrant.fr/parcours/${params.slug}` },
        ])}
      />
      {meta && (
        <JsonLd
          data={buildCourseJsonLd({
            name: meta.title,
            description: meta.description,
            duration: meta.duration,
            slug: params.slug,
            difficulty: meta.difficulty,
            stepsCount: meta.stepsCount,
          })}
        />
      )}
      <ParcoursDetail slug={params.slug} />
    </div>
  );
}
