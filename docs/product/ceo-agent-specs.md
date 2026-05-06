# Specs fonctionnelles — CEO Agent autonome Deviens Marrant
> Version 1.0 — 2026-05-06 — @product-manager — Phase 3
> Inputs : ceo-agent-scope.md v2, ceo-voice-unified.md v3, ceo-conversion-playbooks.md, ceo-legal-redlines.md, ceo-backlinks-strategy.md, ceo-canonical-examples.md v5
> Source de vérité décisions Thomas : ceo-agent-scope.md tableau traçabilité Q1-Q13

---

## 1. Vue d'ensemble

Le CEO Agent est un **agent IA single-agent cron-based** qui délivre de la valeur éducative en autonomie sur email, social et presse. La conversion en abonné premium est la conséquence de cette valeur, jamais l'objectif direct de chaque message.

**Architecture** : pattern task store DB persistant + single agent (pas multi-agent, pas LangGraph, pas CrewAI). Trigger : cron `/api/cron/ceo-tick` toutes 2-4h. Le cron lit l'état (CeoConfig, leads scorés, tasks ouvertes), planifie 1-3 actions max par tick, exécute, log dans CeoAuditLog.

**Stack réutilisée à 100%** : Anthropic SDK (Haiku 4.5 triage, Sonnet 4.6 rédaction, Opus 4.7 rapport hebdo), Prisma/Postgres existant, Stand-Up Director (`validateCeoOutbound` à créer en réuse du pattern `validateSocialPost`), Resend, Buffer (posts daily-social uniquement — pas pour CEO), LlmUsageLog existant avec `agent: 'ceo'`.

**Séparation stricte** : `SocialPost` (daily-social) ≠ `CeoOutboundMessage` (CEO). Aucun brief partagé, aucun overlap canal.

**Mission pivot session 8** : "L'agent CEO de Deviens Marrant délivre de la valeur concrète sur l'humour et la répartie — en DM, en email, en pitch presse. L'abonnement vient quand le lecteur veut continuer à lire."

---

## 2. Schéma Prisma — 6 nouveaux modèles

