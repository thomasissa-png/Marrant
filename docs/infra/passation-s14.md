# Passation s13 → s14 : bascule deviens-marrant.fr

> GO bascule de Thomas (29/09, confirmé le 30/09). Tests s13 faits sur le Worker de test, écarts acceptés par Thomas listés en §2.
> À suivre : `bascule-checklist.md` (mise à jour s13). Règles : ne jamais afficher une valeur de secret.

## 1. Vérifié en s13 (30/09, Worker de test, Neon Francfort)
- Variables : toutes présentes sauf `STRIPE_TEST_SECRET_KEY`. **Anthropic** : le nom `ANTHROPIC_API_KEY` est filtré par les sessions Claude Code, la clé est lue sous `MARRANT_ANTHROPIC_API_KEY` et doit être posée sur le Worker sous `ANTHROPIC_API_KEY`.
- Données : `--verify` 28/35. `User`, `Subscription`, `Account` identiques ; écarts = contenu (tâches de démarrage) + écritures Replit (`LlmUsageLog`, `SocialPostDailyLock`).
- Tâches de démarrage : 2 appels OK, idempotent (marqueurs `DataPatch` du 29/09 intacts).
- Comptes : inscription, connexion/déconnexion, favoris (Premium uniquement, 403 en gratuit = voulu), progression parcours, mot de passe oublié + lien de réinitialisation, admin : OK. Compte de test supprimé.
- E-mails : Resend accepte l'envoi depuis `deviens-marrant.fr`, DKIM `resend._domainkey` et `send.*` dans la zone. La clé Resend ne sait qu'envoyer (statut de livraison : tableau de bord Resend). Le code ignore les erreurs Resend (`emails.send` ne lève pas) : un 200 du site ne prouve pas l'envoi.
- Google : URI workers.dev ajoutée par Thomas, connexion testée par Thomas sur son compte existant : OK.
- Images sociales : **bug corrigé** (`46dd690`) : sous Workers, aucune police chargée → 500. TTF lues via `ASSETS`. 3 formats rendus OK. Déployé sur le Worker de test (version `d4bea543`).
- Sitemap : ~1 215 URL (catalogue inclus) au lieu de 60 ; 8 URL blog Replit = redirections 308 voulues. Voir checklist §4 (vider son entrée R2 après `deploy:cf`).
- Secrets Worker alignés sur l'environnement : `CRON_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_*`, `EMAIL_FROM`, `INDEXNOW_KEY`. **Aucune clé Stripe** sur le Worker à ce stade.
- Zone Cloudflare `active`, NS Cloudflare.

## 2. Non testé, accepté par Thomas
- **Stripe** : pas de clé test ; test en réel après bascule (webhook live `https://deviens-marrant.fr/api/stripe/webhook` en 2xx dans le tableau de bord, puis un vrai abonnement de Thomas).
- **`daily-content`** (IA) : appel bloqué par le mode auto de la session (action réelle payante). Sera vérifié le lendemain de la bascule (contenu du jour, `LlmUsageLog` success). Prod Replit ne génère plus rien depuis juin : pas de régression possible.
- **Captures 390/768/1440** : Chromium ne passe pas le proxy de la session (contournement TLS refusé). Couvert par le contrôle @qa fin s12 (64 pages × 4 largeurs, 0 P0) sur le même code front.

## 3. Bascule (s14) : points d'attention
- Suivre `bascule-checklist.md` §1 à §4. Secrets live : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_SECRET` (identique Replit) + ceux du §1 ; `NEXTAUTH_URL` et `CRON_ORIGIN` = `https://deviens-marrant.fr`.
- Build ici = sans base : pages ISR avec données de repli jusqu'à revalidation (sitemap : vider l'entrée R2, cf. checklist).
- Build : `npm ci` puis `npm i --no-save @next/swc-linux-x64-gnu@14.2.33` (binaire SWC absent sinon, jest et build plantent).
- Le mode auto de la session peut bloquer des étapes (secrets live, DNS, `--reset`). Si blocage : s'arrêter, dire à Thomas laquelle, ne rien laisser à moitié.
- Après bascule : retirer de Google Cloud Console l'URI et l'origine `marrant.thomas-issa.workers.dev`.
- Hors migration, noté : texte du modèle d'image « Le Défi » tronqué au milieu d'un mot ; objet de l'e-mail de réinitialisation avec un tiret cadratin (règle n°12).

## 4. s14 (30/09) : bascule FAITE, deviens-marrant.fr servi par Cloudflare
- §0 : `STRIPE_WEBHOOK_SECRET` de l'environnement = identifiant d'endpoint `we_…` inexistant, 0 endpoint sur le compte live. GO Thomas : endpoint live créé par l'API (`we_1ULIyN…`, `https://deviens-marrant.fr/api/stripe/webhook`, 6 événements du code), son `whsec_` posé directement sur le Worker (jamais affiché). Route réelle `/api/stripe/webhook` (docs corrigées).
- §1 : copie `--reset` 43 335 lignes, `--verify` **35/35**.
- §2 : `CRON_ENABLED=true` ; 25 secrets live via `secret bulk` (dont `NEXTAUTH_SECRET` Replit, Stripe live, `NEXTAUTH_URL`/`CRON_ORIGIN` = apex, Buffer/X/LinkedIn/Instagram) ; `build:cf` sans base ; `deploy:cf` version `59178f0a`, BUILD_ID `5KzxJgSosyIIIQNGOP3NE`.
- §3 : supprimés `A @ 34.111.179.208` et `CNAME www → deviens-marrant.fr` (DNS only) ; domaines personnalisés `deviens-marrant.fr` + `www` attachés (aussi déclarés dans `wrangler.jsonc`).
- §4 vérifié : 8 routes en 200 (`/`, `/blog`, `/vannes`, `/conseils`, `/videos`, `/parcours`, `/login`, `/api/health`) ; `www` → 301 apex ; `X-Robots-Tag` absent ; `/api/health` base `up` (`degraded` = contenu stale depuis juin, attendu) ; sitemap 60 → **1 215 URL** après purge R2 ; startup-tasks 200 (85 s) ; webhook Stripe non signé → 400 « Signature invalide » (route active, secret lu).
- Après bascule : Thomas a **mis Replit en pause** (30/09 matin) ; 404 transitoires « This app isn't live yet » (sans `cf-ray`) = caches DNS de l'ancien `A` ; recontrôle 09:39 UTC : 120/120 via Cloudflare. Thomas a activé **Always Use HTTPS** (http → https en 301 vérifié).
- **Reste à faire (Thomas)** : 1) vrai abonnement Premium puis webhook en 2xx dans le tableau de bord Stripe ; 2) ~~mettre en pause le déploiement Replit~~ (fait) (Autoscale : un visiteur de `*.replit.app` réveille son planificateur → posts sociaux en double, écritures dans l'ancienne base) ; 3) Google Cloud Console : retirer l'URI et l'origine `marrant.thomas-issa.workers.dev` ; 4) connexion d'un compte existant + e-mail « mot de passe oublié » reçu ; 5) demain matin : contenu du jour + `LlmUsageLog` success. Avant s14, 0 endpoint webhook sur le compte Stripe de la clé live : à vérifier si Replit utilisait un autre compte Stripe.
- Variables de build absentes de l'environnement (non inventées) : `NEXT_PUBLIC_BING/GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_SOCIAL_PROFILES`, `NEXT_PUBLIC_CWV_ENDPOINT`. Secret `UNSUBSCRIBE_HMAC_SECRET` : valeur du test s13 conservée (absente de l'environnement).
