# Notation du plan d'exécution s15, cycle 4 (@reviewer, 05/10/2026, contrôle final)

> Objet : `plan-execution-s15.md` v4 et `mesure.md` (v4). Recoupés : ma notation du cycle 3, `founder-preferences.md`, `strategie-relance-v5.md` l.58, `audit-conseils-s14.md` l.80 à 137. Zéro tiret cadratin dans les 2 fichiers (Grep : 0).
> **Verdict : NO-GO résiduel, 2 lignes. Moyenne 9,8/10 (8,4 au cycle 3).** Les 13 points du cycle 3 sont faits. Un seul défaut subsiste, créé par le correctif E2a. GO acquis sans cycle 5 dès que les 2 éditions du Top 1 sont faites (contrôle par Grep de la session).

## Corrections du cycle 3 : vérification une à une
| Point | Statut | Ligne et contrôle |
|---|---|---|
| E1a conseils à J+112 | Faite | plan l.66, `mesure.md` l.51 : 15 vendredis du 23/10 au 29/01 moins 4 = 11 ; 23 vendredis au 26/03 moins 4 = 19 (= 38 / 2) |
| E1b réserve S1 | Faite | l.67 : 106 - 38 = 68 au plus, `[À VÉRIFIER 07/10]` |
| E2a démarrages | Faite (défaut induit, voir Top 1) | l.141 (16/10, 23/10, 15/02), l.168 : 7 + 4 + 5 + 3 = 19, 19 x 2 = 38 |
| E2b `[repli:<id>]` | Faite | l.113 (script du 07/10, 1a et 1b compris), l.88 et l.89 |
| E3 réparties au §4 | Faite | l.80 : 12 x 200 = 2 400, 5 x 200 = 1 000, dates cohérentes avec R5 l.179 |
| E4a étalon E7 | Faite | l.11 et l.188 : E2, E4, E7 tous dans les étalons du 30/09 ; E4 (l.106) et E7 (l.130) de l'audit conformes à leur description |
| E4b humoristes gardés | Faite | l.65, conforme au P0 du 05/10 (`founder-preferences` l.54) |
| E4c ordre de `/liens` | Faite | l.116 = v5 l.58 bloc pour bloc (article ou quiz, l'autre, vanne du jour, parcours, vannes, conseils) |
| E5a Instagram retiré | Faite | §10 l.163 à 170 sans reconnexion ; l.4, l.126, R4 l.178 « connectés (API, 05/10) » |
| E5b branche Neon | Faite | l.171 « Hors total » |
| E6a, E6b | Faites | l.126 (relu le 09/10) ; l.64 (« déduit du choix du 05/05 ») |
| E6c C1 borné | Faite | `mesure.md` l.26, plan l.14 (D6) et l.127 (C1 = J+28 et J+56) |

## Recompte de la charge de Thomas (§10)
25 + 18 + 240 + 25 + 20 + 38 + 20 = **386 min, juste** ; avec réponses 386 + 600 = 986 (41 par semaine) ; pire cas 386 + 1 800 = 2 186 (91 par semaine, sous 105). Passage de 380 (v3) à 386 : moins 3 (Instagram), plus 6 (3 démarrages), plus 3 (baseline), justifié l.198. Observation non bloquante : les 19 prompts comptent V1 du 12/10 (session principale) et deux démarrages le 14/12 (lot 3b et V4) : surcompte prudent de 4 min au plus.

## Passe de contrôle
- Aucun chiffre faux : tranches de conseils 6 + 4 + 4 + 4 + 20 = 38, jalons du §9 (12/10 + 112 j = 01/02), totaux §10, 284 posts : justes.
- **Défaut induit par E2a** : l.141 donne pour 16/10 et 23/10 le déclencheur « session principale ou prompt », or l.142 borne la session principale au 13/10 et le Worker n'envoie ses e-mails qu'après le déploiement 4 (l.119) : aucun rappel ne prévient Thomas. Pour le 15/02, l.141 annonce « e-mail du Worker », mais la liste des dates codées l.119 (vagues 27/10, 16/11, 14/12 et jalons) ne contient pas le 15/02, ni son test. Impact faible (16/10 et 23/10 sans objet si le code part le 08/10 ; défaut écrit au 15/02, l.103), mais contradiction réelle.
- Goût, non noté : `mesure.md` l.47 porte « hors conseils » dans le tableau validé en C1, alors que l.26 met l'exclusion hors C1 ; lecture cohérente (règle par défaut), aucune action exigée.

## Notes
| # | Critère | Note | Motif |
|---|---|---|---|
| E1 | Couverture | 10 | 11 et 19 conseils justes, réserve sourcée |
| E2 | Production | 9 | déclencheurs du 16/10, 23/10 et 15/02 non construits (ci-dessus) |
| E3 | Blog | 10 | réparties Q1 et Q2 au §4 |
| E4 | Conformité fondateur | 10 | étalons du 30/09, P0 humoristes, `/liens` = v5 |
| E5 | Charge de Thomas | 10 | 386, 986, 2 186 recomptés justes |
| E6 | Clarté | 10 | Instagram, LinkedIn, C1 corrigés |

## Top 1 (seule correction, 2 lignes, sans décision de Thomas)
1. l.119 : ajouter « 15/02 (calendrier Q2 @seo) » aux dates codées dans `social-calendrier.ts`, avec son test d'e-mail. 2. l.141 : « 16/10 et 23/10 : routine programmée le 07/10 ; sinon rappel daté dans le message du 06/10, Thomas colle le prompt ».

**Handoff → @orchestrator** : relancer @social pour ces 2 éditions ; vérification par Grep (l.119 contient « 15/02 », l.141 ne cite plus la session principale), puis GO sans nouveau cycle. Aucun autre fichier modifié.
