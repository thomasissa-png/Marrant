# Relecture design à l'aveugle, nav v6, variante d (2e passe)

Périmètre : 32 captures `docs/espace-client/etalons/nav-v6/variantes/d-*.png` (toutes ouvertes), référence Thomas 15-11, étalon accueil 1280 et 375. Aucune relecture ni commentaire de maquette consultés. Le code de la maquette n'a pas été lu : les « fichiers » cités sont les captures qui prouvent le défaut, la retouche est donnée en CSS/comportement à placer dans le composant de rail de navigation.

## Ce qui est au niveau (à ne pas toucher)

- Rail en pastille arrondie sur fond légèrement plus clair que la page, actif en pastille + soulignement violet : même langue que la référence (rail, actif détaché, séparateurs de groupes, « … » final), traduite dans le violet et le sentence-case du site. Plus de côté « PowerPoint » : pas d'icônes colorées, pas de barre pleine.
- Un seul niveau, toujours affiché pour les 3 états (visiteur, gratuit, abonné). Cadenas fins, même gris que le texte, uniquement sur les 5 rubriques Premium du non-abonné, absents chez l'abonné et dans l'actif de `d-abonne-*`. Le cadenas reste lisible dans l'actif (`d-gratuit-apercu-*`).
- Recherche mesurée à 176 px (1280 : ~175, 768 : ~175, 1920 : ~176). Colonne du rail alignée sur la colonne de contenu à 1280 et 1920 (`d-*-vannes-1920.png` : rail et H1 sur le même bord gauche et droit).
- Accueil (`d-visiteur-aujourdhui-accueil-*`) : aucune rubrique allumée, correct. Le rail défile jusqu'à l'actif à 375 et 768 (actif visible dans les 3 états).

## Notes

| Critère | Note | Justification |
|---|---|---|
| 1 Élégance et finition | 8 | Défauts 1 et 2 ci-dessous |
| 2 Fidélité langue du site / référence | 9 | Apostrophe droite (défaut 3) |
| 3 Lisibilité et hiérarchie | 10 | Actif double codé, groupes séparés, cadenas discrets |
| 4 Tenue aux 4 largeurs | 7 | Défauts 1 et 2 |
| 5 Respect des décisions | 10 | Toutes tenues (voir plus haut) |

## Défauts

### 1. Faute dure : menu « … » ouvert sans déclencheur visible, qui recouvre le titre (375 et 768)
Fichiers : `d-visiteur-vannes-menu-ouvert-375.png`, `d-abonne-vannes-menu-ouvert-375.png`, `-768.png` (les deux).
À 375 et 768 le rail défile et le bouton « … » est hors champ (il est en fin de rail). Le panneau « Mes questions / Mes répliques » s'ouvre quand même, flottant à droite, sans ancrage, et masque le H1 : à 375 « Vannes drô… » est coupé, à 768 « ce soir, pas trois » est mangé à la ligne 1. À 1280 et 1920 le panneau est correct, sous le « … ».
Retouche : sortir le « … » du conteneur qui défile, en `flex: none` collé à droite du rail (hors `overflow-x: auto`, avec le fondu qui se termine avant lui), puis ancrer le panneau sur ce bouton (`right: 0; top: calc(100% + 8px)`). Ce bouton reste donc toujours visible à toute largeur. Repli minimal : à l'ouverture, `scrollIntoView({inline:'end'})` sur le « … » avant d'afficher le panneau. À 375, vérifier que le panneau (largeur 200 px) ne dépasse pas la marge de 16 px.

### 2. Faute dure : fondus de bord trop courts, des fragments de glyphes restent lisibles (375 et 768)
Fichiers : `d-visiteur-vannes-768.png` (« re 🔒 » coupé à gauche, « Fa » à droite), `d-gratuit-vannes-768.png` (idem), `d-abonne-vannes-768.png` (« i répondre » à gauche), `d-abonne-vannes-375.png` et `d-abonne-vannes-menu-ouvert-375.png` (« ue » isolé à gauche), `d-*-vannes-375.png` (« Vidéo » coupé à droite, acceptable). Les cadenas aussi sont coupés à 768.
Retouche : `mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)` (aujourd'hui ~24 px) et `scroll-snap-type: x proximity` avec `scroll-snap-align: start` et `scroll-padding-inline: 40px` sur les items, pour que le défilement automatique vers l'actif ne s'arrête pas au milieu d'un mot. Appliquer le fondu gauche seulement quand `scrollLeft > 0` (à scrollLeft 0, l'accueil 375 montre bien le rail sans fondu à gauche : conserver).

### 3. Faute dure mineure : apostrophe de « Aujourd'hui » droite dans le rail
Fichiers : toutes les captures où l'onglet est visible (`d-abonne-aujourdhui-1280.png`, `-768`, `-375`, `d-gratuit-apercu-375.png`…). Le rail affiche `Aujourd'hui` (droite) alors que le H1 de la page affiche `Aujourd’hui` (typographique) et que « S'entraîner » ou « L'atelier » du reste du site suivent le signe courbe. Retouche : libellé `Aujourd’hui` (U+2019) dans la liste des rubriques.

## Pistes (ne retiennent pas la note)

- Bouton « … » nu aux 1280 et 1920 : la référence le met dans une pastille. Ici il flotte à droite du rail, avec un grand vide après « Carnet » (visible surtout chez l'abonné). Piste : lui donner la pastille de la référence ou l'aligner à 8 px de « Carnet ». Subjectif, l'existant est lisible.
- Rangée de filtres de la page Vannes à 375 (`d-*-vannes-375.png`) : coupée net à la marge droite (« Boulot & Collèg… ») sans fondu, contrairement au rail. Hors périmètre nav, à harmoniser avec le même masque si on touche le composant.
- Fond de la pastille active (gris proche du fond du rail) discret, mais compensé par le soulignement violet : pas de retouche.

## Verdict

Direction juste et conforme aux décisions, finition à 90 %. Deux défauts à corriger avant de passer au niveau : panneau « … » non ancré à 375 et 768 (qui recouvre le H1), et fondus de bord trop courts qui laissent des morceaux de mots. Après ces retouches, la relecture ne devrait plus retenir que l'apostrophe, qui se corrige en une ligne. Règle d'or : la version corrigée repasse la relecture à l'aveugle.

NOTE GLOBALE : 7/10
