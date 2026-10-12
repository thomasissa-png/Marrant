# Diagnostic : contenu des articles en base contre le JSON de la refonte s11 (s20)

> @fullstack, 12/10/2026. **Lecture seule** : base Neon de prod (API SQL HTTPS en transaction `read-only`, SELECT uniquement), base Replit d'origine (même méthode, comparaison), HTML servi (`curl` des 36 URL `/blog/` du sitemap, toutes en 200), historique git complet (`git fetch --unshallow`, local). Simulations du code (`stripEmDashesWithStats`, ancres S4) sur les copies exportées, sans aucune écriture. Aucune écriture en base, aucun déploiement, aucun code modifié, pas de commit.
> Mesure des mots : découpage en mots (lettres et chiffres), différence = 1 − (mots communs dans l'ordre, plus longue sous-suite commune) / moyenne des deux longueurs.

## 0. Résumé

- **Étendue** : les **9 articles du JSON s11 sont tous servis dans leur version d'AVANT la refonte** (contenu généré par l'IA entre mars et juin, en ligne sur Replit). Écart avec le JSON : **29 à 52 % des mots**. La version JSON v2 n'a **jamais été servie au public** : elle n'a existé en base que ~12 h, la nuit du 29 au 30/09, quand seul le Worker de test (noindex) lisait cette base.
- **Cause prouvée** : la copie finale Replit → Neon de la bascule (30/09, `scripts/infra/copie-replit-neon.py --reset`) a vidé et recopié **uniquement les tables présentes à la source**. `BlogArticle` a été remis à son état Replit ; `DataPatch` (absente de Replit) n'a pas été vidée. Les marqueurs `blog-rewrite:v2:*` et `blog-em-dash:v1:*` du 29/09 sont restés, donc les tâches de démarrage du 30/09 ont sauté ces articles. Aucun cron, agent IA ni relecture automatique n'a réécrit ces textes.
- **Tirets cadratins** : 88 « — » (U+2014 littéral, ni entité ni variante) dans le corps de 6 articles en base. La tâche anti-tirets les voit tous ; elle ne les traite pas parce que leurs marqueurs v1 existent. Côté statique : 50 « — », tous dans des titres H2/H3, exclus volontairement par la règle de la tâche (titres intouchables).
- **Même cause, autre périmètre** : le marqueur `catalogue-content:v1` (refonte s11 des vannes, conseils, vidéos et parcours) a subi le même sort (§2.4).

## 1. Étendue

### 1.1 Les 9 articles du JSON s11 (tous publiés, tous servis depuis la base)

« HTML ≈ base » : le texte de `<article>` du HTML servi diffère de 4,7 à 6,5 % du contenu en base (titre, méta, CTA, encadrés, liens « à lire aussi ») et de **33 à 55 %** du JSON. Méta-description servie = celle de la base dans les 9 cas.

| Article | Servi | Mots base / JSON | Diff. base ↔ JSON | Base ↔ Replit d'avant bascule | `updatedAt` base | « — » servis (corps) | « — » dans le JSON |
|---|---|---|---|---|---|---|---|
| `avoir-confiance-en-soi-grace-a-l-humour` | base | 1 512 / 1 734 | 36,6 % | 0,2 % | 30/09 08:36 | 15 | 8 |
| `blague-courte-arme-secrete-humour` | base | 1 805 / 2 098 | 52,2 % | 0,8 % | 30/09 08:35 | 17 | 16 |
| `blague-drole-7-criteres-pepite` | base | 1 795 / 2 098 | 34,0 % | 0,2 % | 30/09 08:36 | 0 | 0 |
| `citation-drole` | base | 1 901 / 1 992 | 28,6 % | 0,8 % | 30/09 08:36 | 0 | 0 |
| `comment-improviser-des-blagues` | base | 1 949 / 2 082 | 32,6 % | 0,0 % | 30/03 00:25 | 4 | 2 |
| `comment-raconter-une-blague-sans-la-rater` | base | 1 843 / 2 149 | 42,5 % | 0,5 % | 03/10 15:28 | 12 | 5 |
| `etre-plus-a-l-aise-en-societe` | base | 2 108 / 2 242 | 31,7 % | 0,0 % | 06/04 00:10 | 0 | 0 |
| `jeu-de-mots-drole-techniques-creer` | base | 1 819 / 2 342 | 46,6 % | 0,0 % | 09/06 00:40 | 26 | 24 |
| `techniques-humoristes-pros` | base | 1 694 / 1 778 | 37,8 % | 0,2 % | 30/09 08:36 | 14 | 4 |
| **Total** | | | | | | **88** | **59** |

