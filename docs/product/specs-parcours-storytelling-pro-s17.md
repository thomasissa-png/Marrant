# Specs : parcours Storytelling et Pro, et mécaniques de rétention du lot 2 (s17, 07/10/2026)

> Auteur : @product-manager. Statut : COMPLET (07/10/2026). Spécification seule : aucun fichier de code, de contenu ou de base modifié, aucun commit.
> Sources lues : `docs/founder-preferences.md` (D1 à D8, `[CHOIX UTILISATEUR]`), `docs/marrant/audit-parcours-apprentissage-s17.md` et `.../product-manager.md` (PM-01 à PM-12, grille K1 à K15), `.../copywriter.md` §4.4-4.5, `docs/content/parcours-seed.json`, `conseils-seed.json`, `videos-seed.json`, `blagues-seed.json`, `progression-levels.md`, `project-context.md`.
> Contraintes respectées et non re-questionnées : « 15 à 20 min/semaine selon le parcours », pas de certificat, « produit qui s'apprend, pas qui se vend », visiteurs inchangés (étape 1 lisible, aperçu D1 sans contenu payant), pas de compte gratuit, 2,99 €/mois ou 24,99 €/an TTC inchangés, humoristes cités autorisés, jamais de mention IA, contenu préparé en lot (aucune génération au fil de l'eau), témoignages = « Imagine… ».
> Règle de preuve : chaque id cité (conseil, vidéo, vanne) a été relu dans le fichier seed correspondant. La base de production n'a PAS été consultée : voir §10 (le texte réel des conseils en base peut différer du seed, COP-09).

## 0. Résumé

1. **Deux parcours de 6 étapes chacun.** Storytelling : 20 min/semaine, personne principale Marc, secondaires Sophie et Yanis. Pro : 15 min/semaine, personne principale Sophie, secondaires Marc et Yanis (peu concerné). L'offre passe de 13 à 25 étapes, de 245 à 455 minutes annoncées (7 h 35), de 1 600 à 3 100 XP maximum.
2. **Presque rien à inventer côté contenu.** 11 conseils sur 12 existent déjà (ids du seed). 1 conseil est à écrire (Pro, étape 6 : prise de parole officielle). 60 ids de vannes (59 jamais utilisées dans les parcours actuels, 1 reprise), 22 vidéos (18 jamais utilisées dans un parcours, 3 reprises d'un parcours existant, 1 identifiant aujourd'hui placé par erreur dans Machine à Café 3 et à corriger avant).
3. **Pourquoi 6 étapes et pas plus** : voir §2.1 et §3.1. Pour Sophie, l'offre utile passe de 3 semaines (Machine à Café) à 15 semaines (Machine à Café, Pro, Storytelling).
4. **Six mécaniques de rétention** (lot 2) spécifiées avec critères testables : rythme doux, « Reprendre », retour d'exercice en 3 boutons, bilan de fin, suite de fin dynamique, rappel e-mail sur demande (§5).
5. **Deux frictions assumées.** (a) Pas d'e-mail de « reprise à 30 jours » (F10 de l'audit) : il contredit D7 (rappel uniquement sur demande). Remplacé par un arrêt doux et une reprise dans l'application. (b) Le nom « Pro » peut se lire comme une offre payante « Pro » : alternative proposée « Boulot » (point à valider).
6. **Calendrier par dépendances** (§6), pas de sprints. **Effet attendu sur K1 à K15** (§7) : fort sur K9, K10, K11, K15, indirect sur K7, K8, K12, K13, neutre sur K3, K4. Aucun chiffre promis : à 62 vues de pages parcours en 90 jours et 2 abonnés, rien ne se lit avant plusieurs dizaines de membres actifs.
7. **Points à valider par Thomas** : §9 (15 points, sans jargon). **Quiz d'humour** (§12) : 4 profils sur 5 validés, seul le Storyteller bascule vers Storytelling à sa publication.

## 1. Règles communes aux deux parcours

| # | Règle | Contenu | Origine |
|---|---|---|---|
| RC1 | Un seul enseignement par étape | Le texte d'étape (`moduleDetail`), l'exercice et le quiz portent sur le conseil affiché, pas sur un autre | COP-01 |
| RC2 | Conseils réutilisés par id | Ids et titres ci-dessous = `conseils-seed.json`. **La base fait foi** : avant tout brief @copywriter, @fullstack exporte depuis la base le texte réel (statut actif, contenu, exemple, exercice) des conseils retenus ; si différent du seed, le brief suit la base | COP-09 |
| RC3 | 5 vannes par étape | Ids de `blagues-seed.json`, de même technique que l'étape, jamais utilisés dans les 13 étapes actuelles (sauf mention). Les 5 vannes s'affichent dans l'étape avec leur décryptage (D4). Statut actif en base à vérifier avant (PM-04) | D4, PM-04 |
| RC4 | Vidéos : 1 obligatoire + 1 facultative | La 2e est étiquetée « facultative ». Plafond de la vidéo obligatoire : 8 min (Storytelling), 5 min (Pro). Aucun spectacle complet. Aucune vidéo reprise à l'intérieur d'un même parcours. Une vidéo plus longue que le plafond est proposée en extrait minuté par @copywriter (aucune minute inventée ici) | COP-04, K14 |
| RC5 | Quiz utile | Storytelling : 4 questions (5 à la dernière étape). Pro : 3 questions (4 à la dernière). Mises en situation avec 2 réponses plausibles, bonne réponse répartie sur les 4 positions (aucune position au-dessus de 40 % sur le parcours), explication affichée. Le quiz ne bloque jamais la validation | COP-05 |
| RC6 | Exercice « aujourd'hui » | Une consigne : situation précise, critère de réussite observable, **repli solo** si un public est nécessaire (vocal, écrit, à voix haute seul), garde-fou si le sujet touche une fragilité. Le texte final est écrit par @copywriter après étalons ; cette spec ne donne que l'intention | COP-11, D5 |
| RC7 | Budget de temps (estimation, non mesurée) | Hors vidéo, une étape existante prend environ 12 min (copywriter : 35 min pour 3 étapes MàC, 50 pour 4 Répartie, 70 pour 6 Confiance). Storytelling : 12 + vidéo obligatoire ≤ 8 = 20 min. Pro : format allégé (quiz de 3 questions, conseil lu en 2 min) ≈ 9 + vidéo ≤ 5 = 14 min. À mesurer (K14) avant de communiquer | PM-05, K14 |
| RC8 | Accès | Étape 1 : gratuite en lecture, quiz inclus, validation réservée à Premium (comportement actuel inchangé). Étapes 2 à 6 : Premium. Aperçu visiteur (D1) : titre du module, `moduleDetail`, durée, XP ; jamais le conseil, l'exercice ni les vannes | `[CHOIX]` 05/10, D1 |
| RC9 | Voix | Tutoiement, « vanne » (jamais « blague » sauf terme consacré : « blague à tiroirs »), pas de prénom de persona dans le texte public, témoignage de type « Imagine… », zéro tiret cadratin, zéro mention IA, humoristes cités avec citation réelle | charte s11, `[CHOIX]` |
| RC10 | Production | Lot préparé, étalons validés avant (D5), relecture à l'aveugle par 2 relecteurs pour tout texte neuf (conseil, vannes neuves), aucune génération au fil de l'eau | `[CHOIX]` 01/10, P0 s8 |
| RC11 | XP | Étape 1 : 50 ; barème croissant ; bonus de fin +100 inchangé. Storytelling 50, 75, 100, 125, 150, 200 (= 700, comme Confiance). Pro 50, 75, 100, 100, 125, 150 (= 600, plafond 150 pour un parcours à 15 min). XP affichés = XP réels (bonus compris, COP-08) | progression-levels.md |
| RC12 | Dates par étape | `dayNumber` = 3, 10, 17, 24, 31, 38 (même suite que le seed actuel) | seed |

## 2. Parcours Storytelling

### 2.1 Fiche (champs du seed)

| Champ seed | Valeur proposée |
|---|---|
| `slug` | `storytelling` [PROPOSITION : à aligner sur les titres signés de `seo.md` §6, D8] |
| `title` | « Parcours Storytelling » (même gabarit que les 3 existants) |
| `order` | 4 |
| `duration` / `timePerWeek` | « 6 semaines » / « 20 min/semaine » |
| `difficulty` / `difficultyLabel` | `INTERMEDIAIRE` / « DEBUTANT → INTERMEDIAIRE » (les conseils des étapes 5 et 6 sont étiquetés EXPERT : voir point 5 du §9) |
| `icon` | à choisir par @design |
| `persona` | Marc (34 ans, récemment séparé), principal. Valeur persona estimée : Marc 5, Sophie 4, Yanis 3 sur 5 (estimation de l'audit §6, [HYPOTHÈSE] tant que les votes `nouveaux-parcours` ne sont pas lus) |
| `description`, `personaTagline`, `testimonial` | [À ÉCRIRE par @copywriter après étalons]. Intention : une anecdote vraie, travaillée semaine après semaine, jusqu'à ce qu'on te la redemande. Témoignage de type « Imagine… » (jamais présenté comme un vrai membre) |
| `nextParcours` + `nextParcoursRanking` | Voir §5.5. Classement de départ [PROPOSITION] : `machine-a-cafe`, `repartie`, `confiance`, `pro` |

**Objectif.** À la fin, la personne raconte une anecdote vraie qu'on lui redemande, et sait pourquoi elle marche (plan, voix, chute, détour, retour d'un détail). **Critère de réussite vécu (K15)** : l'histoire finale a été racontée à au moins deux personnes (retour d'exercice de l'étape 6).

**Fil rouge.** La personne travaille sa propre anecdote de l'étape 1 tout au long du parcours (facultatif : l'étape 3 propose un raté comme alternative). Chaque étape ajoute une couche : plan, voix, ton, chute, détour, détail rappelé. Le bilan (§5.4) reprend ce qui a été essayé.

**Pour qui, pas pour qui.** Pour Marc (le mot « storytelling » est dans son profil, il veut de la profondeur et des dîners où il raconte), Sophie (anecdotes d'afterwork), Yanis (raconter sa soirée à ses potes). Pas pour qui veut seulement des répliques courtes (Répartie, Machine à Café).

**Pourquoi 6 étapes.** (1) Six couches pédagogiques distinctes, chacune adossée à un conseil existant de niveau croissant : DEBUTANT (23, 18), INTERMEDIAIRE (11, 30), EXPERT (39, 6). (2) 6 est la longueur du parcours le plus long déjà en ligne (Confiance) : au-delà, le taux d'abandon monte (repère MOOC de l'audit, K10) pour 15 à 20 min/semaine. (3) Avec les 3 autres parcours, le total passe à 25 étapes, et un membre qui enchaîne Machine à Café, Pro, Storytelling a 15 semaines de matière utile (PM-02). 5 étapes auraient obligé à fusionner twist et détour ; 7 auraient dupliqué Machine à Café 3 et Répartie 4.

**Recoupement à gérer.** Machine à Café 3 enseigne déjà le détail précis (conseil 78) et la structure contexte, tension, chute (quiz). L'étape 1 ci-dessous enseigne le **plan en trois actes appliqué à SON anecdote**, pas les détails : @copywriter doit marquer la différence (étalon). Pour qui a fait Machine à Café, l'étape 1 sert de révision rapide.

### 2.2 Étapes

Légende adéquation : forte = la technique de l'étape est le sujet de la ressource ; moyenne = la ressource l'illustre par un autre angle.

| Étape | 1 (gratuite) | 2 | 3 |
|---|---|---|---|
| Titre de travail (`moduleTitle`) | Le plan en trois actes | Donner une voix à ceux de ton histoire | Raconter un raté comme une épopée |
| `week` / `dayNumber` / `moduleXp` / `free` | 1 / 3 / 50 / oui | 2 / 10 / 75 / non | 3 / 17 / 100 / non |
| Objectif pédagogique | Découper une anecdote vraie en contexte (2 phrases), montée (détails précis), chute (1 phrase) et repérer ce qui traîne | Faire exister chaque personnage par un tic (un soupir, un mot répété) et une voix, sans imitation | Transformer un petit raté en histoire qu'on raconte en premier, un fait et pas un verdict, sans se rabaisser |
| Conseil réutilisé (seed) | id 23 « Raconter une anecdote en 3 actes » (STORYTELLING, DEBUTANT) | id 18 « La technique du personnage » (STORYTELLING, DEBUTANT) | id 11 « Rigoler de ses échecs » (AUTODERISION, INTERMEDIAIRE) |
| 5 vannes (ids) | 293, 304, 247, 245, 298 : micro-histoires où contexte puis chute suffisent. Adéquation forte | 308, 320, 309, 311, 301 : chaque proche défini par un mot ou un tic. Forte | 118, 205, 233, 276, 125 : un raté raconté avec panache. Forte |
| Vidéos (`youtubeId`, durée) | **Obligatoire** `JuB6-b0fhLE` Panayotis Pascot « Amsterdam et le Kem's » 6 min 30 (décor planté, chute gardée pour la fin, forte). *Facultative* `v-ySkBGAXLI` Thomas Ngijol « Le voisin » 5 min 40 (montée marche par marche, moyenne) | **Obligatoire** `fnu6fRa-BN4` Samia Orosemane « Les accents africains » 5 min 10 (imitation tendre, phrase culte, forte). *Facultative* `PrQTbXOz2iU` Laura Domenge « La vie de couple » 5 min 10 (dialogue rejoué avec les voix, forte) | **Obligatoire** `Fw14PLdtSyA` Nora Hamzawi « Les chagrins d'amour » 4 min (mêmes faits, regard qui change, forte). *Facultative* `0FmK8RA_hnE` Nordine Ganso « La première fois » 6 min 20 (souvenir amplifié, forte) |
| Exercice « aujourd'hui » (intention) | Poser SON anecdote vraie en 3 actes (chute plus courte que le contexte), la dire à voix haute ou en vocal. Repli solo : le vocal | Reprendre la même anecdote, donner un tic et une voix à 2 ou 3 personnages, la redire. Repli : vocal à un proche ou à voix haute | Écrire un petit raté en 3 versions (factuelle, dramatisée, épique), raconter la 3e. Garde-fou : un raté léger, jamais une blessure récente ; si ça fait mal, choisir plus léger ou passer |
| Quiz | 4 questions sur le découpage en actes (pas sur les détails) | 4 questions sur le tic et la voix | 4 questions dont une sur la limite entre humour et souffrance (comme Confiance 2) |
| Vigilance | Différencier de Machine à Café 3 (voir ci-dessus) | Imiter avec tendresse, jamais se moquer d'un accent (la vidéo 32 pose la règle) | Reprendre la phrase de protection de Confiance 2 (étalon) |

