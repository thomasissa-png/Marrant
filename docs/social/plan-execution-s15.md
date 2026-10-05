# Plan d'exécution de la relance des réseaux : 12/10/2026 au 28/03/2027 (v4, cycle 4, s15, 05/10/2026)

> Autonome. Sources : `strategie-relance-v5.md`, `mesure.md` (modifié en v4 : §2, §4), `founder-preferences.md`, `preparation/lot-relance-s15.md` (dry-run `9ca796e`), `complements-lot-s15.md`, `stock-vannes-resultat-s15.md`, `audit-conseils-s14.md`, notations des cycles 1 à 3 (@reviewer 5,3, 7,0 puis 8,4 ; @qa 4,6, 6,0 puis 7,8 ; @growth 27, 30,5 puis 37,5/40). Heures de Paris. `[HYPOTHÈSE]` = à confirmer, `[À VÉRIFIER]` = non prouvé.
> **Qui fait quoi** : tout passe par une session Claude Code (la session principale), **déploiements compris, sous le GO de Thomas du 05/10 (« Essayons et avançons, oui ok ! »)** : aucun déploiement n'est demandé à Thomas. Il n'intervient que pour son téléphone, ses comptes ou son jugement (§10). Buffer est à son nom : les 3 canaux sont connectés (API `channels`, 05/10 17:06 UTC) ; en incident, sa seule action technique est de reconnecter un canal, la session relit l'état par l'API.
> Période : 24 semaines (lun. 12/10/2026 à dim. 28/03/2027), **284 posts** (X 118, Instagram 118, LinkedIn 48). Lot dry-run : 140 posts jusqu'au 03/01 ; reste 144 du 04/01 au 28/03.

