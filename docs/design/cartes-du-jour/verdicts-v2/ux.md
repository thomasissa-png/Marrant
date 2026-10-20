# Verdict relecteur n°3, « l'UX cohérence » : tour 2 (apres-v2-1)

Jugé tel quel, sur captures. Contraintes fondateur respectées dans les corrections : « Révéler la chute » reste collé à l'énoncé, pas de pastilles-ancres.
Parcours avant, chute, décryptage, accordéons testé aux 6 largeurs : rien de cassé, pas de débordement, parcours identique partout. Progrès nets depuis le tour 1 : header et grille alignés (x=1248 à 1280, `1280-visiteur-avant.png`), cibles 44 px prouvées (`375-visiteur-zones.png`), guillemets imbriqués corrigés (« “Non non, repose-toi.” » », `1280-visiteur-decryptage.png`), pieds alignés dès 1280, énoncé immobile au clic, focus bien visible sur bouton, accordéon, partage, étoile (`375-visiteur-focus-*.png`, `1280-visiteur-focus-bouton.png`, `1280-visiteur-focus-accordeon.png`).

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 7 |
| 6 | Mobile et tablette | 8 |
| 7 | Finition | 8 |
| | **Globale** | **8,4 / 10, encore sous la barre (10 attendu, aucun critère < 9)** |

## 1. Clarté (9)
- `375-visiteur-avant.png` : la 3e carte démarre à y~1064 (1,6 écran), hors du 1er écran. Sans ancres, il faut la rendre devinable : raccourcir ce qui précède. Voir critère 5 (espaces) et 6.

## 2. « Révéler la chute » (9)
- Collé à 12 px sous l'énoncé, énoncé immobile, chute lisible à sa place (`320-visiteur-chute.png`, `1280-visiteur-chute.png`).
- Reste : `1280-visiteur-chute.png`, la chute en 30 px sur 5 lignes avec retours forcés (« dessert. / « Pour pas que / tu te fatigues. » ») : coupe visible entre « Pour pas que » et « tu te fatigues ». Correction : `text-wrap: balance` sans `<br>` forcé, ou largeur max 20 ch pour couper après « dessert. ».

## 3. Hiérarchie (9)
- Sous-titres violets « L'euphémisme poli » / « À toi de jouer » : le niveau se lit enfin (`1280-visiteur-decryptage.png`).
- Reste : pastilles « Autodérision », « Débutant », « Timing » encore ~11 px, gris sur gris (`1440-visiteur-avant.png`). Correction : 12 px, texte #c4c4c8.

## 4. Cohérence (9)
- Accordéons tous à 46 px, icônes de carte en trait violet uniformes, pieds identiques.
- Reste : pieds conseil et vidéo avec la moitié gauche vide (`1440-visiteur-avant.png`, y 767). Correction : y placer la durée ou le niveau (ex. « Débutant · 3 min » / « 7 min »), ou tolérer si le fondateur le tranche.

## 5. Espacements et alignements (7)
- Vide de la vanne avant clic : 271 px entre le bouton (bas à y=462) et le pied (y=733) (`1280-visiteur-avant.png`, `1440-visiteur-avant.png`). Il se lit comme une carte vide ou non chargée. Correction sans déplacer le bouton : raccourcir la rangée pour réduire ce vide. À >= 1280 px, `line-clamp-3` au lieu de 6 sur le conseil (-72 px) et miniature en 2,2:1 au lieu de 16:9 (-37 px) : rangée ~700 px au lieu de 590+, vide ~180 px. Cible : vide <= 120 px.
- Décryptage ouvert : les pieds des voisines sautent de y=733 à y=1115 (+382 px) et il reste 400 px de vide au-dessus (`1280-visiteur-decryptage.png`). Les pieds peuvent sortir du viewport. Correction : animer 200 ms (hauteur) pour éviter le saut sec, et plafonner le corps de « Pourquoi ça marche » à 8 lignes visibles avec scroll interne au-delà. Arbitrage fondateur sinon : pieds alignés (actuel) ou voisines immobiles.
- Lien « Lire la suite » : 38 px jusqu'à l'accordéon suivant contre 8 px entre accordéons (`768-visiteur-avant.png` y 855 à 893 ; `375-visiteur-avant.png` y 815 à 853). Correction : 12 px de marge basse (zone cliquable de 44 px conservée par padding).
- H2 : ~75 à 90 px de vide entre header et titre à toutes les largeurs. Correction : 40 px sous 768 px (gain ~40 px mobile, rapproche la vidéo).

## 6. Mobile et tablette (8)
- 320/375 propres, zones 44 px, pas de défilement horizontal. Mobile : vidéo à 1,6 écran (`320-visiteur-avant.png`), à ramener vers 1,4 avec les corrections ci-dessus (H2 -40, lien -26).
- `1024-visiteur-avant.png` : pile de 576 px centrée avec 224 px de marge vide de chaque côté, page de 2083 px, alors que la rangée 3 colonnes arrive à 1280. Correction : à 1024 px, pile en 2 colonnes (vanne + conseil, vidéo en pleine largeur dessous) ou passer à 3 colonnes dès 1100 px avec cartes de 300 px minimum.
- `375-visiteur-focus-video.png` et `1280-visiteur-focus-video.png` : aucun anneau de focus visible sur la vidéo (identique à `-avant`). Correction : `:focus-visible` du bouton lecture, anneau 2 px lavande + décalage 2 px, sur toute la miniature (rayon 12 px).

## 7. Finition (8)
- Badge durée « 7 min » : il recouvre le « T » de « ROMAN FRAYSSINET » et une partie de la ligne « L'INTELLIGENCE DES ANIMAUX » dans la miniature (`320-visiteur-avant.png`, `375-visiteur-avant.png`, `768-visiteur-avant.png`, `1024-visiteur-avant.png`). À 1280 il frôle le sous-titre (`1280-visiteur-avant.png`). Correction : badge en haut à gauche (8 px, 8 px) ou sous la miniature, aligné à droite du nom de chaîne.
- Troncature mi-mot « visag… » (`1280-visiteur-avant.png`, y 517) : le clamp coupe au pixel. Correction : clamp en lignes entières avec `overflow-wrap: normal` et fondu de 24 px en bas plutôt qu'une ellipse, ou clamp par nombre de mots.
- Miniatures 2 et 3 : badge lisible sur fond clair (`375-visiteur-miniature-2.png`, `-3`), contraste OK. Cas 1 h 21 correct.

## Handoff (notes + corrections)
Notes : clarté 9, chute 9, hiérarchie 9, cohérence 9, espacements 7, mobile/tablette 8, finition 8 ; globale 8,4/10.
1. Vide de 271 px de la vanne et saut de pieds de +382 px à l'ouverture : clamp conseil 3 lignes et miniature 2,2:1 à >= 1280, animation 200 ms, plafond de hauteur du décryptage.
2. Badge durée qui masque le texte de la miniature (déplacer en haut à gauche) et focus vidéo invisible (anneau 2 px sur la miniature).
3. 1024 : pile de 576 px entre deux marges mortes de 224 px (2 colonnes ou 3 colonnes dès 1100 px) ; lien « Lire la suite » à 38 px de l'accordéon (12 px) ; H2 40 px sous 768 ; pastilles 12 px.
