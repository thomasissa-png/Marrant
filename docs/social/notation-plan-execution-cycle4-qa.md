# Notation du plan d'exécution s15 v4, cycle 4 : fiabilité (@qa, 05/10/2026)

> Objet : `plan-execution-s15.md` v4 (`adf2b14`). Code : travail @fullstack **non commité** (15 fichiers modifiés, 11 nouveaux), lu pour vérifier que le plan le décrit bien, pas noté. `[STATIQUE]` = lecture/Grep ; `[LIVE local]` = `wrangler rollback --help` (wrangler 4.143.1). Rien vérifié contre le Worker en ligne.

## Note du PLAN : 8,7/10 (F1 9, F2 8,5, F3 9, F4 8, F5 9) ; cycle 3 : 7,8. Verdict : **GO**, sous 3 éditions avant le message du 06/10
Les 8 corrections « plan » du cycle 3 sont faites (l.203 à 211 conformes au texte). Restent 3 défauts, tous d'écriture.

## Suivi du cycle 3 (plan)
| Point | Fait ? | Ligne |
|---|---|---|
| Faits périmés (Instagram, « 2 tests échouent ») | faite | l.4, 109, 126, R4 l.178 |
| HEAD vert à chaque déploiement, dates = butoirs | faite | l.109, 118, 119, 130 |
| C1 à C4 définis | faite, mais C1 non planifié (F1) | l.127 |
| `SELECT` de `SocialPlatformSetting` avant `deploy:cf` | faite | l.115 (a) |
| Pool strict lisible par le Worker | faite ; « global » contredit le code (F2) | l.33, 119, 134 |
| Vagues, jalons, consigne du relevé au 23/10, un test par type | faite | l.119, 138 à 140, 158 |
| `wrangler rollback` : pause d'abord, pertes écrites | faite ; commande et cible incomplètes (F4) | l.145, R6 l.180 |
| Pause après 2 semaines prévu ≠ publié | faite (session, relevé du lundi) | l.159 |
| `annulerLot` testé, `build` avant commit | faite | l.121 |

## Critères C1 à C4 (l.127) : présents ; vérifiables 3 sur 4
- **C2, C3** : vérifiables (tests de Thomas sur code déployé le 10/10, l.117, 125). **C4** : vérifiable par le brouillon LinkedIn réel du 08/10 (l.115) ; écrire que c'est sa preuve.
- **C1 n'est demandé nulle part** : la validation des seuils J+28 et J+56 (`mesure.md` §4 l.39 et 49 : « avant J0 ») n'est ni dans le message du 06/10 (§0) ni dans la charge (§10), et n'a pas de défaut. Silence de Thomas = NO-GO des 3 réseaux le 11/10, ce qui contredit « aucune ne bloque une reprise » (l.7). **Correction** : ajouter C1 au message du 06/10 (2 min, §10) avec un défaut écrit (seuils de `mesure.md` §4 appliqués), ou dire que C1 bloque.

## F2 : stock « global » (plan) contre « par réseau » (code)
`couverture.ts:210-218` et `social-calendrier.ts:67` comptent **par réseau** (retour interdit sur le réseau de 1re diffusion), testé ainsi (`couverture.test.ts:252`). Le code a raison, la règle « autre réseau » rend le stock propre à chaque réseau. **Correction** : l.33, 119, 134 : « par réseau ». Écrire aussi que la règle « autre réseau » est levée en pénurie, avec un avertissement (`social-lot-v5.ts:202`). Jalons : le code a un seul `J0_SOCIAL` (`social-calendrier.ts:63`) ; l.119 doit dire qu'un J0 qui glisse sur un seul réseau n'a pas d'e-mail de jalon propre (fiche faite par la session).

## F4 : procédure `wrangler rollback` exacte (à écrire en §8)
1. Pause des 3 réseaux (admin), puis `SELECT` de `SocialPlatformSetting` : 3 en pause.
2. `cd apps/web && npx wrangler deployments list` : la cible est la **version précédente consignée à chaque déploiement (N-1)**, pas toujours `108da3e7`. Revenir à `108da3e7` après le 10/10 retirerait aussi la garde et `/liens`.
3. `npx wrangler rollback <ID de version complet> -m "s15 : <raison>" -y` (syntaxe `[LIVE local]` ; `108da3e7` est un préfixe : **consigner l'ID complet le 08/10** `[À VÉRIFIER : préfixe accepté ?]`).
4. Contrôle : `wrangler deployments list` (version active = cible), ligne dans `REPLIT_ACTIONS.md`. Reprise seulement sur une version qui contient la garde (l.145).

## Reste au CODE avant déploiement (hors notation du plan)
1. `npm run build` et `build:cf` verts, Jest 100 %, tsc (`tsconfig.build.json`) et lint, puis **commit** : rien n'est commité, le 08/10 part sinon sur `9ca796e` seul (l.115 b).
2. Ligne `REPLIT_ACTIONS.md` s15 (garde, couverture, marqueurs, `--rollback`, aucune migration : confirmé `[STATIQUE]`, aucun fichier `prisma/` modifié).
3. `POOL_STRICT` = 40 (test l.160) : à compléter par les 14 hors lot notées le 07/10 et par P0, sinon l'alerte de stock part trop tôt.
4. `reprendre()` et `/liens` 3 routes (ordre v5 §2) avant le déploiement 2 du 10/10 12:00, sinon C2 et C3 ne sont pas testables.
5. Preuves en ligne : 08/10 `longueurX` et brouillons X et LinkedIn ; 09/10 1a sur la branche Neon puis en production, écart 0 ; H+45 ; 26/10 heure d'hiver `[LIVE]`.
