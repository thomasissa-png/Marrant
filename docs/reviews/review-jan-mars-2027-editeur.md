# Relecture à l'aveugle, regard d'éditeur : lettres réservées Premium, janvier à mars 2027

Fichier relu : `docs/copy/lettres-reservees-jan-mars-2027.md` (9 lettres, 14/01 au 25/03/2027). Barre : 9/10 par lettre.
Corpus comparé : `docs/copy/lettres-du-mois-s22.md` (07/01, 04/02, 04/03, 01/04), `docs/copy/lettres-reservees-nov-dec-s22.md` (W46 à W53 et annexe), `docs/copy/n1-candidates-s22.md` bloc (a), `apps/web/src/data/carnet/*.json`, `joke-decryptages.json`, `video-content-s20.json`, `blog-article-rewrites.json`, `docs/content/parcours-*.json`, `apps/web/src/lib/blog-articles.ts`, `docs/copy/articles-q4/`, `apps/web/src/config/parcours-etapes.ts`.
Non rouvert (consigne) : signature « L'Équipe Deviens Marrant », liens d'étape sans mention « réservée aux abonnés ».

## Résumé exécutif

Une seule lettre passe la barre telle quelle (18/03). Les huit autres ont chacune un ou deux défauts que Thomas a déjà dû relever lui-même par le passé : une réplique qui ne se comprend qu'avec son mode d'emploi (14/01, 18/02), une redite de ressort avec une lettre qu'il a déjà lue (14/01, 28/01, 11/03), une règle de choix qui ne colle pas à la scène (11/02, 25/02, 21/01), une situation que le carnet du site donne déjà (25/03), un lien d'étape sans rapport avec la leçon (11/03, 25/03), un fait mal posé (11/02 : le match est Angleterre-France, à Twickenham). Toutes les corrections sont locales (une réplique, un paragraphe, un lien) et données mot pour mot ci-dessous. Après retouche, chaque lettre repasse la relecture à l'aveugle (règle d'or P0 s18).

Faits datés vérifiés (WebSearch, 25/10/2026) : Épiphanie le dimanche 03/01/2027 et vendredi 15/01 exacts ; Chandeleur le mardi 02/02/2027 (01/01/2027 est un vendredi) ; Angleterre-France le dimanche 14/02/2027 à l'Allianz Stadium de Twickenham, coup d'envoi 15 h 10 heure britannique (16 h 10 à Paris, donc « dimanche après-midi » exact) ; Pâques le dimanche 28/03/2027 et passage à l'heure d'été la même nuit (2 h devient 3 h). Semaines ISO W02 à W12 justes pour les neuf jeudis.

Forme, contrôlée sur le fichier : 0 tiret cadratin ou demi-cadratin, 0 prix, 0 offre, 0 lien `/abonnement` ; 9 liens d'étape avec `utm_source=lettre-premium&utm_medium=email&utm_content=2027-wNN-etapeN` ; 9 objets entre 31 et 40 caractères (recomptés) ; les 9 étapes citées existent avec leur titre exact dans `parcours-etapes.ts`.

## Tableau des notes

