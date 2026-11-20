# Runbook du lancement de l'espace client (s26, 20/11/2026)

> @infrastructure, préparé en LECTURE SEULE (aucune écriture en production). Fait foi pour l'ordre : entrée
> « JOUR DU GO (s24) » de `REPLIT_ACTIONS.md` (A, B, C, P0 à P8 de s21). Ce runbook la rend exécutable ICI.
> Rien ne s'exécute sans le « go prod » écrit de Thomas qui nomme le commit exact.

## 1. État constaté (20/11, 19:40 UTC, lecture seule)

| Point | Constat |
|---|---|
| Worker `marrant` | 100 % sur `5504e970-5c1d-496d-a90a-3eaaf0db9846` (08/11 13:03 UTC), conforme à l'attendu |
| Crons | `0 1 * * *` et `*/15 * * * *` (API `schedules`), identiques à `wrangler.jsonc` |
| Santé prod | `/api/health` : `ok`, base `up`, Stripe `live` (5 clés présentes), Resend présent ; `/mon-espace` = 404 |
| Jetons (noms) | `CLOUDFLARE_API_TOKEN` (actif, déploie et lit `marrant`), `CLOUDFLARE_DM_TOKEN` (Hyperdrive, R2), `CLOUDFLARE_ACCOUNT_ID`, `CRON_SECRET`, `ADMIN_PASSWORD`, `NEON_DATABASE_URL`, `GH_TOKEN` |
| Base | `NEON_DATABASE_URL` = même hôte que l'Hyperdrive `fab86e8a…` du Worker (production). **Pas de `DATABASE_URL` dans le shell** |
| Neon (API par le proxy) | projet `summer-mode-45874667`, PG 16, rétention d'historique 6 h ; branches : `production` (`br-withered-dream-b1jzhtnn`, par défaut) et `preversion-s24` |
| Accès SQL | port 5432 FERMÉ ici (`psql`, `pg_dump`, `prisma db execute`, scripts Prisma impossibles) ; lecture OK par WebSocket 443 (`@neondatabase/serverless`, `NODE_USE_ENV_PROXY=1`) |
| Migrations prod | pas de table `_prisma_migrations` (migrations jouées à la main) ; relevé du schéma : 14 et 16 présentes ; **17 à 26 absentes** (0 des 11 tables, ni `Joke.humourNoir`, ni `EspaceCompte.premierPasLe`) |
| Comptes | 19 utilisateurs dont 5 `PREMIUM` ; base 34 Mo |
| Dépôt | branche `claude/ouverture-session-nzwj0w`, HEAD `d797f083`, arbre propre ; CI « Tests CI » en cours sur HEAD (run 44803703082) ; dernière verte : `5a21d746` |
| Variables de build | `INDEXNOW_KEY` et `NEXT_PUBLIC_UMAMI_WEBSITE_ID` du shell = valeurs servies en prod (comparées sans affichage) |

**Migrations à jouer, dans cet ordre** : `18_mesure_usage_s24`, `19_reperage_humour_noir_s24`, `20_espace_compte_s24`,
`21_espace_compteurs_s24`, `22_espace_caps_s24`, `23_espace_cartes_s24`, `24_espace_fiches_s24`,
`25_espace_questions_s24`, `26_espace_premier_pas_s24`. Aucune ajoutée depuis la 26. Relu : toutes en
`CREATE TABLE/INDEX IF NOT EXISTS` et `ADD COLUMN IF NOT EXISTS` ; les seuls `DELETE`/`UPDATE` sont des clauses
`ON DELETE CASCADE / ON UPDATE CASCADE` de clés étrangères. **La 17 (`CancellationFeedback`) n'est PAS à jouer** :
elle suit la page de résiliation (`RESILIATION_PAGE_OUVERTE = false`), le code tolère son absence.

## 2. Préparation (sans écriture en production)

