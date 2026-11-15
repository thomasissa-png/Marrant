# Relecture Design à l'aveugle, v6 tour 2, groupe favoris-profil

Captures lues : `v6-tour-2/favoris/` (visiteur, gratuit, en-cours, nouvel) et `v6-tour-2/profil/` (gratuit, en-cours, nouvel), largeurs 375, 768, 1280, 1920 relues une à une, 1456 jugée par interpolation entre 1280 et 1920 (même gabarit). Étalon : accueil 1280.

## Notes

| Critère | Note |
|---|---|
| 1 Fidélité à la langue de l'accueil | 9 |
| 2 Hiérarchie et lisibilité | 8 |
| 3 Mise en page aux 5 largeurs | 7 |
| 4 Cohérence avec l'espace | 8 |
| 5 Finition au pixel | 7 |

**Globale = 7/10. Barre de 9 non atteinte, fautes dures ci-dessous.**

## Ce qui est bon
- Filet dégradé violet, `rounded-xl`, pastilles, titres blancs sur fond sombre : la langue de l'accueil est tenue sur Favoris abonné et sur tout le Profil.
- Favoris abonné 1280 et 1920 : 3 colonnes, contenu centré dans le conteneur, pas de vide à droite. 768 en 2 colonnes, 375 en pile : propre.
- État vide nouvel abonné (`nouvel-favoris-*`) : étoile, phrase, bouton unique « Explorer les vannes », filet présent. Pas une page morte.
- Profil : rythme vertical régulier (≈ 24 px entre cartes), 1 colonne lisible à toutes les largeurs, bloc ambre de suppression bien contrasté, bouton unique violet par carte.

## Fautes dures

1. **Aperçu Favoris (visiteur, gratuit) : cartes étirées, vide massif.** `visiteur-favoris-1280.png` et `gratuit-favoris-1280.png` : la carte Vanne (3 lignes de texte) fait ≈ 1170 px de haut, soit ≈ 80 % de vide, parce que la grille étire les cartes à la hauteur de la carte Conseil (texte long + exemple). Même défaut à 768 (`visiteur-favoris-768.png`, colonne gauche vide sur ≈ 850 px). Ce n'est ni de l'aéré ni de l'accueil : c'est un trou. Correction : grille d'aperçu avec `items-start` (au lieu de `items-stretch`), ou réduire l'aperçu à une seule carte Conseil tronquée (`line-clamp`) plus la carte Vanne. Fichier : composant d'aperçu Premium de la page `/favoris` (grille `grid ... items-start`).
2. **Aperçu Favoris : la carte d'offre est une carte vide avec deux boutons, sans phrase.** `visiteur-favoris-1280.png` : 3e colonne = bandeau de 90 px à droite, avec « Premium · 1,99 €/mois » + « Connexion », aucun texte, le reste de la colonne vide. À 1280 l'action principale est reléguée en haut à droite d'une colonne creuse et l'œil ne la voit pas comme conclusion de l'aperçu. À 375 (`gratuit-favoris-375.png`) elle est en bas, sous le scroll. Correction : sortir la carte offre de la grille, la placer pleine largeur sous les 2 cartes (comme à 768, qui est correct) pour tous les breakpoints ≥ 1024 (`col-span-full` / `lg:col-span-3`). Aucun texte nouveau requis. Même fichier que le point 1.
3. **Cibles tactiles sous 44 px sur Favoris abonné.** `en-cours-favoris-375.png` et `-768.png` : onglets Tout / Vannes / Conseils / Vidéos ≈ 32 px de haut (pastille « Tout » mesurée à l'écran), bouton partage rond ≈ 32 px, « Retirer » en texte nu sans zone de 44 px visible. Correction : `min-h-[44px]` sur les onglets (padding vertical `py-2.5`), partage `h-11 w-11` (ou zone cliquable étendue par `before:absolute before:-inset-2`), « Retirer » `min-h-[44px] px-3`. Fichier : composant liste de favoris (onglets + carte favori).
4. **Carte sans titre, sans filet, au vide interne, dans le Profil (abonnés).** `en-cours-profil-1280.png` (aussi `nouvel-profil-*`, `en-cours-profil-375.png`) : la carte « Ta question à l'équipe : écris-la dans Mes questions. » n'a ni filet violet, ni titre, et ≈ 35 px de vide au-dessus et en dessous d'une seule ligne. Toutes les autres cartes de la page ont filet et titre : c'est la seule incohérence visible de la page. Correction : ajouter le filet (même classe de carte que les autres), réduire à `py-4` en ligne simple, ou en faire un pied de carte « Abonnement ». Pas de texte à réécrire. Fichier : section profil abonné (bloc « question à l'équipe »).

## Pistes (ne retiennent pas la note)
- Petits textes à 11 px gris : « Ouvre pour l'exemple et le défi » (`en-cours-favoris-1280.png`), paragraphe lettre de la semaine, lien « Renoncer au contrat ici » (`en-cours-profil-1280.png`). Contraste probablement proche de 4,5:1, à mesurer ; passer à `text-xs text-gray-300`.
- Cartes de favoris étirées à la hauteur de la plus grande (`en-cours-favoris-1280.png`) : ≈ 150 px de vide sous les vannes. Acceptable, `items-start` serait plus net si le fondateur préfère.
- Titre « Favoris » (aperçu) vs « Mes favoris » (abonné), sous-titres de tailles/ton différents : acceptable pour un aperçu, à confirmer.
- Ordre des cartes Profil différent selon le compte (Prochaine étape en 1er pour gratuit, 4e pour nouvel abonné) : logique, mais surveiller que la page ne change pas de forme perçue.
- Onglet « Vidéos » sans compteur alors que les autres en ont (zéro masqué) : cohérent mais peut sembler oublié.
- Carte Abonnement sans bouton chez les comptes de test : connu, hors correction.

## Ce qui ferait 10
Aperçu en `items-start` avec carte d'offre pleine largeur, cibles 44 px sur Favoris, carte « question » alignée sur le gabarit, petits textes remontés à `text-xs` clair.

NOTE GLOBALE : 7/10
