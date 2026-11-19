# Relecture DESIGN à l'aveugle, Parcours et Vannes, s26 tour 1 (interrupteur ouvert)

Pages : `/parcours`, `/parcours/repartie`, `/vannes`. Captures lues : `docs/captures/s26/lot2-tour-1/{parcours,vannes}/`, 4 comptes. Lues en détail : visiteur 375/1280/1920 et en-cours 1280 (liste), nouvel 1280, répartie visiteur et en-cours 1280, vannes visiteur et en-cours 1280. Limite : les captures 375 pleine page font 6885 px de haut, réduites à 109 px de large, donc illisibles au détail. À 375 je n'ai jugé que l'ordre des blocs (H1, liste, quiz sous la liste, FAQ) et les gates chiffrées, pas la finition au pixel.

## Gate typographique (premier écran, 4 comptes, 375 et 1280), citée

- `TAILLES-parcours.md` : 4 tailles max (24 ou 30, 20, 16, 14), 4 à 6 combinaisons. 375 : 5 combinaisons (visiteur, gratuit, en-cours), 6 pour nouvel. 1280 : 6 partout. PASS.
- `TAILLES-parcours_repartie.md` : 3 tailles à 375, 4 à 768 et au-delà ; 4 à 6 combinaisons. PASS.
- `TAILLES-vannes.md` : 3 tailles (30 ou 24, 16, 14), 4 combinaisons, partout. PASS, le meilleur des trois.
- Police et graisses : Jakarta 600 pour les titres, Inter 400/600 pour le reste. Aucune capitale ni 700 dans le premier écran.
- Réserve : la gate ne mesure que le premier écran. Sous le pli, `/parcours/repartie` sort de l'échelle (voir faute dure 3).

## PARCOURS, liste (`/parcours`)

