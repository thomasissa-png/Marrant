# Itération 2, relecteur à l'aveugle n°1 : étalons du parcours Storytelling (s18)

> Fichier noté : `docs/copy/etalons-parcours-storytelling-s18.md`, version corrigée, relue en entier (non modifiée). Lu aussi : `iter-1-corrections.md`. `iter-1-ux.md` non lu.
> Vérifié : les 2 vannes de remplacement sont actives au texte exact (`vannes-actives-s17.json` l. 234 et 1234). Tous les comptes de mots ont été refaits, élisions comptées pour un mot (m'a, j'ai, qu'on, l'a) : vannes 1 à 5 (17/3/6, 8/3/6, 11/4/9, 15/6/4, 12/5), exemple 1a (11 contre 8), titre A (60 caractères). Tous sont justes. Recherche dans le fichier : zéro tiret cadratin, « blague » seulement dans « blague à tiroirs » et dans la citation du titre en base, aucun prénom de persona.
> Les 20 défauts R1 à R20 du tour 1 sont corrigés. Choix signés par Thomas non rediscutés ; humoristes conservés (P0 s15).

## Notes

| Critère | Note | Justification |
|---|---|---|
| C1 Drôlerie et naturel | 9/10 | Saut net : le fromage repris deux fois, l'accroche B « passé au dessert », la réplique « refais le passage du cousin », la tondeuse robot. Ce qui manque : la question 1 du quiz ouvre sur un double sens involontaire (« la montée de son canapé »), et le témoignage B mélange le cadre « à un dîner » et « Hier ». |
| C2 Voix et règles | 9/10 | Toutes les règles sont tenues. Reste un défi 1a devenu lourd (8 phrases, « légère » deux fois), et « (sans elle, …) » maladroit dans les défis 1b et 1c. |
| C3 Exactitude et preuve | 9/10 | Vannes et comptes exacts, Pascot marqué, sources des légendes citées. Une affirmation fausse : « dans chaque question, chaque mauvaise réponse enfreint une seule règle » (l. 146) ne vaut pas pour la question 1. |
| C4 Cohérence spec et choix signés | 7/10 | Le choix 6 recommande A, qui abandonne pour l'étape 6 l'objectif de la spec (histoire finale racontée, critère K15), sans le dire. La question 1 du quiz porte « sur quatre détails », alors que la spec demande un quiz « sur le découpage en actes (pas sur les détails) ». |
| C5 Facilité de décision | 9/10 | Tableau à 8 choix, recos tranchées, jargon sorti des passages lus par Thomas, signalements clairs. Mais avec « Je suis tes recos », Thomas validerait sans le voir l'abandon du critère K15 (choix 6). |

**Note globale : 7/10** (la plus basse des cinq, C4).

## Écarts partiels du tour 1 : jugement

| Écart | Verdict | Raison |
|---|---|---|
| X2 (durée « une dizaine de minutes » non écrite) | **Recevable** | La spec RC7 marque la durée « estimation, non mesurée, à mesurer avant de communiquer ». L'écrire dans un texte public serait une donnée inventée. |
| X3 (un seul choix 6 au lieu de 1d et 1e) | **Recevable sur la forme, pas sur le fond** | Regrouper en un seul choix est plus lisible. Mais la reco A du choix 6 contredit la spec pour l'étape 6 : voir R21. |
| X12 (« tes histoires » et non « ton histoire ») | **Recevable** | Le titre vend la compétence et la requête (« raconter »), la fiche vend l'anecdote. Le tutoiement est rétabli. |

## Défauts restants

### Bloquant

