# QA v4 des blocs d'appel s21 : concision du tunnel, contre-épreuve finale

> @qa, session 21, 18/10/2026. Branche testée : `claude/marrant-s21-integration` @ `825426b` (worktree `agent-a6072b0ac19da7774`, CI verte annoncée).
> Méthode : celle de la QA v3 (`docs/qa/qa-cta-s21-v3.md`). Sources : `docs/copy/cta-s21/concision/VALIDE.md`, `textes-v5-a/b/c.md`, `fins-articles-v3.md` ; structure : `docs/ux/audit-charge-lecture-s21.md` ; contrôles P6 1 à 15 de `REPLIT_ACTIONS.md`. Captures : `docs/qa/captures-s21-v4/`.
> Marquage : **[LIVE]** = Chromium réel sur le build de production local, sortie observée ; **[STATIQUE]** = lecture du code, Grep ou Jest sans navigateur.

## Verdict

_En cours (rapport partiel)._

| # | Gravité | Défaut | Preuve | Fichier : ligne |
|---|---|---|---|---|

## Conditions du test

- **Environnement vide (P0).** Build, serveur, Jest, tsc, lint, Playwright et scripts de QA lancés par `env -i`, avec seulement les variables factices du job `e2e-local` de `.github/workflows/tests.yml` (`NEXTAUTH_SECRET=secret-factice-e2e-local`, `RESEND_API_KEY=re_factice_e2e`, `STRIPE_PREMIUM_PRICE_ID` et `STRIPE_PREMIUM_ANNUAL_PRICE_ID` factices, `ANTHROPIC_API_KEY=dummy`), plus `PATH`, un `HOME` vide, `CI=true`, `NODE_EXTRA_CA_CERTS` (polices au build) et `PLAYWRIGHT_BROWSERS_PATH`. Aucune clé réelle, aucun e-mail, aucun paiement, aucune requête vers la production ni vers Neon.
- **Build de production local** de `825426b` (`npm run build`, `node .next/standalone/server.js`, port 5570). Base PostgreSQL 16 jetable (port 5571, `scripts/seed.sh` du dépôt), supprimée à la fin. Les 11 articles « à forte frappe » et `se-presenter-avec-humour` n'existent qu'en base de production : 12 lignes `BlogArticle` factices (corps de test, slug réel) ont été posées sur la base jetable pour rendre leur bloc de fin, qui ne dépend que du slug.
- **Profils** : visiteur ; compte sans abonnement (`FREE`, 120 XP) ; abonné (`PREMIUM`), créés sur la base jetable, connectés par `/login`. Largeurs 320, 375 (mobile tactile) et 1280 ; 360 et 1024 pour l'en-tête.
- **Umami et Stripe mockés** (faux `umami.track`, `POST /api/stripe/checkout` intercepté, page Stripe simulée), tout appel hors localhost bloqué. Scripts hors dépôt ; attendus recopiés à la main depuis `textes-v5-a/b/c.md` et `fins-articles-v3.md`, jamais importés du code.

## 1. Textes

_En cours._

## 2. Structure

_En cours._

## 3. Tunnel mocké

_En cours._

## 4. Non-régression

| Contrôle | Résultat |
|---|---|
| `tsc --noEmit -p tsconfig.build.json`, `tsc --noEmit` (complet), `tsc -p playwright/tsconfig.json` | 0 erreur ×3 [LIVE] |
| `next lint` | 0 erreur (avertissements `<img>` préexistants) [LIVE] |
| Jest complet, environnement `e2e-local` | **340 suites, 5 198 tests réussis, 0 échec** (5 ignorés) [LIVE] |
| Contrôles P6 1 à 6, 8, 9, 14, 15 de REPLIT_ACTIONS (curl, visiteur, build local) | Tous à la valeur attendue, **sauf le motif `Reste le repas\.` du contrôle 14 (m-1)** [LIVE] |
| Maillage des murs (contrôle 15) | `/vannes` 12 liens de fiche (12 uniques), `/conseils` 10, `/videos` 12 ; « Page dédiée » 0 ×3 ; « Voir la fiche de cette vanne » 12 [LIVE] |

_Suite en cours._

## 5. Captures

_En cours._

## 6. Lecture à 5 secondes (375 px)

_En cours._

## Ce qui n'a pas été joué en vrai

_En cours._