| Étape | 4 | 5 | 6 (dernière) |
|---|---|---|---|
| Titre de travail | La chute qu'on n'a pas vue venir | Quand ton histoire fait un détour | Faire revenir un détail à la fin |
| `week` / `dayNumber` / `moduleXp` / `free` | 4 / 24 / 125 / non | 5 / 31 / 150 / non | 6 / 38 / 200 / non (+100 de fin) |
| Objectif pédagogique | Écrire une chute qui surprend puis paraît logique, car elle s'appuie sur un détail déjà cité | Glisser une digression de 2 phrases au milieu, revenir au fil, durée totale ≤ 1 min 30 | Planter un détail dans les premières phrases et le faire revenir à la chute ; raconter l'histoire finale à au moins deux personnes |
| Conseil réutilisé (seed) | id 30 « Le twist final » (STORYTELLING, INTERMEDIAIRE) | id 39 « La blague à tiroirs » (STORYTELLING, EXPERT) : titre consacré, « blague » conservé | id 6 « Le callback : faire revenir une vanne au bon moment » (TIMING, EXPERT) |
| 5 vannes (ids) | 321, 322, 334, 329, 234 : chute logique après coup. Forte | 95, 136, 192, 213, 292 : micro-histoires avec un détour. **Moyenne** (les vannes courtes du catalogue montrent peu la digression) | 316, 324, 253, 303, 177 : le motif de départ qui revient. Forte |
| Vidéos | **Obligatoire** `RYjfe8OSRFw` Paul Mirabel « Je me suis fait racketter » 7 min 45 (détail planté puis repris pour la chute, moyenne ; **reprise de Confiance 2**). *Facultative* `uEj_jmlANXE` Djimo « J'aurais kiffé être une tortue » 8 min 50 (arguments qui mènent à une conclusion délirante, moyenne) | **Obligatoire** `cl-fIl6hjTw` Jason Brokerss « Le mariage (Montreux) » 7 min (version étoffée d'un même texte, moyenne). *Facultative* `JtU_EB5i2Mk` Sugar Sammy « L'andrologue » 5 min 30 (public pris à témoin au milieu du récit, moyenne) | **Une seule** `eYhWcDdI3rM` Jonathan Cohen « Serge le Mytho (Bloqués) » 3 min (personnage qui revient, running gag, moyenne). Le temps libéré sert à l'exercice final |
| Exercice (intention) | Écrire 2 fins pour l'anecdote, chacune appuyée sur un détail déjà cité ; tester sur un proche « laquelle ? ». Repli : dire les deux à voix haute et garder celle qui fait sourire | Ajouter UNE digression de 2 phrases, chronométrer ≤ 1 min 30. Repli : version vocale | Version finale avec détail planté puis rappelé, racontée à deux personnes dans la semaine. Repli : message vocal ou écrit à un ami ; le conseil propose une soirée mais ne l'exige pas |
| Quiz | 4 questions | 4 questions | 5 questions |
| Vigilance | | Aucun sketch du seed ne montre la digression de façon explicite : @copywriter peut préférer 5 vannes neuves validées à l'aveugle | Dernière étape : aucun spectacle complet (leçon de Confiance 6). Le bilan s'affiche à la validation (§5.4) |

**Durée estimée par étape** (RC7, non mesurée) : 12 min hors vidéo + vidéo obligatoire = 18 min 30, 17, 16, 20, 19, 15 (l'étape 6 laisse 5 min de plus à l'exercice). Maximum 20 min, conforme.

## 3. Parcours Pro

### 3.1 Fiche (champs du seed)

| Champ seed | Valeur proposée |
|---|---|
| `slug` | `pro` [PROPOSITION : nom à valider, voir point 1 du §9 ; alternative `boulot`] |
| `title` | « Parcours Pro » (ou « Parcours Boulot ») |
| `order` | 5 |
| `duration` / `timePerWeek` | « 6 semaines » / « 15 min/semaine » (Sophie : « contenu trop long » est sa frustration ; même rythme que Machine à Café) |
| `difficulty` / `difficultyLabel` | `DEBUTANT` / « DEBUTANT → INTERMEDIAIRE » (progression par exposition sociale, voir ci-dessous) |
| `icon` | à choisir par @design |
| `persona` | Sophie (26 ans, jeune active), principale. Valeur persona estimée : Sophie 5, Marc 3, Yanis 1 sur 5 (audit §6) ; Yanis concerné seulement par un stage ou une alternance [HYPOTHÈSE] |
| `description`, `personaTagline`, `testimonial` | [À ÉCRIRE par @copywriter après étalons]. Intention : réunion, message, couloir, afterwork, présentation de soi, prise de parole officielle, sans devenir le collègue qui force. Témoignage « Imagine… » |
| `nextParcours` + `nextParcoursRanking` | Voir §5.5. Classement de départ [PROPOSITION] : `storytelling`, `machine-a-cafe`, `repartie`, `confiance` |

**Objectif.** À la fin, la personne place un trait d'humour dans chacune des 6 situations du bureau (réunion, écrit, couloir, afterwork, présentation de soi, prise de parole officielle) sans se griller. **Critère de réussite vécu (K15)** : au moins 4 des 6 exercices notés « essayé ».

