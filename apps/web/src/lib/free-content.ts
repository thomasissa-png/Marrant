import { todayUTC } from "@/lib/ai/date-utils";

/**
 * Calcule le nombre de jours depuis l'epoch Unix (jour absolu).
 * Évite les problèmes de frontière d'année de getDayOfYear.
 */
function getEpochDay(date: Date): number {
  return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
}

/**
 * Sélection glissante pour contenu gratuit.
 *
 * Chaque jour, seul le plus ancien élément est remplacé par un nouveau.
 * Résultat : rotation douce (1 item/jour) au lieu de tout changer d'un coup.
 *
 * Avec FREE_LIMIT = 20 blagues, le set complet se renouvelle en 20 jours.
 * Avec FREE_LIMIT = 5 conseils, le set se renouvelle en 5 jours.
 * Avec FREE_LIMIT = 10 vidéos, le set se renouvelle en 10 jours.
 *
 * @param items - Tous les items actifs, triés par id asc
 * @param freeLimit - Nombre d'items gratuits à montrer
 * @param prime - Nombre premier pour la dispersion (unique par type de contenu)
 * @returns Les items sélectionnés pour aujourd'hui
 */
export function selectSlidingFreeItems<T>(
  items: T[],
  freeLimit: number,
  prime: number
): T[] {
  const count = items.length;
  if (count === 0) return [];
  if (count <= freeLimit) return items;

  const epochDay = getEpochDay(todayUTC());
  const selected: T[] = [];
  const seen = new Set<number>();

  // Itérer du plus ancien (freeLimit-1 jours en arrière) au plus récent (aujourd'hui)
  // Chaque slot a un "jour d'attribution" fixe — seul slot 0 change demain
  for (let i = freeLimit - 1; i >= 0; i--) {
    const assignDay = epochDay - i;
    // Hash déterministe : même assignDay → même item, jour après jour
    const rawIdx = (((assignDay * prime) % count) + count) % count;

    // Résoudre les collisions par sondage linéaire (rare car freeLimit << count)
    let idx = rawIdx;
    let attempts = 0;
    while (seen.has(idx) && attempts < count) {
      idx = (idx + 1) % count;
      attempts++;
    }
    seen.add(idx);
    selected.push(items[idx]);
  }

  return selected;
}