| Lettre | Note actuelle | Verdict | Bloquants | Note après retouches |
|---|---|---|---|---|
| 14/01 galette (A, boulot) | 7/10 | NO-GO | 2 (risquée à mode d'emploi ; joueuse calquée sur W46) | 9/10 |
| 21/01 Frayssinet (B, études) | 8/10 | NO-GO | 2 (un fait hors du bloc vérifié ; geste 3 impossible en visio) | 9/10 |
| 28/01 Chandeleur (A, amis) | 8/10 | NO-GO | 1 (joueuse calquée sur la risquée du 07/01) | 9/10 |
| 11/02 Tournoi (A, amis) | 7/10 | NO-GO | 2 (règle du temps mort inapplicable à la scène ; « France-Angleterre ») | 9/10 |
| 18/02 partiels (A, études) | 8/10 | NO-GO | 1 (joueuse et risquée incomplètes, le chiffre est dans le commentaire) | 9/10 |
| 25/02 voisine (A, voisinage) | 7/10 | NO-GO | 1 (la sûre contredit l'erreur du 04/02 et l'erreur de la lettre elle-même) | 9/10 |
| 11/03 entretien (A, boulot) | 7/10 | NO-GO | 2 (joueuse calquée sur W46 et 14/01 ; étape Boulot 4 hors sujet) | 9/10 |
| 18/03 train (A, inconnus) | 9/10 | GO | 0 (mineurs recommandés) | 9/10 |
| 25/03 Pâques (A, famille) | 6/10 | NO-GO | 2 (prémisse du carnet « Le lundi de 9 h 40 » plus montre à justifier ; étape Confiance 1 hors sujet) | 9/10 |

## Bloquants, avec retouche mot pour mot

### 14/01 : galette au bureau

**B1. La risquée demande un mode d'emploi, et la lettre elle-même la déconseille dans la scène.** « Nathalie, c'est vous qui avez coupé les parts. Ça s'appelle une promotion interne. » ne se comprend qu'avec le commentaire (« tu laisses entendre qu'elle a glissé la fève dans ta part »), puis la règle conclut « La risquée non […] Garde-la pour le couloir ». Le lecteur reçoit deux répliques utilisables sur trois, et la troisième est exactement le défaut relevé par Thomas (réplique qui demande un mode d'emploi). La note de l'auteur l'assume (« sauf la risquée du 14/01 ») : ce n'est pas une excuse. On garde l'idée comme contre-exemple de la règle, et on écrit une risquée qui passe le test.

Remplacer la risquée et son commentaire (l. 29-30) par :
> « Nathalie, merci. Pour fêter ça, je vous laisse mes mails de l'après-midi. »
> Celle-ci vise Nathalie : le jour où tu as la fève, c'est ta responsable qui hérite de ton travail. Tu inverses la hiérarchie devant tout l'open space, et c'est là qu'est le risque. Elle ne marche que si Nathalie rit volontiers d'elle-même et que tu as déjà plaisanté avec elle devant l'équipe. Dans une équipe où l'on ne plaisante pas avec la hiérarchie, garde-la pour toi.

Remplacer le paragraphe « Comment choisir » (l. 33) par :
> Dans une pièce de vingt personnes, la moitié n'a pas entendu la question, et ceux du fond n'entendront que ta phrase. Avant de la dire, imagine quelqu'un qui arrive au milieu : est-ce qu'il la comprend seule, sans la question de Nathalie ? Les trois réponses passent ce test. Une phrase sur qui a coupé les parts ou sur la place de la fève ne le passerait pas : drôle pour trois personnes, obscure pour les dix-sept autres. Une fois le test passé, choisis selon ce que la salle sait de toi : la sûre si tu es nouveau, la joueuse si on a déjà ri de toi, la risquée si Nathalie a déjà ri d'elle-même devant l'équipe. Au moindre doute, la sûre.

Remplacer dans l'intro (l. 18) « et le test qui sépare celles qui voyagent de celle qui reste à ton bureau. » par « et le test que toute phrase doit passer pour arriver jusqu'au fond de la salle. »
Remplacer le pré-en-tête par : « Une galette au bureau, trois réponses, et le test qui dit si ta phrase arrivera jusqu'au fond de la salle. »

**B2. La joueuse reprend le squelette de la joueuse de W46.** W46 (12/11) : « Dix minutes prévues, quatre utilisées. Je rends la monnaie. » 14/01 : « Objectif de l'année : trouver la fève. Atteint dès janvier. Je rentre chez moi. » Même mécanique en trois temps (prévu, réalisé, conclusion absurde à la première personne), même consigne de voix (« d'une voix égale » / « ton de reporting, sans sourire »). Un abonné lit les deux à neuf semaines d'écart. La joueuse du 11/03 repart sur le même moule (voir plus bas) : trois fois en quatre mois.

Remplacer la joueuse et son commentaire (l. 25-26) par :
> « J'ai utilisé toute ma chance de l'année. Je ne joue pas au loto avant 2028. »
> Tu traites la chance comme un stock : une fève, et la réserve de 2027 est vide dès janvier. Quelqu'un qui arrive au milieu comprend tout de suite, la couronne sur ta tête suffit. Dis-la avec une résignation sincère, et laisse « avant 2028 » tomber seul. À sortir quand l'équipe a déjà ri d'une de tes phrases.

(Grep `chance de l'année|loto|mes mails` dans `apps/web/src/data` et le corpus : une seule occurrence, sans rapport, `joke-decryptages.json` l. 819, « On a acheté un ticket de loto à deux ». Aucune des deux ne touche au thème « roi » ni ne promeut un objet à un statut officiel.)

### 21/01 : Roman Frayssinet dans Clique

