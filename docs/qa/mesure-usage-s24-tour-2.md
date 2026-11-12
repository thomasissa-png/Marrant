# Relecture à l'aveugle QA, mesure d'usage serveur s24 (lot 0), tour 2

> Commits relus : `9addfdd5` et `ca527bdd` (corrections du tour 1, `docs/qa/mesure-usage-s24-tour-1.md`), au-dessus de `b654b2f`. Le code de `apps/` à `HEAD` est identique à `ca527bdd`. Relecteur : @qa. Date : 12/11/2026.
> Définitions jugées : §5.2 du brief à jour. Premier accès Premium = étape 2+ dépliée, bloc exercice entré dans la vue, carnet ouvert ; les listes sont retirées, car leurs pages 2 et suivantes sont publiques. « Aha » = première étape validée ou premier quiz terminé. Souscription = `event.created`.
> Preuves marquées [STATIQUE] ou [LIVE]. Banc d'essai :
> - worktrees jetables `b654b2f~1` (avant toute mesure) et `ca527bdd` (après), builds standalone en environnement vide (`env -i` + variables factices du job `e2e-local`, proxy seulement pour `next/font`) ;
> - copie isolée de la base seedée (`marrant_qa2`), pour qu'aucun autre agent ne la modifie pendant les essais (voir critère 2) ;
> - Google Chrome réel piloté par Playwright, à 375 x 700 ;
> - comptes de test Premium et gratuit avec jeton de session signé par le secret factice.

## Notes

| # | Critère | Tour 1 | Tour 2 | Preuve principale |
|---|---|---|---|---|
| 1 | Exactitude des définitions | 4 | **9/10** | [LIVE] Chrome réel : aucun écrit au chargement ; dépliage, ancre, ouverture automatique, exercice vu 1 s et quiz écrivent exactement ce que dit le §5.2 |
| 2 | Zéro régression | 10 | **10/10** | [LIVE] 12 API identiques octet pour octet, 21 pages identiques (DOM et texte), 33 statuts identiques |
| 3 | Écriture non bloquante, dédoublonnage, concurrence | 9 | **10/10** | [LIVE] 10 signaux simultanés = 1 ligne ; route en 204 sans attente côté navigateur ; course du réabonnement fermée |
| 4 | Données personnelles | 7 | **8/10** | [LIVE] refus 401, 403, 400, CSRF 403, 405, 429 ; [STATIQUE] phrases @legal presque exactes, opposition sans mécanisme durable |
| 5 | Migration et procédure | 9 | **10/10** | migration inchangée (rejouée 2 fois au tour 1) ; `REPLIT_ACTIONS.md` complété (normalisation du diff, réglage Stripe, effacement ciblé) |
| 6 | Tests | 7 | **10/10** | [LIVE] Jest 6 149 verts ; SQL exécuté sur Postgres dans `e2e-local` ; CI verte sur `ca527bdd` |
| 7 | Script de lecture | 7 | **8/10** | [LIVE] voie psql réparée, résultat identique sous 3 fuseaux ; restent la date `--depuis` en UTC et les abonnés de l'application |
| 8 | Pré-commit en environnement vide | 10 | **10/10** | [LIVE] tsc build, lint, build (2 fois), tsc complet, tsc E2E : 0 erreur |

**Note globale : 9,4/10** (tour 1 : 7,9). **Verdict : GO technique pour la mise en ligne de la mesure**, une fois franchi le préalable déjà prévu : mention `/confidentialite` relue et go écrit de Thomas.
- Les 4 bloquants code du tour 1 sont levés et vérifiés en vrai.
- Aucune correction restante ne fausse les données qui s'accumulent dès le premier jour : elles touchent la lecture (le script, relançable à tout moment) ou le texte légal.
- Pour 10/10, il faut les corrections 1 à 6 ci-dessous. Seule la 1 doit passer avant la mise en ligne : elle porte sur le texte de confidentialité.

### 1. Exactitude des définitions : 9/10

[LIVE] Chrome réel à 375 x 700, table vidée avant chaque cas, base `marrant_qa2`. On lit ensuite les lignes `UsageEvent` et les appels à `/api/mesure/acces` :

