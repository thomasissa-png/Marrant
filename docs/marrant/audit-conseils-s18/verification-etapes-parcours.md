# Vérification des 5 étapes de parcours dont le conseil a été réécrit (s18, 08/10/2026)

> Sources : `docs/marrant/audit-conseils-s18/etapes-parcours-a-verifier.md` (nouveau texte des 5 conseils) et `docs/content/parcours-reecriture-s17.json` (textes d'étape et quiz de s17). Rien n'est modifié dans le code, le seed ni la base. Les remplacements sont des propositions : tutoiement, « vanne », zéro tiret cadratin, aucune marque, aucun chiffre du site touché.
> Règle appliquée : un seul enseignement par étape, celui du conseil affiché ; aucun texte ne cite l'ancien exemple ; le quiz ne teste que ce que le conseil enseigne ; le titre d'étape ne contredit pas le titre du conseil. Positions des bonnes réponses conservées à l'identique.

## Verdict par étape

| Étape | Conseil devenu | Verdict | Passages à corriger |
|---|---|---|---|
| Confiance 2 | « Le pouvoir de l'auto-dérision » (fait raconté, pas verdict) | **À CORRIGER (mineur)** | `moduleDetail` ; quiz Q1, réponse A (reprend mot pour mot l'exemple du verdict du conseil) |
| Machine à Café 2 | « Rallonger la vanne de quelqu'un d'autre » | **À CORRIGER (lourd)** | `tipTitle`, `why`, `moduleTitle`, `moduleDetail`, les 4 questions du quiz |
| Répartie 2 | « Le silence entre deux chansons » (responsable du silence) | **À CORRIGER (moyen)** | `why` (fin), `moduleDetail` (« Pas besoin d'être drôle »), quiz Q2 |
| Répartie 3 | « Répondre aux chambrages… » (remercier, traiter l'autre en fan) | **À CORRIGER (lourd)** | `why`, `moduleDetail`, quiz Q1, Q2, Q3, les 2 légendes vidéo |
| Répartie 4 | « Savoir rebondir sur un raté » (états de service) | **À CORRIGER (lourd)** | `moduleDetail`, `moduleTitle`, les 5 questions du quiz, les 2 légendes vidéo |

Point d'attention pour @fullstack : le rattachement étape / conseil se fait par titre. À Machine à Café 2, le `tipTitle` du JSON et du seed (« Lire le tempo du groupe : savoir quand c'est ton tour ») doit devenir « Rallonger la vanne de quelqu'un d'autre », sinon l'étape perd son conseil. Les 4 autres titres de conseil sont inchangés.

---

## 1. Confiance, étape 2 : « Rire de toi sans te rabaisser » (conseil « Le pouvoir de l'auto-dérision »)

**Verdict : À CORRIGER (mineur).** Le titre d'étape, le `why`, les questions Q2, Q3 et Q4 et les deux légendes vidéo restent vrais (défaut léger, objet ou situation qui conclut, garde pour toi ce qui fait mal). Deux passages posent problème.

**a. Quiz Q1, réponse A : reprend l'exemple de verdict du conseil**
- Citation : « Je suis nul en cuisine, c'est un désastre. »
- Pourquoi : le conseil écrit « « Je suis nul en cuisine » est un verdict ». La réponse se reconnaît au lieu de se réfléchir, ce que la règle du format quiz interdit.
- Remplacement : « Je suis un cas désespéré aux fourneaux, c'est un désastre. » (reste un verdict sur toi ; l'explication « La A, la B et la C sont des verdicts sur toi » reste vraie)

