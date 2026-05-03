# Infrastructure mobile — Push, CI, env vars

> Setup serveur / cron / CI pour supporter la V1 mobile iOS + Android.

## 1. Push notifications quotidiennes

### Architecture

```
Cron Replit (8h UTC) → POST /api/cron/daily-push?secret=CRON_SECRET
  → Récupère DailyContent du jour (vanne)
  → Récupère tous les PushToken actifs (lastSeenAt < 60j)
  → Pour chaque token Android : POST FCM https://fcm.googleapis.com/fcm/send
  → Pour chaque token iOS : HTTP/2 vers APNs api.push.apple.com avec JWT
```

### Configuration cron Replit

Ajouter dans le scheduler Replit :
- **URL** : `https://deviens-marrant.fr/api/cron/daily-push?secret=$CRON_SECRET`
- **Méthode** : POST
- **Schedule** : `0 8 * * *` (8h UTC = 9h heure Paris hiver / 10h été)
- **Timeout** : 60s (suffisant pour batch de quelques milliers de tokens)

### Setup Firebase Cloud Messaging (Android)

1. Créer un projet Firebase : https://console.firebase.google.com
2. Ajouter une app Android : package name `fr.deviensmarrant.app`
3. Télécharger `google-services.json` et le placer dans `android/app/` (sera fait au premier `cap add android`)
4. Project Settings > Cloud Messaging > Server key → ajouter dans Replit Secrets : `FCM_SERVER_KEY`
5. Vérifier que l'API "Cloud Messaging" est activée dans Google Cloud Console

### Setup APNs (iOS)

1. Apple Developer > Certificates, IDs & Profiles > Keys > "+"
2. Activer "Apple Push Notifications service (APNs)"
3. Télécharger la clé `.p8` (UNE SEULE FOIS — la sauvegarder)
4. Noter le **Key ID** (ex : ABC123XYZ)
5. Noter le **Team ID** depuis Account > Membership
6. Ajouter dans Replit Secrets :
   - `APNS_KEY_ID` : Key ID
   - `APNS_TEAM_ID` : Team ID
   - `APNS_BUNDLE_ID` : `fr.deviensmarrant.app`
   - `APNS_PRIVATE_KEY` : contenu intégral du fichier `.p8` (BEGIN PRIVATE KEY ... END PRIVATE KEY)

### Implémentation APNs serveur (à finaliser)

Le squelette dans `app/api/cron/daily-push/route.ts` log seulement. Pour l'envoi réel, deux options :

**Option A — Package npm `apn`** (plus simple) :
```bash
cd apps/web && npm install apn
```

```typescript
import apn from "apn";

const provider = new apn.Provider({
  token: {
    key: process.env.APNS_PRIVATE_KEY,
    keyId: process.env.APNS_KEY_ID,
    teamId: process.env.APNS_TEAM_ID,
  },
  production: true, // false en dev/sandbox
});

const notification = new apn.Notification();
notification.alert = { title, body };
notification.topic = process.env.APNS_BUNDLE_ID;
notification.payload = { deepLink };
notification.sound = "default";

const result = await provider.send(notification, deviceToken);
```

**Option B — Implémentation manuelle HTTP/2 + JWT** : plus complexe mais zero dependency. À envisager si on veut éviter le package.

Recommandation V1 : Option A.

## 2. RevenueCat — Webhook IAP

### Setup

1. Créer compte RevenueCat : https://app.revenuecat.com
2. Créer un projet "Deviens Marrant"
3. Ajouter les apps :
   - iOS : `fr.deviensmarrant.app` + App Store Connect API key
   - Android : `fr.deviensmarrant.app` + Google Play service account JSON
4. Configurer les Products :
   - `premium_monthly` (mensuel)
   - `premium_yearly` (annuel)
5. Configurer une Entitlement : `premium`
6. Lier les Products à l'Entitlement
7. Créer un Offering "default" avec les 2 packages
8. Récupérer les API keys publiques (différentes iOS / Android)
9. Configurer le webhook : Settings > Integrations > Webhooks > Custom Webhook
   - URL : `https://deviens-marrant.fr/api/iap/revenuecat-webhook`
   - Authorization Header Name : `Authorization`
   - Authorization Header Value : `Bearer $REVENUECAT_WEBHOOK_SECRET`

### Variables Replit Secrets

```
NEXT_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxxxxxx
NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxx
REVENUECAT_WEBHOOK_SECRET=<générer un secret robuste 32+ chars>
```

## 3. Variables d'environnement à ajouter dans Replit Secrets

