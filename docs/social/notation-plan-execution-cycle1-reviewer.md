# Notation du plan d'exécution s15, cycle 1 (@reviewer, 05/10/2026)

> Objet : `docs/social/plan-execution-s15.md`. Sources recoupées : `strategie-relance-v5.md`, `preparation/lot-relance-s15.md`, `stock-vannes-resultat-s15.md`, `complements-lot-s15.md`, `aveugle-stock-relecteur-1.md` et `-2.md`, `mesure.md`, `production-trimestrielle.md`, `calendrier-editorial-q4-2026.md`, `founder-preferences.md` (lu en entier).
> **Verdict : NO-GO pour l'envoi à Thomas en l'état.** Moyenne 5,3/10. Le plan est solide sur la mécanique (dates, lots, filets), mais sa décision centrale D1 repose sur une lecture fausse de la source.

## Chiffres vérifiés justes
284 posts (X 118, IG 118, LI 48) ; lot 140 (58/58/24) et reste 144 ; 12 lundis sans article (04/01 au 22/03) ; 13 jeudis sans article ; 12 fiches Q1 (4 par mois) ; 5 premiers mercredis à citation ; 8 carrousels livrés (04/11 au 30/12, hors silence du 11/11) ; jalons J+14/28/56 = 26/10, 09/11, 07/12 ; heure d'hiver 25/10 et d'été 28/03 en UTC ; marges des lots (3, 10, 17, 10, 10, 10 jours) ; épuisement des 41 à 9,25 par semaine = semaine du 09/11.

## Notes

| # | Critère | Note | Preuve | Correction précise |
|---|---|---|---|---|
| E1 | Couverture | 5 | (a) T5 et §1.1 : « 13 posts en lignes d'article ». Le lot en compte 27 sourcés BLOG (lot l.76 à 197), 13 est le nombre de renvois X et LinkedIn. (b) §1.5 : « 24 relais sur 28 ont pris une vanne du catalogue » ; `complements-lot-s15.md` l.53 dit 9 sur 13 et 8 sur 11, soit 17 sur 24. (c) §1.3 l.58 « 7 restantes » contre l.59 « 14 hors lot » (`stock-vannes` l.12 : 14). (d) §1.2 marque encore « manque » les 8 fiches livrées (T4). (e) Le « 74 » de la source ne contient pas la condition ajoutée « aucune note sous 8 » : chiffre non vérifié. | Recompter depuis `lot-relance-s15.json` : lignes d'article par emplacement, relais réellement servis par l'article, vannes hors lot. Mettre à jour §1.2 (fiches livrées). Recompter le 74 avec la condition, ou retirer la condition. |
| E2 | Chaîne de production | 6 | Recette en 8 étapes et 3 filets : bons. Mais (a) lot 1 prêt le 09/10 dépend de l'option `--pool` non datée ; (b) gel « 14 jours avant » (§1.4) contredit la marge de 10 jours des lots 2, 4, 5, 6 ; (c) l'alerte « file basse » à 10 jours se déclenche le jour même où ces lots sont dus : fausse alerte et e-mail à Thomas à chaque cycle ; (d) V1 = 360 candidats en 17 jours en parallèle des fiches et relectures, rendement calculé sur une barre erronée (voir E4). | Dater `--pool` au 07/10 et la garde `articleSlug` et l'alerte au 23/10 (lot 2). Fixer « prêt » à J-14 du premier post pour tous les lots, ou baisser l'alerte à 7 jours. Recalculer V1 après correction de D1. |
| E3 | Dépendance au blog | 6 | Trou bien vu, calendrier @seo daté (02/11), insertion avant le 11/12, garde 05:30 UTC, repli par vanne. Mais 1 500 candidats de réparties en 4 semaines (09/11 au 04/12) chevauchent V1 et le lot 2 ; D3 supprime la « validation individuelle » sans rappeler le choix du 05/10 (« notés jusqu'à 10/10 avant publication ») ; le « 8 vannes par semaine » suppose des lignes d'article notées, ce que T5 montre absent aujourd'hui ; §1.2 S13 (04/01 « aucun article ») contredit D3. | Écrire dans D3 que chaque article Q1 reste noté jusqu'à 10/10 par les agents ; borner les réparties par article ; réserver le « 8 par semaine » à la livraison effective de `lignes-articles-notes.json`. |
| E4 | Choix fondateur | 3 | **Erreur de fond.** Le plan écrit « Alexa = 8,32 et 8,16 chez eux » et fait de 8,25 « la note d'Alexa ». Faux : les 2 relecteurs ont noté Alexa (V100) **9** (`relecteur-1` l.107, `relecteur-2` l.106) ; 8,32 et 8,16 sont leurs moyennes sur le lot (« moyennes ... pour l'étalon à 9 », `stock-vannes` l.15). La source définit « au niveau » = 8,5 et plus chez les 2 (l.7) et le relecteur 2 écrit : « Une vanne notée 8 reste SOUS LE NIVEAU » (l.3). Une moyenne de 8,25 admet 8 + 8,5 : sous la barre du 30/09 (« Pas moins »). O1 est présentée comme « au-dessus de la barre d'Alexa » alors que c'est la barre. Le choix n'est donc pas présenté honnêtement. S'y ajoutent : suppression de l'échantillon de 10 (choix du 30/09) glissée dans le tableau §5 et absente de D1 (motif du P0 du 03/10) ; relevé natif hebdomadaire de `mesure.md` §3 réduit aux jalons sans décision. | Réécrire D1 : défaut = O1 (41 au niveau, conforme au 30/09) ; option dérogatoire explicite « accepter des vannes notées 8 par un relecteur (74) : c'est sous Alexa ». Chiffrer O1 sur la vraie barre. Faire de l'échantillon de 10 et du relevé hebdomadaire 2 décisions nommées, sans les noyer dans D1. |
| E5 | Charge de Thomas | 6 | Table datée, environ 1 h 30 recomptée (1 h 45 annoncée). Absents : le déploiement Replit des correctifs (CLAUDE.md : Replit déploie la branche indiquée par Thomas) ; la configuration des secrets des routines sur son compte ; les 3 étalons d'O4 (10 min) ; le bilan du 29/03 ; les e-mails de file basse récurrents (E2). D4 n'a pas de défaut, contrairement à l'annonce « défauts proposés ». Aucune règle si D1 à D5 restent sans réponse le 08/10. | Ajouter ces lignes datées ou les marquer `[À VÉRIFIER : action Thomas ?]`. Donner un défaut à D4 (celui de v5 l.33 ou 0). Écrire : « sans réponse le 08/10 à 18:00, J0 = 19/10 ». |
| E6 | Clarté, actionnabilité | 6 | Identifiants, scripts, heures UTC et responsables : exécutable par un agent. Mais un agent qui suit §1.3 refait le lot avec une barre fausse, compte 13 lignes d'article, attend des fiches déjà livrées et ne sait pas quand coder `--pool`, l'alerte et la garde. R7 (« tests le 07/10 ») contredit §4.1 et §5 (« avant le 11/10 »). | Corriger les contradictions ci-dessous, puis un cycle 2 de notation ciblé sur E1, E4, E5. |

