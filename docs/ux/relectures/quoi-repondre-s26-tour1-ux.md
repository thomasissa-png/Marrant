# Relecture UX à l'aveugle : Quoi répondre, s26 tour 1

Captures ouvertes : visiteur 375/1280/1920, en-cours 375/1280/1920, nouvel 1280. Gratuit : même composant que visiteur (TAILLES.md identique, hauteurs 3217/1721 contre 3205/1721), non rouvert en détail.

## Gate typographique (TAILLES.md, citée)
- Aperçu (visiteur et gratuit) : 375 = 4 tailles (24, 20, 16, 14), 6 combinaisons ; 768 = 4 / 6 ; 1280 et 1920 = 4 (30, 20, 16, 14) / 6. Limites (4 / 6) respectées, sans marge : toute combinaison ajoutée la ferait basculer en faute dure.
- Abonné (en-cours et nouvel) : 4 tailles à toutes les largeurs, 5 combinaisons. PASS.
- Aucune taille hors échelle `typo-harmonie-espace-s25.md` (30/24, 20, 16, 14 ; 600/400). PASS.

## Aperçu (visiteur, gratuit)
Constats chiffrés :
- 375 : bouton d'offre haut à y ~ 346 (< 700), titre de la tuile situation à y ~ 626 et 2 lignes de contenu avant 760, bouton de fin à y ~ 2070 (> 812). PASS.
- 1280 : bouton d'offre haut à y = 202 (< 450), rangée 1 entière visible, bouton de fin à y = 1163 (> 900). PASS. 1920 : même composition, largeur utile de 1216 px (>= 1100). PASS.
- Fermé lisible : pastille « Premium » + cadenas sur chaque zone + barres de verrouillage ; on ne se croit jamais dedans. Une seule offre (même bouton, haut et bas).
- Vide au milieu d'un bloc : aucun. Vide dans la tuile situation à 1280/1920 (y 770 à 870, ~100 px) : en fin de carte, permis.

Défauts (non durs) :
- D1. Les 6 pastilles du hero (« Où et avec qui ? », « Pour quoi faire ? », « La sûre »...) répètent les libellés des tuiles juste dessous : double lecture, la valeur n'est pas comptée deux fois. Piste : garder les pastilles du hero, mais c'est la promesse (T1) que Thomas juge.
- D2. Tuile « Rattraper un faux pas » (1280, y 990 à 996) : la 2e barre du verrou touche presque le filet du lien « Le carnet du mois » (~6 px), alors que les deux tuiles voisines ont 20 px d'air sous leurs barres. Correction : `pb-4` sur le bloc des barres de `TuileFermee` quand un pied de lien existe. Ce qui ferait 10.
- D3. Le lien « Le carnet du mois » avec chevron a l'allure d'un lien actif dans une zone fermée. Piste : retirer le chevron en aperçu.

## Abonné (en-cours, nouvel)
- Clarté : au 1280x900, une seule action pleine, « Voir », dans la tuile pleine largeur en tête (titre de la situation, 5 min). Je sais quoi faire en une seconde. Rail gauche 3 col (filtres ouverts, carnet en lien secondaire), liste 9 col en 2 colonnes : conforme à la spec 3/9, plus de colonne centrée seule.
- Continuer : compteur « 1/4 » à droite du titre de chaque lieu + barre de progression, « Fait » conservé sur La poêle (en-cours). Visible au premier écran.
- Nouvel abonné : jamais une page morte. La tuile de tête propose « Coloc : la poêle », les 13 blocs sont à 0/n avec leur barre vide, tout est cliquable.
- 375 : prochaine action d'abord, filtres repliés (« Filtrer les cartes »), 1 colonne. PASS. Cohérence entre comptes : même grille, seule la tuile de tête et les compteurs changent.

Défauts (non durs) :
- A1. Progression uniquement par lieu : pas de total global (ex. « 1/64 ») ni de série. Piste : un compteur en `META` dans la tuile de tête (chiffres seuls, aucune taille ajoutée).
- A2. Liste très longue (5205 px à 1280, 13 blocs identiques) : le rail seul porte la navigation. À vérifier au code qu'il est bien sticky (spec 1.2).
- A3. Pastille « Commerces, voisins, transports » sur 3 lignes dans le rail : forme en gélule déformée. Piste : `rounded-lg` ou largeur de rail à 4 col.
- A4. Cibles 44 px : les pastilles du rail semblent proches de 42 px à 1280 (non mesuré, à vérifier au code : `min-h-11`).

## Notes
| Critère | Note |
|---|---|
| 1 Prospect : envie en 3 s | 9 |
| 2 Abonné : clarté | 9 |
| 3 Abonné : envie de continuer | 9 |
| 4 Nouvel abonné | 9 |
| 5 Accessibilité et cohérence | 9 |

Pour 10 : corriger D2, ajouter le total global (A1), confirmer A2 et A4 au code.

NOTE GLOBALE : 9/10

Fautes dures : aucune.
