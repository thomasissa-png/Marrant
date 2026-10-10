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

---

## Corrections non bloquantes (nécessaires pour le 10)

**7. Traces caduques des versions précédentes.** Thomas lit encore des variantes abandonnées et un historique qui contredit le texte actuel. Le modèle s18, noté 10/10, n'a ni section d'arbitrages ni historique de versions.
- l. 3 : « Les 6 étapes du parcours restent à écrire » devient « Les étapes 2 à 6 restent à écrire » (l'étape 1 est au §3).
- l. 42 : supprimer « La variante « Compter ce que personne ne compte » et la première version (« Survivre aux réunions avec humour ») sont abandonnées ».
- l. 110 : supprimer « Réécriture du tour 5 : l'ancienne version, bâtie sur les formules de réunion (bingo), est abandonnée. »
- l. 126 : supprimer la parenthèse « (remplace « Ta prochaine réunion, en spectateur »…) ».
- l. 140 : supprimer « ce qui remplace l'ancienne règle « une visio compte comme réunion » (arbitrage 7, version abandonnée) ».
- l. 184 : supprimer les deux premières phrases (« Les anciennes (jargon pour VDB… ») et garder la comparaison des fiches.
- l. 195 : supprimer « L'ancienne version gardait « Mon manager m'a félicité pour ma discrétion »… sort de l'étape. » (la raison figure déjà l. 222).
- l. 215 : remplacer « Le titre précédent (« oser une vanne en réunion ») promettait… » par la seule raison actuelle (« Il reprend la promesse de la fiche… »).
- l. 262 : supprimer « Roumanoff, mon remplacement précédent, parlait d'un système et non d'un objet ».
- l. 316, signalement 4 : réduire à une ligne (« Conseils des étapes 1 et 6 validés à l'aveugle aux tours 5 et 6, textes au §1 ») ou le supprimer.
- l. 327-349 (arbitrages) et l. 368-414 (table des corrections) : les déplacer dans `docs/marrant/parcours-boulot-s19/iterations/` et laisser dans le document un renvoi d'une ligne. En l'état, l'arbitrage 7 affirme « la visio compte comme réunion » (le défi dit l'inverse), l'arbitrage 13 donne d'anciens totaux (14 et 16), la ligne U6 renvoie à des « variantes 1A et 1B au signalement 4 » qui n'y sont plus, et la ligne U8 annonce « environ 90 mots » (il y en a 100).

**8. « Ce que la base a changé », l. 26 : « Ils sont réécrits à neuf » est inexact pour l'étape 1.** Les conseils 3, 4 et 5 sont réécrits sous leur id puis réactivés. Celui de l'étape 1 est un conseil neuf, et « Survivre aux réunions avec humour » reste retiré (c'est ce que dit le handoff, l. 361). Correction : « Les trois derniers sont réécrits à neuf ; le premier est remplacé par un conseil neuf (voir §1). »

**9. Choix 7, l. 84 : renvoi vers une phrase qui n'existe pas.** « la progression du §7 ne peut plus affirmer « rien tant que tu n'envoies pas » » : cette formule n'apparaît pas au §7. Correction : « Si tu dis non, la ligne 2 du tableau du §7 (repli « garder le PS en brouillon ») et la phrase « Chaque exercice a une version sans risque au boulot » de la description B ne tiennent plus pour l'étape 2. » Signaler la même dépendance dans la reco du §2 (l. 100).

**10. Le témoignage B est conditionnel, mais « Je suis tes recos » ne le dit pas.** Le §2 (l. 101) le soumet à la relecture à l'aveugle de sa vanne, avec le témoignage A comme repli. Correction l. 22 et l. 360 : « B (fiche ; témoignage B si sa vanne passe à l'aveugle, sinon témoignage A) ».

**11. §2, description A (l. 96) : elle reproduit le défaut du titre A de l'itération 1.** « tu apprends à en placer une dans six situations du travail : la réunion, … » : l'étape 1 ne fait placer aucune vanne en réunion. A est le plan B, donc publiable s'il est choisi. Correction : « …tu apprends à en placer une, un cran à la fois : d'abord en observant une salle de réunion sans rien dire, puis dans le mail ou le message, le couloir, l'afterwork, le « tu fais quoi dans la vie ? » et la prise de parole officielle. »

**12. §3, scène : « trois traces repérées » ne correspond pas au critère du défi, qui demande « trois traces notées ».** Anouk regarde trois traces mais n'en note aucune. Correction : « Elle note les trois, choisit le carton et écrit deux phrases… » et « trois traces notées, deux phrases écrites, rien à dire. » Recompter ensuite les mots (environ 103) aux l. 134 et 174.

**13. §3, `why` : le geste central manque.** « Ici, tu les repères et tu les gardes dans tes notes » ne dit rien des deux phrases. Correction : « Ici, tu les repères et tu en tires deux phrases, gardées dans tes notes. » Recompter (environ 52 mots) aux l. 134 et 174.

**14. §3, phrase `[SI 6B]` : « tu peux l'essayer sans risque, dans tes notes » est ambigu.** On ne sait pas si « l' » désigne le test ou la phrase, et « essayer » sa phrase évoque le fait de la dire, dans une étape où « tu ne dis rien ». Correction : « Ici, ta phrase ne parle que d'un objet : elle passe ce test d'avance. » Reporter la même formulation à la l. 305.

**15. §1, exemples des étapes 5 et 6 : les sauts de ligne de la source sont remplacés par « / ».** L'étape 1 garde les siens (l. 54-55). Correction : rétablir les sauts de ligne, ou préciser au handoff (point 1) que l'import copie depuis les sources v1, v5 et v6 et non depuis ce document.

**16. §3, quiz : deux mauvaises réponses à reprendre.**
- Q2 B : la phrase est bancale (« choses » deux fois ; « protège des choses inutiles » se lit aussi « protège contre »). Proposition : « Il protège surtout du vide, comme pas mal de procédures dans cette boîte. » (13 mots, longueur inchangée, la morale se voit mieux).
- Q3 B : « Tu attends la prochaine réunion » ne tente personne. Proposition : « Tu reprends la salle de ta dernière vraie réunion, de mémoire. » (11 mots). Ce piège reprend le repli de l'ancienne version, et le conseil le fait tomber (« La première dit ce que tu vois »). Longueurs 12, 11, 11, 13 : la bonne réponse A n'est ni la plus longue ni la plus courte. Explication : « …La B se fie à ta mémoire, alors que la première phrase dit ce que tu vois… »

**17. §5, canapé (« fort » à l'étape 1) : son décryptage en base contredit la leçon de l'étape.** `boulot-base-s19.json` l. 1184 : « La chute est une petite critique douce de l'entreprise ». Ce décryptage s'affiche avec la vanne (D4), dans une étape dont le conseil dit « pas de commentaire, pas de morale » et dont la Q2 compte comme fausse une pique contre « cette boîte ». Correction : soit classer la vanne en « acceptable » avec cette réserve, soit l'écrire noir sur blanc au §5 pour que Thomas tranche en connaissance de cause.

**18. §5, vannes citées de façon inexacte.**
- Mug (l. 241) : la chute en base (« Depuis, on se surveille. ») n'est pas citée. L'explication en base parle du « titre qui perd sa valeur » et de « la rivalité créée par un cadeau », mais elle ne dit pas « pas le chef ». Surtout, la scène met en place un responsable dans l'étape dont le conseil exclut « un responsable », et la vanne ne montre pas le rappel (correction 6). Ma reco : la remplacer par une 5e vanne neuve (totaux 12 en ligne et 18 neuves, à reporter l. 16, 22, 242, 248-251 et 360). Si tu la gardes, écris en une ligne pourquoi elle passe la règle du conseil 6.
- Costume (l. 239) : la citation est tronquée par « … ». Le texte exact en base contient « Son nom est cousu sur la manche. » Or le document annonce que les vannes sont désignées par leur texte exact (l. 222).

**19. §6 : deux imprécisions.**
- Bilan (l. 269) : « plus un second si le choix 8b s'applique à Vérino » contredit le choix 8, où le 8b donne 5 extraits de facultatives. Correction : « plus 5 extraits de vidéos facultatives si tu choisis 8b ».
- Étape 6 (l. 267) : « Si la légende ne tient pas ce pont, l'étape 6 reste sans vidéo » ne dit pas qui en juge. Correction : « jugé par les deux relecteurs à l'aveugle avec les vannes neuves de l'étape ; à défaut, sans vidéo ».

---

## Ce qui a été vérifié et est exact

- Les 6 conseils sont identiques à leurs sources (tableau en tête), et la validation de l'étape 6 au tour 6 (T-b = R1) est confirmée.
- Étape 1 : `why` 49 mots, `moduleDetail` 100 mots (« d'une » compté pour un mot, comme l'annonce le document), 12 réponses dont les longueurs sont exactes, positions B, D, A, aucune bonne réponse à l'extrême de longueur. Aucun mot de la liste interdite (tempo, blanc, silence, rythme, morceau, règle, article, loi, tout le monde) dans les textes du site. Scène conforme au défi (présent, « En ce moment, », aucune personne, une durée et un rang).
- §5 : 16 vannes BOULOT, 6 écartées, 10 retenues, plus 3 vannes rangées ailleurs, soit 13 en ligne. Fortes 9, acceptables 4, neuves 17, total 30. Le plan « lot plus petit » (2, 2, 2, 1 ; 3, 3) est exact. Canapé, point rapide, archives et entretien ne figurent dans aucun parcours.
- Vidéos : Fary « Le legging » 5 min (Confiance 6, `zC7ff6w7x-Y`) et Vérino 7 min 30 (Confiance 3, `rldvVgHQSvo`). Les extraits de fiches cités sont exacts, et les 6 changements de B portent bien sur 5 étapes. Aucune vidéo n'apparaît deux fois dans le parcours (RC4).
- Confiance 1 : conseil, lieux, article de loi, exemple de l'ascenseur et quiz (métro, file d'attente) sont exacts. Le défi « DÉFI BLANCS » de Machine à Café 2 est exact.
- Titres : 60, 56 et 57 caractères, exacts. Spec §12 (le Boulot n'est la cible d'aucun profil) : exact. XP, `dayNumber` et nombre de questions : conformes à RC11, RC12 et RC5.
- Charte : ni tiret cadratin, ni « blague » ou « carnet » hors des consignes internes, ni mention d'IA. Seul prénom affiché à l'étape 1 : Anouk.

## Pour l'itération 3

Corriger 1 à 6, puis 7 à 19. Après les corrections 2, 12, 13 et 16, refaire la relecture arithmétique et lexicale du §3 (mots, longueurs, positions, mots repris de la question). Après la correction 18, recompter le §5 et reporter les totaux partout où ils apparaissent (tableau des choix, « Je suis tes recos », §5, handoff).
