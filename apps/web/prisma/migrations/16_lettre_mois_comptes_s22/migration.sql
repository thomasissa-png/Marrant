-- Lettre du mois envoyée d'office aux comptes gratuits (s22, décision de Thomas du 25/10/2026).
-- Une table neuve, "AccountLetterPreference" : jeton de désinscription en un clic (créé au premier
-- envoi) et date de désinscription (durable). Aucune table existante modifiée, aucune donnée écrite.
-- Idempotente : rejouable sans erreur (CREATE TABLE / ADD COLUMN / INDEX IF NOT EXISTS, contrainte
-- en bloc DO). À jouer 2 fois : la 2e passe doit réussir.
-- À jouer AVANT le déploiement : la tâche de la lettre du mois lit cette table (sans elle, rien ne
-- part). L'ancien code l'ignore : aucun retour arrière nécessaire.

CREATE TABLE IF NOT EXISTS "AccountLetterPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unsubscribeToken" TEXT NOT NULL,
    "stoppedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AccountLetterPreference_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AccountLetterPreference" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "AccountLetterPreference" ADD COLUMN IF NOT EXISTS "unsubscribeToken" TEXT;
ALTER TABLE "AccountLetterPreference" ADD COLUMN IF NOT EXISTS "stoppedAt" TIMESTAMP(3);
ALTER TABLE "AccountLetterPreference" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "AccountLetterPreference" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "AccountLetterPreference_userId_key" ON "AccountLetterPreference"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AccountLetterPreference_unsubscribeToken_key" ON "AccountLetterPreference"("unsubscribeToken");

DO $$ BEGIN
  ALTER TABLE "AccountLetterPreference" ADD CONSTRAINT "AccountLetterPreference_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
