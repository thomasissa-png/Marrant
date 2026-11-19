# Relecture design à l'aveugle v3 : Quoi répondre + Parcours (s26)

Base : captures `qr-*` et `pa-*` (375 et 1280, 4 comptes) et pleines pages, lues une à une. Échelle `typo.ts` respectée à l'œil (14/16/20/24-30, 2 graisses). Un seul bouton violet plein par écran : OK partout (cloche = pastille). Le halo de focus violet double (carte + bouton) de `qr-visiteur/gratuit-*-2` est un second accent, léger.

## Notes par page
| Page | Note |
|---|---|
| Quoi répondre, aperçu (visiteur, gratuit) | 7 |
| Quoi répondre, abonné (en cours, nouvel) | 8,5 |
| Parcours, liste (4 comptes) | 7 |
| Parcours, détail (4 comptes) | 7,5 |

## Notes par trajet
- qr-visiteur : 375 = 8, 1280 = 7 ; qr-gratuit : 375 = 8, 1280 = 7
- qr-abonne-en-cours : 375 = 8,5, 1280 = 8,5 ; qr-nouvel-abonne : 375 = 8,5, 1280 = 8,5
- pa-visiteur : 375 = 7,5, 1280 = 7 ; pa-gratuit : 375 = 7,5, 1280 = 7
- pa-abonne-en-cours : 375 = 8, 1280 = 7,5 ; pa-nouvel-abonne : 375 = 8, 1280 = 7,5

## Défauts (< 9) et correction minimale

### Quoi répondre, aperçu (7)
1. Vides visibles à 1280 (`qr-visiteur-1280-1`, `-pleine`) : colonne droite vide sous « Où et avec qui ? » (x 875-1248, y 735-900) et à droite de « Pour quoi faire ? » (x 920-1248, y 793-898). Correction : mettre « Pour quoi faire ? » dans la colonne droite sous « Où et avec qui ? » (pile verticale), ou le passer pleine largeur.
2. Bord droit de « Pour quoi faire ? » à x 920, aligné sur rien (cartes à 827 et 875). Correction : même grille que la carte vedette (fin à 827) ou pleine largeur 1248.
3. Hiérarchie inversée : titres des tuiles fermées (« Rattraper un faux pas 10 », ~24 px) plus gros que le titre de la carte vedette « Coloc : la poêle » (20 px). Correction : tuiles en `TITRE_CARTE`, ou vedette en `TITRE_PAGE`.
4. Hero 1280 : intervalle titre → sous-titre (~60 px) plus grand que sous-titre → puces (~36 px). Correction : un seul `gap` entre les trois.
5. `*-2` : double contour violet (carte + bouton) au focus après défilement. Correction : un seul anneau, sur le bouton.

### Quoi répondre, abonné (8,5)
1. Liste latérale 1280 : dernière ligne (« Tu pars déjà ? ») coupée par la zone de défilement, sans indice (y 821-839). Correction : ombre de fin de zone ou `max-h` calé sur un nombre entier de lignes.
2. « Situation suivante » change de style : contour avant « Fait », violet plein après (`qr-abonne-1280-3` vs pleine). Un saut visible d'un état à l'autre. Correction : réserver le violet à l'état « Fait », et garder la même taille et la même place.
3. 375 : « À toi » + pastille « Fait » collés au paragraphe (8 px, `qr-abonne-375-3`), contre 30 px sous « La scène ». Correction : même `mb` que « La scène ».
4. Progression : barres à 375 (hub), compteurs seuls à 1280. Correction : mini-barre sous les en-têtes « Coloc 1/4 » en 1280.

### Parcours, liste (7)
1. Alignement entre cartes : la colonne d'italique commence à x 699 (Machine à Café), 769 (Répartie), 719 (Confiance), alors que le bouton est à 652 (`pa-*-1280-1`, `-4`, `nouvel-1280-5`). Correction : grille `grid-cols-2` à largeurs fixes, identique dans les 5 cartes (pas `auto`).
2. Vide à 1280 : à droite de l'intro (x 700-1248, y 150-290), ligne pleine de vide. Correction : intro en `max-w` avec le quiz « Quel parcours est fait pour toi ? » à droite, ou intro étalée sur 2 colonnes.
3. 375 visiteur et gratuit : bouton « Tester l'étape 1 » en double (avant la 1re carte et dans la carte), sur 2 lignes. Correction : supprimer le bouton de tête.
4. Abonné 1280 : bannière « Nouveau cap : Tu te lances. » répétée par « Tu te lances · cap 2 sur 5 » dans la carte juste dessous (`pa-abonne-1280-1`). Correction : retirer l'une des deux.
5. 375 abonné et nouvel : phrase « Envie d'un rappel par e-mail… » avec interligne ~32 px contre 24 ailleurs (`pa-abonne-375-3`). Correction : `leading-6`.
6. « Étape 3 sur 3 » avec 3e barre en contour (en cours) : ambigu. Correction : libellé « Étape 3 sur 3, en cours ».

### Parcours, détail (7,5)
1. Vide mort visiteur/gratuit (`pa-visiteur-1280-2`, `-3`) : sous le menu des étapes (y 407-900), colonne gauche vide. Correction : menu `sticky` + bloc d'offre court dessous (sans second bouton plein), ou le menu seul mais l'offre en tête de colonne.
2. Numérotation à trous : 2.1, 2.3, 2.4 ; 3.1, 3.3, 3.4, 3.5 (`pa-abonne-1280-3`, `nouvel-1280-3`). Correction : numéroter par position affichée.
3. Sous-étape active : gras + souligné, ligne qui passe sur 2 lignes, donc menu +12 px et « Reprendre » descend de 696 à 708 (`abonne-1280-3` → `-4`). Correction : graisse constante (600 partout) et souligné réservé au survol.
4. Encart « Pourquoi cette étape ? » : dernière ligne orpheline (« la préparation. ») à `max-w` plus étroit que l'encart. Correction : `text-wrap: pretty` et même largeur.
5. 375 : option de quiz C en bordure violette (`pa-visiteur-375-3`), second accent. Correction : bordure neutre tant que non choisie.

## Verdict
Aucune page n'atteint 9. Priorités : grille des cartes Parcours (1), vides du Quoi répondre aperçu (1-2) et du menu visiteur, numérotation.
