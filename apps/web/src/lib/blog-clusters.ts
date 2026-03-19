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
];

/**
 * Find the cluster for a given article slug.
 */
export function getClusterForSlug(slug: string): ClusterInfo | undefined {
  return BLOG_CLUSTERS.find(
    (c) => c.pillarSlug === slug || c.satelliteSlugs.includes(slug),
  );
}

/**
 * Get related article slugs for a given slug (same cluster, excluding self).
 */
export function getRelatedSlugs(slug: string): string[] {
  const cluster = getClusterForSlug(slug);
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
