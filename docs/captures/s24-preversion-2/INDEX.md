# Captures de la préversion locale s24, après le lot D11c (espace Premium ouvert)

Produites le 14/11/2026 sur http://localhost:5400 (build OUVERT du lot D11c, `BUILD_ID lMWHbm8o0gNsHRd7d2XoR`,
remplacé selon `docs/espace-client/preversion-locale-s24.md`), Chromium local headless, thème sombre, largeurs
**375 px** (fenêtre 375 x 812) et **1280 px** (1280 x 800). **118 captures**, même liste et même nommage que
`docs/captures/s24-preversion/` (avant) : `NN-page-etat-COMPTE-LARGEUR.png`, comptes `en-cours` et `nouvel`.
Comptes remis à zéro par `comptes.mjs` avant chaque largeur et à la fin.

Différences de méthode avec l'avant (pour comparer juste) :
- pleine page = `fullPage` de Playwright, fenêtre gardée à 812 ou 800 px de haut, un contexte neuf par largeur
  (l'avant agrandissait parfois la fenêtre à la hauteur de la page, ce qui étirait tout ce qui dépend de `svh`) ;
- pointeur ramené en (1, 1) après chaque chargement : plus de fond de survol sur la cloche ou « Plus » ;
- 01 à 04 et 30 : la fenêtre visible ; 08 : la section `#mission` seule (comme avant).
- `mesures.json` : mesures brutes de chaque capture (statut HTTP, débordement, nombre de H1, texte suspect).

## Pages, statut et débordement horizontal (mesuré par script)

Débordement = `document.documentElement.scrollWidth > innerWidth`, relevé sur chaque capture.

| NN | Page / état | Adresse | HTTP | Fichiers | scrollWidth max 375 / 1280 | Débordement |
|---|---|---|---|---|---|---|
| 01 | En-tête et barre, fermés | `/mon-espace` | 200 | 4 | 375 / 1280 | non |
| 02 | Menu « Plus » ouvert | `/mon-espace` | 200 | 4 | 375 / 1280 | non |
| 03 | Menu du compte ouvert | `/mon-espace` | 200 | 4 | 375 / 1280 | non |
| 04 | Cloche ouverte | `/mon-espace` | 200 | 4 | 375 / 1280 | non |
| 05 | Aujourd'hui | `/mon-espace` | 200 | 4 | 375 / 1280 | non |
| 06 | S'entraîner, carte avant réponse | `/mon-espace/s-entrainer` | 200 | 4 | 375 / 1280 | non |
| 07 | S'entraîner, après « À moitié » | `/mon-espace/s-entrainer` | 200 | 4 | 375 / 1280 | non |
| 08 | Mission (section) | `/mon-espace/s-entrainer#mission` | (ancre, même document) | 4 | 375 / 1280 | non |
| 09 | Quoi répondre, liste | `/mon-espace/quoi-repondre` | 200 | 4 | 375 / 1280 | non |
| 10 | Quoi répondre, filtres ouverts | `/mon-espace/quoi-repondre` | 200 | 4 | 375 / 1280 | non |
| 11 | Situation « Coloc : la poêle » | `/mon-espace/fiche/situation/coloc-la-poele` | 200 | 4 | 375 / 1280 | non |
| 12 | Parcours, liste | `/parcours` | 200 | 4 | 375 / 1280 | non |
| 13 | Parcours Répartie | `/parcours/repartie` | 200 | 4 | 375 / 1280 | non |
| 14 | Bibliothèque | `/mon-espace/bibliotheque` | 200 | 4 | 375 / 1280 | non |
| 15 | Fiche construction | `/mon-espace/fiche/construction/le-faux-secret` | 200 | 4 | 375 / 1280 | non |
| 16 | Fiche formule | `/mon-espace/fiche/formule/formules-proverbes` | 200 | 4 | 375 / 1280 | non |
| 17 | Fiche vocabulaire | `/mon-espace/fiche/vocabulaire/vocabulaire-quand-on-te-lance-une-pique` | 200 | 4 | 375 / 1280 | non |
| 18 | Fiche À plat | `/mon-espace/fiche/a-plat/a-plat-le-silence-apres-ta-vanne` | 200 | 4 | 375 / 1280 | non |
| 19 | Fiche séance | `/mon-espace/fiche/seance/seance-dix-chambrages-dix-secondes` | 200 | 4 | 375 / 1280 | non |
| 20 | Fiche jeu | `/mon-espace/fiche/jeu/quelle-replique-1` | 200 | 4 | 375 / 1280 | non |
| 21 | Fiche bilan | `/mon-espace/fiche/bilan/bilan-repartie` | 200 | 4 | 375 / 1280 | non |
| 22 | Humour noir, avant « Entrer » | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece` | 200 | 4 | 375 / 1280 | non |
| 23 | Humour noir, après « Entrer » | même adresse | 200 | 4 | 375 / 1280 | non |
| 24 | Mes questions, liste | `/mon-espace/questions` | 200 | 4 | 375 / 1280 | non |
| 25 | Un fil (abonné en cours) | `/mon-espace/questions/<id>` | 200 | 2 | 375 / 1280 | non |
| 26 | Mes répliques | `/mon-espace/repliques` | 200 | 4 | 375 / 1280 | non |
| 27 | Lettres | `/mon-espace/lettres` | 200 | 4 | 375 / 1280 | non |
| 28 | Favoris | `/favoris` | 200 | 4 | 375 / 1280 | non |
| 29 | Mon profil | `/profil` | 200 | 4 | 375 / 1280 | non |
| 30 | Bonus non ouvert (404) | `/mon-espace/bonus/bonus-cap-3` | 404 (attendu) | 4 | 375 / 1280 | non |

**Totaux [LIVE]** : 118 captures, débordement **0** (scrollWidth = largeur partout), 110 en 200, 4 en 404 attendu
(30), 4 ancres (08) ; erreur JavaScript `pageerror` : **0** sur les 4 passages ; un seul H1 sur chaque capture ;
« undefined / null / NaN / [object Object] » visible dans `main` : **0**. Connexion des deux comptes : arrivée
`/mon-espace` ; `/abonnement` pour l'un et l'autre : `/mon-espace`.

## Avant / après, défaut par défaut (revue `docs/design/harmonie-preversion-s24.md`)

Mesures « après » par script sur la préversion (abonné en cours) ; « avant » : revue et `../s24-preversion/INDEX.md`.

| # | Défaut | Avant | Après (mesure) | Captures à comparer |
|---|---|---|---|---|
| 1 | Onglet actif coupé à 375 px | « Bibliothèqu › », mot sous le fondu et le chevron | « Bibliothèque » entière, son bord droit à **129 px** du bord de la liste (fondu : 40 px), indice de suite allumé, sur Bibliothèque et les 4 fiches de ses blocs ; Quoi répondre 116 px, Parcours 152 px, Mes questions 114 px (fin de course, sans indice) | 14 à 17, 22, 23 (375) |
| 2 | « Vocabulaire : Vocabulaire : » | 8 lignes doublées | **0** occurrence dans la Bibliothèque ; « Formules à détourner : Proverbes » inchangé | 14 |
| 3 | Trois largeurs à 1280 px | 720 à gauche, ~770 centré (Parcours), 1216 (Questions, Favoris, Profil) | Bord gauche du contenu à **32 px** partout (celui du logo) ; cartes à **720 px** sur Aujourd'hui, S'entraîner, Quoi répondre, fiches, Parcours, Parcours Répartie, Bibliothèque, Lettres, Mes répliques, Profil ; **1216 px** sur Mes questions et Favoris (listes larges) | 05 à 29 (1280) |
| 4 | Carte « Ton premier pas » très haute | ~1 500 px de vide (capture avec fenêtre agrandie) | **Non modifiée** (étalon E5 validé, GO de la revue D3). Fenêtre de 812 px gardée : la carte suit `100svh`, plus de vide démesuré | 05 nouvel 375 |
| 5 | Favoris à 375 px | « Tout » à x = 0, « Vidéos » coupé sans indice | « Tout » à **x = 16** (marge de la page), fondu de 40 px et chevron allumés, éteints en fin de course ; dès 1 024 px, rangée à la ligne | 28 (375) |
| 6 | 404 : boutons sur deux lignes | « Retour à l'accueil » et « Voir les vannes » chacun sur 2 lignes | L'un sous l'autre à 375 px, même largeur (180 px), **1 ligne** de texte chacun ; côte à côte dès 640 px ; emoji gardé | 30 |
| 7 | Guillemet orphelin, flèche seule | « « » en fin de ligne (06/07 nouvel), « → » en début de ligne (16) | Espaces sécables avant « ; : ! ? » », après « « » et avant « → » : **0** sur les 14 pages relevées (textes de l'abonné et de l'équipe exclus) | 06, 07 nouvel 375 ; 16 |
| 8 | « Ça va ? » coupé avant « » » | guillemet fermant seul en début de ligne | même correction que 7 | 06 (1280) |
| 9 | Cloche en fenêtre centrée avec voile | fenêtre au centre, voile sombre | Panneau ancré : bord droit à **1200 px** = bord droit de la cloche, **8 px** sous elle, **320 px** de large, **0** voile ; feuille du bas gardée sous 768 px | 04 (1280 et 375) |
| 10 | Pas de lien « retour » | étiquette de type non cliquable | Lien « ‹ Liste » en tête de chaque fiche, de la lettre et du fil (44 px) : situation et À plat → Quoi répondre ; construction, formule, vocabulaire, humour noir → Bibliothèque ; séance, jeu, bilan → Parcours ; étiquette de type gardée si elle dit autre chose | 11, 15 à 21, 23, 25 |
| 11 | Apostrophe droite dans le H1 | « Aujourd'hui » (H1) / « Aujourd’hui » (onglet) | « Aujourd’hui » aux deux endroits | 01, 05 |
| 12 | 1er groupe de « Plus » sans titre | (sans objet) | **Non modifié** : décision copy, à trancher (rapport du lot D11c) | 02 |
| 13 | ~24 px de vide sous le lien des cartes simples | Conseil, Vidéo du jour et Lettres : ~24 px de vide en trop sous le lien (revue ; cible de 44 px = 12 px sous le texte + 24 de marge) | **29 px** sous le texte, **25 px** au-dessus du titre (cible de 44 px gardée) ; carte vide de Lettres : même réglage | 05, 27 |
| 14 | Écart H1 / sous-titre | Aujourd'hui 4 px (`mt-1`), S'entraîner 24 px (`gap-6`), d'après le code | **8 px** sur les deux | 05, 06 |
| 15 | Anneau de focus sur la cloche | artefact de capture | absent (pointeur et focus remis à zéro à chaque page) | 01 |
| 16 | Humour noir : 2e « Voir » | après « Entrer », la liste du coin | Depuis l'adresse d'une fiche : **la fiche demandée** (H1 « Qui est dans la pièce ») ; depuis la Bibliothèque : la liste, comme avant | 22 → 23 |
| 17 | 404 sans en-tête | (sans objet) | Inchangé (vraie 404 du site, verdict de la revue) | 30 |

Rubrique supplémentaire du lot : `/abonnement` pour un abonné Premium actif, espace ouvert, mène à « Aujourd'hui »
(`/mon-espace`) au lieu de `/vannes` (décision du 12/11) ; fermé, toujours `/vannes`.

## Artefacts écartés

- 08 « statut 0 » : la page est déjà chargée (06/07), l'ancre `#mission` ne refait pas de requête ; S'entraîner répond 200.
- La date « Répondu le 14 novembre » de la cloche vient de la réponse factice écrite par `comptes.mjs`.
