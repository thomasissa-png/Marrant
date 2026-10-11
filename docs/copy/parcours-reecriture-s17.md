# Réécriture des 3 parcours, session 17 (07/10/2026)

Fichier livré : `docs/content/parcours-reecriture-s17.json` (objet `_meta` + `parcours`, mêmes clés que `parcours-seed.json`, plus `quiz[].explanation` et `jokeContents` à la place de `jokeIds`). Source : étalons validés (16 choix), audit COP-01 à COP-11, charte s11. Conseils non réécrits (ceux de la base font foi). Rien d'autre modifié, rien commité.

## 1. Taux de changement réel mesuré (règle P0 s11)

Aucun shell dans la session : décompte manuel champ par champ (seed contre nouveau fichier), caractères estimés.

| Zone | Modifiés / total | Détail |
|---|---|---|
| Parcours (niveau 1) | 6 / 42 | Confiance : difficulty, difficultyLabel, description, nextParcours, nextParcoursReason ; Machine à Café : difficultyLabel |
| Étapes hors quiz | 40 / 130 | moduleDetail 13, moduleFormat 13, vannes 13 (jokeIds vers jokeContents), why 1 (Confiance 3) |
| Vidéos | 31 / 104 | 21 légendes, 4 youtubeId, 3 artistes, 3 titres |
| Quiz | 146 / 162 | 54 questions, 54 listes d'options, 38 bonnes réponses déplacées (16 restent au même rang par hasard) |
| **Total** | **223 / 438 = 51 %** | + 54 champs ajoutés (explanation) |

Caractères : environ 85 % du texte du seed remplacé (±10 %), hors les 54 explications ajoutées (environ 12 000 caractères). L'essentiel du reste inchangé est du texte qui était déjà juste (titres d'étape, 12 « why » sur 13, 5 légendes vidéo).
**Intouchables contrôlés** : slugs 3/3, `week` et `dayNumber` 13/13, `moduleXp` 13/13, `free` 13/13, `tipTitle` 13/13, `moduleTitle` 13/13 (aucun titre scolaire à changer), duration, timePerWeek, testimonial (Léa, Tom, Julien), personaTagline, icon, order, 54 questions conservées, aucun prix.

## 2. Avant / après par étape (extraits)

