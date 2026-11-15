# Relecture design à l'aveugle, en-tête et menu mobile de l'espace (s25, tour 4)

Périmètre : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `panneau-eleve.ts`, `cloche.tsx`, `cloche-lignes.tsx`. Étalon : `docs/captures/s25/etalon-accueil/` (1280, 375, 1920 lus). Captures : `docs/captures/s25/entete-tour-4/`.

Lu : bandeaux visiteur (320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1456, 1920) ; bandeaux abonné avancé (`en-cours`) aux 12 largeurs ; menus mobiles abonné (320, 375, 440, 641, 768, `situation` 375, `profil` 375), visiteur (320, 375, 520, 768), gratuit (320, 375), nouvel (`situation` 375) ; cloche ouverte abonné (320, 375, 768, 1280, 1920) ; cloche vide (nouvel 320, 375, 1280) ; menu du compte (gratuit 768, 1024, 1280 ; abonné 768, 1280 ; nouvel 1920) ; focus abonné 375 (3), 768 (4, 6), 1280 (1, 2, 3, 5, 6), visiteur 768 (4), gratuit 1280 (6) ; profil nouvel 1456 ; vannes abonné 1920. Non lus un par un : les autres combinaisons compte x largeur (le code et les bandeaux lus donnent le même rendu).

Contrôles par code et mesure sur capture : cibles 44 px (icônes, menu, Connexion, lignes de menu, champ de recherche : tous `h-11` / 44 px mesurés), contrastes sur `tailwind.config.ts` (texte secondaire #B3B3B3 sur #0D0D0D ~9:1 ; anneau #8B5CF6 sur #0D0D0D ~4,5:1 ; lien actif #A78BFA sur #2A2A2A > 4,5:1 ; blanc sur bouton violet > 5:1).

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 10 |
| 2 | Cohérence entre comptes et pages | 10 |
| 3 | Hiérarchie et lisibilité | 10 |
| 4 | Menu mobile | 9 |
| 5 | Panneaux cloche et compte | 10 |
| 6 | Grandes largeurs 1456 et 1920 | 10 |
| 7 | Finition au pixel | 9 |

## 1. Fidélité : 10

L'en-tête est celui de l'accueil (étalon 1280 et 1920 : même logo dégradé, mêmes liens, même recherche, même bouton Premium violet, même coque `max-w-7xl`, logo à x=32 à 1280 et x=352 à 1920 des deux côtés). Cloche et compte reprennent la langue des cartes : `rounded-xl`, filet dégradé violet de 4 px en haut (`cloche-ouverte-*`, `compte-*`), fond élevé et anneau fin. Aucun écart.

## 2. Cohérence : 10

- Premier lien de barre au même x pour les trois états (1280 : pastille de « Mon espace » ou de « Parcours » à x=268, texte à 276 ; 1456 : 364 ; 1920 : 596).
- Bord droit des actions sur la marge de la coque dans tous les états (1248 à 1280, 1568 à 1920, 744 à 768, 1000 à 1024) ; panneaux cloche et compte alignés sur ce même bord.
- Même en-tête d'une page à l'autre (accueil, vannes, mon-espace, profil) pour un même compte.
- Piste (non retenue) : à l'ouverture du menu dès 520 px, le visiteur voit « Premium » quitter la barre et la recherche et « Connexion » glisser vers la droite (`visiteur-vannes-768-bandeau.png` : Connexion à x=438, `visiteur-menu-accueil-768.png` : x=616). C'est la règle « aucun lien deux fois » de la spec (§5 critère 3) et la décision F4 du tour 2 ; à garder.

## 3. Hiérarchie et lisibilité : 10

Une seule action dominante (Premium, violet plein) pour visiteur et gratuit ; l'abonné n'a aucun achat. L'allumé (fond élevé, texte `accent-link`, soulignement 2 px) se lit sans la teinte. Logo 14 px à 320, 16 à 375, 18 dès 400, 20 dès 640 : aucune troncature à aucune largeur (bandeaux 320 à 1920 sans débordement).
Piste (non retenue) : à 768, « Mon espace » (abonné) est à 16 px du logo (`en-cours-mon-espace-768-bandeau.png`) contre 48 px à 1024 ; c'est la règle de la spec (« collée au logo »).

## 4. Menu mobile : 9

Conforme : une colonne de haut en bas ; rail à x=28 sous le texte de « Mon espace », entrées à x=53, icônes des actions à 28 et libellés à 53 (`en-cours-menu-mon-espace-375.png`) ; pas de 44 px partout ; rubriques complètes sans défilement à 375 (Carnet finit à y=529 sur 812) et à 320 (`en-cours-menu-mon-espace-320.png`, idem) ; un seul filet violet par état allumé, ligne parente en blanc semi-gras, séparateurs seuls porteurs d'air.

**Faute légère : graisse non homogène.** Les 8 entrées de l'espace sont en graisse 400 (`menu-mobile-universel.tsx` ligne 82 : `text-sm text-text-secondary`, aucun `font-medium`) alors que les liens du site (ligne 108) et les actions (`LIGNE_ACTION`) sont en 500. Sur `en-cours-menu-mon-espace-375.png`, « Quoi répondre » à « Carnet » paraissent plus maigres que « Parcours » à « Articles » et « Mon profil », au même niveau de texte et de couleur. Le design system plafonne à 3 graisses (400, 500, 600) et réserve ici le 600 à l'allumé et au parent : le 400 ne devrait pas réapparaître au milieu.
- Correction : `menu-mobile-universel.tsx` ligne 82, `"-ml-px flex h-11 items-center pl-[23px] pr-3 text-sm font-medium text-text-secondary …"` (ajouter `font-medium`). Même largeur de glyphes, aucun changement de hauteur.
- Ce qui fait 10 : cette seule classe ; la hiérarchie reste portée par le rail, le retrait de 25 px et la couleur secondaire.

Pistes (non retenues, spec conforme) : dès 641 px le menu est une colonne gauche avec ~600 px de vide à droite (`en-cours-menu-mon-espace-641.png`), la ligne allumée s'étire sur 609 px ; les actions du compte (« Mon profil », « Déconnexion ») sont sous le pli à 375 x 812 (spec : seules les rubriques de l'espace doivent tenir).

