# Étalons Parcours Boulot : itération 1, note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md`. Références : étalons Storytelling s18 (modèle 10/10), spec s17 §1 et §3, `docs/content/boulot-base-s19.json`, `vannes-actives-s17.json`, `parcours-reecriture-s17.json`, `parcours-storytelling-s18.json`, `founder-preferences.md` (07/10 et 08/10). Section des conseils (choix 1) non notée, comme demandé.

## Note : 6/10

**Résumé.** Le travail de vérification est solide : les 16 vannes BOULOT, leurs parcours d'origine, les 11 vidéos de la spec, les 6 remplaçantes, leurs durées, leurs reprises par `youtubeId`, les deux affirmations de la spec absentes des fiches (Haroun, Rollman) et les titres comptés (58 et 48 caractères) sont exacts. Zéro tiret cadratin, zéro « blague », zéro mention d'IA, « Anouk » n'apparaît nulle part ailleurs dans le dépôt. Ce qui bloque le 10 se trouve dans la vitrine et dans les recos. Le texte de l'étape 1 contient un contresens, une erreur de calcul et deux mots qu'il s'interdit lui-même. Le quiz se devine à la lecture. La fiche B répète trois fois la même idée. Le titre A promet ce que le parcours n'enseigne pas. Deux vannes recommandées enfreignent le critère qui a fait écarter la vanne de Rome. Deux décisions sont cachées dans la section « rien à trancher ». Il manque aussi une comparaison avec Confiance 1.

**10 corrections bloquantes (1 à 10), 11 non bloquantes (11 à 21).**

---

## Corrections bloquantes

**1. §3, `why` : contresens.** « tout le monde les connaît, personne ne les dit » est faux : les formules de réunion, tout le monde les *dit*, c'est leur définition. La phrase reprend aussi presque mot pour mot le `why` de Confiance 1, qui est en ligne (« les règles que tout le monde suit sans jamais les dire »).
Correction : « Une réunion répète les mêmes formules, et c'est ce qui la rend drôle : tout le monde les prononce, plus personne ne les entend. Avant de placer quoi que ce soit, tu apprends à les repérer sans ouvrir la bouche. Ici, tu suis ta prochaine réunion comme un spectacle et tu notes ce qui revient. »

