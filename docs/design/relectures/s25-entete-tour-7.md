# Relecture design à l'aveugle, en-tête et menu mobile de l'espace (s25, tour 7)

Méthode : lecture de la spec v5, des lignes 191 à 194 des préférences fondateur, des 5 captures d'étalon de l'accueil, de `INDEX.md` et du code (`en-tete-universel`, `menu-mobile-universel`, `account-menu`, `cloche`, `cloche-lignes`, `search-bar`, `panneau-eleve`, `tailwind.config.ts`). Captures de `docs/captures/s25/entete-tour-7/` ouvertes une à une, listées plus bas. Aucune relecture existante consultée. Mesures en pixels lues sur les images (coordonnées de l'image originale). Le point 194 (recherche à 176 px, position variable) ne retient pas la note.

Note de lecture de l'index : les échecs `visiteur-menu-mon-espace/situation/profil/court` sont normaux (le visiteur est renvoyé à la connexion, pas de bouton Menu). `gratuit-menu-mon-espace-375` et `gratuit-menu-court-375` n'affichent pas le bouton Premium : la page derrière est l'abonnement (« Premium ouvre tout »), bouton masqué sur /abonnement par la spec, donc conforme.

## Captures ouvertes

- Étalon : `etalon-accueil/visiteur-accueil-1280.png`, `-375.png`.
- Bandeaux : en-cours mon-espace 320, 440, 641, 1024, 1280, 1920 ; profil 768 ; visiteur vannes 320, 440, 520, 640, 641, 1024, 1280, accueil 1920 ; gratuit vannes 320, 1456, mon-espace 1024 ; en-cours vannes 1456 via `gratuit-vannes-1456`.
- Menus : en-cours `menu-court` 320 et 375, `menu-mon-espace` 768, `menu-situation` 375, `menu-profil` 375, `menu-vannes` 768 ; gratuit `menu-court` 375, `menu-mon-espace` 375, `menu-profil` 375 et 768 ; nouvel `menu-court` 375 ; visiteur `menu-vannes` 375.
- Cloche : en-cours 375, 768, 1280 ; nouvel `cloche-vide` 320, 375, 1456.
- Compte : en-cours `compte-profil-1280`, `compte-1920` ; gratuit `compte-768`, `compte-profil-1920`.
- Focus : en-cours `focus-dans-menu-375` 01, 03, 10, 12 ; `focus-dans-menu-768` 02, 12 ; `focus-dans-cloche-375-02` ; `focus-04-768`.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue visuelle de l'accueil | 10 |
| 2 | Cohérence entre comptes et pages | 10 |
| 3 | Hiérarchie et lisibilité | 10 |
| 4 | Menu mobile | 9 |
| 5 | Panneaux cloche et compte | 9 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 8 |

Globale : 8/10 (plafonnée par le critère 7).

## Ce qui est juste (preuves)

1. Fidélité : à 1280, le bandeau abonné (`en-cours-mon-espace-1280-bandeau`) et celui du visiteur (`visiteur-vannes-1280-bandeau`) sont à l'identique de l'en-tête de l'étalon : logo dégradé violet à x=32, liens `text-sm` gris, recherche arrondie, bouton Premium plein violet, filet bas. Les panneaux reprennent la carte de l'accueil : `rounded-xl`, filet dégradé violet de 4 px en haut, titre `font-display` gras (`en-cours-cloche-1280`, `gratuit-compte-profil-1920`). Pas de glassmorphism, pas d'icône dans un carré.
2. Cohérence : même logo, même coque, mêmes cibles de 44 px pour les trois comptes à chaque palier. Aux paliers critiques, l'ordre des éléments suit la spec : 320 (logo, cloche, Menu), 440 (loupe, Premium court), 520 (Connexion), 640 et 641 (libellé complet, aucun débordement ni saut), 768 (Mon espace en barre, compte), 1024 (liens). Écart de position de la recherche selon le compte : accepté par écrit (ligne 194), non noté.
3. Hiérarchie : en plissant les yeux, trois repères sur chaque bandeau : le logo, l'élément allumé (fond élevé + soulignement violet) et le bouton Premium ou la cloche. Un seul bouton plein par barre.
4. Menu, hauteur : à 568 px (`en-cours-menu-court-375` et `-320`), « Mon espace » et les 8 entrées tiennent : Carnet finit à y=530, le séparateur à 529, « Parcours » dépasse en haut de la zone de pli. Critère 5 de la spec atteint, y compris à 320. À 812 px (`menu-situation-375`), les 5 liens du site tiennent aussi.
5. Menu, hiérarchie : rail à x=28, entrées à x=53, liens du site et « Mon espace » à x=28, fond des lignes calé sur le logo (x=16, 4 px de coque) à 375 ; à 768, texte à x=36 et fond à x=24, comme le logo ; fond d'actif aux coins droits arrondis, filet gauche droit de 2 px, graisse 500 partout, 600 seulement sur l'actif et sur « Mon espace ». À 768, l'intitulé non cliquable est bien en blanc semi-gras (`menu-mon-espace-768`).
6. Panneaux : bord droit sur la marge de la coque (x=1248 à 1280, 1568 à 1920, 744 à 768), 8 px sous le filet, ouvert (fond de survol seul) distinct de l'actif (soulignement violet + texte violet) sur la cloche comme sur le compte (`gratuit-compte-768` contre `en-cours-profil-768-bandeau`). Page en cours : ligne « Mon profil » allumée avec filet violet (`en-cours-compte-profil-1280`). État vide propre, une phrase, 23 px d'air (`nouvel-cloche-vide-375`, `-320`, `-1456`).
7. Contrastes (calculés sur `tailwind.config.ts`) : gris secondaire #B3B3B3 sur élevé #2A2A2A 6,9:1 ; violet #A78BFA sur élevé 5,3:1 ; muted #9A9A9A sur fond de champ 6,2:1 ; anneau #8B5CF6 sur page 3,9:1. Tous au-dessus de AA.

## Défauts, corrections, ce qui ferait 10

### Critère 7, note 8

**F1, faute dure (code, non capturé) : le focus clavier du menu du compte n'a aucun anneau.**
- Fichier : `apps/web/src/components/layout/account-menu.tsx`, `ITEM_UNIVERSEL` : `outline-none ... data-[highlighted]:bg-border-hover`. Seul indicateur de focus : un fond #3A3A3A sur le panneau #2A2A2A, soit 1,26:1 (en dessous de 3:1, WCAG 1.4.11 et 2.4.7), alors que la barre, le menu mobile et la cloche portent un anneau violet de 2 px. C'est la seule zone de l'en-tête où le focus n'est pas homogène. Aucune capture `focus-dans-compte` n'existe : à produire pour confirmer.
- Correction : ajouter à `ITEM_UNIVERSEL` `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link` (`:focus-visible` plutôt que `data-[highlighted]`, pour ne pas dessiner d'anneau au survol à la souris). Prévoir `ITEM_COURANT` compatible (le filet gauche reste, l'anneau l'entoure).
- 10 : anneau visible dans le menu du compte ouvert au clavier, et capture `focus-dans-compte` ajoutée au script.

**F2, piste mesurable : géométrie de l'anneau non homogène.**
- Barre, cloche, compte : anneau extérieur, entièrement arrondi. Menu mobile : anneau intérieur (`ring-inset`). Lignes du rail (`focus-dans-menu-375-03` et `-10`) : coins gauches carrés (`rounded-r-lg`), anneau posé sur le rail (x=30). Lignes de la cloche : `ring-accent-link` (#A78BFA) quand tous les autres anneaux sont `accent-primary` (#8B5CF6) (`focus-dans-cloche-375-02`).
- Correction : `focus-visible:rounded-lg` sur les lignes du rail et sur `ALLUMEE` en focus (comme `classeLienBarre`) ; unifier la couleur : `accent-primary` partout, ou `accent-link` partout sur fond élevé, documenté dans le commentaire de `panneau-eleve.ts`.
- 10 : un seul jeu d'anneau (couleur, arrondi) dans les quatre zones.

### Critère 4, note 9

**P1, piste mesurable : dernière ligne collée au bord bas de l'écran.** `en-cours-menu-profil-375` (abonné sur /profil à 812 px) : le défilement automatique de 8 px amène « Mon profil » (y=767 à 811) à zéro pixel du bas de la fenêtre, et décale la recherche à 8 px du filet au lieu de 16 (y=73 contre 81 ailleurs). Pas de faute (le critère 5 ne concerne que les 8 entrées, qui restent visibles), mais la ligne paraît coupée.
- Correction dans `menu-mobile-universel.tsx` : ajouter la marge basse au défilement quand le plafond le permet (`defilement + 16` plafonné à la hauteur disponible), sinon ne pas défiler. Ne jamais déplacer « Mon espace » ni les 8 entrées.
- 10 : la ligne allumée sous le pli arrive avec 16 px d'air sous elle, ou le menu ne bouge pas.

**P2, piste subjective, ne retient pas la note.** « Connexion » (visiteur) est sans icône quand les actions du compte en ont une (`visiteur-menu-vannes-375` contre `gratuit-menu-court-375`) : justifiable, comptes différents.

### Critère 5, note 9

Retenue par F1 uniquement (finition du panneau compte : le focus). Pas d'autre défaut : détachement net (ombre, anneau fin), alignements verticaux corrects (titre, groupes, lignes sur la même verticale), « Fermer » 44 px. 10 une fois F1 corrigée.

### Critères 1, 2, 3, 6 : 10

Aucun écart mesuré. À 1456 et 1920 la coque reste à 1216 px utiles centrée, logo et bord droit alignés sur le contenu de la page (x=352 et 1568 à 1920 ; x=120 et 1336 à 1456), panneaux ancrés sur le bord droit de la coque. La recherche à 40 px de haut (cible sous 44 px) est celle de l'étalon : ne retient pas la note.

## Ordre de correction proposé

1. F1 (faute dure, une ligne de classes dans `account-menu.tsx`) + capture de preuve.
2. F2 (deux classes + une couleur).
3. P1 (calcul du défilement).

NOTE GLOBALE : 8/10
