-- s15 cycle 3 (05/10/2026) : chaîne de publication sociale (K7).
-- Additive et idempotente (rejouable : tester 2 fois de suite).
--  1. Interrupteur Pause / Reprise par réseau (table SocialPlatformSetting),
--     les 3 réseaux EN PAUSE à la création : rien ne part avant validation de Thomas.
--  2. SocialPost : URL des slides de carrousel, dernier statut Buffer relu,
--     date de relecture, date d'envoi de l'alerte d'anomalie.

-- 1. Interrupteur
CREATE TABLE IF NOT EXISTS "SocialPlatformSetting" (
    "platform" "SocialPlatform" NOT NULL,
    "paused" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "changedBy" TEXT,
    "pausedAt" TIMESTAMP(3),
    "alertSentAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialPlatformSetting_pkey" PRIMARY KEY ("platform")
);
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "paused" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "reason" TEXT;
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "changedBy" TEXT;
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "alertSentAt" TIMESTAMP(3);
ALTER TABLE "SocialPlatformSetting" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- État initial : les 3 réseaux en pause. ON CONFLICT DO NOTHING : une 2e
-- exécution ne réactive ni ne remet en pause un réseau déjà réglé dans l'admin.
INSERT INTO "SocialPlatformSetting" ("platform", "paused", "reason", "changedBy", "pausedAt", "updatedAt")
VALUES
    ('TWITTER', true, 'Relance s15 : en pause jusqu''à validation des posts modèles par Thomas.', 'migration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('INSTAGRAM', true, 'Relance s15 : en pause jusqu''à validation des posts modèles par Thomas.', 'migration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('LINKEDIN', true, 'Relance s15 : en pause jusqu''à validation des posts modèles par Thomas.', 'migration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("platform") DO NOTHING;

-- 2. SocialPost
ALTER TABLE "SocialPost" ADD COLUMN IF NOT EXISTS "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "SocialPost" ADD COLUMN IF NOT EXISTS "bufferStatus" TEXT;
ALTER TABLE "SocialPost" ADD COLUMN IF NOT EXISTS "bufferCheckedAt" TIMESTAMP(3);
ALTER TABLE "SocialPost" ADD COLUMN IF NOT EXISTS "alertedAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "SocialPost_bufferStatus_idx" ON "SocialPost"("bufferStatus");
