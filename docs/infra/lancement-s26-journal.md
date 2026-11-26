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

## Surveillance après les déploiements (21/11, 12:06 UTC)

Tail JSON de 11:19 à 11:37 (connexion perdue ensuite, faible trafic du samedi) : 13 requêtes sur `b29666a2` (12 × 200, 1 × 404), 0 réponse 5xx, 0 exception, 0 log d'erreur. À 12:06 : `b29666a2` à 100 %, `/api/health` ok (Stripe live, base up), 11 adresses clés conformes (pages publiques et aperçu de l'espace 200, `/profil` 307).

## Tunnel allégé, 22/11 (go écrit de Thomas « go mise en ligne », relayé par l'orchestrateur)

Commit `e2670ba0` (code identique à `721663bc` + correctif de test e2e ; CI en cours au départ). Depuis `df8f40a4` : `register/page.tsx`, `abonnement-view.tsx`, `avantages-premium.tsx`, `formule-cartes.tsx`, `reassurance.tsx`, `config/indexnow.ts`, textes (`abonnement-vente.ts`, `cta-pages.ts`, `offre.ts`) et tests. Aucune migration, variable, package ni changement de `wrangler.jsonc` ; `ESPACE_CLIENT_PUBLIE = true` inchangé.

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 10:33 | N-1 | `deployments list` : **`b29666a2-5af9-4504-94dd-92c183b8c804` à 100 %** (« s26 correctif Ngijol df8f40a4 »), conforme |
| 10:33 | sauvegarde | **aucune branche Neon** : rien n'est écrit en base (ni migration, ni tâche de démarrage) |
| 10:36-10:38 | export, build | `git archive e2670ba0` dans `/root/lancement-s26/export-tunnel`, `node_modules` par `cp -al` (0 lien symbolique), `.prisma` en copie réelle ; `build_prod` : **BUILD OK** (172 pages, `/root/lancement-s26/build-tunnel.log`) ; 5,1 Go libres au plus bas |
| 10:38 | envoi | `upload_prod` (exit 0) : **Worker Version ID `6612baa4-b134-4cad-a1e3-7041d537d315`**, préversion `https://6612baa4-marrant.thomas-issa.workers.dev` ; **non servie** (`deployments status` à 10:41 : `b29666a2…` à 100 %). `deployments list` a renvoyé une limite de débit de l'API Cloudflare (code 971, 200 s) : sans effet, `deployments status` (un seul appel) suffit |
| 10:39 | nettoyage | export supprimé après l'envoi (seul ce dossier) ; `node_modules` du dépôt intact ; 8,3 Go libres |
| 10:39 | préversion, curl | 13 adresses 200 (`/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/carnet`, `/confidentialite`, `/cgu`, `/register`, `/abonnement`, `/retractation`, `/blog`, `/api/health`) ; `/profil` 307 ; `/mon-espace` visiteur 200, `no-store`, `noindex, follow` ; santé `ok` (Stripe `live`, base `up`) |
| 10:40 | préversion `/register` (curl + Chrome 375 et 1280 px) | ordre mesuré : Continuer avec Google < « E-mail » < Mot de passe < « Créer mon compte et passer au paiement » < « Premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (hors lien) < « En créant ton compte, tu acceptes les CGU et la confidentialité. Tu recevras la lettre du mois, désinscription en un clic. » (liens `/cgu`, `/confidentialite`) ; **0 `a[href="/retractation"]`** sur la page ; aucun débordement horizontal |
| 10:40 | préversion `/abonnement` (curl + Chrome 375 et 1280 px) | 2 boutons « S'abonner · 1,99 €/mois », chacun suivi de la garantie hors lien puis de « D'abord ton compte, puis le paiement. » (3e garantie plus bas, hors lien aussi) ; 0 « Premium : » ; cartes Mensuel et Annuel à 1280 px : 242 × 136 px chacune, même ligne ; seul lien `/retractation` : « Renoncer au contrat ici » dans le `<footer>` ; aucun débordement. Captures : `/root/lancement-s26/tunnel-{register,abonnement}-{375,1280}.png` |

