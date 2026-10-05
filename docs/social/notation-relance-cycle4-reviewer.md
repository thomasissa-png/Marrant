# Notation indépendante, cycle 4 : relance des 3 réseaux (s15, 05/10/2026, @reviewer)

Objet noté : `docs/social/strategie-relance-v4.md` (V4:ligne), au regard de ma notation du cycle 3 (C3:ligne), du plan (`plan-relance-s15.md`, règles d'étalonnage), de `founder-preferences.md` (FP:ligne), des personas (`project-context.md` PC:20-24), du catalogue (CV:ligne), des articles (S1, S2, S5, S9, S11, A1, A3, A4), de `relecture-aveugle-cycle3.md` (RA3:ligne) et du code (quiz, directeur), tous ouverts. Barre : 10 = publiable tel quel. Drôlerie hors périmètre. R6 tranchée par la session principale : seule son application est vérifiée.

## 1. Corrections du cycle 3 : vérification

| Correction C3 | Statut | Preuve |
|---|---|---|
| K1 (a) renvoi selon la catégorie | Appliquée, juste : S2 PRATIQUE (S2:17, « pas de phrases à recopier » S2:34), A1 CATALOGUE (A1:16, « à copier-coller » A1:11) | V4:29 |
| K1 (b) Halloween, (c) gates du directeur, (d) « reviewer 7 à 10 », (e) humoriste le 28/10 | Appliquées | V4:29, V4:63, V4:160, V4:30 |
| K2 T1 guillemets | Appliquée par R6 sur les 9 posts, cartes comprises, inner “ ” conforme à FP:50 | V4:119-153, V4:165 |
| IG1 légende « binôme » refusée | Recevable : la vanne a changé (tuteur, RA3:39), la légende suit | V4:136 |
| IG2 légende, IG3 cartes 3 et 4 | Appliquées ; quiz gardé et relié à l'exercice : recevable (entrée sans compte du funnel) | V4:140, V4:144-145 |
| L2, L3 « 10 » refusés | Recevables (aveugle G 8, RA3:22-23), réécrits | V4:153, V4:156 |
| K5 (a) Noël, (b) 22/10 n°6 seule, (d) 4 liens semaine du 26/10 | Appliquées | V4:33, V4:74, V4:54 |
| Ajouts R1, R3, R4 | Appliqués | V4:160-163 |

Contrôles refaits : 18 identifiants présents mot pour mot dans CV ; X relais 12/10 = accroche 2 (S2:84), IG2 = accroche 3 (S2:94), lignes distinctes ; X3 = 247 caractères (lien 23) ; IG2 légende 79 ; IG3 légende 76 ; « 5 profils », « Observateur », « Environ 2 minutes », « sans inscription » (`quiz-humour/page.tsx:38, 43, 48`) ; sommes §4 justes (190/50, 480/135, 50/10, 125/25 ; 10 000 / 52 = 192 par semaine, 3,2 fois 60) ; 2/16 = 12,5 % ; jours de semaine recalculés (24/12 jeudi, 01/01 vendredi, 27/11 Black Friday) ; Buffer gratuit = 10 posts programmés par canal (source externe) ; « lien en bio. » passe l'anti-bait G-S16 (« lien en bio ! » seul visé, `standup-director-agent.ts:2139-2146`) ; 0 tiret cadratin, 0 émoji, 0 hashtag (Grep).

## 2. Notes

| Critère | Note | Preuve | Correction précise |
|---|---|---|---|
| K1 Stratégie | 9 | Rôles, personas (Sophie seule sur LinkedIn, PC:23), J0 par réseau, plafond Buffer, sommes : justes. 1 défaut de fond : **R1 se contredit** (V4:160) : « 8 et plus pour entrer dans le lot » puis « les vannes à moins de 8 (...) sont tirées en dernier », donc admises. Le stock (V4:33, « 91 sur 125 ») suppose les 125 éligibles : le nombre réel de vannes à 8 et plus n'est écrit nulle part. | V4:160 : « Sous 8 : hors tirage (jamais retirées du site). » V4:33 : « stock éligible = N vannes notées 8 et plus `[À COMPTER par @copywriter avant le lot 1]` » ; si N sur 13 semaines < 91, l'apport de 30 vannes neuves par mois est la seule marge, l'écrire. |
| K2 X1 Alexa | 10 | CV:10, R6, une seule date, plancher FP:33. | Aucune. |
| K2 X2 Sœur | 10 | CV:155, “pardonné” imbriqué, « 21 messages » (A1:10), « prêts à copier » vrai (A1:11, A1:196), UTM complets. | Aucune. |
| K2 X3 Voisin + quiz | 10 | CV:44, bloc 2 = réécriture A (RA3:32) avec « environ » conforme à la page, 247 caractères. | Aucune. |
| K2 IG1 Tuteur | 9,5 | CV:97, remplaçante sourcée (RA3:39), légende R3 conforme. Chiffre faux : légende annoncée « 49 caractères », elle en fait 51 (32 + pied de 19). | V4:136 : « 51 caractères ». |
| K2 IG2 Mimes | 10 | S2:94 = CV:145, « Les 4 autres exemples » exact (5 accroches), légende 79, n'invite pas à réciter (R3). | Aucune. |
| K2 IG3 Maxime | 9,5 | CV:120, fiche V206 (`decryptage-ecrit-2.json:21-22`), carte 3 en une phrase. Carte 3 « on parle de Maxime » et carte 4 « où l'on parle » : ce « on » désigne le groupe, alors que R6 pose « « on » = la marque » (V4:165). Le post respecte le choix fondateur, pas la lettre de R6. | Corriger R6 (voir §4), sans toucher IG3. À défaut, carte 3 : « le groupe parle de Maxime... ». |
| K2 L1 Canapé | 10 | CV:94, 3 phrases, bureau. | Aucune sur le post ; voir T2. |
| K2 L2 Deux minutes | 10 | 3 phrases, tutoiement, logique juste, repli CV:19 entre « ». | Aucune (second relecteur prévu, FP:28). |
| K2 L3 Relais S2 | 10 | 2 phrases de scène, renvoi de 13 mots, « trois mots » exact, « formule » présente dans l'article (S2:34), lien en corps. | Aucune. |
| K5 Calendrier | 8,5 | Lignes fixées distinctes, Noël tenu, Halloween conforme (S1:15, X n°3 = S1:58-60, IG `cs14jk1bc86d3502a2cef27b` hors S1). 5 défauts. (a) **Motif « pain » à 25 jours** : 30/11 `cs14jk02047ed5635bab6a52` (CV:43) et 25/12 IG `cs14jkffeab1620070f2263e` (CV:168), contre « 30 jours d'écart au moins » (V4:110) ; la 3e (`cs14jke956e7ca02641e25c5`, CV:98) est dans S5, relais tiré le 02/11 (28 jours avant le 30/11), et le script n'applique pas cette règle (V4:33). (b) **17/12 hors exception** : `meilleures-blagues-droles-2026` est une page ancienne (FP:28, FP:51), relayée « avec lien » alors que la liste fermée (V4:29) ne contient pas le 17/12 ; la bio mènerait au quiz (bloc article = publié depuis moins de 48 h, V4:57), « lien en bio » serait faux ; la refonte court du 15 au 20/12 (FP:51). (c) Semaine du 28/12 : 4 liens X (28/12, 30/12, 31/12, 01/01), non déclarés (V4:54). (d) 31/12 « relais vœux » dans la colonne X + IG (V4:84) alors qu'Instagram est exclu de l'exception ; 04/01 « vœux repris » ambigu (même ligne que le 01/01 ?). (e) Liste de Noël : la n°18 de A4 est `cs14jkee5c537f7286c1da98` (A4:33 F5 = n°18, A4:122) : 4 vannes, pas 5. | (a) 30/11 : les 2 vannes neuves de S9 (8 et plus) en X et IG, `cs14jk02047ed5635bab6a52` repoussée après le 24/01 ; script : « motifs répétés (pain : CV:43, 98, 168) espacés de 30 jours tous réseaux ». (b) V4:29 : ajouter « X 17/12 (republication 2027), si la refonte est en ligne, sinon vanne » ; IG 17/12 : carte vanne sans « lien en bio ». (c) V4:54 : « 4 les semaines du 26/10 et du 28/12 ». (d) V4:84 : « IG 31/12 : carte vanne sans lien » ; « 04/01 : une ligne de l'article jamais postée ». (e) V4:33 : « `cs14jkee5c537f7286c1da98` (= n°18 de `blagues-de-couple-drole`) ». |
| K9 Conformité | 10 | 0 tiret cadratin, 0 émoji, IA seulement sujet (FP:34), X simple (FP:16), LinkedIn 3 phrases tutoyées (FP:17), aucun prix, compte = marque avec R6 (FP:15), humoristes autorisés avec citation réelle (FP:54), R6 non rejouée par moi. | Aucune. |

Moyenne K2 : 9,9 (89/90). T2 (transverse, justesse) : V4:116 dit « X1 et L1 y sont (9) » puis classe le canapé (= L1) à 8,5 ; RA3:21 donne L1 D 8,5, G 9. Correction : « En drôlerie (colonne D), seul X1 est à 9 ; canapé, mimes, tuteur, sœur 8,5 ; voisin, Maxime 8. »

## 3. Passe de contrôle : défauts créés par les correctifs

1. **Pain à 25 jours** : né de ma correction C3 K5 (a), qui plaçait `cs14jk02047ed5635bab6a52` le 30/11 sans voir la vanne pain du 25/12. Défaut de mon fait.
2. **Liste fermée d'exceptions** (ma correction K1 b) : elle a figé Halloween et les vœux, mais pas le relais de refonte du 17/12.
3. **« 4 la semaine d'Halloween »** (ma correction K5 d) : formulée en cas unique, la semaine du 28/12 a le même profil.
4. **R6 et le « on »** : la parenthèse « « on » = la marque » contredit la carte 3 d'IG3, réécrite au même cycle.
5. **R1 complétée** (« 8 et plus pour entrer ») sans retirer la phrase « tirées en dernier » : deux règles opposées dans la même puce.
6. **22/10 LinkedIn, n°6 seule** (ma correction K5 b) combinée à R6 : « « Joyeux anniversaire ! On m'a demandé un petit mot personnel. J'ai respecté la première moitié. » » (A1:78) sur la page de marque, sans contexte possible (R4 interdit une 4e phrase) : risque de lecture « à qui ? ». Le soumettre à la relecture à l'aveugle seul ; sous 8, repli sur une vanne de bureau du catalogue, sans lien.
Tirages couverts par le registre de 90 jours, à garder : 29/10 (A3 contient `cs14jkf0a20e0837fa95c784`, posté le 26/10, A3:29), 14/12 (S11 contient les mimes du 12/10, S11:5), 05/11 (A4 n°18 réservée).

## 4. Cohérence de R1 à R6

| Règle | Verdict | Motif | Correction |
|---|---|---|---|
| R1 | Incohérente en interne | « pour entrer » contre « tirées en dernier » (V4:160) | Voir K1. |
| R2, R3, R5 | Cohérentes | Avec FP:20, FP:22, FP:39 et entre elles ; légendes de marque sans 1re personne (R3 et R6 compatibles). | Aucune. |
| R4 | Cohérente | Une ligne d'article compte dans les 3 phrases ; R6 n'ajoute pas de phrase. | Voir §3.6 (lisibilité). |
| R6 | Appliquée partout, une clause trop large | Guillemets sur les 9 posts, les replis, les files (V4:109) ; « mot pour mot » préservé (typographie seule, FP:50). Seule la parenthèse sur « on » heurte IG3. | « Le texte de marque n'emploie jamais « je » ; « on » y désigne la marque ou tout le monde, jamais le narrateur d'une vanne. » |

## 5. Ce qu'il faut pour 10/10

1. @social : R1 (une seule règle) et stock éligible compté ; parenthèse de R6 ; IG1 « 51 » ; T2 ; K5 (a) à (e).
2. @copywriter : stock à 8 et plus, notes à l'aveugle de cycle 4 (textes neufs, n°6 seule sur LinkedIn), vannes neuves de S9.
3. @fullstack : règle des motifs répétés dans le script de tirage.

Verdict : **NO-GO à 10/10** (K1 9, K2 9,9, K5 8,5, K9 10). Aucun défaut bloquant pour Thomas ; une passe d'édition suffit.

Source externe : [Buffer, nombre de posts programmables à l'avance](https://support.buffer.com/article/643-how-many-posts-can-i-schedule-in-advance).
