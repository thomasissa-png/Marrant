-- Espace client (s24, lot D7, point du D5b tranché par la session) : premier pas strictement monotone.
-- "EspaceCompte"."premierPasLe" : date du premier pas (fiche « Fait », carte jouée ou étape validée),
-- posée une seule fois et jamais effacée. Une fois posée, « Ton premier pas » ne revient plus, même si
-- l'abonné retire ensuite son « Fait » (« Pas essayé »). Colonne nullable ajoutée, aucune donnée
-- écrite, rien d'autre de modifié. Idempotente : à jouer 2 fois, la 2e passe doit réussir. AVANT le code.

ALTER TABLE "EspaceCompte" ADD COLUMN IF NOT EXISTS "premierPasLe" TIMESTAMP(3);