## 0. Décisions (un message à Thomas le 06/10, réponse souhaitée le 08/10 à 18:00 ; aucune ne bloque une reprise, chaque défaut est écrit ; D5 supprimée : déploiements par la session, §7)
| # | Décision | Échéance | Défaut sans réponse |
|---|---|---|---|
| D1 | **Barre des vannes stricte** : seules les vannes au niveau (≥ 8,5 chez les 2 relecteurs à l'aveugle) | Tranchée (30/09 « rien en dessous »), non re-questionnable | Sans objet. Alexa = 9 chez les 2 relecteurs |
| D2 | Conseils en appoint (§3) et **3 étalons de cartes conseil** (10 min, règle P0 s8) pris parmi les étalons retenus le 30/09 (E2, E3, E4, E6, E7 de `audit-conseils-s14.md`) : reco @copywriter E4 (introverti en groupe) et E7 (ironie bienveillante, « pas de vieillir ensemble », scénario potes) pour Yanis, E2 (anecdote détaillée) pour Sophie. E1 n'est pas un étalon (non retenu) mais reste éligible à la sélection des 38 | 08/10, activable jusqu'au 20/10 pour le 23/10 | **Conseils non activés** : les 6 vendredis de 1b prennent une vanne du pool (offre suffisante, §2) ; relance le 13/10 12:00 ; aucun contenu sans étalon validé |
| D3 | Articles : **un lundi par semaine**, Q1 (04/01 au 22/03, 12 articles) et Q2 (29/03 au 21/06, 13), plus celui du 25/02 | 23/10 18:00 | **Appliqué**. Chaque article reste noté jusqu'à 10/10 par les agents (choix du 05/10). Refus : lundis relayés par vanne du pool, S1 (§3) à 3 conseils par semaine |
| D4 | Réponses aux commentaires et messages | 08/10 | **Défaut = v5 §1** (déjà validée) : réponse sous 24 h les jours ouvrés, 5 min par jour ouvré (plafond v5 : 15 min) avec banque de réponses ; suspendues pour un réseau sous 5 interactions au J+28. La v2 proposait 2 passages (délai jusqu'à 72 h) : écart abandonné |
| D6 | Relevé natif (abonnés, impressions) : **chaque lundi** (24 x 10 = 240 min) ou aux **5 jalons** (5 x 10 = 50 min, gain 190 min, historique natif conservé par les réseaux `[À VÉRIFIER @data-analyst]`). Inclut les seuils J+84 et J+112 de `mesure.md` §4 `[HYPOTHÈSE]`, **hors C1** | 08/10 | **Chaque lundi** ; seuils J+84 et J+112 appliqués sans bloquer J0 |
| D7 | Échantillon de 10 vannes neuves par vague V1 à V4 (30/09) | 5 min par vague | Non bloquant : sans réponse sous 48 h les vannes passent ; veto de Thomas = retrait |
| D8 | **Conditionnelle** : pilote P0 sous 3 % (§2) | 10/10 | Mode 3/3/1 sur 2a et 2b (7 posts par semaine) après 48 h |

## 1. Comptages vérifiés à la source
| Donnée | Valeur | Source et calcul |
|---|---|---|
| Posts | 284 = 24 x (5+5+2) = 288 moins 4 silences (11/11 et 27/11, X et Instagram) | v5 §1 et §3 |
| Lot dry-run | 140 = 111 vannes du catalogue + 27 lignes d'article + L3 (article) + L2 (texte original) ; X 58, IG 58, LI 24 | colonnes Source de `lot-relance-s15.md` |
| Relais avec renvoi | 24 (13 X et LinkedIn, 11 IG) : **17 portent une vanne du catalogue**, **7 une ligne d'article** (23/11, 30/11, 07/12, 28/12 en X ; 23/11, 30/11, 28/12 en IG) | `complements-lot-s15.md` §2 |
| Catalogue | 125 actives = 111 dans le lot + **14 hors lot, non notées** `[À VÉRIFIER @copywriter en base le 07/10]` | `stock-vannes-resultat-s15.md` l.12 |
| Vannes au niveau | **41** (≥ 8,5 chez les 2) dont **Alexa V100, exemptée (X1)** : **pool = 40 au plus** | même fichier l.5 à 17 |
| Carrousels | 8 livrés (04/11, 18/11, 25/11, 02/12, 09/12, 16/12, 23/12, 30/12) ; 12 fiches Q1 restent (mercredis 06/01 à 24/03) ; leurs 8 vannes recoupées avec les 41 le 07/10 (sinon changées) | compléments §1 |
| Citations d'humoriste | 3 à fournir (06/01, 03/02, 03/03) ; 04/11 et 02/12 en repli sans citation | 1ers mercredis du mois |
| Articles | lundis Q4 : 12 (12/10 à 28/12) ; jeudis Q4 : 7 (22/10 à 03/12) ; **= 19 articles Q4** ; **jeudis sans article : 16** (5 en 2026 : 15/10, 10/12, 17/12, 24/12, 31/12 ; 11 en 2027 : 07/01 à 18/02, 04/03 à 25/03) ; seul article 2027 programmé : 25/02 (jeudi), puis 22/04, 13/05, 03/06 | `founder-preferences.md` 05/10 |
| Posts X > 270 en longueur brute | 30 sur 58 (le lien compte 23) | recomptage @qa |

## 2. Stock de vannes sous barre stricte
- **Emplacements** : 12 par semaine (X 5, IG 5, LI 2) : une vanne du pool, une ligne d'article notée au niveau, ou un conseil (§3). Les 9 posts validés par Thomas le 05/10 restent tels quels : 7 vannes exemptées, jamais rejouées.
- **Pool strict** : les 41 moins Alexa = **40** + les 14 hors lot notées le 07/10 (environ 5) + **les vannes du pilote P0** + les lignes d'article notées (comptées après livraison) + V1 à V4. Les 4 réservées de Noël restent exclues avant le 24/12 ; recoupement des 7 exemptées et des 4 de Noël avec les 41 par @copywriter le 07/10 `[À VÉRIFIER]`. Règles dans `--pool` : liste ordonnée par note ; retour à 90 jours **sur un autre réseau** que la 1re diffusion (une vanne de la semaine 1 revient le 11/01, 91 jours), règle codée et testée (critère de commit §7, sinon retirée : retour à 90 jours tous réseaux) ; « pain » 30 jours ; **LinkedIn tire d'abord les vannes de thème bureau** (étiquette du catalogue, `[À VÉRIFIER]` : 48 posts, vannes de bureau au niveau à compter le 07/10). **Alerte de stock < 14 : globale** (le registre des 90 jours est commun), calculée sur **le pool strict** : liste d'identifiants lisible par le Worker (`social-calendrier.ts`), mise à jour à chaque vague (§7).

| Tranche | Posts | Moins posts de Thomas, L2, L3 | Moins conseils | À pourvoir | Offre |
|---|---|---|---|---|---|
| 1a 12/10 au 18/10 | 12 | 5 | 0 | 7 | pool 40, reste 33 |
| 1b 19/10 au 15/11 | 46 | 4 | 6 (23/10, 06/11, 13/11) | 36 (42 si D2 non validée) | 33 + environ 5 hors lot + P0 (12 à 17) = 50 : marge 14 (8 si D2 non validée) ; lignes d'article notées en plus |
| 2a 16/11 au 06/12 | 34 | 0 | 4 | 30 | V1 = 34 |
| 2b 07/12 au 03/01 | 48 | 0 | 4 | 44 | V2 = 48 |
| 3a 04/01 au 17/01 | 24 | 0 | 4 | 20, dont 7 retours = 13 neuves | V3 = 20 |
| 3b à lot 5, 18/01 au 28/03 | 120 | 0 | 20 | 100 | retours des semaines 2 à 11 (environ 99) + V4 = 20 |

- **Production** (méthode s14 : candidats, 2 critiques à l'aveugle, départage, vérification « jamais entendue », insertion `isActive`, `copyVerdict = GARDER`, décryptage rempli). Volume = 1 / rendement, soit **environ 14 candidats par vanne visée**. Rendement `[HYPOTHÈSE : 7 % = 19 % (s14) x 37 % (41 sur 111) : déjà à la barre stricte]`.

| Vague | Cible | Pour | Candidats | Production | Livrée validée | Prêt du lot | Marge |
|---|---|---|---|---|---|---|---|
| **P0 pilote** | rendement mesuré | calibrage | **240** | 06/10 au 09/10 | ven. 09/10 | sans objet | sans objet |
| V1 | 34 (30 + 4) | 2a | environ 490 | 12/10 au 25/10 | lun. 26/10 | 02/11 | 7 j |
| V2 | 48 (44 + 4) | 2b | environ 690 | 27/10 au 12/11 | ven. 13/11 | 23/11 | 10 j |
| V3 | 20 (13 + 7) | 3a | environ 290 | 16/11 au 10/12 | ven. 11/12 | 21/12 | 10 j |
| V4 | 20 (marge) | lots 4 et 5 | environ 290 | 14/12 au 07/01 | ven. 08/01 | 18/01 | 10 j |
- **Total** : 122 vannes neuves (V1 à V4), plus environ 17 de P0 versées au pool ; environ 2 000 candidats lus. Vannes dans le pot unique avec le cycle mensuel du site : le social est servi d'abord `[À VÉRIFIER @copywriter : recouvrement]`.
- **Pilote : intervalle et décision.** 240 candidats à 7 % = 17 attendues, intervalle à 95 % de 3,8 % à 10,2 % ; **second point à mi-vague le 19/10** (cumul d'environ 485 candidats, plus ou moins 2,3 points). Seuil d'équilibre V1 : 34 / 490 = 6,9 %.

| Rendement P0 | Vannes | Décision (prise le 09/10 au soir) |
|---|---|---|
| **≥ 5 %** | ≥ 12 | Plan nominal ; candidats = cible / rendement mesuré, recalibrés au 19/10 et après chaque vague |
| **3 % à < 5 %** | 7 à 11 | Candidats V1 = 34 / rendement mesuré (jusqu'à 1 130) ; **S1 activé dès 2a** (§3) ; offre 1b 45 à 49 (marge 9 à 13) ; alerte de stock |
| **< 3 %** | < 7 | Problème de méthode, pas de volume : nouvelle consigne d'écriture, pilote 2 (120 candidats) du 12 au 14/10 ; **D8 à Thomas le 10/10** ; défaut écrit : mode 3/3/1 sur 2a et 2b |
- **Déclencheur de secours** : une vague livre moins de 90 % de sa cible 7 jours avant son prêt, ou stock du pool strict < 14 = S1 (§3).

## 3. Conseils en appoint (même volume total, calés sur Yanis et Sophie)
- **Règle** : 2 par semaine, **le vendredi** : X (post unique, 270 caractères au plus lien exclu, tutoiement, sans lien ni thread, situation puis réplique ou geste) et Instagram (2 cartes 4:5, légende « À envoyer à... » de 80 caractères). **Jamais sur LinkedIn** (déduit du choix du 05/05 : LinkedIn sans ton coach ni leçon). Chaque carte nomme sa technique en 4 mots au plus (sans elle, un conseil de 2 phrases n'est qu'une mini-vanne). Exceptions : 30/10, 27/11, 25/12, 01/01.
- **Volume** : 19 vendredis du 23/10 au 26/03 = **38 conseils**, repris du stock retenable de `audit-conseils-s14.md` (26 GARDER + 80 REECRIRE = 106 ; le « 88 validés » de la v2 n'y est pas tracé, abandonné `[À VÉRIFIER @copywriter 07/10]`), aucun rejoué. **Choix par note ET scénario** : note à l'aveugle ≥ 8,5 chez 2 relecteurs sur le format carte (même barre que D1) ; **au moins 24 en soirée, coloc, potes ou date (Yanis, X et IG)** et **au moins 14 en bureau ou afterwork (Sophie, X et IG)**. Le stock est à 69 % de bureau et la soirée n'y est qu'une poignée : le manque côté Yanis est comblé par la réécriture d'un REECRIRE à scénario Yanis (technique conservée, rien d'inventé), comptée au §4. **Mentions et citations d'humoristes gardées à la réécriture (P0 s15)** : seule une citation fausse ou inventée est corrigée, par une citation réelle sourcée. Marc : aucun conseil (relais d'article). Piliers v5 : vanne 4 sur 12 (33 %), conseil 2 (17 %).
- **Mesure** : les conseils sont **exclus de la médiane d'engagement** de `mesure.md` §4 (règle appliquée par défaut dès qu'il y a des conseils, hors C1) et suivis à part (médiane par réseau) : **11 par réseau à J+112** (15 vendredis du 23/10 au 29/01 moins 4 exceptions), lecture comparée au **bilan Q1 du 29/03 (19 par réseau)** ; le verdict de réseau repose sur les vannes et les relais.
- **Secours S1 (stock, jamais défaut de D2)** : si une vague livre moins de 90 % de sa cible, ou si le pilote est entre 3 % et 5 %, jusqu'à 3 conseils par semaine (le 3e sur X mardi) **tant que la réserve existe** : conseils à ≥ 8,5 restants après les 38, **68 au plus (106 moins 38), comptés le 07/10 `[À VÉRIFIER @copywriter]`** ; réserve épuisée, le post est omis. **S1 suppose D2 validée** : D2 sans réponse et stock < 14 = post omis ou mode 3/3/1 (§8) et relance de Thomas.
- **Livraison** : 3 étalons par @copywriter le 07/10, validés par Thomas le 08/10 ; cartes de 1b prêtes le 20/10.

## 4. Textes à produire : qui, combien, quand
| Texte | Volume | Produit par | Livré au plus tard |
|---|---|---|---|
| Note à l'aveugle des 14 vannes hors lot (≥ 8,5 chez 2) | 14 | 2 relecteurs | mer. 07/10 |
| Compilation des notes des lignes d'article (`-aveugle.md` vers `lignes-articles-notes.json`) | 19 articles Q4 (12 lundis, 7 jeudis) | @copywriter | 07/10 (semaines 1 à 5), 23/10 (le reste) |
| 2 formules de renvoi (X et LinkedIn ; IG « lien en bio »), relecture à l'aveugle, passage « méthode » vérifié par article (sinon « D'autres exemples : ») | 24 posts | 2 relecteurs + @copywriter | jeu. 08/10 |
| Fiches des 8 carrousels (R1 de V148 et V002) ; fiches Q1 avec chaque tranche | 8 ; 12 | @copywriter + relecteurs | 08/10 (04/11), le reste au prêt de la tranche |
| Légendes « À envoyer à... » des 11 relais IG ; puis environ 60 pour 2027 | 11 ; 60 | @copywriter | 08/10 ; avec chaque lot |
| Citations d'humoriste réelles et sourcées | 3 | @copywriter | 18/12, 15/01, 12/02 ; repli sans citation |
| **38 conseils** : sélection note + scénario, réécriture des REECRIRE à scénario Yanis, cartes X 19 et IG 19 | 38 | @copywriter + 2 relecteurs | 1b le 20/10 ; ensuite avec chaque tranche |
| **Réparties des articles** (200 candidats par article, 3 lignes visées, 2 relecteurs à l'aveugle) | Q1 : 12 articles = 2 400 ; Q2 : 5 articles = 1 000 | @copywriter + 2 relecteurs | Q1 avec les articles (09/11 au 04/12) ; Q2 du 15/02 au 12/03 |
| Correction des 3 vannes collées (`soiree-de-noel-entreprise-humour` n°5 et n°6, `etre-drole-sans-alcool-soiree` n°3), `import-article.ts --update` | 2 articles | @copywriter + @seo | ven. 23/10 |
LinkedIn : aucun texte neuf (L2 et L3 validés, le reste = vannes de bureau). Toute situation ajoutée passe par la barre des 2 relecteurs.

## 5. Chaîne de production
**Règle de prêt unique : un lot est prêt (inséré APPROVED, noté, contrôlé) 14 jours avant son premier post**, sauf 1a et 1b (relance du 05/10). Le code n'a plus de gel : une correction en base vaut jusqu'à 15 minutes avant la remise (§8).
| Lot | Posts | Lancement | Prêt | Marge | Dépend de |
|---|---|---|---|---|---|
| 1a | 12/10 au 18/10 (12) | 05/10 (dry-run fait) | ven. 09/10 | J-3, exception | `--pool` 07/10, 14 hors lot notées, marqueur `[repli:<id>]` (script du 07/10) |
| 1b | 19/10 au 15/11 (46) | 05/10 | mer. 14/10 | J-5, exception | étalons D2, notes de lignes 07/10, P0, marqueur `[repli:<id>]` |
| 2a | 16/11 au 06/12 (34) | lun. 19/10 | lun. 02/11 | 14 j | V1 (26/10), notes 23/10, 3 vannes collées corrigées, fiches |
| 2b | 07/12 au 03/01 (48) | lun. 02/11 | lun. 23/11 | 14 j | V2 (13/11), Noël, pivots, refonte 2027 vérifiée le 16/12 |
| 3a | 04/01 au 17/01 (24) | lun. 30/11 | lun. 21/12 | 14 j | V3 (11/12), articles Q1 insérés (11/12), citation 06/01 |
| 3b | 18/01 au 31/01 (24) | lun. 14/12 | lun. 04/01 | 14 j | verdict J+56 (§9) ; sinon 3/3/1 pour le réseau concerné |
| 4 | 01/02 au 28/02 (48) | lun. 04/01 | lun. 18/01 | 14 j | V4 (08/01), citation 03/02, J+84 |
| 5 | 01/03 au 28/03 (48) | lun. 01/02 | lun. 15/02 | 14 j | citation 03/03, J+112 |
| 6 (avril) | 29/03 au 02/05 | lun. 01/03 | lun. 15/03 | 14 j | articles Q2 (§6), pivot 01/04, heure d'été testée |
Couverture : 58 + 82 + 144 = 284 (1a+1b = 58, 2a+2b = 82, 3a+3b+4+5 = 144).
**Recette d'un lot** (sous-agents en parallèle) : (1) stock par date sur 90 jours (Neon HTTP, @fullstack) ; (2) `prepare-social-month.ts --lot --debut --fin --pool` en dry-run, **0 erreur bloquante** (tirets, gros mots, « je » hors « », 270 caractères X avec lien à 23, légende 80, LinkedIn 3 phrases, registre 90 jours) ; (3) textes neufs (§4) ; (4) relecture à l'aveugle : un texte sous 8,5 chez l'un des 2 est remplacé, jamais réécrit ; (5) @reviewer (conformité, humoristes cités), @qa (comptage par réseau et semaine, UTM, dimanches, heure de Paris en UTC), mesure du diff réel (P0 s11) ; (6) `--insert --driver=neon-http` en APPROVED (branche Neon d'abord pour le 1er lot), posts insérés = posts du dry-run ; (7) commit, ligne `REPLIT_ACTIONS.md`, 5 lignes à Thomas ; (8) un réseau en pause n'est rouvert qu'après les contrôles 1 à 6.

## 6. Dépendance au blog
- **État** : lundis programmés jusqu'au 28/12, jeudis jusqu'au 03/12, puis 25/02, 22/04, 13/05, 03/06. Génération IA coupée : tout article 2027 est écrit en session.
- **Q1 2027 (D3)** : 12 lundis du 04/01 au 22/03 plus celui du 25/02. @seo livre `docs/seo/calendrier-editorial-q1-2027.md` **lun. 02/11** (mots-clés distincts, maillage, cannibalisation, Saint-Valentin 08/02 `[HYPOTHÈSE]`) avec une **grille de thèmes par persona `[HYPOTHÈSE]` : 5 articles Yanis (répartie, soirée, coloc), 4 Sophie (bureau, afterwork), 3 Marc (confiance, reprise)** ; @copywriter produit du 09/11 au 04/12 ; insertion `isPublished=false` par `import-article.ts` **avant ven. 11/12**, `publishedAt` = le lundi de publication. **Mécanisme** : la publication se fait au tick de 15 min (`publishDueScheduledArticles`, doublon : cron `weekly-seo` du lundi 05:00 UTC), borné à la semaine ISO : un article dont le `publishedAt` n'est pas dans la semaine ISO du tick ne se publie jamais ; **test d'insertion le 11/12** (date = lundi, semaine ISO, `isPublished=false`).
- **Q2 2027 (D3 étendue)** : un lundi par semaine du 29/03 au 21/06 (13). Le lot 6 a 5 lundis (29/03, 05/04, 12/04, 19/04, 26/04) : @seo livre le calendrier Q2 (même grille persona) **lun. 15/02**, @copywriter produit du 15/02 au 12/03, insertion avant **ven. 12/03**. **Défaut** : sans calendrier au 15/02, les lundis d'avril sont relayés par une vanne du pool, sans renvoi.
- **Lignes** : cible 3 lignes notées au niveau par article (≥ 8,5 chez 2 : lundi X, lundi IG, jeudi X), plancher 2 (lundi). Rendement des réparties `[HYPOTHÈSE : 1,5 % = 4 % (production-trimestrielle, barre s14) x 37 %]`, donc **200 candidats par article** pour 3 attendues : 2 400 pour Q1, 1 000 pour les 5 articles Q2 (§4). Sans 3e ligne, le jeudi X prend une vanne du pool. Pas de relais du jeudi avant le 22/10. **Articles du jeudi 25/02 et 22/04 : aucune ligne budgétée, pas de relais, le créneau est une vanne du pool.**
- **Jeudi 2027** : X relaie une 2e ligne de l'article du lundi (moins de 7 jours, lien autorisé) ; IG jeudi = carte vanne sans lien ; LinkedIn mardi relaie l'article du lundi si l'angle est le travail. Semaine 13 : article du 04/01.
- **Article en retard ou absent : repli, même créneau, sans décalage** (§7). 17 relais portent déjà une vanne : le repli est cette vanne sans renvoi (aucun stock en plus) ; 7 portent une ligne d'article : une vanne du même thème est réservée jusqu'à la date du relais, puis rendue au pool si inutilisée. Avant la garde (16/10), la session vérifie à la main que l'article répond 200, 1 h avant tout relais du 12 au 15/10. Refonte 2027 de `meilleures-blagues-droles-2026` du 15 au 20/12, vérifiée le 16/12 ; sinon le pivot X du 17/12 devient vanne simple.

## 7. Fiabilité : code, déploiements, reprise (dates)
**Règle de déploiement unique** : la session déploie (`build:cf` puis `deploy:cf`), sous le GO du 05/10, **avant les tests de Thomas et avant la reprise de chaque réseau** ; **chaque déploiement livre HEAD vert** (tsc, lint, build, Jest 100 %), consigné dans `REPLIT_ACTIONS.md`. Le code de fiabilité de @fullstack passe 330/330 en local (05/10, `build` non lancé, non commité) : **les dates du 10/10, 16/10 et 23/10 sont des butoirs au plus tard** ; tout livrable déjà dans un HEAD vert part le 08/10.
| Date | Livrable | Qui | Preuve ou test |
|---|---|---|---|
| mer. 07/10 | **Branche Neon** (réplique de la base) créée par la session via l'API Neon `[À VÉRIFIER accès]`, sinon par Thomas (5 min, hors total §10) | session | URL consignée, insertion d'essai |
| mer. 07/10 | `prepare-social-month.ts` : `--debut`, `--fin`, `--pool` (règles §2), `--lot`, `--rollback --lot <id> --confirmer` (APPROVED futurs en REJECTED, comptage avant et après) ; contrôle après insertion par réseau et par semaine ; marqueurs `[date:…]` (relais, pivots, Noël ; `reprendre()` les rejette quel que soit le retard) et **`[repli:<id>]` (posé par le lot, 1a et 1b compris)** | @fullstack | Jest ; dry-run de 1a et 1b ; insertion `neon-http` sur la branche |
| mer. 07/10 | **Secrets des routines posés par Thomas AVANT le test** (10 min, lecture seule si possible), puis **test par la session principale** sur 4 critères : lecture Neon HTTP, lecture `channels` Buffer, issue créée, commit poussé ; résultat consigné dans `REPLIT_ACTIONS.md` | Thomas puis session | réussi : routines = déclencheur d'appoint ; échec : Worker seul (§8) ; piste @fullstack : le Worker crée une issue GitHub qui lance Claude Code `[À VÉRIFIER]` |
| jeu. 08/10 | **Contrôle puis déploiement 1** : (a) `SELECT` de `SocialPlatformSetting` (3 lignes, en pause) avant `deploy:cf` ; (b) **HEAD seulement si tsc, lint, build et Jest sont 100 % verts**, sinon `9ca796e` seul (cherry-pick) ; HEAD contient le correctif X 270, la garde, `reprendre()`, la couverture, la pause après 2 FAILED ; (c) `channels` relu (3 canaux connectés) | session | `git show <branche déployée>:apps/web/src/app/api/cron/publish-social/route.ts` contient `longueurX` ; `wrangler deployments list`, version précédente `108da3e7` consignée ; brouillons Buffer réels (`saveToDraft` puis suppression) : X le plus long avec lien, LinkedIn |
| ven. 09/10 au sam. 10/10 10:00 | `reprendre()` corrigé (« sauter » : REJECTED des posts échus depuis plus de 24 h, des relais, des posts `[date:…]`, jamais un jour de silence, heure de Paris ; 503 si Buffer injoignable) s'il n'est pas déjà dans HEAD ; `/liens` 3 routes (`/liens`, `/liens/x`, `/liens/li`) **dans l'ordre des blocs de la v5 §2** (1 l'article publié depuis moins de 48 h, sinon le quiz ; 2 l'autre ; 3 vanne du jour ; 4 `bio-parcours` Répartie ; 5 vannes ; 6 conseils), `origine` et `contenu`, e-mail avant Google | @fullstack | tests de non-régression (critère de commit) ; test d'événement Umami |
| **sam. 10/10 12:00** | **Déploiement 2** : HEAD vert (`reprendre()`, `/liens`, `origine`, e-mail avant Google) | session | mêmes preuves de version déployée qu'au 08/10 ; **les tests C2 et C3 de Thomas ne portent que sur du code en ligne** |
| ven. 16/10 | **Butoir déploiement 3** (sans objet si déjà livré le 08/10) : garde `articleSlug` dans `publish-social` : relais remis seulement si l'article est publié (lecture en base) ; sinon **repli sur le même créneau, sans décalage** (vanne du même thème sans lien posée par `[repli:<id>]`, portée au registre des 90 jours) ; tous réseaux (IG 19:30 compris) ; clé d'alerte `social-echec-<réseau>` | @fullstack | simulation d'un article absent : créneau tenu par le repli, pas de double post, pas de dimanche |
| ven. 23/10 | **Butoir déploiement 4** : job de couverture quotidien : `LOTS_SOCIAUX` = les 9 tranches du §5 ; lot non prêt = posts insérés < prévus par réseau à J-14 ; dernier APPROVED < 10 jours ; **stock du pool strict < 14 (global)** ; **pause automatique après 2 FAILED consécutifs** ; e-mail `ADMIN_EMAIL` avec le prompt de relance ; e-mail de lancement de lot ; **dates des vagues (27/10, 16/11, 14/12) et des jalons dans `social-calendrier.ts` (jalons mis à jour par la session à chaque J0 inscrit au registre), e-mail avec consigne ; consigne d'écriture de `releves/AAAA-MM-JJ.md` dans l'e-mail du lundi** ; `CONSIGNE_RELANCE_LOT` aux sections de cette v4 | @fullstack | simulation de chaque alerte ; un test par type d'e-mail (lot, vague, jalon, relevé) |
| lun. 26/10 | Heure d'hiver du 25/10 de bout en bout | session | `sentAt` Buffer : X 11:30 UTC, IG 18:30 UTC, LinkedIn mar. 27/10 07:15 UTC, y compris un post replanifié |
**Critère de commit (@qa)** : tsc, lint, `build` et Jest 100 % (dont `platform-switch.test.ts`) avant tout commit, ligne `REPLIT_ACTIONS.md` s15 (garde, job de couverture, marqueurs, `--rollback`, aucune migration) ; tests neufs : `couverture`, `garde-article` (repli, dimanche, jour occupé), `heure-paris`, `sauterAvantJ0`, **`annulerLot` et `--rollback` (sans `--confirmer` : 0 modification ; avec : APPROVED du lot en REJECTED, replis et autres lots intacts)**, règle « autre réseau » du pool, stock sur le pool strict, silences 11/11 et 27/11, 25/10 et 28/03, 2 FAILED puis pause, tranche partielle signalée.
**Reprise (J0 = lun. 12/10 pour les trois réseaux `[HYPOTHÈSE]`)**
| Étape | Date | Qui | Condition ou contrôle |
|---|---|---|---|
| Tests C2 (e-mail dans X, Instagram, LinkedIn ; Safari et Chrome) et liens de bio, **sur le code déployé le 10/10**, plus **baseline** (captures natives d'abonnés des 3 réseaux, `mesure.md` §2) | sam. 10/10 13:00 à dim. 11/10 12:00 (butoir unique) | Thomas, 15 min + 3 min | l'inscription e-mail aboutit dans l'application ; Google désactivé seulement si l'échec est reproduit ; baseline attendue 0 (la session relève Google, Umami et la base) |
| Lot 1a inséré, 3 canaux Buffer | ven. 09/10 | session | écart prévu/inséré = 0 ; 3 canaux connectés (API, 05/10), relus le 09/10 |
| **GO/NO-GO** | dim. 11/10 18:00 | session | **C1** = 9 étalons et seuils J+28 et J+56 de `mesure.md` §4 validés par Thomas (J+84 et J+112 hors C1) ; **C2** = e-mail avant Google en navigateur intégré en ligne et test dans l'application du réseau ; **C3** = `/liens` 3 routes en ligne ; **C4** = LinkedIn débloqué dans le code et statut réel Buffer relu ; X = C1+C2, Instagram = C1+C2+C3, LinkedIn = C1+C2+C4 ; plus correctif X 270 prouvé en ligne et lot 1a en base ; sinon J0 = 19/10 pour le réseau concerné |
| Reprise LinkedIn, X, Instagram (C3 obligatoire) | dim. 11/10 20:00, 20:15, 20:30 | session (interrupteur admin) | 1er post : LinkedIn mar. 13/10 08:15, X lun. 12/10 12:30, IG lun. 12/10 19:30 |
| Vérification H+45 | 12/10 13:15 (X), 12/10 20:15 (IG), 13/10 09:00 (LinkedIn) | session seule (Thomas : facultatif) | statut `sent`, lien réel, UTM, carrousel à 2 images avec texte alternatif, aucun lien IG |
Un 1er post en échec donne FAILED et une alerte : la session met le réseau en pause tout de suite (automatique après 2 FAILED dès que le job est déployé, butoir 23/10), corrige, reprend après nouveau contrôle.

## 8. Exploitation et incidents
- **Remise Buffer** : le cron prend les posts échus, 1 par réseau et par passage de 15 min, `dueAt` = maintenant + 2 min : la file Buffer contient 0 ou 1 post. Plafond de 10, gel de 14 jours et suppression chez Buffer sont **sans objet** ; le stock est la base (`mesure.md` §3 aligné).
- **Alertes** (e-mail `ADMIN_EMAIL`, 1 par jour, par réseau et par type, dès leur déploiement, butoir 16/10) : échec Buffer, canal déconnecté (pause automatique), prévu ≠ publié (rapport du lundi), file basse, lot en retard, stock du pool strict < 14 (global), 2 FAILED.
- **Démarrages de session (tous comptés)** : le Worker est le filet principal ; les routines ne sont qu'un exécutant d'appoint si leur test du 07/10 réussit.
| Démarrage | Nb | Dates | Déclencheur | Secours |
|---|---|---|---|---|
| Lancements de lot et vagues V1 à V4 | 11 | lots : 19/10, 02/11, 30/11, 14/12, 04/01, 01/02, 01/03 ; vagues : 12/10 (session principale), 27/10, 16/11, 14/12 | routine, ou e-mail du Worker (dates de vague codées au 23/10) | Thomas colle le prompt (2 min) |
| Fiche de jalon | 5 | dimanche avant chaque jalon (§9) | idem | idem |
| Relevé du lundi | 24 | lundis | e-mail du Worker avec consigne de relevé ; Thomas colle ses chiffres natifs (compris dans ses 10 min) | idem |
| Déploiements butoirs et calendrier Q2 | 3 | 16/10, 23/10 (sans objet si livrés le 08/10, comptés en pire cas), 15/02 | 16/10 et 23/10 : session principale ou prompt ; 15/02 : e-mail du Worker | idem |
Les autres travaux (articles Q1 et Q2, citations, refonte, fiches Q1, GO/NO-GO, reprises, H+45, déploiement du 08/10 et du 10/10) sont enchaînés dans ces sessions ou dans la session principale en cours jusqu'au 13/10 : aucun démarrage propre.
- **Buffer se déconnecte** : pause automatique + e-mail ; Thomas reconnecte (3 min) ; la session relit `channels` par l'API, relance `reprendre()` (relais et posts datés rejetés, le reste replanifié 1 par jour hors silences et dimanches).
- **Lot non prêt à J-3** : mode 3/3/1 avec les seuls posts notés ; sinon le réseau se vide proprement. **Heure d'été dim. 28/03/2027** : testée dans le lot 6 (lun. 29/03 12:30 = 10:30 UTC).
- **Retour arrière** : pause par réseau (admin), `--rollback --lot <id> --confirmer`, `wrangler rollback` vers `108da3e7`. **Avant tout `wrangler rollback` : pause des 3 réseaux**, puis reprise seulement sur un Worker qui contient la garde. `108da3e7` fait perdre : la garde `articleSlug` et le repli (les relais d'un article absent repartent), la limite X 270 (posts X avec lien en FAILED), les marqueurs `[date:]` et `[repli:]`, la reprise corrigée, la couverture, la pause après 2 FAILED, les clés d'alerte par réseau ; la base n'est pas touchée (lots APPROVED conservés). Un post déjà publié se retire dans l'application du réseau (Thomas, 2 min, seul cas).
## 9. Pilotage
**Jalons par réseau** (`mesure.md` §2, jugé depuis son J0), table de glissement (lundis) :
| J0 | J+14 | J+28 | J+56 | J+84 | J+112 |
|---|---|---|---|---|---|
| 12/10 | 26/10 | 09/11 | 07/12 | 04/01 | 01/02 |
| 19/10 | 02/11 | 16/11 | 14/12 | 11/01 | 08/02 |
| 26/10 | 09/11 | 23/11 | 21/12 | 18/01 | 15/02 |
| 02/11 | 16/11 | 30/11 | 28/12 | 25/01 | 22/02 |
| 09/11 | 23/11 | 07/12 | 04/01 | 01/02 | 01/03 |
- **Glissement** : le J+56 d'un réseau tombe au plus tard le **04/01** (J0 au plus tard le 09/11) pour précéder la tranche 3b ; au-delà, 3b de ce réseau est insérée à 3/3/1 et relancée à 5/5/2 au verdict. J+84 et J+112 précèdent les lots 4 et 5 (prêts 18/01 et 15/02) si J0 ≤ 26/10 ; sinon le lot part sur le dernier verdict. Chaque jalon : fiche d'une page préparée le dimanche (session, §8), Thomas répond « ok » ou choisit. Bilan Q1 : lun. 29/03.
- **Seuils J+84 et J+112** (`mesure.md` §4, `[HYPOTHÈSE]` validée avec D6, hors C1) : décisions d'ajustement des lots seulement ; la pause reste réservée à J+28 et J+56.
- **Lecture corrigée du stock** : la fiche joint la note moyenne des posts du réseau (J+28 juge les 41 meilleures, J+56 les vannes V1) : un recul avec note moyenne en baisse est un effet de stock. Visites rapportées au nombre de lundis avec article. **Conseils exclus de la médiane** (§3).
- **Relevé du lundi** (e-mail du Worker, §8) écrit `docs/social/releves/AAAA-MM-JJ.md` : prévu/publié et statut Buffer, FAILED, couverture en jours, stock éligible, visites Umami par `utm_source`, entonnoir par `origine`, référents `t.co`, `l.instagram.com`, `lnkd.in`. Natifs : D6.
- **Ajustements** : règle v5 (2 mesures sur 3 = maintien ; 3 sous l'échec aux 2 jalons = pause) ; stock < 14 ou vague < 90 % = S1 ; 2 semaines de suite prévu ≠ publié = pause du réseau (**décidée par la session au relevé du lundi**).
## 10. Charge de Thomas (exhaustive, hors incident)
| Quand | Quoi | Durée |
|---|---|---|
| 06/10 à 08/10 | Répondre à D2, D3, D4, D6, D7 (5 min), valider 3 étalons conseil (10 min), poser les secrets des routines sur son compte avant le test du 07/10 (10 min) | 25 min |
| sam. 10/10 13:00 à dim. 11/10 12:00 | Tests C2 sur téléphone (3 applications), liens de bio, baseline (captures natives d'abonnés des 3 réseaux, 3 min) | 18 min |
| chaque lundi, 24 semaines | Relevé natif des 3 réseaux (D6) | 24 x 10 = 240 min |
| 5 jalons (réseaux regroupés) | Répondre à la fiche de décision | 5 x 5 = 25 min |
| livraisons V1 à V4 | Échantillon de 10 vannes (D7) | 4 x 5 = 20 min |
| si routines non retenues | Coller le prompt (7 lots, 4 vagues, 5 fiches, 3 déploiements ou calendriers) | 19 x 2 = 38 min |
| lun. 29/03 | Bilan Q1 | 20 min |
| jours ouvrés, 24 semaines (D4, défaut v5) | Réponses aux commentaires, 5 min par jour (plafond v5 : 15) | 120 x 5 = 600 min |
**Total : hors réponses 386 min (6 h 26) ; avec réponses 986 min (16 h 26), soit environ 41 min par semaine** ; pire cas (routines non retenues, réponses au plafond de 15 min) 386 + 1 800 = 2 186 min, soit 91 min par semaine, sous le plafond de 105 min de `mesure.md`. Hors total : D8 si déclenchée (5 min), branche Neon si l'API échoue (5 min), baseline d'un réseau dont le J0 glisse (3 min), regarder le 1er post de chaque réseau (facultatif). Déploiements, lots, reprise, vérification Buffer, relevé Umami : session. Aucune action Replit.
## 11. Risques
| # | Risque | P | I | Prévention | Plan B |
|---|---|---|---|---|---|
| R1 | Stock de vannes au niveau insuffisant | Élevée | Élevé | pool 40 + 14 notées + P0, V1 à V4, seuils du pilote (§2), point du 19/10, alerte sur le pool strict | S1, puis post omis ; D8 |
| R2 | Routines absentes ou sans secrets | Moyenne | Moyen | secrets avant le test, Worker principal (23/10) | Thomas colle le prompt (38 min comptées) |
| R3 | Article en retard ou absent | Moyenne | Moyen | garde du 16/10 (butoir), `[repli:<id>]` posé au lot | vanne du même thème, même créneau |
| R4 | Buffer déconnecté | Moyenne | Moyen | pause automatique, `reprendre()` corrigé, 3 canaux connectés (API, 05/10) | reconnexion Thomas (3 min) |
| R5 | Charge de relecture (environ 2 000 candidats de vannes, 3 400 de réparties) | Élevée | Moyen | sessions parallèles échelonnées du 06/10 au 12/03, recalibrage après P0 et à mi-vague | plancher de 2 lignes par article |
| R6 | Bug de publication (X 270, heure d'hiver, LinkedIn muet depuis août) | Moyenne | Élevé | correctif prouvé le 08/10, brouillons réels, H+45, test du 26/10 | pause des 3 réseaux, puis `wrangler rollback` (§8) |
| R7 | C2 ou C3 non réunis le 11/10 12:00 | Moyenne | Moyen | code en ligne le 10/10 avant les tests | J0 = 19/10 pour le réseau |
| R8 | Notes des relecteurs instables ; vanne revue à 90 jours | Moyenne | Moyen | barre ≥ 8,5 chez 2, retour sur un autre réseau | rotation, V4 |
| R9 | Audience nulle à J+28 | Moyenne | Élevé | seuils par réseau, contrôle J+14 | cadence réduite, réallocation SEO |
| R10 | Contenu contraire aux choix fondateur (mention IA, tiret, humoriste inventé) | Faible | Élevé | @reviewer à chaque lot, citation sourcée | retrait dans l'application (Thomas) |
| R11 | Session sans accès Neon HTTP ou Buffer | Faible | Élevé | `--driver=neon-http`, branche Neon créée le 07/10 | report du lot, alerte de couverture |
## 12. Hypothèses et handoff
`[HYPOTHÈSE]` : J0 identique pour les 3 réseaux ; rendement vannes 7 % et réparties 1,5 % ; routines disponibles ; un article par lundi (Q1 et Q2) ; 14 hors lot non notées comptées à environ 5 ; thèmes Q1 et Q2 par persona ; seuils J+84 et J+112 ; accès API Neon.
**Handoff → @orchestrator** : @fullstack (§7 aux dates et butoirs, critère de commit, pool strict lisible par le Worker), @copywriter (P0, V1 à V4, notes, fiches, citations, étalons E2/E4/E7 et sélection des 38 conseils), @seo (calendriers Q1 le 02/11 et Q2 le 15/02), @reviewer et @qa (contrôles de lot), @social (cartes conseil), @data-analyst (historique natif, D6). Points d'attention : HEAD vert à chaque déploiement, ordre de `/liens` = v5, pilote P0 à 240 candidats avec seuils 5 % et 3 %, repli sans décalage, 122 vannes neuves, Worker = filet principal.
## Réponse aux notateurs, cycle 3 (cycles 1 et 2 soldés en v2 et v3) : toutes les corrections sont faites
- **@reviewer E1a** conseils à J+112 : 11 par réseau, lecture au bilan Q1 du 29/03 (19) : **faite** (§3, `mesure.md` §4).
- **@reviewer E1b** réserve S1 = conseils ≥ 8,5 restants après les 38, 68 au plus, `[À VÉRIFIER 07/10]` : **faite** (§3).
- **@reviewer E2a** démarrages du 16/10, 23/10 et 15/02 ajoutés, 19 x 2 = 38 min : **faite** (§8, §10).
- **@reviewer E2b** marqueur `[repli:<id>]` dans le script du 07/10, 1a et 1b compris : **faite** (§5, §7).
- **@reviewer E3** ligne des réparties (Q1 2 400, Q2 1 000) au §4 : **faite**.
- **@reviewer E4a** étalon E1 remplacé par E7 (étalons du 30/09 : E2, E3, E4, E6, E7) : **faite** (§0).
- **@reviewer E4b** mentions et citations d'humoristes gardées à la réécriture des conseils : **faite** (§3).
- **@reviewer E4c** ordre de `/liens` = v5 §2 (parcours 4e), `bio-parcours` en tête abandonné (aussi @growth G4) : **faite** (§7, §12).
- **@reviewer E5a** Instagram retiré de §7, §10 et R4, totaux recalculés : **faite** (386, 986, 2 186 min : 377 du notateur + 6 min de démarrages + 3 min de baseline).
- **@reviewer E5b** branche Neon en « hors total » : **faite** (§10).
- **@reviewer E6a** « Instagram connecté (API 05/10), relu par la session le 09/10 » : **faite** (§7).
- **@reviewer E6b** « jamais sur LinkedIn » = déduit du choix du 05/05 : **faite** (§3).
- **@reviewer E6c** C1 = seuils J+28 et J+56, J+84 et J+112 hors C1 : **faite** (§0 D6, `mesure.md` §2 et §4).
- **@qa F1a** faits périmés retirés (Instagram, « 2 tests échouent » remplacé par 330/330 local) : **faite** (§7).
- **@qa F1b** HEAD vert à chaque déploiement, 10/10, 16/10 et 23/10 = butoirs, « automatique dès le 23/10 » corrigé : **faite** (§7, §8).
- **@qa F1c** C1 à C4 définis dans le GO/NO-GO : **faite** (§7).
- **@qa F1d** `SELECT` de `SocialPlatformSetting` avant `deploy:cf` : **faite** (§7).
- **@qa F2** stock global calculé sur le pool strict, liste d'identifiants lisible par le Worker : **faite** (§2, §7).
- **@qa F3** dates des vagues, jalons et consigne du relevé construites au plus tard le 23/10, un test par type : **faite** (§7, §8).
- **@qa F4** `wrangler rollback` : pause des 3 réseaux d'abord, pertes de `108da3e7` écrites ; règle « autre réseau » codée et testée : **faite** (§2, §8).
- **@qa F2c** pause après 2 semaines prévu ≠ publié : session, au relevé du lundi : **faite** (§9).
- **@qa F5** test `annulerLot`, `build` vert avant commit, ligne `REPLIT_ACTIONS.md` : **faite** (§7).
- **@growth G1a** C1 bornée, J+84, J+112 et exclusion des conseils par défaut sans bloquer J0 : **faite** (§0, §3, `mesure.md`).
- **@growth G1b** baseline du 11/10 au §10 (3 min) : **faite**.
- **@growth G2a** 19 articles Q4 (12 lundis, 7 jeudis) partout : **faite** (§1, §4).
- **@growth G2b** Q2 du 29/03 au 21/06 (13 lundis) : **faite** (§0, §6).
- **@growth G2c** articles du 25/02 et du 22/04 : pas de relais, vanne du pool : **faite** (§6).
- **@growth G2d** publication au tick de 15 min, `publishedAt` dans la semaine ISO, test du 11/12 : **faite** (§6).
- **@growth G3** réserve S1 non tracée : `[À VÉRIFIER]`, 68 au plus : **faite** (§3).
