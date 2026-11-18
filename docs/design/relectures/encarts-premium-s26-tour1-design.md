# Relecture DESIGN à l'aveugle : encarts Premium (carte d'offre + fin d'extrait), s26 tour 1

Captures lues : visiteur Aujourd'hui 375 / 1280 / 1920, gratuit Bibliothèque 1280, visiteur Quoi répondre 768, gratuit S'entraîner 1280, étalon accueil 1280 (page entière). Les autres combinaisons suivent le même gabarit (TAILLES.md identiques par rubrique).

## Gate typographique (TAILLES.md, citée)
Visiteur et gratuit, 375/768/1280/1920, les 4 rubriques : `TAILLES DISTINCTES : 4` (24 ou 30 / 20 / 16 / 14), `COMBINAISONS : 6`. Au plafond, jamais au-dessus : PASS. Le titre « La suite est dans Premium » est bien du 20/600 de l'échelle, le bouton 16/600, la réassurance 14/400. Aucune taille ajoutée par les encarts.

## Réponse à la question centrale
Oui pour la matière : les deux encarts portent maintenant le bord violet 2 px, le fond carte et l'ombre violette de l'accueil, et se lisent comme un seul objet à deux endroits. Ils sont à 90 % du niveau de l'accueil. Ce qui manque : la carte du haut est étroite et haute à 768 (vide à gauche), la carte de fin n'est pas rattachée à l'extrait sur les pages 8/4, et l'accueil respire plus (carte large, centrée, padding généreux).

## Notes par critère (Design)
1. Élégance / fidélité à l'accueil : 8. Matière identique (bord, ombre, halo à peine perceptible dans le coin, donc discret : correct). Mais la carte (a) est une carte utilitaire (bouton, garantie, lien) là où l'accueil a un titre, une phrase et une carte large.
2. Hiérarchie : 9. Au premier écran, bouton plein de (a) dominant, puis le titre de l'extrait ; en plissant les yeux : carte violette, titre, tuiles. (b) : phrase, bouton, garantie, ordre net.
3. Usage de la largeur : 8. Voir fautes 2 et 3 et pistes.
4. Cohérence entre comptes et entre (a) et (b) : 9. Visiteur (avec Connexion en pied) et gratuit (sans) tiennent le même gabarit ; (a) et (b) partagent matière, rayon, bouton, réassurance.
5. Finition : 8. Paddings 24 à 1280 (bouton à 26 px du bord haut de (a), Connexion à 47 px du bas), bas de (a) à 8 px du bas de la colonne de texte à 1280 : conforme. Bords 3,9:1 conformes. (b) : 24 px en haut, 35 px sous la réassurance : léger déséquilibre (11 px).

## Fautes dures chiffrables
1. **Deux boutons pleins violets dans un même viewport à 1920 x 1080 sur Aujourd'hui** : `visiteur-aujourdhui-1920.png`, bouton de (a) à y 179-227, bouton de (b) à y 1012-1060 (< 1080) ; carte (b) y 943-1141. Règle « un seul aplat violet par écran ». Le gate à 900 px de haut ne le voit pas. Fichier : `extrait-coupe.tsx` (bloc `data-apercu-fin`) : sur écran haut, passer (b) sans bouton plein (bouton `outline`) ou garantir que l'extrait de la rubrique Aujourd'hui dépasse 1080 px.
2. **Carte (b) non centrée sur l'axe de l'extrait sur les pages 8/4** : Bibliothèque, Quoi répondre, S'entraîner à 1280, extrait x 32-827 (axe 430), carte (b) x 417-863 (axe 640) : écart 210 px, spec « ±1 px, centrée sous les 8 colonnes ». Fichier : `extrait-coupe.tsx`, le bloc `data-apercu-fin` doit être dans la colonne 8/12 (`lg:col-span-8`) ou recevoir `lg:mr-auto lg:ml-[calc(...)]`, sinon décider que l'axe de la page prime et corriger la spec.
3. **Carte (a) à 768 : colonne étroite et vide mort à gauche** : `visiteur-quoi-repondre-768.png`, carte x 475-743 (268 px de large, réassurance sur 3 lignes), haute de 348 px (y 153-500) contre les pastilles qui s'arrêtent à y 378 : 122 px de vide sous les pastilles, à côté d'une carte tassée. Fichier : le hero de page (grille `md:grid-cols-...`) : à 768, carte pleine largeur sous le titre (comme à 375) ou colonne 5/12 minimum.

## Ce qui ferait 10 (pistes)
- Distance entre la dernière tuile et (b) : mesurée 50-52 px (Aujourd'hui 893 vers 943, Bibliothèque 1025 vers 1077, S'entraîner 1115 vers 1167) contre 24 px dans la spec : la carte ne chevauche pas le fondu, elle flotte plus bas ; revoir `-mt-*` dans `extrait-coupe.tsx` pour qu'elle « sorte » du fondu.
- (b) : padding bas 35 px contre 24 en haut ; aligner (`pb-4 md:pb-6` effectif, ou retirer la marge basse de la réassurance).
- Bibliothèque et S'entraîner à 1280 : fin de colonne droite à y 840 / 968 contre 1025 / 1110 à gauche (185 et 142 px de vide sous la colonne 4/12) ; (b) centrée page comble partiellement, mais mieux : (b) dans la colonne gauche et colonne droite qui s'étire.
- Halo de (a) invisible en pratique (coin supérieur droit rogné) : déplacer à `-right-8 -top-8` ou l'assumer et le retirer.

NOTE GLOBALE : 8/10

Fautes dures :
1. Deux boutons pleins violets visibles à 1920 x 1080 (Aujourd'hui) : `extrait-coupe.tsx`.
2. Carte de fin décentrée de 210 px par rapport à l'extrait 8/12 (Bibliothèque, Quoi répondre, S'entraîner, 1280) : `extrait-coupe.tsx`.
3. Carte d'offre à 768 : 268 px de large + 122 px de vide mort sous les pastilles : hero de page / `offre-apercu.tsx`.
