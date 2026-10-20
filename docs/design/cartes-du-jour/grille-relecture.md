# Grille de relecture à l'aveugle : section « Ton contenu du jour » (accueil)

Le relecteur ne voit que les captures du dossier indiqué (et leur `index.md`). Il ne lit ni spec ni historique.
Note chaque critère sur 10 ; toute note sous 10 cite la capture exacte (nom de fichier), décrit le défaut et propose la correction précise (taille, espacement, alignement, couleur, ordre).
**Barre de sortie : note globale 10/10 chez les trois relecteurs, aucun critère sous 9.**

## Relecteurs (constants d'un tour à l'autre)
1. **Le designer exigeant** : UI senior, regarde alignements, rythme vertical, hiérarchie typographique, cohérence des composants entre les 3 cartes, finitions (bordures, contrastes, rayons, icônes).
2. **Le visiteur pressé sur mobile** : découvre le site, téléphone à la main. Comprend-il en 3 secondes ce qu'il y a et quoi faire ? Le bouton « Révéler la chute » est-il évident, et ce qui se passe au clic clair ?
3. **L'UX cohérence** : parcours avant / après clic / décryptage, comportement aux 6 largeurs (320 à 1440), accessibilité visible (focus, contrastes, taille des cibles), rien de cassé ou d'incohérent d'une largeur à l'autre.

## Critères (sur 10)
1. **Clarté** : on comprend tout de suite les 3 contenus et l'action attendue sur chacun.
2. **« Révéler la chute »** : visiblement la suite de la vanne ; après clic, la chute est lisible, à sa place, sans saut déroutant.
3. **Hiérarchie** : titres, textes, pastilles, accordéons, pied de carte ; chaque niveau se distingue sans bruit.
4. **Cohérence** : en-têtes, accordéons, pieds de carte identiques d'une carte à l'autre.
5. **Espacements et alignements** : pas de vide inexpliqué, rythme régulier, alignements nets, équilibre de la rangée sur PC.
6. **Mobile et tablette** : 320, 375, 768, 1024 propres, rien de coupé, cibles confortables.
7. **Finition** : bordures visibles, contrastes suffisants, aucun détail « pas pro ».

## Principe retenu à partir du tour 3 (arbitrage, à ne pas rouvrir)
Les cartes ne sont plus étirées à la même hauteur : chacune a sa hauteur naturelle, et ouvrir un contenu n'agrandit que sa carte. Les bas de cartes peuvent donc différer sur PC. Ce qui est jugé : l'absence de vide intérieur (rien de plus de 24 px de vide inexpliqué dans une carte), l'équilibre global de la rangée, et le fait que les voisines ne bougent pas quand on ouvre quelque chose. « Révéler la chute » reste collé à la vanne (demande du fondateur).

## Principe retenu à partir du tour 4 (remplace celui du tour 3, choix du fondateur)
Thomas a jugé la v3 « sans harmonie ». Composition retenue dès 1024 px : la Vanne en bandeau pleine largeur en haut, puis Conseil et Vidéo côte à côte, de même hauteur, pieds alignés. Sous 1024 px : pile Vanne, Conseil, Vidéo. Ce qui est jugé : l'harmonie de l'ensemble, l'absence de vide intérieur (> 24 px), « Révéler la chute » collé à la vanne.
