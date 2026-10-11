# Itération 2, relecture UX des étapes 2 à 6 du Parcours Boulot

Fichier noté : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (450 lignes, numéros de lignes = ce fichier). Ma note précédente : 8/10 (`etapes-iter-1-ux.md`, 3 bloquants, 13 non bloquants).
Lu : ce fichier en entier ; ma note de l'itération 1 ; `etalons-parcours-boulot-s19.md` (§1 conseils et défis des étapes 3 à 6, §3 étape 1 pour la continuité d'Anouk). Aucun autre fichier modifié. Pas d'outil de recherche ni de shell dans cette session : le code de rendu n'est pas relu (vérifié à l'itération 1), seul son report au handoff est contrôlé.
Hors note, comme demandé : conseils, exemples, défis, et les 16 vannes neuves (emplacements). Comptages de mots faits à la main, à plus ou moins 10 % : estimations.

## Note : 10/10, 0 bloquant

| Critère de la grille | Iter 1 | Iter 2 | Pourquoi |
|---|---|---|---|
| Une seconde pour comprendre, envie de la suite | 8 | 10 | Titre, scène, `why` et défi de l'étape 6 disent la même chose : une vanne prononcée, une de rechange sur la feuille. |
| Progression d'exposition lisible | 8 | 10 | Chaque `why` nomme qui entend (une personne, un petit groupe ou un ami, des gens connus à peine) ; la scène 5 crée l'occasion de jouer le cran social. |
| Version sans risque pro | 10 | 10 | Inchangé, une demi-phrase dans chaque `moduleDetail`. |
| Peur « me griller » | 9 | 10 | Test unique identique, cibles objets, et le silence après un flop est désormais traité : note de l'étape 3 (« Le rire n'est pas le critère »), Q2 de l'étape 3 (la C, « j'arrête »). |
| Durée réaliste | 7 | 10 | Étape 6 : « Environ 20 min » avec détail 10 + 10. Étape 4 : défaut conservé, borne haute dite et mesure prévue (voir O2). |
| Longueur de lecture | 8 | 10 | Les cinq scènes sont à 126 à 144 mots, test compris, plafond de 146 tenu (étape 4 : 142, comptée un à un à 142). |
| Quiz | 8 | 10 | Énoncés alignés sur les défis, pièges réellement tentants (étape 2 Q2 C, étape 3 Q2 C), bonne réponse ni la plus longue ni la plus courte, recomptée sur 12 questions sur 16 : toutes conformes. |
| Vidéos | 9 | 10 | Légendes d'observation honnêtes, variantes sans vidéo écrites (`moduleFormat`, `dureeTexte`). |
| Continuité des personnages | 7 | 10 | Anouk dans les six scènes (étape 1 comprise), sans objet ni horaire repris d'une étape à l'autre, sans date d'arrivée contradictoire. |
| Fin de parcours (étape 6) | 8 | 10 | Arc fermé par la scène (« il ne lui restera qu'à lire sa feuille »), `nextParcours*` écrits, `retourExerciceNote` qui dit que « écrit » suffit. |

Moyenne 10. Les observations O1 à O4 plus bas n'enlèvent aucun point : aucune ne change ce que la lectrice comprend, fait ou attend.

## Mes 16 corrections : 16 faites

| n° | Objet | Verdict | Preuve |
|---|---|---|---|
| 1 | `dureeTexte` de l'étape 6 | Fait | l.313 : « Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast. » ; reporté au handoff (2) et à « À vérifier » (4). |
| 2 | Étape 6, scène et défi alignés | Fait | l.310 : « une seule vanne à dire… plus une de rechange, notée à côté », fin sur « il ne lui restera qu'à lire sa feuille ». 142 mots test compris (recomptés). |
| 3 | Code : `whitespace-pre-line`, `frTypo` pour `boulot` | Au handoff | l.427 (1)(a)(b)(c), plus l.22 et l.428 (3). Compté comme point de code, plus comme bloquant de texte, comme demandé. |
| 4 | Étape 2 Q1 | Fait | l.52 : « entre collègues de ton service » ; plus de chef en copie. Réponse C devenue « depuis mardi » pour ne pas reprendre « lundi » de la scène (arbitrage 7, bon réflexe). |
| 5 | Étape 3 Q2 | Fait | l.129-135 : énoncé « Que fais-tu ensuite ? », C « tu abandonnes l'exercice », explication reprise. Fusionnée avec la note @reviewer (A « qu'il ait souri ou non »), voir O3. |
| 6 | Étape 5 Q3 | Remplacée par choix @reviewer N6 | l.274-280 : la question teste maintenant la règle « si ton chef entendait ta réponse » (le réflexe de sécurité central). Contrepartie assumée, arbitrage 3 : le silence après la chute reste testé à l'étape 4 Q2. J'accepte : le test remplaçant porte sur la peur principale de la persona. |
| 7 | Anouk dans les six scènes | Fait | l.39, 107, 175, 243, 310 + étape 1 (§3 étalons, mardi 9 h 50, seule). Jours et heures distincts, aucune redite d'objet (arbitrage 10). Romane, Clémence, Tristan absents des textes. |
| 8 | Étape 5, occasion de jouer le cran social | Fait | l.243 : mon texte mot pour mot, avec « Pose la question à quelqu'un que tu connais peu : on te la rendra », repli solo en dernier. Note de scène l.247 alignée. |
| 9 | Qui entend, dans le `why` des étapes 3, 4, 5 | Fait | l.106, 174, 242 : les trois phrases finales. |
| 10 | `retourExerciceNote` des étapes 2, 3, 6 | Fait | l.42, 110, 315, avec les libellés exacts des boutons (« Essayé, ça a marché ») ; meilleur que ma formulation, qui disait « Essayé » seul. |
| 11 | Étape 4, scène ramenée à la taille des autres | Fait | l.175 : 142 mots (cible 146). Histoire corrigée par @reviewer B3, meilleure que la mienne (« Je ne sais plus lequel » était illogique). |
| 12 | Fin de parcours | Fait | l.403-413 : `nextParcours`, `nextParcoursRanking`, `nextParcoursReason` (proposition marquée, à soumettre à l'aveugle). |
| 13 | Variantes sans vidéo | Fait | l.22, 248, 314 ; `APERCU_BAS` au handoff « À vérifier » (6). |
| 14 | Étape 2 Q2, mauvaise réponse tentante | Fait | l.64 : C « Un mail court à ton chef… » ; explication l.67 en conséquence. |
| 15 | Quatre mots du quiz | Fait | a) l.325 « meilleure vanne » ; b) l.271 « se moque de la mairie, qui est ton employeur » ; c) l.126 « dix mots au plus » ; d) l.338 « critiques le buffet, trop pauvre à ton goût ». |
| 16 | Plan de mesure | Fait | l.415-417 : mêmes cibles, marquées `[HYPOTHÈSE]`, étape 6 lue en premier. |

