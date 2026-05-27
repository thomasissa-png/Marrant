# Actions Replit — Deviens-marrant.fr

> **TL;DR (s10 — deploy auto-suffisant)** : la checklist web est passée de **11 étapes manuelles à 3**.
> Tout ce qui pouvait être automatisé l'a été dans le code (auto-seed config, crons CEO via scheduler interne, application instantanée des décryptages de vannes au boot, cleanup données). Détails ci-dessous.
> La section "Setup MOBILE V1" plus bas reste une checklist distincte (comptes Apple/Google, builds natifs) non concernée par cette automatisation.

---

## ⭐ s10 — Déploiement web auto-suffisant : AUTO vs MANUEL

> "Quand je déploie, tout se met à jour tout seul." Voici précisément ce qui se passe au 1er deploy, sans rien faire.

### A. CE QUI EST DÉSORMAIS AUTOMATIQUE (zéro action)

Au déploiement Replit, la chaîne `[deployment].build` (`prisma db push` + `prisma generate` + build) synchronise le **schéma** DB. Puis, **~30 s après le boot du serveur**, le scheduler interne (`apps/web/src/instrumentation.ts`) exécute des tâches de démarrage idempotentes, puis prend le relais des crons :

| Tâche | Quand | Mécanisme | Fichier |
|---|---|---|---|
| **Schéma DB à jour** (tables, colonnes) | au build | `prisma db push` (déjà dans `.replit`) | `.replit` `[deployment].build` |
| **Seed singleton `CeoConfig`** (FAIL-SAFE : `enabled=false`, `dryRun=true`) | au boot (~30 s) | `ensureCeoConfig()` idempotent + race-safe | `lib/startup-tasks.ts` → `lib/ai/ceo-helpers.ts` |
| **Cleanup `SocialPost` WILD_CARD** (format obsolète → `REJECTED`) | au boot (~30 s) | `$executeRawUnsafe` UPDATE idempotent (cast `::text`) | `lib/startup-tasks.ts` + migration `8_cleanup_wildcard_socialpost` |
| **Décryptage des 289 vannes** (pré-rédigé, SANS IA) | au boot (~30 s) | `applyJokeDecryptagesTask()` : applique les 3 champs depuis `src/data/joke-decryptages.json`, idempotent (ne touche que `comedyTechnique IS NULL`), `withDbRetry`, fail-safe | `lib/startup-tasks.ts` + `src/data/joke-decryptages.json` |
| **CEO tick** (si activé) | scheduler, 2-4h UTC | time gate + lock + court-circuit kill-switch → fetch `/api/cron/ceo-tick` | `instrumentation.ts` job 9 |
| **CEO KPIs snapshot** (si activé) | scheduler, 5h UTC | time gate + lock + court-circuit → `snapshotCeoKpis()` | `instrumentation.ts` job 10 |