**B1. Un fait au-delà du bloc vérifié.** « Le passage » écrit « les grésillements cessent ». Le bloc de vérification de l'orchestrateur (pages ouvertes) ne cite aucune phrase qui le dise : Univers Freebox donne seulement « il a pu terminer sa chronique avec le micro du début ». La phrase « Les grésillements se sont interrompus » n'existe que dans les extraits WebSearch non ouverts des notes (et dans la synthèse WebSearch que j'ai relancée, qui paraphrase la même source sans la citer). Consigne : rien au-delà des faits vérifiés.

Remplacer (l. 72) « Il reprend sa chronique, et Mouloud Achour finit par lui reprendre le micro des mains : les grésillements cessent et Roman Frayssinet termine sa chronique. » par « Il reprend sa chronique, Mouloud Achour finit par lui reprendre le micro des mains, et Roman Frayssinet termine sa chronique. »

**B2. Le geste 3 est impossible dans la scène de la lettre.** La scène est un oral en visio, seul devant ta caméra : personne ne peut « régler » ton micro à ta place. « Laisse quelqu'un régler » vient de Clique (une personne de l'équipe apporte un micro), pas de ton salon. Le lecteur appliquera la méthode à la lettre et attendra.

Remplacer (l. 82) « 3. Laisse quelqu'un régler, puis reprends au mot où tu t'étais arrêté. » par « 3. Règle le problème (ou laisse quelqu'un le régler, si tu es dans une salle), puis reprends au mot où tu t'étais arrêté. »

Contrôles passés : aucune citation entre guillemets de l'humoriste (la question « C'est un show de mime ? » est reformulée, jamais citée) ; ordre des faits conforme au bloc vérifié ; aucune fiche vidéo ni vanne sur cet incident (Grep `Clique|Achour|mime|grésill`). Technique voisine de Répartie é4 (`parcours-seed.json` l. 590 : « tu constates ce qui t'arrive, sur le ton de la vanne ») : c'est l'étape liée, donc un prolongement, pas un doublon ; la lettre apporte le cas réel et la reprise « au mot près ».

### 28/01 : Chandeleur

**B1. La joueuse reprend la risquée de la lettre du mois du 07/01.** 07/01 : « On se reparle de tout ça en février ? Je note la date. » (renvoyer à une date future, comme un rendez-vous de bilan). 28/01 : « Elle prend de la hauteur. On en reparle à la prochaine Chandeleur. », commentée « tu remets la discussion à l'année prochaine, comme un dossier ». Même ressort, même formule « on (se) reparle », trois semaines d'écart, même lecteur.

Remplacer la joueuse et son commentaire (l. 139-140) par :
> « Elle prend de la hauteur. Elle a toujours visé plus haut que moi. »
> Tu fais deux choses dans la même phrase : « prendre de la hauteur » se dit d'une personne qui prend du recul, et ta crêpe le fait au sens propre ; puis tu lui prêtes une ambition que tu n'as jamais eue, toi qui restes en bas avec ta poêle. Dis-la en regardant la hotte, avec l'admiration d'un parent un peu jaloux, pas en regardant la salle. À sortir quand les rires ont déjà commencé.

### 11/02 : match du Tournoi

**B1. La règle « le temps mort » ne peut pas s'appliquer à la scène.** Maxime pose sa question au coup de sifflet, donc pendant un arrêt de jeu, et il attend la réponse maintenant. Or la règle dit « La risquée attend la mi-temps » : répondre vingt minutes plus tard à « Tu as compris pourquoi il a sifflé, là ? » n'est plus une réplique. La règle choisit le moment d'une phrase que la scène ne laisse pas choisir. Le vrai critère est déjà dans les commentaires (« le score te le dira », « si le score est confortable », « à dix minutes de la fin d'un match serré ») : c'est lui qui doit devenir la règle.

Remplacer le paragraphe « Comment choisir : le temps mort » (l. 194-195) par :
> Comment choisir : le score
> Avant de répondre, jette un œil au score en haut de l'écran : il te dit dans quel état est Maxime. La France mène largement : il est d'humeur à rire de lui-même, la risquée devient possible. Le match est serré : il a la tête au jeu, prends la joueuse, qui le flatte sans le distraire. La France est menée : la sûre, et rien d'autre, car la faute de l'arbitre est alors la seule chose que la pièce a envie d'entendre. Et quelle que soit la phrase, dis-la tout de suite, pendant l'arrêt de jeu : dès que le ballon repart, plus personne ne t'écoute.

Remplacer dans l'intro (l. 180) « et le moment où chacune se dit. » par « et ce que le score te dit avant de choisir. »
Remplacer le pré-en-tête par : « Un match du Tournoi chez un ami, trois réponses quand on te teste sur le règlement, et le score qui décide laquelle dire. »

