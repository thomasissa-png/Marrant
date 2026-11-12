-- Mesure d'usage serveur (s24, lot 0 de l'espace client ; R3 de l'analyse s23, bloc B du plan onboarding).
-- Une table neuve, "UsageEvent" : une ligne par événement (compte, type d'une liste fermée, date, détail
-- fermé non personnel, clé d'unicité). Ni texte libre, ni e-mail, ni IP. Aucune table existante modifiée,
-- aucune donnée écrite.
-- Idempotente : rejouable sans erreur (CREATE TABLE / ADD COLUMN / INDEX IF NOT EXISTS, contrainte
-- en bloc DO). À jouer 2 fois : la 2e passe doit réussir.
-- À jouer AVANT le déploiement du code : sans elle, chaque écriture échoue en silence (la requête de
-- l'abonné réussit quand même, mais rien n'est mesuré). L'ancien code l'ignore : aucun retour arrière
-- nécessaire (la table peut rester).

CREATE TABLE IF NOT EXISTS "UsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "detail" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dedupKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "detail" TEXT;
ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "dedupKey" TEXT;
ALTER TABLE "UsageEvent" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "UsageEvent_dedupKey_key" ON "UsageEvent"("dedupKey");
CREATE INDEX IF NOT EXISTS "UsageEvent_userId_type_occurredAt_idx" ON "UsageEvent"("userId", "type", "occurredAt");
CREATE INDEX IF NOT EXISTS "UsageEvent_type_occurredAt_idx" ON "UsageEvent"("type", "occurredAt");

DO $$ BEGIN
  ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
