# Audit GEO post-bascule Cloudflare, deviens-marrant.fr, session 14, 30/09/2026

> Agent @geo. Audit uniquement : aucun fichier de code ni de contenu modifié.
> Sources : code `apps/web` (état du dépôt au 30/09/2026), audits `audit-global-s11.md` et `relecture-5-5-s11.md`, WebSearch du 30/09/2026.
> Limite : je n'ai ni Bash, ni accès à ChatGPT, Claude, Gemini, Perplexity ni au tableau de bord Cloudflare. Baseline de citations : [À MESURER].

## 1. Verdict et score GEO

**Verdict : socle technique solide, mais trois verrous empêchent « d'être au top ».**
1. L'accès réel des bots IA n'est pas vérifiable depuis le code : la bascule sur Cloudflare ajoute une couche (blocage des bots IA, robots.txt géré) que seul Thomas peut lire (P0-1).
2. L'entité de marque est quasi invisible hors du site : pas de `sameAs`, aucune source tierce hors BetaList, aucune présence Reddit / YouTube / presse (P0-3, P1-2).
3. Aucune mesure de citations n'existe après deux audits : on optimise sans savoir si la marque est citée (P0-4).

Ce qui va bien (vérifié dans le code ce jour) : `robots.ts` autorise explicitement tous les bots de recherche et d'entraînement IA (`apps/web/src/app/robots.ts:35-47`) ; `llms.txt` et `llms-full.txt` sont dynamiques et listent les articles avec URL (`app/llms.txt/route.ts:111-165`) ; graphe d'entités par `@id` (Organization, WebSite, Person) (`components/seo/json-ld.tsx:19-21`) ; `dateModified` réel dans Article (`json-ld.tsx:203`) et « Mis à jour le » visible (`blog/[slug]/page.tsx:222`) ; piliers avec « En bref », « Définition », FAQ, listes numérotées ; DefinedTermSet du glossaire ; FAQPage limité au contenu visible (`(dashboard)/page.tsx:37-45`) ; `X-Robots-Tag: noindex` sur `*.workers.dev` (`cloudflare/worker.ts:78-82`).

### 1.1 Score GEO : 63/100 (grille à 7 dimensions de l'audit s11, comparable)

| Dimension | s11 audit | s11 après relecture | Maintenant | Justification |
|---|---|---|---|---|
| Accès bots IA | 10 | 10 | **8/10 (provisoire)** | Code parfait ; couche Cloudflare non vérifiée. 10 si Thomas confirme, 0 à 3 si un blocage est actif |
| Données structurées (/20) | 14 | 16 | **16/20** | Inchangé : `sameAs` absent, HowTo auto-généré toujours présent, `courseWorkload` P3W, `priceValidUntil` 2026-12-31 |
| llms.txt / llms-full.txt (/15) | 5 | 13 | **12/15** | Dynamiques et exhaustifs ; repli « sans base » au build (P0-2) ; `ai-plugin.json` incohérent. Pondération à revoir (voir 1.3) |
| Citabilité des piliers (/20) | 17 | 17 | **16/20** | Structure excellente ; -1 pour l'étude citée qui ne dit pas ce qu'on lui fait dire (P1-1) et les contradictions résiduelles (P1-4) |
| Confiance entité (/15) | 3 | 4 | **4/15** | Inchangé : pas de `sameAs`, pas de Wikidata, nom de plume assumé (choix fondateur) |
| Fraîcheur (/10) | 4 | 7 | **6/10** | `updatedAt` 29/09 non vérifié contre un vrai diff ; dernier article de blog 2026-06-09 ; contenu quotidien à l'arrêt depuis juin |
| Off-site / communauté (/10) | 1 | 1 | **1/10** | Une seule source tierce trouvée (BetaList) |
| **Total** | **54** | **68** | **63/100** | Estimation de préparation, PAS une mesure de citations |