**b. `moduleDetail` : n'énonce pas l'enseignement du conseil et le contredit sur un point**
- Citation : « Rire de toi n'a rien de honteux, à condition que ce soit toi qui tiennes la plume. Tu apprends à transformer un moment gênant en histoire qui fait sourire, sans que personne ait à te plaindre. Tu restes aux commandes de ce que tu racontes : une vraie blessure n'a pas à devenir une vanne. »
- Pourquoi : l'enseignement du conseil est « un fait, pas un verdict » et « laisse un objet ou une situation conclure à ta place ». « Tiennes la plume » dit presque l'inverse de « conclure à ta place », et ni le fait ni le verdict n'apparaissent.
- Remplacement : « Rire de toi n'a rien de honteux, à condition de raconter un fait plutôt qu'un verdict. Tu apprends à transformer un moment gênant en histoire qui fait sourire, en laissant un objet ou une situation conclure à ta place, sans que personne ait à te plaindre. Une vraie blessure n'a pas à devenir une vanne : tu choisis ce que tu racontes. Au bout du compte, tu montres que tu es à l'aise avec toi-même, et ça met les autres à l'aise aussi. »

**Signalé, sans correction obligatoire** : la première vanne de l'étape (« Mon détecteur de fumée me sert de minuteur. La dernière fois, les pompiers sont venus. ») et l'exemple du conseil (« Mon détecteur de fumée me connaît par mon prénom ») tournent autour du même objet. Ce n'est pas faux ; si tu veux éviter la redite, remplacer la première vanne par une autre active non utilisée (les doublons de vannes sont acceptés, décision s17).

---

## 2. Machine à Café, étape 2 : « Sentir le bon moment » (conseil « Rallonger la vanne de quelqu'un d'autre »)

**Verdict : À CORRIGER (lourd).** L'étape entière enseigne autre chose : lire le groupe et placer SA vanne au bon moment, sans faire rire personne. Le conseil enseigne maintenant à prolonger la vanne d'un autre d'une phrase. Seule l'idée « laisse le rire retomber » survit. Les légendes vidéo restent vraies (Brokerss : une pause avant de relancer ; Dhjan : où il respire) ; elles ne montrent pas la rallonge mais ne mentent pas.

**a. `tipTitle` (seed et JSON)**
- Citation : « Lire le tempo du groupe : savoir quand c'est ton tour »
- Remplacement : « Rallonger la vanne de quelqu'un d'autre » (titre du conseil, à l'identique, pour que le rattachement par titre tienne).

**b. `moduleTitle`**
- Citation : « Sentir le bon moment »
- Pourquoi : promet un apprentissage de timing, pas de rallonge.
- Remplacement : « Rallonger la vanne d'un autre »

**c. `why`**
- Citation : « Tu as la vanne, il te manque le moment. Ce conseil t'apprend à lire le groupe pour sentir quand c'est ton tour, au lieu de parler en même temps que tout le monde. »
- Remplacement : « Tu n'as pas toujours une vanne en poche, et ce n'est pas grave : quand quelqu'un vient de faire rire le groupe, la matière est déjà là. Ce conseil t'apprend à prolonger sa vanne d'une phrase, au lieu de chercher la tienne. »

**d. `moduleDetail`**
- Citation : « Écouter un groupe comme on écoute un morceau : où ça monte, où ça retombe, où il y a de la place pour toi. C'est ce que tu t'entraînes à faire ici. Tu arrêtes de te demander si tu es assez drôle, tu te demandes seulement si c'est le bon moment. À la pause, en réunion ou à l'afterwork, cette étape ne te demande de faire rire personne : seulement d'entendre le rythme. »
- Pourquoi : « ne te demande de faire rire personne » contredit le défi (la réussite : celui qui a lancé la vanne sourit ou en ajoute une).
- Remplacement : « Quelqu'un vient de faire rire la pause café ? Ne cherche pas ta propre vanne : prolonge la sienne. Tu laisses le rire retomber, puis tu ajoutes une phrase qui pousse son idée un cran plus loin. Tu n'as rien à inventer, et tu fais briller celui qui a lancé le sujet. À la pause, en réunion ou à l'afterwork, c'est la façon la plus douce d'entrer dans une conversation qui rit déjà. »

**e. Quiz : les 4 questions testent le timing de SA vanne ou l'écoute silencieuse, pas la rallonge.** Remplacement complet (positions conservées : A, C, B, D).

- **Q1 (bonne réponse A)**
  - Question : « Un collègue vient de faire rire le groupe. À quel moment ajoutes-tu ta rallonge ? »
  - Options : A. « Dans le petit blanc juste après le rire, quand tout le monde reprend son souffle » ; B. « Pendant le rire, pour surfer dessus » ; C. « Dix minutes plus tard, quand tu auras trouvé la formulation parfaite » ; D. « Avant la fin de son histoire, pour être le premier à réagir »
  - Explication : « La A : tu laisses le rire retomber, puis tu ajoutes ta phrase dans le petit blanc. Pendant le rire personne ne t'entend, dix minutes plus tard le groupe est déjà ailleurs, et couper son histoire revient à lui voler la vedette. »
  - Passage devenu faux dans l'ancienne version : « La A : le blanc d'environ deux secondes après le rire est ta fenêtre. » (chiffre « deux secondes » absent du conseil, et « ta vanne » au lieu de la rallonge)
- **Q2 (bonne réponse C)**
  - Question : « Une collègue vient de faire rire la pause : « Je garde le même mot de passe depuis neuf ans. » Quelle rallonge fonctionne ? »
  - Options : A. « Moi, le sujet du moment, c'est le match d'hier : vous l'avez vu ? » ; B. « Neuf ans ? Moi, c'est douze ans, et en plus je le range dans un carnet. » ; C. « Au bout de neuf ans, ce n'est plus un mot de passe, c'est un membre de la famille. » ; D. « Au bout de neuf ans, ce n'est plus un mot de passe, c'est un membre de la famille. Il a sa chambre, on lui fête ses anniversaires, on lui doit une pension. »
  - Explication : « La C : une seule phrase, dans la même direction que la sienne, sans changer de sujet. La A change de sujet, la B tire la vanne vers toi, la D s'étire en plusieurs phrases et lui prend la scène. »
  - Passage devenu faux dans l'ancienne version : « Au déjeuner, tout le monde parle en même temps et tu as une vanne qui colle au sujet. Tu fais quoi ? » (le conseil ne part pas d'une vanne à toi)
