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

### Phase 5 -- Lot 3 articles SEO + fix Instagram URLs
- Agents : @seo (articles), @fullstack (Instagram GCS signed URLs)
- Statut : TERMINE
- Livrables recus :
  - Article `repartie-soiree-anti-malaise` (satellite humour-contexte, persona Yanis, ~1500 mots) -- OK
  - Article `humour-apres-rupture` (satellite douleurs-personas, persona Marc, ~1500 mots) -- OK
  - Article `confiance-humour-apres-rupture` (satellite douleurs-personas, persona Marc, ~1500 mots) -- OK
  - Fix image-storage.ts : GCS signed URLs (7j) au lieu de routes Next.js -- OK
  - @google-cloud/storage ajoute, next.config.js externals, tests mis a jour -- OK
  - seo-editorial-plan.json mis a jour (3 articles passes en "published") -- OK
  - blog-clusters.ts mis a jour (repartie-soiree vers humour-contexte, humour-apres-rupture vers douleurs-personas) -- OK
  - 4 learnings P1 marques appliques dans lessons-learned.md -- OK
- Tests : 962/963 pass (1 echec timezone pre-existant)
- Validation Director : 5 tests appliques manuellement sur chaque article

### Articles restants (backlog pour prochaines sessions)
- Lot 4 (priorite haute) : rester-muet-en-groupe, pourquoi-blagues-marchent-pas, blagues-courtes-vs-longues
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

---

## Phase 8 — Projet CEO autonome Deviens Marrant (session 8 — 06/05/2026)

**Statut** : Phases 0-4 TERMINÉES. Phase 5 (implémentation code) DIFFÉRÉE session 9.

**Plan d'orchestration spécifique** : voir `docs/strategy/ceo-agent-scope.md` v2 (source de vérité — mission, KPIs, périmètre canaux, phasage 4 semaines drafts→auto-send, garde-fous légaux).

**Phases complétées session 8** :
- **Phase 0** — Cadrage + benchmark NanoCorp dual (creative-strategy + ia) + reco @moi sur articulation social-media-agent
- **Phase 1** — 4 agents parallèles : creative-strategy (positionnement initial), growth (7 playbooks + LTV), legal (red lines RGPD/CNIL/ToS), seo (35 cibles backlinks + audit migration haro-agent.ts)
- **Phase 2** — Corpus canonique 16 exemples — **6 cycles d'itération** dont **2 rejets fondateur** + pivot stratégique majeur "agent valeur éducative" (pas agent conversion) + 3 étalons canoniques Thomas validés
- **Phase 3** — Specs PM (628L) + Architecture IA (371L, prompt système 140L verbatim) + KPIs analytics (480L) + audit cohérence reviewer (135L) + 5 patches HAUTE @PM specs
- **Phase 4** — `.claude/agents/ceo.md` (280L) — agent canonique de référence

**Phase 5 (différée session 9)** : implémentation code par @fullstack — `ceo-agent.ts` + 6 migrations Prisma + 2 crons + intégrations APIs (Twitter/IG/Resend Inbound) + suppression `haro-agent.ts` + dashboard React + tests Jest. Audit @legal pré-S3 + audit @qa scénarios garde-fous. ~3-4h dédiées.

**BLOCKER persistant** (s7+s8) : default branch `claude/init-project-setup-jcI9q` toujours obsolète. Tous fixes session 7 et 8 invisibles en prod tant que pas de redéploiement Replit. Réflexe P0 #2 actif.
