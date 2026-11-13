# C6b : les 5 bilans de fin de parcours

> Auteur : @copywriter, s24. **Statut : tour 2, à relire à l'aveugle.** Rien n'est publié.
> Modèle : `docs/espace-client/audit-contenu/architecture-contenu-v20.md` l. 536 à 545 (3.10). Schéma `bilan` de `apps/web/src/lib/espace/fiches-schema.ts` : 2 « laquelle », 1 « ordre », 1 « voix-haute ».
> `[Framework : démonstration puis geste]` `[Conscience : Solution-Aware]`
> **Mécanique des « laquelle »** : les trois options sont de bonnes répliques **du parcours** (vannes, réponses justes des quiz), reprises mot pour mot, chacune bonne pour un autre moment. Le contexte neuf porte le signal du moment et désigne une seule option. Le retour enseigne la règle et dit pour quel moment valent les deux autres.
> **Compte neuf** : 10 contextes + 10 retours « laquelle » + 5 retours « ordre ». Aucune réplique neuve. Le renvoi « celle-là mérite un deuxième tour » est posé par l'écran (fiche de l'étape d'origine), pas écrit dans le retour.
> Sources : `docs/content/parcours-seed.json` (S), `parcours-storytelling-s18.json` (ST), `parcours-boulot-s19.json` (BO), suivies du numéro de ligne. Convention « ordre » : étapes affichées a, b, c (indices 0, 1, 2) ; `ordreCorrect` donne les indices dans le bon ordre. La « voix haute » vient après l'« ordre ».

---

## 1. Machine à Café (`machine-a-cafe`)

**Laquelle 1**
Contexte : « Le groupe se sert dans le plateau de viennoiseries de la pause, et chacun s'excuse de se resservir. Laquelle ressortir ? »
- A) « Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un. » (S l.37)
- B) « J'ai téléchargé une app pour compter les calories. J'ai rentré ma journée. » (S l.39)
- C) « Mes parents m'ont dit qu'ils étaient fiers de moi. J'ai demandé pourquoi. » (S l.113)

`bonneReponse` : 1 (B)
Retour : « B. La vanne qui reste dans le sujet du moment passe mieux qu'une meilleure vanne hors sujet. A est bonne quand la boîte mail est le sujet, C quand la conversation tourne autour de la famille. »

**Laquelle 2**
Contexte : « À l'entrée de l'entreprise, un accès reste verrouillé et la file s'allonge derrière toi. Laquelle ressortir ? »
- A) « Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu. » (S l.194)
- B) « Mon voisin tousse tous les matins à 7h12. Ce matin, 7h20. » (S l.195)
- C) « Le portique à reconnaissance faciale du bureau refuse de m'ouvrir. Ma photo date de mon embauche. » (S l.192)

`bonneReponse` : 2 (C)
Retour : « C. Tout le monde a le même obstacle sous les yeux : ta vanne raconte ce que le groupe vit à l'instant. A est bonne dans un train, B quand quelqu'un tousse de l'autre côté du mur. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : le faux secret à la machine à café. »
- a) Tu lâches l'aveu.
- b) Tu te penches et tu dis « Ça reste entre nous : ».
- c) Tu t'arrêtes net.

`ordreCorrect` : [1, 0, 2] (source : S l.70 et l.93, quiz de l'étape 1)
Retour : « b, a, c. La posture ouvre le suspense, l'aveu est unique, et le silence final fait le reste. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, en te penchant : « Ça reste entre nous : je dis « je regarde ça » sur tout ce que je ne regarderai jamais. » » (S l.84)

---

## 2. Repartie (`repartie`)

**Laquelle 1**
Contexte : « Ta phrase vient de se perdre sans le moindre rire autour de la table. Laquelle ressortir ? »
- A) « Je note trois silences et une toux. Je classe ça en mitigé. » (S l.562)
- B) « Je viens de remarquer que je criais depuis dix minutes. » (S l.409)
- C) « Oui. On a une relation sérieuse, je songe à lui présenter mes parents. » (S l.486)

`bonneReponse` : 0 (A)
Retour : « A. Quand une vanne tombe à plat, tu décris la scène telle qu'elle est et tu conclus d'un ton neutre. B est bonne dans le blanc d'une soirée, C quand on te chambre sur ton téléphone. »

