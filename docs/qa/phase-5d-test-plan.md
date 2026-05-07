# Phase 5.D — Plan de tests Jest exhaustifs (Agent CEO autonome)

**Date** : 07/05/2026 (session 10)
**Auteur** : @qa
**Branche cible** : `claude/marrant-s10-session-recovery-CtZyw`
**Statut** : PLAN — pas d'exécution avant pré-requis Thomas validés.

---

## 1. TL;DR

- **Objectif** : 90% coverage par fichier sur 8 modules CEO produits sessions 8–9, **zéro régression** sur les 1051 tests baseline.
- **Périmètre** : 1 router (1388L `ceo-agent.ts`), 1 helpers (589L), 1 footer email HMAC (162L), 1 backlinks (235L), 1 client Twitter (270L), 1 webhook Resend (232L), 6 API admin, 6 composants dashboard.
- **6 groupes priorisés** : 3 P0 (router, sécurité HMAC/opt-out, gates G-CEO1-4), 2 P1 (helpers/KPI, intégrations), 1 P2 (admin/UI).
- **Effort total estimé** : ~310 tests Jest, **~3-4 jours fullstack** sur Replit (cf. estimation détaillée §6).
- **Pré-requis bloquants** : (a) merge s9 → master + redeploy Replit, (b) `npx prisma migrate deploy` (5_add_ceo_tables), (c) 12 secrets Replit configurés (cf. mémo s9 §Actions Thomas), (d) pre-commit check OK (`tsc --noEmit && next lint && npm run build`).
- **Rappel pivot s9** : @reviewer dédié remplacé par cross-review orchestrator (commandement n°4 étendu). Les 3 risques cross-review s9 (`cde7430`) sont intégrés ci-dessous comme cas de tests obligatoires.

---

## 2. Inventaire des modules

| # | Module | Chemin | LoC | Crit. | Scénarios à couvrir | # tests | Mocks principaux |
|---|--------|--------|-----|-------|---------------------|---------|------------------|
| 1 | `ceo-agent.ts` (router + draft + tick) | `apps/web/src/lib/ai/agents/ceo-agent.ts` | 1388 | **P0** | runDailyTick, routeCeoTask (5 handlers), triageOpportunity, composeOutboundMessage, dualPassValidate, draftBacklinkPitch, budget hard stop, dry-run, kill-switch, lock | ~80 | Anthropic SDK, Prisma, validateCeoOutbound, Resend, Twitter, footer |
| 2 | `ceo-helpers.ts` | `apps/web/src/lib/ai/ceo-helpers.ts` | 589 | **P0** | lookupJoke, lookupResource, getCeoMemory/setCeoMemory, isCeoEnabled, applyFrequencyCap, checkAndStoreDedup, hashPii/maskPii, recordAudit, acquireCeoLock/releaseCeoLock, markCeoTouchpoint, getOrCreateLead, snapshotCeoKpis | ~55 | Prisma, crypto |
| 3 | `ceo-email-footer.ts` | `apps/web/src/lib/email/ceo-email-footer.ts` | 162 | **P0** | generateUnsubscribeToken (HMAC-SHA256), verifyUnsubscribeToken, buildUnsubscribeUrl, enforceEmailFooter (HTML + text), idempotence (double appel) | ~25 | crypto, env vars |
| 4 | `ceo-backlinks.ts` | `apps/web/src/lib/ai/ceo-backlinks.ts` | 235 | **P1** | CEO_BACKLINK_TOPICS (94), CEO_TEAM_BIO, CEO_BACKLINK_TEMPLATES (8 par source), isRelevantBacklinkOpportunity, scoreBacklinkRelevance | ~25 | Aucun (pure logic) |
| 5 | `twitter-client.ts` | `apps/web/src/lib/social/twitter-client.ts` | 270 | **P1** | postTweet, postReply, postThread, getTweetMetrics, OAuth signature, isTwitterConfigured, fetch errors (401/403/429/500) | ~25 | global fetch, env vars |
| 6 | `webhooks/resend-inbound/route.ts` | `apps/web/src/app/api/webhooks/resend-inbound/route.ts` | 232 | **P0** | verifyResendSignature (HMAC), detectOptOut (11 keywords FR/EN), POST happy/reject, GET healthcheck | ~30 | crypto, NextRequest, Prisma |
| 7 | 6 API admin (`approve`, `reject`, `contest`, `data`, `kill-switch`, `run-task`) | `apps/web/src/app/api/admin/ceo/*` | ~600 cumulé | **P2** | auth (admin only), 401/403, validation payload, success path, error path, idempotence | ~36 (6/route) | Prisma, auth helper, ceo-agent |
| 8 | 6 composants restants dashboard | `apps/web/src/components/admin/ceo/*` | ~500 cumulé | **P2** | rendu, props, états (empty/loading/error), interactions, sparklines SVG | ~30 (5/composant) | RTL, fetch mocks |