| Étape | « Ce que tu vas apprendre » avant | Après |
|---|---|---|
| MàC 1 | « Une vanne de pause café se dit d'une traite… réserve » | Étalon B : « Le faux secret est la vanne la plus facile à lâcher… Imagine Léa qui avoue… » |
| MàC 2 | « Entre le flop et le fou rire, il y a souvent 3 secondes » | « Un blanc d'à peine deux secondes… pendant le rire personne ne t'entend » |
| MàC 3 | « Structure, détails, chute : les 3 ingrédients » (le conseil n'enseigne que les détails) | « ajouter trois détails précis (heure, lieu, prénom, vêtement) » |
| Rép 1 | « Rebondir, accuser réception, reformuler : 3 réflexes » | Étalon B : « Ton coloc laisse la vaisselle pour la troisième fois… » |
| Rép 2 | « Les pauses, le regard, le rythme » (3 angles) | Un seul angle : le blanc de deux secondes entre deux chansons |
| Rép 3 | « …retourner la situation avec humour » | Même texte, méthode nommée : accepter, exagérer, retourner |
| Rép 4 | « Trouver ta réplique en moins de 2 secondes » | Décrire la scène en moins de 2 secondes, « oui, et » |
| Conf 1 | « Regarder ton quotidien… pas d'exercice à rater » | Étalon B : « Imagine Julien dans une salle d'attente… article de loi » |
| Conf 2 | « …la frontière est fine » | Verdict contre fait, l'objet conclut, ce qui fait mal reste pour toi |
| Conf 3 | « Repérer le détail absurde… » + why « MSN, K7 et la vie avant Internet » | Geste d'avant face à son équivalent d'aujourd'hui, ton tendre ; why sans MSN/K7 |
| Conf 4 | « Participer, rebondir… passer du public à la scène » | Rôles, remarque chirurgicale, une phrase bien sentie |
| Conf 5 | « Absurde, ironie, second degré » (le conseil : décalage de registre) | Ton solennel posé sur un sujet banal, un registre à la fois |
| Conf 6 | « Te constituer un répertoire » | Retrouver trois messages qui ont fait rire, chercher ce qui se répète |

Libellé de format (13 étapes) : « Conseil technique + vannes à pratiquer + vidéo d'exemple + quiz » devient « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » (« un dernier quiz » pour MàC 3, Rép 4, Conf 6).
Niveaux : MàC « DEBUTANT » (au lieu de Débutant → Intermédiaire), Confiance « INTERMEDIAIRE » et « Débutant → Intermédiaire » (au lieu de EXPERT / Débutant → Expert). Confiance renvoie maintenant vers Répartie (plus vers Machine à Café, parcours débutant). Description de Confiance : « répartie » retirée (non enseignée).
Défis retouchés (dans `_meta.defisRetouches`, base et seed) : Rép 1 et Conf 1 (validés, choix 4), Rép 4 (repli solo). Proposés en plus, à confirmer : MàC 3, Conf 4.

## 3. Quiz : répartition des bonnes réponses

| | A | B | C | D | Total |
|---|---|---|---|---|---|
| MàC (12) | 3 | 3 | 3 | 3 | 12 |
| Répartie (17) | 4 | 5 | 4 | 4 | 17 |
| Confiance (25) | 7 | 5 | 7 | 6 | 25 |
| **Total** | **14** | **13** | **14** | **13** | **54** |

Avant : 38 sur 54 en B (70 %), aucune en D. Règles tenues : jamais plus de 2 sur 4 au même rang dans une étape, jamais 2 de suite identiques (y compris d'une étape à l'autre), explication de 3 phrases maximum, « vanne » partout (les seuls « blague » restants : le titre réel du sketch « Petites blagues entre amis » et le rôle « blagueur »), zéro tiret cadratin, zéro IA. Les 3 questions étalon sont la question 1 de MàC 1 (C), Rép 1 (D), Conf 1 (A) ; leurs explications sont reprises des étalons, resserrées à 3 phrases.

## 4. Durée estimée par étape (lecture 200 mots/min, quiz 40 s/question, exercice 7 min, vidéos du seed)

| Étape | Hors vidéos | Vidéos | Total |
|---|---|---|---|
| MàC 1 / 2 / 3 | 12 / 12 / 12 min | 11:25 / 10:25 / 11:30 | 23 / 22 / 23 |
| Rép 1 / 2 / 3 / 4 | 12 / 12 / 12 / 12 | 14:50 / 14:25 / 14:30 / 13:45 | 27 / 26 / 26 / 26 |
| Conf 1 / 2 / 3 | 12 / 12 / 12 | 10:42 / 16:05 / 16:45 | 22 / 28 / 28 |
| Conf 4 / 5 / 6 | 12 / 12 / 12 | 15:40 / 15:05 / 12:30 | 27 / 27 / 25 |

**Signalement** : 13 étapes sur 13 tiennent en 20 min hors vidéos, 0 sur 13 avec les vidéos (22 à 28 min). La promesse « 15 à 20 min/semaine » ne tient donc que si les vidéos sont facultatives. La ligne de format ne dit pas « à regarder », donc reste vraie, mais un badge « facultatif » sur les vidéos (@fullstack) la sécuriserait. Confiance 6 passe de 90 à 25 min.

## 5. Vidéos changées (23 youtubeId distincts, tous présents dans `videos-seed.json`)

| Étape | Avant | Après |
|---|---|---|
| Rép 1 | Haroun `qdqIc-uzdbA` | Marina Rollman « Les relations sociales » `m30qZa8p_Js` (5:20) |
| Rép 3 | Marina Rollman `m30qZa8p_Js` | Sugar Sammy « La procureure et l'immigrant » `t2MsC6I9t5U` (5:00), même technique : accepter, pousser à l'absurde, retourner |
| Conf 6 | Kyan Khojandi « Pulsions » `u41ujNodvnM` (72 min) | Doully « Qu'est-ce qu'elle a ma voix ? » `da21Xp8hGYY` (7:30) |
| MàC 3 | `57Ip2k3us_8` (Thomas VDB, mauvaise vidéo) | Djimo `tpIOLzv11qo` (4:30) |

Légendes réécrites (21) : MàC 2 et 3, Rép 1 à 3, Rép 4 (Haroun), Conf 1 à 6 (sauf Navo, Lecaplain, Wiesel/Khojandi de Conf 4, Paul Séré et Karim Duval de MàC 1 : déjà justes). Vidéos encore reprises : Brokerss (MàC 2 et Rép 2), Wiesel/Khojandi (Rép 2 et Conf 4), Lilia (Rép 1 et Rép 3) : légendes différentes par étape.

## 6. Vannes : 5 par étape, toutes prises dans la liste des vannes actives

Contrôle : **65 sur 65 présentes dans `vannes-actives-s17.json`** (127 vannes actives), 65 distinctes, copiées caractère pour caractère dans `jokeContents`. Les 65 anciens identifiants sont tous remplacés (45 étaient inactives, 15 introuvables, dont 82, 85, 180).

| Étape | Technique | Les 5 vannes (début) |
|---|---|---|
| MàC 1 | faux secret, aveu minuscule | Je suis nul en small talk… / Avec un collègue, on a enfin comparé… / Je suis en copie de 90 mails… / Mon manager m'a félicité pour ma discrétion / J'ai téléchargé une app… calories |
| MàC 2 | blanc, timing | Le jury m'a dit « prenez votre temps » / Au théâtre, l'acteur s'est arrêté… / Ma réunion 'point rapide'… / Mon collègue revient de 4 jours à Rome / Ma collègue m'a briefé pendant 45 minutes |
| MàC 3 | détails précis | Pour mon entretien… costume de mon père / Le portique à reconnaissance faciale… / Notre chef a offert… un mug / Dans le TGV, la seule prise… / Mon voisin tousse… 7h12 |
| Rép 1 | ironie douce | Mon père a vu mon appart / Mon tuteur a lu mon rapport de stage / Ma sœur… « pardonné » mon retard / Mon père est retraité… très pris / Mon copain m'a rendu le chargeur |
| Rép 2 | blanc entre deux chansons | Y'a toujours un mec qui dit « c'est ma chanson ! » / À la fête de la musique… / Sur la table d'apéro, les bâtonnets… / Je ne connaissais personne… le chat / Au jeu de mimes… « la timidité » |
| Rép 3 | accepter, exagérer, retourner | Mon petit frère m'appelle « papi » / Mon frère jumeau est né six minutes avant moi / Je télétravaillais chez ma mère… / Ma voisine… j'étais en visio / Ma sœur raconte… à huit ans |
| Rép 4 | rebondir sur un raté | Mon ex est venue nous dire bonjour… / Au jeu « deux vérités… » / L'audioguide du musée… / Dans le métro… « vous descendez ? » / Un pote a quitté le groupe… |
| Conf 1 | règle non écrite | En France, la pause déjeuner est sacrée… / Mon meilleur pote et moi… « un truc » / Dans le train, la place… réservée / Quand quelqu'un commence par « à la base » / Mon père dit « je vais chercher du pain » |
| Conf 2 | fait, pas verdict | Mon détecteur de fumée me sert de minuteur… / Le médecin… cafés… deux / J'ai mis mon réveil en face du lit / J'ai chanté une chanson… dix ans / Quand on tape mon nom sur Internet… |
| Conf 3 | avant et aujourd'hui | Ma grand-mère cuisine toujours pour douze / Ma mère… quitté Facebook / Dans le groupe de mon ancienne classe… / Mon frère m'a emprunté ma console / Mon père… MAJUSCULES |
| Conf 4 | place en groupe | Au mariage de mon cousin… table des amis d'enfance / Mon voisin a glissé un mot… / Au milieu de la soirée… la vaisselle / Mon cousin ramène une nouvelle copine… / Le groupe de mon immeuble… |
| Conf 5 | décalage de registre | Mon voisin m'a offert une tomate… don d'organe / Mon père… « fasse mes preuves » / Il y a un canapé dans l'espace détente… / Ma mère a vu que j'allais au Hellfest / Ma mère a rêvé que j'avais une promotion… |
| Conf 6 | styles variés | Mon ambition dans la vie… / J'ai dit à mon chat… vétérinaire / Tous les soirs, mon voisin se dispute avec sa télé / J'ai trouvé un carnet dans la rue… / Ma nièce de quatre ans… |

Persona : Sophie sur situations de bureau, Yanis sur TD, soirée et famille, Marc sans vanne de couple ni d'ex, sans « vie avant Internet ».

## 7. [À VÉRIFIER]

- Légendes vidéo, Sugar Sammy (thème sensible, fiche « EXPERT ») et Haroun : écrites d'après les fiches du catalogue, vidéos non visionnées. Repli possible pour Rép 3 : Mirabel et Elmaleh `OR-1TUobxk8` (« le respect qui chambre », 8 min).
- Vannes : choisies sur `content`, `category` et `comedyTechnique` (chutes et explications de technique non relues une à une) : contrôle du fit par @reviewer.
- Conseils lus dans les exports de la session s14, pas en base : MàC 3, Conf 4 et Conf 5 (texte non relu en base). Si le conseil en base diffère, aligner moduleDetail et quiz.
- @fullstack : clé `explanation`, « Étape N » à la place de « Semaine N », enums de niveau, `nextParcours` de Confiance, « 5 vannes » vrai seulement quand l'affichage D4 est en ligne, retouches de défi dans la base et le seed.
- Doublon de bonne réponse sur le sens : Rép 2 et MàC 2 parlent toutes deux d'un blanc de deux secondes (angles distincts : après le rire, entre deux chansons).
- Validation Thomas : retouches de défi MàC 3 et Conf 4 (hors étalons), Confiance vers Répartie.

## 8. Corrections N3 (revue croisée, réserve N3 et point 4)

Fichiers touchés : `docs/content/parcours-seed.json` et `docs/content/parcours-reecriture-s17.json` (tableau `parcours`), mêmes modifications dans les deux. Rien d'autre : répartition des bonnes réponses (A/B/C/D), slugs, XP, titres, nombre de questions (54) et ordre des étapes inchangés. Pour MàC 2, Rép 2 et Conf 5, les listes ci-dessous remplacent les lignes correspondantes du tableau du § 6.

### 8.1 Question corrigée : Répartie 2, question 2 (la scène contredisait la bonne réponse)

| | Avant | Après |
|---|---|---|
| Question | « Quelle phrase fonctionne le mieux dans ce blanc ? » (la scène n'était posée que dans la question 1) | « La musique vient de s'arrêter et tout le monde parlait trop fort. Quelle phrase fonctionne le mieux dans ce blanc ? » |
| Bonne réponse (D, inchangée de place) | « Je viens de remarquer que je chuchotais depuis dix minutes. » | « Je viens de remarquer que je criais depuis dix minutes. » |
| Explication | « La D : une pensée simple et vraie, dite sans effort, et chacun se reconnaît dans le petit choc de silence. La A est une vanne longue, … » | « La D : une pensée simple et vraie, dite sans effort, et chacun s'y reconnaît, puisque tout le monde criait aussi. La A est une vanne longue, … » |

Scène, bonne réponse et explication disent maintenant la même chose : tout le monde parlait trop fort, donc « je criais ». Les trois mauvaises réponses sont inchangées.

### 8.2 Question rendue indiscutable : Confiance 1, question 3 (bonne réponse toujours en B)

Le défaut : « Où est-il le plus facile de repérer une règle non écrite ? » opposait une file d'attente à un dîner ou une soirée, où il y a aussi des règles non écrites. Le choix dépendait d'un avis. La question demande maintenant de reconnaître une règle non écrite parmi des cas qui n'en sont clairement pas.

| | Avant | Après |
|---|---|---|
| Question | « Où est-il le plus facile de repérer une règle non écrite ? » | « Laquelle de ces situations montre une règle non écrite, celle que tout le monde suit sans que personne ne l'ait jamais dite ? » |
| A | Dans un dîner entre amis où tout le monde parle en même temps | Un panneau « Interdit de fumer » affiché à l'entrée de la gare (règle écrite) |
| B (bonne) | Dans une file d'attente où chacun fixe son téléphone en silence | Dans une file d'attente, chacun fixe son téléphone et garde un mètre d'écart avec le suivant, sans un mot |
| C | Dans une soirée avec de la musique forte | Un collègue qui arrive en retard à la réunion du lundi (cas isolé) |
| D | Dans un bureau où tu es seul | Une vendeuse qui annonce un prix à voix haute (geste ponctuel) |
| Explication | « La B : des gens proches qui ne se parlent pas appliquent des règles que personne n'a dites… » | « La B : tout le monde applique la règle alors que personne ne l'a écrite ni dite, et c'est celle-là que tu peux énoncer. La A est une règle écrite, la C un cas isolé, la D un geste ponctuel. » |

### 8.3 Vannes remplacées, 5 par étape, `comedyTechnique` indiqué

Contrôle : les 15 vannes des trois étapes sont présentes dans `vannes-actives-s17.json` (`content` copié caractère pour caractère, vérifié par recherche exacte : 15 sur 15), les 15 sont distinctes entre elles, et aucune n'apparaît dans une autre des 13 étapes (15 occurrences exactement dans chaque fichier de parcours). 12 vannes changent sur 65 (MàC 2 : 5, Rép 2 : 4, Conf 5 : 3). Les 53 autres sont intactes.

**Machine à Café 2, « Lire le tempo du groupe » (technique : timing, le blanc après le rire, savoir quand c'est ton tour).** Les 5 anciennes vannes parlaient de temps qui passe, pas du moment où on parle.

| # | Vanne (`content`) | `comedyTechnique` |
|---|---|---|
| 1 | Mes parents m'ont dit qu'ils étaient fiers de moi. J'ai demandé pourquoi. | L'aveu par le silence |
| 2 | Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagram. | L'anticlimax |
| 3 | Mon copain a dit « je m'en occupe » pour la fuite sous l'évier. C'était en mars. | L'exagération temporelle |
| 4 | Mon père décroche toujours par « qu'est-ce qui se passe ? ». | Le renversement d'attente |
| 5 | Mon voisin a sonné, inquiet, à cause des cris de ma série. | Le renversement d'attente |

Limite assumée : la liste des 127 vannes actives n'a aucune `comedyTechnique` « timing » à proprement parler. J'ai retenu celles dont la chute repose sur une attente, un silence ou une durée (la vanne 1 est la plus proche : le blanc est la réponse).

**Répartie 2, « Le silence entre deux chansons » (technique : laisser le blanc travailler, une phrase courte, simple et honnête).**

| # | Vanne (`content`) | `comedyTechnique` |
|---|---|---|
| 1 | Y'a toujours un mec qui dit « c'est ma chanson ! » toutes les 3 chansons. (conservée) | Le deadpan factuel |
| 2 | Ma mère m'appelle chaque dimanche pour savoir si je mange bien. Je réponds oui. | L'implicite tendre |
| 3 | J'ai dit à mon grand-père que je l'admirais. | La tendresse esquivée |
| 4 | Mon adresse mail pro d'alternant commence par « alternant2 ». | L'implicite inquiétant |
| 5 | Ma copine nous a acheté deux pulls assortis. On les a mis pour sortir. | Le miroir gênant |

Fil conducteur : la chute est dite plate et courte, et ce qui n'est pas dit fait le rire, comme le silence de l'étape. Les 4 anciennes vannes de soirée (fête de la musique, bâtonnets de carottes, le chat, jeu de mimes) quittent l'étape.

**Confiance 5, « Le décalage de registre » (technique : ton solennel ou administratif posé sur un sujet banal).**

| # | Vanne (`content`) | `comedyTechnique` |
|---|---|---|
| 1 | Mon voisin m'a offert une tomate de son balcon avec la solennité d'un don d'organe. (conservée) | La solennité disproportionnée |
| 2 | Mon père m'a dit qu'il fallait que je « fasse mes preuves ». (conservée) | La preuve administrative |
| 3 | J'ai demandé à une IA si mon message « tu viens ce soir ? » n'était pas trop sec. | Le décalage de registre |
| 4 | J'ai demandé à l'IA d'écrire mon discours pour le mariage de mon frère. Elle m'a posé cinq questions sur lui. | L'euphémisme démasqué |
| 5 | Ma grand-mère est niveau 4 812 dans son jeu de bonbons. Je suis niveau 60 dans mon jeu de rôle. | Le contraste de statut |

Persona : aucune vanne de couple ni d'ex pour Marc (les candidats « copain » et « copine » ont été écartés). La vanne 5 est la moins proche de la technique (le « c'est un bon début » de la grand-mère est un ton de coach posé sur un jeu de bonbons) : à confirmer par @reviewer.

### 8.4 Points à confirmer

- Fit des vannes : choix faits sur `comedyTechnique` et sur le sens de la chute (explications de technique lues), pas validés à l'aveugle. Contrôle par @reviewer.
- Persona de Rép 2 : la vanne 5 (« deux pulls assortis ») est une vanne de couple ; elle reste lisible pour Yanis, mais c'est la plus fragile de l'étape.
- Seule la formulation Rép 2, question 2 et Conf 1, question 3 change côté quiz. `_meta` du fichier de réécriture n'est pas touché (ses lignes « vannes » et « tauxDeChangement » décrivent l'état avant N3).

## 9. Doublons moduleDetail (DES-2-10)

[Framework : PAS court, la promesse de l'étape sans recopier le conseil] [Conscience : Solution-Aware]

**Constat** : le bloc « Ce que tu vas apprendre » (`moduleDetail`) s'affiche juste au-dessus du conseil. Comparaison des 13 étapes avec le texte du conseil de `conseils-seed.json` (aligné sur la base de prod). **7 doublons** : le `moduleDetail` reprenait la phrase d'ouverture ou paraphrasait le conseil phrase par phrase. Chacun est réécrit pour annoncer la promesse, l'angle et le bénéfice, sans reprendre la formulation du conseil. Seul `moduleDetail` change, à l'identique dans `parcours-seed.json` et `parcours-reecriture-s17.json` (7 occurrences vérifiées dans chaque fichier). Conseils, quiz, vannes, `why`, titres, XP : intouchés. Longueurs à ±15 % (estimées, voir plus bas), tutoiement, « vanne », zéro tiret cadratin.

| Étape | Ancien début | Nouveau texte |
|---|---|---|
| Machine à Café 2 « Sentir le bon moment » | « À la pause, en réunion, à l'afterwork : le rire d'un groupe a un rythme. Une histoire, les rires, puis un blanc d'à peine deux secondes… » (paraphrase du conseil : rythme, blanc de deux secondes, « personne ne t'entend », « rien à préparer ») | Écouter un groupe comme on écoute un morceau : où ça monte, où ça retombe, où il y a de la place pour toi. C'est ce que tu t'entraînes à faire ici. Tu arrêtes de te demander si tu es assez drôle, tu te demandes seulement si c'est le bon moment. À la pause, en réunion ou à l'afterwork, cette étape ne te demande de faire rire personne : seulement d'entendre le rythme. |
| Répartie 2 « Le rythme et les silences » (cas DES-2-10) | « En soirée, la musique laisse parfois un blanc de deux secondes entre deux morceaux, et toutes les conversations paraissent soudain trop fortes. Si tu glisses une phrase courte… » (1re phrase identique au conseil, puis paraphrase des 3 suivantes) | Certaines phrases ne demandent aucun talent, seulement un bon timing. Ici, tu apprends à repérer un instant que tout le monde ressent en même temps sans que personne le dise, et à t'en servir pour prendre la parole. Pas besoin d'être drôle : une phrase courte, placée au bon moment, fait plus d'effet qu'un long discours. C'est l'entrée en matière la plus douce quand tu te sens un peu en retrait en soirée. |
| Répartie 4 « Improviser sur l'inattendu » | « Ta vanne tombe à plat et personne ne rit : plutôt que de te justifier, tu décris ce qui se passe vraiment, en moins de 2 secondes, comme un constat de terrain… » (reprise de « constat de terrain », « moins de 2 secondes », « tu acceptes ce qui arrive, puis tu ajoutes ») | Une vanne qui ne marche pas arrive à tout le monde, même aux humoristes. Ce qui compte, c'est la seconde d'après : tu apprends à reprendre la main sans t'excuser et sans t'expliquer, en t'inspirant du « oui, et » de l'impro. Résultat : un silence gênant devient un moment complice. De quoi être à l'aise au BDE, en coloc, en soirée, et même à un premier rendez-vous. |
| Confiance 2 « Rire de toi sans te rabaisser » | « Transformer un moment gênant en anecdote drôle, sans te dévaloriser au passage. Entre « je suis nul en cuisine » (un verdict) et « mon gâteau… » (un fait)… » (reprise de verdict/fait, « un objet ou une situation conclure à ta place », « ce qui fait vraiment mal, tu le gardes pour toi ») | Rire de toi n'a rien de honteux, à condition que ce soit toi qui tiennes la plume. Tu apprends à transformer un moment gênant en histoire qui fait sourire, sans que personne ait à te plaindre. Tu restes aux commandes de ce que tu racontes : une vraie blessure n'a pas à devenir une vanne. Au bout du compte, tu montres que tu es à l'aise avec toi-même, et ça met les autres à l'aise aussi. |
| Confiance 3 « L'œil de l'observateur » | « Prendre un geste d'avant qui a disparu ou changé (appeler chez quelqu'un, attendre qu'une page se charge) et le mettre face à son équivalent d'aujourd'hui : la chute se cache dans ce qui n'a pas changé au fond… Garde un ton tendre : tu ne regrettes rien, tu constates. » (quasi mot pour mot le conseil) | Autour de toi, des tas de petits gestes ont changé sans qu'on s'en rende compte. Tu apprends à les remarquer, à les comparer avec ceux d'avant, et à en rire avec tendresse plutôt qu'avec nostalgie. Tes références deviennent un avantage : ceux qui n'ont pas connu ce monde ne peuvent pas le raconter de l'intérieur. Au bout d'un moment, tu ne vas plus faire les courses : tu pars en repérage, et tu reviens avec de quoi animer le prochain dîner. |
| Confiance 4 « Être à l'aise en groupe » | « Dans un groupe qui rit, les rôles se distribuent vite, et celui du boute-en-train n'est pas obligatoire : ton créneau, c'est la remarque chirurgicale. Tu observes… » (ouverture et formules du conseil : « rôles se distribuent vite », « boute-en-train », « ton créneau », « remarque chirurgicale ») | Tu peux compter dans un groupe qui rit sans en être le plus bavard. Tu apprends à faire de ton côté observateur ta meilleure carte : intervenir peu, mais juste, te rend plus mémorable que d'enchaîner pour exister. Fini l'impression de devoir lutter pour ta place. Pour les dîners entre amis, les apéros et les soirées où tu ne connais que la personne qui invite. |
| Confiance 6 « Affirmer ton style personnel » | « Ton style n'est pas à inventer : il est déjà dans ce que tu as envoyé. Tu retrouves trois messages qui ont fait répondre « mdr », tu cherches ce qui se répète (la façon d'ouvrir, la longueur, le genre de détail, le ton), puis tu le refais exprès sur un quatrième sujet. » (le conseil, resserré) | Avoir un style, ce n'est pas inventer quelque chose de neuf : c'est reconnaître ce que tu fais déjà quand tu fais rire. Tu pars de ce qui a déjà marché autour de toi, tu repères ta signature, puis tu apprends à la refaire exprès. Comme tu t'appuies sur du vrai, la pression retombe. Tu repars avec un humour qui a ta voix, pas celle de ton humoriste préféré. |

