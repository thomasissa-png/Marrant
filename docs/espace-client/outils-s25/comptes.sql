-- Préversion locale s25 : remise à zéro des 3 comptes de TEST (base jetable marrant_preview_s25).
-- Rejouable : supprime les 3 comptes (cascade) puis les recrée. Toutes les dates sont calculées par
-- rapport à now() (jour courant). Variables psql : h1, h2, h3 (hachages scrypt), j1, j2 (vannes), t1 (conseil).
BEGIN;
DELETE FROM "User" WHERE email IN ('abonne-en-cours@preversion.test','nouvel-abonne@preversion.test','inscrit-gratuit@preversion.test');

-- 1. Abonné en cours : Premium depuis 20 jours, cap 2 (250 XP), annonce de cap pas encore vue (aucune CapAnnonce).
INSERT INTO "User" (id, email, name, "passwordHash", plan, "emailVerified", level, xp, streak, "lastPracticeAt", "lastActiveAt", "createdAt", "updatedAt")
VALUES ('prev-abonne-en-cours', 'abonne-en-cours@preversion.test', 'Abonné en cours (test)', :'h1', 'PREMIUM',
        now() - interval '20 days', 'APPRENTI', 250, 1, now() - interval '4 days', now() - interval '1 day', now() - interval '20 days', now());
INSERT INTO "Subscription" (id, "userId", plan, status, "currentPeriodEnd", "billingInterval", "createdAt", "updatedAt")
VALUES ('prev-sub-en-cours', 'prev-abonne-en-cours', 'PREMIUM', 'ACTIVE', now() + interval '10 days', 'month', now() - interval '20 days', now());
INSERT INTO "EspaceCompte" ("userId", "premierPasLe", "createdAt", "updatedAt")
VALUES ('prev-abonne-en-cours', now() - interval '20 days', now() - interval '20 days', now());

-- 4 étapes validées : Répartie 1-2 et Machine à café 1-2 (50 + 75 + 50 + 75 = 250 XP, seed).
INSERT INTO "UserPathProgress" (id, "userId", "learningPathId", "currentStep", "completedSteps", "startedAt")
SELECT 'prev-prog-' || slug, 'prev-abonne-en-cours', id, 2, ARRAY[1,2], now() - interval '19 days'
FROM "LearningPath" WHERE slug IN ('repartie', 'machine-a-cafe');
INSERT INTO "UserPathStepCompletion" (id, "userId", "learningPathId", "stepOrder", "completedAt")
SELECT 'prev-etape-' || lp.slug || '-' || e.o, 'prev-abonne-en-cours', lp.id, e.o, now() - e.il
FROM "LearningPath" lp
JOIN (VALUES ('repartie', 1, interval '19 days'), ('machine-a-cafe', 1, interval '16 days'),
             ('repartie', 2, interval '11 days'), ('machine-a-cafe', 2, interval '4 days')) AS e(slug, o, il)
  ON e.slug = lp.slug;

-- Cartes : 4 jouées les jours passés (une par jour, J-4 à J-1) ; 1 révision due aujourd'hui
-- (soiree-et-toi-tu-fais-quoi.c1) + la nouvelle du jour (amis-tu-as-change-quelque-chose.c1) = 2 cartes.
INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, revision, cle, "repondueLe")
VALUES ('prev-rep-1', 'prev-abonne-en-cours', 'soiree-et-toi-tu-fais-quoi.c1', 'MOITIE', false, 'prev-rep-1', now() - interval '4 days'),
       ('prev-rep-2', 'prev-abonne-en-cours', 'amis-quoi-de-neuf.c1',          'OUI',    false, 'prev-rep-2', now() - interval '3 days'),
       ('prev-rep-3', 'prev-abonne-en-cours', 'boulot-ca-va.c1',               'OUI',    false, 'prev-rep-3', now() - interval '2 days'),
       ('prev-rep-4', 'prev-abonne-en-cours', 'coloc-la-poele.c1',             'OUI',    false, 'prev-rep-4', now() - interval '1 day');
