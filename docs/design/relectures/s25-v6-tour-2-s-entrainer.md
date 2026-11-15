# Relecture DESIGN à l'aveugle, tour 2, groupe s-entrainer (s25, navigation v6)

Périmètre lu : `v6-tour-2/s-entrainer/` (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1456, 1920 : lus en entier 375, 768 et 1280 pour en-cours, 375/1280 visiteur et nouvel, 1920 gratuit et visiteur ; le plafond `max-w-7xl` rend 1280/1456/1920 identiques en structure) + `v6-tour-2/fiches/` jeu, seance, bilan (en-cours et nouvel, lus à 375 et 1280 ; chaque fiche en-cours/nouvel est identique à l'autre sauf la pastille de la cloche). Étalon : accueil visiteur 1280.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| 1 Fidélité langue de l'accueil | 9 | Filet violet en haut des cartes, coins arrondis, pastilles « Nouvelle / À revoir », fond sombre : conforme. Cartes plus ternes que l'accueil (aucun accent violet de titre), acceptable pour une page de travail. |
| 2 Hiérarchie, lisibilité | 8 | 3 défauts, dont 1 faute dure (mesure de ligne). |
| 3 Mise en page 5 largeurs | 7 | 1 faute dure (aperçu : colonne droite vide à 1280+). |
| 4 Cohérence avec l'espace | 9 | Gabarit B (liste) et A (fiche étroite centrée) cohérents avec le reste ; « Retour : S'entraîner » conforme au §4 de la nav v6. |
| 5 Finition au pixel | 8 | 1 faute dure (cibles des boutons Oui / À moitié / Rien sous 44 px à 375). |

**Globale (minimum) : 7/10. Barre de 9 non atteinte.**

## Fautes dures

1. **Aperçu Premium, colonne droite vide à 1280+** (`visiteur-s-entrainer-1280.png`, `gratuit-s-entrainer-1920.png`). Le bloc offre est une carte de 92 px (bouton seul, ou bouton + Connexion) à côté d'une carte de 425 px : environ 330 px de vide sous elle, et la carte d'offre ressemble à un fragment. Correction : passer à une seule colonne centrée `max-w-3xl` avec le bloc offre sous la fiche (comme déjà fait à 375, qui est propre), ou rendre la colonne offre `lg:sticky lg:top-[130px]` avec `self-start` ; mieux : offre en bandeau pleine largeur `col-span-2` sous la fiche, centré, titres comme l'accueil. Fichier : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`. Ce qui ferait 10 : aucun vide, un seul bouton plein dominant, carte d'offre au même filet et même padding que la fiche.
2. **Mesure de ligne excessive dans les cartes pleine largeur** (`nouvel-s-entrainer-1280.png`, `en-cours-s-entrainer-1280.png` carte « Marche 2 »). Paragraphes de 1150 px, soit environ 150 caractères par ligne : lecture pénible et saut de ligne difficile. Correction : limiter les paragraphes et consignes à `max-w-prose` (ou `max-w-[68ch]`), ou passer toute carte à `lg:max-w-3xl`, ou 2 colonnes quand il n'y a qu'une carte « situation » (scène à gauche, réponse d'abord + Oui/À moitié/Rien à droite). Fichier : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx` (+ `components/espace/fiche/reponse-dabord.tsx`, `corps-situation.tsx`). Ce qui ferait 10 : 60 à 75 caractères par ligne à toute largeur.
3. **Cibles Oui / À moitié / Rien sous 44 px à 375** (`en-cours-s-entrainer-375.png`, `en-cours-fiche-bilan-375.png`) : environ 37 px de haut mesurés sur capture, contre 44 px à 1280 et aux pastilles « Pas essayé… » (qui, elles, font environ 46 px). Corriger : `min-h-11` sur ces trois boutons à toutes les largeurs. Fichier : `apps/web/src/components/espace/fiche/reponse-dabord.tsx`. À mesurer au DOM par @qa pour confirmer.

## Pistes (ne retiennent pas la note)

- **Contraste probable de « Oui / À moitié / Rien » et « Prends ton temps »** : texte gris moyen sur carte gris foncé, bordure presque invisible ; les boutons ressemblent à des boutons désactivés. Mesurer ; si < 4.5:1, passer à `text-text-primary` et `border-border-strong`. Même fichier que 3.
- **Hauteurs inégales des deux cartes côte à côte** (`en-cours-s-entrainer-1280.png`) : carte 1 finit à 868, carte 2 à 992 : trou de 124 px sous la première. Piste : `items-stretch` avec pied de carte repoussé, ou cartes en pile d'une colonne.
- **Incohérence entre comptes** : la carte de situation de `en-cours` affiche le bouton « 10 secondes pour répondre », celle de `nouvel` (Soirée) ne l'affiche pas, alors que les deux ont « Prends ton temps ». Si voulu (minuteur seulement après une 1re réponse), le dire ; sinon aligner dans `reponse-dabord.tsx`.
- **Fiche séance** (`en-cours-fiche-seance-1280.png`) : l'observation des dix phrases est un seul paragraphe (« 1. … 2. … 10. ») : illisible comme liste. C'est un format, pas un texte : en `<ol>` avec `space-y-1`, sans changer un mot. Tous les intertitres de la séance sont de la même taille que le corps (16 px gras) : ajouter une durée en pastille ou `text-text-secondary` pour la durée, `mt-6` entre blocs, afin de voir la structure en plissant les yeux. Fichier : `components/espace/fiche/corps-divers.tsx` (à confirmer).
- **Textes secondaires de 11 à 13 px** (« Si tu as 5 minutes », explication sous la réponse C de l'aperçu) : à passer à 14 px, `text-text-secondary` vérifié AA.
- **Aperçu, réponse dépliée par défaut** : bonne idée (valeur visible), mais le « C. » seul sur sa ligne puis le gris 13 px est maigre ; mettre « C. » en gras 16 px, explication en 14 px.
- **Fiche en colonne étroite centrée sous une bande pleine largeur** (jeu, séance, bilan 1280) : titre à x=256 alors que le logo et la bande sont à x=32 : conforme au gabarit A, cohérent entre les fiches, donc pas une faute ; à garder identique partout.
- **Bilan : chip Parcours allumé, « Retour : Répartie »** conforme à la spec v6 §4.

## Ce qui est bon

Bande et chip actif corrects à toutes les largeurs (375 : S'entraîner visible, défilement), aucun débordement horizontal, mise en page 375 de l'aperçu propre, filet violet cohérent, pied de page identique, aucun tiret cadratin visible, séance et bilan lisibles à 375.

NOTE GLOBALE : 7/10
