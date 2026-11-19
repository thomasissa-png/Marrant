# Relecture UX à l'aveugle, Parcours et Vannes, tour 2 (s26), interrupteur ouvert

Périmètre : `/parcours`, `/parcours/repartie`, `/vannes`. Captures `docs/captures/s26/lot2-tour-2/{parcours,vannes}/` (ouvertes : 375, 1280, 1920 des principaux comptes, 1280 pour les pages de détail). Specs lues : `docs/ux/parcours-vannes-s26.md`. Code lu pour une mesure : `apps/web/src/components/parcours/parcours-content.tsx` (cartes), `espace/parcours/parcours-espace.tsx`.
Décisions de Thomas respectées et non notées : titre blanc, un seul aplat violet, bouton « Tester l'étape 1 » en contour, carte d'offre du hero de /vannes, cadenas des étapes, rail visiteur de la page d'un parcours (reportés), textes validés.

## Gate typographique (citée, `tailles.mjs`)
Barre : au plus 4 tailles et 6 combinaisons au premier écran.
- Parcours : 4 comptes, 375 et 1280 : 4 tailles distinctes partout (24 ou 30, 20, 16, 14) ; combinaisons 5 ou 6 (max 6 : visiteur 768/1280, en-cours et nouvel 768/1280). PASS.
- Parcours/repartie : 3 tailles à 375 (combinaisons 4 à 5), 4 tailles à 768 et plus (combinaisons 5 à 6). PASS.
- Vannes : 3 tailles (24 ou 30, 16, 14), 4 combinaisons, identiques aux 4 comptes. PASS (la plus sobre des trois pages).
Aucune capitale visible (« Programme » et « Pourquoi ces vannes sont différentes » en casse normale).

## /parcours

