-- Lettre mensuelle gratuite s21 (17/10/2026) : numéros préparés, journal d'envoi,
-- préférence de la lettre hebdomadaire Premium (exclusion de la mensuelle),
-- horodatage du dernier e-mail de confirmation.
-- Idempotente : rejouable sans erreur (CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS,
-- enums et contraintes dans des blocs DO ... duplicate_object). À jouer 2 fois : la 2e passe doit réussir.
-- Additive, sauf l'effacement des agents utilisateurs déjà stockés (@legal L4 ; 0 inscrit attendu).
-- NE PAS jouer avant le feu vert (voir REPLIT_ACTIONS.md).

-- Enums
DO $$ BEGIN
  CREATE TYPE "NewsletterAudience" AS ENUM ('MENSUELLE', 'HEBDO_PREMIUM');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "NewsletterIssueStatus" AS ENUM ('BROUILLON', 'VALIDE', 'ENVOYE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE "NewsletterSendStatus" AS ENUM ('RESERVE', 'ENVOYE', 'ECHEC');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- NewsletterSubscriber : dernier e-mail de confirmation envoyé (délai de renvoi)
ALTER TABLE "NewsletterSubscriber" ADD COLUMN IF NOT EXISTS "confirmationSentAt" TIMESTAMP(3);
ALTER TABLE "NewsletterSubscriber" ADD COLUMN IF NOT EXISTS "confirmationSendCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NewsletterSubscriber" ADD COLUMN IF NOT EXISTS "reconfirmRequestedAt" TIMESTAMP(3);
-- @legal L4 : plus d'agent utilisateur ni d'IP en clair (0 inscrit attendu ; rejouable sans effet).
UPDATE "NewsletterSubscriber" SET "userAgent" = NULL WHERE "userAgent" IS NOT NULL;

-- NewsletterIssue : numéros préparés à l'avance
CREATE TABLE IF NOT EXISTS "NewsletterIssue" (
    "id" TEXT NOT NULL,
    "audience" "NewsletterAudience" NOT NULL DEFAULT 'MENSUELLE',
    "periodKey" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "bodyText" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "NewsletterIssueStatus" NOT NULL DEFAULT 'BROUILLON',
    "validatedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterIssue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "audience" "NewsletterAudience" NOT NULL DEFAULT 'MENSUELLE';
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "periodKey" TEXT NOT NULL;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "subject" TEXT NOT NULL;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "preheader" TEXT;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "bodyText" TEXT NOT NULL;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3) NOT NULL;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "status" "NewsletterIssueStatus" NOT NULL DEFAULT 'BROUILLON';
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "validatedAt" TIMESTAMP(3);
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP(3);
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterIssue_audience_periodKey_key" ON "NewsletterIssue"("audience", "periodKey");
CREATE INDEX IF NOT EXISTS "NewsletterIssue_status_scheduledFor_idx" ON "NewsletterIssue"("status", "scheduledFor");

-- NewsletterSend : journal d'envoi (une ligne par numéro et destinataire)
CREATE TABLE IF NOT EXISTS "NewsletterSend" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "NewsletterSendStatus" NOT NULL DEFAULT 'RESERVE',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSend_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "issueId" TEXT NOT NULL;
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL;
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "status" "NewsletterSendStatus" NOT NULL DEFAULT 'RESERVE';
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "error" TEXT;
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP(3);
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "NewsletterSend" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSend_issueId_email_key" ON "NewsletterSend"("issueId", "email");
CREATE INDEX IF NOT EXISTS "NewsletterSend_issueId_status_idx" ON "NewsletterSend"("issueId", "status");
DO $$ BEGIN
  ALTER TABLE "NewsletterSend" ADD CONSTRAINT "NewsletterSend_issueId_fkey"
    FOREIGN KEY ("issueId") REFERENCES "NewsletterIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- PremiumLetterPreference : lettre hebdomadaire Premium (préférence seulement)
CREATE TABLE IF NOT EXISTS "PremiumLetterPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "consentVersion" TEXT,
    "stoppedAt" TIMESTAMP(3),
    "stopOrigin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumLetterPreference_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "activatedAt" TIMESTAMP(3);
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "consentVersion" TEXT;
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "stoppedAt" TIMESTAMP(3);
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "stopOrigin" TEXT;
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "PremiumLetterPreference_userId_key" ON "PremiumLetterPreference"("userId");
CREATE INDEX IF NOT EXISTS "PremiumLetterPreference_enabled_idx" ON "PremiumLetterPreference"("enabled");
DO $$ BEGIN
  ALTER TABLE "PremiumLetterPreference" ADD CONSTRAINT "PremiumLetterPreference_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
