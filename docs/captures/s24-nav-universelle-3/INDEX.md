# Navigation universelle (s24), tour 3 : fautes dures du tour 2 corrigées, preuves en images

Relectures du tour 2 : design 7,5 (`docs/design/relectures/captures-nav-tour-2-design.md`, 5 fautes dures),
ux 8 (`docs/ux/relectures/captures-nav-tour-2-ux.md`, 2), reviewer 7 (`docs/ux/relectures/captures-nav-tour-2-reviewer.md`, 3).
Captures du 14/11/2026 sur la préversion locale OUVERTE (http://localhost:5400, build ouvert du code de travail
recopié hors du dépôt, comptes remis à zéro par `comptes.mjs` juste avant ; compte gratuit de test créé sur la base
jetable). Sombre, **375 x 812, 768 x 1024, 1024 x 800, 1280 x 900**, pages entières coupées à 3 200 px. Script :
`/root/marrant-preversion-s24/captures-nav-s24.mjs` (mesures : `mesures.json`). Dépôt FERMÉ.

**Bilan : 232 captures, 4 états, 4 largeurs, toutes en 200, 0 débordement horizontal, 0 page collée à gauche à
1280 px. H1 à 133 px du haut sur les 17 pages à titre de l'abonné, pour les 2 comptes abonnés, à chaque largeur (34 mesures
par largeur) ; hors gabarit : l'accueil (page de vente) ; `/lettre` n'a aucun titre pour l'abonné (comportement
actuel du site, interrupteur fermé comme ouvert, voir « Points à trancher »).** Le test Playwright `nav-universelle-s24` « H1 à la même hauteur » le vérifie à ±0 px
(375, 768, 1024, 1280 px, 14 pages).

Avant/après interrupteur FERMÉ (`avant-apres-ferme/`) : commit `cfee1a38` (avant la navigation universelle) contre le
code de travail, en-tête des 3 états sur 5 pages, menus, `/mon-espace` (404), et **pages entières de `/vannes`,
`/carnet` (3 états) et `/favoris` (abonné)** à 375, 768 et 1280 px : **77 paires sur 78 identiques au pixel près** ;
la 78e (icône du compte, 7 pixels) a deux rendus aussi bien avant qu'après, contre-épreuve dans
`avant-apres-ferme/contre-epreuve-premium-parcours-1280/` (`comparaison.txt`).

## Chaque faute dure du tour 2, sa correction, sa preuve

| Faute | Correction | Capture qui le prouve |
|---|---|---|
| ux N1, reviewer FD-A : la barre collée cache « Articles » | Plus de barre collée ; abonné : les 5 liens du site sur deux colonnes (ordre gardé), « Mon profil » et « Déconnexion » à la suite dans le flux : à 375 x 812, tout le menu tient sans défilement (bas à 780 px) ; bloc « Mon espace » toujours à 530 px (critère 5) | `abonne-en-cours-menu-mobile-mon-espace-375.png`, `nouvel-abonne-menu-mobile-mon-espace-375.png` |
| Design F1 : H1 à 4 hauteurs | Place du repère de 36 px (celle du fil d'Ariane du site) : « Retour » de l'espace à 36 px (cible toujours de 44 px), place vide sur Aujourd'hui, /favoris, /profil, /parcours de l'abonné ; carnet de l'abonné : surtitre sous le titre. H1 à 133 px partout | tableau ci-dessous |
| Design F2 : deux mondes, Lettres titre à gauche et carte centrée | A (colonne de 768 px, retour, titre et contenu ensemble) et B (pleine coque) seulement ; une page B vide passe en A (Lettres, Mes répliques) | `nouvel-abonne-mon-espace-lettres-1280.png`, `nouvel-abonne-mon-espace-repliques-1280.png` |
| Design F3, reviewer FD-B : états vides, pied poussé sous l'écran | Titre, puis état vide (phrase et bouton) dans la colonne ; plus de hauteur minimale de l'espace : la coque du site passe en colonne (`min-h-dvh`, `main` qui grandit, ouvert seulement), le pied touche le bas sans être poussé ; H1 visible sur le seuil du coin « Humour noir » | mêmes captures, `abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png` |
| Design F4 : Parcours de l'abonné sans titre | H1 « Parcours » visible (il existait pour les lecteurs d'écran) | `abonne-en-cours-parcours-1280.png` |
| Design F5 : « Vanne du jour » de l'accueil à moitié vide | Ouvert seulement : cartes du jour de l'accueil à la hauteur de leur contenu | `inscrit-gratuit-accueil-1280.png`, `visiteur-accueil-1280.png` |
| ux N2, reviewer FD-B2 : nom du groupe et « 5 min » répétés | À l'affichage : le préfixe est retiré quand il commence le titre du groupe (« Vocabulaire : … » sous « Vocabulaire », « Coloc : … » sous « Coloc ») avec une majuscule ; plus de durée par ligne (Quoi répondre, coin) | `abonne-en-cours-mon-espace-bibliotheque-1280.png`, `abonne-en-cours-mon-espace-quoi-repondre-375.png` |
| Reviewer P5 et preuves manquantes | Pages entières fermées avant/après ; `/lettre` vue par l'abonné ; largeur 1024 | `avant-apres-ferme/`, `abonne-en-cours-lettre-1280.png`, tous les `*-1024.png` |
| Pistes appliquées | Jeu : « Jeux · 5 min » sur une ligne (P2) ; extrait du conseil coupé à la phrase (P6) ; vignette de la vidéo à 448 px à 768 (P7) ; sortie de Lettres en bouton comme Mes répliques (P11) | `abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png`, `abonne-en-cours-mon-espace-768.png` |