- **Q3 (bonne réponse B)**
  - Question : « Le rire est retombé depuis un moment, la conversation est repartie ailleurs et ta rallonge te vient seulement maintenant. Que fais-tu ? »
  - Options : A. « Tu la ressors quand même en lançant « Pour revenir à ce qu'on disait... » » ; B. « Tu la laisses tomber et tu guettes la prochaine vanne d'un autre : une rallonge se pose sur le moment » ; C. « Tu la répètes plus fort jusqu'à ce que quelqu'un réagisse » ; D. « Tu te tais pour le reste de la pause : ce n'est pas ton jour »
  - Explication : « La B : une rallonge s'appuie sur ce qui vient d'être dit, donc elle ne se ressort pas plus tard. Revenir en arrière ou répéter plus fort, c'est forcer un moment passé ; se taire pour le reste de la pause, c'est renoncer à la prochaine vanne. »
  - Passage devenu faux dans l'ancienne version : « Le blanc est passé, la conversation est déjà repartie ailleurs. Ta vanne ? » et « Tu la laisses tomber et tu guettes le prochain blanc : il y en aura un » (le conseil ne parle pas de blanc à guetter pour sa propre vanne)
- **Q4 (bonne réponse D)**
  - Question : « Ton défi du jour : ajouter une rallonge à la vanne de quelqu'un. Que fais-tu à la pause ? »
  - Options : A. « Tu prépares une vanne à toi pour la sortir en premier » ; B. « Tu notes les sujets qui font rire pour les resservir demain » ; C. « Tu ris le plus fort pour donner le rythme au groupe » ; D. « Tu écoutes la prochaine vanne, tu laisses le rire retomber, puis tu ajoutes une phrase dans la même direction »
  - Explication : « La D : le défi consiste à prolonger la vanne d'un autre, en une phrase, après le rire. Préparer ta vanne, noter des sujets ou imposer ton rire, c'est vouloir mener au lieu de prolonger. »
  - Passage devenu faux dans l'ancienne version : « Ton défi du jour : ne pas chercher à faire rire. » (le défi est d'ajouter une rallonge, pas de ne faire rire personne)

