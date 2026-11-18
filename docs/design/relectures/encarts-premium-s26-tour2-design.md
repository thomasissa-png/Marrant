# Relecture DESIGN à l'aveugle, encarts Premium (carte d'offre du haut + carte de fin), tour 2, s26

Captures lues : `docs/captures/s26/encarts-favoris-carnet-tour-2/` : aujourdhui (visiteur 375/768/1280/1920), carnet (visiteur 375/1280, gratuit 1280), favoris (visiteur 1280), quoi-repondre (visiteur 1280), bibliotheque (visiteur 1280), s-entrainer (visiteur 1280). Étalon : `visiteur-accueil-1280.png` (s25). Grille : brief v7, volet Design, barre 9/10.

## Gate typographique (TAILLES.md, citée)
- aujourdhui, visiteur et gratuit, 375/768 : `TAILLES DISTINCTES : 4 24px, 20px, 16px, 14px | COMBINAISONS : 6` ; 1280/1920 : `4 30px, 20px, 16px, 14px | COMBINAISONS : 6`.
- quoi-repondre, visiteur/gratuit, 375 à 1920 : 4 tailles, 6 combinaisons. bibliotheque, visiteur/gratuit : 4 tailles, 6 combinaisons.
- Comptes avancés (en-cours, nouvel) : 4 tailles, 4 à 6 combinaisons.
- Verdict : plafond 4 / 6 respecté partout, zéro faute automatique. Les encarts n'ajoutent aucune combinaison (bouton 16/600, réassurance 14/400, titre de fin 20/600).

## Ce que je vois
**Carte d'offre du haut (a).** Bord violet 2 px, rayon 16 px, fond carte, halo violet doux en coin, ombre violette légère : c'est la matière de la carte de l'accueil, transposée. Elle est lisible comme « la carte Premium » au premier regard sur les 6 pages, aux 3 largeurs. Ordre bouton, réassurance, filet, Connexion. Le bouton est le seul aplat. 1280 : colonne 4/12, carte de 372 x 231 px, alignée sur le haut du titre (y 154), bas à 385, soit 10 px sous la dernière ligne de la colonne de texte (« 1 500+ », y ~375) : bon. 768 : carte pleine largeur, bouton à gauche et réassurance + Connexion à droite, équilibre propre. 375 : carte 343 px, bouton à y ~340 dans les 812 px du premier écran.
**Carte de fin (b).** Même matière, 448 px, centrée, bouton pleine largeur de la carte, réassurance dessous. Elle se lit comme « la même chose, plus bas » : le pont voulu est fait. Sur les 6 pages elle est identique (seul le Carnet a son titre sur deux lignes et sa phrase, textes hors périmètre).
**Cohérence comptes.** Gratuit : même carte, sans Connexion ni filet, deux paragraphes de réassurance espacés de 20 px, padding bas 27 px : équilibrée. Visiteur et gratuit partagent la même matière.

## Notes par critère (Design)
1. **Élégance et fidélité à l'accueil : 9/10.** Matière, rayon, bord, halo et bouton sont ceux de l'accueil. Écart au 10 : le pied de la carte (a) visiteur (voir piste 1).
2. **Hiérarchie : 9/10.** Un seul aplat par écran à 900 px (le bouton). La carte (a) domine le haut à droite, la carte (b) est sous le pli à 900 px sur Aujourd'hui, Carnet, Quoi répondre, Bibliothèque. Sur Favoris 1280 le haut de la carte (b) (bord violet, y 870) entre dans les 900 px sur ~30 px : seul un trait de 2 px et le halo, pas un aplat, et le bouton reste sous le pli (y 940) : toléré par la règle, noté.
3. **Usage de la largeur : 8/10.** Les encarts utilisent bien la grille 8/4 et la colonne centrale. Le 8 vient des tuiles voisines, pas des encarts (fautes 1 et 2 ci-dessous).
4. **Cohérence entre comptes et pages : 10/10.** Même objet sur 6 pages, 2 comptes, 3 largeurs.
5. **Finition au pixel : 9/10.** Bord 2 px, contrastes (bord #8B5CF6, 3,9:1 sur la carte), cibles `min-h-11` conformes à la spec. Écart : asymétrie du pied de (a), piste 1.

## Fautes dures (chiffrables)
Aucune faute dure sur les encarts eux-mêmes : taille et combinaisons dans le plafond, un seul aplat, aucune combinaison nouvelle, aucun débordement, aucun vide > 32 px dans (a) ni (b).
Deux fautes dures **hors encart** (tuiles voisines des mêmes captures, règle « vide > 32 px au milieu d'un bloc ») :
1. Quoi répondre, visiteur 1280 : la grande tuile « Coloc : la poêle » a un vide mort de 143 px sous les trois réponses verrouillées (y 772 à 915), étirement `h-full` pour rejoindre la hauteur de la colonne de filtres. Fichiers : composition de la page Quoi répondre dans `apps/web/src/components/espace/apercu/` (étirement de tuile).
2. S'entraîner, visiteur 1280 : la grande tuile « Si tu as 5 minutes » a un vide de 55 px sous « Ce qu'on aurait pu dire » (y 922 à 977), même cause. Même dossier.
(Bibliothèque 1280 : colonne de droite finit à y 850, colonne de gauche à y 1030, soit 180 px de vide à droite : déséquilibre de colonnes, pas un vide interne, donc piste.)

## Pistes (non bloquantes)
1. **Pied de (a) visiteur** (`offre-apercu.tsx`) : le lien Connexion fait 44 px (`min-h-11`) mais son texte est centré, d'où ~38 px visibles sous le texte contre 24 px au-dessus du bouton (1280) et ~36 px contre 16 px (375). Corriger par `-mb-2` sur la zone Connexion (la cible reste de 44 px, débordant sur le padding) : le visuel passe à ~28 px. Ce serait le 10.
2. **Équilibrer les tuiles d'une même rangée** (Quoi répondre, S'entraîner) : `self-start` sur la grande tuile au lieu de `h-full`, ou placer « Où et avec qui ? » sous la tuile à la hauteur de sa colonne.
3. **Favoris 1280** : monter l'espace entre dernière tuile et carte (b) de 50 à 64 px (`lg:-mt-6`) pour que le bord ne pointe pas dans les 900 px.

NOTE GLOBALE : 8/10 (encarts seuls : 9/10, au niveau de l'accueil et cohérents ; la note est tirée vers le bas par deux vides de tuiles voisines, règle « vide > 32 px » du brief)

Fautes dures :
1. Quoi répondre 1280, vide de 143 px dans la tuile « Coloc : la poêle » (`apps/web/src/components/espace/apercu/`, étirement de tuile).
2. S'entraîner 1280, vide de 55 px dans la tuile « Si tu as 5 minutes » (même dossier).
