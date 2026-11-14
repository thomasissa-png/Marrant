# Relecture design à l'aveugle, s25, section 1 : en-tête et menu mobile (tour 1)

Étalon : `docs/captures/s25/etalon-accueil/`. Captures jugées : `docs/captures/s25/entete-tour-1/` (4 comptes, 375/768/1280/1456/1920, menus, cloche, compte). Code : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `cloche.tsx`, `account-menu.tsx` (le `header.tsx` de la brief n'est qu'un aiguillage vers `EnTeteUniversel` quand l'espace est ouvert). Les choix `[CHOIX UTILISATEUR]` de la spec v5 (soulignement actif, ordre des liens, « Mon espace » en barre, etc.) ne sont pas rediscutés.

Limite d'audit : pas de capture « compte ouvert » à 375 (le compte est dans le menu sous 768) ni de capture cloche pour le compte gratuit (cloche réservée à l'abonné). Les captures `visiteur-menu-mon-espace` et `visiteur-menu-situation` ont échoué (pas de bouton Menu : page de redirection), sans incidence sur l'en-tête.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à l'accueil | 10 |
| 2 | Cohérence entre comptes et pages | 8 |
| 3 | Hiérarchie et lisibilité | 9 |
| 4 | Menu mobile | 8 |
| 5 | Panneaux cloche et compte | 7 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition | 8 |

**Globale : 7/10** (plafonnée par le critère 5).

## 1. Fidélité : 10/10
Visiteur : `visiteur-accueil-1280.png` est superposable à l'étalon (logo dégradé violet 20 px, 5 liens + « La lettre » en gris 14 px médium, champ de recherche arrondi, « Connexion », bouton « Premium · 1,99 €/mois » violet plein, filet bas de 1 px, fond `background/95`). Même hauteur de 65 px, mêmes marges que le contenu (32 px à 1280, coque `max-w-7xl`). Rien à corriger.

## 2. Cohérence entre comptes et pages : 8/10
**Faute dure F1 : la barre « saute » quand on change de compte.** `justify-between` répartit l'espace restant entre logo, liens, recherche et actions : la largeur du groupe d'actions et le nombre de liens changent selon l'état, donc la position des liens et du champ de recherche aussi.
- À 1280 : premier lien à x=276 (`visiteur-accueil-1280.png`), x=290 (`gratuit-compte-1280.png`), x=325 (`en-cours-mon-espace-1280.png`) ; champ de recherche à x=750, 779 puis 876.
- À 1456 : « Parcours » à x=364 (visiteur) et x=441 (`gratuit-mon-espace-1456.png`).
Un utilisateur qui se connecte voit la barre glisser : ce n'est plus « le même en-tête ».
**Correction** (`en-tete-universel.tsx`, ligne 125 et 135-137) : ancrer à gauche et fixer le point de départ. Conteneur `justify-start` au lieu de `justify-between` ; `<nav>` avec `lg:ml-8` (et plus de `md:mr-auto lg:mr-0`, remplacé par `mr-auto` sur le seul `<nav>` sous `lg`) ; `<SearchBar>` avec `xl:ml-auto` ; groupe d'actions `ml-auto xl:ml-3`. Résultat : logo puis liens toujours au même x (le visiteur gagne ou perd environ 24 px par rapport à l'accueil actuel, négligeable), champ de recherche collé aux actions, le vide se loge entre liens et recherche. Pour passer à 10 : mesurer en test Playwright que le x du premier lien est identique pour les 3 états à 1280, 1456 et 1920 (écart 0 px).

**Piste P1 : menu mobile différent selon le compte.** Visiteur et gratuit : liens en colonne unique (`gratuit-menu-accueil-375.png`) ; abonné : grille 2 colonnes (`en-cours-menu-mon-espace-375.png`). Justifié par la hauteur (décision du tour 2 de la spec), à garder, mais voir F3 pour l'alignement de la grille.

