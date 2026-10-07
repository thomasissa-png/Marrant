# Revue croisée s16 avant mise en ligne (@reviewer, 07/10/2026)

> Revue en lecture seule : audit, brief, rapports `impl-lot-{a..g}`, `impl-qa-e2e`, `impl-infrastructure`, `relecture-legal`, décisions de Thomas du 07/10 (`founder-preferences.md:68-69`), entrée s16 de `REPLIT_ACTIONS.md:3-18`, puis code commité d'`apps/web/src` relu fichier par fichier. **Limite** : cette session n'avait pas d'outil shell. Je n'ai donc pu lancer ni `git log`/`git diff 038c945..HEAD`, ni jest. Les chiffres de tests (3 571 PASS, lot G) viennent des rapports et ne sont pas re-mesurés. Chemins relatifs à `apps/web/src/`.

## Résumé exécutif
Le lot s16 est solide. L'argent est protégé dans les cas courants : un paiement n'est plus perdu, un impayé ne coupe plus l'accès, un second abonnement est refusé, un remboursement résilie l'abonnement chez Stripe et la suppression de compte résilie avant d'effacer. Les textes validés sont en place, et aucun défaut ne bloque la mise en ligne. Il reste deux points à traiter vite. (1) Un remboursement peut résilier le mauvais abonnement en cas de doublon, car les événements Stripe arrivent en version « clover », sans facture sur la charge. (2) Le réglage Stripe des relances doit être fait avant le déploiement, sinon un impayé garde Premium sans fin. **Verdict : GO avec réserves.**

## 1. Couverture des recos (D3 et appli mobile exclues)
| Reco | Statut | Preuve |
|---|---|---|
| 1 Achat réel | À faire après déploiement (Thomas) | `REPLIT_ACTIONS.md:18` étape 6 |
| 2 Remboursement → résiliation Stripe | Fait (réserve P1-1) | `api/stripe/webhook/route.ts:199-241`, `lib/stripe.ts:219-236` |
| 3 Impayé, double abonnement | Fait | `webhook/route.ts:44,132-138,163-183` ; `lib/stripe.ts:52-60,149-157` ; `api/stripe/checkout/route.ts:79-89` |
| 4 Rétractation réelle | Fait | `api/retractation/route.ts:51-120`, migration `12_add_retractation_request` |
| 5 Suppression de compte | Fait | `api/user/route.ts:94-121`, `lib/account.ts:118-149` |
| 6 Paiement jamais perdu | Fait | `webhook/route.ts:63-105,303-327` (enregistré seulement après succès, sinon 500 + alerte) |
| 7 Page « Paiement reçu ! » | Fait | `abonnement/success/page.tsx:54-96,114-118` (seulement si PREMIUM vérifié ; 401 → connexion) |
| 8 Alertes dans le digest | Fait | `lib/admin-alerts.ts` (CLES_TUNNEL), `lib/billing/stripe-reconciliation.ts`, `scheduler/jobs.ts:649-677` |
| 9 TTC, 14 jours, CGU au paiement | Fait | `lib/stripe.ts:175-178,190-207`, `config/textes/paiement.ts:113-120` (≈ 490 caractères, sous la limite de 1 200) |
| 10 E-mails manquants | Fait, partiel | confirmation (= bienvenue), refus, résiliation programmée : `paiement.ts:231-339`. Pas d'e-mail pour une résiliation immédiate (remboursement, suppression). |
| 11 Profil (formule, échéance, changer de formule) | Fait, dépend de Stripe | `lib/account.ts:42-86`, `api/user/subscription/portal/route.ts`. « Changer de formule » nécessite l'étape 2a d'`impl-infrastructure.md:11`. |
| 12 Retour après annulation | Fait | `lib/stripe.ts:182`, bandeau `PAIEMENT_ANNULE` (lot C, étalon 5b.2) |
| 13 Liaison Google | Fait | `allowDangerousEmailAccountLinking` absent de `lib/auth.ts` |
| 14 Limite d'essais partagée | Fait (réserve P2-1) | `lib/rate-limit.ts:93-129`, `lib/auth.ts:38-41` |
| 15 Jeton de reset haché, hors Umami | Fait | `api/auth/forgot-password/route.ts:36-53`, `reset-password/route.ts:31-39`, `lib/umami-before-send.ts` |
| 16 Restes de l'offre gratuite, messages | Fait | « compte gratuit » ne reste que dans des commentaires ; « accès complet » seulement dans `components/mobile/OnboardingFlow.tsx:219` (mobile, exclu) |
| 17 Mesure du tunnel | Fait | `lib/umami.ts:21-37`, `lib/analytics/weekly-funnel.ts:78-106` |
| 18 Pages légales (hors D3) | Partiel | Hébergeur, confidentialité et R.631-3 faits. Manquent le téléphone de l'hébergeur et le médiateur nommé (`cgu/page.tsx:66`). |
| 19 Finitions | Partiel | Accessibilité, focus et Connexion mobile faits. Script Cloudflare = action Thomas (étape 4). Boucle visuelle Playwright pas faite (lots B, D). |
| 20 Tests E2E | Partiel | Smoke prêt (114 tests). Les 8 tests d'achat (`@achat`) n'ont **jamais tourné** (pas de clé `sk_test`). |