```prisma
// Kill-switch + budget + configuration globale
model CeoConfig {
  id                 String   @id @default(cuid())
  enabled            Boolean  @default(false) // false = ceoTick return immédiat, aucune action
  dailyBudgetEur     Float    @default(2.0)
  maxActionsPerTick  Int      @default(3)
  autoSendEmail      Boolean  @default(false) // true à partir de S3
  autoSendDm         Boolean  @default(false) // true à partir de S4
  killSwitchReason   String?  // raison si enabled=false (tracé pour audit)
  socialOutboundEnabled Boolean @default(false) // toggle mois 3+ (option C)
  updatedAt          DateTime @updatedAt
}

// Task store persistant — cœur de l'agent
model CeoTask {
  id           String     @id @default(cuid())
  type         CeoTaskType
  status       CeoTaskStatus @default(PENDING)
  payload      Json       // données contextuelles (leadId, playbookId, opportunityId…)
  scheduledFor DateTime
  attempts     Int        @default(0) // max 3, au-delà = FAILED
  contestedAt  DateTime?  // art. 22 RGPD — contestation par l'utilisateur
  createdAt    DateTime   @default(now())
  completedAt  DateTime?

  @@index([status])
  @@index([scheduledFor])
}

// Mémoire long-terme de l'agent
model CeoMemory {
  id        String   @id @default(cuid())
  key       String   @unique // ex: "weekly_report_last_generated", "top_performing_playbook"
  value     Json
  updatedAt DateTime @updatedAt
}

// CRM léger — scoring leads
model CeoLead {
  id            String        @id @default(cuid())
  userId        String?       @unique
  email         String?       // hashé dans les logs, clair ici (champ protégé)
  socialHandle  String?
  source        String        // "email_signup" | "twitter_dm" | "linkedin_mention" | "instagram_dm"
  score         Int           @default(0) // calcul signaux S1-S12, 0-50
  signals       Json          // snapshot des signaux actifs au dernier calcul
  status        CeoLeadStatus @default(COLD)
  lastContactAt DateTime?
  lastPlaybook  String?       // dernier playbook utilisé (P1-P7)
  touchpoints   Int           @default(0) // max 3 sur durée de vie free
  optOut        Boolean       @default(false) // opposition art. 21 RGPD
  history       Json          @default("[]") // tableau des interactions CEO
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  user     User?                 @relation(fields: [userId], references: [id], onDelete: SetNull)
  messages CeoOutboundMessage[]

  @@index([status])
  @@index([score])
  @@index([userId])
}

// Suivi messages outbound toutes canaux
model CeoOutboundMessage {
  id               String             @id @default(cuid())
  channel          CeoChannel
  direction        CeoDirection       @default(OUTBOUND) // inbound | outbound
  recipient        String             // email ou handle social (hashé dans logs)
  subject          String?            // emails uniquement
  content          String             @db.Text
  status           CeoMessageStatus   @default(PENDING)
  directorScore    Int?               // score Stand-Up Director (0-10)
  directorValidated Boolean           @default(false)
  playbook         String?            // P1-P7 ou "backlink_[type]"
  // Patch HAUTE Phase 3 : flag pour critère passage S2→S3 (correction post-envoi)
  requiresHumanReview Boolean          @default(false)
  sentAt           DateTime?
  opens            Int                @default(0)
  clicks           Int                @default(0)
  replies          Int                @default(0)
  repliedAt        DateTime?
  externalId       String?            // ID Resend ou Buffer pour tracking
  leadId           String?
  // Patch HAUTE Phase 3 : tracking UTM pour attribution conversion (cf section 11)
  utmSource        String?            // "ceo"
  utmCampaign      String?            // playbook ID (P1-P7) ou "backlink_haro" etc.
  utmMedium        String?            // channel (email, twitter, linkedin, ig)

  lead CeoLead? @relation(fields: [leadId], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([channel])
  @@index([leadId])
  @@index([sentAt])  // pour requêtes attribution 7j rolling
}

// Patch HAUTE Phase 3 : snapshot quotidien KPIs (alimente dashboard /admin/ceo)
// Cron daily 5h UTC `/api/cron/ceo-kpis-snapshot` insère 1 ligne/jour
model CeoKpiSnapshot {
  id                       String   @id @default(cuid())
  date                     DateTime @unique @db.Date
  // North Star
  northStarEngagement30d   Float    // (opens + replies + clicks) / total_sent
  // Satellites
  emailReplyRate           Float
  siteReturn48h            Float
  emailOpenRate            Float
  // Opérationnels
  killSwitchTriggers24h    Int
  directorFailRate         Float
  draftsAutoSendRatio      Json     // { email: 0.8, twitter: 0.3, ... }
  costPerAcquiredSubscriber Float?  // null si 0 conversion attribuée
  ceoAttributedConversions Int
  backlinksDaSum           Int      // somme DA des backlinks acquis
  // Métadonnées
  createdAt                DateTime @default(now())

  @@index([date])
}

// Backlinks — tracking pitchs + acquisitions
model CeoBacklink {
  id             String          @id @default(cuid())
  source         BacklinkSource
  domain         String
  url            String?
  pageTitle      String?
  anchorText     String?
  da             Int?
  daReportedBy   String?         // "moz_free" | "hypothese" | "gsc"
  linkType       String?         // "dofollow" | "nofollow" | "unknown"
  status         BacklinkStatus  @default(PITCHED)
  relevanceScore Int?            // 1-10, score filtrage CEO
  pitchedAt      DateTime        @default(now())
  repliedAt      DateTime?
  acquiredAt     DateTime?
  verifiedAt     DateTime?
  notes          String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([status])
  @@index([domain])
}

// Log audit CNIL — rétention 3 ans obligatoire
model CeoAuditLog {
  id               String   @id @default(cuid())
  timestamp        DateTime @default(now())
  action           String   // "email_sent" | "dm_replied" | "backlink_pitched" | "task_contested"…
  targetType       String   // "user" | "journalist" | "blogger"
  targetIdHashed   String   // SHA256(email ou handle) — PII masqué
  channel          String
  aiDecisionScore  Int?
  aiModel          String?  // "haiku-4.5" | "sonnet-4.6" | "opus-4.7"
  outcome          String   // "sent" | "rejected" | "draft" | "error"
  contestedAt      DateTime?

  @@index([timestamp])
  @@index([targetIdHashed])
}

// Déduplication anti-spam 24h
model CeoDedup {
  id          String   @id @default(cuid())
  contentHash String   @unique // SHA256(destinataire + contenu_100chars)
  sentAt      DateTime @default(now())

  @@index([contentHash])
  @@index([sentAt])
}

// Blacklist commentaires proactifs
model CeoCommentBlacklist {
  id       String @id @default(cuid())
  handle   String
  platform String // "twitter" | "linkedin" | "instagram"
  reason   String // "humoriste_pro" | "influenceur_10k" | "journaliste"
}

// Enums CEO
enum CeoTaskType {
  SCORE_LEADS
  DRAFT_EMAIL
  DRAFT_DM_REPLY
  DRAFT_PROACTIVE_COMMENT
  DRAFT_BACKLINK_PITCH
  EXECUTE_SEND
  WEEKLY_REPORT
}

enum CeoTaskStatus {
  PENDING
  DRAFT      // outbound généré, attend validation admin
  APPROVED   // validé Director + (si S1/S2) admin
  EXECUTING
  DONE
  FAILED
}

enum CeoLeadStatus {
  COLD
  PENDING_ACTION
  IN_SEQUENCE
  CONVERTED
  OPT_OUT
}

enum CeoMessageStatus {
  PENDING
  APPROVED
  SENT
  REJECTED
  FAILED
}

enum CeoChannel {
  EMAIL
  DM_TWITTER
  DM_LINKEDIN
  DM_INSTAGRAM
  COMMENT_TWITTER
  BACKLINK_EMAIL
}

enum BacklinkSource {
  HARO
  BLOGGER
  PODCAST
  DIRECTORY
  EXCHANGE
  ORGANIC
}

enum BacklinkStatus {
  PITCHED
  REPLIED
  ACQUIRED
  REJECTED
  EXPIRED
}
```

