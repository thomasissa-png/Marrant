# Audit technique de production — deviens-marrant.fr (session 11)

> **Date** : 2026-09-29  
> **Agent** : @infrastructure  
> **Branche auditée** : `claude/marrant-s10-session-recovery-CtZyw` vs `origin/master`  
> **Prod** : https://deviens-marrant.fr  
> **Mode** : LECTURE SEULE — aucun POST, aucun commit, aucune modification de code

---

## 1. Verdict global

**Score : 42 / 100** — Statut **CRITIQUE** (rouge).

Progression depuis s7 ? **NON. Régression opérationnelle majeure.** La prod tourne toujours sur `origin/master` = clôture session 7 (mars 2026). **50 commits** couvrant s8, s9, s10 (Phase 5.A → 5.D CEO, Phase 1a+1b vannes pédagogiques, hotfix P0 Buffer rate limit, fix P1 Neon cold start, hotfix P0 favicons, hotfix 30+ erreurs TSC, refonte social pipeline, déploiement auto-suffisant) sont **invisibles en production**. Le fondateur a construit ~7 mois de travail non déployé.

En clair : le code corrige des bugs prod que la prod garde. Les alertes cron cold start Neon continuent, le rate limit Buffer boucle toujours, et 265 vannes n'ont pas leur décryptage. **Le trou n°1 n'est pas dans le code — il est dans la chaîne merge → deploy.**