**Total estimé** : ~306 tests à écrire.

---

## 3. Stratégie de mock

| Dépendance | Pattern Jest recommandé | Justification |
|------------|------------------------|---------------|
| **Anthropic SDK** (`@anthropic-ai/sdk`) | `jest.mock("@anthropic-ai/sdk", () => ...)` avec `messages.create` mocké pour retourner `{ content: [{ type: "text", text: JSON.stringify(...) }], usage: { input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens }}`. Helper `mockAnthropicResponse(payload)` à factoriser dans `__tests__/helpers/anthropic-mock.ts`. | Le router CEO appelle Haiku/Opus en cascade (triage → compose → dualPass → publish). Mocks par étape pour tester chaque branche. |
| **Prisma** | `jest.mock("@/lib/prisma")` avec mock factory (cf. pattern existant `__tests__/lib/standup-director-haiku.test.ts`). Modèles à mocker : `ceoOutboundMessage`, `ceoBacklink`, `ceoLead`, `ceoMemory`, `ceoConfig`, `ceoAuditLog`, `ceoKpiSnapshot`, `ceoLock`, `socialPostDailyLock`, `jokeLike`, `joke`, `tip`, `video`, `path`, `blogArticle`, `user`. | Tests unitaires pas tests d'intégration BDD — Phase 5.D ne valide pas les migrations, juste la logique applicative. |
| **Resend** | `jest.mock("resend", () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send: jest.fn().mockResolvedValue({ id: "re_test_xxx" }) } })) }))`. | Pas d'envoi réel. Vérifier appel + payload (footer présent, signature, To/From). |
| **Twitter v2** | `global.fetch = jest.fn()` (fetch natif). Helpers `mockFetchOk(body)` / `mockFetchError(status, body)`. | `twitter-client.ts` n'utilise plus la SDK twitter-api-v2 (-400KB), juste `fetch`. |
| **Buffer** (référence — pas en scope direct s10 mais peut être appelé indirectement) | `jest.mock("@/lib/social/buffer-client")`. | Le router CEO peut déclencher des publications. À mocker pour ne pas confondre avec tests `daily-publisher`. |
| **Crypto** | Ne PAS mocker — utiliser le vrai module Node `crypto` pour valider HMAC réel. Mocker uniquement `Date.now()` via `jest.useFakeTimers()` quand expiration testée. | HMAC-SHA256 doit être testé bout en bout (sinon bug masqué). |
| **NextRequest / NextResponse** | Pattern source-integrity inline (cf. `__tests__/api/admin-llm-usage-api.test.ts`) : reproduire la logique route inline pour contourner le polyfill manquant en environnement Jest. | Pattern déjà éprouvé s8. |
| **Env vars** | `beforeEach` : `process.env.UNSUBSCRIBE_HMAC_SECRET = "test-secret-..."`, `RESEND_WEBHOOK_SECRET`, `TWITTER_BEARER_TOKEN`, `CEO_BUDGET_HARD_STOP_EUR=4`, `CEO_DRY_RUN=true|false`, `CEO_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`. `afterEach` : restore. | Test isolation. |
| **Logger** (`pino`) | `jest.mock("@/lib/logger")` avec spy sur `info/warn/error`. | Vérifier les logs critiques (kill-switch déclenché, gate fail, budget atteint). |

---

## 4. Plan d'attaque par groupes priorisés

### Groupe 1 — P0 critique : `ceo-agent.ts` router runDailyTick

**Cible** : `apps/web/src/lib/ai/agents/ceo-agent.ts` lignes 640-1378.

**Scénarios obligatoires** :