---

### Extensions au modèle `User` existant (patch HAUTE Phase 3)

```prisma
model User {
  // ... champs existants
  lastCeoTouchpoint DateTime?  // dernière interaction CEO (envoi/réponse) — fenêtre attribution 7j
  emailOptOut       Boolean    @default(false)  // si true, le CEO ne contacte jamais
  // ... reste inchangé
}
```

Mise à jour de `lastCeoTouchpoint` à chaque `CeoOutboundMessage.sentAt` (trigger middleware ou helper `markCeoTouchpoint(userId)`).

## 3. Fonctions principales — `ceo-agent.ts`

```typescript
// Entry point cron — /api/cron/ceo-tick (2-4h)
async function ceoTick(): Promise<void>
// Lit CeoConfig.enabled → return immédiat si false
// Vérifie LlmUsageLog.dailyEur ≤ config.dailyBudgetEur (alerte > 3€)
// Ouvre les CeoTask.status = PENDING triées par scheduledFor
// Planifie max config.maxActionsPerTick actions (1-3)
// Pour chaque action : execute → log CeoAuditLog → update CeoTask.status
// Recalcule scores leads FREE actifs 30j → update CeoLead.score + status

// Triage messages inbound — Haiku 4.5 (~200 tokens)
async function triageInbound(message: InboundMessage): Promise<TriageResult>
// Score pertinence 1-10 (humour / répartie / soft skills / douleur cible)
// Si score ≥ 7 : crée CeoTask DRAFT_DM_REPLY ou DRAFT_EMAIL_REPLY
// Si score < 7 : CeoAuditLog + silence
// Vérifie CeoCommentBlacklist si source = commentaire proactif

// Rédaction email outbound — Sonnet 4.6 (~800-1200 tokens)
async function draftOutboundEmail(leadId: string, playbookId: PlaybookId): Promise<CeoOutboundMessage>
// Récupère CeoLead + User + JokeLike + UserPathProgress pour contexte
// Sélectionne template selon playbook P1-P7 révisé pivot session 8
// Génère email calibré étalons canoniques (3 étalons Thomas = cache ~10K tokens)
// Injecte footer légal enforceEmailFooter() obligatoire (red line 1)
// Vérifie User.emailOptOut synchrone avant génération
// Crée CeoOutboundMessage.status = PENDING → passe à validateCeoOutbound()

// Rédaction DM/réponse sociale — Sonnet 4.6 (~600-900 tokens)
async function draftSocialReply(message: InboundSocialMessage): Promise<CeoOutboundMessage>
// Calibré sur étalon 1 (DM Twitter) et étalon 2 (LinkedIn mention)
// Doctrine troll : si score hostilité > 7 → option silence (9.a) ou chaleur détachée (9.b)
// Rate limit vérification avant génération (CeoRateLimit par canal)
// Twitter : ≤ 270 chars · LinkedIn : ≤ 1300 chars · Instagram : ≤ 200 chars

// Rédaction commentaire proactif — Sonnet 4.6 (~600 tokens)
async function draftProactiveComment(postSignal: SocialSignal): Promise<CeoOutboundMessage>
// Trigger : keyword monitoring → triage Haiku score ≥ 7/10
// Vérifie CeoCommentBlacklist (humoristes, influenceurs > 10k, journalistes)
// Vérifie délai > 60 min depuis publication du post (anti-stalking)
// Vérifie rate limit ≤ 5 commentaires/jour global
// P6 — observation drôle sur la douleur + positionnement Deviens Marrant sans lien direct

// Génération pitch backlink — Sonnet 4.6 (~800-1000 tokens)
// Remplace haro-agent.ts + élargit à 5 canaux (presse, blogueur, podcast, annuaire, échange)
async function draftBacklinkPitch(opportunity: BacklinkOpportunity): Promise<CeoOutboundMessage>
// Filtre filterBacklinkOpportunities() sur BACKLINK_RELEVANT_TOPICS (96 topics migrés)
// Génère pitch calibré étalon 3 (HARO journaliste) ou templates B-E selon source
// Score pertinence 1-10 → si < 5 : archive sans envoi
// Crée CeoBacklink.status = PITCHED + CeoOutboundMessage
// Cap : 50 pitchs/semaine, 3 pitchs/domaine/an (red line SEO)

// Délégation validation au Stand-Up Director
async function validateCeoOutbound(messageId: string): Promise<DirectorVerdict>
// Réuse pattern validateSocialPost() — nouvelles gates CEO spécifiques
// Vérifie : valeur éducative > conversion, zéro surveillance visible, zéro FOMO
// Score ≥ 9 → APPROVED · 7-8 → NEEDS_REVISION · ≤ 6 → REJECTED
// Si 3 échecs → directorRewriteCeoMessage() + publication forcée
// Logs directorValidated: boolean sur CeoOutboundMessage

// Exécution envoi réel après approbation
async function executeApproved(messageId: string): Promise<ExecuteResult>
// Lit CeoOutboundMessage.channel → route vers le bon canal
// EMAIL → Resend resend.emails.send() (enforceEmailFooter() middleware)
// DM_TWITTER → Twitter API v2 direct_messages.write (OAuth dédié)
// COMMENT_TWITTER → Twitter API v2 tweets.create (reply)
// DM_LINKEDIN → placeholder drafts (risque ban → toujours DRAFT en prod)
// DM_INSTAGRAM → Instagram Graph API messages.create (fenêtre 24h)
// BACKLINK_EMAIL → Resend (base légale intérêt légitime, opt-out obligatoire)
// Vérif synchrone CeoDedup avant envoi (SHA256 hash 24h)
// Update CeoOutboundMessage.status = SENT + sentAt + externalId
// Insert CeoAuditLog

// Rapport hebdomadaire fondateur — Opus 4.7 (1×/semaine lundi 9h)
async function weeklyReport(weekStartDate: Date): Promise<void>
// Agrège métriques 7 jours : KPIs emails, DMs, backlinks, MRR delta, budget LLM
// Structure 4 sections fixes (scope Q8) : KPIs delta · ce qui a bien fonctionné · ce qui n'a pas fonctionné · observation pédagogique
// Ton factuel sobre — zéro édito narratif, zéro "cette semaine on a réalisé que..."
// Envoie à alex@deviens-marrant.fr via Resend
// Met à jour CeoMemory.key = "last_weekly_report"
```

