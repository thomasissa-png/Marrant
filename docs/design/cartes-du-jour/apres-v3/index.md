# Cartes du jour : captures « après » v3

Branche `claude/marrant-cartes-du-jour`, code `11f7669` (spec v3, V3.1 à V3.6) ; captures 768 et 1024 reprises sur `cfa9275` (tour 3.1 : carte Vidéo empilée en haut). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul : le rendu est le même en Premium (voir `../apres-v2/index.md`).

Nom : `<largeur>-visiteur-<etat>.png`.
- Aux 6 largeurs (320, 375, 768, 1024, 1280, 1440) : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite`.
- À 375 et 1280 : `focus-bouton`, `focus-accordeon`, `focus-partage`, `focus-etoile`, `focus-video`. À 375 : `zones` (vert = boîte du contrôle, orange = zone étendue des réactions).
- À 1280 et 1440 : `decryptage-ouvert` et `lire-suite-ouvert`, avec les cotes ci-dessous.
- Jeux de contenu réels du catalogue, à 375 et 1440, états `avant` et `chute`. Ils sont tirés de la base jetable et injectés en interceptant `/api/daily` dans le navigateur de capture seulement :
  - `vanne-courte` (énoncé de 38 caractères, chute de 8) ;
  - `vanne-longue` (271 et 79 caractères) ;
  - `conseil-court` (« L'ironie bienveillante », 237 caractères) ;
  - `conseil-long` (« Le toast de soixante secondes qui tient debout », 968 caractères).

## Voisines immobiles : bas des cartes (px depuis le haut de la page), avant et après ouverture

| Largeur | Ouverture | Avant (Vanne / Conseil / Vidéo) | Après | Voisines |
|---|---|---|---|---|
| 1280 | `decryptage-ouvert` | 1362 / 1278 / 1367 | 1804 / 1278 / 1367 | carte 2 : +0, carte 3 : +0 |
| 1280 | `lire-suite-ouvert` | 1160 / 1278 / 1367 | 1160 / 1422 / 1367 | carte 1 : +0, carte 3 : +0 |
| 1440 | `decryptage-ouvert` | 1362 / 1278 / 1367 | 1804 / 1278 / 1367 | carte 2 : +0, carte 3 : +0 |
| 1440 | `lire-suite-ouvert` | 1160 / 1278 / 1367 | 1160 / 1422 / 1367 | carte 1 : +0, carte 3 : +0 |

Les bords hauts ne bougent pas non plus. Le test Playwright `cartes-du-jour-cibles.spec.ts` le vérifie à 375, 1024, 1280 et 1440 px pour la chute, « Pourquoi ça marche », « Lire la suite » et deux accordéons.

## État fermé (`avant`)

| Largeur | Hauteurs (Vanne / Conseil / Vidéo) | Plus grand vide sous le dernier bloc d'une carte | Énoncé / bouton | Bouton |
|---|---|---|---|---|
| 320 | 311 / 493 / 534 | 21 (marge interne 20 + bordure) | 12 | 56 |
| 375 | 311 / 493 / 565 | 21 | 12 | 56 |
| 768 | 295 / 477 / 383 | 25 (marge interne 24 + bordure) | 12 | 56 |
| 1024 | 343 / 477 / 449 | 25 | 12 | 56 |
| 1280 | 383 / 501 / 590 | 25 | 12 | 56 |
| 1440 | 383 / 501 / 590 | 25 | 12 | 56 |

Autres mesures sur toutes les largeurs et tous les états :
- aucun défilement horizontal ;
- le haut de l'énoncé ne bouge pas au clic ;
- « Lire la suite » est à 8 px de l'extrait et à 16 px du premier accordéon.

## Points à relire (écarts mesurés)
1. **Écart des bas de cartes à 1280 et 1440 px, état fermé : 207 px** (accepté par l'orchestrateur) (Vanne 383, Vidéo 590), au-dessus du critère V3.7 n° 2 (≤ 160 px). Les hauteurs suivent l'estimation de la V3.1 (≈ 380 / 500 / 590), qui donnait déjà 210 px. Une fois la chute révélée, l'écart tombe à 89 px.
2. ~~Vidéo de 768 à 1279 px : environ 116 px entre « chaîne · durée » et les accordéons.~~ **Corrigé au tour 3.1** (`cfa9275`). La colonne de droite est empilée en haut (titre, chaîne · durée, puis accordéons 16 px dessous), et le test « aucun vide intérieur » couvre maintenant les piles internes à 768 et 1024 px. Les captures 768 et 1024 ont été refaites (`1024-visiteur-avant.png`). Hauteurs inchangées.
3. **Vanne la plus longue du catalogue** (acceptée telle quelle) : 271 caractères, contre ≈ 140 prévus en V3.2. L'énoncé en 24/32 fait 11 lignes à 1440 px, pour une carte de 615 px avant le clic et 753 px après (`1440-visiteur-vanne-longue-chute.png`).