**2. §3 : il manque la comparaison avec Confiance 1, l'autre étape gratuite qui ressemble.** Le document ne compare l'étape qu'avec Machine à Café 2. Or Confiance 1 (« Redécouvrir ce qui te fait rire », conseil « Énoncer la règle non écrite », `parcours-reecriture-s17.json` l. 683-687) fait le même geste : repérer un rituel que tout le monde suit, sans parler (« la noter compte déjà »). C'est aussi une vitrine gratuite, donc un visiteur peut lire les deux à la suite.
Correction : ajouter une colonne Confiance 1 au tableau du §3. Différence à poser : Confiance 1 formule *une* règle non écrite, n'importe où, comme un article de loi ; Boulot 1 *compte des formules* de langage, en réunion. Dans le `moduleDetail` et l'exercice, mettre les formules au premier plan et le rituel au second (le rituel reste dans l'objectif de la spec). Signaler aussi que « à la base » (correction 11) est une vanne de Confiance 1.

**3. §3, `moduleDetail` : « sept formules » ne correspond à rien.** La scène compte 3 « on se cale », 1 « je vous partage mon écran » et 2 « pour la bonne forme » : cela fait 3 formules et 6 passages. Un lecteur qui compte tombe sur l'erreur, et c'est la vitrine d'une étape qui apprend à compter.
Correction : « À la fin, elle a trois formules entendues six fois, pas un seul prénom, et une phrase gardée pour son carnet. »

**4. §3 : deux mots que le document s'interdit lui-même.** Le document pose la règle « aucune phrase de l'étape 1 ne reprend le vocabulaire du rythme de Machine à Café 2 (tempo, blanc, silence, morceau) ». Pourtant le `moduleDetail` dit « suivi de deux minutes de **silence** », la phrase `[SI 6B]` dit « tu l'essaies **à blanc** », et la bonne réponse de la question 3 commence par « À ce **rythme** ». Le défi de Machine à Café 2 s'appelle justement « DÉFI BLANCS ».
Correction : « suivi de deux minutes à chercher le bon écran » ; « Ici, tu l'essaies sans risque, dans ton carnet » ; pour la question 3, voir la correction 5. Refaire ensuite le contrôle par recherche (tempo, blanc, silence, morceau, rythme) sur toute l'étape.

**5. §3, quiz : la bonne réponse se devine sans avoir compris la leçon** (critère de la grille ; la règle RC5 de la spec exige en plus 2 réponses plausibles).
- **Q2** : seule A dit « comme chaque semaine », alors que la question demande ce qui servira « dans trois semaines ». A est aussi deux fois plus longue que les autres, et le micro, la chaise et le café ne tentent personne. L'exercice souffle même la réponse : « repère un rituel : la façon dont ça commence, […] qui attend qui ».
- **Q3** : la question parle d'un « tour de table », et seule D contient « tour de table ».
- **Q1** : A, B et D ont toutes une personne pour sujet (le collègue, le chef, quelqu'un), C est la seule sans personne. Il suffit de regarder la forme des réponses.

Corrections proposées (à finaliser par @copywriter, positions C, A, D inchangées) :
- Q1 : « Tu as noté quatre choses pendant ta réunion. Laquelle peut devenir une vanne sans viser personne ? » Remplacer B par un vrai piège, une formule accrochée à une personne : « Le “je reviens vers vous” du directeur, qui n'est jamais revenu vers personne. » Nouvelle explication : « La C. Elle porte sur une formule que toute la salle a entendue : chacun peut en rire, personne n'est visé. La B parle aussi d'une formule, mais elle l'accroche au directeur, et les deux autres décrivent ce que fait quelqu'un qui était dans la salle. »
- Q2 : retirer « comme chaque semaine » de A (« Les cinq premières minutes à parler météo en attendant les retardataires. »). Remplacer les trois accidents par des accidents *plus drôles sur le moment*, de longueur égale. C'est ça, le vrai piège (exemples : le vidéoprojecteur qui se met en veille pile sur le chiffre du trimestre ; le café renversé sur le seul exemplaire imprimé de l'ordre du jour ; le livreur qui toque en pleine présentation). Explication : « La A. Les retardataires et la météo reviendront la semaine prochaine, et tout le monde les reconnaîtra. Les trois autres étaient plus drôles sur le moment, mais ce sont des accidents du jour : dans trois semaines, plus personne ne s'en souviendra. » Dans l'exercice, retirer « qui attend qui ».
- Q3 : remplacer D par une phrase qui ne reprend pas les mots de la question, par exemple « Onze personnes, une seule idée, et tout le monde l'a eue. »

**6. §3, Q3 : l'explication de la réponse B contredit la règle du parcours.** « la B fait de toi la seule victime » présente l'autodérision comme une faute. Or le document lui-même pose « la situation, le système, soi-même » comme cibles permises (ligne 5), et l'autodérision est la technique de l'étape 5. Le vrai défaut de B : elle se plaint de l'ennui sans rien montrer de la réunion, et ceux qui parlaient l'entendront comme un reproche.
Correction : « La D. Elle vise le tour de table, elle n'existe que pour cette réunion et elle tient en une respiration. La A vise le chef, la B dit seulement qu'on s'ennuie (et ceux qui parlaient l'entendront comme un reproche), et la C, tout le monde l'a déjà dite. »

