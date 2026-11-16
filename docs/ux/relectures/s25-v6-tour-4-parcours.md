# Relecture à l'aveugle, s25 navigation v6, tour 4, groupe « parcours »

Périmètre : `/parcours` et `/parcours/repartie`, comptes visiteur, gratuit, en-cours, nouvel. Captures `docs/captures/s25/v6-tour-4/parcours/` : 375, 768, 1280, 1920 pour /parcours (visiteur, gratuit, en-cours, nouvel), 1280 pour les 4 comptes de /repartie, 375 pour gratuit et en-cours de /repartie, 375 nouvel /parcours. Les captures pleine page sont réduites à la lecture : les détails fins (contrastes, alignements au pixel) ne sont jugés que là où ils se voient. Code lu : `apps/web/src/components/parcours/parcours-content.tsx`.

Note de méthode : le brief citait `docs/ux/cta-forme-place-s21.md`, le fichier est en réalité `docs/design/cta-forme-place-s21.md` (lu). §1.3 et B15 : un plein par carte (exception b), jamais deux par carte, étape 1 gratuite en plein pour le visiteur et le gratuit ; l'abonné a un seul plein et les autres en contour. Conforme sur les 4 comptes. Les libellés des boutons ne sont pas ceux du patron de la spec (« Tester l'étape 1 de X, gratuite »), mais ce sont des textes validés : non retenus.

