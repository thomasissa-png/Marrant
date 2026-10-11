import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { getContentStatsCached } from "@/lib/content-stats-server";
import { dedupeJokesByContent, jokeContentKey } from "@/lib/jokes-dedupe";
import { NOT_FOUND_ROBOTS, TITLE_MAX, truncateAtWord } from "@/lib/seo-meta";
import { buildJokeSlug, isNonCanonicalSlug, parseShortIdFromSlug, resolveBySlug } from "@/lib/catalogue-slug";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";
import { VanneShareRow } from "@/components/vannes/vanne-share-row";
import { HowToApplyGate } from "@/components/vannes/how-to-apply-gate";
import { buttonVariants } from "@/components/ui/button";
import { FicheParcoursLien } from "@/components/entrees-parcours/fiche-parcours-lien";
import { findParcoursForJoke } from "@/lib/entrees-parcours-fiches";

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
  if (!shortId) return { status: "missing" as const };
  // Erreur DB = exception (page 500, retentée ; en revalidation ISR la version
  // en cache est gardée). Surtout PAS `return null` : notFound() servirait
  // alors un 404, mis en cache ISR, sur une page qui existe (désindexation).
  const candidates = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where: { id: { startsWith: shortId } },
        take: 200,
        select: {
          id: true,
          isActive: true,
          content: true,
          punchline: true,
          category: true,
          type: true,
          comedyTechnique: true,
          techniqueExplanation: true,
          howToApply: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
    { label: "findJokeBySlug" },
  );
  return resolveBySlug(candidates, slug, buildJokeSlug);
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
  const resolved = await findJokeBySlug(params.slug);
  const joke = resolved.status === "active" ? resolved.item : null;
  if (!joke) {
    // 404 : une seule consigne robots (celle de notFound()), sans bingbot hérité.
    return { title: "Vanne introuvable", ...NOT_FOUND_ROBOTS };
  }
  const canonicalSlug = buildJokeSlug(joke);
  const label = CATEGORY_LABELS[joke.category] ?? "Vie quotidienne";
  const setup = joke.content.replace(/\s+/g, " ").trim();
  // Titre : mot-clé « Vanne <catégorie> » en tête + début de la vanne, coupé
  // proprement (plus de « ... » à 36 caractères) — passe SEO finale s11.
  const titlePrefix = `Vanne ${label.toLowerCase()} : `;
  const rawTitle = `${titlePrefix}${truncateAtWord(setup, TITLE_MAX - titlePrefix.length)}`;
  // Description : le début de la vanne (la chute reste sur la page) + la
  // promesse de la page (pourquoi ça marche + comment la replacer).
  // Nombre RÉEL de vannes actives distinctes (même source que les compteurs
  // du site, GO Thomas 03/10/2026) au lieu de « 550+ » en dur. Base KO : pas de chiffre.
  const { jokes: activeJokes } = await getContentStatsCached();
  const otherJokes = activeJokes - 1;
  const descSuffix =
    otherJokes > 1
      ? ` La chute est sur la page, avec ${otherJokes} autres vannes par situation.`
      : " La chute est sur la page, avec d'autres vannes par situation.";
  const descPrefix = `Vanne ${label.toLowerCase()} à ressortir : `;
  const description = `${descPrefix}${truncateAtWord(setup, 160 - descPrefix.length - descSuffix.length)}${descSuffix}`;

  return {
    title: { absolute: rawTitle },
    description,
    alternates: {
      canonical: `https://deviens-marrant.fr/vannes/${canonicalSlug}`,
    },
    openGraph: {
      type: "article",
      title: rawTitle,
      description,
      url: `https://deviens-marrant.fr/vannes/${canonicalSlug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle,
      description,
    },
  };
}

export default async function VannePage({
  params,
}: {
  params: { slug: string };
}) {
  const resolved = await findJokeBySlug(params.slug);
  // Vanne retirée (isActive=false) : redirection permanente vers la liste,
  // pas de 404. Slug inconnu : 404 comme avant.
  if (resolved.status === "inactive") permanentRedirect("/vannes");
  if (resolved.status === "missing") notFound();
  const joke = resolved.item;

  // "Pourquoi ça marche" public (valeur SEO) ; "À toi de jouer" fait partie de
  // Premium (abonnés, s15 §1.1) : géré côté client par
  // <HowToApplyGate> pour garder la page en ISR (pas de lecture de cookies ici).

  const canonicalSlug = buildJokeSlug(joke);
  // Ancien slug (vanne réécrite) : 308 vers l'URL canonique (lot S3d s14).
  if (isNonCanonicalSlug(params.slug, canonicalSlug)) permanentRedirect(`/vannes/${canonicalSlug}`);
  const categoryLabel = CATEGORY_LABELS[joke.category] ?? "Vanne";
  const url = `https://deviens-marrant.fr/vannes/${canonicalSlug}`;

  // Contenus liés — 3 vannes de la même catégorie, hors vanne courante
  // Dédoublonnées au rendu (copies d'une même vanne en base, et copies de la vanne courante) :
  // on lit un peu plus large pour en garder 4 distinctes.
  let related: { id: string; content: string; category: string }[] = [];
  try {
    const candidates = await prisma.joke.findMany({
      where: {
        isActive: true,
        category: joke.category,
        id: { not: joke.id },
      },
      select: { id: true, content: true, category: true },
      take: 12,
    });
    const currentKey = jokeContentKey(joke.content);
    related = dedupeJokesByContent(candidates)
      .filter((r) => jokeContentKey(r.content) !== currentKey)
      .slice(0, 4);
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

      <nav aria-label="Fil d'Ariane" className="mx-auto mb-4 max-w-2xl text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/vannes" className="hover:text-text-primary max-md:py-3.5">Vannes</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{categoryLabel}</span>
      </nav>

      <article className="mx-auto max-w-2xl">
        <div className="mb-2 text-xs uppercase tracking-wider text-accent-link">
          {categoryLabel}
        </div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          {joke.content}
        </h1>
        <div className="mt-6 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-5">
          <div className="mb-1 text-xs uppercase tracking-wider text-accent-link">La chute</div>
          <p className="text-lg font-semibold text-text-primary">{joke.punchline}</p>
        </div>

        <VanneShareRow
          jokeId={joke.id}
          slug={canonicalSlug}
          content={joke.content}
          punchline={joke.punchline}
        />

        {/* Décryptage pédagogique — cœur de la proposition de valeur.
            "Pourquoi ça marche" (comedyTechnique + techniqueExplanation) est PUBLIC :
            valeur SEO, preuve d'expertise, exposition pour les crawlers.
            "À toi de jouer" (howToApply) fait partie de Premium
            (abonnés uniquement, s15 §1.1). */}
        {joke.comedyTechnique && (
          <section
            aria-labelledby="pourquoi-ca-marche"
            className="mt-10 rounded-xl border border-accent-primary/20 bg-accent-primary/5 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-link">
              Pourquoi ça marche&nbsp;: {joke.comedyTechnique}
            </p>
            <h2 id="pourquoi-ca-marche" className="sr-only">
              Pourquoi ça marche : {joke.comedyTechnique}
            </h2>
            {joke.techniqueExplanation && (
              <p className="mt-2 text-sm text-text-secondary">
                {joke.techniqueExplanation}
              </p>
            )}
            {joke.howToApply ? <HowToApplyGate howToApply={joke.howToApply} /> : null}
            <p className="mt-3 text-xs text-text-muted">
              Envie de comprendre la mécanique en profondeur ?{" "}
              <Link
                href="/anatomie-vanne"
                className="font-medium text-accent-link underline underline-offset-2"
              >
                L&apos;anatomie d&apos;une vanne
              </Link>
            </p>
          </section>
        )}

        {/* Étape de parcours qui utilise cette vanne (SEO-06, s17) : rien si aucune. */}
        <FicheParcoursLien type="vanne" refs={findParcoursForJoke(joke.content)} />

        {/* Passerelle parcours — même approche que sur le catalogue, sans
            re-monter un mur : c'est une invitation, pas un blocage. */}
        <section className="mt-6 rounded-xl border border-border bg-background-card p-5">
          <h2 className="font-display text-lg font-bold">Comment la ressortir</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Le meilleur moment ? Quand personne ne s&apos;y attend. Retiens la structure
            (setup court + chute qui décale) et applique-la à ta propre situation.
            Les variantes et le parcours complet sont dans les{" "}
            <Link href="/parcours" className="text-accent-link underline underline-offset-2">
              parcours Premium
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={buildAbonnementUrl(`/vannes/${canonicalSlug}`, "monthly", "fiche-vanne")}
              className={buttonVariants({ variant: "primary" })}
            >
              Voir Premium
            </Link>
            <Link
              href="/vannes"
              className={buttonVariants({ variant: "outline" })}
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
          <Link href={`/vannes?category=${encodeURIComponent(joke.category)}`} className="text-accent-link underline underline-offset-2">
            &larr; Toutes les vannes {categoryLabel.toLowerCase()}
          </Link>
        </nav>
      </article>
    </>
  );
}
