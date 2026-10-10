# Étalons du parcours Boulot (s19, 10/10/2026), version corrigée après l'itération 1

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 6 étapes du parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : nom « Parcours Boulot » ; 6 étapes ; 15 min/semaine ; XP 50, 75, 100, 100, 125, 150 + 100 de fin ; étape 1 lisible par le visiteur, validation Premium ; textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication (3 questions par étape, 4 à la dernière, bonne réponse répartie sur les positions) ; repli solo sur chaque exercice ; « première étape gratuite », jamais « cours gratuit » ; doublons de vidéos et de vannes acceptés ; « Expert » jamais affiché ; pas de certificat ; pas de compte gratuit ; prix inchangés. Le Boulot n'est la cible d'aucun profil du quiz d'humour (spec §12) : rien à décider là-dessus.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin dans les textes, pas scolaire, pas corporate, aucune mention d'IA, aucun concurrent, aucun prénom de persona (« Anouk » est un exemple, jamais présenté comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où la fiche vidéo en base les cite, jamais viser une personne (la situation, le système, soi-même). Le mot « carnet » est le nom d'une fonction du site : dans tous les textes, on dit « tes notes ». Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi.** Faits relus dans `docs/content/boulot-base-s19.json` (export prod du 10/10, lecture seule, rien n'a été re-requêté). Vannes et vidéos rapprochées des parcours en ligne par texte et par `youtubeId` (`parcours-reecriture-s17.json`, `parcours-storytelling-s18.json`).

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | § | Point | Options | Ce que ça change pour la lectrice | Reco |
|---|---|---|---|---|---|
| 1 | 1 | Les 6 conseils du parcours | Tu valides chaque texte quand il a passé la relecture à l'aveugle (2 critiques sur 2). Passés : étapes 3, 4, 5 (textes en §1). Déjà en ligne : étape 2. En cours : étapes 1 et 6 | Le conseil est le cœur de chaque étape ; un conseil sous la barre ne revient jamais en ligne | **Valider** les trois textes du §1 |
| 2 | 2 | Fiche du parcours (description, accroche, témoignage « Imagine… ») | A sobre / B complice | Elle se reconnaît dès la première phrase de la fiche | **B** |
| 3 | 4 | Titre de la page (60 caractères max) et slug | A « oser sans te griller » avec la durée / B « du mail au pot de départ » avec la durée | La page promet ce que le parcours tient, et ne se confond pas avec Machine à Café dans Google | **A**, slug `boulot` |
| 4 | 5 | Vannes des 6 étapes (30 places) | A vannes déjà en ligne quand elles collent + 16 vannes neuves relues à l'aveugle / B vannes en ligne partout, y compris hors boulot | Les vannes montrent le sujet de l'étape (le couloir) au lieu d'un barbecue | **A** |
| 5 | 6 | Vidéos des 6 étapes | A celles de la spec / B mes remplacements pour les étapes 1, 2, 4, 5 et 6 (étape 3 gardée comme dans la spec) | Les vidéos collent mieux à la leçon de l'étape, surtout aux étapes 1, 5 et 6 | **B** (tu peux dire « B sauf étape X ») |
| 6 | 7 | Garde-fou « jamais viser une personne » | A une consigne propre à chaque étape / B un seul test, le même du début à la fin | Une seule question à retenir au lieu de six consignes | **B** |
| 7 | 1 | Retouche du défi du PS (étape 2, conseil déjà en ligne) | Oui : une phrase ajoutée / Non : défi inchangé | Aujourd'hui le défi demande d'envoyer un PS drôle dans un vrai mail de travail : c'est exactement ce qui fait peur à la lectrice. La retouche lui permet de garder le PS en brouillon | **Oui** |
| 8 | 6 | Plafond de durée des vidéos facultatives | a Pas de plafond (la spec ne plafonne que la vidéo obligatoire, à 5 min) / b Même plafond de 5 min, donc des extraits à minuter | Les 4 facultatives de la spec durent 5 min 20 à 6 min : sans plafond, elles restent entières et facultatives | **a** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis, tu valides le texte ou tu corriges un mot. Trois de ses lignes dépendent d'un choix : la légende de la vidéo facultative (choix 5), et une phrase finale avec le critère du défi (choix 6, marqués `[SI 6B]`).
**« Je suis tes recos » suffit** : valider le choix 1, puis B (fiche), A (titre), A (vannes), B (vidéos), B (garde-fou), oui (retouche du PS), a (pas de plafond pour les facultatives). Le détail et les textes complets sont dessous. Rien d'autre ne demande de réponse de ta part : les signalements en fin de fichier sont de l'information.

## Ce que la base a changé (faits relus le 10/10)