---

### Outils de support (patch HAUTE Phase 3 — non modélisés Phase 1)

```typescript
// Lecture catalogue vannes — règle 2 du prompt système (vanne citée DOIT venir
// du seed). Sans cet outil, la règle est non-enforceable.
async function lookupJoke(opts: {
  category?: JokeCategory;
  type?: JokeType;
  maturityLevel?: number;
  limit?: number;
}): Promise<Joke[]>
// Lit prisma.joke.findMany WHERE isActive=true selon filtres + ORDER BY random()
// Renvoie 1-N vannes du catalogue réel — l'agent CEO cite UNIQUEMENT depuis cette source

// Lecture ressources éducatives (conseils, vidéos décryptées, parcours, articles blog)
// pour mention dans les emails et pitchs (cf règle "conseils > vannes")
async function lookupResource(opts: {
  type: "tip" | "video" | "path" | "blogArticle";
  topic?: string;        // mots-clés sémantiques
  limit?: number;
}): Promise<Resource[]>
// Lit prisma selon le type + match sémantique sur title/description
// Renvoie URL relative + titre + résumé court — pour CTA contextuel "On peut te
// partager X si tu as envie d'en savoir plus"
```

**Sécurité** : ces 2 outils sont en lecture seule, pas de mutation possible côté CEO.

## 4. Décisions autorisées vs non-autorisées