**R21. Choix 6 : la reco A abandonne l'objectif de la spec pour l'étape 6 sans le dire** (§7, tableau et Reco ; tableau des choix l. 19 ; handoff « A (fil rouge) »).
La spec §2.1 fixe l'objectif « À la fin, la personne raconte une anecdote vraie qu'on lui redemande ». Elle mesure aussi le parcours par le critère K15 : « l'histoire finale a été racontée à au moins deux personnes (retour d'exercice de l'étape 6) ». L'intention d'exercice de l'étape 6 est « Version finale avec détail planté puis rappelé, racontée à deux personnes dans la semaine ».
Avec 6A, le défi de l'étape 6 reste « retiens le premier détail précis qui fait sourire » dans une conversation de groupe : aucune histoire finale n'est racontée, K15 ne mesure plus rien, et la fiche (« jusqu'à ce qu'on te la redemande ») promet une fin que le parcours ne demande pas. Pour l'étape 3, la spec rend déjà l'anecdote facultative (« l'étape 3 propose un raté comme alternative ») : 6A n'y pose aucun problème.
Le texte B du Callback dit aussi « raconte-la à quelqu'un », alors que K15 demande deux personnes.
Correction :
- Scinder la reco : « **Étape 3 : A** (la spec rend déjà l'anecdote facultative). **Étape 6 : B**, car c'est le seul moyen de tenir l'objectif de la spec et son critère de réussite (histoire finale racontée à deux personnes). »
- Ajouter dans « Coût » de A : « L'étape 6 ne demande plus de raconter l'histoire finale : le critère de réussite du parcours (K15 dans la spec) ne se mesure plus. »
- Texte B du Callback : « Tu travailles ton anecdote du parcours Storytelling ? Plante un détail dans ses deux premières phrases, fais-le revenir dans la chute, puis raconte-la à deux personnes cette semaine. Pas de public ? Envoie-la en vocal ou par écrit à deux amis. »
- Mettre à jour la ligne 19, le « Je suis tes recos » du handoff (« A pour l'étape 3, B pour l'étape 6 ») et le `[À VÉRIFIER @fullstack]` (déjà présent, à garder).

### Important

**R22. Question 1 du quiz : double sens involontaire, réponse donnée par le texte d'étape, écart avec la spec et affirmation fausse l. 146** (§3, question 1 et ligne 146).
- Citation : « Imagine Samir qui prépare la montée de son canapé coincé. » On lit « monter le canapé » (dans l'escalier), alors que la question 2 dit « descendre mon canapé ».
- « Il hésite entre quatre détails » : la spec demande « 4 questions sur le découpage en actes (pas sur les détails) ».
- La bonne réponse (« Le camion coûtait quatre-vingt-dix euros la journée ») reprend « le prix du camion », cité comme ce qui traîne dans le `moduleDetail` juste au-dessus, et encore dans l'option C de la question 2 : la question se gagne sans réfléchir (règle s17 du format quiz).
- L. 146 : « Dans chaque question, chaque mauvaise réponse enfreint une seule règle ». Dans la question 1, les mauvaises réponses n'enfreignent rien : ce sont des phrases à garder.
Correction :
- Énoncé : « **Imagine Samir qui écrit le deuxième acte de son histoire de canapé coincé. Il a quatre phrases. Laquelle doit-il couper ?** »
- D : « **La veille, j'avais regardé la météo : il devait faire beau.** »
- Explication : « La D. La météo n'amène rien à la chute : elle ralentit juste le deuxième acte. Le coude, les deux mètres dix et le cousin qui lâche son côté préparent tous le canapé coincé, donc ils restent. »
- L. 146 : « Dans la question 2, chaque mauvaise réponse enfreint une seule règle, ce que l'explication nomme ; dans la question 1, les trois autres phrases sont utiles à la chute, et l'explication dit pourquoi. »

### Mineurs

**R23. Défi 1a trop long et redondant** (§1a, `exercice`). 8 phrases, « vraie et légère » puis « Si l'histoire te pèse un peu, prends-en une plus légère », et « il te resservira dans le parcours Storytelling » lu depuis l'intérieur du parcours. Correction : retirer la dernière phrase et compléter la première : « choisis une anecdote vraie et légère de ta semaine (si une histoire te pèse, prends-en une autre), avec au moins une autre personne dedans… ». Remplacer « Garde ton texte : il te resservira dans le parcours Storytelling. » par « Garde ton texte : il te resservira. »

**R24. « (sans elle, une que tu connais bien) »** (§1b et §1c, `exercice`). Tournure maladroite. Correction : « reprends ton anecdote du parcours Storytelling (ou, à défaut, une que tu connais bien) ».

**R25. Témoignages : cadre temporel flou, et digression présentée comme le problème alors que l'étape 5 l'enseigne** (§2).
- B : « Imagine Samir à un dîner. Il y a six semaines, … Hier, … ». Le dîner et « hier » se chevauchent, et « deux digressions » sonne comme un défaut alors que l'étape 5 ajoute un détour. Correction : « Imagine Samir. Il y a six semaines, son déménagement tenait en trois minutes et deux digressions qui ne menaient nulle part. Hier soir, au dîner, il l'a raconté en une minute, canapé coincé compris, et quelqu'un a demandé : « Attends, refais le passage du cousin. » »
- A : « c'est la même histoire, dite sans détour » contredit l'étape 5 (« Quand ton histoire fait un détour »). Correction : « dite dans l'ordre ».

**R26. Légende Ngijol : « l'instant où ça bascule » n'est pas la montée** (§3, vidéos). La montée est l'escalade marche par marche (fiche catalogue), pas un instant de bascule. Correction : « Un voisin banal, puis agaçant, puis dément. Repère chaque marche : c'est la montée, le deuxième acte, vue de l'intérieur. »

## Décompte

1 bloquant (R21), 1 important (R22), 4 mineurs (R23 à R26). Aucun défaut du tour 1 ne revient.
