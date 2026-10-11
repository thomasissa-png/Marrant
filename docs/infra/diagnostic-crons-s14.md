# Diagnostic crons Cloudflare, s14 (30/09/2026)

> Auteur : @infrastructure. Worker `marrant` (OpenNext 1.15.1), cron `*/15` → `/api/cron/scheduler-tick`.
> Symptôme : depuis la prod CF (08:31 UTC), weekly-seo et daily-content font leurs appels LLM puis n'écrivent ni `BlogArticle` ni `DailyContent`, et relancent à chaque tick.

## 1. Verdict

**Ce n'est PAS une limite des Cron Triggers** : aucune invocation n'est tuée. Trois bugs **déterministes**, rendus perpétuels par le **cache `fetch` de Next 14** : sous Workers, OpenNext stockait dans R2 (1 an) les réponses `POST https://api.anthropic.com/v1/messages` et les **rejouait** d'un tick à l'autre. Chaque tick rejouait donc la même réponse défaillante, échouait au même endroit, relâchait son verrou, et recommençait 15 min plus tard.

## 2. Preuves (collectées le 30/09 entre 10:28 et 11:30 UTC)

| Source | Accès | Constat |
|---|---|---|
| API Workers Observability (`/workers/observability/telemetry/query`) | **refusé** : `Authentication error` (le token `CLOUDFLARE_DM_TOKEN` n'a pas « Workers Observability Read ») | pas d'historique de logs |
| GraphQL `workersInvocationsScheduled` | OK | **65/65 invocations `status=success`** du 29/09 18:30 au 30/09 10:15 ; CPU max **1,06 s** (tick 08:45), 0,12 à 0,41 s pour les suivants |
| GraphQL `workersInvocationsAdaptive` (par minute) | OK | durée réelle des ticks : 08:45 → **318 s**, 09:00 → 25 s, 09:15 → 33 s, 09:30 → 32 s, 10:15 → 192 s. Ni coupure à 30 s CPU, ni à 15 min |
| `wrangler tail marrant --format json` (tick 10:30) | OK | `outcome: ok`, 4,6 s, logs `[scheduler-tick] Tick terminé` |
| Plan du compte (`/subscriptions`) | refusé (droits) | `usage_model: standard` lu sur le script |
| `LlmUsageLog` (Neon, lecture seule) | OK | après 08:51, les appels « réussis » durent **200 à 500 ms** avec tokens et coûts **identiques** aux appels réels de 08:46-08:50 (ex. `generateArticle` 407 ms pour 8 583 tokens de sortie, impossible) |
| Bucket R2 `marrant-next-cache` | OK | 215 objets `.fetch`, dont **93 réponses `api.anthropic.com/v1/messages`** et 4 `api.buffer.com` (`kind FETCH`, `revalidate 31536000`) ; un objet écrit à la milliseconde de chaque appel réel, aucun pour les appels rejoués |

Mécanisme dans Next 14.2.35 (`patch-fetch.js`) : `dynamic = "force-dynamic"` ne positionne que `forceDynamic`. Un `fetch` POST sans en-tête `authorization`/`cookie` (le SDK Anthropic envoie `x-api-key`) tombe en « auto cache », avec `revalidate = false`. Sur Replit, les jobs tournaient depuis `instrumentation.ts`, hors route handler, donc sans cache. Sous Workers, ils tournent dans le route handler `scheduler-tick`.

Limites Cloudflare (Workers payant, vérifiées le 30/09 sur [developers.cloudflare.com/workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/)) : un Cron Trigger à intervalle < 1 h dispose de 30 s de CPU (15 min au-delà d'une heure), avec 15 min de durée (wall time) dans tous les cas. `limits.cpu_ms` (jusqu'à 5 min) ne concerne que les requêtes HTTP. Le CPU mesuré (1,06 s au maximum) en est très loin. **Aucune modification de `limits.cpu_ms` ni de planning cron n'est nécessaire.**

## 3. Causes (chacune reproduite)

1. **weekly-seo** : la 2e génération d'article (avec feedback du directeur) atteint `stop_reason: max_tokens` (9 000 = 5 000 + 4 000 de marge, dont 3 379 de réflexion ; réponse lue dans R2). Le JSON est tronqué, `generateArticle` renvoie `null`, et `publishWeeklyArticle` renvoie `{success:false}` **sans lever**. Le job journalise alors « publié avec succès », relâche le verrou, et le tick suivant rejoue la même réponse depuis le cache.
2. **daily-content** : la réécriture du conseil par le directeur renvoie la clé `"exercice"` au lieu de `"exercise"`. Elle est rejetée pour « champs vides », et le conseil est rejeté. Le repli catalogue filtre ensuite `Tip.category notIn ["BOULOT"]` (valeur de `JokeCategory`, catégorie de la vanne du jour), d'où `PrismaClientValidationError: Invalid value for argument notIn. Expected TipCategory` (reproduit hors ligne avec `PrismaPg`). Cette erreur survient **après** `joke.create`, ce qui explique les 4 vannes orphelines (08:46, 09:01, 09:16, 09:31), l'absence de `DailyContent`, et une nouvelle vanne à chaque tick (le prompt de la vanne change, celui du conseil est rejoué).
3. **Coût réel inférieur au coût enregistré** : 2,78 $ enregistrés sur 24 h, dont **1,22 $ réels** (appels ≥ 2 s) et **1,55 $ fantômes** (rejeux, non facturés par Anthropic ; à confirmer sur la console Anthropic). Chaque redéploiement change le `buildId`, donc vide le cache, d'où un nouveau passage réel à 10:16.

Constat annexe : `LlmUsageLog` contient 9 596 appels en 404 sur `claude-sonnet-4-20250514` du 01/09 au 30/09 08:25 (ancienne instance Replit, non facturés). Cela explique qu'aucun `DailyContent` n'ait été créé entre le 12/09 et le 30/09.

## 4. Correctifs (branche `claude/marrant-s10-session-recovery-CtZyw`, non déployés)

| Commit | Contenu |
|---|---|
| `954ade5` fix(cf) | `open-next.config.ts` : incremental cache R2 enveloppé (`src/lib/cloudflare/no-http-fetch-cache.ts`). Les réponses HTTP (`kind FETCH` avec URL) ne sont jamais écrites ni relues ; ISR et `unstable_cache` sont inchangés. `fetchCache = "force-no-store"` sur les 14 routes `/api/cron/*` |
| `a8c300b` fix(ia) | repli catalogue restreint à l'enum ciblé (`category-exclusion.ts`) ; alias `exercice` (`json-aliases.ts`) ; `ARTICLE_MAX_TOKENS` 8 000 + log si tronqué |
| `03f1a29` feat(cron) | plafond persistant de tentatives, résultat de weekly-seo vérifié, plans mensuels non bloquants |
| `75e1976` feat(ia) | coupe-circuit budget, journalisation obligatoire, client Anthropic en `cache: "no-store"`, quota `/api/ai` |
| `9b46f3f` feat(cron) | interrupteur `CONTENT_GENERATION_ENABLED` (contenu préparé, zéro LLM) |

**Non commité** : `apps/web/wrangler.jsonc` déclare `"CONTENT_GENERATION_ENABLED": "false"`. Le commit a été refusé par le garde-fou de permissions (config de déploiement partagée) ; la modification reste dans l'arbre de travail. Sans cette ligne, le comportement est identique : absent vaut désactivé.

## 5. Garde-fous anti-fuite de tokens (indépendants de la cause)

- **Plafond de tentatives** (`tryConsumeJobAttempt`, `src/lib/job-lock.ts`) : 2 essais maximum par fenêtre, compteur **en base** (`JobLock` `attempt:<job>:<fenêtre>:<n>`, expirant en fin de fenêtre). daily-content et ceo-tick : jour UTC. weekly-seo : semaine ISO. monthly-plan : mois cible. copy-review et daily-social avaient déjà un verrou journalier non relâché. Base indisponible : pas de tentative.
- **Coupe-circuit budget** (`src/lib/ai/budget-guard.ts`), appelé dans `callWithRetry` avant **chaque** `messages.create`, point d'appel unique au SDK (crons, agents, `src/lib/claude.ts` pour `/api/ai`). Somme `LlmUsageLog.costUsd` sur 24 h glissantes ≥ `LLM_DAILY_BUDGET_USD` (défaut 5) ou sur le mois UTC ≥ `LLM_MONTHLY_BUDGET_USD` (défaut 40) : aucun appel, `LlmBudgetExceededError` non retentée, **1 e-mail admin par jour UTC** au maximum (`sendAdminAlert`, JobLock `llm-budget-alert-<jour>`). Dépense illisible : blocage (fail-closed). Côté appelants : repli catalogue pour le contenu du jour, HTTP 503 avec message poli sur `/api/ai`.
- **Compteur exact** : les appels sans `meta` (`claude.ts`, `monthly-videos`) n'étaient pas journalisés. Ils le sont désormais (attribution `api-ai`, `video-agent`, par défaut `non-attribue`), et l'écriture est attendue au lieu d'une promesse flottante qu'un isolat Workers peut couper.
- **`/api/ai`** : 30 générations par jour et par membre, en base (`AI_USER_DAILY_LIMIT`), en plus du `rateLimit` mémoire, inopérant sous Workers.
- **Contenu préparé** : `CONTENT_GENERATION_ENABLED` ≠ `"true"`, donc daily-content, weekly-seo, monthly-plan et monthly-videos n'appellent aucun LLM. daily-content comble un trou du calendrier depuis le stock (258 vannes GARDER avec décryptage, dont 203 jamais utilisées). weekly-seo passe en `isPublished=true` l'article planifié échu de la semaine ISO en cours : **un article planifié doit être stocké `isPublished=false` avec `publishedAt` = date prévue**, car le site filtre sur `isPublished`.

Tests (mocks, aucun appel réel) : `cron-guards-s14.test.ts` (12), `llm-budget-s14.test.ts` (16), `prepared-content-s14.test.ts` (9). Suite complète : 2 360 réussis, 1 échec préexistant sans lien (`social-media-agent`, test dépendant de la date le 30/09).

## 6. Plan de vérification demain 01/10 (après déploiement)

Pré-requis : déployer ces commits avant 01:00 UTC. Le `DailyContent` du 01/10 existe déjà (calendrier rempli jusqu'au 07/10). Ne pas toucher au JobLock `weekly-seo-2026-W40`.

1. **00:00-05:15 UTC, `wrangler tail marrant --format json`** : chaque tick `outcome: ok`, aucune ligne `[scheduler:daily]` de génération, aucune `[prepared-content] ... créé depuis le stock` (le calendrier existe déjà).
2. **`LlmUsageLog` depuis 00:00** : `SELECT agent, fn, count(*), sum("costUsd") FROM "LlmUsageLog" WHERE "createdAt" >= '2026-10-01' GROUP BY 1,2;`. Attendu : **aucune ligne** `joke-agent`, `tip-agent`, `video-agent`, `seo-blog-agent`, ni plans mensuels. Seules lignes possibles : `social-media-agent` (04:00), `copy-review` (03:00-04:00), CEO si activé. Toute ligne avec `durationMs < 1000` et `outputTokens > 500` signalerait un rejeu, donc un cache toujours actif.
3. **R2** : aucun nouvel objet `.fetch` dont `data.url` vaut `api.anthropic.com` ou `api.buffer.com` sous le nouveau `buildId`.
4. **`DailyContent` du 01/10** : 1 ligne, identique au calendrier. Aucune nouvelle `Joke` le 01/10 (`SELECT count(*) FROM "Joke" WHERE "createdAt" >= '2026-10-01'` = 0).
5. **`JobLock`** : pas de clé `attempt:*` tant que la génération est désactivée. Aucune `llm-budget-alert-*` (sinon, lire l'e-mail et la dépense 24 h).
6. **Budget** : `SELECT sum("costUsd") FROM "LlmUsageLog" WHERE "createdAt" >= now() - interval '24 hours'` doit rester < 5 $. Le 30/09, 2,78 $ sont enregistrés, rejeux compris ; ils sortent de la fenêtre le 01/10 vers 10:20.

## 7. Actions infra requises

- **Déployer** les 5 commits (pipeline `build:cf` + `wrangler deploy`), puis relancer `/api/cron/startup-tasks`.
- **Décider** du sort de `wrangler.jsonc` (déclaration explicite de `CONTENT_GENERATION_ENABLED`, voir §4).
- **Token** : ajouter « Workers Observability Read » (et « Billing Read » pour le plan) au token scopé Marrant, pour lire l'historique des `outcome`.
- **Optionnel** : `LLM_DAILY_BUDGET_USD`, `LLM_MONTHLY_BUDGET_USD`, `AI_USER_DAILY_LIMIT` en `vars` si les défauts (5, 40, 30) ne conviennent pas.
- Vérifier sur la console Anthropic la facturation réelle du 30/09 (1,22 $ attendus, pas 2,78 $).