1. **`runDailyTick` happy path** : `isCeoEnabled=true`, `acquireCeoLock=true`, 1 task pending, route OK → 1 processed, 0 errors, lock libéré.
2. **Kill-switch ON** (`CeoConfig.killSwitch=true`) : early return, 0 processed, audit log "killSwitch" écrit.
3. **Kill-switch fail-safe** : `CeoConfig` ligne absente → comportement = OFF (fail-safe = autoriser `killSwitch=true` par défaut). Cf. action Thomas s9 §8 "kill-switch OFF par défaut" — TESTER les deux interprétations et documenter celle retenue.
4. **Lock déjà acquis** (`acquireCeoLock=false`) : early return, 0 processed, log "tick déjà en cours".
5. **Budget hard stop atteint** : `LlmUsageLog` cumul du jour ≥ `CEO_BUDGET_HARD_STOP_EUR=4` → skip toutes tasks, audit "budgetHardStop", alert email admin si pas déjà envoyé aujourd'hui.
6. **Budget alert** (≥3€ mais <4€) : task continue, mais log warn "budgetAlert" + 1 email admin par jour max.
7. **Dry-run mode** (`CEO_DRY_RUN=true`) : router exécute la logique mais SKIP les `Resend.emails.send`, `twitter-client.postTweet`, `prisma.ceoOutboundMessage.update(status=PUBLISHED)`. Audit "dryRun" présent.
8. **Routage par taskType** (5 handlers) : `OUTBOUND_EMAIL` → `handleOutboundEmail`, `BACKLINK_PITCH` → `handleBacklinkPitch`, `WEEKLY_REPORT` → `handleWeeklyReportTask`, `KPI_REFRESH` → `handleKpiRefreshTask`, `OUTBOUND_DM` → `handleOutboundDm`.
9. **Task type inconnu** : log error, audit "unknownTaskType", continue avec les autres tasks.
10. **Erreur dans 1 handler** : isole l'erreur, incrémente errors, continue avec les tasks suivants. Lock libéré dans `finally`.
11. **Validation Director REJECTED** (gate fail) : message `status=REJECTED`, audit "directorReject" avec gate failed, pas d'envoi, pas de coût Resend/Twitter.
12. **Frequency cap** : `applyFrequencyCap` retourne true (cap atteint) → skip task, audit "frequencyCapHit".
13. **Dedup hit** : `checkAndStoreDedup` retourne true (déjà envoyé) → skip task, audit "dedupHit".
14. **Time gate interne** : runDailyTick appelé hors fenêtre 2-4h UTC → skip, log "timeGateMiss".
15. **Concurrency `SocialPostDailyLock`** : si pour la même date, `tryLock` échoue → skip task, log warn.

**triageOpportunity / composeOutboundMessage / dualPassValidate** :
- Schema Zod parsing fail (Anthropic réponse malformée) → throw + audit "schemaInvalid".
- `composeOutboundMessage` respecte `CHANNEL_CHAR_LIMITS[channel]` (EMAIL/BACKLINK_EMAIL/DM/COMMENT/REPLY) — tester dépassement (Anthropic réponse > limite) → reject avant publish.
- `dualPassValidate` : 1er pass Haiku PASS → 2e pass Opus optionnel selon politique. 1er pass FAIL → reject immédiat sans 2e pass (économie tokens).

**# tests estimés** : ~80.

### Groupe 2 — P0 sécurité : HMAC + opt-out

**Cibles** :
- `ceo-email-footer.ts` (HMAC-SHA256 unsubscribe token).
- `webhooks/resend-inbound/route.ts` (HMAC verify + opt-out 11 keywords).

**Scénarios obligatoires `ceo-email-footer.ts`** :

1. **`generateUnsubscribeToken(email)`** : retourne string `<base64email>.<hmac>`, format stable, longueur ~64-80 char.
2. **Round-trip** : `verifyUnsubscribeToken(generateUnsubscribeToken(email)) === email`.
3. **Token altéré** (1 char modifié dans HMAC) → `verifyUnsubscribeToken` retourne `null`.
4. **Token altéré** (1 char modifié dans email base64) → `null`.
5. **Token avec autre secret** (mock `UNSUBSCRIBE_HMAC_SECRET` différent à la vérif) → `null`.
6. **Email avec caractères spéciaux** (`+tag`, accents `é`, espaces encodés) → round-trip OK.
7. **Email vide** → throw ou retour structuré (à documenter).
8. **`UNSUBSCRIBE_HMAC_SECRET` absent** → throw clair "missing env var".
9. **`buildUnsubscribeUrl`** : URL absolue `https://deviens-marrant.fr/unsubscribe?token=...`, encodage URI safe.
10. **`enforceEmailFooter` HTML** : footer ajouté si absent, idempotent (double appel = 1 footer), contient lien unsub valide.
11. **`enforceEmailFooter` text** : version plain-text, lien unsub présent.
12. **Adversarial** : HTML body avec `<script>`, accents, emoji 🏠, body de 100KB → footer ajouté sans corruption.
13. **MINEUR cross-review s9** : token sans expiration → documenter comme "limitation acceptée s9", AJOUTER test `// TODO s11: ajouter expiration timestamp dans payload + verify within window`.

**Scénarios obligatoires `resend-inbound/route.ts`** :

