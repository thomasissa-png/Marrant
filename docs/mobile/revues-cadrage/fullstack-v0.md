# Revue technique à l'aveugle du cadrage v0 de l'app iPhone (@fullstack, s23, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (commit `640c22a`). Relecture côté technique uniquement, confrontée au code réel de la branche courante. Aucun code, aucun cadrage, aucune base modifiés ; rien commité ni déployé.
> Références `fichier:ligne` relatives à la racine du dépôt.

## 1. Notes

| Critère | Note | Motif principal |
|---|---|---|
| Faisabilité | 7/10 | Faisable sur la pile actuelle (NextAuth v4 en JWT, Workers, Neon, RevenueCat, service de notification Expo), mais plusieurs prérequis cachés manquent : calcul du plan à deux sources, notifications sans compte, parcours d'achat sans compte. |
| Exactitude par rapport au code | 5/10 | `PushToken` existe bien, `DELETE /api/user` aussi ; en revanche « mot de passe oublié » NE crée PAS de mot de passe pour un compte Google, le webhook RevenueCat « déjà en place » n'est pas utilisable tel quel, `daily-push` n'est qu'un squelette jamais planifié, et les routes ne sont pas « réutilisables en l'état ». |
| Sécurité (comptes, Premium, jetons) | 4/10 | Les bons principes y sont (jetons dans le trousseau, rotation, plafonds côté API). Mais rien sur : le drapeau `User.plan` écrit par deux webhooks (le dernier qui écrit gagne), les achats en bac à sable qui arrivent sur la prod, la détection de réutilisation d'un jeton de renouvellement, l'enregistrement public des jetons de notification, ni les événements perdus par la déduplication actuelle. |
| Cohérence Premium site ↔ app | 5/10 | Le principe (une seule source active, plafonds côté API) est juste. Le mécanisme manque : un abonné Apple n'est vu ni par la garde anti-double-abonnement Stripe, ni par la réconciliation quotidienne, ni par les statistiques ; les écrans du site « géré par Apple » n'apparaissent dans aucun lot. |
| Testabilité | 4/10 | Aucune stratégie de test pour des agents qui n'ont pas de Mac ; pas d'environnement bac à sable relié à une base de préproduction avant le lot 7 ; aucun test existant sur `revenuecat-webhook`, `register-token`, `daily-push`. |
| Plan technique par dépendances | 6/10 | Structure claire et chemin critique (lot 0) bien vu. Il manque un lot de socle côté site (plan calculé, garde d'achat, écrans « géré par Apple »), le choix de l'identifiant d'app (irréversible) dans le lot 0, et la préproduction avant les achats. |
| **Note globale** | **5,2/10** | **GO sous réserve** : le cadrage tient, mais la v1 doit intégrer les corrections obligatoires du §4 avant de lancer les specs du lot 1. |

## 2. Hypothèses du cadrage confrontées au code

### 2.1 Authentification

| Hypothèse du cadrage | Réalité du code (fichier:ligne) | Correction |
|---|---|---|
| §3.2 « L'API s'appuie sur des cookies NextAuth (`getServerSession`), inutilisables depuis une app » | Exact. NextAuth 4.24.15 (`apps/web/package.json:53`), `session.strategy = "jwt"`, 30 jours (`apps/web/src/lib/auth.ts:152-155`). 26 routes appellent `getServerSession(authOptions)` sans lire d'en-tête (ex. `apps/web/src/app/api/jokes/route.ts:32`). Point favorable : `getToken()` de NextAuth accepte déjà `Authorization: Bearer` (`node_modules/next-auth/jwt/index.js:83-85`), mais `getServerSession` ne le lit pas. | Garder « un seul utilitaire session OU jeton », à appliquer aux 26 routes (passe Grep obligatoire). Ne PAS réutiliser le jeton NextAuth comme jeton mobile (30 jours, chiffré avec `NEXTAUTH_SECRET`, impossible à révoquer seul) : jeton d'accès court signé à part (`jose`, déjà présent en transitif 4.15.9, à déclarer en dépendance directe) + table de sessions mobiles. |
| §3.2 Connexion e-mail + mot de passe | `authorizeCredentials` est exporté et réutilisable : limites partagées 10/15 min par e-mail et 30/15 min par IP (`auth.ts:16-19, 38-43`), compte Google refusé comme des identifiants faux (`auth.ts:53-56`). Le hachage est scrypt de `node:crypto` (`apps/web/src/lib/password.ts:1`), compatible Workers (`nodejs_compat`, `apps/web/wrangler.jsonc:13`). | `POST /api/mobile/auth/login` appelle `authorizeCredentials` tel quel (mêmes limites, même message neutre). Ne rien réécrire. |
| §3.2 « Les comptes créés par Google utilisent "mot de passe oublié" pour en créer un » | **FAUX.** `forgot-password` n'envoie le lien QUE si `user.passwordHash` existe (`apps/web/src/app/api/auth/forgot-password/route.ts:46`). Un compte Google ne reçoit rien (réponse « OK » neutre). | Soit modifier `forgot-password` pour qu'il envoie aussi un lien « créer ton mot de passe » aux comptes sans mot de passe (e-mail Google vérifié, lien à usage unique : risque faible, texte à faire par @copywriter), soit trancher la décision 3 autrement. À écrire dans le cadrage, sinon les comptes Google, abonnés Stripe compris, ne peuvent pas se connecter dans l'app. |
| Invalidation des sessions | Le JWT web est invalidé si le mot de passe change après l'émission (`auth.ts:226-232`) ou si le compte est supprimé (`auth.ts:202`), contrôle fait toutes les 5 min. | Même règle obligatoire pour les jetons mobiles : renouvellement refusé si `passwordChangedAt` est postérieur à la création de la session ; sessions mobiles supprimées en cascade avec le compte. |
| §3.3 `DELETE /api/user` « si absent » | **Existe** (`apps/web/src/app/api/user/route.ts:143-171`) : garde d'origine, mot de confirmation retapé (`route.ts:128-133`), Stripe résilié d'abord, sinon rien n'est supprimé (`apps/web/src/lib/account.ts:119`). `PushToken` part en cascade (`apps/web/prisma/schema.prisma:583`). | Réutiliser via l'utilitaire session OU jeton. À ajouter : révoquer les sessions mobiles (cascade), supprimer le client RevenueCat (API REST, RGPD). Le mot de confirmation retapé contredit « suppression en 2 touches » (§6 du cadrage) : à trancher (reco : garder le mot, Apple accepte une confirmation). |
| Garde d'origine (CSRF) | `isSameSiteRequest` accepte une requête sans `Origin` ni `Sec-Fetch-Site` (`apps/web/src/lib/same-site.ts:39-41`) : le `fetch` de React Native passe. Origines Capacitor codées en dur (`same-site.ts:22`). | Rien à faire pour l'app Expo. Retirer les origines Capacitor quand le reliquat Capacitor sera supprimé (souhaitable). |

### 2.2 API existantes

| Hypothèse du cadrage | Réalité du code (fichier:ligne) | Correction |
|---|---|---|
| §3.3 `jokes`, `tips`, `videos`, `search` « réutilisables en l'état » | Plafonds 10/3/3 appliqués côté API (`api/jokes/route.ts:76`, `api/tips/route.ts:67`, `api/videos/route.ts:58`) ; recherche 3 ou 5 par type (`api/search/route.ts:26`) ; exercices retirés pour un compte non Premium (`apps/web/src/lib/champs-premium.ts:1-18`). Le plan est lu en base à chaque appel (`api/jokes/route.ts:36-41`) : bonne base. | Réutilisables après passage à l'utilitaire session OU jeton. |
| Fiche détail et liens universels (§2, Explorer) | **Aucune API de fiche** : pas de `GET /api/jokes/[slug]`, ni pour conseils et vidéos (seul `jokes/[id]/like` existe). Sur le site, la fiche `/vannes/[slug]` est **publique** (ISR 24 h, `apps/web/src/app/(dashboard)/vannes/[slug]/page.tsx:25`) : texte, chute et « Pourquoi ça marche » pour tous, « À toi de jouer » Premium (`page.tsx:145-147`). | Créer des fiches par slug qui reprennent EXACTEMENT les règles de `lib/catalogue-pages.ts` (anciens slugs, fiches inactives, exercice retiré). Écrire dans le cadrage la règle réelle : plafond 10/3/3 sur les LISTES, fiche ouverte par lien toujours lisible (comme le site), exercice Premium. Sinon l'app sera plus fermée que le site sur un lien partagé. |
| `daily` | Public, `force-dynamic` (`api/daily/route.ts:7`), vanne et chute séparées en base (`schema.prisma:121-122`). | Réutilisable ; à intégrer à `bootstrap`. |
| `parcours` (by-slug, progress, quiz, retour) | `by-slug` rédige selon le plan lu en base (`api/parcours/by-slug/[slug]/route.ts:26-28, 70-72`), en `private, no-store`. `progress` : **Premium seulement** (`api/parcours/[id]/progress/route.ts:115-116`), idempotent par ligne unique (`route.ts:22-25`), limite partagée 10/min. | Réutilisables avec le jeton. Le cadrage doit dire que la progression synchronisée n'existe que pour un compte Premium : un visiteur sans compte n'a qu'une progression locale (aucune API ne la reçoit). |
| §2 « XP mis en file et synchronisé avec garde d'idempotence » | `POST /api/user/xp` n'est PAS idempotent et utilise un limiteur en mémoire par isolat (`api/user/xp/route.ts:26`), pas le limiteur partagé. | La file hors ligne ne rejoue que des appels idempotents : `progress` oui, `user/xp` non (lui ajouter une clé d'idempotence ou ne jamais le mettre en file). |
| `favorites` | `GET` sur session, `POST` Premium seulement, plan lu en base (`api/favorites/route.ts:41-53`). | Réutilisable avec le jeton. |
| `user/subscription` | Résumé **Stripe seulement** (`apps/web/src/lib/account.ts:43-88` : `hasPortal`, `hasStripeSubscription`). | À étendre avec l'origine (Stripe ou Apple) et la façon de gérer l'abonnement. |
| §3.3 `GET /api/carnet` « si absent » | **Absent.** La logique existe : `carnetViewForPlan` (`apps/web/src/lib/carnet.ts:172`), `CARNET_FREE_FICHES = 1` (`carnet.ts:94`), carnets en JSON dans le dépôt. Pages `/carnet` et `/carnet/[mois]` lisent `readSessionPlan`. | Route mince autour de `carnetViewForPlan` : quelques lignes, test inclus. |
| Widget d'accueil sans compte (§2, décision 8) | Une API publique existe déjà : `/api/widget/v1/vanne-du-jour` (`apps/web/src/app/api/widget/v1/vanne-du-jour/route.ts:48-62`), sélection **tout public** (93 vannes relues en s22), mais **inerte** (`WIDGET_VANNE_DU_JOUR_PUBLIE = false` → 503, `route.ts:52`). | Le widget iPhone doit lire cette sélection tout public (écran verrouillé, guideline 1.1, tranche d'âge), pas la vanne du jour du site. Dépendance à ajouter : interrupteur ouvert ou route dédiée à l'app. |

### 2.3 Notifications

| Hypothèse du cadrage | Réalité du code (fichier:ligne) | Correction |
|---|---|---|
| §3.0 « table `PushToken` dont l'existence n'a pas été confirmée » | **Existe** dans les deux schémas (`prisma/schema.prisma:576-588` et `apps/web/prisma/schema.prisma:576-588`, fichiers identiques) et en base (migration `apps/web/prisma/migrations/6_fix_pushtoken_webhookevent_schema`). Champs : `userId` **obligatoire**, `token` unique, `platform`, `lastSeenAt`. | Le modèle ne colle pas au cadrage : la notification quotidienne doit marcher **sans compte** (§2), or `userId` est obligatoire. Rendre `userId` facultatif et ajouter `installationId` (unique), `fournisseur` (`expo`), `fuseau` (IANA), `heureLocale`/`minuteLocale`, `quotidienActif`, `rappelParcoursActif`, `dernierEnvoiJour` (idempotence par jour local), `echecs`. Migration additive et idempotente. |
| §3.3 « Adapter `push/register-token` à un jeton Expo » | La route exige une session et cherche l'utilisateur par e-mail (`api/push/register-token/route.ts:14, 32`), n'accepte que `ios`/`android` (`route.ts:26`). Le `DELETE` supprime **n'importe quel jeton** sans vérifier à qui il appartient (`route.ts:81`). | Nouvelle route publique `POST/PATCH/DELETE /api/mobile/push` : jeton Expo validé (`ExponentPushToken[...]`), identifiée par `installationId` + secret d'installation, limite par IP, aucune donnée personnelle ; rattachée au compte si un jeton d'accès est présent. Corriger la faille du `DELETE` (ou retirer la route). |
| §3.0 `cron/daily-push` « conçu pour FCM et APNs, jamais mis en service » | Confirmé, et pire : **aucun job** du planificateur ne l'appelle (`apps/web/src/lib/scheduler/jobs.ts`, 0 occurrence de « push ») ; API FCM historique `fcm.googleapis.com/fcm/send` (`daily-push/route.ts:115`, fermée par Google) ; APNs factice qui **renvoie `true` sans rien envoyer** (`route.ts:134-153`) ; jour calculé en UTC et non à Paris (`route.ts:41`) ; secret en paramètre d'URL (`route.ts:35`) ; titre avec tiret cadratin et émoji (règle commune 12) ; lien profond par identifiant et schéma `deviensmarrant://` absent de `apps/mobile/app.json`. | À réécrire entièrement en job du planificateur (pas une route publique) : le tick `*/15` existe déjà (`apps/web/wrangler.jsonc:80`), donc heures choisies par créneaux de 15 min. Envoi par l'API Expo par lots de 100, puis lecture des accusés pour supprimer les jetons `DeviceNotRegistered`. Supprimer l'ancienne route et les secrets FCM/APNs de `.env.example` (`.env.example:138-143`). |
| §3.4 « conditions tarifaires du service Expo [À VÉRIFIER] » | La documentation Expo indique qu'aucun coût n'est associé à l'envoi de notifications ([FAQ Expo](https://docs.expo.dev/push-notifications/faq/)) ; lots de 100 au plus recommandés. | Lever le marqueur. Prévoir un jeton d'accès Expo (sécurité renforcée des envois) en secret Worker. |

### 2.4 Abonnement, RevenueCat et coexistence avec Stripe

| Hypothèse du cadrage | Réalité du code (fichier:ligne) | Correction |
|---|---|---|
| §3.0 Webhook RevenueCat « déjà en place » (met PREMIUM/FREE, dédoublonne) | Squelette dangereux, à réécrire : (1) écrit `user.update({ where: { id: appUserId } })` (`revenuecat-webhook/route.ts:80-81`) : un identifiant anonyme RevenueCat lève une erreur, réponse 500 ; (2) la ligne `WebhookEvent` est créée **avant** le traitement (`route.ts:59`) : le nouvel essai de RevenueCat est « dédoublonné » et **l'événement est perdu** ; (3) `eventId` vide accepté, donc tous les événements sans identifiant après le premier sont ignorés ; (4) `EXPIRATION` met `plan = FREE` (`route.ts:91-94`) **même si un abonnement Stripe est actif** ; (5) aucun contrôle de l'environnement (`SANDBOX` ou `PRODUCTION`) ; (6) `TRANSFER` ignoré (`route.ts:109`) ; (7) comparaison du secret non constante (`route.ts:27`), `payload: any`, aucun test. | Réécrire : secret comparé en temps constant ; pour chaque événement, relire l'état de l'abonné par l'API REST de RevenueCat (immune à l'ordre d'arrivée), écrire une ligne de droits dédiée, puis recalculer le plan ; déduplication marquée APRÈS succès ; environnement stocké ; tests Jest avec fixtures. |
| §3.3 et §4.4 « Champ origine (STRIPE ou APPLE) sur l'abonnement [À VÉRIFIER] » | **Absent.** `Subscription` est 100 % Stripe (`apps/web/prisma/schema.prisma:504-522` : `stripeCustomerId`, `stripeSubscriptionId`, `priceAmountCents`) et `userId` y est unique. Tout le code de facturation suppose Stripe : résumé et portail (`lib/account.ts:84-85`), suppression de compte, réconciliation. | Ne pas mettre Apple dans `Subscription`. Créer un modèle `StoreEntitlement` (une ligne par compte et par boutique : `store`, `rcAppUserId`, `productId`, `environment`, `expiresAt`, `willRenew`, `status`, `updatedFromEventAt`). L'origine affichée se déduit de la source active. |
| §4.4 « Une seule source active par compte » | Le plan est un **drapeau unique** `User.plan` (`schema.prisma:64`), lu partout pour le Premium (bonne chose pour la cohérence site ↔ app), mais **écrit directement** par 5 endroits : le webhook Stripe (`api/stripe/webhook/route.ts:192-194, 217, 261, 371`), le webhook RevenueCat (`revenuecat-webhook/route.ts:83, 94`), `apps/web/src/lib/stripe-activation.ts:52` (utilisé au retour de paiement), le filet de `auth.ts:208-221` (qui ne regarde que `Subscription.status = ACTIVE`) et le bouton admin « synchroniser avec Stripe », qui remet FREE tout compte sans abonnement Stripe actif (`apps/web/src/app/api/admin/users/route.ts:146-151`). Le dernier qui écrit gagne : la résiliation d'un vieil abonnement Stripe ou un clic admin retire le Premium d'un abonné Apple, et inversement. | **Un seul écrivain du plan** : fonction `recalculerPlan(userId)` = PREMIUM si Stripe actif (ACTIVE, TRIALING, PAST_DUE) OU droits Apple non expirés OU accès offert ; appelée par ces 5 endroits. `finPremiumLettreHebdo` seulement si le résultat passe à FREE. Passe Grep sur `plan: "FREE"` et `plan: "PREMIUM"` (17 fichiers hors tests les citent, la plupart en lecture). |
| §4.4 « Abonné Apple qui ouvre le site : jamais de second paiement possible » | La garde Stripe ne regarde que la base Stripe et les abonnements Stripe (`apps/web/src/lib/stripe.ts:58, 116-127, 155-157`). Un abonné Apple passe la garde. Seul `middleware.ts:47` renvoie un PREMIUM loin de `/abonnement`, pas l'API `stripe/checkout`. | `createCheckoutSession` doit refuser si `StoreEntitlement` est actif (409, code `gere-par-apple`). Symétrique côté app : `bootstrap` signale « Stripe actif » et l'écran d'offre est masqué, puis l'achat est refusé par l'app avant StoreKit. |
| §4.4 « Achat sans compte, rattaché à un identifiant anonyme, puis compte » | Rien ne gère ce cas côté serveur (cf. point 1 du webhook). Le site, lui, ne vend jamais sans compte. | Trancher (correction obligatoire 6). Reco technique : **compte créé dans le parcours d'achat, avant StoreKit**, `appUserID` RevenueCat = `User.id` (cuid, jamais l'e-mail) ; c'est le même trajet que le site et ça supprime les identifiants orphelins et `TRANSFER`. Conformité à 5.1.1(v) à confirmer par @legal. |
| Réconciliation et statistiques | La réconciliation quotidienne compte tout PREMIUM sans abonnement Stripe comme un écart (`apps/web/src/lib/billing/stripe-reconciliation.ts:83-88`) ; les rapports (entonnoir, MRR, admin) lisent `plan` et les prix Stripe. | Exclure les droits Apple actifs de l'écart « Premium sans abonnement » ; ajouter la source aux statistiques (MRR Apple net de commission ≠ prix Stripe). Sinon : alerte quotidienne fausse pour chaque abonné Apple et MRR faux (objectif à 6 mois). |
| Recette en bac à sable | TestFlight et la revue d'Apple achètent en **bac à sable**, sur l'app de production. | Le serveur accepte les droits `SANDBOX` (ils expirent en quelques minutes) mais les marque, les exclut des statistiques, et la préproduction reçoit son propre webhook. Sans ça : soit la revue d'Apple ne voit pas le Premium (refus 2.1), soit des achats fictifs comptent en MRR. |