**Laquelle 2**
Contexte : « Dans la cuisine, tu constates que le repas gardé pour ce soir est parti dans l'estomac de la personne qui partage ton appart. Laquelle ressortir ? »
- A) « Pile à l'heure ! J'ai juste eu le temps de lire toute la carte. Deux fois. » (S l.320)
- B) « Aucun souci, j'ai toujours rêvé de dîner en regardant ton assiette. Régale-toi. » (S l.341)
- C) « ...et là, j'ai perdu la suite. Si quelqu'un la retrouve, elle répond au nom de « la chute ». » (S l.586)

`bonneReponse` : 1 (B)
Retour : « B. L'ironie bienveillante dit l'inverse de ce qu'on pense, sur la situation et jamais sur la personne. A est bonne pour un retard au restaurant, C pour un fil perdu en pleine histoire. »

**Dans l'ordre**
Consigne : « Quelqu'un te chambre sur ton retard habituel. Remets ta réponse dans l'ordre. »
- a) « C'est mon rôle : sans moi, personne ne remarque que vous êtes à l'heure. »
- b) « Tu me remercieras. »
- c) « Après tout le monde, oui. »

`ordreCorrect` : [2, 0, 1] (source : S l.471 et l.473, quiz de l'étape 3)
Retour : « c, a, b. On accepte, on pousse d'un cran, puis on retourne avec un compliment déguisé : l'autre rit avec toi, pas de toi. »

**Dis-la à voix haute**
Consigne : « Dis maintenant la réponse entière à voix haute : « Après tout le monde, oui. C'est mon rôle : sans moi, personne ne remarque que vous êtes à l'heure. Tu me remercieras. » » (S l.473)

---

## 3. Confiance (`confiance`)

**Laquelle 1**
Contexte : « Tu veux rire d'une de tes propres mésaventures de la semaine, légère et déjà digérée, en laissant un détail du récit conclure à ta place. Laquelle ressortir ? »
- A) « Avant, une page mettait trois minutes à s'afficher et on ne disait rien. Aujourd'hui, elle met une seconde et on soupire. » (S l.843)
- B) « Quand quelqu'un commence par « à la base », il faut être patient. » (S l.643)
- C) « J'ai fermé la porte avec mes clés à l'intérieur. Le serrurier m'a demandé si c'était un abonnement. » (S l.766)

`bonneReponse` : 2 (C)
Retour : « C. Un fait précis, et c'est le serrurier qui conclut, pas toi : l'autodérision sans verdict sur toi. A est bonne quand tu compares avant et aujourd'hui, B quand tu observes un tic de langage chez les autres. »

**Laquelle 2**
Contexte : « À table, quelqu'un te demande ce que devient ta vie en ce moment, et tu n'as rien de grand à répondre. Laquelle ressortir ? »
- A) « Mon voisin s'est mis au didgeridoo, tous les matins à 7h. Je ne lui en veux pas : il est plus matinal que moi. » (S l.1100)
- B) « Règle numéro un : on s'assoit toujours le plus loin possible des autres, même quand il reste dix chaises à côté. » (S l.664)
- C) « Article premier : dans un wagon, on se tient à un mètre de tout le monde, comme si la proximité était contagieuse. » (S l.678)

`bonneReponse` : 0 (A)
Retour : « A. Une micro-anecdote vraie, dans ton ton, répond sans rien forcer : c'est ton style, pas une vanne empruntée. B est bonne dans une salle d'attente où personne ne parle, C dans une rame de métro. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : trouver ton style d'humour. »
- a) Tu le refais exprès sur un quatrième sujet.
- b) Tu retrouves trois messages qui ont fait rire.
- c) Tu notes en une phrase ce qui se répète.

`ordreCorrect` : [1, 2, 0] (source : S l.1054 et l.1067, quiz de l'étape 6)
Retour : « b, c, a. On cherche dans ce qui a marché, on note ce qui revient, puis on le refait exprès : le style se repère avant de se jouer. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, avec le sérieux d'un constat : « Mon gâteau est sorti du four plus plat que le mode d'emploi. » » (S l.745)

---

## 4. Storytelling (`storytelling`)

**Laquelle 1**
Contexte : « Ton récit d'un meuble coincé dans la cage d'escalier touche à sa fin, et il te faut une phrase courte qui laisse l'image conclure. Laquelle ressortir ? »
- A) « Le train n'est pas un échec : j'ai lu la moitié de mon livre et je connais la gare par cœur. » (ST l.306)
- B) « Depuis, il fait partie de l'immeuble. » (ST l.158)
- C) « Parenthèse : dans le métro, tout le monde fixe le plan comme si la ligne avait changé depuis ce matin. » (ST l.465)

