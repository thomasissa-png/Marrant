import { todayUTC } from "@/lib/ai/date-utils";

/**
 * Calcule le nombre de jours depuis l'epoch Unix (jour absolu).
 */
function getEpochDay(date: Date): number {
  return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
}

/**
 * Fenêtre glissante circulaire pour le contenu gratuit.
 *
 * Chaque jour, la fenêtre avance de 1 position dans la liste triée par ID.
 * Résultat : exactement 1 item entre et 1 item sort par jour.
 *
 * Avec FREE_LIMIT = 50 blagues et 200 au total, le set complet
 * se renouvelle en 200 jours (1 blague/jour).
 *
 * @param items - Tous les items actifs, triés par id asc (ordre stable)
 * @param freeLimit - Nombre d'items gratuits à montrer
 * @returns Les items sélectionnés pour aujourd'hui
 */
export function selectSlidingFreeItems<T>(
  items: T[],
  freeLimit: number,
): T[] {
  const count = items.length;
  if (count === 0) return [];
  if (count <= freeLimit) return items;

  const epochDay = getEpochDay(todayUTC());
  const offset = epochDay % count;

  // Fenêtre circulaire qui avance de 1 par jour
  const result: T[] = [];
  for (let i = 0; i < freeLimit; i++) {
    result.push(items[(offset + i) % count]);
  }

  return result;
}

/**
 * Insère le contenu du jour en première position et retire le dernier élément.
 * Si le dailyItem est déjà dans la liste, il est déplacé en position 0.
 * Si la liste est vide ou si dailyItem est null, retourne la liste telle quelle.
 *
 * @param items - La liste d'items (sortie de selectSlidingFreeItems)
 * @param dailyItemId - L'ID de l'item du jour (depuis DailyContent)
 * @param getId - Fonction pour extraire l'ID d'un item
 * @param freeLimit - Nombre max d'items gratuits
 * @returns La liste avec le daily en premier
 */
export function insertDailyFirst<T>(
  items: T[],
  dailyItemId: string | null | undefined,
  getId: (item: T) => string,
  freeLimit: number,
): T[] {
  if (!dailyItemId || items.length === 0) return items;

  // Vérifier si le daily est déjà dans la liste
  const existingIdx = items.findIndex((item) => getId(item) === dailyItemId);

  if (existingIdx === 0) {
    // Déjà en première position
    return items;
  }

  if (existingIdx > 0) {
    // Le daily est dans la liste mais pas en premier : le déplacer en tête
    const [dailyItem] = items.splice(existingIdx, 1);
    return [dailyItem, ...items].slice(0, freeLimit);
  }

  // Le daily n'est pas dans la liste : on ne l'ajoute pas
  // (il sera affiché séparément dans le "contenu du jour")
  return items;
}
