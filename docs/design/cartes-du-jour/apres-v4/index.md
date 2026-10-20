# Cartes du jour : captures « après » v4

Branche `claude/marrant-cartes-du-jour`, code `4b3232c` (spec v4 : bandeau Vanne pleine largeur dès 1024 px, Conseil et Vidéo dessous en 2 cartes de même hauteur, pile de 576 px sous 1024 px). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul : le rendu est le même en Premium (voir `../apres-v2/index.md`).

Mesure préalable demandée par la V4.3, sur la base de seed : 38 conseils actifs, de 242 à 996 caractères (médiane 528). Aucun ne fait moins de 150 caractères.

Nom : `<largeur>-visiteur-<etat>.png`.
- Aux 6 largeurs (320, 375, 768, 1024, 1280, 1440) : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite`. À 1024, le conseil du jour tient en entier : il n'y a pas de lien, et `lire-suite` est identique à `avant`.
- À 375 et 1280 : `focus-bouton`, `focus-accordeon`, `focus-partage`, `focus-etoile`, `focus-video`. À 375 : `zones`.
- À 1440 : `decryptage-ouvert` et `lire-suite-ouvert`.
- Jeux réels du catalogue, à 1280 et 1440, états `avant` et `chute`. Ils sont tirés de la base jetable et injectés en interceptant `/api/daily` dans le navigateur de capture seulement :
  - `vanne-courte` (38 caractères) ;
  - `vanne-longue` (271 caractères) ;
  - `conseil-court` (« L'ironie bienveillante ») ;
  - `conseil-long` (« Le toast de soixante secondes qui tient debout »).

## Hauteurs relevées (px), état fermé

| Largeur | Vanne | Conseil | Vidéo | Filets de pied Conseil / Vidéo | Extrait du Conseil |
|---|---|---|---|---|---|
| 320 | 311 | 493 | 534 | pile | 4 lignes + lien |
| 375 | 311 | 493 | 565 | pile | 4 lignes + lien |
| 768 | 295 | 477 | 383 | pile | 4 lignes + lien |
| 1024 | 407 (bandeau) | 615 | 615 | alignés | texte entier, conseil court |
| 1280 | 407 (bandeau) | 474 | 474 | alignés | 3 lignes + lien |
| 1440 | 407 (bandeau) | 474 | 474 | alignés | 3 lignes + lien |

- Bandeau : 407 px fermé, 513 après la chute, 835 avec « Pourquoi ça marche » ouvert.
- Avec les jeux longs et courts à 1280 et 1440 : vanne courte 407 puis 485 px, vanne longue 511 puis 617 px. La rangée reste à 474 et 474 px, filets alignés, avec les 4 jeux.

## Rangée à l'ouverture (1440 px)

| Ouverture | Conseil avant / après | Vidéo avant / après |
|---|---|---|
| `lire-suite-ouvert` | 474 / 525 | 474 / 474 (ni étirée ni déplacée) |
| `decryptage-ouvert` (bandeau) | 474 / 474 | 474 / 474 (la rangée descend de 322 px avec le bandeau) |
| `accordeons` (les 6 ouverts) | 725 | 875 (hauteurs naturelles, `items-start`) |

Contrôles :
- aucun défilement horizontal ;
- l'énoncé ne bouge pas au clic, et la chute est à 12 px ;
- bords gauche et droit communs au bandeau et à la rangée, gouttières de 24 px.

Ces points sont vérifiés par `playwright/tests/local/cartes-du-jour-cibles.spec.ts` (25 tests verts avec `header-budget`).

## Écarts à la spec
1. **Reste de l'arrondi en lignes réparti, au lieu d'être laissé sous l'extrait (V4.3).** Laissé dans le bloc `flex-1`, il donnait 37 px entre « Lire la suite » et le premier accordéon. Le bloc de l'extrait reçoit maintenant la hauteur exacte des lignes retenues, et le reste se répartit entre les 4 écarts de la carte : environ 21 px chacun à 1280 et 1440.
2. **Pas de `h-full` sur les cartes de la rangée.** Une hauteur à 100 % de la cellule annulerait le passage en `items-start` à l'ouverture. L'étirement à l'état fermé vient du `items-stretch` de la grille, pour le même rendu.
3. **Hauteur figée pendant l'ouverture (V4.3) : le nombre de lignes est figé, pas une hauteur mesurée.** Il ne change pas tant qu'un accordéon de la rangée est ouvert. Le Conseil garde donc sa hauteur fermée, à moins de 24 px près.
4. **Conseil court à 1024 px avec le contenu du jour.** Le texte entier (9 lignes) laisse 68 px de reste, répartis en écarts de 33 px. C'est au-delà des 30 px de la V4.3 ; cas accepté et signalé par la spec. Avec le conseil le plus court à 1280 et 1440 : écarts de 28 px.
5. **Correctif ajouté.** Le focus clavier sur « Lire la suite » faisait défiler l'extrait et coupait sa 1re ligne : sa zone de 44 px dépasse de 12 px d'un bloc `overflow-hidden`. Le débordement est rendu visible une fois la hauteur fixée, avec un test Playwright dédié.