| Variable | Source | Usage |
|---|---|---|
| `FCM_SERVER_KEY` | Firebase Console > Cloud Messaging | Cron daily-push Android |
| `APNS_KEY_ID` | Apple Developer > Keys | Cron daily-push iOS |
| `APNS_TEAM_ID` | Apple Developer > Membership | Cron daily-push iOS |
| `APNS_BUNDLE_ID` | `fr.deviensmarrant.app` | Cron daily-push iOS |
| `APNS_PRIVATE_KEY` | Fichier `.p8` Apple | Cron daily-push iOS |
| `NEXT_PUBLIC_REVENUECAT_API_KEY_IOS` | RevenueCat dashboard | Client iOS IAP |
| `NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID` | RevenueCat dashboard | Client Android IAP |
| `REVENUECAT_WEBHOOK_SECRET` | Généré par Thomas | Auth webhook server |

Variables existantes à NE PAS modifier :
- `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_*`, `RESEND_API_KEY`, `CRON_SECRET`, `ADMIN_PASSWORD`, `BUFFER_*`

## 4. Schema Prisma — Ajouts mobile

Deux modèles à ajouter au schema (et propager via `prisma db push`) :

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

model WebhookEvent {
  id          String   @id @default(cuid())
  eventId     String   @unique
  provider    String   // "stripe" | "revenuecat"
  eventType   String
  receivedAt  DateTime @default(now())

  @@index([provider, eventType])
}
```

Ajouter sur `model User` :
```prisma
  pushTokens  PushToken[]
```

(WebhookEvent existait peut-être déjà depuis l'audit du 15/03 — vérifier dans le schema actuel)

## 5. CORS — Backend Replit

Pour permettre les fetch depuis le webview Capacitor (`capacitor://localhost` iOS et `https://localhost` Android), ajouter un middleware CORS pour les routes `/api/*`.

Fichier : `apps/web/src/middleware.ts` (à créer ou étendre)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "https://deviens-marrant.fr",
  "https://www.deviens-marrant.fr",
  "capacitor://localhost",
  "https://localhost",
  "http://localhost:5000", // dev local
];

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";

  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const res = NextResponse.next();
  if (allowedOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
```

## 6. NextAuth cookies — Modification critique

Pour que NextAuth fonctionne dans le webview Capacitor (cross-origin), modifier `apps/web/src/lib/auth.ts` :

```typescript
export const authOptions: NextAuthOptions = {
  // ... reste de la config
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none", // ⚠️ critique pour Capacitor
        path: "/",
        secure: true,     // ⚠️ obligatoire avec sameSite: none
      },
    },
  },
  useSecureCookies: true,
};
```

Tester en dev (HTTPS local nécessaire — sinon SameSite=None ne fonctionne pas).

## 7. CI/CD — GitHub Actions

Fichier : `.github/workflows/build-mobile.yml`

```yaml
name: Build Mobile

on:
  push:
    branches: [master, claude/*]
  pull_request:
    branches: [master]

jobs:
  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: apps/web/package-lock.json
      - run: cd apps/web && npm ci
      - run: cd apps/web && npx tsc --noEmit
      - run: cd apps/web && npx next lint
      - run: cd apps/web && npm run build
      - run: cd apps/web && npx jest --no-coverage --bail

  build-mobile-export:
    runs-on: ubuntu-latest
    needs: build-web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: apps/web/package-lock.json
      - run: cd apps/web && npm ci
      - run: cd apps/web && npm run build:mobile
      - uses: actions/upload-artifact@v4
        with:
          name: web-static-export
          path: apps/web/out
```

Note : la compilation iOS/Android native nécessite Xcode (macOS) et Android SDK. Pour V1 → builds natifs faits localement par Thomas (voir `REPLIT_ACTIONS.md`).

## 8. Monitoring post-launch

- **Crashlytics** : Firebase Crashlytics activable plus tard (V2)
- **RevenueCat dashboard** : conversions IAP, MRR, churn (inclus dans le compte)
- **Umami** : events mobile via API (pas de SDK Capacitor — fetch côté client)
- **Replit logs** : monitoring des crons daily-push, webhooks RevenueCat

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/infrastructure-mobile.md`
- **Décisions clés** :
  - APNs via package `apn` (option A, pragmatique V1)
  - Cron daily-push à 8h UTC (= 9h Paris hiver)
  - 8 nouvelles variables Replit Secrets
  - 2 nouveaux modèles Prisma (PushToken, WebhookEvent ou réutilisation)
  - CORS middleware critique pour webview
  - NextAuth `SameSite=None; Secure` obligatoire
- **Points d'attention** :
  - APNs setup nécessite Apple Developer account (last mile Thomas)
  - FCM gratuit illimité, APNs gratuit illimité
  - Tester NextAuth en webview avant submission (risque ITP iOS)
- **Prochaines étapes** : Lot 2 — qa valide build mobile en CI ; Lot 3 — reviewer audit conformité