**Progression par exposition sociale** (et non par difficulté de technique) : observer (étape 1, aucun risque) puis écrire (on relit avant d'envoyer) puis une phrase de 15 secondes à une personne puis une anecdote devant un petit groupe puis des inconnus puis un public officiel. Chaque exercice a un repli sans risque professionnel.

**Pour qui, pas pour qui.** Pour Sophie (la seule situation pro du site aujourd'hui est Machine à Café, 3 étapes, et manquent le mail, le networking et la remarque à un supérieur : copywriter §4.2). Pas pour qui n'a pas de lieu de travail : Yanis y trouve peu.

**Pourquoi 6 étapes.** (1) Six situations distinctes du quotidien pro, chacune adossée à un conseil existant sauf la dernière. (2) À 15 min/semaine, 6 semaines = 90 min : même ordre de grandeur que Répartie (80 min), moins que Confiance (120 min). (3) Valeur persona plus étroite (une seule personne forte, audit F9 : 7 x 5 = 35) : on ne la gonfle pas au-delà de 6.

**Recoupements à gérer.** Machine à Café couvre déjà la pause, le timing en réunion et l'afterwork (étape 2 de MàC, quiz). L'étape 4 (afterwork) enseigne ici l'anecdote de travail, pas le placement du bon moment. L'étape 1 du Pro est la réunion « côté spectateur » (observer), pas le moment où placer la vanne.

**Alerte contenu.** Le catalogue vidéo n'a aucun sketch sur le mail pro, la réunion formelle ou la prise de parole officielle : 8 des 11 vidéos ci-dessous sont d'adéquation moyenne. Reco : @copywriter cherche 3 à 4 vidéos plus justes dans une recherche préparée en lot (pas de génération au fil de l'eau), sinon on garde les moyennes en facultatives.

### 3.2 Étapes

| Étape | 1 (gratuite) | 2 | 3 |
|---|---|---|---|
| Titre de travail | La réunion vue de la salle | Écrire drôle au boulot sans finir en capture d'écran | Le couloir : quinze secondes |
| `week` / `dayNumber` / `moduleXp` / `free` | 1 / 3 / 50 / oui | 2 / 10 / 75 / non | 3 / 17 / 100 / non |
| Objectif pédagogique | Repérer expressions toutes faites et rituels d'une réunion, viser le système (jamais une personne), préparer un commentaire | Glisser un trait (PS, décalage de ton) dans un mail ou un message pro qui reste présentable au N+2 | Transformer un irritant partagé (clim, imprimante, café) en une phrase courte et inoffensive placée entre deux portes |
| Conseil réutilisé (seed) | id 52 « Survivre aux réunions avec humour » (OBSERVATION, INTERMEDIAIRE) | id 53 « L'humour digital : mails, Slack et textos pro » (JEUX_DE_MOTS, INTERMEDIAIRE) | id 70 « La vanne de couloir : l'art du timing entre deux réunions » (OBSERVATION, DEBUTANT) |
| 5 vannes (ids) | 122, 186, 106, 130, 194 : formules et rituels d'entreprise. Forte | 138, 198, 181, 146, 190 : messages, délais, « vu ». **Moyenne** : 2 sur 5 sont vraiment pro (138, 146) ; envisager 3 vannes neuves validées à l'aveugle | 162, 57, 170, 142, 101 : irritants partagés du bureau et du trajet. Forte |
| Vidéos | **Obligatoire** `57Ip2k3us_8` Thomas VDB « Bitcoin, JPEG et blockchain » 4 min 30 (jargon ramené au langage de tous les jours, forte). *Facultative* `dQ--q5y2e4k` Arnaud Tsamère « L'avocat de la salade, la frite et la saucisse » 6 min (cadre codifié, moyenne). **Dépendance** : `57Ip2k3us_8` est aujourd'hui placé par erreur dans Machine à Café 3 (correctif `tpIOLzv11qo`, lot 1) | **Obligatoire** `jKhIOyk9kdU` Pierre Croce « Tester Tinder avec un enfant » 3 min (concept en une phrase = concision, moyenne). *Facultative* `zGT7TX66JFQ` Jason Brokerss « Snapchat » 5 min 40 (geste numérique, « vu », moyenne) | **Obligatoire** `NebHsD_K9lM` Guillermo Guiz « Les cabillauds, ces arrogants ! » 4 min 30 (on reconnaît un collègue dans un poisson, moyenne). *Facultative* `3v8Y4C9Q5hE` Kev Adams « Du côté de chez vous » 5 min 20 (codes partagés, moyenne) |
| Exercice (intention) | Bingo mental à la prochaine réunion (observation seule, zéro risque), puis le raconter à un collègue complice. Repli : une réunion déjà passée ou une visio | Écrire un brouillon de PS ou de message drôle, le relire en « test capture d'écran », l'envoyer seulement si ça passe. Repli : le brouillon n'est jamais envoyé | Préparer UN commentaire sur un irritant partagé, le placer une fois en 15 secondes maximum, noter la réaction. Repli : le dire à un collègue de confiance |
| Quiz | 3 questions | 3 questions dont un cas « message à tout le service » | 3 questions de placement et de ton |
| Vigilance | Étape vitrine gratuite : exercice sans risque pour un visiteur | Aucun envoi exigé (risque professionnel réel) ; choisir un message à faible enjeu | Rester sur un irritant partagé, jamais une personne |

| Étape | 4 | 5 | 6 (dernière) |
|---|---|---|---|
| Titre de travail | L'afterwork : ta semaine en anecdote | Le « tu fais quoi dans la vie ? » | Prendre la parole quand c'est officiel |
| `week` / `dayNumber` / `moduleXp` / `free` | 4 / 24 / 100 / non | 5 / 31 / 125 / non | 6 / 38 / 150 / non (+100 de fin) |
| Objectif pédagogique | Transformer un moment absurde de la semaine de travail en anecdote de 30 secondes en trois actes | Remplacer le pitch récité par une description honnête et drôle de son métier en 2 phrases | Préparer 60 secondes (mot de départ, présentation d'équipe, toast) avec une seule touche d'humour, placée après un moment sincère |
| Conseil | id 72 « L'afterwork : passer de collègue à personne drôle » (STORYTELLING, DEBUTANT) | id 71 « Survivre (et briller) au networking pro avec humour » (AUTODERISION, INTERMEDIAIRE) | **Conseil à écrire** (voir brief ci-dessous) après vérification en base qu'aucun conseil actif de la base ne couvre déjà ce besoin (le seed n'en contient aucun) |
| 5 vannes (ids) | 21, 50, 114, 341, 340 : dialogues et scènes de boulot. **Moyenne** (des phrases-chute, peu de récits en 3 actes) | 9, 141, 38, 66, 94 : autodérision de présentation de soi. Forte | 178 (pot de départ ; **reprise de Répartie 4**), 211, 68, 157, 260 : discours et solennité décalée. Moyenne |
| Vidéos | **Obligatoire** `tj6qta_9PaM` Anne Roumanoff « Carmen et la crise » 4 min 50 (ton de conversation naturel, moyenne). *Facultative* `TDmd7JRlxFc` Florence Foresti « Le styliste » 6 min (jargon d'un milieu, moyenne) | **Obligatoire** `qdqIc-uzdbA` Haroun « L'impro et la répartie » 5 min 45 (le « tu fais quoi dans la vie ? » est dans la fiche, forte ; **reprise de Répartie 1 et 4**, extrait minuté ≤ 5 min à fixer). *Facultative* `ztKRY4eNUTA` Lisa Delmoitiez « J'ai pas confiance en moi et j'ai raison » 6 min (défaut défendu, moyenne) | **Une seule** `4t9a0To2ygo` Marina Rollman « Les enterrements de vie » 6 min 40 (le pot de départ est cité dans la fiche, forte ; **reprise de Confiance 4**, extrait minuté ≤ 5 min à fixer) |
| Exercice (intention) | Préparer une anecdote de 30 s (situation, escalade, chute), la raconter à la pause ou à l'afterwork. Repli : la raconter à un ami hors boulot | Réécrire sa description de poste en 2 phrases honnêtes et drôles, la sortir à la prochaine occasion. Repli : la dire 3 fois à voix haute | Écrire 60 secondes pour une occasion réelle ou imaginée, les lire à voix haute en chronométrant. Aucun public exigé |
| Quiz | 3 questions | 3 questions | 4 questions |
| Vigilance | Recoupe Storytelling 1 et Machine à Café 3 : cadrer sur le contexte bureau | Réécrire sa description sans mépriser son métier ni son employeur | Viser la situation, jamais une personne ; ne pas ouvrir par l'humour |

**Brief du conseil à écrire (Pro, étape 6), 2 lignes.** Pot de départ, présentation d'équipe, toast : 60 secondes qui tiennent debout. Une seule touche d'humour, placée après un moment sincère, jamais en ouverture, visant la situation et jamais une personne ; exemple avec structure et durée, exercice avec repli écrit ou vocal. Catégorie suggérée STORYTELLING, difficulté INTERMEDIAIRE. Production : étalons conseils E2, E3, E4, E6, E7 (`docs/copy/audit-conseils-s14.md`, cités dans `docs/founder-preferences.md`) puis relecture à l'aveugle. **Réserve** : conseil id 15 « Adapter son humour à l'audience » (OBSERVATION, INTERMEDIAIRE), non retenu (exercice amis, famille, collègues), disponible pour un « défi du mois » sur la hiérarchie.

**Durée estimée par étape** (RC7, non mesurée) : 9 min hors vidéo + vidéo obligatoire = 13 min 30, 12, 13 min 30, 14, 14 (extrait), 14 (extrait). Maximum 15 min, conforme.

## 4. L'offre après ces deux parcours

| | Avant | Après |
|---|---|---|
| Parcours | 3 | 5 |
| Étapes | 13 | 25 |
| Étapes 1 en lecture libre (portes d'entrée, PM-09) | 3 | 5 |
| Minutes annoncées (au rythme) | 245 (≈ 4 h) | 455 (≈ 7 h 35) |
| XP des étapes / bonus de fin / total | 1 300 / 300 / 1 600 | 2 600 / 500 / 3 100 |
| Semaines utiles pour Sophie (parcours à 4 ou 5 sur 5 de l'audit §6) | 3 (Machine à Café) | 15 (Machine à Café 3, Pro 6, Storytelling 6) |
| Semaines utiles pour Marc | 6 (Confiance) | 12 (Confiance 6, Storytelling 6) |
| Semaines utiles pour Yanis | 4 (Répartie) | 4 : **ce lot ne sert pas la personne principale du projet** (Storytelling vaut 3 sur 5 pour lui) |

**Point de challenge.** Yanis, persona principale du projet, est le moins servi par ce lot. Les conseils du seed écrits pour lui et non utilisés (« La répartie en coloc : 10 secondes pour s'affirmer » id 73, « L'humour en amphi » id 75, « Être drôle en soirée quand tu connais personne » id 74, « Les scripts de répartie prêts à l'emploi » id 54) permettent un 6e parcours (hors périmètre de ce document). À inscrire à la roadmap après lecture de K9 et K10 sur les premiers parcours.

**Ce que ces deux parcours ne règlent pas seuls** (PM-02, H5) : 25 étapes consommées au rythme conseillé représentent 25 semaines, soit environ 6 mois, mais un membre pressé les finit en un week-end. Le rythme doux (§5.1) et le rappel (§5.6) sont ce qui fait réellement durer. La résiliation après une fin de parcours se mesure par K13.

## 5. Mécaniques de rétention du lot 2

### 5.0 Conventions communes

- **Qui** : membres Premium avec accès actif. Visiteurs et comptes FREE existants (11) : aucun changement, aucun bloc nouveau (`[CHOIX]` 05/10, visiteurs inchangés).
- **Jamais** : bloquer une étape, afficher un compteur de retard, employer une formule culpabilisante (P0 06/05), parler de prix ou d'abonnement dans ces blocs.
- **Dates** : fuseau Europe/Paris, format français (« jeudi 15 octobre »), jamais « Invalid Date », « undefined » ni mois en anglais. Donnée manquante = repli propre (`[CHOIX]` 07/10).
- **Textes** : l'intention seule est donnée ici ; le texte final passe par étalons validés par Thomas (P0 s8). Tout e-mail est un brouillon (règle commune 10).
- **Données à ajouter** (une seule migration groupée, rétrocompatible, la table de dates par étape est déjà acceptée par Thomas dans D2) [PROPOSITION de structure, @fullstack décide] : (1) date de validation de chaque étape ; (2) jour préféré par membre (0 à 6, vide si non choisi) ; (3) retour d'exercice par étape (résultat, ligne libre ≤ 200 caractères, date de mise à jour) ; (4) préférence de rappel (§5.6). Étapes déjà validées avant la migration : date inconnue, traitées comme une reprise douce.
- **Statuts dérivés, jamais stockés** : non commencé = 0 étape validée ; en cours = au moins 1 validée et moins que le total des étapes actives ; terminé = toutes validées. Une étape ajoutée plus tard à un parcours fini le remet « en cours ».
- **Événements** : ajoutés à la liste d'attribution Umami comme `mur-vu` ; aucun texte libre envoyé à Umami. Noms en minuscules avec tiret.
- **Pas de défaut inventé** : jour, heure et résultat d'exercice n'ont aucune pré-sélection.

### 5.1 Rythme doux (US-R1)

**Personne** : Yanis et Marc (besoin d'être guidés, risque d'abandon le plus fort, PM-01), Sophie. **Epic** : Revenir chaque semaine. **Dépendances** : lot 1 (événements, correctif de carte de fin), migration §5.0. **Valeur (Impact x Confiance)** : 9 x 7 = 63 (audit F1). **Job-to-be-done** : en tant que membre qui avance dans un parcours, je veux savoir quelle étape est conseillée et pour quand, afin de continuer chaque semaine (K9, K10) sans que rien ne me soit imposé.

**Règles**
1. **Choix du jour** : à la première validation d'étape d'un membre (et via « Choisir mon jour » ensuite), un panneau propose les 7 jours de la semaine, **aucun pré-sélectionné**, plus « Pas de jour fixe ». Fermer le panneau sans choisir = « Pas de jour fixe », le panneau ne revient qu'à la demande. Un jour par membre (valable pour tous ses parcours).
2. **Date conseillée de l'étape N (N ≥ 2)** : avec un jour choisi, ce jour dans la **semaine calendaire qui suit** (lundi à dimanche, Europe/Paris) celle où l'étape N-1 a été validée ; sans jour : date de validation + 7 jours. L'étape 1 n'a pas de date (disponible tout de suite). Exemple (nous sommes en octobre 2026) : jour = jeudi, étape 1 validée le lundi 12 octobre, étape 2 conseillée le jeudi 22 octobre ; validée le dimanche 11, conseillée le jeudi 15.
3. **Affichage** : sous la barre de progression, « Prochaine étape conseillée : jeudi 22 octobre » ; sur la fiche de l'étape, une mention « conseillée le jeudi 22 octobre ». Le jour même : « aujourd'hui ». Après la date : formulation neutre de type « ton étape t'attend », sans couleur d'alerte et sans nombre de jours.
4. **Rien n'est bloqué** : l'étape reste ouvrable et validable avant sa date. Avancer plus vite ne pénalise pas : la date suivante est calculée depuis la validation réelle.
5. **Retour après 21 jours ou plus** sans aucune validation (tous parcours confondus) : reprise douce. L'ancienne date n'est plus affichée ; la nouvelle date conseillée est le prochain jour choisi à partir d'aujourd'hui (aujourd'hui inclus), ou aujourd'hui sans jour fixe. Le message d'accueil ne cite jamais le nombre de jours écoulés. La progression est intacte.
6. **Plusieurs parcours en cours** : chacun affiche sa date ; aucune alerte si deux dates coïncident.
7. **Changement de jour** : les dates des étapes non validées sont recalculées ; les validations passées ne changent pas.
8. **Données manquantes** : si la date de validation de N-1 est inconnue (avant migration), repli = reprise douce.

**5 états UI** : défaut (date affichée) / chargement (la date est calculée côté serveur, aucun spinner ; au-delà de 1 s le bloc est masqué plutôt que de bloquer la page) / vide (parcours non commencé : pas de date, « ton étape 1 est prête ») / erreur (calcul impossible : « Quand tu veux » ; enregistrement du jour en échec : message d'étalon + bouton « Réessayer », le choix n'est pas perdu) / succès (« C'est noté : étape suivante conseillée le jeudi 22 octobre »).

**Critères d'acceptance**

| ID | Given | When | Then |
|---|---|---|---|
| RD-01 | Membre sans jour choisi, étape 1 de Répartie non validée | Il valide l'étape 1 | Le panneau de choix du jour s'affiche, 7 jours et « Pas de jour fixe », aucun pré-sélectionné |
| RD-02 | Jour = jeudi, étape 1 validée le lundi 12/10/2026 | Il ouvre la page du parcours | « Prochaine étape conseillée : jeudi 22 octobre » |
| RD-03 | Jour = jeudi, étape 1 validée le dimanche 11/10/2026 à 23 h 50 (Paris) | Il ouvre la page | « jeudi 15 octobre » (la semaine est calculée en heure de Paris, pas en UTC) |
| RD-04 | Panneau fermé sans choix, étape validée le lundi 12/10 | Il ouvre la page | « lundi 19 octobre » (validation + 7 jours) |
| RD-05 | Date conseillée jeudi 22, nous sommes lundi 19 | Il ouvre et valide l'étape 2 | L'étape s'ouvre et se valide, aucun blocage, la date de l'étape 3 part de la validation réelle |
| RD-06 | Date dépassée de 5 jours | Il ouvre la page | Libellé neutre, aucun rouge ni orange, aucun nombre de jours, aucun mot « retard » (test texte et couleur par @qa) |
| RD-07 | Dernière validation il y a 25 jours, 3 étapes sur 6 faites | Il revient | Ancienne date absente, nouvelle date = prochain jour choisi (aujourd'hui compris), accueil sans nombre de jours, progression 3/6 intacte |
| RD-08 | Dernière validation il y a 20 jours, puis 21 jours (test limite) | Il ouvre la page | À 20 jours : date d'origine affichée ; à 21 jours : reprise douce |
| RD-09 | L'enregistrement du jour échoue (erreur serveur) | Il clique sur « jeudi » | Message d'étalon et « Réessayer », sélection conservée à l'écran, aucune fausse confirmation |
| RD-10 | Étape validée sans date en base (avant migration) | Il ouvre la page | Reprise douce, jamais « undefined » ni « Invalid Date » |
| RD-11 | Visiteur ou compte FREE | Il consulte un parcours | Aucun bloc rythme, aucun panneau |
| RD-12 | Jour = jeudi, étapes 3 et 4 non validées | Il passe à « mardi » | Les dates de 3 et 4 sont recalculées, les étapes validées ne changent pas |
| RD-13 | Double clic sur « jeudi » | Deux requêtes partent | Une seule écriture, un seul événement |
| RD-14 | Parcours terminé | Il ouvre la page | Aucune date conseillée (le bilan s'affiche, §5.4) |

**Événements** : `rythme-jour-choisi` {jour : lundi à dimanche ou aucun ; source : panneau-validation ou profil} (K9) ; `etape-ouverte` reçoit une propriété `conseillee` {avant, jour, apres, sans-date} (K9, K14).

### 5.2 « Reprendre » (US-R2)

**Personne** : Yanis, Marc, Sophie (membres). **Epic** : Revenir chaque semaine. **Dépendances** : migration §5.0 ; §5.1 pour la date (le bloc fonctionne sans). **Valeur** : synthèse d'audit §4, recommandation 5 (« Reprendre ton parcours » en tête de l'accueil abonné et du profil) ; F10 de l'audit PM (reprise après abandon), 7 x 7 = 49. **Job-to-be-done** : en tant que membre qui revient, je veux reprendre là où je m'étais arrêté en un clic, afin de valider l'étape suivante dans la semaine (K7, K8, K12).

**Règles**
1. **Où** : en tête de l'accueil du membre, en tête de `/profil`, au-dessus de la liste du hub `/parcours`.
2. **Quoi** : le parcours « en cours » dont la dernière validation est la plus récente : titre du parcours, « étape N sur M », titre du module de l'étape N (N = première étape non validée), date conseillée (§5.1) si elle existe, un bouton.
3. **Lien** : `/parcours/[slug]#etape-N`, l'étape N arrive ouverte (comportement actuel : étape ouverte = première non validée).
4. **Autres parcours en cours** : jusqu'à 2 listés sous le bloc (titre et étape) ; au-delà, un lien « Voir mes parcours ».
5. **Aucun parcours en cours, au moins un non commencé** : bloc « Commence un parcours », un seul bouton vers `/parcours`, aucun parcours pré-choisi.
6. **Tous terminés** : pas de bloc ; les bilans restent accessibles depuis `/profil` (§5.4).
7. **Pas de bloc** pour un visiteur, un compte FREE, un abonnement résilié (la page parcours garde son message actuel « ta progression t'attend »).
8. **Résilience** : rendu côté serveur ; si la lecture de la progression échoue, le bloc est absent, sans message d'erreur, la page se charge normalement.

**5 états UI** : défaut (bloc complet) / chargement (rendu serveur ; si le bloc dépasse 500 ms il est omis, la page n'attend pas) / vide (aucun parcours commencé : « Commence un parcours ») / erreur (bloc absent, erreur journalisée) / succès (le clic navigue vers l'étape).

| ID | Given | When | Then |
|---|---|---|---|
| RP-01 | Membre avec Répartie 2 étapes sur 4 validées | Il ouvre l'accueil | « Reprendre : Parcours Répartie, étape 3 sur 4 », titre du module, un bouton ; le clic arrive sur `/parcours/repartie#etape-3` avec l'étape 3 ouverte |
| RP-02 | Machine à Café 1/3 validée hier, Confiance 2/6 validée il y a 10 jours | Il ouvre l'accueil | Bloc principal = Machine à Café ; Confiance listé en dessous |
| RP-03 | 4 parcours en cours | Il ouvre l'accueil | 1 bloc principal, 2 parcours listés, lien « Voir mes parcours » ; pas 4 blocs |
| RP-04 | Membre Premium, aucun parcours commencé | Il ouvre l'accueil | « Commence un parcours », un bouton vers `/parcours`, aucun parcours pré-sélectionné |
| RP-05 | Les 5 parcours terminés | Il ouvre l'accueil | Aucun bloc Reprendre ; `/profil` donne accès aux bilans |
| RP-06 | Visiteur ; compte FREE ancien | Il ouvre l'accueil | Aucun bloc |
| RP-07 | Abonnement résilié, accès perdu | Il ouvre l'accueil | Aucun bloc Reprendre |
| RP-08 | Étape 2 validée à l'instant | Il revient à l'accueil | L'étape 3 est affichée (pas d'étape périmée par le cache) |
| RP-09 | Parcours terminé, une étape y est ajoutée | Il ouvre l'accueil | Le parcours réapparaît « en cours » avec la nouvelle étape |
| RP-10 | La lecture de la progression échoue | Il ouvre l'accueil | La page se charge, aucun bloc, aucun message d'erreur |
| RP-11 | L'étape N n'a pas de date conseillée | Le bloc s'affiche | Aucune mention de date, jamais « undefined » |
| RP-12 | Écran de 375 px, titre de module long | Le bloc s'affiche | Pas de défilement horizontal, titre tronqué proprement, bouton visible sans défiler |

**Événement** : `reprendre-clic` {parcours, etape, emplacement : accueil, profil ou hub} (K7, K8) ; `parcours-ouvert` reçoit la valeur `src` = `reprendre`.

### 5.3 Retour d'exercice en 3 boutons (US-R3)

**Personne** : Yanis, Marc (progression visible), Sophie. **Epic** : Faire essayer pour de vrai. **Dépendances** : migration §5.0 ; lot 1 (événements). **Valeur** : 9 x 8 = 72, le plus haut score de l'audit (F4) ; crée K15, le critère le plus fidèle à la promesse. **Job-to-be-done** : en tant que membre, je veux dire où j'en suis de l'exercice (pas essayé, bof, ça a marché), afin de voir ma progression réelle et de la retrouver dans mon bilan (K15).

**Règles**
1. **Les trois choix** (libellés à valider par étalon) : « Pas encore essayé », « Essayé, bof », « Essayé, ça a marché ». **Aucun n'est pré-sélectionné.** Une ligne libre facultative (0 à 200 caractères) l'accompagne.
2. **Quand** : disponible dès que l'étape est **validée** (la validation reste possible sans réponse ; la réponse n'est jamais une condition). L'exercice se fait souvent des jours après la lecture : la réponse est donc modifiable à tout moment, la dernière valeur compte.
3. **Relance douce** : sur la page de l'étape N+1, si l'étape N n'a pas de réponse, une ligne discrète « Ton exercice de l'étape N ? » avec les 3 boutons. Masquable (« Plus tard » la cache 7 jours) ; après 2 masquages, elle ne revient plus.
4. **Visibilité** : privée au membre ; utilisée dans son bilan (§5.4) ; incluse dans l'export de données et supprimée avec le compte (RGPD).
5. **Visiteurs** : inchangés, aucun bouton, aucun enregistrement (une version « sans enregistrement » pour l'étape 1 serait une nouvelle fonction visiteur : point 6 du §9).
6. **Résiliation** : les réponses sont conservées, plus modifiables sans accès actif ; retrouvées à la réactivation (cohérent avec « livrables liés à l'abonnement actif »).
7. **Sécurité** : la ligne libre est affichée échappée (aucun HTML interprété), jamais envoyée à Umami.

**5 états UI** : défaut (3 boutons, aucun sélectionné, ligne libre repliée) / chargement (bouton cliqué désactivé, 2 s maximum) / vide (étape non validée : aucun bouton) / erreur (« on n'a pas pu enregistrer, réessaie » d'étalon, la sélection reste, aucune fausse confirmation) / succès (bouton sélectionné, `aria-pressed`, confirmation sobre).

**Payload API [PROPOSITION de forme, @fullstack décide ; les routes actuelles sont `api/parcours/[id]/progress`]** : `PUT /api/parcours/{slug}/etapes/{ordre}/retour` ; auth session membre avec accès Premium actif ; limite 30 requêtes par minute et par membre ; corps `{"resultat":"pas-encore|bof|marche","note":"texte de 200 caractères maximum, facultatif"}` ; réponse 200 `{"resultat","note","misAJourLe"}` ; 401 non connecté ; 403 sans accès Premium ; 404 étape inconnue ; 409 étape non validée ; 422 valeur invalide ou note trop longue ; 429 trop de requêtes. Lecture : même ressource en `GET` (ou intégrée à la route de progression).

| ID | Given | When | Then |
|---|---|---|---|
| RE-01 | Membre ayant validé l'étape 2 | Il clique « Essayé, ça a marché » | Réponse enregistrée, bouton sélectionné, confirmation, un événement `etape-retour` |
| RE-02 | Réponse « Pas encore essayé » enregistrée | Il choisit plus tard « Essayé, bof » | La valeur courante est « bof », un événement `etape-retour` avec `modification` = oui |
| RE-03 | Une réponse choisie | Il saisit 200 caractères exactement puis enregistre | Enregistré ; 201 caractères : enregistrement refusé avec message, texte non tronqué en silence |
| RE-04 | Étape 2 validée hier sans réponse | Il ouvre l'étape 3 | La ligne « Ton exercice de l'étape 2 ? » s'affiche ; elle disparaît après réponse ; la validation de l'étape 3 reste possible sans répondre |
| RE-05 | La ligne de relance est affichée | Il clique « Plus tard » deux fois à deux visites distinctes | Masquée 7 jours la 1re fois, définitivement la 2e |
| RE-06 | Perte de connexion pendant l'enregistrement | Il clique un bouton | Message d'erreur, sélection conservée, bouton « Réessayer », aucun doublon après reconnexion |
| RE-07 | Double clic sur le même bouton | Deux requêtes partent | Une écriture, un événement |
| RE-08 | Session expirée | Il clique un bouton | 401 géré : message et lien de reconnexion, aucune perte silencieuse |
| RE-09 | Visiteur, compte FREE ou abonnement résilié | Il consulte l'étape | Aucun bouton actif ; appel direct de l'API : 401 ou 403 |
| RE-10 | Étape non validée | Appel direct de l'API | 409, rien d'enregistré |
| RE-11 | Étapes validées avant la mise en ligne de la fonction | Il ouvre ces étapes | Les 3 boutons sont disponibles, état « pas de réponse » |
| RE-12 | Ligne libre contenant du HTML | Il l'enregistre puis relit | Texte affiché tel quel, rien d'interprété |
| RE-13 | Compte supprimé ou export demandé | Suppression ou export | Les réponses sont supprimées ou exportées avec le reste |
| RE-14 | Abonnement résilié puis réactivé | Il revient | Ses réponses sont retrouvées, intactes |

**Événement** : `etape-retour` {parcours, etape, resultat : pas-encore, bof ou marche ; moment : validation, plus-tard ou etape-suivante ; avec-note : oui ou non ; modification : oui ou non} (K15). **Lecture de K15 [HYPOTHÈSE, seuils de l'audit]** : « essayé » = (bof + marche) / toutes les réponses, cible ≥ 60 % ; « ça a marché ou presque » = marche / (bof + marche), cible ≥ 70 %. C'est un auto-déclaratif : lecture qualitative tant que n < 30.

### 5.4 Bilan de fin de parcours (US-R4)

**Personne** : Marc, Yanis, Sophie. **Epic** : Finir et continuer. **Dépendances** : §5.3 (retours), §5.5 (suite), lot 1 (carte de fin absente et total d'XP faux, A2 et COP-08). **Valeur** : 7 x 7 = 49 (F5). **Pas de certificat** (F6 NO-GO, `[CHOIX]` 07/10) : la preuve de réussite est « j'ai essayé, ça a marché ». **Job-to-be-done** : en tant que membre qui termine un parcours, je veux voir ce que j'ai vu et essayé, afin de décider de la suite (K10, K11, K13).

**Règles**
1. **Déclenchement** : à la validation de la dernière étape active, le bilan remplace la carte de fin actuelle, sans rechargement de la page. Ré-accès : « Revoir mon bilan » depuis la page d'un parcours terminé et depuis `/profil`.
2. **Blocs, dans l'ordre** : (a) titre du parcours et nombre d'étapes ; (b) « ce que tu as vu » : le titre du module de chaque étape, dans l'ordre ; (c) « ce que tu as essayé » : pour chaque étape le retour (ça a marché, bof, pas encore essayé, pas noté) et la ligne libre si elle existe, avec une synthèse « N étapes essayées sur M » (essayé = bof + marche) ; (d) « ton défi pour la suite » : l'exercice de la première étape (par ordre) notée « bof », à défaut « pas encore essayé » ; si tout est « ça a marché » ou si rien n'est noté, aucun défi n'est imposé ; (e) XP réellement gagnés (étapes + bonus de fin) et niveau ; (f) la suite dynamique (§5.5) ; (g) si le rappel s'arrête ici, une ligne l'annonce (§5.6).
3. **Carte partageable sobre** [PROPOSITION, point 10 du §9] : image avec le titre du parcours et « M étapes, N essayées ». Pas de prénom ni d'e-mail par défaut, pas de date de remise, pas de signature, pas de classement. Partage natif du navigateur, à défaut téléchargement.
4. **Interdits de formulation** : certificat, attestation, diplôme, certifié. Aucune phrase de reproche pour une étape « pas encore essayée » (formulation neutre de type « celle-ci t'attend »).
5. **Accès** : livrable lié à l'abonnement actif (décision business à inscrire dans les CGU, @legal). Abonnement résilié : message sobre, aucune donnée affichée ; les retours restent disponibles par l'export de données (RGPD art. 15).
6. **Étape ajoutée plus tard** à un parcours terminé : le parcours repasse « en cours » ; le bilan est recalculé à la nouvelle fin.

**5 états UI** : défaut (bilan complet) / chargement (XP et suite connus tout de suite ; le bloc « ce que tu as essayé » en squelette, 1 s maximum) / vide (rien de noté : phrase neutre et bouton « Noter mes essais ») / erreur (bloc « essayé » remplacé par une ligne discrète, XP et suite restent visibles) / succès (carte partagée ou téléchargée : confirmation sobre).

| ID | Given | When | Then |
|---|---|---|---|
| BI-01 | Membre qui valide la dernière étape de Storytelling | La validation réussit | Le bilan s'affiche sans recharger la page ; XP total = 700 + 100 = 800 (Pro : 600 + 100 = 700) |
| BI-02 | Bilan ouvert | Il lit le bloc (b) | Les 6 titres de module dans l'ordre du seed |
| BI-03 | Retours : 3 « ça a marché », 1 « bof », 1 « pas encore essayé », 1 sans réponse | Il lit le bloc (c) | « 4 étapes essayées sur 6 » ; chaque étape affiche son état |
| BI-04 | Étape 2 « bof », étape 4 « pas encore essayé » | Il lit le bloc (d) | Le défi est l'exercice de l'étape 2 |
| BI-05 | Toutes les étapes « ça a marché » | Il lit le bloc (d) | Aucun défi imposé |
| BI-06 | Aucun retour noté | Il lit le bloc (c) | Phrase neutre et « Noter mes essais » qui ouvre les 3 boutons ; aucun « undefined » ni liste vide |
| BI-07 | Parcours terminé il y a 2 mois, un retour modifié hier | « Revoir mon bilan » | Bilan affiché avec le retour à jour |
| BI-08 | Double clic sur la validation de la dernière étape | Deux requêtes simultanées | Un seul bilan, XP et bonus de 100 crédités une seule fois |
| BI-09 | La lecture des retours échoue | Le bilan s'ouvre | Bilan sans bloc (c), XP et suite visibles, aucune erreur bloquante |
| BI-10 | Ligne libre de 200 caractères | Affichage à 375 px | Pas de débordement, texte échappé |
| BI-11 | Abonnement résilié | Il ouvre le bilan | Accès refusé avec message sobre, aucune donnée ; l'export de données contient les retours |
| BI-12 | Bilan et carte générés | Test automatique de texte | Aucun des mots « certificat », « attestation », « diplôme », « certifié » |
| BI-13 | Il partage la carte | Partage ou téléchargement | L'image ne contient ni prénom ni e-mail ; titre, « 6 étapes, N essayées » ; téléchargement si pas de partage natif |
| BI-14 | Étape ajoutée à un parcours terminé | Il ouvre l'accueil | Le parcours est « en cours » et le bilan n'est plus présenté comme final |
| BI-15 | Parcours de 3 étapes (Machine à Café) | Il le termine | Le bilan fonctionne à 3 étapes (limite basse) |
| BI-16 | Parcours terminé | Comparaison | XP affichés = XP réellement crédités en base |

**Événements** : `parcours-termine` (serveur) {parcours, jours_ecoules, etapes_essayees, etapes_marche} (K10, K11, K15) ; `bilan-vu` {parcours, source : fin, revoir ou profil} ; `bilan-carte` {parcours, action : partage ou telechargement}.

### 5.5 Suite de fin dynamique (US-R5)

**Personne** : toutes. **Epic** : Finir et continuer. **Dépendances** : champ `nextParcoursRanking` ajouté au seed ; correctif de la boucle actuelle (Confiance renvoie à Machine à Café même fait, PM-07). **Valeur** : 6 x 8 = 48 (F7). **Job-to-be-done** : en tant que membre qui vient de finir un parcours, je veux qu'on me propose un parcours que je n'ai pas fini, afin d'enchaîner (K11).

**Algorithme**
1. Candidats = parcours publiés avec au moins une étape active, **sauf** le parcours courant et **sauf tout parcours déjà terminé** (jamais proposé).
2. Ordre : d'abord les parcours **en cours** (finir ce qui est commencé), du dernier touché au plus ancien ; puis les **non commencés** dans l'ordre du classement du parcours courant ; un parcours absent du classement passe après, par `order` du seed.
3. Le premier candidat est la suite principale (bouton au titre dynamique « Passer au parcours X »), le deuxième une suite secondaire (lien).
4. **Aucun candidat** : pas de « suite ». À la place : lien vers le carnet mensuel Premium, lien « refaire un exercice » (étapes « bof » ou « pas encore essayé »), et une annonce de nouveau parcours **seulement** s'il existe dans la configuration « à venir » (jamais de promesse sans parcours planifié).
5. **Phrase d'accroche** : si le candidat est le `nextParcours` du parcours courant, on garde `nextParcoursReason` ; sinon la `personaTagline` du candidat. Cela évite 20 textes par paire de parcours.
6. **Repli** : si l'état du membre ne peut pas être lu, aucun nom de parcours n'est affirmé ; lien vers `/parcours`.

**Classement de départ** [PROPOSITION, point 9 du §9] (déduit de la matrice persona de l'audit §6) :

| Parcours terminé | Classement des suites | Raison |
|---|---|---|
| `machine-a-cafe` | `pro`, `storytelling`, `repartie`, `confiance` | Sophie : Machine à Café, Pro, Storytelling |
| `repartie` | `storytelling`, `confiance`, `machine-a-cafe`, `pro` | Yanis : Répartie, Storytelling, Confiance |
| `confiance` | `storytelling`, `machine-a-cafe`, `repartie`, `pro` | Marc : Confiance, Storytelling, Machine à Café |
| `storytelling` | `machine-a-cafe`, `repartie`, `confiance`, `pro` | Générique [HYPOTHÈSE] : la suite dépend de la personne, que le produit ne connaît pas |
| `pro` | `storytelling`, `machine-a-cafe`, `repartie`, `confiance` | Sophie : Pro, puis Storytelling |

| ID | Given | When | Then |
|---|---|---|---|
| SU-01 | Marc termine Confiance, aucun autre parcours commencé | Fin du parcours | Principale = Storytelling, secondaire = Machine à Café |
| SU-02 | Il termine Confiance, Machine à Café en cours (1/3) | Fin du parcours | Principale = Machine à Café (en cours prioritaire), secondaire = Storytelling |
| SU-03 | Confiance terminé, Machine à Café, Répartie et Storytelling déjà terminés, Pro non commencé | Fin du parcours | Seule suite = Pro |
| SU-04 | Les 4 autres parcours déjà terminés | Fin du parcours | Aucune suite ; carnet et « refaire un exercice » ; jamais de parcours déjà terminé proposé (la boucle Machine à Café, Répartie, Confiance, Machine à Café n'existe plus) |
| SU-05 | Un parcours dépublié ou sans étape active | Calcul de la suite | Jamais proposé |
| SU-06 | Tout état | Calcul de la suite | La suite n'est jamais le parcours courant |
| SU-07 | Candidat = `nextParcours` du parcours courant ; puis autre candidat | Affichage | Premier cas : `nextParcoursReason` ; second : `personaTagline` ; jamais de texte vide |
| SU-08 | La lecture de l'état échoue | Fin du parcours | Lien vers `/parcours`, aucun nom de parcours affirmé |
| SU-09 | Deux parcours en cours | Calcul de la suite | Ordre = dernière validation la plus récente |
| SU-10 | Parcours terminé il y a un mois | « Revoir mon bilan » | Suite recalculée à l'état du jour (jamais un parcours terminé depuis) |
| SU-11 | Candidat Storytelling | Affichage | Le bouton dit « Passer au parcours Storytelling » (titre dynamique) et ouvre `/parcours/storytelling` |
| SU-12 | Un 6e parcours ajouté, absent du classement | Calcul de la suite | Il devient candidat sans modification de code, trié par `order` |

**Événement** : `suite-clic` {de, vers, type : en-cours, non-commence ou hub} (K11) ; `parcours-ouvert` reçoit `src` = `suite`.

### 5.6 Rappel e-mail sur demande (US-R6)

**Personne** : Yanis (besoin de rassurance et de guidage), Marc, Sophie. **Epic** : Revenir chaque semaine. **Dépendances** : §5.1 (jour choisi) ; étalon d'e-mail validé par Thomas (brouillon obligatoire, P0 s8) ; avis @legal (consentement, désinscription, mention dans la confidentialité) ; tâche d'envoi planifiée ; interrupteur de mise en service **désactivé par défaut** (même logique que l'interrupteur de génération de contenu). **Valeur** : 9 x 7 = 63 (F2). **Hypothèse H1 à tester** : un rappel choisi par la personne augmente les étapes validées d'une semaine à l'autre (K9, K10). **Job-to-be-done** : en tant que membre qui veut garder le rythme, je veux recevoir un e-mail le jour et à l'heure que j'ai choisis, afin de ne pas oublier mon étape de la semaine (K9, K12).

**Activation**
1. **Sur demande uniquement (D7)** : case **non cochée** par défaut, proposée dans le panneau de choix du jour (§5.1) et dans `/profil`. Aucun e-mail de « reprise à 30 jours » non sollicité (F10 de l'audit PM est écarté : il contredit D7).
2. **Jour et heure obligatoires** pour activer ; heure parmi les heures pleines de 7 h à 21 h (Europe/Paris) [PROPOSITION de plage], **aucune pré-sélectionnée**. Le jour est celui du §5.1.
3. **Consentement tracé** : date et version du texte de consentement (texte : étalon + @legal).
4. **Adresse vérifiée uniquement** (la liaison Google sans e-mail vérifié était un défaut de l'audit s16).

**Règles d'envoi**
1. **Au plus un e-mail par semaine et par membre**, tous parcours confondus.
2. **Envoi seulement s'il existe un parcours en cours** et que l'accès Premium est actif à l'heure de l'envoi.
3. **Contenu** : prénom (repli « Salut, » si absent, jamais « [prénom] » ni « undefined »), titre de l'étape conseillée du parcours le plus récemment touché, l'intention de l'exercice en une ligne, un seul bouton « Ouvrir l'étape » (lien avec `src=rappel`), un lien « changer de jour ou arrêter », un lien de désinscription en un clic (avec l'en-tête `List-Unsubscribe`). Jamais de prix, d'abonnement, de « série » ni de formule culpabilisante (liste fournie par l'étalon).
4. **Saut** : pas d'envoi si le membre a validé une étape dans les 5 jours qui précèdent ; le créneau est perdu, aucun rattrapage le lendemain.
5. **Premier envoi** : le prochain créneau strictement futur (jamais « tout de suite »).
6. **Échec d'envoi** : une nouvelle tentative dans l'heure, sinon abandon du créneau ; jamais de doublon le lendemain ; l'échec remonte dans l'e-mail quotidien unique d'alertes à Thomas (au plus un e-mail par jour pour lui, `[CHOIX]` 06/10).
7. **Fuseau** : Europe/Paris ; le changement d'heure du 25 octobre 2026 ne décale pas l'heure choisie.

**Arrêts automatiques** (aucun e-mail d'annonce, une ligne dans `/profil` et, pour le premier cas, dans le bilan)
- **Fin** : plus aucun parcours en cours (le dernier vient d'être terminé) : arrêt, raison « fin ».
- **Inactivité** [HYPOTHÈSE : 3, à valider] : trois e-mails consécutifs sans aucune étape validée entre eux, le quatrième n'est pas envoyé : arrêt, raison « inactivité ». C'est ce qui fait coïncider le cas « retour après 3 semaines » (§5.1) avec un rappel déjà arrêté, sans harcèlement. « Ignoré » se mesure en base (aucune validation entre deux envois), **sans pixel de suivi d'ouverture**.
- **Abonnement** résilié ou expiré : plus d'envoi ; à la réactivation, le rappel reste arrêté jusqu'à ce que le membre le réactive.
- **Désinscription** en un clic, sans connexion : effet immédiat (contrôlé au moment de l'envoi).
- **Suppression du compte** : préférence supprimée.

**Données (préférence de rappel)** [PROPOSITION] : actif, jour, heure, date et version du consentement, nombre d'envois consécutifs ignorés, raison et date d'arrêt.

**Payload API [PROPOSITION de forme]** : `PUT /api/profil/rappel-parcours` `{"actif":true,"jour":0 à 6,"heure":7 à 21}` ; auth session, accès Premium actif ; limite 10 requêtes par minute ; 200 / 401 / 403 / 422 / 429. Désinscription : `GET /rappel/desinscription?t=<jeton signé>` (page de confirmation) et `POST` pour l'en-tête `List-Unsubscribe-Post`.

**5 états UI** (réglage dans `/profil`) : défaut (case décochée, jour et heure non choisis) / chargement (enregistrement 2 s maximum) / vide (aucun parcours en cours : réglage disponible, mention « aucun e-mail ne part tant qu'un parcours n'est pas en cours ») / erreur (« on n'a pas pu enregistrer » d'étalon, réglage conservé à l'écran) / succès (« C'est noté : e-mail le jeudi à 19 h », et le jour du prochain envoi).

| ID | Given | When | Then |
|---|---|---|---|
| RM-01 | Membre sur `/profil` | Il ouvre le réglage | Case décochée, aucun jour ni heure pré-sélectionné ; activer sans heure est refusé avec message |
| RM-02 | Jour = jeudi, heure = 19 h choisis | Il enregistre | Préférence enregistrée avec date et version du consentement ; premier envoi le prochain jeudi à 19 h (Paris), strictement futur |
| RM-03 | Répartie 2/4, aucune validation depuis 6 jours, jeudi 19 h | L'heure arrive | Un e-mail : prénom, titre de l'étape 3, exercice en une ligne, bouton `src=rappel`, lien de désinscription, lien « changer de jour ou arrêter » |
| RM-04 | Compte sans prénom | L'e-mail part | « Salut, » ; aucun « [prénom] », « undefined » ni date en anglais |
| RM-05 | Deux parcours en cours | L'heure arrive | Un seul e-mail, parcours le plus récemment touché |
| RM-06 | Une étape validée il y a 2 jours | L'heure arrive | Aucun e-mail, aucun rattrapage le lendemain |
| RM-07 | Le dernier parcours en cours vient d'être terminé | La validation réussit | Rappel arrêté (raison « fin »), aucun e-mail d'annonce, ligne dans le bilan |
| RM-08 | 3 e-mails envoyés sans aucune validation entre eux | L'heure du 4e arrive | Rien n'est envoyé, rappel arrêté (raison « inactivité »), `/profil` indique la pause |
| RM-09 | Abonnement résilié | L'heure arrive ; puis réactivation | Aucun envoi ; après réactivation, le rappel reste arrêté jusqu'à réactivation manuelle |
| RM-10 | E-mail reçu | Il clique sur la désinscription sans être connecté | Effet immédiat et page de confirmation ; lien rejoué : même confirmation sans erreur ; jeton falsifié : refus sans révéler l'existence d'un compte |
| RM-11 | Rappel à 19 h le dimanche 25/10/2026 (changement d'heure) | Horloge simulée avant et après | Envoi à 19 h locale dans les deux cas, jamais deux envois |
| RM-12 | Le fournisseur d'e-mail échoue | L'heure arrive | Une nouvelle tentative dans l'heure, puis abandon ; aucun doublon le lendemain ; échec dans l'e-mail quotidien d'alertes |
| RM-13 | Planification faite, le membre change de jour ou d'heure | Les créneaux se recalculent | Prochain envoi aux nouvelles valeurs ; jamais deux e-mails la même semaine |
| RM-14 | Adresse non vérifiée | Il tente d'activer | Refus avec message ; aucun envoi |
| RM-15 | Visiteur ou compte FREE | Il cherche le réglage ; appel direct de l'API | Aucune interface ; 401 ou 403 |
| RM-16 | Gabarit d'e-mail | Test automatique | Aucun prix, aucune mention de « série » ou d'abonnement, aucune formule de la liste interdite, un seul bouton principal |
| RM-17 | Interrupteur général désactivé | Un créneau arrive | Aucun e-mail ne part et le réglage n'est pas proposé |
| RM-18 | Export de données ou suppression de compte | Demande du membre | Préférence et consentement exportés ou supprimés |

**Événements** : `rappel-active` {source : panneau-jour ou profil, jour} ; `rappel-desactive` {source : profil, lien-email, auto-fin, auto-inactivite, auto-abonnement} ; `rappel-envoye` (serveur) {parcours, etape} ; `rappel-saute` (serveur) {raison : deja-a-jour, pas-de-parcours, abonnement} ; `parcours-ouvert` reçoit `src` = `rappel` (K9, K12).

### 5.7 Récapitulatif des événements Umami (pour @data-analyst, nommage comme `mur-vu`)

| Événement | Déclencheur | Propriétés | K |
|---|---|---|---|
| `parcours-ouvert` (existant dans le plan du lot 1) | Arrivée sur `/parcours/[slug]` | `parcours`, `statut`, `src` : hero, hub, blog, recherche + **nouveaux** `reprendre`, `suite`, `rappel` | K2 |
| `etape-ouverte` (lot 1) | Ouverture d'une étape | `parcours`, `etape`, `statut`, **nouveau** `conseillee` | K3, K9, K14 |
| `rythme-jour-choisi` | Choix du jour | `jour`, `source` | K9 |
| `reprendre-clic` | Clic sur « Reprendre » | `parcours`, `etape`, `emplacement` | K7, K8 |
| `etape-retour` | Choix d'un des 3 boutons | `parcours`, `etape`, `resultat`, `moment`, `avec-note`, `modification` | K15 |
| `parcours-termine` (serveur, lot 1, étendu) | Dernière étape validée | `parcours`, `jours_ecoules`, `etapes_essayees`, `etapes_marche` | K10, K11, K15 |
| `bilan-vu`, `bilan-carte` | Ouverture du bilan, partage de la carte | `parcours`, `source` ou `action` | K10 |
| `suite-clic` | Clic sur une suite | `de`, `vers`, `type` | K11 |
| `rappel-active`, `rappel-desactive`, `rappel-envoye`, `rappel-saute` | Voir §5.6 | Voir §5.6 | K9, K12 |

## 6. Calendrier par dépendances (pas de semaines ni de sprints)

Deux chemins critiques indépendants, à mener **en parallèle** : « l'abonné revient » (rétention) et « l'offre dure » (contenu).

| Jalon | Contenu | Dépend de | Critère de sortie | Qui |
|---|---|---|---|---|
| **G0** Prérequis du lot 1 de l'audit | Événements Umami parcours et exclusion des visites de test ; carte de fin affichée sans rechargement, « Parcours terminé ! » seulement à la vraie fin, total d'XP exact (A2, COP-08) ; vidéo de Machine à Café 3 corrigée (`tpIOLzv11qo`) ; niveaux « Comique » et « Légende » ajoutés au code et double validation d'étape neutralisée (F18, **bloquant** : le cumul d'XP des parcours dépasse déjà 1 500) | Rien | Test sur un parcours de 4 à 6 étapes passe ; double clic ne double pas l'XP ; passage de 1 499 à 1 500 XP sans erreur | @fullstack, @qa |
| **G1** Décisions et étalons | Thomas tranche le §9. Étalons D5 : 3 à 5 sur les 3 étapes gratuites existantes, puis 1 par nouveau parcours (étape 1 de Storytelling, étape 1 de Pro), l'e-mail de rappel, le bilan et la carte, les textes du rythme, de « Reprendre » et du retour d'exercice | Rien (démarre tout de suite) | Étalons signés par Thomas ; brief @copywriter écrit | @product-manager, @copywriter, Thomas |
| **G2** Données | Migration groupée (§5.0) ; champ `nextParcoursRanking` dans le seed ; interrupteur de mise en service du rappel (désactivé) | G0 ; accord de migration (acquis, D2) | Migration appliquée en test ; comptes existants lus sans erreur (RD-10, RE-11) | @fullstack |
| **G3c** Suite dynamique (§5.5) | Algorithme et classement | Champ seed (G2) ; utile dès G0 | SU-01 à SU-12 verts ; la boucle actuelle a disparu | @fullstack, @qa |
| **G3b** Retour d'exercice (§5.3) | 3 boutons, relance douce, stockage, événement | G2, G1 (libellés) | RE-01 à RE-14 verts ; `etape-retour` reçu dans Umami | @fullstack, @qa |
| **G3a** Rythme doux (§5.1) | Panneau de jour, date conseillée, reprise douce | G2, G1 (textes) | RD-01 à RD-14 verts | @fullstack, @qa |
| **G3d** Reprendre (§5.2) | Bloc accueil, profil, hub | G2 ; G3a pour la date (publiable sans) | RP-01 à RP-12 verts | @fullstack, @ux |
| **G3e** Bilan (§5.4) | Bilan, carte, ré-accès | G3b, G3c, G0, G1 (textes) | BI-01 à BI-16 verts ; test de mots interdits vert | @fullstack, @design, @qa |
| **G3f** Rappel e-mail (§5.6) | Réglage, envoi planifié, arrêts, désinscription | G3a, étalon d'e-mail (G1), avis @legal, G2 | RM-01 à RM-18 verts ; **interrupteur laissé désactivé** jusqu'au feu vert de Thomas | @fullstack, @legal, @qa |
| **G4** Contenu Storytelling | Lecture des votes `nouveaux-parcours` (H3) et des requêtes Search Console sur « raconter une blague » ; export base des 6 conseils (RC2) ; vérification en base des 30 vannes et des 11 vidéos ; étape 1 d'abord, puis les 5 autres en lot ; relecture à l'aveugle ; quiz refaits (COP-05) ; import du seed ; aperçu visiteur (D1) | G1 ; affichage des vannes dans l'étape (D4) ; vérification des ids | 6 étapes validées par Thomas, diff mesuré (P0 s11), ids vérifiés, QA 5 états et 375 px | @copywriter, @fullstack, @qa |
| **G5** Contenu Pro | Même chaîne que G4 + conseil à écrire (étalons conseils, relecture à l'aveugle) + recherche de 3 à 4 vidéos plus justes | G1 ; étape 1 de Storytelling validée (sert de gabarit) ; correctif vidéo MàC 3 (G0) car `57Ip2k3us_8` y est aujourd'hui | 6 étapes validées, conseil neuf validé | @copywriter, @fullstack, @qa |
| **G6** Mise en ligne | Storytelling d'abord, Pro ensuite, chacun derrière un indicateur de publication : retrait du « Prochainement » pour ce qui est en ligne, compteurs « n parcours » dynamiques, titres signés (D8), maillage article vers étape 1, notification d'indexation, bascule du profil Storyteller du quiz vers Storytelling (§12). **Intacts** : FAQ « 8 semaines » et « 50 XP par semaine », « 15 à 20 min/semaine » | G4 (resp. G5) ; G3c ; idéalement G3e | Parcours visible dans le hub, page et sitemap ; étape 1 lisible visiteur ; étapes 2 et suivantes en aperçu ; tests de cohérence offre/seed à jour | @fullstack, @seo, @copywriter |
| **G7** Mesure et décision | Lecture de K9, K10, K11, K15 dans la section Parcours du rapport du lundi ; décision sur un 6e parcours (Yanis) et un « défi du mois » | G6 ; au moins 30 membres actifs pour conclure | Décision écrite à la roadmap | @data-analyst, @product-manager |

**Ordre minimal pour que l'abonné revienne** : G0, G2, G3b (72) et G3c (48), puis G3a (63) et G3d, puis G3e, enfin G3f (63, après avis @legal). **Ordre pour que l'offre dure** : G1, G4, G6 (Storytelling), G5, G6 (Pro). **Validations Thomas** : décisions §9 (G1), étalons (G1), publication de Storytelling, publication de Pro, mise en service du rappel.

## 7. Effet attendu sur K1 à K15

Les flèches indiquent le sens et l'intensité attendus, jamais un chiffre. **Aucune cible n'est lisible aujourd'hui** : 62 vues de pages parcours en 90 jours, 2 abonnés au prix de lancement, 0 abonné aux prix actuels. Premier verdict honnête : à partir d'une trentaine de membres actifs par cohorte (G7). Seuils : ceux de l'audit (tous des [HYPOTHÈSE]).

| K | Critère | Effet du lot | Mécanisme | Lecture |
|---|---|---|---|---|
| K1 | Découverte | ↗ léger, indirect | 2 pages de parcours indexables et 2 étapes 1 de plus comme portes ; le gros du levier K1 est ailleurs (maillage, SEO : PM-09) | Umami, pages vues |
| K2 | Démarrage | ↗ léger | Hub à 5 parcours, `src` mesuré (`reprendre`, `suite`, `rappel`) | `parcours-ouvert` |
| K3 | Lecture de l'étape 1 | → neutre | Dépend de la réécriture D5, pas de ce lot ; les 2 étapes 1 neuves sont de nouvelles références | `etape-ouverte` |
| K4 | Étape 1 terminée | → neutre | Quiz refaits (D5), hors lot | `quiz-etape-termine` |
| K5, K6 | Mur et conversion | → | Plus de portes, donc plus de murs vus ; conversion illisible tant que n est petit | `mur-vu`, `abonnement-reussi` |
| K7 | Activation 48 h | ↗ | « Reprendre » et panneau du jour dès la 1re validation | Base : date d'abonnement et date de validation |
| K8 | Passage étape 1 vers 2 | ↗ | Date conseillée, rappel sur demande | Base : validations datées |
| **K9** | **Rythme tenu** | **↗↗ cible principale** | Date conseillée + rappel choisi (H1) | Semaines actives avec au moins une validation / semaines depuis la 1re |
| **K10** | **Parcours terminé** | **↗** | « Reprendre », bilan comme horizon, 2 parcours de 6 étapes (au plus long, risque d'abandon plus fort : à surveiller) | Base : parcours terminés / commencés |
| **K11** | **Parcours suivant** | **↗↗** | Suite dynamique, fin de la boucle, 2 parcours de plus | Autre parcours démarré dans les 7 jours après `parcours-termine` |
| K12 | Retour à J7 | ↗ | Rappel, relance douce du retour d'exercice, « Reprendre » ; définition de « retour » à fixer : une ouverture d'étape ou une validation dans les 7 jours (la série compte aujourd'hui les connexions, D3 traité à part) | `etape-ouverte` |
| K13 | Rétention payante | ↗ (H5, à prouver) | Contenu de 13 à 25 étapes, suites proposées ; résiliations dans les 14 jours après une fin à surveiller | Stripe croisé avec `parcours-termine`, illisible avant une trentaine d'abonnés |
| K14 | Temps réel contre promis | → mais **mesurable** | Ouverture et validation datées donnent une durée approximative (pas un temps actif) ; budget RC7 : Storytelling ≤ 20, Pro ≤ 15 | Médiane par étape |
| **K15** | **Résultat vécu** | **↗↗ créé par ce lot** | N'existe pas aujourd'hui ; retour en 3 boutons | `etape-retour` : essayé ≥ 60 %, marche ≥ 70 % de ceux-là |

## 8. Hypothèses critiques et risques

| # | Hypothèse ou risque | Preuve | Test | Statut |
|---|---|---|---|---|
| H1 | Un rappel choisi par la personne augmente les étapes validées d'une semaine à l'autre | Faible chez nous, forte en général (audit §5) | Comparer K9 avec et sans rappel, lecture qualitative | À tester après G3f |
| H2 | Le retour d'exercice accroît le retour à J7 et le sentiment de progrès | Faible | Lire K15 et K12 après G3b | À tester |
| H3 | Le storytelling attire plus que le Pro | Faible (votes non lus, requêtes « raconter une blague » en cannibalisation sur 5 articles) | Lire les votes `nouveaux-parcours` et Search Console **avant G4** | Bloquant doux de G4 |
| H5 | Le contenu actuel ne retient pas au-delà de 2 à 3 mois | Moyenne | K13 | À tester |
| H6 | 6 étapes par parcours suffisent à porter l'abonnement | Faible | K10 et K13 ; décision à G7 | Nouvelle |
| H7 | Le retour d'exercice est surtout rempli plus tard que le jour de la validation | Faible | Part des réponses `moment` = plus-tard ou etape-suivante | Nouvelle |
| H8 | Au moins 20 % des membres actifs activent le rappel [HYPOTHÈSE] | Aucune | Taux d'activation, n minuscule | Nouvelle |
| R1 | Texte réel des conseils en base différent du seed (COP-09) | Démontré sur Machine à Café 1 | Export base avant tout brief (RC2) | Ouvert |
| R2 | Vidéos du Pro d'adéquation moyenne (8 sur 11) | Relu | Recherche préparée de 3 à 4 vidéos, sinon facultatives | Ouvert |
| R3 | Vannes d'adéquation moyenne (Storytelling 5, Pro 2, 4 et 6) | Relu | 5 vannes neuves validées à l'aveugle par étape concernée si @copywriter le juge utile | Ouvert |
| R4 | Recoupements : Machine à Café 3 avec Storytelling 1 ; Machine à Café 2 avec Pro 4 ; Storytelling 1 avec Pro 4 | Relu | Étalon qui fixe l'angle propre de chaque étape | Ouvert |
| R5 | Trafic : 62 vues de pages parcours en 90 jours ; deux parcours de plus ne convertissent pas sans arrivées (PM-09) | Snapshot du 05/10 | Maillage et étape 1 comme porte (lot 4 de l'audit) | Hors lot |
| R6 | Cannibalisation SEO sur « raconter une blague » | Search Console, non lue ici | Titres signés (D8) | Ouvert |
| R7 | E-mail de rappel : consentement, désinscription, délivrabilité | Aucun | Avis @legal, en-tête `List-Unsubscribe`, pas de pixel de suivi | Ouvert |
| R8 | Retour d'exercice auto-déclaratif, donc biaisé | Évident | Lecture qualitative, jamais de classement | Accepté |
| R9 | Reprise de 3 vidéos (`RYjfe8OSRFw`, `qdqIc-uzdbA`, `4t9a0To2ygo`) et d'une vanne (178) vues dans un autre parcours | Relu | Choix de Thomas (point 11 du §9) | Ouvert |

## 9. Décisions à valider par Thomas (sans jargon)

Format : problème, effet pour la personne, ce qu'on propose. Rien n'est implémenté ni publié avant ton accord.

| # | Sujet | Problème et effet | Ce qu'on propose |
|---|---|---|---|
| 1 | Nom « Pro » | Le mot peut se lire comme une offre payante « Pro » ou « version pro » : une personne qui n'est pas au bureau passerait à côté, une autre croirait à un palier de prix | « Parcours Boulot » (mot déjà utilisé pour classer les vannes). À défaut, « Parcours Pro » avec un sous-titre explicite |
| 2 | Durée | Storytelling 6 étapes à 20 min/semaine, Pro 6 étapes à 15 min/semaine : reste dans « 15 à 20 min/semaine selon le parcours », aucun chiffre du site ne change | Oui |
| 3 | XP | Storytelling 700 XP, Pro 600 XP, +100 de fin chacun ; total possible 3 100 contre 1 600 | Oui |
| 4 | Contenu à écrire | 1 conseil manque (Pro, étape 6). 8 vidéos sur 11 du Pro et quelques vannes sont des approximations | Un lot préparé, relu à l'aveugle : 1 conseil, 3 à 4 vidéos plus justes, et 3 vannes neuves par étape faible si @copywriter le juge utile |
| 5 | Étiquettes de niveau | Les conseils des étapes 5 et 6 de Storytelling sont marqués « Expert » en base ; afficher « Expert » décourage la personne qui reprend confiance | Afficher « Débutant → Intermédiaire » et ne pas montrer « Expert » |
| 6 | Visiteurs et retour d'exercice | Les 3 boutons sont réservés aux abonnés (le visiteur ne valide rien). Les ouvrir au visiteur sur l'étape 1, sans rien enregistrer, serait une nouvelle fonction visiteur | Non, on garde les visiteurs inchangés (`[CHOIX]` 05/10) |
| 7 | E-mail de reprise à 30 jours | L'audit PM le proposait ; il contredit D7 (rappel uniquement sur demande) | Supprimé. À la place : arrêt doux du rappel et reprise dans l'application |
| 8 | Règles du rappel | Un e-mail par semaine au plus ; jour et heure choisis par la personne, rien de pré-rempli ; arrêt automatique à la fin du dernier parcours ou après 3 e-mails sans activité [HYPOTHÈSE : 3] ; désinscription en un clic | Oui, avec avis @legal avant la mise en service (interrupteur désactivé par défaut) |
| 9 | Ordre des suites | Après un parcours, on propose d'abord un parcours commencé puis un non commencé, jamais un fini, selon un classement par parcours (§5.5) | Valider le tableau du §5.5 (surtout les lignes Storytelling et Pro, génériques) |
| 10 | Bilan et carte | Le bilan est lié à l'abonnement actif (comme les livrables) ; la carte partageable est sobre, sans prénom ni date, sans mot « certificat » | Oui à la carte sobre ; mention à ajouter aux CGU par @legal |
| 11 | Reprises | 3 vidéos (Mirabel, Haroun, Rollman) et 1 vanne (178) sont déjà dans un autre parcours : un membre qui fait les deux les revoit | Accepter (meilleures illustrations) ou remplacer si tu veux zéro doublon |
| 12 | Titres de pages | Les noms de pages (`storytelling`, `pro` ou `boulot`) doivent coller aux titres signés de `seo.md` §6 (D8), que cette spec n'a pas relu | Vérifier à la signature des titres |
| 13 | Votes | Les votes « nouveaux parcours » n'ont pas été lus ; l'ordre Storytelling puis Pro est déjà décidé (D6) | Lire les votes avant d'écrire ; l'ordre ne change que si tu le demandes |
| 14 | Yanis | Le lot sert peu la personne principale du projet (Storytelling vaut 3 sur 5 pour lui) | Inscrire à la roadmap un 6e parcours Répartie (coloc, amphi, soirée) après lecture des premières données (G7) |
| 15 | Quiz d'humour | Le profil Storyteller est envoyé vers Machine à Café, dont l'étape 1 visible ne parle pas de récit ; la phrase d'accroche promet trop | Garder Machine à Café avec une phrase vraie jusqu'à la publication, puis basculer vers Storytelling ; les 4 autres profils restent (§12) |

## 10. Vérifié / non vérifié (G_PROOF)

**Vérifié (relu directement dans les fichiers).**
- Les 11 conseils réutilisés : id, titre exact, catégorie, difficulté (`conseils-seed.json`). Les 3 conseils désactivés le 30/09 (ids 66, 22, 64 : « Retrouver sa voix drôle après une pause sociale », « La répartie bienveillante », « Le silence après le rire ») ne sont pas utilisés.
- Les 22 vidéos : `youtubeId`, artiste, titre, durée (`videos-seed.json`, durées au format ISO converties). Les 3 reprises (`RYjfe8OSRFw` dans Confiance 2, `qdqIc-uzdbA` dans Répartie 1 et 4, `4t9a0To2ygo` dans Confiance 4) et l'identifiant placé par erreur dans Machine à Café 3 (`57Ip2k3us_8`, vidéo n° 74, Thomas VDB, correctif `tpIOLzv11qo`).
- Les 60 vannes : chaque id lu dans `blagues-seed.json` ; aucun recoupement avec les 62 ids des 13 étapes actuelles sauf 178 (Répartie 4) ; aucun doublon entre les 12 étapes.
- Calculs refaits à la main : 245 + 120 + 90 = 455 min ; 1 300 + 700 + 600 = 2 600 XP, 5 bonus de 100 = 500, total 3 100 ; Sophie 3 + 6 + 6 = 15 semaines ; les dates d'exemple (lundi 12, jeudi 15, jeudi 22 octobre 2026 ; dimanche 25 octobre 2026 = changement d'heure).
- Contraintes : `[CHOIX UTILISATEUR]` de `docs/founder-preferences.md` (lignes du 29/09 au 07/10).

**Non vérifié (déduit ou inaccessible).**
- **La base de production** : texte réel des conseils (différence démontrée avec le seed sur Machine à Café 1, COP-09), statut actif des conseils, des vannes (catalogue ramené à 125 le 30/09, PM-04) et des vidéos. Les ids du seed sont les seuls cités ; aucun id n'a été « supposé » ailleurs.
- **Lecteur vidéo** : aucune vidéo testée sur YouTube. Les extraits minutés de `qdqIc-uzdbA` et `4t9a0To2ygo` n'ont pas de minutes dans le seed (pas de `recommendedTimestamp`) : à fixer par @copywriter, aucune minute inventée ici.
- **Code** : aucun fichier de code lu dans cette session ; les faits sur le code viennent des audits s17 (carte de fin, XP, niveaux, routes, liste d'événements Umami). La structure des données, les routes et les noms d'API de §5 sont des **PROPOSITIONS** que @fullstack confirme.
- Non relus : `seo.md` §6 (titres D8), `upcoming-features.tsx`, les votes `nouveaux-parcours`, Search Console, `audit-conseils-s14.md` (cité via `founder-preferences.md`), le stockage éventuel du résultat du quiz d'orientation.
- **Durées par étape** : estimations (RC7), aucune mesure réelle (K14).
- **Personas** : valeurs 3, 4, 5 sur 5 = estimations de l'audit PM §6, pas des données.

## 11. Handoff

**Handoff → @orchestrator** (puis @copywriter, @fullstack, @data-analyst, @legal, @seo, @design, @qa)
- **Fichier produit** : `/home/user/Marrant/docs/product/specs-parcours-storytelling-pro-s17.md`. Aucun autre fichier modifié, aucun commit. L'entrée de l'historique de `project-context.md` reste à ajouter par la session.
- **Décisions prises** : deux parcours de 6 étapes (Storytelling 20 min, Pro 15 min), étape 1 gratuite pour chacun ; 11 conseils réutilisés, 1 à écrire ; 6 mécaniques spécifiées avec 86 critères testables (RD 14, RP 12, RE 14, BI 16, SU 12, RM 18) ; e-mail de reprise non sollicité écarté (D7) ; certificat écarté (F6).
- **Points d'attention** : (1) vérifier la base avant tout brief (RC2) ; (2) correctif de la vidéo de Machine à Café 3 avant la publication du Pro ; (3) niveaux « Comique » et « Légende » et double validation d'XP avant toute nouvelle récompense (G0) ; (4) rien ne se lit avant une trentaine de membres actifs ; (5) étalons signés par Thomas avant tout texte (P0 s8) ; (6) rappel e-mail : interrupteur désactivé, avis @legal, brouillon d'e-mail ; (7) aucun chiffre existant du site n'est touché (« 8 semaines », « 50 XP par semaine », « 15 à 20 min/semaine », « 1 500+ »).
- **Par agent** : @copywriter : étalons puis 12 étapes (11 conseils existants à réécrire seulement si la base diverge, 1 conseil neuf), quiz refaits, textes des 6 mécaniques. @fullstack : G0, G2, G3, import seed, export base des conseils. @data-analyst : événements du §5.7, section Parcours du rapport du lundi. @legal : consentement et désinscription du rappel, mention du bilan dans les CGU, durées de conservation des retours. @seo : slugs et titres (D8), maillage. @design : carte du bilan, blocs rythme et « Reprendre ». @qa : critères RD, RP, RE, BI, SU, RM ; test des mots interdits ; horloge simulée pour le 25/10/2026.

## 12. Quiz « Quel type d'humour es-tu ? » : profil vers parcours (demande de la coordination, lot C)

**Question.** Le lot C a relié chaque profil à un parcours « à titre d'hypothèse » (`apps/web/src/components/quiz/quiz-data.ts`, champ `recommendedParcours`, et textes `QUIZ_HUMOUR_PARCOURS.raison` de `apps/web/src/config/textes/entrees-parcours.ts`, lus en lecture seule). Le résultat envoie vers l'**étape 1** du parcours (`?src=quiz`) : c'est donc l'étape 1, seule lisible par le visiteur, qui doit parler au profil. Jugement fait sur l'étape 1 telle que décrite par les audits (Machine à Café 1 : conseil « faux secret » sous le titre « Des vannes courtes, faciles à ressortir » ; Répartie 1 : ironie bienveillante ; Confiance 1 : « énoncer la règle non écrite », observation du quotidien) et sur la suite payante.

| Profil | Hypothèse lot C | Verdict avec les 3 parcours actuels | Après Storytelling et Pro |
|---|---|---|---|
| Observateur | Confiance | **Validé.** L'étape 1 de Confiance est de l'observation pure et la phrase « regarder ton quotidien avec un œil comique » est vraie. Réserve : le parcours est écrit pour reprendre confiance (public Marc), alors que ce profil se sait déjà bon observateur : l'étalon de la phrase d'accroche doit éviter le ton « tu as perdu ta légèreté » | **Reste Confiance.** L'étape 1 du Pro observe aussi (la réunion), mais le quiz ne sait pas si la personne travaille au bureau : on ne l'y envoie pas |
| Storyteller | Machine à Café | **Faible, à corriger.** Seule l'étape 3 de Machine à Café (payante) enseigne l'anecdote ; l'étape 1 visible porte sur autre chose, et la phrase « t'apprend à la raconter au bon moment et jusqu'au bout » promet plus que ce que le visiteur lit. Aucun des 3 parcours actuels ne convient mieux : on garde Machine à Café **temporairement** avec une phrase d'accroche qui dit la vérité (l'anecdote arrive à l'étape 3) | **Bascule vers Storytelling** dès sa publication. L'étape 1 de Storytelling (conseil 23, les 3 actes) est exactement le conseil du résultat (« construis tes anecdotes en 3 temps ») et la phrase actuelle devient vraie |
| Absurde | Machine à Café | **Validé par défaut, maillon faible.** Machine à Café donne des vannes courtes à placer au bon moment, ce que dit la phrase. Aucun parcours actuel n'a d'étape 1 sur l'absurde (le décalage de registre est en étape 5 de Confiance, le « oui, et » en étape 4 de Répartie, tous deux payants) | **Reste Machine à Café.** Ni Storytelling ni Pro ne traitent l'absurde. Un parcours « registres » pourrait être étudié plus tard (roadmap, hors de ce lot) |
| Punchlineur | Répartie | **Validé.** L'étape 1 (ironie bienveillante, ton pince-sans-rire) et l'étape 2 (le rythme et les silences) collent à ce profil. Second choix possible : Machine à Café (« vannes courtes ») | **Reste Répartie** |
| Taquin | Répartie | **Validé, meilleure correspondance** (chambrage, retourner la pique, « oui, et ») | **Reste Répartie** |

**Ce que ça change.**
1. Un seul profil bascule : **Storyteller vers Storytelling**, à la publication du parcours. Le Pro n'est la cible d'aucun profil : c'est un contexte (le bureau), pas un style d'humour ; il s'atteint par le hub, les articles du bureau et la suite dynamique (§5.5).
2. Le lien profil vers parcours doit **ne jamais pointer un parcours non publié** : lire les parcours publiés, avec repli sur la correspondance actuelle tant que Storytelling n'est pas en ligne. Ajouter cette bascule à G6 (mise en ligne) et à son critère de sortie.
3. Critère d'acceptance (G6) : Given Storytelling non publié, When un Storyteller termine le quiz, Then le bouton mène à l'étape 1 de Machine à Café ; Given Storytelling publié, Then il mène à `/parcours/storytelling` avec `src=quiz` ; dans les deux cas la phrase d'accroche est vraie pour l'étape 1 affichée (relue par @copywriter, étalon).
4. Les 5 phrases d'accroche sont provisoires (marquées « étalon à valider » dans le fichier) : elles passent par les étalons de G1.

## Annexe A. Squelettes compatibles `parcours-seed.json`

Les champs sont ceux du seed actuel. Tout texte `[À ÉCRIRE]` est produit par @copywriter après étalons. `quiz` reste vide tant que les questions ne sont pas écrites (RC5). Le champ `optional` sur une vidéo est une **PROPOSITION** (vidéo facultative) à confirmer par @fullstack ; il n'existe pas dans le seed actuel. `nextParcoursRanking` est un champ ajouté (§5.5).

### A.1 Storytelling

```json
{
  "slug": "storytelling",
  "title": "Parcours Storytelling",
  "description": "[À ÉCRIRE]",
  "duration": "6 semaines",
  "timePerWeek": "20 min/semaine",
  "difficulty": "INTERMEDIAIRE",
  "difficultyLabel": "DEBUTANT → INTERMEDIAIRE",
  "icon": "[À CHOISIR @design]",
  "order": 4,
  "persona": "Marc (34 ans, récemment séparé)",
  "personaTagline": "[À ÉCRIRE]",
  "testimonial": "[À ÉCRIRE : « Imagine … »]",
  "nextParcours": "machine-a-cafe",
  "nextParcoursReason": "[À ÉCRIRE]",
  "nextParcoursRanking": ["machine-a-cafe", "repartie", "confiance", "pro"],
  "steps": [
    {
      "week": 1, "tipTitle": "Raconter une anecdote en 3 actes", "dayNumber": 3,
      "why": "[À ÉCRIRE]", "moduleTitle": "Le plan en trois actes", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 50, "free": true, "jokeIds": [293, 304, 247, 245, 298],
      "videos": [
        { "youtubeId": "JuB6-b0fhLE", "artist": "Panayotis Pascot", "title": "Amsterdam et le Kem's", "why": "[À ÉCRIRE]" },
        { "youtubeId": "v-ySkBGAXLI", "artist": "Thomas Ngijol", "title": "Le voisin", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 2, "tipTitle": "La technique du personnage", "dayNumber": 10,
      "why": "[À ÉCRIRE]", "moduleTitle": "Donner une voix à ceux de ton histoire", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 75, "free": false, "jokeIds": [308, 320, 309, 311, 301],
      "videos": [
        { "youtubeId": "fnu6fRa-BN4", "artist": "Samia Orosemane", "title": "Les accents africains", "why": "[À ÉCRIRE]" },
        { "youtubeId": "PrQTbXOz2iU", "artist": "Laura Domenge", "title": "La vie de couple", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 3, "tipTitle": "Rigoler de ses échecs", "dayNumber": 17,
      "why": "[À ÉCRIRE]", "moduleTitle": "Raconter un raté comme une épopée", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 100, "free": false, "jokeIds": [118, 205, 233, 276, 125],
      "videos": [
        { "youtubeId": "Fw14PLdtSyA", "artist": "Nora Hamzawi", "title": "Les chagrins d'amour (chronique France Inter)", "why": "[À ÉCRIRE]" },
        { "youtubeId": "0FmK8RA_hnE", "artist": "Nordine Ganso", "title": "La première fois", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 4, "tipTitle": "Le twist final", "dayNumber": 24,
      "why": "[À ÉCRIRE]", "moduleTitle": "La chute qu'on n'a pas vue venir", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 125, "free": false, "jokeIds": [321, 322, 334, 329, 234],
      "videos": [
        { "youtubeId": "RYjfe8OSRFw", "artist": "Paul Mirabel", "title": "Je me suis fait racketter", "why": "[À ÉCRIRE]" },
        { "youtubeId": "uEj_jmlANXE", "artist": "Djimo", "title": "J'aurais kiffé être une tortue", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 5, "tipTitle": "La blague à tiroirs", "dayNumber": 31,
      "why": "[À ÉCRIRE]", "moduleTitle": "Quand ton histoire fait un détour", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 150, "free": false, "jokeIds": [95, 136, 192, 213, 292],
      "videos": [
        { "youtubeId": "cl-fIl6hjTw", "artist": "Jason Brokerss", "title": "Le mariage (Montreux)", "why": "[À ÉCRIRE]" },
        { "youtubeId": "JtU_EB5i2Mk", "artist": "Sugar Sammy", "title": "L'andrologue", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 6, "tipTitle": "Le callback : faire revenir une vanne au bon moment", "dayNumber": 38,
      "why": "[À ÉCRIRE]", "moduleTitle": "Faire revenir un détail à la fin", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéo + quiz final",
      "moduleXp": 200, "free": false, "jokeIds": [316, 324, 253, 303, 177],
      "videos": [
        { "youtubeId": "eYhWcDdI3rM", "artist": "Jonathan Cohen", "title": "Serge le Mytho (Bloqués)", "why": "[À ÉCRIRE]" }
      ],
      "quiz": []
    }
  ]
}
```

### A.2 Pro (nom et `slug` à valider, point 1 du §9)

```json
{
  "slug": "pro",
  "title": "Parcours Pro",
  "description": "[À ÉCRIRE]",
  "duration": "6 semaines",
  "timePerWeek": "15 min/semaine",
  "difficulty": "DEBUTANT",
  "difficultyLabel": "DEBUTANT → INTERMEDIAIRE",
  "icon": "[À CHOISIR @design]",
  "order": 5,
  "persona": "Sophie (26 ans, jeune active)",
  "personaTagline": "[À ÉCRIRE]",
  "testimonial": "[À ÉCRIRE : « Imagine … »]",
  "nextParcours": "storytelling",
  "nextParcoursReason": "[À ÉCRIRE]",
  "nextParcoursRanking": ["storytelling", "machine-a-cafe", "repartie", "confiance"],
  "steps": [
    {
      "week": 1, "tipTitle": "Survivre aux réunions avec humour", "dayNumber": 3,
      "why": "[À ÉCRIRE]", "moduleTitle": "La réunion vue de la salle", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 50, "free": true, "jokeIds": [122, 186, 106, 130, 194],
      "videos": [
        { "youtubeId": "57Ip2k3us_8", "artist": "Thomas VDB", "title": "Bitcoin, JPEG et blockchain", "why": "[À ÉCRIRE]" },
        { "youtubeId": "dQ--q5y2e4k", "artist": "Arnaud Tsamère", "title": "L'avocat de la salade, la frite et la saucisse", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 2, "tipTitle": "L'humour digital : mails, Slack et textos pro", "dayNumber": 10,
      "why": "[À ÉCRIRE]", "moduleTitle": "Écrire drôle au boulot sans finir en capture d'écran", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 75, "free": false, "jokeIds": [138, 198, 181, 146, 190],
      "videos": [
        { "youtubeId": "jKhIOyk9kdU", "artist": "Pierre Croce", "title": "Tester Tinder avec un enfant", "why": "[À ÉCRIRE]" },
        { "youtubeId": "zGT7TX66JFQ", "artist": "Jason Brokerss", "title": "Snapchat", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 3, "tipTitle": "La vanne de couloir : l'art du timing entre deux réunions", "dayNumber": 17,
      "why": "[À ÉCRIRE]", "moduleTitle": "Le couloir : quinze secondes", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 100, "free": false, "jokeIds": [162, 57, 170, 142, 101],
      "videos": [
        { "youtubeId": "NebHsD_K9lM", "artist": "Guillermo Guiz", "title": "Les cabillauds, ces arrogants !", "why": "[À ÉCRIRE]" },
        { "youtubeId": "3v8Y4C9Q5hE", "artist": "Kev Adams", "title": "Du côté de chez vous", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 4, "tipTitle": "L'afterwork : passer de collègue à personne drôle", "dayNumber": 24,
      "why": "[À ÉCRIRE]", "moduleTitle": "L'afterwork : ta semaine en anecdote", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 100, "free": false, "jokeIds": [21, 50, 114, 341, 340],
      "videos": [
        { "youtubeId": "tj6qta_9PaM", "artist": "Anne Roumanoff", "title": "Carmen et la crise", "why": "[À ÉCRIRE]" },
        { "youtubeId": "TDmd7JRlxFc", "artist": "Florence Foresti", "title": "Le styliste (Boys Boys Boys)", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 5, "tipTitle": "Survivre (et briller) au networking pro avec humour", "dayNumber": 31,
      "why": "[À ÉCRIRE]", "moduleTitle": "Le « tu fais quoi dans la vie ? »", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéos + quiz",
      "moduleXp": 125, "free": false, "jokeIds": [9, 141, 38, 66, 94],
      "videos": [
        { "youtubeId": "qdqIc-uzdbA", "artist": "Haroun", "title": "L'impro et la répartie", "why": "[À ÉCRIRE : extrait minuté ≤ 5 min]" },
        { "youtubeId": "ztKRY4eNUTA", "artist": "Lisa Delmoitiez", "title": "J'ai pas confiance en moi et j'ai raison", "why": "[À ÉCRIRE]", "optional": true }
      ],
      "quiz": []
    },
    {
      "week": 6, "tipTitle": "[CONSEIL À ÉCRIRE : prise de parole officielle]", "dayNumber": 38,
      "why": "[À ÉCRIRE]", "moduleTitle": "Prendre la parole quand c'est officiel", "moduleDetail": "[À ÉCRIRE]",
      "moduleFormat": "Conseil technique + vannes à pratiquer + vidéo + quiz final",
      "moduleXp": 150, "free": false, "jokeIds": [178, 211, 68, 157, 260],
      "videos": [
        { "youtubeId": "4t9a0To2ygo", "artist": "Marina Rollman", "title": "Les enterrements de vie", "why": "[À ÉCRIRE : extrait minuté ≤ 5 min]" }
      ],
      "quiz": []
    }
  ]
}
```