## Contradictions internes (passe de contrôle)
| Plan A | Plan B ou source | Contradiction | Résolution |
|---|---|---|---|
| D1, §1.3 « Alexa 8,32 et 8,16 » | relecteurs l.106-107 : V100 = 9 | barre fondée sur une lecture fausse | E4 |
| T4 « 8 livrées » | §1.2 « manque » 04/11 à 30/12 | tableau périmé | mettre « livrée » |
| T4 « 04/11 et 02/12 en repli » | §1.4 « citation 04/11 au 23/10 » | double consigne | trancher : repli pour 04/11 et 02/12 |
| §1.3 « 7 restantes » | §1.3 « 14 hors lot » | stock résiduel flou | recompter en base |
| T5 « 13 lignes d'article » | lot : 27 posts BLOG | sous-comptage | recompter |
| §1.5 « 24 sur 28 » | compléments : 17 sur 24 | chiffre sans source | citer 17 sur 24 |
| §1.4 gel 14 j | §2.1 marges 10 j, alerte 10 j | lots livrés dans le gel | E2 |
| R7 « tests le 07/10 » | §4.1, §5 « avant le 11/10 » | date double | une seule date |

## Top 3 corrections (dans l'ordre)
1. **D1** : rétablir la barre réelle (8,5 et plus chez les 2 = Alexa notée 9), défaut O1, 74 présenté comme dérogation, puis recalculer V1, O4 et R1.
2. **Comptages** : lignes d'article, relais servis par l'article, stock hors lot, tableau §1.2, avec les sources à la ligne près.
3. **Dates manquantes** : `--pool` (07/10), alerte et garde (23/10), déploiement côté Thomas, marge J-14, défaut de D4, règle « sans réponse ».

**Handoff → @orchestrator** : relancer @social (rédacteur du plan) sur les 3 corrections ; @copywriter pour recompter le 74 avec la condition « aucune note sous 8 ». Aucun autre fichier modifié.
