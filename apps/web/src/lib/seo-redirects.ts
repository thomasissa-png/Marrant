/**
 * Redirections 301 centralisées pour le SEO.
 *
 * Cette source unique est consommée par `next.config.js` (redirects()) au build.
 * Voir `seo-redirects.data.cjs` pour la version consommée par next.config.js
 * (CommonJS obligatoire tant que next.config n'est pas .ts).
 *
 * Règles :
 * - Toujours `permanent: true` (301) pour préserver le PageRank.
 * - Ne JAMAIS renommer un slug sans ajouter la redirection ici en même temps.
 * - Les slugs datés (ex. `-2026`) doivent avoir une version pérenne + redirection.
 */
export interface SeoRedirect {
  source: string;
  destination: string;
  permanent: true;
  /** Contexte pour humains — ignoré par Next.js. */
  reason?: string;
  /** "rename" = même article sous un nouveau slug (renommé en base au boot). */
  kind?: "rename";
}

// Import CommonJS obligatoire : next.config.js (JS) doit consommer les mêmes
// données que ce module TS. Le fichier .cjs est la seule source de vérité.
/* eslint-disable-next-line */
const data = require("./seo-redirects.data.cjs") as {
  SEO_REDIRECTS: SeoRedirect[];
};

export const SEO_REDIRECTS: readonly SeoRedirect[] = data.SEO_REDIRECTS;

/**
 * Retourne true si une redirection existe déjà pour ce chemin source.
 * Utile pour les tests de non-régression et l'insertion idempotente.
 */
export function hasRedirect(source: string): boolean {
  return SEO_REDIRECTS.some((r) => r.source === source);
}

/**
 * Slugs statiques (fichier `blog-articles.ts`) à EXCLURE du sitemap et de la
 * liste blog car dépubliés en s11 (fusion cannibalisation).
 *
 * Les DB articles perdants sont dépubliés via la tâche startup
 * `depublishCannibalizedDbArticlesTask` (isPublished = false).
 *
 * Les 5 slugs ci-dessous ne peuvent pas être flaggés en DB (source statique),
 * on filtre donc à la lecture (sitemap.ts + blog/page.tsx).
 */
export const UNPUBLISHED_STATIC_SLUGS = new Set<string>([
  "timing-humour-ralentir",
  "raconter-blague-sans-massacrer",
  "jeux-de-mots-technique-3-etapes",
  "humour-apres-rupture",
  "blagues-courtes-vs-longues",
]);

/**
 * Slugs DB à dépublier (isPublished = false) en s11 pour la fusion cannibalisation.
 * Utilisé par `depublishCannibalizedDbArticlesTask` dans startup-tasks.ts.
 *
 * Cette liste couvre uniquement les 3 paires où la version DB est la PERDANTE
 * (pour les autres paires, c'est le statique qui est perdant → voir
 * `UNPUBLISHED_STATIC_SLUGS`).
 */
export const DB_LOSER_SLUGS: readonly string[] = [
  "ne-plus-rester-muet-en-groupe",
  "je-ne-sais-jamais-quoi-repondre",
  "apprendre-la-repartie-methode-30-jours",
];