```bash
cd /home/user/Marrant/apps/web && mkdir -p /root/lancement-s26 && O=/root/lancement-s26
export NODE_USE_ENV_PROXY=1 NEON=https://console.neon.tech/api/v2/projects/summer-mode-45874667
```
Outil SQL `$O/neon-sql.mjs` (hors dépôt, déjà créé et essayé en transaction `READ ONLY` avec un bloc `DO $$`) :
```js
import { createRequire } from "node:module"; import fs from "node:fs";
const { Pool } = createRequire(process.cwd() + "/package.json")("@neondatabase/serverless");
const url = process.env.NEON_DATABASE_URL; if (!url) { console.error("NEON_DATABASE_URL absente"); process.exit(2); }
const sql = process.argv[2] === "-c" ? process.argv[3] : fs.readFileSync(process.argv[2], "utf8");
const pool = new Pool({ connectionString: url });
try { const r = await pool.query(sql); for (const x of [].concat(r)) if (x.rows?.length) console.log(JSON.stringify(x.rows)); console.log("OK"); }
catch (e) { console.error("ECHEC", e.code ?? "", e.message); process.exitCode = 1; } finally { await pool.end(); }
```
Fonction de build en environnement vide (vraies valeurs de PRODUCTION reprises du shell, jamais écrites) :
```bash
build_prod() { rm -rf .open-next && env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 \
  HTTPS_PROXY="$HTTPS_PROXY" https_proxy="$HTTPS_PROXY" NO_PROXY="$NO_PROXY" NODE_EXTRA_CA_CERTS="$NODE_EXTRA_CA_CERTS" \
  NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" NEXT_PUBLIC_UMAMI_WEBSITE_ID="$NEXT_PUBLIC_UMAMI_WEBSITE_ID" \
  INDEXNOW_KEY="$INDEXNOW_KEY" RESEND_API_KEY="$RESEND_API_KEY" NEXTAUTH_URL="$NEXTAUTH_URL" \
  DATABASE_URL=postgres://factice:factice@localhost:5432/factice \
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice \
  npm run build:cf > "$O/build-$1.log" 2>&1 && echo BUILD OK; }
upload_prod() { env -i PATH="$PATH" HOME="$HOME" HTTPS_PROXY="$HTTPS_PROXY" NODE_EXTRA_CA_CERTS="$NODE_EXTRA_CA_CERTS" \
  CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgres://factice:factice@localhost:5432/factice \
  npx opennextjs-cloudflare upload 2>&1 | tee "$O/upload-$1.log"; }
```
Variables de build attendues (`docs/infra/cloudflare-env.md` §3) : `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`,
`INDEXNOW_KEY` (fichier prérendu), `RESEND_API_KEY` (module chargé au build), `NEXTAUTH_URL` : toutes du shell de cette
session. Absentes du shell ET de la prod actuelle (rien ne change) : `NEXT_PUBLIC_BASE_URL` (repli `https://deviens-marrant.fr`),
`NEXT_PUBLIC_{GOOGLE,BING}_SITE_VERIFICATION`, `NEXT_PUBLIC_CWV_ENDPOINT`, `NEXT_PUBLIC_SOCIAL_PROFILES` (liste du code),
RevenueCat (mobile). `DATABASE_URL` factice : Neon injoignable en TCP ici (limite connue, `cloudflare-runbook.md` §4),
pages ISR sur leurs données de repli jusqu'à revalidation, comme les déploiements précédents. Secrets d'exécution :
ceux du Worker (34 noms, inchangés), **aucune variable ni secret nouveau** (diff `05bdc98..HEAD` relu).

## 3. Phase A : interrupteur FERMÉ (`ESPACE_CLIENT_PUBLIE = false`)

