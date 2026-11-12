-- Espace client (s24, lot D3) : "EspaceCompteur", capteur ANONYME du toucher de la vanne
-- (« Ce soir, c'est plutôt ? » et « Une autre », architecture 4.4 et 7.7). AUCUN identifiant
-- d'abonné : un compteur par jour, clé et valeur d'une liste fermée (contrôlée par le code).
-- Table neuve, aucune donnée écrite. Idempotente : à jouer 2 fois. À jouer AVANT le code.

CREATE TABLE IF NOT EXISTS "EspaceCompteur" (
    "id" TEXT NOT NULL,
    "jour" DATE NOT NULL,
    "cle" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "n" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EspaceCompteur_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "EspaceCompteur" ADD COLUMN IF NOT EXISTS "jour" DATE;
ALTER TABLE "EspaceCompteur" ADD COLUMN IF NOT EXISTS "cle" TEXT;
ALTER TABLE "EspaceCompteur" ADD COLUMN IF NOT EXISTS "valeur" TEXT;
ALTER TABLE "EspaceCompteur" ADD COLUMN IF NOT EXISTS "n" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS "EspaceCompteur_jour_cle_valeur_key" ON "EspaceCompteur"("jour", "cle", "valeur");
