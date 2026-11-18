# Relecture design à l'aveugle, encarts Premium s26, tour 3 (Favoris, Carnet, Aujourd'hui)

Périmètre : carte d'offre du haut et carte de fin « La suite est dans Premium », et leur relation immédiate (air, grille). Étalon : carte d'offre de l'accueil. Captures lues : visiteur 375, 768, 1280, 1920 (Aujourd'hui 1920, Carnet 768, Favoris 375/1280), gratuit Favoris 768, tour 2 Bibliothèque 1280.

## Gate typographique (TAILLES.md, premier écran, cité)
- Favoris visiteur/gratuit : 4 tailles (30 ou 24, 20, 16, 14), 6 combinaisons, à 375, 768, 1280, 1920. PASS (limite 4 / 6).
- Carnet visiteur/gratuit : 4 tailles, 5 combinaisons à 375, 6 à 768/1280/1920. PASS.
- Aujourd'hui visiteur/gratuit : 4 tailles, 6 combinaisons partout. PASS.
- Les encarts n'ajoutent aucune combinaison : bouton 16/600, réassurance 14/400, titre 20/600, « Connexion » 14/400. Un seul aplat violet par écran à 900 px : le bouton du haut (la carte de fin démarre à y 910 Favoris, 987 Carnet, 934 Aujourd'hui, donc sous le pli). PASS.

## Constat visuel
- Matière : bord 2 px violet, fond carte, ombre et halo discrets, `rounded-2xl`. Les deux encarts sont désormais le même objet, et proches de la carte de l'accueil (même bord, même bouton, réassurance sous le bouton). La carte ressort enfin des tuiles grises. Écart restant avec l'accueil : l'accueil a un titre et une phrase au-dessus du bouton, ici le bouton ouvre la carte (voulu par la spec, non noté).
- Carte du haut, 1280/1920 : colonne 4/12 alignée au bord droit de la grille (x 1248 à 1280, 1568 à 1920), haut aligné sur le badge (y 154), bas à 376 contre « 1 500+ » à 366 : alignement correct. Padding 24 sur les quatre côtés (bouton à 25 du bord haut et à 24 des côtés).
- 375 : carte pleine largeur 343 px, padding 16, bouton, réassurance, filet, Connexion : rythme propre, aucun débordement.
- 768 Carnet : carte pleine largeur en deux zones (bouton à gauche, réassurance et Connexion à droite), centrée verticalement : propre.
- Carte de fin : 448 px, padding 24, bouton plein largeur, réassurance 2 lignes, bas à 35 px : finition irréprochable, identique dans les 3 rubriques et dans Bibliothèque (tour 2).

## Défauts mesurés
1. Air tuiles -> carte de fin incohérent entre rubriques à 1280 : Carnet 26 px (carte presque collée au gratin, 961 -> 987), Aujourd'hui 54 px (fondu à 880, carte à 934), Bibliothèque 54 px, Favoris 102 px (fondu à 808, carte à 910). Écart de 76 px entre extrêmes pour un même composant ; sur Favoris la carte flotte, sur Carnet elle colle. À 375 et 768 Favoris : environ 51 px, donc la dérive est propre au 1280.
2. Vide interne de la carte du haut : 34 à 40 px entre réassurance et filet (Favoris 273 -> 312, Carnet 273 -> 307), pour un padding de 24. Le vide est dessiné (Connexion accrochée en pied) mais se lit comme une bande creuse ; la hauteur de carte varie entre rubriques (222, 218, 232 px) parce qu'elle s'étire sur la colonne.
3. Favoris gratuit 768 : la carte à deux zones place la réassurance flottante à y 457-497 alors que bouton et phrase d'objet sont à y 423-523 : le bloc droit n'est aligné ni sur le haut du bouton ni sur la dernière ligne de la phrase de gauche.

## Notes par critère (grille Design, encarts seulement)
1. Élégance et fidélité à l'accueil : 9. Même objet que l'accueil ; manque 10 : défaut 2 (bande vide) et ombre/halo identiques à l'accueil mais bord un peu plus fin visuellement à 1920.
2. Hiérarchie (une zone dominante, un seul accent) : 9. Bouton du haut dominant, carte de fin sous le pli ; aucun second aplat.
3. Largeur aux 5 largeurs : 9. Carte du haut sur la grille 8/4 ou pleine largeur sans débordement ; carte de fin 448 px sans vide mort ; défaut 3 à 768.
4. Cohérence entre comptes/rubriques : 8. Défaut 1 (26 / 54 / 102 px). Visiteur et gratuit identiques hors phrase d'objet.
5. Finition au pixel : 9. Paddings, contrastes (bord 3,9:1, texte 7:1 mesurés par la spec), cibles `min-h-11` ; défaut 3.

## Ce qui ferait 10
- Défaut 1 : fixer la distance carte de fin / dernière tuile visible à 48 px dans les 3 rubriques. Le fondu (`extrait-coupe.tsx`) doit finir à la même cote de la carte : régler la marge négative `lg:-mt-10` de `data-apercu-fin` par rubrique, ou faire dépendre la marge de la hauteur réelle de la dernière tuile.
- Défaut 2 : retirer le `mt-auto pt-4 md:pt-6` de la zone Connexion quand la hauteur étirée dépasse la réassurance de plus de 24 px, et ne pas étirer la carte (`etiree` sans `lg:h-full`) : la carte se termine sur son dernier élément, comme à l'accueil.
- Défaut 3 : dans `offre-apercu.tsx`, passer le bloc droit à `md:self-start` ou aligner les deux colonnes sur `items-start`.

NOTE GLOBALE : 8/10

Fautes dures chiffrables :
1. Air entre la dernière tuile et la carte de fin : 26 px (Carnet), 54 px (Aujourd'hui, Bibliothèque), 102 px (Favoris) à 1280 ; spec 24 puis 48 px, incohérence de 76 px. Fichier : `extrait-coupe.tsx` (bloc `data-apercu-fin`, classes `lg:-mt-10` et fondu).
