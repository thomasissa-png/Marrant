# Relecture design à l'aveugle, S'entraîner, s26 tour 3

Captures lues : visiteur et nouvel/en-cours à 375, 1280 et 1920 ; gratuit à 1280 (la tête d'offre diffère seulement par la réassurance). Code lu : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx`. Hors périmètre respecté (verrouillage, titre dégradé, promesse, filet retiré, « La suite est dans Premium », `CARTE_ACTION`, pas de plein avec carte en attente, segments masqués avant la première carte faite).

## Gate typographique (`TAILLES.md`)
- Premier écran, 4 comptes x 375 et 1280 : 4 tailles distinctes partout (24 ou 30, 20, 16, 14), 6 combinaisons (5 pour nouvel à 375). Graisses 400 et 600 seulement, aucune capitale dans `main`. **Gate PASS** (seuils : > 4 tailles ou > 6 combinaisons). Aucun élément hors échelle relevé à l'oeil sur les captures.
- Un seul aplat violet par écran : visiteur et gratuit, le bouton « Premium · 1,99 €/mois » de la carte d'offre en haut à droite (le second, en fin d'extrait, est sous le pli à 1280x900 et à 375). Abonnés : zéro aplat, voulu.

## Notes par critère (Design)
1. Élégance et fidélité à l'accueil : **9/10**. Retenue, un seul accent, rayons et bords homogènes, titres alignés à gauche. Abonné 1280 : la carte d'action tintée, l'échelle en lignes séparées par `border-t` et la ligne de marche en cours sur `bg-background-elevated` sont propres. Écart pour 10 : la jauge « Marche 2 ▂▃▁ » (5 barres creuses à angles droits, à côté de « Marche 2 » dans la carte mission) est un petit pictogramme hors du vocabulaire des segments `rounded-full h-2` du système (`en-cours-s-entrainer-1280.png`, carte mission, y 678).
2. Hiérarchie : **9/10**. Aperçu : l'offre en haut à droite + H1 dominent, les trois éléments identifiables en plissant les yeux sont offre, titre, carte « Quelle réplique ? ». Abonné : la carte d'action (teinte + bordure) domine sans plein, mission à droite plus calme. Écart pour 10 : sur l'aperçu à 1280, la carte « Quelle réplique ? » (texte plein contraste, 3 choix A/B/C encadrés) reste le bloc le plus clair et attire plus l'oeil que l'offre juste au-dessus. Piste, pas faute.
3. Usage de la largeur : **9/10**. Grille 7/5 aux 4 grandes largeurs, contenu 1216 px à 1920, aucun débordement, aucune tuile creuse. Vides notés, tous permis (fin de colonne) : sous la colonne cartes, abonné, 180 px (en-cours 852 vers 1032, 1280) à 170 px (nouvel 885 vers 1056) sur 700 px de large ; aperçu, sous « Quand ça tombe à plat » ~150 px x 490 px. Ils ne se comblent pas en grossissant un texte ; voir piste 1.
4. Cohérence entre comptes : **8/10**. Même H1, mêmes marges (pt 8, gap 6, p 6), même grille. Écarts : (a) dans l'aperçu, « Mission » est une étiquette 14/600 gris au-dessus d'une liste en deux lignes « Marche n / titre » (`visiteur-s-entrainer-1280.png`, y 503 à 790), chez l'abonné c'est un titre de carte 20/600 avec liste en une ligne « Marche n · titre » + « Fait » ; (b) l'aperçu superpose cinq signaux ETIQUETTE (« Si tu as 5 minutes », « Mission », « Ce qu'on aurait pu dire ») là où l'abonné affiche titres 20/600 ; l'aperçu doit rester une maquette fermée, mais « Mission » est le même objet. Pour 10 : mettre l'en-tête de la tuile mission de l'aperçu en `TITRE_CARTE` comme chez l'abonné (`apps/web/src/components/espace/apercu/apercu-s-entrainer.tsx`), sans ajouter de taille (20 déjà présent dans l'écran).
5. Finition au pixel : **9/10**. Alignements gauche/droite nets, marges 24 constantes, contrastes AA (gris #B3B3B3 sur carte, y compris `opacity-75` de l'extrait, lisible), pas de défilement horizontal à 375. Cibles : les ensembles `min-h-11` / `h-12` du code et les boutons « Oui / À moitié / Rien », « Essayé, bof » semblent à ~44 px ; non mesurables à la loupe sur captures réduites 375 (puces « Marche n » estimées 38 à 44 px) : à confirmer au test navigateur, pas chiffrable ici donc pas de faute. Écart pour 10 : « Ta réponse d'abord » et sa consigne passent sous un `max-w` qui coupe « Rien / n'est noté » en orpheline à 1280 et 1920 (carte action, y 598 à 618), alors que la carte fait 650 px ; la consigne devrait occuper toute la largeur de la carte (retirer le `max-w-*` de la consigne dans `apps/web/src/components/espace/carte/carte-et-toi.tsx` / `carte-registre.tsx`).

## Vues par compte
- Visiteur 375 : offre (bouton plein y ~345) au premier écran, un seul plein, extrait lisible fermé (verrous, barres grises, fondu), mission en pile : OK. 1280/1920 : bien équilibré, offre en haut à droite.
- Gratuit : identique, réassurance plus complète dans la carte d'offre, la carte est alors pleine sans vide.
- Visiteur 1280 : carte d'offre étirée à la hauteur du hero, ~50 px de vide sous « Connexion » (fin de carte, permis).
- En-cours et nouvel, 1280/1920 : titre, accroche, deux colonnes alignées sur la même ligne (y 277), plus de décalage ; nouvel = scène plus longue, colonne gauche 885 px contre 1056 à droite.
- 375 abonnés : carte action ~800 px, puis ligne repliée, puis mission (puces « Marche n » en retour à la ligne, jamais de défilement). Le premier écran à 375 ne montre que la carte (échelle sous le pli) : sujet UX, pas design.

## Pistes (3)
1. Sous la carte d'action (1280/1920 abonné), 170 à 180 px de vide en bas de colonne gauche : si Thomas veut le combler, un bloc de contenu (par exemple la carte repliée suivante, qui existe déjà quand la rafale a 2 cartes) plutôt qu'une taille de police ; sinon laisser. Aucun correctif obligatoire.
2. Aligner l'en-tête « Mission » de l'aperçu sur celui de l'abonné (`TITRE_CARTE`) et passer la liste en « Marche n · titre » une ligne : `apercu-s-entrainer.tsx`.
3. Remplacer la jauge à barres creuses de la carte mission par des segments `h-2 rounded-full` du système (`apps/web/src/components/espace/mission/mission-carte.tsx`) ; retirer le `max-w` de la consigne « Ta réponse d'abord ».

## Fautes dures
Aucune (gate typo PASS, un seul aplat, aucun vide milieu de bloc > 32 px chiffré, aucun débordement).

NOTE GLOBALE : 8/10

Fautes dures : aucune.
