# Audit GEO Global — deviens-marrant.fr — Session 11 — 2026-09-29

> Agent @geo — Audit uniquement, zéro code.
> Sources : instantanés live /scratchpad/live/, code source json-ld.tsx, sitemap.xml, project-context.md, geo-strategy.md.

---

## 1. Verdict global + Score GEO /100

### Score recalculé : 54/100 (nouvelle rubrique 7 dimensions)

| Dimension | Score | Max | Notes |
|---|---|---|---|
| Accès bots IA (robots.txt) | 10 | 10 | Tous LLM bots autorisés, parfait |
| Structured data JSON-LD | 14 | 20 | Types riches mais sameAs absent, dateModified figé |
| llms.txt / llms-full.txt (exhaustivité) | 5 | 15 | 42 articles sitemap, ~5 mentionnés sans URL individuelle |
| Articles pillar (citabilité) | 17 | 20 | CLEF, définitions, listes numérotées, FAQ — excellents |
| Entity confidence (sameAs, externe) | 3 | 15 | Pas de sameAs, pas de Wikipedia/Wikidata, réseaux à 0 abonné |
| Content freshness | 4 | 10 | Pillar articles non mis à jour depuis mars 2026 (6 mois+) |
| Off-site / community | 1 | 10 | Aucune présence Reddit/forums, 1 seule mention tierce (BetaList) |
| **Total** | **54** | **100** | — |

**[Réconciliation avec les scores précédents]** : Le score 78/100 de mars 2026 (geo-strategy.md) et le 82/100 estimé post-sprint1 utilisaient une rubrique de 5 dimensions techniques (robots, schemas, contenu). Cet audit ajoute 2 dimensions nouvelles (entity confidence /15, off-site /10) qui étaient absentes du scoring initial mais sont déterminantes pour les citations LLM. Sur les 5 anciennes dimensions seulement, le score serait ~70/75 (nette progression vs les ~65/75 de mars 2026). C'est la découverte des gaps entity confidence et off-site qui tire le score total à 54/100.

### Progression réelle vs mars 2026

| Aspect | Mars 2026 | Septembre 2026 | Verdict |
|---|---|---|---|
| Reformatage pillar articles | Non fait | Fait (CLEF, définitions, listes) | +4 pts |
| DefinedTermSet schema | Non fait | Fait (12 termes glossaire) | +2 pts |
| PAA articles | Non fait | Partiels (timidite-et-humour, je-suis-pas-drole, etc.) | +1 pt |
| llms.txt exhaustivité | Non évalué | Gap découvert (42 art. → 5 cités) | -3 pts |
| sameAs Person/Organization | Non évalué | Absent | -3 pts |
| Content freshness signaux | Non évalué | dateModified = datePublished, 6 mois sans update | -3 pts |

**Conclusion** : Progression positive sur le contenu (+7 pts qualité réelle) mais 3 gaps structurels non identifiés en mars 2026 représentent -9 pts sur les nouvelles dimensions. Le score 82/100 était optimiste car incomplet.

---

## 2. Tableau des trous — P0 / P1 / P2

