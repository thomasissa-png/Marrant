import { META, META_FORT } from "@/components/espace/typo";

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

/**
 * Cadre de la CARTE PRINCIPALE d'un écran (sans marge interne) : rayon, bordure, fond et filet de l'accueil.
 * s26 finition avant lancement (décision de Thomas du 20/11, point 4 : « le bandeau sur toutes les cartes tue la
 * hiérarchie ») : le filet violet est réservé à la carte principale de chaque écran (fiche ouverte, étape ouverte, carte
 * de situation…) ; toutes les autres cartes prennent `CADRE_CARTE` (neutre), avec émoji et pastille violette.
 */
export const CADRE_CARTE_PRINCIPALE = `relative overflow-hidden rounded-xl border border-border bg-background-card ${FILET_CARTE}`;

/**
 * s25 v7 tour 7 (décision de Thomas du 16/11) : le même cadre SANS le filet, pour « Aujourd'hui » seulement (carte
 * d'action Z1, cartes du « Contenu du jour », tuiles de l'extrait fermé) : un seul accent violet par écran, le bouton
 * plein. Les autres rubriques gardent `CADRE_CARTE` (filet de l'accueil, choix du 15/11).
 */
export const CADRE_CARTE_NEUTRE = "relative overflow-hidden rounded-xl border border-border bg-background-card";

/** s26 finition avant lancement (point 4) : cadre de toute carte qui n'est pas la carte principale de l'écran. */
export const CADRE_CARTE: string = CADRE_CARTE_NEUTRE;

/**
 * « Ton cap » (`TonCap`, partagé) en NEUTRE : points, flamme et filet en gris comme les segments d'« Aujourd'hui » ; le
 * seul fond violet de l'écran reste le bouton plein. Posé sur un conteneur de la carte ou sur la carte elle-même (Mon
 * profil, s26 tour 2 ; rail de « Parcours » de l'abonné, s26 tour 3, point 4).
 */
export const NEUTRE_CAP =
  "[&_.bg-accent-primary]:bg-text-secondary [&_.border-accent-primary]:border-text-secondary [&_.text-accent-primary-hover]:text-text-secondary [&_[aria-labelledby=ton-cap-titre]]:before:hidden";

/**
 * s26 (vue abonné de « Quoi répondre », « Bibliothèque », « S'entraîner » ; `docs/design/rubriques-abonne-s26.md` §0) :
 * cadre des cartes de LISTE de ces trois pages (tuiles par lieu, blocs de la Bibliothèque et coin, cartes repliées de
 * la rafale, mission). [ARBITRAGE À CONFIRMER PAR THOMAS] filet violet retiré (« un seul accent violet, le bouton
 * plein », 16/11). Pour remettre le filet du 15/11 : `CADRE_CARTE` ici, un seul changement ; la tuile d'action, le
 * rail de filtres et l'échelle des marches gardent `CADRE_CARTE_NEUTRE` dans les deux cas (repli de la spec design).
 */
export const CADRE_CARTE_RUBRIQUE: string = CADRE_CARTE_NEUTRE;

/**
 * s26 DA, s'entraîner et favoris (décision de Thomas du 20/11, « la DA, c'est celle des pages déjà validées, avec du
 * violet ») : le `CADRE_CARTE_RUBRIQUE` de S'ENTRAÎNER passe à la DA de l'accueil, le cadre à bandeau violet de 4 px
 * (`CADRE_CARTE`, même rendu que `CARTE_ACCUEIL` + `BANDEAU_ACCUEIL` de `home/da-site.tsx`, sans enfant en plus). Cartes de
 * la rafale (dépliée et repliées), échelle des marches, mission, rafale finie. La Bibliothèque garde
 * `CADRE_CARTE_RUBRIQUE` (hors du périmètre de cette passe).
 * s26 finition avant lancement (point 4) : neutre ; seule la carte de situation (rafale dépliée, `carte-registre.tsx`, ou
 * « rafale finie » à sa place) garde le filet (`CADRE_CARTE_PRINCIPALE`).
 */
export const CADRE_CARTE_ENTRAINER: string = CADRE_CARTE_NEUTRE;

export const CARTE = `min-w-0 space-y-4 ${CADRE_CARTE} p-4 md:p-6 [overflow-wrap:anywhere]`;
/** s26 finition avant lancement (point 4) : `CARTE` de la carte principale de l'écran (corps de la fiche ouverte). */
export const CARTE_PRINCIPALE = `min-w-0 space-y-4 ${CADRE_CARTE_PRINCIPALE} p-4 md:p-6 [overflow-wrap:anywhere]`;

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

export const ETIQUETTE = "text-xs font-semibold uppercase tracking-wide text-text-muted";

/**
 * s26 (rubriques abonné, `docs/design/rubriques-abonne-s26.md` §0) : lien secondaire NEUTRE (carnet, catalogue,
 * « Raconte-la à l'équipe », marches) : `META` souligné, jamais violet, cible de 44 px, focus visible.
 */
export const LIEN_NEUTRE = `${META} inline-flex min-h-11 items-center underline underline-offset-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary`;

export const LIEN = "inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Puce à choix unique : coche ET contour de 2 px quand elle est choisie (jamais la couleur seule). */
export const puce = (choisie: boolean) =>
  [
    "inline-flex min-h-11 min-w-11 items-center gap-1 whitespace-normal rounded-full border px-4 py-2 text-left text-sm font-semibold text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    choisie ? "border-2 border-accent-link bg-background-elevated px-3.5" : "border-border-input hover:border-text-muted hover:bg-background-elevated",
  ].join(" ");

/**
 * Pastille de filtre (s26, `docs/design/rubriques-abonne-s26.md` §1.3) : 44 px, bord de 1 px, `META` ; choisie,
 * bord blanc, fond élevé et `META_FORT` (plus de contour violet de 2 px ni de 500 : hors échelle). L'état se lit
 * par la bordure ET la graisse, jamais la couleur seule ; `aria-current` pour les lecteurs d'écran.
 */
export const pastilleFiltre = (choisie: boolean) =>
  [
    "inline-flex min-h-11 items-center whitespace-normal rounded-full border px-4 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background max-e300:w-full",
    choisie ? `border-text-primary bg-background-elevated ${META_FORT}` : `border-border-input hover:border-border-hover hover:bg-background-elevated ${META}`,
  ].join(" ");

/** Clé d'idempotence d'un geste (une par toucher, gardée pour la suite du même geste). */
export function nouvelleCle(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