### Visiteur et compte gratuit (même rendu)
Constat 1280 : hero 8/4 propre (H1 et chapô à gauche, quiz compact à droite, titre du quiz aligné sur le H1), 5 cartes en 6/6 puis la dernière en 7/5, « Explore aussi » en 4/4/4, FAQ en 4/8. Un seul aplat violet (bouton Premium de l'en-tête). Les boutons de cartes sont en contour. 375 : H1, chapô, début de la 1re carte dans l'écran 375x812 (critère 7 tenu) ; quiz sous la liste.
- Sous la chapô, vide de 216 px à gauche pendant que le quiz occupe la colonne de droite : vide de fin de colonne, permis.
- Cartes 6/6 de la 2e rangée non alignées entre jumelles : « Programme » à y=842 (Confiance) contre y=884 (Storytelling), soit environ 69 px de décalage, et fond de carte à 927 contre 968. Vide de fin de carte, donc permis, mais finition inégale (la 1re rangée, elle, est alignée par hasard de longueur). PISTE 1.
- Valeur visible, une seule offre, « Sans compte. La suite : Premium. » sous chaque bouton : la promesse d'entrée gratuite se lit sans effort.

### Abonné en-cours et nouvel
Constat 1280 : H1 à gauche, rail 4 colonnes à droite (Ton cap), bloc « étape à reprendre » en tête, cartes en 1 colonne dans les 8 colonnes avec zones 7/5, quiz sous la liste, FAQ sans la ligne prix. Le premier écran porte le plein « Reprendre » (y=650 sur 900) : l'action est visible sans défilement. Nouvel abonné : « Étape conseillée : Répartie, Commencer l'étape 1 », jamais une page morte.
- Mesure (code `parcours-content.tsx` l. 429-451, capture en-cours 1280) : sur les cartes commencées (Machine à Café, Répartie), la barre « n/total étapes » occupe la rangée 1 de la zone droite et `PiedCarte` démarre à la rangée 2 (`lg:row-start-2 lg:mt-4`). La rangée 1 a la hauteur de l'en-tête de la carte (méta sur deux lignes, titre, persona) : trou d'environ 125 à 130 px entre la barre et « Programme », AU MILIEU de la zone droite. Faute dure (vide > 32 px). Cartes non commencées : « Programme » en haut, pas de trou.
- Rail : « Ton cap » montre 2 pastilles violettes pleines (en-cours) ou 1 (nouvel), en plus du plein « Reprendre » et du point de notification de l'en-tête, dans le même premier écran (Ton cap à y=290, Reprendre à y=650 sur 900). Le code a déjà passé les barres de progression en gris (« aucun violet », l. 430) ; les pastilles du cap restent en violet : second accent. Faute dure (accent violet hors bouton plein, 2 éléments chiffrés en-cours). Fichier : `apps/web/src/components/espace/ton-cap.tsx`.
- Méta des cartes de l'abonné à 1280 : à gauche de la zone 7/5, 4 cartes sur 5 coupent la ligne avant « · 475 XP à gagner » ; le séparateur ouvre la 2e ligne. C'est le choix du tour 2 (séparateur porté par l'item suivant) mais le rendu garde un point orphelin en tête de ligne. PISTE 2.
- Clarté : « Tes 4 premières semaines » (calendrier déplié, 4 lignes) précède l'étape à reprendre : le bouton est le 4e bloc du bloc, sous un calendrier que l'abonné en cours connaît déjà (étape 3 sur 3). La prochaine action n'est pas la zone dominante. PISTE 3.
- Rail sticky : après la carte Ton cap, 3 400 px de colonne vide à droite sur la capture pleine page, permis (fin de colonne, sticky au scroll).

### Grille UX Parcours
1 Prospect : 8,5 (hero + quiz + 5 promesses lisibles, offre en haut ; texte dense par carte, 3 paragraphes). 2 Clarté abonné : 8 (action visible mais sous le calendrier). 3 Envie de continuer : 9 (barre n/total, cap, série). 4 Nouvel abonné : 9 (étape conseillée, plein unique). 5 Accessibilité et cohérence : 8 (bouton et summary min-h 44, focus visible ; accent violet en trop dans le rail).
Design : 1 élégance 9 ; 2 hiérarchie 8 (rail et accent) ; 3 largeur 9 ; 4 cohérence entre comptes 9 ; 5 finition 7 (trou 130 px dans la zone droite, jumelles non alignées).

## /parcours/repartie (page d'un parcours)
- Visiteur 1280 : fil d'Ariane, H1, méta, description, « Le programme », étape 1 entièrement ouverte (Pourquoi, apprendre, conseil, exemple, défi, vannes, vidéos, quiz), puis « Passer à l'étape 2 · 1,99 €/mois » (contour) et étapes 2 à 4 repliées. Lecture fluide, étape 1 gratuite crédible. Le rail visiteur, report de Thomas : non noté.
- Abonné en-cours : rail « 2 sur 4 étapes » avec Fait / Reprendre (plein unique, violet) / Voir ; étape 3 ouverte avec sous-étapes 3.1 à 3.5. L'action suivante est évidente. Nouvel abonné : rail « 0 sur 4 étapes », « Commencer » plein, étape 1 ouverte. Bon.
- Cohérence entre comptes : chez le nouvel et le visiteur, la description du parcours (« Pour toi qui as toujours la bonne réplique… », « Pour qui ? », témoignage) est en tête ; chez l'abonné en-cours elle descend sous les étapes, sans titre, entre la dernière carte et le pied de page (paragraphes flottants). Un abonné voit ces trois paragraphes comme un reste. PISTE 4 (sous la barre de la page, voir ci-dessous).
- Abonné en-cours : écart de 74 px entre la méta et « Le programme » (description retirée) : écart entre deux blocs, pas dans un bloc, permis.
- 375 visiteur : étape 1 pleine largeur, quiz en réponses empilées, boutons de 44 px et plus. Pas de défilement horizontal vu.
Note de la page de détail : Design 8,5 ; UX 8,5.

## /vannes

Constat 1280 : H1 et chapô à gauche, rangée de catégories avec « Toutes » actif (défilement avec flèche, 44 px), grille 4/4/4 (visiteur : 10 vannes sur 10 catégories distinctes ; abonné : 12 vannes alternées, pagination 1 à 8), mur de fin pour le visiteur, FAQ 4/8, bloc « Pourquoi… » en 3 colonnes, « La suite » 4/4/4. Un seul aplat violet : le bouton Premium de l'en-tête (visiteur) ; page abonné : le numéro de page courant (pagination), aucun autre. 375 : H1, chapô, rangée, 1re carte entière avant y=812 (la carte finit vers y=447, critère 7 tenu), offre = bouton de l'en-tête.
- Dernière carte seule du visiteur (« Mon banquier m'a dit… ») : 1180 px de large pour une ligne de 330 px de texte, soit 28 % de remplissage. Tuile creuse au sens du brief, mais conforme à la spec (« prend la rangée »). Pas chiffrable en faute dure. PISTE 1.
- Mur « Encore des vannes à ressortir » : carte pleine largeur dont le contenu occupe 400 px à gauche, 60 % vide à droite. Spec 8/4 respectée, vide horizontal seulement. PISTE 2 (même piste que la tuile).
- Hauteurs de cartes en rangée inégales (rangée 1 : 383, 457, 472 px d'écran) : choix probable `items-start` pour que la révélation de la chute n'agrandisse pas les voisines. Vide de fin de carte, permis. PISTE 3 si Thomas préfère l'alignement (`items-stretch` et pied `mt-auto`).
- Abonné : chapô sur 55 % de la largeur, droite du hero libre : la spec le tolère (à vérifier, vide horizontal).
- Prospect : H1, chapô avec « Avec Premium, tu gardes tes préférées sous le coude », vannes lisibles et chute à révéler, mur avec prix et « Tester l'étape 1 de Répartie, gratuite » : une seule offre, envie de joindre bien servie. Abonné : première chute à révéler, favoris, pagination, aucune donnée de progression inventée : clair.
- Grille UX : 1 prospect 9 ; 2 clarté abonné 9 ; 3 envie de continuer 8 (page de référence, pagination seule) ; 4 nouvel abonné 9 (même rendu que l'abonné, jamais morte) ; 5 accessibilité et cohérence 9.
- Grille design : 1 élégance 9 ; 2 hiérarchie 9 ; 3 largeur 8 (tuile creuse, mur à 40 %) ; 4 cohérence 10 ; 5 finition 9.

## Pistes (corrections codables)
Parcours
1. Aligner les jumelles : `PiedCarte` en `lg:mt-auto` et cartes `h-full` dans `GRILLE_CARTES_OUVERTE` (`parcours-content.tsx`) ; « Programme » et bouton tombent sur la même ligne.
2. Séparateur orphelin : passer la méta de la carte abonné en deux items insécables (« durée · rythme » ensemble, XP seul) ou élargir la zone gauche à `lg:col-span-8` et la droite à `lg:col-span-4` (les 3 items tiennent sur une ligne).
3. Remonter « Étape en cours » + bouton au-dessus du calendrier dans `QuatreSemaines`, calendrier replié si l'étape en cours existe (même texte, même plein).
Vannes
1. Ranger le dernier élément : la dernière vanne en 1/3 et `MurListe` en `lg:col-span-2` à côté d'elle (même contenu, même plein).
2. Si la piste 1 n'est pas retenue, resserrer le contenu du mur à `max-w-xl` centré verticalement sur toute la hauteur et placer le lien « Tester l'étape 1 » à droite en `lg:col-span-4`.
3. Égaliser les hauteurs de rangée (`items-stretch`) sans bloquer l'ouverture de la chute (animation en `grid-rows`).

## Notes
NOTE GLOBALE Parcours : 7/10 (sous la barre de 9 : 2 fautes dures, finition 7)
NOTE GLOBALE Vannes : 8/10 (aucune faute dure ; largeur 8 : tuile creuse et mur à 40 %)

Fautes dures :
1. Parcours abonné, cartes commencées : vide de 125 à 130 px entre la barre « n/total » et « Programme » au milieu de la zone droite 5/12 (rangée 1 de la grille de la carte) : `apps/web/src/components/parcours/parcours-content.tsx` (PiedCarte `lg:row-start-2` ; mettre la barre dans `PiedCarte` ou `row-start-1` + `lg:self-start`).
2. Parcours abonné, rail : pastilles violettes pleines de « Ton cap » en plus du plein « Reprendre » (second accent, 2 éléments en-cours) : `apps/web/src/components/espace/ton-cap.tsx` (pastilles remplies en `bg-text-secondary`).
