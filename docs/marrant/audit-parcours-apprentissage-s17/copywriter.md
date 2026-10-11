# Audit s17 : contenu des parcours d'apprentissage (@copywriter)

> Périmètre : C1 (quantité et couverture), C2 (qualité pédagogique), C12 (promesse/réalité), avis sur C7 (le contenu justifie-t-il de payer ?).
> Date : 07/10/2026. Code à jour 79b11f3. AUDIT SEULEMENT : aucun fichier de contenu ou de code modifié.

## 1. TL;DR

1. Le fond est sain (tutoiement, exemples drôles, un exercice « aujourd'hui » par étape, progression logique sur Machine à Café et Confiance), mais c'est un produit mince : 3 parcours, 13 étapes, environ 4 h annoncées, soit 3 % des 400 conseils du catalogue.
2. Sur les 3 étapes gratuites (les seules que le visiteur voit), le texte qui présente l'étape ne décrit pas le conseil réellement affiché (Machine à Café 1, Répartie 1, Confiance 1) : le visiteur lit une promesse, puis autre chose. Même défaut très probable sur Répartie 2 et Confiance 3.
3. Les « vannes à pratiquer » annoncées dans chaque étape n'existent pas à l'écran (une phrase « 5 vannes sélectionnées… Découvre-les dans le catalogue », sans lien vers ces 5 vannes), alors que la page Premium promet « chaque étape avec son conseil, ses vannes, ses vidéos et son quiz ».
4. Les quiz ne mesurent rien (38 bonnes réponses sur 54 sont la 2e option, mauvaises réponses caricaturales, « ce quiz ne compte pas ») et une vidéo de l'étape 3 de Machine à Café pointe vers le mauvais sketch dans les fichiers.
5. Avis C7 : le contenu seul ne justifie pas un abonnement récurrent. Un abonné peut tout finir en un mois (aucun déblocage échelonné), sans nouveau parcours derrière. Il justifie un achat ponctuel (formule annuelle) plutôt qu'un mensuel.

## 2. Notes

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C1 Quantité et couverture | 4 | 13 étapes, 3 parcours (3 / 4 / 6 semaines), ≈ 245 min annoncées. Sophie : 3 étapes, dont 2 payantes. 13 conseils sur 400 (3 %), 22 vidéos distinctes sur 89 (25 %), vannes jamais affichées. Durée : la promesse tient sans les vidéos (≈ 12 min/étape), pas avec (≈ 22 à 30 min). |
| C2 Qualité pédagogique | 5 | Exercices concrets et faisables, voix juste, bonnes étapes (Répartie 3, Confiance 2), mais 5 étapes sur 13 avec texte d'étape et conseil désalignés, quiz décoratifs, structure « fiche de cours ». Moyenne des étapes : 6,0 (de 4 à 8). |
| C12 Cohérence promesse/réalité | 4 | « Vannes à pratiquer » non tenues, « progression mesurable » = nombre d'étapes et XP seulement, message « Parcours terminé ! » faux à 4 étapes, « Termine l'étape 1 pour débloquer » alors que valider l'étape 1 est payant, durée doublée par les vidéos. |
| Avis C7 (le contenu justifie-t-il de payer ?) | 4 | 12 étapes payantes sur 13, ≈ 4 h de matière déclarée, consommable en 3 à 4 semaines, rien de nouveau ensuite (« De nouveaux parcours » = à venir). Valeur one-shot, pas récurrente. |

## 3. Évaluation étape par étape

Méthode et limites : étape 1 de chaque parcours = texte vu en prod (captures s17 `desktop_parcours_*-pleine.png`). Étapes 2 et suivantes (payantes) = lues dans `docs/content/parcours-seed.json` (textes d'étape, vidéos, quiz) et, pour le conseil, dans `docs/copy/audit-vannes-s14/parcours-conseils-reecrits.json` / `conseils-neufs.json` / `conseils-seed.json` : le texte exact en base n'a pas pu être relu sans abonnement. Durées = estimation (lecture 200 mots/min, quiz 40 s/question, exercice 5 à 10 min, durées vidéo du seed), **non mesurées**.

Légende exercice : « faisable » = réalisable le jour même sans matériel ni public imposé.

| Étape | Objectif pédagogique | Exercice concret | Durée estimée / promesse | Voix et exactitude | Note |
|---|---|---|---|---|---|
| MàC 1 « Des vannes courtes, faciles à ressortir » (gratuite) | Flou : le titre promet des vannes courtes, le conseil affiché enseigne le « faux secret » (« Ça reste entre nous »). 2 questions de quiz sur 4 portent sur le timing (étape 2), aucune sur le faux secret. | DÉFI FAUX SECRET, faisable, avec repli vocal si seul. Très bon. | ≈ 23 min (vidéos 11 min 25) / 15 | Très bonne voix, exemple soigné (« la plante du couloir »). | 6 |
| MàC 2 « Sentir le bon moment » | Clair : placer sa phrase dans le blanc après le rire. Quiz aligné. | DÉFI RYTHME : observer sans risque (parfait pour Sophie). | ≈ 22 min (vidéos 10 min 25) / 15 | Voix juste. Vidéo « Le mariage » réutilisée en Répartie 2. | 7 |
| MàC 3 « Raconter une anecdote qu'on écoute jusqu'au bout » | Partiel : le module promet « structure, détails, chute », le conseil n'enseigne que les détails ; le quiz teste la chute et l'ordre contexte, tension, chute. | DÉFI PRÉCISION (3 détails précis), faisable. | ≈ 23 min (vidéos 11 min 30) / 15 | Voix juste. **Vidéo 1 : mauvais identifiant** (voir COP-03). | 5 |
| Rép 1 « Tes premières répliques » (gratuite) | Contradictoire : le texte d'étape annonce « accuser réception, reformuler : 3 réflexes », le conseil affiché est l'ironie (dire le contraire de ce qu'on pense). Le quiz demande une « répartie bienveillante » (réponse correcte = exagération, pas ironie). | DÉFI IRONIE DOUCE : dépend d'une occasion, sans repli si elle ne se présente pas. | ≈ 27 min (vidéos 15 min 15) / 20 | Voix très bonne, ton rassurant pour timides. | 5 |
| Rép 2 « Le rythme et les silences » | Texte d'étape : silence avant la réplique, regard, rythme. Conseil (remplacé le 30/09) : glisser une phrase dans le blanc entre deux chansons. Quiz : le silence après le rire. Trois angles différents. | DÉFI SILENCE MUSICAL, une phrase ce soir, faisable. | ≈ 26 min (vidéos 14 min 25) / 20 | Voix juste. | 5 |
| Rép 3 « Retourner les piques avec le sourire » | Clair et central : accepter, exagérer, retourner. Quiz aligné sur la méthode. | DÉFI CHAMBRAGE écrit, solo, faisable. | ≈ 26 min (vidéos 14 min 50, Lilia déjà vue en étape 1) / 20 | Meilleure étape de Répartie. | 8 |
| Rép 4 « Improviser sur l'inattendu » | Clair (rebondir sur un raté, « oui, et »). | DÉFI REBOND : rater une vanne exprès devant un groupe. Risque social élevé pour un public « timide », étape étiquetée EXPERT dans un parcours « Débutant → Intermédiaire ». | ≈ 26 min (vidéos 13 min 45, Haroun déjà vu en étape 1) / 20 | Voix juste. | 6 |
| Conf 1 « Redécouvrir ce qui te fait rire » (gratuite) | Contradictoire : texte d'étape « aucune vanne à réussir, juste regarder et noter, pas d'exercice à rater » ; conseil « Énoncer la règle non écrite » ; exercice « énonce à voix haute » ; quiz sur un « journal d'observation comique » jamais enseigné. | DÉFI RÈGLE NON ÉCRITE : une ligne, pas de repli, parler à voix haute dans un lieu public. | ≈ 23 min (vidéos 10 min 40) / 20 | Voix douce, adaptée à Marc, mais l'exercice casse la promesse du texte. | 4 |
| Conf 2 « Rire de toi sans te rabaisser » | Très clair : un fait, pas un verdict. | DÉFI FAIT DIVERS (verdict puis fait, envoi à un ami), faisable. | ≈ 29 min (vidéos 16 min) / 20 | Meilleur passage pour Marc. Le quiz protège (« quand l'humour masque une vraie souffrance »). | 8 |
| Conf 3 « L'œil de l'observateur » | Hybride : titre et description parlent d'observation, le conseil est « L'humour de trentenaire » (références d'avant), « why » parle de MSN et de K7. | DÉFI NOSTALGIE, un seul geste d'avant, faisable. | ≈ 30 min (vidéos 16 min 45) / 20 | « La vie avant Internet » est approximatif pour un homme de 34 ans (né vers 1992). | 5 |
| Conf 4 « Être à l'aise en groupe » | Clair : observer, puis 3 remarques. Quiz aligné. | DÉFI INTÉGRATION (15 min d'observation, 3 remarques), riche et faisable. | ≈ 28 min (vidéos 15 min 40) / 20 | Voix juste. | 7 |
| Conf 5 « Jouer avec les registres » | Clair : décalage de registre. Quiz de reconnaissance de technique, assez facile (reprend l'exemple du conseil). | DÉFI QUOTIDIEN sur 3 jours (commentateur sportif, documentaire, avocat). | ≈ 28 min (vidéos 15 min) / 20 | Voix juste. | 7 |
| Conf 6 « Affirmer ton style personnel » | Clair, mais l'exercice (version seed : « tes 10 dernières vannes qui ont fait rire », puis « un mois ») suppose ce que le persona n'a pas. Aucune clôture ni bilan. | DÉFI STYLE, faisable en version courte (3 dernières fois où on a ri). | **≈ 90 min** (vidéos 77 min dont « Pulsions », spectacle complet de 72 min) / 20 | Voix juste. Après cette étape, le site renvoie vers Machine à Café (3 étapes débutant). | 5 |

Lecture d'ensemble : exercices concrets sur 13 étapes sur 13 (point fort), progression logique sur Machine à Café (vannes, moment, histoire) et Confiance (observer, rire de soi, groupe, registres, style). Sur Répartie, la méthode centrale arrive en semaine 3 et l'étape 4 est étiquetée EXPERT. Difficulté des conseils : Machine à Café 3 fois DEBUTANT sous une étiquette « Débutant → Intermédiaire » ; Confiance « Débutant → Expert » pour le persona le plus fragile.

## 4. Niveau offre (13 étapes, semaines réelles, personas, catalogue)

### 4.1 Volume réel

| | Machine à Café | Répartie | Confiance | Total |
|---|---|---|---|---|
| Étapes (= semaines annoncées) | 3 | 4 | 6 | 13 |
| Durée annoncée | 3 × 15 = 45 min | 4 × 20 = 80 min | 6 × 20 = 120 min | 245 min (≈ 4 h) |
| Vidéos (durées du seed) | 33 min 20 | 58 min 15 | 151 min 15 (dont 72 min « Pulsions ») | ≈ 4 h |
| Durée estimée vidéos incluses | ≈ 70 min | ≈ 105 min | ≈ 230 min (≈ 160 hors « Pulsions ») | ≈ 6 h |
| Durée estimée hors vidéos | ≈ 35 min | ≈ 50 min | ≈ 70 min | ≈ 2 h 40 |
| Quiz (questions) | 12 | 17 | 25 | 54 |
| XP des étapes (hors +100 de fin) | 225 | 375 | 700 | 1 300 |
| Étapes payantes | 2 sur 3 | 3 sur 4 | 5 sur 6 | 12 sur 13 |

Lecture : la promesse « 15 à 20 min/semaine » (contrainte [CHOIX UTILISATEUR], non remise en cause) tient si les vidéos sont facultatives, et double si elles sont regardées en entier. Le chiffre ne doit pas bouger : c'est le contenu qu'il faut ajuster (vidéos plus courtes ou extraits, mention « facultatif »).

**Semaines de contenu réel** : 13 semaines au total, mais jamais enchaînées : chaque parcours est indépendant, et rien n'est échelonné (voir 4.3). Un membre qui suit le rythme annoncé consomme 3, 4 ou 6 semaines ; un membre pressé consomme un parcours en une soirée (seul verrou : valider l'étape N-1 pour ouvrir la N).

### 4.2 Couverture des personas

- **Yanis (Répartie, 4 étapes)** : situations TD, coloc, soirée, BDE, premier rendez-vous. Cohérent. Mais seulement 4 étapes pour « progresser en répartie », dont une étiquetée EXPERT.
- **Sophie (Machine à Café, 3 étapes)** : seule situation pro du site, et la plus courte. Réunion, afterwork, pause. Manquent : le mail et Slack, le « tu fais quoi dans la vie ? », le networking, une remarque à un supérieur. Si elle répond « boulot » et « je ne sais pas quoi répondre » au quiz d'orientation, elle est envoyée vers Répartie (`parcours-orientation.ts:28`, signal « repartie » prioritaire), dont aucun exemple ne se passe au travail.
- **Marc (Confiance, 6 étapes)** : la plus longue, mais courte en texte (un conseil de 80 à 110 mots par étape, 2 vidéos, 4 questions). « Manque de profondeur » (frustration du persona) y reste vrai. Aucune étape sur la reprise des contacts, les rendez-vous ou la peur du jugement ; rien non plus pour dire où s'arrêter si l'humour masque une vraie difficulté (seul le quiz de l'étape 2 le dit). Fin de parcours : renvoi vers Machine à Café, un parcours débutant de 3 étapes.
- **Progression mesurable** (promesse de la marque et attente explicite de Marc) : le site mesure des étapes validées et des XP. Le score du quiz n'est pas conservé (`progress/route.ts` n'écrit que `completedSteps`), aucun auto-bilan (« j'ai testé, ça a marché ? ») alors que chaque exercice demande de « noter la réaction ». Mesure de la participation, pas de la progression.

### 4.3 Valeur d'abonnement (avis C7)

- Le contenu payant est **fini et consommable vite** : 12 étapes, ≈ 4 h annoncées, sans déblocage échelonné ni réutilisation (pas de révision, pas de « refais l'exercice avec une nouvelle situation »). Après un mois, rien de nouveau côté parcours (la rubrique « De nouveaux parcours » est annoncée au futur, ce qui est honnête).
- À 2,99 € par mois, la logique est « payer 1 mois, tout faire, résilier » : sain pour le client, faible pour un revenu récurrent. La formule annuelle (24,99 €) colle mieux à ce contenu fini.
- Ce qui peut justifier le récurrent n'est pas dans les parcours : carnet mensuel (15 fiches puis 30, décidé le 03/10) et catalogue au-delà de 10/3/3. Les parcours devraient s'y adosser (fiches de révision, exercices du mois), sinon ils sont une porte d'entrée sans suite.
- Ce que les parcours promettent de payant et ne montrent pas : les vannes (COP-02). La page de vente décrit « chaque étape avec son conseil, ses vannes, ses vidéos et son quiz » ; la vanne est la matière la plus désirable du site et elle est absente.

### 4.4 Exploitation du catalogue

| Ressource | Catalogue | Utilisé par les parcours | Part |
|---|---|---|---|
| Conseils | 400 (prod) ; 130 dans `conseils-seed.json` | 13 | 3 % (10 % du seed) |
| Vidéos | 89 | 22 distinctes (26 emplacements : 4 vidéos reprises) | 25 % |
| Vannes | ≈ 602 | 62 identifiants distincts (65 emplacements), **dont 3 absents du seed (82, 85, 180)**, et **jamais affichés** | 10 % sur le papier, 0 % à l'écran |

Conseils du seed directement utiles aux personas et non utilisés par un parcours (à vérifier en base avant tout usage : statut actif et qualité ; ne pas reprendre « Retrouver sa voix drôle après une pause sociale », « La répartie bienveillante » et « Le silence après le rire », désactivés le 30/09 comme sous la barre) :
- Sophie : « Survivre aux réunions avec humour », « L'humour digital : mails, Slack et textos pro », « La vanne de couloir : l'art du timing entre deux réunions », « L'afterwork : passer de collègue à personne drôle », « Survivre (et briller) au networking pro avec humour ».
- Yanis : « La répartie en coloc : 10 secondes pour s'affirmer », « L'humour en amphi », « Être drôle en soirée quand tu connais personne », « Les scripts de répartie prêts à l'emploi ».
- Marc : « L'humour en date : la règle des 80/20 », « Répondre aux questions gênantes avec classe (séparation, célibat...) », « Le « ah au fait » ».

### 4.5 Pistes (sans rien réécrire ici)

1. Aligner, étape par étape, texte d'étape, quiz et vannes sur le conseil réellement affiché (priorité aux 3 étapes gratuites, vitrine de l'offre). Décision fondateur à prévoir : le seed `parcours-seed.json` n'a été aligné qu'au niveau du titre et de la phrase « pourquoi » le 30/09.
2. Afficher les 5 vannes de chaque étape (texte + « pourquoi ça marche », déjà écrits dans le décryptage) ou retirer la promesse.
3. Allonger : Machine à Café et Répartie à 6 étapes chacun, Confiance à 8, en puisant dans les conseils ci-dessus ; une étape « bilan » en fin de parcours.
4. Rendre la progression lisible : auto-bilan après l'exercice (« ça a marché / à retravailler »), score du quiz conservé, page de fin qui résume ce qui a été appris.
5. Échelonner (une étape par semaine, option « tout débloquer ») pour que « 6 semaines » soit vrai et que le rythme hebdomadaire existe ; ou assumer « à ton rythme » partout.
6. Marquer les vidéos « facultatif » ou proposer un extrait de 3 minutes pour les formats longs ; remplacer « Pulsions (spectacle complet) » par un extrait.
7. Remplacer les quiz de reconnaissance par des mises en situation où deux réponses sont plausibles et réparties sur les 4 positions.

## 5. Constats

Format : problème / effet pour l'utilisateur / ce qu'on fait. Le détail technique est dans « Preuve ». Agent = qui corrige, effort = rapide, moyen ou long. Les décisions [CHOIX UTILISATEUR] (15 à 20 min/semaine, chiffres du site, « Imagine… » pour les exemples, humoristes cités) sont respectées et traitées comme des contraintes.

### COP-01 (P1) : le texte d'étape ne décrit pas le conseil affiché

- **Problème** : sur les 3 étapes gratuites, le paragraphe « Ce que tu vas apprendre », le format et le quiz racontent un autre cours que le conseil, l'exemple et l'exercice juste dessous. Cause : le 30/09 (option A), 5 conseils ont été remplacés en base et seuls `tipTitle` et la phrase « pourquoi » ont été réalignés (`REPLIT_ACTIONS.md` entrée « s14 (30/09/2026) : parcours, option A »).
- **Effet pour l'utilisateur** : le visiteur qui teste l'étape gratuite (celle qui doit lui donner envie de payer) lit « 3 réflexes : accuser réception, reformuler » puis découvre l'ironie ; il passe un quiz qui interroge sur autre chose que ce qu'il vient de lire. Sensation de brouillon, perte de confiance au moment de l'achat.
- **Ce qu'on fait** : relire les 13 étapes avec une règle simple : un seul enseignement par étape, repris tel quel dans le texte d'étape, l'exercice et le quiz. Commencer par MàC 1, Rép 1, Conf 1 (gratuites), puis Rép 2 et Conf 3.
- **Preuve** : `parcours-seed.json` MàC 1 `moduleDetail` l.24 / capture « faux secret » ; Rép 1 `moduleDetail` l.186 / capture « L'ironie bienveillante consiste à dire le contraire de ce que tu penses » ; Conf 1 `moduleDetail` l.401 / capture « énonce à voix haute » ; Rép 2 `moduleDetail` l.234 / `conseils-neufs.json` l.80 ; Conf 3 `moduleTitle` l.496 vs conseil trentenaire (`parcours-conseils-reecrits.json` l.56).
- **Persona touché** : les trois ; Marc surtout (Conf 1).
- **Agent / effort** : @copywriter, moyen. Décision Thomas requise sur les textes (calibrage d'étalons, P0 s8).

### COP-02 (P1) : les « vannes à pratiquer » n'existent pas à l'écran

- **Problème** : chaque étape annonce « Conseil technique + vannes à pratiquer… » et affiche « 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue », lien vers `/vannes` (liste générale). Les identifiants `jokeIds` ne sont lus nulle part (compte seulement). 3 identifiants n'existent pas dans le seed (82 et 85 en Répartie 2, 180 en Confiance 4). La page de vente promet « Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz ».
- **Effet pour l'utilisateur** : l'abonné cherche 5 vannes précises dans un catalogue de 600 sans pouvoir les trouver. Promesse payante non tenue sur la matière que le site vend le mieux. Un visiteur n'a aucune raison d'y croire.
- **Ce qu'on fait** : soit afficher les 5 vannes de l'étape (avec leur décryptage « Pourquoi ça marche » déjà en base), soit retirer « vannes à pratiquer » du format et de la page Premium. Vérifier les 3 identifiants absents.
- **Preuve** : `parcours-detail.tsx:244-262` (teaser) et `:714`, `premium-benefits.tsx:34-35`, capture `desktop_parcours_machine-a-cafe-pleine.png`, grep `jokeIds` (aucune résolution), `blagues-seed.json` (ids 82, 85, 180 absents).
- **Persona touché** : Sophie (veut des vannes à ressortir), Marc (veut de la variété).
- **Agent / effort** : @fullstack pour l'affichage, @copywriter pour la sélection ; moyen. Réserve : le statut actif des vannes en base n'a pas été relu (catalogue ramené à 125 validées le 30/09).

### COP-03 (P1) : mauvaise vidéo dans Machine à Café, étape 3

- **Problème** : l'étape annonce « Djimo, Quand il croise Carl Lewis » mais l'identifiant `57Ip2k3us_8` est, dans `videos-seed.json`, la vidéo « Thomas VDB, Bitcoin, JPEG et blockchain ». Le bon identifiant du sketch de Djimo est `tpIOLzv11qo` (vidéo n° 31).
- **Effet pour l'utilisateur** : l'abonné clique sur un sketch sur les cryptomonnaies sous la légende « le détail ultra-spécifique comme clé du storytelling » ; l'étape sur les anecdotes perd son exemple.
- **Ce qu'on fait** : corriger l'identifiant (une ligne) et vérifier les 21 autres identifiants dans le lecteur (les 21 autres concordent avec le seed, pas testés dans le lecteur).
- **Preuve** : `parcours-seed.json:127` vs `videos-seed.json:547` (id 31) et `:1333` (id 74).
- **Persona touché** : Sophie.
- **Agent / effort** : @fullstack ou @copywriter, rapide. Réserve : non vérifié sur YouTube (étape payante, non vue en prod).

### COP-04 (P1) : la durée réelle dépasse la promesse dès qu'on regarde les vidéos

- **Problème** : 2 vidéos de 5 à 9 minutes par étape (10 à 17 min), plus lecture, quiz et exercice : ≈ 22 à 30 min par étape pour une promesse de 15 ou 20. Confiance 6 impose « Pulsions (spectacle complet) » : 72 minutes (≈ 90 min d'étape). Quatre vidéos sont reprises d'une étape à l'autre (Haroun et Lilia deux fois en Répartie).
- **Effet pour l'utilisateur** : Sophie (« contenu trop long ») et Marc, qui reprend pied, se retrouvent avec une étape qui prend une soirée. Risque d'abandon à l'étape 6, celle qui devrait être la plus gratifiante.
- **Ce qu'on fait** : ne pas toucher au chiffre (choix fondateur). Marquer les vidéos « facultatif » ou donner la minute de départ d'un extrait, remplacer « Pulsions » par un extrait court, varier les vidéos de Répartie.
- **Preuve** : durées dans `videos-seed.json` (ex. l.604 `PT72M00S`), tableau 4.1 de ce rapport (estimation, non mesurée).
- **Agent / effort** : @copywriter (choix des vidéos), rapide à moyen.

### COP-05 (P1) : les quiz ne testent rien

- **Problème** : 38 bonnes réponses sur 54 sont la 2e option (70 %), aucune n'est la 4e, une seule la 1re ; les mauvaises réponses sont des caricatures (« Humilier l'autre plus vite », « Quitter la pièce ») ; l'écran dit « ce quiz ne compte pas » et le score n'est pas conservé ; plusieurs questions portent sur ce qui n'est pas enseigné dans l'étape (timing en MàC 1, journal en Conf 1, structure et chute en MàC 3, silence après le rire en Rép 2). Le bouton de validation reste bloqué tant que le quiz n'est pas bouclé, quelle que soit la note.
- **Effet pour l'utilisateur** : on passe le quiz sans lire (toujours cliquer la 2e option), puis on est bloqué par un exercice sans enjeu. Pour Marc, « progression mesurable » ne repose sur rien.
- **Ce qu'on fait** : refaire les quiz après COP-01 (une question par notion enseignée, deux réponses plausibles, positions variées) ; décider si le score compte et s'il est montré.
- **Preuve** : comptage des `correctIndex` de `parcours-seed.json` (MàC 1,2,0,1 / 1,2,1,0 / 1,1,2,1 ; Rép 1,1,2,1 / 1,1,2,1 / 1,1,1,2 / 2,1,2,2,1 ; Conf 1,1,1,1 / 1,1,1,2 / 1,1,1,1 / 1,1,2,2 / 1,1,1,2 / 1,1,1,1,2) ; `parcours-detail.tsx:169` et `:763-771`.
- **Agent / effort** : @copywriter, moyen.

### COP-06 (P1) : 13 étapes ne portent pas un abonnement récurrent (avis C7)

- **Problème** : voir 4.3. Contenu fini, consommable en un mois, sans échelonnage ni suite, 92 % des étapes derrière le mur.
- **Effet pour l'utilisateur** : le membre qui a tout fait n'a aucune raison de rester ; celui qui hésite voit 3 parcours courts pour un abonnement mensuel.
- **Ce qu'on fait** : produire par lots (choix fondateur « contenu préparé à l'avance ») 8 à 12 étapes de plus en puisant dans les conseils non utilisés (4.4), échelonner ou assumer « à ton rythme », relier les parcours au carnet mensuel. Pousser l'annuel comme formule naturelle des parcours.
- **Agent / effort** : @copywriter + @creative-strategy, long. Décision Thomas.

### COP-07 (P1) : visiteur bloqué par un message circulaire

- **Problème** : sous l'étape 1, les étapes 2 et suivantes affichent « Termine l'étape 1 pour débloquer » avec un cadenas, et ne s'ouvrent pas. Or valider l'étape 1 est réservé à Premium. L'aperçu écrit pour ce cas (« Ce que tu vas apprendre » + bouton « S'abonner ») n'est donc jamais affiché à un visiteur.
- **Effet pour l'utilisateur** : le visiteur croit qu'un effort gratuit débloque la suite, finit l'étape 1, clique « Voir l'offre Premium » et comprend que non. Il ne voit jamais le contenu de l'étape 2 avant de payer (seul le résumé de la page `/parcours` lui reste).
- **Ce qu'on fait** : remplacer le message par la vraie condition (« Fait partie de Premium ») et ouvrir l'aperçu des étapes 2+ aux visiteurs.
- **Preuve** : `parcours-detail.tsx:540-544` (`canExpand = !isSequentiallyLocked`), `:611-615` (message), `:640` (aperçu seulement si étendu) ; capture `desktop_parcours_machine-a-cafe-pleine.png` (« +75 XP Termine l'étape 1 pour débloquer »).
- **Agent / effort** : @fullstack (logique) + @copywriter (message), rapide. Recoupe C4 : à rapprocher du rapport @ux.

### COP-08 (P2) : « Parcours terminé ! » affiché à tort 4 fois

- **Problème** : le message d'XP ajoute « Parcours terminé ! » dès que le gain est de 100 XP ou plus. Étapes à 100 XP ou plus qui ne terminent pas le parcours : Répartie 3 (100), Confiance 3, 4 et 5 (100, 125, 150).
- **Effet pour l'utilisateur** : l'abonné lit « Parcours terminé ! » à mi-parcours, ce qui casse la progression et la confiance dans le suivi. Par ailleurs la carte de fin annonce « 225 XP gagnés » alors que le bonus de fin (+100) a été crédité en plus.
- **Ce qu'on fait** : tester la complétion réelle du parcours au lieu du seuil de 100 XP ; afficher le vrai total.
- **Preuve** : `parcours-detail.tsx:757` ; `progress/route.ts:182-196` (+100 de fin) ; `parcours-detail.tsx:828`.
- **Agent / effort** : @fullstack, rapide.

### COP-09 (P2) : la source de vérité des conseils est la base, pas le seed

- **Problème** : le conseil de MàC 1 en prod (« faux secret ») diffère du conseil du même titre dans `conseils-seed.json` (« carnet de bureau »). Les audits qui lisent les fichiers (dont celui-ci pour les étapes payantes) peuvent donc se tromper, et aucun contrôle ne compare la base au seed.
- **Effet pour l'utilisateur** : aucun direct ; risque de corriger un texte qui n'est plus celui du site.
- **Ce qu'on fait** : exporter les 13 conseils de parcours depuis la base dans un fichier de référence, vérifié à chaque changement.
- **Agent / effort** : @fullstack, rapide.

### COP-10 (P2) : voix et forme

- **Problème** : (a) « blague » dans 9 réponses de quiz (`parcours-seed.json` l.56 ×2, 109, 352, 423, 428, 567, 673, 683) alors que la charte demande « vanne » ; (b) liste du programme en « Semaine N » et page d'étape en « Étape N » (la charte s11 §5 demande « Étape ») ; (c) page d'étape en fiche de cours : « Pourquoi cette étape ? », « Ce que tu vas apprendre », « Le conseil », « Exemple concret », « Exercice pratique », « Petit quiz avant de valider » (le premier et le deuxième bloc disent souvent la même chose) ; (d) étiquettes de niveau : « Débutant → Expert » pour Confiance, « Débutant → Intermédiaire » pour Machine à Café dont les 3 conseils sont DEBUTANT, Confiance déclaré INTERMEDIAIRE dans le balisage de recherche et EXPERT dans le seed ; (e) tirets cadratins dans le nom des 3 balisages « Course » de `/parcours` (`parcours/page.tsx:43,54,65`).
- **Effet pour l'utilisateur** : un ton un peu scolaire sur un site qui se veut « pote drôle » ; « Expert » décourage la personne qui revient d'une séparation.
- **Ce qu'on fait** : harmoniser (vanne, Étape, niveaux) ; fusionner « pourquoi » et « ce que tu vas apprendre » ; retirer les tirets des balisages. Tout nouveau libellé passe par des étalons.
- **Agent / effort** : @copywriter + @fullstack, rapide.

### COP-11 (P2) : exactitude et exercices à risque pour le persona

- **Problème** : (a) Confiance 3 : « Tu as connu MSN, les K7 et la vie avant Internet » pour un homme de 34 ans (né vers 1992) ; (b) Répartie 4 : rater une vanne exprès devant un groupe, dans un parcours « pensé pour les timides », sans repli en solo ; (c) Confiance 1 : parler à voix haute dans un lieu public sans repli, juste après « pas d'exercice à rater » ; (d) la fin de Confiance renvoie vers un parcours débutant de 3 étapes.
- **Effet pour l'utilisateur** : petites fausses notes qui font sentir que le texte n'a pas été écrit pour lui, et un exercice qui peut mal tourner pour la personne la plus fragile.
- **Ce qu'on fait** : ajouter un repli solo (message vocal, écrit) à chaque exercice qui exige un public ; reformuler « vie avant Internet » ; proposer après Confiance une suite adaptée (nouveau parcours ou étape bilan).
- **Agent / effort** : @copywriter, rapide.

### Points positifs à garder

Exercices « aujourd'hui » sur 13 étapes sur 13 ; Rép 3 et Conf 2 (méthode en 3 temps, « un fait, pas un verdict ») ; garde-fou de Conf 2 sur la souffrance ; messages d'erreur et de fin dans la bonne voix (« Doucement, tu cliques plus vite que ton ombre », « Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde ») ; exemples « Imagine Léa / Tom / Julien » conformes au choix fondateur ; promesse de futur honnête (« De nouveaux parcours », rubrique à venir) ; aucun tiret cadratin dans le texte visible du seed.

## 6. Les 3 pires passages (extraits exacts)

**1. Confiance, étape 1 (gratuite) : le texte promet l'inverse de l'exercice** (COP-01)

> Pourquoi : « On démarre en douceur : aucune vanne à réussir, juste regarder ta journée et remarquer les règles que tout le monde suit sans jamais les dire. C'est souvent par là que la légèreté revient. »
> Ce que tu vas apprendre : « Regarder ton quotidien avec un œil comique, noter ce qui te fait sourire, comprendre ce qui te fait rire, toi. Ici, pas d'exercice à rater : chaque détail noté compte déjà. »
> Exercice pratique affiché juste en dessous : « DÉFI RÈGLE NON ÉCRITE : aujourd'hui, énonce à voix haute une règle non écrite d'un lieu public que tu traverses. »
> Quiz, question 2 : « Le journal d'observation comique, c'est : » (aucun journal n'est enseigné dans l'étape).

Pourquoi c'est le pire : c'est l'étape d'entrée du persona le plus fragile, et elle lui demande de parler à voix haute en public juste après lui avoir dit qu'il n'y a « pas d'exercice à rater ».

**2. Toutes les étapes : la promesse des vannes** (COP-02)

> Format annoncé : « Conseil technique + vannes à pratiquer + vidéo d'exemple + quiz » (Machine à Café 1).
> Ce que voit le membre : « Vannes à pratiquer. 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue » (`parcours-detail.tsx:248-259`).
> Page Premium : « Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz. » (`premium-benefits.tsx:34-35`).

Pourquoi c'est le pire : une promesse de la page de vente, répétée 13 fois, sans contenu derrière, sur la ressource la plus désirable du site.

**3. Répartie, étape 1 (gratuite) : trois cours dans une étape** (COP-01)

> Ce que tu vas apprendre : « Rebondir sur une remarque, accuser réception, reformuler avec humour : 3 réflexes pour ne plus rester muet en TD, en soirée ou en coloc. »
> Le conseil affiché : « L'ironie bienveillante consiste à dire le contraire de ce que tu penses, si évidemment que ça fait rire sans blesser. »
> Quiz, question 1 : « Un pote te dit "T'es toujours en retard". Quelle répartie bienveillante ? » avec pour bonne réponse « C'est stratégique : j'arrive pile quand vous avez fini de parler de moi. » (une exagération, pas une ironie au sens du conseil).

Pourquoi c'est le pire : c'est la vitrine du parcours du persona principal (Yanis) ; le visiteur ne sait plus ce qu'on lui apprend.

## 7. Vérifié / Non vérifié

**Vérifié (constaté directement)**
- Textes complets du seed `parcours-seed.json` (13 étapes, 54 questions de quiz, 26 emplacements vidéo, 65 emplacements de vannes) et des composants `parcours-detail.tsx`, `parcours-content.tsx`, `parcours/page.tsx`, `parcours/[slug]/page.tsx`, `parcours-catalogue.ts`, `parcours-labels.ts`, `parcours-preview.ts`, `parcours-orientation.ts`, route de progression.
- Étape 1 des 3 parcours telle que rendue en prod (captures s17 desktop) : conseil, exemple, exercice, teaser de vannes, 2 vidéos, quiz, bouton « Voir l'offre Premium », étapes 2+ avec cadenas et « Termine l'étape N-1 pour débloquer ».
- Durées de 22 vidéos (seed) et concordance artiste/titre/identifiant avec `videos-seed.json` : 21 concordent, 1 non (57Ip2k3us_8).
- Existence des identifiants de vannes dans `blagues-seed.json` : 62 distincts testés, 3 absents (82, 85, 180).
- Comptage des bonnes réponses de quiz par position (lecture du fichier).
- Aucun appel du code ne résout `jokeIds` en vannes affichées (grep).

**Non vérifié (déduit ou non mesuré)**
- Texte exact des conseils des étapes 2 et suivantes en base (payantes, non lisibles sans abonnement) : lu dans les fichiers de travail s14, qui peuvent différer de la base (cas démontré sur MàC 1).
- Statut actif et qualité en base des vannes et des conseils cités en 4.4 et des vannes des parcours.
- Que l'identifiant `57Ip2k3us_8` affiche bien la vidéo de Thomas VDB sur YouTube (déduit du seed) ; fonctionnement du lecteur pour les 21 autres.
- Durées par étape : estimation (lecture 200 mots/min, quiz 40 s/question, exercice 5 à 10 min), aucun temps réel d'utilisateur ; Umami ne mesure que `parcours-etape` et n'a pas été interrogé.
- Rendu mobile 375 px, accessibilité, performance (hors périmètre copy).
- Fréquence réelle d'usage des parcours (aucune donnée de progression lue).

## 8. Handoff

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/audit-parcours-apprentissage-s17/copywriter.md` (aucun autre fichier modifié, aucun commit).
- Notes : C1 4, C2 5, C12 4, avis C7 4 (valeur ponctuelle, pas récurrente).
- Décisions Thomas à prévoir : (1) réécriture des textes d'étape, quiz et exercices des 13 étapes (calibrage d'étalons obligatoire, P0 s8) ; (2) afficher les vannes des étapes ou retirer la promesse ; (3) allonger l'offre (étapes, échelonnage, annuel mis en avant) ; (4) pas de modification du chiffre « 15 à 20 min/semaine » (choix fondateur) : agir sur les vidéos.
- Corrections rapides sans décision éditoriale : identifiant vidéo MàC 3 (COP-03), message « Parcours terminé ! » (COP-08), message « Termine l'étape 1 pour débloquer » pour un visiteur (COP-07, avec @ux), tirets des balisages et « blague » des quiz (COP-10).
- Contraintes respectées : tutoiement et « vanne » comme référence, humoristes cités conservés, « Imagine… » conservés, chiffres du site non touchés.
- Références marché : non consultées (audit de l'existant, pas de production de copy).
