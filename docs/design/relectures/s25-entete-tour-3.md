# Relecture design à l'aveugle, s25, en-tête et menu mobile, tour 3

Étalon : `docs/captures/s25/etalon-accueil/` (1280, 1920, 375 lus). Captures : `docs/captures/s25/entete-tour-3/`. Spec v5 et choix de Thomas non rediscutés (menus en une colonne de haut en bas, « Mon espace » parent, intitulé non cliquable de 768 à 1023).

## Couverture réelle

Lu : en-cours, gratuit, nouvel, visiteur à 320, 375, 440, 641, 768, 1024, 1280, 1456, 1920 (au moins une page par compte ; plusieurs largeurs via la page mon-espace, la page /vannes ou le menu) ; menus ouverts 320, 375, 640, 768 (abonné, gratuit, visiteur) ; cloche ouverte 320, 375, 768, 1280 ; cloche vide 320, 375, 1920 ; compte 768, 1280, 1920 ; focus visiteur 375/768/1280, abonné 768/1280. Limite : les captures « haut de page » des visiteurs sont des pleines pages réduites (en-tête illisible sous 1024) ; l'en-tête visiteur à 320 à 641 a été jugé sur les vues menu et focus, pas sur un rognage de 65 px. Les mesures sont lues en pixels sur les images, pas calculées dans le navigateur.

## Notes

| Critère | Note |
|---|---|
| 1. Fidélité à l'accueil | 10 |
| 2. Cohérence comptes et pages | 10 |
| 3. Hiérarchie et lisibilité | 10 |
| 4. Menu mobile | 9 |
| 5. Cloche et compte | 10 |
| 6. Grandes largeurs | 10 |
| 7. Finition au pixel | 9 |

## 1. Fidélité : 10

À 1280 et 1920, l'en-tête de l'espace est celui de l'accueil : logo dégradé violet à la même place, 65 px, filet bas, liens `text-sm`, recherche 176 px, Premium violet, coque centrée `max-w-7xl` (logo x=352 à 1920 comme l'étalon). Panneaux cloche et compte : `rounded-xl`, filet dégradé violet de 4 px en haut (`en-cours-cloche-1280.png`, `gratuit-compte-1920.png`), pastille violette. Menu mobile : bouton d'offre violet plein identique à celui de l'accueil. Rien à corriger.

## 2. Cohérence : 10

Premier lien et recherche au même x pour les 3 comptes (logo 352, recherche 1085 à 1920 ; liens commencent à 596 pour l'abonné et le visiteur car « Mon espace » est le 1er lien abonné, ordre conforme à la spec). Cloche et compte au même endroit sur /vannes et /mon-espace. L'état allumé (fond élevé, texte violet, soulignement 2 px) est identique en barre à 768, 1024, 1280. Le vide à droite de la recherche pour l'abonné à 1280+ (pas de Premium) est le prix de la zone d'actions à largeur fixe décidée au tour 2 : piste, pas faute.

## 3. Hiérarchie : 10

À l'œil plissé : logo, lien allumé, action violette. Parent « Mon espace » en semi-gras, entrées en rail `ml-3 border-l` à 24 px, séparateurs de 1 px, un seul pas de 44 px (`en-cours-menu-mon-espace-375.png` : lignes à 155, 199, 243 ... 507, pas constant de 44).

## 4. Menu mobile : 9

Conforme : une colonne, 8 entrées visibles sans défilement à 375 et 320 (Carnet à y=507 sur 812), graisse homogène (medium partout, semi-gras réservé à la ligne allumée et au parent), actions alignées à gauche, voile, croix, 768 sans lien dupliqué.

Défaut (faute dure d'alignement) : à 320 (et jusqu'à 359), le logo est à x=12 (`px-3` de l'en-tête) alors que la recherche, les lignes et le filet allumé du menu sont à x=16 (`px-4` du panneau) : `en-cours-menu-mon-espace-320.png`, `visiteur-menu-accueil-320.png`. À 375 tout est à 16, donc l'écart n'existe qu'à 320-359 et « saute » entre les deux largeurs.
Correction : `en-tete-universel.tsx` ligne 127, `px-3 min-[360px]:px-4` devient `px-4` (logo `text-sm` mesuré ~132 px : 132 + cloche 44 + menu 44 + gaps 16 = 236 px, 52 px libres à 320 pour l'abonné ; pour le visiteur ajouter Premium court ~84 px donne ~320 contre 288 disponibles : vérifier avec `header-budget` à 320 ; si ça déborde, réduire `gap-2` à `gap-1` entre bouton d'offre et menu, ou passer le menu à `px-3` à 320 pour aligner l'autre sens). Fait 10 : une seule marge (logo, recherche, lignes) de 320 à 1023.
Piste (non retenue pour la note) : le texte des actions à icône (Favoris, Mon profil, x=52) ne s'aligne ni sur les liens (28) ni sur les entrées du rail (53, écart de 1 px) ; passer l'icône en `h-4 w-4` + `gap-[13px]` ou texte en `pl-[25px]` calerait le texte à 53. Subjectif.

## 5. Cloche et compte : 10

Panneaux nettement au-dessus des cartes (fond élevé, ombre, anneau, 8 px sous le filet, bord droit sur la marge de la coque : 1568 à 1920, 1249 à 1280, 745 à 768). Titre, « Fermer », chevrons, groupes alignés ; sous 768, largeur de la coque (12 px à 320, comme l'en-tête). État vide : phrase à 23 px du haut et du bas, sans trou (`nouvel-cloche-vide-320.png`, `-375.png`, `-1920.png`). Lignes de 44 px, contraste annoncé 6,85:1 et 5,42:1 cohérent avec les couleurs lues.

## 6. Grandes largeurs : 10

1456 et 1920 : coque centrée 1216 px, filet pleine largeur comme l'accueil, panneaux ancrés sur la coque, cloche vide à 1920 propre. Aucun contenu collé à gauche.

## 7. Finition : 9

Aucune troncature, aucun débordement vus de 320 à 1920 ; cibles h-11/w-11 (44 px) ; focus violet 2 px arrondi sur logo, liens, loupe, menu, cloche (`en-cours-focus-02-1280.png`, `-05-768.png`, `-06-768.png`). Défaut : le même écart de gouttière 12/16 px à 320-359 (voir 4, mêmes correction et critère).
Piste (sans effet sur la note) : sur Premium, l'anneau focus est doublé (liseré clair intérieur, `visiteur-focus-02-375.png`, `-04-768.png`) alors que les autres contrôles ont un anneau violet simple ; justifié par la visibilité sur fond violet, à garder.

## Faute dure / pistes

Faute dure : 1 (gouttière 12 px contre 16 px à 320-359, critères 4 et 7). Pistes : alignement du texte des actions à icône ; vide à droite de l'abonné aux grandes largeurs.

NOTE GLOBALE : 9/10
