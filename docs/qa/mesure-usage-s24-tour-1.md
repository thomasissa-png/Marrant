# Relecture à l'aveugle QA, mesure d'usage serveur s24 (lot 0), tour 1

> Commit relu : `b654b2f` (branche `claude/ouverture-session-nzwj0w`). Relecteur : @qa. Date : 12/11/2026.
> Spécification : `docs/espace-client/brief-espace-client-s24.md` §5 (ordre a) et §5.2 ; `docs/analytics/resiliations-s23-analyse.md` R3 et §4.
> Chaque preuve est marquée [STATIQUE] (lecture, Grep, tsc, Jest) ou [LIVE] (serveur ou base réels, sortie observée).
> Banc d'essai : deux worktrees jetables (`b654b2f~1` = avant, `b654b2f` = après), PostgreSQL 16 local seedé (`scripts/seed.sh`), builds standalone lancés en environnement vide (`env -i` + variables factices du job `e2e-local`, plus le proxy pour `next/font`), comptes de test Premium et gratuit avec jeton de session JWT signé par le secret factice.

## Notes

| # | Critère | Note | Preuve principale |
|---|---|---|---|
| 1 | Exactitude des définitions | **4/10** | [LIVE] une seule requête de chargement suffit à écrire « premier accès » (parcours, 3 listes, carnet) et « aha » (fiche) |
| 2 | Zéro régression | **10/10** | [LIVE] 12 pages HTML et 12 réponses d'API identiques avant/après, 3 profils |
| 3 | Écriture non bloquante, dédoublonnage, concurrence | **9/10** | [LIVE] 20 appels simultanés = 1 ligne ; clé étrangère absente = `false` sans exception |
| 4 | Données personnelles | **7/10** | [LIVE] cascade à la suppression du compte ; [STATIQUE] `/confidentialite` ne couvre pas cette mesure |
| 5 | Migration et procédure | **9/10** | [LIVE] 2 passes sur la base au schéma d'avant, `migrate diff` = aucune différence |
| 6 | Tests | **7/10** | [LIVE] Jest 6 124 verts ; 3 accroches sans test, requête SQL jamais exécutée, 2 tests figent une définition fausse |
| 7 | Script de lecture | **7/10** | [LIVE] fuseau, J7 et 2e prélèvement exacts sur données piégées ; la voie psql documentée plante |
| 8 | Pré-commit en environnement vide | **10/10** | [LIVE] tsc build 0, lint 0, build 0, tsc complet 0, Jest 402 suites ; CI verte sur `b654b2f` |

