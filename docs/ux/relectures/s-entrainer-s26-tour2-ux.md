# Relecture UX à l'aveugle : S'entraîner (s26, tour 2)

Périmètre : `/mon-espace/s-entrainer`, 4 comptes. Ouvert : 375, 1280 et 1920 pour visiteur, en-cours, nouvel ; 1280 pour gratuit (identique au visiteur, hors phrase d'offre). Les cibles 44 px et le focus ne sont pas vérifiés au code (pas de lecture du source dans cette relecture) : ils restent à confirmer par @fullstack.

## Gate typographique (TAILLES.md, citée)
- Tous comptes, 375/768/1280/1920 : 4 tailles distinctes (24 ou 30, 20, 16, 14), 6 combinaisons (5 pour nouvel 375). Seuil : 4 tailles et 6 combinaisons. PASS, aucune taille hors échelle (30 à partir de 1280, 24 en dessous : même marche de `typo-harmonie`).
- Aplat violet : 1 chez visiteur et gratuit (bouton du hero) plus le bouton de fin d'extrait, sous le pli à 1280 et à 375 (permis par la spec). 0 chez en-cours et nouvel (choix soumis à Thomas, non noté).

## Prospect (visiteur, gratuit)
- 375 : titre, promesse, pastilles, preuve sociale, puis bouton d'offre dès y ~345 ; la tuile jeu s'ouvre à y ~620, consigne et 3 propositions A/B/C lisibles ; bloc « Ce qu'on aurait pu dire » fermé (verrou, barres). Bouton de fin sous le pli.
- 1280 et 1920 : hero 8/4, offre en haut à droite (y 178-226), tuile jeu 7 col et mission 5 col, rangée 2 coupée par le fondu. Se lit FERMÉ : verrous partout, marches 2 à 5 verrouillées, marche 1 seule ouverte. Une seule offre. À 1920 la grille est contenue (1216 px) sans vide mort.
- Vides : fin de la tuile Mission (~170 px sous la marche 5 à 1280/1920) = fin de carte, permis. Entre « 1 500+ » et « Voici un exemple » (~70 px) : entre deux blocs, pas dans un bloc.
- Promesse du hero : à sa place (sous le titre, avant les pastilles). Gratuit : même page, phrase d'offre en plus, cohérent.

## Abonné
- en-cours 1280 : carte du jour dépliée en haut à gauche (scène, contexte, « Ta réponse d'abord », Oui / À moitié / Rien), carte suivante repliée dessous, Mission 5 col à droite avec échelle des 5 marches (marche 1 « Fait » en vert avec coche, marche 2 surlignée), puis la marche en cours avec son retour. On sait quoi faire : lire, répondre, puis la mission. 375 : même ordre, marches en pastilles à la ligne (pas de défilement horizontal).
- en-cours : deux segments gris en haut (progression des cartes) sans aucun segment plein et sans chiffre ni libellé visible : on ne lit pas ce qu'ils mesurent.
- nouvel : pas de segments, une carte, échelle avec marche 1 surlignée, aucune « Fait ». Pas de page morte : action et mission visibles dès le premier écran à 1280 (carte y 277-885) ; à 375 la carte occupe le premier écran, la mission est dessous.
- Pas de série ni de compteur de jours : aucune donnée à afficher n'est inventée ici, donc pas de faute.
- Pastille « 10 secondes pour répondre » : même forme que les boutons Oui / À moitié / Rien alors qu'elle n'agit pas (piste).
- Petit repère « Marche 2 » + 5 barres : ~24 px de large, un seul niveau grisé de différence, quasi illisible à 1280 et 1920 ; double l'échelle.

## Notes par critère (UX)
| # | Critère | Note | Pourquoi / ce qui ferait 10 |
|---|---|---|---|
| 1 | Prospect : envie en 3 secondes | 9 | Fermé lisible, offre en haut, une offre, jeu A/B/C visible. 10 : rien de bloquant, seul le bas de la Mission reste creux (permis). |
| 2 | Abonné : clarté | 9 | Carte dépliée en tête, mission à côté. Les deux segments muets et la pastille « 10 secondes » ressemblant à un bouton nuisent. 10 : donner un état lisible aux segments (voir piste 1) et distinguer la pastille d'un bouton. |
| 3 | Abonné : envie de continuer | 8 | Progression visible surtout par la coche « Fait » ; les segments en-cours sont entièrement gris, le repère à 5 barres est illisible. 10 : segments avec état plein/vide lisible et compteur de chiffres seuls. |
| 4 | Nouvel abonné | 9 | Jamais une page morte. 10 : à 375 le premier écran est uniquement la carte, la mission est à scroller (acceptable, spec : carte d'abord). |
| 5 | Accessibilité visible, cohérence | 9 | Mêmes composants entre comptes, grisés lisibles, verrous cohérents. Cibles 44 px et focus non vérifiés au code. |

## Fautes dures
Aucune chiffrable : gate typo PASS, 0 vide > 32 px au milieu d'un bloc, 0 débordement vu aux 3 largeurs, 0 second aplat violet.

## Pistes (max 3)
1. Segments de progression (carte du jour, abonné en-cours) : variante pleine (`bg-primary`, hors aplat de bouton : à arbitrer avec Thomas) ou `bg-foreground/60` pour les faits, plus compteur « 0 / 2 » en `META` (chiffres seuls, même forme que le `(n)` des listes). Pas d'ajout de taille.
2. Retirer ou agrandir le repère « Marche n » à 5 barres : doublon de l'échelle, illisible ; garder uniquement l'échelle (fichier du composant mission du dossier `components/espace`).
3. Pastille « 10 secondes pour répondre » : retirer son contour (texte `META` seul) ou lui donner une apparence non cliquable pour qu'elle ne se confonde pas avec Oui / À moitié / Rien.

NOTE GLOBALE : 8/10

Fautes dures :
(aucune)
