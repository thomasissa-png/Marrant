/**
 * s25 (relecture design tour 2, F4) : panneaux de l'en-tête unique (cloche, menu du compte), interrupteur
 * `ESPACE_CLIENT_PUBLIE` ouvert seulement. Une couche au-dessus des cartes de la page : fond un cran au-dessus
 * (`background-elevated` au lieu de `background-card`), ombre portée nette, anneau fin ; sans voile.
 * Les survols et lignes en relief passent alors à `bg-border-hover`, sinon invisibles sur ce fond.
 */
export const PANNEAU_ELEVE = "bg-background-elevated shadow-2xl shadow-black/60 ring-1 ring-white/10";
