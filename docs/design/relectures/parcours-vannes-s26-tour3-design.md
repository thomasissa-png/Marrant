# Relecture design à l'aveugle, Parcours et Vannes, s26 tour 3 (interrupteur ouvert)

Sources : brief v7 (grille Design), `docs/design/parcours-vannes-s26.md`, captures `docs/captures/s26/lot2-tour-3/{parcours,vannes}/` (lues : visiteur 375/1280/1920, en-cours 375/1280, nouvel 1280 pour la liste ; Répartie visiteur 375/1280, en-cours 1280 ; Vannes visiteur 375/1280, en-cours 1280). Code lu : `vannes-list.tsx`, `parcours-content.tsx`, `parcours-step-card.tsx`, `list-pagination.tsx`. Non relus à l'écran : 768, 1456, gratuit et nouvel de Vannes et de Répartie (je m'appuie sur le gate pour eux).

## Gate typographique (cité, `TAILLES-*.md`)
- `/parcours` : 4 tailles (24/20/16/14 à 375 et 768 ; 30/20/16/14 dès 1280) et 5 à 6 combinaisons sur les 4 comptes et les 4 largeurs. Plafonds (4 tailles, 6 combinaisons) respectés, pas de dépassement. PASS.
- `/parcours/repartie` : 3 à 4 tailles, 4 à 6 combinaisons. PASS.
- `/vannes` : 3 tailles (30 ou 24/16/14), 4 combinaisons partout. PASS, la plus sobre des trois.
- Toutes en 400/600, hors échelle : rien. Aplat violet : un seul par écran (bouton Premium de l'en-tête chez le visiteur et le gratuit, bouton de la page chez l'abonné ; pastille « 1 » de la pagination sur Vannes abonné, seul aplat de cet écran).

## Parcours

### Constats (captures)
- Liste visiteur 1280 : H1 blanc à gauche, chapô, quiz 4 colonnes à droite, cartes 6/6, dernière carte en 7/5, « Explore aussi » 4/4/4, FAQ 4/8. La largeur est utilisée (contenu 1 120 px). Le vide sous le chapô (environ 210 px à gauche du quiz) est un vide de fin de colonne, permis.
- Cartes d'une rangée de même hauteur, vide en fin de carte (Confiance : environ 100 px sous « Sans compte »), décision du 19/11, non notée. Aucun vide > 32 px au milieu d'un bloc : témoignage vers « Programme » 30 px mesurés, méta vers titre 8 px.
- Méta de la liste sans « · », « Ton cap » neutre : conformes.
- Abonné 1280 : « Reprendre » seul plein, rail 8/4 avec « Ton cap », barres `n/total` sur les cartes commencées, contours ailleurs. Cohérent entre en-cours et nouvel (même squelette, « Commencer l'étape 1 » plein).
- Détail Répartie 1280 : étapes 8 colonnes, rail 4 colonnes. Visiteur : étape 1 lisible, étapes 2+ fermées avec verrou, une seule offre (contour « Passer à l'étape 2 », plein dans l'en-tête). Abonné : rail sommaire avec barre, « Fait », « Reprendre » plein, « Voir » en contour.
- Cibles : « Programme », réponses du quiz, boutons de carte mesurés à 44 à 46 px sur capture. OK.

### Fautes dures (chiffrables)
1. **Décision « méta sans « · » » appliquée à la liste mais pas au détail** : `/parcours/repartie` affiche 2 « · » dans le premier écran à 1280 et 375 (méta H1 « 4 semaines · 20 min/semaine », surtitre « Parcours Répartie · 4 semaines ») ; la liste n'en a aucun. Incohérence entre pages sur la même méta. Fichier : `apps/web/src/components/parcours/parcours-detail.tsx` (méta du H1) et `parcours-step-card.tsx` (surtitre de l'étape). Correction : même méta que la carte de la liste (`flex flex-wrap gap-x-2`, sans séparateur), ou intercalaire espace seul.

### Notes /10
1 Élégance et fidélité à l'accueil : 9. 2 Hiérarchie : 9 (une zone dominante par vue ; chez le visiteur la liste n'a pas de plein de page, tout est en contour et l'unique plein est dans l'en-tête, repli prévu au §0, mais « Tester l'étape 1 » ne domine pas). 3 Largeur aux 5 largeurs : 9. 4 Cohérence entre comptes : 8 (faute 1). 5 Finition : 9.
Globale (minimum) : **8**, tant que la faute 1 est ouverte.

