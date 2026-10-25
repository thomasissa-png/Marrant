# Relecture à l'aveugle de confirmation : lettres du mois n°2 à n°6 (s22)

**Date** : 25/10/2026 · **Relecteur** : @reviewer · **Barre** : 9/10 par lettre · **Lecteur simulé** : 20 à 30 ans, introverti, qui ouvre la lettre le jeudi matin.
**Fichier relu** : `docs/copy/lettres-du-mois-s22.md` (n°2 à n°6 ; n°1 non rouvert). **Rapports d'origine** : `review-11-lettres-s22-lecteur.md`, `review-11-lettres-s22-editeur.md`. **Référence ton** : `docs/copy/ton-alex.md`.
**Contrôles faits** : relecture intégrale des cinq lettres ; Grep tirets cadratin et demi-cadratin (0) ; Grep anti-doublon des répliques neuves dans `apps/web/src/data`, `docs/copy/articles-q4`, `docs/content` et les deux fichiers de réservées ; contenu des étapes liées (`docs/content/parcours-seed.json`, `parcours-reecriture-s17.json`) ; jours de la semaine recalculés (03/12, 07/01, 04/02, 04/03, 01/04 : jeudis ; 13/02 et 06/03/2027 : samedis ; 23/11 et 28/12/2026 : lundis).
**Non rouverts (consigne)** : signature, liens d'étape sans mention « réservée aux abonnés », prix dans l'encart.

## Résumé exécutif

Deux lettres passent : le n°2 (9) et le n°6 (9). Trois sont encore sous la barre, avec un seul bloquant chacune. Au n°3, la correction de l'erreur a créé une contradiction avec l'exercice, et la nouvelle phrase qui présente l'étape dit quelque chose de faux. Au n°4, la règle dit « jamais » là où la risquée l'autorise. Au n°5, la nouvelle joueuse (« Je fais mon enquête ») refait le jeu du détective de la réservée du 18/03, envoyée quinze jours plus tard à un lecteur qui croise aussi un inconnu. Les retouches du n°3 et du n°4 sont mécaniques, sans nouvelle réplique. Celle du n°5 change une chute : elle doit repasser le vote à l'aveugle. Les répliques neuves que le brief signalait (n°3 joueuse, n°4 « on dînera au goûter », n°5 sûre, n°6 sûre) tiennent toutes. Seule la joueuse du n°5 bloque, et c'est pour la redite, pas pour la qualité.

## Tableau