## Hauteur du H1, page par page (mesurée sur les captures)

| Page (abonné en cours) | Gabarit | 375 px | 768 px | 1024 px | 1280 px | Bord gauche du H1 à 1280 |
|---|---|---|---|---|---|---|
| `/mon-espace` | C | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/quoi-repondre` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/bibliotheque` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/questions` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/s-entrainer` | C | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/repliques` | B (A si vide) | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/mon-espace/lettres` | B (A si vide) | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/mon-espace/fiche/situation/coloc-la-poele` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/mon-espace/fiche/jeu/quelle-replique-1` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/mon-espace/fiche/bilan/bilan-repartie` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/favoris` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/carnet` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/profil` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/parcours` | A | 133 px | 133 px | 133 px | 133 px | 256 px |
| `/parcours/repartie` | A | 133 px | 133 px | 133 px | 133 px | 313 px |
| `/vannes` | B | 133 px | 133 px | 133 px | 133 px | 32 px |
| `/lettre` | A | sans H1 | sans H1 | sans H1 | sans H1 |  |
| `/` | accueil (hors gabarit) | 145 px | 177 px | 177 px | 177 px | 32 px |

## Points à trancher

- `/lettre` vue par l'abonné : page vide (le formulaire de la lettre gratuite est masqué pour un Premium depuis la
  revue s21 m4), interrupteur fermé comme ouvert (`abonne-en-cours-lettre-1280.png`). Non touché : c'est le site public.
- `/parcours/repartie` : H1 dans la carte d'en-tête du parcours, bord gauche à 313 px au lieu de 256 (page publique,
  inchangée).
- Catégories de Vannes pour le visiteur (ux F4) : inchangées, décision de Thomas attendue.

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
| [visiteur-accueil-1024.png](visiteur-accueil-1024.png) | visiteur | `/ (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [visiteur-vannes-1024.png](visiteur-vannes-1024.png) | visiteur | `/vannes (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-conseils-1024.png](visiteur-conseils-1024.png) | visiteur | `/conseils (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-videos-1024.png](visiteur-videos-1024.png) | visiteur | `/videos (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-parcours-1024.png](visiteur-parcours-1024.png) | visiteur | `/parcours (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [visiteur-blog-1024.png](visiteur-blog-1024.png) | visiteur | `/blog (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [visiteur-fiche-vanne-1024.png](visiteur-fiche-vanne-1024.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 157 px |  |
| [visiteur-lettre-1024.png](visiteur-lettre-1024.png) | visiteur | `/lettre (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 137 px |  |
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
| [inscrit-gratuit-profil-375.png](inscrit-gratuit-profil-375.png) | inscrit-gratuit | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-menu-mobile-vannes-375.png](inscrit-gratuit-menu-mobile-vannes-375.png) | inscrit-gratuit | `/vannes` | 375 | 0 px | 16 px | 0 px | -429 px |  |  | sans bloc / 686 px, sans défilement |
| [inscrit-gratuit-accueil-768.png](inscrit-gratuit-accueil-768.png) | inscrit-gratuit | `/ (200)` | 768 | 0 px | 24 px | 24 px | -62 px |  | 177 px |  |
| [inscrit-gratuit-vannes-768.png](inscrit-gratuit-vannes-768.png) | inscrit-gratuit | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -44 px |  | 133 px |  |
| [inscrit-gratuit-conseils-768.png](inscrit-gratuit-conseils-768.png) | inscrit-gratuit | `/conseils (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-videos-768.png](inscrit-gratuit-videos-768.png) | inscrit-gratuit | `/videos (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-parcours-768.png](inscrit-gratuit-parcours-768.png) | inscrit-gratuit | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-blog-768.png](inscrit-gratuit-blog-768.png) | inscrit-gratuit | `/blog (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-fiche-vanne-768.png](inscrit-gratuit-fiche-vanne-768.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 157 px |  |
| [inscrit-gratuit-lettre-768.png](inscrit-gratuit-lettre-768.png) | inscrit-gratuit | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 137 px |  |
| [inscrit-gratuit-profil-768.png](inscrit-gratuit-profil-768.png) | inscrit-gratuit | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-menu-mobile-vannes-768.png](inscrit-gratuit-menu-mobile-vannes-768.png) | inscrit-gratuit | `/vannes` | 768 | 0 px | 24 px | 0 px | -44 px |  |  | sans bloc / 478 px, sans défilement |
| [inscrit-gratuit-accueil-1024.png](inscrit-gratuit-accueil-1024.png) | inscrit-gratuit | `/ (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [inscrit-gratuit-vannes-1024.png](inscrit-gratuit-vannes-1024.png) | inscrit-gratuit | `/vannes (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-conseils-1024.png](inscrit-gratuit-conseils-1024.png) | inscrit-gratuit | `/conseils (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-videos-1024.png](inscrit-gratuit-videos-1024.png) | inscrit-gratuit | `/videos (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-parcours-1024.png](inscrit-gratuit-parcours-1024.png) | inscrit-gratuit | `/parcours (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [inscrit-gratuit-blog-1024.png](inscrit-gratuit-blog-1024.png) | inscrit-gratuit | `/blog (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-fiche-vanne-1024.png](inscrit-gratuit-fiche-vanne-1024.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 157 px |  |
| [inscrit-gratuit-lettre-1024.png](inscrit-gratuit-lettre-1024.png) | inscrit-gratuit | `/lettre (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 137 px |  |
| [inscrit-gratuit-profil-1024.png](inscrit-gratuit-profil-1024.png) | inscrit-gratuit | `/profil (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [inscrit-gratuit-accueil-1280.png](inscrit-gratuit-accueil-1280.png) | inscrit-gratuit | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
| [inscrit-gratuit-vannes-1280.png](inscrit-gratuit-vannes-1280.png) | inscrit-gratuit | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-conseils-1280.png](inscrit-gratuit-conseils-1280.png) | inscrit-gratuit | `/conseils (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-videos-1280.png](inscrit-gratuit-videos-1280.png) | inscrit-gratuit | `/videos (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-parcours-1280.png](inscrit-gratuit-parcours-1280.png) | inscrit-gratuit | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [inscrit-gratuit-blog-1280.png](inscrit-gratuit-blog-1280.png) | inscrit-gratuit | `/blog (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [inscrit-gratuit-fiche-vanne-1280.png](inscrit-gratuit-fiche-vanne-1280.png) | inscrit-gratuit | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 157 px |  |
| [inscrit-gratuit-lettre-1280.png](inscrit-gratuit-lettre-1280.png) | inscrit-gratuit | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 137 px |  |
| [inscrit-gratuit-profil-1280.png](inscrit-gratuit-profil-1280.png) | inscrit-gratuit | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-375.png](abonne-en-cours-mon-espace-375.png) | abonne-en-cours | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-375.png](abonne-en-cours-mon-espace-quoi-repondre-375.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-375.png](abonne-en-cours-mon-espace-bibliotheque-375.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-questions-375.png](abonne-en-cours-mon-espace-questions-375.png) | abonne-en-cours | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-375.png](abonne-en-cours-mon-espace-s-entrainer-375.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-repliques-375.png](abonne-en-cours-mon-espace-repliques-375.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-lettres-375.png](abonne-en-cours-mon-espace-lettres-375.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-favoris-375.png](abonne-en-cours-favoris-375.png) | abonne-en-cours | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | -37 px |  | 133 px |  |
| [abonne-en-cours-carnet-375.png](abonne-en-cours-carnet-375.png) | abonne-en-cours | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-profil-375.png](abonne-en-cours-profil-375.png) | abonne-en-cours | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-parcours-375.png](abonne-en-cours-parcours-375.png) | abonne-en-cours | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-parcours-repartie-375.png](abonne-en-cours-parcours-repartie-375.png) | abonne-en-cours | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [abonne-en-cours-vannes-375.png](abonne-en-cours-vannes-375.png) | abonne-en-cours | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  | 133 px |  |
| [abonne-en-cours-lettre-375.png](abonne-en-cours-lettre-375.png) | abonne-en-cours | `/lettre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |  |
| [abonne-en-cours-accueil-375.png](abonne-en-cours-accueil-375.png) | abonne-en-cours | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [abonne-en-cours-menu-mobile-mon-espace-375.png](abonne-en-cours-menu-mobile-mon-espace-375.png) | abonne-en-cours | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 779 px, sans défilement |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 779 px, sans défilement |
| [abonne-en-cours-mon-espace-768.png](abonne-en-cours-mon-espace-768.png) | abonne-en-cours | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-768.png](abonne-en-cours-mon-espace-quoi-repondre-768.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-768.png](abonne-en-cours-mon-espace-bibliotheque-768.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-questions-768.png](abonne-en-cours-mon-espace-questions-768.png) | abonne-en-cours | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-768.png](abonne-en-cours-mon-espace-s-entrainer-768.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-repliques-768.png](abonne-en-cours-mon-espace-repliques-768.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-lettres-768.png](abonne-en-cours-mon-espace-lettres-768.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-favoris-768.png](abonne-en-cours-favoris-768.png) | abonne-en-cours | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-carnet-768.png](abonne-en-cours-carnet-768.png) | abonne-en-cours | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-profil-768.png](abonne-en-cours-profil-768.png) | abonne-en-cours | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-parcours-768.png](abonne-en-cours-parcours-768.png) | abonne-en-cours | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-parcours-repartie-768.png](abonne-en-cours-parcours-repartie-768.png) | abonne-en-cours | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-vannes-768.png](abonne-en-cours-vannes-768.png) | abonne-en-cours | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  | 133 px |  |
| [abonne-en-cours-lettre-768.png](abonne-en-cours-lettre-768.png) | abonne-en-cours | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |  |
| [abonne-en-cours-accueil-768.png](abonne-en-cours-accueil-768.png) | abonne-en-cours | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [abonne-en-cours-menu-mobile-mon-espace-768.png](abonne-en-cours-menu-mobile-mon-espace-768.png) | abonne-en-cours | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 650 px, sans défilement |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 650 px, sans défilement |
| [abonne-en-cours-mon-espace-1024.png](abonne-en-cours-mon-espace-1024.png) | abonne-en-cours | `/mon-espace (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-1024.png](abonne-en-cours-mon-espace-quoi-repondre-1024.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-1024.png](abonne-en-cours-mon-espace-bibliotheque-1024.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-questions-1024.png](abonne-en-cours-mon-espace-questions-1024.png) | abonne-en-cours | `/mon-espace/questions (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-1024.png](abonne-en-cours-mon-espace-s-entrainer-1024.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-repliques-1024.png](abonne-en-cours-mon-espace-repliques-1024.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-lettres-1024.png](abonne-en-cours-mon-espace-lettres-1024.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1024.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1024.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1024.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1024.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1024.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1024.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1024.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1024.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-favoris-1024.png](abonne-en-cours-favoris-1024.png) | abonne-en-cours | `/favoris (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-carnet-1024.png](abonne-en-cours-carnet-1024.png) | abonne-en-cours | `/carnet (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-profil-1024.png](abonne-en-cours-profil-1024.png) | abonne-en-cours | `/profil (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [abonne-en-cours-parcours-1024.png](abonne-en-cours-parcours-1024.png) | abonne-en-cours | `/parcours (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-parcours-repartie-1024.png](abonne-en-cours-parcours-repartie-1024.png) | abonne-en-cours | `/parcours/repartie (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [abonne-en-cours-vannes-1024.png](abonne-en-cours-vannes-1024.png) | abonne-en-cours | `/vannes (200)` | 1024 | 0 px | 24 px | 24 px | -360 px |  | 133 px |  |
| [abonne-en-cours-lettre-1024.png](abonne-en-cours-lettre-1024.png) | abonne-en-cours | `/lettre (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  |  |  |
| [abonne-en-cours-accueil-1024.png](abonne-en-cours-accueil-1024.png) | abonne-en-cours | `/ (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [abonne-en-cours-mon-espace-1280.png](abonne-en-cours-mon-espace-1280.png) | abonne-en-cours | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-quoi-repondre-1280.png](abonne-en-cours-mon-espace-quoi-repondre-1280.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-bibliotheque-1280.png](abonne-en-cours-mon-espace-bibliotheque-1280.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-questions-1280.png](abonne-en-cours-mon-espace-questions-1280.png) | abonne-en-cours | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-s-entrainer-1280.png](abonne-en-cours-mon-espace-s-entrainer-1280.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-repliques-1280.png](abonne-en-cours-mon-espace-repliques-1280.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-lettres-1280.png](abonne-en-cours-mon-espace-lettres-1280.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-favoris-1280.png](abonne-en-cours-favoris-1280.png) | abonne-en-cours | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-carnet-1280.png](abonne-en-cours-carnet-1280.png) | abonne-en-cours | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-profil-1280.png](abonne-en-cours-profil-1280.png) | abonne-en-cours | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [abonne-en-cours-parcours-1280.png](abonne-en-cours-parcours-1280.png) | abonne-en-cours | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-parcours-repartie-1280.png](abonne-en-cours-parcours-repartie-1280.png) | abonne-en-cours | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [abonne-en-cours-vannes-1280.png](abonne-en-cours-vannes-1280.png) | abonne-en-cours | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non | 133 px |  |
| [abonne-en-cours-lettre-1280.png](abonne-en-cours-lettre-1280.png) | abonne-en-cours | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |  |
| [abonne-en-cours-accueil-1280.png](abonne-en-cours-accueil-1280.png) | abonne-en-cours | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
| [nouvel-abonne-mon-espace-375.png](nouvel-abonne-mon-espace-375.png) | nouvel-abonne | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-375.png](nouvel-abonne-mon-espace-quoi-repondre-375.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-375.png](nouvel-abonne-mon-espace-bibliotheque-375.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-questions-375.png](nouvel-abonne-mon-espace-questions-375.png) | nouvel-abonne | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-375.png](nouvel-abonne-mon-espace-s-entrainer-375.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-repliques-375.png](nouvel-abonne-mon-espace-repliques-375.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-lettres-375.png](nouvel-abonne-mon-espace-lettres-375.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-favoris-375.png](nouvel-abonne-favoris-375.png) | nouvel-abonne | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-carnet-375.png](nouvel-abonne-carnet-375.png) | nouvel-abonne | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-profil-375.png](nouvel-abonne-profil-375.png) | nouvel-abonne | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-parcours-375.png](nouvel-abonne-parcours-375.png) | nouvel-abonne | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-parcours-repartie-375.png](nouvel-abonne-parcours-repartie-375.png) | nouvel-abonne | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  | 133 px |  |
| [nouvel-abonne-vannes-375.png](nouvel-abonne-vannes-375.png) | nouvel-abonne | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  | 133 px |  |
| [nouvel-abonne-lettre-375.png](nouvel-abonne-lettre-375.png) | nouvel-abonne | `/lettre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |  |
| [nouvel-abonne-accueil-375.png](nouvel-abonne-accueil-375.png) | nouvel-abonne | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  | 145 px |  |
| [nouvel-abonne-menu-mobile-mon-espace-375.png](nouvel-abonne-menu-mobile-mon-espace-375.png) | nouvel-abonne | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 779 px, sans défilement |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  |  | 530 / 779 px, sans défilement |
| [nouvel-abonne-mon-espace-768.png](nouvel-abonne-mon-espace-768.png) | nouvel-abonne | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-768.png](nouvel-abonne-mon-espace-quoi-repondre-768.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-768.png](nouvel-abonne-mon-espace-bibliotheque-768.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-questions-768.png](nouvel-abonne-mon-espace-questions-768.png) | nouvel-abonne | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-768.png](nouvel-abonne-mon-espace-s-entrainer-768.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-repliques-768.png](nouvel-abonne-mon-espace-repliques-768.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-lettres-768.png](nouvel-abonne-mon-espace-lettres-768.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-favoris-768.png](nouvel-abonne-favoris-768.png) | nouvel-abonne | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-carnet-768.png](nouvel-abonne-carnet-768.png) | nouvel-abonne | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-profil-768.png](nouvel-abonne-profil-768.png) | nouvel-abonne | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-parcours-768.png](nouvel-abonne-parcours-768.png) | nouvel-abonne | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-parcours-repartie-768.png](nouvel-abonne-parcours-repartie-768.png) | nouvel-abonne | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-vannes-768.png](nouvel-abonne-vannes-768.png) | nouvel-abonne | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  | 133 px |  |
| [nouvel-abonne-lettre-768.png](nouvel-abonne-lettre-768.png) | nouvel-abonne | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |  |
| [nouvel-abonne-accueil-768.png](nouvel-abonne-accueil-768.png) | nouvel-abonne | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [nouvel-abonne-menu-mobile-mon-espace-768.png](nouvel-abonne-menu-mobile-mon-espace-768.png) | nouvel-abonne | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 650 px, sans défilement |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  |  | 478 / 650 px, sans défilement |
| [nouvel-abonne-mon-espace-1024.png](nouvel-abonne-mon-espace-1024.png) | nouvel-abonne | `/mon-espace (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-1024.png](nouvel-abonne-mon-espace-quoi-repondre-1024.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-1024.png](nouvel-abonne-mon-espace-bibliotheque-1024.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-questions-1024.png](nouvel-abonne-mon-espace-questions-1024.png) | nouvel-abonne | `/mon-espace/questions (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-1024.png](nouvel-abonne-mon-espace-s-entrainer-1024.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-repliques-1024.png](nouvel-abonne-mon-espace-repliques-1024.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-lettres-1024.png](nouvel-abonne-mon-espace-lettres-1024.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1024.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1024.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1024.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1024.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1024.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1024.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1024.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1024.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-favoris-1024.png](nouvel-abonne-favoris-1024.png) | nouvel-abonne | `/favoris (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-carnet-1024.png](nouvel-abonne-carnet-1024.png) | nouvel-abonne | `/carnet (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-profil-1024.png](nouvel-abonne-profil-1024.png) | nouvel-abonne | `/profil (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 133 px |  |
| [nouvel-abonne-parcours-1024.png](nouvel-abonne-parcours-1024.png) | nouvel-abonne | `/parcours (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-parcours-repartie-1024.png](nouvel-abonne-parcours-repartie-1024.png) | nouvel-abonne | `/parcours/repartie (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  | 133 px |  |
| [nouvel-abonne-vannes-1024.png](nouvel-abonne-vannes-1024.png) | nouvel-abonne | `/vannes (200)` | 1024 | 0 px | 24 px | 24 px | -360 px |  | 133 px |  |
| [nouvel-abonne-lettre-1024.png](nouvel-abonne-lettre-1024.png) | nouvel-abonne | `/lettre (200)` | 1024 | 0 px | 24 px | 128 px | 104 px |  |  |  |
| [nouvel-abonne-accueil-1024.png](nouvel-abonne-accueil-1024.png) | nouvel-abonne | `/ (200)` | 1024 | 0 px | 24 px | 24 px | 0 px |  | 177 px |  |
| [nouvel-abonne-mon-espace-1280.png](nouvel-abonne-mon-espace-1280.png) | nouvel-abonne | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-quoi-repondre-1280.png](nouvel-abonne-mon-espace-quoi-repondre-1280.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-bibliotheque-1280.png](nouvel-abonne-mon-espace-bibliotheque-1280.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-questions-1280.png](nouvel-abonne-mon-espace-questions-1280.png) | nouvel-abonne | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-s-entrainer-1280.png](nouvel-abonne-mon-espace-s-entrainer-1280.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-repliques-1280.png](nouvel-abonne-mon-espace-repliques-1280.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-lettres-1280.png](nouvel-abonne-mon-espace-lettres-1280.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-favoris-1280.png](nouvel-abonne-favoris-1280.png) | nouvel-abonne | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-carnet-1280.png](nouvel-abonne-carnet-1280.png) | nouvel-abonne | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-profil-1280.png](nouvel-abonne-profil-1280.png) | nouvel-abonne | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 133 px |  |
| [nouvel-abonne-parcours-1280.png](nouvel-abonne-parcours-1280.png) | nouvel-abonne | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-parcours-repartie-1280.png](nouvel-abonne-parcours-repartie-1280.png) | nouvel-abonne | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non | 133 px |  |
| [nouvel-abonne-vannes-1280.png](nouvel-abonne-vannes-1280.png) | nouvel-abonne | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non | 133 px |  |
| [nouvel-abonne-lettre-1280.png](nouvel-abonne-lettre-1280.png) | nouvel-abonne | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |  |
| [nouvel-abonne-accueil-1280.png](nouvel-abonne-accueil-1280.png) | nouvel-abonne | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non | 177 px |  |
