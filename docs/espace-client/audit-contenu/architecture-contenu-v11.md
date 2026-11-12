# Architecture de contenu de l'espace Premium, v11 (s24)

> Auteur : @creative-strategy, 12/11/2026. Remplace `architecture-contenu-v10.md`. Réponse aux tours 10 de relecture : @elon 9,9, @reviewer 9,8, @ux 9,2, aucun bloquant. La v11 n'applique QUE les retouches demandées par la session (annexe A) et ajoute un résumé d'une page pour Thomas.

## Résumé pour Thomas (une page, sans jargon)

**Ce que contient l'espace.** Un endroit où l'abonné apprend à répondre et à être drôle, par petites fiches de 5 minutes qui finissent toutes par un geste à faire.
- **Aujourd'hui** : un premier pas le jour 1, puis chaque jour la vanne, le conseil et la vidéo du jour, et « Si tu as 5 minutes » : une situation à tenter (on tente sa réponse d'abord, puis on voit trois répliques : la sûre, la joueuse, la risquée).
- **Parcours** : les 5 parcours et leurs 25 étapes, découpés en fiches courtes « Voir / Fait », sans qu'aucun texte validé soit réécrit.
- **Quoi répondre** : 60 situations neuves plus les 45 du carnet, retrouvées par lieu (soirée, boulot, coloc, rencontre…) et par but.
- **Bibliothèque** : le catalogue de vannes, conseils et vidéos en accès libre à côté, plus le vocabulaire (40 mots) et les techniques (12 mécanismes, 12 formules à détourner).
- **Mes questions** : l'abonné écrit à l'équipe (un problème, une situation à gérer, une question) et retrouve tout son historique.
- **À côté** : jeux, séances de 20 minutes, missions facultatives, le point du mois (« Ton mois »). Au total 155 fiches neuves, 285 fiches avec l'existant.

**Ce qui change pour l'abonné.** Il arrive avec un premier pas de moins de 5 minutes, jamais « choisis un parcours ». Rien ne l'oblige, rien ne le relance, aucune note ne le juge. Il garde la bibliothèque complète, et il peut poser sa propre situation à l'équipe.

**Ce qu'on sait de l'audience, et ce qu'on ne sait pas.** Seule la mesure de Google est solide, et elle décrit des visiteurs qui n'ont pas payé. Elle sert à choisir quoi écrire en premier. Elle ne décide jamais de ce que voient les abonnés : pour cela on attend de mesurer les abonnés eux-mêmes, quand ils seront assez nombreux.