| Cas | Écrit | Attendu §5.2 |
|---|---|---|
| `/parcours/repartie`, abonné neuf, chargement seul (étape 1 dépliée) | rien | rien |
| même page, clic sur l'en-tête de l'étape 2 | `etape:2` (signal 204) | oui |
| abonné avec étapes 1 et 2 faites, chargement (étape 3 ouverte automatiquement) | `etape:3` | oui |
| même abonné, ancre `#etape-2` | `etape:2` | oui |
| abonné neuf, ancre `#etape-3` : le site ouvre l'étape 1 (règle d'ouverture existante, inchangée) | rien | rien : l'étape 3 n'est pas affichée |
| compte gratuit ou visiteur, clic sur l'étape 2 | rien, aucun signal | rien |
| fiche conseil, chargement sans défiler | rien | rien |
| bloc exercice à l'écran 0,5 s puis quitté | rien | rien |
| bloc exercice à l'écran 1,5 s | `exercice-conseil` | oui |
| même chose, compte gratuit | rien | rien |
| `/vannes`, `/vannes?page=2`, `/conseils?page=2`, `/videos` avec défilement | rien | rien (listes publiques) |
| `/carnet` | `carnet` | oui |
| quiz terminé deux fois (API réelle) | `aha=quiz:1` et un seul `jour_pratique` | oui |

- [LIVE] Simple chargement des API par un abonné (`/api/jokes`, `/api/tips` et `/api/videos` en page 2, `/api/parcours/by-slug/repartie`, `/api/fiches/exercice`) : rien d'écrit.
- [LIVE] Retrait des listes justifié : `/vannes?page=2` anonyme sert 12 fiches distinctes, toutes absentes de la page 1 ; `/conseils?page=2` en sert 10.
- [STATIQUE] La souscription prend `event.created` (`webhook/route.ts:466-469`) ; l'e-mail approuvé garde sa date d'origine (test `mesure-usage-webhook-s24.test.ts`).
- -1 : le point 4) des règles de lecture du §5.2 dit encore « liste au-delà de la limite, étape 2+, exercice, carnet » (`brief-espace-client-s24.md:257`), ce qui contredit la puce ajoutée juste dessous (correction 2).

## Statut des corrections 1 à 15 du tour 1

| # | Sujet | Statut | Preuve |
|---|---|---|---|
| 1 | Page parcours = premier accès au chargement | **Levée** | [LIVE] chargement seul : rien ; dépliage, ouverture automatique et ancre : `etape:<n>` |
| 2 | Fiche ouverte = « aha » et premier accès | **Levée** | [LIVE] chargement : rien ; vu 0,5 s : rien ; vu 1,5 s : `exercice-conseil` ; « aha » ne vient plus de l'exercice |
| 3 | Page 1 des listes = premier accès | **Levée** (listes retirées, choix validé par la session) | [LIVE] `/vannes?page=2` anonyme = 12 fiches publiques ; aucune écriture sur les listes |
| 4 | Heure de souscription = création de la session | **Levée** | [STATIQUE] `event.created`, test réécrit, e-mail approuvé intact |
| 5 | Confidentialité | **En cours, voie séparée** | phrases @legal presque exactes, voir correction 1 ci-dessous |
| 6 | Voie psql cassée | **Levée** | [LIVE] commande exécutée telle qu'écrite |
| 7 | Seuil sur les souscriptions, cohortes | **Levée** | [STATIQUE + test] seuil sur les comptes, `--activation`, `--depuis` (reste le fuseau de la date, correction 4) |
| 8 | Dates UTC, pilote en heure locale | **Levée** | [LIVE] 3 fuseaux, sortie identique |
| 9 | Lettres A à D en collision | **Levée** | préfixe `M-` et mention en tête |
| 10 | Abonnés absents sans bruit | **Levée pour l'essentiel** | nombre annoncé ; souscription RevenueCat écrite ; renouvellement de l'application non écrit (correction 5) |
| 11 | Indicateurs R3 absents | **Levée** | colonnes « Bienvenue envoyé » et « Clic résilier » |
| 12 | Tests manquants, SQL jamais exécuté | **Levée** | CI `e2e-local` verte, Jest 6 149 |
| 13 | Double lecture à chaque fiche | **Levée** | plus d'écriture dans le GET ; une lecture par signal |
| 14 | `REPLIT_ACTIONS.md` | **Levée** | normalisation, réglage Stripe, effacement ciblé |
| 15 | Course du réabonnement | **Levée** | ancre sur l'abonnement Stripe, écrite dans la transaction d'activation |

