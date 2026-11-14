# Relecture UX à l'aveugle, s25 : en-tête et menu mobile (tour 2)

Périmètre : en-tête universel et menu mobile de l'espace client, 4 comptes (visiteur, gratuit, en-cours, nouvel). Étalon : accueil (`docs/captures/s25/etalon-accueil/`). Captures : `docs/captures/s25/entete-tour-2/`. Spec jugée : `docs/ux/navigation-universelle-s24.md` v5 ; les [CHOIX UTILISATEUR] et les 10 écarts ROUVRE ne sont pas rediscutés.

Vues ouvertes : visiteur 320, 375, 600, 768, 1920 (accueil) ; gratuit 600 (menu), 768 (compte, abonnement), 320 (menu) ; en-cours 320, 375, 600, 768, 1280, 1920 (page, menus, cloche, compte, focus 01 à 06) ; nouvel 375, 768 (menu, cloche, cloche vide). Limite : pas de capture à 440, 520, 640, 641, 1024 à 1279 ; je ne juge pas ce que je n'ai pas vu.

## Constats conformes (preuves)

- Barre identique à l'étalon : même logo, même cadre `max-w-7xl`, mêmes liens, recherche 176 px, Connexion, bouton Premium (`visiteur-accueil-1280/1920` contre `etalon-accueil`). Aucun saut, aucune seconde barre.
- Abonné : Mon espace allumé (fond, texte violet, soulignement) puis 5 liens, recherche, cloche à point violet, compte avec Mon profil et Déconnexion seulement (`en-cours-compte-1280`, `en-cours-mon-espace-1920`). Gratuit : La lettre, Premium, compte avec Favoris (`gratuit-compte-768`, `gratuit-focus-06-1280`).
- Largeurs : visiteur 320 logo + Premium court + Menu ; 600 loupe, Connexion, Premium court ; 768 libellé complet ; abonné 320 logo, cloche, Menu ; 600 loupe, cloche, Menu (`visiteur-accueil-*`, `en-cours-mon-espace-320/600`). Rien coupé ni débordant.
- Menu mobile abonné 375 et 320 : recherche, Mon espace, 8 entrées, séparateur, Parcours à Articles. La dernière entrée (Carnet) finit à y = 527 sur une fenêtre de 812, soit largement sous 568 : 2 touchers sans défilement (`en-cours-menu-mon-espace-375/320`, `menu-situation-*`).
- Ligne allumée lisible sans la teinte : filet violet de 2 px sur le rail, fond, semi-gras (`en-cours-menu-situation-375`). Sur Aujourd'hui seule « Mon espace » est allumée ; sur une rubrique, son parent « Mon espace » passe en blanc semi-gras sans lien actif, comme voulu (§1).
- 768 abonné : intitulé « Mon espace » non cliquable dans le menu, lien allumé en barre, pas d'actions de compte dans le menu car l'icône est en barre (`en-cours-menu-mon-espace-768`).
- Cloche : nom accessible par réponses non lues, point violet absent quand il n'y a que le carnet (`nouvel-menu-accueil-375`, conforme « un fait, un signal »), panneau sous le filet, bord droit sur la marge, Fermer + Échap + clic dehors (code `cloche.tsx`), chevrons sur chaque ligne, état vide « Rien de nouveau. Reviens quand tu veux. » (`nouvel-cloche-vide-375`).
- Focus : anneau violet de 2 px sur liens, cloche, compte, Menu, Premium, à 375, 768, 1280 (`en-cours-focus-02-768`, `focus-05/06-1280`, `visiteur-focus-05-768`). Cibles en `h-11 w-11`.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité à la spec v5 | 10 |
| 2 | Orientation | 10 |
| 3 | Menu mobile | 9 |
| 4 | Cloche et compte | 10 |
| 5 | Charge cognitive et cohérence | 9 |
| 6 | Largeurs 320, 1920, 440 à 767 | 9 |
| 7 | Accessibilité visible | 9 |

### 1. Conformité : 10/10
Tous les états observés suivent le §1 (éléments, ordre, largeurs, états actifs, hiérarchie du menu, hauteur). Aucun écart trouvé.

