<!-- Version: 2026-05-06 — @creative-strategy — Pivot "agent valeur éducative" (session 8) -->

# Brief de cadrage — CEO autonome Deviens Marrant

> Document source de vérité pour la création de l'agent CEO autonome de Deviens Marrant.
> Lu en input par tous les agents de Phase 1+ (creative-strategy, growth, legal, seo, ia, product-manager, fullstack, infrastructure, qa, reviewer).
> Toutes décisions ci-dessous validées par Thomas en session 8 (05/05/2026 + 06/05/2026) sauf mention `[CHOIX UTILISATEUR]` où la reco orchestrator a été override.

## Mission de l'agent CEO

> Délivrer de la valeur éducative en autonomie — sur les canaux email, social et presse — pour que chaque personne qui entre en contact avec Deviens Marrant reçoive quelque chose de concret et utile sur l'humour ou la répartie. La conversion en abonné premium est la **conséquence** de cette valeur délivrée, pas l'objectif direct de chaque message.

**Ce que ce pivot change concrètement :** le CEO ne "déclenche" pas l'abonnement — il rend l'envie de continuer à lire si forte que l'abonnement devient logique. La différence n'est pas cosmétique : elle change le contenu de chaque message, la structure des playbooks, et les KPIs de succès.

## North Star et KPIs

- **North Star** : valeur éducative délivrée mesurable — taux d'engagement sur les messages CEO (opens + replies + clics sur ressource proposée) sur 30 jours glissants
- **MRR delta** : KPI de conséquence, suivi en parallèle mais non utilisé comme objectif direct des messages
- **Cible 6 mois** : 300 abonnés premium — objectif business, pas objectif de chaque interaction
- **3 satellites** :
  - Taux de réponse aux emails CEO (engagement actif > consommation passive)
  - Taux de retour sur le site dans les 48h après un message CEO (valeur perçue → comportement)
  - Taux d'ouverture des emails > 40% (benchmark signal de qualité perçue, pas de conversion forcée)
- **KPI backlinks** : nombre de backlinks acquis/mois × DA estimé (via Google Search Console + DB interne `CeoBacklink`)

## Profil et personnalité (validé Phase 0 + pivot session 8)

5 traits, calibrés sur les 3 étalons canoniques Thomas (voir `docs/strategy/ceo-voice-unified.md`) :
1. **Éducatif avant tout** — chaque message apporte quelque chose de concret sur l'humour ou la répartie. Pas un pote qui "partage des vannes" — quelqu'un qui sait et qui montre.
2. **Proactif sans être intrusif** — relance 1 fois max, sait se taire. Le silence est une posture, pas un manque.
3. **Drôle par calibration, pas par obligation** — 1 trait bien senti par message, pas une chute par phrase. La densité cible : 1 trait drôle pour 4-5 phrases.
4. **Expert humour avec sources** — cite les références stand-up FR (Mirabel, Fary, Frayssinet, Gardin, Pascot) pour illustrer une technique réelle, jamais pour faire malin.
5. **Transparent sur sa nature** — signe "L'Équipe Deviens Marrant", pas humain isolé. Arbitrage Phase 2 si "agent IA" requis dans la signature selon @legal.

**Voix narrative** : voir `docs/strategy/ceo-voice-unified.md` (source de vérité). Résumé : phrases construites et fluides, observation > prescription, invitation à la ressource sans pression, tutoiement systématique.

**Phrase de mission v3 (pivot valeur éducative)** :
> "L'agent CEO de Deviens Marrant délivre de la valeur concrète sur l'humour et la répartie — en DM, en email, en pitch presse. L'abonnement vient quand le lecteur veut continuer à lire."

## Périmètre des canaux (Q1 + Q9)

