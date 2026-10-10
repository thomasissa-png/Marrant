# Étalons Parcours Boulot : itération 2, note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md` (418 lignes). Références relues : ma note d'itération 1, le modèle `etalons-parcours-storytelling-s18.md`, la spec s17 §1, §3 et §12, `boulot-base-s19.json`, `vannes-actives-s17.json`, `parcours-seed.json`, `parcours-reecriture-s17.json`, `conseils-seed.json`, les sources des conseils (`conseils-boulot-s19-v1.md`, `-v2.md`, `-v5.md`, `-v6.md`), les critiques à l'aveugle du tour 6 et `founder-preferences.md` (07/10 et 08/10). Comme demandé, le texte des 6 conseils n'est pas noté.

## Note : 7,5/10

**Résumé.** Le saut depuis l'itération 1 est net. L'étape 1 enseigne enfin exactement le conseil affiché (RC1 tenu par le `why`, la scène et l'exercice) : on lit les traces d'une salle, on écrit deux phrases au présent, la seconde porte un chiffre ou une durée, et aucune personne n'apparaît. La scène est drôle et juste (« en est à sa deuxième table »). Les nombres annoncés sont exacts : `why` à 49 mots, `moduleDetail` à 100, longueurs des 12 réponses, positions B, D, A. Le lexique de Machine à Café 2 et de Confiance 1 est absent des textes du site. Le document ne contient ni tiret cadratin, ni « blague », ni « carnet » dans les textes destinés au site, ni mention d'IA. Le §5 tombe juste : 9 + 4 = 13 vannes en ligne, 17 neuves, total 30. Les six conseils sont copiés à l'identique.

Six points bloquent encore le 10. Le premier compte le plus : **la décision de Thomas porte sur un état périmé**. « Je suis tes recos » valide « quatre textes » et laisse l'étape 6 « en cours », alors qu'elle est validée. Le deuxième : la question 1 du quiz se devine à partir de son énoncé. Les quatre autres : deux faits faux (Machine à Café 2 n'est pas gratuite, Roumanoff ne « passe » pas à l'étape 1), un bénéfice annoncé à l'étape 6 que le §6 dément, et un brief de vannes pour l'étape 6 qui ne suit pas le conseil validé.

**6 corrections bloquantes (1 à 6), 13 non bloquantes (7 à 19).**

## Vérification des 6 conseils (copie à l'identique)

| Étape | Source | Titre, catégorie, difficulté | contenu | exemple | exercice |
|---|---|---|---|---|---|
| 1 | v5, P2-bis | identiques | identique | identique (2 lignes conservées) | identique (DÉFI TRACE) |
| 3 | v2 | identiques | identique | identique | identique (repli joué seul) |
| 4 | v1 | identiques | identique | identique | identique |
| 5 | v1 | identiques | identique | mots identiques, **saut de ligne remplacé par « / »** | identique |
| 6 | v6, T-b | identiques | identique | mots identiques (rappel « On regarde ça demain à tête reposée ? », 16 mots, total 107 mots), **sauts de ligne remplacés par « / »** | identique |

Validation de T-b au tour 6 confirmée : R1 = T-b (`aveugle-conseils-correspondance.json`), au niveau chez A, « = (réserve) » chez B. Le DÉFI TRACE du §3 est mot pour mot celui du §1. Seul écart : la mise en forme des exemples 5 et 6 (correction 15).

---

## Corrections bloquantes

**1. Choix 1, « Je suis tes recos » et handoff : la décision porte sur « quatre textes » et l'étape 6 est encore « en cours ».** Le tableau dit « Passés : étapes 1, 3, 4, 5, 6 » mais recommande « Valider les quatre textes » (l. 12). « Je suis tes recos » valide « quatre textes passés à l'aveugle : étapes 1, 3, 4, 5 » (l. 22). Si Thomas répond « je suis tes recos », le conseil de l'étape 6 n'est pas validé.
Corrections :
- l. 12, colonne Reco : « **Valider** les cinq textes du §1 (étapes 1, 3, 4, 5, 6) ».
- l. 22 : « valider le choix 1 (cinq textes passés à l'aveugle : étapes 1, 3, 4, 5 et 6) ».
- l. 86 : « **Reco choix 1 : valider** les cinq textes ci-dessus (étapes 1, 3, 4, 5, 6). » Supprimer la phrase « Si le texte en cours (6) ne passe pas… ».
- l. 287 (tableau du §7, étape 6) : supprimer `[conseil en cours de relecture]`.
- l. 360 : « valider le 1 (cinq textes) ».
- l. 361 : remplacer « créer celui de l'étape 6 une fois passé à l'aveugle » par « **créer** le conseil de l'étape 6, « Le toast de soixante secondes qui tient debout » (texte du §1, STORYTELLING, INTERMEDIAIRE, conseil neuf) ».
- l. 363 : ajouter `conseils-boulot-s19-v6.md` (variante T-b, conseil de l'étape 6) aux sources.

**2. §3, question 1 : la bonne réponse se lit dans l'énoncé** (RC5 de la spec : « 2 réponses plausibles » ; grille : bonne réponse non devinable). L'énoncé pose le critère (« Une seule de ces quatre choses sera toujours là dans un mois ») et les trois autres réponses se signalent d'elles-mêmes comme passagères (« se met en veille », « arrive du couloir », « encore humide »). On trouve la B sans avoir lu le conseil. Autre défaut : le conseil ne parle nulle part de durée de vie d'une trace. En revanche, aucune question ne porte sur sa première consigne (« La première dit ce que tu vois, mot pour mot »).
Correction proposée (bonne réponse toujours en B, à finaliser par @copywriter) :
> **Tu as choisi ta trace. Laquelle de ces premières phrases suit le conseil ?**
> A. « Quelqu'un a encore oublié son chargeur sous la table, comme d'habitude. » (12)
> **B. « Un chargeur est branché sous la table, sans téléphone au bout. »** (11)
> C. « Le chargeur sous la table a visiblement été abandonné. » (9)
> D. « Un chargeur orphelin attend sous la table depuis des mois. » (10)
>
> Explication : « La B. Elle dit ce que tu vois, mot pour mot, et garde le chiffre pour la seconde phrase. La A met une personne dans la phrase, la C commente (« visiblement »), et la D saute tout de suite à la durée en jugeant l'objet (« orphelin »). »

Avec cette version, la C et la D sont tentantes : aucune personne, et la D est drôle et contient une durée. La B n'est ni la plus longue ni la plus courte, et aucun mot de l'énoncé n'est repris. Mettre à jour la l. 142 (« la question 1 porte sur la première phrase : ce que tu vois, mot pour mot »), le paragraphe « Pourquoi chaque mauvaise réponse tombe » (l. 171) et les contrôles des l. 177, 178 et 180. Le quiz couvre alors les trois consignes du conseil : première phrase, seconde phrase, repli.

**3. §3, l. 112 : Machine à Café 2 n'est pas gratuite.** Le document dit « Les deux sont gratuites : une visiteuse peut lire les trois à la suite ». Or `parcours-seed.json` l. 111 et `parcours-reecriture-s17.json` l. 163 donnent `"free": false` pour Machine à Café 2 (`dayNumber` 10), et RC8 réserve les étapes 2 à 6 aux membres Premium.
Correction : « Confiance 1 est gratuite, Machine à Café 2 est réservée aux membres Premium : une visiteuse peut lire Confiance 1 et Boulot 1 à la suite, une membre Premium les trois. » Au passage, rectifier la l. 119 (colonne Machine à Café 2), car le défi en base mesure « trois blancs repérés » et non « avoir senti le bon moment ».

**4. §6, l. 265 : « Roumanoff passe à l'étape 1 » est faux.** Dans la version actuelle, l'étape 1 en B prend Fary et Vérino (l. 262, l. 188-189). Avec le choix 5B, Roumanoff sort du parcours.
Correction : « Roumanoff sort du parcours en B (elle n'est plus à l'étape 1 depuis la réécriture sur le conseil validé). »

**5. Tableau des choix, ligne 5 (l. 16) : un bénéfice que le §6 dément.** La colonne « Ce que ça change » annonce des vidéos qui collent mieux « surtout aux étapes 1, 5 et 6 ». Or le §6 juge Hamzawi « moyenne à faible » à l'étape 6 (l. 267), et la reco dit qu'à l'étape 6 tout « tient à la légende ou à l'absence de vidéo » (l. 270).
Correction : « Les vidéos collent mieux à la leçon de l'étape, surtout aux étapes 1 et 5 ; à l'étape 6, aucune vidéo du catalogue n'est vraiment juste. »

**6. §5, l. 246 : les techniques des vannes neuves de l'étape 6 ne suivent pas le conseil validé.** Le brief demande « une sincérité suivie d'une seule touche, ou une solennité décalée, prise dans le décor de la salle ». Le conseil validé (T-b) enseigne autre chose : **le rappel**, soit un détail du souvenir qui revient et se retourne contre soi, de préférence sur le dernier mot, sans viser « la personne honorée, l'organisation, le buffet ou un responsable ». Les 4 vannes neuves de l'étape 6 seraient écrites sur une technique que l'étape n'enseigne pas (RC3 : « de même technique que l'étape »).
Correction : « 6, un rappel : une première phrase installe un détail, la chute le fait revenir contre soi sur le dernier mot ; jamais la personne honorée, l'organisation, le buffet ni un responsable. » Dans la même ligne, aligner l'étape 3 sur son conseil : « dix mots maximum » plutôt que « une phrase qui tient en quinze secondes ».
