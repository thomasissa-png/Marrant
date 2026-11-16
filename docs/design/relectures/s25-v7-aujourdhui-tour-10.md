# Relecture DESIGN à l'aveugle, « Aujourd'hui », s25 v7 tour 10

Périmètre : `main` seulement (en-tête global, bande des rubriques, pied de page, `ETIQUETTE` partagée de `carte/styles.ts` hors périmètre). Captures lues : 4 comptes x 375, 768, 1280, 1920 (pleine page), plus premiers écrans 375 et 1280 du visiteur ; code lu : `typo.ts`, `tableau.tsx`, `action-du-jour.tsx`, `hero-apercu.tsx`, `offre-apercu.tsx`, `extrait-coupe.tsx`, `tableau-verrouille.tsx`.

## 0. Verdict d'ensemble, honnête

La page est devenue propre, sobre et cohérente : une échelle tenue, un seul plein violet, des cartes alignées sur 12 px et 24 px, des vides seulement en fin de carte. Elle est au niveau d'un produit soigné. Elle n'est pas encore « envoûtante » : côté prospect, le fermé se lit tout de suite (verrous, bouton éteint, fondu, offre en haut à droite), mais ce que l'on voit à acheter est un empilement de cartes gris sur gris dont le contenu est volontairement pâle (extrait à `opacity-75`, titres de tuiles sans rien de concret au-delà de « Répartie » et de la marche 1). Côté abonné, c'est clair et rangé, avec une seule zone chaude (la carte d'action), mais un peu monotone : aucun point de joie, la progression est une barre grise. Élégant : oui. Donne envie : à moitié.

## 1. Gate typographique MESURÉE (bloquante)

Citation de `TAILLES.md` (script `tailles-comptes.mjs`, 4 comptes, 375, 768, 1280, 1920) :
- Les 16 lignes donnent `TAILLES DISTINCTES : 4` (24/20/16/14 à 375 et 768 ; 30/20/16/14 à 1280 et 1920) et `COMBINAISONS : 6` (30 ou 24/600 display, 20/600 display, 16/400, 16/600, 14/400, 14/600).
- Graisses 400 et 600 seulement, aucune capitale dans `main` (le script note : « aucune capitale »). Toutes les valeurs sont dans l'échelle de `typo-harmonie-espace-s25.md` §1 (constantes de `typo.ts`).
- Tour 10 n'a ajouté aucune taille : la légende garde `META` (14/400), « Tes 4 premières semaines » passe en `ETIQUETTE` (14/600).
- Verdict gate : PASS (seuils : > 4 tailles ou > 6 combinaisons = faute dure ; ici 4 et 6, au plafond, pas de marge : toute correction qui ajoute un style est refusée).
- Réserve de lecture : la mesure ne couvre que le premier écran de `main`. Sous le premier écran, les captures n'montrent aucun élément hors échelle (lignes « Semaine n » en 14, carte vanne/conseil/vidéo en 20/16/14).

## 2. Accent violet

- Abonné (nouvel, en-cours) : la carte d'action (`CARTE_ACTION` : dégradé `accent-primary/10`, bord `accent-primary/40`) contient le seul bouton plein (« Commencer », « Les cartes du jour »). Conforme à la règle du tour. Aucun autre violet dans `main` (barres et segments en gris `text-secondary`, rail `border-hover`). PASS.
- Aperçu (visiteur, gratuit) : aucun violet hors bouton d'offre. Z1 figée prend `TUILE` neutre (confirmé au code, `action-du-jour.tsx` l. 52) ; son bouton est un contour éteint. À 1280 le second plein (fin d'extrait, y 952) est sous le premier écran de 900 px ; les deux boutons sont la même action. PASS.
- Note hors périmètre : au premier écran de l'aperçu, le bouton violet de l'en-tête global s'ajoute à celui de l'offre. Même bouton, même libellé, déjà tranché ailleurs ; à ne pas imputer à la page.

## 3. Grille Design (note /10)

