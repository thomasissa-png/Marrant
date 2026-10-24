# Relecture à l'aveugle, tour 1 : le vérificateur (texte v1)

Lu : consignes publiées de L'Épopée Ludique, `grille-relecture.md`, `faits-verifies.md`, `texte-v1.md`. Rien d'autre.
Hors notation : phrase de transparence et bio.

**Note globale : 7/10.** Moyenne des 8 critères : 7,9. Plafonnée à 7 parce que 3 contraintes binaires sont en FAIL (orthographe, tics d'IA, écart au plan dans « Rire avec son enfant »). Sous la barre : v2 obligatoire.

## 1. Contraintes binaires

| # | Contrainte | Verdict | Preuve |
|---|---|---|---|
| 1 | Titre exact, titre SEO et méta fournis | PASS | L1 identique au titre imposé ; L3 titre SEO (environ 58 caractères) ; L5 méta (environ 150 caractères). |
| 2 | Corps de 1 300 à 1 600 mots | PASS | Compté à la main, phrase par phrase, de « Il est 18 h 40 » à « début de fou rire » : **1 417 mots** avec intertitres et libellés (Dès, Matériel, La règle…), **1 364** sans les intertitres. Convention : forme élidée collée au mot suivant = 1 mot, « 3-5 » = 1 mot, ponctuation isolée non comptée. Marge d'erreur estimée ±1 %. |
| 3 | Tutoiement partout | PASS | Grep `vous|votre|vos` : 0 occurrence. |
| 4 | Mot-clé : 100 premiers mots, intertitre de conclusion, au plus 2 de plus | PASS | Grep « jeux en famille sans matériel » dans le corps : 2 occurrences. L7, mots 45 à 49 du corps ; L97, intertitre de conclusion. Occurrences supplémentaires : 0. Aucune ne sonne forcée. Réserve : L11 « se jouent tous sans matériel » refait l'écho deux phrases plus loin, pour rien (voir 4.3). |
| 5 | 6 jeux dans l'ordre du plan, format complet | PASS | Jeux 1 à 6 dans l'ordre du plan ; chacun a Dès, Matériel : aucun, La règle, Exemple, Selon l'âge (3-5 / 6-8 / 9 ans et plus), S'il ne veut pas jouer. |
| 6 | Adaptations du plan, jeu par jeu | PASS (réserve) | Toutes présentes. Réserve jeu 1, 9 ans et plus : « on enchaîne les conséquences » est illustré par **une seule** conséquence (L21), donc aucun enchaînement montré. |
| 7 | Exemples développés en une ou deux répliques | PASS | Jeux 1, 2, 3, 5, 6 : répliques citées ; jeu 4 : monologue météo développé. |
| 8 | Sections « Rire avec » et « Blague à plat » conformes au plan | **FAIL** | Le plan demande « on s'arrête dès qu'il ne rit plus ». L89 écrit « S'il baisse les yeux, arrête tout de suite », ce qui est plus étroit : entre « il rit » et « il baisse les yeux », le texte ne dit rien. La section « Blague à plat » couvre bien les 5 points (ne pas expliquer, ne pas répéter, sourire, saluer, passer). |
| 9 | Liens : exactement les 2 URL prévues | PASS | L81 `https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes`, ancre « petites habitudes d'humour au quotidien » ; L105 `https://deviens-marrant.fr/`. Aucun autre lien. |
| 10 | Transparence et bio | HORS NOTATION | En attente de la décision de l'auteur (voir point d'attention en fin de fichier). |
| 11 | Typographie, orthographe, concurrents | **FAIL** | Grep `—` et `–` : 0. Guillemets droits : 0. Émoji : 0. Guillemets français : tous avec espace insécable (Grep `«` sans insécable : 0). Concurrent nommé : 0. **Mais 2 fautes** : L23 « lance-en un » (impératif suivi de « en » : « lances-en un ») ; L87 « drap housse » (s'écrit « drap-housse »). |
| 12 | Zéro anecdote vécue, zéro enfant d'Alex, zéro chiffre sans source | PASS | Les seules premières personnes (« à ma place » L43, « j'ai surtout regardé le plafond » L81) sont des répliques de joueurs entre guillemets. Seuls nombres : ceux listés dans `faits-verifies.md`. Réserve : l'exemple du chien du voisin (L79) n'est attribué à personne ; un lecteur pressé peut le lire comme un souvenir de l'auteur (correction en 4.8). |
| 13 | Zéro formule typique d'IA | **FAIL** | Antithèse « ne devient pas plus drôle, juste plus longue » (L95) ; triplet réflexe « sa règle, son exemple et sa version selon l'âge » (L11) ; aphorismes de fin de paragraphe (L11, L95, L99) ; « Le critère est simple » (L89). Liste complète en section 3. |
| 14 | Texte inédit (recoupement avec les 38 articles) | NON VÉRIFIÉ ICI | Revient à la session (grille). |
| 15 | Aucune promotion hors jeu 6 et bio | PASS (réserve) | Deviens Marrant n'apparaît que dans le lien et la bio. Réserve : la phrase-pont du lien (L81) avance une affirmation non démontrée, qui sert surtout à amener le lien (voir 4.6). |

