# Benchmark architecture CEO agent — Nanocorp.so → reco Marrant

**Auteur** : @ia • **Date** : 2026-05-05 • **Pendant business** : @creative-strategy (en parallèle)
**Mission** : éclairer l'architecture du futur CEO agent Marrant (emails sortants + DMs réseaux sociaux pour conversion premium) à partir d'un teardown technique de Nanocorp.so.

Sources primaires : [nanocorp.so](https://www.nanocorp.so/), [docs.nanocorp.so](https://docs.nanocorp.so/), [/advertising](https://www.nanocorp.so/advertising), [/pricing](https://www.nanocorp.so/pricing), [rate-limits](https://docs.nanocorp.so/rate-limits), [llms.txt](https://docs.nanocorp.so/llms.txt), [YC profile](https://www.ycombinator.com/companies/nanocorp), [linkedin Biojout](https://www.linkedin.com/in/plbiojout/) — opéré par PHOSPHO INC. (YC W24, fondateurs Pierre-Louis Biojout / Paul-Louis Venard).

---

## 1. Stack technique probable Nanocorp

- **Frontend** : Next.js (signature `__NEXT_DATA__` dans le HTML, Mintlify pour docs — confirmé doc page).
- **Backend & runtime agent** : [HYPOTHÈSE] Python (l'écosystème phospho.ai est documenté Python+TypeScript pour phosphobot ; les fondateurs viennent de phospho qui est Python-first). Présence d'un outil `set_vercel_env_vars` (rate-limits doc) → infra des companies déployées sur **Vercel** (fait, doc).
- **Hébergement code généré par les agents** : repo GitHub par company (doc "Access the code on GitHub"), domaines `nanocorp.app` (free) ou custom — déploiement automatisé Vercel.
- **Provider LLM** : non communiqué publiquement. [HYPOTHÈSE forte] mix **Anthropic Claude (Sonnet/Opus pour planification) + GPT-5/Codex pour code-gen** — pattern typique YC W24 sur agents long-running. Le choix du tooling (`create_document`, `search_prospects`, `send_email`) ressemble à un Claude Agent SDK ou framework custom inspiré.
- **DB** : [HYPOTHÈSE] Postgres (Supabase ou Neon — standard YC stack). Chaque company a ses propres "secrets" stockés (doc).
- **Queue / scheduling** : agents tournent "on schedules" (doc home : "Autonomous agents run on schedules"). [HYPOTHÈSE] Temporal, Inngest ou cron + worker Python.
- **Observabilité** : `/live` page publique pour voir les companies travailler en direct (sitemap.xml) → logging structuré exposé. [HYPOTHÈSE] LangFuse / Helicone / homemade.
- **Paiements** : Stripe Connect Express (doc Withdrawals) pour reverser les revenus utilisateurs.

## 2. Modèles LLM utilisés

Aucune mention publique des modèles dans le site/docs/llms.txt. Inférences :
- Tâches code-gen autonomes (build site + Stripe en quelques heures, ref [post Biojout](https://x.com/plbiojout/status/2031022446539600214)) → suggère **Claude Sonnet 4.6 ou GPT-5** en moteur principal, avec sous-agents Haiku/mini pour tâches répétitives.
- Boucle "maximize revenue, avoid bankruptcy, no human intervention" implique **planning multi-step + ReAct** (raisonnement-action itératif sur outils).
- [HYPOTHÈSE] context window ≥ 200K (mission + état company + historique tasks injectés à chaque tour).
- Le pattern `create_task / update_task / list_tasks / search_tasks` (rate-limits doc) confirme une **architecture plan-and-execute** avec task store persistant — pas un simple ReAct one-shot.

## 3. Boucle agentique / orchestration

Indices du modèle d'orchestration tirés de la doc rate-limits et du llms.txt :
- **Mono-agent par company avec task graph persistant** (pas multi-agents concurrents par company) : un seul "CEO" par company qui plan/exécute. Plusieurs companies indépendantes par utilisateur (= conglomerate).
- **State management** : la liste exhaustive `create_task / update_task / get_task_details / list_tasks / search_tasks` montre un **task store en DB** (pas juste mémoire short-term). Persistance critique pour runs reprenables.
- **Mission immutable + tasks mutables** : `read_mission / update_mission` séparés des tasks → pattern "north star prompt + working memory".
- **Boucle probable** (HYPOTHÈSE structurée) : `read_mission → list_tasks (open) → planner LLM choisit next task → tool use → update_task → loop`. Réveil par scheduler (cron) + déclencheurs externes (`read_email`, `list_emails`).
- **Tools écriture cappés vs lecture libre** (cf section 5) → l'agent peut "réfléchir longuement" gratuitement mais agit prudemment. Pattern utile à reprendre pour Marrant.
- **Replanning** : pas documenté publiquement. [HYPOTHÈSE] le LLM relit l'état + revenus + budget à chaque réveil et reprévoit. Page `/live` suggère traces visibles → LangSmith-like.
- **Memory long-terme** : `list_documents / read_document / create_document / update_document` → l'agent maintient ses propres docs (research notes, customer profiles) en plus des tasks. C'est leur RAG interne.

## 4. Capabilities & connecteurs (extraits des rate-limits)

Liste exhaustive des outils write inférée du tableau des rate-limits :
- **Email outbound** : `send_email` (20/h, 100/j) + `verify_email` (5/h, 50/j) + `search_prospects` (20/h, 100/j) → l'agent fait du **cold outreach**.
- **Email inbound** : `read_email`, `list_emails`, `mark_email_read` (uncapped — read-only).
- **Commerce** : `create_product`, `delete_product`, `list_products`, `get_payment_link`, `get_revenue` → intégration Stripe native, l'agent crée et vend des produits.
- **Code & déploiement** : `set_vercel_env_vars`, GitHub repo accessible (doc) → infra-as-code par l'agent.
- **Knowledge base** : `create_document / update_document` (30/h, 200/j chacun) + `read_document / list_documents` (libre) — RAG interne.
- **Analytics** : `get_analytics`, `get_company_info`, `get_revenue` (uncapped) — l'agent monitore ses propres KPIs.
- **Task system** : create/update/delete/list/search tasks (uncapped) — auto-orchestration.
- **Ads** (coming soon, page /advertising) : Google Ads via compte Nanocorp managé (l'utilisateur ne crée pas son compte Google).
- **Mécanisme** : [HYPOTHÈSE] tool-use natif (Anthropic ou OpenAI function calling) plutôt que MCP — le périmètre des tools est fermé/curé, pas extensible utilisateur. Pas de MCP user-installable mentionné.

## 5. Garde-fous techniques

Documentés explicitement (rate-limits doc) :
- **Rate limits par company, par tool, par fenêtre (hour + day)** — kill-switch implicite anti-runaway loop. Erreur structurée renvoyée à l'agent : `{error, tool, window, used, limit, retry_after_s, should_wait, message}`. Le champ `should_wait: false` quand >5min indique à l'agent de **passer à autre chose plutôt que sleep** — anti-blocage.
- **Budgets externes partagés** : la doc mentionne explicitement protéger "the shared email or Stripe write budget for everyone" → infrastructure mutualisée, donc enveloppe globale + quotas par company.
- **Budget Ads réservé upfront** (page /advertising) : "Budget reserved upfront — deducted from balance before campaign launches. Automatic pause when budget exhausted." → garantie absolue de non-dépassement financier.
- **Page /live publique** : observabilité radicale, les utilisateurs voient leurs agents travailler. [HYPOTHÈSE] traces structurées loggées par défaut.
- **Secrets isolés par company** (doc Secrets) → cloisonnement multi-tenant.

[HYPOTHÈSE] absents mais probables : HITL approval pour gros achats, content moderation sur emails sortants, allowlist destinataires. Non documenté publiquement.

## 6. Estimation coûts opérationnels Nanocorp

Pricing public : **Free $0** (3 lifetime credits), **Founder $30/mois = 30 credits** (puis paliers jusqu'à $1800/mois pour 2000 credits). 1 credit ≈ ~$1 retail.
- [HYPOTHÈSE] 1 credit ≈ 1 "run agent" ou X tokens (non précisé). À $30 / 30 credits ≈ **$1/credit retail**, marge ≥ 50% → coût LLM réel par credit ~$0.30-0.50.
- Si 1 credit = 1 cycle plan-execute moyen (mission read + 5-10 tool calls + reasoning), à Sonnet 4.6 (~$3/Mtok in / $15/Mtok out) avec ~20-50K tokens/cycle → **$0.06-0.30/cycle** côté Nano. Cohérent.
- Pour un agent CEO 24/7 actif en backend : 30 credits/mois = ~1 réveil/jour. Plans supérieurs (480-2000 credits) = ~16-67 réveils/jour.
- **Comparé à notre cible Marrant (2-5€/jour = 60-150€/mois)** : équivalent plan Nano $120-240/mois (120-240 credits) → ~4-8 cycles agent/jour. C'est tenable pour un CEO Marrant qui tourne 4-8x/jour (pas 24/7 temps réel).

## 7. Recommandations architecture pour CEO Marrant

### Stack reco — REUSE l'existant, zéro nouveau provider

Aucune justification de changer. Stack cible :
- **Runtime** : Anthropic SDK (déjà en prod, 9 agents tournent), Next.js 14 API routes sur Replit, Prisma/Postgres. Pas de LangGraph/CrewAI : trop d'overhead pour 1 agent ; le pattern "tool-use natif Anthropic" est suffisant et déjà maîtrisé (cf `standup-director-agent.ts`).
- **Pas de Claude Agent SDK** dans un premier temps : on a déjà notre propre orchestration éprouvée (daily-publisher.ts pattern). Réévaluer si on passe à >3 agents simultanés.

### Pattern agentic reco — single agent + task store DB + scheduler cron

- **Single agent CEO Marrant** avec tool-use Claude (≠ multi-agents). Justif : périmètre clair (convertir free→premium via 2 canaux), pas besoin d'orchestrateur.
- **Boucle plan-and-execute persistante** type Nanocorp : nouvelle table `CeoTask { id, type, status, payload, scheduledFor, attempts, createdAt }` + `CeoMemory { id, key, value, updatedAt }` (mémoire long-terme structurée).
- **Trigger** : cron `/api/cron/ceo-tick` toutes les 2-4h (6-12 réveils/jour). Chaque tick = lit l'état (users free récents, DMs entrants, emails inbound) → planifie → exécute 1-3 actions max → log → dort.
- **Validation Stand-Up Director obligatoire** sur tout outbound (réuse du pattern existant) : aucun email/DM ne sort sans `validateOutboundMessage()` qui réuse le directeur.

### Modèles reco — par tâche, budget chiffré

| Tâche | Modèle | Tokens/run | Runs/jour | Coût/jour |
|---|---|---|---|---|
| Triage inbound (DM/email scoring) | Haiku 4.5 | ~3K in / 0.5K out | 30 | ~0.04€ |
| Planning du tick (lecture état + décision) | Sonnet 4.6 | ~15K in (cache 80%) / 1K out | 8 | ~0.20€ |
| Rédaction email premium personnalisé | Sonnet 4.6 | ~5K in / 1.5K out | 10 | ~0.30€ |
| Rédaction réponse DM social | Sonnet 4.6 | ~3K in / 0.8K out | 15 | ~0.25€ |
| Validation Director sur outbound | Sonnet 4.6 (réuse) | ~2K in / 0.3K out | 25 | ~0.20€ |
| Stratégie hebdo (replanning) | Opus 4.7 | ~30K in / 3K out | 0.14 (1x/sem) | ~0.10€ moyenné |
| **Total estimé** | | | | **~1.10€/jour** |

Marge confortable sous le cap 2-5€/jour. Prompt caching activé partout (mission + persona + glossaire stand-up = ~10K tokens stables → cache 90% économie sur Sonnet).

### Connecteurs requis

- **Email outbound** : Resend (déjà en place, `RESEND_API_KEY`). ✅ Réuse direct, ajouter `EMAIL_FROM=ceo@deviens-marrant.fr` dédié pour ne pas polluer noreply.
- **Email inbound** : Resend Inbound (webhook) ou IMAP via Gmail dédié → nouvelle intégration. **À traiter par @fullstack**.
- **Social DMs (Twitter, LinkedIn, Instagram)** : Buffer (déjà en place pour outbound) ne lit PAS les DMs → besoin d'**API directes** : Twitter API v2 (`direct_messages.read`/`write`), LinkedIn Messaging API, Instagram Graph API (DMs business). Risque ban : Meta/X ont des conditions strictes pour DM automation. **Mitigation** : draft-only mode (l'agent rédige, Alex valide en 1 clic via `/admin/ceo`). Identique au pattern `/admin/social` existant.
- **CRM léger** : nouvelle table `CeoLead { userId?, email?, socialHandle?, source, score, status, lastContactAt, history Json }` plutôt qu'intégrer un CRM externe.

### Observabilité — étendre LlmUsageLog existant

- Ajouter `agent: 'ceo'` dans `LlmUsageLog` (existe déjà selon ai-cost-audit.md).
- Nouvelle vue `/admin/ceo` : timeline des actions, tasks ouvertes, budget jour consommé, file d'attente drafts.
- Alerting : > 3€/jour → Slack/email Alex (réuse `RESEND_API_KEY`).

### Garde-fous tech non-négociables (minimum viable)

1. **Kill-switch DB-backed** : table `CeoConfig { enabled: bool, dailyBudgetEur: number, maxActionsPerDay: number }`. Si `enabled=false` → cron return immédiat. Lookup à chaque tick.
2. **Drafts pour TOUT outbound** par défaut (mode `auto: false`) : email + DM rédigés, status `PENDING`, validation 1-clic. Pas d'envoi direct sans validation explicite tant que la confiance n'est pas établie sur ≥ 100 actions.
3. **Validation Stand-Up Director sur 100% des outbounds** (pattern existant : `directorValidated: false` → status PENDING). Réuse direct.
4. **Anti-loop** : `attempts` max 3 par task, `lastActedAt` tracking, déduplication par hash(destinataire+content_hash) sur 24h.
5. **Rate limits par canal** (calque Nanocorp) : email 20/h 50/j, DM Twitter 10/h 30/j, DM LinkedIn 5/h 20/j, DM Instagram 5/h 20/j. Erreur structurée renvoyée à l'agent (pattern Nano).
6. **Allowlist destinataires** au démarrage : uniquement utilisateurs ayant créé un compte ou interagi en DM dans les 30 derniers jours. Pas de cold outreach scrappé tant que pas de validation @legal RGPD.
7. **PII masking** dans les logs (email, nom complet → hash).

### Estimation coût/jour finale

Cible **~1.10€/jour LLM** (cf tableau) + Resend ~0.001€/email × 10 = négligeable + Buffer existant. **Bien sous le cap 2-5€/jour.** Marge pour scaler à 3x les volumes si ROI prouvé.

## 8. Risques techniques principaux

1. **Hallucination dans email/DM premium** (high) : l'agent invente une feature ou un prix. **Mitigation** : prompt système verrouillé sur la liste features + tarifs réels (lus depuis DB à chaque rédaction), validation Director qui rejette toute mention non whitelist, drafts-only au démarrage. Ajouter tests d'éval (cf `eval-strategy`) sur 20 cases d'emails de conversion.
2. **Ban API plateforme social** (high sur Meta/X) : Twitter et Instagram peuvent bannir un compte qui DM en automation, même via API officielle. **Mitigation** : drafts-only sur DMs au démarrage, throttling agressif (5-10 DM/jour max départ), templates variés (anti-pattern detection), monitoring des erreurs API → kill-switch auto si 3+ erreurs 401/429. Backup : si compte X banni, fallback email.
3. **Fuite données client (RGPD)** (medium-high) : agent copie un email d'un user dans une réponse à un autre, ou logs verbeux exposant des PII. **Mitigation** : PII masking dans logs (déjà mentionné), scope strict du contexte injecté (un seul lead à la fois, pas de batch), audit @legal avant prod, consentement explicite avant cold outreach. **Handoff @legal** : analyse RGPD/CNIL du cold outreach + DPA Anthropic + DPA Resend + base légale du traitement.

---

## Handoff

**→ @creative-strategy** (en parallèle, ne dupliquer) :
- Compléter le **profilage business** : positionnement "AI CEO autonome" vs "AI sales/growth assistant" — quelle promesse clientèle Marrant peut tenir avec 1.10€/jour de LLM ?
- Ton & voix du CEO (signature email, persona dans les DMs) — doit s'aligner avec brand-platform.
- Définir les **playbooks de conversion** que l'agent exécute (ex: relance D+3 free trial, DM aux likes des posts Instagram, réponse aux commentaires LinkedIn) — moi je couvre la mécanique technique, pas le contenu des playbooks.

**→ @legal** (bloquant avant prod) :
- Cold outreach email + DM social : base légale RGPD (consentement vs intérêt légitime), opt-out obligatoire dans chaque message, registre des traitements.
- DPA Anthropic + Resend + Buffer + Twitter/Meta — vérifier que les données users transitent légalement.
- CGU des plateformes sociales : Twitter/LinkedIn/Instagram autorisent-elles l'automation DM via API officielle pour ce cas d'usage ? Risque ban + risque légal séparés.
- CNIL : déclaration DPO + mention legal page.

**→ @fullstack** (implémentation après validation @creative-strategy + @legal) :
- Schéma Prisma : `CeoTask`, `CeoMemory`, `CeoLead`, `CeoConfig` (modèles spécifiés section 7).
- Code à créer dans `src/lib/ai/agents/ceo-agent.ts` + cron `/api/cron/ceo-tick` + admin UI `/admin/ceo`.
- Intégrations entrantes : Resend Inbound webhook, Twitter API v2 DM (besoin d'OAuth dédié), LinkedIn Messaging API.
- Réuse : `standup-director-agent.ts` (validation), `LlmUsageLog` (observabilité), Resend (outbound), pattern `/admin/social` (drafts validation 1-clic).

---

**Sources consultées** :
- [nanocorp.so home](https://www.nanocorp.so/), [pricing](https://www.nanocorp.so/pricing), [advertising](https://www.nanocorp.so/advertising), [sitemap](https://www.nanocorp.so/sitemap.xml)
- [docs.nanocorp.so](https://docs.nanocorp.so/), [llms.txt](https://docs.nanocorp.so/llms.txt), [rate-limits](https://docs.nanocorp.so/rate-limits)
- [YC NanoCorp](https://www.ycombinator.com/companies/nanocorp), [phospho YC W24](https://www.linkedin.com/company/phospho-app/)
- [Pierre-Louis Biojout LinkedIn](https://www.linkedin.com/in/plbiojout/), [post X autonomous](https://x.com/plbiojout/status/2031022446539600214)
- [Anthropic Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), [Building agents with Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [2026 Agent Framework Showdown](https://qubittool.com/blog/ai-agent-framework-comparison-2026), [Best Multi-Agent Frameworks 2026](https://gurusup.com/blog/best-multi-agent-frameworks-2026)
