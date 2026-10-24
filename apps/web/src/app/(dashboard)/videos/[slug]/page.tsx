import type { Metadata } from "next";
import { contenuAffiche } from "@/lib/tip-prose";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { buildVideoMetaDescription, fitTitle, NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { fixInvertedCase } from "@/lib/learning-format";
import { buildVideoSlug, isNonCanonicalSlug, parseShortIdFromSlug, resolveBySlug } from "@/lib/catalogue-slug";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildVideoObjectJsonLd,
} from "@/components/seo/json-ld";
import { FicheParcoursLien } from "@/components/entrees-parcours/fiche-parcours-lien";
import { findParcoursForVideo } from "@/lib/entrees-parcours-fiches";
import { getRelatedVideos, type RelatedVideo } from "@/lib/related-catalogue";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { parcoursPourFiche } from "@/lib/cta-fiches";
import { MARGE_ENCADRE } from "@/components/layout/gabarit";

// ISR — page individuelle vidéo : revalidation quotidienne, pas de DB au build.
export const revalidate = 86400;
export const dynamicParams = true;

const CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Autodérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

async function findVideoBySlug(slug: string) {
  const shortId = parseShortIdFromSlug(slug);
  if (!shortId) return { status: "missing" as const };
  // Erreur DB = exception (page 500, retentée ; en revalidation ISR la version
  // en cache est gardée). Surtout PAS `return null` : notFound() servirait
  // alors un 404, mis en cache ISR, sur une page qui existe (désindexation).
  const candidates = await withDbRetry(
    () =>
      prisma.video.findMany({
        where: { id: { startsWith: shortId } },
        take: 200,
        select: {
          id: true,
          isActive: true,
          title: true,
          channelName: true,
          youtubeId: true,
          duration: true,
          category: true,
          difficulty: true,
          description: true,
          technique: true,
          learnings: true,
          exercise: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
    { label: "findVideoBySlug" },
  );
  return resolveBySlug(candidates, slug, buildVideoSlug);
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const resolved = await findVideoBySlug(params.slug);
  const video = resolved.status === "active" ? resolved.item : null;
  // 404 : une seule consigne robots (celle de notFound()), sans bingbot hérité.
  if (!video) return { title: "Vidéo introuvable", ...NOT_FOUND_ROBOTS };

  const canonicalSlug = buildVideoSlug(video);
  // Titre YouTube conservé tel quel (fitTitle : jamais de « ... » au milieu),
  // description coupée proprement (lib/seo-meta.ts, passe SEO s11).
  // s20 : « Chaîne : description », ≤ 155 car. (lib/seo-meta.ts).
  const desc = buildVideoMetaDescription(video);

  return {
    title: fitTitle(video.title),
    description: desc,
    alternates: {
      canonical: `https://deviens-marrant.fr/videos/${canonicalSlug}`,
    },
    openGraph: {
      type: "video.other",
      title: video.title,
      description: desc,
      url: `https://deviens-marrant.fr/videos/${canonicalSlug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
      images: [
        // hqdefault.jpg = 480×360 (le 1280×720 annoncé avant était faux).
        { url: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`, width: 480, height: 360 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: desc,
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolved = await findVideoBySlug(params.slug);
  // Vidéo retirée (isActive=false) : redirection permanente vers la liste,
  // pas de 404. Slug inconnu : 404 comme avant.
  if (resolved.status === "inactive") permanentRedirect("/videos");
  if (resolved.status === "missing") notFound();
  const video = resolved.item;

  const canonicalSlug = buildVideoSlug(video);
  // Ancien slug (vidéo renommée) : 308 vers l'URL canonique (lot S3d s14).
  if (isNonCanonicalSlug(params.slug, canonicalSlug)) permanentRedirect(`/videos/${canonicalSlug}`);
  const url = `https://deviens-marrant.fr/videos/${canonicalSlug}`;
  const categoryLabel = CATEGORY_LABELS[video.category] ?? video.category;
  const difficultyLabel = DIFFICULTY_LABELS[video.difficulty] ?? video.difficulty;

  // Contenus liés (s20, spec maillage S2) : 4 voisines en anneau dans la liste de la
  // catégorie (ordre des listes), jamais la vidéo courante. Liste en cache 1 h par
  // catégorie (lib/related-catalogue). Base KO : pas de bloc.
  let related: RelatedVideo[] = [];
  try {
    related = await getRelatedVideos({ id: video.id, youtubeId: video.youtubeId, category: video.category });
  } catch {}

  const videoJsonLd = buildVideoObjectJsonLd({
    name: video.title,
    description: video.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    uploadDate: video.createdAt.toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
    duration: video.duration,
  });

  const parcoursRefs = findParcoursForVideo(video.youtubeId);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vidéos", url: "https://deviens-marrant.fr/videos" },
          { name: video.title.slice(0, 60), url },
        ])}
      />
      <JsonLd data={videoJsonLd} />

      <nav aria-label="Fil d’Ariane" className="mx-auto mb-4 max-w-3xl text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/videos" className="hover:text-text-primary max-md:py-3.5">Vidéos</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{categoryLabel}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-primary/15 px-3 py-1 text-xs uppercase tracking-wider text-accent-link">
            {categoryLabel}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-text-muted">
            {difficultyLabel}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">
            {video.channelName}
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold md:text-3xl">{contenuAffiche(video.title)}</h1>

        <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-border bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>

        <section className="mt-8">
          <h2 className="font-display mb-2 text-lg font-bold">Ce qu’elle montre</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
            {contenuAffiche(fixInvertedCase(video.description))}
          </p>
          <div className={`mt-4 rounded-lg border border-border bg-background-card ${MARGE_ENCADRE}`}>
            <div className="text-xs uppercase tracking-wider text-text-muted">Technique principale</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">{video.technique}</div>
          </div>
        </section>

        {/* s21 B10 : les points clés et l'exercice font partie de Premium (s15 §1.1) ; un plein,
            un contour étape 1, le reste en lien. Rien du contenu de l'analyse n'est dévoilé. */}
        <BlocExercice
          type="video"
          returnTo={`/videos/${canonicalSlug}`}
          parcours={parcoursPourFiche(parcoursRefs, video.category)}
        />

        {/* Étape de parcours qui travaille cette vidéo (SEO-06, s17) : rien si aucune. */}
        <FicheParcoursLien type="video" refs={parcoursRefs} />

        {related.length > 0 && (
          <nav aria-label="Vidéos liées" className="mt-12 border-t border-border pt-8">
            <h2 className="font-display mb-4 text-xl font-bold">Dans la même thématique</h2>
            <ul className="grid gap-3 sm:auto-rows-fr sm:grid-cols-2">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/videos/${buildVideoSlug(r)}`}
                    className="flex h-full flex-col justify-center rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
                  >
                    <p className="text-sm font-semibold text-text-primary line-clamp-2">{contenuAffiche(r.title)}</p>
                    <p className="mt-1 text-xs text-text-muted">{r.channelName}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="mt-8 text-sm">
          <Link href={`/videos?category=${encodeURIComponent(video.category)}`} className="inline-flex min-h-11 items-center text-accent-link underline underline-offset-2">
            &larr; Toutes les vidéos {categoryLabel.toLowerCase()}
          </Link>
        </nav>
      </article>
    </>
  );
}
