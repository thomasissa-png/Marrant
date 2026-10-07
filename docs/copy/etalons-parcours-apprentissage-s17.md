# Étalons des parcours d'apprentissage (s17, 07/10/2026)

> **Statut : à valider par Thomas avant toute réécriture** (décision D5, règle P0 s8 : 3 à 5 étalons calibrés avec le fondateur). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les agents de code gardent leurs textes provisoires (`config/textes/parcours.ts`, `parcours-emails.ts`) jusqu'à ton retour.
> Décisions respectées : « 15 à 20 min/semaine » inchangé ; pas de certificat ; « première étape gratuite », jamais « cours gratuit » ; pas de compte gratuit ; blocage s16 « Valider l'étape fait partie de Premium. » + bouton « Voir l'offre Premium » conservé tel quel (étalon s15 4.1, repris en s16) ; aucun prix écrit en dur ; chiffres du site, « 1 500+ » et humoristes intouchés.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin, pas scolaire, exemples « Imagine Léa… » présentés comme exemples, aucune mention d'IA, aucun concurrent, aucune promesse non codée (ce qui dépend d'un fait à confirmer est marqué `[À VÉRIFIER]`). Les `{...}` sont des champs remplis automatiquement, avec un repli propre quand la donnée manque (jamais de « undefined », de crochets ou de date en anglais).
> **Le conseil affiché en base fait foi.** Je l'ai relu dans les captures de prod du 07/10 (`docs/qa/captures-parcours-apprentissage-s17/`) et dans `docs/copy/audit-vannes-s14/parcours-reecrits-r3.json` pour Machine à Café 1, Répartie 1 et Confiance 1. Aucun conseil n'est réécrit ici : ce sont le texte de l'étape, le quiz et les légendes qui s'alignent sur lui. Seules deux retouches d'exercice (repli solo) sont proposées en choix 4.

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | Point | Options | Reco |
|---|---|---|---|
| 1 | Machine à Café 1, texte d'étape | A sobre / B avec une scène | **B** |
| 2 | Répartie 1, texte d'étape | A sobre / B avec une scène | **B** |
| 3 | Confiance 1, texte d'étape | A sobre / B avec une scène | **B** |
| 4 | Repli solo sur 2 exercices (Rép 1, Conf 1) | A oui / B non | **A** |
| 5 | Vidéos de Répartie 1 | A garder et réécrire les légendes / B échanger une vidéo | **B** |
| 6 | Ton des quiz | A sobre / B complice | **B** |
| 7 | Aperçu visiteur d'une étape 2+ | A factuel / B invitation (par élément) | **mix : intro B, bas d'aperçu A** |
| 8 | Fin de quiz côté visiteur | A neutre / B qui réagit au score | **B** |
| 9 | « Prochaine étape conseillée le … » | A court / B explicatif | **A** |
| 10 | « Reprendre ton parcours » | A / B | **A** |
| 11 | 3 boutons de retour d'exercice | A courts / B à la première personne | **A** |
| 12 | Bilan de fin de parcours | A structuré / B court et drôle | **A, avec la phrase maison de B** |
| 13 | Rappel hebdomadaire sur demande (interrupteur + e-mail) | A / B | **A** (objet 7.2) |
| 14 | Libellé de la série | A explicite / B compact | **A** |
| 15 | « Première étape gratuite » (liens d'entrée) | A / B | **A** |
| 16 | Vidéo de Confiance 6 (spectacle de 72 min) | A vidéo courte du catalogue / B passage minuté | **A** |

« Je suis tes recos » suffit. Le détail et les textes complets sont dessous.

---

## 1. Les 3 étapes gratuites réalignées

[Framework : PAS court, la promesse de l'étape tient sans surprise] [Conscience : Solution-Aware, c'est la vitrine que le visiteur lit avant de payer]

**Règle d'alignement** : un seul enseignement par étape, repris tel quel dans le texte de l'étape, le défi et le quiz. On garde ce qui est déjà juste (« Pourquoi cette étape ? » de Répartie 1 et de Confiance 1 décrit déjà bien le conseil) : on ne réécrit que ce qui ment ou ce qui répète. Titre d'étape, XP, vannes et nombre d'étapes ne bougent pas.

**Ligne de format, commune aux 3 étapes** (remplace « Conseil technique + vannes à pratiquer + vidéo d'exemple + quiz », qui sonne fiche de cours) :
> Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz.

`[À VÉRIFIER @fullstack : les 5 vannes doivent être réellement affichées dans l'étape (décision D4) avant mise en ligne de cette ligne ; sinon retirer « 5 vannes ».]` Rien n'oblige à lancer les vidéos pour passer le quiz : la ligne ne dit pas « à regarder », donc elle reste vraie.

### 1.1 Machine à Café, étape 1 : « Des vannes courtes, faciles à ressortir »

**Ce que dit le conseil en base** (fait foi) : le **faux secret**. Tu te penches, tu lâches « Ça reste entre nous : », puis un aveu d'une banalité totale, dit avec le sérieux d'un scandale. Trois règles : un seul aveu, à voix basse, sur toi ou sur un détail sans victime, et tu t'arrêtes net. Exemple : la plante en plastique du couloir. Défi : FAUX SECRET, avec repli vocal si tu es seul.

**Ce que dit le texte d'étape aujourd'hui** (« Ce que tu vas apprendre ») : « Une vanne de pause café se dit d'une traite et se comprend sans contexte. Tu apprends à en repérer, à les garder en tête et à les placer au bon moment : tu repars avec une petite réserve pour la machine à café et les réunions. » C'est l'ancien conseil (réserve de vannes). Le quiz actuel interroge sur le timing (étape 2) et la mémorisation, aucune question sur le faux secret.

**« Pourquoi cette étape ? »** : inchangé (« La pause café, c'est le seul moment de la journée où tout le monde a envie de parler d'autre chose que du boulot… ») : il reste vrai. **Titre** : inchangé (un faux secret est bien une vanne courte, facile à ressortir). **Légendes des 2 vidéos** (Paul Séré, Karim Duval) : inchangées, elles restent vraies (vannes courtes, ton machine à café).

| | « Ce que tu vas apprendre » (remplace le texte actuel) |
|---|---|
| **A** (sobre) | Une vanne de pause café qui tient dans le temps qu'un gobelet met à se remplir : le faux secret. Tu te penches, tu lâches « Ça reste entre nous : », puis un aveu d'une banalité totale, dit avec le sérieux d'un scandale. Trois règles, un exemple, un défi pour aujourd'hui, et tu repars avec une vanne prête pour la prochaine pause. |
| **B** (avec une scène) | Le faux secret est la vanne la plus facile à lâcher à la machine à café : une phrase, à voix basse, sur un détail minuscule de ta vie. Imagine Léa qui avoue, l'air grave, qu'elle n'a jamais compris le bouton « eau chaude » : tout le monde se penche, et le rire arrive sur la petitesse de l'aveu. Dans cette étape, tu trouves le tien. |

**Reco : B.** Elle montre la vanne avant de l'expliquer (« humour présent dans la copy elle-même », charte §5), répond à la peur de Sophie (« sans devenir le collègue qui force » : une phrase, pas un numéro) et ne répète pas l'exemple du conseil juste dessous (la plante). Léa est présentée comme un exemple, comme dans la description du parcours. A est le plan B si tu trouves B trop bavard. Les deux sont alignées sur le conseil, le défi et le quiz du point 2.

### 1.2 Répartie, étape 1 : « Tes premières répliques »

**Ce que dit le conseil en base** (fait foi) : **l'ironie bienveillante**. Dire le contraire de ce que tu penses, si évidemment que ça fait rire sans blesser ; tout tient au sourire et au ton (« avec de l'affection dans la voix, c'est un compliment déguisé. Sans, c'est une pique »). Exemple : le pote qui arrive avec 45 minutes de retard. Défi : IRONIE DOUCE, à la prochaine occasion.

**Ce que dit le texte d'étape aujourd'hui** (« Ce que tu vas apprendre ») : « Rebondir sur une remarque, accuser réception, reformuler avec humour : 3 réflexes pour ne plus rester muet… » C'est une autre méthode (les 3 temps de l'étape 3). Le quiz actuel demande une « répartie bienveillante » dont la bonne réponse est une exagération, pas une ironie.

