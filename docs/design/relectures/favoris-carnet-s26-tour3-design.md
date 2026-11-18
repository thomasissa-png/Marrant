# Relecture DESIGN à l'aveugle, Favoris et Carnet, s26 tour 3

Captures lues : `docs/captures/s26/encarts-favoris-carnet-tour-3/{favoris,carnet}/` (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1920 ouverts, 1456 non ouvert) et `carnet-fenetres/` (en-cours 1280 : premier écran, milieu, bas ; 375 : premier écran, bas ; nouvel 1280 premier écran). Étalon : `etalon-accueil/visiteur-accueil-1280.png`. Code lu : `rail-carnet.tsx`, `carnet-ouvert.tsx`, `favoris-abonne.tsx`, `cartes-abonne.tsx`, `onglets-favoris.tsx`, `share-button.tsx`, `tailwind.config.ts`.

## Gate typographique (TAILLES.md, citée)
Favoris, premier écran, 4 comptes, 375 et 1280 :
- visiteur et gratuit : 4 tailles (24 ou 30, 20, 16, 14), 6 combinaisons. PASS.
- en-cours : 4 tailles (24 ou 30, 20, 16, 14), 6 combinaisons. PASS.
- nouvel : 3 tailles (24 ou 30, 16, 14), 5 combinaisons. PASS.

Carnet, premier écran :
- visiteur et gratuit : 4 tailles, 5 combinaisons à 375 et 6 à 1280. PASS.
- en-cours et nouvel : 3 tailles (24 ou 30, 16, 14), 4 combinaisons. PASS.

Toutes les tailles sont dans {14, 16, 20, 24, 30}, graisses 400 et 600 seulement. Un seul aplat violet par écran : le bouton d'offre pour le prospect, « Explorer les vannes » pour le nouvel abonné ; zéro aplat chez l'abonné Carnet. Le contour violet de l'objet Premium et la teinte de `CARTE_ACTION` sont admis par la spec.

## Favoris

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité accueil | 9 | Titre blanc, cartes neutres 12 px, retenue nette. L'offre en haut à droite est cohérente avec l'accueil. |
| 2 Hiérarchie | 9 | Visiteur : bouton d'offre y=179 à 1280, premier repère. Abonné : carte de tête teintée + rail. |
| 3 Largeur, 5 largeurs | 8 | Hero 8/4, extrait 5/7, rail 3 + liste 9 : la largeur est utilisée. Seule la tuile « Vidéo » fermée (1216 x 120 px à 1280, titre et deux barres grises) fait creux. |
| 4 Cohérence entre comptes | 9 | Même coque, mêmes cartes. Le nouvel garde le rail à zéro et l'état vide, jamais de page morte. |
| 5 Finition au pixel | 7 | Voir fautes dures F1 et F2. Cibles 44 px vérifiées au code : onglets `min-h-11`, `Retirer` `LIEN_NEUTRE`, `ShareButton` `h-11 w-11`. |

Défauts précis :
- **F2** : l'icône « Partager » déborde de 4 px à gauche du texte de la carte. Capture 768 : cercle x=45 à 77, étiquette « Vanne » x=49 ; 1920 : 683 contre 687. Cause : `cartes-abonne.tsx` l.57, `-ml-2.5` (-10 px) alors que le cercle visible de 32 px est centré dans une cible de 44 px (retrait de 6 px). Correction : `-ml-1.5`. Ce qui ferait 10 : cercle aligné sur le bord du texte.
- **F1** (Favoris) : `favoris-abonne.tsx` l.112, `lg:sticky lg:top-24` (96 px) sous un en-tête collant de 120 px (ligne de fond à y=120 sur toutes les captures). Le rail collé perd 24 px sous l'en-tête : bord haut masqué. Invisible à 3 favoris (page plus courte que l'écran), réel dès que la liste dépasse 900 px. Correction : `lg:top-36`.

