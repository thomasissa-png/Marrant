# Cartes du jour : captures « après » v4.2

Branche `claude/marrant-cartes-du-jour`, code `d8837a0` (v4.1 + finitions du tour 4.2). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul : le rendu est le même en Premium (voir `../apres-v2/index.md`).

Même liste que `apres-v4-1/`, plus 6 fichiers (65 au total), nommés `<largeur>-visiteur-<etat>.png`. Les 6 fichiers ajoutés sont `miniature-1` à `-3` à 375 et 1280 : Fadily Camara, Karim Duval, Chris Esquerre. Comme les jeux réels, la réponse `/api/daily` n'est modifiée que dans le navigateur de capture.

## Ce qui change (arbitrages du tour 4.2)
1. **Bloc titre vidéo.**
   - Le bloc titre et « chaîne · durée » est centré verticalement à côté de la miniature.
   - Le titre tient sur 2 lignes de 768 à 1440 px. À 1024 px, il passe en 16 px (voir écarts).
   - La miniature est la plus grande que permet l'égalisation, avec un plancher de 220 px dès 1280.
2. **Extrait du Conseil.** Au moins 3 lignes dans la rangée (1024 compris), 3 lignes sous 768 px, 4 de 768 à 1023 px. Le fondu ne couvre que la dernière demi-ligne (12 px).
3. **Écart entre cartes sur mobile.** 16 px (`gap-4`), inchangé : c'était déjà la valeur demandée.
4. **Citations courtes insécables.** Les citations de 4 mots ou moins entre guillemets deviennent insécables au rendu (« “Non non, repose-toi.” » ne se coupe plus). Donnée intacte.
5. **Pointillés et icônes.** Pointillés de « Révéler la chute » à 1,5 px (chute révélée à 1,5 px aussi, sans saut). Ampoule à 24 px : elle était déjà à 22 px depuis la v3, et restait optiquement plus petite.

## Cotes relevées (px)

| Largeur | Conseil / Vidéo | Miniature | Titre vidéo | Bloc titre (vide dessus / dessous) | Extrait | Écarts Conseil / Vidéo |
|---|---|---|---|---|---|---|
| 320 | 471 / 534 (pile) | 254 | 2 lignes | empilé | 3 lignes | 16 / 16 |
| 375 | 471 / 565 (pile) | 309 | 2 lignes | empilé | 3 lignes | 16 / 16 |
| 768 | 479 / 444 (pile) | 237 | 2 lignes | 31 / 31 | 4 lignes | 16 / 16 |
| 1024 | 455 / 455 | 190 | 2 lignes (16 px) | 17 / 17 | 3 lignes | 16 / **24, 21 entre accordéons** |
| 1280 | 455 / 455 | 256 | 2 lignes | 36 / 36 | 3 lignes | 16 / 16 |
| 1440 | 455 / 455 | 256 | 2 lignes | 36 / 36 | 3 lignes | 16 / 16 |

- **Bandeau** : 359 px fermé, 519 après la chute ; énoncé à 40 px, chute à 32 px (vanne longue : 28 / 32).
- **Jeux réels à 1280 et 1440.** Conseil court : 435 / 435, miniature au plancher de 220 px, écarts du Conseil à 17,5 px (9,5 px entre accordéons). Conseil long : 455 / 455. Les 3 autres vidéos à 1280 : 479 / 479, miniature de 299 px, extrait de 4 lignes, titre sur 2 lignes.
- **Plus grand vide intérieur, sur les 65 états** : 24 px + 1 px de bordure. Aucun défilement horizontal. Titre vidéo sur 2 lignes au plus de 768 à 1440 px dans tous les états.

Tests Playwright `cartes-du-jour-cibles` et `header-budget` : 27 verts. Ajoutés à ce tour :
- titre vidéo ≤ 2 lignes de 768 à 1440 px ;
- extrait ≥ 3 lignes ;
- bloc titre centré et sans vide interne > 24 px.

## Écarts
- **Titre vidéo en 16 px à 1024 px** (18 px ailleurs, taille déjà en place). En 18 px, aucun titre de 2 lignes ne tient dans la colonne de 428 px à côté d'une miniature d'au moins 160 px : la miniature tombait au plancher et le titre faisait 3 lignes.
- **Reste d'égalisation à 1024 px** : 37 px, répartis dans la carte Vidéo. Les écarts entre blocs passent à 24 px et l'écart entre les deux accordéons à 21 px (8 px dans le Conseil voisin). Tous restent ≤ 24 px.
- **Bloc titre centré** : à 1280 et 1440 px, il reste 36 px au-dessus et au-dessous du bloc (70 px en bas avant). Le test « pas de vide > 24 px » porte sur l'intérieur du bloc titre, pas sur cet espace de centrage.