**B2. Le match s'appelle Angleterre-France.** Il se joue à Twickenham (Allianz Stadium), l'Angleterre reçoit : dans la presse française comme dans la bouche d'un fan comme Maxime, c'est « Angleterre-France ». Date confirmée : dimanche 14/02/2027, 15 h 10 heure britannique (Planet Rugby, Rugby World, Irish Rugby, RugbyPass).

Remplacer (l. 176) « des chips et France-Angleterre à la télé » par « des chips et Angleterre-France à la télé ».

### 18/02 : les partiels

**B1. La joueuse et la risquée sont incomplètes : le chiffre, qui fait tenir la réplique, est rangé dans le commentaire.** Joueuse : la phrase entre guillemets s'arrête sur « par respect pour le 16 de Chloé », puis le commentaire ajoute « Puis tu le donnes : « 9, de toute façon. » Sans cette seconde phrase, la joueuse devient une esquive ». Risquée : « si tu donnes ton chiffre juste après ». La règle de la lettre est « Donne-le donc toujours » : deux répliques sur trois ne le font pas telles qu'écrites. C'est le défaut « réplique avec mode d'emploi ». Le chiffre doit être dans la réplique.

Remplacer la joueuse et son commentaire (l. 238-239) par :
> « Je préfère ne pas le dire, par respect pour le 16 de Chloé. Bon : 9. »
> Tu retardes le chiffre le temps d'un rire, en faisant de ta discrétion une politesse envers Chloé, puis tu le lâches dans la même phrase. Le « Bon : 9 » est la moitié de la réplique : sans lui, la joueuse devient une esquive et la table redemande. À sortir quand la table a déjà plaisanté sur les notes de chacun.

Remplacer la risquée et son commentaire (l. 242-243) par :
> « Tu me gardais pour la fin, Antoine ? Comme le dessert ? 9. »
> Celle-ci vise Antoine : tu nommes la mise en scène (tu es le dernier, il t'a laissé pour la fin), tu le fais passer pour quelqu'un qui savoure, et tu sers ton chiffre comme on sert le dessert. Elle ne marche que si Antoine sait se faire chambrer. S'il voulait vraiment te mettre mal à l'aise, elle prolonge la scène qu'il a montée.

### 25/02 : la voisine du dessous

**B1. La sûre contredit l'erreur de la lettre du mois du 04/02 et l'erreur de la lettre elle-même.** Sûre : « À partir de quelle heure préférez-vous que ça s'arrête ? », commentée « tu lui laisses la décision ». Trois semaines plus tôt, le même abonné a lu, à propos d'une bourde : « L'erreur que tout le monde fait : Renvoyer la décision […] La bourde est à toi, la solution aussi. Arrive avec une seule proposition ». Et la lettre du 25/02 elle-même conclut son erreur par « Engage-toi sur une heure ou sur un geste », puis fait écrire « la phrase qui t'engage sur une heure ». La sûre est la seule des trois qui ne suit pas le conseil de sa propre lettre, et une voisine fâchée qui répond « 22 h » te met dans l'erreur « promettre trop ».

Remplacer la sûre et son commentaire (l. 285-286) par :
> « Oui, c'était moi. La prochaine fois, après minuit, c'est casque. »
> Tu reconnais, puis tu t'engages sur une heure et un geste, rien de plus : c'est petit, précis, et tu peux le tenir. Tu ne te défends pas et tu ne lui demandes rien : Mme Roussel repart avec une solution, pas avec un problème à régler. À choisir quand seule sa bouche sourit, ou quand tu la connais à peine.

Remplacer la fin de l'erreur (l. 300) « Engage-toi sur une heure ou sur un geste (« après minuit, c'est casque »), jamais sur un monde sans bruit. » par « Engage-toi sur une heure ou sur un geste, comme la sûre, jamais sur un monde sans bruit. »
Remplacer dans l'exercice (l. 303) « du genre « après minuit, casque » » par « sur le modèle de la sûre ».

### 11/03 : entretien annuel

**B1. La joueuse est la troisième occurrence du même moule en quatre mois.** « La prise de parole en réunion. Trois mots l'an dernier, quatre cette année. Je ne brûle pas les étapes. », commentée « Tu suis ton progrès comme un indicateur de performance » et « Dis-la sans sourire, comme un point d'étape ». Même squelette chiffré (avant, maintenant, conclusion) que W46 « Dix minutes prévues, quatre utilisées » et que la joueuse du 14/01, même consigne de voix, même terrain (boulot) que le 14/01 huit semaines plus tôt. C'est aussi la réplique la plus longue du lot (19 mots).