Pistes (non chiffrables) :
1. Tuile « Vidéo » fermée de l'aperçu : lui donner du contenu réel (vignette en dégradé uni + titre) plutôt que deux barres, ou la réduire à la hauteur de ses barres (`TuileFermee`, dossier `apercu/`). Ne pas grossir de texte.
2. Icône Partager : `text-text-muted` (#9A9A9A, troisième gris, contraste 5,1:1 sur #2A2A2A donc AA) dans `share-button.tsx`, composant partagé du site. Un `variant` espace en `text-text-secondary` ferait un jeu de deux gris.
3. Cartes de hauteurs inégales à 768 et 1280 (fond à 970 contre 890) : choix assumé `items-start`, pas une faute ; un `items-stretch` avec `mt-auto` sur les actions (déjà en place) alignerait les bas sans recréer de vide interne.

## Carnet

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité accueil | 9 | Fiche à deux colonnes lisible, sous-titres 16/600, encarts « On te dit » et « Tu réponds » sobres. |
| 2 Hiérarchie | 9 | Visiteur : bouton d'offre en haut à droite, fiche offerte dominante, fin d'extrait en bas. Abonné : sommaire puis fiches, aucun accent concurrent. |
| 3 Largeur | 9 | Visiteur 8/4 : vide de fin de colonne sous « Au programme » permis. Abonné : sommaire 3 colonnes, rail 3 + fiche 9. À 375 la liste en une carte (3 lignes de 44 px mini) remplace 30 tuiles. |
| 4 Cohérence | 9 | Visiteur, gratuit : mêmes écrans ; en-cours et nouvel identiques (aucune donnée « lu », par choix documenté). |
| 5 Finition au pixel | 7 | Voir F1. Reste propre : « Retour au sommaire » sous chaque fiche, filet blanc de l'élément actif sans décalage de texte, numéros alignés dans le rail. |

Défaut précis, **F1** (Carnet) : à 1280 x 900, capture « milieu » : le rail est collé à `top-24` (96 px, `carnet-ouvert.tsx` l.193) alors que l'en-tête collant mesure 120 px. Résultat : le bord haut du rail est masqué, et la première ligne visible, « 2. Le voisin en bonnet », est coupée à y=118. Capture « bas de page » : même coupe, ligne « 17 » ou plus hors vue sous l'en-tête. Le rail défile en interne (`max-h-[calc(100vh-7rem)]`, bas à 884 px, correct), donc seul le haut est faux. Même classe sur la tuile « Au programme » du visiteur (`carnet-ouvert.tsx` l.106, `lg:top-24`). Correction : `lg:top-36` sur les deux emplacements, et `max-h-[calc(100vh-10rem)]` dans `rail-carnet.tsx` l.58 (144 + 756 = 900 moins marge). Ce qui ferait 10 : rail entièrement sous l'en-tête, première ligne visible entière.

Pistes :
1. Sommaire abonné à 1280 : tuiles de 130 px pour un numéro, un titre et un mot de contexte. Passer en `p-4` n'est pas souhaitable (rythme `p-6` du système) ; resserrer plutôt à 2 lignes (numéro et contexte sur la même ligne, `flex justify-between`) comme à 375.
2. Fiche visiteur à 1280 : 140 px vides en bas de colonne gauche de la fiche (fin de carte, permis) ; équilibrable en déplaçant « À toi de jouer » à gauche sous « Tu réponds » si la hauteur des colonnes l'exige.
3. Fin d'extrait visiteur centrée sous une fiche en 8 colonnes : exclu de la notation (carte de fin centrée).

## Cohérence avec l'accueil
Même fond, mêmes cartes à bord 1 px, même bouton violet plein, même objet Premium. L'espace ouvert est plus sobre que l'accueil (pas de filet violet de carte), conforme au retrait demandé le 18/11.

## Fautes dures (chiffrées)
1. Rail et tuile collants à `top-24` (96 px) sous l'en-tête de 120 px, 24 px masqués : `apps/web/src/components/espace/carnet/carnet-ouvert.tsx` (l.193, l.106), `apps/web/src/components/espace/carnet/rail-carnet.tsx` (l.58, `max-h`), `apps/web/src/components/espace/favoris/favoris-abonne.tsx` (l.112).
2. Icône Partager décalée de 4 px à gauche du bord de texte des cartes Favoris : `apps/web/src/components/espace/favoris/cartes-abonne.tsx` l.57, `-ml-2.5` à remplacer par `-ml-1.5`.

NOTE GLOBALE Favoris : 8/10
NOTE GLOBALE Carnet : 8/10

Fautes dures :
1. Sticky `top-24` sous l'en-tête de 120 px (24 px masqués) : carnet-ouvert.tsx l.193 et l.106, rail-carnet.tsx l.58, favoris-abonne.tsx l.112.
2. Icône Partager décalée de 4 px : cartes-abonne.tsx l.57 (`-ml-2.5`).
