# Audit QA final — Session 11 (avant déploiement Replit)

**Date** : 2026-09-29
**Auditeur** : @qa (Opus 4.7)
**Branche** : `claude/marrant-s10-session-recovery-CtZyw`
**Environnement audité** : `http://localhost:3100` (build prod, PostgreSQL `127.0.0.1:55432/marrant`)
**Périmètre** : dernière ligne de contrôle avant `Deploy` Replit sur `deviens-marrant.fr`.

---

## 1. Verdict

**GO CONDITIONNEL** — le code applicatif (IA, parcours critiques, SEO, sécurité) est propre et prêt.
**1 seule action à faire AVANT de cliquer Deploy** : corriger la ligne `build` du fichier `.replit`
(le script y appelle un fichier `prisma/seed.ts` qui n'existe plus). Sans ce fix, le seed échoue au
build Replit et le nouveau bundle ne sort pas. Correctif = 1 ligne (voir §2 constat A1 + §4).

Après ce fix (ou en construisant manuellement via `cd apps/web && npm run build` depuis le
shell Replit avant Deploy), c'est un **GO** ferme.

---

## 2. Tableau des constats

Sévérités : **BLOQUANT** = ne pas déployer tant que non résolu · **AVANT** = risque réel, corriger avant ou immédiatement après · **MINEUR** = à traiter au prochain cycle.

| # | Sévérité | Domaine | Constat | Preuve | Correctif proposé |
|---|---|---|---|---|---|
| **A1** | **BLOQUANT** | Deploy Replit | `.replit` `[deployment].build` appelle `npx tsx prisma/seed.ts` — fichier **inexistant** dans la branche. Le seed retourne exit 1, `&&` stoppe la chaîne, `npm run build` ne tourne jamais. Résultat : le container Deploy Replit ne peut plus produire de bundle. `prisma db push` (précédent maillon) tourne d'abord donc le schéma est OK, mais aucun binaire n'est publié. | `ls apps/web/prisma/` → `migrations/`, `schema.prisma`, `seed-data.ts` (pas `seed.ts`). `npx tsx prisma/seed.ts` → `ERR_MODULE_NOT_FOUND`, `REAL EXIT: 1`. `git show HEAD:apps/web/prisma/` confirme absence. | Dans `.replit` remplacer `npx tsx prisma/seed.ts` par `npx prisma db seed` (le hook `"prisma": {"seed": "bash scripts/seed.sh"}` du `package.json` fait déjà le boulot avec `seed-data.ts` bundlé via esbuild). Alternative équivalente : `bash scripts/seed.sh`. Ligne unique à changer. |
| A2 | AVANT | Prisma migrations | Migration versionnée `9_add_newsletter_subscriber` présente sous `prisma/migrations/` mais Replit utilise `prisma db push` (pas `migrate deploy`). Fonctionne, mais la présence de migrations non appliquées peut piéger un futur passage à `migrate deploy` (baseline `_prisma_migrations` inexistant). Le comportement actuel est OK pour ce déploiement. | `ls prisma/migrations/` → `9_add_newsletter_subscriber/` · `.replit` build → `prisma db push`. `REPLIT_ACTIONS.md` documente le choix `db push`. | Aucune action pour ce déploiement. Ajouter un commentaire dans le README migrations ou déplacer/archiver les migrations si `db push` reste la stratégie. Documenté déjà dans `REPLIT_ACTIONS.md` §Note migrations versionnées. |
| A3 | AVANT | Doc Replit | La colonne "Automatique au déploiement" de `REPLIT_ACTIONS.md` annonce que la table `NewsletterSubscriber` sera créée par `prisma db push` au build — vrai uniquement si le build atteint cette étape. Or celle-ci **passe avant le seed cassé** (§A1), donc la table sera bien créée même si la suite explose. À condition qu'Anthropic ne relance pas la totalité en rollback. À valider après fix A1. | `.replit` : ordre `npx prisma db push && npx tsx prisma/seed.ts && npm run build`. Sur DB locale, la table n'existe pas (`\d NewsletterSubscriber` → "Did not find any relation") — normal car ce local n'a pas exécuté `db push` récemment. | Après correction A1, le `db push` créera la table. Test : `curl -X POST /api/newsletter -d '{"email":"x@y.z","consent":true}'` doit rendre 200 (pas 500). Sur local : la table manque toujours car pas de db push exécuté. |
| **B1** | MINEUR | Rate limit | Deux tentatives puis 429. La limite est très basse pour un endpoint public — un utilisateur légitime qui recharge après une erreur peut se retrouver bloqué. | Test : 7 POST /api/newsletter enchaînés → `500 500 429 429 429 429 429`. | Vérifier la fenêtre de rate limit du newsletter (probablement /min). Si elle est en secondes, allonger à 5/10 par IP par 10 min. Pas bloquant. |
| B2 | MINEUR | Doc redirections | Les redirections `permanent: true` (Next 14) répondent **308** et non 301. Le fichier `seo-redirects.data.cjs` et `REPLIT_ACTIONS.md` parlent de "301". Google traite 308 comme 301 pour l'indexation, donc effet SEO identique — pure question de doc. | `curl -sI /blog/devenir-marrant` → `HTTP/1.1 308 Permanent Redirect`. | Éditer les commentaires (`permanent: true` (**308**)) — cosmétique. |
| B3 | MINEUR | ESLint | 2 warnings `no-img-element` (`src/app/admin/page.tsx:1006`, `src/components/parcours/parcours-detail.tsx:184`). Uniquement dashboard admin et image parcours — pas de LCP marketing. | `npx next lint` → 2 warnings, exit 0. | Migrer vers `next/image` au prochain passage design. Pas bloquant pour le déploiement. |
| B4 | MINEUR | Health | `/api/health` renvoie `status: "degraded"` en local car `blogArticle` est `stale` (2 articles seulement en base locale, date 2026-07-01) et `llmSuccess` est `empty` (jamais tourné en local). En prod, `blogArticle` sera à jour dès la 1re publication et `llmSuccess` dès le 1er tick IA. | `GET /api/health` → `checks.content.blogArticle.status = "stale"`, `llmSuccess.status = "empty"`. | Aucune action code. Vérifier post-deploy : `curl https://deviens-marrant.fr/api/health` puis attendre la fenêtre 5-6h UTC (ou catch-up 7-22h UTC) pour voir passer `llmSuccess` en `ok`. |
| B5 | MINEUR | UX vannes | Le bandeau "limite gratuite" annoncé sur `/vannes` non-authentifié n'est pas visible dans le HTML SSR (probablement rendu client via zustand). Non observable par curl. Le test `individual-pages-freemium` passe en Jest. | `curl /vannes` → aucune occurrence de "limite" ou "gratuit". `PASS src/__tests__/feature/individual-pages-freemium.test.ts`. | Vérifier manuellement en navigateur post-deploy (session anon → défiler /vannes). Aucun risque de crash. |

**Aucune faille de sécurité / open redirect / secret leak / paramètre IA interdit détecté.**

---

## 3. Vérifications passées (OK)

### 3.1 Parcours critiques (HTTP live sur localhost:3100)
| Route | Attendu | Observé |
|---|---|---|
| `/` | 200 | 200 · h1 hero + CTAs présents (`abonnement`, `265 vannes` via `content-stats`) |
| `/register` | 200 | 200 |
| `/register?callbackUrl=//evil.com` | callback ignoré | Aucune occurrence de `evil.com` dans la page. `sanitizeCallbackUrl()` retourne `null` → fallback `/onboarding` |
| `/register?callbackUrl=https%3A%2F%2Fevil.com` | callback ignoré | Idem. Preuve dans `src/lib/safe-callback.ts:22-25` (refus `//`, `http:` et Windows-style `\\`) |
| `/onboarding` (anon) | redirection auth | 307 → `location: /api/auth/signin?callbackUrl=%2Fonboarding` (middleware `withAuth` OK) |
| `/abonnement` (anon) | 200 | 200 |
| `/vannes` | 200 | 200 (bandeau limite : rendu client — voir B5) |
| `/vannes/[slug]` (non connecté) | "Pourquoi ça marche" visible + CTA "À toi de jouer" | 200 — `Pourquoi ça marche` × 4 + `À toi de jouer` détectés sur `/vannes/je-suis-tellement-mauvais-en-cuisine-…-cmumhxvde0` |
| `/conseils/[slug]` | 200 | 200 (`/conseils/la-pause-et-le-silence-…-cmumhxw2i0`) |
| `/videos/[slug]` | 200 | 200 (`/videos/roman-frayssinet-…-cmumhxw9i0`) |
| `/quiz-humour` | 200 + CTA inscription | 200 · "inscription" détecté (fin de quiz) |
| `/blog/comment-devenir-drole` | maillage parcours + newsletter + double CTA | 200 · 8 liens `/parcours`, 4 mentions `abonnement`, 1 mention `Newsletter`, formulaire `Ton email` présent · CTA `/parcours/repartie` × 2 (maillage contextuel s11-lot1) |

### 3.2 API et infrastructure
- `/api/health` → 200, JSON complet, **aucun secret** exposé (`sonnetModel: claude-sonnet-5-5`, `opusModel: claude-opus-5-5`, `defaultEffort: low`, tous les `Overridden: false` en local). `checks.database.status = "up"`, `latencyMs = 2`.
- `/api/content-stats` → 200, `{jokes:265, tips:65, videos:89, members:0}` (clé `members` bien présente).
- `/api/newsletter` GET → **405 Method Not Allowed** (POST-only correct).
- `/api/newsletter/confirm/badtoken` → 307 → `/?newsletter=invalid` (jamais 500).
- `/api/newsletter/unsubscribe/badtoken` → 307 → `/?newsletter=invalid` (idem).
- `POST /api/newsletter` avec email invalide → 400 `{"error":"Adresse email invalide."}`.
- `POST /api/newsletter` sans consentement → 400 `{"error":"Tu dois accepter pour recevoir la newsletter."}`.
- `POST /api/newsletter` valide → 500 en local (table absente, cf. A3 : sera 200 en prod après db push). Rate limit 429 confirmé après 2 tentatives.

### 3.3 En-têtes de sécurité (`curl -sI /`)
- `X-Content-Type-Options: nosniff` ✓
- `X-Frame-Options: DENY` ✓
- `X-XSS-Protection: 1; mode=block` ✓
- `Referrer-Policy: strict-origin-when-cross-origin` ✓
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` ✓
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube.com https://checkout.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'` — **aucun `unsafe-eval`** ✓
- **Aucun `Strict-Transport-Security`** émis par l'app (délégué à Replit / Google Frontend, conforme au commentaire `next.config.js:92`) — pas de doublon.

### 3.4 Redirections 301/308
- `/blagues` → 308 → `/vannes` ✓
- `/blog/devenir-marrant` → 308 → `/blog/comment-devenir-drole` ✓
- `/blog/meilleures-blagues-droles-2026` → 308 → `/blog/meilleures-blagues-droles` ✓
- 15 redirections dans `src/lib/seo-redirects.data.cjs`, toutes chargées par `next.config.js:32-40`.

### 3.5 Sitemap / SEO / GEO
- `/sitemap.xml` : 200 · **463 URLs**, XML valide, `lastmod` réel (2026-09-29 pour homepage).
- Test des URLs (échantillon 20 + toutes les URLs blog + toutes les URLs statiques) : **aucune 404, aucune 3xx** sur les URLs du sitemap.
- Aucune URL redirigée présente dans le sitemap (test : `/blagues`, `/blog/devenir-marrant`, `/blog/meilleures-blagues-droles-2026`, `/blog/timing-humour-ralentir` — absents ✓).
- `/robots.txt` : 200, autorise Google/Bing + GPTBot / ChatGPT-User / Google-Extended / PerplexityBot / ClaudeBot / anthropic-ai / Bytespider / CCBot / cohere-ai (GEO), bloque `/api/`, `/admin/`, `/onboarding`, `/profil`, `/favoris`. Sitemap référencé.
- `/llms.txt` : 200, 87 lignes, sections `À propos` / `Public cible` / `Sections principales`.
- `/llms-full.txt` : 200.
- `/opengraph-image` (racine) : 200.
- `/vannes/[slug]/opengraph-image-<hash>` : 200 (134 KB PNG · Satori + resvg fonctionnel). Le path direct `/vannes/[slug]/opengraph-image` (sans hash) renvoie 404 car Next 14 signe l'URL — comportement normal, seule l'URL signée présente dans `og:image` est valide.

### 3.6 Migration IA Claude Sonnet 5.5 / Opus 5.5 (le point le plus critique)
- **`SONNET_MODEL = "claude-sonnet-5-5"`** (`src/lib/ai/client.ts:40`), **`OPUS_MODEL = "claude-opus-5-5"`** (ligne 44). Surcharge possible via secrets Replit `ANTHROPIC_SONNET_MODEL` / `ANTHROPIC_OPUS_MODEL`.
- SDK `@anthropic-ai/sdk` **0.129.0** (`node_modules/@anthropic-ai/sdk/package.json`). Type `Model` inclut bien `claude-sonnet-5-5` et `claude-opus-5-5` (SDK d.ts ligne 2107).
- `applyModelDefaults()` (ligne 85-96) : ajoute **`THINKING_HEADROOM_TOKENS = 4000`** à `max_tokens` (marge pour la réflexion adaptative) et **`effort = "low"`** par défaut. Effort surchargeable via env `ANTHROPIC_EFFORT` (`low` / `medium` / `high` / `xhigh` / `max`). Type SDK `OutputConfig.effort` conforme.
- **`LlmRefusalError`** (ligne 76-81) : lève une erreur non retentable sur `stop_reason === "refusal"`. Tokens correctement facturés dans le log.
- **`getResponseText()`** (ligne 355-363) : lit par **type** (`block.type === "text"`), jamais `content[0]`. Compatible avec la réflexion adaptative qui peut renvoyer un bloc `thinking` en premier.
- **Aucun appel `anthropic.messages.create` hors `callWithRetry`** : `grep -rn "messages.create\|anthropic\." src/` (hors tests et `client.ts`) → aucune correspondance dans du code exécutable, uniquement quelques docstrings dans `failure-alert.ts` et `usage-log.ts`.
- **Aucune référence à `content[0]`** dans le code : `grep -rn "content\[0\]" src/` → 1 seule occurrence, dans un commentaire de `client.ts` (rappel de règle).
- **Aucun paramètre refusé par Sonnet 5.5** dans le code : `grep -rn "temperature\|top_p\|top_k" src/` → 0 hit hors tests, `thinking:` / `budget_tokens` / prefill assistant : 0 hit.
- **`failure-alert.ts`** : import dynamique depuis `callWithRetry` (évite dépendance circulaire), throttlé 24h par type d'erreur, silent-fail (`.catch(() => {})`), ne relance pas les `LlmRefusalError`. L'alerte email admin est bien branchée.
- Test unitaire `src/__tests__/lib/ai-client-models.test.ts` : PASS.

### 3.7 Tâches de démarrage (`src/lib/startup-tasks.ts`)
Journal `/tmp/next.log` :
```
[startup] CeoConfig OK (enabled=false, dryRun=true).
[startup] décryptages appliqués : 0/265.
[startup] vannes faibles désactivées : 0
[startup] backfill IA décryptages désactivé (env flag).
```
9 tâches idempotentes exécutées avant le scheduler, chacune `try/catch` fail-safe, aucune ne casse le boot. Deux ordres invariants respectés : `ensureCeoConfig` avant les crons CEO, `applyJokeDecryptages` en début (bundle statique JSON, 0 IA). Le back-fill IA (`backfillMissingJokeDecryptagesTask`) est correctement désactivable via `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1`.

### 3.8 Qualité code
- `npx tsc --noEmit -p tsconfig.build.json` → **0 erreur** (exit 0).
- `npx next lint` → **0 erreur** (exit 0), 2 warnings `no-img-element` (voir B3).
- `npx jest --silent` → **1877 tests passés**, 2 skipped, 113 suites (exit 0, 11.3 s).
- **0 placeholder de secret** dans `src/` (`grep -E '="\.\.\."|=xxx|=placeholder|sk_test_dummy' src/` → 1 hit dans une docstring `route.ts`, aucune valeur active).
- Handlers `route.fallback` correctement inutilisés (tests jest, pas de dépendance Playwright dans le run CI).

### 3.9 Base de données locale
- 35 tables présentes. `NewsletterSubscriber` **absente en local** (attendue en prod après `prisma db push` du build).
- Contenus : 265 vannes actives, 65 tips actifs, 89 vidéos actives, 3 parcours, 2 articles blog publiés en base (les ~34 articles prod ne sont pas en local — normal, indiqué par la mission).

---

## 4. Actions Replit pour Thomas

### 4.0 — Correctif obligatoire avant Deploy (fix A1)
**Éditer `.replit` ligne `build` du bloc `[deployment]`** — remplacer `npx tsx prisma/seed.ts` par `npx prisma db seed` :

```toml
[deployment]
build = ["sh", "-c", "cd apps/web && npm install && npx prisma generate && npx prisma db push && npx prisma db seed && npm run build"]
```

Explication : `npx prisma db seed` lit le champ `"prisma": {"seed": "bash scripts/seed.sh"}` du `apps/web/package.json` et enchaîne :
1. `npx prisma db push --skip-generate` (recréé la table `NewsletterSubscriber`)
2. `npx esbuild prisma/seed-data.ts --bundle …` (le vrai seed)
3. `node .seed-compiled.js` (exécution)

Alternative (équivalent) : remplacer par `bash scripts/seed.sh` directement.

### 4.1 — Merge + Deploy
Merger la branche `claude/marrant-s10-session-recovery-CtZyw` dans `master` puis cliquer **Deploy** dans Replit. Le reste est automatique (voir `REPLIT_ACTIONS.md` §A).

### 4.2 — Vérifications post-déploiement (~5 min)
1. `curl https://deviens-marrant.fr/api/health` — attendu `checks.ai.sonnetModel = "claude-sonnet-5-5"`, `checks.database.status = "up"`, `status ∈ {"ok","degraded"}` (pas `"error"`).
2. `curl https://deviens-marrant.fr/api/content-stats` — attendu `{jokes:265, tips:65, videos:89, members:>0}`.
3. `curl -X POST https://deviens-marrant.fr/api/newsletter -H "Content-Type: application/json" -d '{"email":"thomas.issa+audit-s11@gmail.com","consent":true}'` — attendu **200** (pas 500). Puis vérifier arrivée mail confirmation.
4. `curl -I https://deviens-marrant.fr/blagues` → 308 vers `/vannes`.
5. `curl https://deviens-marrant.fr/llms.txt` — doit lister ~26 articles blog.
6. Ouvrir `/vannes/<un-slug>` en navigation privée : bandeau limite + décryptage "Pourquoi ça marche" visibles, CTA "À toi de jouer".
7. Attendre la fenêtre 5h-6h UTC (ou catch-up 7-22h UTC) : `checks.content.llmSuccess.status` doit passer à `ok` (première génération IA réelle sur Claude Sonnet 5.5).
8. Facultatif : soumettre le sitemap dans Google Search Console + Bing Webmaster Tools (≈ 1 100 nouvelles URLs `/vannes /conseils /videos`).

### 4.3 — Secrets Replit (tous optionnels)
Aucun ajout de secret n'est **nécessaire** pour ce déploiement. Le code a des défauts sûrs pour `ANTHROPIC_SONNET_MODEL`, `ANTHROPIC_OPUS_MODEL`, `ANTHROPIC_EFFORT` (voir `REPLIT_ACTIONS.md` §B).
Recommandé : supprimer `ANTHROPIC_HAIKU_MODEL` si présent (plus lu par le code).
Recommandé : poser `NEXT_PUBLIC_BING_SITE_VERIFICATION` pour débloquer l'indexation Bing.

---

## 5. Annexes — preuves complémentaires

### 5.1 CallbackUrl : test open-redirect
Code `src/lib/safe-callback.ts:11-30` refuse : `//evil.com`, `https://evil.com`, `javascript:`, `\\evil.com`, caractères de contrôle, longueur > 512, chaîne vide/whitespace. Test unitaire `src/__tests__/lib/safe-callback.test.ts` : PASS. Test live : le HTML rendu de `/register?callbackUrl=<injection>` ne contient jamais le domaine externe.

### 5.2 Startup log (extrait `/tmp/next.log`)
```
[startup] CeoConfig OK (enabled=false, dryRun=true).
[startup] décryptages appliqués : 0/265.  ← idempotent : déjà appliqué
[startup] vannes faibles désactivées : 0  ← idempotent
[startup] backfill IA décryptages désactivé (env flag).
```

### 5.3 Sommaire Jest
```
Test Suites: 1 skipped, 113 passed, 113 of 114 total
Tests:       2 skipped, 1877 passed, 1879 total
Time:        11.26 s
```

### 5.4 Fichiers audités (chemins absolus)
- `/home/user/Marrant/apps/web/src/lib/ai/client.ts`
- `/home/user/Marrant/apps/web/src/lib/ai/failure-alert.ts`
- `/home/user/Marrant/apps/web/src/lib/startup-tasks.ts`
- `/home/user/Marrant/apps/web/src/lib/safe-callback.ts`
- `/home/user/Marrant/apps/web/src/lib/seo-redirects.data.cjs`
- `/home/user/Marrant/apps/web/src/lib/content-stats-server.ts`
- `/home/user/Marrant/apps/web/src/app/api/newsletter/route.ts`
- `/home/user/Marrant/apps/web/src/app/api/content-stats/route.ts`
- `/home/user/Marrant/apps/web/src/app/api/health/route.ts`
- `/home/user/Marrant/apps/web/next.config.js`
- `/home/user/Marrant/apps/web/prisma/schema.prisma`
- `/home/user/Marrant/apps/web/scripts/seed.sh`
- `/home/user/Marrant/apps/web/package.json`
- `/home/user/Marrant/package.json`
- `/home/user/Marrant/.replit`

---

**Handoff → @orchestrator / Thomas**
- Livrable : `/home/user/Marrant/docs/qa/audit-final-s11.md`
- Décision : **GO** conditionnel — 1 fix `.replit` (§4.0) avant Deploy, sinon le nouveau bundle ne sortira pas.
- Aucun fichier applicatif modifié (lecture + tests uniquement, conforme au brief).
- Testing honesty : parcours HTTP, migrations, seeds, sécurité, IA = [LIVE] sur localhost:3100 + jest en local. `.replit` deploy = [STATIQUE] (analyse de la commande, exécution simulée : `npx tsx prisma/seed.ts` retourne bien exit 1 sur ce runner Node 22, mais Cloud Run Replit peut avoir une isolation légèrement différente — le fix est trivial et sans risque, à faire par prudence).
