# Implémentation s16 : réglages prod à faire par Thomas (@infrastructure)

Date : 07/10/2026, vers 09:00 UTC. Lecture seule : GET sur les API Stripe (clé live) et Cloudflare, aucune écriture, aucun code ni `wrangler.jsonc` modifié. Aucune valeur secrète ci-dessous.

## À faire par Thomas (dans cet ordre)

**Avant le déploiement du lot s16** (sinon le paiement peut casser, voir étape 1) :

1. **Stripe, adresse des CGU** (obligatoire avant la case « J'accepte les CGU ») : dashboard.stripe.com > roue dentée **Paramètres** > **Informations publiques** (« Public details »). Remplir **Conditions d'utilisation** = `https://deviens-marrant.fr/cgu` et **Politique de confidentialité** = `https://deviens-marrant.fr/confidentialite`. Enregistrer. Puis Paramètres > **Checkout** : vérifier que les deux liens apparaissent dans l'aperçu.
2. **Stripe, portail client** : Paramètres > **Facturation** > **Portail client** (adresse directe : dashboard.stripe.com/settings/billing/portal). Mode **Live** (pas « Test »).
   - a. **Abonnements > « Les clients peuvent changer de formule »** : activer. Produit « Deviens-marrant.fr », cocher les 2 prix **2,99 €/mois** et **24,99 €/an** (et aucun autre).
   - b. Juste en dessous, **calcul au prorata** : choisir « Facturer immédiatement le prorata » (le mensuel déjà payé est déduit du premier annuel).
   - c. **Passage de l'annuel au mensuel** : choisir « À la fin de la période de facturation » (le client garde l'annuel payé jusqu'au bout).
   - d. **Annulation** : déjà réglée « à la fin de la période », rien à changer. **Moyen de paiement** et **historique des factures** : déjà activés, rien à changer.
   - e. **Liens de l'entreprise** (en bas de la page) : vérifier que CGU et confidentialité reprennent les adresses de l'étape 1 ; sinon les saisir ici aussi.
   - f. **Enregistrer**.
3. **Stripe, relances de paiement** : Paramètres > **Facturation** > **Récupération des revenus** > **Nouvelles tentatives** (« Revenue recovery > Retries » ; ou taper « Nouvelles tentatives » dans la recherche du tableau de bord).
   - a. **Nouvelles tentatives automatiques (Smart Retries)** : activées, réglage proposé par Stripe (8 essais sur 2 semaines).
   - b. **Si toutes les tentatives échouent** : choisir **« Résilier l'abonnement »**. Enregistrer.
   - Pourquoi : avec le nouveau code, l'abonné garde Premium pendant que Stripe relance sa carte, et ne le perd qu'au moment où Stripe résilie à la fin des relances.

**Quand tu veux (indépendant du déploiement)** :

4. **Cloudflare, couper le script Web Analytics** (bloqué par la sécurité du site, erreur sur toutes les pages, aucune donnée : Umami reste l'outil) : dash.cloudflare.com > **Analytics & Logs** > **Web Analytics** > ligne `deviens-marrant.fr` > **Manage site** (Gérer le site) > **Advanced options** > désactiver l'injection automatique du script (ou « Disable automatic setup »). Ne pas toucher aux autres sites listés (versi.fr, devrefs.dev…) sauf si tu le veux.
5. **Stripe test (D7)** : aucune clé test dans la session. Pour que Claude puisse tester un achat sans vraie carte :
   - a. Tableau de bord Stripe > bascule **Mode test** (en haut à droite) > **Développeurs** > **Clés API** : copier la **clé secrète test** (`sk_test_…`) et la **clé publiable test** (`pk_test_…`).
   - b. Toujours en mode test > **Catalogue de produits** > **+ Ajouter un produit** « Premium test » : prix **2,99 €**, récurrent, **mensuel**, « Taxes incluses dans le prix » ; puis **+ Ajouter un autre prix** : **24,99 €**, récurrent, **annuel**, « Taxes incluses ». Copier les 2 identifiants `price_…`.
   - c. **Ne pas créer tout de suite l'endpoint webhook test** : il doit viser un Worker de test qui n'existe pas encore (si on vise deviens-marrant.fr, la prod refuse sa signature et affiche des erreurs). Claude le créera par API avec ta clé test, une fois le Worker de test en place.
   - d. Où mettre les valeurs : dans les **variables d'environnement de la session Claude Code** (réglages de l'environnement), sous les noms `STRIPE_TEST_SECRET_KEY`, `STRIPE_TEST_PUBLISHABLE_KEY`, `STRIPE_TEST_PRICE_MONTHLY`, `STRIPE_TEST_PRICE_ANNUAL` [HYPOTHÈSE : noms proposés, à garder tels quels]. Jamais dans un fichier du dépôt ni dans le chat.
6. **Déploiement** : donner ton **GO** à Claude une fois les étapes 1 à 3 faites (procédure ci-dessous). Puis faire toi-même un achat mensuel réel avec ta carte, remboursé ensuite (reco 1 de l'audit).

## Détails techniques (état lu par l'API)

Sources des chemins du tableau de bord : [Stripe, textes et politiques Checkout](https://docs.stripe.com/payments/checkout/customization/policies), [Stripe, Smart Retries](https://stripe.com/ae/docs/billing/revenue-recovery/smart-retries), [Stripe, encaissement automatique](https://docs.stripe.com/invoicing/automatic-collection), [Cloudflare Web Analytics, FAQ](https://developers.cloudflare.com/web-analytics/faq/index.md). Les intitulés français exacts des écrans peuvent varier légèrement.

**Portail Stripe** : 1 seule configuration, `bpc_1TCSOyRqTNSm2ji5rIlRwXnS` (`is_default=true`, active, live). Le code (`apps/web/src/lib/stripe.ts:142`, `billingPortal.sessions.create`) ne passe pas de paramètre `configuration` : il utilise donc cette configuration par défaut, et les réglages du tableau de bord s'appliquent sans redéploiement. État : `subscription_update.enabled=false` (aucun prix), `subscription_cancel` activé `at_period_end`, `proration_behavior=none`, motifs d'annulation actifs ; `payment_method_update`, `invoice_history`, `customer_update` (nom, e-mail, adresse, téléphone) activés ; `subscription_pause` désactivé ; `business_profile.terms_of_service_url` et `privacy_policy_url` = null ; `default_return_url` null (le code passe `return_url=${NEXTAUTH_URL}/profil`).

**Prix actifs** (archivés exclus, 1 seul produit `prod_UAgblG2OlSdd4d` « Deviens-marrant.fr », prix par défaut = mensuel) :

| Prix | Montant | Intervalle | `tax_behavior` |
|---|---|---|---|
| `price_1UMUmURqTNSm2ji544PLYGuZ` « Premium mensuel 2,99 » | 299 EUR | month | `unspecified` |
| `price_1UN4pdRqTNSm2ji5hM2fWxbY` « Premium annuel 24,99 » | 2 499 EUR | year | `inclusive` |

`tax_behavior` du mensuel ne peut plus être modifié une fois le prix utilisé : sans effet tant que la taxe automatique est coupée ; l'aligner demanderait un nouveau prix et un nouveau secret (non recommandé maintenant). Les 2 abonnés de lancement à 0,99 € : s'ils changent de formule dans le portail, ils perdent le prix de lancement (pas de retour possible à 0,99 €). Le webhook `customer.subscription.updated` recopie déjà l'intervalle et le montant en base (`webhook/route.ts:9-11`, `:95`).

**CGU Checkout** : compte `acct_1T9n6zRqTNSm2ji5` (FR, EUR), `business_profile.url` = `https://deviens-marrant.fr`. L'URL des conditions n'est pas exposée par l'API compte : non lisible, donc **à considérer comme absente** (la configuration du portail la montre vide). Stripe exige une URL de conditions valide dans les informations publiques pour `consent_collection.terms_of_service=required` ; sans elle, la création de session Checkout échoue. **Ordre impératif : étape 1 avant le déploiement du lot qui ajoute la case.** Au moment de la lecture, `consent_collection` n'est pas encore dans `apps/web/src`.

**Relances** : réglage non exposé par l'API Stripe (non lisible). Effet du choix « Résilier l'abonnement » : Stripe émet `customer.subscription.deleted` à la fin des relances, que le webhook traite (passage en FREE).

**Cloudflare Web Analytics** (`GET /accounts/{id}/rum/site_info/list`) : site `deviens-marrant.fr`, `site_tag` `e9701b44…`, `auto_install: true`, règle active, créé le 29/09/2026. 6 autres sites du compte sont aussi en injection automatique (hors périmètre). Le jeton de la session n'a pas le droit d'écriture voulu et la consigne est lecture seule : action Thomas.

## Déploiement (procédure des sessions s14 et s15)

- **Qui autorise** : Thomas (GO explicite sur la mise en ligne). Claude lance la commande, puis journalise dans `REPLIT_ACTIONS.md` : commit, ID de version du Worker et ID N-1 (pour revenir en arrière).
- **Où** : dépôt principal, **arbre propre** (aucun fichier non commité, donc après le commit de l'orchestrateur). **Jamais depuis un worktree** à `node_modules` en lien symbolique (incident s15 : bundle incomplet, `REPLIT_ACTIONS.md:108-109`).
- **Commandes** : `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npm run lint && npm run build` (pré-commit), puis `npm run build:cf && npm run deploy:cf` (`opennextjs-cloudflare deploy`, wrangler sur le Worker `marrant`, domaines `deviens-marrant.fr` et `www`). Reco audit C9 : passer le SHA git en message de version.
- **Migrations** (si le lot A en ajoute) : SQL idempotente appliquée sur Neon prod **avant** `deploy:cf`, par la session avec le GO de Thomas (précédent : migration `10_annual_plan_renewal_reminder`, 05/10). Pas d'étape de migration automatique dans le pipeline.
- **Limite connue** : depuis l'environnement Claude, Neon n'est pas joignable en TCP pendant le build ; les pages ISR partent avec leurs données de repli jusqu'à revalidation (1 h à 24 h, `cloudflare-runbook.md:62`). Accepté lors des déploiements s15.
- **Retour arrière** : `npx wrangler rollback` (version N-1). Les réglages Stripe et Cloudflare ci-dessus sont indépendants du code et se défont dans les mêmes écrans.
- **Contrôles après déploiement** : `/`, `/abonnement`, `/register`, `/api/health` en 200 ; session Checkout ouverte depuis `/abonnement` avec la case CGU ; portail ouvert depuis `/profil` avec « Changer de formule ».

**Nouveaux secrets et bindings** : `wrangler.jsonc` relu en fin de mission (HEAD `c692b0b`, aucune modification locale) : bindings `ASSETS`, `WORKER_SELF_REFERENCE`, R2 `NEXT_INC_CACHE_R2_BUCKET` et `SOCIAL_IMAGES`, `HYPERDRIVE`, `IMAGES`, var `CRON_ENABLED`, crons `*/15 * * * *` et `0 1 * * *`. **Aucun binding de limitation de débit** : le lot en cours a choisi un compteur partagé dans Postgres (`sharedRateLimit`, table existante `JobLock`, sans migration, `apps/web/src/lib/rate-limit.ts:7-15`, fichier non commité au moment de la lecture). Donc rien à créer chez Cloudflare. Point d'attention : une ligne par tentative ; vérifier que les lignes expirées sont purgées (sinon la table grossit). Aucun nouveau secret Worker requis par les réglages ci-dessus.
