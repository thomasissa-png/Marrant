# Tour 4, relecteur @ux (à l'aveugle) : `architecture-contenu-v4.md`

> Relu en entier (sections 0 à 9, annexe A.1). Faits donnés par la session et pris comme vrais : profils du quiz vers parcours (`quiz-data.ts` l. 41-100) : OBSERVATEUR vers confiance, STORYTELLER vers storytelling (sinon machine-a-cafe), ABSURDE vers machine-a-cafe, PUNCHLINEUR vers repartie, TAQUIN vers repartie ; orientation 3114 au playbook l. 595. Références : `founder-preferences.md` l. 161 à 165, mon tour 3.
> Limite : je n'ai pas relu moi-même `quiz-data.ts`, le playbook, ni les pièces du carnet ; l. 85, 135 et 136 de `founder-preferences.md` non relues.

## 1. Notes

| Critère | T1 | T2 | T3 | T4 | Justification courte |
|---|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 7 | 8 | 8 | 8 | La boucle de « Mes questions » est enfin complète (saisie, historique, e-mail de réponse, signal dans « Aujourd'hui ») ; la courbe « avais-tu une réponse ? » donne un vrai progrès ; mais les cas d'essai de 4.3 sont faux au regard du code du quiz |
| C2 Décisions de Thomas | 6 | 7 | 7 | 8 | Barre à 6 entrées réelles, règle du 12/11 posée comme question ; reste C10 qui contredit « pas de nouveaux avis » (25/10) sans le marquer, et le temps hebdomadaire non posé |
| C3 Zéro donnée inventée | 6 | 7 | 8 | 8 | Totaux justes (153, 185, 283, 54, 190 à 760 candidates : je les retrouve) ; la table profil vers parcours reste « [À VÉRIFIER] » alors que le fait est établi |
| C4 Rubriques claires, 6 entrées au plus | 6 | 6 | 6 | 8 | Les trois variantes comptent 6, « Aujourd'hui » est toujours un onglet, « Bibliothèque » est le mot de Thomas (12/11) avec deux blocs nommés ; la reco prétend « tout à un clic » alors que jeux et exercices sont à 2 clics |
| C5 Ambition | 8 | 7 | 8 | 9 | V1 complète, moteur à progression réelle, régime mensuel, historique de questions : très poussé |
| C6 Cohérence entre documents et code | 5 | 6 | 7 | 7 | Calendrier et arithmétique propres ; mais 4.3 contredit le code du quiz (Sophie, Marc), 2.6 se contredit sur le délai du « problème », 7.3 bis suppose la méthode « 2 critiques + départage » alors que la reco C8 est 10/10 |
| C7 Faisabilité | 6 | 6 | 7 | 8 | 7.3 bis chiffre le mois (carnet, situations, écoutes, questions) avec lecture de Thomas et délai ; seule la base de relecture est mal alignée sur C8 |
| C8 Questions à Thomas | 6 | 7 | 7 | 8 | Langage simple, options marquées (C8 très bien), reco ferme ; mais C10 A et B ne marquent pas la réouverture du 25/10 et empilent trois décisions, et le temps hebdomadaire n'est dans aucune question |
| C9 Exemples au ton maison | 6 | 6 | 7 | 8 | Poêle (3 registres distincts), rattrapage, jeu du frigo, faux secret avec contre-exemple, Formules et Vocabulaire écrits, bilan écrit ; un détournement (le bus) est un lieu commun |
| C10 Progression pédagogique | 5 | 7 | 8 | 8 | Calendrier avec temps par semaine, marche suivante selon le retour (jamais selon la date), progression de la rafale par réussite ; mais l'entrée par signal repose sur une table fausse |

**Note globale : 8,0 / 10** (80 sur 100 ; T1 6,1 ; T2 6,7 ; T3 7,3). Pas encore 10/10 : 5 corrections bloquantes.

## 2. Statut de mes 13 corrections du tour 3

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| M1 | Barre à 7 entrées, reco conditionnelle | OK | 6.2 : A, B, C comptent chacune 6 (Aujourd'hui, Parcours, Quoi répondre, X, Mes questions, Plus) ; reco B ferme ; « Bibliothèque » reprend le mot de Thomas. Reste une phrase inexacte dans la reco (P5) |
| M2 | Boucle de réponse | OK | 2.6 « Un seul circuit » : saisie dans l'outil, enregistrement, e-mail de réponse, « L'équipe t'a répondu » dans Aujourd'hui, recopie de toute réponse faite hors outil, recopie des réponses à l'e-mail J12. Deux précisions en P3 |
| M3 | Types et états limites | PARTIEL | Trois types définis, tableau des états très bien ; mais « l'équipe répond en priorité » (problème) contredit « les trois types ont le même délai », et aucun suivi (réponse à une réponse) n'est prévu (P3) |
| M4 | Sélecteur de scène d'entrée | PARTIEL, mal traité sur le fond | 4.2 pose le bon principe (signaux = quiz et `returnTo`, 5 entrées = 5 situations pour commencer, défaut nommé). Mais la table dit « le parcours désigné par le quiz » sans le nommer, alors que le fait est vérifié ; 4.3 range Sophie sous Observateur avec Machine à Café et Marc sous Storyteller avec Confiance : le code dit Observateur vers Confiance, Storyteller vers Storytelling (P1) |
| M5 | Régime mensuel | OK | 7.3 bis : 190 à 760 candidates, 9 passes de relecture, 12 fiches lues par Thomas, délai, règle du carnet en retard. Seule la base de relecture est à aligner (P6) |
| M6 | Exemples manquants ou faibles | OK avec réserve | Formules, Vocabulaire, Bilan écrits ; photocopieuse remplacée par le frigo (meilleur) ; contre-exemple bien libellé ; marche 2 portée par la poêle. Réserve : détournement du bus (P7) |
| M7 | Base juridique, textes à retoucher | PARTIEL | Décisions du 07/10 et du 25/10 citées, textes à retoucher listés, « pas de nouveaux avis » sourcé ; mais C10 propose un avis d'une page sans marquer qu'il va contre la consigne du 25/10 (P4) |
| M8 | Détails de navigation (a à d) | OK | Ouverture de Mes questions alignée sur 7.4, ligne « S'entraîner » dans Plus, contenu du jour et situation du jour distincts, repère « 12 cartes » jamais à zéro |
| M9 | Temps hebdomadaire | PARTIEL | La ligne « temps maximum » existe (40, 64, 79, 66 min : justes) et 5.2 dit 15 puis 17 minutes ; mais ces 79 minutes ne sont posées à Thomas dans aucune question (P2) |
| M10 | Jargon des questions | OK | « de quoi retenir les choix », « limite de tours », références juridiques en note |
| M11 | Chrono | OK | Désactivé la première fois, « Voir les répliques » toujours disponible, le minuteur ne raccourcit que sur proposition |
| M12 | Guides à remonter | OK | Note à Thomas en tête de la section 8 |
| M13 | INV deux lignes | PARTIEL, hors de la main de la v4 | T3 corrigé par la session ; la ligne « Carnet » du tableau 1.1 d'INV reste à finir par @product-manager |

## 3. Nouvelles corrections

### Bloquantes

**P1. [BLOQUANT] La table « signal vers parcours » et les cas d'essai contredisent le code du quiz (C6, C1, C10).**
Passages : 4.2 (colonne « Parcours conseillé de la semaine 2 » : « le parcours désigné par le quiz » / « idem » ; « [À VÉRIFIER : sauf Storyteller vers Storytelling, 07/10] ») ; 4.3 (Sophie : « Observateur », « Machine à Café », « Cas nominal » ; Marc : « Storyteller », « Confiance »).
Problème : le fait est maintenant établi : OBSERVATEUR mène à Confiance, STORYTELLER à Storytelling (Machine à Café si Storytelling n'est pas publié), ABSURDE à Machine à Café, PUNCHLINEUR et TAQUIN à Répartie. Donc (a) Sophie, rangée sous Observateur, recevrait Confiance et non Machine à Café ; Marc, rangé sous Storyteller, recevrait Storytelling et non Confiance : la remarque « cas nominal » est fausse ; aucun profil ne mène à Machine à Café comme parcours de Sophie (seul Absurde le fait). (b) Les trois lignes « le parcours désigné par le quiz » masquent une information qui décide du calendrier : un Observateur commence par un parcours INTERMEDIAIRE de 6 étapes à 20 min, pas par un DEBUTANT de 3 étapes à 15 min ; or 4.1 ne calcule le temps que sur « étape 15 à 24 min » et le bilan que pour Machine à Café. (c) Rien ne dit comment le résultat du quiz (public, sans inscription) arrive dans le compte au moment du premier pas : si le résultat n'est pas relié au compte, la grande majorité des abonnés tombe dans « Aucun signal ».
Correction : (1) écrire dans 4.2 les cinq parcours par profil, avec la règle Storyteller et son repli ; (2) réécrire 4.3 par profil, pas par persona (ou supprimer les appariements persona/profil et garder « cas d'essai : profil Taquin = Yanis, profil Absurde = Sophie, à tester ») ; (3) recalculer en 4.1 le temps de la semaine 2 à 4 selon le parcours (15 ou 20 minutes) et préciser qu'il n'y a de bilan en semaine 4 que pour Machine à Café ; (4) vérifier et écrire comment le résultat du quiz est conservé (compte, cookie, adresse de retour `?src=quiz`) et estimer la part d'abonnés qui arrivent avec un signal [À VÉRIFIER avec @data-analyst] ; (5) dire si un Observateur doit recevoir Confiance dès la semaine 2 ou Machine à Café par défaut, et le poser à Thomas (C7 est le bon lieu).

**P2. [BLOQUANT] Le temps hebdomadaire réel n'est posé à Thomas dans aucune question (C2, C8, C10).**
Passages : 4.1 ligne « Temps maximum de la semaine » (« jusqu'à 79 min » en semaine 3) ; 4.1 « Tout est facultatif sauf le cœur de l'étape (15 à 20 minutes annoncées : voir C2) » ; C2 (parle de l'étape seule, « 22 à 25 minutes pour 15 à 20 ») ; C2 A reco « On garde la promesse » ; 4.4 état 2 : la rafale est l'action principale de l'écran.
Problème : l'information est dans le calendrier mais pas dans la décision. Thomas répond à C2 en croyant décider du temps d'une étape, alors qu'un abonné qui suit le calendrier passe de 40 à 79 minutes par semaine contre « 15 à 20 min/semaine » (décision du 29/09, reprise le 07/10). La reco « on garde la promesse » est trompeuse : la promesse porte sur les parcours, l'espace y ajoute de la pratique que l'écran d'accueil met en action principale tous les jours, donc ressentie comme attendue, pas comme facultative.
Correction : réécrire C2 en deux étages : (a) la promesse « 15 à 20 min/semaine » vaut pour le cœur des parcours (étape) ; (b) la pratique quotidienne et les séances sont en plus, facultatives, avec leur durée affichée ; ajouter la phrase chiffrée « en semaine 3, jusqu'à environ 80 minutes si tu fais tout » ; ajouter une option « le texte de l'offre dit la promesse des parcours et mentionne la pratique quotidienne comme un plus » (touche des textes validés : à marquer) ; et dire que l'action principale d'« Aujourd'hui » n'est pas présentée comme une obligation (libellé).

**P3. [BLOQUANT] « Mes questions » : une contradiction de délai et un trou de suivi (C6, C1).**
Passages : 2.6 « Un problème : … L'équipe répond en priorité » et « Sous le champ : “Évite les noms…” Les trois types ont le même délai » ; « Un seul circuit de réponse » ; « Reply-To du compte ».
Problème : (a) « en priorité » et « même délai » ne tiennent pas ensemble ; l'abonné ne sait pas quel délai attendre pour un problème de paiement. (b) Aucun suivi : si la réponse appelle une précision (« en fait ma situation, c'est… »), l'abonné doit créer un nouvel envoi ; l'historique devient une pile de messages isolés, et les réponses faites par e-mail aux e-mails (J12, réponse de l'équipe) sont recopiées sans lien avec l'envoi d'origine : on ne dit pas si l'échange est un fil. (c) « Reply-To du compte » est copié de l'envoi entrant : sur l'e-mail de réponse, le Reply-To doit être l'adresse de l'équipe pour que l'abonné puisse répondre.
Correction : un seul délai (« en général sous 1 à 2 jours ouvrés ») et, si Thomas veut une priorité aux problèmes de paiement ou d'accès, le dire comme règle interne sans promesse affichée ; décider que chaque envoi est un fil (l'abonné peut ajouter un message à un envoi répondu, l'équipe répond dans le même fil) ou que non, et l'écrire ; rectifier le Reply-To ; ajouter dans l'état « Répondu » la possibilité de continuer le fil.

**P4. [BLOQUANT] C10 : la reco rouvre une consigne du 25/10 sans le dire, et empile trois décisions (C8, C2).**
Passages : C10 option A (« un avis juridique d'une page sur ces trois points ») et option B (« avis d'une page ») contre option C (« sans nouvel avis juridique (comme tu l'as dit le 25/10) ») ; 2.6 « Avis juridique : le 25/10 Thomas a dit “pas de nouveaux avis” (l. 136) ».
Problème : la règle posée par la section 8 elle-même est qu'une option qui rouvre une décision est marquée. A et B vont contre « stop au juridique excessif, pas de nouveaux avis » (25/10) et ne sont pas marquées ; seul C le cite, comme si C était la voie fidèle alors que la reco est A. Chaque option mélange aussi trois sujets (durée, historique après résiliation, retrait d'un envoi) et un quatrième (avis), si bien que Thomas ne peut pas accepter la durée sans accepter l'avis. L'orientation 3114 vient d'être vérifiée au playbook mais reste [À VÉRIFIER] dans l'état « Message sensible ».
Correction : marquer A et B « va contre ta consigne du 25/10 (pas de nouveaux avis) » ou séparer l'avis en sa propre question à 2 options (« oui, une page ciblée » / « non, on garde ta consigne »), puis réduire C10 à la durée et au sort après résiliation ; citer le playbook (l. 595) à la place de [À VÉRIFIER] ; envisager une ligne discrète sous le champ pour les messages qui évoquent une détresse (soumise à Thomas : l'état « Message sensible » ne dit ce que voit l'abonné qu'après coup, après un délai de 1 à 2 jours).

**P5. [BLOQUANT] La reco de C1 affirme « tout ce que tu as nommé est à un clic » : c'est inexact pour les jeux (C4, C8).**
Passages : C1 option B « Reco : tout ce que tu as nommé est à un clic » ; 6.2 « Contenu de Plus : S'entraîner (jeux, séances, missions) » ; 6.3 « Jeux, séances, missions : Plus, ligne S'entraîner ».
Problème : Thomas a nommé « exercices et jeux » (capture, audit du 12/11). Dans les trois variantes, les 30 jeux, les 6 séances et les missions sont à deux clics (Plus, puis S'entraîner), ou via une carte d'« Aujourd'hui ». La phrase de la reco est donc fausse, et Thomas ne se voit proposer aucune variante où les jeux ont un onglet (la v2 en avait une).
Correction : corriger la phrase (« le catalogue, le vocabulaire, les questions et les parcours sont à un clic ; les jeux sont dans Plus et dans Aujourd'hui ») et dire en une ligne ce que coûterait de les promouvoir (par exemple remplacer « Plus » par « S'entraîner » et mettre Favoris, Lettre, Articles, Quiz dans le menu de compte).

### Non bloquantes (à traiter pour 10/10)

**P6. Base de relecture du régime mensuel (C7).** 7.3 bis compte « 3 x (2 critiques + départage) = 9 passes (méthode d'octobre) », c'est-à-dire la règle « 2 avis sur 3 », alors que la reco C8 est « 10/10 chez tous, sans limite de tours ». Dire que le chiffre est le plancher de la méthode d'octobre et qu'avec C8 A le nombre de passes n'est pas borné.

**P7. Exemples : un lieu commun et deux structures (C9).** 3.6, détournement 2 (« Sauf le bus, qui préfère ceux qui ont couru ») : le bus qui arrive dès qu'on court est un classique ; ne pas le garder comme candidat d'étalon (barre : jamais entendue ailleurs). Détournement 1 (« Le lundi a pris celle de jeudi, pour dépanner ») est correct mais faible pour un étalon : en proposer un plus tranché. 3.7 (Écouter, repérer) reste une structure par prudence (acceptable : rien d'inventé) ; mais l'étalon E4 doit être le premier à produire des phrases réelles, avant le lot 1.

**P8. Règles de révision et courbe (C10, C1).** (a) Révision à J+2, J+7, J+21, J+30 : dire ce qui arrive quand plus de 2 cartes sont dues (les cartes en trop glissent au lendemain, jamais d'arriéré affiché). (b) La courbe « avais-tu une réponse ? » de « Ton mois » peut descendre : définir quand elle s'affiche (à partir de N cartes), avec quel texte neutre si elle baisse (aucune phrase de reproche, pas de pente en rouge), pour rester dans « jamais culpabilisant ».

**P9. Détails de forme (C4, C8).** Section 8 : « C1 à C8, puis C10 » avec un C9 vide ; renuméroter C9 (Thomas lira « il manque une question »). Dans 6.2 « Plus », cinq éléments sous trois blocs : tester sur rendu que « S'entraîner » en première ligne se lit. L'état de la barre à l'ouverture est correct, mais dire si « Bibliothèque » s'ouvre avec le catalogue seul et ajoute son bloc « Vocabulaire et techniques » au seuil de 7.4 (c'est l'implication du texte).

## 4. Réponses directes aux points demandés

1. **Barre (6.2)** : oui, les trois variantes comptent réellement 6 entrées, et « Aujourd'hui » est présent dans toutes. La reco B (Bibliothèque en deux blocs nommés) est défendable et reprend le mot de Thomas. Une seule inexactitude dans la phrase de reco (P5).
2. **« Mes questions » (2.6)** : bien tenu. Il manque un seul délai, un suivi de fil, une règle claire pour le Reply-To (P3), et une question C10 mieux découpée (P4).
3. **Calendrier et entrées par signal (4.1, 4.2, 4.3)** : le principe est juste, mais la table est fausse au regard du code vérifié (Sophie et Marc) et ne dit pas comment le résultat du quiz arrive dans le compte (P1).
4. **Temps hebdomadaire** : bien calculé (40, 64, 79, 66 minutes), mais mal posé à Thomas. C2 ne parle que de l'étape ; la reco « on garde la promesse » masque les 79 minutes (P2).

## 5. Points acquis (à ne pas perdre au tour 5)

- 2.2 à 2.4 (rafale, « Tu avais une réponse ? », progression par réussite, marche suivante selon le retour, aucune relance), 2.3 (stock calculé et règle « un jour sur deux » si le carnet est en retard).
- 2.6 (circuit unique, états limites, charge à 500 abonnés et leviers).
- 6.1 et 6.2 (6 entrées comptées à l'écran), 7.3 bis (régime mensuel), 5.2 à 5.3 (totaux exacts).
- Exemples de la poêle, du rattrapage, du frigo, du faux secret avec contre-exemple, du bilan.
- C8 posée sans appui faux sur s19 et avec le risque dit en clair.
