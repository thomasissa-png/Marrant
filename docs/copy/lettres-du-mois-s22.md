# Lettres du mois, de novembre 2026 à avril 2027 (s22) : réécriture au niveau des lettres réservées

> Statut : brouillons pour la relecture à l'aveugle (barre 8,5) puis l'approbation de Thomas, numéro par numéro. Rien n'est programmé, aucun fichier du site n'est touché, rien n'est commité. Les corps remplacent ceux de `apps/web/src/data/lettre/numeros.json` (une vanne + « Pourquoi ça marche » + exercice : la vanne du jour, refusée par Thomas le 25/10).
> **Les répliques sont écrites pour l'occasion et n'ont pas encore passé la relecture à l'aveugle** : aucune ne part avant.
> Lecteur : tout le monde. Chaque lettre se lit seule (quelqu'un qui découvre le site comprend « la sûre, la joueuse, la risquée » dès la première lettre), et se lit complète **sans** le bloc entre `[[invitation-premium]]` et `[[/invitation-premium]]` (comptes gratuits et abonnés). Le bloc est le PS pour les inscrits par adresse seule.
> Format du fichier : comme `lettres-reservees-nov-dec-s22-a-lire.md`. Les champs `periode`, `datePlancher` et `envoiPrevu` sont repris du fichier actuel, inchangés.

## Ce qui a changé dans la révision du 25/10/2026 (suite à `docs/reviews/review-lettres-du-mois-s22.md`, 7,8/10)

Chaque réplique de remplacement repasse la relecture à l'aveugle avant envoi (règle d'or s18) ; chacune a été cherchée par Grep dans `apps/web/src/data` (aucune reprise). Inchangés, sur consigne : les liens de fin vers des étapes réservées, la phrase « une lettre chaque jeudi » des PS, les liens d'article, les dates plancher et d'envoi, les marqueurs `[[invitation-premium]]`.

| Lettre | Changements |
|---|---|
| 1. 05/11 | **Joueuse** « contrat d'exclusivité avec ma douche » (blague déjà dans le site, `joke-decryptages.json:701`) remplacée par « Ce soir, ma voix est en télétravail. Elle suit la soirée à distance. ». **Risquée** « je passe en deuxième partie » (ambiguë) remplacée par « Le directeur d'abord. Je ne passe jamais sans première partie. », explication corrigée. Intro : « aucune ne fait semblant d'avoir une vraie raison ». PS : « tu en reçois chaque jeudi » (plus de « série »). Pont d'article reformulé. Objet inchangé (41). |
| 2. 03/12 | **Risquée** « tu as perdu un pari » (blessante) remplacée par « Dis-moi que tu n'as pas déjà commencé celui de l'an prochain. » (la proposition du relecteur n'a pas été gardée : peu lisible, redit la taille). « Comment choisir » : risquée seulement si la personne a déjà ri de son cadeau ; « de soi ». Pont d'article raccourci. Objet inchangé (42). |
| 3. 07/01 | **Sûre** remplacée par « Comment tu fais tenir tout ça dans une semaine ? Il faut que je voie ce planning. » ; **règle** réécrite pour coller aux trois répliques (« comment », « tu as prévu », « on se reparle ») ; exercice aligné ; PS sans « sans engagement ». **Objet** : « Il a planifié toute son année. Et toi ? » (39). |
| 4. 04/02 | **Erreur** remplacée par « En faire trop dans l'excuse… » (texte du relecteur, mot pour mot). « ce que Sam attendait derrière la pique » ; « garde la joueuse pour le moment où la table est réservée ». Objet inchangé (34). |
| 5. 04/03 | **Joueuse** remplacée par « Vrai ou pas, je range. On attendait une bonne raison depuis Noël. » (tournure du relecteur « Ça fait depuis » corrigée) ; **sûre** remplacée par « Merci de prévenir. Tu peux transférer le mail du proprio dans le groupe ? » ; erreur renommée « Agir avant de vérifier » avec un exemple plausible ; Léo devient Malik ; PS sans « sans engagement ». Objet inchangé (40). |
| 6. 01/04 | GO, mineurs repris : **objet** « Une fête où tu ne connais que l'hôte » (36) ; pont de fin sur le moment de la phrase suivante ; explication de la risquée complétée (la porte laissée à l'autre). Aucune réplique changée. |
| Contrôles | Objets recomptés par Grep : 41, 42, 39, 34, 40, 36. Zéro tiret cadratin, zéro émoji, aucun mot interdit hors PS (voir « Contrôles communs »). |

## Calendrier et leçons

| N° | Jeudi | Période | Date plancher | Situation | Leçon neuve | Article | Étape de fin (Premium) |
|---|---|---|---|---|---|---|---|
| 1 | 05/11/2026 | 2026-11 | 2026-11-02 | soirée de Noël de la boîte, on te tend le micro | le test du lundi | `soiree-de-noel-entreprise-humour` | Boulot 4 |
| 2 | 03/12/2026 | 2026-12 | 2026-11-23 | pull tricoté au pied du sapin | combien de temps l'autre y a mis | `repas-de-famille-questions-genantes-humour` | Confiance 4 |
| 3 | 07/01/2027 | 2027-01 | null | dîner entre amis, la liste de résolutions de l'autre | répondre par une question | aucun | Confiance 3 |
| 4 | 04/02/2027 | 2027-02 | 2026-11-05 | veille de Saint-Valentin, la réservation oubliée | réparer avant de plaisanter | `blagues-de-couple-drole` | Confiance 2 |
| 5 | 04/03/2027 | 2027-03 | 2027-02-25 | message du 1er avril, vrai ou canular | la réplique qui survit au démenti | `blagues-poisson-d-avril-adultes` | Répartie 4 |
| 6 | 01/04/2027 | 2027-04 | null | fête où tu ne connais que l'hôte, première phrase | s'appuyer sur ce que vous voyez tous les deux | aucun | Machine à Café 2 |

---

## 1. Jeudi 05/11/2026 (période 2026-11, date plancher 2026-11-02, envoi 2026-11-05T08:00:00+01:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A.

**Objet** (41 car.) : Soirée de Noël : on te demande de chanter
**Pré-en-tête** : Trois réponses à « allez, une chanson ! », et le test à passer avant de choisir.

