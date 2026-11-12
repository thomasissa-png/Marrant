-- Espace client (s24, lot D3) : repérage « humour noir » des vannes (architecture 3.12).
-- Seule table existante touchée, additive : une colonne booléenne à false partout (aucune vanne
-- marquée à la création), plus un index. Le code de la vanne du jour et du toucher exclut les
-- vannes marquées ; tant qu'aucune ne l'est, rien ne change.
-- Idempotente (ADD COLUMN / INDEX IF NOT EXISTS) : à jouer 2 fois, la 2e passe doit réussir.
-- À jouer AVANT le déploiement du code : le client Prisma lit la colonne à chaque lecture de "Joke".

ALTER TABLE "Joke" ADD COLUMN IF NOT EXISTS "humourNoir" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Joke_humourNoir_idx" ON "Joke"("humourNoir");
