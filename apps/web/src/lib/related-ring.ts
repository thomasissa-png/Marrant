/**
 * Bloc « Dans la même catégorie » des fiches (s20, spec maillage S2,
 * `docs/seo/maillage-decouverte-s20.md` §4) : voisins en anneau.
 * Module pur (sans Prisma) : testable seul.
 *
 * Dans la liste dédoublonnée d'une catégorie (ordre des listes : createdAt desc,
 * id asc), la fiche en position i affiche i+1, i+2, i-1, i-2 (modulo n). Chaque
 * fiche reçoit donc exactement 4 liens de sa catégorie et la catégorie forme un
 * cycle : une seule fiche explorée donne accès à toutes les autres.
 */

export const RELATED_COUNT = 4;
const RING_OFFSETS = [1, 2, -1, -2] as const;

/**
 * @param items  liste de la catégorie, déjà dédoublonnée et triée comme les listes
 * @param isCurrent  vrai pour la fiche courante (ou une copie de même contenu)
 * @returns les voisins en anneau, jamais la fiche courante ni une copie de celle-ci.
 *   Catégorie de moins de 5 fiches : toutes les autres. Fiche absente de la liste
 *   (cache de liste plus ancien qu'une fiche toute neuve) : les 4 premières.
 */
export function ringNeighbors<T>(items: readonly T[], isCurrent: (item: T) => boolean): T[] {
  const index = items.findIndex(isCurrent);
  const others = items.filter((item) => !isCurrent(item));
  if (index === -1) return others.slice(0, RELATED_COUNT);
  const n = items.length;
  if (n <= RELATED_COUNT) return others;
  return RING_OFFSETS.map((offset) => items[(((index + offset) % n) + n) % n]);
}

/**
 * Repli des conseils (s23, 31/10/2026) : une catégorie de moins de 2 conseils
 * actifs (fiche comprise) n'a pas d'anneau. Sa fiche affiche alors les voisins
 * de la catégorie proche ci-dessous, et la première fiche de la catégorie proche
 * la lie en retour (réciprocité), à la place de son dernier voisin (i-2).
 *
 * JEUX_DE_MOTS → REPARTIE : le seul conseil actif (« Le double sens en
 * conversation ») apprend à répondre à une remarque en la prenant dans son autre
 * sens, cousin direct de « Répondre au pied de la lettre » (REPARTIE), et la
 * fiche renvoie déjà vers le parcours Répartie. ABSURDE (escalade, inventions)
 * ne joue pas sur les mots.
 */
export const MIN_RING_SIZE = 2;
export const TIP_FALLBACK_CATEGORY: Readonly<Record<string, string>> = {
  JEUX_DE_MOTS: "REPARTIE",
};

/** Catégories isolées qui se replient sur `category` (sens inverse de la table). */
export function fallbackSourcesOf(category: string): string[] {
  return Object.keys(TIP_FALLBACK_CATEGORY).filter((source) => TIP_FALLBACK_CATEGORY[source] === category);
}

/**
 * Voisins de la première fiche d'une catégorie proche : la ou les fiches isolées
 * prennent les dernières places (sans doublon), les premiers voisins de l'anneau
 * restent en place.
 */
export function withFallbackGuests<T>(neighbors: readonly T[], guests: readonly T[], sameItem: (a: T, b: T) => boolean): T[] {
  const fresh = guests.filter((g) => !neighbors.some((n) => sameItem(n, g)));
  if (fresh.length === 0) return [...neighbors];
  const keep = Math.max(0, Math.min(neighbors.length, RELATED_COUNT - fresh.length));
  return [...neighbors.slice(0, keep), ...fresh].slice(0, RELATED_COUNT);
}
