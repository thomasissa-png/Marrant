/**
 * Blocs d'appel s21, partie A : éléments globaux, articles, accueil, en-tête.
 *
 * FICHIER UNIQUE des textes de la partie A (règle d'architecture de
 * l'intégration s21) : aucun texte de ces blocs n'est écrit en dur dans un
 * composant. Le remplacement des textes après le tour 5
 * (`docs/copy/cta-s21/tour5/textes-finaux-12.md`) se fait ICI et nulle part
 * ailleurs.
 *
 * Source actuelle : gagnants du tour 4 (`docs/copy/cta-s21/tour4/pack-12-tour4.md`,
 * clés `cles-pack12-tour4.md`, votes `resultats-tour4.md`, points @fullstack
 * `annexe-pack12-tour4.md`). Forme et place : `docs/design/cta-forme-place-s21.md`.
 *
 * Règles : tutoiement, zéro tiret cadratin, UTF-8. Aucun nombre écrit en dur :
 * prix depuis `config/premium.ts` (prix de l'offre Stripe affichée), nombre de
 * parcours depuis `PARCOURS_COUNT` / `PREMIUM_PARCOURS`, annuel seulement si
 * `isAnnualPlanAvailable()` (lu côté serveur, passé en paramètre ici).
 */
import { PREMIUM_PRICE_LABEL } from "@/config/premium";

/**
 * Libellé de la section des articles (menu, pied de page, fil d'Ariane,
 * BreadcrumbList). [CHOIX UTILISATEUR] du 18/10/2026 : « Blog » devient
 * « Articles » ; l'adresse `/blog` et les slugs ne changent pas.
 */
export const LIBELLE_SECTION_ARTICLES = "Articles";

/**
 * B6, bouton d'en-tête (visiteur) : gagnant du tour 4 (A, 2 voix sur 3) « 2,99 €/mois »,
 * construit depuis le prix (espace insécable avant « € », `formatEuros`).
 * Destination : `/abonnement?src=header`. Nom accessible : le libellé visible d'abord
 * (WCAG 2.5.3), puis ce que fait le lien (annexe tour 4 §6 : « Voir les prix de Premium »).
 * « Voir les prix » reste le repli si le test sur le trafic réel le donne gagnant.
 */
export const EN_TETE = {
  bouton: PREMIUM_PRICE_LABEL,
  nomAccessible: `${PREMIUM_PRICE_LABEL} : voir les prix de Premium`,
} as const;

/**
 * B1, encart du milieu des articles (`DemoVanne variante="milieu"`) : gagnant du tour 4
 * (A, 3 voix sur 3). La situation montrée est la fiche OFFERTE du carnet du mois
 * (`lib/carnet.ts`, champs `offerte` et `accroche`) : « Gratuit, sans compte » n'est
 * vrai que pour elle. Pas de « Pourquoi ça marche » ici : la réplique se lit au clic.
 */
export const DEMO_VANNE = {
  /** [S1] */
  surtitre: "Une situation de répartie",
  /** [S2] : `accroche` de la fiche puis ce qu'on te dit. */
  situation: (accroche: string, onTeDit: string) => `${accroche}, et on te lance : « ${onTeDit} »`,
  /** [S3] */
  question: "Tu réponds quoi ?",
  /** [S6] : ouvre la même fiche sur /carnet. */
  bouton: "Voir la réplique",
  /**
   * [S7] : la seconde phrase seulement si le carnet compte d'autres situations
   * (annexe tour 4 §5, point 4).
   */
  note: (autresSituations: boolean) =>
    `Gratuit, sans compte : la réplique, pourquoi elle marche et une sortie polie si ça se tend.${
      autresSituations ? " Les autres situations, nouvelles chaque mois, sont dans Premium, l'abonnement du site." : ""
    }`,
} as const;
