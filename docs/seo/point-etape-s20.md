# Point d'étape SEO s20 : « tout est ok côté SEO ? » (11/10/2026, soir)

Réponse : **non**. Les alertes techniques Ahrefs sont corrigées (voir `REPLIT_ACTIONS.md` s20), mais le fond reste ouvert, et une anomalie nouvelle est apparue (§1).
Sources et dates : Search Console (API, compte de service `sc-domain:deviens-marrant.fr`, inspection de 414 URLs du sitemap le 11/10 ~22:30 UTC ; Performances 12/09→09/10 contre 15/08→11/09, données finales jusqu'au 09/10), Bing Webmaster (API, 11/10), Umami (API, 28 j glissants au 11/10), `docs/analytics/snapshot-trafic-2026-10-05.md` (base de comparaison). Volumes de recherche : non disponibles (niche), travail sur impressions GSC. Aucun code ni site modifié, aucun commit.

## 1. Anomalie nouvelle (P0) : Google range 11 pages dans le doublon de sites étrangers

> **Mise à jour 12/10 (@seo)** : le pilier est **sorti** du doublon (« Envoyée et indexée », exploré le 12/10 06:33 UTC, canonique Google = notre URL). Il reste **10 URL** concernées, liste exacte et règles de contrôle du 15/10 et du 19/10 au §9. Cloudflare exclu (`docs/infra/googlebot-cloudflare-s20.md`), doublon de texte avec `exercices-developper-humour` exclu par la mesure (`docs/seo/maillage-decouverte-s20.md` §1). Le texte ci-dessous est l'état du 11/10, conservé tel quel.

Inspection d'URL du pilier `/blog/comment-devenir-drole` (11/10) :
- Statut **« Page en double sans URL canonique sélectionnée par l'utilisateur »** (le 05/10 : « Explorée, non indexée », canonique OK). Dernier crawl **11/10 13:06 UTC** (donc avant le déploiement s20 de 20:24 UTC), récupération réussie, robots autorisé.
- **Canonique choisie par Google : `https://www.747live.bet/`**, page d'accueil d'un site de paris en ligne sans rapport (vérifié : titre « 747 Live | Sports Betting, Casino Games… », aucune trace de notre domaine). **Aucune canonique déclarée vue par Google** (`userCanonical` absent), alors que le HTML servi aujourd'hui contient bien `<link rel="canonical" href="https://deviens-marrant.fr/blog/comment-devenir-drole"/>` et `index, follow` (testé avec un agent Googlebot mobile, 3 passes, 200, 19,6 Ko, cache HIT).
- Même motif sur **11 URLs sur 414** : le pilier, `pourquoi-blagues-marchent-pas` (crawl 13/08), 2 vannes (30/09), 6 conseils (30/09, 02/10, 10/10), 1 vidéo (30/09). Canoniques étrangères : `747live.bet` (9) et `marcustheatres.com` (2). 10 de ces 11 crawls datent du 30/09 ou après, soit **depuis la bascule Cloudflare Workers du 30/09** ; un seul est antérieur (13/08, avant la migration).
- Lecture : Google a reçu, au moment de ces crawls, une réponse sans canonique ni contenu propre (page vide, interstitiel ou erreur servie en 200), puis l'a regroupée avec d'autres pages vides. **Cause exacte non établie** `[À VÉRIFIER]` : trois pistes (ordre de probabilité) : (a) défi ou blocage Cloudflare (Bot Fight Mode, règle WAF, rate limit) sur certains passages de Googlebot ; (b) réponse transitoire du Worker/cache pendant un déploiement (les déploiements s19 du 11/10 encadrent le crawl de 13:06) ; (c) cache OpenNext servant une coquille. Depuis ma machine, 12 passes sur 4 des URLs touchées donnent toutes 200 avec canonique : pas reproductible, donc le test décisif doit se faire du côté de Google.

Le diagnostic du pilier du 05/10 (maillage faible) reste vrai mais n'est plus le premier problème : les liens L1 à L3 sont **en ligne** (lien vers le pilier trouvé 2 fois dans le HTML de l'accueil, 3 fois sur `/blog`, 2 fois sur 3 articles testés).

