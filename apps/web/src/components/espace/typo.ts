/**
 * Échelle typographique de l'espace (s25, `docs/design/typo-harmonie-espace-s25.md` §1, retour de Thomas du 16/11 :
 * « combien de tailles de police différentes ? »). Source unique des classes de taille, de graisse et de casse :
 * 4 tailles (14, 16, 20, et 24 sous 1024 px ou 30 au-delà), 2 graisses (400, 600), aucune capitale, 2 gris de texte.
 * Police d'affichage (Plus Jakarta Sans) pour les deux titres seulement, chiffres mis en valeur compris ; tout le
 * reste en Inter. Appliquée d'abord à « Aujourd'hui » et à son aperçu verrouillé ; les autres pages suivront.
 */

/** Titre de page (H1) : 24/32, 30/36 dès 1024 px, 600. */
export const TITRE_PAGE = "font-display text-2xl font-semibold text-text-primary lg:text-3xl [text-wrap:balance]";

/** Titre de carte et chiffre mis en valeur (XP, série, cap, preuve) : 20/28, 600, chiffres alignés. */
export const TITRE_CARTE = "font-display text-xl font-semibold tabular-nums text-text-primary [text-wrap:balance]";

/** Texte courant : 16/24, 400, gris secondaire. */
export const TEXTE = "text-base text-text-secondary";

/** Texte fort (boutons, punchline) : 16/24, 600, blanc. */
export const TEXTE_FORT = "text-base font-semibold text-text-primary";

/** Méta (durée, échelle, phrases d'appoint, pastilles) : 14/20, 400, gris secondaire. */
export const META = "text-sm text-text-secondary";

/** Méta forte (valeur, pied de tuile, pastille du hero) : 14/20, 600, blanc. */
export const META_FORT = "text-sm font-semibold text-text-primary";

/** Étiquette (casse normale) : 14/20, 600, gris secondaire, pour distinguer une étiquette d'une valeur. */
export const ETIQUETTE = "text-sm font-semibold text-text-secondary";
