# Parcours — rapport de réécriture s11 (passe finale) — 29/09/2026

> Périmètre : `docs/content/parcours-seed.json` (3 parcours : Machine à Café, Répartie, Confiance).
> Brief : `docs/copy/contenus-s11/_brief.md` · Charte : `docs/copy/charte-refonte-copy-s11.md` · [CHOIX UTILISATEUR] 29/09 (`docs/founder-preferences.md` l.26-29).
> Intouchés : slug, title, duration, timePerWeek, difficulty*, icon, order, persona, nextParcours, week, tipTitle, dayNumber, moduleFormat, moduleXp, free, jokeIds, videos, correctIndex, tous les chiffres.

## Synthèse

| | Machine à Café | Répartie | Confiance | Total |
|---|---|---|---|---|
| Champs d'en-tête (description, tagline, exemple, next) | 4/4 réécrits | 4/4 réécrits | 4/4 réécrits | 12/12 |
| why / moduleTitle / moduleDetail | 9 champs : 9 réécrits | 12 champs : 10 réécrits, 2 gardés | 18 champs : 15 réécrits, 3 gardés | 34/39 |
| Questions de quiz | 12 : 10 retouchées, 2 gardées | 17 : 14 retouchées, 3 gardées | 25 : 17 retouchées, 8 gardées | 41/54 |
| Vannes / répliques « modèles » (bonnes réponses ou vannes à analyser) | 3 : 3 réécrites | 10 : 10 réécrites | 10 : 9 réécrites, 1 gardée (kebab ligne 7) | 22/23 réécrites |