- Lecture : la base actuelle **est** la version Replit d'avant s11 (0 à 0,8 % d'écart), pas une version plus récente. Les petits écarts sont listés au §3.2.
- Titre et `metaTitle` : identiques (le JSON ne les fournit pas). `excerpt` et `metaDescription` : ceux du JSON ne sont pas en ligne non plus.
- Les 4 articles cités au §8 de `liens-s4-s20.md` ne sont pas une exception : les 9 sont concernés.

### 1.2 Autres articles en base publiés (hors JSON)

| Article | Origine | « — » servis |
|---|---|---|
| `blagues-halloween-soiree-deguisee` | pipeline s14, publié le 05/10 | 0 |
| `se-presenter-avec-humour` | pipeline s14, publié le 12/10 | 0 |

Les 3 articles en base dépubliés (cannibalisation s11 : `ne-plus-rester-muet-en-groupe`, `je-ne-sais-jamais-quoi-repondre`, `apprendre-la-repartie-methode-30-jours`) gardent 30 « — », non servis. Les 22 articles programmés (non publiés) : 0 « — ».

### 1.3 Articles statiques (`blog-articles.ts`)

25 articles statiques servis (aucun slug en base ne les masque), 5 hors sitemap (redirigés ou dépubliés). Le HTML servi correspond au fichier. « — » servis : **50, tous dans des titres H2/H3** (« ## Type 1 : L'observationnel — … »), 0 dans le corps.

| Article | « — » (titres) | Article | « — » (titres) |
|---|---|---|---|
| `repondre-moqueries-avec-humour` | 6 | `timidite-et-humour` | 4 |
| `comment-devenir-drole` (pilier) | 5 | `blagues-travail-faire-rire-pro` | 4 |
| `5-types-humour-lequel-pour-toi` | 5 | `rester-muet-en-groupe` | 3 |
| `conversation-machine-a-cafe` | 5 | `repartie-debutant-5-etapes` | 2 |
| `jamais-quoi-repondre-techniques` | 5 | `repartie-soiree-anti-malaise` | 2 |
| `comment-faire-rire-un-homme` | 4 | `pourquoi-blagues-marchent-pas` | 1 |
| `comment-faire-rire-une-fille` | 4 | 12 autres statiques servis | 0 |

Ces titres ne sont pas un raté : la passe manuelle s12 et `stripEmDashes` excluent les lignes `#` (« intouchables SEO »). Les retirer serait une décision distincte (H2 = intouchables P0 s11), hors de ce diagnostic.

### 1.4 Hypothèse « variantes invisibles » : écartée

Dans le HTML servi : 0 entité (`&mdash;`, `&#8212;`, `&#x2014;`), 0 variante (U+2012, U+2013, U+2015, U+2E3A, U+2212). En base, 100 % des tirets sont des U+2014 littéraux, tous hors titres. Simulation de `stripEmDashesWithStats` sur le contenu en base : **88 retirés sur 88, 0 mot modifié** dans les 6 articles.

## 2. Cause et chronologie

### 2.1 Chronologie (heures UTC, sources entre parenthèses)

| Date | Événement | Preuve |
|---|---|---|
| 16/03 → 09/06 | Les 9 articles sont créés en base Replit par l'agent SEO (`generatedByAI = true`) et servis par Replit. | `createdAt`, base Replit |
| 29/09 11:16 | JSON v1 (`af3df93f`, « réécriture complète », passe 1). | git |
| 29/09 14:06 | **JSON v2** (`f7e80c39`, « réécriture réelle des 9 articles »). | git |
| 29/09 (s12) | Première copie Replit → Neon Francfort ; `DataPatch` est vide (table absente de Replit). | `migration-etat-s12.md` §7 |
| 29/09 20:26:41-48 | Worker de test (noindex, `workers.dev`) : tâches de démarrage sur Neon. `catalogue-content:v1`, puis les 9 `blog-rewrite:v2` : **JSON v2 écrit en base**. | `DataPatch.appliedAt` |
| 29/09 20:26:50-52 | `blog-em-dash:v1` sur 6 articles. La note `before` de chaque marqueur est **identique au JSON v2 (0,0 % d'écart)** : preuve que le JSON était bien en base. | `DataPatch.note` |
| 30/09 matin (s14) | Bascule : `copie-replit-neon.py --reset` (43 335 lignes, `--verify` 35/35). **`BlogArticle` remplacé par le contenu Replit**, `updatedAt` d'origine compris (`comment-improviser-des-blagues` porte encore 30/03). `DataPatch` intacte. | `passation-s14.md` §4, script l.41 et l.79, `updatedAt` |
| 30/09 08:35:38-08:36:54 | `startup-tasks` sur la prod (85 s) : corrections s11 (`blog-article-fixes.json`, sans marqueur, donc rejouées), 3 dépublications, liens vers slugs redirigés réécrits ; **`blog-rewrite:v2` sautés (9 marqueurs présents)** ; `blog-em-dash` sautés pour 6, appliqué à `citation-drole` seul (3 « — » dans le texte Replit, aucun marqueur). | `updatedAt`, `DataPatch` |
| 01/10 et 03/10 15:28 | Prix corrigé à la main en base dans `comment-raconter-une-blague-sans-la-rater` par les sessions s14 (0,99 → 4,99 → 2,99 €), sauvegarde de l'avant dans `docs/copy/audit-vannes-s14/sauvegarde-article-prix.json` (`87be8c9d`). Le JSON est corrigé en parallèle (`a9221b36`, `df431b4f`) sans que personne ne voie l'écart. | git, `updatedAt` |
| 12/10 | S4 : ancres « avant » absentes de la base, tâche non branchée (`255bbc62`). | `liens-s4-s20.md` §8 |

### 2.2 Le mécanisme

- `copie-replit-neon.py` lit la liste des tables **dans le schéma source** (l.41) et ne vide que celles-là (`truncate … cascade`, l.79). Replit n'a pas de table `DataPatch` : elle n'a pas été vidée. Le premier marqueur en base date toujours du 29/09 20:26:41 (55 marqueurs, aucun effacé).
- `passation-s13.md` l.59 avait prévu l'inverse : « À la bascule, la copie `--reset` efface ces marqueurs : relancer `/api/cron/startup-tasks` juste après ». Le relancement a eu lieu, mais les marqueurs étaient toujours là.
- `--verify` compare les 35 tables source à la cible : il ne peut pas voir une table qui n'existe que dans la cible. Le contrôle « 35/35 » était donc vert.
- `applyBlogArticleRewritesTask` et `stripBlogEmDashesTask` se fient au marqueur seul, jamais au contenu : un marqueur présent sur un texte revenu en arrière suffit à les bloquer pour toujours.

### 2.3 Hypothèses du brief

| Hypothèse | Verdict | Preuve |
|---|---|---|
| Marqueur posé sans appliquer | **Écartée** | Note `before` du marqueur anti-tirets = JSON v2 au mot près, 2 s après. Transaction unique (`update` + `create`) dans le code. |
| Application puis écrasement par un cron ou un agent | **Écartée pour les crons/agents, confirmée pour l'écrasement** | Écrasement par la copie de bascule. Seuls écrivains de `content` dans le code : tâches de démarrage, `blog-liens-s4-s20` (non branchée), route admin manuelle `fix-persona-leak` (personas, pas ces textes) ; l'agent SEO ne fait que créer ; la publication programmée ne touche que `isPublished`. Aucune `updatedAt` des 9 après le 03/10. |
| Tâche anti-tirets aveugle à des variantes | **Écartée** | §1.4 : 88/88 vus et retirés en simulation. |
| Tâches de démarrage non déclenchées (mémo s18) | **Écartée ici** | Elles ont tourné le 30/09 08:35, puis les 07/10, 08/10 et 11/10 (marqueurs `parcours-*` créés ces jours-là) ; elles sautent à cause des marqueurs. Le défaut s18 (pas de déclenchement automatique au déploiement) reste vrai mais n'explique pas cet écart. |

### 2.4 Même cause hors blog (à traiter à part)

`catalogue-content:v1` (29/09 20:26:41) est dans le même cas. Mesure en base : sur 249 vannes du `blagues-seed.json` qui ont un `previousContent`, **190 portent encore l'ancien texte**, 13 seulement le nouveau ; parmi les vannes actives non IA (131), 6 ont l'ancien texte, 1 le nouveau (les autres ont été désactivées ou remplacées depuis par les audits s14-s19, ce qui limite l'impact visible). Conseils : 69/69 titres du seed présents, mais le seed a été « aligné sur la base » en s17, donc ce n'est pas une preuve que la refonte s11 des conseils est en ligne. Vidéos et parcours : réécrits depuis par les tâches s17-s19. Recoupe le constat s17 « le catalogue en base ne correspond plus à `blagues-seed.json` : 7/127 ». Diagnostic séparé recommandé avant toute décision.

## 3. Quel texte est le bon : les faits

Aucun verdict de qualité ici (règle d'or P0 s18 : décision de Thomas + relecture à l'aveugle).

### 3.1 Origine et statut des deux versions

| | Version en base (servie) | JSON s11 v2 (`blog-article-rewrites.json`) |
|---|---|---|
| Origine | Agent SEO, mars à juin 2026 (`generatedByAI = true`), corrections s11 du 29/09 rejouées le 30/09, prix corrigé à la main (01/10, 03/10) | @copywriter s11, 29/09 14:06 (`f7e80c39`), puis prix (`a9221b36`, `df431b4f`), étude M3 (`eb7fa207`), phrases S4 (`255bbc62`) |
| En ligne | Depuis la création, sans interruption pour le public | **Jamais pour le public** (~12 h sur la base lue par le Worker de test noindex, 29/09 20:26 → 30/09 matin) |
| Relecture | Aucune relecture à l'aveugle connue | Passes s11 (rapports `docs/copy/rewrites-db-s11/`) ; **pas** de relecture à l'aveugle au sens P0 s18 (règle postérieure) ; seules les 5 phrases S4 ont été relues à l'aveugle (12/10) |
| « — » | 88 dans le corps | 59 (retirés en base le 29/09 par la tâche, jamais dans le fichier) |

### 3.2 Ce que la base a reçu après le 30/09 (tout est déjà couvert par le JSON)

| Article | Changement base (Replit → actuel) | Dans le JSON ? |
|---|---|---|
| `avoir-confiance…` | « Plot twist » → « Et voilà le truc » ; lien `timing-humour-ralentir` → `timing-humour` | Formule absente du JSON ; liens du JSON déjà sur les bons slugs |
| `blague-courte…` | Vanne « ChatGPT … mes photos » remplacée (correction s11) | Absente du JSON |
| `blague-drole-7-criteres…` | « BOOM. » → « Efficace. » ; lien redirigé corrigé | Idem |
| `citation-drole` | « Comme le dit Fary : » retiré, mention « sans paternité clairement établie » ; 3 « — » retirés | Attribution absente du JSON |
| `comment-raconter…` | Lien redirigé corrigé ; CTA « 0,99 EUR/mois — le prix d'un café… » → « **2,99 € par mois**, sans engagement. » | JSON : « **2,99 EUR/mois** : beaucoup moins cher que le silence après une blague massacrée » (prix juste, formulation différente) |
| `techniques-humoristes-pros` | 2 liens redirigés corrigés | Liens du JSON déjà sur les bons slugs |

Contrôles : liens de la base **tous présents** dans le JSON (0 lien propre à la base) ; aucune chaîne cherchée par `blog-article-fixes.json` n'existe dans le JSON (rien à perdre) ; H2/H3 de la base : 21 % de titres différents au plus (confiance 19/24 communs, courte 9/10, raconter 7/8, aise 19/22, les 5 autres identiques).

### 3.3 Ce que le JSON contient et qui n'est pas en ligne

- **Tout le texte réécrit** (29 à 52 % des mots), plus `excerpt` et `metaDescription` des 9 articles.
- **Les 5 phrases S4 validées pour la base** (2, 8, 10, 11, 12), reportées dans le JSON le 12/10, aucune en ligne : liens vers `conversation-machine-a-cafe`, `storytelling-drole-5-structures` (×2), `techniques-humoristes-pros`, `citation-drole`.
- Chiffres propres au JSON : « 40 » citations (phrase S4 10), 14, 15, 22, 8 dans `avoir-confiance…` ; la base a « 8 » et « 9 » propres dans `jeu-de-mots…`. Stat « Stanford 40 % » présente dans les deux (restaurée en s11, `04e03965`).
- Liens L1-L7 du pilier (s15) : **aucun ne concerne ces 9 articles** (pied de page, accueil, `/blog`, articles statiques et pilier). Lien vers le pilier présent à l'identique dans les deux versions pour 4 articles (`avoir-confiance`, `citation-drole`, `etre-plus-a-l-aise`, `jeu-de-mots`).

### 3.4 Humoristes (P0 s15 : nommés et cités autorisés ; citation douteuse = vérifier)

- Base : 7 à 10 humoristes nommés par article, avec des citations attribuées **non sourcées** écrites par l'agent IA, par ex. `jeu-de-mots…` « cette vanne de **Paul Mirabel** » (chauve / cheveux sur la langue), « **Waly Dia** excelle : … no Gaïn … » ; `blague-courte…` « Paul Mirabel l'a dit dans son dernier spectacle : "Une bonne blague, c'est comme un bon café…" ». `[À VÉRIFIER]` avant toute décision, pas à retirer d'office.
- JSON : moins de noms dans 6 articles (ex. `jeu-de-mots…` : Fary, Frayssinet, Norm ; `blague-courte…` : Fary, Frayssinet, Inès Reg, Mirabel). Écrit le 29/09, avant la règle « zéro humoriste » du 30/09 puis son annulation (P0 05/10) : les retraits du JSON ne découlent pas de cette règle, ils datent de la passe s11 du 29/09 (motif par article dans `docs/copy/rewrites-db-s11/`, non relu ici).

## 4. Options (rien appliqué)

Point commun à toutes les options : il faut **bumper `BLOG_EM_DASH_PATCH_VERSION` (1 → 2)**, sinon les 6 marqueurs v1 bloquent à nouveau la tâche. Toute option = code + déploiement + appel manuel de `/api/cron/startup-tasks` (pas de déclenchement automatique, mémo s18), entrée `REPLIT_ACTIONS.md`, pre-commit complet.

| | (a) Appliquer le JSON s11 | (b) Garder la base, retirer les tirets | (c) Arbitrage article par article |
|---|---|---|---|
| Geste technique | `_meta.version` 2 → 3 (les 9 réécrits, marqueurs `blog-rewrite:v3`) + tirets v2 | Tirets v2 seulement | Version JSON pour les articles retenus (marqueur par slug ; la tâche actuelle réécrit tout le fichier, donc filtre à ajouter), tirets v2 pour tous |
| Mots changés en ligne | 29 à 52 % par article, `excerpt` et `metaDescription` des 9 | 0 mot ; 88 « — » → 24 virgules, 60 deux-points, 4 points (simulation) | Selon le choix |
| « — » restants | 0 (les 59 du JSON passent par la tâche v2) | 0 | 0 |
| Perte d'ajouts postérieurs | **Aucune mesurée** (§3.2 : liens, prix, corrections déjà couverts ou sans objet). Seule différence : CTA de prix de `comment-raconter…` (formulation JSON au lieu de « sans engagement ») | Sans objet | Idem (a) sur les articles retenus |
| Phrases S4 (2, 8, 10, 11, 12) | **Les 5 en ligne d'office** (déjà dans le JSON, relues à l'aveugle) ; brancher la tâche S4 est alors inutile | **4 à ré-ancrer** (2, 8, 10, 11 : 0 occurrence en base) par @copywriter sur le texte en base, puis relecture à l'aveugle (contexte changé) ; la 12 a son ancre (1 occurrence) mais le tout-ou-rien de `comment-improviser…` la bloque avec la 2 | En ligne pour les articles où le JSON l'emporte ; ré-ancrage pour les autres |
| Règle d'or P0 s18 | Le JSON n'a jamais été en ligne ni relu à l'aveugle au sens s18 : **relecture à l'aveugle des 9 avant application** (base contre JSON) | Contenu IA de mars-juin gardé tel quel, jamais relu à l'aveugle ; citations d'humoristes `[À VÉRIFIER]` (§3.4) | Relecture à l'aveugle base contre JSON, article par article : c'est elle qui décide |
| Risque SEO | 9 pages indexées réécrites à 30-50 % d'un coup (dont metas) ; `updatedAt` et lastmod bougent | Nul (ponctuation) | Étalé, mesurable article par article |
| Dette restante | Aucune (base = JSON) | **Piège** : le JSON reste divergent ; un futur bump de `_meta.version` écraserait la base. À neutraliser (aligner le JSON sur la base ou retirer les 9 entrées) | Aligner le JSON sur ce qui est en ligne pour les articles non retenus |

**Recommandation (faits, pas qualité)** : **(c), avec (b) tout de suite** : tirets v2 maintenant (0 mot changé, règle n°12 tenue, réversible par la note `before`), puis relecture à l'aveugle base contre JSON des 9 articles et décision de Thomas article par article. Les phrases S4 suivent la version retenue. Dans tous les cas, neutraliser le JSON pour les articles où la base est gardée.

### À corriger quelle que soit l'option (pour @infrastructure / @fullstack)

1. `copie-replit-neon.py --reset` ne vide pas les tables propres à la cible : risque si la copie est rejouée (Replit en pause, mais le retour arrière documenté la réutilise). Le contrôle `--verify` ne voit pas ces tables.
2. Les tâches à marqueur ne vérifient jamais le contenu : un contrôle « contenu = attendu » en lecture seule (par ex. au rapport du lundi ou dans `/api/health`) aurait détecté l'écart le 30/09.
3. Diagnostic séparé de `catalogue-content:v1` (§2.4) avant toute décision sur les vannes.

## 5. Correctif du script, 12/10

> @infrastructure, 12/10/2026. Point 1 ci-dessus traité. Script jamais lancé contre Replit ni Neon : tests sur un Postgres 16 local jetable. Pas de commit.

Fichiers : `scripts/infra/copie-replit-neon.py` (corrigé), `scripts/infra/test_copie_replit_neon.py` (nouveau), `docs/infra/bascule-checklist.md` §1 (encadré « leçon du 30/09 » + commandes).

| | Avant | Après |
|---|---|---|
| `--reset`, cible avec une table non vide absente de la source (`DataPatch`, `NewsletterSubscriber`) | Table ignorée, copie faite : état incohérent (incident du 30/09) | **Refus, code 2, aucune écriture**, liste des tables avec leur nombre de lignes, tables d'état signalées |
| Choix explicite | Aucun | `--purge-target-only-tables` (les vide dans le même `TRUNCATE`, puis rappel d'appeler `/api/cron/startup-tasks`) ; `--keep-target-only-tables=A,B` pour une table de données. Garder `DataPatch`, `JobLock`, `SocialPostDailyLock` ou `CeoDedup` = refus ; garder une table que le `TRUNCATE CASCADE` viderait quand même = refus |
| Copie sans `--reset` | Même angle mort | Même contrôle (le contenu copié et les marqueurs divergeraient aussi) |
| `--verify` | 35 tables de la source : nombre de lignes + md5 global | En plus : toute table « cible seulement » non vide = écart (code 1) ; colonnes propres à la cible listées (non comparées) ; `BlogArticle`, `Joke`, `Tip` : hash ligne à ligne d'un échantillon (50 clés tirées de chaque côté, réparties par md5), identifiants des lignes divergentes affichés |
| `--dry-run` | N'existait pas | Plan complet (tables vidées, gardées, copiées, comptes source/cible), lecture seule des deux bases |
| Source | Lecture seule par convention | Garde-fou : toute requête non `SELECT` vers la source est refusée |

Vérification (`python3 -m unittest scripts/infra/test_copie_replit_neon.py -v`, 10/10 OK) : seul le transport HTTPS Neon est remplacé par `psql` local, le SQL du script tourne tel quel. Le jeu de données reproduit la veille de la bascule (`BlogArticle` = JSON v2 en cible, 2 marqueurs `DataPatch`, 1 abonné newsletter). Tests clés :
- refus par défaut de `--reset` : code 2, cible identique avant/après ; message listant `DataPatch : 2 lignes [ÉTAT …]` ;
- `--reset --purge-target-only-tables --dry-run` : plan affiché, aucune écriture ;
- reproduction de l'ancien `--reset` (tables source seules vidées) : `--verify` affiche toujours « 4/4 » sur les tables source, comme le « 35/35 » du 30/09, mais renvoie maintenant **code 1** avec `ÉCART DataPatch` ;
- un article modifié sans changer le nombre de lignes : `ÉCART contenu BlogArticle : 1/2 lignes différentes, ex. ['b2']`.

Note : l'ancien `--verify` hachait déjà le contenu des tables source (md5 global) ; son seul angle mort était les tables propres à la cible. L'échantillon ligne à ligne sert surtout à dire **quelles** lignes divergent.

Risque restant, hors script : depuis le 30/09 la prod est sur Neon. Rejouer `--reset` depuis Replit (retour arrière) effacerait tout ce qui a été écrit depuis (comptes, abonnements, articles du pipeline). Le refus par défaut le signalera (marqueurs `DataPatch` v2 à v4 présents), mais la décision reste à Thomas.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/qa/diagnostic-base-vs-s11-s20.md`. Aucun code, aucune base, aucun déploiement touchés ; pas de commit. Historique git local complété (`git fetch --unshallow`).
- Cause prouvée : copie de bascule du 30/09 (table `DataPatch` non vidée, `BlogArticle` remis à l'état Replit), pas un cron ni un agent.
- Points d'attention : décision de Thomas sur (a)/(b)/(c) ; périmètre catalogue (§2.4) ; titres H2 statiques avec « — » (50) = décision distincte.
- Actions infra requises : aucune pour ce diagnostic. Pour l'option retenue : bump `BLOG_EM_DASH_PATCH_VERSION`, déploiement, appel `/api/cron/startup-tasks`.
- Pre-commit check : sans objet (aucun code modifié).
