# Itération 1, relecture UX des étapes 2 à 6 du Parcours Boulot

Fichier noté : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (non modifié, 406 lignes, numéros de lignes = ce fichier).
Lu : ce fichier en entier ; `etalons-parcours-boulot-s19.md` (§3 étape 1, §6 vidéos, §7 progression et garde-fou, signalement 7) ; `founder-preferences.md` (lignes du 10/10) ; spec s17 §1 et §3 ; modèle Storytelling s18 (début) ; code du rendu : `parcours-step-card.tsx`, `step-blocks.tsx`, `step-quiz.tsx`, `parcours-detail.tsx`, `path-completion-card.tsx`, `parcours-content.tsx` (l.300-370), `parcours-types.ts`, `config/textes/parcours.ts`. Aucun autre fichier modifié.
Hors note, comme demandé : le texte des conseils (contenu, exemple, défi) et les 16 vannes neuves (emplacements). Les 9 vannes en ligne sont jugées seulement sur leur lien avec l'étape.
Comptages de mots faits à la main, à plus ou moins 10 % : ce sont des estimations, pas des mesures.

## Note

| Critère de la grille | Note | Pourquoi, en une ligne |
|---|---|---|
| Une seconde pour comprendre, envie de la suivante | 8 | Titres courts qui annoncent une limite rassurante (15 s, 30 s, 2 phrases, 60 s). Étape 6 : titre et scène disent « une seule vanne », le défi en fait écrire deux (n°2). |
| Progression d'exposition lisible | 8 | Visible dans les scènes (une personne, trois collègues, un inconnu, un pot), mais le `why` des étapes 3, 4, 5 ne dit pas qui entend (n°9), et l'étape 5 se joue presque toujours en repli (n°8). |
| Version sans risque pro | 10 | Les cinq étapes en ont une, nommée en une demi-phrase dans le `moduleDetail` et complète dans le défi. |
| Peur « me griller » | 9 | Test unique identique en dernier paragraphe, cibles toujours des objets, rien d'obligatoire. Manque : le silence après un flop à l'étape 3 (n°5, n°10). |
| Durée réaliste | 7 | Étapes 2 à 5 : 11 à 15 min, le défaut « Environ 15 min, hors vidéos » tient. Étape 6 : environ 20 à 22 min, le défaut est faux (n°1). |
| Longueur de lecture | 8 | Étapes 2 à 5 autour de 1 050 mots, comme l'étape 1. Étape 6 : environ 1 450. Scène de l'étape 4 à 153 mots contre 136 pour l'étape 1 (n°11). |
| Quiz | 8 | Situations crédibles et explications utiles. Un énoncé hors sujet (étape 2 Q1), une question dont les mauvaises réponses sont peu plausibles (étape 3 Q2) (n°4, n°5, n°6). |
| Vidéos | 9 | Légendes honnêtes (fiche + observation), bloc facultatif, vidéo seule en pleine largeur. Variante sans vidéo du format à prévoir (n°13). |
| Continuité des personnages | 7 | Anouk aux étapes 1, 2, 6 ; Romane, Clémence, Tristan une seule fois chacun, alors que la fiche promet « Anouk, six semaines plus tard » (n°7). |
| Fin de parcours (étape 6) | 8 | Carte de fin solide (titres cochés, suite). Mais l'étape finit sur une feuille et une scène en suspens, et `nextParcoursReason` n'est écrit nulle part (n°12). |

**Note globale : 8/10** (moyenne 8,2, arrondie vers le bas). **3 corrections bloquantes** : 2 de texte (n°1, n°2) et 1 de code déjà au handoff @fullstack mais encore non faite (n°3). **13 corrections non bloquantes** (n°4 à n°16). Avec les 16 corrigées, aucun critère n'est sous 9 : cible 10/10 atteignable en une itération, sans toucher un conseil ni une vanne.

## Ce que tient bien (à ne pas casser)

