# Relecture DESIGN à l'aveugle, « Quoi répondre », tour 1 (s26)

Captures lues : visiteur 375, 1280, 1920 ; gratuit 1280 ; en-cours 1280, 1920 ; nouvel 375 (pleine page, réduites : mesures en px d'origine, approchées à ±3 px). Code lu : `apercu/tuile-fermee.tsx`, `apercu/extrait-coupe.tsx`.

## Gate typographique mesurée (TAILLES.md, premier écran de main)
- Visiteur et gratuit : 4 tailles (24 à 375/768, 30 à 1280/1920, puis 20, 16, 14), 6 combinaisons (30 ou 24/600, 20/600, 16/400, 16/600, 14/400, 14/600). Limites 4 et 6 : PASS, à la limite.
- En-cours et nouvel : 4 tailles, 5 combinaisons. PASS.
- Aucune taille hors échelle (14/16/20/24/30), graisses 400 et 600 seules, Jakarta seulement sur le H1 et les titres 20 px. Gate OK sur les 20 mesures.

## Critères Design

### 1. Élégance et fidélité à l'accueil : 9/10
Cartes `rounded-xl`, bord 1 px, zéro ombre, deux gris de texte, un bouton plein : même langue que l'accueil. L'aperçu se lit FERMÉ (repère Premium unique, offre en haut à droite, contenu atténué, verrous, fondu absent mais cadres éteints, bouton d'offre de fin). Côté abonné, la page est sobre et régulière. Défaut : la tuile « Rattraper un faux pas » (faute dure 1) est la seule zone qui paraît bâclée. Pour 10 : corriger 1 et 2.

### 2. Hiérarchie : 9/10
Aperçu 1280/1920 : zone dominante = hero + carte d'offre (bouton plein à y 178-226), puis grande carte « Coloc : la poêle » 7/12 face au rail 5/12. Un seul aplat au premier écran (le second, « La suite est dans Premium », est à y 1163, sous le pli de 900). Le dégradé du H1 est décidé, non noté. Abonné : tuile d'action teintée en haut (« Voir » seul plein), puis tuiles de lieux homogènes : l'œil va au bouton. Pour 10 : rien de chiffrable, voir pistes.

### 3. Usage de la largeur aux 5 largeurs : 9/10
1280 et 1920 : contenu plafonné à 1216 px (marges 32 puis 352 px, comme l'en-tête), grille 7/5 puis 3 tuiles égales (aperçu) ; rail 3 col + liste 9 col en 2 colonnes (abonné). 375 : empilé proprement, pas de débordement visible. Vides : bas de la grande carte « Coloc » (environ 105 px, de 765 à 870 à 1280, fin de carte : permis) ; bas de la carte d'offre visiteur (56 px, fin de carte : permis) ; droite de la tuile d'action abonné (fin de carte : permis). Aucun vide > 32 px au milieu d'un bloc relevé. Je n'ai pas ouvert 768 ni 1456 : non noté.

### 4. Cohérence entre comptes : 9/10
Visiteur, gratuit : mêmes tuiles, mêmes positions (seul le texte de l'offre diffère, voulu). En-cours et nouvel : même grille, mêmes barres (rail visible à 0/n), seule la coche « Fait » de « La poêle » distingue. Le passage aperçu vers abonné garde l'ordre (titre, rail de filtres, lieux). Écart mineur : pastilles de filtre pleines grises en aperçu, contour en abonné (piste 2).

### 5. Finition au pixel : 8/10
- Contrastes : texte secondaire #B3B3B3 sur carte, atténuation 75 % conservée au-dessus de 4,5:1 selon `tuile-fermee.tsx` (non remesuré).
- Cibles : pastilles `min-h-11`, pied de tuile `min-h-12` (spec), « Voir » `h-12`.
- Défauts chiffrés : fautes dures 1 et 2.

## Fautes dures
1. **Tuile « Rattraper un faux pas » (aperçu, tous widths, visiteur et gratuit) : la 2e barre grise de l'extrait touche le filet du pied de tuile.** À 1280 : barre à y 988-995, filet à y 996, soit 0 à 1 px d'air, quand les deux autres tuiles (sans pied) gardent 50 px de vide sous leurs barres. Même collision à 375 (tuile unique, barre y~1209, filet y~1221 sur capture réduite, soit < 8 px). Fichier : composant de la tuile dans `apps/web/src/components/espace/apercu/` (le pied utilise `PIED_TUILE` de `aujourdhui/tableau.tsx`) ; correction : `mt-4` entre le bloc de barres et le pied, ou `pb-6` effectif avant le filet (le pied est `-mx-6 -mb-6`, la tuile a `h-full`, il faut que le contenu garde `mb-6` avant lui). Pour 10 : 24 px d'air avant le filet, comme les autres tuiles.
2. **« La suite est dans Premium » trop collée à la dernière tuile à 375** : environ 22 px entre le bas de la tuile et la phrase (capture réduite ×1,6), contre 55 px à 1280 et 1920 ; la spec s25 §2.4 impose `mt-12` (48 px) entre grands blocs. Cause : `-mt-12` de base dans `apps/web/src/components/espace/apercu/extrait-coupe.tsx` (bloc `data-apercu-fin`), pensé pour recouvrir une zone transparente de `SuiteCoupee` qui n'existe pas sur cette page (`lg:-mt-4` ne s'applique qu'à partir de 1024). Correction : `mt-6 lg:-mt-4` pour cette page, ou retirer le recouvrement quand l'extrait n'est pas coupé. À vérifier au rendu 768 (non ouvert).

## Pistes (non fautes)
1. Tuile d'action abonné à 1280/1920 : la moitié droite (environ 560 px) est vide ; envisager de mettre le bouton « Voir » à droite de la ligne titre+durée (`lg:flex lg:items-center lg:justify-between`, vide de fin de carte sinon) ou accepter. Ne pas grossir le titre.
2. Pastilles de filtre : unifier l'aspect aperçu (fond `bg-background-elevated`) et abonné (contour `border-border-input`) ; la pastille « Commerces, voisins, transports » passe sur 2 lignes dans une forme `rounded-full` (ovale) dans le rail : prévoir `rounded-xl` quand elle déborde, ou `whitespace-normal` avec rayon 12 px.
3. À 375 (nouvel, en-cours), le lien « Le carnet du mois » flotte seul entre le sommaire « Filtrer les cartes » et la première tuile de lieu : l'intégrer sous le sommaire replié (`mt-2`) ou dans le `<details>`. Le compteur « 1/4 » est à plus de 700 px du titre « Coloc » à 1280 (justify-between spécifié) : la barre dessous fait le lien, tolérable.

NOTE GLOBALE : 8/10

Fautes dures :
1. Tuile « Rattraper un faux pas » de l'aperçu : barre collée au filet du pied (0-1 px) : composant de tuile dans `components/espace/apercu/` + `PIED_TUILE` (`aujourdhui/tableau.tsx`).
2. Fin d'extrait à 22 px de la dernière tuile à 375 : `components/espace/apercu/extrait-coupe.tsx`, classe `-mt-12` du bloc `data-apercu-fin`.
