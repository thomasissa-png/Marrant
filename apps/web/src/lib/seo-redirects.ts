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
