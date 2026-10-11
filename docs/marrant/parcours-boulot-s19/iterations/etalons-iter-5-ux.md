# Itération 5, relecture UX des étalons du Parcours Boulot (angle : la lectrice avant de payer, puis Thomas qui décide)

Fichier noté : `docs/copy/etalons-parcours-boulot-s19.md` (non modifié, numéros de lignes = ce fichier, 385 lignes).
Lu : ce fichier en entier, ma notation d'itération 4, l'historique des corrections, le modèle `etalons-parcours-storytelling-s18.md` (en-tête), la spec s17 (§1 et §3), `founder-preferences.md` (07/10 et 08/10).
Code relu pour vérifier ce qui s'affiche : `components/parcours/` (detail, step-card, step-blocks, step-quiz, content), `config/textes/parcours.ts`, `lib/parcours-orientation.ts`, `lib/parcours-catalogue.ts`.
Hors note, comme demandé : le PS de l'étape 2 (emplacement `[EN COURS…]`, les neuf passages qui en dépendent, la ligne 2 du §7) et le texte des 5 autres conseils.
Recomptés un à un et exacts : `moduleDetail` 99 mots, `why` 39 mots, description B 74 mots (18 + 38 + 18), phrase `[SI 6B]` 38 mots, titre de page 60 caractères, longueurs des 12 réponses du quiz, positions B, D, A, nombres de phrases des trois explications, vannes 12 + 18 = 30 (3, 2, 3, 3, 2, 5 ; 8 fortes, 4 acceptables), 10 vidéos dont 4 nouvelles et 6 de la spec, 5 vidéos au-dessus de 5 min.

## Note

| Critère de la grille | Note | Pourquoi, en une ligne |
|---|---|---|
| Vitrine (étape 1) | 10 | Sans parole, sans envoi, repli visio écrit, scène en un bloc de 99 mots, `why` ramené à la seule raison, durée décrite exactement comme la page l'affiche, l'étape 2 donne envie par son titre. Le saut de ligne du test dépend d'un correctif de code incomplet (correction 1) : il touche l'aperçu et la liste, pas la page de l'étape 1. |
| Peur « me griller » | 10 | Étape 1 sans collègue, test de l'équipe entière, un repli par étape, promesse « sans te griller » reprise par la fiche, le titre de page et le titre de l'étape 6. |
| Progression d'exposition lisible | 9 | Le tableau du §7 est clair et chaque étape a son repli. Reste : le titre de l'étape 6 se lit « message de la personne qui part » (correction 3) et l'étape 5 est la seule sans limite annoncée. |
| Fiche et titre | 10 | Trois champs, trois idées, 74 mots, un seul témoignage ferme, titre A de 60 caractères sans « drôle / bureau / humour », méta cadrée. Reste un champ non écrit (`title`, correction 8). |
| Quiz | 10 | B, D, A ; aucun mot repris ; explication affichée quelle que soit la réponse (`step-quiz.tsx`) ; Q3 traite le cas de la visio. Rien à corriger. |
| Vidéos | 9 | Règle de sortie, durées de la base marquées à lire, 5 étapes changées nommées. Reste : le choix 8 se contredit (correction 2) et le contenu n'a jamais été vu (limite connue, couverte par la règle de sortie). |
| Décision pour Thomas | 9 | « Je suis tes recos » : 1 oui, 2 B, 3 A, 4 A, 5 B, 6 B, 7 oui, 8 a, 9 oui. Les 9 numéros du tableau, de la réponse type, de la liste « ce que valide chaque numéro » et du handoff sont identiques, et l'étape 1 est enfin dans la réponse. Reste : environ 1 000 mots avant le tableau des choix (correction 5) et le numéro 8 (correction 2). |
| Traces caduques | 9 | L'historique est sorti du fichier. Restent : Fary (retenue nulle part), quatre formulations « avant / ne plus », trois lignes vides finales (correction 6). |

**Note globale : 9,5/10** (moyenne 9,5). Aucun défaut ne gêne la validation de Thomas ni la promesse faite à la lectrice.
**0 correction bloquante, 9 non bloquantes.** Les 9 appliquées : 10.

## Ce qui est réglé depuis l'itération 4 (vérifié, à ne pas défaire)