| # | Critère | Note | Justification et défaut précis |
|---|---|---|---|
| 1 | Élégance et fidélité à l'accueil | 8 | Rythme 24/48 px, rayons 12, bords 1 px, titres 20/600 : harmonieux. Mais l'ensemble est plat (gris sur gris de même poids) et la page n'a aucun moment fort hors le bouton ; l'accueil, lui, a de la matière visuelle. Pas de faute, piste. |
| 2 | Hiérarchie (zone dominante, un accent) | 9 | Abonné : Z1 teintée en haut à gauche, un bouton violet, lecture immédiate à 375/768/1280/1920. Aperçu : bouton d'offre en haut à droite, seul plein. Au 1280 du nouvel abonné, Z1 est large (7 col.) mais son contenu tient en deux lignes, la carte est creuse en bas (permis, fin de carte) : la zone dominante domine par sa teinte, pas par son poids. |
| 3 | Usage de la largeur aux 5 largeurs | 8 | Grilles 7/5, 5/7, 6/6 à 1280 et 1920 ; la coque plafonne à 1216 px, donc 1920 = 1280 avec des marges de 352 px (voulu par la spec). Défaut résiduel dans l'aperçu à 1280 et 1920 : entre le bas de la colonne de texte (preuve, y 375) et la légende (y 451), 75 px, puis 40 px jusqu'aux tuiles ; la bande se lit encore comme un petit trou entre hero et extrait, même si la légende « se rattache » à l'extrait. À 768, sous les pastilles, environ 100 px de vide à gauche de la carte d'offre (fin de colonne : permis). Aucun vide au milieu d'un bloc, aucune tuile creuse, aucun débordement. |
| 4 | Cohérence entre comptes | 9 | L'aperçu reprend les tuiles de l'abonné (mêmes composants figés) ; mêmes étiquettes 14/600, mêmes titres 20/600, mêmes rails. Seule incohérence : la preuve « 1 500+ » est dans la carte d'offre à 375 et 768 mais sous les pastilles dès 1024 (`preuveHors`) : voulu, à noter. Le Contenu du jour est en 2 colonnes (vanne+conseil empilés, vidéo à droite) et non 3 x 4 comme la spec ; sans cellule vide. |
| 5 | Finition au pixel | 9 | Contrastes : secondaire #B3B3B3, 7,08:1 au pire sur la teinte, 4,66:1 atténué dans l'extrait (chiffres du code, `tableau.tsx` l. 15 à 20), au-dessus de 4,5:1. Cibles : boutons `size lg` 48 px, pieds de tuile `min-h-12`, « Connexion » `min-h-11 min-w-11`, puces C9 et « Une autre » 44 px (lus sur capture, échelle 1,06). Anneau de focus inset sur les pieds. Défaut mineur : les lignes « Semaine n » en 14 px avec colonne de libellés à largeur variable (« Semaine 1: » collé au deux-points) fatiguent un peu à 375 ; piste, pas faute. |

## 4. Grille UX (note /10)

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Prospect : envie en 3 secondes | 8 | Fermé : immédiat (verrous, bouton éteint, fondu, mot « Premium » unique, offre en haut, une seule offre, « Connexion » discret). Valeur : promesse + 6 pastilles + extrait. Ce qui manque : l'extrait ne montre presque rien de concret (barre vide, « Ta série démarre… », 3 titres) ; l'envie repose sur la phrase. Les pastilles du hero ressemblent à des filtres cliquables. |
| 2 | Abonné : clarté | 9 | « Je sais quoi faire » : carte teintée, bouton plein, durée, scène. En-cours : « Si tu as 5 minutes » + deux cartes du jour, puis étape (« Reprendre ») et mission. Lecture claire à 375/768/1280/1920. |
| 3 | Abonné : envie de continuer | 8 | Cap, XP, série, « Étape 3 sur 3 », mission facultative sont là ; mais barres et chiffres sont discrets (20 px, gris), la série à « 1 » n'est pas célébrée. Fonctionnel plus qu'enthousiasmant. |
| 4 | Nouvel abonné jamais mort | 9 | Premier pas, cap 1/5, étape conseillée, « Tes 4 premières semaines », contenu du jour : jamais vide, à 375 comme à 1920. |
| 5 | Accessibilité visible, cohérence | 9 | Libellés textuels (pas d'icône seule), verrous accompagnés du mot « Premium » au hero, extrait inerte (`aria-hidden`, `inert`), même gabarit partout. |

## 5. Défauts précis et corrections codables (aucune ne doit ajouter de taille)

1. Bande entre hero et extrait (1280/1920, 75 + 40 px) : réduire `lg:mt-16` à `lg:mt-12` dans `extrait-coupe.tsx` l. 38 ; le décalage de 16 px remonte le bouton de fin de 16 px, à revérifier sous le pli (le code l. 24 à 27 prévient que le bouton de fin ne doit pas apparaître au premier écran de 900 px). Ferait 10 : légende et tuiles formant un bloc, 48 px d'air au-dessus.
2. Extrait peu parlant : contenu, pas taille. Piste : montrer dans la tuile Étape conseillée le nom de la première étape déjà là (« Tes premières répliques ») en `TEXTE` 16 plutôt qu'en `META`, ou ajouter la ligne « 5 min » de l'étape (`tableau-verrouille.tsx`) : texte existant, aucune taille neuve.
3. Z1 du nouvel abonné creuse en bas à 1280/1920 (fin de carte, permis) : si on veut la remplir, ajouter un contenu (par exemple la durée sur la même ligne que le bouton), jamais un titre plus grand.
4. Contenu du jour à 1280 : repasser en 3 x `col-span-4` comme la spec UX (vanne, conseil, vidéo de même hauteur) pour retrouver la symétrie avec la rangée 2 (`page.tsx` de l'espace, non lu ici).

## 6. Fautes dures

Aucune faute dure relevée : gate typographique PASS (4 tailles, 6 combinaisons, partout), un seul aplat violet par écran, aucun vide au milieu d'un bloc, aucune cible sous 44 px lue, aucun contraste sous AA. Rien n'est refusé ; la barre de 9/10 n'est pas atteinte à cause de l'élégance « à plat » (8), de la largeur (8, bande hero/extrait) et de l'envie (8).

NOTE GLOBALE : 8/10

Fautes dures : aucune.
