-- Migration 6 : fix bugs latents Phase 5 mobile (PushToken absent + WebhookEvent.eventId absent)
-- Idempotente : peut être rejouée sans casser une DB déjà partiellement migrée.
-- Découverte : tsc --noEmit Phase 5.A déploiement (rapport Thomas s9).

-- ===========================================================================
-- 1. WebhookEvent : ajouter eventId UNIQUE + provider + eventType + receivedAt
-- ===========================================================================
-- Contexte : le code revenuecat-webhook utilise where: { eventId } et insert
-- avec { eventId, provider, eventType, receivedAt } mais le schema n'avait que
-- "id". Pour ne pas casser les rows Stripe existants, on ajoute eventId comme
-- nouvelle colonne (UNIQUE) et on backfill depuis "id" pour les rows existants.

ALTER TABLE "WebhookEvent" ADD COLUMN IF NOT EXISTS "eventId" TEXT;
UPDATE "WebhookEvent" SET "eventId" = "id" WHERE "eventId" IS NULL;
ALTER TABLE "WebhookEvent" ALTER COLUMN "eventId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");

ALTER TABLE "WebhookEvent" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "WebhookEvent" ADD COLUMN IF NOT EXISTS "eventType" TEXT;
ALTER TABLE "WebhookEvent" ADD COLUMN IF NOT EXISTS "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "WebhookEvent_provider_eventType_idx" ON "WebhookEvent"("provider", "eventType");

-- ===========================================================================
-- 2. PushToken : nouveau modèle (oublié Phase 5 mobile session 7)
-- ===========================================================================
-- Référencé par apps/web/src/app/api/cron/daily-push/route.ts et
-- apps/web/src/app/api/push/register-token/route.ts depuis le 03/05/2026
-- mais jamais ajouté au schema (ignoreBuildErrors masquait l'erreur en prod).

CREATE TABLE IF NOT EXISTS "PushToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PushToken_token_key" ON "PushToken"("token");
CREATE INDEX IF NOT EXISTS "PushToken_userId_idx" ON "PushToken"("userId");
CREATE INDEX IF NOT EXISTS "PushToken_lastSeenAt_idx" ON "PushToken"("lastSeenAt");
CREATE INDEX IF NOT EXISTS "PushToken_platform_idx" ON "PushToken"("platform");

DO $$ BEGIN
    ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
