# Relecture DESIGN à l'aveugle, tour 2 : /parcours et /parcours/repartie (navigation v6)

Captures : `docs/captures/s25/v6-tour-2/parcours/` (4 comptes x 5 largeurs x 2 pages ; `en-cours-parcours-375` lue via sa version 1280/768, la page est la même). Étalon : accueil 1280. Décision de forme et place des boutons : `docs/design/cta-forme-place-s21.md` §1.3 (le chemin donné `docs/ux/` n'existe pas ; le fichier est dans `docs/design/`). Elle prime : un plein par carte sur /parcours (exception b), plein d'étape gratuite sans prix, Premium plein toujours avec prix et garantie.

Limite : les captures pleine page sont réduites à l'affichage, les mesures en pixels ci-dessous sont des estimations visuelles, à confirmer au DOM.

## Ce qui est conforme (et ne retient pas la note)
- Cartes `rounded-xl` à filet violet en haut, pastilles de niveau, rythme aéré : même langue que l'accueil (visiteur-parcours-1280).
- Une colonne centrée stable aux 5 largeurs (x 256 à 1023 à 1280, aucune colonne collée à gauche, aucun débordement sur les 40 captures).
- Visiteur et gratuit : 5 cartes, un plein « Tester l'étape 1 de X, gratuite » par carte, jamais de prix dessus, « Sans compte. La suite : Premium. » en dessous : conforme §1.3.
- Visiteur/gratuit repartie : un seul plein Premium en fin d'étape 1 « Passer à l'étape 2 · 1,99 €/mois », avec prix et garantie 14 jours juste dessous (visiteur-parcours-repartie-1280) : conforme chaud.
- Abonnés : barre de progression, étape active ouverte, étapes faites repliées avec coche, aucune page morte (nouvel : 0 sur 4, « Commencer » unique en plein dans la liste).
- Aperçu : étapes 2 à 4 verrouillées mais titres et XP visibles, pas de mur.

## Notes par critère
| # | Critère | Note |
|---|---|---|
| 1 | Fidélité à la langue de l'accueil | 9 |
| 2 | Hiérarchie et lisibilité | 9 |
| 3 | Mise en page aux 5 largeurs | 9 |
| 4 | Cohérence avec le reste de l'espace | 9 |
| 5 | Finition au pixel | 8 |

**Globale = 8/10** (minimum). Une faute dure.

### 1 Fidélité (9)
- Défaut : H1 « Parcours humour » et « Parcours » alignés à gauche, sans hero centré ni titres de section centrés comme l'accueil (visiteur-parcours-1280, nouvel-parcours-1920). Piste, car l'espace v6 est une page de lecture ; pas une faute.
- Pour 10 : titre de page et « Les parcours » centrés comme l'accueil (classes `text-center` sur l'en-tête de page, fichier de la page /parcours).

### 2 Hiérarchie (9)
- Défaut : micro-textes très petits et discrets, « Sans compte. La suite : Premium. » et « Format : … Environ 20 min » (visiteur-parcours-repartie-1280, ~11-12 px, gris sur carte). Lisibles mais à la limite.
- Défaut : retours à la ligne en escalier dans « Ce que tu vas apprendre » et « Le conseil » (lignes coupées avant la fin, dernière ligne orpheline « phrase suffit. » : visiteur-parcours-repartie-1280, en-cours-parcours-repartie-1280). Cause probable : `text-wrap: balance` ou `max-w` plus étroit que la carte. Corriger : `text-pretty` et retirer le balance sur les paragraphes longs.
- Pour 10 : micro-texte en `text-sm` (14 px) minimum.

### 3 Mise en page (9)
- Défaut : à 1456 et 1920 la colonne reste à ~770 px, soit plus de 1100 px de vide sombre sur 1920 (nouvel-parcours-1920), alors que l'accueil étale 3 colonnes. Pas de vide à droite (centré), donc pas de faute ; mais /parcours en 5 cartes pleine largeur de colonne fait 4678 à 5292 px de haut.
- Correction codable : à `xl`, grille `xl:grid-cols-2` pour les 5 cartes (la 5e seule en dernière ligne centrée) ou garder la colonne ; décision à prendre par Thomas, piste.

### 4 Cohérence (9)
- Défaut : ordre des blocs différent selon le compte. Dans en-cours-parcours-repartie-1280 et -375, « Pour toi qui as toujours la bonne réplique » et « Pour qui ? » sont repoussés après l'étape 4, juste avant le pied de page ; dans nouvel-parcours-repartie-1280 ils sont en haut. Même page, deux logiques. Défendable (l'abonné avancé veut sa progression d'abord) mais à harmoniser avec nouvel.
- Défaut : ordre /parcours : le quiz « Quel parcours est fait pour toi ? » est en tête pour visiteur/gratuit (visiteur-parcours-1280) et en bas pour abonnés (en-cours-parcours-1280), cohérent avec l'usage, noté seulement.
- Défaut : le cadre « Étape 1 gratuite, la suite avec Premium » (visiteur-parcours-repartie-1280) est un bloc à filet violet pour une seule ligne grise : lourd pour son contenu ; le même emplacement porte la progression chez les abonnés. Piste : passer en simple pastille.

### 5 Finition (8) : faute dure
- Faute dure : cibles tactiles sous 44 px sur desktop. Les pastilles de réponse du défi « Pas encore essayé / Essayé, bof / Essayé, ça a marché » mesurent ~30-34 px de haut à 1280 (visiteur-parcours-repartie-1280, en-cours-parcours-repartie-1280, nouvel-parcours-repartie-1280), contre ~55 px pleine largeur à 375. Les liens « Voir » de la liste d'étapes 3.1 à 3.5 sont de petits liens texte (en-cours-parcours-repartie-1280). Correction : `min-h-11` (44 px) sur les pastilles et sur les liens « Voir » (composant du détail de parcours, `parcours-detail`, classes `inline-flex items-center min-h-11 px-4`). À confirmer au DOM avant correction.
- Piste : doublon de pleins pour l'abonné, « Reprendre » en haut puis « Continuer ce parcours » en plein sur la carte Machine à Café (en-cours-parcours-1280) ; idem « Commencer l'étape 1 » + plein sur Répartie (nouvel). Même destination, pas dans le même écran à 1280 ; §1.3 demande « un seul plein ou rien » pour l'abonné. Rendre la carte du parcours en cours en contour si le bloc « Reprendre » est affiché.
- Pour 10 : cibles 44 px confirmées, micro-textes en 14 px.

## Textes à signaler (pas réécrits)
Aucun texte faux vu. Pas de tiret cadratin visible dans les captures.

NOTE GLOBALE : 8/10

Fautes dures :
1. Cibles tactiles < 44 px sur desktop (pastilles « Pas encore essayé / Essayé, bof / Essayé, ça a marché » et liens « Voir » 3.1 à 3.5) : composant de détail de parcours (`parcours-detail`, chemin exact à localiser dans apps/web), ajouter `min-h-11`.
