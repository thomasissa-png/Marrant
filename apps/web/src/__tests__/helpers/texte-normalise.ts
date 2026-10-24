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

/**
 * Revue visuelle s21, tour 4 (T3-02) : « stand-up », « e-mail », « laisse-moi »… sont rendus avec un gluon
 * (U+2060, invisible) après le trait d'union, pour ne jamais être coupés en fin de ligne. `lie` pose le
 * gluon sur l'attendu comme le rendu ; `sansGluon` le retire d'un texte rendu pour une comparaison brute.
 */
export { lierComposes as lie } from "@/lib/fr-typo";
const GLUON = new RegExp(String.fromCharCode(0x2060), "g");
export const sansGluon = (texte: string): string => texte.replace(GLUON, "");

/**
 * Texte exact, avec ou sans gluon après chaque trait d'union : pour les absences (`queryByText(…)` +
 * `not.toBeInTheDocument()`), qui passeraient à vide si l'attendu n'avait plus la forme du rendu.
 */
export const avecOuSansGluon = (texte: string): RegExp =>
  new RegExp(`^${texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/-/g, `-${String.fromCharCode(0x2060)}?`)}$`);

export const normalise = (texte: string): string => courbe(texte.replace(/\s+/g, " ").trim());

/** Expression régulière qui accepte l'apostrophe droite ou typographique là où l'attendu en a une. */
export const apostropheSouple = (motif: RegExp): RegExp => new RegExp(motif.source.replace(/'/g, "['’]"), motif.flags);
