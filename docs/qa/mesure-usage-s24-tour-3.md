# Relecture à l'aveugle QA, mesure d'usage serveur s24 (lot 0), tour 3

> Commits relus :
> - `d58fac5b` : corrections 2 à 6 du tour 2 (`docs/qa/mesure-usage-s24-tour-2.md`) ;
> - `4ea1cc29` : phrase de confidentialité de @legal ;
> - `9d3c2f48` : CI épinglée sur `ubuntu-24.04`.
>
> Relecteur : @qa. Date : 12/11/2026. Preuves marquées [STATIQUE] ou [LIVE]. Environnement vide pour tout build, serveur, tsc, lint et Jest ; base Postgres jetable propre à ce tour.

## Notes

| # | Critère | T1 | T2 | **T3** | Preuve principale |
|---|---|---|---|---|---|
| 1 | Exactitude des définitions | 4 | 9 | **10/10** | §5.2 cohérent (règle 4 alignée) ; [LIVE] aucun écrit au chargement, signal étape 2 écrit, RevenueCat RENEWAL = `renouvellement_paye iap` |
| 2 | Zéro régression | 10 | 10 | **10/10** | [STATIQUE] `d58fac5b` ne touche aucun fichier de rendu ; [LIVE] pages et API en 200 |
| 3 | Écriture non bloquante, dédoublonnage, concurrence | 9 | 10 | **10/10** | [LIVE] opposition sur Postgres réel ; lecture impossible = pas d'écriture (test) ; journal propre |
| 4 | Données personnelles | 7 | 8 | **9/10** | [STATIQUE] la phrase client correspond au code ; la justification « rien lu dans le navigateur » est inexacte |
| 5 | Migration et procédure | 9 | 10 | **9/10** | [LIVE] procédure d'opposition jouée telle qu'écrite ; contrôle P6 positif exposé à une fausse alerte |
| 6 | Tests | 7 | 10 | **10/10** | [LIVE] Jest 6 159 verts ; CI `9d3c2f48` verte, spec SQL exécutée |
| 7 | Script de lecture | 7 | 8 | **9/10** | [LIVE] `--depuis 2026-11-08` = minuit à Paris quel que soit le fuseau ; `iap` géré ; une date impossible est acceptée sans erreur |
| 8 | Pré-commit en environnement vide | 10 | 10 | **10/10** | [LIVE] tsc build, lint, build, tsc complet, tsc E2E : 0 erreur |

**Note globale : 9,6/10** (T1 7,9 ; T2 9,4). **Verdict : GO technique pour la mise en ligne de la mesure.** Préalables inchangés : la phrase de @legal publiée dans `/confidentialite` (avec `datesConfidentialite()`), puis le go écrit de Thomas. Les 3 corrections restantes ne sont pas bloquantes : aucune ne fausse les données collectées.

### 1. Exactitude des définitions : 10/10
- [STATIQUE] La règle 4 du §5.2 dit maintenant « étape 2+ dépliée, bloc exercice vu, carnet ; les listes ne comptent pas » : plus de contradiction.
- [LIVE] Serveur `d58fac5b` en environnement vide, base jetable `marrant_qa3`, port libre :
  - chargement par un abonné de `/vannes`, `/vannes?page=2`, `/conseils`, `/parcours/repartie`, `/api/parcours/by-slug/repartie` et `/api/jokes?page=2` : rien d'écrit ;
  - signal étape 2 : 204 et 1 ligne `etape:2` ;
  - RevenueCat `INITIAL_PURCHASE` puis `RENEWAL` (signés) : `souscription=iap` puis `renouvellement_paye=iap`, à l'heure de l'événement ;
  - le même `RENEWAL` rejoué, puis un autre identifiant à la même heure : aucune ligne de plus ;
  - sans secret : 401.
- Le rendu n'a pas changé depuis le tour 2 : les essais Chrome du tour 2 (dépliage, ancre, ouverture automatique, exercice vu 1 s) restent valables.

### 2. Zéro régression : 10/10
[STATIQUE] `git diff ca527bdd d58fac5b` ne touche aucun fichier de `components/`, `app/(dashboard)/`, `hooks/` ni `config/`. Côté API, seul le webhook RevenueCat change, et sa réponse est inchangée (200). Le diff HTML et API avant/après du tour 2 reste donc valable. [LIVE] Pages et API en 200 ci-dessus.

### 3. Écriture non bloquante, dédoublonnage, concurrence : 10/10
[LIVE] `opposition.ts`, contre Postgres réel avec la procédure SQL de `REPLIT_ACTIONS.md` exécutée telle qu'écrite :
- avant opposition : 2 lignes ;
- marqueur posé, lignes effacées, puis 6 écritures (souscription, portail, premier accès, « aha », jour de pratique, renouvellement) : 6 fois `false`, 0 ligne ;
- un autre compte continue d'écrire normalement ;
- opposition levée : les écritures reprennent.