## Vérification des nouvelles frictions

| Point demandé | Résultat | Détail |
|---|---|---|
| Longueur | OK | Scènes (test compris, 200 mots/min) : étape 2 environ 125, étape 3 environ 126, étape 4 142, étape 5 144, étape 6 142. Plafond de 146 fixé et rappelé dans les notes de scène (l.180, 247, 317). Étape 6 reste la plus lourde (environ 1 450 mots) mais sa durée est dite. |
| Continuité d'Anouk | OK | Une seule personne, six situations : salle seule, mail, ascenseur, afterwork, pot de bienvenue, toast. Aucun métier contradictoire (bureau, photocopieuse, ordinateur, notices de montage). Le « troisième jour » de l'étape 6 est un souvenir, pas une durée : compatible avec « six semaines plus tard » de la fiche. Le pot de l'étape 5 n'est pas présenté comme le sien. |
| Durées | OK | Étapes 2, 3, 5 : 11 à 14 min, défaut tient. Étape 6 : 20 min affiché, estimation 19 à 22. Étape 4 : voir O2. Les cibles `duree_s` du plan de mesure sont cohérentes avec ces chiffres (900 s et 1 300 s). |
| Boutons de retour d'exercice | OK | Les trois notes ne se contredisent plus avec leur défi. Les étapes 4 et 5 gardent les boutons génériques, cohérents avec leurs défis (« Pas encore essayé » : le défi attend vraiment). |
| Fin de parcours | OK | La dernière marche finit sur une feuille volontairement non prononcée : la note de l'étape 6 le dit avant le clic, le bilan s'affiche ensuite avec une suite motivée. Pas de bouton nu. |

## Cognitive walkthrough rejoué (première lectrice, 26 ans, 15 min)

| Étape | Sait quoi faire ? | Action visible ? | But et action liés ? | Feedback immédiat ? | Friction |
|---|---|---|---|---|---|
| 2 | Oui | Oui | Oui | Oui (quiz, note sur le brouillon) | Aucune |
| 3 | Oui | Oui | Oui | Oui, et « Essayé, ça a marché » = dite en marchant | Corrigée (était H4) |
| 4 | Oui | Oui | Oui | Oui | Aucune |
| 5 | Oui | Oui | Oui : la scène donne une occasion si personne ne demande | Oui | Corrigée (était H7) |
| 6 | Oui : une vanne, une de rechange, rien à dire avant le jour J | Oui | Oui | Oui | Corrigée (était H4) |