`bonneReponse` : 1 (B)
Retour : « B. Une chute courte, sans moralité : l'image finit seule. A est bonne pour le bilan d'un raté, C pour un tiroir ouvert au milieu d'une histoire. »

**Laquelle 2**
Contexte : « Ton récit présente un personnage mystérieux qui garde tes confidences, et la dernière phrase doit trancher sans le nommer. Laquelle ressortir ? »
- A) « Le dîner n'est pas un échec : pour la première fois, tous mes invités se sont proposés pour cuisiner la prochaine fois. » (ST l.318)
- B) « Le monsieur devant moi tenait un cactus en pot sous le bras. » (ST l.168)
- C) « Hier soir, j'ai ouvert sa porte à minuit, et il s'est allumé pour moi. » (ST l.395)

`bonneReponse` : 2 (C)
Retour : « C. Tu tranches sans nommer : la phrase prolonge le doute et reste juste des deux côtés. A est bonne pour le bilan d'un dîner raté, B pour garder le détail qu'on voit dans une version coupée. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : faire revenir un détail dans la soirée. »
- a) Tu attends que la conversation soit passée à autre chose.
- b) Tu reprends ce détail, une seule fois.
- c) Tu choisis un détail précis et un peu étrange, dit en passant.

`ordreCorrect` : [2, 0, 1] (source : ST l.569 et l.583, quiz de l'étape 6)
Retour : « c, a, b. On sème en passant, on laisse la conversation avancer, puis le détail revient une fois : il arrive quand plus personne ne l'attend. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, comme une phrase d'ouverture : « Sur la table d'apéro, les bâtonnets de carottes n'ont pas bougé de la soirée. » » (ST l.122)

---

## 5. Boulot (`boulot`)

**Laquelle 1**
Contexte : « Un message de confirmation pour un atelier du service part dans une minute, tout est écrit, et il te reste une dernière ligne d'humeur à ajouter après ton nom. Laquelle ressortir ? »
- A) « PS : petite correction, ce n'est pas le ficus que j'arrose depuis mardi, mais son sosie en plastique. » (BO l.428)
- B) « Cette porte ferme avec la discrétion d'une fanfare. » (BO l.496)
- C) « Mercredi, j'ai passé une heure entière à chercher une salle qui n'existait pas. » (BO l.565)

`bonneReponse` : 0 (A)
Retour : « A. Sous un message sérieux, un PS rectifie un détail minuscule : il détend sans parasiter. B vaut en passant dans un couloir, C à l'afterwork, quand on raconte. »

**Laquelle 2**
Contexte : « Au pot d'un réseau pro, on te demande ton métier : tu t'occupes des espaces verts de la ville, ta première phrase est dite, et il te faut la seconde, celle qui ouvre une perspective lointaine. Laquelle ressortir ? »
- A) « J'envoie les factures du mois et je vérifie qu'elles arrivent. » (BO l.624)
- B) « Dans quarante ans, des familles pique-niqueront à l'ombre de mon travail, sans me remercier. » (BO l.636)
- C) « Il est neuf, et il garde deux stylos et une agrafeuse cassée. » (BO l.373)

`bonneReponse` : 1 (B)
Retour : « B. La seconde phrase prolonge la première avec une image, et le temps long fait sourire. A est une bonne première phrase, C une bonne seconde phrase pour un autre objet : chacune a son moment. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : la vanne de couloir. »
- a) Tu continues ta route, qu'on ait souri ou non.
- b) Tu sors ta phrase en passant, dans le couloir.
- c) Tu choisis le sujet le plus sûr : le thermostat du service.