- Les cinq titres. « Un PS drôle, sans finir en capture d'écran » et « Le couloir : quinze secondes » se comprennent en une seconde ; les deux changements de titre assumés (étapes 2 et 4) sont des gains.
- Le test unique, mot pour mot, en dernier paragraphe, et la version sans risque dans la scène : c'est ce qui rend vraie la promesse « sans te griller », y compris pour le visiteur qui ne lit que l'aperçu (`LockedStepPreview` affiche le `moduleDetail`).
- Les cibles des scènes sont toutes des objets (photocopieuse, ascenseur, ordinateur, notices, parapluie) : aucune ne vise une personne.
- Quiz : bonne réponse jamais mélangée à l'écran (pas de tirage au sort dans `step-quiz.tsx`), l'explication s'affiche après chaque réponse, juste ou fausse. Recomptage de longueurs sur les 15 questions : aucune bonne réponse n'est la plus longue ni la plus courte. Rien à corriger de ce côté.
- Le quiz de l'étape 4 (Q3, collègue précis) et de l'étape 5 (Q1, « enfin voilà ») entraînent exactement le réflexe de sécurité du parcours.

## Ce qui s'affiche vraiment (code lu)

Ordre dans une étape ouverte : « Pourquoi cette étape ? » (`why`), « Ce que tu vas apprendre » (`moduleDetail`, puis « Format : », puis la durée), « Le conseil », « Exemple concret », « Exercice pratique » (défi + 3 boutons « Alors, ce défi ? »), « Vannes à pratiquer », « Pour aller plus loin, facultatif » (vidéos), « Petit quiz avant de valider », « Valider cette étape ». La tâche est donc dite quatre fois avant d'être faite (`why`, scène, conseil, défi) : c'est le gabarit validé, je ne le remets pas en cause, mais cela rend la longueur des scènes décisive.

| Étape | Mots à l'écran, hors vidéos | Lecture (200 mots/min) | Quiz | Défi | Total estimé | « Environ 15 min » |
|---|---|---|---|---|---|---|
| 2 | environ 1 060 | 5 min 30 | 3 min | 3 à 5 min | 11 à 14 min | tient |
| 3 | environ 1 080 | 5 min 30 | 3 min | 3 à 5 min | 11 à 14 min | tient |
| 4 | environ 1 060 | 5 min 30 | 3 min | 5 à 7 min (écrire en trois temps, chronométrer) | 14 à 16 min | limite |
| 5 | environ 1 010 | 5 min | 3 min | 3 à 4 min | 11 à 12 min | tient |
| 6 | environ 1 450 (conseil 166, exemple 135, défi 260, scène 146) | 7 min 15 | 4 min | 8 à 10 min (100 à 125 mots, deux rappels) | 19 à 22 min | **faux** |

Trois constats de rendu :
1. `moduleDetail` est rendu dans un `<p>` sans `whitespace-pre-line` aux trois endroits (`parcours-step-card.tsx` l.285, `step-blocks.tsx` l.39, `parcours-content.tsx` l.335-337). Le saut de ligne avant le test n'apparaît donc pas : scène et test forment un seul bloc de 125 à 150 mots (n°3).
2. La durée vient de `step.dureeTexte ?? dureeEtapeTexte(...)` (l.289) : le champ existe, il suffit de le renseigner (n°1). L'aperçu verrouillé n'affiche aucune durée (déjà au handoff, hors périmètre).
3. `frTypo` n'est appliqué qu'au slug `storytelling` (l.269) et jamais à `why` ni `moduleDetail` : « 16 h 40 », « 18 h 30 » et les « : » peuvent se couper en bout de ligne sur mobile (n°3).

## Cognitive walkthrough (première lectrice, 26 ans, 15 min)

