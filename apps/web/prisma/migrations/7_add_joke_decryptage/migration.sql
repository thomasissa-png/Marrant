-- Migration 7 : décryptage pédagogique des vannes (Phase 1a refonte joke-agent, s10)
-- Ajoute 3 champs OPTIONNELS au modèle Joke : technique comique nommée,
-- explication du POURQUOI, et consigne "À toi de jouer" (howToApply).
-- Nullable car les 289 vannes existantes seront back-fillées en Phase 1b.
-- Idempotente : peut être rejouée sans effet secondaire (ADD COLUMN IF NOT EXISTS).

ALTER TABLE "Joke" ADD COLUMN IF NOT EXISTS "comedyTechnique" TEXT;
ALTER TABLE "Joke" ADD COLUMN IF NOT EXISTS "techniqueExplanation" TEXT;
ALTER TABLE "Joke" ADD COLUMN IF NOT EXISTS "howToApply" TEXT;
