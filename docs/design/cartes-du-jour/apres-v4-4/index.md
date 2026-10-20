# Cartes du jour : captures « après » v4.4

Branche `claude/marrant-cartes-du-jour`, code `87abc26` (v4.3 + tour 4.4 + échelle typographique demandée par Thomas). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul.

Même liste que `apres-v4-3/` (65 fichiers), nommés `<largeur>-visiteur-<etat>.png`. Les jeux réels et les 3 autres miniatures sont injectés dans le navigateur de capture seulement.

## Échelle typographique (toute la section, toutes largeurs)

| Rôle | Sous 1024 px | Dès 1024 px | Dès 1280 px |
|---|---|---|---|
| Énoncé et chute (même taille, chute en gras) | 22/30 | 28/36 ; 24/32 au-delà de 120 caractères ; 22/30 au-delà de 200 | idem |
| Titres de carte (Conseil et Vidéo, identiques) | 18/26 | 18/26 | 20/28 |
| Corps : extrait, accordéons, bouton de la chute, « Lire la suite », messages vides | 15/24 | 15/24 | 15/24 |
| En-têtes de carte, chaîne · durée | 14 | 14 | 14 |
| Pastilles | 12 | 12 | 12 |

Taille du titre de 1024 à 1279 px : 20 px ne tient pas sur 2 lignes à côté de la miniature, donc 18 px dans les deux cartes (règle « 20 si ça tient, sinon 18 »).

Hors échelle, non modifiés :
- le H2 « Ton contenu du jour » (taille commune à toutes les sections de l'accueil) ;
- les compteurs 🔥 💀 (composant partagé, hors périmètre) ;
- le titre de repli de la vignette vidéo (composant partagé).

## Autres points du tour 4.4
- **Énoncé.** Centré jusqu'à 3 lignes ; au-delà, aligné à gauche dans l'axe de 672 px, chute comprise. Mesuré au rendu dès 1024 px : vanne longue à 1280 et 1440.
- **Extrait du Conseil.** Fondu doux sur la dernière ligne, jusqu'à 45 % d'opacité.
- **« Lire la suite ».** Le lien est à 12 px de l'extrait : sa zone de 44 px ne recouvre plus la dernière ligne.
- **Courtes répliques.** Deux premiers mots et deux derniers mots liés : pas de coupure « “Non / non », pas de veuve « repose-toi.” » ».
- **Titre vidéo.** Au moins 16 px de marge à droite (18 à 22 px mesurés).
- **1024 px.** Gouttières de rangée à 16 px et écart miniature/titre de 8 px. Les gouttières de page ne sont pas modifiées : elles sont communes au site.

## Cotes relevées (px)

| Largeur | Bandeau fermé / chute | Conseil / Vidéo | Miniature | Titre vidéo | Extrait |
|---|---|---|---|---|---|
| 320 | 319 / 511 | 483 / 542 (pile) | 254 | 2 lignes | 3 lignes |
| 375 | 319 / 511 | 483 / 573 (pile) | 309 | 2 lignes | 3 lignes |
| 768 | 297 / 399 | 489 / 448 (pile) | 237 | 2 lignes, 18 px | 4 lignes |
| 1024 | 303 / 417 | **465 / 406 (hauteurs naturelles)** | **161** | 2 lignes, 18 px | 3 lignes |
| 1280 | 303 / 417 | 467 / 467 | 235 | 2 lignes, 20 px | 3 lignes |
| 1440 | 303 / 417 | 467 / 467 | 235 | 2 lignes, 20 px | 3 lignes |

- **Bandeau.** Il passe de 363 à 303 px fermé, comme voulu. Vanne longue : 519 px après la chute, énoncé et chute en 22 px, alignés à gauche.
- **Jeux réels à 1280 et 1440.** Conseil court : 439 / 439, miniature de 220 px. Autres vidéos à 1280 : 491 / 491 (miniature de 306 px) ou 467 / 467.
- **Sur les 65 états** : plus grand vide intérieur 24 px + 1 px de bordure, aucun défilement horizontal, titre vidéo sur 2 lignes au plus de 768 à 1440 px.

Tests Playwright `cartes-du-jour-cibles` et `header-budget` : 31 verts. Ajoutés à ce tour :
- titre vidéo ≥ 18 px (20 dès 1280) ;
- marge droite ≥ 16 px ;
- gouttières de 16 px à 1024 ;
- rangée égalisée dès 1280.

## Écart à arbitrer : 1024 px
Avec un titre vidéo d'au moins 18 px sur 2 lignes et 16 px de marge, la miniature est limitée à 161 px. Il manque alors 59 px à la Vidéo pour égaler le Conseil. Les écarts entre blocs n'en absorbent que 24 sans dépasser 24 px, et même un extrait de 2 lignes en laisserait 11.

Repli appliqué : à 1024 seulement, la rangée passe en hauteurs naturelles (`data-libre`, cartes alignées en haut, écarts de 16 px), sans aucun vide gonflé. Les bas de cartes diffèrent de 59 px.

Autres issues possibles, au choix de l'orchestrateur :
- titre vidéo en 15 ou 16 px à 1024 (v4.3) ;
- pile d'une colonne de 1024 à 1279 px ;
- titre sous la miniature à 1024.
