# Rythme d'exploration réel de Googlebot (s21, action A2)

> @infrastructure, 17/10/2026. **Lecture seule** : aucun réglage Cloudflare, aucun code, aucun déploiement.
> Période : du 30/09/2026 00:00 au 16/10/2026 23:59 UTC (17 jours, jours en UTC). Source : API GraphQL Cloudflare, dataset `httpRequestsAdaptiveGroups`, zone `deviens-marrant.fr` (plan Free).

## En bref

- **5 pages HTML par jour en médiane** (moyenne 9,6, de 0 à 78). Sans le pic du 30/09 (bascule vers Workers) : 5,4 par jour.
- **131 URL HTML distinctes** explorées en 17 jours, dont 120 sur les 422 du sitemap (28 %). **Fiches vidéo : 6 sur 90.**
- Les ressources de rendu (JS, CSS, images) font **49 % des requêtes** de Googlebot, contre 25 % pour le HTML. `/api` : 0.
- **96,4 % de réponses 200**, 0 réponse 5xx, 0 réponse 403, 0 réponse 304.
- **Délai pour explorer une première fois les ~308 URL jamais explorées : 13 à 35 semaines** au rythme constaté, avant même de compter les URL ajoutées chaque jour. C'est donc une affaire de mois, pas de semaines.

## 0. Méthode et segment

**Segment retenu : user-agent contenant `Googlebot` (hors `Googlebot-Image`) ET `verifiedBotCategory = "Search Engine Crawler"`.** La catégorie de bot vérifié est attribuée par Cloudflare, qui contrôle l'IP de l'émetteur. Résultat : 659 requêtes, toutes en `GET`, depuis `66.249.73.x` (658) et `192.178.7.x` (1).

Pourquoi ni l'ASN seul, ni l'IP seule, ni l'UA seul :

| Filtre | Problème constaté |
|---|---|
| ASN 15169 | Champ `clientAsn` refusé sur le plan Free (`authz`) |
| IP `66.249.x` seule | Elle mélange GoogleOther (2 755 requêtes, soit 4,2 fois Googlebot), Google-InspectionTool (347, tests en direct de Search Console du 30/09 et du 12/10), Lighthouse (93), le proxy de préchargement de Chrome (97), AdsBot (18) et Read-Aloud (18). Aucun de ces robots n'alimente l'index Search |
| UA `Googlebot` seul | Il ajoute environ 1 100 faux Googlebot non vérifiés, dont 925 depuis `160.79.x` [HYPOTHÈSE : tests UA Googlebot des sessions s20 elles-mêmes, faits depuis la plage d'IP d'Anthropic, cf. `googlebot-cloudflare-s20.md` §4 et §« 403 bots IA »], le reste depuis des clouds (`34.x`, `35.x`, `136.x`, `8.228.x`) |

**Classement des chemins** : `robots.txt` ; `sitemap` (chemin contenant « sitemap ») ; `/_next/static` (`.js` ou `.css`) ; `/api` ; images Open Graph ; puis le type de contenu servi : `html` = page explorée, `htc` (`text/x-component`) = charge RSC. Une page HTML compte dans sa section d'après son premier segment (`/blog`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/` = accueil, tout le reste = autres).

**Fiabilité** : 504 groupes sur 514 ont un intervalle d'échantillonnage de 1, les autres au plus 2. Les compteurs sont donc quasi exacts (écart de quelques unités au plus). **Recoupement** : la vidéo Krief apparaît dans Cloudflare le 13/10 à 17:41 UTC (200, Googlebot smartphone), l'heure exacte de crawl indiquée par Search Console (`point-etape-s20.md`, contrôle J+3).

## 1. Pages HTML explorées par jour

