# Verdict v3 : le vérificateur (relecture à l'aveugle)

Texte lu : `texte-v3.md`. Hors notation : phrase de transparence et bio (décision de l'auteur en cours).
Note globale : **8,5/10, sous la barre** (cinq critères à 8). Rien d'inventé, consignes de forme respectées ; ce qui bloque : 1 faute de concordance, 4 incohérences de rôle ou de logique, 2 portes de sortie qui restent des ruses, 4 tics de texte généré.

## Contraintes binaires de la grille

| # | Contrainte | Verdict | Preuve |
|---|---|---|---|
| 1 | Titre exact, titre SEO et méta | PASS | l.1 identique au titre imposé ; l.3 et l.5 présents |
| 2 | Corps de 1 300 à 1 600 mots | PASS | ≈ 1 546 mots comptés à la main (l.7 à l.121, intertitres compris, ancre comptée, élision = 1 mot comme dans Word ou Google Docs). Marge faible : un outil qui compte « l'enfant » pour 2 mots (≈ 100 élisions) passerait au-dessus de 1 600 |
| 3 | Tutoiement, zéro vouvoiement | PASS | Grep `vous/votre/vos` : 0 |
| 4 | Mot-clé : 100 premiers mots, intertitre de conclusion, au plus 2 de plus | PASS | mots 44 à 48 (l.7) ; l.117 ; aucune autre occurrence dans le corps ; rien de forcé |
| 5 | 6 jeux numérotés, 6 rubriques chacun | PASS | l.13, 28, 43, 58, 73, 88, toutes les rubriques présentes |
| 6 | Adaptations du plan | PASS | les 18 adaptations et l'arbitre (l.71) et « rien aujourd'hui » (l.92, 101) sont là |
| 7 | Exemples en une ou deux répliques concrètes | PASS | tous développés ; le jeu 3 (l.49) en a trois, lu comme un minimum respecté |
| 8 | Sections « Rire avec… » et « Quand une blague tombe à plat » | PASS | l.105 à 115, tous les points du plan présents |
| 9 | Liens | PASS | l.103 URL et ancre exactes ; l.125 `https://deviens-marrant.fr/` ; aucun autre lien |
| 10 | Transparence et bio | HORS NOTATION | décision auteur en cours |
| 11 | Typographie et orthographe | **FAIL** | cadratin et demi-cadratin 0, guillemet droit 0, émoji 0, insécables dans les guillemets et avant `: ?` 61/61. Mais faute de concordance l.23 : « Et si papa avait des roues… ? » puis « Alors il aura une contravention. » (si + imparfait appelle le conditionnel) |
| 12 | Zéro anecdote vécue, enfant d'Alex, témoignage, chiffre sans source | PASS | exemple du chien attribué à « un parent » (l.94) ; tous les nombres sont listés dans `faits-verifies.md` |
| 13 | Zéro formule typique d'IA | **FAIL** | triplets l.26 et l.119 ; formule calquée l.101 ; maxime de chute l.119 (détail plus bas) |
| 14 | Texte inédit (recoupement avec les 38 articles) | NON ÉVALUÉ | contrôle fait par la session, hors périmètre du relecteur |
| 15 | Zéro promotion hors lien et bio | PASS | « Deviens Marrant » absent du corps |

## Notes par critère

| # | Critère | Note |
|---|---|---|
| 1 | Voix humaine | 8 |
| 2 | Drôle sans forcer | 8 |
| 3 | Chaleur et zéro culpabilisation | 8 |
| 4 | Concret et envie de jouer ce soir | 8 |
| 5 | Justesse | 8 |
| 6 | Accroche et tenue | 9 |
| 7 | Place sur L'Épopée Ludique | 10 |
| 8 | Lien et sobriété | 9 |
| | **Global** | **8,5** |

**1. Voix humaine (8).** Le ton est bon, mais il reste quatre tics :
- l.26 « Il peut écouter, se joindre à toi quand il veut, ou ne rien dire du tout. » Triplet réflexe. Correction C2.
- l.119 « Un seul jeu, de temps en temps, cinq minutes sans compter les points : on aura ri ensemble, ce qui était le but. » Triplet suivi d'une maxime de chute. Correction C12.
- l.101 « « rien aujourd'hui » est une réponse complète. » C'est le calque de « Non est une phrase complète », formule de développement personnel, et elle répète la règle de la l.92. Correction C10.
- l.9 « L'humour se cultive en jouant, et ça s'apprend un peu comme le vélo » : deux métaphores pour une seule idée (le jardin, puis le vélo). Correction C14.

**2. Drôle sans forcer (8).**
- l.84 La scotchimère du niveau 9 ans et plus ne marche pas : « le cadeau de mamie restera emballé tant qu'on n'aura pas retrouvé la scotchimère ». Il faut du scotch pour emballer un cadeau, pas pour le laisser emballé, donc la phrase dit le contraire de la vanne. Correction C8.
- l.23 « Alors il aura une contravention. » La chute est elliptique (une contravention pour quoi ?) et fautive. Correction C1.

**3. Chaleur (8).** Aucune phrase ne culpabilise, et la conclusion est juste. Deux portes de sortie restent pourtant des appâts :
- l.86 « ressors-le plus tard dans la soirée, comme si de rien n'était » : c'est une manœuvre pour qu'il s'y mette quand même. Correction C9.
- l.26 « lances-en un pour toi, à voix haute, en regardant la casserole » : on joue devant lui pour qu'il morde. Correction C2.

**4. Concret (8).** Certaines tranches d'âge ne disent ni qui fait quoi ni quoi dire :
- l.38 « c'est l'enfant qui invente l'indice farfelu. » Qui choisit l'objet, et qui devine ? Si c'est le parent qui a choisi, l'enfant connaît la réponse. Correction C3.
- l.83 « le mot et sa définition. » Ça répète la règle (l.77), sans sujet ni exemple. Correction C7.
- l.82 « tu proposes deux mots à coller : « crocodoudou »… » Les mots sont déjà collés, donc l'enfant n'a plus rien à faire. Correction C6.
- l.54 « on ajoute un mot imposé » : on ne sait pas qui l'impose, et il n'y a pas de phrase d'exemple. Correction C17.

**5. Justesse (8).** Ni chiffre, ni étude, ni anecdote vécue, ni promesse mesurée : c'est bon. Il reste des incohérences internes :
- l.41 Dans « faire le juge : on lui souffle la réponse […] Toi, tu proposes « Le frigo ? » », si tu fais deviner, tu ne peux pas aussi chercher. Il faut au moins trois joueurs, ce que le jeu 4 précise et le jeu 2 non. Correction C4.
- l.71 « À deux, il peut simplement regarder. » À deux, s'il ne joue pas, il n'y a rien à regarder. Correction C5.
- l.84 Le niveau annonce « le mot, sa définition et une phrase d'exemple », mais l'exemple donné n'a pas de définition. Correction C8.

**6. Accroche et tenue (9).** La scène de 18 h 40 fonctionne et le format aide à se repérer. Petit flottement en fin de texte : l'intertitre « un seul suffit pour commencer » est aussitôt redit par « Un seul jeu » (l.119). Correction C12.

**7. Place sur L'Épopée Ludique (10).** Le plan est suivi, le registre et le tutoiement aussi, et les exemples sont propres à ce texte. Rien à signaler.

**8. Lien et sobriété (9).** l.103 « fait partie de ces petites habitudes […] que tu peux prendre toi aussi » : « ces » renvoie à quelque chose que le texte n'a jamais présenté, et « toi aussi » laisse entendre que l'enfant les a déjà. Correction C11.

## Liste exhaustive : passage exact puis texte prêt à coller

Penser à garder les espaces insécables dans les guillemets et avant `: ?`.

**Faute**
- **C1** (l.23) « Alors il aura une contravention. » → « Alors il se ferait arrêter pour excès de vitesse dans le couloir. »

**Tics de texte généré**
- **C2** (l.26, triplet et appât) « lances-en un pour toi, à voix haute, en regardant la casserole. Il peut écouter, se joindre à toi quand il veut, ou ne rien dire du tout. » → « **S'il ne veut pas jouer :** on n'insiste pas. Tu peux en lancer un pour toi, juste parce qu'il te fait rire, et lui reste libre d'écouter ou de faire autre chose. »
- **C10** (l.101) « « rien aujourd'hui » est une réponse complète. Raconte ton moment à toi, si tu en as un. » → « **S'il ne veut pas jouer :** il passe, sans qu'on lui demande pourquoi, et la parole va au suivant. Raconte ton moment à toi, si tu en as un. »
- **C12** (l.119, triplet, maxime de chute, redite de l'intertitre) « Prends celui qui te ressemble le plus et sors-le quand l'occasion se présente : avant le dîner ou dans la salle d'attente du dentiste. Un seul jeu, de temps en temps, cinq minutes sans compter les points : on aura ri ensemble, ce qui était le but. » → « Prends celui qui te ressemble le plus et sors-le quand l'occasion se présente, avant le dîner ou dans la salle d'attente du dentiste. Cinq minutes suffisent, et personne ne compte les points. »
- **C13** (l.115, triplet et nuance qui affaiblit la règle du plan) « N'explique pas la blague et ne la répète pas plus fort. » → « N'explique pas la blague et ne la répète pas, même plus fort. » Puis « hausse les épaules, lâche un « Celle-là, je la retire » et enchaîne. » → « lâche un « Celle-là, je la retire » et enchaîne. »
- **C14** (l.9) « L'humour se cultive en jouant, et ça s'apprend un peu comme le vélo : avec quelques gamelles. » → « L'humour, ça s'apprend en jouant, un peu comme le vélo : avec quelques gamelles. »

**Portes de sortie qui restent des ruses**
- **C9** (l.86) « invente un mot pour toi et ressors-le plus tard dans la soirée, comme si de rien n'était : « Quelqu'un a vu ma chapluie ? » Il est à toi, personne n'est obligé de le reprendre. » → « **S'il ne veut pas jouer :** on range le dictionnaire. Si un mot te vient quand même, garde-le pour toi : il sera encore bon un autre soir. »
- C2 ci-dessus règle aussi l'appât du jeu 1.

**Incohérences de rôle et de logique**
- **C3** (l.38) « c'est l'enfant qui invente l'indice farfelu. » → « **6-8 ans :** c'est lui qui fait deviner. Il choisit l'objet, donne deux vrais indices et invente le farfelu ; toi, tu cherches. »
- **C4** (l.41) « il peut juste regarder, ou faire le juge : on lui souffle la réponse, et c'est lui qui dit si les propositions sont bonnes. » → « il peut juste regarder. Si on est au moins trois, il peut aussi faire le juge : celui qui fait deviner lui souffle la réponse, et c'est lui qui dit si les propositions sont bonnes. » (la suite « Toi, tu proposes « Le frigo ? »… » reste)
- **C5** (l.71) « À deux, il peut simplement regarder. » → « À deux, la partie attend un autre soir, sans négocier. »
- **C6** (l.82) « tu proposes deux mots à coller : « crocodoudou » pour le doudou qui mord, ou « chapluie » pour le chapeau des jours de pluie (tu poses […] « Je sors, j'ai ma chapluie »). » → « **3-5 ans :** tu donnes deux mots, il les colle : « crocodile » et « doudou » font un « crocodoudou », le doudou qui mord. Avec « chapeau » et « pluie », on obtient une « chapluie » (tu poses les deux mains à plat sur ta tête et tu annonces « Je sors, j'ai ma chapluie »). »
- **C7** (l.83) « le mot et sa définition. » → « **6-8 ans :** c'est lui qui invente le mot et sa définition, pour une chose que tu lui proposes : la miette qui reste collée au coude, la dernière frite au fond du sachet. »
- **C8** (l.84, définition absente et logique inversée, plus « le plus grand sérieux » déjà employé l.62) « une phrase d'exemple prononcée avec le plus grand sérieux (« Scotchimère, nom féminin. Exemple : le cadeau de mamie restera emballé tant qu'on n'aura pas retrouvé la scotchimère. ») » → « une phrase d'exemple prononcée sans rire (« Scotchimère, nom féminin : bout de scotch qui se cache sur son propre rouleau. Exemple : le cadeau de mamie attend son papier depuis une heure, à cause d'une scotchimère. ») »
- **C17** (l.54) « on ajoute un mot imposé à glisser dans sa phrase : « cornichon », « trampoline ». » → « **9 ans et plus :** chacun impose au suivant un mot à glisser dans sa phrase, « cornichon » ou « trampoline » par exemple : « Le chat a rebondi sur un trampoline jusqu'au bureau de la directrice. » »

**Lien**
- **C11** (l.103) « Repérer chaque jour le détail drôle fait partie de ces [petites habitudes d'humour au quotidien](…), que tu peux prendre toi aussi. » → « Guetter le détail drôle de la journée fait d'ailleurs partie des [petites habitudes d'humour au quotidien](https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes) qu'un adulte peut prendre pour lui-même. »

**Mineurs (répétitions et typographie, à corriger dans la foulée)**
- l.64 « pendant que l'autre soutient son regard » redit la règle de la l.62, et « canapé » revient deux fois dans la même météo. → « **Exemple :** l'un annonce la météo du salon, sur le ton du journal de 20 heures : « Ce soir, un front de doudous traversera le canapé par l'ouest. Des averses de miettes sont prévues sous la table, avec un risque d'orage de chaussettes près du panier à linge. Les habitants du tapis sont priés de ne pas bouger jusqu'à nouvel ordre. » »
- l.107 « On ne rit pas de ce que l'enfant dit sérieusement. […] mais pour lui, c'est très sérieux. » : « sérieux » deux fois en deux phrases (sept fois dans le texte). → « mais lui y croit dur comme fer. »
- l.24 « on enchaîne les conséquences » reste proche de la règle de base. Pour mieux distinguer : « **9 ans et plus :** chaque réponse doit découler de la précédente. « Si elles parlent, elles refuseront d'aller à la machine à laver. » « Alors la plus têtue exigera un avocat. » »
- l.7 « 18 h 40 » et l.64 « 20 heures » sont écrits avec des espaces ordinaires : mettre des insécables pour éviter une coupure de ligne sur mobile.

**Affirmations non sourcées** : aucune. L'image du vélo (l.9) est donnée comme un avis, « parfois » adoucit la phrase sur le « mot de passe familial », et « le flamant rose dort debout » et « deux fois par jour » sont des faits courants. Le bénéfice éducatif n'apparaît que dans le titre et la méta, qui sont imposés.

**Non retenus (préférences de style, pas des défauts)** : « comme s'il attendait un autre bus » (l.94), le « papa » de l.23, les apostrophes droites, la casserole reprise en fin de texte.

## Réponses aux questions de la grille

- Plus fait sourire : la météo du salon (l.64), puis la brosse à dents oubliée qui regarde la voiture s'éloigner (l.34). Moins convaincu : la scotchimère du niveau 9 ans et plus (l.84), **sous la barre** parce que sa logique est cassée. La remplacer par C8.
- Jeu lancé ce soir : le jeu 4. Il marche à deux tout de suite, et l'exemple de la météo se lit tel quel.
- Phrase où l'on se sent jugé comme parent : aucune. La plus proche, « Repérer chaque jour » (l.103), est désamorcée par C11.
- Phrases qui sonnent « générées » : « « rien aujourd'hui » est une réponse complète » (l.101) et « on aura ri ensemble, ce qui était le but » (l.119).
