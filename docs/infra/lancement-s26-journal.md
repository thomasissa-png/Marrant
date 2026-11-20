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
| 20:26 | A6 codes | 13 pages 200 (`/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/parcours/repartie`, `/carnet`, `/carnet/2026-11`, `/confidentialite`, `/cgu`, `/register`, `/retractation`, `/abonnement`) ; `/profil` 307 vers `/login` ; `GET` et `POST /api/user/xp` 404 ; admin (`/api/admin/resiliations`) 401 ; `curl -sI /mon-espace` = 404 avec `cache-control: private, no-cache, no-store, max-age=0, must-revalidate` ; `robots.txt` : 18 `Disallow: /mon-espace` ; santé `ok`, Stripe `live`, base `up`, mode `stock`, `dailyToday` `ok` |
| 20:26 | A6 textes | `/confidentialite` : « Dernière mise à jour : 20 novembre 2026 », « Usage du service, si tu es ou as été abonné » et « Comprendre où les abonnés avancent ou décrochent » présents, « de façon globale, où les membres » absent ; `/cgu` : « 25 octobre 2026 », identique à N-1 (préversion `5504e970`) ; `/conseils` 0 « exercices concrets et des XP » ; `/parcours` 0 « exercices concrets et des XP à gagner » ; `/register` : « Renoncer au contrat ici » vers `/retractation` |
| 20:27 | A6 carnet | `/carnet/2026-11` : 0 « En avance au pot » et 0 « Le premier arrivé au pot ». Pas un écart : la page publique ne montre que les titres 1 à 3 (et la fiche offerte du 10) ; la fiche 21 est réservée aux abonnés. Même rendu sur la préversion N-1 `5504e970`. Contrôle de ce titre seulement possible avec une session Premium (non faite) |
| 20:26 | A6 en-têtes | `diff` des 7 en-têtes de sécurité (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-*) entre `entetes-avant.txt` et `entetes-apres.txt` : identiques |
| 20:28 | A6 vidéos s26 | Éboué `/videos/fabrice-eboue-les-vegans-plus-rien-a-perdre-cmmp8p3hw0` 200 (sert `gBILqA2eVrk`) ; ancienne `…-plus-rien-a-perdre-spectacle-complet-cmmp8p3hw0` 308 vers la nouvelle. Ngijol `/videos/thomas-ngijol-superman-jamel-comedy-club-cmmp8p0xs0` 200 (sert `l__Xirj2N6c`) ; anciennes `thomas-ngijol-au-jamel-comedy-club-…` et `thomas-ngijol-le-voisin-…` 308 vers la nouvelle (anciens slugs recalculés avec `buildVideoSlug`, pas relevés dans le sitemap avant déploiement) |
| 20:24-20:29 | A6 journaux | tail `pretty` : 68 requêtes, toutes `Ok`, 0 exception, 0 `(error)`, 0 « [mesure] … non enregistré ». Tail JSON (20:28-20:29, passe de 21 adresses + trafic réel) : 0 réponse 5xx, 0 exception ; codes conformes (`/mon-espace` 404, `/profil` 307, le reste 200) |
| 20:29 | état final | `deployments list` : `c7ace530-0de6-46af-b596-72a43554c9c8` à 100 % (« s26 A ferme 86f2be81 »). `ESPACE_CLIENT_PUBLIE = false`. Aucun retour arrière nécessaire |

**Non faits (hors périmètre ou en attente de Thomas)** : signal de la mesure (compte Premium de test, étape 2 de `/parcours/repartie`, 1 `premier_acces_premium` puis effacement sur ordre de Thomas) ; fiche vidéo 39 vue en Premium ; titre « En avance au pot » vu en Premium ; lecture des 4 nouvelles vidéos depuis la France. Aucune action de phase B.

**Écart du runbook à corriger** : §3 A4 bascule, `npx wrangler versions deploy … -m` ne fonctionne pas (wrangler 4.143.1) ; écrire `--message`. Idem en B4. `wrangler rollback -m` fonctionne.

Retour arrière disponible : `cd apps/web && npx wrangler rollback 5504e970-5c1d-496d-a90a-3eaaf0db9846 -m "rollback s26 A" -y`. Sauvegarde de la base : `br-plain-butterfly-b16lk1qd`.
