# Notation cycle 9, angle acquisition (@growth, s15, 11/10/2026 au matin, état RÉEL des fichiers)

> Notateur indépendant, mêmes critères et même échelle que le cycle 8 (K1 angle acquisition, K6 trafic et conversion, K8 mesure). Relus (lignes citées) : `notation-relance-cycle8-growth.md` en entier, `corrections-cycle8-growth.md`, `mesure.md` en entier, `strategie-relance-v5.md` (:1-125), `plan-execution-s15.md` (:1-90), `mix-formats-s15.md` en entier, `releves/2026-10-06.md`, `-07`, `-08`, `-09`, `-11` (il n'y a pas de `-10` : pas de post le samedi, `2026-10-11.md`:3), `preparation/lot-semaine0.md` (:1-45), `lot-1a-dry-run-07-10.md` (:1-80), `lot-1b-dry-run-08-10.md` (:1-70), `corrections-cycle8-fullstack.md`, `REPLIT_ACTIONS.md` (:1-440), `apps/web/src/lib/umami.ts`, `__tests__/lib/attribution.test.tsx` (:1-90), `founder-preferences.md` (:38-83). `[non relu]` : `config/in-app-browser.ts`, `config/blog-cta.ts`, `viral-quiz.tsx`, `article-cta.tsx`, `notation-relance-cycle9-reviewer.md` (existe, volontairement non lu : notation indépendante).
> **Production NON reproduite ici** : cette session n'a ni Bash ni curl. L'état en ligne est celui de `releves/2026-10-11.md`:10 (`/`, `/liens`, `/liens/x`, `/liens/li`, `/api/health` en 200) et du message de saisine (version `8e377821`). **[CHOIX UTILISATEUR] non rejoués** : barre Alexa intacte, cadence 5/5/2 par le mix, pas de compte gratuit, aucun réseau en pause, clé Buffer `insights:read` « plus tard », pas de 3/3/1 sans accord de Thomas (`founder-preferences.md`:57, :59, :61-62, :65).
> **État D8 à l'instant de ma lecture, sans l'anticiper** : `mesure.md`:104-106 contient encore `[à renseigner]` pour les 3 réseaux, `mesure.md`:108 dit toujours « État au 07/10 au soir : aucune preuve D8 consignée », et `docs/qa/tests-c2-navigateurs-integres-11-10.md` n'existe pas (Glob vide). `releves/2026-10-11.md`:22-24 : délégué à @qa ce matin, butoir 11/10 12:00 Paris. D8 est donc **non prouvée** à cette lecture.

## Notes

| Critère | Cycle 8 | Cycle 9 | Raison courte |
|---|---|---|---|
| K1 Angle acquisition | 9,5 | **9,5** | 4 défauts sur 5 du cycle 8 soldés (stock aligné, étalons signés, phrases de v5, LTV annuelle) ; le 5e, le premier levier (bios), n'est pas posé et devient bloquant demain 19:30 (relais Instagram « lien en bio ») ; stock de vannes écrit 25 alors que le script dit 22 |
| K6 Trafic et conversion | 9 | **9** | règle Google écrite (K6-d) ; chaîne en ligne et 10 posts sur 10 publiés ; bios Instagram et LinkedIn toujours non posées, requête SQL des articles non faite alors que l'article du 12/10 passe en ligne à 07:00 |
| K8 Mesure | 8,5 | **9** | `mesure.md` aligné sur le code du 06/10 et ruptures datées (les 2 gros défauts du cycle 8) ; restent D8 non consignée, baseline 2 due aujourd'hui, semaine 0 non reportée, citations `REPLIT_ACTIONS.md:ligne` devenues fausses, 5 événements attribués par le code absents de `mesure.md` |

**Moyenne cycle 9 : 9,2** (cycle 8 : 9,0).

## 1. Liste « Pour 10/10 » du cycle 8, point par point

| Réf. | Verdict | Preuve (fichier:ligne, état du 11/10 matin) |
|---|---|---|
| K6-a bios | **Non fait** (X posé, non daté ; Instagram et LinkedIn non posées) | `REPLIT_ACTIONS.md` section « s15 (06/10/2026) : profils sociaux » (:327-331) : X « déjà posé par Thomas » (:329), LinkedIn jeton expiré (:330), Instagram « à faire dans l'application » (:331). Registre inchangé : `mesure.md`:116-118 (`[à renseigner]`, `[À VÉRIFIER auprès de Thomas, une fois]`). Aucune visite `/liens/x` consignée. Message de saisine : bios non posées au 11/10 |
| K6-c requête SQL `BlogArticle` | **Non fait** | aucun fichier de résultat (Glob `docs/**/*compte-gratuit*` : seulement la spec et le journal des textes). `REPLIT_ACTIONS.md`:392 garde « requête SQL sur `BlogArticle.content` » en `[À VÉRIFIER]`. L'article `se-presenter-avec-humour` est en base `isPublished=false`, programmé le 12/10 05:00 UTC (`REPLIT_ACTIONS.md`:307) |
| K6-d règle Google par application | **Fait** (un `[À VÉRIFIER]` résiduel) | `mesure.md`:52 (≥ 5 `inscription-envoi methode=google` et 0 compte Google en base, ligne passée à `true`). Reste `[À VÉRIFIER @data-analyst : propriété methode présente sur inscription-envoi]`, même ligne |
| K8-a preuve D8 | **Non fait à la lecture** (en cours @qa) | `mesure.md`:104-106, :108 ; `docs/qa/tests-c2-navigateurs-integres-11-10.md` absent ; `releves/2026-10-11.md`:22-24 |
| K8-c `abonnement-*` avec `origine` | **Fait** | `mesure.md`:22 (livré 06/10 07:45, Worker `fd1a595d`), :50 (entonnoir), :93, :96 (bouton `abonnement`, étape `etape-1`). Code : `umami.ts`:30-32. Test d'attribution relu (`attribution.test.tsx`:1-90 : listes blanches ; les `abonnement-*` y sont couverts via `ATTRIBUTED_EVENTS`, non relus au-delà de :90) |
| K8-d ruptures datées | **Fait** | `mesure.md`:110 (compte gratuit, 06/10 07:45, `fd1a595d`), :125-128 (4 lignes : C2, compte gratuit, `origine` sur `abonnement-*`, panne Stripe 30/09 au 07/10 ~15:15 `712ee919`, s16 14:31 `d7fd90b2`), :95 (« 7 jours de checkout cassé »). Preuve de fond relue : `REPLIT_ACTIONS.md`:273 (aucun appel Stripe n'aboutissait, achat réel et remboursement, « D1 validé ») |
| K8-e relevés reportés dans la semaine 0 | **Partiel** | structure et source en place : `mesure.md`:140-142, :148. Mais les 3 lignes disent « à ce jour (07/10 au soir) » avec X `4 / 2`, Instagram `4 / 2`, LinkedIn `2 / 1`, alors que `releves/2026-10-09.md`:11 écrit « 10 posts sur 10 publiés (X 4, Instagram 4, LinkedIn 2) ». Reporté pour le 12/10 par `corrections-cycle8-growth.md`:30, mais les données existent depuis le 09/10 |
| K8-f baseline 2 du 11/10 | **Non fait, calendaire** (due aujourd'hui) | `mesure.md`:143-146 vides (`à relever`) |
| K1-a' stock de vannes aligné | **Fait, avec un résidu** | `mix-formats-s15.md`:9, :12, :14, :15, :17 ; `plan-execution-s15.md`:37, :45, :50 (plus de « environ 5 hors lot », hors lot = 0, plancher `[À RECOMPTER]`). Résidu : voir défaut K1-1 |
| K1-b 3 phrases périmées de v5 + :64 | **Fait** | `strategie-relance-v5.md`:34 (C2 sans test dans l'application du réseau), :59 (lien provisoire « abandonné »), :64 (`abonnement-*` listés), :67 point 6 (test de session + preuve D8) |
| K1-b' étalons et R9 signés le 06/10 | **Fait** | `mix-formats-s15.md`:29, :32-38, :64 (« Thomas : rien en attente ») ; `plan-execution-s15.md`:12, :80 |
| K1-c = K6-a | **Non fait** | voir K6-a |
| K1-d formule annuelle dans l'ARPU | **Fait** | `mesure.md`:94 (24,99 €/an = 2,08 €/mois, entre 2,08 € et 2,99 €, `[HYPOTHÈSE : mix inconnu]`, recalcul à 30 jours) |

**Bilan** : 13 lignes (K1-c comptée à part) ; **Fait 7** (K6-d, K8-c, K8-d, K1-a', K1-b, K1-b', K1-d), **Partiel 1** (K8-e), **Non fait 5** (K6-a, K6-c, K8-a, K8-f, K1-c). Sur les 12 points du cycle 8, 7 sont soldés ; les 5 restants sont l'action de Thomas (bios, baseline), la preuve D8 en cours, la requête SQL et le report de la semaine 0.

## 2. Faits nouveaux depuis le cycle 8

- **Livraison tenue** : semaine 0 = 10 posts sur 10 `sent`, 0 FAILED, à l'heure (`releves/2026-10-06.md`:11, `-08`:21, `-09`:11, `-11`:8). Lot 1a (12 posts) inséré le 09/10 (`REPLIT_ACTIONS.md`:37-42), lot 1b à 46 posts, 0 erreur, GO @reviewer révision 8, insertion programmée le 13/10 06:30 UTC (`releves/2026-10-11.md`:9). Les 9 alertes du jour sont de classe B « file basse » (X et Instagram jusqu'au 16/10, LinkedIn jusqu'au 15/10) : marge de 3 jours, aucune action de Thomas.
- **Le trafic social suivi de la semaine 0 se limite à 1 post** : d'après `lot-semaine0.md`:32, :35, :37, :40 (dry-run d'origine, le JSON fait foi `[à confirmer en base]`), seul le post X du 07/10 porte un lien (`/quiz-humour`, `utm_content=quiz`, `releves/2026-10-07.md`:7) ; X 06, 08 et 09/10 sans lien, Instagram 4 sur 4 sans lien cliquable, LinkedIn 2 sur 2 sans lien. Le reste du trafic dépend de la bio X (posée) et des bios Instagram et LinkedIn (non posées).
- **Dépendance datée du premier levier** : le lot 1a contient 2 posts qui parlent de la bio. IG2 du lun. 12/10 19:30, « Les 4 autres exemples : lien en bio. », et IG3 du mer. 14/10, carte 4 « Le quiz est dans le lien de la bio. » (`lot-1a-dry-run-07-10.md`:59, :77). Le dry-run les prévient « ne partent tels quels que si les liens de bio sont posés la veille » et la garde n'est qu'un **avertissement manuel** (`corrections-cycle8-fullstack.md`:16 : « aucune lecture de `mesure.md` »). Le lot 1b a la même dépendance (29/10 et 02/11, `lot-1b-dry-run-08-10.md`:57). La « veille » du 12/10 est aujourd'hui.
- **Code en avance sur la mesure** : `umami.ts`:33-39 attribue aussi `mur-vu`, `abonnement-vu`, `inscription-echec` (s16, déployé 07/10 14:31) et `parcours-ouvert`, `parcours-termine` (s17, déployé 07/10 21:58, `REPLIT_ACTIONS.md`:208-210). Le quiz envoie désormais le profil Storyteller vers `/parcours/storytelling?src=quiz` depuis le 08/10 09:33 (version `8e377821`, `REPLIT_ACTIONS.md`:62-68). Aucun de ces cinq événements n'est dans `mesure.md`:22 ni :50, et le changement de destination du quiz n'est pas une rupture de série au §6.
- **Citations cassées** : `REPLIT_ACTIONS.md` est alimenté en tête de fichier par d'autres sessions ; les lignes citées par `mesure.md` ne pointent plus sur ce qu'elles prouvent. Exemples relus : `mesure.md`:127 cite `REPLIT_ACTIONS.md`:66 (panne Stripe), or :66 est aujourd'hui dans le déploiement s18 ; `mesure.md`:106 cite :135-137 (post LinkedIn), or c'est la section conseils s18 ; `mesure.md`:22, :88, :96, :110, :116-118 citent :122-124, :171-176, :186, tous déplacés. Les sections existent toujours : panne Stripe et D1 :273, bios :327-331, déploiement du 06/10 07:45 :386-391, suppression du compte gratuit :394-403 (Umami :401). Ma propre notation du cycle 8 citait les mêmes numéros : périmée de la même façon.
- **Source contradictoire** : `REPLIT_ACTIONS.md`:3 titre toujours « NE PAS INSÉRER LE 1b : en attente du contrôle @reviewer (E1 à E5) » et :35 date l'insertion du 14/10, alors que `releves/2026-10-11.md`:9 donne le GO @reviewer et l'insertion au 13/10 06:30 UTC. `lot-1b-dry-run-08-10.md`:51 parle encore d'une commande « à lancer par Thomas ».

## 3. Défauts restants par critère

### K1 Angle acquisition : 9,5

Acquis : angle recalculé sur le parcours abonné, économie du social chiffrée (0 € cash, 41 min par semaine, `mesure.md`:92), LTV avec les deux formules (`mesure.md`:94), borne honnête de 0,26 abonné à J+56 (`mesure.md`:95), étalons signés non redemandés, mix 5/5/2 sans toucher à la barre.
1. **Stock écrit 25 ou 23, script 22.** `mix-formats-s15.md`:9 et :12 (« 25 au 12/10 », « 23 sans P0 »), `strategie-relance-v5.md`:38 (« 23 libres au 12/10, 25 avec les 2 de P0 »), `plan-execution-s15.md`:37 et :49 (« écart de 1 non expliqué ») face à `lot-1a-dry-run-07-10.md`:14 (« stock éligible 22 ») et `corrections-cycle8-fullstack.md`:23 (écart expliqué : 11 vannes en base à moins de 90 jours, la 11e `cs14jk72ac436450535a3c29` publiée sur X le 02/10 ; 42 - 3 - 4 - 11 - 2 = 22). Le plancher du 03/11 reste `[À RECOMPTER]` : le dry-run 1b (19/10 au 15/11, 0 erreur) ne prouve la couverture que jusqu'au 15/11 ; le chiffre « 122 manques » du 03/11 au 03/01 (`REPLIT_ACTIONS.md`:425, :435) date d'avant le mix codé et `mix-formats-s15.md`:65 demande toujours de l'expliquer.
2. **Premier levier non activé.** Poser un lien de bio prend 3 minutes et débloque tout le trafic suivi d'Instagram et de LinkedIn ; il reste non fait au J-1 du J0 (K6-a).
3. **Dates ambiguës `[À VÉRIFIER]`** : « choix du 06/05 » (`strategie-relance-v5.md`:18), « pattern d'invitation du 06/05 » (:37), « choix du 05/05 » (`plan-execution-s15.md`:76), « pattern du 06/05, fichier non trouvé » (:90) alors que les choix sociaux sont du 05/10 (`founder-preferences.md`:55-56) et que `docs/social/banque-reponses.md` existe (Glob).

### K6 Trafic et conversion : 9

Acquis : `/liens` 3 routes en 200 (`releves/2026-10-11.md`:10), `origine` jusqu'au paiement (`umami.ts`:30-32), fin du compte gratuit et paiement réel prouvé (`REPLIT_ACTIONS.md`:273), règle Google écrite (`mesure.md`:52), 10 posts sur 10 livrés. **Défauts restants**
1. **K6-a** : bios Instagram et LinkedIn non posées, X non daté ; aucune visite `/liens*` consignée.
2. **K6-c** : requête SQL non faite. Plus urgent qu'au cycle 8 : `se-presenter-avec-humour` est relayé dès le 12/10 (IG2 19:30, LinkedIn L3 le 13/10) et passe en ligne le 12/10 05:00 UTC (`REPLIT_ACTIONS.md`:307).
3. **Garde de bio sans repli défini.** Seule la phrase « Le quiz est dans le lien de la bio » du carrousel a un retrait signé (`founder-preferences.md`:67). Pour la légende « lien en bio » du relais IG2, rien n'est écrit ; une retouche improvisée à 19:15 serait un texte sous la barre sans relecture à l'aveugle (règle d'or, `CLAUDE.md`).
4. **Deux `[À VÉRIFIER]` ouverts** : propriété `methode` sur `inscription-envoi` (`mesure.md`:52) et nom exact du clic CTA après le quiz (`mesure.md`:96).

### K8 Mesure : 9

Acquis : `mesure.md` aligné sur le code du 06/10, 4 ruptures datées avec versions de Worker, panne Stripe et base payante corrigée, seuils et sommes de contrôle recalculés (190/50, 480/135, 50/10, 125/25, 770/220, 1 060/305 ; Poisson 10 %, 23 %, 34 %, 44 % relus, exacts). **Défauts restants**
1. **D8 non consignée** (état à ma lecture, ci-dessus). Sans elle, J0 au lundi 19/10 (`mesure.md`:108).
2. **Baseline 2 due aujourd'hui** (`mesure.md`:143-146 vides). Risque de pollution à écrire d'avance : le test de @qa crée un compte réel puis le supprime (`releves/2026-10-11.md`:24), or l'inscription ouvre Stripe Checkout sans clic (`REPLIT_ACTIONS.md`:399) ; l'achat test de Thomas du 07/10 (2,99 € remboursé, `REPLIT_ACTIONS.md`:273) compte parmi les paiements ; les 3 comptes de Thomas sont à exclure (`founder-preferences.md`:74).
3. **Semaine 0 non reportée** malgré des données complètes depuis le 09/10 (`mesure.md`:140-142).
4. **Citations `REPLIT_ACTIONS.md:ligne` fausses** (section 2) : une preuve par numéro de ligne dans un fichier alimenté en tête ne tient pas ; citer le titre de section.
5. **Cinq événements et deux changements de parcours absents** : `mur-vu`, `abonnement-vu`, `inscription-echec`, `parcours-ouvert`, `parcours-termine` (`umami.ts`:33-39) ; ruptures non datées au §6 : s17 07/10 21:58 (`cca01a65`, `REPLIT_ACTIONS.md`:208-210) et 08/10 09:33 (`8e377821`, quiz Storyteller vers `/parcours/storytelling?src=quiz`, :62-68).
6. **Sources contradictoires** sur l'état du lot 1b et de D8 (`REPLIT_ACTIONS.md`:3, :35 ; `mesure.md`:108 « 07/10 au soir »).

## 4. Pour 10/10 (nouvelle liste)

Aucun seuil, aucune cadence, aucune barre rouverts ; rien à redemander à Thomas sur un point signé.

### A. Ce qui dépend d'une action de Thomas (2)

| Réf. | Action | Quand | Preuve attendue | Débloque |
|---|---|---|---|---|
| T1 (= K6-a, K1-c) | Instagram : lien du profil `https://deviens-marrant.fr/liens` (dans l'application, marche à suivre citée `REPLIT_ACTIONS.md`:331). LinkedIn : site web de la page `https://deviens-marrant.fr/liens/li`, ou nouveau `LINKEDIN_ACCESS_TOKEN` pour que la session le pose. X : dire la date de pose, une fois (jamais présumée) | **Aujourd'hui 11/10** (garde « posés la veille » du relais IG2 du 12/10 19:30, `lot-1a-dry-run-07-10.md`:77) | Date au registre `mesure.md`:116-118 ; 1 visite par route vue dans Umami (`/liens`, `/liens/x`, `/liens/li`, `utm_campaign=bio`) | K6 10, K1 10 |
| T2 (= K8-f, part Thomas) | 3 captures datées du total d'abonnés X, Instagram, LinkedIn (3 min chacune, `mesure.md`:32, :34) ; impressions Google « deviens marrant » si l'accès est le sien | **Aujourd'hui 11/10** (le calendrier l'interdit avant) | Valeurs écrites en `mesure.md`:143-146. Sans relevé le 11/10, la valeur du 12/10 devient la baseline 2, datée comme telle | K8 10 |

### B. Ce qui revient aux agents (11)

| Réf. | Agent | Action précise | Preuve vérifiable | Note |
|---|---|---|---|---|
| G1 (K8-a) | @qa | 3 événements Umami de test (`origine` x, instagram, linkedin) lus par l'API avec la propriété `origine` ; heure Paris et UTC écrites en `mesure.md`:104-106 ; `docs/qa/tests-c2-navigateurs-integres-11-10.md` créé ; `mesure.md`:108 réécrit à la date réelle ; lister les objets créés par le test (compte supprimé, client ou session Stripe éventuels `[À VÉRIFIER @qa : Checkout ouvert ?]`) pour les exclure du relevé du lundi et de la baseline 2 | Les 3 cases ne contiennent plus `[à renseigner]` ; fichier QA présent ; échéance 11/10 12:00 Paris (`releves/2026-10-11.md`:22), sinon J0 au 19/10 | K8 |
| G2 (K8-f, part session) | @data-analyst | Baseline 2 : visites `utm_source` depuis le 06/10 par source, comptes créés de la semaine (`createdAt`, hors comptes de test supprimés), abonnements actifs et créés, MRR Stripe, avec exclusion écrite de l'achat test du 07/10 et des 3 comptes de Thomas | `mesure.md`:143-146 remplies, ligne « exclus » citée | K8 |
| G3 (K6-c) | @data-analyst | SQL en lecture seule sur `BlogArticle.content` et `title` : « compte gratuit », « gratuitement », « Crée ton compte », « inscription gratuite » (ajout) ; **avant 12/10 06:30 Paris** pour `se-presenter-avec-humour`, puis les 8 slugs relayés du 12/10 au 09/11 (`strategie-relance-v5.md`:80-84) | 0 occurrence par slug, requête et résultat dans `REPLIT_ACTIONS.md`. Sinon correction par étalon de Thomas, diff mesuré (P0 s8, P0 s11), repasse à l'aveugle (règle d'or) | K6 |
| G4 (K6, K1) | @social avec la session | Écrire AVANT 12/10 18:00 (GO/NO-GO) la règle de substitution si la bio Instagram n'est pas posée : IG2 remplacé par le repli déjà validé (chargeur, 9/9, `lot-1a-dry-run-07-10.md`:28, en base REJECTED, `releves/2026-10-11.md`:8) ; IG3 du 14/10 sans la phrase de la carte 4 (retrait signé, `founder-preferences.md`:67). Bascule en base jusqu'à 15 min avant la remise (`mix-formats-s15.md`:47) | Règle dans `mesure.md` §3 et `plan-execution-s15.md` ; au relevé H+45 du 12/10 et du 14/10, légende publiée conforme à l'état de la bio | K6, K1 |
| G5 (K8-e) | @growth | Reporter la semaine 0 close : X `4 / 4`, Instagram `4 / 4`, LinkedIn `2 / 2` ; avec / sans lien X `1 / 3` `[à confirmer sur le JSON ou la base pour les 08 et 09/10]`, Instagram `0 / 4`, LinkedIn `0 / 2` ; retirer « à ce jour (07/10 au soir) » | `mesure.md`:140-142 relues contre `releves/2026-10-06.md` à `-09.md` | K8 |
| G6 (K8) | @growth | Remplacer chaque `REPLIT_ACTIONS.md`:<ligne> par le titre de section dans `mesure.md` (:22, :88, :96, :106, :110, :116-118, :125-128) et dans tout fichier de `docs/social/` qui en cite | 0 numéro de ligne vers `REPLIT_ACTIONS.md` ; chaque section citée relue | K8 |
| G7 (K8) | @data-analyst + @growth | Ajouter `mur-vu`, `abonnement-vu`, `inscription-echec`, `parcours-ouvert`, `parcours-termine` à `mesure.md`:22 et :50 (lus, jamais jugés) ; ajouter les ruptures du 07/10 21:58 (`cca01a65`) et du 08/10 09:33 (`8e377821`, destination du quiz) au §6 | Ligne par événement ; 2 lignes de rupture avec version de Worker | K8 |
| G8 (K1) | @growth + @fullstack | Aligner le stock sur le script (22 au 12/10) dans `mix-formats-s15.md`:9, :12, `strategie-relance-v5.md`:38, `plan-execution-s15.md`:37, :49 ; dry-run `--pool strict` du 16/11 au 03/01 pour remplacer `[À RECOMPTER]` du plancher (avant le 26/10, livraison V1) | Un seul chiffre dans les 5 lignes ; nombre d'erreurs du dry-run cité avec la commande | K1 |
| G9 (K8) | @fullstack ou la session | `REPLIT_ACTIONS.md`:3 et :35, `lot-1b-dry-run-08-10.md`:51 : état réel du 1b (GO @reviewer révision 8, insertion programmée 13/10 06:30 UTC, aucune action de Thomas), puis « INSÉRÉ le 13/10 » avec le contrôle après insertion | Titre et date identiques à `releves/2026-10-11.md`:9 | K8 |
| G10 (K6, K8) | @data-analyst | Lever `[À VÉRIFIER]` : propriété `methode` sur `inscription-envoi` (`mesure.md`:52) et nom exact du clic CTA après le quiz (`mesure.md`:96), par lecture du code (`git show <branche déployée>:fichier`) | Phrases réécrites avec le nom exact | K6, K8 |
| G11 (K1) | @growth | Lever les dates « 06/05 » et « 05/05 » (`strategie-relance-v5.md`:18, :37 ; `plan-execution-s15.md`:76, :90) et noter que `banque-reponses.md` existe | Date vérifiée ou `[À VÉRIFIER]` conservé avec motif | K1 |

### C. Conditions de la note 10

- **K1 = 10** : T1, G8, G11 (G4 pour l'effet des bios sur les relais).
- **K6 = 10** : T1, G3, G4, G10, preuve de la première visite `/liens*` par route.
- **K8 = 10** : G1, T2 + G2, G5, G6, G7, G9, G10. Le relevé du lundi 12/10 est la première utilisation réelle de ce cadre : je renote après lui.
- Je ne renote 10 que sur preuves : `git show <branche déployée>:fichier` pour le code, événements Umami lus par `origine`, résultat SQL joint, captures datées. Seuls T2 et G2 sont interdits avant le 11/10 par le calendrier ; tout le reste est faisable aujourd'hui sans Thomas, sauf T1.

---
**Handoff → @orchestrator** (puis Thomas T1 et T2 ; @qa G1 ; @data-analyst G2, G3, G7, G10 ; @social G4 ; @growth G5, G6, G8, G11 ; @fullstack G9)
- Fichier produit : `/home/user/Marrant/docs/social/notation-relance-cycle9-growth.md` (aucun autre fichier modifié, pas de commit)
- Décisions : K1 9,5, K6 9, K8 9, moyenne 9,2 ; aucun seuil, cadence ou barre rouvert ; aucun réseau en pause
- Points d'attention : bios Instagram et LinkedIn avant le relais IG2 du 12/10 19:30 ; SQL de l'article du 12/10 avant 07:00 ; D8 non prouvée à la lecture ; baseline 2 le 11/10 en excluant les objets de test ; citations par ligne de `REPLIT_ACTIONS.md` fausses ; prod non reproduite par cette session

Notes : K1 9,5 (=), K6 9 (=), K8 9 (8,5 vers 9), moyenne 9,2 (cycle 8 : 9,0).
Points restants : 13 (K1 : T1, G8, G11 ; K6 : T1, G3, G4, G10 ; K8 : G1, T2 + G2, G5, G6, G7, G9, G10), dont 2 à Thomas (T1 bios Instagram et LinkedIn, T2 abonnés de la baseline 2), 11 aux agents.
Cycle 8 : 7 points soldés sur 12, 1 partiel (K8-e), 4 non faits (K6-a, K6-c, K8-a en cours, K8-f due aujourd'hui) ; D8 non consignée à la lecture.