INSERT INTO "CarteSuivi" (id, "userId", "carteId", "derniereReponse", "dueLe", "nbRevues", "nbRates", "premiereVueLe", "updatedAt")
VALUES ('prev-suivi-1', 'prev-abonne-en-cours', 'soiree-et-toi-tu-fais-quoi.c1', 'MOITIE', now() - interval '1 minute', 1, 0, now() - interval '4 days', now() - interval '4 days'),
       ('prev-suivi-2', 'prev-abonne-en-cours', 'amis-quoi-de-neuf.c1',          'OUI',    now() + interval '4 days',   1, 0, now() - interval '3 days', now() - interval '3 days'),
       ('prev-suivi-3', 'prev-abonne-en-cours', 'boulot-ca-va.c1',               'OUI',    now() + interval '5 days',   1, 0, now() - interval '2 days', now() - interval '2 days'),
       ('prev-suivi-4', 'prev-abonne-en-cours', 'coloc-la-poele.c1',             'OUI',    now() + interval '6 days',   1, 0, now() - interval '1 day',  now() - interval '1 day');

-- 1 réplique (« Coloc : la poêle »), 1 situation faite, 1 retour de mission (marche 1).
INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "creeLe", "modifieLe")
VALUES ('prev-replique-1', 'prev-abonne-en-cours', 'coloc-la-poele', 'Réplique de test : elle a tout vu depuis jeudi, je la garde comme témoin.', now() - interval '1 day', now() - interval '1 day');
INSERT INTO "FicheFait" (id, "userId", "ficheId", retour, "faitLe")
VALUES ('prev-fait-1', 'prev-abonne-en-cours', 'coloc-la-poele', 'essaye-ca-a-marche', now() - interval '1 day');
INSERT INTO "MissionRetour" (id, "userId", "missionId", marche, retour, cle, "creeLe")
VALUES ('prev-mission-1', 'prev-abonne-en-cours', 'conseil-3', 1, 'essaye-ca-a-marche', 'prev-mission-1', now() - interval '5 days');

-- 3 favoris : 2 vannes, 1 conseil (premiers du seed, ordre stable).
INSERT INTO "UserFavorite" (id, "userId", "contentType", "jokeId", "createdAt")
VALUES ('prev-fav-1', 'prev-abonne-en-cours', 'JOKE', :'j1', now() - interval '12 days'),
       ('prev-fav-2', 'prev-abonne-en-cours', 'JOKE', :'j2', now() - interval '6 days');
INSERT INTO "UserFavorite" (id, "userId", "contentType", "tipId", "createdAt")
VALUES ('prev-fav-3', 'prev-abonne-en-cours', 'TIP', :'t1', now() - interval '8 days');

-- 1 question avec réponse de l'équipe NON LUE (ouvertParAbonneLe nul) : pastille sur la cloche.
INSERT INTO "EquipeFil" (id, "userId", type, statut, cle, "creeLe", "dernierMessageLe", "ouvertParAbonneLe")
VALUES ('prev-fil-1', 'prev-abonne-en-cours', 'QUESTION', 'REPONDU', 'prev-fil-1', now() - interval '3 days', now() - interval '1 day', NULL);
INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, cle, "creeLe", "emailEnvoyeLe")
VALUES ('prev-msg-1', 'prev-fil-1', 'ABONNE', 'Question de test (préversion) : comment relancer une blague qui n''a pas pris sans en rajouter ?', 'prev-msg-1', now() - interval '3 days', NULL),
       ('prev-msg-2', 'prev-fil-1', 'EQUIPE', 'Réponse de test (préversion) : ce texte est factice, il sert seulement à montrer une réponse de l''équipe non lue.', NULL, now() - interval '1 day', now() - interval '1 day');

-- 2. Nouvel abonné : Premium depuis aujourd'hui, rien fait (états vides, carte « Ton premier pas »).
INSERT INTO "User" (id, email, name, "passwordHash", plan, "emailVerified", "createdAt", "updatedAt")
VALUES ('prev-nouvel-abonne', 'nouvel-abonne@preversion.test', 'Nouvel abonné (test)', :'h2', 'PREMIUM', now(), now(), now());
INSERT INTO "Subscription" (id, "userId", plan, status, "currentPeriodEnd", "billingInterval", "createdAt", "updatedAt")
VALUES ('prev-sub-nouvel', 'prev-nouvel-abonne', 'PREMIUM', 'ACTIVE', now() + interval '30 days', 'month', now(), now());

-- 3. Inscrit gratuit : sans abonnement.
INSERT INTO "User" (id, email, name, "passwordHash", plan, "emailVerified", "createdAt", "updatedAt")
VALUES ('prev-inscrit-gratuit', 'inscrit-gratuit@preversion.test', 'Inscrit gratuit (test)', :'h3', 'FREE', now(), now(), now());
COMMIT;
