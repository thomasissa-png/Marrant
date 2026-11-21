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

## Phase B : ouverture (go écrit de Thomas pour la phase B du 20/11, relayé par l'orchestrateur), partie 1 sans bascule

`<shaB>` = `9ffa6311` (contient `809c5f1f` 3 vidéos, `e5be48d3` B0 `ESPACE_CLIENT_PUBLIE = true`, `9ffa6311` correctif e2e). Bascule en attente de la CI de `9ffa6311` et du feu vert de l'orchestrateur.

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 21:58 | B1 N-1 | `deployments list` : **`c7ace530-0de6-46af-b596-72a43554c9c8` à 100 %** (« s26 A ferme 86f2be81 »), conforme ; en-têtes dans `/root/lancement-s26/entetes-avant-B.txt` (HTTP/2 200, 25 lignes) |
| 21:58 | B2 sauvegarde | plus d'une heure après A2 : branche Neon `sauvegarde-avant-ouverture-s26`, **id `br-plain-silence-b1pcw0xb`**, depuis `production`, LSN parent `0/A3352E8`, créée 21:58:12 UTC, `ready`, 0 point de terminaison |
| 21:58 | B2 contrôle A3 | 11 tables non nulles ; `n` = 2 ; `u` = 0. `apps/web/prisma` et `wrangler.jsonc` inchangés entre `86f2be81` et `9ffa6311` (aucune migration nouvelle) |
| 21:59 | B4 préparation | `git show 9ffa6311:apps/web/src/config/espace-client.ts` : `ESPACE_CLIENT_PUBLIE = true` ; `ESPACE_DATE_TEXTES = "20 novembre 2026"` ; `RESILIATION_PAGE_OUVERTE = false`. Aucun fichier de dépendances ou de configuration modifié depuis `86f2be81`. Build hors du dépôt principal : `git archive 9ffa6311` dans `/root/lancement-s26/export-B`, `node_modules` par liens durs (`cp -al`, 0 lien symbolique), `node_modules/.prisma` en copie réelle |
| 21:59-22:01 | B4 build | `build_prod B` dans l'export : **BUILD OK** (172 pages, `/root/lancement-s26/build-B.log`) ; dépôt principal intact (`git status` : journal seul) |
| 22:01 | B4 envoi | `upload_prod B` depuis l'export (exit 0, `/root/lancement-s26/upload-B.log`) : **Worker Version ID `e9def49b-e40d-4cc3-90ae-5ba2bed1d7f3`**, préversion `https://e9def49b-marrant.thomas-issa.workers.dev`. **Pas de bascule** : `deployments list` = toujours `c7ace530…` à 100 % ; prod `/mon-espace` = 404 |
| 22:02 | B4 préversion, conformes | 14 pages publiques 200 (`/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/parcours/repartie`, `/carnet`, `/carnet/2026-11`, `/confidentialite`, `/cgu`, `/register`, `/retractation`, `/abonnement`, `/blog`) ; `/api/health` `ok` (Stripe `live`, base `up`, contenu `ok`) ; `/profil` 307 vers `/login` ; `/resiliation` et `/resiliation/confirmee` 404 ; `/api/user/xp` 404 ; `/api/espace/caps` sans session 401 `private, no-store` ; `/confidentialite` et `/cgu` : « Dernière mise à jour : 20 novembre 2026 » ; sitemap : 0 `mon-espace` ; robots : 18 `Disallow: /mon-espace` |
| 22:02 | B4 préversion, écart avec le runbook | `/mon-espace` sans session = **200** (et non 307 vers `/login`) : aperçu verrouillé « Aujourd'hui » (`ApercuAujourdhui`, liens `/login?callbackUrl=%2Fmon-espace`), `cache-control: private, no-cache, no-store`, `x-robots-tag: noindex`, meta `noindex, follow`. Voulu par le code (nav v6, s25 : « visiteur et inscrit gratuit, l'aperçu à cette adresse, sans redirection », `src/app/(dashboard)/mon-espace/page.tsx`, tests `src/__tests__/espace/aujourdhui-*.test.tsx`) : l'attendu « 307 » du runbook (§4 B4, B6) est antérieur. Idem `/mon-espace/questions`, `/quoi-repondre`, `/bibliotheque`, `/repliques`, `/s-entrainer` = 200 (aperçus) ; `/mon-espace/bonus/x` 307 vers `/login` ; `/mon-espace/lettres` 308 vers `/lettre`. Aucune donnée de compte dans la réponse. À trancher par l'orchestrateur avant bascule |

