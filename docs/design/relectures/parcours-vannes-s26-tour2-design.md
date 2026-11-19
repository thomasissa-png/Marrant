# Relecture DESIGN à l'aveugle, Parcours et Vannes, s26 tour 2

Pages : `/parcours`, `/parcours/repartie`, `/vannes`. Interrupteur ouvert. Captures lues : `docs/captures/s26/lot2-tour-2/{parcours,vannes}/` (visiteur 375/768/1280/1920 des trois pages, abonné `en-cours` et `nouvel` 375/768/1280/1920 selon les pages, dont `en-cours-parcours-repartie-1280`). Code lu : `components/vannes/vannes-list.tsx`, `components/parcours/parcours-content.tsx`, `components/ui/liens.ts`. Décisions de Thomas appliquées (titre blanc, filet retiré, un seul plein, éléments reportés non notés, textes, émojis, pastilles de « Ton cap »).

## Gate typographique (sortie `tailles.mjs`, citée)
- `TAILLES-parcours.md` : 4 tailles (24/20/16/14 à 375 et 768, 30/20/16/14 dès 1280), 5 à 6 combinaisons sur les 4 comptes, 375 et 1280. Plafond respecté (6 atteint au 768 et 1280 visiteur/gratuit/abonné) : PASS sans marge.
- `TAILLES-parcours_repartie.md` : 3 à 4 tailles, 4 à 6 combinaisons : PASS.
- `TAILLES-vannes.md` : 3 tailles (24 ou 30 / 16 / 14), 4 combinaisons : PASS, la page la plus sobre.
- Graisses 400/600 seules, polices Plus Jakarta Sans (titres) et Inter (texte), aucune taille hors échelle.
- Aplat violet : un seul par écran sur toutes les captures lues (en-tête Premium chez les visiteurs ; « Reprendre » / « Commencer l'étape 1 » / pastille de page « 1 » chez les abonnés).

## /parcours

### Constats (capture)
- Visiteur 1280 : H1 + chapô à gauche, quiz à droite (4 col), cartes 6/6, dernière carte (Boulot) en 7/5, « Explore aussi » 4/4/4, FAQ 4/8. Proche de l'accueil, retenu, une seule couleur d'accent. Quiz bien traité (segments, réponses en contour).
- Visiteur 1280 : sous le chapô, vide de 215 px de haut sur 750 px de large (colonne H1, rangée portée par la hauteur du quiz). Vide de fin de colonne, donc permis, mais c'est la plus grosse zone morte au-dessus de la ligne de flottaison.
- Rangée 2 (1280 et 1920) : « Confiance » finit à y = 927 (capture 779 px de large), « Storytelling » à y = 968, la carte « Boulot » commence à y = 983. Écart sous « Confiance » : 56 px de capture soit environ 92 px réels, au lieu de 24 px. À 768 : environ 143 px sous « Confiance ». Cause : `items-start` (`GRILLE_CARTES_OUVERTE`, `parcours-content.tsx` l.52).
- Méta des cartes : quand elle passe à la ligne, la deuxième ligne commence par « · 325 XP à gagner » (768 visiteur carte 1, 1280 abonné cartes 2, 3, 4, 5, 375 abonné). Séparateur orphelin en début de ligne, cause `SEPARATEUR_AVANT` (`sm:before:mr-2`, l.58).
- Abonné 1280 et 1920 : les cartes tiennent dans 8 col, mais le découpage interne 7/5 laisse le texte sur environ 400 px (7 à 9 lignes) et la zone droite (Programme + bouton) vide dessous : environ 150 px à 1280, environ 280 px à 1920 sous le bouton (carte « Machine à Café » nouvel 1920). Vide de fin de colonne, permis, mais gaspille la largeur gagnée.
- Abonné : rail « Ton cap » seul en haut à droite, le reste de la colonne 9-12 est vide sur toute la page en capture pleine page (sticky : OK en usage réel, mais la capture ne le prouve pas).
- Hiérarchie : une zone dominante (carte « à reprendre » en abonné, quiz + cartes en visiteur), un seul plein. Les cinq boutons « Tester l'étape 1 » en contour : conforme à la décision de Thomas.
- Cibles : « Programme » `min-h-11`, réponses du quiz `min-h-11`, boutons de cartes h-12 : 44 px respectés au code.
- Cohérence comptes : visiteur et gratuit identiques, abonné et nouvel cohérents entre eux. À 375, ordre H1, rail, cartes, quiz : propre.

### Notes /parcours
1. Élégance et fidélité à l'accueil : 8/10. Beau, mais méta à séparateur orphelin et cartes inégales.
2. Hiérarchie : 8/10. Zone dominante nette, un seul plein ; le plein du visiteur est dans l'en-tête, loin du contenu (décision de Thomas, non noté).
3. Largeur aux 5 largeurs : 7/10. Vide sous le chapô, zones 5/12 creuses en abonné, 92 à 143 px entre cartes frères.
4. Cohérence entre comptes : 9/10.
5. Finition au pixel : 7/10. Séparateurs orphelins, inter-cartes. Contrastes AA et cibles 44 px : OK.

### Fautes dures /parcours
1. Écart entre cartes frères de 92 px (1280/1920) et 143 px (768) au lieu de 24 : `apps/web/src/components/parcours/parcours-content.tsx`, `GRILLE_CARTES_OUVERTE` (`items-start`).
2. Séparateur « · » en début de ligne quand la méta passe à la ligne (au moins 4 cartes par capture abonné 1280) : `parcours-content.tsx`, `SEPARATEUR_AVANT` (`sm:before:mr-2 sm:before:content-['·'_/_'']`).

### Pistes /parcours (3)
- Remplacer `items-start` par `items-stretch` ET retirer tout `mt-auto` du pied : le pied suit le témoignage à 24 px, le vide passe en FIN de carte (permis), les bas de cartes s'alignent, 24 px partout. Aucune taille ajoutée.
- Séparateur : supprimer le pseudo-élément « · » et séparer par `gap-x-4` (la graisse META_FORT de la difficulté suffit), ou porter le « · » en `after:` des items sauf le dernier avec `overflow-hidden` ; ce qui ferait 10 : plus jamais un point seul en début de ligne.
- Abonné (cartes de 8 col) : ne pas passer en 7/5 (`lg:col-span-7` / `lg:col-span-5` seulement pour la carte pleine largeur du visiteur) ; empiler Programme + bouton sous le texte, texte à environ 650 px de mesure : cartes plus courtes, zone droite creuse supprimée.

## /parcours/repartie

### Constats
- Visiteur 1280 : fil d'Ariane, H1 + emoji, méta, texte, étape 1 ouverte, étapes 2 à 4 repliées avec verrou nu, « Passer à l'étape 2 » en contour (un seul plein : l'en-tête). Cartes d'étape en `CADRE_CARTE_NEUTRE`, blocs internes `rounded-xl bg-background-elevated`, plus de violet ni de capitales. Propre, lisible, rythme régulier.
- Rail visiteur : carte d'une ligne « Étape 1 gratuite, la suite avec Premium » sans bouton (élément reporté par Thomas, non noté). Colonne droite vide dessous sur toute la capture (sticky).
- Abonné 1280 (`en-cours-parcours-repartie-1280`) : rail sommaire net (barre 2 sur 4, « Fait » + coche, « Reprendre » seul plein), étape courante ouverte avec sous-liste 3.1 à 3.5. Bon usage de la largeur, le meilleur écran des trois pages.
- Abonné : le bloc de présentation (« Pour toi qui as toujours la bonne réplique… », « Pour qui ? », « Imagine Tom ») tombe sous la dernière étape, sans titre, juste avant le pied de page. Lecture incohérente (la présentation arrive après le programme), pas chiffrable.
- La ligne « Parcours Répartie · 4 semaines » n'apparaît que sur la carte de l'étape 1 (visiteur et abonné) : incohérence entre cartes frères.
- 375 : les trois boutons d'auto-évaluation (« Pas encore essayé », « Essayé, bof », « Essayé, ça a marché ») sont empilés, centrés, de trois largeurs différentes, alors que tout le reste est aligné à gauche.
- Cibles : « Voir », boutons de réponse, sommaire : 44 px au code et à la capture. Focus visibles conservés.

### Notes /parcours/repartie
1. Élégance : 9/10.
2. Hiérarchie : 9/10. Un seul plein par vue, étape courante nette.
3. Largeur : 8/10. Visiteur : rail d'une ligne et colonne droite vide ; abonné : très bon.
4. Cohérence entre comptes : 9/10.
5. Finition : 8/10. Présentation abonné sous le programme, boutons 375 centrés de largeurs inégales.
(Pas de faute dure propre à cette page.)

### Pistes /parcours/repartie (3)
- Abonné : ramener le bloc de présentation sous le H1 par `max-lg:order-*` / `lg:row-start-*` (classes seules) ou le laisser sous le sommaire du rail.
- 375 : boutons d'auto-évaluation en `flex-wrap justify-start` (alignés à gauche, comme le reste), même largeur de ligne.
- Uniformiser la ligne « Parcours Répartie · 4 semaines » : l'afficher sur toutes les cartes d'étape ou sur aucune.

## /vannes

### Constats
- Visiteur 1280 : H1 + chapô à gauche (chapô de 4 lignes sur 8 col), rangée de pastilles (active en contour blanc, plus de violet), grille 4/4/4, mur de fin, FAQ 4/8, bloc SEO 3 colonnes, « La suite » 4/4/4. Structure et rythme conformes à la spec, fidèles à l'accueil, trois tailles seulement : page la plus aboutie typographiquement.
- Cartes de vanne : rangée 1 à 1280/1920 : fin des trois cartes à y = 410, 457, 472 (capture 824 px), soit 98 px réels d'écart entre la carte 1 et la rangée 2 contre 24 px prévus ; la carte « Digital & Gaming » (rangée 3) finit 15 px de capture avant ses voisines. Abonné 1280 : mêmes bas inégaux sur les 4 rangées (carte « Boulot & Collègues » 1 027 contre 1 059 pour « Vie quotidienne », rangée 4). Cause : `items-start` (`GRILLE_OUVERTE`, `vannes-list.tsx` l.98).
- Dernière vanne seule (10 gratuites) : carte « Jeux de mots » pleine largeur (1 218 px à 1920) pour une amorce d'une ligne : texte sur 25 % de la carte, 70 % de la tuile vide. C'est la spec (`lg:col-span-3`), mais c'est une tuile creuse au sens du critère 3.
- Mur de fin 1280/1920 : phrase, bouton en contour (bord violet de l'objet Premium), réassurance, lien : empilés à gauche, moitié droite de la carte vide (environ 600 px à 1280). Vide de fin de bloc, permis ; la spec §3.3 prévoyait bouton à droite en 4 col.
- Hero visiteur : colonne droite vide (carte d'offre reportée par Thomas, non noté).
- 375 : H1, chapô, rangée à défilement, première vanne entière avant y = 812 : OK. Aucun débordement horizontal hors rangée.
- Cibles : favori, partage et flèche 44 px (`FLECHE_CARTE_LIEN` h-11 w-11, pastille 32 px), « Révéler la chute » `min-h-11`, pastilles `min-h-11` : OK. Contrastes META sur fond de carte : AA.
- Abonné : « Toutes » active, 12 vannes sur 6 catégories sans doublon consécutif, pagination (page 1 en aplat violet : le seul de l'écran), bloc SEO, FAQ, « La suite » : cohérents avec le visiteur.
- Cohérence comptes : visiteur, gratuit, abonné partagent la même carte ; très cohérent.

### Notes /vannes
1. Élégance : 9/10.
2. Hiérarchie : 8/10. Pas de zone dominante au-dessus de la ligne de flottaison à 1280 (H1, chapô, rangée, 3 cartes de même poids) ; l'offre est dans l'en-tête (décision de Thomas).
3. Largeur : 7/10. Bas de cartes inégaux, tuile pleine largeur creuse, mur à moitié vide.
4. Cohérence entre comptes : 9/10.
5. Finition : 7/10. Écarts entre cartes frères jusqu'à 98 px. Cibles et contrastes : OK.

### Fautes dures /vannes
1. Cartes frères de hauteurs inégales avec écart jusqu'à 98 px réels entre rangées (24 px prévus) sur visiteur, gratuit, abonné à 768, 1280 et 1920 : `apps/web/src/components/vannes/vannes-list.tsx`, `GRILLE_OUVERTE` (`items-start`).

### Pistes /vannes (3)
- `items-stretch` à la place de `items-start` : le pied (déjà sans `mt-auto`, `pt-4`) reste sous le texte, le vide passe en FIN de carte (permis), bas alignés, 24 px entre rangées. Une carte dont la chute est révélée grandit alors avec sa rangée (acceptable, fin de carte).
- Dernière vanne seule : retirer `lg:col-span-3` de `derniereSeule` (`vannes-list.tsx` l.105) et laisser la carte en 1 colonne, le mur de fin en dessous prend la largeur ; ce qui ferait 10 : plus aucune tuile pleine largeur à 25 % de contenu.
- Mur de fin à 1280 : appliquer l'agencement prévu §3.3 (`lg:flex-row lg:items-center lg:justify-between`, bouton à droite en 4 col) sur le conteneur `data-mur-centre`, classes seules.

NOTE GLOBALE Parcours : 7/10
NOTE GLOBALE Vannes : 7/10

Fautes dures (liste numérotée) :
1. Parcours : écart de 92 px (1280/1920) et 143 px (768) entre cartes frères au lieu de 24 : `apps/web/src/components/parcours/parcours-content.tsx` (`GRILLE_CARTES_OUVERTE`, `items-start`).
2. Parcours : séparateur « · » en début de ligne quand la méta passe à la ligne : `apps/web/src/components/parcours/parcours-content.tsx` (`SEPARATEUR_AVANT`).
3. Vannes : cartes frères inégales, écart jusqu'à 98 px entre rangées au lieu de 24 : `apps/web/src/components/vannes/vannes-list.tsx` (`GRILLE_OUVERTE`, `items-start`).
