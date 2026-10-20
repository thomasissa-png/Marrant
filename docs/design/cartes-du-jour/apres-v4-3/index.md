# Cartes du jour : captures « après » v4.3

Branche `claude/marrant-cartes-du-jour`, code `edfd63b` (v4.2 + derniers détails du tour 4.3). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky. Profil visiteur seul : le rendu est le même en Premium.

Même liste que `apres-v4-2/` (65 fichiers), nommés `<largeur>-visiteur-<etat>.png` :
- aux 6 largeurs : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite` ;
- à 375 et 1280 : `focus-*` ; à 375 : `zones` ;
- à 1440 : `decryptage-ouvert` et `lire-suite-ouvert` ;
- jeux réels à 1280 et 1440 ;
- `miniature-1` à `-3` à 375 et 1280.

Jeux et miniatures : réponse `/api/daily` modifiée dans le navigateur de capture seulement.

## Ce qui change (tour 4.3)
1. **« Révéler la chute ».** Pointillés de 2 px en violet-400 plein (`border-accent-link`, #A78BFA), blancs au survol. L'encadré de la chute est en trait plein de 2 px (`border-accent-primary/60`), comme en v4.1.
2. **Extrait du Conseil.** Le fondu couvre toute la dernière ligne visible (24 px).
3. **Rangée.**
   - 8 px entre les accordéons dans les deux cartes, à toutes les largeurs ; le reste d'égalisation n'y va plus.
   - À 1024 : titre vidéo en 15 px et 12 px entre miniature et titre. La miniature passe à 210 px (190 en v4.2), le titre tient sur 2 lignes, l'extrait sur 3 lignes, et les écarts entre blocs de la Vidéo sont à 23,5 px.
4. **En-têtes.** Les 3 icônes sont logées dans un emplacement fixe de 20 px (ampoule dessinée en 24 px avec `-m-0.5`), ligne d'en-tête de 24 px. Les libellés sont alignés au pixel en x et en y, vérifié par Playwright à 375, 1024, 1280 et 1440.
5. **Corps d'accordéon.**
   - Paragraphes en `text-wrap: wrap` (voir écarts).
   - L'insécable ne lie plus que les deux premiers mots d'une courte réplique : « “Non non, » reste groupé, « repose-toi.” » peut passer à la ligne.
6. **Miniatures.** Liseré `ring-1 ring-inset ring-white/10`, posé par-dessus l'image dans un `::after`. Sur le conteneur, l'image l'aurait caché. L'anneau de focus de 2 px est inchangé.

## Cotes relevées (px)

| Largeur | Bandeau fermé / chute | Conseil / Vidéo | Miniature | Titre vidéo | Bloc titre (dessus / dessous) | Extrait | Écarts entre blocs Conseil / Vidéo | Entre accordéons |
|---|---|---|---|---|---|---|---|---|
| 320 | 315 / 497 | 471 / 538 (pile) | 254 | 2 lignes | empilé | 3 lignes | 16 / 16 | 8 |
| 375 | 315 / 469 | 471 / 569 (pile) | 309 | 2 lignes | empilé | 3 lignes | 16 / 16 | 8 |
| 768 | 299 / 405 | 479 / 448 (pile) | 237 | 2 lignes | 31 / 31 | 4 lignes | 16 / 16 | 8 |
| 1024 | 363 / 525 | 456 / 456 | 210 | 2 lignes (15 px) | 23 / 23 | 3 lignes | 16 / 23,5 | 8 |
| 1280 | 363 / 525 | 455 / 455 | 249 | 2 lignes | 34 / 34 | 3 lignes | 16 / 16 | 8 |
| 1440 | 363 / 525 | 455 / 455 | 249 | 2 lignes | 34 / 34 | 3 lignes | 16 / 16 | 8 |

- **Jeux et autres vidéos.** Conseil court à 1280 et 1440 : 439 / 439, miniature au plancher de 220 px, écarts du Conseil à 19 px. Autres vidéos à 1280 : 479 / 479, miniature de 292 px, extrait de 4 lignes.
- **Sur les 65 états** : plus grand vide intérieur de 24 px + 1 px de bordure, aucun défilement horizontal, titre vidéo sur 2 lignes au plus de 768 à 1440 px, extrait de 3 lignes au moins.
- **Bandeau** : 363 px fermé (359 en v4.2). Les 4 px viennent de la ligne d'en-tête fixée à 24 px pour aligner les libellés.

Tests Playwright `cartes-du-jour-cibles` et `header-budget` : 31 verts, dont 8 px entre accordéons et libellés d'en-tête alignés au pixel.

## Écarts
- **`text-wrap: wrap` au lieu de `pretty` dans les corps d'accordéon.** Mesuré sur « À toi de jouer » à 1440 et 1024 : avec `pretty` (déjà la règle globale des `p`), les deux lignes pleines s'arrêtent à 91 et 98 px du bord ; avec `wrap`, à 41 et 78 px. Le drapeau relevé venait donc de `pretty`, pas de `balance`. Les 78 px restants correspondent à la largeur de « “Non non, », gardé groupé.
- **Titre vidéo en 15 px à 1024 px** (18 px ailleurs). C'est la seule combinaison mesurée qui tient à la fois titre sur 2 lignes, miniature ≥ 200 px, écarts ≤ 24 px et 8 px entre accordéons. En 16 px, il restait 9 px à placer au-delà des 24 px. À 1024, la Vidéo est la carte la plus courte : une ligne d'extrait de plus côté Conseil aurait creusé l'écart au lieu de le combler.
