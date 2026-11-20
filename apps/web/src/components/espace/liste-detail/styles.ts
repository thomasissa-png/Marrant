/**
 * s26 liste et détail, module neutre (repris du pilote Quoi répondre, `docs/design/liste-detail-quoi-repondre-s26.md`
 * §1 et §2, sans modifier ses fichiers) : géométrie de la grille et lignes de liste, pour toute rubrique en liste +
 * fiche (Carnet d'abord). Mêmes valeurs que le pilote : liste de 320 px puis 360 dès 1280, gouttière 24 puis 32.
 */

/** Grille liste + fiche dès 1024 (sous 1024, une colonne : liste OU fiche). */
export const GRILLE_LISTE_DETAIL =
  "lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-8";

/** Cellule de la liste hors du calcul de la rangée (`h-0 min-h-full`) : la liste collante ne rallonge jamais la page. */
export const CELLULE_LISTE_COLLANTE = "min-w-0 lg:h-0 lg:min-h-full";

/** Carte de liste collante dès 1024, sous l'en-tête collant du site (153 px, comme Quoi répondre). */
export const CARTE_LISTE_COLLANTE = "flex flex-col lg:sticky lg:top-[9.5625rem] lg:max-h-[calc(100dvh-11.0625rem)]";

/**
 * Ligne de liste : 44 px au moins, survol élevé, bague de focus intérieure (le conteneur défile : une bague externe
 * serait rognée), filet de 2 px en pseudo-élément (aucun décalage de texte à l'activation).
 */
export const LIGNE_LISTE =
  "relative flex min-h-11 items-start gap-3 px-6 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5";

/**
 * Ligne active (`aria-current="page"`) : fond élevé et filet VIOLET de 2 px (DA de l'accueil, décision de Thomas du
 * 20/11 qui prime sur le filet blanc du 19/11). Le filet a un sens ici : c'est la fiche ouverte à droite.
 */
export const LIGNE_ACTIVE = "bg-background-elevated before:bg-accent-primary";
/** Même état, dès 1024 seulement (ligne ouverte d'office dans le panneau ; sous 1024 aucun panneau n'est visible). */
export const LIGNE_ACTIVE_LG = "lg:bg-background-elevated lg:before:bg-accent-primary";

/** Dégradé de bord de la zone qui défile (16 px, du fond de la carte vers transparent), comme le pilote. */
export const DEGRADE_BORD =
  "pointer-events-none absolute inset-x-0 z-10 h-4 from-background-card to-transparent transition-opacity duration-150 motion-reduce:transition-none";

/** Haut collé de la liste et du panneau dès 1024 (en-tête collant de 121 px et 32 px de marge). */
export const HAUT_COLLE_LISTE = 153;

/** s26 DA, s'entraîner et favoris : texte d'une ligne (Favoris) ; violet au survol, violet et fort sur la ligne active. */
export const texteLigne = (actif: boolean) =>
  `min-w-0 flex-1 text-sm [overflow-wrap:anywhere] group-hover/ligne:text-accent-link ${actif ? "font-semibold text-accent-link" : "text-text-primary"}`;
