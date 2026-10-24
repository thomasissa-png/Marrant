# Verdict du vérificateur : texte v4 (relecture à l'aveugle)

Fichiers lus, dans l'ordre : consignes de l'hôte (`scratchpad/hote/consignes.txt`), `grille-relecture.md`, `faits-verifies.md`, `scratchpad/relecture/texte-v4.md`. Phrase de transparence et bio non notées.

**Note globale : 9/10. Barre non atteinte (NO-GO) :** une contrainte binaire est en FAIL (longueur) et il reste 3 défauts objectifs de fond et 1 de typographie.

## Contraintes binaires

| # | Contrainte | Verdict | Preuve |
|---|---|---|---|
| 1 | Titre exact, titre SEO et méta fournis | PASS | l.1 identique au libellé de la grille ; l.3 et l.5 présents |
| 2 | Corps de 1 300 à 1 600 mots | **FAIL** | **environ 1 673 mots** (détail plus bas) |
| 3 | Tutoiement, aucun vouvoiement | PASS | Grep `vous/votre/vos` : 0 |
| 4 | Mot-clé dans les 100 premiers mots, dans l'intertitre de conclusion, au plus 2 de plus | PASS | 49e à 53e mot (l.7) ; l.117 ; aucune autre occurrence dans le corps |
| 5 | 6 jeux dans l'ordre du plan, avec Dès / Matériel : aucun / La règle / Exemple / Selon l'âge (3 tranches) / S'il ne veut pas jouer | PASS | l.13 à l.101, les 6 blocs sont complets |
| 6 | Adaptations conformes au plan | PASS avec réserve | elles sont toutes là ; jeu 3, 9 ans et plus : la règle et l'exemple se contredisent (défaut D2) |
| 7 | Chaque exemple tient en une ou deux répliques concrètes | PASS | l.19, 34, 49, 64, 79, 94 |
| 8 | Sections « Rire avec son enfant plutôt que de lui » et « Quand une blague tombe à plat » avec leur contenu | PASS | l.107 (situations, objets, soi ; on ne rit pas de ce qu'il dit sérieusement) ; l.109 « Dès qu'il ne rit plus, on s'arrête » ; l.115 (on n'explique pas, on ne répète pas, sourire, on salue l'essai, on enchaîne) |
| 9 | Un seul lien dans le corps, URL et ancre exactes | PASS | l.103 `https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes`, ancre « petites habitudes d'humour au quotidien » ; seul autre lien : la bio (l.125) |
| 10 | Zéro tiret cadratin ou demi-cadratin, zéro guillemet droit, zéro émoji | PASS | Grep `[—–"]` : 0 ; tranches d'âge écrites avec le trait d'union (« 3-5 ») |
| 11 | Guillemets français avec espaces insécables | PASS | Grep : aucune espace normale après « ou avant » ? ! : ; (62 insécables) |
| 12 | Zéro faute d'orthographe ni de grammaire | PASS | aucune faute relevée |
| 13 | Typographie homogène | **FAIL (mineur)** | voir D4 (l.53 et l.84) |
| 14 | Zéro anecdote vécue, aucun enfant de l'auteur, aucun témoignage, aucun chiffre sans source | PASS | Grep `mon fils / ma fille / chez moi / l'autre soir / mes enfants` : 0. Les répliques à la première personne sont dites par des joueurs (« à ma place », l.49 ; contrôle de maths, l.99) |
| 15 | Zéro « ce n'est pas X, c'est Y », pas de triplet réflexe, pas de « En résumé » ni de « sans effort » | PASS | Grep : 0 ; le seul triplet (« des situations, des objets ou de soi », l.107) vient du plan validé |
| 16 | Aucune promotion de Deviens Marrant hors du lien du jeu 6 et de la bio | PASS | « deviens » n'apparaît qu'aux l.103 (URL) et l.125 |
| 17 | Sorties « S'il ne veut pas jouer » sans ruse | PASS | chaque jeu propose une vraie sortie (écouter, regarder, passer, « la partie attend un autre soir », « il passe, sans qu'on lui demande pourquoi ») ; deux formulations un peu vendeuses sont listées en préférences |

### Détail du comptage (contrainte 2)

On compte les mots du corps, de l.7 à l.121, avec le découpage `\w+` (Grep `-o`, positions par `offset`). On trouve 1 710 occurrences, puis on retire 9 occurrences de l'URL (le lien compte comme son ancre), 12 pour les tranches « 3-5 » et « 6-8 » (chacune compte pour un seul mot), 8 pour les mots à trait d'union (garde-le, est-ce, lui-même, drap-housse, dis-lui, demande-lui, celle-là, sors-le), 2 pour « aujourd'hui » et 6 pour les numéros d'intertitres. **Total : environ 1 673 mots**, élisions comptées comme 2 mots, conformément à la consigne. Même en retirant aussi tous les nombres (18, 40, 20, les « 3 » et les « 9 »), on reste à environ 1 657. **Il faut couper au moins 75 mots, plutôt 90 pour garder de la marge.** Un jeu de coupes chiffré est proposé plus bas.

## Notes par critère

| # | Critère | Note | Défauts qui font baisser la note |
|---|---|---|---|
| 1 | Voix humaine | 10 | aucun |
| 2 | Drôle sans forcer | 10 | aucun défaut objectif (les blagues plus faibles sont listées en préférences) |
| 3 | Chaleur et zéro culpabilisation | 10 | aucun |
| 4 | Concret et envie de jouer ce soir | 8 | D2, D3 |
| 5 | Justesse | 9 | D1 |
| 6 | Accroche et tenue | 10 | aucun |
| 7 | Place sur L'Épopée Ludique (consignes, plan) | 8 | longueur hors plafond (contrainte 2), D4 |
| 8 | Lien et sobriété | 10 | aucun |
| | **Globale** | **9** | moyenne de 9,4, ramenée à 9 parce qu'une contrainte binaire est en FAIL |

## (a) Défauts objectifs (ce sont eux qui font baisser la note)

**D1. Critère 5 : un bénéfice affirmé comme un fait, en décalage avec `faits-verifies.md`.**
Passage exact (l.9) : « L'humour, ça s'apprend en jouant, un peu comme le vélo : avec quelques gamelles. »
`faits-verifies.md` (l.13) couvre la phrase « l'humour se cultive en jouant », présentée comme un point de vue d'auteur. Or cette phrase n'existe pas dans la v4. « S'apprend », sans marque d'opinion, se lit comme un résultat d'apprentissage affirmé sans source.
Correction : « L'humour, à mon avis, s'apprend en jouant, un peu comme le vélo : avec quelques gamelles. » Il faut ensuite mettre la l.13 de `faits-verifies.md` à jour avec cette formulation (à faire par le producteur).

**D2. Critère 4 : dans le jeu 3, la règle des 9 ans et plus contredit son exemple.**
Passage exact (l.54) : « chacun impose un mot au suivant, à glisser dans sa phrase : « cornichon », « trampoline ». Exemple : « Puis la maîtresse a sorti un cornichon, et le chat s'est enfui sur le trampoline de la cour. » »
La règle dit « un mot », mais l'exemple en place deux dans une seule phrase.
Correction : « - **9 ans et plus :** chacun impose un mot au suivant, à glisser dans sa phrase. Exemple avec « cornichon » : « Puis la maîtresse a sorti un cornichon, et le chat a bondi jusqu'au plafond. » »

**D3. Critère 4 : le pronom de la règle du juge (jeu 2) est ambigu.**
Passage exact (l.41) : « celui qui fait deviner lui souffle la réponse, et c'est lui qui dit si les propositions sont bonnes. »
Le second « lui » peut renvoyer à celui qui fait deviner, alors que la règle doit être comprise du premier coup.
Correction : « et c'est le juge qui dit si les propositions sont bonnes. »

**D4. Critère 7 : la ponctuation de fin des citations entre parenthèses n'est pas homogène.**
l.53 « (« Et là, il s'est rendu compte qu'il avait oublié son cartable. »). » : le point est doublé.
l.84 « … à cause d'une scotchimère. ») » : la phrase n'a pas de point final.
l.82 suit la bonne règle : « (… « Je sors, j'ai ma chapluie »). »
Correction : à la l.53, « … son cartable »). » (ou la coupe C1 ci-dessous) ; à la l.84, « … à cause d'une scotchimère »). »

**Contrainte 2 : longueur (environ 1 673 mots pour un plafond de 1 600).** Voici des coupes prêtes à coller, qui totalisent 92 mots. Le producteur peut en choisir d'autres, du moment que le total atteint au moins 80.

| Id | Ligne | Remplacer par | Mots gagnés |
|---|---|---|---|
| C1 | 53 | « - **6-8 ans :** une phrase chacun, à tour de rôle. » (règle D4 réglée du même coup) | 13 |
| C2 | 54 | correction D2 | 3 |
| C3 | 41 | supprimer « Toi, tu proposes « Le frigo ? » trois fois de suite, sans te démonter. » (garder la correction D3) | 11 |
| C4 | 62 | « L'un parle sans jamais sourire et cherche à faire rire l'autre, qui doit soutenir son regard. » | 5 |
| C5 | 64 | « Des averses de miettes sont prévues sous la table. » (on enlève l'orage de chaussettes, qui reprend en plus les chaussettes du jeu 1) | 11 |
| C6 | 71 | « il peut arbitrer, si on est au moins trois : il décide qui a ri, et personne ne peut le contredire. À deux, la partie attend un autre soir. » | 4 |
| C7 | 77 | « Pour lancer : « Le bout de scotch qu'on ne retrouve jamais, on l'appelle comment ? » » | 11 |
| C8 | 82 | « - **3-5 ans :** tu proposes deux mots à coller : « chapeau » et « pluie » donnent la « chapluie » (tu poses les deux mains à plat sur ta tête et tu annonces « Je sors, j'ai ma chapluie »). » | 10 |
| C9 | 34 | « (La brosse à dents.) » | 7 |
| C10 | 11 | « Les six jeux qui suivent se jouent à voix haute. » | 5 |
| C11 | 119 | « Prends celui qui te fait le plus envie, avant le dîner ou dans la salle d'attente du dentiste. » | 7 |
| C12 | 84 | « une page du dictionnaire de la famille : le mot, sa définition et une phrase d'exemple, d'un ton de professeur (« … à cause d'une scotchimère »). » | 5 |

Avec C3, « trois fois de suite » disparaît : il faudra aussi le retirer de la l.8 de `faits-verifies.md`.

## (b) Préférences de style (elles ne changent pas la note)

- Jeu 2 (l.41) et jeu 4 (l.71) : la même sortie revient deux fois (« au moins trois », un rôle dont la parole fait loi). La symétrie se voit. La coupe C6 enlève déjà « c'est le meilleur poste », une formule qui vend un peu le rôle au lieu de le proposer.
- Jeu 4 (l.71) : à trois ou plus, on ne propose que l'arbitrage. Ajouter « ou juste regarder » rendrait la sortie explicite, même si l'intro (l.11) le dit déjà pour tous les jeux.
- Jeu 3 (l.52) : « l'adulte relance » passe à la troisième personne alors que le texte tutoie partout ailleurs. On peut écrire « tu relances avec « Et après ? » ».
- Jeu 3 (l.53) : la réplique du cartable oublié est la blague la plus plate du texte. Elle disparaît avec C1.
- Jeu 5 (l.86) : « on range le dictionnaire » fait référence à un objet qui n'apparaît que dans la variante 9 ans et plus. C'est compréhensible, mais flou pour un enfant de 4 ans.
- Jeu 5 : la définition dit « dix minutes » (l.79) et l'exemple « depuis une heure » (l.84). On peut y voir une exagération voulue, ce n'est pas une contradiction.
- Jeu 1 (l.23) : « Et si papa… » suppose qu'il y a un papa à la maison. « Et si le chien… » marche pour toutes les familles.
- Jeu 1 (l.24) : l'exemple est au conditionnel, la variante 9 ans et plus au futur. Les deux sont grammaticalement justes.