| Lettre | Envoi | Note | Verdict | En une ligne |
|---|---|---|---|---|
| n°2, pull tricoté | 03/12/2026 | 9 | **GO** | Entrée neuve juste (elle annonce l'erreur du « génial ! »), risquée enfin distincte de la joueuse. Trois mineurs. |
| n°3, résolutions d'Axel | 07/01/2027 | 8,5 | **NO-GO** | B1 et B2 levés, mais l'exercice dit « une seule question » juste après l'erreur qui en demande une deuxième, et le nouveau pont décrit mal l'étape. Retouche mécanique. |
| n°4, réservation oubliée | 04/02/2027 | 8,5 | **NO-GO** | B3 levé, « on dînera au goûter » tient. La règle dit « jamais avant d'avoir réparé » alors que la risquée plaisante avant de réparer. Retouche mécanique. |
| n°5, fête où tu ne connais que l'hôte | 04/03/2027 | 8,5 | **NO-GO** | B1 levé, la sûre du petit bol est juste. La joueuse « Je fais mon enquête » redit le détective de la réservée du 18/03. Chute à changer, à revoter. |
| n°6, canular du 1er avril | 01/04/2027 | 9 | **GO** | B4, B1 et B2 levés ; la sûre annoncée « Pas de blague » tient et sa règle reste la meilleure du lot. Trois mineurs. |

## 1. Les bloquants des deux rapports sont-ils levés ?

| Rapport | Bloquant | Levé ? | Vérification |
|---|---|---|---|
| Lecteur B1 | n°3, intro « répondre à sa place » | Oui | l. 161 : « Tu n'as rien planifié du tout, et tu n'as pas envie d'inventer. Trois façons… » ; « à sa place » n'apparaît plus. |
| Lecteur B2 | n°3, erreur mal nommée, remède de W48 | Oui, avec un effet de bord | l. 179 : erreur renommée, plus de silence. Calendrier mis à jour (l. 26). **Mais le remède (une deuxième question) contredit l'exercice (l. 182)** : voir B-n°3. |
| Lecteur B3 | n°4, « compris avant toi, au silence » | Oui | l. 218 : « Sam l'a compris à ton silence, avant que tu dises un mot : ». |
| Lecteur B4 | n°6, sûre sans sourire ni annonce | Oui | l. 349-350 : variante « Juste pour la date » adoptée, annoncée par « Pas de blague dans celle-ci, et c'est voulu : ». |
| Éditeur B1 (n°3) | erreur et exemple discordants, intro | Oui | Levé par la version du lecteur (même problème, autre texte). |
| Éditeur B1 (n°5) | « Elle ne demande rien » contre la règle | Oui | l. 287 : « Elle ne demande presque rien » ; la sûre est refaite et la scène alignée (l. 281). |
| Éditeur B1 (n°6) | « chez trois personnes » | Oui | l. 364 : « chez deux personnes ». |
| Éditeur B2 (n°6) | titre d'article tronqué | Oui | l. 369 : titre complet, conforme à `docs/copy/articles-forte-frappe/A5-blagues-poisson-d-avril-adultes.md:10`. |

Mineurs et redites transversales (T1 « Celle-ci vise », T2 annonce, T3 « Au moindre doute ») : tous traités. Dans les n°2 à 6, il n'y a plus d'annonce « Voici trois réponses, de la plus prudente (la sûre)… », la tournure « Celle-ci vise » est variée quatre fois, « Au moindre doute » ne reste qu'au n°2 et « Elle ne marche que si » est varié. Deux mineurs de l'éditeur ne sont pas appliqués, sur consigne : les étapes du n°2 et du n°6 tiennent mal à la scène. Je ne les rouvre pas, sauf pour le n°3, dont le pont est neuf et faux (B-n°3).

## 2. Les phrases NEUVES

Critères : fait sourire ou tient, se dit d'un trait sans mode d'emploi, sans méchanceté, cohérente avec la scène et le commentaire.

| Lettre | Phrase neuve | Verdict | Pourquoi |
|---|---|---|---|
| n°2 | « Tout le salon attend, et aucune de ces trois réponses ne ment sur le pull. » | Tient | Elle entre directement et prépare l'erreur du « génial ! » de façade. Seul défaut : « ces » annonce des réponses qui n'ont pas encore été données (mineur 1). |
| n°2 | « Ici, c'est tata que tu chambres : » + « Elle ne marche qu'avec une tante qui te chambre déjà, et depuis longtemps. » | Tient | « Ici » s'oppose bien au « pas sur la personne » de la joueuse, et la condition ne double plus celle de la joueuse. |
| n°2 | exercice « le cadeau (ou ce qui le remplace) » ; PS « d'être prêt le 25 au matin » | Tiennent | Les deux sont désormais justes pour la scène. |
| n°3 | intro « Tu n'as rien planifié du tout… de la plus douce à la plus piquante. » | Tient | Elle est claire, et « pas envie d'inventer » dit vrai pour le persona. Grep « plus douce » dans les réservées : 0 dans un corps de lettre. |
| n°3, **joueuse** | explication : « Tu parles d'un jour imaginaire, sans date : c'est ce qui la rend rieuse plutôt que méchante. » | Tient, et améliore la lettre | La réplique (« Tu as prévu un créneau pour le jour où tu abandonnes ? ») fait toujours sourire. « Sans date » l'oppose maintenant à la risquée (« Je note la date ») : la gradation qui inquiétait le lecteur (mineur 2) est réglée. « Rieuse » pour une question est un peu précieux, mais pas faux. |
| n°3 | « Cette fois, c'est Axel que tu vises : » | Tient | Elle tient grâce à « jour imaginaire » : la joueuse vise une hypothèse, la risquée vise la personne. |
| n°3 | « Commence par « comment » : ce mot n'a jamais fait d'ennemi. » | Tient | C'est une hyperbole lisible, pas une fausse information. |
| n°3 | erreur « Poser la question, puis parler de toi… le matin ou le soir ? » | Tient en soi | Nom, exemple et remède concordent. Mais elle contredit l'exercice (B-n°3), et la méditation vient de l'annonce d'Axel, pas de « sa réponse » (mineur 1). |
| n°3 | pont « Une bonne question part d'un détail remarqué chez l'autre : c'est le sujet de l'étape 3 » | **Faux** | L'étape Confiance 3 traite les petits gestes d'avant et d'aujourd'hui (`parcours-seed.json:791`, quiz « vanne de trentenaire », l. 818-848) : il n'y est question ni de questions, ni d'un détail « chez l'autre ». B-n°3. |
| n°4 | « Sam l'a compris à ton silence, avant que tu dises un mot : » | Tient | La phrase est logique et elle se lit vite. |
| n°4 | « Trois réponses, et elles ne se disent pas au même moment : c'est justement le sujet. » | Tient, la meilleure entrée du lot | Elle annonce la règle sans la dire. |
| n°4, **joueuse** | « Bonne nouvelle : j'ai une table. Mauvaise nouvelle : 18 h 15, on dînera au goûter. » | **Tient** (sourire léger) | L'observation est vraie (la veille du 14, il ne reste que les créneaux extrêmes), « dîner au goûter » fait un oxymore net et la phrase se dit d'un trait. Elle n'est méchante pour personne : le cliché sur l'âge a disparu. Elle colle au commentaire (« La blague porte sur l'heure du dîner, pas sur l'oubli ») et aux « vingt minutes » de la sûre. Le moule « Bonne nouvelle… » reste usé, mais la chute le porte. Je préfère cette version au repli « avec les retraités ». |
| n°4 | « Elle plaisante tout de suite, avant d'avoir réparé, » ; « Compte sur elle seulement si… » ; PS « la bourde est la tienne » | Tiennent | Ces phrases sont justes. Mais la règle les contredit (B-n°4). |
| n°5, **sûre** | « Tu sais ce qu'il y a dans le petit bol ? Personne n'y touche. » + « Elle ne demande presque rien » | **Tient** | C'est une observation commune, l'intrigue du bol fait sourire, la réponse ne prend que dix secondes et la phrase est cohérente avec la règle du travail donné à l'autre. Elle n'a rien d'un aveu minuscule : pas de doublon avec la réservée du 18/03. Seul défaut : la scène (« auquel personne n'a touché ») vend la mèche (mineur 1). |
| n°5, **joueuse** | « Je cherche quelqu'un qui connaît Nina depuis plus longtemps que moi. Je fais mon enquête. » | Tient en qualité, **redite** | Le sourire est léger, la phrase cohérente avec « la fac » et « l'ancienne coloc ». Mais le ressort est celui de la joueuse du 18/03 (« Un polar. Je soupçonne déjà tout le wagon. », commentaire : « jouer au détective », `lettres-reservees-jan-mars-2027.md:390-391`), deux semaines plus tard, face à un autre inconnu. B-n°5. |
| n°5 | « Trois phrases pour ouvrir… » ; « Là, tu vises la personne en face : » ; « Garde-la pour quand… » ; « devant le buffet ou près des manteaux » | Tiennent | Plus de fenêtre en double. « Près des manteaux » est un peu flou (les manteaux sont sur le lit), mais acceptable. |
| n°6, **sûre** | « Merci de prévenir. Tu peux transférer le mail du proprio ? Juste pour la date. » + « Pas de blague dans celle-ci, et c'est voulu : » | **Tient** | La réplique marche seule, sans son explication (une demande polie que n'importe qui peut envoyer), et le double sens de « Juste pour la date » est un bonus discret, sans accusation. L'annonce règle l'attente déçue relevée par le lecteur. |
| n°6 | « Tout le groupe va lire ta réponse… deux qui y arrivent, une qui parie. » ; « Malik devient la cible : » ; « Si tu hésites, » ; « chez deux personnes » ; titre complet | Tiennent | « Démentir chez » est une tournure maladroite (mineur 1). |

