# Variables d'environnement : Cloudflare Workers (migration étape B)

Inventaire exhaustif des variables lues par le code (`grep process.env` sur `apps/web/src`, `apps/web/cloudflare`, `apps/web/next.config.js`, tests exclus, relevé du 29/09/2026). **Aucune valeur ici** : noms et rôles seulement. Les valeurs actuelles sont dans les Secrets Replit.

Trois canaux distincts sous Cloudflare :

1. **Secret** : `npx wrangler secret put NOM` (depuis `apps/web`), chiffré, jamais dans le dépôt.
2. **Var** : bloc `vars` de `wrangler.jsonc` (en clair dans le dépôt) ou `wrangler secret put` si on préfère ne pas l'exposer.
3. **Build** : doit être présente dans l'environnement **au moment de `npm run build:cf`** (valeur figée dans le bundle). Une modification impose un nouveau build + déploiement.

OpenNext recopie au démarrage de chaque isolate tous les bindings de type chaîne (secrets + vars) dans `process.env` : le code existant n'a pas à changer.

## 1. Secrets (wrangler secret put)

| Variable | Rôle |
|---|---|
| `NEXTAUTH_SECRET` | Signature des sessions NextAuth (lu par next-auth) |
| `GOOGLE_CLIENT_SECRET` | Connexion « Continuer avec Google » |
| `ANTHROPIC_API_KEY` | Tous les agents IA et crons de génération |
| `STRIPE_SECRET_KEY` | API Stripe (abonnement Premium) |
| `STRIPE_WEBHOOK_SECRET` | Vérification de signature du webhook Stripe |
| `RESEND_API_KEY` | E-mails transactionnels et alertes admin (aussi requis au build, voir §3) |
| `RESEND_WEBHOOK_SECRET` | Vérification du webhook entrant Resend |
| `ADMIN_PASSWORD` | Dashboard admin et API admin (bearer) |
| `CRON_SECRET` | Auth des routes `/api/cron/*` ; lu aussi par `cloudflare/worker.ts` pour les Cron Triggers |
| `UNSUBSCRIBE_HMAC_SECRET` | Liens de désinscription signés |
| `YOUTUBE_API_KEY` | Agent vidéos (YouTube Data API) |
| `BUFFER_ACCESS_TOKEN` | Publication sociale via Buffer |
| `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`, `TWITTER_BEARER_TOKEN` | Accès X/Twitter direct (secours) |
| `LINKEDIN_ACCESS_TOKEN` | Accès LinkedIn direct (secours) |
| `INSTAGRAM_ACCESS_TOKEN` | Accès Instagram direct (secours) |
| `REVENUECAT_WEBHOOK_SECRET` | Webhook achats in-app mobile |
| `FCM_SERVER_KEY` | Notifications push Android |
| `APNS_PRIVATE_KEY` | Notifications push iOS |

`DATABASE_URL` : **ne pas la définir** sous Workers. La base passe par le binding `HYPERDRIVE` (`src/lib/prisma-workers.ts`). Elle ne sert que de repli pour un test local sans Hyperdrive.

## 2. Vars (non sensibles)

