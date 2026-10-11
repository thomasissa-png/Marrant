# Itération 6, relecture UX des étalons du Parcours Boulot (angle : la lectrice avant de payer, puis Thomas qui décide, avec le choix 7 en nouveauté)

Fichier noté : `docs/copy/etalons-parcours-boulot-s19.md` (non modifié, numéros de lignes = ce fichier, 395 lignes).
Lu : ce fichier en entier, ma notation d'itération 5, l'historique des corrections, la spec s17 (§1 et §3), `founder-preferences.md` (07/10 et 08/10, plus la ligne du 03/10 sur les « go » globaux).
Code vérifié : `apps/web/prisma/schema.prisma` (l.232-240) : `ABSURDE` existe dans `TipCategory`, la catégorie proposée pour le PS s'importe sans migration. Aucun autre affichage à vérifier ce tour.
Hors note, comme demandé : le texte des cinq conseils validés à l'aveugle (étapes 1, 3, 4, 5, 6).
Recomptés un à un et exacts : description B 73 mots (18 + 37 + 18), phrase `[SI 6B]` 37 mots, titre de page 60 caractères (B : 56), positions du quiz B, D, A, réponse type de 9 numéros (tableau l.11-21, réponse l.26, liste l.27-35, handoff l.385 : identiques).

## Note

| Critère de la grille | Note | Pourquoi, en une ligne |
|---|---|---|
| Vitrine (étape 1) | 10 | Sans parole, sans envoi, repli visio écrit, scène de 99 mots, `why` de 39 mots, trois `<p>` nommés au handoff. Rien à corriger. |
| Peur « me griller » | 10 | Y compris l'étape 2, la seule où un écrit peut partir : faible enjeu entre collègues, brouillon qui compte, test « présentable si ton chef le lit », repli sur le dernier mail déjà envoyé, critère de réussite qui n'exige aucun envoi. L'effet pour la lectrice reste sans risque pro. |
| Progression d'exposition | 10 | Tableau du §7 complet, un repli par étape, titres 5 et 6 qui annoncent une limite. |
| Fiche et titre de page | 10 | Trois champs, trois idées, `title` écrit, titre A à 60 caractères sans « drôle / bureau / humour ». |
| Quiz | 10 | B, D, A, explication toujours affichée, Q3 écrite pour la visio. |
| Vidéos | 10 | Choix 8 cohérent (aucune vidéo découpée avec le a), règle de sortie, `[À MINUTER, seulement si 8b]`. Limite connue inchangée : aucune vidéo visionnée, couverte par la règle de sortie. |
| Décision pour Thomas | 8 | Choix 1 à 9 exacts et complets. Mais le 7 est une exception à une règle d'or P0 rangée dans le raccourci « Je suis tes recos » (correction 1), il est écrit avec du vocabulaire de relecteur (correction 2) et la sortie d est incomplète (correction 3). |
| Traces caduques | 9 | Restent une version abandonnée que Thomas n'a jamais vue (« registre officiel », l.104) et des numéros de tour (correction 2). |

**Note globale : 9,5/10** (moyenne 9,6, arrondie vers le bas : la correction 1 touche une règle P0 du fondateur).
**0 correction bloquante pour la présentation, 4 corrections pour atteindre 10** (la 1 est la plus importante).

## Le choix 7 en bref (réponse à la question posée)

**Lisible : presque.** Le tableau dit l'essentiel en une ligne (l.19) : le PS en ligne est sous la barre, sept tours n'ont pas fait converger la chute, tu choisis parmi trois chutes ou tu relances. L'honnêteté est bonne : l'exception à la règle d'or est nommée trois fois, la reco avoue que son dernier verdict est « sous la barre » (l.118), et la décision est dite sienne. Il manque trois choses que le texte ne donne pas à un fondateur pressé : ce que chaque chute change pour la lectrice (rien, voir ci-dessous), que c n'a jamais été relue (dit seulement au §1), et ce que d coûte vraiment.

**Décidable : pas encore à 10.** Deux écueils. (1) La phrase « Je suis tes recos suffit » (l.26) englobe le 7 : un « go » global vaudrait donc levée d'une règle d'or P0, ce que Thomas a écrit lui-même qu'il ne veut pas (03/10 : « Un go global sur un lot ne vaut jamais levée d'un [CHOIX UTILISATEUR] déjà écrit », cas du « 1 500+ »). (2) Le texte du §1 parle comme un relecteur : « converger », « ressort », « critique A / B », « tour 12 / 13 », « modèle de référence de l'audit ». Thomas a demandé du texte « sans jargon : problème, effet, ce qu'on fait » (07/10).

