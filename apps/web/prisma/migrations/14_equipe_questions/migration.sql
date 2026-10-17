-- « Ta question à l'équipe » (s21, 17/10/2026) : questions des abonnés Premium,
-- circuit reçue -> brouillon -> relue -> envoyée, accord par extrait.
-- Fonction derrière l'interrupteur QUESTIONS_OUVERTES (fermé) : la table peut
-- exister en base sans rien changer au site.
-- Idempotente : rejouable sans erreur (types et contraintes dans des blocs
-- DO ... duplicate_object, CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS
-- pour CHAQUE colonne). À jouer 2 fois : la 2e passe doit réussir.
-- Additive uniquement : aucune table existante modifiée (User intact).

-- Types
DO $$ BEGIN
  CREATE TYPE "EquipeQuestionStatut" AS ENUM ('RECUE', 'BROUILLON', 'RELUE', 'ENVOYEE', 'ECARTEE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
ALTER TYPE "EquipeQuestionStatut" ADD VALUE IF NOT EXISTS 'RECUE';
ALTER TYPE "EquipeQuestionStatut" ADD VALUE IF NOT EXISTS 'BROUILLON';
ALTER TYPE "EquipeQuestionStatut" ADD VALUE IF NOT EXISTS 'RELUE';
ALTER TYPE "EquipeQuestionStatut" ADD VALUE IF NOT EXISTS 'ENVOYEE';
ALTER TYPE "EquipeQuestionStatut" ADD VALUE IF NOT EXISTS 'ECARTEE';

DO $$ BEGIN
  CREATE TYPE "EquipeExtraitStatut" AS ENUM ('AUCUN', 'PROPOSE', 'ACCEPTE', 'REFUSE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
ALTER TYPE "EquipeExtraitStatut" ADD VALUE IF NOT EXISTS 'AUCUN';
ALTER TYPE "EquipeExtraitStatut" ADD VALUE IF NOT EXISTS 'PROPOSE';
ALTER TYPE "EquipeExtraitStatut" ADD VALUE IF NOT EXISTS 'ACCEPTE';
ALTER TYPE "EquipeExtraitStatut" ADD VALUE IF NOT EXISTS 'REFUSE';

-- Table
CREATE TABLE IF NOT EXISTS "EquipeQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "retour" TEXT,
    "statut" "EquipeQuestionStatut" NOT NULL DEFAULT 'RECUE',
    "sensible" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "origine" TEXT NOT NULL DEFAULT 'site',
    "brouillon" TEXT,
    "brouillonSource" TEXT,
    "brouillonAt" TIMESTAMP(3),
    "reponse" TEXT,
    "reponseModifieeParAdmin" BOOLEAN NOT NULL DEFAULT false,
    "relueAt" TIMESTAMP(3),
    "relueMode" TEXT,
    "envoiReserveAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "ecarteeAt" TIMESTAMP(3),
    "alerteArriveeAt" TIMESTAMP(3),
    "alerteEcheanceAt" TIMESTAMP(3),
    "reutilisationAcceptee" BOOLEAN NOT NULL DEFAULT false,
    "reutilisationVersion" TEXT,
    "reutilisationAt" TIMESTAMP(3),
    "extraitTexte" TEXT,
    "extraitStatut" "EquipeExtraitStatut" NOT NULL DEFAULT 'AUCUN',
    "extraitVersion" TEXT,
    "extraitProposeAt" TIMESTAMP(3),
    "extraitDecisionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipeQuestion_pkey" PRIMARY KEY ("id")
);

-- Convergence colonne par colonne (si la table existait avec un schéma partiel)
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "situation" TEXT NOT NULL;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "retour" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "statut" "EquipeQuestionStatut" NOT NULL DEFAULT 'RECUE';
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "sensible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "dueAt" TIMESTAMP(3) NOT NULL;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT NOT NULL;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "origine" TEXT NOT NULL DEFAULT 'site';
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "brouillon" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "brouillonSource" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "brouillonAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "reponse" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "reponseModifieeParAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "relueAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "relueMode" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "envoiReserveAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "ecarteeAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "alerteArriveeAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "alerteEcheanceAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "reutilisationAcceptee" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "reutilisationVersion" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "reutilisationAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "extraitTexte" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "extraitStatut" "EquipeExtraitStatut" NOT NULL DEFAULT 'AUCUN';
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "extraitVersion" TEXT;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "extraitProposeAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "extraitDecisionAt" TIMESTAMP(3);
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EquipeQuestion" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;

-- Index
CREATE UNIQUE INDEX IF NOT EXISTS "EquipeQuestion_idempotencyKey_key" ON "EquipeQuestion"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "EquipeQuestion_userId_receivedAt_idx" ON "EquipeQuestion"("userId", "receivedAt");
CREATE INDEX IF NOT EXISTS "EquipeQuestion_statut_dueAt_idx" ON "EquipeQuestion"("statut", "dueAt");

-- Clé étrangère : suppression du compte = suppression des questions (cascade)
DO $$ BEGIN
  ALTER TABLE "EquipeQuestion" ADD CONSTRAINT "EquipeQuestion_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
