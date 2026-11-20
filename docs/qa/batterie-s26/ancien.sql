-- Batterie s26 : inscrit-gratuit devient un ANCIEN abonné (abonnement CANCELED, 2 favoris gardés, lettre confirmée).
-- Remis à zéro par comptes.sh en fin de batterie.
INSERT INTO "Subscription" (id, "userId", plan, status, "currentPeriodEnd", "createdAt", "updatedAt")
VALUES ('bat-sub-gratuit', 'prev-inscrit-gratuit', 'FREE', 'CANCELED', now() - interval '3 days', now() - interval '60 days', now())
ON CONFLICT ("userId") DO UPDATE SET status = 'CANCELED', plan = 'FREE';
INSERT INTO "UserFavorite" (id, "userId", "contentType", "jokeId") VALUES ('bat-fav-1', 'prev-inscrit-gratuit', 'JOKE', 'cmwm058ex00007dwco17bwrlm') ON CONFLICT DO NOTHING;
INSERT INTO "UserFavorite" (id, "userId", "contentType", "tipId") VALUES ('bat-fav-2', 'prev-inscrit-gratuit', 'TIP', 'cmwm058gx00287dwcuemmj0ro') ON CONFLICT DO NOTHING;
INSERT INTO "NewsletterSubscriber" (id, email, source, status, "consentText", "confirmationToken", "confirmedAt", "unsubscribeToken", "updatedAt")
VALUES ('bat-nl-gratuit', 'inscrit-gratuit@preversion.test', 'batterie-s26', 'CONFIRMED', 'test batterie', 'bat-tok-c', now() - interval '20 days', 'bat-tok-u', now())
ON CONFLICT (email) DO NOTHING;
