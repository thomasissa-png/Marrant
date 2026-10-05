# Notation indépendante, cycle 3 : `plan-execution-s15.md` v3 (angle pilotage, contenu et blog, @growth, 05/10/2026)
> Lu : plan v3, `mesure.md` (§2 à §5), ma notation cycle 2, `founder-preferences.md`, `wrangler.jsonc`, `lib/scheduler/prepared-content.ts`, `cron/weekly-seo`. Non re-litigué : barre stricte (D1), vannes neuves, conseils en appoint, D5 supprimée. `lignes-articles-notes.json` et `releves/` absents (normal avant le 07/10 et J0).

| Grille | Cycle 1 | Cycle 2 | Cycle 3 | Verdict en une ligne |
|---|---|---|---|---|
| G1 Pilotage | 7 | 8 | **9/10** | 4 corrections soldées ; C1 de `mesure.md` reste suspendue à D6 |
| G2 Flux de contenu | 6 | 8 | **9/10** | Q2, thèmes, jeudis, `--pool` soldés ; deux comptes faux et un mécanisme mal décrit |
| G3 Arbitrage qualité / volume | 7 | 7 | **9,5/10** | D2 non circulaire, 24 + 14, pilote 240 : solides ; réserve S1 non tracée |
| G4 Lien social vers site | 7 | 7,5 | **10/10** | Déploiement du 10/10, `bio-parcours`, 200 vérifiés : tous soldés, rien de plus à exiger |
| **Total** | 27 | 30,5 | **37,5/40** | |
## Corrections du cycle 2 : toutes vérifiées
G1 : seuils J+84 et J+112 refaits un à un (extrapolation linéaire juste, 4 sommes de contrôle justes : 770/220, 1 060/305, 200, 275) ; table de glissement (25 dates recalculées, justes) ; plafond Buffer aligné (`mesure.md` §3) ; sessions comptées (40 démarrages, 7 lots + 4 vagues + 5 fiches = 16 x 2 = 32 min) ; charge refaite : 380 min hors réponses, 980 avec, 2 180 au pire, soit 91 min par semaine sous 105.
G2 : jeudis 16 = 5 + 11 (recomptés) ; 284 = 12+46+34+48+24+120 ; 2 400 + 1 000 = 3 400 candidats ; D3 étendue à Q2 avec défaut et grille persona.
G3 : 38 = 19 vendredis x 2 = 6+4+4+4+20 ; 24 + 14 = 38 ; seuils P0 : 12/240 = 5 %, 7/240 = 2,9 %, IC 3,8 à 10,2 % et plus ou moins 2,3 points à 485 : justes ; marges 1b 14 / 8 / 9 à 13 justes ; vagues V1 à V4 et marges de prêt (7, 10, 10, 10 j) justes.
G4 : `bio-parcours` en tête, déploiement sam. 10/10 12:00 avant les tests, vérification manuelle à 200 avant la garde du 16/10, heures UTC d'hiver et d'été justes. Jours de la semaine : tous justes.
## G1 Pilotage (9/10)
**Preuve.** `mesure.md` §2 : « C1 = les 9 étalons ET les seuils du §4 validés par Thomas ; C1 non validée le 12/10 : J0 = lundi suivant ». Le bloc J+84/J+112 est désormais DANS le §4, et sa validation passe par D6, dont le défaut est un silence.
1. Une absence de réponse à D6 (08/10) rend C1 incomplète au GO/NO-GO du 11/10 : J0 glisse, contre §0 (« aucune décision ne bloque une reprise »). Aussi : l'exclusion des conseils de la médiane modifie un seuil validé le 05/10 sans décision datée.
2. `mesure.md` §2 exige une baseline le dimanche avant J0 (captures natives des 3 réseaux, 11/10) : absente du §10 « exhaustif » (3 min de Thomas, ou écrire que la baseline du 05/10, 0 partout, tient).
**Correction.** `mesure.md` §2 : C1 = étalons + seuils J+28 et J+56 (validés le 05/10) ; J+84/J+112 et exclusion des conseils s'appliquent par défaut D6/D2 sans bloquer J0. Ajouter la ligne baseline du 11/10 au §10.
## G2 Flux de contenu jusqu'au 28/03/2027 (9/10)
**Preuve.** §1 : lundis Q4 12 + jeudis Q4 7 = 19 articles ; §4 : « 20 articles Q4 ». D3 : « Q2 (29/03 au 28/06, 13) » ; 29/03 + 13 x 7 = 28/06, soit 14 lundis. `publishDueScheduledArticles` (code) publie à chaque tick de 15 min, borné à la semaine ISO ; le plan écrit « `weekly-seo` le lundi 05:00 UTC ».
1. 19 contre 20 : le 20e article n'est pas nommé (refonte du 15/12 ?) ; les notes de lignes se compilent sur un périmètre flou.
2. 13 contre 14 : écrire « 29/03 au 21/06 (13) » ou 14 ; sans effet avant le 15/02, mais le lot 6 et le calendrier Q2 s'appuient sur ce chiffre.
3. Les articles jeudi du 25/02 et du 22/04 n'ont ni lignes budgétées ni règle de relais (le jeudi X relaie « l'article du lundi ») : écrire « pas de relais, vanne du pool » ou budgéter 200 candidats.
4. Mécanisme : un article inséré avec un `publishedAt` hors semaine ISO courante ne se publie jamais ; l'écrire dans la recette d'insertion (test du 11/12).
**Correction.** Corriger 19/20, 13/14, règle du 25/02 et du 22/04, remplacer « `weekly-seo` 05:00 UTC » par « tick de 15 min (doublon : cron `weekly-seo`) ».
## G3 Arbitrage qualité / volume (9,5/10)
**Preuve.** §3 : « tant que la réserve existe (50 conseils) » ; source : 26 GARDER + 80 REECRIRE = 106, moins 38 = 68, et le nombre au niveau 8,5 sur format carte est inconnu avant le 07/10.
1. « 50 » n'est tracé nulle part : marquer `[HYPOTHÈSE]` ou `[À VÉRIFIER @copywriter 07/10]`, et recaler S1 sur le chiffre réel (au plus 68).
**Correction.** Une phrase au §3.
## G4 Lien social vers site (10/10)
Rien à exiger : chaîne déployée avant tests, garde, repli sans décalage, UTM, `origine`, bio en tête, visites rapportées aux lundis avec article, limites d'attribution écrites.
## Passe de contrôle
Aucune régression : D2/D4/D5, S1 sous condition D2, tableaux 1b et P0, glissement, jalons 1 à 5, charge, citations (mercredis 06/01, 03/02, 03/03 justes). Aucune mention de concurrent, aucun tiret cadratin.

**Verdict : GO sous réserve de 5 corrections de texte (C1/D6 et baseline, 19/20, 13/14, 25/02 et 22/04, réserve S1), vérifiables par relecture, sans nouveau cycle ni nouveau calcul.**