### 1.2 Comparaison avec les 78/100 de mars
- Le 78/100 de mars était une auto-estimation sur 5 dimensions techniques, sans grille publiée : il ne se compare pas au 63 de cette grille à 7 dimensions.
- Ramené aux 5 dimensions techniques de mars (robots, données structurées, llms, piliers, fraîcheur) : 8+16+12+16+6 = 58/75, soit **77/100 : stable** vs 78. Les gains réels depuis mars (piliers reformatés, DefinedTermSet, llms dynamique, `@id`, dateModified) compensent la fraîcheur perdue.
- Les 2 dimensions ajoutées en s11 (entité 4/15, off-site 1/10) tirent le total : c'est là que se joue « être au top », et ce n'est pas du code.
- Incohérence héritée : `audit-global-s11.md` annonce 54/100 (l.10) puis 76/100 (l.291). Retenir 54 (audit) puis 68 (relecture). Ne pas réutiliser les pourcentages d'études de ce fichier (« +28 % », « 46,7 % ») : sans source datée.
- [HYPOTHÈSE] Après P0-1 à P0-4 traités : environ 68-70/100. Plafond sans travail off-site : environ 75/100. Au-delà de 80, il faut des mentions tierces, Reddit / YouTube, un `sameAs` alimenté : c'est du travail @growth / Thomas, pas du code.

### 1.3 Note sur la pondération
llms.txt pèse 15 points dans la grille s11. Or, selon des synthèses 2026 (voir Sources), aucun grand fournisseur (Google, OpenAI, Anthropic) n'a confirmé l'utiliser comme signal, et Google indique dans son guide de mai 2026 qu'il n'est pas nécessaire pour AI Overviews / AI Mode ; la grande majorité des fichiers reçoivent très peu de visites de crawlers IA. Reco : garder le fichier (coût nul, déjà fait), ne plus investir dessus, et ramener son poids à 5 points dans la grille v2 (+10 sur entité et off-site).

### 1.4 Baseline des citations : [À MESURER]
Je n'ai accès ni à ChatGPT, Claude, Gemini, Perplexity ni à AI Overviews. Aucune citation n'est déduite ici.
- Prompts : les 12 de `docs/geo/relecture-5-5-s11.md` section 4, plus 4 nouveaux :
  13. « Qu'est-ce que deviens-marrant.fr ? » (exactitude de l'entité : prix 0,99 €, parcours 3/4/6 semaines, compteurs)
  14. « Deviens Marrant : avis et prix »
  15. « Meilleurs sites ou applications pour apprendre la répartie en français »
  16. « Comment répondre du tac au tac quand on est timide ? »
- Pour chaque prompt et chaque plateforme (ChatGPT avec recherche, Perplexity, Gemini, Claude, + 3 requêtes Google FR pour voir si un AI Overview apparaît et quelles sources il cite) : cité O/N, URL citée, exactitude, sources concurrentes citées.
- Classification attendue : `zéro` (créer l'autorité) / `existante` (vérifier l'exactitude) / `partielle` (adapter par plateforme). **Résultat : [À MESURER] pour les 5 plateformes.**

