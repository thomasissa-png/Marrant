-- Espace client (s24, lot D4) : "CapAnnonce", trace des annonces de cap et de bonus déjà faites
-- (niveaux-xp-s24.md 3.0 et 5.4 : chaque annonce une seule fois ; le recalcul unique de l'ouverture
-- écrit ses lignes avec "silencieux" = true et n'annonce rien). Une ligne par compte, type et numéro,
-- supprimée avec le compte. Table neuve, aucune table existante modifiée, aucune donnée écrite.
-- Idempotente : à jouer 2 fois, la 2e passe doit réussir. À jouer AVANT le déploiement du code.

CREATE TABLE IF NOT EXISTS "CapAnnonce" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "annonceLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "silencieux" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CapAnnonce_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CapAnnonce" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "CapAnnonce" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL;
ALTER TABLE "CapAnnonce" ADD COLUMN IF NOT EXISTS "numero" INTEGER NOT NULL;
ALTER TABLE "CapAnnonce" ADD COLUMN IF NOT EXISTS "annonceLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "CapAnnonce" ADD COLUMN IF NOT EXISTS "silencieux" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS "CapAnnonce_userId_type_numero_key" ON "CapAnnonce"("userId", "type", "numero");

DO $$ BEGIN
  ALTER TABLE "CapAnnonce" ADD CONSTRAINT "CapAnnonce_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CapAnnonce" ADD CONSTRAINT "CapAnnonce_type_check" CHECK ("type" IN ('CAP', 'BONUS'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CapAnnonce" ADD CONSTRAINT "CapAnnonce_numero_check" CHECK ("numero" BETWEEN 1 AND 5);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
