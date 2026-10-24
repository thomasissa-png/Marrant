import { stripEmDashes } from "@/lib/em-dash";
import { frenchQuizQuotes } from "@/lib/parcours-labels";
import { frTypo } from "@/lib/fr-typo";

/**
 * Texte courant d'un conseil venu de la base (contenu, exemple, exercice),
 * AU RENDU uniquement : tirets cadratins retirés (règle 12) et répliques entre
 * apostrophes droites passées en « … ». Ponctuation seulement, aucun mot
 * modifié ; le texte stocké reste intact. Jamais sur les titres.
 */
export function tipProse(text: string): string {
  return frenchQuizQuotes(stripEmDashes(text));
}

/**
 * Texte de contenu venu de la base (vannes, décryptages, vidéos), AU RENDU : `tipProse` puis
 * `frTypo` (apostrophes typographiques, insécables). Revue visuelle s21, décision 4 du verdict
 * @design. Ponctuation seulement, aucun mot modifié, la donnée stockée reste intacte.
 */
export function contenuAffiche(text: string): string {
  return frTypo(tipProse(text));
}
