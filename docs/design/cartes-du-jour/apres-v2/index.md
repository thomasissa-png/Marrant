# Cartes du jour : captures « après » v2

Branche `claude/marrant-cartes-du-jour`, code `3ae5fba` (spec v2, V2.1 à V2.8 ; D1 : « Pourquoi ça marche » fermé par défaut ; header : onglets en `px-1.5` dès 1280 px). Build de production local, un seul serveur standalone, PostgreSQL 16 jetable remplie par `scripts/seed.sh`, Chromium, DPR 1, contenu du jour du 20/10/2026 servi par `/api/daily`.

Cadrage : viewport complet, header inclus. La hauteur du viewport est ajustée à la section, qui est défilée pour commencer 24 px sous le header sticky. Nom : `<largeur>-visiteur-<etat>.png`.

| État | Largeurs | Contenu |
|---|---|---|
| `avant` | 320, 375, 768, 1024, 1280, 1440 | Avant clic |
| `chute` | toutes | Après « Révéler la chute » (décryptage fermé) |
| `decryptage` | toutes | « Pourquoi ça marche » ouvert |
| `accordeons` | toutes | Les 6 accordéons ouverts |
| `lire-suite` | toutes | Texte du Conseil déplié (« Réduire » visible) |
| `focus-bouton`, `focus-accordeon` (« Exemple concret »), `focus-partage`, `focus-etoile`, `focus-video` | 375, 1280 | Focus clavier |
| `zones` | 375 | Zones cliquables contourées : vert = boîte du contrôle, orange = zone étendue des réactions |
| `miniature-1` à `-3` (complément V2.6) | 375, 1280 | Vignette recadrée sur 3 autres vidéos (Fadily Camara, Karim Duval, Chris Esquerre), réponse `/api/daily` modifiée dans le navigateur de capture seulement |

Profil : visiteur seul. Le rendu de la section est le même en Premium : `/api/daily` ne dépend pas de la session, et la section n'a pas de branche selon le plan. Seuls l'étoile (pleine si le contenu est déjà en favori) et l'état des réactions peuvent différer, et ces composants partagés n'ont pas changé.

Mesures sur le rendu réel :
- aucun défilement horizontal ;
- l'énoncé ne bouge pas entre `avant` et `chute`, à toutes les largeurs ;
- 16 px entre l'énoncé et l'emplacement de la chute ;
- dès 1280 px, bords hauts et filets de pied alignés sur les 3 cartes ;
- texte du Conseil sur 4 lignes à 320 et 375 px, sur 6 dès 768 px ;
- focus sur la chute après le clic ;
- bouton « Premium » du header aligné sur le bord droit de la grille à 1280 et 1440 px.

Tests Playwright `header-budget` et `cartes-du-jour-cibles` verts (partage, étoile, « Révéler la chute », accordéons et « Lire la suite » à 44 px au moins ; réactions atteintes à 9 px de la pastille).

Point à relire en priorité (critère V2.8 n° 1). À 1280 et 1440 px, avant le clic, la Vanne garde un vide d'environ 125 px sous l'emplacement pointillé. Il vient de l'accordéon réservé invisible (44 px), de son écart (16 px) et du centrage du groupe (V2.2 b). Ce vide est voulu par la spec, mais il dépasse le critère « aucun vide supérieur à 80 px, aucun vide sous le bouton ». Voir `1440-visiteur-avant.png`.
