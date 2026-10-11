import type { Metadata } from "next";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { ListPagination } from "@/components/ui/list-pagination";
import { buttonVariants } from "@/components/ui/button";
import { VannesThemeNav } from "@/components/vannes/vannes-theme-nav";
import { getThemeJokesPage } from "@/lib/catalogue-pages";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { listCanonical, parsePageParam } from "@/lib/list-pagination";
import { getVannesTheme, vannesThemePath } from "@/lib/vannes-themes";
import { frTypo } from "@/lib/fr-typo";

// Stratégie de rendu : SSR (lecture de `?page=N`), comme /vannes (lot S1 s14).
// Liste en cache serveur 1 h (unstable_cache, lib/catalogue-pages) : le HTML
// contient les liens vers les fiches et une pagination crawlable. Sans base
// (build, panne) : en-tête et liens de navigation seuls, pas d'erreur.
interface ThemePageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const SITE_URL = "https://deviens-marrant.fr";

export async function generateMetadata({ params, searchParams }: ThemePageProps): Promise<Metadata> {
  const theme = getVannesTheme(params.slug);
  // 404 : une seule consigne robots (celle de notFound()), sans bingbot hérité.
  if (!theme) return { ...NOT_FOUND_ROBOTS };
  const page = parsePageParam(searchParams.page);
  const canonical = listCanonical(vannesThemePath(theme.slug), page);
  return {
    title: theme.title,
    description: theme.description,
    alternates: { canonical },
    openGraph: { title: theme.title, description: theme.description, url: canonical, locale: "fr_FR", type: "website" },
  };
}

export default async function VannesThemePage({ params, searchParams }: ThemePageProps) {
  const theme = getVannesTheme(params.slug);
  if (!theme) notFound();
  const page = parsePageParam(searchParams.page);
  const listPage = await getThemeJokesPage(theme.category, page);
  // Page hors catalogue (?page=999) : 404 plutôt qu'une liste vide indexable.
  if (listPage && page > Math.max(1, listPage.totalPages)) notFound();
  const path = vannesThemePath(theme.slug);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: SITE_URL },
          { name: "Vannes", url: `${SITE_URL}/vannes` },
          { name: theme.label, url: `${SITE_URL}${path}` },
        ])}
      />
      {listPage && (
        <JsonLd
          data={buildCollectionPageJsonLd({
            name: theme.h1,
            description: theme.description,
            url: `${SITE_URL}${path}`,
            numberOfItems: listPage.total,
          })}
        />
      )}
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/vannes" className="hover:text-text-primary max-md:py-3.5">Vannes</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{theme.label}</span>
      </nav>
      <PageHeader title={frTypo(theme.h1)} lead={frTypo(theme.intro)} />
      <VannesThemeNav current={theme.slug} />

      {listPage && listPage.items.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {listPage.items.map((joke) => (
            <li key={joke.id}>
              <Link
                href={`/vannes/${buildJokeSlug(joke)}`}
                className="block h-full rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
              >
                <p className="text-sm text-text-primary">{joke.content}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ListPagination basePath={path} page={page} totalPages={listPage?.totalPages ?? 0} />

      <div className="mt-8">
        <Link href="/vannes" className={buttonVariants({ variant: "outline" })}>
          Voir toutes les vannes
        </Link>
      </div>
    </>
  );
}
