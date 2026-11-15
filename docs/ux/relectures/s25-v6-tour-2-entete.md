# Relecture UX à l'aveugle, v6 tour 2 : en-tête, bande des rubriques, menu mobile, cloche, menu compte (+ dediees)

Captures : `docs/captures/s25/v6-tour-2/entete/` et `dediees/`. Comptes : visiteur, gratuit, en-cours, nouvel.
Ouvertes : accueil / vannes / mon-espace / profil (375, 768, 1280, 1456, 1920), bandeaux 290, 320, 440, 520, 640, 1024, 1280, menus mobiles (290, 320, 375, court), cloche (pleine et vide), menu compte (768, 1280), recherche ouverte (375, 1280), parcours clavier (focus 03, 07, 09 à 1280 ; dans-menu, retour-menu, dans-compte, dans-cloche), les 20 captures de dediees.

## Verdict : 9/10, aucune faute dure

Les décisions [CHOIX UTILISATEUR] sont respectées à la lettre : recherche de 176 px dont la position varie selon le compte (en-cours et nouvel : décalée par la cloche ; gratuit : par le bouton d'offre), cadenas de 14 px (nom « rubrique Premium » non vérifiable sur image, voir pistes), bande d'un seul niveau toujours affichée pour les 3 états, « … » (Mes questions + Mes répliques) fixé à droite.

## Grille

| Critère | Note | Preuve |
|---|---|---|
| D1 Fidélité à l'accueil | 10 | Pastille `rounded-xl` sombre, chip actif violet souligné, logo et bouton d'offre violets : même langue que l'accueil (visiteur-accueil-1456). Menus cloche et compte : filet dégradé violet en haut, comme les cartes. |
| D2 Hiérarchie, lisibilité | 9 | Rangée du haut (logo, recherche, offre, cloche, compte) nette, bande sous elle ; rubrique active seule en blanc + soulignement (lisible sans la teinte). Un seul bouton plein par vue. Retrait : voir P2. |
| D3 Mise en page aux 5 largeurs | 9 | 1280, 1456, 1920 : coque identique, bande entière, rien de tronqué, « Carnet » visible chez le visiteur (en-tête 1280, 1456 ; 1024 abonné). 768 et 1024 visiteur : défilement avec « Conse » / « Favo » coupés, c'est la spec. Pas de colonne collée à gauche. Vide entre « Carnet » et « … » à 1920 (~270 px) : voulu (plafond max-w-7xl, spec §1). |
| D4 Cohérence avec le reste | 10 | Même en-tête sur accueil, vannes, mon-espace, profil, aperçu ; menus ancrés sur le bord droit de la coque (1248 à 1280). |
| D5 Finition | 9 | Pastille visuelle 36 px dans une zone de 44 px (`h-11`, vu au code et conforme au brief), loupe, cloche, compte à 44 px. Anneau de focus violet bien visible partout. Retrait : P1. |
| U1 Compréhension | 10 | Je sais où je suis (chip allumé, titre de page) et la bande donne tout l'espace en 3 secondes. À /profil, l'icône du compte est allumée (en-cours 1920, gratuit-profil 1280). |
| U2 Action principale unique | 10 | Un seul bouton plein dans l'en-tête (Premium pour visiteur et gratuit, rien de plein pour l'abonné). Sur /abonnement : plus de bouton d'offre ni de bande (dediees, 375 et 1280). |
| U3 États vides, nouvel abonné | 10 | Cloche vide : « Rien de nouveau. Reviens quand tu veux. » avec « Fermer » (nouvel-cloche-vide-1280 et 290), pas de pastille violette ; cloche pleine : 2 entrées nommées avec chevrons. |
| U4 Aperçu Premium | 10 | Visiteur et gratuit voient les mêmes cadenas ; l'aperçu d'Aujourd'hui s'ouvre sur un exemple réel avec un seul bouton d'offre (gratuit-mon-espace-1920). Pas de mur, pas de fenêtre surgissante. |
| U5 Accessibilité, cohérence | 9 | Parcours clavier propre : l'anneau passe d'un chip à l'autre, le menu compte et la cloche rendent le focus sur chaque ligne (Déconnexion, « Le carnet du mois »). Cohérence visiteur/gratuit/abonné : seule la rangée du haut et les cadenas changent. Retrait : P3. |