## Ce qui est conforme (vu sur capture)
- Cartes `rounded-xl` à filet violet en haut, pastilles de niveau, titres, rythme aéré : langue de l'accueil respectée.
- Coque plafonnée à 1216 px : 1280, 1456 et 1920 identiques, rien de collé à gauche, aucun vide à droite.
- Un plein par carte (visiteur, gratuit : « Tester l'étape 1 de … » ; nouvel : seul « Répartie » est plein, c'est l'étape conseillée ; en-cours : seul « Continuer ce parcours » de Machine à Café est plein). Jamais deux boutons dans une carte.
- Cibles : « Programme » `min-h-[44px]`, boutons `min-h-12`. OK.
- Nouvel abonné : /parcours n'est pas une page morte (« Tes 4 premières semaines », étape conseillée avec « Commencer l'étape 1 », « Ton cap »).
- Visiteur et gratuit sur /parcours/repartie : étape 1 lisible en entier, étapes 2 à 4 verrouillées, un seul plein Premium (« Passer à l'étape 2 · 1,99 €/mois ») avec prix, garantie 14 jours : conforme B14, pas de mur.
- Vignettes vidéo en dégradé : préversion locale, ignorées.

## Notes

| Critère | Note | Raison |
|---|---|---|
| Design 1 fidélité accueil | 9 | Cartes, filets, pastilles justes. Le titre de page est plus sobre que le hero de l'accueil, acceptable pour une page de liste. |
| Design 2 hiérarchie, lisibilité | 8 | Description de la carte Boulot sur ~150 caractères par ligne à 1280+ (voir F2). |
| Design 3 mise en page 5 largeurs | 8 | Trou mort dans les cartes jumelles (F1). |
| Design 4 cohérence espace | 9 | Rythme et cartes alignés sur les autres pages. |
| Design 5 finition | 9 | Rien de faux relevé ; cibles conformes au code. |
| UX 1 compréhension | 9 | Titre, accroche « Pour toi si… », étape 1 gratuite claire. |
| UX 2 action principale unique | 9 | Conforme à l'exception (b) de la spec ; abonné : un seul plein. |
| UX 3 états vides, nouvel abonné | 9 | Étape conseillée et cap présents. |
| UX 4 aperçu Premium | 9 | Une seule offre, valeur visible (étape 1 entière), aucun mur. |
| UX 5 accessibilité, cohérence entre comptes | 8 | Ordre de /repartie différent selon le compte (F3). |

**NOTE GLOBALE : 8/10** (minimum). Sous la barre de 9, à cause de trois fautes dures, toutes de mise en page et d'ordre, aucune de contenu.

## Fautes dures

**F1. Trou mort entre « Programme » et le bouton dans la carte Confiance** (`visiteur-parcours-1280.png`, idem 1456, 1920, gratuit, en-cours, nouvel ; la carte Storytelling voisine, plus longue, étire la rangée). Environ 60 px de vide dans une carte : viole « aucun vide » (critère Design 3). Cause : `Card` en `flex flex-col` avec `mt-auto` sur le bloc du bouton dans `parcours-content.tsx` (grille `lg:grid-cols-2`, étirement par défaut).
Correction codable : dans `parcours-content.tsx`, grille `lg:grid-rows-subgrid` est lourd ; la plus simple est `lg:items-start` sur la grille (cartes de hauteurs naturelles, plus de vide) ; mieux (10) : rendre chaque carte `lg:row-span-4 lg:grid lg:grid-rows-subgrid` pour que description, exemple, Programme et bouton s'alignent d'une carte à l'autre, l'écart étant absorbé entre le texte et l'exemple et non devant le bouton. Ce qui ferait 10 : aucune zone vide visible dans aucune carte à aucune largeur.

**F2. Carte Boulot seule en pleine largeur : lignes de ~150 caractères** (`visiteur-parcours-1280.png`, 1920 identique ; la règle `lg:[&>:last-child:nth-child(odd)]:col-span-2`). Le paragraphe, l'exemple et le bouton (1150 px de large) s'étirent ; lecture pénible (lisibilité au-delà de 75 caractères) et carte déséquilibrée par rapport aux quatre autres.
Correction codable : dans `parcours-content.tsx`, borner le texte de la carte étirée (`max-w-prose` sur description et exemple) et le bouton `lg:w-auto` pour cette carte, ou centrer la carte seule `lg:col-span-2 lg:mx-auto lg:max-w-3xl`. Ce qui ferait 10 : la carte seule garde la largeur de lecture d'une carte jumelle.

**F3. /parcours/repartie : l'ordre de la page change selon le compte** (`en-cours-parcours-repartie-1280.png` et `nouvel-parcours-repartie-1280.png` contre `visiteur-parcours-repartie-1280.png` et `gratuit-parcours-repartie-375.png`). Visiteur et gratuit : intro, « Pour qui ? », exemple d'abord, puis le programme. Abonné (en-cours, nouvel) : le résumé d'avancement puis le programme, et l'intro « Pour toi qui as toujours la bonne réplique… », « Pour qui ? » et le portrait se retrouvent tout en bas, après le dernier verrou, hors contexte, sous les 4 étapes. Mauvaise compréhension en 3 secondes et incohérence entre comptes (critère UX 5) : le texte qui explique le parcours arrive après le programme.
Correction codable : `components/parcours/parcours-detail.tsx` (rendu de l'intro et du bloc « Pour qui ? » pour l'abonné) : placer le même bloc d'intro sous le titre pour les 4 comptes et laisser au résumé d'avancement la place juste dessous ; ne pas dupliquer le texte. Ce qui ferait 10 : même squelette (titre, intro, pour qui, puis ce qui est propre au compte) pour tous.

## Pistes (ne retiennent pas la note)
- Les boutons de carte sont des `Button` + `router.push` (`handleCta`), pas des liens : pas d'ouverture dans un nouvel onglet, pas de lien suivi par les robots. Un `Link` stylé en `buttonVariants` serait plus juste pour une navigation.
- /parcours/repartie visiteur : titre centré puis intro alignée à gauche, alignement mixte (`visiteur-parcours-repartie-1280.png`). Cohérent avec les pages d'article, simple remarque.
- /parcours abonné : le quiz « Quel parcours est fait pour toi ? » passe sous la liste (décision documentée dans le code), bien ; il garde la colonne de 768 px alors que la grille a 1216 px : voulu.
- Le plein visiteur est répété 5 fois : exception (b) de la spec, conforme.

NOTE GLOBALE : 8/10