| Étape | Sait quoi faire ? | Action visible ? | But et action liés ? | Feedback immédiat ? | Friction |
|---|---|---|---|---|---|
| 2 | Oui | Oui (encadré « Exercice pratique ») | Oui | Quiz oui ; PS écrit : 3 boutons | Aucune bloquante (n°4 sur le quiz) |
| 3 | Oui | Oui | Oui | Quiz oui ; mais les boutons de retour contredisent le défi | `[FRICTION H4]` : à l'étape 3, après une phrase sans rire, elle clique « Essayé, bof » et lit « Relis l'exemple et retente », alors que le défi dit « qu'elle ait fait rire ou non ». Solution : n°10 |
| 4 | Oui | Oui | Oui | Quiz oui | Scène de 153 mots avant le conseil (n°11) |
| 5 | Oui | Oui | **Non** : « donne-la à la première personne qui te pose la question aujourd'hui », or personne ne la pose un mardi ordinaire | Quiz oui | `[FRICTION H7]` : à l'étape 5, elle bascule presque toujours sur le repli solo, donc le cran « des gens que tu connais peu » n'est jamais joué. Solution : n°8 |
| 6 | **Non** : le titre et la scène disent une vanne, le défi demande « deux choses vraies », « chacune en rappel », une meilleure et une de rechange | Oui | Partiellement | Quiz oui | `[FRICTION H4]` : à l'étape 6, la lectrice lit « une seule vanne » puis un défi à deux vannes, sur la dernière marche. Solution : n°2 |

## Corrections bloquantes

**n°1. [BLOQUANT] La durée de l'étape 6 est fausse.**
Emplacement : tableau d'ensemble (l.19), fiche de l'étape 6 (aucun `dureeTexte`), handoff point (5) (« durée à mesurer à l'import »).
Problème : le défaut « Environ 15 min, hors vidéos » s'affiche sous la scène. L'étape 6 pèse environ 1 450 mots, plus un quiz de 4 questions, plus 100 à 125 mots à écrire avec deux rappels : 19 à 22 minutes, soit 5 à 7 de plus que promis, sur la dernière marche, pour une lectrice dont la première frustration est la longueur. Un abandon ici coûte le bilan de fin. Les étapes 2, 3 et 5 tiennent ; l'étape 4 est à la limite (14 à 16).
Correction : renseigner dès ce document `dureeTexte` de l'étape 6 (la mesure réelle viendra de l'événement `parcours-etape.duree_s`) :
> Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast.
Ajouter la ligne `dureeTexte` au tableau de l'étape 6 et la reporter au handoff en remplacement de « à mesurer à l'import ». Étape 4 : laisser le défaut, la correction n°11 la ramène sous 15.