### 1.5 Ce que les IA reprennent (WebSearch du 30/09/2026, indicatif)
Ordre des résultats de l'outil de recherche, pas un classement Google garanti.
- Requête « devenir plus drôle comment avoir de l'humour guide » : deviens-marrant.fr/blog/comment-devenir-drole en 3e position sur 9, derrière socialskills.fr et olivier-roland.com.
- Requête « comment être drôle apprendre l'humour répartie techniques » : le site apparaît 2 fois (/blog en version **www**, et /blog/comment-avoir-de-la-repartie en 9e position). Autres sources : compagnie-candela.com, socialskills.fr, farce-et-attrape.fr, atelier-theatre.fr, cours-de-theatre-a-paris.fr, olivier-roland.com, humorix.fr.
- Requête « site pour apprendre à être drôle en ligne parcours » : la synthèse de l'outil désigne deviens-marrant.fr comme meilleure correspondance et **reprend presque mot pour mot des passages du site** (« une absurdité par jour, 5 vannes courtes, 2 à 4 semaines »). Bon signe : les passages sont extractibles. Limite : c'est le synthétiseur de l'outil, pas ChatGPT ni Perplexity.
- Requête « "deviens-marrant.fr" » : site + BetaList uniquement. Le résumé cite « 290+ vannes, 60+ conseils, 80+ vidéos » : chiffres périmés (site actuel : 550+ / 350+). Source exacte du résumé non déterminée (ancienne version indexée ou fiche BetaList) : risque de chiffres contradictoires dans les réponses IA.
- Standard de citabilité à dépasser : listicles à titre chiffré (« 3 techniques », « 7 astuces »), guides longs (« un guide, sérieux »), écoles de théâtre avec exercices (autorité de terrain). Marrant a déjà mieux sur la structure (En bref, Définition, FAQ, parcours). Il manque l'autorité externe (mentions, auteur vérifiable), et l'auteur réel reste un choix fondateur non re-questionnable.
- Formats favorisés par les études 2026 (sources en fin de rapport, chiffres non repris faute d'échantillon daté fiable) : Reddit, Wikipedia et YouTube figurent parmi les sources les plus citées ; Perplexity s'appuie davantage sur les forums, ChatGPT sur l'encyclopédique, AI Overviews sur YouTube et Reddit. Marrant n'a ni chaîne YouTube propre, ni présence Reddit.

## 2. Constats P0 / P1 / P2

### P0 : à traiter avant toute autre optimisation

**P0-1. Blocage des bots IA côté Cloudflare : à vérifier par Thomas dans le tableau de bord (non lisible par l'agent)**
- Preuve : le domaine vient de passer derrière Cloudflare (`wrangler.jsonc:5-6,16-19`). Sources web (30/09/2026) : depuis le 1er juillet 2025 chaque nouveau domaine Cloudflare bloque les crawlers IA par défaut ; le 15 septembre 2026 de nouveaux défauts (catégories Recherche / Entraînement / Agent) s'appliquent aux nouveaux domaines et aux clients gratuits existants (Entraînement et Agent bloqués sur les pages avec publicité, Recherche autorisée) ; l'option « robots.txt géré » **préfixe** le robots.txt d'un `Content-Signal: ai-train=no` et de `Disallow: /` pour GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider ; bloquer la catégorie Entraînement peut aussi toucher des crawlers mixtes (Googlebot, Applebot, Bingbot), selon un article relayé à confirmer sur le changelog Cloudflare du 01/07/2026. Le code (`robots.ts`) est correct, mais **ce que voient les bots est ce que Cloudflare sert**.
- Impact : critique. Un blocage actif annule tout le reste (aucune citation ChatGPT, Claude, Perplexity).
- Correctif : Thomas vérifie dans Cloudflare (Security > Bots > AI Crawl Control, plus Security > Settings) :
  1. « Block AI bots » = **Do not block** (ou « Only block on hostnames with ads » : le site n'a aucune publicité, CSP `next.config.js:124` sans réseau publicitaire) ;
  2. « Manage your robots.txt » / robots.txt géré = **désactivé** ;
  3. catégories Recherche, Entraînement, Agent : Recherche = Allow, et Entraînement = Allow si on garde la décision actuelle (voir Q1) ;
  4. Bot Fight Mode / Super Bot Fight Mode : ne pas défier les « verified bots » ; aucune règle WAF ni règle de limitation de débit qui bloque les user-agents IA ;
  5. ouvrir https://deviens-marrant.fr/robots.txt dans un navigateur : le contenu doit être **identique** à `robots.ts` (pas de ligne `Content-Signal`, pas de `Disallow: /` pour un bot IA) ;
  6. le journal AI Crawl Control doit montrer les requêtes de OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot avec statut « Allowed ».
- Agent : Thomas (tableau de bord) puis @infrastructure (documenter le réglage dans `docs/infra/cloudflare-runbook.md`). Aucun blocage ne peut être exclu tant que ce point n'est pas confirmé : [À VÉRIFIER].

**P0-2. Build sans base : sitemap, llms et pages ISR servis en données de repli après la bascule**
- Preuve : `docs/infra/cloudflare-env.md:71` (pages figées en repli jusqu'à la 1re revalidation, 1 h à 24 h) ; `sitemap.ts:27-35,70-90` (catalogue et articles DB : `catch` silencieux) ; `llms.txt/route.ts:82-96` et `llms-full.txt/route.ts:56-82` (DB indisponible : articles statiques seulement, échantillon de catalogue vide) ; la revalidation dépend de `memoryQueue` (`open-next.config.ts:12-15`), file en mémoire d'un isolate, moins fiable qu'une file durable [À VÉRIFIER par @infrastructure].
- Impact : tant que la revalidation n'a pas tourné, `sitemap.xml` ne liste pas les ~1 100 pages catalogue ni les articles DB, et `llms-full.txt` n'a pas d'échantillon de vannes : un crawler IA qui passe cette semaine voit un site plus petit. Le home peut garder la méta-description de repli (« des centaines de vannes », `(dashboard)/page.tsx:49-51`).
- Correctif : (1) **maintenant**, Thomas ou @infrastructure fait 2 GET espacés de quelques minutes sur `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/`, `/blog`, `/vannes`, `/glossaire`, puis contrôle que le sitemap contient les URLs `/vannes/…`, `/conseils/…`, `/videos/…` et tous les articles ; (2) @fullstack : pour `sitemap`, `llms.txt`, `llms-full.txt`, passer en rendu dynamique (`force-dynamic`) avec `Cache-Control: s-maxage=3600` (plus de dépendance à la file ISR ni de repli figé) ; (3) @infrastructure : décider du passage à une file durable ; (4) IndexNow après vérification du sitemap (P1-6).
- Agent : @infrastructure (vérif + file), @fullstack (dynamique).

**P0-3. `sameAs` toujours absent du JSON-LD (Organization)**
- Preuve : `json-ld.tsx:96-109,141` : émis seulement si `NEXT_PUBLIC_SOCIAL_PROFILES` est défini **au build** ; absent (fait connu). C'était déjà G2 (P0) de l'audit s11 et le constat 13 de la relecture s11 : 3 semaines sans changement.
- Impact : entité de marque non reliée aux profils LinkedIn / X / Instagram (les comptes existent, `project-context.md` l.80) ; principal levier d'entité disponible sans Wikipedia.
- Correctif : Thomas fournit les URLs réelles des 3 comptes de la marque (pas de compte personnel : choix fondateur d'identité). @fullstack les **code en dur** dans `json-ld.tsx` (constante) au lieu d'une variable de build fragile sous Workers, puis redéploie. Option : ajouter l'URL de la fiche BetaList. Pas de Wikidata pour l'instant : notabilité insuffisante (aucune source indépendante), risque de suppression [à confirmer sur la politique Wikidata]. Les guides Wikipedia et Wikidata de l'audit s11 (G11) sont donc reportés.
- Agent : Thomas (URLs) puis @fullstack.

**P0-4. Baseline et monitoring inexistants (G4 de s11 toujours ouvert)**
- Preuve : aucun `geo-monitoring-setup.md` dans `docs/geo/`, grille s11 vide (`audit-global-s11.md:259-262`).
- Impact : impossible de piloter, de détecter une erreur factuelle (prix, compteurs périmés) ni de prouver un effet.
- Correctif : Thomas exécute les 16 prompts (§1.4) sur ChatGPT, Perplexity, Gemini, Claude (30 à 40 min, une fois), colle les réponses ; je produis alors le baseline et `geo-monitoring-setup.md`. Cadence ensuite : hebdomadaire (5 prompts clés), mensuelle (16 prompts). Outil payant seulement si la charge manuelle devient gênante (tarifs à rechercher à ce moment-là, aucun prix de mémoire).
- Agent : Thomas (exécution), @geo (analyse).

### P1

**P1-1. Étude citée dont l'énoncé ne correspond pas à la source : à valider Thomas**
- Preuve : le pilier dit « une étude du Journal of Positive Psychology a démontré qu'un entraînement de 8 semaines améliorait significativement la capacité à faire rire » (`blog-articles.ts:37,39,112`, `llms-content.ts:47`, `a-propos/page.tsx:40`). Recherche : l'étude de 8 semaines dans cette revue est Crawford et Caltabiano (2011), *Promoting emotional well-being through the use of humour*, J. Positive Psychology 6(3) : elle mesure le **bien-être émotionnel**, pas la capacité à faire rire. « Université du Nouveau-Mexique » : aucune étude correspondant aux « 3 mécanismes » n'a été identifiée (une thèse UNM sur l'humour existe, sans lien établi).
- Impact : score de vérifiabilité de la grille < 2/3. Un moteur qui recoupe la source relève l'écart, ce qui érode la confiance (et la marque répète l'énoncé dans 5 passages).
- Correctif proposé (aucun chiffre retiré, « 8 semaines » gardé, étude gardée) : ajouter la référence complète (auteurs, année, revue) et reformuler ce que l'étude établit (bénéfices sur le bien-être émotionnel d'un programme d'humour de 8 semaines) ; la promesse « ça s'apprend » reste portée par la structure du site. **Choix fondateur du 29/09 : études gardées, donc GO de Thomas requis** (Q2).
- Agent : @copywriter après GO.

**P1-2. Off-site inexistant : Reddit, YouTube, presse, annuaires**
- Preuve : recherches du 30/09 : seule mention tierce = BetaList ; aucune présence Reddit ni forum ; comptes sociaux à 0 abonné (`project-context.md` l.80) ; catalogue de 89 vidéos mais aucune chaîne YouTube propre.
- Impact : c'est la dimension qui plafonne le score (1/10). Les études 2026 placent Reddit, YouTube et Wikipedia parmi les sources les plus citées.
- Correctif : (a) mettre à jour la fiche BetaList avec les chiffres actuels (elle contredit peut-être le site) ; (b) @growth : plan de réponses utiles et sans lien sur les forums (questions de type « comment répondre du tac au tac »), respectueux des règles de chaque communauté, compte de marque non personnifié ; (c) @social : chaîne YouTube courte (« c'est quoi l'accusé de réception ? », 60 à 90 s, description avec définition + lien) : format repris par AI Overviews ; (d) presse / podcasts : reprendre `docs/seo/ceo-backlinks-strategy.md` (haro-agent supprimé en s9). Rien de tout cela ne s'exécute sans validation (Q3).
- Agent : @growth, @social.

**P1-3. HowTo auto-généré toujours en production (constat 12 de s11 non corrigé)**
- Preuve : `blog/[slug]/page.tsx:171-181` : chaque H2 des articles GUIDE / PRATIQUE / ROADMAP devient une « étape », avec `text = name` ; `buildHowToJsonLd` `json-ld.tsx:349-369`. Les H2 sont des questions (« Pourquoi pense-t-on… ? »).
- Impact : balisage qui ne décrit pas le contenu, risque d'être vu comme du spam ; aucun bénéfice attendu (Google a réduit les résultats enrichis HowTo, fait à reconfirmer).
- Correctif : supprimer, ou le construire depuis la liste numérotée « plan d'action » de chaque pilier.
- Agent : @fullstack.

**P1-4. Contradictions résiduelles entre passages extractibles des piliers**
- Preuve : `timing-humour` : « pause de 2 à 3 secondes » (`blog-articles.ts:227,241`) vs « micro-pause : 1-2 secondes » (l.267), vs « règle des 3 secondes » (l.245) ; `comment-devenir-drole` : « Définition » = incongruité / tension / calibrage social (l.43) mais « À retenir » et FAQ = « observation, surprise, timing » (l.39,110). Constat 11 de s11 toujours ouvert.
- Impact : deux passages contradictoires dans une même page : le LLM cite l'un ou l'autre, ou aucun.
- Correctif : l.267 « 1-2 secondes » devient « 2-3 secondes » (un seul chiffre, aligné sur En bref, À retenir et H2) ; l.39 et l.110 : « leviers » au lieu de « mécanismes cognitifs ». Le chiffre touche un intouchable : **GO Thomas** (Q4).
- Agent : @copywriter après GO.

**P1-5. Balises de vérification Google / Bing dépendantes de variables de build**
- Preuve : `layout.tsx:104-114` (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, absentes si la variable manque au build) ; `cloudflare-env.md:66`.
- Impact : si l'un des builds Cloudflare n'a pas les variables, la vérification par balise disparaît : perte possible de Search Console / Bing Webmaster, donc de l'observabilité de l'indexation qui alimente Copilot et d'autres moteurs. [À VÉRIFIER : je ne sais pas si la vérification se fait par balise ou par DNS.]
- Correctif : Thomas confirme que les deux consoles montrent toujours le site vérifié ; sinon @seo / @fullstack.
- Agent : Thomas, @seo.

**P1-6. Réindexation après bascule : www indexé, IndexNow, chiffres périmés**
- Preuve : la recherche renvoie des URLs en `www.deviens-marrant.fr` (blog et pilier) ; le redirect 301 www vers apex existe (`middleware.ts:58-63`, `wrangler.jsonc:18`) ; `robots.txt` et `sitemap.xml` sont exclus du matcher du middleware (`middleware.ts:79`), donc non redirigés depuis www ; route IndexNow présente (`app/api/indexnow/route.ts`).
- Impact : signaux dupliqués et chiffres périmés (« 290+ vannes ») possibles quelques semaines.
- Correctif : après P0-2, soumettre les URLs clés à IndexNow ; vérifier dans Search Console la consolidation www vers apex ; ne rien changer sur les canoniques (apex, déjà corrects).
- Agent : @seo (coord), @fullstack.

**P1-7. Fraîcheur : blog et contenu quotidien à l'arrêt, `updatedAt` non vérifié**
- Preuve : dernier article statique 2026-06-09 (audit s11 §3.6) ; contenu quotidien à l'arrêt depuis juin (reprend le 01/10) ; `updatedAt: "2026-09-29"` sur les piliers (`blog-articles.ts:105`) alors que la refonte s11 est décrite comme partielle (règle P0 s11 : mesurer le diff réel).
- Impact : si `updatedAt` a été posé sans changement réel, c'est de la fausse fraîcheur (signal de manipulation) ; si le contenu ne reprend pas sous Cloudflare, le sitemap reste figé.
- Correctif : (a) @reviewer / @fullstack comparent par `git diff` les articles portant `updatedAt` 29/09 et ramènent à la date réelle ceux dont le texte n'a pas changé ; (b) vérifier demain que `scheduler-tick` (`wrangler.jsonc:66-73`, `CRON_ENABLED=true`) a bien généré le contenu du jour ; (c) reprendre la publication d'articles (cadence hebdomadaire) et un rafraîchissement réel des 5 piliers tous les 60 jours.
- Agent : @reviewer, @infrastructure, @seo.

### P2

| # | Constat | Preuve | Correctif | Agent |
|---|---|---|---|---|
| P2-1 | Le repli de `llms.txt` répond 200 « Contenu temporairement indisponible » : mis en cache, il peut être ingéré tel quel (constat 17 s11, non corrigé) | `llms.txt/route.ts:177-186` | 503 + `Retry-After`, idem `llms-full.txt` | @fullstack |
| P2-2 | `ai-plugin.json` : format ChatGPT Plugins abandonné ; `api.type: openapi` pointe vers `llms.txt` (ce n'est pas une spec OpenAPI) ; « plateforme francophone de référence » = langage promotionnel | `public/.well-known/ai-plugin.json:6,10-13` | Supprimer, ou corriger sans superlatif | @fullstack |
| P2-3 | `courseWorkload: "P3W"` = 3 semaines de travail, alors que la charge est 3 × 15 min (constat 14 s11) ; test qui fige la valeur | `json-ld.tsx:301-305,414` | `courseSchedule` (`PT15M`, `P1W`, `repeatCount`) + mise à jour du test | @fullstack |
| P2-4 | `priceValidUntil` expire le 31/12/2026 | `json-ld.tsx:339` | Prolonger avant l'échéance | @fullstack |
| P2-5 | Tirets cadratins dans le contenu servi par llms (règle 12) | `llms-content.ts:85-87,106-108,115` | Remplacer par virgule ou deux-points (vérifier si le rendu du blog applique `stripEmDashes`, ex. H3 `blog-articles.ts:45`) | @copywriter |
| P2-6 | « Des centaines de techniques » pour les conseils, alors que le compteur validé est 350+ (GO 29/09) | `llms-content.ts:95` | Écrire « 350+ conseils » (compteur déjà validé, même normalisation que la home) | @fullstack |
| P2-7 | Bots non nommés (Applebot-Extended, Meta-ExternalAgent, Amazonbot, DuckAssistBot, MistralAI-User) : autorisés via le groupe `*`, aucun blocage. Rappel : Google-Extended n'a pas d'effet sur AI Overviews (pilotés par Googlebot) | `robots.ts:17-21` | Optionnel : les nommer pour lisibilité. Reverifier les user-agents dans les docs éditeurs (dernière vérification le 29/09, non refaite ce jour) | @seo |
| P2-8 | `/a-propos` n'a pas de type `AboutPage` ; `twitter:site` absent ; pas de « Dernière mise à jour » visible sur glossaire, anatomie-vanne, parcours | `a-propos/page.tsx:47-54`, `layout.tsx:84-92` | Ajouter `AboutPage` + `mainEntity` (Organization) ; `twitter:site` une fois le compte confirmé ; date visible uniquement si le contenu change réellement | @fullstack |
| P2-9 | `rel="next"/"prev"` (Sprint 4 de `geo-strategy.md`) : Google ne l'utilise plus comme signal d'indexation (à reconfirmer) ; gain GEO nul | `geo-strategy.md` Sprint 4 | Retirer du plan | @geo |
| P2-10 | `geo-strategy.md` périmé (score 78, hébergement Replit, `public/robots.txt` supprimé) ; livrables `entity-audit.md`, `content-restructuring.md`, `llm-content-templates.md`, `geo-monitoring-setup.md` jamais produits | `docs/geo/` (4 fichiers seulement) | Mise à jour + production après le baseline (P0-4) | @geo |

## 3. Questions / validations pour Thomas

### 3.1 Actions de vérification (15 min, sans décision)
1. Dashboard Cloudflare : les 6 contrôles de P0-1 (Security > Bots > AI Crawl Control, robots.txt géré, Bot Fight Mode, journal des crawlers). Puis ouvrir `https://deviens-marrant.fr/robots.txt` et vérifier qu'il correspond au code.
2. Ouvrir 3 fois `/sitemap.xml` et `/llms.txt` à quelques minutes d'écart (warm-up P0-2), compter les URLs `/vannes/` dans le sitemap.
3. Search Console et Bing Webmaster : le site est-il toujours « vérifié » (P1-5) ?
4. Exécuter les 16 prompts (§1.4) et me coller les réponses (P0-4) : c'est ce qui débloque le baseline.

### 3.2 Décisions
| # | Question | Ma recommandation |
|---|---|---|
| Q1 | Les bots d'**entraînement** (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider) restent-ils autorisés, et Cloudflare doit-il être aligné ? | **Oui, tout autorisé.** Le contenu public est fait pour être repris, la partie premium est déjà derrière un accès connecté, et l'objectif est d'être cité (l'entraînement nourrit aussi la connaissance « de base » des modèles). Revoir à 6 mois avec le baseline. Seule nuance : Bytespider est sans intérêt pour l'audience française, sans risque à le laisser |
| Q2 | GO pour ajouter la référence complète de l'étude et reformuler l'énoncé (« 8 semaines » et l'étude gardées, seul ce qu'elle mesure change) ? (P1-1, 5 passages) | **Oui.** Le risque est une contradiction relevée par un moteur qui vérifie la source ; on garde tout, on précise. À défaut : garder tel quel et marquer `[HYPOTHÈSE]` en interne |
| Q3 | GO pour l'off-site : (a) mise à jour de la fiche BetaList avec les chiffres actuels, (b) réponses utiles sans lien sur forums / Reddit au nom de la marque (pas de fondateur), (c) chaîne YouTube courte (définitions 60-90 s) ? | **(a) oui immédiat, (b) oui à petite dose (3 à 5 réponses par semaine, zéro promo), (c) oui en test de 10 vidéos.** C'est la dimension qui plafonne le score (1/10) et elle ne se règle pas par le code |
| Q4 | GO pour corriger la contradiction du timing : « 1-2 secondes » devient « 2-3 secondes » à `blog-articles.ts:267`, et « mécanismes cognitifs (observation, surprise, timing) » devient « leviers » à l.39 et l.110 ? (P1-4) | **Oui** : un seul chiffre change, aligné sur En bref, À retenir et le H2 « règle des 3 secondes » |
| Q5 | GO pour publier dans le JSON-LD les URLs des comptes de marque (LinkedIn, X, Instagram) ? Envoie-moi les 3 URLs exactes ; le code les mettra en dur (P0-3) | **Oui**, même à 0 abonné : le signal est l'existence du profil. Vérifier que les bios disent « Deviens Marrant », avec le lien du site, pour que les graphies concordent. Aucun profil au nom d'Alex Durand (choix d'identité respecté) |

Non re-questionnés (choix documentés) : pas de mention d'IA, chiffres et études gardés, identité et photo du fondateur, 0,99 €/mois, compteurs 550+ / 350+.

## 4. Handoff

**Ordre d'exécution proposé (parallélisable)**
1. Thomas : vérifications §3.1 (Cloudflare, warm-up, consoles) et 16 prompts ; réponses Q1 à Q5.
2. @infrastructure : warm-up, décision file ISR, documenter les réglages Cloudflare dans le runbook (P0-1, P0-2).
3. @fullstack : `sameAs` en dur (après URLs), sitemap / llms en dynamique, suppression HowTo auto, ai-plugin.json, repli 503, courseSchedule, `priceValidUntil` (P0-2, P0-3, P1-3, P2-1 à P2-4, P2-6, P2-8).
4. @reviewer : diff réel des `updatedAt` du 29/09 (P1-7). @copywriter : P1-1, P1-4, P2-5 après GO.
5. @geo : baseline, `geo-monitoring-setup.md`, `entity-audit.md`, mise à jour de `geo-strategy.md` (P2-9, P2-10) dès réception des réponses aux prompts.
6. @growth / @social : plan off-site (P1-2) après Q3.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/geo/audit-post-bascule-s14.md` (audit uniquement, aucun fichier de code ni de contenu modifié).
- Décisions prises : score 63/100 sur la grille s11 (77/100 ramené aux 5 dimensions de mars, donc stable vs 78) ; accès bots Cloudflare = point à vérifier par Thomas (non lisible) ; Wikidata reporté (notabilité insuffisante) ; llms.txt conservé sans investissement supplémentaire ; claims scorés : l'étude « 8 semaines » < 2/3 en vérifiabilité, proposition à valider ; baseline des citations = [À MESURER] pour les 5 plateformes (aucun accès aux LLM).
- Points d'attention :
  - ne pas modifier les « En bref », « Définition » et FAQ des piliers sans vérifier la cohérence avec `llms-content.ts` et `a-propos/page.tsx` (l'étude est répétée dans 5 passages) ;
  - ne changer `updatedAt` / « Mis à jour le » que pour une modification réelle du texte ;
  - toute évolution de `robots.ts` doit être comparée à la version servie par Cloudflare (robots.txt géré) ;
  - monitoring hebdomadaire (5 prompts) et mensuel (16 prompts) dès que le baseline existe ; re-audit après les corrections P0.
- Déploiement : les modifications de code issues de cet audit sont à documenter dans `REPLIT_ACTIONS.md` (règle projet, historique Replit) ; la branche déployée sur Cloudflare est à confirmer avec Thomas avant toute correction.
- À reporter dans l'historique des interventions de `project-context.md` (fait par l'orchestrateur : cet audit n'a modifié aucun autre fichier).

## Sources (consultées le 30/09/2026)
- Cloudflare, nouvelles options de gestion du trafic IA : [changelog 01/07/2026](https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/), [blog Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/), [Help Net Security 02/07/2026](https://www.helpnetsecurity.com/2026/07/02/cloudflare-ai-crawler-controls/), [TechCrunch 01/07/2026](https://techcrunch.com/2026/07/01/cloudflares-new-policy-pushes-ai-companies-to-pay-for-publishers-content/)
- Cloudflare, [robots.txt géré](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) et [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/)
- Citations IA par source, 2026 (chiffres non repris, échantillons et dates non vérifiés) : [Otterly](https://otterly.ai/blog/the-ai-citations-report-2026/), [Semrush](https://www.semrush.com/blog/most-cited-domains-ai/), [5W Citation Source Index 2026](https://www.prnewswire.com/news-releases/5w-releases-ai-platform-citation-source-index-2026-the-50-websites-that-now-decide-what-brands-are-visible-inside-chatgpt-claude-perplexity-gemini-and-google-ai-overviews-302759804.html)
- llms.txt en 2026 : [Codersera, mai 2026](https://codersera.com/blog/llms-txt-complete-guide-2026/), [f9xr, 08/09/2026](http://f9xr.org/articles/2026/09/08/llms-txt-ai-txt-do-they-work-2026.html), [Passionfruit](https://www.getpassionfruit.com/blog/should-i-create-an-llms.txt-file-google-s-2026-guidance-explained)
- Étude 8 semaines : [Crawford et Caltabiano 2011, J. Positive Psychology 6(3)](https://www.tandfonline.com/doi/abs/10.1080/17439760.2011.577087)
- Présence de la marque : [BetaList](https://betalist.com/startups/deviens-marrant), requêtes cibles (WebSearch, résultats sur socialskills.fr, olivier-roland.com, atelier-theatre.fr, farce-et-attrape.fr, humorix.fr, compagnie-candela.com)
- Docs crawlers (vérifiées le 29/09, non refaites ce jour) : [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