---

## 3. Répartie, étape 2 : « Le rythme et les silences » (conseil « Le silence entre deux chansons »)

**Verdict : À CORRIGER (moyen).** Le titre d'étape, la Q1, la Q3, la Q4 et les deux légendes vidéo restent vrais (blanc entre deux morceaux, phrase courte à voix normale). Trois passages ne le sont plus tout à fait : le conseil enseigne désormais une phrase de « responsable du silence », sérieuse, au lieu d'une pensée simple confiée.

**a. `why`, fin de phrase**
- Citation : « Tu apprends à repérer le blanc où ta phrase porte dans toute la pièce, puis à le laisser faire. »
- Pourquoi : « le laisser faire » se lit « ne rien dire », alors que le conseil demande de glisser une phrase dans le blanc.
- Remplacement : « Tu apprends à repérer le blanc où ta phrase porte dans toute la pièce, puis à y glisser une seule phrase sérieuse, comme si tu assumais le silence. »

**b. `moduleDetail`**
- Citation : « Pas besoin d'être drôle : une phrase courte, placée au bon moment, fait plus d'effet qu'un long discours. »
- Pourquoi : le conseil veut une phrase drôle par son sérieux (« comme un responsable qui assume ses actes devant la presse ») ; « pas besoin d'être drôle » envoie vers une phrase neutre.
- Remplacement : « Pas besoin d'une vanne préparée : une phrase courte, dite avec le sérieux d'un responsable qui assume, fait plus d'effet qu'un long discours. »

**c. Quiz Q2 : la bonne réponse ne suit plus la technique du conseil**
- Citation : « Quelle phrase fonctionne le mieux dans ce blanc ? » avec la bonne réponse D « Je viens de remarquer que je criais depuis dix minutes. » et l'explication « La D : une pensée simple et vraie, dite sans effort, et chacun s'y reconnaît, puisque tout le monde criait aussi. La A est une vanne longue, la B annonce une vanne avant de la dire, et la C déplace la conversation sans rien confier. »
- Pourquoi : la technique est maintenant la phrase de responsable du silence, pas la confidence d'une pensée.
- Remplacement (bonne réponse en D, position conservée) :
  - Question : « La musique vient de s'arrêter et tout le monde parlait trop fort. Quelle phrase suit la technique du responsable du silence ? »
  - Options : A. « Attendez, je vous raconte ce qui m'est arrivé mardi, ça va être long mais ça vaut le coup... » ; B. « Hé, écoutez-moi ! J'ai une super vanne ! » ; C. « Je fais un petit sondage : qui connaît cette chanson ? » ; D. « Je tiens à dire que je n'étais pas au courant de ce silence, mais je l'assume pleinement. »
  - Explication : « La D : une seule phrase courte, sérieuse, qui prend la responsabilité du silence. La A est un récit long, la B annonce une vanne au lieu de la dire, et la C pose une question sans le ton sérieux d'un responsable. »

---

## 4. Répartie, étape 3 : « Retourner les piques avec le sourire » (conseil « Répondre aux chambrages entre potes sans rester muet »)

**Verdict : À CORRIGER (lourd).** Le conseil n'enseigne plus la méthode en trois temps (accepter, exagérer, retourner) mais une seule idée : traiter la pique comme une preuve d'attention et remercier celui qui l'a lancée, comme on remercie un fan. Le titre d'étape reste acceptable (« retourner » désigne toujours le sens de la scène) ; la Q4 reste vraie (« juste de ne pas laisser le silence répondre à ta place »).

**a. `why`**
- Citation : « Le cœur du parcours : une technique en 3 temps (accepter, exagérer, retourner) qui transforme le chambrage en jeu où tu marques aussi des points, au lieu d'en être la cible préférée. »
- Remplacement : « Le cœur du parcours : une technique qui transforme le chambrage en compliment que l'autre n'avait pas prévu de te faire. Celui qui te chambre t'observe de très près : tu le remercies de cette attention, au lieu d'être la cible préférée. »

