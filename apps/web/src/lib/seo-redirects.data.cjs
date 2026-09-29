/**
 * Source de vérité des redirections 301 — format CommonJS pour être consommé
 * par next.config.js (qui n'est pas encore .ts).
 *
 * Import côté TS : passer par `src/lib/seo-redirects.ts` (qui re-exporte
 * ces données avec les types).
 *
 * Règles :
 * - Toujours `permanent: true` (301) pour préserver le PageRank.
 * - Ne JAMAIS renommer un slug sans ajouter la redirection ici en même temps.
 * - Les slugs datés (ex. `-2026`) DOIVENT avoir une version pérenne + redirection.
 */
const SEO_REDIRECTS = [
  // Ancien namespace "blagues" — renommé "vannes" (mars 2026)
  { source: "/blagues", destination: "/vannes", permanent: true },

  // Fusions anti-cannibalisation blog (mars 2026)
  { source: "/blog/devenir-marrant", destination: "/blog/comment-devenir-drole", permanent: true },
  { source: "/blog/devenir-plus-drole", destination: "/blog/comment-devenir-drole", permanent: true },
  { source: "/blog/apprendre-a-etre-drole", destination: "/blog/comment-devenir-drole", permanent: true },
  { source: "/blog/apprendre-etre-drole", destination: "/blog/comment-devenir-drole", permanent: true },
  { source: "/blog/techniques-repartie", destination: "/blog/comment-avoir-de-la-repartie", permanent: true },

  // Slug daté (session 11) — version pérenne pour éviter la dépréciation SEO annuelle.
  // Le contenu vit désormais sous le slug pérenne ; l'URL datée redirige.
  { source: "/blog/meilleures-blagues-droles-2026", destination: "/blog/meilleures-blagues-droles", permanent: true },
];

module.exports = { SEO_REDIRECTS };
