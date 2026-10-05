/**
 * Section « Blog : articles à forte frappe » du rapport hebdomadaire.
 *
 * Endpoints Umami (référence docs.umami.is, octobre 2026) :
 *  - `metrics?type=event` : comptes par nom d'événement (semaine et précédente),
 *    puis le même filtré `path=/blog/<slug>` pour chaque article suivi ;
 *  - `event-data/values?event=blog-scroll&propertyName=palier` : paliers de lecture
 *    (global, et filtré par path pour le taux de lecture à 75 %) ;
 *  - `metrics?type=path&path=/blog/<slug>` : pages vues de l'article (repli `url`).
 * Tolérance : chaque appel en échec (404, 400, timeout…) donne `null` et un
 * avertissement sans secret ; la section devient partielle, jamais d'exception.
 */
import { TRACKED_ARTICLES } from "@/config/blog-tracking";
import {
  UmamiError,
  fetchUmamiEventDataValues,
  fetchUmamiMetrics,
  fetchUmamiPathMetrics,
  type UmamiConfig,
  type UmamiPoint,
  type UmamiPropertyValue,
} from "./umami";
import { pctChange, type ReportPeriods } from "./weekly-visits-period";

export const BLOG_EVENTS = [
  { name: "blog-sortie-clic", label: "Clics de sortie (2e page)" },
  { name: "blog-cta-clic", label: "Clics CTA" },
  { name: "blog-ancre-clic", label: "Clics sommaire (ancres)" },
  { name: "blog-vanne-partage", label: "Partages de vannes" },
  { name: "blog-scroll", label: "Paliers de lecture (total)" },
] as const;

export type BlogEventName = (typeof BLOG_EVENTS)[number]["name"];
export const SCROLL_STEPS = [25, 50, 75, 100] as const;
export type ScrollStep = (typeof SCROLL_STEPS)[number];

/** Comparaison semaine / précédente ; `null` = donnée indisponible. */
export type Compared = { current: number | null; previous: number | null; change: number | null };

export type BlogArticleState = { slug: string; isPublished: boolean; publishedAt: Date | null };
/** Statut de publication des slugs suivis, lu en base (Prisma en production). */
export type BlogArticleLookup = (slugs: string[]) => Promise<BlogArticleState[]>;

export type BlogArticleRow =
  | { slug: string; status: "scheduled"; publishedAt: string; publishedLabel: string }
  | { slug: string; status: "unscheduled" | "missing" }
  | {
      slug: string;
      /** `unknown` : base non consultée ou indisponible, stats affichées quand même. */
      status: "published" | "unknown";
      views: Compared;
      exits: number | null;
      ctas: number | null;
      shares: number | null;
      read75: number | null;
      /** Part des vues ayant atteint 75 % du corps, en %. */
      readRate: number | null;
    };