14. **POST sans signature** → 401.
15. **POST signature invalide** → 401.
16. **POST signature valide + opt-out keyword** → 200, `User.emailOptedOut=true` ou `CeoLead.optedOut=true`, audit "optOutInbound".
17. **POST signature valide + reply standard** (pas opt-out) → 200, lead.lastReplyAt mis à jour.
18. **detectOptOut** : 11 keywords obligatoires (cf. cross-review s9 risque MOYEN). Liste à valider depuis le code, mais minimum FR : "désabonner", "désabonnement", "ne plus recevoir", "stop", "retirer", "supprimer". EN : "unsubscribe", "remove", "opt out", "opt-out", "stop". Tester chaque keyword.
19. **Faux positifs G-CEO3 cross-review** : phrases comme "je désespère pas de réussir" (contient "désespère" pas "désabonner"), "stoppé hier" (passé composé pas commande), "je ne reçois plus rien" (négation simple). DOIVENT NE PAS déclencher opt-out.
20. **Email auto-reply** (`X-Autoreply: yes` ou `auto-submitted: auto-replied`) → ignoré silencieusement, pas de mise à jour lead.
21. **Email bot** (DKIM `noreply@`, Mailer-Daemon) → ignoré.
22. **GET healthcheck** → 200 `{ status: "ok" }`.
23. **HMAC timing-safe** : utiliser `crypto.timingSafeEqual`. Tester qu'une comparaison `===` directe n'est PAS utilisée (lecture du code + assertion).

**# tests estimés** : ~55.

### Groupe 3 — P0 gates : G-CEO1, G-CEO2, G-CEO3, G-CEO4

**Cible** : `apps/web/src/lib/ai/agents/standup-director-agent.ts` lignes 2463-2680 (déjà couverte partiellement par `__tests__/lib/standup-director-haiku.test.ts` — vérifier coverage actuelle, étendre).

**Scénarios obligatoires** :

1. **G-CEO1 PASS** : email contient "L'Équipe Deviens Marrant" en signature → PASS.
2. **G-CEO1 FAIL signature manquante** : email termine par "Cordialement," sans signature équipe → REJECTED.
3. **G-CEO1 FAIL signature interdite** : email signé "Alex" / "Thomas" / "L'équipe Marrant" (pas "Deviens Marrant") → REJECTED.
4. **G-CEO1 channel non-email** (DM/COMMENT/REPLY) : gate ne s'applique pas → PASS.
5. **G-CEO2 PASS** : message sans aucun nom de persona interne.
6. **G-CEO2 FAIL** : message contient "Yanis", "Sophie", "Marc" (réutilise `INTERNAL_PERSONA_NAMES`) → REJECTED.
7. **G-CEO2 cas limite** : "Sophie Marceau" (homonyme actrice) → comportement à documenter (probablement REJECTED par sécurité, à valider).
8. **G-CEO3 PASS** : zéro mention IA.
9. **G-CEO3 FAIL keywords directs** : "intelligence artificielle", "IA", "AI", "GPT", "Claude", "automatisé", "bot", "agent IA", "chatbot", "LLM" → REJECTED.
10. **G-CEO3 FAUX POSITIFS** (risque MOYEN cross-review s9 `cde7430`) : DOIT NE PAS REJETER :
    - "j'ai automatiquement pensé à toi" (contient "automati" mais pas mention IA)
    - "Mais bon, c'est la vie" (contient "bot" dans "robot" non, juste vérifier)
    - "agent immobilier" (contient "agent" mais pas "agent IA")
    - "AI" comme initiales de nom propre (Anaïs Iverson) → cas limite à documenter
    - "iA" lowercase au milieu d'un mot (e.g. "raIson") → ne doit PAS matcher
    - **Test obligatoire** : pour chaque keyword bloquant, écrire 2 phrases qui CONTIENNENT le pattern textuel mais ne sont PAS une mention IA. Si gate REJETTE → bug à corriger en s10. Si gate PASSE → PASS.
11. **G-CEO4 PASS** : DM/COMMENT/REPLY avec pattern invitation `"Si tu veux, j'ai un parcours là-dessus, je peux t'envoyer le lien ?"` (sans markdown).
12. **G-CEO4 FAIL** : DM contient `[→ deviens-marrant.fr/parcours/X]` ou `https://deviens-marrant.fr/...` inline → REJECTED.
13. **G-CEO4 channel email** : pattern invitation pas obligatoire → PASS.
14. **Combinaison gates** : message qui fail G-CEO1 ET G-CEO3 → 1 seul reject suffit, audit log liste les 2 gates failed.
15. **Dual-pass après gates** : si gates programmatiques PASS → pass à dualPassValidate Haiku→Sonnet. Mocks Haiku PASS + Sonnet PASS = OK final.

**# tests estimés** : ~30.

### Groupe 4 — P1 data : `ceo-helpers.ts` + `snapshotCeoKpis`

**Scénarios obligatoires** :