- **Conseils** : sur les 97 conseils au titre « bureau », 3 seulement sont en ligne. Un seul sert le parcours : « Le PS qui détend un mail sérieux » (étape 2), au niveau. Un deuxième, « Compare la manie d'un collègue à un autre métier », vise une personne, même avec tendresse : il est écarté. Le troisième, « Décrire tes révisions comme une rencontre », n'a aucun rapport avec le boulot. Quatre conseils prévus étaient **retirés** le 30/09 (sous la barre) : « Survivre aux réunions avec humour » (1), « La vanne de couloir : l'art du timing entre deux réunions » (3), « L'afterwork : passer de collègue à personne drôle » (4), « Survivre (et briller) au networking pro avec humour » (5). Ils sont réécrits à neuf (voir §1). Pour l'étape 2, la spec prévoyait « L'humour digital : mails, Slack et textos pro » (id 53) ; son équivalent en base, « L'humour par mail, Slack et Teams », est retiré lui aussi : le PS, en ligne et au niveau, le remplace. Le conseil de l'étape 6 (prise de parole officielle) n'existe pas en base. Les ~90 autres conseils « bureau » retirés (tics et rituels de collègues, lundi matin) ne reviennent pas : ils ciblent des personnes.
- **Vannes** : 16 vannes BOULOT en ligne (47 retirées). 8 sont déjà dans un parcours (Machine à Café, Répartie), 3 dans Storytelling, 5 dans aucun. Cinq autres vannes en ligne parlent du travail sans être classées BOULOT, et sont déjà dans un parcours : « Mon manager m'a félicité pour ma discrétion » (Machine à Café 1), « alternant2 » (Répartie 2), « la pause déjeuner est sacrée » et « à la base » (Confiance 1), « champion de tir à l'arc » (Confiance 2). Le détail du comptage est au signalement 1.
- **Vidéos** : les 11 de la spec sont en ligne. Deux affirmations de la spec ne sont **pas** dans les fiches de la base : Haroun, « le tu fais quoi dans la vie ? est dans la fiche » (la fiche parle d'impro et de rebonds avec le public) ; Rollman « Les enterrements de vie », « le pot de départ est cité dans la fiche » (la fiche parle des enterrements de vie et de rituel social). Détails au §6. La vidéo « Bitcoin, JPEG et blockchain » n'est plus dans Machine à Café 3 (le correctif `tpIOLzv11qo` y est), `[À VÉRIFIER @fullstack en base]`.
- **Parcours** : aucun parcours `boulot` ni `pro` en base ; `storytelling` est en ligne.
- **Titre de page** : `/parcours/machine-a-cafe` a déjà pour title « Parcours Machine à Café : être drôle au bureau en 3 semaines ». Le title du Boulot ne doit pas lui voler cette requête (§4).

---

## 1. Les 6 conseils (choix 1 et choix 7)

Règle d'or du fondateur (P0, s18) : un contenu sous la barre ne revient jamais en ligne. Les conseils retirés sont donc **réécrits à neuf par un autre rédacteur** puis jugés à l'aveugle par deux relecteurs contre les étalons de l'audit s14. Ton rôle : valider le texte une fois qu'il est passé. Les textes passent par la base ET par `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte).

**État réel des relectures à l'aveugle (10/10)**

| Étape | Conseil | État |
|---|---|---|
| 1 | Deux variantes en concurrence : « Compter ce que personne ne compte » (conseil en ligne, défi ajusté) ou « Ce que raconte une salle de réunion » (conseil neuf) | **[EN COURS : relecture à l'aveugle, tour 3]** |
| 2 | « Le PS qui détend un mail sérieux » | **En ligne, au niveau.** Trois règles de forme (une ligne après la signature, un sujet sans rapport, un sérieux total), règle d'or de la capture d'écran. Retouche éventuelle du défi : choix 7 ci-dessous |
| 3 | « La vanne de couloir : l'art du timing entre deux réunions » | **Validé à l'aveugle** (2 critiques sur 2), repli joué seul. Texte ci-dessous |
| 4 | « L'afterwork : passer de collègue à personne drôle » | **Validé à l'aveugle** (2 critiques sur 2). Texte ci-dessous |
| 5 | « Survivre (et briller) au networking pro avec humour » | **Validé à l'aveugle** (2 critiques sur 2). Texte ci-dessous |
| 6 | Titre proposé : « Le toast de soixante secondes qui tient debout » | **[EN COURS : relecture à l'aveugle, tour 3]** |

Les trois textes validés sont copiés à l'identique, sans retouche (une retouche les ferait repasser à l'aveugle). Les étapes 1 et 6 ne s'écrivent pas tant que leur texte n'a pas passé.

### Étape 3 : « La vanne de couloir : l'art du timing entre deux réunions » (validé à l'aveugle)
**Catégorie** : OBSERVATION · **Difficulté** : DEBUTANT
**contenu** : Dans un couloir, tu as quinze secondes et l'autre a déjà la tête dans sa prochaine réunion. La vanne de couloir ne ressemble donc à aucune autre : elle n'attend pas de réponse. Prends un irritant que tout le monde subit (l'imprimante, la clim, le café), dis-le en dix mots maximum au moment où tu croises quelqu'un, et ne t'arrête pas. Comme tu ne ralentis pas, elle ne peut pas tomber à plat : personne n'a eu le temps de ne pas rire. La cible est toujours un objet, jamais une personne, et la phrase doit pouvoir être entendue par n'importe qui dans le bâtiment.
**exemple** : Mardi, 10 h 58. L'imprimante du couloir mouline depuis dix minutes sur une seule page, et un collègue attend devant. Tu passes à sa hauteur et tu ne t'arrêtes pas : « Dix minutes pour une page. Elle relit. »
**exercice** : DÉFI CROISEMENT : aujourd'hui, choisis un irritant que tout le monde subit (l'imprimante, la clim, le café, l'ascenseur) et écris sa phrase en dix mots maximum. Dis-la une seule fois, au moment où tu croises quelqu'un, sans t'arrêter ni te retourner. C'est réussi si tu l'as dite en marchant et sans attendre de réponse, qu'elle ait fait rire ou non. Pas de couloir aujourd'hui (télétravail, jour off), ou pas envie de tenter devant n'importe qui ? Joue le croisement seul : lève-toi, dis ta phrase à voix haute en traversant une pièce ou en montant l'escalier, puis fais encore cinq pas avant de t'arrêter. C'est réussi si tu l'as dite d'un seul trait, en marchant, et si tu as fait ces cinq pas sans te retourner.

### Étape 4 : « L'afterwork : passer de collègue à personne drôle » (validé à l'aveugle)
**Catégorie** : STORYTELLING · **Difficulté** : DEBUTANT
**contenu** : À l'afterwork, ceux qui font rire n'ont pas de meilleures journées : ils racontent la leur en trois temps. Un décor, une escalade, une chute, en trente secondes environ. Le décor tient en une phrase et se comprend sans avoir mis les pieds dans ton bureau : pas de sigle, pas de nom de dossier. L'escalade est le cœur : chaque phrase monte d'un cran, et c'est toi qui es dedans. La chute est la dernière phrase, et il n'y a rien après. C'est toi le héros raté, et personne d'identifiable ne sert de victime : la salle rit avec toi, et aucun absent n'a à se défendre.
**exemple** : Lundi, j'ai écrit mon prénom sur mon déjeuner, au frigo de l'étage. Mardi, le déjeuner avait disparu, le prénom aussi. Mercredi, j'ai laissé un mot : « Si tu as faim, demande. » Jeudi, ma boîte m'attendait lavée, avec un papier collé dessus : « Très bon. Un peu léger en sel. »
**exercice** : DÉFI TRENTE SECONDES : choisis un petit moment de ta semaine de travail où c'est toi qui as été dépassé (un objet, une procédure, une machine, jamais un collègue précis). Écris-le en trois temps : un décor en une phrase sans sigle, une escalade, une chute. Dis-le à voix haute en chronométrant. C'est réussi s'il tient en 30 secondes ou moins, sans un seul sigle, et si tu t'arrêtes net après la chute. Pas d'afterwork à venir ? Raconte-le à un ami qui ne connaît rien à ton boulot : s'il le comprend sans poser de question, c'est gagné.

### Étape 5 : « Survivre (et briller) au networking pro avec humour » (validé à l'aveugle)
**Catégorie** : AUTODERISION · **Difficulté** : INTERMEDIAIRE
**contenu** : Le pitch récité te rend interchangeable : tout le monde a le même. La version honnête tient en deux phrases. La première dit ce que tu fais vraiment, avec un verbe concret (« je fais les plannings », pas « je gère l'organisation »). La seconde donne ce que la fiche de poste ne dit pas : la place que ton métier occupe dans la vie des autres, ou ta façon à toi de l'exercer. L'autodérision tombe sur toi, jamais sur ton métier ni sur ton employeur : si ton chef entendait ta réponse, il devrait sourire, pas se vexer. Et tu t'arrêtes sur la chute, sans « enfin voilà » derrière.
**exemple** : « Et toi, tu fais quoi dans la vie ? » / « Je fais les plannings d'une équipe de trente personnes. Toute l'année on m'évite, sauf en juin, quand on m'apporte des chocolats. »
**exercice** : DÉFI DEUX PHRASES : écris ta réponse à « tu fais quoi dans la vie ? » en deux phrases et vingt-cinq mots au maximum : un verbe concret d'abord, le détail que la fiche de poste ne dit pas ensuite. Donne-la à la première personne qui te pose la question aujourd'hui. C'est réussi si ta réponse tient en deux phrases et si on te pose une question dessus au lieu de changer de sujet. Personne ne te le demande aujourd'hui ? Dis-la trois fois à voix haute : c'est réussi quand tu la dis la troisième fois sans regarder ta feuille.

### Choix 7 : retouche du défi du PS (étape 2, conseil en ligne)
Le défi en ligne dit : « DÉFI PS : aujourd'hui, ajoute un PS d'une ligne à UN mail ou message pro sérieux, sur un détail minuscule sans rapport avec le fond. Il doit rester présentable si ton chef le lit. Pas de mail pro à envoyer aujourd'hui ? Écris le PS que tu aurais ajouté au dernier mail sérieux que tu as envoyé, et montre-le à un ami. C'est réussi quand ton PS tient en une ligne et n'a rien à voir avec le fond. » Il demande d'envoyer un trait d'humour dans un vrai mail de travail, alors que la spec exige « aucun envoi exigé » et un message à faible enjeu.
**Retouche proposée** : une phrase, insérée juste après « si ton chef le lit. » : « Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. » En base ET dans `conseils-seed.json`. **Reco : oui.** Comme toute correction d'un conseil en ligne, la version retouchée repasse la relecture à l'aveugle avant d'être mise en base. Si tu dis non, l'étape 2 garde le défi tel quel et la progression du §7 ne peut plus affirmer « rien tant que tu n'envoies pas ».

**Reco choix 1 : valider** les trois textes ci-dessus (étapes 3, 4, 5). Si l'un des textes en cours (1, 6) ne passe pas à l'aveugle, il ne revient pas : on le réécrit, on ne le remplace pas par un conseil sous la barre. L'étape 1 du §3 s'appuie sur l'objectif de l'étape, pas sur un texte de conseil : son exercice reste aligné sur cet objectif (observation seule, zéro risque, rien à raconter à un collègue) et sera **aligné mot pour mot sur le défi du conseil 1** dès qu'il est validé (un seul enseignement par étape) `[À ALIGNER]`.

---

## 2. Fiche du parcours (choix 2)

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose : 6 semaines, six situations du travail, on commence par observer et on finit par parler, la vanne vise la situation et jamais une personne. Rien n'annonce de score, de certificat ni de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ». Champs inchangés de la spec : `slug` `boulot`, `duration` « 6 semaines », `timePerWeek` « 15 min/semaine », `difficulty` DEBUTANT, `difficultyLabel` « DEBUTANT → INTERMEDIAIRE », `order` 5, `icon` à @design, `persona` « Sophie (26 ans, jeune active en CDI) » (champ de la même forme que celui de Storytelling).

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Au bureau, tu as des vannes en tête et tu les gardes pour toi, de peur de te griller. En 6 semaines, tu apprends à en placer une dans six situations du travail : la réunion, le mail ou le message, le couloir, l'afterwork, le « tu fais quoi dans la vie ? » et la prise de parole officielle. Tu commences par observer, tu finis par parler, et ta vanne vise toujours la situation, jamais une personne. | Il y a toujours une vanne qui t'est venue en réunion et qui y est restée. En 6 semaines, tu apprends à la sortir sans te griller, un cran à la fois : d'abord en écoutant une réunion sans rien dire, puis dans un mail, dans un couloir, à l'afterwork, quand on te demande « tu fais quoi dans la vie ? », et enfin quand la parole est officielle, pour un mot de départ ou un toast. Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. |
| `personaTagline` | Pour toi si tu es drôle avec tes amis, mais que tu te retiens au bureau, de peur de tomber à plat ou d'en faire trop | Pour toi si tu fais rire tes amis le samedi et que tu redeviens sérieux comme un compte rendu le lundi à 9 h |
| `testimonial` | Imagine Anouk. En réunion, elle avait toujours une phrase en tête qu'elle gardait pour elle, de peur de tomber à plat devant tout le service. Six semaines plus tard, elle glisse un PS dans un mail, un mot dans le couloir, et c'est à elle qu'on demande de dire quelques mots au pot de départ de vendredi. | Imagine Anouk, 26 ans, en CDI. Il y a six semaines, elle gardait ses vannes pour la sortie du bureau. Hier, devant l'imprimante qui mettait quatre minutes à sortir une page, elle a lâché : « Elle prépare son discours de pot de départ. » Deux collègues ont ri. L'imprimante n'a pas relevé. |

**Reco : B.** Trois champs, trois idées différentes : le programme et la vanne restée en réunion (description), le contraste entre le samedi avec les amis et le lundi à 9 h (accroche), le résultat visible (témoignage). L'accroche ne répète pas la description et ne partage aucun mot de situation avec celle de Machine à Café (« pause, réunion, afterwork »). Le témoignage B porte le garde-fou du parcours dans sa chute : la vanne vise l'imprimante, personne d'autre. La description B rend la promesse « sans te griller » vérifiable (« chaque exercice a une version sans risque », tableau du §7). A reste le plan B si tu trouves la formule « elle y est restée » trop familière pour une page de vente.
**Réserve sur le témoignage B** : la vanne de l'imprimante est une vanne neuve publiée sur la page de vente, elle doit passer la même relecture à l'aveugle que les autres avant ta validation `[À PASSER À L'AVEUGLE]`. Si elle ne passe pas, le témoignage A sert de repli (règle d'or).
Vérifié contre le parcours : chaque élément cité existe dans une étape (écouter une réunion = 1, mail = 2, couloir = 3, afterwork = 4, « tu fais quoi dans la vie ? » = 5, mot de départ ou toast = 6). Le témoignage A cite un PS (2), un mot dans le couloir (3) et un pot de départ (6) ; le B cite le couloir et le pot de départ avec une seule vanne.
Le prénom « Anouk » n'est ni un prénom de persona, ni un prénom d'humoriste des vidéos du parcours, ni celui d'un exemple déjà utilisé ailleurs (Samir, Maëlle, Léa). Il revient dans la scène de l'étape 1 (§3).
**Boulot ou Machine à Café d'abord ?** Aucun prérequis entre les deux : Machine à Café, c'est la pause, la réunion et l'afterwork pour faire rire ; Boulot, ce sont six situations où l'on t'écoute vraiment, une à la fois, de l'observation à la parole officielle. Le classement de départ de la spec (§5.5) n'est qu'une suggestion. Cette ligne est pour toi, pas pour le site ; ton choix 2 la valide.

---

## 3. Étape 1 complète : « Ta prochaine réunion, en spectateur »

C'est la vitrine que le visiteur lit avant de payer. Aucun A/B : forme acquise (version B avec scène, repli solo, quiz complice). L'étape suit l'objectif de la spec (la réunion vue de la salle : repérer les formules et les rituels, viser le système, garder une phrase), en attendant le texte du conseil 1 (§1).

**Ce qui doit se lire face à deux étapes gratuites qui lui ressemblent.** Machine à Café 2 (« Lire le tempo du groupe : savoir quand c'est ton tour », module « Sentir le bon moment ») est de l'observation en réunion, et Confiance 1 (« Redécouvrir ce qui te fait rire », conseil « Énoncer la règle non écrite ») est de l'observation sans parole d'un rituel que tout le monde suit. Les deux sont gratuites : une visiteuse peut lire les trois à la suite. Défi de Machine à Café 2 relu en base le 10/10 (« DÉFI BLANCS ») : repérer et compter les blancs qui suivent chaque rire, puis poser une phrase au premier blanc ; ce n'est pas un relevé de formules. Défi de Confiance 1 : repérer une règle non écrite d'un lieu quelconque (ascenseur, salle d'attente, transport) et la formuler comme un article de loi, à voix haute si l'envie vient.

| | Machine à Café 2 | Confiance 1 | Boulot 1 |
|---|---|---|---|
| Ce qu'on écoute | **Le rythme** : où ça monte, où ça retombe, où il y a de la place | **Une règle non écrite**, d'un lieu quelconque | **Les formules de langage qui reviennent** en réunion (le rituel vient au second plan) |
| Ce qu'on fait | Poser une phrase au premier moment libre | La formuler comme un article de loi | **Les compter, sans rien dire** |
| Ce qu'on garde | Le moment où il y aurait eu de la place | Une règle formulée | **Une phrase dans tes notes**, jamais dite |
| Ce qui se mesure | Avoir senti le bon moment | Avoir repéré ou noté une règle | **Trois formules ou rituels repérés** |
| Où | Pause, réunion, afterwork | Un lieu où on se croise sans se parler | Une réunion, en salle ou en visio ; à défaut, la dernière en souvenir ou un fil de mails |

Aucun texte destiné au site pour l'étape 1 ne reprend le vocabulaire du rythme de Machine à Café 2 (tempo, blanc, silence, rythme, morceau) : pour qui a fait Machine à Café, c'est une autre écoute, ici on compte les mots, là-bas on écoutait la musique. Aucune bonne réponse du quiz n'est citée dans la scène ni dans l'exercice. Le tableau ci-dessus est une note pour toi, pas du texte affiché.

| Champ | Texte |
|---|---|
| `moduleTitle` | Ta prochaine réunion, en spectateur (remplace le titre de travail « La réunion vue de la salle ») |
| `tipTitle` | `[EN COURS : titre du conseil 1, voir §1]` |
| `why` (« Pourquoi cette étape ? ») | Une réunion répète les mêmes formules, et c'est ce qui la rend drôle : tout le monde les prononce, personne ne les relève. Ici, tu suis ta prochaine réunion comme un spectacle et tu notes ce qui revient. |
| `moduleDetail` (version B, scène) | Imagine Anouk, mardi, 10 h. Elle ne dit rien pendant toute la réunion. Elle écoute : trois « on se cale », un « je vous partage mon écran » suivi de deux minutes à chercher le bon écran, deux « pour la bonne forme » à des moments où personne n'attendait de forme. À la fin, elle a trois formules entendues six fois, pas un seul prénom, et une phrase gardée pour ses notes. Dans cette étape, tu fais pareil à ta prochaine réunion : tu comptes les formules qui reviennent, et tu n'as rien à dire. `[SI 6B : Le test à retenir pour toute la suite : ta phrase passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? Ici, tu l'essaies sans risque, dans tes notes.]` |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 50 / oui / 3 (spec, inchangé) |
| `dureeTexte` | `[À MESURER]` : la spec estime 13 min 30 hors mesure ; rien n'est écrit tant que la mesure n'est pas faite. Ordre de grandeur au signalement 7. |

Le repli « pas de réunion cette semaine » n'est écrit qu'une fois, dans l'exercice. Le `moduleDetail` fait environ 90 mots hors phrase `[SI 6B]`.

**Exercice « aujourd'hui »** (observation seule, zéro risque pour un visiteur : tu ne dis rien, tu n'envoies rien, tu ne parles à aucun collègue) `[À ALIGNER sur le défi du conseil 1 dès qu'il est validé]` :

> DÉFI BINGO : à ta prochaine réunion, ne dis rien et joue au bingo dans ta tête. Compte les formules qui reviennent (« on rebondit », « on est alignés », « pour être transparent »...) et note aussi un rituel, un geste que l'équipe refait à chaque fois. Ensuite, écris dans tes notes, en une phrase, ce qui t'a le plus fait sourire, et garde-la pour toi. C'est réussi si tu as repéré trois formules ou rituels en tout `[SI 6B : et si ta phrase passerait le test de l'équipe entière]` `[SINON : et si ta phrase parle de la réunion, pas d'une personne]`. Si tu veux, raconte ton bingo (les formules, pas ta phrase) à un ami hors boulot ; sinon, garde tout pour toi. Pas de réunion cette semaine ? Repense à la dernière, ou prends un fil de mails à rallonge.

(Repli solo : tes notes, rien d'autre. Repli de situation : la dernière réunion en souvenir, ou un fil de mails. Aucune phrase de l'étape ne fait parler à un collègue ; l'ami hors boulot est facultatif. Une visio est une réunion, donc elle n'est pas un repli : elle compte.)

**Quiz, trois questions** (ton B complice, 4 réponses). La question 1 porte sur ce qu'on vise (la formule ou la personne), la question 2 sur ce qui vaut d'être noté (ce qui revient), la question 3 sur la phrase à garder (celle qui passe le test). Positions de la bonne réponse : **C, A, D** (jamais deux de suite au même rang). Aucun prénom dans le quiz : le seul prénom de l'étape est celui de la scène.

**Question 1 (bonne réponse en C)**
> **Tu as noté quatre choses pendant ta réunion. Laquelle peut devenir une vanne sans viser personne ?**
> A. « Le collègue du fond a regardé son téléphone pendant vingt bonnes minutes. » (12 mots)
> B. « Le “je reviens vers vous” du directeur, qui n'est jamais revenu vers personne depuis mars. » (15)
> **C. « Le “juste une petite remarque” est tombé cinq fois, avant dix minutes de remarques. »** (14)
> D. « Quelqu'un a reposé trois fois la même question, mot pour mot. » (11)
>
> **Explication (affichée quelle que soit la réponse, 3 phrases)** : La C. Elle porte sur une formule que toute la salle a entendue : chacun peut en rire, personne n'est visé. La B parle aussi d'une formule, mais elle l'accroche au directeur, et les deux autres décrivent ce que fait quelqu'un qui était dans la salle.

**Question 2 (bonne réponse en A)**
> **Tu ne peux noter qu'une chose de ta réunion. Laquelle te servira encore dans trois semaines ?**
> **A. « Le quart d'heure à parler météo en attendant les retardataires. »** (10 mots)
> B. « Le vidéoprojecteur qui s'est mis en veille pile sur le chiffre du trimestre. » (13)
> C. « Le café renversé sur le seul exemplaire imprimé de l'ordre du jour. » (12)
> D. « Le courant d'air qui a fait claquer la porte en pleine présentation. » (12)
>
> **Explication (3 phrases)** : La A. Les retardataires et la météo reviendront la semaine prochaine, et tout le monde les reconnaîtra. Les trois autres étaient plus drôles sur le moment, mais ce sont des accidents du jour : dans trois semaines, plus personne ne s'en souviendra.

**Question 3 (bonne réponse en D)**
> **Tu prépares une phrase pour plus tard, sur un tour de table où chacun répète ce que le précédent vient de dire. Laquelle gardes-tu dans tes notes ?**
> A. « Encore une réunion où le chef ne sait pas conclure. » (10 mots)
> B. « Y a-t-il quelqu'un d'autre à qui ça donne envie de dormir ? » (11)
> C. « Cette réunion aurait pu être un mail. » (7)
> **D. « Onze personnes ont eu la même idée, une par une. »** (10)
>
> **Explication (3 phrases)** : La D. Elle vise le tour de table, elle n'existe que pour cette réunion et elle tient en une respiration. La A vise le chef, la B dit seulement qu'on s'ennuie (et ceux qui parlaient l'entendront comme un reproche), et la C, tout le monde l'a déjà dite.

**Pourquoi chaque mauvaise réponse tombe.** Question 1 : la B est une vraie formule mais accrochée à un directeur ; la A et la D décrivent ce que fait quelqu'un. Question 2 : les trois mauvaises réponses sont des accidents du jour, plus drôles sur le moment que la bonne, et chacune est nommée dans l'explication. Question 3 : chaque mauvaise réponse enfreint une seule règle (vise une personne, ne montre rien de la réunion, cliché), ce que l'explication nomme. Les nombres entre parenthèses sont des notes pour toi, pas du texte affiché.

**Relecture arithmétique et lexicale (faite sur ce texte).**
- Formules annoncées = comptées : la scène compte 3 « on se cale » + 1 « je vous partage mon écran » + 2 « pour la bonne forme » = 6 passages et 3 formules distinctes ; elle dit « trois formules entendues six fois ». Le critère du défi (trois formules ou rituels) est celui que la scène montre.
- Aucun mot du rythme de Machine à Café 2 (tempo, blanc, silence, rythme, morceau) dans `why`, `moduleDetail`, le défi, le quiz et les légendes. « Carnet » est remplacé par « notes » partout.
- Aucune bonne réponse ne reprend un mot de sa question (Q1 : quatre choses, réunion, vanne, viser, personne ; Q2 : chose, réunion, servira, trois semaines ; Q3 : phrase, tour de table, chacun, répète, précédent, notes). Le seul mot repris est « personne », dans une mauvaise réponse (Q1 B).
- Forme des réponses : aucune ne se distingue par sa structure (Q1 : trois commencent par « Le », une par « Quelqu'un » ; Q2 : les quatre commencent par « Le » ; Q3 : phrases simples dans les quatre cas). Longueur en mots : la bonne réponse n'est la plus longue dans aucune des trois questions (Q1 : 14 pour 15 au plus ; Q2 : 10 pour 13 ; Q3 : 10 pour 11).
- Positions : C, A, D, soit une fois chacune, jamais deux de suite.

**Les 2 vidéos** (plafond 5 min pour l'obligatoire, 1 obligatoire + 1 facultative, aucune minute inventée). Les légendes ne disent que ce que la fiche du catalogue établit, et elles invitent à observer : elles restent vraies quoi qu'on voie.

| | Légende (`why`) |
|---|---|
| **Obligatoire** : Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30) | Du jargon de bitcoin et de blockchain ramené au langage de tous les jours. Repère chaque fois le mot simple qui prend la place du mot savant : c'est le réflexe à garder dans ta tête quand une formule sonne creux en réunion. |
| *Facultative, **si choix 5B*** : Anne Roumanoff, « Carmen et la crise » (4 min 50) | Carmen, une Française ordinaire, face à une crise économique qu'elle traverse avec un aplomb comique. Repère ce que le rire vise : une personne, ou un système qui déraille, comme une réunion qui tourne en rond ? |
| *Facultative, **si choix 5A*** : Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Un avocat plaide pour la salade, la frite et la saucisse, avec tout le sérieux d'une vraie plaidoirie. Repère ce que ce ton solennel fait à un sujet qui ne l'est pas. |

(Sources : fiches de `boulot-base-s19.json`, « détourner le jargon tech en langage de tous les jours », « une Française ordinaire [...] avec un aplomb comique », « personnage naïf face à un système absurde », « plaidoirie hilarante ».)

**Les 5 vannes** : dépendent du choix 4 (§5). Place commune aux deux options, texte exact en base, jamais utilisée dans un parcours : « Ma réunion 'point rapide avant l'été' a commencé à 14h. » / « On a fini par voter la police de caractère. » Explication de la vanne (une ligne) : le « point rapide » promet dix minutes, l'après-midi y passe, et la seule décision tient dans une police de caractère. Les autres places de l'étape 1 sont au §5.

---

## 4. Titre de la page et slug (choix 3)

Le titre du Boulot n'est pas dans `seo.md` §6 (les 4 titres signés sont /parcours, Répartie, Machine à Café, Confiance) : c'est une proposition à faire signer. Même gabarit que les autres quand c'est possible : « Parcours X : bénéfice en N semaines », 60 caractères maximum. Volumes de requêtes : **non mesurés** (aucun outil), je n'avance aucun chiffre.

**Point de vigilance.** La page Machine à Café porte déjà « Parcours Machine à Café : être drôle au bureau en 3 semaines » (cible : être drôle au travail, humour au bureau), et son accroche cite « en réunion ou à l'afterwork ». Les propositions ci-dessous **n'emploient ni « drôle », ni « bureau », ni « humour », ni « au travail »**, et le titre A ne nomme aucune situation de Machine à Café. La même règle vaut pour le début de la `metaDescription` et pour le H1, à écrire plus tard.

| | Titre | Caractères |
|---|---|---|
| **A** (reco) | Parcours Boulot : oser une vanne sans te griller, 6 semaines | 60 |
| **B** | Parcours Boulot : du mail au pot de départ en 6 semaines | 56 |

Variante sous les yeux pour comparer : « Parcours Boulot : oser une vanne du mail au pot de départ » (57 caractères, sans la durée). On y gagne deux situations que Machine à Café ne couvre pas, on y perd la durée.

**Reco : A.** Le titre précédent (« oser une vanne en réunion ») promettait ce que le parcours n'enseigne pas : on n'y place aucune vanne en réunion, l'étape 1 se vit sans parole. Celui-ci reprend la promesse de la fiche (« sans te griller »), garde « oser » (la peur du persona) et la durée, comme « Parcours Confiance : retrouver ta légèreté en 6 semaines ». B couvre mieux l'arc du parcours (deux de ses six situations) mais n'a ni verbe ni promesse, et « pot de départ » attire sans doute des gens qui cherchent un discours à copier, ce qu'un article fait mieux qu'un parcours `[HYPOTHÈSE : intention de recherche non mesurée]`. Règle de partage SEO inchangée : l'article répond à la question, le parcours vend le programme et la première étape gratuite (jamais « cours gratuit »).
**Slug : `boulot`** (nom acquis, spec §3.1 et §9 point 1 : « Pro » se lit comme un palier de prix). Pas de choix : aucun ancien slug à rediriger (aucun parcours `pro` ni `boulot` en base). Le renommage de `"pro"` en `"boulot"` dans les classements de fin de parcours concerne tous les fichiers (signalement 9). Caractères comptés à la main, à re-vérifier à la signature.

---

## 5. Méthode de choix des vannes (choix 4)

Contrainte : 30 places (6 étapes × 5). Les ids de vannes de la spec viennent d'un seed périmé : on désigne chaque vanne par son **texte exact**. Il n'existe en tout que **16 vannes BOULOT en ligne**, dont 6 écartées ci-dessous, soit 10 retenues ; 4 vannes en ligne sur le travail rangées ailleurs s'y ajoutent (sur 5 trouvées). Doublons de vannes acceptés (décision acquise), donc une vanne déjà en ligne peut servir.

**Écartées (garde-fou « jamais viser une personne », ou hors des 6 situations)**, avec le même critère pour toutes : la vanne ne doit pas avoir une personne pour cible, ou pour chute.
- « Mon collègue revient de 4 jours à Rome et me raconte tout en détail. » : la cible est le récit d'un collègue.
- « Ma collègue m'a briefé pendant 45 minutes avant ses congés pour me passer ses dossiers. » (Storytelling 2) : la cible est l'excès de zèle d'une collègue, même critère que Rome.
- « À mon pot de départ, mon chef a fait un discours de dix minutes… Bref. » (Storytelling 5) : l'explication en base dit que « la chute revient au chef qui réfute son propre éloge ». Le chef est visé, et à un pot de départ il est dans la salle : le test du §7 échoue. Une vanne de l'étape qui enseigne « jamais une personne » ne peut pas avoir un chef pour chute.
- « Quand quelqu'un commence par « à la base », il faut être patient. » (Confiance 1) : la technique (l'abstrait pris au pied de la lettre) colle à l'étape 1, mais l'explication en base parle du « collègue-tornade », donc d'une personne, et c'est déjà la vanne de l'étape gratuite de Confiance.
- « Avec un collègue, on a enfin comparé nos salaires. » : un sujet qui ne passerait pas le test de la salle entière (§7) devant tout le service.
- « Je télétravaillais chez ma mère… » et « Ma voisine m'a dit qu'elle m'entendait parler seul… » : le télétravail à la maison n'est pas une des 6 situations. La seconde reste en réserve pour l'étape 1.

**Lecture étape par étape** (« fort » = la vanne illustre la leçon de l'étape ; « acceptable » = elle l'illustre à moitié ; entre parenthèses, où elle est déjà en ligne) :

| Étape | En ligne, collent vraiment (fort) | En ligne, acceptables | Places à pourvoir par des vannes neuves (A) |
|---|---|---|---|
| 1, la réunion en spectateur | « Ma réunion 'point rapide avant l'été' a commencé à 14h. » (aucun parcours) | « Mon manager m'a félicité pour ma discrétion. » (Machine à Café 1) : la discrétion de celui qui écoute sans parler | **3** |
| 2, le mail | « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » (Machine à Café 1) ; « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. » (Storytelling) ; « Mon adresse mail pro d'alternant commence par « alternant2 ». » (Répartie 2) | | **2** |
| 3, le couloir | « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » (Machine à Café 3) ; « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. » (aucun parcours) | « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. » (Confiance 1) | **2** |
| 4, l'afterwork | « J'ai passé mon stage à ranger les archives par ordre alphabétique. » (aucun parcours) ; « Pour mon entretien, j'ai emprunté le costume de mon père… Le recruteur m'a appelé Robert toute l'heure. » (Machine à Café 3) | | **3** |
| 5, « tu fais quoi dans la vie ? » | « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » (aucun parcours) ; « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. » (Confiance 2 ; l'homonyme dont on t'attribue les exploits : autodérision sur soi) | « Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements sont très bien ». » (Répartie 1) | **2** |
| 6, la parole officielle | | « Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze. » (Machine à Café 3) : l'explication en base dit que la vanne vise le titre qui se dévalue, pas le chef | **4** |
| **Total** | **10 fortes** | **4 acceptables** = 14 en ligne | **16 neuves** (14 + 16 = 30) |

`[À VÉRIFIER @fullstack : « tir à l'arc » est tirée de l'export du 07/10 ; contrôler qu'elle est toujours en ligne au 10/10 avant l'import.]`
Les 5 vannes BOULOT qui ne sont dans aucun parcours : 4 sont retenues (point rapide, canapé, archives, entretien) ; la cinquième (Rome) est écartée ci-dessus.
Techniques que les 16 vannes neuves doivent montrer (une fiche par étape, écrite avec l'étape) : 1, une formule creuse prise au pied de la lettre ou un rituel de réunion décrit comme un reportage ; 2, un message beaucoup trop sérieux pour son sujet (ressort du PS) ; 3, un irritant partagé dit en une phrase qui tient en quinze secondes ; 4, un moment absurde de la semaine en trois temps, la chute étant la phrase la plus courte ; 5, un métier décrit honnêtement en deux phrases, sans mépriser ni le poste ni l'employeur ; 6, une sincérité suivie d'une seule touche, ou une solennité décalée, prise dans le décor de la salle. Aucune ne vise un collègue ou un chef : l'explication de chaque vanne dit ce qu'elle vise (la situation, le système, soi).

**A (reco)** : les 14 vannes en ligne ci-dessus là où elles collent, et **16 vannes neuves** (catégorie BOULOT), écrites par @copywriter puis relues à l'aveugle par deux relecteurs avant l'import ; rien n'est importé avant d'avoir passé la relecture (règle d'or).
**B** : les mêmes 14, et 16 autres choisies parmi les 127 vannes actives du catalogue (à la date de l'export, 08/10) pour leur technique, sans lien avec le travail. Plus rapide, aucun texte à relire, mais l'étape « couloir » montrerait par exemple un barbecue.
Une étape qui ne montre pas son propre sujet est un défaut que l'audit des parcours de s17 reprochait déjà aux parcours existants, et le Boulot n'a qu'un seul argument : le travail. 16 vannes neuves, c'est plus de trois fois le lot de Storytelling (5), parce que je n'ai repéré que 21 vannes actives sur le travail en tout (16 BOULOT, 5 rangées ailleurs ; recherche par mots-clés sur les 127 actives, `[À VÉRIFIER]` si tu veux un inventaire exhaustif). **Reco : A.**
Si tu préfères un lot plus petit : A pour les étapes 1, 4 et 6 (les plus faibles en vannes déjà en ligne : 2, 2 et 1 sur 5), B pour les étapes 2, 3 et 5 (3 sur 5 chacune). Dis-le, c'est un détail d'import.

---

## 6. Vidéos des 6 étapes (choix 5 et choix 8)

Règle : 1 vidéo obligatoire (plafond 5 min, au-delà un extrait minuté) + 1 facultative, étape 6 une seule. Je n'invente aucune minute : tout extrait est marqué `[À MINUTER]`. Les 11 vidéos de la spec sont en ligne. La spec en juge 8 « moyennes » (Tsamère, Croce « Tinder », Brokerss « Snapchat », Guiz « cabillauds », Kev Adams, Roumanoff, Foresti, Delmoitiez) et 3 « fortes » (Thomas VDB, Haroun, Rollman). **Deux des trois « fortes » reposent sur une phrase qui n'est pas dans la fiche en base** : pas de « tu fais quoi dans la vie ? » chez Haroun (fiche : impro structurée, rebonds avec le public), pas de « pot de départ » chez Rollman (fiche : enterrements de vie, rituel social). Seule Thomas VDB tient (fiche : jargon ramené au langage de tous les jours).
Je cherche donc dans les 89 vidéos actives des remplaçantes plus justes, en préférant celles qui n'ont jamais servi (vérifié par `youtubeId` dans les parcours en ligne). Quand la meilleure a déjà servi, je le dis : les doublons sont acceptés, mais ils se paient. L'adéquation de B est jugée **d'après les fiches du catalogue, vidéos non visionnées** : tu peux me demander de regarder avant de trancher.

| Étape | **A (spec)** | **B (mes remplacements)** | Adéquation de B | Pourquoi |
|---|---|---|---|---|
| 1, réunion | Obl. Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30). Fac. Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Obl. identique. Fac. **Anne Roumanoff, « Carmen et la crise »** (4 min 50, jamais utilisée) | VDB forte. Roumanoff forte pour cette étape (la spec la jugeait moyenne en afterwork) | VDB reste. Roumanoff porte la leçon de l'étape (fiche : un personnage naïf face à un système absurde, donc un système et personne en face). Tsamère n'a que le cadre codifié. |
| 2, mail | Obl. Pierre Croce, « Tester Tinder avec un enfant » (3 min). Fac. Jason Brokerss, « Snapchat » (5 min 40) | Obl. **Pierre Croce, « Ce qu'on rêverait d'entendre dans l'avion »** (2 min 30, **vidéo déjà utilisée dans Confiance 1**). Fac. Brokerss « Snapchat » inchangée | Moyenne à forte ; Brokerss moyenne (spec) | La fiche de l'avion parle d'une liste de one-liners : des annonces formelles retournées en une phrase, le même ressort qu'un PS ou un message au service. Tinder avec un enfant ne parle pas d'écrit pro. `[À VÉRIFIER : la fiche parle de 10 vannes en 5 minutes, la durée en base est de 2 min 30]` |
| 3, couloir | Obl. Guillermo Guiz, « Les cabillauds, ces arrogants ! » (4 min 30). Fac. Kev Adams, « Du côté de chez vous » (5 min 20) | **Identique à A, aucun remplacement** | Moyenne (spec) | Je n'ai pas trouvé mieux. Une piste est retirée : Fary, « Le legging » (5 min, déjà utilisée dans Confiance 6), dont la fiche parle de construire 8 minutes sur un seul objet, soit la leçon inverse d'une phrase de quinze secondes, et un legging n'est pas un irritant partagé du bureau. La légende des cabillauds ne reprendra pas la lecture de la spec (« on reconnaît un collègue dans un poisson ») : elle viserait une personne, et la fiche dit seulement « observation surréaliste et logique impeccable ». |
| 4, afterwork | Obl. Roumanoff, « Carmen et la crise » (4 min 50). Fac. Florence Foresti, « Le styliste » (6 min) | Obl. **Guillermo Guiz, « Pas de sentiments au fast-food »** (4 min 30, jamais utilisée). Fac. Foresti inchangée | Moyenne à forte ; Foresti moyenne (spec) | Roumanoff passe à l'étape 1. Guiz fait d'un McDo un sujet entier (fiche : une réflexion existentielle sur un fast-food) : le geste de l'étape, un moment banal de la semaine devenu un récit. |
| 5, « tu fais quoi dans la vie ? » | Obl. Haroun, « L'impro et la répartie » (5 min 45, déjà utilisée dans Répartie 4, `[À MINUTER]`). Fac. Lisa Delmoitiez, « J'ai pas confiance en moi et j'ai raison » (6 min) | Obl. **Marina Rollman, « Les relations sociales »** (5 min 20, **déjà utilisée dans Répartie 1**, `[À MINUTER]`, au-dessus des 5 min). Fac. Delmoitiez inchangée | Moyenne à forte ; Delmoitiez moyenne (spec) | La fiche d'Haroun ne dit rien de la question. La fiche de Rollman parle de politesse, de conventions et de small talk : le terrain exact de « tu fais quoi dans la vie ? ». |
| 6, parole officielle | Une seule : Marina Rollman, « Les enterrements de vie » (6 min 40, déjà utilisée dans Confiance 4, `[À MINUTER]`) | Une seule : **Nora Hamzawi, « Les chagrins d'amour »** (4 min, chronique France Inter, **déjà utilisée dans Storytelling 3**) | **Moyenne à faible** : le sujet est un chagrin d'amour, pas une prise de parole | Le pot de départ n'est pas dans la fiche de Rollman. Hamzawi : fiche « lucidité et auto-dérision, style introspectif et mordant », soit le geste de l'étape (un fond sincère, une touche d'humour) ; 4 min, aucun extrait à minuter. **Si la légende ne tient pas ce pont, l'étape 6 reste sans vidéo plutôt qu'avec celle-ci.** |

**Bilan.** A : 8 vidéos jugées moyennes par la spec et 2 affirmations non tenues par la base, 2 vidéos déjà utilisées ailleurs et à extraire (`[À MINUTER]`). B : 5 vidéos changées (2 jamais utilisées : Roumanoff, Guiz « fast-food » ; 3 déjà utilisées dans d'autres parcours : Croce « avion », Rollman « relations sociales », Hamzawi), 1 extrait `[À MINUTER]`, toutes en ligne dans l'export du 10/10. Les 6 autres (VDB, Brokerss, Guiz « cabillauds », Kev Adams, Foresti, Delmoitiez) restent celles de la spec, moyennes pour 5 d'entre elles : je n'ai pas trouvé mieux parmi les 89, et le catalogue n'a aucun sketch sur la prise de parole officielle (l'alerte de la spec tient toujours). Si aucune vidéo ne te convainc à l'étape 6, l'étape peut n'en avoir aucune (vide assumé plutôt que placeholder bancal).
**Reco : B.** Le gain est net aux étapes 1 et 5 (la spec s'appuie sur une phrase absente de la fiche, ou place la vidéo là où elle sert le moins), léger aux étapes 2 et 4, nul à l'étape 3 (gardée), et à l'étape 6 il tient à la légende ou à l'absence de vidéo. Les 3 vidéos déjà utilisées de B (Confiance 1, Répartie 1, Storytelling 3) sont vues à d'autres étapes d'autres parcours, jamais dans le même parcours. Les légendes des étapes 2 à 6 s'écrivent avec les étapes, en regardant chaque vidéo.

**Choix 8 : plafond des vidéos facultatives.** La spec plafonne à 5 min la vidéo **obligatoire** seulement. Les facultatives de B qui dépassent 5 min sont au nombre de 4 : Kev Adams (5 min 20), Brokerss (5 min 40), Foresti et Delmoitiez (6 min chacune). Option **a** : pas de plafond, la facultative reste entière, c'est son rôle. Option **b** : même plafond de 5 min, donc 4 extraits à minuter (5 avec Tsamère si tu choisis 5A). La promesse de 15 minutes compte la vidéo obligatoire et le quiz (signalement 7) ; qui regarde aussi la facultative dépasse, et c'est son choix. **Reco : a.**

---

## 7. La progression d'exposition et le garde-fou « jamais viser une personne » (choix 6)

**Vue d'ensemble de la progression d'exposition sociale.** Le parcours monte d'un cran à la fois, de personne qui t'entend à toute une salle, et chaque exercice a une version sans risque au boulot. C'est ce qui rend vraie la promesse « sans te griller » de la fiche (choix 2).

| Étape | Situation | Ce qu'on fait | Qui l'entend | Repli sans risque |
|---|---|---|---|---|
| 1 | La réunion | Écouter et compter les formules qui reviennent, garder une phrase pour toi | Personne : tu ne dis rien | Repenser à la dernière réunion, ou prendre un fil de mails à rallonge |
| 2 | Le mail ou le message | Glisser un PS d'une ligne dans un mail à faible enjeu | Un collègue, après relecture | Garder le PS en brouillon, jamais envoyé (avec la retouche du choix 7) ; sinon l'écrire pour ton dernier mail et le montrer à un ami |
| 3 | Le couloir | Dire en marchant une phrase de dix mots maximum sur un irritant partagé | Une personne croisée, 15 secondes | La dire seul, à voix haute, en traversant une pièce, puis faire cinq pas de plus |
| 4 | L'afterwork | Raconter en trente secondes un moment absurde de ta semaine (décor, escalade, chute) | Un petit groupe, 30 secondes | La raconter à un ami hors boulot qui ne connaît rien à ton travail |
| 5 | Le « tu fais quoi dans la vie ? » | Répondre en deux phrases (25 mots au plus) à la première personne qui te le demande | Des gens que tu connais peu | La dire trois fois à voix haute |
| 6 | La parole officielle | Écrire un mot de soixante secondes : un souvenir, une seule touche d'humour, une fermeture `[conseil en cours de relecture]` | Toute la salle, le jour J ; pendant l'exercice, personne | Écrire le texte et compter les mots, sans rien prononcer |

Sources : les conseils des étapes 3, 4, 5 (§1, validés à l'aveugle), le défi du PS (étape 2), l'étape 1 (§3), et la version en cours de relecture du conseil de l'étape 6.

**Le garde-fou.** La spec le range en « vigilance » par étape. Chaque étape l'applique déjà à sa manière ; la question est de savoir si le parcours le dit **six fois différemment** ou **une fois, pareil partout**. Le cœur du parcours est là : l'humour au boulot se grille quand il vise quelqu'un, et le persona le sait.

| Étape | **A : une vigilance propre à chaque étape** (déjà dans la spec) |
|---|---|
| 1 | Tu notes des formules, jamais ce que fait une personne. |
| 2 | Aucun envoi exigé ; le message reste montrable à tout le service (règle de la capture d'écran, déjà dans le conseil en ligne). |
| 3 | Un irritant partagé, jamais une personne. |
| 4 | L'anecdote met un moment absurde au centre, toi dedans, pas un collègue. |
| 5 | Tu te décris sans mépriser ton métier ni ton employeur. |
| 6 | Tu vises la situation, et tu n'ouvres jamais par l'humour. |

**B : un seul test, le même du début à la fin.** Une phrase fixe, identique mot pour mot, en dernière phrase du texte (`moduleDetail`) des étapes 2 à 6, sans encadré ni titre en gras :
> Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?

À l'étape 1, rien à dire donc rien à sortir : la phrase `[SI 6B]` du §3 l'introduit avec les mêmes mots et la fait essayer sans risque, dans tes notes, et le critère du défi reprend le même test. Les consignes de sécurité propres aux étapes (aucun envoi exigé à l'étape 2, repli sans public, pas d'humour en ouverture à l'étape 6, ni métier ni employeur moqués à l'étape 5) **restent dans les exercices** : le test unifie le réflexe, il ne remplace pas ces consignes.

**Reco : B.** Personne ne retient six consignes différentes ; une seule question se retient, elle s'applique à une réunion comme à un mail ou à un toast, et elle tient la promesse « sans te griller » de la fiche. Elle prolonge la règle du conseil en ligne de l'étape 2 (la capture d'écran) sans la répéter. Coût : une phrase par étape, aucune nouvelle fonction. Risque : l'effet « consigne qui revient » ; c'est pourquoi la phrase est unique, jamais numérotée, jamais nommée comme une méthode, et identique aux étapes 2 à 6. A reste le plan B si tu trouves la répétition scolaire.

<!--SUITE-->


