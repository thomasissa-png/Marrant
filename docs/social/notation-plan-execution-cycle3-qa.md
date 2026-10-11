# Notation du plan d'exécution s15 v3, cycle 3 : fiabilité et exploitation (@qa, 05/10/2026)

> Objet : `plan-execution-s15.md` v3 (`7fa6e6c`). Code : HEAD `7fa6e6c` + travail @fullstack **non commité, encore en mouvement** (12 fichiers modifiés, 7 nouveaux ; `garde-article.test.ts` est apparu pendant ma notation). `[STATIQUE]` = lecture/Grep ; `[LIVE local]` = exécuté ici ; `[LIVE API]` = fait de la session principale (Buffer `channels`, 05/10 17:06 UTC : 3 canaux connectés). Rien n'a été vérifié contre le Worker en ligne.

## Note globale : 7,8/10 (F1 8, F2 8, F3 7, F4 8, F5 8) ; cycle 2 : 6,0 ; cycle 1 : 4,6
Les 8 points « plan » et « code » du cycle 2 sont traités, sauf 3 restes (F2 c, F4 test, F1 b). Le code en cours rejoint le plan sur l'essentiel : 9 tranches, J-14, repli, `[date:]`, clé par réseau. Les défauts restants sont surtout dans le plan : des faits périmés, et des déclencheurs annoncés que personne ne construit.

## Suivi du cycle 2
| Point cycle 2 | v3 | Code en cours |
|---|---|---|
| Qui déploie, contenu du 08/10 | §7 : session, HEAD si 100 % vert, sinon `9ca796e` | `CLOUDFLARE_API_TOKEN` et `_ACCOUNT_ID` présents dans l'environnement `[STATIQUE : noms seuls, deploy non testé]` |
| Instagram, branche Neon, test des routines | datés et attribués | Instagram **déjà connecté** `[LIVE API]` |
| `LOTS_SOCIAUX` 9 tranches, J-14, par réseau, stock, lancement | §7 23/10 | `social-calendrier.ts` : 9 tranches conformes à §5 ; `couverture.ts` : prévus par réseau, stock, e-mail de lancement `[STATIQUE]` |
| Repli contre REJECTED, dimanche, `[date:]` | repli sur le même créneau | `garde-article.ts` + `route.ts:259-296` : repli envoyé, sinon créneau vide ; `replanifierRetards` : jamais dimanche ni silence ; `[date:]` et relais rejetés à la reprise `[STATIQUE]` |
| Clé `social-echec-<réseau>` (C8) | §7 | `route.ts:495` `[STATIQUE]` |
| Jest rouge, tests absents | critère chiffré | **330/330 PASS** (18 suites sociales et scripts), `tsc -p tsconfig.build.json` 0, ESLint 0 sur 8 fichiers `[LIVE local]` ; `build` non lancé |

