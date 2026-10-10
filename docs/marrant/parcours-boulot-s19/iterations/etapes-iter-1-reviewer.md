# Parcours Boulot, étapes 2 à 6, itération 1 : note @reviewer (s19, 10/10/2026)

> Fichier noté : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (non modifié). Hors notation, comme demandé : le texte des conseils (validés à l'aveugle, ou par l'exception du choix 7) et les 16 vannes neuves (emplacements).
> Sources confrontées : étalons s19 (§1, §3, §5, §6, §7), `founder-preferences.md` l. 84-85, spec s17 §1 (RC1 à RC12) et §3.2, `boulot-base-s19.json` (`vannes`, `videos`, `videosActives`), `vannes-actives-s17.json`, lot Y1 du tour 13, `personas.md`, modèle s18.

## Note : 8/10

**Résumé.** Les faits sont solides : vannes au texte exact, vidéos et durées conformes à la base, XP et `dayNumber` conformes à la spec, exercices recopiés mot pour mot, comptes de mots et positions vérifiés et justes. Ce qui empêche le 10 : trois défauts bloquants (un nombre annoncé faux dans un quiz, deux questions sans seconde réponse plausible, une chute de scène illogique) et des quiz qui se devinent par la forme ou se répètent d'une étape à l'autre.

**3 corrections bloquantes (B1 à B3), 13 non bloquantes (N1 à N13).**

## Vérifications