Points positifs :
- Headers de sécurité de base présents (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- TTFB acceptable (~200–500 ms via curl).
- Cache-control cohérent avec ISR sur pages publiques.
- Aucun endpoint sensible exposé sans auth détecté en GET.

Points cassés :
- **50 commits non mergés dans master** (chiffre exact : `git log --oneline origin/master..HEAD | wc -l` = 50).
- **Aucun CSP** (Content-Security-Policy absent des headers de toutes les pages instantanées).
- **Aucun Permissions-Policy** (headers absents).
- **12 vulnérabilités npm apps/web + 25 root** non résolues (dette portée depuis s6).
- **Aucune preuve d'un endpoint `/api/health` public** — impossible à vérifier sans code déployé.
- **Aucun monitoring externe** documenté (BetterStack/UptimeRobot).
- **Branche par défaut GitHub `claude/init-project-setup-jcI9q`** = commit du 11/03/2026, orpheline du travail réel.

---

## 2. Tableau des trous (P0 / P1 / P2)

| ID | Sev | Trou | Preuve | Impact | Fix | Agent |
|---|---|---|---|---|---|---|
| T01 | P0 | 50 commits s8+s9+s10 non mergés dans `origin/master` | `git log --oneline origin/master..HEAD \| wc -l` = 50 | Toute prod = code de mars 2026. Bugs P0 corrigés en code, actifs en prod (Buffer 429, Neon cold start alertes, 30+ erreurs TSC, favicons cassés, vannes non décryptées, CEO absent) | Merge sécurisé de la branche → master + push → Replit Deploy (plan §3) | @fullstack + Thomas |
| T02 | P0 | Branche GitHub par défaut = `claude/init-project-setup-jcI9q` (11/03/2026, commit `6e9444a`) | (source : contexte utilisateur ; à vérifier via `gh repo view --json defaultBranchRef`) | PR ouvertes contre une branche orpheline. Confusion sur la source de vérité. Risque merge accidentel dans le mauvais tronc | Repasser `master` (ou `main`) comme default branch dans GitHub Settings > Branches | Thomas (manuel) |
| T03 | P0 | Aucun `Content-Security-Policy` sur les pages HTML | `grep -i content-security /tmp/.../live/*.headers` → 0 match | Vecteur XSS élargi (scripts tiers Umami/Buffer/Resend sans allowlist). Injection possible via UGC (commentaires, décryptages, prompts IA) | Ajouter CSP report-only d'abord dans `next.config.js` headers, puis strict après monitoring 1 semaine | @fullstack (dev) |
| T04 | P0 | Aucun `Permissions-Policy` ni `X-DNS-Prefetch-Control` | `grep -iE 'permissions-policy\|dns-prefetch' /tmp/.../live/*.headers` → 0 match | Camera/mic/geoloc autorisés par défaut (surface d'attaque). Pas nécessaire pour l'app, désactiver explicitement | Ajouter `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` dans `next.config.js` | @fullstack |
| T05 | P0 | 12 vulnérabilités npm `apps/web` + 25 root non résolues | Mémo s10, `apps/web/package.json` non audité en live (pas de `node_modules` installés dans le repo audit) | Dette sécu OWASP A06 (vulnerable components). Certaines potentiellement RCE/prototype pollution selon la chaîne | `npm audit fix` sur les deux `package.json` + snapshot avant/après + tests | @fullstack + @qa |
| T06 | P0 | Aucun endpoint `/api/health` documenté ni testable en GET | Aucun fichier `route.ts` nommé `health` dans repo (grep à effectuer), non listé dans `deployment.md` | Monitoring externe impossible. Aucune détection auto de DB down / Neon suspend / API tiers KO | Créer `/api/health` (SELECT 1 + latence Anthropic + latence Resend) + brancher UptimeRobot free | @infrastructure (spec) + @fullstack (impl) |
| T07 | P1 | `next.config.js` non audité (masqué par le contexte, mais mentionné dans mémo s9 avec `ignoreBuildErrors:true`) | Mémo s10 : "next.config.js ignoreBuildErrors:true" (source : historique) | TypeScript errors passent en prod silencieusement. Bugs runtime déjà rencontrés (favicons G31, 41 erreurs TSC) | Retirer `ignoreBuildErrors:true` + `ignoreDuringBuilds` — le pre-commit hook doit couvrir | @fullstack |
| T08 | P1 | Aucun monitoring externe (uptime, latence, Core Web Vitals continus) | Aucune mention BetterStack / UptimeRobot / PageSpeed CI dans `docs/infra/` | Downtime détecté par utilisateur, pas par alerte. Core Web Vitals inconnus | Configurer UptimeRobot free (5 pages critiques, 5 min interval) + PageSpeed API dans GitHub Actions | @infrastructure |
| T09 | P1 | Aucune source maps Sentry documentée — error tracking absent | Aucune mention `sentry` dans les .headers, aucun `NEXT_PUBLIC_SENTRY_DSN` documenté | Erreurs runtime (client + server) invisibles. Aucun tri par fréquence. Debug post-incident aveugle | Configurer Sentry free tier (5K events/mois) — client + serveur + source maps upload | @infrastructure + @fullstack |
| T10 | P1 | `cache-control` pages ISR : à vérifier globalement | Instantanés `/tmp/.../live/*.headers` (`grep -i cache-control`) — audit détaillé requis | Si `no-store` sur pages statiques → surcoût, TTFB élevé. Si `public, max-age=...` sur pages user → fuite session | Audit page-par-page ; `revalidate` explicite sur toutes les routes App Router | @fullstack |
| T11 | P1 | Migration `package.json#prisma` → `prisma.config.ts` en attente (warning Prisma 7) | Mémo s10 backlog #6 | Warning verbeux en build, obsolescence prévisible à la prochaine bump Prisma | Créer `prisma.config.ts` + migration | @fullstack |
| T12 | P1 | Aucune stratégie de backup PostgreSQL Neon documentée en clair (fréquence, rétention, restauration) | `docs/infra/deployment.md` mentionne "Neon.tech" sans plan backup | Perte de données possible sur incident Neon free tier. RPO/RTO inconnus | Documenter : dump quotidien via cron GitHub Actions → stockage R2/Backblaze, rétention 30j, test restauration mensuel | @infrastructure |
| T13 | P1 | Aucune SPF/DKIM/DMARC vérifiée dans doc infra (Resend) | Non mentionné dans `deployment.md` ni dans les mémos | Emails CEO (rapport hebdo + inbound) risquent spam. Délivrabilité < 95% probable si non configuré | Vérifier DNS deviens-marrant.fr : `dig TXT deviens-marrant.fr` (SPF), `dig TXT resend._domainkey.deviens-marrant.fr`, `dig TXT _dmarc.deviens-marrant.fr` | @infrastructure |
| T14 | P1 | Aucun rate-limiting middleware documenté (protection endpoints IA coûteux : `/api/joke/generate`, `/api/ceo/*`) | Grep à faire ; `deployment.md` silencieux | Une IP peut vider le budget Anthropic ($10/j max théorique). Aucune protection anti-scraping | Middleware `@upstash/ratelimit` (free) ou fait maison avec Redis interne | @fullstack |
| T15 | P2 | `.replit` : le `[deployment].build` inclut `prisma db push` + `tsx prisma/seed.ts` — pas de `migrate deploy` | `.replit` ligne 8 | Migrations de **données** (ex. `8_cleanup_wildcard`) ne s'appliquent pas au build → contournement via startup-tasks. Doc s10 accepte le trade-off | Documenter explicitement dans `deployment.md` que l'app compense au boot. À revisiter si baseline `_prisma_migrations` un jour | @infrastructure (doc) |
| T16 | P2 | Aucun `.env.example` audité (pas dans repo racine ; peut-être dans apps/web/) | À grep : `find . -name '.env.example'` | Onboarding dev = tâtonnement. Risque de secret oublié en Replit Secrets | Consolider un `.env.example` à jour à la racine ou apps/web + doc `docs/infra/env.md` | @infrastructure |
| T17 | P2 | Pas de pipeline CI GitHub Actions actif documenté (build/lint/tests) | Voir `.github/workflows/` — à lister | Régression rattrapée en local uniquement. Zéro filet PR-side | Créer `.github/workflows/ci.yml` (lint + tsc + jest, PAS de deploy — Replit gère) | @infrastructure |
| T18 | P2 | Historique : Session 8 mémo mentionne 4 P0 ouverts non forcément fermés dans mémo s10 | `project-context.md` s8 (l232) vs s10 (l180-207) | Traçabilité imparfaite entre sessions | @orchestrator : gate de fermeture explicite en clôture session | @orchestrator |

---

## 3. Plan de merge & déploiement recommandé

Objectif : passer les 50 commits en prod **sans casser plus qu'ils ne réparent**. Ordre non négociable.

### Étape 0 — Snapshot avant tout (5 min)
```bash
# Depuis Replit shell (pas local — la DB doit être la prod)
pg_dump "$DATABASE_URL" | gzip > /tmp/pre-s10-merge-$(date +%Y%m%d).sql.gz
# Télécharger le dump localement (via l'onglet Files Replit) pour rollback
```
Preuve à conserver : taille du dump + hash SHA256.

### Étape 1 — Vérifier l'écart complet (10 min)
```bash
cd /home/user/Marrant
git fetch origin master --depth=200  # défensif si shallow
git log --oneline origin/master..HEAD | wc -l          # attendu : 50
git diff --stat origin/master..HEAD | tail -5          # volume de code
git diff --name-only origin/master..HEAD | grep prisma # migrations Prisma en attente
```
Migrations attendues (source mémos) : `5_add_ceo_tables`, `6_fix_pushtoken_webhookevent_schema`, `7_add_joke_decryptage`, `8_cleanup_wildcard_socialpost`.

### Étape 2 — Rebase / merge en local d'abord (30 min)
```bash
# Sur une branche jetable pour tester le merge SANS toucher à la branche active
git checkout -b test-merge-master origin/master
git merge --no-commit --no-ff claude/marrant-s10-session-recovery-CtZyw
git status  # afficher les conflits éventuels
```
Si conflit → résoudre manuellement, JAMAIS `--strategy=ours` sur les fichiers `prisma/schema.prisma` ou `next.config.js`.

### Étape 3 — Build check obligatoire (Règle n°6 CLAUDE.md) (10 min)
```bash
cd apps/web && npm install                           # les 12 vulns apparaîtront ici
npx prisma generate
npx tsc --noEmit                                     # bloquant — 0 erreur
npx next lint                                        # warnings OK, erreurs NOK
npm run build                                        # bloquant
```

### Étape 4 — Ouvrir la PR contre le bon `master` (5 min)
```bash
# Vérifier d'abord la default branch
gh repo view --json defaultBranchRef -q .defaultBranchRef.name
# Si != master : Settings > Branches > Default branch = master
gh pr create --base master --head claude/marrant-s10-session-recovery-CtZyw \
  --title "s10 : merge 50 commits (CEO Phase 5 + vannes pédagogiques + fixes P0)" \
  --body-file docs/infra/audit-global-s11.md
```

### Étape 5 — Merger + tag (5 min)
```bash
# Après review (au minimum @reviewer + Thomas)
gh pr merge --merge --delete-branch=false  # squash = perte historique s8/s9/s10, éviter
git tag -a v-s10-merge -m "Merge session 10 dans master (2026-09-29)"
git push origin v-s10-merge
```

### Étape 6 — Deploy Replit + vérifs post-boot (30 min)
1. Replit → **Deploy** (le build `.replit` fait `prisma generate` + `prisma db push` + `tsx prisma/seed.ts` + `npm run build`).
2. Vérifier les logs de démarrage (`instrumentation.ts` → `startup-tasks.ts`) :
   - `[startup] décryptages appliqués : 265/265.`
   - `[startup] vannes faibles désactivées : 24`
   - Pas de crash `withDbRetry`
3. Smoke tests GET :
   - `curl -I https://deviens-marrant.fr/` → 200 + headers HSTS
   - `curl -sI https://deviens-marrant.fr/vannes | head -20`
   - Visite manuelle `/admin/ceo` → onglets se chargent
4. Vérifier absence d'alertes email (Neon cold start) sur 24 h.

### Étape 7 — Rollback si nécessaire
Si une erreur critique post-deploy : Replit → Deployments → **Rollback to previous** (garde le pre-merge). DB : restaurer le dump étape 0 UNIQUEMENT si corruption schéma (migrations idempotentes → rare).

---

## 4. Actions manuelles fondateur (à cocher)

- [ ] **Configurer 12 secrets Replit** (mémo s10 §B.2 — 5 bloquants cœur : `DATABASE_URL`, `CRON_SECRET`, `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, `RESEND_API_KEY`).
- [ ] **Changer la default branch GitHub** : Settings > Branches → default = `master`.
- [ ] **Merger la branche s10** dans master via PR (plan §3 étapes 2 à 5).
- [ ] **Deploy Replit** après merge + vérifier logs boot.
- [ ] **Vérifier DNS email** : `dig TXT deviens-marrant.fr`, `dig TXT _dmarc.deviens-marrant.fr`, `dig TXT resend._domainkey.deviens-marrant.fr`.
- [ ] **Créer compte UptimeRobot** (free 50 monitors) → 5 URLs surveillées (`/`, `/vannes`, `/blog`, `/api/health`, `/parcours`).
- [ ] **Créer compte Sentry** (free 5K events) → suivre wizard Next.js.
- [ ] **Toggle CEO** post-deploy : `/admin/ceo` → enabled=true, dryRun=false, valider les 3 premiers drafts avant scale.
- [ ] **Signer 3 DPA** : Anthropic, Resend, Neon (juridique — cf mémo s10 action #3).
- [ ] **Configurer webhook Resend Inbound** dashboard : `https://deviens-marrant.fr/api/webhooks/resend-inbound` + `RESEND_WEBHOOK_SECRET`.

---

## 5. Résumé exécutif (P0/P1)

1. **T01 (P0)** : 50 commits non mergés — la prod est en mars 2026, tout le travail s8/s9/s10 est invisible. Trou n°1, tout le reste en découle.
2. **T02 (P0)** : Default branch GitHub = branche orpheline du 11/03. À rebasculer sur master.
3. **T03 (P0)** : CSP absent sur toutes les pages. XSS élargi, injection UGC vecteur ouvert.
4. **T04 (P0)** : Permissions-Policy absent. Caméra/mic/geoloc autorisés par défaut.
5. **T05 (P0)** : 37 vulns npm cumulées (12 web + 25 root) non traitées depuis s6. Dette OWASP A06.
6. **T06 (P0)** : Aucun `/api/health` documenté. Monitoring externe impossible tant que non créé.
7. **T07 (P1)** : `ignoreBuildErrors:true` dans `next.config.js` — bugs TSC en prod silencieux.
8. **T08 (P1)** : Aucun monitoring externe (uptime, Core Web Vitals continus).
9. **T09 (P1)** : Sentry absent — erreurs runtime invisibles.
10. **T12 (P1)** : Aucune stratégie backup Neon documentée. RPO/RTO inconnus.
11. **T13 (P1)** : SPF/DKIM/DMARC Resend non vérifiés en doc infra.
12. **T14 (P1)** : Aucun rate-limiting sur endpoints IA — vidage budget Anthropic possible.
13. **Progression session → session** : **négative sur l'opérationnel**. Le code progresse, la prod stagne depuis mars.
14. **Prochaine action non négociable** : plan §3 étapes 0 → 6 avant tout nouveau chantier s11.
15. **Verdict global** : **NO-GO nouveaux chantiers** tant que T01 non fermé. Merge + deploy = pré-requis absolu.

---

**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/infra/audit-global-s11.md`
- Décisions prises : verdict CRITIQUE (42/100), 6 P0 identifiés dont T01 (merge master) bloquant tout le reste
- Points d'attention : la prod est ~7 mois derrière la branche. Chaque jour supplémentaire aggrave la dette. Aucune modification code n'a été faite (audit lecture seule)
- **Actions Replit requises** : voir §4 checklist fondateur (12 items). Prioriser : (1) merge + deploy, (2) secrets Replit, (3) UptimeRobot + Sentry