**3 actions, par impact (pilier)**
1. **Voir ce que Googlebot reçoit** (Thomas 10 min + @infrastructure 1 h) : Search Console > Inspection > pilier > « Tester l'URL en direct » > « Afficher la page explorée » (HTML + capture) ; même test sur 1 conseil touché. En parallèle, Cloudflare > Sécurité > Événements : filtrer le user-agent Googlebot / bots vérifiés depuis le 30/09 (défis, blocages) ; journaux du Worker sur les 5 heures autour du 11/10 13:06 UTC. Si un défi ou une règle apparaît : l'exempter pour les bots vérifiés.
2. **Après correction, demander l'indexation** (Thomas, 2 min par URL, une seule fois) : pilier, puis `exercices-developper-humour` si besoin. Inutile avant l'action 1 : Google reclasserait le même doublon.
3. **Suivi** (@data-analyst, 5 min) : relancer l'inspection des 11 URLs à J+3 et J+7 (script de ce soir réutilisable) ; objectif : canonique = notre URL, sinon cause 3 du diagnostic s15 (recouvrement avec `exercices-developper-humour`).

## 2. Inspection des pages clés (Google, 11/10)

| Page | Statut | Dernier crawl | Canonique Google |
|---|---|---|---|
| `/` | Envoyée et indexée | 09/10 | notre URL |
| `/blog/meilleures-blagues-droles-2026` (n°1) | Envoyée et indexée | 04/10 | notre URL |
| `/blog/exercices-developper-humour` | Envoyée et indexée | 05/10 | notre URL |
| `/abonnement` | Envoyée et indexée | 05/10 | notre URL |
| `/blog/phrases-droles-conversations` | Envoyée et indexée | 26/08 (46 j) | notre URL |
| **`/blog/comment-devenir-drole`** | **Doublon, canonique étrangère** | 11/10 | `747live.bet` |
| `/parcours` | **Détectée, non indexée** (jamais explorée) | aucun | aucune |
| `/parcours/boulot` | Inconnue de Google (en ligne depuis le 11/10) | aucun | aucune |

## 3. Indexation Google des 414 URLs du sitemap (inspection complète, 11/10)

| Statut | URLs | Part |
|---|---|---|
| Envoyée et indexée | 94 | 22,7 % |
| Détectée, actuellement non indexée (jamais explorée) | 238 | 57,5 % |
| Google ne reconnaît pas cette URL | 67 | 16,2 % |
| Doublon, canonique étrangère (§1) | 11 | 2,7 % |
| Explorée, actuellement non indexée | 4 | 1,0 % |

Par section (indexées / total) : **blog 14/36**, vannes (fiches) 16/150, conseils 58/121, **vidéos 1/90**, **parcours 0/6** (5 parcours + hub, aucun exploré), pages institutionnelles 5/11. Hubs : `/`, `/vannes`, `/conseils`, `/blog` indexés ; **`/videos` inconnu de Google**. Sur le blog, 16 articles sur 36 n'ont jamais été explorés (storytelling, timing, erreurs-blagues, timidité, répartie-soirée…). Les 4 « Explorées, non indexées » : `5-types-humour-lequel-pour-toi` (crawl 12/08), `humour-noir-utiliser-sans-blesser`, `je-suis-pas-drole-comment-changer`, `repartie-debutant-5-etapes`.
Le sitemap (soumis 30/09, relu par Google le 10/10, 0 erreur, 398 URLs déclarées à cette lecture) est accepté : le goulot est l'**exploration**, pas la lecture du sitemap. Le champ « indexées » du rapport sitemap affiche 0 : non fiable.

## 4. Search Console, 28 j contre 28 j précédents

| | 12/09→09/10 | 15/08→11/09 | Écart |
|---|---|---|---|
| Clics | 462 | 455 | +1,5 % |
| Impressions | 10 232 | 8 819 | +16 % |
| CTR | 4,52 % | 5,16 % | -0,64 pt |
| Position moyenne | 7,8 | 11,0 | +3,2 rangs |
| Pages avec impressions | 67 | 21 | x3,2 |
| Requêtes distinctes | 809 | 358 | x2,3 |

