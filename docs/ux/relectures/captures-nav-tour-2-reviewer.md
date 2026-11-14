# Relecture à l'aveugle des captures : navigation universelle s24, tour 2 (@reviewer)

Base : 41 captures lues image par image dans `docs/captures/s24-nav-universelle-2/` (36 ouvertes : 4 états, 375/768/1280,
menus ouverts, pages A/B/C, fiches ; 5 de `avant-apres-ferme/`), spec v5, `lib/fr-typo.ts`, `mon-espace/layout.tsx`.

**Note : 7/10. 3 fautes dures, 11 pistes.** Les 5 fautes dures du tour 1 sont corrigées à l'image. Le tour 2 en crée deux
(menu 375, pages vides) et en laisse passer une qu'il annonce corrigée (Bibliothèque).

## 1. Fautes dures du tour 1, vérifiées à l'image
| FD | Verdict | Preuve |
|---|---|---|
| FD1 cible 32 px | Corrigée | `visiteur-` et `inscrit-gratuit-menu-mobile-vannes-768.png` : bouton d'offre de y 418 à 462 = 44 px |
| FD2 apostrophes | Corrigée | `’` partout sur Aujourd'hui 1280, S'entraîner 1280/375, situation 1280, jeu 375, bilan 1280/375, `nouvel-abonne-mon-espace-375` |
| FD3 guillemets | Corrigée | bilan 1280 et 375 : « Après tout le monde, oui. … Tu me remercieras. » avec espace fine |
| FD4 cartes vides | Corrigée | Aujourd'hui 1280/768 : chapô du conseil (4 lignes) et vignette de la vidéo, grille `items-start` |
| FD5 critère 1 | Corrigée | 57 paires fermé, j'en ai lu 5 (en-tête premium 1280, menu 375, carnet 768, 404) : identiques |

## 2. Les 14 critères sur les images
1 vrai (en-tête, menu et 404 seulement, voir P5). 2 vrai : en-tête identique sur 9 pages abonné à 1280, 3 pages gratuit, 375.
3 vrai, sauf qu'à 375 « Articles » est caché (FD-A). 4 vrai : pages A à x 256, B/C à 32, haut de `/parcours` inchangé.
5 vrai pour l'index (Carnet à y 507), pas pour le site (FD-A). 6 vrai pour l'en-tête. 7 vrai en image (44 px), focus non capturé.
8 vrai : Vannes, La lettre (gratuit), icône compte (`/profil` gratuit et abonné), Parcours (bilan, `/parcours/repartie`),
« Quoi répondre » au menu sur une situation ; `/lettre` abonné non capturé. 9 non vérifiable en image. 10 vrai : offre aux
3 largeurs (visiteur, gratuit), accueil abonné 1280 sans achat. 11 vrai, sans focus ni 1024 à 1279. 12 NON FAIT. 13 vrai.
14 vrai à la lettre (P7).

## 3. Fautes dures nouvelles
**FD-A. À 375 px, la barre collée « Mon profil · Déconnexion » cache « Articles ».** `abonne-en-cours-menu-mobile-mon-espace-375.png`,
`…-fiche-situation-coloc-la-poele-375.png`, `nouvel-abonne-menu-mobile-mon-espace-375.png` : Vidéos à y 716, barre à y 735, plus
d'Articles, sans signe de défilement (au tour 1, Articles était visible). C'est la première porte Google (spec §2).
Correction : à 812 px, un tout-en-un ne tient pas (530 + 5 liens ≈ 790, plus la barre ≈ 60). Retirer la barre collée, mettre
« Mon profil » en icône dans la ligne du haut du menu ouvert (à côté de la cloche), et « Déconnexion » à la suite d'Articles.
À défaut : `pb` du défilement égal à la hauteur de la barre et un dégradé au-dessus de la barre.

**FD-B. Les pages vides poussent le pied hors de l'écran.** `nouvel-abonne-mon-espace-repliques-1280.png`, `abonne-en-cours-mon-espace-lettres-1280.png`
et `-375.png`, fiche humour noir 1280 : environ 515 px de noir sous une seule carte, le pied commence pile à 900 (812 à 375) et la
page défile pour rien. Cause : `app/(dashboard)/mon-espace/layout.tsx:37` `min-h-[calc(100dvh-8.0625rem)]`. Correction : retirer ce
`min-h` ; pied collé en bas par `flex min-h-dvh flex-col` sur la coque et `flex-1` sur `main` (interrupteur ouvert seulement).

**FD-B2. Bibliothèque : « Vocabulaire : » répété 8 fois.** `abonne-en-cours-mon-espace-bibliotheque-1280.png` et `-375.png` (à 375,
le préfixe fait passer 2 lignes sur 2). L'INDEX dit « préfixe répété » corrigé, et « Comment c'est construit » n'a pas de préfixe.
Correction : quand la carte porte le préfixe en titre, le retirer de chaque ligne à l'affichage, avec une majuscule : « Quand on te
lance une pique ».

## 4. Pistes
- P1 Aujourd'hui 768/1280 : 76 px vides au-dessus du H1 (place réservée au « Retour », qui n'y est pas). On dirait un bug.
- P2 Jeu 375 : la surtitre « JEUX » passe sous le H1, entre le titre et « 5 min ». Écrire « Jeux · 5 min » ou la remonter.
- P3 Filet `border-t` orphelin en haut des cartes « À toi » (situation 1280 y 664, bilan, jeu 375), persistant.
- P4 Fiche humour noir sans H1 (absente de la colonne « Haut du H1 »), persistant.
- P5 Les paires fermé ne couvrent que l'en-tête, le menu et la 404 ; ajouter `/favoris`, `/carnet`, `/vannes` en page entière (gabarits « ouvert seulement »).
- P6 Extrait du conseil coupé au milieu d'un mot (« ralentit ava… », `nouvel-abonne-mon-espace-375`) : couper à la phrase.
- P7 Vidéo du jour à 768 sur 2 colonnes : vignette de 553 x 310, plus lourde que l'action du jour ; `max-w-md`.
- P8 Deux espaces avant « : » et dans « » : fine dans l'espace, insécable pleine sur favoris, carnet, parcours ; la même phrase
  « Après tout le monde… » diffère entre le bilan et le quiz de `/parcours/repartie`.
- P9 « Le carnet du mois » en tête de Quoi répondre (1280, 375) : doublon de l'entrée Carnet de l'index (spec §4).
- P10 Mes favoris 375 : onglet « Vidéos » coupé en « Vid› » ; trou du bouton d'offre dans la barre du menu ouvert à 768 (persistant).
- P11 Sorties d'état vide de deux styles (lien « Aller à Aujourd'hui » contre bouton) ; « Cohen - Serge » contre « – » à l'accueil.

Rien à signaler : tirets cadratins, accents, majuscules, apostrophes de l'espace et de l'accueil abonné.
