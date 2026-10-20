# Verdict v4.3 : le designer exigeant (UI senior)

Dossier : `apres-v4-3/`. Lu : `avant`, `decryptage-ouvert`, `accordeons`, `conseil-court-avant`, `vanne-longue-chute` à 1440 ; `vanne-courte-avant`, `conseil-long-chute`, `focus-video`, `miniature-2`, `miniature-3` à 1280 ; `avant`, `accordeons` à 1024 ; `chute` à 768 ; `avant`, `decryptage` à 320 ; `miniature-1`, `miniature-3`, `focus-partage`, `zones` à 375.
Non lues : `focus-bouton`/`accordeon`/`etoile`, `1280-miniature-1`, `375-miniature-2`, `lire-suite-*`, `1280-vanne-longue-*`. Couleurs estimées à l'oeil.

## Notes (v4.2 : 9 partout, global 9)
| # | Critère | v4.3 |
|---|---|---|
| 1 | Clarté | 10 |
| 2 | « Révéler la chute » | 10 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 9 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 9 |
| **Globale** | | **9,3/10** (aucun critère < 9, barre 10/10 non atteinte) |

Acquis : le bouton « Révéler la chute » a un pointillé violet plein de 2 px, net sur tous les fonds (`1440-visiteur-avant.png`, `320-visiteur-avant.png`) ; l'encadré de la chute en trait plein ne bouge pas au clic. Le fondu de l'extrait Conseil couvre toute la dernière ligne et ne coupe plus de jambages. Trois libellés d'en-tête alignés au pixel à 1440 (x=165 / x=785, y=652 sur les deux cartes). Accordéons à 8 px d'écart dans les deux cartes. Liseré des miniatures sombres visible (`1280-visiteur-miniature-3.png`). Focus net sur la miniature (`1280-visiteur-focus-video.png`) et sur le bouton partage (`375-visiteur-focus-partage.png`). Les 3 vidéos de remplacement gardent la rangée à l'identique (`1280-visiteur-miniature-2.png`, `-3.png`).

## 3. Hiérarchie (9)
- `1024-visiteur-avant.png`, `1024-visiteur-accordeons.png` : titre vidéo en 15 px à côté du titre Conseil en 18 px, sur la même ligne de rangée. Le titre Vidéo paraît moins important que celui du Conseil voisin. Correction : gouttière latérale de la page à 1024 de 24 px à 16 px (+16 px de largeur utile, +8 px par colonne) et gouttière entre colonnes de 24 à 16 px : le titre revient à 16 px (voir le critère 4) sans toucher aux écarts.

## 4. Cohérence (9)
- `1440-visiteur-avant.png` : les en-têtes sont alignés, mais la pastille « 🔥 4 / 💀 2 » du pied de la Vanne est la seule icône en emoji couleur parmi les icônes linéaires violettes (en-têtes, partage, étoile, chevrons). Rendu variable selon l'OS, et seule pastille colorée de la section. Correction : `Flame` et `Skull` Lucide 14 px, stroke 1.75, `text-gray-300` (les compteurs en 12 px identiques). Si le fondateur garde les emojis, ce point reste à 9.
- `1024-visiteur-avant.png` : le titre vidéo en 15 px est la seule taille de titre qui change selon la largeur (18 px partout ailleurs). Même correction qu'au critère 3.

## 5. Espacements et alignements (9)
- `1024-visiteur-avant.png` : « L'intelligence des animaux » s'arrête à x=973, soit 2 px du bord du contenu de la carte (x=975). Le texte colle à la marge droite. Correction : gouttières à 16 px (critère 3) ou `padding-right: 8px` sur le bloc titre.
- `1440-visiteur-decryptage-ouvert.png`, `320-visiteur-decryptage.png` : le 2e paragraphe finit sur une ligne courte (« repose-toi.” » »). Une veuve d'un mot en dernière ligne, léger mais visible. Correction : `text-wrap: pretty` seulement sur les paragraphes de 3 lignes ou moins, ou espace insécable entre « tous : » et « “Non non, ». Les corps d'accordéon sont sinon pleins (x=1039).
- `1440-visiteur-accordeons.png` : 725 / 854 px, bas de rangée inégal de 129 px, accepté par l'arbitrage (principe v4).

## 6. Mobile et tablette (9)
- `375-visiteur-zones.png` : la zone orange du lien « Lire la suite » (44 px) empiète sur la 3e ligne de l'extrait (y=741 pour une ligne à y=733) : le toucher sur la fin de ligne ouvre l'extrait, on ne s'en rend compte qu'au clic. Correction : `margin-top: 8px` d'espace mort au-dessus du lien (zone commençant sous le fondu), ou réduire la zone à 40 px de haut avec 4 px de marge sur le texte.
- `768-visiteur-chute.png`, `320-visiteur-decryptage.png` : rien de cassé. Chute à 24 px en gras dans l'encadré, accordéons pleine largeur.

## 7. Finition (9)
- `1280-visiteur-miniature-3.png` : « 1 h 21 » seul sous le titre, sans nom de chaîne, laisse un blanc sous une ligne de 12 px à gauche. C'est une donnée absente, pas un défaut de composant. Le bloc reste centré (34 px de chaque côté). À signaler au contenu, pas au design.
- `1440-visiteur-vanne-longue-chute.png` : énoncé de 6 lignes centrées à 28 px : il demande un effort de lecture. Correction : pour les énoncés > 120 caractères, `text-align: left` dans l'axe de 672 px, bloc centré.

## Handoff
Notes v4.3 : clarté 10, chute 10, hiérarchie 9, cohérence 9, espacements 9, mobile/tablette 9, finition 9. Globale 9,3/10 (barre non atteinte).
1. 1024 : gouttières de page et de rangée à 16 px, titre vidéo à 16 px au lieu de 15 px, fin du « collé au bord » de « L'intelligence des animaux ».
2. Pied de la Vanne : 🔥 💀 en Lucide `Flame` / `Skull`, seule icône en emoji couleur de la section ; zone de « Lire la suite » démarre sous le fondu (empiète sur la 3e ligne à 375).
3. Typo : veuve « repose-toi.” » » à 1440 et 320 ; énoncé de 6 lignes aligné à gauche dans l'axe de 672 px.
