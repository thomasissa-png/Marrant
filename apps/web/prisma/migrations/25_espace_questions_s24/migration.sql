-- Espace client (s24, lot D7) : « Mes questions » (architecture v20 2.6, décisions C10 a et b).
-- "EquipeFil" : un fil par envoi de l'abonné (type PROBLEME, SITUATION ou QUESTION ; étiquette de scène
-- posée par l'équipe, deux valeurs au plus, listes fermées de 3.3 ou « autre » ; statut ; état « lu »
-- des réponses). Clé d'idempotence unique par abonné (double clic = un seul fil).
-- "EquipeMessage" : messages du fil (ABONNE ou EQUIPE), texte de 1 à 10 000 caractères, date d'envoi
-- de l'e-mail de réponse. Clé d'idempotence unique par fil.
-- Rien n'est effacé sauf demande de l'abonné (« Retirer de mon historique » : suppression du fil) ou
-- suppression du compte (cascade). Tables neuves, aucune table existante modifiée, aucune donnée
-- écrite. Idempotente : à jouer 2 fois, la 2e passe doit réussir. AVANT le code.

CREATE TABLE IF NOT EXISTS "EquipeFil" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sceneOu" TEXT,
    "sceneBut" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "cle" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dernierMessageLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ouvertParAbonneLe" TIMESTAMP(3),
    CONSTRAINT "EquipeFil_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "userId" TEXT NOT NULL;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "sceneOu" TEXT;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "sceneBut" TEXT;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE';
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "cle" TEXT NOT NULL;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "dernierMessageLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EquipeFil" ADD COLUMN IF NOT EXISTS "ouvertParAbonneLe" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "EquipeFil_userId_cle_key" ON "EquipeFil"("userId", "cle");
CREATE INDEX IF NOT EXISTS "EquipeFil_userId_dernierMessageLe_idx" ON "EquipeFil"("userId", "dernierMessageLe");
CREATE INDEX IF NOT EXISTS "EquipeFil_statut_dernierMessageLe_idx" ON "EquipeFil"("statut", "dernierMessageLe");

DO $$ BEGIN
  ALTER TABLE "EquipeFil" ADD CONSTRAINT "EquipeFil_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeFil" ADD CONSTRAINT "EquipeFil_type_check" CHECK ("type" IN ('PROBLEME', 'SITUATION', 'QUESTION'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeFil" ADD CONSTRAINT "EquipeFil_statut_check" CHECK ("statut" IN ('EN_ATTENTE', 'REPONDU'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeFil" ADD CONSTRAINT "EquipeFil_sceneOu_check" CHECK ("sceneOu" IS NULL OR "sceneOu" IN (
    'coloc', 'soiree', 'amis', 'famille', 'couple', 'rencontre', 'boulot', 'reunion-entretien', 'etudes-fac',
    'messages-groupes', 'prise-de-parole', 'commerces-voisins-transports', 'autre'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeFil" ADD CONSTRAINT "EquipeFil_sceneBut_check" CHECK ("sceneBut" IS NULL OR "sceneBut" IN (
    'desamorcer', 'repondre-chambrage', 'relancer-conversation', 'rattraper-faux-pas', 'prendre-la-parole', 'autre'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "EquipeMessage" (
    "id" TEXT NOT NULL,
    "filId" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "corps" TEXT NOT NULL,
    "cle" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailEnvoyeLe" TIMESTAMP(3),
    CONSTRAINT "EquipeMessage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "filId" TEXT NOT NULL;
ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "auteur" TEXT NOT NULL;
ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "corps" TEXT NOT NULL;
ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "cle" TEXT;
ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "EquipeMessage" ADD COLUMN IF NOT EXISTS "emailEnvoyeLe" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "EquipeMessage_filId_cle_key" ON "EquipeMessage"("filId", "cle");
CREATE INDEX IF NOT EXISTS "EquipeMessage_filId_creeLe_idx" ON "EquipeMessage"("filId", "creeLe");

DO $$ BEGIN
  ALTER TABLE "EquipeMessage" ADD CONSTRAINT "EquipeMessage_filId_fkey"
    FOREIGN KEY ("filId") REFERENCES "EquipeFil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeMessage" ADD CONSTRAINT "EquipeMessage_auteur_check" CHECK ("auteur" IN ('ABONNE', 'EQUIPE'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EquipeMessage" ADD CONSTRAINT "EquipeMessage_corps_check" CHECK (char_length("corps") BETWEEN 1 AND 10000);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
