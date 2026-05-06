# Lessons Learned — Archive

> Entries archived from docs/lessons-learned.md (P2 appliques, > 5 sessions)

## Session 01/04/2026 (archived 06/05/2026 — toutes propagées, > 5 sessions)

| Session | Date | Catégorie | Sévérité | Description (résumé) | Statut |
|---------|------|-----------|----------|----------------------|--------|
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | Doubles posts crons : instrumentation.ts dupliquait logique des crons HTTP | fait+propagé |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | GCS signed URLs impossibles sur Replit (ADC sans private_key) | fait+propagé |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | IndexNow : fallback hardcodé différent de la clé env → rejet silencieux Bing | fait+propagé |
| 01/04 | 01/04/2026 | 1. Problème corrigé | P0 | Middleware www :5904 — req.url contient port interne Replit. 1 semaine SEO perdue | fait+propagé |
| 01/04 | 01/04/2026 | 8. Préférence fondateur | P0 | Insistance fondateur = signal P0 absolu | fusionné dans L31 (07/04) |

## Session 07/04/2026 (archived 06/05/2026 — toutes propagées, > 5 sessions)

| Session | Date | Catégorie | Sévérité | Description (résumé) | Statut |
|---------|------|-----------|----------|----------------------|--------|
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Daily-social compteur global : Twitter bloquait LinkedIn/Instagram | fait+propagé |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Buffer 429 retry loop infini + flood emails | fait+propagé |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Instagram URLs pointaient vers REPLIT_DEV_DOMAIN au lieu de prod | fait+propagé |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P0 | Vannes sans punchline passaient validation IA seule | fait+propagé |
| 07/04 | 07/04/2026 | 2. Insistance utilisateur | P0 | Insistance du fondateur = signal P0 absolu (FUSIONNÉ L31) | fait+propagé |
| 07/04 | 07/04/2026 | 1. Problème corrigé | P1 | searchParams dans Server Component force render dynamique | fait+propagé |
| 07/04 | 07/04/2026 | 8. Préférence fondateur | P0 | Refus upgrade payant tant que code peut tenir plan gratuit | fait+propagé |

## Session 26/03/2026 (archived 03/05/2026)

| Session | Date | Categorie | Severite | Description | Correction appliquee | Statut |
|---------|------|-----------|----------|-------------|---------------------|--------|
| 26/03 | 26/03/2026 | 4. Biais detecte | P2 | Premier fix Instagram utilisait `"post"` (string) au lieu de `post` (enum GraphQL) | Corrige en enum apres recherche doc | applique |
| 26/03 | 26/03/2026 | 5. Pattern efficace | P2 | Parallelisation 4 agents (3 @seo + 1 @fullstack) pour 3 articles + cleanup simultanement | — | applique |
| 26/03 | 26/03/2026 | 8. Preference fondateur | P2 | Thomas veut comprendre le "pourquoi" avant le "quoi" — diagnostic complet pas juste reponse binaire | — | applique |
