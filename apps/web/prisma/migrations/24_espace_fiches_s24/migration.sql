-- Espace client (s24, lot D5) : « Fait » par fiche, retours de mission, « Ma réplique à moi ».
-- "FicheFait" : une ligne par abonné et fiche (geste déclaré « Essayé, bof » ou « Essayé, ça a marché »).
-- "MissionRetour" : journal des retours de mission (marche 1 à 5 ; pas-essaye, essaye-bof,
-- essaye-ca-a-marche), clé d'idempotence unique par abonné (double clic = une ligne).
-- "UserReplique" : une phrase par abonné et fiche, 1 à 200 caractères ([HYPOTHÈSE] Q5b, plafond fixé
-- par @fullstack, à confirmer avec @ux). Jamais lue par l'outil d'admin.
-- Toutes supprimées avec le compte (cascade). Tables neuves, aucune table existante modifiée,
-- aucune donnée écrite. Idempotente : à jouer 2 fois, la 2e passe doit réussir. AVANT le code.

CREATE TABLE IF NOT EXISTS "FicheFait" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ficheId" TEXT NOT NULL,
    "retour" TEXT NOT NULL,
    "faitLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FicheFait_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FicheFait" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "FicheFait" ADD COLUMN IF NOT EXISTS "ficheId" TEXT NOT NULL;
ALTER TABLE "FicheFait" ADD COLUMN IF NOT EXISTS "retour" TEXT NOT NULL;
ALTER TABLE "FicheFait" ADD COLUMN IF NOT EXISTS "faitLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "FicheFait_userId_ficheId_key" ON "FicheFait"("userId", "ficheId");

DO $$ BEGIN
  ALTER TABLE "FicheFait" ADD CONSTRAINT "FicheFait_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "FicheFait" ADD CONSTRAINT "FicheFait_retour_check" CHECK ("retour" IN ('essaye-bof', 'essaye-ca-a-marche'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "MissionRetour" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "marche" INTEGER NOT NULL,
    "retour" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MissionRetour_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "missionId" TEXT NOT NULL;
ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "marche" INTEGER NOT NULL;
ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "retour" TEXT NOT NULL;
ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "cle" TEXT NOT NULL;
ALTER TABLE "MissionRetour" ADD COLUMN IF NOT EXISTS "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "MissionRetour_userId_cle_key" ON "MissionRetour"("userId", "cle");
CREATE INDEX IF NOT EXISTS "MissionRetour_userId_creeLe_idx" ON "MissionRetour"("userId", "creeLe");

DO $$ BEGIN
  ALTER TABLE "MissionRetour" ADD CONSTRAINT "MissionRetour_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "MissionRetour" ADD CONSTRAINT "MissionRetour_marche_check" CHECK ("marche" BETWEEN 1 AND 5);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "MissionRetour" ADD CONSTRAINT "MissionRetour_retour_check"
    CHECK ("retour" IN ('pas-essaye', 'essaye-bof', 'essaye-ca-a-marche'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "UserReplique" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ficheId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserReplique_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserReplique" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "UserReplique" ADD COLUMN IF NOT EXISTS "ficheId" TEXT NOT NULL;
ALTER TABLE "UserReplique" ADD COLUMN IF NOT EXISTS "texte" TEXT NOT NULL;
ALTER TABLE "UserReplique" ADD COLUMN IF NOT EXISTS "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "UserReplique" ADD COLUMN IF NOT EXISTS "modifieLe" TIMESTAMP(3) NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "UserReplique_userId_ficheId_key" ON "UserReplique"("userId", "ficheId");
CREATE INDEX IF NOT EXISTS "UserReplique_userId_modifieLe_idx" ON "UserReplique"("userId", "modifieLe");

DO $$ BEGIN
  ALTER TABLE "UserReplique" ADD CONSTRAINT "UserReplique_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "UserReplique" ADD CONSTRAINT "UserReplique_texte_check" CHECK (char_length("texte") BETWEEN 1 AND 200);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
