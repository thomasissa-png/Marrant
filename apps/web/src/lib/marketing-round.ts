/**
 * Arrondi marketing des compteurs de catalogue : implémentation UNIQUE,
 * partagée par le serveur (content-stats-server) et le hook client
 * (use-content-stats). Module pur, sans Prisma, importable côté client.
 */

/**
 * Arrondi marketing (GO Thomas 03/10 : arrondi à la dizaine) :
 * - >= 10 → dizaine inférieure (125 → 120, 109 → 100, 89 → 80)
 * - 0     → 0 (permet un fallback texte "des centaines")
 */
export function roundDownMarketing(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n / 10) * 10;
}

/** Formatage `"600+"`, avec fallback texte si 0. */
export function formatCount(n: number, fallbackText: string): string {
  const rounded = roundDownMarketing(n);
  return rounded > 0 ? `${rounded}+` : fallbackText;
}
