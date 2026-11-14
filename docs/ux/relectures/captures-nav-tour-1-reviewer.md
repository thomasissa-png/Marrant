# Relecture à l'aveugle des captures : navigation universelle s24, tour 1 (@reviewer)

Base : 142 captures `docs/captures/s24-nav-universelle/` (sombre, 375/768/1280), lues image par image sur 24 captures
représentatives (3 états, 3 largeurs, menus ouverts, pages A/B/C, fiches situation/jeu/bilan/humour noir), spec v5,
code (`en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `components/espace/rubriques.ts`, `ui/button.tsx`), site
actuel `docs/captures/s24-entete-diagnostic/`. Le chemin `apps/web/src/lib/espace/rubriques.ts` du brief n'existe pas.

**Note : 6,5/10. 5 fautes dures, 9 pistes.** La navigation elle-même est juste (une barre, « Mon espace » + 5, retours,
allumages, coque centrée) ; les points perdus viennent d'une cible tactile, de la typographie de l'espace et des preuves.

## 1. Les 14 critères : le PASS de l'INDEX est-il vrai sur les images ?

| # | INDEX | Sur les images | Ce que je vois |
|---|---|---|---|
| 1 | PASS | **Non prouvé** | Aucune capture interrupteur fermé dans le dossier ; la spec exige « captures avant et après ». Verdict repose sur Jest seul (FD5) |
| 2 | PASS | Vrai | Abonné 1280 : mêmes positions sur Aujourd'hui, situation, bilan, humour noir, favoris, carnet, S'entraîner ; visiteur idem accueil/parcours/vannes ; 375 et 768 idem |
| 3 | PASS | Vrai | Barre abonné = Mon espace, Parcours, Vannes, Conseils, Vidéos, Articles ; aucune seconde barre ; à 768 l'intitulé du menu n'est pas un lien |
| 4 | PASS | Vrai | Aujourd'hui remplit les 2 colonnes ; pages A centrées (x 256 à 1024) ; `/parcours` visiteur : fil à y 106, H1 à y 154, comme `site-parcours-1280` |
| 5 | PASS | Vrai à 812 | Menu 375 : 8 entrées visibles sans défiler (Carnet à y 507). 568 px non capturé, mesure script seule |
| 6 | PASS | Vrai pour l'en-tête | Aucun libellé d'en-tête coupé ; les puces de `/vannes` coupées au bord sont un carrousel existant |
| 7 | PASS | **Faux** | `visiteur-menu-mobile-vannes-768.png` : bouton « Premium · 1,99 €/mois » du menu haut de 32 px (y 418 à 450). Focus jamais capturé (FD1) |
| 8 | PASS | Vrai | Aujourd'hui, favoris, carnet : Mon espace ; situation : Mon espace en barre + « Quoi répondre » au menu 768 ; bilan : Parcours ; accueil : aucun |
| 9 | PASS | Non vérifiable en image | HTML serveur : hors capture. Barre visiteur conforme au §1 |
| 10 | PASS | Vrai | Bouton d'offre visible visiteur 375/768/1280 ; `abonne-en-cours-accueil-1280.png` : aucun achat jusqu'à « Prochainement » |
| 11 | PASS partiel | Vrai (partiel) | Manquent aussi : fermé, 1024 à 1279 px, focus, bas du menu abonné 375 (Mon profil, Déconnexion hors cadre) |
| 12 | NON FAIT | Vrai | Rien à voir |
| 13 | PASS | Vrai | Retour : Quoi répondre (situation), S’entraîner (jeu), Répartie (bilan), Bibliothèque (humour noir), Mon espace (S'entraîner) ; Aujourd'hui sans retour ; favoris/carnet : repères publics |
| 14 | PASS | Vrai à la lettre | Côte à côte à 768 et 1280, un seul bouton plein, section distincte. Poids de l'index discutable (P4) |

## 2. Fautes dures

**FD1. Cible de 32 px dans le menu de 768 à 1023 px (critère 7 faux).** `visiteur-menu-mobile-vannes-768.png`.
`buttonVariants` taille `sm` = `h-8 ... max-md:h-11` (`ui/button.tsx:33`) : 44 px sous 768, 32 px au-dessus. Concerne aussi
l'inscrit gratuit. Correction : `menu-mobile-universel.tsx:104`, classe `"h-11 w-full"` au lieu de `"w-full"` ; étendre
le test des cibles de 44 px au menu ouvert à 768 et 1023 px.

**FD2. Apostrophes droites et courbes mélangées sur le même écran (règle `typographie-s21`).**
`abonne-en-cours-mon-espace-1280.png` : H1 « Aujourd’hui » et, juste dessous, « l'esprit de l'escalier », « t'entraînes ».
`…-s-entrainer-1280.png` : H1 « S’entraîner » / intro droite. `…-fiche-jeu-quelle-replique-1-375.png` : « Retour : S’entraîner »
puis « Quelqu'un », « J'ai », « qu'on ». `…-situation-…-1280.png` : « Ta réponse d'abord », « l'évier ». `nouvel-abonne-mon-espace-1280.png` :
« Quelqu'un te lance ». `abonne-en-cours-accueil-1280.png` (page publique) : « Reprendre l’étape 3 » sous « qu'on écoute ».
Correction : ' → ’ dans `config/textes/espace-aujourdhui.ts:31`, `config/textes/espace-cartes.ts:22` et tout texte visible
de `config/textes/espace-*.ts` et `data/espace/*.json` ; ajouter `/mon-espace`, une fiche de chaque type et l'accueil abonné
à `playwright/tests/local/typographie-s21.spec.ts`.

**FD3. Guillemets anglais dans l'espace.** `abonne-en-cours-mon-espace-fiche-bilan-bilan-repartie-1280.png`, bloc « À toi » :
“Après tout le monde, oui. … Tu me remercieras.” alors que tout le site emploie « ». 109 occurrences de “ dans
`data/espace/` (situations 48, constructions 22, jeux 17, bilans 13…). Correction : remplacer par « » avec espace fine
insécable dans le texte affiché ; même test que FD2.

**FD4. Cartes « Conseil du jour » et « Vidéo du jour » vides aux trois quarts (régression).** `abonne-en-cours-mon-espace-1280.png`
y 746 à 1051 : un lien en haut, ~210 px de fond vide ; idem 768 (Conseil). L'accueil du même abonné montre ces contenus
complets (vignette, texte), et l'ancien Aujourd'hui (`espace-aujourdhui-1280.png`) avait des cartes à hauteur de contenu.
Correction : `items-start` sur la grille « Contenu du jour » au minimum ; mieux, chapô du conseil et vignette de la vidéo.

**FD5. Critère 1 déclaré PASS sans les captures exigées.** Spec §5.1 : « captures avant et après ». Correction : capturer
accueil, `/vannes`, `/mon-espace` (404) interrupteur fermé à 375 et 1280, à côté des `site-*`, ou passer le critère en
« PASS (Jest), captures à faire ».

## 3. Pistes

- **P1 régression 375 abonné** (`abonne-en-cours-menu-mobile-mon-espace-375.png`) : loupe et icône compte quittent la barre
  (présentes sur `espace-aujourdhui-375.png`) ; « Mon profil » et « Déconnexion » sont sous le pli du menu à 812 px. Conforme
  au §1, mais Mon profil passe de 1 à 3 gestes : à faire trancher par Thomas, et capturer le bas du menu.
- **P2** Visiteur 768, menu ouvert : le bouton d'offre quitte la barre, loupe et Connexion restent au milieu avec un trou.
- **P3** « Ton retour » (avis sur l'exercice) sous « Retour : Quoi répondre » (navigation) sur la même fiche : deux sens. @copywriter.
- **P4** `nouvel-abonne-mon-espace-1280.png` : l'index (448 px) pèse deux fois la carte du jour, 220 px de vide sous elle.
- **P5** Filet `border-t` orphelin en haut des cartes « À toi » (situation 1280 y 672, bilan, jeu 375).
- **P6** Fiche humour noir sans H1 ni durée, contrairement aux autres pages A.
- **P7** « Contenu du jour » (espace) contre « Ton contenu du jour » (accueil) ; séparateur « Jonathan Cohen - Serge » (trait
  d'union) contre « – » à l'accueil.
- **P8** « Mon espace » actif à 768 : `px-1.5`, le fond colle au texte (6 px) ; `px-3` sur ce seul lien.
- **P9** « Ce qu'on aurait pu dire » (jeu 375) : texte gras sans chevron ; si c'est un dépliant, l'affordance manque.

Rien à signaler : tirets cadratins (aucun vu), accents, majuscules, coupures de libellés d'en-tête, pied identique.
