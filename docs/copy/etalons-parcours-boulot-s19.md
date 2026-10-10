# Étalons du parcours Boulot (s19, 10/10/2026)

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 6 étapes du parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : nom « Parcours Boulot » ; 6 étapes ; 15 min/semaine ; XP 50, 75, 100, 100, 125, 150 + 100 de fin ; étape 1 lisible par le visiteur, validation Premium ; textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication (3 questions par étape, 4 à la dernière, bonne réponse répartie sur les positions) ; repli solo sur chaque exercice ; « première étape gratuite », jamais « cours gratuit » ; doublons de vidéos et de vannes acceptés ; « Expert » jamais affiché ; pas de certificat ; pas de compte gratuit ; prix inchangés. Le Boulot n'est la cible d'aucun profil du quiz d'humour (spec §12) : rien à décider là-dessus.
> Règles tenues : tutoiement, « vanne » (jamais « blague »), zéro tiret cadratin dans les textes, pas scolaire, pas corporate, aucune mention d'IA, aucun concurrent, aucun prénom de persona (« Anouk » est un exemple, jamais présenté comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où la fiche vidéo en base les cite, jamais viser une personne (la situation, le système, soi-même). Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi.** Faits relus dans `docs/content/boulot-base-s19.json` (export prod du 10/10, lecture seule, rien n'a été re-requêté). Rapprochements vannes et vidéos faits par texte et par `youtubeId` dans `parcours-reecriture-s17.json` et `parcours-storytelling-s18.json`.

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | § | Point | Options | Reco |
|---|---|---|---|---|
| 1 | 1 | Les 5 conseils à (ré)écrire, étapes 1, 3, 4, 5 et 6 | Textes en cours de relecture à l'aveugle : tu valides le texte quand il passe | **Valider** (emplacement, rien à lire encore) |
| 2 | 2 | Fiche du parcours (description, accroche, témoignage « Imagine… ») | A sobre / B complice | **B** |
| 3 | 4 | Titre de la page (≤ 60 caractères) et slug | A avec durée / B avec l'arc du parcours | **A**, slug `boulot` |
| 4 | 5 | Vannes des 6 étapes (30 places) | A actives là où elles collent + 15 vannes neuves relues à l'aveugle / B actives partout, y compris hors boulot | **A** |
| 5 | 6 | Vidéos des 6 étapes | A celles de la spec / B mes remplacements, étape par étape | **B** (tu peux dire « B sauf étape X ») |
| 6 | 7 | Garde-fou « jamais viser une personne » | A une vigilance propre à chaque étape / B un seul test, le même du début à la fin | **B** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis, tu valides le texte ou tu corriges un mot. Seules deux de ses lignes dépendent d'un choix : la légende de la vidéo facultative (choix 5) et une phrase finale (choix 6, marquée `[SI 6B]`).
« Je suis tes recos » suffit : valider le choix 1, puis B, A (titre), A (vannes), B (vidéos), B (garde-fou). Le détail et les textes complets sont dessous.

## Ce que la base a changé (faits relus le 10/10)