**Tendance : plateau de clics, croissance de la visibilité.** Les clics n'ont pas bougé (+7) malgré +1 413 impressions.
- **Article n°1 : 368 clics sur 462 = 79,7 %** (85,5 % avant), 2 536 impressions, CTR 14,5 % (25,1 % avant), position 5,6 (4,5 avant). Il perd 21 clics ; le reste du site en gagne 28. Hors n°1 : 94 clics pour 7 696 impressions (CTR 1,2 %).
- **Top pages 28 j (clics / imp.)** : n°1 368 / 2 536 · `phrases-droles-conversations` 35 / 2 198 (pos 5,2, CTR 1,6 %) · `/vannes` 17 / 1 366 · `exercices-developper-humour` 10 / 220 · `autoderision-interactions` 6 / 1 050 · `comment-avoir-de-la-repartie` 6 / 801 · `comment-faire-rire-un-homme` 4 / 488 · `jeux-de-mots-technique-3-etapes` 4 / 151 · `comment-faire-rire-une-fille` 3 / 314 · une fiche conseil 2 / 14.
- **Top requêtes 28 j** : blague à mourir de rire 2026 (57 clics, pos 2,0) · blague humour noir 2026 (42 / 780 imp, pos 8,5) · blague 2026 (35) · blague drole 2026 (17) · blagues 2026 (14) · meilleur blague 2026 (14) · meilleures blagues 2026 (8). Toutes datées « 2026 » : la bascule 2027 (15-20/12) reste le risque n°1 de chute.
- **Répartition des impressions par position** : 1-3 : 1 291 · 4-10 : 2 427 · 11-20 : 1 427 · > 20 : 240.
- **Requêtes cœur** : « comment devenir drôle/drole » 0 clic, 22 imp, pos 36 à 38 · « comment être drôle » 0 / 11, pos 41 · « répartie » 0 / 21, pos 9,9 · « avoir de la répartie » 0 / 18, pos 11,7 · **marque : « deviens marrant » absent** (seules « www.deviens-marrant.fr » 22 imp pos 26,7 et « un site marrant.fr » 2 imp apparaissent).
- **Opportunités position 5-20 (28 j, ≥ 25 imp.)** : « humour observationnel » 459 imp, pos 8,6, **0 clic** (page `5-types-humour`, non indexée au sens inspection : voir §3) · « une vanne blague » 409 imp, pos 6,5, 0 clic (`/vannes`) · « autodérision » 163, pos 11,5 · « vanne blague » 149, pos 7,1 · « autodérision définition » 60 + « definition autoderision » 45 · « phrase drole » 86, pos 10,6 · « comment faire rire quelqu'un » 70, pos 9,7 · « une répartie » 54 + « quelle repartie » 48 + « ta repartie » 35 (`comment-avoir-de-la-repartie`, pos 8 à 10) · « faire des vannes » 33 · « blague vanne » 28.
- **Umami (28 j contre 28 j précédents)** : visites 803 contre 711 (+13 %), visiteurs 687 contre 614 (+12 %), pages vues 1 150 contre 851 (+35 %) ; organique 481, direct 196, LLM 4 ; google.com 407, bing.com 47, chatgpt.com 4. Rebond 76 % contre 91 % `[À VÉRIFIER : les événements blog-scroll comptent maintenant comme interactions, la baisse n'est pas forcément réelle]`. Événements 28 j : abonnement-vu 6, abonnement-clic 5, inscription-envoi 3, inscription-reussie 2, abonnement-reussi 1.

## 5. Actions faites ce soir (notifications seules)

| Action | Résultat réel |
|---|---|
| **IndexNow** `api.indexnow.org`, 12 nouvelles URL de conseils renommés en s18 (C008, C009, C010, C015, C027, C033, C042, C054, C072, C081, C101, C102), clé `/indexnow-key.txt` (publique, 200) | **HTTP 200** (pas de 429 cette fois). Les 12 URL répondent 200 et sont dans le sitemap. Les anciennes URL ne sont pas soumises. |
| **Bing `SubmitUrlBatch`** : `/abonnement`, `/parcours`, 5 parcours, `/blague-du-jour`, `/anatomie-vanne`, `/confidentialite`, 5 thèmes (boulot, couple, soirees, famille, autoderision) = 15 URL | **HTTP 200**, quota du jour passé de 15 à 0 (mensuel 2 000 restants). **Non soumis faute de quota : thèmes `dating` et `gaming`** (à envoyer demain, ou couverts par le cron IndexNow). |
| Constat quota | Quota quotidien Bing : **15** ce soir, contre 100 annoncés le 05/10 `[À VÉRIFIER : quota réduit par Bing après les 100 URL du 05/10 ?]`. |

