# Cartographie fetch endpoints — Track Mobile

> Audit produit en session 7 (autopilote mobile).
> Objectif : lister tous les fetch côté client à patcher pour passer par `lib/api-base.ts`.

## Résumé

- **Mode mobile (Capacitor)** : l'app est servie depuis le bundle local (`webDir: apps/web/out`) via `capacitor://localhost` (iOS) ou `https://localhost` (Android). Les fetch relatifs (`/api/...`) ne fonctionnent PAS — ils tapent le webview localhost qui n'a pas de backend.
- **Solution** : helper `apiBase()` qui retourne :
  - `''` (string vide) en mode web (preserve les fetch relatifs)
  - `'https://deviens-marrant.fr'` en mode mobile (`Capacitor.isNativePlatform() === true`)
- **Pattern à appliquer** : remplacer `fetch('/api/xxx')` par `fetch(\`${apiBase()}/api/xxx\`)` dans tous les composants client uniquement.

## Endpoints à patcher (composants client)

| Zone | Endpoint | Fichier(s) probable(s) | Priorité |
|---|---|---|---|
| Auth | `/api/auth/register` | `src/app/auth/register/page.tsx` | P0 |
| Auth | `/api/auth/forgot-password` | `src/app/auth/forgot-password/page.tsx` | P0 |
| Favoris | `/api/favorites` (GET/POST/DELETE) | `src/components/feature/favorite-button.tsx`, `src/stores/favorites-store.ts` | P0 |
| Vannes | `/api/jokes/like` | `src/components/feature/jokes-list.tsx` | P0 |
| Parcours | `/api/parcours/[id]/progress` | `src/components/feature/parcours-list.tsx`, `src/components/dashboard/profil-dashboard.tsx` | P0 |
| Quiz | `/api/quiz/result` | `src/components/feature/humor-quiz.tsx` | P0 |
| Stripe | `/api/stripe/checkout` | `src/components/marketing/premium-cta.tsx` | À DÉSACTIVER en mobile (IAP à la place) |
| Stripe | `/api/stripe/portal` | `src/components/dashboard/profil-dashboard.tsx` | À DÉSACTIVER en mobile |
| User | `/api/user/me` | `src/stores/user-store.ts` | P0 |
| Daily | `/api/daily-content` | `src/components/dashboard/daily-content.tsx` | P0 |
| Push (NEW) | `/api/push/register-token` | composant onboarding mobile (à créer) | P0 mobile-only |
| IAP (NEW) | `/api/iap/revenuecat-webhook` | webhook serveur (pas client) | exclu — server-side |

> Note : la liste exacte sera vérifiée par grep en CI. Le pattern de migration est invariant — un seul helper centralisé suffit.

## Endpoints à exclure du patch

| Type | Raison |
|---|---|
| `fetch` dans `src/app/api/**/route.ts` | Server-side — tournent sur Vercel/Replit, pas dans le webview |
| `fetch` dans Server Components (`async function Page()`) | Server-side rendering — exécution au build time (export statique) ou côté serveur |
| `fetch` SSR/SSG dans `getStaticProps`, `generateStaticParams` | Build-time uniquement |
| Webhooks (Stripe, RevenueCat) | Reçus côté serveur, pas appelés depuis le client |

## Plan de migration (exécuté en Lot 1)

### Étape 1 — Créer le helper

Fichier : `apps/web/src/lib/api-base.ts`

