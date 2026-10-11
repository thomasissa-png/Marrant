# Notation du plan d'exécution s15, cycle 1 : fiabilité et exploitation (@qa, 05/10/2026)

> Objet : `docs/social/plan-execution-s15.md`. Vérifié dans le code (branche `claude/marrant-s10-session-recovery-CtZyw`, HEAD `be5ddeb`). `[STATIQUE]` = lecture de code ou Grep ; `[LIVE local]` = commande exécutée ici. Rien n'a été vérifié contre le Worker en ligne ni contre Buffer.

## Note globale : 4,6/10 (F1 5, F2 5, F3 3, F4 4, F5 6)

Le plan est rigoureux sur le contenu, mais il s'appuie sur un modèle faux de la remise à Buffer, et sur trois mécanismes qui n'existent pas encore (`--pool`, alerte « file basse », saut des posts antérieurs à J0). Le filet principal (les routines) n'a jamais été testé.

## Constats vérifiés
| # | Affirmation du plan | Réalité | Preuve |
|---|---|---|---|
| C1 | Correctif X 270 non déployé | Exact, et critique : **30 posts X sur 58** dépassent 270 en longueur brute, le premier le 12/10 à 12:30. Avec le Worker `108da3e7`, ils partent en FAILED, sans pause du réseau, un par jour | `git log` : `c3564c2` (Worker 108da3e7) précède `9ca796e` ; `node` sur `lot-relance-s15.json` `[LIVE local]` |
| C2 | Buffer garde 8 posts par canal (11 jours), gel de 14 jours, « la fiche du 04/11 part chez Buffer vers le 24/10 » (§1.4, §2.3, §4.2) | **Faux.** Le cron ne prend que les posts échus (`scheduledAt <= now`), 1 par réseau et par passage (toutes les 15 min), et Buffer reçoit `dueAt` = maintenant + 2 min. La file Buffer contient 0 ou 1 post : plafond de 10 hors sujet, gel inutile (une correction en base vaut jusqu'à H-15 min) | `publish-social/route.ts:152-167, 216-223` ; `buffer-client.ts:293-295` ; `wrangler.jsonc:72` `[STATIQUE]` |
| C3 | Interrupteur par réseau | Exact : GET/POST, refus de reprise si le canal est en panne. Faille : si Buffer est injoignable, `pannes()` renvoie `null` et la reprise passe | `api/admin/social/platforms/route.ts:34-41, 73-76` `[STATIQUE]` |
| C4 | « Posts expirés de plus de 24 h REJECTED, pas rattrapés » ; « posts datés avant J0 sautés » (§4.1, §4.2) | **Faux.** `reprendre()` replanifie TOUS les APPROVED en retard, 1 par jour, sur les jours sans post : avec X et Instagram à 5 sur 7, ils tombent le week-end **et les jours de silence (11/11, 27/11)**. Les relais d'articles et les posts datés (Halloween, Noël) partent hors contexte, et à l'heure UTC d'origine (décalage d'1 h après le 25/10) | `platform-switch.ts:116-139, 142-158` `[STATIQUE]` |
| C5 | Alerte « file basse » | N'existe pas (Grep sans résultat dans `src/lib`, `src/app/api`). Le plan B du §2.3 (« Thomas reçoit l'e-mail ») repose donc sur rien | Grep `[STATIQUE]` |
| C6 | `prepare-social-month.ts --insert --driver=neon-http` | Existe : tout ou rien (`createMany`), refus si `thomas-s15` est déjà présent sur la période. Mais un seul lot est possible (`LOT_ID` et dates 12/10 au 03/01 en dur), **pas de `--pool`, pas de bornes de dates** : le « lot 1 jusqu'au 15/11 refait avec `--pool` » est impossible sans développement, et l'insertion prend les 140 posts | `prepare-social-month.ts:121-140` ; `social-lot-v5-config.ts:10-13` ; `social-lot-v5-insert.ts:42-53` `[STATIQUE]` |
| C7 | « Si un 1er post échoue, le réseau est mis en pause automatiquement » | Seulement si l'autorisation est perdue. Un échec X 270 ou une erreur de contenu donne FAILED et une alerte, le réseau continue | `buffer-status-check.ts:199-203` ; `publish-social/route.ts:253-268` `[STATIQUE]` |
| C8 | Alertes 1 par jour et par réseau | Vrai pour la relecture de statut. Faux pour `publish-social` : **1 e-mail par jour toutes alertes confondues**, donc un 2e incident le même jour est masqué | `publish-social/route.ts:78` `[STATIQUE]` |
| C9 | Vérification du 1er post à 12:45 (X) | Trop tôt : remise entre 12:30 et 12:47, relecture du statut **une fois par heure** (verrou horaire). Le statut `sent` n'est en base qu'au passage de 13:00 à 13:15 | `jobs.ts:317-329` `[STATIQUE]` |
| C10 | Heure d'hiver du 25/10 testée | Vrai pour la génération du lot (Jest). Non prouvé de bout en bout (cron, Buffer, replanification) | `social-lot-v5.test.ts:100-150` ; Jest 9 suites, 217 tests PASS `[LIVE local]` |
| C11 | Routines planifiées | Aucune trace dans le projet : sources = 2 articles de blog, offre, accès au dépôt et secrets non vérifiés, Neon en TCP bloqué | plan §2.3 ; Grep `project-context.md`, `founder-preferences.md` `[STATIQUE]` |

