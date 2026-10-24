# Vérificateur : contre-vérification à l'aveugle, texte v5

Lecture : consignes d'Helena, grille de relecture, faits-verifies.md, puis texte-v5.md. Phrase de transparence et bio hors notation.

## Contraintes binaires

| Contrainte | Verdict | Preuve |
|---|---|---|
| Titre exact | PASS | l.1 : « Jeux en famille sans matériel : 6 idées pour rire et développer l'humour de ton enfant ». Titre SEO (l.3) et méta (l.5) fournis. |
| Corps sous 1 600 mots | PASS (marge étroite) | Décompte manuel de l'intro (l.7) à la fin de la conclusion (l.121), intertitres compris, élisions = 2 mots : environ 1 590 mots, marge d'erreur d'une quinzaine de mots. À confirmer par un comptage scripté avant envoi ; toute correction doit rester neutre en nombre de mots (les deux corrections ci-dessous le sont : +1 et -1). |
| Tutoiement, zéro vouvoiement | PASS | Grep `vous|votre|vos` : 0 résultat. |
| Mot-clé dans les 100 premiers mots | PASS | l.7, vers le 50e mot : « juste assez pour des jeux en famille sans matériel ». |
| Mot-clé dans l'intertitre de conclusion | PASS | l.117 : « ## Jeux en famille sans matériel : un seul suffit pour commencer ». |
| Au plus 1 ou 2 occurrences de plus | PASS | Corps : 2 occurrences au total (l.7, l.117), aucune en plus. |
| 6 jeux, chacun avec âge, matériel, règle, exemple, 3 tranches, refus | PASS | Jeux 1 à 6 (l.13 à l.101) : « Dès : 3 ans. Matériel : aucun. », « La règle », « Exemple », « 3-5 ans / 6-8 ans / 9 ans et plus », « S'il ne veut pas jouer » présents partout. |
| Adaptations conformes au plan | PASS | Jeu 1 un mot ou un geste / ses propres « et si » / conséquences ; jeu 2 objets visibles / farfelu inventé par l'enfant / double sens ; jeu 3 « Et après ? » / une phrase chacun / mot imposé ; jeu 4 grimaces / phrases sérieuses / regard seul, arbitre ; jeu 5 deux mots collés / mot et définition / page du dictionnaire ; jeu 6 question / raconte seul / souci sous un angle drôle, « rien aujourd'hui » permis (l.92). |
| Nombre d'indices (jeu 2) | PASS | Règle : trois indices dont un farfelu (l.32) ; brosse à dents, lampe et peigne : trois indices chacun ; 6-8 ans : « deux vrais indices » + le farfelu (l.38). |
| Rôles et nombre de joueurs | PASS | Juge du jeu 2 et arbitre du jeu 4 : « au moins trois » cohérent (meneur + devineur + juge ; deux joueurs + arbitre). À deux, jeu 4 reporté (l.71). |
| Un seul lien dans le corps, jeu 6, URL exacte | PASS | l.103 : https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes, ancre « petites habitudes d'humour au quotidien ». Aucun autre lien dans le corps. |
| Zéro tiret cadratin ou demi-cadratin | PASS | Grep `[—–]` : 0 résultat. |
| Guillemets français, zéro guillemet droit, espaces insécables | PASS | Grep `"` : 0 ; grep « suivi ou précédé d'une espace ordinaire, ou espace ordinaire avant `: ? ! ;` : 0 ; « 18 h 40 » sans espace ordinaire. |
| « Rire avec son enfant » : arrêt dès qu'il ne rit plus | PASS | l.109 : « Dès qu'il ne rit plus, on s'arrête ». |
| Zéro chiffre ou bénéfice éducatif sourcé à tort | PASS | Aucun chiffre ni étude ; « L'humour se cultive en jouant » est le point de vue admis par la grille (critère 5) ; « finit parfois » modère l'observation l.9. |
| Zéro anecdote vécue par l'auteur | PASS | Aucun « mon fils », « chez moi », « l'autre soir » ; scène d'ouverture au « tu » ; l'exemple du chien (l.94) est attribué à « un parent » joueur, pas à l'auteur. |
| Sorties « S'il ne veut pas jouer » sans ruse | PASS | Chaque sortie commence par une option sans jeu (écouter, regarder, passer, ranger, reporter) ; juge, bruiteur et arbitre sont proposés, pas imposés. |
| Zéro tic avéré (« ce n'est pas X, c'est Y », maxime de fin, triplet décoratif) | PASS | Aucune antithèse de ce type ; le triplet « des situations, des objets ou de soi » (l.107) est imposé par le plan. |
| Deviens Marrant seulement dans le lien du jeu 6 et la bio | PASS | Grep `deviens` : l.103 et l.125 uniquement. |

## Défauts

1. **Incohérence interne, jeu 4 (l.62).** « et ça peut parfaitement être celui qui parle » : en 3-5 ans celui qui fait rire grimace, et en 9 ans et plus il ne dit « pas un mot » (l.69). La règle de base ne peut pas supposer qu'il parle.
   Correction : « et ça peut parfaitement être celui qui fait rire. »

2. **Anaphore sans antécédent, phrase du lien (l.103).** « Pour repérer ces détails plus facilement » : la phrase précédente parle de passer son tour, « ces détails » ne renvoie à rien.
   Correction : « Pour repérer ces moments drôles, voici quelques [petites habitudes d'humour au quotidien](https://deviens-marrant.fr/blog/humour-quotidien-8-habitudes). »

Aucun autre défaut objectif relevé (orthographe, grammaire, typographie, âges, indices, rôles, consignes).

Hors notation, pour information : la phrase de transparence (« écrit à la main par l'auteur ») engage Alex ; à confirmer par Thomas qu'elle décrit fidèlement le processus réel, la consigne d'Helena demandant d'indiquer si l'IA a servi à rédiger.

## Note globale

**8/10.** Deux défauts mineurs, corrigeables à nombre de mots constant. Après ces deux corrections, rien d'objectif ne s'oppose à un 10/10.
