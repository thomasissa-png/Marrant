# Relecture à l'aveugle : lettres du mois s22 (novembre 2026 à avril 2027)

> Relu : `docs/copy/lettres-du-mois-s22.md`. Étalon : `docs/copy/lettres-reservees-nov-dec-s22-a-lire.md` (7 lettres à 8,5 ou plus). Site comparé : `carnet/2026-11.json` (30 fiches), `joke-decryptages.json`, `video-content-s20.json`. Ton : `docs/copy/ton-alex.md`. Barre : 8,5 par lettre. Date : 25/10/2026. Aucun autre fichier modifié, rien de commité.

## Résumé exécutif

La structure tient : six situations neuves, six règles de choix qui ne redisent ni le site ni les réservées, aucun tiret cadratin, objets tous sous 45 caractères, prix et lien d'abonnement seulement dans le PS. Ce qui manque, c'est le niveau des répliques : dans cinq lettres sur six, une réplique est usée, forcée ou blessante, ou une section ne dit rien de plus qu'une autre. Une seule lettre passe la barre telle quelle (la 6). Les corrections sont courtes (une réplique ou un paragraphe par lettre) et proposées mot pour mot ci-dessous. Elles devront repasser à l'aveugle (règle d'or s18).

## Tableau

| N° | Lettre | Note | Verdict | Bloquant |
|---|---|---|---|---|
| 1 | Soirée de Noël, le micro | 7,5 | NO-GO | joueuse usée (la douche) ; risquée mal expliquée |
| 2 | Le pull tricoté main | 7,5 | NO-GO | risquée blessante dans sa propre scène |
| 3 | Les résolutions d'Axel | 7,5 | NO-GO | la règle « premier mot » ne colle qu'à 1 réplique sur 3 |
| 4 | La réservation oubliée | 8,0 | NO-GO | « L'erreur » redit la règle, rien de neuf |
| 5 | Le message du 1er avril | 7,5 | NO-GO | joueuse forcée et fausse si l'annonce est vraie |
| 6 | La fête où tu ne connais que l'hôte | 8,5 | GO | aucun |

**Note d'ensemble : 7,8/10. NO-GO sur le lot** (1 GO, 5 NO-GO). Après les retouches ci-dessous, les lettres 1 à 5 peuvent viser 8,5 à 9, sous réserve d'une nouvelle relecture à l'aveugle des répliques remplacées.

**Bloquant commun (conditionnel), les six PS** : « une lettre chaque jeudi » n'est vrai que si la lettre hebdomadaire est ouverte. Au 25/10, `LETTRE_HEBDO_PROMESSE = false` (`apps/web/src/config/lettre.ts:150` et `config/lettre-hebdo-promesse-temporaire.ts:12`). Si la valeur n'est pas passée à `true` au moment de l'envoi, le PS promet ce que le site ne promet pas : retirer alors « une lettre chaque jeudi dont des lettres réservées aux abonnés, du même genre que celle-ci, » de chaque PS.

---

## Lettre 1 : soirée de Noël, « Allez, une chanson ! » (7,5, NO-GO)

**Valeur ajoutée** : réelle. Le test du lundi est neuf (les réservées regardent la cible, le silence, la suite dans les 30 secondes, le bruit ; le site n'a ni karaoké de boîte ni règle de réputation). L'erreur (l'excuse inventée qu'il faut jouer jusqu'à lundi) est la meilleure de la série : concrète, vraie, avec un détail qui fait sourire (« Alors, tu as retrouvé ta voix ? »).

**Bloquant 1 : la joueuse est un cliché.** « Je chante, mais j'ai un contrat d'exclusivité avec ma douche. » La formule exacte n'est pas en ligne, mais le ressort (« je ne chante que sous la douche ») est la blague de karaoké la plus entendue qui soit, et le site s'en sert déjà (`joke-decryptages.json:701`, « seul, sous la douche »). Le « Je chante, mais » est en plus illogique (il faudrait « Je chanterais bien »). Sous la barre de `ton-alex.md` (« jamais entendue ailleurs »).
Remplacer le bloc de la joueuse par :
> « Ce soir, ma voix est en télétravail. Elle suit la soirée à distance. »
> Tu donnes à ta voix le statut qu'a la moitié du service le vendredi : présente, mais pas dans la salle. Personne ne peut y croire, donc personne ne te demandera lundi si elle va mieux. Dis-la sur le ton d'un message d'absence. À sortir quand Karim a déjà ri d'une de tes phrases dans la soirée.

Et, pour rester juste avec cette joueuse, remplacer dans l'intro « Elles ont un point commun : aucune n'invente d'excuse. » par « Elles ont un point commun : aucune ne fait semblant d'avoir une vraie raison. »

**Bloquant 2 : la risquée est ambiguë et son explication rate le ressort.** « Moi, je passe en deuxième partie » peut se lire « plus tard dans la soirée », ce qui ne fait pas rire ; et l'explication (« qui allait chanter le premier ») ne dit pas ce qui est drôle : tu fais du directeur ta première partie. Remplacer la réplique et la première phrase de l'explication par :
> « Le directeur d'abord. Je ne passe jamais sans première partie. »
> Tu te poses en tête d'affiche, et le directeur devient ton chauffeur de salle : la hiérarchie s'inverse le temps d'une chanson.

(La suite, « Elle ne marche que si le directeur rit de lui-même... », reste.)

**Mineurs**
1. « Tout le monde a une douche, personne n'est visé, et c'est ce qui fait sourire » disparaît avec le bloquant 1 ; ne pas le recaser ailleurs.
2. PS : « tu en reçois une série chaque jeudi » (une série de quoi ?). Écrire « Avec Premium, tu en reçois chaque jeudi : la lettre du mois, plus des lettres réservées aux abonnés ».
3. Pont d'article : « Une soirée de Noël au boulot se vit moment par moment » sonne brochure. Proposition : « Notre article suit la soirée de Noël au boulot de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Il est en lecture libre. »

---

## Lettre 2 : le pull tricoté main (7,5, NO-GO)

**Valeur ajoutée** : la règle « le temps que l'autre y a mis » est neuve (le test de la table du 24/12 regarde qui écoute, pas ce que l'autre a investi) et l'erreur (le « génial ! » de façade, « une tante entend ce genre de phrase depuis cinquante Noëls ») est juste et neuve. La joueuse « Tu as vu grand. Je vais grandir pour lui. » est au niveau : double sens net, chute courte, aucune victime. La sûre est vraie et dicible.

**Bloquant : la risquée blesse, et dans sa propre scène.** « Tata, soit tu m'aimes beaucoup, soit tu as perdu un pari. » dit qu'un pull tricoté trois semaines est assez laid pour être une punition. La lettre l'admet (« elle fait de la peine ») et sa règle l'exclut pour un cadeau fait main : c'est une réplique écrite pour ne jamais servir dans la scène racontée. Les risquées des réservées, elles, servent dans leur scène sous condition. Remplacer le bloc de la risquée par :
> « Deux tailles au-dessus, tata. Tu as vu le menu de midi ? »
> Celle-ci vise la donatrice : tu lui prêtes une arrière-pensée, comme si elle avait tricoté pour celui que tu seras après le repas. Elle touche à l'erreur de taille, donc elle ne marche qu'avec une tante qui te chambre déjà et qui rit de ses propres élans. Face à quelqu'un qui doute de son tricot, garde-la pour toi.

Et dans « Comment choisir », remplacer « La risquée est pour le cadeau pris à la va-vite, par quelqu'un qui plaisante sur son propre goût. » par « La risquée, seulement si la personne a déjà ri de son cadeau avant toi. »

**Mineurs**
1. « Plus l'autre y a mis d'elle » : écrire « Plus l'autre y a mis de soi ».
2. Ancienne risquée : « et pas devant toute la tablée » contredit « Tout le salon attend ». Disparaît avec le remplacement.
3. Pont d'article : « celle sur le physique n'a qu'une limite posée avec le sourire » est du vocabulaire de rédaction. Couper la phrase après « Chacune a sa sortie si on insiste. Lecture libre. »

---

## Lettre 3 : les résolutions d'Axel (7,5, NO-GO)

**Valeur ajoutée** : répondre à une annonce par une question est neuf (le site a la « question naïve » des fiches vidéo, `video-content-s20.json:203`, qui sert à faire une vanne, pas à rendre la parole). L'erreur (poser la question puis y répondre soi-même) est la plus utile de la série pour un introverti qui comble le silence. La joueuse « Tu as prévu un créneau pour le jour où tu abandonnes ? » est au niveau.

**Bloquant : la règle ne décrit pas les répliques.** « Comment choisir : le premier mot de la question » classe par « comment », « as-tu prévu », « est-ce que tu vas vraiment ». Or la sûre n'est pas une question et ne commence pas par « comment » (« Montre-moi ton planning »), et la risquée commence par « On se reparle ». Le lecteur applique la règle aux trois exemples et elle ne marche qu'une fois. Retouches :
- Sûre, remplacer la réplique par : « Comment tu fais tenir tout ça dans une semaine ? Il faut que je voie ce planning. » (l'explication actuelle reste juste : tu demandes comment, avec une vraie curiosité, et tu ne proposes aucune réponse à sa place, ce que la lettre interdit plus bas).
- « Comment choisir », remplacer la phrase sur la risquée par : « Avec « on se reparle » ou « est-ce que tu vas vraiment », elle vérifie que l'autre tiendra : c'est la plus risquée. » et « Plus ta question cherche un « si », plus elle pique. » par « Plus ta question vérifie, plus elle pique. »
- « À essayer », remplacer « « comment », « as-tu prévu », « est-ce que tu vas vraiment » » par « « comment », « tu as prévu », « on se reparle » ».

**Mineurs**
1. Objet : « Il a tout planifié pour janvier. Et toi ? » alors qu'Axel a planifié l'année. Proposer « Il a planifié toute son année. Et toi ? » (38 car.).
2. Dans la règle, « as-tu prévu » alors que la joueuse dit « Tu as prévu » : aligner sur « tu as prévu ».
3. PS : « sans engagement, résiliable en ligne » se répète ; garder « résiliable en ligne ».

---

## Lettre 4 : la réservation oubliée (8,0, NO-GO)

**Valeur ajoutée** : « d'abord réparer, ensuite plaisanter » est neuf et utile (le site donne une version « si c'est tendu » par fiche, jamais l'ordre entre excuse et blague). Dates justes : le 13/02/2027 est un samedi, et le 04/02 est bien à dix jours du 14. La sûre sans blague est un vrai choix, bien assumé. La risquée (« même moi, je n'étais pas au courant ») tient.

**Bloquant : « L'erreur que tout le monde fait » redit la règle.** Elle reprend mot pour mot l'explication de la risquée (« une façon de ne pas dire pardon ») et la règle (« la blague après la réparation »). Le même conseil apparaît trois fois ; le lecteur ne reçoit pas de deuxième idée, alors que chaque réservée en donne deux. Remplacer le paragraphe par une erreur neuve, qui prépare l'étape liée en fin de lettre (« Rire de toi sans te rabaisser ») :
> L'erreur que tout le monde fait
> En faire trop dans l'excuse. « Je suis vraiment nul, je gâche tout, tu mérites mieux. » Tu croyais t'excuser deux fois plus, et c'est Sam qui doit te consoler, la veille de sa Saint-Valentin. Une excuse tient en une phrase : « tu as raison, c'est moi ». Au-delà, c'est l'autre qui répare à ta place.

**Mineurs**
1. Joueuse : le moule « Bonne nouvelle... Mauvaise nouvelle... » est usé, la chute « avec les retraités » sauve la réplique (et n'a rien de blessant : on se moque de l'heure). La garder, mais la relecture à l'aveugle doit la voter seule.
2. Sam est dit neutre dans les notes mais « ce qu'il attendait » le genre. Écrire « ce que Sam attendait derrière la pique ».
3. La phrase de choix « Au moindre doute, commence par la sûre et garde la joueuse pour la fin de la soirée » contredit la joueuse, qui se dit « vingt minutes plus tard ». Écrire « garde la joueuse pour le moment où la table est réservée ».

---

## Lettre 5 : le message du 1er avril (7,5, NO-GO)

**Valeur ajoutée** : la meilleure règle du lot, « celle qui survit au démenti » : neuve partout, utilisable au-delà du 1er avril, claire. Saison juste (envoi le 04/03, quatre semaines avant). La risquée « 8 h 02 le 1er avril. Tu n'as même pas attendu que le café coule. » est au niveau : l'indice est dans l'heure, la chute est une observation vraie.

**Bloquant : la joueuse est forcée, et fausse dans un des deux cas.** « Excellente nouvelle. Je suis en train de ne pas y croire, je reviens. » « Je suis en train de ne pas y croire » ne se dit pas à voix haute (la rédaction l'a elle-même classée fragile), et « Excellente nouvelle » pour un propriétaire qui vend ton logement sonne faux si l'annonce est vraie : la réplique ne survit pas au démenti, ce qui contredit la leçon de la lettre. Remplacer le bloc de la joueuse par :
> « Vrai ou pas, je range. Ça fait depuis Noël qu'on attend une bonne raison. »
> Tu joues sur l'état de l'appartement, pas sur Léo : si c'est vrai, tu as promis de ranger ; si c'est un canular, la blague de Léo vient de vous rendre service. Elle survit au démenti dans les deux sens. Dis-la comme une bonne résolution. À sortir quand le groupe sait rire de sa propre coloc.

**Mineurs**
1. La sûre « Je range, et je garde mon avis pour demain » : le clin d'œil au 2 avril est trop discret, et le 1er avril 2027 étant un jeudi, « demain » tombe le vendredi de la visite. Avec la nouvelle joueuse, les deux disent « je range ». Proposition : « Merci de prévenir. Tu peux transférer le mail du proprio dans le groupe ? » (elle vérifie avant de croire, ce que conseille la lettre).
2. L'erreur « relayer avant de vérifier » s'éloigne de la répartie, et l'exemple n'est pas crédible (qui annonce la visite de son proprio au groupe du foot ?). Renommer l'erreur « Agir avant de vérifier » et prendre une réaction plausible : « tu annules ton rendez-vous de vendredi, tu préviens ton collègue que tu pars tôt ».
3. Coloc + Léo, après la coloc de Léa (12/11) : changer le prénom (« Malik »).

---

## Lettre 6 : la fête où tu ne connais que l'hôte (8,5, GO)

**Valeur ajoutée** : la seule lettre sans pique, et c'est son intérêt : la première phrase à un inconnu est le vrai blocage de Yanis, absent des réservées et du carnet (le site n'a que la vanne « Je connaissais que l'hôte. », `joke-decryptages.json:1287`, qui raconte sans apprendre). La règle « combien de travail tu donnes à l'autre » est concrète et mesurable (dix secondes), l'erreur « s'excuser de déranger » est juste et neuve. Les trois répliques sont dicibles, la sûre (« Je n'ose pas ») est exactement au niveau d'un introverti. Envoyée le 1er avril sans blague de poisson d'avril : bon choix, la lettre 5 a traité la date.

**Mineurs**
1. Objet : « Une fête, personne que tu connais » est bancal à l'oreille, et faux (tu connais Nina). Proposer « Une fête où tu ne connais que l'hôte » (36 car.).
2. Pont de fin : « Savoir quand glisser sa phrase » renvoie au moment, alors que la lettre parle de la phrase. Proposer « Après la première phrase, il faut sentir le moment de la suivante : c'est le sujet de l'étape 2 du parcours Machine à Café, « Sentir le bon moment ». »
3. Risquée : « Moi, je ne dis rien » avoue que toi, tu es venu pour le buffet ; l'explication ne le dit pas. Ajouter « et tu avoues le premier, ce qui lui laisse une porte ».

---

## Points communs aux six lettres

- **Contrôles passés** : zéro tiret cadratin ou demi-cadratin, zéro émoji ; objets de 33 à 42 caractères ; « 1,99 € par mois », le prix et `/abonnement` uniquement dans le PS, aucun « offre » ni annuel ; chaque lettre se lit complète sans son PS ; titres d'étapes vérifiés dans `apps/web/src/config/parcours-etapes.ts` (Boulot 4, Confiance 4, 3, 2, Répartie 4, Machine à Café 2) ; prix vérifié (`PREMIUM_MONTHLY_PRICE_CENTS = 199`, `config/premium.ts:32`).
- **PS** : six accroches différentes, chacune tenue par sa lettre, aucune fausse promesse sauf la condition « chaque jeudi » (bloquant commun en tête). Ils restent longs (une énumération de cinq éléments répétée six fois) : acceptable pour qui ne lit qu'un numéro.
- **Pas de redite avec le site** : aucune réplique reprise du carnet de novembre ni des décryptages (contrôle par mots clés et lecture des fiches voisines : karaoké `joke-decryptages.json:1293`, résolutions `:126`, `:546`, `:971`, hôte `:1287`).

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| Lettre 3, « Comment choisir » | Lettre 3, sûre et risquée | règle du premier mot vérifiée sur 1 exemple sur 3 | bloquante | retouches lettre 3 ci-dessus |
| Lettre 5, leçon « survit au démenti » | Lettre 5, joueuse | la joueuse sonne faux si l'annonce est vraie | bloquante | nouvelle joueuse |
| Six PS, « une lettre chaque jeudi » | `config/lettre.ts:150` (`false`) | promesse que le site ne fait pas encore | bloquante si non levée à l'envoi | Thomas confirme l'ouverture, sinon retirer le membre de phrase |

## Décisions à confirmer par Thomas

1. **Liens de fin vers des étapes réservées** (consigne du coordinateur) : un inscrit par adresse ou un compte gratuit qui clique tombe sur l'aperçu verrouillé. La phrase ne pousse pas l'abonnement, mais la page, si. Pour les versions sans PS, c'est le seul endroit commercial de la lettre. À trancher : garder (porte d'entrée naturelle vers Premium) ou viser une étape 1 pour les non-abonnés.
2. **Ouverture de la lettre hebdomadaire au 05/11** : condition du PS (voir le bloquant commun).

## Recommandation

**NO-GO sur le lot, GO sur la lettre 6.** Relancer @copywriter avec les retouches mot pour mot des lettres 1 à 5 (une réplique ou un paragraphe chacune), puis relecture à l'aveugle des seules répliques remplacées (lettre 1 joueuse et risquée, lettre 2 risquée, lettre 3 sûre, lettre 5 joueuse) et des deux paragraphes réécrits (lettre 3 règle, lettre 4 erreur).
