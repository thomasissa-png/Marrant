/**
 * Calcule le jour de l'année (1-366) pour une date UTC donnée.
 * Utilisé pour le fallback déterministe (même résultat partout).
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Construit une date UTC à minuit pour aujourd'hui.
 */
export function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
