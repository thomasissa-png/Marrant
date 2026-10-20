# Verdict v4 : le designer exigeant (UI senior)

Dossier : `apres-v4/` (composition choisie par le fondateur : bandeau Vanne pleine largeur dès 1024 px, Conseil et Vidéo dessous, pile sous 1024 px).
Lu : `avant`, `chute`, `decryptage` à 1440, 1280 (avant), 1024 (avant, decryptage), 768 (avant, decryptage), 375 (avant, chute), 320 (avant, decryptage) ; `lire-suite`, `lire-suite-ouvert`, `decryptage-ouvert`, `accordeons` à 1440 ; `vanne-courte-avant`, `vanne-longue-avant`/`-chute`, `conseil-court-avant`, `conseil-long-avant` à 1440 ; `vanne-longue-avant` et `conseil-court-chute` à 1280 ; `focus-bouton` 1280.
Non lues : `accordeons` aux autres largeurs, `zones`, `focus-*` 375, `miniature`. Couleurs estimées à l'oeil.

## Notes (v2.1 : 9, 9, 9, 9, 7, 8, 8, global 8,5)
| # | Critère | v4 |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 8 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 8 |
| 6 | Mobile et tablette | 8 |
| 7 | Finition | 9 |
| **Globale** | | **8,7/10** (barre 10/10 non atteinte) |

Acquis : l'harmonie est là. `1440-visiteur-avant.png` : le bandeau (407 px) et la rangée Conseil / Vidéo de 474 px chacune, pieds alignés, bords communs, gouttières de 24 px. Le vide de 271 px de la v2.1 a disparu. La durée est à côté du nom de chaîne, plus de collision avec la miniature. L'extrait en dégradé est propre, sans « visag… ». Les quatre jeux réels (`vanne-courte`, `vanne-longue`, `conseil-court`, `conseil-long`) gardent la rangée à 474 px. « Révéler la chute » est collé à l'énoncé et visible (`1280-visiteur-focus-bouton.png` : double anneau net).

## 3. Hiérarchie (8)
- `1440-visiteur-chute.png` : l'énoncé fait ~52/56 px en regular, la chute ~26/32 px en semi-gras. La chute, qui est le moment fort, est deux fois plus petite que sa mise en place. Le cadre violet compense en partie, pas assez. Correction dès 1024 : énoncé 40/48 (`text-4xl`), chute 32/40 (`text-3xl`) avec `max-w-[36rem]`, de façon que le dernier mot lu soit le plus lourd visuellement.
- `1440-visiteur-vanne-longue-chute.png` : l'énoncé (656 px de large, 6 lignes) déborde de 40 px de chaque côté du bloc chute et bouton (576 px). Deux largeurs de colonne pour un même axe. Correction : un seul `max-w` (576 ou 656) pour énoncé, bouton, chute et accordéon.

## 5. Espacements et alignements (8)
- `1024-visiteur-avant.png` : dans le Conseil (texte entier, 9 lignes), les écarts font 33 px (tags vers titre, titre vers corps, corps vers accordéons, accordéons vers filet). La Vidéo voisine reste à ~15 à 20 px (tags vers miniature : 15 px). Les deux cartes sœurs n'ont pas le même rythme, et ça dépasse les 24 px de la grille. Cause : le reste de hauteur est réparti dans les écarts du Conseil. Correction : plafonner les écarts à 24 px. Le reste va dans la Vidéo (miniature à `aspect-[16/9]` agrandie, ou `min-h` du bloc), ou dans un `line-clamp-6` du Conseil à 1024 aussi.
- `1440-visiteur-conseil-court-avant.png` : même défaut (écart titre vers corps ~33 px, corps vers accordéons ~40 px, contre ~21 px sur `1440-visiteur-avant.png`). Le texte à 3 lignes flotte entre deux grands blancs. Même correction : écarts à 24 px au plus, reste absorbé par la Vidéo (miniature plus haute de ~30 px).
- `1440-visiteur-avant.png` : tags vers énoncé 37 px, bouton vers filet 32 px dans le bandeau. Un cran au-dessus des 24 px de la grille, c'est une marge d'aération assumée mais non homogène. Correction : `pt-6` (24 px) au-dessus de l'énoncé et `pb-6` sous le bouton.
- `1440-visiteur-decryptage-ouvert.png` : « L'anatomie / d'une vanne » coupe le lien en deux. Correction : `white-space: nowrap` sur le lien, il passe en ligne seule.
- `1440-visiteur-accordeons.png` : 725 px contre 875 px (150 px d'écart, vide sous Conseil). Accepté par l'arbitrage, pas pénalisé.

## 6. Mobile et tablette (8)
- `768-visiteur-avant.png` et `768-visiteur-decryptage.png` : dans la carte Vidéo, les accordéons sont rangés dans la colonne de droite (251 px) sous le titre. Il reste ~47 px de vide sous la miniature à gauche, avant le filet. À 375 et 1024, ces mêmes accordéons sont pleine largeur. Défaut de cohérence entre largeurs. Correction : à 768, miniature + titre sur une ligne, accordéons pleine largeur dessous (pile identique à 1280). `768-visiteur-accordeons.png` non lu : vérifier que le corps ouvert ne devient pas une colonne de 251 px.
- `1024-visiteur-avant.png` : la Vidéo passe en miniature pleine largeur (426 × 240) alors que `1280-visiteur-avant.png` la montre en ligne (290 px + titre). Deux compositions pour une même carte, et la version 1024 est la plus haute de la page (615 px). Correction : garder la version en ligne dès 1024 (miniature 240 px de large). La carte raccourcit, ce qui règle aussi les écarts du Conseil ci-dessus.
- `375-visiteur-chute.png`, `320-visiteur-decryptage.png` : la chute coupe bien avant « « Pour pas que » ». Rien à corriger.

## 7. Finition (9)
- `1440-visiteur-avant.png` : le bouton en pointillés violets de 2 px (~#8b5cf6) est maintenant très présent. C'est lisible (≥ 3:1) mais le pointillé lourd évoque un emplacement de wireframe. Correction : bordure 1.5 px et pointillés plus fins (`border-dashed` à 1.5 px, `violet-400`), ou bordure pleine violette avec le fond actuel. Garder l'anneau de focus (`1280-visiteur-focus-bouton.png`).
- `1440-visiteur-avant.png` : le dégradé de l'extrait coupe la 3e ligne à mi-phrase (« … Garde »), sans point de suspension. Lisible, mais le corps de la phrase se termine sur un mot isolé. Correction : coupure du dégradé à 55 % au lieu de ~35 %, ou extrait à 2 lignes + dégradé plein.
- Positifs : tags blancs lisibles, filets et bordures visibles, icônes d'en-tête cohérentes, accordéons à un format, libellés violets (« L'euphémisme poli », « À toi de jouer ») nets.

## Handoff
Notes v4 : clarté 9, chute 9, hiérarchie 8, cohérence 9, espacements 8, mobile/tablette 8, finition 9. Globale 8,7/10 (barre non atteinte).
Corrections :
1. Hiérarchie : chute plus grande que l'énoncé (énoncé 40/48, chute 32/40 dès 1024) et un seul axe de largeur (`max-w` commun) pour énoncé, bouton, chute et décryptage.
2. Rangée 1024 et conseil court : écarts du Conseil plafonnés à 24 px (33 à 40 px aujourd'hui), reste de hauteur absorbé par la miniature Vidéo ; garder la Vidéo en ligne dès 1024.
3. 768 : accordéons Vidéo pleine largeur sous la miniature (47 px de vide à gauche aujourd'hui) ; lien « L'anatomie d'une vanne » en `nowrap`.