## 6. Bing : pourquoi 61 pages indexées sur 414 ?

- `GetCrawlStats` (dernier point 05/10) : index 61 (63 au 28/09), 62 pages en 2xx, 1 en 301, 7 « autres codes », **0 erreur, 0 bloqué par robots, 0 malware**, 10 à 28 pages explorées par jour. `GetCrawlIssues` : liste vide. Bing ne connaît donc que **~70 URLs** du site.
- `GetUrlInfo`, URL représentatives : **1 vanne, 1 conseil, 1 vidéo : date de découverte vide (jamais découvertes)**, malgré le sitemap et l'IndexNow de 384 URL du 05/10 (200). Accueil (crawl 10/10), `comment-devenir-drole` (10/10), `comment-avoir-de-la-repartie` (10/10), `parcours/repartie` (23/09) : connus et explorés. `storytelling-drole-5-structures` : découvert 18/04, dernier crawl 05/08, non indexé.
- **Liens entrants : 0** (`GetLinkCounts` vide, `InLinks` = 1). Même cause racine que Google : Bing n'a aucune raison d'étendre son crawl vers 350 fiches catalogue brèves sans signal externe.
- **2 actions** : (1) ne pas relancer d'IndexNow massif (inefficace le 05/10) : soumettre chaque jour le quota disponible dans l'ordre hubs > parcours > articles non explorés, puis refaire `GetUrlInfo` sur ces 3 fiches à J+7 pour vérifier la découverte (@seo, 10 min/jour) ; (2) vérifier dans Bing Webmaster Tools, section Sitemaps, que `sitemap.xml` est lu sans erreur et combien d'URL sont « découvertes » (non exposé par l'API appelée ce soir) `[À VÉRIFIER, Thomas 5 min]`.

## 7. Priorités (agent, effort)

| # | Priorité | Agent | Effort | Pourquoi |
|---|---|---|---|---|
| 1 | Établir ce que Googlebot reçoit (11 pages en doublon étranger, 10 depuis le 30/09) puis demander l'indexation du pilier | @infrastructure + Thomas | 1 h + 10 min | Bloque le pilier ; peut toucher d'autres pages si le défi est intermittent |
| 2 | **Faire explorer** : 305 URLs sur 414 jamais explorées (238 détectées + 67 inconnues), dont `/videos`, `/parcours` et ses 5 pages, 16 articles. Liens internes depuis les pages indexées et crawlées (accueil, `/blog`, n°1) vers `/videos`, `/parcours`, articles non explorés ; ne pas ajouter d'URL, mesurer avant de passer des fiches en `noindex` | @seo (spec) + @fullstack | 0,5 j | Aucune page non explorée ne peut ranker ; l'accueil est exploré tous les 2 jours |
| 3 | Récupérer `5-types-humour-lequel-pour-toi` (« explorée, non indexée » alors que 459 imp./28 j sur « humour observationnel » à la position 8,6) et titres/metas de `/vannes` (« une vanne blague » 409 imp., 0 clic) | @seo + @copywriter (étalons Thomas, P0 s8) | 0,5 j | Plus gros potentiel hors n°1 ; mesurer le diff réel (P0 s11) |
| 4 | Dépendance au n°1 (79,7 % des clics, requêtes « 2026 ») : préparer la bascule 15-20/12 sans casser la position 2 à 6, et convertir ces visites vers `/parcours` (déjà au plan s15) | @seo + @growth | suivi | Risque de perte majeure des clics à la bascule |
| 5 | Autorité : 0 lien entrant Bing, requête de marque absente, liste Thomas §8 | @growth + Thomas | ~2 h Thomas | Condition de l'exploration (2) et du classement (3) sur le long terme |