**Note globale : 7,9/10** (moyenne des 8 critères). **Verdict : NO-GO pour le déploiement** tant que les corrections 1 à 5 ne sont pas faites. Le code est propre et sans régression, mais la mesure enregistre l'ouverture d'une page comme une lecture. Or la période de référence (14 jours au moins avant l'espace) ne se rattrape pas : une référence fausse dès le premier jour rend tout avant/après inutilisable.

### 1. Exactitude des définitions : 4/10

Bien mesuré [STATIQUE + LIVE] :
- « aha » par étape validée : écrit après la transaction, seulement si l'étape n'était pas déjà faite (`progress/route.ts:209`), donc un double clic n'écrit rien.
- Jour de pratique du quiz : un par jour civil de Paris. Les validations d'étape sont déjà datées et le script les fusionne avec le quiz ; `recordPractice` n'a pas d'autre appelant.
- Résiliation programmée : `canceled_at` exact, motif codé, dédoublonnage sur la date de demande.
- Renouvellement : `billing_reason = subscription_cycle` seulement.
- Ouverture du portail avec le parcours demandé.

Écarts, prouvés par le script d'essai `ouverture.sh` (hors dépôt ; table vidée avant chaque cas, une seule requête de compte Premium neuf, celle que le navigateur envoie au chargement) [LIVE] :

| Ce que fait l'abonné | Ce qui est écrit |
|---|---|
| ouvre `/parcours/repartie` (appel `by-slug` au montage, `parcours-detail.tsx:213`) | `premier_acces_premium=parcours:repartie` |
| ouvre `/vannes` (page 1 = 12 vannes, limite gratuite 10) | `premier_acces_premium=liste-vannes` |
| ouvre `/conseils` (10 conseils, limite 3) | `premier_acces_premium=liste-conseils` |
| ouvre `/videos` (12 vidéos, limite 3) | `premier_acces_premium=liste-videos` |
| ouvre une fiche conseil (bloc chargé au montage, `bloc-exercice.tsx:57-73`) | `aha=exercice-conseil` ET `premier_acces_premium=exercice-conseil` |
| ouvre une fiche vanne | `aha=exercice-vanne` ET `premier_acces_premium=exercice-vanne` |
| ouvre `/carnet` | `premier_acces_premium=carnet` (acceptable : la page EST le contenu) |

- **Parcours.** Pour un abonné neuf, `stepToOpen` déplie l'étape 1 (gratuite) et les étapes 2+ restent repliées. Le §5.2 exclut explicitement « la simple ouverture d'une page ». Ce n'est **pas acceptable**, car cela touche justement la population mesurée : la page de succès renvoie vers `/parcours` ou vers la fiche d'origine, donc presque tout acheteur qui clique compterait comme « accès en moins de 10 minutes ». Correction sans toucher au rendu : voir correction 1.
- **« aha » par exercice.** Il n'existe pas de geste « ouvrir l'exercice » : le bloc est chargé au montage de chaque fiche. Un acheteur ramené sur sa fiche après paiement (`returnTo`, `success/page.tsx:59-66`) a donc son « aha » et son premier accès à la même seconde. L'indicateur « aha à 24 h » serait vrai pour tous, et les deux indicateurs ne se distinguent plus.
- **Souscription.** `webhook/route.ts:150` prend `session.created`, c'est-à-dire la création de la session Checkout au clic « S'abonner », avant la saisie de la carte. Ce n'est pas « l'heure exacte du paiement » annoncée par le commentaire, par le test (`mesure-usage-webhook-s24.test.ts:120`) et par `REPLIT_ACTIONS.md`. R3 §4.1 demande l'heure du `checkout.session.completed`. Le biais (temps passé sur la page Stripe) s'ajoute à chaque délai, sur un seuil de 10 minutes.
- R3 attend 6 événements. Le bienvenue envoyé est bien déductible : l'ancre E0 n'est écrite que si l'envoi réussit (`paiement-notifications.ts:92`). Mais ni le bienvenue ni le clic « résilier » n'apparaissent dans le tableau de lecture (correction 11).

### 2. Zéro régression : 10/10

- [LIVE] Profils anonyme, gratuit et Premium, deux passages chacun. Résultats : statuts identiques (200 partout) ; les réponses de `/api/jokes`, `/api/tips`, `/api/videos` et `/api/parcours/by-slug/repartie` sont **identiques octet pour octet** (12 sur 12) ; le HTML de `/vannes`, `/parcours/repartie`, `/carnet` et `/conseils` est **identique** (12 sur 12) une fois neutralisés les empreintes de fichiers JS et le `buildId`, lignes comparées sans tenir compte de leur ordre.
- Seul écart observé : le premier passage anonyme de `/vannes` côté après découpe le flux RSC autrement (même contenu, morceaux répartis différemment). Le second passage est identique. Ce n'est pas une régression.
- [LIVE] Temps de réponse en local, Premium : carnet 41 à 58 ms avant, 61 à 63 ms après ; API +2 à +6 ms. En production (Worker vers Neon), chaque requête de mesure coûte un aller-retour réseau : voir correction 13.
- [STATIQUE] L'écriture se fait après le calcul de la réponse et ne modifie aucun champ. Le refactor `readSessionPlan` → `readSessionCompte` garde le même retour et le même journal.

### 3. Écriture non bloquante, dédoublonnage, concurrence : 9/10

- [LIVE] Essai sur Postgres réel (`concurrence.ts`) :
  - 20 `noterPremiereFois` simultanés : 1 ligne (une seule fonction rend `true`) ;
  - 10 exercices simultanés : 1 `aha` ;
  - 5 quiz le même jour : 1 `jour_pratique` ;
  - après une nouvelle souscription : 1 premier accès de plus, pas davantage ;
  - compte inconnu (P2003) : `false`, aucune exception, journal `[mesure] aha non enregistré (P2003)` sans identifiant.
- [LIVE] Le journal du serveur pendant les essais de route ne contient aucune ligne `[mesure]` (le doublon P2002 est silencieux).
- -1 : (a) fenêtre de course d'un abonné qui se réabonne (correction 15) ; (b) aucune borne de temps sur l'écriture : une base lente (pas en panne) retarde la réponse de l'abonné, alors que la mesure est attendue (`await`) avant la réponse. C'est le choix assumé « zéro fire-and-forget sous Workers ». Acceptable, mais à mesurer en P6.

### 4. Données personnelles : 7/10

- [LIVE] Suppression du compte : `prisma.user.delete` donne 0 ligne `UsageEvent` restante (cascade). `deleteAccount` (`lib/account.ts:159`) passe par `user.delete`.
- [STATIQUE] Les détails proviennent d'une liste fermée (`detailFerme`), avec un suffixe limité à `[a-z0-9-]{1,80}`. Aucun e-mail, aucune IP, aucun texte libre ; le commentaire de résiliation Stripe n'est jamais lu. Aucun appel Umami. Les journaux ne contiennent que le type et un code d'erreur.
- -3 : la politique de confidentialité annonce « Comprendre, **de façon globale**, où les membres avancent ou bloquent dans les parcours » (`confidentialite/page.tsx:117`, avec « tu peux t'y opposer »). La nouvelle mesure est un journal **par compte**, lu ligne par abonné (pseudonymisé), qui couvre aussi les listes, le carnet, le portail et le motif Stripe recopié chez nous. Aucun moyen d'opposition n'est prévu (ni arrêt par compte, ni effacement ciblé). `REPLIT_ACTIONS.md:15` renvoie la décision à Thomas, « avis @legal seulement si jugé nécessaire ». Pour des données personnelles, l'avis @legal est un préalable au go (correction 5). Il faut aussi rappeler C7 (`docs/legal/onboarding-e1-resilies-s23.md:28`) : le motif ne doit jamais personnaliser un e-mail.

### 5. Migration, procédure, retour arrière : 9/10

- [LIVE] Base au schéma d'AVANT (`prisma db push` du worktree `b654b2f~1`), puis `migration.sql` joué deux fois avec `ON_ERROR_STOP=1` : passe 1 OK, passe 2 OK (avis « already exists, skipping » seulement). `prisma migrate diff --from-url … --to-schema-datamodel` donne « No difference detected ». `\d "UsageEvent"` = 7 colonnes, unique `dedupKey`, 2 index, clé étrangère `ON DELETE CASCADE`.
- [STATIQUE] Procédure : sauvegarde, migration avant le code, N-1 et `wrangler rollback`. Le code d'avant ignore la table. Exact.
- -1 : `REPLIT_ACTIONS.md:12` demande un « HTML identique à N-1 (diff) » sans dire de neutraliser les empreintes et le `buildId` : un diff brut est toujours différent. Il manque aussi le contrôle du réglage Stripe « Motifs de résiliation » du portail (R3 §4) : sans lui, `motif` reste vide (correction 14).

### 6. Tests : 7/10

- [LIVE] Jest complet en environnement vide, sans secret Stripe : 402 suites, 6 124 tests verts (5 ignorés, existants). CI GitHub verte sur `b654b2f`.
- Aucun test existant affaibli : les deux tests du carnet ne changent que le mock (`readSessionCompte` piloté par `readSessionPlan`), et toutes les assertions de rendu sont conservées.
- -3 :
  - accroches sans test : `/api/tips`, `/api/videos`, `/carnet/[mois]` (seul `/carnet` est testé) ;
  - `SQL_TABLEAU_ABONNES` n'est jamais exécuté (test sur la chaîne seulement), alors que la CI a un Postgres (job `e2e-local`) ;
  - `mesure-usage-webhook-s24.test.ts:120` et `mesure-usage-routes-s24.test.ts:103` figent les définitions fausses du critère 1 (heure de session, `aha` à l'ouverture de la fiche).

### 7. Script de lecture : 7/10

- [LIVE] Jeu piégé dans une base jetable :
  - abonné à 2 souscriptions (lignes A et A2, lettre conservée) ;
  - abonné antérieur à la mesure (absent, comme prévu) ;
  - quiz à 23 h 30 UTC et à 10 h UTC le même jour de Paris ;
  - quiz à 22 h 59 UTC en fin de fenêtre J7.
  Résultat : 2 jours de pratique, et non 3 comme en UTC. Fuseau et fenêtre exacts. Délais, résiliation (« après 2 j », `too_expensive`) et 2e prélèvement (« oui », « non », « pas encore ») exacts. Moins de 15 lignes : « lecture cas par cas », aucun chiffre agrégé.
- [STATIQUE] Lecture seule : `sql.transaction([...], { readOnly: true })`, aucun identifiant en sortie.
- -3 :
  - [LIVE] la voie psql documentée (`tableau-abonnes.ts:16`) écrit « SET » en tête du JSON, et `--depuis-json` plante (`Unexpected token 'S'`) ;
  - le seuil de 15 compte toutes les souscriptions (`tableau-abonnes.ts:189`), réabonnements et cohorte de référence compris, au lieu des « abonnés depuis l'activation » ; aucune séparation avant/après ni filtre « entrés après le 08/11 » (facteur confondant du §5.2) ;
  - les dates sont affichées en UTC. De plus, le pilote Neon lit `timestamp` sans fuseau comme une heure locale (analyseur du type 1114 avec `isUTC=false` dans `@neondatabase/serverless`) : décalage d'une heure si le script tourne hors UTC ;
  - les lettres A, B, C entrent en collision avec les A à D de `resiliations-s23-donnees.md`.

### 8. Pré-commit en environnement vide : 10/10

[LIVE] Dans le worktree `b654b2f`, `env -i` avec les variables factices des jobs CI :
- `npx tsc --noEmit -p tsconfig.build.json` = 0 ;
- `npx next lint` = « No ESLint warnings or errors » ;
- `npm run build` = 0 (avec le proxy pour `next/font`) ;
- `npx tsc --noEmit` = 0 ;
- Jest complet = vert (voir critère 6).

## Corrections exigées pour 10/10

| # | Fichier:ligne | Problème | Correction | Bloquant |
|---|---|---|---|---|
| 1 | `api/parcours/by-slug/[slug]/route.ts:114-117` | Ouvrir la page parcours écrit « premier accès » alors que les étapes 2+ sont repliées [LIVE]. | Retirer l'écriture de `by-slug` (ou la renommer en un type distinct, hors indicateurs). Ajouter une petite route POST de mesure (session, plan relu en base, `stepOrder >= 2` vérifié en base, détail `etape:<n>`) appelée par `parcours-detail.tsx` au moment où une étape d'ordre >= 2 est réellement dépliée : clic, ancre `#etape-N`, ou dépliage automatique d'un abonné déjà avancé. Appel `fetch(..., { keepalive: true })` sans `await` ni retour visible : aucun changement de rendu, HTML et réponses d'API inchangés. | **oui** |
| 2 | `api/fiches/exercice/route.ts:61,68,77` ; `lib/mesure/evenements-usage.ts` (`noterExerciceOuvert`) | Ouvrir une fiche écrit « aha » ET « premier accès » à la même seconde, retour de paiement compris [LIVE]. | Ne plus écrire depuis le GET. Compter l'exercice lu quand la section existante `data-bloc-exercice` devient visible (IntersectionObserver, au moins 50 % pendant au moins 1 s, un seul envoi vers la route de la correction 1, détail `exercice-<type>`), sans changement de rendu. Si @product-manager préfère réserver « aha » à « première étape validée », le documenter dans le brief §5.2. Dans les deux cas, la définition opérationnelle doit être écrite au §5.2. | **oui** |
| 3 | `api/jokes/route.ts:100-103`, `api/tips/route.ts:91-94`, `api/videos/route.ts:113-116` | La page 1 (12, 10 et 12 éléments, limites gratuites 10, 3 et 3) écrit « premier accès » dès le chargement [LIVE]. | Compter seulement page >= 2, ou l'affichage effectif d'un élément de rang supérieur à la limite (même IntersectionObserver que la correction 2 ; pour une vanne : chute révélée). Les routes de liste ne gardent aucune écriture. | **oui** |
| 4 | `api/stripe/webhook/route.ts:150` | Heure de souscription = `session.created` (clic sur « S'abonner »), pas le paiement : biais sur l'indicateur « 10 minutes ». | Prendre `event.created` du `checkout.session.completed`, transmis comme `evenementLe` l'est déjà pour `subscription.updated` (stable entre deux livraisons, donc clé inchangée au rejeu), ou `subscription.start_date`. Ne pas toucher à `dateSouscription` de l'e-mail approuvé. Corriger le commentaire, le test `mesure-usage-webhook-s24.test.ts:120` et `REPLIT_ACTIONS.md:7,12`. | **oui** |
| 5 | `confidentialite/page.tsx:117` ; `REPLIT_ACTIONS.md:15` | Journal d'usage par compte, avec le motif Stripe recopié, non couvert par la finalité « de façon globale », et aucun moyen d'opposition. | Avis @legal AVANT le go : finalité, base légale, mention (texte relu par @copywriter, approuvé par Thomas), durée de conservation, procédure d'opposition (effacement ciblé `delete from "UsageEvent" where "userId" = …` et arrêt pour ce compte), rappel de C7 en commentaire dans `evenements-usage.ts`. Aucune modification de code demandée à @qa. | **oui** (go) |
| 6 | `scripts/mesure-usage/tableau-abonnes.ts:16` | La voie psql documentée produit un JSON invalide (« SET » en tête) [LIVE]. | `PGOPTIONS='-c default_transaction_read_only=on' psql "$DATABASE_URL" -At -f q.sql`, ou ajouter `-q`. Vérifier la commande telle qu'écrite. | non |
| 7 | `lib/mesure/tableau-abonnes.ts:163,189` | Le seuil de 15 compte les souscriptions de tout l'historique ; pas de séparation des cohortes ni de filtre post-08/11. | Option `--activation <date>` : n = comptes distincts souscrits après l'activation ; deux blocs, « 10 derniers avant » et « 10 premiers après » ; option `--depuis 2026-11-08` (facteur confondant). Sous 15 après activation : cas par cas, aucun chiffre agrégé. | non |
| 8 | `lib/mesure/tableau-abonnes.ts:172` et SQL | Dates affichées en UTC ; le pilote Neon lit `timestamp` comme une heure locale. | Renvoyer les dates en `timestamptz` (`AT TIME ZONE 'UTC'`) ou en texte ISO avec `Z`, et afficher l'heure de Paris (`Intl`, `Europe/Paris`). Test avec `TZ=Europe/Paris`. | non |
| 9 | `lib/mesure/tableau-abonnes.ts` (`lettre`) | Les lettres A, B, C se confondent avec A à D de `resiliations-s23-donnees.md`. | Préfixe ou mention en tête de sortie (« lettres propres à ce tableau »), ou numérotation qui reprend après D. | non |
| 10 | `lib/mesure/tableau-abonnes.ts` ; `api/iap/revenuecat-webhook/route.ts` ; `lib/billing/stripe-reconciliation.ts` | Les abonnés sans ligne `souscription` (antérieurs, application mobile, activation par réconciliation) disparaissent sans bruit. | Le script affiche « N abonnés Premium actifs sans ligne de souscription ». Si ces voies sont en service, écrire `souscription` aussi depuis RevenueCat et la réconciliation. | non |
| 11 | `lib/mesure/tableau-abonnes.ts` | Indicateur R3 (« 6 événements pour 100 % des nouveaux abonnés ») non lisible : ni bienvenue envoyé (ancre E0), ni clic « résilier » (`portail_ouvert=resilier`). | Ajouter deux colonnes. Note pour plus tard : si `RESILIATION_PAGE_OUVERTE` passe à `true`, le chemin `/resiliation` n'écrit rien d'équivalent : prévoir l'événement. | non |
| 12 | `__tests__/api/mesure-usage-routes-s24.test.ts`, `feature/carnet-page.test.tsx` | `/api/tips`, `/api/videos`, `/carnet/[mois]` sans test ; SQL jamais exécuté ; 2 tests figent les définitions fausses. | Tests des 3 accroches (écriture, non-écriture, échec = réponse identique). Exécution réelle de `SQL_TABLEAU_ABONNES` sur le Postgres du job `e2e-local`, avec le jeu piégé de ce rapport (2 souscriptions, minuit de Paris, fin de J7). Réécrire les 2 tests après les corrections 2 et 4. | non (suit 1 à 4) |
| 13 | `lib/mesure/evenements-usage.ts` (`noterExerciceOuvert`) | 2 lectures séquentielles à chaque fiche vue par un abonné, indéfiniment. | Une seule lecture (`type in [souscription, premier_acces_premium, aha]`), ou disparition avec la correction 2. Mesurer le temps de réponse P6 contre N-1 (§5.3). | non |
| 14 | `REPLIT_ACTIONS.md:12` | Diff HTML brut toujours différent ; réglage « Motifs de résiliation » non vérifié. | Préciser la normalisation (empreintes `-[0-9a-f]{16}.js`, `buildId`, comparaison sans ordre). Ajouter la vérification dans Stripe, Paramètres, Portail client. | non |
| 15 | `api/stripe/webhook/route.ts:146-155` ; `noterPremiereFois` | Fenêtre de course pour un abonné qui se réabonne : Premium activé (webhook ou `verify-session`) avant la ligne `souscription`. Le premier accès écrit dans cet intervalle est perdu (le plus récent reste l'ancien premier accès), puis noté plus tard, donc délai surestimé. | Ancrer « une fois par souscription » sur `Subscription` (identifiant Stripe), ou écrire `souscription` dans la même transaction que l'activation. Test de la course. | non |

## Essais [LIVE] reproductibles (hors dépôt)

Scripts d'essai dans le scratchpad de la session, non commités :
- `capture.sh` : diff avant/après, 3 profils, pages et API ;
- `ouverture.sh` : ce qu'écrit une simple ouverture de page ;
- `concurrence.ts` : concurrence, dédoublonnage, cascade ;
- `jetons.ts` : comptes et jetons de test.

Le jeu piégé du script de lecture tient en 13 lignes `UsageEvent` (voir critère 7). À reprendre tel quel pour la correction 12.

## Escalades

- @fullstack : corrections 1 à 4 et 6 à 15, puis tour 2 de cette relecture.
- @legal : correction 5 (avant tout go de Thomas).
- @product-manager : définition opérationnelle de « exercice ouvert » et de « liste lue » à écrire au §5.2 (corrections 2 et 3).
