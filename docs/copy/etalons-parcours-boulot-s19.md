# Étalons du parcours Boulot (s19, 10/10/2026)

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 6 étapes du parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : nom « Parcours Boulot » ; 6 étapes ; 15 min/semaine ; XP 50, 75, 100, 100, 125, 150 + 100 de fin ; étape 1 lisible par le visiteur, validation Premium ; textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication (3 questions par étape, 4 à la dernière, bonne réponse répartie sur les positions) ; repli solo sur chaque exercice ; « première étape gratuite », jamais « cours gratuit » ; doublons de vidéos et de vannes acceptés ; « Expert » jamais affiché ; pas de certificat ; pas de compte gratuit ; prix inchangés. Le Boulot n'est la cible d'aucun profil du quiz d'humour (spec §12) : rien à décider là-dessus.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin dans les textes, pas scolaire, pas corporate, aucune mention d'IA, aucun concurrent, aucun prénom de persona (« Anouk » est un exemple, jamais présenté comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où la fiche vidéo en base les cite, jamais viser une personne (la situation, le système, soi-même). Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi.** Faits relus dans `docs/content/boulot-base-s19.json` (export prod du 10/10, lecture seule, rien n'a été re-requêté). Rapprochements vannes et vidéos faits par texte et par `youtubeId` dans `parcours-reecriture-s17.json` et `parcours-storytelling-s18.json`.

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | § | Point | Options | Reco |
|---|---|---|---|---|
| 1 | 1 | Les 5 conseils à (ré)écrire, étapes 1, 3, 4, 5 et 6 | Textes en cours de relecture à l'aveugle : tu valides le texte quand il passe | **Valider** (emplacement, rien à lire encore) |
| 2 | 2 | Fiche du parcours (description, accroche, témoignage « Imagine… ») | A sobre / B complice | **B** |
| 3 | 4 | Titre de la page (≤ 60 caractères) et slug | A avec durée / B avec l'arc du parcours | **A**, slug `boulot` |
| 4 | 5 | Vannes des 6 étapes (30 places) | A actives là où elles collent + 15 vannes neuves relues à l'aveugle / B actives partout, y compris hors boulot | **A** |
| 5 | 6 | Vidéos des 6 étapes | A celles de la spec / B mes remplacements, étape par étape | **B** (tu peux dire « B sauf étape X ») |
| 6 | 7 | Garde-fou « jamais viser une personne » | A une vigilance propre à chaque étape / B un seul test, le même du début à la fin | **B** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis, tu valides le texte ou tu corriges un mot. Seules deux de ses lignes dépendent d'un choix : la légende de la vidéo facultative (choix 5) et une phrase finale (choix 6, marquée `[SI 6B]`).
« Je suis tes recos » suffit : valider le choix 1, puis B, A (titre), A (vannes), B (vidéos), B (garde-fou). Le détail et les textes complets sont dessous.

## Ce que la base a changé (faits relus le 10/10)

- **Conseils** : sur les 97 conseils au titre « bureau », 3 seulement sont actifs. Un seul sert le parcours : « Le PS qui détend un mail sérieux » (étape 2), actif et au niveau. Les quatre autres conseils prévus sont **inactifs** (retirés le 30/09, sous la barre) : « Survivre aux réunions avec humour » (1), « La vanne de couloir : l'art du timing entre deux réunions » (3), « L'afterwork : passer de collègue à personne drôle » (4), « Survivre (et briller) au networking pro avec humour » (5). Le conseil de l'étape 6 (prise de parole officielle) n'existe pas. Le troisième conseil actif, « Compare la manie d'un collègue à un autre métier », est écarté : il vise une personne, même avec tendresse. Les ~90 autres conseils « bureau » inactifs (tics et rituels de collègues, lundi matin) ne reviennent pas : ils ciblent des personnes.
- **Vannes** : 16 vannes BOULOT actives (47 inactives). Rapprochées par texte exact des parcours : **8** sont déjà en ligne (Machine à Café : « comparé nos salaires », « copie de 90 mails », « costume de mon père », « portique », « mug » ; Répartie : « rapport de stage », « chez ma mère », « voisine ») ; **3** sont dans Storytelling (« briefé pendant 45 minutes », « mail de bienvenue », « pot de départ ») ; **5** ne sont dans aucun parcours (Rome, « point rapide avant l'été », entretien « Vous avez trouvé facilement ? », archives du stage, canapé de l'espace détente). `[ÉCART : la session annonçait 9 et 3 ; mes recoupements donnent 8 et 3, soit 16 au total. 9 + 3 + 5 ferait 17. À contrôler par @fullstack si le chiffre compte.]` Trois autres vannes actives parlent du travail sans être classées BOULOT et sont aussi déjà en ligne : « Mon manager m'a félicité pour ma discrétion » (Machine à Café 1), « alternant2 » (Répartie 2), « la pause déjeuner est sacrée » (Confiance 1).
- **Vidéos** : les 11 de la spec sont actives. Deux affirmations de la spec ne sont **pas** dans les fiches de la base : Haroun, « le tu fais quoi dans la vie ? est dans la fiche » (la fiche parle d'impro et de rebonds avec le public) ; Rollman « Les enterrements de vie », « le pot de départ est cité dans la fiche » (la fiche parle des enterrements de vie et de rituel social, pas du pot de départ). Détails au §6. La vidéo « Bitcoin, JPEG et blockchain » n'est plus dans Machine à Café 3 (le correctif `tpIOLzv11qo` y est), `[À VÉRIFIER @fullstack en base]`.
- **Parcours** : aucun parcours `boulot` ni `pro` en base ; `storytelling` est actif. Le fichier Storytelling porte `"pro"` dans son `nextParcoursRanking` : à renommer `"boulot"` à l'import.
- **Titre de page** : `/parcours/machine-a-cafe` a déjà pour title « Parcours Machine à Café : être drôle au bureau en 3 semaines ». Le title du Boulot ne doit pas lui voler cette requête (§4).

---

## 1. Les 5 conseils (choix 1)

Règle d'or du fondateur (P0, s18) : un contenu sous la barre ne revient jamais en ligne. Les quatre conseils inactifs sont donc **réécrits à neuf par un autre rédacteur** (fichier attendu : `docs/copy/conseils-boulot-s19-v1.md`) puis jugés à l'aveugle par deux relecteurs contre les étalons de l'audit s14. Le conseil de l'étape 6 est écrit de zéro. Ton rôle : valider le texte une fois qu'il est passé. Titre, catégorie et difficulté de chaque conseil restent à fixer avec le texte ; les textes passent par la base ET par `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte).

**[EN COURS : relecture à l'aveugle, texte inséré quand il passe]**

| Étape | Conseil prévu et état en base | Ce que le conseil doit enseigner (rien d'autre) |
|---|---|---|
| 1 | « Survivre aux réunions avec humour » : inactif. Texte à réécrire. | Repérer les formules toutes faites et les rituels d'une réunion, viser le système et jamais une personne, garder une phrase pour plus tard sans la dire. Exercice d'observation seule, zéro risque, avec repli (visio, réunion passée). |
| 2 | « Le PS qui détend un mail sérieux » : **actif, au niveau, inchangé.** Trois règles de forme (une ligne après la signature, un sujet sans rapport, un sérieux total), règle d'or de la capture d'écran. | Glisser un trait dans un mail ou un message qui reste présentable à tout le service. Une retouche d'une phrase est proposée au signalement 3. |
| 3 | « La vanne de couloir : l'art du timing entre deux réunions » : inactif. Texte à réécrire. | Transformer un irritant partagé (clim, imprimante, café) en une phrase courte, relatable et inoffensive, dite une seule fois, en quinze secondes entre deux portes. Jamais une personne. |
| 4 | « L'afterwork : passer de collègue à personne drôle » : inactif. Texte à réécrire. | Raconter en trente secondes un moment absurde de la semaine de travail : situation, escalade, chute. Cadrer sur le boulot, sans refaire la coupe de Storytelling 1 ni le grain de Machine à Café 3. |
| 5 | « Survivre (et briller) au networking pro avec humour » : inactif. Texte à réécrire. | Remplacer le pitch récité par une description honnête et drôle de son métier en deux phrases, sans mépriser son métier ni son employeur. Repli : la dire trois fois à voix haute. |
| 6 | **N'existe pas.** À écrire (aucun conseil actif ne couvre ce besoin, vérifié sur les 3 actifs). | Soixante secondes pour un mot de départ, une présentation d'équipe ou un toast : une seule touche d'humour, placée après un moment sincère, jamais en ouverture, sur la situation et jamais sur une personne. Exemple avec structure et durée, exercice avec repli écrit ou vocal. Catégorie suggérée STORYTELLING, difficulté INTERMEDIAIRE (spec s17). |

**Reco : valider.** Rien à lire aujourd'hui. Quand les cinq textes sont passés, ils s'insèrent ici à l'identique (source copiée mot pour mot) et tu valides le texte. Si l'un ne passe pas à l'aveugle, il ne revient pas : on le réécrit, on ne le remplace pas par un conseil sous la barre.
L'étape 1 du §3 s'appuie sur l'objectif de l'étape, pas sur un texte de conseil : son exercice est à **aligner mot pour mot sur le DÉFI du conseil 1** dès qu'il est validé (règle RC1 : un seul enseignement par étape) `[À ALIGNER]`.

---

## 2. Fiche du parcours (choix 2)

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose : 6 semaines, six situations du travail, on commence par observer et on finit par parler, la vanne vise la situation et jamais une personne. Rien n'annonce de score, de certificat ni de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ». Champs inchangés de la spec : `slug` `boulot`, `duration` « 6 semaines », `timePerWeek` « 15 min/semaine », `difficulty` DEBUTANT, `difficultyLabel` « DEBUTANT → INTERMEDIAIRE », `order` 5, `icon` à @design, `persona` « Sophie (26 ans, jeune active en CDI) » (champ de la même forme que celui de Storytelling).

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Au bureau, tu as des vannes en tête et tu les gardes pour toi, de peur de te griller. En 6 semaines, tu apprends à en placer une dans six situations du travail : la réunion, le mail ou le message, le couloir, l'afterwork, le « tu fais quoi dans la vie ? » et la prise de parole officielle. Tu commences par observer, tu finis par parler, et ta vanne vise toujours la situation, jamais une personne. | Il y a toujours une vanne qui t'est venue en réunion et qui y est restée. En 6 semaines, tu apprends à la sortir sans te griller : d'abord en spectateur, puis dans un mail, dans un couloir, à l'afterwork, quand on te demande « tu fais quoi dans la vie ? », et enfin quand la parole est officielle, pour un mot de départ ou un toast. Toujours sur la situation, jamais sur quelqu'un. |
| `personaTagline` | Pour toi si tu es drôle avec tes amis, mais que tu te retiens au bureau, de peur de tomber à plat ou d'en faire trop | Pour toi si ta meilleure vanne de la semaine est née en réunion et n'en est jamais sortie |
| `testimonial` | Imagine Anouk. En réunion, elle avait toujours une phrase en tête qu'elle gardait pour elle, de peur de tomber à plat devant tout le service. Six semaines plus tard, elle glisse un PS dans un mail, un mot dans le couloir, et c'est à elle qu'on demande de dire quelques mots au pot de départ de vendredi. | Imagine Anouk. Il y a six semaines, elle avait en réunion une phrase qu'elle n'osait jamais dire. Hier, devant l'imprimante qui mettait quatre minutes à sortir une page, elle a lâché : « Elle prépare son discours de pot de départ. » Deux collègues ont ri. L'imprimante n'a pas relevé. |

**Reco : B.** Elle montre le problème avant de le nommer (la vanne restée en réunion, charte §5 : l'humour présent dans la copy elle-même), l'accroche tient en une image que le persona reconnaît tout de suite, et chacun des trois champs apporte une idée différente : la vanne gardée (description), la réunion qui ne la laisse pas sortir (accroche), le résultat visible (témoignage). Le témoignage B porte aussi le garde-fou du parcours dans sa chute : la vanne vise l'imprimante, personne d'autre. A reste le plan B si tu trouves « elle y est restée » trop familier pour une page de vente.
Vérifié contre le parcours : chaque élément cité existe dans une étape (spectateur = 1, mail = 2, couloir = 3, afterwork = 4, « tu fais quoi dans la vie ? » = 5, mot de départ ou toast = 6). Le témoignage A cite un PS (2), un mot dans le couloir (3) et un pot de départ (6) ; le B cite le couloir et le pot de départ avec une seule vanne.
Le prénom « Anouk » n'est ni un prénom de persona, ni un prénom d'humoriste des vidéos du parcours (A comme B), ni celui d'un exemple déjà utilisé ailleurs (Samir, Maëlle, Léa). Il revient dans l'étape 1 (§3).

---

## 3. Étape 1 complète : « Ta prochaine réunion, en spectateur »

C'est la vitrine que le visiteur lit avant de payer. Aucun A/B : forme acquise (version B avec scène, repli solo, quiz complice). L'étape suit l'objectif de la spec (la réunion vue de la salle : repérer les formules et les rituels, viser le système, garder une phrase), en attendant le texte du conseil 1 (§1).

**Ce qui doit se lire face à Machine à Café 2** (« Lire le tempo du groupe : savoir quand c'est ton tour », module « Sentir le bon moment », qui dit déjà « à la pause, en réunion ou à l'afterwork, cette étape ne te demande de faire rire personne : seulement d'entendre le rythme »). Les deux étapes sont de l'observation pure en réunion : la différence doit se voir dès la première ligne `[défi de Machine à Café 2 non relu]`.

| | Machine à Café 2 | Boulot 1 |
|---|---|---|
| Ce qu'on écoute | **Le rythme** : où ça monte, où ça retombe, où il y a de la place | **Le contenu** : les formules qui reviennent et les rituels |
| Ce qu'on garde | Le moment où il y aurait eu de la place | **Une phrase de carnet** sur la réunion, jamais dite |
| Ce qui se mesure | Avoir senti le bon moment | **Trois formules ou rituels repérés, et une phrase qui parle de la réunion** |
| Où | Pause, réunion, afterwork | Une réunion, ou son repli : visio, réunion passée, échange de mails à rallonge |

Aucune phrase de l'étape 1 ne reprend le vocabulaire du rythme de Machine à Café 2 (tempo, blanc, silence, morceau). Pour qui a fait Machine à Café, c'est une autre écoute : ici on compte les mots, là-bas on écoutait la musique. Aucune bonne réponse du quiz n'est citée dans la scène ni dans l'exercice.

| Champ | Texte |
|---|---|
| `moduleTitle` | Ta prochaine réunion, en spectateur `[remplace le titre de travail « La réunion vue de la salle » ; à valider]` |
| `tipTitle` | `[EN COURS : titre du conseil 1, voir §1]` |
| `why` (« Pourquoi cette étape ? ») | Une réunion répète les mêmes formules et les mêmes rituels, et c'est ce qui la rend drôle : tout le monde les connaît, personne ne les dit. Avant de placer quoi que ce soit, tu apprends à les repérer sans ouvrir la bouche. Ici, tu suis ta prochaine réunion comme un spectacle et tu notes ce qui revient. |
| `moduleDetail` (version B, scène) | Imagine Anouk, mardi, 10 h. Elle ne dit rien pendant toute la réunion. Elle écoute : trois « on se cale », un « je vous partage mon écran » suivi de deux minutes de silence, deux « pour la bonne forme » à des moments où personne n'attendait de forme. À la fin, elle a une liste de sept formules et pas un seul prénom, et une phrase qu'elle a gardée pour son carnet. Dans cette étape, tu fais pareil à ta prochaine réunion : tu écoutes comme au spectacle, tu comptes les formules qui reviennent, tu repères un rituel, et tu n'as rien à dire. Pas de réunion cette semaine ? Une visio, une réunion de la semaine dernière ou même un échange de mails à rallonge, en y repensant, font l'affaire. `[SI 6B : Un seul test te suivra jusqu'au bout du parcours : ta phrase passerait-elle si toute la salle l'entendait, y compris la personne ou le métier dont elle parle ? Ici, tu l'essaies à blanc, dans ton carnet.]` |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 50 / oui / 3 (spec, inchangé) |
| `dureeTexte` | `[À MESURER]` : la spec estime 13 min 30 hors mesure ; rien n'est écrit tant que K14 n'est pas lu. |

**Exercice « aujourd'hui »** (observation seule, zéro risque pour un visiteur : tu ne dis rien, tu n'envoies rien) `[À ALIGNER sur le DÉFI du conseil 1 dès qu'il est validé]` :

> DÉFI BINGO : à ta prochaine réunion, ne dis rien et joue au bingo dans ta tête. Compte les formules qui reviennent (« on rebondit », « on est alignés », « pour être transparent »...) et repère un rituel : la façon dont ça commence, dont ça finit, qui attend qui. Note ensuite en une phrase ce qui t'a le plus fait sourire, et garde-la pour toi. C'est réussi si tu as repéré trois formules ou rituels en tout et que ta phrase parle de la réunion, pas d'une personne. Si tu veux, raconte ton bingo à un collègue de confiance. Personne sous la main ? Un ami hors boulot fera l'affaire, ou ton carnet. Pas de réunion cette semaine ? Prends une visio, une réunion de la semaine dernière ou un échange de mails à rallonge.

(Repli solo : le carnet. Repli situation : visio, réunion passée, mails. Seule la dernière phrase du défi touche quelqu'un d'autre, et elle est facultative.)

**Quiz, trois questions** (ton B complice, 4 réponses). La question 1 porte sur ce qu'on vise (la formule ou la personne), la question 2 sur ce qui vaut d'être noté (ce qui revient), la question 3 sur la phrase à garder (celle qui passe le test). Positions de la bonne réponse : **C, A, D** (jamais deux de suite au même rang). Un seul prénom dans l'étape (question 1, comme dans la scène).

**Question 1 (bonne réponse en C)**
> **Imagine Anouk qui a noté quatre choses pendant sa réunion. Laquelle peut devenir une vanne sans viser personne ?**
> A. « Le collègue du fond a regardé son téléphone pendant vingt minutes. »
> B. « Le chef a lu ses slides à voix haute, mot pour mot. »
> **C. « On a entendu cinq fois “juste une petite remarque”, toujours avant dix minutes de remarques. »**
> D. « Quelqu'un a reposé trois fois la même question. »
>
> **Explication (affichée quelle que soit la réponse, 3 phrases)** : La C. Elle porte sur une formule que tout le monde a entendue : chacun peut en rire, personne n'est visé. Les trois autres décrivent ce que fait quelqu'un, et ce quelqu'un était dans la salle.

**Question 2 (bonne réponse en A)**
> **Tu ne peux noter qu'une chose de ta réunion. Laquelle te servira encore dans trois semaines ?**
> **A. « Les cinq premières minutes à attendre les retardataires en parlant de la météo, comme chaque semaine. »**
> B. « Le micro de la salle qui a grésillé pendant le budget. »
> C. « La chaise qui a grincé quand quelqu'un a pris la parole. »
> D. « Le café renversé au fond de la salle. »
>
> **Explication (3 phrases)** : La A. Un rituel revient à chaque réunion, donc tout le monde le reconnaîtra la prochaine fois. Le micro, la chaise et le café sont des accidents du jour : drôles sur le moment, introuvables trois semaines plus tard.

**Question 3 (bonne réponse en D)**
> **Tu prépares une phrase pour plus tard, sur un tour de table où chacun répète ce que le précédent vient de dire. Laquelle gardes-tu dans ton carnet ?**
> A. « Encore une réunion où le chef ne sait pas conclure. »
> B. « Je suis le seul à qui ça donne envie de dormir ? »
> C. « Cette réunion aurait pu être un mail. »
> **D. « À ce rythme, on va finir le tour de table par le début. »**
>
> **Explication (3 phrases)** : La D. Elle vise le tour de table, elle est propre à cette réunion et elle tient en une respiration. La A vise le chef, la B fait de toi la seule victime, et la C est la phrase que tout le monde a déjà dite.

Question 1 : les trois mauvaises réponses sont des remarques vraies et tentantes, et l'explication dit pourquoi elles tombent (elles décrivent quelqu'un). Question 2 : chaque mauvaise réponse est un accident unique, que l'explication nomme. Question 3 : chaque mauvaise réponse enfreint une seule règle (vise une personne, fait de toi la victime, cliché), ce que l'explication nomme. Les mots entre parenthèses des tableaux sont des notes pour toi, pas du texte affiché.

**Les 2 vidéos** (plafond 5 min pour l'obligatoire, 1 obligatoire + 1 facultative, aucune minute inventée). Les légendes ne disent que ce que la fiche du catalogue établit, et elles invitent à observer : elles restent vraies quoi qu'on voie.

| | Légende (`why`) |
|---|---|
| **Obligatoire** : Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30) | Du jargon de bitcoin et de blockchain ramené, mot après mot, au langage de tous les jours. Repère chaque fois le mot simple qui prend la place du mot savant : c'est le réflexe à garder en réunion quand une formule sonne creux. |
| *Facultative, **si choix 5B*** : Anne Roumanoff, « Carmen et la crise » (4 min 50) | Carmen, une Française ordinaire, face à une crise économique qu'elle traverse avec un aplomb qui ne baisse jamais. Repère ce que le rire vise : une personne, ou un système qui déraille ? |
| *Facultative, **si choix 5A*** : Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Un avocat plaide pour la salade, la frite et la saucisse, avec tout le sérieux d'une vraie plaidoirie. Repère ce que ce ton solennel fait à un sujet qui ne l'est pas. |

(Sources : fiches de `boulot-base-s19.json`, « détourner le jargon tech en langage de tous les jours », « personnage naïf face à un système absurde », « plaidoirie hilarante ».)

**Les 5 vannes** : dépendent du choix 4 (§5). Ancrage commun aux deux options, texte exact en base, jamais utilisée dans un parcours : « Ma réunion 'point rapide avant l'été' a commencé à 14h. » / « On a fini par voter la police de caractère. » Décryptage de l'étape (une ligne) : le « point rapide » promet dix minutes, l'après-midi y passe, et la seule décision tient dans une police de caractère. Les autres places de l'étape 1 sont au §5.

---

## 4. Titre de la page et slug (choix 3)

Le titre du Boulot n'est pas dans `seo.md` §6 (les 4 titres signés sont /parcours, Répartie, Machine à Café, Confiance) : c'est une proposition à faire signer. Même gabarit que les autres quand c'est possible : « Parcours X : bénéfice en N semaines », 60 caractères maximum. Volumes de requêtes : **non mesurés** (aucun outil), je n'avance aucun chiffre.

**Point de vigilance.** La page Machine à Café porte déjà « Parcours Machine à Café : être drôle au bureau en 3 semaines » (cible : être drôle au travail, humour au bureau). Les deux propositions ci-dessous **n'emploient ni « drôle », ni « bureau », ni « humour », ni « au travail »** : le Boulot se place sur la situation (la réunion, le pot de départ), Machine à Café garde la requête générale. La même règle vaut pour le début de la `metaDescription` et pour le H1, à écrire plus tard.

| | Titre | Caractères |
|---|---|---|
| **A** (reco) | Parcours Boulot : oser une vanne en réunion, en 6 semaines | 58 |
| **B** | Parcours Boulot : de la réunion au pot de départ | 48 |

**Reco : A.** Elle porte la durée comme « Parcours Confiance : retrouver ta légèreté en 6 semaines », elle nomme la peur du persona (oser) et la situation la plus redoutée (la réunion), et elle ne touche pas à la requête de Machine à Café. B couvre mieux l'arc du parcours (deux de ses six situations) mais n'a ni durée ni verbe, et « pot de départ » attire sans doute des gens qui cherchent un discours à copier, ce qu'un article fait mieux qu'un parcours `[HYPOTHÈSE : intention de recherche non mesurée]`. Règle de partage SEO inchangée : l'article répond à la question, le parcours vend le programme et la première étape gratuite (jamais « cours gratuit »).
**Slug : `boulot`** (nom acquis, spec §3.1 et §9 point 1 : « Pro » se lit comme un palier de prix). Pas de choix : aucun ancien slug à rediriger (aucun parcours `pro` ni `boulot` en base). Le fichier Storytelling porte `"pro"` dans son `nextParcoursRanking` : à renommer `"boulot"` à l'import. Caractères comptés à la main, à re-vérifier à la signature.

---

## 5. Méthode de choix des vannes (choix 4)

Contrainte : 30 places (6 étapes × 5). Les ids de vannes de la spec viennent d'un seed périmé : on désigne chaque vanne par son **texte exact**. Il n'existe en tout que **16 vannes BOULOT actives** (plus 3 vannes actives sur le travail rangées ailleurs), dont 3 ne collent à aucune des 6 situations. Doublons de vannes acceptés (décision acquise), donc une vanne déjà en ligne peut servir.

**Écartées (garde-fou « jamais viser une personne », ou hors des 6 situations)** :
- « Mon collègue revient de 4 jours à Rome et me raconte tout en détail. » : la cible est le récit d'un collègue.
- « Avec un collègue, on a enfin comparé nos salaires. » : un sujet qui ne passerait pas le test de la salle entière (§7) devant tout le service.
- « Je télétravaillais chez ma mère… » et « Ma voisine m'a dit qu'elle m'entendait parler seul… » : le télétravail à la maison n'est pas une des 6 situations. La seconde reste en réserve pour l'étape 1 si le repli est la visio.

**Lecture étape par étape** (« fort » = la vanne illustre la leçon de l'étape ; « acceptable » = elle l'illustre à moitié ; entre parenthèses, où elle est déjà en ligne) :

| Étape | Actives qui collent vraiment (fort) | Actives acceptables | Places à pourvoir par des vannes neuves (A) |
|---|---|---|---|
| 1, la réunion en spectateur | « Ma réunion 'point rapide avant l'été' a commencé à 14h. » (aucun parcours) | « Mon manager m'a félicité pour ma discrétion. » (Machine à Café 1) : la discrétion de celui qui écoute sans parler | **3** |
| 2, le mail | « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » (Machine à Café 1) ; « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. » (Storytelling) ; « Mon adresse mail pro d'alternant commence par « alternant2 ». » (Répartie 2) | | **2** |
| 3, le couloir | « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » (Machine à Café 3) ; « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. » (aucun parcours) | « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. » (Confiance 1) | **2** |
| 4, l'afterwork | « J'ai passé mon stage à ranger les archives par ordre alphabétique. » (aucun parcours) ; « Pour mon entretien, j'ai emprunté le costume de mon père… Le recruteur m'a appelé Robert toute l'heure. » (Machine à Café 3) | « Ma collègue m'a briefé pendant 45 minutes avant ses congés pour me passer ses dossiers. » (Storytelling 2) | **2** |
| 5, « tu fais quoi dans la vie ? » | « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » (aucun parcours) | « Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements sont très bien ». » (Répartie 1) | **3** |
| 6, la parole officielle | « À mon pot de départ, mon chef a fait un discours de dix minutes… Bref. » (Storytelling 5, vanne à tiroir) | « Notre chef a offert à chacun un mug « meilleur collègue du monde ». On est quatorze. » (Machine à Café 3) | **3** |
| **Total** | **10 fortes** | **5 acceptables** = 15 actives | **15 neuves** |

Les 5 vannes BOULOT qui ne sont dans aucun parcours : 4 sont retenues (point rapide, canapé, archives, entretien) ; la cinquième (Rome) est écartée ci-dessus.
Techniques que les 15 vannes neuves doivent montrer (une fiche par étape, écrite avec l'étape) : 1, une formule creuse prise au pied de la lettre ou un rituel de réunion décrit comme un reportage ; 2, un message beaucoup trop sérieux pour son sujet (ressort du PS) ; 3, un irritant partagé dit en une phrase qui tient en quinze secondes ; 4, un moment absurde de la semaine en trois temps, la chute étant la phrase la plus courte ; 5, un métier décrit honnêtement en deux phrases, sans mépriser ni le poste ni l'employeur ; 6, une sincérité suivie d'une seule touche, ou une solennité décalée. Aucune ne vise un collègue ou un chef : le décryptage de chaque vanne dit ce qu'elle vise (la situation, le système, soi). Pour « À mon pot de départ… », le décryptage existant parle de l'éloge qui se contredit lui-même, ce qui tient.

**A (reco)** : les 15 actives ci-dessus là où elles collent, et **15 vannes neuves** (catégorie BOULOT), écrites par @copywriter puis relues à l'aveugle par deux relecteurs avant l'import ; rien n'est importé avant d'avoir passé la relecture (règle d'or).
**B** : les mêmes 15 actives, et 15 autres choisies parmi les 127 vannes actives du catalogue pour leur technique, sans lien avec le travail. Plus rapide, aucun texte à relire, mais l'étape « couloir » montrerait par exemple un barbecue.
Une étape qui ne montre pas son propre sujet est un défaut que l'audit des parcours de s17 reprochait déjà aux parcours existants, et le Boulot n'a qu'un seul argument : le travail. 15 vannes neuves, c'est trois fois le lot de Storytelling (5), parce que je n'ai repéré que 19 vannes actives sur le travail en tout (16 BOULOT, 3 rangées ailleurs ; recherche par mots-clés sur les 127 actives, `[À VÉRIFIER]` si tu veux un inventaire exhaustif). **Reco : A.**
Si tu préfères un lot plus petit : A pour les étapes 1, 5 et 6 (les plus faibles en actives), B pour les étapes 2, 3 et 4 (qui ont chacune 3 actives sur 5). Dis-le, c'est un détail d'import.

---

## 6. Vidéos des 6 étapes (choix 5)

Règle : 1 vidéo obligatoire (plafond 5 min, au-delà un extrait minuté) + 1 facultative, étape 6 une seule. Je n'invente aucune minute : tout extrait est marqué `[À MINUTER]`. Les 11 vidéos de la spec sont actives. La spec en juge 8 « moyennes » (Tsamère, Croce « Tinder », Brokerss « Snapchat », Guiz « cabillauds », Kev Adams, Roumanoff, Foresti, Delmoitiez) et 3 « fortes » (Thomas VDB, Haroun, Rollman). **Deux des trois « fortes » reposent sur une phrase qui n'est pas dans la fiche en base** : pas de « tu fais quoi dans la vie ? » chez Haroun (fiche : impro structurée, rebonds avec le public), pas de « pot de départ » chez Rollman (fiche : enterrements de vie, rituel social). Seule Thomas VDB tient (fiche : jargon ramené au langage de tous les jours).
Je cherche donc dans les 89 vidéos actives des remplaçantes plus justes, en préférant celles qui n'ont jamais servi (vérifié par `youtubeId` dans les parcours en ligne). Quand la meilleure a déjà servi, je le dis : les doublons sont acceptés, mais ils se paient.

| Étape | **A (spec)** | **B (mes remplacements)** | Pourquoi |
|---|---|---|---|
| 1, réunion | Obl. Thomas VDB, « Bitcoin, JPEG et blockchain » (4 min 30). Fac. Arnaud Tsamère, « L'avocat de la salade, la frite et la saucisse » (6 min) | Obl. identique. Fac. **Anne Roumanoff, « Carmen et la crise »** (4 min 50, jamais utilisée) | VDB reste. Roumanoff porte la leçon de l'étape (fiche : un personnage naïf face à un système absurde, donc un système et personne en face) ; elle est « moyenne » en afterwork, forte ici. Tsamère n'a que le cadre codifié. |
| 2, mail | Obl. Pierre Croce, « Tester Tinder avec un enfant » (3 min). Fac. Jason Brokerss, « Snapchat » (5 min 40) | Obl. **Pierre Croce, « Ce qu'on rêverait d'entendre dans l'avion »** (2 min 30, **reprise de Confiance 1**). Fac. Brokerss « Snapchat » inchangée | La fiche de l'avion parle d'une liste de one-liners : des annonces formelles retournées en une phrase, le même ressort qu'un PS ou un message au service. Tinder avec un enfant ne parle pas d'écrit pro. |
| 3, couloir | Obl. Guillermo Guiz, « Les cabillauds, ces arrogants ! » (4 min 30). Fac. Kev Adams, « Du côté de chez vous » (5 min 20) | Obl. **Fary, « Le legging »** (5 min, **reprise de Confiance 6**). Fac. Kev Adams inchangée | L'étape apprend à tirer une phrase d'un irritant que tout le monde connaît ; la fiche de Fary est un objet banal et rien d'autre. Les cabillauds sont de l'absurde pur, loin du couloir. `[À VÉRIFIER : la fiche parle de 8 minutes pour un sketch dont la durée en base est de 5 min]` |
| 4, afterwork | Obl. Roumanoff, « Carmen et la crise » (4 min 50). Fac. Florence Foresti, « Le styliste » (6 min) | Obl. **Guillermo Guiz, « Pas de sentiments au fast-food »** (4 min 30, jamais utilisée). Fac. Foresti inchangée | Roumanoff passe à l'étape 1. Guiz fait d'un McDo un sujet entier (fiche : une réflexion existentielle sur un fast-food) : le geste de l'étape, un moment banal de la semaine devenu un récit. |
| 5, « tu fais quoi dans la vie ? » | Obl. Haroun, « L'impro et la répartie » (5 min 45, **reprise de Répartie 4**, `[À MINUTER]`). Fac. Lisa Delmoitiez, « J'ai pas confiance en moi et j'ai raison » (6 min) | Obl. **Marina Rollman, « Les relations sociales »** (5 min 20, **reprise de Répartie 1**, `[À MINUTER]`). Fac. Delmoitiez inchangée | La fiche d'Haroun ne dit rien de la question. La fiche de Rollman parle de politesse, de conventions et de small talk : le terrain exact de « tu fais quoi dans la vie ? ». |
| 6, parole officielle | Une seule : Marina Rollman, « Les enterrements de vie » (6 min 40, **reprise de Confiance 4**, `[À MINUTER]`) | Une seule : **Nora Hamzawi, « Les chagrins d'amour »** (4 min, chronique France Inter, **reprise de Storytelling 3**) | Le pot de départ n'est pas dans la fiche de Rollman. Hamzawi : fiche « lucidité et auto-dérision, style introspectif et mordant », soit le geste de l'étape (un fond sincère, une touche d'humour) ; 4 min, aucun extrait à minuter. |

**Bilan.** A : 8 vidéos moyennes et 2 affirmations non tenues par la base, 2 reprises, 2 extraits `[À MINUTER]`. B : 6 vidéos changées (2 jamais utilisées, 4 reprises), 1 extrait `[À MINUTER]`, toutes actives dans l'export du 10/10. Les 5 autres (VDB, Snapchat, Kev Adams, Foresti, Delmoitiez) restent celles de la spec, moyennes pour 4 d'entre elles : je n'ai pas trouvé mieux parmi les 89, et le catalogue n'a aucun sketch sur la prise de parole officielle (l'alerte de la spec tient toujours). Si aucune vidéo ne te convainc à l'étape 6, l'étape peut n'en avoir aucune (vide assumé plutôt que placeholder bancal).
**Reco : B.** Je la proposerais par étape si tu veux nuancer : le gain est net aux étapes 1, 5 et 6 (la spec s'appuie sur une phrase absente de la fiche, ou place la vidéo là où elle sert le moins), moyen aux étapes 2, 3 et 4. Les 4 reprises de B (Confiance 1 et 6, Répartie 1, Storytelling 3) sont des vidéos vues à d'autres étapes d'autres parcours, jamais dans le même parcours. Les légendes des étapes 2 à 6 s'écrivent avec les étapes, en regardant chaque vidéo.

---

## 7. Le garde-fou « jamais viser une personne » (choix 6)

La spec le range en « vigilance » par étape. Chaque étape l'applique déjà à sa manière ; la question est de savoir si le parcours le dit **six fois différemment** ou **une fois, pareil partout**. Le cœur du parcours est là : l'humour au boulot se grille quand il vise quelqu'un, et le persona le sait. La fiche promet « sans te griller » (choix 2).

| Étape | **A : une vigilance propre à chaque étape** (déjà dans la spec) |
|---|---|
| 1 | Tu notes des formules, jamais ce que fait une personne. |
| 2 | Aucun envoi exigé ; le message reste montrable à tout le service (règle de la capture d'écran, déjà dans le conseil actif). |
| 3 | Un irritant partagé, jamais une personne. |
| 4 | L'anecdote met un moment absurde au centre, toi dedans, pas un collègue. |
| 5 | Tu te décris sans mépriser ton métier ni ton employeur. |
| 6 | Tu vises la situation, et tu n'ouvres jamais par l'humour. |

**B : un seul test, le même du début à la fin.** Une phrase fixe, en dernière phrase du texte (`moduleDetail`) des étapes 2 à 6, sans encadré ni titre en gras :
> Avant de la dire, un seul test : ta phrase passerait-elle si toute la salle l'entendait, y compris la personne ou le métier dont elle parle ?

À l'étape 1, rien à dire donc rien à tester : la phrase `[SI 6B]` du §3 l'introduit et la fait essayer à blanc, dans le carnet. Les consignes de sécurité propres aux étapes (aucun envoi exigé à l'étape 2, repli sans public, pas d'humour en ouverture à l'étape 6) **restent dans les exercices** : le test unifie le réflexe, il ne remplace pas ces consignes.

**Reco : B.** Personne ne retient six consignes différentes ; une seule question se retient, elle s'applique à une réunion comme à un mail ou à un toast, et elle tient la promesse « sans te griller » de la fiche. Elle prolonge la règle du conseil actif de l'étape 2 (la capture d'écran) sans la répéter. Coût : une phrase par étape, aucune nouvelle fonction. Risque : l'effet « consigne qui revient » ; c'est pourquoi la phrase est unique, jamais numérotée, jamais nommée comme une méthode, et on la retire des étapes 5 et 6 si elle lasse à la relecture du rendu. A reste le plan B si tu trouves la répétition scolaire.

---

## Signalements (information, rien à trancher)

1. **Comptage des vannes.** La session annonçait 9 vannes BOULOT déjà en ligne et 3 dans Storytelling ; mes recoupements par texte donnent 8 et 3 (Machine à Café 5, Répartie 3 ; Confiance 0), soit 16 avec les 5 hors parcours. Lecture dans `parcours-reecriture-s17.json` et `parcours-storytelling-s18.json` ; si la base en ligne diverge de ces fichiers, `[À VÉRIFIER @fullstack]`. Cela ne change aucun choix.
2. **La spec s'appuie sur deux phrases absentes des fiches vidéo en base** (Haroun, Rollman) : voir §6. Si la fiche complète existe ailleurs que dans l'export, dis-le, la reco 5B pour les étapes 5 et 6 serait à revoir.
3. **Étape 2 : le défi du conseil actif demande d'envoyer le PS.** Le texte actif dit « ajoute un PS d'une ligne à UN mail ou message pro sérieux » ; la spec exige « aucun envoi exigé » (risque professionnel réel) et un message à faible enjeu. Retouche proposée, une phrase ajoutée à la fin du défi, comme le repli solo de Storytelling : « Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. » En base ET dans `conseils-seed.json`. `[À CONFIRMER par toi : c'est une retouche d'un conseil actif au niveau]`.
4. **Conseil actif écarté** : « Compare la manie d'un collègue à un autre métier » (OBSERVATION, INTERMEDIAIRE) est actif mais vise une personne ; il n'est utilisé dans aucune étape du Boulot. `[À VÉRIFIER @fullstack : est-il déjà dans un autre parcours ?]` Il reste dans le catalogue, rien n'est désactivé.
5. **Étape 6 : tant que le conseil n'est pas validé, l'étape ne s'écrit pas.** Idem pour les étapes 1, 3, 4 et 5 : l'étape 1 du §3 est écrite sur l'objectif de la spec et son exercice sera aligné ensuite. Seule l'étape 2 peut s'écrire tout de suite.
6. **Recoupement avec Machine à Café 2** (observation pure en réunion) : traité dans le tableau du §3. Le défi de Machine à Café 2 n'a pas été relu en entier ; si son défi est aussi un bingo de formules, l'étape 1 du Boulot doit changer de geste (par exemple compter les rituels et non les formules). `[À VÉRIFIER avant validation]`
7. **Positions des bonnes réponses du quiz** : seule l'étape 1 est livrée (C, A, D). Pour les 19 questions du parcours (3 × 5 + 4), aucune position ne doit dépasser 40 %, soit 7 questions au plus par rang ; la répartition se vérifie à l'écriture des étapes 2 à 6.
8. **Durée de l'étape 1** (13 min 30 estimée en spec) : non mesurée, non écrite dans les textes.
9. **Champs à écrire plus tard, hors étalons** : `nextParcours`, `nextParcoursReason` et `metaDescription`. Classement de départ de la spec (§5.5) : `storytelling`, `machine-a-cafe`, `repartie`, `confiance`. La `metaDescription` évite aussi « drôle », « bureau », « humour » en tête (choix 3).
10. **Niveaux « Expert »** : aucun conseil du Boulot n'est marqué Expert dans la liste utile ; jamais affiché de toute façon (décision acquise).
11. **Vidéos hors plafond** : le plafond de 5 min vaut pour la vidéo obligatoire (spec RC4) ; les facultatives de la spec font 5 min 20 à 6 min et ne sont pas extraites. `[À CONFIRMER si tu veux le même plafond pour les facultatives]`

---

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'import, @design pour l'icône, @seo pour la signature du titre)

- **Fichier produit** : `/home/user/Marrant/docs/copy/etalons-parcours-boulot-s19.md`. Aucun autre fichier modifié, aucun commit, rien en base. `project-context.md` (historique) à compléter par la session.
- **Prêt (en attente de ta validation)** : fiche A/B (§2) ; étape 1 complète au format s18 (§3 : titre, `why`, `moduleDetail` avec scène, exercice, 3 questions de quiz complètes, légendes des 2 vidéos) ; titre A/B et slug (§4) ; méthode de vannes avec tableau étape par étape (§5) ; vidéos A/B étape par étape (§6) ; garde-fou A/B (§7). **Emplacement** : les 5 conseils (§1), `[EN COURS : relecture à l'aveugle, texte inséré quand il passe]`.
- **Frameworks et niveau de conscience (pour les agents, pas pour Thomas)** : fiche = PAS court, Solution-Aware ; étape 1 = PAS court avec scène, Product-Aware (vitrine lue avant l'achat) ; quiz = mise en situation puis explication, Product-Aware ; titre = bénéfice et durée, Problem-Aware.
- **Attend Thomas** : choix 1 (valider les textes des 5 conseils quand ils auront passé la relecture), 2, 3, 4, 5, 6, et la retouche du signalement 3. « Je suis tes recos » = valider le 1, puis B (fiche), A (titre), A (vannes), B (vidéos), B (garde-fou).
- **Après validation, @fullstack devra** : (1) **réactiver** les quatre conseils inactifs et **créer** celui de l'étape 6, textes copiés à l'identique de `conseils-boulot-s19-v1.md` après relecture, **en base ET dans `conseils-seed.json`** (ids vus dans l'export du 10/10 : « Survivre aux réunions avec humour » `cmmp8ozsx001fqk6301jruvzj`, « La vanne de couloir » `cmmw0tr870014mw62jnung2qp`, « L'afterwork » `cmmw0trc60016mw629l4o8rav`, « Survivre (et briller) au networking pro » `cmmw0tra60015mw62l0360wm9`, « Le PS qui détend un mail sérieux » actif `cmmw0tqkc000smw62bo1yfeyg` `[À VÉRIFIER sur la base de prod avant tout UPDATE]`) ; (2) si accordé, ajouter la phrase du signalement 3 au défi du PS ; (3) importer le parcours (`slug: boulot`, `order: 5`, vannes désignées par leur texte exact via `jokeContents`, `isActive` de chacune vérifié à l'import) ; (4) renommer `"pro"` en `"boulot"` dans le `nextParcoursRanking` du fichier Storytelling ; (5) laisser `icon` à @design ; (6) rejouer les vérifications de contenu (tirets cadratins, « blague », prénoms de persona) sur les textes importés.
- **Décisions prises** : registre « pote drôle et bienveillant » ; version B avec scène (acquis) ; Anouk comme personnage d'exemple (fiche + étape 1) ; positions de bonne réponse C, A, D pour l'étape 1 ; l'étape 1 est de l'observation pure (rien à dire, rien à envoyer) pour rester sans risque en vitrine ; titre de page sans « drôle », « bureau », « humour » pour ne pas concurrencer Machine à Café ; slug `boulot`.
- **Points d'attention** : objections traitées (« je vais me griller » : étape 1 sans parole, test de la salle entière, jamais une personne ; « je n'ai pas de réunion » : visio, réunion passée, mails ; « je n'ai personne à qui le dire » : carnet, ami hors boulot ; « ça ressemble à Machine à Café 2 » : tableau §3). Références consultées : étalons Storytelling s18 (modèle), spec s17 §1, §3, §9, export base du 10/10, fiches vidéo de l'export, 127 vannes actives (recherche par mots-clés), parcours en ligne (recoupements par texte et par `youtubeId`). Mots-clés SEO : `keyword-map` non lu ; titre `[À SIGNER, volumes non mesurés]`.
- **Contrôles faits sur ce fichier** : zéro tiret cadratin ; « blague » absent (sauf citation d'un titre de conseil en base) ; aucun prénom de persona dans les textes destinés au site (le champ interne `persona` suit la forme de Storytelling) ; aucun concurrent ; aucun chiffre du site modifié (« 15 min/semaine » et « 6 semaines » sont les décisions de la spec) ; humoristes cités uniquement dans les tableaux de choix et les légendes, avec ce que la fiche en base établit.
