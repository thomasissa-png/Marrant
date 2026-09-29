import { stripEmDashes } from "@/lib/em-dash";
import { frenchQuizQuotes } from "@/lib/parcours-labels";

/**
 * Texte courant d'un conseil venu de la base (contenu, exemple, exercice),
 * AU RENDU uniquement : tirets cadratins retirés (règle 12) et répliques entre
 * apostrophes droites passées en « … ». Ponctuation seulement, aucun mot
 * modifié ; le texte stocké reste intact. Jamais sur les titres.
 */
export function tipProse(text: string): string {
  return frenchQuizQuotes(stripEmDashes(text));
}
