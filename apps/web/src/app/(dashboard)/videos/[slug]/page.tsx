import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { buildRegisterUrl } from "@/lib/auth-links";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { fitDescription, fitTitle } from "@/lib/seo-meta";
import { fixInvertedCase } from "@/lib/learning-format";
import { buildVideoSlug, isNonCanonicalSlug, parseShortIdFromSlug, resolveBySlug } from "@/lib/catalogue-slug";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildVideoObjectJsonLd,
} from "@/components/seo/json-ld";

// ISR — page individuelle vidéo : revalidation quotidienne, pas de DB au build.
export const revalidate = 86400;
export const dynamicParams = true;

const CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Auto-dérision",
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
  if (!video) return { title: "Vidéo introuvable" };

  const canonicalSlug = buildVideoSlug(video);
  // Titre YouTube conservé tel quel (fitTitle : jamais de « ... » au milieu),
  // description coupée proprement (lib/seo-meta.ts — passe SEO s11).
  const baseDesc = fitDescription(`${video.channelName} — ${video.description}`);
  const desc = baseDesc.length < 110 && video.technique
    ? fitDescription(`${baseDesc} La technique à retenir : ${video.technique}.`)
    : baseDesc;

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

  let related: { id: string; title: string; channelName: string; youtubeId: string }[] = [];
  try {
    related = await prisma.video.findMany({
      where: {
        isActive: true,
        category: video.category,
        id: { not: video.id },
      },
      select: { id: true, title: true, channelName: true, youtubeId: true },
      take: 4,
    });
  } catch {}

  const videoJsonLd = buildVideoObjectJsonLd({
    name: video.title,
    description: video.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    uploadDate: video.createdAt.toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    duration: video.duration,
  });

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

      <nav aria-label="Fil d'Ariane" className="mx-auto mb-4 max-w-3xl text-sm text-text-muted">
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

        <h1 className="font-display text-2xl font-bold md:text-3xl">{video.title}</h1>

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
          <h2 className="font-display mb-2 text-lg font-bold">Ce qu&apos;elle montre</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
            {fixInvertedCase(video.description)}
          </p>
          <div className="mt-4 rounded-lg border border-border bg-background-card p-4">
            <div className="text-xs uppercase tracking-wider text-text-muted">Technique principale</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">{video.technique}</div>
          </div>
        </section>

        {/* Freemium : les learnings + exercice sont réservés aux inscrits.
            Le titre, la vidéo (déjà publique sur YouTube) et la description restent
            visibles pour SEO et VideoObject schema. */}
        <section className="mt-8 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-5">
          <div className="mb-1 text-xs uppercase tracking-wider text-accent-link">Analyse pédagogique complète</div>
          <p className="text-sm text-text-primary">
            Les points clés à retenir et l&apos;exercice pour appliquer la technique
            sont accessibles gratuitement quand tu crées ton compte. Tu récupères
            aussi ton contenu quotidien et la première étape de chaque parcours.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={buildRegisterUrl({ callbackUrl: `/videos/${canonicalSlug}`, src: "fiche-video" })}
              className="rounded-lg bg-accent-secondary-hover px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-secondary"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/videos"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-primary/40"
            >
              Voir toutes les vidéos
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <nav aria-label="Vidéos liées" className="mt-12 border-t border-border pt-8">
            <h2 className="font-display mb-4 text-xl font-bold">Dans la même thématique</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/videos/${buildVideoSlug(r)}`}
                    className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
                  >
                    <p className="text-sm font-semibold text-text-primary line-clamp-2">{r.title}</p>
                    <p className="mt-1 text-xs text-text-muted">{r.channelName}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="mt-8 text-sm">
          <Link href={`/videos?category=${encodeURIComponent(video.category)}`} className="text-accent-link hover:underline">
            &larr; Toutes les vidéos {categoryLabel.toLowerCase()}
          </Link>
        </nav>
      </article>
    </>
  );
}