## Corrections restantes

| # | Fichier:ligne | Problème | Correction | Bloquant |
|---|---|---|---|---|
| 1 | `docs/legal/espace-client-s24-phrases.md:16` (puis `confidentialite/page.tsx`) | Phrase presque exacte : n'annonce que des dates, ne cite pas le premier quiz terminé, et « si tu es abonné » est trop étroit pour le portail. | @legal ajuste, par exemple : « les dates de ta souscription (et sa formule), du premier contenu Premium affiché (et son type), de ta première étape validée ou de ton premier quiz terminé, de chaque jour de pratique, de chaque ouverture du portail de paiement (et l'action choisie)… ». Puis @copywriter et Thomas. | **oui pour le go** (texte client, voie séparée) |
| 2 | `docs/espace-client/brief-espace-client-s24.md:257`, règle 4) | « liste au-delà de la limite, étape 2+, exercice, carnet » contredit la définition tranchée juste dessous. | Remplacer la parenthèse par « étape 2+ dépliée, bloc exercice vu, carnet ; les listes ne comptent pas ». | non |
| 3 | `lib/mesure/evenements-usage.ts` (`noterEvenement`) ; `REPLIT_ACTIONS.md` (effacement ciblé) | Opposition sans effet durable : l'effacement ciblé est suivi de nouvelles écritures. | Liste d'opposition sans migration : marqueur `WebhookEvent` `mesure-opposition:<userId>` lu avant toute écriture (au moins dans `noterPremiereFois`, `noterEvenement` et la route du signal), plus une procédure en 2 lignes (poser le marqueur, effacer les lignes) ; test. Ou décision écrite de @legal que la procédure manuelle suffit. | non (à trancher par @legal) |
| 4 | `scripts/mesure-usage/tableau-abonnes.ts:10,40-46` | `--depuis 2026-11-08` = minuit UTC (01:00 à Paris). | Une date seule est lue comme minuit à Paris ; l'heure exacte reste possible en ISO avec fuseau ; test autour de minuit. | non |
| 5 | `api/iap/revenuecat-webhook/route.ts:78,92` ; `lib/mesure/tableau-abonnes.ts:150` | Abonné de l'application : aucun `renouvellement_paye`, et 2e prélèvement calculé comme mensuel, donc « non » à tort. | Écrire `renouvellement_paye` (détail `iap`) sur `RENEWAL`, avec la même clé à l'heure de l'événement, ou afficher « inconnu (application) » pour les lignes `iap`. Test. | non |
| 6 | `REPLIT_ACTIONS.md:14` (P6) | Aucun contrôle positif du signal en production : un blocage du `fetch` (CSP, Worker) passerait inaperçu, puisque la route répond 204 en silence. | P6 : avec le compte Premium de test, déplier l'étape 2 de `/parcours/repartie`, lire 1 ligne `premier_acces_premium` `etape:2`, puis l'effacer (`delete … where "userId" = '<compte de test>'`). | non |

Remarques sans correction exigée : la colonne « Bienvenue » est lue par compte et non par souscription ; `signal-acces.ts:23-25` déduplique pour tout l'onglet, pas « par chargement de page » comme l'indique le commentaire (sans effet, le serveur déduplique) ; la route ne vérifie pas que la fiche signalée existe (le signal ne peut concerner que le compte connecté, Premium relu en base).

## Escalades

- @legal : corrections 1 et 3 (exactitude de la phrase, opposition durable).
- @fullstack : corrections 2, 4, 5, 6 (non bloquantes), puis contrôle P6 positif au déploiement.
- @orchestrator : sur le plan technique, la mesure est prête pour le go écrit de Thomas dès que la phrase de confidentialité est validée.

## Essais [LIVE] reproductibles (hors dépôt)