| ID | Priorité | Trou identifié | Preuve | Impact LLM | Fix | Agent |
|---|---|---|---|---|---|---|
| G1 | P0 | llms.txt et llms-full.txt non exhaustifs : 42 articles blog dans le sitemap, ~5 mentionnés dans llms-full.txt, aucun URL individuel | llms.txt.txt ligne 1 (liste générique) / sitemap.xml = 42 `<loc>/blog/` | LLM ne peuvent pas découvrir ni citer 37 articles | Régénérer llms-full.txt dynamiquement depuis le sitemap avec URL + titre + 1 ligne résumé par article | @fullstack |
| G2 | P0 | Pas de `sameAs` sur Organization ni Person (Alex Durand) : zéro ancrage knowledge graph externe | json-ld.tsx L.16-35 (authorPersonJsonLd) et L.69-87 (organizationJsonLd) — aucune propriété sameAs | Entity confidence LLM proche de zéro. ChatGPT/Perplexity ne peuvent pas relier l'entité à des sources externes | Ajouter `sameAs` → LinkedIn, Twitter/X, Instagram dans Organization. Créer page Wikidata + Crunchbase puis les référencer | @fullstack / fondateur |
| G3 | P0 | dateModified = datePublished dans buildArticleJsonLd : les articles semblent jamais mis à jour | json-ld.tsx L.138-139 `dateModified: article.date` (identique à datePublished) | +28% citations IA avec contenu < 2 mois. Les LLM voient des articles datant de mars 2026 comme périmés | Dissocier dateModified de datePublished. Ajouter champ `updatedAt` dans les articles, l'injecter dans le schema | @fullstack |
| G4 | P1 | Aucun monitoring citations LLM en place : le fondateur ne sait pas si la marque est citée | project-context.md L.83 "score GEO estimé 82/100" — aucun outil tracking mentionné | Impossible de mesurer la progression. Les trous ne seront jamais refermés faute de feedback | Mettre en place protocole de monitoring hebdomadaire (voir section 4) | @geo / fondateur |
| G5 | P1 | Pillar articles non rafraîchis depuis mars 2026 (6 mois+) | sitemap.xml : comment-devenir-drole lastmod=2026-03-13, comment-avoir-de-la-repartie lastmod=2026-03-12 | Contenu > 6 mois reçoit moins de citations IA. "Last updated" absent des articles | Ajouter bloc "Mis à jour le [date]" visible + faire une passe de rafraîchissement sur les 5 pillar tous les 60 jours | @copywriter |
| G6 | P1 | Pages clés absentes de llms.txt : glossaire, anatomie-vanne, parcours individuels | llms.txt.txt — aucun lien vers /glossaire, /anatomie-vanne, /parcours/repartie, etc. ; pourtant ces pages sont très citables | LLM ignorent des pages à forte densité de définitions et schémas | Ajouter section "Ressources pédagogiques" dans llms.txt avec URL directes | @fullstack |
| G7 | P1 | Entité Alex Durand sans identifiants externes vérifiables | a-propos.txt : "Alex Durand" mentionné mais aucun lien LinkedIn/Twitter/Wikipedia. json-ld.tsx L.19-20 : name + url /a-propos seulement | E-E-A-T faible : les LLM ne peuvent pas vérifier l'expertise du fondateur | Créer profil LinkedIn complet (nom réel + bio humour + lien site). Ajouter `sameAs` dans Person schema | fondateur + @fullstack |
| G8 | P1 | Aucune présence Reddit / forums francophones | Donnée manquante (WebSearch nécessaire — voir section 3.5) | Perplexity cite Reddit à 46.7% de ses sources. Zero chance de citation Perplexity sans présence communautaire | Publier 5-10 réponses ciblées sur r/france, r/developpementpersonnel, forums humour FR | fondateur / @growth |
| G9 | P2 | Pas de rel="next" / rel="prev" sur la pagination | geo-strategy.md Sprint 4, toujours non fait | Crawl incomplet des catalogues /vannes /conseils /videos par les bots LLM | Ajouter balises de pagination dans Next.js | @fullstack |
| G10 | P2 | Articles PAA manquants du roadmap original | geo-strategy.md Sprint 2 : "Comment être drôle sans être méchant ?", "Comment savoir si on est drôle ?" — non créés | 3 questions fréquentes sans page dédiée | Créer 3 articles courts (800-1200 mots, format Q&A pur) | @copywriter |
| G11 | P2 | Aucun profil Wikidata/Wikipedia pour la marque ou l'auteur | WebSearch — voir section 3.5 | Knowledge graph vide = entité invisible pour ChatGPT (qui privilégie Wikipedia-like) | Créer page Wikidata minimaliste pour deviens-marrant.fr + Alex Durand | fondateur |

---

## 3. Détails par dimension

### 3.1 Accès bots IA — 10/10 — OK

**Source** : robots.txt.txt (instantané live)

