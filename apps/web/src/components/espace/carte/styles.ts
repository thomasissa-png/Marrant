/**
 * Classes communes des cartes, du geste et des missions (s24, lot D5) : tokens existants seulement,
 * cibles de 44 px au moins, focus visible, boutons qui passent à la ligne à 200 % de texte.
 */
export const BOUTON_SECONDAIRE =
  "inline-flex min-h-11 min-w-0 items-center justify-center whitespace-normal rounded-lg border border-border-input px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:cursor-default aria-disabled:border-border aria-disabled:text-text-muted disabled:cursor-default";

/**
 * v6 tour 1 (point 15) : action qui efface, dans une confirmation (« Supprimer », « Retirer ») : contour et texte
 * d'erreur (`error-text`, AA sur carte), jamais plein ; « Annuler » reste en `BOUTON_SECONDAIRE`.
 */
export const BOUTON_DESTRUCTIF =
  "inline-flex min-h-11 min-w-0 items-center justify-center whitespace-normal rounded-lg border border-error px-3 py-2 text-sm font-semibold text-error-text transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default disabled:opacity-50";

export const BOUTON_PRINCIPAL =
  "inline-flex min-h-11 min-w-0 items-center justify-center whitespace-normal rounded-lg bg-accent-secondary-hover px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50";

/**
 * v6 tour 1 (arbitrage 1, Thomas 15/11) : la carte de l'espace parle la langue de l'accueil
 * (`components/home/daily-content.tsx` : `overflow-hidden rounded-xl`, filet `h-1` dégradé violet en haut).
 * Le filet est un pseudo-élément (`before:`) : aucun enfant en plus, `space-y-*` des cartes inchangé.
 * Jamais sur les lignes de liste denses (`liste-fiches`, lignes de la rafale), seulement sur les cartes.
 */
export const FILET_CARTE =
  "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-accent-primary before:to-accent-secondary";

/** Cadre d'une carte (sans marge interne) : rayon, bordure, fond et filet de l'accueil. */
export const CADRE_CARTE = `relative overflow-hidden rounded-xl border border-border bg-background-card ${FILET_CARTE}`;

export const CARTE = `min-w-0 space-y-4 ${CADRE_CARTE} p-4 md:p-6 [overflow-wrap:anywhere]`;

/**
 * v6 tour 1 (point 5) : un `<summary>` qui révèle du contenu a la forme d'un bouton secondaire de 44 px avec un
 * chevron (`ChevronRepli`) ; le `<details>` porte `group/repli`.
 */
export const SOMMAIRE_REPLIABLE =
  "inline-flex min-h-11 max-w-full cursor-pointer list-none items-center gap-2 rounded-lg border border-border-input px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden";

/**
 * v6 tour 3 (arbitrage 1, Thomas 15/11) : en-tête de page d'une rubrique (H1, sous-titre) centré comme le hero de
 * l'accueil et l'aperçu de la même adresse (`text-center`, sous-titre `mx-auto`). Posé sur un conteneur autour de
 * `PageHeader` (composant du site, inchangé) ou de l'en-tête de la page ; le contenu dessous garde sa grille.
 * Interrupteur ouvert seulement (les pages de l'espace répondent 404 fermé ; `/favoris` le teste).
 */
export const EN_TETE_CENTRE = "text-center [&_header>p]:mx-auto";

/**
 * Place d'une carte de « S'entraîner » dans la grille de la page (v6 tour 4, arbitrage 1, Thomas 15/11).
 * - `seule` : seule sur sa ligne (dernière carte impaire, mission) : pleine largeur, deux colonnes dès `lg`.
 * - `jumelle` : deux par ligne dès 768 px, rangée avec « Le contexte » (au moins une carte « Quel registre ? ») :
 *   sous-grille de 5 rangées, en-tête, scène, contexte, « Ta réponse d'abord » (avec le compte à rebours), réponses.
 * - `jumelle-sans-contexte` : deux cartes « Et toi ? » côte à côte : 4 rangées (aucune rangée vide).
 */
export type PlaceEntrainement = "seule" | "jumelle" | "jumelle-sans-contexte";

/**
 * v6 tour 4 (arbitrage 1, remplace le `flex-1` du tour 3) : cartes de « S'entraîner » (rafale et mission). Jumelles :
 * sous-grille (`grid-rows-subgrid`) sur les rangées de la page, en-tête, « Le contexte », « Ta réponse d'abord » et
 * réponses à la même hauteur d'une carte à l'autre, plus de texte étiré qui repousse les actions. Les deux blocs de la
 * carte (`texteEntrainement`, `actionsEntrainement`) passent en `md:contents` : leurs enfants sont les cases de la
 * sous-grille. Seule sur sa ligne : pleine largeur, le texte à gauche et, dès `lg`, le reste à droite (« Le contexte »
 * inclus : colonnes de hauteurs voisines, plus de vide sous les réponses). Le cadre reste `CARTE`.
 */
export const cadreEntrainement = (place: PlaceEntrainement) =>
  place === "seule"
    ? `${CARTE} lg:grid lg:grid-cols-2 lg:gap-x-8 lg:space-y-0`
    : `${CARTE} md:grid md:grid-rows-subgrid md:gap-y-4 md:space-y-0 ${place === "jumelle" ? "md:row-span-5" : "md:row-span-4"}`;
export const ACTIONS_ENTRAINEMENT = "min-w-0 space-y-4";
const BLOC_DE_SOUS_GRILLE = "min-w-0 space-y-4 md:contents md:space-y-0";
export const texteEntrainement = (place: PlaceEntrainement) => (place === "seule" ? "min-w-0 space-y-4" : BLOC_DE_SOUS_GRILLE);
export const actionsEntrainement = (place: PlaceEntrainement) => (place === "seule" ? ACTIONS_ENTRAINEMENT : BLOC_DE_SOUS_GRILLE);
/** Carte « Et toi ? » (sans contexte) jumelle d'une carte qui en a un : « Ta réponse d'abord » sur la 4e rangée. */
export const SAUT_CONTEXTE = "md:row-start-4";

export const ETIQUETTE = "text-xs font-semibold uppercase tracking-wide text-text-muted";

export const LIEN = "inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Puce à choix unique : coche ET contour de 2 px quand elle est choisie (jamais la couleur seule). */
export const puce = (choisie: boolean) =>
  [
    "inline-flex min-h-11 min-w-11 items-center gap-1 whitespace-normal rounded-full border px-4 py-2 text-left text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    choisie ? "border-2 border-accent-link bg-background-elevated px-3.5" : "border-border-input hover:border-text-muted hover:bg-background-elevated",
  ].join(" ");

/** Clé d'idempotence d'un geste (une par toucher, gardée pour la suite du même geste). */
export function nouvelleCle(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