| Point | Verdict | Évidence |
|---|---|---|
| Exercices = défis mot pour mot | PASS | DÉFI PS identique au lot Y1 (tour 13) et aux étalons l. 112 ; DÉFI CROISEMENT, TRENTE SECONDES, DEUX PHRASES, SOIXANTE SECONDES identiques aux étalons §1 et aux sources v1, v2, v6 (recherche de phrases entières) |
| Exemple du PS (étape 2) = chute a | PASS | l. 36 identique à Y1 l. 9 et à `founder-preferences.md` l. 85 (« … mais à mon reflet dans l'écran. ») |
| 9 vannes en ligne au texte exact | PASS | 6 dans `boulot-base-s19.json` (l. 1069-1170 : 90 mails, Nicolas, portique, archives, costume, entretien) ; 3 dans `vannes-actives-s17.json` (alternant2 l. 764, pause déjeuner l. 374, tir à l'arc l. 914), `content` et `punchline` identiques |
| Vidéos et durées | PASS | Croce « avion » 2 min 30, Brokerss 5 min 40, Guiz « cabillauds » 4 min 30, Kev Adams 5 min 20, Guiz « fast-food » 4 min 30, Foresti 6 min, Delmoitiez 6 min, Hamzawi 4 min : toutes = base. Légendes fidèles aux fiches (quelques consignes d'observation à resserrer, N11) |
| XP, `dayNumber`, semaines, format | PASS | 75/10, 100/17, 100/24, 125/31, 150/38 = RC11, RC12, §3.2 ; « 2 vidéos » aux étapes 2-4, « une vidéo » aux étapes 5-6 = choix 5B |
| Décompte des vannes | PASS | 3+2+2+2+0 = 9 en ligne ; 2+3+3+3+5 = 16 neuves (n° 4 à 19) ; avec l'étape 1, 11 + 19 = 30 |
| Positions des bonnes réponses | PASS | Recompte A 5, B 5, C 5, D 4 sur 19 (max 26 %) ; jamais deux fois de suite au même rang, jonctions comprises |
| Longueur et mot repris | PASS | Recompte des 15 questions : la bonne réponse n'est jamais la plus longue ni la plus courte ; aucune ne reprend un mot plein de sa question. Mais trois questions se devinent par la forme ou par ressemblance (N1, N3, N4) |
| 2 réponses plausibles (RC5) | **FAIL** | Étape 5 Q1 et étape 6 Q4 (B2) |
| Nombres annoncés = comptés | **FAIL** | Étape 2 Q2 « Trois mails » pour 4 réponses (B1) ; étape 6 Q3 D « deux ou trois autres / l'une des trois » (N9) |
| RC1 | PASS avec réserves | Chaque étape porte sur son conseil ; réserves : étape 4 « la seule victime est un ordinateur » (N5), légende Guiz « cabillauds » (N11) |
| Charte | PASS | Zéro tiret cadratin, « blague » et « carnet » absents des textes du site, tutoiement, aucun prénom de persona (Yanis, Sophie, Marc absents), aucune personne visée dans les scènes ni dans les bonnes réponses |
| Test unique (choix 6B) | PASS | Phrase identique aux étapes 2 à 6, en dernier paragraphe, après un saut ; chaque `moduleDetail` nomme sa version sans risque |

## Corrections bloquantes

**B1. Étape 2, question 2 : « Trois mails » pour quatre réponses** (l. 59).
Le quiz annonce trois mails, il en propose quatre (A à D). Correction : « **Quatre mails t'attendent. Dans lequel tentes-tu ton premier PS ?** » (le reste inchangé ; aucune réponse ne contient « quatre »).

**B2. Deux questions n'ont qu'une réponse plausible (RC5)**.
- **Étape 6, question 4** (l. 344-350). Les trois mauvaises réponses ont le même défaut (compliment vague), et la B recopie l'anti-exemple du conseil (« pas « elle est géniale » »). Seule la A est précise : on la trouve sans réfléchir. Correction :
  - B : « Elle a toujours été là pour moi, dès le premier jour. » (11 mots)
  - C : « Mon premier lundi, elle m'a fait visiter l'étage et s'y est perdue deux fois. » (14 mots : précise et datée, donc tentante, mais elle rit de la personne honorée)
  - A et D inchangées (13 et 15 mots : la A n'est ni la plus longue ni la plus courte).
  - Explication : « La A. Un souvenir daté et précis (le jeudi, l'heure, le geste) sonne vrai, et il fournira son détail au rappel. La C est tout aussi précise, mais elle fait rire de la personne honorée dès le premier bloc. La B et la D sont des compliments de carte de vœux : on les entend, mais on ne les voit pas. »
- **Étape 5, question 1** (l. 251-257). La A et la C sont deux variantes du même jargon, l'anti-exemple du conseil (« pas « je gère l'organisation » ») ; la D est écartée d'office. Correction : A « Je m'occupe des chiffres de la boîte, un peu de tout. » (11 mots : floue sans être du jargon, donc tentante) ; B, C, D inchangées (10, 7, 12 mots : la B reste au milieu). Explication : « La B. Deux verbes concrets, et n'importe qui voit ton travail. La A reste floue (« je m'occupe », « un peu de tout »), la C se cache derrière un titre de poste, et la D traîne un « enfin voilà » qui efface ta réponse. »

**B3. Étape 4, scène : la chute contredit ce qui précède** (l. 172).
« Au troisième, j'avais mis un chiffre, une majuscule et une larme. Il a été accepté. Je ne sais plus lequel. » On sait lequel : le troisième. La chute ne tombe pas, et le meilleur mot (« une larme ») est enterré au milieu. Correction de l'histoire : « Ce matin, mon ordinateur m'a demandé un nouveau mot de passe. Le premier était trop court, le deuxième trop proche de l'ancien, le troisième trop simple. Le quatrième contenait un chiffre, une majuscule et une larme. Accepté. » (37 mots ; escalade d'un cran par phrase, chute d'un mot, la plus courte, sur la technique de l'étape). Note de scène (l. 176) : « 37 mots ».

## Corrections non bloquantes

**N1. Étape 2, question 1 : la bonne réponse refait le gag de la scène** (l. 53). La scène (bon courage à la photocopieuse) et la C (merci au grille-pain) jouent la même politesse envers une machine, sur le même moule que l'exemple du conseil : la C se trouve par ressemblance avec la scène lue juste avant. Correction : C « PS : petite correction, ce n'est pas le ficus que j'arrose depuis lundi, mais son sosie en plastique. » (17 mots, entre 12 et 18). Explication : « … sur un seul détail (la plante), et la version rectifiée arrive en toute fin sans rien arranger. »

**N2. Étape 2, scène : pronoms qui se croisent** (l. 38). « Elle ne l'envoie pas tout de suite : elle la garde en brouillon, et elle compte quand même. » (l'envoie = le mail ? la ligne ?). Correction : « Elle envoie le mail sans le PS, qu'elle garde en brouillon : il compte quand même. »

**N3. Étape 3, question 2 : la question et les réponses n'ont pas la même forme** (l. 126-132). « Qu'en retiens-tu ? » appelle une conclusion ; seule la A en est une, B, C et D sont des gestes. Correction : question « **… qui n'a pas réagi. Que fais-tu ?** » ; A « Tu continues ta route : c'est réussi, qu'il ait souri ou non. » (11 mots, entre 10 et 14).

**N4. Étape 4, question 3 : la bonne réponse est la seule qui ne commence pas par « Tu le racontes »** (l. 203-206). Correction : B « Tu en prends un autre, où ce collègue n'apparaît qu'une fois, en passant. » (13 mots ; A reste à 12, entre 10 et 13). Explication de B : « la B le garde, même en passant, et tout le monde le reconnaîtra ».

**N5. Étape 4, scène : « la seule victime est un ordinateur »** (l. 172). Le conseil dit « C'est toi le héros raté » : l'ordinateur gagne, c'est elle qui perd. Correction : « Le tout a duré moins de trente secondes, et la seule à s'en sortir mal, c'est elle. »

**N6. Étape 5, question 3 refait la question 2 de l'étape 4** (l. 268-275 contre l. 192-199) : même leçon (s'arrêter sur la chute), même mauvaise réponse (« Tu expliques »), deux semaines de suite. Correction : remplacer par une question sur la règle du conseil laissée sans question, « si ton chef entendait ta réponse, il devrait sourire, pas se vexer » (bonne réponse toujours en A, mêmes contrôles de longueur et de mot repris).

**N7. Étape 5, question 2** (l. 260-266). (a) La C reprend « des inconnus » de la scène de Tristan, juste au-dessus : remplacer par « des familles » (14 mots inchangés). (b) L'explication dit « La A fait payer l'employeur » alors que la A vise surtout « d'autres [qui] ont mal choisi » : « La A s'en prend à ceux qui ont choisi avant toi ».

**N8. Étape 6, question 1 : la D récite le conseil** (l. 321 ; « un rappel n'existe qu'après ce qu'il rappelle » est la phrase du conseil). Correction : D « Non : je garde l'humour pour après le souvenir, sinon il n'a rien à rappeler. » (14 mots, inchangé).

**N9. Étape 6, question 3, D : « deux ou trois autres » puis « l'une des trois »** (l. 339). Correction : « Tu en ajoutes deux autres à la suite, en espérant que l'une des trois prenne. » (15 mots ; la C, 13, reste au milieu).

**N10. Étape 6, scène : pas de vanne de rechange, triple redite, pas de chute** (l. 305, l. 309).
- Le défi exige une vanne de rechange ; la scène n'en montre pas. Ajouter « … et le retourne contre elle, puis une deuxième au dos de la feuille, de rechange. »
- « Rien à prononcer ce soir », « Son toast reste sur sa feuille jusqu'à vendredi », « ta vanne reste sur ta feuille jusque-là » : garder la première et finir par « … pour un vrai pot ou pour un pot imaginé : rien ne se prononce avant le jour J. »
- La note (l. 309) justifie l'absence de vanne écrite par « aucun texte de vanne hors relecture », alors que les scènes 2 à 5 en contiennent (PS, phrase de couloir, histoire, réponse) : c'est la seule étape sans chute, et c'est la dernière. Proposition : « Ce soir, je te rends enfin ton parapluie. Je l'ai gardé le temps qu'il faut. » (rappel du détail, en fin de phrase, contre elle). Si on garde le choix actuel, aligner la justification sur les autres scènes.

**N11. Légendes : trois consignes d'observation à resserrer.**
- Croce (l. 80) : « Repère où tombe le dernier mot de chaque annonce » est tautologique. → « Repère, dans chaque annonce, le mot qui fait basculer la phrase, et où il se trouve : dans ton PS, il arrive en toute fin. »
- Guiz « cabillauds » (l. 147) : le ton pince-sans-rire n'est pas la leçon du conseil (irritant partagé, dix mots, sans s'arrêter). → « Repère la phrase la plus courte qui te fait sourire, et compte ses mots : dans un couloir, tu as droit à dix. »
- Brokerss (l. 81) : « qui en fait les frais » revient aussi chez Delmoitiez et Hamzawi. → « Repère un détail si précis que tu t'y reconnais : c'est ce genre de petite scène vraie que ton PS rectifie. »

**N12. « Tir à l'arc » : marqueur périmé** (l. 288, handoff « À vérifier » point 2). Vérifié en base ce jour : active, catégorie RESEAUX_SOCIAUX. Remplacer le marqueur par « vérifiée en base le 10/10 (active, RESEAUX_SOCIAUX) » et retirer le point (2) du handoff.

**N13. Étape 3, `why` : référent bancal** (l. 104). « Un couloir te laisse quinze secondes […]. C'est la meilleure première vanne » (un couloir n'est pas une vanne). → « C'est le meilleur endroit pour ta première vanne à voix haute : … »

## Pour l'itération 2

Après B1 à B3, je repasse : les positions (inchangées), les longueurs des réponses modifiées (calculées ci-dessus), le décompte de la scène de l'étape 4 et le paragraphe de contrôle (l. 388). Avec B1 à B3 et N1 à N6, la note attendue est de 9,5 ; avec les N7 à N13 en plus, 10.
