# Verdict v4 : relecteur 2, « visiteur pressé sur mobile »

Captures lues dans apres-v4 : 320 (avant, chute), 375 (avant, chute, decryptage, accordeons, lire-suite), 768-avant, 1024 (avant, chute), 1440 (avant, chute).

## Test des 3 secondes (375-visiteur-avant.png)
- **Ce que je vois** : trois cartes empilées (Vanne, Conseil, Vidéo). Sur la Vanne, l'amorce puis, juste dessous, un bouton « Révéler la chute » bien marqué (pointillés violets francs, plus de zone vide).
- **Ce que je fais** : je tape dessus sans hésiter. Je sais ce qu'il va faire : afficher la fin de la vanne.

## Après le clic (375-visiteur-chute.png)
- **Compris ?** Oui. La chute remplace le bouton au même endroit, en gras dans un encadré violet, et l'amorce ne bouge pas. Pas de saut.
- **Je continue ou je décroche ?** Je continue. Le Conseil coupé à 3 lignes en fondu avec « Lire la suite » se lit d'un coup d'œil, et « Montreux Comedy · 7 min » me décide à lancer la vidéo. Je n'ouvre pas les accordéons dans le métro, mais je ne décroche pas.

## Notes (sur 10)
| Clarté | Chute | Hiérarchie | Cohérence | Espacements | Mobile | Finition | **Globale** |
|---|---|---|---|---|---|---|---|
| 9 | 9 | 9 | 9 | 8 | 10 | 9 | **9** |

## Défauts et corrections
1. **Chute, 9 / Hiérarchie, 9** (1024-visiteur-chute.png, 1440-visiteur-chute.png) : sur PC, l'amorce du bandeau fait ~48 px et la chute ~24 px. La chute, censée être le sommet de la vanne, paraît deux fois plus petite que l'amorce, ce qui donne un effet d'anticlimax (sur mobile, c'est l'inverse et ça marche). Correction dès 1024 : amorce à ~36 px en graisse normale, chute à ~36 px en gras (600) dans l'encadré, encadré élargi à la largeur de l'amorce. Le bouton reste collé à l'amorce.
2. **Clarté, 9 / Finition, 9** (375-visiteur-avant.png, 1440-visiteur-avant.png) : 🔥 13 et 💀 1 ne disent toujours pas ce qu'ils comptent, et le chiffre gris sur gris reste pâle. Correction : libellé accessible et étiquette visible à l'appui ou au survol, avec le sens défini par le produit (à ne pas inventer). Chiffre en gris clair ≥ #d4d4d4.
3. **Cohérence, 9** (1024-visiteur-avant.png vs 1440-visiteur-avant.png et 375-visiteur-avant.png) : à 1024, le Conseil s'affiche en entier, sans « Lire la suite », alors qu'il est replié partout ailleurs. Le même contenu se comporte autrement selon la largeur. Correction : même repli (3 lignes en fondu, puis « Lire la suite ») à 1024 ; laisser la carte Vidéo fixer la hauteur de la rangée.
4. **Espacements, 8** (1024-visiteur-avant.png) : dans la carte Conseil, ~37 px entre les pastilles et le titre et ~38 px entre le titre et le texte, contre ~17 px pour les blocs équivalents de la carte Vidéo voisine. Le contenu est étiré pour égaler la hauteur, ce qui crée un vide inexpliqué de plus de 24 px. Correction : écarts fixes (12 px pastilles/titre, 12 px titre/texte), surplus de hauteur absorbé au-dessus du pied (ou supprimé grâce au point 3). (1440-visiteur-avant.png) Le titre de la vidéo se casse sur 3 lignes étroites à droite de la miniature, avec ~60 px de vide à sa droite. Correction : retirer l'équilibrage forcé des lignes sur ce titre, ou réduire la miniature à 45 % de la largeur pour qu'il tienne en 2 lignes.

## Acquis v4
- Le bouton « Révéler la chute » est enfin évident.
- Accordéons unifiés (intertitres violets, didascalie en italique sur sa propre ligne).
- La durée passe dans la ligne de métadonnées : plus de chevauchement sur la miniature.
- Pastilles lisibles, et 320 / 375 / 768 impeccables.
- Sur PC, le bandeau Vanne puis la rangée Conseil + Vidéo (même hauteur, pieds alignés) est harmonieux.

## Handoff
Notes : clarté 9, chute 9, hiérarchie 9, cohérence 9, espacements 8, mobile 10, finition 9, globale 9/10 (sous la barre).
1. PC (dès 1024) : chute au moins aussi grosse que l'amorce (~36 px en gras toutes les deux, la chute dans l'encadré), sinon effet d'anticlimax.
2. À 1024 : Conseil replié comme ailleurs et écarts fixes de 12 px (aujourd'hui ~37 px, du contenu étiré).
3. Réactions 🔥 et 💀 libellées (sens défini par le produit) et chiffres plus clairs ; titre de la vidéo à 1440 sur 2 lignes.
