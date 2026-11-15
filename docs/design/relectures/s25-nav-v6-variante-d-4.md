# Relecture DESIGN à l'aveugle : nav v6, variante d (relecture 4)

Périmètre : 32 captures `docs/espace-client/etalons/nav-v6/variantes/d-*.png` (3 profils x pages vannes / aujourdhui / apercu x 375, 768, 1280, 1920, plus `-accueil` et `-menu-ouvert`), toutes ouvertes. Comparées à la référence de Thomas (`reference/menu-categories-reference-15-11.png`) et aux étalons accueil s25 (1280 et 375). Hors périmètre : rangée de filtres de /vannes, contenu sous la bande. Aucune autre relecture lue, aucun commentaire de maquette lu.

## Ce qui est vu, sans interprétation

- Bande unique, un seul niveau, fond gris très sombre à coins arrondis, alignée au pixel sur le logo et le contenu (bord gauche) aux 4 largeurs. Contenu cadré à 1280 sur le 1920 : la bande suit.
- Rubrique active : pastille légèrement éclaircie plus soulignement violet court. Séparateurs verticaux fins entre les 3 groupes (Aujourd'hui→S'entraîner | Vannes→La lettre | Favoris, Carnet). « … » à droite à toutes les largeurs.
- Visiteur et gratuit : cadenas sur les 5 rubriques Premium (Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner). Abonné : aucun cadenas.
- Recherche mesurée : 175 à 176 px CSS à 768, 1280 et 1920 (visiteur, gratuit, abonné). À 375 elle est absente du header, comme sur l'étalon accueil 375 (logo, Premium, burger).
- Panneau « … » : Mes questions, Mes répliques (cadenas pour visiteur et gratuit, aucun pour abonné), liseré violet en haut, ombre, ancré à droite environ 9 à 10 px sous le filet aux 4 largeurs, rendu identique.
- À 375 et 768 la bande défile : fondu à droite visible ("Conseils", "Quoi répondr", "Vann" s'éteignent proprement), aucun libellé tranché net.

## Notes

| Critère | Note |
|---|---|
| 1 Élégance et finition | 9/10 |
| 2 Fidélité langue du site et référence | 10/10 |
| 3 Lisibilité et hiérarchie | 9/10 |
| 4 Tenue aux 4 largeurs | 8/10 |
| 5 Respect des décisions | 10/10 |

### 1. Élégance et finition : 9/10

Le « PowerPoint » est levé : plus de boutons-cartes, une seule bande, un état actif sobre, des espaces réguliers (environ 24 px entre libellés, séparateurs discrets). Reste une faute légère :

- **Faute légère (alignement vertical droit).** Le centre de l'icône compte (gratuit/abonné) est 3 à 4 px CSS à droite du centre de « … » : mesuré 1915 vs 1909 sur le 1280 (échelle 1,5625), 1444 vs 1436 sur le 768 (échelle 2), 1609 vs 1605 sur le 1920. Les deux sont empilés à la verticale, le désaxement se voit. De plus, chez le visiteur le bouton Premium affleure le bord droit de la bande, alors que l'icône compte s'arrête environ 15 px avant. Retouche codable : fixer la zone cliquable de l'icône compte à 44x44 et la zone de « … » à 44x44, avec le même `padding-right` de bande (et pas de `margin` différent), ou décaler l'icône compte de `margin-right: -4px` pour que les deux centres coïncident. Fichier : composant header (conteneur des actions) et composant bande de rubriques (bouton « … »).
- **Piste (non retenue).** Le panneau « … » a son bord droit 4 à 5 px à l'intérieur du bord droit de la bande (aux 4 largeurs, donc régulier). L'aligner sur le bord de la bande (`right: 0`) serait un peu plus net, sans que l'existant soit fautif.

### 2. Fidélité : 10/10

Transposition réussie de la référence dans le vocabulaire du site : même principe (une bande, groupes séparés par un filet vertical, pastille d'état actif, « … » en bout), mais en sombre, avec le violet de l'accent et la typo Inter/Plus Jakarta de l'étalon. Pas de gradient, pas d'icônes colorées recopiées : conforme au ton sobre de l'étalon accueil. Rien à retoucher.

### 3. Lisibilité et hiérarchie : 9/10

Libellés gris clair sur gris sombre, contraste largement suffisant, rubrique active identifiable d'un coup d'oeil, bande clairement sous le header. Un point :

- **Piste (retenue faiblement car elle touche la discrétion demandée).** Chez le visiteur, 5 cadenas d'affilée de même couleur et même graisse que le texte forment un motif répétitif qui attire un peu l'oeil (1280 et 1920). Retouche codable : cadenas à 14 px, `opacity: .55` (ou token texte « tertiaire »), `margin-left: 6px`, et rester à pleine opacité uniquement sur l'élément actif ou survolé. Aucune faute dure : le cadenas reste discret au sens du fondateur.

### 4. Tenue aux 4 largeurs : 8/10

À 1280 et 1920 : impeccable (tout tient, air régulier, panneau ancré). À 375 : fondu droit propre, « … » fixe, panneau « … » à droite sous le filet. Défaut à 768 :

- **Faute dure légère (affordance de défilement absente).** Sur `d-visiteur-vannes-768.png` et `d-gratuit-vannes-768.png` (et `-menu-ouvert-768` du visiteur), la bande est défilée de sorte que la liste se termine sur « La lettre » puis un vide d'environ 50 px avant « … » ; « Favoris » et « Carnet » sont entièrement masqués, à droite, sans aucun fondu ni demi-libellé qui les trahisse. À gauche, la bande commence à « Bibliothèque » après un vide d'environ 28 px, avec Aujourd'hui, Parcours, Quoi répondre cachés sans indice. Le lecteur croit voir la barre complète (donc Favoris et Carnet inexistants, alors que « … » ne contient que Mes questions et Mes répliques). Le même cas se voit à 375 à gauche (Aujourd'hui à Bibliothèque cachés, aucun indice à gauche). À l'inverse, `d-abonne-vannes-768.png` montre bien « Conseils » en fondu : c'est le comportement attendu, incohérent avec le visiteur.
  Retouche codable :
  1. Supprimer le `scroll-snap` qui aligne sur un item entier (`scroll-snap-type` / `scroll-snap-align` sur les items de la bande), ou le passer en `proximity` sans `scroll-padding` inline.
  2. Calculer le masque en JS ou `animation-timeline: scroll()` : `mask-image` gauche actif dès que `scrollLeft > 0`, droit actif tant que `scrollLeft + clientWidth < scrollWidth - 1`, chacun de 32 px minimum.
  3. Centrer l'élément actif avec `scrollIntoView({ inline: 'center', block: 'nearest' })` plutôt que `nearest/start`, pour qu'un libellé voisin tombe dans la zone de fondu.
  4. Alternative simple : réduire le `scroll-padding-inline` de 28 px à 16 px pour que l'item suivant morde la zone de fondu.
  Fichier : composant bande de rubriques (conteneur défilant de la nav).
- Le panneau « … » est ancré sous le filet aux 4 largeurs (conforme).

### 5. Respect des décisions : 10/10

Menu affiché pour tous, un seul niveau (le panneau « … » ne porte que Mes questions / Mes répliques, pas de sous-niveau de rubriques), cadenas discret visiteur/gratuit et absent chez l'abonné, recherche 175 à 176 px, « … » visible à toutes les largeurs. La recherche absente à 375 est conforme à l'étalon accueil 375.

## Pistes subjectives (ne retiennent pas la note)

- Pastille plus soulignement violet sur l'actif : double signal, la référence n'utilise que la pastille. Cohérent avec le reste du site (soulignement accent) : à garder.
- `-accueil` : aucune rubrique allumée, bien rendu (aucun état faux). Rien à retoucher.

## Synthèse retouches (par ordre de valeur)

1. Affordance de défilement à 375/768 (fondu gauche et droit conditionnels, pas de snap qui masque entièrement les voisins). Fichier : conteneur défilant de la nav.
2. Aligner les centres icône compte et « … » (3 à 4 px). Fichiers : header (actions) et bouton « … ».
3. Optionnel : cadenas à `opacity .55`, 14 px.

NOTE GLOBALE : 8/10