- **Bonne réponse inchangée partout** : aucun `correctIndex` modifié, la logique pédagogique de chaque question est conservée (seule la formulation change).
- **Personas internes** : 9 occurrences de « Sophie » / « Marc » dans les questions de quiz → passées au « tu » (0 prénom de persona restant hors du champ technique `persona`, qui n'est pas affiché).
- **Faux témoignages** : 3/3 convertis en exemples assumés « Imagine… » ([CHOIX UTILISATEUR] 29/09).
- **CAPITALES** supprimées dans les champs réécrivables (QUAND, APRÈS, TOI, LE, EST, LA, TA, TON, AVEC, BIENVEILLANTE). « OUI-ET » gardé : c'est le nom de la technique d'impro.
- **Vulgarité** : « Ta gueule » (distracteur) → « Parle pour toi, franchement » ; « chiant » → « pénible ».
- **JSON** : relu intégralement après édition, guillemets internes uniquement en « » ou apostrophes simples → structure valide (pas de validation outillée disponible dans cette session, voir handoff).
- **Anti-doublon** : nouvelles répliques vérifiées par Grep contre `docs/content/blagues-seed.json` et `apps/web/src/lib/blog-articles.ts` (recette, didgeridoo, Michelin, coiffeur, fin du mois, frigo, visio, miroir, télécommande, piste noire, etc.) : aucune reprise. L'image « la réplique sous la douche » a été évitée volontairement (déjà 5 fois dans le blog).

## 1. Parcours Machine à Café

[Framework : FAB pour description/étapes (fonction → avantage → bénéfice) · BAB pour l'exemple « Imagine… »] · [Conscience : Product-Aware — la personne est déjà sur /parcours]

### En-tête

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| description | « Tu veux avoir des anecdotes et vannes à ressortir au bon moment ? En 3 semaines, tu auras un arsenal de vannes courtes, le bon timing pour les placer, et des techniques pour captiver tes collègues. » | RÉÉCRIRE — question rhétorique d'ouverture, « arsenal » / « captiver » = jargon marketing, zéro humour | « Pour que la pause café ne se résume plus à « Ça va ? — Ça va. ». En 3 semaines, tu te fais une réserve de vannes courtes, tu apprends à sentir le bon moment pour les placer, et tu racontes ton week-end de façon à ce qu'on te demande la suite. » (« 3 semaines » gardé) |
| personaTagline | « Idéal si tu travailles en équipe et veux briller à la pause, en réunion ou en afterwork » | RÉÉCRIRE — « briller » cliché, pas de trait | « Pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force » |
| testimonial | « Avant je restais muette à la machine à café. Maintenant c'est moi qu'on vient voir pour la vanne du jour. » | RÉÉCRIRE — témoignage fictif présenté comme réel ([CHOIX UTILISATEUR] 29/09) | « Imagine Léa, 27 ans, en open space. À la machine à café, elle avait deux répliques : « Ça va ? » et « Bon, j'y retourne ». À la fin du parcours, c'est elle que les collègues attendent le lundi pour savoir comment s'est fini son week-end. » |
| nextParcoursReason | « Tu maîtrises les vannes et le storytelling. Passe à la répartie pour savoir quoi répondre du tac au tac. » | RÉÉCRIRE — « maîtrises » surpromet, impératif sec | « Tu sais placer une vanne et raconter une histoire. Reste le cas où c'est quelqu'un d'autre qui lance la première : le parcours Répartie t'apprend à répondre du tac au tac. » |

### Étape 1 — « L'humour à la machine à café » (jour 3)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Ton terrain de jeu : la pause café. Ce conseil donne les codes exacts pour placer une vanne entre deux réunions sans forcer. » | RÉÉCRIRE — formule creuse, « codes exacts » surpromet | « La pause café, c'est le seul moment de la journée où tout le monde a envie de parler d'autre chose que du boulot. Ce conseil te donne les codes pour y glisser une vanne entre deux réunions, sans que ça sente la préparation. » |
| moduleTitle | « Vannes courtes et mémorisables » | RÉÉCRIRE — « mémorisables » = scolaire (charte §5) | « Des vannes courtes, faciles à ressortir » |
| moduleDetail | « Apprends à retenir et placer des one-liners et jeux de mots qui font mouche. Tu repars avec des vannes prêtes à l'emploi, testées pour la pause café et les réunions. » | RÉÉCRIRE — « jeux de mots » contredit la charte (calembours bannis), « testées » = promesse non vérifiable, « font mouche » cliché | « Une vanne de pause café se dit d'une traite et se comprend sans contexte. Tu apprends à en repérer, à les garder en tête et à les placer au bon moment : tu repars avec une petite réserve pour la machine à café et les réunions. » |
| quiz Q1 | « Sophie arrive à la machine à café… » + options à la 3e personne | RÉÉCRIRE — prénom de persona interne ; passage au « tu » | « Tu arrives à la machine à café, deux collègues parlent de leur week-end. Le meilleur moment pour placer ta vanne ? » Options reformulées au « tu », distracteur Slack rendu plus tentant (« pour préparer le terrain »). Bonne réponse inchangée (index 1 : attendre la fin de phrase et rebondir). |
| quiz Q2 | Options « Dès que tu arrives » / « Pendant la présentation du boss »… | RÉÉCRIRE (léger) — question gardée, options plus concrètes | « Dès que tu entres dans la salle » / « Quand tout le monde est déjà tendu » / « Juste après un moment de détente qui arrive tout seul » (index 2) / « Pendant que ta responsable présente les résultats du trimestre » |
| quiz Q3 — option 0 (bonne réponse) | « 'Mon chef m'a dit sois proactif. J'ai proactivement cherché un autre boulot.' » | RÉÉCRIRE — mécanique de répétition déjà vue partout, et vanne « je cherche un autre boulot » risquée à dire au bureau | « 'Ma boîte organise un atelier pour nous apprendre à mieux gérer notre temps. Il dure tout l'après-midi.' » — retournement : la formation au temps mange le temps. Index 0 inchangé. |
| quiz Q3 — options 1-3 | Constat plat / blague oubliée / moquerie d'un collègue | GARDER — bons distracteurs (chacun illustre une erreur) | Inchangés (virgule ajoutée option 3) |
| quiz Q4 | « Sophie a trouvé une vanne géniale… » | RÉÉCRIRE — persona interne, 3e personne | « Tu as trouvé une très bonne vanne hier soir. Comment être sûr de la ressortir au bon moment ? » Options au « tu », « 2-3 fois » gardé. Index 1 inchangé. |

### Étape 2 — « Lire le tempo du groupe » (jour 10)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Tu sais quoi dire mais pas QUAND. Ce conseil t'apprend à lire le groupe et saisir le bon moment. » | RÉÉCRIRE — CAPITALES | « Tu as la vanne, il te manque le moment. Ce conseil t'apprend à lire le groupe pour sentir quand c'est ton tour, au lieu de parler en même temps que tout le monde. » |
| moduleTitle | « L'art du timing social » | RÉÉCRIRE — « L'art du » cliché, anglicisme | « Sentir le bon moment » |
| moduleDetail | « … La différence entre un flop et un éclat de rire, c'est souvent 3 secondes. » | RÉÉCRIRE — énumération plate ; chiffre gardé | « Quand placer ta vanne en réunion, comment lire le groupe à la machine à café, quand te lancer en afterwork. Entre le flop et le fou rire, il y a souvent 3 secondes : celles où tu attends au lieu de foncer. » |
| quiz Q1 | « … puis tu pivotes avec une vanne » | RÉÉCRIRE (léger) — « pivoter » jargon | « … puis tu fais basculer la conversation avec une vanne » (index 1) |
| quiz Q2 | Bonne réponse « Savourer le silence — laisser le rire vivre » | RÉÉCRIRE — formule floue (le silence pendant qu'on rit ?) | « Ne rien ajouter et laisser le rire retomber tout seul » (index 2). Distracteur 0 rendu plus tentant (« tant que le public est chaud »). |
| quiz Q3 | Distracteur « Tu gardes ta vanne pour toi — c'est pas le moment » | RÉÉCRIRE — ce distracteur pouvait passer pour une bonne réponse | « Tu la gardes pour toi : on ne plaisante pas avec un projet qui coince » ; bonne réponse (index 1) reformulée au même sens |
| quiz Q4 | « Sophie repère… » ; « c'est LE moment » | RÉÉCRIRE — persona interne + CAPITALES | « Tes collègues ont ri 3 fois en 5 minutes. C'est le signe que : » ; « Le groupe est de bonne humeur : c'est le moment idéal pour placer ta vanne » (index 0). Chiffres gardés. |

### Étape 3 — « La règle des détails spécifiques » (jour 17)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Tu passes de la vanne courte au storytelling. Les détails spécifiques transforment tes anecdotes de weekend en moments de rire collectif. » | RÉÉCRIRE — « moments de rire collectif » corporate | « Après la vanne courte, l'anecdote. Un seul détail précis suffit à transformer « j'ai eu un week-end chargé » en histoire qu'on te redemande à la pause suivante. » |
| moduleTitle | « Raconter une anecdote captivante » | RÉÉCRIRE — « captivante » creux | « Raconter une anecdote qu'on écoute jusqu'au bout » |
| moduleDetail | « … les 3 ingrédients d'une bonne histoire à raconter entre collègues. » | RÉÉCRIRE — plat ; « 3 » gardé | « Tes histoires de boulot et de week-end ont déjà tout ce qu'il faut, il leur manque juste la mise en forme. Structure, détails, chute : les 3 ingrédients d'une anecdote qu'on raconte entre collègues sans que personne ne regarde son téléphone. » |
| quiz Q1 — bonne réponse | « 'Mardi, le mec en doudoune Decathlon m'a doublé à la boulangerie. J'avais même pas fini de dire bonjour.' » | RÉÉCRIRE — le détail est bon, la chute est une simple exagération sans retournement | « 'Mardi, un monsieur en doudoune Decathlon m'a doublé à la boulangerie. Il a pris la dernière tradition et m'a souhaité bonne journée.' » — retournement : la politesse après le vol. « Mardi » gardé. Index 1. |
| quiz Q2 | Chute plus courte que le setup | GARDER — juste et clair | Inchangé |
| quiz Q3 | « Sophie veut raconter… » ; bonne réponse « … J'ai mis 45 minutes à descendre... sur les fesses. » | RÉÉCRIRE — persona interne ; « sur les fesses » = chute attendue | « Tu racontes ton week-end au ski… Quelle version rend l'histoire drôle ? » ; « 'Devant la piste noire, le moniteur m'a dit : « Tranquille, elle est large. » J'ai mis 45 minutes à la descendre. Je l'ai faite dans la largeur.' » — la phrase rassurante du moniteur devient la chute. « 45 minutes » gardé. Index 2. Distracteur « tombée » dégenré (« J'ai pas mal chuté »). |
| quiz Q4 | Ordre contexte → tension → chute | GARDER | Inchangé |

## 2. Parcours Répartie

[Framework : PAS pour la description (problème de l'esprit de l'escalier → solution progressive) · FAB pour les étapes · BAB pour l'exemple « Imagine… »] · [Conscience : Problem-Aware → Product-Aware]

### En-tête

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| description | « Tu veux savoir quoi répondre du tac au tac sans rester muet ? En 4 semaines, tu passes de celui qui cherche ses mots à celui qui a toujours la bonne réplique. Exercices progressifs, zéro pression — même si tu es timide. » | RÉÉCRIRE — question rhétorique, surpromesse (« toujours la bonne réplique »), fin en staccato | « Pour toi qui as toujours la bonne réplique… dans ta tête, avec un temps de retard. En 4 semaines, tu apprends à la dire à voix haute et au bon moment, avec des exercices progressifs pensés pour les timides : personne ne te demande d'être brillant, juste de ne plus rester muet. » (« 4 semaines » gardé ; image « sous la douche » écartée car déjà utilisée 5 fois dans le blog) |
| personaTagline | « Pour toi si tu es étudiant, en soirée, en coloc ou en TD, et que tu veux t'affirmer » | RÉÉCRIRE — « t'affirmer » vague ; audience décrite par la situation vécue | « Pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre » |
| testimonial | « Mes potes n'en reviennent pas. En soirée, c'est moi qui ai les meilleures répliques maintenant. » | RÉÉCRIRE — faux témoignage ([CHOIX UTILISATEUR] 29/09, exemple « Tom, 21 ans, étudiant » repris de la préférence fondateur) | « Imagine Tom, 21 ans, étudiant. En soirée, il trouvait la réplique parfaite dans le bus du retour. À la fin du parcours, il la trouve pendant la soirée, et le trajet du retour est devenu beaucoup plus reposant. » |
| nextParcoursReason | « Tu as la répartie. Passe au parcours Confiance pour développer ton style personnel complet. » | RÉÉCRIRE — surpromesse + jargon | « Tu sais répondre quand on te lance une pique. Le parcours Confiance t'aide à trouver ce qui te rend drôle, toi, même quand personne ne t'a rien lancé. » |

### Étape 1 — « La répartie bienveillante » (jour 3)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Les bases : rebondir sans agresser. La répartie bienveillante s'affirme sans créer de conflit — parfait si tu es timide et que tu débutes. » | RÉÉCRIRE — ouverture scolaire « Les bases : » | « On commence par la version douce : répondre à une pique sans en lancer une plus grosse. La répartie bienveillante te fait exister dans l'échange sans déclencher de conflit, idéal quand tu débutes et que tu es plutôt timide. » |
| moduleTitle | « Les bases de la répartie » | RÉÉCRIRE — scolaire | « Tes premières répliques » |
| moduleDetail | « … Les 3 réflexes de base… C'est normal d'être timide au début, on y va progressivement. » | RÉÉCRIRE — rassurance générique ; ordre des 3 réflexes et « 3 » gardés | « Rebondir sur une remarque, accuser réception, reformuler avec humour : 3 réflexes pour ne plus rester muet en TD, en soirée ou en coloc. Si tu es timide, bonne nouvelle : tu écoutes déjà, et c'est par là que toute bonne réplique commence. » |
| quiz Q1 — bonne réponse | « 'Au moins quand j'arrive, tout le monde est content' » | RÉÉCRIRE — réplique déjà entendue, pas de retournement | « 'C'est stratégique : j'arrive pile quand vous avez fini de parler de moi.' » — accepte le reproche, le transforme en autodérision. Index 1. |
| quiz Q2 | Principe : faire rire tout le monde, y compris la cible | GARDER | Inchangé |
| quiz Q3 — bonne réponse | « 'Normal, j'étais trop occupé à comprendre tes explications' » | RÉÉCRIRE — c'est une pique déguisée, pas une répartie bienveillante (contredit la question) | « 'Rien, c'est sévère : j'ai très bien compris à quelle heure finissait le cours.' » — accepte + nuance comique sur soi. Index 2. |
| quiz Q4 | « Laquelle… BIENVEILLANTE (pas agressive) ? » sans pique de départ ; bonne réponse longue et bancale | RÉÉCRIRE — CAPITALES, réponse sans contexte | Question : « Un pote te lance « T'es vraiment pas drôle ». Laquelle de ces réponses reste bienveillante, sans agressivité ? » ; bonne réponse (index 1) : « 'Et pourtant tu m'écoutes jusqu'au bout. Soit je suis drôle, soit t'es très poli.' » (même idée que l'original : « tu continues de me parler »). Distracteur 2 adapté à la pique. |

### Étape 2 — « Le silence après le rire » (jour 10)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « … le silence APRÈS une bonne réplique est ta meilleure arme. » | RÉÉCRIRE — CAPITALES, « meilleure arme » guerrier | « Si tu as le réflexe de combler chaque blanc, ce conseil va te soulager : après une bonne réplique, le silence travaille pour toi. Tu as juste à le laisser faire. » |
| moduleTitle | « Le rythme et les silences » | GARDER — clair et juste | Inchangé |
| moduleDetail | « Apprends à… 10 mots précipités. La clé pour que tes potes écoutent quand tu parles. » | RÉÉCRIRE — impératif scolaire, « la clé » cliché ; « 10 mots » gardé | « Les pauses, le regard, le rythme : tout ce qui se passe autour de tes mots. Un bon silence avant ta réplique vaut mieux que 10 mots précipités, et c'est souvent lui qui fait que tes potes tendent l'oreille quand tu parles. » |
| quiz Q1 | « … réplique qui a mouché ton pote » ; « le silence EST la deuxième punchline » ; « t'excuser pour pas avoir été trop méchant » | RÉÉCRIRE — « moucher » contredit la répartie bienveillante, CAPITALES | « Ta réplique vient de faire rire la table, puis il y a un blanc. Ce blanc, c'est : » ; bonne réponse (index 1) : « La suite de ta réplique : ce silence, c'est la deuxième punchline, laisse-le durer ». |
| quiz Q2 | « Pourquoi le silence est une arme… » | RÉÉCRIRE (léger) — vocabulaire guerrier | « Pourquoi le silence t'aide autant en répartie ? » (options au même sens, index 1) |
| quiz Q3 | « Tu as LA réplique » | RÉÉCRIRE (léger) — CAPITALES | « … et tu tiens la réplique parfaite. Tu fais quoi ? » (options gardées, index 2) |
| quiz Q4 — bonne réponse | « '...' (pause, regard) '...j'attends d'avoir un public qui le mérite.' (sourire) » | RÉÉCRIRE — réplique un peu hautaine, vexe celui qui fait le compliment | « '...' (pause, regard) 'J'y ai pensé. Mais je veux pas perdre mon meilleur public.' (sourire) » — même timing, compliment retourné vers l'autre. Index 1. Distracteur 3 (« Stand-up ? Comme ton humour ? ») ne voulait rien dire → « 'Et toi, tu devrais faire silence.' (agressif) ». |

### Étape 3 — « Répondre aux chambrages entre potes » (jour 17)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « … pour ne plus être la cible facile entre potes. » | RÉÉCRIRE — angle victimaire ; « 3 temps » gardé | « Le cœur du parcours : une technique en 3 temps (accepter, exagérer, retourner) qui transforme le chambrage en jeu où tu marques aussi des points, au lieu d'en être la cible préférée. » |
| moduleTitle | « Retourner les piques avec le sourire » | GARDER | Inchangé |
| moduleDetail | « … Tu désarmes et tu marques des points. » | RÉÉCRIRE — chute staccato | « Un pote te chambre en soirée, quelqu'un te lance une pique en TD : tu apprends à retourner la situation avec humour, sans agressivité. L'autre rit avec toi au lieu de rire de toi, et c'est toi qui repars avec la dernière réplique. » |
| quiz Q1 | Accepter → Exagérer → Retourner | GARDER | Inchangé |
| quiz Q2 — bonne réponse | « 'Oui, j'attends que quelqu'un m'envoie un message intéressant. Toujours pas.' » | RÉÉCRIRE — chute staccato qui sous-entend que les potes sont ennuyeux | « 'Oui, j'attends un message intéressant. Je suis quelqu'un de très patient.' » — accepte, exagère (la patience infinie), retourne en autodérision. Index 1. |
| quiz Q3 — bonne réponse | « 'Ouais... et encore, là c'est la version améliorée. Imagine à 6h du mat.' » | RÉÉCRIRE — chute laissée à l'imagination, pas de retournement | « 'Et encore, là c'est retouché. La version de 6h du mat, même mon miroir l'évite.' » (« 6h » gardé). Index 1. Distracteur 0 « 'Ta gueule' » = vulgaire → « 'Parle pour toi, franchement' (attaque directe) ». |
| quiz Q4 — bonne réponse | « 'Fauché ? Non non, je pratique le minimalisme financier. C'est très tendance.' » | RÉÉCRIRE — formule « minimalisme financier » très répandue en ligne | « 'Fauché, non. Chez moi, la fin du mois arrive juste un peu plus tôt.' » Index 2. « 20€ » gardé dans le distracteur. |

### Étape 4 — « Savoir rebondir sur un raté » (jour 24)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « … C'est ça, la vraie répartie. » | RÉÉCRIRE — formule-cliché de fin | « Le niveau au-dessus : ta vanne tombe à plat, et tu t'en sers comme deuxième chance. Un raté bien rattrapé fait souvent plus rire que la vanne d'origine. » |
| moduleTitle | « Répartie avancée et improvisation » | RÉÉCRIRE — intitulé de programme scolaire | « Improviser sur l'inattendu » |
| moduleDetail | « … Tu es prêt pour toutes les situations — BDE, coloc, soirée, premier rendez-vous. » | RÉÉCRIRE — surpromesse (« toutes les situations ») ; « 2 secondes » gardé | « Accepter ce qui arrive, rebondir dessus, trouver ta réplique en moins de 2 secondes : c'est de l'impro, et ça se travaille. De quoi être à l'aise au BDE, en coloc, en soirée, et même à un premier rendez-vous. » |
| quiz Q1 — bonne réponse | « 'Bon, celle-là je la remets au four, elle est pas cuite' » | RÉÉCRIRE — image « pas cuite » très courante | « 'Celle-là, je la note « à retravailler ». Merci pour vos retours, ils sont très clairs.' » — le silence devient un « retour ». Index 2. Question dé-hachée : « Ta vanne tombe à plat, personne ne rit. Le meilleur réflexe ? » |
| quiz Q2 | Définition du OUI-ET | GARDER | Inchangé |
| quiz Q3 — bonne réponse | « 'Mon coiffeur traverse une période difficile. Mais bon, au moins je lui donne du boulot.' » | RÉÉCRIRE — 1re phrase bonne, 2e phrase explique au lieu d'ajouter | « 'Mon coiffeur traverse une période difficile. Par solidarité, je la porte avec lui.' » — OUI (la coupe est ratée) ET (je la porte, au propre et au figuré). Index 2. |
| quiz Q4 — bonne réponse | « '...et là j'ai oublié la suite. Un peu comme mon ex qui oubliait nos anniversaires.' » | RÉÉCRIRE — pique à une ex = amertume, pas d'impro sur la situation | « '...et là, j'ai perdu la suite. Si quelqu'un la retrouve, elle répond au nom de « la chute ».' » — on joue avec l'oubli au lieu de le cacher. Index 2. |
| quiz Q5 | Question « Tu : » + options mal accordées ; « TA vanne » ; « c'est ça la vraie répartie » | RÉÉCRIRE — CAPITALES, cliché, grammaire | « … Tu fais quoi ? » ; bonne réponse (index 1) : « Tu rebondis sur sa relance avec un OUI-ET : à deux, le ping-pong peut durer toute la soirée ». |

## 3. Parcours Confiance

[Framework : StoryBrand léger pour la description et l'exemple (personnage → problème → guide → réussite) · FAB pour les étapes] · [Conscience : Problem-Aware — la personne sait qu'elle a « perdu » son humour]

### En-tête

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| description | « Un parcours complet et bienveillant pour retrouver le rire et te sentir à l'aise dans toutes tes interactions. Vannes, répartie, observation, registres avancés : tu explores tout à ton rythme et tu trouves ton propre style. » | RÉÉCRIRE — autopromo (« complet et bienveillant »), « interactions » corporate, zéro humour | « Pour le jour où tu te rends compte que ça fait longtemps que tu n'as fait rire personne, toi compris. Observation, autodérision, répartie, registres avancés : tu reprends tout à ton rythme, jusqu'à retrouver un humour qui te ressemble. » |
| personaTagline | « Parfait si tu veux renouer avec l'humour et retrouver ta légèreté après une période difficile » | RÉÉCRIRE (léger) — « Parfait si » formule | « Pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer » |
| testimonial | « Après ma séparation, j'avais perdu mon humour. Ce parcours m'a aidé à retrouver ma légèreté, étape par étape. » | RÉÉCRIRE — faux témoignage ([CHOIX UTILISATEUR] 29/09) | « Imagine Julien, 36 ans, qui sort d'une séparation. Il commence par noter ce qui le fait sourire dans sa journée. Quelques semaines plus tard, à un dîner, c'est lui qui raconte, et toute la table rit. Lui aussi, d'ailleurs. » |
| nextParcoursReason | « Tu as retrouvé ton style. Enrichis ton arsenal avec le Parcours Machine à Café pour briller au quotidien. » | RÉÉCRIRE — « arsenal », « briller » | « Ton style est là. Le parcours Machine à Café te donne de quoi le faire vivre au quotidien : des vannes courtes et des anecdotes à raconter au bureau comme au dîner. » |

### Étape 1 — « Retrouver sa voix drôle après une pause sociale » (jour 3)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Un démarrage en douceur : micro-vannes au quotidien, zéro pression, juste observer et commenter. La base pour retrouver ta légèreté. » | RÉÉCRIRE — fragments, « zéro pression » tic | « On démarre en douceur : aucune vanne à réussir, juste regarder ta journée et remarquer ce qui cloche. C'est souvent par là que la légèreté revient. » |
| moduleTitle | « Redécouvrir ce qui te fait rire » | GARDER | Inchangé |
| moduleDetail | « Observer le quotidien avec un oeil comique… Le point de départ pour reconstruire ta confiance, sans pression. » | RÉÉCRIRE — formule creuse, typo « oeil » | « Regarder ton quotidien avec un œil comique, noter ce qui te fait sourire, comprendre ce qui te fait rire, toi. Ici, pas d'exercice à rater : chaque détail noté compte déjà. » |
| quiz Q1 | « … la meilleure approche c'est : » ; « Forcer des blagues… » | RÉÉCRIRE (léger) — tutoiement | « Pour retrouver ton humour après une pause, la meilleure approche : » ; options au « tu », « 10h » gardé. Index 1. |
| quiz Q2 | Journal d'observation comique | GARDER | Inchangé |
| quiz Q3 | « Marc est dans le métro… » ; bonne réponse « 'Kebab 8h, métro ligne 7. L'homme avait l'air en paix avec lui-même. Moi non.' » | Question RÉÉCRIRE (persona interne) · réponse GARDER — vrai retournement (sa sérénité contre ma perplexité), économie de mots, niveau étalon | « Dans le métro, un type mange un kebab à 8h du matin. Ton regard d'observateur comique ? » Index 1. |
| quiz Q4 | « Marc hésite… Il devrait : » | RÉÉCRIRE — persona interne | « Tu hésites à lâcher une petite remarque drôle devant un ami. Tu devrais : » ; « 5 fois » gardé. Index 1. |

### Étape 2 — « Le pouvoir de l'auto-dérision » (jour 10)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Apprends à rire de toi-même avec bienveillance. L'autodérision est l'outil #1 pour reconstruire la confiance — rire de soi montre qu'on s'accepte. » | RÉÉCRIRE — impératif scolaire ; « #1 » gardé (voir points signalés) | « Rire de toi, sans te taper dessus. L'autodérision est l'outil #1 pour reprendre confiance : quand tu ris le premier de ce qui t'arrive, tu montres que tu t'acceptes, et les autres le sentent tout de suite. » |
| moduleTitle | « Rire de soi avec bienveillance » | RÉÉCRIRE — impersonnel | « Rire de toi sans te rabaisser » |
| moduleDetail | « … c'est un équilibre subtil et puissant. » | RÉÉCRIRE — jargon marketing | « Transformer un moment gênant en anecdote drôle, sans te dévaloriser au passage. Entre « je suis nul » et « regardez ce qui m'est arrivé », la frontière est fine : tu apprends à rester du bon côté. » |
| quiz Q1 | « … a un twist drôle, la triste est juste déprimante » | RÉÉCRIRE (léger) — anglicisme ; réponse devenue elle-même un petit trait | « La bienveillante finit sur un retournement drôle, la triste finit juste… triste ». Index 1. |
| quiz Q2 — vanne étudiée | « 'Je suis tellement mauvais en cuisine que mon détecteur de fumée me sert de minuteur.' » | RÉÉCRIRE — classique d'Internet (déjà refusé par Thomas sur la page n°1 : « l'alarme incendie est mon minuteur ») | « 'Mes invités me demandent toujours la recette. Pour être sûrs de pas la refaire.' » — le compliment habituel devient l'aveu. « AVEC lui » décapitalisé : « on rit avec lui, pas de lui ». Index 1. |
| quiz Q3 — bonne réponse | « 'J'ai mis 3h à monter une étagère Billy. Le manuel disait 30 minutes. Mon fils de 8 ans a proposé de m'aider.' » | RÉÉCRIRE — bonne base, chute qui s'arrête avant le retournement ; chiffres gardés | « 'J'ai mis 3h à monter une étagère Billy, le manuel disait 30 minutes. Mon fils de 8 ans a fini par m'aider : il m'a confié la notice.' » — l'enfant devient le chef de chantier. Question passée au « tu ». Index 1. |
| quiz Q4 | Quand éviter l'autodérision | GARDER | Inchangé |

### Étape 3 — « L'humour de trentenaire » (jour 17)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Ton vécu (MSN, K7, avant/après Internet) est une mine d'or. … un avantage, pas un handicap. » | RÉÉCRIRE — « mine d'or » cliché, « handicap » maladroit | « Tu as connu MSN, les K7 et la vie avant Internet : tu as vu deux mondes, et ça te donne un angle que les plus jeunes n'ont pas. Tes références sont une ressource, pas un aveu d'âge. » |
| moduleTitle | « L'art de l'observation comique » | RÉÉCRIRE — « L'art de » cliché | « L'œil de l'observateur » |
| moduleDetail | « … Tu développes un regard neuf qui alimente tes conversations en dîners et sorties entre amis. » | RÉÉCRIRE — fin plate | « … Au bout d'un moment, tu ne vas plus faire les courses : tu pars en repérage, et tu reviens avec de quoi animer le prochain dîner. » |
| quiz Q1 | « Marc est au supermarché… » ; « … comme si c'était une décision de vie » | RÉÉCRIRE — persona interne ; comparaison plus précise | « Au supermarché, rayon fromage. Ton regard d'observateur comique ? » ; « Remarquer le type qui hésite 4 minutes entre Président et Cœur de Lion, avec la gravité de quelqu'un qui signe un bail » (« 4 minutes » gardé). Index 1. |
| quiz Q2 | « Une mine d'or comique — tu as vécu deux époques » | RÉÉCRIRE (léger) — cliché | « Une vraie matière comique : tu as vécu deux époques ». Index 1. |
| quiz Q3 — bonne réponse | « 'Mes parents me donnaient une carte Michelin. Je me sentais comme un agent secret. Sauf que l'agent secret confondait pas le Nord et le Sud.' » | RÉÉCRIRE — setup en 2 temps, chute plus longue que l'idée | « 'Petit, j'étais le GPS de la famille : une carte Michelin et beaucoup d'assurance. On partait pour Biarritz. On a découvert Clermont-Ferrand.' » — la réf trentenaire (carte papier) + retournement géographique. Question passée au neutre. Index 1. |
| quiz Q4 | Repérer → Exagérer → Partager | GARDER | Inchangé |

### Étape 4 — « Trouver sa place dans un groupe qui rit » (jour 24)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Tu passes de l'observation à la participation. Des techniques concrètes… sans forcer. » | RÉÉCRIRE (léger) — doublon avec moduleDetail | « Après avoir observé, tu participes. Des techniques concrètes pour prendre ta place dans un groupe, sans jouer des coudes ni attendre qu'on te la donne. » |
| moduleTitle | « Être à l'aise en groupe » | GARDER | Inchangé |
| moduleDetail | « … ne plus être spectateur. Des techniques concrètes pour… » | RÉÉCRIRE — répétition « techniques concrètes » | « Participer avec légèreté, rebondir sur ce que disent les autres, passer du public à la scène sans prendre toute la place. Pour les dîners entre amis, les apéros et les soirées où tu ne connais que la personne qui invite. » |
| quiz Q1, Q2, Q4 | Stratégie dîner (« 15 min », « 2-3 remarques ») / rôles dans le groupe / monopolisateur | GARDER — clairs, distracteurs drôles (« Présent physiquement ») | Inchangés |
| quiz Q3 — bonne réponse | « 'Le pire c'est que ça m'est arrivé aussi, sauf que moi c'était devant ma belle-mère' » | RÉÉCRIRE — « belle-mère » = ressort de vanne de tonton | « 'Il m'est arrivé la même chose. Sauf que moi, c'était en visio, caméra allumée.' » — surenchère courte qui sert l'histoire de l'autre au lieu de la voler. Index 1. |

### Étape 5 — « Le décalage de registre » (jour 31)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Un registre avancé : utiliser un ton inattendu pour surprendre… — et elle s'apprend. » | RÉÉCRIRE — définition scolaire ; on montre au lieu de définir | « Parler d'un frigo vide comme d'un courrier officiel : le décalage entre le sujet et le ton est une technique de stand-up pro, et elle s'apprend plus vite qu'on ne le croit. » |
| moduleTitle | « Les registres avancés » | RÉÉCRIRE — intitulé de cours | « Jouer avec les registres » |
| moduleDetail | « … Chacun a un style — à toi de trouver celui qui te ressemble. » | RÉÉCRIRE — cliché de fin | « Absurde, ironie, second degré : tu essaies chaque registre pour voir lequel te va, un peu comme en cabine d'essayage, sauf qu'ici personne ne t'attend dehors en soupirant. » |
| quiz Q1 — vanne étudiée | « 'Suite à un audit de mon frigo, je suis au regret de vous informer qu'il ne reste que de la moutarde.' » | RÉÉCRIRE — « frigo vide + moutarde » = image très répandue | « 'Après examen de votre dossier, mon frigo a le regret de ne pas donner suite à votre demande de dîner.' » — lettre de refus RH appliquée au frigo. La bonne réponse (« vocabulaire corporate pour un sujet banal ») reste exacte. Index 1. |
| quiz Q2 | Contraste ton/sujet | GARDER | Inchangé |
| quiz Q3 — bonne réponse | « 'Dimanche j'ai procédé à une opération de décontamination… 3 chaussettes orphelines rapatriées, 1 assiette portée disparue…' » | RÉÉCRIRE — « chaussettes orphelines » cliché ; registre militaire/fait divers poussé jusqu'au bout ; chiffres gardés | « 'Dimanche, opération de décontamination de l'appartement. Bilan : 3 chaussettes rapatriées, 1 assiette portée disparue retrouvée sous le canapé. Les recherches continuent pour la télécommande.' » Distracteur « c'est chiant » → « c'est pénible » (registre). Question au « tu ». Index 1. |
| quiz Q4 — vanne étudiée | « 'J'ai une relation compliquée avec mon réveil. On se voit tous les matins mais y'a zéro amour.' » | RÉÉCRIRE — « relation compliquée avec mon réveil » très vue, pas de retournement | « 'Mon réveil et moi, on traverse une mauvaise passe. Il est toujours là pour moi, et moi, chaque matin, je le repousse.' » — vocabulaire de couple + « repousser » (le rejeter / appuyer sur « répéter ») : double sens de situation, pas de son. Index 2. |

### Étape 6 — « Développer son style personnel » (jour 38)

| Champ | Avant | Verdict | Après |
|---|---|---|---|
| why | « Le sommet du parcours : identifier ce qui marche pour TOI… Tu repars avec ton propre style. » | RÉÉCRIRE — CAPITALES, doublon mot pour mot avec moduleDetail | « Dernière étape : tu fais le tri entre tout ce que tu as essayé et ce qui te ressemble vraiment. Tu ne repars pas avec des vannes empruntées, mais avec ta façon à toi de voir les choses. » |
| moduleTitle | « Affirmer ton style personnel » | GARDER | Inchangé |
| moduleDetail | « … Tu repars avec un kit d'humour personnalisé, adapté à ta vie sociale. » | RÉÉCRIRE — « kit personnalisé » jargon | « Repérer ce qui marche pour toi, te constituer un répertoire, garder les bons réflexes une fois le parcours terminé. Tu repars avec un humour qui a ta voix, pas celle de ton humoriste préféré. » |
| quiz Q1 | « … analyser les patterns » | RÉÉCRIRE (léger) — anglicisme | « … et repérer ce qui revient ». Index 1. |
| quiz Q2 | Pince-sans-rire | GARDER | Inchangé |
| quiz Q3 | « c'est TON regard » | RÉÉCRIRE (léger) — CAPITALES | « … : c'est ton regard qui le rend drôle ». Index 1. |
| quiz Q4 | « Marc a testé… Il préfère… » | RÉÉCRIRE — persona interne | « Tu as testé l'observation, l'autodérision et le décalage de registre, et c'est l'autodérision que tu préfères. Prochaine étape ? » ; bonne réponse « En faire ton registre principal, et garder les autres en réserve pour varier ». Index 1. |
| quiz Q5 — bonne réponse | « 'J'ai découvert que mon voisin fait du didgeridoo à 7h. Mon réveil est devenu inutile.' » | RÉÉCRIRE — « voisin bruyant = réveil » très courant | « 'Mon voisin s'est mis au didgeridoo, tous les matins à 7h. Je suis furieux et, depuis, parfaitement ponctuel.' » — la colère et le bénéfice dans la même phrase. « 7h » gardé. Index 2. |

## 4. Points signalés (décision Thomas)

1. **Âges ajoutés dans les exemples « Imagine… »** (Léa 27 ans, Tom 21 ans, Julien 36 ans) et « deux répliques » (Léa) : ce ne sont pas des stats, mais ce sont des nombres nouveaux. Repris du format validé dans la préférence fondateur (« Imagine Tom, 21 ans, étudiant… »). Prénoms choisis hors personas internes et hors noms d'humoristes des vidéos. À retirer si Thomas préfère zéro nombre ajouté.
2. **« l'outil #1 »** (Confiance, étape 2, `why`) : affirmation de classement non sourcée. Gardée telle quelle (règle « améliorer, pas amputer ») — à trancher.
3. **« zéro amour »** (Confiance, étape 5, Q4) : le mot « zéro » a disparu avec la réécriture de la vanne (idée faible, « relation compliquée avec mon réveil » très répandue). Ce n'est pas un chiffre au sens statistique, mais je le signale par rigueur.
4. **« sauf un » → « plus qu'une personne »** (Machine à Café, étape 1, Q1) : même quantité, formulation différente.
5. **« Tu es timide… c'est par là que toute bonne réplique commence »** (Répartie, étape 1) et **« Un raté bien rattrapé fait souvent plus rire que la vanne d'origine »** (Répartie, étape 4) : affirmations pédagogiques, pas des stats — cohérentes avec les conseils existants, mais à valider si Thomas veut un ton plus prudent.
6. **Hors périmètre, non touché mais à revoir** : les `videos[].why` gardent des CAPITALES (« LE sketch qui enseigne le silence », « trouver SON phrasé »), des tirets cadratins en série et des anglicismes (« masterclass », « storytelling captivant »). Champ déclaré intouchable dans ma mission : je signale sans modifier.
7. **Hors périmètre** : les `tipTitle` « Le pouvoir de l'auto-dérision » (avec tiret) coexiste avec « autodérision » partout ailleurs ; le titre sert de clé vers le conseil, donc non modifié.
8. **Cohérence durée** : `timePerWeek` gardé (15 / 20 / 20 min), conforme à la préférence « 15 à 20 min/semaine selon le parcours ».
9. **Libellés « Semaine N »** : aucun n'apparaît dans les champs texte du seed. Mais le code en génère un à partir du champ `week` : `apps/web/src/components/parcours/parcours-content.tsx:25` → `` week: `Semaine ${s.week}` ``. Pour respecter la charte (« Semaine 1 » → « Étape 1 »), @fullstack peut passer ce libellé en `` `Étape ${s.week}` `` (hors de mon périmètre, non modifié).

---
**Handoff → @orchestrator**
- Fichier modifié : `/home/user/Marrant/docs/content/parcours-seed.json` (champs réécrivables uniquement). Rapport : `/home/user/Marrant/docs/copy/contenus-s11/parcours-rapport.md`.
- Décisions : voix « pote drôle et bienveillant », tutoiement, zéro prénom de persona interne dans le texte affiché, 3 exemples « Imagine… », 22 répliques modèles réécrites sur 23 avec un vrai retournement, tous les `correctIndex` et tous les chiffres conservés.
- À faire côté @fullstack / Thomas : lancer une validation JSON (`node -e "JSON.parse(require('fs').readFileSync('docs/content/parcours-seed.json','utf8'))"`) puis le build check (commandement 6) — le seed est importé par 4 fichiers de `apps/web/src`. Pas de Bash dans cette session : la validité a été vérifiée par relecture complète.
- Historique `project-context.md` non mis à jour (consigne : aucun autre fichier modifié) — à reporter par l'orchestrateur.
- Pas de commit.
