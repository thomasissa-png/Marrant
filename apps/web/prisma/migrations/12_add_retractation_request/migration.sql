-- Demandes de rétractation (14 jours, L.221-18) envoyées depuis /retractation (s16, 07/10/2026).
-- Idempotente : rejouable sans erreur (CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS).
-- Additive uniquement : aucune table existante modifiée.

CREATE TABLE IF NOT EXISTS "RetractationRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "motif" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECUE',
    "ipHash" TEXT,
    "adminEmailedAt" TIMESTAMP(3),
    "ackEmailedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetractationRequest_pkey" PRIMARY KEY ("id")
);

-- Colonnes du CREATE rejouées une à une (table éventuellement créée avec un schéma minimal)
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL;
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "purchaseDate" TIMESTAMP(3);
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "motif" TEXT;
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'RECUE';
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "ipHash" TEXT;
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "adminEmailedAt" TIMESTAMP(3);
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "ackEmailedAt" TIMESTAMP(3);
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "RetractationRequest" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;

CREATE INDEX IF NOT EXISTS "RetractationRequest_email_createdAt_idx" ON "RetractationRequest"("email", "createdAt");
CREATE INDEX IF NOT EXISTS "RetractationRequest_status_idx" ON "RetractationRequest"("status");
