# Relecture DESIGN à l'aveugle, « Aujourd'hui », s25 v7 tour 4

Périmètre lu : brief v7, specs design (UX non relue en détail, structure vérifiée sur les rendus), étalon accueil 1280, captures des 4 comptes (visiteur, gratuit, en-cours, nouvel) à 375, 768, 1280, 1920 en pleine page et en premier écran (1456 non ouvert : même rendu que 1280 selon l'INDEX), code `aujourdhui/**`, `apercu/{badge-premium,offre-apercu,extrait-coupe,tuile-fermee}.tsx`, `tableau.tsx`.
Hors périmètre respecté : bande des rubriques, en-tête global, vignettes en dégradé, formulation de T1 et T2.

## Verdict en une phrase
La page est au niveau : un seul accent fort par écran, aperçu lu FERMÉ au premier coup d'œil (pastille « Premium » avec le mot sur chaque tuile, contenu atténué, fondu, « La suite est dans Premium »), offre en haut dans une carte à `border-2 border-accent-primary`, grille 8/4 puis 4/4/4 ou 6/6, plus de « bloc centré ». Aucune faute dure. Reste de la finition au pixel sur la carte Z1 figée.

## Constat par compte (rendus)
- **Visiteur 1280** : hero 7/5 (H1 gauche, offre à droite, bouton plein en haut de carte, une seule offre, « Connexion » en lien discret). Extrait Z1 + Z2 + trois tuiles fermées, coupe nette à ~840 px, pastille, T2, second bouton (même libellé, sous le premier écran de 900 px : jamais deux pleins ensemble, tour 3 tenu). 1920 : même composition, halo visible sur les côtés. Lecture « fermé » : oui, en 1 s.
- **Gratuit** : même squelette, phrase d'objet en plus dans la carte d'offre (hauteur 410 px, bouton toujours en haut). Cohérent avec le visiteur.
- **Nouvel** : Z1 « Ton premier pas » (seul plein), Z2 cap 1/5 avec série éteinte (jamais « 0 »), Étape conseillée 5/12 + « Tes 4 premières semaines » 7/12, puis Contenu du jour. Pas de page morte.
- **En-cours** : Z1 rafale, Z2 avec 250 XP et série 1, Étape en cours + Mission en 6/6, contenu du jour en 6/6 avec la vidéo sur deux rangées à droite (1280, 1920), question d'aise en dernière ligne à puces de 44 px. 375 et 768 propres (vidéo en ligne de média à 768, bien).

## Notes (grille design)
| Critère | Note | Justification |
|---|---|---|
| 1 Élégance et fidélité à l'accueil | 9 | Même langage que l'étalon (cartes `rounded-xl`, filet violet sur Z1 et le contenu du jour, carte d'offre reprise). H1 de l'aperçu en `text-5xl`, H1 abonné en `text-4xl` : voulu par la spec, mais l'écart se voit en passant d'un compte à l'autre. |
| 2 Hiérarchie | 9 | En plissant les yeux : H1, Z1 + bouton, carte d'offre (aperçu). Un seul plein dominant. Léger : la rafale (en-cours) met « Les cartes du jour » en plein alors que l'étape en cours est juste dessous en simple lien « Reprendre » (choix de spec, pas une faute visuelle). |
| 3 Usage de la largeur, 5 largeurs | 9 | Grilles 8/4, 4/4/4, 6/6, 5/7 sans tuile creuse ni débordement aux 4 largeurs ouverts. À 1920 la coque reste à 1216 px (spec) ; le halo ne couvre que les ~290 px du haut, le bas des côtés reste noir uni. Piste, pas faute. |
| 4 Cohérence entre comptes | 10 | Mêmes composants (`ActionDuJour`, `CapDuJour`, tuiles) dans l'extrait et chez l'abonné : le prospect voit le produit réel. |
| 5 Finition au pixel | 9 | Contrastes et cibles vérifiés au code (voir plus bas), tout est conforme. Défauts d'alignement de Z1 dans l'extrait (pistes 1 et 2). |

**Globale design : 9/10 (minimum des critères). Aucune faute dure.**

## Vérifications au code (pas de faute dure)
- Texte violet courant en `text-accent-link` partout (`ETIQUETTE_ACTION`, `PIED_TUILE`, `BadgePremium`) ; `text-accent-primary` seulement sur la flamme et les segments (non textuels). Réassurance `text-text-muted` sur carte : 5,9:1 (spec). OK.
- Extrait inerte (`aria-hidden`, `inert`, `pointer-events-none`) : atténuation `opacity-75` exemptée du 4,5:1 ; le bouton figé n'a plus de double atténuation (commentaire tour 3 dans `action-du-jour.tsx`). OK.
- Cibles : boutons `size lg` (h-12), `PIED_TUILE` `min-h-12`, lignes de cartes `min-h-14`, « Connexion » `min-h-11 min-w-11`, `lienCarte` `min-h-11`, puces de la question d'aise 44 px (capture : 43-44 px). OK.
- Focus : `focus-visible:ring-2` présent sur pieds de tuile et lignes de cartes ; aucun `outline-none` sans anneau.
- Rythme : pas de vide de plus de 48 px dépendant du contenu, hors pistes ci-dessous.

## Pistes (non bloquantes)
1. **Pastille « Premium » mal alignée sur l'étiquette de Z1 figée** (visiteur et gratuit, 1280 et 1920, `visiteur-aujourdhui-ecran-1280.png`) : la pastille est centrée à y=518, l'étiquette « TON PREMIER PAS » et « 5 min » à y=533 (15 px d'écart) ; sur Z2 l'écart est de 4 px, sur Z3 0 px. Cause : `p-6 md:p-8` de Z1 (`CARTE_ACTION`) contre `top-3 md:top-4` de la pastille. Correction : dans `tuile-fermee.tsx`, laisser `top-3 md:top-4` par défaut et passer, pour Z1, un `className` `md:top-6` (Z1 en `p-6` à `md:p-8` : étiquette à 32 px du bord, pastille h-6 centrée donc `md:top-[1.25rem]`), ou, plus simple, `className="top-5 md:top-5"` côté appelant de Z1 dans `apercu-verrouille.tsx`. Ferait 10 au critère 5.
2. **« 5 min » flotte à 98 px du bord droit de Z1 figée** (`pr-24` dans `action-du-jour.tsx`, rangée 1 quand `fige`) alors que chez l'abonné elle s'aligne sur le bord droit du bouton (`nouvel-aujourdhui-1280.png`, x=802). Dans l'aperçu elle se retrouve à gauche de la pastille, désalignée du bouton. Correction : au lieu de `pr-24`, placer la durée à gauche de la pastille avec `lg:pr-28` seulement quand la pastille la recouvrirait, ou ranger la pastille sur la ligne de l'étiquette (piste 1) et supprimer `pr-24` pour la durée en la plaçant sous le titre.
3. **Tuile fermée « Contenu du jour »** (extrait, rangée 2, colonne 3) : sans étiquette, ses deux lignes « Vanne du jour » / « Conseil du jour » sont dessinées comme des champs bordés. Or « bordé = cliquable » (convention du site). Lecture légèrement ambiguë, d'autant que le bas est fondu. Correction : retirer `border` de ces lignes (fond `bg-background-elevated`, comme `PASTILLE`) dans l'extrait de `apercu-verrouille.tsx`.
4. **Écart de 80 px entre le hero et l'extrait à 1280** (`lg:mt-20` dans `extrait-coupe.tsx`) : volontaire (tour 3 : repousser le second bouton sous le premier écran), mais lu comme un vide au-dessus de la rangée 1 (`visiteur-aujourdhui-1280.png`, y 410 à 490). Piste : 64 px (`lg:mt-16`) suffit si le premier écran fait 900 px ; à vérifier que le bouton de fin reste sous 900.
5. **Z2 abonné, deux statistiques de hauteurs de libellé différentes** (1280, `en-cours-aujourdhui-1280.png`) : « XP gagnés depuis ton arrivée » sur 3 lignes, « jour de pratique d'affilée » sur 2 ; le chiffre « 1 » est décalé par la flamme. Piste : `grid-cols-[auto_1fr]` ou `gap-x-6` pour garder les libellés à 2 lignes (`cap-du-jour.tsx`).
6. **Vide horizontal variable dans Z1 à 768** (visiteur, nouvel) entre le titre sur 3 lignes et le bouton : dépend de la longueur du titre du jour, sous 48 px de hauteur, donc piste seulement.
7. **1920** : le halo (`h-72`) s'arrête vers 290 px ; envisager `before:h-[28rem]` pour accompagner Z1 et Z2, sans changer la largeur de la coque.

## Anti-look IA, qualité DA
Pas de dégradé violet-bleu envahissant, pas d'icône dans un carré, pas d'emoji, un seul plein par écran. Aucun fichier de capture ne montre de débordement ni de texte coupé hors de l'extrait voulu.

NOTE GLOBALE : 9/10

Fautes dures : aucune.
