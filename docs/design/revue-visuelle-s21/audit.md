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

## 7. Tour 2 : verdict @design (7,5/10, 31 défauts), corrections

Verdict : `verdict-design.md`. Captures : `apres-v2/` (mêmes noms) et `apres-v2/sections/` (découpes par écran à 375 px). Aucun mot de texte modifié ; seuls changent la mise en page et l'affichage typographique (décision 4).

**Bilan : 31 défauts, 26 corrigés, 1 déjà conforme (vérifié à la mesure), 4 corrigés en partie (raison ci-dessous).**

| # | Grav. | Statut | Correction (fichiers) |
|---|---|---|---|
| R01 | B | corrigé | /conseils en 2 colonnes dès 1 024 px, cartes `h-full flex-col`, pied en `mt-auto`, dernière carte seule sur toute la rangée (texte borné à 768 px) ; 1 colonne dessous (`conseils-list.tsx`). Test `local/grilles-s21.spec.ts`. |
| R02 | B | corrigé | /favoris : vidéo sur toute la rangée, vignette à gauche bornée à 420 px, texte `max-w-prose` ; vannes et conseils en 2 colonnes, dernier seul sur la rangée (`favoris-list.tsx`). Test `local/grilles-s21.spec.ts`. |
| R03 | M | corrigé | Une seule pastille (`chipClass`) pour vannes, conseils, vidéos ; sous 768 px une ligne qui défile avec fondu à droite, au-delà retour à la ligne (`ui/chip.ts` : `RANGEE_CHIPS`). |
| R04 | M | corrigé | /vannes abonné : pages thème masquées (une seule rangée, celle des filtres) ; le HTML serveur les garde pour les moteurs (`vannes/page.tsx`). |
| R05 | M | corrigé | /videos : dernier encadré étiré, bas alignés ; fiches « même thématique » `auto-rows-fr` + `h-full` ; accueil (R11). Mesure : 0 rangée de blocs de hauteurs inégales sur les 276 captures. |
| R06 | M | corrigé | Marge interne unique `p-5 md:p-6` (blocs d'appel et encadrés des fiches) ; le lien gratuit final ne double plus la marge basse (`gabarit.ts`, fiches, `fiche-parcours-lien.tsx`). |
| R07 | M | corrigé | Bouton à prix sur une ligne à 375 px (15 px, marges de 12 px sous 400 px : `BOUTON_PRIX_UNE_LIGNE`) sur /abonnement, accueil, résultat d'onboarding ; /register : `min-h-12 py-3 leading-5` équilibré. Libellés inchangés. |
| R08 | M | déjà conforme | Étoile et partage : bouton de 44 px, pastille de 32 px (déjà) ; boutons de profil et pagination : 44 px sous 768 px (taille `sm`). Mesuré : plus aucune cible sous 44 px sur les pages publiques à 375 px, hors réactions (zone de 44 px par pseudo-élément) et case de la lettre (dans un libellé de 44 px). |
| R09 | M | corrigé | Décision 3 : ligne « Lettre gratuite… » centrée, formulaire en colonne centrée de 448 px, envoi en bouton contour pleine largeur (`lettre-inscription.tsx`, `lettre-repliee-style.ts`). |
| R10 | M | corrigé | Carte floutée commune aux trois murs : bordure pleine, 96 px, dégradé, deux barres, cadenas centré, plus de grand carré de vignette (`premium/carte-floutee.tsx`). |
| R11 | M | corrigé | Décision 1 : cartes du jour étirées, même haut et même bas, pied d'actions commun (filet, `mt-auto`), amorce en 20 px, « Révéler la chute » en bouton contour pleine largeur (`daily-content.tsx`). |
| R12 | M | corrigé | Partage des fiches vanne en 2 x 2 sous 640 px (`vanne-share-row.tsx`). |
| R13 | M | corrigé | Exemple concret : une ligne par paragraphe, 16 px, ligne « Total » sous un filet (`conseils/[slug]/page.tsx`). |
| R14 | M | corrigé | Admin : onglets en 2 x 2 sous 640 px, 4 colonnes au-delà, 44 px (`app/admin/page.tsx`, sous-onglets `abonnes-tab.tsx`). |
| R15 | M | corrigé | Admin « Semaine » : libellé puis valeur à gauche, segments « a \| b » chacun d'un tenant (`admin-ui.tsx` : `LignesEmpilees`). |
| R16 | M | corrigé | Résultat d'onboarding : « Ton parcours » à gauche, groupe d'action centré, marge basse = haute (`humor-quiz.tsx`). |
| R17 | f | corrigé | /abonnement : écart de section unique `mt-12 md:mt-16` (carte, carnet, FAQ) ; pastille « mois offerts » à droite de « Annuel » dès 640 px, dessous en mobile pour garder Mensuel et Annuel sur une ligne (`plan-selector.tsx`). |
| R18 | f | corrigé | Pied de page à 768 px : colonne marque plus large, Produit sur 2 colonnes (`footer.tsx`). |
| R19 | f | corrigé | Connexion, inscription, mots de passe : logo centré, même gabarit vertical (haut à 32 px sur mobile, centré dès 640 px). L'ordre de « Continuer avec Google » reste un choix de parcours (@ux). |
| R20 | f | corrigé | Captures sans en-tête figé (pleine page depuis le haut, en-tête collant neutralisé pour la capture seulement). |
| R21 | f | en partie | Marge basse de la feuille Premium `max(1,5rem, safe-area)`. Le bouton fermer est déjà à `top-3 right-3` dans la feuille : rien à déplacer. |
| R22 | f | en partie | Voile `bg-black/60` sous le menu mobile ouvert (un toucher ferme), un seul bouton prix (celui de l'en-tête est masqué, sa place gardée). Panneau à hauteur de son contenu (le voile couvre le reste) plutôt que sur 100 dvh. |
| R23 | f | corrigé | Profil : appel du bloc Abonnement pleine largeur sur mobile ; pastille de série en coins de 16 px. |
| R24 | f | corrigé | Admin lettre : fiches en `dl` 2 colonnes, libellé au-dessus de la valeur. |
| R25 | f | corrigé | Admin comptes : « Sync Stripe » en bouton de 44 px ; colonne « Dernière activité » masquée tant qu'aucun compte n'en a. |
| R26 | f | en partie | Marges de 32 px dès 1 280 px pour l'en-tête, le contenu et le pied (contenu de 1 216 px). Pas de `sm:px-6 lg:px-8` : le budget de l'en-tête de 640 à 1 279 px n'a pas la place (« Premium · 2,99 €/mois » + « Connexion » + loupe mesurés à 590 px à 640). `header-budget` vert. |
| R27 | f | en partie | Décision 4 : `frTypo` étendu (apostrophe typographique, guillemets droits en « », tiret cadratin en virgule, insécables), test `lib/fr-typo-affichage-s21.test.ts` ; appliqué aux contenus de la base (vannes, « Pourquoi ça marche », décryptages des vidéos, conseils, FAQ, vanne du jour, favoris). Reste en apostrophes droites : le texte écrit en dur dans les pages (à propos, accroches des parcours, « Comment la ressortir »…), à passer à la source dans un lot texte dédié. |
| R28 | f | corrigé | Carnet : cadenas centré sur la carte. |
| R29 | f | corrigé | Accueil : deux niveaux de titre (sections en 3xl/4xl ; « Derniers articles », FAQ, lettre en xl/2xl). |
| R30 | f | corrigé | Index du glossaire : fondu de 24 px à droite et défilement par crans sous 1 024 px. |
| R31 | f | corrigé | Glossaire : définitions en 2 colonnes dès 1 024 px, cartes de même hauteur, lien en pied, comme /conseils. |

**Écart à une décision, avec raison.** Décision 2 sur /conseils (lien étendu à toute la carte) : appliquée en cible de 44 px sur le titre seulement, comme sur /videos. Le clic sur la carte déplie le conseil sur place et compte la lecture (10 XP pour un compte) ; un lien étendu supprimerait ce dépliage et cet XP, ce qui sort d'une passe de mise en page. À trancher par @ux si le dépliage doit disparaître.

**Section 5 du verdict (texte).** Le tiret cadratin de « Pourquoi ça marche » est retiré à l'affichage (règle 12, `stripEmDashes` puis `frTypo`) ; la passe @copywriter par phrase reste recommandée. Le tiret demi-cadratin des titres vidéo et les extraits tronqués ne sont pas touchés (texte).

**Vérifications (tour 2).** `env -i` + variables factices de `tests.yml` : `tsc` x2, `next lint`, `next build`, Jest complet (5 277 tests, dont 69 attentes ajustées à l'apostrophe typographique et le nouveau test `frTypo`). Playwright contre le build : `local` 62/62 (dont `grilles-s21` R01/R02 et `mur-alignement-s21`), smoke desktop + iPhone 13 : 128 passés, 2 sautés prévus. Mesures sur les 276 captures : aucun débordement horizontal, aucune rangée de blocs de hauteurs inégales.

## 8. Tour 3 : verdict @design (8,7/10, 4 majeurs, 12 mineurs), corrections

Captures : `apres-v3/` (matrice complète, mêmes noms que `apres-v2/`), découpes à 375 px des pages de plus de 5 000 px dans `apres-v3/sections/`.

**Règle commune aux trois murs (T2-01, T2-03).** Une dernière carte seule sur sa rangée ne laisse plus de demi-rangée vide : elle prend la rangée entière en disposition horizontale (titre et méta à gauche, contenu à droite), sans changer de hauteur de lecture.

| Id | Statut | Correction |
|---|---|---|
| T2-01 | corrigé | /conseils dès 1 024 px : 2 colonnes, la carte impaire finale passe sur la rangée en 2 colonnes internes (`2fr` / `3fr`), plus de `max-w-3xl` sur son texte (`conseils-list.tsx`). Titre en 44 px de cible, sans lien étendu (décision acceptée par @design). |
| T2-02 | corrigé | /vannes : carte en colonne `h-full`, rangée d'action en `mt-auto` (alignée d'une carte à l'autre), « Révéler la chute » aligné sur le texte (`-ml-3`), flèche en bas à droite ; carte impaire finale sur toute la rangée (`vannes-list.tsx`). |
| T2-03 | corrigé | /videos de 768 à 1 023 px : la vidéo impaire finale prend la rangée, vignette de 320 px à gauche et texte à droite, encadrés « Ce que tu vas apprendre » et « Exercice pratique » dessous sur toute la rangée (pas de vide sous la vignette) (`videos-grid.tsx`). |
| T2-04 (R27) | corrigé | Passe à la source par l'arbre syntaxique TypeScript (aucun mot changé) : 515 modifications (apostrophes droites entre deux lettres passées en ’, guillemets « » du texte JSX liés par une insécable) dans le texte JSX et les chaînes affichées (`config/textes`, composants, pied de page, pages), puis 24 guillemets de chaînes affichées liés de même. Exclus : slugs, URL, clés, comparaisons, regex, arguments de recherche, attributs techniques, données qui doivent rester égales à la base (`parcours-orientation.ts`), textes envoyés à Stripe et dans les e-mails (`paiement.ts`, `lettre-s21.ts`), back-office, IA, planificateur. Filtre d'affichage `frTypo` / `contenuAffiche` ajouté là où le texte vient de la base ou de données (titres vidéo, lecteur YouTube, « Pourquoi ça marche », titres d'étape, accroches des parcours, carnet, extraits du blog, liens « même catégorie »). Contrôle mot à mot du diff : les seuls mots ajoutés ou retirés sont des identifiants de code et des commentaires. Nouveau test `playwright/tests/local/typographie-s21.spec.ts` : `/\p{L}'\p{L}/u` et guillemet isolé dans le texte visible de 22 pages (visiteur) et 6 pages (abonné), 23/23. |
| T2-05 | corrigé | Liens d'exemple de « Trois outils » en `w-full` + `[text-wrap:pretty]`, orphelin « réglé par l'insécable. Relevé en recapture et corrigé : la coupe à 2 lignes était posée sur le lien et laissait voir le haut d'une 3e ligne dans son padding (déjà le cas avant) ; elle passe sur un span intérieur. De 768 à 1 023 px, les trois boutons de pied de carte sont pleine largeur et de même hauteur, flèche liée au dernier mot (`feature-cards.tsx`). |
| T2-06 | corrigé | « Ton contenu du jour » en grille de 3 dès 768 px (`p-4`, conseil en `line-clamp-6` de 768 à 1 023 px), carrousel seulement sous 768 (`daily-content.tsx`). Vide de la vanne : accepté par le verdict. |
| T2-07 | corrigé | Onglets de /favoris sur la ligne défilante des chips (`RANGEE_CHIPS`, fondu à droite). |
| T2-08 | corrigé | Pied de page à 768 px : marque sur toute la largeur, puis Produit et Infos côte à côte (`md:grid-cols-[2fr_1fr]`), 4 colonnes dès 1 024. |
| T2-09 | corrigé | Chips en ligne défilante jusqu'à 1 024 px (`RANGEE_CHIPS` : `lg:flex-wrap`). |
| T2-10 | corrigé | Carte floutée : barres sur 2/3, cadenas à droite (`shrink-0 ml-4`), plus de chevauchement. |
| T2-11 | corrigé | Coque en `md:px-6` (24 px de 768 à 1 279 px, 32 px dès 1 280) pour l'en-tête, le contenu et le pied ; chips alignées (`md:-mx-6 md:px-6`). En-tête mesuré à 1 024 px : une seule ligne, dernier élément à 1 000 px. `header-budget` vert. |
| T2-12 | corrigé | /favoris, cartes vidéo : accordéons sous la rangée vignette + texte (`lg:col-span-2`), plus de vide sous la vignette. |
| T2-13 | fermé (mesuré) | Mesure Playwright à 375 px, compte Premium, boîte du bouton : « Gérer mon abonnement », « Changer de formule », « Résilier ton contrat » = 44 px (taille `sm` : `max-md:h-11`). La capture pleine page à 375 px faisait paraître la boîte plus basse. Seule cible sous 44 px de /profil : le lien « formulaire de rétractation » dans une phrase (exception « en ligne » du critère 2.5.8). |
| T2-14 | corrigé | Admin « Semaine » : toute valeur texte de plus de 14 caractères passe sous son libellé, alignée à gauche (`LignesChiffres`) ; « Sync » du tableau en `min-h-11 px-3`, 14 px (`comptes-section.tsx`) ; valeurs courtes d'un tenant (« 2,99 € » ne se coupe plus). |
| T2-15 | corrigé | Cartes « même catégorie / thématique » des fiches vanne, conseil, vidéo : `flex h-full flex-col justify-center`. |
| T2-16 | accepté | Bouton d'inscription déjà en `[text-wrap:balance]` : 2 lignes équilibrées, accepté par le verdict, pas de changement. |

**Vérifications (tour 3).** `env -i` + variables factices de `tests.yml` : `tsc` x2 (build et complet), `next lint`, `next build`, Jest complet 5 277 passés (attentes qui figeaient l'apostrophe droite d'un texte affiché passées à ’, sans en relâcher aucune ; les regex des tests de fumée acceptent `['’]` car ils tournent aussi contre la production). Playwright contre le build : `local` 85/85 (dont `typographie-s21`, `grilles-s21`, `mur-alignement-s21`), smoke desktop + iPhone 13 : 128 passés, 2 sautés prévus (après remise à zéro, dans la base jetable, des limites de connexion par IP atteintes par les lancements successifs de la journée). CI « Tests CI » verte.