Longueurs (caractères, espaces compris), ancien puis nouveau : Mach. 2 ≈ 415 puis ≈ 395 ; Rép 2 ≈ 395 puis ≈ 415 ; Rép 4 ≈ 385 puis ≈ 375 ; Conf 2 ≈ 455 puis ≈ 400 ; Conf 3 ≈ 480 puis ≈ 455 ; Conf 4 ≈ 395 puis ≈ 365 ; Conf 6 ≈ 395 puis ≈ 365. Estimations à la main : les 7 sont dans la fourchette ±15 % (écart le plus fort : Conf 2, environ -12 %).

**Examinés, non corrigés (échos de notion, pas de phrase reprise)**
- **Machine à Café 1** (étalon validé B) : seul écho, « la petitesse de l'aveu », deux mots d'un même concept ; la phrase d'ouverture est différente (le conseil ouvre sur la machine à café, pas sur le faux secret).
- **Répartie 1** (étalon validé B) : la 3e phrase définit l'ironie (« dire l'inverse de ce que tu penses, avec le sourire, assez évidemment pour que personne ne se vexe ») et le conseil la définit aussi (« dire le contraire de ce que tu penses, si évidemment que ça fait rire sans blesser »). Quasi-écho d'une définition, sur un texte étalon que je ne retouche pas sans ton GO. Si tu veux le lever : « L'ironie bienveillante est la sortie du milieu. Tu apprends à la doser : une phrase, un sourire, et personne ne se vexe. »
- **Confiance 1** (étalon validé B) : « la reconnaissance fait le travail » rejoint « le plaisir vient de la reconnaissance » ; même constat, ouverture différente (la scène de Julien). Laissé.
- **Machine à Café 3, Répartie 3, Confiance 5** : même notion que le conseil (détails précis, trois temps, contraste solennel/banal) mais exemples et formulation propres. Laissés.

**Points à confirmer**
- Tous les textes ci-dessus sont des promesses d'angle, sans fait nouveau : « même aux humoristes » (Rép 4) est une généralité, pas une citation. Aucune feature, aucun chiffre ajouté.
- Les `why` (« Pourquoi cette étape ? ») n'étaient pas dans le périmètre : je les ai lus pour éviter de recréer un écho à leur niveau (Mach. 2 et Rép 2 ouvrent maintenant différemment du `why`).
- Pas de commande de comparaison automatique disponible dans cette session (pas de shell) : comparaison faite par lecture des 13 paires et par Grep d'identité des 7 nouveaux textes dans les deux JSON (7 occurrences exactes dans chaque fichier, 13 `moduleDetail` dans chacun, zéro tiret cadratin).
