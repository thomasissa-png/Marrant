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
