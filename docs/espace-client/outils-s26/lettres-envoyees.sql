-- Préversion locale s25 (base marrant_preview_s25 SEULEMENT) : deux numéros déjà validés (statut VALIDE, contenu
-- importé du dépôt par le seed), dont la date d'envoi prévue est passée, marqués envoyés à leur date prévue pour
-- remplir l'archive de l'abonné. Aucun texte écrit ici : objet et corps sont ceux déjà en base.
-- 2026-11 (lettre mensuelle, prévue le 05/11 ; l'abonné en lit la version Premium, sans l'invitation) et
-- 2026-W46 (lettre de la semaine Premium, prévue le 12/11). Rejouable.
\set ON_ERROR_STOP on
BEGIN;
SELECT current_database() = 'marrant_preview_s25' AS bonne_base \gset
\if :bonne_base
\else
  \echo 'Mauvaise base : arrêt.'
  \quit
\endif
UPDATE "NewsletterIssue"
   SET status = 'ENVOYE', "sentAt" = "scheduledFor", "updatedAt" = now()
 WHERE "periodKey" IN ('2026-11', '2026-W46') AND status IN ('VALIDE', 'ENVOYE') AND "scheduledFor" <= now();
INSERT INTO "NewsletterSend" (id, "issueId", email, status, attempts, "sentAt", "createdAt", "updatedAt")
SELECT 'preversion-envoi-' || "periodKey", id, 'abonne-en-cours@preversion.test', 'ENVOYE', 1, "scheduledFor", now(), now()
  FROM "NewsletterIssue"
 WHERE "periodKey" IN ('2026-11', '2026-W46') AND status = 'ENVOYE'
ON CONFLICT ("issueId", email) DO UPDATE SET status = 'ENVOYE', "sentAt" = EXCLUDED."sentAt", "updatedAt" = now();
SELECT "periodKey", audience, status, "sentAt", subject FROM "NewsletterIssue" WHERE status = 'ENVOYE' ORDER BY "sentAt";
COMMIT;
