# Relecture DESIGN à l'aveugle, v6 tour 2 : Mes questions + Mes répliques

Captures lues : `docs/captures/s25/v6-tour-2/{questions,repliques}/` (visiteur, gratuit, en-cours, nouvel). Lues en entier : 1280 et 375 des 4 comptes (questions et répliques), 768 (en-cours questions, gratuit questions, nouvel répliques), 1456 (gratuit répliques), 1920 (en-cours questions et répliques). Le reste de la matrice (768/1456/1920 des autres comptes) est de même gabarit que les captures lues. Étalon : accueil 1280.

## Constat par état

- Visiteur / gratuit (aperçu Premium) : H1, sous-titre validé, carte d'exemple (filet violet), carte d'offre. 1280 et 1456 : 2 colonnes ; 375 et 768 : empilé. Propre, aéré, même langue que l'accueil.
- En-cours questions : formulaire à gauche (cartes radio 95 px, bouton 44 px), « Mes envois » à droite. Largeur coque identique au header (logo à x=32 à 1280, x=352 à 1920).
- Nouvel : questions avec exemples « Par exemple, pour... » (jamais une page morte) ; répliques avec phrase + bouton « Écrire ma première réplique ».
- En-cours répliques : une carte, lien de titre, citation, Modifier / Supprimer (44 px).

## Note par critère (Design)

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Fidélité à l'accueil | 8 | Filet violet, `rounded-xl`, fond sombre, titres Plus Jakarta : conforme. Manque : H1 aligné à gauche, pas centré comme les titres de section de l'accueil (assumé espace). Carte d'offre = bouton seul, sans pastille ni phrase : plus pauvre que la carte offre de l'accueil. |
| 2 | Hiérarchie, lisibilité | 9 | H1 > carte > action primaire unique violet plein partout. Texte secondaire 12 px (« Évite les noms », « Envoyé le 12 novembre ») correct mais petit. |
| 3 | Mise en page 5 largeurs | 6 | Faute dure : Mes répliques (abonné et nouvel) est une colonne étroite centrée (x=256 à 1024 à 1280 ; x=576 à 1344 à 1920) alors que le H1 se retrouve décalé de 224 px à 1280 et 224 px à 1920 par rapport au logo et à la bande (x=32 / x=352). Le H1 flotte, ni aligné au header ni à la page sœur. Piste : à 1280+ la colonne droite de Mes questions (« Mes envois ») reste vide sous la carte (y 465 à 970, 1280 et 1920) ; et la carte d'offre du visiteur laisse le vide sous elle (y 355 à 545). |
| 4 | Cohérence avec l'espace | 6 | Même faute : Mes répliques (étroit centré) vs Mes questions (pleine coque) vs aperçu visiteur de Mes répliques (pleine coque) : la page change de gabarit selon le compte. Incohérence aussi « Mes envois » : H2 posé hors carte à droite (abonné/nouvel, y=247, désaligné du H2 « Écrire à l'équipe » y=272 dans la carte gauche) mais DANS une carte chez le visiteur, avec une carte imbriquée (double filet violet, y 262 et 331). |
| 5 | Finition au pixel | 8 | Cibles 44 px OK (boutons, radios, Modifier/Supprimer), contrastes lisibles. Défauts : haut des deux colonnes de Mes questions non aligné (carte gauche y=233, carte droite y=273 car le H2 est hors carte) ; double filet imbriqué chez le visiteur ; « Connexion » à côté du bouton d'offre sans alignement baseline sur le titre. |

Globale Design = minimum = 6.

## Fautes dures

1. Mes répliques abonné/nouvel : conteneur étroit centré qui décale le H1 du bord du header, gabarit différent de Mes questions et de l'aperçu visiteur. Correction codable : aligner sur la coque `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8` du header ; garder la carte à `max-w-3xl` mais à gauche (`mr-auto`) ou passer en grille `lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`. Fichier : `apps/web/src/app/(dashboard)/mon-espace/repliques/page.tsx` (et le gabarit parent si le `max-w-3xl` vient du layout).
2. Mes questions abonné/nouvel : « Mes envois » est un titre hors carte qui désaligne les deux colonnes (233 vs 273) et contredit l'aperçu visiteur (titre dans la carte). Correction : mettre le H2 dans la carte (comme « Écrire à l'équipe »), les deux cartes à `items-start` avec même `pt`, et dans l'aperçu supprimer la carte imbriquée (retirer le second filet : un seul `rounded-xl` + filet). Fichier : `apps/web/src/app/(dashboard)/mon-espace/questions/page.tsx` (et le composant d'aperçu correspondant).

## Pistes (ne retiennent pas la note)

- Carte d'offre de l'aperçu : bouton seul dans une grande carte (1456 : bouton à gauche, 2/3 vide). Réduire à `items-start`, ou fusionner offre et aperçu en une colonne sticky `lg:sticky lg:top-32`. Proposer une phrase de valeur serait un texte nouveau : à valider par Thomas.
- Colonne « Mes envois » vide sous la carte à 1280+ : `lg:sticky lg:top-32` sur le formulaire ou inverser les largeurs.
- Aperçu Mes répliques : le champ « Ma réplique à moi » a l'aspect d'un champ actif pour un non-abonné ; le marquer visuellement inerte (`opacity` à éviter pour AA : préférer `aria-disabled` + bordure pointillée) ou le retirer.
- Bouton « Supprimer » identique à « Modifier » : variante destructrice discrète (`border-danger text-danger`).
- 375 : le bouton « … » recouvre la rubrique « Quoi répondre » sans fondu (bande, hors périmètre).

## Ce qui ferait 10

Les deux fautes corrigées, mêmes colonnes et mêmes titres entre les 4 comptes, carte d'offre avec contenu, aucun vide sous les colonnes à 1280+.

NOTE GLOBALE : 6/10
