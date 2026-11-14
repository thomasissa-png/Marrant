# Relecture UX à l'aveugle s25, en-tête et menu mobile, tour 3

Périmètre : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `cloche.tsx`, `cloche-lignes.tsx`. Référence : spec v5 `navigation-universelle-s24.md` (écarts ROUVRE non rediscutés) et étalon accueil. Captures dans `docs/captures/s25/entete-tour-3/`.

Captures ouvertes : étalon 375 et 1280 ; en-cours : mon-espace 520, 768, 1024, 1280, 1920, menu mon-espace 320, 375, 768, menu situation 375, cloche 375, compte 1280, focus 375 et 768 ; nouvel : cloche 1280, cloche vide 320 et 375, compte 1920 ; gratuit : menu 320 et 375, mon-espace 1280, vannes 320, compte 768 ; visiteur : menu accueil 375, vannes 440, 520, 640, 641, 768, 1024, 1280 ; en-cours vannes 320.
Non ouverts (limite de preuve, pas défaut) : les menus sur une page publique (Vannes allumée dans le menu), les compteurs à 600 et 641 pour les comptes connectés, `/profil` allumé.
Remarque : le compte gratuit sur `/mon-espace` est renvoyé vers `/abonnement` (bouton d'offre masqué, règle de la spec).

## 1. Conformité à la spec v5 : 10/10

Vérifié sur capture : abonné 1280 = logo, Mon espace allumé, Parcours à Articles (5 liens), champ de recherche, cloche à point violet, compte (Mon profil, Déconnexion, sans Favoris) ; visiteur 1280 = 6 liens dont La lettre, champ, Connexion, « Premium · 1,99 €/mois » ; gratuit : compte avec Favoris, Mon profil, Déconnexion (768). 1024 : loupe, Connexion, « Premium » court. 768 : abonné = logo, Mon espace, loupe, cloche, compte, Menu ; visiteur = loupe, Connexion, offre complète, Menu. 640 et 641 : offre complète. 440 : « Premium » seul, loupe, sans Connexion ; 520 : Connexion apparaît. 320 : visiteur et gratuit = logo, « Premium », Menu ; abonné = logo, cloche, Menu. Une seule barre de 65 px. Menu abonné : Mon espace puis 8 entrées dans le bloc à filet, séparateur, 5 liens, Mon profil. Intitulé non cliquable de 768 à 1023 : conforme (menu 768). Aucun écart.

## 2. Orientation : 10/10

Abonné : Mon espace allumé (fond, texte violet, soulignement), logo vers Aujourd'hui, donc 1 geste. Visiteur et gratuit : le bouton d'offre est visible à toutes les largeurs, hors /abonnement. Piste (non retenue par la spec, non notée) : sous 768 px, bouton Menu fermé sans repère de rubrique ; la spec l'a écarté.

## 3. Menu mobile : 10/10

375 et 320 (en-cours) : recherche, Mon espace allumé (filet violet 2 px, fond, semi-gras), 8 entrées de 44 px, séparateur, Parcours à Articles, début de Mon profil à y = 797 : les rubriques de l'espace sont à 2 touchers sans défilement. Ordre et hiérarchie conformes (rail `ml-3`, retrait `pl-6`). Ligne allumée d'une rubrique (Quoi répondre sur la fiche situation) : filet sur le rail, lisible sans teinte. Visiteur et gratuit : liste, séparateur, offre puis Connexion ou Favoris, Mon profil, Déconnexion. Piste : à 768, les lignes de 44 px s'étirent sur 736 px avec les libellés à gauche, vide à droite ; conforme à la spec, cosmétique.

## 4. Cloche et compte : 9/10

Cloche : non lu (point violet 12 px, bordure de la couleur du fond), ouverture sous l'en-tête, Fermer 44 px, chevrons, vide « Rien de nouveau. Reviens quand tu veux. » (320, 375), lisible, sans débordement. Bon.

**Faute non dure (cohérence de l'état ouvert), `en-cours-compte-1280.png`, `nouvel-compte-1920.png`** : le compte ouvert est rendu en boîte à fond élevé au bas carré, soit la forme de l'état « actif » d'un onglet, alors que l'adresse n'est pas `/profil`. Sur /vannes, Vannes et le compte paraissent allumés ensemble. La cloche ouverte (`nouvel-cloche-1280.png`) garde un fond élevé à coins arrondis : deux icônes voisines, deux états ouverts différents.
Correction codable (`account-menu.tsx`, ligne 64 à 65) : réserver `rounded-b-none border-b-2` à l'état actif (`universel.actif`), et laisser `rounded-lg` à l'état ouvert non actif, par exemple `universel && universel.actif && "rounded-b-none border-b-2 border-accent-primary bg-background-elevated text-accent-link"` et `universel && !universel.actif && "data-[state=open]:rounded-lg"` (en gardant `border-b-2 border-transparent` pour ne pas décaler la hauteur).
Ce qui ferait 10 : l'ouvert est identique entre cloche et compte, et distinct de l'actif.
Piste : la ligne « Une question » de la cloche ne dit pas quelle question ; « Une question, répondu le 14 novembre » reste générique (libellé existant, à valider par Thomas avant tout changement).

## 5. Charge cognitive et cohérence : 9/10

Mêmes positions du logo, du premier lien (x = 276 pour les trois comptes à 1280) et de la recherche (x = 764 pour tous). Une seule action principale par état (offre, ou Mon espace). Cohérent avec l'étalon accueil (même barre à 1280). Seul défaut : l'incohérence cloche et compte décrite au point 4 (même correction, aucun autre travail).

## 6. Largeurs extrêmes et plages : 10/10

320 : aucun débordement, logo en `text-sm`, offre « Premium », Menu ; abonné cloche et Menu. 440 à 767 : loupe, Connexion dès 520, offre complète dès 640, pas d'icône compte (dans le menu). 1024 à 1279 : libellé court, loupe. 1920 : coque 7xl centrée, alignée sur le contenu, compte et menu à la marge de la coque (1248 / 1568), sans vide à gauche.

## 7. Accessibilité visible : 10/10

Cibles : icônes 44 x 44, liens h-11, lignes du menu 44 px, Fermer h-11. Focus : anneau violet de 2 px visible sur le logo, la loupe et la cloche (`en-cours-focus-01-768`, `03-768`, `02-375`), anneau inset dans le menu. État actif sans la teinte : fond élevé, soulignement 2 px, filet gauche et semi-gras, plus `aria-current`. Contrastes calculés depuis le thème : `accent-link` #A78BFA 7,1:1 sur #0D0D0D et 5,3:1 sur #2A2A2A ; `text-secondary` #B3B3B3 9,3:1 et 6,8:1 ; `text-muted` #9A9A9A 5,1:1 sur #2A2A2A ; blanc sur #7C3AED (bouton d'offre) 5,7:1 ; anneau `accent-primary` 4,6:1 sur le fond de page (≥ 3:1). Tous ≥ AA.

## Synthèse

Une seule correction (état ouvert du compte, 2 lignes dans `account-menu.tsx`) sépare le rendu du 10. Aucune faute dure. La note globale est plafonnée par les critères 4 et 5.

NOTE GLOBALE : 9/10
