# Plan d'orchestration -- Deviens-marrant.fr SEO+GEO Sprint

## Demande utilisateur
Coordonner les travaux SEO et GEO : produire les articles de blog overdue (22 articles planned), creer la strategie GEO formalisee, et optimiser les pillar existants pour passer le score GEO de 78/100 a 90/100.

## Mode detecte
Projet existant (Production) -- 17 articles deja publies dans blog-articles.ts, planning editorial v4.0 en place, stack SEO/GEO deja operationnelle.

## Profil utilisateur
- Niveau technique : Technique / Expert
- Ton de communication : Technique
- Mode d'interaction : Standard

## Complexite estimee
Lourde -- 2 agents principaux (@seo, @geo), 3 phases, 22 articles a produire au total

## Plan par phase

### Phase 1 -- Strategie GEO + 4 premiers articles SEO
- Agents : @geo (strategie GEO), @seo (articles 1-4)
- Statut : TERMINE
- Livrables recus :
  - docs/geo/geo-strategy.md (strategie + roadmap 78->90) -- OK
  - Article `je-suis-pas-drole-comment-changer` (pillar douleurs-personas, ~2000 mots) -- OK
  - Article `repondre-moqueries-avec-humour` (satellite douleurs, ~1500 mots) -- OK
  - Article `blagues-travail-faire-rire-pro` (pillar humour-contexte, ~1800 mots) -- OK
  - Article `jamais-quoi-repondre-techniques` (satellite douleurs, ~1500 mots) -- OK
  - seo-editorial-plan.json mis a jour (4 articles passes en "published") -- OK

### Phase 2 -- GEO optimization des 5 pillar existants
- Agents : @geo
- Statut : TERMINE
- Livrables recus :
  - `comment-devenir-drole` : H2 questions, definition, listes numerotees, blockquote CLEF -- OK
  - `comment-avoir-de-la-repartie` : definition, liste recapitulative 10 techniques, H2 questions, blockquote CLEF -- OK
  - `timing-humour` : definition, H2 questions, blockquote CLEF -- OK
  - `5-types-humour-lequel-pour-toi` : liste 5 types, H2 questions, blockquote CLEF -- OK
  - `meilleures-blagues-droles-2026` : definition, H2 questions, blockquote CLEF -- OK

### Phase 3 -- Verification + tests + commit
- Statut : TERMINE
- Tests : 953/958 pass (5 echecs = DST scheduling pre-existants, non lies)
- Commits pushes sur branche claude/install-gradient-agents-1P6U4

### Phase 4 -- Lot 2 articles SEO + cleanup CAROUSEL + fixes social
- Agents : @seo (articles), @fullstack (cleanup + fixes), @reviewer (audit Instagram)
- Statut : TERMINE
- Livrables recus :
  - Article `storytelling-drole-5-structures` (satellite techniques-delivery, ~2100 mots) -- OK (paragraphe dupliqué corrigé, excerpt tronqué)
  - Article `timidite-et-humour` (satellite techniques-repartie, ~1500 mots) -- OK (lien repartie-debutant ajouté)
  - Article `conversation-machine-a-cafe` (satellite douleurs-personas, ~1650 mots) -- OK
  - Cleanup CAROUSEL (6 fichiers nettoyés) -- OK
  - Fix espacement posts sociaux (3-4 slots Twitter, 1 post/plateforme/run) -- OK
  - Fix Instagram pipeline (metadata.instagram.type, pré-gen images, approvedBy) -- OK
  - Fix persona leak threadParts -- OK
  - Fix build next.config.js (3 problèmes) -- OK
  - seo-editorial-plan.json mis a jour (3 articles passes en "published") -- OK
- Tests : 960/961 pass (1 échec timezone pré-existant)

### Articles restants (backlog pour prochaines sessions)
- Lot 3 (priorite haute) : repartie-soiree-anti-malaise, humour-apres-rupture, confiance-humour-apres-rupture
- Lot 4 : rester-muet-en-groupe, pourquoi-blagues-marchent-pas, blagues-courtes-vs-longues
- Lot 5 : processus-creatif-humoristes-applique, devenir-drole-30-jours, voler-techniques-standup-soiree
- Lot 6 : techniques-standup-vie-sociale (pillar), parcours-humour-30-jours-retour
- Lot 7 : comment-faire-rire-ses-amis, creer-ses-propres-blagues
- Saisonniers (hors urgence) : blagues-fetes-noel-nouvel-an (sem 40), humour-saint-valentin (sem 5), humour-rentree-glace-brisee (sem 34)

## Feedbacks remontants
| # | Severite | Agent source | Agent cible | Probleme | Statut |
|---|---|---|---|---|---|

## Decisions d'arbitrage
| # | Sujet | Decision | Justification | Agents impactes |
|---|---|---|---|---|
| 1 | Gap cluster phrases-droles-conversations | Deja corrige | Le slug est deja present dans blog-clusters.ts cluster fort-volume | Aucun |
| 2 | Ordre articles | Douleurs-personas d'abord | Cluster le plus convertissant (haute intention) selon le planning editorial | @seo |
| 3 | Lots de 4 articles max par session | Anti-timeout | Chaque article fait 1500-2500 mots, production par lot pour qualite maximale | @seo |
| 4 | GEO : reformatage non-destructif | Ajout d'elements sans réécriture | On ajoute definitions, blockquotes, H2 questions SANS réécrire le contenu existant (deja audité et validé) | @geo |