1. **`lookupJoke({ tag, excludeIds })`** : retourne joke matching, exclut IDs déjà envoyés, ordre random stable testable via mock.
2. **`lookupResource({ type })`** : 4 types (`tip`, `video`, `path`, `blogArticle`) → 4 tests, retour `CeoResource[]`.
3. **`getCeoMemory<T>(key, defaultValue)`** : type generic, fallback si absent, parse JSON.
4. **`setCeoMemory<T>(key, value)`** : upsert, sérialisation Prisma.InputJsonValue.
5. **`isCeoEnabled`** : `CeoConfig.killSwitch=false` → true, `=true` → false, ligne absente → comportement fail-safe (à documenter).
6. **`applyFrequencyCap(leadId, channel, capPerDay)`** : compte messages 24h, retourne true si ≥cap.
7. **`checkAndStoreDedup(contentHash)`** : insère, retourne true si collision.
8. **`hashPii / maskPii`** : email `alex@example.com` → mask `a***@e******.com`, hash SHA-256 stable.
9. **`recordAudit`** : insère ligne `CeoAuditLog`, gère error sans throw (logging seulement).
10. **`acquireCeoLock(key, ttlMs)`** : succès, échec si lock actif, expiration TTL.
11. **`releaseCeoLock`** : delete, idempotent (release sans lock = no-op).
12. **`markCeoTouchpoint(userId)`** : update User.lastCeoTouchpointAt.
13. **`getOrCreateLead(email|userId)`** : crée si absent, retourne existant sinon, dedup par email.
14. **`snapshotCeoKpis`** : agrège métriques jour J → ligne `CeoKpiSnapshot`. Tester :
    - emailsSent / emailsOpened / emailsReplied
    - dmsSent / dmsReplied
    - backlinksAcquired
    - leadsCreated / leadsActive (lastReplyAt < 30j)
    - **siteReturn48h** (P1 ouvert s9 — actuellement câblage manquant) → test PLACEHOLDER avec assertion `// TODO Phase 5.B.3 : câbler Umami siteReturn48h` + skip if not implemented.
    - tokensCostEur (somme LlmUsageLog du jour, model=Haiku/Opus)
15. **Adversarial dataset** : input avec accents, emoji, NaN, dates 29 fév, fuseaux horaires Pacifique/UTC.

**# tests estimés** : ~55.

### Groupe 5 — P1 intégrations : `twitter-client.ts` + `ceo-backlinks.ts`

**Scénarios `twitter-client.ts`** :

1. **`isTwitterConfigured`** : env vars présentes → true, manquantes → false.
2. **`postTweet(text)` happy** : fetch POST `/2/tweets`, 201 → tweet ID.
3. **`postTweet` 401** : token invalide → throw clair.
4. **`postTweet` 403** : permissions manquantes → throw.
5. **`postTweet` 429** : rate limit → throw avec header `x-rate-limit-reset`.
6. **`postTweet` 500** : erreur serveur Twitter → throw.
7. **`postTweet` text vide / >280 char** : throw avant fetch.
8. **`postReply(tweetId, text)`** : payload `reply.in_reply_to_tweet_id`.
9. **`postThread([t1, t2, t3])`** : 3 tweets chaînés, 2e en reply au 1er, 3e en reply au 2e.
10. **`getTweetMetrics(tweetId)`** : GET `/2/tweets/:id?tweet.fields=public_metrics`, parse `TweetMetrics`.
11. **OAuth signature** (`generateOAuthSignature`, `buildAuthHeader`) : signature HMAC-SHA1 reproductible (test vector RFC 5849).
12. **`percentEncode`** : RFC 3986 (`!*'()` non-encodés, espaces → `%20`).
13. **Network error** (`fetch rejects`) : throw, log error.

**Scénarios `ceo-backlinks.ts`** :

14. **`CEO_BACKLINK_TOPICS`** : longueur exacte (94, vérifié s10 — discordance vs mémo s9 corrigée), tous strings non vides, pas de doublons.
15. **`CEO_TEAM_BIO`** : non vide, conforme voix Marrant (pas de "je", "L'Équipe Deviens Marrant").
16. **`CEO_BACKLINK_TEMPLATES`** : 8 templates par source (vérifier exhaustivité par source : SUBSTACK, MEDIUM, REDDIT, etc.).
17. **`isRelevantBacklinkOpportunity(input)`** : matching keywords humour FR, score ≥ seuil → true.
18. **`scoreBacklinkRelevance`** : returns 0-100, plus haut = plus pertinent. Test cases : opportunité parfaite (humour FR + audience cible) = ≥80, opportunité hors-sujet = ≤20.

**# tests estimés** : ~50.

