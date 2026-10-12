# Doublon du pilier et découverte des 304 URL jamais explorées : verdicts et spec de maillage (s20, 12/10/2026)

> @seo, 12/10/2026 ~07:00 UTC. **Spec uniquement** : aucun code, aucune modification du site, aucun commit. Implémentation par @fullstack (voir §6).
> Sources (toutes relues le 12/10) : Search Console API (inspection des 415 URL du sitemap de prod + Performances 14/07→09/10 + liste des sitemaps), Bing Webmaster API (3 URL + `GetCrawlStats`), HTML de prod (curl UA Googlebot) de 16 articles et de 41 fiches, crawl du site depuis l'accueil (1 036 pages, liens `<a href>` du HTML serveur, profondeur de clic mesurée), code `apps/web/src`. Scripts et exports : scratchpad de session uniquement.
> Volumes de recherche : indisponibles (niche), travail sur impressions GSC. Ce qui n'a pas pu être établi est marqué `[À VÉRIFIER]`.

## 0. Résumé (10 lignes)

1. **Doublon : NON, il n'y a pas de chevauchement de texte** entre le pilier et `exercices-developper-humour` (0 phrase identique de 8 mots ou plus ; 5-grammes communs 3,0 % avant retrait du gabarit, < 1 % après). Seul recouvrement réel : `je-suis-pas-drole-comment-changer` (anecdote Mirabel / Fary / Gardin racontée deux fois, étude Crawford et Caltabiano, réponse « timide » de la FAQ). Détail et reco éditoriale en §1.
2. **Le pilier est sorti du doublon étranger** : au 12/10 06:33 UTC il est « Envoyée et indexée », canonique Google = notre URL, canonique déclarée vue. Reste **10 URL** (pas 11) en « canonique étrangère » : liste exacte dans `point-etape-s20.md`, section « Suivi canonique étrangère ».
3. **304 URL sur 415 jamais explorées** (lastCrawl vide) : 124 vannes, 56 conseils, 87 vidéos, 17 articles, 5 pages parcours, 7 thèmes, 8 pages statiques dont `/videos` et `/parcours`. L'écart « Détectée / Inconnue » de l'API est du bruit (§2) : le seul indicateur fiable est « lastCrawl vide ».
4. **Chemin d'exploration : pas cassé, mais mal construit.** Les listes `/vannes`, `/conseils`, `/videos` et leur pagination sont de vrais `<a href>` dans le HTML serveur, canonique auto-référente par page, 404 propre hors plage. Défauts : (a) pagination en chaîne Précédent / Suivant seulement (la page 12 est à 12 clics du hub, une fiche conseil de la page 12 à 13 clics) ; (b) blocs « Dans la même catégorie » sans tri : toujours les mêmes ~4 fiches par catégorie (78 vannes, 90 conseils, 54 vidéos ne reçoivent aucun lien d'une autre fiche).
5. **Mais le maillage n'explique pas à lui seul l'absence de crawl** : `/videos`, `/parcours`, `/glossaire`, `/quiz-humour` sont liés depuis 467 pages (en-tête et pied de page), à 1 clic de l'accueil, et ne sont jamais explorés ; `timing-humour` a 54 pages sources et n'a jamais été exploré. Le goulot est la **demande de crawl** (domaine sans lien entrant, fiches très minces). La spec corrige la structure et le poids des liens, elle ne promet pas de résultat : critères de mesure en §7.
6. **Top 5 de la spec** : S1 pagination numérotée ; S2 « même catégorie » équitable (anneau de voisins) ; A1 demandes d'indexation manuelles (7 hubs/parcours puis les 10 URL étrangères), seule action au résultat constaté (le pilier) ; S3 accueil : 5 parcours + 3 derniers articles ; S5 sitemap : `lastmod` de 6 pages dans le futur (31/12/2026). Détail et ordre en §6.

## 1. Contenu dupliqué

### 1.1 Méthode
HTML de prod du 12/10 (curl, UA Googlebot, 200 partout), texte extrait de `<article>` / `<main>` (paragraphes, listes, citations de 6 mots et plus). Mesures : (i) 5-grammes de mots communs (contenance dans les deux sens), (ii) paragraphes dont le cosinus de sac de mots (hors mots vides) dépasse 0,5, (iii) phrases identiques de 8 mots et plus, (iv) cosinus global (proximité de sujet), (v) titres H2/H3 et FAQ comparés à la main. 3 paragraphes de gabarit (offre Premium, « Maintenant, reste à le dire à voix haute », « Des exercices concrets… ») présents sur les 16 articles sont retirés avant mesure.

### 1.2 Pilier `/blog/comment-devenir-drole` (1 562 mots, 8 H2) contre 15 articles proches

| Page | Mots | 5-grammes pilier dans page | 5-grammes page dans pilier | Paragraphes proches (cos ≥ 0,5) | Proximité de sujet (cosinus) |
|---|---|---|---|---|---|
| `je-suis-pas-drole-comment-changer` | 1 433 | 3,1 % | 3,4 % | 1 | **0,60** |
| `confiance-humour-apres-rupture` | 1 683 | 0,0 % | 0,0 % | 0 | 0,49 |
| `timidite-et-humour` | 1 805 | 0,8 % | 0,7 % | 0 | 0,49 |
| `humour-quotidien-8-habitudes` | 1 013 | 0,4 % | 0,6 % | 0 | 0,47 |
| `pourquoi-blagues-marchent-pas` | 1 687 | 0,5 % | 0,5 % | 0 | 0,46 |
| `exercices-developper-humour` | 1 057 | < 1 % | < 1 % | 0 | **0,41** |
| `humour-noir-utiliser-sans-blesser`, `timing-humour`, `5-types-humour-lequel-pour-toi` | 903 à 1 259 | 0,0 à 0,5 % | 0,0 à 0,7 % | 0 | 0,44 / 0,42 / 0,41 |
| 6 autres (comment-avoir-de-la-repartie, storytelling, erreurs-blagues, autodérision, phrases drôles, repartie débutant) | 853 à 2 072 | < 1 % | < 1 % | 0 | ≤ 0,41 (valeur exacte non imprimée) |

Sur les 120 paires des 16 articles, **aucune** ne dépasse 3,4 % de 5-grammes communs hors gabarit (maximum : pilier / JSP).

