# Étalons du parcours Boulot (s19, 10/10/2026), version corrigée après l'itération 1

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 6 étapes du parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : nom « Parcours Boulot » ; 6 étapes ; 15 min/semaine ; XP 50, 75, 100, 100, 125, 150 + 100 de fin ; étape 1 lisible par le visiteur, validation Premium ; textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication (3 questions par étape, 4 à la dernière, bonne réponse répartie sur les positions) ; repli solo sur chaque exercice ; « première étape gratuite », jamais « cours gratuit » ; doublons de vidéos et de vannes acceptés ; « Expert » jamais affiché ; pas de certificat ; pas de compte gratuit ; prix inchangés. Le Boulot n'est la cible d'aucun profil du quiz d'humour (spec §12) : rien à décider là-dessus.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin dans les textes, pas scolaire, pas corporate, aucune mention d'IA, aucun concurrent, aucun prénom de persona (« Anouk » est un exemple, jamais présenté comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où la fiche vidéo en base les cite, jamais viser une personne (la situation, le système, soi-même). Le mot « carnet » est le nom d'une fonction du site : dans tous les textes, on dit « tes notes ». Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi.** Faits relus dans `docs/content/boulot-base-s19.json` (export prod du 10/10, lecture seule, rien n'a été re-requêté). Vannes et vidéos rapprochées des parcours en ligne par texte et par `youtubeId` (`parcours-reecriture-s17.json`, `parcours-storytelling-s18.json`).

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | § | Point | Options | Ce que ça change pour la lectrice | Reco |
|---|---|---|---|---|---|
| 1 | 1 | Les 6 conseils du parcours | Tu valides chaque texte quand il a passé la relecture à l'aveugle (2 critiques sur 2). Passés : étapes 1, 3, 4, 5, 6 (textes en §1). Déjà en ligne : étape 2 | Le conseil est le cœur de chaque étape ; un conseil sous la barre ne revient jamais en ligne | **Valider** les quatre textes du §1 |
| 2 | 2 | Fiche du parcours (description, accroche, témoignage « Imagine… ») | A sobre / B complice | Elle se reconnaît dès la première phrase de la fiche | **B** |
| 3 | 4 | Titre de la page (60 caractères max) et slug | A « oser sans te griller » avec la durée / B « du mail au pot de départ » avec la durée | La page promet ce que le parcours tient, et ne se confond pas avec Machine à Café dans Google | **A**, slug `boulot` |
| 4 | 5 | Vannes des 6 étapes (30 places) | A vannes déjà en ligne quand elles collent + 17 vannes neuves relues à l'aveugle / B vannes en ligne partout, y compris hors boulot | Les vannes montrent le sujet de l'étape (le couloir) au lieu d'un barbecue | **A** |
| 5 | 6 | Vidéos des 6 étapes | A celles de la spec / B mes remplacements pour les étapes 1, 2, 4, 5 et 6 (étape 3 gardée comme dans la spec) | Les vidéos collent mieux à la leçon de l'étape, surtout aux étapes 1, 5 et 6 | **B** (tu peux dire « B sauf étape X ») |
| 6 | 7 | Garde-fou « jamais viser une personne » | A une consigne propre à chaque étape / B un seul test, le même du début à la fin | Une seule question à retenir au lieu de six consignes | **B** |
| 7 | 1 | Retouche du défi du PS (étape 2, conseil déjà en ligne) | Oui : une phrase ajoutée / Non : défi inchangé | Aujourd'hui le défi demande d'envoyer un PS drôle dans un vrai mail de travail : c'est exactement ce qui fait peur à la lectrice. La retouche lui permet de garder le PS en brouillon | **Oui** |
| 8 | 6 | Plafond de durée des vidéos facultatives | a Pas de plafond (la spec ne plafonne que la vidéo obligatoire, à 5 min) / b Même plafond de 5 min, donc des extraits à minuter | Cinq facultatives du parcours durent 5 min 20 à 7 min 30 : sans plafond, elles restent entières et facultatives | **a** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis, tu valides le texte ou tu corriges un mot. Elle est écrite sur le conseil validé à l'aveugle (tour 5) : « Ce que raconte une salle de réunion ». Trois éléments dépendent d'un choix : les deux vidéos et leurs légendes (choix 5), trois des cinq vannes (choix 4) et une phrase finale du texte d'étape (choix 6, marquée `[SI 6B]`).
**« Je suis tes recos » suffit** : valider le choix 1 (quatre textes passés à l'aveugle : étapes 1, 3, 4, 5), puis B (fiche), A (titre), A (vannes), B (vidéos), B (garde-fou), oui (retouche du PS), a (pas de plafond pour les facultatives). Le détail et les textes complets sont dessous. Rien d'autre ne demande de réponse de ta part : les signalements en fin de fichier sont de l'information.

## Ce que la base a changé (faits relus le 10/10)

- **Conseils** : sur les 97 conseils au titre « bureau », 3 seulement sont en ligne. Un seul sert le parcours : « Le PS qui détend un mail sérieux » (étape 2), au niveau. Un deuxième, « Compare la manie d'un collègue à un autre métier », vise une personne, même avec tendresse : il est écarté. Le troisième, « Décrire tes révisions comme une rencontre », n'a aucun rapport avec le boulot. Quatre conseils prévus étaient **retirés** le 30/09 (sous la barre) : « Survivre aux réunions avec humour » (1), « La vanne de couloir : l'art du timing entre deux réunions » (3), « L'afterwork : passer de collègue à personne drôle » (4), « Survivre (et briller) au networking pro avec humour » (5). Ils sont réécrits à neuf (voir §1). Pour l'étape 2, la spec prévoyait « L'humour digital : mails, Slack et textos pro » (id 53) ; son équivalent en base, « L'humour par mail, Slack et Teams », est retiré lui aussi : le PS, en ligne et au niveau, le remplace. Le conseil de l'étape 6 (prise de parole officielle) n'existe pas parmi les 97 conseils « bureau » ; la vérification sur tous les conseils en ligne de la base reste à faire `[À VÉRIFIER @fullstack : aucun conseil en ligne ne couvre déjà la prise de parole officielle]`. Les ~90 autres conseils « bureau » retirés (tics et rituels de collègues, lundi matin) ne reviennent pas : ils ciblent des personnes.
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
| 1 | « Ce que raconte une salle de réunion » (conseil neuf). La variante « Compter ce que personne ne compte » et la première version (« Survivre aux réunions avec humour ») sont abandonnées | **Validé à l'aveugle (tour 5)** (2 critiques sur 2). Texte ci-dessous |
| 2 | « Le PS qui détend un mail sérieux » | **En ligne, au niveau.** Trois règles de forme (une ligne après la signature, un sujet sans rapport, un sérieux total), règle d'or de la capture d'écran. Retouche éventuelle du défi : choix 7 ci-dessous |
| 3 | « La vanne de couloir : l'art du timing entre deux réunions » | **Validé à l'aveugle** (2 critiques sur 2), repli joué seul. Texte ci-dessous |
| 4 | « L'afterwork : passer de collègue à personne drôle » | **Validé à l'aveugle** (2 critiques sur 2). Texte ci-dessous |
| 5 | « Survivre (et briller) au networking pro avec humour » | **Validé à l'aveugle** (2 critiques sur 2). Texte ci-dessous |
| 6 | « Le toast de soixante secondes qui tient debout » (conseil neuf) | **Validé à l'aveugle (tour 6)** (2 critiques sur 2). Texte ci-dessous |

Les cinq textes validés sont copiés à l'identique, sans retouche (une retouche les ferait repasser à l'aveugle).

### Étape 1 : « Ce que raconte une salle de réunion » (validé à l'aveugle (tour 5))
**Catégorie** : OBSERVATION · **Difficulté** : INTERMEDIAIRE
**contenu** : Une salle de réunion en dit plus long que ceux qui s'y réunissent. Regarde les traces : le scotch sur la télécommande, le « NE PAS EFFACER » vieux de deux ans, le feutre qui n'écrit plus mais qu'on a rangé quand même. Chaque trace est un petit fait divers que personne n'a raconté. Ton geste : choisis une trace et raconte-la en deux phrases courtes, au présent, sur le ton d'un constat. La première dit ce que tu vois, mot pour mot. La seconde ajoute le détail que cette trace laisse supposer (un chiffre, une durée), dit avec le même sérieux. Pas de commentaire, pas de morale, pas de personnage dans la phrase : le mobilier suffit, et il ne se vexera pas. Pour l'instant, tu ne dis rien : tu observes et tu écris.
**exemple** : Salle du deuxième, 14 h. Trace relevée : la télécommande du vidéoprojecteur, scotchée à la table.
Phrase écrite pour la prochaine fois : La télécommande est scotchée à la table. Depuis deux ans, seules les piles disparaissent.
**exercice** : DÉFI TRACE : aujourd'hui ou à ta prochaine réunion, repère dans la salle trois traces (un scotch, une étiquette, une rature, un mot oublié) et note-les. Choisis-en une et écris-la en deux phrases courtes : la première décrit ce que tu vois, la seconde ajoute un chiffre ou une durée que la trace laisse supposer. Tu ne dis rien à personne : elles restent dans tes notes. C'est réussi si tu as trois traces notées, si tes deux phrases sont au présent (relis-les : elles doivent rester justes si tu les fais commencer par « En ce moment, »), si la seconde contient un chiffre ou une durée, et si elles ne contiennent aucune personne, ni nom ni fonction. Pas de réunion en vue, ou elle se passe en visio ? Fais-le sur la première pièce où tu passes (cuisine, escalier, la pièce où tu es) : n'importe quel objet qui porte une trace compte.

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

