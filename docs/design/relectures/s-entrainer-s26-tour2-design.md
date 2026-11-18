# Relecture design à l'aveugle : S'entraîner (s26, tour 2)

Captures lues : visiteur, gratuit, en-cours, nouvel, à 375, 1280 et 1920 (12 PNG). Étalon : modèle d'aperçu « Aujourd'hui ». Specs : `docs/design/rubriques-abonne-s26.md`, `docs/design/typo-harmonie-espace-s25.md` (prime). Hors note : verrouillage réel, titre d'aperçu en dégradé, promesse du hero (sa place est jugée : OK, sous le H1, avant les pastilles), « La suite est dans Premium », pas de bouton plein tant que la carte attend sa réponse, « Oui / À moitié / Rien » de même poids.

## Gate typographique (TAILLES.md, citée)
- 16 sorties (4 comptes x 375/768/1280/1920) : **4 tailles distinctes partout** (24 ou 30, 20, 16, 14), **6 combinaisons** (5 pour nouvel 375). Toutes dans {14, 16, 20, 24 à 375, 30 dès 1024}. Graisses 400/600 seulement, Jakarta limitée au 24/30 et au 20. Gate PASS : pas de faute automatique.
- Le gate ne mesure pas la couleur : constaté à l'œil, un seul violet de contenu dans l'aperçu (bouton d'offre, 1 aplat au premier écran à 375 comme à 1280), zéro aplat dans les écrans abonnés (voulu).

## Constats par écran
**Aperçu (visiteur, gratuit)**
- 1280/1920 : hero en 2 zones (texte à gauche, carte d'offre à droite, hauts alignés à 153 px, bas 376 px). Offre en haut, lisible dès les 3 premières secondes, une seule offre. Fermé lisible : pastille « Premium », verrous sur les tuiles, rails gris, fondu de l'extrait.
- 375 : offre sous le titre, bouton plein à y = 345 px, premier écran OK.
- Rupture de grille : l'extrait est en 7/5 (carte « Quelle réplique ? » 32 à 731, « Mission » 755 à 1248 à 1280) puis les deux tuiles du dessous sont en 6/6 (32 à 628 et 652 à 1248). Le bord gauche de la seconde colonne passe de 755 à 652 : **décalage de 103 px** à 1280 (1075 contre 972 à 1920). Visible en un coup d'œil, c'est le seul défaut d'alignement de la page.
- Carte « Mission » (aperçu) : 160 px de vide sous « Marche 5 » à 1280/1920, en fin de colonne, donc permis. Carte d'offre : 55 px de vide sous « Connexion » (visiteur), fin de carte, permis.
- Aucun vide > 32 px au milieu d'un bloc.

**Abonné (en-cours, nouvel)**
- 1280/1920 : grille 7/5 tenue (carte 32 à 731, colonne mission 755 à 1248), `gap-6` = 24 px entre cartes, cartes frères alignées en haut (301 en-cours, 277 nouvel). Largeur utile 1216 px >= 1100. Aucun bloc centré seul.
- Carte d'action : seule zone tintée (dégradé et bord `accent-primary/40`), conforme à la décision documentée de `CARTE_ACTION` (tour 8, même traitement qu'Aujourd'hui, validé). Zone dominante nette, H1 30/600 sans écraser la carte.
- Échelle des marches à 1280 : lignes de 49 px, marche en cours en bande pleine largeur de carte, séparateurs, « Fait » + coche verte. Propre. À 375 : puces à retour de ligne, cibles de ~45 px, pas de défilement horizontal.
- Mission : bouton principal en contour (« Pas essayé »...), cohérent avec la règle un-aplat.
- Vides intérieurs (carte d'action en-cours, 1280) : le plus grand écart entre blocs est ~26 px (bouton « 10 secondes » vers « Prends ton temps ») : OK. Fin de colonne gauche : 106 px (en-cours), 172 px (nouvel) sous la carte : en fin de colonne, permis, mais le côté gauche paraît court face à la colonne mission.
- Cohérence entre comptes : nouvel n'a pas la rangée de segments au-dessus de la grille, en-cours oui (2 segments pleine largeur, 1216 px, tous deux en couleur de rail : aucune information de progression lisible). La spec les plaçait dans la colonne cartes (7 col), la capture les montre sur toute la largeur de page : écart à la spec, non chiffrable en faute.
- Pastilles et boutons de réponse en forme de gélule (`rounded-full`) alors que la spec s25 §2.5 fixe 12 px pour les boutons : toléré pour des choix de réponse, noté en piste.

## Notes par critère (Design)
1. Élégance et fidélité à l'accueil : **9**. Palette, rayons, bords 1 px, aucune ombre, aucune capitale. Retire un point la rupture 7/5 puis 6/6 de l'aperçu.
2. Hiérarchie : **9**. Une zone dominante par compte, un seul aplat dans l'aperçu, aucun faux accent. Pour 10 : n/a tant que Thomas n'a pas tranché le bouton plein de la carte du jour (hors note).
3. Usage de la largeur aux 5 largeurs : **8**. Rupture de colonnes de l'aperçu (103 px) ; vide de fin de colonne de 172 px chez nouvel (permis mais déséquilibré).
4. Cohérence entre comptes : **9**. Segments absents chez nouvel, carte « Mission » titrée en 14/600 dans l'aperçu et en 20/600 chez l'abonné (étiquette contre titre de carte).
5. Finition au pixel : **9**. Cibles >= 44 px lues (pastilles, lignes d'échelle de 49 px, sommaire replié de 49 px), contrastes de texte secondaire cohérents avec la gate s25 ; reste le décalage de grille. Je n'ai pas pu mesurer au code l'opacité de « Prends ton temps » (rendu un cran plus pâle que les autres 14/400, non chiffré).

## Pistes (non bloquantes)
1. Aligner la seconde rangée de l'aperçu sur la grille de l'extrait : `lg:grid-cols-12` avec `lg:col-span-7` (« Quand ça tombe à plat ») et `lg:col-span-5` (« Raconte-nous ... ») dans le composant d'extrait de `apps/web/src/app/mon-espace/s-entrainer` (apercu). Aucune taille ni texte ajouté. C'est le correctif qui amène 10.
2. Ramener les segments dans la colonne cartes (`lg:col-span-7`) et les rendre aussi chez nouvel (tous en rail) pour la cohérence des comptes.
3. Chez nouvel, laisser la colonne gauche plus courte est permis ; si Thomas veut l'équilibrer, c'est un contenu à décider (jamais un texte grossi).

## Fautes dures
1. Grille de l'aperçu : seconde rangée en 6/6 sous un extrait en 7/5, décalage de bord de 103 px à 1280 et 1920 (`apps/web/src/app/mon-espace/s-entrainer/` composant d'aperçu, classes `grid-cols-2` des tuiles « Quand ça tombe à plat » et « Raconte-nous ce qui s'est passé »).

NOTE GLOBALE : 8/10

Fautes dures :
1. Aperçu S'entraîner : tuiles du bas en 6/6 alors que l'extrait est en 7/5, bord gauche décalé de 103 px (1280 et 1920) ; fichier : composant d'aperçu de `apps/web/src/app/mon-espace/s-entrainer` (grille des deux tuiles teasers, à passer en `lg:col-span-7` / `lg:col-span-5`).