## 5. Cloche et compte : 10

- Détachement : fond `#2A2A2A` un cran au-dessus des cartes, `shadow-2xl` + `ring-white/10`, 8 px sous le filet de l'en-tête, aucun voile (`en-cours-cloche-1280.png`, `en-cours-compte-1280.png`). Lisible aussi quand le panneau recouvre une carte.
- Alignements : titre « Notifications » sur le bord intérieur du panneau, titres de groupe et lignes sur la même verticale (x=957 à 1280) ; chevrons alignés à droite ; « Fermer » ghost de 44 px ; panneau à 16 px des bords à 320 et 375, 320 px de large dès 768.
- État vide : « Rien de nouveau. Reviens quand tu veux. » sans vide parasite (`nouvel-cloche-vide-1280.png`, `-375`, `-320`).
- Ouvert distinct d'actif : cloche et compte ouverts = carré arrondi gris sans soulignement ; actif (compte sur /profil, `nouvel-profil-1456.png`) = bas carré et filet violet 2 px.
- Compte gratuit (Favoris, Mon profil, Déconnexion) et abonné (Mon profil, Déconnexion) corrects.
- Pistes : à 1280 la ligne « Quoi répondre » de la page apparaît à demi sous le bord du panneau (`en-cours-cloche-1280.png`, chevron coupé à y=323), c'est un recouvrement normal d'un panneau sans voile ; à 320 la phrase vide passe à la ligne (« …quand / tu veux. »).

## 6. Grandes largeurs : 10

À 1456 et 1920 l'en-tête garde la coque de 1280 centrée, comme l'accueil (étalon 1920 : logo à x≈352). Aucun étirement, aucun contenu isolé ; recherche au même x pour les trois comptes. Pour l'abonné, l'espace libre entre la recherche et la cloche (~210 px) est le prix de la zone d'actions à largeur fixe décidée au tour 2 (F1 et critère 2), il ne choque pas.

## 7. Finition au pixel : 9

Conforme : cibles de 44 px, aucune troncature de 320 à 1920, contrastes AA, focus 2 px violet présent partout, y compris Premium (double anneau lisible, `visiteur-focus-04-768.png`), logo, cloche, menu.

**Faute légère : forme du focus non homogène.** Les liens de barre portent `rounded-t-lg` (ligne 67 de `en-tete-universel.tsx`) pour que le soulignement actif soit droit ; l'anneau de focus hérite de ce bas carré (`en-cours-focus-02-1280.png`, `-03`, `-05`, `-06` ; `gratuit-focus-06-1280.png`), alors que logo, cloche, compte, menu et Premium ont un anneau entièrement arrondi (`en-cours-focus-01-1280.png`, `-04-768`).
- Correction : dans `classeLienBarre`, ajouter pour les liens non actifs `focus-visible:rounded-lg` (et, pour le lien actif, `focus-visible:rounded-b-lg` suffit : le soulignement de 2 px épouse alors le coin le temps du focus). Aucun changement hors focus.
- Ce qui fait 10 : un anneau de même forme sur tous les contrôles de l'en-tête.

## Fautes dures

Aucune.

## Fautes légères (à corriger, 2 lignes)

1. `menu-mobile-universel.tsx` l.82 : ajouter `font-medium` aux 8 entrées de l'espace (critère 4).
2. `en-tete-universel.tsx` l.67 : `focus-visible:rounded-lg` sur les liens de barre (critère 7).

## Pistes (ne retiennent pas les notes)

- Menu mobile dès 641 px : limiter la colonne et la ligne allumée (`md:max-w-md`) pour éviter la ligne allumée de 600 px.
- Menu mobile : monter « Mon profil » et « Déconnexion » au-dessus du pli à 375 x 812 (retirer 8 px de `pt-2` ou `my-2`).
- À 768 px, 32 px de plus entre logo et « Mon espace » (`md:ml-4` sur la nav abonné) pour s'accorder à 1024.

Limites : la capture gratuit sur /mon-espace est une page d'offre (menu sans bouton Premium), non jugée ; le menu du compte n'a pas été capturé sur /profil, son état « Mon profil » actif n'est donc pas évalué.

NOTE GLOBALE : 9/10
