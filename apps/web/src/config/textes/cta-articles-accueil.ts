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
/**
 * Libellé de la section des articles (menu, pied de page, fil d'Ariane,
 * BreadcrumbList). [CHOIX UTILISATEUR] du 18/10/2026 : « Blog » devient
 * « Articles » ; l'adresse `/blog` et les slugs ne changent pas.
 */
export const LIBELLE_SECTION_ARTICLES = "Articles";
