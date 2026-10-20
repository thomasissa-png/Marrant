# Verdict v2-1 : relecteur 2, « visiteur pressé sur mobile »

Captures lues dans apres-v2-1 : 320 (avant, lire-suite), 375 (avant, chute, lire-suite, decryptage, accordeons, zones, focus-bouton, miniature-1), 768-avant, 1440 (avant, chute).

## Test des 3 secondes (375-visiteur-avant.png)
- **Ce que je vois** : trois cartes nettes (Vanne, Conseil, Vidéo), chacune avec une icône violette. Sur la Vanne, une amorce et « Révéler la chute » juste dessous.
- **Ce que je fais** : je tape sur « Révéler la chute ». Je sais ce qu'il va faire : afficher la fin de la vanne. Le bouton reste un peu discret (pointillés violet sombre), mais c'est bien lui que je vise en premier.

## Après le clic (375-visiteur-chute.png)
- **Compris ?** Oui. La chute remplace le bouton au même endroit, en gras dans un encadré, et l'amorce ne bouge pas. Pas de saut.
- **Je continue ou je décroche ?** Je continue. Le Conseil ne fait plus que 4 lignes, suivies de « Lire la suite », et je le lis en entier. Le badge « 7 min » me décide à ouvrir la vidéo. Seul moment d'hésitation : les accordéons « Exemple concret » et « Exercice du jour » ont des titres trop génériques pour me donner envie de les ouvrir dans le métro. Ce n'est pas bloquant.

## Notes (sur 10)
| Clarté | Chute | Hiérarchie | Cohérence | Espacements | Mobile | Finition | **Globale** |
|---|---|---|---|---|---|---|---|
| 9 | 9 | 9 | 8 | 8 | 9 | 8 | **9** |

## Défauts et corrections
1. **Clarté, 9** (375-visiteur-avant.png) : 🔥 9 et 💀 3 ne disent pas ce qu'ils comptent. Le 💀 peut se lire « bide » comme « mort de rire ». Correction : libellé accessible et étiquette visible à l'appui ou au survol, avec le sens défini par le produit (à ne pas inventer ici).
2. **Chute, 9** (375-visiteur-avant.png, 1440-visiteur-avant.png) : la bordure 1 px en pointillés violet sombre se lit encore comme une zone vide. Correction : bordure de 1,5 px en violet plus clair (~#8b5cf6 à 80 %), fond violet à 12 %. Garder le bouton collé à l'amorce (contrainte fondateur respectée).
3. **Hiérarchie, 9** (375-visiteur-chute.png) : les pastilles de réaction (texte ~12 px gris sur gris) sont à la limite de la lisibilité. Correction : chiffre en gris clair ≥ #d4d4d4, 13 px.
4. **Cohérence, 8** (375-visiteur-accordeons.png, 375-visiteur-decryptage.png) :
   - L'accordéon de la Vanne a des intertitres violets (« L'euphémisme poli », « À toi de jouer »), ceux des autres cartes n'en ont pas.
   - Les exercices s'ouvrent sur « DÉFI MIROIR : » ou « DÉFI FAUX NAÏF : » en capitales collées au texte, alors que « Ce que tu vas apprendre » est une liste à puces.
   - Le pied de carte n'a des réactions que sur la Vanne.
   Correction : un seul gabarit (intertitre violet 600 sur sa propre ligne, puis le texte) pour tous les accordéons, et un pied identique sur les 3 cartes.
5. **Espacements, 8** (1440-visiteur-avant.png) : avant le clic, la carte Vanne a un vide d'environ 270 px entre le bouton et le pied. (375-visiteur-avant.png) « Lire la suite » est à ~38 px du premier accordéon, contre ~24 px du texte au-dessus. Corrections : afficher dès l'état « avant », à toutes les largeurs, deux accordéons fermés et désactivés jusqu'à la révélation (« Pourquoi ça marche », « À toi de jouer »). La Vanne aurait ainsi la même structure que les deux autres cartes et le vide tomberait à ~160 px, sans décoller le bouton de l'amorce. Ramener l'écart « Lire la suite » / accordéon à 24 px.
6. **Mobile, 9** (320-visiteur-avant.png, 768-visiteur-avant.png) : le badge « 7 min » recouvre le texte incrusté de la miniature (le « T » de FRAYSSINET et la fin d'ANIMAUX à 320, le « T » à 768). Correction : badge en haut à gauche de la miniature (marge de 8 px), zone vide sur les miniatures vues. À vérifier sur les 3 miniatures. Les cibles de 44 px sont validées (375-visiteur-zones.png).
7. **Finition, 8** (375-visiteur-accordeons.png) : dans « Exemple concret », la didascalie « (pause de 3 secondes, regard fixe, visage neutre) » est coincée au milieu du dialogue. Correction : sur sa propre ligne, en italique gris clair. Plus le badge « 7 min » qui chevauche le titre de la miniature (point 6).

## Acquis v2-1
Conseil aéré grâce à « Lire la suite » / « Réduire », durée de la vidéo affichée, miniature propre (plus de bande sous le bandeau), cartes de même hauteur à 1440, guillemets imbriqués corrigés, texte des accordéons lisible, focus très visible (375-visiteur-focus-bouton.png).

## Handoff
Notes : clarté 9, chute 9, hiérarchie 9, cohérence 8, espacements 8, mobile 9, finition 8, globale 9/10 (sous la barre).
1. Badge « 7 min » en haut à gauche de la miniature : il chevauche le titre incrusté à 320 et 768.
2. Un seul gabarit d'accordéon (intertitre violet sur sa ligne, didascalies en italique) et un pied identique sur les 3 cartes.
3. Vide de la Vanne à 1440 : accordéons « Pourquoi ça marche » et « À toi de jouer » affichés fermés et désactivés avant la révélation, bouton toujours collé ; écart « Lire la suite » ramené à 24 px.