**Effet pour la personne : sans risque pro.** Vérifié sur le défi du PS (l.109) : message « à faible enjeu, entre collègues » ; « présentable si ton chef le lit » ; « si tu hésites, garde le PS en brouillon : il compte quand même » ; repli « écris le PS que tu aurais ajouté au dernier mail sérieux » ; réussite = une phrase dont la version rectifiée est la fin, sans envoi exigé. Le §7 (l.331) le répète et la description B l'annonce (l.134). La chute choisie ne change que l'exemple lu par la lectrice, pas ce qu'elle doit faire : a, b et c sont équivalents pour elle. Seul bémol de contenu, traité en correction 4 : c.

## Parcours de Thomas (cognitive walkthrough, lecture du haut vers la ligne 7 du tableau)

| Étape | Sait-il quoi faire ? Voit-il l'action ? Le but est-il lié à l'action ? Feedback ? |
|---|---|
| En-tête (l.3-7) | Oui : cinq paragraphes courts, tableau des choix dès la ligne 9. |
| Ligne 7 du tableau | Oui pour l'enjeu. `[FRICTION H2]` : à l'étape « choisir a, b ou c », Thomas ne voit pas la chute dans son mail ni lequel des trois textes est déjà passé une fois au niveau. Solution : correction 2. |
| Réponse type (l.26) | `[FRICTION H5]` : « Je suis tes recos » sans lettre déclencherait une exception P0. Solution : correction 1. |
| §1, choix 7 (l.103-118) | Oui pour le « pourquoi c'est toi ». `[FRICTION H2]` : jargon de relecture (correction 2). `[FRICTION H1]` : la sortie d ne dit pas si le parcours attend ni si l'ancien PS reste en ligne (correction 3). |

## Réglé depuis l'itération 5 (vérifié, à ne pas défaire)

1. Trois `<p>` nommés avec fichiers et lignes, plus `parcours-jsonld.ts` et `llms-parcours.ts` à contrôler (l.386 e).
2. Choix 8 : a = aucune vidéo découpée, même pour Haroun et Rollman « enterrements » ; extraits seulement avec le 8b.
3. Titres des étapes 5 et 6 corrigés, description B recomptée.
4. Phrase du test : « Un seul test pour toute la suite », plus de ton scolaire.
5. En-tête allégé, faits vidéo dits au début du §6 (une fois).
6. Fary seulement au signalement 11 (d) ; « 96 avant » et « ne répète plus » disparus ; plus de lignes vides en fin de fichier.
7. Propriétaire de la décision RC8 (@product-manager, défaut écrit).
8. `title` « Parcours Boulot » dans les champs du seed.
9. Vanne du tuteur écartée avec son critère.
10. PS inséré : les neuf passages qui en dépendent sont alignés (tableau, description B, témoignage A, vannes de l'étape 2, Croce « avion », §7 deux fois, handoff). Vérifiés un à un, aucun écart.

## Corrections non bloquantes

**1. « Je suis tes recos » ne doit pas valoir exception à la règle d'or.**
Emplacement : l.26 (« Je suis tes recos suffit ... 7 a »), l.33 (numéro 7), l.383 (inscription « avec sa réponse mot pour mot »), l.385 (« Aucune condition dans la réponse »).
Problème : la règle d'or du 08/10 est un `[CHOIX UTILISATEUR]` P0. Le document fait de l'exception la valeur par défaut du raccourci : un « Je suis tes recos » seul vaudrait « 7 a » et serait inscrit comme tel dans `founder-preferences.md`. Thomas a écrit le 03/10 qu'un « go » global ne lève pas un choix déjà écrit.
Correction :
- l.26 : « « Je suis tes recos » suffit pour 1 à 6, 8 et 9. Pour le 7, écris la lettre (a, b, c ou d), parce que a, b et c lèvent une règle que tu as posée. Sans lettre, le 7 reste sans réponse : l'étape 2 attend, comme avec d. »
- Réponse type : « 1 oui, 2 B, 3 A, 4 A, 5 B, 6 B, **7 à écrire (reco : a)**, 8 a, 9 oui ». Reprendre la même forme l.385.
- l.383 : n'inscrire l'exception que si la réponse contient la lettre a, b ou c, citée mot pour mot.

**2. Choix 7 : le dire dans les mots de Thomas, et lui montrer ce qu'il choisit.**
Emplacement : l.19 (ligne 7 du tableau), l.104, l.112-114, l.41, §1 en général.
Problème (quatre points) :
- Le tableau met c au même rang que a et b sans dire qu'elle n'a jamais été relue, et ne dit pas que a et b ont déjà été jugées « au niveau » une fois. Ce qui change pour la lectrice n'est pas dit : rien (le défi est le même, seul l'exemple change). La cellule fait environ 100 mots.
- L.104 raconte une version que Thomas n'a jamais vue : « Le ressort « registre officiel » a été abandonné (trop proche d'un modèle de référence de l'audit) ». Sans effet sur sa décision.
- L.112-114 : « tour 12 », « tour 13 », « critique A », « critique B », « après correction d'une faute » ; l.104 et l.115 : « converger », « ressort ». Trop de mécanique pour un choix de trois lignes.
- Le mail n'est jamais montré avec son PS : l.108 dit « seule la dernière phrase change, voir ci-dessous », Thomas doit assembler seul.
Correction :
- Ligne 7 du tableau, colonne Options : « a « mon reflet dans l'écran » (au niveau une fois, sous la barre à la dernière relecture) / b « la touche Entrée » (idem) / c « son remplaçant » (jamais relue) / d relancer la relecture ». Colonne « Ce que ça change » : « Pour la lectrice, a, b et c sont équivalents : le défi est le même, seul l'exemple qu'elle lit change, et rien n'est à envoyer. a, b ou c lève ta règle d'or pour cette fois ; d la garde, l'étape 2 attend. » (environ 45 mots).
- L.104 : retirer la phrase du « registre officiel » ; garder « le conseil repose sur un faux rectificatif : les deux relecteurs le jugent au niveau (technique, défi, règles du site). Seule la dernière phrase du PS n'a pas passé deux fois de suite. »
- L.112-114 : une ligne par chute, au format « Verdicts : au niveau chez les deux relecteurs une fois, sous la barre chez les deux à la dernière relecture ». Pour b, ajouter « une faute corrigée entre-temps » seulement si Thomas doit le savoir ; sinon retirer. Retirer « tour » des phrases lues par Thomas ; les numéros restent au handoff.
- Avant les trois chutes, montrer une fois le mail complet avec la chute a (Bonjour Inès ... Bien cordialement, Camille. PS : ...), puis dire « b et c ne changent que la fin de cette dernière phrase ».

