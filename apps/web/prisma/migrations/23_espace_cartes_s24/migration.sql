-- Espace client (s24, lot D5) : moteur des cartes de la rafale.
-- "CarteSuivi" : une ligne par abonné et carte (prochaine échéance de révision, nombre de retours).
-- "CarteReponse" : journal ajouté seulement des réponses à « Tu avais une réponse ? » (OUI, MOITIE,
-- RIEN), état du compte à rebours (secondes, NULL = désactivé), résultat du choix sur une carte
-- « Quel registre ? » (NULL tant qu'aucun choix). Clé d'idempotence unique par abonné : un double
-- clic n'écrit qu'une ligne. Aucun texte de l'abonné. Supprimées avec le compte (cascade).
-- Tables neuves, aucune table existante modifiée, aucune donnée écrite.
-- Idempotente : à jouer 2 fois, la 2e passe doit réussir. À jouer AVANT le déploiement du code.

CREATE TABLE IF NOT EXISTS "CarteSuivi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carteId" TEXT NOT NULL,
    "derniereReponse" TEXT,
    "dueLe" TIMESTAMP(3),
    "nbRevues" INTEGER NOT NULL DEFAULT 0,
    "nbRates" INTEGER NOT NULL DEFAULT 0,
    "premiereVueLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CarteSuivi_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "carteId" TEXT NOT NULL;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "derniereReponse" TEXT;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "dueLe" TIMESTAMP(3);
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "nbRevues" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "nbRates" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "premiereVueLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "CarteSuivi" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "CarteSuivi_userId_carteId_key" ON "CarteSuivi"("userId", "carteId");
CREATE INDEX IF NOT EXISTS "CarteSuivi_userId_dueLe_idx" ON "CarteSuivi"("userId", "dueLe");

DO $$ BEGIN
  ALTER TABLE "CarteSuivi" ADD CONSTRAINT "CarteSuivi_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CarteSuivi" ADD CONSTRAINT "CarteSuivi_derniereReponse_check"
    CHECK ("derniereReponse" IS NULL OR "derniereReponse" IN ('OUI', 'MOITIE', 'RIEN'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "CarteReponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carteId" TEXT NOT NULL,
    "reponse" TEXT NOT NULL,
    "compteARebours" INTEGER,
    "choixJuste" BOOLEAN,
    "revision" BOOLEAN NOT NULL DEFAULT false,
    "cle" TEXT NOT NULL,
    "repondueLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CarteReponse_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "carteId" TEXT NOT NULL;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "reponse" TEXT NOT NULL;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "compteARebours" INTEGER;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "choixJuste" BOOLEAN;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "revision" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "cle" TEXT NOT NULL;
ALTER TABLE "CarteReponse" ADD COLUMN IF NOT EXISTS "repondueLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "CarteReponse_userId_cle_key" ON "CarteReponse"("userId", "cle");
CREATE INDEX IF NOT EXISTS "CarteReponse_userId_repondueLe_idx" ON "CarteReponse"("userId", "repondueLe");

DO $$ BEGIN
  ALTER TABLE "CarteReponse" ADD CONSTRAINT "CarteReponse_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CarteReponse" ADD CONSTRAINT "CarteReponse_reponse_check" CHECK ("reponse" IN ('OUI', 'MOITIE', 'RIEN'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CarteReponse" ADD CONSTRAINT "CarteReponse_compteARebours_check"
    CHECK ("compteARebours" IS NULL OR "compteARebours" BETWEEN 1 AND 60);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
