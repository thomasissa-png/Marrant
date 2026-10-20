# Verdict v4.2 : le designer exigeant (UI senior)

Dossier : `apres-v4-2/`. Lu : `avant`, `decryptage-ouvert`, `accordeons`, `conseil-court-avant` à 1440 ; `avant`, `accordeons` à 1024 ; `avant`, `focus-bouton`, `miniature-1`, `miniature-3` à 1280 ; `avant` à 768 ; `avant`, `chute`, `miniature-2` à 375.
Non lues : `focus-partage`/`etoile`/`video`, `zones`, `320`, `1280-miniature-2`, `375-miniature-1`/`-3`, `vanne-*`, `conseil-long-*`. Couleurs estimées à l'oeil.

## Notes (v4.1 : 9, 9, 9, 9, 8, 9, 9, global 8,9)
| # | Critère | v4.2 |
|---|---|---|
| 1 | Clarté | 9 |
| 2 | « Révéler la chute » | 9 |
| 3 | Hiérarchie | 9 |
| 4 | Cohérence | 9 |
| 5 | Espacements et alignements | 9 |
| 6 | Mobile et tablette | 9 |
| 7 | Finition | 9 |
| **Globale** | | **9/10** (aucun critère < 9, barre 10/10 non atteinte) |

Acquis : bloc titre vidéo centré à côté de la miniature, plus de vide à droite (`1440-visiteur-avant.png`, `1280-visiteur-avant.png` : ~36 px au-dessus et au-dessous). Miniature à 256 px, 299 px pour les autres vidéos, durée en texte. Les trois autres vidéos (`1280-visiteur-miniature-1.png`, `-3.png`, `375-visiteur-miniature-2.png`) gardent la rangée à l'identique. Chute en gras 32/40, lien « L'anatomie d'une vanne » sur une ligne, quote courte insécable.

## 5. Espacements et alignements (9)
- `1024-visiteur-avant.png`, `1024-visiteur-accordeons.png` : les deux accordéons de la Vidéo sont espacés de 21 px, ceux du Conseil voisin de 8 px. Même composant, deux rythmes côte à côte. Le reste d'égalisation (37 px) est absorbé là. Correction : écart de 8 px dans les deux cartes, et rendre le reste à 1024 par une 4e ligne d'extrait au Conseil (+24 px) et ~13 px de hauteur de miniature (190 px vers ~203 px).
- `1024-visiteur-avant.png` : miniature de 190 × 107 px et titre en 16 px (18 px partout ailleurs). La miniature est trop petite pour qu'on lise « ROMAN FRAYSSINET » et le titre change de taille d'une largeur à l'autre. Correction : si la 4e ligne d'extrait est adoptée, la miniature remonte à ≥ 200 px, et le titre peut rester en 18 px sur 2 lignes.
- `1440-visiteur-decryptage-ouvert.png` : le 2e paragraphe (« Montre ton défaut… ») s'arrête ~110 px avant le bord droit de la boîte, alors que le 1er paragraphe remplit la ligne jusqu'à x=1039. Les lignes 1 et 2 finissent à x≈919 et 931. Correction : retirer `text-wrap: balance` du corps d'accordéon, utiliser `text-wrap: pretty`, de façon que tous les paragraphes remplissent la même largeur.

## 7. Finition (9)
- `1440-visiteur-avant.png`, `375-visiteur-avant.png` : le fondu de 12 px sur la dernière demi-ligne de l'extrait Conseil coupe les jambages de la 3e ligne (« retourne : l'autre sent… Garde », « 3 secondes, pas avant la fin… »). Elle paraît tronquée net, comme un débordement, et non estompée. Correction : fondu sur toute la dernière ligne (`linear-gradient(#000 calc(100% - 24px), transparent)`), ou hauteur figée au multiple exact de 3 lignes (pas de demi-ligne visible).
- `1440-visiteur-avant.png` : pointillés de 1,5 px du bouton « Révéler la chute » (~#6b4fb3 à 40 % d'opacité). Moins lourds, mais le contour tombe à ~2:1 sur le fond (cible non texte < 3:1). Le libellé et l'icône portent la lecture, le bouton reste identifiable ; la bordure pâlit. Correction : `border-violet-400` à 100 % (~#a78bfa), 1,5 px, sans opacité.
- `375-visiteur-miniature-2.png` : miniature quasi noire (Chris Esquerre) sur fond de carte #1f1f1f : bords à peine visibles. Correction : `ring-1 ring-inset ring-white/10` sur toutes les miniatures.
- `1280-visiteur-miniature-1.png` : le titre incrusté « GÉNÉRATION Y » est coupé à droite par le recadrage 16:9. Le mal vient de la source, mais `object-position: 40% 50%` limite la perte.
- Positifs : ampoule à 24 px équilibrée avec la tête rieuse et la claquette (`1440-visiteur-avant.png`), anneau de focus net (`1280-visiteur-focus-bouton.png`), bordures et filets visibles.

## Handoff
Notes v4.2 : 9 partout, globale 9/10 (aucun critère < 9).
1. 1024 : même écart de 8 px entre accordéons dans Conseil et Vidéo (21 px contre 8 px), 4e ligne d'extrait + miniature ≥ 200 px, titre vidéo en 18 px.
2. Typo et fondu : retirer `balance` du corps d'accordéon (paragraphe 2 court de 110 px à 1440), fondu de l'extrait sur toute la dernière ligne, plus de demi-ligne coupée net.
3. Finition : contour du bouton à `violet-400` plein (2:1 aujourd'hui) et `ring-1 ring-white/10` sur les miniatures sombres.