**b. `moduleDetail`**
- Citation : « Un pote te chambre en soirée, quelqu'un te lance une pique en TD : tu apprends la méthode en trois temps pour retourner la situation sans agressivité : accepter, exagérer, retourner. L'autre rit avec toi au lieu de rire de toi, et c'est toi qui repars avec la dernière réplique. »
- Remplacement : « Un pote te chambre en soirée, quelqu'un te lance une pique en TD : tu apprends à la traiter comme une preuve d'attention. Tu remercies celui qui l'a lancée de t'avoir observé de si près, avec le sérieux de quelqu'un qui découvre un fan. Tu ne nies rien et tu ne te défends pas : l'autre rit avec toi au lieu de rire de toi, et c'est toi qui repars avec la dernière réplique. »

**c. Quiz Q1** (bonne réponse A, position conservée)
- Citation de ce qui est faux : « Laquelle de ces réponses suit les trois temps (accepter, exagérer, retourner) ? » et la bonne réponse « Après tout le monde, oui. C'est mon rôle : sans moi, personne ne remarque que vous êtes à l'heure. Tu me remercieras. »
- Remplacement :
  - Question : « Un pote te lance : « T'es encore arrivé après tout le monde. » Laquelle de ces réponses traite la pique comme une preuve d'attention ? »
  - Options : A. « Tu as remarqué ? Je ne savais pas que mes arrivées étaient suivies d'aussi près. Merci pour cette attention. » ; B. « Non, j'étais là avant, c'est toi qui n'as pas vu. » ; C. « Et toi, t'étais en retard la semaine dernière. » ; D. « Ouais, désolé. » (en baissant la tête)
  - Explication : « La A : tu remercies l'observation avec le sérieux d'un fan, sans te défendre. Nier prolonge la scène, contre-attaquer en lance une autre, et t'excuser te laisse cible. »

**d. Quiz Q2** (bonne réponse C)
- Citation de ce qui est faux : « Quelle réponse exagère sans attaquer ? » et la bonne réponse « Oui. On a une relation sérieuse, je songe à lui présenter mes parents. » (c'est de l'exagération, plus la technique)
- Remplacement :
  - Question : « On te dit : « T'es toujours sur ton téléphone. » Quelle réponse remercie sans attaquer ? »
  - Options : A. « Et toi, tu es toujours en train de me regarder. » ; B. « Non, c'est pas vrai, je l'ai posé hier. » ; C. « Tu me surveilles avec une constance admirable. Merci, je me sens suivi par un vrai professionnel. » ; D. « Pardon, je vais le ranger. »
  - Explication : « La C : tu remercies de l'attention portée et tu traites l'autre en fan, sans le viser. La A contre-attaque, la B nie, et la D s'excuse : dans les trois cas, la pique reste la dernière chose dite. »

**e. Quiz Q3** (bonne réponse B)
- Citation de ce qui est faux : « Tu as déjà accepté et exagéré (« Fauché, oui : ma carte bancaire me demande poliment de ne plus insister »). Quel retournement termine bien ? »
- Remplacement :
  - Question : « On te lance : « T'es toujours fauché. » Quelle réponse transforme la pique en compliment ? »
  - Options : A. « Toi aussi, tu es fauché, regarde ton pull. » ; B. « Tu suis mon budget d'aussi près ? Je ne savais pas que j'avais un comptable aussi dévoué. » ; C. « Arrête, c'est blessant. » ; D. « Donc tu peux me prêter 20 € ? »
  - Explication : « La B : tu remercies l'observation et tu fais de l'autre un fan, sans te défendre. La A attaque la personne, la C ferme la conversation, et la D change de sujet sans jouer avec la pique. »

