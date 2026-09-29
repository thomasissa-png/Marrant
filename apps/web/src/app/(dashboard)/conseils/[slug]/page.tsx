import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { DEFAULT_OG_IMAGE, fitDescription, fitTitle } from "@/lib/seo-meta";
import { buildTipSlug, parseShortIdFromSlug, pickBySlug } from "@/lib/catalogue-slug";
import { dedupeTipsByTitle } from "@/lib/tips-dedupe";
import { tipProse } from "@/lib/tip-prose";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildHowToJsonLd,
} from "@/components/seo/json-ld";

// ISR — page individuelle conseil : revalidation quotidienne, pas de DB au build.
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

async function findTipBySlug(slug: string) {
  const shortId = parseShortIdFromSlug(slug);
  if (!shortId) return null;
  // Erreur DB = exception (page 500, retentée ; en revalidation ISR la version
  // en cache est gardée). Surtout PAS `return null` : notFound() servirait
  // alors un 404, mis en cache ISR, sur une page qui existe (désindexation).
  const candidates = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { id: { startsWith: shortId }, isActive: true },
        take: 200,
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          difficulty: true,
          example: true,
          exercise: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
    { label: "findTipBySlug" },
  );
  return pickBySlug(candidates, slug, buildTipSlug);
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tip = await findTipBySlug(params.slug);
  if (!tip) return { title: "Conseil introuvable" };

  const canonicalSlug = buildTipSlug(tip);
  // Titre complet (jamais « ... » au milieu du mot-clé) + description coupée
  // proprement en fin de phrase ou de mot (lib/seo-meta.ts — passe SEO s11).
  const baseDescription = fitDescription(tip.content);
  const shortContent = baseDescription.length < 110
    ? fitDescription(`${baseDescription} Avec un exemple concret à décortiquer et un exercice à tester dès ce soir.`)
    : baseDescription;

  return {
    title: fitTitle(tip.title),
    description: shortContent,
    alternates: {
      canonical: `https://deviens-marrant.fr/conseils/${canonicalSlug}`,
    },
    openGraph: {
      type: "article",
      title: tip.title,
      description: shortContent,
      url: `https://deviens-marrant.fr/conseils/${canonicalSlug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: tip.title,
      description: shortContent,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function ConseilPage({
  params,
}: {
  params: { slug: string };
}) {
  const tip = await findTipBySlug(params.slug);
  if (!tip) notFound();

  const canonicalSlug = buildTipSlug(tip);
  const url = `https://deviens-marrant.fr/conseils/${canonicalSlug}`;
  const categoryLabel = CATEGORY_LABELS[tip.category] ?? tip.category;
  const difficultyLabel = DIFFICULTY_LABELS[tip.difficulty] ?? tip.difficulty;

  let related: { id: string; title: string; category: string }[] = [];
  try {
    // Titres en double en base : un seul affiché, jamais le conseil courant (N12 s12)
    const candidates = await prisma.tip.findMany({
      where: {
        isActive: true,
        category: tip.category,
        id: { not: tip.id },
      },
      select: { id: true, title: true, category: true },
      take: 12,
    });
    related = dedupeTipsByTitle([{ id: tip.id, title: tip.title, category: tip.category }, ...candidates])
      .slice(1, 5);
  } catch {}

  // JSON-LD HowTo — le conseil est concrètement une "méthode à appliquer"
  const howToJsonLd = buildHowToJsonLd({
    name: tip.title,
    description: tip.content.slice(0, 300),
    steps: [
      { name: "Comprendre le principe", text: tip.content.slice(0, 500) },
      { name: "Voir un exemple concret", text: tip.example.slice(0, 500) },
    ],
  });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Conseils", url: "https://deviens-marrant.fr/conseils" },
          { name: tip.title.slice(0, 60), url },
        ])}
      />
      <JsonLd data={howToJsonLd} />

      <nav aria-label="Fil d'Ariane" className="mx-auto mb-4 max-w-2xl text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/conseils" className="hover:text-text-primary">Conseils</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{categoryLabel}</span>
      </nav>

      <article className="mx-auto max-w-2xl">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-accent-primary/15 px-3 py-1 text-xs uppercase tracking-wider text-accent-link">
            {categoryLabel}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-text-muted">
            {difficultyLabel}
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold md:text-3xl">{tip.title}</h1>

        <div className="mt-6 space-y-4 text-text-secondary">
          <p className="whitespace-pre-wrap text-base leading-relaxed">{tipProse(tip.content)}</p>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-background-card p-5">
          <h2 className="font-display text-base font-bold text-text-primary">Exemple concret</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">{tipProse(tip.example)}</p>
        </section>

        {/* Freemium : l'exercice (application) reste réservé aux inscrits. */}
        <section className="mt-6 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-5">
          <div className="mb-1 text-xs uppercase tracking-wider text-accent-link">À toi de jouer</div>
          <p className="text-sm text-text-primary">
            L&apos;exercice complet pour appliquer cette technique dès aujourd&apos;hui,
            et des centaines d&apos;autres conseils progressifs, sont dans le parcours gratuit.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-accent-secondary-hover px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-secondary"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/conseils"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-primary/40"
            >
              Voir tous les conseils
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <nav aria-label="Conseils liés" className="mt-12 border-t border-border pt-8">
            <h2 className="font-display mb-4 text-xl font-bold">Dans la même thématique</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/conseils/${buildTipSlug(r)}`}
                    className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
                  >
                    <p className="text-sm font-semibold text-text-primary">{r.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="mt-8 text-sm">
          <Link href={`/conseils?category=${encodeURIComponent(tip.category)}`} className="text-accent-link hover:underline">
            &larr; Tous les conseils {categoryLabel.toLowerCase()}
          </Link>
        </nav>
      </article>
    </>
  );
}
