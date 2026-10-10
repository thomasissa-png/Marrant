# Parcours Boulot, étapes 2 à 6 (s19, 10/10/2026)

> **Statut : texte complet, sauf les 16 vannes neuves (en cours d'écriture et de relecture à l'aveugle).** Rien n'est modifié dans `src/`, dans les seeds ni en base.
> Gabarit : `docs/copy/etalons-parcours-boulot-s19.md` (validé par Thomas le 10/10 : choix 1 à 6, 8 et 9). Même forme que l'étape 1 (§3 des étalons) : `moduleTitle`, `tipTitle`, `why`, `moduleDetail` en version B avec scène « Imagine… » (et, en dernier paragraphe, le test unique du choix 6B), exercice du jour, quiz, légendes des vidéos, 5 vannes. Modèle de structure : `docs/copy/parcours-storytelling-etapes-2-6-s18.md`.
> **Choix 7 tranché par Thomas : chute a** (« mon reflet dans l'écran »). L'exemple du PS de l'étape 2 est celui du tour 13 (Y1). La scène et le quiz de l'étape 2 ne le recopient pas.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin, aucune mention d'IA, aucun concurrent, aucune marque dans les légendes, aucun prénom de persona (Anouk, Romane, Clémence et Tristan sont des exemples, jamais présentés comme de vrais membres), « tes notes » (jamais « carnet »), jamais viser une personne.
> **Les conseils** sont ceux des étalons §1 (validés à l'aveugle pour les étapes 3 à 6) et celui du tour 13 pour l'étape 2. Chaque exercice est le défi du conseil, **recopié mot pour mot**, sans retouche.
> **Les vidéos** : aucune n'a été visionnée. Chaque légende ne dit que ce que la fiche en base établit (`docs/content/boulot-base-s19.json`, clé `videosActives`) et invite à observer, donc reste vraie quoi qu'on voie. Chaque vidéo doit être regardée une fois par une personne avant l'import (règle de sortie des étalons §6).
> **Les vannes** : « en ligne » = texte exact de la base (ou de `vannes-actives-s17.json` pour celles rangées hors BOULOT). Les vannes neuves sont numérotées de 1 à 19 sur tout le parcours : 1 à 3 pour l'étape 1 (déjà annoncées dans les étalons), 4 et 5 ci-dessous pour l'étape 2, 6 à 8 pour l'étape 3, 9 à 11 pour l'étape 4, 12 à 14 pour l'étape 5, 15 à 19 pour l'étape 6.

## Tableau d'ensemble

| Étape | `moduleTitle` | Conseil affiché | Semaine / `dayNumber` / XP / gratuit | Qui l'entend | Version sans risque |
|---|---|---|---|---|---|
| 2 | Un PS drôle, sans finir en capture d'écran | Le PS qui détend un mail sérieux | 2 / 10 / 75 / non | Un collègue, seulement si tu envoies | Le PS reste en brouillon, ou tu écris celui du dernier mail sérieux envoyé |
| 3 | Le couloir : quinze secondes | La vanne de couloir : l'art du timing entre deux réunions | 3 / 17 / 100 / non | Une personne croisée, quinze secondes | La dire seul, à voix haute, en traversant une pièce |
| 4 | L'afterwork : ta semaine en trente secondes | L'afterwork : passer de collègue à personne drôle | 4 / 24 / 100 / non | Un petit groupe, trente secondes | La raconter à un ami qui ne connaît rien à ton boulot |
| 5 | « Tu fais quoi dans la vie ? » en deux phrases | Survivre (et briller) au networking pro avec humour | 5 / 31 / 125 / non | Des gens que tu connais peu | La dire trois fois à voix haute |
| 6 | Un toast de soixante secondes, une seule vanne | Le toast de soixante secondes qui tient debout | 6 / 38 / 150 (+100 de fin inchangé) / non | Toute la salle, le jour J seulement ; pendant l'exercice, personne | Rien n'est prononcé ; pot imaginé si aucun n'est en vue |

Titres : ceux du §7 des étalons, finalisés. Deux changements assumés. Étape 2 : « Écrire drôle au boulot sans finir en capture d'écran » devient « Un PS drôle, sans finir en capture d'écran » (le titre dit ce qu'on écrit, et garde la promesse). Étape 4 : « ta semaine en anecdote » devient « ta semaine en trente secondes » (comme les titres des étapes 1, 3, 5 et 6, il annonce une limite rassurante, et le défi la tient). Les étapes 3, 5 et 6 gardent le titre du §7.
`moduleFormat` : « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » aux étapes 2, 3 et 4 ; « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. » aux étapes 5 et 6 (une seule vidéo chacune, choix 5B). Les `moduleDetail` contiennent un saut de ligne avant le test (voir les étalons §3 et le handoff).
**Progression d'exposition** (de moins en moins seul, jamais plus d'un cran à la fois) : étape 1 personne n'entend ; étape 2 un collègue, ou personne ; étape 3 une personne, quinze secondes ; étape 4 un petit groupe, trente secondes ; étape 5 des gens que tu connais peu, deux phrases ; étape 6 toute une salle, mais seulement le jour J, jamais pendant l'exercice. Chaque `moduleDetail` nomme sa version sans risque en une demi-phrase, et se termine par le même test, mot pour mot : « Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? »

---

## Étape 2 : Un PS drôle, sans finir en capture d'écran

Conseil affiché : « Le PS qui détend un mail sérieux » (ABSURDE, INTERMEDIAIRE), contenu et défi du tour 13 (Y1) mot pour mot. L'enseignement : le faux rectificatif, une phrase après la signature.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Un PS drôle, sans finir en capture d'écran |
| `tipTitle` | Le PS qui détend un mail sérieux (conseil du tour 13, choix 7a) |
| `exemple` du conseil | « Bonjour Inès, la réunion budget de jeudi est décalée à 14 h, salle B. L'ordre du jour est inchangé. Peux-tu confirmer ta présence avant mercredi ? Bien cordialement, Camille. PS : pour être précis, ce n'est pas au clavier que j'ai fait des reproches ce matin, mais à mon reflet dans l'écran. » |
| `why` | Un mail sérieux ne laisse presque aucune place à ta voix. Le PS en est une : une phrase, après la signature, qui ne change rien au fond. Ici, tu en écris un, et tu choisis si tu l'envoies ou si tu le gardes pour toi. |
| `moduleDetail` (version B, scène) | Imagine Anouk, jeudi, 16 h 40, devant un mail pour caler une réunion de lundi. Le fond est irréprochable : date, salle, ordre du jour. Elle ajoute une ligne sous sa signature : « PS : rectificatif, ce n'est pas à la photocopieuse que j'ai souhaité bon courage ce matin, mais à la plastifieuse. » Elle ne l'envoie pas tout de suite : elle la garde en brouillon, et elle compte quand même. Dans cette étape, tu écris ta propre ligne : un PS d'une seule phrase, sur une petite scène vraie de ta journée. Qu'elle parte ou qu'elle reste en brouillon, c'est toi qui décides. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 75 / non / 10 |

Note de scène : le PS d'Anouk est une scène à elle (un objet, elle, une seule correction, la version rectifiée en toute fin, rien n'arrange). Il ne reprend ni le mail, ni le mot « clavier », ni « reproches », ni la chute de l'exemple du conseil. Il ne figure pas dans le quiz.

**Exercice « aujourd'hui »** : le DÉFI PS du conseil, recopié sans retouche. Il porte déjà sa version sans risque (mail à faible enjeu, PS gardé en brouillon qui compte quand même, ou PS du dernier mail sérieux envoyé).
> DÉFI PS : aujourd'hui, écris un PS d'une phrase qui corrige une erreur que personne n'a faite : prends une petite scène vraie de ta journée, rectifie un seul détail et finis sur la version rectifiée. Il doit rester présentable si ton chef le lit. Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. Pas de mail pro à envoyer aujourd'hui ? Écris le PS que tu aurais ajouté au dernier mail sérieux que tu as envoyé. C'est gagné si ton PS tient en une phrase et que la version rectifiée en est la toute fin.

**Quiz, trois questions** (ton B complice). Positions de la bonne réponse : **C, B, D**. Aucun prénom. Aucune bonne réponse n'est citée dans la scène ni dans l'exemple du conseil.

**Question 1 (bonne réponse en C)**
> **Ton mail est prêt : il fixe l'heure d'une visite, et ton chef est en copie. Laquelle de ces lignes ajoutes-tu sous la signature ?**
> A. « PS : bon week-end à tous, et merci pour la réactivité de chacun. »
> B. « PS : si la compta valide enfin à temps, ce sera une première. »
> **C. « PS : petite correction, ce n'est pas mardi que j'ai remercié le grille-pain, mais mercredi. »**
> D. « PS : ce n'est pas du café que j'ai renversé ce matin, mais de l'eau, donc rien de grave. »
>
> **Explication** : La C. Elle corrige une erreur que personne n'a faite, sur un seul détail (le jour), et la version rectifiée arrive en toute fin sans rien arranger. La A est un PS poli, sans scène, la B vise un service, et la D rassure avec « rien de grave » : la correction arrange tout.

**Question 2 (bonne réponse en B)**
> **Trois mails t'attendent. Dans lequel tentes-tu ton premier PS ?**
> A. Les excuses à un client dont la commande est arrivée en retard.
> **B. La date d'un point d'équipe, à deux collègues que tu croises tous les jours.**
> C. Ta réponse au directeur, qui t'a demandé un bilan de ton trimestre.
> D. Le message à toute l'entreprise, envoyé au nom de ton service pour le départ de la directrice.
>
> **Explication** : La B. Un mail à faible enjeu, entre collègues que tu connais, est le terrain du premier essai : le fond reste irréprochable et un PS manqué n'y coûte presque rien. La A mêle une excuse et une plaisanterie, la C s'adresse à celui qui évalue ton travail, et la D t'expose devant toute l'entreprise.

**Question 3 (bonne réponse en D)**
> **Ta journée n'a aucun écrit professionnel au programme. Comment fais-tu l'exercice du PS ?**
> A. Tu laisses tomber : sans destinataire, le rectificatif perd son sens.
> B. Tu envoies quand même un message à un collègue, pour avoir un prétexte.
> C. Tu recopies une phrase lue ailleurs, en changeant deux mots.
> **D. Tu rédiges celui que tu aurais glissé sous ton dernier message sérieux.**
>
> **Explication** : La D. Le repli du défi est le PS que tu aurais ajouté à ton dernier message sérieux : rien à envoyer, tout à écrire. La A abandonne alors qu'un repli existe, la B force un envoi dont personne n'a besoin, et la C ne part pas d'une scène vraie de ta journée.

**Les 2 vidéos** (choix 5B ; aucune n'a été visionnée ; la fiche en base de Croce parle de « 10 vannes en 5 minutes » alors que la durée en base est de 2 min 30, `[DURÉE DE LA BASE, À LIRE]` ; Croce est déjà utilisée dans Confiance 1 avec une autre légende, doublon accepté).

| | Légende (`why`) |
|---|---|
| **Première** : Pierre Croce, « Ce qu'on rêverait d'entendre dans l'avion » (2 min 30 d'après la base) | Pierre Croce imagine les annonces qu'on rêverait d'entendre dans un avion, une liste où chaque phrase tient en une ligne. Repère où tombe le dernier mot de chaque annonce : dans un PS, tout se joue pareil, sur la fin. |
| *Facultative* : Jason Brokerss, « Snapchat » (5 min 40) | Jason Brokerss décortique les réseaux sociaux avec l'énergie de quelqu'un qui a passé trop de temps sur son téléphone, et qui le sait. Repère un détail si précis que tu t'y reconnais, puis demande-toi qui en fait les frais : dans ton PS, ce sera toi. |

**Les 5 vannes** (3 en ligne, 2 neuves). Technique de l'étape : le faux rectificatif, ou à défaut un message sérieux dont un détail dérape.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (Machine à Café 1) : « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » / « Cinq personnes m'ont demandé ce que je faisais dans la conversation. » | Le mail comme terrain : un chiffre sérieux (90 contre 1) et une chute qui retourne la normalité. |
| 2 | En ligne (Storytelling 6) : « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. » / « Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas. » | Une erreur que personne n'a corrigée, poussée jusqu'au bout avec le même sérieux. |
| 3 | En ligne (Répartie 2) : « Mon adresse mail pro d'alternant commence par « alternant2 ». » / « J'aimerais savoir ce qu'est devenu alternant1. » | Un détail de mail pris au sérieux au point de poser une question absurde. |
| 4 | `[VANNE NEUVE 4, en cours d'écriture et de relecture à l'aveugle]` | Un faux rectificatif : un message sérieux corrige une erreur que personne n'a faite. |
| 5 | `[VANNE NEUVE 5, en cours d'écriture et de relecture à l'aveugle]` | Un faux rectificatif : un seul détail rectifié, la version rectifiée en toute fin. |

---

## Étape 3 : Le couloir : quinze secondes

Conseil affiché : « La vanne de couloir : l'art du timing entre deux réunions » (OBSERVATION, DEBUTANT), validé à l'aveugle, texte des étalons §1. L'enseignement : un irritant que tout le monde subit, dit en dix mots maximum, une seule fois, sans s'arrêter.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Le couloir : quinze secondes |
| `tipTitle` | La vanne de couloir : l'art du timing entre deux réunions |
| `why` | Un couloir te laisse quinze secondes, pas une de plus, et personne ne s'y arrête. C'est la meilleure première vanne à voix haute : si elle ne prend pas, tu es déjà trois pas plus loin. Ici, tu en dis une, en marchant. |
| `moduleDetail` (version B, scène) | Imagine Romane, mardi, 12 h 52, au troisième étage. Quelqu'un attend l'ascenseur, les yeux sur les numéros. Romane passe à sa hauteur sans ralentir : « Quatre étages. Il s'arrête à tous, par politesse. » Elle est déjà dans l'escalier, que l'autre sourie ou non. La cible, c'est l'ascenseur, et n'importe qui dans l'immeuble pourrait l'entendre. Dans cette étape, tu fais pareil : un irritant que tout le monde subit, dix mots au plus, dit une seule fois, en marchant. Pas de couloir aujourd'hui, ou pas envie de tenter devant quelqu'un ? Tu peux dire ta phrase seul, à voix haute, en traversant une pièce. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 100 / non / 17 |

Note de scène : la phrase de Romane compte huit mots (limite : dix), vise un objet, n'attend aucune réponse. L'ascenseur n'est ni dans le quiz, ni dans les vannes de l'étape.

**Exercice « aujourd'hui »** : le DÉFI CROISEMENT du conseil, recopié sans retouche. Le repli solo y est déjà.
> DÉFI CROISEMENT : aujourd'hui, choisis un irritant que tout le monde subit (l'imprimante, la clim, le café, l'ascenseur) et écris sa phrase en dix mots maximum. Dis-la une seule fois, au moment où tu croises quelqu'un, sans t'arrêter ni te retourner. C'est réussi si tu l'as dite en marchant et sans attendre de réponse, qu'elle ait fait rire ou non. Pas de couloir aujourd'hui (télétravail, jour off), ou pas envie de tenter devant n'importe qui ? Joue le croisement seul : lève-toi, dis ta phrase à voix haute en traversant une pièce ou en montant l'escalier, puis fais encore cinq pas avant de t'arrêter. C'est réussi si tu l'as dite d'un seul trait, en marchant, et si tu as fait ces cinq pas sans te retourner.

**Quiz, trois questions** (ton B complice). Positions : **C, A, B**. Aucun prénom. Aucune bonne réponse n'est citée dans la scène (ascenseur, étages, politesse) ni dans l'exemple du conseil (imprimante).

**Question 1 (bonne réponse en C)**
> **Laquelle de ces phrases peut se dire en passant dans le couloir ?**
> A. « Le chef a encore changé l'ordre du jour, comme d'habitude. »
> B. « Le distributeur a avalé ma monnaie, puis il m'a regardé comme si c'était ma faute. »
> **C. « Cette porte ferme avec la discrétion d'une fanfare. »**
> D. « Toi aussi, tu trouves ce café tiède ? »
>
> **Explication** : La C. Elle vise un objet que tout le monde subit, tient en moins de dix mots et n'attend aucune réponse. La A vise une personne, la B dépasse largement les dix mots, et la D pose une question : celui que tu croises doit s'arrêter pour répondre.

**Question 2 (bonne réponse en A)**
> **Tu viens de sortir ta phrase en croisant quelqu'un, qui n'a pas réagi. Qu'en retiens-tu ?**
> **A. C'est réussi : tu l'as lâchée sans t'arrêter, le reste ne compte pas.**
> B. Tu te retournes pour voir si ça l'a fait sourire.
> C. Tu la répètes plus fort, au cas où le début aurait échappé à l'autre.
> D. Tu reviens sur tes pas pour lui demander ce qu'il en a pensé.
>
> **Explication** : La A. Le défi se joue sur le geste, pas sur la réaction : la dire en marchant suffit. La B guette la réaction, la C répète, et la D demande un avis : trois façons de transformer quinze secondes en conversation.

**Question 3 (bonne réponse en B)**
> **Tu hésites entre quatre sujets pour ta phrase de couloir. Lequel est le plus sûr ?**
> A. Le dernier mail du directeur, que personne n'a compris.
> **B. Le thermostat de l'étage, qui change d'avis à chaque passage.**
> C. Ton salaire, que tu aimerais enfin comparer à celui des autres.
> D. La nouvelle recrue, qui ne sait pas encore où se trouve la cafétéria.
>
> **Explication** : La B. Un objet que tout le monde subit se dit devant n'importe qui, sans qu'aucun absent ait à se défendre. La A vise un responsable, la C ouvre un sujet qui ne passerait pas devant tout le service, et la D met une personne en position de victime.

**Les 2 vidéos** (choix 5B, étape 3 gardée comme dans la spec ; aucune n'a été visionnée ; Kev Adams dure 5 min 20, entière avec le choix 8a).

| | Légende (`why`) |
|---|---|
| **Première** : Guillermo Guiz, « Les cabillauds, ces arrogants ! » (4 min 30) | Une chronique absurde sur les cabillauds, dite avec un humour pince-sans-rire et une logique impeccable. Repère à quel moment le ton reste sérieux alors que le sujet, lui, ne l'est plus : c'est celui d'une vanne de couloir, dite sans appuyer. |
| *Facultative* : Kev Adams, « Du côté de chez vous » (5 min 20) | Kev Adams décrit les codes de son quartier avec précision et bienveillance, sans caricature. Repère un détail que tout le monde reconnaît sans qu'il ait besoin de l'expliquer : c'est ce qui fait un bon irritant partagé. |

**Les 5 vannes** (2 en ligne, 3 neuves). Technique de l'étape : un irritant partagé, dit en dix mots maximum, sans s'arrêter.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (Machine à Café 3) : « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » / « Il cherche quelqu'un de plus reposé. » | Un objet que tout le monde subit se met à avoir un avis sur toi, et la chute est courte. |
| 2 | En ligne (Confiance 1) : « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. » / « Il te fait asseoir et baisse la voix. » | Un rituel partagé, pris au sérieux. Réserve : classée « acceptable » dans les étalons (la chute est la réaction d'un collègue, la cible reste le rituel). |
| 3 | `[VANNE NEUVE 6, en cours d'écriture et de relecture à l'aveugle]` | Un irritant partagé en dix mots maximum. |
| 4 | `[VANNE NEUVE 7, en cours d'écriture et de relecture à l'aveugle]` | Un irritant partagé en dix mots maximum. |
| 5 | `[VANNE NEUVE 8, en cours d'écriture et de relecture à l'aveugle]` | Un irritant partagé en dix mots maximum. |

---

## Étape 4 : L'afterwork : ta semaine en trente secondes

Conseil affiché : « L'afterwork : passer de collègue à personne drôle » (STORYTELLING, DEBUTANT), validé à l'aveugle, texte des étalons §1. L'enseignement : raconter un moment de ta semaine en trois temps (décor, escalade, chute), toi dedans, jamais un absent.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | L'afterwork : ta semaine en trente secondes |
| `tipTitle` | L'afterwork : passer de collègue à personne drôle |
| `why` | À l'afterwork, personne ne veut le compte rendu de ta semaine : tout le monde veut une histoire courte. Les bonnes se racontent en trois temps, et le héros est celui qui raconte. Ici, tu en prépares une, de trente secondes au plus. |
| `moduleDetail` (version B, scène) | Imagine Clémence, vendredi, 18 h 30, un verre à la main, au milieu de trois collègues qui racontent leur semaine. Quand vient son tour, elle ne résume rien. Elle dit : « Ce matin, mon ordinateur m'a demandé de changer de mot de passe. Le premier était trop court, le deuxième trop proche de l'ancien. Au troisième, j'avais mis un chiffre, une majuscule et une larme. Il a été accepté. Je ne sais plus lequel. » Puis elle boit une gorgée. Le tout a duré moins de trente secondes, et la seule victime est un ordinateur. Dans cette étape, tu prépares ton histoire de la même façon, avec un petit moment de ta semaine qui t'a mis en difficulté. Pas d'afterwork à venir ? Raconte-la d'abord à un ami qui ne connaît rien à ton boulot. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 100 / non / 24 |

Note de scène : l'histoire de Clémence compte 43 mots (comptés un à un, « l'ancien » et « j'avais » pour un mot chacun), soit moins de trente secondes à voix haute. Elle n'a aucun sigle, aucune personne, ne reprend ni le frigo ni le déjeuner de l'exemple du conseil, ni les bonnes réponses du quiz.

**Exercice « aujourd'hui »** : le DÉFI TRENTE SECONDES du conseil, recopié sans retouche. Le repli solo (un ami hors boulot) y est déjà.
> DÉFI TRENTE SECONDES : choisis un petit moment de ta semaine de travail où c'est toi qui as été dépassé (un objet, une procédure, une machine, jamais un collègue précis). Écris-le en trois temps : un décor en une phrase sans sigle, une escalade, une chute. Dis-le à voix haute en chronométrant. C'est réussi s'il tient en 30 secondes ou moins, sans un seul sigle, et si tu t'arrêtes net après la chute. Pas d'afterwork à venir ? Raconte-le à un ami qui ne connaît rien à ton boulot : s'il le comprend sans poser de question, c'est gagné.

**Quiz, trois questions** (ton B complice). Positions : **D, C, A**. Aucun prénom.

**Question 1 (bonne réponse en D)**
> **Quelle est la meilleure première phrase pour ton histoire d'afterwork ?**
> A. « Vendredi dernier, juste après le point hebdo avec la DSI, le CRM a planté. »
> B. « Alors, vous allez rire, ce qui m'est arrivé cette semaine est incroyable. »
> C. « Il faut d'abord que je vous explique comment fonctionne notre process de validation. »
> **D. « Mercredi, j'ai passé une heure entière à chercher une salle qui n'existait pas. »**
>
> **Explication** : La D. Une phrase simple, avec un jour et un lieu que n'importe qui comprend, et c'est toi qui es dedans. La A empile des sigles, la B promet le rire avant de l'avoir gagné, et la C commence par une explication.

**Question 2 (bonne réponse en C)**
> **Ton histoire vient de monter d'un cran à chaque phrase. Comment la termines-tu ?**
> A. Tu expliques le mécanisme pour qu'on comprenne.
> B. Tu conclus par une leçon sur l'importance de la patience.
> **C. Tu t'arrêtes net sur la chute, sans rien ajouter derrière.**
> D. Tu demandes aux autres s'ils ont déjà vécu la même chose.
>
> **Explication** : La C. La chute est la dernière phrase, et rien ne vient après : c'est ce qui laisse le rire arriver. La A explique le mécanisme, la B le transforme en morale, et la D rend la parole avant d'avoir conclu.

**Question 3 (bonne réponse en A)**
> **Ton meilleur souvenir de la semaine met en scène un collègue précis, que tout le monde connaît. Que fais-tu ?**
> **A. Tu en prends un autre, où c'est un objet qui te dépasse.**
> B. Tu le racontes en changeant son prénom, comme ça il reste anonyme pour tous.
> C. Tu le racontes, mais avec beaucoup de tendresse dans la voix.
> D. Tu le racontes seulement s'il n'est pas là ce soir-là.
>
> **Explication** : La A. Dans ton histoire, c'est toi qui es dedans : un objet qui te dépasse ne se vexe pas. La B garde la même personne, reconnaissable malgré le prénom changé, la C adoucit la voix mais pas la cible, et la D attend l'absence de l'intéressé pour parler de lui.

**Les 2 vidéos** (choix 5B ; aucune n'a été visionnée ; Foresti dure 6 min, entière avec le choix 8a).

| | Légende (`why`) |
|---|---|
| **Première** : Guillermo Guiz, « Pas de sentiments au fast-food » (4 min 30) | Guillermo Guiz fait d'un fast-food un sujet de réflexion presque existentielle, avec un regard surréaliste. Repère ce qu'il fait d'un endroit où il ne se passe presque rien : c'est la matière d'une anecdote de ta semaine. |
| *Facultative* : Florence Foresti, « Le styliste (Boys Boys Boys) » (6 min) | Florence Foresti incarne un styliste et en décortique les codes. Repère ce qu'elle pose dès le début pour que tu comprennes la scène, même si tu ne connais rien à la mode. |

**Les 5 vannes** (2 en ligne, 3 neuves). Technique de l'étape : un moment absurde en trois temps, la chute étant la phrase la plus courte.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (aucun parcours) : « J'ai passé mon stage à ranger les archives par ordre alphabétique. » / « Depuis, plus personne ne retrouve rien. Ils avaient un système. » | Un décor d'une phrase, un effet qui monte, une chute courte : le héros raté, c'est celui qui a rangé. |
| 2 | En ligne (Machine à Café 3) : « Pour mon entretien, j'ai emprunté le costume de mon père. Son nom est cousu sur la manche. Le recruteur m'a appelé Robert toute l'heure. » / « Robert commence en septembre. » | Trois temps (le costume, le nom, le prénom qui s'installe) et une chute de quatre mots. |
| 3 | `[VANNE NEUVE 9, en cours d'écriture et de relecture à l'aveugle]` | Un moment absurde de la semaine en trois temps. |
| 4 | `[VANNE NEUVE 10, en cours d'écriture et de relecture à l'aveugle]` | Un moment absurde de la semaine en trois temps. |
| 5 | `[VANNE NEUVE 11, en cours d'écriture et de relecture à l'aveugle]` | Un moment absurde de la semaine en trois temps. |

---

## Étape 5 : « Tu fais quoi dans la vie ? » en deux phrases

Conseil affiché : « Survivre (et briller) au networking pro avec humour » (AUTODERISION, INTERMEDIAIRE), validé à l'aveugle, texte des étalons §1. L'enseignement : remplacer le pitch récité par deux phrases honnêtes (un verbe concret, puis ce que la fiche de poste ne dit pas), avec l'autodérision sur soi, jamais sur son métier ni sur son employeur.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | « Tu fais quoi dans la vie ? » en deux phrases |
| `tipTitle` | Survivre (et briller) au networking pro avec humour |
| `why` | « Et toi, tu fais quoi ? » revient à chaque pot, et la réponse récitée ne retient personne. Deux phrases honnêtes, dont une que la fiche de poste ne dit pas, donnent à l'autre quelque chose à relancer. Ici, tu écris la tienne. |
| `moduleDetail` (version B, scène) | Imagine Tristan, jeudi, 19 h 10, à un pot de bienvenue, une assiette de chips à la main. Un inconnu lui demande ce qu'il fait dans la vie. Tristan ne récite pas son titre. Il répond : « Je rédige des notices de montage. Je passe un samedi sur deux chez des inconnus, en tout petits caractères. » L'autre pose une question sur les notices, et la conversation part de là. Dans cette étape, tu écris ta propre réponse en deux phrases : un verbe concret, puis le détail que la fiche de poste ne dit pas. La moquerie tombe sur toi, jamais sur ton métier ni sur ton employeur. Tu peux d'abord la répéter trois fois à voix haute, seul. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 125 / non / 31 |

Note de scène : la réponse de Tristan compte 19 mots (6 + 13, « en tout petits caractères » pour quatre mots), sous la limite de vingt-cinq du défi. Son verbe est concret (« rédige »), le second détail place son métier dans la vie des autres, et l'ironie tombe sur lui. Ni la planification de l'exemple du conseil, ni le comptable du quiz.

**Exercice « aujourd'hui »** : le DÉFI DEUX PHRASES du conseil, recopié sans retouche. Le repli solo (trois fois à voix haute) y est déjà.
> DÉFI DEUX PHRASES : écris ta réponse à « tu fais quoi dans la vie ? » en deux phrases et vingt-cinq mots au maximum : un verbe concret d'abord, le détail que la fiche de poste ne dit pas ensuite. Donne-la à la première personne qui te pose la question aujourd'hui. C'est réussi si ta réponse tient en deux phrases et si on te pose une question dessus au lieu de changer de sujet. Personne ne te le demande aujourd'hui ? Dis-la trois fois à voix haute : c'est réussi quand tu la dis la troisième fois sans regarder ta feuille.

**Quiz, trois questions** (ton B complice). Positions : **B, C, A**. Aucun prénom.

**Question 1 (bonne réponse en B)**
> **Tu es comptable dans une petite entreprise. Quelle première phrase décrit vraiment ton travail ?**
> A. « Je gère la bonne marche de l'ensemble de la chaîne financière. »
> **B. « J'envoie les factures du mois et je vérifie qu'elles arrivent. »**
> C. « Je pilote l'optimisation des flux de facturation. »
> D. « Je fais des chiffres, enfin voilà, c'est un peu compliqué à expliquer. »
>
> **Explication** : La B. Deux verbes concrets, et n'importe qui voit ton travail. La A et la C se cachent derrière un titre de poste, et la D traîne un « enfin voilà » qui efface ta réponse.

**Question 2 (bonne réponse en C)**
> **Ta première phrase est : « Je plante des arbres dans un parc. » Laquelle de ces secondes phrases colle au conseil ?**
> A. « La mairie me paie pour regarder pousser, avec patience, ce que d'autres ont mal choisi. »
> B. « Honnêtement, ce métier n'a aucun intérêt, je le fais pour le salaire. »
> **C. « Dans quarante ans, des inconnus pique-niqueront à l'ombre de mon travail, sans me remercier. »**
> D. « Mais assez parlé de moi : et vous, qu'est-ce que vous faites ? »
>
> **Explication** : La C. Elle donne la place de ton métier dans la vie des autres, et l'ironie reste sur toi (« sans me remercier »). La A fait payer l'employeur, la B méprise ton métier, et la D change de sujet avant qu'on t'ait posé une question.

**Question 3 (bonne réponse en A)**
> **Tu as dit tes deux phrases. Que fais-tu après la dernière ?**
> **A. Tu te tais et tu laisses l'autre réagir.**
> B. Tu ajoutes « enfin voilà » pour détendre l'ambiance.
> C. Tu expliques ce que tu avais derrière la tête.
> D. Tu enchaînes sur le détail de ton plus gros dossier.
>
> **Explication** : La A. La chute n'a pas besoin de renfort : tu t'arrêtes, et c'est l'autre qui fait le travail. Le « enfin voilà » de la B l'efface, la C explique la vanne, et la D enchaîne sur autre chose avant qu'on ait réagi.

**La vidéo** (choix 5B : Delmoitiez seule, Haroun sort, écart à la spec assumé par Thomas ; aucune vidéo visionnée ; durée de la base 6 min `[DURÉE DE LA BASE, À LIRE]`, entière avec le choix 8a ; jamais utilisée dans un autre parcours).

| | Légende (`why`) |
|---|---|
| **Première (unique)** : Lisa Delmoitiez, « J'ai pas confiance en moi et j'ai raison » (6 min) | Lisa Delmoitiez transforme son manque de confiance en spectacle, et son titre le dit déjà : assumer ses faiblesses avec humour. Repère sur qui tombe chaque rire : sur elle, ou sur autre chose ? C'est la question à te poser avant de dire ta réponse. |

**Les 5 vannes** (2 en ligne, 3 neuves). Technique de l'étape : un métier ou une situation décrit honnêtement en deux phrases, sans mépriser ni le poste ni l'employeur.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (aucun parcours) : « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » / « J'avais rien préparé pour ça. J'ai dit « plus ou moins ». Il a noté. » | Un aveu sur soi, dit avec sérieux : l'autodérision tombe sur celui qui parle. |
| 2 | En ligne (Confiance 2) : « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. » | Un détail de soi que la fiche de poste ne dit pas, et l'autodérision sur ce qu'on te prête. `[À VÉRIFIER @fullstack : toujours en ligne au 10/10]` |
| 3 | `[VANNE NEUVE 12, en cours d'écriture et de relecture à l'aveugle]` | Un métier décrit honnêtement en deux phrases. |
| 4 | `[VANNE NEUVE 13, en cours d'écriture et de relecture à l'aveugle]` | Un métier décrit honnêtement en deux phrases. |
| 5 | `[VANNE NEUVE 14, en cours d'écriture et de relecture à l'aveugle]` | Un métier décrit honnêtement en deux phrases. |

---

## Étape 6 : Un toast de soixante secondes, une seule vanne

Conseil affiché : « Le toast de soixante secondes qui tient debout » (STORYTELLING, INTERMEDIAIRE), conseil neuf validé à l'aveugle (tour 6), texte des étalons §1. L'enseignement : trois blocs (un souvenir précis, une seule vanne en rappel, une phrase de fermeture), la cible étant toi ou le détail, jamais la personne honorée.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Un toast de soixante secondes, une seule vanne |
| `tipTitle` | Le toast de soixante secondes qui tient debout |
| `why` | Quand quelqu'un prend la parole à un pot, la salle redoute un seul moment : celui où ça traîne. Soixante secondes bien rangées l'évitent, et rien ne t'oblige à les prononcer avant le jour J. Ici, tu écris le tien, sans rien dire à personne. |
| `moduleDetail` (version B, scène) | Imagine Anouk, mardi soir, chez elle, une feuille et un stylo. Vendredi, c'est le pot de départ d'un collègue qui l'a dépannée à son arrivée. Rien à prononcer ce soir : elle écrit. D'abord un souvenir daté, son troisième jour, la pluie, le parapluie qu'il lui a prêté avec un « garde-le le temps qu'il faut ». Ensuite une seule vanne, qui reprend ce « le temps qu'il faut » et le retourne contre elle. Enfin une phrase pour lever le verre. Son toast reste sur sa feuille jusqu'à vendredi. Dans cette étape, tu écris le tien de la même façon, pour un vrai pot ou pour un pot imaginé. Rien ne se prononce avant le jour J, et ta vanne reste sur ta feuille jusque-là. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 150 (+100 de fin inchangé) / non / 38 |

Note de scène : la vanne d'Anouk n'est pas écrite (la scène montre le mécanisme, pas la phrase), pour ne créer aucun texte de vanne hors relecture. Le souvenir ne reprend ni Claire, ni la machine à café, ni « demain à tête reposée » de l'exemple du conseil. Aucune bonne réponse du quiz n'y figure.

**Exercice « aujourd'hui »** : le DÉFI SOIXANTE SECONDES du conseil, recopié sans retouche. Il porte déjà sa version sans risque (pot imaginé, rien à prononcer, le toast reste sur ta feuille).
> DÉFI SOIXANTE SECONDES : écris un toast en trois blocs : un souvenir précis, une seule vanne en rappel, une phrase de fermeture. Pas besoin d'être sur place : imagine-toi au pot et note deux choses qui seraient vraies pour toi ce soir-là (ce que tu ressentirais, ce que tu aurais préparé, ce que tout le monde ferait en attendant que tu parles). Transforme chacune en rappel, c'est l'étape qui fait d'un fait une vanne : pars d'un détail de ton souvenir (une phrase, un objet, un geste), un différent pour chaque, puis écris deux phrases. La première dit ce qui t'arrive, la seconde fait revenir le détail contre toi, de préférence sur le dernier mot. Garde la meilleure pour ton toast et l'autre en vanne de rechange : le jour J, si l'ambiance n'est pas celle que tu imaginais, tu changes de vanne sans toucher au reste. Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. Pas besoin de chrono : compte tes mots. C'est réussi s'il fait entre 100 et 125 mots (c'est ta minute), si la vanne arrive après le souvenir, si elle reprend un détail de ce souvenir et se retourne contre toi (ou contre ce détail, jamais contre la personne qui l'a dit ou donné), sans viser la personne honorée, l'organisation, le buffet ni un responsable, et si tu as noté une vanne de rechange à côté. Rien à prononcer : le toast reste sur ta feuille jusqu'au jour J.

**Quiz, quatre questions** (ton B complice). Positions : **D, B, C, A**. Aucun prénom.

**Question 1 (bonne réponse en D)**
> **Un ami te conseille d'ouvrir ton toast par ta meilleure trouvaille, pour détendre la salle. Que lui réponds-tu ?**
> A. « Bonne idée : un public qui rit écoute mieux la suite. »
> B. « Oui, mais avec deux vannes d'affilée, pour être bien sûr que ça prenne tout de suite. »
> C. « Non : au pot, l'humour est interdit, il faut rester dans l'émotion. »
> **D. « Non : un rappel n'existe qu'après ce qu'il rappelle, donc le souvenir passe en premier. »**
>
> **Explication** : La D. Un rappel n'existe qu'après ce qu'il rappelle, et la salle rit d'abord de reconnaître le détail. La A ouvre par l'humour, la B en empile deux, et la C interdit toute vanne alors qu'une seule, bien placée, suffit.

**Question 2 (bonne réponse en B)**
> **Ton souvenir parle d'un gâteau que ta collègue apporte à chaque pot. Quelle vanne en rappel peux-tu en tirer ?**
> A. Une où tu moques sa cuisine, c'est affectueux.
> **B. Une où tu avoues avoir goûté ta part avant le début du discours.**
> C. Une où tu fais allusion à ceux qui n'en prennent jamais, au fond de la salle.
> D. Une où tu critiques le buffet, qui n'en avait pas.
>
> **Explication** : La B. Le détail revient, et c'est toi qui en fais les frais : tu es le gourmand du discours. La A moque sa cuisine, la C vise ceux qui ne se servent pas, et la D s'en prend au buffet : seuls toi ou le détail peuvent encaisser.

**Question 3 (bonne réponse en C)**
> **Le jour du pot, la salle est bruyante et fatiguée, loin de ce que tu avais prévu. Que fais-tu de ta vanne ?**
> A. Tu la dis plus fort, pour passer au-dessus des conversations.
> B. Tu la gardes telle quelle : le texte est écrit, point.
> **C. Tu sors celle de rechange, et le reste du texte ne bouge pas.**
> D. Tu en ajoutes deux ou trois autres, en espérant que l'une des trois prenne.
>
> **Explication** : La C. La vanne de rechange est là pour ça : tu changes de vanne sans toucher au reste du texte. La A force une vanne qui ne prend pas, la B s'accroche à un texte qui ne convient plus, et la D en ajoute, alors qu'une seule suffit.

**Question 4 (bonne réponse en A)**
> **Tu cherches ton premier bloc, le moment sincère. Lequel gardes-tu ?**
> **A. « Mon deuxième jeudi, elle a relu mon rapport à sept heures du soir. »**
> B. « Elle est géniale, toujours disponible, et on ne l'oubliera jamais. »
> C. « Elle a toujours su mettre l'ambiance, comme tout le monde le sait. »
> D. « Son départ laisse un grand vide dans toute l'équipe, et je tenais à le dire. »
>
> **Explication** : La A. Un souvenir daté et précis (le jeudi, l'heure, le geste) sonne vrai, et il fournira son détail au rappel. La B, la C et la D sont des compliments de carte de vœux : on les entend, mais on ne les voit pas.

**La vidéo** (choix 5B : Hamzawi, adéquation moyenne à faible, la moins éloignée du catalogue ; aucune vidéo visionnée ; durée de la base 4 min `[DURÉE DE LA BASE, À LIRE]` ; existe et s'intègre, vérifié par oEmbed le 10/10 ; déjà utilisée dans Storytelling 3 avec une autre légende, doublon accepté). Si elle ne tient pas au visionnage, l'étape reste sans vidéo (le bloc disparaît seul).

| | Légende (`why`) |
|---|---|
| **Première (unique)** : Nora Hamzawi, « Les chagrins d'amour » (4 min, chronique de radio) | Nora Hamzawi dissèque les chagrins d'amour dans une chronique de radio, avec une autodérision qui porte sur elle. Une chronique est d'ordinaire écrite d'avance puis lue à voix haute, comme ton toast. Repère qui fait les frais de chaque rire : dans ton toast, ce sera toi ou un détail, jamais la personne honorée. Si le sujet te touche de trop près en ce moment, passe : la vidéo est facultative. |

**Les 5 vannes** (5 neuves : la vanne du mug de Machine à Café 3 est sortie de l'étape, voir étalons §5). Technique de l'étape : un rappel. Une première phrase installe un détail, la chute le fait revenir contre soi, de préférence sur le dernier mot. Jamais la personne honorée, l'organisation, le buffet ni un responsable.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | `[VANNE NEUVE 15, en cours d'écriture et de relecture à l'aveugle]` | Un rappel contre soi. |
| 2 | `[VANNE NEUVE 16, en cours d'écriture et de relecture à l'aveugle]` | Un rappel contre soi. |
| 3 | `[VANNE NEUVE 17, en cours d'écriture et de relecture à l'aveugle]` | Un rappel contre soi. |
| 4 | `[VANNE NEUVE 18, en cours d'écriture et de relecture à l'aveugle]` | Un rappel contre soi. |
| 5 | `[VANNE NEUVE 19, en cours d'écriture et de relecture à l'aveugle]` | Un rappel contre soi. |

---

## Positions des bonnes réponses (parcours entier : 19 questions)

| Étape | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| 1 (étalons) | B | D | A | |
| 2 | C | B | D | |
| 3 | C | A | B | |
| 4 | D | C | A | |
| 5 | B | C | A | |
| 6 | D | B | C | A |

| Position | Nombre | Part du parcours |
|---|---|---|
| A | 5 | 26 % |
| B | 5 | 26 % |
| C | 5 | 26 % |
| D | 4 | 21 % |

Plafond de 40 % respecté (max 26 %, soit 5 sur 19). Jamais deux bonnes réponses de suite au même rang, y compris d'une étape à l'autre (la suite complète est B, D, A | C, B, D | C, A, B | D, C, A | B, C, A | D, B, C, A). Dans chacune des 15 questions écrites ici, la bonne réponse n'est ni la plus longue ni la plus courte des quatre (comptée en mots à la rédaction) ; aucune bonne réponse ne reprend un mot plein de sa question.

## Vannes : décompte

Étapes 2 à 6 : 5 vannes chacune, soit 25 places. En ligne : 3 (étape 2) + 2 (étape 3) + 2 (étape 4) + 2 (étape 5) + 0 (étape 6) = **9**. Neuves : 2 + 3 + 3 + 3 + 5 = **16** (numérotées 4 à 19). Avec l'étape 1 (2 en ligne, 3 neuves numérotées 1 à 3), on retrouve les 11 vannes en ligne et les 19 neuves du choix 4A.
Aucune vanne neuve n'est écrite ici : chacune sera écrite sur la technique de son étape, puis relue à l'aveugle par deux relecteurs avant l'import (règle d'or). Les 9 vannes en ligne sont reprises mot pour mot de la base ou de `vannes-actives-s17.json`.

## Handoff

**Handoff → @orchestrator** (puis @reviewer pour la relecture à l'aveugle des 16 vannes neuves, @fullstack pour l'import)

- **Fichier produit** : `/home/user/Marrant/docs/copy/parcours-boulot-etapes-2-6-s19.md`. Aucun autre fichier modifié, rien en base, aucun commit.
- **Décisions prises** : registre « pote drôle et bienveillant » ; version B avec scène pour chaque étape (Anouk aux étapes 2 et 6 pour tenir le fil rouge de la fiche, Romane, Clémence et Tristan ailleurs, aucun prénom de persona ni d'humoriste des vidéos) ; exercices = défis des conseils recopiés mot pour mot (étapes 3 à 6 : étalons §1 ; étape 2 : tour 13, Y1) ; test unique du choix 6B en dernier paragraphe, identique aux étapes 2 à 6 ; version sans risque nommée en une demi-phrase dans chaque `moduleDetail` ; bonnes réponses C/B/D, C/A/B, D/C/A, B/C/A, D/B/C/A ; titres des étapes 2 et 4 reformulés (voir le tableau d'ensemble) ; scène de l'étape 6 sans vanne écrite ; étape 2 écrite sur le choix 7a (exemple du tour 13 en l'état, scène et quiz indépendants de lui).
- **Frameworks et niveau de conscience** : textes d'étape = PAS court avec scène, Product-Aware ; quiz = mise en situation puis explication, Product-Aware.
- **Points d'attention** : objections traitées (« je vais me griller » : test unique, qui l'entend et version sans risque à chaque étape, étape 6 sans rien prononcer ; « je n'ai pas de couloir, d'afterwork, de pot » : replis des défis ; « je ne suis pas drôle » : une phrase, trente secondes, deux phrases, soixante secondes, chaque marche est petite ; « je n'ai personne à qui le dire » : à voix haute seul, à un ami hors boulot, sur ta feuille). Références : étalons s19, modèle Storytelling s18, spec s17 §1 et §3.2, base du 10/10 (fiches vidéo), `vannes-actives-s17.json`.
- **À vérifier avant import** : (1) chaque vidéo regardée une fois par une personne (aucune n'a été visionnée ; durées de la base à relever, en particulier Croce « avion », Hamzawi et Delmoitiez) ; (2) « tir à l'arc » toujours en ligne au 10/10 ; (3) les 16 vannes neuves écrites puis relues à l'aveugle ; (4) le `moduleDetail` s'affiche avec ses sauts de paragraphe (étalons, handoff @fullstack (e)) ; (5) durée de l'étape 6 à mesurer en premier à l'import (étalons, signalement 7) ; (6) rejeu des contrôles de contenu sur les textes importés (tirets cadratins, « blague », « carnet », prénoms de persona).
- **Doutes** : (a) les scènes des étapes 2 à 6 contiennent des phrases que j'ai écrites (PS d'Anouk, phrase de Romane, histoire de Clémence, réponse de Tristan) : ce sont des textes du site, comme la scène d'Anouk à l'étape 1 validée au choix 9, mais ce ne sont pas des conseils relus à l'aveugle ; (b) la vanne « pause déjeuner » (étape 3) a pour chute la réaction d'un collègue : classée « acceptable » dans les étalons, à reconsidérer si le test unique paraît plus strict ; (c) la légende de Hamzawi (étape 6) repose sur une hypothèse de genre (« d'ordinaire écrite d'avance ») à confirmer au visionnage, comme la fiche de Foresti et celle de Guiz « fast-food » pour leurs légendes d'observation.

