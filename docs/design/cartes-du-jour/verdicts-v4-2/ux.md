# Verdict relecteur n°3, « l'UX cohérence » : tour 6 (apres-v4-2)

Jugé tel quel, sur captures (65 fichiers, 6 largeurs). Rien de cassé : pas de débordement, parcours avant, chute, décryptage, accordéons identique partout, modèle Vidéo unique de 768 à 1440, aucun vide intérieur > 24 px, focus net (miniature : `1280-visiteur-focus-video.png`, `375-visiteur-focus-video.png`), cibles 44 px (`375-visiteur-zones.png`), extrait de 3 lignes avec fondu court, « “Non non, repose-toi.” » » ne se coupe plus. Les 3 autres vidéos (`1280-visiteur-miniature-1.png` à `-3`, `375-visiteur-miniature-1.png` à `-3`) tiennent dans le même modèle. La vidéo hors du 1er écran sur mobile n'est pas comptée (consigne).

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 10 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 10 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 9 |
| 6 | Mobile et tablette | 10 |
| 7 | Finition | 9 |
| | **Globale** | **9,4 / 10, aucun critère < 9 mais la globale 10 n'est pas atteinte** |

## 2. « Révéler la chute » (9)
- `1280-visiteur-avant.png`, `375-visiteur-avant.png`, `768-visiteur-avant.png` : depuis le passage des pointillés à 1,5 px, le contour du bouton est nettement plus pâle que dans la v4.1 (violet terne sur fond de carte #1f1f1f, ~2:1 estimé à l'œil) ; le bouton, action principale, se lit moins que les accordéons gris des cartes du dessous. Correction : pointillés à 1,5 px en violet plein #8b6cf0 (pas de transparence, ~4:1), fond du bouton inchangé. Même couleur pour le cadre de la chute (`1280-visiteur-chute.png`, contour ~#5b44a5) en gardant 1,5 px, pour que le passage bouton → chute reste sans saut.

## 4. Cohérence (9)
- `1280-visiteur-avant.png` : l'ampoule à 24 px décale l'en-tête du Conseil. Libellé « Conseil du jour » à x=89 contre x=85 pour « Vanne du jour » et x=705 (soit +28 depuis le bord, contre +32 pour le Conseil) pour « Vidéo du jour ». Les 3 en-têtes ne sont plus identiques. Même défaut sur `375-visiteur-avant.png` (x=65 contre x=61).
- Même capture : dans la rangée, libellé du Conseil à y=648 et pastille « Débutant » à y=680, contre y=646 et y=676 côté Vidéo. Les deux cartes voisines ont leurs en-têtes décalés de 2 et 4 px (parfait en v4.1 : 647/678 contre 646/676).
- Correction pour les deux : loger les 3 icônes dans un emplacement fixe de 20 x 20 px (`size-5`, `shrink-0`), l'ampoule dessinée à 24 px avec `-m-0.5` ou un trait plus épais (2 px) à 20 px ; libellé toujours à 8 px de l'emplacement. Hauteur de ligne d'en-tête identique : 24 px.

## 5. Espacements et alignements (9)
- `1024-visiteur-avant.png` : dans la carte Vidéo, l'espace entre les 2 accordéons est de 21 px (pas de 68 px, y 867 à 935) contre 8 px dans le Conseil voisin (y 888 à 942, pas de 54 px). Les accordéons des deux cartes n'ont plus le même rythme (constaté aussi sur `1024-visiteur-accordeons.png`). C'est le reste de 37 px réparti. Correction : écart fixe de 8 px entre accordéons dans toutes les cartes et à toutes les largeurs ; le reste va entre les blocs (miniature vers accordéons, accordéons vers filet), 24 px au plus, et si besoin l'extrait du Conseil passe à 4 lignes à 1024 (+24 px, reste ramené à ~13 px).
- `1280-visiteur-decryptage.png` (y 810 à 858, « À toi de jouer ») : lignes arrêtées à x=839 et x=851 pour un cadre allant jusqu'à x=959, soit ~110 px de rag. « tous : “Non non, repose-toi.” » » est maintenant renvoyé en bloc. Idem `1024-visiteur-accordeons.png` (x=683 et x=694 pour un cadre à x=797). Correction : insécable sur « Non non, » seulement (3 mots), ou `text-wrap: pretty` sur le paragraphe, pour que « tous : » remonte sur la ligne précédente.

## 6. Mobile et tablette (10)
- 320, 375, 768 : propres, cibles 44 px, titre vidéo sur 2 lignes (`768-visiteur-avant.png`, bloc titre centré 31/31).
- Remarque non bloquante : `1024-visiteur-avant.png`, « L'intelligence des animaux » (16 px) finit à x=973 pour un bord de carte intérieur à x=975. Aucune marge de sécurité. À traiter avec la correction d'espacement de 1024 (miniature 180 px au lieu de 190 px pour gagner ~10 px).

## 7. Finition (9)
- Défaut du critère 5 (rag du décryptage) : l'alignement irrégulier du bloc le plus lu après la chute se voit sur toutes les largeurs PC. Plus aucun autre défaut relevé : bordures, rayons, contrastes du texte (blanc sur #1f1f1f, liens #a78bfa), badge durée sous la miniature.

## Handoff (3 lignes)
Notes : clarté 10, chute 9, hiérarchie 10, cohérence 9, espacements 9, mobile/tablette 10, finition 9 ; globale 9,4/10.
1. Icônes dans un emplacement fixe de 20 px : l'ampoule à 24 px décale le libellé du Conseil de 4 px en x et les en-têtes de la rangée de 2 à 4 px en y (`1280-visiteur-avant.png`) ; pointillés de « Révéler la chute » en violet plein #8b6cf0.
2. Accordéons à 8 px d'écart partout (21 px dans la Vidéo à 1024) ; insécable limité à « Non non, » ou `text-wrap: pretty` dans le décryptage.
