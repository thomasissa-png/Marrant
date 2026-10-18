# Revue visuelle s21 : audit et corrections (ordinateur et mobile)

> Demande de Thomas (18/10) : « des écarts comme ici […] il faudrait vraiment que tout soit revu proprement », « sur PC et mobile », « c'est le cas sur toutes les pages d'ailleurs ».
> Matrice : 27 vues × 3 profils × 4 largeurs (375, 768, 1 280, 1 440), build de production local, base jetable. Index : `index-captures.md`.
> Contrainte : aucun mot de texte modifié (textes validés à l'aveugle, `docs/copy/cta-s21/concision/VALIDE.md`), ni couleur de marque ni typographie.

## 1. Cause commune

Le site n'avait pas de gabarit de colonne : chaque composant fixait sa propre largeur. Relevé dans le code (`max-w-*` hors admin) et mesuré sur les captures à 1 280 px (colonne de la coque : 16 → 1 264 px) :

| Largeur | Où | Alignement |
|---|---|---|
| 1 248 (`max-w-7xl`, coque) | grilles /vannes, /videos, /blog, /profil, « Explore aussi », nav du glossaire | gauche |
| 896 (`max-w-4xl`) | liste /conseils, définitions du glossaire, /parcours, /quiz-humour | gauche ou centré selon la page |
| 768 (`max-w-3xl`) | FAQ des listes, article, fiche vidéo, parcours, à propos, pages légales | gauche ou centré selon la page |
| 672 (`max-w-2xl`) | fiches vanne et conseil, carnet, /abonnement, /lettre, carte Premium et FAQ de l'accueil | centré |
| 576 (`max-w-xl`) | mur des listes (`MurListe`), « Reprendre ton parcours » de l'accueil | **centré dans une colonne alignée à gauche** |
| 512 (`max-w-lg`) | quiz de /quiz-humour, bouton du bloc d'exercice des fiches | centré |

Conséquences visibles partout : sur une même page, trois bords droits différents (ex. /conseils : liste 912, FAQ 784, « Explore aussi » 1 264) ; des cartes d'appel plus étroites et décalées (mur des listes) ; d'une fiche à l'autre, la colonne change de largeur (vanne 672, vidéo 768) ; à 768 px, marges de 48 px sur certaines pages et 16 px sur d'autres.

## 2. Gabarit retenu (une règle pour tout le site)

Fichier unique : `apps/web/src/components/layout/gabarit.ts`.

1. **Coque** : en-tête, contenu et pied sur `max-w-7xl px-4` (inchangé).
2. **Pages catalogue** (/vannes et thèmes, /conseils, /videos, /blog, /glossaire, /profil, /favoris) : tout bloc prend **la pleine colonne** (liste, mur, cartes floutées, FAQ, « Explore aussi »). Seul le texte courant garde une mesure de lecture (`max-w-3xl`, aligné à gauche).
3. **Pages de lecture** (fiches vanne, conseil, vidéo ; article ; /parcours et parcours ; carnet ; à propos ; lettre ; /abonnement ; /quiz-humour ; anatomie ; blague du jour ; pages légales) : **une colonne centrée `max-w-3xl` (768 px)**, et tous les blocs de la page en prennent toute la largeur.
4. **Formulaires seuls** (/login, /register, mot de passe) : carte centrée `max-w-md` (inchangé) ; parcours d'accueil du compte (`/onboarding`) inchangé.
5. **Bloc d'appel** (mur des listes, bloc d'exercice des fiches, appel du carnet, démonstration et fin d'article, fin de glossaire et d'à propos) : un seul style, `BLOC_APPEL` : carte bordée, contenu aligné à gauche, titre, bouton plein à la largeur de son texte dès 640 px (pleine largeur dessous), REASS dessous, lien gratuit ensuite. La phrase de limite des murs est **dans** la carte, en tête.
6. **Carte floutée des murs** : toujours une seule (concision v5), sur toute la colonne de la liste, comme le mur au-dessus ; plus de carte seule dans une demi-rangée vide.
7. **FAQ** : accordéon commun (`FaqSection`) sur les pages catalogue, d'offre, de parcours et le quiz ; questions-réponses ouvertes dans les pages de lecture longue (article, à propos).
8. **Accueil** : grilles sur la pleine colonne ; blocs centrés (carte Premium, FAQ) sur la colonne de lecture ; le bloc « Reprendre ton parcours » garde la composition du haut de page.
9. **Cibles tactiles** : 44 px de haut sous 768 px pour tout champ, bouton et lien isolé.

