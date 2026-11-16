# Relecture design à l'aveugle, s25 v6 tour 5, groupe « parcours »

Périmètre : `/parcours` et `/parcours/repartie`, comptes visiteur, gratuit, en-cours, nouvel. Captures : `docs/captures/s25/v6-tour-5/parcours/`. Lues : liste des 4 comptes à 1280 (visiteur aussi 375, 768, 1920 ; en-cours et nouvel 375), détail Répartie visiteur, en-cours, nouvel à 1280 et 375, en-cours à 1920. Les 1456 n'ont pas été ouverts (mise en page identique à 1280 : coque plafonnée). Limite : les captures pleine page à 375 sont réduites (100 à 130 px de large à l'affichage), je ne juge à 375 que la structure, l'ordre et les positions ; les cibles tactiles sont vérifiées dans le code (`parcours-content.tsx` : « Programme » `min-h-[44px]`, bouton `min-h-12` ; `step-blocks.tsx` : liens de fiche `min-h-[44px]`, retour d'exercice `min-h-[44px]`). Aucune faute de cible.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 9 |
| Design 2 hiérarchie, lisibilité | 9 |
| Design 3 mise en page 5 largeurs | 9 |
| Design 4 cohérence espace | 9 |
| Design 5 finition | 9 |
| UX 1 compréhension | 10 |
| UX 2 action principale | 9 |
| UX 3 états vides, nouvel abonné | 10 |
| UX 4 aperçu Premium non abonné | 10 |
| UX 5 accessibilité, cohérence comptes | 9 |

**NOTE GLOBALE : 9/10. Aucune faute dure.** Le groupe franchit la barre (9 minimum, sans faute dure). Ce qui retient chaque 9 est une piste, pas un blocage.

## Ce qui est conforme (preuves)

- Cartes de parcours `rounded-xl` à filet violet en haut, pastilles de niveau, H1 centré : langue de l'accueil (`visiteur-parcours-1280.png`).
- Boutons conformes à cta-forme-place-s21 §1.3 / B15 : visiteur et gratuit, un plein « Tester l'étape 1 de X, gratuite » par carte (jamais deux), ligne frontière en `text-xs text-text-muted` dessous ; « Sans compte. » retiré pour le gratuit (`gratuit-parcours-1280.png` : « La suite : Premium. » seule). Aucun Premium sur les cartes. Détail visiteur : un seul plein (« Passer à l'étape 2 · 1,99 €/mois ») avec prix, ligne compte et garantie, aperçus 2+ repliés sans bouton.
- Abonné : un plein par page dans la liste (en-cours : Reprendre ; nouvel : Commencer l'étape 1), les cartes en contour sauf celle du parcours courant ; jamais deux pleins dans un même écran 1280 x 800 (le plein de bloc est à y ≈ 650 px, celui de carte à ≈ 1 400 px).
- Nouvel abonné jamais mort : « Tes 4 premières semaines », étape conseillée, « Ton cap 1 sur 5 », puis les 5 parcours (`nouvel-parcours-1280.png`). Détail nouvel : étape 1 ouverte, plein « Commencer » dans la carte de progression.
- Argumentaire après le programme pour l'abonné qui a validé une étape : décision s19, non discutée.
- Mise en page : 2 colonnes dès `lg`, cinquième carte centrée à la largeur d'une jumelle (décision tour 4 point 3), 1 colonne à 768 et 375. Pas de débordement, pas de colonne collée à gauche à 1280 et 1920 (`visiteur-parcours-1920.png`, `en-cours-parcours-repartie-1920.png` : tout est centré).

## Pistes (ne retiennent pas la note au-delà de 9)

1. **Titres de section à gauche, pas centrés** (« Quel parcours est fait pour toi ? », « Explore aussi », « Questions fréquentes », « Le programme ») alors que l'étalon centre ses titres de section. Défaut : design 1 (9). Correction codable : `parcours-content.tsx` ligne 269 (`h2`) et les h2 de la page `(dashboard)/parcours/(liste)/page.tsx` : `text-center` si Thomas veut l'étalon à la lettre. À arbitrer avec les autres pages de l'espace (je n'ai pas vu leur alignement : si elles sont à gauche, laisser). Ferait 10 : titres alignés sur la règle choisie pour tout l'espace.
2. **Argumentaire de fin de détail abonné sans séparation** (`en-cours-parcours-repartie-1280.png`, y ≈ 1 660 à 1 760 de l'image réduite) : le paragraphe d'intro suit la ligne de l'étape 4 à ≈ 35 px, sans titre ni filet, et finit à ≈ 30 px du pied de page ; il se lit comme un reste. Correction : dans `parcours-detail.tsx`, conteneur de l'argumentaire `mt-10 border-t border-border pt-8`. Ferait 10 : bloc identifiable comme section.
3. **Pas de plein au premier écran 375 pour le nouvel abonné sur le détail** (`nouvel-parcours-repartie-375.png`) : intro, « Pour qui ? » et témoignage précèdent la carte de progression, le bouton « Commencer » est à ≈ 890 px, sous un écran de 812. C'est la conséquence de la décision s19 (argumentaire avant le programme tant qu'aucune étape n'est validée) : piste seulement. Option codable : `parcours-detail.tsx`, rendre la carte de progression avant l'argumentaire quand 0 étape est validée. À valider par Thomas.
4. **Vide dans les cartes jumelles** (Confiance, `visiteur-parcours-1280.png`, ≈ 70 px sans contenu avant « Programme ») : conséquence voulue du `mt-auto` (barres et boutons alignés, tour 4 point 2). Pas de correction.
5. **Colonne de 768 sur coque 1216** pour le quiz, « Explore aussi » et la FAQ, cartes à 1216 : deux largeurs dans la même page (décision tour 3 point 12). Rendu propre, centré ; pas de faute.

## Textes

Aucun texte réécrit. Rien de faux repéré. Aucun tiret cadratin visible.

## Fautes dures

Aucune.
