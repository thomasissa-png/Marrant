/**
 * Filtre `category notIn [...]` du repli catalogue, restreint aux valeurs de
 * l'enum ciblé. Incident s14 : la catégorie de la vanne du jour (ex. BOULOT,
 * enum JokeCategory) était passée telle quelle au filtre des conseils (enum
 * TipCategory) → PrismaClientValidationError → publishDailyContent levait
 * APRÈS la création de la vanne : vanne orpheline, pas de DailyContent, et
 * relance à chaque tick.
 */
export function categoryExclusion(
  used: ReadonlySet<string>,
  allowed: readonly string[],
): { category?: { notIn: never } } {
  const excluded = Array.from(used).filter((c) => allowed.includes(c));
  return excluded.length > 0 ? { category: { notIn: excluded as never } } : {};
}
