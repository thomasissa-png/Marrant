# Grille de qualité des posts, version 1 (26/11/2026)

> Usage : chaque post du programme hebdomadaire (`systeme-hebdo-claude-grok-s27.md` §2bis) passe cette grille avant d'être présenté à Thomas. Un critère est binaire : PASS ou FAIL, avec une preuve d'une ligne. Tirée de l'existant (audits s15, `audit-qualite-12-10.md`, `duels-resultat-cycle5.md`, `banque-reponses.md`, `etalons-formats-sociaux-s15.md`, `mesure.md`) et des règles de marque (`docs/copy/ton-alex.md`, CLAUDE.md règle 12). Elle est une hypothèse versionnée : le samedi la corrige (§4).
> Limite écrite : les critères G10 et G4 s'appuient sur une recherche réelle (WebSearch), pas sur la mémoire du relecteur. Les relecteurs de la session sont des IA du même type que l'auteur : même biais, bruit d'environ un point (`audit-qualite-12-10.md` §3). La grille ne remplace ni Thomas ni un rire humain.

## 1. Critères communs (tous réseaux), G1 à G15

| Id | Critère (réponse binaire) | Preuve demandée | Origine dans l'existant |
|---|---|---|---|
| G1 | **Accroche** : les 5 premiers mots (texte) ou les 2 premières secondes (vidéo, texte à l'écran inclus) posent une situation ou une surprise. Aucun préambule (« Salut », « Aujourd'hui on va », nom du site) | citer les 5 premiers mots ou le plan 1 | `content-templates.md` (hook 5 mots), étalons E4/E7 (scène d'abord) |
| G2 | **Une seule idée** : le post se résume en une phrase sans « et » | écrire la phrase | étalons conseils (un seul critère faisable) |
| G3 | **Ton d'Alex** : tutoiement, observation plutôt que leçon, pote drôle et bienveillant ; aucun mot coach ou scolaire (cours, formation, programme, booster, maîtriser) ; aucun prénom de persona (Yanis, Sophie, Marc) ; posts de marque : « je » seulement dans une réplique entre « » (réponses aux commentaires : question ouverte du système §8) | relire contre `ton-alex.md`, lister les mots signalés | `audit-note-s15` (6 posts LinkedIn sur 9 « coach »), R6, `content-templates.md` |
| G4 | **Véracité et source** : chaque fait, chiffre, date ou citation d'humoriste a une ligne `source` ouvrable (slug, ligne du journal, URL datée) | ouvrir la source, noter OK | règle P0 s15 (citations vérifiées, pas retirées) |
| G5 | **Zéro donnée inventée** : aucun chiffre, prix, témoignage, fonction ou date absent de la source ; chiffre de catalogue revérifié s'il date de plus de 30 jours | lister les chiffres du post et leur source | CLAUDE.md n°2 ; `project-context.md` (290+ vannes datées du 24/03) |
| G6 | **Lien** : UTM complet (`utm_source`, `utm_medium=social`, `utm_campaign=AAAA-Sxx`, `utm_content=<id>` en minuscules) et page en 200, ou « aucun » justifié par le réseau | coller l'URL, noter le code HTTP | `mesure.md` §1 (aucun lien sans UTM) |
| G7 | **Format natif** : longueur et structure du réseau respectées (voir §2) | compter signes, cartes ou secondes | `mesure.md`, étalons de formats |
| G8 | **Appel à l'action lettre, pas payant** : l'invitation mène à lire, essayer le quiz ou lire la lettre ; aucun lien d'abonnement en première intention ; aucun prix ni « gratuit » tant que Thomas n'a pas tranché (question ouverte du système §0) | citer la ligne d'appel | `validation-thomas-s15` §3.4, `banque-reponses` règle 4 |
| G9 | **Typographie de marque** : zéro tiret cadratin, zéro émoji, guillemets « », 3 à 5 hashtags au plus (ou aucun) | recherche automatique du caractère | CLAUDE.md règle 12 |
| G10 | **Humour au niveau, ou pas d'humour** : si le post contient une vanne, les 4 sont vrais : (a) vanne du catalogue GARDER ou notée au moins 8,5 par 2 lecteurs à l'aveugle ; (b) recherche web « blague connue » faite, résultat noté ; (c) aucun cliché de la liste (mère qui appelle, couple qui ne choisit pas le resto, retraité débordé, anniversaire surprise, détecteur de fumée minuteur, mème du planning, raconteur de vacances) ; (d) le début ne livre pas la chute. Sinon le post est factuel sans vanne | citer les 4 réponses | `audit-qualite-12-10` §1 (3 vannes sur 21 au niveau), règle d'or P0 s18 |
| G11 | **Variété** : pas le même sujet avec le même angle dans les 8 derniers programmes ; ouverture différente des 3 derniers posts du réseau ; pas plus d'une vanne au moule « amorce // chute » par réseau et par semaine ; pas plus d'un « À envoyer à » par semaine | comparer au registre des `source` | `audit-qualite-12-10` §2 (moule unique, tic « À envoyer à » sur 8 posts sur 9) |
| G12 | **Brief exécutable sans interprétation** : chaque plan ou carte a son texte exact, sa durée, ses sous-titres, son son, ses interdits, son alt text et son format en pixels ; aucun adjectif d'ambiance sans consigne (« dynamique », « moderne ») ; Grok n'a aucune question à poser | un lecteur extérieur ne pose aucune question | §2.4 du système ; `visuels-s15/v4/` |
| G13 | **Visuels et droits** : aucun visage de personne réelle ni ressemblance avec un humoriste ; musique libre de droits ; étiquette « contenu IA » prévue si le visuel est réaliste (portraits imaginés compris) | cocher chaque point du brief | §2.4 du système, AI Act |
| G14 | **Date et sujet** : date de fin de validité renseignée ; saison cohérente (pas de « tri de printemps » en octobre) ; aucun sujet sensible (deuil, drame, procès) traité par la vanne | citer la date | `audit-qualite-12-10` (tri de printemps), règle fixe 8 |
| G15 | **Rattachement et valeur** : le post porte un contenu maître (A, B ou C), un pilier et une chose concrète pour le lecteur (technique, réplique, information, nouveauté inscrite au journal) ; aucun post décoratif ; aucun concurrent nommé | écrire « ce que Yanis garde » en une ligne | système §1.1, règle commune 9 |

## 2. Critères propres à un réseau

| Id | Réseau | Critère |
|---|---|---|
| TT1 | TikTok | La situation de chambrage est reconnaissable dans les 3 premières secondes, texte à l'écran EXACT dès le plan 1 |
| TT2 | TikTok | Durée de 20 à 35 s, sous-titres présents, la vidéo se termine sur la chute ou la réplique, pas sur le site ; « lien dans la bio » dit au plus une fois ; aucun lien en légende |
| IG1 | Instagram | La carte 1 se comprend seule (elle fait arrêter le scroll) ; 35 mots au plus par carte ; carrousel de 4 à 6 cartes ou Reel de 20 à 35 s |
| IG2 | Instagram | Légende de 150 signes au plus, sans lien ni prix ; elle dit à qui l'envoyer ou ce qu'on garde, sans reprendre la formule de la semaine précédente (voir G11) |
| X1 | X | 270 signes au plus, le lien comptant pour 23 ; aucun thread, aucun émoji, aucune question finale ; la dernière phrase n'explique pas la chute |
| LI1 | LinkedIn | 3 phrases au plus ; angle travail concret (machine à café, réunion, tour de table) ; ni ton coach ni ton corporate ; aucune liste « N conseils » |
| LI2 | LinkedIn | Lien en dernière ligne, jamais en premier commentaire ; le post tient debout sans cliquer |

## 3. Procédure d'application (résumé, détail dans le système §2bis)

1. L'auteur remplit la fiche du post : id, critères applicables, PASS/FAIL, preuve d'une ligne.
2. Deux relecteurs à l'aveugle (persona Yanis, relecteur de la plateforme) reçoivent seulement le post et cette grille, jamais les notes de l'auteur ni les verdicts précédents ; ils rendent un PASS ou FAIL par critère, avec un motif d'une phrase.
3. Un seul FAIL chez un relecteur suffit à renvoyer le post en correction. Seuil de sortie : tous les critères applicables à PASS chez les deux relecteurs.
4. Trois tours au plus par post ; au troisième FAIL, le post est écarté (§2bis du système).

## 4. Itération de la grille (chaque samedi, étape 9 bis de la routine)

Entrées : rapport Grok (statistiques, signalements §10, commentaires), clics UTM, verdicts de la semaine, retours de Thomas.

| Écart constaté | Action sur la grille |
|---|---|
| Post qui passe tous les critères mais aucune visite UTM ni engagement (seuils de `mesure.md`) pendant 4 semaines | chercher la différence avec les posts qui ont marché, proposer un critère à l'essai |
| Post qui échoue à la grille puis, publié par erreur ou exception, marche | assouplir ou reformuler le critère concerné |
| Critère toujours PASS depuis 6 semaines | candidat au retrait, ou à durcir |
| Critère qui fait échouer plus de 30 % des posts, ou lecteurs en désaccord | le reformuler pour qu'il soit tranché sans interprétation |
| Signalement de texte par Grok (§10) ou faute objective (blague connue, fait faux) | ajouter une preuve ou un critère le jour même |
| Remarque de Thomas | traitée en priorité, versionnée comme les autres |

Règles : 3 changements au plus par samedi ; un changement d'audience demande au moins 4 semaines de relevés et 2 posts concordants (11 publications par semaine et un trafic social d'origine d'environ 7 visites en 30 jours : une semaine isolée ne prouve rien) ; un critère ajouté est « à l'essai » 2 semaines puis confirmé ou retiré ; un critère retiré est archivé dans le journal avec sa raison. Le fichier change de version à chaque modification (v1, v2...).

## 5. Journal des changements

| Version | Date | Changement | Raison (donnée source) |
|---|---|---|---|
| v1 | 26/11/2026 | Création : 15 critères communs, 7 critères par réseau | Leçons des audits s15 (`audit-qualite-12-10`, `duels-resultat-cycle5`, `audit-note-s15`), règles de marque ; aucune donnée d'audience disponible pour la calibrer |