### Groupe 6 — P2 admin : 6 API routes + 6 composants

**API admin** (pattern source-integrity inline cf. `__tests__/api/admin-llm-usage-api.test.ts`) :

1. **`/api/admin/ceo/approve`** : POST, auth admin, body `{ messageId }`, set status=APPROVED, declenche envoi Resend/Twitter via runDailyTick. 401 sans auth, 403 si user pas admin, 404 si messageId inconnu.
2. **`/api/admin/ceo/reject`** : POST `{ messageId, reason }`, status=REJECTED.
3. **`/api/admin/ceo/contest`** : POST `{ messageId, reasoning }`, status=CONTESTED, déclenche re-validation par Director avec contexte.
4. **`/api/admin/ceo/data`** : GET, retourne dashboard data (drafts, audit logs, KPIs, leads).
5. **`/api/admin/ceo/kill-switch`** : POST `{ enabled: boolean }`, update CeoConfig.killSwitch, audit "killSwitchToggle".
6. **`/api/admin/ceo/run-task`** : POST `{ taskType }`, lance manuellement un handler (bypass scheduler), pour debug.

**Composants** (Jest + RTL, mocks `useFetch`/SWR si présent) :

7. **`CeoAuditLog.tsx`** : empty, loading, error, list rendering, filtre par level (info/warn/error).
8. **`CeoBacklinksList.tsx`** : empty, list rendering, score affiché, status badges.
9. **`CeoDraftsList.tsx`** : empty, list, boutons Approve/Reject/Contest cliquables, callback déclenché.
10. **`CeoFunnel.tsx`** : sparklines SVG (vérifier `<svg>` rendu avec bons paths), data vide → placeholder.
11. **`CeoHeader.tsx`** : kill-switch toggle, badge dry-run mode, budget consommé jour.
12. **`CeoKpiPanel.tsx`** : 6 KPIs, sparklines 7j, fallback "—" si KPI null.
13. **`CeoTasksList.tsx`** : list, run-task button.

**# tests estimés** : ~66 (36 API + 30 UI).

---

## 5. Edge cases obligatoires (cross-cutting)

| # | Edge case | Modules concernés | Origine |
|---|-----------|-------------------|---------|
| 1 | **Token HMAC unsubscribe sans expiration** | ceo-email-footer | Cross-review s9 MINEUR — accepté s9, à corriger s11. Test = annotation `// TODO s11`. |
| 2 | **Haiku cache 1278 < 2048 min** | ceo-agent (composeOutboundMessage) | Cross-review s9 MINEUR — cache prompt < seuil Anthropic 2048 tokens. Tester que `cache_read_input_tokens` est observé OU documenter limitation. |
| 3 | **Race conditions** | ceo-agent + helpers | `SocialPostDailyLock` (P1 résolu s9) + `JobLock` ceo-tick : 2 ticks parallèles → 1 seul process, l'autre skip. |
| 4 | **Neon cold start retry** | ceo-helpers (Prisma) | P1 ouvert s8/04 — Prisma timeout sporadique sur plan Neon gratuit. Test = mocker `prisma.x.findFirst` avec rejet 1ère fois (`P1001 Can't reach`) + succès 2ème = retry OK. Si pas de retry implémenté → REGRESSION test placeholder. |
| 5 | **LinkedIn JSON conformité plan éditorial** | (hors scope strict 5.D — plan éditorial social, pas CEO) | P1 ouvert s8/04 — LinkedIn 5j/sem code vs 3j/sem JSON. Test = lire `apps/web/src/data/social-editorial-plan.json` + grep `linkedin` → compter jours, comparer avec helper code. Conformité bloquante. |
| 6 | **Faux positifs G-CEO3** | standup-director-agent | Cross-review s9 MOYEN — cf. Groupe 3 §10. Bug bloquant si fail. |
| 7 | **Adversarial inputs** | TOUS modules acceptant input texte | Voix CEO doit gérer : accents, emoji, HTML/JS injection, texte vide, texte 100KB. |
| 8 | **Time zone** | snapshotCeoKpis, lookupJoke (date de blague du jour) | Tester UTC vs Europe/Paris. Snapshot doit être en heure UTC pour cohérence cron. |
| 9 | **Budget hard stop = 4€** mais env var modifiée | ceo-agent | Si `CEO_BUDGET_HARD_STOP_EUR=10` → seuil suit, pas hardcodé. |
| 10 | **Kill-switch fail-safe** | ceo-helpers (`isCeoEnabled`) | Doc s9 §8 dit "kill-switch OFF par défaut (fail-safe)" — DOCUMENTER : OFF par défaut signifie agent DÉSACTIVÉ ou ACTIVÉ ? Lire le code, fixer en test. |