Sur le serveur [LIVE] : un abonné opposé reçoit 204 au signal et 200 sur `/carnet`, sans aucune ligne. Journal `[mesure]` vide. [STATIQUE + test] Si l'opposition ne peut pas être lue, rien n'est écrit. Pour le premier accès, une seule lecture d'opposition est faite.

### 4. Données personnelles : 9/10

Phrase client de @legal (`docs/legal/espace-client-s24-phrases.md`, bloc 1), confrontée au code ligne par ligne [STATIQUE] :

| Mot de la phrase | Code | Exact ? |
|---|---|---|
| « si tu es ou as été abonné » | `portail_ouvert` exige un `Subscription.stripeCustomerId`, créé seulement à l'activation ; quiz réservé à Premium ; premier accès et « aha » réservés à Premium | oui |
| « la date et la formule (mensuelle, annuelle ou app) de ta souscription et de chaque renouvellement payé » | détails `month`, `year`, `iap` ; renouvellements Stripe `subscription_cycle` et RevenueCat `RENEWAL` | oui |
| « ton premier contenu Premium affiché (son type ou son étape) » | `etape:<n>`, `exercice-<type>`, `carnet`, une fois par abonnement | oui |
| « ta première étape ou ton premier quiz terminé » | « aha » = `etape:<n>` ou `quiz:<n>`, une fois par abonnement | oui |
| « chaque jour où tu termines un quiz » | `jour_pratique` `quiz`, un par jour de Paris | oui |
| « chaque ouverture du portail de paiement avec l'action choisie » | `changer-formule`, `resilier`, `carte`, `simple` | oui |
| « si tu programmes ta résiliation, son heure et le motif choisi dans une liste » | `canceled_at`, `cancellation_details.feedback` (liste fermée), commentaire jamais lu | oui |
| « Aucun texte libre ni adresse IP » | `detailFerme`, aucune colonne IP | oui |
| « Ces données sont effacées avec ton compte » | `ON DELETE CASCADE`, vérifié [LIVE] au tour 1 | oui |
| « tu peux t'y opposer » | marqueur d'opposition, vérifié [LIVE] ci-dessus | oui, désormais |

-1 : la justification interne de la base légale (`espace-client-s24-phrases.md:18`) dit « événements enregistrés côté serveur, **rien lu ni écrit dans le navigateur** ». C'est inexact : deux événements sont détectés par du code exécuté dans le navigateur (étape dépliée ; bloc exercice à l'écran 1 s, par IntersectionObserver) et envoyés par `fetch` avec le cookie de session existant. Aucun cookie ni stockage n'est créé ou lu en plus, mais @legal doit raisonner sur ces faits exacts : l'absence de consentement repose sur cette phrase (correction 2).

Remarque sans effet sur la note : le marqueur d'opposition (`WebhookEvent`, `eventId` qui contient l'identifiant de compte) survit à la suppression du compte, comme les marqueurs de l'onboarding déjà en place (`lib/account.ts` n'efface pas `WebhookEvent`). À trancher avec @legal si l'on veut l'effacer aussi.

La phrase n'est pas encore publiée : `confidentialite/page.tsx` contient toujours « de façon globale ». C'est le préalable au go, comme prévu.

### 5. Migration et procédure : 9/10
- [LIVE] La procédure d'opposition de `REPLIT_ACTIONS.md` (insertion du marqueur, effacement, levée) a été exécutée mot pour mot en SQL sur Postgres : elle fonctionne. Migration inchangée.
- -1, contrôle P6 positif (`REPLIT_ACTIONS.md:14`) : « 0 ligne = signal bloqué ». C'est vrai seulement si le compte de test n'a encore AUCUN premier accès pour son abonnement en cours, puisque la mesure n'écrit qu'un premier accès par abonnement. Si le compte de test a ouvert `/carnet` ou vu un exercice avant (pendant la même P6, ou depuis la mise en ligne précédente), on obtient 0 ligne alors que le signal marche : fausse alerte. Il faut aussi vérifier que le compte de test n'est pas sous opposition (correction 3).

