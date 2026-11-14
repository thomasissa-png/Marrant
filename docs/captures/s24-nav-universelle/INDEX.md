# Navigation universelle (s24) : preuves en images et mesures

Spécification : `docs/ux/navigation-universelle-s24.md` v5 (fait foi). Captures prises le 14/11/2026 sur la
préversion locale OUVERTE (http://localhost:5400, méthode `docs/espace-client/preversion-locale-s24.md` : build
interrupteur ouvert recopié hors du dépôt, base jetable `marrant_preview`, comptes remis à zéro par `comptes.mjs`
juste avant). Thème sombre (seul thème du site), largeurs 375 x 812, 768 x 1024, 1280 x 900, pages entières
(coupées à 3 200 px de haut), pointeur hors des liens. Script : `/root/marrant-preversion-s24/captures-nav-s24.mjs`
(mesures dans `mesures.json`). Le dépôt reste FERMÉ (`ESPACE_CLIENT_PUBLIE = false`).

- Visiteur : accueil, vannes, conseils, vidéos, parcours, articles, une fiche vanne, lettre ; menu mobile ouvert (375, 768).
- Abonné en cours et nouvel abonné : toutes les pages de l'espace (Aujourd'hui, Quoi répondre, Bibliothèque, Mes
  questions et un fil, S'entraîner, Mes répliques, Lettres, une situation, un jeu, un bilan, une fiche du coin humour
  noir), `/favoris`, `/carnet`, `/profil`, `/parcours`, `/parcours/repartie`, `/vannes`, l'accueil ; menu mobile
  ouvert sur Aujourd'hui et sur une situation (375, 768).
- Bilan : 142 captures, toutes en réponse 200, **0 débordement horizontal**, **0 page collée à gauche à 1280 px**,
  en-tête de **65 px** sur les 132 captures menu fermé.

## Les 14 critères du §5 (mesurés par script)

Sources : `playwright/tests/local/nav-universelle-s24.spec.ts` et `header-budget.spec.ts` (serveur construit
OUVERT, variables factices du job `e2e-local`), test d'inertie Jest (fermé), captures ci-dessous.

