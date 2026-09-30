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

## 4. s14 (30/09) : bascule arrêtée au §0, rien exécuté de §1 à §4
- Zone `active` (NS Cloudflare), clés critiques présentes, `STRIPE_SECRET_KEY` en `sk_live_`, prix Premium actif (99 c EUR, live).
- **Bloquant** : `STRIPE_WEBHOOK_SECRET` vaut un identifiant d'endpoint (`we_…`), pas un secret de signature `whsec_…`, et cet endpoint n'existe pas sur le compte Stripe de la clé live (0 endpoint webhook sur le compte). Avec cette valeur, tout événement Stripe serait rejeté (signature invalide) : abonnements jamais activés.
- Route réelle du webhook : `/api/stripe/webhook` (la checklist disait `/api/webhooks/stripe`, corrigé). Événements traités : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`, `charge.refunded`.
- Pour débloquer : créer l'endpoint live `https://deviens-marrant.fr/api/stripe/webhook` avec ces 6 événements et fournir son `whsec_` en `STRIPE_WEBHOOK_SECRET`, puis reprendre au §1.
