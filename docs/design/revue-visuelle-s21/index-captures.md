# Revue visuelle s21 : index des captures

Build de production local (`next build`, serveur standalone), base PostgreSQL 16 jetable remplie par `scripts/seed.sh` (80 vannes, 38 conseils, 89 vidéos, 3 parcours, carnet d'octobre, articles du dépôt) + 2 comptes de capture (gratuit ; Premium avec abonnement mensuel actif, 7 favoris, parcours Répartie à l'étape 3).

Nom : `<page>-<profil>-<largeur>.png` (pleine page, DPR 1). Profils : `visiteur`, `gratuit` (compte sans abonnement), `premium`. Dossiers : `avant/` (branche `claude/marrant-s21-integration`, 43c222f) et `apres/` (branche `claude/marrant-s21-visuel`).

Pages absentes pour un profil = redirection du site (ex. `/profil` en visiteur → `/login`) ou état sans objet (fin d'étape 1 pour l'abonné). L'en-tête et le pied de page figurent sur chaque capture ; le menu mobile ouvert et la fenêtre Premium sont des captures d'écran (non pleine page).

| Page | URL / action | visiteur | gratuit | premium |
|---|---|---|---|---|
| `accueil` | / | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `abonnement` | /abonnement | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `register` | /register | 375, 768, 1280, 1440 | redirigé / sans objet | redirigé / sans objet |
| `login` | /login | 375, 768, 1280, 1440 | redirigé / sans objet | redirigé / sans objet |
| `onboarding` | /onboarding (quiz d'orientation du compte) | redirigé / sans objet | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `onboarding-resultat` | /onboarding, réponses jusqu'au résultat | redirigé / sans objet | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `vannes` | /vannes | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `vanne-fiche` | première fiche de /vannes | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `conseils` | /conseils | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `conseil-fiche` | première fiche de /conseils | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `videos` | /videos | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `video-fiche` | première fiche de /videos | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `parcours` | /parcours | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `parcours-orientation-resultat` | /parcours, quiz d'orientation jusqu'au résultat | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | redirigé / sans objet |
| `parcours-repartie-etape1` | /parcours/repartie, étape 1 ouverte | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `parcours-repartie-fin-etape1` | /parcours/repartie, quiz de l'étape 1 fini, lettre dépliée | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | redirigé / sans objet |
| `carnet` | /carnet | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `glossaire` | /glossaire | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `a-propos` | /a-propos | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `lettre` | /lettre | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `blog` | /blog | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `blog-article` | /blog/repondre-moqueries-avec-humour (encart du milieu, bloc de fin, lettre, FAQ) | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `profil` | /profil | redirigé / sans objet | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `favoris` | /favoris | redirigé / sans objet | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `quiz-humour` | /quiz-humour | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 | 375, 768, 1280, 1440 |
| `menu-mobile` | /, menu mobile ouvert (375, 768) | 375, 768 | 375, 768 | 375, 768 |
| `fenetre-premium` | /vannes, cœur cliqué en visiteur | 375, 768, 1280, 1440 | redirigé / sans objet | redirigé / sans objet |

Total : 270 captures « avant », 270 « après » (mêmes noms). PNG 256 couleurs pour alléger le dépôt.

## Tour 2 : `apres-v2/` (verdict @design du 18/10, 31 défauts)

- `apres-v2/<page>-<profil>-<largeur>.png` : mêmes noms et même matrice que `avant/` et `apres/`, prises sur la branche `claude/marrant-s21-visuel` après le tour 2. Pleine page prise depuis le haut, en-tête collant neutralisé pendant la capture seulement (R20 : plus d'en-tête figé au milieu de `parcours-repartie-fin-etape1-*`).
- `apres-v2/admin-{semaine,abonnes-premium,abonnes-lettre}-{375,1280}.png` : pages d'administration visées par R14, R15, R24, R25 (mêmes noms que `docs/admin/captures/`).
- `apres-v2/sections/<nom>-section-NN.png` : une capture par écran (375 x 812, défilement par pas de 812 px, en-tête collant réel) pour toute page de plus de 5 000 px à 375 px : accueil, articles, liste des articles, parcours (liste, orientation, page Répartie, fin d'étape 1), carnet abonné, vidéos abonné, vannes, conseils abonné, glossaire, favoris, abonnement abonné.

Total tour 2 : 276 captures pleine page ou écran, 289 découpes. PNG 256 couleurs.

## Tour 3 : `apres-v3/` (verdict @design du 18/10, 8,7/10, 4 majeurs et 12 mineurs)

- `apres-v3/<page>-<profil>-<largeur>.png` : même matrice et mêmes noms que `apres-v2/`, prises sur la branche `claude/marrant-s21-visuel` après le tour 3 (toutes les pages à 375, 768, 1 280 et 1 440 px : la passe typographique touche tout le site). À regarder en premier : `conseils-*`, `vannes-*`, `videos-*` (768 et 1 280), `accueil-*` (375 et 768), `carnet-*`, `favoris-premium-*`, `quiz-*`, `a-propos-*`, `profil-premium-375`.
- `apres-v3/admin-{semaine,abonnes-premium,abonnes-lettre}-{375,1280}.png` : T2-14.
- `apres-v3/sections/<nom>-section-NN.png` : découpes écran par écran (375 x 812) des pages de plus de 5 000 px à 375 px.

Total tour 3 : 276 captures pleine page ou écran, 289 découpes. PNG 256 couleurs.

## Tour 4 : `apres-v4/` (verdict @design du tour 3, 9,3/10, 1 majeur et 7 mineurs)

- Liste ciblée (T3.6 du verdict), mêmes noms que `apres-v3/` : `conseils-{visiteur,gratuit,premium}-{375,1280}`, `video-fiche-*-375`, `vanne-fiche-*-1280`, `accueil-visiteur-{375,768,1280}` (pied de page compris), `vannes-visiteur-{375,768,1280}`, `vannes-premium-{375,1280}` (T3-07), `favoris-premium-{375,768,1280}` (T3-06), fiches vanne, conseil et vidéo, /abonnement, /carnet, /glossaire, /a-propos à 375 et 1 280 (T3-01), `fenetre-premium-visiteur-375`.
- 320 px : `*-visiteur-320` des pages à bouton prix (accueil, abonnement, vannes, conseils, vidéos, 3 fiches, carnet, glossaire, à propos).
- `admin-{semaine,abonnes-premium,abonnes-lettre}-{375,1280}` : T3-08.

Total tour 4 : 55 captures pleine page ou écran, sans découpes. PNG 256 couleurs.