Scripts dans le scratchpad de la session, non commités :
- `navigateur.mjs` : 11 cas Chrome ;
- `qa2-ancre.mjs` : ouverture automatique et ancre ;
- `qa2-api.sh` : statuts, CSRF, 429, chargements ;
- `qa2-capture.sh` et `qa2-diff.sh` : diff avant/après sur 4 niveaux.

### 2. Zéro régression : 10/10

- [LIVE] Profils anonyme, gratuit et Premium, deux passages chacun, builds avant et après sur la MÊME copie isolée de la base :
  - 33 statuts identiques ;
  - 12 réponses d'API identiques octet pour octet (`/api/jokes`, `/api/tips`, `/api/videos`, `/api/parcours/by-slug/repartie`) ;
  - 21 pages HTML (`/vannes`, `/vannes?page=2`, `/conseils`, `/videos`, `/parcours/repartie`, `/carnet`, une fiche conseil) avec DOM sans scripts identique et texte visible identique.
  Une fois neutralisés les empreintes et le `buildId`, le seul écart est la référence de module de `BlocExercice` dans la charge RSC de la fiche (`I[3852` devient `I[1698`). C'est attendu : le composant a changé, son rendu non.
- Note de méthode : un premier essai sur la base partagée `marrant_e2e` montrait de faux écarts (« 90+ » contre « 80+ », parcours « Boulot » sur une fiche). Un autre agent avait modifié cette base (`LearningPath.updatedAt` à 11:37:29) entre les deux builds. Refait sur une copie isolée : aucun écart. Pour toute relecture en parallèle, utiliser une base jetable propre à chaque agent.

### 3. Écriture non bloquante, dédoublonnage, concurrence : 10/10

- [LIVE] 10 POST simultanés sur `/api/mesure/acces` donnent 1 ligne. Signal envoyé par le navigateur en `keepalive` sans `await`, aucune trace dans le rendu ; réponse 204 même si la base échoue (test `mesure-usage-routes-s24.test.ts`, « base en panne : 204 quand même »).
- [STATIQUE] « Une fois par abonnement » repose maintenant sur l'empreinte de `Subscription.stripeSubscriptionId`. Celle-ci est écrite dans la même transaction que le passage en Premium (`lib/stripe-activation.ts:60-62`), par le webhook comme par `verify-session` : la course du réabonnement (correction 15 du tour 1) est fermée.
- [LIVE] Journal du serveur pendant tous les essais : 0 ligne `[mesure]`.

### 4. Données personnelles : 8/10

- [LIVE] Route du signal : sans session 401, compte gratuit 403, autre site (`Origin` étranger) 403, champ en trop 400, étape 1 ou 99 400, parcours inconnu 400, slug `<svg onload=1>` 400, GET 405 ; 35 envois rapides donnent 12 à 14 réponses 429. Aucune ligne écrite par un refus. Seuls `etape:<n>` et `exercice-<type>` peuvent être enregistrés (le suffixe se limite désormais à 1 à 3 chiffres).
- [STATIQUE] C7 rappelé en tête de `evenements-usage.ts`. Rien vers Umami, rien d'identifiant dans les journaux. Suppression avec le compte : cascade vérifiée en vrai au tour 1, schéma inchangé.
- Exactitude technique des phrases @legal (`docs/legal/espace-client-s24-phrases.md`) :
  - Exact : la ligne 13 (événements rattachés au compte, lecture anonymisée) ; « Aucun texte libre ni adresse IP » ; « effacées avec ton compte » ; « chaque jour de pratique » (quiz en base, étapes validées déjà datées) ; « chaque renouvellement payé » (Stripe).
  - -1, ligne 16, à préciser : (a) la base garde aussi un **détail**, pas seulement des dates : formule (`month`, `year`, `iap`), numéro d'étape ou type de contenu (`etape:3`, `exercice-conseil`, `carnet`), parcours du portail (`changer-formule`, `resilier`, `carte`, `simple`) ; (b) le « aha » peut aussi être le **premier quiz terminé**, absent de la liste ; (c) « si tu es abonné » : `portail_ouvert` s'écrit pour tout compte qui a un client Stripe, ancien abonné compris.
  - -1, opposition : la phrase garde « tu peux t'y opposer ». La procédure prévue (`REPLIT_ACTIONS.md`, effacement ciblé `delete from "UsageEvent" where "userId" = …`) efface le passé, mais les écritures reprennent au prochain signal : rien ne permet d'honorer une opposition dans la durée.