| Variable | Rôle |
|---|---|
| `NEXTAUTH_URL` | URL publique du site pour NextAuth : **URL `*.workers.dev` pendant les tests**, `https://deviens-marrant.fr` après bascule |
| `CRON_ENABLED` | **Nouvelle** (Workers uniquement), déjà dans `wrangler.jsonc` = `"false"` : les Cron Triggers ne font rien tant qu'elle ne vaut pas `"true"` (évite publications/e-mails/générations en double pendant que Replit est en prod). Passer à `"true"` à la bascule (étape D) |
| `CRON_ORIGIN` | **Nouvelle** (Workers uniquement) : origine des requêtes cron synthétiques de `cloudflare/worker.ts`. Défaut `https://deviens-marrant.fr` si absente. À régler sur l'URL `*.workers.dev` pendant les tests |
| `GOOGLE_CLIENT_ID` | Connexion Google (identifiant public) |
| `INDEXNOW_KEY` | Clé IndexNow, publique par nature (servie sur `/indexnow-key.txt`) ; **aussi requise au build** (§3) |
| `EMAIL_FROM` | Expéditeur des e-mails (défaut dans le code) |
| `CEO_ADMIN_EMAIL` | Destinataire des rapports de l'agent CEO |
| `ADRESSE_POSTALE` | Pied de page légal des e-mails CEO |
| `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_PREMIUM_PRICE_CENTS` | Prix Premium (identifiant et affichage) |
| `ANTHROPIC_SONNET_MODEL`, `ANTHROPIC_OPUS_MODEL`, `ANTHROPIC_EFFORT` | Surcharges des modèles et de l'effort par défaut |
| `ENABLE_REVIEW_BATCH`, `ENABLE_HAIKU_VALIDATION` | Interrupteurs de validation du Stand-Up Director |
| `COPY_REVIEW_ENABLED`, `COPY_REVIEW_BATCH`, `COPY_REVIEW_VERSION` | Relecture quotidienne du corpus (charte s11) |
| `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL`, `JOKE_DECRYPTAGE_AI_BACKFILL_BATCH` | Décryptage IA des vannes dans les tâches de démarrage |
| `BUFFER_ORGANIZATION_ID`, `BUFFER_CHANNEL_TWITTER` | Organisation et canaux Buffer |
| `LINKEDIN_ORGANIZATION_ID`, `INSTAGRAM_BUSINESS_ID` | Identifiants de comptes sociaux |
| `APNS_BUNDLE_ID`, `APNS_KEY_ID`, `APNS_TEAM_ID` | Push iOS (identifiants) |

## 3. Variables de build (figées dans le bundle)

| Variable | Pourquoi au build |
|---|---|
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_URL` | Inlinées par Next (URL publique, sitemap, OpenGraph, URL des images sociales) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Script Umami |
| `NEXT_PUBLIC_CWV_ENDPOINT` | Collecte Core Web Vitals |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Balises de vérification moteurs |
| `NEXT_PUBLIC_SOCIAL_PROFILES` | JSON-LD (profils sociaux) |
| `NEXT_PUBLIC_REVENUECAT_API_KEY_IOS`, `NEXT_PUBLIC_REVENUECAT_API_KEY_ANDROID` | Achats in-app (build mobile surtout) |
| `INDEXNOW_KEY` | `/indexnow-key.txt` et `/35cc97ed….txt` sont prérendues **statiquement** : la clé est figée au build |
| `RESEND_API_KEY` | `src/lib/email.ts` instancie Resend au chargement du module ; la collecte de pages du build plante sans valeur |
| `DATABASE_URL` | Pages ISR (`/blog`, `/vannes/[slug]`, `sitemap.xml`…) prérendues au build : sans base joignable elles sont figées avec leurs données de repli jusqu'à la 1re revalidation (1 h à 24 h). Utiliser la chaîne Neon **directe** au build |
| `MARRANT_BUILD_TARGET` | Posée par le script `build:cf` (= `cloudflare`), ne pas définir à la main |

## 4. Fournies par la plateforme (ne rien définir)

`NODE_ENV`, `NEXT_RUNTIME` (OpenNext les fixe), `PORT` (Replit uniquement, inutile sous Workers), `BUILD_TARGET` (build mobile Capacitor uniquement).

## 5. Bindings Cloudflare (wrangler.jsonc, pas des variables)

`ASSETS`, `WORKER_SELF_REFERENCE`, `NEXT_INC_CACHE_R2_BUCKET` (bucket `marrant-next-cache`), `SOCIAL_IMAGES` (bucket `marrant-social-images`), `HYPERDRIVE` (id à renseigner), `IMAGES`.