| Étape | Commande | Attendu / contrôle | Arrêt si |
|---|---|---|---|
| A0 commit de date (@fullstack) | `MESURE_USAGE_DATE_TEXTES` (`src/config/mesure-usage.ts`, « 12 novembre 2026 ») = date de Paris de la mise en ligne, ex. « 20 novembre 2026 » ; commit, push | `gh run list --commit <shaA> --json databaseId,conclusion` puis `gh run view <id> --json jobs --jq '.jobs[]\|[.name,.conclusion]\|@tsv'` : `test`, `lint`, `e2e-local (ferme)`, `e2e-local (ouvert)` = `success` ; `git status --short` vide ; `git rev-parse HEAD` = `<shaA>` nommé par Thomas | CI rouge, arbre sale, autre sha |
| A1 N-1 | `npx wrangler deployments list \| tail -8` ; `curl -sI "https://deviens-marrant.fr/?ne-pas-compter=1" > $O/entetes-avant.txt` | `5504e970` à 100 % ; fichier non vide | autre version : la noter comme N-1, prévenir Thomas |
| A2 sauvegarde | `curl -sS -X POST "$NEON/branches" -H 'content-type: application/json' -d '{"branch":{"parent_id":"br-withered-dream-b1jzhtnn","name":"sauvegarde-avant-espace-s26"}}' \| jq '.branch\|{id,name,current_state}'` (sans point de terminaison : aucun calcul) | `id` `br-…` noté ici ; `curl -sS "$NEON/branches" \| jq -r '.branches[].name'` la liste | erreur (quota de branches, droits) : AUCUNE migration, Thomas |
| A3 migrations | `for m in 18_mesure_usage_s24 19_reperage_humour_noir_s24 20_espace_compte_s24 21_espace_compteurs_s24 22_espace_caps_s24 23_espace_cartes_s24 24_espace_fiches_s24 25_espace_questions_s24 26_espace_premier_pas_s24; do echo "== $m"; node $O/neon-sql.mjs prisma/migrations/$m/migration.sql \|\| break; done` | `OK` 9 fois (NOTICE tolérés) | `ECHEC` : arrêt avant A4 (prod ignore les ajouts, rien à défaire) |
| A3 contrôle | `node $O/neon-sql.mjs -c "select to_regclass('\"UsageEvent\"') a, to_regclass('\"EspaceCompte\"') b, to_regclass('\"EspaceCompteur\"') c, to_regclass('\"CapAnnonce\"') d, to_regclass('\"CarteSuivi\"') e, to_regclass('\"CarteReponse\"') f, to_regclass('\"FicheFait\"') g, to_regclass('\"MissionRetour\"') h, to_regclass('\"UserReplique\"') i, to_regclass('\"EquipeFil\"') j, to_regclass('\"EquipeMessage\"') k; select count(*) n from information_schema.columns where (table_name='Joke' and column_name='humourNoir') or (table_name='EspaceCompte' and column_name='premierPasLe'); select count(*) u from \"UsageEvent\";"` | 11 noms non nuls ; `n` = 2 ; `u` = 0. Rejouer la boucle une 2e fois : `OK` partout (idempotence) | un nul : arrêt |
| A4 build | `git checkout <shaA> && build_prod A` | `BUILD OK` (journal `$O/build-A.log`) ; `git rev-parse HEAD` = `<shaA>` ; `git show <shaA>:apps/web/src/config/espace-client.ts \| grep PUBLIE` = `false` | build rouge : rien n'est en ligne, @fullstack |
| A4 envoi | `upload_prod A` | « Worker Version ID » et URL de préversion `…-marrant.<compte>.workers.dev` notés ; la version N'EST PAS servie | échec : rien en ligne |
| A4 préversion | `P=<url préversion>; for p in / /vannes /conseils /parcours /carnet /register /api/health; do curl -s -o /dev/null -w "$p %{http_code}\n" "$P$p"; done; curl -s -o /dev/null -w '%{http_code}\n' "$P/mon-espace"` | 200 partout, `/mon-espace` 404 | une 5xx : pas de bascule |
| A4 bascule | `npx wrangler versions deploy <versionA>@100% -y --message "s26 A ferme <shaA>"` ; `npx wrangler deployments list \| tail -6` | `<versionA>` à 100 % | pages en 5xx : C tout de suite |
| A5 démarrage | terminal 2 : `npx wrangler tail marrant --format pretty` ; terminal 1 : `curl -sS -m 120 -H "Authorization: Bearer $CRON_SECRET" https://deviens-marrant.fr/api/cron/startup-tasks` | journal : « défi vidéo 39 s24 : 1 fiche corrigée » ; « remplacements vidéo s26 v1 : 4 vidéo(s) remplacée(s), 0 refus garde-fou, 0 déjà faite(s) (3 en attente de textes) » ; aucune ligne d'échec. 2e appel : rien de neuf | « GARDE-FOU » vidéo : non bloquant, @fullstack ; échec d'une tâche : @fullstack, pas de C sauf site cassé |
| A6 contrôles | liste A-P6 de JOUR DU GO, mot pour mot (pages 200, `/profil` 307, `/api/user/xp` 404, `curl -sI /mon-espace` 404 + `no-store`, 18 `Disallow: /mon-espace`, `/confidentialite` datée de A0, `/cgu` inchangée, `/carnet/2026-11` « En avance au pot ») + `diff` des en-têtes de sécurité avec `$O/entetes-avant.txt` (commande de P6 s21) ; s26 : `/register` montre « Renoncer au contrat ici » vers `/retractation` ; 2 fiches vidéo d'Éboué et Ngijol : nouvelle adresse en 200, ancienne en 308 | conformes | écart de texte : @fullstack ; page cassée : C |