Constat visuel
- Visiteur 1280 : H1 et chapô à gauche en 8 colonnes, quiz en 4 colonnes à droite, cartes 6/6, dernière carte (Boulot) en 12 colonnes avec zones 7/5, « Explore aussi » en 4/4/4, FAQ en 4/8. Les contours des cartes sont à 1 px et il n'y a plus de filet violet. Un seul aplat violet (le bouton Premium de l'en-tête). Tous les « Tester l'étape 1 » sont en contour. Conforme à la spec, et plus proche de l'accueil.
- Abonné 1280 (en-cours, nouvel) : carte « Tes 4 premières semaines » avec LE plein (« Reprendre » ou « Commencer l'étape 1 »), rail « Ton cap » en 4 colonnes, cartes de parcours en 8 colonnes avec la barre `n/total`. Un seul plein. Lisible, et c'est la zone dominante.
- Les 4 comptes se ressemblent (même grille, même cadre). Seuls l'en-tête global et les boutons changent.

Notes
1. Élégance et fidélité à l'accueil : 8/10.
2. Hiérarchie : 9/10. Un seul accent violet par écran, la zone dominante est claire.
3. Largeur aux 5 largeurs : 7/10. Vide de milieu de bloc (faute dure 1). Zone morte sous le chapô (piste 1).
4. Cohérence entre comptes : 9/10.
5. Finition au pixel : 8/10. Séparateur `·` orphelin en fin de ligne (piste 2). Cibles 44 px conformes pour la rangée, le quiz et les boutons (`min-h-11` / `h-12`).

Défauts précis
- Carte Confiance, visiteur 1280 (et 1456, 1920) : entre la fin du témoignage et le bandeau « Programme », environ 90 à 100 px de vide, au milieu de la carte. Cause : la carte s'étire à la hauteur de sa voisine Storytelling, et `mt-auto` du pied pousse le pied vers le bas. Règle : vide > 32 px au milieu d'un bloc = faute.
- En-cours et nouvel 1280 : la ligne de méta passe à la ligne dans la colonne 7/12, par exemple `Débutant → Intermédiaire  4 semaines · 20 min/semaine ·` puis `475 XP à gagner`. Le `·` reste en bout de ligne. Dans la carte Machine à Café le XP est lu deux fois (méta et sous la barre de progression).

Pistes (3 max)
1. Zone morte sous le chapô (visiteur 1280 à 1920) : le chapô tient en 3 lignes, le quiz descend plus bas, et il reste un vide d'environ 200 px sur 8 colonnes. Remplir par la mise en page, pas par un texte plus gros : passer le quiz en bandeau pleine largeur sous le chapô ne marche pas (DOM), donc garder le chapô en `lg:self-start` et ajouter un `lg:pb-0` sur le parent, ou remonter la première carte en `lg:row-start-2` sur 8 colonnes avec le quiz en `lg:row-span-2`. Ferait 10 en largeur.
2. Séparateurs de la méta : les passer en `before:content-['·']` sur chaque item (`parcours-espace.tsx`, ligne méta), pour qu'un séparateur ne finisse jamais une ligne. Retirer le doublon de XP sous la barre (existant, hors refonte).
3. Hiérarchie dans la carte : persona et description sont deux paragraphes `TEXTE` identiques, empilés. Mettre la persona en `TEXTE_FORT` (même taille 16, graisse 600) sépare les deux sans ajouter de taille.

## PARCOURS, page d'un parcours (`/parcours/repartie`)

Constat visuel
- La structure est posée (étapes en 8 colonnes, rail en 4 colonnes). Le rail visiteur est une simple ligne « Étape 1 gratuite, la suite avec Premium », sans bouton : l'offre est dans l'en-tête (pas d'élément ajouté, signalé en piste).
- Le contenu des étapes n'a pas suivi la refonte. Sur les captures, on voit : sous-titres en gras 700 (`Ce que tu vas apprendre`, `Le conseil`, `Exemple concret`, `Exercice pratique`), pastille `Quiz 1/4` violette, bloc « Exercice pratique » et « Vannes à pratiquer » teintés de violet, liens `Lire la fiche du conseil` et `Voir la fiche de la vidéo` violets, bouton « Passer à l'étape 2 · 1,99 €/mois » avec bordure violette, `Format : …` en `text-xs`. Cela donne au moins 5 accents violets dans le même écran que le plein de l'en-tête.
- Le code le confirme : `apps/web/src/components/parcours/step-blocks.tsx` contient encore `font-bold` (l. 46, 116), `text-xs text-text-muted` (l. 54), `rounded-lg` (l. 42). La spec §2 interdit tout cela dans les cartes d'étape.
- Abonné (en-cours) : rail avec barre `2 sur 4 étapes`, liste d'étapes, « Reprendre » en plein (un seul plein). Bien. Mais le bouton « Voir » de chaque ligne est un contour très proche d'un champ de texte, et `Quiz 1/4` y est violet aussi.

Notes
1. Élégance et fidélité à l'accueil : 6/10. Les titres de page et de carte sont refaits, l'intérieur des étapes ne l'est pas.
2. Hiérarchie : 6/10. Au moins 5 accents violets en concurrence avec le plein.
3. Largeur : 8/10. Le rail 8/4 fonctionne.
4. Cohérence entre comptes : 8/10.
5. Finition : 6/10. Cibles OK ; sorties d'échelle (faute dure 3).

Pistes (3 max)
1. Rail visiteur : y poser le bouton d'offre (objet Premium (a)) au lieu de la seule ligne de texte ; sinon le rail reste une carte vide de 4 colonnes (cela ajouterait un élément, donc décision UX).
2. Blocs « Exercice pratique » et « Vannes à pratiquer » : fond `bg-background-elevated` neutre, comme « Pourquoi cette étape ? ».
3. Cartes d'étape 2+ fermées : le verrou et « +75 XP » sont bien alignés mais les trois cartes verrouillées répètent le même chevron ; garder, mais réduire `p-6` à `p-4` serait une 2e échelle de padding, donc ne pas le faire.

## VANNES (`/vannes`)

Constat visuel
- Visiteur 1280 : H1 pleine largeur, chapô à gauche, rangée de pastilles avec chevron, grille 3 colonnes (4/4/4), 10 vannes, dernière vanne seule en 12 colonnes, mur de fin avec bordure haute violette (objet Premium (b)), FAQ 4/8, bloc SEO en 3 colonnes, « La suite » en 3 cartes. Très proche de l'accueil, la meilleure des trois pages. Un seul plein (en-tête).
- Abonné 1280 (en-cours) : H1 + chapô, rangée, 12 vannes en 3 colonnes sans mur, pagination, FAQ, SEO. Aucun accent violet hors pagination (page courante en aplat violet).
- Les 4 comptes sont cohérents entre eux (mêmes cartes, même grille).

Notes
1. Élégance et fidélité à l'accueil : 9/10.
2. Hiérarchie : 8/10. La vanne reste le centre, mais un lien violet dans le mur de fin (voir ci-dessous) est un second accent.
3. Largeur : 7/10. Vides de milieu de carte (faute dure 2). Vide à droite du chapô (piste 3).
4. Cohérence entre comptes : 9/10.
5. Finition : 8/10. Cibles OK : favori, partage `h-11 w-11` (pastille visible 32 px, zone de 44 px confirmée dans `favorite-button.tsx` et `share-button.tsx`). Chute et flèche en pied : cercle d'environ 32 px, zone de clic non vérifiée au code (piste).

Défauts précis
- Visiteur 1280, rangée 1, carte 1 (« Pour ta valise de départ… ») : amorce de 2 lignes finissant à y ≈ 515, pied (« Révéler la chute ») à y ≈ 660, soit environ 130 px de vide au milieu de la carte. Même défaut, environ 100 à 120 px, sur la carte 1 de la 4e rangée de l'abonné (« Mon banquier… », en-cours 1280, y ≈ 931 à 1012 sur la capture réduite) et sur sa voisine. Cause : `h-full` + pied `mt-auto` dans une grille à hauteur de ligne commune (ces cartes se retrouvent à côté d'une amorce de 6 lignes).
- Mur de fin (visiteur 1280) : le lien « Tester l'étape 1 de Répartie, gratuite » est en violet clair, le seul texte violet de l'écran hors objet Premium. La spec §0 le met en `text-text-primary underline`. De plus, la mise en ligne `lg:flex-row` (phrase à gauche, bouton à droite en 4 colonnes) de la spec §3.3 n'est pas rendue : phrase, bouton et réassurance sont empilés à gauche, ce qui laisse environ 800 px de vide à droite d'un bloc de 1200 px.
- Dernière vanne seule (« Jeux de mots ») : une ligne de texte sur 1200 px de large, carte étirée. Conforme à la spec (`lg:col-span-3`), mais c'est la carte la plus creuse de la page.

Pistes (3 max)
1. Pied de carte : remplacer `mt-auto` par un `grid-rows-[auto_1fr_auto]` ou limiter la hauteur de ligne avec `lg:items-start` sur la grille. Les cartes courtes deviennent plus basses que leurs voisines (hauteurs inégales) mais sans vide interne : à arbitrer avec Thomas, car cela casse l'alignement des bords de rangée. Alternative : ne pas changer la grille et accepter le vide de pied (il est situé entre l'amorce et le pied, donc la règle le compte comme faute).
2. Mur de fin à 1280 : rendre `lg:flex-row lg:items-center lg:justify-between` du mur (b) dans le composant du mur de `vannes-list.tsx` (à confirmer), bouton à droite, lien en `text-text-primary underline underline-offset-2`.
3. Vide à droite du chapô (visiteur 1280) : environ 500 px sur 120 px de haut, sans carte d'offre (repli de la spec §0, un seul plein). Acceptable ; si Thomas retire le plein de l'en-tête, la carte d'offre (a) comblerait la colonne.