---

## 6. Estimation effort

| Groupe | Priorité | # tests | Durée fullstack (Replit) | Justification |
|--------|----------|---------|--------------------------|---------------|
| 1 — runDailyTick router | P0 | 80 | 1 jour | Module 1388L, beaucoup de mocks Anthropic + Prisma à orchestrer, branches multiples. |
| 2 — HMAC + opt-out | P0 | 55 | 0.5 jour | Logique pure (HMAC) + 1 route Next.js (resend-inbound), patterns réutilisables. |
| 3 — Gates G-CEO1-4 | P0 | 30 | 0.5 jour | Étendre tests existants standup-director-haiku.test.ts. Faux positifs = travail manuel d'écriture cas. |
| 4 — Helpers + KPIs | P1 | 55 | 0.5 jour | 22 fonctions, beaucoup de helpers Prisma simples. |
| 5 — Twitter + Backlinks | P1 | 50 | 0.5 jour | Twitter = mocks fetch standard. Backlinks = pure logic. |
| 6 — Admin API + composants | P2 | 66 | 1 jour | 6 routes + 6 composants RTL. Pattern répétitif mais volume. |
| **Total** | — | **~336** | **~4 jours** | Inclut écriture + debug + coverage validation, exclut migration Prisma deploy (pré-requis Thomas). |

**Hypothèse productivité** : 1 fullstack IA en autopilot, ~80 tests/jour quand patterns stabilisés (Groupe 1 plus lent par complexité router). Si Replit pre-commit lent (build 5 min), prévoir +20%.

---

## 7. Définition de succès (Gates G26 + G27 spécifiques 5.D)

**Critères PASS pour clôturer Phase 5.D** :

1. **Coverage ≥ 90%** par fichier (lines + branches + functions) sur les 8 modules listés §2. Mesure via `jest --coverage --collectCoverageFrom='apps/web/src/lib/ai/agents/ceo-agent.ts'` (et autres).
2. **Coverage ≥ 80%** sur les 6 composants UI (les sparklines SVG sont moins critiques).
3. **0 régression** : 1051 tests baseline + ~336 nouveaux = ~1387 tests total, tous PASS.
4. **Tous les gates G-CEO1-4 testés en PASS ET en FAIL** (matrice complète 4 gates × 2 cas = 8 scénarios minimum, plus les variantes faux positifs).
5. **Mutation testing Stryker** sur ceo-email-footer.ts + verifyResendSignature : score ≥ 70%. Module HMAC = critique sécurité, mutation testing obligatoire.
6. **Tests adversarial** : pour chaque module acceptant texte utilisateur (resend-inbound, ceo-helpers maskPii, ceo-agent compose), au moins 3 inputs adversariaux PASS (emoji, accents, 100KB).
7. **Pre-commit pipeline** : `tsc --noEmit && next lint && jest` passe en local Replit < 10 min.
8. **Risque MOYEN cross-review s9 (faux positifs G-CEO3) résolu** : tous les cas de §Groupe 3 §10 PASS. Si fail → bug bloquant à corriger AVANT clôture.
9. **Matrice de traçabilité** : `docs/qa/TESTING.md` mise à jour avec mapping module → fichier(s) de tests Jest correspondant. Gate G27.
10. **Lecture visuelle dashboard `/admin/ceo`** : screenshots Playwright à prendre sur 3 devices (Desktop, iPad, iPhone) — 6 composants × 4 états (default/loading/empty/error) — comparaison baselines `tests/screenshots/`. Si baselines absentes → première exécution crée + review humain Thomas obligatoire. Gate G26.

**Critères FAIL (régression bloquante)** :

- Coverage < 90% sur 1 des 4 modules P0 (ceo-agent, ceo-helpers, ceo-email-footer, resend-inbound).
- Régression sur 1 test baseline (1051) → investiguer cause racine, ne pas masquer.
- Faux positif G-CEO3 confirmé non corrigé → bug bloquant.
- Mutation score HMAC < 70% → tests trop laxistes, à durcir.

---

## 8. Handoff @fullstack

**Pré-requis Thomas (BLOQUANTS avant exécution)** :