## F1 Mise en production : 8/10
Bon : une seule règle de déploiement, preuve en ligne (`longueurX`, `108da3e7`, `wrangler rollback`), GO/NO-GO, reprise réseau par réseau. **Manques** : (a) **faits périmés** : §7 l.115 « 2 tests de `platform-switch.test.ts` échouent aujourd'hui » (faux, 245/245 PASS) ; §7 l.116, §10 et R4 font reconnecter Instagram par Thomas, alors qu'il est connecté depuis 17:06 UTC ; (b) **le découpage en 4 déploiements ne tient plus** : si le code en cours est commité vert avant le 08/10, le déploiement 1 (HEAD) livre déjà la garde, `reprendre()`, la couverture et la pause après 2 FAILED. Les déploiements 2 à 4 (10/10, 16/10, 23/10) et « automatique dès le 23/10 » (§7 l.132) deviennent faux ; (c) le GO/NO-GO s'appuie sur « C1 à C4 » (l.129), que le plan ne définit nulle part : il n'est donc pas autonome ; (d) avant de déployer, aucun contrôle de migration (la 11 est dans `c3564c2`, déjà en ligne, mais rien n'est prouvé en base).
**Correction** : retirer la ligne Instagram de §7, §10 et R4 (charge de Thomas : 377 min hors réponses) et la remplacer par « session : `channels` relu le 08/10 et au GO ». Remplacer « 2 tests échouent » par « Jest 100 % vert le 05/10 ». En §7, écrire : « chaque déploiement livre HEAD vert ; les dates 10/10, 16/10 et 23/10 sont des butoirs au plus tard ». Définir C1 à C4 en une ligne chacun. Ajouter au 08/10 : `SELECT` de `SocialPlatformSetting` (3 lignes en pause) avant `deploy:cf`.

## F2 Détection et alertes : 8/10
Conforme au plan : 9 tranches, retard à J-14 par réseau, file basse < 10 j, pause après 2 FAILED, e-mail de lancement, clés par réseau. **Écarts** : (a) **le stock < 14 ne compte pas le pool strict** : `stockEligible` (`couverture.ts:91`) compte toutes les vannes GARDER actives (environ 125 moins celles utilisées). Avec 41 vannes au niveau, l'alerte de R1 (le risque le plus élevé) ne partira **jamais à temps** ; (b) §2 demande une alerte « par réseau », le code compte tous réseaux confondus ; (c) la pause après « 2 semaines de suite prévu ≠ publié » (§9) n'a ni code ni responsable.
**Correction** : le pool strict doit être lisible par le Worker (liste d'identifiants dans `social-calendrier.ts`, mise à jour à chaque vague, ou marqueur en base). Trancher « global » (le registre des 90 jours est commun, mon avis) ou « par réseau », et l'écrire en §2. Pour §9, écrire « session, au relevé du lundi ».

## F3 Déclenchement fiable des lots : 7/10
L'e-mail de lancement de tranche existe, avec une consigne qui suit §5 (étapes 1 à 8). **Mais** §8 annonce un « e-mail du Worker » pour **40 démarrages**, et le code n'en déclenche que les 7 lancements de lot : rien pour les **vagues V1 à V4** (12/10, 27/10, 16/11, 14/12), rien pour les **5 fiches de jalon**. Le relevé du lundi n'a que le rapport « prévu contre publié » existant, sans consigne d'écrire `releves/AAAA-MM-JJ.md` (Grep `vague|jalon|relev` : 0) `[STATIQUE]`. Le §7 ne livre ces déclencheurs à aucune date.
**Correction** : en §7 (23/10), ajouter « dates des vagues et des jalons dans `social-calendrier.ts`, e-mail avec consigne ; consigne de relevé dans l'e-mail du lundi », avec un test par type.

## F4 Retour arrière et incidents : 8/10
Code et plan concordent : repli sur le même créneau, `[date:]` et relais rejetés à la reprise, `sauterAvantJ0`, `--rollback --confirmer` (compte d'abord), refus d'une insertion qui en chevauche une autre. **Manques** : (a) `wrangler rollback` vers `108da3e7` ramène un Worker qui ignore les marqueurs et la limite X : les relais d'un article absent repartent, ainsi que les posts X avec lien en FAILED ; (b) la règle « retour à 90 jours sur un **autre réseau** » (§2) n'est ni dans le script ni dans les tests `[STATIQUE]`.
**Correction** : §8 : « avant tout `wrangler rollback` : pause des 3 réseaux, puis reprise seulement sur un Worker qui contient la garde ». Implémenter et tester la règle d'un autre réseau, ou la retirer de §2.

## F5 Tests et vérifications : 8/10
Couverts `[LIVE local]` : couverture (silences, 25/10, 2 FAILED, tranche partielle), garde (repli, `repliValide`), heure de Paris (29/03 10:30 UTC), `sauterAvantJ0`, dimanche, clé par réseau. **Absents** : `--rollback` / `annulerLot` (Grep des tests : 0), pourtant dans le critère de commit ; `npm run build` pas encore passé sur le code en cours.
**Correction** : un test de `annulerLot` (sans `--confirmer` : 0 modification ; avec : APPROVED du lot passés en REJECTED, replis et autres lots intacts), puis `build` vert avant le commit.

## Ce qu'il faut pour 10/10
**Plan (la v3 n'est pas encore à 10)** : 1. Supprimer les faits périmés (Instagram, « 2 tests échouent ») et recalculer la charge de Thomas. 2. Remplacer les 4 déploiements datés par « HEAD vert, dates = butoirs ». 3. Définir C1 à C4. 4. Ajouter le contrôle de `SocialPlatformSetting` avant le déploiement. 5. Écrire la règle de `wrangler rollback` (pause d'abord). 6. Trancher le stock (global ou par réseau) et en faire le pool strict. 7. Dater la construction des déclencheurs de vagues, de jalons et de relevé. 8. Attribuer la pause après 2 semaines où prévu ≠ publié.
**Code (@fullstack, en cours)** : 9. Stock calculé sur le pool strict. 10. E-mails des vagues et des jalons, consigne du relevé. 11. Test de `annulerLot`. 12. Règle d'un autre réseau, ou retrait de §2. 13. `build` vert, commit, ligne `REPLIT_ACTIONS.md` s15 (garde, job 5 ter, marqueurs, `--rollback`, aucune migration), et mise à jour de la ligne « replanifiés à 1 par jour » (l.27).
**Preuves en ligne** : 14. 08/10 : `longueurX` en ligne, brouillons X et LinkedIn. 15. 09/10 : 1a sur la branche Neon puis en production, écart 0. 16. H+45. 17. 26/10 : heure d'hiver `[LIVE]`.
