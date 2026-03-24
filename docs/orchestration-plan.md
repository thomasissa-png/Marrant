# Plan d'orchestration -- Deviens-marrant.fr SEO+GEO Sprint

## Demande utilisateur
Coordonner les travaux SEO et GEO : produire les articles de blog overdue (22 articles planned), creer la strategie GEO formalisee, et optimiser les pillar existants pour passer le score GEO de 78/100 a 90/100.

## Mode detecte
Projet existant (Production) -- 18 articles deja publies dans blog-articles.ts, planning editorial v4.0 en place, stack SEO/GEO deja operationnelle.

## Profil utilisateur
- Niveau technique : Technique / Expert
- Ton de communication : Technique
- Mode d'interaction : Standard

## Complexite estimee
Moyenne -- 2 agents principaux (@seo, @geo), 3 phases

## Plan par phase

### Phase 1 -- Strategie GEO + 2 premiers articles SEO (parallele)
- Agents : @geo (strategie GEO), @seo (articles 1-2)
- Parallelisation : OUI -- pas de dependance
- Statut : En cours
- Livrables attendus :
  - docs/geo/geo-strategy.md (strategie + roadmap 78->90)
  - 2 articles dans blog-articles.ts : `je-suis-pas-drole-comment-changer` (pillar douleurs) + `repondre-moqueries-avec-humour` (satellite douleurs)
  - Mise a jour seo-editorial-plan.json (statuts)

### Phase 2 -- 2 articles SEO supplementaires + GEO optimization pillar
- Agents : @seo (articles 3-4), @geo (reformatage pillar existants)
- Parallelisation : OUI
- Statut : En attente
- Livrables attendus :
  - 2 articles : `blagues-travail-faire-rire-pro` (pillar contexte) + `jamais-quoi-repondre-techniques` (satellite douleurs)
  - 5 pillar existants reformates GEO dans blog-articles.ts

### Phase 3 -- Verification + tests + commit
- Agents : orchestrateur (verification coherence)
- Statut : En attente
- Tests : npx jest --no-coverage
- Commit + push

## Feedbacks remontants
| # | Severite | Agent source | Agent cible | Probleme | Statut |
|---|---|---|---|---|---|

## Decisions d'arbitrage
| # | Sujet | Decision | Justification | Agents impactes |
|---|---|---|---|---|
| 1 | Gap cluster phrases-droles-conversations | Deja corrige | Le slug est deja present dans blog-clusters.ts cluster fort-volume | Aucun |
| 2 | Ordre articles | Douleurs-personas d'abord | Cluster le plus convertissant selon le planning editorial | @seo |
