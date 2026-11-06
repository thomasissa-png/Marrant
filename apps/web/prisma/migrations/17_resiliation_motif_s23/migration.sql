-- Résiliation avec motif demandé AVANT (s23, décision de Thomas du 06/11/2026).
-- Une table neuve, "CancellationFeedback" : réponse FACULTATIVE à « Qu'est-ce qui n'a pas collé ? »
-- sur l'écran /resiliation (codes de raisons, mot libre de 500 caractères, formule, ancienneté en
-- jours, source, date). Ni e-mail, ni IP, ni prix. Aucune table existante modifiée, aucune donnée écrite.
-- Idempotente : rejouable sans erreur (CREATE TABLE / ADD COLUMN / INDEX IF NOT EXISTS, contrainte
-- en bloc DO). À jouer 2 fois : la 2e passe doit réussir.
-- Peut être jouée avant ou après le déploiement : tant que `RESILIATION_PAGE_OUVERTE` est fermé, rien
-- ne lit ni n'écrit cette table (sauf le compteur de l'admin, qui affiche « indisponible » sans elle).
-- L'ancien code l'ignore : aucun retour arrière nécessaire.

CREATE TABLE IF NOT EXISTS "CancellationFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "reasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "comment" TEXT,
    "formule" TEXT,
    "tenureDays" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'ecran',
    "requestKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CancellationFeedback_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "reasons" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "comment" TEXT;
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "formule" TEXT;
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "tenureDays" INTEGER;
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'ecran';
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "requestKey" TEXT;
ALTER TABLE "CancellationFeedback" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "CancellationFeedback_requestKey_key" ON "CancellationFeedback"("requestKey");
CREATE INDEX IF NOT EXISTS "CancellationFeedback_createdAt_idx" ON "CancellationFeedback"("createdAt");
CREATE INDEX IF NOT EXISTS "CancellationFeedback_userId_idx" ON "CancellationFeedback"("userId");

DO $$ BEGIN
  ALTER TABLE "CancellationFeedback" ADD CONSTRAINT "CancellationFeedback_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