**Fin de B partie 1 (22:03 UTC).** Non faits, en attente du feu vert : bascule, `recalcul-caps`, B5 démarrage, B6.

### Phase B, partie 2 (feu vert de l'orchestrateur : CI de `9ffa6311` verte, run 44824841347 ; aperçu `/mon-espace` 200 confirmé voulu)

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 22:19 | B4 bascule | `npx wrangler versions deploy e9def49b-…@100% -y --message "s26 B ouverture 9ffa6311"` **refusée par le système de permissions de la session** (action de production bloquée avant exécution). Non contournée. Vérifié en lecture : `c7ace530…` toujours à 100 %, prod `/mon-espace` 404, santé `ok`. **Rien n'a changé en production** |
| 22:20 | B5 caps, à sec (lecture seule) | `recalcul-caps.ts --neon --a-sec` depuis l'export de `9ffa6311` : hôte affiché = hôte de `NEON_DATABASE_URL` (production), comparé sans affichage ; 2 comptes abonnés actifs lus (≤ 5) ; niveaux relevés : 0 ; 1 ligne silencieuse serait écrite (1 compte, `APPRENTI` inchangé, cap 2, aucun bonus). Journal : `/root/lancement-s26/caps-a-sec-1.log` |

**Arrêt (22:21 UTC)** : bascule, `--ecrire`, B5 démarrage et B6 non faits, faute de permission pour la bascule. Reprise dès que Thomas aura autorisé l'action (règle de permission ou exécution par lui-même).

