# Relecture DESIGN à l'aveugle, nav v6, variante d (relecture 3)

Périmètre : 32 captures `docs/espace-client/etalons/nav-v6/variantes/d-*.png`, toutes ouvertes. Comparées à la référence de Thomas (`menu-categories-reference-15-11.png`) et à l'étalon accueil (1280 et 375). Rangée de filtres de /vannes exclue. Je n'ai lu ni relecture existante ni commentaire de maquette ni le code : les retouches sont donc exprimées en règles CSS génériques, à rattacher aux sélecteurs réels par @fullstack.

## Constat visuel d'ensemble

Ce qui est au niveau :
- Une seule rangée en capsule sombre arrondie sous l'en-tête, rubrique active en chip plus clair avec filet violet. C'est la même grammaire que la référence (capsule, chip actif, séparateurs verticaux fins, bouton « … » en bout de rangée) transposée dans la langue du site (violet, Plus Jakarta pour les titres, Inter pour les libellés, fond quasi noir).
- Cadenas discrets, même teinte que le libellé, alignés sur la ligne de base : le non-abonné voit les 5 rubriques Premium verrouillées, l'abonné n'en voit aucun. Lisible sans bruit.
- Séparateurs en 3 groupes (Premium | Vannes à La lettre | Favoris, Carnet) : hiérarchie claire.
- Alignement exact : capsule calée sur les mêmes marges que le logo, le H1 et le CTA Premium (1280 et 1920, conteneur 1280 centré). Une seule action primaire dominante (Premium) dans l'en-tête.
- Recherche mesurée à 176 px aux 4 largeurs où elle apparaît (1920, 1280, 768). « … » présent aux 4 largeurs. Panneau « … » : ancré sous le bouton, bord droit aligné sur la capsule, à 1920, 1280, 768.

## Notes

| Critère | Note | Justification |
|---|---|---|
| 1 Élégance et finition | 8/10 | Très net à 1280 et 1920. Finition entamée par les troncatures de 375 et 768 (ci-dessous) et le panneau qui chevauche le filet d'en-tête. |
| 2 Fidélité langue du site et référence | 9/10 | Structure fidèle à la référence, sobriété du site respectée. Écarts de pur goût : double marqueur actif (chip + filet), « … » nu sans pastille. |
| 3 Lisibilité et hiérarchie | 9/10 | Actif, rubriques libres, rubriques verrouillées bien étagés. Le libellé non actif est un gris moyen sur capsule gris foncé : correct, un peu terne à 375. |
| 4 Tenue aux 4 largeurs | 7/10 | 1280 et 1920 impeccables. 768 et 375 : glyphes lisibles coupés (fautes dures). |
| 5 Respect des décisions | 10/10 | Menu toujours affiché, un seul niveau, cadenas discret pour le non-abonné (visiteur et gratuit), recherche 176 px, « … » visible partout. |

## Fautes dures

**F1. Premier libellé tronqué à gauche sans qu'on soit scrollé (375 et 768, pages Aujourd'hui / Quoi répondre).**
- `d-abonne-aujourdhui-375.png` : « ourd'hui », le « A » est coupé et le chip actif est rogné à gauche, filet violet tronqué.
- `d-abonne-aujourdhui-768.png` : « ujourd'hui » coupé, même rognage.
- `d-visiteur-aujourdhui-accueil-768.png` : « urd'hui » + cadenas ; `d-gratuit-apercu-768.png` : « urd'hui » + cadenas ; `d-gratuit-apercu-375.png` : un fragment « i » + cadenas en début de rangée.
- `d-abonne-vannes-768.png` : fragment « ndre » (reste de « Quoi répondre ») au bord gauche.
- Cause probable : le fondu gauche est actif en permanence ou le recentrage de l'actif fait défiler au-delà du premier élément ; dans les deux cas un libellé à moitié lisible est pire qu'un fondu.
- Retouche : (a) masque gauche appliqué seulement si `scrollLeft > 0` (classe `is-scrolled-start`), (b) quand l'actif est le premier élément, `scrollLeft = 0` ; (c) au scroll, `scroll-snap-type: x proximity` + `scroll-snap-align: start` + `scroll-padding-inline: 16px` sur la capsule pour ne jamais s'arrêter sur un libellé coupé ; (d) fondu gauche ≤ 16 px, pas ~48 px.