## 3. Bloquants restants, avec retouche mot pour mot

**B-n°3 (07/01), deux retouches mécaniques, sans revote**

1. *Exercice contre erreur (contradiction).* L'erreur (l. 179) dit qu'« une question renvoyée se joue en deux temps », avec « une deuxième question ». Trois lignes plus loin, l'exercice (l. 182) demande : « pose une seule question ». Le lecteur reçoit deux consignes opposées.
   - Avant : « La prochaine fois que quelqu'un t'annonce un grand projet, pose une seule question qui commence par « comment », et écoute la réponse jusqu'au bout. »
   - Après : « La prochaine fois que quelqu'un t'annonce un grand projet, pose une question qui commence par « comment », écoute la réponse jusqu'au bout, puis pose-en une deuxième sur un détail qu'il vient de dire. »
2. *Pont vers l'étape (phrase neuve et fausse).* Confiance 3 apprend à remarquer les petits gestes qui ont changé autour de soi (`docs/content/parcours-seed.json:791`, même texte dans `parcours-reecriture-s17.json:843`). Elle ne parle pas d'« un détail remarqué chez l'autre » pour poser une question.
   - Avant : « Une bonne question part d'un détail remarqué chez l'autre : c'est le sujet de l'étape 3 du parcours Confiance, « L'œil de l'observateur ». »
   - Après : « La deuxième question demande d'avoir remarqué un détail. Remarquer les petits gestes autour de toi, c'est le sujet de l'étape 3 du parcours Confiance, « L'œil de l'observateur ». »