## 3. Hiérarchie et lisibilité : 9/10
Lien actif net (fond, violet, soulignement 2 px : `en-cours-vannes-1920.png`), bouton d'offre unique plein, cloche et pastille violette lisibles. Une action primaire par écran respectée.
**Piste P2** : à 1280 et plus, cloche et compte sont deux icônes seules, sans libellé (`en-cours-mon-espace-1280.png`). Règle maison « libellés texte > icônes seules » pour les non-techniques. Sans changer les libellés validés : rendre visible le nom déjà existant de l'abonné `TEXTES_CONNEXION.menuCompte` (« Mon compte » ou équivalent) à côté de l'icône dès `2xl` (`hidden 2xl:inline text-sm`), si le budget de largeur le permet (il y a 100 px libres à 1456 chez l'abonné). Pour 10 : icône + libellé du compte dès 1280 chez l'abonné, ou décision écrite de Thomas de garder les icônes.

## 4. Menu mobile : 8/10
Points forts : ouverture propre, 8 entrées avec rail à gauche, abonné tient en 778 px sur 812 (`en-cours-menu-mon-espace-375.png`), pas de défilement ; Premium visible en bas pour gratuit (`gratuit-menu-accueil-375.png`).
**Faute dure F2 : alignement du bouton Déconnexion.** À 375, gratuit : « Favoris » et « Mon profil » sont alignés à gauche (x=28/52) et « Déconnexion » est centré (x=143-232) (`gratuit-menu-mon-espace-375.png`, `gratuit-menu-accueil-375.png`). Abonné : « Déconnexion » est centré dans sa demi-largeur (texte à x=231) alors que « Vannes » et « Videos » commencent à x=203 (`en-cours-menu-mon-espace-375.png`).
**Correction** (`menu-mobile-universel.tsx`, bouton Déconnexion, ligne 137) : `className="h-11 w-full justify-start gap-2"` et ajouter `<IconeDeconnexion className="h-4 w-4" />` (déjà dans `header-icons`, utilisé par `account-menu.tsx`) avant le libellé, comme les deux autres lignes. Dans le cas abonné, le texte démarre alors à x=203 comme la colonne des liens. 
**Piste P3 : trou à 768 chez l'abonné.** La colonne d'entrées occupe 150 px sur 768 et laisse 600 px vides à droite (`en-cours-menu-mon-espace-768.png`). Passer `<ul>` en deux colonnes dès `md` : `md:grid md:grid-cols-2` (4 + 4 entrées) et supprimer le rail (`md:border-l-0`), ce qui raccourcit le panneau de 176 px.
**Faute dure F3 : séparateur orphelin à 768 chez le gratuit sur page chaude** (`gratuit-menu-situation-768.png`) : un `<hr>` suivi de rien (le bouton Premium est masqué, le compte est en barre). Correction : ligne 107, `<hr className={cn("my-2 border-border", (etat === "abonne" || (etat === "gratuit" && masquerPlein)) && "md:hidden")} />`.
**Faute dure F4 : l'icône de recherche flotte seule à 768 quand le menu est ouvert chez le gratuit** (`gratuit-menu-accueil-768.png`) : la loupe est à x=448, loin de l'icône compte (x=674), à cause du bouton Premium rendu `invisible` qui garde sa place. Correction (`en-tete-universel.tsx`, ligne 190) : `menuOuvert && "hidden lg:inline-flex"` à la place de `"invisible lg:visible"` ; à 375 il n'y a pas d'icône à gauche à garder, le logo reste à gauche et la croix à droite (vérifié par `gratuit-menu-accueil-375.png`).
Pour 10 : F2, F3, F4 corrigés, P3 appliquée.

## 5. Panneaux cloche et compte : 7/10
**Faute dure F5 : les panneaux sont collés à l'en-tête.** Le haut du panneau est à y=62 alors que le filet de l'en-tête est à y=64 (`en-cours-cloche-1280.png`, `en-cours-compte-1280.png`, `nouvel-compte-1920.png`) : le panneau mord de 2-3 px sur le filet. Cause : décalage de 8 px calculé depuis le bas du bouton (y=54), pas depuis le bas de l'en-tête (y=65). 
**Correction** : `account-menu.tsx` ligne 50, `sideOffset={19}` ; `cloche.tsx` ligne 52, `const haut = Math.round(r.bottom + 19)` (ou mieux `document.querySelector("header")!.getBoundingClientRect().bottom + 8`). Le panneau est alors à 8 px sous le filet.
**Faute dure F6 : les deux panneaux n'ont pas le même bord droit.** Compte : aligné sur la marge de la coque (x=1248 à 1280, 1568 à 1920) ; cloche : aligné sur le bouton (x=1191 à 1280), donc 57 px en retrait de la marge, sans lien visuel avec elle (`en-cours-cloche-1280.png`). Sur la même barre, deux panneaux qui sortent à deux endroits différents font désordonné. Correction : aligner la cloche sur la même règle que le compte (bord droit = bord droit de la coque, via `align="end"` sur un Popover Radix, ou `right: max(32px, (100vw - 1280px)/2 + 32px)` dès `xl`). Le choix à faire n'est pas esthétique mais de cohérence : les deux sur la marge de la coque.
**Faute dure F7 : les panneaux ne parlent pas la langue des cartes de l'accueil.** Les cartes de l'accueil ont un filet violet de 3-4 px en haut, un rayon de 12 px (`rounded-xl`) et un fond `background-card` ; les panneaux ont `rounded-lg` (8 px), pas de filet, et le bouton « Fermer » est un contour blanc de 44 px, le plus lourd du panneau (`en-cours-cloche-768.png`), plus visible que le titre.
**Correction** : sur `cloche.tsx` ligne 97 et `account-menu.tsx` ligne 51, remplacer `rounded-lg`/`md:rounded-lg`/`rounded-t-lg` par `rounded-xl`/`md:rounded-xl`/`rounded-t-xl` ; ajouter `border-t-2 border-t-accent-primary` (même filet violet que `.carte` de l'accueil ; reprendre exactement la classe utilisée par la carte de l'accueil, à lire dans le composant de carte) ; `overflow-hidden`. « Fermer » : passer `variant: "ghost"` et `h-11` conservé (cible 44 px) pour qu'il soit sobre, et garder `border-border-input` seulement au focus.
**Piste P4** : lignes de la cloche (« Une question », « Le carnet du mois ») sans signe de cliquabilité (ni chevron, ni survol visible). Ajouter le chevron `>` des lignes de « Dans ton espace » (`en-cours-mon-espace-1280.png`) et `hover:bg-background-elevated rounded-lg`, `min-h-11`, pour retrouver le motif des lignes de la page.
Pour 10 : F5, F6, F7 corrigés, P4 appliquée.

## 6. Grandes largeurs : 10/10
Coque `max-w-7xl` centrée à 1456 (logo x=120, icônes jusqu'à x=1336) et 1920 (352 à 1568) ; le contenu s'aligne au pixel sur le logo (`en-cours-vannes-1920.png`) ; rien de collé ni de coupé ; le panneau compte à 1920 reste aligné sur la marge. Le défaut de cloche au bord droit est compté en 5 (F6), pas ici.

## 7. Finition : 8/10
Cibles de 44 px respectées (cloche, compte, croix, « Fermer »), contrastes AA visibles corrects (gris `text-secondary` sur fond sombre, violet `accent-link` sur fond de carte), pas de troncature ni de débordement à aucune largeur. Retenus : F4 (icône flottante), F3 (séparateur orphelin), F5 (panneau sur le filet), F2 (alignement). Pour 10 : les corrections ci-dessus.

## Ordre de correction conseillé
1. F5, F6, F7 (panneaux, 3 fichiers, aucune logique).
2. F1 (alignement de la barre, un seul composant).
3. F2, F3, F4 (menu mobile, deux fichiers).
4. P2, P3, P4 (pistes).
Aucun libellé validé n'est modifié (seule l'icône de Déconnexion est ajoutée au menu mobile). Après correction, recapturer 375/768/1280/1456/1920 pour les 4 comptes, cloche et compte ouverts, avant le tour 2.

NOTE GLOBALE : 7/10
