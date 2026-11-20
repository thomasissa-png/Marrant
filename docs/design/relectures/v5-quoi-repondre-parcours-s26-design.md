# Relecture design à l'aveugle, v5 Quoi répondre et Parcours (s26)

Base : captures `docs/captures/s26/v5-quoi-repondre-parcours/` (séquences qr-* et pa-*, pleines pages, 375 et 1280, 1920 pour l'aperçu). Hors périmètre exclu. Échelle typo (14/16/20/24-30, 400/600) : aucune taille hors échelle vue. Bouton violet plein : un seul par écran partout, cloche exclue.

## Notes par page (/10)
- Quoi répondre, aperçu (visiteur, gratuit) : 8
- Quoi répondre, abonné (en cours, nouvel) : 8
- Parcours, liste : 7
- Parcours, détail d'étape : 7

## Notes par trajet (/10)
- qr-visiteur 375 : 8 / 1280 : 8
- qr-gratuit 375 : 8 / 1280 : 8
- qr-abonne-en-cours 375 : 8 / 1280 : 8
- qr-nouvel-abonne 375 : 8 / 1280 : 8
- pa-visiteur 375 : 7 / 1280 : 8
- pa-gratuit 375 : 7 / 1280 : 8
- pa-abonne-en-cours 375 : 8 / 1280 : 7
- pa-nouvel-abonne 375 : 7 / 1280 : 8

## Défauts (note < 9) et correction minimale

### Quoi répondre, aperçu
1. Vide visible dans l'en-tête à 1280 et 1920 (qr-visiteur-1280-1, zone titre) : 61 px entre le titre « Quoi répondre » (y 216) et la phrase d'accroche (y 277), alors que l'accroche est collée aux pastilles (50 px). Le rythme titre/accroche/pastilles n'est pas régulier, et à 375 le titre est serré contre l'accroche : la même page ne respire pas pareil. Correction : un seul espacement entre titre et accroche (mb identique à 375 et 1280), puis pastilles.
2. Grille : la rangée des 3 tuiles (Rattraper un faux pas / L'erreur / Comment choisir) est sur 3 colonnes (bords 404, 453, 826, 875) alors que les lignes au-dessus sont sur 2 colonnes (827, 875). Les gouttières ne tombent pas aux mêmes x (pleine 1280, y 913-1035). Correction : placer ces 3 tuiles sur la même grille que la carte d'exemple et « Où et avec qui ? », ou les mettre en 3 colonnes égales sous un seul gabarit de 12 colonnes pour toute la page.
3. Le bloc final « La suite est dans Premium » est centré sur 447 px de large (x 417-863) sans lien avec la grille au-dessus : il flotte entre deux largeurs. Correction : le caler sur la largeur des 3 tuiles ou sur la colonne droite.
4. Le badge « Premium » est au-dessus du titre à 1280 mais à droite du titre à 375 (qr-visiteur-375-1) : position qui saute d'un breakpoint à l'autre. Correction : même ordre aux deux largeurs (badge au-dessus).
5. Texte « Voici un exemple de cette rubrique » : une ligne seule en 14 px, détachée (y 399) avec 50 px de vide au-dessus et 34 px au-dessous. Correction : le rattacher à la carte d'exemple (mb-sm, mt réduit).
6. Les tuiles « Où et avec qui ? » : la dernière ligne (Commerces, voisins, transports) laisse un vide à droite alors que les puces ne s'alignent pas en colonnes ; permis, mais pas aligné aux bords de « Pour quoi faire ? ». Piste : gap fixe, pas de correction exigée.

### Quoi répondre, abonné
1. Ligne coupée en bas de la liste (qr-abonne-en-cours-1280-1/3, y 820) : « Tu pars déjà ? » est tranchée à mi-hauteur sous le pied « Le carnet du mois ». Visible à chaque capture du 1280. Correction : fondu (mask-image) sur 24 px en bas du conteneur défilant, ou hauteur de liste multiple de 44 px.
2. Le gris de la ligne « Fait » (« La poêle », « Samedi, j'invite ») passe en gris plus faible que les lignes non faites ; deux gris différents dans la même liste, et la ligne active devient blanche et grasse : trois traitements pour une liste de 10 lignes. Correction : un seul gris pour les lignes faites (text-text-secondary), actif seul en blanc.
3. Titre de carte « À toi » + pastille « Fait » (qr-abonne-en-cours-1280-3, y 400) : la pastille grandit la ligne, le texte qui suit est à 31 px contre 32 px sans pastille ; la carte « À toi » saute de 1 px et la pastille n'est pas centrée sur la ligne de base du titre. Correction : hauteur de ligne fixe (h-6) sur l'en-tête de carte avec ou sans pastille.
4. Le bouton « Situation suivante » est en contour à 1280 et plein à 375 (décision fondateur, non noté), mais sa distance à la carte passe de 24 px (375) à 24 px (1280) : correct ; RAS.
5. Vide sous la liste de navigation : hors périmètre.

### Parcours, liste
1. Vide visible, carte Machine à Café de l'abonné (pa-abonne-en-cours-1280-5, y 442-490) : à droite de « Programme », la moitié de la rangée est vide (pas de bouton) alors que les autres cartes y mettent « Continuer / Commencer ce parcours ». Le vide est visible et la grille de boutons est rompue. Correction : y mettre un bouton « Reprendre » en contour (jamais plein, le violet est déjà dans l'encart), ou fusionner « Programme » sur toute la largeur.
2. 375 visiteur et gratuit (pa-visiteur-375-4, pa-gratuit-375-4, y 760) : la ligne « Sans compte. La suite : Premium. » (ou « La suite : Premium. ») décrit un bouton qui n'est plus dans la carte (le CTA « Tester l'étape 1 » est remonté au-dessus de la liste). Texte orphelin sous « Programme ». Même défaut sur les 4 autres cartes (sans bouton). Correction : à 375 garder le bouton dans chaque carte (comme à 1280) et retirer le doublon du haut, ou masquer la phrase à 375.
3. Le bloc d'accroche de la carte laisse 28 à 50 px de vide entre le texte de gauche et la rangée « Programme » quand la colonne italique est plus longue (pa-visiteur-1280-1, y 510-560). Correction : items-start et rangée du bas à 24 px fixe (mt-lg) au lieu d'un espace libre qui s'étire.
4. Titre « Parcours humour » : 24/30 px mais « Les parcours » (abonné) est en 20 px sans filet ; le H1 « Parcours » de l'abonné et le H1 long du visiteur n'ont pas la même ligne de départ (y 172 contre 172, ok) mais la distance H1 → premier bloc passe de 50 px (visiteur) à 48 px : négligeable, aucune correction.

### Parcours, détail
1. L'étiquette « Parcours Machine à Café · 3 semaines » (pa-visiteur-1280-2, y 172) n'existe que sur l'étape 1 : sur l'étape 2 ou 3 (pa-abonne-en-cours-1280-2/3, pa-nouvel-abonne-1280-3) elle disparaît et le titre remonte de 24 px (y 200 contre 176). L'en-tête de carte saute d'une étape à l'autre. Correction : étiquette sur toutes les étapes, ou nulle part.
2. Menu latéral visiteur (pa-visiteur-1280-2, y 271) : « Lecture libre » (x 275-357) et les cadenas (x 354-366) n'ont ni la même largeur ni le même bord droit ; la colonne de droite n'est pas alignée. Correction : colonne fixe w-24, texte aligné à droite, ou mettre un cadenas aussi sur l'étape 1.
3. Cartes vidéo inégales (pa-abonne-en-cours-1280-4, y 170-555) : la carte de gauche descend à 555, celle de droite à 535. Correction : grid items-stretch (h-full) sur les deux cartes.
4. Libellé de vignette coupé en « Petites blagues entre amis de Thom... » (pa-nouvel-abonne-375-5, y 349), troncature visible. Correction : line-clamp-2 plutôt que truncate sur une ligne.
5. Texte « Pourquoi cette étape ? » : coupure en fin de ligne trop courte (« sans que ça sente / la préparation », pa-visiteur-1280-2, y 338-358), et espace titre de section → encart de 36 px à l'étape 1 nouvel abonné contre 24 px ailleurs (pa-nouvel-abonne-1280-2, y 290 → 326). Correction : [text-wrap:pretty] sur le paragraphe, mt-lg commun.
6. Menu replié 375 : le bouton « Reprendre » ou « Commencer » en contour est collé au pied sans séparation nette de la liste (pa-nouvel-abonne-375-3, y 700). Piste, pas une faute.

## Fautes dures
Aucune faute dure typo ou violet. Les points ci-dessus sont des écarts de finition : vide visible (Parcours liste 1, 2), saut d'écran à écran (détail 1, QR badge 4), alignement (QR grille 2, détail 2 et 3).

NOTE GLOBALE : 7/10
