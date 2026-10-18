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
