# Relecture design à l'aveugle, section 1 : en-tête et menu mobile (s25, tour 2)

Étalon : accueil du site (`docs/captures/s25/etalon-accueil/`). Captures lues : `docs/captures/s25/entete-tour-2/` (menus mon-espace et situation 320/375/600/768 ; gratuit-menu-accueil 375 ; visiteur-menu-accueil 320 ; mon-espace 1280/1920 ; cloche 320/375/768/1280/1456 ; cloche-vide 375/1280 ; compte 768/1280/1920 ; accueil 320 ; vannes 600 ; accueil 1456/1920 ; focus en-cours 01/03/05, 02-1280, gratuit-06-1280, visiteur-04-768). Code lu : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `cloche.tsx`, `cloche-lignes.tsx`. Spec v5 respectée, aucun libellé touché.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 9 |
| 2 | Cohérence comptes et pages | 9 |
| 3 | Hiérarchie et lisibilité | 9 |
| 4 | Menu mobile | 8 |
| 5 | Panneaux cloche et compte | 8 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 8 |

## Ce qui est juste (vu)

- À 1456 et 1920, l'en-tête est celui de l'accueil, pixel pour pixel : logo dégradé, liens `text-sm`, recherche, bouton Premium, même coque `max-w-7xl` que les cartes dessous. Le premier lien est au même x pour les trois comptes (596 à 1920). Rien ne flotte ni ne se colle à gauche avec un vide : c'est la coque du site.
- Menu mobile abonné à 375 et 320 : recherche, « Mon espace » allumé, 8 rubriques sur un rail, séparateur, 5 liens du site visibles sans défilement (capture 812 px de haut, Parcours à Articles). Les rubriques sont à 2 touchers. De 768 à 1023 : intitulé non cliquable blanc, aucun doublon avec la barre. Ligne allumée : filet violet de 2 px + fond + semi-gras, lisible sans la teinte.
- Panneaux cloche et compte : `rounded-xl`, filet dégradé en haut, bord droit sur la marge de la coque (x=1248 à 1280, 1568 à 1920, 1336 à 1456), 8 px sous le filet de l'en-tête, titre « Notifications » en `font-display`, comme les titres de cartes de l'accueil. Chevrons identiques à « Dans ton espace ». État vide dit sa phrase sur une ligne, sans icône bancale.
- Bouton Menu ouvert : croix, bouton Premium retiré du flux sous 1024 (plus de vide).

## Défauts et corrections (note < 10)

### Critère 1, 9/10
- Défaut (faute dure : non). Le panneau du compte (`en-cours-compte-768`, `gratuit-compte-1280`) a des lignes en `text-text-secondary` (gris) alors que les lignes de « Dans ton espace » et de la cloche sont en `text-text-primary` (blanc). Même famille de carte, deux gris.
- Correction : `account-menu.tsx`, constante `ITEM` : `text-text-secondary` devient `text-text-primary` (garder `data-[highlighted]:bg-background-elevated`).
- Pour 10 : un seul niveau de texte dans toutes les listes à chevron ou à pictogramme de l'espace.

### Critère 2, 9/10
- Défaut (piste). La recherche change de x selon le compte à 1280 : abonné 944, gratuit 814, visiteur 858 à 1456 (conséquence de l'ancrage à droite des actions, qui n'ont pas la même largeur). Les liens ne bougent pas, la recherche si.
- Correction codable (si Thomas veut zéro mouvement) : `en-tete-universel.tsx`, remplacer `xl:ml-auto` de la `SearchBar` par une largeur fixe de zone d'actions, ou ancrer la recherche à gauche des actions avec `xl:ml-auto` sur le conteneur et `min-w` identique. Sinon laisser : c'est le même comportement que sur le site actuel.
- Pour 10 : recherche au même x pour les trois comptes à 1280, ou décision écrite que l'écart est voulu.

### Critère 3, 9/10
- Défaut (piste). Dans le menu mobile, les liens du site ont un pas de 52 px (Parcours 560, Vannes 612, Conseils 664 à 375) alors que les rubriques de l'espace ont 44 px (`py-3` + `gap-2` du conteneur). Deux rythmes dans la même colonne : la section « site » paraît plus aérée que la section « espace », qui devrait dominer pour l'abonné.
- Correction : `menu-mobile-universel.tsx`, conteneur `flex flex-col gap-2` : passer à `gap-0` pour les liens (`<div className="contents">` ne porte pas de gap, donc retirer `gap-2` du parent et garder `my-2` aux `<hr>` et `mt-2` avant les boutons), liens en `h-11 flex items-center` au lieu de `py-3`.
- Pour 10 : un seul pas de 44 px dans toute la colonne, séparateurs seuls porteurs d'air.

