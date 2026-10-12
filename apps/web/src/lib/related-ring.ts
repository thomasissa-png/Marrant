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
