# Notation du plan d'exécution s15 v2, cycle 2 : fiabilité et exploitation (@qa, 05/10/2026)

> Objet : `docs/social/plan-execution-s15.md` v2 (`f66142b`). Code vérifié sur la branche `claude/marrant-s10-session-recovery-CtZyw` : HEAD `f66142b` + **travail de @fullstack en cours, non commité** (9 fichiers modifiés, 4 nouveaux : `couverture.ts`, `garde-article.ts`, `heure-paris.ts`, `config/social-calendrier.ts`). `[STATIQUE]` = lecture ou Grep ; `[LIVE local]` = commande exécutée ici. Rien n'a été vérifié contre le Worker en ligne ni contre Buffer.

## Note globale : 6,0/10 (F1 7, F2 6, F3 6, F4 6, F5 5) ; cycle 1 : 4,6
Les 9 points du cycle 1 sont repris avec une date. Le modèle Buffer est juste (C2 réglé). Il reste un défaut : le plan décrit en §6, §7 et §8 des comportements que le code en cours ne fait pas, ou fait autrement.

## Suivi des 9 points du cycle 1
| # | Daté | Responsable | État du code |
|---|---|---|---|
| 1 Déploiement `9ca796e` | 08/10 | ambigu : session ou Thomas via Replit (§10 `[À VÉRIFIER]`) | `git show c3564c2:…/publish-social/route.ts` : 0 `longueurX`, donc le Worker `108da3e7` n'a pas le correctif `[STATIQUE]` |
| 2 Modèle Buffer | §8 | sans objet | conforme |
| 3 `--debut/--fin/--pool/--lot/--rollback` | 07/10 | @fullstack | en cours : présent (`prepare-social-month.ts:38-42, 131-161, 182-203`), `--rollback` exige `--confirmer` (absent du plan) |
| 4 `reprendre()`, refus si Buffer injoignable | 09/10 | @fullstack | en cours : 503 si injoignable, rejet au-delà de 24 h, `sauterAvantJ0`. **Écart** : les relais et posts datés de moins de 24 h sont replanifiés, pas rejetés (§7 l.107) |
| 5 Job de couverture, alertes, 2 FAILED | 16/10, 23/10 | @fullstack | en cours, partiel (voir F2) |
| 6 Garde `articleSlug` | 16/10 | @fullstack | en cours : comportement différent du plan (voir F4) |
| 7 Test des routines sur 4 critères | 07/10 | **non nommé** | sans objet |
| 8 Brouillons réels, branche Neon, H+45 | 08/10, 09/10, 12/10 | session ; **branche Neon : personne** | H+45 cohérent avec la relecture horaire |
| 9 Heure d'hiver de bout en bout | 26/10 | session | heures UTC exactes (11:30, 18:30, 07:15) |

## F1 Mise en production : 7/10
Bon : preuve du déploiement (`longueurX`, `wrangler deployments list`, `108da3e7` consignée), GO/NO-GO, reprise réseau par réseau, H+45 juste. **Manques** : (a) qui déploie ? §10 charge Thomas « branche à Replit `[À VÉRIFIER]` », §7 et §10 disent « déploiements par session », et `REPLIT_ACTIONS.md` indique `build:cf` puis `deploy:cf` (l.23) ; (b) le 08/10 déploie `9ca796e` seul ou HEAD avec le code en cours ? À ce jour, HEAD + code en cours = **2 tests Jest en échec** `[LIVE local]` ; (c) le canal Instagram est **déconnecté chez Buffer** (`REPLIT_ACTIONS.md` l.29), et sa reconnexion par Thomas n'apparaît ni en §7 ni en §10 ; (d) branche Neon : ni créateur, ni URL, ni date.
**Correction** : le 06/10, écrire en §7 : « déploie : session (`deploy:cf`) ; Replit seulement si `wrangler` est refusé ». Fixer le contenu du 08/10 : `9ca796e` seul, ou HEAD si Jest est tout vert. Ajouter en §7 et §10 : « Thomas reconnecte Instagram dans Buffer avant le 09/10 (3 min) » et « branche Neon créée par la session le 07/10 (API Neon), sinon par Thomas ».

## F2 Détection et alertes : 6/10
Écrit (non commité) : job horaire (5h à 21h UTC), file basse < 10 jours, lot non prêt, pause après 2 FAILED depuis la dernière reprise (`couverture.ts`, `jobs.ts` « Job 5 ter »). **Écarts avec le plan** : (a) le **stock < 14** est absent (Grep `stock` : 0) ; (b) l'**e-mail de lancement de lot** est absent (Grep `lancement` : 0) ; (c) `LOTS_SOCIAUX` contient les 6 lots de la v1, alors que la v2 compte 9 tranches (1a, 1b, 2a, 2b, 3a, 3b, 4, 5, 6). Avec la v1, 2a et 2b forment un seul lot : si 2a est inséré, l'absence de 2b n'est pas signalée ; (d) alerte de lot à **J-7** (`LOT_PRET_JOURS_AVANT = 7`) contre J-14 en §5 ; (e) lot jugé prêt **dès 1 post** inséré dans sa plage (`couverture.ts:121-127`) ; (f) l'alerte principale de `publish-social` garde la clé globale (`route.ts:479, 496`) : C8 reste ouvert.
**Correction** : `LOTS_SOCIAUX` = les 9 tranches de §5 avec leur date de prêt ; lot non prêt = posts insérés < posts prévus par réseau (à J-14) ; ajouter stock éligible < 14 et e-mail de lancement aux dates de §5 ; clé `social-echec-<réseau>`.

