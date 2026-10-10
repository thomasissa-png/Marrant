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

<!--S1-->

---

## 2. Fiche du parcours (choix 2)

<!--S2-->

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
