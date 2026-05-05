<!-- Version: 2026-05-05T22:00 — @orchestrator — Brief de cadrage CEO autonome (Phase 0) -->

# Brief de cadrage — CEO autonome Marrant

> Document source de vérité pour la création de l'agent CEO autonome de Marrant.
> Lu en input par tous les agents de Phase 1+ (creative-strategy, growth, legal, seo, ia, product-manager, fullstack, infrastructure, qa, reviewer).
> Toutes décisions ci-dessous validées par Thomas en session 8 (05/05/2026) sauf mention `[CHOIX UTILISATEUR]` où la reco orchestrator a été override.

## Mission de l'agent CEO

> Convertir un maximum d'abonnés free en abonnés premium **0,99€/mois** en agissant en autonomie sur les canaux d'acquisition, de conversion et de visibilité (backlinks). Le CEO opère par **levée de friction** (pas démonstration de valeur) — à 0,99€, l'enjeu n'est pas de prouver que ça vaut le prix, c'est de déclencher l'action de souscription.

## North Star et KPIs

- **North Star** : MRR delta attribué au CEO (€/mois)
- **Cible 6 mois** : contribuer à hauteur de 30% du North Star projet (1 000€ MRR → ~300€ MRR CEO → ~300 abonnés premium acquis)
- **Cible 12 mois** : 30% du North Star projet (3 000€ MRR → ~900€ MRR CEO → ~900 abonnés)
- **3 satellites** :
  - Conversion rate free→premium dans les 30j d'inscription
  - Reply rate emails / response rate sociales
  - Cost-per-acquired-subscriber (cap : < 0,99€ = 1 mois d'abonnement)
- **KPI backlinks** : nombre de backlinks acquis/mois × DA estimé (via Google Search Console + DB interne `CeoBacklink`)

## Profil et personnalité (validé Phase 0)

5 traits, à affiner sur les 15 exemples canoniques de Phase 2 :
1. **Complice** — pas commercial. Parle comme un pote qui partage des vannes.
2. **Proactif sans être intrusif** — relance 1 fois max, sait se taire.
3. **Drôle par défaut** — chaque DM/email a au moins 1 chute. Cohérence marque.
4. **Expert humour** — utilise les références stand-up FR (Mirabel, Fary, Frayssinet, Gardin, Pascot).
5. **Transparent sur sa nature** — se présente comme "l'équipe Marrant", pas humain isolé. À ré-arbitrer Phase 2 sur exemples réels.

**Voix narrative** : compte = marque (G-S19 anti-1ère-personne respecté), tutoiement systématique, **PAS** de ton corporate/coach/thought-leader. **PAS** de "panique financière encodée" (rejet explicite du pattern NanoCorp).

**Phrase de mission v2 (calibrée 0,99€)** :
> "Je suis le CEO autonome de Marrant et ma mission est de convertir chaque abonné free en abonné premium en lui prouvant que pour le prix d'un café par mois, il devient le pote drôle de sa table. Et de glaner les backlinks qui propulsent Marrant au sommet de Google."

## Périmètre des canaux (Q1 + Q9)

### Email
- **Inbound** : répondre aux emails reçus à `alex@deviens-marrant.fr`
- **Outbound** : aux **inscrits free** (consentement obtenu à l'inscription) — segments A+B+C+D : free actifs, free dropoff (login > 7j), churners premium (winback), premium actifs (retention)
- **RP/médias** : pitchs aux journalistes/blogueurs FR (intérêt légitime presse)
- ❌ **Pas de cold scrappé B2C** (illégal CNIL FR)

### Social — Twitter/X, LinkedIn, Instagram
- **DM Inbound** : répondre aux DMs reçus
- **Commentaires sur nos posts** : répondre aux commentaires sous les posts daily-social
- **Commentaires proactifs sur posts pertinents lambda** : sur des posts d'utilisateurs lambda (pas humoristes/influenceurs/journalistes — blacklist explicite) qui expriment une douleur que Marrant adresse. Mécanisme : monitoring keywords API → triage Haiku → draft Sonnet → validation Director → admin 1-clic. Rate limit : ≤ 5 commentaires/jour, délai > 1h post-publication (anti-stalking).
- ❌ **Pas de DM outbound automatisé** (ban API + RGPD)
- ❌ **Pas d'outbound sur posts d'humoristes/influenceurs** (anti-bot-detection, brand safety)

### Backlinks (Q9 γ phasé)
- **HARO élargi** : reprise des 96 topics existants + automatisation source (Connectively scraper / Zapier / RSS) + envoi direct journaliste (full auto, plus de relais Alex)
- **Pitchs blogueurs FR humour** : Topito, Konbini Humour, Madmoizelle, etc.
- **Pitchs podcasts FR** : Sans Permission, Generation Do It Yourself, etc.
- **Échanges éditoriaux** : suggestion de mention dans articles existants
- **Annuaires** : Product Hunt FR, Uneed, BetaList
- **Tracking** : DB `CeoBacklink { domain, url, da, acquiredAt, source }` + Google Search Console (Q11 D) — pas d'Ahrefs/Semrush au démarrage

### Suppression `haro-agent.ts` (Q10 iii — `[CHOIX UTILISATEUR]`)

Reco orchestrator initiale : **ii. Outil** (`haro-agent.ts` reste indépendant, CEO l'orchestre).
**Choix Thomas** : **iii. Remplacement** — CEO reprend + élargit + suppression de `haro-agent.ts` et `/api/cron/haro/route.ts`. Justification implicite : préfère un seul agent unifié à maintenir.

**Conséquences techniques** (à exécuter en Phase 5 par @fullstack) :
- Migration des 96 topics pertinents et templates de génération vers `ceo-agent.ts` (module backlinks)
- Suppression de `apps/web/src/lib/ai/agents/haro-agent.ts`
- Suppression de `apps/web/src/app/api/cron/haro/route.ts`
- Grep dans `src/` des appels à `haro-agent` ou `runHaroPipeline` → migration ou suppression
- Mise à jour CLAUDE.md : section "Agent HARO" remplacée par section "Module backlinks du CEO"

## Niveau d'autonomie (Q3 — phasage 1 mois)

**Phasage 4 semaines** (validé Thomas, compressé depuis 4 mois NanoCorp pattern) :

| Semaine | Actions auto | Reste en drafts |
|---|---|---|
| **S1** | Drafts intégral sur tous canaux | Tout |
| **S2** | Drafts DMs Twitter + drafts pitchs blogueurs/podcasts | Tout |
| **S3** | Auto-send emails subscribers (après 50+ drafts validés sans correction majeure) + auto-send pitchs HARO | DMs sociaux + nouveaux canaux backlinks |
| **S4** | Auto-send DMs Twitter (après 30+ drafts validés) + auto-send pitchs blogueurs validés | DMs LinkedIn/Instagram + annuaires (drafts) |
| **Mois 3+** | Évolution vers option C (CEO peut désactiver daily-social en cas de crise) — toggle `CeoConfig.socialOutboundEnabled` | — |

**Risque assumé** : 200-300 actions max sur 4 semaines avant full auto = minimum statistique pour confiance. Si dégradation détectée par les KPIs satellites → kill-switch DB-backed.

## Garde-fous légaux (Q5 ajusté)

`[CHOIX UTILISATEUR]` : Thomas suit la reco orchestrator "90% NanoCorp / 10% du risque légal" plutôt que "comme NanoCorp littéral". Décision documentée : on copie l'attitude NanoCorp (autonomie radicale, proactivité, pas d'HITL généralisé) **mais sur des cibles légales FR**.

@legal a **mandat de forcer des restrictions techniques** dans le code (pas juste documenter). Liste minimale obligatoire :
- Opt-out auto-injecté dans tous les emails outbound
- Pas de cold email B2C scrappé (CNIL)
- Pas de DM outbound automatisé (ToS plateformes + RGPD)
- Kill-switch DB-backed (`CeoConfig.enabled = false` → cron return immédiat)
- Log persistant 3 ans pour audit CNIL
- RGPD article 22 : droit de contestation humaine sur toute décision automatisée
- DPA validé pour Anthropic + Resend + Buffer + APIs sociales
- Mention "agent IA" dans la signature des emails (à arbitrer Phase 2 selon transparence)

## Articulation avec social-media-agent.ts (Q7 — décision @moi confiance HAUTE)

**Option B** : canaux séparés. CEO et `social-media-agent.ts` cohabitent sans overlap.
- daily-social continue à publier 1 post/plateforme/jour (contenu marketing brand)
- CEO s'occupe inbound + commentaires proactifs limités + emails subscribers + backlinks
- Tables DB séparées : daily-social écrit dans `SocialPost`, CEO écrit dans `CeoOutboundMessage` (à créer)
- Stand-Up Director reste hub qualité unique : 2 fonctions distinctes (`validateSocialPost` existante + `validateCeoOutbound` à créer)
- Évolution mois 3+ : toggle `socialOutboundEnabled` permet à CEO de pause daily-social en crise (option C)

**Anti-patterns explicitement interdits** : brief partagé, voix mélangée, validation Director désynchronisée.

## Architecture technique (validé @ia Phase 0)

- **Stack** : Anthropic SDK + Replit + Prisma/Postgres + Stand-Up Director + Resend + LlmUsageLog (réuse 100%)
- **Pattern** : single agent + task store DB (`CeoTask`, `CeoMemory`, `CeoLead`, `CeoBacklink`, `CeoConfig`, `CeoOutboundMessage`)
- **Trigger** : cron `/api/cron/ceo-tick` toutes les 2-4h (6-12 réveils/jour)
- **Modèles** : Haiku 4.5 (triage), Sonnet 4.6 (rédaction), Opus 4.7 (stratégie hebdo 1×/sem)
- **Pas de Claude Agent SDK / LangGraph / CrewAI** : trop d'overhead pour 1 agent

## Budget LLM (Q4)

- **Cap** : ≤ 2€/jour
- **Estimé @ia** : 1.10€/jour (architecture initiale)
- **Avec backlinks** : +0.25€/jour (triage HARO + rédaction pitchs) → **~1.35€/jour total**
- **Marge** : 32% sous le cap → place pour scaler 1.5× si ROI prouvé
- **Instrumentation** : `LlmUsageLog` (existant) avec `agent: 'ceo'` + alerte > 3€/jour

## Reporting (Q8 hebdomadaire)

- **Format** : 1 email lundi 9h à `alex@deviens-marrant.fr`
- **Contenu** : récap 7 derniers jours (actions prises par canal, KPIs delta, conversions premium attribuées, backlinks acquis, difficultés rencontrées, plan semaine N+1)
- **Format inspiré NanoPilot** mais adapté : prose courte FR + 1 tableau KPIs + 3-5 highlights
- **Dashboard temps réel `/admin/ceo`** : disponible en complément (timeline actions, tasks ouvertes, budget jour, file drafts)

## Garde-fous techniques non-négociables

1. Kill-switch DB-backed (`CeoConfig.enabled`)
2. Drafts pour TOUT outbound au démarrage (mode `auto: false`) — phasage progressif S1→S4
3. Validation Stand-Up Director sur 100% outbound (réuse pattern existant)
4. Anti-loop : `attempts` max 3 par task, déduplication par hash(destinataire+content_hash) sur 24h
5. Rate limits par canal : email 20/h 50/j, DM Twitter 10/h 30/j, DM LinkedIn 5/h 20/j, IG 5/h 20/j, commentaires proactifs 5/jour, pitchs backlinks 10/j
6. Allowlist destinataires : utilisateurs ayant interagi 30 derniers jours OU subscribers free OU médias dans la liste FR humour
7. PII masking dans les logs

## Plan d'orchestration

### Phase 0 — Cadrage (TERMINÉE)
- [x] Benchmark NanoCorp (creative-strategy + ia)
- [x] Reco @moi sur Q7
- [x] Brief de cadrage (ce document)

### Phase 1 — Stratégie business + cadre légal + audit SEO existant (PARALLÈLE — 4 agents)
- @creative-strategy v2 : positionnement final + tone of voice CEO calibré 0,99€ (anti-friction) + segments prioritaires
- @growth : funnel free→premium détaillé + scoring lead + 5-7 playbooks de conversion + LTV calc à 0,99€
- @legal : red lines RGPD/CNIL/ToS plateformes + DPA + base légale outbound + base légale outreach journalistes/blogueurs
- @seo : audit `haro-agent.ts` existant pour migration + cibles backlinks prioritaires FR humour/EdTech + format pitch type + glossaire DA/DR

### Phase 2 — Audit dual sur 15 exemples canoniques (BLOQUANT — Réflexe P0 #3)
@copywriter produit 15 sorties canoniques :
- 5 emails subscribers (welcome, J+3, J+7, churner winback, fan engagement)
- 5 réponses sociales (DM Yanis Twitter, mention LinkedIn pro, DM Sophie IG, troll, DM Marc)
- 5 pitchs backlink (HARO journaliste, blogueur humour FR, podcast, suggestion mention, annuaire FR)

Audit dual /20 : Stand-Up Director + @reviewer. Itération jusqu'au plateau (cap 5 cycles) ou 10/20 sur 100% des exemples. **Gate fondateur sur le corpus final** (Thomas relit les "premiers extraits" comme demandé).

### Phase 3 — Specs + architecture (séquentiel après Phase 2)
- @product-manager : specs ceo-agent (inputs, outputs, décisions autorisées, garde-fous, kill-switch)
- @ia v2 : architecture détaillée multi-modèle + prompts + observabilité étendue + estimation coûts révisée
- @data-analyst : KPIs CEO + dashboard de pilotage + A/B framework

### Phase 4 — Création agent (après Phase 3)
- @agent-factory : génère `.claude/agents/ceo.md` à partir des specs + corpus canonique

### Phase 5 — Infrastructure autonome (après Phase 4)
- @infrastructure : cron Replit + queues + alerting + dashboard `/admin/ceo` + kill-switch
- @fullstack : routes API actions + intégrations Resend/Buffer/APIs sociales + **migration `haro-agent.ts` → suppression** (Q10 iii) + tests
- @qa : test bench scénarios CEO + simulations garde-fous + kill-switch

### Phase 6 — Review croisée + déploiement gradué
- @reviewer : audit cohérence + détection contradictions inter-phases
- Déploiement gradué : 5% → 25% → 100% du trafic sur 2 semaines avec KPIs surveillés

## Décisions du fondateur (traçabilité)

| # | Question | Décision Thomas | Reco orchestrator | Override ? |
|---|---|---|---|---|
| Q1 | Périmètre canaux | Inbound + commentaires nos posts + commentaires proactifs lambda (pas humoristes) | Identique | Non |
| Q2 | Segments emails outbound | A+B+C+D (validé via défauts) | A+B+C+D | Non |
| Q3 | Niveau d'autonomie | Phasage 1 mois (compressé) | Phasage 4 mois | **Oui — accéléré** |
| Q4 | Budget LLM | ≤ 2€/jour | ≤ 2€/jour | Non |
| Q5 | Garde-fous légaux | Suit reco "90% NanoCorp / 10% risque" | Idem | Non |
| Q6 | KPI succès | MRR delta + 3 satellites (validé via défaut) | Identique | Non |
| Q7 | Articulation social-media-agent | Reco @moi (option B) | Identique | Non |
| Q8 | Scope CEO | BD strict + rapports hebdo | Identique | Non |
| Q9 | Périmètre backlinks | γ phasé (HARO + nouveaux canaux) | γ phasé | Non |
| Q10 | Sort de haro-agent.ts | **iii. Remplacement (suppression)** | ii. Outil indépendant | **Oui** |
| Q11 | Tracking backlinks | D — GSC + DB interne | D | Non |
| Prix | Tarif premium | 0,99€/mois (anti-friction) | 9,99€ supposé | **Oui — change le math x10** |

---

**Handoff → @creative-strategy v2 / @growth / @legal / @seo (Phase 1 parallèle)**

Lecture obligatoire avant production :
- Ce document (`docs/strategy/ceo-agent-scope.md`)
- `docs/strategy/ceo-benchmark-nanocorp.md` (positionnement)
- `docs/ia/ceo-architecture-benchmark.md` (architecture technique)
- `project-context.md` (persona Yanis/Sophie/Marc, ton de marque, North Star)
- `CLAUDE.md` sections "Personas", "Stratégie Social Media", "Agent HARO" (à supprimer mais à comprendre)

Décision principale à respecter : **CEO opère par levée de friction (0,99€/mois), pas par démonstration de valeur**.