Recommandation hors grille : les 42 espaces devant « : », « ? », « ! » sont des espaces ordinaires, comme celles de « 18 h 40 » (L7, L101). Sur mobile, un deux-points peut se retrouver seul en début de ligne. Passer en espaces insécables (U+202F ou U+00A0) avant l'envoi du document.

## 2. Notes par critère

| # | Critère | Note |
|---|---|---|
| 1 | Voix humaine | 7 |
| 2 | Drôle sans forcer | 8 |
| 3 | Chaleur et zéro culpabilisation | 8 |
| 4 | Concret et envie de jouer ce soir | 8 |
| 5 | Justesse | 7 |
| 6 | Accroche et tenue | 8 |
| 7 | Place sur L'Épopée Ludique | 9 |
| 8 | Lien et sobriété | 8 |

### Critère 1, Voix humaine : 7/10
Les jeux ont une vraie voix (« personne ne peut vérifier », « avec beaucoup d'aplomb », « comme s'il attendait un autre bus »). Mais l'intro, « Rire avec » et « Blague à plat » cumulent les tics d'IA : antithèse, triplet, aphorismes de fin de paragraphe, symétries. Le relevé complet et les réécritures sont en section 3. Pour que ce critère passe à 10, il faut appliquer les items 3.1 à 3.13.