**Les 14 questions pour toi, une ligne chacune (reco entre parenthèses).**
1. C1 : quelle barre en haut de l'espace (« Bibliothèque » à un clic, fidèle à ta décision du 12/11).
2. C2 : combien de temps par semaine (la promesse reste sur le cœur des parcours, le reste est facultatif).
3. C3 : un entraînement quotidien (oui, carnet inchangé).
4. C4 : série, points et « Fait » (aucune nouvelle règle).
5. C5 : les situations des lettres du jeudi (jamais reprises).
6. C6 : quels univers, dont la rencontre (tous, rencontre comprise, avec un garde-fou de ton).
7. C7 : niveaux et sixième parcours (ordre conseillé, niveaux actuels).
8. C8 : jusqu'où itérer avant de te montrer un contenu (10/10 chez tous, carnet compris).
9. C9 : comment l'espace sait ce que veut l'abonné (une question unique, « Où veux-tu être plus à l'aise ? »).
10. C10 : « Mes questions », durée de l'historique et ligne 3114 (historique gardé, ligne 3114 pour les situations à gérer).
11. C11 : quel parcours sans aucun signal (Répartie, étape 1).
12. C12 : humour noir et « jusqu'où » (deux fiches sur la limite, sans blague noire).
13. C13 : forme de la vanne du jour (même poids que le conseil et la vidéo, avec un toucher « Ce soir, c'est plutôt ? »).
14. C14 : où arrive l'abonné après sa connexion et son paiement (sur la page d'où il vient s'il vient d'un contenu précis, sinon sur « Aujourd'hui »).

**Les 5 étalons à calibrer avec toi en premier** : E1 une situation « Quoi répondre » complète, plus les 5 situations d'entrée ; E2 une fiche « Comment c'est construit » et une fiche « Formules à détourner » ; E3 une fiche de vocabulaire ; E4 une fiche « Écouter, repérer » sur un humoriste que tu choisis ; E5 le rendu de l'écran d'accueil (cartes, vanne du jour, premier pas) et de « Mes questions ».

> **Sommaire** : 0 Ce que l'audience veut (0.1 règle de priorité, 0.2 besoins, 0.3, 0.4) ; 0 bis Ce qui change ; 1 Faits de base ; 2 La leçon, le moteur, Mes questions ; 3 Les types de fiches ; 4 Le chemin de l'abonné (4.1 calendrier, 4.2 signaux, 4.3 personas, 4.4 Aujourd'hui, 4.5 au-delà de la V1) ; 5 Parcours ; 6 Barre et portes ; 7 Production (7.1 à 7.7) ; 8 Questions pour Thomas **C1 à C14** (C10 a et C10 b comptent pour une seule question à deux volets : 14 questions) ; 9 Étalons E1 à E5 ; annexes A (traitement), B (inconnu), C (agents).
> Sources audience : `besoins-audience-donnees-internes-s24.md` (@data-analyst : fiabilité faible à moyenne, la seule mesure solide est Google, côté abonnés presque rien) et `besoins-audience-recherche-publique-s24.md` (@growth : AUCUN verbatim d'internaute ; la lecture directe de Reddit et de jeuxvideo.com a échoué, accès refusé). Chiffres de pages Google : `docs/seo/point-etape-s20.md` l. 62 et 66.
> Faits vérifiés par la session et repris ici : `quiz-data.ts` l. 41 à 100 (OBSERVATEUR vers confiance ; STORYTELLER vers storytelling, sinon machine-a-cafe si non publié ; ABSURDE vers machine-a-cafe ; PUNCHLINEUR et TAQUIN vers repartie) ; résultat du quiz gardé seulement dans le navigateur (`viral-quiz.tsx` l. 36 à 46) ; playbook l. 595 (3114) ; `glossary.ts` l. 79 ; phrases juridiques de @legal (`docs/legal/espace-client-s24-phrases.md`) ; étape 1 de Répartie = une des 3 étapes gratuites validées par Thomas le 07/10 (l. 73).
> **Faits de code sur l'abonnement depuis un article (vérifiés)** : le bouton de fin d'article envoie **les deux**, `returnTo=/parcours/<parcours associé>` ET `src=blog-<slug>` (`components/blog/article-cta.tsx` l. 89, `blog-article-view.tsx` l. 137, `lib/premium-return.ts` l. 62 à 66). Le parcours associé vient de `lib/blog-parcours.ts` : table par slug (`config/blog-encarts.ts`), puis cluster (`lib/blog-clusters.ts`), défaut « repartie ». **Six clusters sur neuf mènent à repartie, dont celui de l'article de blagues** ; `douleurs-personas` mène à confiance, `humour-contexte` à boulot, `saisonnier` à machine-a-cafe. **Un cluster donne un parcours, pas une catégorie de contenu** : `fort-volume` regroupe à lui seul l'article de blagues, « phrases drôles en conversation », « comment faire rire une fille / un homme » (`blog-clusters.ts` l. 58 à 61) ; les deux articles « faire rire » sont renvoyés à Confiance par la table par slug (`blog-encarts.ts` l. 30 et 31) ; l'humour noir est dans `types-humour` (l. 37) ; il n'y a aucun cluster storytelling ni autodérision. **Le slug de l'article est perdu au paiement** : `src` est relayé de `/abonnement` à `/register` « pour la mesure du tunnel » (`premium-return.ts` l. 59 et 60), mais la création du paiement n'accepte que `plan` et `returnTo` (`api/stripe/checkout/route.ts` l. 13 à 17 et 40 à 43), les métadonnées Stripe sont `userId` et `plan` (`lib/stripe.ts` l. 189 à 193) et l'adresse de retour est `cheminRetourPaiement(returnTo, plan)` (l. 186) : vérifié par la session et par @reviewer ; l'essai réel du lot 0 (7.5 e) relève ce que l'espace reçoit. Aujourd'hui, après le paiement, l'abonné arrive sur son `returnTo` (par exemple `/parcours/repartie`), pas sur une page de l'espace (`getPostPaymentDestination`).
> Conventions : [HYPOTHÈSE] = dimensionnement ou choix de travail. [À VÉRIFIER] = fait non lu. [EXEMPLE NON VALIDÉ] = illustration non relue à l'aveugle. **[MESURÉ V] / [MESURÉ A] / [OBSERVÉ] / [SUPPOSÉ] / [PISTE]** : fiabilité d'un besoin d'audience (section 0) ; V = chez les visiteurs, A = chez les abonnés. Toute règle nouvelle (série, points, texte libre, stockage, relecture, parcours par défaut, humour noir, composition de l'écran d'accueil, page d'arrivée après connexion et paiement) est une question à Thomas en section 8, jamais une décision. Les noms de rubriques et de formats sont des propositions de travail, à caler par étalons rendus (P0 s8).
> Règles tenues : tutoiement, aucun tiret cadratin, aucun émoji, aucune mention d'IA, aucun concurrent nommé, rien de culpabilisant, aucune relance d'inactivité, aucun nouvel e-mail automatique.

## 0. Ce que l'audience veut, et où l'espace y répond

### 0.1 Comment lire ce tableau : fiabilité et règle de priorité à deux niveaux

- **[MESURÉ V], mesuré chez les visiteurs** : un chiffre lu dans une source datée. Le seul signal chiffré d'audience est **Google** : 462 clics et 10 232 impressions sur 28 jours (12/09 au 09/10), 687 visiteurs Umami. Il décrit des gens qui n'ont **pas payé** ; il dit ce qu'ils tapent ou ce qu'ils lisent, pas ce que des abonnés voudraient.
- **[MESURÉ A], mesuré chez les abonnés** : **n'existe pas encore** (4 abonnés actifs au 02/11). Il viendra des capteurs de 7.7 (toucher par catégorie, étiquettes de scène, « Fait » par fiche). **Un relevé ne vaut [MESURÉ A] qu'au-delà de l'effectif minimal de 7.6** : avec quatre abonnés, trois touchers ne réordonnent l'écran de personne.
- **[OBSERVÉ]** : ce que **l'équipe a mis dans l'offre publique** (contenu du carnet, des lettres, taxonomie des vannes). C'est une mesure de l'OFFRE, **pas de la demande** : donner +1 à un univers du carnet entretient un choix de l'équipe (la coloc est défavorisée parce que le carnet n'en a pas, pas parce que l'audience n'en veut pas). L'écart de +1 est un **départage**, jamais une preuve.
- **[SUPPOSÉ]** : un persona ou un choix de l'équipe (y compris les profils du quiz), pas une donnée d'audience.
- **[PISTE]** : un besoin relevé par la recherche publique (titres et extraits de pages, jamais un verbatim), à confirmer. **Le nombre de pages publiques qui traitent un sujet mesure l'OFFRE de contenu, pas la demande** : une piste reste une piste, quel que soit ce nombre. La lecture de Reddit et de jeuxvideo.com a échoué (accès refusé).
- **Règle de priorité, la même partout, à deux niveaux** :
  1. **Choisir QUOI ÉCRIRE** (volume des situations en 3.3, ordre de production en 7.4) : [MESURÉ V] (+2) > [OBSERVÉ] (+1, départage) > [SUPPOSÉ] ou [PISTE] (+0, des paris nommés comme tels). Un [MESURÉ V] sert à choisir quoi écrire en premier : c'est un choix d'écriture, il ne promet rien à un abonné.
  2. **Choisir CE QUI PASSE DEVANT sur l'écran d'un abonné** (place dans « Aujourd'hui » en 4.4 et C13, barre en 6.2 et C1) : **seul un [MESURÉ A], donc au-delà de l'effectif minimal de 7.6, peut faire passer un contenu devant un autre**. Tant qu'il est vide, l'écran suit le brief §3.2 (contenu du jour : vanne, conseil, vidéo, au même poids), et **aucune mesure de visiteurs ne hiérarchise ni l'écran ni la barre**. Les capteurs de 7.7 produisent le [MESURÉ A] qui permettra de revoir cette place.
  La même preuve est donc lue de deux façons parce que les deux décisions n'ont pas le même coût : se tromper sur un volume d'écriture se corrige au mois suivant ; se tromper sur la place d'un contenu change l'écran de tous les abonnés.
- **Fiabilité globale : faible à moyenne.** Fiable pour : « les visiteurs viennent chercher des blagues et des phrases à ressortir, surtout sur mobile ». **Non fiable** pour toute hiérarchie fine entre situations et pour tout besoin d'abonné : 4 abonnés actifs et 3 résiliations au 02/11, 0 vote réel sur une base fictive, aucune réponse de résiliation collectée, résultat du quiz non stocké, favoris et likes non extraits. Le dernier export Google lu a plus de 4 semaines. Rien de ce tableau ne prouve ce que les abonnés veulent : il sert à choisir QUOI écrire en premier et à ne rien oublier, pas à promettre.

### 0.2 Besoin, source, réponse de l'espace, manque restant

| Besoin (formulé comme l'audience le dirait) | Source et fiabilité | Réponse de l'espace (rubrique, type, volume) | Manque restant |
|---|---|---|---|
| « Donne-moi une vanne à ressortir ce soir » | **[MESURÉ V]** : 368 clics sur 462 (79,7 %) viennent de l'article « meilleures blagues 2026 » ; 97 % de sorties sur cet article ; 66 % de mobile, 34 à 48 s par visite | **Bibliothèque à un clic** (variante B de C1), ouverte sur les thèmes ; **la vanne du contenu du jour avec le toucher « Ce soir, c'est plutôt ? »** (forme : question C13) ; « Formules à détourner » (12 fiches) ; l'entrée personnalisée depuis un article de blagues est **hors V1** (4.2) | On ne sait pas si les abonnés veulent la même chose (capteur 7.7) ; dépendance à la date « 2026 » du site ; pivot du 06/05 « conseils > vannes » (C13) |
| « Quoi répondre quand on me chambre » (répartie) | **[MESURÉ V]**, faible : « répartie » 161 impressions sur 90 jours, « ta repartie » 77, « avoir de la répartie » 96 ; **[SUPPOSÉ]** : Yanis ; **[PISTE]** : « esprit de l'escalier » (4 pages), répartie qui s'apprend | **Quoi répondre** (60 situations neuves, 45 du carnet), rafale, parcours Répartie ; l'accroche « esprit de l'escalier » est confiée à l'étalon E5 | Rendement de la barre « niveau Alexa » (1 sur 2 à 1 sur 12) |
| « Répondre sans être méchant » (le seul rejet observé : l'humour moqueur) | **[PISTE]** : « humour méchant ou moqueur » rejeté (4 pages) ; extrait : « privilégiez un humour bienveillant » | **Règle d'écriture « on rit avec, pas contre »** (2.2) : la risquée reste joueuse, ne se moque jamais d'une faiblesse ni d'un physique, elle renvoie la pique ou rend la parole ; grille « peut-il en rire avec toi ? » (2.4) ; garde-fou de ton des situations de rencontre et de prise de parole | La part de « un quart » de contextes gagnés par la risquée est une hypothèse revue à l'étalon E1 si une risquée gagnante ne passe pas la règle |
| « Des répliques prêtes à l'emploi, par situation, en français » | **[PISTE]** : les compilations de répliques dominent les résultats en anglais, peu d'équivalents français structurés par situation (offre, pas demande) | C'est le fondement de **Quoi répondre** : une situation, trois répliques, la règle pour choisir | À confirmer ; différenciation non prouvée |
| « Briller en soirée, entre potes, en coloc ; être drôle quand on est timide » | **[MESURÉ V] indirect** : page « phrases drôles en conversation » 2 198 impressions, 62 entrées (la mesure porte sur la conversation en général, pas sur la soirée) ; **[OBSERVÉ]** : carnet soirée 8, amis 8 ; **[SUPPOSÉ]** : Yanis ; **[PISTE]** : « être drôle même quand on est timide, en soirée » (5 pages) | Filtres soirée, amis, coloc : **15 situations** (6 + 5 + 4) ; missions marche 1 ; « Le blanc » | La coloc est un pari (persona seul) ; le +2 de la soirée est un choix d'écriture sur une mesure indirecte |
| « Faire rire, plaire : rencard, messages d'approche, couple » | **[MESURÉ V] sur deux pages, pas sur des requêtes** : les pages « comment faire rire un homme » et « comment faire rire une fille » ont 488 et 314 affichages, 4 et 3 clics en 28 jours (`point-etape-s20.md` l. 62) ; **[OBSERVÉ]** : carnet couple 5, une lettre (W50) ; **[PISTE]** : contenus génériques, qualité faible | **Rencontre : 6 situations**, couple : 5 (plan 3.3) ; garde-fou de ton : taquiner, ne jamais insister ; « pour plaire » dans le geste de C9 B. À noter : un lecteur de ces deux pages arrive à l'abonnement avec `returnTo=/parcours/confiance` (table par slug), pas repartie | Pas de parcours dédié ; clics quasi nuls ; question C6 ; **aujourd'hui, ces pages mènent à Confiance, pas à une situation de rencontre** |
| « Au boulot sans me griller » (café, réunion, visio, pot, entretien) | **[OBSERVÉ]** : carnet boulot 9, 4 lettres ; **[SUPPOSÉ]** : Sophie ; **[PISTE]** : sujet massif en offre (6 pages) | Parcours Machine à Café et Boulot ; **10 situations** (boulot 5, réunion et entretien 5) | Aucune requête mesurée sur ces scènes |
| « Études, fac, exposé » | **[OBSERVÉ]** : catégorie ECOLE en base, lettre W46 (exposé de TD) ; **[SUPPOSÉ]** : Yanis étudiant ; carnet : 0 fiche | **5 situations études et fac** (3.3) | Demande non mesurée |
| « Humour par écrit : messages, groupes » | **[SUPPOSÉ]** ; catégorie RESEAUX_SOCIAUX ; une question du quiz (le quiz est un choix de l'équipe) | **4 situations messages et groupes** (un pari) ; « Formules à détourner » (message de groupe) | Demande non mesurée |
| « Prise de parole courte : toast, pot, un petit mot » | **[OBSERVÉ]** : 2 lettres validées, étape 6 de Boulot (toast de 60 s) ; **[PISTE]** : sujet massif en offre (8 pages de discours de mariage) | **5 situations de prise de parole** (3.3), qui entrent dans la rafale sous la forme « Ta première phrase d'abord » ; garde-fou [PISTE] : humour d'affection, 3 à 5 minutes ; étape 6 de Boulot | Pas de parcours ; aucune demande mesurée |
| « Comprendre comment ça marche » (définitions, techniques) | **[MESURÉ V]** (28 jours) : « humour observationnel » 459 impressions, « autodérision » 163 et 105 de plus avec « définition », « phrase drôle » 86 ; Thomas a nommé le vocabulaire le 12/11 | Comment c'est construit (12), **Vocabulaire à 40 mots (8 fiches)**, glossaire public `/glossaire` (12 termes, indexé) qui sert déjà les définitions | Les requêtes de définition arrivent sur des pages publiques ; entrées qui mènent à l'espace |
| « Humour noir : jusqu'où aller sans blesser » | **[MESURÉ V]** pour la consommation de blagues : « blague humour noir 2026 », 42 clics, 780 impressions, 2e requête du site ; la question « sans blesser » est **[OBSERVÉ]** (titre d'article) | **Question C12** ; aucune fiche par défaut | Choix éditorial de Thomas |
| « Rire de moi sans me rabaisser » (autodérision, confiance) | **[MESURÉ V]**, faible : « autodérision » 163 impressions ; **[SUPPOSÉ]** : Yanis, Marc | Parcours Confiance ; faux secret ; missions marches 1 à 3 | Le trac avant : missions marches 1 et 2, rafale sans enjeu et « Le blanc » le couvrent ; reste à confirmer par « Mes questions » |
| « Retrouver la légèreté après une rupture » (Marc) | **[SUPPOSÉ] seulement : aucun signal trouvé** (la recherche publique n'a rien trouvé) | Parcours Confiance, faux secret, missions marches 1 à 3 ; règle « rupture et deuil jamais comme sujet de vanne » (C6) | Non mesurable avant les premiers messages de « Mes questions » |
| « Raconter une anecdote qui tient » | **[MESURÉ V]** faible : page `storytelling-drole-5-structures` 7 entrées ; **[SUPPOSÉ]** : Sophie, profil Storyteller (choix de l'équipe) | Parcours Storytelling ; mécanisme « raconter en une phrase » | Aucune fiche courte hors parcours |
| « Savoir quoi faire quand ça tombe à plat, quand je me bloque » | **[SUPPOSÉ]** : Yanis ; **[PISTE]** : esprit de l'escalier, blocage sous le stress, blague ratée | **10 fiches « Quand ça tombe à plat »** dont « Le blanc » (le silence comme choix) et « Lire la salle et savoir s'arrêter » | Aucun |
| « Gagner du temps avant de répondre, rebondir sur le mot de l'autre » | **[PISTE]** (3 pages) | Accusé de réception (Vocabulaire, glossaire public), rebond sur mot-clé | Relier l'accusé de réception à « Quoi répondre » |
| « Est-ce que c'est lourd ? » (retour sur mes blagues) | **[PISTE]** faible (inféré, une source, aucune demande explicite) | Grille d'auto-contrôle (2.4) ; exemple de message dans « Mes questions » ; règle « savoir s'arrêter » | Pas de retour automatique sur une blague collée (non retenu en V1) |
| « Par où je commence ? » (voir mon avancée) | **[SUPPOSÉ]** ; **[OBSERVÉ]** : 3 résiliations sans usage enregistré | « Aujourd'hui », premier pas, « Tes 4 premières semaines », courbe, bilan allégé | Efficacité non mesurable (acheteurs invisibles) |
| « Du court, sur mon téléphone » | **[MESURÉ V]** : 66 % de mobile, 34 à 48 s | Fiches de 5 minutes, rafale de 5 minutes | Durées à chronométrer |
| « Quelqu'un répond à ma situation précise » | **[SUPPOSÉ]** ; décision de Thomas du 12/11 | « Mes questions » (fil, historique, étiquette de scène) | Goulot : Thomas relit tout |
| « S'entraîner sans enjeu » | **[PISTE]** : improvisation, situations à faible enjeu | Rafale, séance de 20 minutes, missions | Aucun |
| « Famille et repas » | **[OBSERVÉ]** : carnet famille 7, lettres W52 et Pâques | **5 situations famille** | Aucun |
| « Parler avec des gens comme moi », WhatsApp, surprises | **[SUPPOSÉ]** : options de vote de l'équipe, base fictive, 0 vote réel | Rien : ne rien promettre | Question seulement si le vote réel monte |
| Points, séries, classements | Aucune demande trouvée (**[PISTE]**, absence) | Rien de nouveau ; C4 A recommandée | Aucun |

### 0.3 Ce qui n'a pas de besoin exprimé : justifié, jamais réduit sans question

- **Vocabulaire à 40 mots (8 fiches)** : Thomas l'a nommé comme contenu à créer le 12/11 (« Le vocabulaire »), et des recherches de définition sont mesurées sur Google (section 0.2). L'argument de limite : ces recherches sont servies par le glossaire public `/glossaire` (indexé), alors que le vocabulaire de l'espace est Premium. **Aucune réduction proposée** : 40 mots, comme en v6.
- **Bilan du parcours** : aucune demande d'évaluation, et le « scolaire » est une crainte de marque. **Allégé** à 4 éléments, 10 contextes neufs et 15 retours comptés, au ton « refais une situation » ; ce n'est pas un contenu nommé par Thomas ; la décision du 07/10 (bilan de fin sans certificat) le justifie ; Thomas peut en remettre 6 questions.
- **Points et série** : aucune règle nouvelle ; les mécaniques existantes ne changent pas.

### 0.4 Les cinq manques les plus importants, et leur traitement

1. **Pas de porte claire vers « une vanne à ressortir ce soir »** : Bibliothèque à un clic (reco B de C1), vanne du contenu du jour avec son toucher (C13) ; l'entrée personnalisée depuis un article de blagues est hors V1, déclenchée seulement par une mesure (4.2).
2. **Rencontre et séduction** : intérêt mesuré sur deux pages cité dans C6 ; 6 situations rencontre ; garde-fou de ton ; « pour plaire » dans le geste.
3. **Situations absentes des filtres** : ajoutées avec la règle de priorité de 0.1 (3.3).
4. **Humour noir et « jusqu'où »** : question C12.
5. **Aucun capteur de la demande réelle des abonnés** : étiquette de scène sur « Mes questions », toucher « Ce soir, c'est plutôt ? », règle de décision à J60 (7.6, 7.7). C'est ce qui produira le premier [MESURÉ A].

## 0 bis. Ce qui change depuis la v10 (9 retouches, rien d'autre)

1. **Résumé d'une page pour Thomas**, sans jargon, en tête de document.
2. **C14 C** : le bandeau « Ton premier pas » d'un abonné venu d'une fiche ou d'une étape désigne le geste sur la page même, « Aujourd'hui » reste un lien secondaire (4.2, C14).
3. **Questions sans jargon** : C14, C10 a, C2 B, C7 et C11 relus (« la page d'où il vient », « le lien obligatoire pour renoncer au contrat », aucun chemin de fichier ni d'adresse).
4. **C11 B et C** disent leur conséquence ; « presque tous les clusters » devient « six sur neuf » ; la règle « `/parcours/repartie` sans étape = pas de signal » n'est neutre que si C11 = A (4.2, C11).
5. **0.2, ligne « rencontre »** : aujourd'hui les pages « faire rire » mènent à Confiance.
6. **Page de succès** : reste affichée avec un bouton « Continuer », sans redirection automatique (4.2, C14).
7. **Toucher** : si aucune catégorie n'atteint le seuil, la rangée disparaît et seul « Une autre » reste (4.4).
8. **Formulations** : l'essai du `src` « vérifie si » (7.5 e) ; étape d'origine liée à un parcours (4.2) ; « compacts » au lieu de « discrets » (C13 B).
9. **Annexe A** : traitement du tour 10.

---

## 1. Faits de base (sources)

### 1.1 Chiffres de production et de code

| Fait | Valeur | Source |
|---|---|---|
| Vannes, conseils, vidéos actifs en production | 149, 120, 89 | INV section 6 (`/api/content-stats`, 12/11) |
| Audience mesurée (Google) | 462 clics, 10 232 impressions sur 28 jours ; 79,7 % des clics sur un seul article de blagues ; 66 % mobile ; pages « faire rire un homme » 488 impressions / 4 clics, « une fille » 314 / 3 | `besoins-audience-donnees-internes-s24.md` S1, S5 ; `point-etape-s20.md` l. 62 |
| Passage article vers abonnement | 0 clic sur 69 vues d'encarts d'article (s21) ; 3 vues de `/abonnement` la semaine du 26/10 | `besoins-audience-donnees-internes-s24.md` S5, S7 |
| Abonnement depuis un article (code) | bouton de fin d'article : `/abonnement?returnTo=/parcours/<parcours associé>&src=blog-<slug>` ; parcours via `lib/blog-parcours.ts` (slug, cluster, défaut « repartie ») ; `src` relayé jusqu'à `/register` mais jamais transmis à Stripe (checkout : `plan` et `returnTo` seulement ; métadonnées `userId`, `plan`) ; arrivée après paiement sur `returnTo`, sinon `/parcours` | `article-cta.tsx` l. 89 ; `blog-article-view.tsx` l. 137 ; `premium-return.ts` l. 59 à 66 ; `api/stripe/checkout/route.ts` ; `lib/stripe.ts` l. 186 à 193 |
| Clusters d'articles | cluster = parcours (6 sur 9 vers repartie, dont celui de l'article de blagues ; `douleurs-personas` confiance ; `humour-contexte` boulot ; `saisonnier` machine-a-cafe) ; `fort-volume` regroupe blagues 2026, phrases drôles, faire rire une fille / un homme, faire rire ses amis, créer ses propres blagues ; humour noir dans `types-humour` ; aucun cluster storytelling ni autodérision ; articles « faire rire » renvoyés à confiance par slug | `lib/blog-clusters.ts` l. 37, 58 à 61 ; `config/blog-encarts.ts` l. 30 et 31 |
| Vannes « inédites » du calendrier | vannes actives jamais servies au contenu du jour ; **visibles dans le catalogue public** (`/api/jokes` ne filtre que `isActive`) | `lib/analytics/weekly-stock.ts` |
| Pivot du 06/05 | « conseils > vannes (la vraie valeur = articles décryptés, parcours, vidéos, pas le catalogue de vannes) » | `founder-preferences.md` l. 20 |
| Parcours et étapes | 5 parcours, 25 étapes (3, 4, 6, 6, 6) | `config/premium.ts` |
| Rythme annoncé | Machine à Café 15, Répartie 20, Confiance 20, Storytelling 20, Boulot 15 min/semaine | `config/premium.ts`, choix du 29/09 |
| Niveaux de difficulté | DEBUTANT : Machine à Café (`parcours-seed.json` l. 8), Boulot (`parcours-boulot-s19.json` l. 307) ; INTERMEDIAIRE : Répartie, Confiance, Storytelling (`parcours-storytelling-s18.json` l. 94) | lus et vérifiés par @elon et @reviewer |
| Parcours désigné par le quiz, par profil | Observateur, confiance ; Storyteller, storytelling (machine-a-cafe si non publié) ; Absurde, machine-a-cafe ; Punchlineur, repartie ; Taquin, repartie | `quiz-data.ts` l. 41 à 100 |
| Conservation du résultat du quiz | navigateur seulement (`localStorage`), rien en base ni sur le compte | `viral-quiz.tsx` l. 36 à 46 |
| Étape 1 de Répartie | une des 3 étapes gratuites réécrites en version B, avec « repli solo », **validées par Thomas** (le niveau pour un débutant n'est pas dit) | `founder-preferences.md` l. 73 (07/10) |
| Persona de Machine à Café dans le seed | « Sophie (26 ans, jeune active) » | `parcours-seed.json` l. 12 |
| Étape 1 de Machine à Café | scène (`moduleDetail`, qui contient « Imagine Léa »), pourquoi, 1 conseil avec exemple et défi, 5 vannes (l. 35 à 39), 2 vidéos (Paul Séré, Karim Duval), quiz de 4 questions, 50 XP, gratuite | `parcours-seed.json` |
| Durée d'une étape | **estimée** à 22 à 25 min par lecture [HYPOTHÈSE : 200 mots/minute, vidéos de 5 à 8 min], calculée seulement sur Machine à Café ; **à chronométrer** | INV 3.1 |
| XP, niveaux, série (code) | XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100, seuils 0/100/500/1 500/5 000, série comptée sur la pratique, rythme doux de 7 jours ; la date conseillée n'existe qu'après une première validation (`nextRecommendedAt`) | `lib/progression.ts` |
| Retour d'exercice existant | 3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche` | `lib/progression.ts` l. 114, choix du 07/10 |
| Glossaire public | 12 termes (définitions de 40 à 60 mots), indexé. « Accusé de réception » = formule dite (« Intéressant », « Pas faux », « Bien vu ») | `glossary.ts` l. 79 |
| Carnet | 15 fiches (octobre) + 30 (novembre) ; contextes : boulot 9, amis 8, soirée 8, famille 7, quotidien 6, couple 5, sport 2 ; aucune fiche rencontre, études, coloc, messagerie, prise de parole. Identifiants : H10 est `2026-11-25`, H03 `2026-11-03`, H29 `2026-11-10` | INV section 6, `besoins-audience-donnees-internes` S13 |
| Lettres | 6 du mois + 16 réservées, approuvées par Thomas. Format A (W46, W48, W50 lues) et un format B par mois (W47, W51). Scènes déjà validées : exposé de TD, visio, premier rendez-vous, entretien annuel, galette au bureau (« un petit mot »), repas de Noël, repas de Pâques | `hebdo-premium.json`, choix du 25/10 |
| Univers déjà validés par Thomas | soirée, boulot, amis, famille, couple, dating, caisse, voisin (octobre) ; couple (Black Friday) ; un premier rendez-vous (W50) ; un exposé de TD (W46) | `departage-2026-10.md`, `departage-r2.md`, `hebdo-premium.json` |
| Taxonomie des vannes | 14 catégories (`JokeCategory`) dont SOIREES, BOULOT, PARENTS, DATING, COUPLE, ECOLE, RESEAUX_SOCIAUX ; pages de thème en ligne : boulot, couple, soirées, famille, autodérision, dating, gaming | `schema.prisma`, `point-etape-s20.md` §5 |
| Stock d'inédits des vannes | « quand le stock d'inédits approche de la fin, on prépare un nouveau lot » ; alerte `/api/health` sous 14 jours | `founder-preferences.md` l. 120 (18/10) |
| Questions à l'équipe | réponse en général sous 1 à 2 jours ouvrés (CGU : au plus tard 3 jours ouvrés) ; « préparée en session, relue et envoyée par l'équipe » ; limites techniques par abonné, aucune limite affichée ; « stop au juridique excessif » | `founder-preferences.md` l. 135 et 136 (25/10) |
| Conservation déjà décidée | 24 mois pour les réponses à la question de résiliation ; 6 mois après le dernier échange pour les e-mails de questions | l. 154 (07/11), l. 135 (25/10) |
| Sujet sensible ou détresse | « on fait ça bien » (14/10) ; playbook : orientation vers l'aide officielle (3114), réponse sans humour | `founder-preferences.md` l. 103 ; `playbook.md` l. 595 |
| Phrases juridiques de « Mes questions » | déjà écrites par @legal | `docs/legal/espace-client-s24-phrases.md` |
| Catalogue dans la décision du 12/11 | [CHOIX UTILISATEUR] : « Le reste du catalogue reste une bibliothèque en accès libre à côté » (décision du 19/10 confirmée) ; Premium se vend « tout Deviens Marrant ouvert » (19/10) | `founder-preferences.md` l. 162, l. 124 |

### 1.2 Les personas, d'après `project-context.md`

Les personas sont des cas d'essai pour écrire et tester les contenus ; **le produit ne les connaît pas**. Ses signaux sont le lien de retour (`returnTo` : fiche, étape ou parcours, y compris le parcours associé à un article), la réponse à un éventuel geste d'une question (C9) et, sur le même appareil, le résultat du quiz d'humour (4.2). Ils sont [SUPPOSÉS].

- **Yanis**, 20 ans, étudiant introverti : veut s'affirmer « en soirées, en coloc et avec ses potes » ; frustration : rester muet quand tout le monde se chambre.
- **Sophie**, 26 ans, jeune active : manque de conversation à la machine à café, veut des anecdotes à ressortir « en afterwork, dîners entre amis » ; frustration : pas de situations professionnelles.
- **Marc**, 34 ans, récemment séparé : veut renouer avec l'humour et la légèreté, retrouver confiance dans ses interactions ; cherche des parcours structurés et une progression mesurable. **Aucun signal d'audience ne confirme son besoin central.**

### 1.3 Rendement de la barre « niveau Alexa » (faits, avec source)

| Fait | Source |
|---|---|
| 30 vannes au niveau sur 333 (30/09) | `founder-preferences.md` l. 37 |
| 2 vannes au niveau sur 360 au pilote des réseaux (06/10) | l. 65 |
| Boulot : 10 places validées sur 19 après 5 tours ; tour 6 pour les 11 places restantes | l. 86 (11/10) |
| Carnet d'octobre : 180 candidates ; 18 (critique A) et 14 (critique B) jugées « = » au niveau ; 15 répliques retenues, soit environ 8 % | `critique-A.md`, `critique-B.md`, `departage-2026-10.md` |

Pour des répliques en situation, la fourchette de rendement est de 1 sur 2 (Boulot) à 1 sur 12 (carnet d'octobre) [HYPOTHÈSE d'extrapolation].

### 1.4 État de la relecture à l'aveugle du carnet (T3 d'INV, partiellement levé)

- **Octobre** : 180 candidates relues par deux critiques à l'aveugle (A et B). Le départage est de l'**orchestrateur** (`departage-2026-10.md` l. 3), pas d'un troisième relecteur indépendant. Sur les 15 répliques retenues, **5 sont jugées au niveau par les deux critiques** (n° 56, 131, 108, 121 et V2-12) et **10 par un seul critique indépendant** plus l'orchestrateur. Format et 15 fiches validés par Thomas le 03/10. Les champs autres que la réplique : relecture non établie [À VÉRIFIER].
- **Novembre** : relecture à l'aveugle en plusieurs passes. Verdict v4, passe 2 : 27 fiches à 10 sur 10, 3 à 9 (H03, H09, H10). Confirmation v5 sur les 6 fiches retouchées : relecteurs 2 et 3 à 10 sur 10 ; relecteur 1 à 10 sauf H10 à 9.
- **Fiche H10 (`2026-11-25`)** : le texte en ligne contient la correction proposée par le relecteur 1 (« à la décision des juges », l. 303), **jamais relue à l'aveugle**. Règle d'or P0 s18 : un tour de relecture avant son entrée dans la rafale.
- **Concordance vérifiée** sur 3 fiches : `2026-11-03` = H03 v5, `2026-11-10` = H29 v5, `2026-11-25` = H10 corrigée.
- **À faire avant l'entrée du carnet dans la rafale** : (a) un tour de relecture de H10 ; (b) le diff complet entre `2026-11.json` et la dernière version relue ; (c) la relecture d'octobre et de ses champs non relus, selon la règle choisie en C8. **Toute fiche du carnet corrigée revient à Thomas avant de reprendre sa place.**
- **Portée de la règle du 12/11** : point de la question C8.

---

## 2. La leçon, le moteur d'entraînement et « Mes questions »

### 2.1 Définition

**Une leçon est une fiche d'environ 5 minutes qui apprend une chose et se termine par un geste** : choisir, écrire, dire à voix haute, ou tenter dans la vraie vie. Toute fiche a un geste, même celles reprises du catalogue (les 5 vannes d'une étape : « choisis celle que tu ressortiras cette semaine »). « Fait » se coche quand le geste est fait, déclaré par l'abonné, sans preuve : défaut proposé, à confirmer avec Q5 du brief. L'état « Fait » est unique par fiche, quelle que soit la porte d'arrivée.

Deux étages : **les fiches** expliquent et font essayer (sections 3 à 5) ; **le moteur** fait répéter, revoir et sortir de l'écran (2.2 à 2.5). Un troisième lieu, **Mes questions** (2.6), prend le relais quand l'abonné bute sur sa propre situation.

### 2.2 La rafale du jour, carte par carte

Dans « Aujourd'hui », jusqu'à 3 cartes par jour (3 à 5 minutes [HYPOTHÈSE]) : 1 situation nouvelle plus jusqu'à 2 cartes à revoir. Libellé de l'action : « Si tu as 5 minutes » : la rafale n'est jamais présentée comme une obligation. **Accroche à tester à l'étalon E5** : nommer le phénomène que la rafale soigne, « l'esprit de l'escalier » (trouver la bonne réponse trois jours trop tard) [PISTE, à confirmer], testé à l'aveugle contre une accroche sans ce mot. Il existe **deux sortes de cartes**.

**Carte « Quel registre ? »** (situation neuve à trois répliques, deux contextes par situation). Ordre :
1. **La scène et le contexte** s'affichent.
2. **« Ta réponse d'abord »** : l'abonné tente SA réplique, à voix haute ou dans sa tête (« dans ta tête, ça compte aussi », comme dans l'app, décision du 04/11). Un compte à rebours de 10 secondes [HYPOTHÈSE, à caler à l'étalon E5] est **désactivé la première fois, activable ensuite**. Aucun jugement, rien de ce texte n'est enregistré. Sans compte à rebours, un court « Prends ton temps » s'affiche d'abord (3 secondes) avant les trois boutons.
3. **« Tu avais une réponse ? »**, posé AVANT que les répliques soient visibles, juste après les 10 secondes (ou dès que l'abonné le veut) : trois boutons fermés, « Oui », « À moitié », « Rien ». **Ces trois boutons sont aussi ce qui révèle les répliques** : un minuteur ne bloque jamais l'accès, et il n'y a pas de bouton de plus. Un seul toucher, aucun texte libre. L'état du compte à rebours est enregistré avec la réponse.
4. **Les répliques** apparaissent (la sûre, la joueuse, la risquée).
5. **Le choix** : l'abonné choisit la réplique qui convient au contexte.
6. **La règle**, en une phrase.
La réponse est donnée avant de voir les répliques : elle ne peut pas être gonflée après coup.

**Carte « Et toi ? »** (fiche du carnet, qui a deux répliques : sa réponse et sa sortie polie « si c'est tendu »). C'est une **carte de production, sans étape de choix** : l'étiquette d'ambiance donnerait la réponse. Ordre : la scène ; « Ta réponse d'abord » ; « Tu avais une réponse ? » (Oui, À moitié, Rien : ces boutons révèlent les deux répliques) ; les deux répliques, chacune avec son ambiance (« détendue » pour la réponse, « tendue » pour la sortie polie) ; le « pourquoi » du carnet. Aucun texte neuf par fiche, aucun texte du carnet modifié.

**Les 5 situations de prise de parole courte** (toast, pot, « un petit mot ») n'ont pas de pique à renvoyer : elles entrent dans la rafale sous la forme **« Ta première phrase d'abord »**, avec deux contextes (public proche, public large) et le choix entre trois ouvertures. Le reste de la carte est identique (« Tu avais une réponse ? », choix, règle). Le stock de 2.3 est inchangé.

**Ce que « Oui », « À moitié » et « Rien » font** (règle unique, valable pour toutes les cartes) :
- **« Oui »** : compte comme réponse pour la courbe, pour le seuil P3 (« 20 cartes où l'abonné avait une réponse ») et pour la proposition « 7 secondes ? ». La carte ne revient pas à cause de cette réponse.
- **« À moitié »** : la carte revient une fois à J+7 [HYPOTHÈSE] ; **ne compte pas comme réponse pour les seuils** (seul « Oui » compte) ; la courbe l'affiche à part.
- **« Rien »** : la carte revient **une seule fois**, à J+2, pour que « Oui » ne soit jamais un moyen de passer plus vite.
- **Honnêteté de la mesure** : c'est une **auto-déclaration**, jamais contrôlée ; elle est lue comme une indication, pas comme une preuve ; un choix raté sur une carte « Quel registre ? » reste, lui, objectif et fait revenir la carte.

**Ce que le moteur retient** (par carte) : la réponse à « Tu avais une réponse ? », l'état du compte à rebours, et, sur les cartes « Quel registre ? », le résultat du choix. **Courbe** dans « Ton mois » (4.4) : part des cartes avec « Oui » avant d'avoir vu quoi que ce soit, « À moitié » à part ; affichée à partir de 10 cartes, **sans pente colorée ni phrase de reproche** ; si elle baisse, texte neutre (« Les semaines varient. Cette semaine : 4 cartes sur 10 avec une réponse. »). Mesure d'affichage : ni série ni points (sauf option C de C4).

**Ordre de tirage et progression** :
- La situation nouvelle du jour suit un ordre : les 5 situations d'entrée d'abord (P1), puis les P2, puis les P3 (supérieur, inconnu, groupe) **seulement après la semaine 4 ou après 20 cartes avec « Oui »** [HYPOTHÈSE de seuil, à caler à l'étalon E5]. Les contextes où la risquée gagne arrivent surtout dans les P3. **Une seule exception à cet ordre** : après le choix « pour plaire » (C9 B), la prochaine situation nouvelle est une situation de rencontre, une fois ; puis l'ordre normal reprend (4.2).
- Le compte à rebours ne raccourcit **jamais de lui-même** : après une semaine où l'abonné a répondu « Oui » sur 7 cartes ou plus de 10, l'espace propose « 7 secondes ? », puis « 5 secondes ? ». Il peut refuser sans conséquence.
- **Révision** : une carte « Quel registre ? » ratée (mauvais choix) revient à J+2, J+7 puis J+21 ; une carte « Rien » revient une fois à J+2 ; une carte « À moitié » revient une fois à J+7 ; une partie des cartes réussies revient à J+30 [HYPOTHÈSE]. Maximum 3 cartes par jour : **les cartes en trop glissent au lendemain, jamais d'arriéré affiché**.
- **Remplissage des places libres** (quand aucune carte n'est à revoir) : d'abord le second contexte d'une situation neuve déjà vue ; s'il n'y en a pas, **« C'est tout pour aujourd'hui »** plutôt que de répéter une carte. Les cartes du carnet n'ont pas de second contexte.

**Règles d'écriture des contextes** (situations neuves) : une seule bonne réponse défendable par contexte ; chaque situation porte 2 contextes ; sur l'ensemble des situations neuves, environ la moitié des bonnes réponses sont des joueuses, un quart des sûres, un quart des risquées [HYPOTHÈSE, à fixer à l'étalon E1]. **Règle « on rit avec, pas contre »** (le seul rejet observé de l'audience, section 0, [PISTE]) : la risquée reste joueuse ; elle ne se moque jamais d'une faiblesse, d'un physique ni d'une origine ; elle renvoie la pique, la retourne vers un comportement du moment ou rend la parole ; un contexte où la risquée gagne exige que l'autre soit complice (il a lui-même lancé le jeu ou fait de même). **Si une risquée gagnante ne passe pas cette règle à l'étalon E1, la part d'un quart est revue à la baisse.** Part des cartes du carnet : 60 % des situations à l'ouverture (45 sur 75) et environ 75 % avec le flux mensuel ; la question C3 propose d'écrire les carnets suivants à trois registres.

**Les trois registres, en une ligne chacun** (tirés des lettres au format A) :
- **La sûre** : ne vise personne, se ferme toute seule, la conversation reprend sans que l'autre ait à répondre (elle ne se termine pas par une question). À choisir quand tu ne connais pas encore l'humour du groupe.
- **La joueuse** : prend la pique au mot et la retourne vers toi ou vers une règle, sans viser quelqu'un. À sortir quand le groupe a déjà ri ensemble.
- **La risquée** : s'adresse à l'autre ou lui rend la parole (elle appelle une réponse, souvent par une question) et peut sonner comme une provocation si le ton n'est pas complice ; **jamais méchante** (règle ci-dessus).

La sûre est une vraie réplique légère. Dans le carnet, la réponse correspond à la joueuse et la « sortie polie » est une quatrième chose : elle garde son nom.

### 2.3 Le stock de la rafale, calculé

**Consommation** : une situation NOUVELLE par jour au plus (le bouton « encore une » sert une carte à revoir ou un second contexte, jamais une nouvelle). Un abonné qui vient 7 jours sur 7 consomme 30 situations nouvelles par mois.

| Source | À l'ouverture (seuil 7.4) | V1 complète |
|---|---|---|
| Carnet d'octobre et de novembre, cartes « Et toi ? » (un seul contexte) | 45 situations, **45 cartes** | 45 situations, **45 cartes** |
| Situations neuves à 3 répliques, 2 contextes chacune, cartes « Quel registre ? » | 30 situations, **60 cartes** | 60 situations, **120 cartes** |
| **Situations nouvelles disponibles** | **75** | **105** |
| **Cartes (carnet 1 par situation, neuves 2 par situation)** | **45 + 60 = 105** | **45 + 120 = 165** |

| Jour d'un abonné quotidien | Nouvelles consommées | Stock à l'ouverture (75) | Stock V1 complète (105) |
|---|---|---|---|
| J30 | 30 | tient | tient |
| J60 (après le premier renouvellement, J25 à J30) | 60 | tient, marge de 15 | tient, marge de 45 |
| J90 | 90 | le carnet de décembre (+30, déjà prévu) porte le stock à 105 | tient |

**Flux** : 30 fiches de carnet par mois (déjà prévu) plus environ 10 situations neuves par mois [HYPOTHÈSE, à mesurer au lot 1] : 40 contre 30 consommées par un abonné quotidien. Le régime mensuel est chiffré en 7.3 bis.

**Si le carnet d'un mois est en retard** : la rafale passe à une situation nouvelle **un jour sur deux** ; les autres jours elle sert les cartes à revoir et les seconds contextes des situations neuves déjà vues, et quand il n'y en a plus, « C'est tout pour aujourd'hui » (jamais de répétition). L'alerte de stock se déclenche à 30 jours de la fin pour un abonné régulier (même logique que `/api/health` pour les vannes, décision du 18/10).

**Prérequis** : le carnet n'entre dans la rafale qu'après les vérifications de 1.4.

### 2.4 Les missions, le retour et la grille

**Missions en 5 marches** : 1 seul, à voix haute ; 2 à un proche, par message ; 3 à un pote, en face ; 4 dans un petit groupe ; 5 avec quelqu'un qu'on connaît peu. Toujours facultatives, jamais comptées contre l'abonné, **une seule mission ouverte à la fois**. **Critère d'écriture : provocable cette semaine** ; sinon la mission est reformulée. Les défis déjà écrits (conseils, vidéos) sont étiquetés par marche dans une table de correspondance séparée : aucun champ des seeds n'est modifié, diff à zéro mot (P0 s11). **Le trac** (le « avant ») est couvert par les missions des marches 1 et 2, par la rafale (un entraînement sans enjeu, sans public) et par « Le blanc » (3.8) ; ce qui resterait à couvrir se lira dans « Mes questions ».

**Retour d'une mission** : « Pas essayé », « Essayé, bof », « Essayé, ça a marché » (les 3 valeurs fermées déjà utilisées pour les exercices).

**La marche suivante dépend du retour, pas de la date** :
- « Essayé, ça a marché » : l'espace propose la marche d'au-dessus. **À la marche 5**, une mission libre ou une nouvelle situation à la même marche.
- « Essayé, bof » : même marche, avec une autre situation, la fiche « Quand ça tombe à plat » et un lien vers **Mes questions** (type « Situation à gérer » : « Raconte-nous ce qui s'est passé »).
- « Pas essayé » deux fois de suite : l'espace propose la marche d'en dessous, sans commentaire. **À la marche 1**, une autre situation, jamais un message.
Le calendrier de 4.1 indique la **marche visée**, pas la marche imposée.

**Grille d'auto-contrôle de la réplique écrite** (après Comment c'est construit, Formules, jeux d'écriture) : 3 questions oui ou non, rien d'enregistré. (1) Elle tient en une phrase ? (2) Si elle vise quelqu'un, peut-il en rire avec toi ? (3) La fin surprend ? Elle répond aussi, sans stockage, à « est-ce que c'est lourd ? » [PISTE, à confirmer] ; la règle « savoir s'arrêter » est détaillée en 3.8.

### 2.5 Ce que le moteur ne fait pas

Aucune relance d'inactivité, aucun e-mail, aucune notification qui culpabilise, aucun classement, aucune note qui sanctionne. La révision n'apparaît que si l'abonné ouvre l'espace.

### 2.6 Mes questions : l'onglet de l'abonné pour l'équipe

**Décisions de Thomas, 12/11** (`founder-preferences.md` l. 164 et 165) : « Qu'il y ait aussi un onglet avec mes questions aussi pour leur espace question. Problème situation à gérer question etc. » puis « Gardons tout en base oui. Vu que c'est leur espace. Ils doivent avoir accès à leur historique ». Elles rouvrent, avec son accord écrit, « rien en base » (25/10) et, pour cette fonction, « aucun texte libre stocké » (07/10, avis @legal C13).

**Ce que c'est** : un onglet (nom de travail « Mes questions », alternative : « Écrire à l'équipe », libellé déjà validé). L'abonné choisit un type en un geste, écrit, envoie, et retrouve **Mes envois** : ses messages, leur statut et les réponses de l'équipe. Il absorbe l'encadré « Ta question à l'équipe » du profil.

**Les trois types, en une phrase chacun**
- **Un problème** : quelque chose ne marche pas ou ne se passe pas comme prévu sur le site (accès, paiement, affichage).
- **Une situation à gérer** : une scène que tu vas vivre ou que tu viens de vivre, et pour laquelle tu veux des idées de réponse.
- **Une question** : tout le reste (comprendre une technique, un contenu, l'offre, « est-ce que cette blague est lourde ? » [PISTE, à confirmer]).
Sous le champ : « Évite les noms : décris la scène. »

**Un seul délai pour tous** : les trois types ont le même engagement affiché, « en général sous 1 à 2 jours ouvrés » (règle du 25/10 ; au plus tard 3 jours ouvrés aux conditions d'utilisation). Aucune promesse de priorité affichée.

**Un seul circuit de réponse** : la réponse de l'équipe est **saisie dans l'outil de l'admin**, **enregistrée** dans l'historique de l'abonné, puis part par **l'e-mail de réponse habituel** (la réponse que l'abonné attend déjà aujourd'hui, signée « L'Équipe Deviens Marrant » : ce n'est pas un nouvel e-mail automatique). Aucune réponse n'est envoyée par e-mail seul : toute réponse faite hors de l'outil y est recopiée, avec la question. Les e-mails d'accueil approuvés E1 (« Réponds à cet e-mail ») et J21 restent inchangés : les réponses qu'ils suscitent sont recopiées dans l'outil. L'e-mail J12 approuvé (E1b) porte « Poser ma question : /profil », sans ancre : **`/profil` garde une ligne de lien vers « Mes questions »**. Dans l'espace, « Aujourd'hui » affiche « L'équipe t'a répondu » tant que la réponse n'a pas été ouverte ; aucune pastille sur les onglets (règle du brief §2.6).

**Adresses** (à fixer par @fullstack) : l'adresse du compte est **toujours lue en base** (session), jamais saisie ni recopiée d'un message entrant ; c'est elle qui sert de Reply-To sur le message transmis à l'équipe et d'adresse du destinataire de la réponse. Sur l'e-mail de réponse, l'adresse de réponse est celle de l'équipe ; sa réponse est recopiée dans le même fil.

**Un fil par envoi** : l'abonné peut ajouter un message à un envoi répondu (« Continuer »), l'équipe répond dans le même fil ; chaque nouveau message suit le même engagement de délai et les limites techniques existantes.

**Règles du 25/10 conservées** : réponse **préparée en session, relue et envoyée par l'équipe** (aujourd'hui Thomas seul : il relit et envoie chaque réponse), signée « L'Équipe Deviens Marrant », aucune mention d'IA, aucune limite affichée, questions vers alex@deviens-marrant.fr.

**Norme d'une réponse « Situation à gérer »** : d'abord la méthode, puis 1 à 3 répliques **déjà validées** les plus proches (Quoi répondre, carnet, catalogue), avec leur lien. Une réplique neuve seulement si elle passe la relecture à l'aveugle dans le délai ; sinon aucune. Coût compté en 7.3 bis.

**Étiquette de scène (capteur de la demande réelle)** : en saisissant sa réponse dans l'outil, l'équipe choisit pour chaque fil **une valeur de « Où et avec qui ? » et une valeur de « Pour quoi faire ? »** (deux valeurs au plus, listes fermées de 3.3), ou « autre » ; **pour un « problème » technique, la valeur est « autre »**. Aucune analyse du texte. La session lit les comptes une fois par mois (7.7). **Ordre de grandeur honnête** : à 100 abonnés actifs, environ 40 fils de situation par mois ; avec les 4 abonnés actifs du 02/11, la lecture n'apprend presque rien et **ne doit pas piloter le plan** avant plusieurs dizaines de fils.

**États limites**

| État | Ce que voit l'abonné | Règle |
|---|---|---|
| Aucun envoi | Un exemple de message par type (par exemple, pour « Une question » : « Est-ce que cette blague est lourde ? Voici la scène… » [PISTE]) et la phrase sur le délai | jamais un tableau vide |
| Envoi en cours | « Envoi en cours » | le message n'est pas perdu en cas d'échec : il reste dans le champ |
| Envoyé | « Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés » | |
| Répondu | La réponse, datée ; « L'équipe t'a répondu » dans « Aujourd'hui » ; « Continuer » | le fil reste ouvert |
| En retard | Après 3 jours ouvrés : « L'équipe n'a pas encore répondu, ta demande est bien là » | alerte interne à l'équipe ; on prévient en cas de retard (25/10) |
| Retiré par l'abonné | L'envoi disparaît de son historique (« retiré de ton historique ») | l'échange est supprimé dans l'espace ; les copies par e-mail suivent leur durée (6 mois, phrase de @legal) : à confirmer, C10 a |
| Abonnement terminé | Historique gardé ; affichage ou non : à confirmer, C10 a | le compte est conservé |
| Message sensible | Aucune promesse affichée. En interne, **lu et traité en premier dès qu'il est vu**, signalé par l'alerte interne ; réponse à la main, sans humour, avec l'orientation vers l'aide officielle (3114) | « on fait ça bien » (14/10) ; playbook l. 595 |

**Détresse** : une ligne sur le 3114 est une **option de question, C10 b** (trois options).

**Où l'abonné y arrive** (porte unique : l'onglet ; raccourcis) : après « Essayé, bof » ; en bas d'une fiche « Quand ça tombe à plat » (« Ta situation n'est pas dans la liste ? Raconte-la à l'équipe ») ; en fin de séance et de « Comment c'est construit » (« Montre ta réplique à l'équipe », texte préchargé côté navigateur, jamais dans l'adresse) ; depuis « Quoi répondre » quand aucun filtre ne donne de situation. Pas après chaque jeu.

**Ouverture** : « Mes questions » suit la règle commune (7.4) et s'ouvre avec l'espace, pas avant. L'encadré du profil reste en service jusque-là.

**Textes validés à retoucher** (chaque retouche repasse par Thomas ; **phrases déjà écrites par @legal**) : `confidentialite/page.tsx` (section 9, puces 1 et 4 ; partie 6, dernier paragraphe ; partie 4, ligne Neon, facultatif) ; `config/textes/question-equipe-s22.ts` (CGU art. 10) ; l'encadré du profil, qui devient une ligne de lien. Base légale : exécution du contrat ; aucune mention d'opposition obligatoire. **Aucun avis juridique supplémentaire n'est recommandé** (25/10, l. 136 ; l. 165).

**Charge de l'équipe (fondateur solo)** [HYPOTHÈSE : de 0 à 1 message par mois et par abonné actif ; aucune mesure, 4 abonnés au 02/11] : à 100 abonnés actifs, environ 5 messages par jour ouvré ; **à l'objectif de 6 mois (environ 503 abonnés, brief §1), environ 25 par jour ouvré**. **Thomas relit et envoie toutes les réponses** : c'est le vrai goulot. Garde-fous : message d'attente honnête, seuil d'alerte interne [HYPOTHÈSE : plus de 10 messages en attente], limites techniques existantes. **Seuil de la question de l'aide** : au-delà de 10 réponses par jour ouvré en moyenne sur un mois [HYPOTHÈSE], on pose à Thomas la question de l'aide. **Leviers** : réponses types tirées des réponses déjà envoyées (relues avant envoi) ; les « Situations à gérer » qui reviennent deviennent des fiches de « Quoi répondre » (anonymisées, avec l'accord de l'abonné, 17/10).

### 2.7 Anatomie commune d'une fiche

1. Titre qui dit la situation ou le mécanisme (jamais un titre de cours). 2. Accroche d'une phrase. 3. Exemple d'abord, règle ensuite. 4. Une seule erreur courante, dite sans jugement. 5. Le geste, avec sa marche de mission quand il y en a une. 6. « Ce qu'on aurait pu dire » : une version qui marche, jamais « corrigé ». 7. Deux liens vers le catalogue. 8. Durée affichée, statut « Voir » / « Fait ».

---

## 3. Les types de fiches neufs

### 3.1 Libellés vus par l'abonné (propositions, à calibrer à l'étalon)

« Scolaire » ne définit pas la marque. Les noms de travail restent internes.

| Nom de travail | Libellé proposé | Remplace |
|---|---|---|
| Situation | « Quoi répondre » | Situations |
| Gradation | « la sûre / la joueuse / la risquée » | douce, moyenne, piquante |
| Grammaire de la vanne | « Comment c'est construit » | Grammaire |
| Vocabulaire | « Vocabulaire » (mot de Thomas) | pas de renommage |
| Expressions | « Formules à détourner » | Expressions |
| Écouter et décortiquer | « Écouter, repérer » | |
| Rattrapage | « Quand ça tombe à plat » | Guide |
| Exercice et jeu | « À toi » et « Jeux » | Exercice |
| Corrigé | « Ce qu'on aurait pu dire » (une version qui marche) | Corrigé |
| Test de section | « Le bilan du parcours » (mot déjà dans l'offre, sans certificat), ton « refais une situation » ; le quiz d'étape garde son nom | Test de section |
| Atelier | « Séance de 20 minutes » | Atelier |
| Écrire à l'équipe | « Mes questions » (à caler) | encadré « Ta question à l'équipe » |

**Guides** : Thomas a mis « Guides » en tête de sa capture. Nous ne créons pas un type de plus : les 120 conseils actifs tiennent ce rôle et chaque fiche neuve les relie ; trois principes sont des fiches « Quand ça tombe à plat ». Thomas peut demander des guides neufs quand il veut (note reprise en tête de la section 8).

### 3.2 Tableau d'ensemble (9 types, volumes V1, paliers)

Volumes = [HYPOTHÈSE de dimensionnement] justifiés par la rafale (2.3), le rendement (7.3) et les besoins de la section 0. Paliers : P1 premier pas, P2 prendre le pli (semaines 1 à 4), P3 aller plus loin.

| # | Type | Geste | Fiches neuves | Dont P1 | Dont P2 | Dont P3 | Réemploi |
|---|---|---|---|---|---|---|---|
| 1 | Quoi répondre (3 répliques) | choisir, dire, tenter | 60 | 5 | 40 | 15 (supérieur, inconnu, groupe) | Carnet (45) repris tel quel |
| 2 | Comment c'est construit | écrire | 12 | 0 | 9 | 3 (combiner deux mécanismes) | `/anatomie-vanne`, décryptages |
| 3 | Vocabulaire | reconnaître, placer | 8 fiches (40 mots) | 0 | 8 | 0 | Glossaire (12) |
| 4 | Formules à détourner | écrire | 12 | 0 | 12 | 0 | Vannes déjà détournées [À VÉRIFIER] |
| 5 | Écouter, repérer | repérer, écrire | 12 | 0 | 1 | 11 | Vidéos actives (89) |
| 6 | Quand ça tombe à plat | choisir | 10 | 0 | 10 | 0 | Conseils liés |
| 7 | Jeux | choisir, écrire | 30 | 0 | 30 | 0 | Quiz d'humour, défis |
| 8 | Le bilan du parcours | choisir, dire | 5 | 0 | 5 | 0 | Quiz d'étape conservés |
| 9 | Séance de 20 minutes | faire | 6 | 0 | 1 | 5 | Défis |
| | **Total** | | **155** | 5 | 116 | 34 | |

Les 4 pièces du moteur ne comptent pas de fiches : elles réutilisent le type 1. Le parcours Boulot (DEBUTANT) n'est pas « plus loin » : c'est le parcours suivant d'un abonné qui vient de Machine à Café.

### 3.3 Quoi répondre (le cœur)

- **Définition** : une scène de la vie courante, trois répliques, la règle pour choisir, l'erreur courante, le geste. Même squelette que le format A des lettres, **jamais le même texte** (décision du 25/10). Fondement de positionnement : très peu d'équivalents français structurés par situation [PISTE, à confirmer].
- **Carnet et situations, une seule porte** : le carnet est le flux mensuel de cette rubrique (« Nouvelles ce mois-ci » en tête, archive par mois). Une fiche du carnet est une situation à 2 répliques (sa réponse = la joueuse, sa sortie polie), reprise sans modification ; une situation neuve a 3 répliques. `/carnet` garde son URL.
- **Filtres** : « Où et avec qui ? » (coloc, soirée, amis, famille, couple, rencontre, boulot, réunion et entretien, études et fac, messages et groupes, prise de parole, commerces, transports, voisins) et « Pour quoi faire ? » (désamorcer, répondre à un chambrage, relancer une conversation, rattraper un faux pas, prendre la parole). Chemin d'entrée : « Les 5 situations pour commencer » (4.2). Le carnet n'a aucune fiche rencontre, études, messagerie ni prise de parole : ces filtres se remplissent avec les situations neuves.
- **Plan des 60 situations neuves, avec sa règle** (priorité de 0.1, niveau « quoi écrire » : [MESURÉ V] > [OBSERVÉ] > [SUPPOSÉ] ou [PISTE]) : **4 situations de base par univers (12 univers, 48) ; +2 si le besoin est [MESURÉ V] ; +1 si [OBSERVÉ] par le carnet ou les lettres (un départage, pas une preuve de demande) ; +0 si [SUPPOSÉ] ou [PISTE]** (ces univers sont des paris, nommés comme tels). C'est un choix d'écriture : il ne place rien devant rien sur l'écran d'un abonné (4.4). Chaque écart est justifié :

| Univers (« Où et avec qui ? ») | Niveau de preuve | Calcul | Situations |
|---|---|---|---|
| Coloc | [SUPPOSÉ] (persona seul) : **pari** | 4 + 0 | 4 |
| Soirée | [MESURÉ V] **indirect** (la page « phrases drôles en conversation », 2 198 affichages, mesure la conversation en général, pas la soirée) ; carnet 8 : **+2 retenu comme choix d'écriture, revu au premier relevé de 7.7** | 4 + 2 | 6 |
| Amis | [OBSERVÉ] carnet 8 | 4 + 1 | 5 |
| Famille | [OBSERVÉ] carnet 7, lettres | 4 + 1 | 5 |
| Couple | [OBSERVÉ] carnet 5, lettre | 4 + 1 | 5 |
| Rencontre (rencard, messages d'approche) | [MESURÉ V] sur deux pages (488 et 314 affichages, 4 et 3 clics) | 4 + 2 | 6 |
| Boulot (café, pot) | [OBSERVÉ] carnet 9, lettres | 4 + 1 | 5 |
| Réunion et entretien (dont visio) | [OBSERVÉ] lettres validées | 4 + 1 | 5 |
| Études et fac (exposé, groupe de TD) | [OBSERVÉ] lettre W46, catégorie ECOLE | 4 + 1 | 5 |
| Messages et groupes (écrit, réseaux) | [SUPPOSÉ] (quiz, catégorie RESEAUX_SOCIAUX) : **pari** | 4 + 0 | 4 |
| Prise de parole courte (toast, pot, « un petit mot ») | [OBSERVÉ] lettres, étape 6 de Boulot (le nombre de pages publiques [PISTE] ne compte pas) | 4 + 1 | 5 |
| Commerces, voisins, transports | [OBSERVÉ] carnet « quotidien » 6 | 4 + 1 | 5 |
| **Total** | | 48 + 4 + 8 | **60** |

  Les 5 situations d'entrée (4.2) sont écrites d'abord et **comptent dans ces volumes**, rattachées à un univers [HYPOTHÈSE d'affectation, fixée à l'étalon E1] : Observateur, soirée ; Storyteller, amis ; Punchlineur (la scène universelle), amis ; Absurde, boulot ; Taquin, coloc (la poêle). La scène universelle (« ni bureau ni études ») est rangée en « amis » par simple choix de rangement : elle se lirait aussi sous « commerces » ou « famille ». **Garde-fous de ton** : rencontre, « taquiner, ne jamais insister » ; prise de parole [PISTE, à confirmer], « humour d'affection, 3 à 5 minutes, jamais aux dépens d'un invité » ; toutes, la règle « on rit avec, pas contre » (2.2). Les 5 situations de prise de parole se lisent « quoi dire » et entrent dans la rafale sous la forme « Ta première phrase d'abord » (2.2).
- **Persona (cas d'essai)** : Yanis, au dîner de coloc du dimanche, quand un colocataire sort une poêle de l'évier devant les autres ; Sophie, à la machine à café, face à « ça va ? » ; Marc, chez un ami, quand on lui demande « alors, quoi de neuf ? » [HYPOTHÈSE de scène].
- **Exemple complet, trois registres [EXEMPLE NON VALIDÉ, candidat d'étalon E1, à passer à l'aveugle avant tout usage]** :
  - Scène : dimanche, 19 h, coloc. Ton colocataire sort la poêle de l'évier, la tient au bout des doigts devant les deux autres : « Quelqu'un connaît le propriétaire de cette poêle ? Elle est là depuis jeudi. »
  - La sûre : « Elle est à moi. Je la laissais refroidir, c'est tout. »
  - La joueuse : « Je ne voulais pas la déraciner : elle s'est bien intégrée. »
  - La risquée : « Elle est à moi. Dis-moi plutôt à qui sont les trois verres qui vivent dans ta chambre. » (elle vise un comportement du moment, pas la personne ; elle gagne seulement si le colocataire vit lui aussi dans le désordre)
  - Pour choisir : après des semaines de remarques sur le ménage, la sûre reconnaît sans t'excuser trois fois. Si les colocs rient déjà de ces dimanches, la joueuse. La risquée seulement si ton colocataire vit lui aussi dans le désordre : sinon elle sonne comme un reproche.
  - Erreur courante : nier d'abord (« ce n'est pas la mienne »), puis t'excuser plusieurs fois. La réplique arrive pendant que tu rangeais déjà.
  - Deux contextes de rafale : (1) « Les colocs rient déjà de ces dimanches » : la joueuse. (2) « Ton colocataire vient lui-même de laisser sa vaisselle trois jours » : la risquée.
  - À toi, marche 1 : tiens une poêle ou un autre objet à bout de bras et dis la sûre à voix haute, sans sourire. Marche 2 : envoie à un proche un message qui avoue, sur le ton de la sûre, une petite négligence de ta semaine. Marche 3 : au prochain petit désordre que tu as toi-même laissé, dis la joueuse en face.
  - Retour : « Pas essayé », « Essayé, bof », « Essayé, ça a marché ».
- **Exemple, rencontre [EXEMPLE NON VALIDÉ, candidat d'étalon E1, garde-fou « taquiner, ne jamais insister »]** : premier verre, l'autre fixe la carte depuis trois minutes et lâche : « Désolé, je suis nul pour choisir. » La sûre : « Pas de souci, j'ai tout mon temps. » La joueuse : « Je te laisse jusqu'au dessert, pas plus. » La risquée : « Si on se revoit, c'est moi qui réserve. Je te promets un menu à deux plats. » (le trait taquine son indécision sans le viser ; elle suppose un second rendez-vous, donc elle ne passe que si l'autre a déjà ri et pris le jeu ; sinon la sûre.) Pour choisir : la risquée seulement si le rire est déjà là ; une seule fois, jamais deux, et si ça ne prend pas, tu laisses tomber.
- **Exemple, prise de parole [EXEMPLE NON VALIDÉ, « Ta première phrase d'abord »]** : pot de départ de Jérôme, « Allez, un petit mot ! ». Trois ouvertures. La sûre : « Je serai bref : il y a des chips qui n'attendront pas. » La joueuse : « Jérôme part, et c'est moi qu'on envoie parler : première fois qu'il me laisse le dernier mot. » La risquée : « Je voulais dire des choses profondes, mais Jérôme m'aurait coupé au deuxième mot. » (elle ne vaut que devant un public proche qui connaît cette habitude, et avec affection). Contexte 1 : public proche, la joueuse. Contexte 2 : public large, la sûre.
- **Exemple de carte « Et toi ? » (production), tiré du carnet (`2026-11-03`)** : « Mardi à la boulangerie, la boulangère emballe ton troisième pain au chocolat de la semaine : "Vous n'aviez pas arrêté le sucre, vous ?" » Ta réponse d'abord. « Tu avais une réponse ? » (Oui, À moitié, Rien). Puis les deux répliques : en ambiance détendue, « Dans toutes les autres boulangeries, je suis irréprochable. » ; en ambiance tendue, « Vous avez bonne mémoire. J'essaie de réduire, et cette semaine, ce n'est pas une réussite. » Puis le « pourquoi » du carnet. Aucun choix à faire : l'ambiance donnerait la réponse.
- **Widget** : le seuil de 90 du 24/10 est celui de « La réplique du jour » du widget, pas celui de l'espace ; la fiche complète reste Premium.

### 3.4 Comment c'est construit

- **Définition** : un mécanisme de vanne démonté en deux temps (installer, casser) puis refait par l'abonné.
- **Persona** : Yanis cherche, avant le repas de coloc, comment lancer un aveu minuscule sur lui sans que ça sonne comme une excuse ; Sophie veut un gabarit de dix secondes pour la machine à café ; Marc, quand un ami lui demande des nouvelles, veut pouvoir lâcher un aveu léger plutôt que le résumé de sa vie.
- **Format** : 5 minutes, 200 à 250 mots, schéma en une ligne, un exemple, un geste d'écriture, la grille de 2.4.
- **Volume** : 12 mécanismes, une fiche maîtresse par notion : callback, escalade comique (avec l'exagération contrôlée, fusionnées), faux secret avec son aveu minuscule, règle de trois, détournement, contraste, litote, fausse logique, détail trop précis, chute qui retourne le début, **raconter en une phrase** (le titre-résumé), combinaison de deux mécanismes. Vocabulaire et Formules y renvoient.
- **Noms de techniques** : cités seulement ici et dans Vocabulaire, jamais dans les situations ni les étapes.
- **Exemple [EXEMPLE NON VALIDÉ], source : étape 1 de Machine à Café, quiz validé** :
  - Le mécanisme, le faux secret : « Ça reste entre nous : » puis un aveu minuscule, sur toi, dit avec la gravité d'un scandale.
  - Une version qui marche : « Ça reste entre nous : je dis "je regarde ça" sur tout ce que je ne regarderai jamais. »
  - La règle : un seul aveu, court, sur toi, avec un détail que tout le monde reconnaît.
  - Erreur courante : ajouter « non mais je rigole » juste après.
  - À toi : écris ton faux secret en trois essais, puis passe la grille.
  - **Une version qui ne marche pas, et pourquoi** (tirée du même quiz) : « Ça reste entre nous : le nouveau stagiaire dit "pas de souci" à tout, même à ce qu'il ne comprend pas. » Elle échoue à la question 2 de la grille : le stagiaire n'est pas là, il ne peut pas en rire avec toi.

### 3.5 Vocabulaire

- **Définition** : le jargon utile pour parler d'humour, un mot par entrée. **40 mots** : les 12 du glossaire public plus 28 mots neufs. Thomas l'a nommé le 12/11 ; des recherches de définition sont mesurées sur Google (section 0.2) et servies par le glossaire public ; le vocabulaire de l'espace est Premium. Aucune réduction proposée.
- **Format** : une fiche = 5 mots d'un thème, 5 minutes, soit 8 fiches. Chaque entrée : une ligne neuve qui dit le mot en clair, un exemple en deux temps, « à ne pas confondre avec », un lien vers la définition complète (glossaire pour les 12, fiche maîtresse de construction sinon). Les définitions du glossaire ne sont pas recopiées.
- **Règle** : un mot qui a une fiche maîtresse dans Comment c'est construit n'est jamais l'exemple de Vocabulaire ; chaque mot a un emploi attesté vérifié ; aucun mot de scène (open mic, plateau, flop).
- **Persona** : Yanis, un samedi chez ses potes, entend « c'est un callback » devant une vidéo et ne sait pas de quoi on parle ; Sophie veut nommer ce qu'elle fait quand elle rebondit sur le mot d'un collègue ; Marc regarde du stand-up avec un ami et veut suivre la conversation.
- **Exemple de fiche, une entrée écrite, alignée sur le glossaire (`glossary.ts` l. 79) [EXEMPLE NON VALIDÉ]** : « Accusé de réception. Une formule courte, "Intéressant", "Pas faux", "Bien vu", que tu dis avant ta vraie réponse : tu gagnes quelques secondes et tu as l'air de réfléchir. En deux temps : il te lance "Tu as encore oublié ton badge ?" ; tu dis "Bien vu.", tu laisses passer deux secondes, puis tu réponds. À ne pas confondre avec : l'excuse ("oui, pardon"), qui répond avant d'avoir pris le temps. Définition complète : /glossaire. »

### 3.6 Formules à détourner

- **Définition** : une expression que tout le monde connaît, dont tu gardes la forme et dont tu remplaces le sujet par un détail précis et reconnaissable de ta vie.
- **Règle unique, vraie des exemples** : garde la forme de l'expression ; remplace son sujet par un détail précis et reconnaissable de ta vie ; **une suite qui confirme l'expression sans rien changer n'est pas un détournement**.
- **Persona** : Sophie en cherche une pour clore sa journée de réunions ; Yanis, pour un message de groupe où il veut se glisser sans risque ; Marc, pour un toast léger à un dîner.
- **Format** : 5 minutes, 5 expressions par fiche : la règle, le piège (changer la forme : personne ne reconnaît l'expression), la limite (la suite tient en une douzaine de mots), le geste d'écriture, une version possible.
- **Volume** : 12 fiches, 60 détournements [HYPOTHÈSE], chacun passe la barre Alexa.
- **Exemple de fiche, deux détournements et un contre-exemple écrits [EXEMPLE NON VALIDÉ, à passer à l'aveugle à l'étalon E2 ; remplacés s'ils échouent]** :
  - Un détournement qui marche (forme gardée, sujet remplacé) : « Chassez le naturel, il revient au galop. Chassez le "on se voit bientôt", il revient chaque fin d'été, intact. »
  - Un second détournement (même règle) : « Qui sème le vent récolte la tempête. Qui sème des "je réponds plus tard" récolte une boîte de 4 000 messages. »
  - **Une suite qui ne détourne rien, et pourquoi** : « Mieux vaut tard que jamais, dit celui qui souhaite un bon anniversaire en mars. » La suite confirme l'expression (le retard) sans rien changer, et repose sur un anniversaire qu'on ne connaît pas.
  - Piège : changer la forme ou commencer par le détail ; l'expression n'est plus reconnue.
  - À toi : choisis une expression, garde sa forme, remplace son sujet par un détail de ta semaine, puis passe la grille.

### 3.7 Écouter, repérer

- **Définition** : un passage court (1 à 2 minutes) d'un humoriste, démonté puis transposé à la vie de l'abonné (le format B des lettres appliqué aux vidéos du site, avec d'autres passages et d'autres textes ; aucun texte de lettre repris).
- **Persona** : Yanis revoit avec ses potes un passage qui l'a fait rire et veut savoir pourquoi la salle part à cet instant ; Sophie veut reprendre un mécanisme pour le pot de départ d'un collègue ; Marc regarde seul le soir et veut une raison de rire qui lui laisse quelque chose à essayer le lendemain.
- **Format** : le passage (minute et seconde exactes), ce que l'artiste fait (3 observations), pourquoi c'est efficace (une idée), ta version à toi, la grille de 2.4.
- **Volume** : 12 en V1, puis 1 à 2 par mois en session [HYPOTHÈSE : 1 par mois sur un an ; la vérification est le facteur limitant].
- **Règles** : humoristes récents proches de l'audience (25/10), nommés et cités sans réserve (P0 du 05/10), citation réelle et courte, jamais de citation inventée. Prérequis en 7.5. **L'étalon E4 est le premier à produire des phrases réelles, avant le lot 1.**
- **Exemple [EXEMPLE NON VALIDÉ, structure seule : un passage ne s'écrit qu'après visionnage et vérification]** : passage candidat : Karim Duval, « Génération Y » (le « pourquoi » du seed : détournement de jargon corporate en humour). Minute : [à relever]. À toi : prends un jargon de ton boulot ou de ta fac, dis-le avec un sérieux total, puis ajoute un détail qui le trahit.

### 3.8 Quand ça tombe à plat

- **Définition** : une fiche courte pour la minute d'après : une réplique qui ne prend pas, un silence, une phrase dirigée contre toi, un blocage. Même structure que Quoi répondre (3 sorties), retrouvée avec le filtre « rattraper un faux pas ».
- **Persona** : Yanis, sa vanne tombe à plat devant les colocs et personne ne dit rien ; Sophie, le silence en réunion après sa phrase ; Marc, au dîner, quelqu'un le reprend sur ce qu'il vient de dire.
- **Volume** : **10 fiches**, 30 sorties (comptées en 7.3) : le silence après ta vanne, quand ça ne prend pas, quand tu es la cible, quand tu as dit la mauvaise chose, quand on te corrige en public, quand on te coupe, quand tu oublies la chute, quand tu veux sortir de la conversation, **« Le blanc »** (tu te bloques : reprendre son souffle, l'accusé de réception, la sortie polie, et **le silence comme choix** : se taire vaut mieux qu'une réplique forcée) et **« Lire la salle et savoir s'arrêter »** (trois signaux observables, la règle « une fois pour lancer, une fois pour clore »). Les deux dernières répondent à des pistes publiques [PISTE, à confirmer].
- **Exemple [EXEMPLE NON VALIDÉ, candidat d'étalon]** : « Ta vanne tombe à plat devant les colocs, trois secondes de silence. La sûre : "Celle-là demandait un deuxième café." La joueuse : "Je la garde pour la version deux." La risquée : "Je vous laisse jusqu'à trois pour trouver ça drôle. Un." Pour choisir : la risquée met les autres au défi : réservée aux groupes qui te connaissent, et à dire avec le sourire. » Retour : « Essayé, bof » arrive ici ; « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » mène à Mes questions.

### 3.9 Jeux

- **Définition** : un défi de 3 à 5 minutes qui fait pratiquer une compétence, avec « ce qu'on aurait pu dire ».
- **Persona** : Yanis, 5 minutes dans le tram avant les cours, sur son téléphone ; Sophie, 5 minutes entre deux réunions ; Marc, un soir chez lui, quand le silence de l'appartement pèse.
- **Familles (30)** : « Quelle réplique ? » (reprend des situations existantes avec un autre contexte, aucune réplique neuve) ; « Finis la phrase » (même mécanique que le défi de l'app, 04/11) ; « Trouve l'angle » ; « Change de registre » ; « Remets la chute » ; « Les pires réponses ».
- **Où ils vivent** : la page « S'entraîner » (jeux, séances, missions), avec une entrée dans le menu « Plus » (6.2) et une carte dans « Aujourd'hui », et un lien « À toi » depuis chaque fiche et chaque étape.
- **Exemple [EXEMPLE NON VALIDÉ] : « Trouve l'angle »** : « Objet : le frigo de la coloc. Note trois choses vraies sur lui, pas des blagues. Ce qu'on aurait pu relever : 1) un pot de moutarde dont personne ne se souvient de l'achat ; 2) une étiquette "ne pas toucher" collée sur quelque chose de périmé ; 3) tout le monde connaît celui qui laisse la porte entrouverte, et personne ne le nomme. L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. La blague vient ensuite, de ce que tu fais de lui. »

### 3.10 Le bilan du parcours (allégé)

- **Définition** : un point d'étape à la fin d'un parcours, sur le ton « refais une situation » : choisir et dire, pas seulement reconnaître. Pas un examen : aucune demande d'évaluation n'a été trouvée et le « scolaire » est une crainte de marque. Ce qui le justifie : la décision du 07/10 (bilan de fin de parcours sans certificat) et le besoin de voir sa progression [SUPPOSÉ]. Ce n'est pas un contenu nommé par Thomas ; il peut en remettre 6 questions.
- **Format** : **4 éléments** : 2 « laquelle ressortir ici ? » construites sur le contenu **du parcours** (ses vannes, ses situations, ses défis) avec un contexte ; 1 « remets dans l'ordre » ; 1 « dis-la à voix haute » (déclaré). **Texte neuf compté (7.3)** : le contexte de chaque question (10 en tout) ET le texte de retour de chaque question (10 pour les « laquelle », 5 pour les « ordre », soit 15) ; aucune réplique neuve. **Règle d'écriture du contexte : il ne reprend aucun mot de la bonne réponse.** Pas de note, pas de seuil, pas de certificat. Une erreur renvoie vers la fiche à revoir : « celle-là mérite un deuxième tour ».
- **Persona** : Sophie, à la fin de Machine à Café, veut savoir si elle placerait sa vanne au bon moment ; Marc veut une mesure concrète de sa progression, sans note ; Yanis la prend à son rythme, sans public.
- **Volume** : 5, un par parcours, comptés comme fiches du parcours.
- **Deux éléments écrits, bilan de Machine à Café [EXEMPLE NON VALIDÉ]** :
  - « Laquelle ressortir ici ? » (les trois vannes sont des vannes de l'étape 1, `parcours-seed.json` l. 35, 36 et 37 ; seuls le contexte et le retour sont neufs) : « Pause café. Un collègue raconte, accablé, sa journée de réunions qui n'en finit pas, et le groupe rit jaune. Laquelle ressortir ? A) "Je suis nul en small talk. Quelqu'un m'a dit « il fait beau »." B) "Avec un collègue, on a enfin comparé nos salaires." C) "Je suis en copie de 90 mails par jour. Hier, j'ai répondu à un." » Retour : « C. Elle prolonge ce que le groupe vit déjà, le trop-plein du boulot, en une phrase, avec un chiffre que tout le monde reconnaît. A et B sont bonnes, pour un autre moment de la pause. »
  - « Dans l'ordre » (matière : quiz de Machine à Café, étape 1) : « Remets dans l'ordre : a) tu lâches l'aveu ; b) tu te penches et tu dis "Ça reste entre nous :" ; c) tu t'arrêtes net. » Retour : « b, a, c. Le silence final fait le reste. »

### 3.11 Séance de 20 minutes

- **Définition** : une séance guidée hors écran (seul ou avec un pote). Le coaching en direct n'existe pas chez nous (supprimé le 13/10) : c'est un exercice long, sans écran, que le site ne reçoit pas.
- **Format** : 3 minutes d'échauffement, 5 d'observation, 8 d'essai, 4 de bilan (20 minutes). Rien n'est enregistré.
- **Persona** : Marc la fait seul chez lui avant d'oser en face ; Yanis la fait avec un colocataire de confiance ; Sophie la fait sur son trajet du soir, à voix basse.
- **Volume** : 6 (1 au palier 2, la semaine 3 ; 5 au palier 3).
- **Exemple [EXEMPLE NON VALIDÉ], tiré du carnet de novembre : « Dix chambrages, dix secondes »** :
  - Échauffement (3 min) : lis à voix haute les trois répliques d'une fiche de « Quoi répondre ».
  - Observation (5 min) : lis dix phrases qu'on te dit, par exemple « Il n'en reste que deux, hein. », « Vous n'aviez pas arrêté le sucre, vous ? », « Ça y est, ils ont rallumé le chauffage collectif ! » (champ « on te dit » du carnet).
  - Essai (8 min) : à chaque phrase, réponds à voix haute en dix secondes ; tu peux t'enregistrer sur ton téléphone, le site ne reçoit rien.
  - Bilan (4 min) : la grille de 3 questions sur la réplique que tu as préférée.


## 4. Le chemin de l'abonné dans le temps (une seule source)

### 4.1 Calendrier type des 4 premières semaines

Tout reste ouvert (18/10) : c'est un ordre conseillé, jamais un verrou. Ce tableau est la SEULE source ; 4.2, 4.3 et 5.4 en dérivent. Il est identique pour tous les abonnés ; seuls changent la scène d'entrée et le parcours conseillé (4.2). Les durées d'étape sont des **estimations de lecture, à chronométrer** avec un lecteur.

| | Semaine 1 | Semaine 2 | Semaine 3 | Semaine 4 |
|---|---|---|---|---|
| Rafale (tous les jours, facultative) | 1 situation nouvelle par jour : les 5 premières sont « Les 5 situations pour commencer » | idem | idem | idem |
| Situations nouvelles vues (au plus) | 7 | 7 | 7 | 7 |
| Premier pas | Jour 1 : la situation d'entrée ou la fiche courte (5 min, marche 1) ; puis une seule fois « Où veux-tu être plus à l'aise ? » si Thomas le retient (C9 B) | | | |
| Parcours conseillé (4.2 : réponse au geste, puis étape d'origine, puis quiz, puis parcours d'origine sans étape, puis défaut) | aucun (facultatif) | étape 1 (étape 2 si l'abonné vient de l'étape 1 gratuite) | étape suivante (date conseillée 7 jours après la dernière validation) | étape suivante ; **bilan seulement si le parcours a 3 étapes (Machine à Café)** ; Répartie en a 4, les autres 6 |
| Mécanisme | « Le faux secret » (Comment c'est construit) | un mot ou deux de Vocabulaire, au choix | | |
| Séance de 20 minutes | | | la première, facultative | |
| Écouter, repérer | | | | le premier, facultatif |
| Mission, marche visée | 1 | 2 | 3 | 3 |
| Mes questions | à tout moment, jamais demandé | idem | idem | idem |
| **Temps maximum, cœur annoncé de l'étape (15 min Machine à Café et Boulot, 20 min Répartie, Confiance, Storytelling)** | rafale 35 + mécanisme 5 = environ 40 min | rafale 35 + étape 15 à 20 + vocabulaire 5 = 55 à 60 min | rafale 35 + étape 15 à 20 + séance 20 = 70 à 75 min | rafale 35 + étape 15 à 20 + écoute 7 = 57 à 62 min |
| **Temps maximum, étape complète (estimée sur Machine à Café : 24 min)** | 40 min | 64 min | **79 min** | 66 min |

Avec le seul cœur des étapes, le total hebdomadaire va de 40 à 75 minutes ; avec les étapes complètes, de 40 à 79. **Le cœur de l'étape est ce que la promesse « 15 à 20 min/semaine » couvre** ; tout le reste est facultatif, et l'ordre est conseillé, jamais un verrou. La rafale est de 3 à 5 minutes par jour, jamais plus. Ces durées sont posées à Thomas dans C2. La **marche visée** n'est pas une marche imposée (2.4). **Palier** : P1 = jour 1 ; P2 (« prendre le pli ») = semaines 1 à 4 ; P3 (« aller plus loin ») = après la semaine 4.

**Règle du « jour 7 »** : la date conseillée de l'étape suivante n'existe qu'après une première validation (`nextRecommendedAt`). Pour un abonné sans étape validée, « Aujourd'hui » propose « Commencer l'étape 1 » sans date, jamais « en retard ».

### 4.2 Les signaux : deux ordres distincts

**Principe commun** : un profil tiré de la personne (réponse à un geste, quiz) vaut mieux qu'un parcours tiré de la page d'où elle vient quand cette page n'est pas un choix de l'abonné. Un parcours déduit d'un article est une correspondance faite par le site, pas un choix.

**Ce que le produit connaît réellement** :
- **Le lien de retour (`returnTo`)** : l'abonné vient d'une fiche du catalogue, d'une étape de parcours (`#etape-N`, il l'a vraiment ouverte) **ou d'un parcours** (sans étape). **Depuis un article du blog**, le bouton d'abonnement transmet **le parcours associé à l'article** (`returnTo=/parcours/<parcours>`, `lib/blog-parcours.ts`) ; **l'article lui-même n'est que dans `src=blog-<slug>`, relayé jusqu'à `/register` mais jamais transmis au paiement** (faits de code en tête de document). Aujourd'hui, **le seul signal d'article qui arrive dans l'espace est donc le parcours associé**, et un abonné venu d'un article est traité comme « lien de retour vers un parcours ».
- **Ce que vaut ce parcours** : six clusters sur neuf mènent à repartie (le défaut), dont celui de l'article n°1 (blagues, dans `fort-volume`), donc `/parcours/repartie`. **Règle : `/parcours/repartie` sans étape équivaut à « pas de signal »**, car le produit ne peut pas distinguer « repartie par cluster » de « repartie par défaut ». **Cette règle n'est neutre que si C11 = A (défaut Répartie)** : sous C11 B ou C, un abonné venu de l'article de blagues ou d'un article sur la répartie, que le site rattache exprès à Répartie, ou qui avait choisi la page Répartie, reçoit un autre parcours ; le coût est accepté (le geste de C9 B et le quiz le corrigent). Seuls apportent une information un parcours **autre que repartie** (`douleurs-personas` : confiance ; `humour-contexte` : boulot ; `saisonnier` : machine-a-cafe ; les deux articles « faire rire » : confiance, par la table par slug) et, bien sûr, une étape ou une fiche d'origine.
- **Part de l'article, chez les visiteurs et chez les abonnés** : 79,7 % des clics Google arrivent sur un article de blagues **[MESURÉ V]**, mais le passage de l'article à l'abonnement a été presque vide : 0 clic sur 69 vues d'encarts d'article (s21), 3 vues de `/abonnement` la semaine du 26/10. **La part des abonnés venus d'un article est inconnue et probablement faible** ; l'effet d'une entrée personnalisée par l'article est **[SUPPOSÉ]**.
- **Le résultat du quiz d'humour, sur le même appareil seulement** (`localStorage`, jamais en base ni sur le compte). Le rattachement du profil au compte est une option (C9 C).
- **Une réponse explicite**, si Thomas la retient (C9 B) : « Où veux-tu être plus à l'aise ? » (**entre potes, au boulot, pour plaire, partout**), posée **une seule fois, à tout le monde**, juste après le premier pas, même à ceux qui ont un résultat de quiz ; élément secondaire dans « Aujourd'hui », jamais l'action principale.

**Page d'arrivée après connexion et après paiement : question Q8 du brief, pas encore posée à Thomas** (posée ici en C14). Aujourd'hui, après le paiement, l'abonné arrive sur son `returnTo` (sinon `/parcours`), avec le message de bienvenue. **Règle recommandée** (C14 C) : un `returnTo` vers un contenu précis (une fiche, une vanne, un conseil, une vidéo, une étape) est honoré, avec **un bandeau unique « Ton premier pas : … » la première fois, qui désigne le geste sur la page même** (par exemple « Ton premier pas : l'exercice ci-dessous », lien d'ancre vers l'exercice), « Aujourd'hui » restant un lien secondaire du bandeau ; un `returnTo` vers un parcours sans étape, vers une page publique ou absent mène à « Aujourd'hui », qui montre le premier pas de l'ordre 1 ; après une connexion, la page d'arrivée est « Aujourd'hui ». **La page de succès reste affichée avec un bouton « Continuer », sans redirection automatique** (le message de bienvenue et « Renoncer au contrat ici », D.221-5, restent lisibles) ; l'e-mail de bienvenue E0 reste inchangé.

**Ordre 1, la scène d'entrée du jour 1** (toujours moins de 5 minutes) : lien de retour vers un contenu précis (fiche, étape), puis quiz (même appareil), puis lien de retour vers un parcours sans étape (hors repartie), puis scène par défaut.

| Signal | Situation d'entrée (premier pas) [HYPOTHÈSE, à écrire à l'étalon E1] |
|---|---|
| Lien de retour : une vanne, un conseil ou une vidéo du catalogue | son exercice (« À toi de jouer » ou défi), la fiche elle-même |
| Lien de retour : **une étape de parcours** | **la plus courte fiche à geste de cette étape** (le conseil et son défi, 4 minutes, ou la situation liée, 5 minutes) ; l'étape entière devient « Commencer l'étape » conseillée dès le jour 2 ; si c'est l'étape 1 gratuite, l'étape conseillée de la semaine 2 est l'étape 2 (4.1) |
| Lien de retour : une autre page publique | pas de signal : on passe au quiz, puis à la scène par défaut |
| Quiz : Observateur | « Tu arrives dans un groupe où tu connais presque personne et on te lance "et toi, tu fais quoi ?" » (terrain de Confiance) |
| Quiz : Storyteller | « Quelqu'un te demande "alors, quoi de neuf ?" » |
| Quiz : Absurde | « Le collègue qui lance "ça va ?" à la machine à café » |
| Quiz : Punchlineur | « Quelqu'un te lance "tiens, tu as changé quelque chose, non ?" » |
| Quiz : Taquin | « Quelqu'un te chambre devant tout le monde en coloc » (la poêle, 3.3) |
| Lien de retour : **un parcours sans étape, autre que repartie** (par exemple celui associé à un article) et **aucun quiz** | **la première fiche à geste de l'étape 1 de ce parcours, de 5 minutes au plus, hors fiche 0** (pour Machine à Café : le conseil et son défi, 4 minutes) ; parcours conseillé : ce parcours (ordre 2) |
| **Aucun signal** (dont `/parcours/repartie` sans étape) | **« Quelqu'un te lance "tiens, tu as changé quelque chose, non ?" »**, scène universelle (ni bureau ni études), neuve ; elle ne reprend aucune fiche du carnet |

**Entrée personnalisée par l'article : HORS V1, tranchée par la règle de priorité (0.1).** Le besoin visiteur est mesuré (79,7 %), mais l'effet chez les abonnés est [SUPPOSÉ] (0 clic sur 69 vues d'encarts) : au niveau « quoi écrire » il vaut +0, au niveau « ce qui passe devant » il n'existe aucun [MESURÉ A]. On n'écrit donc pas une table d'entrée par article en V1 ; le parcours associé du `returnTo` et le repli ci-dessus suffisent. **Elle n'est construite que si la mesure de 7.7 (point 3) montre une part notable d'inscriptions venues d'un article** (seuil à fixer par @data-analyst). Elle demanderait alors deux développements, interrupteur fermé : (a) **faire suivre la source de l'article (`src`, ou sa catégorie) à travers le paiement** (métadonnées de la session de paiement et adresse de retour [HYPOTHÈSE technique, à trancher par @fullstack], phrase de @legal si la source est retenue sur le compte, 7.5 d) ; (b) **une petite correspondance PAR ARTICLE (slug vers catégorie de premier pas), seconde table assumée** : elle est de catégorie et non de parcours (la table article-parcours n'est pas doublée), maintenue à la main, **limitée aux articles qui apportent une information au-delà du parcours par défaut** : au plus une douzaine de lignes [HYPOTHÈSE, nombre d'articles à lire]. Le cluster ne peut pas servir de catégorie (un cluster donne un parcours : `fort-volume` regroupe blagues, phrases drôles et « faire rire »). Table cible, **à construire seulement si déclenchée** (le premier pas reste sous 5 minutes) [HYPOTHÈSE de correspondance] :

| Article (par slug) | Premier pas |
|---|---|
| Blagues (« meilleures blagues 2026 », « créer ses propres blagues », « blague humour noir ») | **la vanne du contenu du jour avec le toucher « Ce soir, c'est plutôt ? » déjà réglé sur la catégorie de l'article** (SOIREES, BOULOT, PARENTS, DATING…, sinon « peu importe ») et son « À toi de jouer » ; l'humour noir seulement si Thomas le retient (C12) ; puis passage vers « Quoi répondre ». **Si C13 = C** (pas de toucher dans « Aujourd'hui »), le premier pas ouvre la Bibliothèque sur le thème de la catégorie de l'article et la fiche d'une vanne, avec le même « À toi de jouer » |
| Faire rire un homme ou une fille, couple (parcours Confiance par slug) | première situation « rencontre » ou « couple », garde-fou de ton |
| Phrases drôles en conversation, répondre aux moqueries | première situation du filtre « répondre à un chambrage » |
| Autodérision (aucun cluster) | la fiche « Le faux secret » (5 minutes) |
| Boulot, machine à café | première situation « boulot » |
| Storytelling (aucun cluster) | le mécanisme « raconter en une phrase » |
| Autre article | pas de signal : le parcours associé suffit |

**Ordre 2, le parcours conseillé de la semaine 2** : réponse explicite (si donnée), puis **étape d'origine**, puis **quiz (même appareil)**, puis **parcours d'origine sans étape (autre que repartie)**, puis parcours par défaut. Le parcours d'un article est celui de `lib/blog-parcours.ts`, déjà dans le `returnTo` ; il passe après le quiz.

| Signal | Parcours conseillé de la semaine 2 |
|---|---|
| Réponse explicite « entre potes » | Répartie |
| Réponse explicite « au boulot » | Machine à Café |
| Réponse explicite « partout » | Confiance |
| Réponse explicite « pour plaire » | **pas de parcours** ; le parcours reste celui de l'étape d'origine, du quiz, sinon le défaut ; **la prochaine situation nouvelle de la rafale est une situation de rencontre, une seule fois, puis l'ordre normal reprend** (2.2) |
| Lien de retour vers une étape de parcours (ou vers un conseil ou une vidéo qui est rattaché à une étape de parcours : le parcours de cette étape compte alors comme étape d'origine [À VÉRIFIER : rattachement existant dans les données]) | ce parcours ; **si l'abonné vient de l'étape 1 gratuite, l'étape conseillée est l'étape 2** |
| Quiz : Observateur | Confiance (INTERMEDIAIRE, 6 étapes, 20 min) |
| Quiz : Storyteller | Storytelling (machine-a-cafe si Storytelling n'est pas publié) |
| Quiz : Absurde | Machine à Café (DEBUTANT, 3 étapes, 15 min) |
| Quiz : Punchlineur, Taquin | Répartie (INTERMEDIAIRE, 4 étapes, 20 min) |
| Lien de retour vers un parcours sans étape, **autre que repartie** (dont le parcours associé à un article), sans quiz | ce parcours |
| **Aucun signal** (dont `/parcours/repartie` sans étape) | **parcours par défaut : question C11** |

Une préférence déclarée aujourd'hui vaut mieux qu'un profil déduit il y a trois semaines : la réponse explicite passe avant le quiz pour le parcours, pas pour la scène du jour 1, où elle n'existe pas encore. **Le geste « partout » est le moins précis des quatre** : il envoie vers Confiance (INTERMEDIAIRE, 6 étapes, 20 minutes), voulu pour un abonné comme Marc, mais il attirera sans doute beaucoup d'abonnés prudents ; la répartition des réponses est à mesurer au lot 1 ; « Parcours » montre toujours Machine à Café en une ligne, sans relance. **Les 5 situations d'entrée des 5 profils sont « Les 5 situations pour commencer »**. Jamais « choisis un parcours » au jour 1 (cause H2 de l'analyse des résiliations).

La règle du brief §3.2 (n°2 : « la première étape du parcours désigné par le quiz ») est modifiée : le premier pas est une situation d'entrée ou une fiche courte (moins de 5 minutes), l'étape 1 du parcours désigné devient la première étape conseillée (semaine 2). L'événement « aha » du brief devient « Fait » déclaré du premier pas : à confirmer avec @data-analyst et avec Q10 du brief. Part des abonnés qui arrivent avec un signal : inconnue [À VÉRIFIER avec @data-analyst].

### 4.3 Les personas, cas d'essai recalés sur ce que le produit ferait

Les personas servent à écrire et à tester ; ils ne déclenchent rien. Pour chacun, ce que le produit ferait réellement (ordre 2) et la question de test :

| Cas d'essai | Ce que fait le produit | Question de test |
|---|---|---|
| Yanis (coloc, soirées, potes) | Geste « entre potes » : Répartie ; sinon quiz Taquin ou Punchlineur, même appareil : Répartie ; sans signal : parcours par défaut (C11) | L'étape 1 de Répartie est-elle accessible à un débutant ? (étape gratuite validée par Thomas le 07/10 ; son niveau pour un débutant reste à tester) |
| Sophie (machine à café, afterwork) | Geste « au boulot » : Machine à Café, **même si le quiz dit Observateur** ; sans geste, Observateur : Confiance (INTERMEDIAIRE, 20 min), alors que son besoin écrit appelle Machine à Café ; Absurde : Machine à Café | Confiance est-il bon pour Sophie quand elle n'a pas répondu au geste ? |
| Marc (reconstruction) | Geste « partout » : Confiance, **même si le quiz dit Storyteller** ; sans geste, Storyteller : Storytelling (INTERMEDIAIRE), alors que son besoin écrit appelle Confiance ; Observateur : Confiance | Storytelling convient-il à Marc quand il n'a pas répondu au geste ? |

On ne touche pas au code du quiz sans décision de Thomas. Aucune relance : si l'abonné n'ouvre pas l'espace, rien ne part.

### 4.4 Aujourd'hui : règle de priorité

Une seule action principale visible, quatre états (brief §3.2 : maximum 3 actions principales par écran) :
1. **Aucune fiche faite** : le premier pas.
2. **La rafale du jour n'est pas faite** : la rafale du jour (« Si tu as 5 minutes »).
3. **La rafale est faite** : « Reprendre » l'étape en cours (ou « Commencer l'étape 1 » sans date).
4. **Mission ouverte** : lien secondaire, jamais l'action principale.
Élément secondaire, une seule fois, après le premier pas (si C9 B est retenue) : « Où veux-tu être plus à l'aise ? », quatre boutons, jamais l'action principale, qui disparaît après la réponse.

**Composition de l'écran** (la forme de la vanne est la question C13 ; **défaut recommandé, option B de C13**) : (a) salutation et repère neutre « 12 cartes cette semaine » (ni série ni points ; affiché seulement à partir d'une carte) ; (b) l'action principale ; (c) **le contenu du jour du brief §3.2 : vanne, conseil et vidéo du jour ensemble, au même poids**, **dont la vanne porte le toucher « Ce soir, c'est plutôt ? » et « une autre »** (ci-dessous) ; il n'y a **aucune carte « Une vanne pour ce soir » séparée** : la même vanne n'apparaît jamais deux fois à l'écran. Option A de C13 : la vanne passe en tête du bloc, plus grande, avant le conseil et la vidéo ; option C : aucun toucher dans « Aujourd'hui », le contenu du jour est celui du brief et le tirage par catégorie reste dans la Bibliothèque. **Deux éléments distincts** : la vanne du contenu du jour (catalogue) et la situation nouvelle du jour (première carte de la rafale). En dessous : « L'équipe t'a répondu » (si une réponse n'est pas lue), S'entraîner (jeux, séances, missions), nouveautés (carnet du mois, date conseillée, lettre du jeudi), « Ton mois ».

**La vanne du contenu du jour et son toucher** (le besoin le mieux mesuré chez les visiteurs du site, **[MESURÉ V]** ; l'écart avec les abonnés est inconnu, et seul un [MESURÉ A] pourra la faire monter, 0.1) :
- **Le toucher « Ce soir, c'est plutôt ? », spécifié comme composant** :
  - une rangée de puces, une par catégorie proposée plus « Peu importe » (soirée, boulot, famille, rencard : appuyées sur `JokeCategory`, SOIREES, BOULOT, PARENTS, DATING) ; « Peu importe » est choisi par défaut et correspond à la vanne du jour ;
  - chaque puce est un bouton d'au moins 44 px de haut et de large, la rangée passe sur deux lignes à 375 px ;
  - la puce choisie est marquée autrement que par la couleur (coche et contour épais) et son état est exposé aux lecteurs d'écran (`aria-pressed`) ;
  - la vanne qui change est annoncée (région `aria-live` polie) et le focus reste sur la puce choisie ;
  - « Une autre » est un bouton de même taille, sous la vanne ;
  - une catégorie qui n'a pas assez de vannes tirables n'apparaît pas (seuil ci-dessous) ; **si aucune catégorie n'atteint le seuil, la rangée disparaît et seul « Une autre » reste** ;
  - rendu à 375 px à l'étalon E5, avec lecteur d'écran.
  **Aucun contenu neuf.** Toucher une catégorie **remplace la vanne affichée dans le même bloc** : la vanne du jour reste au calendrier, elle n'est jamais montrée en double.
- **Ordre de tirage de « une autre »** : dans la catégorie choisie, **d'abord les vannes de cette catégorie déjà servies au contenu du jour, puis les autres vannes actives de la catégorie**. **La restriction « jamais d'inédits » est levée** : les vannes inédites du calendrier (actives, jamais servies au contenu du jour) sont déjà visibles dans le catalogue public, les réserver ici ne protégeait rien. Le tirage ne marque aucune vanne comme servie au contenu du jour : **le stock d'inédits de l'alerte `/api/health` (décision du 18/10) n'est pas consommé**. La vanne affichée n'est jamais retirée une seconde fois.
- **Seuil minimal par catégorie** : une catégorie n'apparaît dans le toucher que si son nombre de vannes tirables (actives, hors la vanne affichée) atteint un seuil minimal. **Le nombre de vannes par catégorie est à lire en base avant l'étalon E5 [À VÉRIFIER], et le seuil est fixé sur cette lecture (@data-analyst, @fullstack) : aucun chiffre n'est inventé ici.** Une catégorie sous le seuil est absente, sans repli silencieux. Quand l'abonné a fait le tour d'une catégorie pendant la visite, « une autre » devient « Tu as fait le tour de celles-ci : ouvre la Bibliothèque » (lien vers le thème).
- **Sans répétition, sans donnée sur le compte** : la non-répétition vit **dans la mémoire du navigateur** (vannes déjà montrées pendant la visite), rien n'est gardé sur le compte ; d'un jour à l'autre, une vanne déjà vue peut revenir, ce qui est accepté. La répétition d'un jour à l'autre n'est pas mesurable sans identité : si elle devient un sujet (lots trop petits, messages dans « Mes questions »), la question à Thomas porte sur une liste par abonné, donnée par compte avec **une phrase de @legal en plus** (7.5 d) ; non retenu par défaut.
- **Ce qui est compté, sans identité** : un événement par toucher et par « une autre », avec la seule **catégorie** (aucun identifiant d'abonné, aucune vanne) : c'est le **capteur de la demande des abonnés par univers** (7.7), avec le rythme de tirage.
- **Geste** : « ressors-la à voix haute ce soir » (marche 1, facultatif, comme toute fiche à geste).
- Un lien vers les situations du même univers dans « Quoi répondre ».

**« Ton mois »** (à partir de J25 environ, absent tant que rien n'est fait) : situations jouées, étapes validées, missions tentées, et **la courbe de la répartie** : la part des cartes avec « Oui » avant d'avoir vu les répliques, semaine après semaine, « À moitié » à part, affichée à partir de 10 cartes [HYPOTHÈSE d'illustration : de 2 cartes sur 10 la semaine 1 à 6 sur 10 la semaine 8]. Auto-déclarée, donc indicative (2.2). Pas de pente colorée ; texte neutre si elle baisse. Elle ne compte ni pour la série ni pour les points.

### 4.5 Au-delà de la V1 : qui ajoute quoi

Règle du 25/10 déjà en place pour les lettres : un mois ajouté chaque mois, en session, jamais par tâche planifiée ni génération automatique. Chiffrage en 7.3 bis.

| Rythme | Quoi | Qui |
|---|---|---|
| Mensuel | Carnet du mois (30 fiches) ; environ 10 situations neuves ; 1 à 2 « Écouter, repérer » ; **lecture des étiquettes de scène et des événements « Ce soir, c'est plutôt ? »** (7.7) pour choisir les situations du mois, sans piloter le plan avant plusieurs dizaines de fils | @copywriter en session avec Thomas, même contrôle que les lettres |
| Trimestriel | 4 à 5 jeux neufs ; réévaluation des types peu utilisés (7.6) | @creative-strategy, @data-analyst |
| Alerte | Stock de situations non vues à 30 jours de la fin pour un abonné régulier ; stock d'inédits de vannes | @fullstack |


## 5. Parcours : découpage sans rien perdre, temps, niveaux

### 5.1 Principe

On garde les 5 parcours, leurs 25 étapes et leurs textes. Chaque étape devient un sous-parcours de fiches numérotées « Voir / Fait ». Aucun texte validé n'est réécrit (P0 s18, étalons s17 à s19). Les ancres `#etape-N` restent (les lettres approuvées y pointent), les fiches s'ajoutent en `#fiche-N-M`. Mesure du diff réel à chaque parcours (P0 s11). Compléments de Storytelling (second défi, phrase de protection) et de Boulot (« Version sans risque », « Aller au défi ») : conservés (INV T8).

### 5.2 Exemple complet : Machine à Café, étape 1

Blocs existants (`parcours-seed.json`) : scène, pourquoi, conseil « L'humour à la machine à café » avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré « Les relations amoureuses », Karim Duval « Génération Y »), quiz de 4 questions, 50 XP, gratuite. Durées : estimations INV 3.1 [HYPOTHÈSE], à chronométrer.

| N° | Fiche | Origine | Geste | Durée (estimée) | Cœur ou plus loin |
|---|---|---|---|---|---|
| 0 | Introduction du parcours (une seule pour les 3 étapes) | Assemblée depuis le seed : description, durée, rythme, accroche persona (textes validés, inchangés) ; **sans la scène « Imagine Léa »**, qui reste dans 1.1 | Choisir ton point de départ | 2 min | Cœur |
| 1.1 | Le conseil et son défi (scène « Imagine Léa » fondue en introduction) | Existant, inchangé | Le défi du conseil | 4 min | Cœur |
| 1.2 | Les 5 vannes | Existantes, inchangées | Choisir celle que tu ressortiras cette semaine | 2 min | Cœur |
| 1.3 | Écouter : des vannes enchaînées | Vidéo 1, Paul Séré | Repérer l'amorce et la chute | 7 min | Cœur |
| 1.4 | Écouter : détourner le jargon | Vidéo 2, Karim Duval | Repérer le mot détourné | 7 min | Plus loin (C2) |
| 1.5 | Le quiz de l'étape | Existant, inchangé | Répondre | 2 min | Cœur |
| 1.6 | Une situation liée : le collègue qui lance « ça va ? » | NEUVE, une des 60 de « Quoi répondre » | Choisir, dire (marche 1) | 5 min | Plus loin |
| 1.7 | Le faux secret, comment c'est construit | NEUVE, une des 12 constructions | Écrire ton faux secret | 5 min | Plus loin |

- **Rien n'est perdu** : conseil, défi, 5 vannes, 2 vidéos, quiz, scène et « pourquoi » sont tous là, mot pour mot.
- **Total de l'étape** : 7 fiches numérotées, plus la fiche 0 commune. **Cœur de l'étape 1** : 15 minutes estimées sans la fiche 0, **17 minutes avec**, si la vidéo 2 passe en « plus loin » ; environ 24 minutes sinon. La promesse de Machine à Café est de 15 min/semaine : le cœur tient à 15 minutes hors introduction et la dépasse de 2 minutes la première fois.
- **Le « Fait » de l'étape** (XP, série) reste celui d'aujourd'hui : défi du conseil et quiz.
- **C2 A touche le statut de vidéos choisies par Thomas** et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. ».
- **Les 4 autres parcours** : même découpage, à relire étape par étape avant écriture [À VÉRIFIER].

### 5.3 Totaux exacts (fiches distinctes et emplacements)

Chaque étape reçoit deux fiches neuves : une situation (25 étapes, 25 situations distinctes sur 60) et, selon l'étape, soit son mécanisme (12 étapes, une construction chacune) soit un jeu (13 étapes, 13 jeux distincts sur 30). Chaque parcours reçoit une fiche 0 (assemblée du seed, aucun texte neuf) et un bilan (neuf).

| | Fiches distinctes | Emplacements dans les parcours | Réemplois |
|---|---|---|---|
| Fiches existantes reconditionnées | 5 par étape = 125 | 125 | 0 |
| Fiches 0 d'introduction | 5 | 5 | 0 |
| Situations neuves | 60 | 25 | 0 (35 hors parcours) |
| Comment c'est construit | 12 | 12 | 0 |
| Jeux | 30 | 13 | 0 (17 hors parcours) |
| Bilans du parcours | 5 | 5 | 0 |
| Vocabulaire, Formules, Écouter, Quand ça tombe à plat, Séances | 8 + 12 + 12 + 10 + 6 = 48 | 0 | 0 |
| **Total** | **125 + 5 + 155 = 285** | **125 + 5 + 25 + 12 + 13 + 5 = 185** | 0 |

Fiches neuves : 155, dont 55 dans les parcours (25 + 12 + 13 + 5) et 100 hors parcours (35 + 17 + 48). Emplacements par parcours : Machine à Café 23, Répartie 30, Confiance, Storytelling et Boulot 44 chacun, soit 185.

### 5.4 Ordre conseillé « Tes 4 premières semaines »

En tête de « Parcours », le calendrier de 4.1 en quatre lignes, sans nouveau parcours ni niveau. Un 6e parcours Répartie pour Yanis est à la roadmap depuis le 07/10 : le prolonger est l'option C de la question C7.

### 5.5 Accès visiteur et abonné (aucun compte gratuit, rien d'ouvert ni retiré aux visiteurs, 05/10)

| Contenu | Visiteur | Abonné Premium |
|---|---|---|
| Étape 1 de chaque parcours | Page publique actuelle, inchangée | Découpage en fiches |
| Fiches neuves | Rien | Tout |
| Glossaire `/glossaire` (12 termes) | Public, inchangé | Public, plus la rubrique Vocabulaire (40 mots) |
| Carnet | Extrait actuel, inchangé | Tout, dans « Quoi répondre » |
| Exercices et missions | Jamais (`champs-premium.ts`) | Tout |
| Mes questions | Rien | Envoi, historique et réponses |
| Pages de l'espace | `noindex` | `noindex` |

Aucun extrait des nouvelles rubriques pour les visiteurs en V1. **Angle mort signalé** : la page `/abonnement` (textes approuvés) ne mentionne pas ces nouvelles rubriques ; les y ajouter rouvre des textes validés et relève de @growth et @copywriter, avec Thomas (la conversion est « LA priorité », 19/10).

---

## 6. Barre de rubriques et portes

### 6.1 Contraintes

**6 entrées au plus, comptées à l'écran** (12/11, Q3 = A) : tout lien visible dans la barre est une entrée, « Plus » compris. « Aujourd'hui » (écran du premier pas, de la rafale, du contenu du jour avec sa vanne et son toucher selon C13, et de « Ton mois ») est toujours un onglet. « Mon espace » (Q2 = A) nomme la zone. La barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A). **« Mon profil » reste dans le menu de compte, hors des 6**, et mène aux réglages (`/profil`, qui garde une ligne de lien vers « Mes questions »). Libellés en texte ; aucune rubrique vide à l'ouverture ; aucun doublon. **Règle de porte** : chaque contenu a UNE porte principale ; les liens depuis un parcours, une fiche ou « Aujourd'hui » sont des raccourcis vers la même fiche, dont l'état « Fait » est unique. `header-budget.spec.ts` fige les onglets : à mettre à jour avec le libellé validé (@ux, @design).

### 6.2 Trois variantes à 6 entrées, UNE question (C1)

**La contrainte, dite en une phrase** : « Mes questions » en onglet (12/11), « 6 entrées au plus » (12/11, Q3 = A) et **le [CHOIX UTILISATEUR] du 12/11 : « le reste du catalogue reste une bibliothèque en accès libre à côté »** (décision du 19/10 confirmée) ; Premium se vend « tout Deviens Marrant ouvert » (19/10). **Pour mémoire, sans rôle dans le choix** (règle de 0.1, niveau 2) : le besoin le mieux mesuré chez les visiteurs est de trouver une vanne à ressortir ; on ne sait pas si les abonnés veulent la même chose. Dans les trois variantes, les jeux, séances et missions sont à deux clics (« Plus », ligne « S'entraîner ») ou depuis la carte d'« Aujourd'hui ».

| | A | **B (recommandée)** | C |
|---|---|---|---|
| Barre | Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus |
| Catalogue (vannes, conseils, vidéos, écouter-repérer) | Première ligne de « Plus » | Bloc « Vannes, conseils, vidéos » de l'onglet « Bibliothèque », **ouvert sur les thèmes** (pages `/vannes/theme/[slug]` : boulot, couple, soirées, famille, autodérision, dating, gaming, et humour noir si C12 le retient) ; la recherche reste accessible depuis la barre | Onglet visible |
| Vocabulaire, Comment c'est construit, Formules | Onglet visible, trois portes nommées | Bloc « Vocabulaire et techniques » de l'onglet « Bibliothèque », nommé au premier écran | Première ligne de « Plus » |
| **Ce qu'elle sacrifie** | **Rouvre la décision du 12/11** : le catalogue n'a plus d'onglet à côté des parcours, il passe dans « Plus » (deux clics) ; sur `/vannes` l'onglet actif serait « Plus » | **Le mot « Vocabulaire » n'est plus en haut de la barre** (demande du 10/11, qui décrivait la capture) : c'est le titre d'un bloc de « Bibliothèque », un nom générique ; « Bibliothèque » est le mot de la reco que tu as suivie le 12/11 | **Le mot « Vocabulaire » n'est plus en haut** et passe à deux clics (« Plus »), contre ta demande du 10/11 |
| Ce qu'elle garde | « Vocabulaire » en haut | Catalogue ET vocabulaire à un clic ; fidèle au 12/11 ; 6 entrées | Catalogue à un clic ; fidèle au 12/11 |

**Reco : B, ferme.** Elle tient ta décision du 12/11 (catalogue en bibliothèque à côté), les 6 entrées et le catalogue payé à un clic (offre du 19/10), et elle nomme « Vocabulaire et techniques » au premier écran de l'onglet. **Elle ne s'appuie sur aucune mesure de visiteurs.** **Elle ne met plus le mot « Vocabulaire » en haut de la barre.** A est une option qui rouvre la décision du 12/11. Le rendu sera testé sur deux tâches (« où apprendre à construire une vanne ? », « où trouver une vanne ? »). Si tu veux les jeux en onglet : remplacer « Plus » par « S'entraîner » et ranger Favoris, Lettre, Articles et Quiz dans le menu de compte ; cela coûte l'onglet « Bibliothèque » ou « Catalogue ».

**Contenu de « Plus »** (trois blocs ; dans A la première ligne est « Vannes, conseils, vidéos », dans C « Vocabulaire et techniques », dans B aucune) : « S'entraîner » (jeux, séances, missions) ; « Mon contenu » : Favoris et notes ; « Le reste » : Lettre (ton inscription du jeudi et la date de la prochaine lettre, rien d'autre), Articles, Quiz d'humour. « Écrire à l'équipe » n'y est plus : c'est « Mes questions ».

**État de la barre à l'ouverture** : seules les entrées dont le seuil de 7.4 est atteint apparaissent ; « Aujourd'hui », « Parcours » et « Quoi répondre » ouvrent avec l'espace ; « Mes questions » ouvre avec l'espace. **En variante B, « Bibliothèque » ouvre avec le catalogue et ajoute son second bloc « Vocabulaire et techniques » quand son seuil est atteint** : aucun onglet ne surgit ; ce changement est **annoncé une fois dans « Aujourd'hui »** (carte « Nouveau dans la Bibliothèque »), sans e-mail. En variante A, l'onglet « Vocabulaire et techniques » a son emplacement réservé (seuil visé avant l'ouverture) ; sinon la barre a 5 entrées et le contenu prêt est dans « Plus ».

### 6.3 Porte principale de chaque page ou type (variante B recommandée)

| Contenu | Porte | Remarque |
|---|---|---|
| Aujourd'hui (rafale, premier pas, contenu du jour avec sa vanne et son toucher, cartes) | Aujourd'hui | |
| Parcours, étapes, fiche 0, bilan du parcours | Parcours | Le bilan est la dernière fiche du parcours |
| Quoi répondre, carnet (`/carnet`) | Quoi répondre | URL conservées |
| Quand ça tombe à plat | Quoi répondre (filtre « rattraper un faux pas ») | Lien depuis « Essayé, bof » |
| Vannes, conseils, vidéos, Écouter repérer | Bibliothèque, bloc « Vannes, conseils, vidéos » | Un clic, ouvert sur les thèmes ; sur `/vannes` l'onglet actif est « Bibliothèque » ; recherche accessible depuis la barre |
| Vocabulaire, Comment c'est construit, Formules | Bibliothèque, bloc « Vocabulaire et techniques » | Un seul glossaire : `/glossaire` public est la vitrine |
| Jeux, séances, missions | Plus, ligne « S'entraîner » | Carte dans « Aujourd'hui », lien « À toi » depuis les fiches |
| Mes questions (envoi, historique, réponses) | Mes questions | Remplace l'encadré du profil |
| Quiz d'humour, Articles | Plus | Articles restent publics (SEO) |
| Favoris, notes | Plus | Notes : Q5b du brief |
| Lettre | Plus | Inscription et prochaine date |
| Mon profil | Menu de compte | `/profil` garde son adresse et une ligne vers Mes questions |

### 6.4 Correspondance avec la capture

| Rubrique de la capture | Décision |
|---|---|
| Guides | Conseils (catalogue) et Comment c'est construit |
| Parcours | Parcours |
| L'atelier des mots | Vocabulaire ; écriture guidée dans Comment c'est construit et Formules |
| Grammaire | Comment c'est construit |
| Vocabulaire | Vocabulaire (40 mots) |
| Expressions et proverbes | Formules à détourner |
| Apprendre, lire et écouter | Bibliothèque (vidéos) et Écouter, repérer |
| Exercices et jeux | Jeux (page S'entraîner) |
| Favoris, Mes notes | Plus |
| Ateliers | Séance de 20 minutes ; pas de coaching en direct (13/10) |
| Écrire au coach | Mes questions |
| Test de fin de section | Le bilan du parcours (allégé) |
| (demande de Thomas, hors capture) | Quoi répondre |


## 7. Production

### 7.1 Règle de relecture : la question C8

La décision de Thomas du 12/11 est « chaque étape itérée jusqu'à 10 », relecture à l'aveugle, « jusqu'à 10/10 chez tous les relecteurs » (`founder-preferences.md` l. 163). Elle ne dit pas comment l'appliquer à 180 répliques drôles, ni ce qu'elle implique pour les contenus existants repris dans l'espace (carnet). Ce document ne pose donc AUCUNE règle de relecture : la question C8 la pose. En attendant la réponse : les 5 étalons sont relus à 10/10 chez tous les relecteurs, et le garde-fou du 08/10 reste vrai (une faute objective est corrigée quel que soit le vote). Barre « niveau Alexa » pour toute vanne ou réplique : chute surprenante, courte, logique, observation vraie, jamais entendue ailleurs ; pas de réplique plutôt qu'une réplique moyenne ; rien sous la barre n'entre en ligne (P0 s18).

### 7.2 Pipeline et lecture de Thomas

1. Étalon validé par Thomas, par type (section 9), avant tout brief @copywriter.
2. Écriture par lots de @copywriter : 3 candidates par emplacement de réplique [HYPOTHÈSE].
3. Contrôle de vérité (citations, minutes, définitions, sources) avant relecture.
4. Relecture à l'aveugle (règle C8), puis Stand-Up Director sur les répliques.
5. Mesure du diff réel pour tout contenu existant reconditionné (P0 s11).
6. **Lecture de Thomas** : les 5 étalons en entier, puis 3 fiches sur 10 par lot, et le visionnage de chaque passage choisi pour « Écouter, repérer ». Sauf avis contraire de Thomas ; il peut demander à tout lire. **À cela s'ajoute, après l'ouverture, la relecture et l'envoi de chaque réponse de « Mes questions »** (7.3 bis).

| Type | Fiches | Lots | Échantillon lu |
|---|---|---|---|
| Quoi répondre | 60 | 6 de 10 | 18 |
| Comment c'est construit | 12 | 2 de 6 | 4 |
| Formules | 12 | 2 de 6 | 4 |
| Jeux | 30 | 3 de 10 | 9 |
| Écouter, repérer | 12 | 2 de 6 | 4 (et 12 passages visionnés) |
| Vocabulaire | 8 | 1 | 3 |
| Quand ça tombe à plat | 10 | 1 | 3 |
| Bilans | 5 | 1 | 2 |
| Séances | 6 | 1 | 2 |
| Étalons | 5 | | 5 |
| **Total lu avant l'ouverture** | | | **54 fiches sur 155 (environ un tiers) plus 12 passages visionnés** |

La mise en ligne reste sur le go écrit de Thomas, derrière l'interrupteur fermé du brief.

### 7.3 Capacité par type (V1)

Rendement de la section 1.3 : de 1 sur 2 à 1 sur 12. Base : 3 candidates par emplacement ; pire cas : 12.

| Type | Emplacements à tenir | Candidates (base, pire cas) | Barre humour | Palier |
|---|---|---|---|---|
| Quoi répondre, 3 répliques | 60 x 3 = 180 répliques | 540, 2 160 | Oui | P1, P2, P3 |
| Contextes de la rafale (2 par situation neuve) | 120 contextes, une seule bonne réponse défendable ; les désaccords se règlent en reformulant le contexte | 240 | Jugement | P2 |
| Cartes du carnet « Et toi ? » | 45 cartes de production, 0 texte neuf | 0 | Non | P2 |
| Quand ça tombe à plat | 10 x 3 = 30 sorties | 90, 360 | Oui | P2 |
| Formules à détourner | 60 détournements | 180, 720 | Oui | P2 |
| Jeux d'écriture (Finis la phrase, Remets la chute) | environ 20 chutes | 60, 240 | Oui | P2 |
| Bilans (allégés) | 0 réplique neuve ; **10 contextes et 15 textes de retour** (3.10) | 35 | Jugement | P2 |
| Mapping : situations d'entrée des 5 profils | 5 situations d'entrée, plus la scène par défaut qui est l'une d'elles | | Jugement | P1 |
| Étiquetage des défis par marche | défis des 120 conseils et 89 vidéos [À VÉRIFIER : nombre réel] ; table séparée | 1 passe plus 1 relecture | Non | P2, P3 |
| Comment c'est construit, Vocabulaire, Écouter, Séances | 12 + 8 + 12 + 6 = 38 fiches de texte | 1 version corrigée chacune | Exemples seulement | P2, P3 |
| **Total de candidates à écrire** | | **environ 1 150 (base) à 3 750 (pire cas)** | | |

Règles : (a) **60 est une cible de situations VALIDÉES, pas une coupe** : si le rendement est bas, on écrit plus de candidates, jamais moins de situations ni une barre abaissée. (b) Une situation peut sortir avec 2 répliques bonnes sur 3. (c) Point de contrôle après le lot 1 de 10 situations : on mesure le rendement réel, on met ce tableau à jour et on le montre à Thomas avant le lot 2. (d) **Relecture préalable du carnet** : 15 fiches d'octobre selon la règle de C8, un tour pour H10 corrigée ; hors du total ci-dessus.

**Chantier de développement en plus du contenu** (@product-manager, @fullstack) : de quoi retenir, par abonné, le résultat de chaque carte, sa réponse à « Tu avais une réponse ? » et l'état du compte à rebours ; les retours de mission ; l'état « Fait » par fiche ; les fils, messages, étiquettes de scène et réponses de Mes questions ; un outil pour que l'équipe saisisse ses réponses ; la page « S'entraîner » ; **le toucher sur la vanne du contenu du jour** (puces accessibles de 4.4, tirage dans la catégorie : d'abord les vannes déjà servies au contenu du jour, puis les autres actives ; seuil minimal par catégorie ; non-répétition dans la mémoire du navigateur ; événements anonymes par catégorie) ; la barre pilotée par les seuils ; selon C9, un signal retenu sur le compte ; **la destination après connexion et après paiement selon C14** (honorer ou non le `returnTo`, bandeau « Ton premier pas », « Aujourd'hui » avec le premier pas ; page de succès et e-mail E0 inchangés). **Hors V1, déclenché par la mesure de 7.7** : faire suivre la source de l'article à travers le paiement et la petite correspondance par article de 4.2 [HYPOTHÈSE technique, à trancher par @fullstack ; effet [SUPPOSÉ], 0 clic sur 69 vues d'encarts d'article]. L'e-mail de réponse existe déjà.

### 7.3 bis Régime mensuel (après l'ouverture)

| Quoi | Par mois | Candidates (base, pire cas) | Relectures à l'aveugle | Lecture de Thomas | Délai |
|---|---|---|---|---|---|
| Carnet | 30 fiches (une réplique chacune, plus pourquoi, sortie polie, exercice) | 60 (2 par fiche, rendement de Boulot) à 360 (12 par fiche, rendement d'octobre) | Selon C8. Plancher : 3 lots de 10, soit 3 x (2 critiques + départage) = 9 passes (méthode d'octobre). Avec C8 A, le nombre de passes n'est pas borné ; avec C8 B, 2 avis sur 3 par des relecteurs indépendants | 3 sur 10, soit 9 fiches | Carnet du mois suivant prêt avant le 30 (celui de décembre avant le 30/11, déjà au planning) |
| Situations neuves | 10 (30 répliques, 20 contextes), choisies d'après les étiquettes et les événements (7.7) quand ils sont assez nombreux | 90 à 360 (répliques), 40 (contextes) | 1 lot | 3 fiches | Fin du mois |
| Écouter, repérer | 1 à 2 | vérification de sources | 1 passe | visionnage de 1 à 2 passages | Fin du mois |
| Réponses « Situation à gérer » avec une réplique neuve | à 100 abonnés actifs : environ 8 (40 messages de ce type, dont 20 % avec une réplique neuve) ; à 500 : environ 40 [HYPOTHÈSE] | 24 à 96 ; 120 à 480 | relecture à l'aveugle dans le délai de 1 à 2 jours ouvrés, sinon aucune réplique neuve (2.6) | **chaque réponse, par l'équipe : Thomas seul aujourd'hui** | 1 à 2 jours ouvrés |
| Mes questions, autres réponses | environ 5 par jour ouvré à 100 abonnés actifs, environ 25 à 500 [HYPOTHÈSE] | réponses types relues | | **chaque réponse relue et envoyée par Thomas** ; au-delà de 10 réponses par jour ouvré en moyenne sur un mois, on lui pose la question de l'aide [HYPOTHÈSE de seuil] | 1 à 2 jours ouvrés |
| Lecture des étiquettes et des événements | 1 lecture par mois par la session | | | un compte rendu d'une page | Début du mois |
| **Total de candidates par mois** | | **environ 190 à 760, plus 24 à 96 (100 abonnés) ou 120 à 480 (500 abonnés)** | | **environ 12 fiches plus 1 à 2 passages, plus toutes les réponses** | |

Si le carnet d'un mois est en retard : la rafale passe à une situation nouvelle un jour sur deux (2.3), l'alerte de stock se déclenche à 30 jours. Ce régime s'ajoute aux lettres du jeudi (25/10).

### 7.4 Ordre de production et seuils d'ouverture

| Ordre | Quoi | Dépend de | Seuil d'ouverture |
|---|---|---|---|
| 0 | Étalons (5) | Thomas | Bloquant |
| 0 bis | Relecture du carnet (1.4, C8) et levée de INV T5 (vidéos) ; **essai réel du parcours d'abonnement depuis un article (7.5 e)** ; **lecture en base du nombre de vannes par catégorie (7.5 f)** | | Prérequis de 2 et de 5 ; la lecture des vannes conditionne l'étalon E5 ; l'essai conditionne C14 |
| 1 | Vocabulaire et Comment c'est construit, en parallèle (ils fixent les noms) | E2, E3 | Bloc « Vocabulaire et techniques » : 6 mécanismes et 4 fiches de vocabulaire (sur 8) |
| 2 | Quoi répondre : 6 lots de 10, contextes écrits avec les situations, **dans l'ordre de la règle de priorité de la section 0 (niveau « quoi écrire »)** | Noms de 1 | **30 neuves validées + carnet** : condition d'ouverture de TOUT l'espace |
| 3 | Découpage des 25 étapes (diff mesuré) ; développement de Mes questions | 2 et modèle de données | Parcours par parcours, Machine à Café d'abord |
| 4 | Jeux et Formules | 2 | Jeux : 10 ; Formules : 4 |
| 5 | Écouter, repérer (lancer tôt) | E4, 0 bis | 4 fiches vérifiées |
| 6 | Quand ça tombe à plat, bilans, séances | 2, 3 | Selon la rubrique |

**Les 30 premières situations, par univers, entrées comprises** [HYPOTHÈSE d'ordre, rééquilibré au premier relevé des étiquettes de scène, 7.7] : **soirée 6** (dont l'entrée Observateur), **rencontre 6**, **boulot 5** (dont l'entrée Absurde), **réunion et entretien 5**, **amis 5** (dont les entrées Storyteller et Punchlineur), **coloc 1** (l'entrée Taquin, la poêle), **famille 2** : 6 + 6 + 5 + 5 + 5 + 1 + 2 = **30**. Les 5 entrées sont écrites d'abord (elles sont dans ces 30, pas en plus). Niveau de preuve : soirée (indirect) et rencontre [MESURÉ V] ; boulot, réunion, amis, famille [OBSERVÉ] (départage) ; coloc [SUPPOSÉ] (pari, limité à l'entrée). Restent pour les lots suivants : coloc 3, famille 3, couple 5, études 5, prise de parole 5, commerces 5, messages et groupes 4 (30 en tout : 60 moins les 30 premières). Cet ordre est rééquilibré au premier relevé des étiquettes de scène (7.7), qui n'apprendra presque rien avant plusieurs dizaines de fils (4 abonnés au 02/11). La production est parallèle ; l'**ouverture** est séquencée : rien ne s'ouvre avant que « Quoi répondre » le soit, **y compris « Mes questions »**, qui s'ouvre avec l'espace (l'encadré du profil reste en service d'ici là).

### 7.5 Prérequis non négociables

(a) Carnet : les vérifications de 1.4 avant son entrée dans la rafale. (b) Écouter, repérer : INV T5 levé (Rollman, Haroun, Ngijol, Bun Hay Mean) ; chaque passage visionné et minuté ; chaque citation vérifiée par un relecteur indépendant de l'auteur. (c) Mes questions : les phrases de @legal appliquées à la confidentialité et aux conditions d'utilisation avant l'ouverture. (d) **Si C9 B ou C est retenue, ou si la source d'article est retenue sur le compte (entrée par article déclenchée), ou si Thomas veut zéro répétition de vanne d'un jour à l'autre** : une phrase de @legal, au plus court, pour le signal ou la liste retenus sur le compte. (e) **Essai réel du parcours d'abonnement depuis un article**, au lot 0 : bouton de fin d'article, `/abonnement?returnTo=…&src=…`, inscription, paiement test, page d'arrivée ; relever ce que l'espace reçoit (`returnTo`, `src`) et où l'abonné arrive ; il vérifie si le `src` atteint l'espace (le code lu dit que non) et fixe la destination de C14. (f) **Lecture en base du nombre de vannes actives par catégorie** (SOIREES, BOULOT, PARENTS, DATING) et de celles déjà servies au contenu du jour, avant l'étalon E5 : elle fixe le seuil minimal du toucher (4.4) ; aucun chiffre n'est supposé.

### 7.6 Mesure de la valeur du contenu neuf

Lire une fiche ne laisse aucune trace (INV T4). Le « Fait » par fiche le rend visible. Cibles à poser avec @data-analyst, aucune inventée ici :

| Axe | Événement | Source |
|---|---|---|
| **Compétence (indicateur n°1, auto-déclaré)** | Part des cartes avec « Oui » avant d'avoir vu les répliques, par semaine, « À moitié » à part, lue avec l'état du compte à rebours | « Tu avais une réponse ? » |
| Adoption | Premier pas fait le jour 1 | « Fait » du premier pas |
| Engagement | Fiches « Fait » par semaine ; cartes jouées ; missions tentées ; envois dans Mes questions ; « Ce soir, c'est plutôt ? » et « une autre vanne » | « Fait », état de rafale, retours, messages, événements anonymes par catégorie |
| Rétention | Retour à J7, J30, J60 | Événement serveur d'ouverture |
| Utilité par type | Part des fiches ouvertes dont le geste est fait | « Fait » par type |

**Règle de décision écrite d'avance** [HYPOTHÈSE, seuils fixés par @data-analyst] : le cœur de l'espace (moteur, Quoi répondre) repose sur du [SUPPOSÉ], et la seule demande mesurée va vers des blagues toutes faites (chez des visiteurs). **Effectif minimal avant tout déclenchement, valable pour tout relevé qui prétend être un [MESURÉ A]** (0.1, 7.7) : la règle ne se lit qu'à partir d'un nombre d'abonnés actifs suffisant (par exemple une quarantaine [HYPOTHÈSE, à fixer par @data-analyst]) ; en dessous, elle ne décide rien, car avec 4 abonnés actifs elle déciderait sur trois personnes. Si, à J60 et au-delà de cet effectif (on prend la plus tardive des deux conditions), la part des abonnés actifs qui jouent au moins une carte par semaine reste sous X % pendant que « une autre vanne » dépasse Y demandes par abonné et par semaine, **on soumet à Thomas une repondération** : plus de catalogue contextuel et de situations, moins de types de leçons. **Cette repondération touche le pivot du 06/05 (« conseils > vannes »)** : la question posée à Thomas le lui rappelle. C'est ce relevé qui constitue le premier [MESURÉ A] (0.1). Rien ne change sans sa décision ; la lecture ne se fait pas à travers ce qu'on a envie de croire. Réévaluation d'un type à 60 jours [HYPOTHÈSE de seuil, à fixer par @data-analyst].

### 7.7 Capteurs de la demande réelle des abonnés

Aujourd'hui, côté abonnés, presque rien n'est mesuré (section 0.1) : il n'y a aucun [MESURÉ A], et un relevé sous l'effectif minimal de 7.6 n'en est pas un. Capteurs prévus, aucun ne rouvre une décision :
1. **Étiquette de scène** sur chaque fil de « Mes questions » (2.6) et **lecture mensuelle par la session** : une page par mois, qui sert à choisir les situations du mois suivant. Ordre de grandeur honnête : environ 40 fils de situation par mois à 100 abonnés ; avant, elle ne pilote pas le plan.
2. **Le toucher « Ce soir, c'est plutôt ? » et « une autre vanne »** : un événement par demande, avec la seule catégorie, **sans identifiant d'abonné**. **Le même toucher répond au besoin et mesure la demande des abonnés par univers** : c'est la donnée qui manque à toute la section 0 pour pondérer les 60 situations et, un jour, pour décider de la place de la vanne. Rien n'est gardé sur le compte.
3. **Répartition du geste « Où veux-tu être plus à l'aise ? »** (si C9 B) et **part des abonnés qui arrivent avec un signal**. **Pour l'origine « article »** : la seule mesure possible sans développement est indirecte, par les inscriptions qui portent `src=blog-*` dans le tunnel d'abonnement, où le `src` est relayé « pour la mesure du tunnel » (`premium-return.ts`) [À VÉRIFIER avec @data-analyst : si cette mesure compte bien les inscriptions par `src`]. C'est elle qui déclenche, ou non, l'entrée par article hors V1 de 4.2 ; avant elle, la seule trace d'article dans l'espace est le parcours associé du `returnTo`.
4. **Extractions en lecture seule, sans donnée personnelle** (@data-analyst) : compteurs de favoris et de likes par catégorie, murs Premium par liste (Umami, 4 dernières semaines).
5. **Export Google page par requête, 28 jours** : le dernier lu a plus de 4 semaines.
Hors périmètre, non touché : les votes « Je veux ça » et leur base affichée (décision du 13/10), l'écran de motifs de résiliation (s23).


## 8. Questions pour Thomas (C1 à C14)

Numérotation propre à ce document (« C » pour contenu). Chaque question a 3 options et une reco, sans jargon. Une option qui rouvre une décision déjà prise est marquée « rouvre la décision du JJ/MM ». C10 est posée en deux volets (a et b) et compte pour une seule question : 14 questions au total.

**Un mot avant les questions.** Tu avais mis « Guides » en tête de ta capture. Je ne crée pas un type de plus : les 120 conseils du catalogue tiennent ce rôle et chaque fiche neuve les relie. Si tu veux des guides neufs, dis-le. **Sur ce que ton audience veut** : la section 0 recense les besoins avec leur fiabilité, et une règle de priorité à deux niveaux : pour choisir quoi écrire, le mesuré chez les visiteurs passe devant ; pour décider ce qui passe devant sur l'écran d'un abonné, seul un mesuré chez les abonnés compte (au-delà d'un effectif minimal), et il n'existe pas encore. Un nombre de pages publiques sur un sujet mesure l'offre, pas la demande. Fiabilité faible à moyenne : seule la mesure de Google est solide, et elle décrit des visiteurs qui n'ont pas payé ; la recherche publique n'a donné aucun verbatim d'internaute (Reddit et jeuxvideo.com : accès refusé). Rien n'y prouve ce que veulent tes abonnés ; les questions C6, C12 et C13 viennent de ces mesures. **La question C14 est la Q8 du brief, qui ne t'a pas encore été posée.** Tranchés sans question : les trois registres « la sûre / la joueuse / la risquée », la règle « on rit avec, pas contre », les humoristes récents nommés, rien d'ouvert aux visiteurs, « Mes questions » ouvert avec l'espace, un seul délai pour tous les messages, les phrases juridiques de @legal, les messages de détresse lus et traités en premier en interne, les 10 fiches « Quand ça tombe à plat », le vocabulaire à 40 mots, le bilan allégé (tu peux en remettre 6 questions), et **l'entrée personnalisée par article laissée hors V1** (effet supposé, 0 clic sur 69 vues d'encarts).

**C1. Quelle barre en haut de l'espace ?** Tu as décidé le 12/11 que « le reste du catalogue reste une bibliothèque en accès libre à côté », tu as voulu « Mes questions » en onglet, et 6 entrées au plus. Aucune mesure de visiteurs ne décide de la barre (elle décrit des gens qui n'ont pas payé). Dans les trois variantes les jeux sont à deux clics (« Plus », ligne « S'entraîner ») ; « Aujourd'hui » est toujours un onglet.
- A. Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus. Le catalogue passe en première ligne de « Plus ». **Rouvre la décision du 12/11** : le catalogue n'a plus d'onglet à côté des parcours. Garde le mot « Vocabulaire » en haut.
- B. Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus. « Bibliothèque » montre deux blocs : « Vannes, conseils, vidéos » (ouvert sur les thèmes) et « Vocabulaire et techniques ». **Reco, ferme** : fidèle à ta décision du 12/11 et à l'offre du 19/10, catalogue et vocabulaire à un clic. **Elle ne met plus le mot « Vocabulaire » en haut de la barre** (ta demande du 10/11, qui décrivait la capture).
- C. Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus. Fidèle au 12/11. **Sacrifie** « Vocabulaire » : première ligne de « Plus », deux clics.
Dans les trois cas, « Mon profil » reste dans le menu de ton compte. Le rendu sera testé sur deux tâches : où apprendre à construire une vanne, où trouver une vanne.

**C2. Combien de temps par semaine ?** L'offre promet « 15 à 20 min/semaine » (décision du 29/09, reprise le 07/10). Cette promesse porte sur le cœur des parcours. Une étape demande environ 22 à 25 minutes (**estimation de lecture sur Machine à Café, à chronométrer avec un lecteur avant de figer le texte**). Si l'abonné suit le calendrier, s'ajoutent la rafale (3 à 5 minutes par jour, jusqu'à 35 minutes par semaine), une séance de 20 minutes en semaine 3 et une écoute en semaine 4 : **jusqu'à 40 minutes en semaine 1, 64 en semaine 2, 79 en semaine 3, 66 en semaine 4 si l'abonné fait tout** ; avec seulement le cœur des étapes, **de 40 à 75 minutes**. Le cœur de l'étape est ce que la promesse couvre ; tout le reste est facultatif et l'ordre reste conseillé.
- A. La promesse vaut pour le cœur des parcours : 15 à 20 minutes, la 2e vidéo et les nouvelles fiches passent en « pour aller plus loin », facultatives. La pratique quotidienne et les séances sont « en plus », facultatives, avec leur durée affichée ; « Aujourd'hui » dit « Si tu as 5 minutes » et ne la présente jamais comme une obligation. Le texte de l'offre ne change pas. Touche le statut de vidéos que tu as choisies (étalons du 07/10, vidéos de Boulot regardées le 11/10) et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz ». **Reco** : elle garde ta promesse sur ce qu'elle couvre, et dit honnêtement que la semaine la plus chargée monte à 79 minutes si tout est fait.
- B. A, et le texte de l'offre dit la promesse des parcours ET mentionne la pratique quotidienne comme un plus : touche des textes validés (l'offre et la page d'abonnement), ton go pour chacun ; aucun chiffre n'est retiré (29/09).
- C. On change la promesse affichée (par exemple « jusqu'à une heure par semaine ») : rouvre la décision du 29/09, reprise le 07/10.

**C3. Veux-tu un entraînement quotidien ?** Une situation nouvelle par jour (3 cartes au plus, 3 à 5 minutes) : tu tentes d'abord ta réponse (rien n'est enregistré, le compte à rebours est facultatif), tu dis si tu avais une réponse (oui, à moitié, rien : c'est une déclaration, pas un contrôle), puis tu vois les répliques et tu choisis ; les cartes ratées reviennent 2, 7 puis 21 jours plus tard ; des missions montent d'une marche seulement quand la précédente a marché. Rien n'est envoyé, tout se passe quand l'abonné ouvre l'espace. À 30 jours la rafale continue : le carnet mensuel et environ 10 situations neuves par mois suffisent pour 1 par jour. Il faut construire de quoi retenir les choix de chaque abonné : c'est un vrai chantier en plus du contenu. Les fiches du carnet donnent des cartes « Et toi ? » (tu produis ta réponse, tu vois les deux répliques, sans choix), les situations neuves des cartes « Quel registre ? » (tu choisis entre trois) ; le carnet serait 60 % des situations au début, 75 % ensuite.
- A. Oui, carnet inchangé : les cartes du carnet restent des cartes de production. Aucune décision rouverte. **Reco.**
- B. Oui, et les carnets à partir de janvier sont écrits avec trois réponses et deux contextes : rouvre la décision du 03/10 (carnet validé : une réplique par fiche, une sortie polie). **À décider avant le 15/12** [HYPOTHÈSE de délai : le carnet de janvier s'écrit en décembre] ; sinon février au plus tôt.
- C. Non : des fiches et des parcours, pas d'entraînement quotidien.

**C4. La série, les points et « Fait » ?** Aujourd'hui la série compte les jours où l'abonné valide une étape ou termine un quiz d'étape ; les points viennent des étapes et du bonus de fin. « Fait » par fiche, déclaré par l'abonné quand il a fait le geste, est le défaut proposé (c'est la Q5 du brief). Dans tous les cas, la courbe « avais-tu une réponse ? » est affichée dans « Ton mois » comme simple mesure, sans effet sur la série ni les points. Aucune demande de points ni de série n'a été trouvée dans la recherche publique.
- A. Aucune nouvelle règle : la rafale et les fiches ne comptent ni pour la série ni pour les points ; un repère neutre (« 12 cartes cette semaine ») montre l'habitude. On mesure 30 jours avant de toucher à la série. **Reco.**
- B. Une rafale terminée compte comme une pratique pour la série, jamais pour les points : précise la décision du 07/10 (« série comptée sur la pratique ») ou la rouvre selon ta lecture, car elle cite l'étape validée et le quiz d'étape.
- C. B, plus des points pour chaque fiche faite : nouvelle règle de points (ton accord est requis) et même réserve sur le 07/10.

**C5. Les situations des lettres du jeudi ?** Le 25/10 tu as dit que la lettre doit apporter ce que le site ne donne pas.
- A. Jamais reprises : le site a ses situations, les lettres gardent les leurs. **Reco.**
- B. Une situation de lettre entre dans « Quoi répondre » 3 mois après son envoi, retravaillée : rouvre la décision du 25/10.
- C. Les lettres déjà reçues restent consultables telles quelles dans « Plus », sans copie dans « Quoi répondre » : rouvre la décision du 25/10 sur le principe.

**C6. Quels univers pour les situations, et la rencontre ?** Déjà validés par toi : soirée, boulot, amis, famille, couple, dating, caisse, voisin (carnet), couple (Black Friday), un premier rendez-vous (lettre W50). Yanis vit « en soirées, en coloc et avec ses potes ». **Intérêt mesuré, sur deux pages et pas sur des recherches** : les pages du blog « comment faire rire un homme » et « comment faire rire une fille » ont été affichées 488 et 314 fois sur Google en 28 jours, pour 4 et 3 clics seulement ; ce sont des visiteurs, pas des abonnés, et rencard et couple restent une [HYPOTHÈSE] pour tes trois profils.
- A. Tous les univers du quotidien, soirées, rencontres et couple compris, avec une place dédiée : **6 situations rencontre** (rencard, messages d'approche, garde-fou « taquiner, ne jamais insister ») et 5 couple parmi les 60. Rupture et deuil : jamais comme sujet de vanne. **Reco** : l'intérêt mesuré sur deux pages et les contenus que tu as déjà validés vont dans le même sens, sans créer de parcours ; c'est un choix d'écriture, il ne place rien devant rien sur l'écran.
- B. Comme le widget : sans soirées, rencontres ni couple. Plus prudent, mais retire les soirées (terrain écrit de Yanis), l'intérêt mesuré sur la rencontre et plusieurs fiches du carnet déjà validées.
- C. A, plus la rupture traitée avec légèreté sur le fait de recommencer à parler, jamais sur la personne : Marc s'y retrouverait (aucun signal d'audience ne confirme ce besoin), le risque de blesser est réel.
Un parcours court dédié à la rencontre est une piste à reprendre si l'intérêt se confirme (il rouvrirait « les 5 parcours »).

**C7. Niveaux et sixième parcours ?** Aujourd'hui les niveaux sont « débutant » et « intermédiaire » (Machine à Café et Boulot sont débutant ; Répartie, Confiance et Storytelling sont intermédiaire).
- A. Un ordre conseillé « Tes 4 premières semaines » en tête de « Parcours », les niveaux actuels, des fiches « pour aller plus loin » sans nom de niveau. **Reco.**
- B. A, plus un niveau « avancé » créé : ajoute une valeur au code et aux libellés, accord requis.
- C. A, plus un sixième parcours débutant sur la répartie : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés) et prolonge la roadmap du 07/10.

**C8. Jusqu'où itérer chaque contenu avant qu'il te soit montré ?** Le 12/11 tu as demandé d'itérer « chaque étape jusqu'à 10 », relecture à l'aveugle, 10/10 chez tous les relecteurs. Cela vaut-il aussi pour le carnet déjà écrit que l'espace reprend ? Octobre a été relu par deux critiques, mais dix des quinze répliques n'ont qu'un seul critique indépendant (l'autre voix est celle de l'orchestrateur) ; novembre est à 10 sur 10 sauf la fiche H10, corrigée depuis et jamais relue.
- A. 10/10 chez tous, sans limite de tours, pour tout contenu neuf de l'espace ET pour le carnet repris (octobre relu à cette règle, H10 relue, avant l'entrée dans la rafale). C'est la décision du 12/11 prise à la lettre : elle a déjà remplacé « 2 avis sur 3 » pour les contenus de l'espace. En revanche, relire octobre peut faire corriger des fiches que tu as validées le 03/10 : **toute fiche du carnet corrigée te revient avant de reprendre sa place**, comme les lettres. Risque dit en clair : une boucle quand les relecteurs ne s'accordent pas sur une réplique drôle ; tu peux l'arrêter à tout moment. **Reco.**
- B. 10/10 chez tous pour les 5 étalons et le premier lot de chaque type, puis « 2 avis sur 3 au niveau » (règle du 08/10) pour la suite ; carnet : octobre relu à 2 avis sur 3 par des relecteurs indépendants, H10 relue, fiche corrigée = te revient. Touche ta décision du 12/11 pour la production en série.
- C. A, avec une limite de 4 tours [HYPOTHÈSE] : si les relecteurs ne s'accordent pas, on te montre les deux versions et leurs notes, et la réplique la plus faible peut sortir. Touche ta décision du 12/11 (limite de tours).

**C9. Comment l'espace sait-il ce que veut l'abonné ?** Aujourd'hui le résultat du quiz d'humour n'est gardé que dans le navigateur : un abonné qui l'a passé sur son téléphone et s'abonne depuis son ordinateur n'a aucun signal. **Le lien d'où il vient est un signal** quand c'est une fiche ou une étape. Depuis un article de blog, le bouton d'abonnement transmet seulement le **parcours associé à l'article** (six fois sur neuf Répartie, donc pas un signal) ; l'article lui-même est perdu au paiement. La scène du jour 1 suit le lien de retour vers un contenu précis, puis le quiz, puis le parcours d'origine s'il n'est pas Répartie, puis une scène par défaut ; le parcours de la semaine 2 suit d'abord ce que l'abonné dit lui-même, puis l'étape d'où il vient, puis le quiz, puis le parcours d'origine, puis le défaut (C11).
- A. Rien de plus : le quiz (même appareil), le lien de retour, sinon les valeurs par défaut. Aucune donnée en plus.
- B. A, plus, une seule fois juste après le premier pas, à tout le monde même à ceux qui ont passé le quiz : « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, **pour plaire**, partout). Ce n'est pas un choix de parcours : c'est un signal, retenu sur le compte (un choix parmi quatre, aucun texte). **Sa réponse passe avant le quiz pour le parcours de la semaine 2** : une préférence déclarée aujourd'hui vaut mieux qu'un profil déduit il y a trois semaines. Cela corrige le cas de Sophie (« au boulot » : Machine à Café) et de Marc (« partout » : Confiance) même s'ils ont passé le quiz. « Pour plaire » ne mène à aucun parcours : la **prochaine situation nouvelle de la rafale est une situation de rencontre, une seule fois**, puis l'ordre normal reprend. Honnêteté : « partout » est le moins précis et enverra beaucoup d'abonnés vers Confiance ; on mesure la répartition au lot 1. Une phrase à ajouter à la confidentialité, au plus court. **Reco.**
- C. A, plus le résultat du quiz rattaché au compte (le profil, un choix parmi cinq, gardé en base) : l'entrée par le quiz marche sur tous les appareils. Même phrase à ajouter. Ne corrige pas les cas où le profil du quiz ne correspond pas au besoin.
Dans tous les cas, **l'entrée personnalisée par l'article** (premier pas selon l'article lu) est **hors V1** : son effet est [SUPPOSÉ] (0 clic sur 69 vues d'encarts d'article) ; elle ne serait construite que si la mesure des inscriptions venues d'un article (7.7) le justifie.

**C10 a. « Mes questions » : durée, historique après la résiliation, retrait d'un envoi.** Tu as décidé le 12/11 de tout garder en base, avec l'historique visible. La réponse de l'équipe est saisie dans l'outil, enregistrée, puis part par l'e-mail de réponse habituel, avec un seul délai pour tous. Les phrases de confidentialité et des conditions d'utilisation sont prêtes (écrites par @legal) ; aucun avis supplémentaire n'est recommandé.
- A. Gardé tant que le compte existe, effacé avec lui (la durée écrite par @legal) ; après la résiliation le compte est conservé et l'historique reste lisible depuis « Mon profil » ; l'abonné peut retirer un envoi de son historique (l'échange est supprimé dans l'espace ; les copies par e-mail suivent leur durée de 6 mois). **Reco** : c'est son espace.
- B. Même durée et même retrait, mais après la résiliation l'historique est gardé sans être affiché (il réapparaît au réabonnement).
- C. Gardé 6 mois après le dernier échange (durée des e-mails de questions, 25/10), retrait possible, accès fermé après la résiliation : contredit en partie « accès à leur historique » du 12/11.
Si tu veux malgré tout un avis juridique d'un avocat (le brouillon de @legal le propose « si Thomas le souhaite »), c'est une option qui rouvre ta décision du 25/10 (« pas de nouveaux avis ») : dis-le et on le demande.

**C10 b. Une ligne sur le 3114 dans « Mes questions » ?** Les messages qui évoquent une détresse sont lus et traités en premier, à la main, sans humour, avec l'orientation vers l'aide officielle (playbook), sans promesse affichée. Un message du vendredi soir n'est vu que le lundi.
- A. Une ligne fixe et discrète sous le champ, toujours visible : « Si tu traverses un moment très difficile, le 3114 répond à toute heure ». Texte à faire valider ; jamais présenté comme un contenu de l'espace.
- B. Rien : la réponse de l'équipe fait foi, avec son délai.
- C. La même ligne, mais seulement quand l'abonné choisit « Une situation à gérer » et dans le message de confirmation d'envoi : moins présente, là où le risque est. **Reco** : c'est la seule aide qui arrive avant notre réponse, sans alourdir chaque envoi.

**C11. Quel parcours pour l'abonné sans aucun signal ?** C'est probablement le cas le plus fréquent tant que le quiz n'est pas rattaché au compte, **y compris pour un abonné venu d'un article** (son parcours associé est Répartie six fois sur neuf, ce qui vaut « pas de signal »). Aujourd'hui rien ne le choisit. Fait utile : l'étape 1 de Répartie fait partie des 3 étapes gratuites que tu as validées le 07/10 en version B, avec un « repli solo ».
- A. Répartie, étape 1 « Tes premières répliques » (intermédiaire, 4 étapes, 20 min) : le parcours de la promesse du site (« avoir de la répartie ») et celui de deux profils du quiz sur cinq. **Reco** : c'est une étape gratuite d'entrée que tu as validée le 07/10, avec un repli solo ; son accès pour un débutant reste à tester. Aucun écart pour ceux que le site rattachait déjà à Répartie.
- B. Machine à Café (débutant, 3 étapes, 15 min) : le seul parcours débutant court, mais de thème bureau, loin d'un étudiant. **Conséquence** : un abonné venu de l'article de blagues ou d'un article sur la répartie, que le site rattache exprès à Répartie, partirait vers Machine à Café ; le geste de C9 B et le quiz peuvent le corriger.
- C. Aucun défaut : « Aujourd'hui » montre Répartie et Machine à Café côte à côte à la semaine 2 et l'abonné choisit. **Conséquence** : pour ceux venus de l'article de blagues ou d'un article sur la répartie, le choix leur est rendu au lieu de partir sur Répartie.

**C12. Humour noir et « jusqu'où » ?** « Blague humour noir 2026 » est la deuxième requête du site en clics (42 clics, 780 affichages en 28 jours) ; un article public existe (« l'utiliser sans blesser »). Ce sont des visiteurs en quête de blagues, pas des abonnés. Aujourd'hui l'espace n'en parle pas : la gradation « sûre / joueuse / risquée » traite le risque social, pas ce sujet, et la règle « rupture et deuil jamais comme sujet de vanne » est proposée en C6.
- A. Rien de dédié dans l'espace : l'humour noir reste sur le site public ; la gradation, la règle « on rit avec, pas contre » et la question « peut-il en rire avec toi ? » servent de garde-fou.
- B. Deux fiches sur la limite, sans écrire de blague d'humour noir : une des 12 constructions (« rire avec, pas de », à la place de la litote) et la fiche « quand tu as dit la mauvaise chose » élargie à « jusqu'où ». Aucune décision rouverte, aucun volume ajouté. **Reco.**
- C. Un petit lot de 5 situations où la risquée touche à l'humour noir, avec leurs limites, prises dans les 60 : touche la règle « rupture et deuil jamais comme sujet de vanne » (C6 A).

**C13. Quelle forme pour la vanne du contenu du jour dans « Aujourd'hui » ?** Le brief garde un « contenu du jour » : vanne, conseil et vidéo ensemble. Trouver une vanne à ressortir est le besoin le mieux mesuré du site, **mais cette mesure porte sur des visiteurs** (79,7 % des clics Google sur un article de blagues), pas sur tes abonnés, et le 06/05 tu as décidé que « conseils > vannes (la vraie valeur = articles décryptés, parcours, vidéos, pas le catalogue de vannes) ». Il n'y a donc **qu'un seul bloc** : on ne montre jamais la même vanne deux fois à l'écran. La question est la forme de la vanne dans ce bloc, avec le toucher « Ce soir, c'est plutôt ? » (soirée, boulot, famille, rencard, peu importe : des boutons accessibles, une catégorie n'apparaît que si elle a assez de vannes), qui propose une vanne du catalogue de la bonne catégorie, sans contenu neuf.
- A. Le bloc met la vanne en tête, plus grande, avec le toucher et « une autre » ; le conseil et la vidéo viennent dessous. La vanne passe avant le conseil et la vidéo : s'appuie sur la mesure des visiteurs, **va à l'encontre du pivot du 06/05** et de la règle de 0.1 (seul un mesuré chez les abonnés, au-delà de l'effectif minimal, fait passer un contenu devant).
- B. Le bloc garde l'ordre et le poids du brief (vanne, conseil, vidéo ensemble) ; **la vanne du jour porte le toucher et « une autre »**, en boutons compacts sous elle. Aucune carte en plus. **Reco honnête** : elle respecte le brief, ton pivot du 06/05 et la règle de 0.1, garde le besoin le mieux mesuré à un toucher, et le capteur anonyme (7.7) produira, au-delà de l'effectif minimal, le premier mesuré chez les abonnés, qui dira si la vanne doit monter en A.
- C. Aucun toucher dans « Aujourd'hui » : le contenu du jour est celui du brief, et le tirage par catégorie reste dans la Bibliothèque (variante B de C1), ouverte sur les thèmes. Le plus fidèle au pivot ; mais pas de capteur de la demande des abonnés par univers dans « Aujourd'hui » (la mesure se ferait alors dans la Bibliothèque).

**C14. Où arrive l'abonné juste après sa connexion et juste après le paiement ? (c'est la Q8 du brief, qui ne t'a pas encore été posée).** Aujourd'hui, après le paiement, il arrive sur la page d'où il vient (une fiche, une étape ou, depuis un article, le parcours associé à l'article), ou sur la page des parcours s'il n'y en a pas ; il n'arrive jamais sur « Aujourd'hui ». Le premier pas de l'espace (une scène de moins de 5 minutes) doit se voir tout de suite. **Quelle que soit l'option** : la page de succès reste affichée avec un bouton « Continuer » (aucune redirection automatique, pour que l'abonné lise son message de bienvenue et voie le lien obligatoire pour renoncer au contrat), l'e-mail de bienvenue approuvé reste inchangé, et un abonné qui se connecte arrive sur « Aujourd'hui », comme le recommande le brief. Dis-moi si tu veux autre chose pour la connexion.
- A. Après le paiement, toujours sur « Aujourd'hui », avec le premier pas. Simple et le même pour tous ; l'abonné qui venait d'une fiche précise ne la retrouve pas à l'arrivée (elle devient son premier pas).
- B. Comme aujourd'hui : sur la page d'où il vient. Rien ne change au code ; mais l'abonné venu d'un article arrive sur la page d'un parcours, sans premier pas, et peut ne jamais voir « Aujourd'hui » le jour 1.
- C. Sur la page d'où il vient quand c'est un contenu précis (une fiche, une vanne, un conseil, une vidéo, une étape), **avec un bandeau unique, la première fois, « Ton premier pas : l'exercice ci-dessous » qui désigne le geste sur la page même (un lien vers « Aujourd'hui » reste en secondaire)** ; sinon sur « Aujourd'hui » avec le premier pas (parcours sans étape, page publique, rien). **Reco** : elle tient la promesse de l'endroit où l'abonné voulait aller, rend le premier pas visible pour tous, y compris ceux venus d'un article (le premier pas est alors la première fiche de l'étape 1 du parcours associé s'il n'est pas Répartie ; sinon la scène par défaut, 4.2), et reprend la reco du brief (on garde la page d'où il vient si l'acheteur venait d'un contenu précis).


## 9. Étalons à calibrer avec Thomas en premier (5)

Chaque étalon est relu à 10/10 chez tous les relecteurs à l'aveugle avant de t'être montré, puis Thomas choisit entre 2 versions. Les noms de rubriques, de registres et de l'onglet « Mes questions » sont présentés en même temps, en rendu sombre.

| # | Étalon | Ce qu'il fixe |
|---|---|---|
| E1 | Une situation « Quoi répondre » complète (3 répliques, règle, erreur, geste, 2 contextes) à partir du candidat de 3.3 ou d'un meilleur, **avec une risquée gagnante qui passe la règle « on rit avec, pas contre »** (la part d'un quart est confirmée ou revue), plus les 5 situations d'entrée (4.2) avec leur univers, une situation de rencontre (garde-fou de ton, risquée avec son trait d'humour) et une de prise de parole (« Ta première phrase d'abord »), à partir des deux exemples de 3.3 | La voix de l'espace, le niveau des 60 situations, la part de contextes gagnés par la risquée, les 5 entrées, le ton des univers ajoutés |
| E2 | Une fiche « Comment c'est construit » (le faux secret) et une fiche « Formules à détourner » (3.6, avec ses deux détournements) | L'absence de ton scolaire, la grille de retour, le niveau des détournements |
| E3 | Une fiche de Vocabulaire (5 mots, entrée de 3.5) | Le niveau de jargon, le lien avec le glossaire public |
| E4 | Une fiche « Écouter, repérer » sur un humoriste récent choisi par Thomas, avec des phrases réelles | Le choix des humoristes, le degré de découpage, la vérification |
| E5 | Une carte « Quel registre ? » et une carte « Et toi ? » (ordre : scène, ta réponse d'abord avec « Prends ton temps » sans compte à rebours, « Tu avais une réponse ? » qui révèle les répliques, choix, règle ; règles de « Oui », « À moitié », « Rien » ; ordre de tirage ; « C'est tout pour aujourd'hui »), **l'accroche de la rafale « esprit de l'escalier » testée à l'aveugle contre une accroche sans ce mot**, **le bloc du contenu du jour avec sa vanne, son toucher « Ce soir, c'est plutôt ? » (puces de 44 px, état annoncé, catégories au-dessus du seuil lu en base, 7.5 f) et son geste, rendu à 375 px avec lecteur d'écran pour vérifier que rien n'y apparaît en double**, le bandeau « Ton premier pas » de la page d'arrivée (C14 C), une mission avec ses retours, une question de bilan, l'écran « Mes questions » (3 types, fils, états, ligne 3114 selon C10 b) | Le chrono, l'interaction, la progression, l'accroche, le ton de « Ce qu'on aurait pu dire », le libellé de l'onglet, la composition de l'écran d'accueil, l'accessibilité du toucher |

---

## Annexe A. Traitement de chaque correction

Sigles : EL10 = `tour-10-elon.md` (V1), RE10 = `tour-10-reviewer.md` (W1 à W3), UX10 = `tour-10-ux.md` (W1 à W6), AS = consignes de la session (« appliquer UNIQUEMENT ces retouches »). Les corrections des tours précédents restent appliquées telles que tracées en annexe A de la v10.

### A.1 Corrections du tour 10

| Correction | Traitement |
|---|---|
| EL10 V1 : le bandeau de C14 C renvoie vers « Aujourd'hui » alors que le premier pas est sur la page | Appliqué : le bandeau désigne le geste sur la page même (« Ton premier pas : l'exercice ci-dessous », lien d'ancre), « Aujourd'hui » reste un lien secondaire (4.2, C14 C) |
| RE10 W1 : jargon dans C14 et C10 a | Appliqué : C14 sans `returnTo`, sans D.221-5, sans chemin d'adresse (« la page d'où il vient », « le lien obligatoire pour renoncer au contrat », « la page des parcours ») ; C10 a « les phrases sont prêtes » au lieu d'un chemin de fichier. **Vérification de C1 à C14 sous cet angle (AS)** : trois retouches de même nature, C2 B (« `/abonnement` » devient « la page d'abonnement »), C7 (« DEBUTANT / INTERMEDIAIRE » devient « débutant / intermédiaire »), C11 A et B (idem) ; C9 « presque toujours » devient « six fois sur neuf ». C1, C3 à C6, C8, C10 b, C12, C13 sans jargon |
| RE10 W2, UX10 W2 : C11 B tait une conséquence ; « presque tous les clusters » ; la règle « repartie sans étape = pas de signal » dépend de C11 | Appliqué : « six clusters sur neuf, dont celui de l'article de blagues » (en-tête, 1.1, 4.2) ; la règle n'est neutre que si C11 = A, écrit en 4.2 ; C11 B et C disent leur conséquence (l'abonné venu de l'article de blagues ou d'un article sur la répartie partirait vers Machine à Café, ou choisirait lui-même) ; C11 A dit « aucun écart » |
| RE10 W3 : ligne « rencontre » de 0.2 | Appliqué : colonne « Manque restant », « aujourd'hui, ces pages mènent à Confiance, pas à une situation de rencontre » |
| UX10 W1 : page de succès, redirection ou bouton | Appliqué : la page de succès reste affichée avec un bouton « Continuer », sans redirection automatique (4.2, C14) |
| UX10 W3 : toucher sous deux catégories qualifiées | Appliqué : si aucune catégorie n'atteint le seuil, la rangée disparaît et seul « Une autre » reste (4.4) |
| UX10 W4 : l'essai présuppose son résultat | Appliqué : « il vérifie si le `src` atteint l'espace (le code lu dit que non) » (7.5 e) |
| UX10 W5 : fiche d'origine liée à un parcours | Appliqué : un conseil ou une vidéo rattaché à une étape compte comme étape d'origine pour la semaine 2, [À VÉRIFIER : rattachement existant dans les données] (4.2, ordre 2) |
| UX10 W6 : « discrets » contre 44 px | Appliqué : « compacts » (C13 B) |
| AS : résumé d'une page pour Thomas | Appliqué : en tête de document, sans jargon (contenu, changements pour l'abonné, 14 questions en une ligne, étalons) |
| Facultatif RE10 : C13 A avec la formule « rouvre ta décision du 06/05 » | **Non appliqué** (hors des retouches demandées) : C13 A marque déjà « va à l'encontre du pivot du 06/05 » |
| Points acquis des trois rapports | Conservés |

### A.2 Restes partiels des tours précédents

| Reste | Traitement |
|---|---|
| UX3 M13, UX2 N9, EL2 N14 ligne « Carnet » du tableau 1.1 d'INV | Refus d'en modifier le contenu : le document est celui de @product-manager ; 1.4 s'aligne sur T3 corrigé par la session |
| EL3 N5 carnets suivants à trois registres | Maintenu en option marquée avec date (C3 B), pas par défaut |
| UX2 N16 Guides | Refus maintenu et dit à Thomas (3.1, section 8) |
| UX1 panneau « Plus » et budget d'en-tête | Refus valable maintenu : le dessin reste à @ux et @design ; le test sur rendu est prévu (6.2) |
| 264 décryptages pour 149 vannes actives | Hypothèse de décryptages de vannes retirées, non vérifiée en base [À VÉRIFIER] |

## Annexe B. Ce qui reste inconnu

- Ce que veulent les abonnés : presque aucune donnée (4 abonnés actifs au 02/11, 0 vote réel, résultat du quiz non stocké, favoris et likes non extraits) ; aucun [MESURÉ A] ; les capteurs de 7.7 y répondent peu à peu.
- Verbatims d'internautes : aucun ; lecture manuelle de Reddit, de jeuxvideo.com et des commentaires de vidéos à faire par Thomas ou la session si l'accès le permet.
- **Ce que l'espace reçoit réellement après un abonnement depuis un article** : `returnTo` oui (parcours associé) ; `src` relayé jusqu'à `/register` mais non transmis au paiement (vérifié dans le code) ; essai réel au lot 0 (7.5 e) pour vérifier et fixer la destination de C14.
- **Où arrive l'abonné après connexion et paiement** : question C14 (Q8 du brief), à poser.
- **Nombre de vannes actives par catégorie** (SOIREES, BOULOT, PARENTS, DATING) et de celles déjà servies au contenu du jour : à lire en base avant E5 ; il fixe le seuil minimal du toucher (7.5 f).
- Nombre d'articles du blog qui apportent une information au-delà du parcours par défaut (taille de la correspondance par article, hors V1) ; slugs de la table `blog-encarts.ts` ; rattachement des conseils et vidéos aux étapes de parcours.
- Relecture du carnet : tour de relecture de H10 corrigée ; diff complet de `2026-11.json` ; relecture d'octobre et de ses champs non relus.
- Part des abonnés qui arrivent avec un signal, dont la part venue d'un article (mesure indirecte par `src` dans le tunnel, à confirmer avec @data-analyst) ; répartition du geste « Où veux-tu être plus à l'aise ? ».
- Durées d'étape : essai chronométré avec un lecteur.
- Découpage exact des 4 autres parcours ; nombre de défis par conseil et par vidéo.
- Rendement réel des répliques en situation : mesuré au lot 1 (7.3).
- Nombre exact de lettres au format A ; valeur de Q10 et de Q5 du brief.
- Application des phrases de @legal aux fichiers de confidentialité et de CGU ; phrase de @legal pour le signal de C9 B ou C, pour une source d'article retenue sur le compte, ou pour une liste de vannes par abonné.
- Seuils X et Y et effectif minimal de la règle de décision à J60 (@data-analyst).

## Annexe C. Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona (cas d'essai Yanis, Sophie, Marc) | testeur | Lire 3 fiches de chaque type, jouer la rafale (avec et sans compte à rebours), le bloc du contenu du jour avec son toucher (y compris au clavier et au lecteur d'écran) et « Mes questions », dire ce qui sonne cours ou pèse, et jouer les questions de test de 4.3 | Le risque n°1 (ton scolaire, pression du chrono, mauvais aiguillage) ne se voit pas à l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter répliques, détournements, sorties sur la barre Alexa, dont la règle « on rit avec, pas contre » | 180 répliques, 30 sorties, 60 détournements, plus le régime mensuel et les réponses « Situation à gérer » | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude (prérequis 7.5) | Règle anti-invention, humoristes récents | Haute |

Handoff vers @agent-factory si Thomas valide le périmètre.