```typescript
import { Capacitor } from "@capacitor/core";

const PROD_API_URL = "https://deviens-marrant.fr";

/**
 * Retourne le base URL à utiliser pour les fetch :
 * - Mode mobile (Capacitor native) : URL absolue de production
 * - Mode web : string vide (les fetch restent relatifs)
 */
export function apiBase(): string {
  if (typeof window === "undefined") return ""; // SSR/SSG : relatif
  try {
    if (Capacitor.isNativePlatform()) return PROD_API_URL;
  } catch {
    // Capacitor non chargé en dev web pur : ignorer
  }
  return "";
}

/**
 * Helper de fetch typé qui prepend automatiquement le base URL.
 * Usage : await api("/api/jokes/like", { method: "POST", body: ... })
 */
export async function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${apiBase()}${path}`, {
    ...init,
    credentials: "include", // cookies cross-origin (NextAuth JWT)
  });
}
```

### Étape 2 — Configurer CORS côté backend

Le backend Next.js doit accepter les requêtes cross-origin depuis `capacitor://localhost` et `https://localhost` (origines webview).

Ajouter middleware dans `apps/web/src/middleware.ts` (ou ajuster headers Next config) pour les routes `/api/*` :

```typescript
const ALLOWED_ORIGINS = [
  "https://deviens-marrant.fr",
  "capacitor://localhost",
  "https://localhost",
];
```

Header de réponse : `Access-Control-Allow-Credentials: true` + `Access-Control-Allow-Origin: <origin si dans liste>`.

### Étape 3 — Configurer NextAuth pour cookies cross-site

Dans `apps/web/src/lib/auth.ts` :
- `cookies.sessionToken.options.sameSite = "none"` (au lieu de "lax")
- `cookies.sessionToken.options.secure = true`
- `useSecureCookies = true`

Sans ça, le cookie de session NextAuth ne sera pas envoyé depuis le webview Capacitor.

### Étape 4 — Migrer les fetch côté client

Remplacement à appliquer partout dans `apps/web/src/components/`, `apps/web/src/stores/`, `apps/web/src/hooks/` (composants client uniquement, fichiers avec `"use client"`) :

```diff
- await fetch("/api/favorites", { method: "POST", ... })
+ await api("/api/favorites", { method: "POST", ... })
```

Import : `import { api } from "@/lib/api-base";`

Commande de vérification post-migration (à lancer en CI) :

```bash
grep -rn "fetch(['\"]\/api/" apps/web/src/components apps/web/src/stores apps/web/src/hooks
# Doit retourner zéro résultat (tous migrés vers api())
```

### Étape 5 — Cas spécifique Stripe → IAP en mobile

`PremiumCta` et le bouton "Gérer mon abonnement" doivent détecter le mode :

```typescript
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

// Mobile : afficher bouton "Acheter via Apple/Google"
// Web : afficher bouton "Stripe Checkout"
```

Voir `lib/iap.ts` (RevenueCat wrapper) produit en Lot 1.

## Risques identifiés

| Risque | Mitigation |
|---|---|
| Cookies NextAuth bloqués en webview iOS (ITP — Intelligent Tracking Prevention) | Utiliser `SameSite=None; Secure`, vérifier que le domaine est dans la liste `WKWebView.allowedDomains`. Tester en sandbox iOS |
| CORS preflight rejeté en localhost Capacitor | Whitelister explicitement les 2 origines (`capacitor://localhost` et `https://localhost`) |
| Master merge non confirmé | Risque R1 du plan d'orchestration : code mobile risque de tourner sur backend obsolète. À vérifier AVANT submission |

## Handoff → @orchestrator

- **Fichier produit** : `docs/mobile/fetch-audit.md`
- **Décisions clés** :
  - Helper unique `lib/api-base.ts` (pattern centralisé, simple à maintenir)
  - CORS à configurer pour 2 origines webview supplémentaires
  - NextAuth cookies en `SameSite=None; Secure` (préalable critique)
  - Stripe désactivé en mobile (IAP via RevenueCat à la place)
- **Points d'attention** :
  - La liste des fichiers à patcher en Étape 4 doit être finalisée par grep en CI lors du Lot 1 (commande fournie)
  - Vérifier le comportement NextAuth en webview iOS — risque ITP
- **Prochaines étapes** : Lot 1 — @fullstack applique le plan de migration en 5 étapes