1. Numéro 9 (étape 1 telle qu'écrite) dans le tableau (l.24), la réponse type (l.29), la liste (l.38), le paragraphe sous le tableau (l.26) et le handoff (l.373) : « choix 1 à 9 » partout, « 9 sauf [le mot] » possible. Réglé.
2. Numéro 5 : les 5 étapes changées et ce qui reste de la spec sont nommés, 10 vidéos au total (l.34). Réglé.
3. Titre de l'étape 6 : la proposition est dans le tableau du §7 (l.323), celui de la spec est écarté avec sa raison (l.326). Réglé sur le fond, voir correction 3 pour un mot.
4. Test sur sa propre ligne : `[SI 6B]` avec saut de paragraphe (l.155, l.160, l.327, l.340) et demande à @fullstack (l.374 e). Réglé, voir correction 1 pour la troisième surface d'affichage.
5. `why` : 39 mots, plus de consigne ni d'écho du conseil (l.154). Réglé.
6. Description B : 74 mots, méta cadrée avec « 6 semaines à 15 min/semaine » et « Première étape gratuite. » (l.121, l.126, l.358). Réglé.
7. Entrées : la phrase sur le quiz d'orientation et l'onboarding est écrite, Thomas peut changer d'avis en une ligne, `[À VÉRIFIER @product-manager]` au handoff (l.128, l.374 h). Vérifié dans le code : `ParcoursSlug` sans `boulot`, « Au boulot » mène à Machine à Café. Réglé.
8. Durées lues : règle de sortie étendue, `[DURÉE DE LA BASE, À LIRE]` sur Croce, Hamzawi, Delmoitiez (l.7, l.289). Réglé.
9. Entrée `boulot` dans `PARCOURS_META` derrière un interrupteur de publication (l.374 3), checklist d'insertion du PS (l.371), précisions d'import (f) (g). Réglé.

## Parcours de la lectrice (cognitive walkthrough, 26 ans, CDI, peur de se griller)

| Étape | Sait-elle quoi faire ? Voit-elle l'action ? Le but est-il lié à l'action ? Feedback ? |
|---|---|
| Carte sur /parcours | Oui : badge, « 6 semaines · 15 min/semaine · XP », accroche B (le samedi avec les amis, le lundi à 9 h), 74 mots, témoignage de 43 mots. La carte n'est plus la plus haute de la liste. |
| Page /parcours/boulot | Oui : H1, description, « Pour qui ? », « Étape 1 offerte, étapes 2 à 6 avec Premium », étape 1 ouverte avec le repère « Parcours Boulot · 6 semaines » (vérifié : `etapeContexteTexte(path.title, path.duration)`, d'où correction 8). |
| Étape 1 | Oui : « sans un mot », scène d'Anouk puis « rien à dire », conseil, défi avec repli visio, retour « Alors, ce défi ? ». L'assurance « tu ne dis rien » revient trois fois (scène, conseil, défi), c'est le bon endroit pour insister sur cette peur et deux de ces trois textes sont validés. |
| Quiz | Oui : explication même sans faute, « Refaire le quiz », Q3 écrit pour son cas. |
| Envie de l'étape 2 | Oui : « sans finir en capture d'écran » parle à la peur. Aperçu = scène + demi-phrase du repli + test, jamais l'exercice (vérifié : `LockedStepPreview`). |
| Arrivée par le quiz « Quel parcours est fait pour toi ? » | Information donnée à Thomas, rien à décider. |

`[FRICTION H4]` : le texte du verrou « le conseil, les vannes, les vidéos et le quiz… » est une constante (`APERCU_BAS`) ; elle serait fausse pour une étape 6 sans vidéo. Déjà au handoff (l.374 a). Rien à ajouter.
Pas d'autre friction : premier résultat concret (trois traces notées) en 2 pas (fiche, étape 1), sous la limite de 3.

## Audit Nielsen (flow : visiteuse, carte, étape 1, quiz, réponse de Thomas)

H1 visibilité de l'état PASS · H2 vocabulaire du persona PASS · H3 contrôle PASS (repli solo, « Refaire le quiz », « B sauf étape X ») · H4 cohérence PASS (le choix 8 se contredit pour Thomas, correction 2) · H5 prévention d'erreurs PASS · H6 reconnaissance PASS · H7 raccourcis PASS (« Je suis tes recos ») · H8 minimalisme PASS sous réserve de la correction 5 · H9 messages « Pas tout à fait » + explication PASS · H10 aide dans le flux PASS (repli écrit dans chaque défi).
Mesure (déjà en place, rien à ajouter) : `parcours-ouvert`, `etape-ouverte`, `quiz-etape-termine`, `mur-vu` (`parcours-validation`), `etape-retour`. Signal Adoption de l'étape 1 : visiteurs qui finissent le quiz sur ceux qui ouvrent l'étape (cible par défaut 60 %, `[HYPOTHÈSE : à caler sur la première semaine de données]`).

## Correction bloquante

Aucune.

## Corrections non bloquantes

**1. Retours à la ligne du texte d'étape : trois endroits d'affichage, le handoff n'en nomme que deux.**
Emplacement : l.374 (7)(e) ; l.160 et l.327 (demande à @fullstack).
Problème : le `moduleDetail` s'affiche dans trois `<p>` sans `whitespace-pre-line` : `parcours-step-card.tsx` l.285 (étape ouverte), `step-blocks.tsx` l.39 (aperçu des étapes 2 à 6, `LockedStepPreview`), et `parcours-content.tsx` l.335-337 (`m.detail`, bloc « Programme » de la liste /parcours, replié par défaut). Avec la reco 6B, le test se colle à la scène dans le troisième, qui est aussi une vitrine.
Correction : écrire « aux trois `<p>` » et les nommer, plus `[À VÉRIFIER @fullstack : `parcours-jsonld.ts` et `llms-parcours.ts` ne reprennent pas le saut de ligne tel quel]`. Aucun texte à changer.

**2. Choix 8 : « a » dit une chose et son explication le contraire.**
Emplacement : l.23 (options), l.37 (numéro 8), l.288 (`[À MINUTER]`), l.299, l.308.
Problème : l'option a est « pas de plafond, aucune vidéo découpée » (l.23), mais le numéro 8 ajoute « avec 5A, les deux extraits de la spec (Haroun, Rollman « enterrements ») restent à minuter » (l.37) et le §6 répète que ces deux-là sont « déjà à minuter » (l.308). Thomas qui répond « 5 B sauf étape 6, 8 a » ne sait pas si Rollman (6 min 40) passe entière ou en extrait.
Correction : trancher dans le sens de l'option a telle que Thomas la lit. Numéro 8 : « a : aucune vidéo découpée, pas même Haroun ou Rollman « enterrements » si elles reprennent leur place (refus en 5B, ou 5A) : elles passent entières. Seul le 8b impose des extraits. » Retirer `[À MINUTER]` des cellules A et B du §6 sauf mention « seulement si 8b ». Si l'intention est de garder le plafond de la spec pour l'obligatoire, réécrire l'option a en conséquence, mais alors Delmoitiez (6 min, première vidéo de l'étape 5) doit être découpée : à écarter, c'est le contraire de la reco.

**3. Titres : un mot ambigu à l'étape 6, une étape sans limite annoncée.**
Emplacement : l.323 (titre de l'étape 6), l.121 (description B, « un mot de départ ou un toast »), l.322 (titre de l'étape 5), l.126.
Problème : « un mot de départ » se lit « le mot que laisse la personne qui part », alors que l'étape apprend à porter un toast pour un collègue qui part (le conseil s'appelle « Le toast de soixante secondes qui tient debout »). Visible de tous dans la liste et le programme, et c'est le titre qui clôt la promesse « sans te griller ». Les étapes 1, 3 et 6 annoncent une limite rassurante (« sans un mot », « quinze secondes », « soixante secondes ») ; la 5 est une simple question.
Correction : étape 6 `[PROPOSITION, à finaliser par @copywriter]` : « Un toast de soixante secondes, une seule vanne ». Description B : « et tu finis par un toast au pot d'un collègue » (75 mots, recompter). Étape 5 `[PROPOSITION]` : « « Tu fais quoi dans la vie ? » en deux phrases ». Aucun numéro de plus pour Thomas : les titres restent provisoires.

**4. Phrase `[SI 6B]` de l'étape 1 : sortir « à retenir », qui sonne cours.**
Emplacement : l.155, l.160, l.162.
Problème : « Le test à retenir pour toute la suite » est le seul tour scolaire du texte d'étape (marque : pas scolaire). Le texte dit en outre « avec les mêmes mots » (l.343) alors que la phrase des étapes 2 à 6 commence par « Avant de la sortir, un seul test ».
Correction : « Un seul test pour toute la suite : ta phrase passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? Ici, ta phrase ne parle que d'un objet : elle passe ce test d'avance. » (37 mots, recompter ; la phrase 6B change, pas le reste). Texte du site, pas de nouveau tour à l'aveugle.

**5. Environ 1 000 mots de précisions techniques avant le tableau des choix.**
Emplacement : l.3-10 (en-tête), tableau des choix à l.12.
Problème : Thomas lit d'abord huit paragraphes dont quatre sont de l'information sans décision : vidéos non visionnées (l.7), deux fiches de la base à corriger (l.8, déjà au signalement 11), règle de sortie (l.9), vocabulaire de l'écran (l.10). Le modèle s18 arrive à son tableau en 7 lignes. La demande de Thomas du 07/10 est « sans jargon, problème, effet, ce qu'on fait ».
Correction : garder en en-tête les lignes 3 à 6 (statut, décisions acquises, règles tenues, la base fait foi) et une phrase de vocabulaire : « À l'écran, toutes les vidéos sont « facultatives » ; « obligatoire » veut dire ici « placée en premier ». » Déplacer l.7, l.8 et l.9 au début du §6 (où l.287-290 les répètent déjà en partie) et supprimer les doublons : les faits de la base sont dits en six endroits (l.7, l.8, l.289, l.290, l.305, l.361).

**6. Traces caduques.**
Emplacement et correction :
- Fary : retenue nulle part, mais citée en l.7, l.214 (paragraphe entier), l.303 et l.361 (d). Ne garder que « Fary n'est pas retenue : durée non lue » au signalement 11 ; supprimer les trois autres.
- l.126 « contre 96 avant » et « Les situations du milieu n'y sont plus listées » : écrire l'état (« 74 mots, les situations du milieu sont dans le programme juste dessous »).
- l.162 « il ne répète plus la consigne ni le conseil » : écrire « il ne répète ni la consigne ni le conseil ».
- l.375 (Décisions prises) : « raccourcie », « réduit », « réécrit », « sortie », « écartée » racontent des versions que Thomas n'a pas vues. Écrire l'état seul (« description B de 74 mots », « témoignage B sans vanne citée », etc.).
- l.382-385 : trois lignes vides finales à retirer.

**7. Handoff : une décision sans propriétaire.**
Emplacement : l.374 (7)(b).
Problème : « décider si on l'ajoute ou si on corrige la phrase » ne dit pas qui décide. Vérifié : `LockedStepPreview` montre `moduleDetail`, format et bouton, aucune durée.
Correction : « `[DÉCISION @product-manager, défaut si silence : corriger la phrase de la spec (RC8) ; la durée est déjà dans la liste /parcours et dans l'étape 1]` ».

**8. Champ `title` du parcours jamais écrit.**
Emplacement : l.117 (champs du seed).
Problème : la liste donne `slug`, `duration`, `timePerWeek`, `difficulty`, `order`, `icon`, `persona`, mais pas `title`. Or `path.title` est le H1, le fil d'Ariane et le repère « Parcours Boulot · 6 semaines » au-dessus de l'étape 1 (vérifié dans `parcours-detail.tsx`) ; le titre du choix 3 n'est que la balise `<title>`.
Correction : ajouter « `title` « Parcours Boulot » (H1, fil d'Ariane, repère de l'étape 1 ; le titre du choix 3 est la balise title, pas le H1) ».

**9. Vannes : un critère écrit, une vanne qui le frôle.**
Emplacement : l.253 (critère « la vanne ne doit pas avoir une personne pour cible, ou pour chute »), l.270 (« Mon tuteur a lu mon rapport de stage. Il m'a dit « les remerciements sont très bien ». », Répartie 1, classée acceptable).
Problème : « briefé » et « le chef au pot de départ » sont écartées parce que la chute revient à une personne. Ici la chute est une phrase du tuteur. Le document ne dit pas pourquoi elle passe (la cible est l'auteur du rapport, le tuteur reste aimable). Thomas valide cette méthode au numéro 4.
Correction : ajouter à l.270 une demi-phrase de justification, ou la remplacer par une des 18 vannes neuves de l'étape 5 (3 vannes en ligne au lieu de 2, 3 neuves). Jugement de contenu : à trancher par @reviewer, sans effet sur la note UX si la justification est écrite.

## Points solides à ne pas défaire

Étape 1 sans parole, sans envoi, sans collègue, avec repli visio ; tableau de différence avec Machine à Café 2 et Confiance 1 ; tableau d'exposition §7 avec un repli par étape ; test unique en dernière phrase des étapes 2 à 6 ; réponse type numérotée de 1 à 9 ; colonne « Ce que ça change pour la lectrice » ; vocabulaire de l'écran ; témoignage B sans vanne ; accroche B distincte de Machine à Café ; titre A de 60 caractères ; description B de 74 mots ; `why` de 39 mots ; « tes notes » à la place de « carnet » ; quiz B, D, A ; règle de sortie des vidéos non visionnées ; `PARCOURS_META` et interrupteur au handoff ; refus des vannes qui visent une personne.

## Pour l'itération 6

À re-vérifier : (1) « trois `<p>` » au handoff ; (2) numéro 8 et cellules `[À MINUTER]` ; (3) titres des étapes 5 et 6 et description B recomptée ; (4) phrase 6B recomptée ; (5) en-tête allégé, faits vidéo dits une fois ; (6) traces ; (7) propriétaire de la décision RC8 ; (8) `title` ; (9) vanne du tuteur ; (10) PS inséré et neuf passages alignés (hors note jusque-là). Avec les 9 : 10. Limite connue qui ne bloque pas le 10 : aucune vidéo n'a été visionnée, la règle de sortie la couvre.