> Salut,
>
> Si c'est ta première lettre : bienvenue. Chaque mois, on prend une situation où tout le monde cherche ses mots, et on y répond de trois façons : la sûre, la joueuse, la risquée. Puis on te donne la règle pour choisir entre elles.
>
> Ce mois-ci, la soirée de Noël de la boîte. 20 h 30, la salle de réunion a des guirlandes, une enceinte, et un karaoké que personne n'avait demandé. Karim, de la compta, tend le micro dans ta direction :
>
> « Allez, une chanson ! Ne fais pas ton timide. »
>
> Tout le service te regarde. Le directeur est à deux mètres, un verre à la main. Voici trois réponses, de la plus prudente à la plus audacieuse. Elles ont un point commun : aucune ne fait semblant d'avoir une vraie raison.
>
> La sûre
> « Quelqu'un doit applaudir. Je prends le poste. »
> Tu ne refuses pas, tu proposes un rôle qui existe vraiment : sans public, un karaoké ne sert à rien. Elle ne vise personne, elle passe devant Karim comme devant le directeur. À choisir quand tu ne connais pas encore l'humeur de la soirée.
>
> La joueuse
> « Ce soir, ma voix est en télétravail. Elle suit la soirée à distance. »
> Tu donnes à ta voix le statut qu'a la moitié du service le vendredi : présente, mais pas dans la salle. Personne ne peut y croire, donc personne ne te demandera lundi si elle va mieux. Dis-la sur le ton d'un message d'absence. À sortir quand Karim a déjà ri d'une de tes phrases dans la soirée.
>
> La risquée
> « Le directeur d'abord. Je ne passe jamais sans première partie. »
> Celle-ci met le directeur dans le jeu : tu te poses en tête d'affiche, et lui devient ta première partie. La hiérarchie s'inverse le temps d'une chanson. Attention, ce n'est pas un refus : si le directeur prend le micro, tu chantes après lui. Elle ne marche que si le directeur rit de lui-même, que la soirée est détendue et que tu es prêt à tenir parole. Sinon, elle reste dans ta tête.
>
> Comment choisir : le test du lundi
> Avant de répondre, demande-toi : « Est-ce que je pourrai la redire lundi, à 9 h, devant la personne concernée, sans avoir envie de m'expliquer ? » Une soirée de boîte s'oublie en une nuit, pas ce qu'on a dit au directeur ni la tête qu'on faisait en le disant. La sûre passe le test devant tout le monde. La joueuse le passe presque toujours. La risquée seulement si le directeur a déjà plaisanté sur lui-même devant toi. Au moindre doute, descends d'un cran.
>
> L'erreur que tout le monde fait
> Inventer une excuse. « Non merci, j'ai une extinction de voix. » Ça marche dix secondes. Puis quelqu'un te propose une pastille, un autre te demande si ça va mieux, et il faut garder la voix cassée jusqu'au dessert, et jusqu'à lundi : « Alors, tu as retrouvé ta voix ? » Une excuse inventée oblige à la jouer. Une phrase vraie, même drôle, se retient toute seule.
>
> À essayer cette semaine
> Pense à ce qu'on te demande en soirée et que tu fuis : chanter, danser, faire un discours, jouer à un jeu. Écris trois réponses, une par niveau, et passe chacun au test du lundi en imaginant la personne en face de toi à 9 h. Garde celle qui ne te fait pas rougir, et dis-la une fois à voix haute, seul, pour entendre comment il sonne.
>
> Notre article suit la soirée de Noël au boulot de l'arrivée au départ, avec la règle des 3 zones pour savoir de quoi rire et de quoi s'abstenir. Il est en lecture libre.
> Lire l'article sur la soirée de Noël au boulot : https://deviens-marrant.fr/blog/soiree-de-noel-entreprise-humour?utm_source=lettre&utm_medium=email&utm_content=n1-article
>
> Et pour le moment d'après, quand on te demande de raconter ta semaine en trente secondes, c'est l'étape 4 du parcours Boulot, « L'afterwork : ta semaine en trente secondes ».
> Aller à l'étape 4 : https://deviens-marrant.fr/parcours/boulot?utm_source=lettre&utm_medium=email&utm_content=n1-etape4#etape-4
>
> [[invitation-premium]]
> PS : tu viens de choisir entre trois réponses. Avec Premium, tu en reçois chaque jeudi : la lettre du mois, plus des lettres réservées aux abonnés, du même genre que celle-ci. Tu ouvres aussi les cinq parcours en entier, étape après étape, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. Le tout pour 1,99 € par mois, résiliable en ligne. La première étape de chaque parcours se lit sans compte, pour essayer.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium
> [[/invitation-premium]]
>
> À bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 1**
- **Leçon neuve** : **le test du lundi** (« pourrai-je la redire lundi à 9 h devant la personne concernée ? »), qui mesure la conséquence après coup d'une réplique. Les réservées jouent sur la cible (12/11), le silence de la visio (26/11), la suite dans les 30 secondes (10/12), le couplet rimé (17/12), le test des deux bouts de la table (24/12), la longueur dans le bruit (31/12). La plus proche est « la suite que ta réplique t'impose » (10/12, ce que tu diras dans les 30 secondes qui suivent) : ici l'horizon est lundi et l'enjeu est la réputation, pas la conversation. À juger à la relecture à l'aveugle.
- **Situation** : soirée de Noël de l'entreprise, invitation à chanter. Aucune des réservées ne se passe au karaoké ou en soirée d'entreprise (machine à café et visio pour le boulot).
- **Erreur neuve** : l'excuse inventée (les réservées : s'expliquer, combler le silence, tirer jusqu'à la corde, contre-attaquer, l'esprit d'escalier).
- **Révision du 25/10 (relecture à l'aveugle)** : la joueuse « contrat d'exclusivité avec ma douche » est remplacée (la blague « seul, sous la douche » existe déjà dans le site, `joke-decryptages.json:701`) par « Ce soir, ma voix est en télétravail. Elle suit la soirée à distance. » (proposition du relecteur, que je garde : dicible, personne n'est visé, le détail du message d'absence fait sourire). Grep « en télétravail » : la vanne `joke-decryptages.json:615` (« En télétravail, mon collègue le plus proche, c'est le livreur. ») partage le mot mais pas le ressort. La risquée devient « Le directeur d'abord. Je ne passe jamais sans première partie. », avec l'explication corrigée (tu te poses en tête d'affiche, le directeur devient ton chauffeur de salle). Phrase de l'intro alignée (« aucune ne fait semblant d'avoir une vraie raison »), PS : « tu en reçois chaque jeudi » (plus de « série »), pont d'article reformulé.
- **Pont d'article** : phrase reprise des faits de la version actuelle validée (« suit la soirée moment par moment, de l'arrivée au départ », « règle des 3 zones », « lecture libre »). L'article, son utm `n1-article` et la date plancher ne changent pas.
- **Étape de fin** : parcours Boulot, étape 4, « L'afterwork : ta semaine en trente secondes » (titre vérifié dans `apps/web/src/config/parcours-etapes.ts`) ; étape 4, donc réservée Premium (la première étape de chaque parcours est la seule gratuite, `config/premium.ts`). Boulot est publié (`BOULOT_PUBLIE = true`).
- **PS** (contrôles communs aux six PS : consigne de Thomas, commit b992da44 : le prix est un argument, « 1,99 € par mois », prix mensuel affiché `PREMIUM_MONTHLY_PRICE_CENTS = 199` de `config/premium.ts`, jamais l'annuel ; le prix et le lien `/abonnement` ne figurent QUE dans le bloc, avec l'utm actuel `n1-premium` ; le mot « offre » est évité ; l'espace avant « € » est à remplacer par l'espace insécable U+00A0 à la saisie dans le JSON, comme `formatEuros`) : tout ce qu'il affirme est dans le code ou dans la décision de Thomas du 25/10 : cinq parcours (`PREMIUM_PARCOURS`, avec Storytelling et Boulot publiés), carnet mensuel (`config/premium.ts`), catalogue sans les limites gratuites (10 vannes, 3 conseils, 3 vidéos), lettre réservée chaque jeudi (décision du 25/10, lancement le 05/11, à confirmer au moment de l'envoi), « résiliable en ligne » et première étape sans compte (déjà dans la version actuelle validée). La lettre se lit complète sans lui.

