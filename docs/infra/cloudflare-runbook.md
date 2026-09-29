# Runbook Cloudflare Workers : deviens-marrant.fr (étape B, code)

Plan : `migration-cloudflare-plan.md` · État des accès : `migration-etat-s12.md` · Variables : `cloudflare-env.md`.
Toutes les commandes se lancent depuis `apps/web`. **Rien ici ne touche le site Replit ni le DNS.**

## 0. Ce qui a été fait dans le code (s12)

| Élément | Fichier |
|---|---|
| Adaptateur OpenNext **1.15.1** (dernière version dont la plage `next` inclut `^14.2.35` ; 1.16.0+ exige Next 15) + wrangler 4.143.1 | `package.json` (devDependencies) |
| Config OpenNext (cache ISR sur R2) | `open-next.config.ts` |
| Config Worker `marrant` (nodejs_compat, ASSETS, R2, Hyperdrive, Images, crons, aucune route) | `wrangler.jsonc` |
| Entrée Worker : fetch OpenNext + handler `scheduled` | `cloudflare/worker.ts` |
| Prisma sous Workers : client WebAssembly + `@prisma/adapter-pg` sur `env.HYPERDRIVE`, 1 client par invocation | `src/lib/prisma-workers.ts`, `src/lib/prisma.ts` |
| Planificateur : jobs extraits tels quels, tick HTTP | `src/lib/scheduler/*`, `src/app/api/cron/scheduler-tick` |
| Tâches de démarrage exposées | `src/app/api/cron/startup-tasks` |
| Images Instagram : R2 `SOCIAL_IMAGES` + rendu `next/og` sous Workers | `src/lib/social/image-storage.ts`, `image-generator.ts` |
| Build CF uniquement (`MARRANT_BUILD_TARGET=cloudflare`) : resvg-js et SDK Replit remplacés par des modules vides, Prisma en variante `workerd` | `next.config.js` |

Scripts : `npm run build:cf` (build OpenNext), `npm run preview:cf` (Worker en local), `npm run deploy:cf` (déploiement). Le build Replit (`npm run build` racine) est inchangé.

## 1. Prérequis Cloudflare (droits manquants au 29/09, voir `migration-etat-s12.md`)

Le token `CLOUDFLARE_DM_TOKEN` doit recevoir : **Workers Scripts (écriture)**, **sous-domaine workers.dev (écriture)**, **R2 (écriture)**, **Hyperdrive (écriture)**. Puis :

```bash
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_DM_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"   # le vrai Account ID (pas CLOUDFLARE_DM_ID)
npx wrangler whoami
```

## 2. Ressources à créer (une fois)

```bash
npx wrangler r2 bucket create marrant-next-cache
npx wrangler r2 bucket create marrant-social-images
# Chaîne Neon DIRECTE (sans -pooler) de la branche de test ; Hyperdrive fait le pooling.
npx wrangler hyperdrive create marrant-neon --connection-string="$NEON_DATABASE_URL"
```

Reporter l'`id` renvoyé par Hyperdrive dans `wrangler.jsonc` (`hyperdrive[0].id`, actuellement le placeholder `000…0`) et commiter.

## 3. Secrets

Liste complète et classement : `cloudflare-env.md`. Pour chaque secret : `npx wrangler secret put NOM` (saisie masquée). Pendant les tests `workers.dev` : `NEXTAUTH_URL` et `CRON_ORIGIN` = URL `https://marrant.<sous-domaine>.workers.dev`, clés Stripe **de test**. Ne pas définir `DATABASE_URL` (Hyperdrive).

## 4. Build, test local, déploiement workers.dev

```bash
# Build : variables de build de cloudflare-env.md §3 dans l'environnement.
# DATABASE_URL au build : chaîne Neon directe (pages ISR prérendues avec les vraies données).
npm run build:cf

# Test local (miniflare, aucun appel API) : base via chaîne locale
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgresql://..." npm run preview:cf

# Déploiement sur *.workers.dev uniquement (aucune route/domaine dans wrangler.jsonc).
# Remplit aussi le cache R2 avec les pages prérendues au build.
npm run deploy:cf
```

