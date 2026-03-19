/**
 * Blog cluster configuration for internal linking and navigation.
 * Maps each article to its cluster for related article logic.
 */

export interface ClusterInfo {
  id: string;
  name: string;
  pillarSlug: string;
  satelliteSlugs: string[];
}

export const BLOG_CLUSTERS: ClusterInfo[] = [
  {
    id: "apprendre-humour",
    name: "Apprendre à devenir drôle",
    pillarSlug: "comment-devenir-drole",
    satelliteSlugs: ["humour-quotidien-8-habitudes", "exercices-developper-humour", "devenir-drole-30-jours", "pourquoi-blagues-marchent-pas", "erreurs-blagues"],
  },
  {
    id: "techniques-repartie",
    name: "Techniques de répartie",
    pillarSlug: "comment-avoir-de-la-repartie",
    satelliteSlugs: ["repartie-debutant-5-etapes", "repartie-soiree-anti-malaise", "timidite-et-humour", "autoderision-interactions"],
  },
  {
    id: "techniques-delivery",
    name: "Techniques de livraison",
    pillarSlug: "timing-humour",
    satelliteSlugs: ["timing-humour-ralentir", "raconter-blague-sans-massacrer", "storytelling-drole-5-structures"],
  },
  {
    id: "types-humour",
    name: "Types d'humour",
    pillarSlug: "5-types-humour-lequel-pour-toi",
    satelliteSlugs: ["humour-noir-utiliser-sans-blesser", "jeux-de-mots-technique-3-etapes", "humour-self-deprecating"],
  },
  {
    id: "humour-contexte",
    name: "Humour en contexte",
    pillarSlug: "blagues-travail-faire-rire-pro",
    satelliteSlugs: ["repartie-soiree-anti-malaise", "humour-apres-rupture", "blagues-courtes-vs-longues", "conversation-machine-a-cafe"],
  },
  {
    id: "apprendre-des-pros",
    name: "Apprendre des pros",
    pillarSlug: "techniques-standup-vie-sociale",
    satelliteSlugs: ["voler-techniques-standup-soiree", "processus-creatif-humoristes-applique", "parcours-humour-30-jours-retour"],
  },
  {
    id: "douleurs-personas",
    name: "Douleurs et situations concrètes",
    pillarSlug: "je-suis-pas-drole-comment-changer",
    satelliteSlugs: ["repondre-moqueries-avec-humour", "jamais-quoi-repondre-techniques", "conversation-machine-a-cafe", "confiance-humour-apres-rupture", "rester-muet-en-groupe"],
  },
  {
    id: "fort-volume",
    name: "Mots-clés fort volume (acquisition)",
    pillarSlug: "meilleures-blagues-droles-2026",
    satelliteSlugs: ["phrases-droles-conversations", "comment-faire-rire-une-fille", "comment-faire-rire-un-homme", "comment-faire-rire-ses-amis", "creer-ses-propres-blagues"],
  },
  {
    id: "saisonnier",
    name: "Contenu saisonnier (pics de trafic)",
    pillarSlug: "blagues-fetes-noel-nouvel-an",
    satelliteSlugs: ["humour-saint-valentin", "humour-rentree-glace-brisee"],
  },
];

/**
 * Category → cluster fallback mapping.
 * Used when a DB article's slug isn't pre-registered in BLOG_CLUSTERS.
 */
const CATEGORY_TO_CLUSTER: Record<string, string> = {
  GUIDE: "apprendre-humour",
  PRATIQUE: "apprendre-humour",
  ROADMAP: "apprendre-humour",
  HABITUDES: "apprendre-humour",
  OBSERVATION: "apprendre-humour",
  REPARTIE: "techniques-repartie",
  AUTODERISION: "techniques-repartie",
  TIMING: "techniques-delivery",
  STORYTELLING: "techniques-delivery",
  ANALYSE: "apprendre-des-pros",
  CONTEXTE: "humour-contexte",
  PSYCHOLOGIE: "douleurs-personas",
  TEMOIGNAGE: "douleurs-personas",
  CATALOGUE: "fort-volume",
  SAISONNIER: "saisonnier",
};

/**
 * Find the cluster for a given article slug.
 */
export function getClusterForSlug(slug: string): ClusterInfo | undefined {
  return BLOG_CLUSTERS.find(
    (c) => c.pillarSlug === slug || c.satelliteSlugs.includes(slug),
  );
}

/**
 * Find the best cluster for a DB article that isn't in any pre-defined cluster.
 * Falls back to category-based matching.
 */
export function getClusterForCategory(category: string): ClusterInfo | undefined {
  const clusterId = CATEGORY_TO_CLUSTER[category];
  if (!clusterId) return undefined;
  return BLOG_CLUSTERS.find((c) => c.id === clusterId);
}

/**
 * Resolve cluster for an article: first by slug, then by category fallback.
 */
export function resolveCluster(
  slug: string,
  category?: string,
): ClusterInfo | undefined {
  return getClusterForSlug(slug) || (category ? getClusterForCategory(category) : undefined);
}

/**
 * Get related article slugs for a given slug (same cluster, excluding self).
 */
export function getRelatedSlugs(slug: string, category?: string): string[] {
  const cluster = resolveCluster(slug, category);
  if (!cluster) return [];
  const allSlugs = [cluster.pillarSlug, ...cluster.satelliteSlugs];
  return allSlugs.filter((s) => s !== slug);
}

/**
 * Get the next article in cluster sequence (pillar → satellites in order).
 * Returns null if this is the last article or not in a cluster.
 */
export function getNextInCluster(slug: string): string | null {
  const cluster = getClusterForSlug(slug);
  if (!cluster) return null;
  const sequence = [cluster.pillarSlug, ...cluster.satelliteSlugs];
  const currentIndex = sequence.indexOf(slug);
  if (currentIndex === -1 || currentIndex === sequence.length - 1) return null;
  return sequence[currentIndex + 1];
}

/**
 * Get the previous article in cluster sequence.
 */
export function getPrevInCluster(slug: string): string | null {
  const cluster = getClusterForSlug(slug);
  if (!cluster) return null;
  const sequence = [cluster.pillarSlug, ...cluster.satelliteSlugs];
  const currentIndex = sequence.indexOf(slug);
  if (currentIndex <= 0) return null;
  return sequence[currentIndex - 1];
}