### 2.5 Application, build, hors ligne, infrastructure

| Hypothèse du cadrage | Réalité du code (fichier:ligne) | Correction |
|---|---|---|
| §3.0 « Squelette `apps/mobile` : repartir à neuf » | Confirmé : 2 fichiers utiles (`apps/mobile/src/navigation/AppNavigator.tsx`, `apps/mobile/src/screens/HomeScreen.tsx`), Expo `~52.0.0`, RN 0.76.5, React 18.3.1 (`apps/mobile/package.json:12-15`). `app.json` invalide : paquet Android `fr.deviens-marrant.app` (le tiret est interdit dans un nom de paquet Android), icône `./assets/icon.png` absente (pas de dossier `assets`), pas de `scheme`, `projectId` vide. L'identifiant diffère de Capacitor (`capacitor.config.ts:6` : `fr.deviensmarrant.app`). | Repartir à neuf : **d'accord**. Lever le [À VÉRIFIER] : depuis le 28/04/2026, tout envoi à App Store Connect doit être compilé avec Xcode 26 et le SDK iOS 26 ([Apple](https://developer.apple.com/news/upcoming-requirements/)) ; l'image EAS par défaut des SDK 54 et 55 utilise Xcode 26 ([Expo](https://expo.dev/blog/app-store-connect-minimum-sdk-26)). SDK 55 sorti le 25/02/2026, RN 0.83 ([Expo](https://expo.dev/sdk/55)) ; SDK 56 et 57 non confirmés par une source primaire : prendre la dernière SDK stable au début du lot 5. Ajouter au lot 0 le choix de l'identifiant (reco `fr.deviensmarrant.app`, valable iPhone et Android, irréversible dans App Store Connect). |
| Monorepo | La racine n'a pas de `workspaces` ; `postinstall` n'installe que `apps/web` (`package.json:4`). L'app aura React 19, le site reste en React 18.3 et Next 14.2.35 (`apps/web/package.json:52-54`). | Garder `apps/mobile` hors de tout espace de travail npm (verrou séparé) et configurer EAS sur le sous-dossier. Types partagés : copie générée ou paquet local, pas d'import direct de `apps/web/src`. |
| §5 « Pas de Mac » | Juste pour la compilation et l'envoi (EAS). | Mais aucun moyen pour les agents de voir l'app tourner : pas de simulateur iOS sous Linux. Prévoir des tests Maestro sur simulateur dans le cloud (EAS Workflows) avec captures, plus TestFlight par Thomas pour les notifications et les achats [À VÉRIFIER : coût et disponibilité des workflows Maestro iOS sur l'offre retenue]. |
| §5 « Coût d'EAS [À VÉRIFIER] » | Offre gratuite : quota mensuel de compilations, nombre exact incohérent selon les sources ; offre Starter 19 USD/mois ([Expo, offres](https://docs.expo.dev/billing/plans/)). RevenueCat : gratuit jusqu'à 2 500 USD de revenu suivi par mois, puis 1 % du brut ([RevenueCat](https://www.revenuecat.com/pricing/)). | Coûts induits côté site faibles : quelques requêtes Worker et Neon de plus (`bootstrap`, jetons) et une écriture `JobLock` par appel limité (le limiteur partagé écrit en base, `apps/web/src/lib/rate-limit.ts:102-129`). Lire le quota gratuit d'EAS sur la page officielle avant le lot 5. |
| §3.5 Hors ligne | Les contenus qui ont un sens hors ligne sont soit statiques (carnet en JSON), soit privés (`private, no-store`, `by-slug/[slug]/route.ts:19`). | Approche juste. Ajouter : purge du cache Premium au retour de `bootstrap` non Premium ET à la déconnexion ; la file hors ligne vit par compte (pas de rejeu sous un autre compte). |
| CORS | Le `fetch` natif n'est pas soumis à CORS ; seule la route widget l'ouvre (`api/widget/v1/vanne-du-jour/route.ts:22-24`). | Ne rien ouvrir pour l'app. Ne pas ajouter d'en-têtes CORS aux routes mobiles (aucun client navigateur prévu). |
| Pare-feu Cloudflare | Hors code. Le dépôt mentionne des 403 « bots IA » côté Cloudflare (`project-context.md:111`). | [À VÉRIFIER @infrastructure] que les règles anti-robots de Cloudflare ne défient pas les requêtes de l'app (agent utilisateur `CFNetwork`, pas de JavaScript) : règle d'exception sur `/api/mobile/*` si besoin. |
| Liens universels (lot 10) | Pas de `public/.well-known/apple-app-site-association` (seul `ai-plugin.json`). Le `matcher` du middleware n'exclut pas `/.well-known/` (`apps/web/src/middleware.ts:140-142`), sans effet bloquant. | Fichier servi en JSON, sans redirection, avec l'identifiant d'équipe Apple : dépend du lot 0. |

## 3. Endpoints et modèles à créer ou modifier

### 3.1 Modèles (migrations additives, idempotentes, jouées deux fois sur base jetable avant déploiement)

| Modèle | Action | Contenu |
|---|---|---|
| `MobileSession` | Créer | `id`, `userId` (cascade), `refreshTokenHash` (SHA-256, jamais le jeton en clair), `familleId` (détection de réutilisation : un jeton déjà tourné présenté = toute la famille révoquée), `appareil` (libellé court, sans donnée personnelle), `createdAt`, `lastUsedAt`, `expiresAt`, `revokedAt`. |
| `StoreEntitlement` | Créer | `userId` (cascade), `store` (`APP_STORE`, plus tard `PLAY_STORE`), `rcAppUserId`, `productId`, `environment` (`PRODUCTION` ou `SANDBOX`), `status`, `expiresAt`, `willRenew`, `updatedFromEventAt`. Unique (`userId`, `store`). |
| `PushToken` | Modifier | `userId` facultatif ; ajouter `installationId` (unique), `installationSecretHash`, `fournisseur`, `fuseau`, `heureLocale`, `minuteLocale`, `quotidienActif`, `rappelParcoursActif`, `dernierEnvoiJour`, `echecs`. |
| `WebhookEvent` | Usage à corriger | Écrire la ligne APRÈS traitement réussi (RevenueCat) ; refuser un `eventId` vide. |
| `Subscription` | Ne pas toucher | Reste Stripe seul. |
| Les deux `schema.prisma` | Signaler | `prisma/schema.prisma` et `apps/web/prisma/schema.prisma` sont deux copies identiques de 1 246 lignes : toute migration mobile doit modifier les deux (ou en supprimer une, décision à part). |

### 3.2 Bibliothèques côté site

| Fichier | Action |
|---|---|
| `apps/web/src/lib/auth-requete.ts` (nom indicatif) | Créer : `lireUtilisateurRequete(request)` = cookie NextAuth OU `Authorization: Bearer` (jeton mobile vérifié), renvoie `userId` ; le plan reste lu en base comme aujourd'hui. Passe Grep sur les 26 appels à `getServerSession` dans `app/api`. |
| `apps/web/src/lib/billing/plan.ts` (nom indicatif) | Créer : `recalculerPlan(userId)`, seul écrivain de `User.plan`. Remplacer les 5 écrivains directs (webhook Stripe, webhook RevenueCat, `lib/stripe-activation.ts`, filet de `lib/auth.ts`, synchronisation admin `api/admin/users`). |
| `apps/web/src/lib/stripe.ts` | Modifier : la garde d'achat refuse aussi un droit Apple actif. |
| `apps/web/src/lib/billing/stripe-reconciliation.ts` | Modifier : ne plus signaler un Premium Apple comme écart. |
| `apps/web/src/lib/account.ts` | Modifier : la suppression supprime aussi l'abonné RevenueCat et prévient que l'abonnement Apple n'est pas résilié. |
| `apps/web/src/config/mobile.ts` | Créer : version minimale de l'app, interrupteurs (`APP_ACHAT_OUVERT`, `APP_PUSH_OUVERT`), durées des jetons. Aucune valeur métier en dur dans les routes. |

### 3.3 Endpoints

| Endpoint | Action | Détail |
|---|---|---|
| `POST /api/mobile/auth/login` | Créer | `authorizeCredentials` réutilisé ; renvoie un jeton d'accès (15 min) et un jeton de renouvellement (rotation). |
| `POST /api/mobile/auth/refresh` | Créer | Rotation, détection de réutilisation, refus si `passwordChangedAt` postérieur ou compte supprimé ; limite partagée par session et par IP. |
| `POST /api/mobile/auth/logout` | Créer | Révoque la session ; détache le jeton de notification du compte (il reste pour l'appareil si l'utilisateur garde la vanne du jour). |
| `POST /api/mobile/auth/register` | Créer (ou réutiliser `api/auth/register` puis login) | Même schéma zod et même limite 5/h par IP (`api/auth/register/route.ts`). |
| `GET /api/mobile/bootstrap` | Créer | Plan, source active (`stripe`, `apple`, `offert`, aucune), contenu du jour, version minimale, interrupteurs. `private, no-store`. |
| `GET /api/mobile/vannes/[slug]`, `/conseils/[slug]`, `/videos/[slug]` | Créer | Fiches publiques avec exercice Premium ; mêmes règles que `lib/catalogue-pages.ts` (anciens slugs, inactives). |
| `GET /api/carnet` (et `?mois=`) | Créer | Autour de `carnetViewForPlan`. |
| `POST/PATCH/DELETE /api/mobile/push` | Créer | Jeton Expo par installation, heure et fuseau, rappel de parcours séparé ; limite par IP. |
| `POST /api/mobile/iap/sync` | Créer | Après achat ou restauration : le serveur relit l'abonné chez RevenueCat (API REST, clé secrète) et recalcule le plan sans attendre le webhook. |
| `POST /api/iap/revenuecat-webhook` | Réécrire | Voir §2.4. |
| `GET /api/user/subscription` | Modifier | Ajouter la source et le mode de gestion. |
| `DELETE /api/user` | Modifier | Jeton accepté, sessions mobiles révoquées, abonné RevenueCat supprimé. |
| `POST /api/user/xp` | Modifier | Clé d'idempotence + limiteur partagé, ou exclu de la file hors ligne. |
| `POST/DELETE /api/push/register-token` | Supprimer (ou corriger) | Faille du `DELETE` sans contrôle de propriété ; remplacé par `/api/mobile/push`. |
| `GET/POST /api/cron/daily-push` | Supprimer | Remplacé par un job du planificateur (`lib/scheduler/jobs.ts`). |
| `/.well-known/apple-app-site-association` | Créer | Liens universels (`/vannes/*`, `/conseils/*`, `/videos/*`, `/parcours/*`, `/carnet/*`). |
| Pages du site `/abonnement`, `/profil` | Modifier | Abonné Apple : « Abonnement géré par Apple », jamais de bouton d'achat (textes @copywriter). |

## 4. Corrections OBLIGATOIRES

1. **§3.2 Comptes Google** : remplacer « ils utilisent mot de passe oublié » par la réalité (`forgot-password/route.ts:46` ignore les comptes sans mot de passe) et choisir : adapter `forgot-password` (reco, textes @copywriter) ou revoir la décision 3. Sans ça, une partie des abonnés Stripe ne peut pas se connecter dans l'app.
2. **§4.4 Plan à deux sources** : écrire la règle « `User.plan` a un seul écrivain, `recalculerPlan(userId)`, calculé depuis Stripe, Apple et les accès offerts » et la placer dans un lot de socle côté site, livré en production et testé (non-régression Stripe) AVANT le lot 7.
3. **§3.0 et §4.2 Webhook RevenueCat** : retirer « déjà en place » ; le classer « à réécrire » pour les 7 défauts du §2.4 (événement perdu par la déduplication faite avant le traitement, `EXPIRATION` qui écrase un abonné Stripe, identifiant anonyme en 500, bac à sable non distingué, `TRANSFER` ignoré, secret comparé en temps non constant, aucun test).
4. **§3.3 Origine de l'abonnement** : remplacer « champ origine sur l'abonnement » par un modèle `StoreEntitlement` séparé (`Subscription` est Stripe seul, `userId` unique, et 4 traitements le supposent).
5. **§4.4 Double abonnement** : nommer les deux gardes : `createCheckoutSession` (`lib/stripe.ts:155`) refuse un droit Apple actif ; l'app refuse l'achat si `bootstrap` dit « Stripe actif ». Ajouter au plan les écrans du site « géré par Apple » (`/abonnement`, `/profil`, résumé d'abonnement).
6. **§4.4 Achat sans compte** : trancher. Reco technique : compte créé dans le trajet d'achat avant StoreKit, `appUserID` = `User.id`. Si l'achat anonyme est gardé, le cadrage doit prévoir la gestion de `TRANSFER` et des droits orphelins. Conformité 5.1.1(v) à confirmer par @legal.
7. **§2 et §3.4 Notification sans compte** : `PushToken.userId` est obligatoire (`schema.prisma:578`). Écrire la migration (installation, fuseau, heure, idempotence par jour local) et la route publique limitée qui remplace `register-token`.
8. **§3.0 `daily-push`** : le reclasser « à réécrire » (jamais planifié, FCM fermé, APNs factice qui renvoie `true`, jour en UTC) en job du planificateur sur le tick `*/15` existant, par créneaux de 15 min, envoi Expo par lots de 100, nettoyage par accusés.
9. **Bac à sable** : ajouter la règle « droits `SANDBOX` acceptés, marqués, exclus des statistiques ; webhook de préproduction séparé » et déplacer la préproduction (branche Neon + Worker de préproduction) AVANT le lot 7 dans les dépendances.
10. **Lot 0** : ajouter le choix de l'identifiant d'app (reco `fr.deviensmarrant.app` ; `fr.deviens-marrant.app` de `app.json` est invalide pour Android et irréversible une fois créé dans App Store Connect).
11. **§3.2 Jetons** : préciser jeton d'accès court signé à part (pas le JWT NextAuth de 30 jours), table `MobileSession` avec empreinte du jeton de renouvellement, rotation avec détection de réutilisation, invalidation sur changement de mot de passe et suppression de compte (mêmes règles que `auth.ts:202, 226-232`).
12. **§3.3 « Réutilisables en l'état »** : remplacer par « réutilisables après passage à l'utilitaire session OU jeton (26 routes) », et ajouter les fiches par slug (absentes) avec la règle réelle du site : plafonds sur les listes, fiche ouverte par lien lisible, exercice Premium.
13. **§2 File hors ligne** : limiter le rejeu aux appels idempotents ; `user/xp` ne l'est pas (`api/user/xp/route.ts:26`). Préciser que la progression synchronisée est réservée aux comptes Premium (`progress/route.ts:115-116`) ; le visiteur sans compte n'a qu'une progression locale.
14. **Testabilité** : ajouter au plan une stratégie de test sans Mac (tests Maestro sur simulateur dans le cloud avec captures, Jest pour chaque nouvelle route et pour le webhook avec fixtures RevenueCat, TestFlight par Thomas pour notifications et achats) ; sinon aucune preuve G_PROOF possible pour les agents.
15. **§3.0 et §5 marqueurs techniques** : lever ceux que le code ou une source primaire tranche (existence de `PushToken`, `DELETE /api/user`, absence de `/api/carnet`, gratuité du service de notification Expo, exigence Xcode 26 et SDK iOS 26 depuis le 28/04/2026, tarif RevenueCat).

## 5. Corrections SOUHAITABLES

1. Widget iPhone alimenté par la sélection **tout public** du widget s22 (`api/widget/v1/vanne-du-jour`), pas par la vanne du jour du site ; même choix pour le texte des notifications sur l'écran verrouillé.
2. `POST /api/mobile/iap/sync` après chaque achat ou restauration : Premium visible tout de suite, sans dépendre du délai du webhook.
3. Réconciliation quotidienne étendue : comparer `StoreEntitlement` à l'état RevenueCat (même modèle d'alerte que Stripe).
4. Statistiques par source (Stripe ou Apple, production ou bac à sable) dans le rapport du lundi et le MRR ; à cadrer avec @data-analyst.
5. Supprimer les reliquats Capacitor (`capacitor.config.ts`, scripts `cap:*` et `build:mobile` de `apps/web/package.json:11-14`, `lib/api-base.ts`, origines Capacitor de `lib/same-site.ts:22`, branche « export statique mobile » de `next.config`) dans une passe séparée, après la sortie de l'app.
6. Supprimer les secrets FCM et APNs inutiles de `.env.example` et documenter les nouveaux (`REVENUECAT_SECRET_API_KEY`, `EXPO_ACCESS_TOKEN`, `MOBILE_JWT_SECRET`) dans `.env.example` et `REPLIT_ACTIONS.md`.
7. Unifier les deux `schema.prisma` (ou documenter laquelle fait foi) avant d'y ajouter trois modèles.
8. `bootstrap` mis en cache côté app (SWR) et fractionné si la latence dépasse 1 s (Neon à froid).
9. Exception Cloudflare (anti-robots) sur `/api/mobile/*` à vérifier par @infrastructure avant les premiers tests TestFlight.
10. Lier la décision « suppression en 2 touches » au mot de confirmation actuel (`api/user/route.ts:128-133`) : garder le mot (protection contre une suppression accidentelle), et le dire dans le cadrage.
11. Prendre la dernière SDK Expo stable au début du lot 5 et la noter dans `docs/dev-decisions.md` (SDK 55 confirmée, versions suivantes non vérifiées sur source primaire).

### Plan par dépendances corrigé (proposition)

| Lot | Changement par rapport au cadrage |
|---|---|
| 0 | + identifiant d'app ; + compte Expo (EAS) et projet RevenueCat |
| **4a (nouveau)** | Socle côté site, livré en production avant toute vente dans l'app : `recalculerPlan`, `StoreEntitlement`, webhook RevenueCat réécrit, garde d'achat Stripe, réconciliation, écrans « géré par Apple », `forgot-password` des comptes Google. Dépend du lot 1 (textes) et de la décision 6. |
| 4b | Ce qui reste du lot 4 : jetons, `bootstrap`, fiches par slug, carnet, push, suppression étendue. Parallèle au 4a. |
| 10 | Préproduction (branche Neon + Worker + webhook RevenueCat de préproduction) **avant** le lot 7 ; liens universels après le lot 0 (identifiant d'équipe). |
| 7 | Dépend du lot 0, du 4a et du 10 (préproduction). |
| 8 | Dépend du 4b (migration `PushToken`) et du planificateur ; ne dépend pas du lot 0 pour le serveur, seulement pour les certificats APNs gérés par EAS. |
| 12 | + tests Maestro dans le cloud dès le lot 5, pas seulement en fin de chaîne. |

## 6. Surprises trouvées dans le code

1. `forgot-password` ne crée jamais de mot de passe pour un compte Google (`api/auth/forgot-password/route.ts:46`) : l'hypothèse centrale du §3.2 tombe.
2. Le webhook RevenueCat enregistre l'événement comme traité AVANT de le traiter (`revenuecat-webhook/route.ts:59`) : toute erreur 500 se transforme en événement perdu au nouvel essai.
3. `EXPIRATION` Apple met `plan = FREE` sans regarder Stripe (`revenuecat-webhook/route.ts:94`), et les webhooks Stripe font la même chose dans l'autre sens : `User.plan` n'a pas de source unique.
4. `cron/daily-push` n'a jamais été branché au planificateur et son envoi APNs est factice mais compté comme réussi (`daily-push/route.ts:153`) ; l'API FCM utilisée est fermée.
5. `DELETE /api/push/register-token` supprime n'importe quel jeton sans vérifier son propriétaire (`register-token/route.ts:81`).
6. `PushToken.userId` est obligatoire : la notification sans compte promise par le cadrage est impossible avec le modèle actuel.
7. Deux `schema.prisma` identiques coexistent (`prisma/schema.prisma` et `apps/web/prisma/schema.prisma`).
8. `apps/mobile/app.json` porte un nom de paquet Android invalide et un identifiant différent de celui de Capacitor ; l'icône référencée n'existe pas.
9. `POST /api/user/xp` n'est pas idempotent et son limiteur est en mémoire par isolat (`user/xp/route.ts:26`), alors que les autres limites sensibles sont partagées entre isolats.
10. Le bouton admin « synchroniser avec Stripe » remet FREE tout compte Premium sans abonnement Stripe actif (`api/admin/users/route.ts:146-151`) : un clic suffirait à couper un abonné Apple.
11. La fiche `/vannes/[slug]` est publique (ISR 24 h) : la règle « le contenu payant n'est jamais envoyé au visiteur » du §3.3 vaut pour les listes et les exercices, pas pour le texte des vannes.

---

**Handoff → @product-manager** (cadrage v1), copie session principale
- Fichier produit : `docs/mobile/revues-cadrage/fullstack-v0.md`
- Décisions prises : aucune ; recommandations seulement (compte avant achat, `StoreEntitlement` séparé, plan à écrivain unique, lot 4a de socle côté site).
- Points d'attention : corrections obligatoires 1 à 15 ; décision 6 (achat sans compte) et choix de l'identifiant d'app à soumettre à Thomas.
- Actions infra requises : aucune maintenant. Plus tard : secrets `REVENUECAT_SECRET_API_KEY`, `EXPO_ACCESS_TOKEN`, `MOBILE_JWT_SECRET` ; 3 migrations additives ; préproduction Neon + Worker ; exception Cloudflare `/api/mobile/*` à vérifier.
- Pre-commit check : sans objet (aucun code modifié, rien commité).
