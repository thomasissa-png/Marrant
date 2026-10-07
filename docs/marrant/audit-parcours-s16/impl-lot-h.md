# Lot H : réserves de la revue croisée s16 (@fullstack, 07/10/2026)

> Non commité, non déployé, aucune écriture en prod. Aucune migration, aucune variable. Textes validés intacts. Chemins relatifs à `apps/web/src/`.

## Ce qui a changé
- **P1-1 remboursement** (`app/api/stripe/webhook/route.ts`, `abonnementRembourse`) : la charge est relue par le SDK (`stripe.charges.retrieve(id, { expand: ["invoice"] })`, acacia porte `invoice`), abonnement pris sur la facture. Charge ou facture illisible → `RetryableWebhookError` (500 + alerte A `paiement-remboursement-resiliation`). Sans facture : repli seulement si le client a **un seul** abonnement chez Stripe ; plusieurs → alerte A, rien résilié, Premium conservé. Facture sans abonnement → no-op. `chargeInvoiceId` (mort) retiré de `lib/stripe-activation.ts`.
- **P1-2 impayé qui dure** (`lib/billing/stripe-reconciliation.ts`) : pour chaque `past_due`, la facture ouverte la plus ancienne est lue (`invoices.list`). Plus de 21 jours → alerte A `stripe-impaye-prolonge` (classe A par le préfixe `stripe-`, `admin-alerts.ts` non modifié), avec le réglage Stripe à corriger.
- **P2 webhook** : compte supprimé au checkout (Prisma P2025) → 200, rien recréé, alerte A `paiement-activation-echec` « résilier et rembourser ». `subscription.updated` / `invoice.payment_succeeded` sans ligne en base → no-op journalisé. Ligne CANCELED + événement « actif » → statut relu chez Stripe, réactivation seulement si `active`/`trialing`. E-mail de confirmation **une fois par abonnement** : marqueur `WebhookEvent` `email-confirmation:<sub>` (contrainte unique existante, provider `interne`, hors comptage du rapport du lundi). **Pas de migration 13.**
- **P2 réconciliation** (`lib/scheduler/jobs.ts`) : un échec lève l'alerte A `stripe-reconciliation-echec`.
- **P2-1 limiteur atomique** (`lib/rate-limit.ts`) : `maxRequests` créneaux par clé, un créneau est pris en **une** requête `INSERT … ON CONFLICT DO UPDATE … WHERE expiré RETURNING` (`$queryRaw`). Créneau disputé → nouvel essai (3 max). Vérifié sur un Postgres 16 local : rafale de 40 requêtes simultanées, 5 acceptées pour 5 ; fenêtre glissante et fuseau horaire hors UTC OK. Coût : 2 requêtes au lieu de 3.
- **Checkout** : choix = **relever la limite à 20 par heure** (un compteur partagé ne sait pas « rendre » un essai) et la compter après lecture du corps (les 400 ne comptent plus). Un acheteur qui hésite n'est plus bloqué.
- **Envoi d'e-mails** : `forgot-password` ajoute `forgot-email` (3 par heure et par adresse normalisée, hachée), avant la recherche du compte et avec le texte existant. `/api/retractation` l'avait déjà (`retractation-email`, 3 par jour, adresse normalisée par zod) : inchangé.
- **Origine** (`lib/same-site.ts`) : 403 sur les 5 routes si `Origin` est étranger ou `null`, ou, sans `Origin`, si `Sec-Fetch-Site: cross-site`. Acceptés : origine de la requête, `NEXTAUTH_URL`, `capacitor://localhost` et `https://localhost` (Capacitor iOS/Android, `capacitor.config.ts` : `iosScheme capacitor`, `androidScheme https` ; `premium-paywall` appelle le checkout via `api()`). Sans `Origin` ni `Sec-Fetch-Site` (client hors navigateur) : accepté.
- **`REPLIT_ACTIONS.md`** (s16) : en-tête A à H, ID N-1 à relever **avant** `secret put` (étape 2 bis), `E2E_EXCLURE_S16=true` avant 05:30 UTC, liste de contrôle de l'achat réel (a à g).

## Texte provisoire
`config/textes/securite.ts` : `origineRefusee` = « Cette action ne peut se faire que depuis deviens-marrant.fr. Recharge la page et réessaie. » (PROVISOIRE s16, étalon à valider ; jamais vu en usage normal).

## Tests
- Nouveaux : 11 dans `stripe-webhook-s16` (doublon remboursé → seul le doublon résilié, Premium conservé ; facture illisible → 500 ; charge illisible → 500 ; repli avec 1 seul abonnement ; plusieurs → alerte ; compte supprimé ; e-mail unique ; événements tardifs) ; 3 dans `stripe-reconciliation` (21 jours, 10 jours, aucune facture) + assertion « échec du job → alerte » ; 2 dans `rate-limit-shared-s16` (rafale, créneau disputé) ; `same-site-lot-h.test.ts` (12 : helper, 403 sur les 5 routes, mobile, forgot par e-mail).
- Adaptés : limite du checkout à 20 (`abonnement-coherence-s16-lot-d`) ; `portal()` reçoit une `Request` (`stripe-portal-status-s16`).
- `npx tsc --noEmit -p tsconfig.build.json` : 0 erreur. `npm run lint` : 0 erreur (1 avertissement ancien, `admin/page.tsx`). Jest complet : **3 599 PASS, 0 échec** (2 ignorés). `npm run build` non lancé (consigne).

## Actions prod et points ouverts
- Aucune nouvelle action prod. Le réglage des relances Stripe (étape 3) reste à faire par Thomas : l'alerte des 21 jours n'est qu'un filet.
- Non fait (hors lot) : e-mail pour une résiliation immédiate, `cancelAtPeriodEnd` dans `/api/stripe/status`, PAST_DUE dans le rapport du lundi, deux onglets payés tous les deux (la réconciliation les détecte).
- Checkout pour un compte supprimé : alerte seulement, pas de résiliation automatique (à trancher par Thomas).
