# Relecture DESIGN à l'aveugle, « Bibliothèque », s26 tour 2

Grille Design du brief v7 (barre 9/10, globale = minimum). Captures : `docs/captures/s26/rubriques-tour-2/bibliotheque/` (4 comptes, 375 / 1280 / 1920 ouverts, 768 et 1456 par l'INDEX). Code lu : `apercu/apercu-bibliotheque.tsx`, `bloc-bibliotheque.tsx`, `bibliotheque/page.tsx`, `carte/styles.ts`. Échelle : `docs/design/typo-harmonie-espace-s25.md`.

## Gate typographique (TAILLES.md, citée)

- Visiteur et gratuit, 375 / 768 / 1280 / 1920 : **4 tailles** (24 ou 30, 20, 16, 14), **6 combinaisons** (24-30/600, 20/600, 16/400, 16/600, 14/600, 14/400). Seuil (4 / 6) atteint, pas dépassé : PASS.
- En-cours et nouvel : 4 tailles partout ; 5 combinaisons à 375 (16/600 sous le pli), **6** à 768, 1280, 1920 (le 16/600 de la « prochaine ligne » entre). PASS, à la limite haute.
- Graisses 400 et 600 seulement, aucune capitale dans `main`, familles Jakarta (titres) et Inter (reste) conformes à l'échelle. Aucun élément hors échelle observé. Le pied de page (PRODUIT, LÉGAL en capitales) est hors périmètre.
- Un seul aplat violet par écran : visiteur et gratuit, un bouton plein dans le hero (premier écran à 375, 1280, 1920) ; le second bouton « La suite est dans Premium » est sous le pli (y 1145 à 1280, 1773 à 375), donc jamais dans le même écran. Abonnés : aucun violet dans `main` (pastille de notification de l'en-tête hors périmètre). PASS.

## Constats par capture

**Aperçu (visiteur, gratuit), 1280 et 1920.** Hero 8 / 4 colonnes, carte d'offre en haut à droite alignée sur le haut du repère « Premium » (y 153), bouton plein, réassurance, « Connexion ». Rythme : 24 px entre tuiles (903 vers 927), 48 px entre grands blocs, 32 px titre vers contenu, conformes. Lecture « fermé » réussie : cadenas, barres grises, fondu, bouton en haut.
- Défaut 1 : **les deux rangées de l'extrait n'ont pas la même grille.** Rangée 1 en 7 / 5 (gouttière entre x 730 et 755 à 1280), rangée 2 en 6 / 6 (gouttière entre x 627 et 652). Décalage de **103 px** à 1280 (même écart à 1456 et 1920). Cause : `lg:col-span-7` / `lg:col-span-5` en rangée 1, `lg:col-span-6` ×2 en rangée 2 (`apercu-bibliotheque.tsx` l. 46, 55, 80, 85). Deux gouttières côte à côte en escalier : critère « ALIGNÉ » en défaut.
- Défaut 2 : **la tuile « Vannes, conseils, vidéos » est étirée à la hauteur de la construction** (434 px) pour 190 px de contenu : 240 px de vide en bas (y 670 vers 903). Vide en fin de carte, donc permis par la règle, mais c'est une tuile creuse à l'œil (55 % de sa surface), alors que le critère 3 demande « aucune tuile creuse ». Pas une faute dure.
- La ligne « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. » flotte entre hero et grille (59 px au-dessus, 26 px en dessous) : légère, mais elle lit comme une légende sans cadre. Piste mineure.
- À 1920 : même composition centrée 1216 px, marges de 352 px de part et d'autre, identique à 1280 : cohérent avec l'accueil, aucun débordement.
- À 375 : hero compact, bouton plein à y 319 dans le premier écran de 812, cible 48 px, quatre blocs fermés empilés (4 × 100 px de barres grises répétées) : long mais lisible ; une seule tuile sous le fondu, jamais un liseré sans titre. Cibles : bouton 48 px, « Connexion » en `LIEN` (min-h-11).
- Gratuit vs visiteur : seule la carte d'offre change (phrase d'objet à la place du lien « Connexion »), gabarit identique : cohérent. Espace entre les deux paragraphes de la carte gratuit : ~28 px, sous 32 px : OK.

**Abonné (en-cours, nouvel), 1280 et 1920.** Trois colonnes alignées en haut (y 221), gouttières de 24 px, cartes en `p-6`, rayon 12 px, bordure 1 px, aucun violet, aucune ombre. Lignes de liste de 56 px (cibles > 44 px), pastilles de thèmes `min-h-11`, liens « Vannes Conseils Vidéos » `min-h-11`, bouton « Entrer » 44 px. « Prochaine ligne » marquée par un filet blanc à gauche et le 16/600 : lisible sans couleur. Compteurs « 0/12 » alignés à droite du titre (non notés, connu).
- Défaut 3 : colonnes inégales. Colonne 2 finit à y 1362, colonnes 1 et 3 à y 1075 : **287 px** de vide en fin de colonne sous deux colonnes sur trois. Permis par la règle (fin de colonne), et le code le revendique (`lg:grid-rows-[auto_auto_1fr]`), mais le critère 3 voit un grand rectangle vide de part et d'autre. Pas une faute dure.
- À 375 : empilement 1 colonne (Vannes, Humour noir, Construction, Vocabulaire, Formules), 4291 px de haut : cohérent, aucun trou intermédiaire. Premier écran : titre, tuile Vannes, tuile Humour noir.
- Nouvel et en-cours : rendus identiques (compteurs à 0 chez les deux, connu) : cohérence parfaite entre ces deux comptes.

**Finition code.** `BOUTON_SECONDAIRE` (le bouton « Entrer ») porte encore `hover:border-text-muted` et `aria-disabled:text-text-muted`, alors que l'échelle supprime `text-text-muted` de l'espace. Visible seulement au survol, donc absent des captures et de la gate mesurée : piste, pas faute dure.

## Notes par critère (Design)

| # | Critère | Note | Justification et correction codable |
|---|---|---|---|
| 1 | Élégance et fidélité à l'accueil | 8 | Palette, rayons, filets, lecture fermée irréprochables ; l'escalier 7/5 puis 6/6 et la tuile Vannes creuse cassent la netteté. Corriger défauts 1 et 2 : 9 ; la ligne « Voici un exemple » mieux ancrée : 10. |
| 2 | Hiérarchie (une zone dominante, un seul accent) | 9 | Aperçu : carte d'offre + bouton plein dominent, un seul aplat par écran. Abonné : pas de zone dominante forte, mais c'est une page de listes et la « prochaine ligne » guide. Pour 10 : rien d'obligatoire. |
| 3 | Largeur aux 5 largeurs | 7 | Vide de 240 px dans la tuile Vannes (aperçu) et de 287 px sous deux colonnes (abonné), aux largeurs ≥ 1024 (identiques 1280 / 1456 / 1920). Pour 9 : voir pistes 2 et 3. |
| 4 | Cohérence entre comptes | 9 | Même cadre, mêmes gabarits, mêmes rythmes ; seule différence attendue (offre vs listes). |
| 5 | Finition au pixel | 8 | Rythme 24 / 48 conforme, cibles 44 px vérifiées au code, contrastes OK ; mais gouttières désalignées de 103 px (`apercu-bibliotheque.tsx`) et `text-text-muted` résiduel au survol (`carte/styles.ts` `BOUTON_SECONDAIRE`). |

## Pistes (non bloquantes)

1. Aligner la rangée 2 sur la rangée 1 : `lg:col-span-7` (Vocabulaire) et `lg:col-span-5` (Formules) dans `apercu-bibliotheque.tsx` l. 80 et 85, ou passer la rangée 1 en 6 / 6 ; les gouttières tombent alors sur la même ligne.
2. Aperçu : mettre dans la colonne de droite de la rangée 1 une pile (tuile Vannes puis tuile Vocabulaire fermée), et laisser « Formules à détourner » seule en rangée 2 sous le fondu ; la tuile Vannes cesse d'être étirée (`lg:self-start`) et la hauteur des deux colonnes se rejoint sans grossir un texte. Aucun contenu nouveau, mêmes composants (`TuileFermee`, `TitreFerme`).
3. Abonné : rééquilibrer les colonnes à ≥ 1024 dans `bibliotheque/page.tsx` (`COLONNE_LG`) : par exemple Humour noir sous « Comment c'est construit » en colonne 1, Vannes + Vocabulaire en colonne 2, Formules en colonne 3 : hauteurs d'environ 1080 / 920 / 855 au lieu de 855 / 1143 / 855, vide maximal ~225 px au lieu de 287 px (ordre DOM mobile inchangé si le placement reste explicite par `lg:`).

## Faute dure

Une seule, chiffrée : gouttières des deux rangées de l'aperçu décalées de 103 px (7/5 puis 6/6), alignement non tenu à 1280, 1456 et 1920.

Barre 9/10 non atteinte (3 = 7, 1 et 5 = 8) ; gate typographique et violet sans faute.

NOTE GLOBALE : 7/10

Fautes dures :
1. Rangées de l'extrait en grilles différentes (7/5 puis 6/6), gouttières décalées de 103 px dès 1024 : `apercu-bibliotheque.tsx` (`lg:col-span-7` / `lg:col-span-5` l. 46 et 55 contre `lg:col-span-6` l. 80 et 85).
