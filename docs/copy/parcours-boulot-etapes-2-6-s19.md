# Parcours Boulot, étapes 2 à 6 (s19, 10/10/2026)

> **Statut : texte complet (s19, 11/10/2026).** Itération 2 appliquée le 10/10, puis assemblage des vannes le 11/10 après le dernier tour à l'aveugle : les emplacements sont remplis (neuves validées, vannes du catalogue, PS d'Anouk S-2 validé) et la scène de l'étape 6 est réécrite sans vanne (S-6 n'a passé l'aveugle dans aucune version). Détail et textes : `docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md`. Corrections des notes @reviewer (9/10) et @ux (10/10) : voir « Corrections de l'itération 2 » et « Arbitrages de l'itération 1 » en fin de fichier. Rien n'est modifié dans `src/`, dans les seeds ni en base.
> Gabarit : `docs/copy/etalons-parcours-boulot-s19.md` (validé par Thomas le 10/10 : choix 1 à 6, 8 et 9). Même forme que l'étape 1 (§3 des étalons) : `moduleTitle`, `tipTitle`, `why`, `moduleDetail` en version B avec scène « Imagine… » (et, en dernier paragraphe, le test unique du choix 6B), exercice du jour, quiz, légendes des vidéos, 5 vannes. Modèle de structure : `docs/copy/parcours-storytelling-etapes-2-6-s18.md`.
> **Choix 7 tranché par Thomas : chute a** (« mon reflet dans l'écran »). L'exemple du PS de l'étape 2 est celui du tour 13 (Y1). La scène et le quiz de l'étape 2 ne le recopient pas.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin, aucune mention d'IA, aucun concurrent, aucune marque dans les légendes, aucun prénom de persona (Anouk, le fil rouge des six scènes du parcours, est un exemple, jamais présentée comme une vraie membre), « tes notes » (jamais « carnet »), jamais viser une personne.
> **Les conseils** sont ceux des étalons §1 (validés à l'aveugle pour les étapes 3 à 6) et celui du tour 13 pour l'étape 2. Chaque exercice est le défi du conseil, **recopié mot pour mot**, sans retouche.
> **Les vidéos** : aucune n'a été visionnée. Chaque légende ne dit que ce que la fiche en base établit (`docs/content/boulot-base-s19.json`, clé `videosActives`) et invite à observer, donc reste vraie quoi qu'on voie. Chaque vidéo doit être regardée une fois par une personne avant l'import (règle de sortie des étalons §6).
> **Les vannes** : « en ligne » = texte exact de la base (ou de `vannes-actives-s17.json` pour celles rangées hors BOULOT). Les 30 vannes du parcours : 11 en ligne retenues (étalons §5), 10 neuves validées à l'aveugle (textes exacts de leur fichier source) et 9 du catalogue, déjà en ligne, tirées de `repli-catalogue.md` (l'`id` est donné pour chacune). Chaque place est désignée par son identifiant (V-2-1, etc.).

## Tableau d'ensemble

| Étape | `moduleTitle` | Conseil affiché | Semaine / `dayNumber` / XP / gratuit | Qui l'entend | Version sans risque |
|---|---|---|---|---|---|
| 2 | Un PS drôle, sans finir en capture d'écran | Le PS qui détend un mail sérieux | 2 / 10 / 75 / non | Un collègue, seulement si tu envoies | Le PS reste en brouillon, ou tu écris celui du dernier mail sérieux envoyé |
| 3 | Le couloir : quinze secondes | La vanne de couloir : l'art du timing entre deux réunions | 3 / 17 / 100 / non | Une personne croisée, quinze secondes | La dire seul, à voix haute, en traversant une pièce |
| 4 | L'afterwork : ta semaine en trente secondes | L'afterwork : passer de collègue à personne drôle | 4 / 24 / 100 / non | Un petit groupe, trente secondes | La raconter à un ami qui ne connaît rien à ton boulot |
| 5 | « Tu fais quoi dans la vie ? » en deux phrases | Survivre (et briller) au networking pro avec humour | 5 / 31 / 125 / non | Des gens que tu connais peu | La dire trois fois à voix haute |
| 6 | Un toast de soixante secondes, une seule vanne | Le toast de soixante secondes qui tient debout | 6 / 38 / 150 (+100 de fin inchangé) / non | Toute la salle, le jour J seulement ; pendant l'exercice, personne | Rien n'est prononcé ; pot imaginé si aucun n'est en vue |

Titres : ceux du §7 des étalons, finalisés. Deux changements assumés. Étape 2 : « Écrire drôle au boulot sans finir en capture d'écran » devient « Un PS drôle, sans finir en capture d'écran » (le titre dit ce qu'on écrit, et garde la promesse). Étape 4 : « ta semaine en anecdote » devient « ta semaine en trente secondes » (comme les titres des étapes 1, 3, 5 et 6, il annonce une limite rassurante, et le défi la tient). Les étapes 3, 5 et 6 gardent le titre du §7.
`moduleFormat` : « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » aux étapes 2, 3 et 4 ; « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. » aux étapes 5 et 6 (une seule vidéo chacune, choix 5B). **Variante si la vidéo d'une étape 5 ou 6 tombe au visionnage** (le bloc vidéo disparaît seul) : `moduleFormat` « Un conseil, un défi, 5 vannes, un petit quiz. » et, à l'étape 6, la variante de `dureeTexte` donnée dans sa fiche. Les `moduleDetail` contiennent un saut de ligne avant le test (voir les étalons §3 et le handoff @fullstack, point 1, qui est du code et bloquant pour le rendu).
**Durées affichées** (`dureeTexte`, estimations de lecture, quiz et défi faites à la main à plus ou moins 10 %, **à mesurer à l'import** avec `parcours-etape.duree_s`) : étapes 2, 3 et 5 : défaut « Environ 15 min, hors vidéos » (11 à 14 min estimées). Étape 4 : défaut conservé (13 à 16 min estimées, la scène a été ramenée à 142 mots), à ajuster au chiffre mesuré si la médiane le dépasse. **Étape 6 : `dureeTexte` renseigné** (environ 20 min, voir sa fiche), parce que le défaut serait faux de 5 minutes.
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
| `moduleDetail` (version B, scène) | Imagine Anouk, jeudi, 16 h 40, devant un mail pour caler une réunion de lundi. Le fond est irréprochable : horaire, salle, ordre du jour. Elle écrit une ligne sous sa signature : « À toutes fins utiles, si la lumière du deuxième est restée allumée hier soir, ce n'était pas un oubli : j'y répétais comment dire « bonne soirée ». » Elle envoie le mail sans le PS, qu'elle garde en brouillon : il compte quand même. Dans cette étape, tu écris ta propre ligne : un PS d'une seule phrase, sur une petite scène vraie de ta journée. Qu'elle parte ou qu'elle reste en brouillon, c'est toi qui décides. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 75 / non / 10 |
| `retourExerciceNote` (phrase affichée au-dessus des 3 boutons « Alors, ce défi ? », champ existant) | Ton PS resté en brouillon compte : s'il finit sur la version rectifiée, choisis « Essayé, ça a marché ». |

Note de scène : **le PS d'Anouk est celui validé à l'aveugle au tour 6** (S-2, texte exact de `docs/marrant/parcours-boulot-s19/vannes-neuves/v6.md`, critique B et départage C « = », critique A « < »). C'est un faux rectificatif d'une phrase (une lumière restée allumée, la raison rectifiée en toute fin), hors du moule de l'exemple du conseil, sans « clavier », « reproches » ni reflet. Il ne figure pas dans le quiz. Revérifié : les réponses C (le ficus) et D (le café) de la Q1 ne l'imitent pas (leur moule est celui de l'exemple du conseil, « ce n'est pas X mais Y » en fin de phrase ; le PS d'Anouk écarte une explication et finit sur une répétition), et aucune bonne réponse ne reprend un mot de la scène. Scène recomptée : 100 mots hors PS (« 16 h 40 » pour trois), 25 mots de PS, soit **125 mots test compris** (plafond de 146). La scène reste lisible : elle dit qu'Anouk écrit une ligne, qu'elle garde le PS en brouillon et que « il compte quand même ». « Horaire » remplace « date » dans la liste du fond du mail, pour que la bonne réponse de la Q2 (« La date d'un point d'équipe ») ne reprenne pas un mot de la scène. Le `retourExerciceNote` évite que le bouton « Pas encore essayé » (« le défi t'attend ») contredise le défi, qui dit que le brouillon compte.

**Exercice « aujourd'hui »** : le DÉFI PS du conseil, recopié sans retouche. Il porte déjà sa version sans risque (mail à faible enjeu, PS gardé en brouillon qui compte quand même, ou PS du dernier mail sérieux envoyé).
> DÉFI PS : aujourd'hui, écris un PS d'une phrase qui corrige une erreur que personne n'a faite : prends une petite scène vraie de ta journée, rectifie un seul détail et finis sur la version rectifiée. Il doit rester présentable si ton chef le lit. Choisis un mail à faible enjeu, entre collègues, et si tu hésites, garde le PS en brouillon : il compte quand même. Pas de mail pro à envoyer aujourd'hui ? Écris le PS que tu aurais ajouté au dernier mail sérieux que tu as envoyé. C'est gagné si ton PS tient en une phrase et que la version rectifiée en est la toute fin.

**Quiz, trois questions** (ton B complice). Positions de la bonne réponse : **C, B, D**. Aucun prénom. Aucune bonne réponse n'est citée dans la scène ni dans l'exemple du conseil. Longueurs en mots (A, B, C, D ; bonne réponse en gras) : Q1 12, 12, **17**, 18 ; Q2 12, **14**, 10, 17 ; Q3 10, 13, 10, **12** : jamais la plus longue ni la plus courte. « Quatre mails » = quatre réponses (A à D), « trois » n'apparaît plus.

**Question 1 (bonne réponse en C)**
> **Ton mail est prêt : il confirme la salle d'un atelier, entre collègues de ton service. Laquelle de ces lignes ajoutes-tu sous la signature ?**
> A. « PS : bon week-end à tous, et merci pour la réactivité de chacun. »
> B. « PS : si la compta valide enfin à temps, ce sera une première. »
> **C. « PS : petite correction, ce n'est pas le ficus que j'arrose depuis mardi, mais son sosie en plastique. »**
> D. « PS : ce n'est pas du café que j'ai renversé ce matin, mais de l'eau, donc rien de grave. »
>
> **Explication** : La C. Elle corrige une erreur que personne n'a faite, sur un seul détail (la plante), et la version rectifiée arrive en toute fin sans rien arranger. La A est un PS poli, sans scène, la B vise un service, et la D rassure avec « rien de grave » : la correction arrange tout.

**Question 2 (bonne réponse en B)**
> **Quatre mails t'attendent. Dans lequel tentes-tu ton premier PS ?**
> A. Les excuses à un client dont la commande est arrivée en retard.
> **B. La date d'un point d'équipe, à deux collègues que tu croises tous les jours.**
> C. Un mail court à ton chef, pour confirmer un rendez-vous.
> D. Le message à toute l'entreprise, envoyé au nom de ton service pour le départ de la directrice.
>
> **Explication** : La B. Un mail à faible enjeu, entre collègues que tu connais, est le terrain du premier essai : le fond reste irréprochable et un PS manqué n'y coûte presque rien. La A mêle une excuse et une plaisanterie, la C, même courte, s'adresse à celui qui évalue ton travail, et la D t'expose devant toute l'entreprise.

**Question 3 (bonne réponse en D)**
> **Ta journée n'a aucun écrit professionnel au programme. Comment fais-tu l'exercice du PS ?**
> A. Tu laisses tomber : sans destinataire, le rectificatif perd son sens.
> B. Tu envoies quand même un message à un collègue, pour avoir un prétexte.
> C. Tu recopies une phrase lue ailleurs, en changeant deux mots.
> **D. Tu rédiges celui que tu aurais glissé sous ton dernier message sérieux.**
>
> **Explication** : La D. Le repli du défi est le PS que tu aurais ajouté à ton dernier message sérieux : rien à envoyer, tout à écrire. La A abandonne alors qu'un repli existe, la B force un envoi dont personne n'a besoin, et la C ne part pas d'une scène vraie de ta journée.

**Les 2 vidéos** (choix 5B ; aucune n'a été visionnée ; la fiche en base de Croce parle de « 10 vannes en 5 minutes » alors que la durée en base est de 2 min 30 (durées de la base vérifiées conformes par @reviewer le 10/10, à confirmer au visionnage) ; Croce est déjà utilisée dans Confiance 1 avec une autre légende, doublon accepté).

| | Légende (`why`) |
|---|---|
| **Première** : Pierre Croce, « Ce qu'on rêverait d'entendre dans l'avion » (2 min 30 d'après la base) | Pierre Croce imagine les annonces qu'on rêverait d'entendre dans un avion, une liste où chaque phrase tient en une ligne. Repère, dans chaque annonce, le mot qui fait basculer la phrase, et où il se trouve : dans ton PS, il arrive en toute fin. |
| *Facultative* : Jason Brokerss, « Snapchat » (5 min 40) | Jason Brokerss décortique les réseaux sociaux avec l'énergie de quelqu'un qui a passé trop de temps sur son téléphone, et qui le sait. Repère un détail si précis que tu t'y reconnais : c'est ce genre de petite scène vraie que ton PS rectifie. |

**Les 5 vannes** (3 en ligne, 1 neuve validée à l'aveugle, 1 du catalogue). Aucune des cinq n'est un faux rectificatif : cette mécanique est dans le conseil et dans le PS d'Anouk de la scène. Les cinq montrent un écrit ou un message dont un détail fait la vanne. Détail de l'assemblage : `docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md`.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (Machine à Café 1) : « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » / « Cinq personnes m'ont demandé ce que je faisais dans la conversation. » | Le mail comme terrain : un chiffre sérieux (90 contre 1) et une chute qui retourne la normalité. |
| 2 | En ligne (Storytelling 6) : « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. » / « Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas. » | Une erreur que personne n'a corrigée, poussée jusqu'au bout avec le même sérieux. |
| 3 | En ligne (Répartie 2) : « Mon adresse mail pro d'alternant commence par « alternant2 ». » / « J'aimerais savoir ce qu'est devenu alternant1. » | Un détail de mail pris au sérieux au point de poser une question absurde. |
| 4 | Neuve, validée à l'aveugle (tour 4, V-2-1) : « J'ai fini un mail de trois lignes par un smiley, pour signaler la vanne. » / « On m'a demandé laquelle des trois. » | Une vanne balisée dans un mail de trois lignes, et une question qui montre qu'on cherche encore où elle était : la limite d'écrire drôle au boulot. Pas un faux rectificatif. |
| 5 | Catalogue, en ligne (`cs14jk8c54311509a1108b0a`, V-2-2) : « J'ai laissé un avis cinq étoiles à ma boulangerie. La boulangère m'a répondu « à demain ! ». » / « Depuis, je passe par l'autre rue. » | Une ligne écrite trop aimable qui se retourne contre celui qui l'a écrite : le détail d'un message prend des proportions absurdes. Pas un faux rectificatif non plus. |

---

## Étape 3 : Le couloir : quinze secondes

Conseil affiché : « La vanne de couloir : l'art du timing entre deux réunions » (OBSERVATION, DEBUTANT), validé à l'aveugle, texte des étalons §1. L'enseignement : un irritant que tout le monde subit, dit en dix mots maximum, une seule fois, sans s'arrêter.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Le couloir : quinze secondes |
| `tipTitle` | La vanne de couloir : l'art du timing entre deux réunions |
| `why` | Un couloir te laisse quinze secondes, pas une de plus, et personne ne s'y arrête. C'est le meilleur endroit pour ta première vanne à voix haute : si elle ne prend pas, tu es déjà trois pas plus loin. Ici, tu en dis une, en marchant, à une seule personne. |
| `moduleDetail` (version B, scène) | Imagine Anouk, mardi, 12 h 52, au troisième étage. Quelqu'un attend l'ascenseur, les yeux sur les numéros. Anouk passe à sa hauteur sans ralentir : « Quatre étages. Il s'arrête à tous, par politesse. » Elle est déjà dans l'escalier, sans attendre de réponse. La cible, c'est l'ascenseur, et n'importe qui dans l'immeuble pourrait l'entendre. Dans cette étape, tu fais pareil : un irritant que tout le monde subit, dix mots au plus, dit une seule fois, en marchant. Pas de couloir aujourd'hui, ou pas envie de tenter devant quelqu'un ? Tu peux dire ta phrase seul, à voix haute, en traversant une pièce. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 100 / non / 17 |
| `retourExerciceNote` (champ existant) | Ici, « Essayé, ça a marché » veut dire que tu l'as dite en marchant. Le rire n'est pas le critère. |

Note de scène : la phrase d'Anouk compte huit mots (limite : dix), vise un objet, n'attend aucune réponse ; la scène entière compte 119 mots test compris (plafond de 146). La fin de scène dit « sans attendre de réponse » et non plus « que l'autre sourie ou non », pour que la bonne réponse de la Q2 (« qu'il ait souri ou non ») ne reprenne pas la tournure de la scène (itération 2). L'ascenseur n'est ni dans le quiz, ni dans les vannes de l'étape. Le `retourExerciceNote` évite que « Essayé, bof » (« relis l'exemple et retente ») contredise le défi, qui dit « qu'elle ait fait rire ou non ».

**Exercice « aujourd'hui »** : le DÉFI CROISEMENT du conseil, recopié sans retouche. Le repli solo y est déjà.
> DÉFI CROISEMENT : aujourd'hui, choisis un irritant que tout le monde subit (l'imprimante, la clim, le café, l'ascenseur) et écris sa phrase en dix mots maximum. Dis-la une seule fois, au moment où tu croises quelqu'un, sans t'arrêter ni te retourner. C'est réussi si tu l'as dite en marchant et sans attendre de réponse, qu'elle ait fait rire ou non. Pas de couloir aujourd'hui (télétravail, jour off), ou pas envie de tenter devant n'importe qui ? Joue le croisement seul : lève-toi, dis ta phrase à voix haute en traversant une pièce ou en montant l'escalier, puis fais encore cinq pas avant de t'arrêter. C'est réussi si tu l'as dite d'un seul trait, en marchant, et si tu as fait ces cinq pas sans te retourner.

**Quiz, trois questions** (ton B complice). Positions : **C, A, B**. Aucun prénom. Aucune bonne réponse n'est citée dans la scène (ascenseur, étages, politesse) ni dans l'exemple du conseil (imprimante). Longueurs en mots (A, B, C, D ; bonne réponse en gras) : Q1 10, 15, **8**, 7 ; Q2 **11**, 10, 11, 13 ; Q3 9, **10**, 11, 13 : jamais la plus longue ni la plus courte. Q2 : l'énoncé (« Que fais-tu ensuite ? ») et les quatre réponses (des gestes) ont la même forme ; la réponse tentante pour qui a peur de se griller (« elle n'était pas drôle, j'arrête ») est la C.

**Question 1 (bonne réponse en C)**
> **Laquelle de ces phrases peut se dire en passant dans le couloir ?**
> A. « Le chef a encore changé l'ordre du jour, comme d'habitude. »
> B. « Le distributeur a avalé ma monnaie, puis il m'a regardé comme si c'était ma faute. »
> **C. « Cette porte ferme avec la discrétion d'une fanfare. »**
> D. « Toi aussi, tu trouves ce café tiède ? »
>
> **Explication** : La C. Elle vise un objet que tout le monde subit, tient en dix mots au plus et n'attend aucune réponse. La A vise une personne, la B dépasse largement les dix mots, et la D pose une question : celui que tu croises doit s'arrêter pour répondre.

**Question 2 (bonne réponse en A)**
> **Tu viens de sortir ta phrase en croisant quelqu'un, qui n'a pas réagi. Que fais-tu ensuite ?**
> **A. Tu continues ta route : c'est réussi, qu'il ait souri ou non.**
> B. Tu te retournes pour voir si ça l'a fait rire.
> C. Tu en conclus qu'elle n'était pas drôle et tu abandonnes l'exercice.
> D. Tu reviens sur tes pas pour lui demander ce qu'il en a pensé.
>
> **Explication** : La A. Le défi se joue sur le geste : la dire en marchant suffit, même sans réaction. La B guette la réaction et la D demande un avis : deux façons de transformer quinze secondes en conversation. La C prend un silence pour un verdict, et c'est le piège qui te ferait arrêter.

**Question 3 (bonne réponse en B)**
> **Tu hésites entre quatre sujets pour ta phrase de couloir. Lequel est le plus sûr ?**
> A. Le dernier mail du directeur, que personne n'a compris.
> **B. Le thermostat du service, qui change d'avis à chaque passage.**
> C. Ton salaire, que tu aimerais enfin comparer à celui des autres.
> D. La nouvelle recrue, qui ne sait pas encore où se trouve la cafétéria.
>
> **Explication** : La B. Un objet que tout le monde subit se dit devant n'importe qui, sans qu'aucun absent ait à se défendre. La A vise un responsable, la C ouvre un sujet qui ne passerait pas devant tout le service, et la D met une personne en position de victime.

**Les 2 vidéos** (choix 5B, étape 3 gardée comme dans la spec ; aucune n'a été visionnée ; Kev Adams dure 5 min 20, entière avec le choix 8a).

| | Légende (`why`) |
|---|---|
| **Première** : Guillermo Guiz, « Les cabillauds, ces arrogants ! » (4 min 30) | Une chronique absurde sur les cabillauds, dite avec un humour pince-sans-rire et une logique impeccable. Repère la phrase la plus courte qui te fait sourire, et compte ses mots : dans un couloir, tu as droit à dix. |
| *Facultative* : Kev Adams, « Du côté de chez vous » (5 min 20) | Kev Adams décrit les codes de son quartier avec précision et bienveillance, sans caricature. Repère un détail que tout le monde reconnaît sans qu'il ait besoin de l'expliquer : c'est ce qui fait un bon irritant partagé. |

**Les 5 vannes** (2 en ligne, 3 neuves validées à l'aveugle). Technique de l'étape : un irritant partagé, dit en dix mots maximum, sans s'arrêter. Les trois neuves tiennent en dix mots ou moins, setup et chute compris.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (Machine à Café 3) : « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » / « Il cherche quelqu'un de plus reposé. » | Un objet que tout le monde subit se met à avoir un avis sur toi, et la chute est courte. |
| 2 | En ligne (Confiance 1) : « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. » / « Il te fait asseoir et baisse la voix. » | Un rituel partagé, pris au sérieux. Réserve : classée « acceptable » dans les étalons (la chute est la réaction d'un collègue, la cible reste le rituel). |
| 3 | Neuve, validée à l'aveugle (tour 4, V-3-1) : « Le micro de la salle capte les stylos. » / « Pas moi. » | Un irritant de salle de réunion en dix mots, la chute en deux, dite sans s'arrêter. |
| 4 | Neuve, validée à l'aveugle (tour 4, V-3-2) : « Les murs sont fins. » / « L'autre réunion avançait. » | Un irritant partagé en sept mots, dit en passant : les cloisons des salles. |
| 5 | Neuve, validée à l'aveugle (tour 5, V-3-3) : « Mon casier ne contient qu'une chose. » / « L'invitation à le vider. » | Un irritant partagé en dix mots : le casier dont le seul contenu est l'ordre de le vider. |

---

## Étape 4 : L'afterwork : ta semaine en trente secondes

Conseil affiché : « L'afterwork : passer de collègue à personne drôle » (STORYTELLING, DEBUTANT), validé à l'aveugle, texte des étalons §1. L'enseignement : raconter un moment de ta semaine en trois temps (décor, escalade, chute), toi dedans, jamais un absent.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | L'afterwork : ta semaine en trente secondes |
| `tipTitle` | L'afterwork : passer de collègue à personne drôle |
| `why` | À l'afterwork, personne ne veut le compte rendu de ta semaine : tout le monde veut une histoire courte. Les bonnes se racontent en trois temps, et le héros est celui qui raconte. Ici, tu en prépares une, de trente secondes au plus, pour un petit groupe ou, pour commencer, pour un ami. |
| `moduleDetail` (version B, scène) | Imagine Anouk, vendredi, 18 h 30, un verre à la main, au milieu de trois collègues qui racontent leur semaine. Quand vient son tour, elle dit : « Ce matin, mon ordinateur m'a demandé un nouveau mot de passe. Le premier était trop court, le deuxième trop proche de l'ancien, le troisième trop simple. Le quatrième contenait un chiffre, une majuscule et une larme. Accepté. » Puis elle boit une gorgée. Le tout a duré moins de trente secondes, et la seule à s'en sortir mal, c'est elle. Dans cette étape, tu prépares ton histoire, avec un petit moment de ta semaine qui t'a mis en difficulté. Pas d'afterwork à venir ? Raconte-la d'abord à un ami qui ne connaît rien à ton boulot. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 100 / non / 24 |
| `dureeTexte` | Vide : défaut « Environ 15 min, hors vidéos ». `[ESTIMATION @ux : 13 à 16 min, à mesurer à l'import ; si la médiane mesurée dépasse, remplacer par le chiffre mesuré, arrondi à 5 min]` |

Note de scène : l'histoire d'Anouk compte 37 mots (comptés un à un, « m'a » et « l'ancien » pour un mot chacun), soit moins de trente secondes à voix haute, et la scène entière 142 mots test compris (plafond de 146 mots pour toute scène, fixé par @ux). Elle monte d'un cran par phrase (trop court, trop proche, trop simple, puis la liste) et finit sur la phrase la plus courte, un seul mot. Elle n'a aucun sigle, aucune personne, ne reprend ni le frigo ni le déjeuner de l'exemple du conseil, ni les bonnes réponses du quiz. C'est Anouk qui s'en sort mal, pas l'ordinateur : c'est le « héros raté » du conseil.

**Exercice « aujourd'hui »** : le DÉFI TRENTE SECONDES du conseil, recopié sans retouche. Le repli solo (un ami hors boulot) y est déjà.
> DÉFI TRENTE SECONDES : choisis un petit moment de ta semaine de travail où c'est toi qui as été dépassé (un objet, une procédure, une machine, jamais un collègue précis). Écris-le en trois temps : un décor en une phrase sans sigle, une escalade, une chute. Dis-le à voix haute en chronométrant. C'est réussi s'il tient en 30 secondes ou moins, sans un seul sigle, et si tu t'arrêtes net après la chute. Pas d'afterwork à venir ? Raconte-le à un ami qui ne connaît rien à ton boulot : s'il le comprend sans poser de question, c'est gagné.

**Quiz, trois questions** (ton B complice). Positions : **D, C, A**. Aucun prénom. Longueurs en mots (A, B, C, D ; bonne réponse en gras) : Q1 14, 12, 13, **13** ; Q2 7, 10, **10**, 11 ; Q3 **12**, 13, 11, 10 : jamais la plus longue ni la plus courte. Q3 : la bonne réponse n'est plus la seule à ne pas commencer par « Tu le racontes » (la B commence comme elle).

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
> B. Tu en prends un autre, où ce collègue n'apparaît qu'une fois, en passant.
> C. Tu le racontes, mais avec beaucoup de tendresse dans la voix.
> D. Tu le racontes seulement s'il n'est pas là ce soir-là.
>
> **Explication** : La A. Dans ton histoire, c'est toi qui es dedans : un objet qui te dépasse ne se vexe pas. La B le garde, même en passant, et tout le monde le reconnaîtra, la C adoucit la voix mais pas la cible, et la D attend l'absence de l'intéressé pour parler de lui.

**Les 2 vidéos** (choix 5B ; aucune n'a été visionnée ; Foresti dure 6 min, entière avec le choix 8a).

| | Légende (`why`) |
|---|---|
| **Première** : Guillermo Guiz, « Pas de sentiments au fast-food » (4 min 30) | Guillermo Guiz fait d'un fast-food un sujet de réflexion presque existentielle, avec un regard surréaliste. Repère ce qu'il fait d'un endroit où il ne se passe presque rien : c'est la matière d'une anecdote de ta semaine. |
| *Facultative* : Florence Foresti, « Le styliste (Boys Boys Boys) » (6 min) | Florence Foresti incarne un styliste et en décortique les codes. Repère ce qu'elle pose dès le début pour que tu comprennes la scène, même si tu ne connais rien à la mode. |

**Les 5 vannes** (2 en ligne, 2 du catalogue, 1 neuve validée à l'aveugle). Technique de l'étape : un moment absurde en trois temps, la chute étant la phrase la plus courte. Le bus et le GPS sont deux trajets : voisinage assumé, réserve nommée dans `vannes-finales.md`.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (aucun parcours) : « J'ai passé mon stage à ranger les archives par ordre alphabétique. » / « Depuis, plus personne ne retrouve rien. Ils avaient un système. » | Un décor d'une phrase, un effet qui monte, une chute courte : le héros raté, c'est celui qui a rangé. |
| 2 | En ligne (Machine à Café 3) : « Pour mon entretien, j'ai emprunté le costume de mon père. Son nom est cousu sur la manche. Le recruteur m'a appelé Robert toute l'heure. » / « Robert commence en septembre. » | Trois temps (le costume, le nom, le prénom qui s'installe) et une chute de quatre mots. |
| 3 | Catalogue, en ligne (`cmnl01zwv004ss60y2ecodj9a`, V-4-1) : « J'ai attendu mon bus sous la pluie ce matin pendant 20 minutes. » / « Il était à l'heure, moi j'étais à l'arrêt d'en face. » | Décor d'une phrase, durée chiffrée, chute qui retombe sur celui qui raconte : un trajet du matin, sans sigle ni personne. |
| 4 | Catalogue, en ligne (`cmmw0togs0001mw62152nl589`, V-4-2) : « Mon GPS m'a dit de tourner à droite. Y'avait un fleuve. » / « J'ai hésité. Il avait l'air sûr de lui. » | Trois temps nets (l'ordre, l'obstacle, l'hésitation), la chute est la phrase la plus courte et c'est soi qui hésite. |
| 5 | Neuve, validée à l'aveugle (tour 2, V-4-3) : « Jeudi, en visio, j'ai mis un fond de plage pour détendre l'ambiance. Le logiciel a gardé le sable, puis effacé mon oreille, mon épaule, et la moitié de mon visage. » / « On a félicité la plage. » | Un moment absurde de la semaine : le décor choisi prend la place du narrateur, et la chute, la phrase la plus courte, change de sujet. |

---

## Étape 5 : « Tu fais quoi dans la vie ? » en deux phrases

Conseil affiché : « Survivre (et briller) au networking pro avec humour » (AUTODERISION, INTERMEDIAIRE), validé à l'aveugle, texte des étalons §1. L'enseignement : remplacer le pitch récité par deux phrases honnêtes (un verbe concret, puis ce que la fiche de poste ne dit pas), avec l'autodérision sur soi, jamais sur son métier ni sur son employeur.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | « Tu fais quoi dans la vie ? » en deux phrases |
| `tipTitle` | Survivre (et briller) au networking pro avec humour |
| `why` | « Et toi, tu fais quoi ? » revient à chaque pot, et la réponse récitée ne retient personne. Deux phrases honnêtes, dont une que la fiche de poste ne dit pas, donnent à l'autre quelque chose à relancer. Ici, tu écris la tienne, pour des gens que tu connais à peine. |
| `moduleDetail` (version B, scène) | Imagine Anouk, jeudi, 19 h 10, à un pot de bienvenue. Un invité lui demande ce qu'elle fait dans la vie. Anouk ne récite pas son titre. Elle répond : « Je rédige des notices de montage. Je passe un samedi sur deux chez des inconnus, en tout petits caractères. » L'autre pose une question sur les notices. Dans cette étape, tu écris ta propre réponse en deux phrases : un verbe concret, puis le détail que la fiche de poste ne dit pas. La moquerie tombe sur toi, jamais sur ton métier ni sur ton employeur. Personne ne te le demande ? Pose la question à quelqu'un que tu connais peu : on te la rendra. Sinon, répète ta réponse trois fois à voix haute, seul. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 125 / non / 31 |

Note de scène : la réponse d'Anouk compte 19 mots (6 + 13, « en tout petits caractères » pour quatre mots), sous la limite de vingt-cinq du défi ; la scène entière 143 mots test compris (plafond de 146 ; « qu'elle », « quelqu'un », « l'autre » pour un mot chacun, « 19 h 10 » pour trois : 48 mots jusqu'à la fin de la réponse, 121 avant le test, plus 22 pour le test). « Un invité » remplace « un inconnu » pour ne pas redire « inconnus » deux phrases plus bas (itération 2). Son verbe est concret (« rédige »), le second détail place son métier dans la vie des autres, et l'ironie tombe sur elle. Ni la planification de l'exemple du conseil, ni le comptable du quiz. La scène crée l'occasion que le défi attend (« à la première personne qui te pose la question ») : un mardi ordinaire, personne ne la pose, alors la scène invite à la poser soi-même à quelqu'un que l'on connaît peu, et garde le repli solo en dernier. Le défi, lui, n'est pas retouché.
Sans la vidéo (si Delmoitiez tombe au visionnage) : `moduleFormat` « Un conseil, un défi, 5 vannes, un petit quiz. »

**Exercice « aujourd'hui »** : le DÉFI DEUX PHRASES du conseil, recopié sans retouche. Le repli solo (trois fois à voix haute) y est déjà.
> DÉFI DEUX PHRASES : écris ta réponse à « tu fais quoi dans la vie ? » en deux phrases et vingt-cinq mots au maximum : un verbe concret d'abord, le détail que la fiche de poste ne dit pas ensuite. Donne-la à la première personne qui te pose la question aujourd'hui. C'est réussi si ta réponse tient en deux phrases et si on te pose une question dessus au lieu de changer de sujet. Personne ne te le demande aujourd'hui ? Dis-la trois fois à voix haute : c'est réussi quand tu la dis la troisième fois sans regarder ta feuille.

**Quiz, trois questions** (ton B complice). Positions : **B, C, A**. Aucun prénom. Longueurs en mots (A, B, C, D ; bonne réponse en gras) : Q1 11, **10**, 7, 12 ; Q2 15, 12, **14**, 11 ; Q3 **12**, 13, 11, 12 : jamais la plus longue ni la plus courte.

**Question 1 (bonne réponse en B)**
> **Tu es comptable dans une petite entreprise. Quelle première phrase décrit vraiment ton travail ?**
> A. « Je m'occupe des chiffres de la boîte, un peu de tout. »
> **B. « J'envoie les factures du mois et je vérifie qu'elles arrivent. »**
> C. « Je pilote l'optimisation des flux de facturation. »
> D. « Je fais des chiffres, enfin voilà, c'est un peu compliqué à expliquer. »
>
> **Explication** : La B. Deux verbes concrets, et n'importe qui voit ton travail. La A reste floue (« je m'occupe », « un peu de tout »), la C se cache derrière du jargon, et la D traîne un « enfin voilà » qui efface ta réponse.

**Question 2 (bonne réponse en C)**
> **Ta première phrase est : « Je plante des arbres dans un parc. » Laquelle de ces secondes phrases colle au conseil ?**
> A. « La mairie me paie pour regarder pousser, avec patience, ce que d'autres ont mal choisi. »
> B. « Honnêtement, ce métier n'a aucun intérêt, je le fais pour le salaire. »
> **C. « Dans quarante ans, des familles pique-niqueront à l'ombre de mon travail, sans me remercier. »**
> D. « Mais assez parlé de moi : et vous, qu'est-ce que vous faites ? »
>
> **Explication** : La C. Elle donne la place de ton métier dans la vie des autres, et l'ironie reste sur toi (« sans me remercier »). La A se moque de la mairie, qui est ton employeur, et de ceux qui ont choisi avant toi, la B méprise ton métier, et la D change de sujet avant qu'on t'ait posé une question.

**Question 3 (bonne réponse en A)**
> **Ta phrase fait rire tes amis, mais elle se moque un peu de ton métier. Ce soir, ton chef sera au pot. Que fais-tu ?**
> **A. Tu la retournes pour que ce soit toi qui encaisses la chute.**
> B. Tu la gardes : ton chef a de l'humour, il ne se vexera pas.
> C. Tu la dis plus bas, pour que ton chef n'entende pas.
> D. Tu la dis quand même, en ajoutant « sans rancune » à la fin.
>
> **Explication** : La A. C'est le critère du conseil : si ton chef entendait ta réponse, il devrait sourire, pas se vexer. Retournée contre toi, elle passe ; telle quelle, elle touche ton métier. La B parie sur l'humour de ton chef, la C cache le problème au lieu de le régler, et la D croit qu'un « sans rancune » efface ce qui a été dit.

**La vidéo** (choix 5B : Delmoitiez seule, Haroun sort, écart à la spec assumé par Thomas ; aucune vidéo visionnée ; durée de la base 6 min (conforme, vérifiée par @reviewer le 10/10, à confirmer au visionnage), entière avec le choix 8a ; jamais utilisée dans un autre parcours).

| | Légende (`why`) |
|---|---|
| **Première (unique)** : Lisa Delmoitiez, « J'ai pas confiance en moi et j'ai raison » (6 min) | Lisa Delmoitiez transforme son manque de confiance en spectacle, et son titre le dit déjà : assumer ses faiblesses avec humour. Repère sur qui tombe chaque rire : sur elle, ou sur autre chose ? C'est la question à te poser avant de dire ta réponse. |

**Les 5 vannes** (2 en ligne, 3 du catalogue). Technique de l'étape : une réponse honnête et courte qui parle de soi, sans mépriser ni le poste ni l'employeur. Les trois du catalogue sont des autodérisions sur soi, à un pot, une soirée ou en famille, pas des métiers décrits en deux phrases.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | En ligne (aucun parcours) : « J'ai préparé mon entretien pendant trois jours. Première question : « Vous avez trouvé facilement ? » » / « J'avais rien préparé pour ça. J'ai dit « plus ou moins ». Il a noté. » | Un aveu sur soi, dit avec sérieux : l'autodérision tombe sur celui qui parle. |
| 2 | En ligne (Confiance 2) : « Quand on tape mon nom sur Internet, on tombe sur un champion de tir à l'arc. » / « En entretien, on m'a demandé si j'étais dispo pour les régionales. » | Un détail de soi que la fiche de poste ne dit pas, et l'autodérision sur ce qu'on te prête. Vérifiée en base le 10/10 : active, catégorie RESEAUX_SOCIAUX. |
| 3 | Catalogue, en ligne (`cmmnsqn15007dth63pcggw13x`, V-5-1) : « Elle m'a demandé ce que je faisais dans la vie. » / « J'ai dit « des erreurs, principalement ». Elle a ri. Puis elle est partie. » | La question de l'étape, et une réponse de deux mots qui ne vise que soi. Sa chute est une réponse prononcée, comme la vanne de l'entretien : structures voisines, pas identiques. |
| 4 | Catalogue, en ligne (`cs14jk1e07f8547b752601b8`, V-5-2) : « Je ne connaissais personne à la soirée, alors j'ai parlé au chat. » / « À minuit, il s'est excusé pour aller voir quelqu'un. » | Le décor du pot où l'on connaît peu de monde, et l'autodérision sur son propre isolement. |
| 5 | Catalogue, en ligne (`cs14jk88f075a4297ed90830`, V-5-3) : « Ma mère a rêvé que j'avais une promotion et l'a annoncé à toute la famille. » / « J'ai jusqu'à Noël pour l'obtenir. » | La place que ton métier occupe dans la vie des autres, et la pression qui retombe sur soi. |

---

## Étape 6 : Un toast de soixante secondes, une seule vanne

Conseil affiché : « Le toast de soixante secondes qui tient debout » (STORYTELLING, INTERMEDIAIRE), conseil neuf validé à l'aveugle (tour 6), texte des étalons §1. L'enseignement : trois blocs (un souvenir précis, une seule vanne en rappel, une phrase de fermeture), la cible étant toi ou le détail, jamais la personne honorée.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Un toast de soixante secondes, une seule vanne |
| `tipTitle` | Le toast de soixante secondes qui tient debout |
| `why` | Quand quelqu'un prend la parole à un pot, la salle redoute un seul moment : celui où ça traîne. Soixante secondes bien rangées l'évitent. Ici, tu écris le tien, sans rien dire à personne. |
| `moduleDetail` (version B, scène) | Imagine Anouk, vendredi, 17 h 30, au pot de départ d'un collègue qui l'a dépannée. Elle sort la feuille écrite mardi soir et lit le premier bloc : un souvenir daté, son troisième jour, la pluie, le parapluie qu'il lui a prêté avec un « garde-le le temps qu'il faut ». Elle enchaîne sur une seule phrase, et la salle rit. Puis une dernière phrase, pour lever le verre. Sur la feuille, une vanne de rechange, notée à côté, n'a pas servi. Dans cette étape, tu écris ton toast de la même façon, pour un vrai pot ou pour un pot imaginé : rien ne se prononce avant le jour J. `[saut de paragraphe (\n\n)]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? |
| `moduleFormat` | Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 150 (+100 de fin inchangé) / non / 38 |
| `dureeTexte` | Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast. `[ESTIMATION @ux : 19 à 22 min d'après 1 450 mots à lire, un quiz de 4 questions et 100 à 125 mots à écrire ; à mesurer à l'import avec l'événement parcours-etape.duree_s, étape 6 en premier ; si la médiane dépasse 1 300 s, ajuster]` |
| `dureeTexte`, variante sans vidéo | Environ 20 min : 10 min de lecture et de quiz, 10 min pour écrire ton toast. (`moduleFormat` correspondant : « Un conseil, un défi, 5 vannes, un petit quiz. ») |
| `retourExerciceNote` (champ existant) | Ici, « Essayé, ça a marché » veut dire que ton toast est écrit, vanne de rechange comprise. Il se dit le jour du pot, pas avant. |

Note de scène : **scène réécrite sans vanne (s19, 11/10)**. Aucune version de la vanne d'Anouk au toast (S-6) n'a passé l'aveugle aux tours 3 à 6 : la scène ne la cite plus. Elle se passe désormais au pot, le vendredi : Anouk lit sa feuille écrite le mardi, le souvenir d'abord, puis « une seule phrase, et la salle rit », sans dire laquelle (même procédé que le témoignage B de la fiche, qui montre le résultat dans la réaction des autres). Elle montre les trois blocs du conseil et la vanne de rechange que le défi exige (restée sur la feuille), et le toast lu : l'arc du parcours (« tu finis par un toast ») ne s'arrête plus dans le vide. Le titre, la scène et le défi disent la même chose : une seule vanne à prononcer, plus une de rechange sur la feuille. Scène recomptée : 129 mots test compris (« 17 h 30 » pour trois), sous le plafond de 146. Le moment est fixé à 17 h 30 pour ne pas rejouer le vendredi 18 h 30 de l'étape 4. Le souvenir ne reprend ni Claire, ni la machine à café, ni « demain à tête reposée » de l'exemple du conseil. Aucune bonne réponse du quiz n'y figure : la vanne de rechange y est nommée, donc la bonne réponse de la question 3 n'emploie pas ce mot.

**Exercice « aujourd'hui »** : le DÉFI SOIXANTE SECONDES du conseil, recopié sans retouche. Il porte déjà sa version sans risque (pot imaginé, rien à prononcer, le toast reste sur ta feuille).
> DÉFI SOIXANTE SECONDES : écris un toast en trois blocs : un souvenir précis, une seule vanne en rappel, une phrase de fermeture. Pas besoin d'être sur place : imagine-toi au pot et note deux choses qui seraient vraies pour toi ce soir-là (ce que tu ressentirais, ce que tu aurais préparé, ce que tout le monde ferait en attendant que tu parles). Transforme chacune en rappel, c'est l'étape qui fait d'un fait une vanne : pars d'un détail de ton souvenir (une phrase, un objet, un geste), un différent pour chaque, puis écris deux phrases. La première dit ce qui t'arrive, la seconde fait revenir le détail contre toi, de préférence sur le dernier mot. Garde la meilleure pour ton toast et l'autre en vanne de rechange : le jour J, si l'ambiance n'est pas celle que tu imaginais, tu changes de vanne sans toucher au reste. Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. Pas besoin de chrono : compte tes mots. C'est réussi s'il fait entre 100 et 125 mots (c'est ta minute), si la vanne arrive après le souvenir, si elle reprend un détail de ce souvenir et se retourne contre toi (ou contre ce détail, jamais contre la personne qui l'a dit ou donné), sans viser la personne honorée, l'organisation, le buffet ni un responsable, et si tu as noté une vanne de rechange à côté. Rien à prononcer : le toast reste sur ta feuille jusqu'au jour J.

**Quiz, quatre questions** (ton B complice). Positions : **D, B, C, A**. Aucun prénom. Longueurs en mots (A, B, C, D ; bonne réponse en gras) : Q1 10, 16, 11, **14** ; Q2 8, **13**, 16, 11 ; Q3 10, 10, **12**, 15 ; Q4 **13**, 11, 14, 15 : jamais la plus longue ni la plus courte. « Quatre questions » = quatre. Q3 : « deux autres » + la vanne = trois, comme l'énoncé de la réponse D (« l'une des trois »).

**Question 1 (bonne réponse en D)**
> **Un ami te conseille d'ouvrir ton toast par ta meilleure vanne, pour détendre la salle. Que lui réponds-tu ?**
> A. « Bonne idée : un public qui rit écoute mieux la suite. »
> B. « Oui, mais avec deux vannes d'affilée, pour être bien sûr que ça prenne tout de suite. »
> C. « Non : au pot, l'humour est interdit, il faut rester dans l'émotion. »
> **D. « Non : je garde l'humour pour après le souvenir, sinon il n'a rien à rappeler. »**
>
> **Explication** : La D. Un rappel n'existe qu'après ce qu'il rappelle, et la salle rit d'abord de reconnaître le détail. La A ouvre par l'humour, la B en empile deux, et la C interdit toute vanne alors qu'une seule, bien placée, suffit.

**Question 2 (bonne réponse en B)**
> **Ton souvenir parle d'un gâteau que ta collègue apporte à chaque pot. Quelle vanne en rappel peux-tu en tirer ?**
> A. Une où tu moques sa cuisine, c'est affectueux.
> **B. Une où tu avoues avoir goûté ta part avant le début du discours.**
> C. Une où tu fais allusion à ceux qui n'en prennent jamais, au fond de la salle.
> D. Une où tu critiques le buffet, trop pauvre à ton goût.
>
> **Explication** : La B. Le détail revient, et c'est toi qui en fais les frais : tu es le gourmand du discours. La A moque sa cuisine, la C vise ceux qui ne se servent pas, et la D s'en prend au buffet : seuls toi ou le détail peuvent encaisser.

**Question 3 (bonne réponse en C)**
> **Le jour du pot, la salle est bruyante et fatiguée, loin de ce que tu avais prévu. Que fais-tu de ta vanne ?**
> A. Tu la dis plus fort, pour passer au-dessus des conversations.
> B. Tu la gardes telle quelle : le texte est écrit, point.
> **C. Tu en sors une autre, tenue en réserve, sans toucher au reste.**
> D. Tu en ajoutes deux autres à la suite, en espérant que l'une des trois prenne.
>
> **Explication** : La C. La vanne de rechange est là pour ça : tu changes de vanne sans toucher au reste du texte. La A force une vanne qui ne prend pas, la B s'accroche à un texte qui ne convient plus, et la D en ajoute, alors qu'une seule suffit.

**Question 4 (bonne réponse en A)**
> **Tu cherches ton premier bloc, le moment sincère. Lequel gardes-tu ?**
> **A. « Mon deuxième jeudi, elle a relu mon rapport à sept heures du soir. »**
> B. « Elle a toujours été là pour moi, dès le premier jour. »
> C. « Mon premier lundi, elle m'a fait visiter l'étage et s'y est perdue deux fois. »
> D. « Son départ laisse un grand vide dans toute l'équipe, et je tenais à le dire. »
>
> **Explication** : La A. Un souvenir daté et précis (le jeudi, l'heure, le geste) sonne vrai, et il fournira son détail au rappel. La C est tout aussi précise, mais elle fait rire de la personne honorée dès le premier bloc. La B et la D sont des compliments de carte de vœux : on les entend, mais on ne les voit pas.

**La vidéo** (choix 5B : Hamzawi, adéquation moyenne à faible, la moins éloignée du catalogue ; aucune vidéo visionnée ; durée de la base 4 min (conforme, vérifiée par @reviewer le 10/10, à confirmer au visionnage) ; existe et s'intègre, vérifié par oEmbed le 10/10 ; déjà utilisée dans Storytelling 3 avec une autre légende, doublon accepté). Si elle ne tient pas au visionnage, l'étape reste sans vidéo (le bloc disparaît seul).

| | Légende (`why`) |
|---|---|
| **Première (unique)** : Nora Hamzawi, « Les chagrins d'amour » (4 min, chronique de radio) | Nora Hamzawi dissèque les chagrins d'amour dans une chronique de radio, avec une autodérision qui porte sur elle. Une chronique est d'ordinaire écrite d'avance puis lue à voix haute, comme ton toast. Repère qui fait les frais de chaque rire : dans ton toast, ce sera toi ou un détail, jamais la personne honorée. Si le sujet te touche de trop près en ce moment, passe : la vidéo est facultative. |

**Les 5 vannes** (2 neuves validées à l'aveugle, 3 du catalogue ; la vanne du mug de Machine à Café 3 est sortie de l'étape, voir étalons §5). Technique du conseil : un rappel. Une première phrase installe un détail, la chute le fait revenir contre soi, de préférence sur le dernier mot. Jamais la personne honorée, l'organisation, le buffet ni un responsable. **Toutes les vannes de l'étape ne sont pas des rappels** : deux le sont (1 et 4), une l'est presque (5), deux sont des vannes de pot sans rappel (2 et 3). Aucun texte de l'étape ne promet cinq rappels.

| # | Vanne | Lien avec l'étape (une ligne) |
|---|---|---|
| 1 | Catalogue, en ligne (`cmmnsqn14003vth63i2are7es`, V-6-1) : « Mon meilleur pote et moi, on se dit « il faudrait qu'on se fasse un truc » depuis des années. » / « C'est devenu notre truc. » | Un vrai rappel : l'expression installée en première phrase revient sur le dernier mot et se retourne contre celui qui parle. |
| 2 | Neuve, validée à l'aveugle (tour 3, V-6-2) : « Mesdames, messieurs, le discours que vous avez demandé est momentanément indisponible. » / « Merci de lever vos verres en attendant. » | Pas un rappel : la voix d'une annonce de standard pour une panne d'orateur, puis le geste que le toast demande de toute façon. |
| 3 | Neuve, validée à l'aveugle (tour 4, V-6-3) : « Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix euros. » / « Je suis la roulette de gauche. » | Pas un rappel : une cotisation chiffrée sur soi, traduite en pièce du cadeau. L'autodérision porte sur celui qui parle. |
| 4 | Catalogue, en ligne (`cs14jkbdb9858fdd496e962a`, V-6-4) : « Au mariage de mon cousin, j'étais placé à la « table des amis d'enfance ». » / « Je ne connaissais personne. J'ai dû avoir une enfance discrète. » | Un rappel : le détail « amis d'enfance » revient dans la chute, sur le dernier mot, contre soi. |
| 5 | Catalogue, en ligne (`cs14jk8f28ff20e1cf82f3a8`, V-6-5) : « Au jeu de mimes, ma carte disait « la timidité ». » / « J'avais à peine bougé qu'ils avaient trouvé. » | Presque un rappel : la carte est le détail et la chute le retourne contre soi, mais le dernier mot n'est pas le détail. |

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

Recompté à l'itération 2 : aucune position n'a changé (les corrections touchent des énoncés et des réponses, pas le rang de la bonne). Plafond de 40 % respecté (max 26 %, soit 5 sur 19, contre 7 sur 19 autorisés). Jamais deux bonnes réponses de suite au même rang, y compris d'une étape à l'autre (la suite complète est B, D, A | C, B, D | C, A, B | D, C, A | B, C, A | D, B, C, A). Dans chacune des 16 questions écrites ici (3 + 3 + 3 + 3 + 4 ; l'ancien « 15 » était un décompte faux, les 19 du parcours étaient justes), la bonne réponse n'est ni la plus longue ni la plus courte des quatre (longueurs recomptées à l'itération 2, après les corrections des questions 3 de l'étape 5 et 3 de l'étape 6, listées sous chaque quiz) ; aucune bonne réponse ne reprend un mot de sa question ni la tournure de sa scène ; les mots du conseil (souvenir, chute) restent permis. **Au moins deux réponses plausibles par question** : étape 5 Q1 (la A est floue sans être du jargon) et étape 6 Q4 (la C est précise et datée mais rit de la personne honorée) ont été réécrites pour cela ; étape 3 Q2 (la C, « elle n'était pas drôle, j'arrête ») et étape 2 Q2 (la C, un mail court au chef) ajoutent le piège réellement tentant. **Nombres annoncés = comptés** : « Quatre mails » (4 réponses), « trois questions » (3) et « quatre questions » (4), « deux autres » + la vanne = « les trois ».

## Vannes : décompte

Étapes 2 à 6 : 5 vannes chacune, soit 25 places. Étape 1 : 5 places aussi (canapé et point rapide en ligne, V-1-1 à V-1-3 neuves). Répartition des 30 : **11 en ligne retenues** (2 à l'étape 1, 3 à l'étape 2, 2 à l'étape 3, 2 à l'étape 4, 2 à l'étape 5, 0 à l'étape 6), **10 neuves validées à l'aveugle** (3, 1, 3, 1, 0, 2 par étape : V-1-1 à V-1-3, V-2-1, V-3-1 à V-3-3, V-4-3, V-6-2, V-6-3) et **9 du catalogue** (0, 1, 0, 2, 3, 3 par étape : V-2-2, V-4-1, V-4-2, V-5-1 à V-5-3, V-6-1, V-6-4, V-6-5), soit les 30 places.
Les neuves sont reprises mot pour mot de leur fichier source (`v1.md` à `v5.md`), les vannes du catalogue de l'export `docs/content/vannes-actives-s19.json`, les vannes en ligne de la base ou de `vannes-actives-s17.json`. Le PS d'Anouk de l'étape 2 (S-2, `v6.md`) est validé et placé dans la scène ; la vanne d'Anouk de l'étape 6 (S-6) n'a passé l'aveugle dans aucune version et a été retirée de la scène. Aucun de ces textes n'est écrit par @copywriter dans cette passe.

## Fin de parcours (après l'étape 6)

Champs du parcours `boulot`, à importer avec lui (le bilan de fin affiche la phrase de suite seulement si `nextParcoursReason` existe ; sans elle, le bouton arrive nu, après six semaines).

| Champ | Texte |
|---|---|
| `nextParcours` | `storytelling` (classement de départ de la spec §5.5) |
| `nextParcoursRanking` | `["storytelling", "machine-a-cafe", "repartie", "confiance"]` (même classement ; le mot `"pro"` des autres parcours est renommé `"boulot"` à l'import, étalons signalement 9) |
| `nextParcoursReason` | Tu sais écrire court et le dire sans te griller. Storytelling t'apprend à en faire une histoire entière, celle qu'on te redemande. `[PROPOSITION @copywriter, à soumettre à la relecture à l'aveugle avec les vannes avant l'import]` |

Cette phrase est un texte du site, au même titre que les scènes : zéro tiret cadratin, tutoiement, aucune promesse hors parcours (Storytelling est en ligne). Elle prolonge la scène de l'étape 6 (Anouk lit son toast au pot, la salle rit).

## Plan de mesure (HEART, dimension primaire : Task success)

Aucun nouvel événement : `parcours-etape` avec `duree_s` (temps d'ouverture à validation, plafonné à 3 600 s), `etape-retour` (3 valeurs), `quiz-etape-termine` (score, total), `parcours-termine`. Cibles `[HYPOTHÈSE : à confirmer par @data-analyst, aucune donnée Boulot avant la mise en ligne]` : médiane de `duree_s` ≤ 900 s aux étapes 2 à 5 et ≤ 1 300 s à l'étape 6 ; part de « Pas encore essayé » ≤ 40 % aux étapes 3 à 5 ; validation de l'étape 6 par ceux qui ont validé l'étape 5 ≥ 70 % (le défaut de 90 % est irréaliste sur six semaines sans rappel). Lire l'étape 6 en premier : si la médiane dépasse 1 300 s, ajuster son `dureeTexte` ; l'étape 4 ensuite, pour décider de lui en donner un.

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'import ; les vannes ont passé l'aveugle, voir `vannes-finales.md`)

- **Fichier produit** : `/home/user/Marrant/docs/copy/parcours-boulot-etapes-2-6-s19.md`. Aucun autre fichier modifié, rien en base, aucun commit.
- **Décisions prises** : registre « pote drôle et bienveillant » ; version B avec scène pour chaque étape (Anouk dans les six scènes du parcours, étape 1 comprise, pour tenir le fil rouge de la fiche ; aucun prénom de persona ni d'humoriste des vidéos) ; exercices = défis des conseils recopiés mot pour mot (étapes 3 à 6 : étalons §1 ; étape 2 : tour 13, Y1) ; test unique du choix 6B en dernier paragraphe, identique aux étapes 2 à 6 ; version sans risque nommée en une demi-phrase dans chaque `moduleDetail` ; bonnes réponses C/B/D, C/A/B, D/C/A, B/C/A, D/B/C/A ; titres des étapes 2 et 4 reformulés (voir le tableau d'ensemble) ; scène de l'étape 6 sans vanne (S-6 n'a passé l'aveugle dans aucune version : Anouk lit son toast au pot et la salle rit, sans que la phrase soit dite) ; `dureeTexte` de l'étape 6 renseigné (estimation à mesurer à l'import), `retourExerciceNote` aux étapes 2, 3 et 6, `nextParcours*` écrits (section « Fin de parcours ») ; étape 2 écrite sur le choix 7a (exemple du tour 13 en l'état, scène et quiz indépendants de lui).
- **Frameworks et niveau de conscience** : textes d'étape = PAS court avec scène, Product-Aware ; quiz = mise en situation puis explication, Product-Aware.
- **Points d'attention** : objections traitées (« je vais me griller » : test unique, qui l'entend et version sans risque à chaque étape, étape 6 sans rien prononcer ; « je n'ai pas de couloir, d'afterwork, de pot » : replis des défis ; « je ne suis pas drôle » : une phrase, trente secondes, deux phrases, soixante secondes, chaque marche est petite ; « je n'ai personne à qui le dire » : à voix haute seul, à un ami hors boulot, sur ta feuille). Références : étalons s19, modèle Storytelling s18, spec s17 §1 et §3.2, base du 10/10 (fiches vidéo), `vannes-actives-s17.json`.
- **Handoff @fullstack (code, noir sur blanc ; rien de ceci n'est fait par le copywriter)**. **(1) BLOQUANT pour le rendu, avant toute mise en ligne** : (a) ajouter la classe `whitespace-pre-line` aux trois `<p>` qui affichent `moduleDetail` : `apps/web/src/components/parcours/parcours-step-card.tsx` l. 285 (étape ouverte), `apps/web/src/components/parcours/step-blocks.tsx` l. 39 (aperçu verrouillé des étapes 2 à 6) et `apps/web/src/components/parcours/parcours-content.tsx` l. 335-337 (bloc « Programme » de /parcours) ; avant cela, vérifier qu'aucun `moduleDetail` des autres parcours ne contient de `\n` (aucun rendu existant ne doit changer) ; sans cette classe, le test unique se colle à la scène et forme un seul bloc de 125 à 150 mots, alors que toute la promesse « sans te griller » repose sur ce paragraphe séparé ; (b) étendre à `slug === "boulot"` la condition de `parcours-step-card.tsx` l. 269 (`slug === "storytelling" ? frTypo(...)`) et passer `why` et `moduleDetail` dans `frTypo` pour ce slug, pour que « 16 h 40 », « 18 h 30 », « 19 h 10 », « 17 h 30 » et les « : » ne se coupent pas en bout de ligne sur mobile ; (c) `parcours-jsonld.ts` et `llms-parcours.ts` ne doivent pas reprendre le saut de ligne tel quel. Aucun changement de texte. **(2)** champs à importer en plus des textes d'étape : `dureeTexte` de l'étape 6, `retourExerciceNote` des étapes 2, 3 et 6, `nextParcours`, `nextParcoursRanking`, `nextParcoursReason` (champs existants dans `parcours-data.ts` et `parcours-types.ts`). **(3)** le point « tir à l'arc » du handoff précédent est clos (active en base le 10/10) ; rester vigilant à l'import (`isActive` de chaque vanne). **(4)** instrumentation : lire `parcours-etape.duree_s` en commençant par l'étape 6 (section « Plan de mesure »).
- **À vérifier avant import** : (1) chaque vidéo regardée une fois par une personne (aucune n'a été visionnée ; durées de la base vérifiées conformes par @reviewer, à confirmer au visionnage, en particulier Croce « avion », Hamzawi et Delmoitiez) ; (2) fait le 11/10 : les 30 vannes assemblées (voir `vannes-finales.md`), le PS d'Anouk (S-2) placé dans la scène 2 (125 mots), la scène 6 réécrite sans vanne (129 mots) ; la Q1 de l'étape 2 (réponses C et D) revérifiée contre le PS ; reste à vérifier `isActive` des 9 vannes du catalogue et des 11 en ligne à l'import ; (3) le rendu des sauts de paragraphe du `moduleDetail` (handoff @fullstack, point 1) ; (4) durée de l'étape 6 : le chiffre « environ 20 min » est une estimation à mesurer à l'import, en premier (étalons, signalement 7 ; plan de mesure ci-dessus) ; l'étape 4 ensuite ; (5) rejeu des contrôles de contenu sur les textes importés (tirets cadratins, « blague », « carnet », prénoms de persona, noms Romane, Clémence, Tristan absents) ; (6) variantes sans vidéo prêtes si Delmoitiez ou Hamzawi tombe au visionnage (`moduleFormat`, `dureeTexte`) ; `APERCU_BAS` et le texte du verrou ne citent « les vidéos » que si l'étape en a (étalons, handoff (7a)).
- **Doutes** : (a) les scènes des étapes 3 à 5 contiennent des phrases que j'ai écrites (phrase de couloir, histoire du mot de passe, réponse de l'étape 5, tous d'Anouk ; le PS de l'étape 2 est celui validé à l'aveugle au tour 6 ; la scène de l'étape 6 ne cite plus de vanne) et la phrase de suite de `nextParcoursReason` : ce sont des textes du site, comme la scène d'Anouk à l'étape 1 validée au choix 9, mais ce ne sont pas des conseils relus à l'aveugle ; (b) la vanne « pause déjeuner » (étape 3) a pour chute la réaction d'un collègue : classée « acceptable » dans les étalons, à reconsidérer si le test unique paraît plus strict ; (c) la légende de Hamzawi (étape 6) repose sur une hypothèse de genre (« d'ordinaire écrite d'avance ») à confirmer au visionnage, comme la fiche de Foresti et celle de Guiz « fast-food » pour leurs légendes d'observation.

## Arbitrages de l'itération 1

Appliqué sans conflit : @reviewer B1, B2, B3, N1, N2, N4, N7a, N8, N9, N11, N12, N13 ; @ux n°1, n°2, n°4, n°7, n°8, n°9, n°10, n°12, n°13, n°14, n°15 (a, c, d), n°16 ; @ux n°3 (code) inscrit au handoff @fullstack, point 1. Non touché : conseils, défis (les exercices restent les défis mot pour mot), exemple du PS (chute a), titres, XP, `dayNumber`, positions des bonnes réponses, vannes en ligne. Mesure du diff : je n'ai pas d'outil shell dans cette session, donc pas de `git diff --stat` ; mesure à faire par la session. À la main : les 5 `moduleDetail` changent (Anouk, plus les corrections de fond aux étapes 2, 4, 5, 6), 3 `why` sur 5 (étapes 3, 4, 5), 3 légendes, 13 questions sur 16 (une phrase à quelques mots, ou une réponse entière), aucun conseil ni défi.

Arbitrages, quand les deux notes ou une note et une consigne divergent :
1. **Étape 4, scène : B3 (@reviewer) l'emporte sur la reprise telle quelle de @ux n°11.** @ux raccourcit l'histoire mais garde « Il a été accepté. Je ne sais plus lequel. », que @reviewer prouve illogique (on sait lequel : le troisième) et qui enterre « une larme ». J'applique l'histoire corrigée de B3 (37 mots, chute d'un mot), le passage à Anouk et la coupe de @ux (« elle ne résume rien » retiré), N5 (« la seule à s'en sortir mal, c'est elle »). Résultat : 142 mots test compris, sous le plafond de 146.
2. **Étape 3, Q2 : fusion de N3 et de n°5.** Énoncé « Que fais-tu ensuite ? », A de @reviewer (« … c'est réussi, qu'il ait souri ou non », 11 mots) plutôt que celle de @ux (« la réaction ne compte pas »), parce que l'énoncé dit « n'a pas réagi » et que la bonne réponse ne doit pas reprendre un mot de sa question. C de @ux (« elle n'était pas drôle, tu abandonnes »), le piège qui tente vraiment. B passe de « sourire » à « rire » pour ne pas faire écho au « souri » de la A. Explication de @ux.
3. **Étape 5, Q3 : N6 (@reviewer, remplacer) l'emporte sur n°6 (@ux, garder et ajouter « tu souris »).** La question d'origine refaisait celle de l'étape 4 (s'arrêter sur la chute, « tu expliques ») et partageait « enfin voilà » avec la Q1 de la même étape. Je la remplace par la règle du conseil laissée sans question (« si ton chef entendait ta réponse, il devrait sourire, pas se vexer »), bonne réponse toujours en A. Contrepartie assumée : tenir le silence après la chute n'est plus une question de l'étape 5 ; la règle « tu t'arrêtes net sur la chute » reste testée à l'étape 4 (Q2), et le critère du défi de l'étape 5 (« on te pose une question dessus ») la couvre.
4. **Étape 5, Q2, explication : fusion de N7b et de n°15b.** « La A se moque de la mairie, qui est ton employeur, et de ceux qui ont choisi avant toi » : les deux lectures de la phrase A sont vraies.
5. **Étape 6, scène : n°2 (@ux) et N10 (@reviewer) fusionnés, mais la vanne d'Anouk reste non écrite.** Pris : la vanne de rechange (n°2 et N10), la fin sur « il ne lui restera qu'à lire sa feuille » (n°2), une seule mention de « rien ne se prononce avant le jour J » au lieu de trois (N10), « son toast » nommé (la scène ne le disait plus). Écarté : la vanne « parapluie » proposée par N10. Raison : c'est une vanne de toast, du même genre que les cinq vannes neuves de l'étape, et la consigne de la session est que les vannes neuves restent des emplacements, relues à l'aveugle avant d'être publiées (règle d'or). N10 prévoyait ce cas (« si on garde le choix actuel, aligner la justification »). Justification alignée : la note de scène ne dit plus « aucun texte de vanne hors relecture » (faux pour les scènes 2 à 5) mais que cette phrase, étant une vanne de toast, attendrait la même relecture. Risque résiduel : l'étape 6 est la seule scène sans chute écrite. Si la relecture des vannes neuves passe, la proposition de N10 peut être soumise comme vanne de plus et ajoutée à la scène, sans rien changer d'autre.
6. **Étape 6, Q3, réponse C : reformulée.** La scène nomme maintenant la vanne de rechange, donc la bonne réponse ne peut plus dire « celle de rechange » (la note de scène promet qu'aucune bonne réponse n'y figure). C devient « Tu en sors une autre, prévue d'avance, sans toucher au reste. » (11 mots, ni la plus longue ni la plus courte). **Remplacée à l'itération 2** (@reviewer N3) : « prévue d'avance » est un pléonasme et fait écho au « prévu » de la question ; la réponse devient « Tu en sors une autre, tenue en réserve, sans toucher au reste. » (12 mots ; A 10, B 10, D 15).
7. **Étape 2, Q1 : n°4 (énoncé de @ux) plus N1 (réponse C de @reviewer), avec un mot changé.** « Depuis lundi » devient « depuis mardi » : « lundi » est dans la scène de l'étape 2 (« réunion de lundi »), et la bonne réponse ne doit pas reprendre un mot de la scène.
8. **Étape 3, Q3, réponse B : « l'étage » devient « du service ».** Non demandé par les notes : « étage » est dans la scène de l'étape 3 (« au troisième étage »), ce qui contredisait la note de scène (aucune bonne réponse citée dans la scène). Même longueur (10 mots).
9. **Boutons « Alors, ce défi ? » (n°10) : les phrases de @ux sont réécrites avec les libellés exacts du code** (`apps/web/src/config/textes/parcours.ts` l. 155-170 : « Pas encore essayé », « Essayé, bof », « Essayé, ça a marché »). « Essayé » seul n'existe pas ; les phrases nomment « Essayé, ça a marché ».
10. **Fil d'Anouk (proposition de @ux) : appliqué aux six scènes, sans redite ni contradiction.** Contrôle contre l'étape 1 (étalons §3 : Anouk, mardi, 9 h 50, seule dans la salle, trois traces, rien montré) : aucune scène ne reprend un objet, un horaire ou une phrase de l'étape 1, et aucune ne date l'arrivée d'Anouk dans l'entreprise (le « troisième jour » de l'étape 6 est un souvenir, pas une durée). Contrôle contre la fiche (étalons §2, témoignages A et B, « six semaines après avoir commencé ») : le B (phrase lâchée, collègue qui la redemande) ne cite aucune scène ; le A (PS, mot dans le couloir, pot de départ de vendredi) est cohérent avec les étapes 2, 3 et 6 (le pot de l'étape 6 est un vendredi). L'étape 5 se passe à un « pot de bienvenue » sans dire que c'est celui d'Anouk, pour ne pas la dater. Prénoms Romane, Clémence, Tristan supprimés des textes du site ; aucun quiz ne les citait. Rien à changer à l'étape 1 ni à la fiche.
11. **Durées : étape 6 renseignée, étape 4 laissée au défaut.** Après correction, l'étape 4 reste estimée à 13 à 16 min (la scène perd 11 mots, le `why` en gagne autant) : « environ 15 min » tient comme arrondi, la mesure à l'import tranchera. Toutes ces durées sont des estimations faites à la main (plus ou moins 10 %).
12. **Décompte corrigé : 16 questions écrites ici, pas 15** (3 + 3 + 3 + 3 + 4). Les 19 du parcours, les positions et leur tableau étaient justes.
13. **« Tir à l'arc »** : marqueur « à vérifier » retiré (vérifiée active en base le 10/10, catégorie RESEAUX_SOCIAUX d'après la note @reviewer N12) ; point retiré de la liste « À vérifier » du handoff.

## Corrections de l'itération 2 (@reviewer 9/10, @ux 10/10)

- **B1 (@reviewer), étape 2 : le PS d'Anouk n'est plus écrit par @copywriter.** La phrase (candidate écartée par l'audit du PS, qui copiait le moule de l'exemple) est remplacée dans la scène par `[PS D'ANOUK : vanne S-2, en relecture à l'aveugle]`, scène lisible autour. Cahier des charges et revérification de la Q1 (C, D) dans la note de scène de l'étape 2. De même, la vanne d'Anouk de l'étape 6 est marquée dans la scène `[VANNE D'ANOUK : S-6, en relecture à l'aveugle]` (elle n'était pas marquée dans le texte, seulement dans la note).
- **Appliquées telles que fournies** : N1 (étape 5, Q3, A « Tu la retournes pour que ce soit toi qui encaisses la chute. », 12 mots ; explication « Retournée contre toi, elle passe ; telle quelle, elle touche ton métier. ») ; N2 (étape 3, scène : « sans attendre de réponse », ce qui règle aussi l'observation O3 de @ux ; je n'ai pas pris sa variante « sans se retourner », qui ferait écho à la réponse B « Tu te retournes ») ; N3 (étape 6, Q3, C « tenue en réserve », 12 mots) ; N4 (étape 5, scène : « Un invité ») ; N5 (étape 5, note de scène : 143 mots) ; N6 (étape 6, `why` sans la redite du jour J ; la scène garde sa version sans risque) ; N7 (étape 2, scène « horaire, salle, ordre du jour », et paragraphe de contrôle réécrit : « aucune bonne réponse ne reprend un mot de sa question ni la tournure de sa scène ; les mots du conseil (souvenir, chute) restent permis », vérifié sur les 16 bonnes réponses) ; N8 (étape 5, Q1, explication : « du jargon »).
- **Recomptés** : longueurs des Q3 de l'étape 5 (A 12, B 13, C 11, D 12) et de l'étape 6 (A 10, B 10, C 12, D 15), bonne réponse ni la plus longue ni la plus courte ; positions inchangées (A 5, B 5, C 5, D 4 sur 19, max 26 % pour un plafond de 40 %, jamais deux fois le même rang de suite) ; nombres annoncés (« Quatre mails », « trois questions », « quatre questions », 16 questions écrites, 16 vannes neuves) ; scènes : étape 2 environ 100 mots hors PS (à recompter une fois le PS écrit), étape 3 119, étape 4 142, étape 5 143, étape 6 142, toutes sous 146.
- **Non touché** : conseils, défis (exercices mot pour mot), exemple du PS (chute a), titres, XP, `dayNumber`, vannes en ligne, légendes, positions.
- **Mesure du diff réel (P0 s11, O4 de @ux)** : non faite, je n'ai pas d'outil shell dans cette session. À la main, ce que l'itération 2 change : 4 `moduleDetail` (étapes 2, 3, 5, 6), 1 `why` (étape 6), 3 réponses ou explications de quiz (étape 5 Q1 et Q3, étape 6 Q3), des notes. La session lance `git diff --stat` sur ce fichier avant de clore.

## Assemblage des vannes (s19, 11/10/2026)

- **Remplacé** : les 16 emplacements de vannes neuves des étapes 2 à 6 (numérotés 4 à 19) par 7 neuves validées à l'aveugle (V-2-1, V-3-1, V-3-2, V-3-3, V-4-3, V-6-2, V-6-3) et 9 vannes du catalogue (V-2-2, V-4-1, V-4-2, V-5-1 à V-5-3, V-6-1, V-6-4, V-6-5) ; le PS d'Anouk (S-2) dans la scène de l'étape 2 ; la scène de l'étape 6 réécrite sans vanne. V-1-1 à V-1-3 sont à l'étape 1 (étalons §3).
- **Corrigé** : les promesses de « rappel » de l'étape 6 (les cinq lignes « Un rappel contre soi » deviennent cinq liens honnêtes : 2 rappels, 1 presque, 2 sans rappel) ; l'étape 2 dit qu'aucune des cinq vannes n'est un faux rectificatif ; l'étape 5 dit que les trois vannes du catalogue sont des autodérisions sur soi, pas des métiers en deux phrases ; le statut, le décompte, le handoff et la note de fin de parcours.
- **Non touché** : conseils, défis (mot pour mot), exemple du PS (chute a), quiz (aucun ne cite un texte qui a changé, relu question par question), légendes, titres, XP, `dayNumber`, positions des bonnes réponses.
- **Scènes recomptées à la main** : étape 2 = 125 mots test compris (100 + 25 de PS) ; étape 6 = 129 mots test compris (142 avant) ; plafond de 146 respecté.
- **Mesure du diff réel (P0 s11)** : pas d'outil shell, donc pas de `git diff --stat` (à lancer par la session). À la main : 2 `moduleDetail` modifiés sur 5 (étape 2 : +25 mots de PS ; étape 6 : scène réécrite, le souvenir et la consigne finale conservés), 16 lignes de tableaux de vannes remplies, 0 conseil, 0 défi, 0 question de quiz.

