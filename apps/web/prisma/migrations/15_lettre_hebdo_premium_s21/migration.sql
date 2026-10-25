-- Lettre hebdomadaire Premium s21 (19/10/2026, spec docs/product/lettre-hebdo-premium-s21.md §6.2).
-- Seule migration de la lettre de la semaine : 3 colonnes sur "PremiumLetterPreference"
-- (créée par la migration 14). Aucune autre table modifiée : "NewsletterIssue" (audience
-- HEBDO_PREMIUM) et "NewsletterSend" sont réutilisées telles quelles.
-- Idempotente : rejouable sans erreur (ADD COLUMN IF NOT EXISTS, CREATE INDEX IF NOT EXISTS).
-- À jouer 2 fois : la 2e passe doit réussir. Additive : aucune donnée modifiée ni effacée.
-- Prérequis : migration 14 jouée (sinon la table n'existe pas : arrêt, rien à défaire).
-- NE PAS jouer avant le feu vert (voir REPLIT_ACTIONS.md).

-- Jeton opaque du lien d'arrêt en un clic (créé à la première activation, stable ensuite).
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "unsubscribeToken" TEXT;
-- Endroit de l'activation : 'paiement' | 'profil' (écrit par le serveur, jamais par le navigateur).
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "activationOrigin" TEXT;
-- Proposition unique aux abonnés existants (une seule, 409 au second envoi).
ALTER TABLE "PremiumLetterPreference" ADD COLUMN IF NOT EXISTS "proposedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "PremiumLetterPreference_unsubscribeToken_key" ON "PremiumLetterPreference"("unsubscribeToken");
