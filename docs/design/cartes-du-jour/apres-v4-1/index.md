# Cartes du jour : captures « après » v4.1

Branche `claude/marrant-cartes-du-jour`, code `7bedd05` (v4 plus les retouches du tour 4.1). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul : le rendu est le même en Premium (voir `../apres-v2/index.md`).

Même liste que `apres-v4/` (59 fichiers), nommés `<largeur>-visiteur-<etat>.png` :
- aux 6 largeurs : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite` ;
- à 375 et 1280 : `focus-*`, dont `focus-video`, qui montre l'anneau de 2 px sur toute la miniature ;
- à 375 : `zones` ;
- à 1440 : `decryptage-ouvert` et `lire-suite-ouvert` ;
- à 1280 et 1440, jeux réels injectés dans le navigateur de capture seulement : `vanne-courte`, `vanne-longue`, `conseil-court`, `conseil-long` (`avant`, `chute`).

## Ce qui change (arbitrages du tour 4.1)
1. **Vanne dès 1024 px.** Énoncé à 40/48 (32/40 au-delà de 50 caractères, 28/36 au-delà de 120), chute à 32/40 en gras (28/36 au-delà de 110 caractères, 24/32 au-delà de 180). Énoncé, bouton, chute et décryptage partagent un seul axe de 672 px. Le `py-4` du corps est retiré.
2. **Vidéo sur un seul modèle dès 768 px** : miniature et titre côte à côte, accordéons pleine largeur dessous ; titre sur 2 lignes au plus.
3. **Rangée sans écart gonflé.** L'extrait du Conseil part de 4 lignes, et la miniature prend exactement la hauteur manquante pour égaler la rangée. Si la miniature sort de ses bornes, l'extrait cède des lignes entières avant que le titre vidéo ne passe à 3 lignes. Plus de `justify-between`.
4. **Focus et lien.** Anneau de focus clavier de 2 px sur la miniature ; « L'anatomie d'une vanne » insécable.
5. **Révélation.** Pas de défilement à la révélation (la chute apparaît à la place du bouton) ; `aria-live="polite"` en place sur `#chute-du-jour`, vérifié par Jest.

## Cotes relevées (px)

| Largeur | Bandeau / Vanne fermé | Conseil / Vidéo fermés | Miniature (largeur) | Titre vidéo | Extrait | Énoncé / chute (taille) |
|---|---|---|---|---|---|---|
| 320 | 311 | 493 / 534 (pile) | 254 | 2 lignes | 4 lignes | 20 / 20 |
| 375 | 311 | 493 / 565 (pile) | 309 | 2 lignes | 4 lignes | 20 / 20 |
| 768 | 295 | 477 / 444 (pile) | 237 | 2 lignes | 4 lignes | 24 / 24 |
| 1024 | 359 | 429 / 429, filets alignés | 202 | **3 lignes** | **2 lignes** | 40 / 32 |
| 1280 | 359 | 453 / 453, filets alignés | 253 | 2 lignes | 3 lignes | 40 / 32 |
| 1440 | 359 | 453 / 453, filets alignés | 253 | 2 lignes | 3 lignes | 40 / 32 |

- Bandeau : 359 px fermé (visé ~360), 521 après la chute.
- Plus grand vide intérieur, sur les 59 états : 24 px (marge interne) + 1 px de bordure. Il est atteint partout, y compris avec les 4 jeux réels. Le conseil court à 1280 et 1440 donne une rangée de 425 / 425 avec une miniature de 203 px, sans lien et sans écart gonflé.
- Vanne longue à 1440 : énoncé en 28 px, chute en 32 px, bandeau à 601 px après la chute.
- À l'ouverture (1440) : `lire-suite-ouvert` donne un Conseil de 453 à 525 px, avec une Vidéo inchangée à 453 px ; `accordeons` donne 725 / 854 en hauteurs naturelles. Miniature et extrait restent figés tant qu'un accordéon est ouvert.

Tests Playwright `cartes-du-jour-cibles` et `header-budget` : 27 verts. Ils couvrent :
- vides ≤ 24 px ;
- chute ≥ 0,75 × énoncé ;
- modèle Vidéo identique de 768 à 1440 px ;
- titre vidéo sur 2 lignes au plus ;
- rangée figée à l'ouverture ;
- énoncé immobile au clic ;
- cibles de 44 px ;
- extrait immobile au focus.

## Écarts
- **1024 px.** La colonne fait 428 px utiles : un titre vidéo sur 2 lignes y demande environ 230 px, ce qui limite la miniature à environ 175 px. Le Conseil ne pourrait alors égaler la Vidéo qu'avec un écart gonflé. Le dernier recours s'applique donc : titre vidéo sur 3 lignes, extrait du Conseil sur 2 lignes et « Lire la suite » (`1024-visiteur-avant.png`).
- **Extrait à 3 lignes à 1280 et 1440** (et non 4), pour garder le titre vidéo sur 2 lignes.
- **Hors périmètre** : réactions 🔥 💀 (composant partagé, arbitrage 6) ; fondu sur une demi-ligne et lien à 12 px (suggestion UX, non arbitrée).