| Action | Statut | Condition |
|---|---|---|
| Envoyer email subscriber free/churner/premium | AUTORISÉ | `User.emailOptOut = false` + footer légal injecté + Director score ≥ 9 |
| Répondre DM inbound Twitter/LinkedIn/Instagram | AUTORISÉ | Initiative utilisateur + Director score ≥ 9 + délai < 4h (Twitter) / < 6h (LinkedIn) |
| Commenter sous post lambda Twitter | AUTORISÉ | Triage Haiku ≥ 7/10 + blacklist OK + délai > 1h + ≤ 5/jour + Director score ≥ 9 |
| Envoyer pitch backlink (presse, blogueur, podcast) | AUTORISÉ | Intérêt légitime RGPD art. 6.1.f + opt-out obligatoire + Director validé |
| Rapport hebdo Thomas | AUTORISÉ | Cron lundi 9h — toujours auto |
| DM outbound proactif (Twitter/LinkedIn/Instagram) | INTERDIT | Ban API + RGPD ToS plateformes — red line permanente |
| Email vers adresse non présente en DB ou CeoInbound | INTERDIT | Allowlist technique — blocage avant génération |
| Email vers `User.emailOptOut = true` | INTERDIT | Vérification synchrone au moment de l'envoi (pas de la planification) |
| Commenter sur post d'humoriste/influenceur/journaliste | INTERDIT | CeoCommentBlacklist — ban brand safety |
| Modifier pricing, annuler abonnement, accéder PII hors nécessité | INTERDIT | Scope CEO = communication uniquement |
| Commenter de façon proactive sur Instagram | INTERDIT | Pas de endpoint officiel Graph API — ToS violation |
| Envoyer sans footer opt-out | INTERDIT | enforceEmailFooter() middleware bloquant (red line 1) |

---

## 5. Garde-fous techniques

**1. Kill-switch DB-backed** : `CeoConfig.enabled = false` → `ceoTick()` retourne `{status: "disabled"}` immédiatement. Aucun bypass possible. Toggle depuis `/admin/ceo`. Raison tracée dans `CeoConfig.killSwitchReason`.

**2. Rate limits par canal** (table `CeoRateLimit` ou check DB en temps réel) :

| Canal | Limite horaire | Limite journalière |
|---|---|---|
| Email outbound | 20/h | 50/j |
| DM Twitter | 10/h | 30/j |
| DM LinkedIn | 5/h | 20/j |
| DM Instagram | 5/h | 20/j |
| Commentaires proactifs | — | 5/j global |
| Pitchs backlinks | — | 10/j (50/sem cap dur) |
| Email par subscriber | — | 1/14j (P0 légal CNIL) |
| Email par journaliste/blogueur | — | 1/60j (anti-spam presse) |

**3. Anti-loop** : `CeoTask.attempts` max 3 par task → `status = FAILED` au-delà. Déduplication `CeoDedup` : `SHA256(destinataire + content_tronqué_100chars)` stocké, blocage si même hash dans 24h.

**4. Allowlist destinataires** : le CEO ne peut adresser que (a) `User` avec `emailOptOut = false` présents en DB, ou (b) destinataires dont le message inbound est dans `CeoOutboundMessage.direction = inbound`. Zéro cold B2C scrappé.

**5. PII masking** : `maskPii(str)` dans tous les `console.log/error` du module CEO. `CeoAuditLog.targetIdHashed` = SHA256 uniquement — jamais d'email en clair dans les logs. Rétention `CeoAuditLog` : 3 ans (1 095 jours, obligation CNIL art. 30).

**6. Budget LLM** : si `LlmUsageLog.dailyEur > 3` (seuil alerte = 150% du cap) → alerte Resend vers `alex@deviens-marrant.fr` + throttle ceoTick (skip génération Sonnet, triage Haiku uniquement). Soft cap : 2€/jour. Hard stop : 4€/jour.

**7. Endpoint contestation RGPD art. 22** : `/api/ceo/contest` reçoit `{userId, ceoTaskId, reason}` → flag `CeoTask.contestedAt`, suspend toute action CEO sur ce userId 30 jours, envoie email Alex. Accessible depuis `/profil`.

---

## 6. Workflow drafts → auto-send progressif (4 semaines)

| Semaine | Emails subscribers | DMs inbound | Commentaires proactifs | Pitchs backlinks |
|---|---|---|---|---|
| **S1** | DRAFT — validation 1-clic `/admin/ceo` | DRAFT | DRAFT | DRAFT |
| **S2** | DRAFT | DRAFT | DRAFT | Auto-send HARO après Director ≥ 9 |
| **S3** | **Auto-send si Director ≥ 9** (après 50+ drafts validés sans correction majeure) | DRAFT | Auto-send Twitter si Director ≥ 9 | Auto-send tous pitchs après Director ≥ 9 |
| **S4** | Auto-send | **Auto-send DMs Twitter si Director ≥ 9** (après 30+ drafts validés) | Auto-send Twitter | Auto-send tous |
| **Mois 3+** | Auto-send | Auto-send Twitter | Auto-send Twitter | Auto-send tous |

