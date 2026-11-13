# Captures de la préversion locale s24 (espace Premium ouvert)

Produites le 13/11/2026 sur http://localhost:5400 (mode d'emploi : `docs/espace-client/preversion-locale-s24.md`),
Playwright headless (Chromium local), thème sombre (le site est sombre seul : `color-scheme: dark`, pas de bascule),
pleine page, largeurs **375 px** (téléphone) et **1280 px**. **118 captures** : 30 pages ou états × 2 largeurs × 2 comptes,
moins le fil de question du nouvel abonné (il n'en a pas).

**Nom des fichiers** : `NN-page-etat-COMPTE-LARGEUR.png`, `NN` = ordre de navigation, `COMPTE` = `en-cours`
(abonne-en-cours@preversion.test) ou `nouvel` (nouvel-abonne@preversion.test). Exemple : `07-s-entrainer-carte-apres-nouvel-375.png`.

Exceptions au « pleine page » : 01 à 04 (en-tête et menus superposés) sont la fenêtre visible, pour voir le menu ouvert
à sa place ; 08 est la section « mission » seule (`section#mission`), le reste de la page étant en 06/07.

## Liste des captures (dans l'ordre de navigation)

Débordement mesuré par script à chaque capture : `document.documentElement.scrollWidth > innerWidth`.
Colonne « Fichiers » : nombre de captures (2 comptes × 2 largeurs).

| NN | Page / état | Adresse | HTTP | Fichiers | Débordement horizontal |
|---|---|---|---|---|---|
| 01 | En-tête et barre des rubriques, fermés | `/mon-espace` | 200 | 4 | non |
| 02 | Menu « Plus » ouvert | `/mon-espace` | 200 | 4 | non |
| 03 | Menu du compte ouvert | `/mon-espace` | 200 | 4 | non |
| 04 | Cloche ouverte | `/mon-espace` | 200 | 4 | non |
| 05 | Aujourd'hui | `/mon-espace` | 200 | 4 | non |
| 06 | S'entraîner, carte de rafale avant réponse | `/mon-espace/s-entrainer` | 200 | 4 | non |
| 07 | S'entraîner, même carte après « À moitié » | `/mon-espace/s-entrainer` | 200 | 4 | non |
| 08 | Mission (section de S'entraîner) | `/mon-espace/s-entrainer#mission` | (ancre) | 4 | non |
| 09 | Quoi répondre, liste | `/mon-espace/quoi-repondre` | 200 | 4 | non |
| 10 | Quoi répondre, filtres ouverts | `/mon-espace/quoi-repondre` | 200 | 4 | non |
| 11 | Une situation (Coloc : la poêle) | `/mon-espace/fiche/situation/coloc-la-poele` | 200 | 4 | non |
| 12 | Parcours, liste | `/parcours` | 200 | 4 | non |
| 13 | Une page de parcours (Répartie) | `/parcours/repartie` | 200 | 4 | non |
| 14 | Bibliothèque | `/mon-espace/bibliotheque` | 200 | 4 | non |
| 15 | Fiche construction | `/mon-espace/fiche/construction/le-faux-secret` | 200 | 4 | non |
| 16 | Fiche formule | `/mon-espace/fiche/formule/formules-proverbes` | 200 | 4 | non |
| 17 | Fiche vocabulaire | `/mon-espace/fiche/vocabulaire/vocabulaire-quand-on-te-lance-une-pique` | 200 | 4 | non |
| 18 | Fiche À plat | `/mon-espace/fiche/a-plat/a-plat-le-silence-apres-ta-vanne` | 200 | 4 | non |
| 19 | Fiche séance | `/mon-espace/fiche/seance/seance-dix-chambrages-dix-secondes` | 200 | 4 | non |
| 20 | Fiche jeu | `/mon-espace/fiche/jeu/quelle-replique-1` | 200 | 4 | non |
| 21 | Fiche bilan | `/mon-espace/fiche/bilan/bilan-repartie` | 200 | 4 | non |
| 22 | Coin Humour noir, avant « Entrer » | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece` | 200 | 4 | non |
| 23 | Coin Humour noir, après « Entrer » | `/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece` | 200 | 4 | non |
| 24 | Mes questions, liste | `/mon-espace/questions` | 200 | 4 | non |
| 25 | Mes questions, un fil (abonné en cours seulement) | `/mon-espace/questions/<id du fil>` | 200 | 2 | non |
| 26 | Mes répliques | `/mon-espace/repliques` | 200 | 4 | non |
| 27 | Lettres | `/mon-espace/lettres` | 200 | 4 | non |
| 28 | Favoris | `/favoris` | 200 | 4 | non |
| 29 | Mon profil | `/profil` | 200 | 4 | non |
| 30 | Bonus non ouvert (404 neutre) | `/mon-espace/bonus/bonus-cap-3` | 404 (attendu) | 4 | non |

Le type de fiche « mission » n'a pas de page propre : c'est la section `#mission` de S'entraîner (08).
Le type « Écouter » existe dans le code mais `ecouter.json` est vide : aucune fiche à capturer.
`bonus.json` est vide aussi : il n'existe aucun bonus, donc la 404 de 30 est celle de n'importe quel id de bonus.

## Mesures automatiques (118 captures, [LIVE])

- Débordement horizontal : **0** sur 118 (375 et 1280).
- Erreur JavaScript (`pageerror`) : **0**. Erreur console : seulement la 404 attendue de la page 30.
- Écran d'erreur, page blanche, chargement sans fin, « undefined/null/NaN/[object Object] » visible : **0**.
- Un seul H1 par page partout. Texte coupé par `text-overflow`/`line-clamp` dans `main` : **0** détecté.

## Anomalies vues à l'œil (lecture des captures)

À trancher par @design / @fullstack ; rien n'est corrigé ici.

1. **Rubrique courante coupée dans la barre à 375 px** : sur Bibliothèque et ses fiches (14, 15, 16, 17, 22, 23),
   l'onglet actif s'affiche « Bibliothèqu › », le mot coupé sous le fondu et le chevron. Le commentaire du composant
   (`espace-barre.tsx`) promet une rubrique courante « jamais coupée en plein mot ».
2. **Titre doublé dans la Bibliothèque** : les entrées du vocabulaire se lisent « Vocabulaire : Vocabulaire : quand on
   te lance une pique », « Vocabulaire : Vocabulaire : les pièces d'une blague » (14, les deux largeurs).
3. **Humour noir après « Entrer »** (23) : à l'adresse de la fiche `hn-qui-est-dans-la-piece`, on voit la liste du coin
   (8 entrées, la première en surbrillance), pas la fiche elle-même. Il faut un deuxième clic sur « Voir ».
   Peut-être voulu (3.12) ; à confirmer.
4. **Largeurs et alignements différents à 1280 px** : la plupart des pages ont une colonne d'environ 720 px collée
   à gauche, moitié droite vide (05 à 11, 14 à 23, 25 à 27) ; Parcours (12, 13) est centré ; Mes questions (24, deux
   colonnes), Favoris (28, grille) et Mon profil (29) prennent toute la largeur. Trois mises en page pour un même espace.
5. **Carte « Ton premier pas » à 375 px (05, nouvel abonné)** : la carte est très haute, avec un grand vide entre la
   question et « 5 min / Commencer ». À 1280 px elle est compacte.
6. **Favoris à 375 px (28)** : l'onglet « Vidéos » est coupé au bord droit, sans indice de défilement (pas de chevron,
   contrairement à la barre des rubriques). Pas de débordement de page : c'est la rangée d'onglets qui défile.
7. **404 à 375 px (30)** : ni l'en-tête ni la barre de l'espace ; les deux boutons « Retour à l'accueil » et
   « Voir les vannes » passent chacun sur deux lignes, serrés.
8. **Guillemet orphelin** : « Quelqu'un se tourne vers toi : « » en fin de ligne puis « Et toi, tu fais quoi ? » à
   la ligne suivante (06/07 nouvel abonné, 375 px) : l'espace après « n'est pas insécable. Même chose pour
   les flèches « → » en fin de ligne dans la fiche formule (16).
9. **Cloche à 1280 px (04)** : s'ouvre en fenêtre au centre de l'écran, pas sous la cloche (à 375 px : panneau du bas).
   À confirmer avec la maquette.

États normaux, pas des anomalies : boutons « Oui / À moitié / Rien » grisés sur les fiches (attente « Prends ton temps »,
`aria-disabled`) ; filtres de Quoi répondre toujours ouverts à 1280 px (pas de bouton « Filtrer les cartes »,
10 = 09 à cette largeur) ; « Plus » souligné sur S'entraîner, jeu, séance, Mes répliques, Lettres, Favoris.

## Artefacts de capture écartés (vérifiés, pas des bugs)

- Le clic Playwright standard sur « Plus » à 375 px défile la barre puis clique : le défilement referme le menu
  (`surDefilement`, voulu). Au doigt ou à la souris, barre défilée, le menu s'ouvre ([LIVE] : tap et clic souris testés).
  Captures 02 refaites avec un clic aux coordonnées.
- Le mode `fullPage` de Playwright rallumait le chevron « › » de la barre à 1280 px après un passage à 375 px ;
  absent au chargement direct en 1280. Captures refaites en agrandissant la fenêtre à la hauteur de la page.
- Une première série à 375 px montrait l'en-tête collant au milieu de la page (capture prise défilée) : refait
  après retour en haut de page.
- 01 à 1280 px (abonné en cours) : la cloche garde l'anneau de focus du menu fermé juste avant (Échap).

## État des comptes

Les captures ont joué une carte (« À moitié ») par compte, ouvert le fil de question de l'abonné en cours
(pastille retombée) et noté « Entrer » dans le coin Humour noir (cookie du navigateur de capture seulement).
Comptes remis à zéro ensuite par `node /root/marrant-preversion-s24/comptes.mjs` (vérifié en base : abonné en cours
4 cartes jouées + 2 en attente, question « REPONDU » non lue ; nouvel abonné vierge). Chaque remise à zéro recrée
les comptes : une session ouverte avant est à rouvrir. Le faux Resend a noté une ligne « Mes questions » par remise à zéro
dans `emails.log` (rien d'envoyé).