`ordreCorrect` : [2, 1, 0] (source : BO l.503 à 505 et l.514 à 517, quiz de l'étape 3)
Retour : « c, b, a. Le sujet sûr d'abord, la phrase en passant, puis tu continues : on ne vérifie pas si ça a fait rire. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, sur le ton d'un constat : « Un chargeur est branché sous la table, sans téléphone au bout. » » (BO l.360)

---

## Table de contrôle

| Bilan | Contexte | Bonne réponse (ligne) | Mots du contexte absents de la bonne réponse |
|---|---|---|---|
| 1 | L1 | S l.39 | oui (groupe, plateau, viennoiseries, pause, chacun, excuse, resservir) |
| 1 | L2 | S l.192 | oui (entrée, entreprise, accès, verrouillé, file, allonge) |
| 2 | L1 | S l.562 | oui (phrase, perdre, rire, table) |
| 2 | L2 | S l.341 | oui (cuisine, constates, repas, gardé, soir, estomac, partage, appart) |
| 3 | L1 | S l.766 | oui (mésaventures, semaine, légère, digérée, détail, récit, conclure, place) |
| 3 | L2 | S l.1100 | oui (table, demande, devient, vie, moment, rien, grand, répondre) |
| 4 | L1 | ST l.158 | oui (récit, meuble, coincé, cage, escalier, touche, fin, courte, image, conclure) |
| 4 | L2 | ST l.395 | oui (récit, présente, personnage, mystérieux, garde, confidences, dernière, trancher, nommer) |
| 5 | L1 | BO l.428 | oui (message, confirmation, atelier, service, minute, humeur, nom) |
| 5 | L2 | BO l.636 | oui (pot, réseau, métier, occupes, espaces, verts, ville, seconde, perspective, lointaine) |

| Contrôle | Résultat |
|---|---|
| Répliques | toutes reprises mot pour mot des seeds, ligne citée ; chaque option est une vanne ou une réponse JUSTE d'un quiz (aucune réponse marquée mauvaise) |
| Une seule bonne réponse | désignée sans lire le retour : B, C, A, B, C, A, B, C, A, B (concordent avec `bonneReponse`) ; les deux leurres de chaque contexte ne collent pas à son signal (autre sujet, autre moment) |
| Position de la bonne réponse | 1, 2, 0, 1, 2, 0, 1, 2, 0, 1 |
| Leurres | aucune réplique n'apparaît deux fois dans l'ensemble des 5 bilans (options et voix haute) |
| Tirets cadratins | 0 (grep fait) ; emoji, IA, concurrent : 0 |
| Genre | aucune réplique avec « nul », « félicité », « sûr », « fauché », « arrivé » (écartées) ; aucune personne d'en face genrée dans les contextes (« quelqu'un », « la personne », « chacun ») ; « Un collègue » du modèle neutralisé ; pas d'« hôte » |
| Doublons | grep (viennoiseries, tourniquet, plateau, huis clos, jardin, tes confidences, personnage mystérieux, après ton nom, etc.) dans qr*, c3*, c4*, c6a, c6c, c7 et le blog : aucun doublon de scène ; seule idée proche : le portique de c3a l.250, évité en remplaçant « tourniquets » par « accès verrouillé » |
| Guillemets | « » extérieurs, “ ” intérieurs |

## Tour 2 : retouche → ligne

| Retouche demandée | Où |
|---|---|
| Options prises dans le contenu du parcours (plus de situations QR) | toutes les « laquelle » (sources S, ST, BO) |
| Trois bonnes réponses d'un autre moment, signal dans le contexte, retour qui enseigne | 10 contextes et 10 retours |
| « Ordre » sur une étape réelle, citée | bilans 1 à 5, lignes S l.70/93, l.471/473, l.1054/1067 ; ST l.569/583 ; BO l.503 à 517 |
| « Un collègue » (B1), « l'hôte » (B3) | supprimés (nouveaux contextes) |
| Deux bonnes réponses (B2 L1, B4 L1, B5 L2) | contextes et options remplacés (B2 L1, B4 L1, B5 L2) |
| « Si » sans objet (B2) | disparu avec les nouvelles options |
| « Sans la lire » (B3) | « Lis-la une fois, puis dis-la sans regarder l'écran » |
| Voix haute du B5 sur une réponse marquée mauvaise | remplacée par BO l.360, réponse juste |
| Leurres répétés d'un bilan à l'autre | tous distincts |
| Vannes à accord genré ou à « elle » (S l.35, l.38 ; ST l.181) | écartées |