Signal de la mesure (A-P6) : compte Premium de test, étape 2 de `/parcours/repartie`, puis
`node $O/neon-sql.mjs -c "select type, count(*) from \"UsageEvent\" group by 1"` → 1 `premier_acces_premium` ; effacement de
cette ligne par Thomas ou sur son ordre (seule écriture manuelle de A, à nommer dans le go).

## 4. Phase B : ouverture (un commit, un déploiement)

| Étape | Commande | Attendu / contrôle | Arrêt si |
|---|---|---|---|
| B0 commit d'activation (@fullstack) | `ESPACE_CLIENT_PUBLIE = true` (`src/config/espace-client.ts`) ; `ESPACE_DATE_TEXTES` (`src/config/textes/espace-confidentialite.ts`, vide) = même date que A0 ; `SEUIL_TOUCHER` laissé à `null` (reco) ; `RESILIATION_PAGE_OUVERTE` reste `false` | CI verte dans les DEUX régimes (mêmes commandes que A0) ; `git show <shaB>:apps/web/src/config/espace-client.ts \| grep PUBLIE` = `true` | CI rouge |
| B1 N-1 | `npx wrangler deployments list \| tail -6` ; `curl -sI … > $O/entetes-avant-B.txt` | N-1 = `<versionA>` | autre : Thomas |
| B2 base | sauvegarde : A2 suffit si B suit A dans l'heure, sinon 2e branche `sauvegarde-avant-ouverture-s26` ; rejouer le contrôle A3 | 11 tables, 2 colonnes | écart : arrêt |
| B4 build, envoi | `git checkout <shaB> && build_prod B && upload_prod B` ; préversion : `/mon-espace` sans session = 200, aperçu verrouillé (nav v6 s25, sans redirection), `no-store`, `noindex`, aucune donnée de compte ; pages publiques 200 | | 5xx : pas de bascule |
| B4 bascule | `npx wrangler versions deploy <versionB>@100% -y --message "s26 B ouverture <shaB>"` | `<versionB>` à 100 % | 5xx : C (rollback vers A) |
| B5 caps (avant toute annonce) | (1) à sec : `NODE_USE_ENV_PROXY=1 npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/recalcul-caps.ts --neon --a-sec` ; (2) écriture : même commande avec `--ecrire` à la place de `--a-sec` ; (3) contrôle : (1) rejouée. Depuis `apps/web`, URL lue dans `NEON_DATABASE_URL` (autre variable : `--url-env=NOM`), WebSocket 443 (bloquant 2 levé) | (1) « Base visée (WebSocket Neon) : <hôte de prod> », une ligne par compte touché, 5 abonnés `PREMIUM` lus au plus ; (2) mêmes comptes et totaux, « lignes silencieuses écrites » = celles de (1) ; (3) « niveaux relevés : 0 », « lignes silencieuses qui seraient écrites : 0 » | hôte inattendu en (1) : arrêt avant (2) ; code de sortie 2 : variable absente ou option refusée, rien n'est lu |
| B5 G4 | 3 comptes de test de Thomas ramenés à leurs étapes (identifiants hors dépôt, Thomas) | | pas d'accord Q6 : ne rien toucher |
| B5 démarrage | même appel qu'en A5 | journal sans échec, rien de neuf | |
| B6 contrôles | liste B-P6 (a) à (f) de JOUR DU GO ; en plus : `curl -s https://deviens-marrant.fr/sitemap.xml \| grep -c mon-espace` = 0 ; `curl -sI https://deviens-marrant.fr/mon-espace` = 200 (aperçu, `no-store`, `noindex`) ; `npx wrangler tail` sans 500 pendant 15 min | conformes | page cassée ou fuite de données : C immédiat |

**Vérifications de Thomas (vrai téléphone, 375 px, après B6)** : (1) achat Stripe, voir bloquant 4 ; (2) son compte Premium :
Aujourd'hui, Quoi répondre (une fiche, « Fait », Situation suivante), Favoris, cloche, question à l'équipe puis réponse
depuis `/admin/questions` et e-mail reçu ; (3) navigation privée : accueil → Quoi répondre → tuile fermée → offre →
`/abonnement` → `/register` (lien de renonciation visible) ; (4) mot de passe oublié et lettre avec sa vraie adresse :
e-mails en boîte de réception, liens vers https://deviens-marrant.fr ; (5) une vidéo remplacée en 4G ; (6) journaux
Cloudflare sans 500 pendant 1 h. Trace : heure, `<shaA>`, `<shaB>`, versions et N-1 dans `REPLIT_ACTIONS.md`.

