# Verdict v4-2 (confirmation) : relecteur 2, « visiteur pressé sur mobile »

Captures lues dans apres-v4-2 : 375 (avant, chute), 320-chute, 1024-avant, 1440-chute. Réactions 🔥 💀 non notées (hors périmètre).

## Test des 3 secondes et après le clic
- **375-visiteur-avant.png** : je comprends la carte Vanne et je tape sur « Révéler la chute ». Mais le bouton a perdu de sa force : il est revenu à une bordure fine (~1 px), en pointillés violet pâle. On retrouve l'aspect « zone vide » des premiers tours. On le trouve encore, mais il n'appelle plus franchement.
- **375-visiteur-chute.png, 320-visiteur-chute.png** : la chute s'affiche à sa place, sans saut, toujours lisible. L'encadré de la chute est lui aussi passé en bordure fine et pâle : il se détache moins.
- **Je décroche ?** Non. Le Conseil replié avec « Lire la suite » et la vidéo avec « 7 min » me gardent.

## Notes (sur 10)
| Clarté | Chute | Hiérarchie | Cohérence | Espacements | Mobile | Finition | **Globale** |
|---|---|---|---|---|---|---|---|
| 10 | 9 | 10 | 10 | 9 | 10 | 9 | **9** |

## Dégradations depuis le 10/10 (v4-1)
1. **Chute, 9** (375-visiteur-avant.png, 1024-visiteur-avant.png) : la bordure du bouton est passée des pointillés violets francs (~2 px, violet vif) à ~1 px violet pâle. Correction : revenir à la bordure de la v4-1, en pointillés ~2 px, violet ~#8b5cf6 opaque. Faire de même pour l'encadré de la chute : bordure pleine ~2 px violet vif (375-visiteur-chute.png, 1440-visiteur-chute.png).
2. **Finition, 9** (375-visiteur-avant.png, 1024-visiteur-avant.png, 1440-visiteur-chute.png) : le fondu sur la dernière ligne du Conseil replié a disparu. Le texte s'arrête net en plein milieu de la phrase, dans la même couleur que le reste. À 1440, la dernière ligne paraît même rognée en bas. Correction : rétablir le dégradé (dernière ligne qui s'efface vers le fond de la carte) et couper sur une ligne entière.
3. **Espacements, 9** (1024-visiteur-avant.png) : dans la carte Vidéo, ~22 px séparent « Ce que tu vas apprendre » de « Exercice pratique », contre ~8 px entre les accordéons du Conseil voisin. C'est la hauteur étirée qui s'est logée entre les accordéons. Correction : écart fixe de 8 px partout, surplus de hauteur absorbé au-dessus du pied de carte.

## Acquis confirmés
Titre de la vidéo sur 2 lignes à 1024 (miniature réduite), même hauteur et pieds alignés dans la rangée, chute en gras au moins aussi présente que l'amorce sur PC, rien de coupé à 320 ni à 375.

## Handoff
Notes : clarté 10, chute 9, hiérarchie 10, cohérence 10, espacements 9, mobile 10, finition 9, globale 9/10 : régression depuis la v4-1.
À corriger : revenir aux bordures de la v4-1 (bouton et encadré de la chute, ~2 px violet vif), rétablir le fondu du Conseil replié, accordéons de la Vidéo à 1024 espacés de 8 px.
