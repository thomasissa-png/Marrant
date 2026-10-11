# Pilier `/blog/comment-devenir-drole` non indexé : diagnostic et plan (s15, 05/10/2026)

Sources : `docs/analytics/snapshot-trafic-2026-10-05.md` §4-5, `apps/web/src/lib/blog-articles.ts`, `blog-clusters.ts`, `blog-related.ts`, `blog-article-page.ts`, `app/sitemap.ts`, `app/(dashboard)/page.tsx`, `blog/page.tsx`, `components/layout/footer.tsx`, `data/blog-article-rewrites.json`, `middleware.ts`. Priorité 3 de `docs/marrant/audit-note-s15.md` §4. Aucune donnée de volume de recherche disponible : GSC seule (48 imp / 90 j sur la requête cœur, position 33,2).

## 1. Constat chiffré

| | Pilier | `exercices-developper-humour` |
|---|---|---|
| Statut Google | Explorée, non indexée (dernier crawl 19/08, soit 47 j) | Indexée (23 clics / 499 imp, pos 20,5) |
| Taille (code) | 1 433 mots, 6 H2 (4 en question), 5 H3, 4 FAQ | 1 064 mots, 4 H2, 10 H3, 4 FAQ |
| `updatedAt` | 2026-09-29 (refonte s11) | 2026-09-29 |
| Liens internes sortants | 8 (4 articles, /parcours, /vannes, /conseils, /videos) | 6 (dont le pilier 1 fois, l.882) |
| Humoristes cités | 7 noms (Mirabel, Fary, Gardin, Frayssinet, Pascot, Waly Dia, Inès Reg) | 6 des mêmes 7 (tous sauf Inès Reg) |

Point clé : le crawl du 19/08 précède la refonte du 29/09. Google n'a **jamais vu la version actuelle** : le statut peut être périmé, mais il reflète aussi une décision de non-indexation sur l'ancienne version et un faible budget de crawl accordé à la page.

Écartés (preuves) : canonique OK, robots OK, récupération OK (inspection API) ; middleware 301 `www` vers apex (`middleware.ts` l.108) ; 4 anciens slugs redirigent vers le pilier (`seo-redirects.data.cjs` l.23-26) ; présent au sitemap (lastModified = `updatedAt`, stable). Cause technique exclue.

## 2. Liens internes vers le pilier (Grep `comment-devenir-drole` dans `apps/web/src`)

