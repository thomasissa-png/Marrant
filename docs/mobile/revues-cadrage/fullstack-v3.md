# Revue technique à l'aveugle du cadrage v3 de l'app iPhone (@fullstack, s23, tour 4, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (v3, commit `7674320`), confronté à ma revue v2 (`docs/mobile/revues-cadrage/fullstack-v2.md`), au code de la branche `claude/ouverture-session-nzwj0w` et à la base de production en **lecture seule** (pilote Neon HTTPS, lots en transaction `READ ONLY` vérifiée par `transaction_read_only = on`, aucune URL ni secret affiché, aucune donnée personnelle lue). Revues v3 des autres relecteurs non lues. Aucun code, cadrage ou base modifié ; rien commité ni déployé.
> Références `fichier:ligne` relatives à `apps/web/` sauf mention contraire.

## 1. Notes

| Critère | v1 | v2 | v3 | Motif principal |
|---|---|---|---|---|
| Faisabilité | 8 | 8 | 8/10 | Modèle de la vanne du jour devenu sain (`Installation`, `AssignationJour`, contrainte unique, pools mesurés). Mais la chaîne du défi de 30 s (§3.6, lot C(u)) repose sur un « pipeline quotidien existant » **coupé en production** par [CHOIX UTILISATEUR] du 30/09 et du 01/10 : telle qu'écrite, elle ne s'exécute pas. |
| Exactitude par rapport au code | 7 | 7 | 8/10 | Les 4 vannes du §2.1 sont exactes au caractère près (§3.1 ci-dessous), pools et catégories exacts, `getWidgetVanneDuJour` et `ensureDailyContentFromStock` retirés. Erreur nouvelle : la génération quotidienne et la validation automatique par le Stand-Up Director ne tournent plus (`CONTENT_GENERATION_ENABLED` absent du Worker). |
| Sécurité (comptes, Premium, jetons) | 7 | 8,5 | 8,5/10 | Fenêtre de revue Apple fermée (a) à (d) : bien. Restent : `pratique` ne vérifie pas que la vanne est celle de l'assignation, crédite deux fois un compte à deux installations ; limite de création d'installations sans chiffre ni clé (IPv6, réseaux mobiles partagés). |
| Cohérence Premium site et app | 7,5 | 9 | 9/10 | Inchangé et juste : `recalculerPlan` écrivain unique, `PremiumGrant`, `StoreEntitlement`, SANDBOX borné, `TRANSFER` sur les deux comptes. |
| Testabilité | 7 | 8,5 | 8,5/10 | Tests du lot 5b-0 nommés (pool qui bouge, bascule 4 h, sans notification, concurrence, thèmes). Manquent ceux de `pratique` et de la limite par IP. |
| Plan technique par dépendances | 6,5 | 8,5 | 8/10 | Ordre C(a), C(c), C(u), C(d0), 5b-0, 7 cohérent ; mais le contenu de C(u) et de C(d1) est à réécrire (production par lot en session, import sans IA), ce qui change qui fait quoi. |
| **Note globale** | **7,2** | **8,2** | **8,5/10** | **GO sous réserve, encore sous la barre de 9** : 5 corrections obligatoires (§4), dont 1 bloquante sur le fond (O3-1, chaîne du défi contraire à un choix du fondateur) et 4 de précision (horloges, `pratique`, contradictions du §3.2, cycle de vie de l'installation). Aucune ne remet en cause l'architecture. |

## 2. Statut de mes corrections v2 (vérifié dans le texte et dans le code)

| # v2 | Sujet | Statut | Où dans la v3 | Vérification / réserve |
|---|---|---|---|---|
| O2-1 | Vannes du §2.1 lues en base | **Traitée** | §2.1, lot C(a) | Les 4 identifiants existent, `isActive = true`, `copyVerdict = GARDER`, technique non nulle ; amorce, chute, « Pourquoi ça marche », « À toi de jouer » **identiques au caractère près** ; appartenance aux 93 juste (A et B oui, C et D non). Reliquats : en-tête ligne 5 « cette session n'a pas d'accès à la base » contredit la ligne 48 « lus en base [...] par la session » ; §15 garde en bloquant « lecture en base des textes A à D par @fullstack », faite ici (S3-1). |
| O2-2 | `Installation`, `AssignationJour` | **Traitée, réserve** | §3.2, §7, lot 5b-0 | Tables, contrainte unique, lecture par route, job, widget et contrôle du défi : conformes. Réserves : contradiction « figée » / « réécrite » (O3-4) ; secret, limite et purge non définis (O3-5). |
| O2-3 | Pool mesuré et règle de mélange | **Traitée** | §3.2, décision 5, §6 H-stock | Recompté le 04/11 : identique. Pool de l'app avec les deux champs et `defi30s` : conforme. Règle de mélange en [HYPOTHÈSE] : correct (décision de Thomas). |
| O2-4 | Série au jour de Paris | **Partielle** | §3.2 tableau, §3.3 | Série du compte inchangée à Paris : conforme. Mais la série locale du visiteur et l'idempotence de `pratique` passent au jour local à bascule 4 h, ce qui remet deux horloges dans la fusion (O3-2, O3-3). |
| O2-5 | Reliquats v1 | **Traitée** | §3.2 l. 80, §7 `daily-push` | Plus aucun appel à `getWidgetVanneDuJour` ni à `ensureDailyContentFromStock` ; `widgetJokeWhere(WIDGET_JOKE_IDS)` cité (`lib/widget/vanne-du-jour.ts:106-112`). |
| O2-6 | Fenêtre de revue Apple | **Traitée** | §7 « Bac à sable », §10, §11, §13 lot 13, décision 9 | (a) deux comptes, (b) aucun TestFlight externe avec achat interrupteur ouvert, (c) `recalculerPlan` à la fermeture, (d) procédure au lot 13 et dans `REPLIT_ACTIONS.md` : tout y est, cohérent entre sections. |

Souhaitables v2 : S2-1 (§11 l. 253), S2-2 (filtre des 7 jours), S2-4 (C(a)), S2-5 (§7), S2-6 (§7), S2-7 (14 catégories), S2-8 (§7) : traités. S2-3 renvoyé à la session principale : `project-context.md:82` dit encore « ~602 vannes actives » (149 au 04/11).

Bilan : 5 traitées (dont 1 avec réserve), 1 partielle, 0 non traitée.

## 3. Vérifications demandées

### 3.1 Les 4 vannes du §2.1, en base (lecture seule, 04/11)

| | Identifiant | Catégorie | Active, GARDER | Technique en base | Textes du cadrage vs base | Dans les 93 (`config/widget-vanne-du-jour.ts`) |
|---|---|---|---|---|---|---|
| A | `cmmnsqn120000th63o435xsb0` | AUTODERISION | oui, oui | « L'avis de l'institution » | 4 champs identiques | oui |
| B | `cs14jkefbc9f40abb6f8a2ca` | BOULOT | oui, oui | « Le compliment qui se dévalue » | 4 champs identiques | oui |
| C | `cs14jk0d9dfe9b5c26db5f8d` | SOIREES | oui, oui | « Le plan qui se retourne » | 4 champs identiques | non (catégorie exclue) |
| D | `cs14jkb9ba433a0746280280` | DATING | oui, oui | « Le changement de catégorie » | 4 champs identiques | non (catégorie exclue) |

Aucune des 4 n'est au calendrier du site des 7 prochains jours. `cs19jkboulot1` existe (BOULOT, active, GARDER, deux champs remplis, dans les 93) : substitution possible, pas nécessaire. Colonne `defi30s` absente du schéma comme de la base (attendu). Le doublon « À toi de jouer : » en tête de B et D est dans le champ en base : il s'affiche donc probablement déjà sur la fiche du site sous le libellé « À toi de jouer » [À VÉRIFIER à l'œil sur les deux fiches].

### 3.2 Pools (recomptés, lecture seule, 04/11)

869 vannes, 149 actives = 149 validées (`lib/ai/daily-joke-pool.ts:17-21`) ; 5 sans l'un des deux champs ; 93 sur 93 du widget encore valides hors catégories exclues ; catégories identiques au §3.2. Calendrier du site : 58 jours planifiés jusqu'au 31/12 ; **sur les 7 prochains jours, 4 vannes sont dans les 93**, et 35 des 93 sont planifiées d'ici le 31/12. Le pool « sans thème » de l'app est donc au plus 93, moins les vannes sans défi validé, moins 4 à 7 vannes du calendrier glissant : la phrase « première répétition au 94e jour » est fausse (S3-2).

### 3.3 Chaîne du défi de 30 s (§3.6, lot C) : le pipeline cité est coupé

- `runDailyContentJob` (`lib/scheduler/jobs.ts:47-56`) : si `isContentGenerationEnabled()` est faux, seul `ensureDailyContentFromStock` tourne, aucune génération ; `isContentGenerationEnabled` lit `CONTENT_GENERATION_ENABLED === "true"` (`lib/scheduler/prepared-content.ts:17-19`).
- `REPLIT_ACTIONS.md:617` et `:1844` : génération coupée, variable absente du Worker ; la relecture IA (`runCopyReviewJob`) et `backfillMissingJokeDecryptagesTask` coupées aussi.
- `docs/founder-preferences.md:35` et `:39` : **[CHOIX UTILISATEUR] du 30/09 et du 01/10** : « Aucune IA ne produit seule au fil de l'eau », contenu préparé par lot mensuel ou trimestriel, en session, validé. Non re-questionnable (P0 s8).
- Le modèle existant à reprendre : décryptages appliqués « une fois au boot via `runStartupTasks` (`applyJokeDecryptagesTask`), sans IA, depuis le fichier pré-rédigé » (`lib/scheduler/jobs.ts:991-995`). Leçon S2-4 : ce fichier est indexé par `content` et contient des entrées mortes ; un import de `defi30s` doit être indexé par **identifiant**, avec une empreinte du texte.
- Corollaire : il n'y a pas de « nouvelle vanne chaque jour » à couvrir ; les nouvelles vannes arrivent par lot, qui doit porter leur défi.

### 3.4 Tableau des trois horloges et idempotence de `pratique`

`nextStreak` et `effectiveStreak` comparent des jours de Paris d'instants (`lib/progression.ts:65-84`) : la ligne « série du compte » du tableau est juste. Deux écarts :
- **Fusion** : la série locale du visiteur est comptée au jour local à bascule 4 h, celle du compte au jour de Paris. Exemple à Paris : défi à 3 h le 5 (jour de contenu du 4), compte créé à 10 h, défi à 21 h le 5 : la série locale comptait 2 jours, `nextStreak` voit le même jour de Paris et ne monte pas. Inverse : défi à 23 h le 4 puis à 2 h le 6 (jours de contenu 4 et 5, continus dans l'app) : `nextStreak` voit un trou et remet à 1. Yanis, le motif même de la bascule à 4 h, est celui qui tombe dans ces cas ; le cadrage n'écrit que l'écart hors Europe.
- **Heure d'envoi avant 4 h** (« autre heure » au quart d'heure, §4.1) : à 2 h 30 le jour de contenu est encore la veille ; `dernierEnvoiJour` envoie donc la vanne d'hier, déjà affichée depuis 24 h, 1 h 30 avant qu'elle ne soit remplacée.
- **`pratique`** (§3.3) : unique sur (compte, installation, jour local). Un compte sur deux installations (iPhone et iPad, ou réinstallation : nouvelle installation, nouvelle assignation) pratique deux vannes différentes le même jour et gagne deux fois les points ; rien n'écrit que la vanne pratiquée doit être celle de l'assignation de l'installation authentifiée ; rien ne dit si `pratique` entre dans la file d'écritures hors ligne (§4 : seul `progress` y est), donc avec quel instant `nextStreak` est appelé au rejeu.

### 3.5 Installation et anti-moisson

Le limiteur partagé existe déjà : `sharedRateLimit` (`lib/rate-limit.ts:7-20`, table `JobLock`, comptage atomique, clé hachée, repli mémoire si la base tombe) ; `rateLimit` en mémoire n'est pas fiable sous Workers (même fichier, l. 4-6). Le cadrage ne le nomme pas et ne chiffre pas la limite : le « risque résiduel » du §3.2 (3 défis × installations par IP) n'a donc pas de valeur. Non écrits : qui génère le secret, sa taille, son stockage (le trousseau iOS survit à la désinstallation : la durée « jusqu'à désinstallation » du §9.3 n'est vraie qu'avec une purge au premier lancement), la conduite si la création est refusée (écran 1 jamais vide), la purge des installations **sans jeton de notification** (la seule purge écrite est `DeviceNotRegistered`, qui ne les touche jamais) et des `AssignationJour`.

### 3.6 Revue Apple, `APP_SANDBOX_PREMIUM`, comptes de démonstration

Conforme (voir O2-6). Liste fermée : `EMAILS_INTERNES_EXCLUS` (`lib/analytics/comptes-test.ts:17`) existe et ne contient qu'une adresse ; les adresses de service des deux comptes de revue s'y ajouteront. Deux remarques mineures en S3-3.

### 3.7 Constat annexe : `quality-watch` ne retire pas

`runQualityWatch` remplace la vanne du jour **du site** dans `DailyContent` quand le Stand-Up Director la juge sous la barre (`lib/ai/quality-watch.ts:150-162`), sans toucher `isActive` ni `copyVerdict` : la vanne reste dans le pool de l'app. Ma revue v2 parlait à tort de « retraits par `quality-watch` ». Voir S3-5.

## 4. Nouvelles corrections OBLIGATOIRES (v3 vers v4)

Ces 5 corrections bloquent le 9/10 ; aucune n'attend une réponse de Thomas (les choix qu'elles touchent sont en §6).

**O3-1. §3.6, lot C(u), C(d1), décision 7 bis : réécrire la chaîne du défi sur le contenu préparé par lot, sans pipeline quotidien (bloquante sur le fond).** Le « pipeline quotidien existant (génération puis validation Stand-Up Director) » est coupé en production et sa remise en route irait contre le [CHOIX UTILISATEUR] du 30/09 et du 01/10 (§3.3 de cette revue). Retirer aussi l'argument « commandement 5 » : la doctrine du fondateur prime. Écrire :
(a) **Production** : `defi30s` rédigé **en session** par lot (@copywriter, avec le prompt et les critères d'évaluation d'@ia comme outil), relu à l'aveugle 2 sur 3, d'abord les pools du build 0, puis le reste ; **toute nouvelle vanne arrive par lot avec son défi** (sinon elle n'entre pas dans le pool de l'app) ; le lot mensuel des vannes du playbook inclut le défi.
(b) **Import** : fichier versionné indexé par **identifiant** de vanne (jamais par `content`, entrées mortes S2-4), appliqué par une tâche de démarrage idempotente sans IA sur le modèle de `applyJokeDecryptagesTask` (marqueur par vanne, garde-fou si l'amorce ou la chute en base ne correspond plus à l'empreinte du fichier).
(c) **Statut stocké** : « non nul et validé » demande plus d'une colonne. Migration additive (deux schémas) : `defi30s`, `defi30sValideAt`, `defi30sEmpreinte` (amorce + chute + défi au moment de la validation). Pool de l'app = `defi30sValideAt` non nul ET empreinte égale au texte courant : toute retouche de l'amorce ou de la chute sort la vanne du pool jusqu'à revalidation (règle d'or P0 s18).
(d) **Lot C(u)** devient : format du fichier, tâche d'import, migration, champ dans la liste fermée de `/api/mobile/jour`, prompt et grille d'@ia utilisés en session ; aucun job planifié. Alerte H-stock : lue par la sonde ou le récapitulatif admin existants, pas par un job qui produit.

**O3-2. §3.3 et §4 « Hors ligne » : spécifier `pratique` jusqu'au bout.** Écrire : (a) le serveur refuse (409) une `pratique` dont la vanne n'est pas l'assignation de l'installation authentifiée pour son jour local courant ; (b) **points et série une fois par compte et par jour de Paris** (contrainte unique sur compte et jour de Paris pour l'action « défi du jour »), l'unicité par installation ne servant qu'au rejeu ; une seconde installation du même compte le même jour : 200 sans points ; (c) `pratique` **hors file d'écritures** : sans réseau, le défi compte pour la série locale seulement, le compte n'est pas crédité au retour (rejeu = instant de réception, donc série faussée) ; alternative : file acceptée si la clé de jour envoyée est celle d'aujourd'hui ou d'hier et que la vanne correspond à l'assignation, instant de réception pour `nextStreak` ; (d) `sharedRateLimit` (`lib/rate-limit.ts`) nommé comme limiteur partagé. Tests Jest : rejeu, deux installations, vanne non assignée, bascule de 4 h.

**O3-3. §3.2 tableau des trois horloges : une seule règle pour les deux séries, et l'heure d'envoi bornée.** (a) **Série locale du visiteur = même règle que le compte** (jour de Paris de l'instant de pratique, `nextStreak` et `effectiveStreak` portés tels quels dans l'app) ; le jour local à 4 h reste la règle du **contenu** (assignation, préchargement, `dernierEnvoiJour`, widget, contrôle du défi). Ainsi la fusion compare deux séries de même horloge et transfère sans conversion. Écrire l'écart nocturne avec son exemple (défi à 23 h puis à 2 h le surlendemain : série remise à 1 alors que l'app a montré deux vannes consécutives ; défi chaque nuit à 2 h : série continue) à côté de l'écart de Montréal. Alternative : garder la série locale à 4 h et écrire la conversion à la fusion (plus de code, même résultat visible pour le compte). (b) **Heure d'envoi entre 4 h et 23 h 45 locale** (les créneaux avant la bascule enverraient la vanne de la veille) ; alternative : créneau avant 4 h = vanne du jour qui commence, mais l'écran Aujourd'hui afficherait alors une autre vanne que la notification jusqu'à 4 h. (c) Fuseau stocké en nom IANA (`Europe/Paris`, jamais un décalage), mis à jour à chaque ouverture avec réseau (`PATCH`), le changement ne réécrivant que J+1 et J+2 non envoyés.

**O3-4. §3.2 : lever les deux contradictions internes.** (a) Ligne « `AssignationJour` [...] Figée : un retrait du pool ne la change pas » contre « Vanne retirée après assignation [...] l'assignation est réécrite une fois ». Écrire : figée face aux **mouvements du pool** (filtre des 7 jours du site, nouveaux lots, changement de thèmes au-delà de J+2) ; réécrite une seule fois, par une mise à jour de la ligne, sur **retrait qualité** seulement (`isActive = false`, verdict différent de `GARDER`, ou défi invalidé par O3-1 c) ; à chaque ouverture avec réseau, la route renvoie les identifiants retirés parmi J à J+2 et l'app purge son cache (sinon une vanne retirée reste lisible hors ligne, contraire à P0 s18). (b) « Le défi n'est servi que pour l'assignation enregistrée pour cette installation ce jour-là » contre le préchargement de J+1 et J+2 « défi compris » : écrire « pour les assignations de J à J+2 de cette installation » (le risque résiduel de 3 défis l'assume déjà).

**O3-5. §3.2, §7, §9.3 : cycle de vie de l'installation et limite chiffrée.** Écrire : (a) secret de 32 octets aléatoires généré par le serveur à la création, renvoyé une seule fois, empreinte SHA-256 en base, comparaison en temps constant, stocké par `expo-secure-store` ; marqueur de premier lancement hors trousseau qui efface le secret à la réinstallation (sinon le trousseau iOS le conserve, et la durée « jusqu'à désinstallation » du §9.3 est fausse ; à transmettre à @legal) ; (b) création limitée par `sharedRateLimit`, clé = IP (IPv6 par préfixe /64), seuils chiffrés [HYPOTHÈSE : reco 10 par heure et 30 par jour, à lire contre les réseaux mobiles partagés en TestFlight], et le risque résiduel du §3.2 recalculé avec ces seuils ; (c) création refusée ou réseau absent au premier lancement : l'écran 1 montre quand même une vanne (reco : une vanne tout public embarquée dans le build et relue, sans défi ni série), nouvel essai à l'ouverture suivante ; jamais d'écran vide ; (d) purge des installations sans appel depuis une durée fixée avec @legal [HYPOTHÈSE : 180 jours], avec leurs `AssignationJour` en cascade, et des `AssignationJour` plus vieilles que l'historique utile à la règle « non encore assignée » ; durée écrite au §9.3 et dans `/confidentialite`.

## 5. Corrections SOUHAITABLES

1. **S3-1** En-tête ligne 5 : retirer « cette session n'a pas d'accès à la base » (contredit la ligne 48) ; §15 : retirer des bloquants « lecture en base des textes des vannes A à D par @fullstack » (faite, §3.1 de cette revue, textes identiques).
2. **S3-2** §3.2 « Sans thème : 93 vannes, première répétition au 94e jour » : écrire « au plus 93, moins les vannes sans défi validé et celles du calendrier du site à 7 jours (4 au 04/11) » ; la mesure exacte est celle du lot C(a).
3. **S3-3** `APP_SANDBOX_PREMIUM` : ne pas le renvoyer dans `bootstrap` (logique serveur seulement, l'app n'en a pas l'usage, et il annonce publiquement que la fenêtre est ouverte) ; dire où il vit (variable du Worker ou constante de `config/`, l'une comme l'autre = un déploiement, à écrire dans la procédure du lot 13).
4. **S3-4** Anti-moisson renforcé : App Attest (DeviceCheck) à la création de l'installation, au lot 6b ou en V1.1, plus solide que l'IP ; aucun coût.
5. **S3-5** `quality-watch` (§3.7 de cette revue) : décider si une vanne jugée sous la barre pour le site sort aussi du pool de l'app. Reco : aucun retrait automatique (aucune IA ne décide seule, 01/10), signalement dans le récapitulatif admin, retrait par la session.
6. **S3-6** Règle « thème épuisé » : écrire sa conséquence pour H7 (« soirées » seul : plus aucune vanne de soirée du jour 27 jusqu'à épuisement du tout public, vers le jour 100 : 27 + les 75 vannes tout public restantes, au plus), pour que la lecture des thèmes en TestFlight ne conclue pas à tort.
7. **S3-7** Tests Jest du lot 5b-0 à ajouter à la liste du §7 : limite de création par IP, retrait qualité après assignation (réécriture unique), heure d'envoi refusée avant 4 h, changement de fuseau.
8. **S3-8** Doublon « À toi de jouer : » de B et D : vérifier s'il est déjà visible sur les fiches du site (le champ en base le contient) ; si oui, c'est une correction du site à soumettre à Thomas, pas un sujet du lot 3 seulement.
9. **S3-9** Session principale : `project-context.md:82` (~602 actives) et le mémo s22 (widget « encore inerte ») toujours périmés.

## 6. Ce qui dépend d'une décision de Thomas (ne bloque pas mon 9/10)

| Sujet | Décision | Effet sur la technique |
|---|---|---|
| Format du défi (`defi30s` ou non) | 7 bis | O3-1 s'applique au format B ; en A, la même chaîne par lot réécrit `howToApply` (projet copy du site) ; en C, pas de champ neuf mais la série du §3.3 est à réécrire |
| Règle de mélange (1 jour sur 3, seuil 60), thèmes retenus | 5 | Paramètres de `config/mobile.ts`, pas de changement de schéma |
| Série et points du visiteur | 4 | O3-3 a) ne vaut que si la série locale existe |
| SANDBOX compté pendant la revue | 9 | Si « jamais compté », (b) et (c) du §7 tombent, les deux comptes de revue restent |
| Heure d'envoi avant 4 h | aucune, technique | Reco O3-3 b) ; à soumettre seulement si le panel ou l'étalon 2 tient à « 1 h du matin » |
| Méthode du panel | 8 bis | Aucun effet technique |

Hors cadrage et non re-questionnable : la génération automatique reste coupée ([CHOIX UTILISATEUR] 30/09 et 01/10) ; O3-1 s'y conforme et ne propose pas de la rouvrir.

## 7. Ce qui reste juste et ne doit pas bouger

Un seul modèle de vanne du jour, distinct du site et du widget intégrable ; `Installation` créée avant toute permission ; `AssignationJour` unique et lue par tous les consommateurs ; thèmes stockés côté serveur, jamais en paramètre ; pools mesurés et règle de mélange chiffrée ; liste « écran verrouillé » séparée ([CHOIX UTILISATEUR] du 24/10) ; série du compte inchangée au jour de Paris ; site en UTC non touché ; liste fermée de champs ; `recalculerPlan` écrivain unique, `PremiumGrant`, `StoreEntitlement`, webhook relu par l'API REST et `TRANSFER` sur les deux comptes ; fenêtre de revue Apple (a) à (d) ; 5b-0 en production derrière interrupteurs avant le lot 8 ; build 0 sans compte ni jeton.

---

**Handoff → @product-manager** (cadrage v4), copie session principale
- Fichier produit : `docs/mobile/revues-cadrage/fullstack-v3.md`
- Décisions prises : aucune ; recommandations seulement.
- Points d'attention : O3-1 change le contenu des lots C(u) et C(d1) (production en session, import sans IA, statut et empreinte du défi) ; O3-2 à O3-5 sont des précisions de spec sans changement d'architecture. Les 4 vannes du §2.1 sont exactes : rien à recopier.
- Actions infra requises : aucune maintenant. Plus tard : colonnes `defi30s`, `defi30sValideAt`, `defi30sEmpreinte` en plus des migrations déjà listées ; purge des installations (tâche de démarrage ou tick).
- Pre-commit check : sans objet (aucun code modifié, rien commité). Requêtes en base : lecture seule, transactions `READ ONLY` vérifiées, scripts dans le dossier temporaire de session, hors dépôt.