**7. §2, fiche B : la même idée trois fois, et l'argument de la reco est faux.** La description (« une vanne qui t'est venue en réunion et qui y est restée »), l'accroche (« née en réunion et n'en est jamais sortie ») et le témoignage (« elle avait en réunion une phrase qu'elle n'osait jamais dire ») disent la même chose. La reco affirme que « chacun des trois champs apporte une idée différente ». Dans le modèle Storytelling, c'était vrai (« et donc ? », le dessert, la réplique du cousin) ; ici, non.
Correction : garder la description B. Changer l'accroche pour une autre idée, par exemple : « Pour toi si tu fais rire tes amis le samedi et que tu redeviens sérieux comme un compte rendu le lundi à 9 h ». Ouvrir le témoignage sans la réunion : « Imagine Anouk. Il y a six semaines, elle gardait ses vannes pour la sortie du bureau. Hier, devant l'imprimante… » (la suite ne change pas, elle est bonne). Réécrire ensuite la justification de la reco.

**8. §4, titre A : il promet ce que le parcours n'enseigne pas.** « oser une vanne en réunion » : aucune étape ne fait placer une vanne en réunion. L'étape 1 se vit en spectateur, la phrase reste dans le carnet, et les étapes 2 à 6 se passent dans le mail, le couloir, l'afterwork, la présentation de soi et la prise de parole officielle. Le visiteur qui arrive par ce titre lit une étape 1 où on lui dit de se taire.
Correction : proposer un titre tenu par le parcours et qui évite toujours « drôle », « bureau », « humour » et « au travail ». Par exemple « Parcours Boulot : oser une vanne sans te griller, 6 semaines » (60 caractères, reprend la promesse de la fiche), ou « Parcours Boulot : du mail au pot de départ en 6 semaines » (56, avec la réserve déjà notée sur l'intention de recherche). Compter les caractères à la signature @seo.

**9. §5, vannes : deux recos enfreignent le critère qui a fait écarter Rome.** Rome est écartée parce que « la cible est le récit d'un collègue ». Avec le même critère :
- « Ma collègue m'a briefé pendant 45 minutes… » (« acceptable », étape 4) vise l'excès de zèle d'une collègue.
- « À mon pot de départ, mon chef a fait un discours… » (« fort », étape 6) vise le chef. Le décryptage en base dit « la chute revient au chef qui réfute son propre éloge » (`boulot-base-s19.json` l. 1194). Le document le résume en « l'éloge qui se contredit lui-même », ce qui fait disparaître le chef. Le test de la reco 6B (« passerait-elle si toute la salle l'entendait, y compris la personne dont elle parle ? ») échoue à un pot de départ, où le chef est là. De plus, la Q3 de l'étape 1 compte comme fausse une phrase « qui vise le chef ».

Correction : passer les deux vannes dans « Écartées », avec la même raison que Rome. Étape 4 : 2 actives et 3 neuves ; étape 6 : le mug et 4 neuves. Mettre à jour les totaux (voir la correction 11, qui compense). Une vanne de l'étape 6, l'étape qui enseigne « jamais une personne », ne peut pas avoir un chef pour chute.

**10. Décisions cachées dans « Signalements (information, rien à trancher) ».** Le signalement 3 (retouche du défi du PS, `[À CONFIRMER par toi]`) et le signalement 11 (plafond des vidéos facultatives, `[À CONFIRMER]`) demandent une réponse. Ils n'apparaissent ni dans le tableau des choix, ni dans la phrase « Je suis tes recos ». Thomas ne peut pas tout valider en une ligne.
Correction : signalement 3, le traiter comme en s18 (le repli solo de « Rigoler de ses échecs ») : « retouche commune aux options, pas un choix », placée au §1 ou au §3, ou bien en faire le choix 7 avec une reco. Signalement 11 : la spec tranche déjà (RC4 : le plafond ne vaut que pour la vidéo obligatoire), retirer le `[À CONFIRMER]`. Mettre à jour la phrase « Je suis tes recos » et le handoff.

---

## Corrections non bloquantes