| # | Critère | Verdict | Mesure |
|---|---|---|---|
| 1 | Fermé : aucune page ne change | PASS | Jest `inertie-espace` : 47 instantanés sur 47, jamais régénérés ; hachages des textes en ligne inchangés (`profil-d10-s24`) ; Playwright fermé : en-tête d'aujourd'hui (onglet Accueil) sur 4 pages, `/mon-espace` en 404 ; suite Playwright locale fermée : 174 réussis, 0 échec |
| 2 | Même en-tête par état sur toutes les pages (375, 768, 1280) | PASS | contrôles visibles identiques (nom, adresse, position, largeur) : visiteur 11 pages, compte gratuit 12, abonné 22 (dont 10 de l'espace), aux 3 largeurs |
| 3 | Aucune seconde barre ; aucun lien deux fois ; abonné « Mon espace » et 5 liens | PASS | 1 seul en-tête, aucun autre élément collé en haut ; 0 doublon barre + menu ouvert à 320, 375, 440, 520, 640, 768, 1023 px, 3 états ; barre abonné = Mon espace, Parcours, Vannes, Conseils, Vidéos, Articles |
| 4 | 1280 px : rien de collé à gauche ; valeurs du §3 ; haut des pages publiques inchangé | PASS | marge de coque 16 / 24 / 32 px ; pages B et C de l'espace : contenu de 32 à 1 248 px (vide à droite 0) ; pages A : colonne centrée, 224 px de part et d'autre ; Aujourd'hui : écart de grille 24 px, H1 36 px ; en-tête de 65 px partout (haut de `main` à 65 px comme fermé) |
| 5 | Rubriques à 2 gestes ; téléphone sans défilement de 320 à 414 px sur 568 px | PASS | bas du bloc « Mon espace » à **530 px** à 320, 360, 375 et 414 px de large : 38 px libres à 568 de haut, 137 à 667 ; ordinateur : « Mon espace » puis la ligne de l'index |
| 6 | Aucun libellé coupé ni débordement de 320 à 1920 px ; `header-budget` 3 états, 640 et 641 | PASS | `header-budget` : 6 largeurs ordinateur x 3 états, puis 320 à 1023 px (639, 640, 641 compris) x 3 états : défilement = largeur, 0 libellé coupé, 0 chevauchement |
| 7 | Clavier, focus visible, cibles de 44 px, actif sans la teinte seule | PASS | Tab jusqu'à « Mon espace », anneau de focus présent ; actif = `aria-current` + soulignement de 2 px (+ `font-semibold` au menu) ; toutes les cibles de l'en-tête >= 44 px ; Échap et voile ferment le menu, focus rendu au bouton Menu |
| 8 | États actifs du tableau §1 | PASS | 16 adresses pour l'abonné (barre et menu), 5 à 6 pour visiteur et compte gratuit ; de 768 à 1023 px, intitulé « Mon espace » non cliquable visible, aucun lien en double ; `/favoris` du compte gratuit : vérifié en Jest seulement (la page renvoie ce compte vers l'offre, règle existante) |
| 9 | Mêmes adresses, aucune redirection ; barre visiteur §6 ; HTML serveur sans l'espace | PASS | 13 pages publiques en 200 sans redirection ; HTML serveur : `data-en-tete-universel="visiteur"`, ni « Mon espace », ni « Dans ton espace », ni `/api/espace` |
| 10 | Bouton d'offre visible partout (visiteur, gratuit), masqué sur /abonnement ; accueil de l'abonné sans achat | PASS | 1 bouton visible de 320 à 1920 px, 0 sur `/abonnement` ; accueil vu par l'abonné : 0 lien d'achat dans l'en-tête et le contenu (`abonne-en-cours-accueil-*.png`) |
| 11 | Captures pages x états x largeurs, menus fermés et ouverts | PASS partiel | 142 captures ci-dessous, visiteur et 2 abonnés ; compte gratuit non capturé (pas de compte de test gratuit dans la préversion), son en-tête est mesuré par les critères 2, 3, 6, 8 |
| 12 | Événements « clic Mon espace », « clic index », « clic Menu » | NON FAIT | noms à fixer par @data-analyst sur la convention du plan Umami ; aucun événement inventé |
| 13 | Retour par type de page, allumage du parent | PASS | situation : Quoi répondre ; jeu : S'entraîner ; bilan : « Répartie » vers `/parcours/repartie`, Parcours allumé ; pages B et S'entraîner : Mon espace ; Aujourd'hui, `/favoris`, `/carnet` : aucun retour (Jest : les 12 lignes de la table §4.3) |
| 14 | Aujourd'hui à 768 et 1280 : côte à côte, une seule action pleine, « Contenu du jour » distinct | PASS | 768 : carte du jour x=24, index x=396, même haut (177) ; 1280 : x=32 et x=652 ; 375 : carte du jour d'abord ; une seule action pleine, dans la carte du jour ; « Contenu du jour » 48 px sous la grille |

Hors critères : ligne « Blague du jour » du pied **non faite** (`components/layout/footer.tsx` est figé par hachage
dans `profil-d10-s24.test.tsx`, la toucher casse la règle « hachages inchangés » ; à faire sur go de Thomas).

## Captures et mesures

Bord gauche = premier pixel rendu du contenu de `main` ; vide à droite = espace entre le dernier pixel rendu et le
bord droit de la coque ; « collé à gauche » = bord gauche sur la marge ET plus de 25 % de la coque vide à droite.

