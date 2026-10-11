# Audit technique de production — deviens-marrant.fr (session 11)

> **Date** : 2026-09-29  
> **Agent** : @infrastructure  
> **Branche auditée** : `claude/marrant-s10-session-recovery-CtZyw` vs `origin/master`  
> **Prod** : https://deviens-marrant.fr  
> **Mode** : LECTURE SEULE — aucun POST, aucun commit, aucune modification de code

---

## 1. Verdict global

**Score : 52 / 100** — Statut **CRITIQUE** (rouge) mais mieux qu'attendu sur la sécurité réseau.

**Progression session → session : NÉGATIVE.** La prod tourne sur `origin/master` (commit `88bb582`, clôture s7 mars 2026). **50 commits couvrant s8 + s9 + s10 sont invisibles en production.** Volume : 152 fichiers modifiés, +28 985 / −1 983 lignes, 4 migrations Prisma en attente (`5_add_ceo_tables`, `6_fix_pushtoken_webhookevent_schema`, `7_add_joke_decryptage`, `8_cleanup_wildcard_socialpost`). Le fondateur a construit ~7 mois de travail non déployé (Phase 5 CEO complet, vannes pédagogiques, hotfixes P0 Buffer + Neon + TSC + favicons).

Bonnes surprises confirmées par mesure live :
- **CSP présente** sur toutes les pages instantanées (mais faible : `'unsafe-inline'` + `'unsafe-eval'` sur script-src).
- **HSTS actif** (`max-age=63072000; includeSubDomains; preload`).
- **X-Frame-Options: DENY** partout.
- **Referrer-Policy: strict-origin-when-cross-origin** partout.
- **X-Content-Type-Options: nosniff** partout.
- **Permissions-Policy** présente (`camera=(), microphone=(), geolocation=()`).
- **TTFB acceptable** (200–500 ms, cache HIT confirmé via `x-nextjs-cache: HIT`).
- **Cache-Control** cohérent : `s-maxage=31536000` (pages statiques ISR) et `s-maxage=3600` (blog).