## 2. Risques de régression en prod (argent d'abord)
**P1-1, remboursement en version clover.** L'endpoint Stripe reçoit ses événements en `2026-02-25.clover` (`infrastructure.md:15`). Dans cette version, la charge n'a plus de champ `invoice` : `chargeInvoiceId` renvoie donc toujours null et le code se replie sur l'abonnement enregistré en base (`webhook/route.ts:210-219`).
- Cas simple (un seul abonnement, c'est le cas de l'achat de test D1) : le résultat est juste.
- Cas d'un doublon : rembourser la charge du doublon **résilie le bon abonnement, coupe Premium, et laisse le doublon prélever**.
- Le même repli silencieux joue quand la facture est illisible (`:214-216`).
- Correctif : relire la charge par le SDK (`stripe.charges.retrieve`, version acacia, qui porte encore `invoice`). Si la facture est connue mais illisible, lever `RetryableWebhookError`. Agent : @fullstack.

**P1-2, relances Stripe.** Le code ne rétrograde qu'à `canceled`, `unpaid` ou `deleted`. Si l'étape 3 (« Résilier l'abonnement » après la dernière relance) n'est pas faite, un impayé reste Premium sans limite. La réconciliation compte `past_due` comme « en cours » (`stripe-reconciliation.ts:17`) et ne le signalera donc pas. C'est bien dans l'ordre de déploiement (étape 1), mais à vérifier explicitement. Idéalement, alerter quand un PAST_DUE dure plus de 21 jours.

Webhook, autres points :
- Rejeu et doublon d'événement : sain. La déduplication est faite avant le traitement et l'événement n'est enregistré qu'après (`:273-311`). Les e-mails ne lèvent jamais d'erreur (`paiement-notifications.ts:7-9,54-57`).
- P2 : si deux livraisons arrivent en même temps, ou si `webhookEvent.create` échoue après le traitement, l'événement est retraité et l'e-mail de confirmation part deux fois.
- P2, ordre des événements : `invoice.payment_succeeded` (`:185-197`) ou un `subscription.updated` « active » arrivé en retard après une suppression ou un remboursement remet Premium. La réconciliation le rattrape le lendemain à 4h UTC.

Checkout :
- `submit_type: "subscribe"` est accepté en mode abonnement depuis l'API `2024-11-20.acacia` ([changelog Stripe](https://docs.stripe.com/changelog/acacia/2024-11-20/submit-type-recurring-cpl)). Le SDK est épinglé en `2025-02-24.acacia` (`lib/stripe.ts:13`) : OK.
- `consent_collection` est derrière la variable, avec repli et alerte (`:191-207`) : OK.
- 409 pour ACTIVE, TRIALING ou PAST_DUE, en base puis chez Stripe : OK.
- P2 : le garde-fou n'agit qu'à la création de la session. Deux onglets payés tous les deux donnent 2 abonnements (repérés le lendemain par la réconciliation).
- P2 : la limite de 5 essais par heure (`checkout/route.ts:17,52`) compte aussi les succès et les 409. Un acheteur qui hésite entre mensuel et annuel peut tomber sur un 429.

Suppression de compte : Stripe est résilié avant l'effacement, abonnements orphelins compris, et rien n'est effacé si Stripe échoue (`account.ts:128-146`). `RetractationRequest` n'a pas de clé étrangère, donc la preuve est conservée. OK.

Limite d'essais partagée :
- Une connexion coûte 6 requêtes (purge, comptage et écriture, pour 2 compteurs) : acceptable au trafic actuel.
- P2-1 : le comptage puis l'écriture ne sont pas atomiques. Une rafale de requêtes en parallèle dépasse la limite (le coût de bcrypt freine quand même).
- P2 : 10 essais faux suffisent à bloquer la connexion d'une victime pendant 15 minutes (verrouillage, compromis connu).

Jeton de reset haché : les liens émis avant le déploiement deviennent invalides. **Acceptable** : durée de vie d'1 h, message clair, et c'est noté dans `REPLIT_ACTIONS.md:9`.

Migration 12 : idempotente et additive (`migration.sql:5-34`). Retour arrière sans risque. `prisma generate` passe par le `postinstall` racine.

Réconciliation : une passe par jour, verrou conservé après succès, lecture seule, alertes regroupées sous 2 clés dans le digest (pas de rafale). Charge Stripe négligeable. P2 :
- un échec ne laisse qu'un `console.error` (`jobs.ts:675`), aucune alerte si la passe échoue 4 fois dans l'heure ;
- un Premium donné à la main (admin) ressortira chaque jour comme « Premium sans abonnement ».

Garde-fou des e-mails : branché à l'envoi, alerte `email-rendu-*` sans bloquer l'envoi. Les alertes ne contiennent que le domaine du destinataire (`email.ts:40-59`). OK.

## 3. Cohérence inter-lots
- Étalons : mot pour mot selon le lot E, retouches juridiques validées appliquées (`paiement.ts:113-120,258`). Libellé unique `TEXTES_ABONNEMENT.resilier = "Résilier ton contrat"` (`config/textes/compte.ts:85`), relu par l'e-mail, le rappel annuel, les CGU et le pied de page. 0 « Résilier mon abonnement » ou « votre contrat » dans `src`.
- 0 tiret cadratin dans `config/textes`, les pages légales, `components/profil|premium`, `lib/emails` et `(auth)`. 0 mention IA client-facing. « 1 500+ » intact (`hero-section.tsx:45`, `premium-cta.tsx:114`, `a-propos/page.tsx:86,208`).
- États d'abonnement : `subscriptionFlags` est partagé par `/api/stripe/status` et le profil (`subscription-state.ts:17-25`). P2 : `/api/user/subscription` complète `cancelAtPeriodEnd` depuis Stripe pour les anciens abonnements (`account.ts:70`), `/api/stripe/status` non. Les 2 abonnés de lancement peuvent donc voir un état différent sur /abonnement et sur /profil.
- Umami et rapport du lundi : `mur-vu`, `abonnement-clic` et `inscription-echec` sont identiques côté émission et côté lecture (`weekly-funnel.ts:100-102`). P2 : `abonnesActifs` et le revenu mensuel ne comptent que ACTIVE (`weekly-funnel.ts:60`) et excluent PAST_DUE, qui garde pourtant Premium.

## 4. Sécurité
- Fuite d'existence de compte : écran et code identiques pour un compte Google et pour des identifiants faux (lot F). « Trop d'essais » ne révèle rien (la clé est l'e-mail saisi). Le 409 de /register et l'écart de temps de réponse lié à bcrypt subsistent (P2, connus).
- Nouvelles routes :
  - `DELETE /api/user` : session obligatoire, mot SUPPRIMER revérifié côté serveur. DELETE impose une vérification préalable du navigateur, et le cookie est en SameSite lax.
  - `portal` : session obligatoire, zod.
  - `/api/retractation` : publique, zod, limites par IP et par e-mail, réponse neutre, motif envoyé seulement à l'admin.
  - P2 : aucun contrôle d'`Origin` sur ces routes (protection par SameSite seulement). `/api/retractation` et `forgot-password` (limite par IP seulement) peuvent servir à envoyer des e-mails à une adresse tierce en changeant d'IP.
- Logs et Umami : identifiants internes uniquement, aucun e-mail en clair, `umami-before-send` retire `token` et `email`. Le jeton de reset n'est jamais journalisé.

## 5. Ordre de déploiement (`REPLIT_ACTIONS.md:18`)
L'ordre est correct : Stripe 1 à 3, migration 12, variable CGU, déploiement, smoke, achat réel. À compléter (P2) :
- (a) noter l'ID N-1 **après** l'étape 3 : `wrangler secret put` crée déjà une nouvelle version ;
- (b) poser `E2E_EXCLURE_S16=true` avant que le commit atteigne la branche du cron de 05:30 UTC ;
- (c) liste de contrôle D1 : e-mail de confirmation reçu, puis remboursement → abonnement `canceled` chez Stripe, compte FREE, pas de second prélèvement ;
- (d) décider de couper ou non les e-mails d'échec de Stripe (doublon avec le nôtre) ;
- (e) l'en-tête ne cite que les rapports A à D.

## Top 3 corrections prioritaires
1. **P1-1** remboursement en version clover (mauvais abonnement résilié en cas de doublon) → @fullstack.
2. **P1-2** relances Stripe réglées sur « Résilier » avant le déploiement + alerte sur un PAST_DUE qui dure → Thomas, puis @fullstack.
3. **P1-3** lancer `@achat` en préproduction dès que la clé `sk_test` existe (D7) et le smoke `@s16` juste après la mise en ligne. Les sélecteurs du checkout et du portail Stripe n'ont jamais été exécutés → @qa.

## Contradictions et angles morts
- Légal : médiateur non nommé et identité du vendeur (D3) restent P0 côté légal, mais hors déploiement (décision de Thomas). @legal 1a, 2 (titre du modèle), 4 (« Demande reçue le ») et le report au jour ouvrable ne sont pas faits (lot G, limite 3) : P2. Le mot « reconduit » reste dans l'e-mail mensuel (`paiement.ts:254`) alors que les CGU art. 3 parlent de durée indéterminée : à trancher par l'avocat.
- `docs/copy/etalons-parcours-s16.md` ne reflète pas les retouches juridiques validées (lot G, limite 4) : @copywriter.

## Notes par domaine et verdict
| Domaine | Note | Motif |
|---|---|---|
| Paiement | 7,5 | Chemins critiques sûrs ; P1-1 (doublon remboursé) ; ordre des événements |
| Compte | 8 | Suppression sûre, profil complet ; changement de formule dépendant de Stripe |
| Sécurité | 7,5 | Google, jeton, limites partagées ; non-atomicité, pas de contrôle d'Origin, envoi d'e-mails à un tiers |
| Textes | 8,5 | Étalons, libellé unique, Premium, 0 tiret cadratin ; étalons non mis à jour dans `docs/copy` |
| Légal | 7 | 6,5 selon @legal avant le lot G, qui en corrige l'essentiel ; plafonné par D3 et le médiateur |
| Mesure | 7,5 | Tunnel complet ; actifs hors PAST_DUE ; échec de réconciliation silencieux |
| Tests | 6,5 | Jest large (non relancé ici), smoke prêt ; achat E2E et boucle visuelle jamais exécutés |

**Verdict : GO avec réserves.** Aucun P0 code. Conditions : les étapes Stripe 1 à 3 faites (relances surtout), la migration 12 avant le déploiement, et le smoke juste après. P1-1 doit être corrigé avant tout remboursement en présence d'un doublon (sans effet pour l'achat de test D1).
