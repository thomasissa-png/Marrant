# Relecture à l'aveugle s25 v6 tour 5, groupe « parcours »

Périmètre : /parcours et /parcours/repartie, comptes visiteur, gratuit, en-cours, nouvel. Captures : `docs/captures/s25/v6-tour-5/parcours/`.
Ouvertes : 375, 1280 et 1920 des 8 vues (24 captures) + 1280 de l'étalon d'accueil. Non ouvertes : 768 et 1456 (aucun doute de mise en page à ces largeurs sur les autres, la coque `max-w-7xl` rend 1280/1456/1920 identiques). Les captures 375 sont des pleines pages très hautes (5 800 à 7 700 px) affichées réduites : je juge à 375 la structure, l'ordre et les boutons, pas le pixel.
Code lu : `apps/web/src/components/parcours/parcours-content.tsx` (grille, quiz d'orientation) ; `docs/design/cta-forme-place-s21.md` §1.3 et B15.
Décisions respectées : argumentaire après le programme pour l'abonné ayant validé une étape (en-cours /parcours/repartie : conforme, pas une faute) ; vignettes vidéo en dégradé (préversion locale, pas une faute) ; 5e carte Boulot à demi-largeur centrée (décision tour 4, code ligne 46).

## Ce qui est conforme (à ne pas toucher)

- /parcours visiteur et gratuit : un plein par carte (exception B15 du §1.3), « Tester l'étape 1 de {parcours}, gratuite », ligne frontière dessous. Le gratuit n'a plus « Sans compte. » (juste : il a un compte), le visiteur l'a. Cohérence entre comptes juste.
- /parcours en-cours : un plein sur la carte du parcours en cours (« Continuer ce parcours »), contour pour les autres ; en-tête « Reprendre » unique au-dessus. nouvel : plein « Commencer l'étape 1 » en tête + plein sur Répartie (celui qui est conseillé), contour pour les 4 autres. L'action principale suit l'état du compte.
- /parcours/repartie visiteur et gratuit : intro, « Pour qui ? », bandeau « Étape 1 gratuite, la suite avec Premium », étape 1 lisible en entier, quiz, un seul plein « Passer à l'étape 2 · 1,99 €/mois » avec « D'abord ton compte, puis le paiement » (visiteur seulement, le gratuit ne l'a pas : juste) et garantie. Étapes 2 à 4 verrouillées en lignes repliées avec cadenas, sans plein : un seul appel par page, pas de mur. Aperçu Premium correct.
- /parcours/repartie nouvel : bloc de suivi « 0 sur 4 étapes » avec « Commencer » unique ; en-cours : « 2 sur 4 étapes », « Reprendre » sur l'étape 3, étapes 1 et 2 repliées avec coche. Jamais une page morte.
- Cartes `rounded-xl` à filet violet, pastilles de niveau, rythme aéré : fidèle à l'étalon pour les cartes. Aucun débordement ni colonne collée à gauche, de 375 à 1920.
- Cibles : réponses du quiz d'orientation `p-3` sur deux lignes de texte (> 44 px) ; boutons de carte pleine largeur de hauteur nette. Je n'ai pas pu mesurer la ligne « Programme » (repliée) ni « Refaire le quiz » (`size="sm"`, `ghost`, visible seulement après réponse, absent des captures) : aucune faute classée, à vérifier au code avant tour 6.

## Notes

### Design
| Critère | Note | Défaut et correction |
|---|---|---|
| 1 Fidélité à l'accueil | 8 | Les titres de section sont alignés à gauche (« Quel parcours est fait pour toi ? », « Les parcours », « Explore aussi », « Questions fréquentes » sur `visiteur-parcours-1280.png`, `en-cours-parcours-1280.png`, `nouvel-parcours-1920.png` ; « Le programme », « Pour qui ? » sur `visiteur-parcours-repartie-1280.png`) alors que le H1 est centré et que l'étalon (`visiteur-accueil-1280.png`) centre tous ses titres de section. Sur /parcours/repartie, l'intro est aussi alignée à gauche sous un H1 et une pastille centrés. Correction : `text-center` sur les H2 de section dans `parcours-content.tsx` (et le wrapper de l'intro dans `parcours-detail.tsx`) ; faire 10 = titres centrés comme l'accueil. |
| 2 Hiérarchie et lisibilité | 9 | Bon : H1, H2, cartes, un plein par vue. Piste : « 325 XP à gagner » apparaît deux fois sur la carte Machine à Café du compte en-cours (pastille d'en-tête et sous la barre de progression, `en-cours-parcours-1280.png`), alors que 2/3 sont faites ; ambigu (total ou reste ?). Supprimer le doublon, ne garder que la ligne de progression. Piste, ne retient pas la note. |
| 3 Mise en page aux 5 largeurs | 8 | Rupture de largeurs : sur 1280 et 1920, le bloc de reprise ou « Ton cap » (en-cours, nouvel), le quiz, « Explore aussi » et la FAQ (visiteur, gratuit) sont dans une colonne d'environ 670 px, alors que la grille des 5 cartes fait 1 216 px (`visiteur-parcours-1920.png`, `en-cours-parcours-1920.png`). Le titre « Les parcours » ou « Quel parcours… » est calé sur le bord gauche de la colonne étroite, donc 100 px en retrait des cartes qu'il annonce. Correction : sortir les H2 de la grille du `max-w-2xl` ou les centrer (voir note 1) ; faire 10 = chaque titre aligné sur le bord du bloc qu'il introduit, ou centré. Sur /parcours/repartie, la colonne unique de 672 px est une colonne de lecture cohérente avec les autres pages : conforme. |
| 4 Cohérence avec le reste de l'espace | 9 | Cartes et filets cohérents avec les autres sections. Piste : le quiz d'orientation est au-dessus des cartes pour visiteur et gratuit, au-dessous pour en-cours et nouvel : voulu (commentaire du code, tour s17 UXV-2-05), conforme. |
| 5 Finition au pixel | 9 | Contrastes lisibles, pas de chevauchement. Piste : dans les cartes Confiance et Storytelling, un vide de 60 à 100 px entre l'encart en italique et « Programme » (cartes de hauteur égale, `visiteur-parcours-1280.png`) ; acceptable, c'est le `mt-auto` voulu du pied de carte. Piste : le texte « Ce que tu vas apprendre » s'arrête avant le bord droit de la carte (`max-w` de prose), orphelin « phrase suffit. ». |

### UX
| Critère | Note | Défaut et correction |
|---|---|---|
| 1 Compréhension | 9 | Je sais où je suis (Parcours allumé dans la bande) et quoi faire. Piste : le visiteur lit « 5 parcours ... » mais « Quel parcours est fait pour toi ? » vient avant les cartes, ce qui retarde le premier plein de 300 px ; décision de l'espace (s17), ne retient pas la note. |
| 2 Action principale unique | 9 | Respectée par compte (voir « conforme »). Piste : sur en-cours, le plein « Continuer ce parcours » de Machine à Café répète le « Reprendre » du bloc du haut (même parcours) : deux pleins pour la même action, à 800 px d'écart (jamais dans le même écran, donc pas une violation du §1.3). Faire 10 = un seul plein, la carte passant en contour. |
| 3 États vides et nouvel abonné | 10 | nouvel : bloc « Étape conseillée Répartie » avec « Commencer l'étape 1 », « Ton cap 1 sur 5 », 0 sur 4 étapes : jamais une page morte. |
| 4 Aperçu Premium non-abonné | 10 | /parcours EST l'aperçu (nav v6) ; /parcours/repartie : étape 1 entière, étapes 2 à 4 nommées avec XP, une seule offre avec prix et garantie, aucune fenêtre. |
| 5 Accessibilité et cohérence entre comptes | 9 | Cohérent entre comptes. Les cadenas, pastilles et boutons ont un libellé texte. Non vérifié, à contrôler au code : hauteur du bouton « Programme » (doit être `min-h-11`) et de « Refaire le quiz ». Aucune faute classée. Libellé du bouton de carte « Tester l'étape 1 de {parcours}, gratuite » : le §B15 de la spec cite « Lire la première étape gratuite de {parcours} » comme patron ; je ne peux pas dire lequel est le libellé validé : à confirmer par Thomas, ne retient pas la note. |

## NOTE GLOBALE : 8/10 (minimum des critères : design 1 et 3)

## Fautes dures (bloquent la validation à 9)

1. Titres de section (« Quel parcours est fait pour toi ? », « Les parcours », « Explore aussi », « Questions fréquentes », « Le programme », « Pour qui ? ») alignés à gauche sous un H1 centré, contre l'étalon d'accueil qui les centre : `apps/web/src/components/parcours/parcours-content.tsx` (+ `apps/web/src/components/parcours/parcours-detail.tsx` pour « Le programme » et l'intro).
2. À 1280 et 1920, titre calé sur une colonne de 672 px au-dessus d'une grille de cartes de 1 216 px (titre 100 px en retrait des cartes qu'il introduit) : `apps/web/src/components/parcours/parcours-content.tsx` (wrapper `max-w-2xl` des sections hors grille).