### 6. Tests : 10/10
- [LIVE] Jest complet en environnement vide, sans secret Stripe : 404 suites, 6 159 verts (5 ignorés, existants).
- Nouveaux tests : opposition (tous les types, opposition posée après coup, lecture en panne, une seule lecture), dates de Paris (hiver, été, deux jours de changement d'heure, ISO avec fuseau), lignes `iap` (« inconnu (application) », exclues du « x sur n »), RevenueCat `RENEWAL`, `PRODUCT_CHANGE` et opposition.
- [LIVE] CI GitHub sur `9d3c2f48`, run `43214146910` : **succès** des 3 jobs (`test`, `lint`, `e2e-local`). `e2e-local` donne 144 passés et 89 ignorés, dont les 2 tests de `mesure-usage-sql-s24.spec.ts` (requête exécutée sur Postgres). L'échec du run de `d58fac5b` (`43213114172`) se limitait à l'étape « Install Chromium » de `e2e-local`, comme annoncé. Restent sur `ubuntu-latest` : `test` et `lint` de `tests.yml`, verts, sans navigateur. `e2e-parcours.yml` ne se lance qu'à la main et n'a pas été lancé.

### 7. Script de lecture : 9/10
- [LIVE] Jeu piégé passé par `--depuis-json`, sous `TZ=UTC` puis `Pacific/Auckland` :
  - `--depuis 2026-11-08` garde la souscription de 00:30 à Paris (23:30 UTC la veille) et écarte celle de 23:30 à Paris ; sortie identique dans les deux fuseaux ;
  - ligne `iap` sans renouvellement après un mois : « inconnu (application) » ;
  - ligne `iap` renouvelée : « oui ».
- -1 [LIVE] : `--depuis 2026-13-45` est accepté sans erreur (`Date.UTC` reporte le mois 13 et le jour 45 sur l'année suivante, `tableau-abonnes.ts:131`). Le tableau sort alors « 0 abonné(s) » au lieu d'une erreur « date illisible » : une faute de frappe donne une lecture vide qui a l'air plausible (correction 1).

### 8. Pré-commit en environnement vide : 10/10
[LIVE] Worktree `d58fac5b`, `env -i` + variables factices des jobs CI :
- `npx tsc --noEmit -p tsconfig.build.json` = 0 ;
- `npx next lint` = « No ESLint warnings or errors » ;
- `npm run build` = 0 (proxy pour `next/font` seulement) ;
- `npx tsc --noEmit` = 0 ;
- `npx tsc -p ../../playwright/tsconfig.json` = 0 ;
- Jest complet vert ;
- CI verte sur `9d3c2f48`.

Note de méthode : le port 5310 répondait déjà, servi par un autre processus que le mien. Un premier essai a donc interrogé ce serveur étranger (401 RevenueCat, 500 sur `/api/jokes`). Ces résultats ont été écartés, et tout a été refait sur un port libre vérifié (5371), avec ma base jetable.

## Statut des corrections du tour 2

| # | Correction | Statut | Preuve |
|---|---|---|---|
| 1 | Phrase de confidentialité | **Levée côté texte** (publication = préalable au go) | tableau du critère 4 |
| 2 | Règle 4 du §5.2 | **Levée** | `brief-espace-client-s24.md:257` |
| 3 | Opposition durable | **Levée** | [LIVE] procédure jouée, 0 ligne après 6 écritures |
| 4 | `--depuis` en heure de Paris | **Levée** (reste la validation des dates impossibles, correction 1 ci-dessous) | [LIVE] 2 fuseaux |
| 5 | Abonnés de l'application | **Levée** | [LIVE] RevenueCat `RENEWAL` ; « inconnu (application) » |
| 6 | Contrôle P6 positif | **Levée** (une précision à ajouter, correction 3) | `REPLIT_ACTIONS.md:14` |

## Corrections restantes

| # | Fichier:ligne | Problème | Correction | Bloquant |
|---|---|---|---|---|
| 1 | `apps/web/src/lib/mesure/tableau-abonnes.ts:131` (`lireDateParis`) | Une date impossible (`2026-13-45`, `2026-02-30`) est acceptée et décalée sans bruit, d'où une lecture vide qui a l'air plausible [LIVE]. | Refuser si le mois n'est pas entre 1 et 12 ou si le jour dépasse le mois (contrôle aller-retour `getUTCMonth` / `getUTCDate`) : le script s'arrête sur « date illisible ». Test avec `2026-13-45` et `2026-02-30`. | non |
| 2 | `docs/legal/espace-client-s24-phrases.md:18` | « rien lu ni écrit dans le navigateur » est inexact : deux événements sont détectés dans le navigateur et envoyés par `fetch` (sans cookie ni stockage ajouté). | @legal reformule les faits (« aucun cookie ni stockage ajouté ; deux événements sont détectés par la page et envoyés au serveur ») et confirme que l'absence de consentement tient. Aucun texte client touché. | non (à confirmer par @legal avant le go) |
| 3 | `REPLIT_ACTIONS.md:14` (contrôle positif) | Fausse alerte possible si le compte de test a déjà un premier accès pour son abonnement, ou s'il est sous opposition. | Avant le dépliage : `delete from "UsageEvent" where "userId" = '<compte de test>'` et vérifier l'absence de `mesure-usage:opposition:<compte de test>`. Faire ce contrôle avant toute autre visite du compte de test. | non |

## Escalades
- @legal : correction 2, et décision sur l'effacement du marqueur d'opposition avec le compte (remarque du critère 4).
- @fullstack : corrections 1 et 3 ; publication de la phrase et de `datesConfidentialite()` (préalable au go).
- @orchestrator : GO technique ; la mise en ligne attend la phrase publiée et le go écrit de Thomas.

## Essais [LIVE] reproductibles (hors dépôt)
Scratchpad de la session, non commités :
- `qa3-serveur.sh` : RevenueCat, opposition sur la route du signal, chargements, signal positif ;
- `qa3/apps/web/qa-tmp/opposition.ts` : procédure d'opposition sur Postgres ;
- `qa3-l.json` : jeu de dates.