### Phase B, partie 3 (après la bascule faite par l'orchestrateur sur accord écrit de Thomas « lance la bascule B »)

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 21/11 09:06:30 | B4 bascule (orchestrateur) | **`e9def49b-e40d-4cc3-90ae-5ba2bed1d7f3` à 100 %** (« s26 B ouverture 9ffa6311 »), N-1 = `c7ace530…` ; revérifié par `deployments list` à 09:07 |
| 09:07 | tail | `wrangler tail marrant --format json` en fond (`/root/lancement-s26/tail-B.jsonl`) |
| 09:07:34 | B5 caps, à sec de vérification | identique à celui du 20/11 22:20 : hôte de production (comparé sans affichage), 2 abonnés actifs lus, 0 niveau relevé, 1 ligne silencieuse |
| 09:07:53 | B5 caps, `--ecrire` | « Recalcul appliqué (silencieux) » : 2 abonnés lus, 0 niveau relevé, 1 ligne silencieuse écrite (1 compte, `APPRENTI` inchangé, cap 2, aucun bonus) |
| 09:07:58 | B5 caps, à sec de contrôle | 2 abonnés lus, 0 niveau relevé, 0 ligne qui serait écrite (idempotent) |
| — | B5 G4 | comptes de test de Thomas : rien touché (consigne) |
| 09:08:08 | B5 démarrage, 1er appel | `startup-tasks` HTTP 200 en 11,0 s (`success`, 10 837 ms). Journal : « remplacements vidéo s26 v1 : 3 vidéo(s) remplacée(s), 0 refus garde-fou, 4 déjà faite(s) » (conforme) ; aucun échec ni GARDE-FOU ; `warn` attendus (lettres 2026-11, W46, W47 déjà envoyées) |
| 09:08:35 | B5 démarrage, 2e appel | HTTP 200 en 9,6 s ; « 0 vidéo(s) remplacée(s), 0 refus garde-fou, 7 déjà faite(s) » ; rien de neuf |
| 09:09 | B6 vidéos | Domenge `/videos/laura-domenge-se-remettre-avec-son-ex-cmmp8p0zu0` 200 (`W7i0KRn_GLY`), anciennes `laura-domenge-jamel-comedy-club-…` et `laura-domenge-la-vie-de-couple-…` 308 vers la nouvelle ; Gad `/videos/gad-elmaleh-la-visite-dappartement-la-vie-normale-cmmp8p3dw0` 200 (`BY8kpWBf57M`), ancienne `gad-elmaleh-decalages-spectacle-complet-1997-…` 308 ; Kev Adams `/videos/kev-adams-le-tennis-cmmp8p0fd0` 200 (`fSMhy3-7Xpk`), ancienne `kev-adams-du-cote-de-chez-vous-…` 308. Sitemap encore sur les anciennes adresses à 09:09 (`revalidate = 3600`, mise à jour d'ici une heure ; les anciennes redirigent déjà) ; 0 `mon-espace` dans le sitemap |
| 09:09 | B6 parcours 2.4 et 3.4 | non contrôlables sans session (étapes réservées aux abonnés, aucun des nouveaux `youtubeId` dans les pages publiques `/parcours/storytelling` et `/parcours/boulot`) : à voir par Thomas sur son compte Premium |
| 09:09 | B6 (c) en-têtes | `/mon-espace` visiteur : 200, aperçu « Aujourd'hui », `private, no-cache, no-store`, meta `noindex, follow` ; `/api/espace/caps` et `/api/espace/questions` 401 `private, no-store` ; `/api/espace/compteurs` 404 `no-store` |
| 09:09 | B6 (d) textes | `/cgu` et `/confidentialite` : « Dernière mise à jour : 20 novembre 2026 » ; alinéa des bonus de l'article 3 des CGU absent (`data-cgu-bonus` 0 : bonus pas tous publiés) ; confidentialité : phrases de l'espace présentes (« Les caps et les bonus qu'on t'a déjà annoncés », « Ne t'annoncer qu'une seule fois chaque cap », « Usage de ton espace, si tu es abonné ») |
| 09:10 | B6 (e) relevé de lecture | `GET /api/admin/espace-lecture?format=texte` avec l'auth admin : 200 (401 sans) ; « 0 abonné(s) ayant ouvert l'espace », « Moins de 15 abonnés : lecture cas par cas, aucun chiffre agrégé », 0 pourcentage, 0 adresse e-mail |
| 09:10 | B6 (f) santé | `ok`, Stripe `live`, base `up`, contenu `ok` ; 7 en-têtes de sécurité identiques à N-1 (`entetes-avant-B.txt`) |
| 09:11 | B6 (b) pages visiteur | texte visible comparé entre A (préversion `c7ace530`) et B (prod) sur 16 pages : `/register` et `robots.txt` identiques ; les autres diffèrent par la navigation nav v6 (« Tout ouvrir · 1,99 €/mois », Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, S'entraîner, Favoris, Carnet, Mes questions, Mes répliques, à la place de Premium et Accueil, fil d'Ariane retiré) et des textes et mises en page de l'état ouvert (intro de `/vannes`, `/carnet`, `/parcours/*`, liens de `/lettre` sans UTM affichées). Ces changements sont conditionnés par l'interrupteur dans le code (ex. `src/app/(dashboard)/vannes/page.tsx`), donc voulus par l'ouverture ; l'attendu « identiques à A » de B-P6 (b) date d'avant la nav v6. **À confirmer par l'orchestrateur** ; ni 5xx ni fuite |
| 09:07-09:22 | B6 tail 15 min | `wrangler tail --format json` de 09:07 à 09:22 (15 min après la bascule de 09:06:30) : 101 requêtes (92 × 200, 4 × 308, 3 × 401, 1 × 301, 1 × 404), **0 réponse 5xx**, 0 exception, 0 issue non `ok`, 0 log `error` (`/root/lancement-s26/tail-B.jsonl`) |
| 09:22 | état final | `deployments list` : `e9def49b-e40d-4cc3-90ae-5ba2bed1d7f3` à 100 % (« s26 B ouverture 9ffa6311 »), N-1 `c7ace530…` ; santé `ok`. Aucun retour arrière nécessaire |

**Non faits ici (session Premium ou Thomas requis)** : B-P6 (a), parcours complet à 375 px sur compte Premium de test ; parcours 2.4 et 3.4 vus en Premium ; vérifications de Thomas (§4 du runbook : achat Stripe, compte Premium, navigation privée, e-mails, vidéo en 4G, journaux 1 h). G4 non touché.

Retour arrière : `cd apps/web && npx wrangler rollback c7ace530-0de6-46af-b596-72a43554c9c8 -m "rollback s26 B" -y` (B seul) ; sauvegardes de la base : `br-plain-silence-b1pcw0xb` (avant B), `br-plain-butterfly-b16lk1qd` (avant A).

## Correctif Ngijol, 21/11 (go écrit de Thomas « go mise en ligne », relayé par l'orchestrateur)

Commit `df8f40a4` (CI verte, run 44889912286, 4 jobs `success`). Code depuis `9ffa6311` : `src/data/espace/parcours-fiches.json` (fiche 1.4 : `v-ySkBGAXLI` → `l__Xirj2N6c`, empreinte), `src/data/video-remplacements-s26.json` (note `parcours` seule), `docs/content/parcours-storytelling-s18.json` (bloc 1.4 lu dans le bundle), un test. `ESPACE_CLIENT_PUBLIE = true` inchangé ; aucune migration, variable ni package.

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 10:39 | N-1 | `deployments list` : **`e9def49b-e40d-4cc3-90ae-5ba2bed1d7f3` à 100 %** (« s26 B ouverture 9ffa6311 »), conforme |
| 10:39 | sauvegarde | **aucune branche Neon** : le correctif n'écrit rien en base (aucune migration, aucune tâche de démarrage) |
| 10:42 | export | `git archive df8f40a4` dans `/root/lancement-s26/export-ngijol`, `node_modules` par `cp -al` (0 lien symbolique), `.prisma` en copie réelle ; 5,1 Go libres après build |
| 10:42-10:44 | build | `build_prod` : **BUILD OK** (172 pages, `/root/lancement-s26/build-ngijol.log`) ; dépôt principal intact |
| 10:44 | envoi | `upload_prod` (exit 0) : **Worker Version ID `b29666a2-5af9-4504-94dd-92c183b8c804`**, préversion `https://b29666a2-marrant.thomas-issa.workers.dev` ; non servie (`e9def49b` à 100 %) |
| 10:45 | préversion | 13 adresses 200 (`/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/parcours/storytelling`, `/carnet`, `/confidentialite`, `/cgu`, `/register`, `/abonnement`, `/blog`, `/api/health`) ; `/profil` 307 ; `/mon-espace` visiteur 200, `no-store`, `noindex, follow` ; santé `ok` (Stripe `live`, base `up`) ; fiche `/videos/thomas-ngijol-superman-jamel-comedy-club-cmmp8p0xs0` 200, `l__Xirj2N6c`, bloc « Dans un parcours : Cette vidéo est travaillée dans l'étape 1 du parcours Storytelling. » présent (absent en prod `e9def49b`) |
| 10:45:43 | bascule | `npx wrangler versions deploy b29666a2-…@100% -y --message "s26 correctif Ngijol df8f40a4"` : SUCCESS ; `deployments list` = **`b29666a2-5af9-4504-94dd-92c183b8c804` à 100 %**, N-1 `e9def49b…` |
| 10:45 | contrôles prod | mêmes contrôles qu'en préversion, tous conformes : 13 adresses 200, `/profil` 307, `/mon-espace` visiteur 200 `no-store` `noindex, follow`, santé `ok` (Stripe `live`, base `up`), fiche Ngijol 200 avec `l__Xirj2N6c` et le bloc « Dans un parcours » (étape 1, Storytelling) |
| 10:46 | nettoyage | export `/root/lancement-s26/export-ngijol` supprimé (seul ce dossier) ; `node_modules` du dépôt intact ; 8,4 Go libres |
| 10:45-10:56 | tail 10 min | `wrangler tail --format json` de 10:45:50 à 10:56 : 24 requêtes (23 × 200, 1 × 307), **0 réponse 5xx**, 0 exception, 0 issue non `ok`, 0 log `error` (`/root/lancement-s26/tail-ngijol.jsonl`) |
| 10:56 | état final | `b29666a2-5af9-4504-94dd-92c183b8c804` à 100 % (« s26 correctif Ngijol df8f40a4 »), N-1 `e9def49b…`. Aucun retour arrière nécessaire. Retour arrière si besoin : `npx wrangler rollback e9def49b-e40d-4cc3-90ae-5ba2bed1d7f3 -m "rollback correctif Ngijol" -y` |