## F1 Mise en production : 5/10
Bon : ordre de reprise réseau par réseau, GO/NO-GO daté, contrôle `tsc`/lint/build avant le déploiement. Points bloquants : C1 (sans déploiement, la moitié des posts X échouent), C6 (le lot 1 « refait avec `--pool` pour le 09/10 » exige un développement non planifié dans les 4 jours), C9 (heure de vérification), et aucune preuve prévue que le Worker en ligne contient `longueurX`.
**Correction** : le 08/10, déployer `9ca796e` puis prouver le déploiement (`git show <branche déployée>:apps/web/src/app/api/cron/publish-social/route.ts | grep longueurX` et `wrangler deployments list`, noter la version précédente `108da3e7` pour le retour arrière). Vérifier le 1er post à H+45 (13:15 X, 20:15 Instagram, 09:00 LinkedIn).

## F2 Détection et alertes : 5/10
Existe : relecture horaire du statut Buffer, FAILED/introuvable/non confirmé à 6 h avec alerte, pause automatique si autorisation perdue, rapport « prévu contre publié » du lundi. Manque : file basse (C5), lot non prêt (dépend des routines), pause sur échec de contenu (C7), alertes masquées (C8).
**Correction** : job Worker quotidien « couverture » (dernier APPROVED par réseau < 10 jours, stock éligible < 14, lot non inséré à sa date de prêt) envoyé à `ADMIN_EMAIL` avec le prompt de relance ; clé d'alerte par réseau et par type ; pause automatique après 2 FAILED consécutifs sur un réseau.

## F3 Déclenchement fiable des lots : 3/10
Les 3 filets ne sont pas indépendants : la garde du lundi et les issues GitHub sont des routines, et le filet de secours (file basse) n'existe pas. Le test du 07/10 (« lire la base et écrire un fichier ») ne prouve ni l'accès à Buffer, ni l'ouverture d'une issue, ni le push d'un commit. Mettre `ADMIN_PASSWORD`, le token Buffer et l'URL Neon dans un environnement cloud tiers élargit la surface de fuite.
**Correction** : le Worker (cron `*/15` déjà actif) devient le déclencheur principal (e-mail de lancement de lot aux dates du §2.1 et à file < 21 jours) ; les routines deviennent l'exécutant optionnel, avec un test du 07/10 qui valide 4 critères (lecture Neon HTTP, lecture des `channels` Buffer, issue créée, commit poussé) et des secrets en lecture seule quand c'est possible.

## F4 Retour arrière et incidents : 4/10
Exécutable : pause (POST admin), `wrangler rollback`, retrait d'un post publié par Thomas. Non exécutable ou faux : saut des posts antérieurs à J0 et rejet après 24 h (C4) ; « suppression chez Buffer » et gel de 14 jours (C2, sans objet) ; aucune commande pour annuler une insertion de lot ; garde des articles (§4.3) laissée à une session à 05:30 alors que le cron peut la faire au moment de la remise.
**Correction** : `reprendre()` avec option « sauter » (REJECTED des posts échus depuis plus de 24 h, des relais et des posts datés), jamais sur un jour de silence, à l'heure de Paris ; commande `--rollback --lot <id>` (APPROVED futurs du lot passés en REJECTED, comptage avant et après) ; garde `articleSlug` dans `publish-social` (article non publié = repli ou REJECTED).

## F5 Tests et vérifications : 6/10
Prouvé `[LIVE local]` : 217 tests Jest (lot v5, `longueurX`, interrupteur, statut Buffer), comptage X du lot. Supposé : version du Worker en ligne, publication réelle X et LinkedIn (seul Instagram a été testé, en brouillon), insertion `neon-http` jamais exécutée en vrai, lien en 1er commentaire LinkedIn, replanification (aucun test sur jours de silence ni sur l'heure d'hiver), routines.
**Correction** : brouillons Buffer réels (`saveToDraft`, puis suppression) avec le post X le plus long à lien et un post LinkedIn à 1er commentaire ; insertion `neon-http` d'abord sur une branche Neon ; tests de non-régression sur `replanifierRetards` (silence, heure d'hiver, posts datés).

## Ce qu'il faut pour 10/10 (ordonné)
1. **08/10, bloquant pour X** : déployer `9ca796e`, prouver `longueurX` en ligne, consigner la version `108da3e7` pour le retour arrière (C1).
2. **Réécrire §1.4, §2.3, §4.2 et §7 R4/R10 du plan** selon la remise au fil de l'eau (C2) : supprimer gel, plafond et « suppression chez Buffer ».
3. **@fullstack avant le 09/10** : `prepare-social-month` avec `--debut/--fin`, `--pool`, identifiant de lot libre, contrôle après insertion par réseau et par semaine, et `--rollback` (C6).
4. **@fullstack avant le GO du 11/10** : corriger `reprendre()` (saut, silences, heure de Paris) et ajouter une commande « sauter avant J0 » (C4) ; reprise refusée si Buffer est injoignable (C3).
5. **Avant le 26/10** : job Worker de couverture (file, stock, lot non prêt), alertes séparées par réseau et par type, pause après 2 FAILED (C5, C7, C8).
6. **Garde `articleSlug` dans le cron** à la remise, au lieu d'une session à 05:30 (§4.3).
7. **07/10** : test des routines sur 4 critères ; en cas d'échec, le Worker reste le seul déclencheur et le §2.3 le dit.
8. **Avant J0** : brouillons Buffer réels X et LinkedIn, insertion `neon-http` testée sur une branche Neon, vérifications à H+45 (C9).
9. **26/10** : contrôle de l'heure d'hiver de bout en bout (`sentAt` réel chez Buffer), y compris un post replanifié.
