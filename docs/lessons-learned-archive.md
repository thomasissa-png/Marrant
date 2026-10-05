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

## Archive clôture s14 (05/10/2026) : P1 faits et propagés, TTL 90 jours

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | … | Statut | Propagation |
|---|---|---|---|---|---|---|---|---|---|
| 08/04 | 08/04/2026 | 7. Performance IA | P1 | Neon DB cold start → Prisma timeout sporadique (plan gratuit suspend après 5min) | s10 : `lib/db-retry.ts` (withDbRetry, retry 3× backoff 500ms→2s sur P1001/erreurs connexion) wrappé sur 1er appel Prisma des crons publish-social, social-analytics, daily-social. ceo-tick déjà résilient (tryAcquireLock silent-fail). | **Pour Replit + Neon free : retry Prisma ciblé connexion (P1001) sur le 1er appel des crons.** | appliqué | propagé |
| 7 | 05/05/2026 | 4. Biais détecté | P1 | Subagents (orchestrator inclus) ne peuvent ni Bash ni git commit/push → friction caller | Caller commit lui-même | **[FRAMEWORK GAP] Documenter limitation subagent. Workaround : orchestrator produit fichiers, caller commit.** | documentation | _base-agent-protocol.md | fait | propagé |
| 8 | 06/05/2026 | 4. Biais détecté | P1 | Cycle 5 d'itération copy = coût élevé tokens (~600k) + fatigue fondateur. ROI réel mais coût acceptable seulement si < 3 cycles. Cycle 6 chirurgical = OK rapide. | Pattern "calibration étalons fondateur AVANT @copywriter" (cf L05 ci-dessus) + cap 5 cycles strict | **Réflexe P0 #3 (audit dual + corpus canonique avant code) doit ENFORCER la calibration étalons en Phase 0. Sans étalons fondateur, l'agent invente une voix.** | règle-globale | _base-agent-protocol.md section "Pattern d'itération qualité dual avant code (P0)" | fait | propagé |
| 9 | 06/05/2026 | 5. Pattern efficace | P1 | Extraction CLAUDE.md → docs/marrant/ par l'orchestrateur lui-même (commandement n°4 exception "maintenance gouvernance") = 1 cycle, pas de sous-agent. Évite friction "subagent ne peut Bash" (P1 s7). | Extension exception commandement n°4 : "maintenance gouvernance (CLAUDE.md, _gates.md, lessons-learned)" ajoutée. | **Pour toute maintenance meta-framework (CLAUDE.md slim, archive context, gates), orchestrator agit directement. Subagent inutile et coûteux pour ce type d'opération.** | règle-globale + commandement n°4 | CLAUDE.md commandement n°4 + orchestrator.md | fait | propagé |
| 10 | 07/05/2026 | 5. Pattern efficace | P1 | Checklist déploiement à 11 actions manuelles Replit = friction décourageante, code qui dort invisible en prod. | Auto-seed config fail-safe + scheduler interne fallback (time gate+lock) + migration données au boot + back-fill progressif. Checklist 11→3. | **Automatiser dans le code tout ce qui est automatisable (seed idempotent, scheduler fallback, cleanup au boot). Réduire l'irréductible manuel aux secrets/credentials/légal.** | fait | propagé (instrumentation + startup-tasks) |
| 10 | 07/05/2026 | 1. Problème corrigé | P1 | Neon free suspend la DB après 5min → crons réveillés sur DB froide → P1001 spam alertes ~3h (P1 ouvert 08/04). | `withDbRetry` retry ciblé P1001/connexion, backoff 500ms→2s, sur appel d'entrée des crons. | **Tout cron sur DB serverless (Neon/PlanetScale free) DOIT wrapper son 1er appel dans un retry connexion — le cold start n'est pas une panne.** | fait | propagé (publish-social, social-analytics, daily-social) |