export type BlogReport = {
  /** true si au moins une donnée Umami ou base n'a pas pu être lue. */
  partial: boolean;
  /** Messages sans secret, ex. « Umami event-data/values : HTTP 404 ». */
  warnings: string[];
  events: (Compared & { name: BlogEventName; label: string })[];
  /** Répartition de blog-scroll par palier ; null si l'API ne la fournit pas. */
  scrollSteps: (Compared & { palier: ScrollStep })[] | null;
  articles: BlogArticleRow[];
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function compare(current: number | null, previous: number | null): Compared {
  const change = current !== null && previous !== null ? pctChange(current, previous) : null;
  return { current, previous, change };
}

function countOf(points: UmamiPoint[] | null, name: string): number | null {
  if (!points) return null;
  return points.filter((p) => p.x === name).reduce((sum, p) => sum + p.y, 0);
}

function stepCount(values: UmamiPropertyValue[] | null, step: ScrollStep): number | null {
  if (!values) return null;
  return values.filter((v) => Number(v.value) === step).reduce((sum, v) => sum + v.total, 0);
}

/** Vues exactes de `/blog/<slug>` (avec ou sans « / » final). */
function viewsOf(points: UmamiPoint[] | null, path: string): number | null {
  if (!points) return null;
  return points.filter((p) => p.x.replace(/\/$/, "") === path).reduce((sum, p) => sum + p.y, 0);
}

function ddmmParis(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit" }).format(date);
}

type Safe = <T>(p: Promise<T>) => Promise<T | null>;

function makeSafe(warnings: Set<string>): Safe {
  return async (p) => {
    try {
      return await p;
    } catch (err) {
      // UmamiError ne contient jamais la clé (chemin + statut seulement).
      warnings.add(err instanceof UmamiError ? err.message : "Umami : erreur inattendue");
      return null;
    }
  };
}

async function loadArticleStates(
  lookup: BlogArticleLookup | undefined,
  slugs: string[],
  warnings: Set<string>,
): Promise<Map<string, BlogArticleState> | null> {
  if (!lookup) return null;
  try {
    return new Map((await lookup(slugs)).map((a) => [a.slug, a]));
  } catch {
    warnings.add("Base : statut de publication des articles indisponible");
    return null;
  }
}

async function loadArticle(
  config: UmamiConfig,
  periods: ReportPeriods,
  slug: string,
  status: "published" | "unknown",
  safe: Safe,
): Promise<BlogArticleRow> {
  const path = `/blog/${slug}`;
  const { current: cur, previous: prev } = periods;
  const [viewsCur, viewsPrev, events, scroll] = await Promise.all([
    safe(fetchUmamiPathMetrics(config, cur.startAt, cur.endAt, 10, path)),
    safe(fetchUmamiPathMetrics(config, prev.startAt, prev.endAt, 10, path)),
    safe(fetchUmamiMetrics(config, cur.startAt, cur.endAt, "event", 100, { path })),
    safe(fetchUmamiEventDataValues(config, cur.startAt, cur.endAt, "blog-scroll", "palier", { path })),
  ]);
  const views = compare(viewsOf(viewsCur, path), viewsOf(viewsPrev, path));
  const read75 = stepCount(scroll, 75);
  return {
    slug,
    status,
    views,
    exits: countOf(events, "blog-sortie-clic"),
    ctas: countOf(events, "blog-cta-clic"),
    shares: countOf(events, "blog-vanne-partage"),
    read75,
    readRate: read75 !== null && views.current ? round1((read75 / views.current) * 100) : null,
  };
}

/**
 * Construit la section blog. Ne lève jamais : un endpoint absent ou en erreur
 * rend la section partielle (`partial`, `warnings`).
 * Articles traités l'un après l'autre (4 appels chacun) pour rester sous la
 * limite de connexions sortantes simultanées des Workers.
 */
export async function buildBlogReport(
  config: UmamiConfig,
  periods: ReportPeriods,
  lookupArticles?: BlogArticleLookup,
  slugs: readonly string[] = TRACKED_ARTICLES,
): Promise<BlogReport> {
  const warnings = new Set<string>();
  const safe = makeSafe(warnings);
  const { current: cur, previous: prev } = periods;

  const [eventsCur, eventsPrev, stepsCur, stepsPrev, states] = await Promise.all([
    safe(fetchUmamiMetrics(config, cur.startAt, cur.endAt, "event", 100)),
    safe(fetchUmamiMetrics(config, prev.startAt, prev.endAt, "event", 100)),
    safe(fetchUmamiEventDataValues(config, cur.startAt, cur.endAt, "blog-scroll", "palier")),
    safe(fetchUmamiEventDataValues(config, prev.startAt, prev.endAt, "blog-scroll", "palier")),
    loadArticleStates(lookupArticles, [...slugs], warnings),
  ]);

  const events = BLOG_EVENTS.map((e) => ({
    name: e.name,
    label: e.label,
    ...compare(countOf(eventsCur, e.name), countOf(eventsPrev, e.name)),
  }));
  const scrollSteps =
    stepsCur || stepsPrev
      ? SCROLL_STEPS.map((palier) => ({ palier, ...compare(stepCount(stepsCur, palier), stepCount(stepsPrev, palier)) }))
      : null;

  const articles: BlogArticleRow[] = [];
  for (const slug of slugs) {
    const state = states?.get(slug);
    if (states && !state) {
      articles.push({ slug, status: "missing" });
    } else if (state && !state.isPublished) {
      articles.push(
        state.publishedAt
          ? {
              slug,
              status: "scheduled",
              publishedAt: state.publishedAt.toISOString(),
              publishedLabel: `publication prévue le ${ddmmParis(state.publishedAt)}`,
            }
          : { slug, status: "unscheduled" },
      );
    } else {
      articles.push(await loadArticle(config, periods, slug, state ? "published" : "unknown", safe));
    }
  }

  return { partial: warnings.size > 0, warnings: [...warnings], events, scrollSteps, articles };
}
