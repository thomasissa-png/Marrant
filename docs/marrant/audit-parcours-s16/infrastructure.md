# Audit parcours s16 : infrastructure et fiabilité en production (@infrastructure)

Date : 07/10/2026. Prod en lecture seule (GET API, SELECT agrégés, dig, curl -I). Aucune donnée personnelle.

## 1. Brief compris et note globale

Brief compris : prouver avec les données réelles de prod que les chaînes connexion et achat fonctionnent (Stripe, Neon, Resend, Cloudflare, Umami) et qu'une panne serait détectée.

Note globale du domaine : [EN COURS] /10

## 2. Critères

| # | Critère | Parcours | Note /10 | Preuve | Ce qui manque pour 10/10 | Sévérité |
|---|---|---|---|---|---|---|
| C1 | Webhooks Stripe : endpoint, version, événements, livraisons | J2, J6 | 6 | `GET /v1/webhook_endpoints` : 1 seul endpoint, `https://deviens-marrant.fr/api/stripe/webhook`, `enabled`, live, créé le 05/10 05:55 UTC, `api_version` null (= défaut du compte, `2026-02-25.clover` sur les 68 événements de 30 j), 6 événements = exactement les 6 `case` de `webhook/route.ts:46-231`. `GET /v1/events` 30 j : 2 événements `pending_webhooks=1` (`customer.subscription.updated` du 01/10, ancien endpoint supprimé ; panne connue 01/10 au 05/10, 500 sur `current_period_end`, `REPLIT_ACTIONS.md:345`). Base : table `WebhookEvent` = 2 lignes, toutes du 05/10. **Depuis la recréation, aucun événement écouté n'a été émis par Stripe** : le nouvel endpoint n'a jamais traité un vrai paiement. SDK figé en `2025-02-24.acacia` (`lib/stripe.ts:12`) alors que les webhooks arrivent en `clover` | Épingler la version d'API de l'endpoint sur celle du SDK (ou l'inverse) ; un vrai paiement de bout en bout (ou `stripe trigger` en mode test sur un Worker de préproduction) ; alerte si un événement reste `pending` plus de 1 h | P1 |
| C2 | Cohérence Stripe et base | J2, J5 | 9 | Stripe `GET /v1/subscriptions?status=all` : 3 abonnements, 2 `active` (0,99 €/mois, `cancel_at_period_end=false`), 1 `incomplete_expired`. Base (SELECT agrégés) : `User` 2 PREMIUM / 11 FREE ; `Subscription` 2 lignes `PREMIUM/ACTIVE/month/99`, `currentPeriodEnd` future, `User.plan`=PREMIUM pour les 2. Écart nul | Contrôle automatique quotidien Stripe vs base (aujourd'hui fait à la main) | P2 |

## 3. Bugs / défauts constatés

[EN COURS]

## 4. Recommandations (par valeur utilisateur)

[EN COURS]

## 5. Non vérifié

[EN COURS]