| Capture | État | Page (statut) | Largeur | Débordement horizontal | Marge coque | Bord gauche du contenu | Vide à droite | Collé à gauche | Menu mobile (bas du bloc Mon espace / bas du menu, défilement) |
|---|---|---|---|---|---|---|---|---|---|
| [visiteur-accueil-375.png](visiteur-accueil-375.png) | visiteur | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  |  |
| [visiteur-vannes-375.png](visiteur-vannes-375.png) | visiteur | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -429 px |  |  |
| [visiteur-conseils-375.png](visiteur-conseils-375.png) | visiteur | `/conseils (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [visiteur-videos-375.png](visiteur-videos-375.png) | visiteur | `/videos (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [visiteur-parcours-375.png](visiteur-parcours-375.png) | visiteur | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [visiteur-blog-375.png](visiteur-blog-375.png) | visiteur | `/blog (200)` | 375 | 0 px | 16 px | 16 px | -841 px |  |  |
| [visiteur-fiche-vanne-375.png](visiteur-fiche-vanne-375.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [visiteur-lettre-375.png](visiteur-lettre-375.png) | visiteur | `/lettre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [visiteur-menu-mobile-vannes-375.png](visiteur-menu-mobile-vannes-375.png) | visiteur | `/vannes` | 375 | 0 px | 16 px | 0 px | -429 px |  | sans bloc / 582 px, sans défilement |
| [visiteur-accueil-768.png](visiteur-accueil-768.png) | visiteur | `/ (200)` | 768 | 0 px | 24 px | 24 px | -62 px |  |  |
| [visiteur-vannes-768.png](visiteur-vannes-768.png) | visiteur | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -44 px |  |  |
| [visiteur-conseils-768.png](visiteur-conseils-768.png) | visiteur | `/conseils (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-videos-768.png](visiteur-videos-768.png) | visiteur | `/videos (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-parcours-768.png](visiteur-parcours-768.png) | visiteur | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-blog-768.png](visiteur-blog-768.png) | visiteur | `/blog (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-fiche-vanne-768.png](visiteur-fiche-vanne-768.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-lettre-768.png](visiteur-lettre-768.png) | visiteur | `/lettre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [visiteur-menu-mobile-vannes-768.png](visiteur-menu-mobile-vannes-768.png) | visiteur | `/vannes` | 768 | 0 px | 24 px | 0 px | -44 px |  | sans bloc / 466 px, sans défilement |
| [visiteur-accueil-1280.png](visiteur-accueil-1280.png) | visiteur | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [visiteur-vannes-1280.png](visiteur-vannes-1280.png) | visiteur | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [visiteur-conseils-1280.png](visiteur-conseils-1280.png) | visiteur | `/conseils (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [visiteur-videos-1280.png](visiteur-videos-1280.png) | visiteur | `/videos (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [visiteur-parcours-1280.png](visiteur-parcours-1280.png) | visiteur | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [visiteur-blog-1280.png](visiteur-blog-1280.png) | visiteur | `/blog (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [visiteur-fiche-vanne-1280.png](visiteur-fiche-vanne-1280.png) | visiteur | `/vannes/pour-ta-valise-de-depart-chacun-a-cotise-selon-ses-moyens-cs19jkboul (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [visiteur-lettre-1280.png](visiteur-lettre-1280.png) | visiteur | `/lettre (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-mon-espace-375.png](abonne-en-cours-mon-espace-375.png) | abonne-en-cours | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-quoi-repondre-375.png](abonne-en-cours-mon-espace-quoi-repondre-375.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-bibliotheque-375.png](abonne-en-cours-mon-espace-bibliotheque-375.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-questions-375.png](abonne-en-cours-mon-espace-questions-375.png) | abonne-en-cours | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-s-entrainer-375.png](abonne-en-cours-mon-espace-s-entrainer-375.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-repliques-375.png](abonne-en-cours-mon-espace-repliques-375.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-lettres-375.png](abonne-en-cours-mon-espace-lettres-375.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-375.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-375.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 33 px | 17 px |  |  |
| [abonne-en-cours-favoris-375.png](abonne-en-cours-favoris-375.png) | abonne-en-cours | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | -37 px |  |  |
| [abonne-en-cours-carnet-375.png](abonne-en-cours-carnet-375.png) | abonne-en-cours | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-profil-375.png](abonne-en-cours-profil-375.png) | abonne-en-cours | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-parcours-375.png](abonne-en-cours-parcours-375.png) | abonne-en-cours | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-parcours-repartie-375.png](abonne-en-cours-parcours-repartie-375.png) | abonne-en-cours | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [abonne-en-cours-vannes-375.png](abonne-en-cours-vannes-375.png) | abonne-en-cours | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  |  |
| [abonne-en-cours-accueil-375.png](abonne-en-cours-accueil-375.png) | abonne-en-cours | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  |  |
| [abonne-en-cours-menu-mobile-mon-espace-375.png](abonne-en-cours-menu-mobile-mon-espace-375.png) | abonne-en-cours | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  | 530 / 811 px, défile |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  | 530 / 811 px, défile |
| [abonne-en-cours-mon-espace-768.png](abonne-en-cours-mon-espace-768.png) | abonne-en-cours | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-quoi-repondre-768.png](abonne-en-cours-mon-espace-quoi-repondre-768.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-bibliotheque-768.png](abonne-en-cours-mon-espace-bibliotheque-768.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-questions-768.png](abonne-en-cours-mon-espace-questions-768.png) | abonne-en-cours | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-s-entrainer-768.png](abonne-en-cours-mon-espace-s-entrainer-768.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-repliques-768.png](abonne-en-cours-mon-espace-repliques-768.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-lettres-768.png](abonne-en-cours-mon-espace-lettres-768.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-768.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-768.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 49 px | 25 px |  |  |
| [abonne-en-cours-favoris-768.png](abonne-en-cours-favoris-768.png) | abonne-en-cours | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-carnet-768.png](abonne-en-cours-carnet-768.png) | abonne-en-cours | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-profil-768.png](abonne-en-cours-profil-768.png) | abonne-en-cours | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-parcours-768.png](abonne-en-cours-parcours-768.png) | abonne-en-cours | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-parcours-repartie-768.png](abonne-en-cours-parcours-repartie-768.png) | abonne-en-cours | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-vannes-768.png](abonne-en-cours-vannes-768.png) | abonne-en-cours | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  |  |
| [abonne-en-cours-accueil-768.png](abonne-en-cours-accueil-768.png) | abonne-en-cours | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [abonne-en-cours-menu-mobile-mon-espace-768.png](abonne-en-cours-menu-mobile-mon-espace-768.png) | abonne-en-cours | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  | 478 / 754 px, sans défilement |
| [abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](abonne-en-cours-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  | 478 / 754 px, sans défilement |
| [abonne-en-cours-mon-espace-1280.png](abonne-en-cours-mon-espace-1280.png) | abonne-en-cours | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-quoi-repondre-1280.png](abonne-en-cours-mon-espace-quoi-repondre-1280.png) | abonne-en-cours | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-bibliotheque-1280.png](abonne-en-cours-mon-espace-bibliotheque-1280.png) | abonne-en-cours | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-questions-1280.png](abonne-en-cours-mon-espace-questions-1280.png) | abonne-en-cours | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-s-entrainer-1280.png](abonne-en-cours-mon-espace-s-entrainer-1280.png) | abonne-en-cours | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-repliques-1280.png](abonne-en-cours-mon-espace-repliques-1280.png) | abonne-en-cours | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-lettres-1280.png](abonne-en-cours-mon-espace-lettres-1280.png) | abonne-en-cours | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png](abonne-en-cours-mon-espace-fiche-situation-coloc-la-poele-1280.png) | abonne-en-cours | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png](abonne-en-cours-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | abonne-en-cours | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png](abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png) | abonne-en-cours | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](abonne-en-cours-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | abonne-en-cours | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 281 px | 249 px | non |  |
| [abonne-en-cours-favoris-1280.png](abonne-en-cours-favoris-1280.png) | abonne-en-cours | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-carnet-1280.png](abonne-en-cours-carnet-1280.png) | abonne-en-cours | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-profil-1280.png](abonne-en-cours-profil-1280.png) | abonne-en-cours | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [abonne-en-cours-parcours-1280.png](abonne-en-cours-parcours-1280.png) | abonne-en-cours | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-parcours-repartie-1280.png](abonne-en-cours-parcours-repartie-1280.png) | abonne-en-cours | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [abonne-en-cours-vannes-1280.png](abonne-en-cours-vannes-1280.png) | abonne-en-cours | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non |  |
| [abonne-en-cours-accueil-1280.png](abonne-en-cours-accueil-1280.png) | abonne-en-cours | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-375.png](nouvel-abonne-mon-espace-375.png) | nouvel-abonne | `/mon-espace (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-quoi-repondre-375.png](nouvel-abonne-mon-espace-quoi-repondre-375.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-bibliotheque-375.png](nouvel-abonne-mon-espace-bibliotheque-375.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-questions-375.png](nouvel-abonne-mon-espace-questions-375.png) | nouvel-abonne | `/mon-espace/questions (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-s-entrainer-375.png](nouvel-abonne-mon-espace-s-entrainer-375.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-repliques-375.png](nouvel-abonne-mon-espace-repliques-375.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-lettres-375.png](nouvel-abonne-mon-espace-lettres-375.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-375.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-375.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-375.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 375 | 0 px | 16 px | 33 px | 17 px |  |  |
| [nouvel-abonne-favoris-375.png](nouvel-abonne-favoris-375.png) | nouvel-abonne | `/favoris (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-carnet-375.png](nouvel-abonne-carnet-375.png) | nouvel-abonne | `/carnet (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-profil-375.png](nouvel-abonne-profil-375.png) | nouvel-abonne | `/profil (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-parcours-375.png](nouvel-abonne-parcours-375.png) | nouvel-abonne | `/parcours (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-parcours-repartie-375.png](nouvel-abonne-parcours-repartie-375.png) | nouvel-abonne | `/parcours/repartie (200)` | 375 | 0 px | 16 px | 16 px | 0 px |  |  |
| [nouvel-abonne-vannes-375.png](nouvel-abonne-vannes-375.png) | nouvel-abonne | `/vannes (200)` | 375 | 0 px | 16 px | 0 px | -1065 px |  |  |
| [nouvel-abonne-accueil-375.png](nouvel-abonne-accueil-375.png) | nouvel-abonne | `/ (200)` | 375 | 0 px | 16 px | 16 px | -565 px |  |  |
| [nouvel-abonne-menu-mobile-mon-espace-375.png](nouvel-abonne-menu-mobile-mon-espace-375.png) | nouvel-abonne | `/mon-espace` | 375 | 0 px | 16 px | 16 px | 0 px |  | 530 / 811 px, défile |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-375.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 375 | 0 px | 16 px | 16 px | 0 px |  | 530 / 811 px, défile |
| [nouvel-abonne-mon-espace-768.png](nouvel-abonne-mon-espace-768.png) | nouvel-abonne | `/mon-espace (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-quoi-repondre-768.png](nouvel-abonne-mon-espace-quoi-repondre-768.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-bibliotheque-768.png](nouvel-abonne-mon-espace-bibliotheque-768.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-questions-768.png](nouvel-abonne-mon-espace-questions-768.png) | nouvel-abonne | `/mon-espace/questions (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-s-entrainer-768.png](nouvel-abonne-mon-espace-s-entrainer-768.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-repliques-768.png](nouvel-abonne-mon-espace-repliques-768.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-lettres-768.png](nouvel-abonne-mon-espace-lettres-768.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-768.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-768.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-768.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 768 | 0 px | 24 px | 49 px | 25 px |  |  |
| [nouvel-abonne-favoris-768.png](nouvel-abonne-favoris-768.png) | nouvel-abonne | `/favoris (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-carnet-768.png](nouvel-abonne-carnet-768.png) | nouvel-abonne | `/carnet (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-profil-768.png](nouvel-abonne-profil-768.png) | nouvel-abonne | `/profil (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-parcours-768.png](nouvel-abonne-parcours-768.png) | nouvel-abonne | `/parcours (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-parcours-repartie-768.png](nouvel-abonne-parcours-repartie-768.png) | nouvel-abonne | `/parcours/repartie (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-vannes-768.png](nouvel-abonne-vannes-768.png) | nouvel-abonne | `/vannes (200)` | 768 | 0 px | 24 px | 0 px | -680 px |  |  |
| [nouvel-abonne-accueil-768.png](nouvel-abonne-accueil-768.png) | nouvel-abonne | `/ (200)` | 768 | 0 px | 24 px | 24 px | 0 px |  |  |
| [nouvel-abonne-menu-mobile-mon-espace-768.png](nouvel-abonne-menu-mobile-mon-espace-768.png) | nouvel-abonne | `/mon-espace` | 768 | 0 px | 24 px | 24 px | 0 px |  | 478 / 754 px, sans défilement |
| [nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png](nouvel-abonne-menu-mobile-mon-espace-fiche-situation-coloc-la-poele-768.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele` | 768 | 0 px | 24 px | 24 px | 0 px |  | 478 / 754 px, sans défilement |
| [nouvel-abonne-mon-espace-1280.png](nouvel-abonne-mon-espace-1280.png) | nouvel-abonne | `/mon-espace (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-quoi-repondre-1280.png](nouvel-abonne-mon-espace-quoi-repondre-1280.png) | nouvel-abonne | `/mon-espace/quoi-repondre (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-bibliotheque-1280.png](nouvel-abonne-mon-espace-bibliotheque-1280.png) | nouvel-abonne | `/mon-espace/bibliotheque (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-questions-1280.png](nouvel-abonne-mon-espace-questions-1280.png) | nouvel-abonne | `/mon-espace/questions (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-s-entrainer-1280.png](nouvel-abonne-mon-espace-s-entrainer-1280.png) | nouvel-abonne | `/mon-espace/s-entrainer (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-repliques-1280.png](nouvel-abonne-mon-espace-repliques-1280.png) | nouvel-abonne | `/mon-espace/repliques (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-lettres-1280.png](nouvel-abonne-mon-espace-lettres-1280.png) | nouvel-abonne | `/mon-espace/lettres (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png](nouvel-abonne-mon-espace-fiche-situation-coloc-la-poele-1280.png) | nouvel-abonne | `/mon-espace/fiche/situation/coloc-la-poele (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png](nouvel-abonne-mon-espace-fiche-jeu-quelle-replique-1-1280.png) | nouvel-abonne | `/mon-espace/fiche/jeu/quelle-replique-1 (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png](nouvel-abonne-mon-espace-fiche-bilan-bilan-repartie-1280.png) | nouvel-abonne | `/mon-espace/fiche/bilan/bilan-repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png](nouvel-abonne-mon-espace-fiche-humour-noir-hn-qui-est-dans-la-piece-1280.png) | nouvel-abonne | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece (200)` | 1280 | 0 px | 32 px | 281 px | 249 px | non |  |
| [nouvel-abonne-favoris-1280.png](nouvel-abonne-favoris-1280.png) | nouvel-abonne | `/favoris (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-carnet-1280.png](nouvel-abonne-carnet-1280.png) | nouvel-abonne | `/carnet (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-profil-1280.png](nouvel-abonne-profil-1280.png) | nouvel-abonne | `/profil (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
| [nouvel-abonne-parcours-1280.png](nouvel-abonne-parcours-1280.png) | nouvel-abonne | `/parcours (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-parcours-repartie-1280.png](nouvel-abonne-parcours-repartie-1280.png) | nouvel-abonne | `/parcours/repartie (200)` | 1280 | 0 px | 32 px | 256 px | 224 px | non |  |
| [nouvel-abonne-vannes-1280.png](nouvel-abonne-vannes-1280.png) | nouvel-abonne | `/vannes (200)` | 1280 | 0 px | 32 px | 32 px | -120 px | non |  |
| [nouvel-abonne-accueil-1280.png](nouvel-abonne-accueil-1280.png) | nouvel-abonne | `/ (200)` | 1280 | 0 px | 32 px | 32 px | 0 px | non |  |
