# Relecture UX à l'aveugle, s25, en-tête et menu mobile, tour 5

Relecteur : @ux, seul, sans lire de relecture précédente. Sources : spec `docs/ux/navigation-universelle-s24.md` v5, `docs/founder-preferences.md` l. 191-193, code (`en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `cloche.tsx`, `cloche-lignes.tsx`, `espace-navigation.ts`, `tailwind.config.ts`), étalon `docs/captures/s25/etalon-accueil/` (375 et 1280 ouverts), captures `docs/captures/s25/entete-tour-5/`.

Captures ouvertes (liste non exhaustive, tout ce qui est cité ci-dessous a été vu) : menu abonné 375 et 320 (Mon espace, Vannes, Profil, situation), menu gratuit 375 (Vannes) et 320 (Profil), menu visiteur 320 (Vannes) et 768 (accueil), menu abonné 768 (Mon espace), cloche pleine abonné 375, 320, 1280, cloche vide 375 et 768, compte ouvert sur /vannes et /profil à 1280 (abonné), compte gratuit sur /profil 1280, compte nouvel 1920 sur /vannes, bandeaux abonné 1280 (Vannes, Profil), 1920, 1024 (Profil), 600 ; gratuit 440, 768, 1024 ; visiteur 320, 520, 640, 641, 1024, 1280 ; nouvel 320 et 1280 ; focus clavier abonné 1280 (03), 768 (06), 375 (02), gratuit 375 (03), visiteur 768 (05).

## Écarts à la spec constatés : aucun

Pas de faute dure. Vérifié :
- Largeurs : 320 à 439 px visiteur et gratuit logo + bouton d'offre court + Menu, abonné logo + cloche + Menu (capture nouvel 320) ; 440 : loupe ; 520 : « Connexion » ; 600 abonné : logo, loupe, cloche, Menu, sans compte ; 640 et 641 visiteur : libellé complet, rien ne déborde ; 768 : « Mon espace » en barre, compte dès 768, liens du site absents de la barre (spec) ; 1024 : liens + loupe, bouton court ; 1280 et 1920 : champ de 176 px, coque centrée sur 1216 px, logo sur la verticale du contenu.
- Menu abonné 375 et 320 : recherche, « Mon espace » puis les 8 entrées, séparateur, Parcours à Articles, séparateur, Mon profil ; les 8 rubriques sont visibles sans défilement (812 px de haut) ; Déconnexion sous le pli, permis par le critère 5.
- Ligne allumée : Vannes (liens du site), Mon espace seul sur Aujourd'hui, Quoi répondre sur la fiche situation (ligne de la rubrique, parent « Mon espace » reste en blanc semi-gras), Mon profil sur /profil.
- 768 abonné : intitulé « Mon espace » non cliquable, 8 entrées gardées.
- Cloche : point violet sur la cloche seule, absent pour le nouvel abonné vide, panneau à 8 px sous le filet, pleine largeur de coque sous 768, 320 px dès 768, « Fermer » visible.
- Compte : abonné = Mon profil + Déconnexion, gratuit = Favoris + Mon profil + Déconnexion, ligne de la page en cours allumée.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité à la spec v5 | 10/10 |
| 2 | Orientation | 10/10 |
| 3 | Menu mobile | 10/10 |
| 4 | Cloche et compte | 10/10 |
| 5 | Charge cognitive et cohérence | 10/10 |
| 6 | Largeurs extrêmes, 440-767, 1024-1279 | 10/10 |
| 7 | Accessibilité visible | 10/10 |

### 1. Conformité : 10
Chaque ligne de §1 se retrouve à l'écran (3 états x largeurs vues), y compris le cas serré 640/641 visiteur. Le bouton d'offre disparaît de la barre menu ouvert sous 1024 px et revient dans le menu : choix de code, aucune contradiction avec la spec (un seul bouton à l'écran).

### 2. Orientation : 10
Page en cours toujours lisible sans la teinte : barre = fond élevé + soulignement 2 px + texte ; icône compte sur /profil = fond + soulignement ; menu = filet gauche 2 px + semi-gras + fond ; compte ouvert = ligne avec filet. Pages sans rubrique (accueil) : rien d'allumé, conforme. Sur /vannes l'abonné voit Vannes allumé en barre et dans le menu, Mon espace non allumé : cohérent.

### 3. Menu mobile : 10
2 touchers (Menu, ligne) sans défilement pour les 8 rubriques à 375 et 320 ; ordre unique pour les trois comptes ; hiérarchie nette (parent semi-gras blanc, rail `ml-3`, entrées `pl-6` en secondaire, séparateurs 1 px) ; ligne allumée sans saut de texte (filet transparent réservé). Fermeture : croix, voile, Échap, focus rendu au bouton (code).

### 4. Cloche et compte : 10
Ouvert (fond élevé, pas de soulignement) distinct d'actif (soulignement) sur cloche et compte, vu à 1280 et 375. État non lu : point violet + nom accessible (`nomCloche`). Vide : phrase « Rien de nouveau. Reviens quand tu veux. », cloche sans point, vu à 375 et 768. Fermer : Fermer, Échap, clic dehors (Radix). Aucune page « active » pour la cloche, conforme (point violet = seul signal).

### 5. Charge cognitive et cohérence : 10
Barre abonné : 3 groupes (navigation, recherche, cloche/compte) ; mêmes x pour le logo et le premier lien d'un compte à l'autre ; mêmes composants du menu à toutes les pages. Aucune seconde barre. Aucun lien deux fois (Connexion, actions du compte, Mon espace se relaient par largeur).

### 6. Largeurs extrêmes et plages : 10
Aucun libellé coupé ni débordement sur les 12 largeurs que j'ai pu voir en bandeau (320, 375 vus à travers les menus, 440, 520, 600, 640, 641, 768, 1024, 1280, 1920). 1024-1279 : bouton court, recherche en loupe, tenue avec marge. 440-767 : tout conforme au §1. Panneau de cloche à 320 : lisible, 2 lignes de texte, pas de débordement.

### 7. Accessibilité visible : 10
Cibles : tous les contrôles à 44 px (`h-11 w-11`, `min-h-11`). Focus : anneau violet 2 px arrondi sur logo, liens de barre, Menu, cloche, compte (captures 1280, 768, 375). Contrastes calculés depuis le thème : texte secondaire #B3B3B3 sur #0D0D0D ≈ 9,3:1 ; accent-link #A78BFA sur élevé #2A2A2A ≈ 5,3:1 ; sur carte #1F1F1F ≈ 6,0:1 ; muted #9A9A9A sur élevé ≈ 5,1:1 ; soulignement et anneau #8B5CF6 sur élevé ≈ 3,4:1 (non-texte, seuil 3:1), sur fond de page ≈ 4,6:1. État actif visible sans la teinte : oui (forme, graisse, soulignement, filet).

## Pistes (aucune ne retient une note)

Aucune faute dure. Les points ci-dessous sont facultatifs ; certains touchent la spec et ne sont donc pas des défauts.
1. Déconnexion sous le pli à 375 x 812 (et Mon profil sous le pli à 667) : spec critère 5 l'autorise ; un indice de défilement (dégradé bas du panneau) serait un plus, à décider par Thomas, pas un manque. Aucun nouveau texte.
2. Preuves manquantes dans le lot, non-défauts : aucun focus clavier dans les lignes du menu mobile ni dans le panneau de la cloche (le code porte `ring-2 ring-inset` et `focus-visible:ring-accent-link`), aucune capture à 568 px de haut (la spec calcule 38 px libres). À ajouter au prochain lot de captures.
3. Le bouton d'offre quitte la barre quand le menu s'ouvre (sous 1024) : léger saut de « Connexion » vers la droite à 768 pour le visiteur. Choix assumé par le code (relecture design F4) ; ne pas toucher sans nouvelle capture.
4. Le fond de survol du compte (`border-hover` #3A3A3A) n'a pas été mesuré à la souris : non vérifiable sur des captures statiques.

Verdict : GO, section 1 (en-tête et menu mobile) au niveau de l'étalon. Aucun fichier de code à corriger.

NOTE GLOBALE : 10/10