**3. Sortie d : dire ce que ça coûte à Thomas et ce que devient l'ancien PS.**
Emplacement : l.115 (option d), l.118 (« Dans tous les cas, l'ancien conseil ne reste pas en ligne »), l.383, l.386 (2).
Problème : l.118 promet que l'ancien conseil quitte la ligne dans tous les cas, mais le handoff pour d dit seulement « ne rien importer ». L'ancien PS (`cmmw0tqkc000smw62bo1yfeyg`) est aujourd'hui en ligne et sous la barre : personne n'a la consigne de le retirer. Et « l'étape 2 attend » ne dit pas si la mise en ligne du Parcours Boulot attend elle aussi, ce qui est la vraie conséquence de d pour Thomas.
Correction :
- l.115 : ajouter une phrase d'effet, par exemple « Avec d, la mise en ligne du Parcours Boulot attend que l'étape 2 soit prête `[HYPOTHÈSE : à confirmer par @orchestrator, l'interrupteur de publication peut aussi laisser l'étape 2 pour plus tard]`. »
- l.386 (2) : « si d : retirer l'ancien PS (soft delete, réversible) dès la réponse, ne rien importer pour l'étape 2 ». Sinon, retirer « dans tous les cas » de l.118 et écrire ce qui se passe réellement.

**4. Chute c : un risque de lecture que le texte ne nomme pas.**
Emplacement : l.114.
Problème : « ... pas au clavier, mais à son remplaçant » peut se lire comme un collègue qui en remplace un autre (intérim, arrivant). C'est la seule des trois chutes où le PS peut sembler viser une personne, donc la seule qui contredit le garde-fou du conseil (« la scène, c'est toi et un objet »). Elle n'a en plus jamais été relue : on propose à Thomas une exception pour un texte que personne n'a jugé.
Correction : au choix, retirer c de l'offre (restent a, b et d), ou la garder avec cette phrase : « c peut se lire comme un collègue qui en remplace un autre : elle n'a jamais été relue et c'est la moins sûre pour la règle « ne viser personne » ». Reco UX : la retirer, une exception pour un texte jamais lu est la plus difficile à défendre devant la règle d'or. Si elle est retirée, mettre à jour l.19, l.33 et l.118.

## Points solides à ne pas défaire

Étape 1 sans parole ni envoi ; tableau de différence avec Machine à Café 2 et Confiance 1 ; tableau d'exposition du §7 avec un repli par étape ; défi du PS en trois filets de sécurité (faible enjeu, brouillon, repli sur le dernier mail) ; test unique en dernier paragraphe des étapes 2 à 6 ; exception à la règle d'or nommée comme décision de Thomas ; reco qui avoue le dernier verdict de a ; réponse type de 9 numéros ; colonne « Ce que ça change pour la lectrice » ; titre A à 60 caractères ; description B de 73 mots ; quiz B, D, A ; règle de sortie des vidéos ; `PARCOURS_META` et interrupteur de publication au handoff.

## Pour l'itération 7

À re-vérifier : (1) réponse type avec « 7 à écrire » et inscription conditionnée à une lettre ; (2) ligne 7 du tableau, ligne par chute sans « tour », mail complet montré une fois ; (3) conséquence de d et retrait de l'ancien PS ; (4) c retirée ou marquée. Avec les 4 : 10.
