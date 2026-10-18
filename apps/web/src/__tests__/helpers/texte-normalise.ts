/**
 * Testing Library normalise le texte du DOM (`\s+` → espace) : une espace insécable
 * rendue devient une espace ordinaire. Pour chercher un texte de config qui en contient
 * (prix « 2,99 €/mois »), normaliser l'attendu de la même façon.
 *
 * Revue visuelle s21 (décision 4 du verdict @design) : `frTypo` affiche l'apostrophe entre deux
 * lettres en apostrophe typographique (« l’étape »), sans changer un mot. `normalise` fait de même,
 * pour comparer un texte de config (apostrophes droites) au rendu.
 */
export const courbe = (texte: string): string => texte.replace(/(\p{L})'(?=\p{L})/gu, "$1’");

export const normalise = (texte: string): string => courbe(texte.replace(/\s+/g, " ").trim());

/** Expression régulière qui accepte l'apostrophe droite ou typographique là où l'attendu en a une. */
export const apostropheSouple = (motif: RegExp): RegExp => new RegExp(motif.source.replace(/'/g, "['’]"), motif.flags);
