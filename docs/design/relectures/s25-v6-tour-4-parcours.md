# Relecture design à l'aveugle, s25 v6 tour 4, groupe « parcours »

Captures lues : `docs/captures/s25/v6-tour-4/parcours/` : 375, 1280, 1920 pour visiteur et en-cours ; 1280 pour gratuit et nouvel ; en-cours 375 ; repartie visiteur 1280 et en-cours 1920. Les 768 et 1456 n'ont pas été ouverts (aucun doute de mise en page : même grille que 1280, une colonne sous `lg`). Spec lue : `docs/design/cta-forme-place-s21.md` (le chemin `docs/ux/` du prompt n'existe pas) §1.3 et B15. Code lu : `parcours-content.tsx`, `parcours-espace.tsx`. Cibles tactiles : `Programme` = `min-h-[44px]`, boutons `min-h-12` : conformes.

## Ce qui est conforme
- B15 respecté sur les 4 comptes : un plein par carte (visiteur, gratuit : étape 1 gratuite, ligne frontière `text-xs` dessous), jamais deux dans une carte. Abonné : un seul plein (parcours en cours, ou Répartie pour le nouvel), les autres en `outline-accent`.
- Cartes `rounded-xl` à filet violet, badges, titres : langue de l'accueil. États nouvel et en-cours jamais morts (4 semaines, cap, reprise, progression).
- Aucun débordement ni vide à droite à 1280/1920 : la grille deux colonnes occupe la coque. 375 : une colonne propre, boutons pleine largeur.
- Page `/parcours/repartie` : un seul plein par écran (« Passer à l'étape 2 · 1,99 €/mois » avec prix, paiement et garantie dessous), étapes 2 à 4 repliées, abonné avec sommaire à boutons « Fait / Voir / Reprendre ».

## Notes /10
| Critère | Note |
|---|---|
| Design 1 fidélité accueil | 9 |
| Design 2 hiérarchie, lisibilité | 8 |
| Design 3 mise en page aux 5 largeurs | 8 |
| Design 4 cohérence espace | 9 |
| Design 5 finition au pixel | 8 |
| UX 1 compréhension | 9 |
| UX 2 action principale unique | 9 |
| UX 3 états vides, nouvel | 9 |
| UX 4 aperçu Premium non-abonné | 9 |
| UX 5 accessibilité, cohérence comptes | 9 |

**NOTE GLOBALE : 8/10** (minimum).

## Fautes dures

### F1. Une seule carte, deux alignements : trou entre « Programme » et le bouton, et Programme décalé d'une carte jumelle à l'autre
- Défaut : `en-cours-parcours-1280.png`, `nouvel-parcours-1280.png`, `visiteur-parcours-1280.png`, `gratuit-parcours-1280.png`, 1456, 1920. Ligne 2 : la carte Confiance (texte court) étire un vide d'environ 60 px entre la barre « PROGRAMME » et le bouton, alors que Storytelling n'en a pas ; la carte lit comme s'il manquait un contenu. En-cours ligne 1 : « PROGRAMME » de Machine à Café et de Répartie à ~20 px d'écart (blocs de progression de hauteurs différentes), alors que les deux boutons sont alignés. Ligne 2 : « PROGRAMME » à ~70 px d'écart entre jumelles.
- Correction codable : `components/parcours/parcours-content.tsx`, ligne ~355 : en mode ouvert, passer le `<details>` et le bloc bouton dans un même conteneur `mt-auto flex flex-col gap-6` (le `mb-6` du `details` devient `gap-6`), au lieu du seul bloc bouton en `mt-auto`. Le vide passe alors entre le témoignage et « PROGRAMME » (lecture d'espacement, non de contenu manquant) et les barres « PROGRAMME » comme les boutons s'alignent d'une carte jumelle à l'autre. Pour un alignement parfait en haut aussi, `lg:grid-rows-subgrid` est possible mais non nécessaire.
- Ce qui ferait 10 : un seul rang d'alignement bas par ligne de cartes, aucun trou entre deux éléments d'une même carte.

### F2. Carte orpheline Boulot : mesure de ligne d'environ 150 caractères à 1280 et 1920
- Défaut : toutes les captures ≥ 1280, ex. `visiteur-parcours-1920.png` : la dernière carte (`[&>:last-child:nth-child(odd)]:col-span-2`) étale description, témoignage et persona sur ~1150 px ; la description fait 3 lignes de ~150 caractères, hors confort de lecture (> 90), et la carte détonne avec ses voisines (texte plus large que la mise en page de l'accueil, qui plafonne ses paragraphes).
- Correction codable : `parcours-content.tsx`, ligne ~338 et ~341 : dans la carte pleine largeur, ajouter `lg:max-w-3xl` (768 px) au paragraphe de description et au témoignage ; garder le bouton et la barre « Programme » en pleine largeur de carte. Alternative : `lg:[&>:last-child:nth-child(odd)]:mx-auto lg:[&>:last-child:nth-child(odd)]:max-w-3xl` plutôt que `col-span-2` pleine largeur.
- Ce qui ferait 10 : texte ≤ 90 caractères par ligne dans toutes les cartes.
- Nota : la règle « dernière carte seule en pleine largeur » est une décision du tour 3 ; la faute porte sur la mesure du texte, pas sur le placement.

## Pistes (ne retiennent pas la note)
- P1. Largeur : le titre, le quiz, « Explore aussi » et la FAQ sont dans la colonne de 768 px, les cartes dans la coque de ~1240 px (trois bords gauches sur `visiteur-parcours-1280.png`). Décision du tour 3 (point 12) : conforme, signalé seulement. Le titre « Quel parcours est fait pour toi ? » est aligné à gauche de la colonne, alors que l'accueil centre ses titres de section : candidat `text-center` si Thomas le souhaite.
- P2. Texte `text-xs` de la ligne frontière (« Sans compte. La suite : Premium. ») en `text-text-muted` : lisible, contraste conforme selon la spec (6:1), petit sur 1920. Laisser.
- P3. `/parcours/repartie` : l'introduction et « Pour qui ? » de l'abonné sont rendus sous le programme (`en-cours-parcours-repartie-1920.png`), alors que le visiteur les lit en haut ; ordre différent entre comptes. À valider par Thomas avant de changer (texte et ordre éditorial).

## Fautes dures : liste
1. Trou et décalage entre « Programme » et le bouton des cartes jumelles : `apps/web/src/components/parcours/parcours-content.tsx` (regrouper `details` + bloc bouton dans un conteneur `mt-auto`).
2. Mesure de ligne ~150 caractères dans la carte orpheline pleine largeur : `apps/web/src/components/parcours/parcours-content.tsx` (`lg:max-w-3xl` sur description et témoignage, ou carte centrée en `max-w-3xl`).
