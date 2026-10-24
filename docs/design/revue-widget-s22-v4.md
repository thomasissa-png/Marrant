# Revue visuelle s22, tour 4 : widget « La vanne du jour »

Revue @design, commit `c1de819e`. Captures `v4-*.png` lues une à une : courte (`cs19jkboulot5`) en iframe clair avant et après à 375, avant à 320 et à 1280 ; longue (`cs18jkstory5v4`) en iframe clair avant et après à 375, après à 320 ; longue sombre avant à 375 ; courte sombre en script après à 320 ; focus clair (chute) et sombre (marque) à 1280 ; texte à 200 %. Les autres combinaisons de la matrice (hôte, format, largeur) sont jugées par échantillon. Relecture de `embed-html.ts` (l.54 à 68). Mesures de hauteur de @fullstack reprises, recoupées sur capture.

## Verdict : GO, 9,2 / 10 (barre : 9)

Le défaut qui retenait le tour 3 (vide sur téléphone) est corrigé dans sa nature : le bloc est centré, la carte paraît composée et non inachevée. La variante « chute réservée » est validée.

## Variante « chute réservée » : validée

- **Avant le clic, le bouton est bien placé.** Courte à 375 : étiquette à 432, amorce à 463, bouton de 493 à 537 ; après le clic, « Pas moi. » occupe exactement la même place (493 à 537), l'amorce n'a pas bougé d'un pixel. Même résultat à 320 (bouton 523 à 567, chute au même endroit) et à 1280 (bouton de 363 à 407).
- **Longue à 375** : le bouton (560 à 604) devient la chute de trois lignes (560 à 688) sans aucun déplacement de l'amorce ; la carte avant le clic montre 140 px d'air sous le bouton, qui est la place de la chute. Cela se lit comme une marge normale, pas comme un trou. 56 px restent sous la chute après révélation : aucun rognage, aucun défilement, texte et pied intacts à 320.
- **La carte est équilibrée** : bloc légèrement au-dessus du centre (2:3), pied ancré, bande violette et coins nets. Le clair et le sombre sont identiques en composition (longue sombre 375, courte sombre script 320 lues).
- Accessibilité : `visibility:hidden` retire la chute de l'arbre d'accessibilité avant le clic, donc pas de lecture prématurée de la chute.

## Vide restant sur téléphone : acceptable

Sur capture, courte à 375 : environ 148 px au-dessus du bloc (de la bande à l'étiquette) et 207 px en dessous (du bouton au filet), dans une carte de 516 px. À 320 : environ 150 et 210 px. C'est plus que le « max » annoncé (128 / 191), mais c'est la vanne la plus courte, donc le pire cas ; les médianes annoncées (94 / 141) restent plausibles et je ne les ai pas refaites. Le contenu est un bloc compact flottant entre deux marges généreuses, avec le pied qui ferme la carte : cela se lit comme de l'air, plus comme un chargement raté. Ce n'est plus un défaut, c'est un réglage de goût (un 375 de 410 px de haut serait plus dense, mais la courbe de hauteur protège la plus longue vanne, ne pas la baisser).

## Défauts du tour 3 : état

| Réf. | État | Preuve |
|---|---|---|
| V1 vide central sur vanne courte | Corrigé (centrage 2:3 en place, vide restant jugé acceptable) | courte avant/après 375, 320, 1280 |
| Effet de bord : saut de l'amorce à la révélation | Corrigé, mieux que prévu : zéro saut, pas 11 à 22 px | courte et longue, avant/après |
| M3 anneau de focus de la marque non vérifiable | Corrigé | `v4-focus-sombre-4-marque-1280` : carte entière, anneau violet #A78BFA complet sur les quatre côtés, rien de rogné |
| Anneau de la chute | Toujours bon | `v4-focus-clair-2-chute-1280` : anneau complet, #6D28D9 |
| M1 aperçu sombre vide en pleine page (eager) | Annoncé corrigé, non relu : les captures de la page du programme ne font pas partie de ce lot | à confirmer par @qa |
| M2 code CSP coupé au tiret (nowrap) | Annoncé corrigé, non relu, même raison | à confirmer par @qa |
| M4 repli, trou chez l'hôte | Inchangé, accepté (cas rare, phrase de doc) | |

## Nouveaux défauts

Aucun majeur. Deux réserves, non bloquantes :

- **R1. Capture texte à 200 % inexploitable** (`v4-zoom200-iframe-longue-avant-375`) : la zone du widget est un grand rectangle vide (environ 950 px de crème entre le paragraphe et la suite), l'iframe n'apparaît pas. Probablement un artefact de capture (iframe non chargée ou zoom appliqué après coup), car les autres captures du même lot montrent la carte. Je ne peux donc pas confirmer visuellement que le haut reste accessible au défilement quand les entretoises tombent à 0. La logique CSS est saine (`flex:2 1 0` et `3 1 0`, pas de `justify-content:center`, longue à 375 déjà à marge ~56 px), donc risque faible. À refaire par @qa : attendre le chargement de l'iframe, `scrollTop` = 0 au départ, `scrollHeight` > `clientHeight`.
- **R2. Mesure à reconcilier** : écart entre le max annoncé (128 px au-dessus) et ce que je lis (148). Sans impact sur le verdict ; vérifier si la mesure exclut la bande de 4 px, l'étiquette ou le padding.

## Contrastes

Inchangés et revérifiés sur échantillon : étiquette #A78BFA sur #1F1F1F, lien et chute teintée lisibles en sombre ; texte de chute sur fond teinté AA dans les deux thèmes ; bouton blanc sur #6D28D9 7,1:1. Cibles de 44 px conservées (bouton, liens du pied).

## 10 critères Thomas

1. PRO oui. 2. BEAU oui. 3. BRAND-ALIGNED oui. 4. MÊME IDENTITÉ oui, clair, sombre, iframe, script. 5. PROPRE oui. 6. ALIGNÉ oui. 7. AÉRÉ oui, y compris à 375 et 320 (réserve de goût sur 150 à 210 px de vide autour d'une vanne très courte). 8. CONVERSION oui, bouton violet seul élément dominant avant le clic. 9. HIÉRARCHIE oui. 10. ACCESSIBLE oui ; R1 à confirmer.

## Note : 9,2 / 10, GO

Pour 9,5 : R1 refaite et validée, puis relecture de la page du programme (M1, M2).

## Handoff @fullstack / @qa
Aucun changement de code requis. @qa : refaire la capture de texte à 200 % (R1), relire M1 et M2 sur la page du programme à 375, rebaser les instantanés visuels du widget. Documenter dans `REPLIT_ACTIONS.md`.