- **Conseils** : sur les 97 conseils au titre « bureau », 3 seulement sont actifs. Un seul sert le parcours : « Le PS qui détend un mail sérieux » (étape 2), actif et au niveau. Les quatre autres conseils prévus sont **inactifs** (retirés le 30/09, sous la barre) : « Survivre aux réunions avec humour » (1), « La vanne de couloir : l'art du timing entre deux réunions » (3), « L'afterwork : passer de collègue à personne drôle » (4), « Survivre (et briller) au networking pro avec humour » (5). Le conseil de l'étape 6 (prise de parole officielle) n'existe pas. Le troisième conseil actif, « Compare la manie d'un collègue à un autre métier », est écarté : il vise une personne, même avec tendresse. Les ~90 autres conseils « bureau » inactifs (tics et rituels de collègues, lundi matin) ne reviennent pas : ils ciblent des personnes.
- **Vannes** : 16 vannes BOULOT actives (47 inactives). Rapprochées par texte exact des parcours : **8** sont déjà en ligne (Machine à Café : « comparé nos salaires », « copie de 90 mails », « costume de mon père », « portique », « mug » ; Répartie : « rapport de stage », « chez ma mère », « voisine ») ; **3** sont dans Storytelling (« briefé pendant 45 minutes », « mail de bienvenue », « pot de départ ») ; **5** ne sont dans aucun parcours (Rome, « point rapide avant l'été », entretien « Vous avez trouvé facilement ? », archives du stage, canapé de l'espace détente). `[ÉCART : la session annonçait 9 et 3 ; mes recoupements donnent 8 et 3, soit 16 au total. 9 + 3 + 5 ferait 17. À contrôler par @fullstack si le chiffre compte.]` Trois autres vannes actives parlent du travail sans être classées BOULOT et sont aussi déjà en ligne : « Mon manager m'a félicité pour ma discrétion » (Machine à Café 1), « alternant2 » (Répartie 2), « la pause déjeuner est sacrée » (Confiance 1).
- **Vidéos** : les 11 de la spec sont actives. Deux affirmations de la spec ne sont **pas** dans les fiches de la base : Haroun, « le tu fais quoi dans la vie ? est dans la fiche » (la fiche parle d'impro et de rebonds avec le public) ; Rollman « Les enterrements de vie », « le pot de départ est cité dans la fiche » (la fiche parle des enterrements de vie et de rituel social, pas du pot de départ). Détails au §6. La vidéo « Bitcoin, JPEG et blockchain » n'est plus dans Machine à Café 3 (le correctif `tpIOLzv11qo` y est), `[À VÉRIFIER @fullstack en base]`.
- **Parcours** : aucun parcours `boulot` ni `pro` en base ; `storytelling` est actif. Le fichier Storytelling porte `"pro"` dans son `nextParcoursRanking` : à renommer `"boulot"` à l'import.
- **Titre de page** : `/parcours/machine-a-cafe` a déjà pour title « Parcours Machine à Café : être drôle au bureau en 3 semaines ». Le title du Boulot ne doit pas lui voler cette requête (§4).

---

## 1. Les 5 conseils (choix 1)

Règle d'or du fondateur (P0, s18) : un contenu sous la barre ne revient jamais en ligne. Les quatre conseils inactifs sont donc **réécrits à neuf par un autre rédacteur** (fichier attendu : `docs/copy/conseils-boulot-s19-v1.md`) puis jugés à l'aveugle par deux relecteurs contre les étalons de l'audit s14. Le conseil de l'étape 6 est écrit de zéro. Ton rôle : valider le texte une fois qu'il est passé. Titre, catégorie et difficulté de chaque conseil restent à fixer avec le texte ; les textes passent par la base ET par `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte).

**[EN COURS : relecture à l'aveugle, texte inséré quand il passe]**

| Étape | Conseil prévu et état en base | Ce que le conseil doit enseigner (rien d'autre) |
|---|---|---|
| 1 | « Survivre aux réunions avec humour » : inactif. Texte à réécrire. | Repérer les formules toutes faites et les rituels d'une réunion, viser le système et jamais une personne, garder une phrase pour plus tard sans la dire. Exercice d'observation seule, zéro risque, avec repli (visio, réunion passée). |
| 2 | « Le PS qui détend un mail sérieux » : **actif, au niveau, inchangé.** Trois règles de forme (une ligne après la signature, un sujet sans rapport, un sérieux total), règle d'or de la capture d'écran. | Glisser un trait dans un mail ou un message qui reste présentable à tout le service. Une retouche d'une phrase est proposée au signalement 3. |
| 3 | « La vanne de couloir : l'art du timing entre deux réunions » : inactif. Texte à réécrire. | Transformer un irritant partagé (clim, imprimante, café) en une phrase courte, relatable et inoffensive, dite une seule fois, en quinze secondes entre deux portes. Jamais une personne. |
| 4 | « L'afterwork : passer de collègue à personne drôle » : inactif. Texte à réécrire. | Raconter en trente secondes un moment absurde de la semaine de travail : situation, escalade, chute. Cadrer sur le boulot, sans refaire la coupe de Storytelling 1 ni le grain de Machine à Café 3. |
| 5 | « Survivre (et briller) au networking pro avec humour » : inactif. Texte à réécrire. | Remplacer le pitch récité par une description honnête et drôle de son métier en deux phrases, sans mépriser son métier ni son employeur. Repli : la dire trois fois à voix haute. |
| 6 | **N'existe pas.** À écrire (aucun conseil actif ne couvre ce besoin, vérifié sur les 3 actifs). | Soixante secondes pour un mot de départ, une présentation d'équipe ou un toast : une seule touche d'humour, placée après un moment sincère, jamais en ouverture, sur la situation et jamais sur une personne. Exemple avec structure et durée, exercice avec repli écrit ou vocal. Catégorie suggérée STORYTELLING, difficulté INTERMEDIAIRE (spec s17). |

**Reco : valider.** Rien à lire aujourd'hui. Quand les cinq textes sont passés, ils s'insèrent ici à l'identique (source copiée mot pour mot) et tu valides le texte. Si l'un ne passe pas à l'aveugle, il ne revient pas : on le réécrit, on ne le remplace pas par un conseil sous la barre.
L'étape 1 du §3 s'appuie sur l'objectif de l'étape, pas sur un texte de conseil : son exercice est à **aligner mot pour mot sur le DÉFI du conseil 1** dès qu'il est validé (règle RC1 : un seul enseignement par étape) `[À ALIGNER]`.

---

## 2. Fiche du parcours (choix 2)

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose : 6 semaines, six situations du travail, on commence par observer et on finit par parler, la vanne vise la situation et jamais une personne. Rien n'annonce de score, de certificat ni de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ». Champs inchangés de la spec : `slug` `boulot`, `duration` « 6 semaines », `timePerWeek` « 15 min/semaine », `difficulty` DEBUTANT, `difficultyLabel` « DEBUTANT → INTERMEDIAIRE », `order` 5, `icon` à @design, `persona` « Sophie (26 ans, jeune active en CDI) » (champ de la même forme que celui de Storytelling).

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Au bureau, tu as des vannes en tête et tu les gardes pour toi, de peur de te griller. En 6 semaines, tu apprends à en placer une dans six situations du travail : la réunion, le mail ou le message, le couloir, l'afterwork, le « tu fais quoi dans la vie ? » et la prise de parole officielle. Tu commences par observer, tu finis par parler, et ta vanne vise toujours la situation, jamais une personne. | Il y a toujours une vanne qui t'est venue en réunion et qui y est restée. En 6 semaines, tu apprends à la sortir sans te griller : d'abord en spectateur, puis dans un mail, dans un couloir, à l'afterwork, quand on te demande « tu fais quoi dans la vie ? », et enfin quand la parole est officielle, pour un mot de départ ou un toast. Toujours sur la situation, jamais sur quelqu'un. |
| `personaTagline` | Pour toi si tu es drôle avec tes amis, mais que tu te retiens au bureau, de peur de tomber à plat ou d'en faire trop | Pour toi si ta meilleure vanne de la semaine est née en réunion et n'en est jamais sortie |
| `testimonial` | Imagine Anouk. En réunion, elle avait toujours une phrase en tête qu'elle gardait pour elle, de peur de tomber à plat devant tout le service. Six semaines plus tard, elle glisse un PS dans un mail, un mot dans le couloir, et c'est à elle qu'on demande de dire quelques mots au pot de départ de vendredi. | Imagine Anouk. Il y a six semaines, elle avait en réunion une phrase qu'elle n'osait jamais dire. Hier, devant l'imprimante qui mettait quatre minutes à sortir une page, elle a lâché : « Elle prépare son discours de pot de départ. » Deux collègues ont ri. L'imprimante n'a pas relevé. |

**Reco : B.** Elle montre le problème avant de le nommer (la vanne restée en réunion, charte §5 : l'humour présent dans la copy elle-même), l'accroche tient en une image que le persona reconnaît tout de suite, et chacun des trois champs apporte une idée différente : la vanne gardée (description), la réunion qui ne la laisse pas sortir (accroche), le résultat visible (témoignage). Le témoignage B porte aussi le garde-fou du parcours dans sa chute : la vanne vise l'imprimante, personne d'autre. A reste le plan B si tu trouves « elle y est restée » trop familier pour une page de vente.
Vérifié contre le parcours : chaque élément cité existe dans une étape (spectateur = 1, mail = 2, couloir = 3, afterwork = 4, « tu fais quoi dans la vie ? » = 5, mot de départ ou toast = 6). Le témoignage A cite un PS (2), un mot dans le couloir (3) et un pot de départ (6) ; le B cite le couloir et le pot de départ avec une seule vanne.
Le prénom « Anouk » n'est ni un prénom de persona, ni un prénom d'humoriste des vidéos du parcours (A comme B), ni celui d'un exemple déjà utilisé ailleurs (Samir, Maëlle, Léa). Il revient dans l'étape 1 (§3).

---

## 3. Étape 1 complète : « Ta prochaine réunion, en spectateur »

<!--S3-->

---

## 4. Titre de la page et slug (choix 3)

<!--S4-->

---

## 5. Méthode de choix des vannes (choix 4)

<!--S5-->

---

## 6. Vidéos des 6 étapes (choix 5)

<!--S6-->

---

## 7. Le garde-fou « jamais viser une personne » (choix 6)

<!--S7-->

---

## Signalements (information, rien à trancher)

<!--SIG-->

---

## Handoff

<!--HAND-->
