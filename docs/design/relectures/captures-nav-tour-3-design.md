# Relecture visuelle à l'aveugle, captures nav s24, tour 3 (design, ciblé)

Vu à l'image dans `s24-nav-universelle-3/` : abonné 1280 (Aujourd'hui, Favoris, Parcours, fiche humour noir), nouvel abonné 1280 (Lettres), accueil gratuit 1280, abonné 375 (Aujourd'hui, menu mobile). L'INDEX n'a servi qu'à localiser les fichiers.

## Note : 9 / 10, 0 faute dure

## Mes 5 fautes du tour 2, vérifiées à l'image
1. Hauteur du H1 : CORRIGÉE. « Aujourd'hui », « Mes favoris », « Lettres », « Humour noir, fait bien » et « Parcours » ont leur titre sur la même ligne (centre ~154 px à 1280). Plus de saut entre pages.
2. Largeurs : CORRIGÉE. Lettres : retour, titre et carte alignés sur la même colonne de 768 px (x=256) ; plus de titre à gauche et carte centrée. Favoris et Aujourd'hui en pleine coque à x=32 : deux gabarits lisibles et constants.
3. États vides : CORRIGÉE. Lettres et Humour noir : titre, carte courte avec bouton, pied de page qui suit la carte (plus de 500 px de noir, plus de bande noire sous le pied). Humour noir a son H1.
4. Parcours de l'abonné : CORRIGÉE. H1 « Parcours » visible, au même niveau que les autres pages, carte « Tes 4 premières semaines » en dessous.
5. Carte « Vanne du jour » de l'accueil : CORRIGÉE. Plus de trou de 180 px ; la carte s'arrête à son contenu (bouton et réactions juste dessous).

## Menu mobile abonné 375 : bon
Tout tient sans défilement : bloc « Mon espace » indenté (8 entrées), les 5 liens du site sur deux colonnes, « Mon profil » et « Déconnexion » à la suite. États actifs nets (fond + violet), cibles de 44 px, rythme régulier.

## Aujourd'hui 375 et 1280 : propre
375 : ordre carte du jour, mission, index, contenu du jour ; marges constantes de 16 px, aucun libellé coupé. 1280 : carte du jour et index côte à côte, mission sous la carte, trois cartes de contenu avec extrait et vignette de la vidéo, aucun vide disgracieux.

## Pistes (ne bloquent pas le 10 à l'œil, à faire si le temps le permet)
- Bas des cartes inégal : accueil gratuit (carte Vanne ~130 px plus courte que ses deux voisines) et Aujourd'hui (1 143 / 1 060 / 1 160 px). `lg:items-stretch` sur la grille donnerait une ligne nette, avec `mt-auto` sur les actions pour ne pas recréer du vide.
- Aujourd'hui : l'index « Dans ton espace » finit à 690 px, la mission à 745 px, ligne de fin de bloc non alignée. `lg:items-stretch` sur le bloc 2 colonnes.
- Pages sans « Retour » : ~76 px d'air entre l'en-tête et le titre (Aujourd'hui, Favoris), un peu généreux mais constant ; non gênant.
- Favoris : la 3e carte est plus courte que ses voisines (alignement en haut, correct).
- Menu mobile : 33 px de noir sous le dernier filet à 375 x 812 ; sans conséquence.