## 3. Défauts relevés

Gravité : **M** majeure (se voit au premier coup d'œil, fait « pas pro »), **m** moyenne, **f** faible.

Relevé sur les 270 captures « avant » (lues une à une pour les pages et largeurs clés, et mesurées pour toutes : position et largeur de chaque bloc, cibles tactiles, débordements ; script de mesure dans le rapport de session). Captures citées : `avant/<nom>.png` et `apres/<nom>.png`.

**Total : 27 défauts relevés, 23 corrigés (8 M, 9 m, 6 f), 4 non corrigés (section 5).**

## 4. Avant / après, défaut par défaut

| # | Grav. | Capture(s) | Avant | Après |
|---|---|---|---|---|
| D01 | M | `conseils-visiteur-1280` (capture de Thomas), `vannes-*-768/1280/1440`, `videos-*-768/1280/1440` (visiteur, gratuit) | Mur des listes (`MurListe`) centré sur 576 px sous une liste alignée à gauche : plus étroit, décalé à droite (352 → 928 sous une liste 16 → 912 ou 16 → 1 264). | Mur sur la colonne de la liste (16 → 1 264 à 1 280 ; 16 → 359 à 375), même cadre que les autres blocs d'appel. Test Playwright `local/mur-alignement-s21.spec.ts`. |
| D02 | M | mêmes captures, toutes largeurs (dont 375) | « 3 conseils gratuits, c'est fait. » flotte seule à gauche, à égale distance de la liste et de la carte. | La phrase est dans la carte, en tête, au-dessus du titre (rattachée). |
| D03 | M | `vannes-visiteur-1280`, `videos-visiteur-1280`, `conseils-visiteur-1280` | Carte floutée : demi-rangée sur /vannes, tiers de rangée sur /videos (reste de la rangée vide), 896 px sur /conseils ; trois largeurs différentes de celle du mur. | Une seule carte (concision v5 conservée), sur toute la colonne, mêmes bords que le mur et la liste ; sur /videos, vignette à gauche dès 768 px. Cadenas de la même couleur sur les trois murs (D13). |
| D04 | M | `conseils-*-1280`, `vannes-*-1280`, `videos-*-1280` | Trois bords droits sur /conseils (liste 912, FAQ 784, « Explore aussi » 1 264) ; deux sur /vannes et /videos (grille 1 264, FAQ 784). | Un seul bord : liste, mur, carte floutée, FAQ et « Explore aussi » de 16 à 1 264. Mesure : captures à bords multiples à 1 280 px, 24 avant, 3 après (les 3 restantes : grilles voulues de l'accueil). |
| D05 | M | `parcours-*-1280`, `parcours-orientation-resultat-*-1280` | Colonne de 896 px centrée, FAQ de 768 px alignée à gauche dedans : bord droit cassé sous les cartes de parcours. | Colonne de lecture de 768 px (256 → 1 024), quiz, parcours, « Explore aussi » et FAQ sur les mêmes bords. |
| D06 | M | `glossaire-*-1280`, `glossaire-*-1440` | Définitions sur 896 px, index, « Passe de la théorie à la pratique » et bloc final sur 1 248 px. | Tout sur la pleine colonne ; le texte des définitions garde sa mesure de lecture. |
| D07 | M | `quiz-humour-*-1280` | Quiz centré sur 512 px, puis sections centrées sur 896 px : deux colonnes de largeurs différentes. | Quiz, sections et FAQ sur la même colonne de 768 px. |
| D08 | M | `vanne-fiche-*`, `conseil-fiche-*`, `video-fiche-*`, `carnet-*`, `abonnement-*`, `lettre-*` (768, 1 280, 1 440) | Fiches vanne et conseil sur 672 px, fiche vidéo sur 768 ; carnet, /abonnement, /lettre sur 672, article, parcours, à propos sur 768 : la colonne change de largeur d'une page à l'autre ; à 768 px, marges de 48 px sur les unes, 16 sur les autres. | Une colonne de lecture unique de 768 px pour toutes ces pages (et pages légales, anatomie, blague du jour, erreurs) ; à 768 px, marges de 16 px partout. |
| D09 | m | `glossaire-*-1280`, `a-propos-*-1280` | Blocs de fin de page centrés (titre, bouton, REASS au milieu) alors que murs, fiches et fin d'article sont alignés à gauche. | Même bloc d'appel partout (`BLOC_APPEL`) : contenu aligné à gauche, même ordre titre, bouton, REASS, lien. |
| D10 | m | `vanne-fiche-visiteur-1280`, `carnet-visiteur-1280`, `vannes-visiteur-1280`, `blog-article-premium-375` | Bouton plein des blocs d'appel en trois largeurs : 512 px fixes (bloc d'exercice des fiches), largeur du texte (murs, article), pleine largeur (carnet) ; bouton « Continuer mon parcours » de l'abonné jamais pleine largeur sur mobile. | Une règle (`BOUTON_BLOC_APPEL`) : pleine largeur sous 640 px, largeur du texte au-delà, aligné à gauche. |
| D11 | m | `carnet-*-1280`, `carnet-*-375` | Appel du carnet en carte violette arrondie 2xl, REASS centrée : seul bloc d'appel de ce style. | Même cadre neutre et même REASS (alignée, couleur des autres) que les murs et les fiches. |
| D12 | m | `quiz-humour-*`, `conseils-*`, `videos-*` vs `vannes-*`, `parcours-*` | FAQ en trois styles : accordéon (vannes, parcours, accueil, abonnement), cartes toujours ouvertes (conseils, vidéos), triangles natifs du navigateur et cibles de 26 px (quiz). | Accordéon commun (`FaqSection`) sur toutes les pages catalogue, le quiz, l'accueil, l'abonnement et les parcours ; questions-réponses ouvertes gardées dans les articles et l'à propos (pages de lecture, test `blog-article-cta-position`). Contenu toujours dans le DOM (SEO). |
| D13 | m | `vannes-visiteur-1280` vs `conseils-visiteur-1280` | Cadenas des cartes floutées violet clair sur /vannes, violet foncé (contraste plus faible) sur /conseils et /videos. | Même violet clair (`accent-link`) sur les trois. |
| D14 | m | `accueil-premium-1280`, `accueil-premium-375` | Deux boutons voisins de même rôle : « Explorer les vannes » à bordure violette surchargée localement, « Voir les conseils » à bordure grise. | Les deux en variante niveau 2 du design system (`outline-accent`), plus de surcharge locale. |
| D15 | m | `blog-*-768/1280/1440` | 25 articles en 2 colonnes : dernière rangée à moitié vide. | Une dernière carte seule prend la rangée entière (règle CSS, vaut aussi pour les filtres). |
| D16 | m | `accueil-*-1280` (« Conseil du jour ») | « La pause et le silence » / « : tes meilleurs alliés » : deux-points en début de ligne (espace normale avant « : » dans le titre en base). | Espace insécable posée à l'affichage (`frTypo`) sur les titres de conseils (accueil, liste, fiche, favoris) et les amorces de vannes : plus de ponctuation orpheline. Aucun mot changé. |
| D17 | m | (hors matrice : /cgu, /confidentialite, /mentions-legales, /retractation ; vérifié dans le code) | Pages légales en colonne de 768 px collée à gauche, les autres pages de lecture centrées. | Centrées sur la colonne de lecture. |
| D18 | f | `login-visiteur-375`, `register-visiteur-375`, `menu-mobile-*-375`, `profil-*-375` | Champs et boutons de taille `md` à 40 px de haut sur mobile (e-mail, mot de passe, recherche du menu, prénom, « Continuer avec Google »). | 44 px sous 768 px (même règle que la taille `sm` existante), 40 px au-delà. |
| D19 | f | `vanne-fiche-*-375` | Boutons « Partager », « Copier le lien », « X / Twitter », « WhatsApp » à 38 px. | 44 px. |
| D20 | f | `vanne-fiche-*-375`, `conseil-fiche-*-375`, `video-fiche-*-375` | Liens « ← Toutes les vannes… » à 17 px de haut. | 44 px. |
| D21 | f | `glossaire-*-375` | Liens « … → » des définitions à 20 px. | 44 px (espacement visuel inchangé). |
| D22 | f | `accueil-*-375` | Réactions 🔥 / 💀 de la vanne du jour à 24 px, voisines de boutons de 44 px ; liens d'exemple des cartes « Trois outils » à 28 px. | Zone tactile de 44 px (pseudo-élément pour les réactions, pastille inchangée ; marge interne pour les exemples). |
| D23 | f | `login-visiteur-375`, `register-visiteur-375`, toutes pages | Logo de l'en-tête et des cartes de connexion à 24 px de haut ; « Mot de passe oublié ? » à 17 px. | 44 px. |

Cibles tactiles sous 44 px de haut relevées à 375 px (toutes pages, 3 profils) : **199 avant, 52 après** (dont les réactions, dont la zone de 44 px est portée par un pseudo-élément que la mesure ne voit pas, et les cas de la section 5).

## 5. Non corrigés (et pourquoi)

| # | Grav. | Capture | Défaut | Raison |
|---|---|---|---|---|
| N1 | m | `accueil-*-1280`, `accueil-*-375` | « Ton contenu du jour » : la carte « Vanne du jour » est bien plus courte que ses voisines, vide dessous. | Choix de design documenté dans le code (« grille sans étirement », design T9) ; à trancher par @design (étirer les cartes déplace le vide dans la carte). |
| N2 | f | `conseils-*-375`, `videos-*-375` | Titres-liens des cartes de liste à 21-28 px de haut. | Agrandir leur zone empiéterait sur le geste de la carte (clic = déplier le conseil) ; la carte entière reste une grande cible. À revoir avec @ux. |
| N3 | f | `parcours-repartie-fin-etape1-*-375` | Fin d'étape 1, lettre dépliée : la ligne « Lettre gratuite… » passe à gauche à 375 px sous un bloc centré, bouton d'envoi en lien. | Choix QA v4 m-7 (ligne repliée identique au pixel près avant et après dépliage, bouton discret « un seul plein par bloc ») ; testé tel quel. |
| N4 | f | `vanne-fiche-visiteur-1280` | « Pourquoi ça marche » : tiret cadratin (« — elle le partage ») et apostrophes droites ('On a tous…'). | C'est du texte (contenu en base) : aucun mot ne change dans cette passe. À corriger par @copywriter / donnée. |

## 6. Vérifications

- Build de production local, base PostgreSQL 16 jetable, comptes de capture ; aucun accès à la production.
- `npx tsc --noEmit -p tsconfig.build.json`, `npx tsc --noEmit`, `npx next lint`, `npm run build`, Jest complet (5 246 tests) : verts, en `env -i` avec les variables factices de `.github/workflows/tests.yml`.
- Playwright contre le build : projet `local` 60/60 (dont `mur-alignement-s21.spec.ts`, 6 cas : bord gauche et largeur du mur = liste, limite dans le mur, carte floutée alignée, à 375 et 1 280 px) ; smoke desktop + iPhone 13 : 128 passés, 2 sautés (prévus).
- Textes : diff relu ligne à ligne, aucun libellé modifié (seules classes, structure de mise en page et insécables de `frTypo`).
