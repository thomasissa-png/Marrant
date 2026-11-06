# Revue @reviewer v1 : page de résiliation s23 (interrupteur fermé)

Date : 06/11/2026. Commits revus : `b27a6d7` (code), `ef35651` (REPLIT_ACTIONS + historique, docs seulement). Sources : code `apps/web/src`, 29 captures `docs/captures/s23-resiliation/` (11 lues : vide PC/mobile, raisons cochées mobile, erreur Stripe PC/mobile, annuel, déjà résilié mobile, sans client Stripe, confirmée, premier écran mobile), specs ux v3 / design / copy v1 / legal A, `docs/copy/ton-alex.md`.
Choix de Thomas du 06/11 (raison demandée AVANT, écran maison, question facultative) : appliqué, non re-questionné (P0 s8).
Emplacement : chemin imposé par la demande (hors `docs/reviews/`, exception assumée).

## Résumé exécutif

Le travail est propre et fidèle : les textes de la page et des e-mails sont ceux de la copie, aucun tiret cadratin, ordre Stripe puis motif puis e-mail respecté et testé, interrupteur fermé réellement inerte (seul l'admin change, ce qui est annoncé). Trois choses empêchent le 10/10 : un cas dégradé (base en panne + e-mail en panne) où l'écran promet « on résilie pour toi » alors que personne n'est prévenu, un anti-doublon qui renvoie un second accusé si Stripe livre le webhook avec plus de 10 min de retard, et des tests qui ne couvrent pas le câblage du webhook ni la route admin. Déployable fermé tel quel ; à corriger avant l'ouverture.

## Tableau critère / note / preuve

| # | Critère | Note | Preuve |
|---|---|---|---|
| 1 | Textes page mot pour mot (copie §1, §2) | 9/10 | `config/textes/resiliation.ts:10-105` = copie l.10-71 à l'identique (apostrophes typographiques). Textes hors copie : « Ton contrat », « (facultatif) », « Jusqu'à cette date… » (viennent de ux l.58/67 et design l.22/24), badge « Enregistrée » (design l.58), replis sans date (l.23, l.48, l.62), titre d'onglet « Résiliation enregistrée » (`confirmee/page.tsx:17`) : absents du doc copie, donc absents de la relecture à l'aveugle |
| 2 | E-mails mot pour mot (copie §3) | 9/10 | `resiliation-emails.ts:57-87` conforme (objet, repli, annuel, merci conditionnel). Ajout hors copie : ligne « Ta demande de résiliation est bien reçue (demande du …) » (l.100), utile pour C1 mais non validée |
| 3 | Ton d'Alex, tutoiement, zéro tiret cadratin | 10/10 | Grep `—` : 0 dans `components/resiliation`, `config/textes/resiliation*`, `lib/resiliation.ts` ; tests `resiliation-page-s23.test.tsx:76` et `resiliation-s23.test.ts:211` le vérifient. Aucune culpabilisation, aucune offre. Signature « L'Équipe Deviens Marrant » = étalon 5c (transactionnel, pas une réponse d'Alex) |
| 4 | Aucune promesse fausse (dates, prélèvement, annuel) | 7/10 | Date relue chez Stripe (`lib/resiliation.ts:349`, `finAccesStripe` l.80-83), rappel annuel exclu (`billing/annual-renewal-reminders.ts:93` + base alignée l.355-358), remboursement non mentionné. Mais : voir O1 (503), S1 (impayé), S2 (accès offert « déjà payée »), S3 (« On t'envoie une confirmation » sur `deja_resilie`) |
| 5 | Ordre Stripe, puis motif, puis e-mail | 10/10 | `lib/resiliation.ts:321-371` ; motif jamais bloquant (l.179-202) ; tests l.189-236 |
| 6 | Anti-doublon avec le webhook (marqueur `WebhookEvent`) | 7/10 | Réservation AVANT Stripe (l.321), libérée si échec (l.330), webhook `route.ts:215`. Failles : webhook retardé > 10 min = 2e accusé (O2) ; résilier, réactiver, re-résilier en < 10 min = aucun accusé pour la 2e (S4) |
| 7 | Idempotence | 9/10 | Clé Stripe `resiliation-${userId}-${cle}` (l.327), motif unique par `requestKey` (P2002 l.199), `deja_resilie` sans 2e appel (l.284). Écart : nouvelle clé après « hors ligne » (`resiliation-formulaire.tsx:76`) = 2e ligne de motif possible (S5) |
| 8 | Interrupteur fermé = rien ne change | 9,5/10 | 404 pages (`page.tsx:27`, `confirmee/page.tsx:26`) et API (`route.ts:41`) ; pied de page `footer.tsx:98` ; carte `abonnement-card.tsx:79-85` ; login `login/page.tsx:178` ; portail `portal/route.ts:45` ; webhook `route.ts:215` (court-circuit `&&`). Seul écart, annoncé : section admin + `GET /api/admin/resiliations` actifs fermés |
| 9 | Tests couvrant ces cas | 7/10 | 3 fichiers, bons sur la lib et l'écran. Manquent : webhook au niveau route (ouvert/fermé), chemin 503, route admin (401, table absente), portail fermé, phrase de connexion fermée (O3) |
| 10 | Diff réel sur le code existant (P0 s11) | 9/10 | 7 fichiers existants, tous inertes fermés sauf `abonnes-tab.tsx` (annoncé). Détail ci-dessous |
| 11 | Rendu (captures, 390 et 1440) | 9/10 | Propre, aligné, barre collée mobile avec « Confirmer la résiliation » visible au 1er écran, bouton jamais grisé, « Garder mon abonnement » en lien discret (B5 respecté). Écart : accès offert affiche « Ça n'a pas marché de notre côté » alors que rien n'a échoué (conforme ux l.42, mais faux pour la personne) |

## Note globale

**8,5/10.** GO pour le déploiement fermé (aucun effet visible hors admin). NO-GO pour l'ouverture tant que O1 à O3 ne sont pas faits.

## Corrections OBLIGATOIRES (texte exact, fichier:ligne)

**O1. Chemin 503 : promesse fausse et consigne fausse à l'équipe.** `apps/web/src/app/api/user/subscription/resiliation/route.ts:75-77` renvoie 503 (l'écran affiche « Ta demande est bien enregistrée : on résilie pour toi ») même si l'e-mail à l'équipe a échoué (`sendAdminHtmlEmail` lève, `lib/email.ts:185-187`), et l'e-mail envoyé dit « La résiliation Stripe a échoué » et « L'abonné a reçu « Ta demande de résiliation est bien reçue » », deux affirmations fausses ici (Stripe pas appelé, aucun e-mail à l'abonné). Remplacer l.75-77 par :
```ts
    const equipe = emailEquipeResiliation({ userId, demandeLe: now, cause: "serveur", code: "serveur-indisponible", stripeSubscriptionId: null });
    const transmis = await sendAdminHtmlEmail(equipe.subject, equipe.html).then(() => true, () => false);
    return json({ error: "serveur" }, transmis ? 503 : 500);
```
Et dans `apps/web/src/config/textes/resiliation-emails.ts` : l.120 `cause: "stripe" | "sans-client-stripe" | "serveur";` ; l.125-126 :
```ts
  const pourquoi =
    v.cause === "stripe"
      ? "La résiliation Stripe a échoué depuis l’écran /resiliation."
      : v.cause === "serveur"
        ? "Base indisponible au moment de la demande depuis l’écran /resiliation : Stripe n’a pas été appelé."
        : "Compte Premium sans client Stripe.";
  const suite =
    v.cause === "serveur"
      ? "L’abonné n’a reçu aucun e-mail ; l’écran lui a affiché « on résilie pour toi et on te le confirme par e-mail »."
      : "L’abonné a reçu « Ta demande de résiliation est bien reçue » : on résilie pour lui et on le lui confirme par e-mail.";
```
l.130 : ```<p>${esc(pourquoi)} ${esc(suite)}</p>`,``. Le 500 tombe déjà sur « Pas de connexion. Rien n'est perdu, réessaie. » (`resiliation-formulaire.tsx:118`), sans promesse.

**O2. Webhook livré avec plus de 10 min de retard = 2e accusé.** `reserverAccuseResiliation` compare le marqueur à l'heure de RÉCEPTION du webhook ; Stripe relivre jusqu'à plusieurs jours après un 5xx de notre côté. Comparer à l'heure de l'événement. `apps/web/src/app/api/stripe/webhook/route.ts` : l.176-179 ajouter le paramètre `evenementLe: Date = new Date(),` après `previous` ; l.215 : `if (RESILIATION_PAGE_OUVERTE && !(await reserverAccuseResiliation(subscription.id, evenementLe))) {` ; l.429-432 : ajouter en 3e argument `new Date(event.created * 1000),`. Fermé : inchangé (court-circuit).

**O3. Tests manquants (à ajouter, aucun code applicatif touché).**
- `apps/web/src/__tests__/api/stripe-webhook-s16.test.ts` après l.306 : (a) « interrupteur fermé : résiliation programmée → `notifyCancellationScheduled` appelé, aucun `webhookEvent.create` avec un `eventId` commençant par `email-resiliation:` » ; (b) « ouvert + marqueur posé par l'écran, événement créé 5 s après, livré 2 h après → `notifyCancellationScheduled` non appelé » (verrouille O2) ; (c) « ouvert, sans marqueur (portail) → appelé ».
- `apps/web/src/__tests__/api/resiliation-s23.test.ts`, bloc l.167 : « base indisponible : 503 + e-mail équipe contenant « Stripe n'a pas été appelé » » et « base ET e-mail indisponibles : 500 » (verrouille O1) ; « portail, interrupteur fermé : parcours `resilier` → flux Stripe comme avant, jamais `/resiliation` ».
- Nouveau `apps/web/src/__tests__/api/admin-resiliations-s23.test.ts` : sans jeton → 401 ; table absente (P2021) → 200 `{ disponible: false }` ; comptes sans `comment` ni `userId` dans la réponse.

## Souhaitables (une ligne chacune)

- S1 (@copywriter + @legal, prioritaire) : `TEXTES_RESILIATION_CONFIRMEE.garde` (`config/textes/resiliation.ts:61`) dit « Aucun nouveau prélèvement. » sans « après » ; un abonné en impayé (le bouton reste visible, `abonnement-card.tsx:109-110`) peut encore voir sa facture ouverte relancée, et perdre l'accès avant la date si les relances échouent : [À VÉRIFIER dans les réglages Stripe] puis aligner sur « Aucun nouveau prélèvement après. » et décider d'un texte impayé.
- S2 (@copywriter) : accès offert sans client Stripe, « à la fin de la période déjà payée » et « Ça n'a pas marché de notre côté » sont faux pour cette personne (capture `resiliation-sans-client-stripe-pc-1440.png`) : texte dédié.
- S3 : réponse `deja_resilie` (2e onglet) mène à la page finale qui annonce « On t'envoie une confirmation » et « Merci d'avoir répondu » alors que ni e-mail ni motif ne partent : `router.refresh()` comme pour `aucun` (`resiliation-formulaire.tsx:100`).
- S4 : supprimer le marqueur `email-resiliation:<abonnement>` dans le webhook quand `cancel_at_period_end` repasse à false (réactivation), pour qu'une re-résiliation en moins de 10 min reçoive son accusé (C1).
- S5 : garder la même clé après « hors ligne » (la requête est peut-être arrivée) et n'en tirer une nouvelle qu'après un 202 (`resiliation-formulaire.tsx:76`).
- S6 (@copywriter) : verser au doc copie tous les textes hors copie listés au critère 1, pour qu'ils passent la relecture à l'aveugle (P0 s18).
- S7 : `RESILIATION_TIMEOUT_STRIPE_MS` (`config/resiliation.ts:53`) n'est utilisé nulle part (le délai réel vient de `lib/stripe.ts:16`, 10 s + 1 relance réseau, soit jusqu'à ~20 s) : le supprimer ou le brancher.
- S8 : chemin 503 sans anti-doublon (un e-mail équipe par clic si le limiteur est en panne) : réutiliser le marqueur `resiliation-demande:<compte>` quand la base répond.
- S9 : section admin « Motifs de résiliation » visible fermé : l'afficher seulement interrupteur ouvert, ou garder tel quel (annoncé), au choix de Thomas.
- S10 : `chargerMotifsResiliation` charge tous les mots libres pour un simple compte (`lib/admin/motifs-resiliation.ts:25-28`) : `count` côté base.

## Mesure du diff réel (P0 s11)

Mesure par lecture des fichiers et recherche de l'interrupteur et des imports ajoutés (pas d'accès shell, donc pas de `git diff --stat` : à confirmer par @fullstack avec `git diff a93b2fd b27a6d7 --stat -- apps/web/src apps/web/prisma`).

| Fichier existant | Changement constaté | Inerte fermé ? |
|---|---|---|
| `components/layout/footer.tsx` | `liensLegal()` (l.97-100), appelé l.177 ; fermé = `footerLinks.legal` | Oui (captures avant/après pied de page) |
| `components/profil/abonnement-card.tsx` | `boutonResilier()` l.78-85, utilisé l.110 et l.144 ; fermé = `bouton("resilier", T.resilier)` d'avant ; imports `Link`, `buttonVariants` | Oui |
| `app/(auth)/login/page.tsx` | phrase l.177-180 sous `RESILIATION_PAGE_OUVERTE &&` ; import des textes | Oui |
| `app/api/stripe/webhook/route.ts` | l.20-21 imports, l.212-218 garde court-circuitée | Oui (aucune écriture `WebhookEvent` fermé) |
| `app/api/user/subscription/portal/route.ts` | l.43-47 sous `RESILIATION_PAGE_OUVERTE &&` | Oui |
| `prisma/schema.prisma` | modèle `CancellationFeedback` (l.1255+) et relation `User.cancellationFeedbacks` (l.95), sans colonne | Oui (table neuve, rien n'écrit fermé) |
| `components/admin/abonnes-tab.tsx` | section l.47-48, appelle `/api/admin/resiliations` | **Non, annoncé** (admin seulement) |

Aucun autre fichier existant touché trouvé (`lib/email.ts:36` « resiliation » préexistant, utilisé par `paiement-notifications.ts:75`).

## Limites de la revue

18 captures non ouvertes (variantes de celles lues) ; e-mails non rendus (texte lu dans le code) ; comportement Stripe en impayé non vérifié (WebSearch sans réponse claire).

---
**Handoff → @orchestrator**
- Fichier produit : `docs/copy/revues-resiliation/reviewer-v1.md`
- Décisions : 8,5/10 ; GO déploiement fermé ; NO-GO ouverture avant O1, O2, O3 (@fullstack) ; S1, S2, S6 à @copywriter (S1 avec @legal).
- Points d'attention : O1 est le seul cas de promesse fausse à l'écran ; mesure du diff à confirmer par `git diff --stat`.
---
