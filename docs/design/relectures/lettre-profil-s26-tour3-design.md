# Relecture design à l'aveugle, La lettre (`/lettre`) et Profil (`/profil`), s26 tour 3

Interrupteur ouvert. Captures lues : `docs/captures/s26/lot2-tour-3/{lettre,profil}/` (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1920 ouverts, 1456 non ouvert). Code lu : `lettre-page-ouverte.tsx`, `lettre-page-inscription.tsx`, `lettre-inscription.tsx`, `lettres-abonne-cartes.tsx`, `archive-lettres.tsx`, `profil-ouvert.tsx`, `supprimer-compte-card.tsx`, `typo.ts`, `tailwind.config.ts`, layout du dashboard. Décisions déjà prises (titre blanc, filet blanc, un seul aplat, interrupteurs et pastille Premium neutres, colonne de lecture, « Supprimer mon compte » en contour rouge sous son texte, textes) : non notées.

## 0. Gate typographique (citée)

`TAILLES-lettre.md` : visiteur et gratuit, 4 tailles (24/20/16/14 sous 1024, 30/20/16/14 dès 1280), 6 combinaisons à toutes les largeurs (PASS, sans marge) ; en-cours et nouvel : 4 tailles, 5 combinaisons (PASS). Graisses 400/600 seulement, familles Jakarta pour les titres, Inter ailleurs.
`TAILLES-profil.md` : gratuit, en-cours, nouvel : 4 tailles, 5 combinaisons à 375 et 768 (en-cours, nouvel), 6 à 1280 et 1920 (PASS). Le visiteur sur /profil est la page de connexion (3 tailles, 4 combinaisons), hors périmètre.
Aucune taille hors échelle, aucune capitale, un seul aplat violet par écran (bouton « Envoie-moi la lettre », « S'abonner · 1,99 €/mois » ou « Reprendre l'étape 3 »). Le violet restant (bordure et fond de `CARTE_ACTION`, point de notification de l'en-tête) est permis.

## 1. La lettre

### Visiteur / gratuit (page d'inscription, 7/5)
Vu : à 1280 colonne gauche 698 px (7 col), colonne droite 493 px (5 col), conforme au 7/5. Bouton, haut à y = 444 px, bas à 491 px (< 450 pour le haut) ; à 375 le bouton est à y = 567 (< 700). À 768 : inscription puis « dernier numéro » pleine largeur, ligne de lecture de 688 px, correcte. À 1920 : contenu plafonné à 1216 px, comme l'étalon.
Vide : sous la carte d'inscription, la colonne gauche est vide sur environ 2 000 px à 1280 (la carte droite fait 2 435 px). Le code la rend `lg:sticky lg:top-36 lg:self-start` dans une grille `lg:items-start`, sans `overflow` sur `main` : le sticky fonctionne, la carte suit la lecture. Une capture pleine page ne peut pas le montrer ; c'est un vide de fin de colonne, permis. Risque : `top-36` (144 px) au lieu de `top-24` de la spec, correct tant que l'en-tête global fait 121 px.
Défauts visibles :
- Le champ e-mail se confond avec la carte : bord `border-border` (#2A2A2A) sur carte #1F1F1F, soit 1,15:1 (WCAG 1.4.11 exige 3:1) ; le champ « Ton prénom » de Profil, lui, utilise `border-input` (#707070) : même famille de champ, deux traitements (cohérence entre pages). Fond `bg-background-light` au lieu de `bg-background-elevated`, `px-3` au lieu de `px-4` (spec §6.1).
- Le placeholder « toi@exemple.fr » est en #9A9A9A (`placeholder:text-text-muted`), un troisième gris de texte, alors que l'espace n'en autorise que deux (#FFFFFF, #B3B3B3 ; typo-harmonie §4.4). L'override `ECHELLE_CARTES_PARTAGEES` (`[&_.text-text-muted]`) ne vise pas la variante `placeholder:`.
- Dans le formulaire : `gap-3` (12 px) entre case et texte, `mt-0.5` : hors pas de 8 px (§2.4).

### Abonné actif (archive, 2 lettres)
Vu : titre blanc + compteur « 2 » en baseline ; la dernière lettre en `CARTE_ACTION` pleine largeur (1216 × 110 px à 1280), contenu sur 310 px de large : 75 % de la tuile est vide, sans signe d'action (pas de bouton « Lire », pas de chevron, le lien est un pseudo-élément étiré). Précédentes : 1 carte sur 3 colonnes (389 px sur 1216), 2/3 de rangée vide, vide de fin de rangée donc permis. 375 : tuile et carte empilées, bien alignées (marges 16 px), `mt-12` entre blocs.
Le compte « nouvel » montre 2 lettres comme « en-cours » : l'état vide 8/4 d'`ArchiveLettres` n'est pas sur les captures (non jugé ; code conforme à la spec : `lg:col-span-8` + `lg:col-span-4`, aucun aplat).
Cohérence entre comptes : identique, à la pixel près entre en-cours et nouvel, et entre visiteur et gratuit (hors e-mail pré-rempli).

### Notes Design (La lettre)
1. Élégance et fidélité à l'accueil : 8 (tuile d'archive creuse, champ sans contour lisible).
2. Hiérarchie : 8 (visiteur : titre, carte, bouton clairs ; archive : aucun point d'entrée visible malgré la tuile dominante).
3. Usage de la largeur : 7 (tuile d'archive vide à 75 %, 1 carte sur 3 colonnes ; visiteur correct grâce au sticky).
4. Cohérence entre comptes : 9.
5. Finition : 6 (contour du champ 1,15:1, placeholder en troisième gris, espacements 12 px).

## 2. Profil

Vu : en-tête à gauche (titre blanc, sous-titre `max-w-xl`), grille 8/4 à 1280 (colonne gauche 804 px, droite 389 px, conforme), `gap-6`, cartes `p-6`, rayons 12 px, aucune ombre. Pastille « Premium » neutre, interrupteurs blancs, un seul aplat (« Reprendre l'étape 3 » pour les abonnés, « S'abonner · 1,99 €/mois » pour le gratuit). Séparateur `border-t` à 48 px de la fin des colonnes, « Supprimer mon compte » pleine largeur, bouton rouge contour sous le texte : conforme. À 768 : une colonne principale, cartes de réglage en 2 colonnes ; à 375 : une colonne dans l'ordre du DOM, abonnement après « Mes parcours ». 1920 : contenu plafonné à 1216 px.
Vides : fin de colonne gauche 295 px (en-cours), 220 px (nouvel), 105 px (gratuit) : permis. « Prochaine étape » (gratuit) : 3 sous-cartes dont la dernière seule sur sa rangée (vide de fin de rangée, 385 px à 1280) : permis. La carte « Supprimer » laisse sa moitié droite vide (texte plafonné à `max-w-prose`, décision déjà prise).
Défauts :
- `AvertissementAbonne` (`supprimer-compte-card.tsx` l.174) : `mt-3 p-3` soit 12 px de marge et de padding, hors pas de 8 (§2.4), alors que les paragraphes voisins sont à `mt-2` ; le même fichier a `gap-3` (formulaire de confirmation, l.118).
- Texte courant dans la colonne de droite : les cartes « Abonnement » et « Ta question à l'équipe » sont en blanc (#FFF), les cartes « Rappel », « Prénom », « La lettre de la semaine » en #B3B3B3 : deux rôles de texte courant sans règle (les deux gris sont permis, l'emploi est incohérent).
- Statistiques : 4 colonnes égales de 193 px pour des contenus de 70 à 120 px, soit environ 113 px de blanc entre deux stats voisines à 1280 : lecture de grille, pas de bloc cassé (piste).
- Gratuit à 375 : au premier écran (812 px) aucun bouton plein : « S'abonner » est à y = 941 sous trois sous-cartes. Conforme à l'ordre du DOM de la spec (action, abonnement, …), mais l'offre n'est pas au premier écran.

### Notes Design (Profil)
1. Élégance et fidélité à l'accueil : 9.
2. Hiérarchie : 9 (carte d'action en tête à gauche, un seul accent).
3. Usage de la largeur : 8 (colonne gauche courte à droite d'une colonne longue, carte de suppression à moitié vide).
4. Cohérence entre comptes : 9.
5. Finition : 7 (espacements 12 px, couleurs de texte courant hétérogènes).

## 3. Fautes dures (chiffrables)
Voir la liste en fin de fichier. Les points « pistes » ne sont pas des fautes.

## 4. Pistes (3 par page)
La lettre :
1. Archive : chevron SVG `h-4 w-4 text-text-secondary` à droite de la tuile (`flex items-center justify-between` dans `lettres-abonne-cartes.tsx`), sans texte neuf : rend l'action visible et occupe le vide.
2. Champ e-mail : `border-border-input bg-background-elevated px-4 placeholder:text-text-secondary`, `gap-4` (sous condition `echelleEspace` pour garder le HTML fermé).
3. Vérifier le sticky de la colonne d'inscription en navigateur (capture viewport après scroll de 800 px) et caler `top-24` si l'en-tête n'est pas collant.
Profil :
1. Gratuit : première carte de la colonne principale = Abonnement, avant « Prochaine étape » à 375 (`profil-ouvert.tsx`), pour mettre l'offre au premier écran.
2. `AvertissementAbonne` : `mt-4 p-4` (16 px) ; formulaire `gap-4`.
3. Texte courant des cartes de droite en `TEXTE` (#B3B3B3) partout (Abonnement, Question à l'équipe), valeurs seulement en `TEXTE_FORT`.

NOTE GLOBALE La lettre : 6/10
NOTE GLOBALE Profil : 7/10

Fautes dures :
1. `apps/web/src/components/lettre/lettre-inscription.tsx` l.238 : contour du champ e-mail `border-border` = 1,15:1 sur carte (WCAG 1.4.11, spec `border-border-input`), à conditionner par `echelleEspace`.
2. `apps/web/src/components/lettre/lettre-inscription.tsx` l.238 : `placeholder:text-text-muted` (#9A9A9A), troisième gris de texte hors {#FFFFFF, #B3B3B3}.
3. `apps/web/src/components/lettre/lettre-inscription.tsx` l.238, 249, 263 : `px-3`, `gap-3`, `mt-0.5` (12 px et 2 px) hors du pas de 8 px.
4. `apps/web/src/components/profil/supprimer-compte-card.tsx` l.174 et l.118 : `mt-3 p-3` et `gap-3` (12 px) hors du pas de 8 px (voisin à `mt-2` = 8 px).
