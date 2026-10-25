-- Lettre hebdomadaire Premium s21 (19/10/2026, spec docs/product/lettre-hebdo-premium-s21.md §6.2).
-- Seule migration de la lettre de la semaine : 3 colonnes sur "PremiumLetterPreference"
-- (créée par la migration 14) et, depuis s22, 3 colonnes d'approbation sur "NewsletterIssue"
-- (audience HEBDO_PREMIUM ; voir fin du fichier). "NewsletterSend" réutilisée telle quelle.
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

-- s22 (25/10/2026, décision de Thomas : chaque numéro hebdo approuvé par lui avant envoi).
-- 3 colonnes nullables sur "NewsletterIssue" (créée par la migration 14) : approbation posée
-- par l'action admin « Approuver ce numéro », effacée à toute modification du contenu.
-- Additive : les numéros existants (mensuelle) restent tels quels (NULL), l'ancien code les ignore.
-- À jouer AVANT le déploiement : le client Prisma lit ces colonnes sur toute lecture de
-- "NewsletterIssue", y compris la tâche de la lettre mensuelle.
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "approvedBy" TEXT;
ALTER TABLE "NewsletterIssue" ADD COLUMN IF NOT EXISTS "approvedHash" TEXT;