### 5. Migration et procédure : 10/10

- [STATIQUE] `migration.sql` est inchangé depuis le tour 1 (rejoué 2 fois [LIVE], `migrate diff` sans différence).
- `REPLIT_ACTIONS.md` donne maintenant :
  - les définitions ;
  - le préalable @legal ;
  - le réglage Stripe « Motifs de résiliation » ;
  - un diff normalisé, conforme à ce que j'ai dû neutraliser (empreintes, `buildId`, références de modules) ;
  - `POST /api/mesure/acces` sans session 401 en P6 ;
  - les temps de réponse comparés à N-1 ;
  - l'effacement ciblé ;
  - le retour arrière par `wrangler rollback`.
- Suggestion sans effet sur la note (voir correction 6) : ajouter en P6 un contrôle POSITIF du signal en production.

### 6. Tests : 10/10

- [LIVE] Jest complet en environnement vide, sans secret Stripe : 6 149 verts (5 ignorés, existants). CI GitHub verte sur `ca527bdd`, dont le job `e2e-local` qui exécute `SQL_TABLEAU_ABONNES` sur Postgres (`playwright/tests/local/mesure-usage-sql-s24.spec.ts`, avec le jeu piégé du tour 1).
- Couverture ajoutée :
  - route du signal (401, 403, 400, 204, dédoublonnage, panne) ;
  - hook « vu » (moins d'1 s : rien ; 1 s : un signal) ;
  - dépliage d'étape (abonné neuf : rien ; visiteur : rien) ;
  - listes page 2 sans écriture ;
  - `/carnet/[mois]` ;
  - RevenueCat ;
  - lecture (seuil sur les comptes, cohortes, `--depuis`).
- Les deux tests qui figeaient les définitions fausses du tour 1 sont réécrits. Aucun test affaibli.

### 7. Script de lecture : 8/10

- [LIVE] Voie psql documentée, exécutée telle quelle (`PGOPTIONS=... psql -qAt`) : JSON valide. Lancé sous `TZ=UTC`, `Europe/Paris` et `America/New_York` : sortie identique, heures de Paris justes en heure d'été comme en heure d'hiver, préfixe `M-`, réabonnement noté `M-A2`, comptes Premium sans souscription annoncés, « cas par cas » sous 15 comptes.
- -1 : `--depuis` et `--activation` lisent « 2026-11-08 » comme minuit UTC, soit 01:00 à Paris (`scripts/mesure-usage/tableau-abonnes.ts:10,40-46`). Une souscription entre 00:00 et 01:00 le 08/11 serait écartée de la cohorte, alors que le §5.2 raisonne en jours de Paris.
- -1, abonnés de l'application mobile : (a) RevenueCat `RENEWAL` n'écrit aucun `renouvellement_paye` (`revenuecat-webhook/route.ts:78,92`). Une ligne `iap` passerait donc à « Actif au 2e prélèvement : non » un mois après, même si l'abonné a renouvelé. (b) `deuxiemePrelevement` traite `iap` comme une formule mensuelle (`tableau-abonnes.ts:150`), alors que la durée réelle est inconnue.
- Remarques sans effet sur la note : la colonne « Bienvenue » est lue par compte (`tableau-abonnes.ts:58`), si bien qu'un réabonné hérite du bienvenue de sa première souscription ; les dénominateurs des indicateurs comptent les souscriptions (`tableau-abonnes.ts:242`), en le disant (« n abonnés (t souscriptions) »).

### 8. Pré-commit en environnement vide : 10/10

[LIVE] Worktree `ca527bdd`, `env -i` + variables factices des jobs CI :
- `npx tsc --noEmit -p tsconfig.build.json` = 0 ;
- `npx next lint` = « No ESLint warnings or errors » ;
- `npm run build` = 0, deux fois (proxy pour `next/font` seulement) ;
- `npx tsc --noEmit` = 0 ;
- `npx tsc -p ../../playwright/tsconfig.json` = 0 ;
- Jest complet vert.
