-- Migration 8 : cleanup des SocialPost au format obsolète WILD_CARD (s10)
--
-- Contexte : le format "WILD_CARD" a été retiré de l'enum SocialFormat en s8.
-- Des posts générés avant ce retrait peuvent subsister en DB avec ce format et
-- un status PENDING/APPROVED — ils ne doivent plus jamais être publiés.
--
-- Action : les passer en REJECTED (statut terminal, jamais publié, conservé pour
-- audit) plutôt que les supprimer.
--
-- POURQUOI le cast ::text :
--   WILD_CARD n'existe PLUS comme label de l'enum SocialFormat. Un littéral
--   'WILD_CARD' comparé directement à une colonne de type enum lèverait
--   "invalid input value for enum SocialFormat". On compare donc la valeur
--   castée en texte : "format"::text = 'WILD_CARD". Sûr quel que soit l'état de
--   l'enum (label présent ou non).
--
-- IDEMPOTENTE par nature : une fois les lignes passées en REJECTED, le WHERE ne
-- matche plus rien (0 ligne affectée à la relance). Si aucune ligne WILD_CARD
-- n'existe (cas le plus courant), l'UPDATE est un no-op silencieux.

UPDATE "SocialPost"
SET "status" = 'REJECTED'
WHERE "format"::text = 'WILD_CARD'
  AND "status" <> 'REJECTED';