## 5. Retour arrière (C)

- **B seul** (espace à refermer, site sain) : `cd apps/web && npx wrangler rollback <versionA> -m "refermer espace s26" -y` (secondes).
- **Tout** (A et B) : `cd apps/web && npx wrangler rollback 5504e970-5c1d-496d-a90a-3eaaf0db9846 -m "retour avant s26" -y`,
  puis `npx wrangler deployments list | tail -6` et pages de A6. Perdu : correctifs publics de A (e-mail de 254 caractères,
  lien `/register`, `/api/user/xp` revient). Hors urgence, préférer un commit `ESPACE_CLIENT_PUBLIE = false` (CI, build, ~40 min).
- **Migrations** : additives, ignorées par `5504e970` et par A : **on ne les défait pas** (aucun `DROP`). Données d'abonnés
  écrites entre-temps (fils, répliques, cartes, `UsageEvent`) gardées, supprimées en cascade avec un compte supprimé.
- **Restent en base** : niveaux relevés par `recalcul-caps` (jamais abaissés) ; défi de la vidéo 39 et 4 vidéos remplacées
  (SQL de retour en tête de `src/lib/video-defi-39-s24.ts` et `src/lib/video-remplacements-s26.ts`, marqueurs `DataPatch`
  gardés) ; e-mails partis.
- **Restauration de la base** (seulement corruption avérée, décision de Thomas) : branche de A2 ; jamais par réflexe.

## 6. Bloquants et ambiguïtés (recommandation)

1. **Port 5432 fermé** : `psql`, `pg_dump`, `prisma db execute` de JOUR DU GO impossibles ici, et `$DATABASE_URL` n'existe
   pas (c'est `NEON_DATABASE_URL`). Reco : migrations par `$O/neon-sql.mjs` (WebSocket, testé en lecture) ; sauvegarde par
   branche Neon (A2), pas `pg_dump`.
2. **`recalcul-caps.ts` (B5) en Prisma TCP** : **levé (s26 lancement)**. Option `--neon` (PrismaNeon, Pool WebSocket), à sec par
   défaut (`--a-sec`), `--ecrire` explicite ; essayée de bout en bout par WebSocket sur une base locale jetable (relais local,
   2e passage à 0). Répétition possible sur `preversion-s24` avec `--url-env=NOM` (variable qui porte l'URL de la branche).
3. **Portes D non levées dans les traces** : G2 (`data/espace/ecouter.json` et `bonus.json` = `[]`, « partent
   obligatoirement avec l'espace »), G4, G6 (0 vanne marquée `humourNoir` possible avant la 19), G7, avocat, préproduction
   P-1 à P-10. Reco : le go B de Thomas doit dire explicitement s'il ouvre sans elles.
4. **Achat de test** : B-P7 exclut tout achat réel et renvoie à la préproduction (P-2), jamais faite (préversion sans
   Stripe). Reco : clés Stripe de TEST de Thomas sur `marrant-preversion` avant B (~20 min) ; sinon achat réel à 1,99 €
   par Thomas puis renonciation `/retractation`, à décider par lui.
5. **« Replit déploie la branche »** (JOUR DU GO, CLAUDE.md) : faux depuis le 30/09 (Workers). Reco : `wrangler` ci-dessus.
6. **CI** : HEAD `d797f083` en cours ; A0 et B0 ajoutent 2 commits (~18 min de CI chacun). Reco : B0 juste après A0, CI en parallèle.
7. **Date** : si B passe minuit (Paris), A0 et B0 portent des dates différentes ; reco : une seule date, celle de B.
8. **Écart d'entrées** : A-P5 n'attend que la vidéo 39 ; s26 ajoute les 4 remplacements (journal ajouté en A5).

Durée estimée : A ≈ 1 h (CI 20 min, sauvegarde et migrations 10, build et envoi 15, bascule et contrôles 15) ; B ≈ 1 h 15
(CI parallèle, build 15, caps et comptes 15, contrôles 20, Thomas 30) ; **≈ 2 h 15 à 2 h 45** hors bloquant 4.