### Critère 4, 8/10
- Défaut 1 (faute dure, alignement) : `visiteur-menu-accueil-320.png`, « Connexion » est centré dans sa ligne alors que tous les liens au-dessus et les actions du compte (Mon profil, Déconnexion) sont alignés à gauche à x=28. Code : `menu-mobile-universel.tsx`, lien Connexion `buttonVariants ghost ... h-11 w-full min-[520px]:hidden` sans `justify-start`.
- Correction : ajouter `justify-start pl-[10px] border-l-2 border-transparent` (classes `secondaire(false)` déjà définies) : `className={cn(secondaire(false), "min-[520px]:hidden")}`.
- Défaut 2 (faute dure, poids) : `gratuit-menu-accueil-375.png` et `en-cours-menu-situation-600.png`, « Favoris », « Mon profil », « Déconnexion » sont visiblement plus gras que Parcours, Vannes (liens en `font-medium`, boutons ghost en semi-gras). La zone d'actions paraît plus importante que la navigation.
- Correction : dans `secondaire()`, le bouton Déconnexion et Connexion, ajouter `font-medium text-text-secondary hover:text-text-primary` pour s'accorder aux liens.
- Défaut 3 (piste) : le bouton Premium plein est collé au premier lien d'action (8 px), sans respiration, alors que les liens au-dessus ont 52 px de pas. Correction : `mt-2` sur le bloc `data-actions-compte` quand `plein`.
- Pour 10 : même poids et même alignement pour toutes les lignes, un seul pas vertical.

### Critère 5, 8/10
- Défaut 1 (faute dure, alignement) : `en-cours-cloche-1280.png`, `nouvel-cloche-1456.png`. Le titre de groupe (« L'équipe t'a répondu », x=945) est 12 px à gauche du texte des lignes (« Une question », x=957), parce que `LIGNE` a `px-3` et le `h3` aucun retrait. Même chose à 375 (33 contre 45).
- Correction : `cloche-lignes.tsx`, `h3` : ajouter `px-3`.
- Défaut 2 (faute dure, lisibilité) : le panneau a le même fond que les cartes de la page (`bg-background-card`) et le même filet. Sur `en-cours-cloche-375.png` son bord bas (y=322) touche le titre « Si tu as 5 minutes » (y=332) et sur `nouvel-cloche-vide-375.png` le panneau (bas 206) et la carte dessous (haut 205) se fondent en un seul bloc. À 1280 (`en-cours-cloche-1280`), il recouvre « Dans ton espace » avec le même gris. On ne distingue le panneau que par le filet violet.
- Correction : `cloche.tsx` et `account-menu.tsx` (variante universelle) : `shadow-xl` devient `shadow-2xl shadow-black/60 ring-1 ring-white/10`, et fond `bg-background-elevated` pour le panneau (un cran au-dessus des cartes). Sans voile (décision de tour 1 conservée).
- Défaut 3 (piste) : état vide, `py-3` seul après le titre : 28 px de vide sous la phrase contre 12 px au-dessus. Correction : `cloche-lignes.tsx`, les deux `<p ... py-3>` en `pb-1 pt-0`.
- Pour 10 : titres et lignes sur la même verticale, panneau lisible comme une couche distincte, un seul gris dans le compte et la cloche.

### Critère 6, 10/10
Rien à reprocher à 1456 et 1920 : en-tête, panneaux et contenu partagent les mêmes marges de coque, aucune largeur ne s'étire, pas de vide à droite non voulu.

### Critère 7, 8/10
- Défaut 1 (faute dure, focus) : `en-cours-focus-01-375.png`. Le logo n'a aucune classe de focus : le navigateur dessine un contour blanc carré, collé au texte (x=15 à 168), sans rapport avec l'anneau violet arrondi des autres éléments (`en-cours-focus-03-375`, `focus-02-1280`). Visible, mais de deux langues différentes.
- Correction : `en-tete-universel.tsx`, `<Link>` du logo : ajouter `rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- Défaut 2 (piste) : `visiteur-focus-04-768.png`, sur le bouton Premium (violet) l'anneau `ring-accent-primary` a la même couleur que le fond du bouton : on ne le lit que par le contour clair qui déborde. Correction : `ring-offset-2 ring-offset-background` sur ce lien (ou `focus-visible:ring-accent-link`).
- Contrastes AA, cibles 44 px (boutons h-11, lignes h-11, `min-h-11`), aucune troncature ni débordement vu de 320 à 1920 : conformes.
- Pour 10 : un seul anneau de focus, lisible sur le bouton plein comme sur le fond.

## Ce qui ferait 10 partout
Les 6 fautes dures ci-dessus (Connexion centré, poids des actions, titre de groupe cloche, panneau qui se fond dans les cartes, logo sans focus, gris du menu compte) puis les 4 pistes (pas de 52 px, respiration avant les actions, état vide, anneau Premium).

NOTE GLOBALE : 8/10
