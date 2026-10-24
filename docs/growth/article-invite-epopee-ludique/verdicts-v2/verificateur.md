# Verdict du vérificateur : article invité v2 (L'Épopée Ludique)

Texte relu : `scratchpad/relecture/texte-v2.md` (numéros de ligne ci-dessous = ce fichier). Phrase de transparence et bio : hors notation.

**Note globale : 8,5/10. Sous la barre (10/10, aucun critère sous 9) : NO-GO, v3 à repasser à l'aveugle.**

Les propositions ci-dessous gardent les guillemets français : conserver les espaces insécables à l'intérieur au moment du collage.

## 1. Contraintes binaires de la grille

| Contrainte | Verdict | Preuve |
|---|---|---|
| Titre exact, titre SEO et méta fournis | PASS | l.1 identique au titre imposé ; l.3 et l.5 présents |
| Corps 1 300 à 1 600 mots | PASS | Comptage manuel, mot par mot, de l'intro (l.7) à la fin de la conclusion (l.121), lien compté comme son ancre : 1 427 mots hors intertitres, 1 480 avec (les mots élidés comme « l'humour » comptent pour un) |
| Tutoiement partout | PASS (réserve) | Aucun vouvoiement. Seul « vous » du texte, l.11 « ne demandent rien d'autre que vous » : c'est un pluriel (toi et tes enfants), mais c'est la seule fois où le lecteur est désigné par « vous », donc il peut lire un vouvoiement. Voir correction 7.1 |
| Mot-clé : 100 premiers mots, intertitre de conclusion, au plus 2 de plus | PASS | l.7 (vers le 45e mot), l.117 ; aucune autre occurrence dans le corps. L'occurrence de la l.7 passe naturellement |
| 6 jeux numérotés, champs complets | PASS | Les 6 jeux ont Dès, Matériel : aucun, La règle, Exemple, Selon l'âge (3 tranches), S'il ne veut pas jouer. Ordre du plan respecté |
| Adaptations du plan | PASS (réserve) | Libellés conformes pour les 6 jeux. Réserve : jeu 2, l'exemple 9 ans et plus (l.39) n'est pas un double sens (voir 5.2) |
| Exemples développés en 1 ou 2 répliques | PASS | l.19, 34, 49, 64, 79, 94 |
| Sections « Rire avec… » et « Quand une blague tombe à plat » | PASS | l.107 (situations, objets, soi ; ce que l'enfant dit sérieusement) ; l.109 (« Dès qu'il ne rit plus, on s'arrête ») ; l.115 (ne pas expliquer, ne pas répéter, sourire, saluer l'essai, passer à la suite) |
| Liens | PASS | Corps : un seul lien, l.101, URL exacte, ancre « petites habitudes d'humour au quotidien ». La page cible existe et parle bien de ça (`apps/web/src/lib/blog-articles.ts:536`, habitude « noter une absurdité par jour »). Bio : URL conforme |
| Transparence et bio | NON ÉVALUÉ | Hors notation (décision de l'auteur en cours) |
| Tirets cadratins ou demi-cadratins, guillemets droits, émojis, insécables dans « » | PASS | Grep sur `[—–"]`, sur `« ` et ` »` en espace simple : 0 résultat. Aucun émoji |
| Zéro faute d'orthographe | **FAIL** | l.97 « ? ». (point en trop) ; l.103 « Raconte la tienne » (pronom sans antécédent féminin) ; l.94 « et lui a regardé ailleurs » (se lit « il lui a regardé ») ; l.64 « du ton d'un présentateur » et « tient son regard » (impropriétés). Détail en partie 3 |
| Zéro concurrent nommé | PASS | Aucun |
| Zéro anecdote vécue, zéro enfant d'Alex, zéro chiffre sans source | PASS | Ouverture au « tu » (l.7) ; l'exemple du jeu 6 est attribué à « un parent » (l.94) ; « à ma place » (l.49) est une réplique de joueur. Aucun chiffre statistique |
| Zéro formule typique d'IA | **FAIL** | l.9 « Rire ensemble, c'est déjà de la complicité » ; l.119 « Ce qui compte, c'est le moment partagé. » (aphorismes) ; l.56 triplet décoratif « la porte…, la cloche…, et le « Miaou ? »… » |
| Texte inédit (recoupement avec les 38 articles) | HORS PÉRIMÈTRE | Contrôle fait par la session, pas par les relecteurs |
| Aucune promo de Deviens Marrant hors lien jeu 6 et bio | PASS | Le nom n'apparaît que dans la bio ; la phrase du lien (l.101) n'est pas promotionnelle |

**Bilan : 2 FAIL (orthographe, formules d'IA), 2 réserves.**

## 2. Notes par critère

| # | Critère | Note | Corrections exigées |
|---|---|---|---|
| 1 | Voix humaine | 8/10 | 1.1 à 1.6 |
| 2 | Drôle sans forcer | 9/10 | 2.1 à 2.2 |
| 3 | Chaleur et zéro culpabilisation | 9/10 | 3.1 à 3.4 |
| 4 | Concret et envie de jouer ce soir | 9/10 | 4.1 à 4.2 |
| 5 | Justesse | 8/10 | 5.1 à 5.7 |
| 6 | Accroche et tenue | 9/10 | 6.1 |
| 7 | Place sur L'Épopée Ludique | 9/10 | 7.1 |
| 8 | Lien et sobriété | 9/10 | 8.1 |
| | **Global** | **8,5/10** | |

Ce qui tient déjà (rien à toucher) : la scène de 18 h 40, le rappel de la casserole en fin d'article, les chaussettes (jeu 1), la météo du salon, le chien qui « attendait un autre bus », « « rien aujourd'hui » est une réponse complète », la dernière phrase. Aucune phrase ne juge le parent.

### Critère 1 : Voix humaine (8/10)

**1.1** l.9 : « L'humour se cultive en jouant, comme le vélo, avec quelques gamelles. Rire ensemble, c'est déjà de la complicité, et une bêtise inventée un mardi soir finit parfois en mot de passe familial, qu'on ressort des années plus tard devant des gens qui n'y comprennent rien. »
Deux défauts : la comparaison boite (l'humour « se cultive », le vélo ne « se cultive » pas) et « Rire ensemble, c'est déjà de la complicité » est une formule creuse en « X, c'est Y ».
> L'humour se cultive en jouant, et ça s'apprend un peu comme le vélo : avec quelques gamelles. Une bêtise inventée un mardi soir finit parfois en mot de passe familial, qu'on ressort des années plus tard devant des gens qui n'y comprennent rien.

**1.2** l.119 : « Un jeu de temps en temps fera très bien l'affaire. Ce qui compte, c'est le moment partagé. »
Une conclusion qui répète l'intertitre (« un seul suffit ») et se ferme sur un aphorisme. Supprimer les deux phrases. Le paragraphe devient :
> Personne ne te demande de tous les jouer, ni de bien les jouer. Prends celui qui te ressemble le plus et sors-le quand l'occasion se présente : avant le dîner ou dans la salle d'attente du dentiste.

**1.3** « très bien » revient 5 fois : l.7 « se remplissent très bien », l.49 « très bien tenu », l.62 « ça peut très bien être », l.115 « fait très bien l'affaire », l.119 « fera très bien l'affaire » (la l.119 disparaît avec 1.2).
- l.7 : « elles se remplissent très bien avec des jeux » → « elles se remplissent facilement avec des jeux »
- l.62 : « et ça peut très bien être celui qui parle » → « et ça peut parfaitement être celui qui parle »
- l.115 : voir 3.3 (la phrase disparaît)

**1.4** l.56 : « la porte de la classe qui grince, la cloche de la récré, et le « Miaou ? » du chat quand la maîtresse fait l'appel. »
Triplet décoratif avec « et » avant le dernier élément, le rythme ternaire réflexe. Deux éléments suffisent, et la chute reste.
> **S'il ne veut pas jouer :** il peut écouter, ou devenir bruiteur officiel : la porte de la classe qui grince, puis le « Miaou ? » du chat quand la maîtresse fait l'appel.

**1.5** l.109 : « Tant qu'il rit avec toi, c'est du jeu. Dès qu'il ne rit plus, on s'arrête, sans « mais c'était pour rire », et on passe à autre chose. »
Symétrie « Tant que… / Dès que… », qui fait maxime. La consigne d'Helena reste mot pour mot.
> Le repère est simple : dès qu'il ne rit plus, on s'arrête, sans « mais c'était pour rire », et on passe à autre chose.

**1.6** Écho de structure entre le jeu 1 (l.26 « S'il ne dit rien, tant pis : … ») et le jeu 5 (l.86 « S'il le reprend, tant mieux. Sinon, … ») : la même mécanique de fin, en miroir. Corrigé par 3.1 et 3.2.

### Critère 2 : Drôle sans forcer (9/10)

**2.1** l.49 : « a demandé s'il y avait une récré pour les souris. » On ne voit pas tout de suite si le chat veut chasser les souris ou s'il les invite. L'exemple est le plus plat des six, et c'est celui que le parent lira à voix haute.
> « Il s'est installé au fond de la classe et a demandé à quelle heure passait la cantine. »

**2.2** l.64 : la météo finit sur sa réplique la plus faible (« Les habitants du canapé sont priés de ne pas bouger. »), après une redite de « sous » (« sous la table », « sous les meubles »). Corrigé en même temps que 5.4 :
> « Ce soir, un front de doudous traversera le canapé par l'ouest. Des averses de miettes sont à prévoir sous la table, et quelques moutons de poussière pourraient se lever derrière la télé. Les habitants du canapé sont priés de ne pas bouger. »
Si la dernière phrase ne fait sourire aucun des deux autres relecteurs, la supprimer : l'exemple tient avec deux répliques.

### Critère 3 : Chaleur et zéro culpabilisation (9/10)

**3.1** l.26 : « S'il ne dit rien, tant pis : tu t'es amusé, et il a tout entendu. »
« et il a tout entendu » fait un clin d'œil : la porte de sortie devient une ruse pour l'accrocher quand même, ce que la grille exclut. En plus, « amusé » au masculin alors que le blog est tenu par une mère et lu en grande partie par des mères.
> **S'il ne veut pas jouer :** lances-en un pour toi, à voix haute, en regardant la casserole. S'il ne dit rien, tant pis : toi, au moins, tu auras passé un bon moment.

**3.2** l.86 : « S'il le reprend, tant mieux. Sinon, tu auras ton mot à toi. »
Même travers : le but avoué reste qu'il joue.
> **S'il ne veut pas jouer :** invente un mot pour toi et ressors-le plus tard dans la soirée, comme si de rien n'était : « Passe-moi la chapluie. » Ce mot est à toi, personne n'est obligé de l'adopter.

**3.3** l.115 : « Salue l'essai d'un sourire (« Audacieuse, celle-là ») et passe au tour suivant. Si c'est ton enfant qui vient de se lancer, un sourire fait très bien l'affaire. »
Doublon : le sourire est demandé deux fois et on ne sait plus qui a raté la blague dans la première phrase. Le paragraphe entier :
> Ne l'explique pas et ne la répète pas plus fort. Si c'est ton enfant qui s'est lancé, salue l'essai d'un sourire (« Audacieuse, celle-là ») et passe au tour suivant. Et quand c'est la tienne qui tombe à plat, hausse les épaules, lâche un « Celle-là, je la retire » et enchaîne.
(Avec 5.5 sur la première phrase.)

**3.4** l.11 : « L'enfant peut toujours passer son tour ou regarder en souriant dans son coin. »
« en souriant » glisse une attente : même celui qui regarde est censé s'amuser.
> L'enfant peut toujours passer son tour, ou juste regarder.

### Critère 4 : Concret et envie de jouer ce soir (9/10)

**4.1** l.71 : « il devient l'arbitre, et c'est le meilleur poste ». Le rôle est imposé (« il devient »), et un arbitre suppose deux autres joueurs : à deux (un parent, un enfant qui refuse), il n'y a plus de partie. Le parent qui a un seul enfant ne sait pas quoi faire.
> **S'il ne veut pas jouer :** il peut arbitrer une partie entre deux autres joueurs, et c'est le meilleur poste : il décide qui a ri, et personne ne peut le contredire. Ou il regarde, tout simplement.

**4.2** l.84 : la tranche 9 ans et plus du jeu 5 annonce « une phrase d'exemple prononcée avec le plus grand sérieux » sans en donner une. C'est la seule tranche 9 ans et plus qui demande une production nouvelle sans modèle. (La virgule de « sa définition, et » saute au passage.)
> - **9 ans et plus :** une page du dictionnaire de la famille, composée à voix haute : le mot, sa définition et une phrase d'exemple prononcée avec le plus grand sérieux (« Scotchimère, nom féminin. Exemple : le cadeau de mamie restera emballé tant qu'on n'aura pas retrouvé le scotchimère. »).

### Critère 5 : Justesse (8/10)

Rien d'inventé, aucun chiffre, aucune anecdote vécue. Les points perdus viennent des incohérences internes entre règle et exemple.

**5.1** l.79 : « le début du rouleau, qu'on cherche à l'ongle pendant dix minutes avant d'abandonner et de couper avec les dents. »
Illogique : si on ne trouve pas le début du rouleau, on n'a rien à couper avec les dents. Et « le début du rouleau » a déjà un nom ; la chose sans nom, c'est le début introuvable.
> **Exemple :** « Un scotchimère : le début du rouleau de scotch, introuvable, qu'on gratte à l'ongle pendant dix minutes avant de prendre un autre rouleau. »

**5.2** l.39 : « **9 ans et plus :** indices à double sens. « Je pleure toute la nuit sans avoir de chagrin, et personne ne vient me consoler. » (Le robinet qui goutte.) »
« Je pleure » est une métaphore, pas un double sens (un même mot avec deux sens). Et la règle (l.32) annonce trois indices, l'exemple n'en donne qu'un.
> - **9 ans et plus :** indices à double sens. « J'ai des dents, mais je n'ai jamais vu de dentiste. Je passe mes journées dans les cheveux de quelqu'un. Et le matin, tout le monde me tire dessus. » (Le peigne.)

**5.3** l.37 : « (« Je suis au plafond, et je fais le soleil quand on appuie sur mon bouton. » La lampe). »
Deux indices au lieu de trois, aucun farfelu, et le bouton est sur le mur, pas sur la lampe. La réponse n'a pas non plus la même mise en forme que l.34 et l.39 (entre parenthèses, avec un point).
> - **3-5 ans :** on prend des objets visibles dans la pièce, et pointer du doigt compte comme une réponse : « Je suis au plafond. Quand on appuie sur l'interrupteur, je fais le soleil. Et la nuit, je joue à chat avec les papillons. » (La lampe.)

**5.4** l.64 : « du ton d'un présentateur du journal de 20 heures, pendant que l'autre tient son regard sans broncher ». On dit « sur le ton de » et « soutenir le regard » ; « tenir son regard » est un calque de l'anglais.
> **Exemple :** l'un annonce la météo du salon, sur le ton d'un présentateur du journal de 20 heures, pendant que l'autre soutient son regard sans broncher :

**5.5** l.115 : « Ne l'explique pas et ne la répète pas plus fort. » La phrase d'avant (l.113) a pour sujet « un « et si » », masculin : « la » n'a plus d'antécédent visible.
> N'explique pas la blague et ne la répète pas plus fort.

**5.6** l.41 : « ou faire le juge : c'est lui qui dit si ta réponse est bonne ». Pour juger, il doit connaître l'objet, que ni la règle ni le texte ne lui donnent : qui pose la devinette, et qui devine ?
> **S'il ne veut pas jouer :** il peut juste regarder, ou faire le juge : celui qui pose la devinette lui souffle la réponse à l'oreille, et c'est lui qui dit si les propositions sont bonnes. Toi, tu proposes « Le frigo ? » trois fois de suite, sans te démonter.
(« sans te démonter » remplace « avec beaucoup d'aplomb », déjà employé l.86.)

**5.7** l.107 : « peut te sembler irrésistible, mais pour lui c'est une vraie question. » Une théorie n'est pas une question.
> Sa théorie sur les nuages, qui seraient de la barbe à papa pour géants, peut te sembler irrésistible, mais pour lui, c'est très sérieux.

### Critère 6 : Accroche et tenue (9/10)

**6.1** l.77 : la règle lance « Il n'y a pas de mot pour le moment où on cherche son téléphone alors qu'on l'a dans la main. On l'appelle comment ? », et cette question ne reçoit jamais de réponse : l'exemple qui suit parle d'autre chose. Le lecteur reste sur sa faim. Faire de la question de lancement celle que l'exemple résout :
> **La règle :** on invente un mot pour une chose qui n'en a pas, et on en donne la définition. Pour lancer : « Il n'y a pas de mot pour le début du rouleau de scotch qu'on ne retrouve jamais. On l'appelle comment ? »
(L'exemple 5.1 répond alors à la question.)

### Critère 7 : Place sur L'Épopée Ludique (9/10)

Plan du 20/10 respecté (intro, 6 jeux dans l'ordre, les deux sections, conclusion), registre conforme.

**7.1** l.11 : « Les six jeux qui suivent ne demandent rien d'autre que vous. » C'est le seul « vous » du texte : sur un blog qui tutoie, on le lit comme un vouvoiement.
> Les six jeux qui suivent se jouent à voix haute, sans rien sortir du placard.

### Critère 8 : Lien et sobriété (9/10)

**8.1** l.101 : le paragraphe du lien est glissé entre « Selon l'âge » et « S'il ne veut pas jouer », seul endroit où le format fixe des six jeux est cassé. Le parent qui cherche la porte de sortie tombe sur un conseil pour adultes. Déplacer le paragraphe, sans le modifier, après la l.103 (fin du jeu 6, avant « Rire avec son enfant plutôt que de lui »). Le lien reste utile à cet endroit : la page cible propose justement de noter une absurdité par jour.

## 3. Liste exhaustive : tics, fautes, incohérences, affirmations non sourcées

| # | Ligne | Type | Passage exact | Réécriture |
|---|---|---|---|---|
| 1 | 9 | Tic (formule creuse) + comparaison bancale | « L'humour se cultive en jouant, comme le vélo, avec quelques gamelles. Rire ensemble, c'est déjà de la complicité, et une bêtise… » | voir 1.1 |
| 2 | 11 | Ambiguïté tutoiement | « ne demandent rien d'autre que vous » | voir 7.1 |
| 3 | 11 | Attente implicite | « regarder en souriant dans son coin » | voir 3.4 |
| 4 | 7, 49, 62, 115, 119 | Répétition | « très bien » ×5 | voir 1.3 |
| 5 | 26 | Ruse déguisée en porte de sortie + masculin | « tu t'es amusé, et il a tout entendu » | voir 3.1 |
| 6 | 37 | Incohérence règle/exemple + mise en forme | « (« Je suis au plafond, et je fais le soleil quand on appuie sur mon bouton. » La lampe). » | voir 5.3 |
| 7 | 39 | Incohérence (pas un double sens, un seul indice) | « Je pleure toute la nuit sans avoir de chagrin… » (Le robinet qui goutte.) | voir 5.2 |
| 8 | 41 | Incohérence logique (juge sans réponse) + répétition « aplomb » (l.41 et l.86) | « ou faire le juge : c'est lui qui dit si ta réponse est bonne… avec beaucoup d'aplomb » | voir 5.6 |
| 9 | 49 | Réplique ambiguë | « s'il y avait une récré pour les souris » | voir 2.1 |
| 10 | 56 | Tic (triplet) | « la porte de la classe qui grince, la cloche de la récré, et le « Miaou ? »… » | voir 1.4 |
| 11 | 64 | Impropriété, calque | « du ton d'un présentateur », « tient son regard » | voir 5.4 |
| 12 | 64 | Redite, chute faible | « sous la table, avec un risque de moutons de poussière sous les meubles. Les habitants du canapé… » | voir 2.2 |
| 13 | 71 | Rôle imposé, impossible à deux | « il devient l'arbitre » | voir 4.1 |
| 14 | 77 | Question de lancement sans réponse | « …alors qu'on l'a dans la main. On l'appelle comment ? » | voir 6.1 |
| 15 | 79 | Incohérence logique | « avant d'abandonner et de couper avec les dents » | voir 5.1 |
| 16 | 83 | Typographie | « le mot, et sa définition. » | « le mot et sa définition. » |
| 17 | 84 | Tranche sans modèle + virgule | « le mot, sa définition, et une phrase d'exemple… » | voir 4.2 |
| 18 | 86 | Ruse + symétrie avec l.26 | « S'il le reprend, tant mieux. Sinon, tu auras ton mot à toi. » | voir 3.2 |
| 19 | 94 | Syntaxe (se lit « il lui a regardé ») | « son maître a tiré sur la laisse, et lui a regardé ailleurs » | « son maître a tiré sur la laisse, et le chien, lui, a regardé ailleurs » |
| 20 | 97 | Typographie (point après « ? ») | « « Plutôt rigolo ou plutôt bizarre ? ». » | « « Plutôt rigolo ou plutôt bizarre ? » » (supprimer le point final) |
| 21 | 101 | Format cassé par le lien | paragraphe « Côté adultes… » placé avant « S'il ne veut pas jouer » | voir 8.1 |
| 22 | 103 | Pronom sans antécédent (« la tienne » renvoie à « une réponse ») | « Raconte la tienne si tu en as une. » | « Raconte ton moment à toi, si tu en as un. » |
| 23 | 107 | Incohérence (une théorie n'est pas une question) | « mais pour lui c'est une vraie question » | voir 5.7 |
| 24 | 109 | Tic (symétrie en maxime) | « Tant qu'il rit avec toi, c'est du jeu. Dès qu'il ne rit plus… » | voir 1.5 |
| 25 | 115 | Antécédent masculin | « Ne l'explique pas et ne la répète pas plus fort. » | voir 5.5 |
| 26 | 115 | Doublon du sourire | « Si c'est ton enfant qui vient de se lancer, un sourire fait très bien l'affaire. » | voir 3.3 |
| 27 | 119 | Tic (conclusion qui répète + aphorisme) | « Un jeu de temps en temps fera très bien l'affaire. Ce qui compte, c'est le moment partagé. » | voir 1.2 |

**Affirmations non sourcées : aucune.** « L'humour se cultive en jouant » est posé comme un avis, la bêtise qui devient un mot de passe familial est modérée par « parfois », le flamant rose qui dort debout est exact et anodin. Aucun bénéfice éducatif chiffré ou promis. Aucune anecdote vécue.

**Âges : cohérents.** Les six jeux sont annoncés dès 3 ans et chaque tranche 3-5 ans propose une version faisable à cet âge (un mot ou un geste, objets visibles, « Et après ? », grimaces, deux mots collés, « Plutôt rigolo ou plutôt bizarre ? »). Aucune variante ne contredit l'âge annoncé.

**Pour la session (pas pour le texte) :** `faits-verifies.md` n'est plus à jour par rapport à la v2. Il cite « vingt minutes » (le texte dit « dix minutes », l.7), un âge minimal « 3 ou 4 ans » (tous les jeux sont dès 3 ans), et il ne mentionne pas « journal de 20 heures » (l.64, simple référence culturelle, pas une donnée). Il faut l'aligner avant l'envoi à Helena.

## 4. Questions de fin de lecture

- Exemple le plus réussi : le chien qui « attendait un autre bus » (l.94). Le moins convaincant : la récré pour les souris (l.49). Il est sous la barre parce que la réplique est ambiguë : à remplacer (2.1).
- Jeu à lancer ce soir : le jeu 6, parce qu'il se pose sur le dîner sans rien préparer et que « rien aujourd'hui » est permis.
- Phrase où le parent se sent jugé : aucune.
- Phrases qui sonnent « généré » : l.9 « Rire ensemble, c'est déjà de la complicité » et l.119 « Ce qui compte, c'est le moment partagé. »