**n°2. [BLOQUANT] Étape 6 : la scène et le titre annoncent une seule vanne, le défi en fait écrire deux.**
Emplacement : `moduleDetail` de l'étape 6 (l.305) ; la fin du `why` ne change pas.
Problème : voir la friction ci-dessus. La vanne de rechange n'apparaît que dans le défi et le quiz (Q3). La scène finit aussi sur « Son toast reste sur sa feuille jusqu'à vendredi » : l'arc du parcours, qui promet « tu finis par un toast » (fiche B), s'arrête dans le vide.
Correction : remplacer le `moduleDetail` (144 mots test compris, contre 146 aujourd'hui) par :
> Imagine Anouk, mardi soir, chez elle, une feuille et un stylo. Vendredi, c'est le pot de départ d'un collègue qui l'a dépannée. Elle écrit d'abord un souvenir daté : son troisième jour, la pluie, le parapluie qu'il lui a prêté avec un « garde-le le temps qu'il faut ». Ensuite une seule vanne à dire, qui reprend ce « le temps qu'il faut » et le retourne contre elle, plus une de rechange dans sa poche. Enfin une phrase pour lever le verre. Vendredi, il ne lui restera qu'à lire sa feuille. Dans cette étape, tu écris le tien de la même façon, pour un vrai pot ou pour un pot imaginé. Rien ne se prononce avant le jour J, et ta vanne reste sur ta feuille jusque-là. `[saut de paragraphe]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?
La note de scène (l.309) reste vraie : la vanne n'est toujours pas écrite, la scène ne reprend ni Claire, ni la machine à café, ni « demain à tête reposée ».

**n°3. [BLOQUANT, code, déjà au handoff @fullstack (e)] Le saut de ligne du `moduleDetail` ne s'affiche pas, et la typographie française ne s'applique pas à `boulot`.**
Emplacement : `parcours-step-card.tsx` l.285 et l.269 ; `step-blocks.tsx` l.39 ; `parcours-content.tsx` l.335-337.
Problème : sans `whitespace-pre-line`, le test unique se colle à la scène (un bloc de 125 à 150 mots, la règle à retenir se lit comme la suite de l'histoire), alors que tout le garde-fou « sans te griller » repose sur ce paragraphe séparé. Vérifié le 10/10 : aucune des trois lignes n'a la classe.
Correction : ajouter `whitespace-pre-line` aux trois `<p>` (après avoir vérifié qu'aucun `moduleDetail` des autres parcours n'a de `\n`) ; étendre la condition de l.269 à `slug === "boulot"` et passer `why` et `moduleDetail` dans `frTypo` pour ce slug (insécables avant « : » et dans « 16 h 40 »). Aucun changement de texte.

## Corrections non bloquantes

**n°4. Étape 2, Q1 : une situation qui contredit le défi.**
Emplacement : question 1 (l.50). Problème : « il fixe l'heure d'une visite, et ton chef est en copie » est un mail à enjeu réel ; le défi demande « un mail à faible enjeu, entre collègues » et la question 2 enseigne exactement l'inverse. Pour une lectrice qui a peur de se griller, la première question normalise le PS dans un mail avec le chef en copie. Correction : remplacer l'énoncé par « Ton mail est prêt : il confirme la salle d'un atelier, entre collègues de ton service. Laquelle de ces lignes ajoutes-tu sous la signature ? ». Les quatre réponses et l'explication restent valables ; la Q2 ne reprend pas ce cas (point d'équipe), pas de fuite.

**n°5. Étape 3, Q2 : l'énoncé demande ce qu'on « retient », trois réponses sur quatre sont des actions peu plausibles, et la vraie réaction de la persona manque.**
Emplacement : question 2 (l.125-132). Problème : personne ne « se retourne » ni ne « revient sur ses pas » après avoir croisé quelqu'un ; la réponse réellement tentante pour elle (« ça n'a pas fait rire, donc j'arrête ») est absente. Correction : énoncé « Tu viens de sortir ta phrase en croisant quelqu'un, qui n'a pas réagi. Que fais-tu ensuite ? » ; A (bonne, toujours en A) « Tu continues ton chemin : c'est réussi, la réaction ne compte pas. » ; B inchangée ; C « Tu en conclus qu'elle n'était pas drôle et tu abandonnes l'exercice. » ; D inchangée. Explication : « La A. Le défi se joue sur le geste : la dire en marchant suffit, même sans réaction. La B guette la réaction et la D demande un avis : deux façons de transformer quinze secondes en conversation. La C prend un silence pour un verdict, et c'est le piège qui te ferait arrêter. » Longueurs (11 / 10 / 11 / 13 mots) : la bonne n'est ni la plus longue ni la plus courte.

**n°6. Étape 5, Q3 : tenir le silence après la chute.**
Emplacement : question 3 (l.268-275). Problème : la bonne réponse (« tu te tais ») est juste mais ne dit pas comment tenir un silence de deux secondes, qui est la vraie difficulté pour la persona. Correction : A « Tu te tais, tu souris et tu laisses l'autre réagir. » ; D « Tu enchaînes aussitôt sur le détail de ton plus gros dossier. » (reste plus longue que A, A n'est ni la plus longue ni la plus courte) ; explication : « La A. La chute n'a pas besoin de renfort : tu t'arrêtes, un sourire suffit pour tenir le silence, et c'est l'autre qui fait le travail. Le « enfin voilà » de la B l'efface, la C explique la vanne, et la D enchaîne sur autre chose avant qu'on ait réagi. »

**n°7. Continuité : Anouk dans les six scènes.**
Emplacement : `moduleDetail` des étapes 3 (Romane), 4 (Clémence), 5 (Tristan) ; note de scène de l'étape 5 (l.243) ; décisions du handoff (l.400) ; ligne 6 d'en-tête.
Problème : la fiche B dit « Imagine Anouk, six semaines après avoir commencé » ; l'étape 1 présente Anouk comme exemple du parcours ; puis trois inconnus se succèdent aux étapes 3, 4 et 5. La progression d'exposition, qui est le récit du parcours, se lit comme celle d'une seule personne seulement si c'est la même.
Correction : Anouk partout. Étape 3 : « Imagine Anouk, mardi, 12 h 52… Anouk passe à sa hauteur sans ralentir… ». Étape 4 : « Imagine Anouk, vendredi, 18 h 30… » (texte complet au n°11). Étape 5 : « Imagine Anouk, jeudi… lui demande ce qu'elle fait dans la vie. Anouk ne récite pas son titre. Elle répond… » (texte complet au n°8). Les pronoms de l'étape 5 passent au féminin. Le métier de la scène 5 (notices de montage) s'accorde avec les deux autres scènes de bureau. Les noms Romane, Clémence, Tristan disparaissent des textes du site ; aucun quiz ne les cite.

**n°8. Étape 5 : le cran « des gens que tu connais peu » n'est presque jamais joué.**
Emplacement : `moduleDetail` de l'étape 5 (l.239). Problème : le défi dit de donner sa réponse « à la première personne qui te pose la question aujourd'hui » ; un mardi ordinaire, personne ne la pose, donc elle bascule sur « trois fois à voix haute, seule », et les étapes 5 et 6 deviennent deux étapes solo. Le défi validé ne bouge pas ; la scène peut créer l'occasion. Correction : remplacer le `moduleDetail` par (143 mots, test compris, contre 139 aujourd'hui, la scène perd les chips et la phrase d'enchaînement) :
> Imagine Anouk, jeudi, 19 h 10, à un pot de bienvenue. Un inconnu lui demande ce qu'elle fait dans la vie. Anouk ne récite pas son titre. Elle répond : « Je rédige des notices de montage. Je passe un samedi sur deux chez des inconnus, en tout petits caractères. » L'autre pose une question sur les notices. Dans cette étape, tu écris ta propre réponse en deux phrases : un verbe concret, puis le détail que la fiche de poste ne dit pas. La moquerie tombe sur toi, jamais sur ton métier ni sur ton employeur. Personne ne te le demande ? Pose la question à quelqu'un que tu connais peu : on te la rendra. Sinon, répète ta réponse trois fois à voix haute, seul. `[saut de paragraphe]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?

**n°9. Progression lisible : dire qui entend, dès le « Pourquoi cette étape ? ».**
Emplacement : dernière phrase du `why` des étapes 3, 4, 5 (les étapes 2 et 6 le font déjà). Problème : la lectrice qui survole voit « en marchant », « de trente secondes au plus », « la tienne », jamais le cran social. Correction : étape 3 « Ici, tu en dis une, en marchant, à une seule personne. » ; étape 4 « Ici, tu en prépares une, de trente secondes au plus, pour un petit groupe ou, pour commencer, pour un ami. » ; étape 5 « Ici, tu écris la tienne, pour des gens que tu connais à peine. » (+5, +11, +6 mots).

**n°10. Boutons « Alors, ce défi ? » : ils contredisent trois défis.**
Emplacement : champ `retourExerciceNote` des étapes 2, 3, 6 (existe dans `parcours-types.ts`, affiché au-dessus des boutons, `parcours-step-card.tsx` l.323). Problème : les trois boutons sont génériques (`RETOUR_EXERCICE`). Étape 2 : le défi dit « le PS gardé en brouillon compte », le bouton « Pas encore essayé » répond « le défi t'attend ». Étape 3 : le défi dit « qu'elle ait fait rire ou non », « Essayé, bof » répond « retente ». Étape 6 : rien n'est prononcé, « essayé » est ambigu. Cela fausse aussi la ligne « N défis essayés, dont M qui ont marché » de la carte de fin. Correction, une phrase par étape : étape 2 « Un PS resté en brouillon compte : choisis « Essayé ». » ; étape 3 « Ici, « ça a marché » veut dire que tu l'as dite en marchant. Le rire n'est pas le critère. » ; étape 6 « Ici, « essayé » veut dire écrit. Ton toast se dit le jour du pot, pas avant. »

**n°11. Étape 4 : ramener la scène à la taille des autres.**
Emplacement : `moduleDetail` de l'étape 4 (l.172). Problème : 153 mots test compris, contre 136 pour l'étape 1 et 123 à 126 pour les étapes 2, 3 et 5 ; c'est la scène la plus longue, devant une étape déjà à 14-16 min. Correction (146 mots, avec Anouk) :
> Imagine Anouk, vendredi, 18 h 30, un verre à la main, au milieu de trois collègues qui racontent leur semaine. Quand vient son tour, elle dit : « Ce matin, mon ordinateur m'a demandé de changer de mot de passe. Le premier était trop court, le deuxième trop proche de l'ancien. Au troisième, j'avais mis un chiffre, une majuscule et une larme. Il a été accepté. Je ne sais plus lequel. » Puis elle boit une gorgée. Le tout a duré moins de trente secondes, et la seule victime est un ordinateur. Dans cette étape, tu prépares ton histoire, avec un petit moment de ta semaine qui t'a mis en difficulté. Pas d'afterwork à venir ? Raconte-la d'abord à un ami qui ne connaît rien à ton boulot. `[saut de paragraphe]` Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?
Avec le `why` du n°9 (+11 mots), la lecture reste sous 15 min. Plafond proposé pour toute scène : 146 mots (le niveau de l'étape 6).

**n°12. Fin de parcours : écrire `nextParcours` et sa raison.**
Emplacement : ce document n'a aucune section « fin de parcours » ; étalons signalement 8 (« à écrire plus tard »). Problème : `PathCompletionCard` n'affiche la phrase de suite que si `nextParcoursReason` existe ; sans elle, le bouton « Passer au parcours X » arrive nu, après six semaines. La carte elle-même est satisfaisante (titres cochés dans « Ce que tu sais faire maintenant », XP, défis essayés) ; les six titres se lisent bien comme acquis. Correction : ajouter une section « Fin de parcours » avec `nextParcours` = `storytelling` (classement de départ de la spec §5.5), `nextParcoursRanking`, et `[PROPOSITION @copywriter, relecture à l'aveugle]` pour `nextParcoursReason` : « Tu sais écrire court et le dire sans te griller. Storytelling t'apprend à en faire une histoire entière, celle qu'on te redemande. » La scène finale corrigée au n°2 (« il ne lui restera qu'à lire sa feuille ») ferme l'arc.

**n°13. Variante sans vidéo à écrire maintenant.**
Emplacement : `moduleFormat` des étapes 5 et 6, `dureeTexte` de l'étape 6 (n°1). Problème : si Delmoitiez ou Hamzawi tombe au visionnage, le bloc vidéo disparaît seul mais « une vidéo » reste dans le format et « hors vidéos » dans la durée, et `APERCU_BAS` cite « les vidéos ». Correction : noter les variantes : format « Un conseil, un défi, 5 vannes, un petit quiz. » ; `dureeTexte` de l'étape 6 « Environ 20 min : 10 min de lecture et de quiz, 10 min pour écrire ton toast. » ; le point `APERCU_BAS` reste celui du handoff (7a).

**n°14. Étape 2, Q2 : une mauvaise réponse tentante.**
Emplacement : question 2, réponse C (l.62). Problème : excuses à un client, message à toute l'entreprise, bilan au directeur : trois cas que personne ne choisit, la question ne détecte rien. Correction : C devient « Un mail court à ton chef, pour confirmer un rendez-vous. » (tentant parce que court) ; explication : « … la C, même courte, s'adresse à celui qui évalue ton travail … ». La bonne réponse B reste au milieu en longueur.

**n°15. Quatre mots à clarifier dans le quiz.**
(a) Étape 6, Q1 : « ta meilleure trouvaille » devient « ta meilleure vanne ». (b) Étape 5, Q2, explication : « La A fait payer l'employeur » (ambigu) devient « La A se moque de la mairie, qui est ton employeur ». (c) Étape 3, Q1, explication : « moins de dix mots » devient « dix mots au plus » (le défi dit « dix mots maximum »). (d) Étape 6, Q2, réponse D : « qui n'en avait pas » (on ne sait plus si le gâteau ou le buffet) devient « Une où tu critiques le buffet, trop pauvre à ton goût. ».

**n°16. Plan de mesure à ajouter au handoff (HEART, dimension primaire : Task success).**
Signaux déjà émis, aucun nouvel événement : `parcours-etape` avec `duree_s` (temps ouverture à validation, plafonné à 3 600 s), `etape-retour` (3 valeurs), `quiz-etape-termine` (score, total), `parcours-termine`. Cibles `[HYPOTHÈSE : à confirmer par @data-analyst, aucune donnée Boulot avant mise en ligne]` : médiane de `duree_s` ≤ 900 s aux étapes 2 à 5 et ≤ 1 300 s à l'étape 6 ; part de « Pas encore essayé » ≤ 40 % aux étapes 3 à 5 ; validation de l'étape 6 par ceux qui ont validé l'étape 5 ≥ 70 % (le défaut de 90 % est irréaliste sur six semaines sans rappel). Lire d'abord l'étape 6 : si la médiane dépasse 1 300 s, ajuster `dureeTexte`.

## Audit heuristique (Nielsen), étapes 2 à 6

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | FAIL | Durée de l'étape 6 fausse (n°1). |
| H2 Vocabulaire de la persona | PASS | « vanne », « PS », « couloir », « pot » ; seul « trouvaille » accroche (n°15a). |
| H3 Contrôle et annulation | PASS | Brouillon, replis solo, quiz sans note, rien d'obligatoire à envoyer ni à dire. |
| H4 Cohérence | FAIL | Scène vs défi à l'étape 6 (n°2), boutons de retour vs défis (n°10), personnages (n°7). |
| H5 Prévention d'erreurs | PASS | Test unique, cibles toujours des objets ; sauf la Q1 de l'étape 2 (n°4). |
| H6 Reconnaissance plutôt que rappel | PASS | Un seul test à retenir, répété à l'identique. |
| H7 Flexibilité | PASS | Un repli par défi ; l'étape 5 gagne un déclencheur (n°8). |
| H8 Minimalisme | FAIL léger | Tâche dite quatre fois (gabarit validé, accepté) ; étape 6 à 1 450 mots (n°1, n°11). |
| H9 Messages d'erreur | PASS | « Pas tout à fait » plus la bonne réponse et l'explication, jamais de reproche. |
| H10 Aide dans le flux | PASS | Version sans risque dans la scène, avant même le conseil. |

## Cible 10/10

Après les n°1 à n°16 : durée honnête (7 → 10), titre et scène de l'étape 6 cohérents avec le défi (8 → 10), un seul personnage (7 → 10), cran social écrit dans chaque `why` et occasion créée à l'étape 5 (8 → 10), quiz sans énoncé hors sujet ni piège absent (8 → 10), fin de parcours avec sa raison de suite (8 → 10), scène la plus longue réduite (8 → 9,5). Reste hors périmètre : la durée mesurée en production (n°16) et la relecture des 16 vannes.

---

**Handoff → @orchestrator** (puis @copywriter pour les textes, @fullstack pour le n°3, @data-analyst pour le n°16)
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/etapes-iter-1-ux.md`. Aucun autre fichier modifié.
- Note : 8/10. Bloquants : 3 (n°1 durée de l'étape 6, n°2 scène et défi de l'étape 6, n°3 rendu des sauts de ligne côté code). Non bloquants : 13.
- Décisions prises : la tâche dite quatre fois (`why`, scène, conseil, défi) est le gabarit validé, non remis en cause ; correction par les champs non validés (`why`, `moduleDetail`, `dureeTexte`, `retourExerciceNote`, énoncés et explications de quiz) ; aucun conseil, défi, titre ni vanne touché.
- Points d'attention : les remplacements de scène (n°2, n°8, n°11) sont des textes du site, pas des conseils relus à l'aveugle, comme les scènes actuelles ; les notes de scène (l.42, 109, 176, 243, 309) sont à aligner après remplacement ; tout comptage de mots est une estimation à plus ou moins 10 %.

