# Relecture à l'aveugle, regard d'éditeur : 11 lettres e-mail s22 (25/10/2026)

**Relecteur** : @reviewer · **Barre** : 9/10 par lettre · **Périmètre** : lettres du mois n°2 à n°6 (`docs/copy/lettres-du-mois-s22.md`), lettres réservées du 12/11 au 31/12 (`docs/copy/lettres-reservees-nov-dec-s22.md`, annexe A exclue). N°1 (candidate a, `docs/copy/n1-candidates-s22.md`) lu comme référence de redite, pas rouvert.
**Non rouverts (consigne)** : signature « L'Équipe Deviens Marrant », absence de « réservée aux abonnés » sur les liens d'étape, prix dans l'encart.
Aucun autre fichier modifié, rien commité.

## Résumé exécutif

4 lettres sur 11 passent la barre telles quelles : n°2, n°4, 17/12 (Palmashow) et 31/12. Pour 3 autres (n°5, n°6, 10/12), il suffit d'une retouche mécanique, sans nouvelle réplique à voter. Les 4 dernières (12/11, 19/11, 26/11 et 24/12) ont le défaut que Thomas a déjà relevé lui-même : le lecteur a déjà vu ça sur le site. La règle et l'erreur de la visio du 26/11 sont celles de l'article gratuit « Humour en visio » du 02/11. La scène du 19/11 est celle de la fiche « Le lundi à la machine à café » du carnet d'octobre. Celle du 24/12 est la question n°2 de l'article « Repas de famille », que le n°2 recommande trois semaines plus tôt. Les risquée et joueuse du 12/11 refont celles du n°1, une semaine avant. Les retouches proposées ci-dessous créent des répliques neuves : elles repassent la relecture à l'aveugle avant tout envoi (règle d'or s18).

## Tableau des notes

| Lettre | Envoi | Note | Verdict | Bloquants | Nature de la retouche |
|---|---|---|---|---|---|
| N°2 pull tricoté | 03/12 | 9,0 | **GO** | 0 | aucune |
| N°3 résolutions | 07/01 | 8,0 | NO-GO | 1 | l'exemple de l'erreur et l'intro (pas de nouvelle réplique) |
| N°4 Saint-Valentin | 04/02 | 9,0 | **GO** | 0 | (vote à l'aveugle de la joueuse conseillé, mineur 1) |
| N°5 fête, seul l'hôte | 04/03 | 8,5 | NO-GO | 1 | une phrase, mécanique |
| N°6 1er avril | 01/04 | 8,5 | NO-GO | 2 | un chiffre et un titre, mécaniques |
| 12/11 TD, exposé | 12/11 | 7,5 | NO-GO | 2 | risquée neuve, commentaire de la joueuse, **revote** |
| 19/11 Bref | 19/11 | 7,5 | NO-GO | 3 | scène, un exemple neuf, une phrase de faits, **revote** |
| 26/11 visio | 26/11 | 7,0 | NO-GO | 2 | règle et erreur réécrites, un chiffre, **revote** |
| 10/12 tisane | 10/12 | 8,5 | NO-GO | 1 | lien d'étape, mécanique |
| 17/12 Palmashow | 17/12 | 9,0 | **GO** | 0 | aucune |
| 24/12 tonton | 24/12 | 7,5 | NO-GO | 1 | question de la scène et ce qui en dépend, **revote** |
| 31/12 réveillon | 31/12 | 9,0 | **GO** | 0 | aucune |

**Top 3 des corrections** : (1) 26/11, la règle et l'erreur sont un doublon d'un article gratuit ; (2) 24/12, la scène est un doublon de l'article qu'on vient de recommander, et l'erreur contredit sa sortie conseillée ; (3) 12/11, une redite du n°1 à 7 jours d'écart, que l'abonné recevra dans la foulée.

---

## Bloquants, avec retouche mot pour mot

### Lettre du 12/11 (TD, « Tu avais un train ? »)

**B1. Risquée : même ressort et même phrase de condition que le n°1, à 7 jours d'écart.** Les deux visent l'habitude verbale de l'autre (Hugo « parlait déjà pour trois », Mathis « commente »). La phrase de condition est calquée sur celle du n°1 : n°1 « Elle ne marche que si Hugo parle beaucoup, le sait, et rit quand c'est lui qu'on chambre » (`n1-candidates-s22.md:48`), 12/11 « Elle ne marche que si Mathis commente tout le monde, le sait, et en rit » (`lettres-reservees-nov-dec-s22.md:62`).
Remplacer les lignes 61-62 par :
> « Le train attendra. Tu as une question, Mathis ? »
> Tu acceptes le train et tu le fais attendre pour lui : la pique devient une invitation, devant le chargé de TD. S'il trouve une vraie question, tu dois savoir y répondre ; s'il n'en trouve pas, c'est lui que la salle regarde. À garder pour un sujet que tu maîtrises. Si ton exposé s'est mal passé, elle sonne comme une provocation.

Et dans « Comment choisir » (l. 65), remplacer « La risquée fait retenir le duel avec Mathis, plus du tout l'exposé. » par « La risquée fait retenir l'échange avec Mathis, sa question ou son silence, plus du tout l'exposé. »
(8 mots. Grep « train attendra » sur `apps/web/src/data` : à faire avant le vote.)

**B2. Commentaire de la joueuse : le même que celui du n°1.** n°1 : « le sérieux d'un guichet […] un visage qui ne bouge pas » (`n1-candidates-s22.md:44`). 12/11 : « le ton d'un caissier qui compte. Elle demande un visage qui ne bouge pas » (l. 58). La réplique peut rester. Remplacer le commentaire (l. 58) par :
> Les six minutes que tu n'as pas prises, tu les rends à la salle comme on rend de la monnaie : la pique te reprochait d'avoir été court, tu en fais une politesse. Dis-la en reposant tes fiches, d'une voix égale, devant un groupe qui t'a déjà vu plaisanter, ne serait-ce qu'une fois depuis la rentrée.

### Lettre du 19/11 (Bref)

**B1. La scène est celle d'une fiche du carnet.** `carnet/2026-10.json:30-37`, « Le lundi à la machine à café » : un collègue près de la machine, le lundi, « Tu as passé un bon week-end ? », et une réplique d'une ligne sur ton week-end. La lettre reprend le même lundi, la même machine et la même question. Le lecteur Premium a eu cette fiche cinq semaines plus tôt.
- l. 92, remplacer la scène par : « Lundi midi, à la cantine. Clara pose son plateau en face du tien : « Tu as fait quoi, ce week-end ? » Tu commences par le début, vendredi soir, puis le train, puis la personne qui, et à la troisième précision tu vois son regard partir vers son téléphone. »
- l. 102 : « C'est ce qui manque à la machine à café. » devient « C'est ce qui manque à ton récit du lundi. »
- l. 115 : « La méthode, elle, resservira lundi prochain, à la même heure, devant la même machine. » devient « La méthode, elle, resservira lundi prochain, à la même table. »

**B2. L'exemple de l'étagère est déjà dans une étape du parcours.** `docs/content/parcours-storytelling-s18.json:275` (Storytelling 3, « Faire le bilan de ton raté ») : « Hugo, dont l'étagère penche depuis samedi. À la question « alors, ce bricolage ? »… ». Même objet, même défaut, même question de week-end, et le lecteur Premium a ce parcours. Remplacer les lignes 112-113 par :
> « Je suis allé au magasin de meubles pour une ampoule. Je suis ressorti avec un fauteuil. Sans l'ampoule. »
> Le fait, puis l'écart entre ce que tu venais chercher et ce que tu rapportes, dit avec la même voix que le reste. Aucun rire d'avance : c'est le ton du compte rendu qui travaille, et « Sans l'ampoule » arrive tout seul.

(Grep « ampoule » sur `apps/web/src/data` : 0 résultat. La réplique est neuve, elle doit passer le vote.)

**B3. Une phrase fausse dans les faits.** l. 97 : « …et chaque épisode dure environ deux minutes. » Or la même ligne annonce une saison 2 « en six épisodes d'environ trente minutes ». F5 ne vérifie les deux minutes que pour la saison 1 (en.wikipedia, infobox « approximately 2 minutes (season 1) »). Remplacer « Le héros n'a pas de prénom : il se désigne par « Je », raconte sa vie en voix off, celle d'un trentenaire célibataire, et chaque épisode dure environ deux minutes. Le premier s'intitule « Bref. J'ai dragué cette fille ». La saison 1 en compte 82, jusqu'en juillet 2012, » par « Le héros n'a pas de prénom : il se désigne par « Je » et raconte sa vie en voix off, celle d'un trentenaire célibataire. Le premier épisode s'intitule « Bref. J'ai dragué cette fille ». La saison 1 en compte 82, d'environ deux minutes chacun, jusqu'en juillet 2012, ».
Même défaut l. 94 : « On regarde comment une série d'épisodes de deux minutes annonce chacun en une phrase de quoi il parle » devient « On regarde comment la première saison d'une série, en épisodes de deux minutes, annonce chacun en une phrase de quoi il parle ».

### Lettre du 26/11 (visio, linge qui sèche)

**B1. La règle et l'erreur sont déjà dans un article gratuit.** Article `humour-en-visio-reunion-en-ligne`, publié le 02/11 (`docs/copy/articles-q4/S5-humour-en-visio.md`) :
- l. 43 : « N'attends pas le rire. Ceux qui rient le font souvent micro coupé […] Dis la chute, laisse passer un temps, reprends le fil de la réunion » ;
- l. 83 : « Le piège est de le combler » ;
- l. 148 : « n'en lance pas une deuxième pour réparer la première » ;
- l. 71 : le ressort 1 s'intitule « Vous m'entendez ? ».

La lettre dit la même chose : « Compte les micros ouverts », l'erreur « Combler le silence », et pour exemple « Vous m'entendez ? » ou « une deuxième vanne pour sauver la première », « Laisse passer une respiration, puis reprends ton sujet ». Retouches (les répliques restent les mêmes) :
- Pré-en-tête (l. 155) : « En visio, une seule voix passe à la fois : trois réponses, et comment choisir la tienne. »
- l. 166 : « Voici trois réponses, et la règle propre à la visio : presque personne n'y rit à voix haute. » devient « Voici trois réponses, et la règle propre à la visio : une seule voix passe à la fois. »
- Commentaire de la risquée (l. 178) : « Elle s'adresse à Romain : tu retournes la curiosité contre lui, et elle appelle une réponse. Romain doit ouvrir son micro devant tout le monde, avouer ce qu'il cache ou s'en sortir, pendant que la réunion attend. À deux ou trois, c'est un échange. À onze, c'est une minute où tout le monde vous regarde, et Romain ne l'a pas choisie. »
- « Comment choisir » (l. 181) : « Compte les réponses que ta phrase appelle. En visio, une seule voix passe à la fois : une réplique qui demande une réponse met toute la réunion en attente pendant que deux personnes se renvoient la balle. La sûre et la joueuse se ferment toutes seules, et la réunion reprend dans la seconde. La risquée pose une question : garde-la pour les visios à deux ou trois, quand une minute d'échange ne coûte rien à personne. À onze, la sûre. »
- « L'erreur que tout le monde fait » (l. 184) : « Couper ta caméra. Ta phrase est dite, puis ton carré devient noir le temps de pousser l'étendoir hors du cadre. Les onze ont vu le carré s'éteindre, et c'est ce noir qu'ils retiendront, pas ta réplique : il dit que la question t'a gêné. Le linge peut rester où il est jusqu'à la fin de la réunion. Il sèche, et toi, tu as répondu. »
- « À essayer cette semaine » (l. 187) : « À ta prochaine visio, regarde ce qu'on voit derrière toi avant de te connecter, et laisse-le en place. Écris ta sûre pour le prochain « Tu as quoi, derrière toi ? » (un étendoir, une pile de cartons, un chat sur l'étagère), dis-la une fois à voix haute, au volume d'une réunion, puis tais-toi : elle doit se terminer sans que personne ait à te répondre. »

**B2. Le nombre de personnes ne tombe pas juste.** « Onze carrés à l'écran » (l. 162), puis « Onze visages te regardent » (l. 166) et « chacun des onze » (l. 174). Avec ton propre carré, il ne resterait que dix visages. l. 162 : « Onze carrés à l'écran, tous les micros fermés » devient « Douze carrés à l'écran, le tien compris, tous les micros fermés ».

### Lettre du 10/12 (tisane)

**B1. L'étape liée contredit la leçon.** La lettre apprend à choisir la réplique « dont tu sais déjà écrire la suite » et à la reprendre « une fois pour lancer, une fois pour clore » : c'est la préparation et le rappel. Elle renvoie pourtant vers Répartie 4, « Improviser sur l'inattendu », dont le contenu est « Une vanne qui ne marche pas […] la seconde d'après […] reprendre la main » (`docs/content/parcours-seed.json:522`). Une autre étape colle exactement : Storytelling 6, « Un détail qui revient à la fin » (`parcours-etapes.ts:48`, contenu sur le rappel : `parcours-storytelling-s18.json:513`). Remplacer les lignes 235-236 par :
> Faire revenir une réplique une seule fois, au bon moment, c'est l'étape 6 du parcours Storytelling, « Un détail qui revient à la fin ».
> Aller à l'étape 6 : https://deviens-marrant.fr/parcours/storytelling?utm_source=lettre-premium&utm_medium=email&utm_content=2026-w50-etape6#etape-6

### Lettre du 24/12 (tonton, « Et tu feras quoi, plus tard ? »)

**B1. La scène est la question n°2 de l'article que le n°2 vient de recommander.** `S8-repas-de-famille.md:67-77`, « Et le boulot (ou les études), ça avance ? » : « Ton oncle […] te le redemande quand même chaque année ». La lettre met en scène un oncle qui « pose la question qu'il pose tous les ans » sur ton avenir, et le n°2 (03/12) envoie justement les lecteurs vers cet article. Il y a pire : l'article conseille comme sortie « Et toi, tu as fait quoi de beau cette année ? » (l. 77), alors que la lettre présente « Et toi, Gérard, tu as fait quoi de ta vie ? » comme l'erreur que tout le monde fait. Le lecteur des deux reçoit deux consignes qui se contredisent. Retouches (on change de question, la règle et la joueuse ne bougent pas) :
- l. 329 : « « Et tu feras quoi, plus tard ? » » devient « « Et ce permis, c'est pour cette année ? » »
- l. 334 (sûre) : « …le plat, la bûche, puis mon avenir. » devient « …le plat, la bûche, puis le permis. »
- l. 349 (erreur) : « « Et toi, Gérard, tu as fait quoi de ta vie ? » » devient « « Et toi, Gérard, tu l'as eu à combien de tentatives, le tien ? » » (la suite, « la famille en sait trop sur trop de monde », reste vraie).
- l. 352 : « tes études, ton couple, ton travail, tes projets » devient « ton permis, ton appartement, tes vacances, ta coupe de cheveux » (aucune des six questions de l'article).
- l. 354-355 (l'étape Boulot 5 parlait du métier, elle ne tient plus) : « Répondre à la même question chaque année sans t'agacer, c'est l'étape 3 du parcours Répartie, « Retourner les piques avec le sourire ». » + « Aller à l'étape 3 : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre-premium&utm_medium=email&utm_content=2026-w52-etape3#etape-3 »

(La question « permis » est une proposition, à valider par Thomas. Les trois répliques doivent être revotées avec la nouvelle question.)

### N°3 (07/01, résolutions)

**B1. L'erreur ne correspond pas à son exemple, et l'intro emploie la même formule dans un autre sens.** L'erreur s'appelle « Poser la question, puis y répondre à sa place » (l. 177), mais l'exemple, « Moi, de toute façon, je ne prends jamais de résolutions, c'est nul », ne répond pas à la question posée (« un créneau pour le jour où tu abandonnes ») : il répond à celle d'Axel sur tes résolutions. Or c'est précisément la question qu'on t'a posée. Quant à l'intro (l. 159), son « Au lieu de répondre à sa place » ne veut rien dire et brouille l'erreur avant qu'elle arrive.
- l. 159 : « Au lieu de répondre à sa place, voici trois réponses qui renvoient la balle » devient « Plutôt que d'avouer le vide, voici trois réponses qui lui renvoient la balle ».
- l. 177 : « « Tu as prévu un créneau pour le jour où tu abandonnes ? Moi, de toute façon, je ne prends jamais de résolutions, c'est nul. » Axel n'a pas eu le temps de respirer, et ta question est devenue un prétexte pour parler de toi. » devient « « Tu as prévu un créneau pour le jour où tu abandonnes ? Non, bien sûr, personne ne prévoit ça. » Axel n'a pas eu le temps de respirer : tu as répondu à sa place, et ta question est devenue un monologue. »

### N°5 (04/03, fête où tu ne connais que l'hôte)

**B1. Le commentaire de la sûre contredit la règle de la lettre.** On lit « Elle ne demande rien, elle donne un point d'entrée » (l. 281), sur une réplique qui est une question. Deux paragraphes plus loin, la règle juge chaque phrase « à ce qu'elle demande à l'autre » et dit que « la sûre se répond en un mot » (l. 292). l. 281 : « Elle ne demande rien, elle donne un point d'entrée. » devient « Elle ne demande presque rien, elle donne un point d'entrée. »

### N°6 (01/04, canular)

**B1. Le nombre de personnes est faux.** « tu annules ton rendez-vous de vendredi, tu préviens ton collègue […] il faut démentir chez trois personnes » (l. 355) : la phrase n'en cite que deux. « chez trois personnes » devient « chez deux personnes ».

**B2. Le titre de l'article est inexact.** La lettre cite « Blague poisson d'avril pour adultes » (l. 360), alors que le titre est « Blague poisson d'avril pour adultes : 15 idées inoffensives » (`A5-blagues-poisson-d-avril-adultes.md:10`). Les autres lettres citent les titres en entier. l. 360 : « notre article « Blague poisson d'avril pour adultes » réunit des idées de canulars classées par terrain. Aucune n'est dangereuse ni humiliante » devient « notre article « Blague poisson d'avril pour adultes : 15 idées inoffensives » réunit quinze canulars classés par terrain. Aucun n'est dangereux ni humiliant ». Reconfirmer le titre en base avant l'envoi (article programmé le 25/02/2027).

---

## Mineurs (3 au plus par lettre, aucun ne bloque)

| Lettre | Mineurs |
|---|---|
| N°2 | (1) La joueuse et la risquée ont la même condition (« sait rire de ses propres élans de générosité » l. 107, « rit de ses propres élans » l. 111) : pour la risquée, mettre « Elle ne marche qu'avec une tante qui te chambre déjà, et depuis longtemps. » (2) Le lien vers Confiance 4 (« être à l'aise en groupe ») tient à peine pour une scène de cadeau. (3) Les tics de corpus « Voici trois réponses, de la plus prudente (la sûre)… » et « Celle-ci vise » (voir plus bas). |
| N°3 | (1) La règle cite « et si », qu'aucune réplique n'emploie (l. 174). (2) Le pont vers l'étape (« il faut d'abord regarder avant de parler ») est forcé pour une lettre sur les questions. (3) « Celle-ci vise Axel », tic. |
| N°4 | (1) Joueuse : le moule « Bonne nouvelle… Mauvaise nouvelle… » est usé et « avec les retraités » frôle le cliché sur l'âge (contraire au « jamais condescendant »). C'est la réplique la plus faible de la lettre : la soumettre seule au vote, avec son repli (« on dînera au goûter »). (2) « Celle-ci plaisante tout de suite », tic. |
| N°5 | (1) « près de la fenêtre » désigne d'abord le groupe à éviter (l. 295), puis la personne seule à choisir : remplacer la seconde par « devant le buffet ou dans l'entrée ». (2) L'étape Machine à Café 2 appartient à un parcours de bureau (« si tu bosses en équipe »), alors que Confiance 4 nomme la scène exacte : « les soirées où tu ne connais que la personne qui invite » (`parcours-seed.json:869`). (3) « pour le buffet » ici, « Le buffet m'a retenu » le 31/12. |
| N°6 | (1) La sûre est purement pratique : c'est la seule sûre du corpus sans le moindre sourire. À voter. (2) Répartie 4 apprend à rattraper une vanne ratée (`parcours-seed.json:522`) ; Storytelling 4, « Une chute qui se lit de deux façons », colle mieux à la règle « que devient ma phrase si c'est vrai, et si c'est faux ». (3) « le café coule » figure déjà dans la scène du n°2. |
| 12/11 | (1) La narration (« dix minutes prévues, quatre utilisées », l. 46) dit mot pour mot la réplique joueuse avant elle et lui vole sa chute : écrire « tu as tenu quatre minutes sur les dix prévues ». (2) « tu gagnes deux secondes » (l. 68) : on ne voit pas sur quoi. |
| 19/11 | (1) La lettre annonce « pas de réplique prête à l'emploi » (l. 94), puis en donne deux. Écrire « pas de réplique à apprendre par cœur ». (2) « sans le mot de tête » (l. 119) est obscur : « sans le « Bref. » du début ». |
| 26/11 | (1) Boulot 1, « La salle de réunion, sans un mot », pour une réplique parlée : le lien tient mal. (2) Une fois B1 appliqué, retirer de la note de rédaction « la règle porte sur le silence propre à la visio ». |
| 10/12 | (1) « Vas-y, je commence » sonne mal dans la bouche d'Inès : « D'accord, je commence ». (2) Le décor (premier rendez-vous, dans un bar, juste après la commande) est celui de la fiche « Le silence du premier verre » (`carnet/2026-11.json:357-365`), dix jours plus tôt. La pique est différente, donc pas de bloquant, mais un mot de décor changé suffirait (« un bar à jeux », « un comptoir de concert »). (3) L'article `etre-drole-sans-alcool-soiree` (21/12) traite « tu bois pas ? » : vérifier à sa publication qu'il ne reprend aucune réplique de la lettre. |
| 17/12 | (1) « le café est passé » (l. 254), puis « je surveille la bouilloire » : c'est une bouilloire pour quoi ? Écrire « le thé infuse » ou « le café coule encore ». (2) Le second couplet (7 et 9 syllabes) frôle le test que la lettre du 24/12 donne (« si le second vers est nettement plus long »). |
| 24/12 | (1) La joueuse (« La même que l'an dernier ») et la risquée (« tous les ans ») reposent toutes les deux sur le rituel annuel. |
| 31/12 | (1) L'exercice demande « cinq mots » (l. 398), alors que la règle dit quatre mots dans le vacarme et sept ou huit dans le brouhaha : écrire « quatre mots ». (2) L'erreur « la trouver trop tard » fait écho au n°1, qui garde « Une sûre dite tout de suite vaut mieux qu'une risquée dite trop tard » (`n1-candidates-s22.md:51`, contrairement à ce que croit la note l. 13 des réservées), et à l'article `rester-muet-en-groupe` (« ta réplique arrive 20 minutes trop tard »). Le remède (annoncer le retard) est neuf, donc acceptable. (3) « buffet », voir le n°5. |

---

## Contrôles point par point

### 1. Valeur ajoutée par rapport au site
J'ai lu `joke-decryptages.json` (Grep sur les motifs de chaque scène), `carnet/2026-10.json` et `carnet/2026-11.json` en entier, `video-content-s20.json` (Grep Bref, Khojandi, Palmashow, rime), les fiches des articles Q4 (`docs/copy/articles-q4/`) et les contenus des parcours. Ce qui ressemble à du déjà-vu : 19/11 (carnet 2026-10-03 et Storytelling 3), 26/11 (article S5), 24/12 (article S8 Q2). Le reste est neuf : n°2 (aucun cadeau fait main dans les données), n°3 (les vannes sur les résolutions aux l. 126, 546, 971, 1061 et la « vantardise reçue comme un aveu » l. 1533 sont d'autres ressorts), n°4, n°5 (l. 1287 « Je connaissais que l'hôte » est une autre blague), n°6, 12/11, 10/12, 17/12 (aucune technique de rime sur le site : Grep « rime » à 0), 31/12.

### 2. Articles liés (lettres du mois)
Aucun des cinq slugs n'est dans `blog-articles.ts` : ce sont des articles en base, vérifiés par leur fiche et par `REPLIT_ACTIONS.md`.

| N° | Slug | Publication | Antérieure à l'envoi | Ce que la lettre en dit |
|---|---|---|---|---|
| 2 | `repas-de-famille-questions-genantes-humour` | 23/11/2026 (`S8…md:15`, calendrier l. 61) | oui (03/12) | exact : 6 questions, « Alors, t'as quelqu'un ? » en premier, un « Si ça insiste » pour chacune (l. 55-123) |
| 3 | `resolution-nouvelle-annee-etre-plus-drole` | 28/12/2026 (`S13…md:15`) | oui (07/01) | exact : titre, « petit, daté, suivi », grille de quatre semaines, « mi-janvier » (l. 12, 32) |
| 4 | `blagues-de-couple-drole` | 05/11/2026 (`A4…md:28`, `REPLIT_ACTIONS.md:764`) | oui | exact : titre, classement par moment, du canapé aux messages (l. 24-25) |
| 5 | `se-presenter-avec-humour` | 12/10/2026, en base (`REPLIT_ACTIONS.md:1015`) | oui | exact : formule en trois temps (l. 30, 46) |
| 6 | `blagues-poisson-d-avril-adultes` | 25/02/2027 (`A5…md:15`) | oui | titre tronqué (B2) ; pour le reste, exact (classement par terrain, interdits, FAQ « Que faire si la personne le prend mal ? ») |

Seul l'article S2 est confirmé en ligne. Les quatre autres sont programmés : relancer `controlerDatesPlancher` après publication, comme le prévoit le fichier.

### 3. Étapes liées (`parcours-etapes.ts`)
Elles existent toutes. Deux ne collent pas au sujet : 10/12 (B1) et 24/12 (le métier, qui n'est plus le sujet une fois B1 appliqué). Quatre tiennent faiblement (mineurs) : n°2, n°5, n°6, 26/11. Les autres collent : n°3 (forcé), n°4, 12/11, 19/11, 17/12, 31/12.

### 4. Lettres de décryptage
- **Bref (19/11)** : rien n'est cité entre guillemets en dehors d'un titre d'épisode et des mots « Je » et « bref ». Les faits sont dans F1 à F9, sauf la généralisation « chaque épisode » (B3). J'ai vérifié par recherche web que les titres de la saison 1 sont bien à la première personne (« J'ai dragué cette fille », « Je remets tout à demain », « Mes parents divorcent »…). Je n'ai trouvé aucun titre en « Y'a ».
- **Palmashow (17/12)** : rien n'est cité. Les faits sont dans P1 à P7. « Un métier précis, moniteur de ski, raconté en rap » est appuyé par Le Tribunal du Net (le clip « met en scène les moniteurs de ski et leur univers »). Rien ne dépasse les faits relevés.

### 5. Cohérence et saison
Vérifié dans le calendrier 2026-2027 : 13/02/2027 et 06/03/2027 sont des samedis, le 01/04/2027 est un jeudi, et 2027 compte 365 jours (« les 364 autres » est juste). Les comptes de personnes sont justes au n°1, au 24/12 (14 à table, 13 têtes) et au 12/11. Ils sont faux au 26/11 et au n°6 (B2 et B1). Les saisons tombent juste à la date d'envoi pour les 11 lettres (le n°2 prépare Noël au 03/12, comme le plan le prévoit).

### 6. Redites dans le corpus (n°1 compris)
- **Ressort, règle ou erreur** : la seule vraie redite est la risquée et le commentaire de la joueuse du 12/11 face au n°1 (B1 et B2). Les règles de choix et les erreurs sont toutes différentes une fois B1 du 26/11 appliqué (« couper ta caméra » est neuve). La risquée qui retourne « l'habitude de l'autre » reste au n°1 et au 24/12 (« tous les ans ») : deux mois d'écart, ce qui est acceptable.
- **Tics de formule** (mineur de corpus, mais c'est l'« entrée lente » que Thomas a relevée) : « Voici trois réponses, de la plus prudente (la sûre) à la plus audacieuse (la risquée), la joueuse entre les deux » se lit dans 5 lettres du mois sur 5 (n°2 à n°6), alors que les réservées ont varié la leur ; « Celle-ci vise » dans 4 (n°2, 3, 5, 6) ; « Au moindre doute » dans 6 lettres ; « Elle ne marche que si / qu'avec » dans 8 ; une consigne de visage impassible sur la joueuse dans 5 ; l'exercice « écris une sûre, une joueuse, une risquée » dans 4 (n°1, n°2, 10/12, 24/12). Recommandation : couper la phrase d'annonce dans les n°2 à 6 (les intertitres font déjà le travail), puis varier les deux autres formules.

### 7. Forme
- Objets recomptés à la main : 42, 39, 34, 36, 40 (n°2 à 6) ; 40, 38, 41, 35, 41, 38, 37 (réservées). Tous sont à 45 ou moins.
- Tirets cadratin et demi-cadratin : Grep sur les deux fichiers, 0.
- Rien de commercial hors de l'encart (aucun €, aucun `/abonnement` hors de `[[invitation-premium]]`).
- utm présents sur les 15 liens des lettres du mois (article, étape, premium) et sur les 7 liens d'étape des réservées. Les nouveaux liens proposés (`2026-w50-etape6`, `2026-w52-etape3`) suivent le même schéma.

## Ce que je n'ai pas vérifié
- La publication réelle en base des articles S8, S13, A4 et A5 (seul S2 est confirmé en ligne) et leur titre final.
- Les ancres `#etape-6` de Storytelling et `#etape-3` de Répartie dans le rendu : le schéma est celui des autres liens.
- Les retouches qui créent des répliques ou des exemples (12/11 risquée, 19/11 exemple 2, 24/12 question et erreur) n'ont été relues que par moi : elles passent la relecture à l'aveugle avant envoi.

## Sources web consultées
- [Toramp, liste des épisodes de Bref](https://www.toramp.com/shows/2297/)
- [Allociné, saison 1 de Bref](https://www.allocine.fr/series/ficheserie-1000000468/saison-1000000981/)
- [Le Tribunal du Net, « Les monos de ski »](https://www.letribunaldunet.fr/actualites/les-monos-de-ski-la-chanson-de-lhiver-par-le-palmashow.html)

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-11-lettres-s22-editeur.md`
- Décisions : GO pour n°2, n°4, 17/12 et 31/12. NO-GO pour n°3, n°5, n°6 et 10/12, avec des retouches mécaniques sans revote (n°3 : une simple relecture suffit). NO-GO pour 12/11, 19/11, 26/11 et 24/12, avec une retouche puis une nouvelle relecture à l'aveugle (règle d'or s18).
- Points d'attention : @copywriter applique les retouches des deux fichiers ; Thomas tranche la question « permis » du 24/12 ; la note l. 13 des réservées croit à tort que « dite trop tard » a disparu du n°1 ; il faut couper la phrase d'annonce répétée dans les n°2 à 6.
---