**LinkedIn/Instagram** : toujours DRAFT (risque ban + zone grise ToS). `CeoConfig.autoSendDm` ne s'applique pas à ces canaux sans décision Thomas explicite.

**Critère de passage S2 → S3** : `CeoOutboundMessage WHERE status = SENT AND directorValidated = true AND (noMajorCorrection = true)` count ≥ 50 sur les emails. "Correction majeure" = message rejeté par Thomas après envoi auto (flag `CeoTask.requiresHumanReview`).

**Passage S3 → S4** : même logique, 30 DMs Twitter validés sans rejet.

**Dashboard `/admin/ceo`** : 5 vues obligatoires — timeline actions 24h, file drafts avec validation 1-clic, funnel CEO (free → leads scorés → actions → conversions), barre budget LLM jour (0→2€), tableau KPIs semaine.

---

## 7. Intégrations

| Service | Usage CEO | Secret Replit | Statut |
|---|---|---|---|
| **Resend** | Emails outbound (subscribers + RP) + rapport hebdo Thomas + alertes budget | `RESEND_API_KEY` | En place |
| **Twitter API v2** | Lecture DMs inbound + réponse + tweets.create (commentaires) | `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET` (OAuth 1.0a dédié CEO) | À créer Phase 5 |
| **LinkedIn API** | Lecture DMs inbound uniquement (réponse = DRAFT toujours) | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | À valider @legal avant Phase 5 |
| **Instagram Graph API** | Réponse DMs inbound Business (fenêtre 24h) | `INSTAGRAM_PAGE_ACCESS_TOKEN` | À créer Phase 5 |
| **Resend Inbound webhook** OU IMAP dédié | Réception emails `alex@deviens-marrant.fr` → `CeoOutboundMessage` inbound | `RESEND_WEBHOOK_SECRET` | À décider Phase 5 |
| **Buffer** | Non utilisé par le CEO (posts daily-social uniquement — canaux séparés option B) | — | N/A CEO |

**Note Twitter** : OAuth dédié CEO distinct du compte Buffer daily-social pour éviter les rate limits croisés. Scopes requis : `tweet.read`, `tweet.write`, `dm.read`, `dm.write`.

---

## 8. Tests à écrire (Jest)

