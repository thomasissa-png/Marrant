/**
 * Redirects SEO — source unique de vérité pour les 301.
 *
 * Consommé par :
 *  - `next.config.js` → `redirects()` (renvoie 301 côté serveur)
 *  - `sitemap.ts` → exclut les sources du sitemap XML
 *  - `blog/page.tsx` → exclut les articles dépubliés de la liste blog
 *
 * Format volontairement plat (tableau simple) pour faciliter la fusion
 * avec d'autres lots (ex. un slug daté ajouté par un autre agent).
 *
 * Ajouté en s11 (lot 3) — traite les 8 paires de cannibalisation
 * identifiées par l'audit SEO du 29 septembre 2026 (docs/seo/audit-global-s11.md §3.3).
 */

export interface SeoRedirect {
  source: string;
  destination: string;
  permanent: true;
  /** Contexte pour humains — pas utilisé par Next.js. */
  reason?: string;
}

/**
 * Tous les redirects 301 du site. Ordre alphabétique par `source`.
 *
 * Contient :
 *  - Anciennes fusions (mars 2026) : /blagues, /blog/devenir-*.
 *  - Fusions anti-cannibalisation s11 : 6 slugs perdants → gardés.
 */
export const SEO_REDIRECTS: SeoRedirect[] = [
  // ─── Historique (mars 2026) ─────────────────────────────
  { source: "/blagues", destination: "/vannes", permanent: true },
  {
    source: "/blog/devenir-marrant",
    destination: "/blog/comment-devenir-drole",
    permanent: true,
  },
  {
    source: "/blog/devenir-plus-drole",
    destination: "/blog/comment-devenir-drole",
    permanent: true,
  },
  {
    source: "/blog/apprendre-a-etre-drole",
    destination: "/blog/comment-devenir-drole",
    permanent: true,
  },
  {
    source: "/blog/apprendre-etre-drole",
    destination: "/blog/comment-devenir-drole",
    permanent: true,
  },
  {
    source: "/blog/techniques-repartie",
    destination: "/blog/comment-avoir-de-la-repartie",
    permanent: true,
  },

  // ─── Cannibalisation s11 (audit SEO 29/09/2026, §3.3) ────
  // Paire 1 — Silence en groupe : garder rester-muet (plus structuré, meilleur fond, sans témoignages fictifs).
  {
    source: "/blog/ne-plus-rester-muet-en-groupe",
    destination: "/blog/rester-muet-en-groupe",
    permanent: true,
    reason: "Cannibalisation s11 : rester-muet-en-groupe = pillar propre, sans témoignages fictifs.",
  },
  // Paire 2 — Quoi répondre : garder jamais-quoi-repondre (slug SEO-friendly + contenu statique complet).
  {
    source: "/blog/je-ne-sais-jamais-quoi-repondre",
    destination: "/blog/jamais-quoi-repondre-techniques",
    permanent: true,
    reason: "Cannibalisation s11 : jamais-quoi-repondre-techniques = article statique plus complet.",
  },
  // Paire 3 — Timing : garder timing-humour (pillar cluster techniques-delivery).
  {
    source: "/blog/timing-humour-ralentir",
    destination: "/blog/timing-humour",
    permanent: true,
    reason: "Cannibalisation s11 : timing-humour est le pillar, ralentir est un angle satellite absorbable.",
  },
  // Paire 4 — Raconter blague : garder comment-raconter (slug SEO-friendly recommandé par audit).
  {
    source: "/blog/raconter-blague-sans-massacrer",
    destination: "/blog/comment-raconter-une-blague-sans-la-rater",
    permanent: true,
    reason: "Cannibalisation s11 : slug SEO-friendly (\"comment X\") privilégié.",
  },
  // Paire 5 — Jeux de mots : garder jeu-de-mots-drole (plus récent, lastmod DB — audit SEO).
  {
    source: "/blog/jeux-de-mots-technique-3-etapes",
    destination: "/blog/jeu-de-mots-drole-techniques-creer",
    permanent: true,
    reason: "Cannibalisation s11 : jeu-de-mots-drole plus récent + slug mot-clé cible plus large.",
  },
  // Paire 6 — Humour après rupture : garder confiance-humour-apres-rupture (angle plus riche : confiance + humour).
  {
    source: "/blog/humour-apres-rupture",
    destination: "/blog/confiance-humour-apres-rupture",
    permanent: true,
    reason: "Cannibalisation s11 : confiance-humour couvre l'intention émotionnelle plus large.",
  },
  // Paire 7 — Blagues courtes : garder blague-courte-arme-secrete (lastmod récent + angle unique).
  {
    source: "/blog/blagues-courtes-vs-longues",
    destination: "/blog/blague-courte-arme-secrete-humour",
    permanent: true,
    reason: "Cannibalisation s11 : arme-secrete = angle unique + lastmod récent.",
  },
  // Paire 8 — Apprendre répartie : garder comment-avoir-de-la-repartie (pillar cluster techniques-repartie).
  {
    source: "/blog/apprendre-la-repartie-methode-30-jours",
    destination: "/blog/comment-avoir-de-la-repartie",
    permanent: true,
    reason: "Cannibalisation s11 : comment-avoir-de-la-repartie = pillar du cluster.",
  },
];

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
