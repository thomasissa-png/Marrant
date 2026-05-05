# Actions Replit — Setup MOBILE V1

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