**B-n°4 (04/02), une retouche mécanique, sans revote**

*La règle interdit ce que la risquée autorise.* La risquée « plaisante tout de suite, avant d'avoir réparé » et se garde pour quand « Sam rit déjà » (l. 234). La règle (l. 237) traite justement ce cas (« Si elle sourit déjà ») pour dire « jamais avant d'avoir dit « tu as raison » ». La phrase suivante (« plus tu plaisantes tôt, plus tu prends de risque ») est, elle, juste : c'est le « jamais » qui est faux.
- Avant : « Si elle sourit déjà, tu peux plaisanter, mais jamais avant d'avoir dit « tu as raison » ni avant d'avoir une solution. »
- Après : « Si elle sourit déjà, tu peux plaisanter, mais le plus sûr reste d'attendre d'avoir dit « tu as raison » et trouvé une solution. »

**B-n°5 (04/03), une chute à changer, à revoter**

*Redite de ressort avec la réservée du 18/03 (W11).* Elle arrive quinze jours après le n°5, chez les mêmes abonnés et dans le même contexte (un inconnu). Sa joueuse est « Un polar. Je soupçonne déjà tout le wagon. », commentée « Tu fais de ton livre un prétexte pour jouer au détective » (`lettres-reservees-jan-mars-2027.md:390-391`, mécanisme noté « jeu du détective », l. 416). Les deux joueuses jouent à l'enquêteur face à un inconnu. Les notes du n°5 disent « revérifié contre janvier-mars » : celle-là leur a échappé.
- Avant : « Je cherche quelqu'un qui connaît Nina depuis plus longtemps que moi. Je fais mon enquête. »
- Après : « Je cherche quelqu'un qui connaît Nina depuis plus longtemps que moi. Ça ne devrait pas être long. » (15 mots. L'autodérision du dernier arrivé et l'écho « longtemps / long » remplacent le détective. Le commentaire reste vrai tel quel : terrain commun, gêne changée en jeu, une petite histoire en retour. Grep « pas être long » dans `apps/web/src/data`, `docs/copy`, `blog-articles.ts` : 0.)
- Réplique neuve : elle repasse le vote à l'aveugle (règle d'or s18). Autre résolution possible, à arbitrer par l'orchestrateur : garder « Je fais mon enquête » et changer la joueuse du 18/03. Ce fichier sort de mon périmètre.

Après ces retouches (et le vote pour le n°5), les trois lettres sont à 9 de mon point de vue.

## 4. Mineurs (3 au plus par lettre, aucun ne bloque)

