# Relecture visuelle à l'aveugle, captures nav s24, tour 1 (design)

Vu : 18 captures à 1280 (visiteur 3, abonné 15), 7 à 375 dont 2 menus, 3 à 768 dont le menu. Sombre. Palette projet : `bg-background(-card)`, `text-text-secondary/muted`, `border-border`, écrans `e300/e360/e400/sm/md/lg/xl`.

## Note globale : 6,5 / 10 (nav 9/10, pages 6/10)

L'en-tête tient sa promesse : 65 px, même logo, mêmes liens, même recherche, onglet actif souligné, identique sur toutes les pages 1280 (visiteur : Connexion + Premium ; abonné : cloche + profil). Menus mobiles propres (bloc Mon espace indenté, 44 px). Le problème est ailleurs : les pages en dessous ne sont pas du même monde (largeurs, retours, cartes vides).

## Notes par page (1280)
Accueil visiteur 7 · Vannes 8 · Parcours 7 · Aujourd'hui 6 · Quoi répondre 6 · Bibliothèque 3 · Mes questions 6 · S'entraîner 5 · Mes répliques 5 · Lettres 4 · Favoris 5 · Carnet 6 · Profil 6 · Fiche situation 8 · Fiche jeu 8 · Bilan 7 · Fiche humour noir 4 · Parcours/étape 7 · Menus mobiles 9.

## Fautes dures (bloquent le 10)

1. **Bibliothèque 1280 et 768** (`abonne-en-cours-mon-espace-bibliotheque-1280.png`) : la colonne gauche s'étire sur 1 500 px, le bloc « Humour noir » est collé au milieu, ~600 px de noir. Cartes à moitié vides, exactement le grief du fondateur. Corriger : grille `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 items-start`, colonne gauche `lg:sticky lg:top-20 flex flex-col gap-6` (les deux cartes empilées, hauteur propre).
2. **S'entraîner 1280** : 2 cartes en haut puis « Marche 3 » seule à gauche ; vide de 600 px à droite sous la carte « Boulot ». Corriger : `grid grid-cols-1 lg:grid-cols-2 gap-6 items-start`, carte Marche en `lg:col-span-2` (ou 3 colonnes égales avec `items-stretch`).
3. **Favoris 1280** : carte 3 en solo sur toute la largeur ; textes des vannes centrés verticalement (`justify-center`) alors que la carte conseil est calée en haut, donc 3 hauteurs de début différentes. À 375 la 1re carte a 24 px de marge haute, les autres 40 px. Corriger : cartes `flex flex-col justify-start p-6 gap-3`, grille `lg:grid-cols-3` ou 2 colonnes avec `items-start`, plus de `my-auto`.
4. **Mes répliques / Lettres / Fiche humour noir 1280** : une phrase dans une carte de 1 216 px (`lettres-1280.png`), page de 900 px, footer collé. « Pas fini ». Et une bande noire de ~27 px sous le pied de page (lettres, répliques, humour noir). Corriger : cartes d'état vide `max-w-2xl p-8`, `main` en `min-h-[calc(100dvh-65px)] flex flex-col` pour que le pied touche le bas (supprime la bande).
5. **Aujourd'hui 1280 / 768** : cartes « Conseil du jour » et « Vidéo du jour » = un lien perdu dans 300 px de carte vide (cartes étirées à la hauteur de la vanne). Sur le site, la même rubrique (accueil visiteur) montre carte riche. Corriger : `items-start` sur la grille de 3 cartes, ou donner un contenu (accroche, miniature). Même défaut de la carte « Vanne du jour » visiteur (accueil 1280 : ~180 px de vide entre bouton et pied de carte) : `lg:items-start` ou `mt-auto` sur la ligne d'actions seule.
6. **Largeurs incohérentes entre pages** (le grief « pas harmonieux ») : Vannes, Aujourd'hui, Quoi répondre, Profil, Favoris = 1 216 px collés aux marges ; Parcours, Carnet, fiches = colonne de 768 ou 704 px centrée ; titres à x=32 d'un côté, x=256 de l'autre. Corriger : fixer une règle unique, listes/tableaux de bord `max-w-screen-xl`, lecture `max-w-3xl mx-auto`, et la documenter ; un H1 dans les deux cas à `text-4xl`, fil d'Ariane ou « Retour » à la même hauteur (`pt-12`, `mb-8`).
7. **Rythme du haut de page** : H1 à y=118 (Aujourd'hui, Favoris, Profil), y=162 (pages avec Retour), y=96 (Parcours, Carnet avec fil d'Ariane). Trois hauteurs de titre. Corriger : `main` `pt-10` fixe, bloc Retour/fil `h-6 mb-4` réservé même vide.
8. **Carnet** (`abonne-en-cours-carnet-1280.png`) : texte courant ~12-13 px en `text-text-muted` sur carte, cartes de 350 px à 4 titres internes : illisible et dense. Corriger : corps `text-sm text-text-secondary` minimum, `space-y-4` entre blocs, `text-base` pour « Tu réponds ».
9. **Vannes abonné 1280** : rangée de filtres coupée à droite (« Absurde » tronqué, aucun dégradé ni flèche). Corriger : `flex-wrap gap-2` à partir de `lg:` (garder le défilement sous `lg`) ou masque `[mask-image:linear-gradient(to_right,#000_92%,transparent)]`.

## Pistes (n'empêchent pas le 10)
- Quoi répondre 1280 : 60 lignes en 2 colonnes, 12 filtres en 2 rangées dont une orpheline (« Prise de parole », « Commerces… » seuls). `gap-2` et regrouper en un `select` « Filtrer » comme à 375 dès `lg`, ou pagination.
- Mes questions : « Mes envois » commence 25 px plus bas que la carte du formulaire. Aligner `lg:items-start` et même `pt`.
- Profil : 9 cartes pleine largeur, petits textes `text-xs` (lettre, suppression) ; carte « Ta question à l'équipe » avec 24 px de vide haut et bas (`py-6` → `py-4`). Statistiques en `grid-cols-4` espacées de 300 px : `max-w-3xl`.
- Fiche humour noir : pas de H1 (le titre est un H2 en carte) et 46 px de plus que les autres entre « Retour » et le contenu.
- Menu 768 : onglet « Mon espace » encore visible dans la barre et dans le menu (non cliquable), un peu redondant ; menu à 740 px de large pour 8 libellés, `md:max-w-md` suffirait.
- Accueil 768/1280 abonné : carte vidéo seule sur la 2e ligne à 768 (`md:grid-cols-2`) → `md:grid-cols-3` ou `col-span-2`.
- Visiteur accueil : bloc « Derniers articles » en 3 cartes minuscules, hiérarchie plus faible que les sections voisines (`text-base` → `text-lg`, `py-4`).

## Ce qui est bon (à ne pas toucher)
En-tête 65 px, états actifs (soulignement + fond), cibles 44 px, menu mobile, pied de page, Vannes visiteur et fiches 768 (lecture centrée, rythme `gap-6`), 375 sans débordement, Quoi répondre mobile avec filtre replié.
