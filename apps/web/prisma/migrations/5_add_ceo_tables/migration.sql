-- Migration 5_add_ceo_tables — CEO Agent Phase 5 + P1 race condition lock social
-- Idempotente : utilise IF NOT EXISTS sur tables et colonnes pour pouvoir être rejouée.
-- cf docs/product/ceo-agent-specs.md §2 et docs/ia/ceo-agent-architecture.md

-- ─── Extensions au modèle User existant ────────────────────────────
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastCeoTouchpoint" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailOptOut" BOOLEAN NOT NULL DEFAULT false;

-- ─── P1 s08/04 — Lock idempotent journalier social ─────────────────
CREATE TABLE IF NOT EXISTS "SocialPostDailyLock" (
    "id" TEXT NOT NULL,
    "dateUTC" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialPostDailyLock_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SocialPostDailyLock_dateUTC_key" ON "SocialPostDailyLock"("dateUTC");

-- ─── Enums CEO ─────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "CeoTaskType" AS ENUM ('SCORE_LEADS', 'DRAFT_EMAIL', 'DRAFT_DM_REPLY', 'DRAFT_PROACTIVE_COMMENT', 'DRAFT_BACKLINK_PITCH', 'EXECUTE_SEND', 'WEEKLY_REPORT', 'KPI_SNAPSHOT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoTaskStatus" AS ENUM ('PENDING', 'RUNNING', 'DRAFT', 'APPROVED', 'EXECUTING', 'DONE', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoLeadStatus" AS ENUM ('COLD', 'PENDING_ACTION', 'IN_SEQUENCE', 'CONVERTED', 'OPT_OUT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoOutboundStatus" AS ENUM ('PENDING', 'APPROVED', 'SENT', 'REJECTED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoOutboundChannel" AS ENUM ('EMAIL', 'DM_TWITTER', 'DM_LINKEDIN', 'DM_INSTAGRAM', 'COMMENT_TWITTER', 'BACKLINK_EMAIL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoOutboundDirection" AS ENUM ('OUTBOUND', 'INBOUND');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoBacklinkSource" AS ENUM ('HARO', 'BLOGGER', 'PODCAST', 'DIRECTORY', 'EXCHANGE', 'ORGANIC');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CeoBacklinkStatus" AS ENUM ('PITCHED', 'REPLIED', 'ACQUIRED', 'REJECTED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── CeoConfig ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoConfig" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "dailyBudgetEur" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "maxActionsPerTick" INTEGER NOT NULL DEFAULT 3,
    "autoSendEmail" BOOLEAN NOT NULL DEFAULT false,
    "autoSendDm" BOOLEAN NOT NULL DEFAULT false,
    "killSwitchReason" TEXT,
    "socialOutboundEnabled" BOOLEAN NOT NULL DEFAULT false,
    "dryRun" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CeoConfig_pkey" PRIMARY KEY ("id")
);

-- ─── CeoTask ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoTask" (
    "id" TEXT NOT NULL,
    "type" "CeoTaskType" NOT NULL,
    "status" "CeoTaskStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "contestedAt" TIMESTAMP(3),
    "result" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "CeoTask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CeoTask_status_idx" ON "CeoTask"("status");
CREATE INDEX IF NOT EXISTS "CeoTask_scheduledFor_idx" ON "CeoTask"("scheduledFor");
CREATE INDEX IF NOT EXISTS "CeoTask_type_idx" ON "CeoTask"("type");

-- ─── CeoMemory ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoMemory" (
    "id" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CeoMemory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CeoMemory_namespace_key_key" ON "CeoMemory"("namespace", "key");
CREATE INDEX IF NOT EXISTS "CeoMemory_namespace_idx" ON "CeoMemory"("namespace");
CREATE INDEX IF NOT EXISTS "CeoMemory_expiresAt_idx" ON "CeoMemory"("expiresAt");

-- ─── CeoLead ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoLead" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "socialHandle" TEXT,
    "source" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "signals" JSONB NOT NULL DEFAULT '{}',
    "status" "CeoLeadStatus" NOT NULL DEFAULT 'COLD',
    "lastContactAt" TIMESTAMP(3),
    "lastPlaybook" TEXT,
    "touchpoints" INTEGER NOT NULL DEFAULT 0,
    "optOut" BOOLEAN NOT NULL DEFAULT false,
    "history" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CeoLead_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CeoLead_userId_key" ON "CeoLead"("userId");
CREATE INDEX IF NOT EXISTS "CeoLead_status_idx" ON "CeoLead"("status");
CREATE INDEX IF NOT EXISTS "CeoLead_score_idx" ON "CeoLead"("score");
CREATE INDEX IF NOT EXISTS "CeoLead_userId_idx" ON "CeoLead"("userId");

-- ─── CeoOutboundMessage ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoOutboundMessage" (
    "id" TEXT NOT NULL,
    "channel" "CeoOutboundChannel" NOT NULL,
    "direction" "CeoOutboundDirection" NOT NULL DEFAULT 'OUTBOUND',
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "status" "CeoOutboundStatus" NOT NULL DEFAULT 'PENDING',
    "directorScore" INTEGER,
    "directorValidated" BOOLEAN NOT NULL DEFAULT false,
    "directorNote" TEXT,
    "playbook" TEXT,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "opens" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "repliedAt" TIMESTAMP(3),
    "externalId" TEXT,
    "leadId" TEXT,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmMedium" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CeoOutboundMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CeoOutboundMessage_status_idx" ON "CeoOutboundMessage"("status");
CREATE INDEX IF NOT EXISTS "CeoOutboundMessage_channel_idx" ON "CeoOutboundMessage"("channel");
CREATE INDEX IF NOT EXISTS "CeoOutboundMessage_leadId_idx" ON "CeoOutboundMessage"("leadId");
CREATE INDEX IF NOT EXISTS "CeoOutboundMessage_sentAt_idx" ON "CeoOutboundMessage"("sentAt");
CREATE INDEX IF NOT EXISTS "CeoOutboundMessage_direction_idx" ON "CeoOutboundMessage"("direction");

-- ─── CeoKpiSnapshot ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoKpiSnapshot" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "northStarEngagement30d" DOUBLE PRECISION NOT NULL,
    "emailReplyRate" DOUBLE PRECISION NOT NULL,
    "siteReturn48h" DOUBLE PRECISION NOT NULL,
    "emailOpenRate" DOUBLE PRECISION NOT NULL,
    "killSwitchTriggers24h" INTEGER NOT NULL,
    "directorFailRate" DOUBLE PRECISION NOT NULL,
    "draftsAutoSendRatio" JSONB NOT NULL,
    "costPerAcquiredSubscriber" DOUBLE PRECISION,
    "ceoAttributedConversions" INTEGER NOT NULL,
    "backlinksDaSum" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CeoKpiSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CeoKpiSnapshot_date_key" ON "CeoKpiSnapshot"("date");
CREATE INDEX IF NOT EXISTS "CeoKpiSnapshot_date_idx" ON "CeoKpiSnapshot"("date");

-- ─── CeoBacklink ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoBacklink" (
    "id" TEXT NOT NULL,
    "source" "CeoBacklinkSource" NOT NULL,
    "domain" TEXT NOT NULL,
    "url" TEXT,
    "pageTitle" TEXT,
    "anchorText" TEXT,
    "da" INTEGER,
    "daReportedBy" TEXT,
    "linkType" TEXT,
    "status" "CeoBacklinkStatus" NOT NULL DEFAULT 'PITCHED',
    "relevanceScore" INTEGER,
    "pitchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repliedAt" TIMESTAMP(3),
    "acquiredAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CeoBacklink_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CeoBacklink_status_idx" ON "CeoBacklink"("status");
CREATE INDEX IF NOT EXISTS "CeoBacklink_domain_idx" ON "CeoBacklink"("domain");
CREATE INDEX IF NOT EXISTS "CeoBacklink_source_idx" ON "CeoBacklink"("source");

-- ─── CeoAuditLog ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoAuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetIdHashed" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "aiDecisionScore" INTEGER,
    "aiModel" TEXT,
    "reasoning" TEXT,
    "outcome" TEXT NOT NULL,
    "errorMessage" TEXT,
    "contestedAt" TIMESTAMP(3),
    CONSTRAINT "CeoAuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CeoAuditLog_timestamp_idx" ON "CeoAuditLog"("timestamp");
CREATE INDEX IF NOT EXISTS "CeoAuditLog_targetIdHashed_idx" ON "CeoAuditLog"("targetIdHashed");
CREATE INDEX IF NOT EXISTS "CeoAuditLog_action_idx" ON "CeoAuditLog"("action");

-- ─── CeoDedup ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoDedup" (
    "id" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CeoDedup_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CeoDedup_contentHash_key" ON "CeoDedup"("contentHash");
CREATE INDEX IF NOT EXISTS "CeoDedup_contentHash_idx" ON "CeoDedup"("contentHash");
CREATE INDEX IF NOT EXISTS "CeoDedup_sentAt_idx" ON "CeoDedup"("sentAt");

-- ─── CeoCommentBlacklist ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CeoCommentBlacklist" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CeoCommentBlacklist_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CeoCommentBlacklist_handle_platform_key" ON "CeoCommentBlacklist"("handle", "platform");
CREATE INDEX IF NOT EXISTS "CeoCommentBlacklist_platform_idx" ON "CeoCommentBlacklist"("platform");

-- ─── Foreign keys ──────────────────────────────────────────────────
DO $$ BEGIN
  ALTER TABLE "CeoLead" ADD CONSTRAINT "CeoLead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "CeoOutboundMessage" ADD CONSTRAINT "CeoOutboundMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CeoLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