## F3 Déclenchement fiable des lots : 6/10
Bon : le Worker est le filet principal, les routines sont un appoint, et la branche d'échec est écrite (Thomas colle le prompt). Mais l'e-mail de lancement, sur lequel tout repose (§8, §10 « 6 x 2 min »), **n'existe pas dans le code en cours**, et `CONSIGNE_RELANCE_LOT` renvoie encore aux §2.1 et §2.2 de la v1. Le test du 07/10 n'a pas de responsable.
**Correction** : e-mail de lancement daté (§5, colonne Lancement), avec un prompt aux sections v2 (§5 recette) ; responsable du test des routines : session principale, résultat consigné dans `REPLIT_ACTIONS.md` le 07/10.

## F4 Retour arrière et incidents : 6/10
Exécutable (non commité) : `--rollback --confirmer`, `sauterAvantJ0`, rejet à plus de 24 h, pause, `wrangler rollback`. **Faux dans le plan** : (a) §6, §7 l.109 et R3 annoncent un **repli** (une vanne du même thème, sans lien). Le code (`garde-article.ts`) **décale de 24 h deux fois, puis passe en REJECTED** : aucun repli n'est remis, le créneau reste vide ; (b) « publié et en 200 » : le code lit la base (`findBlogArticle`), pas une réponse HTTP ; (c) le décalage peut tomber un **dimanche** ou un jour qui a déjà un post (2 posts X le même jour, et le cron les envoie tous les deux) ; (d) une reprise à moins de 24 h replanifie un post daté (Halloween, Noël) hors contexte.
**Correction** : choisir et écrire une règle unique. Soit le plan s'aligne sur le code (« décalé 2 x 24 h puis REJECTED + alerte, créneau vide »), soit le lot pose `[repli:<id>]` et le cron envoie le repli. Pour le décalage : exclure dimanches et jours occupés. Ajouter un marqueur `[date:…]` posé par le script, que `reprendre()` rejette quel que soit le retard. Ajouter `--confirmer` en §8.

## F5 Tests et vérifications : 5/10
`[LIVE local]` `npx jest src/__tests__/lib/social` : 7 suites PASS, **1 FAIL** (`platform-switch.test.ts`, 2 tests sur l'ancienne signature de `replanifierRetards`) ; 189/191. **Aucun test** pour `couverture.ts`, `garde-article.ts`, `heure-paris.ts`, `sauterAvantJ0`, `--rollback` (Grep des `*.test.ts` : 0). Le §7 annonce pourtant « Jest » pour chacun. Prévu et juste : brouillons Buffer réels, H+45, 26/10, branche Neon.
**Correction** : tests de non-régression avant le commit : silences 11/11 et 27/11, dimanche, 25/10 et 28/03, relais décalé puis rejeté, 2 FAILED puis pause, tranche partielle signalée, rollback avant/après. Le plan les liste en §7 comme critère de commit.

## Ce qu'il faut pour 10/10 (ordonné)
**Plan, sans attendre le code**
1. 06/10 : nommer qui déploie (session `deploy:cf` ou Replit) et ce que contient le déploiement du 08/10 ; retirer le `[À VÉRIFIER]` de §10.
2. Ajouter « reconnexion Instagram chez Buffer (Thomas, avant le 09/10) » en §7 et §10, et le créateur de la branche Neon (07/10).
3. Nommer le responsable du test des routines (07/10).
**Dépend du code en cours (@fullstack)**
4. Avant tout commit : `platform-switch.test.ts` au vert, et tests de `couverture`, `garde-article`, `heure-paris`, `sauterAvantJ0`, `--rollback`.
5. Avant le 16/10 : trancher repli ou REJECTED pour la garde (code et plan identiques en §6, §7, R3) ; décalage hors dimanche et hors jour occupé ; marqueur de post daté rejeté à la reprise.
6. Avant le 23/10 : `LOTS_SOCIAUX` = 9 tranches v2 à J-14, comptage par réseau, stock < 14, e-mail de lancement, clé d'alerte par réseau pour `publish-social`.
7. Au commit : ligne `REPLIT_ACTIONS.md` s15 (`--rollback --confirmer`, `sauter-avant-j0`, garde, job 5 ter, aucune migration) ; mettre à jour la ligne « replanifiés à 1 par jour » (l.27).
**Preuves en ligne**
8. 08/10 : `longueurX` prouvé en ligne et brouillons X et LinkedIn ; 09/10 : 1a inséré sur la branche Neon puis en production, écart 0 ; H+45 ; 26/10 heure d'hiver `[LIVE]`.