Aucun `[FRICTION H{n}]` ouvert.

## Audit heuristique (Nielsen)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | PASS | Durée de l'étape 6 vraie, variante sans vidéo écrite. |
| H2 Vocabulaire de la persona | PASS | « vanne », « PS », « couloir », « pot » ; « trouvaille » remplacé. |
| H3 Contrôle et annulation | PASS | Brouillon, replis solo, rien à prononcer avant le jour J. |
| H4 Cohérence | PASS | Titre, scène et défi de l'étape 6 alignés ; boutons de retour alignés ; un seul personnage. |
| H5 Prévention d'erreurs | PASS | Test unique identique ; Q1 de l'étape 2 sans enjeu réel ; Q3 de l'étape 5 teste le réflexe « chef au pot ». |
| H6 Reconnaissance plutôt que rappel | PASS | Un seul test à retenir, à l'identique. |
| H7 Flexibilité | PASS | Un repli par défi ; l'étape 5 crée son occasion. |
| H8 Minimalisme | PASS | Tâche dite plusieurs fois (gabarit validé, accepté) ; scènes plafonnées à 146 mots. |
| H9 Messages d'erreur | PASS | Explication affichée juste ou fausse, jamais de reproche. |
| H10 Aide dans le flux | PASS | Version sans risque dans la scène, avant le conseil. |

## Observations sans impact sur la note (à connaître, rien à corriger avant l'import)

- **O1. L'étape 6 est la seule scène où la phrase d'Anouk n'est pas écrite.** Les cinq autres citent sa ligne (PS, couloir, histoire, réponse) ; ici, la vanne de rappel est décrite (« reprend ce « le temps qu'il faut » et le retourne contre elle »). La lectrice voit le mécanisme réellement joué juste après, dans l'exemple du conseil (Claire, « demain à tête reposée »). Risque déjà tracé à l'arbitrage 5 : la vanne « parapluie » pourra entrer après relecture à l'aveugle.
- **O2. Étape 4 : l'estimation reste à la borne haute.** Mon calcul de l'itération 1 la voyait « sous 15 min » après la correction n°11 ; en réalité la scène perd 11 mots et le `why` en gagne 11, donc le total ne bouge pas : 14 à 16 min, que le document annonce honnêtement (13 à 16). « Environ 15 min » reste dans la marge de l'estimation. La mesure à l'import (`duree_s`, étape 6 puis étape 4) tranche ; si la médiane de l'étape 4 dépasse 900 s, lui donner un `dureeTexte`.
- **O3. Étape 3 Q2 : la bonne réponse A (« qu'il ait souri ou non ») fait écho à la scène (« que l'autre sourie ou non »).** Rien de bloquant : la réponse reflète aussi le défi (« qu'elle ait fait rire ou non »), donc elle se déduit de ce qu'on vient d'apprendre, c'est le but d'un quiz de confirmation. Si @copywriter veut respecter à la lettre « aucune bonne réponse ne reprend un mot de la scène » : remplacer dans la scène « que l'autre sourie ou non » par « sans se retourner », qui annonce aussi le défi.
- **O4. Mesure du diff réel (P0 s11) non faite.** Le document le dit (arbitrages, première ligne) : pas de shell dans la session de l'itération 1. Ce n'est pas une question d'expérience utilisateur, mais le rapport ne doit pas être validé sans cette mesure : la session principale lance `git diff --stat` sur le fichier avant de clore l'itération. Estimation à la main du document : 5 `moduleDetail`, 3 `why`, 13 questions sur 16, aucun conseil ni défi.

## Reste hors périmètre (inchangé)

La durée mesurée en production, la relecture à l'aveugle des 16 vannes neuves et de `nextParcoursReason`, le visionnage des vidéos, et le code du rendu (point 3).

---

**Handoff → @orchestrator** (puis @fullstack pour le point de code, @data-analyst pour le plan de mesure)
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/etapes-iter-2-ux.md`. Aucun autre fichier modifié.
- Note : 10/10. Bloquants : 0. Corrections demandées : aucune (16 sur 16 faites ou reportées au handoff @fullstack).
- Décisions prises : la substitution de la Q3 de l'étape 5 par la question « chef au pot » est acceptée (elle teste la peur principale) ; l'étape 6 reste sans phrase écrite d'Anouk tant que la vanne n'a pas passé la relecture à l'aveugle.
- Points d'attention : lancer la mesure du diff réel avant clôture (O4) ; le point de code (sauts de ligne du `moduleDetail` aux trois endroits, `frTypo` pour `boulot`, JSON-LD et `llms-parcours`) est au handoff @fullstack, point 1, et à rejouer en capture mobile à l'import ; lire `parcours-etape.duree_s` en commençant par les étapes 6 et 4.
