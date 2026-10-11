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
 * - Ne JAMAIS changer l'URL d'une page qui se positionne (ex. /blog/meilleures-blagues-droles-2026,
 *   page n°1 en SEO — choix fondateur 29/09/2026), même si elle contient une année.
 * - `kind: "rename"` = même article sous un nouveau slug : la tâche de boot
 *   `convergeBlogSlugRedirectsTask` renomme alors l'entrée en base. Les autres
 *   redirections (fusions, cannibalisation) ne touchent JAMAIS au slug en base
 *   (les perdants sont dépubliés par `depublishCannibalizedDbArticlesTask`).
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


  // Cannibalisation s11 (audit SEO 29/09/2026, §3.3) — article perdant → article gardé.
  { source: "/blog/ne-plus-rester-muet-en-groupe", destination: "/blog/rester-muet-en-groupe", permanent: true, reason: "Cannibalisation s11 : rester-muet-en-groupe = pillar propre, sans témoignages fictifs." },
  { source: "/blog/je-ne-sais-jamais-quoi-repondre", destination: "/blog/jamais-quoi-repondre-techniques", permanent: true, reason: "Cannibalisation s11 : jamais-quoi-repondre-techniques = article statique plus complet." },
  { source: "/blog/timing-humour-ralentir", destination: "/blog/timing-humour", permanent: true, reason: "Cannibalisation s11 : timing-humour est le pillar, ralentir est un angle satellite absorbable." },
  { source: "/blog/raconter-blague-sans-massacrer", destination: "/blog/comment-raconter-une-blague-sans-la-rater", permanent: true, reason: "Cannibalisation s11 : slug SEO-friendly (\"comment X\") privilégié." },
  { source: "/blog/jeux-de-mots-technique-3-etapes", destination: "/blog/jeu-de-mots-drole-techniques-creer", permanent: true, reason: "Cannibalisation s11 : jeu-de-mots-drole plus récent + slug mot-clé cible plus large." },
  { source: "/blog/humour-apres-rupture", destination: "/blog/confiance-humour-apres-rupture", permanent: true, reason: "Cannibalisation s11 : confiance-humour couvre l'intention émotionnelle plus large." },
  { source: "/blog/blagues-courtes-vs-longues", destination: "/blog/blague-courte-arme-secrete-humour", permanent: true, reason: "Cannibalisation s11 : arme-secrete = angle unique + lastmod récent." },
  { source: "/blog/apprendre-la-repartie-methode-30-jours", destination: "/blog/comment-avoir-de-la-repartie", permanent: true, reason: "Cannibalisation s11 : comment-avoir-de-la-repartie = pillar du cluster." },
];

module.exports = { SEO_REDIRECTS };