---

## 2. Jeudi 03/12/2026 (période 2026-12, date plancher 2026-11-23, envoi 2026-12-03T08:00:00+01:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A.

**Objet** (42 car.) : Alors, il te plaît, ce pull tricoté main ?
**Pré-en-tête** : Un cadeau fait main, trois réponses, et la règle pour savoir jusqu'où plaisanter.

> Salut,
>
> Le principe de cette lettre : une situation où l'on cherche ses mots, trois réponses (la sûre, la joueuse, la risquée) et de quoi choisir entre elles.
>
> Ce mois-ci, le 25 au matin, chez tes parents. Le sapin clignote, le café coule, et tata Annie a gardé son paquet pour la fin. Dedans, un pull vert à renne, tricoté main, deux fois trop grand. Elle te regarde, les mains jointes :
>
> « Alors, il te plaît ? Je l'ai fait en trois semaines. »
>
> Tout le salon attend. Voici trois réponses, de la plus prudente à la plus audacieuse. Aucune ne ment sur le pull.
>
> La sûre
> « Trois semaines pour moi ? Je ne l'enlève pas avant ce soir. »
> Tu remercies sans un seul adjectif : tu relèves l'effort et tu promets quelque chose de vrai. Elle passe devant toute la famille, y compris la cousine qui filme. À choisir quand tu sens que la personne n'attend qu'une chose : que tu sois touché.
>
> La joueuse
> « Tu as vu grand. Je vais grandir pour lui. »
> Tu plaisantes sur la taille du pull et sur ta bonne volonté, pas sur la personne : c'est toi qui t'engages à t'adapter au cadeau. Dis-la en souriant, en tenant déjà le pull contre toi. À sortir quand tata Annie sait rire de ses propres élans de générosité.
>
> La risquée
> « Dis-moi que tu n'as pas déjà commencé celui de l'an prochain. »
> Celle-ci vise tata : tu fais semblant de redouter sa générosité, ce qui revient à la féliciter de son endurance. Sous l'effroi joué, tu lui dis que tu sais ce que trois semaines de tricot représentent. Elle ne marche qu'avec une tante qui a ri la première de la taille du pull. Face à quelqu'un qui doute de son tricot, garde-la pour toi.
>
> Comment choisir : combien de temps l'autre y a mis
> Regarde le temps que la personne a mis dans ce cadeau, pas ce qu'il a coûté : acheté en ligne en cinq minutes, choisi pour toi pendant un après-midi, ou fait de ses mains pendant trois semaines. Plus l'autre y a mis de soi, moins tu joues sur l'objet. Pour un cadeau fait main, la sûre, puis la joueuse si tu vois un sourire. La risquée, seulement si la personne a déjà ri de son cadeau avant toi. Au moindre doute, remercie d'abord, plaisante ensuite.
>
> L'erreur que tout le monde fait
> Le « génial ! » de façade. « Waouh, trop beau, j'adore ! », dit trop fort, trop vite, sans un seul détail. Une tante entend ce genre de phrase depuis cinquante Noëls et elle sait la reconnaître. Un détail vrai sonne plus sincère que trois adjectifs : la couleur, le renne, la taille, les trois semaines. Dire ce que tu vois vaut mieux que dire que tu adores.
>
> À essayer cette semaine
> Pense au dernier cadeau qui t'a laissé sans voix, ou à celui que tu redoutes cette année. Écris trois phrases, une par niveau, et souligne dans chacune le détail vrai. Note aussi le temps que la personne y a mis : c'est lui qui te dit laquelle garder. Puis dis la sûre à voix haute devant un miroir, un vêtement contre toi, pour entendre si tu as l'air touché ou l'air poli.
>
> Noël, c'est aussi les questions qui piquent. Notre article « Repas de famille : répondre aux questions gênantes » passe en revue six questions de Noël, à commencer par « Alors, t'as quelqu'un ? ». Chacune a sa sortie si on insiste. Lecture libre.
> Lire l'article : https://deviens-marrant.fr/blog/repas-de-famille-questions-genantes-humour?utm_source=lettre&utm_medium=email&utm_content=n2-article
>
> Et pour tenir sa place à une grande tablée sans se forcer, c'est le sujet de l'étape 4 du parcours Confiance, « Être à l'aise en groupe ».
> Aller à l'étape 4 : https://deviens-marrant.fr/parcours/confiance?utm_source=lettre&utm_medium=email&utm_content=n2-etape4#etape-4
>
> [[invitation-premium]]
> PS : si cette lettre t'a donné envie d'être prêt avant le repas, Premium est fait pour ça. Une lettre chaque jeudi : la lettre du mois, puis des lettres réservées aux abonnés, du même genre que celle-ci, les cinq parcours en entier, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. 1,99 € par mois, résiliable en ligne. La première étape de chaque parcours se lit sans compte, pour essayer.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n2-premium
> [[/invitation-premium]]
>
> Bonnes fêtes, et à bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 2**
- **Leçon neuve** : **combien de temps l'autre y a mis** (l'attachement de l'autre à l'objet fixe la dose de jeu). Les réservées : cible, silence, suite, couplet, test des deux bouts de la table, bruit. La plus proche, « le test de la table » (24/12), regarde qui écoute ; ici, on regarde ce que l'autre a investi dans ce qu'on commente. À juger à la relecture à l'aveugle.
- **Situation** : ouverture d'un cadeau le 25 au matin. La réservée du 24/12 est le repas du réveillon avec la question de tonton : scène, personnage, pique et moment différents (matin, cadeau, tata Annie, pas de public à table).
- **Erreur neuve** : l'enthousiasme de façade.
- **Révision du 25/10 (relecture à l'aveugle)** : la risquée « Tata, soit tu m'aimes beaucoup, soit tu as perdu un pari. » disait que le pull était une punition, dans une scène où la règle de la lettre l'exclut. Le relecteur proposait « Deux tailles au-dessus, tata. Tu as vu le menu de midi ? » ; je ne l'ai pas gardée (le lien avec le repas ne se lit pas du premier coup, et elle reprend la taille déjà jouée par la joueuse). Remplacement : « Dis-moi que tu n'as pas déjà commencé celui de l'an prochain. », qui vise tata sans critiquer le pull (la lecture peut être de l'effroi ou de la tendresse, c'est le jeu) et reste conditionnée à une tante qui te chambre déjà. « Comment choisir » : « La risquée, seulement si la personne a déjà ri de son cadeau avant toi », « de soi » à la place de « d'elle ». Pont d'article : fin de phrase sur les réparties et la limite du physique retirée (« Chacune a sa sortie si on insiste. Lecture libre. »). Grep « déjà commencé », « celui de l'an prochain » : aucune reprise.
- **Anti-doublon** : Grep « pull », « tricot », « renne », « tata », « pari », « cadeau » dans `apps/web/src/data` : aucune vanne ni réplique reprise (les occurrences de « pull » sont dans des exemples sur la mère et le vendeur, de « cadeau » dans le Secret Santa et le rayon des retardataires, sans rapport avec un pull tricoté).
- **Pont d'article** : les faits (« six questions de Noël », « Alors, t'as quelqu'un ? » en tête, « chacune a sa sortie si on insiste ») sont repris de la version actuelle validée. L'article, son utm `n2-article` et la date plancher ne changent pas.
- **Étape de fin** : Confiance, étape 4, « Être à l'aise en groupe » (titre vérifié dans `parcours-etapes.ts`) ; réservée Premium (au-delà de l'étape 1). La phrase ne dit que le titre de l'étape.
- **Fin** : « Bonnes fêtes, et à bientôt, » reste vraie pour un abonné, qui reçoit une lettre réservée la semaine suivante (10/12) : elle ne promet aucun silence.
- **PS** : même contrôle que la lettre 1 (prix `1,99 € par mois`, uniquement dans le bloc ; l'espace avant « € » sera insécable dans le JSON).

---

## 3. Jeudi 07/01/2027 (période 2027-01, date plancher null, envoi 2027-01-07T08:00:00+01:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A. Aucun article cité (`datePlancher` null), comme dans la version actuelle.

**Objet** (39 car.) : Il a planifié toute son année. Et toi ?
**Pré-en-tête** : Quand quelqu'un expose ses résolutions, trois questions à lui renvoyer, et comment choisir.

> Salut,
>
> Bonne année. Le principe de cette lettre : une situation où l'on cherche ses mots, trois réponses (la sûre, la joueuse, la risquée) et de quoi choisir entre elles.
>
> Ce mois-ci, le premier dîner de l'année, chez des amis. Axel a pris son verre et son ton des grands jours :
>
> « Cette année, j'ai tout planifié : sport trois fois par semaine, lecture, méditation. Et toi, c'est quoi, tes résolutions ? »
>
> Tu n'as rien planifié du tout. Au lieu de répondre à sa place, voici trois réponses qui renvoient la balle sous forme de question, de la plus prudente à la plus audacieuse.
>
> La sûre
> « Comment tu fais tenir tout ça dans une semaine ? Il faut que je voie ce planning. »
> Tu demandes comment, avec une vraie curiosité. Axel adore qu'on lui demande, la conversation lui appartient, et toi tu respires. Elle ne vise personne, elle passe devant n'importe quel convive. À choisir quand tu ne connais pas bien celui qui parle.
>
> La joueuse
> « Tu as prévu un créneau pour le jour où tu abandonnes ? »
> Tu prends son plan au sérieux au point d'y inscrire la panne. La question porte sur le planning, pas sur Axel, et c'est ce qui la rend rieuse plutôt que méchante. À sortir quand il a déjà plaisanté sur ses propres bonnes intentions.
>
> La risquée
> « On se reparle de tout ça en février ? Je note la date. »
> Celle-ci vise Axel : tu lui fixes un rendez-vous pour faire le bilan. Elle ne marche que si vous êtes de ceux qui se chambrent et que son enthousiasme est assez solide pour encaisser. Devant quelqu'un qui doute déjà de lui, elle prend le ton d'un huissier.
>
> Comment choisir : le premier mot de la question
> Regarde comment ta question commence. Avec « comment », elle cherche à savoir comment l'autre fait : c'est la plus sûre. Avec « tu as prévu » ou « et si », elle joue sur ce qui pourrait arriver : c'est la joueuse. Avec « on se reparle » ou « est-ce que tu vas vraiment », elle vérifie que l'autre tiendra : c'est la plus risquée. Plus ta question vérifie, plus elle pique, quel que soit son premier mot : « comment tu vas tenir ? » commence bien, mais vérifie déjà. Au moindre doute, demande comment il fait, pas s'il va tenir.
>
> L'erreur que tout le monde fait
> Poser la question, puis y répondre à sa place. « Tu as prévu un créneau pour le jour où tu abandonnes ? Moi, de toute façon, je ne prends jamais de résolutions, c'est nul. » Axel n'a pas eu le temps de respirer, et ta question est devenue un prétexte pour parler de toi. Après une question, bois une gorgée, regarde l'autre, et laisse le silence faire son travail.
>
> À essayer cette semaine
> La prochaine fois que quelqu'un t'annonce un grand projet, pose une seule question qui commence par « comment », et écoute la réponse jusqu'au bout. Ensuite, écris trois questions pour la même annonce, une par mot de départ : « comment », « tu as prévu », « on se reparle ». Garde la première, c'est elle qui te servira le plus souvent.
>
> Pour poser de meilleures questions, il faut d'abord regarder avant de parler : c'est le sujet de l'étape 3 du parcours Confiance, « L'œil de l'observateur ».
> Aller à l'étape 3 : https://deviens-marrant.fr/parcours/confiance?utm_source=lettre&utm_medium=email&utm_content=n3-etape3#etape-3
>
> [[invitation-premium]]
> PS : savoir poser la bonne question, ça s'apprend. Avec Premium, tu t'entraînes toute l'année : les cinq parcours en entier, une lettre chaque jeudi dont des lettres réservées aux abonnés, du même genre que celle-ci, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. 1,99 € par mois, résiliable en ligne. Chaque parcours commence par une première étape qui se lit sans compte.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n3-premium
> [[/invitation-premium]]
>
> À bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 3**
- **Leçon neuve** : **répondre par une question, et choisir selon ses premiers mots** (« comment », « tu as prévu », « on se reparle »). Aucune réservée ne traite la réponse sous forme de question (cible, silence, suite, couplet, deux bouts de la table, bruit). Technique voisine sur le site : « la relance par acceptation » (« oui, et… », fiche Kyan Khojandi et Navo, `video-content-s20.json:628`), qui traite du duo de scène, pas d'une question posée à quelqu'un qui expose son plan.
- **Situation** : premier dîner de l'année chez des amis, un convive expose ses résolutions. Ni la coloc, ni le boulot, ni la famille, ni la fête de fin d'année des réservées.
- **Erreur neuve** : poser la question puis y répondre à sa place. Le correctif (« bois une gorgée ») évite de reprendre « compte jusqu'à trois dans ta tête » des réservées 19/11 et 26/11.
- **Anti-doublon** : Grep dans `apps/web/src/data` de « planning », « créneau », « tout planifié », « résolution », « je note la date », « en février », « abandonn » : aucune réplique reprise (des vannes sur des résolutions existent, `joke-decryptages.json:126`, `:546`, `:971`, `:1061` : autres blagues).
- **Aucun article cité** : le numéro garde `datePlancher` null. L'ancien lien vers l'étape 1 de Confiance (sans compte) est remplacé, sur consigne du coordinateur, par un lien vers une étape réservée Premium.
- **Étape de fin** : Confiance, étape 3, « L'œil de l'observateur » (titre vérifié dans `parcours-etapes.ts`) ; réservée Premium (au-delà de l'étape 1).
- **Révision du 25/10 (bloquant de la relecture)** : la règle ne décrivait qu'une réplique sur trois (la sûre ne commençait pas par « comment », la risquée par « on se reparle »). La sûre devient « Comment tu fais tenir tout ça dans une semaine ? Il faut que je voie ce planning. » (proposition du relecteur), et la règle est réécrite pour coller aux trois : « comment » (sûre), « tu as prévu » ou « et si » (joueuse), « on se reparle » ou « est-ce que tu vas vraiment » (risquée, qui vérifie). Exercice aligné. Objet : « Il a planifié toute son année. Et toi ? » (39 caractères ; le relecteur en annonçait 38, le Grep dit 39). PS : « sans engagement » retiré, « résiliable en ligne » gardé. Grep « fais tenir », « voir ce planning » : aucune reprise.
- **PS** : même contrôle que la lettre 1.

---

## 4. Jeudi 04/02/2027 (période 2027-02, date plancher 2026-11-05, envoi 2027-02-04T08:00:00+01:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A.

**Objet** (34 car.) : J'ai oublié de réserver pour le 14
**Pré-en-tête** : Une réservation oubliée, trois réponses, et l'ordre dans lequel les dire.

> Salut,
>
> Dans dix jours, c'est la Saint-Valentin. Le principe de cette lettre : une situation où l'on cherche ses mots, trois réponses (la sûre, la joueuse, la risquée) et de quoi choisir entre elles.
>
> Ce mois-ci, samedi 13 février, 17 h 40. Tu rentres, Sam range ses chaussures et demande à quelle heure vous dînez demain. Tu réalises que tu n'as rien réservé. Sam l'a compris avant toi, au silence :
>
> « Tu avais une chose à faire pour demain. Une seule. »
>
> Voici trois réponses, de la plus prudente à la plus audacieuse. Elles ne se disent pas au même moment, et c'est justement le sujet.
>
> La sûre
> « Tu as raison, c'est moi. Donne-moi vingt minutes, je téléphone partout. »
> Pas de blague : tu reconnais, et tu agis. C'est la réponse qui désamorce le plus vite, parce qu'elle donne à Sam ce que Sam attendait derrière la pique : la preuve que tu as pris la mesure. À dire tout de suite, toujours.
>
> La joueuse
> « Bonne nouvelle : j'ai une table. Mauvaise nouvelle : 18 h 15, avec les retraités. »
> Elle se dit vingt minutes plus tard, une fois la réservation obtenue. La blague porte sur l'heure du dîner, pas sur l'oubli : tu ris de la solution, quand le problème est réglé. Dis-la avec le sourire de quelqu'un qui revient avec une victoire de justesse.
>
> La risquée
> « Pour ma défense, la mission était secrète : même moi, je n'étais pas au courant. »
> Celle-ci plaisante tout de suite, avant d'avoir réparé, et elle fait de l'oubli le sujet de la blague. Elle ne marche que si Sam rit déjà, que le ton n'est pas tendu, et que vous avez l'habitude de vous moquer de vos propres bourdes. Sinon, elle sonne comme une façon de ne pas dire pardon.
>
> Comment choisir : d'abord réparer, ensuite plaisanter
> Écoute le ton de l'autre. Si la voix est tendue, la sûre, tout de suite, sans rien d'autre. Si elle sourit déjà, tu peux plaisanter, mais jamais avant d'avoir dit « tu as raison » ni avant d'avoir une solution. La blague se glisse après la réparation : plus tu plaisantes tôt, plus tu prends de risque. Au moindre doute, commence par la sûre et garde la joueuse pour le moment où la table est réservée.
>
> L'erreur que tout le monde fait
> En faire trop dans l'excuse. « Je suis vraiment nul, je gâche tout, tu mérites mieux. » Tu croyais t'excuser deux fois plus, et c'est Sam qui doit te consoler, la veille de la Saint-Valentin. Une excuse tient en une phrase : « tu as raison, c'est moi ». Au-delà, c'est l'autre qui répare à ta place.
>
> À essayer cette semaine
> Pense à la dernière bourde que tu as faite devant quelqu'un que tu aimes bien, au travail ou à la maison. Écris trois phrases, dans l'ordre : celle qui reconnaît (« tu as raison, c'est moi »), celle qui répare (ce que tu fais dans les vingt minutes), celle qui plaisante (pour plus tard). Dis-les à voix haute dans cet ordre, et garde la dernière pour le moment où l'autre a souri le premier.
>
> Une fois la crise passée, il reste les blagues à se dire. Notre article « Blagues de couple : 30 vannes à se dire ou à s'envoyer » les range par moment du quotidien, du canapé aux messages de la journée. Lecture libre.
> Lire l'article : https://deviens-marrant.fr/blog/blagues-de-couple-drole?utm_source=lettre&utm_medium=email&utm_content=n4-article
>
> Et savoir rire d'une bourde sans se rabaisser, c'est le sujet de l'étape 2 du parcours Confiance, « Rire de toi sans te rabaisser ».
> Aller à l'étape 2 : https://deviens-marrant.fr/parcours/confiance?utm_source=lettre&utm_medium=email&utm_content=n4-etape2#etape-2
>
> [[invitation-premium]]
> PS : le jour où la bourde est pour toi, mieux vaut avoir déjà la phrase. Avec Premium, tu la prépares à l'avance : les cinq parcours en entier, une lettre chaque jeudi dont des lettres réservées aux abonnés, du même genre que celle-ci, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. 1,99 € par mois, résiliable en ligne. La première étape de chaque parcours se lit sans compte.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n4-premium
> [[/invitation-premium]]
>
> À bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 4**
- **Leçon neuve** : **d'abord réparer, ensuite plaisanter** (l'ordre et le moment de la blague par rapport à la réparation). Les réservées : cible, silence, suite à assurer dans les 30 secondes, couplet, test de la table, bruit. La plus proche, « la suite que ta réplique t'impose » (10/12), regarde ce que tu diras après la réplique ; ici, on décide quand la dire par rapport à l'excuse.
- **Situation** : couple installé, veille de la Saint-Valentin, réservation oubliée. La réservée du 10/12 est un premier rendez-vous avec une tisane : scène, enjeu et personnages différents. Sam est neutre en genre.
- **Erreur neuve** : en faire trop dans l'excuse (« Je suis vraiment nul, je gâche tout »), qui oblige l'autre à te consoler. **Révision du 25/10 (bloquant de la relecture)** : l'ancienne erreur (la blague à la place du « tu as raison ») redisait la règle et l'explication de la risquée ; remplacée par la proposition du relecteur, mot pour mot, qui prépare en plus l'étape liée en fin de lettre (« Rire de toi sans te rabaisser »). Mineurs repris : « ce que Sam attendait derrière la pique » (plus de genre), « garde la joueuse pour le moment où la table est réservée » (cohérent avec « vingt minutes plus tard »). La joueuse « avec les retraités » est gardée, comme le relecteur le suggère.
- **Anti-doublon** : Grep « retraités », « mission », « réserv », « ma défense », « une table », « Saint-Valentin » : aucune réplique reprise (les « mission » et « réserv » trouvés sont d'autres vannes sans rapport, lues une par une).
- **Pont d'article** : la phrase reprend les faits de la version actuelle validée (« 30 vannes à se dire ou à s'envoyer », « rangées par moment du quotidien », « du canapé aux messages de la journée », « lecture libre »). L'article, son utm `n4-article` et la date plancher ne changent pas.
- **Étape de fin** : Confiance, étape 2, « Rire de toi sans te rabaisser » (titre vérifié dans `parcours-etapes.ts`) ; réservée Premium.
- **PS** : même contrôle que la lettre 1.
- **Fragilité** : « avec les retraités » est une plaisanterie sur l'heure du dîner, pas sur les personnes ; si le relecteur la juge âgiste, repli : « Bonne nouvelle : j'ai une table. Mauvaise nouvelle : 18 h 15, on dînera au goûter. »

---

## 5. Jeudi 04/03/2027 (période 2027-03, date plancher 2027-02-25, envoi 2027-03-04T08:00:00+01:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A.

**Objet** (40 car.) : Message du 1er avril : vrai ou canular ?
**Pré-en-tête** : Une annonce qui peut être un canular, trois réponses qui restent justes, et celle qui parie.

> Salut,
>
> Dans quatre semaines, c'est le 1er avril. Le principe de cette lettre : une situation où l'on cherche ses mots, trois réponses (la sûre, la joueuse, la risquée) et de quoi choisir entre elles.
>
> Ce mois-ci, un message qui peut être vrai ou faux. Le 1er avril, 8 h 02, ton téléphone vibre dans le groupe de la coloc. Malik a écrit :
>
> « Le propriétaire passe vendredi à 18 h avec des acheteurs. Il faut tout ranger. »
>
> Malik est capable d'avoir inventé ça en pyjama, comme d'avoir reçu un vrai mail. Tu as trente secondes pour répondre dans le groupe sans te tromper dans aucun des deux cas. Voici trois réponses, de la plus prudente à la plus audacieuse.
>
> La sûre
> « Merci de prévenir. Tu peux transférer le mail du proprio dans le groupe ? »
> Elle reste juste que le message soit vrai ou non : tu demandes la preuve sans accuser personne. Si c'est vrai, tu as la date et l'heure noir sur blanc ; si c'est un canular, Malik avoue de lui-même. À choisir quand tu ne sais pas à qui tu as affaire, ou quand le sujet touche quelque chose de sérieux, comme ton logement.
>
> La joueuse
> « Vrai ou pas, je range. On attendait une bonne raison depuis Noël. »
> Tu joues sur l'état de l'appartement, pas sur Malik : si c'est vrai, tu as promis de ranger ; si c'est un canular, sa blague vient de vous rendre service. Elle survit au démenti dans les deux sens. Dis-la comme une bonne résolution. À sortir quand le groupe sait rire de sa propre coloc.
>
> La risquée
> « 8 h 02 le 1er avril. Tu n'as même pas attendu que le café coule. »
> Celle-ci vise Malik : tu l'accuses du canular avant la preuve. Si c'en est un, tu as gagné la manche. Si c'est vrai, tu viens de te moquer de quelqu'un qui te prévenait d'une visite et tu as l'air d'avoir pris un vrai problème pour une blague. C'est la seule qui parie sur une seule des deux issues.
>
> Comment choisir : celle qui survit au démenti
> Avant de répondre à une annonce qui peut être un canular, demande-toi : « Que devient ma phrase si c'est vrai ? Et si c'est faux ? » La sûre et la joueuse tiennent dans les deux cas. La risquée ne tient que dans l'un : elle est pour les gens qui n'ont rien à perdre, ou pour quand tu es certain. Au moindre doute, choisis la phrase qui ne dépend pas de la réponse.
>
> L'erreur que tout le monde fait
> Agir avant de vérifier. Tu reçois une annonce surprenante et tu réagis tout de suite : tu annules ton rendez-vous de vendredi, tu préviens ton collègue que tu pars tôt. Une demi-heure plus tard, Malik écrit « poisson d'avril », et il faut démentir chez deux personnes. Le 1er avril, comme les 364 autres jours, vérifie d'abord, agis ensuite.
>
> À essayer cette semaine
> La prochaine fois qu'une annonce surprenante t'arrive (vraie ou pas), écris deux phrases qui restent justes dans les deux cas, puis une troisième qui parie. Pas pour l'envoyer : pour sentir la différence. Puis vérifie en deux minutes (une source, un coup de fil) avant de répondre à quiconque.
>
> Et si c'est toi qui prépares le canular : notre article « Blague poisson d'avril pour adultes » réunit des idées de canulars classées par terrain. Aucune n'est dangereuse ni humiliante, et on y trouve quoi faire si quelqu'un le prend mal. Lecture libre.
> Lire l'article : https://deviens-marrant.fr/blog/blagues-poisson-d-avril-adultes?utm_source=lettre&utm_medium=email&utm_content=n5-article
>
> Et quand l'inattendu te tombe dessus sans prévenir, c'est le sujet de l'étape 4 du parcours Répartie, « Improviser sur l'inattendu ».
> Aller à l'étape 4 : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre&utm_medium=email&utm_content=n5-etape4#etape-4
>
> [[invitation-premium]]
> PS : le jour où l'inattendu arrive, mieux vaut avoir déjà une réponse en réserve. Avec Premium, tu la prépares : les cinq parcours en entier, une lettre chaque jeudi dont des lettres réservées aux abonnés, du même genre que celle-ci, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. 1,99 € par mois, résiliable en ligne. La première étape de chaque parcours se lit sans compte.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n5-premium
> [[/invitation-premium]]
>
> À bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 5**
- **Leçon neuve** : **la réplique qui survit au démenti** (choisir une phrase qui reste juste que l'annonce soit vraie ou fausse ; la risquée est celle qui parie). Aucune réservée ne traite une information incertaine.
- **Situation** : message du 1er avril dans le groupe de la coloc, vrai ou canular. Le salon de coloc de la réservée du 12/11 est une scène orale, avec Hugo et huit personnes ; ici, un message écrit.
- **Erreur neuve** : agir avant de vérifier (annuler son rendez-vous, prévenir son collègue). La phrase « comme les 364 autres jours » est un trait d'esprit, pas un chiffre : à retirer si le relecteur la juge appuyée.
- **Révision du 25/10 (bloquant de la relecture)** : la joueuse « Excellente nouvelle. Je suis en train de ne pas y croire, je reviens. » ne survivait pas au démenti (fausse si l'annonce est vraie). Remplacée par « Vrai ou pas, je range. On attendait une bonne raison depuis Noël. » : la proposition du relecteur disait « Ça fait depuis Noël », tournure fautive, que j'ai corrigée. La sûre devient « Merci de prévenir. Tu peux transférer le mail du proprio dans le groupe ? » (proposition du relecteur : elle demande la preuve, ce que la lettre conseille, au lieu de répéter « je range »). L'erreur « relayer » est renommée « agir avant de vérifier », avec un exemple plausible. Léo devient Malik (Léa est dans la réservée du 12/11). PS : « sans engagement » retiré, « résiliable en ligne » gardé (même traitement que la lettre 3). Grep « vrai ou pas », « bonne raison », « depuis Noël », « transférer », « mail du proprio » : aucune reprise.
- **Anti-doublon** : Grep « y croire », « mon avis », « café coule », « bien reçu », « propriétaire », « 1er avril », « canular » : « Bien reçu » apparaît comme chute d'autres vannes (`joke-decryptages.json:36`, `:1446`) ; l'ancienne sûre commençait par cette formule et l'avait quittée. Aucune reprise dans la version révisée.
- **Pont d'article** : les faits (« idées de canulars classées par terrain », « aucune n'est dangereuse ni humiliante », « quoi faire si quelqu'un le prend mal », « lecture libre ») sont repris de la version actuelle validée. L'article, son utm `n5-article` et la date plancher ne changent pas.
- **Étape de fin** : Répartie, étape 4, « Improviser sur l'inattendu » (titre vérifié dans `parcours-etapes.ts`) ; réservée Premium. La même étape est liée dans la réservée du 10/12 (autre lettre, autre sujet) : à changer si le relecteur y voit un doublon, par exemple Répartie 2, « Le rythme et les silences ».
- **PS** : même contrôle que la lettre 1.

---

## 6. Jeudi 01/04/2027 (période 2027-04, date plancher null, envoi 2027-04-01T08:00:00+02:00)

`[Framework : PAS (problème, agitation, solution)]` `[Conscience : Problem-Aware]` · Format A. Aucun article cité (`datePlancher` null), comme dans la version actuelle. Le numéro part le 1er avril : il ne fait volontairement aucune blague de poisson d'avril (la lettre 5 a déjà traité la date).

**Objet** (36 car.) : Une fête où tu ne connais que l'hôte
**Pré-en-tête** : Comment ouvrir la conversation avec un inconnu : trois phrases, et la règle pour choisir.

> Salut,
>
> Le principe de cette lettre : une situation où l'on cherche ses mots, trois réponses (la sûre, la joueuse, la risquée) et de quoi choisir entre elles. Cette fois, il n'y a pas de pique : il y a un silence à rompre, et c'est toi qui parles en premier.
>
> Ce mois-ci, l'anniversaire de Nina, un samedi de printemps, 21 h. L'appartement est plein, la fenêtre est ouverte, et tu ne connais que Nina, qui est partie chercher des glaçons. Tu te retrouves devant la table des gâteaux apéritifs, à côté d'un inconnu qui regarde le même saladier que toi. Un seul de vous deux va parler.
>
> Voici trois phrases pour ouvrir, de la plus prudente à la plus audacieuse.
>
> La sûre
> « Tu as goûté le truc dans le petit bol ? Je n'ose pas. »
> Tu parles de ce que vous avez sous les yeux, et tu avoues une hésitation minuscule. L'autre peut répondre en dix secondes : « oui, c'est bon » ou « non, moi non plus ». Elle ne demande rien, elle donne un point d'entrée. À choisir quand tu ne sais rien de la personne et que tu veux que ça passe.
>
> La joueuse
> « Je cherche quelqu'un qui connaît Nina depuis plus de dix ans. Je fais mon enquête. »
> Tu t'appuies sur ce que vous avez en commun, la fête et l'hôte, et tu transformes la gêne en jeu. Elle demande une petite histoire en retour (« la fac », « la coloc de 2015 »), donc un peu plus d'effort à l'autre. À sortir quand le sourire est déjà venu, et que l'autre n'est pas pressé de repartir.
>
> La risquée
> « Tu es venu pour Nina ou pour le buffet ? Moi, je ne dis rien. »
> Celle-ci vise la personne en face : tu lui prêtes une intention et tu la mets au défi de se situer, mais tu avoues le premier que tu es peut-être là pour le buffet aussi, ce qui lui laisse une porte. Elle demande à l'autre de choisir un camp et de rire de lui-même avec un inconnu. Elle ne marche que si vous avez déjà échangé quelques mots, ou si l'ambiance est très décontractée. Sinon, elle peut passer pour une accusation.
>
> Comment choisir : combien de travail tu donnes à l'autre
> Une première phrase se juge à ce qu'elle demande à l'autre. La sûre se répond en un mot et dix secondes. La joueuse demande un petit récit. La risquée demande de prendre position. Plus tu connais peu la personne, moins ta phrase doit lui demander. Vise une réponse qui tient dans dix secondes, et monte d'un cran seulement quand l'autre a commencé à parler.
>
> L'erreur que tout le monde fait
> S'excuser de déranger. « Excuse-moi, je te dérange ? » La question oblige l'autre à répondre « non, pas du tout », donc à te rassurer avant même de savoir pourquoi tu parles, et elle annonce que tu te sens de trop. Va directement au saladier : une phrase qui ressemble à la scène que vous avez sous les yeux dérange moins que n'importe quelle excuse.
>
> À essayer cette semaine
> Écris trois premières phrases pour la prochaine fois que tu te retrouveras à côté d'un inconnu (une fête, une salle d'attente, la queue d'un guichet). Chacune doit s'appuyer sur ce que vous voyez tous les deux. Pour chacune, estime en combien de secondes l'autre peut répondre : si c'est plus de dix, raccourcis. Dis la première à voix haute, sans l'adresser à personne, pour sentir si elle est facile à dire.
>
> Après la première phrase, il faut sentir le moment de la suivante : c'est le sujet de l'étape 2 du parcours Machine à Café, « Sentir le bon moment ».
> Aller à l'étape 2 : https://deviens-marrant.fr/parcours/machine-a-cafe?utm_source=lettre&utm_medium=email&utm_content=n6-etape2#etape-2
>
> [[invitation-premium]]
> PS : entamer une conversation, ça se travaille. Avec Premium, tu t'y exerces à ton rythme : les cinq parcours en entier, une lettre chaque jeudi dont des lettres réservées aux abonnés, du même genre que celle-ci, le carnet de situations de répartie et tout le catalogue de vannes, de conseils et de vidéos. 1,99 € par mois, résiliable en ligne. La première étape de chaque parcours se lit sans compte.
> Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n6-premium
> [[/invitation-premium]]
>
> À bientôt,
> L'Équipe Deviens Marrant

**Notes et contrôles de la lettre 6**
- **Leçon neuve** : **combien de travail ta phrase donne à l'autre** (la taille de la réponse demandée : un mot en dix secondes, un petit récit, une prise de position). Les réservées jugent la cible (12/11), le silence (26/11), ce que tu diras après (10/12), le public par l'âge (24/12), le bruit (31/12) : ici, l'effort que ta phrase demande à celui qui répond. La plus proche reste « la suite que ta réplique t'impose » (10/12) mais elle regarde ton prochain mot, pas l'effort de l'autre. À juger à la relecture à l'aveugle.
- **Situation** : première phrase à un inconnu à une fête où l'on ne connaît que l'hôte. Pas de pique. Aucune réservée ne traite l'entrée en matière avec un inconnu (rendez-vous du 10/12 : on se connaît déjà par messages).
- **Erreur neuve** : s'excuser de déranger.
- **Anti-doublon** : Grep « petit bol », « enquête », « pour le buffet », « venu pour », « connais personne » : aucune réplique reprise. Thème voisin, autre blague : « Je connaissais que l'hôte. » (`joke-decryptages.json:1287`, vanne sur la stratégie de survie du seul invité connu) et la fiche « La randonnée sans fin » (`carnet/2026-10.json:40`, un inconnu qui raconte une randonnée).
- **Aucun article cité** : le numéro garde `datePlancher` null. L'ancien lien vers l'étape 1 de Répartie (sans compte) est remplacé, sur consigne du coordinateur, par un lien vers une étape réservée Premium.
- **Étape de fin** : Machine à Café, étape 2, « Sentir le bon moment » (titre vérifié dans `parcours-etapes.ts`) ; réservée Premium.
- **Révision du 25/10 (GO du relecteur, mineurs repris)** : objet « Une fête où tu ne connais que l'hôte » (36 caractères, il n'était pas vrai que tu ne connaissais personne) ; pont de fin « Après la première phrase, il faut sentir le moment de la suivante : c'est le sujet de l'étape 2… » (le lien et l'étape ne changent pas) ; explication de la risquée complétée (« tu avoues le premier que tu es peut-être là pour le buffet aussi, ce qui lui laisse une porte »). Aucune réplique modifiée.
- **PS** : même contrôle que la lettre 1.

---

## Contrôles communs aux six lettres

- **Forme** : objets de 41, 42, 39, 34, 40 et 36 caractères (max 45, comptés par motif de longueur exacte). Chaque corps commence par « Salut, » et finit par « À bientôt, » puis « L'Équipe Deviens Marrant » (30 lignes trouvées pour 6 lettres avec les marqueurs), sauf la lettre 2 : « Bonnes fêtes, et à bientôt, », vraie aussi pour un abonné qui reçoit une lettre réservée la semaine suivante. Zéro tiret cadratin ou demi-cadratin, zéro émoji (Grep sur tout le fichier : 0), pas de guillemets imbriqués dans les corps.
- **Schéma de `apps/web/src/lib/lettre/numeros.ts`** : (1) marqueurs `[[invitation-premium]]` et `[[/invitation-premium]]` une fois chacun, seuls sur leur ligne, paragraphe à part (30 lignes comptées pour les 6 lettres : 2 marqueurs, « Salut, », la fin et la signature) ; (2) la version sans le bloc ne contient ni « offre », ni « annuel », « parrain », « promo », « remise », « réduction », ni « € », ni « /abonnement », ni marqueur « [À COMPLÉTER » (Grep des mots interdits sur les lignes de corps : seules les lignes du PS contiennent « € » et le lien `/abonnement`, et le mot « offre » n'apparaît nulle part) ; (3) corps de plus de 50 caractères ; (4) `periode`, `datePlancher` et `envoiPrevu` identiques à `numeros.json`, donc cohérents avec `dateEnvoiLettre` (premier jeudi du mois à 8 h Paris, ou le premier jeudi après la date plancher).
- **Liens d'article** (n°1, 2, 4, 5) : les slugs `soiree-de-noel-entreprise-humour`, `repas-de-famille-questions-genantes-humour`, `blagues-de-couple-drole` et `blagues-poisson-d-avril-adultes` sont inchangés, avec leur utm `n1-article`, `n2-article`, `n4-article`, `n5-article` et leurs dates plancher. Je n'ai pas rouvert la base pour vérifier la publication (le contrôle de démarrage `controlerDatesPlancher` s'en charge) ; les slugs sont référencés dans le code (`config/blog-cta.ts`, `config/blog-related-cards.ts`).
- **Liens d'étape** (tous nouveaux, utm `nN-etapeM`) : Boulot 4, Confiance 4, Confiance 3, Confiance 2, Répartie 4, Machine à Café 2. Titres vérifiés dans `apps/web/src/config/parcours-etapes.ts` ; toutes sont au-delà de l'étape 1, donc réservées Premium (`config/premium.ts` : « première étape offerte » seulement) ; chaque parcours est publié (`STORYTELLING_PUBLIE` et `BOULOT_PUBLIE` à `true`). Un compte gratuit qui clique voit l'aperçu visiteur de l'étape (s17) : la phrase du lien ne dit que le titre de l'étape, sans pousser l'abonnement.
- **PS** (consigne de Thomas, commit b992da44) : six PS différents, chacun accroché à la leçon de sa lettre, tous avec « 1,99 € par mois » (prix mensuel de `PREMIUM_MONTHLY_PRICE_CENTS = 199`, pas d'annuel), « résiliable en ligne » (« sans engagement » retiré de tous les PS après la relecture, pour ne pas redire), le lien `/abonnement` avec l'utm `nN-premium` d'origine. Ils énumèrent ce que Premium ouvre : cinq parcours en entier, lettre chaque jeudi dont des lettres réservées, carnet de situations de répartie, catalogue de vannes, de conseils et de vidéos. « Une lettre chaque jeudi dont des lettres réservées » est vraie (confirmé par le coordinateur : la lettre de la semaine est en ligne, première lettre réservée le 12/11) ; la remarque du relecteur sur `LETTRE_HEBDO_PROMESSE` est écartée sur sa consigne. « Les cinq parcours » suppose Storytelling et Boulot publiés, ce qui est le cas dans le code. Chaque lettre se lit complète sans son PS.
- **Format B** : aucune des six lettres n'est en format B. Le format le permet mais pas l'impose ; je n'ai pas trouvé de passage qui remplisse les conditions (source écrite détaillée, absence de fiche vidéo ou de technique équivalente) en plus des deux B déjà écrites pour les réservées. À proposer plutôt à partir de l'été, après la validation du format par Thomas.
- **Leçons** : une par lettre, différente des sept réservées (cible, titre-résumé, micros de la visio, suite dans les 30 secondes, couplet, test de la table, bruit) et entre elles : test du lundi (1), temps investi par l'autre (2), question en retour (3), réparer avant de plaisanter (4), réponse qui survit au démenti (5), effort demandé à l'autre (6). Proximités notées dans chaque lettre ; à juger à l'aveugle.
- **Situations** : soirée de Noël de la boîte, cadeau fait main le 25 au matin, dîner d'amis en janvier, couple la veille de la Saint-Valentin, message de coloc le 1er avril, fête chez un ami. Aucune ne reprend celles des réservées (coloc orale, machine à café, visio, premier rendez-vous, chalet, repas de Noël avec la question de tonton, réveillon).
- **Lecteur nouveau** : chaque lettre redit en une phrase le principe (« la sûre, la joueuse, la risquée »), et aucune ne renvoie à une lettre précédente.

## Ce qui n'est pas fait

1. **Nouvelle relecture à l'aveugle (barre 8,5) : à faire** sur les seuls passages remplacés, aucun sous-agent n'est disponible ici : lettre 1 (joueuse, risquée), lettre 2 (risquée), lettre 3 (sûre, règle), lettre 4 (erreur), lettre 5 (sûre, joueuse, erreur). La lettre 6 (GO à 8,5) ne change que dans l'objet, le pont de fin et une explication. Les plus fragiles à mon avis : lettre 2 la risquée (« celui de l'an prochain » doit se lire tendre, pas critique), lettre 1 la risquée (dépend du directeur), lettre 4 la joueuse (« avec les retraités », repli prévu).
2. **Transcription dans `numeros.json`** : non faite (consigne : aucun autre fichier). Au moment de la faire, remplacer l'espace avant « € » par une espace insécable et passer `statut` à `BROUILLON` tant que la relecture n'a pas eu lieu, puisque toute modification efface l'approbation de Thomas.
3. **Pas de format B** dans ce lot (voir ci-dessus), donc pas de source à vérifier : aucune citation d'humoriste, aucun fait externe. Les seuls faits repris sont ceux de la version actuelle validée (descriptions d'articles) et ceux du code (titres d'étapes, prix, parcours).
