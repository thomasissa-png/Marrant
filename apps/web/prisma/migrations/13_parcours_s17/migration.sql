-- Parcours d'apprentissage s17 (07/10/2026) : dates par étape, retours d'exercice,
-- rappel e-mail sur demande, série de jours sur la pratique.
-- Idempotente : rejouable sans erreur (CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS,
-- contraintes dans des blocs DO ... duplicate_object). À jouer 2 fois : la 2e passe doit réussir.
-- Additive uniquement : aucune donnée existante modifiée.

-- Niveaux : déjà présents en base (pg_enum, audit s17 FS-07), rejoué par sécurité.
ALTER TYPE "UserLevel" ADD VALUE IF NOT EXISTS 'COMIQUE';
ALTER TYPE "UserLevel" ADD VALUE IF NOT EXISTS 'LEGENDE';

-- User : date de la dernière pratique (série de jours, D3)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastPracticeAt" TIMESTAMP(3);

-- UserPathStepCompletion : une ligne par (utilisateur, parcours, étape)
CREATE TABLE IF NOT EXISTS "UserPathStepCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPathStepCompletion_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "UserPathStepCompletion" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "UserPathStepCompletion" ADD COLUMN IF NOT EXISTS "learningPathId" TEXT NOT NULL;
ALTER TABLE "UserPathStepCompletion" ADD COLUMN IF NOT EXISTS "stepOrder" INTEGER NOT NULL;
ALTER TABLE "UserPathStepCompletion" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE UNIQUE INDEX IF NOT EXISTS "UserPathStepCompletion_userId_learningPathId_stepOrder_key"
    ON "UserPathStepCompletion"("userId", "learningPathId", "stepOrder");
CREATE INDEX IF NOT EXISTS "UserPathStepCompletion_completedAt_idx" ON "UserPathStepCompletion"("completedAt");
DO $$ BEGIN
  ALTER TABLE "UserPathStepCompletion" ADD CONSTRAINT "UserPathStepCompletion_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE "UserPathStepCompletion" ADD CONSTRAINT "UserPathStepCompletion_learningPathId_fkey"
    FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- UserPathStepFeedback : retour facultatif, 3 valeurs fermées (avis @legal C13)
CREATE TABLE IF NOT EXISTS "UserPathStepFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "retour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPathStepFeedback_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "learningPathId" TEXT NOT NULL;
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "stepOrder" INTEGER NOT NULL;
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "retour" TEXT NOT NULL;
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "UserPathStepFeedback" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "UserPathStepFeedback_userId_learningPathId_stepOrder_key"
    ON "UserPathStepFeedback"("userId", "learningPathId", "stepOrder");
DO $$ BEGIN
  ALTER TABLE "UserPathStepFeedback" ADD CONSTRAINT "UserPathStepFeedback_retour_check"
    CHECK ("retour" IN ('pas-essaye', 'essaye-bof', 'essaye-ca-a-marche'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE "UserPathStepFeedback" ADD CONSTRAINT "UserPathStepFeedback_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  ALTER TABLE "UserPathStepFeedback" ADD CONSTRAINT "UserPathStepFeedback_learningPathId_fkey"
    FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ParcoursReminderPreference : rappel sur demande (D7), désactivé par défaut
CREATE TABLE IF NOT EXISTS "ParcoursReminderPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "weekday" INTEGER NOT NULL DEFAULT 1,
    "activatedAt" TIMESTAMP(3),
    "consentVersion" TEXT,
    "stoppedAt" TIMESTAMP(3),
    "stopOrigin" TEXT,
    "lastSentWeek" TEXT,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParcoursReminderPreference_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "weekday" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "activatedAt" TIMESTAMP(3);
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "consentVersion" TEXT;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "stoppedAt" TIMESTAMP(3);
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "stopOrigin" TEXT;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "lastSentWeek" TEXT;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "lastSentAt" TIMESTAMP(3);
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ParcoursReminderPreference" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "ParcoursReminderPreference_userId_key" ON "ParcoursReminderPreference"("userId");
CREATE INDEX IF NOT EXISTS "ParcoursReminderPreference_enabled_weekday_idx" ON "ParcoursReminderPreference"("enabled", "weekday");
DO $$ BEGIN
  ALTER TABLE "ParcoursReminderPreference" ADD CONSTRAINT "ParcoursReminderPreference_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