**Rendus au visiteur (HTML)**
- 13 occurrences dans 12 articles statiques visibles : timing-humour, erreurs-blagues, humour-quotidien-8-habitudes, exercices-developper-humour, meilleures-blagues-droles-2026 (l.1579), comment-faire-rire-une-fille, comment-faire-rire-un-homme, je-suis-pas-drole-comment-changer, timidite-et-humour (x2), storytelling-drole-5-structures (l.2694, seul cité par Google), confiance-humour-apres-rupture, pourquoi-blagues-marchent-pas. `blagues-courtes-vs-longues` (l.3597) est dans `UNPUBLISHED_STATIC_SLUGS` : non compté.
- 4 hubs : `/conseils` (l.143), `/vannes` (l.138), `/videos` (l.138), `/quiz-humour` (l.118).
- Navigation cluster (`blog-related.ts`) : carte « À lire ensuite » ou « Précédent » sur les satellites existants (4 sur 5 : `devenir-drole-30-jours` n'existe pas dans le code).
- `/blog` : 1 carte parmi la liste complète triée par date décroissante (`blog/page.tsx` l.104). Le pilier (2026-03-13) est dans les plus anciens. Rendue dans le HTML (fallback Suspense).
- 4 articles en base via `blog-article-rewrites.json` (avoir-confiance-en-soi..., citation-drole, etre-plus-a-l-aise-en-societe, jeu-de-mots-drole-techniques-creer) : [HYPOTHÈSE : réécritures appliquées en base et articles publiés, non vérifiable sans accès DB].

**Non rendus (données)** : `url` dans `vannes/page.tsx` l.96 et `videos/page.tsx` l.92 (objets titre/url, vraisemblablement JSON-LD, pas de lien crawlable) ; `blog-clusters.ts` (données, rendues seulement via la navigation) ; mentions de tests, `fixes.json`, `startup-tasks.ts`.

**Absents** : accueil (0 lien blog dans `page.tsx`, seulement 3 liens parcours), footer (`footer.tsx` l.9 : `/blog` seul), header (`/blog` seul). Aucun des articles les mieux indexés ne le cite : `comment-avoir-de-la-repartie` (2 369 imp), `5-types-humour-lequel-pour-toi` (3 190 imp), `phrases-droles-conversations` (2 935 imp), `autoderision-interactions` (1 865 imp) : vérifié dans le code, 0 lien chacun.
**Écart avec Google (1 page citante)** : le code en compte 12+. Les liens ne sont pas datables (historique git tronqué, `git blame` renvoie le commit frontière `316d04a` du 05/10). Hypothèses : liens récents non encore recrawlés, et/ou page citante non indexée donc ignorée. À vérifier (voir §6).

## 3. Causes classées

1. **Maillage faible en poids, pas en volume** (preuve forte) : 0 lien depuis l'accueil, le footer et les 4 articles les plus vus ; l'article n°1 (383 visites / 28 j, 92 % de rebond, 28 s) place son lien en toute dernière ligne, où il est peu vu ; 1 seule page citante côté Google ; dernier crawl il y a 47 j, alors que n°1 est exploré le 04/10. Profondeur de clic OK (accueil > Blog > pilier = 2 clics) : ce n'est pas le facteur.
2. **Version évaluée périmée** (preuve moyenne) : crawl 19/08 < refonte du 29/09. La demande d'indexation après déploiement est nécessaire mais ne suffira pas sans la cause 1.
3. **Qualité perçue / recouvrement avec `exercices-developper-humour`** (preuve moyenne) : même promesse (« devenir drôle »), même trame (observer, reformuler/exagérer, tester : plan en 4 étapes du pilier = exercices 1-5), mêmes humoristes, FAQ proches (« Comment devenir drôle rapidement ? » / « Quel est l'exercice le plus efficace pour devenir drôle ? »). L'article d'exercices, indexé, capte la requête (pos 54). Ce n'est pas encore une cannibalisation au sens strict (le pilier n'a aucune impression sous l'URL canonique) : c'est un risque dès l'indexation, à traiter en même temps.
4. **Réponse en tête peu actionnable** (preuve moyenne) : l'« En bref » dit *que* ça s'apprend (3 leviers, 8 semaines), pas *comment* ; le plan d'action arrive à mi-page. Incohérences internes : 3 leviers (En bref) / 5 piliers (H2) ; 8 semaines (En bref) / 30 jours (plan) / 2-4 semaines (FAQ). La SERP du moment (listes « 7 astuces », « 7 clés ») répond en tête avec des actions.
5. Autre : pas de signal first-hand propre au site (aucun chiffre ni cas du catalogue) ; page jamais citée par les 2 hubs les plus linkés (accueil, footer).

## 4. Correctifs (aucune URL changée, aucune suppression)

### 4.1 Liens à ajouter (@fullstack, texte d'ancre fourni, tutoiement)
| # | Fichier | Emplacement | Ancre |
|---|---|---|---|
| L1 | `components/layout/footer.tsx` | liste l.5-13, avant `/blog` | « Comment devenir drôle » (lien sitewide, signal le plus fort) |
| L2 | `app/(dashboard)/page.tsx` | sous les 3 cartes « Tu te reconnais ? » (avant `HomeCta`, l.148) : ligne « Tu veux d'abord comprendre le mécanisme ? Lis notre guide… » | « comment devenir drôle » |
| L3 | `app/(dashboard)/blog/page.tsx` | bloc « Commence ici » au-dessus de `BlogListClient` (l.118), carte vers le pilier | « Comment devenir drôle : le guide » |
| L4 | `blog-articles.ts`, `meilleures-blagues-droles-2026` | paragraphe d'intro (dans les 20 premières lignes), en plus du lien final l.1579 qui reste. À coordonner avec le CTA du haut (priorité 1 de l'audit) : un seul lien, pas de concurrence | « comment devenir drôle » |
| L5 | `blog-articles.ts`, `comment-avoir-de-la-repartie`, `5-types-humour-lequel-pour-toi`, `phrases-droles-conversations`, `autoderision-interactions` | 1 phrase contextuelle chacun, dans le corps (pas en fin) | « comment devenir drôle » (varier : « devenir plus drôle », « le guide pour devenir drôle ») |
| L6 | `blog-articles.ts`, pilier | liens sortants vers `exercices-developper-humour`, `humour-quotidien-8-habitudes`, `comment-avoir-de-la-repartie`, `pourquoi-blagues-marchent-pas`, `/quiz-humour` | « 10 exercices pour développer ton humour », etc. (liens bidirectionnels) |
| L7 | `blog-articles.ts`, pilier | `updatedAt` = date réelle de déploiement (alimente `Article.dateModified` et le `lastModified` du sitemap, stable et réel) | n/a |

Ne pas toucher à `blog-clusters.ts` (le slug absent `devenir-drole-30-jours` est filtré à l'affichage) ; signaler seulement.

### 4.2 Différenciation des deux articles (rôles, @copywriter)
- **Pilier = comprendre + cadre + plan 30 jours** : requêtes « comment devenir drôle », « comment être drôle », « … dans une conversation », « … quand on est timide ». Il cite l'article d'exercices pour le détail, il ne le refait pas.
- **Exercices = s'entraîner** : requêtes « exercices humour », « développer son humour », « s'entraîner à être drôle ». Il renvoie vers le pilier pour le cadre.
- Les humoristes nommés et cités restent partout (P0 s15). Les exercices, FAQ et stats (Crawford et Caltabiano) restent : on reformule et on réordonne, on ne supprime rien.

### 4.3 À réécrire (signalement pour @copywriter, texte non écrit ici)
Pilier : (a) tête de page : réponse directe actionnable en 3 gestes avant le « pourquoi » (observer chaque jour, tester sur un proche, répéter 30 jours), cohérente avec le plan ; (b) aligner les chiffres (3 leviers / 5 piliers ; 8 semaines / 30 jours / 2-4 semaines) sans retirer la citation scientifique, en précisant ce que mesure l'étude (bien-être) ; (c) le plan en 4 étapes : garder, resserrer et renvoyer vers l'article d'exercices pour le détail ; (d) titre : garder « Comment devenir drôle » en tête, ajouter un différenciant (piste : « Comment devenir drôle : 5 piliers et un plan sur 30 jours ») ; (e) un élément first-hand propre au site : chiffres du catalogue de `project-context.md` (290+ vannes, 60+ conseils, 80+ vidéos : [HYPOTHÈSE : à recompter avant publication]).
Exercices : (a) intro l.867 et titre/excerpt recentrés sur « s'entraîner / exercices » (aujourd'hui « devenir plus drôle ») ; (b) FAQ 2 reformulée sur l'entraînement ; (c) lien pilier en haut de page, pas seulement l.882.
Protocole P0 s11 : mesurer le diff réel (taux de changement, intouchables : slugs, H2, FAQ, liens, chiffres, prix) avant de valider le rapport.

### 4.4 Action manuelle de Thomas (APRÈS déploiement uniquement)
Search Console > Inspection d'URL > `https://deviens-marrant.fr/blog/comment-devenir-drole` (version apex, pas `www`) > « Tester l'URL en direct » > « Demander une indexation ». Idem pour `/blog/exercices-developper-humour` (version modifiée). Une demande par URL, pas de répétition. @fullstack soumet en parallèle ces 2 URL, `/blog` et `/` à IndexNow (signal Bing, route `weekly-seo` déjà branchée).

## 5. Mesure de succès
- **J+7** : `lastCrawlTime` du pilier postérieur au déploiement (inspection API) ; idem pour les 12 articles citants et l'accueil.
- **J+14 : statut « Envoyée et indexée »** (inspection API). Si non : cause 3 à traiter plus fort (fusion éditoriale des contenus communs, sans changer d'URL) et vérifier les dates d'exploration des pages citantes.
- **J+45 : position < 20 sur « comment devenir drôle »** (baseline : 33,2 ; objectif complémentaire : au moins une impression sous l'URL canonique, aujourd'hui 0). `exercices-developper-humour` ne doit plus apparaître sur cette requête.
- Suivi : requête cœur, « comment être drôle » (44,4), « comment être drôle dans une conversation » (43), via @data-analyst.

## 6. Vérification préalable à lancer (avant ou pendant le déploiement)
Inspection API des 12 articles citants (date d'exploration, statut) : si aucun n'est exploré depuis l'ajout des liens, l'écart « 1 page citante » s'explique par le délai de crawl, et L1-L3 (pages à crawl fréquent : accueil, /blog, footer) deviennent prioritaires.

## Handoff → @fullstack puis @copywriter
- **Fichier produit** : `/home/user/Marrant/docs/seo/pilier-non-indexe-s15.md`.
- **Décisions** : cause n°1 = poids du maillage (accueil, footer, articles à fortes impressions) et version évaluée périmée ; pas de cause technique ; deux rôles distincts (pilier = comprendre et plan, exercices = s'entraîner) ; aucune URL changée, rien supprimé, humoristes conservés.
- **Pour @fullstack** : L1 à L7 (§4.1), `updatedAt` réel du pilier, IndexNow ; documenter dans `REPLIT_ACTIONS.md` ; pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`. Coordonner L4 avec le chantier CTA de l'article n°1.
- **Pour @copywriter** : §4.3, calibrer 3-5 étalons avec Thomas avant brief (P0 s8), zéro tiret cadratin, tutoiement, mesure du diff réel (P0 s11).
- **Points d'attention** : les 4 articles en base (rewrites) non vérifiables sans DB ; liens non datables (git tronqué) ; GSC annonce 1 page citante contre 12+ dans le code (§6) ; le pilier et `exercices-developper-humour` sont à traiter dans le même déploiement (double optimisation SEO/GEO : le pilier est la cible des citations IA, à valider avec @geo avant réécriture de la tête de page).