| Jour | HTML 200 | blog | vannes | conseils | vidéos | parcours | accueil + autres | URL distinctes | dont nouvelles* | JS + CSS | robots.txt | sitemap | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 30/09 | 78 | 4 | 13 | 56 | 2 | 0 | 3 | 76 | 76 | 56 | 17 | 1 | 152 |
| 01/10 | 14 | 2 | 3 | 9 | 0 | 0 | 0 | 11 | 10 | 38 | 19 | 2 | 73 |
| 02/10 | 10 | 1 | 6 | 3 | 0 | 0 | 0 | 8 | 6 | 15 | 14 | 0 | 39 |
| 03/10 | 5 | 3 | 0 | 1 | 0 | 0 | 1 | 4 | 3 | 13 | 8 | 1 | 30 |
| 04/10 | 5 | 3 | 0 | 1 | 0 | 0 | 1 | 4 | 2 | 14 | 8 | 1 | 30 |
| 05/10 | 2 | 1 | 0 | 0 | 0 | 0 | 1 | 2 | 0 | 11 | 6 | 0 | 19 |
| 06/10 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 4 | 5 | 1 | 12 |
| 07/10 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 10 | 2 | 14 |
| 08/10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 1 | 5 |
| 09/10 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 11 | 3 | 1 | 16 |
| 10/10 | 10 | 0 | 1 | 9 | 0 | 0 | 0 | 10 | 10 | 16 | 10 | 2 | 38 |
| 11/10 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 2 | 13 | 10 | 0 | 28 |
| 12/10 | 6 | 2 | 1 | 3 | 0 | 0 | 0 | 6 | 4 | 38 | 7 | 1 | 52 |
| 13/10 | 5 | 0 | 1 | 0 | 1 | 0 | 3 | 3 | 1 | 23 | 9 | 2 | 39 |
| 14/10 | 4 | 0 | 0 | 0 | 0 | 2 | 2 | 2 | 2 | 22 | 1 | 0 | 27 |
| 15/10 | 6 | 4 | 1 | 0 | 1 | 0 | 0 | 4 | 2 | 20 | 9 | 1 | 39 |
| 16/10 | 12 | 0 | 9 | 1 | 2 | 0 | 0 | 11 | 11 | 23 | 10 | 1 | 46 |
| **Total** | **164** | **26** | **35** | **83** | **6** | **2** | **12** | **131** | **131** | **317** | **150** | **17** | **659** |