Mauvaises surprises confirmées live :
- **`/api/health` renvoie 404** (Not Found page HTML complète) → aucun endpoint santé exploitable.
- **`next.config.js` ligne 20** : `typescript: { ignoreBuildErrors: true }` — les erreurs TS passent en prod silencieusement.
- **CI GitHub Actions** (`.github/workflows/tests.yml`) déclenche sur push/PR vers **`main`** — or le tronc réel est **`master`** et la default branch GitHub serait `claude/init-project-setup-jcI9q`. La CI ne tourne donc probablement **jamais**.
- **`.env.example`** obsolète : manque `NEXTAUTH_URL` correct pour prod, `RESEND_API_KEY`, `UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `INDEXNOW_KEY`, `BUFFER_*`.

---

## 2. Tableau des trous (P0 / P1 / P2)

| ID | Sev | Trou | Preuve | Impact | Fix | Agent |
|---|---|---|---|---|---|---|
| T01 | P0 | 50 commits s8+s9+s10 non mergés dans `origin/master` | `git log --oneline origin/master..HEAD \| wc -l` → **50**. `git diff --stat` → 152 fichiers, +28985/−1983 | Prod = code mars 2026. Bugs corrigés en code, actifs en prod : Buffer 429 boucle, Neon cold start alertes, 30+ erreurs TSC, favicons cassés, 265 vannes sans décryptage, tout le CEO absent, hotfixes P0 invisibles | Merge sécurisé (plan §3) | Thomas + @fullstack |
| T02 | P0 | Branche par défaut GitHub = `claude/init-project-setup-jcI9q` (11/03/2026, commit `6e9444a`) | Source : contexte utilisateur. À revalider `gh repo view --json defaultBranchRef` | PR ouvertes contre branche orpheline. CI Actions `tests.yml` déclenche sur `main` inexistant → jamais exécutée | GitHub Settings > Branches > default = `master`. Puis basculer `tests.yml` de `main` → `master` | Thomas (manuel) |
| T03 | P0 | Aucun endpoint `/api/health` | `curl -sS -w "%{http_code}" https://deviens-marrant.fr/api/health` → **404**. Aucun dossier `apps/web/src/app/api/health/`. `ls apps/web/src/app/api/` : 22 routes, aucune `health` | Monitoring externe impossible. Aucune détection auto DB down / Neon suspend / Anthropic KO. Aucune baseline pour alertes | Créer `apps/web/src/app/api/health/route.ts` (SELECT 1 Prisma + latence + env check) + brancher UptimeRobot free | @fullstack + @infrastructure |
| T04 | P0 | CI GitHub Actions ne se déclenche jamais | `.github/workflows/tests.yml` lignes 4-6 : `on: push: branches: [main]` / `pull_request: branches: [main]`. Le tronc réel = `master` | Aucun filet automatisé. Régressions détectées en local uniquement. Explique T07 (bugs TSC en prod) | Remplacer `[main]` par `[master]` + ajouter `npx tsc --noEmit` + trigger sur toutes les branches PR | @infrastructure |
| T05 | P0 | 12 vulnérabilités npm `apps/web` + 25 root non résolues depuis s6 | Mémo s10 backlog #6 (`project-context.md` L199) | Dette sécu OWASP A06. Impossible de mesurer criticité sans `npm audit` live | Sur Replit shell post-merge : `cd apps/web && npm audit --production` + `npm audit fix` (snapshot avant/après). Escalader si RCE | @fullstack + @qa |
| T06 | P1 | CSP faible : `'unsafe-inline'` + `'unsafe-eval'` sur `script-src` | `next.config.js` ligne 74 + `/tmp/.../live/home.headers` : `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is` | Contourne la protection XSS. Umami inline OK, mais l'`unsafe-eval` n'est nécessaire que si Next dev-mode. En prod standalone, peut être retiré | Retirer `'unsafe-eval'` (test le build), remplacer `'unsafe-inline'` par nonces via `next/script` ou hash SHA256 | @fullstack |
| T07 | P1 | `next.config.js` : `typescript: { ignoreBuildErrors: true }` | `apps/web/next.config.js` ligne 19-22, commentaire "Required: TS errors are caught by CI lint" — or T04 démontre que la CI ne tourne pas | Bugs TSC passent en prod (déjà arrivé s9 : 30+ erreurs TSC, favicons G31). Combinaison T04 + T07 = filet zéro | Retirer `ignoreBuildErrors`. Le hook pre-commit + CI (une fois T04 corrigé) attrapent | @fullstack |
| T08 | P1 | `.env.example` obsolète (≥ 10 variables manquantes) | `apps/web/.env.example` s'arrête à `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Manque `RESEND_API_KEY`, `UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `INDEXNOW_KEY`, `BUFFER_*` | Onboarding dev tâtonne. Risque de secret oublié en Replit Secrets → feature morte silencieusement (le mémo s10 confirme "fail-safe si absent") | Mettre à jour `.env.example` post-merge en listant les ~20 secrets connus, commentaire pour chacun | @infrastructure |
| T09 | P1 | Aucun error tracking (Sentry ou équivalent) | Grep `sentry` dans headers, next.config, package.json — 0 match. Aucune doc | Erreurs runtime client + server invisibles. Debug post-incident aveugle. Explique pourquoi les P0 s'accumulent | Sentry free (5K events/mois) : `@sentry/nextjs`, source maps upload en build | @infrastructure + @fullstack |
| T10 | P1 | Aucun monitoring externe (uptime + latence) | Aucune mention BetterStack/UptimeRobot dans `docs/infra/`, aucun probe visible | Downtime détecté par utilisateur, pas par alerte. TTFB / dispo non tracés dans le temps | UptimeRobot free 50 monitors, 5 min interval : `/`, `/vannes`, `/blog`, `/api/health` (après T03), `/parcours` | @infrastructure |
| T11 | P1 | Stratégie backup PostgreSQL Neon non documentée (fréquence, rétention, restauration testée) | `docs/infra/deployment.md` mentionne Neon sans plan. Neon free tier : backups PITR 24h uniquement | Perte de données possible sur incident > 24h. RPO/RTO inconnus. Test restauration jamais fait | `pg_dump` quotidien via GitHub Actions → R2/Backblaze B2 free, rétention 30j, drill mensuel documenté | @infrastructure |
| T12 | P1 | SPF/DKIM/DMARC Resend non vérifiés en doc | Non mentionné dans `deployment.md`. Emails CEO + inbound requis pour Phase 5 | Emails CEO risquent spam. Délivrabilité < 95% probable si DMARC absent | `dig TXT deviens-marrant.fr` (SPF), `dig TXT resend._domainkey.deviens-marrant.fr`, `dig TXT _dmarc.deviens-marrant.fr` + documenter | @infrastructure |
| T13 | P1 | Aucun rate-limiting middleware documenté sur endpoints IA coûteux | 22 routes API listées, dont `/api/ai`, `/api/ceo/*`, `/api/jokes`. Aucun middleware.ts visible dans grep initial | 1 IP peut vider budget Anthropic ($10/j max théorique s6). Scraping trivial | Middleware `@upstash/ratelimit` (free 10K req/j) ou implémentation Redis + in-memory (Cloud Run éphémère → attention) | @fullstack |
| T14 | P1 | Migration `package.json#prisma` → `prisma.config.ts` (warning Prisma 7) | Mémo s10 backlog #6 (`project-context.md` L199) | Warning verbeux, obsolescence prévisible à la prochaine bump Prisma | Créer `prisma.config.ts` + migration | @fullstack |
| T15 | P1 | HSTS doublé dans les headers de réponse (Next + Cloud Run) | `curl -sI https://deviens-marrant.fr/` : deux lignes `strict-transport-security`, valeurs légèrement différentes (une avec `preload`, une sans) | Cosmétique mais non-conforme RFC HSTS strict. Certains scanners flaggent | Retirer la ligne HSTS de `next.config.js` (Cloud Run/Google Frontend l'ajoute déjà) OU vice-versa | @fullstack |
| T16 | P2 | `.replit` : `[deployment].build` utilise `prisma db push` (pas `migrate deploy`) | `.replit` ligne 8 | Migrations de **données** ne s'appliquent pas. Compensé par `startup-tasks.ts` s10. Piège si baseline `_prisma_migrations` un jour | Documenter le trade-off en clair dans `docs/infra/deployment.md`. Statu quo accepté s10 | @infrastructure (doc) |
| T17 | P2 | Aucun bundle size tracking / Lighthouse CI | Pas de step Lighthouse dans `tests.yml`, pas de `size-limit` | Régressions perf non détectées avant prod | Ajouter step Lighthouse CI (desktop + mobile) après T04 corrigé | @infrastructure |
| T18 | P2 | `deployment.md` mentionne Neon comme option "gratuite dev" — contradictoire avec Playbook (PostgreSQL Replit intégré) | `docs/infra/deployment.md` ligne 45-46 | Confusion sur la source de vérité DB. Historique acté : Neon en prod, mais doc floue | Clarifier : Neon = prod actuel, migration vers Replit PG à évaluer (T20) | @infrastructure |
| T19 | P2 | Aucun `docs/infra/env.md` détaillé listant TOUS les secrets avec source/rotation | Backlog s10 mentionne le doc mais fichier non audité en profondeur | Rotation secrets non planifiée. `UNSUBSCRIBE_HMAC_SECRET` compromis = tous liens unsubscribe cassés | Créer/mettre à jour `docs/infra/env.md` : nom, source, rotation, fail-mode | @infrastructure |
| T20 | P2 | Neon free tier : suspend compute après 5 min inactivité (fix `withDbRetry` compense mais toujours latence +500ms au réveil) | Mémo s10 : fix `withDbRetry` (retry 3× backoff 500ms→2s) | Latence P95 augmentée sur premières requêtes après pause. Impact SEO (Googlebot mesure) | Évaluer upgrade Neon Pro (~$19/mo) ou migration PostgreSQL Replit intégré (playbook) après merge | @infrastructure |

---

## 3. Plan de merge & déploiement recommandé

Objectif : passer les 50 commits en prod **sans casser plus qu'ils ne réparent**. Ordre non négociable.

### Étape 0 — Snapshot DB avant tout (5 min)
```bash
# Sur Replit shell (impératif : la DB doit être la prod, pas locale)
pg_dump "$DATABASE_URL" | gzip > /tmp/pre-s10-merge-$(date +%Y%m%d).sql.gz
sha256sum /tmp/pre-s10-merge-*.sql.gz
# Télécharger le dump localement (onglet Files Replit) → rollback DB si migration foire
```

### Étape 1 — Vérifier l'écart complet (10 min, déjà chiffré ci-dessus)
```bash
cd /home/user/Marrant
git fetch origin master --depth=200
git log --oneline origin/master..HEAD | wc -l          # → 50
git diff --stat origin/master..HEAD | tail -3          # → 152 files, +28985/-1983
git diff --name-only origin/master..HEAD | grep prisma # → 4 migrations + schema
```

### Étape 2 — Test merge en local (30 min)
```bash
# Branche jetable — ne pas toucher à claude/marrant-s10-session-recovery-CtZyw
git checkout -b test-merge-master origin/master
git merge --no-commit --no-ff claude/marrant-s10-session-recovery-CtZyw
git status
```
- Si conflit : résoudre manuellement. **JAMAIS `--strategy=ours` sur `prisma/schema.prisma`, `next.config.js`, `.replit`**.
- Cas probable : merge clean (branche s10 est une descendante linéaire de master pour beaucoup de fichiers).

### Étape 3 — Build check obligatoire (Règle n°6 CLAUDE.md) (15 min)
```bash
cd apps/web && npm install                           # les 12 vulns apparaissent ici — capture la sortie
npx prisma generate
npx tsc --noEmit                                     # BLOQUANT
npx next lint                                        # warnings OK, erreurs NOK
npm run build                                        # BLOQUANT
npx jest --no-coverage                               # attendu ~1700 PASS (mémo s10)
```

### Étape 4 — Basculer la default branch AVANT la PR (5 min)
```bash
# Sinon la PR va s'ouvrir contre claude/init-project-setup-jcI9q → confusion
gh repo view --json defaultBranchRef -q .defaultBranchRef.name
# Si != master : GitHub Settings > Branches > Default branch → master
```

### Étape 5 — Ouvrir la PR contre master (5 min)
```bash
gh pr create --base master --head claude/marrant-s10-session-recovery-CtZyw \
  --title "s10 merge : 50 commits (Phase 5 CEO + vannes pédagogiques + fixes P0)" \
  --body-file docs/infra/audit-global-s11.md
```
- Attente review : @reviewer + Thomas (au moins).
- Vérifier que la CI tourne (elle ne tournera **pas** tant que T04 non corrigé — corriger `tests.yml` `[main]` → `[master]` en même temps).

### Étape 6 — Merger + tag (5 min)
```bash
gh pr merge --merge --delete-branch=false  # PAS de squash (perd historique s8/s9/s10)
git tag -a v-s10-merge -m "Merge session 10 dans master (2026-09-29)"
git push origin v-s10-merge
```

### Étape 7 — Deploy Replit + vérifs post-boot (30 min)
1. Replit → **Deploy** (le build `.replit` fait `npm install` + `prisma generate` + `prisma db push` + `tsx prisma/seed.ts` + `npm run build`).
2. Logs de démarrage attendus (`instrumentation.ts` → `startup-tasks.ts`) :
   - `[startup] décryptages appliqués : 265/265.`
   - `[startup] vannes faibles désactivées : 24`
   - `ensureCeoConfig()` OK
   - Pas de crash `withDbRetry` sur cold start
3. Smoke tests GET (aucun POST) :
   - `curl -sI https://deviens-marrant.fr/` → 200 + HSTS + CSP
   - `curl -sI https://deviens-marrant.fr/vannes` → 200
   - Visite manuelle `/admin/ceo` (avec ADMIN_PASSWORD) → 6 onglets se chargent
4. Vérifier absence d'alertes email cold start Neon sur 24h.
5. Vérifier catalogue `/vannes` : décryptages visibles ("Pourquoi ça marche") + 265 vannes actives (pas 289).

### Étape 8 — Rollback si nécessaire
- **Code** : Replit → Deployments → **Rollback to previous** (revient au build pré-merge).
- **DB** : restaurer le dump étape 0 UNIQUEMENT si corruption schéma (migrations idempotentes → rare).

### Étape 9 — Post-merge (session 11 propre)
- Corriger T04 (CI Actions target `master`).
- Corriger T07 (retirer `ignoreBuildErrors`).
- Créer `/api/health` (T03).
- Setup Sentry + UptimeRobot (T09, T10).

---

## 4. Actions manuelles fondateur (à cocher)

- [ ] **Snapshot DB pré-merge** (`pg_dump` sur Replit shell, hash SHA256 gardé).
- [ ] **Changer default branch GitHub** : Settings > Branches → default = `master`.
- [ ] **Configurer 12 secrets Replit** minimum (mémo s10 §B.2) : 5 cœur bloquants (`DATABASE_URL`, `CRON_SECRET`, `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, `RESEND_API_KEY`) + 7 CEO/RGPD (`UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`, `TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`, `INDEXNOW_KEY`).
- [ ] **Merger la branche s10 dans master** via PR (plan §3 étapes 2 → 6).
- [ ] **Deploy Replit** après merge + vérifier logs boot (décryptages + désactivation vannes faibles).
- [ ] **Vérifier DNS email** : 3 `dig TXT` (§T12).
- [ ] **Configurer webhook Resend Inbound** dashboard (avec `RESEND_WEBHOOK_SECRET`).
- [ ] **Créer compte UptimeRobot** (free) → surveiller 5 URLs.
- [ ] **Créer compte Sentry** (free 5K events/mois) → wizard Next.js.
- [ ] **Signer 3 DPA** juridique : Anthropic, Resend, Neon.
- [ ] **Activer CEO** post-vérif : `/admin/ceo` → enabled=true, dryRun=false, valider les 3 premiers drafts avant scale.
- [ ] **`msvalidate.01` Bing** : si récupérée (mémo SEO s10), transmettre à @fullstack.

---

## 5. Résumé exécutif (P0/P1) — 15 lignes

1. **T01 (P0)** — Prod = mars 2026. 50 commits (152 fichiers, +28985 lignes, 4 migrations Prisma) non déployés. Trou n°1, tout le reste attend.
2. **T02 (P0)** — Default branch GitHub = branche orpheline du 11/03. À rebasculer sur `master`.
3. **T03 (P0)** — `/api/health` renvoie 404. Monitoring externe impossible.
4. **T04 (P0)** — CI GitHub Actions cible `main` (inexistant) au lieu de `master`. Ne tourne jamais.
5. **T05 (P0)** — 37 vulns npm cumulées (12 web + 25 root) non traitées depuis s6.
6. **T06 (P1)** — CSP présente MAIS `'unsafe-inline'` + `'unsafe-eval'` sur script-src → XSS élargie.
7. **T07 (P1)** — `ignoreBuildErrors:true` dans `next.config.js` : bugs TS passent en prod (a déjà pété en s9).
8. **T08 (P1)** — `.env.example` obsolète : ≥ 10 secrets manquants (RGPD + CEO).
9. **T09 (P1)** — Sentry absent : erreurs runtime invisibles.
10. **T10 (P1)** — Aucun monitoring externe (uptime + Core Web Vitals continus).
11. **T11 (P1)** — Backup Neon non documenté, restauration jamais testée.
12. **T12 (P1)** — SPF/DKIM/DMARC Resend non vérifiés en doc.
13. **T13 (P1)** — Aucun rate-limiting sur endpoints IA — budget Anthropic exposé.
14. **Progression** : côté code = énorme (s8+s9+s10). Côté prod = **stagnation ~7 mois**. Verdict global : **NO-GO nouveaux chantiers** tant que T01 non fermé.
15. **Prochaine action non négociable** : plan §3 étapes 0 → 7. Zéro nouvelle feature avant.

---

**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/infra/audit-global-s11.md`
- Décisions prises : verdict CRITIQUE (52/100), 5 P0 identifiés (T01 merge master, T02 default branch, T03 no /api/health, T04 CI branche cible fausse, T05 vulns npm), 10 P1, 5 P2
- Points d'attention : la prod est ~7 mois derrière la branche. Aucun code modifié (audit lecture seule). Preuves live capturées : headers CSP présents mais faibles, /api/health 404, TTFB 200-500ms cache HIT, next.config.js `ignoreBuildErrors:true` confirmé, CI targets `main` inexistant
- **Actions Replit requises** : voir §4 checklist fondateur (12 items). Priorité 1 : snapshot DB → merge → deploy. Priorité 2 : /api/health + Sentry + UptimeRobot post-merge