### Critère 2, Drôle sans forcer : 8/10
Très bons : cartes postales de la chaussette disparue, brosse à dents qui rêve d'un transat, poils dans le cahier du chat, météo du salon, scotchimère, chien qui attend un autre bus. Sous la barre ou moyens :
- L47 « un chat qui entre en classe mérite au moins un « Bam ! » » : un chat qui entre ne fait pas « Bam », la vanne tombe à côté. **Remplacer par** : « Il fait le bruit de chaque rebondissement : la porte de la classe qui grince, la cloche de la récré, et le « Miaou ? » du chat quand la maîtresse fait l'appel. »
- L93 « l'indice farfelu fera le bruit d'un couvert qui tombe » : l'image se contredit (une blague ratée, c'est un silence, pas un bruit), et elle double la première image. **Remplacer la phrase entière par** : « Ça arrivera : un « et si » qui ne déclenche rien, à part le ronron du frigo. »
- L95 « Celle-là était pour moi » : le sens n'est pas clair (« c'était pour moi » peut aussi vouloir dire « je me l'offrais »). **Remplacer par** : « Bon, celle-là, je la reprends ».
- L69 « chapluie » : trop proche de « parapluie », l'enfant entend un mot qui existe presque. Moyen, à remplacer (pas de vanne plutôt qu'une vanne moyenne). **Proposition** : « on colle deux mots (« bisoupe », la soupe qu'on accepte de manger seulement après un bisou) ».
- L33 « J'ai des aiguilles et je ne sais pas coudre. » : devinette connue, alors que le jeu s'appelle « devinettes inventées ». Moyen, pas sous la barre : à garder au choix de l'auteur.

### Critère 3, Chaleur et zéro culpabilisation : 8/10
Points forts : « Personne ne te demande de tous les jouer, ni de bien les jouer », et « rien aujourd'hui » posé comme réponse complète. Écarts :
- L23 « Il ne résistera peut-être pas à l'envie de te corriger. » : c'est une ruse pour le faire jouer quand même, exactement ce que la grille exclut. **Remplacer la ligne par** : « **S'il ne veut pas jouer :** lances-en un à voix haute, pour toi, en regardant la poêle, et n'attends rien de lui. S'il veut s'en mêler, il sait où te trouver ; s'il préfère écouter, ça compte aussi. »
- L95 « il guette ta réaction, alors fais-la bonne » : injonction au parent, qui a droit lui aussi à une réaction fatiguée. **Remplacer par** : « Si c'est ton enfant qui vient de se lancer, il guette ta réaction, et un sourire fait très bien l'affaire. »

### Critère 4, Concret et envie de jouer ce soir : 8/10
Les jeux 1, 2 et 6 se lancent ce soir sans relire. Écarts :
- Jeu 4, L53 : la règle ne dit pas que l'un des deux essaie de faire rire l'autre. Du coup, l'exemple (météo annoncée par un joueur) et les adaptations (grimaces, phrases sérieuses) ne collent pas à la règle telle qu'elle est écrite. **Remplacer par** : « **La règle :** deux joueurs se regardent dans les yeux. L'un essaie de faire rire l'autre, qui doit garder son sérieux. Le premier qui rit a perdu, et on échange les rôles. »
- Jeu 3, L41 et L45 : la règle dit déjà « chacun ajoute une phrase », donc la version 6-8 ans (« une phrase chacun ») répète la règle. Les tranches ne se distinguent pas. **Règle à remplacer par** : « **La règle :** on invente une histoire à plusieurs voix, et personne n'a le droit de contester ce qui vient d'être dit. » (La version 6-8 ans, « une phrase chacun », redevient une vraie étape.)
- Jeu 3, 9 ans et plus : rien ne dit ce que font les autres pendant ce temps. **Ajouter à la fin** : « et les autres essaient de deviner quel était le mot. »
- Jeux 2, 4 et 5 : « Dès : 4 ans », puis « à 3-5 ans ». Un parent qui a un enfant de 3 ans ne sait pas s'il peut jouer. Les adaptations proposées (pointer du doigt, grimaces) marchent dès 3 ans. **Remplacer par** « **Dès :** 3 ans. » pour les jeux 2 et 4. Pour le jeu 5, garder 4 ans et écrire « à 3-5 ans (plutôt vers 4-5 ans) », ou bien mettre 3 ans si l'auteur l'assume.
- Jeu 5, L69 « on rédige à voix haute » : contradiction (rédiger, c'est écrire). **Remplacer par** « on compose à voix haute ».

### Critère 5, Justesse : 7/10
Aucun chiffre, aucune étude, aucune anecdote vécue. En revanche, 5 affirmations sont présentées comme des faits, et 1 est fausse dans un cas (« tous… dans la voiture »). Tout est détaillé en section 4 (items 4.1 à 4.8). Autre écart avec la grille : la scène d'ouverture doit être « au tu », or L7 est impersonnelle (« les pâtes cuisent »). **Remplacer par** : « Il est 18 h 40, tes pâtes cuisent. Quelqu'un cherche sa deuxième chaussette, quelqu'un d'autre t'explique en détail pourquoi il n'a plus faim, et il reste vingt minutes avant de passer à table. »

### Critère 6, Accroche et tenue : 8/10
La scène de 18 h 40 accroche. Le format répété se lit bien sur mobile. Ventre mou en revanche : les paragraphes 2 et 3 (L9, L11) sont abstraits et méta (« Chacun a sa règle, son exemple et sa version selon l'âge »), et ils retardent le premier jeu. La correction est en 4.1 et 4.3 : l'intro tombe d'environ 115 à 80 mots, sans perte. La conclusion recycle « 18 h 40, les pâtes » mot pour mot (voir 3.12).

### Critère 7, Place sur L'Épopée Ludique : 9/10
Le plan est respecté (intro, 6 jeux dans l'ordre, les deux sections, conclusion), avec le tutoiement et le registre du blog. Seul écart au plan validé : L89 « S'il baisse les yeux, arrête tout de suite », alors que le plan dit « dès qu'il ne rit plus ». **Remplacer L89 par** : « Tant qu'il rit avec toi, c'est du jeu. Dès qu'il ne rit plus, arrête, sans « mais c'était pour rire », et passe à autre chose. »

### Critère 8, Lien et sobriété : 8/10
Le lien est unique, l'ancre conforme, le ton n'est pas promotionnel. Mais le lien est rangé dans « Selon l'âge », au bout de la tranche 9 ans et plus. Or cette tranche parle des enfants, et le lien parle des adultes : il tombe au mauvais endroit. Il arrive en plus avec une affirmation non démontrée (« s'installent mieux quand on est plusieurs à les avoir »). **Supprimer la dernière phrase de L81 et remplacer L77 par** : « **La règle :** au dîner, chacun raconte le truc le plus drôle ou le plus bizarre de sa journée, adultes compris : chercher ce détail chaque jour fait partie des [petites habitudes d'humour au quotidien](https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes). Répondre « rien aujourd'hui » est permis. »

## 3. Tics de texte généré (relevé exhaustif)

| # | Ligne | Passage exact | Tic | Réécriture prête à coller |
|---|---|---|---|---|
| 3.1 | L7 | « rien à sortir, rien à retrouver sous le canapé le lendemain » | doublet en miroir | « Ces vingt minutes-là se remplissent très bien avec des jeux en famille sans matériel, ceux qui ne laissent aucune pièce de puzzle sous le canapé le lendemain. » |
| 3.2 | L9 | « L'humour se cultive en jouant, comme le reste. » | aphorisme d'ouverture, généralisation | voir 4.1 |
| 3.3 | L11 | « Chacun a sa règle, son exemple et sa version selon l'âge. » | triplet réflexe et annonce du plan | supprimer (le format se voit tout seul dès le jeu 1) |
| 3.4 | L11 | « un public qui sourit dans son coin fait partie du jeu. » | aphorisme de fin de paragraphe | voir 4.3 |
| 3.5 | L23 | « Il ne résistera peut-être pas à l'envie de te corriger. » | chute de paragraphe (et ruse) | voir critère 3 |
| 3.6 | L87 | « Un principe suffit pour tous ces jeux : » et « tout cela se prête. » | formule d'annonce ; « se prête » sans complément | « Dans tous ces jeux, on rit des situations, des objets ou de soi. La tartine qui tombe toujours côté confiture, ton incapacité à plier un drap-housse : tout ça, tu peux en rire. » |
| 3.7 | L89 | « Le critère est simple : » | formule d'annonce | voir critère 7 |
| 3.8 | L93 | « Ça arrivera. Un « et si » ne déclenchera rien d'autre qu'un silence de frigo, et l'indice farfelu fera le bruit d'un couvert qui tombe. » | phrase choc puis deux images en parallèle | voir critère 2 |
| 3.9 | L95 | « expliquée ou répétée, elle ne devient pas plus drôle, juste plus longue » | antithèse « pas X, juste Y » ; reprend les deux verbes de la phrase d'avant | « Ne l'explique pas et ne la répète pas plus fort : ça ne la sauvera pas. » |
| 3.10 | L95 | « Si c'est ton enfant qui… » / « Si c'est toi qui… » ; « tu viens de lui montrer gratuitement qu'une blague ratée ne coûte rien. » | symétrie et aphorisme final | première phrase : voir critère 3 ; seconde : « Et quand c'est la tienne qui tombe à plat, hausse les épaules, lâche un « Bon, celle-là, je la reprends » et enchaîne. » |
| 3.11 | L87, L97, L99 | « Un principe suffit », « un seul suffit », « Un jeu de loin en loin suffit. » ; « Les règles s'oublieront vite, et il restera le souvenir d'un soir où tout le monde disait des bêtises à table. » | répétition de « suffit » ; conclusion qui répète l'intertitre ; aphorisme | supprimer « Un jeu de loin en loin suffit. » et la phrase « Les règles s'oublieront… » (pour L87, voir 3.6 ; l'intertitre garde le mot-clé) |
| 3.12 | L101 | « Ce soir, vers 18 h 40, quand les pâtes cuiront, […] ce qui fait déjà un bon début de fou rire. » | reprise de l'intro mot pour mot et chute qui promet un résultat | « Ce soir, pendant que l'eau chauffe, tu peux lancer un « et si » sur la casserole. Au pire, ton enfant te fixera comme si tu avais perdu la tête : c'est le jeu du sérieux, et le premier qui rit a perdu. » |
| 3.13 | L21, L81 | « ils lancent leurs propres « et si » », « ils racontent seuls », « « Qu'est-ce qui t'a fait rire aujourd'hui ? ». » | singulier et pluriel qui alternent (« S'il ne veut pas » partout ailleurs) ; double ponctuation | « c'est lui qui lance ses propres « et si » » ; « il raconte seul, sans question pour l'aider » ; « tu lui demandes : « Qu'est-ce qui t'a fait rire aujourd'hui ? » » |

## 4. Affirmations à sourcer, bénéfices non démontrés, risques d'anecdote

| # | Ligne | Passage exact | Problème | Reformulation prudente |
|---|---|---|---|---|
| 4.1 | L9 | « L'humour se cultive en jouant, comme le reste. Un enfant qui lâche une bêtise et entend toute la cuisine éclater de rire apprend, sans qu'on le lui dise, que faire rire est à sa portée. Rire ensemble crée aussi de la complicité » | 3 affirmations posées comme des faits : un apprentissage, un effet psychologique, un bénéfice relationnel. `faits-verifies.md` dit « point de vue d'auteur », mais le texte ne le présente pas comme tel | « Je crois que l'humour se cultive en jouant. Quand une bêtise lâchée au hasard fait rire toute la cuisine, l'enfant le remarque, et il y a des chances qu'il en tente une deuxième. Certaines bêtises inventées un mardi soir finissent même en mots de passe familiaux, qu'on ressort des années plus tard devant des gens qui n'y comprennent rien. » |
| 4.2 | L1, L5 | « développer l'humour de ton enfant » | promesse du titre (imposé, validé par Helena) | rien à changer dans le titre. Condition : le corps ne doit jamais promettre de résultat (c'est ce que règlent 4.1, 4.5 et 4.7) |
| 4.3 | L11 | « Les six jeux qui suivent se jouent tous sans matériel, dans la cuisine comme dans la voiture. » | inexact : le jeu 4 (se regarder dans les yeux) ne se joue pas avec le conducteur, et le jeu 6 est défini « au dîner » ; « sans matériel » est redit pour rien | « Ils se jouent dans la cuisine, dans une salle d'attente ou en voiture (le jeu du sérieux, lui, se joue sans le conducteur). Et ton enfant peut toujours passer son tour, ou juste regarder les autres faire les idiots. » |
| 4.4 | L87 | « Si tu ris, il risque de se taire la prochaine fois. » | conseil formulé au conditionnel prudent (« risque ») et plausible | acceptable tel quel, rien à changer |
| 4.5 | L95 | « tu viens de lui montrer gratuitement qu'une blague ratée ne coûte rien » | promet un apprentissage | supprimé par 3.10 |
| 4.6 | L81 | « Les adultes y gagnent aussi : […] qui s'installent mieux quand on est plusieurs à les avoir. » | bénéfice et mécanisme non démontrés, qui servent à amener le lien | voir critère 8 (la phrase disparaît, le lien remonte dans la règle) |
| 4.7 | L99, L101 | « il restera le souvenir d'un soir… » ; « ce qui fait déjà un bon début de fou rire » | prédiction d'un résultat | supprimés ou remplacés par 3.11 et 3.12 |
| 4.8 | L79 | « Le chien du voisin a refusé d'avancer sur le trottoir… » | réplique attribuée à personne : peut se lire comme un souvenir de l'auteur | « **Exemple, côté adulte :** « Le chien du voisin a refusé d'avancer sur le trottoir… » » (reste inchangé) |

## Point d'attention hors notation (décision de l'auteur)

L103 : « Ce texte a été écrit à la main par l'auteur. L'IA a seulement servi à challenger quelques idées et à relire. » Les consignes d'Helena demandent d'« indique[r] si elle a servi à préparer ou rédiger le texte » et de n'inventer « ni expérience, ni citation, ni bénéfice ». Cette phrase doit donc être littéralement vraie. Si une IA a rédigé tout ou partie du texte, elle est fausse et expose au refus. Autre point : la grille demande une phrase « exactement comme fournie par Helena », mais les consignes publiées n'en fournissent aucune. Il faut vérifier d'où vient ce libellé.