1. Merge `claude/marrant-s9-conformite-gouvernance-zwLbC` dans master + redeploy Replit (cf. mémo s9 #1).
2. `cd apps/web && npx tsc --noEmit && npx next lint && npm run build` PASS sur Replit.
3. `cd apps/web && npx prisma generate && npx prisma migrate deploy` (applique `5_add_ceo_tables`).
4. 12 secrets Replit configurés (cf. mémo s9 #4) — essentiels pour 5.D : `UNSUBSCRIBE_HMAC_SECRET`, `RESEND_WEBHOOK_SECRET`, `TWITTER_BEARER_TOKEN`, `CEO_BUDGET_HARD_STOP_EUR=4`, `CEO_DRY_RUN=true`, `CEO_ADMIN_EMAIL`. **En tests Jest, des valeurs fictives suffisent** mais elles doivent être **présentes** sinon `getUnsubscribeHmacSecret()` throw.
5. Insérer ligne singleton `CeoConfig` (kill-switch=false par défaut, cf. mémo s9 #8) — pour tests d'intégration.
6. Activer pre-commit hook : `git config core.hooksPath .githooks` (1× par poste).

**Groupes prêts à exécuter en autonomie (ordre recommandé)** :

1. **Groupe 2** (HMAC + opt-out) — démarrer ici car logique pure, pas de mocks Anthropic, valide la stratégie de sécurité critique. **0.5 jour**.
2. **Groupe 3** (Gates G-CEO1-4) — étendre tests existants `standup-director-haiku.test.ts`. **0.5 jour**.
3. **Groupe 4** (Helpers + KPIs) — modules sans dépendance LLM, échauffement avant Groupe 1. **0.5 jour**.
4. **Groupe 1** (runDailyTick router) — ÉTAPE LA PLUS LOURDE. Mocks Anthropic en cascade. **1 jour**.
5. **Groupe 5** (Twitter + Backlinks) — modules indépendants. **0.5 jour**.
6. **Groupe 6** (Admin API + composants) — finalisation, pattern répétitif. **1 jour**.

**Décisions prises (à valider par Thomas si désaccord)** :

- **Pas de tests d'intégration BDD réelle** en 5.D — tous les Prisma calls mockés. Tests d'intégration BDD = Phase 5.B.3 ou session ultérieure (nécessite container Postgres test ou Neon branch dédié).
- **Pas de tests E2E Playwright** sur dashboard `/admin/ceo` en 5.D — gate G26 visuelle déléguée à @fullstack via screenshots Playwright statiques (pas E2E interactif). E2E complet = session ultérieure.
- **Mutation testing limité** à HMAC (ceo-email-footer + verifyResendSignature) — Stryker sur tout le router serait trop coûteux pour 5.D. Étendre à d'autres modules en s11 si budget time permet.
- **P1 LinkedIn JSON conformité** intégré comme test de conformité standalone (Edge case §5 #5) — pas dans Phase 5.D principale, mais bloquant pour clôture.
- **P1 Neon cold start retry** = test placeholder + recommandation implémenter retry helper Prisma (3 tentatives 5s ou keep-alive cron 4min) AVANT clôture.

**Points d'attention** :

- **Variables d'env Jest** : créer `apps/web/jest.setup.ts` (ou étendre existant) avec `process.env` defaults pour secrets fictifs CEO.
- **`jest.resetModules`** OBLIGATOIRE entre tests qui modifient env vars (pattern `setupDirectorWithFlag` existant).
- **NextRequest polyfill** : pattern source-integrity inline (cf. `__tests__/api/admin-llm-usage-api.test.ts`), reproduire la logique de la route directement dans le test.
- **Anthropic mocks centralisés** : créer `apps/web/src/__tests__/helpers/anthropic-mock.ts` (factoring Groupe 1+3+5).
- **Prisma mocks centralisés** : `apps/web/src/__tests__/helpers/prisma-mock.ts` (étendre s'il existe déjà).
- **Faux positifs G-CEO3** = scénario obligatoire **bloquant** — si gate rejette les phrases listées Groupe 3 §10, fixer AVANT de poursuivre.
- **Documentation des résultats** : `docs/qa/TESTING.md` à créer/mettre à jour avec matrice traçabilité (G27).

---

**Handoff → @fullstack**

- Fichiers produits : `docs/qa/phase-5d-test-plan.md` (ce document, ~310L).
- Décisions prises : 6 groupes priorisés (3 P0 / 2 P1 / 1 P2), ~336 tests estimés sur ~4 jours, mutation testing limité à HMAC, pas d'E2E Playwright en 5.D, pas de tests BDD réels (Prisma mocks).
- Points d'attention : démarrer par Groupe 2 (HMAC) puis Groupe 3 (gates) avant Groupe 1 (router lourd). Faux positifs G-CEO3 = bloquant. P1 Neon retry + LinkedIn JSON conformité à intégrer. Pré-requis Thomas (merge s9 + migration deploy + 12 secrets) à valider AVANT toute exécution.
- Statut testing déclaré : `[STATIQUE]` — plan documenté à partir de Read/Grep, aucun test exécuté. Validation `[LIVE]` impossible avant pré-requis Thomas + écriture des tests.
