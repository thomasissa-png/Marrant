# Navigation universelle (s24), tour 2 : fautes dures des relectures corrigées, preuves en images

Relectures du tour 1 (6,5/10 chacune) : `docs/design/relectures/captures-nav-tour-1-design.md` (9 fautes dures),
`docs/ux/relectures/captures-nav-tour-1-ux.md` (6), `docs/ux/relectures/captures-nav-tour-1-reviewer.md` (5).
Captures du 14/11/2026 sur la préversion locale OUVERTE (http://localhost:5400, méthode
`docs/espace-client/preversion-locale-s24.md`, build ouvert du code de travail recopié hors du dépôt, comptes remis
à zéro par `comptes.mjs` juste avant ; compte gratuit de test `inscrit-gratuit@preversion.test` créé sur la base
jetable). Sombre, 375 x 812, 768 x 1024, 1280 x 900, pages entières coupées à 3 200 px, pointeur hors des liens.
Script : `/root/marrant-preversion-s24/captures-nav-s24.mjs` (mesures : `mesures.json`). Dépôt FERMÉ.

**Bilan : 171 captures, 4 états (visiteur, inscrit gratuit, abonné en cours, nouvel abonné), toutes en 200,
0 débordement horizontal, 0 page collée à gauche à 1280 px, en-tête de 65 px menu fermé, H1 de toutes les pages
de l'espace à 141 px du haut à 768 et 1280 px** (375 px : Aujourd'hui à 97 px, voir D7).

Avant/après interrupteur FERMÉ (reviewer FD5, critère 1) : `avant-apres-ferme/`, 57 paires (en-tête des 3 états
à 375, 768, 1280 px sur `/`, `/vannes`, `/parcours`, `/carnet`, `/profil` ; menu mobile ouvert ; `/mon-espace`
en 404), commit `cfee1a38` (avant la navigation universelle) contre le code de travail : **57 sur 57 identiques au
pixel près** (`avant-apres-ferme/comparaison.txt`).

## Chaque faute dure, sa correction, sa preuve

