# Itération 3 : notation visuelle @design (s17, 07/10/2026)

Base : `docs/qa/captures-parcours-apprentissage-s17/iter-3/` (une quarantaine lues sur 202 : chargement x5, échec x6, validation-echec x2, désactivé, « On valide… », quiz fin visiteur et mauvaise réponse, survols x4, focus après valider, rappel clavier, accueil Premium, profil, aperçu zoom, fins de parcours, rechargé). Comparé à `iter-2-design.md` et à la section « Tour 2 » de `iter-1-corrections.md`. Lecture du rendu réel ; un point de code lu (`step-quiz.tsx`) pour le survol. Textes validés non jugés. Connus et en correction (non recomptés) : focus perdu sur l'interrupteur après Espace ; « Ta progression est intacte » absent de la carte en arrivée par ancre.

## Statut des DES-2-NN

| Écart | Statut | Capture / constat |
|---|---|---|
| 2-01 chargement / échec | Réglé (rendu) ; preuve partielle, voir DES-3-03 | `p-375-etape-chargement-carte` : carte ouverte, titre et « +75 XP » gardés, texte + 3 lignes 100/90/60 %. `p-1280-etape-chargement` : étape 1 reste cochée, étapes 3-4 repliées, aucun saut. `p-375/1280-etape-echec-carte` : bloc `border-l-2` rouge, texte lisible, « Réessayer » 44 px, pleine largeur à 375 |
| 2-02 contours `outline` | Réglé | `v-375-repartie-quiz-fin-visiteur` : « Refaire le quiz » en contour gris net, offre pleine. `v-1280-repartie-quiz-mauvaise-reponse` et `v-1280-survol-voir-offre` : contour violet net. `v-375-entree-fiche-vanne` : contour violet net |
| 2-03 désactivé | Réglé | `p-1280-bouton-desactive-quiz-a-finir` : fond gris, texte gris clair lisible, lu « inactif ». `p-1280-on-valide` : violet gardé, spinner 16 px, texte lisible (≈ 4,8:1) |
| 2-04 doublon d'XP | Réglé | `p-768/375-repartie-etape3-apres-validation-vue` : une seule mention, « +100 XP gagnés ! » en gras violet, date dessous |
| 2-05 carte de fin | Réglé | `p-1280-repartie-fin-bilan` : barre seule (« Parcours terminé ! »), bilan, phrase et bouton calés sur la même colonne étroite |
| 2-06 aperçu 1280 | Réglé | `v-1280-apercu-verrouille-zoom` : label blanc display, corps ≈ 68 car., phrase Premium centrée sur 2 lignes |
| 2-07 « Supprimer » | Réglé | `p-1280-profil-verifie` : texte à x = 32 comme le titre |
| 2-08 accueil Premium | Réglé | `p-375-accueil-premium-vue` : « Reprendre l'étape 3 » seul bouton plein, « Explorer les vannes » en contour violet |
| 2-09 captures d'états | Partiel | Fournies : chargement, inconnue, échec x3, focus après valider, survols x3. Défauts de preuve : DES-3-01 à 3-03 |
| 2-10 doublon de contenu | Réglé (rendu) | `p-1280-focus-apres-valider` : « Ce que tu vas apprendre » et « Le conseil » s'ouvrent sur deux textes distincts |
| 2-11 parcours terminé rechargé | Réglé | `p-375-repartie-termine-apres-rechargement-vue` : carte de fin juste sous la barre, sans 640 px d'argumentaire |

## Nouveaux écarts

**DES-3-01 : échec de validation non prouvé (bloquant la preuve, 0 ligne de code).**
Problème : `p-375-validation-echec` et `p-1280-validation-echec` ne montrent pas le message : on voit les « Vannes à pratiquer » et le bas de page noir (capture rognée à ≈ 640 / 800 px). Effet : impossible de valider le rendu du `role="alert"`, de son contraste ni de la conservation du quiz. Ce qu'on fait : refaire les 2 captures fenêtre visible, message et bouton « Valider » dans le cadre (375 et 1280, ajouter 768).
Gravité : majeure pour le 10 (preuve manquante), nulle pour le code.