**f. Légendes vidéo : les deux annoncent « les trois temps »**
- Citation Lilia Benchabane : « Elle accepte la remarque, la pousse un cran plus loin et la retourne avec le sourire : les trois temps, version scène. »
- Remplacement : « Elle accueille la remarque avec le sourire et la retourne à son avantage, sans se défendre. »
- Citation Sugar Sammy : « Il prend le cliché qu'on lui colle, l'accepte, le pousse jusqu'à l'absurde et le retourne : les trois temps, par la personne visée elle-même. »
- Remplacement : « Il prend le cliché qu'on lui colle et joue avec au lieu de se défendre, par la personne visée elle-même. » `[À VÉRIFIER en visionnant, comme les légendes d'origine]`

---

## 5. Répartie, étape 4 : « Improviser sur l'inattendu » (conseil « Savoir rebondir sur un raté »)

**Verdict : À CORRIGER (lourd).** Le conseil enseigne maintenant à rattraper une vanne ratée en une phrase, en donnant ses « états de service » (un lieu précis et un peu humiliant), puis à changer de sujet. Le `why` reste vrai. Le « oui, et » de l'impro et le constat de terrain, que le texte d'étape et les 5 questions du quiz testent, ne sont plus enseignés.

**a. `moduleDetail`**
- Citation : « Ce qui compte, c'est la seconde d'après : tu apprends à reprendre la main sans t'excuser et sans t'expliquer, en t'inspirant du « oui, et » de l'impro. »
- Remplacement : « Ce qui compte, c'est la seconde d'après : tu apprends à reprendre la main sans t'excuser et sans t'expliquer, en rattrapant ta vanne comme une artiste qui a eu du succès ailleurs. »

**b. `moduleTitle`**
- Citation : « Improviser sur l'inattendu »
- Pourquoi : promet de l'impro ; le conseil enseigne un rattrapage précis.
- Remplacement : « Rattraper une vanne qui tombe à plat »

**c. Quiz : les 5 questions** (positions conservées : B, A, D, C, B). Remplacement complet.

- **Q1 (bonne réponse B)**
  - Question : « Ta vanne tombe à plat, personne ne rit. Quel premier réflexe ? »
  - Options : A. « Répéter ta vanne plus fort » ; B. « La rattraper en une phrase, comme une artiste qui a eu du succès ailleurs » ; C. « Expliquer pourquoi elle était drôle » ; D. « Dire « bon, je vais chercher à boire » et disparaître »
  - Explication : « La B : tu rattrapes ta vanne en lui donnant ses états de service, sans te justifier. Répéter plus fort ou expliquer, c'est insister ; disparaître, c'est fuir la scène. »
  - Passage devenu faux : « Décrire en une phrase ce qui se passe vraiment : les regards, le silence, les téléphones » (ancienne technique du constat).
- **Q2 (bonne réponse A)**
  - Question : « Ta vanne tombe à plat. Laquelle de ces phrases la rattrape sans se justifier ? »
  - Options : A. « Étonnant. Cette vanne a fait un carton ce matin, dans la salle d'attente du dentiste. » ; B. « C'était de l'humour, hein, c'était pour rire. » ; C. « Vous avez pas compris, en fait c'était à cause du mot « tonton ». » ; D. « Bon. Passons. »
  - Explication : « La A : elle donne à la vanne des états de service précis, avec un lieu un peu humiliant, sur un ton neutre. La B se justifie, la C explique la vanne, et la D passe à autre chose sans rien ajouter qui fasse sourire. »
  - Passage devenu faux : « Je note trois silences et une toux. Je classe ça en mitigé. » (constat, plus enseigné)
- **Q3 (bonne réponse D)**
  - Question : « Tu viens de rattraper une vanne ratée. Qu'est-ce qui fait sourire dans ton rattrapage ? »
  - Options : A. « L'insistance : tu le redis avec plus de conviction » ; B. « L'explication : tu détailles le mécanisme de la vanne » ; C. « L'excuse : tu t'excuses sincèrement » ; D. « Le détail du lieu, précis et un peu humiliant, dit sans te justifier »
  - Explication : « La D : c'est le détail du lieu qui fait sourire, pas ton insistance. Insister, expliquer ou s'excuser prolonge le malaise au lieu de le retourner. »
  - Passage devenu faux : « Un ami raconte : « Mon vélo est tellement rouillé… » Quelle réponse est un « oui, et » ? » (notion non enseignée)
- **Q4 (bonne réponse C)**
  - Question : « Tu as dit ta phrase de rattrapage. Et maintenant ? »
  - Options : A. « Tu attends que quelqu'un réagisse » ; B. « Tu ajoutes une deuxième vanne pour compenser » ; C. « Tu changes de sujet, sans te justifier » ; D. « Tu expliques le lieu pour être sûr qu'on comprenne »
  - Explication : « La C : la phrase dite, tu changes de sujet sans te justifier. Attendre une réaction ou compenser par une seconde vanne prolonge le malaise, et expliquer le lieu tue le détail. »
  - Passage devenu faux : « Tu racontes une histoire et tu perds le fil en plein milieu. Quelle impro ? » (sujet étranger au conseil)
- **Q5 (bonne réponse B)**
  - Question : « Tu rattrapes ta vanne en jouant les professionnels déçus mais bons joueurs. Quel ton garde le mieux l'effet ? »
  - Options : A. « Vexé, pour montrer que tu t'es senti visé » ; B. « Posé et sérieux, sur le ton d'un pro déçu mais bon joueur » ; C. « Dramatique, pour que tout le monde comprenne l'enjeu » ; D. « Murmuré, pour qu'on n'entende presque rien »
  - Explication : « La B : le sérieux du pro déçu mais bon joueur rend le détail du lieu drôle. Vexé, dramatique ou murmuré, tu attires l'attention sur toi au lieu de la vanne. »
  - Passage devenu faux : « En soirée, ta phrase fait rire et un inconnu ajoute un détail dessus. Ta réaction ? » (« oui, et » à deux, non enseigné)

**d. Légendes vidéo : les deux reposent sur « oui, et »**
- Citation Haroun : « « Oui, et… » : il accepte ce que le public lui tend et ajoute par-dessus, en gardant le sourire. C'est le rebond de l'étape, en direct. »
- Remplacement : « Il garde le sourire et enchaîne quand une réplique ne prend pas, sans se justifier. C'est le rattrapage de l'étape, en direct. » `[À VÉRIFIER en visionnant]`
- Citation Kyan Khojandi & Navo : « Duo en impro, dynamique rationnel/délirant, « oui, et… » verbal : rebondir sur l'inattendu à deux. »
- Remplacement : « Duo en impro, dynamique rationnel/délirant : l'un garde son sérieux pendant que l'autre part ailleurs. » `[À VÉRIFIER en visionnant]`

---

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'application dans le seed et la base)
- **Fichier produit** : `/home/user/Marrant/docs/marrant/audit-conseils-s18/verification-etapes-parcours.md`. Aucun code, seed ni base modifié.
- **Verdicts** : 5 étapes sur 5 à corriger. Lourd : Machine à Café 2, Répartie 3, Répartie 4 (l'étape enseigne encore l'ancienne technique). Moyen : Répartie 2 (la Q2 et deux phrases). Mineur : Confiance 2 (une réponse de quiz et le `moduleDetail`).
- **Rappel technique** : à Machine à Café 2, changer aussi le `tipTitle` (rattachement par titre). Tous les remplacements gardent les positions de bonne réponse d'origine et le `correctIndex` correspondant.
- **Points à vérifier avant la mise en ligne** : les 3 légendes marquées `[À VÉRIFIER en visionnant]` (Sugar Sammy, Haroun, Kyan Khojandi & Navo). Elles retirent les affirmations de méthode (« les trois temps », « oui, et ») et ne gardent que ce que l'ancienne légende établissait déjà.
- **Contrôles faits** : zéro tiret cadratin, « vanne » partout, tutoiement, aucune marque, aucun prénom de persona, aucun chiffre du site modifié, aucune réponse de quiz qui reprend mot pour mot l'exemple du conseil (hors celle signalée à Confiance 2, corrigée).
