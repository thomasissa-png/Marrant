-- Espace client (s24, lot D3) : "EspaceCompte", réglages de l'abonné dans l'espace (réponse C9
-- « Où veux-tu être plus à l'aise ? », situation de rencontre servie). Une ligne par compte au plus,
-- supprimée avec le compte. Table neuve, aucune table existante modifiée, aucune donnée écrite.
-- Idempotente : à jouer 2 fois, la 2e passe doit réussir. À jouer AVANT le déploiement du code.

CREATE TABLE IF NOT EXISTS "EspaceCompte" (
    "userId" TEXT NOT NULL,
    "aise" TEXT,
    "aiseLe" TIMESTAMP(3),
    "rencontreServieLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EspaceCompte_pkey" PRIMARY KEY ("userId")
);

ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "aise" TEXT;
ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "aiseLe" TIMESTAMP(3);
ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "rencontreServieLe" TIMESTAMP(3);
ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$ BEGIN
  ALTER TABLE "EspaceCompte" ADD CONSTRAINT "EspaceCompte_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EspaceCompte" ADD CONSTRAINT "EspaceCompte_aise_check"
    CHECK ("aise" IS NULL OR "aise" IN ('POTES', 'BOULOT', 'PLAIRE', 'PARTOUT'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;