**Garanties** :
- Le CEO démarre **désactivé** (aucun coût, aucune action). Thomas l'active quand il veut via le toggle `/admin/ceo` ou `POST /api/admin/ceo/kill-switch`.
- Les **289 vannes sont décryptées INTÉGRALEMENT et INSTANTANÉMENT au boot**, en une passe, depuis le fichier pré-rédigé bundlé (`src/data/joke-decryptages.json`). **Zéro appel IA, zéro coût, zéro action manuelle.** Idempotent : une fois appliqué, les boots suivants ne touchent plus rien. (L'ancien back-fill IA progressif 50/jour a été retiré.)
- Les **nouvelles vannes quotidiennes** (générées par `generateDailyJoke`) reçoivent leur décryptage via l'IA **à la génération** — `generateJokeDecryptage` reste actif uniquement pour ce cas.
- Toutes les tâches sont **fail-safe** : si la DB est froide (Neon cold start), elles loggent mais ne crashent pas le démarrage. Le boot suivant rattrape.
- Triple verrou anti coûts (bug P0 s8) sur chaque job scheduler : **time gate horaire + `tryAcquireLock` + court-circuit kill-switch/vide**.

> **Note migrations versionnées** : le deploy Replit utilise `prisma db push` (pas `migrate deploy`), qui ne joue PAS les migrations de **données** (ex. `8_cleanup_wildcard`). C'est pourquoi le cleanup est aussi exécuté au boot via `startup-tasks.ts` (garanti + idempotent). Si tu préfères basculer sur `prisma migrate deploy` au build, c'est possible mais **risqué** (la DB a été initialisée via `db push`, pas via migrations → conflit de baseline `_prisma_migrations`). NE PAS changer sans test sur une DB jetable. Le contournement actuel (cleanup au boot) évite ce risque.

### B. LE MINIMUM IRRÉDUCTIBLE MANUEL (~3 étapes)

Ce qui ne PEUT PAS être dans le code (secrets, validations externes, action humaine) :

**1. Merge + Deploy** (l'action elle-même)
- Merge la branche dans `master`, clique **Deploy** sur Replit. Tout le reste s'enchaîne automatiquement (voir section A).

**2. Secrets Replit** (à poser une fois — Replit > Secrets)
Le code se **désactive proprement** si un secret manque (pas de crash). Liste minimale pour activer chaque feature :

| Secret | Pour quoi | Comment l'obtenir |
|---|---|---|
| `DATABASE_URL` | DB (déjà posé) | Auto Replit PostgreSQL |
| `CRON_SECRET` | scheduler ↔ crons HTTP | `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | génération contenu + CEO + vannes | console.anthropic.com |
| `ADMIN_PASSWORD` | accès `/admin/*` (dont toggle CEO) | choisir une passphrase forte |
| `RESEND_API_KEY` | emails (rapport hebdo CEO, inbound) | resend.com dashboard |
| `UNSUBSCRIBE_HMAC_SECRET` | footer unsubscribe RGPD (sinon envoi email CEO bloqué) | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | conformité CPCE footer email | décision Thomas |
| `CEO_ADMIN_EMAIL` | destinataire rapport hebdo CEO | `alex@deviens-marrant.fr` |
| `NEXT_PUBLIC_BASE_URL` | liens unsubscribe | `https://deviens-marrant.fr` |
| `TWITTER_BEARER_TOKEN` | DM CEO (optionnel — se désactive si absent) | developer.twitter.com |
| `RESEND_WEBHOOK_SECRET` | webhook Resend inbound (optionnel) | `openssl rand -hex 32` |
| `BUFFER_*` | publication sociale (déjà posés probablement) | buffer.com |

> Total ≈ 12 secrets, dont ~5 réellement bloquants pour le cœur web (DATABASE_URL, CRON_SECRET, ANTHROPIC_API_KEY, ADMIN_PASSWORD, RESEND_API_KEY). Les autres débloquent des features spécifiques (CEO email, DM, inbound).

**3. Configs dashboard externes + légal** (one-shot, hors code)
- **Webhook Resend Inbound** (si replies email CEO souhaités) : dashboard Resend → endpoint `https://deviens-marrant.fr/api/webhooks/resend-inbound`, secret = `RESEND_WEBHOOK_SECRET`.
- **3 DPA légaux** (sous-traitants RGPD) : signer les Data Processing Agreements Anthropic, Resend, Neon (action juridique, pas technique).

**C'est tout.** Plus besoin d'insérer la config CEO en SQL, ni de lancer le back-fill à la main, ni de configurer les crons CEO sur Replit Scheduled Deployments (le scheduler interne les couvre). Les sections historiques ci-dessous restent comme référence des phases passées.

---

## Actions Replit — Setup MOBILE V1

> Ce fichier liste toutes les actions manuelles à effectuer par Thomas pour finaliser la V1 mobile (iOS + Android).
> Les livrables code et docs sont déjà produits dans le repo. Cette checklist couvre le "last mile" (comptes développeurs, certificats, premiers builds, submission).

## Hook pre-commit (anti-récidive bugs enum Prisma)

> Ajouté session 8 (commit eeb08f3) après 3 bugs P0 d'affilée sur l'enum `SocialFormat`.

Le hook `.githooks/pre-commit` du repo vérifie 2 choses avant chaque commit :
1. CLAUDE.md section Gradient ≤ 125L (existant)
2. **Cohérence enums Prisma vs usages code** — exécute `scripts/check-prisma-enums.sh` si `schema.prisma` ou `apps/web/src/` modifiés

Pour activer le hook (1 fois par poste local + sur Replit shell) :

```bash
git config core.hooksPath .githooks
```

Sans cette commande, **le hook n'est PAS exécuté** et la protection est inactive. À faire AU PLUS VITE pour ne plus reproduire les bugs MINI_STANDUP / WILD_CARD.

Pour tester manuellement à tout moment :
```bash
bash scripts/check-prisma-enums.sh
```

Si le hook bloque un commit légitime (nouvelle constante interne) → ajouter la valeur à WHITELIST dans `scripts/check-prisma-enums.sh`.

## Fix s10 — Retry Neon cold start (P1 ouvert depuis le 08/04)

> P1 PROD : Neon free tier suspend le compute DB après ~5 min d'inactivité. Au réveil d'un cron sur DB froide, le 1er appel Prisma tapait avant la fin du wake (1-5s) → erreur `P1001 Can't reach database server` → le cron plantait et spammait une alerte email (~toutes les 3h).

**Aucune action Replit requise.** Fix 100% code (Option A, budget 0€) :
- Nouveau helper `apps/web/src/lib/db-retry.ts` (`withDbRetry`) : retry 3× backoff exponentiel (500ms → 1s → 2s) UNIQUEMENT sur erreurs de connexion (`P1001`, `Can't reach database server`, `Connection terminated`, `ECONNREFUSED`, `ETIMEDOUT`). Les autres erreurs (P2002, validation) sont re-throw immédiatement.
- Wrappé sur le 1er appel Prisma des crons : `publish-social`, `social-analytics`, `daily-social`. `ceo-tick` déjà résilient (son `tryAcquireLock` est silent-fail, pas d'alerte).

**Comportement attendu post-deploy** : plus d'alertes email "cron a planté" liées au cold start. Le 1er appel se réveille au retry (~500ms-1.5s) au lieu de planter. Une alerte ne reste émise QUE si la DB est réellement injoignable après 3 tentatives (panne légitime).

**Si le spam persiste après deploy** (très improbable — wake Neon < 5s, budget retry ~1.5s mais pool_timeout=30s couvre la marge) : l'alternative est l'upgrade Neon (plan payant sans suspension du compute), **hors budget actuel**. À arbitrer avec Thomas seulement si le retry s'avère insuffisant en prod.

## Hotfix s10 (06/05/2026) — Bug Buffer rate limit 24h en boucle

> P0 PROD ACTIF. Toutes publications Twitter/LinkedIn/Instagram coupées tant que le rate limit 429 reste actif. Bloque acquisition organique = bloque MRR.

**Diagnostic** : `publish-social/route.ts` a un circuit breaker correct (skip plateformes FAILED 429 sur 24h via `recentRateLimits`), mais `social-analytics/route.ts` interrogeait Buffer SANS check circuit breaker → relance la fenêtre 24h en boucle à chaque exécution (toutes les 15 min côté Replit Scheduled Deployments).

**Fixes appliqués (commit s10)** dans `apps/web/src/app/api/cron/social-analytics/route.ts` :
1. **Time gate utcHour** : exécution effective uniquement aux heures paires (1× toutes les 2h). Bypass debug avec `?force=1`.
2. **Cache module-level 60 min** sur `getBufferScheduledPosts()` — amortit la pression Buffer même si le cron est appelé toutes les 15 min.
3. **Circuit breaker** : si TOUTES les plateformes (Twitter, LinkedIn, Instagram) sont en rate limit 24h (FAILED + `directorNote contains "429"`), on **NE LIT PAS** la queue Buffer. C'est le fix critique anti-boucle.

**Action manuelle Thomas (Replit Console)** :

Dans **Replit > Deployments > Scheduled Deployments**, réduire la fréquence du cron `social-analytics` :
- **Avant** : toutes les 15 min (`*/15 * * * *`)
- **Après** : toutes les 2h (`0 */2 * * *`)

Raison : le time gate interne renvoie `skipped:true` aux heures impaires, mais on évite quand même les invocations inutiles (Replit facture chaque exécution autoscale).

Le cron `publish-social` reste à sa fréquence actuelle (toutes les 30 min) — il n'est pas concerné par ce bug.

**Validation** : 9 nouveaux tests Jest dans `apps/web/src/__tests__/api/cron/social-analytics.test.ts` couvrent les 3 fixes. Lancer :
```bash
cd apps/web && npx jest src/__tests__/api/cron/social-analytics.test.ts
```

---

## Hook pre-commit (existant — rappel)

⚠️ **PRÉREQUIS BLOQUANT** : avant tout, vérifier que la branche `master` est à jour (Réflexe P0 #2).

```bash
git fetch origin
git log master..HEAD --oneline   # diff entre master et la branche actuelle
git show master:apps/web/src/lib/auth.ts | head -50   # vérifier la version déployée
```

Si écart important → résoudre AVANT le premier `cap sync`. Sinon l'app mobile en prod va appeler des endpoints potentiellement obsolètes (risque 6+ semaines de fixes invisibles).

---

## 0. Vue d'ensemble

| Étape | Action | Coût | Temps estimé |
|---|---|---|---|
| 1 | Créer compte Apple Developer | 99€/an | 5-10j (validation Apple) |
| 2 | Créer compte Google Play Console | 25€ one-shot | 1-2j (validation Google) |
| 3 | Créer compte RevenueCat | Gratuit (jusqu'à 10K$ MTR) | 15min |
| 4 | Créer projet Firebase + activer FCM | Gratuit | 30min |
| 5 | Générer clé APNs Apple | Inclus Apple Dev | 15min |
| 6 | Configurer RevenueCat avec App Store + Play | Inclus | 1h |
| 7 | Premier `cap add ios` + `cap add android` | - | 30min |
| 8 | Migration Prisma PushToken + WebhookEvent | - | 10min |
| 9 | Installer package `apn` (APNs serveur) | - | 5min |
| 10 | Créer middleware CORS | - | 15min |
| 11 | Modifier NextAuth cookies SameSite=None | - | 10min |
| 12 | Générer assets (icons + splash) via @capacitor/assets | - | 15min |
| 13 | Premier build iOS via Xcode | Mac requis | 1h |
| 14 | Premier build Android via Android Studio | - | 1h |
| 15 | Upload TestFlight (iOS internal testing) | - | 30min |
| 16 | Upload Play Console Internal Testing | - | 30min |
| 17 | Soumission App Store (review 24-48h) | - | 30min + attente |
| 18 | Soumission Play Store (review 1-7j) | - | 30min + attente |

---

## 1. Compte Apple Developer (99€/an)

1. Aller sur https://developer.apple.com/programs/enroll
2. Choisir "Individual" ou "Organization" (Organization recommandé pour projets pros)
3. Payer 99€
4. **Attente 5-10 jours** pour validation Apple (vérifications identité)
5. Une fois actif, accéder à App Store Connect : https://appstoreconnect.apple.com
6. **Créer une App** :
   - Bundle ID : `fr.deviensmarrant.app`
   - Name : `Deviens Marrant`
   - Primary Language : French
   - SKU : `dm-ios-001`

## 2. Compte Google Play Console (25€)

1. Aller sur https://play.google.com/console/signup
2. Payer 25€ (one-shot, lifetime)
3. **Attente 24-48h** validation Google
4. **Créer une App** :
   - App name : `Deviens Marrant`
   - Default language : Français (France)
   - App or game : App
   - Free or paid : Free (avec achats in-app)

## 3. RevenueCat — Setup IAP unifié

1. Créer compte gratuit : https://app.revenuecat.com/signup
2. Créer un projet "Deviens Marrant"
3. **Onglet Apps** :
   - Add app iOS : `fr.deviensmarrant.app` + uploader le `.p8` In-App Purchase Key (généré dans Apple Developer > Keys)
   - Add app Android : `fr.deviensmarrant.app` + uploader le service account JSON Google Play
4. **Onglet Products** :
   - Créer `premium_monthly` (lié aux deux stores)
   - Créer `premium_yearly` (optionnel V1, recommandé)
5. **Onglet Entitlements** : créer `premium`, lier les 2 products
6. **Onglet Offerings** : créer `default`, ajouter les 2 packages
7. **Onglet API Keys** : copier les 2 clés publiques (iOS + Android)
8. **Onglet Integrations > Webhooks** :
   - URL : `https://deviens-marrant.fr/api/iap/revenuecat-webhook`
   - Authorization Header Name : `Authorization`
   - Authorization Header Value : `Bearer <secret>` (générer un secret 32+ chars)

### Secrets Replit à ajouter

```
NEXT_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxx
NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxx
REVENUECAT_WEBHOOK_SECRET=<même secret que l'URL webhook>
```

## 4. Firebase + FCM (Push Android)

1. Créer projet : https://console.firebase.google.com
2. Add app Android : package `fr.deviensmarrant.app`
3. Télécharger `google-services.json` → placer dans `android/app/` après `cap add android`
4. Project Settings > Cloud Messaging > **Server key** (Legacy)
5. Si Server Key non visible : Cloud Console > APIs & Services > Library > activer "Cloud Messaging API (Legacy)" puis revenir

### Secret Replit

```
FCM_SERVER_KEY=AAAAxxxxx:APA91bxxxxx
```

## 5. APNs (Push iOS)

1. Apple Developer > Certificates, IDs & Profiles > **Keys** > "+"
2. Activer "Apple Push Notifications service (APNs)"
3. Continue + Register
4. **Télécharger le `.p8` UNE SEULE FOIS** (Apple ne permet pas de redownload — sauvegarder)
5. Noter le **Key ID** (10 caractères, ex : ABCD1234XY)
6. Account > Membership > **Team ID** (10 caractères)

### Secrets Replit

```
APNS_KEY_ID=ABCD1234XY
APNS_TEAM_ID=XXXXXXXXXX
APNS_BUNDLE_ID=fr.deviensmarrant.app
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkw...
-----END PRIVATE KEY-----"
```

(Coller le contenu intégral du fichier `.p8`, retours ligne préservés. Replit Secrets supporte les multi-lignes.)

## 6. Migration Prisma — Modèles PushToken + WebhookEvent

Éditer `prisma/schema.prisma` (et la copie `apps/web/prisma/schema.prisma`) :

```prisma
model PushToken {
  id          String   @id @default(cuid())
  token       String   @unique
  platform    String   // "ios" | "android"
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  lastSeenAt  DateTime @default(now())

  @@index([userId])
  @@index([lastSeenAt])
}

// Vérifier si WebhookEvent existe déjà depuis l'audit du 15/03 — sinon ajouter :
model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  provider    String   // "stripe" | "revenuecat"
  eventType   String
  receivedAt  DateTime @default(now())

  @@index([provider, eventType])
}
```

Sur `model User`, ajouter :
```prisma
  pushTokens  PushToken[]
```

Puis :
```bash
cd apps/web
npx prisma db push
npx prisma generate
```

## 7. Installer package `apn` pour APNs serveur

```bash
cd apps/web
npm install apn
```

Puis finaliser `app/api/cron/daily-push/route.ts` fonction `sendAPNS()` selon le snippet documenté dans `docs/mobile/infrastructure-mobile.md` §1.

## 8. Middleware CORS

Créer `apps/web/src/middleware.ts` selon le contenu de `docs/mobile/infrastructure-mobile.md` §5.

## 9. NextAuth cookies SameSite=None

Modifier `apps/web/src/lib/auth.ts` :

```typescript
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
    },
  },
},
useSecureCookies: true,
```

⚠️ Tester en dev (HTTPS local nécessaire — utiliser `mkcert` ou tunnel Cloudflare).

## 10. Build check obligatoire

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build && BUILD_TARGET=mobile npm run build:mobile && npx jest --no-coverage
```

Si échec → corriger avant `cap sync`.

## 11. Capacitor — Premier add iOS + Android

Depuis la racine du projet :

```bash
# Install Capacitor (déjà fait via package.json après les ajouts)
cd apps/web
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android \
  @capacitor/push-notifications @capacitor/share @capacitor/app \
  @capacitor/status-bar @capacitor/splash-screen \
  @revenuecat/purchases-capacitor

# Build mobile (export statique)
BUILD_TARGET=mobile npm run build

# Retour à la racine
cd ../..

# Init (si pas déjà fait — capacitor.config.ts existe déjà)
# npx cap init "Deviens Marrant" "fr.deviensmarrant.app" --web-dir=apps/web/out

# Add platforms
npx cap add ios
npx cap add android

# Sync (copie l'export Web + plugins natifs)
npx cap sync
```

## 12. Génération assets icons + splash

Depuis la racine :

```bash
npm install --save-dev @capacitor/assets

# Convertir SVG → PNG master (si pas encore fait)
# Outil au choix : Figma, Inkscape, rsvg-convert
# Inputs requis dans apps/web/resources/ :
#   - icon.png (1024x1024)
#   - icon-foreground.png (1024x1024 alpha)
#   - icon-background.png (1024x1024)
#   - splash.png (2732x2732)
#   - splash-dark.png (2732x2732)

# Si tu as juste icon.png et splash.png, @capacitor/assets dérive le reste :
npx capacitor-assets generate \
  --iconBackgroundColor "#8B5CF6" \
  --iconBackgroundColorDark "#0F0817" \
  --splashBackgroundColor "#8B5CF6" \
  --splashBackgroundColorDark "#0F0817"
```

## 13. Build iOS (Mac requis)

```bash
npx cap open ios
# → Ouvre Xcode

# Dans Xcode :
# 1. Sélectionner le projet "App" dans le navigator
# 2. Tab "Signing & Capabilities"
#    - Team : ton Apple Developer team
#    - Bundle Identifier : fr.deviensmarrant.app (déjà défini)
#    - Activer "Automatically manage signing"
# 3. Add Capabilities :
#    - Push Notifications
#    - Background Modes > Remote notifications
# 4. Choisir un device "Any iOS Device (arm64)" pour archive
# 5. Product > Archive
# 6. Window > Organizer > Distribute App > App Store Connect > Upload
```

Une fois l'archive uploadée, elle apparaît dans App Store Connect > TestFlight après ~30 minutes (processing).

## 14. Build Android

```bash
npx cap open android
# → Ouvre Android Studio

# Dans Android Studio :
# 1. Build > Generate Signed Bundle / APK > Android App Bundle
# 2. Si pas de keystore : "Create new" — sauvegarder le keystore + mots de passe (CRITIQUE — sans ça pas de mise à jour possible)
# 3. Build variant : release
# 4. Le fichier .aab est dans android/app/release/app-release.aab
```

Recommandation : utiliser **Play App Signing** (Google gère la clé de signing). Plus safe.

## 15. Upload TestFlight (iOS)

1. App Store Connect > ton app > TestFlight
2. Le build uploadé via Xcode apparaît
3. Compléter "Test Information" (Beta App Description, Email)
4. Add Internal Testers (max 100, gratuit, pas de review Apple)
5. Tester sur device réel via app TestFlight
6. **Vérifier** :
   - [ ] Onboarding 5 écrans fluide
   - [ ] Push notif arrive bien à 9h (ou test manuel via cron)
   - [ ] Achat IAP fonctionne en sandbox (créer un Sandbox Tester dans App Store Connect > Users and Access > Sandbox)
   - [ ] Restore Purchases fonctionne
   - [ ] Suppression compte cascade
   - [ ] NextAuth login fonctionne dans le webview

## 16. Upload Play Console Internal Testing

1. Play Console > ton app > Testing > Internal testing
2. Create new release > Upload .aab
3. Add testers (email list)
4. Lien partagé aux testeurs → install via Play Store
5. Tests identiques iOS + spécifiques Android (back button, share intent)

## 17. Soumission App Store (review)

1. App Store Connect > ton app > **App Store** tab
2. Compléter :
   - **App Information** : catégorie Lifestyle, secondary Education
   - **Pricing and Availability** : Free (avec IAP)
   - **App Privacy** : remplir Privacy Nutrition Labels (voir `docs/mobile/legal-mobile.md` §1)
   - **Age Rating** : 12+
3. **Prepare for Submission** :
   - Description (copier `docs/mobile/aso-mobile.md` §1)
   - Keywords (idem)
   - Support URL : `https://deviens-marrant.fr/contact`
   - Marketing URL : `https://deviens-marrant.fr`
   - Privacy Policy URL : `https://deviens-marrant.fr/confidentialite-mobile`
4. **Screenshots** : uploader 5 captures par taille (6.7", 6.5", 5.5")
5. **Build** : sélectionner le build TestFlight validé
6. **In-App Purchases** : créer `premium_monthly` dans App Store Connect (lié à RevenueCat)
7. **Submit for Review**
8. Attente review : 24-48h en général

## 18. Soumission Play Store

1. Play Console > Production > Create new release
2. Promote depuis Internal testing OU upload nouveau .aab
3. Compléter :
   - **Store listing** : titre, description (`docs/mobile/aso-mobile.md` §3), screenshots, feature graphic
   - **Content rating** : remplir le questionnaire (Teen — humour suggestif occasionnel)
   - **Data safety** : remplir form (voir `docs/mobile/legal-mobile.md` §2 tableau)
   - **App content** : Privacy policy URL
   - **Subscriptions** : créer `premium_monthly` (lié RevenueCat)
4. **Send for review**
5. Attente review : 1-7 jours (variable)

---

## Risques persistants — À garder en tête

| # | Risque | Action |
|---|---|---|
| R1 | Master merge non confirmé | Vérifier `git show master:...` AVANT cap sync |
| R2 | IAP -30% commission = -9% MRR estimé | Monitor 90j, ajuster tarif mobile +30% si confirmé |
| R3 | Réflexe P0 #2 — vérifier branche déployée | Tout fix prod : commencer par `git show master:<file>` |

---

## Checklist finale avant submission

- [ ] Master merge confirmé (Réflexe P0 #2)
- [ ] Build web + mobile passent (`npm run build && BUILD_TARGET=mobile npm run build:mobile`)
- [ ] Tests passent (`npx jest --no-coverage`)
- [ ] Migration Prisma effectuée (PushToken + WebhookEvent)
- [ ] Package `apn` installé + sendAPNS finalisé
- [ ] Middleware CORS créé
- [ ] NextAuth cookies SameSite=None
- [ ] 8 secrets Replit ajoutés (FCM, APNs, RevenueCat)
- [ ] CGV mobile en ligne : `https://deviens-marrant.fr/cgv-mobile`
- [ ] Privacy mobile en ligne : `https://deviens-marrant.fr/confidentialite-mobile`
- [ ] Apple Developer + Google Play Console actifs
- [ ] RevenueCat configuré + webhook actif
- [ ] FCM Server Key + APNs `.p8` en place
- [ ] Premier build TestFlight + Play Console Internal validés
- [ ] Sandbox IAP testé avec succès
- [ ] Push notif testée (manuel + cron)

---

## Phase 5.A — CEO Agent — Couche données + agent core (session 10)

> Migration Prisma + squelette agent posé. Cette section liste les actions manuelles Replit pour activer la base CEO en production.
> Source : `docs/product/ceo-agent-specs.md` §2, `docs/ia/ceo-agent-architecture.md`, branche `claude/marrant-s10-ceo-implementation-*`.

### 1. Migration Prisma — créer les 9 tables CEO + extensions User

```bash
# Sur Replit shell, après merge de la branche dans master :
cd apps/web
npx prisma generate
npx prisma migrate deploy   # applique 5_add_ceo_tables/migration.sql
```

Tables créées :
- `CeoConfig` (singleton kill-switch + budget + dryRun)
- `CeoTask` (file de tâches PENDING/RUNNING/DONE/FAILED)
- `CeoMemory` (clé/valeur namespace, mémoire long-terme + TTL court-terme)
- `CeoLead` (CRM léger, score 0-50, status COLD→IN_SEQUENCE→CONVERTED)
- `CeoOutboundMessage` (messages outbound + inbound, UTM tracking)
- `CeoKpiSnapshot` (snapshot quotidien KPIs dashboard /admin/ceo)
- `CeoBacklink` (pitchs + acquisitions backlinks 5 canaux)
- `CeoAuditLog` (RGPD rétention 3 ans, PII hashé SHA256)
- `CeoDedup` (anti-spam 24h, hash SHA256)
- `CeoCommentBlacklist` (humoristes pros + influenceurs >10k + journalistes)
- **+ `SocialPostDailyLock`** (P1 race condition s08/04 — 1 run social/jour)

Colonnes ajoutées sur `User` :
- `lastCeoTouchpoint TIMESTAMP(3)` (fenêtre attribution conversion 7j)
- `emailOptOut BOOLEAN DEFAULT false` (CEO refuse cet utilisateur si true)

Migration **idempotente** : utilise `IF NOT EXISTS` partout. Peut être rejouée sans effet secondaire.

### 2. Seeder initial CeoConfig (kill-switch ON par défaut = SAFE)

Avant le 1er tick CEO, insérer la ligne singleton de config. **Par défaut `enabled = false`** (fail-safe — l'agent ne fait RIEN tant que Thomas ne l'active pas explicitement) :

```sql
-- À exécuter une fois en console Neon ou via prisma studio
INSERT INTO "CeoConfig" (
  "id", "enabled", "dailyBudgetEur", "maxActionsPerTick",
  "autoSendEmail", "autoSendDm", "socialOutboundEnabled", "dryRun", "updatedAt"
) VALUES (
  'ceo-config-singleton', false, 2.0, 3, false, false, false, true, NOW()
)
ON CONFLICT ("id") DO NOTHING;
```

### 3. Nouveaux Secrets Replit à ajouter (Phase 5.A — préparation 5.B)

À mettre dès maintenant dans Replit Secrets (mais pas encore utilisés en Phase 5.A) :

| Secret | Description | Source |
|---|---|---|
| `CEO_KILL_SWITCH_OVERRIDE` | (optionnel) String "true" pour forcer kill-switch même si DB activée | Manuel — dépannage urgence |
| `CEO_ADMIN_EMAIL` | Email destinataire alertes budget + reporting hebdo | `alex@deviens-marrant.fr` |
| `TWITTER_API_KEY` | OAuth dédié CEO (distinct de Buffer) | https://developer.twitter.com Phase 5.B |
| `TWITTER_API_SECRET` | idem | idem |
| `TWITTER_ACCESS_TOKEN` | idem | idem |
| `TWITTER_ACCESS_SECRET` | idem | idem |
| `INSTAGRAM_PAGE_ACCESS_TOKEN` | DMs inbound Business (fenêtre 24h) | Meta Business Suite Phase 5.B |
| `RESEND_INBOUND_WEBHOOK_SECRET` | Validation HMAC webhook Resend Inbound | Resend dashboard Phase 5.B |

**Important** : `TWITTER_*` du CEO doit être un **compte/app distinct** du Buffer daily-social pour éviter les rate limits croisés.

### 4. Vérifier que les tests existants passent

```bash
cd apps/web
npx jest --no-coverage
```

Attendu : **1051/1051 tests passent** (Phase 5.A n'ajoute que des `describe.skip` placeholders, zéro test fonctionnel — ceux-là arrivent en Phase 5.D).

### 5. Préparation Phase 5.B (HORS périmètre Phase 5.A)

À faire en Phase 5.B (prochaine sous-passe) :

- [ ] Créer `/api/cron/ceo-tick` (toutes 2-4h)
- [ ] Créer `/api/cron/ceo-kpis-snapshot` (daily 5h UTC)
- [ ] Créer `/api/ceo/contest` (endpoint art. 22 RGPD)
- [ ] Migrer `apps/web/src/lib/ai/agents/haro-agent.ts` (96 topics + ALEX_BIO + templates) vers le module backlinks de `ceo-agent.ts`
- [ ] Supprimer `haro-agent.ts` + `apps/web/src/app/api/cron/haro/route.ts` après Grep d'orphelins
- [ ] Implémenter `validateCeoOutbound()` dans `standup-director-agent.ts` (gate G-CEO1 anti-surveillance, G-CEO2 anti-FOMO, G-CEO3 valeur éducative > conversion)
- [ ] Intégrations APIs : Twitter v2 DM, Resend Inbound webhook, Instagram Graph
- [ ] Mettre à jour `enforceEmailFooter()` pour les emails CEO (footer opt-out RGPD obligatoire)
- [ ] Implémentation Resend pour envoi rapport hebdo Thomas

### 6. Préparation Phase 5.C / 5.D (HORS périmètre)

- Phase 5.C : Dashboard React `/admin/ceo` (8 composants : timeline, file drafts, funnel, budget, KPIs sem, kill-switch toggle, audit log, leads scoring)
- Phase 5.D : Tests Jest exhaustifs (cible 90% sur `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-validate.ts`)

### Checklist Phase 5.A — done quand :

- [ ] Branche `claude/marrant-s10-ceo-implementation-*` mergée dans master
- [ ] `npx prisma migrate deploy` exécuté avec succès sur Replit (vérifie 11 nouvelles tables + 2 colonnes User)
- [ ] CeoConfig singleton inséré (kill-switch OFF par défaut)
- [ ] 8 nouveaux Secrets Replit ajoutés (vides ok pour Phase 5.A — utilisés en 5.B)
- [ ] Tests existants passent (1051/1051)
- [ ] `runDailySocialJob` lancé une fois → `SocialPostDailyLock` insère 1 ligne (vérifier en console Neon : `SELECT * FROM "SocialPostDailyLock" ORDER BY "createdAt" DESC LIMIT 5;`)

---

## Phase 5.B — CEO Agent — Crons + Director CEO + Footer email + Rapport hebdo (session 10)

### 1. Nouveaux Secrets Replit (BLOQUANTS — à ajouter avant déploiement)

| Secret | Description | Valeur recommandée |
|---|---|---|
| `UNSUBSCRIBE_HMAC_SECRET` | Clé HMAC-SHA256 pour signer les tokens unsubscribe (≥ 32 chars). Si compromis : la rotation invalide tous les liens existants — à générer 1 fois et garder stable. | `openssl rand -hex 32` |
| `ADRESSE_POSTALE` | Adresse postale identifiable pour conformité CPCE L34-5 (footer email obligatoire). Décision Thomas : adresse perso, domiciliation pro, ou formulation minimale type "France". | À trancher par Thomas |
| `CEO_ADMIN_EMAIL` | Email destinataire rapport hebdo CEO (Opus 4.7 lundi) | `alex@deviens-marrant.fr` (par défaut) |
| `NEXT_PUBLIC_BASE_URL` | URL base pour construire les liens unsubscribe (déjà existant probablement) | `https://deviens-marrant.fr` |

**Sans `UNSUBSCRIBE_HMAC_SECRET` configuré** : `enforceEmailFooter()` throw → tout envoi email CEO échoue (BLOQUANT pré-S3 conforme audit @legal).

### 2. Configurer les nouveaux crons Replit (Scheduled Deployments)

| Cron | Fréquence | Endpoint | Header auth |
|---|---|---|---|
| `ceo-tick` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-tick` | `Authorization: Bearer $CRON_SECRET` |
| `ceo-kpis-snapshot` | Toutes les heures | `GET https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot` | `Authorization: Bearer $CRON_SECRET` |

**Time gate côté code** :
- `ceo-tick` ne s'exécute QUE entre 2h et 4h59 UTC (sinon retourne `skipped: out-of-window`)
- `ceo-kpis-snapshot` ne s'exécute QUE à 5h UTC (sinon `skipped: out-of-window`)

→ Sur Replit, configurer un cron horaire suffit (les autres heures retournent immédiatement, coût négligeable).

**Pour tester manuellement (force exécution hors fenêtre)** :
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"
curl -H "Authorization: Bearer $CRON_SECRET" "https://deviens-marrant.fr/api/cron/ceo-kpis-snapshot?force=true"
```

### 3. Endpoint manuel `/api/ceo/contest` (art. 22 RGPD)

Pas de cron — endpoint admin manuel utilisable depuis le futur dashboard `/admin/ceo` (Phase 5.C) ou via curl :

```bash
curl -X POST https://deviens-marrant.fr/api/ceo/contest \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"messageId":"<id>", "reason":"Ton trop directif sur le P3"}'
```

Effet : `CeoOutboundMessage.status = REJECTED`, audit log + blocage envoi.

### 4. Tester le footer email + désinscription

Après déploiement, vérifier que le pipeline complet fonctionne :

```bash
# 1. Lancer un tick CEO en force pour générer un draft email
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://deviens-marrant.fr/api/cron/ceo-tick?force=true"

# 2. Vérifier dans la DB que le footer est présent dans le content
psql $DATABASE_URL -c "SELECT content FROM \"CeoOutboundMessage\" ORDER BY \"createdAt\" DESC LIMIT 1;" | grep "CEO_FOOTER_V1"

# 3. Tester le lien unsubscribe (récupérer un token signé du draft)
# Le token est dans le HTML : <a href=".../api/unsubscribe?token=XXX">
curl -i "https://deviens-marrant.fr/api/unsubscribe?token=<token>"
# Attendu : 200 + page HTML "Désinscription confirmée"
```

### 5. Vérifier conformité Audit @legal s9 (BLOQUANT pré-S3)

- [ ] `enforceEmailFooter()` appelé dans `composeOutboundMessage()` AVANT `dualPassValidate()` (déjà câblé Phase 5.B)
- [ ] Footer contient adresse postale identifiable (`ADRESSE_POSTALE` configuré)
- [ ] Lien désinscription token signé HMAC valide
- [ ] Mention "Tu reçois cet email parce que tu t'es inscrit·e..." (CPCE L34-5)
- [ ] User.emailOptOut respecté dans `handleOutboundEmail` (skip envoi si true)
- [ ] CeoLead.optOut + status OPT_OUT respectés

### 6. HORS périmètre Phase 5.B (gardé pour 5.B.2 / 5.C / 5.D)

À faire en Phase 5.B.2 :
- [ ] Twitter v2 DM API (auth OAuth + send DM + Resend Inbound webhook)
- [ ] Instagram Graph API (drafts permanents)
- [ ] Suppression `haro-agent.ts` (migration des 96 topics + ALEX_BIO + templates → module backlinks CEO)
- [ ] Remplacement scraping Connectively/SourceBottle par RSS/Zapier (recommandation @legal)
- [ ] Lead scoring auto (signaux Umami + DB `User.streak`/`JokeLike`)

À faire en Phase 5.C :
- [ ] Dashboard React `/admin/ceo` (8 composants — cf docs/analytics/ceo-kpis-dashboard.md)
- [ ] UI contest message (bouton "Contester" sur chaque draft)
- [ ] UI kill-switch toggle

À faire en Phase 5.D :
- [ ] Tests Jest exhaustifs (cible 90% coverage `ceo-agent.ts`, `ceo-helpers.ts`, `ceo-email-footer.ts`)
- [ ] Tests E2E pipeline complet (draft → validation → footer → send → unsubscribe)

### 7. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

Sur Replit avant tout commit :

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

Si une commande échoue → corriger AVANT de commiter. Phase 5.B introduit 4 nouveaux fichiers + 3 modifs (ceo-agent.ts, ceo-helpers.ts, standup-director-agent.ts) — toute erreur TypeScript doit être traitée.

### Checklist Phase 5.B — done quand :

- [ ] 4 nouveaux Secrets Replit configurés (`UNSUBSCRIBE_HMAC_SECRET`, `ADRESSE_POSTALE`, `CEO_ADMIN_EMAIL`, `NEXT_PUBLIC_BASE_URL`)
- [ ] 2 crons configurés sur Replit Scheduled Deployments (ceo-tick, ceo-kpis-snapshot)
- [ ] `npx prisma migrate deploy` re-exécuté (rien de nouveau Phase 5.B mais idempotent OK)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `?force=true` sur les 2 crons → réponses JSON success
- [ ] Test manuel `/api/unsubscribe?token=...` → page HTML "Désinscription confirmée"
- [ ] Test manuel `POST /api/ceo/contest` → 200 + audit log inséré
- [ ] Vérifier en DB qu'un draft email contient bien le marker `CEO_FOOTER_V1`

---

## Phase 5.B.2 — APIs externes CEO (Twitter v2 DM + Resend Inbound + suppression haro-agent)

> Livrée session 9 (3e sous-passe Phase 5). Couvre l'envoi LIVE de DMs Twitter
> + la réception de replies email Resend + la migration haro-agent → ceo-backlinks.

### 1. Nouveaux Replit Secrets (BLOQUANT)

```
TWITTER_BEARER_TOKEN=AAAA...      # OAuth 2.0 Bearer (lookup user OK, DM POST exige user-context)
RESEND_WEBHOOK_SECRET=<32+ chars> # HMAC SHA-256 — généré via `openssl rand -hex 32`
```

**Note Twitter user-context (DM POST)** : le Bearer suffit pour `lookupTwitterUserId`, mais `POST /2/dm_conversations/...` exige OAuth 1.0a User Context en prod. Si Twitter retourne 401 sur le DM send, ajouter aussi :
```
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
```
(Phase 5.B.3 — pour l'instant le Bearer reste le default, on log 401 et on traitera quand ça arrive.)

### 2. Configuration webhook Resend Inbound

Dashboard Resend → Webhooks :
1. Endpoint : `https://deviens-marrant.fr/api/webhooks/resend-inbound`
2. Events : `email.received` (inbound replies)
3. Signing secret : utiliser la valeur mise dans `RESEND_WEBHOOK_SECRET`
4. Test : Resend permet d'envoyer un payload test → vérifier 200 OK + entrée dans `CeoOutboundMessage` direction=`INBOUND_REPLY`

Si Resend Inbound n'est pas activé sur le compte (pricing payant), reporter en Phase 5.B.3 — le code est prêt et inerte sans webhook envoyé.

### 3. Suppression du cron HARO

Replit Scheduled Deployments → Supprimer le cron `/api/cron/haro` (s'il existait). La route est supprimée du code (404 sinon). Le module `haro-agent.ts` est remplacé par `ceo-backlinks.ts` (96 topics + bio collective + 8 templates) et la fonction `pitchToBacklinkOpportunity()` exposée par `ceo-agent.ts`.

### 4. Pre-commit check (BLOQUANT — Règle n°6 CLAUDE.md)

```bash
cd apps/web
npx tsc --noEmit && npx next lint && npm run build
```

3 nouveaux fichiers Phase 5.B.2 :
- `apps/web/src/lib/ai/ceo-backlinks.ts`
- `apps/web/src/lib/twitter/twitter-client.ts`
- `apps/web/src/app/api/webhooks/resend-inbound/route.ts`

2 fichiers modifiés :
- `apps/web/src/lib/ai/agents/ceo-agent.ts` (ajout `pitchToBacklinkOpportunity`, complétion `handleOutboundDm`, routage `DRAFT_DM_REPLY`)
- `apps/web/src/__tests__/lib/ceo-backlinks.test.ts` (remplace `haro-agent.test.ts`)

2 fichiers supprimés :
- `apps/web/src/lib/ai/agents/haro-agent.ts`
- `apps/web/src/app/api/cron/haro/route.ts`
- `apps/web/src/__tests__/lib/haro-agent.test.ts`

### 5. Checklist Phase 5.B.2 — done quand :

- [ ] 2 nouveaux Secrets configurés (`TWITTER_BEARER_TOKEN`, `RESEND_WEBHOOK_SECRET`)
- [ ] Webhook Resend configuré dashboard + test ping 200 OK
- [ ] Cron `/api/cron/haro` supprimé de Replit Scheduled Deployments
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Test manuel `POST /api/webhooks/resend-inbound` avec signature valide → entrée `CeoOutboundMessage direction=INBOUND_REPLY`
- [ ] Test manuel reply contenant "stop" → `User.emailOptOut=true` + `CeoLead.status=OPT_OUT`
- [ ] Tests Jest `ceo-backlinks.test.ts` PASS

### Hors périmètre Phase 5.B.2 (reporté Phase 5.B.3) :

- [ ] Instagram Graph API (drafts permanents)
- [ ] Lead scoring auto (signaux Umami + User.streak/JokeLike)
- [ ] Câblage `siteReturn48h` dans `snapshotCeoKpis` (Umami cross-session)
- [ ] Routage IA des replies entrants (le webhook persiste seulement)
- [ ] Twitter OAuth 1.0a User Context (si DM POST retourne 401 avec Bearer)
- [ ] Remplacement scraping Connectively → RSS/Zapier (handoff manuel Thomas, hors code)

---

## Phase 5.C — Dashboard `/admin/ceo` (frontend)

### Aucun nouveau Secret requis

L'auth utilise le `ADMIN_PASSWORD` existant (mêmes Bearer headers que `/admin/social`).
Aucune action env / Secrets / cron à effectuer côté Replit.

### Vérification post-déploiement

1. Aller sur `https://deviens-marrant.fr/admin/ceo`
2. Login avec `ADMIN_PASSWORD`
3. Vérifier que les 6 onglets se chargent : Tâches, Brouillons, Funnel 30j, KPIs, Backlinks, Audit
4. Si vide partout → c'est normal tant que la Phase 5.B.2 backend n'a pas tourné (pas de tasks, pas de drafts, pas de snapshots KPI)
5. Tester le toggle kill-switch (peut être OFF/ON sans risque tant que `dryRun=true` dans `CeoConfig`)

### Fichiers ajoutés Phase 5.C (frontend uniquement) :

- `apps/web/src/app/admin/ceo/page.tsx`
- `apps/web/src/components/admin/ceo/types.ts`
- `apps/web/src/components/admin/ceo/CeoHeader.tsx`
- `apps/web/src/components/admin/ceo/CeoTasksList.tsx`
- `apps/web/src/components/admin/ceo/CeoDraftsList.tsx`
- `apps/web/src/components/admin/ceo/CeoFunnel.tsx`
- `apps/web/src/components/admin/ceo/CeoKpiPanel.tsx`
- `apps/web/src/components/admin/ceo/CeoBacklinksList.tsx`
- `apps/web/src/components/admin/ceo/CeoAuditLog.tsx`
- `apps/web/src/app/api/admin/ceo/_helpers.ts`
- `apps/web/src/app/api/admin/ceo/data/route.ts`
- `apps/web/src/app/api/admin/ceo/kill-switch/route.ts`
- `apps/web/src/app/api/admin/ceo/run-task/route.ts`
- `apps/web/src/app/api/admin/ceo/approve/route.ts`
- `apps/web/src/app/api/admin/ceo/reject/route.ts`
- `apps/web/src/app/api/admin/ceo/contest/route.ts`
- `apps/web/src/__tests__/feature/CeoHeader.test.tsx`
- `apps/web/src/__tests__/feature/CeoDraftsList.test.tsx`
- `apps/web/src/__tests__/feature/CeoKpiPanel.test.tsx`

### Checklist Phase 5.C — done quand :

- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
- [ ] Tests Jest `CeoHeader / CeoDraftsList / CeoKpiPanel` PASS
- [ ] `/admin/ceo` accessible avec ADMIN_PASSWORD
- [ ] Kill-switch toggle fonctionnel (test ON → OFF → ON, vérifier `CeoConfig.enabled` en DB)
- [ ] Phase 5.D (tests exhaustifs) à lancer ensuite

## Hotfix s9 deploy bugs (07/05/2026 — TSC FAIL 30+ erreurs)

Découvert lors du `npx tsc --noEmit` post-merge de la branche s9. Mix de :
- Bugs Phase 5.A/B nouveaux (4) : casts SocialPlatform/SocialFormat, Prisma.InputJsonValue, union type outcome
- Bugs latents Phase 5 mobile session 7 (3) : `PushToken` model jamais déclaré, `WebhookEvent.eventId` champ jamais ajouté, ces erreurs masquées par `next.config.js ignoreBuildErrors:true` en build (tsc --noEmit ne triche pas)
- Configs (3) : tsconfig target trop bas (Set/Map iteration + regex `s` flag), `@types/jest` absent, `auth-cta` size "default" obsolète

### Actions Replit après merge du commit hotfix

```bash
# 1. Re-installer (pour @types/jest ajouté)
cd apps/web && npm install

# 2. Re-générer le client Prisma (pour PushToken + WebhookEvent.eventId)
npx prisma generate

# 3. Appliquer la nouvelle migration (idempotente — peut être rejouée sans casser)
npx prisma migrate deploy

# 4. Pre-commit check obligatoire (Règle n°6 CLAUDE.md)
npx tsc --noEmit && npx next lint && npm run build
```

### Migration `6_fix_pushtoken_webhookevent_schema/migration.sql`

Idempotente :
- `WebhookEvent` : ajout `eventId` UNIQUE + `provider` + `eventType` + `receivedAt` (backfill `eventId = id` pour rows existants)
- `PushToken` : nouveau modèle (id, userId, token UNIQUE, platform, lastSeenAt, createdAt) + FK `User.id` ON DELETE CASCADE

### Checklist hotfix done quand
- [ ] `npm install` réussit (lock file mis à jour)
- [ ] `npx prisma generate` régénère le client avec `pushToken` et `webhookEvent.eventId`
- [ ] `npx prisma migrate deploy` applique migration 6 sans erreur
- [ ] `npx tsc --noEmit` retourne 0 erreur
- [ ] `npx next lint` passe (warnings OK, errors NOK)
- [ ] `npm run build` réussit
- [ ] Smoke test : POST `/api/cron/ceo-tick?force=true` → 200 + JSON success

---

## Phase 1b — Vannes pédagogiques : décryptage des 289 vannes (session 10)

> Phase 1a (schéma `Joke.comedyTechnique/techniqueExplanation/howToApply` + agent `generateJokeDecryptage` + migration `7_add_joke_decryptage`) déjà livrée et mergée.
> Phase 1b : affichage UI du décryptage dans le catalogue + **application automatique au boot** des 289 décryptages pré-rédigés.

### Aucune action manuelle requise — c'est appliqué au boot

Les 289 décryptages sont rédigés à la main et bundlés dans `apps/web/src/data/joke-decryptages.json`
(indexés par `content`). À chaque déploiement, ~30 s après le boot, `applyJokeDecryptagesTask()`
(`lib/startup-tasks.ts`) applique les 3 champs (`comedyTechnique`, `techniqueExplanation`,
`howToApply`) à toutes les vannes `comedyTechnique IS NULL`, **en une passe, SANS IA, SANS coût**.

- **Instantané** : le catalogue est décrypté intégralement dès le démarrage (pas de progressif 50/jour).
- **Idempotent** : ne touche que les vannes null → relançable, 0 effet une fois appliqué.
- **Robuste** : `withDbRetry` (cold start Neon) + try/catch global → ne bloque jamais le boot.
- **Log attendu** : `[startup] décryptages appliqués : 289/289.`

> La migration `7_add_joke_decryptage` (3 colonnes nullable) est appliquée par `prisma db push`
> au build. Le décryptage des données suit au boot.

### Nouvelles vannes quotidiennes (IA conservée)

`generateJokeDecryptage` (Sonnet) reste actif **uniquement** pour les NOUVELLES vannes générées
chaque jour par `generateDailyJoke` : elles reçoivent leur décryptage à la génération. Le catalogue
existant, lui, n'appelle plus jamais l'IA.

### Script manuel (optionnel, debug)

`apps/web/scripts/backfill-joke-decryptage.ts` reste lançable à la main si besoin :

```bash
cd apps/web
npx tsx scripts/backfill-joke-decryptage.ts            # ré-applique depuis le fichier (SANS IA, défaut)
npx tsx scripts/backfill-joke-decryptage.ts --dry-run  # log sans écrire
npx tsx scripts/backfill-joke-decryptage.ts --ai       # fallback IA pour les vannes ABSENTES du fichier
```

### Vérification

```bash
# Doit retourner 0 (toutes les vannes du catalogue sont décryptées)
psql $DATABASE_URL -c "SELECT count(*) FROM \"Joke\" WHERE \"comedyTechnique\" IS NULL AND \"isActive\" = true;"
```

Puis dans le catalogue `https://deviens-marrant.fr/vannes` : cliquer une vanne pour révéler
la chute → un bloc "Pourquoi ça marche — [technique]" + "À toi de jouer" apparaît sous la chute.

### Checklist Phase 1b — done quand :

- [ ] Migration 7 appliquée (via `prisma db push` au build)
- [ ] Au boot, log `[startup] décryptages appliqués : 289/289.`
- [ ] `count(*) WHERE comedyTechnique IS NULL AND isActive` = 0
- [ ] Vérif visuelle catalogue (bloc décryptage affiché)
- [ ] `npx tsc --noEmit && npx next lint && npm run build` PASS
