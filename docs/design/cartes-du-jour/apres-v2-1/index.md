# Cartes du jour : captures « après » v2.1

Branche `claude/marrant-cartes-du-jour`, code `3dda654` : spec v2 et arbitrage de l'orchestrateur du tour 2.1.
- Plus de réserve de hauteur : le bouton « Révéler la chute » est compact, à 12 px sous l'énoncé, et le groupe est aligné en haut.
- Énoncé et chute en `text-3xl` dès 1280 px.
- Durée de la vidéo affichée quand la donnée ISO 8601 se convertit.

Méthode identique à `apres-v2/` : build de production local, un seul serveur standalone, PostgreSQL 16 jetable (`scripts/seed.sh`), Chromium, DPR 1, contenu du jour du 20/10/2026. Viewport complet, header inclus, section 24 px sous le header sticky.

Nom : `<largeur>-visiteur-<etat>.png`, même liste que `apres-v2/` :
- aux 6 largeurs (320, 375, 768, 1024, 1280, 1440) : `avant`, `chute`, `decryptage`, `accordeons`, `lire-suite` ;
- à 375 et 1280 : `focus-bouton`, `focus-accordeon`, `focus-partage`, `focus-etoile`, `focus-video` ;
- à 375 : `zones` ;
- à 375 et 1280 : `miniature-1` à `-3`, soit trois autres vidéos (réponse `/api/daily` modifiée dans le navigateur de capture seulement), avec leur durée.

Profil : visiteur seul (rendu identique en Premium, voir `apres-v2/index.md`).

Mesures (px) :

| Largeur | Bouton (h) | Énoncé / bouton | Vide sous le bouton, avant clic | Chute (h) | Vide sous le groupe, après clic | Vide, décryptage ouvert |
|---|---|---|---|---|---|---|
| 320, 375 | 56 | 12 | 16 (carte à hauteur naturelle) | 146 | 16 | 16 |
| 768, 1024 | 56 | 12 | 16 | 98 | 16 | 16 |
| 1280, 1440 | 56 | 12 | 271 (au-dessus du pied) | 214 | 51 | 16 |

Contrôles :
- l'énoncé ne bouge pas au clic, à toutes les largeurs ;
- aucun défilement horizontal ;
- dès 1280 px, les pieds sont alignés ;
- tests Playwright `cartes-du-jour-cibles` (cibles de 44 px, bouton compact, énoncé immobile) et `header-budget` verts.

Point à relire : à 1280 et 1440 px, avant le clic, la Vanne garde 271 px de vide entre le bouton et le pied (`1440-visiteur-avant.png`). C'est l'effet attendu de l'arbitrage : cartes de même hauteur, groupe aligné en haut, bouton compact. Le vide se trouve au-dessus du pied, et l'énoncé en 30 px ne le comble qu'en partie avec une vanne de 2 lignes. Il tombe à 51 px une fois la chute révélée.
