# Verdict v1 : relecteur 2, « visiteur pressé sur mobile »

Captures lues : apres-v1/320-* et 375-* (avant, chute, decryptage, accordeons, focus), puis 768-visiteur-chute et 1440-avant/chute. 1024 non regardé.

## Test des 3 secondes (375-visiteur-avant.png)
- **Ce que je vois** : « Ton contenu du jour », puis une carte « Vanne du jour » avec une phrase d'amorce et une zone « Révéler la chute ». En bas de l'écran, le début d'une carte « Conseil du jour ».
- **Ce que je fais** : je tape sur « Révéler la chute ». C'est la seule action évidente de l'écran, l'œil et le mot « chute » disent qu'une suite est cachée.
- **Le bouton est-il évident ?** Oui à 90 %. La bordure en pointillés violet pâle évoque une zone vide, presque un emplacement désactivé, plus qu'un bouton. Je comprends ce qu'il va faire (afficher la fin de la vanne), mais il ne m'appelle pas franchement à taper.

## Après le clic (375-visiteur-chute.png)
- **Compris ?** Oui, tout de suite. L'amorce reste en place, la chute apparaît exactement à l'endroit du bouton, plus grosse et en gras dans un encadré. Aucun saut gênant : la carte grandit vers le bas, hors de l'écran visible. « Pourquoi ça marche · L'euphémisme poli » donne envie d'ouvrir.
- **Je continue ou je décroche ?** Je fais défiler, puis **je décroche sur la carte Conseil** : un pavé de 9 lignes à 375 (13 lignes à 320), sans relief ni mot en gras. Dans le métro, je saute le paragraphe. Je reprends sur la miniature vidéo, mais je ne sais ni combien de temps elle dure ni où elle va s'ouvrir.

## Notes (sur 10)
| Critère | Note |
|---|---|
| 1. Clarté | 8 |
| 2. « Révéler la chute » | 9 |
| 3. Hiérarchie | 8 |
| 4. Cohérence | 7 |
| 5. Espacements et alignements | 7 |
| 6. Mobile et tablette | 8 |
| 7. Finition | 8 |
| **Globale** | **8** |

## Défauts et corrections
1. **Clarté, 8** (375-visiteur-avant.png) : sur la carte Conseil, on ne sait pas quoi faire ; le texte forme un seul bloc. Correction : couper le paragraphe en deux à « Garde le regard posé », mettre en gras (600) « une pause d'environ 3 secondes », 12 px entre les deux paragraphes, sans toucher au texte. Les pastilles 🔥 8 et 💀 1 ne disent pas ce qu'elles comptent : ajouter un libellé accessible et une étiquette visible au survol ou à l'appui (« 8 ont ri »).
2. **Chute, 9** (375-visiteur-avant.png, 320-visiteur-avant.png) : la bordure 1 px en pointillés violet sombre sur fond quasi noir se lit comme une zone vide. Correction : bordure de 1,5 px en violet plus clair (~#8b5cf6 à 80 %), fond violet à 12 %, libellé en 600. Garder les pointillés (l'idée du « caché » fonctionne).
3. **Hiérarchie, 8** (375-visiteur-decryptage.png, 375-visiteur-accordeons.png) : le texte des accordéons est gris en ~14 px, alors que le corps du Conseil est blanc en ~15 px. On a l'impression d'un texte secondaire, voire désactivé. Correction : corps des accordéons en même taille et même couleur que le corps des cartes (15 px, gris clair ≥ #d4d4d4).
4. **Cohérence, 7** (375-visiteur-chute.png) : le pied de la Vanne a des réactions, ceux du Conseil et de la Vidéo n'ont que deux icônes alignées à droite, avec un grand vide à gauche. L'accordéon de la Vanne tient sur 2 lignes (titre + sous-titre), les autres sur 1 seule. (375-visiteur-accordeons.png) Les contenus ouverts ont 3 formats : prose, préfixe « DÉFI MIROIR : » en capitales, liste à puces. Correction : même pied sur les 3 cartes (réactions partout, ou nulle part), sous-titre gris d'une ligne sur chaque accordéon, et un seul gabarit d'exercice (intitulé en gras sur sa propre ligne, puis la consigne).
5. **Espacements, 7** (1440-visiteur-avant.png) : les cartes ont des hauteurs différentes (environ 345, 625 et 600 px), ce qui laisse un trou de ~280 px sous la Vanne. Correction : `align-items: stretch` sur la rangée, pied de carte poussé en bas (`margin-top: auto`). (375-visiteur-avant.png) environ 65 px de vide entre l'en-tête et le titre H2, alors qu'à cet endroit chaque pixel compte : ramener à 32 px sur mobile.
6. **Mobile, 8** (375-visiteur-chute.png, 320-visiteur-avant.png) : les boutons partager et favori font environ 32 px, sous le confort tactile. Correction : zone cliquable de 44 × 44 px (le disque visible peut rester à 32 px). Rien de coupé à 320, 375 ni 768.
7. **Finition, 8** (375-visiteur-avant.png, 1440-visiteur-avant.png) : la miniature vidéo laisse voir une bande de 3 à 4 px (les points lumineux) sous le bandeau jaune. Correction : `object-fit: cover` au ratio 16:9 exact, `object-position: center top` ou recadrage. (375-visiteur-decryptage.png) Guillemets imbriqués collés « … « Non non, repose-toi. » » : employer des guillemets anglais à l'intérieur (“Non non, repose-toi.”). Ajouter un badge de durée sur la miniature si la donnée existe (ne pas l'inventer).

## Points forts
Révélation de la chute exemplaire (en place, lisible, sans saut). L'anneau de focus est très visible (375-visiteur-focus.png). Rien de cassé de 320 à 1440.

## Handoff
Notes : clarté 8, chute 9, hiérarchie 8, cohérence 7, espacements 7, mobile 8, finition 8, globale 8/10 (sous la barre).
1. Carte Conseil : aérer le pavé (2 paragraphes, passage clé en gras), sinon le visiteur décroche dès la 2e carte.
2. Cohérence : même pied et même format d'accordéon sur les 3 cartes, avec des cibles de 44 px.
3. PC et finition : cartes de même hauteur à 1440, miniature vidéo recadrée, guillemets imbriqués corrigés.
