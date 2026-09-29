import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildJokeSlug, parseShortIdFromSlug } from "@/lib/catalogue-slug";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";
import { VanneShareRow } from "@/components/vannes/vanne-share-row";

// Stratégie de rendu : ISR — revalidation quotidienne des pages individuelles.
// Pas de build DB requise (generateStaticParams vide + fallback dynamic).
export const revalidate = 86400;
export const dynamicParams = true;

const CATEGORY_LABELS: Record<string, string> = {
  AUTODERISION: "Auto-dérision",
  SITUATION: "Vie quotidienne",
  ABSURDE: "Absurde",
  OBSERVATIONNEL: "Vie quotidienne",
  JEUX_DE_MOTS: "Jeux de mots",
  CULTUREL: "Vie quotidienne",
  COUPLE: "Couple & Dating",
  BOULOT: "Boulot & Collègues",
  ECOLE: "École & Études",
  GAMING: "Digital & Gaming",
  RESEAUX_SOCIAUX: "Digital & Gaming",
  DATING: "Couple & Dating",
  SOIREES: "Soirées & Apéro",
  PARENTS: "Famille",
};

async function findJokeBySlug(slug: string) {
  const shortId = parseShortIdFromSlug(slug);
  if (!shortId) return null;
  try {
    const joke = await prisma.joke.findFirst({
      where: { id: { startsWith: shortId }, isActive: true },
      select: {
        id: true,
        content: true,
        punchline: true,
        category: true,
        type: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    return joke;
  } catch {
    return null;
  }
}

// Générateur statique vide — les pages sont générées à la demande (ISR).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const joke = await findJokeBySlug(params.slug);
  if (!joke) {
    return { title: "Vanne introuvable" };
  }
  const canonicalSlug = buildJokeSlug(joke);
  const shortContent = joke.content.length > 90
    ? joke.content.slice(0, 87) + "..."
    : joke.content;
  // Title <= 60 chars total (avec suffixe " | deviens-marrant.fr")
  const rawTitle = `${shortContent}`;
  const seoTitle = rawTitle.length > 39 ? rawTitle.slice(0, 36) + "..." : rawTitle;

  const description =
    `Une vanne ${CATEGORY_LABELS[joke.category] ?? "drôle"} à ressortir : ${shortContent} Découvre la chute et 300+ autres vannes classées par situation.`;

  return {
    title: seoTitle,
    description: description.slice(0, 155),
    alternates: {
      canonical: `https://deviens-marrant.fr/vannes/${canonicalSlug}`,
    },
    openGraph: {
      type: "article",
      title: rawTitle,
      description: description.slice(0, 155),
      url: `https://deviens-marrant.fr/vannes/${canonicalSlug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle,
      description: description.slice(0, 155),
    },
  };
}

export default async function VannePage({
  params,
}: {
  params: { slug: string };
}) {
  const joke = await findJokeBySlug(params.slug);
  if (!joke) notFound();

  const canonicalSlug = buildJokeSlug(joke);
  const categoryLabel = CATEGORY_LABELS[joke.category] ?? "Vanne";
  const url = `https://deviens-marrant.fr/vannes/${canonicalSlug}`;

  // Contenus liés — 3 vannes de la même catégorie, hors vanne courante
  let related: { id: string; content: string; category: string }[] = [];
  try {
    related = await prisma.joke.findMany({
      where: {
        isActive: true,
        category: joke.category,
        id: { not: joke.id },
      },
      select: { id: true, content: true, category: true },
      take: 4,
    });
  } catch {}

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: joke.content.slice(0, 110),
    text: `${joke.content}\n\n${joke.punchline}`,
    genre: categoryLabel,
    inLanguage: "fr-FR",
    url,
    datePublished: joke.createdAt.toISOString(),
    dateModified: joke.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "deviens-marrant.fr",
      url: "https://deviens-marrant.fr",
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "Catalogue vannes deviens-marrant.fr",
      url: "https://deviens-marrant.fr/vannes",
    },
  };

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vannes", url: "https://deviens-marrant.fr/vannes" },
          { name: joke.content.slice(0, 60), url },
        ])}
      />
      <JsonLd data={creativeWorkJsonLd} />

      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/vannes" className="hover:text-text-primary">Vannes</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{categoryLabel}</span>
      </nav>

      <article className="mx-auto max-w-2xl">
        <div className="mb-2 text-xs uppercase tracking-wider text-accent-primary">
          {categoryLabel}
        </div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          {joke.content}
        </h1>
        <div className="mt-6 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-5">
          <div className="mb-1 text-xs uppercase tracking-wider text-accent-primary">La chute</div>
          <p className="text-lg font-semibold text-text-primary">{joke.punchline}</p>
        </div>

        <VanneShareRow
          jokeId={joke.id}
          slug={canonicalSlug}
          content={joke.content}
          punchline={joke.punchline}
        />

        {/* Partie premium : le "À toi de jouer" — cohérent avec le freemium existant.
            La vanne + la chute sont visibles (SEO / crawlers), l'application concrète est réservée. */}
        <section className="mt-10 rounded-xl border border-border bg-background-card p-5">
          <h2 className="font-display text-lg font-bold">Comment la ressortir</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Le meilleur moment ? Quand personne ne s&apos;y attend. Retiens la structure
            (setup court + chute qui décale) et applique-la à ta propre situation.
            Les exercices d&apos;application, les variantes et le décryptage complet
            sont dans les <Link href="/parcours" className="text-accent-primary hover:underline">parcours Premium</Link>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-primary/90"
            >
              Créer un compte gratuit
            </Link>
            <Link
              href="/vannes"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-primary/40"
            >
              Voir toutes les vannes
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <nav aria-label="Vannes liées" className="mt-12 border-t border-border pt-8">
            <h2 className="font-display mb-4 text-xl font-bold">Dans la même catégorie</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/vannes/${buildJokeSlug(r)}`}
                    className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
                  >
                    <p className="text-sm text-text-primary line-clamp-2">{r.content}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="mt-8 text-sm">
          <Link href={`/vannes?category=${encodeURIComponent(joke.category)}`} className="text-accent-primary hover:underline">
            &larr; Toutes les vannes {categoryLabel.toLowerCase()}
          </Link>
        </nav>
      </article>
    </>
  );
}