**11. §5 : l'inventaire « 19 vannes actives sur le travail » en oublie au moins deux qui collent mieux que des vannes neuves.** Dans `vannes-actives-s17.json` :
- « Quand quelqu'un commence par « à la base », il faut être patient. » / « Trois digressions plus tard, la base a déménagé. » (l. 344, Confiance 1). Technique en base : « l'abstrait pris au pied de la lettre ». C'est exactement la technique que le §5 demande aux vannes neuves de l'étape 1 (« une formule creuse prise au pied de la lettre »), et elle passe le test : « quelqu'un » ne désigne personne.
- « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. » (l. 914, Confiance 2) : la présentation de soi en entretien, pour l'étape 5, en autodérision.

Correction : les ajouter (étape 1 : 2 neuves au lieu de 3 ; étape 5 : 2 au lieu de 3), avec la mention « reprise de Confiance 1 / 2 ». Vérifier leur `isActive` au 10/10, car l'export date du 07/10. Avec la correction 9, le total reste à 15 vannes neuves. Remplacer « 127 actives » par « 127 actives au 08/10 ».

**12. §7, phrase du test 6B : elle ne s'applique pas à toutes les étapes, et la reco se dédit.** « Avant de la *dire* […] si toute la *salle* l'entendait » ne colle pas à l'étape 2 (un mail, ça se lit et ça s'envoie). Le morceau « ou le métier dont elle parle » n'a de sens qu'à l'étape 5, et une consigne de l'exercice couvre déjà ce cas. Enfin, « on la retire des étapes 5 et 6 si elle lasse » contredit « le même du début à la fin » et laisse une décision ouverte.
Correction : « Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? », la même phrase aux étapes 2 à 6 (et dans la phrase `[SI 6B]` du §3). Supprimer la clause de retrait, ou la garder comme option de la relecture du rendu, sans en faire une promesse.

