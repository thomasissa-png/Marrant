# Notation design, cycle 2 (06/10/2026)

Méthode : 6 PNG, 6 contrôles et 3 aperçus mobiles ouverts et lus (X, LinkedIn, Instagram x4). Cotes relevées sur le rendu (±5 px) et recoupées avec `index.md`. Zones sûres toujours non confirmées sur téléphone réel (sources divergentes, voir cycle 1).

## Vérification des corrections du cycle 1
| Correction | État | Constat |
|---|---|---|
| X A : bloc titre top 75 | Fait | Glyphes à y 97, descendante du « p » à y 275 : jeu de 25 px avec la photo (y 300), 27 px avec le recadrage haut (70). |
| X A : pied lisible, hors photo | Fait (remplacé par la ligne d'appel) | Glyphes y 356 à 406, x 598 à 1388, 0 pixel dans la photo. 13 px sur mobile (11 au cycle 1). |
| LinkedIn B : sous-titre 36, #EDE9FE, titre 52, écart 8 | Fait (sous-titre 38) | Titre fini à x 982 (< 988), sous-titre à x 929. Contraste 6:1. |
| Instagram : sans libellé, boîte 520 centrée (540, 960), blanc, trait 2,8, famille au trait | Fait | Encre centrée à ±1 px (y 959), trait de 61 px = 2,8. Les 4 sont au trait, rayon max 248 à 328 < 360. |
| X B, LinkedIn A, Bureau | Supprimés (arbitrage) | Plus de note. |

## Notes
| Visuel | Cycle 1 | Cycle 2 | Écart restant |
|---|---|---|---|
| X A | 8 | **9** | Ligne d'appel à 13,5 px mobile (seuil 14). Bord droit 1388 sans lien avec le titre (1087) : accepté, la photo interdit la zone x < 400. |
| LinkedIn B | 8,5 | **8,5** | Risque logo mobile (ci-dessous) : début du texte mordu si recadrage 900 px. Bloc 6 px trop bas (marge haute 57, basse 36 sous la ligne de base). |
| IG Quiz | 7 | **10** | Net, rempli, centré. |
| IG Conseils | 7,5 | **10** | Ampoule lisible, jeux internes 26 px = 4,6 px sur écran 3x. |
| IG Vannes | 6 | **9,5** | Petite encoche de 1 à 2 px au raccord tige/arc (x 510 et 570, y 1140). |
| IG Répartie | (neuve) | **9** | Rayon 328 : marge 32 px (2 pt) contre 97 à 112 pour les 3 autres, donc plus lourde. Bulles soudées, encoche à (420 à 445, y 1000). |

## Risque LinkedIn mobile (recadrage 900 px central, source unique)
Zone visible x 114 à 1014, échelle 390/900 = 0,433. Logo de 72 pt à 16 pt du bord : x 151 à 317 en pixels source (335 si 80 pt). Le texte démarre à x 300 : **oui, le logo mord 17 px (35 si 80 pt)** : le « D » du titre (haut du logo à y 90, bas de la lettre à y 94) et surtout le « F » de « Fais » (x 300 à 325, y 121 à 147) sont entamés. Sans recadrage (logo fini à x 254), aucun contact.

## Corrections chiffrées (toutes les notes < 10)
- **LinkedIn B** : décaler le bloc de x 300 à **x 348** (gap 31 px à 72 pt, 13 px à 80 pt). Pour tenir dans 1014, titre **52 → 48 px** (largeur 630, fin x 978) et sous-titre 38 px inchangé (largeur 629, fin x 977) : les deux lignes finissent au même bord. Monter le bloc de **6 px** (top 41 → 35, ligne de base finale à y 141). Résultat : 16,6 px titre et 13,1 px sous-titre sans recadrage, 20,8 et 16,5 avec. Note attendue 10 (sous réserve du test téléphone).
- **X A** : ligne d'appel 52 → **56 px** (14,6 px mobile), bord droit gardé à x 1388, ligne de base inchangée (y 392), largeur 851 donc x 537 à 1388, descendantes à y 412 (< 430). Note attendue 10.
- **IG Répartie** : boîte 520 → **478 px** (92 %), même centre (540, 960), rayon max 328 → 302 (marge 58 px). Séparer les bulles d'un jeu de 1 unité (22 px) au croisement pour supprimer la soudure et l'encoche. Note attendue 10.
- **IG Vannes** : tige de 2,8 de large prolongée jusqu'au centre de l'arc (y 1110) pour effacer l'encoche. Écart micro/arc à garder à 26 px. Note attendue 10.

## Verdict
Famille Instagram cohérente (même trait, même boîte, même blanc, même aplat #6D28D9). X A et LinkedIn B gardent le même noir/aplat que v4/v5. Les 4 corrections sont des retouches de quelques pixels, sans changement de texte. Moyenne actuelle 9,3, attendue 10 après corrections. Le 10 reste conditionné à un test sur vrai téléphone (logo LinkedIn, photo X, cercle Instagram).