\* URL HTML vue pour la première fois **dans la fenêtre** (Cloudflare ne sait pas si Google l'avait explorée avant le 30/09).

- **Moyenne 9,6 pages HTML par jour, médiane 5, minimum 0 (08/10), maximum 78 (30/09).** Hors 30/09 : 5,4 par jour, médiane 5.
- Semaine du 03/10 au 09/10 : 16 pages (2,3 par jour). Semaine du 10/10 au 16/10 : 46 pages (6,6 par jour). Depuis le déploiement du maillage S1 (12/10) : 6,6 par jour.
- **URL distinctes, couverture du sitemap (422 URL, lu le 17/10)** : conseils 68/121, vannes 28/157, blog 12/37, **vidéos 6/90**, parcours 1/6, accueil 1/1, autres pages 4/10, soit **120/422**. S'y ajoutent 11 URL hors sitemap explorées le 30/09 : 10 anciens slugs de conseils (« blague » devenu « vanne »), servis en 200 ce jour-là et en **308 vers le nouveau slug** aujourd'hui (vérifié le 17/10, canonique correcte), plus `/register` (bloqué par robots.txt depuis s20).
- Premier passage sur le hub `/videos` le **16/10** (inconnu de Google au 11/10).

## 2. Ressources de rendu contre HTML

| Type | Requêtes | Part | Octets servis |
|---|---|---|---|
| Pages HTML (apex) | 165 | 25,0 % | 2,29 Mo |
| JS `/_next/static` | 292 | 44,3 % | 2,81 Mo |
| CSS `/_next/static` | 25 | 3,8 % | 0,27 Mo |
| Images Open Graph | 4 | 0,6 % | 0,47 Mo |
| `/api` | **0** | 0 % | - |
| Charges RSC (`text/x-component`) | **0** | 0 % | - |
| `robots.txt` (apex et www) | 150 | 22,8 % | 0,23 Mo |
| Sitemap | 17 | 2,6 % | 0,22 Mo |
| Redirections www et anciennes URL | 6 | 0,9 % | - |
| **Total** | **659** | 100 % | 6,29 Mo |

- **Ressources de rendu (JS, CSS, images, API) : 321 requêtes, 48,7 %, soit 1,9 ressource par page HTML.** HTML : 25 %. `/api` à 0 : robots.txt (`Disallow: /api/`) est respecté.
- Le sitemap est relu environ une fois par jour (17 fois en 17 jours). `robots.txt` est relu 9 fois par jour en moyenne (13 de ces lectures sur `www.`, en 301).
- Googlebot smartphone : 459 requêtes (69,7 %), Googlebot ordinateur : 200.
- Pour comparaison (hors segment) : GoogleOther a fait 2 755 requêtes, dont 2 224 charges RSC et 163 pages HTML (136 URL distinctes), à 71 % le 30/09.

## 3. Codes HTTP servis à Googlebot

| Statut | Requêtes | Part | Détail |
|---|---|---|---|
| 200 | 635 | 96,4 % | dont 164 pages HTML |
| 304 | 0 | 0 % | Aucune revalidation conditionnelle servie |
| 301 | 15 | 2,3 % | `www.` vers l'apex (13 `robots.txt`, 2 pages) |
| 308 | 5 | 0,8 % | 4 sur `/blog/jeux-de-mots-technique-3-etapes`, 1 sur une fiche vidéo |
| 404 | 4 | 0,6 % | 3 JS et 1 CSS d'anciens builds (décalage après déploiement), aucune page |
| 403 / 429 | 0 | 0 % | |
| 5xx | 0 | 0 % | |

Aucune page HTML n'a été refusée ni mise en erreur. Les 404 portent sur d'anciens fichiers JS ou CSS, sans effet sur le contenu SSR (test de `googlebot-cloudflare-s20.md` §4).

## 4. Délai pour explorer une première fois les ~308 URL jamais explorées

**Stock** : au 15/10, Search Console compte 226 URL « Détectée, non indexée » et 82 URL inconnues de Google, soit **308 URL jamais explorées** sur 422 (`point-etape-s20.md`, contrôle J+3). Au 11/10, elles étaient 305 sur 414.

**Deux mesures du rythme des premières explorations, issues de deux sources indépendantes :**

| Source | Mesure | Rythme | Délai pour 308 URL |
|---|---|---|---|
| A. Cloudflare (ce document) | URL HTML vues pour la première fois dans la fenêtre, du 01/10 au 16/10 : 55 en 16 jours | 3,4 par jour (**borne haute** : une partie avait déjà été explorée avant le 30/09) | 89 jours, **environ 13 semaines** |
| B. Search Console | Écart entre les inspections du 11/10 et du 15/10 : 305 + 8 URL ajoutées au sitemap - 308 = 5 premières explorations en 4 jours | 1,25 par jour (fenêtre courte) | 246 jours, **environ 35 semaines** |

**Effet des URL ajoutées** : le sitemap est passé de 414 à 422 URL entre le 11/10 et le 17/10 (+8 en 6 jours, environ 1,3 par jour). Le stock ne baisse que de l'écart entre les deux rythmes : avec A, 2,1 par jour, soit **environ 21 semaines** ; avec B, environ 0, donc **le stock ne baisse pas**.

**Tendance à confirmer** : du 12/10 au 16/10, après le déploiement du maillage S1 et S2, Cloudflare compte 20 URL nouvelles en 5 jours (4 par jour), soit environ 11 semaines à ce rythme. La fenêtre est trop courte pour conclure : il faut relancer la même requête le 26/10.

**Conclusion chiffrée** : au rythme du 30/09 au 16/10, **entre 13 et 35 semaines** pour que chaque URL soit explorée au moins une fois, hors URL ajoutées. Cela suppose que Google n'explore que des URL nouvelles, alors qu'en pratique il réexplore aussi les pages déjà connues. Ces chiffres sont des durées minimales, à lire comme des mois.

## 5. Constats utiles à la décision O1 / O2 du 26/10

Ces constats éclairent le choix. Ils ne le tranchent pas.

1. **Le frein vient de la demande d'exploration, pas de la capacité du serveur.** Googlebot n'a reçu ni 5xx, ni 403, ni 429, et il explore environ 5 pages par jour (0 le 08/10) sur un site de 422 URL. D'après Google, quand la limite de capacité n'est pas atteinte mais que la demande est faible, Googlebot explore moins. Pour Search, cette demande dépend notamment de la valeur pour l'utilisateur et du caractère unique du contenu. Le guide vise aussi explicitement les sites dont une grande part des URL est « Détectée, non indexée », ce qui est notre cas (54 %). La capacité est partagée entre les robots Google, mais GoogleOther (4,2 fois le volume de Googlebot) n'a provoqué aucune erreur : ce n'est pas un levier.
2. **Les fiches vidéo sont presque absentes de l'exploration : 6 sur 90 en 17 jours.** Le hub `/videos` n'a été exploré pour la première fois que le 16/10. La seule fiche vidéo explorée après le 12/10 (Krief, 13/10) a été classée en canonique étrangère. Quelle que soit l'option, Google ne verra un changement sur une fiche qu'après l'avoir explorée. Un texte étoffé (O1) comme une balise `noindex` (O2) ne seront donc lus qu'au rythme de l'exploration, soit quelques fiches par semaine aujourd'hui. Google précise aussi qu'une page en `noindex` reste demandée par Googlebot : elle ne libère pas d'exploration pour les autres pages.
3. **Premier signal après le maillage, à confirmer le 26/10.** Pages HTML explorées par jour : 2,3 du 03/10 au 09/10, puis 6,6 du 10/10 au 16/10. Le 16/10, 11 URL nouvelles (8 fiches de vannes, `/videos`, 1 fiche vidéo, 1 conseil). Le 10/10, il y avait déjà eu un pic comparable (relecture du sitemap ce jour-là), donc la hausse n'est pas encore attribuable au maillage. Relancer la même requête le 26/10, sur la fenêtre du 17/10 au 25/10, donnera un chiffre comparable pour la décision.

## 6. Limites (ce qui n'est pas accessible ou pas mesuré)

- **`CLOUDFLARE_API_TOKEN` n'a pas le droit Analytics sur la zone** (`authz`, `zone.analytics.read`). Les requêtes ont donc été faites avec `CLOUDFLARE_DM_TOKEN` (droits en lecture déjà ajoutés en s20), sans aucune modification de jeton.
- **Plan Free, champs refusés** : `clientAsn` (pas de segment ASN 15169), `clientRequestQuery` (impossible de séparer `?_rsc=`, sans effet ici : 0 charge RSC), `edgeTimeToFirstByteMs` et ses quantiles (**aucune latence par robot**), `firewallEventsAdaptiveGroups` (déjà noté en s20).
- **Rétention : 31 jours** (« 4w3d » renvoyé par l'API). La période demandée est entièrement couverte. Les données du 30/09 disparaissent vers le 31/10 : l'export brut est conservé dans le scratchpad de session, pas dans le dépôt.
- Cloudflare ne dit pas si une URL est explorée pour la première fois depuis toujours. Ce qui est « nouveau » l'est dans la fenêtre seulement, d'où le recoupement avec Search Console (§4, source B).
- Hors segment : Googlebot-Image (30 requêtes vérifiées), GoogleOther, Google-InspectionTool, AdsBot.
- Le stock de 308 URL date de l'inspection du 15/10. Le sitemap a été relu le 17/10 (422 URL).

**Exports bruts** (scratchpad de session, pas dans le dépôt) : `/tmp/claude-0/-home-user-Marrant/3787bb61-f373-5413-8849-f5156f0bd519/scratchpad/a2/raw_google_2026-09-30_2026-10-16.json` (groupes par jour, UA « Google », IP 66.249.x ou robot de moteur vérifié), `urls_html_googlebot.json`, `sitemap_paths.txt`, `hors_sitemap.txt` et les scripts `export.py`, `agg.py`, `cov.py`, `fam.py` (réutilisables le 26/10 en changeant les dates).

## Sources

- [Google, Optimize your crawl budget](https://developers.google.com/crawling/docs/crawl-budget) (lu le 17/10/2026) : demande et capacité d'exploration, capacité partagée entre les robots, sites avec beaucoup d'URL « Discovered - currently not indexed », « Don't use noindex […] wasting crawling time », prise en charge des 304.
- [Google, Large site owner's guide to managing your crawl budget](https://developers.google.cn/search/docs/crawling-indexing/large-site-managing-crawl-budget?hl=en)
- Données Search Console : `docs/seo/point-etape-s20.md` (§3 et contrôle J+3 du 15/10).
- Segmentation des faux robots : `docs/infra/googlebot-cloudflare-s20.md`.

---
**Handoff → session principale**
- Fichier produit : `/home/user/Marrant/docs/infra/crawl-googlebot-s21.md`
- Décisions prises : aucune, lecture seule. Segment = UA Googlebot vérifié par Cloudflare (ASN refusé sur le plan Free).
- Points d'attention : environ 5 pages HTML par jour, vidéos 6 sur 90, délai de 13 à 35 semaines ; relancer la mesure le 26/10 (fenêtre du 17/10 au 25/10) avant O1/O2 ; rétention de 31 jours.
- **Actions infra requises** : aucune. Optionnel : donner `Analytics Read` à `CLOUDFLARE_API_TOKEN` si l'on veut un seul jeton pour ces mesures.
---