À corriger au passage : les textes du kit annoncent « 3 parcours », il y en a 5 en ligne depuis le 11/10 (voir §8, ligne 1).

## 8. Liste Thomas : liens entrants (source `docs/growth/kit-soumissions-s15.md`, aucune cible ajoutée)

1. Avant de coller : remplacer « 3 parcours » par « 5 parcours » dans les textes du kit §1 (5 parcours en ligne vérifiés le 11/10). 5 min.
2. Bio Instagram et X avec le lien du site, puis profils YouTube, Pinterest, page LinkedIn (cibles 3 et 12, accroche FR). 25 min.
3. Impro & Cie, « Suggérer une ressource » (cible 2, texte IMPRO) et Annuaire de l'improvisation théâtrale, « Proposer votre site » (cible 1). 20 min, cibles les plus pertinentes.
4. Microlaunch (cible 5, texte EN, seul dofollow gratuit confirmé). 20 min.
5. Formulaires à texte courte FR : avis-site-internet (10, validation < 24 h), Faitesvousconnaitre (6, longue FR), Maître Blogueur (13), Sites-Internationaux (4). 10 min chacun.
6. Quora et Reddit avec les modèles M1 à M3 : 1 réponse par jour maximum, règle 90/10, aucune pub (cibles 7 et 8). 30 min/semaine, règles des subreddits non vérifiées dans le kit.
7. Product Hunt, Indie Hackers, Peerlist en dernier (public makers, faible valeur FR). Rédiger le post depuis « Longue EN » avec validation. Non prioritaire.
8. Suivi : reporter les statuts dans le tableau du kit §4 ; relancer une fois les cibles sans réponse au 04/11 (J+30), objectif ≥ 5 domaines référents au 04/12.

## 9. Suivi canonique étrangère (état au 12/10/2026, inspection API ~06:45 UTC)

**Pilier `/blog/comment-devenir-drole` : RÉSOLU.** Statut « Envoyée et indexée », dernier crawl 12/10 06:33 UTC, canonique Google = `https://deviens-marrant.fr/blog/comment-devenir-drole`, canonique déclarée vue par Google = la même, récupération réussie, robots autorisé. Il sort de la liste ; il reste à surveiller (contrôle 3 ci-dessous).

**Les 10 URL encore en « Page en double sans URL canonique sélectionnée par l'utilisateur »** (verdict NEUTRAL, récupération réussie, robots autorisé, **canonique déclarée vue par Google : aucune** pour les 10). Triées par type puis date de crawl.

| # | URL exacte (inspection API) | Type | Canonique choisie par Google | Dernier crawl Google (UTC) |
|---|---|---|---|---|
| 1 | `https://deviens-marrant.fr/blog/pourquoi-blagues-marchent-pas` | blog | `https://www.747live.bet/` | 13/08 23:21 (époque Replit) |
| 2 | `https://deviens-marrant.fr/vannes/ma-mere-mappelle-chaque-dimanche-pour-savoir-si-je-mange-cmmnsqn130` | vanne | `https://www.747live.bet/` | 30/09 19:10 |
| 3 | `https://deviens-marrant.fr/vannes/un-pote-a-quitte-le-groupe-pour-quon-lui-demande-pourquoi-cs14jke92e` | vanne | `https://www.747live.bet/` | 30/09 22:50 |
| 4 | `https://deviens-marrant.fr/conseils/interroger-le-suspect-improbable-cs14tipd20` | conseil | `https://www.747live.bet/` | 30/09 19:13 |
| 5 | `https://deviens-marrant.fr/conseils/consulter-ton-equipe-imaginaire-cs14tip262` | conseil | `https://www.marcustheatres.com/theatre-locations/hollywood-cinema` | 02/10 02:11 |
| 6 | `https://deviens-marrant.fr/conseils/raconter-a-lenvers-cs14tip6cf` | conseil | `https://www.marcustheatres.com/` | 02/10 15:08 |
| 7 | `https://deviens-marrant.fr/conseils/le-serment-quon-brise-dans-lhistoire-cs14tip18b` | conseil | `https://www.747live.bet/` | 10/10 07:02 |
| 8 | `https://deviens-marrant.fr/conseils/lauto-vanne-preventive-desamorcer-avant-que-ca-glace-cmqdc6vay0` | conseil | `https://www.747live.bet/` | 10/10 07:03 |
| 9 | `https://deviens-marrant.fr/conseils/raconter-une-anecdote-en-3-actes-cmmp8ozsx0` | conseil | `https://www.747live.bet/` | 10/10 16:19 |
| 10 | `https://deviens-marrant.fr/videos/fanny-ruwet-je-ne-serais-pas-une-bonne-mere-cmmp8p4u10` | vidéo | `https://www.747live.bet/` | 30/09 22:48 |

