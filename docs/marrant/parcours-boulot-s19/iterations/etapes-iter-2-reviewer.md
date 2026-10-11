# Parcours Boulot, étapes 2 à 6, itération 2 : note @reviewer (s19, 10/10/2026)

> Fichier noté : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (non modifié). Hors notation, comme demandé : le texte des conseils, les défis, les 16 vannes neuves (emplacements) et la vanne d'Anouk de l'étape 6 (non écrite, marquée dans la note de scène l. 317 et l'arbitrage 5).
> Sources confrontées : ma note de l'itération 1, étalons s19 (§1, §3, l. 228-229), `founder-preferences.md`, spec s17 §1 et §3.2, `boulot-base-s19.json`, `vannes-actives-s17.json`, annexe des candidates du PS (`docs/copy/conseil-ps-boulot-s19-v4.md` l. 69-84), rendu `apps/web/src/components/parcours/parcours-step-card.tsx` l. 276-285.

## Note : 9/10

**Résumé.** Mes 16 corrections sont faites (N10 c par un arbitrage que j'avais prévu, accepté). Les nombres sont justes à une exception près (un compte de mots). Ce qui empêche le 10 : le PS d'Anouk, modèle de l'étape 2, est presque une candidate que l'audit du PS avait écartée pour le défaut qu'il a encore. Il était déjà là à l'itération 1 et je ne l'avais pas vu : c'est mon erreur, pas une régression. S'y ajoutent une nouvelle question qui se devine (étape 5, Q3), deux échos entre bonne réponse et scène ou question, et deux redites.

**1 correction bloquante (B1), 8 non bloquantes (N1 à N8).**

## Les 16 corrections de l'itération 1

| Correction | Verdict | Évidence |
|---|---|---|
| B1 « Quatre mails » | Faite | l. 61, 4 réponses |
| B2 étape 6 Q4, étape 5 Q1 | Faite | l. 353-358 (A 13, B 11, C 14, D 15) ; l. 257-262 (A 11, B 10, C 7, D 12) |
| B3 histoire du mot de passe | Faite | l. 175 : 37 mots recomptés, chute « Accepté. » |
| N1 à N5 | Faites | l. 55 et 58 ; l. 39 ; l. 129-135 ; l. 208 et 212 ; l. 175 |
| N6 étape 5 Q3 remplacée | Faite, mais la nouvelle question pose problème | voir N1 ci-dessous |
| N7 a et b | Faites | l. 268 ; l. 271 |
| N8, N9 | Faites | l. 329 ; l. 347 |
| N10 | Faite (a, b) ; c écartée par l'arbitrage 5, justification alignée | l. 310, l. 317, l. 440 |
| N11, N12, N13 | Faites | l. 82-83 et 150 ; l. 293 ; l. 106 |

## Vérifications

| Point | Verdict | Évidence |
|---|---|---|
| Longueurs des 16 questions | PASS | Recomptées une par une : les chiffres des l. 49, 117, 185, 253, 322 sont justes ; la bonne réponse n'est jamais la plus longue ni la plus courte |
| Positions | PASS | 5 / 5 / 5 / 4 sur 19 ; aucune répétition au même rang, jonctions comprises |
| Décompte des vannes | PASS | 9 en ligne, 16 neuves (4 à 19), 11 + 19 avec l'étape 1 ; vannes en ligne inchangées (chutes retrouvées en base) |
| Scènes : nombre de mots | PASS sauf étape 5 | Étape 4 : 142, étape 6 : 142, justes. Étape 5 : 143, pas 144 (N5). Étapes 2 et 3 (non annoncées) : 117 et 120, sous le plafond de 146 |
| Fil d'Anouk | PASS | Six situations, un seul métier possible, aucune contradiction avec l'étape 1 ni avec les témoignages (étalons l. 143) |
| Bonne réponse devinable ou en écho | **FAIL** | Étape 5 Q3 (N1) ; étape 3 Q2 (N2) ; étape 6 Q3 (N3) ; l. 396 affirme le contraire (N7) |
| Redites | **FAIL** | Étape 5, « inconnu » (N4) ; étape 6, `why` et scène affichés l'un sous l'autre (N6) |
| Textes du site au niveau (règle d'or) | **FAIL** | PS de l'étape 2 (B1) |
| Charte | PASS | Zéro tiret cadratin, ni « blague » ni « carnet », tutoiement, aucune personne visée |
| Handoff @fullstack (sauts de ligne, `frTypo`) | PASS | l. 427, point 1 a à c, marqué bloquant pour le rendu |

## Correction bloquante

**B1. Étape 2, scène : le PS d'Anouk est une candidate écartée** (l. 39).
« PS : rectificatif, ce n'est pas à la photocopieuse que j'ai souhaité bon courage ce matin, mais à la plastifieuse. » C'est presque mot pour mot la C3 de l'annexe du PS (`conseil-ps-boulot-s19-v4.md` l. 77 : « … à la photocopieuse que j'ai dit bonjour ce matin, mais au porte-manteau »). Elle avait été écartée parce que ce qui fait rire, parler à une machine, tombe au milieu de la phrase et non au dernier mot. Ici aussi, le dernier mot n'est qu'une autre machine : rien ne bascule. Le PS reprend en plus le moule de l'exemple affiché juste au-dessus (« ce n'est pas à … que j'ai … ce matin, mais à … »). C'est la phrase que l'utilisateur imitera. Règle d'or (P0 s18) : rien sous la barre.
Correction : @copywriter écrit un autre PS pour Anouk, selon les critères de l'annexe (l. 71 : bascule sur le dernier mot, pas de gag connu), en sortant du moule de l'exemple. Ce PS passe à l'aveugle avec les vannes neuves 4 et 5 (même technique), comme la vanne d'Anouk de l'étape 6 (arbitrage 5). Ensuite, revérifier que les réponses C (ficus) et D (café) de la Q1 n'imitent pas le nouveau PS. Corriger aussi la note de scène (l. 44) : elle parle d'« une machine remerciée », ce que la scène ne dit pas.

## Corrections non bloquantes

**N1. Étape 5, Q3 (nouvelle) : la bonne réponse se devine deux fois** (l. 275-278).
(a) Par la forme : B, C et D commencent par « Tu la… » (gardes, dis, dis), seule la A abandonne la phrase. C'est le défaut corrigé en N4 à l'étape 4. (b) Par ressemblance : la Q3 de l'étape 4, la semaine d'avant, a sa bonne réponse au même rang, A, et sur le même moule (« Tu en prends un autre, où c'est un objet… » / « Tu en choisis une autre, où c'est toi… »).
Correction : A « **Tu la retournes pour que ce soit toi qui encaisses la chute.** » (12 mots ; B 13, C 11, D 12 ; aucun mot de la question ni de la scène). Explication, 2e phrase : « Retournée contre toi, elle passe ; telle quelle, elle touche ton métier. »

**N2. Étape 3 : la bonne réponse de la Q2 reprend la scène** (l. 107 et 130).
La scène dit « que l'autre sourie ou non », la A « qu'il ait souri ou non » : même tournure, à deux écrans d'écart. Correction dans la scène : « Elle est déjà dans l'escalier, sans attendre de réponse. » (9 mots au lieu de 10, comme le dit déjà la note de scène).

**N3. Étape 6, Q3, C : « prévue d'avance »** (l. 346).
Il y a un pléonasme, et le mot fait écho au « prévu » de la question (« ce que tu avais prévu »). Cette réponse a été créée par l'arbitrage 6. Correction : « **Tu en sors une autre, tenue en réserve, sans toucher au reste.** » (12 mots ; A 10, B 10, D 15). Mettre à jour l. 322 et l'arbitrage 6.

**N4. Étape 5, scène : « Un inconnu » puis « chez des inconnus »** (l. 243).
Le mot qui fait rire dans la réponse d'Anouk est déjà employé deux phrases plus haut. Correction : « Un invité lui demande ce qu'elle fait dans la vie. » (même nombre de mots).

**N5. Étape 5, note de scène : 143 mots, pas 144** (l. 247).
Recompte avec la même règle que celle qui donne 142 aux étapes 4 et 6 (« qu'elle », « quelqu'un », « l'autre » comptent pour un mot ; « 19 h 10 » pour trois) : 48 jusqu'à la fin de la réponse, 121 avant le test, plus 22 pour le test, soit 143.

**N6. Étape 6 : le `why` et la scène se répètent** (l. 309-310).
Les deux s'affichent l'un sous l'autre (`parcours-step-card.tsx` l. 279 et 285). Le `why` dit « rien ne t'oblige à les prononcer avant le jour J » puis « sans rien dire à personne » ; la scène finit par « rien ne se prononce avant le jour J ». Le défi et le `retourExerciceNote` le redisent : cela fait cinq fois sur le même écran. La fin de la scène venait de ma N10, c'est donc mon erreur. Correction du `why` : « … celui où ça traîne. Soixante secondes bien rangées l'évitent. Ici, tu écris le tien, sans rien dire à personne. » La scène ne change pas et garde sa version sans risque.

**N7. Paragraphe de contrôle (l. 396) : « aucune ne cite un mot de la scène de son étape » est faux.**
Les écarts sont l'étape 3 Q2 (N2), l'étape 6 Q3 (N3, mot de la question) et l'étape 2 Q2 B, « La date d'un point d'équipe », alors que la scène dit « date, salle, ordre du jour ». Correction dans la scène de l'étape 2 : « horaire, salle, ordre du jour ». L'étape 6 Q1 D reprend « souvenir » : c'est un mot du conseil, impossible à éviter, on le garde. Réécrire la phrase pour dire ce qui est vrai : « aucune bonne réponse ne reprend un mot de sa question ni la tournure de sa scène ; les mots du conseil (souvenir, chute) restent permis ».

**N8. Étape 5, Q1, explication : « la C se cache derrière un titre de poste »** (l. 262).
« Je pilote l'optimisation des flux de facturation » est du jargon, pas un titre de poste. La formule venait de ma B2. Correction : « la C se cache derrière du jargon ».

## Pour l'itération 3

Les corrections N1 à N8 sont des phrases toutes faites ; je repasse seulement les longueurs (N1, N3) et le compte de l'étape 3 (119 mots). B1 dépend de la relecture à l'aveugle du nouveau PS. Avec B1 et N1 à N8 faits : 10.
