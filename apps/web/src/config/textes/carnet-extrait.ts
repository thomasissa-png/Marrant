/**
 * Extrait du carnet sur /abonnement (lot 2 s21, docs/copy/lot2-boutons-abonnement-s21.md §5.5).
 *
 * VALIDÉ à l'aveugle s21 (tour 2 : 3/3 au niveau), à une condition de mise en
 * ligne : tout est calculé à partir du carnet du mois en cours (mois, fiche offerte
 * et sa position, nombre d'autres situations), rien n'est écrit en dur.
 */

/**
 * Surtitre, affiché en majuscules par le style : « Carnet d'octobre · Situation 15, offerte ».
 * `deMois` = « d'octobre », « de novembre » (`deMoisSeul`, lib/carnet.ts) ; `numero` =
 * position réelle de la fiche offerte dans le carnet (index + 1, `CarnetExtrait.numero`).
 */
export function carnetExtraitSurtitre(deMois: string, numero: number): string {
  return `Carnet ${deMois} · Situation ${numero}, offerte`;
}

export const CARNET_EXTRAIT_TITRE = "Le carnet, en vrai";

/**
 * Phrase d'intro selon le nombre d'autres situations du mois (`totalFiches - 1`) :
 * pluriel en chiffres à partir de 2, singulier pour 1, aucune phrase pour 0.
 */
export function carnetExtraitIntro(autres: number): string | null {
  if (!Number.isFinite(autres) || autres < 1) return null;
  if (autres === 1) return "L'autre situation du mois est dans Premium.";
  return `Les ${Math.floor(autres)} autres situations du mois sont dans Premium.`;
}

/** Lien en contour vers /carnet (la fiche y est entière, en accès libre). */
export const CARNET_EXTRAIT_LIEN = "Lire la fiche en entier";
