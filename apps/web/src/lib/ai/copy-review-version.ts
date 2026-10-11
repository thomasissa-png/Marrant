/**
 * Version courante de la charte de relecture (copy-review). Module sans
 * dépendance (pas de client LLM) : importable par daily-publisher,
 * quality-watch et les routes sans embarquer le SDK.
 */

/**
 * Version de charte (entier ≥ 1). Valeur absente ou invalide → 1 : un `NaN`
 * ferait échouer toutes les écritures Prisma (`copyReviewVersion` Int).
 */
export function parseCopyReviewVersion(raw: string | undefined): number {
  const n = Number.parseInt((raw ?? "").trim(), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export const COPY_REVIEW_VERSION = parseCopyReviewVersion(process.env.COPY_REVIEW_VERSION);
