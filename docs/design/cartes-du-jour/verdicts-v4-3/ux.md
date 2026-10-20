# Verdict relecteur n°3, « l'UX cohérence » : tour 7 (apres-v4-3)

Jugé tel quel, sur captures (6 largeurs, parcours avant, chute, décryptage, accordéons). Rien de cassé : pas de débordement, parcours identique partout, modèle Vidéo unique de 768 à 1440, focus et cibles 44 px conservés (`375-visiteur-focus-video.png`, `375-visiteur-zones.png`).
Corrigés depuis le tour 6 :
- en-têtes alignés au pixel dans la rangée (libellés à y=652, pastilles à y=684 des deux côtés, `1280-visiteur-avant.png`) et libellés à x=85 sur les 3 cartes ;
- « Révéler la chute » à nouveau évident, pointillés 2 px violet plein (`1280-visiteur-avant.png`, `375-visiteur-avant.png`) ;
- chute en cadre plein net (`1280-visiteur-decryptage.png`) ;
- 8 px entre accordéons dans les deux cartes (y 892/946 des deux côtés à 1280) ;
- décryptage presque plein : lignes jusqu'à x=918, plus de rag de 110 px.

| # | Critère | Note |
|---|---|---|
| 1 | Clarté | 10 |
| 2 | « Révéler la chute » | 10 |
| 3 | Hiérarchie | 10 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 10 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 9 |
| | **Globale** | **9,6 / 10, aucun critère < 9 mais la globale 10 n'est pas atteinte** |

## 4. Cohérence (9)
- `1024-visiteur-avant.png` : seul palier où le titre vidéo (15 px, « Roman Frayssinet - / L'intelligence des animaux ») est plus petit que le titre du conseil voisin (18 px), alors que les deux titres sont de même rang à 768 et à 1280 (18 px des deux côtés). L'écart de taille est visible dans la rangée. Écart documenté mais perceptible ; correction : titre vidéo à 16 px à 1024 avec `letter-spacing: -0.01em` et écart miniature-titre de 12 à 8 px (voir critère 6) pour garder 2 lignes, ou à défaut titre du conseil à 17 px à 1024 pour réduire l'écart visible.

## 6. Mobile et tablette (9)
- `1024-visiteur-avant.png` : « L'intelligence des animaux » (15 px) finit à x=973 pour un bord de contenu à x=975. Marge de sécurité de 2 px : une police de repli ou un titre de 1 ou 2 caractères de plus, et le titre passe sur 3 lignes (cas des 3 autres vidéos non montré à 1024). Correction : à 1024 seulement, écart miniature-titre de 8 px au lieu de 12 px (4 px de marge) et, si le titre dépasse 2 lignes, `line-clamp-2` avec ellipse plutôt que la 3e ligne.
- 320, 375, 768 : propres (`320-visiteur-avant.png`, `375-visiteur-avant.png`, `768-visiteur-avant.png`).

## 7. Finition (9)
- `1280-visiteur-avant.png` (y 813), `375-visiteur-avant.png` (y 733) : le fondu couvre désormais toute la dernière ligne, donc seules 2 lignes se lisent vraiment (3 annoncées) ; sur mobile, la 3e ligne « 3 secondes, pas avant la fin de ta phrase mais » est à ~30 % d'opacité et se lit mal comme texte. Correction : fondu en dégradé de 100 % à 45 % seulement sur la dernière ligne (opacité finale ≥ 45 %, au lieu de ~15 à 20 %).
- `1280-visiteur-decryptage.png` (y 840 à 864) : « “Non non, / repose-toi.” » » : la réplique est coupée entre deux lignes et le reste « repose-toi.” » » est seul sur la dernière ligne. Lisible ; à noter comme le dernier détail visible. Correction : lier « repose-toi.” » » (2 mots avec le guillemet) pour qu'il tienne en entier, ou accepter.
- Rien d'autre : bordures, contrastes, rayons, liseré de miniature (aucune bavure sur `375-visiteur-avant.png`).

## Handoff (3 lignes)
Notes : clarté 10, chute 10, hiérarchie 10, cohérence 9, espacements 10, mobile/tablette 9, finition 9 ; globale 9,6/10.
1. 1024 : titre vidéo à 15 px (seul palier plus petit que le titre du conseil) et marge de 2 px à droite (x=973 pour 975) ; écart miniature-titre à 8 px, titre à 16 px, `line-clamp-2`.
2. Fondu d'extrait limité à 45 % d'opacité finale (2 lignes lisibles seulement) ; « repose-toi.” » » à lier pour ne pas finir seul sur une ligne.