Limite de l'environnement Claude : il ne peut pas ouvrir de connexion Postgres TCP. Un build lancé ici prérend les pages ISR (`/blog`, `/vannes/[slug]`, `/videos/[slug]`, `/conseils/[slug]`, `/parcours/[slug]`, `sitemap.xml`) avec leurs données de repli, qui restent servies jusqu'à leur revalidation (1 h à 24 h). Pour un déploiement représentatif, lancer `build:cf` là où Neon est joignable (GitHub Actions ou poste de Thomas).

Juste après chaque déploiement, lancer les tâches de démarrage (idempotentes) :

```bash
curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://marrant.<sous-domaine>.workers.dev/api/cron/startup-tasks
```

## 5. Crons

| Replit (avant) | Cloudflare (après) |
|---|---|
| `setInterval` 15 min dans `instrumentation.ts`, 11 jobs en séquence | Cron `*/15 * * * *` → `/api/cron/scheduler-tick` → mêmes 11 jobs, même ordre (`src/lib/scheduler/jobs.ts`, code partagé) |
| Tâches de démarrage à T+30 s au boot | Cron `0 1 * * *` → `/api/cron/startup-tasks` + appel manuel après déploiement |

Fenêtres UTC inchangées (codées dans les jobs, pas dans les crons) : contenu quotidien 5h + rattrapage 7h-22h ; article SEO lundi 9h-10h + rattrapage mardi/mercredi ; plans mensuels du 28 au 31 ; posts sociaux 4h + rattrapage 6h-23h ; publication et analytics sociales à chaque tick ; audit SEO le mercredi ; rapport SEO le 1er du mois ; CEO tick 2h-4h ; KPIs CEO 5h ; relecture corpus 3h-4h.

**Interrupteur** : `CRON_ENABLED` vaut `"false"` dans `wrangler.jsonc`, les crons ne font rien pendant l'étape B. Les routes restent appelables à la main (Bearer `CRON_SECRET`) pour tester chaque job. À la bascule (étape D) : passer `CRON_ENABLED` à `"true"` et redéployer.

Test local des crons :

```bash
echo 'CRON_ENABLED=true' >> .dev.vars    # .dev.vars est ignoré par git
npx wrangler dev --test-scheduled
curl "http://localhost:8787/__scheduled?cron=*/15+*+*+*+*"   # tick
curl "http://localhost:8787/__scheduled?cron=0+1+*+*+*"      # tâches de démarrage
```

Limites à surveiller (Workers payant, à vérifier sur la doc au moment du déploiement) : un cron à intervalle < 1 h dispose de 30 s de CPU, 15 min de durée. Les appels LLM sont de l'attente réseau (hors CPU), mais un tick cumulant CEO tick (jusqu'à 300 s) et relecture du corpus (3h-4h UTC) peut approcher les 15 min : surveiller les logs `[scheduler-tick]` et `[cf-cron]`. Un appel HTTP manuel de `/api/cron/startup-tasks` est soumis à la limite CPU des requêtes HTTP (30 s par défaut, `limits.cpu_ms` dans `wrangler.jsonc` si besoin).

## 6. Retour arrière

- **Code** : additif. Sans `MARRANT_BUILD_TARGET`, `next.config.js` est identique ; sous Node, `prisma.ts`, `image-storage.ts`, `image-generator.ts` et `seo-audit` suivent le chemin d'avant. Retour complet : `git revert` des commits `feat(cf)`.
- **Worker** : `npx wrangler rollback` (version précédente) ou `npx wrangler delete marrant` (sans effet sur Replit).
- **Après bascule DNS** : repointer l'enregistrement vers Replit (minutes), voir le plan, étape D.