Remplacer la joueuse et son commentaire (l. 337-338) par :
> « Être plus concis. Je t'explique pourquoi, ça prendra une petite demi-heure. »
> Tu donnes un vrai axe, puis tu le démontres en direct : celui qui veut être plus concis annonce une demi-heure d'explication. Le rire vient de la contradiction, et Julie garde un vrai sujet pour sa case. Dis la seconde phrase en commençant à t'installer dans ta chaise, comme si tu allais vraiment parler trente minutes, puis arrête-toi. À sortir quand Julie a déjà plaisanté avec toi, ou quand l'entretien est détendu.

Remplacer dans « Comment choisir » (l. 345) « La joueuse devient « prise de parole en réunion » : un vrai axe, avec un sourire en prime. » par « La joueuse devient « être plus concis » : un vrai axe, avec un sourire en prime. »
(« Être concis » n'est pas un faux défaut au sens de la lettre : ce n'est pas une qualité déguisée. Grep `concis|demi-heure` : aucune réplique voisine ; seules occurrences, deux techniques d'écriture de `video-content-s20.json` (l. 1182, 1296) et des « demi-heure » de narration dans le n°1 et le 01/04.)

**B2. L'étape Boulot 4 ne prolonge pas la leçon.** « L'afterwork : ta semaine en trente secondes » apprend à raconter une histoire de la semaine qui monte d'un cran à chaque phrase (`parcours-boulot-s19.json` l. 532-582) ; la lettre apprend qu'une touche d'humour au travail finit par l'écrit (« la case du formulaire »). Le pont « Résumer une période en trente secondes » est fabriqué. L'étape qui porte exactement cette leçon est Boulot é2, « Un PS drôle, sans finir en capture d'écran » (l'humour pro qui survit à l'écrit), jamais citée dans le corpus des lettres. Les notes de l'auteur relèvent d'ailleurs la proximité avec cette étape.

Remplacer les lignes 353-354 par :
> Une touche d'humour qui survit à l'écrit, c'est l'étape 2 du parcours Boulot, « Un PS drôle, sans finir en capture d'écran ».
> Aller à l'étape 2 : https://deviens-marrant.fr/parcours/boulot?utm_source=lettre-premium&utm_medium=email&utm_content=2027-w10-etape2#etape-2

### 18/03 : le train

Aucun bloquant. Ressorts neufs (page figée, détective du wagon, renversement de l'observateur), règle neuve et propre à la scène (le nombre de gares), erreur neuve (la porte claquée). Proximité de contexte avec la lettre du mois du 04/03 (inconnus, deux semaines plus tôt) : acceptable, car la leçon est inverse (refermer, pas ouvrir) ; deux retouches de forme recommandées en mineurs.

### 25/03 : Pâques

**B1. La prémisse est celle d'une fiche du carnet, et elle demande un mode d'emploi.** `apps/web/src/data/carnet/2026-11.json` l. 211-221, « Le lundi de 9 h 40 » : en retard à cause du changement d'heure, quelqu'un te le fait remarquer (« Tu es encore à l'heure d'été, toi ? »), et la réponse de repli est « je rattrape ça dans la matinée ». La lettre : en retard à cause du changement d'heure, quelqu'un te le fait remarquer (« Midi, c'était il y a une heure, tu sais ? »), et la sûre est « Je vais la rattraper au dessert ». Le carnet est un contenu Premium : l'abonné qui l'a ouvert en novembre reconnaît la situation et le geste. S'y ajoute la justification que la scène doit fournir pour tenir debout (« Ton téléphone s'est mis à l'heure tout seul, ta montre non : c'est celle de ton grand-père, tu t'es fié à elle ») : à vingt ans, on lit l'heure sur son téléphone, et il faut deux propositions pour expliquer pourquoi pas. L'auteur avait proposé le repli (retard dû au train) : c'est le bon. Pâques reste la scène ; l'heure d'été reste dans la lettre, comme rappel pratique exact (nuit du 27 au 28/03, 2 h devient 3 h).

Remplacer les deux premières phrases de la scène (l. 431) « Dimanche de Pâques, 13 h 05. Cette nuit, les pendules ont avancé d'une heure. Ton téléphone s'est mis à l'heure tout seul, ta montre non : c'est celle de ton grand-père, tu t'es fié à elle, et tu sonnes chez tes parents en croyant qu'il est 12 h 05. » par « Dimanche de Pâques, 13 h 05. Le déjeuner était à midi, ton train s'est arrêté cinquante minutes en rase campagne, et tu sonnes enfin chez tes parents. »

La risquée (« C'est l'État qui m'a volé une heure cette nuit. On écrit au député ensemble ? ») tombe avec la prémisse, et elle penchait de toute façon vers l'excuse (le commentaire le reconnaît). Remplacer la risquée et son commentaire (l. 446-447) par :
> « Toi, tu es arrivé à l'heure. Pour t'allonger. »
> Celle-ci vise Adrien : il était là à midi, et il a passé l'heure sur le canapé, un œuf en chocolat à la main. Tu ne nies pas ton retard, tu fais seulement remarquer que sa ponctualité n'a servi à personne. Elle ne marche que si Adrien rit volontiers de sa paresse et que ta mère lève déjà les yeux au ciel en le regardant. S'il a aidé en cuisine toute la matinée, elle tombe à faux, et c'est toi qui passes pour l'ingrat.

Remplacer la dernière phrase de l'exercice (l. 456) « Et dimanche, vérifie l'heure sur ton téléphone avant de faire confiance à ta montre. Joyeuses Pâques à ta table. » par « Et dans la nuit de samedi à dimanche, à 2 h, les horloges avancent d'une heure : si ton réveil ne se règle pas tout seul, avance-le avant de dormir. Joyeuses Pâques à ta table. »

**B2. L'étape Confiance 1 n'a rien à voir avec la leçon.** « Redécouvrir ce qui te fait rire » fait repérer et énoncer les règles non écrites (salle d'attente, métro : `parcours-seed.json` l. 634-695). La lettre apprend à répondre à une pique sur ton retard sans oublier celle qui a cuisiné. Le pont « Retrouver ce qui te fait rire à ta propre table » est un jeu sur le titre, pas un prolongement. L'étape qui porte la leçon existe : Répartie é3, « Retourner les piques avec le sourire », dont le premier exercice est précisément « T'es encore arrivé après tout le monde » (`parcours-seed.json` l. 471). Elle n'est citée qu'une fois dans le corpus (n°1 du 05/11, cinq mois plus tôt).

Remplacer les lignes 458-459 par :
> Retourner une pique sur ton retard sans te justifier, c'est l'étape 3 du parcours Répartie, « Retourner les piques avec le sourire ».
> Aller à l'étape 3 : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre-premium&utm_medium=email&utm_content=2027-w12-etape3#etape-3

## Mineurs (3 au plus par lettre)

### 14/01
1. Le pont dit « Le toast de soixante secondes » juste après un exercice qui impose « Si tu dépasses dix secondes, coupe » : le lecteur croit à une contradiction. Remplacer l. 41 par « Et quand on te laisse une vraie minute, le toast de soixante secondes avec une seule vanne, c'est l'étape 6 du parcours Boulot. »
2. « Une vingtaine de personnes se retournent » : le battement « N personnes se retournent / N visages se tournent vers toi » revient le 11/02 (« Huit têtes »), le 18/02 (« Quatre visages »), le 25/03 (« Neuf personnes ») et dans le n°1 (« Sept visages »). Le garder ici, le varier ailleurs (voir 11/02 et 25/03).

### 21/01
1. « Tu es à quarante secondes de ton introduction » se lit « il te reste quarante secondes avant l'introduction ». Remplacer par « Ton introduction dure depuis quarante secondes, tout va bien, et ton micro se met à grésiller ».
2. « il dit à voix haute ce que tout le monde est en train de voir : un homme qui parle sans qu'on l'entende » interprète la question « show de mime » au-delà du bloc vérifié (le bloc ne dit pas sur quoi porte le mime ; seul le titre d'Ozap, « Je fais un show de mime », va dans ce sens). Plus prudent : « il pose à voix haute une question sur ce qui se passe sous les yeux de tout le monde, et il lui donne le nom d'un spectacle. »
3. Retour sur l'exercice du 14/01 : « dis-le à quelqu'un qui n'était pas là quand on t'a donné la parole » suppose que le toast a déjà servi, alors que l'exercice le préparait d'avance. Remplacer par « dis-le à quelqu'un sans lui donner le contexte ».

### 28/01
1. La tradition est posée sans sa condition : « une pièce dans la main, on fait sauter la crêpe, et la prospérité de l'année est assurée ». La réplique de Mehdi et la sûre ne marchent que parce que la crêpe doit retomber dans la poêle. Écrire « et si elle retombe dans la poêle, la prospérité de l'année est assurée ».
2. « huit amis dans la cuisine » : huit encore le 11/02 (« Huit personnes », « Huit têtes ») et dans le n°1 (« Vous êtes huit »). Passer à « six amis ».

### 11/02
1. La joueuse « Moi, je viens pour la troisième mi-temps » est une expression toute faite que tout amateur de rugby a entendue cent fois : Maxime la reconnaîtra avant d'en rire (risque déjà noté par l'auteur). Piste, à faire voter à l'aveugle : « Moi, je suis là pour l'ambiance. Les règles, je les laisse aux spécialistes. » (garde le changement de rôle et « les spécialistes », perd le cliché).
2. « Huit personnes » puis « Huit têtes se retournent » : remplacer la seconde par « Toute la pièce attend de voir si tu sais. »
3. L'exercice fait écrire des phrases qui commencent par « Non, mais », qui est mot pour mot l'attaque de l'erreur du n°1 (« Non mais j'écoutais, j'ai juste pas grand-chose à dire »). Le lecteur qui a les deux en tête peut confondre la formule à apprendre et l'erreur à éviter. Garder « Non, mais » (il colle à la sûre) et ajouter à l'exercice : « La seconde moitié compte plus que la première : sans le ralliement, « Non, mais » redevient une excuse. »

### 18/02
1. Le « dessert » sert deux fois dans le lot comme image de fin (la risquée ici, la sûre du 25/03 « rattraper au dessert ») : garder l'un des deux. Le 25/03 en a besoin, pas celui-ci : piste « Tu me gardais pour la fin, Antoine ? Comme le meilleur ? 9. »
2. Le pont « Les premières répliques à garder en poche » renvoie à Répartie é1, qui enseigne l'ironie bienveillante (« Quelle organisation, bravo »), pas l'aveu d'un chiffre. Lien acceptable mais faible ; Confiance é2 (« Rire de toi sans te rabaisser ») colle mieux et n'a été citée qu'une fois (04/02). Si Thomas tient à l'écart de deux semaines, garder Répartie é1.

### 25/02
1. « Dimanche, 19 h, la cage d'escalier. […] Mme Roussel […] remonte ses courses » : un dimanche à 19 h, la plupart des commerces sont fermés depuis midi. Remplacer par « Dimanche, 12 h 30, la cage d'escalier » et « remonte du marché ».
2. « j'ai cru à un rappel » s'entend aussi « rappel à l'ordre », ce qui affaiblit la chute. Piste : « Oui. Vos coups de balai, j'ai cru que vous en redemandiez. »
3. Le retour sur l'exercice du 18/02 répète l'exercice (« dis-les à voix haute […] à plat ») au lieu de donner un test, et « la phrase n'est pas finie d'être écrite » est obscur. Remplacer les deux phrases de test par « Pour les tester, enregistre-toi : si on entend un silence entre le chiffre et la phrase, c'est là que la table aurait redemandé ; colle-les, un point entre les deux, pas de pause. »

### 11/03
1. L'objet dit « tes points faibles ? », la lettre explique que la vraie formule est « axes de progrès », l'exercice revient à « point faible ». Choisir : l'objet peut rester (il accroche mieux), mais alors la scène doit assumer l'écart, par exemple « Et toi, quels sont tes axes de progrès ? » suivi de « Traduction : tes points faibles. »
2. « sur le modèle du troisième jour qu'on vise à deuxième » est bancal. Écrire « sur le modèle de « le troisième jour, je vise le deuxième » ».

### 18/03
1. Le retour sur l'exercice du 11/03 demande un mode d'emploi (« si tu baisses les yeux sur le mot « faible », remplace-le par un verbe d'action » : la réponse n'a aucune raison de contenir le mot « faible »). Remplacer les deux phrases de test par « Pour la tester, dis-la à quelqu'un en le regardant : s'il rit avant d'avoir entendu le vrai défaut, ta touche d'humour arrive trop tôt, déplace-la après le chiffre. » (cohérent avec « à la fin et jamais au début » du 11/03).
2. L'exercice cite « une file d'attente ou une salle d'attente », deux semaines après la lettre du mois du 04/03 qui citait « une salle d'attente, la queue d'un guichet » pour le même public. Écrire « dans un transport, un ascenseur ou au comptoir d'un café ».
3. Le pont vers Machine à Café é3 (raconter une anecdote) va dans le sens inverse de la leçon (refermer poliment) ; il est assumé par « Si la conversation prend ». Acceptable, à laisser.

### 25/03
1. « Neuf personnes se retournent » : quatrième occurrence du battement dans le lot. Remplacer par « Le salon entier a entendu. »
2. Le retour sur l'exercice reprend presque mot pour mot celui du 21/01 (« dis-le/dis-la à quelqu'un qui n'était pas là »). Écrire « Pour la tester, glisse-la dans une conversation : si on te répond « moi aussi », ton aveu est le bon ».
3. Commentaire de la joueuse : « La phrase est un compliment pour le gigot et pour ta mère » est affirmé plus que montré (la phrase s'attribue le mérite du repos du gigot, elle ne complimente personne). Écrire « Tu t'attribues le mérite d'un geste de cuisinier, et tu ramènes tous les regards sur le gigot de ta mère, ce qui désarme la pique. »

## Points transverses

- **Formule d'annonce** : « Elles ont un point commun : aucune… » revient 5 fois sur 9 (28/01, 11/02, 11/03, 18/03, 25/03), en plus de « Aucune ne fait de discours » (14/01) et « Aucune ne justifie ce 9 » (18/02). La révision 2 des lettres de nov-déc a supprimé « Voici trois réponses, de la plus prudente… » partout ; ce lot les a toutes les neuf. À aligner sur la décision prise pour nov-déc (l'orchestrateur tranche), et au minimum varier « Elles ont un point commun » dans trois lettres.
- **Moule « bilan chiffré dit à plat »** : après les retouches B2 du 14/01 et B1 du 11/03, il ne reste que la sûre du 18/02 (« marge de progression »), ce qui est la bonne dose sur le trimestre.
- **Lire l'autre avant de choisir** : trois règles de la même famille en cinq semaines (28/01 la première réaction, 25/02 la bouche ou les yeux, et la lettre du mois du 04/02 « écoute le ton de l'autre »). Chacune a un indice concret différent : pas une redite, mais le prochain lot doit choisir une règle d'une autre famille.
- **Fichiers du corpus en mouvement** : `lettres-reservees-nov-dec-s22.md` a changé pendant cette relecture (la joueuse, la règle et l'erreur du 26/11 ne sont plus celles de mon premier relevé). Les contrôles de redite ci-dessus valent pour l'état du fichier au 25/10 en fin de relecture ; à relancer sur les versions finales avant approbation, comme l'auteur le demande.
- **Étapes citées après retouches** : Boulot é6, Répartie é4, Storytelling é3, Machine à Café é1, Répartie é1, Confiance é6, Boulot é2, Machine à Café é3, Répartie é3. Aucune étape deux fois dans le lot.

## Après retouches

Les huit lettres NO-GO reviennent avec les passages ci-dessus marqués NEUVE et repassent la relecture à l'aveugle sur ces seuls passages (règle d'or P0 s18). Aucune n'est à réécrire en entier. La lettre du 18/03 peut passer à l'approbation de Thomas avec ses deux mineurs appliqués.

## Sources des faits vérifiés (WebSearch du 25/10/2026)

- Angleterre-France, dimanche 14/02/2027, Allianz Stadium, 15 h 10 GMT : https://www.planetrugby.com/news/six-nations-fixtures-confirmed-for-2027-with-ireland-opening-and-closing-the-tournament-and-le-crunch-pencilled-in-for-a-valentines-day-sunday-roast ; https://www.irishrugby.ie/2026/03/09/guinness-mens-six-nations-fixtures-confirmed-for-2027/ ; https://www.rugbyworld.com/news/six-nations-2027-fixtures-announced-182615 ; https://www.rugbypass.com/news/les-moments-cles-du-tournoi-des-six-nations-2027/ (la page officielle sixnationsrugby.com n'est pas sortie dans les résultats).
- Pâques le 28/03/2027 et heure d'été le 28/03/2027 : https://calendar.center/fr/17/paques/ ; https://www.faire-le-pont.fr/changement-heure/2027/ ; https://icalendrier.fr/imprimer/2027/mars
- Frayssinet dans Clique : https://www.ozap.com/actu/-je-fais-un-show-de-mime-roman-frayssinet-perturbe-par-un-bug-technique-dans-clique/622097 ; https://www.universfreebox.com/article/534416/clique-roman-frayssinet-perturbe-suite-a-un-bug-technique-lors-de-son-passage-dans-lemission/amp (pages non ouvertes par moi : je m'en tiens au bloc vérifié de l'orchestrateur).