Globale = minimum = **9/10**.

## Parcours à 3 secondes (cognitive walkthrough)

- Visiteur 375 : « Premium » + hamburger en haut, la bande défile avec le chip allumé centré (« S'entraîner 🔒 | Vannes | Conseils ») : je comprends le gratuit à droite du séparateur, les cadenas à gauche. OK.
- Menu mobile (375, 320, 290) : 3 à 5 lignes (recherche, offre, Connexion ou Mon profil, Déconnexion), plus aucune liste de liens du site ; la bande reste visible au-dessus. Le bouton passe en X, 44 px. OK.
- Fenêtre basse (dediees, 375 x 480) : bande masquée, rubriques dans le menu avec cadenas, page courante allumée (barre violette à gauche), rangée non collante. Le menu défile (la ligne suivante est coupée à moitié, signe de défilement). 1280 x 480 : même logique, bouton Menu présent à toutes les largeurs, offre et Connexion restent dans la rangée du haut. Conforme à la spec.
- Abonnement sans bande : conforme (375 et 1280, visiteur et gratuit), recherche conservée, compte visible chez le gratuit.

## Pistes (ne retiennent pas la note)

- **P1 (finition)** `entete/visiteur-vannes-290-bandeau.png` : à 290, un cadenas seul apparaît au bord gauche (le libellé « S'entraîner » est entièrement masqué, le cadenas reste). Allonger le fondu gauche pour qu'il couvre aussi le cadenas, ou masquer l'icône quand le libellé est hors vue. `apps/web/src/components/layout/bande-rubriques.tsx` (`fondus`, `placement-bande.ts`). Hors des largeurs de la grille (290 < 320).
- **P2 (hiérarchie)** `entete/visiteur-vannes-1024-bandeau.png` : « Favo » est coupé net contre « … » sans fondu visible (768 en montre un). Vérifier que le fondu droit de 32 px s'applique aussi à 1024 quand « … » est fixe à droite.
- **P3 (cohérence spec)** Favoris porte un cadenas pour le visiteur et le gratuit (6 cadenas), alors que `navigation-v6-menu-rubriques.md` §2 en prévoit 5 (« Favoris vit dans la bande, ouvert »). Le code (`rubriques.ts`, `estPremium`) documente l'arbitrage du 15/11 (`/favoris` réservé à l'abonné). C'est cohérent avec la vérité du produit, mais la spec doit être mise à jour. À l'inverse, Carnet n'a pas de cadenas alors que l'offre vend « chaque mois, un carnet de situations » : à confirmer par Thomas que `/carnet` est bien public.
- **P4 (preuve manquante)** Aucune capture du « … » ouvert (visiteur, gratuit, abonné) ni de son nom accessible « Plus » : demander une capture de ce menu (2 lignes avec cadenas pour le non-abonné) au prochain tour. Les captures `menu-situation-*` du visiteur échouent (menu introuvable) et le visiteur sur /profil est renvoyé vers la connexion sans en-tête : sans effet sur la note, mais ces cas ne sont pas relus.
- **P5 (hors périmètre, signalé)** `gratuit-mon-espace-1920.png` : dans l'aperçu d'Aujourd'hui, la carte de droite ne contient que le bouton Premium, avec un grand vide dessous. Sujet du groupe des pages d'aperçu. `gratuit-menu-situation-320.png` : le gratuit sur une fiche d'espace est amené à /abonnement (bande absente), ce qui est cohérent avec la spec mais à comparer avec la règle « aperçu, jamais de redirection » côté fiches.
- **P6 (ordre de tabulation)** Menu mobile ouvert : Tab passe d'abord par le panneau (recherche, offre, Connexion) puis par la bande (`visiteur-focus-dans-menu-375-12` = « Articles », la 9e rubrique après 3 lignes du panneau). L'ordre est logique, mais le panneau est visuellement sous la bande : à surveiller si on passe un jour à un panneau modal.

## Fautes dures

Aucune.

NOTE GLOBALE : 9/10