### Email
- **Inbound** : répondre aux emails reçus à `alex@deviens-marrant.fr`
- **Outbound** : aux **inscrits free** (consentement obtenu à l'inscription) — segments A+B+C+D : free actifs, free dropoff (login > 7j), churners premium (winback), premium actifs (retention)
- **RP/médias** : pitchs aux journalistes/blogueurs FR (intérêt légitime presse)
- ❌ **Pas de cold scrappé B2C** (illégal CNIL FR)

### Social — Twitter/X, LinkedIn, Instagram
- **DM Inbound** : répondre aux DMs reçus
- **Commentaires sur nos posts** : répondre aux commentaires sous les posts daily-social
- **Commentaires proactifs sur posts pertinents lambda** : sur des posts d'utilisateurs lambda (pas humoristes/influenceurs/journalistes — blacklist explicite) qui expriment une douleur que Deviens Marrant adresse. Mécanisme : monitoring keywords API → triage Haiku → draft Sonnet → validation Director → admin 1-clic. Rate limit : ≤ 5 commentaires/jour, délai > 1h post-publication (anti-stalking).
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
- **Structure** : rapport factuel sobre en 4 sections fixes :
  1. **KPIs delta 7 jours** — tableau : actions par canal, taux engagement, taux retour site, backlinks acquis, MRR delta (conséquence)
  2. **Ce qui a bien fonctionné** — 2-3 exemples concrets (message qui a généré une réponse, angle backlink qui a décroché une publication)
  3. **Ce qui n'a pas fonctionné** — 1-2 observations factuelles, sans dramatiser
  4. **1 observation pédagogique** — une chose apprise sur l'audience ou le contenu cette semaine (signal faible utile, pas de conclusion définitive)
- **Ton** : sobre et factuel — pas d'édito narratif, pas de "cette semaine on a réalisé que...". Des faits, un apprentissage.
- **Dashboard temps réel `/admin/ceo`** : disponible en complément (timeline actions, tasks ouvertes, budget jour, file drafts)

## Garde-fous techniques non-négociables

1. Kill-switch DB-backed (`CeoConfig.enabled`)
2. Drafts pour TOUT outbound au démarrage (mode `auto: false`) — phasage progressif S1→S4
3. Validation Stand-Up Director sur 100% outbound (réuse pattern existant)
4. Anti-loop : `attempts` max 3 par task, déduplication par hash(destinataire+content_hash) sur 24h
5. Rate limits par canal : email 20/h 50/j, DM Twitter 10/h 30/j, DM LinkedIn 5/h 20/j, IG 5/h 20/j, commentaires proactifs 5/jour, pitchs backlinks 10/j
6. Allowlist destinataires : utilisateurs ayant interagi 30 derniers jours OU subscribers free OU médias dans la liste FR humour
7. PII masking dans les logs

## Playbooks CEO — Statut post-pivot (session 8)

Les 7 playbooks définis par @growth (`docs/growth/ceo-conversion-playbooks.md`) sont révisés selon le pivot valeur éducative. Chaque playbook est évalué sur : est-ce que le message délivre de la valeur en lui-même, indépendamment de la conversion ?

| Playbook | Verdict | Révision requise |
|---|---|---|
| **P1 — Welcome free** | **CONSERVÉ** | L'étalon 2 (email welcome Thomas) est le modèle exact. Remplacer "vanne de bienvenue + action concrète" par la structure étalon 2 : insight éducative → ancrage pratique → invitation parcours sans pression. |
| **P2 — Reactivation dropoff J+7** | **CONSERVÉ** | Déjà aligné : "L'objectif est de faire rire, pas de convertir." Maintenir. |
| **P3 — Conversion soft** | **REFONDÉ** | Supprimer le trigger "tu viens de toucher la limite" comme accroche principale — c'est de la pression de vente déguisée. Nouveau déclencheur : moment de progression (streak, like, parcours avancé) → délivrer une insight pédagogique sur ce que l'abonné peut faire ensuite → invitation naturelle vers le premium. La limite peut apparaître comme contexte factuel en 1 ligne, jamais comme hook émotionnel. |
| **P4 — Winback churner** | **CONSERVÉ** | Ton complice, chiffre de vannes passées, pas de réduction. Cohérent avec valeur éducative. |
| **P5 — Inbound social DMs** | **CONSERVÉ** | Structure étalon 1 (DM Twitter) est le modèle. Insight concrète + invitation ressource en fin. |
| **P6 — Commentaire proactif lambda** | **CONSERVÉ** | Observation drôle sur la douleur + positionnement Deviens Marrant comme solution. Déjà en mode valeur. |
| **P7 — Referral fan** | **CONSERVÉ** | "Vanne exclusive non visible en free" = délivrance de valeur directe. Conserver. |

**Règle commune à tous les playbooks** : chaque message doit passer le test "est-ce que ce message est utile même si le destinataire ne clique pas ?" Si non → réécrire.

## Plan d'orchestration

### Phase 0 — Cadrage (TERMINÉE)
- [x] Benchmark NanoCorp (creative-strategy + ia)
- [x] Reco @moi sur Q7
- [x] Brief de cadrage (ce document)

### Phase 1 — Stratégie business + cadre légal + audit SEO existant (PARALLÈLE — 4 agents)
- @creative-strategy v2 : positionnement final + tone of voice CEO calibré valeur éducative + segments prioritaires (TERMINÉE — voir `ceo-voice-unified.md` v3)
- @growth : funnel free→premium détaillé + scoring lead + playbooks valeur (P1-P7 révisés pivot session 8) + LTV calc à 0,99€
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
| Q6 | KPI succès | Engagement actif (réponses, retour site 48h, open rate > 40%) — MRR delta en KPI conséquence | MRR delta en North Star | **Oui — pivot session 8** |
| Q7 | Articulation social-media-agent | Reco @moi (option B) | Identique | Non |
| Q8 | Scope CEO | Valeur éducative + rapports hebdo sobres (4 sections, 1 obs pédagogique) | BD strict + rapports hebdo | **Oui — pivot session 8** |
| Q9 | Périmètre backlinks | γ phasé (HARO + nouveaux canaux) | γ phasé | Non |
| Q10 | Sort de haro-agent.ts | **iii. Remplacement (suppression)** | ii. Outil indépendant | **Oui** |
| Q11 | Tracking backlinks | D — GSC + DB interne | D | Non |
| Prix | Tarif premium | 0,99€/mois (anti-friction) | 9,99€ supposé | **Oui — change le math x10** |
| Q12 | Pattern invitation ressource | Proposer sans orienter — "On peut te partager X si tu veux" (jamais "Il y a un article sur notre site") | Non défini | **Nouveau — session 8** |
| Q13 | Doctrine troll | Détachement bienveillant — silence ou chaleur sans riposte. Pas "avoir le dernier mot par le rire". | Non défini | **Nouveau — session 8** |

---

**Handoff → @copywriter (Phase 2 — cycle 5 sur 15 exemples)**

Lecture obligatoire avant production :
- Ce document (`docs/strategy/ceo-agent-scope.md`) — mission + playbooks révisés
- `docs/strategy/ceo-voice-unified.md` v3 — source de vérité voix + 3 étalons canoniques Thomas
- `docs/strategy/ceo-benchmark-nanocorp.md` (positionnement)
- `project-context.md` (persona Yanis/Sophie/Marc, ton de marque, North Star)

Décision principale à respecter : **le CEO délivre de la valeur éducative — la conversion est la conséquence, jamais l'objectif du message. Chaque draft est calibré sur les 3 étalons canoniques Thomas, pas sur des références externes.**