**13. §3 : repli illogique et dit deux fois.** « Pas de réunion cette semaine ? Une visio » : une visio est une réunion. Le repli est écrit dans le `moduleDetail` puis à nouveau dans l'exercice, et « en y repensant » est mal placé. Le modèle Storytelling ne met le repli que dans l'exercice.
Correction : retirer le repli du `moduleDetail` (finir sur « et tu n'as rien à dire. ») ; dans l'exercice : « Pas de réunion cette semaine ? Repense à la dernière, ou prends un fil de mails à rallonge. »

**14. §3, exercice : deux consignes qui se heurtent.** « garde-la pour toi » est suivi de « raconte ton bingo à un collègue de confiance ».
Correction : « Si tu veux, raconte ton bingo (les formules, pas ta phrase) à un collègue de confiance. »

**15. §3, Q1 : Anouk ne colle pas à la scène.** Dans la scène, Anouk note « pas un seul prénom » ; dans Q1, elle a noté le collègue du fond et le chef. Correction : déjà intégrée à la correction 5 (« Tu as noté quatre choses »). L'étape n'a alors plus de prénom dans le quiz ; mettre à jour la ligne « Un seul prénom dans l'étape (question 1…) ».

**16. §2, description B : « tu apprends à la sortir […] : d'abord en spectateur ».** En spectateur, on ne sort rien.
Correction : « d'abord en écoutant une réunion sans rien dire, puis dans un mail, […] ».

**17. §1 et « Ce que la base a changé » : deux faits incomplets.**
(a) La spec prévoyait pour l'étape 2 le conseil id 53 « L'humour digital : mails, Slack et textos pro ». En base, « L'humour par mail, Slack et Teams » (`cmmp8ozsx001gqk634jbf0vwv`) est inactif. Le document le remplace par le PS sans le dire : ajouter une ligne pour l'expliquer.
(b) « Le troisième conseil actif, « Compare la manie… » » : il y a trois actifs, et le document en oublie un (« Décrire tes révisions comme une rencontre », sans rapport avec le boulot). Le nommer.

**18. §1, étape 6 : « vérifié sur les 3 actifs » ne suffit pas.** L'export ne couvre que 97 conseils au titre « pro ». La spec demande de vérifier qu'*aucun conseil actif de la base* ne couvre déjà la prise de parole officielle. Correction : marquer `[À VÉRIFIER sur tous les conseils actifs]`, ou faire la vérification.

**19. §6, vidéos B de l'étape 3 : l'argument pour Fary est faible, et deux fiches sont traitées différemment.** D'après sa fiche, Fary construit 8 minutes sur un seul objet, alors que l'étape apprend à dire une phrase en quinze secondes ; et un legging n'est pas un irritant partagé du bureau. Il faut soit trouver un vrai argument, soit garder A pour l'étape 3 (le document juge déjà ce gain « moyen »). Par ailleurs, l'écart de durée est signalé pour Fary (8 min dans la fiche, 5 en base) mais pas pour Croce « avion » (« 10 vannes en 5 minutes » dans la fiche, 2 min 30 en base) : le signaler aussi.

**20. Signalement 4 : vérification faisable dès maintenant.** « Compare la manie d'un collègue » n'apparaît dans aucun `tipTitle` de `parcours-reecriture-s17.json` ni de `parcours-storytelling-s18.json`. Correction : écrire « dans aucun parcours en ligne (fichiers s17 et s18) » et retirer le `[À VÉRIFIER @fullstack]`.

**21. §3, légende Roumanoff : « un aplomb qui ne baisse jamais » va plus loin que la fiche** (« avec un aplomb comique »). Correction : « qu'elle traverse avec un aplomb comique ». Dans la légende VDB, « mot après mot » et « chaque fois » restent prudents, car la fiche dit « détourner le jargon […] en langage de tous les jours ». On peut les garder.

---

## Ce qui a été vérifié et est exact (rien à corriger)

- 16 vannes BOULOT actives sur 63 ; MàC 1 (salaires, 90 mails, discrétion), MàC 3 (costume, portique, mug), Répartie 1 (rapport de stage), Répartie 2 (alternant2), Répartie 3 (chez ma mère, voisine), Confiance 1 (pause déjeuner), Storytelling 2 (briefé), 5 (pot de départ), 6 (mail de bienvenue) ; les 5 hors parcours sont exactes. L'écart « 9 et 3 » annoncé par la session est bien une erreur de la session : le bon décompte est 8 et 3.
- Les 11 vidéos de la spec sont actives, avec les durées citées. Les 6 remplaçantes existent et leurs durées sont exactes (Croce 2 min 30, Fary 5 min, Guiz 4 min 30, Rollman 5 min 20, Hamzawi 4 min, Roumanoff 4 min 50). Reprises exactes : Croce = Confiance 1, Fary = Confiance 6, Rollman « relations sociales » = Répartie 1, Haroun = Répartie 4, Rollman « enterrements » = Confiance 4, Hamzawi = Storytelling 3. Roumanoff et Guiz « fast-food » n'ont jamais servi. VDB n'est plus dans MàC 3 (`tpIOLzv11qo` y est).
- Haroun et Rollman « enterrements » : les fiches ne disent pas ce que la spec leur attribue. Ce signalement est juste et utile.
- Les ids des conseils cités au handoff sont exacts ; le défi actif du PS dit bien « ajoute un PS […] à UN mail ».
- Titres : 58 et 48 caractères, exacts. XP, `dayNumber`, plafond de 5 min, 3 questions (4 à la dernière) : conformes à la spec et aux décisions du 07/10 et du 08/10. Rien de ce qui est acquis n'est re-proposé.
- Charte : zéro tiret cadratin, zéro « blague », zéro mention d'IA, « Anouk » unique dans le dépôt, `persona` « jeune active en CDI » conforme à `project-context.md`.

## Pour l'itération 2

Corriger les points 1 à 10 (le texte de l'étape 1 et le quiz repassent en entier, recontrôlés par recherche de mots), puis les points 11 à 21. Après les corrections 9 et 11, recompter le tableau du §5. Après les corrections 5 et 6, revérifier les positions C, A, D et la longueur des réponses.