### Pistes (non dures)
- Liste visiteur : mettre « Tester l'étape 1 » plein sur la carte conseillée par défaut, en repassant le bouton de l'en-tête en contour (`parcours-content.tsx`, `CONTOUR_CARTE`), pour que l'œil trouve l'action de la page.
- Détail visiteur : le bloc « Premium ouvre la suite » est centré dans une carte alignée à gauche (`ValidationWall`, `step-blocks.tsx`) ; l'aligner à gauche comme le reste (`text-left items-start`).
- Détail abonné : le texte de présentation (« Pour toi qui as… ») tombe sans titre après les étapes ; lui donner le cadre et le rythme des autres blocs, ou le replacer sous le H1 par classes (`order-*`).

## Vannes

### Constats (captures)
- Visiteur 1280 : H1 blanc, chapô sur 4 lignes dans un max-w-xl, rangée de catégories avec chevron, grille 4/4/4, 10 vannes sur plus de 5 catégories, mur de fin en 8/4 avec bouton contour, FAQ 4/8, bloc SEO en 3 colonnes, « La suite » en 3 cartes. Un seul aplat violet (en-tête). Rythme 24 px entre cartes, `mt-12` entre blocs.
- 375 : H1, chapô, rangée et 1re vanne entière visibles avant y = 812 (1re carte finie vers y = 550). Pas de défilement horizontal hors rangée.
- Abonné 1280 : 12 vannes sur 4 rangées, catégories variées, pas de doublon consécutif, pagination, FAQ, SEO. Hero pleine largeur sans vide à droite.
- Cartes d'une rangée à même hauteur, vide en fin de carte (carte 1, 120 px environ) : décision, non notée.

### Fautes dures (chiffrables)
1. **Cibles de la pagination sous 44 px à partir de 768 px** : numéros de page mesurés à environ 33 x 33 px à 1280 (capture abonné), alors que la spec demande `min-h-11` ; le code ne passe à 44 px que sous 768 px et sur écran tactile (`COARSE`, `MOBILE_CELL`). Fichier : `apps/web/src/components/ui/list-pagination.tsx` (`NUMBER_CELL` : `md:min-w-8` et `GHOST_SM`). Correction : `md:min-w-11 md:h-11` sur `NUMBER_CELL` et `STEP_CELL`, `mt-12` au lieu de `mt-8` (spec §3.5) sur la liste de Vannes.

### Notes /10
1 Élégance : 9. 2 Hiérarchie : 9 (le titre domine, un seul accent, mur de fin clair). 3 Largeur : 8 (voir piste 1, trou de 2/3 de la grille sous la 10e vanne chez le visiteur et le gratuit à 1280). 4 Cohérence entre comptes : 9. 5 Finition : 8 (faute 1).
Globale (minimum) : **8**, tant que la faute 1 est ouverte.

### Pistes (non dures)
- Visiteur/gratuit 1280 : la 10e vanne seule laisse 2 colonnes vides sur environ 170 px (décision tour 3 point 5 de retirer `lg:col-span-3`). Remplir la rangée sans agrandir de texte : placer le mur de fin dans les 2 colonnes libres (`lg:col-span-2` sur `MurListe`, `vannes-list.tsx`), au lieu d'une rangée pleine dessous.
- Hero : la carte d'offre reportée laisse 8 colonnes de vide à droite du chapô à 1280 ; en attendant, passer le chapô en `lg:col-span-12 max-w-xl` comme la vue abonnée pour que les deux vues se ressemblent.
- Mur de fin : le bouton contour à bord violet est le seul trait violet de l'écran visiteur ; le garder tel quel (objet Premium), mais vérifier qu'il reste en contour dès 1 000 px de haut (règle du 19/11).

## Limites de cette relecture
Je n'ai pas ouvert les captures 768 et 1456 ni les comptes gratuit et nouvel de Vannes : leur état n'est jugé que par le gate. Les fichiers de code des fautes sont déduits de la lecture des composants lus ; `parcours-detail.tsx` n'a pas été ouvert.

NOTE GLOBALE Parcours : 8/10
NOTE GLOBALE Vannes : 8/10

Fautes dures :
1. Parcours : « · » encore présents dans la méta du détail (2 au premier écran), `apps/web/src/components/parcours/parcours-detail.tsx` et `parcours-step-card.tsx`.
2. Vannes : cibles de pagination à 33 px dès 768 px, `apps/web/src/components/ui/list-pagination.tsx` (`NUMBER_CELL`, `STEP_CELL`).