### 2. Orientation : 10/10
Abonné : l'élément allumé dit où l'on est (Mon espace sur Aujourd'hui, Vannes sur /vannes) ; Aujourd'hui est à 1 geste (logo ou Mon espace dès 768 ; première ligne du menu en dessous). Visiteur et gratuit : le bouton Premium est visible de 320 à 1920 (sauf /abonnement, règle de la spec : `gratuit-mon-espace-768`).

### 3. Menu mobile : 9/10
Faute légère (piste forte) : dans le menu du compte gratuit, « Favoris », « Mon profil », « Déconnexion » sont plus gras que les liens du site au-dessus (`gratuit-menu-accueil-600`, `gratuit-menu-situation-320`, `visiteur-menu-accueil-375` pour « Connexion »). Cause : `buttonVariants` impose `font-semibold` (`button.tsx:6`), alors que les liens du site sont en `font-medium` (`menu-mobile-universel.tsx:102`). Les actions secondaires paraissent plus importantes que la navigation, et le semi-gras n'est plus réservé à la ligne allumée, ce qui brouille le signal « allumé ».
Correction codable : dans `menu-mobile-universel.tsx`, ajouter `font-medium` à `secondaire()`, au bouton Déconnexion et au lien « Connexion » (le `cn` fusionne avec `font-semibold`). Pour le 10 : seul le Premium et la ligne allumée sont en semi-gras.
Piste : « Connexion » est centré alors que les actions du compte sont alignées à gauche avec icône ; l'aligner à gauche ou le garder centré parce qu'il suit un bouton plein est un choix de Thomas, non bloquant.
Piste (non retenue pour la note) : sur un 375 x 667, Mon profil et Déconnexion de l'abonné sont sous le pli ; la spec l'accepte (seules les rubriques de l'espace comptent), le menu défile (`max-h`), le séparateur coupé en bas de la fenêtre sert de signe.

### 4. Cloche et compte : 10/10
États compris : non lu (point violet + groupe « L'équipe t'a répondu »), « Nouveau ce mois-ci » sans point, vide (une phrase), erreur (code). Fermeture par « Fermer », Échap, clic dehors, focus rendu au bouton (Radix). Le panneau tient sur 320 (`en-cours-cloche-320`), 375, 768 et 1280 sans déborder ; compte : 2 ou 3 entrées, panneau aligné sur la marge (`en-cours-compte-1280`). Piste : à 375, le bas du panneau vide touche le haut de la carte dessous (`nouvel-cloche-vide-375`, y 206 contre 203) ; c'est un panneau flottant, sans gravité.

### 5. Charge cognitive et cohérence : 9/10
Même en-tête d'une page à l'autre (Vannes, Aujourd'hui, accueil) pour un même compte ; une seule action principale par état (Premium ou Mon espace). Le seul écart est celui du critère 3 (graisse des actions), à corriger au même endroit. Pour le 10 : même correction.

### 6. Largeurs extrêmes : 9/10
320 : aucun libellé coupé, logo en `text-sm` lisible, Premium court, cibles de 44 px ; 1920 : contenu centré sur `max-w-7xl` comme l'étalon, pas de vide gênant. Réserve : la plage 440 à 767 n'est prouvée qu'à 600, et 1024 à 1279, 640 et 641 (cas le plus serré annoncé par la spec) n'ont pas de capture ici. Pour le 10 : joindre 440, 520, 640, 641 et 1100 pour visiteur, gratuit, en-cours. Ce n'est pas un défaut observé, c'est une preuve manquante (piste).

### 7. Accessibilité visible : 9/10
Faute légère : le logo, au clavier, prend l'anneau blanc par défaut du navigateur, collé au texte, alors que tout le reste a un anneau violet arrondi (`en-cours-focus-01-1280`, `gratuit-focus-06-1280` hors cadre). Cause : le `<Link>` du logo (`en-tete-universel.tsx:129`) n'a ni `focus-visible`, ni arrondi, ni marge intérieure. Le focus est visible (contraste suffisant), donc piste, mais c'est le premier arrêt de Tab sur toutes les pages.
Correction codable : `className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"`. Pour le 10 : le logo a le même anneau que ses voisins.
Piste : le sous-texte « Répondu le 13 novembre » est en `text-xs text-text-muted` ; je ne peux pas mesurer son contraste sur les captures, à vérifier avec la valeur du token (4,5:1 minimum à 12 px).
Conformes : état actif sans la teinte (filet, soulignement, fond, semi-gras, `aria-current`), cibles 44 px, Échap et rendu du focus au bouton Menu.

## Faute dure ou piste

Aucune faute dure. Pistes : (a) graisse des actions du menu (critères 3 et 5) ; (b) anneau de focus du logo (critère 7) ; (c) captures manquantes 440 à 640 et 1024 à 1279 (critère 6) ; (d) contraste de `text-text-muted` à 12 px à mesurer.
Aucun nouveau texte proposé.

NOTE GLOBALE : 9/10