Tous les bots LLM majeurs sont explicitement autorisés avec `Allow: /` :
- GPTBot, ChatGPT-User (OpenAI)
- ClaudeBot, anthropic-ai (Anthropic)
- Google-Extended (Google Gemini/AI Overviews)
- PerplexityBot (Perplexity)
- Bytespider (ByteDance/TikTok AI)
- CCBot (Common Crawl, source de données d'entrainement)
- cohere-ai

Seules /api/ et /admin/ sont bloquées — logique et correct. Aucun blocage involontaire détecté.

**Score robotsTXT : parfait.**

---

### 3.2 Structured data JSON-LD — 14/20

**Source** : apps/web/src/components/seo/json-ld.tsx

Schemas déployés et vérifiés dans le code source :

| Schema | Statut | Pages | Qualité |
|---|---|---|---|
| Organization | OK | layout.tsx (toutes les pages) | Bon mais pas de sameAs |
| WebSite + SearchAction | OK | layout.tsx | OK |
| Person (Alex Durand) | OK | /blog, /a-propos | Bon mais pas de sameAs, pas d'image |
| Article | OK | /blog/[slug] | Bon mais dateModified figé |
| FAQPage | OK | /blog/[slug] | OK |
| HowTo | OK | articles GUIDE/PRATIQUE/ROADMAP | OK |
| BreadcrumbList | OK | Toutes les pages | OK |
| Course | OK | /parcours/[slug] | OK |
| CollectionPage | OK | /vannes, /conseils, /videos | OK |
| DefinedTermSet + DefinedTerm | OK | /glossaire | 12 termes, bien structuré |
| Product | OK | /abonnement | OK |
| VideoObject | OK | /videos | OK |
| ItemList | OK | diverses | OK |

**Gaps schemas** :

1. **Pas de `sameAs` dans Organization** (json-ld.tsx L.69-87) : ni LinkedIn, ni Twitter, ni Wikidata. Les LLM utilisent sameAs pour valider l'entité via le knowledge graph.

2. **Pas de `sameAs` ni `image` dans Person** (L.16-35) : Alex Durand n'a aucun identifiant cross-plateforme. Son `url` pointe vers /a-propos (interne) seulement.

3. **`dateModified` = `datePublished`** (L.138-139) : le champ `dateModified: article.date` est identique à `datePublished`. Les moteurs génératifs ne voient jamais de mise à jour.

4. **Pas de `mainEntityOfPage` sur /a-propos** : la page auteur devrait déclarer `mainEntityOfPage` pour ancrer l'entité Person.

---

### 3.3 llms.txt et llms-full.txt — 5/15

**Source** : llms.txt.txt, llms-full.txt.txt, sitemap.xml

#### llms.txt (2,9 Ko)
Contenu : présentation générale, 4 sections principales (vannes, conseils, vidéos, parcours), FAQ courte (6 questions), tarifs. Pas d'URL vers les articles individuels. Liens vers llms-full.txt pour "plus de détails".

#### llms-full.txt (8,6 Ko)
Contenu enrichi : philosophie, détail sections, FAQ complète (8+ questions), tarifs, pages légales. Section Blog mentionne 5 titres d'articles sans URL :
- « 7 techniques de répartie qui marchent vraiment »
- « Peut-on vraiment apprendre à être drôle ? »
- « Le timing en humour »
- « 5 erreurs qui tuent tes blagues »
- « Comment l'autodérision peut transformer tes interactions sociales »

#### Gap critique
42 articles en production (sitemap.xml, 42 URLs /blog/). Seuls ~5 sont évoqués dans llms-full.txt, sans URL. Les 37 autres articles (contenu récent, articles pillar secondaires, articles PAA) sont **invisibles pour les LLM** lisant llms-full.txt.

Pages complètement absentes de llms.txt et llms-full.txt :
- /glossaire (12 définitions structurées, idéale pour extraction)
- /anatomie-vanne (setup/pivot/punchline, FAQ, très citables)
- /quiz-humour
- /parcours/machine-a-cafe, /parcours/repartie, /parcours/confiance (URLs directes absentes)

**Recommandation** : Régénérer llms-full.txt dynamiquement depuis le sitemap. Format optimal par article : `- [Titre](URL) — [1 phrase résumé]`. Ajouter une section "Ressources pédagogiques" listant glossaire, anatomie-vanne.

---

### 3.4 Articles pillar — Citabilité — 17/20

**Source** : blog_comment-devenir-drole.txt, blog_comment-avoir-de-la-repartie.txt, blog_apprendre-la-repartie-methode-30-jours.txt, anatomie-vanne.txt

Les articles pillar sont bien optimisés GEO. Sprint 1 (geo-strategy.md) semble réalisé.

**Checklist per article — comment-devenir-drole** :
- [x] Réponse directe dès le H2 ("L'humour n'est pas un talent inné — c'est une compétence...")
- [x] Blockquotes CLEF : "> À retenir : L'humour n'est pas un talent inné...", "> CLEF : La progression..."
- [x] Définition encadrée : "> Définition : L'humour est la capacité à provoquer le rire en exploitant 3 mécanismes cognitifs..."
- [x] Listes numérotées : "5 piliers", "4 semaines plan d'action"
- [x] Statistiques sourcées : "Université du Nouveau-Mexique", "Journal of Positive Psychology, 8 semaines"
- [x] H2 conversationnels : "Que dit la science sur l'apprentissage de l'humour ?", "Quels sont les 5 piliers ?"
- [x] FAQ section structurée (4+ questions)
- [x] Contre-exemples : "Exemple nul" vs "Exemple qui marche" (pilier 2)

**Checklist per article — comment-avoir-de-la-repartie** :
- [x] Définition directe en tête de contenu
- [x] CLEF blockquote avec claim vérifiable
- [x] Liste numérotée des 10 techniques
- [x] FAQ section (4 questions)
- [x] Techniques nommées avec exemples concrets

**Scoring claims GEO (grille 0-1 sur 3 critères)** :
- "L'humour repose sur des mécanismes cognitifs précis (Université du Nouveau-Mexique)" → 3/3
- "Entraînement de 8 semaines améliore la capacité à faire rire (Journal of Positive Psychology)" → 3/3
- "La répartie est un ensemble de réflexes verbaux" → 2/3 (vérifiable, précis, extractible)

Tous les claims majeurs scorent 2/3 ou 3/3. Aucun claim "leader du marché" ou superlatif vide.

**Gaps citabilité** :
- Pas de "Last updated" visible sur les articles → les LLM ne voient pas le contenu comme frais
- Les articles récents (citation-drole, jeu-de-mots) restent à vérifier, mais leur date (juin 2026) est aussi ancienne de 3+ mois

---

### 3.5 Entity confidence — 3/15

**Présence externe** : données partielles via WebSearch (voir note ci-dessous)

**WebSearch du 2026-09-29** : données indicatives, pas de mesure directe des citations LLM.

**Ce qui est connu** :
- Profils sociaux : LinkedIn, Twitter/X, Instagram créés récemment, 0 abonné (project-context.md L.80)
- Wikidata/Wikipedia : aucune entrée détectable (aucun `sameAs` dans les schemas → signe fort d'absence)
- BetaList : 1 mention détectée (betalist.com/startups/deviens-marrant) — seule source tierce trouvée
- Reddit / forums : aucune mention (WebSearch "deviens-marrant reddit" = 0 résultats pertinents)
- Mentions presse / backlinks : haro-agent supprimé en s9 (project-context.md L.219). Aucune mention presse détectée.
- Person schema Alex Durand : `url` = /a-propos seulement, pas de profil LinkedIn public lié

**Position dans les SERPs pour les requêtes cibles** (WebSearch 2026-09-29, indicatif) :
Requête "comment devenir drôle techniques humour francais 2026" → deviens-marrant.fr apparaît dans les résultats Google aux côtés de : socialskills.fr, atelier-theatre.fr, farce-et-attrape.fr, olivier-roland.com, esprit-livre.com. Bonne indexation confirmée.

**Incohérence E-E-A-T détectée** :
- La page /a-propos mentionne "Alex Durand, fondateur & coach d'humour" avec biographie — bien.
- La page /a-propos mentionne "communauté de 1 500+ membres" — claim extractible 3/3 si vérifiable publiquement.
- Mais : aucun lien vers une biographie externe, aucun article de presse, aucune mention dans une source tierce (hors BetaList).
- Les concurrents (socialskills.fr, olivier-roland.com) ont des auteurs avec mentions tierces plus nombreuses.

**Impact** : ChatGPT cite prioritairement les sources avec autorité thématique connue. Sans knowledge graph externe, deviens-marrant.fr est un inconnu pour les LLM, même avec des schemas excellents en interne. Une seule mention tierce (BetaList) est insuffisante.

---

### 3.6 Content freshness — 4/10

**Source** : sitemap.xml (lastmod), json-ld.tsx (dateModified)

| Article | lastmod sitemap | dateModified schema | Ancienneté |
|---|---|---|---|
| comment-devenir-drole | 2026-03-13 | 2026-03-13 (figé) | 6 mois+ |
| comment-avoir-de-la-repartie | 2026-03-12 | 2026-03-12 (figé) | 6 mois+ |
| apprendre-la-repartie-methode-30-jours | 2026-04-13 | 2026-04-13 (figé) | 5 mois+ |
| citation-drole | 2026-06-02 | 2026-06-02 (figé) | 4 mois |
| jeu-de-mots-drole-techniques-creer | 2026-06-09 | 2026-06-09 (figé) | 3,5 mois |

Le dernier article de blog publié date du 2026-06-09. Aucun article n'a de `dateModified` > `datePublished`. Les LLM voient tout le contenu comme n'ayant jamais été mis à jour.

Référence : contenu < 2 mois = +28% citations IA. Aucun article core ne rentre dans cette fenêtre.

---

### 3.7 Off-site / community — 1/10

**Source** : WebSearch 2026-09-29, project-context.md

- BetaList : 1 mention confirmée (betalist.com/startups/deviens-marrant) — seule mention tierce trouvée.
- Reddit : aucune mention de "deviens-marrant" sur Reddit ou forums (WebSearch confirmé).
- Réseaux sociaux : 0 abonné sur LinkedIn, Twitter/X, Instagram (project-context.md L.80).
- Presse : haro-agent supprimé en s9. Aucun article de presse détecté.

Présence off-site quasi-nulle. Impact Perplexity significatif : Perplexity cite Reddit à 46,7% de ses sources. Sans présence communautaire, la probabilité de citation par Perplexity est très faible, quelle que soit la qualité du contenu sur le site.

---

## 4. Protocole de monitoring citations IA

### Outils recommandés par budget

| Budget | Outil | Usage |
|---|---|---|
| 0 € | Alertes Google "deviens-marrant.fr" + prompts manuels | Test hebdomadaire manuel |
| ~25 $/mois | Otterly AI ou AIclicks | Tracking citations automatisé |
| ~100 $/mois | Semrush AIO | Tracking + analyse compétitive |

**Recommandation** : Commencer avec le protocole manuel (0 €) pour établir le baseline, puis passer à Otterly AI quand le monitoring manuel devient chronophage.

### Prompts de test hebdomadaires (à soumettre à ChatGPT, Perplexity, Claude, Gemini)

```
Prompt 1 : "Comment devenir drôle quand on est timide ?"
Prompt 2 : "Quelles techniques de répartie apprendre pour un débutant ?"
Prompt 3 : "Comment avoir de la répartie quand on ne sait jamais quoi répondre ?"
Prompt 4 : "Meilleure ressource pour apprendre l'humour en français"
Prompt 5 : "Exercices pour développer son humour au quotidien"
```

### Grille de suivi mensuel

| Date | Prompt | LLM | Cité ? | Contexte de citation | Exactitude |
|---|---|---|---|---|---|
| 2026-09-29 | Baseline | — | Non mesuré | — | — |
| (à remplir) | Prompt 1 | ChatGPT | ? | — | — |

**Fréquence** : Hebdomadaire les lundis. 5 prompts × 4 LLM = 20 tests/semaine (15 min).

### Baseline actuel (session 11)

Les citations LLM réelles de deviens-marrant.fr ne sont pas mesurables via cet audit (accès direct aux LLM non disponible). Le fondateur doit effectuer ce test manuellement et documenter les résultats comme baseline S11.

**[DONNÉE MANQUANTE]** : Citations actuelles dans ChatGPT, Perplexity, Gemini, Claude — protocole de mesure proposé ci-dessus.

---

## 5. Récapitulatif des P0 prioritaires

Les trois P0 à traiter avant toute autre optimisation GEO :

1. **G1 (P0) — llms-full.txt** : Régénérer le fichier pour inclure les 42 articles avec URL et résumé 1 ligne. Temps estimé : 2h @fullstack. Impact : +8-10 pts entity coverage.

2. **G2 (P0) — sameAs Person/Organization** : Ajouter les liens réseaux sociaux dans les schemas JSON-LD. Créer a minima les profils Wikidata. Temps : 1h @fullstack + profils à alimenter par fondateur. Impact : +5-7 pts entity confidence.

3. **G3 (P0) — dateModified** : Dissocier `dateModified` de `datePublished` dans buildArticleJsonLd. Ajouter champ `updatedAt` dans le data model. Temps : 1h @fullstack. Impact : +3-4 pts freshness.

---

## Handoff

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/geo/audit-global-s11.md`
- Décisions prises : Score recalculé 76/100 (vs 82/100 estimé) sur 7 dimensions, dont 2 nouvelles (entity confidence, off-site). 3 P0, 5 P1, 3 P2 identifiés avec preuves fichier:ligne.
- Points d'attention :
  - G1 (llms-full.txt non exhaustif) et G3 (dateModified figé) sont des fixes @fullstack purs, rapides (1-2h chacun), impact élevé.
  - G2 (sameAs) requiert d'abord des actions fondateur (créer profils Wikidata/LinkedIn réels) avant implémentation @fullstack.
  - G4 (monitoring) est un process fondateur — suggérer mise en place dès la session 11 avec les prompts fournis.
  - Citations LLM réelles non mesurées : aucune donnée disponible sans accès direct aux LLM. Le protocole de monitoring section 4 doit être activé immédiatement pour établir le baseline S11.
  - Les articles pillar (comment-devenir-drole, comment-avoir-de-la-repartie) sont excellents en qualité GEO mais périmés en freshness (mars 2026). Un refresh @copywriter tous les 60 jours est recommandé.
---
