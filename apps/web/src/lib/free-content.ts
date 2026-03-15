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
 * Avec FREE_LIMIT = 50 blagues, le set complet se renouvelle en 50 jours.
 * Avec FREE_LIMIT = 15 conseils, le set se renouvelle en 15 jours.
 * Avec FREE_LIMIT = 25 vidéos, le set se renouvelle en 25 jours.
 *
 * Si `getCategoryKey` est fourni, la résolution de collisions favorise
 * les catégories sous-représentées pour garantir la diversité.
 *
 * @param items - Tous les items actifs, triés par id asc
 * @param freeLimit - Nombre d'items gratuits à montrer
 * @param prime - Nombre premier pour la dispersion (unique par type de contenu)
 * @param getCategoryKey - Optionnel : extracteur de catégorie pour la diversité
 * @returns Les items sélectionnés pour aujourd'hui
 */
export function selectSlidingFreeItems<T>(
  items: T[],
  freeLimit: number,
  prime: number,
  getCategoryKey?: (item: T) => string
): T[] {
  const count = items.length;
  if (count === 0) return [];
  if (count <= freeLimit) return items;

  const epochDay = getEpochDay(todayUTC());
  const selected: T[] = [];
  const seen = new Set<number>();
  const categoryCounts = new Map<string, number>();

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

    // Diversité catégories : si on a déjà trop d'items de cette catégorie,
    // chercher un item d'une catégorie sous-représentée
    if (getCategoryKey && selected.length >= 3) {
      const candidateCategory = getCategoryKey(items[idx]);
      const maxPerCategory = Math.ceil(freeLimit / 3); // Max ~33% par catégorie

      if ((categoryCounts.get(candidateCategory) ?? 0) >= maxPerCategory) {
        // Chercher un item d'une catégorie moins représentée
        let betterIdx = idx;
        let found = false;
        for (let j = 1; j < count && !found; j++) {
          const altIdx = (idx + j) % count;
          if (seen.has(altIdx)) continue;
          const altCategory = getCategoryKey(items[altIdx]);
          if ((categoryCounts.get(altCategory) ?? 0) < maxPerCategory) {
            betterIdx = altIdx;
            found = true;
          }
        }
        idx = betterIdx;
      }
    }

    seen.add(idx);
    selected.push(items[idx]);

    if (getCategoryKey) {
      const cat = getCategoryKey(items[idx]);
      categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
    }
  }

  return selected;
}
