# Bibliothèque, relecture DESIGN à l'aveugle, s26 tour 3

Captures lues : `docs/captures/s26/rubriques-tour-3/bibliotheque/` (visiteur, gratuit : 375 / 1280 / 1920 ; en-cours : 375 / 1280 / 1920 ; nouvel : 375 / 1920). Code lu : `bibliotheque/page.tsx`, `bloc-bibliotheque.tsx`, `apercu-bibliotheque.tsx`, `hero-apercu.tsx`, `carte/styles.ts`. Hors note, conformément au brief : verrouillage réel, titre d'aperçu en dégradé, place de la promesse (jugée : bonne, sous le H1, `max-w-xl`), filet violet retiré, « La suite est dans Premium ».

## Gate typographique (`TAILLES.md`, citée)

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur, gratuit | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 tailles, 6 comb. | 4 tailles (30, 20, 16, 14), 6 comb. | idem 1280 |
| en-cours, nouvel | 4 tailles, 4 comb. | 4 tailles, 6 comb. | 4 tailles (30, 20, 16, 14), 4 comb. | idem 1280 |

Résultat : jamais plus de 4 tailles, jamais plus de 6 combinaisons (limite atteinte, pas dépassée, sur l'aperçu et sur l'abonné à 768). Tout dans l'échelle `typo-harmonie-espace-s25.md` : Jakarta 600 pour les titres, Inter 400/600 ensuite, zéro capitale. GATE : PASS.

Contrôles complémentaires : aplat violet unique au premier écran à 1280 et 1920 (bouton d'offre du hero ; le second bouton est sous la ligne de flottaison, 1169 px) ; abonné : aucun aplat, aucun accent (le violet visible est celui de l'en-tête global, hors périmètre). Cibles : pastilles de thèmes `min-h-11`, liens `LIEN_NEUTRE` `min-h-11`, « Entrer » 44 px mesuré sur capture : OK.

## Notes par critère

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Même langage que « Aujourd'hui » : cartes 12 px, 1 px de bord, 24 px entre cartes, fondu de l'extrait, un seul bouton plein. Abonné sobre, retenu. |
| 2 Hiérarchie | 8 | Aperçu : zone dominante nette (offre en haut à droite, construction à gauche). Abonné : trois colonnes de même poids, sept titres de carte identiques (20/600) ; la ligne « à faire » n'est marquée que par un trait blanc de 2 px à gauche. L'oeil n'a pas de point d'entrée (en plissant les yeux, rien ne ressort sauf H1). |
| 3 Largeur aux 5 largeurs | 8 | Abonné : 3 colonnes à 1280, 1456, 1920, vides de fin de colonne seulement (permis : 224 px sous « Formules », 164 px sous « Vocabulaire », 224 px sous le coin) ; pas de débordement à 375. Aperçu : vide de 210 px en fin de colonne droite (840 à 1050 à 1280) à côté de la tuile « Formules » coupée : permis mais l'ensemble reste déséquilibré. Faute d'alignement ci-dessous. |
| 4 Cohérence entre comptes | 8 | Même H1 et même grille de cartes à 12 px, mais le bloc « Vannes, conseils, vidéos » change de forme : étiquette 14/600 grise dans l'aperçu contre titre 20/600 chez l'abonné ; pastilles de thèmes pleines contre contour ; liens `Vannes ›` en gras avec chevron contre liens soulignés. Les deux hauts de page diffèrent (hero contre H1 seul) : normal. |
| 5 Finition au pixel | 8 | Voir faute dure 1 (bords non alignés, 120 px). Contrastes lisibles, focus et cibles 44 px confirmés au code. |

NOTE GLOBALE = minimum = 8.

## Défauts précis et corrections codables

1. **Bords verticaux du hero et de l'extrait non alignés (faute dure, chiffrée)**. À 1280 : bord gauche de la carte d'offre x = 875, bord gauche de la colonne droite de l'extrait x = 755, soit 120 px d'écart ; à 1920 : 1195 contre 1075, 120 px aussi. Cause : `hero-apercu.tsx` découpe en 8/4 (`lg:col-span-8` / `lg:col-span-4`), `apercu-bibliotheque.tsx` en 7/5 (`lg:col-span-7` / `lg:col-span-5`, deux fois). Correction : passer l'extrait de Bibliothèque en 8/4 (`lg:col-span-8` sur la tuile construction et sur la tuile « Formules », `lg:col-span-4` sur `data-apercu-pile`) : bords à 875 des deux côtés, sans toucher le hero partagé avec les autres rubriques. Vérifier que les pastilles de thèmes (3 lignes) et les liens `Vannes ›` tiennent dans 373 px (sinon `gap-x-4`). Ferait 10 sur le critère 5.
2. **Hiérarchie de l'abonné (piste, non chiffrable)**. Aucun point d'entrée. Correction codable : conserver la grille, mais rendre la ligne `marquerProchaine` identifiable sans couleur : fond `bg-background-elevated` en plus du trait (`liste-fiches.tsx`), et sans nouvelle taille ni nouvel accent. Ferait 9 à 10 sur le critère 2.
3. **Cohérence du bloc Vannes entre aperçu et abonné (piste)**. Aligner l'aperçu sur l'abonné : titre du bloc en `TITRE_CARTE` (déjà dans l'échelle), pastilles de thèmes avec contour `border-border-input` (comme `bloc-bibliotheque.tsx` l'écrit), liens `LIEN_NEUTRE`. Ferait 10 sur le critère 4.
4. **Vides de fin de colonne (piste)**. Abonné : 224 px sous « Formules à détourner » à côté du coin « Humour noir » ; aperçu : 210 px à droite sous « Vocabulaire ». Permis par la règle. Pour les réduire sans grossir de texte : à l'aperçu, mettre « Vocabulaire » à droite dans la même hauteur que « Formules » (`h-auto` retiré, rangée 2 en `items-stretch`), ou en abonné inverser colonnes 1 et 3 du coin. Ferait 9 à 10 sur le critère 3.

## Verdict

Barre 9/10 non atteinte : une faute dure chiffrée (alignement). Le reste est solide : gate typo PASS, un seul aplat, rythme 24 px, cibles 44 px.

NOTE GLOBALE : 8/10

Fautes dures :
1. Bords du hero (8/4, `apercu/hero-apercu.tsx`) et de l'extrait (7/5, `apercu/apercu-bibliotheque.tsx`, classes `lg:col-span-7` x2 et `lg:col-span-5`) décalés de 120 px à 1280 et 1920, visiteur et gratuit.