**« Pourquoi cette étape ? »** : inchangé (il parle déjà de l'ironie bienveillante, du sourire et de la timidité). **Titre** : inchangé.

| | « Ce que tu vas apprendre » (remplace le texte actuel) |
|---|---|
| **A** (sobre) | Dire le contraire de ce que tu penses, si évidemment que ça fait rire sans blesser : c'est l'ironie bienveillante, et tout tient dans le sourire et le ton. Tu repars avec une phrase à sortir quand un proche est en retard, oublie quelque chose ou fait une gaffe. Si tu es timide, bonne nouvelle : tu écoutes déjà, et c'est par là que commence toute bonne réplique. |
| **B** (avec une scène) | Ton coloc laisse la vaisselle pour la troisième fois. Râler te fait passer pour le relou, te taire pour un paillasson. L'ironie bienveillante est la sortie du milieu : dire l'inverse de ce que tu penses, avec le sourire, assez évidemment pour que personne ne se vexe. Une seule phrase suffit. |

**Reco : B.** La situation est celle de Yanis (coloc), elle pose le problème en deux phrases (PAS) et elle n'emprunte pas l'exemple du conseil (le retard de 45 minutes). « Timide » est déjà dit dans « Pourquoi cette étape ? », donc B ne le répète pas. A garde la jolie phrase actuelle (« tu écoutes déjà ») si tu préfères ne rien perdre.

### 1.3 Confiance, étape 1 : « Redécouvrir ce qui te fait rire »

**Ce que dit le conseil en base** (fait foi) : **énoncer la règle non écrite**. Énoncer à voix haute une règle que tout le monde applique sans l'avoir jamais dite, comme un article de loi (le comportement exact + l'explication naïve), dans un lieu où les gens sont proches sans se parler : ascenseur, salle d'attente, transport. Le plaisir vient de la reconnaissance. Défi : RÈGLE NON ÉCRITE, à voix haute, dans un lieu public.

**Ce que dit le texte d'étape aujourd'hui** (« Ce que tu vas apprendre ») : « Regarder ton quotidien avec un œil comique, noter ce qui te fait sourire, comprendre ce qui te fait rire, toi. Ici, pas d'exercice à rater : chaque détail noté compte déjà. » C'est l'inverse du défi (parler à voix haute en public), et le quiz interroge sur un « journal d'observation » que personne n'enseigne.