| Faute | Correction | Capture qui le prouve |
|---|---|---|
| Design 1, ux F1 : Bibliothèque, 600 px de vide, préfixe répété, « Voir » | Cinq cartes en deux colonnes équilibrées (colonnes CSS), une carte par groupe titrée par le préfixe validé, ligne entière cliquable avec chevron, « Fait » gardé | `abonne-en-cours-mon-espace-bibliotheque-1280.png`, `-768.png`, `-375.png` |
| Design 2 : S'entraîner, colonne droite vide | Mission (et « C'est tout pour aujourd'hui ») sur la ligne entière, dernière carte seule sur sa ligne si nombre impair | `abonne-en-cours-mon-espace-s-entrainer-1280.png` |
| Design 3 : Favoris, carte seule pleine largeur, débuts décalés | 3 colonnes dès 1 024 px, cartes à hauteur de contenu, même marge haute (ouvert seulement) | `abonne-en-cours-favoris-1280.png`, `-375.png` |
| Design 4, ux F5 : états vides, bande noire sous le pied | État vide centré à 672 px avec sortie ; `min-h` de l'espace : le pied ne remonte plus | `nouvel-abonne-mon-espace-repliques-1280.png`, `abonne-en-cours-mon-espace-lettres-1280.png`, `abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png` |
| Design 5, reviewer FD4, ux F6b : cartes Conseil et Vidéo vides | Début du conseil (4 lignes) et vignette de la vidéo (lecteur de l'accueil), grille `items-start` | `abonne-en-cours-mon-espace-1280.png`, `-768.png` |
| Design 6 : largeurs incohérentes | Règle unique par gabarit (spec v5 §3) : A colonne centrée de 768 px (bord gauche 256 px à 1280), B et C pleine coque (32 px) ; H1 `text-3xl md:text-4xl` partout dans l'espace (lettre et bonus compris) | colonne « Bord gauche » du tableau ; `abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png` |
| Design 7 : trois hauteurs de H1 | Place du « Retour » réservée sur Aujourd'hui dès 768 px, titre collé au retour sur les pages A : H1 à 141 px sur les 20 pages de l'espace à 768 et 1280 ; à 375, Aujourd'hui garde sa carte au premier écran (test N4) | colonne « Haut du H1 » |
| Design 8 : carnet dense | Ouvert seulement : corps en 16 px, étiquettes en 14 px, plus d'air entre blocs, contexte lisible | `abonne-en-cours-carnet-1280.png` |
| Design 9 : catégories de /vannes coupées | Ouvert seulement : fondu de 64 px au lieu de 24 dès 1 024 px (une seule rangée gardée, décision T3-07 de la revue s21) | `abonne-en-cours-vannes-1280.png` |
| UX F2 : Quoi répondre en vrac | Liste rangée par lieu sous les libellés validés du filtre, avec le nombre ; « Rattraper un faux pas » pour les fiches sans lieu | `abonne-en-cours-mon-espace-quoi-repondre-1280.png`, `-375.png` |
| UX F3 : vente montrée à l'abonné | Phrase « Avec Premium… » du chapô de /vannes masquée pour l'abonné ; aucun lien d'achat visible pour l'abonné (balayage de 28 pages) | `abonne-en-cours-vannes-375.png`, `abonne-en-cours-accueil-1280.png` |
| UX F4 : catégories de Vannes | **Non fait** : unifier les pastilles du visiteur et de l'abonné et répartir les 10 vannes gratuites change la page publique et l'offre gratuite ; seule la rangée de l'abonné est retouchée (design 9) | `visiteur-vannes-375.png` (inchangé) |
| UX F6 : premier écran d'Aujourd'hui | Mission en carte (« Mission · Marche n », titre en ligne cliquable, « Facultative ») ; plus de hauteur minimale du premier pas (trou de 130 px) | `abonne-en-cours-mon-espace-1280.png`, `nouvel-abonne-mon-espace-375.png` |
| Reviewer FD1 : cibles de 32 px du menu de 768 à 1023 | `h-11` sur tous les boutons du menu ; test : 0 cible sous 44 px, 3 états x 320, 375, 768, 1023 px | `visiteur-menu-mobile-vannes-768.png`, `inscrit-gratuit-menu-mobile-vannes-768.png` |
| Reviewer FD2, FD3 : apostrophes droites, guillemets anglais | `frEspace` à l'affichage : ’ entre deux lettres, “ ” de premier niveau en « » avec fine (la citation intérieure garde “ ”), mots composés liés ; JSON et textes validés inchangés ; `typographie-s21` étendu à 10 pages de l'espace et 2 de parcours | `abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png`, `abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png`, `abonne-en-cours-mon-espace-1280.png` |
| Reviewer FD5 : critère 1 sans captures | Avant/après fermé, 57 paires identiques | `avant-apres-ferme/` |
| Arbitrage 3 : « Mon profil » en 2 gestes à 375 | Abonné : « Mon profil » et « Déconnexion » sur une ligne collée au bas du menu dès 640 px de haut (sous 640, à la suite : le bloc « Mon espace » garde les 38 px libres à 568) | `abonne-en-cours-menu-mobile-mon-espace-375.png` |

## Les 14 critères du §5, après le tour 2

| # | Verdict | Mesure |
|---|---|---|
| 1 | PASS | Jest d'inertie 47/47 instantanés, hachages inchangés ; avant/après fermé 57/57 identiques au pixel ; Playwright fermé 174 réussis |
| 2 | PASS | En-tête identique par état : visiteur 11 pages, gratuit 12, abonné 22, à 375, 768, 1280 px |
| 3 | PASS | Une seule barre, 0 doublon barre + menu (7 largeurs, 3 états), abonné « Mon espace » + 5 liens |
| 4 | PASS | 0 page collée à gauche à 1280 (171 captures) ; marges 16, 24, 32 px ; H1 à 141 px dans l'espace |
| 5 | PASS | Bloc « Mon espace » entier à 530 px, de 320 à 414 px de large (38 px libres à 568, 137 à 667) |
| 6 | PASS | `header-budget` 3 états, 320 à 1920 px, 639, 640, 641 compris : 0 débordement, 0 libellé coupé |
| 7 | PASS | Menu ouvert : 0 cible sous 44 px (12 combinaisons) ; focus, Échap, voile ; actif = `aria-current` + 2 px |
| 8 | PASS | 16 adresses abonné, 5 à 6 visiteur et gratuit, intitulé non cliquable de 768 à 1023 |
| 9 | PASS | 13 pages publiques en 200 sans redirection, HTML serveur du visiteur sans l'espace |
| 10 | PASS | Offre visible de 320 à 1920 (visiteur, gratuit), absente sur /abonnement ; accueil de l'abonné : 0 lien d'achat |
| 11 | PASS | 171 captures, 4 états, menus fermés et ouverts ; avant/après fermé |
| 12 | NON FAIT | Événements Umami à nommer par @data-analyst |
| 13 | PASS | Retours par type (situation, jeu, bilan vers `/parcours/repartie`, pages B, S'entraîner) ; Aujourd'hui, favoris, carnet sans retour |
| 14 | PASS | 768 : carte du jour x=24 et index x=396, même haut (221) ; 1280 : x=32 et x=652 ; une seule action pleine |

## Captures et mesures

| Capture | État | Page (statut) | Largeur | Débordement horizontal | Marge coque | Bord gauche du contenu | Vide à droite | Collé à gauche | Haut du H1 | Menu mobile (bas du bloc Mon espace / bas du menu, défilement) |
|---|---|---|---|---|---|---|---|---|---|---|
| [visiteur-accueil-375.png](visiteur-accueil-375.png) | visiteur | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [visiteur-vannes-375.png](visiteur-vannes-375.png) | visiteur | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -429 px |  | 133 px |  |
| [visiteur-conseils-375.png](visiteur-conseils-375.png) | visiteur | `/conseils (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [visiteur-videos-375.png](visiteur-videos-375.png) | visiteur | `/videos (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [visiteur-parcours-375.png](visiteur-parcours-375.png) | visiteur | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [visiteur-blog-375.png](visiteur-blog-375.png) | visiteur | `/blog (200)` | 375 | 0 px | 16 px | 16 px | -841 px |  | 133 px |  |
| [visiteur-fiche-vanne-375.png](visiteur-fiche-vanne-375.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 157 px |  |
| [visiteur-lettre-375.png](visiteur-lettre-375.png) | visiteur | `/lettre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 137 px |  |
| [visiteur-menu-mobile-vannes-375.png](visiteur-menu-mobile-vannes-375.png) | visiteur | `/vannes` | 375 | 0 px | 16 px | 0 px | -429 px |  |  | sans bloc / 582 px, sans défilement |
| [visiteur-accueil-768.png](visiteur-accueil-768.png) | visiteur | `/ (200)` | 768 | 0 px | 24 px | 24 px | -62 px |  | 177 px |  |
| [visiteur-vannes-768.png](visiteur-vannes-768.png) | visiteur | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -44 px |  | 133 px |  |
| [visiteur-conseils-768.png](visiteur-conseils-768.png) | visiteur | `/conseils (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-videos-768.png](visiteur-videos-768.png) | visiteur | `/videos (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-parcours-768.png](visiteur-parcours-768.png) | visiteur | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-blog-768.png](visiteur-blog-768.png) | visiteur | `/blog (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-fiche-vanne-768.png](visiteur-fiche-vanne-768.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 157 px |  |
| [visiteur-lettre-768.png](visiteur-lettre-768.png) | visiteur | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 137 px |  |
| [visiteur-menu-mobile-vannes-768.png](visiteur-menu-mobile-vannes-768.png) | visiteur | `/vannes` | 768 | 0 px | 24 px | 0 px | -44 px |  |  | sans bloc / 478 px, sans défilement |
| [visiteur-accueil-1280.png](visiteur-accueil-1280.png) | visiteur | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
| [visiteur-vannes-1280.png](visiteur-vannes-1280.png) | visiteur | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [visiteur-conseils-1280.png](visiteur-conseils-1280.png) | visiteur | `/conseils (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [visiteur-videos-1280.png](visiteur-videos-1280.png) | visiteur | `/videos (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [visiteur-parcours-1280.png](visiteur-parcours-1280.png) | visiteur | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [visiteur-blog-1280.png](visiteur-blog-1280.png) | visiteur | `/blog (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [visiteur-fiche-vanne-1280.png](visiteur-fiche-vanne-1280.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 157 px |  |
| [visiteur-lettre-1280.png](visiteur-lettre-1280.png) | visiteur | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 137 px |  |
| [inscrit-gratuit-accueil-375.png](inscrit-gratuit-accueil-375.png) | inscrit-gratuit | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [inscrit-gratuit-vannes-375.png](inscrit-gratuit-vannes-375.png) | inscrit-gratuit | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -429 px |  | 133 px |  |
| [inscrit-gratuit-conseils-375.png](inscrit-gratuit-conseils-375.png) | inscrit-gratuit | `/conseils (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-videos-375.png](inscrit-gratuit-videos-375.png) | inscrit-gratuit | `/videos (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-parcours-375.png](inscrit-gratuit-parcours-375.png) | inscrit-gratuit | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-blog-375.png](inscrit-gratuit-blog-375.png) | inscrit-gratuit | `/blog (200)` | 375 | 0 px | 16 px | 16 px | -841 px |  | 133 px |  |
| [inscrit-gratuit-fiche-vanne-375.png](inscrit-gratuit-fiche-vanne-375.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 157 px |  |
| [inscrit-gratuit-lettre-375.png](inscrit-gratuit-lettre-375.png) | inscrit-gratuit | `/lettre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 137 px |  |
| [inscrit-gratuit-profil-375.png](inscrit-gratuit-profil-375.png) | inscrit-gratuit | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [inscrit-gratuit-menu-mobile-vannes-375.png](inscrit-gratuit-menu-mobile-vannes-375.png) | inscrit-gratuit | `/vannes` | 375 | 0 px | 16 px | 0 px | -429 px |  |  | sans bloc / 686 px, sans défilement |
| [inscrit-gratuit-accueil-768.png](inscrit-gratuit-accueil-768.png) | inscrit-gratuit | `/ (200)` | 768 | 0 px | 24 px | 24 px | -62 px |  | 177 px |  |
| [inscrit-gratuit-vannes-768.png](inscrit-gratuit-vannes-768.png) | inscrit-gratuit | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -44 px |  | 133 px |  |
| [inscrit-gratuit-conseils-768.png](inscrit-gratuit-conseils-768.png) | inscrit-gratuit | `/conseils (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-videos-768.png](inscrit-gratuit-videos-768.png) | inscrit-gratuit | `/videos (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-parcours-768.png](inscrit-gratuit-parcours-768.png) | inscrit-gratuit | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-blog-768.png](inscrit-gratuit-blog-768.png) | inscrit-gratuit | `/blog (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-fiche-vanne-768.png](inscrit-gratuit-fiche-vanne-768.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 157 px |  |
| [inscrit-gratuit-lettre-768.png](inscrit-gratuit-lettre-768.png) | inscrit-gratuit | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 137 px |  |
| [inscrit-gratuit-profil-768.png](inscrit-gratuit-profil-768.png) | inscrit-gratuit | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 97 px |  |
| [inscrit-gratuit-menu-mobile-vannes-768.png](inscrit-gratuit-menu-mobile-vannes-768.png) | inscrit-gratuit | `/vannes` | 768 | 0 px | 24 px | 0 px | -44 px |  |  | sans bloc / 478 px, sans défilement |
| [inscrit-gratuit-accueil-1280.png](inscrit-gratuit-accueil-1280.png) | inscrit-gratuit | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
| [inscrit-gratuit-vannes-1280.png](inscrit-gratuit-vannes-1280.png) | inscrit-gratuit | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-conseils-1280.png](inscrit-gratuit-conseils-1280.png) | inscrit-gratuit | `/conseils (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-videos-1280.png](inscrit-gratuit-videos-1280.png) | inscrit-gratuit | `/videos (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-parcours-1280.png](inscrit-gratuit-parcours-1280.png) | inscrit-gratuit | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [inscrit-gratuit-blog-1280.png](inscrit-gratuit-blog-1280.png) | inscrit-gratuit | `/blog (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-fiche-vanne-1280.png](inscrit-gratuit-fiche-vanne-1280.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 157 px |  |
| [inscrit-gratuit-lettre-1280.png](inscrit-gratuit-lettre-1280.png) | inscrit-gratuit | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 137 px |  |
| [inscrit-gratuit-profil-1280.png](inscrit-gratuit-profil-1280.png) | inscrit-gratuit | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 97 px |  |
| [abonne-en-cours-mon-espace-375.png](abonne-en-cours-mon-espace-375.png) | abonne-en-cours | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-375.png](abonne-en-cours-mon-espace-quoi-repondre-375.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-375.png](abonne-en-cours-mon-espace-bibliotheque-375.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-questions-375.png](abonne-en-cours-mon-espace-questions-375.png) | abonne-en-cours | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-375.png](abonne-en-cours-mon-espace-s-entrainer-375.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-repliques-375.png](abonne-en-cours-mon-espace-repliques-375.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-lettres-375.png](abonne-en-cours-mon-espace-lettres-375.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 33 px | 17 px |  |  |  |
| [abonne-en-cours-favoris-375.png](abonne-en-cours-favoris-375.png) | abonne-en-cours | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | -37 px |  | 97 px |  |
| [abonne-en-cours-carnet-375.png](abonne-en-cours-carnet-375.png) | abonne-en-cours | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 161 px |  |
| [abonne-en-cours-profil-375.png](abonne-en-cours-profil-375.png) | abonne-en-cours | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [abonne-en-cours-parcours-375.png](abonne-en-cours-parcours-375.png) | abonne-en-cours | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |  |
| [abonne-en-cours-parcours-repartie-375.png](abonne-en-cours-parcours-repartie-375.png) | abonne-en-cours | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-vannes-375.png](abonne-en-cours-vannes-375.png) | abonne-en-cours | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  | 133 px |  |
| [abonne-en-cours-accueil-375.png](abonne-en-cours-accueil-375.png) | abonne-en-cours | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [abonne-en-cours-menu-mobile-mon-espace-375.png](abonne-en-cours-menu-mobile-mon-espace-375.png) | abonne-en-cours | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 811 px, défile |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 811 px, défile |
| [abonne-en-cours-mon-espace-768.png](abonne-en-cours-mon-espace-768.png) | abonne-en-cours | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-768.png](abonne-en-cours-mon-espace-quoi-repondre-768.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-768.png](abonne-en-cours-mon-espace-bibliotheque-768.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-questions-768.png](abonne-en-cours-mon-espace-questions-768.png) | abonne-en-cours | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-768.png](abonne-en-cours-mon-espace-s-entrainer-768.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-repliques-768.png](abonne-en-cours-mon-espace-repliques-768.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-lettres-768.png](abonne-en-cours-mon-espace-lettres-768.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 49 px | 25 px |  |  |  |
| [abonne-en-cours-favoris-768.png](abonne-en-cours-favoris-768.png) | abonne-en-cours | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 97 px |  |
| [abonne-en-cours-carnet-768.png](abonne-en-cours-carnet-768.png) | abonne-en-cours | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 161 px |  |
| [abonne-en-cours-profil-768.png](abonne-en-cours-profil-768.png) | abonne-en-cours | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 97 px |  |
| [abonne-en-cours-parcours-768.png](abonne-en-cours-parcours-768.png) | abonne-en-cours | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |  |
| [abonne-en-cours-parcours-repartie-768.png](abonne-en-cours-parcours-repartie-768.png) | abonne-en-cours | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-vannes-768.png](abonne-en-cours-vannes-768.png) | abonne-en-cours | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  | 133 px |  |
| [abonne-en-cours-accueil-768.png](abonne-en-cours-accueil-768.png) | abonne-en-cours | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [abonne-en-cours-menu-mobile-mon-espace-768.png](abonne-en-cours-menu-mobile-mon-espace-768.png) | abonne-en-cours | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 754 px, sans défilement |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 754 px, sans défilement |
| [abonne-en-cours-mon-espace-1280.png](abonne-en-cours-mon-espace-1280.png) | abonne-en-cours | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-1280.png](abonne-en-cours-mon-espace-quoi-repondre-1280.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-1280.png](abonne-en-cours-mon-espace-bibliotheque-1280.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-questions-1280.png](abonne-en-cours-mon-espace-questions-1280.png) | abonne-en-cours | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-1280.png](abonne-en-cours-mon-espace-s-entrainer-1280.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-repliques-1280.png](abonne-en-cours-mon-espace-repliques-1280.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-lettres-1280.png](abonne-en-cours-mon-espace-lettres-1280.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 281 px | 249 px | non |  |  |
| [abonne-en-cours-favoris-1280.png](abonne-en-cours-favoris-1280.png) | abonne-en-cours | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 97 px |  |
| [abonne-en-cours-carnet-1280.png](abonne-en-cours-carnet-1280.png) | abonne-en-cours | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 161 px |  |
| [abonne-en-cours-profil-1280.png](abonne-en-cours-profil-1280.png) | abonne-en-cours | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 97 px |  |
| [abonne-en-cours-parcours-1280.png](abonne-en-cours-parcours-1280.png) | abonne-en-cours | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |  |
| [abonne-en-cours-parcours-repartie-1280.png](abonne-en-cours-parcours-repartie-1280.png) | abonne-en-cours | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-vannes-1280.png](abonne-en-cours-vannes-1280.png) | abonne-en-cours | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non | 133 px |  |
| [abonne-en-cours-accueil-1280.png](abonne-en-cours-accueil-1280.png) | abonne-en-cours | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
| [nouvel-abonne-mon-espace-375.png](nouvel-abonne-mon-espace-375.png) | nouvel-abonne | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-375.png](nouvel-abonne-mon-espace-quoi-repondre-375.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-375.png](nouvel-abonne-mon-espace-bibliotheque-375.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-questions-375.png](nouvel-abonne-mon-espace-questions-375.png) | nouvel-abonne | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-375.png](nouvel-abonne-mon-espace-s-entrainer-375.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-repliques-375.png](nouvel-abonne-mon-espace-repliques-375.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-lettres-375.png](nouvel-abonne-mon-espace-lettres-375.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 33 px | 17 px |  |  |  |
| [nouvel-abonne-favoris-375.png](nouvel-abonne-favoris-375.png) | nouvel-abonne | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [nouvel-abonne-carnet-375.png](nouvel-abonne-carnet-375.png) | nouvel-abonne | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 161 px |  |
| [nouvel-abonne-profil-375.png](nouvel-abonne-profil-375.png) | nouvel-abonne | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 97 px |  |
| [nouvel-abonne-parcours-375.png](nouvel-abonne-parcours-375.png) | nouvel-abonne | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |  |
| [nouvel-abonne-parcours-repartie-375.png](nouvel-abonne-parcours-repartie-375.png) | nouvel-abonne | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-vannes-375.png](nouvel-abonne-vannes-375.png) | nouvel-abonne | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  | 133 px |  |
| [nouvel-abonne-accueil-375.png](nouvel-abonne-accueil-375.png) | nouvel-abonne | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [nouvel-abonne-menu-mobile-mon-espace-375.png](nouvel-abonne-menu-mobile-mon-espace-375.png) | nouvel-abonne | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 811 px, défile |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 811 px, défile |
| [nouvel-abonne-mon-espace-768.png](nouvel-abonne-mon-espace-768.png) | nouvel-abonne | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-768.png](nouvel-abonne-mon-espace-quoi-repondre-768.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-768.png](nouvel-abonne-mon-espace-bibliotheque-768.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-questions-768.png](nouvel-abonne-mon-espace-questions-768.png) | nouvel-abonne | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-768.png](nouvel-abonne-mon-espace-s-entrainer-768.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-repliques-768.png](nouvel-abonne-mon-espace-repliques-768.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-lettres-768.png](nouvel-abonne-mon-espace-lettres-768.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 49 px | 25 px |  |  |  |
| [nouvel-abonne-favoris-768.png](nouvel-abonne-favoris-768.png) | nouvel-abonne | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 97 px |  |
| [nouvel-abonne-carnet-768.png](nouvel-abonne-carnet-768.png) | nouvel-abonne | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 161 px |  |
| [nouvel-abonne-profil-768.png](nouvel-abonne-profil-768.png) | nouvel-abonne | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 97 px |  |
| [nouvel-abonne-parcours-768.png](nouvel-abonne-parcours-768.png) | nouvel-abonne | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |  |
| [nouvel-abonne-parcours-repartie-768.png](nouvel-abonne-parcours-repartie-768.png) | nouvel-abonne | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-vannes-768.png](nouvel-abonne-vannes-768.png) | nouvel-abonne | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  | 133 px |  |
| [nouvel-abonne-accueil-768.png](nouvel-abonne-accueil-768.png) | nouvel-abonne | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [nouvel-abonne-menu-mobile-mon-espace-768.png](nouvel-abonne-menu-mobile-mon-espace-768.png) | nouvel-abonne | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 754 px, sans défilement |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 754 px, sans défilement |
| [nouvel-abonne-mon-espace-1280.png](nouvel-abonne-mon-espace-1280.png) | nouvel-abonne | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-1280.png](nouvel-abonne-mon-espace-quoi-repondre-1280.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-1280.png](nouvel-abonne-mon-espace-bibliotheque-1280.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-questions-1280.png](nouvel-abonne-mon-espace-questions-1280.png) | nouvel-abonne | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-1280.png](nouvel-abonne-mon-espace-s-entrainer-1280.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-repliques-1280.png](nouvel-abonne-mon-espace-repliques-1280.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-lettres-1280.png](nouvel-abonne-mon-espace-lettres-1280.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 141 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 281 px | 249 px | non |  |  |
| [nouvel-abonne-favoris-1280.png](nouvel-abonne-favoris-1280.png) | nouvel-abonne | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 97 px |  |
| [nouvel-abonne-carnet-1280.png](nouvel-abonne-carnet-1280.png) | nouvel-abonne | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 161 px |  |
| [nouvel-abonne-profil-1280.png](nouvel-abonne-profil-1280.png) | nouvel-abonne | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 97 px |  |
| [nouvel-abonne-parcours-1280.png](nouvel-abonne-parcours-1280.png) | nouvel-abonne | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |  |
| [nouvel-abonne-parcours-repartie-1280.png](nouvel-abonne-parcours-repartie-1280.png) | nouvel-abonne | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-vannes-1280.png](nouvel-abonne-vannes-1280.png) | nouvel-abonne | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non | 133 px |  |
| [nouvel-abonne-accueil-1280.png](nouvel-abonne-accueil-1280.png) | nouvel-abonne | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
