# Plan de corrections, navigation v6, tour 5 (s25)

Source : les 6 relectures `docs/{design,ux}/relectures/s25-v6-tour-5-*.md`. Corrections **interrupteur ouvert seulement**, aucun texte nouveau.

## Notes du tour 5 (design / ux)
S'entraîner 9 / 8 · Parcours 9 / 8 · Favoris-Profil 8 / 8. Les 7 autres sections sont validées (tours 2 à 4).

## Écarté
- S'entraîner, faute UX unique : sur la fiche bilan, la consigne « à voix haute » (carte « À toi ») énonce la réponse de « Remets ta réponse dans l'ordre ». C'est un texte éditorial : **point pour Thomas** (reformuler la consigne, ou n'afficher « À toi » qu'après la réponse). Pas de correction de code sans lui.

## Arbitrages
1. **/parcours (liste et détail) : titres de section centrés comme l'accueil** (« Quel parcours est fait pour toi ? », « Les parcours », « Explore aussi », « Questions fréquentes », « Le programme », « Pour qui ? ») : `text-center`, et plus de colonne `max-w-2xl` décalée au-dessus d'une grille de 1 216 px (le titre est centré sur la coque ; un texte d'intro sous le titre reste `mx-auto max-w-2xl`).
2. **Profil, « Ton cap » et « Statistiques » côte à côte** : même padding et même taille de titre (alignés sur les autres cartes du profil).
3. **Carte Abonnement** : lien « Renoncer au contrat ici » en cible de 44 px (`inline-flex min-h-11 items-center`) ; « Gérer », « Changer de formule », « Résilier » en `md:h-11`.
4. **Favoris (a11y)** : essayé (`role="button"` + `aria-expanded` sur la carte), puis **retiré** : la carte contient « Retirer » et le partage, d'où des contrôles imbriqués (axe `nested-interactive`, faute grave). Piste non bloquante ; la bonne forme (vrai `<button aria-expanded>` limité à la zone texte) change le DOM et reste pour plus tard.
