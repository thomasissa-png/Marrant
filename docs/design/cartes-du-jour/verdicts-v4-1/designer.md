# Verdict v4.1 : le designer exigeant (UI senior)

Dossier : `apres-v4-1/`. Lu : `avant`, `chute`, `decryptage-ouvert`, `lire-suite-ouvert`, `accordeons`, `vanne-longue-chute`, `vanne-courte-avant`, `conseil-court-avant` à 1440 ; `avant`, `focus-video`, `focus-accordeon` à 1280 ; `avant`, `accordeons` à 1024, 768, 375 ; `chute` à 320.
Non lues : `focus-partage`/`etoile`, `zones`, les autres jeux réels. Le dossier ne contient aucun fichier `miniature-*` : les miniatures de plusieurs vidéos ne sont donc pas jugeables. Couleurs estimées à l'oeil.

## Notes (v4 : 9, 9, 8, 9, 8, 8, 9, global 8,7)
| # | Critère | v4.1 |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 8 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 9 |
| **Globale** | | **8,9/10** (barre 10/10 non atteinte) |

Acquis : bandeau compact de 359 px (`1440-visiteur-avant.png`), énoncé 40 px, bouton et chute sur un axe de 672 px. La chute passe en gras 32/40, plus lisible que l'énoncé (`1440-visiteur-chute.png`, `1440-visiteur-vanne-longue-chute.png`). Rangée 453 / 453 px, filets alignés, plus d'écart gonflé (écarts ~20 px partout). Vidéo sur un seul modèle de 768 à 1440. Lien « L'anatomie d'une vanne » sur une ligne. Anneau de focus sur la miniature (`1280-visiteur-focus-video.png`) et sur les accordéons (`1280-visiteur-focus-accordeon.png`).

## 5. Espacements et alignements (8)
- `1440-visiteur-avant.png`, `1280-visiteur-avant.png` : à droite de la miniature, le bloc titre + chaîne ne fait que 72 px de haut pour 142 px de miniature. Il reste ~70 px de vide sous « Montreux Comedy · 7 min » (y 775 à 847, x 1034 à 1303). C'est le plus grand blanc inexpliqué de la rangée, et le test « vides ≤ 24 px » ne le détecte pas. Même défaut à `768-visiteur-avant.png` (~55 px) et `1440-visiteur-conseil-court-avant.png` (~50 px). Correction : `align-items: center` sur la ligne miniature + titre, pour que le bloc se centre (≈ 35 px au-dessus et au-dessous) et paraisse voulu.
- `1440-visiteur-conseil-court-avant.png` : miniature réduite à 203 × 114 px (253 px ailleurs). Le texte incrusté « ROMAN FRAYSSINET » devient illisible et la miniature change de taille d'un jeu à l'autre. Correction : plancher à 240 px de large (`min-w-[240px]`), l'excédent va dans l'écart du Conseil (≤ 24 px) ou dans la hauteur du Conseil court.
- `1440-visiteur-decryptage-ouvert.png` : le 2e paragraphe (« Montre ton défaut… ») s'arrête 60 à 90 px avant le bord droit alors que le 1er paragraphe remplit la ligne. Le guillemet est coupé en « “Non / non, repose-toi.” ». Correction : espace insécable entre « Non » et « non », ce qui redonne une coupe régulière.
- `1440-visiteur-accordeons.png` : 725 / 854 px, bas de rangée inégal de 129 px. Accepté par l'arbitrage (principe v4), pas pénalisé.

## 3. Hiérarchie (9)
- `1024-visiteur-avant.png`, `1280-visiteur-avant.png` : l'extrait du Conseil montre 2 lignes lisibles + 1 ligne à ~35 % (1280, 1440) ou 1 ligne + 1 ligne en fondu (1024). Le bloc d'extrait se lit comme « coupé » plus que comme « aperçu ». Correction : fondu sur la dernière demi-ligne seulement (`mask: linear-gradient(#000 70%, transparent)`), pour garder la ligne 2 entièrement lisible.
- `1440-visiteur-vanne-longue-avant.png` : énoncé de 6 lignes centrées (28 px). Lisible, mais un long paragraphe centré fatigue. Pour les énoncés > 120 caractères, un `text-align: left` dans l'axe de 672 px donnerait un meilleur rythme de lecture.

## 7. Finition (9)
- `1440-visiteur-avant.png` : bouton « Révéler la chute » en pointillés violets de 2 px (~#8b5cf6) : le look « emplacement de wireframe » de la v4 est inchangé. Correction : pointillés de 1.5 px (`border-dashed`, `violet-400`), ou bordure pleine violette avec le fond actuel et un pointillé seulement au survol.
- `1440-visiteur-avant.png` : l'ampoule du Conseil reste optiquement plus petite que la tête rieuse et la claquette (traits fins, forme étroite). Correction : ampoule à 22 px, ou `Lamp`.
- Positifs : bordures et filets visibles, anneau de focus 2 px net, libellés violets d'accordéon cohérents, plus d'ellipse en pleine phrase.

## 6. Mobile et tablette (9)
- `375-visiteur-avant.png`, `320-visiteur-chute.png` : propres. Chute coupée avant « « Pour pas que », vidéo en pile avec miniature pleine largeur, accordéons pleine largeur. Un détail à 320 : la chute fait 5 lignes à 20 px (« Ils apportent / toujours l'entrée, le… »), un peu haute. Correction : `text-wrap: pretty` à la place de `balance` sous 360 px.
- `768-visiteur-accordeons.png` : le Conseil et la Vidéo ouverts tiennent bien. Rien à corriger.

## Handoff
Notes v4.1 : clarté 9, chute 9, hiérarchie 9, cohérence 9, espacements 8, mobile/tablette 9, finition 9. Globale 8,9/10 (barre non atteinte).
Corrections :
1. Vidéo : centrer verticalement le bloc titre + chaîne à côté de la miniature (70 px de vide à droite à 1280/1440, 55 px à 768), plancher de 240 px sur la miniature.
2. Typographie : espace insécable dans « “Non non, repose-toi.” » (coupure et ragged à 1440), fondu sur une demi-ligne seulement pour l'extrait Conseil.
3. Finition : pointillés du bouton à 1.5 px (ou bordure pleine), ampoule à 22 px. Fichiers `miniature-*` absents du dossier, donc non jugés.
