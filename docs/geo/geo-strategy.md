# Strategie GEO -- deviens-marrant.fr

> Generative Engine Optimization : structurer le contenu pour etre cite par les LLM (ChatGPT, Perplexity, Gemini, Claude).

## Score actuel : 78/100

### Ce qui est deja en place (mars 2026)

| Optimisation | Statut | Impact |
|---|---|---|
| robots.txt LLM-friendly (GPTBot, ClaudeBot, PerplexityBot autorises) | OK | Les bots IA peuvent crawler tout le site |
| Person schema auteur (Alex, Coach d'humour) sur /blog et /a-propos | OK | E-E-A-T pour LLM -- auteur identifie et credible |
| CollectionPage schema sur /vannes, /conseils, /videos | OK | LLMs identifient les catalogues comme sources structurees |
| Organization + WebSite + SearchAction schemas | OK | Entite reconnue |
| Article + FAQPage schemas sur /blog/[slug] | OK | Contenu structure pour extraction |
| HowTo schema sur articles GUIDE/PRATIQUE/ROADMAP | OK | Rich Snippets + extraction LLM des etapes |
| BreadcrumbList sur toutes les pages | OK | Navigation claire pour les crawlers |
| Course schema sur /parcours | OK | Produit educatif identifie |
| Instructions GEO dans le prompt seo-blog-agent | OK | Articles generes avec listes numerotees et citation-worthy statements |

### Ce qui manque (gap analyse)

| Optimisation manquante | Impact estime | Priorite |
|---|---|---|
| Articles pillar non reformates GEO (pas de listes numerotees, pas de definitions encadrees) | +4 points | P0 |
| Pas de rel="next"/rel="prev" sur la pagination | +1 point | P2 |
| Pas d'articles "People Also Ask" dedies | +3 points | P1 |
| Pas de definedTerm schema sur les concepts cles dans les articles | +2 points | P1 |
| Citations-worthy statements insuffisants dans les 5 premiers articles | +2 points | P0 |

## Roadmap vers 90/100

### Sprint 1 -- Reformatage GEO des 5 pillar existants (P0, +4 pts -> 82/100)

Cibles :
1. `comment-devenir-drole` (pillar apprendre-humour)
2. `comment-avoir-de-la-repartie` (pillar techniques-repartie)
3. `timing-humour` (pillar techniques-delivery)
4. `5-types-humour-lequel-pour-toi` (pillar types-humour)
5. `meilleures-blagues-droles-2026` (pillar fort-volume)

Actions par article :
- Ajouter minimum 3 listes numerotees (LLMs extraient les listes pour leurs reponses)
- Ajouter des citation-worthy statements en blockquotes : `> **CLEF :** [affirmation memorable]`
- Reformuler les H2 en questions conversationnelles quand pertinent
- Ajouter des definitions claires des concepts cles en 1-2 phrases
- Verifier la presence d'au moins 1 statistique/reference sourcee

Contrainte absolue : le GEO ne doit JAMAIS tuer l'humour -- listes et blockquotes doivent rester droles.

### Sprint 2 -- Articles "People Also Ask" (P1, +3 pts -> 85/100)

Creer des articles satellites ciblant les questions PAA les plus frequentes non couvertes :
- "Est-ce que tout le monde peut devenir drole ?" -> couvert dans FAQ de comment-devenir-drole, mais pas d'article dedie
- "Comment etre drole sans etre mechant ?" -> gap total
- "Comment savoir si on est drole ?" -> gap total
- "Peut-on apprendre l'humour a tout age ?" -> couvert en FAQ, pas d'article

Ces articles doivent etre courts (800-1200 mots), ultra-structures (listes + definitions + FAQ), et mailles vers les pillar.

### Sprint 3 -- DefinedTerm schema + enrichissement (P1, +2 pts -> 87/100)

Ajouter un schema DefinedTerm sur les concepts cles utilises dans les articles :
- "Setup/Punchline" -> definition structuree
- "Callback" -> definition structuree
- "Timing comique" -> definition structuree
- "Autodérision" -> definition structuree
- "Escalade" -> definition structuree

Ces definitions permettent aux LLM d'extraire des definitions precises quand un utilisateur demande "c'est quoi le timing en humour ?"

### Sprint 4 -- Pagination rel="next"/rel="prev" (P2, +1 pt -> 88/100)

Ajouter les balises de pagination sur :
- /vannes (pagination par categorie)
- /conseils (pagination par categorie)
- /videos (pagination par categorie)
- /blog (pagination des articles)

### Sprint 5 -- Contenu "citation-worthy" systematique (ongoing, +2 pts -> 90/100)

Pour chaque nouvel article publie :
- Au moins 1 blockquote `> **CLEF :** ...` toutes les 300-400 mots
- Au moins 1 liste numerotee par section H2
- Definitions inline des termes techniques
- H2 formules comme des questions quand applicable
- Au moins 1 contre-exemple (bon/mauvais) par technique

## Regles GEO permanentes pour les nouveaux articles

1. **Listes numerotees** : min 3 par article. Les LLM adorent extraire des listes ordonnees.
2. **Citation-worthy statements** : blockquotes avec `> **CLEF :** [phrase memorable, factuelle, citable]`
3. **Questions conversationnelles en H2** : "Comment fonctionne le timing ?" plutôt que "Le timing"
4. **Definitions encadrees** : chaque concept cle defini en 1-2 phrases claires
5. **Statistiques sourcees** : au moins 1 par article (etudes, chiffres, references)
6. **Contre-exemples** : bon vs mauvais pour chaque technique (structure extractible)
7. **Regle absolue** : le GEO ne doit JAMAIS tuer l'humour du site

## Metriques de suivi

| Metrique | Actuel | Objectif 3 mois | Objectif 6 mois |
|---|---|---|---|
| Score GEO estime | 78/100 | 85/100 | 90/100 |
| Articles avec 3+ listes numerotees | ~30% | 80% | 100% |
| Articles avec citation-worthy statements | ~20% | 70% | 100% |
| Mentions dans les LLM (Perplexity, ChatGPT) | Non mesure | Tracking en place | 5+ mentions/mois |
| Schemas JSON-LD deploys | 10 types | 11 types (+DefinedTerm) | 12 types |

## Fichiers cles

| Fichier | Role |
|---|---|
| apps/web/src/lib/json-ld.tsx | Tous les schemas JSON-LD |
| apps/web/src/lib/blog-articles.ts | Articles statiques a reformater |
| apps/web/src/lib/ai/agents/seo-blog-agent.ts | Instructions GEO pour les articles generes |
| seo-editorial-plan.json | Planning editorial avec qualityRules GEO |
| public/robots.txt | Bots LLM autorises |