## Fautes dures (numérotées)

1. `/parcours` visiteur et gratuit 1280 à 1920, carte Confiance : environ 90 à 100 px de vide au milieu de la carte (témoignage vers « Programme »), contre 32 px permis. Fichier : `apps/web/src/components/espace/parcours/parcours-espace.tsx` (pied `mt-auto` des cartes de `GRILLE_CARTES_OUVERTE`).
2. `/vannes` visiteur, gratuit, abonné, 1280 à 1920 : environ 100 à 130 px de vide entre l'amorce et le pied dans les cartes à amorce courte (carte 1 de la rangée 1 visiteur ; cartes 1 et 2 de la rangée 4 abonné). Fichier : `apps/web/src/components/vannes/vannes-list.tsx` (carte, classe `mt-auto pt-4` du pied, `h-full`).
3. `/parcours/repartie` : tout l'intérieur des étapes hors échelle `typo-harmonie-espace-s25.md`. `font-bold` (l. 46 et 116), `text-xs text-text-muted` (l. 54), `rounded-lg` (l. 42), et au moins 5 éléments violets (pastille `Quiz 1/4`, liens de fiche, blocs d'exercice teintés, bordure du bouton « Passer à l'étape 2 ») contre un seul accent permis. Fichiers : `apps/web/src/components/parcours/step-blocks.tsx`, `parcours-step-card.tsx`, `step-quiz.tsx`.
4. `/vannes` visiteur et gratuit, mur de fin : lien « Tester l'étape 1 de Répartie, gratuite » en violet (second accent). Fichier : composant du mur dans `apps/web/src/components/vannes/vannes-list.tsx` (à confirmer).

NOTE GLOBALE Parcours : 6/10
NOTE GLOBALE Vannes : 7/10

Fautes dures :
1. parcours-espace.tsx : vide de milieu de carte (~90-100 px), carte Confiance 1280+.
2. vannes-list.tsx : vide de milieu de carte (~100-130 px), cartes à amorce courte 1280+.
3. step-blocks.tsx (et parcours-step-card.tsx, step-quiz.tsx) : `font-bold`, `text-xs`, `text-text-muted`, `rounded-lg`, 5+ accents violets sur /parcours/repartie.
4. vannes-list.tsx (mur de fin) : lien violet, second accent.