### Étape 6 : « Le toast de soixante secondes qui tient debout » (conseil neuf, validé à l'aveugle (tour 6))
**Catégorie** : STORYTELLING · **Difficulté** : INTERMEDIAIRE
**contenu** : Pot de départ, présentation d'équipe, toast : soixante secondes suffisent, à condition de les ranger en trois blocs. D'abord un moment sincère et précis (un souvenir daté, pas « elle est géniale »). Ensuite une seule touche d'humour, et la plus sûre est un rappel : tu reprends un détail de ton souvenir (une phrase, un objet, un geste) et tu le retournes contre toi. C'est pour ça que l'humour vient en deuxième : un rappel n'existe qu'après ce qu'il rappelle, et la salle rit d'abord de reconnaître le détail. Deux phrases suffisent : la première dit ce qui t'arrive aujourd'hui, la seconde fait revenir le détail, de préférence sur le dernier mot. La cible, c'est toi ou le détail lui-même. Jamais la personne honorée, ni l'organisation, le buffet ou un responsable. Une seule vanne à prononcer, la deuxième efface la première ; une de rechange dans ta poche ne coûte rien. Enfin une phrase de fermeture pour lever le verre. Compte environ 120 mots pour une minute.
**exemple** : Sincère (83 mots, 41,5 secondes) : Le jour de mon arrivée, il y a quatre ans, Claire m'a montré où était la machine à café avant de me montrer mon bureau. Ça m'a dit tout ce que je devais savoir de cette équipe. Un soir où tout allait de travers, elle m'a dit « on regarde ça demain à tête reposée ». Le lendemain, c'était réglé, et je n'ai jamais su comment. Depuis, quand je ne trouve pas un dossier, c'est elle que j'appelle, et elle sait toujours où il est. / Humour (16 mots, 8 secondes) : Ce soir, j'ai bien tenté de reporter ce discours. On regarde ça demain à tête reposée ? / Fermeture (8 mots, 4 secondes) : Claire, merci pour ces quatre ans. À Claire ! / Total : 107 mots, 53,5 secondes.
**exercice** : DÉFI SOIXANTE SECONDES : écris un toast en trois blocs : un souvenir précis, une seule vanne en rappel, une phrase de fermeture. Pas besoin d'être sur place : imagine-toi au pot et note deux choses qui seraient vraies pour toi ce soir-là (ce que tu ressentirais, ce que tu aurais préparé, ce que tout le monde ferait en attendant que tu parles). Transforme chacune en rappel, c'est l'étape qui fait d'un fait une vanne : pars d'un détail de ton souvenir (une phrase, un objet, un geste), un différent pour chaque, puis écris deux phrases. La première dit ce qui t'arrive, la seconde fait revenir le détail contre toi, de préférence sur le dernier mot. Garde la meilleure pour ton toast et l'autre en vanne de rechange : le jour J, si l'ambiance n'est pas celle que tu imaginais, tu changes de vanne sans toucher au reste. Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. Pas besoin de chrono : compte tes mots. C'est réussi s'il fait entre 100 et 125 mots (c'est ta minute), si la vanne arrive après le souvenir, si elle reprend un détail de ce souvenir et se retourne contre toi (ou contre ce détail, jamais contre la personne qui l'a dit ou donné), sans viser la personne honorée, l'organisation, le buffet ni un responsable, et si tu as noté une vanne de rechange à côté. Rien à prononcer : le toast reste sur ta feuille jusqu'au jour J.

### Choix 7 : retouche du défi du PS (étape 2, conseil en ligne)
Le défi en ligne dit : « DÉFI PS : aujourd'hui, ajoute un PS d'une ligne à UN mail ou message pro sérieux, sur un détail minuscule sans rapport avec le fond. Il doit rester présentable si ton chef le lit. Pas de mail pro à envoyer aujourd'hui ? Écris le PS que tu aurais ajouté au dernier mail sérieux que tu as envoyé, et montre-le à un ami. C'est réussi quand ton PS tient en une ligne et n'a rien à voir avec le fond. » Il demande d'envoyer un trait d'humour dans un vrai mail de travail, alors que la spec exige « aucun envoi exigé » et un message à faible enjeu.
**Retouche proposée** : une phrase, insérée juste après « si ton chef le lit. » : « Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. » En base ET dans `conseils-seed.json`. **Reco : oui.** Comme toute correction d'un conseil en ligne, la version retouchée repasse la relecture à l'aveugle avant d'être mise en base. Si tu dis non, l'étape 2 garde le défi tel quel et la progression du §7 ne peut plus affirmer « rien tant que tu n'envoies pas ».

**Reco choix 1 : valider** les quatre textes ci-dessus (étapes 1, 3, 4, 5). Si le texte en cours (6) ne passe pas à l'aveugle, il ne revient pas : on le réécrit, on ne le remplace pas par un conseil sous la barre. L'étape 1 du §3 est écrite sur le conseil validé : son exercice est le DÉFI TRACE mot pour mot, et le texte d'étape, la scène et le quiz portent sur le même enseignement (un seul par étape).

---

## 2. Fiche du parcours (choix 2)

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose : 6 semaines, six situations du travail, on commence par observer et on finit par parler, la vanne vise la situation et jamais une personne. Rien n'annonce de score, de certificat ni de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ». Champs inchangés de la spec : `slug` `boulot`, `duration` « 6 semaines », `timePerWeek` « 15 min/semaine », `difficulty` DEBUTANT, `difficultyLabel` « DEBUTANT → INTERMEDIAIRE », `order` 5, `icon` à @design, `persona` « Sophie (26 ans, jeune active en CDI) » (champ de la même forme que celui de Storytelling).

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Au bureau, tu as des vannes en tête et tu les gardes pour toi, de peur de te griller. En 6 semaines, tu apprends à en placer une dans six situations du travail : la réunion, le mail ou le message, le couloir, l'afterwork, le « tu fais quoi dans la vie ? » et la prise de parole officielle. Tu commences par observer, tu finis par parler, et ta vanne vise toujours la situation, jamais une personne. | Il y a toujours une vanne qui t'est venue en réunion et qui y est restée. En 6 semaines, tu apprends à la sortir sans te griller, un cran à la fois : d'abord en observant une salle de réunion sans rien dire, puis dans un mail, dans un couloir, à l'afterwork, quand on te demande « tu fais quoi dans la vie ? », et enfin quand la parole est officielle, pour un mot de départ ou un toast. Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un. |
| `personaTagline` | Pour toi si tu es drôle avec tes amis, mais que tu te retiens au bureau, de peur de tomber à plat ou d'en faire trop | Pour toi si tu fais rire tes amis le samedi et que tu redeviens sérieux comme un compte rendu le lundi à 9 h |
| `testimonial` | Imagine Anouk. En réunion, elle avait toujours une phrase en tête qu'elle gardait pour elle, de peur de tomber à plat devant tout le service. Six semaines plus tard, elle glisse un PS dans un mail, un mot dans le couloir, et c'est à elle qu'on demande de dire quelques mots au pot de départ de vendredi. | Imagine Anouk, 26 ans, en CDI. Il y a six semaines, elle gardait ses vannes pour la sortie du bureau. Hier, devant l'imprimante qui mettait quatre minutes à sortir une page, elle a lâché : « Elle prépare son discours de pot de départ. » Deux collègues ont ri. L'imprimante n'a pas relevé. |

**Reco : B.** Trois champs, trois idées différentes : le programme et la vanne restée en réunion (description), le contraste entre le samedi avec les amis et le lundi à 9 h (accroche), le résultat visible (témoignage). L'accroche ne répète pas la description et ne partage aucun mot de situation avec celle de Machine à Café (« pause, réunion, afterwork »). Le témoignage B porte le garde-fou du parcours dans sa chute : la vanne vise l'imprimante, personne d'autre. La description B rend la promesse « sans te griller » vérifiable (« chaque exercice a une version sans risque », tableau du §7). A reste le plan B si tu trouves la formule « elle y est restée » trop familière pour une page de vente.
**Réserve sur le témoignage B** : la vanne de l'imprimante est une vanne neuve publiée sur la page de vente, elle doit passer la même relecture à l'aveugle que les autres avant ta validation `[À PASSER À L'AVEUGLE]`. Si elle ne passe pas, le témoignage A sert de repli (règle d'or).
Vérifié contre le parcours : chaque élément cité existe dans une étape (observer une salle de réunion = 1, mail = 2, couloir = 3, afterwork = 4, « tu fais quoi dans la vie ? » = 5, mot de départ ou toast = 6). Le témoignage A cite un PS (2), un mot dans le couloir (3) et un pot de départ (6) ; le B cite le couloir et le pot de départ avec une seule vanne.
Le prénom « Anouk » n'est ni un prénom de persona, ni un prénom d'humoriste des vidéos du parcours, ni celui d'un exemple déjà utilisé ailleurs (Samir, Maëlle, Léa). Il revient dans la scène de l'étape 1 (§3).
**Boulot ou Machine à Café d'abord ?** Aucun prérequis entre les deux : Machine à Café, c'est la pause, la réunion et l'afterwork pour faire rire ; Boulot, ce sont six situations où l'on t'écoute vraiment, une à la fois, de l'observation à la parole officielle. Le classement de départ de la spec (§5.5) n'est qu'une suggestion. Cette ligne est pour toi, pas pour le site ; ton choix 2 la valide.

---

## 3. Étape 1 complète : « La salle de réunion, sans un mot »

C'est la vitrine que le visiteur lit avant de payer. Aucun A/B : forme acquise (version B avec scène, repli solo, quiz complice). L'étape est écrite sur le conseil validé à l'aveugle (tour 5), « Ce que raconte une salle de réunion » (§1) : lire les traces qu'une salle a gardées, écrire deux phrases au présent dont la seconde ajoute un chiffre ou une durée, aucune personne dans la phrase. Réécriture du tour 5 : l'ancienne version, bâtie sur les formules de réunion (bingo), est abandonnée.

**Ce qui doit se lire face à deux étapes gratuites qui lui ressemblent.** Machine à Café 2 (« Lire le tempo du groupe : savoir quand c'est ton tour », module « Sentir le bon moment ») est de l'observation en réunion, et Confiance 1 (« Redécouvrir ce qui te fait rire », conseil « Énoncer la règle non écrite ») est de l'observation sans parole dans un lieu. Les deux sont gratuites : une visiteuse peut lire les trois à la suite. Défi de Machine à Café 2 relu en base le 10/10 (« DÉFI BLANCS ») : repérer et compter les blancs qui suivent chaque rire, puis poser une phrase au premier blanc ; il porte sur des gens qui rient, pas sur des objets. Conseil et défi de Confiance 1 relus en base le 10/10 (`conseils-seed.json`, `parcours-seed.json`) : « Énonce à voix haute une règle non écrite que tout le monde applique », lieu où les gens sont proches sans se parler (ascenseur, salle d'attente, transport), formulée comme un article de loi. Ce n'est pas une observation d'objets : la matière est ce que les gens font. Seul son exemple d'ascenseur (« on regarde les chiffres monter ») regarde un objet, mais pour en tirer un comportement collectif. Son quiz porte aussi sur des comportements (salle d'attente, métro, file d'attente).

| | Machine à Café 2 | Confiance 1 | Boulot 1 |
|---|---|---|---|
| Ce qu'on regarde | **Le rythme** d'un groupe : où ça monte, où ça retombe, où il y a de la place | **Une règle non écrite** que des gens appliquent dans un lieu | **Les traces qu'un objet a gardées** dans une salle (scotch, étiquette, rature), **sans aucune personne** |
| Ce qu'on fait | Poser une phrase au premier moment libre | La formuler comme un article de loi | **Écrire deux phrases au présent, sans rien dire** |
| Ce qu'on garde | Le moment où il y aurait eu de la place | Une règle formulée | **Deux phrases dans tes notes**, jamais dites |
| Ce qui se mesure | Avoir senti le bon moment | Avoir repéré ou noté une règle | **Trois traces notées, un chiffre ou une durée dans la seconde phrase, aucune personne** |
| Où | Pause, réunion, afterwork | Un lieu où on se croise sans se parler | Une salle de réunion ; à défaut (pas de réunion, ou visio), la première pièce où tu passes |

Aucun texte destiné au site pour l'étape 1 ne reprend le vocabulaire du rythme de Machine à Café 2 (tempo, blanc, silence, rythme, morceau) ni celui de la règle de Confiance 1 (règle, article, loi, tout le monde) : pour qui a fait l'une ou l'autre, ici on ne regarde ni le groupe ni ses habitudes, on lit ce qu'un objet a laissé. Aucune bonne réponse du quiz n'est citée dans la scène ni dans l'exercice. Le tableau ci-dessus est une note pour toi, pas du texte affiché.

| Champ | Texte |
|---|---|
| `moduleTitle` | La salle de réunion, sans un mot (remplace « Ta prochaine réunion, en spectateur », qui annonçait l'ancien angle) |
| `tipTitle` | Ce que raconte une salle de réunion (conseil validé, §1) |
| `why` (« Pourquoi cette étape ? ») | Avant de sortir une vanne au boulot, il faut une matière qui ne vexe personne. Les objets d'une salle de réunion en sont une : chaque scotch, chaque étiquette jaunie cache un petit fait divers que personne n'a raconté. Ici, tu les repères et tu les gardes dans tes notes. |
| `moduleDetail` (version B, scène) | Imagine Anouk, mardi, 9 h 50, seule dans la salle de réunion. Elle ne touche à rien, elle regarde : une chaise d'une autre couleur que les autres, un carton plié en quatre sous un pied de table, un rideau retenu par une pince à linge. Elle choisit le carton et écrit deux phrases dans ses notes : « Un carton plié en quatre cale un pied de la table. Il tient depuis trois ans et en est à sa deuxième table. » Elle ne les montre à personne. Dans cette étape, tu fais pareil : trois traces repérées, deux phrases écrites, rien à dire. `[SI 6B : Le test à retenir pour toute la suite : ta phrase passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? Ici, ta phrase ne parle que d'un objet : tu peux l'essayer sans risque, dans tes notes.]` |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 50 / oui / 3 (spec, inchangé) |
| `dureeTexte` | `[À MESURER]` : la spec estime 13 min 30 hors mesure ; rien n'est écrit tant que la mesure n'est pas faite. Ordre de grandeur au signalement 7. |

Le repli (« pas de réunion en vue, ou visio ») n'est écrit qu'une fois, dans l'exercice, tel que le conseil validé le dit. Le `moduleDetail` fait 100 mots hors phrase `[SI 6B]` (comptés un à un, « 9 h 50 » pour trois mots) ; le `why` en fait 49.

**Exercice « aujourd'hui »** : c'est le DÉFI TRACE du conseil validé (§1), recopié sans retouche (une retouche le ferait repasser à l'aveugle). Il est de l'observation seule et sans risque pour un visiteur : tu ne dis rien, tu n'envoies rien, tu ne montres rien à personne, les phrases restent dans tes notes, et le repli ne demande aucun public.

> DÉFI TRACE : aujourd'hui ou à ta prochaine réunion, repère dans la salle trois traces (un scotch, une étiquette, une rature, un mot oublié) et note-les. Choisis-en une et écris-la en deux phrases courtes : la première décrit ce que tu vois, la seconde ajoute un chiffre ou une durée que la trace laisse supposer. Tu ne dis rien à personne : elles restent dans tes notes. C'est réussi si tu as trois traces notées, si tes deux phrases sont au présent (relis-les : elles doivent rester justes si tu les fais commencer par « En ce moment, »), si la seconde contient un chiffre ou une durée, et si elles ne contiennent aucune personne, ni nom ni fonction. Pas de réunion en vue, ou elle se passe en visio ? Fais-le sur la première pièce où tu passes (cuisine, escalier, la pièce où tu es) : n'importe quel objet qui porte une trace compte.

(Repli solo : tes notes, rien d'autre. Repli de situation : la première pièce où tu passes. Une visio n'a pas de salle à lire : elle tombe sur ce repli, ce qui remplace l'ancienne règle « une visio compte comme réunion » (arbitrage 7, version abandonnée). Le test de l'équipe entière n'a pas de critère propre dans le défi : « aucune personne, ni nom ni fonction » le satisfait d'avance, et la phrase `[SI 6B]` du `moduleDetail` suffit à l'introduire.)

**Quiz, trois questions** (ton B complice, 4 réponses). La question 1 porte sur ce qui vaut d'être noté (une trace qui reste, pas un accident du jour), la question 2 sur la seconde phrase (un chiffre, un ton de constat, aucune personne), la question 3 sur le repli (pas de salle, quand même un objet). Positions de la bonne réponse : **B, D, A** (jamais deux de suite au même rang). Aucun prénom dans le quiz : le seul prénom de l'étape est celui de la scène.

**Question 1 (bonne réponse en B)**
> **Tu entres dans une salle de réunion vide. Une seule de ces quatre choses sera toujours là dans un mois. Laquelle devient ta trace ?**
> A. « Le vidéoprojecteur qui se met en veille au milieu d'un graphique. » (11 mots)
> **B. « Un post-it au feutre pâli, collé sous l'écran du fond. »** (10)
> C. « Une odeur de café brûlé qui arrive du couloir. » (9)
> D. « Du café renversé sur l'ordre du jour, encore humide. » (9)
>
> **Explication (affichée quelle que soit la réponse, 2 phrases)** : La B. Un post-it pâli est une marque que la salle garde toute seule : dans un mois, il sera toujours là, et ton constat aussi. Le vidéoprojecteur en veille, l'odeur et le café renversé sont des événements du jour, et on ne les retrouvera pas la semaine prochaine.

**Question 2 (bonne réponse en D)**
> **Ta première phrase est écrite : « Un cadenas ferme le placard à fournitures. » Laquelle de ces secondes phrases colle à ce que demande le conseil ?**
> A. « Il est surtout là pour rappeler à l'équipe qui détient la clé. » (12 mots)
> B. « Il protège surtout des choses inutiles, comme beaucoup d'autres choses dans cette boîte. » (13)
> C. « Il a des copains sur le frigo et sur la photocopieuse. » (11)
> **D. « Il est neuf, et il garde deux stylos et une agrafeuse cassée. »** (12)
>
> **Explication (3 phrases)** : La D. Elle ajoute un chiffre que le cadenas laisse supposer (deux stylos derrière un tel verrou) et reste sur le ton du constat. La A vise celui qui garde la clé, et la B tire une morale. La C empile une autre observation, sans chiffre ni durée.

**Question 3 (bonne réponse en A)**
> **Cette semaine, ton agenda ne contient que des appels en vidéo. Comment fais-tu l'exercice des traces ?**
> **A. « Tu regardes la pièce où tu te trouves : tout objet marqué convient. »** (12 mots)
> B. « Tu attends la prochaine réunion dans une vraie salle. » (9)
> C. « Tu relèves ce qu'on voit derrière les autres, dans leur fenêtre. » (11)
> D. « Tu demandes à un collègue de te décrire les murs de son bureau. » (13)
>
> **Explication (2 phrases)** : La A. Un objet marqué suffit, donc la pièce où tu es fait l'affaire dès aujourd'hui. La B repousse l'exercice, la C te fait regarder chez les autres, et la D met un collègue dans la boucle alors que tout reste dans tes notes.

**Pourquoi chaque mauvaise réponse tombe.** Question 1 : les trois mauvaises réponses sont des événements du jour (une panne, une odeur, un café renversé) qui auront disparu avant la semaine prochaine, et chacune est nommée dans l'explication ; aucune ne peut passer pour une marque durable. Question 2 : chaque mauvaise réponse enfreint une seule consigne du conseil (A : une personne est visée, B : une morale, C : aucun chiffre ni durée), ce que l'explication nomme ; la C, qui est la plus tentante, n'a ni commentaire ni personne. Question 3 : B, C et D sont les trois façons de rater le défi (le reporter, regarder les autres, faire parler un collègue). Les nombres entre parenthèses sont des notes pour toi, pas du texte affiché.

**Relecture arithmétique et lexicale (faite sur ce texte).**
- Nombres annoncés = nombres comptés : la scène montre trois traces (la chaise, le carton, le rideau et sa pince à linge) et le défi en demande trois ; elle écrit deux phrases, le défi en demande deux ; la seconde contient « trois ans » et « deuxième », une durée et un rang, comme le défi l'exige (un chiffre ou une durée). Le `why` compte 49 mots, le `moduleDetail` 100 hors phrase `[SI 6B]`. Le quiz annonce trois questions : il y en a trois.
- Les deux phrases de la scène respectent le défi : présent (« cale », « tient », « en est »), elles restent justes précédées de « En ce moment, », aucune personne ni nom ni fonction (carton, table). Elles ne reprennent ni l'exemple du conseil (télécommande, piles) ni ses trois traces (scotch, « NE PAS EFFACER », feutre).
- Aucun mot du rythme de Machine à Café 2 (tempo, blanc, silence, rythme, morceau) ni de la règle de Confiance 1 (règle, article, loi, tout le monde) dans `why`, `moduleDetail`, le défi, le quiz et les légendes. « Carnet » est remplacé par « notes » partout. « Blague » absent, aucun tiret cadratin.
- Aucune bonne réponse ne reprend un mot de sa question (Q1 : entres, salle, réunion, vide, seule, choses, toujours, mois, trace ; Q2 : phrase, cadenas, placard, fournitures, secondes, conseil ; Q3 : agenda, semaine, appels, vidéo, exercice, traces). Les trois bonnes réponses n'en reprennent aucun, et aucune mauvaise réponse non plus : aucun mot repris ne peut désigner la bonne.
- Forme des réponses : Q1 quatre groupes nominaux, Q2 quatre phrases en « Il », Q3 quatre phrases en « Tu ». Longueur en mots (bonne réponse entre parenthèses) : Q1 11, **10**, 9, 9 ; Q2 12, 13, 11, **12** ; Q3 **12**, 9, 11, 13. La bonne réponse n'est la plus longue ni la plus courte dans aucune des trois questions.
- Positions : B, D, A, soit trois rangs différents, jamais deux de suite.
- Cohérence avec le conseil : Q1 reprend « trace » (marque qui reste), Q2 « un chiffre, un ton de constat, pas de personne », Q3 le repli du défi. Aucune question ne porte sur autre chose que le conseil affiché (règle RC1).

**Les 2 vidéos** (plafond 5 min pour l'obligatoire, 1 obligatoire + 1 facultative, aucune minute inventée). Les légendes ne disent que ce que la fiche du catalogue établit, et elles invitent à observer : elles restent vraies quoi qu'on voie.

**Relecture des légendes pour le nouvel angle (objets et lieux).** Les anciennes (jargon pour VDB, système absurde pour Roumanoff) servaient les formules de réunion. VDB ne dit rien des objets ; Roumanoff (« personnage naïf face à un système absurde ») parle d'un système et d'une personne, pas d'un objet. Tsamère (plaidoirie solennelle sur un sujet qui ne l'est pas) reste juste : c'est le « même sérieux » que le conseil demande. Les deux fiches que je propose à la place ont un objet banal pour sujet : Fary, « L'objet signature : prendre un seul objet banal et construire des observations dessus » ; Vérino, « L'objet sacré : un distributeur de baguettes, un truc que personne ne remarque, regardé comme un étranger ». Fiches non visionnées.

| | Légende (`why`) |
|---|---|
| **Obligatoire, si choix 5B (reco)** : Fary, « Le legging » (5 min, déjà utilisée dans Confiance 6 avec une autre légende, doublon accepté) | Un seul objet banal, et tout le sketch tient dessus. Repère un détail de cet objet qui en dit plus long que l'objet lui-même : c'est le même regard que sur un scotch ou une étiquette dans ta salle de réunion. |
| *Facultative, **si choix 5B (reco)*** : Vérino, « Le distributeur de baguettes » (7 min 30, déjà utilisée dans Confiance 3 avec une autre légende ; entière avec le choix 8a, un extrait `[À MINUTER]` avec le 8b) | Un distributeur de baguettes, un truc que personne ne remarque, regardé comme par un étranger. Repère ce qu'il voit là où toi, tu passerais sans lever les yeux. |
| **Obligatoire, si choix 5A** : Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30) | Du jargon de bitcoin et de blockchain ramené au langage de tous les jours, avec la lucidité de quelqu'un qui n'y comprend rien. Repère chaque fois le mot simple qui prend la place du mot savant : c'est le regard neuf que tu poses sur ta salle. |
| *Facultative, **si choix 5A*** : Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Un avocat plaide pour la salade, la frite et la saucisse, avec tout le sérieux d'une vraie plaidoirie. Repère ce que ce ton solennel fait à un sujet qui ne l'est pas. |

(Sources : fiches de `boulot-base-s19.json`, « technique de l'objet signature [...] un seul objet banal », « technique de l'objet sacré [...] un truc que personne ne remarque [...] en le regardant comme un étranger », « détourner le jargon tech en langage de tous les jours », « la lucidité d'un mec qui n'y comprend rien », « plaidoirie hilarante ».)

**Les 5 vannes** (choix 4, §5), relues contre « ce que racontent les objets et les lieux du bureau ». L'ancienne version gardait « Mon manager m'a félicité pour ma discrétion » (Machine à Café 1) : elle parle d'une qualité de personne, pas d'un objet ni d'un lieu, donc elle sort de l'étape. Deux places sont communes aux deux options, texte exact en base, jamais utilisées dans un parcours :
- « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. » / « Il est là pour prouver qu'on pourrait. » (déplacée de l'étape 3, où elle servait moins la leçon : le couloir demande un irritant partagé, pas un objet regardé). Le lieu et l'objet portent tout : un constat dit sans sourire, puis une justification sérieuse. C'est le geste du défi, et aucune personne n'est visée.
- « Ma réunion 'point rapide avant l'été' a commencé à 14h. » / « On a fini par voter la police de caractère. » Le « point rapide » promet dix minutes, l'après-midi y passe, et la seule décision tient dans une police de caractère : un chiffre, une durée, un objet dérisoire. Elle colle à moitié (elle raconte la réunion plus que la salle).
Les trois autres places de l'étape 1 sont au §5 (neuves en A, tirées du catalogue en B).

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

Contrainte : 30 places (6 étapes × 5). Les ids de vannes de la spec viennent d'un seed périmé : on désigne chaque vanne par son **texte exact**. Il n'existe en tout que **16 vannes BOULOT en ligne**, dont 6 écartées ci-dessous, soit 10 retenues ; 3 vannes en ligne sur le travail rangées ailleurs s'y ajoutent (sur 5 trouvées : une est écartée pour son personnage, « à la base », une autre pour l'angle de l'étape 1, « discrétion »). Doublons de vannes acceptés (décision acquise), donc une vanne déjà en ligne peut servir.

**Écartées (garde-fou « jamais viser une personne », ou hors des 6 situations)**, avec le même critère pour toutes : la vanne ne doit pas avoir une personne pour cible, ou pour chute.
- « Mon collègue revient de 4 jours à Rome et me raconte tout en détail. » : la cible est le récit d'un collègue.
- « Ma collègue m'a briefé pendant 45 minutes avant ses congés pour me passer ses dossiers. » (Storytelling 2) : la cible est l'excès de zèle d'une collègue, même critère que Rome.
- « À mon pot de départ, mon chef a fait un discours de dix minutes… Bref. » (Storytelling 5) : l'explication en base dit que « la chute revient au chef qui réfute son propre éloge ». Le chef est visé, et à un pot de départ il est dans la salle : le test du §7 échoue. Une vanne de l'étape qui enseigne « jamais une personne » ne peut pas avoir un chef pour chute.
- « Quand quelqu'un commence par « à la base », il faut être patient. » (Confiance 1) : la technique (l'abstrait pris au pied de la lettre) colle à l'étape 1, mais l'explication en base parle du « collègue-tornade », donc d'une personne, et c'est déjà la vanne de l'étape gratuite de Confiance.
- « Avec un collègue, on a enfin comparé nos salaires. » : un sujet qui ne passerait pas le test de la salle entière (§7) devant tout le service.
- « Je télétravaillais chez ma mère… » et « Ma voisine m'a dit qu'elle m'entendait parler seul… » : le télétravail à la maison n'est pas une des 6 situations. La seconde n'est pas retenue pour l'étape 1 non plus : le mur d'un appartement n'est pas un objet du bureau.

**Lecture étape par étape** (« fort » = la vanne illustre la leçon de l'étape ; « acceptable » = elle l'illustre à moitié ; entre parenthèses, où elle est déjà en ligne) :

| Étape | En ligne, collent vraiment (fort) | En ligne, acceptables | Places à pourvoir par des vannes neuves (A) |
|---|---|---|---|
| 1, ce que racontent les objets et les lieux de la salle | « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. » (aucun parcours ; déplacée de l'étape 3) | « Ma réunion 'point rapide avant l'été' a commencé à 14h. » (aucun parcours) : elle raconte la réunion plus que la salle, mais l'objet dérisoire (la police) et le chiffre (14 h) sont ceux du défi | **3** |
| 2, le mail | « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » (Machine à Café 1) ; « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. » (Storytelling) ; « Mon adresse mail pro d'alternant commence par « alternant2 ». » (Répartie 2) | | **2** |
| 3, le couloir | « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » (Machine à Café 3) | « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. » (Confiance 1) | **3** |
| 4, l'afterwork | « J'ai passé mon stage à ranger les archives par ordre alphabétique. » (aucun parcours) ; « Pour mon entretien, j'ai emprunté le costume de mon père… Le recruteur m'a appelé Robert toute l'heure. » (Machine à Café 3) | | **3** |
| 5, « tu fais quoi dans la vie ? » | « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » (aucun parcours) ; « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. » (Confiance 2 ; l'homonyme dont on t'attribue les exploits : autodérision sur soi) | « Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements sont très bien ». » (Répartie 1) | **2** |
| 6, la parole officielle | | « Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze. » (Machine à Café 3) : l'explication en base dit que la vanne vise le titre qui se dévalue, pas le chef | **4** |
| **Total** | **9 fortes** | **4 acceptables** = 13 en ligne | **17 neuves** (13 + 17 = 30) |

`[À VÉRIFIER @fullstack : « tir à l'arc » est tirée de l'export du 07/10 ; contrôler qu'elle est toujours en ligne au 10/10 avant l'import.]`
Les 5 vannes BOULOT qui ne sont dans aucun parcours : 4 sont retenues (point rapide, canapé, archives, entretien) ; la cinquième (Rome) est écartée ci-dessus.
Techniques que les 17 vannes neuves doivent montrer (une fiche par étape, écrite avec l'étape) : 1, un objet ou un lieu du bureau décrit avec un sérieux total, avec un chiffre ou une durée, sans aucune personne dedans (le geste du défi) ; 2, un message beaucoup trop sérieux pour son sujet (ressort du PS) ; 3, un irritant partagé dit en une phrase qui tient en quinze secondes ; 4, un moment absurde de la semaine en trois temps, la chute étant la phrase la plus courte ; 5, un métier décrit honnêtement en deux phrases, sans mépriser ni le poste ni l'employeur ; 6, une sincérité suivie d'une seule touche, ou une solennité décalée, prise dans le décor de la salle. Aucune ne vise un collègue ou un chef : l'explication de chaque vanne dit ce qu'elle vise (la situation, le système, soi).

**A (reco)** : les 13 vannes en ligne ci-dessus là où elles collent, et **17 vannes neuves** (catégorie BOULOT), écrites par @copywriter puis relues à l'aveugle par deux relecteurs avant l'import ; rien n'est importé avant d'avoir passé la relecture (règle d'or).
**B** : les mêmes 13, et 17 autres choisies parmi les 127 vannes en ligne du catalogue (à la date de l'export, 08/10) pour leur technique, sans lien avec le travail. Plus rapide, aucun texte à relire, mais l'étape « couloir » montrerait par exemple un barbecue.
Une étape qui ne montre pas son propre sujet est un défaut que l'audit des parcours de s17 reprochait déjà aux parcours existants, et le Boulot n'a qu'un seul argument : le travail. 17 vannes neuves, c'est plus de trois fois le lot de Storytelling (5), parce que je n'ai repéré que 21 vannes en ligne sur le travail en tout (16 BOULOT, 5 rangées ailleurs ; recherche par mots-clés sur les 127 en ligne, `[À VÉRIFIER]` si tu veux un inventaire exhaustif). **Reco : A.**
Si tu préfères un lot plus petit : A pour les étapes 1, 3, 4 et 6 (les plus faibles en vannes déjà en ligne : 2, 2, 2 et 1 sur 5), B pour les étapes 2 et 5 (3 sur 5 chacune). Dis-le, c'est un détail d'import.

---

## 6. Vidéos des 6 étapes (choix 5 et choix 8)

Règle : 1 vidéo obligatoire (plafond 5 min, au-delà un extrait minuté) + 1 facultative, étape 6 une seule. Je n'invente aucune minute : tout extrait est marqué `[À MINUTER]`. Les 11 vidéos de la spec sont en ligne. La spec en juge 8 « moyennes » (Tsamère, Croce « Tinder », Brokerss « Snapchat », Guiz « cabillauds », Kev Adams, Roumanoff, Foresti, Delmoitiez) et 3 « fortes » (Thomas VDB, Haroun, Rollman). **Deux des trois « fortes » reposent sur une phrase qui n'est pas dans la fiche en base** : pas de « tu fais quoi dans la vie ? » chez Haroun (fiche : impro structurée, rebonds avec le public), pas de « pot de départ » chez Rollman (fiche : enterrements de vie, rituel social). Seule Thomas VDB tient (fiche : jargon ramené au langage de tous les jours).
Je cherche donc dans les 89 vidéos en ligne des remplaçantes plus justes, en préférant celles qui n'ont jamais servi (vérifié par `youtubeId` dans les parcours en ligne). Quand la meilleure a déjà servi, je le dis : les doublons sont acceptés, mais ils se paient. L'adéquation de B est jugée **d'après les fiches du catalogue, vidéos non visionnées** : tu peux me demander de regarder avant de trancher.

| Étape | **A (spec)** | **B (mes remplacements)** | Adéquation de B | Pourquoi |
|---|---|---|---|---|
| 1, salle de réunion | Obl. Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30). Fac. Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Obl. **Fary, « Le legging »** (5 min, **déjà utilisée dans Confiance 6**). Fac. **Vérino, « Le distributeur de baguettes »** (7 min 30, **déjà utilisée dans Confiance 3**) | Forte pour cette étape : les deux fiches parlent d'un objet banal regardé jusqu'à en tirer un sketch (fiches non visionnées). En A, VDB (jargon) ne parle pas d'objets ; Tsamère reste juste (le même sérieux sur un sujet qui ne l'est pas) | Le conseil 1 apprend à lire un objet. Fary tient dans le plafond de 5 min. Vérino est facultative : entière avec le choix 8a, un extrait `[À MINUTER]` avec le 8b. La spec avait choisi VDB pour les formules de réunion, angle abandonné au tour 5 ; Roumanoff, mon remplacement précédent, parlait d'un système et non d'un objet. |
| 2, mail | Obl. Pierre Croce, « Tester Tinder avec un enfant » (3 min). Fac. Jason Brokerss, « Snapchat » (5 min 40) | Obl. **Pierre Croce, « Ce qu'on rêverait d'entendre dans l'avion »** (2 min 30, **vidéo déjà utilisée dans Confiance 1**). Fac. Brokerss « Snapchat » inchangée | Moyenne à forte ; Brokerss moyenne (spec) | La fiche de l'avion parle d'une liste de one-liners : des annonces formelles retournées en une phrase, le même ressort qu'un PS ou un message au service. Tinder avec un enfant ne parle pas d'écrit pro. `[À VÉRIFIER : la fiche parle de 10 vannes en 5 minutes, la durée en base est de 2 min 30]` |
| 3, couloir | Obl. Guillermo Guiz, « Les cabillauds, ces arrogants ! » (4 min 30). Fac. Kev Adams, « Du côté de chez vous » (5 min 20) | **Identique à A, aucun remplacement** | Moyenne (spec) | Je n'ai pas trouvé mieux. Une piste est retirée pour cette étape : Fary, « Le legging » (5 min, déjà utilisée dans Confiance 6), dont la fiche parle de construire 8 minutes sur un seul objet, soit la leçon inverse d'une phrase de quinze secondes, et un legging n'est pas un irritant partagé du bureau (elle sert en revanche l'étape 1, où la leçon est justement un objet regardé longtemps). La légende des cabillauds ne reprendra pas la lecture de la spec (« on reconnaît un collègue dans un poisson ») : elle viserait une personne, et la fiche dit seulement « observation surréaliste et logique impeccable ». |
| 4, afterwork | Obl. Roumanoff, « Carmen et la crise » (4 min 50). Fac. Florence Foresti, « Le styliste » (6 min) | Obl. **Guillermo Guiz, « Pas de sentiments au fast-food »** (4 min 30, jamais utilisée). Fac. Foresti inchangée | Moyenne à forte ; Foresti moyenne (spec) | Roumanoff passe à l'étape 1. Guiz fait d'un McDo un sujet entier (fiche : une réflexion existentielle sur un fast-food) : le geste de l'étape, un moment banal de la semaine devenu un récit. |
| 5, « tu fais quoi dans la vie ? » | Obl. Haroun, « L'impro et la répartie » (5 min 45, déjà utilisée dans Répartie 4, `[À MINUTER]`). Fac. Lisa Delmoitiez, « J'ai pas confiance en moi et j'ai raison » (6 min) | Obl. **Marina Rollman, « Les relations sociales »** (5 min 20, **déjà utilisée dans Répartie 1**, `[À MINUTER]`, au-dessus des 5 min). Fac. Delmoitiez inchangée | Moyenne à forte ; Delmoitiez moyenne (spec) | La fiche d'Haroun ne dit rien de la question. La fiche de Rollman parle de politesse, de conventions et de small talk : le terrain exact de « tu fais quoi dans la vie ? ». |
| 6, parole officielle | Une seule : Marina Rollman, « Les enterrements de vie » (6 min 40, déjà utilisée dans Confiance 4, `[À MINUTER]`) | Une seule : **Nora Hamzawi, « Les chagrins d'amour »** (4 min, chronique France Inter, **déjà utilisée dans Storytelling 3**) | **Moyenne à faible** : le sujet est un chagrin d'amour, pas une prise de parole | Le pot de départ n'est pas dans la fiche de Rollman. Hamzawi : fiche « lucidité et auto-dérision, style introspectif et mordant », soit le geste de l'étape (un fond sincère, une touche d'humour) ; 4 min, aucun extrait à minuter. **Si la légende ne tient pas ce pont, l'étape 6 reste sans vidéo plutôt qu'avec celle-ci.** |

**Bilan.** A : 8 vidéos jugées moyennes par la spec et 2 affirmations non tenues par la base, 2 vidéos déjà utilisées ailleurs et à extraire (`[À MINUTER]`). B : 6 vidéos changées sur 5 étapes (1 jamais utilisée : Guiz « fast-food » ; 5 déjà utilisées dans d'autres parcours : Fary, Vérino, Croce « avion », Rollman « relations sociales », Hamzawi), 1 extrait `[À MINUTER]` (Rollman, plus un second si le choix 8b s'applique à Vérino), toutes en ligne dans l'export du 10/10. Les 5 autres (Brokerss, Guiz « cabillauds », Kev Adams, Foresti, Delmoitiez) restent celles de la spec, toutes jugées moyennes par elle : je n'ai pas trouvé mieux parmi les 89, et le catalogue n'a aucun sketch sur la prise de parole officielle (l'alerte de la spec tient toujours). Si aucune vidéo ne te convainc à l'étape 6, l'étape peut n'en avoir aucune (vide assumé plutôt que placeholder bancal).
**Reco : B.** Le gain est net aux étapes 1 (VDB ne dit rien d'un objet regardé de près, qui est la leçon du conseil validé) et 5 (la spec s'appuie sur une phrase absente de la fiche), léger aux étapes 2 et 4, nul à l'étape 3 (gardée), et à l'étape 6 il tient à la légende ou à l'absence de vidéo. Les 5 vidéos déjà utilisées de B (Confiance 6, Confiance 3, Confiance 1, Répartie 1, Storytelling 3) sont vues à d'autres étapes d'autres parcours, jamais dans le même parcours. Les légendes des étapes 2 à 6 s'écrivent avec les étapes, en regardant chaque vidéo.

**Choix 8 : plafond des vidéos facultatives.** La spec plafonne à 5 min la vidéo **obligatoire** seulement. Les facultatives de B qui dépassent 5 min sont au nombre de 5 : Vérino (7 min 30), Kev Adams (5 min 20), Brokerss (5 min 40), Foresti et Delmoitiez (6 min chacune). Option **a** : pas de plafond, la facultative reste entière, c'est son rôle. Option **b** : même plafond de 5 min, donc 5 extraits à minuter (5 aussi avec 5A, où Tsamère prend la place de Vérino). La promesse de 15 minutes compte la vidéo obligatoire et le quiz (signalement 7) ; qui regarde aussi la facultative dépasse, et c'est son choix. **Reco : a.**

---

## 7. La progression d'exposition et le garde-fou « jamais viser une personne » (choix 6)

**Vue d'ensemble de la progression d'exposition sociale.** Le parcours monte d'un cran à la fois, de personne qui t'entend à toute une salle, et chaque exercice a une version sans risque au boulot. C'est ce qui rend vraie la promesse « sans te griller » de la fiche (choix 2).

| Étape | Situation | Ce qu'on fait | Qui l'entend | Repli sans risque |
|---|---|---|---|---|
| 1 | La salle de réunion | Repérer trois traces dans la salle, écrire deux phrases sur l'une d'elles, les garder dans tes notes | Personne : tu ne dis rien | La première pièce où tu passes (pas de réunion en vue, ou visio) : n'importe quel objet qui porte une trace compte |
| 2 | Le mail ou le message | Glisser un PS d'une ligne dans un mail à faible enjeu | Un collègue, après relecture | Garder le PS en brouillon, jamais envoyé (avec la retouche du choix 7) ; sinon l'écrire pour ton dernier mail et le montrer à un ami |
| 3 | Le couloir | Dire en marchant une phrase de dix mots maximum sur un irritant partagé | Une personne croisée, 15 secondes | La dire seul, à voix haute, en traversant une pièce, puis faire cinq pas de plus |
| 4 | L'afterwork | Raconter en trente secondes un moment absurde de ta semaine (décor, escalade, chute) | Un petit groupe, 30 secondes | La raconter à un ami hors boulot qui ne connaît rien à ton travail |
| 5 | Le « tu fais quoi dans la vie ? » | Répondre en deux phrases (25 mots au plus) à la première personne qui te le demande | Des gens que tu connais peu | La dire trois fois à voix haute |
| 6 | La parole officielle | Écrire un mot de soixante secondes : un souvenir, une seule touche d'humour, une fermeture `[conseil en cours de relecture]` | Toute la salle, le jour J ; pendant l'exercice, personne | Écrire le texte et compter les mots, sans rien prononcer |

Sources : les conseils des étapes 1, 3, 4, 5 (§1, validés à l'aveugle), le défi du PS (étape 2), et le conseil validé de l'étape 6 (tour 6).

**Le garde-fou.** La spec le range en « vigilance » par étape. Chaque étape l'applique déjà à sa manière ; la question est de savoir si le parcours le dit **six fois différemment** ou **une fois, pareil partout**. Le cœur du parcours est là : l'humour au boulot se grille quand il vise quelqu'un, et le persona le sait.

| Étape | **A : une vigilance propre à chaque étape** (déjà dans la spec) |
|---|---|
| 1 | Tu notes des traces d'objets, jamais ce que fait une personne (la spec disait « des formules » : adapté à l'angle du conseil validé). |
| 2 | Aucun envoi exigé ; le message reste montrable à tout le service (règle de la capture d'écran, déjà dans le conseil en ligne). |
| 3 | Un irritant partagé, jamais une personne. |
| 4 | L'anecdote met un moment absurde au centre, toi dedans, pas un collègue. |
| 5 | Tu te décris sans mépriser ton métier ni ton employeur. |
| 6 | Tu vises la situation, et tu n'ouvres jamais par l'humour. |

**B : un seul test, le même du début à la fin.** Une phrase fixe, identique mot pour mot, en dernière phrase du texte (`moduleDetail`) des étapes 2 à 6, sans encadré ni titre en gras :
> Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?

À l'étape 1, rien à dire donc rien à sortir : la phrase `[SI 6B]` du §3 l'introduit avec les mêmes mots et la fait essayer sans risque, dans tes notes. Le défi étant celui du conseil validé, recopié sans retouche, il n'a pas de critère propre pour ce test : « aucune personne, ni nom ni fonction » le satisfait d'avance. Les consignes de sécurité propres aux étapes (aucun envoi exigé à l'étape 2, repli sans public, pas d'humour en ouverture à l'étape 6, ni métier ni employeur moqués à l'étape 5) **restent dans les exercices** : le test unifie le réflexe, il ne remplace pas ces consignes.

**Reco : B.** Personne ne retient six consignes différentes ; une seule question se retient, elle s'applique à une réunion comme à un mail ou à un toast, et elle tient la promesse « sans te griller » de la fiche. Elle prolonge la règle du conseil en ligne de l'étape 2 (la capture d'écran) sans la répéter. Coût : une phrase par étape, aucune nouvelle fonction. Risque : l'effet « consigne qui revient » ; c'est pourquoi la phrase est unique, jamais numérotée, jamais nommée comme une méthode, et identique aux étapes 2 à 6. A reste le plan B si tu trouves la répétition scolaire.

---

## Signalements (information, aucune réponse attendue de ta part)

1. **Comptage des vannes.** La session annonçait 9 vannes BOULOT déjà en ligne et 3 dans Storytelling ; mes recoupements par texte donnent 8 et 3 (Machine à Café 5, Répartie 3, Confiance 0), soit 16 avec les 5 hors parcours (9 + 3 + 5 ferait 17). `[ÉCART : à contrôler par @fullstack si le chiffre compte.]` Lecture dans `parcours-reecriture-s17.json` et `parcours-storytelling-s18.json` ; si la base en ligne diverge de ces fichiers, `[À VÉRIFIER @fullstack]`. Cela ne change aucun choix.
2. **La spec s'appuie sur deux phrases absentes des fiches vidéo en base** (Haroun, Rollman) : voir §6. Si la fiche complète existe ailleurs que dans l'export, la reco 5B pour les étapes 5 et 6 serait à revoir.
3. **Conseil en ligne écarté** : « Compare la manie d'un collègue à un autre métier » (OBSERVATION, INTERMEDIAIRE) est en ligne mais vise une personne. Il n'est dans aucun parcours en ligne (absent de tous les titres de conseil des fichiers s17 et s18). Il reste dans le catalogue, rien n'est désactivé. Même constat pour « Décrire tes révisions comme une rencontre ».
4. **Étape 6 : conseil validé à l'aveugle au tour 6** (« Le toast de soixante secondes qui tient debout », texte en §1) ; les étapes 2 à 6 s'écrivent après ta validation des étalons. L'étape 1 est réécrite sur le conseil validé « Ce que raconte une salle de réunion » (tour 5) ; les variantes « Compter ce que personne ne compte » et « Survivre aux réunions avec humour » sont abandonnées. Le texte validé dit déjà « tes notes », aucune retouche n'a été nécessaire.
5. **Recoupement avec Machine à Café 2 et Confiance 1** : traité dans le tableau du §3. Vérifié en base le 10/10 : le défi de Machine à Café 2 compte les blancs après les rires, celui de Confiance 1 formule une règle non écrite d'un lieu ; aucun ne relève d'une lecture de traces d'objets. Réserve : l'exemple de Confiance 1 (l'ascenseur et ses chiffres) regarde un objet, et les deux étapes utilisent un constat dit sérieusement. La différence tient à ce qui s'écrit (une règle que des gens appliquent, contre une trace laissée par un objet, avec un chiffre, sans personne), pas au décor ; aucun mot de la règle (règle, article, loi) n'est repris dans l'étape 1.
6. **Positions et longueurs des bonnes réponses du quiz.** Seule l'étape 1 est livrée (positions B, D, A ; la bonne réponse n'est ni la plus longue ni la plus courte dans aucune des 3 questions). Pour les 19 questions du parcours (3 × 5 + 4) : aucune position ne doit dépasser 40 %, soit 7 questions au plus par rang ; la bonne réponse ne doit pas être la plus longue pour plus d'une question sur trois ; aucune bonne réponse ne reprend un mot de sa question. Les trois se vérifient à l'écriture des étapes 2 à 6.
7. **Durée de l'étape 1** (13 min 30 estimées en spec) : non mesurée, non écrite dans les textes. Ordre de grandeur : environ 1 000 mots à lire (scène, `why`, conseil, défi, 5 vannes avec leur explication, quiz), soit 5 minutes à 200 mots par minute, plus 5 min de vidéo obligatoire, plus environ 2 minutes de quiz : une douzaine de minutes, donc la promesse de 15 minutes tient sans la vidéo facultative `[HYPOTHÈSE : à mesurer ; mots estimés à l'œil sur le texte du tour 5, environ 1 050]`.
8. **Champs à écrire plus tard, hors étalons** : `nextParcours`, `nextParcoursReason` et `metaDescription`. Classement de départ de la spec (§5.5) : `storytelling`, `machine-a-cafe`, `repartie`, `confiance`. La `metaDescription` évite aussi « drôle », « bureau », « humour » en tête (choix 3).
9. **Renommage de `"pro"` en `"boulot"`** : le mot `"pro"` figure dans les classements de fin de parcours des quatre parcours existants, soit 7 occurrences dans 3 fichiers : `parcours-reecriture-s17.json` (3, Machine à Café, Répartie, Confiance), `parcours-seed.json` (3) et `parcours-storytelling-s18.json` (1). À renommer partout à l'import, avec un contrôle par recherche du mot ensuite : sinon la suite de fin pointe vers un parcours qui n'existe pas, et la page ne propose pas le Boulot.
10. **Niveaux « Expert »** : aucun conseil du Boulot n'est marqué Expert dans la liste utile ; jamais affiché de toute façon (décision acquise).
11. **Même objet dans deux textes** : le témoignage B (§2) et l'exemple du conseil de l'étape 3 (§1) parlent tous deux de l'imprimante. Gardé : le conseil donne l'irritant, le témoignage montre le résultat. Si ça gêne à la relecture du rendu, on change l'objet du témoignage (la clim, l'ascenseur).

---

## Arbitrages de l'itération 1 (quand les deux relecteurs se contredisent, ou quand je n'ai pas suivi l'un d'eux)

R = relecteur (reviewer), U = relecteur UX, suivi du numéro de leur note.

**Historique (tour 5).** Les arbitrages 1 à 5, 7, 15, 16 et 17 portent sur la première version de l'étape 1 (formules de réunion, bingo), remplacée au tour 5 par la réécriture sur le conseil validé. Ils restent ici comme trace et ne décrivent plus le texte du §3. Les arbitrages 8 à 14 (fiche, titre, plafond, PS, vannes, Fary) tiennent toujours, sauf le 13 : les totaux de vannes sont désormais 13 en ligne et 17 neuves (§5), et le 14 : Fary sert l'étape 1 (§6). Le 6 tient pour la phrase du test, mais le défi ne reprend plus ce test dans son critère (§7).

1. **Défi de l'étape 1 : collègue ou ami ?** R14 gardait « un collègue de confiance » avec la précision « les formules, pas ta phrase » ; U1 (bloquant) veut un ami hors boulot. Tranché pour U1 : la vitrine promet « tu ne dis rien », et raconter les tics d'une réunion à un collègue est le geste par lequel on se grille, peur n°1 de la lectrice. Je garde la précision de R14 (« les formules, pas ta phrase »), qui lève la contradiction avec « garde-la pour toi ».
2. **`why`** : R1 écrivait « plus personne ne les entend » et gardait « Avant de placer quoi que ce soit… » ; U8 écrivait « personne ne les relève » et retirait cette phrase. Tranché : « tout le monde les prononce, personne ne les relève », phrase retirée. Cela corrige le contresens (R1), ne rappelle plus Confiance 1, et raccourcit la vitrine (U8) ; l'idée « sans ouvrir la bouche » est déjà dans la scène.
3. **Question 1** : R5 remplace la B par une formule accrochée au directeur, U9 remplace la D par une formule accrochée au chef. Un seul piège de ce type suffit : j'ai gardé la B de R5 ; la A et la D restent des personnes. Pour l'énoncé, « Tu as noté quatre choses » (R5, R15) plutôt que « Anouk qui hésite entre quatre notes » (U9) : plus aucun prénom dans le quiz, donc plus de contradiction avec la scène.
4. **Question 2** : R5 propose trois accidents plus drôles, U4 une A raccourcie et une visio plantée. Retenu : les accidents de R5, avec le courant d'air à la place du livreur (pas de personne), et la A sans « comme chaque semaine ». « qui attend qui » est retiré du défi (R5), et le défi dit « un geste que l'équipe refait à chaque fois » sans reprendre la A.
5. **Question 3** : U10 garde « À ce rythme… » et met « tour de table » dans toutes les réponses ; mais « rythme » est dans la liste lexicale interdite (R4), et reprendre « tour de table » partout n'enlève pas le calque. Retenu : une D sans « rythme » ni « tour de table » (R5), aucune réponse qui reprend un mot de la question. La B garde le défaut de R6 (elle se plaint sans rien montrer), reformulée sans masculin (U10) ; l'explication de R6 est retenue.
6. **Phrase du test** : R12 (« équipe », « l'entendait ou la lisait », sans « métier ») contre U17 (« salle », « ou le métier »). Retenu R12 : « salle » ne va pas à un mail, et « métier » n'a de sens qu'à l'étape 5, où l'exercice le dit déjà. Retenu U17 sur le fond : le critère du défi reprend le même test (`[SI 6B]`).
7. **Repli de l'étape 1** : R13 retire la visio du repli (une visio est une réunion), le tableau de U2 la cite comme repli. Retenu R13 : la visio compte comme réunion ; repli = la dernière réunion en souvenir, ou un fil de mails. Le tableau du §7 est aligné.
8. **Accroche B** : R7 propose le contraste samedi / lundi 9 h, U3 propose « le mail, la réunion ou le pot de départ te font tout garder pour toi ». Retenu R7 : U3 liste des situations que la description cite déjà (même répétition), R7 apporte une idée neuve et n'emploie aucun mot de l'accroche de Machine à Café. U3 est retenu pour la ligne « Boulot ou Machine à Café d'abord ? » et pour la phrase « version sans risque » de la description.
9. **Témoignage B** : R7 (ouvrir sans la réunion) et U14 (« 26 ans, en CDI », passage à l'aveugle) s'additionnent sans conflit.
10. **Titre** : A et B sont les deux titres de R8 (60 et 56 caractères) ; la variante sans durée de U18 est montrée en une ligne. Reco A (elle tient la promesse de la fiche).
11. **Plafond des facultatives** : R10 voulait retirer la question (la spec tranche : seule la vidéo obligatoire est plafonnée) ; la demande de cette itération et U13 la maintiennent. Elle devient le choix 8, avec une reco qui suit la spec (pas de plafond) : la décision reste à Thomas.
12. **Retouche du PS** : R10 admettait « retouche commune ou choix 7 », U5 exige le choix 7. Retenu : choix 7.
13. **Vannes de R11** : « à la base » n'est pas retenue, malgré R11. Même critère que Rome : l'explication en base parle du « collègue-tornade », donc d'une personne ; et c'est déjà une vanne de l'étape gratuite de Confiance, lue deux fois dans deux vitrines. « Champion de tir à l'arc » est retenue (étape 5, l'homonyme est le sujet, pas une personne visée). Totaux : 14 en ligne et 16 neuves, au lieu de 15 et 15.
14. **Fary à l'étape 3** : R19 laissait deux voies (un vrai argument, ou garder A). Je n'ai trouvé aucun argument (la fiche dit 8 minutes sur un seul objet), l'étape 3 reste en A.
15. **Légende de Thomas VDB** : R21 jugeait « mot après mot » acceptable, U12 le retire car la fiche ne dit pas ça. Retenu U12 (règle : ne dire que ce que la fiche établit).
16. **Scène** : U7 proposait « six formules », R3 « trois formules entendues six fois ». Retenu R3 : les trois formules distinctes sont aussi le critère du défi, la scène montre donc exactement ce qu'on demande.
17. **Rituel ou formules** : R2 veut les formules au premier plan, la spec garde le rituel dans l'objectif. Retenu : formules d'abord ; le rituel sort de la scène et reste au second plan dans le défi et dans le tableau.

---

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'import, @design pour l'icône, @seo pour la signature du titre)

- **Fichier produit** : `/home/user/Marrant/docs/copy/etalons-parcours-boulot-s19.md` (version corrigée, itération 1, puis étape 1 réécrite au tour 5 sur le conseil validé). Aucun autre fichier modifié, aucun commit, rien en base. `project-context.md` (historique) à compléter par la session.
- **Prêt (en attente de ta validation)** : fiche A/B (§2) ; étape 1 complète (§3 : titre, `why`, `moduleDetail` avec scène, exercice, 3 questions de quiz complètes, légendes des 2 vidéos) ; état réel des conseils avec les cinq textes validés à l'aveugle (étapes 1, 3, 4, 5, 6) en texte intégral et la retouche du PS (§1) ; titre A/B et slug (§4) ; méthode de vannes avec tableau étape par étape (§5) ; vidéos A/B avec adéquation et plafond des facultatives (§6) ; vue d'ensemble de la progression d'exposition et garde-fou A/B (§7).
- **Frameworks et niveau de conscience (pour les agents, pas pour Thomas)** : fiche = PAS court, Solution-Aware ; étape 1 = PAS court avec scène, Product-Aware (vitrine lue avant l'achat) ; quiz = mise en situation puis explication, Product-Aware ; titre = bénéfice et durée, Problem-Aware.
- **Attend Thomas** : choix 1 à 8. « Je suis tes recos » = valider le 1 (quatre textes), puis B (fiche), A (titre), A (vannes, 17 neuves), B (vidéos, dont Fary et Vérino à l'étape 1), B (garde-fou), oui (retouche du PS), a (pas de plafond pour les facultatives).
- **Après validation, @fullstack devra** : (1) **réactiver** les conseils retirés des étapes 3, 4 et 5, textes copiés à l'identique du §1, **en base ET dans `conseils-seed.json`** (ids vus dans l'export du 10/10 : « La vanne de couloir » `cmmw0tr870014mw62jnung2qp`, « L'afterwork » `cmmw0trc60016mw629l4o8rav`, « Survivre (et briller) au networking pro » `cmmw0tra60015mw62l0360wm9`) ; **créer** le conseil de l'étape 1, « Ce que raconte une salle de réunion » (texte du §1, catégorie OBSERVATION, INTERMEDIAIRE), qui est un conseil neuf : « Survivre aux réunions avec humour » (`cmmp8ozsx001fqk6301jruvzj`) reste retiré ; créer celui de l'étape 6 une fois passé à l'aveugle ; (2) si accordé (choix 7), ajouter la phrase au défi du PS (`cmmw0tqkc000smw62bo1yfeyg`) après passage à l'aveugle `[À VÉRIFIER sur la base de prod avant tout UPDATE]` ; (3) importer le parcours (`slug: boulot`, `order: 5`, vannes désignées par leur texte exact via `jokeContents`, `isActive` de chacune vérifié à l'import, dont « tir à l'arc » dont l'export date du 07/10) ; (4) renommer `"pro"` en `"boulot"` dans les 7 occurrences des 3 fichiers de parcours (signalement 9) ; (5) laisser `icon` à @design ; (6) rejouer les vérifications de contenu (tirets cadratins, « blague », « carnet », prénoms de persona) sur les textes importés.
- **Décisions prises** : registre « pote drôle et bienveillant » ; version B avec scène (acquis) ; Anouk comme personnage d'exemple (fiche + étape 1) ; positions de bonne réponse B, D, A pour l'étape 1 ; l'étape 1 est écrite sur le conseil validé (tour 5) : lire les traces d'une salle, deux phrases au présent dont la seconde ajoute un chiffre ou une durée, aucune personne, et c'est de l'observation pure (rien à dire, rien à envoyer, rien à montrer) pour rester sans risque en vitrine ; exercice = DÉFI TRACE recopié sans retouche ; vidéos de l'étape 1 en B : Fary et Vérino ; vannes de l'étape 1 : canapé et point rapide, « discrétion » sortie ; « tes notes » à la place de « carnet » ; titre de page sans « drôle », « bureau », « humour » ; slug `boulot` ; un seul test unifié en dernière phrase des étapes 2 à 6 ; vannes « à la base », « briefé » et « pot de départ » écartées avec le critère de Rome ; vidéo de l'étape 3 gardée comme dans la spec.
- **Points d'attention** : objections traitées (« je vais me griller » : étape 1 sans parole ni collègue, test de l'équipe entière, tableau de progression avec un repli par étape ; « je n'ai pas de réunion, ou elle est en visio » : la première pièce où tu passes (repli du défi) ; « je n'ai personne à qui le dire » : tes notes, rien à dire à personne ; « ça ressemble à Machine à Café 2 ou à Confiance 1 » : tableau §3). Références consultées : étalons Storytelling s18 (modèle), spec s17 §1, §3, §9, export base du 10/10, fiches vidéo de l'export, 127 vannes en ligne (recherche par mots-clés), parcours en ligne (recoupements par texte et par `youtubeId`), `conseils-boulot-s19-v1.md` et `v2.md` (textes validés) et `conseils-boulot-s19-v5.md` (conseil de l'étape 1, validé au tour 5), `parcours-seed.json` et `conseils-seed.json` (Confiance 1, Machine à Café 2), `videos-seed.json` (Fary, Vérino). Mots-clés SEO : `keyword-map` non lu ; titre `[À SIGNER, volumes non mesurés]`.
- **Contrôles faits sur ce fichier** : zéro tiret cadratin ; « blague » absent ; aucun prénom de persona dans les textes destinés au site (le champ interne `persona` suit la forme de Storytelling) ; aucun concurrent ; aucun chiffre du site modifié (« 15 min/semaine » et « 6 semaines » sont les décisions de la spec) ; humoristes cités uniquement dans les tableaux de choix et les légendes, avec ce que la fiche en base établit ; relecture arithmétique et lexicale de la scène et du quiz (fin du §3).

---

## Corrections de l'itération 1

Chaque ligne : numéro de la note, état (fait, ou arbitré avec la section « Arbitrages » correspondante), emplacement dans ce fichier.

| N° | Sujet | État | Emplacement |
|---|---|---|---|
| R1 | `why` : contresens et écho de Confiance 1 | Fait, arbitré (arb. 2) | §3, champ `why` |
| R2 | Comparaison avec Confiance 1 | Fait | §3, tableau à 3 colonnes ; formules au premier plan (arb. 17) |
| R3 | « sept formules » | Fait, arbitré (arb. 16) | §3, `moduleDetail` |
| R4 | Mots que le document s'interdit (silence, à blanc, rythme) | Fait | §3, scène, phrase `[SI 6B]`, question 3 ; contrôle en fin de §3 |
| R5 | Quiz repérable (Q1, Q2, Q3) | Fait, arbitré (arb. 3, 4, 5) | §3, quiz et défi (« qui attend qui » retiré) |
| R6 | Explication de la B (autodérision) | Fait | §3, question 3 |
| R7 | Fiche B : une idée trois fois | Fait, arbitré (arb. 8, 9) | §2, accroche, témoignage, reco |
| R8 | Titre A qui promet une vanne en réunion | Fait, arbitré (arb. 10) | §4 |
| R9 | Deux vannes visant une personne (briefé, pot de départ) | Fait | §5, « Écartées » et tableau, totaux |
| R10 | Décisions cachées dans les signalements | Fait, arbitré (arb. 11, 12) | Tableau des choix (7 et 8), « Je suis tes recos », §1, §6, handoff |
| R11 | Vannes oubliées, « 127 au 08/10 » | Fait en partie, arbitré (arb. 13) | §5 (« tir à l'arc » retenue, « à la base » écartée) |
| R12 | Phrase du test | Fait, arbitré (arb. 6) | §7, §3 |
| R13 | Repli illogique, dit deux fois | Fait, arbitré (arb. 7) | §3, `moduleDetail` et défi |
| R14 | Deux consignes qui se heurtent | Fait, arbitré (arb. 1) | §3, défi |
| R15 | Anouk dans la question 1 | Fait, arbitré (arb. 3) | §3, quiz |
| R16 | « d'abord en spectateur » | Fait | §2, description B |
| R17 | Faits incomplets (conseil 53, troisième conseil en ligne) | Fait | « Ce que la base a changé », conseils |
| R18 | « vérifié sur les 3 actifs » | Fait | « Ce que la base a changé », conseils (marqué `[À VÉRIFIER]`) |
| R19 | Fary étape 3 et durée de Croce « avion » | Fait, arbitré (arb. 14) | §6, lignes 2 et 3 |
| R20 | Vérification du signalement 4 | Fait | Signalement 3 |
| R21 | Légende de Roumanoff | Fait | §3, légendes |
| U1 | Défi qui envoie parler à un collègue | Fait, arbitré (arb. 1) | §3, défi et note |
| U2 | Progression d'exposition invisible | Fait | §7 (vue d'ensemble), §2 (description B) ; repli de l'étape 3 réécrit dans le texte validé (§1) |
| U3 | Accroche B et ressemblance avec Machine à Café | Fait, arbitré (arb. 8) | §2, accroche et ligne « Boulot ou Machine à Café d'abord ? » |
| U4 | Question 2 devinable | Fait, arbitré (arb. 4) | §3, question 2 |
| U5 | Retouche du PS cachée | Fait | Choix 7 (tableau, §1, phrase « Je suis tes recos », handoff) |
| U6 | « Carnet » est une fonction du site | Fait | Partout (« tes notes ») ; variantes 1A et 1B au signalement 4 |
| U7 | Scène qui se contredit | Fait, arbitré (arb. 16) | §3, scène et contrôle |
| U8 | Vitrine trop longue | Fait | §3, `why` et `moduleDetail` (environ 90 mots) |
| U9 | Question 1 : un seul rival | Fait, arbitré (arb. 3) | §3, question 1 |
| U10 | Question 3 : indice lexical | Fait, arbitré (arb. 5) | §3, question 3 |
| U11 | Règle de longueur des réponses | Fait | Signalement 6, contrôle en fin de §3 |
| U12 | Légendes vidéo de l'étape 1 | Fait, arbitré (arb. 15) | §3, légendes |
| U13 | Vidéos : adéquation, durées, plafond | Fait | §6 (colonne « Adéquation », choix 8, étape 6) |
| U14 | Témoignage B : âge et vanne à l'aveugle | Fait, arbitré (arb. 9) | §2 |
| U15 | Durée de 15 minutes | Fait | Signalement 7 |
| U16 | Lecture de Thomas : effet, jargon, bruit interne | Fait | Tableau des choix (colonne « Ce que ça change… »), vocabulaire, écart de vannes déplacé en signalement 1 |
| U17 | Critère du défi et test de la salle | Fait, arbitré (arb. 6) | §3, défi et `[SI 6B]` |
| U18 | Titre A et situation de Machine à Café | Fait | §4 (variante sous le tableau) |
| U19 | Renommage de `"pro"` | Fait | §4, signalement 9, handoff |
| T5 | Réécriture de l'étape 1 sur le conseil validé (tour 5) | Fait : conseil recopié sans retouche (§1), titre, `why`, scène, exercice (DÉFI TRACE), quiz B, D, A, vidéos Fary et Vérino, vannes (canapé, point rapide), comparaisons, progression, garde-fou, fiche, signalements 4 à 7, handoff. Les lignes R1 à R6, R13 à R15, R21, U1, U4, U7 à U10, U12 et U17 décrivent la version abandonnée | §1, §2, §3, §5, §6, §7, signalements, arbitrages (note d'historique), handoff |