**« Pourquoi cette étape ? »** : inchangé, il parle déjà des règles que tout le monde suit sans les dire (c'est le seul des trois qui tenait). Garder « aucune vanne à réussir » : une règle non écrite n'est pas une vanne. **Titre** : inchangé.

| | « Ce que tu vas apprendre » (remplace le texte actuel) |
|---|---|
| **A** (sobre) | Remarquer les règles que tout le monde suit sans jamais les dire (ne pas se parler dans l'ascenseur, fixer son téléphone en salle d'attente), puis les énoncer comme un article de loi. Pas de vanne à réussir : le plaisir vient de la reconnaissance, chacun sait que c'est vrai depuis toujours. Si la dire à voix haute te fait peur, la noter compte déjà. |
| **B** (avec une scène) | Imagine Julien dans une salle d'attente où personne ne se parle et où tout le monde fait semblant de lire un magazine froissé. Il y a là une règle que chacun suit sans que personne l'ait jamais écrite. Tu apprends à la repérer, puis à la formuler comme un article de loi : pas besoin d'être drôle, la reconnaissance fait le travail. Et si la dire tout haut te fait peur, la noter compte déjà. |

**Reco : B.** Même mécanique que les deux autres étapes, le personnage est celui de la description du parcours (Julien, présenté comme un exemple), et la dernière phrase rend à Marc la douceur que le texte actuel promettait, sans se contredire. **Condition** : la dernière phrase des deux options suppose le choix 4 (repli solo dans le défi). Si tu refuses le choix 4, on la retire.

### 1.4 Choix 4 : repli solo sur 2 exercices (retouche du conseil en base)

Audit COP-11 : le défi de Répartie 1 dépend d'une occasion qui peut ne jamais se présenter, et celui de Confiance 1 demande de parler à voix haute en public à la personne la plus fragile du site. Machine à Café 1 a déjà son repli vocal : aucune retouche.

| Étape | Défi en base aujourd'hui | Défi retouché (A) |
|---|---|---|
| Répartie 1 | « DÉFI IRONIE DOUCE : la prochaine fois qu'un proche fait un truc agaçant (retard, oubli, gaffe), réponds l'exact contraire de ce que tu penses, avec un sourire. Tout l'exercice tient dans l'affection de la voix. » | Même texte + « Pas d'occasion aujourd'hui ? Écris la phrase que tu aurais pu dire au dernier retard ou à la dernière gaffe d'un proche, et envoie-la-lui si ça te fait sourire. » |
| Confiance 1 | « DÉFI RÈGLE NON ÉCRITE : aujourd'hui, énonce à voix haute une règle non écrite d'un lieu public que tu traverses. » | « DÉFI RÈGLE NON ÉCRITE : aujourd'hui, repère une règle non écrite d'un lieu que tu traverses (ascenseur, salle d'attente, transport) et formule-la comme un article de loi. Dis-la à voix haute si l'envie vient, sinon écris-la dans tes notes ou envoie-la à un proche : elle compte autant. » |

**Reco : A (oui).** Le but du défi est de repérer et de formuler, pas de se faire remarquer en public. Le conseil lui-même ne bouge pas (titre, technique, exemple). B (non) : on garde les défis et on retire seulement la dernière phrase des textes 1.2 et 1.3.
`[À VÉRIFIER @fullstack : la retouche passe par la base (le texte du conseil en base fait foi) ET par le fichier conseils-seed.json, que le seed doit rattraper (FS-12, COP-09), sinon un rejeu du patch remet l'ancien défi.]`

### 1.5 Choix 5 : vidéos de Répartie 1 (légendes)

Les légendes actuelles décrivent d'autres techniques que l'ironie : Haroun est présenté pour le « rebond en 3 temps » (c'est l'étape 3), Lilia pour les « réponses préparées ». Le catalogue contient une vidéo qui enseigne exactement l'ironie douce : Marina Rollman, « Les relations sociales » (5 min 20, fiche n° 29 : « ne moque pas les gens, moque les situations »), aujourd'hui placée en étape 3.

| | Vidéo 1 | Vidéo 2 |
|---|---|---|
| **A** (garder les vidéos, réécrire les légendes) | Haroun : « Il a l'air d'improviser, mais chaque rebond se prépare : regarde comment il garde le sourire pendant qu'il répond. » | Lilia Benchabane : « Elle ne vise jamais la personne, seulement la maladresse de la situation : la même douceur qui sépare l'ironie bienveillante de la pique. » |
| **B** (échanger Haroun contre Rollman) | Marina Rollman : « Elle ne se moque pas des gens, elle se moque des situations : l'ironie reste douce, et la salle se sent complice plutôt que visée. » | Lilia Benchabane : même légende que A. |

**Reco : B.** C'est la seule vidéo du catalogue qui montre l'ironie douce, et Haroun (3 temps, oui-et) revient mieux en étape 3, qu'il décrit déjà. Conséquence : l'étape 3 perd Rollman et Lilia est déjà en étape 3 : l'étape 3 aura besoin d'une seconde vidéo (point de réécriture, section 5). Légendes écrites d'après les fiches du catalogue (descriptions et « learnings » de `videos-seed.json`) : `[À VÉRIFIER en visionnant les 2 vidéos avant mise en ligne]` pour la phrase de A sur Haroun, que je n'ai pas pu contrôler.

**Légendes alignées pour Confiance 1** (sans choix, elles collent déjà à la fiche catalogue, à valider avec le reste) :
- Roman Frayssinet : « Il dit tout haut ce que tout le monde a observé sans jamais le formuler, avec le sérieux d'un documentaire : le modèle de la règle non écrite. » (fiche : « technique de l'évidence cachée »).
- Pierre Croce : « Des lieux où tout le monde est passé, une voix d'annonce officielle, et tout part de là : de quoi repérer les règles non écrites des tiens. » (fiche : « situation universelle », « ton officiel détourné »).

---

## 2. Format de quiz : 1 question réécrite par parcours

[Framework : mise en situation puis explication, le quiz enseigne au lieu de contrôler] [Conscience : Product-Aware, la personne vient de lire le conseil]

**Ce que le format corrige** (COP-05) : 70 % des bonnes réponses sont la 2e option, les mauvaises réponses sont des caricatures (« Humilier l'autre plus vite »), plusieurs questions portent sur ce que l'étape n'enseigne pas, et aucune explication ne suit la réponse.

**Règles du format (à appliquer aux 54 questions après validation)**
- Une question par notion réellement enseignée dans le conseil de l'étape, sous forme de mise en situation (pas de définition à reconnaître).
- Au moins deux réponses plausibles. Chaque mauvaise réponse enfreint **une seule** règle du conseil (c'est ce qui la rend crédible, et ce que l'explication nomme).
- La bonne réponse change de position d'une question à l'autre : jamais plus de 2 sur 4 à la même place, et jamais deux questions de suite avec la bonne réponse au même rang.
- Explication affichée après la réponse, **3 phrases maximum** : la bonne réponse et pourquoi, puis ce qui cloche dans les autres. Même texte que la réponse soit bonne ou mauvaise, jamais de reproche (« Pas tout à fait » plutôt que « Faux »).
- Zéro réponse qui reprend mot pour mot l'exemple du conseil (sinon le quiz se gagne sans réfléchir). Aucune « blague » : « vanne ».
- `[À VÉRIFIER @fullstack : le score est-il conservé et montré ? Aujourd'hui l'écran dit « ce quiz ne compte pas » et le serveur n'écrit que les étapes validées. Les textes ci-dessous n'annoncent aucun score enregistré.]`

**Les 3 questions** (les réponses sont identiques dans les deux tons ; seuls l'énoncé et l'explication changent). Bonne réponse en gras. Positions : C, D, A.

### 2.1 Machine à Café 1 (faux secret) : bonne réponse en position 3

| | Réponse |
|---|---|
| A | « Ça reste entre nous : je trouve que les réunions du lundi sont trop longues. » (une plainte que tout le monde partage déjà) |
| B | « Ça reste entre nous : Kévin de la compta fait semblant de comprendre les tableaux croisés dynamiques. » (une victime) |
| **C** | **« Ça reste entre nous : je relis toujours mes mails deux fois avant de les envoyer, et je les envoie quand même avec une faute. »** |
| D | « Ça reste entre nous : j'ai failli démissionner hier, je dors mal depuis des semaines. » (un vrai secret, plus une vanne) |

- **Ton A (sobre)** : question « Tu veux tenter le faux secret à la machine à café. Laquelle de ces phrases fait le mieux le travail ? » Explication : « La C : un seul aveu, minuscule, sur toi, dit avec le sérieux d'un scandale. La A est une plainte, la B vise quelqu'un, la D est un vrai secret : ce n'est plus une vanne, c'est une confidence. »
- **Ton B (complice)** : question « Imagine Léa à la machine à café, gobelet en main, qui veut tenter le faux secret. Quelle phrase a le plus de chances de faire sourire ? » Explication : « La C. Un aveu minuscule, sur elle, dit avec la gravité d'un scandale : le suspense fait le travail. La A se plaint, la B vise Kévin, la D confie un vrai souci. Le faux secret, c'est l'inverse d'un vrai secret. »

### 2.2 Répartie 1 (ironie bienveillante) : bonne réponse en position 4

| | Réponse |
|---|---|
| A | « T'as une demi-heure de retard, c'est pas sérieux. » (un reproche direct, aucune ironie) |
| B | « Quelle surprise, un retard de ta part. Tu es vraiment incapable de te réveiller, toi. » (de l'ironie, mais sur la personne : une pique) |
| C | « Merci d'être venu, ça me fait vraiment plaisir. » (sincère, rien n'est dit à l'envers) |
| **D** | **« Pile à l'heure ! J'ai juste eu le temps de lire toute la carte. Deux fois. »** |

- **Ton A (sobre)** : question « Un pote arrive avec 30 minutes de retard au restaurant. Laquelle de ces phrases est de l'ironie bienveillante ? » Explication : « La D : tu dis le contraire de ce que tu penses (« pile à l'heure »), avec un détail léger. La A reproche, la C est sincère, la B dit aussi l'inverse mais vise la personne : c'est une pique. »
- **Ton B (complice)** : question « Imagine Tom au restaurant : son pote arrive avec 30 minutes de retard. Laquelle de ces phrases est de l'ironie bienveillante ? » Explication : « La D. Tu dis l'inverse de ce que tu penses (« pile à l'heure ») avec de la douceur, et la carte lue deux fois fait sourire sans blesser. La A reproche, la C est sincère, la B est ironique mais vise la personne : c'est une pique, pas un jeu. »

### 2.3 Confiance 1 (règle non écrite) : bonne réponse en position 1

| | Réponse |
|---|---|
| **A** | **« Règle numéro un : on s'assoit toujours le plus loin possible des autres, même quand il reste dix chaises à côté. »** |
| B | « Les gens sont vraiment froids, ça me déprime. » (un jugement) |
| C | « Il faudrait que quelqu'un lance la conversation. » (un conseil) |
| D | « Cette salle d'attente est trop chauffée. » (un constat banal, aucune règle) |

- **Ton A (sobre)** : question « Dans une salle d'attente, personne ne se parle et tout le monde fixe son téléphone. Laquelle de ces phrases énonce une règle non écrite ? » Explication : « La A : elle dit tout haut ce que tout le monde fait sans l'avoir jamais dit, comme un article de loi. La B juge, la C conseille, la D constate : aucune ne révèle de règle. »
- **Ton B (complice)** : question « Imagine Julien dans une salle d'attente où personne ne se parle. Laquelle de ces phrases dit tout haut une règle que tout le monde suit en silence ? » Explication : « La A. Elle met des mots sur ce que chacun fait sans l'avoir jamais dit, comme un article de loi : on rit de se reconnaître. La B juge, la C conseille, la D constate. »

**Reco : ton B.** Le quiz est le dernier écran que lit le visiteur avant le blocage : il doit déjà ressembler au site (« humour présent dans la copy elle-même »), et la mise en scène « Imagine Léa / Tom / Julien » reste présentée comme un exemple. Garde-fous : jamais de plaisanterie sur une mauvaise réponse, explication identique dans les deux cas. Les noms ne reviennent pas dans les 4 questions d'une même étape (au plus une scène nommée par étape). A reste la version la plus neutre si tu veux un quiz plus sobre pour Confiance seulement.

---

## 3. Textes de mécanique nouveaux

Tous respectent les décisions déjà signées : le visiteur n'a plus de « compte gratuit » (l'inscription sert à l'abonnement), le blocage s16 reste mot pour mot, « Premium » est le seul nom, aucun prix n'est écrit ici.

### 3.1 Aperçu visiteur d'une étape 2+ (choix 7)

[Framework : aperçu honnête, on montre ce qu'on vend sans le donner] [Conscience : Product-Aware] Remplace « Termine l'étape 1 pour débloquer » (impossible pour un visiteur). Complète, sans le contredire, le blocage de l'étape 1 (« Valider l'étape fait partie de Premium. » + « Voir l'offre Premium »), qui ne bouge pas. Le visiteur ouvre les étapes dans l'ordre qu'il veut.

| Élément | A (factuel) | B (invitation) | Reco |
|---|---|---|---|
| a. Badge sur la ligne de l'étape (à la place de « Lecture libre » de l'étape 1) | Fait partie de Premium | (même texte) | commun |
| b. Intro au-dessus de la liste des étapes | Ouvre chaque étape pour voir ce qu'elle contient. La première se lit en entier. | La première étape est gratuite. Pour les suivantes, tu vois ici ce qu'elles contiennent. | **B** : donne la raison de l'aperçu et applique D8 |
| c. Bas de l'aperçu, au-dessus du bouton | Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium. | Envie de lire la suite ? Le conseil, les vannes, les vidéos et le quiz de cette étape sont dans Premium. | **A** : même registre que l'étalon s15 4.1 (« fait partie de », pas de pression) |
| d. Bouton | Voir l'offre Premium | (même texte) | commun, déjà validé en s16 |

Ce que l'aperçu montre : titre, « Ce que tu vas apprendre » (le texte de l'étape), la ligne de format, rien d'autre. Jamais le conseil, le défi, les vidéos ni le quiz, ni dans la page ni dans l'API.
`[À VÉRIFIER @fullstack : « les vannes » dans c n'est vrai que si les 5 vannes de l'étape sont affichées dans l'étape payante (D4).]`

### 3.2 Fin de quiz côté visiteur (choix 8)

[Framework : récompense honnête puis orientation, un seul geste] [Conscience : Product-Aware] Le visiteur peut faire le quiz de l'étape 1 mais pas valider. Le texte actuel (« Valider l'étape fait partie de Premium. ») reste la 2e ligne ; on ajoute seulement une ligne de résultat au-dessus. Aucun score n'est annoncé comme « enregistré ».

| | Ligne de résultat | Ligne suivante (inchangée) |
|---|---|---|
| **A** (neutre) | Quiz terminé : {n} sur {total}. | Valider l'étape fait partie de Premium. |
| **B** (réagit au score) | Si {n} = {total} : « Sans faute. » Sinon : « {n} sur {total}. Les explications sont là pour ça. » | Valider l'étape fait partie de Premium. |

Replis : si {total} est inconnu, aucune ligne de résultat (le bloc existant suffit). Jamais « 0 sur 4 » seul sans la phrase : B la complète.
**Reco : B.** Deux cas seulement, pas de félicitations en cascade (rien de scolaire), et la phrase des erreurs renvoie aux explications qu'on vient d'écrire (section 2).

### 3.3 « Prochaine étape conseillée le … » (choix 9)

[Framework : rythme doux, D2] Visible par l'abonné après une validation. La date = la validation + 7 jours (règle D2). Rien n'est bloqué.

| | Texte | Quand la date est passée ou aujourd'hui |
|---|---|---|
| **A** (court) | Prochaine étape conseillée le {jeudi 15 octobre}. Tu peux y aller dès maintenant si tu veux. | La prochaine étape t'attend. |
| **B** (explicatif) | On te conseille de laisser passer une semaine pour que ça s'installe : prochaine étape le {jeudi 15 octobre}. Tu peux y aller avant, c'est toi qui décides. | Tu peux enchaîner : la prochaine étape t'attend. |

Format de date : jour de la semaine, jour, mois, en français, fuseau Europe/Paris, minuscules, sans l'année sauf si elle change. Dernière étape du parcours : aucune ligne (le bilan 3.6 prend la place). Jamais de « en retard » ni de compte à rebours.
**Reco : A.** B affirme que ça « s'installe », un argument pédagogique que le site ne mesure pas ; A dit le conseil et laisse la main.

### 3.4 « Reprendre ton parcours » (choix 10)

Accueil abonné et profil. [Framework : reprise sans friction]

| | Libellé du bouton | Ligne sous le bouton |
|---|---|---|
| **A** | Reprendre ton parcours | {Parcours Répartie}, étape {2} sur {4} : {Le rythme et les silences} |
| **B** | Reprendre là où tu t'es arrêté | {Parcours Répartie}, étape {2} sur {4} |

États : aucun parcours commencé, bouton « Commencer un parcours » ; parcours terminé, bouton « Choisir ton prochain parcours » (jamais « Reprendre » sur un parcours fini) ; plusieurs parcours en cours, celui touché le plus récemment.
**Reco : A.** « Reprendre ton parcours » est la formule des recos de l'audit (UX-03, PM-01) : 3 mots, un verbe, et la ligne dessous dit où.

### 3.5 Les 3 boutons de retour d'exercice (choix 11)

[Framework : auto-bilan à froid, sans note] Sous le défi. Sert au bilan 3.6 et à la mesure de la participation. Facultatif : on peut valider sans répondre `[À VÉRIFIER @fullstack]`. Pas de certificat, pas de score.

**Question** (commune) : « Alors, ce défi ? »

| | Bouton 1 | Bouton 2 | Bouton 3 |
|---|---|---|---|
| **A** (courts) | Pas encore essayé | Essayé, bof | Essayé, ça a marché |
| **B** (première personne) | Je le ferai plus tard | J'ai essayé, c'était moyen | J'ai essayé, ça a marché |

**Réponse affichée après le clic** (commune aux deux options) :
- Bouton 1 : « Pas de souci, le défi t'attend quand tu veux. »
- Bouton 2 : « Ça arrive, et c'est utile à savoir. Relis l'exemple et retente sur une autre situation. »
- Bouton 3 : « Bien joué. Garde cette phrase, tu viens de te fabriquer un réflexe. »

**Reco : A.** Trois boutons de 11 à 19 caractères tiennent côte à côte sur mobile. Le bouton 2 évite « raté » (le persona de Confiance entend un verdict) et les réponses ne culpabilisent jamais.

### 3.6 Bilan de fin de parcours (choix 12)

[Framework : clôture puis suite, sans certificat] [Conscience : Most-Aware] S'affiche quand le serveur confirme la fin du parcours (jamais au milieu : audit COP-08). Remplace la carte « Bravo » actuelle, dont la phrase « Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde » est du capital de marque à garder.

| Bloc | A (structuré) | B (court et drôle) |
|---|---|---|
| Titre | Parcours {Répartie} terminé | {Répartie} : bouclé. |
| Sous-titre | Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde. | Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde. |
| XP | Tu as fait les {4} étapes et gagné {475} XP, bonus de fin compris. | {475} XP, bonus de fin compris. |
| Acquis | Ce que tu sais faire maintenant : {liste des titres d'étape, un par ligne} | {liste des titres d'étape, séparés par des virgules} |
| Exercices | {a} défis essayés, dont {b} qui ont marché. | (même ligne) |
| Suite | {Suite choisie, voir ci-dessous} | {Suite choisie} |

- **Ligne « Exercices »** : affichée seulement si {a} ≥ 1 (réponses des 3 boutons de 3.5). Sinon, rien, jamais « 0 défi essayé ».
- **Suite** : le parcours suivant qu'il reste à faire, avec la phrase de raison déjà écrite dans le seed (`nextParcoursReason`). Si les trois parcours sont finis ou si le suivant est déjà fait : « Pour continuer à t'entraîner, le carnet du mois te donne de nouvelles fiches : {lien carnet}. » (pas de renvoi circulaire vers un parcours déjà terminé). N'écrire « Bientôt : un parcours Storytelling » qu'une fois la date validée (D6, rien n'est codé aujourd'hui).
- XP et nombre d'étapes : valeurs réelles lues côté serveur, jamais recopiées en dur.

**Reco : A, avec la phrase maison en sous-titre** (déjà en B). A dit ce qui a été appris et fait, c'est la « progression mesurable » de la marque, sans diplôme. B convient pour un écran mobile très serré : à garder comme version compacte.

### 3.7 Rappel hebdomadaire sur demande : interrupteur et e-mail (choix 13)

[Framework : consentement explicite puis rappel utile, D7] [Conscience : Most-Aware] Désactivé par défaut. Jour choisi par la personne. Aucun e-mail si le parcours est terminé ou si l'abonnement s'est arrêté. Un seul e-mail par semaine. `[À VALIDER @legal : avis demandé en s17 sur ce rappel sur demande]`

**Interrupteur (profil, et sous le bilan d'étape)**

| | Libellé | Aide sous le libellé | Après activation |
|---|---|---|---|
| **A** | Me rappeler mon parcours chaque semaine par e-mail | Un seul e-mail par semaine, le jour que tu choisis. Tu peux l'arrêter quand tu veux. | C'est noté : prochain rappel {lundi 12 octobre}. |
| **B** | Recevoir un petit rappel chaque semaine | Un e-mail, le jour de ton choix, rien d'autre. Tu arrêtes quand tu veux. | Rappel activé pour {le lundi}. |

Sélecteur de jour : « Jour du rappel », lundi à dimanche, aucun jour présélectionné tant que l'interrupteur est éteint. **Reco : A** (dit précisément ce qui arrive : e-mail, hebdomadaire, parcours).

**Objet de l'e-mail** (≤ 50 caractères)

| | Objet |
|---|---|
| 7.1 | Ton rappel de la semaine : {titre de l'étape} |
| **7.2** | {Prénom}, ta prochaine étape t'attend |
| 7.3 | Un défi pour cette semaine |

Sans prénom : « Ta prochaine étape t'attend ». **Reco : 7.2** (court, dit l'essentiel, ne dépend d'aucun titre qui pourrait être long). 7.1 est plus informatif mais peut dépasser la limite d'affichage mobile.

**Corps A (environ 75 mots)**

> Salut {prénom},
>
> Tu as demandé un rappel chaque semaine : le voici.
>
> Ta prochaine étape dans le parcours {Répartie} : {Le rythme et les silences}. Un conseil, un défi et un petit quiz, de quoi remplir tes {20} minutes de la semaine.
>
> {Bouton : Reprendre mon parcours}
>
> Plus envie de ce rappel ? Un clic suffit : {lien d'arrêt}. Tu peux aussi le régler depuis ton profil.
>
> L'Équipe Deviens Marrant
>
> *Tu reçois cet e-mail parce que tu as activé le rappel hebdomadaire de tes parcours.*

**Corps B (environ 55 mots, avec le défi)**

> Salut {prénom},
>
> Voici ton rappel de la semaine. Au programme : {titre de l'étape}, avec un défi à tenter, « {nom du défi} ».
>
> {Bouton : Reprendre mon parcours}
>
> Pour arrêter ces rappels : {lien d'arrêt}.
>
> L'Équipe Deviens Marrant

**Reco : corps A.** B donne envie (on lit le défi) mais exige un champ « nom du défi » propre dans les données (aujourd'hui, le nom est la première ligne du texte du défi, en majuscules) : `[À VÉRIFIER @fullstack]`. Repli prénom manquant : « Salut, ». `{15 / 20}` vient de la durée du parcours (Machine à Café 15, Répartie et Confiance 20), jamais écrite en dur. Le lien d'arrêt doit fonctionner en un clic, sans connexion `[À VÉRIFIER @fullstack]`. Ton neutre, aucun reproche (« tu n'as pas avancé »), aucune relance si la personne ne clique pas. E-mail livré en brouillon à valider avant la première vague, comme tout e-mail client.

### 3.8 Libellé de la série : jours de pratique (choix 14)

[Framework : compteur honnête, D3] La série compte les jours où l'on pratique (validation d'étape, quiz d'étape terminé), plus les connexions. On évite l'anglicisme « streak ».

| | Libellé | Aide (infobulle ou ligne sous le compteur) |
|---|---|---|
| **A** (explicite) | {n} jours de pratique d'affilée | Un jour compte quand tu valides une étape ou que tu termines un quiz d'étape. |
| **B** (compact) | Série : {n} jours | (même aide) |

Pluriel : « 1 jour de pratique d'affilée ». À zéro : « Ta série démarre à ta prochaine étape. » Jamais de message du type « tu as perdu ta série » (aucune culpabilité). **Reco : A** dans le profil et l'accueil ; B accepté dans un badge où la place manque, avec la même aide. La FAQ qui parle de la série et des XP doit décrire cette règle `[À VÉRIFIER lot C]` ; les chiffres de la FAQ (« 8 semaines », « 50 XP par semaine ») ne bougent pas sans ton GO.

### 3.9 « Première étape gratuite » pour les liens d'entrée (choix 15)

[Framework : porte d'entrée, un fait] [Conscience : Problem-Aware, la personne vient d'un article ou d'une fiche] D8 : « première étape gratuite », jamais « cours gratuit ». Vrai : la première étape de chaque parcours se lit et se teste sans abonnement ; la valider et gagner des XP fait partie de Premium. Ces libellés ne s'appliquent qu'aux liens d'entrée ; les blocs « fait partie de Premium » ne changent pas.

| Contexte | A | B |
|---|---|---|
| Lien de fin d'article (nomme le parcours) | Lire la première étape gratuite du parcours {Répartie} | Essayer le parcours {Répartie}, première étape gratuite |
| Bouton secondaire de l'accueil | Lire la première étape gratuite | Lire gratuitement l'étape 1 |
| Fiche vanne, conseil ou vidéo (phrase) | Cette technique se travaille dans le parcours {Répartie} : la première étape est gratuite. | Tu veux t'entraîner sur cette technique ? La première étape du parcours {Répartie} est gratuite. |
| Meta description d'un parcours (exemple, 1 phrase) | Parcours {Répartie} : {4} étapes pour retrouver ta répartie, la première est gratuite. | {4} étapes pour répondre du tac au tac : lis la première gratuitement. |

**Reco : A.** Même formule partout (« première étape gratuite »), donc une seule expression à retenir pour le visiteur, pour la recherche et pour les modèles de langage. Les libellés de bouton restent à 8 mots ou moins. On ne dit jamais « essai gratuit » (ce n'est pas un essai limité dans le temps) ni « cours gratuit ».
`[À VÉRIFIER @seo : la formule exacte de la meta de chaque parcours suit les 4 titres de seo.md §6 (D8), ce qui est signé par Thomas et pas ici.]`

---

## 4. Vidéo de Confiance, étape 6 (choix 16)

[Framework : substitution à promesse constante, la durée annoncée tient] [Conscience : Product-Aware]

**Le problème** (COP-04, FS-10) : l'étape 6 d'« Affirmer ton style personnel » contient Kyan Khojandi, « Pulsions (spectacle complet) », fiche n° 34 du catalogue, durée **72 min** dans le seed (`PT72M00S`), soit 77 min de vidéo avec Fary pour une promesse de 20 min/semaine. Autres étapes du parcours : 11 à 17 min de vidéo. `[À VÉRIFIER : une recherche web indique que le spectacle dure environ 1 h 30, pas 72 min ; la durée du seed n'est donc pas sûre, et je n'ai pas pu lire la vidéo.]`

Ta décision du 07/10 dit « remplacée par un passage minuté ». Je ne peux pas visionner la vidéo : aucun minutage ci-dessous n'est contrôlé, donc je propose les deux voies avec leur état exact.

| | A : vidéo courte du catalogue | B : passage minuté de « Pulsions » |
|---|---|---|
| Vidéo | **Doully, « Qu'est-ce qu'elle a ma voix ? »**, fiche n° 42, `da21Xp8hGYY`, **7 min 30**, niveau débutant, catégorie auto-dérision. Même technique que l'étape (affirmer ce qui te ressemble), absente de tous les parcours aujourd'hui. | Kyan Khojandi, « Pulsions », `u41ujNodvnM`, extrait de 6 à 8 min : début `[À VÉRIFIER : mm:ss]`, fin `[À VÉRIFIER : mm:ss]`. |
| Légende de la carte | « Sa voix, ce que les gens remarquent chez elle : elle le dit avant eux et en fait son style. Un style naît souvent de ce qu'on assume au lieu de le cacher. » (d'après la fiche : « singularité assumée », « remarque devancée », « fierté comique ») | « Un passage du spectacle, de {début} à {fin} : ses petites névroses comme matière première, pour voir ce qu'un style assumé donne en scène. » Titre de la carte : « Pulsions (extrait) », plus « spectacle complet ». |
| Total vidéo de l'étape | Fary 5 min + Doully 7 min 30 = **12 min 30**, dans la fourchette des autres étapes. | Fary 5 min + extrait 6 à 8 min = environ 11 à 13 min, **si** le minutage existe. |
| Ce que ça demande | Changer une ligne du seed et de la base (tâche idempotente, comme pour la vidéo de Machine à Café 3). Rien à vérifier côté lecteur. | Un minutage que personne n'a contrôlé, et un lecteur qui sait démarrer et s'arrêter à des secondes données `[À VÉRIFIER @fullstack]`. |
| Risque | Perdre la voix de Kyan Khojandi dans le parcours (il reste dans le catalogue vidéos et l'article correspondant). | Un abonné qui tombe au milieu d'une phrase, ou sur un moment hors sujet ; une durée de départ fausse si le spectacle fait bien 1 h 30. |

**Reco : A.** (1) C'est la seule option que je peux livrer sans minutage inventé. (2) Doully sert mieux l'étape que « Pulsions » : sa fiche enseigne à partir de ce que les autres remarquent chez toi, plus proche de « ce qui te ressemble » que des névroses. (3) 12 min 30 restent dans la fourchette de toutes les autres étapes, donc la promesse « 15 à 20 min/semaine » reste inchangée. (4) Aucun développement. Si tu tiens à Kyan Khojandi, B est prête dès que toi ou @fullstack validez deux minutages en regardant 3 minutes de vidéo. Option douce pour A : une ligne « Pour aller plus loin : le spectacle complet de Kyan Khojandi est dans le catalogue des vidéos », en lien vers la fiche n° 34 `[À VÉRIFIER @fullstack : lien interne de la fiche]`.

---

## 5. Rappel des points de réécriture (après ta validation, liste seulement)

**Principe commun** : un enseignement par étape repris dans le texte d'étape, le défi, les vannes affichées et le quiz ; le conseil affiché en base fait foi ; on corrige ce qui ment, on garde ce qui marche (« améliorer, pas amputer »). Chaque texte réécrit est écrit dans deux endroits : le seed ET la base (patch idempotent), sinon un rejeu des patchs remet l'ancien texte (FS-12).

**Les 10 étapes payantes**

| Étape | Points à réécrire |
|---|---|
| Machine à Café 2 « Sentir le bon moment » | Texte et quiz déjà alignés : rééquilibrer les positions des bonnes réponses, ajouter les explications. Vidéo « Le mariage » (Jason Brokerss) reprise en Répartie 2 : en varier une. |
| Machine à Café 3 « Raconter une anecdote… » | Le titre promet structure, détails et chute, le conseil n'enseigne que les détails précis : aligner le texte sur le conseil lu en base `[À VÉRIFIER en base : texte payant non relu]`, ou ajuster le titre. Quiz sur la chute et l'ordre (non enseignés) à refaire. Vidéo n° 1 : bon identifiant `tpIOLzv11qo` (corrigé par le lot A). |
| Répartie 2 « Le rythme et les silences » | Trois angles contradictoires : texte (silence avant la réplique, regard), conseil remplacé le 30/09 (silence entre deux chansons), quiz (silence après le rire). Choisir un seul angle sur le conseil lu en base `[À VÉRIFIER en base]`. Les vannes 82 et 85 n'existent pas (lot A). |
| Répartie 3 « Retourner les piques… » | Meilleure étape : garder. Quiz : positions et explications. Deuxième vidéo à trouver si Rollman passe en étape 1 (choix 5). |
| Répartie 4 « Improviser sur l'inattendu » | Défi « rater une vanne exprès devant un groupe » : ajouter un repli solo (écrit, vocal). Étiquette EXPERT dans un parcours « Débutant → Intermédiaire » à revoir. Quiz à 5 questions. |
| Confiance 2 « Rire de toi sans te rabaisser » | Meilleur passage pour Marc : garder, y compris le garde-fou sur la souffrance. Quiz : positions et explications. |
| Confiance 3 « L'œil de l'observateur » | Titre et description parlent d'observation, le conseil de « L'humour de trentenaire » : choisir (réaligner le texte ou le titre). Retirer « MSN, K7 et la vie avant Internet » pour un public de 34 ans : formulation qui ne date pas la personne. |
| Confiance 4 « Être à l'aise en groupe » | Étape claire : quiz à rééquilibrer. Vanne n° 180 introuvable (lot A). |
| Confiance 5 « Jouer avec les registres » | Quiz de reconnaissance trop facile (reprend l'exemple du conseil) : mises en situation à deux réponses plausibles. |
| Confiance 6 « Affirmer ton style personnel » | Vidéo (choix 16). Défi du seed (« tes 10 dernières vannes ») différent du conseil en base (les 3 messages qui ont fait rire) : aligner sur la base, avec repli. Aucune clôture : le bilan 3.6 s'y accroche. Quiz de 5 questions. |

**Tous les quiz (54 questions, 13 étapes)** : appliquer les règles de la section 2 ; une explication par question ; « blague » remplacé par « vanne » dans 9 réponses ; une question par notion enseignée ; mauvaises réponses plausibles. Cas à traiter en premier : Machine à Café 1, Répartie 1 et Confiance 1 (4 questions chacune, dont la question étalon ci-dessus) puis les trois étapes marquées « à réaligner » (Machine à Café 3, Répartie 2, Confiance 3).

**Transversal**
- Libellés de la page d'étape (COP-10) : « Pourquoi cette étape ? », « Ce que tu vas apprendre », « Exemple concret », « Exercice pratique », « Petit quiz avant de valider » sonnent fiche de cours ; « Semaine N » dans la liste du programme contre « Étape N » dans la page (charte s11 §5 : « Étape »). Nouveaux libellés à passer par étalons.
- Étiquettes de niveau (« Débutant → Expert » pour Confiance, « Débutant → Intermédiaire » pour Machine à Café dont les 3 conseils sont débutant) : à harmoniser avec les données structurées.
- Légendes des vidéos de chaque étape (Répartie 2, Confiance 3 et suivantes) : vérifier qu'elles décrivent la technique de l'étape, pas celle d'une autre.
- Tirets cadratins dans les noms des 3 balisages « Course » de `/parcours` (lot B).
- Les 5 vannes de chaque étape : vérifier qu'elles sont actives et qu'elles illustrent la technique de l'étape (sélection @copywriter, affichage lot B).
- **Intouchables** (contrôle de diff obligatoire, P0 s11) : slugs et URL, nombre d'étapes, XP des étapes, « 15 à 20 min/semaine », « 1 500+ », chiffres de la FAQ, liens internes, exemples « Imagine Léa / Tom / Julien » (présentés comme exemples), humoristes nommés, titres d'étape sauf ceux que tu valides. Mesurer le taux de changement réel avant d'annoncer « réécrit ».
- Après rédaction : relecture à voix haute, zéro tiret cadratin, zéro « blague », zéro mention d'IA, quiz relu à l'aveugle par deux relecteurs (méthode des vannes, s14) avant intégration.

---

## Handoff

**Handoff → @orchestrator (puis Thomas pour validation, ensuite @fullstack pour l'intégration)**
- Fichier produit : `/home/user/Marrant/docs/copy/etalons-parcours-apprentissage-s17.md` (aucun autre fichier modifié, aucun commit).
- Décisions prises : 16 points à choix (tableau en tête), reco B (scène, ton complice) pour les 3 étapes gratuites et les quiz, repli solo sur 2 exercices, réponses neutres et non culpabilisantes sur toute la mécanique.
- Frameworks et niveaux de conscience : notés par section (PAS court / Solution-Aware pour les étapes ; mise en situation / Product-Aware pour les quiz ; aperçu honnête, rythme doux, consentement explicite / Most-Aware pour la mécanique).
- Objections traitées : « je paie sans savoir ce que j'achète » (aperçu 3.1, fin de quiz 3.2), « le texte annonce autre chose que l'exercice » (section 1), « je me sens jugé si je rate » (réponses de 3.5, quiz sans reproche), « je vais être relancé sans fin » (3.7 : sur demande, un clic pour arrêter), « l'exercice me met en danger » (choix 4).
- À vérifier avant mise en ligne : affichage réel des 5 vannes (D4), score du quiz conservé ou non, lecteur vidéo (début/fin) si option B du choix 16, durée réelle de « Pulsions » (seed 72 min, une source web dit environ 1 h 30), champ « nom du défi » pour l'e-mail B, lien d'arrêt en un clic, avis @legal sur le rappel, légende de Haroun en choix 5 (non visionnée), textes payants des étapes 2 et suivantes (lus dans les fichiers, pas en base).
- Références marché : aucune recherche (la charte s11 et les étalons s15/s16 font foi, aucun concurrent cité) ; une recherche web sur la durée de « Pulsions », non concluante.