| Lettre | Mineurs, avec retouche |
|---|---|
| n°2 | (1) « aucune de ces trois réponses » renvoie à des réponses pas encore données : écrire « Tout le salon attend. Trois réponses possibles, et aucune ne ment sur le pull. » (2) **Redite de formule avec la règle du n°4** : « Au moindre doute, remercie d'abord, plaisante ensuite. » (l. 115) annonce deux mois plus tôt « d'abord réparer, ensuite plaisanter », que le n°4 met en titre. Écrire « Au moindre doute, contente-toi de la sûre. » (3) « devant un miroir… pour entendre si tu as l'air touché » : écrire « pour voir si tu as l'air touché ou l'air poli ». |
| n°3 | (1) Erreur : « tu rebondis sur sa réponse avec une deuxième question, sur un détail qu'il vient de dire. La méditation, par exemple » (la méditation vient de son annonce, pas de sa réponse) : écrire « tu rebondis avec une deuxième question, sur un détail de ce qu'il vient de dire. La méditation, par exemple : le matin ou le soir ? ». (2) « Regarde comment ta question commence. Avec « comment », elle cherche à savoir comment l'autre fait » : trois « comment » en deux phrases. Écrire « Regarde le premier mot de ta question. Avec « comment », elle cherche à savoir de quelle façon l'autre s'y prend ». (3) « Bonne année. Premier dîner de l'année » : écrire « Bonne année. Premier dîner de janvier chez des amis ». |
| n°4 | (1) « Pas de blague : » ouvre l'explication de la sûre, comme « Pas de blague dans celle-ci » au n°6 deux mois plus tard. C'est acceptable (le lecteur l'avait proposé exprès), mais il ne faut pas en faire une troisième. (2) PS : « le jour où la bourde est la tienne, mieux vaut avoir déjà la phrase. Avec Premium, tu la prépares à l'avance » ; même moule au n°6 (« le jour où l'inattendu arrive, mieux vaut avoir déjà une réponse en réserve. Avec Premium, tu la prépares »). Voir n°6, mineur 2. |
| n°5 | (1) La scène dit « un petit bol auquel personne n'a touché », la sûre « Personne n'y touche » : la narration vole la fin de la réplique. Écrire « un petit bol encore plein ». (2) L'exercice (« une fête, une salle d'attente, la queue d'un guichet ») ressemble à celui du 18/03 (« un transport, une file d'attente ou une salle d'attente ») : écrire « (une fête, un mariage, un premier jour de stage) ». (3) L'exercice exige que chaque phrase « s'appuie sur ce que vous voyez tous les deux », alors que la joueuse de la lettre s'appuie sur l'hôte : écrire « sur ce que vous avez en commun, ce que vous voyez ou la personne qui vous a invités ». |
| n°6 | (1) « il faut démentir chez deux personnes » : écrire « et il faut tout défaire auprès de deux personnes ». (2) PS, même moule que le n°4 (voir plus haut) : écrire « PS : vrai ou canular, la bonne réponse se prépare. Avec Premium, tu t'y entraînes : une lettre chaque jeudi… ». (3) « notre article « Blague poisson d'avril pour adultes : 15 idées inoffensives » réunit quinze canulars » répète le nombre juste après le titre : écrire « les classe par terrain. Aucun n'est dangereux ni humiliant… ». Le pont de l'étape (« quand l'inattendu te tombe dessus ») tient toujours mal à l'étape (une vanne ratée, `parcours-seed.json:522`) : non rouvert, sur consigne. |

**Transversal, pour l'orchestrateur** : le moule « X d'abord, Y ensuite » revient au n°2 (l. 115), au n°4 (titre de la règle), au n°6 (« vérifie d'abord, agis ensuite », l. 364) et dans les réservées du 11/03 (« plaisante d'abord et donne ta vraie réponse ensuite », l'ordre inverse du n°4) et du 25/03 (« d'abord celui qui a attendu, ensuite celui qui parle »). Le mineur n°2-2 en retire un ; il faut garder le n°4 et le n°6, qui en ont besoin.

## 5. Contrôles de la grille (lettres 2 à 6)

- **Saison** : juste pour les cinq (le 03/12 prépare le 25, le 07/01 pour les premiers dîners, le 04/02 dix jours avant le 14, le 04/03 pour l'anniversaire du samedi 06/03, et le 01/04 envoyé le jour même, avec « Imagine » pour une scène à 8 h 02).
- **Entrée directe** : oui, les cinq ouvrent sur la scène, sans phrase d'annonce figée.
- **Rien de commercial hors de l'encart** : aucun « € », aucun `/abonnement`, aucun « offre » hors de `[[invitation-premium]]` (vérifié dans le texte des cinq corps).
- **Tiret cadratin ou demi-cadratin** : 0 (Grep sur le fichier).
- **Phrases fausses** : trois, toutes listées en B-n°3 (exercice, pont) et B-n°4 (« jamais »).
- **Redites** : une bloquante (B-n°5, détective), une de formule (n°2, mineur 2) ; rien de repris du site d'après les Grep.

## Décisions à confirmer

1. B-n°5 : faut-il changer la joueuse du n°5 (ma recommandation, puisqu'elle n'est pas encore validée) ou celle du 18/03 ?
2. Après B-n°3, l'étape Confiance 3 reste un lien faible pour une lettre sur les questions (les gestes d'avant et d'aujourd'hui, une « vanne de trentenaire »). Le pont corrigé est vrai, mais l'étape ne colle toujours pas au sujet. Je ne change pas le lien, sur consigne.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-lettres-du-mois-s22-confirmation.md`
- Décisions : GO pour le n°2 (9) et le n°6 (9). NO-GO pour le n°3 (8,5, deux retouches mécaniques), le n°4 (8,5, une retouche mécanique) et le n°5 (8,5, une chute à changer puis à revoter). Tous les bloquants des deux rapports d'origine sont levés.
- Points d'attention : la nouvelle joueuse du n°5 redit le détective de la réservée du 18/03 ; la correction de l'erreur du n°3 a créé une contradiction avec l'exercice ; le nouveau pont du n°3 décrit mal l'étape. Les répliques signalées (joueuse du n°3, « on dînera au goûter », sûre du n°5, sûre du n°6) sont validées à l'aveugle.
- Agents à relancer : @copywriter (B-n°3, B-n°4, B-n°5 et les mineurs retenus), puis un relecteur à l'aveugle sur la seule joueuse du n°5. Le n°3 et le n°4 n'ont besoin que d'une relecture du diff.
---

