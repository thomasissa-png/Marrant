# Journal du lancement de l'espace client (s26, 20/11/2026)

> @infrastructure. Exécution du runbook `docs/infra/lancement-s26-runbook.md` §3 (Phase A, interrupteur FERMÉ).
> Go écrit de Thomas le 20/11/2026 vers 21 h Paris (« go! ») pour la Phase A, commit `<shaA>` = `86f2be81`.
> Aucune valeur de secret dans ce journal. Fichiers de travail hors dépôt : `/root/lancement-s26/`.

## Partie 1 : A1, A2, A4 sans bascule (A3, bascule, A5, A6 non faits dans cette partie)

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 20:02 | contrôle d'entrée | `git rev-parse HEAD` = `86f2be81db3f8d124addb0ac04d25d46ad6b7447`, `git status --short` vide ; variables de build et jetons présents (noms seulement) |
| 20:02 | A1 N-1 | `wrangler deployments list` : `5504e970-5c1d-496d-a90a-3eaaf0db9846` à 100 % (déployée le 08/11 13:03 UTC), conforme. **N-1 = `5504e970…`** |
| 20:02 | A1 en-têtes | `/root/lancement-s26/entetes-avant.txt` (25 lignes, HTTP/2 200, HSTS/CSP/X-Frame présents) |
| 20:02 | A2 sauvegarde | branche Neon `sauvegarde-avant-espace-s26` créée depuis `production` (`br-withered-dream-b1jzhtnn`), **id `br-plain-butterfly-b16lk1qd`**, LSN parent `0/A2A70C0`, créée 20:02:48 UTC ; état `ready` à 20:02:52 ; 0 point de terminaison (aucun calcul) ; liste : `sauvegarde-avant-espace-s26`, `production`, `preversion-s24` |
| 20:03 | A4 interrupteur | `git show 86f2be81:apps/web/src/config/espace-client.ts` : `ESPACE_CLIENT_PUBLIE: boolean = false` ; écart de code avec `d797f083` = `src/config/mesure-usage.ts` seul (+ docs) |
| 20:03-20:04 | A4 build | `build_prod A` en environnement vide : **BUILD OK** (172 pages, `/root/lancement-s26/build-A.log`) ; erreurs Prisma de prérendu attendues (base factice, runbook §2) ; HEAD = `86f2be81` après build |
| 20:04-20:05 | A4 envoi | `upload_prod A` (exit 0, `/root/lancement-s26/upload-A.log`) : **Worker Version ID `c7ace530-0de6-46af-b596-72a43554c9c8`**, préversion `https://c7ace530-marrant.thomas-issa.workers.dev`. **Pas de `wrangler versions deploy`** : `deployments list` à 20:05 = toujours `5504e970…` à 100 % (version envoyée NON servie) |
| 20:05 | A4 préversion | `/` `/vannes` `/conseils` `/parcours` `/carnet` `/register` `/api/health` = 200 ; `/mon-espace` = 404. Conforme |
| 20:05 | A4 préversion, santé | `/api/health` 200, base `up`, `critical` `ok` (Stripe `live`), MAIS `status` `degraded` (prod : `ok`). Seul écart : `checks.content.stock` `stale`, `jokesNeverUsed` = `null`. Cause : `src/lib/scheduler/prepared-content.ts` filtre `Joke.humourNoir` (migration 19), colonne absente tant que A3 n'est pas jouée ; le comptage échoue proprement (`.catch(() => null)`). Attendu avant A3 ; à recontrôler après A3 (doit repasser `ok`). **Conséquence : ne pas basculer `c7ace530` avant A3** (ordre du runbook A3 puis A4) |

**Fin de la partie 1 (20:06 UTC).** Non faits, en attente du message de l'orchestrateur : A3 (migrations), bascule, A5, A6.

## Partie 2 : A3, bascule, A5, A6 (go de l'orchestrateur après CI verte de `86f2be81`, run 44807615650, 4 jobs `success`)

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 20:22 | contrôle d'entrée | HEAD du dépôt = `1b718fa9` (commits de journal et de `recalcul-caps --neon` après `86f2be81`) ; `prisma/migrations` inchangées entre `86f2be81` et HEAD ; la version envoyée reste le build de `86f2be81` |
| 20:23:00-20:23:08 | A3 migrations | 18 à 26 dans l'ordre, `OK` 9 fois (`/root/lancement-s26/migrations-A3.log`), aucun `ECHEC` |
| 20:23 | A3 contrôle | 11 tables non nulles ; `n` = 2 (`Joke.humourNoir`, `EspaceCompte.premierPasLe`) ; `u` = 0. Rejeu de la boucle : `OK` 9 fois (idempotent) |
| 20:23 | A4 préversion (re) | 7 pages 200, `/mon-espace` 404 ; `/api/health` `ok` (`stock` `ok`, `jokesNeverUsed` = 48 comme en prod) ; prod `5504e970` toujours `ok` après migrations |
| 20:23:51 | A4 bascule, 1er essai | `-m` refusé par wrangler 4.143.1 (« Unknown argument: m ») : **rien déployé**, `5504e970` toujours à 100 %. Écart du runbook : `versions deploy` n'accepte que `--message` (`rollback` accepte bien `-m`) |
| 20:24:11 | A4 bascule | `npx wrangler versions deploy c7ace530-…@100% -y --message "s26 A ferme 86f2be81"` : SUCCESS ; `deployments list` = **`c7ace530-0de6-46af-b596-72a43554c9c8` à 100 %**. N-1 = `5504e970…` |
| 20:24 | après bascule | 7 pages publiques 200 ; `/api/health` `ok` (base `up`, `critical` `ok`, contenu `ok`) ; `wrangler tail` lancé en fond (`/root/lancement-s26/tail-A.log`) |
| 20:24:59 | A5 démarrage, 1er appel | `startup-tasks` HTTP 200 en 12,9 s (`success`, 12 433 ms). Journal : « défi vidéo 39 s24 : 1 fiche corrigée » ; « remplacements vidéo s26 v1 : 4 vidéo(s) remplacée(s), 0 refus garde-fou, 0 déjà faite(s) (3 en attente de textes) » ; aucun échec ni « GARDE-FOU ». `warn` attendus : lettres 2026-11, W46 et W47 déjà envoyées, ignorées |
| 20:25:30 | A5 démarrage, 2e appel | HTTP 200 en 10,4 s ; remplacements : 0 remplacée(s), 4 déjà faite(s) ; défi 39 silencieux (déjà posé) ; rien de neuf |
