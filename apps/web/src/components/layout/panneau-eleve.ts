/**
 * s25 (relecture design tour 2, F4) : panneaux de l'en-tête unique (cloche, menu du compte), interrupteur
 * `ESPACE_CLIENT_PUBLIE` ouvert seulement. Une couche au-dessus des cartes de la page : fond un cran au-dessus
 * (`background-elevated` au lieu de `background-card`), ombre portée nette, anneau fin ; sans voile.
 * Les survols et lignes en relief passent alors à `bg-border-hover`, sinon invisibles sur ce fond.
 */
export const PANNEAU_ELEVE = "bg-background-elevated shadow-2xl shadow-black/60 ring-1 ring-white/10";

/**
 * s25 (relecture design tour 7, F2) : UN seul anneau de focus dans l'en-tête unique (barre, menu mobile, cloche,
 * compte) : `ring-2` (2 px) `ring-accent-link` (#A78BFA), coins arrondis. Extérieur dans la barre ; intérieur
 * (`ring-inset`) dans le menu mobile et les panneaux, où l'extérieur serait coupé. Champ de recherche : bordure et
 * `ring-1` de la même couleur (2 px, `CHAMP`). Bouton d'offre plein : même couleur, décalé de 2 px (fond violet).
 * Couleur choisie par le contraste avec les fonds réellement voisins (WCAG 1.4.11, valeurs de `tailwind.config.ts`) :
 * `accent-primary` #8B5CF6 : 4,59 sur la page #0D0D0D, 3,89 sur la carte #1F1F1F, 3,39 sur l'élevé #2A2A2A, mais
 * 2,69 sur la ligne survolée du menu du compte (#3A3A3A, `data-highlighted`) : sous 3:1.
 * `accent-link` #A78BFA : 7,14 ; 6,06 ; 5,27 ; 4,18 : au-dessus de 3:1 partout.
 */
export const CHAMP = "[&_input:focus]:border-accent-link [&_input:focus]:ring-accent-link";
