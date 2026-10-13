/**
 * Parcours d'un article de blog (s17 reco 14, étendu en s20 aux 5 parcours).
 *
 * Ordre : table par slug (config/blog-encarts.ts, PARCOURS_PAR_ARTICLE), sinon
 * cluster de l'article, sinon Répartie (le plus large). La même règle sert à
 * l'encart au fil du texte et au bloc de fin : les deux mènent au même parcours
 * (sauf encart imposé par ENCARTS_IMPOSES, ex. Boulot dans l'article n°1).
 */
import { resolveCluster } from "@/lib/blog-clusters";
import { PARCOURS_PAR_ARTICLE } from "@/config/blog-encarts";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

/** Cluster → parcours (s17 ; s20 : fort-volume → Répartie, humour-contexte → Boulot). Cluster inconnu : Répartie. */
export const PARCOURS_PAR_CLUSTER: Readonly<Record<string, ParcoursSlug>> = {
  "techniques-repartie": "repartie",
  "apprendre-humour": "repartie",
  "apprendre-des-pros": "repartie",
  "techniques-delivery": "repartie",
  "types-humour": "repartie",
  "douleurs-personas": "confiance",
  "humour-contexte": "boulot",
  "fort-volume": "repartie",
  saisonnier: "machine-a-cafe",
};

export const PARCOURS_PAR_DEFAUT: ParcoursSlug = "repartie";

export function resolveArticleParcours(articleSlug: string, articleCategory?: string): ParcoursSlug {
  const forced = PARCOURS_PAR_ARTICLE[articleSlug];
  if (forced) return forced;
  const cluster = resolveCluster(articleSlug, articleCategory);
  return (cluster && PARCOURS_PAR_CLUSTER[cluster.id]) || PARCOURS_PAR_DEFAUT;
}