**DES-3-02 : les 3 survols ne montrent aucun survol.**
Problème : `p-1280-survol-option-quiz` (réponse B) : les 4 options sont identiques, aucun contour violet, alors que le code prévoit `hover:border-accent-primary hover:bg-background-elevated`. `p-1280-survol-entete-etape` et `p-1280-survol-rappel` : aucun changement visible (le second montre l'anneau de focus, pas un survol). Effet : sans preuve, on ne sait pas si le survol marche (souris pas posée, transition `transition-all` 150 ms non finie) ou s'il est absent. Ce qu'on fait : refaire avec `hover()` puis attente de 300 ms, ajouter la capture de la même zone sans survol à côté. Si le survol est réellement invisible : contour violet sur l'option et fond `background-elevated` sur l'en-tête.
Gravité : majeure pour le 10 (preuve), mineure en code.

**DES-3-03 : cadrage des captures de chargement et d'échec.**
Problème : `p-1280-etape-echec-reessayer` et `p-375-etape-echec-reessayer` coupent le bloc d'échec de la carte de progression sous l'en-tête fixe (seul « Réessayer » est visible, le message ne se lit pas). `p-375/1280-etape-chargement-inconnue` démarrent à « Le programme » : la barre grise neutre annoncée n'est pas à l'écran. Effet : « la progression ne bouge jamais » et « barre neutre, jamais 0/N » ne sont prouvés que par l'étape 1 cochée. Ce qu'on fait : cadrer 80 px plus haut (carte de progression entière) pour ces 4 captures.
Gravité : moyenne (preuve).

**DES-3-04 : états sans capture à 768.** Chargement, échec et validation-echec ne sont fournis qu'à 375/1280 ; je demandais les 3 devices. À ajouter (mineur).

**DES-3-05 : focus après valider, finitions.** `p-1280-focus-apres-valider` : l'anneau de l'en-tête de l'étape 2 touche le bloc « Pourquoi cette étape ? » (0 px d'écart) et « Le programme » est coupé en deux sous la barre fixe. On fait : `mb-2` sous l'en-tête focalisable et `scroll-mt-28` sur la carte validée. Mineur.

**DES-3-06 : deux « Réessayer » empilés quand tout échoue.** `p-375-etape-echec-reessayer` : bloc de progression puis bloc d'étape, même bouton, même gabarit. Acceptable (deux requêtes), à garder seulement si un seul clic relance les deux ; sinon ne garder que celui de l'étape. Mineur.

## Notes /10

| Critère | T1 | T2 | T3 | Pourquoi |
|---|---|---|---|---|
| Cohérence design system | 7 | 9 | 10 | Tout vient du système ; 2-06, 2-07 réglés, aucune valeur hors tokens vue |
| Hiérarchie visuelle | 6 | 9 | 10 | Un seul plein par écran partout, accueil Premium réglé (2-08), gain d'XP en `text-base` |
| Espacements / alignements | 6,5 | 9 | 9,5 | Carte de fin sur une colonne, profil aligné. Reste le 0 px du focus (DES-3-05) |
| Typographie / lisibilité | 6,5 | 9 | 10 | Corps 16 px, 68 car., aperçu 1280 réglé |
| Couleurs / contrastes AA | 6 | 8,5 | 10 | Contours violet / gris, désactivé, erreurs, « On valide… » ≈ 4,8:1 : tous AA |
| États | 6,5 | 8 | 9 | Chargement, échec d'étape, désactivé, valide, focus : prouvés. Survol et échec de validation non prouvés (3-01, 3-02) |
| Composants nouveaux | 7 | 9 | 10 | Quiz, aperçu, carte de fin, interrupteur, squelette, bloc d'échec : finis |
| Responsive 375/768/1280 | 7,5 | 9 | 9,5 | Rien ne casse ; 768 absent pour les nouveaux états (3-04) |

**Note globale : 9,5/10** (6, puis 8,5). Pas 10 : je l'avais conditionné à « faits ET prouvés par capture ». Les 8 correctifs de code sont faits et le rendu est conforme partout où je peux le voir. Mais trois preuves manquent (échec de validation, survols, cadrage des états de progression). Aucune ligne de code attendue : 4 captures à refaire (3-01, 3-02, 3-03, 3-04).

## Pour le 10 au tour 4

Refaire `p-<w>-validation-echec` (3 devices), les 3 survols avec avant/après, les 4 captures de cadrage (échec-reessayer, chargement-inconnue) à 375/1280. Si elles montrent le message d'alerte lisible, un survol visible et la barre neutre : 10/10 sans autre changement. DES-3-05 et 3-06 : à faire dans la même passe, non bloquants. Si un survol est réellement invisible, c'est un correctif d'une ligne de classe, à re-prouver.