**`ceo-agent.test.ts`** — comportement agent :
- `ceoTick` avec `CeoConfig.enabled = false` → return `{status: "disabled"}`, zéro DB write
- Kill-switch mid-tick (CeoConfig.enabled passe à false pendant l'exécution) → graceful stop
- Rate limit atteint (email > 50/j) → CeoTask.status = FAILED, CeoAuditLog INSERT
- Anti-loop : 3 attempts → status = FAILED, pas de 4e tentative
- Budget LLM > 3€ → skip génération Sonnet, alerte email Alex
- Scoring lead S1-S12 : combinaison de signaux → score correct + status PENDING_ACTION si ≥ 21

**`ceo-validate.test.ts`** — Director validation :
- Message avec anti-pattern "surveillance visible" → REJECTED
- Message avec FOMO marketing → REJECTED
- Message avec insight pédagogique + invitation sans pression → APPROVED
- Troll Twitter → doctrine détachée appliquée (9.b verbatim ou silence)
- 3 rejets Director → `directorRewriteCeoMessage()` appelée + message publié

**`ceo-playbooks.test.ts`** — conformité playbooks :
- P1 Welcome : structure étalon 2 Thomas respectée, zéro mention prix en hook
- P2 Réactivation : zéro pitch premium, valeur dans le corps
- P3 Conversion : limite premium en contexte factuel (jamais hook), prix cité 1 fois sobrement
- P4 Winback : zéro réduction, ton factuel sans culpabilisation
- P7 Fan : insight pédagogique offert directement, zéro CTA conversion

**`ceo-backlinks.test.ts`** — migration haro-agent + backlinks :
- `filterBacklinkOpportunities()` : 96 topics couverts, faux positifs < 5%
- `draftBacklinkPitch()` : score < 5 → archive sans créer CeoOutboundMessage
- Cap 3 pitchs/domaine/an respecté
- Création `CeoBacklink.status = PITCHED` à l'envoi

**Couverture cible** : 90%+ sur `ceo-agent.ts`. Mocks : jest.mock() pour Anthropic SDK, Resend, Twitter API, prisma.

---

## 9. Migration `haro-agent.ts` → suppression

**Contenu à migrer vers `ceo-agent.ts` module backlinks** :

| Élément | Source | Destination |
|---|---|---|
| `RELEVANT_TOPICS` (96 mots-clés) | `haro-agent.ts` | `ceo-agent.ts` constante `BACKLINK_RELEVANT_TOPICS` |
| `filterRelevantOpportunities()` | `haro-agent.ts` | `filterBacklinkOpportunities()` élargi 5 canaux |
| `generateHaroResponse()` | `haro-agent.ts` | `generatePressResponse()` calibré étalon 3 |
| `buildHaroSystemPrompt()` | `haro-agent.ts` | Section backlinks du system prompt global CEO |
| `ALEX_BIO` | `haro-agent.ts` | `EXPERT_BIO` constante |
| `HaroOpportunity` / `HaroResponse` / `HaroFilterResult` | types | `BacklinkOpportunity` / `BacklinkResponse` / `BacklinkFilterResult` |
| Tests `haro-agent.test.ts` | `__tests__/lib/` | `ceo-backlinks.test.ts` — renommage imports + 4 nouveaux tests |

**Fichiers à supprimer** (Phase 5 @fullstack) :
- `apps/web/src/lib/ai/agents/haro-agent.ts`
- `apps/web/src/app/api/cron/haro/route.ts`
- Section "Agent HARO" dans `CLAUDE.md` → remplacer par "Module backlinks CEO"

**Grep obligatoire avant suppression** :
```bash
grep -r "haro-agent\|runHaroPipeline\|processHaroOpportunities\|HaroOpportunity" \
  apps/web/src/ --include="*.ts" --include="*.tsx"
```
Appels connus : uniquement `api/cron/haro/route.ts` → supprimé. Aucun appel résiduel détecté à ce jour.

---

## 10. Critères de done Phase 3 specs

- [x] 6 modèles Prisma définis avec champs + types + indices (+ 3 modèles auxiliaires : CeoDedup, CeoAuditLog, CeoCommentBlacklist)
- [x] 8 fonctions principales définies avec signature + comportement + modèles LLM
- [x] Tableau autorisé/non-autorisé exhaustif (13 entrées)
- [x] 7 garde-fous techniques (kill-switch, rate limits, anti-loop, allowlist, PII masking, budget LLM, contestation art. 22)
- [x] Workflow drafts → auto-send 4 semaines documenté avec critères de passage
- [x] 4 fichiers de tests Jest spécifiés (ceo-agent, ceo-validate, ceo-playbooks, ceo-backlinks) avec cas précis

---

## Handoffs

---

**Handoff → @ia v2 (Phase 3 — architecture prompt système CEO)**

Fichiers produits : `docs/product/ceo-agent-specs.md`

Le prompt système CEO doit être construit en **3 blocs en cache Anthropic** (~10K tokens stables) :

1. **Identité et mission** (~1K tokens) : pivot valeur éducative + phrase de mission v3 + règles permanentes (zéro DM outbound, zéro surveillance visible, zéro FOMO, zéro pub déguisée)
2. **Voix et étalons** (~3K tokens) : 3 étalons canoniques Thomas verbatim (étalon 1 DM Twitter, étalon 2 Welcome email, étalon 3 HARO journaliste) + 5 anti-patterns verbatim (section 5 ceo-voice-unified.md) + vocabulaire prescrit/banni + doctrine troll
3. **Contexte backlinks** (~1K tokens) : glossaire DA/DR/anchor text (section 4 ceo-backlinks-strategy.md) + templates A-E + red lines SEO (PBN, achat liens, anchor suroptimisé)

Variables dynamiques injectées par tick (pas en cache) : context lead (CeoLead + User signals), playbook sélectionné, historique récent (derniers 3 touchpoints), scoring semaine.

Contraintes @ia à intégrer dans le prompt : "Tu n'envoies jamais à une adresse hors DB ou CeoInbound", "Tu vérifies emailOptOut synchrone avant tout draft email", "Tu rends compte dans CeoAuditLog de chaque action avec aiDecisionScore et aiModel", "Tu ne génères aucun email sans footer légal disponible".

---

**Handoff → @data-analyst (Phase 3 — KPIs Prisma à instrumenter)**

KPIs prioritaires dès J1 :
- **Attribution CEO** : `CeoOutboundMessage.sentAt` → `Subscription.createdAt` dans fenêtre **7 jours** (validé Thomas Q-Phase3-1 le 06/05/2026 — la fenêtre reflète le cycle de décision réel à 0,99€). Tracking UTM auto-injecté sur tous les liens : `utm_source=ceo`, `utm_campaign=<playbookId>`, `utm_medium=<channel>`. Middleware sur `User.update()` qui change `User.plan = PREMIUM` ET `User.lastCeoTouchpoint < 7d` → log `CeoAuditLog.action = "conversion_attributed"`.
- **North Star engagement** : `CeoOutboundMessage.opens + replies + clicks` / total envoyés, par canal et playbook, sur 30j glissants
- **Budget LLM** : `LlmUsageLog WHERE agent = 'ceo'` sum daily + alerte > 2€
- **Score lead distribution** : `CeoLead.score` buckets (0-10, 11-20, 21-35, 36-50) — santé du funnel
- **Taux retour site 48h** : `User.lastActiveAt` dans 48h post `CeoOutboundMessage.sentAt`
- **Backlinks** : `CeoBacklink.status = ACQUIRED` count × da moyen, par semaine
- **Taux de passage S1→S4** : `CeoOutboundMessage WHERE directorValidated = true` cumul par semaine

---

**Handoff → @fullstack Phase 5 — checklist exécutable**

P0 (bloquant avant S3 auto-send) :
- [ ] Migration Prisma : `npx prisma migrate dev --name add_ceo_agent` (6 modèles + 3 auxiliaires + enums)
- [ ] `enforceEmailFooter()` middleware Resend — bloquant si footer absent
- [ ] Kill-switch `CeoConfig.enabled` check dans `/api/cron/ceo-tick`
- [ ] Vérification synchrone `User.emailOptOut` avant tout envoi
- [ ] `CeoAuditLog` INSERT sur chaque action CEO (rétention 3 ans)
- [ ] Endpoint `/api/ceo/contest` (art. 22 RGPD)
- [ ] Allowlist destinataires bloquant hors DB

P1 (avant fin S1) :
- [ ] Rate limits par canal (`CeoRateLimit` table ou check DB)
- [ ] `CeoDedup` déduplication SHA256 24h
- [ ] `CeoCommentBlacklist` seed initial (humoristes FR, influenceurs > 10k, journalistes)
- [ ] `maskPii()` dans tous les console.log CEO
- [ ] Champ `from` Resend : `Marrant <contact@deviens-marrant.fr>`
- [ ] Twitter API v2 OAuth dédié CEO (DMs + commentaires)
- [ ] Dashboard `/admin/ceo` (5 vues : timeline, file drafts, funnel, budget LLM, KPIs sem)

P2 (mois 2) :
- [ ] Migration `haro-agent.ts` → `ceo-agent.ts` module backlinks (9 fonctions renommées)
- [ ] Suppression `haro-agent.ts` + `api/cron/haro/route.ts` après Grep
- [ ] Update `CLAUDE.md` section HARO → section "Module backlinks CEO"
- [ ] Instagram Graph API (DMs inbound Business — fenêtre 24h)
- [ ] `/api/user/delete` propagation vers CeoMemory + CeoLead + CeoOutboundMessage
- [ ] DPA Anthropic + Resend + Replit vérifiés et signés (bloquer S3 si absent)

---

**Handoff → @reviewer — zones à challenger en priorité**

1. **Scoring lead S1-S12** : le signal S3 (limite blagues touchée) est un front signal non DB-persistant. Vérifier avec @fullstack comment le tracker de façon fiable sans compter les page views côté serveur.
2. **P3 conversion soft refondé** : le trigger "streak ≥ 3 + likes ≥ 5" peut déclencher P3 ET P7 simultanément pour le même lead. Règle de priorité manquante — P7 doit primer (valeur avant conversion).
3. **Workflow S3 critère "50 drafts sans correction majeure"** : définition de "correction majeure" = rejet Thomas post-envoi auto (flag `requiresHumanReview`). Ce flag n'est pas encore modélisé sur `CeoOutboundMessage` — à ajouter.
4. **LinkedIn commentaires proactifs** : scope.md dit AUTORISÉ (commentaires lambda), legal.md dit ZONE GRISE ToS. Contradiction non résolue → ces specs documentent LinkedIn = DRAFT permanent jusqu'à validation @legal explicite.
5. **Mention IA dans la signature** : décision Thomas requise avant S3 (défaut = OUI, EU AI Act art. 52). À documenter dans project-context.md comme décision binaire bloquante.
