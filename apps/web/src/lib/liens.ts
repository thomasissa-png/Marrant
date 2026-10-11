/**
 * Lien de bio des réseaux (stratégie de relance v5, §2.1 et §2.2).
 * Trois routes statiques : `/liens` (Instagram), `/liens/x`, `/liens/li`.
 * Chaque lien porte `utm_source` du réseau, `utm_medium=social`,
 * `utm_campaign=bio` et le `utm_content` de son bloc.
 */
import type { Contenu, Origine } from "@/lib/attribution";

/** Segment d'URL après `/liens` → `utm_source` (`null` = `/liens`, Instagram). */
export const LIENS_RESEAUX = { x: "x", li: "linkedin" } as const satisfies Record<string, Origine>;
export type LiensSegment = keyof typeof LIENS_RESEAUX;

export function origineFromSegment(segment: string | null | undefined): Origine | null {
  if (segment === null || segment === undefined) return "instagram";
  return Object.prototype.hasOwnProperty.call(LIENS_RESEAUX, segment)
    ? LIENS_RESEAUX[segment as LiensSegment]
    : null;
}

export type LiensBloc = "article" | "quiz" | "vanne" | "parcours" | "vannes" | "conseils";

export const BLOC_CONTENT: Record<LiensBloc, Contenu> = {
  article: "bio-article",
  quiz: "bio-quiz",
  vanne: "bio-vanne",
  parcours: "bio-parcours",
  vannes: "bio-vannes",
  conseils: "bio-conseils",
};

/** Ajoute les UTM du lien de bio d'un réseau à un chemin interne. */
export function buildBioHref(path: string, origine: Origine, bloc: LiensBloc): string {
  const params = new URLSearchParams({
    utm_source: origine,
    utm_medium: "social",
    utm_campaign: "bio",
    utm_content: BLOC_CONTENT[bloc],
  });
  return `${path}${path.includes("?") ? "&" : "?"}${params.toString()}`;
}

/** Fenêtre pendant laquelle l'article passe avant le quiz (v5 §2.2). */
export const ARTICLE_RECENT_MS = 48 * 60 * 60 * 1000;

export function isArticleRecent(publishedAt: string | null | undefined, now: Date): boolean {
  if (!publishedAt) return false;
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  const age = now.getTime() - published;
  return age >= 0 && age < ARTICLE_RECENT_MS;
}

/**
 * Ordre des blocs : (1) l'article s'il est publié depuis moins de 48 h, sinon
 * le quiz ; (2) l'autre des deux ; (3) vanne du jour ; (4) parcours Répartie ;
 * (5) toutes les vannes ; (6) conseils. Un bloc sans contenu (pas d'article,
 * pas de vanne du jour) est retiré, l'ordre des autres ne change pas.
 */
export function orderLiensBlocs(
  { articlePublishedAt, hasArticle, hasVanne }: { articlePublishedAt: string | null; hasArticle: boolean; hasVanne: boolean },
  now: Date,
): LiensBloc[] {
  const tete: LiensBloc[] = isArticleRecent(articlePublishedAt, now) ? ["article", "quiz"] : ["quiz", "article"];
  const blocs: LiensBloc[] = [...tete, "vanne", "parcours", "vannes", "conseils"];
  return blocs.filter((b) => (b === "article" ? hasArticle : b === "vanne" ? hasVanne : true));
}