8 chez `747live.bet`, 2 chez `marcustheatres.com`. **Aucune de ces 10 URL n'a été recrawlée depuis le 10/10** : le statut n'a pas encore pu changer, c'est normal à J+1.

**Ce que sert la prod aux 10 URL (curl avec UA Googlebot mobile, 12/10 ~07:00 UTC)** : HTTP 200 pour toutes, `<link rel="canonical">` = l'URL elle-même (10/10), `<meta name="robots" content="index, follow">`, aucun en-tête `x-robots-tag`, cache `HIT`, variante `www.` en 301 vers l'apex en un saut. 40 fiches comparées (dont ces 9 fiches) : aucun signe qui les distingue des fiches indexées (longueur de texte propre, canonique, robots) ; elles sont minces comme les autres (`maillage-decouverte-s20.md` §1.5).

### Règles de contrôle (@data-analyst, 5 min chacun, recette d'inspection dans `maillage-decouverte-s20.md` §7)
1. **15/10 (J+3)** : réinspecter les 10 URL + le pilier. Ne conclure que sur les URL dont le dernier crawl est **postérieur au 12/10**. Recrawlée et canonique = notre URL : résolue. Recrawlée et canonique encore étrangère : ouvrir un dossier par URL (test en direct par Thomas, capture de « Afficher la page testée » à @infrastructure ; ne pas redemander l'indexation avant d'avoir vu la capture). Non recrawlée : aucun verdict, reporter au contrôle suivant.
2. **19/10 (J+7)** : idem. Si **5 URL ou plus** sont recrawlées et toujours étrangères : cause = rendu jugé quasi vide ou interchangeable, pas l'infrastructure (Cloudflare exclu, texte propre vérifié) ; décision O1 / O2 (`maillage-decouverte-s20.md` §5) avec Thomas. Si moins de 5 sont recrawlées : repousser à J+14 (26/10).
3. **Pilier** : rester « Envoyée et indexée » avec canonique nôtre aux 15/10, 19/10, 26/10 ; relever au 26/10 ses impressions sous l'URL apex sur « comment devenir drôle » (14/07→09/10 : aucune impression sous l'URL apex ; `exercices-developper-humour` porte 49 impressions, positions 52 à 54, sur les graphies « drôle » et « drole »).
4. **Demandes d'indexation** (Thomas) : lot 2 du 13/10 = ces 10 URL (`maillage-decouverte-s20.md` §5, A1), une seule demande par URL, après un test en direct montrant la page complète.
5. Ajouter toute nouvelle URL en « canonique étrangère » repérée à ce tableau (indicateur : `googleCanonical` hors `deviens-marrant.fr`).

## Handoff → @orchestrator (puis @infrastructure, @fullstack, @growth)
- Fichier : `/home/user/Marrant/docs/seo/point-etape-s20.md`. Scripts et exports de la session : scratchpad uniquement (aucun secret dans le repo).
- Décisions : le pilier n'est plus un cas de maillage mais de réponse servie à Googlebot ; pas de nouvelle URL ; IndexNow des 12 slugs fait (200) ; Bing 15 URL soumises.
- Points d'attention : cause du doublon étranger `[À VÉRIFIER]` (test live GSC + événements Cloudflare) ; quota Bing 15/jour ; rebond Umami 76 % non comparable ; double optimisation SEO/GEO sur le pilier à valider avec @geo avant toute réécriture.