**F2. Fragment de libellé « Vi » avant « … » (375, toutes pages Vannes).**
- `d-visiteur-vannes-375.png`, `d-gratuit-vannes-375.png`, `d-abonne-vannes-375.png` et leurs variantes menu ouvert : « Vi » (début de « Vidéos ») coupé net contre le fondu, juste avant « … ».
- Retouche : même snap qu'en F1, côté droit : `scroll-snap-align: end` sur le dernier élément visible ; le fondu droit doit couvrir au moins 24 px et commencer après le bouton « … » réservé (`padding-inline-end` de la capsule = largeur du bouton + 8 px). Les lettres doivent soit disparaître entièrement, soit être lisibles : jamais deux lettres.

**F3. Fragment « entraîner » à gauche (375 visiteur et gratuit, `d-visiteur-vannes-375.png`, `d-gratuit-vannes-375.png`).**
- Le « S' » est avalé, le mot commence à « entraîner ». Même famille que F1, même retouche. Sur `d-abonne-vannes-375.png` « S'entraîner » est entier : le défaut vient donc de la largeur additionnelle du cadenas, pas du design.

## Fautes légères (retiennent le critère 1 et 4)

**L1. Séparateur orphelin à 768 (`d-visiteur-vannes-768.png`, `d-gratuit-vannes-768.png`, `d-abonne-vannes-768.png`).**
- Après « La lettre », le filet vertical est suivi d'un creux d'environ 60 px vide avant « … » : Favoris est entièrement masqué et le séparateur annonce un groupe invisible. On lit un trou, pas une suite.
- Retouche : masquer le séparateur quand le groupe qui le suit est entièrement hors vue (`opacity: 0` piloté par un IntersectionObserver sur le premier élément du groupe).

**L2. Panneau « … » à cheval sur le filet d'en-tête (1280, 1920, 768).**
- Le haut du panneau (liseré violet) se pose 3 à 7 px au-dessus du trait horizontal sous l'en-tête (`d-visiteur-vannes-menu-ouvert-1280.png` : panneau y≈180 contre trait y≈185). Le liseré violet traverse le filet : effet de tab flottant imprécis. À 375 le panneau tombe pile sur le filet (y≈218 contre 217), propre.
- Retouche : positionner le panneau depuis le bas de l'en-tête, non depuis le bas de la capsule : `top: calc(100% + 8px)` du conteneur d'en-tête (donc sous le filet), ou à défaut aligner à `top: capsule.bottom + 4px` en gommant la bordure du filet derrière avec `z-index` et fond opaque. Valeur unique à tous les breakpoints.

## Pistes (subjectives, ne retiennent pas la note)

- P1. Double marqueur actif (chip clair plus filet violet sous le texte) : la référence n'a que le chip. Si le fondateur trouve encore « PowerPoint », supprimer le filet et teinter le texte actif en violet clair. À ne faire que sur demande : l'existant est cohérent avec les cartes (liseré violet en haut).
- P2. Le bouton « … » est trois points nus. La référence lui donne une pastille. `border-radius: 9999px; background: rgb(255 255 255 / 0.06); width 40px; height 40px` améliorerait la cible tactile (44 px visé) et l'affordance.
- P3. Mesure de 375 : la recherche à 176 px n'apparaît pas dans l'en-tête (ni icône, ni champ). À confirmer qu'elle vit dans le menu burger ; je ne l'ai pas vu et ne le tiens pas pour une violation, car la décision porte sur la largeur de la recherche quand elle est affichée.
- P4. Panneau « … » à 375 : il s'ancre bord droit à bord droit de la capsule (OK) mais mord largement sur le H1 (« Vannes dr… » masqué). Normal pour un popover ; si on veut du soin, ajouter un voile `rgb(0 0 0 / .35)` derrière.
- P5. À 1920 abonné, 150 px d'air entre « Carnet » et « … » : cohérent avec la référence, rien à faire.

## Risques de régression à vérifier après retouche

Les 32 captures doivent être refaites. Points de contrôle : un libellé coupé ne doit plus exister à aucun scroll (375 et 768, rôles visiteur, gratuit, abonné) ; le chip actif ne doit jamais être rogné ; 1280 et 1920 ne changent pas.

## Verdict

Direction juste, élégante à 1280 et 1920, fidèle à l'esprit de la référence. Le « pas assez élégant » de la première version est résolu sur grands écrans. Il reste des libellés à demi lisibles à 375 et 768, qui ne sont pas « au niveau » : correctifs F1 à F3 requis, puis L1 et L2. Sans eux la note ne peut pas atteindre 10. Avec F1 à F3 corrigés et la capture refaite, 9 à 10 est atteignable.

NOTE GLOBALE : 7/10