### 1.3 Verdict pilier contre `exercices-developper-humour`
- **Pas de doublon de texte** : 0 phrase identique sur 77, titres H2/H3 sans recoupement (pilier = 5 piliers, science, plan 30 jours, erreurs, « à qui ça s'adresse » ; exercices = 10 exercices par niveau, plan de progression), intros distinctes, 4 questions de FAQ distinctes (« devenir drôle rapidement », « tout le monde peut », « timide », « tout âge » contre « développer avec des exercices », « exercice le plus efficace », « combien de temps par jour », « s'entraîner seul »).
- **Chevauchement d'intention, faible** : la FAQ 1 du pilier (« note une absurdité par jour… ») et l'exercice 1 (radar à absurdités) donnent la même consigne. Le rôle déjà fixé en s15 (pilier = comprendre + cadre + plan ; exercices = s'entraîner) est **respecté dans le texte en ligne** : le pilier renvoie vers les exercices (lien en fin de plan), les exercices renvoient vers le pilier.
- **Mais la SERP montre déjà la cannibalisation côté Google, par défaut** (GSC 14/07→09/10, requête « comment devenir drôle ») : `/blog/exercices-developper-humour` 42 + 7 impressions, position 51 à 54 ; `/blog` 32 + 12 impressions, position 30 ; **le pilier n'apparaît que sous l'URL `https://www.deviens-marrant.fr/blog/comment-devenir-drole`** (6 impressions sur « comment devenir drôle », position 18,2 ; 10 requêtes au total ; **0 impression sous l'URL apex** sur 14/07→09/10). Google sert encore l'ancienne variante `www.`, redirigée en 301 : à surveiller, le regroupement sous l'apex devrait suivre l'indexation du 12/10. Google n'avait pas d'autre page à proposer tant que le pilier n'était pas indexé. À surveiller maintenant qu'il l'est (§7).
- **Conclusion** : l'hypothèse « le pilier n'est pas indexé à cause d'un doublon avec la page d'exercices » (cause 3 de `pilier-non-indexe-s15.md`) est **écartée par la mesure**. Elle n'aurait de toute façon pas pu produire une canonique chez `747live.bet`.

### 1.4 Le vrai recouvrement : pilier contre `je-suis-pas-drole-comment-changer` (JSP)
Constats vérifiés dans le HTML :
- Même anecdote en ouverture : « Paul Mirabel remplit Bercy… ce mec est né drôle… sauf que Paul a fait des centaines d'open mics… des vannes qui tombaient à plat une fois sur deux », avec Fary et Blanche Gardin (cos 0,69 sur ce paragraphe).
- Même étude (Crawford et Caltabiano, 2011) et même réponse de FAQ « Comment devenir drôle quand on est timide ? » (« la timidité est un atout : tu observes plus, tu parles moins… commence par l'écrit »), même fourchette « 2 à 4 semaines ».
- Même promesse de tête (« l'humour est une compétence, pas un chromosome »).
- Requêtes proches : « je suis pas drôle », « comment devenir drôle ». JSP n'a pas encore d'impression significative dans les données lues `[À VÉRIFIER : requête JSP seule non extraite]`.

**Recommandation éditoriale (pour @copywriter, après étalons avec Thomas, P0 s8 ; aucun texte écrit ici)**
1. **Ne pas toucher le pilier** : titre/H1, En bref, intro et chiffres sont un `[CHOIX UTILISATEUR]` du 06/10, et il vient d'être indexé. Zéro modification tant que le suivi §7 n'a pas 14 jours.
2. **Différencier JSP par l'angle, sans retirer d'humoriste ni de citation** (P0 s15) : JSP = « tu te crois nul : voici pourquoi c'est faux et comment débloquer ta première vanne » (croyances, peur du premier bide, 7 pistes). Le pilier garde « comment on apprend : 5 piliers + plan ». Concrètement : (a) l'ouverture Mirabel / Fary / Gardin de JSP est remplacée par un autre fait vérifié sur les mêmes humoristes (ou sur Pascot, Waly Dia, Pierre Croce, Inès Reg, déjà autorisés) centré sur la **peur du premier bide**, pas sur le nombre d'open mics ; (b) la réponse de FAQ « timide » de JSP est reformulée côté JSP (ressenti, première phrase à oser), et renvoie au pilier pour la méthode ; (c) la fourchette de durée de JSP s'aligne sur celle du pilier (2 à 4 semaines pour sentir, 30 jours pour le plan) pour ne pas se contredire ; (d) JSP cite le pilier plus haut dans le texte (aujourd'hui en lien bas de page `[À VÉRIFIER : placement exact]`).
3. **Élément first-hand** (E-E-A-T, un par page) : un chiffre du catalogue réellement affiché en prod (compteur dynamique, jamais en dur) dans JSP, et non dans le pilier.
4. **Mesure du diff réel obligatoire (P0 s11)** avant d'accepter le rapport : taux de changement attendu 10 à 20 % de JSP seulement ; intouchables : slug, H2, nombre de questions de FAQ, liens existants, chiffres, prix. **Relecture à l'aveugle (règle d'or P0 s18)** : la version corrigée de JSP doit passer au niveau ; sinon elle ne remplace pas la version en ligne.
5. **Double optimisation SEO/GEO** : le pilier est la cible des citations IA ; la modification de JSP est neutre pour @geo, à lui montrer avant écriture.

### 1.5 Autres URL touchées : fiches du doublon étranger (10 URL, 6 conseils, 2 vannes, 1 vidéo, 1 article)
Comparaison de 40 fiches : 9 en doublon étranger, 13 indexées, 18 jamais explorées (échantillon aléatoire fixe), hors paragraphes de gabarit présents sur au moins 30 % des fiches du type. Médianes par groupe.

| Type | Mots visibles (méd.) | Dont mots propres à la fiche (méd.) | Part de gabarit (min-max) | Commentaire |
|---|---|---|---|---|
| Conseil | 133 à 162 | **124 à 153** | 4 à 8 % | texte propre, un seul paragraphe commun (« L'exercice… fait partie de Premium ») |
| Vanne | 119 à 129 | **60 à 70** | 40 à 53 % | la moitié de la fiche est du gabarit (étiquettes, blocs d'offre) |
| Vidéo | 47 à 56 | **35 à 44** | 19 à 30 % | **très mince** : environ 40 mots propres + un lecteur YouTube |

- **Aucun doublon interne entre fiches** (chaque fiche a son texte). Les fiches en doublon étranger **ne se distinguent pas** des fiches indexées sur ces mesures : mêmes longueurs, canonique correcte, `index, follow`, 200, pas d'en-tête `x-robots-tag`, `www.` redirige en 301 en un saut. Le regroupement avec un site de paris (747live.bet, Next.js) n'est donc **pas lié à un texte copié** : c'est un regroupement fait par Google sur un rendu jugé quasi vide ou interchangeable `[HYPOTHÈSE B de googlebot-cloudflare-s20 §6, non prouvée]`.
- **Corrélation à noter (3 points, non démontrée)** : part des fiches déjà explorées = conseils 53 % (64/120, ~125 mots propres), vannes 13 % (18/142, ~65), vidéos 2 % (2/89, ~40). Plus la fiche est mince, moins Google la visite. Pistes en §5 (P2, décision Thomas) : enrichir le texte **public** des fiches vidéo, sans toucher à la frontière gratuit / Premium (choix du 04/10 : fiches lisibles sans compte).
- Le pilier lui-même s'est résolu après son crawl du 12/10 06:33 (page de 109 Ko, 1 562 mots) : un rendu complet suffit à sortir du regroupement. Cause exacte du crawl du 11/10 13:06 qui avait donné « canonique étrangère » : **non établie** `[À VÉRIFIER]` (le HTML servi était complet ; le déploiement s20 de 20:24 UTC a eu lieu après, le crawl résolu est postérieur).

## 2. Les URL jamais explorées : état réel au 12/10

### 2.1 Chiffres (inspection de 415 URL, 12/10 06:45 UTC)

| Statut Google | URL | Part |
|---|---|---|
| Envoyée et indexée | 97 | 23,4 % |
| Détectée, actuellement non indexée | 156 | 37,6 % |
| Google ne reconnaît pas cette URL | 148 | 35,7 % |
| Doublon, canonique étrangère | 10 | 2,4 % |
| Explorée, actuellement non indexée | 4 | 1,0 % |
| **Sans date de crawl (jamais explorées)** | **304** (305 hier : le pilier a été exploré) | 73,3 % |

**Piège de lecture** : « Détectée » et « Inconnue » ne sont **pas fiables à l'URL près**. Hier 238 / 67, aujourd'hui 156 / 148. Une seconde passe sur 24 URL tirées au hasard donne 9 « Inconnue » sur 16 devenues « Détectée » et 3 « Détectée » sur 8 devenues « Inconnue » (réplicas d'index différents). **KPI à utiliser : « lastCrawl vide »**, et non la répartition entre ces deux libellés. Les 148 « Inconnue » ont `sitemap` et `referringUrls` vides dans la réponse ; les 156 « Détectée » ont `sitemap` renseigné (le sitemap est lu : 12/10 01:13 UTC, 0 erreur, 0 avertissement).

### 2.2 Regroupement par type

| Type | Total | Déjà explorées | **Jamais explorées** | Remarque |
|---|---|---|---|---|
| Fiches vannes `/vannes/<slug>` | 142 | 18 (13 %) | **124** | 17 du 30/09 au 02/10, 1 le 12/10 |
| Fiches conseils `/conseils/<slug>` | 120 | 64 (53 %) | **56** | 54 du 30/09 au 02/10, 9 le 10/10, 1 le 12/10 |
| Fiches vidéos `/videos/<slug>` | 89 | 2 (2 %) | **87** | 2 explorées le 30/09 |
| Articles de blog | 36 | 19 | **17** | liste ci-dessous |
| Parcours (5 pages) | 5 | 0 | **5** | Machine à Café, Répartie, Confiance, Storytelling, Boulot |
| Thèmes `/vannes/theme/*` | 7 | 0 | **7** | boulot, couple, dating, soirees, famille, gaming, autoderision |
| Pages statiques | 16 | 8 | **8** | `/videos`, `/parcours`, `/glossaire`, `/quiz-humour`, `/anatomie-vanne`, `/mentions-legales`, `/cgu`, `/retractation` |
| **Total** | **415** | **111** | **304** | |

Les 17 articles jamais explorés : `timing-humour`, `erreurs-blagues`, `humour-quotidien-8-habitudes`, `repondre-moqueries-avec-humour`, `blagues-travail-faire-rire-pro`, `jamais-quoi-repondre-techniques`, `timidite-et-humour`, `storytelling-drole-5-structures`, `conversation-machine-a-cafe`, `repartie-soiree-anti-malaise`, `confiance-humour-apres-rupture`, `rester-muet-en-groupe`, `etre-plus-a-l-aise-en-societe`, `techniques-humoristes-pros`, `citation-drole`, `se-presenter-avec-humour` (publié le 12/10), `blagues-halloween-soiree-deguisee`.

Forme du crawl Google : une **vague du 30/09 au 02/10** (jour de la bascule Cloudflare et de la soumission du sitemap : 54 conseils, 17 vannes, 2 vidéos), une petite vague le 10/10 (9 conseils), puis presque rien (1 vanne et 1 conseil le 12/10, plus le pilier). Les hubs ont des dates de crawl très inégales : `/` 09/10, `/conseils` 04/10, `/blog` 30/09, `/vannes` 21/09 (époque Replit), `/videos` et `/parcours` jamais.

### 2.3 Ce que les liens expliquent, et ce qu'ils n'expliquent pas
- **`/videos`** : l'API affiche aujourd'hui « Détectée » avec pour seul `referringUrls` l'article n°1 `meilleures-blagues-droles-2026` (exploré le 04/10, 368 clics sur 462). Les libellés fluctuant (§2.1), on ne conclut pas sur la date de découverte, mais la seule source citée par Google n'est pas l'en-tête. Le lien d'en-tête et de pied de page, présent sur 467 pages, n'a pas suffi à déclencher une exploration en 12 jours. Même constat pour `/parcours`, `/glossaire`, `/quiz-humour`, `/anatomie-vanne` (liés partout, jamais explorés).
- `timing-humour` : 54 pages sources, profondeur 2, jamais exploré. `blagues-halloween-soiree-deguisee` : 1 seule page source. Aucun des deux n'a été visité.
- Conclusion : le **nombre de liens internes n'est pas le facteur limitant** du crawl. Les leviers qui ont un effet constaté ou plausible : (1) la **demande d'indexation manuelle** (le pilier a été exploré à 06:33 UTC, quelques heures après le test en direct et la demande de Thomas) ; (2) les **liens depuis les pages que Google visite déjà** (n°1, accueil, `/conseils`), qui sont la seule source de découverte de `/videos` ; (3) la **qualité du texte public des fiches** (voir §1.5) ; (4) l'**autorité externe** (0 lien entrant côté Bing, kit `docs/growth/kit-soumissions-s15.md`, hors périmètre de cette spec).
- `[À VÉRIFIER, @infrastructure 15 min]` : nombre de **pages HTML** réellement demandées par jour par Googlebot (la requête `httpRequestsAdaptiveGroups` de `googlebot-cloudflare-s20.md` donne 1 444 requêtes en 12 jours, mais mêle HTML, JS, CSS et scanners usurpant l'UA ; chaque rendu de page en consomme une dizaine). C'est ce chiffre qui dit si 415 URL peuvent être explorées en 2 semaines ou en 2 mois.

## 3. Chemin d'exploration : vérifications

### 3.1 Listes paginées `/vannes?page=N`, `/conseils?page=N`, `/videos?page=N` : **explorables, mais en chaîne**
Vérifié dans le HTML serveur (curl, sans JS) :
- Chaque page de liste contient ses fiches en vrais liens `<a href="/vannes/<slug>">` (12 vannes, 10 conseils, 12 vidéos par page ; 5 sur la dernière page vidéos). Données chargées côté serveur et mises en cache 1 h (`lib/catalogue-pages.ts`).
- Pagination : `components/ui/list-pagination.tsx` rend `<a href="?page=N">` réels (composant client mais HTML serveur complet). **Seuls Précédent et Suivant existent** : la page N n'est liée que depuis N-1 et N+1. Pas de numéros, pas de lien vers la dernière page.
- Canonique auto-référente par page (`/vannes?page=2` → elle-même), `index, follow`. Hors plage : 404 `noindex` (`/vannes?page=13`, `/videos?page=9`). Nombre de pages : vannes 12, conseils 12, vidéos 8.
- Les liens `?category=` (38 URL distinctes, dont 11 sur `/blog`) rendent le **même HTML que la page 1** avec canonique vers la page de base : sans danger, ils ne comptent pas comme chemin d'accès (exclus de la profondeur ci-dessous).
- Ordre des listes : `createdAt desc, id asc`. Chaque nouvelle fiche décale toutes les autres d'un rang : une fiche passe de la page N à N+1 sans que rien n'ait changé pour elle. Sans effet grave si toutes les pages sont liées entre elles (S1).

### 3.2 Profondeur de clic depuis l'accueil (crawl du 12/10, liens du HTML serveur, hors `?category=` et `?q=`)

| Type | n | Profondeur min / médiane / max (tous liens) | Idem **via les listes seules** (sans lien fiche → fiche) |
|---|---|---|---|
| Fiches vannes | 142 | 1 / 3 / 7 | 1 / 3 / **13** (12 fiches aux profondeurs 11 à 13) |
| Fiches conseils | 120 | 1 / 4,5 / **13** | 1 / **7** / **13** (8 à 10 fiches par profondeur de 7 à 13) |
| Fiches vidéos | 89 | 1 / 3 / 8 | 1 / 5 / 9 |
| Articles, thèmes, parcours | 48 | 1 à 2 | n/a |

Sur ces mêmes 415 URL, **aucune n'est orpheline** (toutes atteintes), **aucune URL interne liée n'est hors sitemap**, tous les liens suivis répondent 200.

### 3.3 Les blocs « Dans la même catégorie » ne répartissent rien
`vannes/[slug]/page.tsx` l.156-171, `conseils/[slug]/page.tsx` l.141-155, `videos/[slug]/page.tsx` l.138-148 : `findMany` de 12 fiches de la même catégorie **sans `orderBy`**, on en garde 4. Résultat mesuré (liens fiche → fiche dans le crawl) :

| Type | Fiches sans aucun lien d'une autre fiche | Fiches avec 10 liens entrants ou plus | Maximum |
|---|---|---|---|
| Vannes (142) | **78 (55 %)** | 20 | 25 |
| Conseils (120) | **90 (75 %)** | 24 | 27 |
| Vidéos (89) | **54 (61 %)** | 16 | 23 |

Pour ces fiches, le seul chemin est la pagination en chaîne. À l'inverse, 4 fiches par type concentrent 23 à 27 liens chacune.

### 3.4 Parcours
- Les 5 parcours reçoivent beaucoup de liens vers `?src=fiche|blog|accueil|suite|abonnement` (38 à 60 pages sources chacun, surtout des fiches) : canonique propre, sans risque, mais ces liens viennent de pages **non explorées**.
- Liens vers l'URL propre depuis des pages explorées : l'accueil (3 parcours sur 5, en `?src=accueil`), le hub `/parcours` (5). **Storytelling et Boulot : uniquement `/parcours` (qui n'est lui-même pas exploré).** Le hub est lié en en-tête et pied de page.
- Bing : `/parcours` exploré le 11/10 17:08 UTC, `/videos` le 10/09, **`/parcours/boulot` inconnu de Bing** (date de découverte vide).

### 3.5 Sitemap
- **415 URL** = 16 pages statiques + 5 parcours + 7 thèmes + 36 articles + 142 vannes + 120 conseils + 89 vidéos. `/api/content-stats` donne 142 / 120 / 89 : **aucune fiche manquante, aucune en trop.** Les pages `noindex` (`/carnet`, `/liens`) en sont absentes, c'est cohérent. (La ligne « ≈ 602 vannes / 400 conseils » de `project-context.md` est périmée : catalogue ramené à 142 vannes après le tri du 30/09 et à 120 conseils après l'audit du 08/10.)
- **Défaut réel : 6 URL ont `lastmod = 2026-12-31`** (date future) : `/`, `/vannes`, `/conseils`, `/videos`, `/blog`, `/blague-du-jour`. Cause : `sitemap.ts` l.36-41 prend la date du dernier `DailyContent`, or le contenu du jour est préparé à l'avance jusqu'au 31/12 (choix du 30/09). Un `lastmod` futur est invalide ; Google s'en sert pour décider de revisiter, Bing le pénalise. À corriger (S5).
- Les autres `lastmod` sont stables et plausibles : articles 2026-03-30 à 2026-10-12 (23 au 29/09), vannes 119 au 30/09 (lot de réécriture), conseils 80 au 08/10, vidéos 86 au 28/05, parcours 08 et 11/10, thèmes 30/09. `[À VÉRIFIER : un `updatedAt` de fiche bouge-t-il sans changement visible lors des lots de réécriture ?]`
- Le sitemap soumis à Google est l'apex ; la liste ne contient aucun sitemap `www.`. Google démarre pourtant des crawls par des URL `www.` (301 vers l'apex en un saut) et cite `https://www.deviens-marrant.fr/sitemap.xml` comme source de l'accueil : reliquat d'inventaire de l'ancienne configuration, sans action à mener (suivre « Pages avec redirection »).

## 4. Spec de maillage interne (implémentable par @fullstack)

Principes : zéro nouvelle URL, zéro suppression, pas de bourrage (aucune page ne dépasse ~50 liens internes de contenu hors navigation), ancres descriptives et sobres, tutoiement dans tout libellé visible, pas de tiret cadratin, humoristes inchangés. Les liens vont **depuis les pages que Google visite déjà** (accueil, `/conseils`, `/blog`, article n°1, fiches déjà explorées) **vers celles qu'il ne visite pas**.

### S1. Pagination numérotée des listes (priorité 1)
- **Fichiers** : `apps/web/src/components/ui/list-pagination.tsx` (partagé par `components/vannes/vannes-list.tsx`, `components/conseils/conseils-list.tsx`, `components/videos/videos-grid.tsx` et `app/(dashboard)/vannes/theme/[slug]/page.tsx`) ; `lib/list-pagination.ts` (`listPageHref` inchangé).
- **Aujourd'hui** : Précédent, « Page X / Y », Suivant. La page N n'est liée que depuis N-1 et N+1.
- **À faire** : entre Précédent et Suivant, une rangée de liens `<a href="…?page=N">` (page 1 = URL de base, déjà géré par `listPageHref`). Si `totalPages ≤ 15` (aujourd'hui 12, 12, 8) : **toutes** les pages. Au-delà : 1, 2, page courante ±2, avant-dernière, dernière, avec « … » non lié. Page courante : `<span aria-current="page">` sans lien. `aria-label="Page N"` sur chaque lien. `onNavigate` conservé (navigation sans rechargement), clic molette et Ctrl/Cmd inchangés.
- **Contraintes** : tous les liens présents dans le HTML serveur, **aucun `display:none` sur un lien** (indexation mobile d'abord) : sur 375 px la rangée passe à la ligne (`flex-wrap`), cible tactile 44 px, arbitrage visuel par @design et @ux. Ne pas changer le tri (`createdAt desc, id asc`) ni la taille de page (12 / 10 / 12 : la changer déplacerait toutes les fiches). Ne pas ajouter `rel="nofollow"`.
- **Effet attendu (mesurable)** : accueil → hub (1) → page N (2) → fiche (3) : **profondeur maximale 3** par les listes (aujourd'hui 13 pour 12 vannes, 8 à 10 conseils par palier de profondeur 7 à 13). Environ +11 liens par page de liste.
- **Tests** : HTML serveur de `/vannes`, `/vannes?page=12`, `/conseils?page=7`, `/videos?page=8` contient respectivement 12, 12, 12 et 8 liens `?page=` (ou `/vannes` pour la page 1), la page courante sans lien ; canonique et `index, follow` inchangés ; `?page=13` toujours 404.

### S2. Bloc « Dans la même catégorie » : anneau de voisins (priorité 1)
- **Fichiers** : `app/(dashboard)/vannes/[slug]/page.tsx` l.156-171 ; `app/(dashboard)/conseils/[slug]/page.tsx` l.141-155 ; `app/(dashboard)/videos/[slug]/page.tsx` l.138-148. Le rendu (`<nav aria-label="Vannes liées">`, titre « Dans la même catégorie », 4 cartes) ne change pas.
- **Aujourd'hui** : 12 fiches de la catégorie lues **sans `orderBy`**, 4 gardées : toujours les mêmes. 78 vannes, 90 conseils, 54 vidéos ne reçoivent aucun lien d'une autre fiche ; 4 fiches par type en reçoivent 23 à 27.
- **À faire** : lire les fiches actives de la catégorie dans l'ordre des listes (`createdAt desc, id asc`), dédoublonner avec les helpers existants (`dedupeJokesByContent`, `dedupeTipsByTitle` ; vidéos : `youtubeId` unique), repérer la position i de la fiche courante et afficher les voisins **i+1, i+2, i-1, i-2 (modulo n)**, toujours 4 liens. Catégorie de moins de 5 fiches : toutes les autres.
- **Effet** : chaque fiche reçoit exactement 4 liens entrants de sa catégorie (contre 0 pour 55 à 75 % d'entre elles), chaque catégorie devient un cycle navigable : une seule fiche explorée donne accès à toute sa catégorie.
- **Contraintes** : pas de lien inter-catégories dans ce lot ; conserver `try/catch` (page servie même si la base répond mal) ; coût base : une requête par fiche rendue, sur ~20 fiches par catégorie (vannes 142 / 7 thèmes) `[À VÉRIFIER : coût sous Workers + Hyperdrive, piège de cache s14 ; réutiliser le cache des listes si possible]`.
- **Tests** : sur un jeu de 10 fiches, chaque fiche reçoit 4 liens et le graphe est fortement connexe ; la fiche courante n'apparaît jamais dans son propre bloc ; aucune copie de contenu (dédoublonnage) ne s'affiche deux fois.

### S3. Accueil : 5 parcours et 3 derniers articles (priorité 2)
Page la plus explorée du site (09/10), déjà 14 liens de navigation, 6 fiches (2 plus récentes par type, `getHomeFeatureExamples`), le pilier, 3 parcours.
- **Fichiers** : `app/(dashboard)/page.tsx` (section « Tu te reconnais ? » l.90-155) ; un petit composant serveur pour le bloc d'articles.
- **S3a. Parcours manquants** : sous les 3 cartes personas, avant la phrase du pilier (l.147), une ligne « Deux autres parcours : [Parcours Storytelling] et [Parcours Boulot]. » dont les parcours viennent de la liste dynamique des parcours publiés (celle qui alimente le hub et `llms.txt`, rendue dynamique en s19), privée des 3 déjà affichés. Liens `…?src=accueil` comme les trois autres. Effet : les 5 parcours liés depuis la page la plus explorée ; aujourd'hui Storytelling et Boulot ne sont liés que depuis `/parcours`, lui-même jamais exploré.
- **S3b. Derniers articles** : un bloc de **3 liens** (titre de l'article, pas d'extrait) vers les 3 articles publiés les plus récents, même source que `/blog` (statiques + base filtrés par `visibleBlogArticleWhere`, tri par date de publication décroissante), **hors pilier**. Titre du bloc : « Derniers articles » (microcopy à valider par Thomas, P0 s8). Effet : chaque nouvel article (jeudis 22/10 à 03/12, lundis) est lié depuis la page la plus explorée dès sa publication (délai de l'ISR d'accueil : 1 h au plus `[À VÉRIFIER]`). Aujourd'hui l'accueil ne lie qu'un seul article.
- **Ne pas faire** : lien « toutes les vannes » ou liste de fiches supplémentaire (l'accueil en lie déjà 6) ; footer élargi (le pilier y est déjà, L1 s15).

### S4. Liens contextuels vers 8 articles peu liés (priorité 3)
Cibles (jamais explorées, 1 à 4 pages sources dans le crawl) : `blagues-halloween-soiree-deguisee` (1), `conversation-machine-a-cafe` (2), `etre-plus-a-l-aise-en-societe` (2), `techniques-humoristes-pros` (2), `citation-drole` (3), `storytelling-drole-5-structures` (3), `se-presenter-avec-humour` (4), `timidite-et-humour` (4).
- **Règle** : une phrase dans le corps d'un article **déjà indexé et exploré** de sujet voisin, jamais dans le dernier paragraphe, jamais dans la FAQ, ancre descriptive variée (jamais « cliquez ici » ni l'URL), au plus 2 nouveaux liens par article source, **0 pour le pilier** (gelé, §1.4) et **au plus 1 pour l'article n°1**. Même méthode que L5 de `liens-pilier-appliques-s15.md`.
- **Appariements proposés** (sources = articles « Envoyée et indexée » avec date de crawl ; **pertinence à confirmer à la lecture du texte** `[À VÉRIFIER : les 10 sources n'ont pas été relues]`) :

| Source (indexée) | Cible | Ancre type |
|---|---|---|
| `phrases-droles-conversations` | `conversation-machine-a-cafe` | « la conversation à la machine à café » |
| `comment-improviser-des-blagues` | `conversation-machine-a-cafe` | « tenir la conversation à la machine à café » |
| `avoir-confiance-en-soi-grace-a-l-humour` | `etre-plus-a-l-aise-en-societe` | « être plus à l'aise en société » |
| `comment-avoir-de-la-repartie` | `etre-plus-a-l-aise-en-societe` | « se sentir à l'aise en groupe » |
| `autoderision-interactions` | `se-presenter-avec-humour` | « te présenter avec humour » |
| `comment-faire-rire-une-fille` | `se-presenter-avec-humour` | « une première impression drôle » |
| `exercices-developper-humour` | `techniques-humoristes-pros` | « les techniques des humoristes pros » |
| `blague-drole-7-criteres-pepite` | `techniques-humoristes-pros` | « comment les pros construisent leurs blagues » |
| `phrases-droles-conversations` | `citation-drole` | « citations drôles » |
| `blague-courte-arme-secrete-humour` | `citation-drole` | « une citation drôle » |
| `comment-raconter-une-blague-sans-la-rater` | `storytelling-drole-5-structures` | « 5 structures de storytelling » |
| `comment-improviser-des-blagues` | `storytelling-drole-5-structures` | « raconter une histoire drôle » |
| `comment-faire-rire-une-fille` | `timidite-et-humour` | « humour et timidité » (requête réelle « comment faire rire une fille timide », position 9,2) |
| `comment-avoir-de-la-repartie` | `timidite-et-humour` | « oser quand on est timide » |

- `blagues-halloween-soiree-deguisee` : pas de source évidente ; article saisonnier (31/10) : **demande d'indexation manuelle** (A1) plutôt que lien forcé.
- **Exécution** : @copywriter place les phrases (brief : emplacement et ancre), @fullstack applique dans `blog-articles.ts` / base. **Mesure du diff réel (P0 s11)** : 0,5 à 1,5 % de mots ajoutés par article, 0 mot retiré, H2 / FAQ / liens existants / chiffres inchangés, `updatedAt` réel seulement pour les articles modifiés. Pas de relecture à l'aveugle nécessaire (une phrase de liaison, pas de vanne), mais **un contrôle de non-tiret cadratin**.

### S5. Sitemap : `lastmod` futur et `/blog` (priorité 2, très court)
- **Fichier** : `app/sitemap.ts` l.33-44. `lastContentDate` vient du dernier `DailyContent` **sans borne haute** : 6 URL (`/`, `/vannes`, `/conseils`, `/videos`, `/blog`, `/blague-du-jour`) annoncent **2026-12-31**.
- **À faire** : (1) borner à `date ≤ aujourd'hui (UTC)` ; repli `STRUCTURAL_PAGES_LASTMOD`. (2) `/blog` : `lastmod` = date de publication (ou modification réelle) du dernier article visible, pas la vanne du jour. (3) Test : aucun `lastmod` postérieur à la date du jour dans la sortie du sitemap.
- **À ne pas faire** : régénérer les `lastmod` des fiches à chaque build (stables et réels aujourd'hui).

### Pas d'action de maillage (vérifié)
`/videos`, `/parcours`, les 7 thèmes, `/glossaire`, `/quiz-humour`, `/anatomie-vanne` et les pages légales : déjà liés depuis l'en-tête, le pied de page ou 25 à 38 pages de contenu. Ajouter des liens ne changerait rien (§2.3) : utiliser A1. Les liens `?category=` (38 URL, même HTML que la page de base, canonique correcte) et `?src=` (20 URL de parcours, canonique propre) ne sont pas un piège d'exploration. Les 529 variantes `/abonnement?…` sont déjà bloquées par `robots.txt` (s20).

## 5. Actions hors code

### A1. Demandes d'indexation manuelles (Thomas, 2 min par URL, une seule fois par URL)
Seule action au résultat constaté (le pilier, exploré à 06:33 UTC quelques heures après le test en direct et la demande du 11/10 au soir). Procédure : Search Console > Inspection > URL > « Tester l'URL en direct » > si la page testée est complète, « Demander une indexation ». Quota quotidien de demandes de l'ordre de la dizaine `[À VÉRIFIER : non exposé par l'API]`, d'où trois lots.
1. **Lot 1, 12/10** (10 URL, pages que les changements S1 à S5 ne modifient pas) : `/videos`, `/parcours`, `/parcours/storytelling`, `/parcours/boulot`, `/parcours/repartie`, `/parcours/machine-a-cafe`, `/parcours/confiance`, `/blog/5-types-humour-lequel-pour-toi` (459 impressions sur « humour observationnel », position 8,6, « Explorée, non indexée » depuis le 12/08), `/blog/se-presenter-avec-humour` (publié le 12/10), `/blog/blagues-halloween-soiree-deguisee` (saisonnier, 31/10).
2. **Lot 2, 13/10** : les 10 URL « canonique étrangère » (liste dans `point-etape-s20.md`, section « Suivi canonique étrangère »).
3. **Lot 3, 14/10 ou après le déploiement de S1** : les 7 thèmes `/vannes/theme/*`, `/quiz-humour`, `/anatomie-vanne`.
Si un test en direct montre une page vide, un défi ou une erreur : ne pas demander l'indexation, transmettre la capture à @infrastructure.

### A2. Mesurer le vrai rythme de crawl (@infrastructure, 15 min, lecture seule)
Requête `httpRequestsAdaptiveGroups` sur le segment Googlebot (IP `66.249.x`), du 30/09 au 12/10, groupée par type de chemin (HTML, `/_next/static`, `/api`, `robots.txt`) et par jour. Rend deux chiffres : **pages HTML explorées par jour** et part des ressources JS/CSS. Dit si les 304 URL se rattrapent en semaines ou en mois, et si le budget est consommé par les ressources de rendu.

### A3. Bing (@seo, 5 min par jour)
Quota constaté : 15 URL par jour. Soumettre dans l'ordre : `/parcours/boulot` (inconnu de Bing), `/parcours/storytelling`, thèmes `dating` et `gaming` (non soumis le 11/10), puis les 3 derniers articles. Après le déploiement de S1 à S3 : IndexNow (cron existant, 200 constaté le 11/10) pour `/`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/blog`. Contrôle `GetUrlInfo` à J+7 sur `/parcours/boulot`, 1 vanne, 1 conseil, 1 vidéo (date de découverte renseignée).

### A4. Autorité (@growth et Thomas)
La demande de crawl dépend aussi des liens entrants (0 côté Bing, requête de marque absente). Liste Thomas du `point-etape-s20.md` §8, sans changement. Condition de long terme de l'exploration, hors périmètre de la spec.

### Options à décider au 26/10 (Thomas), pas avant mesure
- **O1. Texte public des fiches vidéo** : environ 40 mots propres aujourd'hui, 2 vidéos explorées sur 89. Passer à 100-120 mots publics (ce qu'on y observe, le moment à regarder) sans toucher à la frontière gratuit / Premium (choix du 04/10 : fiches lisibles sans compte). 89 fiches : lot @copywriter, relecture à l'aveugle (règle d'or P0). Effort élevé, à engager seulement si S1 à S3 et A1 ne font pas bouger l'exploration des vidéos.
- **O2. `noindex` des fiches durablement minces et non explorées** : à ne décider qu'avec les mesures de §7 (« mesurer avant de passer des fiches en noindex », `point-etape-s20.md` §7). Risque : perdre de la longue traîne qui n'a jamais été évaluée.

## 6. Priorisation (impact / effort / agent)

| # | Item | Impact | Effort | Agent | Dépend de |
|---|---|---|---|---|---|
| 1 | **A1** lots 1 et 2 (20 URL) | Élevé (effet constaté sur le pilier) | 40 min | Thomas | rien |
| 2 | **S1** pagination numérotée | Élevé (profondeur 13 → 3, 304 URL concernées dont 267 fiches) | 0,25 j | @fullstack (+ @design / @ux pour la rangée mobile, @qa pour les tests HTML serveur) | rien |
| 3 | **S2** voisins en anneau | Élevé (55 à 75 % des fiches passent de 0 à 4 liens entrants) | 0,25 j | @fullstack (+ @qa) | rien |
| 4 | **S5** `lastmod` futur et `/blog` | Moyen (fiabilité du sitemap Google et Bing) | 0,1 j | @fullstack | rien |
| 5 | **S3** accueil : 5 parcours + 3 derniers articles | Moyen (chaque article et chaque parcours lié depuis la page la plus explorée) | 0,25 j | @fullstack ; microcopy « Derniers articles » : @copywriter + Thomas | rien |
| 6 | **A2** rythme de crawl HTML | Moyen (cadre toutes les décisions suivantes) | 15 min | @infrastructure | rien |
| 7 | **§7** suivi J+3, J+7, J+14 | Élevé (verdict sur les 10 URL et sur les 304) | 5 min × 3 | @data-analyst | A1 |
| 8 | **§1.4** différenciation de JSP (après étalons) | Moyen (E-E-A-T, risque de cannibalisation futur) | 0,5 j | @copywriter, relecture à l'aveugle, @geo informé | pilier indexé 14 jours sans changement |
| 9 | **S4** 14 liens contextuels vers 8 articles | Faible à moyen | 0,25 j | @copywriter (placement) puis @fullstack | confirmation de pertinence |
| 10 | **A3** Bing quotidien et IndexNow après déploiement | Moyen (Bing connaît ~70 URL) | 5 min/jour | @seo ; IndexNow : @fullstack (cron existant) | S1 à S3 déployés |
| 11 | **A1** lot 3 (9 URL) | Faible à moyen | 20 min | Thomas | S1 déployé |
| 12 | **O1 / O2** fiches vidéo | À mesurer | élevé / faible | @copywriter / @fullstack, décision Thomas | mesures du 26/10 |
| 13 | **A4** liens entrants | Élevé à long terme | ~2 h | @growth, Thomas | rien |

Ordre proposé pour @fullstack : S1 + S2 + S5 en un lot (tests HTML serveur communs), puis S3, S4 en dernier. Pre-commit habituel de Marrant (tsc build, lint, build, et `npx tsc --noEmit` complet si des tests changent), puis ligne dans `REPLIT_ACTIONS.md`.

## 7. Mesure et critères de succès

Recette de l'inspection (à refaire par @data-analyst, le script de la session n'est pas dans le dépôt) : jeton OAuth du compte de service (portée `webmasters.readonly`), `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` avec `siteUrl = sc-domain:deviens-marrant.fr`, champs lus : `coverageState`, `lastCrawlTime`, `googleCanonical`, `userCanonical`, `pageFetchState`, `robotsTxtState`, `referringUrls`. Entrée : `https://deviens-marrant.fr/sitemap.xml` (415 URL). **Indicateur principal : nombre d'URL à `lastCrawlTime` vide** (304 au 12/10), jamais la répartition « Détectée / Inconnue ».

| Date | Contrôle | Seuil / règle de lecture |
|---|---|---|
| 15/10 | Les 10 URL « canonique étrangère » ; pilier toujours indexé ; lots 1 et 2 de A1 | Ne conclure que sur les URL dont `lastCrawlTime` > 12/10. Une URL recrawlée avec canonique nôtre = résolue ; recrawlée et toujours étrangère = dossier fiche (§1.5, test en direct et capture à @infrastructure) ; non recrawlée = pas de verdict |
| 19/10 | Idem + KPI « lastCrawl vide » + Bing `GetUrlInfo` (4 URL, A3) | Objectif proposé : ≤ 250 (soit au moins 54 URL explorées de plus) `[HYPOTHÈSE : seuil sans historique de comparaison]` ; si S1 à S3 sont déployés avant le 15/10, relire aussi la part des fiches explorées par type |
| 26/10 | Pilier contre `exercices-developper-humour` sur les requêtes « comment devenir drôle / drole », « comment être drôle », « devenir drôle » (Performances, dimensions page + requête, 28 j) ; décision O1 / O2 | Succès pilier : au moins 1 impression sous l'URL apex du pilier et `exercices-developper-humour` absent ou plus bas sur ces requêtes. Si les deux partagent les impressions sans progression du pilier : retoucher `exercices-developper-humour` (titre, FAQ 2 recentrés « s'entraîner », voir `pilier-non-indexe-s15.md` §4.3), pas le pilier |
| Après déploiement S1 à S5 | Re-crawl du site depuis l'accueil (méthode de ce document) | Profondeur maximale des fiches par les listes ≤ 3 ; **0** fiche sans lien entrant d'une autre fiche ; chaque fiche ≥ 4 liens de sa catégorie ; 0 `lastmod` postérieur à la date du jour ; 415 URL toujours atteintes et en 200 |

À J+30 (11/11) : si les fiches vannes restent à moins de 25 % d'explorées et les vidéos à moins de 10 %, rouvrir O1 / O2 avec Thomas `[HYPOTHÈSE : seuils sans historique, à recaler après le contrôle du 19/10]`.

## 8. Limites et points `[À VÉRIFIER]`

1. Cause exacte du classement « canonique étrangère » du 11/10 13:06 : non établie. Le HTML servi était complet et Cloudflare est exclu (`googlebot-cloudflare-s20.md`). Aucune action de cette spec ne dépend de cette cause.
2. Les libellés « Détectée » et « Inconnue » de l'API d'inspection ne sont pas stables d'un appel à l'autre (§2.1). Le rapport « Pages » de l'interface Search Console peut donner d'autres totaux `[À VÉRIFIER, Thomas 2 min : comparer le total « Détectée, non indexée » de l'interface à 156]`.
3. Quota de demandes d'indexation, rythme de crawl HTML par jour, quota Bing de 15 URL (annoncé 100 le 05/10) : non vérifiés.
4. Appariements de S4 construits sur titres et sur les requêtes GSC, sans relecture des textes sources.
5. Corrélation entre minceur du texte public et exploration (§1.5) établie sur 3 types de fiches, sans test d'intervention : elle justifie O1 comme hypothèse à tester, pas comme cause.
6. `updatedAt` des fiches (base de leur `lastmod`) : non vérifié s'il bouge sans changement visible.
7. Aucun volume de recherche disponible (niche) : priorisation en impressions GSC et en structure.
8. Surface Google seulement pour les mesures d'exploration ; côté Bing, 3 URL lues (§3.4). Les changements S1 à S5 sont neutres ou favorables à Bing (canonique absolue conservée, `lastmod` plus fiable).

---
**Handoff → @fullstack (S1, S2, S5, puis S3, S4), @data-analyst (§7), @infrastructure (A2), @copywriter (S4 placement, §1.4 après étalons Thomas), Thomas (A1)**
- Fichiers produits : `/home/user/Marrant/docs/seo/maillage-decouverte-s20.md` ; section « Suivi canonique étrangère » ajoutée à `/home/user/Marrant/docs/seo/point-etape-s20.md`. Exports bruts (JSON d'inspection des 415 URL, graphe de liens) : scratchpad de session uniquement.
- Décisions : pas de doublon de texte pilier / exercices (mesure), pilier gelé 14 jours ; pagination numérotée et anneau de voisins avant tout autre ajout de liens ; pas de `noindex` avant mesure ; zéro nouvelle URL.
- Points d'attention : double optimisation SEO/GEO sur `je-suis-pas-drole-comment-changer` (informer @geo avant écriture) ; S3b ajoute un titre visible à l'accueil (microcopy à valider, P0 s8) ; toute modification d'article = mesure du diff réel (P0 s11) et, pour du texte nouveau, relecture à l'aveugle (règle d'or P0 s18) ; déploiement à documenter dans `REPLIT_ACTIONS.md`.
---