**Pas de bascule** (en attente du feu vert de l'orchestrateur après la CI de `e2670ba0`).

**Bascule tunnel allégé (22/11, 10:42 UTC, par l'orchestrateur sur « go mise en ligne »)** : `6612baa4` à 100 %, N-1 `b29666a2`. Contrôles prod : 11 adresses conformes, /register sans lien /retractation avec lien /confidentialite, /abonnement sans « Premium : » hors balise title, santé ok. Tail 10:42 à 10:52 : 23 événements sur `6612baa4` (20 × 200, 1 × 307, 1 requête annulée par le client, 1 cron), 0 5xx, 0 exception ; 1 log d'erreur sans lien avec le déploiement : cron SocialAnalytics, file Buffer en 429 (limite de débit de l'API Buffer).

## Mise en ligne s27, 25/11 (go écrit de Thomas « Si tu es sûr de toi, oui, go, mise en ligne. », relayé par l'orchestrateur)

Commit `1998ae31` : résiliation maison ouverte (`6a22675d`, `RESILIATION_PAGE_OUVERTE = true`, `RESILIATION_DATE_TEXTES = "25 novembre 2026"`), lettre gratuite en premier sur les articles « blagues » (`28dcb0e8`), tests (`afad893b`, `ed8a2b9d`, `f29b8696` : lien « Résilier ton contrat » du profil), SEO de 7 pages (`1998ae31`). Aucune variable, aucun package, aucun changement de `wrangler.jsonc` ; une migration (17).

Premier essai à 10:09 UTC sur `6a22675d` arrêté sans rien écrire : CI rouge (e2e profil, bouton devenu lien) et API Neon en 401. Reprise après `f29b8696` et l'enregistrement par Thomas d'une clé Neon injectée par le proxy (en-tête `Authorization: Bearer proxy-injected`).

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 10:37 | contrôles | `git show 1998ae31:apps/web/src/config/resiliation.ts` : `OUVERTE: boolean = true`, `RESILIATION_DATE_TEXTES = "25 novembre 2026"` (date de Paris du jour) ; diff `e2670ba0..1998ae31` : 15 fichiers de `src/`, ni `wrangler`, ni `package.json`, ni schéma |
| 10:48 | CI | run 45596100912 sur `1998ae31` : `test`, `lint`, `e2e-local (ferme)` (178 réussis), `e2e-local (ouvert)` (389 réussis) = `success`, aucun flaky |
| 10:48:49 | sauvegarde | branche Neon `sauvegarde-avant-resiliation-s27`, **id `br-polished-block-b1odjxvq`**, parente `production` (`br-withered-dream-b1jzhtnn`), LSN `0/A8D6618`, `ready` à 10:48:52, 0 point de terminaison |
| 10:48:59 / 10:49:00 | migration 17 | `node $O/neon-sql.mjs prisma/migrations/17_resiliation_motif_s23/migration.sql` : `OK` puis `OK` (idempotente) ; `to_regclass('"CancellationFeedback"')` non nul, base `neondb`, 9 colonnes, 0 ligne, contraintes `pkey` et `userId_fkey`, 4 index |
| 10:49-10:50 | export, build | `git archive 1998ae31` dans `$O/export-s27`, `node_modules` par `cp -al` (0 lien symbolique), `.prisma` en copie réelle ; `build_prod` : **BUILD OK** (172 pages, `$O/build-s27.log`) |
| 10:50:44 | envoi | `upload_prod` (exit 0) : **Worker Version ID `5ce0a19b-500a-4d67-b6bd-d74d7896d589`**, préversion `https://5ce0a19b-marrant.thomas-issa.workers.dev`, non servie |
| 10:51 | préversion | 15 adresses 200 ; `/profil` 307 ; santé `ok` (Stripe `live`, base `up`) ; mêmes contrôles navigateur qu'en prod (ci-dessous), tous conformes |
| 10:52:21 | bascule | N-1 relue : `6612baa4…` à 100 % ; `npx wrangler versions deploy 5ce0a19b-…@100% -y --message "s27 resiliation + lettre blog + SEO 1998ae31"` : SUCCESS ; `deployments status` = **`5ce0a19b` à 100 %** |
| 10:53 | contrôles prod (curl) | 200 : `/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/carnet`, `/confidentialite`, `/cgu`, `/register`, `/abonnement`, `/retractation`, `/blog`, `/blog/meilleures-blagues-droles-2026`, `/blog/autoderision-interactions`, `/api/health` ; `/profil` 307 ; santé `ok`, base `up`, Stripe `live`, 0 échec ; `/confidentialite` « Dernière mise à jour : 25 novembre 2026 » ; `<title>` de `/blog/autoderision-interactions` = « Autodérision : définition, exemples et règles d'or » ; de `/vannes` = « Vannes drôles : blagues courtes à ressortir \| deviens-marrant.fr » (avant : « Vannes et blagues drôles à ressortir ») |
| 10:53 | contrôles prod (Chromium 1243, headless) | `/`, `/abonnement`, `/register`, article n°1 : 200, **0 erreur JS** (ni `pageerror` ni erreur console) ; pied de page « Résilier ton contrat » → `/resiliation` ; `/resiliation` sans session : redirection en flux (HTTP 200 puis `NEXT_REDIRECT;replace;/login?callbackUrl=%2Fresiliation;307`), URL finale `/login?callbackUrl=%2Fresiliation` ; `/blog/meilleures-blagues-droles-2026` : ordre `lettre-milieu` (après la 1re H2) < démonstration (`cta-milieu-1`) < `lettre-fin` < bloc payant `cta-fin` |
| 10:52-11:03 | tail 10 min | `wrangler tail --format json` de 10:52:35 à 11:02:59 : 123 événements, tous sur `5ce0a19b` (120 × 200, 1 × 307, 1 × 404 sur un morceau JS d'admin de l'ancien build, 1 cron), **0 réponse 5xx**, 0 exception, 0 issue non `ok`, 0 log `error` (`/root/lancement-s26/tail-s27.jsonl`). Trafic surtout celui des contrôles |
| 11:03 | état final | `5ce0a19b-500a-4d67-b6bd-d74d7896d589` à 100 %, N-1 `6612baa4…`. Aucun retour arrière nécessaire. Export `$O/export-s27` supprimé. Retour arrière si besoin : `npx wrangler rollback 6612baa4-b134-4cad-a1e3-7041d537d315 -m "rollback s27" -y` (si le portail Stripe a déjà été réglé, réactiver d'abord son option d'annulation). Portail Stripe non touché : geste 3 à Thomas |

## Textes du blog s27, 25/11 (go écrit de Thomas « Aligne puis met en ligne », relayé par l'orchestrateur)

Commit `5e795c19`. Diff de `apps/web/` depuis `1998ae31` (prod `5ce0a19b`) : `src/lib/blog-articles.ts` (paragraphes de tête de 4 articles, 2 phrases de lien dans l'article blagues, encadré « En bref » de `comment-devenir-drole`) et 4 fichiers de tests. Aucune migration, variable ni package ; aucune écriture en base, donc pas de branche de sauvegarde Neon.

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 12:48 | export, build | `git archive 5e795c19` dans `$O/export-s27b` (0 lien symbolique, `.prisma` en copie réelle) ; `build_prod` : **BUILD OK** (172 pages, `$O/build-s27b.log`), pendant la CI (sans effet sur la prod) |
| 12:50:47 | envoi | `upload_prod` (exit 0) : **Worker Version ID `eddd8755-66d1-4b8e-9146-8e41aad4c8f8`**, préversion `https://eddd8755-marrant.thomas-issa.workers.dev`, non servie |
| 12:52 | préversion | `/`, `/register`, `/abonnement`, `/confidentialite`, `/blog`, `/vannes`, `/api/health` 200, santé `ok` ; contrôles navigateur ci-dessous tous conformes, 0 erreur JS |
| 13:02 | CI | run 45617033158 sur `5e795c19` : `test`, `lint`, `e2e-local (ferme)` (178 réussis), `e2e-local (ouvert)` (389 réussis) = `success`, aucun flaky |
| 13:02:33 | bascule | N-1 relue : `5ce0a19b…` à 100 % ; `npx wrangler versions deploy eddd8755-…@100% -y --message "s27 paragraphes de tête + En bref + liens blagues 5e795c19"` : SUCCESS ; `deployments status` = **`eddd8755` à 100 %** |
| 13:02:50 | contrôle navigateur n°1 (anomalie passagère) | sur `/abonnement` et 4 articles : 404 sur des morceaux JS du NOUVEAU build (`layout-2460df1f6c6fafa5.js`, `blog/[slug]/page-e6ea1c8062190c2a.js`), `ChunkLoadError` puis React #423, corps non rendu dans le navigateur. Diagnostic : ces fichiers sont dans `.open-next/assets` et répondent 200 dès 13:03 ; HTML servi = nouveau build (même nom de morceau en prod et en préversion). Cause probable : propagation des fichiers statiques juste après la bascule (environ 1 min). Pas de retour arrière |
| 13:03:42 | contrôles prod (Chromium 1243, 2 passages) | 0 erreur JS sur `/`, `/abonnement` et les 5 articles (`comment-devenir-drole`, `comment-avoir-de-la-repartie`, `autoderision-interactions`, `5-types-humour-lequel-pour-toi`, `meilleures-blagues-droles-2026`), tous 200 ; `comment-devenir-drole` : 1er paragraphe « Si tu restes muet quand tes potes se chambrent… », puis l'encadré « Pour devenir drôle, prends le réflexe de noter ce qui fait rire… », 1 « En bref », 0 « reformule-la en 3 versions » ; article blagues : 1 lien vers `/blog/comment-avoir-de-la-repartie`, 1 vers `/blog/exercices-developper-humour`, lettre milieu et fin toujours en place ; pied de page « Résilier ton contrat » → `/resiliation`, `/resiliation` sans session → `/login?callbackUrl=%2Fresiliation` ; santé `ok` (base `up`, Stripe `live`) ; `/confidentialite` au 25 novembre 2026 ; `/profil` 307 |
| 13:02-13:13 | tail 10 min | `wrangler tail --format json` de 13:02:48 à 13:12:45 : 400 événements, tous sur `eddd8755` (398 × 200, 1 × 307, 1 × 404 sur `/.well-known/traffic-advice`), **0 réponse 5xx**, 0 exception, 0 log `error` (`/root/lancement-s26/tail-s27b.jsonl`). Les 404 des morceaux JS de 13:02:50 n'y figurent pas : les fichiers statiques sont servis par la couche des assets sans passer par le Worker |
| 13:13 | état final | `eddd8755-66d1-4b8e-9146-8e41aad4c8f8` à 100 %, N-1 `5ce0a19b…`. Aucun retour arrière nécessaire. Export `$O/export-s27b` supprimé. Retour arrière si besoin : `npx wrangler rollback 5ce0a19b-500a-4d67-b6bd-d74d7896d589 -m "rollback s27 textes" -y` |

À retenir : après une bascule, attendre environ 1 minute avant les contrôles navigateur ; une `ChunkLoadError` isolée dans cette fenêtre ne justifie pas un retour arrière si le fichier fait partie du nouveau build et répond 200 juste après.

## Corrections du parcours abonné s27, 26/11 (go écrit de Thomas « go mise en ligne » + « textes ok », relayé par l'orchestrateur)

Code `dddc03f9` (D1 à D9, `docs/qa/parcours-abonne-s27.md`). Diff de `apps/web/` depuis `5e795c19` : 34 fichiers de `src/` (dont `middleware.ts`, `app/layout.tsx`, `lib/indice-lecteur.ts`, `styles/globals.css`) et des tests ; ni schéma, ni migrations, ni `wrangler`, ni packages ; aucune écriture en base, pas de branche de sauvegarde.

| Heure (UTC) | Étape | Résultat |
|---|---|---|
| 13:31 | en-têtes « avant » | prod `eddd8755` : statut, `cache-control`, `vary`, `set-cookie` de 8 pages relevés (`/root/lancement-s26/s27c/avant.txt`) ; 0 `Set-Cookie` visiteur |
| 13:31-13:34 | export, build, envoi | `git archive dddc03f9`, `build_prod` : **BUILD OK** (172 pages) ; `upload_prod` : **`a824cc3d-acb4-4d36-b3e8-91f09eb8a5f9`**, préversion `https://a824cc3d-marrant.thomas-issa.workers.dev`, non servie |
| 13:36 | préversion | santé `ok` ; visiteur : « Tout ouvrir » visible (conseil, `/vannes`, vidéo), 0 `Set-Cookie`, pas de `dm_lecteur` ni de `data-indice-lecteur`, 0 erreur JS, « Le parcours peut attendre » absent, résiliation et lettre en place |
| 13:45 | CI rouge, pas de bascule | runs 45829374714 (`dddc03f9`) et 45829796597 (`ba953b6a`) : `e2e-local (ouvert)` rouge, `parcours-connecte-s26.spec.ts:130` (lien « étape suivante » de l'étape 2 caché par D3) |
| 14:05 | CI rouge, pas de bascule | run 45832641481 (`d284a294`) : même spec, ligne 134, à 1280 seulement (dès 1024 px, seule l'étape du menu est affichée : `#etape-1-entete` invisible) |
| 14:27 | CI | run 45836541500 sur `fd9f8c1d` (`apps/web` identique à `dddc03f9`) : 4 jobs `success` ; 1 flaky passé à la relance (`corrections-abonne-s27.spec.ts:79`, D1) |
| 14:32:00 | bascule sans rebuild | N-1 relue `eddd8755…` ; `npx wrangler versions deploy a824cc3d-…@100% -y --message "s27 corrections parcours abonné dddc03f9"` : SUCCESS, **`a824cc3d` à 100 %** |
| 14:33 | en-têtes « après » | 0 `Set-Cookie` ; statuts et `vary` identiques ; `cache-control` identique pour `/vannes`, `/abonnement`, `/parcours/repartie` (privés) et `/register` (`s-maxage=31536000`) ; pages ISR (conseil, vidéo, accueil, article) : même politique, seul le `s-maxage` restant varie (`apres.txt`) |
| 14:33:18 | contrôles prod (Chromium 1243, 2 passages, visiteur) | santé `ok` (base `up`, Stripe `live`) ; 10 pages 200, **0 erreur JS** (accueil, /abonnement, /register, /parcours, /parcours/repartie, article blagues, conseil, /vannes, vidéo) ; « Tout ouvrir » visible sur le conseil, `/vannes` et la vidéo ; `data-indice-lecteur` absent ; cookies du navigateur : NextAuth seulement (passage par `/login`) ; « Le parcours peut attendre » absent ; pied « Résilier ton contrat » → `/resiliation`, `/resiliation` → `/login?callbackUrl=%2Fresiliation` ; lettre milieu et fin ; `/confidentialite` au 25 novembre 2026 ; `/profil` 307. **Aucun contrôle connecté possible en prod** (pas de compte de test) |
| 14:32-14:42 | tail 10 min | `wrangler tail --format json` de 14:32 à 14:42:39 (événements de 14:33:02 à 14:41:51) : 330 événements, tous sur `a824cc3d` (320 × 200, 9 × 308, 1 × 307), **0 réponse 5xx**, 0 exception, 0 log `error` (`/root/lancement-s26/tail-s27c.jsonl`) |
| 14:43 | état final | `a824cc3d-acb4-4d36-b3e8-91f09eb8a5f9` à 100 %, N-1 `eddd8755…`. Aucun retour arrière nécessaire. Retour arrière si besoin : `npx wrangler rollback eddd8755-66d1-4b8e-9146-8e41aad4c8f8 -m "rollback s27 corrections" -y`. Reste à Thomas : contrôle en abonné réel (offre qui ne clignote plus, étoiles des favoris pleines) |
